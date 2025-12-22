import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebase';
import { setUser, setLoading } from './redux/slices/authSlice';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard'



const ProtectedRoute = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) return <div className="flex h-screen w-full items-center justify-center bg-background text-primary animate-pulse">Loading Application...</div>;

  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
};
// ProtectedRoute();
function App() {
  const dispatch = useDispatch();

  useEffect(() => {

    console.log("App mounted, setting up auth listener");
    dispatch(setLoading(true));

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user ? user.email : "No user");
      if (user) {
        dispatch(setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        }));
      } else {
        dispatch(setUser(null));
      }
      dispatch(setLoading(false));
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <div className="antialiased text-text font-sans min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <Dashboard />
          }
        />

      </Routes>
    </div>
  );
}

export default App;

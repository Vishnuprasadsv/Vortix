import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) return <div className="flex h-screen w-full items-center justify-center bg-background text-primary animate-pulse">Loading Application...</div>;

  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
};
ProtectedRoute();
function App() {

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

import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProfileAPI } from './services/api';
import { setUser, setLoading } from './redux/slices/authSlice';
import { fetchPortfolioFromDB } from './redux/slices/portfolioSlice';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Market from './pages/Market';
import Portfolio from './pages/Portfolio';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) return <div className="flex h-screen w-full items-center justify-center bg-background text-primary animate-pulse">Loading Application...</div>;

  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("App mounted, setting up auth listener");
    dispatch(setLoading(true));

    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { user } = await getProfileAPI(); 
          dispatch(setUser({
            ...user,
            uid: user._id || user.uid,
            email: user.email,
            displayName: user.userName || user.displayName,
            photoURL: user.photoURL || user.avatar_url || "",
            mobile: user.mobile || "",
            agreed_to_terms: user.agreed_to_terms
          }));
          dispatch(fetchPortfolioFromDB());
        } catch (error) {
          console.error("Error hydrating profile, clearing token.", error);
          localStorage.removeItem('token');
          dispatch(setUser(null));
        }
      } else {
        dispatch(setUser(null));
      }
      dispatch(setLoading(false));
    };

    initAuth();
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
        <Route
          path="/profile"
          element={
            <Profile />
          }
        />
        <Route path="/market" element={<Market />} />
        <Route path="/portfolio" element={<Portfolio />} />
      </Routes>
    </div>
  );
}

export default App;

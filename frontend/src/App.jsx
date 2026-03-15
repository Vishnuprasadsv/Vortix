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

// Component to protect private routes
// Redirects to login page if user is not authenticated
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) return <div className="flex h-screen w-full items-center justify-center bg-background text-primary animate-pulse">Loading Application...</div>;

  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
};

// Main App Component containing routes
function App() {
  const dispatch = useDispatch();

  // Run on component mount to check if user is already logged in
  useEffect(() => {
    console.log("App mounted, setting up auth listener");
    dispatch(setLoading(true));

    const initAuth = async () => {
      // Check for saved token in local storage
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Fetch user profile from backend using the token
          const { user } = await getProfileAPI(); 
          // Update Redux state with user data
          dispatch(setUser({
            ...user,
            uid: user._id || user.uid,
            email: user.email,
            displayName: user.userName || user.displayName,
            photoURL: user.photoURL || user.avatar_url || "",
            mobile: user.mobile || "",
            agreed_to_terms: user.agreed_to_terms
          }));
          // Fetch user's crypto portfolio
          dispatch(fetchPortfolioFromDB());
        } catch (error) {
          console.error("Error hydrating profile, clearing token.", error);
          // If token is invalid, remove it and log out
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

  // Application routing wrapper
  return (
    <div className="antialiased text-text font-sans min-h-screen bg-background">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Additional application routes */}
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
        {/* Feature Routes */}
        <Route path="/market" element={<Market />} />
        <Route path="/portfolio" element={<Portfolio />} />
      </Routes>
    </div>
  );
}

export default App;

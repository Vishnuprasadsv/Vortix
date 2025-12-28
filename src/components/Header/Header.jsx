import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { supabase } from "../../services/supabase";
import { FaRobot, FaUserCircle } from "react-icons/fa";
import { Menu, X } from "lucide-react";
import VortixAIChat from "../VortixAIChat";

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      dispatch(logout());
      navigate("/");
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const navLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Market", path: "/market" },
    { name: "Portfolio", path: "/portfolio" },
  ];

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleChat = () => setIsChatOpen(!isChatOpen);

  return (
    <>
      <header className="bg-surface border-b border-gray-800 h-16 flex items-center justify-between px-6 sticky top-0 z-[100]">
        <div className="flex items-center gap-2 z-50">
          <img
            src="/logo.png"
            alt="Vortix Logo"
            className="w-8 h-8 object-contain"
          />
          <Link
            to="/dashboard"
            className="text-xl font-bold text-[#FF5F1F] tracking-wide animate-pulse shadow-orange-500/50 drop-shadow-md"
          >
            VORTIX
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-medium transition-colors   hover:text-primary ${
                location.pathname === link.path
                  ? "text-primary drop-shadow-[0_0_8px_rgba(255,95,31,0.8)]"
                  : "text-text-muted"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={toggleChat}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all text-sm font-medium cursor-pointer ${
              isChatOpen
                ? "bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/30"
                : "border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
            }`}
          >
            <FaRobot />
            <span>Ask VortexAI</span>
          </button>

          <div className="w-px h-6 bg-gray-800"></div>

          <Link to="/profile" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-700 hover:border-primary transition-colors">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUserCircle className="text-gray-400 w-full h-full p-1" />
              )}
            </div>
          </Link>
        </div>

        <button
          className="md:hidden text-text-muted hover:text-white z-50 cursor-pointer"
          onClick={toggleMenu}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-40 md:hidden flex flex-col pt-20 px-6">
            <nav className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-xl font-medium transition-colors ${
                    location.pathname === link.path
                      ? "text-primary drop-shadow-[0_0_8px_rgba(255,95,31,0.8)]"
                      : "text-text-muted"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <div className="h-px bg-gray-800 my-2"></div>

              <div className="flex items-center gap-4 mt-4">
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-700">
                    {user?.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUserCircle className="text-gray-400 w-full h-full p-1" />
                    )}
                  </div>
                  <span className="text-white text-lg">
                    {user?.displayName || "User"}
                  </span>
                </Link>
              </div>

              <button
                onClick={handleLogout}
                className="mt-4 px-4 py-2 text-center rounded-lg border border-red-500/50 text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                Logout
              </button>
            </nav>
          </div>
        )}
      </header>

      {["/dashboard", "/market"].includes(location.pathname) && !isChatOpen && (
        <div className="md:hidden fixed inset-x-0 bottom-0 z-[90] pointer-events-none flex justify-end px-6 pb-6 mx-auto max-w-7xl w-full">
          <button
            onClick={toggleChat}
            className="pointer-events-auto w-14 h-14 rounded-full bg-[#FF5F1F] text-white flex items-center justify-center shadow-[0_0_20px_rgba(255,95,31,0.6)] hover:shadow-[0_0_30px_rgba(255,95,31,0.8)] hover:scale-110 transition-all duration-300 cursor-pointer"
            aria-label="Ask Vortix AI"
          >
            <FaRobot size={24} />
          </button>
        </div>
      )}

      <VortixAIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
};

export default Header;

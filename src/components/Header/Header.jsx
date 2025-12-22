import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { auth } from '../../services/firebase';
import { FaRobot, FaUserCircle } from 'react-icons/fa';
import { Menu, X } from 'lucide-react';

const Header = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            dispatch(logout());
            navigate('/');
            setIsMobileMenuOpen(false);
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const navLinks = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Market', path: '/market' },
        { name: 'Portfolio', path: '/portfolio' },
    ];

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <header className="bg-surface border-b border-gray-800 h-16 flex items-center justify-between px-6 sticky top-0 z-50">
            {/* Logo */}
            <div className="flex items-center gap-2 z-50">
                <img src="/logo.png" alt="Vortix Logo" className="w-8 h-8 object-contain" />
                <Link to="/dashboard" className="text-xl font-bold text-primary tracking-wide animate-pulse shadow-orange-500/50 drop-shadow-md">
                    VORTIX
                </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => (
                    <Link
                        key={link.name}
                        to={link.path}
                        className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === link.path ? 'text-primary' : 'text-text-muted'
                            }`}
                    >
                        {link.name}
                    </Link>
                ))}
            </nav>

            {/* Desktop Right Side Actions */}
            <div className="hidden md:flex items-center gap-4">
                {/* Ask VortexAI Button */}
                <button className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/50 text-orange-500 hover:bg-orange-500/10 transition-colors text-sm font-medium cursor-pointer">
                    <FaRobot />
                    <span>Ask VortexAI</span>
                </button>

                <div className="w-px h-6 bg-gray-800"></div>

                {/* Profile */}
                <Link to="/profile" className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-700 hover:border-primary transition-colors">
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <FaUserCircle className="text-gray-400 w-full h-full p-1" />
                        )}
                    </div>
                </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
                className="md:hidden text-text-muted hover:text-white z-50 cursor-pointer"
                onClick={toggleMenu}
            >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-40 md:hidden flex flex-col pt-20 px-6">
                    <nav className="flex flex-col gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`text-xl font-medium transition-colors ${location.pathname === link.path ? 'text-primary' : 'text-text-muted'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        <div className="h-px bg-gray-800 my-2"></div>

                        <button className="flex items-center gap-3 text-orange-500 font-medium text-lg cursor-pointer">
                            <FaRobot />
                            <span>Ask VortexAI</span>
                        </button>

                        <div className="flex items-center gap-4 mt-4">
                            <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-700">
                                    {user?.photoURL ? (
                                        <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <FaUserCircle className="text-gray-400 w-full h-full p-1" />
                                    )}
                                </div>
                                <span className="text-white text-lg">{user?.displayName || 'User'}</span>
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
    );
};

export default Header;

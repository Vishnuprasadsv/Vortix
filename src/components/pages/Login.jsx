import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import { setUser, setError } from '../redux/slices/authSlice';
import Button from '../components/Button';
import Input from '../components/Input';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [localError, setLocalError] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setLocalError('');

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            dispatch(setUser({
                uid: userCredential.user.uid,
                email: userCredential.user.email,
                displayName: userCredential.user.displayName,
                photoURL: userCredential.user.photoURL,
            }));
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            setLocalError('Invalid email or password');
            dispatch(setError(error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
            {/* Pulse Background Animation */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary/10 via-background to-background animate-pulse-slow pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface border border-primary/50 p-8 rounded-2xl w-full max-w-md shadow-[0_0_30px_rgba(255,95,31,0.3)] relative z-10"
            >
                <h2 className="text-3xl font-bold text-primary mb-2 text-center animate-pulse">Vortix</h2>
                <p className="text-text-muted text-center mb-8">Welcome back! Please login to your account.</p>

                <form onSubmit={handleLogin} className="space-y-6">
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {localError && <p className="text-red-500 text-sm text-center">{localError}</p>}

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-text-muted">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-primary hover:underline">
                        Create Account
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;

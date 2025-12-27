import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Toggle from '../components/Toggle';
import { FaUser, FaEnvelope, FaPhone, FaShieldAlt, FaSignOutAlt, FaEdit, FaLock, FaSave, FaTimes, FaCamera, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { supabase } from '../services/supabase';
import { logout, setUser } from '../redux/slices/authSlice';

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [twoFactor, setTwoFactor] = useState(false);

    const [show2FAModal, setShow2FAModal] = useState(false);
    const [otpStep, setOtpStep] = useState('request'); 
    const [otpInput, setOtpInput] = useState('');

    const [isEditing, setIsEditing] = useState(false);
    const [editEmail, setEditEmail] = useState('');
    const [editMobile, setEditMobile] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [statusPopup, setStatusPopup] = useState({ show: false, type: '', message: '' });

    const handleChangePassword = async () => {
        if (!newPassword || !confirmNewPassword || !currentPassword) {
            setStatusPopup({ show: true, type: 'error', message: "All fields are required" });
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setStatusPopup({ show: true, type: 'error', message: "New passwords do not match" });
            return;
        }

        if (newPassword.length < 6) {
            setStatusPopup({ show: true, type: 'error', message: "Password must be at least 6 characters" });
            return;
        }

        setLoading(true);
        try {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: user.email,
                password: currentPassword,
            });

            if (signInError) {
                setLoading(false);
                setStatusPopup({ show: true, type: 'error', message: "Incorrect current password" });
                return;
            }

            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (updateError) throw updateError;

            setShowPasswordModal(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            setStatusPopup({ show: true, type: 'success', message: "Password updated successfully!" });
        } catch (error) {
            console.error("Password Update Error:", error);
            setStatusPopup({ show: true, type: 'error', message: "Failed to update password: " + error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleTwoFactorToggle = (enable) => {
        if (!enable) {
            setTwoFactor(false);
            return;
        }
        setOtpStep('request');
        setOtpInput('');
        setShow2FAModal(true);
    };

    const handleSendOTP = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setOtpStep('verify');
            setStatusPopup({ show: true, type: 'success', message: "OTP sent successfully! (Mock)", theme: 'neon' });
        }, 1500);
    };

    const handleVerifyOTP = () => {
        if (otpInput.length === 6) {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                setTwoFactor(true);
                setShow2FAModal(false);
                setStatusPopup({ show: true, type: 'success', message: "2FA Enabled Successfully! (Mock)", theme: 'neon' });
            }, 1500);
        } else {
            setStatusPopup({ show: true, type: 'error', message: "Please enter a valid 6-digit OTP" });
        }
    };

    const { user } = useSelector((state) => state.auth);
    const { totalBalance } = useSelector((state) => state.portfolio);

    useEffect(() => {
        if (user) {
            setEditEmail(user.email || '');
            setEditMobile(user.mobile || '');
        }
    }, [user]);

    const accountType = totalBalance > 10000000 ? 'Pro' : 'Base'; 

    const displayUser = {
        name: user?.displayName || 'Guest User',
        handle: user?.displayName ? `@${user.displayName}` : '@Guest',
        role: totalBalance > 10000000 ? 'Pro Crypto Investor' : 'Crypto Enthusiast',
        email: user?.email || 'N/A',
        phone: user?.mobile || 'N/A',
        accountType: accountType,
    };

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            dispatch(logout());
            navigate('/');
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    const handleSaveChanges = async () => {
        if (!user) return;
        setLoading(true);

        try {
            if (editEmail !== user.email) {
                const { error } = await supabase.auth.updateUser({ email: editEmail });
                if (error) throw error;
            }

            const { error: dbError } = await supabase
                .from('users')
                .update({
                    mobile: editMobile,
                    email: editEmail
                })
                .eq('id', user.uid);

            if (dbError) throw dbError;

            dispatch(setUser({
                ...user,
                email: editEmail,
                mobile: editMobile
            }));

            setIsEditing(false);
            setLoading(false);
        } catch (error) {
            console.error("Update Error:", error);
            alert("Failed to update profile: " + error.message);
            setLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!user) {
            alert("User not found. Please log in again.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("File size too large. Please specify a file smaller than 5MB.");
            return;
        }

        setUploading(true);
        console.log("Starting upload...", file.name);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.uid}_${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            console.log("File available at", publicUrl);

            const { error: dbError } = await supabase
                .from('users')
                .update({ avatar_url: publicUrl }) 
                .eq('id', user.uid);

            if (dbError) throw dbError;

            dispatch(setUser({ ...user, photoURL: publicUrl }));

            console.log("Image upload flow completed successfully");
            setStatusPopup({ show: true, type: 'success', message: "Profile image updated successfully!", theme: 'neon' });
            setUploading(false);

        } catch (error) {
            console.error("Upload/Update Error:", error);
            alert(`Failed to upload image: ${error.message}`);
            setUploading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto space-y-6">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#0F1114] border border-gray-800 rounded-2xl p-8 md:p-12 text-center"
                >
                    <div className="flex justify-center mb-6">
                        <div className="relative group cursor-pointer">
                            <label htmlFor="profile-upload" className="cursor-pointer">
                                <div className="w-24 h-24 rounded-full bg-[#1A1D21] flex items-center justify-center border-4 border-[#0F1114] shadow-xl overflow-hidden relative">
                                    {uploading ? (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    ) : (
                                        <>
                                            {user?.photoURL ? (
                                                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <FaUser className="text-gray-400 text-3xl" />
                                            )}
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                                                <FaCamera className="text-white text-xl" />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </label>
                            <input
                                id="profile-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                                disabled={uploading}
                            />
                        </div>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-1">{displayUser.name}</h1>
                        <p className="text-primary font-bold mb-2">{displayUser.handle}</p>
                        <p className="text-gray-500 text-sm">{displayUser.role}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-left">
                        <div className="bg-[#1A1D21] border border-gray-800 rounded-xl p-5">
                            <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase mb-2">
                                <FaEnvelope className="text-primary" />
                                Email Address
                            </div>
                            {isEditing ? (
                                <input
                                    type="email"
                                    value={editEmail}
                                    onChange={(e) => setEditEmail(e.target.value)}
                                    className="w-full bg-[#0F1114] border border-gray-700 rounded px-3 py-2 text-white focus:border-primary outline-none"
                                />
                            ) : (
                                <div className="text-white font-bold">{displayUser.email}</div>
                            )}
                        </div>
                        <div className="bg-[#1A1D21] border border-gray-800 rounded-xl p-5">
                            <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase mb-2">
                                <FaPhone className="text-primary" />
                                Mobile Number
                            </div>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    value={editMobile}
                                    onChange={(e) => setEditMobile(e.target.value)}
                                    className="w-full bg-[#0F1114] border border-gray-700 rounded px-3 py-2 text-white focus:border-primary outline-none"
                                />
                            ) : (
                                <div className="text-white font-bold">{displayUser.phone}</div>
                            )}
                        </div>
                    </div>

                    <div className="bg-[#1A1D21] border border-gray-800 rounded-xl p-5 text-left mb-8">
                        <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase mb-2">
                            <FaShieldAlt className="text-primary" />
                            Account Type
                        </div>
                        <div className="text-white font-bold">{displayUser.accountType}</div>
                    </div>

                    <div className="w-full h-px bg-gray-800/50 mb-8"></div>
                    <div className="flex flex-col sm:flex-row justify-end gap-4">
                        {!isEditing ? (
                            <>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-gray-700 text-red-500 hover:bg-red-500/10 transition-colors font-medium cursor-pointer"
                                >
                                    <FaSignOutAlt />
                                    Sign Out
                                </button>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-white hover:bg-orange-600 transition-colors font-medium shadow-lg shadow-primary/20 cursor-pointer"
                                >
                                    <FaEdit />
                                    Edit Profile
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditEmail(user?.email || '');
                                        setEditMobile(user?.mobile || '');
                                    }}
                                    disabled={loading}
                                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-gray-700 text-gray-400 hover:bg-white/5 transition-colors font-medium cursor-pointer"
                                >
                                    <FaTimes />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveChanges}
                                    disabled={loading}
                                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors font-medium shadow-lg shadow-green-600/20 cursor-pointer disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <FaSave />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </>
                        )}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-[#0F1114] border border-gray-800 rounded-2xl p-8"
                >
                    <h3 className="text-xl font-bold text-white mb-6">Security Settings</h3>

                    <div className="space-y-4">
                        <div className="bg-[#1A1D21] border border-gray-800 rounded-xl p-5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400">
                                    <FaLock />
                                </div>
                                <div>
                                    <div className="text-white font-bold text-sm">Two-Factor Authentication</div>
                                    <div className="text-gray-500 text-xs">Add an extra layer of security</div>
                                </div>
                            </div>
                            <Toggle enabled={twoFactor} onChange={handleTwoFactorToggle} />
                        </div>

                        <div className="bg-[#1A1D21] border border-gray-800 rounded-xl p-5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400">
                                    <FaLock />
                                </div>
                                <div>
                                    <div className="text-white font-bold text-sm">Password</div>
                                    <div className="text-gray-500 text-xs">Update your account password</div>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowPasswordModal(true)}
                                className="px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm rounded-lg bg-white/5 hover:bg-white/10 border border-gray-700 text-white font-medium transition-colors cursor-pointer"
                            >
                                Change Password
                            </button>
                        </div>
                    </div>
                </motion.div>

                {show2FAModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-[#0F1114] border border-gray-800 rounded-2xl p-8 max-w-sm w-full shadow-2xl relative"
                        >
                            <button
                                onClick={() => setShow2FAModal(false)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors cursor-pointer"
                            >
                                <FaTimes />
                            </button>

                            <div className="text-center mb-6">
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                    <FaShieldAlt className="text-primary text-2xl" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">
                                    {otpStep === 'request' ? 'Enable 2FA' : 'Verify OTP'}
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    {otpStep === 'request'
                                        ? `Send a One-Time Password to your registered mobile ending in ${user?.mobile?.slice(-4) || '****'}?`
                                        : 'Enter the 6-digit code sent to your mobile.'}
                                </p>
                            </div>

                            {otpStep === 'request' ? (
                                <button
                                    onClick={handleSendOTP}
                                    disabled={loading}
                                    className="w-full py-3 bg-primary rounded-lg text-white font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-primary/20 flex items-center justify-center cursor-pointer disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        'Proceed'
                                    )}
                                </button>
                            ) : (
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        maxLength="6"
                                        placeholder="000000"
                                        value={otpInput}
                                        onChange={(e) => setOtpInput(e.target.value.replace(/[^0-9]/g, ''))}
                                        className="w-full bg-[#1A1D21] border border-gray-700 rounded-lg py-3 px-4 text-center text-xl font-bold text-white tracking-widest focus:border-primary outline-none"
                                    />
                                    <button
                                        onClick={handleVerifyOTP}
                                        disabled={loading || otpInput.length !== 6}
                                        className="w-full py-3 bg-green-600 rounded-lg text-white font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20 flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            'Enable 2FA'
                                        )}
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}

                {showPasswordModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-[#0F1114] border border-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl relative"
                        >
                            <button
                                onClick={() => {
                                    setShowPasswordModal(false);
                                    setCurrentPassword('');
                                    setNewPassword('');
                                    setConfirmNewPassword('');
                                }}
                                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors cursor-pointer"
                            >
                                <FaTimes />
                            </button>

                            <h3 className="text-xl font-bold text-white mb-6">Change Password</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Current Password</label>
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="w-full bg-[#1A1D21] border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary outline-none"
                                        placeholder="Enter current password"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">New Password</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full bg-[#1A1D21] border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary outline-none"
                                        placeholder="Enter new password"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={confirmNewPassword}
                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                        className="w-full bg-[#1A1D21] border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary outline-none"
                                        placeholder="Confirm new password"
                                    />
                                </div>

                                <button
                                    onClick={handleChangePassword}
                                    disabled={loading || !currentPassword || !newPassword || !confirmNewPassword}
                                    className="w-full mt-4 py-3 bg-primary rounded-lg text-white font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-primary/20 flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        'Update Password'
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
                {statusPopup.show && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-[#0F1114] border border-gray-800 rounded-2xl p-8 max-w-sm w-full shadow-2xl relative text-center"
                        >
                            <div className="flex justify-center mb-4">
                                {statusPopup.theme === 'neon' ? (
                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary">
                                        <FaCheckCircle className="text-primary text-3xl" />
                                    </div>
                                ) : statusPopup.type === 'success' ? (
                                    <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center border-2 border-green-500">
                                        <FaCheckCircle className="text-green-500 text-3xl" />
                                    </div>
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center border-2 border-red-500">
                                        <FaTimesCircle className="text-red-500 text-3xl" />
                                    </div>
                                )}
                            </div>

                            <h3 className={`text-xl font-bold mb-2 ${statusPopup.theme === 'neon' ? 'text-primary' :
                                statusPopup.type === 'success' ? 'text-green-500' : 'text-red-500'
                                }`}>
                                {statusPopup.type === 'success' ? 'Success!' : 'Error'}
                            </h3>

                            <p className="text-gray-300 mb-6">{statusPopup.message}</p>

                            <button
                                onClick={() => setStatusPopup({ ...statusPopup, show: false })}
                                className={`px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer border ${statusPopup.theme === 'neon'
                                    ? 'bg-primary hover:bg-orange-600 text-white border-primary shadow-lg shadow-primary/20'
                                    : 'bg-gray-800 hover:bg-gray-700 text-white border-gray-700'
                                    }`}
                            >
                                {statusPopup.theme === 'neon' ? 'OK' : 'Close'}
                            </button>
                        </motion.div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Profile;

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { withdrawFunds } from '../redux/slices/portfolioSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCheckCircle, FaUniversity, FaMobileAlt, FaArrowLeft } from 'react-icons/fa';

const WithdrawModal = ({ isOpen, onClose, totalBalance }) => {
    const [step, setStep] = useState(1);
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('bank');
    const [isProcessing, setIsProcessing] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setAmount(totalBalance); 
            setIsProcessing(false);
        }
    }, [isOpen]); 

    if (!isOpen) return null;

    const handleNextStep = () => {
        if (step === 2) {
            if (amount <= 0 || amount > totalBalance) {
                alert("Invalid amount");
                return;
            }
        }
        setStep(step + 1);
    };

    const handleBackData = () => {
        setStep(step - 1);
    }

    const handleWithdraw = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            dispatch(withdrawFunds(Number(amount)));
            setStep(4);
        }, 2000);
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-[#1E2329] rounded-xl border border-gray-800 w-full max-w-md overflow-hidden shadow-2xl"
                >
                    <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#0F1114]">
                        <div className="flex items-center gap-2">
                            {step > 1 && (
                                <button onClick={handleBackData} className="text-gray-400 hover:text-white mr-2">
                                    <FaArrowLeft />
                                </button>
                            )}
                            <h3 className="text-lg font-bold text-white">Withdraw Funds</h3>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                            <FaTimes />
                        </button>
                    </div>

                    <div className="p-6">
                        {step === 1 && (
                            <div className="text-center space-y-6">
                                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto text-blue-500 text-3xl">
                                    <FaUniversity />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-white mb-2">Initiate Withdrawal</h4>
                                    <p className="text-gray-400 mb-2">Do you want to withdraw funds?</p>
                                    <p className="text-yellow-500/80 text-xs bg-yellow-500/10 p-2 rounded border border-yellow-500/20">
                                        Note: Payment will take 3 bank working days to get it in the account.
                                    </p>
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        onClick={onClose}
                                        className="flex-1 px-4 py-3 rounded-lg border border-gray-700 text-gray-300 hover:bg-white/5 font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleNextStep}
                                        className="flex-1 px-4 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-bold transition-colors shadow-lg shadow-green-500/20"
                                    >
                                        Accept
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs uppercase text-gray-500 font-bold mb-2">Withdrawal Amount (USD)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="w-full bg-[#0F1114] border border-gray-700 rounded-lg py-4 pl-8 pr-4 text-white font-bold text-xl focus:outline-none focus:border-green-500 transition-colors"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="mt-2 text-right text-xs text-gray-400">
                                        Available Balance: <span className="text-white font-medium">${totalBalance.toLocaleString()}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleNextStep}
                                    disabled={amount <= 0 || amount > totalBalance}
                                    className="w-full py-4 rounded-lg bg-green-500 hover:bg-green-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold text-lg transition-all shadow-lg shadow-green-500/20"
                                >
                                    Next
                                </button>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6">
                                <div className="flex bg-[#0F1114] p-1 rounded-lg border border-gray-800">
                                    <button
                                        onClick={() => setPaymentMethod('bank')}
                                        className={`flex-1 py-2 rounded-md text-sm font-bold flex items-center justify-center gap-2 transition-all ${paymentMethod === 'bank' ? 'bg-[#1E2329] text-white shadow-sm border border-gray-700' : 'text-gray-500 hover:text-gray-300'}`}
                                    >
                                        <FaUniversity /> Bank Transfer
                                    </button>
                                    <button
                                        onClick={() => setPaymentMethod('upi')}
                                        className={`flex-1 py-2 rounded-md text-sm font-bold flex items-center justify-center gap-2 transition-all ${paymentMethod === 'upi' ? 'bg-[#1E2329] text-white shadow-sm border border-gray-700' : 'text-gray-500 hover:text-gray-300'}`}
                                    >
                                        <FaMobileAlt /> UPI
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {paymentMethod === 'bank' ? (
                                        <>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Account Holder Name</label>
                                                <input type="text" className="w-full bg-[#0F1114] border border-gray-800 rounded px-3 py-2 text-white focus:border-gray-600 outline-none" placeholder="John Doe" />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Account Number</label>
                                                <input type="text" className="w-full bg-[#0F1114] border border-gray-800 rounded px-3 py-2 text-white focus:border-gray-600 outline-none" placeholder="1234567890" />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">IFSC Code</label>
                                                <input type="text" className="w-full bg-[#0F1114] border border-gray-800 rounded px-3 py-2 text-white focus:border-gray-600 outline-none" placeholder="ABCD0123456" />
                                            </div>
                                        </>
                                    ) : (
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">UPI ID</label>
                                            <input type="text" className="w-full bg-[#0F1114] border border-gray-800 rounded px-3 py-2 text-white focus:border-gray-600 outline-none" placeholder="username@upi" />
                                        </div>
                                    )}
                                </div>

                                <div className="pt-2">
                                    <div className="flex justify-between text-sm text-gray-400 mb-4 px-1">
                                        <span>Withdraw Amount</span>
                                        <span className="text-white font-bold">${Number(amount).toLocaleString()}</span>
                                    </div>
                                    <button
                                        onClick={handleWithdraw}
                                        disabled={isProcessing}
                                        className="w-full py-4 rounded-lg bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-bold text-lg transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"
                                    >
                                        {isProcessing ? 'Processing...' : 'Proceed to Withdraw'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="text-center space-y-6 py-4">
                                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-500 text-4xl shadow-lg shadow-green-500/20">
                                    <FaCheckCircle />
                                </div>
                                <div>
                                    <h4 className="text-2xl font-bold text-white mb-2">Payment Initiated!</h4>
                                    <p className="text-gray-400 mb-4">
                                        Your withdrawal request of <span className="text-white font-bold">${Number(amount).toLocaleString()}</span> has been processed.
                                    </p>
                                    <p className="text-sm text-gray-500 bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                                        It will take <span className="text-white font-bold">3 bank working days</span> to get the amount in your account.
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-full py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-bold transition-all shadow-lg shadow-green-500/20"
                                >
                                    OK
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div >
        </AnimatePresence >
    );
};

export default WithdrawModal;

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaPaperPlane, FaTimes, FaUser, FaLightbulb } from 'react-icons/fa';
import { getGeminiResponse } from '../services/gemini';
import { useSelector } from 'react-redux';

const PRE_QUESTIONS = [
    "What is the best crypto to buy?",
    "Explain Bitcoin vs Ethereum",
    "Current market trends regarding solana?",
    "How to diversify my portfolio?"
];

const VortixAIChat = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I'm VortixAI. Ask me anything about crypto or your portfolio!", sender: 'ai' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const { data: marketCoins } = useSelector((state) => state.market);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (text = input) => {
        if (!text.trim()) return;

        const userMsg = { id: Date.now(), text: text, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
   
            const safeCoins = Array.isArray(marketCoins) ? marketCoins : [];
            const contextData = safeCoins.slice(0, 20).map(c =>
                `${c.name} (${c.symbol}): Price $${c.current_price}, 24h Change ${c.price_change_percentage_24h}%, Mkt Cap $${c.market_cap}`
            ).join('\n');

            const aiResponseText = await getGeminiResponse(text, contextData);

            const aiMsg = { id: Date.now() + 1, text: aiResponseText, sender: 'ai' };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            const errorMsg = { id: Date.now() + 1, text: error.message || "Sorry, I encountered an error connecting to the AI neural network. Please check your connection or API key.", sender: 'ai', isError: true };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                className="fixed bottom-24 right-6 z-[100] w-96 h-[600px] bg-[#0F0F0F] rounded-2xl border border-orange-500/50 shadow-[0_0_20px_rgba(255,95,31,0.3)] flex flex-col overflow-hidden backdrop-blur-md"
            >
                <div className="p-4 bg-gradient-to-r from-orange-600/20 to-transparent border-b border-orange-500/30 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/50 shadow-[0_0_10px_rgba(255,95,31,0.4)]">
                            <FaRobot className="text-orange-500 text-xl" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-lg tracking-wide drop-shadow-[0_0_5px_rgba(255,95,31,0.5)]">VortixAI</h3>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="text-xs text-orange-200/70">Online & Ready</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <FaTimes />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/20">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${msg.sender === 'user'
                                    ? 'bg-orange-600 text-white rounded-tr-none shadow-lg'
                                    : 'bg-[#1E1E1E] text-gray-200 border border-gray-800 rounded-tl-none shadow-md'
                                    } ${msg.isError ? 'border-red-500 text-red-200' : ''}`}
                            >
                                {msg.sender === 'ai' && !msg.isError && (
                                    <div className="flex items-center gap-2 mb-1 text-orange-500/70 text-xs font-bold uppercase tracking-wider">
                                        <FaRobot size={10} /> Vortix AI
                                    </div>
                                )}
                                <div className="whitespace-pre-wrap">{msg.text}</div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-[#1E1E1E] p-4 rounded-2xl rounded-tl-none border border-gray-800 flex gap-2 items-center">
                                <div className="w-2 h-2 bg-orange-500/50 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                <div className="w-2 h-2 bg-orange-500/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 bg-orange-500/50 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {messages.length === 1 && (
                    <div className="px-4 pb-2">
                        <p className="text-xs text-gray-500 mb-2 flex items-center gap-1"><FaLightbulb className="text-yellow-500" /> Suggested Questions</p>
                        <div className="flex flex-wrap gap-2">
                            {PRE_QUESTIONS.map((q, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSend(q)}
                                    className="text-xs bg-[#1E1E1E] hover:bg-orange-500/20 hover:text-orange-400 border border-gray-700 hover:border-orange-500/50 rounded-full px-3 py-1.5 transition-all text-gray-400"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="p-4 bg-[#0F0F0F] border-t border-gray-800">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSend();
                        }}
                        className="flex items-center gap-2 relative"
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about crypto..."
                            disabled={isLoading}
                            className="w-full bg-[#1A1A1A] text-white rounded-xl py-3 pl-4 pr-12 border border-gray-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all placeholder-gray-500 shadow-inner"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="absolute right-2 p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg disabled:opacity-50 disabled:bg-gray-700 transition-colors shadow-lg shadow-orange-500/20"
                        >
                            <FaPaperPlane size={14} />
                        </button>
                    </form>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default VortixAIChat;

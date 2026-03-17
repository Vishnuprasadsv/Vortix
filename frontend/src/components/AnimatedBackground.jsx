import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// SVG components for crypto coins and graphs
const BitcoinIcon = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M14.65 11.45c1.45-.63 2.15-1.95 2.15-3.4 0-2.35-1.55-3.55-4.2-3.55H9.4V1h-2v3.5H5.8v2h1.6v11H5.8v2h1.6V23h2v-3.5h3.6c3.15 0 4.9-1.6 4.9-4.2 0-1.85-1.1-3.25-2.65-3.85zm-3.25-4.9h1.7c1.1 0 1.8.6 1.8 1.6 0 1.05-.7 1.65-1.8 1.65h-1.7V6.55zm1.7 9h-1.7v-3.6h1.7c1.35 0 2.2.65 2.2 1.8 0 1.15-.85 1.8-2.2 1.8z" />
    </svg>
);

const EthereumIcon = ({ className }) => (
    <svg viewBox="0 0 32 32" fill="currentColor" className={className}>
        <path d="M15.93 23.97l-9.82-5.78 9.82 13.81 9.87-13.81-9.87 5.78z" opacity=".5" />
        <path d="M15.93 0l-9.82 16.32 9.82 5.78 9.87-5.78z" />
    </svg>
);

const GraphIcon = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
        <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
);

const NeonNode = ({ className }) => (
    <svg viewBox="0 0 100 100" className={className}>
        <circle cx="50" cy="50" r="20" fill="currentColor" />
        <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="10 10" className="origin-center animate-[spin_10s_linear_infinite]" />
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" opacity="0.6" className="origin-center animate-[spin_15s_linear_infinite_reverse]" />
    </svg>
);

const AnimatedBackground = () => {
    // Advanced framer motion setup for smooth interactive cursor following
    const mouseX = useMotionValue(-1000); // Start far offscreen
    const mouseY = useMotionValue(-1000);

    // Provide a smooth trailing spring effect to the cursor
    const smoothX = useSpring(mouseX, { damping: 40, stiffness: 200 });
    const smoothY = useSpring(mouseY, { damping: 40, stiffness: 200 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            // Offset by half the glow width/height (200px) to center it on the cursor
            mouseX.set(e.clientX - 200); 
            mouseY.set(e.clientY - 200);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Base gradient */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary/10 via-background to-background animate-pulse-slow"></div>

            {/* Interactive Cursor Follower Glow */}
            <motion.div
                className="fixed top-0 left-0 w-[400px] h-[400px] bg-primary/40 rounded-full mix-blend-screen pointer-events-none z-10"
                style={{
                    x: smoothX,
                    y: smoothY,
                    filter: 'blur(120px)'
                }}
            />

            {/* Neon Glowing Orbs Background Layer */}
            <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen">
                <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/30 rounded-full blur-[120px]"
                ></motion.div>
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-blue-500/30 rounded-full blur-[100px]"
                ></motion.div>
                <motion.div
                    animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 5 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-500/20 rounded-full blur-[90px]"
                ></motion.div>
            </div>

            {/* Blurred floating elements */}
            <div className="absolute inset-0 opacity-20 filter blur-xl">
                {/* Floating objects wrapper */}

                {/* Bitcoin 1 */}
                <motion.div
                    animate={{
                        y: ["0%", "-20%", "0%"],
                        x: ["0%", "5%", "0%"],
                        rotate: [0, 45, 0]
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-1/4 left-1/4 text-primary w-64 h-64"
                >
                    <BitcoinIcon className="w-full h-full" />
                </motion.div>

                {/* Ethereum 1 */}
                <motion.div
                    animate={{
                        y: ["0%", "15%", "0%"],
                        x: ["0%", "-10%", "0%"],
                        rotate: [0, -30, 0]
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                    className="absolute bottom-1/4 right-1/4 text-gray-400 w-56 h-56"
                >
                    <EthereumIcon className="w-full h-full" />
                </motion.div>

                {/* Graph 1 */}
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        y: ["0%", "-10%", "0%"],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                    className="absolute top-1/3 right-1/4 text-primary w-72 h-72"
                >
                    <GraphIcon className="w-full h-full opacity-50" />
                </motion.div>

                {/* Graph 2 / generic shapes */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        x: ["0%", "15%", "0%"],
                        opacity: [0.2, 0.5, 0.2]
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 5
                    }}
                    className="absolute bottom-1/3 left-1/4 text-primary w-80 h-80"
                >
                    <GraphIcon className="w-full h-full opacity-40" />
                </motion.div>

                {/* Small floating coins */}
                <motion.div
                    animate={{ y: ["0%", "-50%", "0%"], rotate: [0, 90, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/2 left-1/2 text-primary w-24 h-24"
                >
                    <BitcoinIcon className="w-full h-full" />
                </motion.div>

                {/* Neon Nodes */}
                <motion.div
                    animate={{ scale: [1, 1.2, 1], y: ["0%", "20%", "0%"] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 right-1/3 text-blue-400 w-48 h-48 drop-shadow-[0_0_20px_rgba(59,130,246,0.9)]"
                >
                    <NeonNode className="w-full h-full" />
                </motion.div>

                <motion.div
                    animate={{ scale: [1, 1.3, 1], x: ["0%", "-20%", "0%"] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 3 }}
                    className="absolute bottom-1/4 left-1/3 text-purple-500 w-56 h-56 drop-shadow-[0_0_20px_rgba(168,85,247,0.9)]"
                >
                    <NeonNode className="w-full h-full" />
                </motion.div>

                <motion.div
                    animate={{ y: ["0%", "30%", "0%"], x: ["0%", "10%", "0%"], rotate: [0, 90, 0] }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute top-2/3 right-1/4 text-primary w-32 h-32 drop-shadow-[0_0_20px_rgba(255,95,31,0.9)]"
                >
                    <NeonNode className="w-full h-full" />
                </motion.div>
            </div>

            {/* Added an extra overlay to ensure the forms maintain readability even if animations pass behind */}
            <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px]"></div>
        </div>
    );
};

export default AnimatedBackground;

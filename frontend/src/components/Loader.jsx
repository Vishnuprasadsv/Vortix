import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ fullScreen = true }) => {
    const containerClasses = fullScreen
        ? "fixed inset-0 flex items-center justify-center bg-[#0F1114] z-50"
        : "flex items-center justify-center p-8";

    return (
        <div className={containerClasses}>
            <div className="relative flex items-center justify-center">
                {/* Outer rotating circle - spins clockwise */}
                <motion.div
                    className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />

                {/* Middle rotating circle - spins counter-clockwise */}
                <motion.div
                    className="absolute w-10 h-10 border-4 border-primary/30 border-b-primary rounded-full"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />

                {/* Center pulsing dot */}
                <motion.div
                    className="absolute w-2 h-2 bg-primary rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>
        </div>
    );
};

export default Loader;

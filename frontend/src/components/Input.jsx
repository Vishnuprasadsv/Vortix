import React, { useState } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

// Reusable, styled text input component that supports optional labels, error messages, and a password visibility toggle
const Input = ({ label, className, error, type, hideToggle, ...props }) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordType = type === 'password';
    const inputType = isPasswordType && !hideToggle && showPassword ? 'text' : type;

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div className="flex flex-col gap-1 w-full">
            {/* Display label if provided */}
            {label && <label className="text-sm text-text-muted">{label}</label>}

            <div className="relative w-full">
                <input
                    type={inputType}
                    className={twMerge(
                        'bg-surface border border-gray-800 rounded-lg px-4 py-2 w-full text-text placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200',
                        isPasswordType && 'pr-10', // Add padding to the right for the icon
                        error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
                        className
                    )}
                    {...props}
                />
                
                {isPasswordType && !hideToggle && (
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-200 focus:outline-none"
                    >
                        {showPassword ? (
                            <FaEyeSlash className="h-4 w-4" />
                        ) : (
                            <FaEye className="h-4 w-4" />
                        )}
                    </button>
                )}
            </div>
            
            {/* Display error message if provided */}
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
};

export default Input;

import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const Input = ({ label, className, error, ...props }) => {
    return (
        <div className="flex flex-col gap-1 w-full">
            {label && <label className="text-sm text-text-muted">{label}</label>}
            <input
                className={twMerge(
                    'bg-surface border border-gray-800 rounded-lg px-4 py-2 text-text placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200',
                    error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
                    className
                )}
                {...props}
            />
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
};

export default Input;

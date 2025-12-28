import React from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

const Button = ({
  children,
  className,
  variant = "primary",
  isLoading = false,
  ...props
}) => {
  const baseStyles =
    "px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";

  const variants = {
    primary: "bg-primary text-black hover:bg-orange-600 focus:ring-primary",
    secondary:
      "bg-surface text-white border border-gray-800 hover:border-primary focus:ring-gray-500",
    outline:
      "bg-transparent border border-primary text-primary hover:bg-primary/10 focus:ring-primary",
    success: "bg-green-500 text-black hover:bg-green-600 focus:ring-green-500",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
  };

  return (
    <button
      className={twMerge(baseStyles, variants[variant], className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
};

export default Button;

"use client";

import { ReactNode, forwardRef } from "react";
import { ButtonLoader } from "./Loader";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'social' | 'creative' | 'artistic' | 'elegant';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    className = '', 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    icon,
    disabled,
    ...props 
  }, ref) => {
    const baseClasses = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
      primary: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-xl hover:scale-105 focus:ring-purple-500/50",
      secondary: "bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 text-gray-300 hover:bg-slate-700/50 hover:border-slate-500/50 hover:text-white hover:scale-105 focus:ring-slate-500/50",
      ghost: "text-gray-300 hover:text-white hover:bg-slate-800/50 backdrop-blur-sm hover:scale-105 focus:ring-slate-500/50",
      social: "bg-slate-800/30 backdrop-blur-sm border border-slate-600/30 text-gray-300 hover:bg-slate-700/40 hover:border-slate-500/40 hover:text-white focus:ring-slate-500/50",
      creative: "bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-sm border border-pink-500/30 text-pink-200 hover:from-pink-500/30 hover:to-purple-500/30 hover:border-pink-400/50 hover:text-pink-100 hover:scale-105 focus:ring-pink-500/50",
      artistic: "bg-gradient-to-r from-blue-500/20 to-teal-500/20 backdrop-blur-sm border border-blue-500/30 text-blue-200 hover:from-blue-500/30 hover:to-teal-500/30 hover:border-blue-400/50 hover:text-blue-100 hover:scale-105 focus:ring-blue-500/50",
      elegant: "bg-gradient-to-r from-slate-700/50 to-slate-600/50 backdrop-blur-sm border border-slate-500/30 text-slate-200 hover:from-slate-600/60 hover:to-slate-500/60 hover:border-slate-400/50 hover:text-white hover:scale-105 focus:ring-slate-500/50"
    };
    
    const sizes = {
      sm: "px-3 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg"
    };

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <ButtonLoader />}
        {icon && !loading && <span className="mr-2">{icon}</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

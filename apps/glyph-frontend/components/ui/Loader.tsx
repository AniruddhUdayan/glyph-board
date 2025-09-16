"use client";

import { ReactNode } from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'white' | 'minimal';
  text?: string;
  className?: string;
}

interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
  children?: ReactNode;
  className?: string;
}

export function Loader({ size = 'md', variant = 'primary', text, className = '' }: LoaderProps) {
  const sizes = {
    sm: { spinner: 'w-4 h-4', text: 'text-xs' },
    md: { spinner: 'w-6 h-6', text: 'text-sm' },
    lg: { spinner: 'w-8 h-8', text: 'text-base' },
    xl: { spinner: 'w-12 h-12', text: 'text-lg' }
  };

  const variants = {
    primary: {
      spinner: 'text-blue-500',
      text: 'text-gray-300',
      glow: 'shadow-blue-500/20'
    },
    white: {
      spinner: 'text-white',
      text: 'text-white',
      glow: 'shadow-white/20'
    },
    minimal: {
      spinner: 'text-gray-400',
      text: 'text-gray-400',
      glow: 'shadow-gray-500/10'
    }
  };

  const currentSize = sizes[size];
  const currentVariant = variants[variant];

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      {/* Animated Spinner with Glow */}
      <div className="relative">
        {/* Glow effect */}
        <div className={`absolute inset-0 ${currentSize.spinner} ${currentVariant.glow} shadow-lg rounded-full blur-sm animate-pulse`} />
        
        {/* Main spinner */}
        <div className="relative">
          <svg 
            className={`${currentSize.spinner} animate-spin ${currentVariant.spinner}`} 
            fill="none" 
            viewBox="0 0 24 24"
          >
            {/* Outer ring */}
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="3" 
            />
            {/* Animated arc */}
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
            />
          </svg>
          
          {/* Inner pulsing dot */}
          <div className={`absolute inset-0 flex items-center justify-center`}>
            <div className={`w-1.5 h-1.5 ${currentVariant.spinner} rounded-full animate-ping`} />
          </div>
        </div>
      </div>

      {/* Loading text */}
      {text && (
        <div className={`${currentSize.text} ${currentVariant.text} font-medium animate-pulse`}>
          {text}
        </div>
      )}

      {/* Floating dots animation */}
      <div className="flex space-x-1">
        <div className={`w-1.5 h-1.5 ${currentVariant.spinner} rounded-full animate-bounce`} />
        <div className={`w-1.5 h-1.5 ${currentVariant.spinner} rounded-full animate-bounce delay-100`} />
        <div className={`w-1.5 h-1.5 ${currentVariant.spinner} rounded-full animate-bounce delay-200`} />
      </div>
    </div>
  );
}

export function LoadingOverlay({ isLoading, text, children, className = '' }: LoadingOverlayProps) {
  if (!isLoading) return <>{children}</>;

  return (
    <div className={`relative ${className}`}>
      {/* Content with overlay */}
      <div className={isLoading ? 'opacity-30 pointer-events-none' : ''}>
        {children}
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm rounded-3xl" />
          
          {/* Loader content */}
          <div className="relative z-10">
            <Loader 
              size="lg" 
              variant="primary" 
              text={text || "Loading..."} 
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Specialized loaders for different contexts
export function AuthLoader({ text }: { text?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/90 backdrop-blur-md">
      {/* Creative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-purple-500/10 rounded-full animate-pulse delay-500" />
        <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-pink-500/10 rounded-full animate-pulse delay-1000" />
      </div>

      {/* Main loader */}
      <div className="relative z-10 text-center">
        <div className="mb-8">
          {/* Animated logo */}
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-12 shadow-2xl animate-pulse">
            <span className="text-white font-bold text-2xl transform -rotate-12">G</span>
          </div>
          
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Glyph Board
          </h2>
        </div>

        <Loader 
          size="xl" 
          variant="primary" 
          text={text || "Setting up your workspace..."} 
        />

        {/* Decorative elements */}
        <div className="absolute -top-8 -left-8 w-4 h-4 bg-blue-500/30 rounded-full animate-bounce delay-300" />
        <div className="absolute -top-4 -right-6 w-3 h-3 bg-purple-500/30 rounded-full animate-bounce delay-700" />
        <div className="absolute -bottom-6 -left-4 w-5 h-5 bg-pink-500/30 rounded-full animate-bounce delay-500" />
        <div className="absolute -bottom-8 -right-8 w-3 h-3 bg-cyan-500/30 rounded-full animate-bounce delay-900" />
      </div>
    </div>
  );
}

// Button loader (inline)
export function ButtonLoader() {
  return (
    <div className="flex items-center">
      <svg className="w-4 h-4 mr-2 animate-spin text-current" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
        />
      </svg>
      <div className="flex space-x-0.5">
        <div className="w-1 h-1 bg-current rounded-full animate-bounce" />
        <div className="w-1 h-1 bg-current rounded-full animate-bounce delay-100" />
        <div className="w-1 h-1 bg-current rounded-full animate-bounce delay-200" />
      </div>
    </div>
  );
}

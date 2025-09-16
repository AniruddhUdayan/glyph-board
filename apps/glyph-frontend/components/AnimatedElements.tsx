"use client";

import { useState, useEffect } from 'react';

export function AnimatedNavigation({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <nav className={`relative z-20 transition-all duration-1000 ${
      isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
    }`}>
      {children}
    </nav>
  );
}

export function AnimatedHeroContent({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`transition-all duration-1000 delay-300 ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
    }`}>
      {children}
    </div>
  );
}

export function AnimatedSubtitle({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <p className={`text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-500 ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
    }`}>
      {children}
    </p>
  );
}

export function AnimatedCTAButtons() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 transition-all duration-1000 delay-700 ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
    }`}>
      <a href="/signup" className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/40 text-blue-100 hover:from-blue-500/30 hover:to-purple-500/30 hover:border-blue-400/60 hover:text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group inline-block">
        <span className="flex items-center space-x-2">
          <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          <span>Start Creating</span>
        </span>
      </a>
      <a href="/demo" className="bg-gradient-to-r from-slate-700/30 to-slate-600/30 backdrop-blur-sm border border-slate-500/30 text-slate-200 hover:from-slate-600/40 hover:to-slate-500/40 hover:border-slate-400/50 hover:text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 group inline-block">
        <span className="flex items-center space-x-2">
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Try Instant Canvas</span>
        </span>
      </a>
    </div>
  );
}

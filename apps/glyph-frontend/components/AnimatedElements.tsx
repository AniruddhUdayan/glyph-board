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
      <a href="/signup" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group inline-block">
        Start Creating
        <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200 inline-block">→</span>
      </a>
      <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-2xl text-lg font-semibold hover:border-blue-400 hover:text-blue-600 transition-all duration-300 backdrop-blur-sm bg-white/50">
        Watch Demo
      </button>
    </div>
  );
}

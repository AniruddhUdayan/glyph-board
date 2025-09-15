"use client";

import { useState, useEffect } from 'react';

export default function AnimatedBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div 
        className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-blue-200/30 to-purple-200/30 blur-3xl animate-pulse"
        style={{
          transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
          left: '10%',
          top: '20%',
        }}
      />
      <div 
        className="absolute w-48 h-48 rounded-full bg-gradient-to-r from-pink-200/30 to-orange-200/30 blur-3xl animate-pulse delay-1000"
        style={{
          transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * -0.015}px)`,
          right: '15%',
          top: '60%',
        }}
      />
      <div 
        className="absolute w-32 h-32 rounded-full bg-gradient-to-r from-green-200/30 to-blue-200/30 blur-2xl animate-pulse delay-500"
        style={{
          transform: `translate(${mousePosition.x * 0.025}px, ${mousePosition.y * 0.025}px)`,
          left: '60%',
          top: '10%',
        }}
      />
      
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="h-full w-full" style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
      </div>
    </div>
  );
}

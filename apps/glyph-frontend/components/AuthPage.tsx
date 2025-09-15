"use client";

import { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { CreateUserSchema, SigninSchema, type CreateUser, type SigninUser } from '../lib/types';
import { z } from 'zod';

interface AuthPageProps {
  mode: 'signin' | 'signup';
  onSubmit: (data: CreateUser | SigninUser) => void;
  loading?: boolean;
}

export default function AuthPage({ mode, onSubmit, loading = false }: AuthPageProps) {
  const [formData, setFormData] = useState<CreateUser | SigninUser>(
    mode === 'signup' 
      ? { email: '', password: '', name: '' }
      : { email: '', password: '' }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const schema = mode === 'signup' ? CreateUserSchema : SigninSchema;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validatedData = schema.parse(formData);
      setErrors({});
      onSubmit(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };


  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Creative Board Patterns */}
        <div className="hidden lg:flex flex-1 items-center justify-center p-12 relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-[0.08]">
            <div className="h-full w-full" style={{
              backgroundImage: `
                linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '30px 30px'
            }} />
          </div>

          {/* Creative Elements - Spread across full screen */}
          <div className="relative w-full h-full">
            {/* Top row elements */}
            <div className="absolute top-8 left-4 w-20 h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl transform rotate-12 animate-pulse" />
            <div className="absolute top-16 left-1/4 w-14 h-14 border-4 border-pink-400/30 rounded-full animate-bounce" />
            <div className="absolute top-12 left-1/2 w-16 h-10 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg transform rotate-45 animate-pulse delay-300" />
            <div className="absolute top-20 right-16 w-18 h-15 bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-2xl transform -rotate-6" />
            <div className="absolute top-6 right-4 w-12 h-8 border-2 border-dashed border-indigo-400/40 rounded-lg" />
            
            {/* Second row */}
            <div className="absolute top-32 left-8 w-16 h-16 bg-blue-400/20 rounded-lg transform rotate-6 shadow-lg">
              <div className="p-2">
                <div className="w-full h-1 bg-blue-400/40 rounded mb-1" />
                <div className="w-1/2 h-1 bg-blue-400/40 rounded" />
              </div>
            </div>
            <div className="absolute top-40 left-1/3 w-10 h-10 border-3 border-cyan-400/40 rounded-lg transform rotate-45" />
            <div className="absolute top-36 right-1/4 w-12 h-8 border-2 border-dashed border-rose-400/40 rounded" />
            <div className="absolute top-44 right-8 w-3 h-3 bg-cyan-400/40 rounded-full animate-ping" />
            
            {/* Third row - Middle upper */}
            <div className="absolute top-56 left-2 w-22 h-18 bg-yellow-400/20 rounded-lg transform rotate-12 shadow-lg">
              <div className="p-2">
                <div className="w-full h-1 bg-yellow-400/40 rounded mb-1" />
                <div className="w-3/4 h-1 bg-yellow-400/40 rounded mb-1" />
                <div className="w-1/2 h-1 bg-yellow-400/40 rounded" />
              </div>
            </div>
            <div className="absolute top-64 left-1/4 w-14 h-14 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-full transform animate-bounce delay-700" />
            <div className="absolute top-60 left-1/2 w-20 h-16">
              <div className="w-6 h-6 bg-gradient-to-r from-rose-500/30 to-pink-500/30 rounded-full absolute top-0 left-0" />
              <div className="w-4 h-4 bg-gradient-to-r from-amber-500/30 to-orange-500/30 rounded-full absolute bottom-2 right-2" />
              <div className="w-5 h-5 bg-gradient-to-r from-indigo-500/30 to-blue-500/30 rounded-full absolute top-2 right-4" />
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 80 64">
                <line x1="12" y1="12" x2="60" y2="8" stroke="rgba(244, 63, 94, 0.3)" strokeWidth="1.5" />
                <line x1="12" y1="12" x2="50" y2="45" stroke="rgba(244, 63, 94, 0.3)" strokeWidth="1.5" />
              </svg>
            </div>
            <div className="absolute top-68 right-1/3 w-16 h-8 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-full transform -rotate-12" />
            <div className="absolute top-52 right-2 w-4 h-4 bg-violet-400/40 rounded-full animate-ping delay-500" />

            {/* Central logo area */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center transform rotate-12 shadow-2xl animate-pulse">
                <span className="text-white font-bold text-3xl transform -rotate-12">G</span>
              </div>
              <div className="text-center mt-4">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Glyph Board
                </span>
              </div>
            </div>

            {/* Fourth row - Middle lower */}
            <div className="absolute top-80 left-6 w-24 h-20 bg-pink-400/20 rounded-lg transform -rotate-6 shadow-lg">
              <div className="p-2">
                <div className="w-full h-1 bg-pink-400/40 rounded mb-1" />
                <div className="w-2/3 h-1 bg-pink-400/40 rounded mb-1" />
                <div className="w-3/4 h-1 bg-pink-400/40 rounded" />
              </div>
            </div>
            <div className="absolute top-88 left-1/3 flex space-x-1">
              <div className="w-2 h-8 bg-blue-400/30 rounded-t" />
              <div className="w-2 h-12 bg-purple-400/30 rounded-t" />
              <div className="w-2 h-6 bg-pink-400/30 rounded-t" />
              <div className="w-2 h-10 bg-green-400/30 rounded-t" />
            </div>
            <div className="absolute top-76 right-1/4 w-12 h-20 bg-gradient-to-b from-emerald-500/20 to-green-500/20 rounded-xl transform rotate-24" />
            <div className="absolute top-84 right-6 space-y-1">
              <div className="w-12 h-1 bg-gray-400/30 rounded" />
              <div className="w-8 h-1 bg-gray-400/30 rounded" />
              <div className="w-10 h-1 bg-gray-400/30 rounded" />
            </div>

            {/* Fifth row */}
            <svg className="absolute top-96 left-12 w-32 h-24" viewBox="0 0 120 80">
              <path
                d="M10 40 Q30 10 50 40 T90 40"
                stroke="rgba(139, 92, 246, 0.4)"
                strokeWidth="3"
                fill="none"
                strokeDasharray="5,5"
                className="animate-pulse"
              />
              <circle cx="15" cy="40" r="4" fill="rgba(59, 130, 246, 0.5)" />
              <circle cx="85" cy="40" r="4" fill="rgba(236, 72, 153, 0.5)" />
            </svg>
            <svg className="absolute top-104 left-1/2 w-16 h-12" viewBox="0 0 60 40">
              <path
                d="M10 20 L40 20 M35 15 L40 20 L35 25"
                stroke="rgba(236, 72, 153, 0.5)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="absolute top-100 right-1/4 w-28 h-20">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full absolute top-0 left-0" />
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full absolute bottom-2 right-4" />
              <div className="w-6 h-6 bg-gradient-to-r from-green-500/30 to-blue-500/30 rounded-full absolute top-4 right-0" />
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 80">
                <line x1="24" y1="24" x2="70" y2="15" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="2" />
                <line x1="24" y1="24" x2="60" y2="60" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="2" />
              </svg>
            </div>

            {/* Bottom row */}
            <div className="absolute bottom-16 left-4 w-16 h-16 border-2 border-dashed border-emerald-400/40 rounded-full" />
            <div className="absolute bottom-24 left-1/4 w-14 h-14 border-2 border-dashed border-amber-400/40 rounded-lg transform rotate-12" />
            <svg className="absolute bottom-20 left-1/2 w-28 h-20" viewBox="0 0 100 60">
              <path
                d="M10 30 C20 10, 40 50, 60 30 S90 10, 90 30"
                stroke="rgba(34, 197, 94, 0.4)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="3,3"
                className="animate-pulse delay-500"
              />
              <rect x="5" y="25" width="8" height="8" fill="rgba(34, 197, 94, 0.3)" rx="2" />
              <rect x="85" y="25" width="8" height="8" fill="rgba(168, 85, 247, 0.3)" rx="2" />
            </svg>
            <div className="absolute bottom-12 right-1/4 w-18 h-18 bg-purple-400/20 rounded-lg transform -rotate-12 shadow-lg">
              <div className="p-2">
                <div className="w-full h-1 bg-purple-400/40 rounded mb-1" />
                <div className="w-3/4 h-1 bg-purple-400/40 rounded mb-1" />
                <div className="w-1/2 h-1 bg-purple-400/40 rounded" />
              </div>
            </div>
            <div className="absolute bottom-8 right-4 w-2 h-2 bg-orange-400/40 rounded-full animate-ping delay-1000" />

            {/* Extra scattered elements for full coverage */}
            <div className="absolute top-20 left-20 w-8 h-8 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full" />
            <div className="absolute top-48 left-2 w-6 h-12 bg-gradient-to-b from-yellow-500/20 to-orange-500/20 rounded-lg transform rotate-15" />
            <div className="absolute top-72 right-12 w-10 h-6 bg-gradient-to-r from-pink-500/20 to-red-500/20 rounded-full transform -rotate-30" />
            <div className="absolute bottom-40 left-16 w-12 h-8 border-2 border-dashed border-purple-400/40 rounded transform rotate-20" />
            <div className="absolute bottom-60 right-8 w-8 h-8 border-2 border-dashed border-blue-400/40 rounded-full" />
            <div className="absolute top-40 right-1/3 w-4 h-4 bg-emerald-400/40 rounded-full animate-pulse delay-800" />
            <div className="absolute bottom-32 left-1/3 w-6 h-6 bg-amber-400/40 rounded-lg transform rotate-25" />
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="flex-1 lg:max-w-lg flex items-center justify-center p-8 bg-gray-800/20">
          <div className="w-full max-w-lg space-y-8">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center transform rotate-12 shadow-lg">
                  <span className="text-white font-bold text-xl transform -rotate-12">G</span>
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Glyph Board
                </span>
              </div>
              
              <h1 className="text-4xl font-bold text-white mb-2">
                {mode === 'signup' ? 'Join Glyph Board' : 'Welcome back!'}
              </h1>
              <p className="text-gray-400">
                {mode === 'signup' 
                  ? 'Create your account to start collaborating' 
                  : 'Sign in to continue to your workspace'
                }
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <Input
                    label="Full Name"
                    type="text"
                    placeholder="Enter your full name"
                    value={(formData as CreateUser).name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    error={errors.name}
                  />
                )}
                
                <Input
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={errors.email}
                />
                
                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  error={errors.password}
                />

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  loading={loading}
                >
                  {mode === 'signup' ? 'Create Account' : 'Sign In'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-400">
                  {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
                  <a
                    href={mode === 'signup' ? '/signin' : '/signup'}
                    className="text-blue-400 hover:text-blue-300 font-medium"
                  >
                    {mode === 'signup' ? 'Sign in' : 'Sign up'}
                  </a>
                </p>
              </div>
            </div>

            <div className="text-center text-xs text-gray-500">
              By continuing, you agree to our{' '}
              <a href="#" className="text-blue-400 hover:text-blue-300">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-blue-400 hover:text-blue-300">Privacy Policy</a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

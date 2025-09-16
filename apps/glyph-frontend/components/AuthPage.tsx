"use client";

import { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { AuthLoader } from './ui/Loader';
import { CreateUserSchema, SigninSchema, type CreateUser, type SigninUser } from '../lib/schemas';
import { useAuth } from '../lib/auth-context';
import { z } from 'zod';

interface AuthPageProps {
  mode: 'signin' | 'signup';
  onSubmit: (data: any) => Promise<void>;
  loading?: boolean;
}

export default function AuthPage({ mode, onSubmit, loading = false }: AuthPageProps) {
  const [formData, setFormData] = useState<CreateUser | SigninUser>(
    mode === 'signup' 
      ? { email: '', password: '', name: '' }
      : { email: '', password: '' }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { error: authError, clearError } = useAuth();
console.log(authError,"authError")
  const schema = mode === 'signup' ? CreateUserSchema : SigninSchema;


  // Clear auth errors when component unmounts or mode changes
  useEffect(() => {
    return () => clearError();
  }, [mode, clearError]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    // Clear auth errors when user starts typing
    if (authError) {
      clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validatedData = schema.parse(formData);
      setErrors({});
      await onSubmit(validatedData);
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
    <div className="relative">
      {/* Show full-screen loader when loading */}
      {loading && (
        <AuthLoader 
          text={mode === 'signup' ? 'Creating your account...' : 'Signing you in...'} 
        />
      )}

      <div className="min-h-screen bg-gray-900 relative overflow-hidden">
        {/* Background Pattern - Full Screen */}
      <div className="absolute inset-0 opacity-[0.05]">
        <div className="h-full w-full" style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Floating Creative Elements - Distributed across entire screen */}
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full">
          {/* Top scattered elements */}
          <div className="absolute top-16 left-[5%] w-16 h-10 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl transform rotate-12 animate-pulse" />
          <div className="absolute top-24 left-[15%] w-12 h-12 border-3 border-pink-400/30 rounded-full animate-bounce" />
          <div className="absolute top-12 left-[25%] w-14 h-8 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg transform rotate-45 animate-pulse delay-300" />
          <div className="absolute top-32 left-[35%] w-18 h-14 bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-2xl transform -rotate-6" />
          
          <div className="absolute top-20 right-[5%] w-20 h-12 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 rounded-2xl transform rotate-15" />
          <div className="absolute top-8 right-[15%] w-10 h-10 border-2 border-dashed border-indigo-400/40 rounded-lg" />
          <div className="absolute top-28 right-[25%] w-14 h-14 bg-gradient-to-r from-rose-500/20 to-pink-500/20 rounded-full animate-pulse delay-500" />
          <div className="absolute top-16 right-[35%] w-12 h-16 border-2 border-dashed border-violet-400/40 rounded transform rotate-20" />

          {/* Middle scattered elements */}
          <div className="absolute top-[40%] left-[8%] w-20 h-16 bg-yellow-400/20 rounded-xl transform rotate-12 shadow-lg">
            <div className="p-2">
              <div className="w-full h-1 bg-yellow-400/40 rounded mb-1" />
              <div className="w-3/4 h-1 bg-yellow-400/40 rounded mb-1" />
              <div className="w-1/2 h-1 bg-yellow-400/40 rounded" />
            </div>
          </div>
          <div className="absolute top-[45%] left-[18%] w-12 h-12 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-full animate-bounce delay-700" />
          
          <div className="absolute top-[35%] right-[8%] w-16 h-20 bg-gradient-to-b from-emerald-500/20 to-green-500/20 rounded-xl transform rotate-24" />
          <div className="absolute top-[42%] right-[18%] space-y-1">
            <div className="w-12 h-1 bg-gray-400/30 rounded" />
            <div className="w-8 h-1 bg-gray-400/30 rounded" />
            <div className="w-10 h-1 bg-gray-400/30 rounded" />
          </div>

          {/* Bottom scattered elements */}
          <div className="absolute bottom-20 left-[10%] w-14 h-14 border-2 border-dashed border-emerald-400/40 rounded-full" />
          <div className="absolute bottom-32 left-[20%] w-16 h-12 bg-pink-400/20 rounded-lg transform -rotate-6 shadow-lg">
            <div className="p-2">
              <div className="w-full h-1 bg-pink-400/40 rounded mb-1" />
              <div className="w-2/3 h-1 bg-pink-400/40 rounded" />
            </div>
          </div>
          <div className="absolute bottom-16 left-[30%] w-10 h-10 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full animate-pulse delay-1000" />
          
          <div className="absolute bottom-24 right-[10%] w-18 h-16 bg-purple-400/20 rounded-lg transform -rotate-12 shadow-lg">
            <div className="p-2">
              <div className="w-full h-1 bg-purple-400/40 rounded mb-1" />
              <div className="w-3/4 h-1 bg-purple-400/40 rounded mb-1" />
              <div className="w-1/2 h-1 bg-purple-400/40 rounded" />
            </div>
          </div>
          <div className="absolute bottom-36 right-[20%] w-8 h-8 border-2 border-dashed border-blue-400/40 rounded-full" />
          <div className="absolute bottom-12 right-[30%] w-6 h-6 bg-amber-400/40 rounded-lg transform rotate-25" />

          {/* Connecting lines */}
          <svg className="absolute top-[30%] left-[12%] w-32 h-24" viewBox="0 0 120 80">
            <path
              d="M10 40 Q30 10 50 40 T90 40"
              stroke="rgba(139, 92, 246, 0.3)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="4,4"
              className="animate-pulse"
            />
          </svg>
          <svg className="absolute top-[60%] right-[15%] w-28 h-20" viewBox="0 0 100 60">
            <path
              d="M10 30 C20 10, 40 50, 60 30 S90 10, 90 30"
              stroke="rgba(34, 197, 94, 0.3)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="3,3"
              className="animate-pulse delay-500"
            />
          </svg>
        </div>
      </div>

      {/* Centered Content Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        {/* Creative floating logo */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center transform rotate-12 shadow-2xl">
              <span className="text-white font-bold text-xl transform -rotate-12">G</span>
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Glyph Board
            </span>
          </div>
        </div>

        {/* Main Auth Card - Centered */}
        <div className="w-full max-w-md mx-auto mt-16">
          {/* Glowing background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-3xl transform scale-110"></div>
          
          <div className="relative bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-3">
                {mode === 'signup' ? 'Join the Board' : 'Welcome Back!'}
              </h1>
              <p className="text-gray-400 text-sm">
                {mode === 'signup' 
                  ? 'Create your account to start collaborating' 
                  : 'Sign in to continue your creative journey'
                }
              </p>
            </div>

            {/* Decorative elements around form */}
            {/* Decorative elements around form */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full animate-pulse"></div>
            <div className="absolute -top-2 -right-6 w-4 h-4 bg-gradient-to-r from-pink-500/30 to-orange-500/30 rounded-full animate-pulse delay-300"></div>
            <div className="absolute -bottom-4 -left-6 w-6 h-6 bg-gradient-to-r from-green-500/30 to-teal-500/30 rounded-full animate-pulse delay-500"></div>
            <div className="absolute -bottom-2 -right-4 w-5 h-5 bg-gradient-to-r from-violet-500/30 to-purple-500/30 rounded-full animate-pulse delay-700"></div>

           

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
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
                className="w-full mt-6"
                loading={loading}
              >
                {mode === 'signup' ? 'Create Account' : 'Sign In'}
              </Button>
            </form>

            {/* Error Display */}
            {authError && (
              <div className="mt-4 p-4 bg-red-500/20 border-2 border-red-500 rounded-lg backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-red-200 text-sm font-medium flex-1">{authError}</p>
                </div>
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
                <a
                  href={mode === 'signup' ? '/signin' : '/signup'}
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  {mode === 'signup' ? 'Sign in' : 'Sign up'}
                </a>
              </p>
            </div>
          </div>

          {/* Additional floating elements near the form */}
          <div className="absolute -top-8 -left-8 w-6 h-6 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full animate-bounce delay-1000"></div>
          <div className="absolute -top-12 -right-4 w-4 h-8 bg-gradient-to-b from-pink-500/20 to-purple-500/20 rounded-lg transform rotate-15"></div>
          <div className="absolute -bottom-8 -right-8 w-8 h-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full animate-pulse delay-1200"></div>
          <div className="absolute -bottom-6 -left-10 w-5 h-5 border-2 border-dashed border-yellow-400/40 rounded transform rotate-45"></div>
        </div>

        {/* Bottom floating terms */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our{' '}
            <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">Privacy Policy</a>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}

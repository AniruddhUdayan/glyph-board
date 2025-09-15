"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthPage from '../../components/AuthPage';
import type { CreateUser } from '../../lib/types';

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (data: CreateUser) => {
    setLoading(true);
    
    try {
      console.log('Signing up with:', data);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      router.push('/canvas/room-' + Date.now());
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return <AuthPage mode="signup" onSubmit={handleSignup} loading={loading} />;
}

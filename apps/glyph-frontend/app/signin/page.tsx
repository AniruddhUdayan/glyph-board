"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthPage from '../../components/AuthPage';
import type { SigninUser } from '../../lib/types';

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignin = async (data: SigninUser) => {
    setLoading(true);
    
    try {
      console.log('Signing in with:', data);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      router.push('/canvas/room-' + Date.now());
    } catch (error) {
      console.error('Signin error:', error);
    } finally {
      setLoading(false);
    }
  };

  return <AuthPage mode="signin" onSubmit={handleSignin} loading={loading} />;
}
"use client";

import { useState } from 'react';
import AuthPage from '../../components/AuthPage';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../lib/auth-context';
import type { SigninUser } from '../../lib/schemas';

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSignin = async (data: SigninUser) => {
    setLoading(true);
    
    await login(data.email, data.password);
    
    setLoading(false);
    // ProtectedRoute will handle redirect on success
  };

  return (
    <ProtectedRoute requireAuth={false}>
      <AuthPage mode="signin" onSubmit={handleSignin} loading={loading} />
    </ProtectedRoute>
  );
}
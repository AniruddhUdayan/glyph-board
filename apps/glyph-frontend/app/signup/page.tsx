"use client";

import { useState } from 'react';
import AuthPage from '../../components/AuthPage';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../lib/auth-context';
import type { CreateUser } from '../../lib/schemas';

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const handleSignup = async (data: CreateUser) => {
    setLoading(true);
    
    await signup(data.email, data.password, data.name);
    
    setLoading(false);
    // ProtectedRoute will handle redirect on success
  };

  return (
    <ProtectedRoute requireAuth={false}>
      <AuthPage mode="signup" onSubmit={handleSignup} loading={loading} />
    </ProtectedRoute>
  );
}

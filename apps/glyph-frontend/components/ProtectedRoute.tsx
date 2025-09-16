"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/auth-context';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean; // If false, redirects authenticated users away
}

export default function ProtectedRoute({ 
  children, 
  requireAuth = true 
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Add a small delay to prevent race conditions with form submissions
    const timer = setTimeout(() => {
      if (!isLoading) {
        if (requireAuth && !user) {
          // Redirect unauthenticated users to signin
          router.push('/signin');
        } else if (!requireAuth && user) {
          // Redirect authenticated users to dashboard
          router.push('/dashboard');
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [user, isLoading, requireAuth, router]);

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show content based on auth requirements
  if (requireAuth && !user) {
    return null; // Will redirect in useEffect
  }

  if (!requireAuth && user) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}

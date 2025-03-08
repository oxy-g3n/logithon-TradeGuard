import React, { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
    }
  }, [isLoggedIn]);

  // If not logged in, don't render children
  if (!isLoggedIn) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 
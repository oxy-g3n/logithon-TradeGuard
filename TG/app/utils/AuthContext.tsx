import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { isAuthenticated, getCurrentUser, logoutUser } from './api';

interface User {
  user_id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  userRole: string;
  regNumber?: string;
  primaryCountry: string;
  shippingVolume?: string;
  created_at: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is authenticated on component mount
    const checkAuth = () => {
      if (isAuthenticated()) {
        const userData = getCurrentUser();
        setUser(userData);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    };

    checkAuth();
    
    // Listen for storage events to sync auth state across tabs
    const handleStorageChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const logout = () => {
    logoutUser();
    setUser(null);
    setIsLoggedIn(false);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 
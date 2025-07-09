import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType, RegisterData } from '../types';
import { authService } from '../lib/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock user for development
  const mockUser: User = {
    id: 'mock-user-id',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    role: 'client',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const login = async (email: string, password: string) => {
    setUser({ ...mockUser, email });
  };

  const register = async (userData: RegisterData) => {
    setUser({ ...mockUser, email: userData.email, firstName: userData.firstName, lastName: userData.lastName, role: userData.role });
  };

  const logout = async () => {
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
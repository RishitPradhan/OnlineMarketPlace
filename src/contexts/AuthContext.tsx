import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType, RegisterData } from '../types';

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

  // Check for existing session on mount (from localStorage)
  useEffect(() => {
    const checkAuth = () => {
      try {
        console.log('[AuthContext] Checking current user session...');
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          const currentUser = JSON.parse(storedUser);
          console.log('[AuthContext] Found stored user:', currentUser);
          setUser(currentUser);
        } else {
          console.log('[AuthContext] No stored user found');
          setUser(null);
        }
      } catch (error) {
        console.error('[AuthContext] Auth check failed:', error);
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('[AuthContext] Attempting login for', email);
      
      // Simple validation - just check if fields are filled
      if (!email || !password) {
        throw new Error('Please fill in all fields');
      }
      
      if (!email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }
      
      // Create a mock user object
      const userData: User = {
        id: Date.now().toString(),
        email: email,
        firstName: 'User',
        lastName: 'Name',
        role: 'client',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Store user in localStorage
      localStorage.setItem('currentUser', JSON.stringify(userData));
      
      console.log('[AuthContext] Login successful, user:', userData);
      setUser(userData);
      return userData;
    } catch (error: any) {
      console.error('[AuthContext] Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setLoading(true);
      console.log('[AuthContext] Attempting registration for', userData.email);
      
      // Validate all required fields
      if (!userData.email || !userData.password || !userData.firstName || !userData.lastName || !userData.role) {
        throw new Error('Please fill in all fields');
      }
      
      if (!userData.email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }
      
      if (userData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      
      // Create a user object
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Store user in localStorage
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      
      console.log('[AuthContext] Registration successful, user:', newUser);
      setUser(newUser);
      return newUser;
    } catch (error: any) {
      console.error('[AuthContext] Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('[AuthContext] Logging out...');
      
      // Clear user from localStorage
      localStorage.removeItem('currentUser');
      
      setUser(null);
      console.log('[AuthContext] User logged out successfully');
    } catch (error: any) {
      console.error('[AuthContext] Logout failed:', error);
      setUser(null);
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
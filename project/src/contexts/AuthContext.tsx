import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType, RegisterData } from '../types';
import { simpleAuthService as authService } from '../lib/simple-auth';
import { clearUserProfileData } from '../lib/profile-completion';

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
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('[AuthContext] Checking current user session...');
        const currentUser = await authService.getCurrentUser();
        console.log('[AuthContext] getCurrentUser result:', currentUser);
        setUser(currentUser);
      } catch (error) {
        console.error('[AuthContext] Auth check failed:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('[AuthContext] Attempting login for', email);
      const userData = await authService.login({ email, password });
      console.log('[AuthContext] Login successful, user:', userData);
      setUser(userData);
      return userData;
    } catch (error: any) {
      console.error('[AuthContext] Login failed:', error);
      throw new Error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setLoading(true);
      console.log('[AuthContext] Attempting registration for', userData.email);
      const newUser = await authService.register(userData);
      console.log('[AuthContext] Registration successful, user:', newUser);
      setUser(newUser);
      return newUser;
    } catch (error: any) {
      console.error('[AuthContext] Registration failed:', error);
      throw new Error(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('[AuthContext] Logging out...');
      
      // Clear user-specific profile data before logout
      if (user) {
        clearUserProfileData(user.id);
        console.log('[AuthContext] Cleared user-specific profile data');
      }
      
      await authService.logout();
      setUser(null);
      console.log('[AuthContext] User set to null after logout');
    } catch (error: any) {
      console.error('[AuthContext] Logout failed:', error);
      setUser(null);
    }
  };

  useEffect(() => {
    console.log('[AuthContext] user state changed:', user);
    if (user === null) {
      console.warn('[AuthContext] WARNING: user is null. This will cause redirect to login.');
    }
  }, [user]);

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
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
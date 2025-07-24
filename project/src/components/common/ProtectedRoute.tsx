import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingScreen } from '../ui/LoadingScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('client' | 'freelancer' | 'admin')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen message="Loading your workspace..." />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-950 to-dark-900 flex items-center justify-center">
        <div className="text-center glass-effect rounded-xl p-8 max-w-md">
          <h1 className="text-4xl font-bold text-white mb-4">Not Logged In</h1>
          <p className="text-green-400 mb-4">You are not logged in. Please log in or register to access this page.</p>
          <a href="/login" className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 transition-all mr-2">Login</a>
          <a href="/register" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition-all">Register</a>
        </div>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-950 to-dark-900 flex items-center justify-center">
        <div className="text-center glass-effect rounded-xl p-8 max-w-md">
          <h1 className="text-4xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-green-400">You don't have permission to access this elite area.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
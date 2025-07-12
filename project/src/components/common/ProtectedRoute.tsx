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
          <h1 className="text-4xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-green-400">You don't have permission to access this elite area.</p>
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
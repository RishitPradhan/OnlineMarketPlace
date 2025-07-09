import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

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
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-950 to-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Loader2 className="w-12 h-12 text-primary-400 animate-spin mx-auto mb-4" />
            <div className="absolute inset-0 w-12 h-12 border-2 border-primary-500/20 rounded-full animate-pulse"></div>
          </div>
          <p className="text-dark-300 text-lg">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-950 to-dark-900 flex items-center justify-center">
        <div className="text-center glass-effect rounded-xl p-8 max-w-md">
          <h1 className="text-4xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-dark-300">You don't have permission to access this elite area.</p>
        </div>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-950 to-dark-900 flex items-center justify-center">
        <div className="text-center glass-effect rounded-xl p-8 max-w-md">
          <h1 className="text-4xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-dark-300">You don't have permission to access this elite area.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
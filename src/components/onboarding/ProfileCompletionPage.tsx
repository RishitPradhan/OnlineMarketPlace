import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProfileCompletionPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Automatically redirect to the new ProfilePage
  useEffect(() => {
    if (user) {
      // Small delay to show loading state
      const timer = setTimeout(() => {
        navigate('/profile', { replace: true });
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  // Show loading state while redirecting
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 to-dark-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
        <p className="text-green-400 text-lg">Redirecting to Profile Page...</p>
        <p className="text-gray-400 text-sm mt-2">Please wait...</p>
      </div>
    </div>
  );
};

export default ProfileCompletionPage; 
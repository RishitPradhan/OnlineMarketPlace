import React, { useState } from 'react';
import { Bell, User, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  user: {
    firstName: string;
    lastName: string;
    role: string;
    unreadNotifications: number;
    avatar?: string;
  };
}

export const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/login');
    }
  };

  return (
    <nav className="bg-white/80 dark:bg-dark-900/80 backdrop-blur-xl shadow-lg border-b border-green-200/40 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            className="flex items-center space-x-3 group focus:outline-none"
            onClick={() => navigate('/dashboard')}
            aria-label="Go to Dashboard"
          >
            <div className="w-10 h-10 bg-neon-green-glow dark:bg-neon-green-glow bg-green-500 rounded-xl flex items-center justify-center shadow-neon-green-glow dark:shadow-neon-green-glow shadow-green-500 group-hover:scale-105 transition-transform">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="text-white">
                <path d="M12 2L2 7l10 5 10-5-10-5zm0 13.5l-10-5V17a2 2 0 002 2h16a2 2 0 002-2v-6.5l-10 5z" fill="currentColor"/>
              </svg>
            </div>
            <span className="text-xl font-bold green-glow-text dark:green-glow-text text-green-600 group-hover:text-green-700 transition-colors">FreelanceHub</span>
          </button>

          {/* User actions */}
          <div className="flex items-center space-x-4">
            <button
              className="p-2 text-gray-500 dark:text-gray-300 hover:text-green-600 hover:bg-green-50 dark:hover:text-green-400 dark:hover:bg-dark-800/50 rounded-lg transition-all duration-300 relative"
              onClick={() => navigate('/notifications')}
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {/* Notification badge: small solid green dot above bell */}
              {user.unreadNotifications > 0 && (
                <span className="absolute -top-1 right-2 w-2.5 h-2.5 rounded-full bg-green-400 shadow-md"></span>
              )}
            </button>
            
            <button
              className="flex items-center space-x-3 group focus:outline-none"
              onClick={() => navigate('/profile')}
              aria-label="Go to Profile"
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-green-400 shadow"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-neon-green-glow group-hover:scale-105 transition-transform">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-green-500 dark:text-green-400 capitalize font-medium">{user.role}</p>
              </div>
            </button>
            
            {/* Logout Button */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleLogout}
              className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20 transform transition-all duration-300 hover:scale-105"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
import React from 'react';
import { Search, Bell, User, Settings, Globe, Moon, Sun, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  user: {
    firstName: string;
    lastName: string;
    role: string;
  };
}

export const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, redirect to login
      navigate('/login');
    }
  };

  return (
    <nav className="bg-dark-900/80 dark:bg-dark-900/80 bg-white/80 backdrop-blur-xl shadow-dark-lg border-b border-dark-700/50 dark:border-dark-700/50 border-green-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-neon-green-glow dark:bg-neon-green-glow bg-green-500 rounded-xl flex items-center justify-center shadow-neon-green-glow dark:shadow-neon-green-glow shadow-green-500">
                <Globe className="w-6 h-6 text-white dark:text-white text-white" />
              </div>
              <span className="text-xl font-bold green-glow-text dark:green-glow-text text-green-600">FreelanceHub</span>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 dark:text-dark-400 text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search elite services..."
                className="w-full pl-10 pr-4 py-2 bg-dark-800/50 dark:bg-dark-800/50 bg-white/50 border border-dark-600 dark:border-dark-600 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-500 focus:ring-green-500 focus:border-green-500 dark:focus:border-green-500 focus:border-green-500 text-white dark:text-white text-gray-900 placeholder-dark-400 dark:placeholder-dark-400 placeholder-gray-500 transition-all duration-300"
              />
            </div>
          </div>

          {/* User actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className="p-2 text-dark-400 dark:text-dark-400 text-gray-500 hover:text-green-400 dark:hover:text-green-400 hover:text-green-600 hover:bg-dark-800/50 dark:hover:bg-dark-800/50 hover:bg-green-100/50 rounded-lg transition-all duration-300"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            <button className="p-2 text-dark-400 dark:text-dark-400 text-gray-500 hover:text-green-400 dark:hover:text-green-400 hover:text-green-600 hover:bg-dark-800/50 dark:hover:bg-dark-800/50 hover:bg-green-100/50 rounded-lg transition-all duration-300">
              <Bell className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-500 dark:to-green-600 from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-neon-green-glow dark:shadow-neon-green-glow shadow-green-500">
                <User className="w-5 h-5 text-white dark:text-white text-white" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-white dark:text-white text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-green-400 dark:text-green-400 text-green-600 capitalize font-medium">{user.role}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              
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
      </div>
    </nav>
  );
};
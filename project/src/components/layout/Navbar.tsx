import React, { useState, useRef } from 'react';
import { Search, Bell, User, Settings, Globe, Moon, Sun, LogOut, ChevronRight } from 'lucide-react';
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

const SUGGESTIONS = [
  { label: 'Find Freelancers', path: '/users' },
  { label: 'My Gigs', path: '/my-gigs' },
  { label: 'Active Orders', path: '/active-orders' },
  { label: 'Messages', path: '/messages' },
  { label: 'Analytics', path: '/analytics' },
  { label: 'Earnings', path: '/earnings' },
  { label: 'Settings', path: '/settings' },
];

export const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/login');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setShowDropdown(true);
  };

  const handleSearchSelect = (path: string) => {
    setShowDropdown(false);
    setSearch('');
    navigate(path);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      // For demo, just navigate to users page with search as query
      navigate(`/users?search=${encodeURIComponent(search.trim())}`);
      setShowDropdown(false);
      setSearch('');
    }
  };

  const filteredSuggestions = SUGGESTIONS.filter(s =>
    s.label.toLowerCase().includes(search.toLowerCase())
  );

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
              <Globe className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold green-glow-text dark:green-glow-text text-green-600 group-hover:text-green-700 transition-colors">FreelanceHub</span>
          </button>

          {/* Search */}
          <div className="flex-1 max-w-lg mx-8 relative">
            <form onSubmit={handleSearchSubmit} autoComplete="off">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={handleSearchChange}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                  placeholder="Search elite services..."
                  className="w-full pl-10 pr-4 py-2 bg-white/60 dark:bg-dark-800/70 border border-green-200 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white placeholder-gray-500 transition-all duration-300 shadow-sm"
                />
              </div>
            </form>
            {showDropdown && search && (
              <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-dark-900 rounded-lg shadow-lg border border-green-100 dark:border-dark-700 z-50 max-h-60 overflow-y-auto animate-fade-in">
                {filteredSuggestions.length > 0 ? (
                  filteredSuggestions.map(s => (
                    <button
                      key={s.path}
                      className="w-full flex items-center px-4 py-2 text-left text-gray-800 dark:text-white hover:bg-green-50 dark:hover:bg-dark-800 transition-colors group"
                      onMouseDown={() => handleSearchSelect(s.path)}
                    >
                      <ChevronRight className="w-4 h-4 mr-2 text-green-500 group-hover:text-green-600" />
                      {s.label}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-gray-400 text-sm">No results found</div>
                )}
              </div>
            )}
          </div>

          {/* User actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className="p-2 text-gray-500 dark:text-gray-300 hover:text-green-600 hover:bg-green-50 dark:hover:text-green-400 dark:hover:bg-dark-800/50 rounded-lg transition-all duration-300"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            <button
              className="p-2 text-gray-500 dark:text-gray-300 hover:text-green-600 hover:bg-green-50 dark:hover:text-green-400 dark:hover:bg-dark-800/50 rounded-lg transition-all duration-300"
              onClick={() => navigate('/notifications')}
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
            </button>
            
            <button
              className="flex items-center space-x-3 group focus:outline-none"
              onClick={() => navigate('/profile-completion')}
              aria-label="Go to Profile"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-neon-green-glow group-hover:scale-105 transition-transform">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-green-500 dark:text-green-400 capitalize font-medium">{user.role}</p>
              </div>
            </button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/settings')}
              className="flex items-center"
            >
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
    </nav>
  );
};
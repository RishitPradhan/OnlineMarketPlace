import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  Layers,
  BookOpen,
  Hammer,
  ClipboardList,
  Truck,
  MessageCircle,
  BarChart2,
  Star,
  Wallet,
  CreditCard,
  Users,
  Briefcase,
  User,
  Settings,
  Zap,
  ChevronLeft,
  Bell
} from 'lucide-react';
import './scrollbar-hide.css';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  user: {
    role: string;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({ user, isCollapsed, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const allTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, route: '/dashboard' },
    { id: 'browse', label: 'Browse Services', icon: Layers, route: '/browse-services' },
    { id: 'my-gigs', label: 'My Services', icon: Hammer, route: '/services' },
    { id: 'my-orders', label: 'My Orders', icon: ClipboardList, route: '/my-orders' },
    { id: 'orders', label: 'Active Orders', icon: Truck, route: '/active-orders' },
    { id: 'messages', label: 'Messages', icon: MessageCircle, route: '/messages' },
    { id: 'notifications', label: 'Notifications', icon: Bell, route: '/notifications' },
    { id: 'analytics', label: 'Analytics', icon: BarChart2, route: '/analytics' },
    { id: 'reviews', label: 'Reviews', icon: Star, route: '/reviews' },
    { id: 'earnings', label: 'Earnings', icon: Wallet, route: '/earnings' },
    { id: 'payments', label: 'Payments', icon: CreditCard, route: '/payments' },
    { id: 'users', label: 'Users', icon: Users, route: '/users' },
    { id: 'gigs', label: 'Gigs', icon: Briefcase, route: '/gigs' },
    { id: 'profile', label: 'Profile', icon: User, route: '/profile-completion' },
    { id: 'settings', label: 'Settings', icon: Settings, route: '/settings' },
  ];

  return (
    <div
      className={`
        ${isCollapsed ? 'w-20' : 'w-72'}
        bg-dark-900/80 dark:bg-dark-900/80 bg-white/80 backdrop-blur-xl
        shadow-xl border-r border-green-400/10 rounded-xl
        h-full transition-all duration-500 relative
        glass-effect
      `}
      onClick={isCollapsed ? onToggle : undefined}
      style={{ boxShadow: '0 4px 32px 0 rgba(0,255,128,0.06)' }}
    >
      <div className={`${isCollapsed ? 'p-4' : 'p-8'} h-full flex flex-col`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center px-3 py-6' : 'px-4 py-4 justify-between'} mb-8 border-b border-green-400/10`}
          style={{ boxShadow: '0 2px 16px 0 rgba(0,255,128,0.03)' }}>
          <div className={`flex items-center transform transition-all duration-500 hover:scale-105 ${isCollapsed ? 'justify-center' : ''}`}>
            <Zap className="w-6 h-6 text-green-300 dark:text-green-300 text-green-400 ${isCollapsed ? '' : 'mr-4'} drop-shadow-neon" />
            <div className={`overflow-hidden transition-all duration-500 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
              <h2 className="text-xl font-semibold text-white dark:text-white text-green-300 neon-text whitespace-nowrap tracking-wide">
                FreelanceHub
              </h2>
            </div>
          </div>
          {!isCollapsed && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              className="p-2 rounded-full border border-green-400/20 bg-dark-800/60 hover:bg-green-400/10 hover:border-green-400/40 transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-green-400/30"
              style={{ boxShadow: '0 2px 8px 0 rgba(34,211,238,0.08)' }}
            >
              <ChevronLeft className="w-5 h-5 text-green-400" />
            </button>
          )}
        </div>
        {/* Scrollable nav with hidden scrollbar */}
        <nav className="space-y-2 flex-1 overflow-y-auto min-h-0 scrollbar-hide pl-2">
          {allTabs
            .map((tab) => {
              const Icon = tab.icon;
              const isActive = location.pathname === tab.route;
              return (
                <button
                  key={tab.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(tab.route);
                  }}
                  className={`w-full flex items-center ${isCollapsed ? 'justify-center px-3 py-5' : 'px-4 py-3'} text-left rounded-r-xl transition-all duration-300 group transform hover:scale-105
                    ${isActive ? 'bg-green-300/15 border-l-4 border-green-300 shadow-neon-green-glow text-green-200' : 'text-dark-300 dark:text-dark-300 text-green-600 hover:bg-green-400/10 hover:text-green-400 dark:hover:text-green-400'}
                  `}
                  title={isCollapsed ? tab.label : undefined}
                  style={isActive ? { boxShadow: '0 0 12px 1px #6ee7b733, 0 0 4px 1px #6ee7b755' } : {}}
                >
                  <Icon className={`w-6 h-6 min-w-6 min-h-6 ${isCollapsed ? '' : 'mr-4'} transition-all duration-300 group-hover:scale-110 group-hover:text-green-400 dark:group-hover:text-green-400 drop-shadow-neon`} />
                  <div className={`${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'} transition-all duration-500`}>
                    <span className="font-medium text-base whitespace-nowrap tracking-wide">{tab.label}</span>
                  </div>
                </button>
              );
            })}
        </nav>
      </div>
    </div>
  );
};

// Neon text and drop-shadow utility (add to your global CSS or Tailwind config)
// .neon-text { text-shadow: 0 0 8px #22d3ee, 0 0 16px #22d3ee44; }
// .drop-shadow-neon { filter: drop-shadow(0 0 6px #22d3ee88); }
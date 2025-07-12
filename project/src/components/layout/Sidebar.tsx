import React from 'react';
import { 
  Home, 
  Briefcase, 
  MessageCircle, 
  User, 
  Settings, 
  Star,
  TrendingUp,
  FileText,
  CreditCard,
  Users,
  Zap,
  ChevronLeft,
  ChevronRight,
  BookOpen
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: {
    role: string;
  };
  isCollapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, user, isCollapsed, onToggle }) => {
  const clientTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'browse', label: 'Services', icon: Briefcase },
    { id: 'my-orders', label: 'My Orders', icon: FileText },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const freelancerTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'onboarding', label: 'Onboarding', icon: BookOpen },
    { id: 'my-gigs', label: 'My Gigs', icon: Briefcase },
    { id: 'orders', label: 'Active Orders', icon: FileText },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'earnings', label: 'Earnings', icon: CreditCard },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const adminTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'gigs', label: 'Gigs', icon: Briefcase },
    { id: 'orders', label: 'Orders', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const tabs = user?.role === 'client' ? clientTabs : 
               user?.role === 'freelancer' ? freelancerTabs : 
               adminTabs;

  return (
    <div 
      className={`${isCollapsed ? 'w-20' : 'w-64'} bg-dark-900/80 dark:bg-dark-900/80 bg-white/80 backdrop-blur-xl shadow-dark-lg border-r border-dark-700/50 dark:border-dark-700/50 border-green-200 h-full transition-all duration-500 relative ${isCollapsed ? 'cursor-pointer hover:bg-dark-900/90 dark:hover:bg-dark-900/90' : ''}`}
      onClick={isCollapsed ? onToggle : undefined}
    >
      <div className={`${isCollapsed ? 'p-4' : 'p-8'} h-full flex flex-col`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center px-3 py-6' : 'px-4 py-4 justify-between'} mb-8`}>
          <div className={`flex items-center transform transition-all duration-500 hover:scale-105 ${isCollapsed ? 'justify-center' : ''}`}>
            <Zap className="w-6 h-6 text-green-400 dark:text-green-400 text-green-600 ${isCollapsed ? '' : 'mr-4'}" />
            <div className={`overflow-hidden transition-all duration-500 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
              <h2 className="text-xl font-semibold text-white dark:text-white text-green-800 whitespace-nowrap">
                {user?.role === 'client' ? 'Client Hub' : 
                 user?.role === 'freelancer' ? 'Creator Studio' : 
                 'Admin Control'}
              </h2>
            </div>
          </div>
          {!isCollapsed && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              className="p-3 rounded-lg bg-dark-800/60 hover:bg-dark-700/60 transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="w-5 h-5 text-green-400" />
            </button>
          )}
        </div>
        
        <nav className="space-y-4 flex-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onTabChange(tab.id);
                }}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center px-3 py-5' : 'px-5 py-4'} text-left rounded-xl transition-all duration-500 group transform hover:scale-105 ${
                  isActive
                    ? 'bg-green-500/20 dark:bg-green-500/20 bg-green-100 text-green-400 dark:text-green-400 text-green-700 border-r-2 border-green-400 dark:border-green-400 border-green-500 shadow-neon-green-glow dark:shadow-neon-green-glow shadow-green-500'
                    : 'text-dark-300 dark:text-dark-300 text-green-600 hover:bg-dark-800/50 dark:hover:bg-dark-800/50 hover:bg-green-50 hover:text-white dark:hover:text-white hover:text-green-800'
                }`}
                title={isCollapsed ? tab.label : undefined}
              >
                <Icon className={`w-6 h-6 ${isCollapsed ? '' : 'mr-4'} transition-all duration-300 group-hover:scale-110 ${
                  isActive ? 'text-green-400 dark:text-green-400 text-green-600' : 'group-hover:text-green-400 dark:group-hover:text-green-400 group-hover:text-green-600'
                }`} />
                <div className={`overflow-hidden transition-all duration-500 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                  <span className="font-medium text-base whitespace-nowrap">{tab.label}</span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
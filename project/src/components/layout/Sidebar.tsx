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
  Zap
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: {
    role: string;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, user }) => {
  const clientTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'browse', label: 'Browse Services', icon: Briefcase },
    { id: 'my-orders', label: 'My Orders', icon: FileText },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const freelancerTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
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
    <div className="w-64 bg-dark-900/80 dark:bg-dark-900/80 bg-white/80 backdrop-blur-xl shadow-dark-lg border-r border-dark-700/50 dark:border-dark-700/50 border-green-200 h-full">
      <div className="p-6">
        <div className="flex items-center mb-6 transform transition-transform duration-300 hover:scale-105">
          <Zap className="w-6 h-6 text-green-400 dark:text-green-400 text-green-600 mr-2" />
          <h2 className="text-lg font-semibold text-white dark:text-white text-green-800">
            {user?.role === 'client' ? 'Client Hub' : 
             user?.role === 'freelancer' ? 'Creator Studio' : 
             'Admin Control'}
          </h2>
        </div>
        
        <nav className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-300 group transform hover:scale-105 ${
                  isActive
                    ? 'bg-green-500/20 dark:bg-green-500/20 bg-green-100 text-green-400 dark:text-green-400 text-green-700 border-r-2 border-green-400 dark:border-green-400 border-green-500 shadow-neon-green-glow dark:shadow-neon-green-glow shadow-green-500'
                    : 'text-dark-300 dark:text-dark-300 text-green-600 hover:bg-dark-800/50 dark:hover:bg-dark-800/50 hover:bg-green-50 hover:text-white dark:hover:text-white hover:text-green-800'
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 transition-all duration-300 group-hover:scale-110 ${
                  isActive ? 'text-green-400 dark:text-green-400 text-green-600' : 'group-hover:text-green-400 dark:group-hover:text-green-400 group-hover:text-green-600'
                }`} />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
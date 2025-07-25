import React, { useState, useEffect, createContext, useContext } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useAuth } from '../../contexts/AuthContext';
import { Outlet } from 'react-router-dom';
import { fetchUnreadMessageCount } from '../dashboard/Dashboard';

// Unread messages context
export const UnreadMessagesContext = createContext<{ unreadMessages: number; refreshUnreadMessages: () => Promise<void> }>({ unreadMessages: 0, refreshUnreadMessages: async () => {} });
export const useUnreadMessages = () => useContext(UnreadMessagesContext);

const MainLayout: React.FC = () => {
  const { user } = useAuth();
  console.log('Current user ID:', user?.id);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const refreshUnreadMessages = async () => {
    if (!user) return;
    const count = await fetchUnreadMessageCount(user.id);
    console.log('[refreshUnreadMessages] Unread count:', count);
    setUnreadMessages(count);
  };

  useEffect(() => {
    if (!user) return;
    let mounted = true;
    const fetchCount = async () => {
      const count = await fetchUnreadMessageCount(user.id);
      if (mounted) setUnreadMessages(count);
    };
    fetchCount();
    // Optionally, poll every 10s for real-time updates
    const interval = setInterval(fetchCount, 10000);
    return () => { mounted = false; clearInterval(interval); };
  }, [user]);

  if (!user) return null;

  return (
    <UnreadMessagesContext.Provider value={{ unreadMessages, refreshUnreadMessages }}>
      <div className="h-screen flex flex-col bg-gradient-to-br from-dark-950 to-dark-900 dark:from-dark-950 dark:to-dark-900 from-white to-white">
        <Navbar user={{ ...user, unreadNotifications: unreadMessages }} />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            user={user}
            isCollapsed={isSidebarCollapsed}
            onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            refreshUnreadMessages={refreshUnreadMessages}
          />
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </UnreadMessagesContext.Provider>
  );
};

export default MainLayout; 
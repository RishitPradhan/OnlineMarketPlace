import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { notificationService } from '../../lib/notification-service';
import { supabase } from '../../lib/supabase';

// Create context for unread messages
export const UnreadMessagesContext = React.createContext<{
  unreadMessages: number;
  refreshUnreadMessages: () => Promise<void>;
}>({
  unreadMessages: 0,
  refreshUnreadMessages: async () => {},
});

export const useUnreadMessages = () => React.useContext(UnreadMessagesContext);

const fetchUnreadMessageCount = async (userId: string) => {
  try {
    const { count, error } = await supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .eq('receiver_id', userId)
      .eq('unread', true);
    return count || 0;
  } catch (error) {
    console.error('Error fetching unread message count:', error);
    return 0;
  }
};

const fetchUnreadNotificationCount = async (userId: string) => {
  try {
    return await notificationService.getUnreadCount(userId);
  } catch (error) {
    console.error('Error fetching unread notification count:', error);
    return 0;
  }
};

const MainLayout: React.FC = () => {
  const { user } = useAuth();
  console.log('Current user ID:', user?.id);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const refreshUnreadMessages = async () => {
    if (!user) return;
    const messageCount = await fetchUnreadMessageCount(user.id);
    const notificationCount = await fetchUnreadNotificationCount(user.id);
    const totalCount = messageCount + notificationCount;
    console.log('[refreshUnreadMessages] Unread count:', totalCount, '(messages:', messageCount, 'notifications:', notificationCount, ')');
    setUnreadMessages(totalCount);
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
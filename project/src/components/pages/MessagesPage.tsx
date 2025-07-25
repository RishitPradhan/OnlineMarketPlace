import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ChatSidebar } from '../dashboard/Dashboard'; // Import ChatSidebar
import { ChatBox } from '../dashboard/Dashboard'; // Import ChatBox
import { supabase } from '../../lib/supabase';
import { useUnreadMessages } from '../layout/MainLayout';
import { useLocation } from 'react-router-dom';

const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const { refreshUnreadMessages } = useUnreadMessages();

  useEffect(() => {
    if (!user) return;
    const markAllAsRead = async () => {
      await supabase
        .from('messages')
        .update({ unread: false })
        .eq('receiver_id', user.id);
      refreshUnreadMessages();
    };
    markAllAsRead();
  }, [user, refreshUnreadMessages]);

  // Open chat with seller if openChat is passed in location.state
  useEffect(() => {
    if (location.state && (location.state as any).openChat) {
      setSelectedChat((location.state as any).openChat);
    }
  }, [location.state]);

  if (!user) {
    return (
      <div className="text-center text-green-600 mt-12 flex flex-col items-center gap-4">
        <div>Please log in to use chat.</div>
      </div>
    );
  }

  const userItem = {
    id: user.id,
    first_name: user.firstName,
    last_name: user.lastName
  };

  return (
    <div className="h-screen flex bg-gradient-to-br from-dark-950 to-dark-900 dark:from-dark-950 dark:to-dark-900 from-white to-white">
      {/* Sidebar */}
      <div className="w-80 bg-dark-900/50 border-r border-green-500/20 flex flex-col">
        <div className="p-6 border-b border-green-500/20">
          <h2 className="text-2xl font-bold text-white mb-2">Messages</h2>
          <p className="text-green-400 text-sm">Connect with your network</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ChatSidebar 
            onSelect={setSelectedChat} 
            selectedChat={selectedChat} 
            currentUser={userItem} 
          />
        </div>
      </div>
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatBox selectedChat={selectedChat} currentUser={userItem} />
      </div>
    </div>
  );
};

export default MessagesPage; 
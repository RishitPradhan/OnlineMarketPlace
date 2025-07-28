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
    <div className="h-screen flex flex-col bg-gradient-to-br from-dark-950 to-dark-900">
      {/* Header */}
      <div className="bg-dark-900/50 border-b border-green-500/20 p-4 flex items-center flex-shrink-0">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-green-400 hover:text-green-300 transition-colors"
        >
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>
      
      {/* Chat Interface */}
      <div className="flex-1 flex min-h-0">
        {/* Sidebar */}
        <div className="w-80 bg-dark-900/50 border-r border-green-500/20 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto">
            <ChatSidebar 
              onSelect={setSelectedChat} 
              selectedChat={selectedChat} 
              currentUser={userItem} 
            />
          </div>
        </div>
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-h-0">
          <ChatBox selectedChat={selectedChat} currentUser={userItem} showHeader={false} />
        </div>
      </div>
    </div>
  );
};

export default MessagesPage; 
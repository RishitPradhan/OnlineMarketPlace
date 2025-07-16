import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ChatSidebar } from '../dashboard/Dashboard'; // Import ChatSidebar
import { ChatBox } from '../dashboard/Dashboard'; // Import ChatBox

const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState<any>(null);

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
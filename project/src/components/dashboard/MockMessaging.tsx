import React, { useState, useEffect, useRef } from 'react';
import { LoadingScreen } from '../ui/LoadingScreen';

interface MockUser {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar: string;
}

interface MockMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

interface ChatTarget {
  type: 'user';
  id: string;
  name: string;
}

// Mock data
const mockUsers: MockUser[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'john.doe@example.com',
    name: 'John Doe',
    role: 'client',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&w=150&h=150&q=80'
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    email: 'jane.smith@example.com',
    name: 'Jane Smith',
    role: 'freelancer',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=facearea&w=150&h=150&q=80'
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&w=150&h=150&q=80'
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    email: 'alice.johnson@example.com',
    name: 'Alice Johnson',
    role: 'freelancer',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&w=150&h=150&q=80'
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    email: 'bob.wilson@example.com',
    name: 'Bob Wilson',
    role: 'client',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&w=150&h=150&q=80'
  }
];

// Mock conversations
const mockConversations: Record<string, MockMessage[]> = {
  '11111111-1111-1111-1111-111111111111': [
    {
      id: '1',
      sender_id: '11111111-1111-1111-1111-111111111111',
      receiver_id: 'current-user',
      content: 'Hey! I have a project I need help with.',
      created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      sender_id: 'current-user',
      receiver_id: '11111111-1111-1111-1111-111111111111',
      content: 'Hi John! I would love to help. What kind of project is it?',
      created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      sender_id: '11111111-1111-1111-1111-111111111111',
      receiver_id: 'current-user',
      content: 'It\'s a website redesign. Can we discuss the details?',
      created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString()
    }
  ],
  '22222222-2222-2222-2222-222222222222': [
    {
      id: '4',
      sender_id: '22222222-2222-2222-2222-222222222222',
      receiver_id: 'current-user',
      content: 'Hi! I saw your portfolio. Amazing work!',
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '5',
      sender_id: 'current-user',
      receiver_id: '22222222-2222-2222-2222-222222222222',
      content: 'Thank you Jane! I appreciate that.',
      created_at: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString()
    }
  ],
  '44444444-4444-4444-4444-444444444444': [
    {
      id: '6',
      sender_id: '44444444-4444-4444-4444-444444444444',
      receiver_id: 'current-user',
      content: 'Are you available for a new project?',
      created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    }
  ]
};

// Chat Sidebar Component
const ChatSidebar: React.FC<{
  onSelect: (target: ChatTarget) => void;
  selectedChat: ChatTarget | null;
  currentUserId: string;
}> = ({ onSelect, selectedChat, currentUserId }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = mockUsers.filter(user => 
    user.id !== currentUserId && 
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRandomColor = (id: string) => {
    const colors = ['bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-yellow-500', 'bg-indigo-500'];
    return colors[id.charCodeAt(0) % colors.length];
  };

  return (
    <div className="h-full flex flex-col">
      {/* Search Bar */}
      <div className="p-4 border-b border-green-500/20">
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-dark-800/50 border border-green-500/30 rounded-lg text-white placeholder-green-400/60 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <svg className="absolute right-3 top-2.5 w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <p className="text-green-400/60 text-sm">No users found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredUsers.map(user => (
                <button
                  key={user.id}
                  onClick={() => onSelect({ type: 'user', id: user.id, name: user.name })}
                  className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-green-500/10 ${
                    selectedChat?.type === 'user' && selectedChat.id === user.id 
                      ? 'bg-green-500/20 border border-green-500/30' 
                      : 'hover:border-green-500/20 border border-transparent'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3 ${getRandomColor(user.id)}`}>
                    {getInitials(user.name)}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-white font-medium text-sm">{user.name}</p>
                    <p className="text-green-400/60 text-xs">{user.role}</p>
                  </div>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Chat Box Component
const ChatBox: React.FC<{
  selectedChat: ChatTarget | null;
  currentUserId: string;
}> = ({ selectedChat, currentUserId }) => {
  const [messages, setMessages] = useState<MockMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedChat) return;

    setLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      const conversation = mockConversations[selectedChat.id] || [];
      setMessages(conversation);
      setLoading(false);
    }, 500);
  }, [selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChat || !input.trim()) return;

    const newMessage: MockMessage = {
      id: Date.now().toString(),
      sender_id: currentUserId,
      receiver_id: selectedChat.id,
      content: input.trim(),
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRandomColor = (id: string) => {
    const colors = ['bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-yellow-500', 'bg-indigo-500'];
    return colors[id.charCodeAt(0) % colors.length];
  };

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Select a conversation</h3>
          <p className="text-green-400/60">Choose a user to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center p-4 border-b border-green-500/20 bg-dark-900/30">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3 ${getRandomColor(selectedChat.id)}`}>
          {getInitials(selectedChat.name)}
        </div>
        <div className="flex-1">
          <h3 className="text-white font-semibold">{selectedChat.name}</h3>
          <p className="text-green-400/60 text-sm">Online</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-green-400 hover:text-green-300 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
          <button className="p-2 text-green-400 hover:text-green-300 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <LoadingScreen message="Loading messages..." size="sm" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No messages yet</h3>
              <p className="text-green-400/60 text-sm">Start the conversation!</p>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isOwnMessage = msg.sender_id === currentUserId;
            const showAvatar = index === 0 || messages[index - 1]?.sender_id !== msg.sender_id;
            
            return (
              <div
                key={msg.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} items-end max-w-xs lg:max-w-md`}>
                  {!isOwnMessage && showAvatar && (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs mr-2 mb-1 ${getRandomColor(msg.sender_id)}`}>
                      {getInitials(selectedChat.name)}
                    </div>
                  )}
                  <div className={`px-4 py-2 rounded-2xl shadow-sm ${
                    isOwnMessage 
                      ? 'bg-green-600 text-white rounded-br-md' 
                      : 'bg-dark-800 text-white rounded-bl-md border border-green-500/20'
                  }`}>
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 ${
                      isOwnMessage ? 'text-green-200' : 'text-green-400/60'
                    }`}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-green-500/20">
        <form onSubmit={sendMessage} className="flex space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-dark-800/50 border border-green-500/30 rounded-lg text-white placeholder-green-400/60 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

// Main Messaging Component
export const MockMessaging: React.FC<{ currentUserId: string }> = ({ currentUserId }) => {
  const [selectedChat, setSelectedChat] = useState<ChatTarget | null>(null);

  return (
    <div className="h-full bg-gradient-to-br from-dark-950 to-dark-900 dark:from-dark-950 dark:to-dark-900 from-white to-white">
      <div className="h-full flex">
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
              currentUserId={currentUserId} 
            />
          </div>
        </div>
        
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          <ChatBox selectedChat={selectedChat} currentUserId={currentUserId} />
        </div>
      </div>
    </div>
  );
}; 
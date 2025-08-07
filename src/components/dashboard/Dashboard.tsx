import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Navbar } from '../layout/Navbar';
import { Sidebar } from '../layout/Sidebar';
import { DashboardOverview } from './DashboardOverview';
import { Settings } from '../settings/Settings';
import { Star, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingScreen } from '../ui/LoadingScreen';
import { useUnreadMessages } from '../layout/MainLayout';
import { useProfileCompletion } from '../common/ProfileCompletionGuard';


// Expanded dummy projects/services
const featuredWorks = [
  {
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    title: "E-commerce Platform",
    category: "Web Development",
    price: "₹2,500",
    rating: 5.0,
    reviews: 89
  },
  {
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
    title: "Brand Identity",
    category: "Graphic Design",
    price: "₹800",
    rating: 4.9,
    reviews: 156
  },
  {
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
    title: "Product Launch",
    category: "Video Production",
    price: "₹1,200",
    rating: 5.0,
    reviews: 234
  },
  {
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
    title: "Mobile App",
    category: "App Development",
    price: "₹5,000",
    rating: 4.8,
    reviews: 67
  },
  {
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop",
    title: "SEO Optimization",
    category: "SEO",
    price: "₹600",
    rating: 4.7,
    reviews: 120
  },
  {
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&h=300&fit=crop",
    title: "App Prototyping",
    category: "UI/UX Design",
    price: "₹1,000",
    rating: 4.9,
    reviews: 98
  },
  {
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&h=300&fit=crop",
    title: "Cybersecurity Audit",
    category: "Cybersecurity",
    price: "₹2,000",
    rating: 5.0,
    reviews: 45
  },
  {
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop",
    title: "Brand Strategy",
    category: "Marketing",
    price: "₹900",
    rating: 4.8,
    reviews: 110
  },
  {
    image: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=400&h=300&fit=crop",
    title: "Social Media Marketing",
    category: "Marketing",
    price: "₹350",
    rating: 4.6,
    reviews: 210
  },
  {
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=400&h=300&fit=crop",
    title: "Copywriting",
    category: "Writing",
    price: "₹200",
    rating: 4.9,
    reviews: 320
  },
  {
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400&h=300&fit=crop",
    title: "Business Consulting",
    category: "Consulting",
    price: "₹1,500",
    rating: 4.9,
    reviews: 78
  },
  {
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&h=300&fit=crop",
    title: "Digital Art",
    category: "Art & Illustration",
    price: "₹400",
    rating: 4.8,
    reviews: 134
  },
  {
    image: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=400&h=300&fit=crop",
    title: "Audio & Music",
    category: "Music & Audio",
    price: "₹300",
    rating: 4.7,
    reviews: 156
  },
  {
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&h=300&fit=crop",
    title: "Video Editing",
    category: "Video Production",
    price: "₹700",
    rating: 4.8,
    reviews: 99
  },
  {
    image: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=400&h=300&fit=crop",
    title: "App Store Optimization",
    category: "Mobile Marketing",
    price: "₹450",
    rating: 4.7,
    reviews: 65
  },
  {
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&h=300&fit=crop",
    title: "Logo Animation",
    category: "Animation",
    price: "₹350",
    rating: 4.9,
    reviews: 80
  },
  {
    image: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=400&h=300&fit=crop",
    title: "Presentation Design",
    category: "Design",
    price: "₹250",
    rating: 4.8,
    reviews: 120
  },
  {
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&h=300&fit=crop",
    title: "Market Research",
    category: "Business",
    price: "₹600",
    rating: 4.7,
    reviews: 70
  },
  {
    image: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=400&h=300&fit=crop",
    title: "Translation",
    category: "Languages",
    price: "₹150",
    rating: 4.8,
    reviews: 90
  }
];

// Dummy freelancers for modal
const dummyFreelancers = Array.from({ length: 16 }).map((_, i) => ({
  name: `Freelancer ${i + 1}`,
  avatar: `https://randomuser.me/api/portraits/men/${i + 10}.jpg`,
  rating: (4.5 + Math.random() * 0.5).toFixed(1),
  price: `₹${(500 + Math.floor(Math.random() * 2000))}`,
  tagline: [
    'Expert in this field',
    '5+ years experience',
    'Top-rated seller',
    'Fast delivery',
    'Creative solutions',
    'Client-focused',
    'Award-winning',
    '100+ projects done',
    'Satisfaction guaranteed',
    'Innovative approach',
    'Trusted by brands',
    'Proven results',
    'Quick turnaround',
    'Detail-oriented',
    'Friendly & professional',
    'Flexible pricing'
  ][i % 16]
}));

type ServiceType = typeof featuredWorks[number];

const orderData = [
  {
    id: '#ORD-001',
    title: 'Website Redesign',
    client: 'TechCorp Inc.',
    amount: '₹85,000',
    status: 'In Progress',
    date: '2024-01-15',
  },
  {
    id: '#ORD-002',
    title: 'Logo Design',
    client: 'StartupXYZ',
    amount: '₹30,000',
    status: 'Completed',
    date: '2024-01-14',
  },
  {
    id: '#ORD-003',
    title: 'Mobile App UI',
    client: 'InnovateLab',
    amount: '₹1,20,000',
    status: 'Review',
    date: '2024-01-13',
  },
];

const statusColors = {
  'Completed': 'bg-green-500/20 text-green-400',
  'In Progress': 'bg-yellow-500/20 text-yellow-400',
  'Review': 'bg-blue-500/20 text-blue-400',
};

function OrderTrackingTable() {
  const [search, setSearch] = React.useState('');
  const { user } = useAuth();
  
  // For new users, show empty state instead of dummy data
  const isNewUser = !user || user.createdAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(); // User created in last 7 days
  
  if (isNewUser) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">No Orders Yet</h3>
        <p className="text-green-400 mb-8 max-w-md mx-auto">
          Start your journey by browsing services and placing your first order. 
          Your order history will appear here once you make your first purchase.
        </p>
        <button 
          onClick={() => window.location.href = '/dashboard?tab=browse'}
          className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          Browse Services
        </button>
      </div>
    );
  }

  // For existing users, show dummy data (in real app, this would be from database)
  const filtered = orderData.filter(order =>
    order.title.toLowerCase().includes(search.toLowerCase()) ||
    order.client.toLowerCase().includes(search.toLowerCase()) ||
    order.status.toLowerCase().includes(search.toLowerCase())
  );
  
  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search orders..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full md:w-1/3 px-6 py-3 rounded-lg border border-green-200 bg-dark-900/50 dark:bg-dark-900/50 bg-white text-green-800 dark:text-green-400 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-green-200">
          <thead>
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-green-400 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-green-400 uppercase tracking-wider">Title</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-green-400 uppercase tracking-wider">Client</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-green-400 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-green-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-green-400 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-green-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-green-400">No orders found.</td>
              </tr>
            ) : (
              filtered.map(order => (
                <tr key={order.id} className="hover:bg-green-100/10 transition-all">
                  <td className="px-6 py-4 text-green-300 font-mono">{order.id}</td>
                  <td className="px-6 py-4 text-white font-semibold">{order.title}</td>
                  <td className="px-6 py-4 text-green-200">{order.client}</td>
                  <td className="px-6 py-4 text-green-400 font-bold">{order.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${(statusColors as Record<string, string>)[order.status] || 'bg-gray-500/20 text-gray-400'}`}>{order.status}</span>
                  </td>
                  <td className="px-6 py-4 text-green-200">{order.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Type definitions
interface UserItem { id: string; first_name: string; last_name: string; }
interface GroupItem { id: string; name: string; }
interface ChatTarget { type: 'user' | 'group'; id: string; name: string; }
interface MessageItem {
  id: string;
  sender_id: string;
  receiver_id?: string;
  group_id?: string;
  content: string;
  created_at: string;
}
interface ChatSidebarProps {
  onSelect: (target: ChatTarget) => void;
  selectedChat: ChatTarget | null;
  currentUser: UserItem;
}
interface ChatProps {
  selectedChat: ChatTarget | null;
  currentUser: UserItem;
}

// Move getInitials and getRandomColor to the top of the file, after imports
function getInitials(fullName: string) {
  if (!fullName) return '';
  const parts = fullName.trim().split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
function getRandomColor(id: string) {
  const colors = ['bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-yellow-500', 'bg-indigo-500'];
  return colors[id.charCodeAt(0) % colors.length];
}

// ChatSidebar: shows users, allows selection
const ChatSidebar: React.FC<ChatSidebarProps> = ({ onSelect, selectedChat, currentUser }) => {
  const { refreshUnreadMessages } = useUnreadMessages();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [recentChats, setRecentChats] = useState<UserItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'recent'>('recent');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

      // Fetch users who have messaged the current user (recent chats)
    useEffect(() => {
      const fetchRecentChats = async () => {
        try {
          // Get all messages where current user is sender or receiver
          const { data: messagesData, error: messagesError } = await supabase
            .from('messages')
            .select('sender_id, receiver_id, sender:users!sender_id(id, first_name, last_name), receiver:users!receiver_id(id, first_name, last_name), created_at, unread')
            .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
            .order('created_at', { ascending: false });

          if (!messagesError && messagesData && messagesData.length > 0) {
            // Extract unique users from messages (other than current user), most recent first
            const userMap: { [id: string]: { user: UserItem; lastMessageTime: string; hasUnread: boolean } } = {};
            messagesData.forEach((msg: any) => {
              // If current user is sender, add receiver
              if (msg.receiver && msg.receiver.id !== currentUser.id) {
                if (!userMap[msg.receiver.id] || new Date(msg.created_at) > new Date(userMap[msg.receiver.id].lastMessageTime)) {
                  userMap[msg.receiver.id] = {
                    user: {
                      id: msg.receiver.id,
                      first_name: msg.receiver.first_name,
                      last_name: msg.receiver.last_name
                    },
                    lastMessageTime: msg.created_at,
                    hasUnread: false
                  };
                }
                // If the message is unread and sent to current user, mark as hasUnread
                if (msg.unread && msg.receiver.id === currentUser.id) {
                  userMap[msg.receiver.id].hasUnread = true;
                }
              }
              // If current user is receiver, add sender
              if (msg.sender && msg.sender.id !== currentUser.id) {
                if (!userMap[msg.sender.id] || new Date(msg.created_at) > new Date(userMap[msg.sender.id].lastMessageTime)) {
                  userMap[msg.sender.id] = {
                    user: {
                      id: msg.sender.id,
                      first_name: msg.sender.first_name,
                      last_name: msg.sender.last_name
                    },
                    lastMessageTime: msg.created_at,
                    hasUnread: false
                  };
                }
                // If the message is unread and sent to current user, mark as hasUnread
                if (msg.unread && msg.receiver && msg.receiver.id === currentUser.id) {
                  userMap[msg.sender.id].hasUnread = true;
                }
              }
            });
            // Sort users by most recent message
            const uniqueUsers = Object.values(userMap)
              .sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime())
              .map(entry => ({ ...entry.user, hasUnread: entry.hasUnread }));
            setRecentChats(uniqueUsers);
          } else {
            setRecentChats([]);
          }
        } catch (error) {
          console.error('❌ Error fetching recent chats:', error);
          setRecentChats([]);
        }
      };

    fetchRecentChats();
  }, [currentUser.id]);

  // Subscribe to new messages to update recent chats
  useEffect(() => {
    const sub = supabase
      .channel('realtime:recent-chats')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, async (payload: { new: any }) => {
        const newMessage = payload.new;
        
        // If someone sent a message to current user, add them to recent chats
        if (newMessage.receiver_id === currentUser.id && newMessage.sender_id !== currentUser.id) {
          try {
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('id, first_name, last_name')
              .eq('id', newMessage.sender_id)
              .single();

            if (userData) {
              setRecentChats(prev => {
                const user = {
                  id: userData.id,
                  first_name: userData.first_name,
                  last_name: userData.last_name
                };
                
                // Add user if not already in recent chats
                if (!prev.find(u => u.id === user.id)) {
                  return [user, ...prev];
                }
                return prev;
              });
            }
          } catch (error) {
            console.error('Error fetching new user data:', error);
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(sub);
    };
  }, [currentUser.id]);

  useEffect(() => {
    if (!searchTerm) {
      setUsers([]);
      return;
    }
    setLoading(true);
    const fetchUsers = async () => {
      // Search by first_name or last_name (case-insensitive)
      const { data, error } = await supabase
        .from('users')
        .select('id, first_name, last_name')
        .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`)
        .neq('id', currentUser.id);
      if (error) {
        setUsers([]); // No fallback/mock users
      } else {
        setUsers((data as UserItem[] || []).filter(u => u.id !== currentUser.id));
      }
      setLoading(false);
    };
    const timeout = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm, currentUser.id]);

  // 1. Add state to track unread counts for each user
  const [unreadMap, setUnreadMap] = useState<{ [userId: string]: number }>({});

  // 2. Fetch unread counts for each recent chat user
  useEffect(() => {
    const fetchUnreadCounts = async () => {
      if (!recentChats.length) return;
      const userIds = recentChats.map(u => u.id);
      const { data, error } = await supabase
        .from('messages')
        .select('sender_id, count: id', { count: 'exact', head: false })
        .eq('receiver_id', currentUser.id)
        .eq('unread', true)
        .in('sender_id', userIds);
      if (!error && data) {
        const map: { [userId: string]: number } = {};
        data.forEach((row: any) => {
          map[row.sender_id] = (map[row.sender_id] || 0) + 1;
        });
        setUnreadMap(map);
      } else {
        setUnreadMap({});
      }
    };
    fetchUnreadCounts();
  }, [recentChats, currentUser.id]);

  // 3. When opening a chat, mark messages as read and update unreadMap
  const handleSelectChat = async (chat: { type: 'user'; id: string; name: string }) => {
    onSelect(chat);
    // Mark all messages from this user as read
    await supabase
      .from('messages')
      .update({ unread: false })
      .eq('sender_id', chat.id)
      .eq('receiver_id', currentUser.id);
    setUnreadMap(prev => ({ ...prev, [chat.id]: 0 }));
    if (refreshUnreadMessages) {
      refreshUnreadMessages();
    }
    // Optimistically update recents so the green dot disappears instantly
    setRecentChats(prev => prev.map(u => u.id === chat.id ? { ...u, hasUnread: false } : u));
  };

  if (!currentUser) {
    return <LoadingScreen message="Loading user data..." size="sm" />;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Search Bar */}
      <div className="p-4 border-b border-green-500/20">
        <div className="relative">
          <input
            type="text"
            placeholder="Search users by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-dark-800/50 border border-green-500/30 rounded-lg text-white placeholder-green-400/60 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <svg className="absolute right-3 top-2.5 w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-green-500/20">
        <button
          onClick={() => setActiveTab('recent')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'recent' 
              ? 'text-green-400 border-b-2 border-green-400 bg-green-400/10' 
              : 'text-green-400/60 hover:text-green-400'
          }`}
        >
          Recent ({recentChats.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'users' 
              ? 'text-green-400 border-b-2 border-green-400 bg-green-400/10' 
              : 'text-green-400/60 hover:text-green-400'
          }`}
        >
          Users ({users.length})
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'recent' ? (
          <div className="p-4">
            {recentChats.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-green-400/60 text-sm">No recent chats</p>
                <p className="text-green-400/40 text-xs mt-2">Users will appear here when they message you</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentChats.map(user => (
                  <button
                    key={user.id}
                    onClick={() => handleSelectChat({ type: 'user', id: user.id, name: `${user.first_name} ${user.last_name}` })}
                    className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-green-500/10 ${
                      selectedChat?.type === 'user' && selectedChat.id === user.id 
                        ? 'bg-green-500/20 border border-green-500/30' 
                        : 'hover:border-green-500/20 border border-transparent'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3 ${getRandomColor(user.id)}`} onClick={e => { e.stopPropagation(); navigate(`/user/${user.id}`); }} style={{ cursor: 'pointer' }}>
                      {getInitials(user.first_name + ' ' + user.last_name)}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-white font-medium text-sm">{user.first_name} {user.last_name}</p>
                      <p className="text-green-400/60 text-xs">Recent chat</p>
                    </div>
                    {(user as any).hasUnread && <div className="w-2 h-2 bg-green-400 rounded-full"></div>}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="p-4">
            {loading ? (
              <div className="text-center py-8 text-green-400">Loading...</div>
            ) : users.length === 0 ? (
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
                {users
                  .filter(user => user.id !== currentUser.id)
                  .map(user => (
                    <button
                      key={user.id}
                      onClick={() => onSelect({ type: 'user', id: user.id, name: `${user.first_name} ${user.last_name}` })}
                      className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-green-500/10 ${
                        selectedChat?.type === 'user' && selectedChat.id === user.id 
                          ? 'bg-green-500/20 border border-green-500/30' 
                          : 'hover:border-green-500/20 border border-transparent'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3 ${getRandomColor(user.id)}`} onClick={e => { e.stopPropagation(); navigate(`/user/${user.id}`); }} style={{ cursor: 'pointer' }}>
                        {getInitials(user.first_name + ' ' + user.last_name)}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-white font-medium text-sm">{user.first_name} {user.last_name}</p>
                      </div>
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    </button>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

function ChatBox({ selectedChat, currentUser, showHeader = true }: { selectedChat: ChatTarget | null; currentUser: UserItem; showHeader?: boolean }) {
  // All hooks at the top
  const [messages, setMessages] = React.useState<any[]>([]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const messagesContainerRef = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [chatUser, setChatUser] = useState<UserItem | null>(null);
  const [senderMap, setSenderMap] = useState<{ [id: string]: { first_name: string; last_name: string } }>({});
  const [showEmotePicker, setShowEmotePicker] = useState(false);
  const emojiList = ['😀', '😂', '😍', '👍', '🙏', '🎉', '😎', '😢', '🔥', '❤️'];
  const { refreshUnreadMessages } = useUnreadMessages();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { isActionBlocked, getBlockedMessage } = useProfileCompletion();

  // Fetch chatUser if selectedChat.type === 'user'
  useEffect(() => {
    if (selectedChat && selectedChat.type === 'user') {
      console.log('ChatBox fetching user data for ID:', selectedChat.id);
      supabase
        .from('users')
        .select('id, first_name, last_name')
        .eq('id', selectedChat.id)
        .single()
        .then(({ data, error }) => {
          console.log('ChatBox user data fetched:', data);
          console.log('ChatBox user error:', error);
          if (error) {
            console.error('Error fetching user data:', error);
            setChatUser(null);
          } else if (data) {
            setChatUser(data);
          } else {
            console.log('No user data found for ID:', selectedChat.id);
            setChatUser(null);
          }
        });
    } else {
      setChatUser(null);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (!selectedChat) return;

    let mounted = true;
    setLoading(true);
    
    // Fetch messages for the selected chat
    const fetchMessages = async () => {
      try {
        // For user-to-user messages, we need to get messages between these two specific users
        const queryString = `and(sender_id.eq.${currentUser.id},receiver_id.eq.${selectedChat.id}),and(sender_id.eq.${selectedChat.id},receiver_id.eq.${currentUser.id})`;
        
        const query = supabase
          .from('messages')
          .select('*')
          .or(queryString)
          .order('created_at', { ascending: true });

        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching messages:', error);
          // Fallback sample messages when database fetch fails
          const sampleMessages = [
            {
              id: '1',
              sender_id: selectedChat.id,
              receiver_id: currentUser.id,
              content: 'Hey! I have a project I need help with.',
              created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString()
            },
            {
              id: '2',
              sender_id: currentUser.id,
              receiver_id: selectedChat.id,
              content: 'Hi! I would love to help. What kind of project is it?',
              created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
            },
            {
              id: '3',
              sender_id: selectedChat.id,
              receiver_id: currentUser.id,
              content: 'It\'s a website redesign. Can we discuss the details?',
              created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString()
            }
          ];
          if (mounted) {
            setMessages(sampleMessages);
          }
        } else if (mounted) {
          setMessages(data || []);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchMessages();

    // Subscribe to new messages with improved filtering
    const sub = supabase
      .channel(`realtime:messages:${selectedChat.id}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages'
      }, (payload: { new: any }) => {
        if (mounted) {
          const newMessage = payload.new;
          
          // Check if this message belongs to the current chat
          const isRelevant = (newMessage.sender_id === currentUser.id && newMessage.receiver_id === selectedChat.id) ||
            (newMessage.sender_id === selectedChat.id && newMessage.receiver_id === currentUser.id);
          
          if (isRelevant) {
            setMessages(msgs => {
              // Check if message already exists to avoid duplicates
              const exists = msgs.find(msg => msg.id === newMessage.id);
              if (exists) {
                return msgs;
              }
              return [...msgs, newMessage];
            });
          }
        }
      })
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(sub);
    };
  }, [selectedChat, currentUser.id]);

  // Fetch sender info for all unique sender_ids in messages
  useEffect(() => {
    if (!messages || messages.length === 0) return;
    const uniqueSenderIds = Array.from(new Set(messages.map(msg => msg.sender_id)));
    const missingIds = uniqueSenderIds.filter(id => !senderMap[id]);
    if (missingIds.length === 0) return;
    Promise.all(
      missingIds.map(id =>
        supabase
          .from('users')
          .select('id, first_name, last_name')
          .eq('id', id)
          .single()
          .then(({ data }) => ({ id, data }))
      )
    ).then(results => {
      const newMap = { ...senderMap };
      results.forEach(({ id, data }) => {
        if (data) newMap[id] = { first_name: data.first_name, last_name: data.last_name };
      });
      setSenderMap(newMap);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  // Track previous selectedChat and last message id
  const prevChatIdRef = useRef<string | null>(null);
  const prevLastMsgIdRef = useRef<string | null>(null);

  // Scroll to bottom logic: only scroll if content is actually scrollable
  useEffect(() => {
    if (loading || !selectedChat) return;
    if (messages.length === 0) return;

    const lastMsgId = messages[messages.length - 1]?.id;
    const chatId = selectedChat.id;

    const scroll = () => {
      const container = messagesContainerRef.current;
      if (!container) return;

      // Only scroll if content is actually scrollable
      const isScrollable = container.scrollHeight > container.clientHeight + 8; // 8px fudge for borders
      if (isScrollable) {
        container.scrollTop = container.scrollHeight;
      }

      prevChatIdRef.current = chatId;
      prevLastMsgIdRef.current = lastMsgId;
    };

    requestAnimationFrame(scroll);
  }, [loading, selectedChat, messages]);

  // 1. When sending a message, set unread=true for the receiver
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('sendMessage called, input:', input, 'selectedChat:', selectedChat);
    
    if (!selectedChat || !input || input.trim().length === 0 || !currentUser) {
      console.log('sendMessage early return - selectedChat:', selectedChat, 'input:', input, 'currentUser:', currentUser);
      return;
    }

    // Check if profile is complete before sending message
    if (isActionBlocked('send_message')) {
      console.log('Profile not complete, blocking message');
      alert(getBlockedMessage('send_message'));
      return;
    }

    try {
      let newMessage;
      if (selectedChat.type === 'user') {
        newMessage = {
          sender_id: currentUser.id,
          receiver_id: selectedChat.id,
          content: input.trim(),
          unread: true // Only the receiver gets unread: true
        };
      } else {
        newMessage = {
          sender_id: currentUser.id,
          group_id: selectedChat.id,
          content: input.trim()
          // No unread for group messages
        };
      }

      const { data, error } = await supabase
        .from('messages')
        .insert([newMessage])
        .select();

      if (error) {
        console.error('Error sending message:', error);
        // Fallback: add message to UI even if database insert fails
        const fallbackMessage = {
          id: Date.now().toString(),
          sender_id: currentUser.id,
          receiver_id: selectedChat.type === 'user' ? selectedChat.id : undefined,
          group_id: selectedChat.type === 'group' ? selectedChat.id : undefined,
          content: input.trim(),
          created_at: new Date().toISOString()
        };
        setMessages(prev => [...prev, fallbackMessage]);
        setInput('');
      } else {
        setInput('');
        // Optimistically add the message to the UI
        if (data && data[0]) {
          setMessages(prev => [...prev, data[0]]);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // 2. When opening a chat, mark all messages from the selected user to the current user as read
  React.useEffect(() => {
    if (!selectedChat || !currentUser) return;
    if (selectedChat.type !== 'user') return;
    // Mark all messages from selected user to current user as read
    const markAsRead = async () => {
      console.log('[markAsRead] currentUser.id:', currentUser.id, typeof currentUser.id);
      console.log('[markAsRead] selectedChat.id:', selectedChat.id, typeof selectedChat.id);
      const { data, error } = await supabase
        .from('messages')
        .update({ unread: false })
        .eq('sender_id', String(selectedChat.id))
        .eq('receiver_id', String(currentUser.id));
      console.log('[markAsRead] Updated messages:', data, 'Error:', error);
      setTimeout(() => {
        refreshUnreadMessages();
      }, 300);
    };
    markAsRead();
  }, [selectedChat, currentUser, refreshUnreadMessages]);

  // 3. Add a function to fetch the count of unread messages for the current user
  // This function is now at the top-level

  // 4. Export a helper to fetch unread notifications for the NotificationsPage
  // This function is now at the top-level

  // Only after all hooks, do your early returns:
  if (!currentUser) {
    return <LoadingScreen message="Loading user data..." size="sm" />;
  }
  
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
          <p className="text-green-400/60">Choose a user or group to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Chat Header */}
      {showHeader && (
        <div className="flex items-center p-4 border-b border-green-500/20 bg-dark-900/30 flex-shrink-0">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3 ${
              selectedChat?.type === 'user' && chatUser ? getRandomColor(chatUser?.id || '') : 'bg-blue-500'
            }`}
            style={{ cursor: selectedChat?.type === 'user' ? 'pointer' : 'default' }}
            onClick={() => {
              if (selectedChat?.type === 'user') {
                navigate(`/user/${selectedChat.id}`);
              }
            }}
          >
            {selectedChat?.type === 'user' && chatUser
              ? getInitials((chatUser?.first_name || '') + ' ' + (chatUser?.last_name || ''))
              : getInitials(selectedChat?.name || '')}
          </div>
          <div
            className="flex-1"
            style={{ cursor: selectedChat?.type === 'user' ? 'pointer' : 'default' }}
            onClick={() => {
              if (selectedChat?.type === 'user') {
                navigate(`/user/${selectedChat.id}`);
              }
            }}
          >
            <h3 className="text-white font-semibold">
              {selectedChat?.type === 'user' && chatUser 
                ? `${chatUser.first_name} ${chatUser.last_name}` 
                : selectedChat?.name || 'Unknown User'}
            </h3>
            {selectedChat?.type === 'user' && (
              <p className="text-green-400/40 text-xs">
                Debug: selectedChat.name="{selectedChat?.name}" | chatUser="{chatUser?.first_name} {chatUser?.last_name}" | chatUser exists: {chatUser ? 'yes' : 'no'}
              </p>
            )}
            <p className="text-green-400/60 text-sm">
              {selectedChat?.type === 'user' ? 'Online' : 'Group'}
            </p>
          </div>
          {/* Removed call and video call icons */}
        </div>
      )}

      {/* Messages Area */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-dark-900/10 min-h-0">
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
            const isOwnMessage = msg.sender_id === currentUser.id;
            const showAvatar = index === 0 || messages[index - 1]?.sender_id !== msg.sender_id;
            return (
              <div
                key={msg.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} items-end max-w-xs lg:max-w-md`}>
                  {!isOwnMessage && (
                    showAvatar ? (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs mr-2 mb-1 ${getRandomColor(msg.sender_id)}`} onClick={() => navigate(`/user/${msg.sender_id}`)} style={{ cursor: 'pointer' }}>
                        {senderMap[msg.sender_id] ? getInitials(senderMap[msg.sender_id].first_name + ' ' + senderMap[msg.sender_id].last_name) : '?'}
                      </div>
                    ) : (
                      // Placeholder to reserve space for avatar
                      <div className="w-8 h-8 mr-2 mb-1" />
                    )
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
      <form onSubmit={sendMessage} className="flex items-center p-4 border-t border-green-500/20 bg-dark-900/30 flex-shrink-0">
        <button
            type="button"
            className="p-2 text-green-400 hover:text-green-300 transition-colors relative"
            onClick={() => setShowEmotePicker(v => !v)}
            tabIndex={-1}
        >
          <span role="img" aria-label="emoji">😊</span>
        </button>
        {/* Emoji Picker Popover */}
        {showEmotePicker && (
          <div className="absolute bottom-14 left-0 bg-white dark:bg-dark-800 rounded-lg shadow-lg p-2 flex flex-wrap gap-2 z-50">
            {emojiList.map(emoji => (
              <button
                key={emoji}
                type="button"
                className="text-2xl p-1 hover:bg-green-100 dark:hover:bg-green-900 rounded transition"
                onClick={e => {
                  e.preventDefault();
                  setInput(input + emoji);
                  setShowEmotePicker(false);
                  setTimeout(() => {
                    if (inputRef.current) inputRef.current.focus();
                  }, 0);
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              console.log('Enter pressed, input:', input, 'trimmed length:', input.trim().length);
              if (input && input.trim().length > 0) {
                console.log('Calling sendMessage from onKeyDown');
                sendMessage(e);
              } else {
                console.log('Input validation failed in onKeyDown');
              }
            }
          }}
          placeholder="Type your message..."
          className="flex-1 px-4 py-3 bg-dark-800/50 border border-green-500/30 rounded-lg text-white placeholder-green-400/60 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={!input || input.trim().length === 0}
          className="p-3 bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
}

export { ChatSidebar };
export { ChatBox };

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // If user is not loaded, show a message and a Sign In button
  if (!user) {
    return (
      <div className="text-center text-green-600 mt-12 flex flex-col items-center gap-4">
        <div>Please log in to use chat.</div>
        <button
          className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
          onClick={() => navigate('/auth')}
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <DashboardOverview />
  );
};



export async function fetchUnreadMessageCount(userId: string) {
  const { count, error } = await supabase
    .from('messages')
    .select('id', { count: 'exact', head: true })
    .eq('receiver_id', userId)
    .eq('unread', true);
  return count || 0;
}

export async function fetchUnreadNotifications(userId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select('id, sender_id, content, created_at')
    .eq('receiver_id', userId)
    .eq('unread', true)
    .order('created_at', { ascending: false });
  return (data || []).map((msg: any) => ({
    id: msg.id,
    type: 'message',
    from: msg.sender_id,
    content: msg.content,
    created_at: msg.created_at
  }));
}
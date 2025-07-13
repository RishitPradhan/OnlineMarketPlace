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

// ChatSidebar: shows users and groups, allows selection
const ChatSidebar: React.FC<ChatSidebarProps> = ({ onSelect, selectedChat, currentUser }) => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [recentChats, setRecentChats] = useState<UserItem[]>([]);
  const [groups, setGroups] = useState<GroupItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'groups' | 'recent'>('recent');
  const [loading, setLoading] = useState(false);

  // Fetch users who have messaged the current user (recent chats)
  useEffect(() => {
    const fetchRecentChats = async () => {
      try {
        // Debug: Check current user ID
        console.log('🔍 Current user ID from auth:', currentUser.id);
        
        // Check if user exists in users table
        const { data: userCheck, error: userCheckError } = await supabase
          .from('users')
          .select('id, first_name, last_name')
          .eq('id', currentUser.id)
          .single();
        
        console.log('🔍 User check in users table:', { userCheck, userCheckError });
        
        // Get all messages where current user is receiver
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('sender_id, sender:users!sender_id(id, first_name, last_name)')
          .eq('receiver_id', currentUser.id)
          .neq('sender_id', currentUser.id);

        console.log('📨 Recent chats query result:', { messagesData, messagesError });

        if (!messagesError && messagesData && messagesData.length > 0) {
          // Extract unique users from messages
          const uniqueUsers = messagesData.reduce((acc: UserItem[], msg: any) => {
            if (msg.sender && !acc.find(u => u.id === msg.sender.id)) {
              acc.push({
                id: msg.sender.id,
                first_name: msg.sender.first_name,
                last_name: msg.sender.last_name
              });
            }
            return acc;
          }, []);
          
          console.log('👥 Unique users found:', uniqueUsers);
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
    console.log('🔔 Setting up real-time subscription for recent chats');
    
    // Test basic connection
    const connectionTest = supabase
      .channel('connection-test')
      .on('system', { event: 'disconnect' }, () => {
        console.log('🔌 Disconnected from real-time');
      })
      .on('system', { event: 'connect' }, () => {
        console.log('🔌 Connected to real-time');
      })
      .subscribe((status) => {
        console.log('🔌 Connection test status:', status);
      });
    
    // Test subscription to see if real-time is working
    const testSub = supabase
      .channel('test-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, (payload) => {
        console.log('🧪 TEST: Any message change detected:', payload);
      })
      .subscribe((status) => {
        console.log('🧪 TEST subscription status:', status);
      });
    
    const sub = supabase
      .channel('realtime:recent-chats')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, async (payload: { new: any }) => {
        const newMessage = payload.new;
        console.log('📨 New message received in real-time:', newMessage);
        console.log('👤 Current user ID:', currentUser.id);
        
        // If someone sent a message to current user, add them to recent chats
        if (newMessage.receiver_id === currentUser.id && newMessage.sender_id !== currentUser.id) {
          console.log('✅ Message is for current user, fetching sender data...');
          try {
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('id, first_name, last_name')
              .eq('id', newMessage.sender_id)
              .single();

            console.log('👤 User data fetched:', { userData, userError });

            if (userData) {
              setRecentChats(prev => {
                const user = {
                  id: userData.id,
                  first_name: userData.first_name,
                  last_name: userData.last_name
                };
                
                // Add user if not already in recent chats
                if (!prev.find(u => u.id === user.id)) {
                  console.log('➕ Adding new user to recent chats:', user);
                  return [user, ...prev];
                }
                console.log('⚠️ User already in recent chats');
                return prev;
              });
            }
          } catch (error) {
            console.error('❌ Error fetching new user data:', error);
          }
        } else {
          console.log('❌ Message not relevant for current user');
        }
      })
      .subscribe((status) => {
        console.log('🔔 Subscription status:', status);
      });

    return () => {
      console.log('🧹 Cleaning up real-time subscriptions');
      supabase.removeChannel(sub);
      supabase.removeChannel(testSub);
      supabase.removeChannel(connectionTest);
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

  useEffect(() => {
    // Fetch groups for current user (unchanged)
    supabase
      .from('group_members')
      .select('group_id, groups (id, name)')
      .eq('user_id', currentUser.id)
      .then(({ data, error }) => {
        setGroups((data as any[] || []).map(g => g.groups as GroupItem));
      });
  }, [currentUser.id]);

  if (!currentUser) {
    return <LoadingScreen message="Loading user data..." size="sm" />;
  }

  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (first_name: string, last_name: string) => {
    return (first_name?.[0] || '') + (last_name?.[0] || '');
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
            placeholder="Search users by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-dark-800/50 border border-green-500/30 rounded-lg text-white placeholder-green-400/60 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <svg className="absolute right-3 top-2.5 w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        {/* Test button for real-time */}
        <button
          onClick={async () => {
            console.log('🧪 Testing real-time by inserting a test message...');
            console.log('👤 Current user ID:', currentUser.id);
            
            // First check if user exists in users table
            const { data: userCheck, error: userCheckError } = await supabase
              .from('users')
              .select('*')
              .eq('id', currentUser.id)
              .single();
            
            console.log('🔍 User check result:', { userCheck, userCheckError });
            
            if (userCheckError) {
              console.error('❌ User not found in users table! This is the problem.');
              return;
            }
            
            // Try to insert a test message
            const { data, error } = await supabase
              .from('messages')
              .insert({
                sender_id: currentUser.id,
                receiver_id: currentUser.id, // Send to self for testing
                content: 'Test message ' + new Date().toISOString()
              })
              .select();
            
            console.log('🧪 Test message result:', { data, error });
            
            if (error) {
              console.error('❌ Failed to insert test message:', error);
            } else {
              console.log('✅ Test message inserted successfully');
            }
          }}
          className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
        >
          Test Real-time
        </button>
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
        <button
          onClick={() => setActiveTab('groups')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'groups' 
              ? 'text-green-400 border-b-2 border-green-400 bg-green-400/10' 
              : 'text-green-400/60 hover:text-green-400'
          }`}
        >
          Groups ({filteredGroups.length})
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
                    onClick={() => onSelect({ type: 'user', id: user.id, name: `${user.first_name} ${user.last_name}` })}
                    className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-green-500/10 ${
                      selectedChat?.type === 'user' && selectedChat.id === user.id 
                        ? 'bg-green-500/20 border border-green-500/30' 
                        : 'hover:border-green-500/20 border border-transparent'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3 ${getRandomColor(user.id)}`}>
                      {getInitials(user.first_name, user.last_name)}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-white font-medium text-sm">{user.first_name} {user.last_name}</p>
                      <p className="text-green-400/60 text-xs">Recent chat</p>
                    </div>
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'users' ? (
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
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3 ${getRandomColor(user.id)}`}>
                        {getInitials(user.first_name, user.last_name)}
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
        ) : (
          <div className="p-4">
            {/* Groups logic unchanged */}
          </div>
        )}
      </div>
    </div>
  );
};

function ChatBox({ selectedChat, currentUser }: { selectedChat: ChatTarget | null; currentUser: UserItem }) {
  const [messages, setMessages] = React.useState<any[]>([]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const messagesContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!selectedChat) return;

    let mounted = true;
    setLoading(true);
    
    // Fetch messages for the selected chat
    const fetchMessages = async () => {
      try {
        let query;
        if (selectedChat.type === 'user') {
          // For user-to-user messages, we need to get messages between these two specific users
          const queryString = `and(sender_id.eq.${currentUser.id},receiver_id.eq.${selectedChat.id}),and(sender_id.eq.${selectedChat.id},receiver_id.eq.${currentUser.id})`;
          
          query = supabase
            .from('messages')
            .select('*')
            .or(queryString)
            .order('created_at', { ascending: true });
        } else {
          query = supabase
            .from('messages')
            .select('*')
            .eq('group_id', selectedChat.id)
            .order('created_at', { ascending: true });
        }

        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching messages:', error);
          // Fallback sample messages when database fetch fails
          if (selectedChat.type === 'user') {
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
          console.log('📨 New message received in ChatBox:', newMessage);
          console.log('💬 Current messages count:', messages.length);
          
          // Check if this message belongs to the current chat
          const isRelevant = selectedChat.type === 'user' 
            ? (newMessage.sender_id === currentUser.id && newMessage.receiver_id === selectedChat.id) ||
              (newMessage.sender_id === selectedChat.id && newMessage.receiver_id === currentUser.id)
            : newMessage.group_id === selectedChat.id;
          
          console.log('🎯 Is message relevant for current chat?', isRelevant);
          console.log('👤 Current user ID:', currentUser.id);
          console.log('💬 Selected chat ID:', selectedChat.id);
          
          if (isRelevant) {
            setMessages(msgs => {
              // Check if message already exists to avoid duplicates
              const exists = msgs.find(msg => msg.id === newMessage.id);
              if (exists) {
                console.log('⚠️ Message already exists, skipping');
                return msgs;
              }
              console.log('➕ Adding new message to chat');
              return [...msgs, newMessage];
            });
          } else {
            console.log('❌ Message not relevant for current chat');
          }
        }
      })
      .subscribe((status) => {
        console.log('🔔 ChatBox subscription status:', status);
      });

    return () => {
      mounted = false;
      supabase.removeChannel(sub);
    };
  }, [selectedChat, currentUser.id]);

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

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChat || !input.trim() || !currentUser) return;

    try {
      const newMessage = {
        sender_id: currentUser.id,
        content: input.trim(),
        ...(selectedChat.type === 'user' 
          ? { receiver_id: selectedChat.id }
          : { group_id: selectedChat.id }
        ),
      };

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

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRandomColor = (id: string) => {
    const colors = ['bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-yellow-500', 'bg-indigo-500'];
    return colors[id.charCodeAt(0) % colors.length];
  };

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
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center p-4 border-b border-green-500/20 bg-dark-900/30">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3 ${
          selectedChat.type === 'user' ? getRandomColor(selectedChat.id) : 'bg-blue-500'
        }`}>
          {getInitials(selectedChat.name)}
        </div>
        <div className="flex-1">
          <h3 className="text-white font-semibold">{selectedChat.name}</h3>
          <p className="text-green-400/60 text-sm">
            {selectedChat.type === 'user' ? 'Online' : 'Group'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-green-400 hover:text-green-300 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
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
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 flex flex-col space-y-4">
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
                  {!isOwnMessage && showAvatar && (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs mr-2 mb-1 ${getRandomColor(msg.sender_id)}`}>
                      {getInitials(msg.sender_id)}
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
      <div className="p-4 border-t border-green-500/20 bg-dark-900/30">
        <form onSubmit={sendMessage} className="flex items-center space-x-3">
          <button
            type="button"
            className="p-2 text-green-400 hover:text-green-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828L18 9.828a2 2 0 000-2.828z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01" />
            </svg>
          </button>
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            className="flex-1 px-4 py-3 bg-dark-800/50 border border-green-500/30 rounded-lg text-white placeholder-green-400/60 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-3 bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState<ChatTarget | null>(null);

  // Handle URL parameters for tab switching
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, []);

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

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'browse':
        return (
          <div className="p-8 bg-gradient-to-br from-dark-950 to-dark-900 dark:from-dark-950 dark:to-dark-900 from-white to-white min-h-full">
            <div className="glass-effect rounded-xl p-12">
              <h2 className="text-4xl font-bold text-white dark:text-white text-green-700 mb-12 text-center">Services</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {featuredWorks.map((work, index) => (
                  <div
                    key={index}
                    className="group transition-all duration-700 hover:scale-105 hover:shadow-2xl bg-white dark:bg-dark-800 rounded-2xl overflow-hidden cursor-pointer"
                    onClick={() => {
                      navigate(`/service/${index + 1}`, { state: { service: work } });
                    }}
                  >
                    <div className="relative overflow-hidden rounded-t-2xl mb-4">
                      <img
                        src={work.image}
                        alt={work.title}
                        className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-500"></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300 text-center">{work.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'my-gigs':
        return (
          <div className="p-8 bg-gradient-to-br from-dark-950 to-dark-900 dark:from-dark-950 dark:to-dark-900 from-white to-white min-h-full">
            <div className="glass-effect rounded-xl p-12 text-center">
              <h2 className="text-4xl font-bold text-white dark:text-white text-green-700 mb-8">My Elite Gigs</h2>
              <p className="text-dark-300 dark:text-dark-300 text-green-600 text-xl">Gig management system coming soon...</p>
            </div>
          </div>
        );
      case 'my-orders':
        return (
          <div className="p-8 bg-gradient-to-br from-dark-950 to-dark-900 dark:from-dark-950 dark:to-dark-900 from-white to-white min-h-full">
            <div className="glass-effect rounded-xl p-12">
              <h2 className="text-4xl font-bold text-white dark:text-white text-green-700 mb-12 text-center">My Orders</h2>
              <OrderTrackingTable />
            </div>
          </div>
        );
      case 'orders':
        return (
          <div className="p-8 bg-gradient-to-br from-dark-950 to-dark-900 dark:from-dark-950 dark:to-dark-900 from-white to-white min-h-full">
            <div className="glass-effect rounded-xl p-12 text-center">
              <h2 className="text-4xl font-bold text-white dark:text-white text-green-700 mb-8">Active Orders</h2>
              <p className="text-dark-300 dark:text-dark-300 text-green-600 text-xl">Order management coming soon...</p>
            </div>
          </div>
        );
      case 'messages':
        // Use the real messaging UI, not MockMessaging
        // Map user to UserItem shape for ChatSidebar/ChatBox
        const userItem = user ? {
          id: user.id,
          first_name: user.firstName,
          last_name: user.lastName
        } : undefined;
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
                  {userItem && (
                    <ChatSidebar 
                      onSelect={setSelectedChat} 
                      selectedChat={selectedChat} 
                      currentUser={userItem} 
                    />
                  )}
                </div>
              </div>
              {/* Main Chat Area */}
              <div className="flex-1 flex flex-col">
                {userItem && <ChatBox selectedChat={selectedChat} currentUser={userItem} />}
              </div>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="p-8 bg-gradient-to-br from-dark-950 to-dark-900 dark:from-dark-950 dark:to-dark-900 from-white to-white min-h-full">
            <div className="glass-effect rounded-xl p-12 text-center">
              <h2 className="text-4xl font-bold text-white dark:text-white text-green-700 mb-8">Analytics</h2>
              <p className="text-dark-300 dark:text-dark-300 text-green-600 text-xl">Advanced analytics coming soon...</p>
            </div>
          </div>
        );
      case 'reviews':
        return (
          <div className="p-8 bg-gradient-to-br from-dark-950 to-dark-900 dark:from-dark-950 dark:to-dark-900 from-white to-white min-h-full">
            <div className="glass-effect rounded-xl p-12 text-center">
              <h2 className="text-4xl font-bold text-white dark:text-white text-green-700 mb-8">Reviews</h2>
              <p className="text-dark-300 dark:text-dark-300 text-green-600 text-xl">Review system coming soon...</p>
            </div>
          </div>
        );
      case 'earnings':
        return (
          <div className="p-8 bg-gradient-to-br from-dark-950 to-dark-900 dark:from-dark-950 dark:to-dark-900 from-white to-white min-h-full">
            <div className="glass-effect rounded-xl p-12 text-center">
              <h2 className="text-4xl font-bold text-white dark:text-white text-green-700 mb-8">Earnings</h2>
              <p className="text-dark-300 dark:text-dark-300 text-green-600 text-xl">Earnings dashboard coming soon...</p>
            </div>
          </div>
        );
      case 'payments':
        return (
          <div className="p-8 bg-gradient-to-br from-dark-950 to-dark-900 dark:from-dark-950 dark:to-dark-900 from-white to-white min-h-full">
            <div className="glass-effect rounded-xl p-12 text-center">
              <h2 className="text-4xl font-bold text-white dark:text-white text-green-700 mb-8">Payments</h2>
              <p className="text-dark-300 dark:text-dark-300 text-green-600 text-xl">Payment system coming soon...</p>
            </div>
          </div>
        );
      case 'users':
        return (
          <div className="p-8 bg-gradient-to-br from-dark-950 to-dark-900 dark:from-dark-950 dark:to-dark-900 from-white to-white min-h-full">
            <div className="glass-effect rounded-xl p-12 text-center">
              <h2 className="text-4xl font-bold text-white dark:text-white text-green-700 mb-8">User Management</h2>
              <p className="text-dark-300 dark:text-dark-300 text-green-600 text-xl">User administration coming soon...</p>
            </div>
          </div>
        );
      case 'gigs':
        return (
          <div className="p-8 bg-gradient-to-br from-dark-950 to-dark-900 dark:from-dark-950 dark:to-dark-900 from-white to-white min-h-full">
            <div className="glass-effect rounded-xl p-12 text-center">
              <h2 className="text-4xl font-bold text-white dark:text-white text-green-700 mb-8">Gig Management</h2>
              <p className="text-dark-300 dark:text-dark-300 text-green-600 text-xl">Gig administration coming soon...</p>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="p-8 bg-gradient-to-br from-dark-950 to-dark-900 dark:from-dark-950 dark:to-dark-900 from-white to-white min-h-full">
            <div className="glass-effect rounded-xl p-12 text-center">
              <h2 className="text-4xl font-bold text-white dark:text-white text-green-700 mb-8">Profile</h2>
              <p className="text-dark-300 dark:text-dark-300 text-green-600 text-xl">Profile management coming soon...</p>
            </div>
          </div>
        );
      case 'onboarding':
        return (
          <div className="p-8 bg-gradient-to-br from-dark-950 to-dark-900 dark:from-dark-950 dark:to-dark-900 from-white to-white min-h-full">
            <div className="glass-effect rounded-xl p-12 text-center">
              <h2 className="text-4xl font-bold text-white dark:text-white text-green-700 mb-8">Onboarding Hub</h2>
              <p className="text-dark-300 dark:text-dark-300 text-green-600 text-xl mb-8">
                Welcome to your onboarding journey! Complete these steps to set up your freelancing business.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <button 
                  onClick={() => navigate('/getting-started')}
                  className="p-6 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-300 hover:scale-105"
                >
                  <div className="text-3xl mb-2">🚀</div>
                  <h3 className="text-xl font-semibold mb-2">Getting Started Guide</h3>
                  <p className="text-sm opacity-90">Step-by-step setup guide</p>
                </button>
                <button 
                  onClick={() => navigate('/profile-completion')}
                  className="p-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 hover:scale-105"
                >
                  <div className="text-3xl mb-2">📋</div>
                  <h3 className="text-xl font-semibold mb-2">Profile Completion</h3>
                  <p className="text-sm opacity-90">Complete your profile</p>
                </button>
                <button 
                  onClick={() => navigate('/quick-start')}
                  className="p-6 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300 hover:scale-105"
                >
                  <div className="text-3xl mb-2">⚡</div>
                  <h3 className="text-xl font-semibold mb-2">Quick Start Actions</h3>
                  <p className="text-sm opacity-90">Priority tasks to complete</p>
                </button>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return <Settings />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-dark-950 to-dark-900 dark:from-dark-950 dark:to-dark-900 from-white to-white">
      <Navbar user={user} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          user={user} 
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};
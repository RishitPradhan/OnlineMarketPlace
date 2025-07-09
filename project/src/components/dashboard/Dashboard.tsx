import React, { useState, useEffect } from 'react';
import { Navbar } from '../layout/Navbar';
import { Sidebar } from '../layout/Sidebar';
import { DashboardOverview } from './DashboardOverview';
import { Settings } from '../settings/Settings';
import { Star, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

// Mock user for now
const mockUser = {
  id: '1',
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'client' as const,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

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
  const filtered = orderData.filter(order =>
    order.title.toLowerCase().includes(search.toLowerCase()) ||
    order.client.toLowerCase().includes(search.toLowerCase()) ||
    order.status.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search orders..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 rounded-lg border border-green-200 bg-dark-900/50 dark:bg-dark-900/50 bg-white text-green-800 dark:text-green-400 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-green-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-green-400 uppercase tracking-wider">Order ID</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-green-400 uppercase tracking-wider">Title</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-green-400 uppercase tracking-wider">Client</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-green-400 uppercase tracking-wider">Amount</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-green-400 uppercase tracking-wider">Status</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-green-400 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-green-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-green-400">No orders found.</td>
              </tr>
            ) : (
              filtered.map(order => (
                <tr key={order.id} className="hover:bg-green-100/10 transition-all">
                  <td className="px-4 py-3 text-green-300 font-mono">{order.id}</td>
                  <td className="px-4 py-3 text-white font-semibold">{order.title}</td>
                  <td className="px-4 py-3 text-green-200">{order.client}</td>
                  <td className="px-4 py-3 text-green-400 font-bold">{order.amount}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${(statusColors as Record<string, string>)[order.status] || 'bg-gray-500/20 text-gray-400'}`}>{order.status}</span>
                  </td>
                  <td className="px-4 py-3 text-green-200">{order.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ChatBox({ selectedChat, currentUser }: { selectedChat: ChatTarget | null; currentUser: UserItem }) {
  const [messages, setMessages] = React.useState<any[]>([]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Hardcoded receiver for demo (replace with real user selection in production)
  const receiverId = '00000000-0000-0000-0000-000000000002';

  React.useEffect(() => {
    let mounted = true;
    setLoading(true);
    supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
      .order('created_at', { ascending: true })
      .then((res: { data: any[] | null }) => {
        if (mounted && res.data) setMessages(res.data);
        setLoading(false);
      });
    // Subscribe to new messages
    const sub = supabase
      .channel('realtime:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload: { new: any }) => {
        setMessages(msgs => [...msgs, payload.new]);
      })
      .subscribe();
    return () => {
      mounted = false;
      supabase.removeChannel(sub);
    };
  }, [currentUser.id]);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !currentUser) return;
    await supabase.from('messages').insert({
      sender_id: currentUser.id,
      receiver_id: receiverId,
      content: input.trim(),
    });
    setInput('');
  };

  if (!currentUser) {
    return <div className="text-center text-green-600 mt-12">Loading user...</div>;
  }

  return (
    <div className="flex flex-col h-[500px]">
      <div className="flex-1 overflow-y-auto space-y-4 p-2 bg-dark-900/50 rounded-lg mb-4">
        {loading ? (
          <div className="text-green-400 text-center">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-green-400 text-center">No messages yet.</div>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.sender_id === currentUser.id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs px-4 py-2 rounded-2xl shadow text-sm ${msg.sender_id === currentUser.id ? 'bg-green-600 text-white' : 'bg-green-100 text-green-900'}`}>
                {msg.content}
                <div className="text-xs text-green-300 mt-1 text-right">{new Date(msg.created_at).toLocaleTimeString()}</div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          className="flex-1 px-4 py-2 rounded-lg border border-green-200 bg-dark-900/50 text-green-200 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Type your message..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button type="submit" className="px-6 py-2 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 transition">Send</button>
      </form>
    </div>
  );
}

// Type definitions
interface UserItem { id: string; email: string; }
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
  const [groups, setGroups] = useState<GroupItem[]>([]);
  useEffect(() => {
    // Fetch users (except current)
    supabase.from('users').select('id, email').then(({ data }) => {
      setUsers((data as UserItem[] || []).filter(u => u.id !== currentUser.id));
    });
    // Fetch groups for current user
    supabase
      .from('group_members')
      .select('group_id, groups (id, name)')
      .eq('user_id', currentUser.id)
      .then(({ data }) => {
        setGroups((data as any[] || []).map(g => g.groups as GroupItem));
      });
  }, [currentUser.id]);

  if (!currentUser) {
    return <div className="text-center text-green-600 mt-12">Loading user...</div>;
  }

  return (
    <div className="bg-white dark:bg-dark-800 rounded-xl shadow p-4 h-full flex flex-col gap-4">
      <div>
        <div className="font-bold text-green-700 dark:text-green-400 mb-2">Users</div>
        <ul className="space-y-2">
          {users.map(u => (
            <li key={u.id}>
              <button
                className={`w-full text-left px-3 py-2 rounded-lg ${selectedChat?.type === 'user' && selectedChat.id === u.id ? 'bg-green-100 dark:bg-green-900' : ''}`}
                onClick={() => onSelect({ type: 'user', id: u.id, name: u.email })}
              >
                {u.email}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className="font-bold text-green-700 dark:text-green-400 mb-2 mt-4">Groups</div>
        <ul className="space-y-2">
          {groups.map(g => (
            <li key={g.id}>
              <button
                className={`w-full text-left px-3 py-2 rounded-lg ${selectedChat?.type === 'group' && selectedChat.id === g.id ? 'bg-green-100 dark:bg-green-900' : ''}`}
                onClick={() => onSelect({ type: 'group', id: g.id, name: g.name })}
              >
                {g.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState<ChatTarget | null>(null);

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
          <div className="p-6 bg-gradient-to-br from-dark-950 to-dark-900 dark:from-dark-950 dark:to-dark-900 from-white to-white min-h-full">
            <div className="glass-effect rounded-xl p-8">
              <h2 className="text-3xl font-bold text-white dark:text-white text-green-700 mb-8 text-center">Featured Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
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
                        className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-500"></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                        {work.category}
                      </div>
                      <h3 className="text-2xl font-bold group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">{work.title}</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-medium">{work.rating}</span>
                          <span className="text-gray-500">({work.reviews})</span>
                        </div>
                        <span className="font-bold text-green-600 dark:text-green-400">
                          {work.price.replace('$', '₹')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'my-gigs':
        return (
          <div className="p-6 bg-gradient-to-br from-dark-950 to-dark-900 dark:from-dark-950 dark:to-dark-900 from-white to-white min-h-full">
            <div className="glass-effect rounded-xl p-8 text-center">
              <h2 className="text-3xl font-bold text-white dark:text-white text-green-700 mb-4">My Elite Gigs</h2>
              <p className="text-dark-300 dark:text-dark-300 text-green-600 text-lg">Gig management system coming soon...</p>
            </div>
          </div>
        );
      case 'my-orders':
        return (
          <div className="p-6 bg-gradient-to-br from-dark-950 to-dark-900 dark:from-dark-950 dark:to-dark-900 from-white to-white min-h-full">
            <div className="glass-effect rounded-xl p-8">
              <h2 className="text-3xl font-bold text-white dark:text-white text-green-700 mb-8 text-center">My Orders</h2>
              <OrderTrackingTable />
            </div>
          </div>
        );
      case 'orders':
        return (
          <div className="p-6 bg-gradient-to-br from-dark-950 to-dark-900 dark:from-dark-950 dark:to-dark-900 from-white to-white min-h-full">
            <div className="glass-effect rounded-xl p-8 text-center">
              <h2 className="text-3xl font-bold text-white dark:text-white text-green-700 mb-4">Active Orders</h2>
              <p className="text-dark-300 dark:text-dark-300 text-green-600 text-lg">Order management coming soon...</p>
            </div>
          </div>
        );
      case 'messages':
        return (
          <div className="p-6 bg-gradient-to-br from-dark-950 to-dark-900 dark:from-dark-950 dark:to-dark-900 from-white to-white min-h-full">
            <div className="glass-effect rounded-xl p-8 max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3">
                <ChatSidebar onSelect={setSelectedChat} selectedChat={selectedChat} currentUser={user as UserItem} />
              </div>
              <div className="w-full md:w-2/3">
                <h2 className="text-3xl font-bold text-white dark:text-white text-green-700 mb-8 text-center">Messages</h2>
                <ChatBox selectedChat={selectedChat} currentUser={user as UserItem} />
              </div>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="p-6 bg-gradient-to-br from-dark-950 to-dark-900 dark:from-dark-950 dark:to-dark-900 from-white to-white min-h-full">
            <div className="glass-effect rounded-xl p-8 text-center">
              <h2 className="text-3xl font-bold text-white dark:text-white text-green-700 mb-4">Analytics</h2>
              <p className="text-dark-300 dark:text-dark-300 text-green-600 text-lg">Advanced analytics coming soon...</p>
            </div>
          </div>
        );
      case 'reviews':
        return (
          <div className="p-6 bg-gradient-to-br from-dark-950 to-dark-900 dark:from-dark-950 dark:to-dark-900 from-white to-white min-h-full">
            <div className="glass-effect rounded-xl p-8 text-center">
              <h2 className="text-3xl font-bold text-white dark:text-white text-green-700 mb-4">Reviews</h2>
              <p className="text-dark-300 dark:text-dark-300 text-green-600 text-lg">Review system coming soon...</p>
            </div>
          </div>
        );
      case 'earnings':
        return (
          <div className="p-6 bg-gradient-to-br from-dark-950 to-dark-900 dark:from-dark-950 dark:to-dark-900 from-white to-white min-h-full">
            <div className="glass-effect rounded-xl p-8 text-center">
              <h2 className="text-3xl font-bold text-white dark:text-white text-green-700 mb-4">Earnings</h2>
              <p className="text-dark-300 dark:text-dark-300 text-green-600 text-lg">Earnings dashboard coming soon...</p>
            </div>
          </div>
        );
      case 'payments':
        return (
          <div className="p-6 bg-gradient-to-br from-dark-950 to-dark-900 dark:from-dark-950 dark:to-dark-900 from-white to-white min-h-full">
            <div className="glass-effect rounded-xl p-8 text-center">
              <h2 className="text-3xl font-bold text-white dark:text-white text-green-700 mb-4">Payments</h2>
              <p className="text-dark-300 dark:text-dark-300 text-green-600 text-lg">Payment system coming soon...</p>
            </div>
          </div>
        );
      case 'users':
        return (
          <div className="p-6 bg-gradient-to-br from-dark-950 to-dark-900 dark:from-dark-950 dark:to-dark-900 from-white to-white min-h-full">
            <div className="glass-effect rounded-xl p-8 text-center">
              <h2 className="text-3xl font-bold text-white dark:text-white text-green-700 mb-4">User Management</h2>
              <p className="text-dark-300 dark:text-dark-300 text-green-600 text-lg">User administration coming soon...</p>
            </div>
          </div>
        );
      case 'gigs':
        return (
          <div className="p-6 bg-gradient-to-br from-dark-950 to-dark-900 dark:from-dark-950 dark:to-dark-900 from-white to-white min-h-full">
            <div className="glass-effect rounded-xl p-8 text-center">
              <h2 className="text-3xl font-bold text-white dark:text-white text-green-700 mb-4">Gig Management</h2>
              <p className="text-dark-300 dark:text-dark-300 text-green-600 text-lg">Gig administration coming soon...</p>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="p-6 bg-gradient-to-br from-dark-950 to-dark-900 dark:from-dark-950 dark:to-dark-900 from-white to-white min-h-full">
            <div className="glass-effect rounded-xl p-8 text-center">
              <h2 className="text-3xl font-bold text-white dark:text-white text-green-700 mb-4">Profile</h2>
              <p className="text-dark-300 dark:text-dark-300 text-green-600 text-lg">Profile management coming soon...</p>
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
      <Navbar user={mockUser} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} user={mockUser} />
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};
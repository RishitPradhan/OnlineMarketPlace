import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LOCAL_PROFILE_KEY = 'profileData';
const LOCAL_SKILLS_KEY = 'skillsData';
const LOCAL_SERVICES_KEY = 'servicesData';
const LOCAL_PORTFOLIO_KEY = 'portfolioProjects';

export const DashboardOverview: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showGettingStartedGuide, setShowGettingStartedGuide] = React.useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [profileChecks, setProfileChecks] = useState({
    profile: false,
    bio: false,
    portfolio: false,
    skills: false
  });

  useEffect(() => {
    function recalcProfileCompletion() {
      const profileRaw = localStorage.getItem(LOCAL_PROFILE_KEY);
      let profile = null;
      if (profileRaw) profile = JSON.parse(profileRaw);
      // Skills
      const skillsRaw = localStorage.getItem(LOCAL_SKILLS_KEY);
      const skills = skillsRaw ? JSON.parse(skillsRaw) : [];
      // Portfolio
      const portfolioRaw = localStorage.getItem(LOCAL_PORTFOLIO_KEY);
      const portfolio = portfolioRaw ? JSON.parse(portfolioRaw) : [];

      const checks = {
        profile: !!(profile && profile.firstName && profile.lastName && profile.hourlyRate && profile.location),
        bio: !!(profile && profile.bio && String(profile.bio).trim() !== ''),
        portfolio: Array.isArray(portfolio) && portfolio.length > 0,
        skills: Array.isArray(skills) && skills.length > 0
      };
      setProfileChecks(checks);
      const completed = Object.values(checks).filter(Boolean).length;
      setProfileCompletion(Math.round((completed / 4) * 100));
    }
    recalcProfileCompletion();
    window.addEventListener('storage', recalcProfileCompletion);
    window.addEventListener('skills-updated', recalcProfileCompletion);
    return () => {
      window.removeEventListener('storage', recalcProfileCompletion);
      window.removeEventListener('skills-updated', recalcProfileCompletion);
    };
  }, []);
  
  // Function to switch dashboard tabs
  const switchToTab = (tab: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    window.location.href = url.toString();
  };
  
  // Check if user is new (created in last 7 days)
  const isNewUser = !user || new Date(user.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  if (isNewUser) {
    return (
      <div className="p-6 bg-gradient-to-br from-dark-950 to-dark-900 dark:from-dark-950 dark:to-dark-900 from-white to-white min-h-full">
        {/* Welcome Section for New Users */}
        <Card className="glass-effect neon-border p-8 mb-8 hover-scale-subtle">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white dark:text-white text-green-800 mb-4">
              Welcome to FreelanceHub! 🎉
            </h1>
            <p className="text-dark-300 dark:text-dark-300 text-green-600 text-lg mb-6">
              You're now part of an elite community of freelancers and clients. 
              Let's get you started on your journey to success.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => switchToTab('browse')}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-102"
              >
                Browse Services
              </button>
              {/* Hide Complete Profile button if profileCompletion is 100% */}
              {profileCompletion < 100 && (
                <button 
                  onClick={() => navigate('/profile-completion')}
                  className="px-6 py-3 bg-dark-800 hover:bg-dark-700 text-white border border-green-200 font-semibold rounded-lg transition-all duration-300 transform hover:scale-102"
                >
                  Complete Profile
                </button>
              )}
            </div>
          </div>
        </Card>

        {/* Profile Completion Progress or Complete Message */}
        {profileCompletion < 100 && (
          <Card className="glass-effect neon-border p-6 mb-8 hover-scale-subtle">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white dark:text-white text-green-800">
                Profile Completion
              </h3>
              <span className="text-sm text-green-400">{profileCompletion}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${profileCompletion}%` }}></div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <span className={profileChecks.profile ? 'text-green-500 mr-2' : 'text-red-500 mr-2'}>{profileChecks.profile ? '✓' : '×'}</span>
                <span className="text-gray-300">Profile Info</span>
              </div>
              <div className="flex items-center">
                <span className={profileChecks.bio ? 'text-green-500 mr-2' : 'text-red-500 mr-2'}>{profileChecks.bio ? '✓' : '×'}</span>
                <span className="text-gray-300">Bio Added</span>
              </div>
              <div className="flex items-center">
                <span className={profileChecks.portfolio ? 'text-green-500 mr-2' : 'text-red-500 mr-2'}>{profileChecks.portfolio ? '✓' : '×'}</span>
                <span className="text-gray-300">Portfolio</span>
              </div>
              <div className="flex items-center">
                <span className={profileChecks.skills ? 'text-green-500 mr-2' : 'text-red-500 mr-2'}>{profileChecks.skills ? '✓' : '×'}</span>
                <span className="text-gray-300">Skills</span>
              </div>
            </div>
          </Card>
        )}

        {/* Getting Started Guide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-effect neon-border p-6 hover-scale-subtle">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-lg font-semibold text-white dark:text-white text-green-800 mb-2">
                Explore Services
              </h3>
              <p className="text-dark-300 dark:text-dark-300 text-green-600 text-sm">
                Browse through our curated collection of premium services
              </p>
            </div>
          </Card>

          <Card className="glass-effect neon-border p-6 hover-scale-subtle">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-lg font-semibold text-white dark:text-white text-green-800 mb-2">
                Connect
              </h3>
              <p className="text-dark-300 dark:text-dark-300 text-green-600 text-sm">
                Message freelancers and start your first project
              </p>
            </div>
          </Card>

          <Card className="glass-effect neon-border p-6 hover-scale-subtle">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-lg font-semibold text-white dark:text-white text-green-800 mb-2">
                Build Reputation
              </h3>
              <p className="text-dark-300 dark:text-dark-300 text-green-600 text-sm">
                Complete projects and earn reviews
              </p>
            </div>
          </Card>
        </div>

        {/* First Steps for New Users */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="glass-effect neon-border p-6 hover-scale-subtle">
            <h3 className="text-xl font-semibold text-white dark:text-white text-green-800 mb-4">
              Quick Start
            </h3>
            <div className="space-y-3">
              <button 
                onClick={() => switchToTab('browse')}
                className="w-full p-3 text-left bg-green-600 hover:bg-green-700 text-white rounded-lg hover-scale-subtle"
              >
                🔍 Browse Available Services
              </button>
              <button 
                onClick={() => switchToTab('profile')}
                className="w-full p-3 text-left bg-dark-800 hover:bg-dark-700 text-white border border-green-200 rounded-lg hover-scale-subtle"
              >
                👤 Complete Your Profile
              </button>
              <button 
                onClick={() => switchToTab('messages')}
                className="w-full p-3 text-left bg-dark-800 hover:bg-dark-700 text-white border border-green-200 rounded-lg hover-scale-subtle"
              >
                💬 Start Your First Chat
              </button>
              <button 
                onClick={() => navigate('/getting-started')}
                className="w-full p-3 text-left bg-dark-800 hover:bg-dark-700 text-white border border-green-200 rounded-lg hover-scale-subtle"
              >
                📚 Read Getting Started Guide
              </button>
            </div>
          </Card>

          <Card className="glass-effect neon-border p-6 hover-scale-subtle">
            <h3 className="text-xl font-semibold text-white dark:text-white text-green-800 mb-4">
              Recommended Actions
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📝</span>
                  <div>
                    <h4 className="font-medium text-green-700 dark:text-green-400">Create Your First Gig</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Start offering your services</p>
                  </div>
                </div>
                <button 
                  onClick={() => switchToTab('my-gigs')}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg hover-scale-subtle"
                >
                  Create
                </button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">💼</span>
                  <div>
                    <h4 className="font-medium text-blue-700 dark:text-blue-400">Add Portfolio</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Showcase your best work</p>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/portfolio')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg hover-scale-subtle"
                >
                  Add
                </button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🎯</span>
                  <div>
                    <h4 className="font-medium text-purple-700 dark:text-purple-400">Set Skills</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Define your expertise</p>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/skills')}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg hover-scale-subtle"
                >
                  Set
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Getting Started Guide Modal */}
        {showGettingStartedGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold text-green-700 dark:text-green-400">Getting Started Guide</h2>
                  <button 
                    onClick={() => setShowGettingStartedGuide(false)}
                    className="text-gray-500 hover:text-green-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-6 text-gray-700 dark:text-gray-300">
                  <div>
                    <h3 className="text-xl font-semibold text-green-700 dark:text-green-400 mb-3">🎯 Step 1: Complete Your Profile</h3>
                    <p className="mb-2">• Add a professional profile picture</p>
                    <p className="mb-2">• Write a compelling bio about your skills</p>
                    <p className="mb-2">• Add your portfolio and work samples</p>
                    <p className="mb-2">• Set your hourly rate and availability</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-green-700 dark:text-green-400 mb-3">🔍 Step 2: Browse Services</h3>
                    <p className="mb-2">• Explore different service categories</p>
                    <p className="mb-2">• Read client requirements carefully</p>
                    <p className="mb-2">• Check project budgets and timelines</p>
                    <p className="mb-2">• Save interesting projects to your favorites</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-green-700 dark:text-green-400 mb-3">💬 Step 3: Start Communicating</h3>
                    <p className="mb-2">• Send personalized proposals to clients</p>
                    <p className="mb-2">• Ask clarifying questions about projects</p>
                    <p className="mb-2">• Be professional and responsive</p>
                    <p className="mb-2">• Build trust through clear communication</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-green-700 dark:text-green-400 mb-3">✅ Step 4: Deliver Quality Work</h3>
                    <p className="mb-2">• Meet deadlines and exceed expectations</p>
                    <p className="mb-2">• Provide regular updates to clients</p>
                    <p className="mb-2">• Ask for feedback and reviews</p>
                    <p className="mb-2">• Build a strong reputation</p>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">💡 Pro Tips:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Start with smaller projects to build your portfolio</li>
                      <li>• Always read the full project description before applying</li>
                      <li>• Be honest about your skills and experience level</li>
                      <li>• Respond to messages within 24 hours</li>
                      <li>• Keep your profile and portfolio updated</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-8 flex gap-4">
                  <button 
                    onClick={() => setShowGettingStartedGuide(false)}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg hover-scale-subtle"
                  >
                    Got it!
                  </button>
                  <button 
                    onClick={() => switchToTab('profile')}
                    className="px-6 py-3 bg-dark-800 hover:bg-dark-700 text-white border border-green-200 rounded-lg hover-scale-subtle"
                  >
                    Complete My Profile Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // For existing users, show the original dashboard
  const stats = [
    {
      title: 'Active Orders',
      value: '12',
      change: '+2.5%',
      changeType: 'positive' as const,
      icon: '📦',
    },
    {
      title: 'Total Earnings',
      value: '₹2,45,000',
      change: '+12.3%',
      changeType: 'positive' as const,
      icon: '💰',
    },
    {
      title: 'Completed Gigs',
      value: '89',
      change: '+5.1%',
      changeType: 'positive' as const,
      icon: '✅',
    },
    {
      title: 'Client Rating',
      value: '4.9',
      change: '+0.2',
      changeType: 'positive' as const,
      icon: '⭐',
    },
  ];

  const recentOrders = [
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

  return (
    <div className="p-6 bg-gradient-to-br from-dark-950 to-dark-900 dark:from-dark-950 dark:to-dark-900 from-white to-white min-h-full">
      {/* Welcome Section */}
      <Card className="glass-effect neon-border p-6 mb-8 transform transition-transform duration-300 hover:scale-105">
        <h1 className="text-4xl font-bold text-white dark:text-white text-green-800 mb-2">
          Welcome back, Elite Freelancer! 👋
        </h1>
        <p className="text-dark-300 dark:text-dark-300 text-green-600 text-lg">
          Here's what's happening with your freelance business today.
        </p>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="glass-effect neon-border p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-300 dark:text-dark-300 text-green-600 text-sm font-medium">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-white dark:text-white text-green-800 mt-1">
                  {stat.value}
                </p>
                <div className="flex items-center mt-2">
                  <span
                    className={`text-sm font-medium ${
                      stat.changeType === 'positive'
                        ? 'text-green-500 dark:text-green-400'
                        : 'text-red-500 dark:text-red-400'
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-dark-300 dark:text-dark-300 text-green-600 text-sm ml-1">
                    from last month
                  </span>
                </div>
              </div>
              <div className="text-3xl transform transition-transform duration-300 group-hover:scale-110">{stat.icon}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-effect neon-border p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <h3 className="text-xl font-semibold text-white dark:text-white text-green-800 mb-4">
            Recent Orders
          </h3>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 bg-dark-900/50 dark:bg-dark-900/50 bg-white/50 rounded-lg border border-dark-700 dark:border-dark-700 border-green-200 transform transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-white dark:text-white text-green-800">
                      {order.title}
                    </h4>
                    <span className="text-sm text-dark-300 dark:text-dark-300 text-green-600">
                      {order.amount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-dark-300 dark:text-dark-300 text-green-600">
                      {order.client}
                    </p>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        order.status === 'Completed'
                          ? 'bg-green-500/20 text-green-400 dark:text-green-400'
                          : order.status === 'In Progress'
                          ? 'bg-yellow-500/20 text-yellow-400 dark:text-yellow-400'
                          : 'bg-blue-500/20 text-blue-400 dark:text-blue-400'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="glass-effect neon-border p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <h3 className="text-xl font-semibold text-white dark:text-white text-green-800 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button 
              onClick={() => switchToTab('my-gigs')}
              className="w-full p-3 text-left bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-md"
            >
              🚀 Create New Gig
            </button>
            <button 
              onClick={() => switchToTab('analytics')}
              className="w-full p-3 text-left bg-dark-800 hover:bg-dark-700 dark:bg-dark-800 dark:hover:bg-dark-700 text-white dark:text-white text-green-800 border border-green-200 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-md"
            >
              📊 View Analytics
            </button>
            <button 
              onClick={() => navigate('/messages')}
              className="w-full p-3 text-left bg-dark-800 hover:bg-dark-700 dark:bg-dark-800 dark:hover:bg-dark-700 text-white dark:text-white text-green-800 border border-green-200 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-md"
            >
              💬 Check Messages
            </button>
            <button 
              onClick={() => switchToTab('profile')}
              className="w-full p-3 text-left bg-dark-800 hover:bg-dark-700 dark:bg-dark-800 dark:hover:bg-dark-700 text-white dark:text-white text-green-800 border border-green-200 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-md"
            >
              ⚙️ Update Profile
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};
import React from 'react';
import { useNavigate } from 'react-router-dom';

const OnboardingHubPage: React.FC = () => {
  const navigate = useNavigate();

  const onboardingModules = [
    {
      title: "Getting Started Guide",
      description: "Step-by-step guide to set up your freelancing business",
      icon: "🚀",
      color: "from-blue-500 to-blue-600",
      link: "/getting-started",
      time: "10-15 min",
      status: "available"
    },
    {
      title: "Profile Completion",
      description: "Complete your profile to build trust and attract clients",
      icon: "📋",
      color: "from-green-500 to-green-600",
      link: "/profile-completion",
      time: "15-20 min",
      status: "available"
    },
    {
      title: "Quick Start Actions",
      description: "Priority actions to get you earning quickly",
      icon: "⚡",
      color: "from-purple-500 to-purple-600",
      link: "/quick-start",
      time: "20-30 min",
      status: "available"
    },
    {
      title: "Skills & Expertise",
      description: "Define your technical skills and specializations",
      icon: "🛠️",
      color: "from-orange-500 to-orange-600",
      link: "/skills",
      time: "10 min",
      status: "available"
    },
    {
      title: "Portfolio Setup",
      description: "Showcase your best work to attract clients",
      icon: "🎨",
      color: "from-pink-500 to-pink-600",
      link: "/portfolio",
      time: "15-25 min",
      status: "available"
    },
    {
      title: "Service Creation",
      description: "Create your first gig or service offering",
      icon: "💼",
      color: "from-yellow-500 to-yellow-600",
      link: "/services",
      time: "20-30 min",
      status: "available"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'in-progress': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-blue-500/20 text-blue-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in-progress': return 'In Progress';
      default: return 'Available';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 to-dark-900">
      <div className="w-full px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to MyFreelanceHub! 🎉
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Let's get you set up for success. Choose from the modules below to start building your freelancing business.
          </p>
        </div>

        {/* Progress Overview */}
        <div className="bg-dark-800 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Your Onboarding Progress</h2>
            <span className="text-green-400 font-medium">0/6 Complete</span>
          </div>
                      <div className="w-full bg-dark-700 rounded-full h-3 mb-4">
              <div className="bg-green-500 h-3 rounded-full transition-all duration-500" style={{ width: '0%' }}></div>
            </div>
          <p className="text-gray-300 text-sm">
            Complete all modules to unlock your full earning potential and attract high-quality clients.
          </p>
        </div>

        {/* Onboarding Modules Grid */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mb-12">
          {onboardingModules.map((module, index) => (
            <div 
              key={index}
              className="bg-dark-800 rounded-lg p-6 border border-dark-700 hover:border-green-500/30 transition-all duration-300 hover:scale-[1.01] cursor-pointer"
              onClick={() => navigate(module.link)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${module.color} flex items-center justify-center text-2xl`}>
                  {module.icon}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(module.status)}`}>
                  {getStatusText(module.status)}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{module.title}</h3>
              <p className="text-gray-300 mb-4">{module.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">{module.time}</span>
                <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 font-medium text-sm">
                  {module.status === 'completed' ? 'Review' : 'Start'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
                  <div className="grid md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 mb-12">
          <div className="bg-dark-800 rounded-lg p-6 text-center">
                      <div className="text-3xl font-bold text-green-400 mb-2">0</div>
          <div className="text-gray-300 text-sm">Completed</div>
        </div>
        <div className="bg-dark-800 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-yellow-400 mb-2">0</div>
          <div className="text-gray-300 text-sm">In Progress</div>
        </div>
        <div className="bg-dark-800 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-blue-400 mb-2">6</div>
          <div className="text-gray-300 text-sm">Available</div>
        </div>
        <div className="bg-dark-800 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-purple-400 mb-2">0%</div>
          <div className="text-gray-300 text-sm">Complete</div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-dark-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Why Complete Onboarding? 🎯</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-500 text-2xl">📈</span>
              </div>
              <h3 className="font-semibold text-white mb-2">Higher Visibility</h3>
              <p className="text-gray-300 text-sm">Complete profiles rank better in search results</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-500 text-2xl">💰</span>
              </div>
              <h3 className="font-semibold text-white mb-2">Better Earnings</h3>
              <p className="text-gray-300 text-sm">Professional profiles command higher rates</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-500 text-2xl">🤝</span>
              </div>
              <h3 className="font-semibold text-white mb-2">Quality Clients</h3>
              <p className="text-gray-300 text-sm">Attract serious clients who value professionalism</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/getting-started')}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors duration-200"
          >
            Start Getting Started Guide
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-8 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-lg font-semibold transition-colors duration-200"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingHubPage; 
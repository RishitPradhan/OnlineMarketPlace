import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuickStartPage: React.FC = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "Create Your First Gig",
      description: "Set up a service to start earning",
      icon: "💼",
      color: "from-blue-500 to-blue-600",
      link: "/services",
      priority: "high"
    },
    {
      title: "Add Portfolio Items",
      description: "Showcase your best work",
      icon: "🎨",
      color: "from-purple-500 to-purple-600",
      link: "/portfolio",
      priority: "high"
    },
    {
      title: "Set Your Skills",
      description: "Improve your discoverability",
      icon: "🛠️",
      color: "from-green-500 to-green-600",
      link: "/skills",
      priority: "medium"
    },
    {
      title: "Complete Profile",
      description: "Build trust with clients",
      icon: "👤",
      color: "from-orange-500 to-orange-600",
      link: "/dashboard?tab=profile",
      priority: "medium"
    },
    {
      title: "Set Pricing",
      description: "Define your rates",
      icon: "💰",
      color: "from-yellow-500 to-yellow-600",
      link: "/dashboard?tab=pricing",
      priority: "medium"
    },
    {
      title: "Payment Setup",
      description: "Get paid for your work",
      icon: "💳",
      color: "from-red-500 to-red-600",
      link: "/dashboard?tab=payments",
      priority: "low"
    }
  ];

  const recommendedTasks = [
    {
      title: "Write a Compelling Bio",
      description: "Tell your story and highlight your expertise",
      time: "5-10 min",
      difficulty: "Easy"
    },
    {
      title: "Upload Professional Photos",
      description: "Add a headshot and portfolio images",
      time: "10-15 min",
      difficulty: "Easy"
    },
    {
      title: "Research Competitor Pricing",
      description: "Set competitive but profitable rates",
      time: "15-20 min",
      difficulty: "Medium"
    },
    {
      title: "Create Service Packages",
      description: "Offer different tiers of service",
      time: "20-30 min",
      difficulty: "Medium"
    },
    {
      title: "Set Up Auto-Responses",
      description: "Respond quickly to client inquiries",
      time: "10 min",
      difficulty: "Easy"
    },
    {
      title: "Plan Your Availability",
      description: "Set working hours and response times",
      time: "5 min",
      difficulty: "Easy"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 to-dark-900">
      <div className="w-full px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Quick Start Actions ⚡
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Get started quickly with these essential actions. Complete the high-priority items first to maximize your success.
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Priority Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {quickActions.map((action, index) => (
              <div 
                key={index}
                className="bg-dark-800 rounded-lg p-6 border border-dark-700 hover:border-green-500/30 transition-all duration-300 hover:scale-[1.01]"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center text-2xl`}>
                    {action.icon}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    action.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                    action.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {action.priority}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{action.title}</h3>
                <p className="text-gray-300 mb-4">{action.description}</p>
                <button
                  onClick={() => navigate(action.link)}
                  className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 font-medium"
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Tasks */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Recommended Tasks</h2>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recommendedTasks.map((task, index) => (
              <div 
                key={index}
                className="bg-dark-800 rounded-lg p-6 border border-dark-700 hover:border-green-500/30 transition-all duration-300 hover:scale-[1.01]"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">{task.title}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-400">{task.time}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                      task.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {task.difficulty}
                    </span>
                  </div>
                </div>
                <p className="text-gray-300">{task.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Success Tips */}
        <div className="bg-dark-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Success Tips 💡</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <p className="text-gray-300">Start with high-priority items to get visible quickly</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <p className="text-gray-300">Use high-quality images and professional descriptions</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <p className="text-gray-300">Set competitive but profitable pricing</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <p className="text-gray-300">Respond quickly to client messages</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <p className="text-gray-300">Always deliver work on time or early</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <p className="text-gray-300">Ask for reviews and build your reputation</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors duration-200"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => navigate('/getting-started')}
            className="px-8 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-lg font-semibold transition-colors duration-200"
          >
            Getting Started Guide
          </button>
          <button
            onClick={() => navigate('/profile-completion')}
            className="px-8 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-lg font-semibold transition-colors duration-200"
          >
            Profile Completion
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickStartPage; 
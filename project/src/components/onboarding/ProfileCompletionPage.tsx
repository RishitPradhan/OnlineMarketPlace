import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileCompletionPage: React.FC = () => {
  const navigate = useNavigate();
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set([]));

  const profileItems = [
    {
      id: 'profile',
      title: 'Basic Profile',
      description: 'Add your photo, bio, and basic information',
      icon: '👤',
      completed: false,
      priority: 'high'
    },
    {
      id: 'skills',
      title: 'Skills & Expertise',
      description: 'List your technical skills to get discovered',
      icon: '🛠️',
      completed: false,
      priority: 'high'
    },
    {
      id: 'services',
      title: 'Your First Service',
      description: 'Create your first gig to start earning',
      icon: '💼',
      completed: false,
      priority: 'medium'
    },
    {
      id: 'portfolio',
      title: 'Portfolio',
      description: 'Showcase your best work examples',
      icon: '🎨',
      completed: false,
      priority: 'medium'
    }
  ];

  const completionPercentage = Math.round((completedItems.size / profileItems.length) * 100);

  const handleItemToggle = (itemId: string) => {
    const newCompleted = new Set(completedItems);
    if (newCompleted.has(itemId)) {
      newCompleted.delete(itemId);
    } else {
      newCompleted.add(itemId);
    }
    setCompletedItems(newCompleted);
  };

  const getProgressColor = () => {
    if (completionPercentage >= 80) return 'text-green-400';
    if (completionPercentage >= 60) return 'text-yellow-400';
    if (completionPercentage >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 to-dark-900">
      <div className="w-full px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Let's Build Your Profile! 🚀
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Don't worry, this won't take long! Just a few simple steps to get you started.
          </p>
        </div>

        {/* Progress Overview */}
        <div className="bg-dark-800 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Profile Completion</h2>
            <span className={`font-bold text-2xl ${getProgressColor()}`}>
              {completionPercentage}%
            </span>
          </div>
          <div className="w-full bg-dark-700 rounded-full h-4 mb-4">
            <div 
              className="bg-gradient-to-r from-green-500 to-green-400 h-4 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <p className="text-gray-300 text-sm">
            {completionPercentage >= 80 ? 'Excellent! Your profile is nearly complete.' :
             completionPercentage >= 60 ? 'Good progress! Keep going to improve your visibility.' :
             completionPercentage >= 40 ? 'You\'re on the right track! Complete more items to stand out.' :
             'Let\'s get started! Complete these items to build a strong profile.'}
          </p>
        </div>

        {/* Quick Start Section */}
        <div className="bg-dark-800 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Start - Just 4 Steps! ✨</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {profileItems.map((item, index) => (
              <div 
                key={item.id}
                className={`bg-dark-700 rounded-lg p-6 border transition-all duration-300 hover:scale-[1.01] ${
                  item.completed ? 'border-green-500/30 bg-green-500/5' : 'border-dark-600 hover:border-green-500/30'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                      item.completed ? 'bg-green-500 text-black' : 'bg-dark-600 text-gray-400'
                    }`}>
                      {item.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm text-gray-400">Step {index + 1}</span>
                      {item.priority === 'high' && (
                        <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">Important</span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-300 text-sm mb-4">{item.description}</p>
                    <button
                      onClick={() => navigate(`/${item.id}`)}
                      className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 font-medium text-sm"
                    >
                      {item.completed ? 'Edit' : 'Get Started'}
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-dark-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Tips 💡</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <p className="text-gray-300">Start with the "Important" steps first - they'll help you get discovered faster</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <p className="text-gray-300">Don't worry about being perfect - you can always update your profile later</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <p className="text-gray-300">Even completing 2-3 steps will significantly improve your chances of getting hired</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors duration-200"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate('/quick-start')}
            className="px-8 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-lg font-semibold transition-colors duration-200"
          >
            Quick Start Actions
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionPage; 
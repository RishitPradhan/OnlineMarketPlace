import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProfileCompletionPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id;
  const LOCAL_KEY = userId ? `profileData_${userId}` : 'profileData';
  const LOCAL_SKILLS_KEY = userId ? `skillsData_${userId}` : 'skillsData';
  const LOCAL_PORTFOLIO_KEY = userId ? `portfolioProjects_${userId}` : 'portfolioProjects';
  const LOCAL_SERVICES_KEY = userId ? `servicesData_${userId}` : 'servicesData';
  const [profileData, setProfileData] = useState<any>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    function forceRerender() {
      setVersion(v => v + 1);
    }
    window.addEventListener('profile-updated', forceRerender);
    window.addEventListener('skills-updated', forceRerender);
    window.addEventListener('portfolio-updated', forceRerender);
    window.addEventListener('services-updated', forceRerender);
    window.addEventListener('storage', forceRerender);
    return () => {
      window.removeEventListener('profile-updated', forceRerender);
      window.removeEventListener('skills-updated', forceRerender);
      window.removeEventListener('portfolio-updated', forceRerender);
      window.removeEventListener('services-updated', forceRerender);
      window.removeEventListener('storage', forceRerender);
    };
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setProfileData(data);
    }
  }, []);

  // Add unified progress bar/checklist logic
  const skills = JSON.parse(localStorage.getItem(LOCAL_SKILLS_KEY) || '[]');
  const portfolio = JSON.parse(localStorage.getItem(LOCAL_PORTFOLIO_KEY) || '[]');
  const profileRaw = localStorage.getItem('profileData');
  const profile = profileRaw ? JSON.parse(profileRaw) : {};
  const profileChecks = {
    profile: !!(profile.firstName && profile.lastName && profile.hourlyRate && profile.location),
    bio: !!(profile.bio && String(profile.bio).trim() !== ''),
    portfolio: Array.isArray(portfolio) && portfolio.length > 0,
    skills: Array.isArray(skills) && skills.length > 0
  };
  const completedItems = new Set<string>();
  if (profileChecks.profile) completedItems.add('profile');
  if (profileChecks.skills) completedItems.add('skills');
  const services = localStorage.getItem(LOCAL_SERVICES_KEY);
  if (services && JSON.parse(services).length > 0) completedItems.add('services');
  if (profileChecks.portfolio) completedItems.add('portfolio');
  const profileCompletion = Math.round((Object.values(profileChecks).filter(Boolean).length / 4) * 100);
  useEffect(() => {
    function recalcProfileCompletion() {
      setVersion(v => v + 1);
    }
    window.addEventListener('storage', recalcProfileCompletion);
    window.addEventListener('skills-updated', recalcProfileCompletion);
    window.addEventListener('profile-updated', recalcProfileCompletion);
    window.addEventListener('portfolio-updated', recalcProfileCompletion);
    return () => {
      window.removeEventListener('storage', recalcProfileCompletion);
      window.removeEventListener('skills-updated', recalcProfileCompletion);
      window.removeEventListener('profile-updated', recalcProfileCompletion);
      window.removeEventListener('portfolio-updated', recalcProfileCompletion);
    };
  }, []);

  const profileItems = [
    {
      id: 'profile',
      title: 'Basic Profile',
      description: 'Add your photo, bio, and basic information',
      icon: '👤',
      priority: 'high'
    },
    {
      id: 'skills',
      title: 'Skills & Expertise',
      description: 'List your technical skills to get discovered',
      icon: '🛠️',
      priority: 'high'
    },
    {
      id: 'services',
      title: 'Your First Service',
      description: 'Create your first gig to start earning',
      icon: '💼',
      priority: 'medium'
    },
    {
      id: 'portfolio',
      title: 'Portfolio',
      description: 'Showcase your best work examples',
      icon: '🎨',
      priority: 'medium'
    }
  ];

  const completionPercentage = Math.round((completedItems.size / profileItems.length) * 100);

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
        {profileCompletion < 100 && (
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Getting Started 🚀
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Just a few simple steps to set up your freelance presence and start earning.
            </p>
          </div>
        )}

        {/* Progress Overview or Complete Message */}
        {profileCompletion < 100 ? (
          <div className="bg-dark-800 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Profile Completion</h2>
              <span className="text-green-400 font-medium">{profileCompletion}% Complete</span>
            </div>
            <div className="w-full bg-dark-700 rounded-full h-3 mb-4">
              <div className="bg-green-500 h-3 rounded-full transition-all duration-500" style={{ width: `${profileCompletion}%` }}></div>
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
          </div>
        ) : (
          <div className="bg-black rounded-lg p-8 mb-8 flex flex-col items-center justify-center text-center shadow-lg animate-fadein">
            <div className="text-5xl mb-2">🎉✅</div>
            <h3 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2">Profile Complete!</h3>
            <p className="text-green-700 dark:text-green-300 mb-4">You’re ready to start earning. Stand out and get noticed by clients!</p>
            <button
              onClick={() => window.location.href = '/services'}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-102"
            >
              Start Earning
            </button>
          </div>
        )}
        {/* Quick Start Section */}
        <div className="bg-dark-800 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Grow Your Success on FreelanceHub 🚀</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {profileItems.map((item, index) => {
              const isComplete = completedItems.has(item.id);
              return (
                <div 
                  key={item.id}
                  className={`bg-dark-700 rounded-lg p-6 border transition-all duration-300 hover:scale-[1.01] ${
                    isComplete ? 'border-green-500/30 bg-green-500/5' : 'border-dark-600 hover:border-green-500/30'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                        isComplete ? 'bg-green-500 text-black' : 'bg-dark-600 text-gray-400'
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
                        {isComplete ? 'Edit' : 'Get Started'}
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
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
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
  // Use state for skills and portfolio everywhere
  const profileChecks = {
    profile: !!(profile.firstName && profile.lastName && profile.hourlyRate && profile.location),
    skills: Array.isArray(skills) && skills.length > 0,
    portfolio: Array.isArray(portfolio) && portfolio.length > 0
  };
  const completedItems = new Set<string>();
  if (profileChecks.profile) completedItems.add('profile');
  if (profileChecks.skills) completedItems.add('skills');
  if (profileChecks.portfolio) completedItems.add('portfolio');
  const profileCompletion = Math.round((Object.values(profileChecks).filter(Boolean).length / 3) * 100);
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
  }, [skills.length, portfolio.length]);

  // Only use these three steps
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
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-dark-900 to-green-800 flex items-center justify-center py-12 px-2">
      <div className="w-full max-w-2xl mx-auto bg-dark-900/80 rounded-3xl shadow-2xl p-10 relative">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Profile Completion</h1>
            <span className="text-green-400 font-bold text-lg">{completionPercentage}%</span>
          </div>
          <div className="w-full h-4 bg-dark-700 rounded-full overflow-hidden">
            <div className="h-4 bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-700" style={{ width: `${completionPercentage}%` }}></div>
          </div>
        </div>
        {/* Timeline Stepper */}
        <div className="flex flex-col gap-10 relative">
          {profileItems.map((item, idx) => {
            const isComplete = completedItems.has(item.id);
            const isLast = idx === profileItems.length - 1;
            return (
              <div key={item.id} className="flex items-start group">
                {/* Timeline line */}
                <div className="flex flex-col items-center mr-6">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-2xl font-bold border-4 transition-all duration-300 ${isComplete ? 'bg-green-500 border-green-400 text-white shadow-lg' : 'bg-dark-700 border-dark-600 text-gray-400'}`}>{isComplete ? '✓' : item.icon}</div>
                  {!isLast && <div className={`w-1 h-16 ${isComplete ? 'bg-green-400' : 'bg-dark-700'} transition-all duration-300`}></div>}
                </div>
                <div className={`flex-1 bg-dark-800 rounded-2xl p-6 shadow-xl border-l-4 ${isComplete ? 'border-green-500' : 'border-dark-700'} transition-all duration-300 hover:scale-104 hover:shadow-2xl`}> 
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                    {isComplete && <span className="text-green-400 text-lg animate-bounce">✓</span>}
                  </div>
                  <p className="text-gray-400 mb-4">{item.description}</p>
                  <button
                    onClick={() => navigate(`/${item.id}`)}
                    className={`inline-flex items-center px-6 py-2 rounded-lg font-semibold text-base transition-colors duration-200 shadow-md ${isComplete ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-dark-700 text-green-400 hover:bg-green-600 hover:text-white'}`}
                  >
                    {isComplete ? 'Edit' : 'Complete Step'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        {/* Completion Message */}
        {completionPercentage === 100 && (
          <div className="bg-gradient-to-r from-green-600 to-green-400 rounded-2xl p-8 mt-12 flex flex-col items-center justify-center text-center shadow-2xl animate-fadein">
            <div className="text-6xl mb-2">🎉</div>
            <h3 className="text-2xl font-extrabold text-white mb-2">Profile Complete!</h3>
            <p className="text-white/90 mb-4">You’re ready to start earning. Stand out and get noticed by clients!</p>
            <button
              onClick={() => window.location.href = '/services'}
              className="px-8 py-3 bg-white text-green-700 font-bold rounded-full shadow-lg hover:bg-green-100 transition-all duration-300 hover:scale-105"
            >
              Start Earning
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCompletionPage; 
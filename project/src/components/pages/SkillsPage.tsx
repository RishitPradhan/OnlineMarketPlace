import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const SkillsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userId = user?.id;
  const LOCAL_KEY = userId ? `skillsData_${userId}` : 'skillsData';
  const [newSkill, setNewSkill] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  // Remove all useState/useEffect for skills
  // Use this to display skills:
  const skills = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');

  const categories = [
    'Programming',
    'Frontend',
    'Backend',
    'Design',
    'Marketing',
    'Writing',
    'Video',
    'Audio',
    'Other'
  ];

  const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const saveSkills = (skillsArr: any[]) => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(skillsArr));
    window.dispatchEvent(new StorageEvent('storage', { key: LOCAL_KEY, newValue: JSON.stringify(skillsArr) }));
    window.dispatchEvent(new Event('skills-updated'));
    window.dispatchEvent(new Event('profile-updated'));
    const profileData = localStorage.getItem('profileData');
    window.dispatchEvent(new StorageEvent('storage', { key: 'profileData', newValue: profileData }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && selectedCategory) {
      const skill = {
        id: Date.now(),
        name: newSkill.trim(),
        category: selectedCategory,
        level: 'Intermediate'
      };
      const updated = [...skills, skill];
      saveSkills(updated);
      setNewSkill('');
      setSelectedCategory('');
      setSuccessMsg('Skill added!');
      setTimeout(() => setSuccessMsg(''), 1500);
    }
  };

  const handleRemoveSkill = (skillId: number) => {
    const updated = skills.filter((skill: any) => skill.id !== skillId);
    saveSkills(updated);
    setSuccessMsg('Skill removed!');
    setTimeout(() => setSuccessMsg(''), 1500);
  };

  const handleLevelChange = (skillId: number, newLevel: string) => {
    const updated = skills.map((skill: any) =>
      skill.id === skillId ? { ...skill, level: newLevel } : skill
    );
    saveSkills(updated);
    setSuccessMsg('Skill level updated!');
    setTimeout(() => setSuccessMsg(''), 1500);
  };

  const handleSaveSkills = () => {
    saveSkills(skills);
    setSuccessMsg('Skills saved!');
    setTimeout(() => setSuccessMsg(''), 1500);
  };

  const handleReset = () => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify([]));
    setSuccessMsg('Skills reset!');
    setTimeout(() => setSuccessMsg(''), 1500);
  };

  const groupedSkills = skills.reduce((acc: any, skill: any) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 to-dark-900">
      <div className="w-full px-6 py-8">
        <button
          onClick={() => navigate('/profile-completion')}
          className="mb-6 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow transition-all"
        >
          Profile
        </button>
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Skills & Expertise 🛠️
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Define your skills and expertise to improve your discoverability and attract the right clients.
          </p>
        </div>

        {/* Add Skill Section */}
        <div className="bg-dark-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Add New Skill</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Enter skill name"
              className="flex-1 px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-green-500 focus:outline-none"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <button
              onClick={handleAddSkill}
              disabled={!newSkill.trim() || !selectedCategory}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-dark-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200"
            >
              Add Skill
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
            >
              Reset Skills
            </button>
            <button
              onClick={handleSaveSkills}
              disabled={false} // No longer hasChanges
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-dark-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200"
            >
              Save Skills
            </button>
          </div>
          {successMsg && <div className="mt-4 text-green-400 text-center font-semibold">{successMsg}</div>}
        </div>

        {/* Skills Overview */}
        <div className="bg-dark-800 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Your Skills</h2>
            <span className="text-green-400 font-medium">{skills.length} skills</span>
          </div>
          
          {Object.keys(groupedSkills).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                <div key={category}>
                  <h3 className="text-lg font-medium text-white mb-3">{category}</h3>
                  <div className="grid gap-3">
                    {(categorySkills as any[]).map((skill: any) => (
                      <div key={skill.id} className="flex items-center justify-between p-4 bg-dark-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-white font-medium">{skill.name}</span>
                          <select
                            value={skill.level}
                            onChange={(e) => handleLevelChange(skill.id, e.target.value)}
                            className="px-3 py-1 bg-dark-600 border border-dark-500 rounded text-white text-sm focus:border-green-500 focus:outline-none"
                          >
                            {levels.map((level) => (
                              <option key={level} value={level}>{level}</option>
                            ))}
                          </select>
                        </div>
                        <button
                          onClick={() => handleRemoveSkill(skill.id)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors duration-200"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🛠️</div>
              <h3 className="text-lg font-semibold text-white mb-2">No Skills Added</h3>
              <p className="text-gray-300">Add your first skill to get started</p>
            </div>
          )}
        </div>

        {/* Skill Level Guide */}
        <div className="bg-dark-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Skill Level Guide</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div>
              <h3 className="font-medium text-white mb-2">Beginner</h3>
              <p className="text-gray-300 text-sm">Basic knowledge, can work with guidance</p>
            </div>
            <div>
              <h3 className="font-medium text-white mb-2">Intermediate</h3>
              <p className="text-gray-300 text-sm">Good understanding, can work independently</p>
            </div>
            <div>
              <h3 className="font-medium text-white mb-2">Advanced</h3>
              <p className="text-gray-300 text-sm">Deep knowledge, can solve complex problems</p>
            </div>
            <div>
              <h3 className="font-medium text-white mb-2">Expert</h3>
              <p className="text-gray-300 text-sm">Mastery level, can teach and lead others</p>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-dark-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Tips for Better Discoverability</h2>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <p className="text-gray-300">Add specific skills rather than broad categories</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <p className="text-gray-300">Be honest about your skill levels</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <p className="text-gray-300">Include both technical and soft skills</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <p className="text-gray-300">Update your skills regularly as you learn new ones</p>
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

export default SkillsPage; 
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const LOCAL_KEY = 'profileData';
const LOCAL_SKILLS_KEY = 'skillsData';
const LOCAL_SERVICES_KEY = 'servicesData';
const LOCAL_PORTFOLIO_KEY = 'portfolioProjects';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: '',
    skills: [] as string[],
    hourlyRate: '',
    location: '',
    website: '',
    phone: ''
  });
  const [isEditing, setIsEditing] = useState(true);
  const [newSkill, setNewSkill] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  // Use this to display skills and portfolio:
  const skills = JSON.parse(localStorage.getItem('skillsData') || '[]');
  const portfolio = JSON.parse(localStorage.getItem('portfolioProjects') || '[]');
  // Unify progress bar logic with DashboardOverview
  const profileChecks = {
    profile: !!(formData.firstName && formData.lastName && formData.hourlyRate && formData.location),
    bio: !!(formData.bio && String(formData.bio).trim() !== ''),
    portfolio: Array.isArray(portfolio) && portfolio.length > 0,
    skills: Array.isArray(skills) && skills.length > 0
  };
  const profileCompletion = Math.round((Object.values(profileChecks).filter(Boolean).length / 4) * 100);

  const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=User&background=10b981&color=fff&size=128';
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || DEFAULT_AVATAR);

  // Update avatarUrl if user.avatar changes
  useEffect(() => {
    setAvatarUrl(user?.avatar || DEFAULT_AVATAR);
  }, [user?.avatar]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) {
      setAvatarError('User not loaded. Please try again later.');
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    setAvatarError(null);
    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage.from('avatars').upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      });
      if (error) throw error;
      // Get public URL
      const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
      const publicUrl = publicUrlData?.publicUrl;
      if (!publicUrl) throw new Error('Failed to get public URL');
      setAvatarUrl(publicUrl);
      // Update user in DB
      await supabase.from('users').update({ avatar: publicUrl }).eq('id', user.id);
      // Update AuthContext (force reload)
      window.dispatchEvent(new Event('profile-updated'));
      setAvatarUploading(false);
    } catch (err: any) {
      setAvatarError(err.message || 'Failed to upload avatar');
      setAvatarUploading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-xl text-green-400">Loading...</div>;
  }
  if (!user) {
    window.location.href = '/login';
    return null;
  }

  // Load from localStorage on mount, fallback to user data if empty
  useEffect(() => {
    window.scrollTo(0, 0);
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) {
      setFormData(JSON.parse(saved));
    } else if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        bio: '',
        skills: [],
        hourlyRate: '',
        location: '',
        website: '',
        phone: ''
      });
    }
  }, [user]);

  // Calculate completion percentage and missing fields
  const requiredFields = ['firstName', 'lastName', 'bio', 'hourlyRate', 'location'];
  const filledFields = requiredFields.filter(field =>
    formData[field as keyof typeof formData] &&
    String(formData[field as keyof typeof formData]).trim() !== ''
  );
  const completionPercentage = Math.round((filledFields.length / requiredFields.length) * 100);

  useEffect(() => {
    const missing = requiredFields.filter(field =>
      !formData[field as keyof typeof formData] || String(formData[field as keyof typeof formData]).trim() === ''
    );
    setMissingFields(missing);
  }, [formData]);

  // Listen for localStorage and custom events to update progress bar/checklist
  useEffect(() => {
    function recalcProfileCompletion() {
      // This will trigger a re-render by updating state
      setFormData(f => ({ ...f }));
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

  // useEffect(() => {
  //   function forceRerender() {
  //     setVersion(v => v + 1);
  //   }
  //   window.addEventListener('profile-updated', forceRerender);
  //   window.addEventListener('skills-updated', forceRerender);
  //   window.addEventListener('storage', forceRerender);
  //   return () => {
  //     window.removeEventListener('profile-updated', forceRerender);
  //     window.removeEventListener('skills-updated', forceRerender);
  //     window.removeEventListener('storage', forceRerender);
  //   };
  // }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    if (missingFields.length > 0) {
      setSaveSuccess(false);
      return;
    }
    localStorage.setItem(LOCAL_KEY, JSON.stringify(formData));
    // Reload from localStorage to ensure UI and progress bar are in sync
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) {
      setFormData(JSON.parse(saved));
    }
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleReset = () => {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) {
      setFormData(JSON.parse(saved));
    }
    setIsEditing(false);
  };

  const handleAddSkill = () => {
    const skill = newSkill.trim();
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const profileSections = [
    {
      title: "Basic Information",
      fields: [
        { name: "firstName", label: "First Name", type: "text", required: true },
        { name: "lastName", label: "Last Name", type: "text", required: true },
        { name: "bio", label: "Bio", type: "textarea", required: true }
      ]
    },
    {
      title: "Professional Details",
      fields: [
        { name: "hourlyRate", label: "Hourly Rate (₹)", type: "number", required: true },
        { name: "location", label: "Location", type: "text", required: true },
        { name: "website", label: "Website", type: "url", required: false }
      ]
    },
    {
      title: "Contact Information",
      fields: [
        { name: "phone", label: "Phone Number", type: "tel", required: false }
      ]
    }
  ];

  const reloadSkills = () => {
    const skillsSaved = localStorage.getItem(LOCAL_SKILLS_KEY);
    // setSkills(skillsSaved ? JSON.parse(skillsSaved) : []); // This line is removed
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 to-dark-900">
      <div className="w-full px-6 py-8">
        <button
          onClick={() => navigate('/profile-completion')}
          className="mb-6 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow transition-all"
        >
          Profile
        </button>
        {/* Profile Completion Progress */}

        {/* Profile Form */}
        <div className="bg-dark-800 rounded-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Profile Information</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {/* Profile Picture Upload UI */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <img
                src={avatarUrl || DEFAULT_AVATAR}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-green-400 shadow-lg bg-white"
              />
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-green-600 text-white rounded-full p-2 cursor-pointer shadow-lg hover:bg-green-700 transition-all">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                    disabled={avatarUploading}
                  />
                  <span className="text-xs font-semibold">{avatarUploading ? 'Uploading...' : 'Edit'}</span>
                </label>
              )}
            </div>
            {avatarError && <div className="text-red-400 mt-2 text-sm">{avatarError}</div>}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            {profileSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">{section.title}</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {section.fields.map((field, fieldIndex) => (
                    <div key={fieldIndex}>
                      <label className="block text-gray-300 mb-2 font-medium">
                        {field.label} {field.required && <span className="text-red-400">*</span>}
                      </label>
                      {field.type === 'textarea' ? (
                        <textarea
                          name={field.name}
                          value={formData[field.name as keyof typeof formData] as string}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          rows={4}
                          className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none disabled:opacity-50"
                          placeholder={`Enter your ${field.label.toLowerCase()}`}
                        />
                      ) : (
                        <input
                          type={field.type}
                          name={field.name}
                          value={formData[field.name as keyof typeof formData] as string}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none disabled:opacity-50"
                          placeholder={`Enter your ${field.label.toLowerCase()}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {isEditing && (
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors duration-200"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                >
                  Save Changes
                </button>
              </div>
            )}
          </form>
          {saveSuccess && (
            <div className="mt-4 text-green-400 text-center font-semibold">Profile saved successfully!</div>
          )}
        </div>

        {/* Skills Section */}
        <div className="bg-dark-800 rounded-lg p-8 mt-8">
          <h3 className="text-2xl font-bold text-white mb-6">Skills & Expertise</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-gray-300 mb-2 font-medium">Your Skills</label>
              <div className="flex flex-wrap gap-2">
                {skills.length === 0 ? (
                  <p className="text-gray-400 text-sm">No skills added yet. Add your first skill on the Skills page.</p>
                ) : (
                  skills.map((skill: any, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-600 text-white rounded-full text-sm"
                    >
                      {skill.name}
                    </span>
                  ))
                )}
              </div>
              <button
                onClick={() => navigate('/skills')}
                className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow transition-all"
              >
                Edit Skills
              </button>
              <button
                onClick={reloadSkills}
                className="mt-2 px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold shadow transition-all"
              >
                Reload Skills
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
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

export default ProfilePage; 
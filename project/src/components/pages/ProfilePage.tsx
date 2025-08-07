import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Briefcase, 
  Star, 
  Edit3, 
  Save, 
  X, 
  Camera,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Award,
  Users,
  DollarSign
} from 'lucide-react';

// User-specific localStorage keys
const getUserStorageKey = (userId: string, key: string): string => {
  return `user_${userId}_${key}`;
};

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    bio: '',
    hourlyRate: '',
    skills: [] as string[],
    experience: '',
    education: '',
    languages: [] as string[],
    portfolio: [] as Array<{title: string, description: string, url: string, image: string}>
  });

  // UI state
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [newSkill, setNewSkill] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [newPortfolioItem, setNewPortfolioItem] = useState({
    title: '',
    description: '',
    url: '',
    image: ''
  });

  const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=User&background=10b981&color=fff&size=128';
  const [avatarUrl, setAvatarUrl] = useState(DEFAULT_AVATAR);

  // Load user data on mount
  useEffect(() => {
    if (user) {
      // Load from user object first
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || ''
      }));

      // Load additional data from localStorage
      const profileData = localStorage.getItem(getUserStorageKey(user.id, 'profileData'));
      if (profileData) {
        const savedData = JSON.parse(profileData);
        setFormData(prev => ({
          ...prev,
          ...savedData,
          firstName: user.firstName || savedData.firstName || '',
          lastName: user.lastName || savedData.lastName || '',
          email: user.email || savedData.email || ''
        }));
      }

      // Load skills
      const skillsData = localStorage.getItem(getUserStorageKey(user.id, 'skillsData'));
      if (skillsData) {
        setFormData(prev => ({
          ...prev,
          skills: JSON.parse(skillsData)
        }));
      }

      // Load portfolio
      const portfolioData = localStorage.getItem(getUserStorageKey(user.id, 'portfolioProjects'));
      if (portfolioData) {
        setFormData(prev => ({
          ...prev,
          portfolio: JSON.parse(portfolioData)
        }));
      }

      // Set avatar
      setAvatarUrl(user.avatar || DEFAULT_AVATAR);
    }
  }, [user]);

  // Update formData when user object changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        email: user.email || prev.email
      }));
    }
  }, [user?.firstName, user?.lastName, user?.email]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarUploading(true);
    setAvatarError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const publicUrl = publicUrlData?.publicUrl;
      if (!publicUrl) throw new Error('Failed to get public URL');

      setAvatarUrl(publicUrl);

      // Update user in database and AuthContext
      await supabase.from('users').update({ avatar: publicUrl }).eq('id', user.id);
      
      const updatedUser = { ...user, avatar: publicUrl };
      updateUser(updatedUser);

      setSuccessMessage('Avatar updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);

    } catch (err: any) {
      setAvatarError(err.message || 'Failed to upload avatar');
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    setSuccessMessage(null);

    try {
      // Update user object in AuthContext
      const updatedUser = {
        ...user,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email
      };

      // Update in database
      await supabase.from('users').update({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email
      }).eq('id', user.id);

      // Update AuthContext
      updateUser(updatedUser);

      // Save additional data to localStorage
      const profileData = {
        phone: formData.phone,
        location: formData.location,
        website: formData.website,
        bio: formData.bio,
        hourlyRate: formData.hourlyRate,
        experience: formData.experience,
        education: formData.education,
        languages: formData.languages
      };

      localStorage.setItem(getUserStorageKey(user.id, 'profileData'), JSON.stringify(profileData));
      localStorage.setItem(getUserStorageKey(user.id, 'skillsData'), JSON.stringify(formData.skills));
      localStorage.setItem(getUserStorageKey(user.id, 'portfolioProjects'), JSON.stringify(formData.portfolio));

      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);

      setTimeout(() => setSuccessMessage(null), 3000);

    } catch (error) {
      console.error('Failed to save profile:', error);
      setSuccessMessage('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      const updatedSkills = [...formData.skills, newSkill.trim()];
      setFormData(prev => ({
        ...prev,
        skills: updatedSkills
      }));
      
      // Save to localStorage immediately
      if (user) {
        localStorage.setItem(getUserStorageKey(user.id, 'skillsData'), JSON.stringify(updatedSkills));
      }
      
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updatedSkills = formData.skills.filter(skill => skill !== skillToRemove);
    setFormData(prev => ({
      ...prev,
      skills: updatedSkills
    }));
    
    // Save to localStorage immediately
    if (user) {
      localStorage.setItem(getUserStorageKey(user.id, 'skillsData'), JSON.stringify(updatedSkills));
    }
  };

  const handleAddLanguage = () => {
    if (newLanguage.trim() && !formData.languages.includes(newLanguage.trim())) {
      const updatedLanguages = [...formData.languages, newLanguage.trim()];
      setFormData(prev => ({
        ...prev,
        languages: updatedLanguages
      }));
      
      // Save to localStorage immediately
      if (user) {
        localStorage.setItem(getUserStorageKey(user.id, 'profileData'), JSON.stringify({
          ...JSON.parse(localStorage.getItem(getUserStorageKey(user.id, 'profileData')) || '{}'),
          languages: updatedLanguages
        }));
      }
      
      setNewLanguage('');
    }
  };

  const handleRemoveLanguage = (languageToRemove: string) => {
    const updatedLanguages = formData.languages.filter(lang => lang !== languageToRemove);
    setFormData(prev => ({
      ...prev,
      languages: updatedLanguages
    }));
    
    // Save to localStorage immediately
    if (user) {
      const currentProfileData = JSON.parse(localStorage.getItem(getUserStorageKey(user.id, 'profileData')) || '{}');
      localStorage.setItem(getUserStorageKey(user.id, 'profileData'), JSON.stringify({
        ...currentProfileData,
        languages: updatedLanguages
      }));
    }
  };

  // Portfolio management functions
  const handleAddPortfolioItem = () => {
    if (newPortfolioItem.title.trim() && newPortfolioItem.description.trim()) {
      const updatedPortfolio = [...formData.portfolio, { ...newPortfolioItem }];
      setFormData(prev => ({
        ...prev,
        portfolio: updatedPortfolio
      }));
      
      // Save to localStorage immediately
      if (user) {
        localStorage.setItem(getUserStorageKey(user.id, 'portfolioProjects'), JSON.stringify(updatedPortfolio));
      }
      
      setNewPortfolioItem({ title: '', description: '', url: '', image: '' });
    }
  };

  const handleRemovePortfolioItem = (index: number) => {
    const updatedPortfolio = formData.portfolio.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      portfolio: updatedPortfolio
    }));
    
    // Save to localStorage immediately
    if (user) {
      localStorage.setItem(getUserStorageKey(user.id, 'portfolioProjects'), JSON.stringify(updatedPortfolio));
    }
  };

  const handlePortfolioItemChange = (field: string, value: string) => {
    setNewPortfolioItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  // Calculate completion percentage
  const basicFields = ['firstName', 'lastName', 'email'];
  const professionalFields = user?.role === 'freelancer' ? ['bio', 'location', 'hourlyRate', 'skills', 'portfolio'] : ['phone', 'location'];
  const completedBasic = basicFields.filter(field => formData[field as keyof typeof formData]?.toString().trim()).length;
  const completedProfessional = professionalFields.filter(field => {
    const value = formData[field as keyof typeof formData];
    if (field === 'skills') return Array.isArray(value) && value.length > 0;
    if (field === 'portfolio') return Array.isArray(value) && value.length > 0;
    return value?.toString().trim();
  }).length;

  const basicCompletion = Math.round((completedBasic / basicFields.length) * 100);
  const professionalCompletion = Math.round((completedProfessional / professionalFields.length) * 100);
  const overallCompletion = Math.round(((completedBasic + completedProfessional) / (basicFields.length + professionalFields.length)) * 100);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-950 to-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-green-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: User },
    { id: 'professional', label: 'Professional', icon: Briefcase },
    { id: 'skills', label: 'Skills & Languages', icon: Star },
    { id: 'preview', label: 'Preview', icon: Award }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 to-dark-900">
      {/* Header */}
      <div className="bg-dark-900/50 border-b border-green-500/20 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-green-400 hover:text-green-300 transition-colors"
              >
                <X className="w-5 h-5 mr-2" />
                Back
              </button>
              <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
            </div>
            <div className="flex items-center space-x-4">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white font-semibold rounded-lg transition-all duration-300 flex items-center space-x-2"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center space-x-2"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
          <CheckCircle className="w-5 h-5" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Avatar and Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Avatar Section */}
            <div className="bg-dark-800/50 rounded-2xl p-6 border border-green-500/20">
              <div className="text-center">
                <div className="relative inline-block">
                  <img
                    src={avatarUrl}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-green-500/20"
                  />
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-green-600 hover:bg-green-700 text-white p-2 rounded-full cursor-pointer transition-all duration-300">
                      <Camera className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                        disabled={avatarUploading}
                      />
                    </label>
                  )}
                </div>
                {avatarUploading && (
                  <p className="text-green-400 text-sm mt-2">Uploading...</p>
                )}
                {avatarError && (
                  <p className="text-red-400 text-sm mt-2">{avatarError}</p>
                )}
                <h2 className="text-xl font-bold text-white mt-4">
                  {formData.firstName} {formData.lastName}
                </h2>
                <p className="text-gray-400">{formData.email}</p>
              </div>
            </div>

            {/* Completion Stats */}
            <div className="bg-dark-800/50 rounded-2xl p-6 border border-green-500/20">
              <h3 className="text-lg font-semibold text-white mb-4">Profile Completion</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Basic Info</span>
                    <span className="text-green-400">{basicCompletion}%</span>
                  </div>
                  <div className="w-full bg-dark-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${basicCompletion}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Professional</span>
                    <span className="text-green-400">{professionalCompletion}%</span>
                  </div>
                  <div className="w-full bg-dark-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${professionalCompletion}%` }}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-dark-600">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white font-semibold">Overall</span>
                    <span className="text-green-400 font-semibold">{overallCompletion}%</span>
                  </div>
                  <div className="w-full bg-dark-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${overallCompletion}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-dark-800/50 rounded-2xl p-6 border border-green-500/20">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-green-400" />
                    <span className="text-gray-400">Skills</span>
                  </div>
                  <span className="text-white font-semibold">{formData.skills.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-green-400" />
                    <span className="text-gray-400">Languages</span>
                  </div>
                  <span className="text-white font-semibold">{formData.languages.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <span className="text-gray-400">Hourly Rate</span>
                  </div>
                  <span className="text-white font-semibold">
                    {formData.hourlyRate ? `₹${formData.hourlyRate}` : 'Not set'}
                  </span>
                </div>
                {user?.role === 'freelancer' && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-green-400" />
                      <span className="text-gray-400">Portfolio Projects</span>
                    </div>
                    <span className="text-white font-semibold">{formData.portfolio.length}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-dark-800/50 rounded-2xl p-6 border border-green-500/20 mb-6">
              <div className="flex space-x-1 mb-6">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'bg-green-600 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-dark-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div className="min-h-[400px]">
                {activeTab === 'basic' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Basic Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none disabled:opacity-50"
                          placeholder="Enter your first name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none disabled:opacity-50"
                          placeholder="Enter your last name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none disabled:opacity-50"
                          placeholder="Enter your email"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none disabled:opacity-50"
                          placeholder="Enter your phone number"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none disabled:opacity-50"
                          placeholder="Enter your location"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Website
                        </label>
                        <input
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none disabled:opacity-50"
                          placeholder="Enter your website URL"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'professional' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Professional Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        rows={4}
                        className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none disabled:opacity-50"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Hourly Rate (₹)
                        </label>
                        <input
                          type="number"
                          name="hourlyRate"
                          value={formData.hourlyRate}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none disabled:opacity-50"
                          placeholder="Enter your hourly rate"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Experience
                        </label>
                        <input
                          type="text"
                          name="experience"
                          value={formData.experience}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none disabled:opacity-50"
                          placeholder="e.g., 5 years in web development"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Education
                      </label>
                      <textarea
                        name="education"
                        value={formData.education}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        rows={3}
                        className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none disabled:opacity-50"
                        placeholder="Enter your education details..."
                      />
                    </div>

                    {/* Portfolio Section - Only for freelancers */}
                    {user?.role === 'freelancer' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Portfolio Projects
                        </label>
                        <p className="text-xs text-gray-500 mb-4">Showcase your best work to attract clients</p>
                        
                        {/* Add new portfolio item */}
                        {isEditing && (
                          <div className="bg-dark-700/50 rounded-lg p-4 mb-4 border border-dark-600">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">
                                  Project Title
                                </label>
                                <input
                                  type="text"
                                  value={newPortfolioItem.title}
                                  onChange={(e) => handlePortfolioItemChange('title', e.target.value)}
                                  className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none text-sm"
                                  placeholder="Project title..."
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">
                                  Project URL
                                </label>
                                <input
                                  type="url"
                                  value={newPortfolioItem.url}
                                  onChange={(e) => handlePortfolioItemChange('url', e.target.value)}
                                  className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none text-sm"
                                  placeholder="https://..."
                                />
                              </div>
                            </div>
                            <div className="mb-4">
                              <label className="block text-xs font-medium text-gray-400 mb-1">
                                Description
                              </label>
                              <textarea
                                value={newPortfolioItem.description}
                                onChange={(e) => handlePortfolioItemChange('description', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none text-sm"
                                placeholder="Describe your project..."
                              />
                            </div>
                            <div className="mb-4">
                              <label className="block text-xs font-medium text-gray-400 mb-1">
                                Image URL
                              </label>
                              <input
                                type="url"
                                value={newPortfolioItem.image}
                                onChange={(e) => handlePortfolioItemChange('image', e.target.value)}
                                className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none text-sm"
                                placeholder="https://..."
                              />
                            </div>
                            <button
                              onClick={handleAddPortfolioItem}
                              disabled={!newPortfolioItem.title.trim() || !newPortfolioItem.description.trim()}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-dark-600 disabled:text-gray-500 text-white rounded-lg transition-colors text-sm"
                            >
                              Add Project
                            </button>
                          </div>
                        )}

                        {/* Display existing portfolio items */}
                        <div className="space-y-3">
                          {formData.portfolio.map((item, index) => (
                            <div key={index} className="bg-dark-700/50 rounded-lg p-4 border border-dark-600">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="text-white font-medium">{item.title}</h4>
                                {isEditing && (
                                  <button
                                    onClick={() => handleRemovePortfolioItem(index)}
                                    className="text-red-400 hover:text-red-300 text-sm"
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>
                              {item.url && (
                                <a 
                                  href={item.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-green-400 hover:text-green-300 text-sm block mb-2"
                                >
                                  {item.url}
                                </a>
                              )}
                              <p className="text-gray-400 text-sm">{item.description}</p>
                              {item.image && (
                                <div className="mt-2">
                                  <img 
                                    src={item.image} 
                                    alt={item.title}
                                    className="w-full h-32 object-cover rounded-lg"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                          {formData.portfolio.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                              <Award className="w-8 h-8 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">No portfolio projects yet</p>
                              {!isEditing && (
                                <p className="text-xs mt-1">Click Edit to add your projects</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'skills' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Skills & Languages</h3>
                    
                    {/* Skills Section */}
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Skills
                      </label>
                      <div className="flex space-x-2 mb-4">
                        <input
                          type="text"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyPress={(e) => handleKeyPress(e, handleAddSkill)}
                          disabled={!isEditing}
                          className="flex-1 px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none disabled:opacity-50"
                          placeholder="Add a skill..."
                        />
                        {isEditing && (
                          <button
                            onClick={handleAddSkill}
                            className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                          >
                            Add
                          </button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-sm flex items-center space-x-2"
                          >
                            <span>{skill}</span>
                            {isEditing && (
                              <button
                                onClick={() => handleRemoveSkill(skill)}
                                className="text-green-400 hover:text-red-400 transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Languages Section */}
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Languages
                      </label>
                      <div className="flex space-x-2 mb-4">
                        <input
                          type="text"
                          value={newLanguage}
                          onChange={(e) => setNewLanguage(e.target.value)}
                          onKeyPress={(e) => handleKeyPress(e, handleAddLanguage)}
                          disabled={!isEditing}
                          className="flex-1 px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none disabled:opacity-50"
                          placeholder="Add a language..."
                        />
                        {isEditing && (
                          <button
                            onClick={handleAddLanguage}
                            className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                          >
                            Add
                          </button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.languages.map((language, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm flex items-center space-x-2"
                          >
                            <span>{language}</span>
                            {isEditing && (
                              <button
                                onClick={() => handleRemoveLanguage(language)}
                                className="text-blue-400 hover:text-red-400 transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'preview' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Profile Preview</h3>
                    
                    <div className="bg-dark-700/50 rounded-xl p-6 border border-dark-600">
                      <div className="flex items-center space-x-4 mb-6">
                        <img
                          src={avatarUrl}
                          alt="Profile"
                          className="w-20 h-20 rounded-full object-cover border-2 border-green-500/20"
                        />
                        <div>
                          <h4 className="text-xl font-bold text-white">
                            {formData.firstName} {formData.lastName}
                          </h4>
                          <p className="text-gray-400">{formData.email}</p>
                          {formData.location && (
                            <p className="text-gray-400 flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {formData.location}
                            </p>
                          )}
                        </div>
                      </div>

                      {formData.bio && (
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-gray-400 mb-2">Bio</h5>
                          <p className="text-white">{formData.bio}</p>
                        </div>
                      )}

                      {formData.skills.length > 0 && (
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-gray-400 mb-2">Skills</h5>
                          <div className="flex flex-wrap gap-2">
                            {formData.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-green-600/20 text-green-400 rounded text-xs"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {formData.languages.length > 0 && (
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-gray-400 mb-2">Languages</h5>
                          <div className="flex flex-wrap gap-2">
                            {formData.languages.map((language, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs"
                              >
                                {language}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {formData.hourlyRate && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-400 mb-2">Hourly Rate</h5>
                          <p className="text-white font-semibold">₹{formData.hourlyRate}/hour</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 
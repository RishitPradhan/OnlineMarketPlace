import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: '',
    skills: [],
    hourlyRate: '',
    location: '',
    website: '',
    phone: ''
  });

  const [isEditing, setIsEditing] = useState(true);

  // Calculate completion percentage based on filled fields
  const calculateCompletion = () => {
    const requiredFields = ['firstName', 'lastName', 'bio', 'hourlyRate', 'location'];
    const filledFields = requiredFields.filter(field => 
      formData[field as keyof typeof formData] && 
      String(formData[field as keyof typeof formData]).trim() !== ''
    );
    return Math.round((filledFields.length / requiredFields.length) * 100);
  };

  const completionPercentage = calculateCompletion();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Here you would typically save to your backend
    console.log('Saving profile:', formData);
    setIsEditing(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 to-dark-900">
      <div className="w-full px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Complete Your Profile 📋
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            A complete profile helps you attract better clients and earn more. Let's build your professional presence.
          </p>
        </div>

        {/* Profile Completion Progress */}
        <div className="bg-dark-800 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Profile Completion</h2>
            <span className="text-green-400 font-medium">{completionPercentage}% Complete</span>
          </div>
          <div className="w-full bg-dark-700 rounded-full h-3 mb-4">
            <div className="bg-green-500 h-3 rounded-full transition-all duration-500" style={{ width: `${completionPercentage}%` }}></div>
          </div>
          <p className="text-gray-300 text-sm">
            {completionPercentage === 0 ? 'Start by filling out your basic information.' :
             completionPercentage < 50 ? 'Good start! Keep adding more details to improve your profile.' :
             completionPercentage < 100 ? 'Great progress! You\'re almost there.' :
             'Excellent! Your profile is complete and ready to attract clients.'}
          </p>
        </div>

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
        </div>

        {/* Skills Section */}
        <div className="bg-dark-800 rounded-lg p-8 mt-8">
          <h3 className="text-2xl font-bold text-white mb-6">Skills & Expertise</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-gray-300 mb-2 font-medium">Add Skills</label>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Enter a skill"
                  className="flex-1 px-4 py-3 bg-dark-700 border border-dark-600 rounded-l-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
                />
                <button className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-r-lg transition-colors duration-200">
                  Add
                </button>
              </div>
            </div>
            <div>
              <label className="block text-gray-300 mb-2 font-medium">Your Skills</label>
              <div className="flex flex-wrap gap-2">
                {formData.skills.length === 0 ? (
                  <p className="text-gray-400 text-sm">No skills added yet. Add your first skill above.</p>
                ) : (
                  formData.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-green-600 text-white rounded-full text-sm">
                      {skill} ×
                    </span>
                  ))
                )}
              </div>
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
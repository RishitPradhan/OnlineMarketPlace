import { User } from '../types';

export interface ProfileCompletionStatus {
  isComplete: boolean;
  completionPercentage: number;
  missingFields: string[];
  requiredFields: string[];
}

export interface ProfileRequirements {
  basic: {
    firstName: boolean;
    lastName: boolean;
    email: boolean;
  };
  professional: {
    bio: boolean;
    skills: boolean;
    portfolio: boolean;
    hourlyRate: boolean;
    location: boolean;
  };
  verification: {
    phoneVerified: boolean;
    emailVerified: boolean;
    identityVerified: boolean;
  };
}

export const REQUIRED_FIELDS = {
  CLIENT: ['firstName', 'lastName', 'email', 'phone', 'location'],
  FREELANCER: ['firstName', 'lastName', 'email', 'bio', 'skills', 'hourlyRate', 'location', 'portfolio']
};

export const checkProfileCompletion = (user: User | null): ProfileCompletionStatus => {
  if (!user) {
    return {
      isComplete: false,
      completionPercentage: 0,
      missingFields: ['user'],
      requiredFields: []
    };
  }

  const requiredFields = user.role === 'freelancer' ? REQUIRED_FIELDS.FREELANCER : REQUIRED_FIELDS.CLIENT;
  const missingFields: string[] = [];
  const completedFields: string[] = [];

  // Check basic fields from user object
  if (!user.firstName?.trim()) missingFields.push('firstName');
  else completedFields.push('firstName');

  if (!user.lastName?.trim()) missingFields.push('lastName');
  else completedFields.push('lastName');

  if (!user.email?.trim()) missingFields.push('email');
  else completedFields.push('email');

  // Check role-specific fields
  if (user.role === 'freelancer') {
    // Get additional profile data from localStorage (using the same keys as DashboardOverview)
    const profileData = localStorage.getItem('profileData');
    const skillsData = localStorage.getItem('skillsData');
    const portfolioData = localStorage.getItem('portfolioProjects');

    const profile = profileData ? JSON.parse(profileData) : {};
    const skills = skillsData ? JSON.parse(skillsData) : [];
    const portfolio = portfolioData ? JSON.parse(portfolioData) : [];

    // Check profile fields
    if (!profile.bio?.trim()) missingFields.push('bio');
    else completedFields.push('bio');

    if (!profile.hourlyRate) missingFields.push('hourlyRate');
    else completedFields.push('hourlyRate');

    if (!profile.location?.trim()) missingFields.push('location');
    else completedFields.push('location');

    // Check skills (must have at least one skill)
    if (!Array.isArray(skills) || skills.length === 0) missingFields.push('skills');
    else completedFields.push('skills');

    // Check portfolio (must have at least one portfolio item)
    if (!Array.isArray(portfolio) || portfolio.length === 0) missingFields.push('portfolio');
    else completedFields.push('portfolio');
  } else {
    // For clients, check basic profile data
    const profileData = localStorage.getItem('profileData');
    const profile = profileData ? JSON.parse(profileData) : {};

    if (!profile.phone?.trim()) missingFields.push('phone');
    else completedFields.push('phone');

    if (!profile.location?.trim()) missingFields.push('location');
    else completedFields.push('location');
  }

  const completionPercentage = Math.round((completedFields.length / requiredFields.length) * 100);
  const isComplete = missingFields.length === 0;

  return {
    isComplete,
    completionPercentage,
    missingFields,
    requiredFields
  };
};

export const getProfileCompletionMessage = (status: ProfileCompletionStatus, user: User | null): string => {
  if (!user) return 'Please log in to continue.';

  if (status.isComplete) {
    return 'Your profile is complete! You can now use all features.';
  }

  const missingCount = status.missingFields.length;
  const totalCount = status.requiredFields.length;
  
  return `Please complete your profile (${status.completionPercentage}% complete). Missing: ${missingCount} of ${totalCount} required fields.`;
};

export const isActionBlocked = (action: string, user: User | null): boolean => {
  const status = checkProfileCompletion(user);
  
  // Define which actions require complete profile
  const blockedActions = [
    'place_order',
    'send_message',
    'create_service',
    'bid_on_project',
    'withdraw_earnings',
    'apply_for_job',
    'create_gig',
    'contact_freelancer',
    'contact_client'
  ];

  return blockedActions.includes(action) && !status.isComplete;
};

export const getBlockedActionMessage = (action: string): string => {
  const messages = {
    place_order: 'Please complete your profile before placing orders.',
    send_message: 'Please complete your profile before sending messages.',
    create_service: 'Please complete your profile before creating services.',
    bid_on_project: 'Please complete your profile before bidding on projects.',
    withdraw_earnings: 'Please complete your profile before withdrawing earnings.',
    apply_for_job: 'Please complete your profile before applying for jobs.',
    create_gig: 'Please complete your profile before creating gigs.',
    contact_freelancer: 'Please complete your profile before contacting freelancers.',
    contact_client: 'Please complete your profile before contacting clients.'
  };

  return messages[action as keyof typeof messages] || 'Please complete your profile to use this feature.';
}; 
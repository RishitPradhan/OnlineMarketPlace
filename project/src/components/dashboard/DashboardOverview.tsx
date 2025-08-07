import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, TrendingUp, Users, Award, Clock, DollarSign, MessageCircle, Eye, Heart, Share2, User, AlertTriangle, CheckCircle } from 'lucide-react';
import { useProfileCompletion } from '../common/ProfileCompletionGuard';
import { checkBasicProfileCompletion } from '../../lib/profile-completion';
import { supabase } from '../../lib/supabase';

// User-specific localStorage keys
const getLocalProfileKey = (userId: string) => `user_${userId}_profileData`;
const getLocalSkillsKey = (userId: string) => `user_${userId}_skillsData`;
const getLocalServicesKey = (userId: string) => `user_${userId}_servicesData`;
const getLocalPortfolioKey = (userId: string) => `user_${userId}_portfolioProjects`;

// Helper function to get user-specific localStorage keys
const getUserStorageKey = (userId: string, key: string): string => {
  return `user_${userId}_${key}`;
};

// Helper function to calculate profile completion percentage
const calculateProfileCompletion = (user: any): number => {
  if (!user) return 0;
  
  const profileData = localStorage.getItem(getUserStorageKey(user.id || '', 'profileData'));
  const profile = profileData ? JSON.parse(profileData) : {};
  const skillsData = localStorage.getItem(getUserStorageKey(user.id || '', 'skillsData'));
  const skills = skillsData ? JSON.parse(skillsData) : [];
  
  let completedFields = 0;
  let totalFields = 0;
  
  // Check basic fields
  if (user.firstName?.trim()) completedFields++;
  if (user.lastName?.trim()) completedFields++;
  if (user.email?.trim()) completedFields++;
  totalFields += 3;
  
  // Check role-specific fields
  if (user.role === 'freelancer') {
    if (profile.bio?.trim()) completedFields++;
    if (profile.hourlyRate) completedFields++;
    if (profile.location?.trim()) completedFields++;
    if (Array.isArray(skills) && skills.length > 0) completedFields++;
    totalFields += 4;
  } else {
    // For clients, only check phone and location (no portfolio required)
    if (profile.phone?.trim()) completedFields++;
    if (profile.location?.trim()) completedFields++;
    totalFields += 2;
  }
  
  return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
};

// Carousel data for hero section
const heroSlides = [
  {
    id: 1,
    title: "Find Your Perfect Freelancer",
    subtitle: "Connect with top-rated professionals across all industries",
    description: "From web development to graphic design, find the right talent for your project",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=400&fit=crop",
    cta: "Browse Services",
    ctaLink: "/browse-services",
    color: "from-blue-600 to-purple-600"
  },
  {
    id: 2,
    title: "Showcase Your Skills",
    subtitle: "Create stunning portfolios and attract high-paying clients",
    description: "Build your professional presence and stand out in the competitive market",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=400&fit=crop",
    cta: "Create Profile",
            ctaLink: "/profile",
    color: "from-green-600 to-teal-600"
  },
  {
    id: 3,
    title: "Secure Payments & Trust",
    subtitle: "Safe, transparent transactions with escrow protection",
    description: "Get paid securely and build trust with our advanced payment system",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=400&fit=crop",
    cta: "Learn More",
    ctaLink: "/payments",
    color: "from-orange-600 to-red-600"
  }
];

// Default featured services data (fallback)
const defaultFeaturedServices = [
  {
    id: "web-development-service",
    title: "Professional Web Development",
    category: "Web Development",
    price: "₹2,500",
    rating: 4.9,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    freelancer: "Web Development Team",
    delivery: "7 days",
    featured: true,
    description: "Professional web development services with modern technologies and responsive design."
  },
  {
    id: "graphic-design-service",
    title: "Creative Graphic Design",
    category: "Graphic Design",
    price: "₹800",
    rating: 4.8,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
    freelancer: "Creative Design Studio",
    delivery: "5 days",
    featured: true,
    description: "Creative graphic design services including logos, branding, and digital art."
  },
  {
    id: "mobile-app-service",
    title: "Mobile App Development",
    category: "App Development",
    price: "₹5,000",
    rating: 4.7,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
    freelancer: "Mobile App Team",
    delivery: "14 days",
    featured: true,
    description: "Professional mobile app development for iOS and Android platforms."
  },
  {
    id: "seo-service",
    title: "SEO Optimization",
    category: "SEO",
    price: "₹600",
    rating: 4.6,
    reviews: 120,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop",
    freelancer: "SEO Expert",
    delivery: "10 days",
    featured: true,
    description: "Comprehensive SEO optimization to improve your website's search engine rankings."
  }
];

// Platform stats
const platformStats = [
  { label: "Active Freelancers", value: "2,500+", icon: Users, color: "text-blue-400" },
  { label: "Completed Projects", value: "15,000+", icon: Award, color: "text-green-400" },
  { label: "Client Satisfaction", value: "98%", icon: Star, color: "text-yellow-400" },
  { label: "Average Response", value: "< 2 hours", icon: Clock, color: "text-purple-400" }
];

// Recent activities data
const recentActivities = [
  {
    id: 1,
    type: "order",
    title: "New order received",
    description: "Website redesign project",
    time: "2 hours ago",
    amount: "₹15,000",
    status: "pending"
  },
  {
    id: 2,
    type: "payment",
    title: "Payment received",
    description: "Logo design project",
    time: "1 day ago",
    amount: "₹5,000",
    status: "completed"
  },
  {
    id: 3,
    type: "message",
    title: "New message",
    description: "From client regarding project",
    time: "2 days ago",
    amount: null,
    status: "unread"
  }
];

// Helper function to get random demo image based on service ID for consistency
const getRandomDemoImage = (serviceId: string) => {
  const demoImages = [
    '/OIPbg.png', '/OIPfdf.png', '/OIPfef.png', '/OIPefe.png', '/OIPcdf.png', '/OIPnc.png', '/OIPb.png', '/OIPg.png',
    '/why-trust-slideuplift-presentation-design-services-6.png', '/OIPn.png', '/OIPf.png', '/OIPdf.png', '/OIPvg.png',
    '/OIPfg.png', '/wp9517064.png', '/representations_user_experience_interface_design_23_2150038900_74c059d2e1.png',
    '/OIP78.png', '/R.png', '/OIPuj.png', '/graphic-design.png', '/OIPj.png', '/Thumbnail-1.png', '/seo-techniques.png',
    '/Facility_Management_Software_fd01278999.png', '/OIPh.png', '/OIP34.png', '/OIPt.png', '/banner-content-writing.png',
    '/6.png', '/business-women-work-computers-write-notepad-with-pen-calculate-financial-statements-office_931309-4329.png',
    '/574-5741689_content-writing-services-png-transparent-png.png', '/OIP9.png', '/OIP.8png.png', '/OIP7.png', '/OIP6.png',
    '/OIP5.png', '/OIP4.png', '/OIP3.png', '/OIP2.png', '/7-Tips-to-Localize-and-Translate-Apps.png',
    '/Social-media-marketing-01-1024x536.png', '/social-media-engagement_839035-839915.png',
    '/datadriven-social-media-management-for-startups-ihh.png', '/featured_homepage.png', '/OIP1.png',
    '/pexels-francesco-paggiaro-2111015-scaled.png', '/wp4269240.png', '/InTheStudio.png', '/music-8589292_640.png',
    '/OIP.png', '/TharLU.png', '/Artboard-22.png'
  ];
  const index = parseInt(serviceId.slice(-2), 16) % demoImages.length;
  return demoImages[index];
};

export const DashboardOverview: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { status } = useProfileCompletion();
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredServices, setFeaturedServices] = useState(defaultFeaturedServices);

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch featured services from database
  useEffect(() => {
    const fetchFeaturedServices = async () => {
      try {
        const { data: services, error } = await supabase
          .from('services')
          .select('*, users!services_freelancerid_fkey(first_name, last_name, avatar)')
          .eq('isactive', true)
          .order('created_at', { ascending: false })
          .limit(8);

        if (error) {
          console.error('Error fetching featured services:', error);
          return;
        }

        if (services && services.length > 0) {
          const formattedServices = services.map(service => ({
            id: service.id,
            title: service.title || service.name || 'Professional Service',
            category: service.category ? service.category.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) : 'General',
            price: service.price ? `₹${service.price}` : '₹500',
            rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0
            reviews: Math.floor(Math.random() * 200) + 50,
            image: service.imageurl || getRandomDemoImage(service.id),
            freelancer: service.users ? `${service.users.first_name || ''} ${service.users.last_name || ''}`.trim() || 'Professional Freelancer' : 'Professional Freelancer',
            delivery: service.deliverytime ? `${service.deliverytime} days` : '7 days',
            featured: true,
            description: service.description || 'Professional service with high quality standards.'
          }));
          setFeaturedServices(formattedServices);
        }
      } catch (error) {
        console.error('Error fetching featured services:', error);
      }
    };

    fetchFeaturedServices();
  }, []);

  // Profile completion is now handled by the useProfileCompletion hook

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Check if user is new (created in last 7 days)
  const isNewUser = !user || new Date(user.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 to-dark-900">
      {/* Hero Carousel Section */}
      <div className="relative h-96 mb-8 overflow-hidden rounded-2xl mx-6 mt-6">
        <div className="relative h-full">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
              }`}
            >
              <div className="relative h-full">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
                <div className="absolute inset-0 flex items-center">
                  <div className="ml-12 max-w-2xl">
                    <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
                      {slide.title}
                    </h1>
                    <h2 className="text-xl text-green-400 mb-3 font-semibold">
                      {slide.subtitle}
                    </h2>
                    <p className="text-gray-300 mb-6 text-lg">
                      {slide.description}
                    </p>
                    <button
                      onClick={() => navigate(slide.ctaLink)}
                      className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      {slide.cta}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Navigation */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-green-400' : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Profile Completion Section - Only show when basic profile is incomplete */}
      {!checkBasicProfileCompletion(user) && (
        <div className="px-6 mb-8">
          <Card className="glass-effect neon-border p-6 border-l-4 border-l-green-500">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Complete Your Profile</h2>
                  <p className="text-green-400/70 text-sm">Unlock all features by completing your profile</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/profile')}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                Complete Now
              </button>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-green-400">Profile Completion</span>
                <span className="text-sm font-semibold text-white">
                  {calculateProfileCompletion(user)}%
                </span>
              </div>
              <div className="w-full bg-dark-700/50 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-700"
                  style={{ width: `${calculateProfileCompletion(user)}%` }}
                />
              </div>
            </div>

            {(() => {
              const profileData = localStorage.getItem(getUserStorageKey(user?.id || '', 'profileData'));
              const profile = profileData ? JSON.parse(profileData) : {};
              const skillsData = localStorage.getItem(getUserStorageKey(user?.id || '', 'skillsData'));
              const skills = skillsData ? JSON.parse(skillsData) : [];
              
              const missingFields = [];
              
              // Check basic fields
              if (!user?.firstName) missingFields.push('First Name');
              if (!user?.lastName) missingFields.push('Last Name');
              if (!user?.email) missingFields.push('Email');
              
              // Check role-specific fields
              if (user?.role === 'freelancer') {
                if (!profile.bio?.trim()) missingFields.push('Bio');
                if (!profile.hourlyRate) missingFields.push('Hourly Rate');
                if (!profile.location?.trim()) missingFields.push('Location');
                if (!Array.isArray(skills) || skills.length === 0) missingFields.push('Skills');
              } else {
                // For clients, only check phone and location (no portfolio required)
                if (!profile.phone?.trim()) missingFields.push('Phone Number');
                if (!profile.location?.trim()) missingFields.push('Location');
              }
              
              return missingFields.length > 0 ? (
                <div>
                  <p className="text-sm text-white mb-3">Missing information:</p>
                  <div className="flex flex-wrap gap-2">
                    {missingFields.map((field) => (
                      <span key={field} className="px-3 py-1 rounded-full text-xs bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {field}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null;
            })()}
          </Card>
        </div>
      )}

      {/* Platform Stats Section */}
      <div className="px-6 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {platformStats.map((stat, index) => (
            <Card key={index} className="glass-effect neon-border p-5 text-center hover-scale-subtle bg-dark-800/20 border-green-500/5">
              <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
              <div className="text-xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-xs text-green-400">{stat.label}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="px-6 grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Featured Services Section */}
        <div className="lg:col-span-2 flex flex-col">
          <Card className="glass-effect neon-border p-6 bg-dark-800/20 border-green-500/5 flex-1">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Featured Services</h2>
                <p className="text-gray-400 text-sm">Explore our top services</p>
              </div>
              <button
                onClick={() => navigate('/browse-services')}
                className="text-green-400 hover:text-green-300 text-sm font-medium"
              >
                View All →
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredServices.length > 0 ? (
                featuredServices.map((service, index) => (
                  <div 
                    key={service.id} 
                    className="bg-dark-800/20 rounded-lg p-5 border border-green-500/5 hover:bg-dark-800/30 transition-all duration-300 cursor-pointer group transform hover:scale-105"
                    onClick={() => navigate(`/service/${service.id}`)}
                  >
                    <div className="relative mb-4">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-40 object-cover rounded-lg group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop";
                        }}
                      />
                      <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Featured
                      </div>
                    </div>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-white group-hover:text-green-400 transition-colors line-clamp-2">
                        {service.title}
                      </h3>
                      <span className="text-green-400 font-bold ml-2 flex-shrink-0">{service.price}</span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-400 text-sm">{service.category}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-white text-sm">{service.rating?.toFixed(1)}</span>
                        <span className="text-gray-400 text-xs">({service.reviews})</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-400 text-xs">by {service.freelancer}</span>
                      <span className="text-gray-400 text-xs">{service.delivery}</span>
                    </div>
                    <p className="text-gray-300 text-sm line-clamp-2">
                      {service.description}
                    </p>
                  </div>
                ))
              ) : (
                // Loading skeleton
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="bg-dark-800/20 rounded-lg p-5 border border-green-500/5 animate-pulse">
                    <div className="w-full h-40 bg-dark-700/30 rounded-lg mb-4"></div>
                    <div className="h-5 bg-dark-700/30 rounded mb-2"></div>
                    <div className="h-4 bg-dark-700/30 rounded w-24"></div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Quick Actions & Profile Section */}
        <div className="flex flex-col space-y-6 h-full">
          {/* Quick Actions */}
          <Card className="glass-effect neon-border p-6 bg-dark-800/20 border-green-500/5">
            <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/browse-services')}
                className="w-full flex items-center p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-300 hover-scale-subtle"
              >
                <Eye className="w-5 h-5 mr-3" />
                Browse Services
              </button>
              <button
                onClick={() => navigate('/services')}
                className="w-full flex items-center p-3 bg-dark-800 hover:bg-dark-700 text-white border border-green-500/30 rounded-lg transition-all duration-300 hover-scale-subtle"
              >
                <DollarSign className="w-5 h-5 mr-3" />
                Create Service
              </button>
              <button
                onClick={() => navigate('/messages')}
                className="w-full flex items-center p-3 bg-dark-800 hover:bg-dark-700 text-white border border-green-500/30 rounded-lg transition-all duration-300 hover-scale-subtle"
              >
                <MessageCircle className="w-5 h-5 mr-3" />
                Check Messages
              </button>
              <button
                onClick={() => navigate('/my-orders')}
                className="w-full flex items-center p-3 bg-dark-800 hover:bg-dark-700 text-white border border-green-500/30 rounded-lg transition-all duration-300 hover-scale-subtle"
              >
                <Clock className="w-5 h-5 mr-3" />
                My Orders
              </button>
            </div>
          </Card>

          {/* Platform Insights */}
          <Card className="glass-effect neon-border p-6 bg-dark-800/20 border-green-500/5 flex-1">
            <h3 className="text-xl font-bold text-white mb-4">Platform Insights</h3>
            <div className="space-y-4">
              {[
                { 
                  metric: "98%", 
                  label: "Client Satisfaction",
                  trend: "+2.3%",
                  color: "text-green-400"
                },
                { 
                  metric: "₹2.5M+", 
                  label: "Total Earnings",
                  trend: "+15.2%",
                  color: "text-blue-400"
                },
                { 
                  metric: "15K+", 
                  label: "Active Projects",
                  trend: "+8.7%",
                  color: "text-purple-400"
                },
                { 
                  metric: "24/7", 
                  label: "Support Available",
                  trend: "Live",
                  color: "text-yellow-400"
                }
              ].map((insight, index) => (
                <div key={index} className="p-3 rounded-lg bg-dark-800/30 border border-green-500/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-2xl font-bold ${insight.color}`}>{insight.metric}</span>
                    <span className="text-xs text-green-400 font-medium">{insight.trend}</span>
                  </div>
                  <p className="text-white text-sm font-medium">{insight.label}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Platform Highlights Section */}
      <div className="px-6 mb-8">
        <Card className="glass-effect neon-border p-8">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Why Choose FreelanceHub?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Quality Assurance</h3>
              <p className="text-gray-400">
                Every freelancer is verified and rated by our community. Only the best make it to the top.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Secure Payments</h3>
              <p className="text-gray-400">
                Your money is protected with escrow. Pay only when you're satisfied with the work.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Global Talent</h3>
              <p className="text-gray-400">
                Access a diverse pool of skilled professionals from around the world.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, TrendingUp, Users, Award, Clock, DollarSign, MessageCircle, Eye, Heart, Share2 } from 'lucide-react';

const LOCAL_PROFILE_KEY = 'profileData';
const LOCAL_SKILLS_KEY = 'skillsData';
const LOCAL_SERVICES_KEY = 'servicesData';
const LOCAL_PORTFOLIO_KEY = 'portfolioProjects';

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
    ctaLink: "/profile-completion",
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

// Featured services data
const featuredServices = [
  {
    id: 1,
    title: "Website Development",
    category: "Web Development",
    price: "₹2,500",
    rating: 4.9,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    freelancer: "Sarah Johnson",
    delivery: "3 days",
    featured: true
  },
  {
    id: 2,
    title: "Logo & Brand Identity",
    category: "Graphic Design",
    price: "₹800",
    rating: 5.0,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
    freelancer: "Mike Chen",
    delivery: "2 days",
    featured: true
  },
  {
    id: 3,
    title: "Mobile App Design",
    category: "UI/UX Design",
    price: "₹1,200",
    rating: 4.8,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
    freelancer: "Alex Rodriguez",
    delivery: "5 days",
    featured: true
  },
  {
    id: 4,
    title: "Content Writing",
    category: "Writing",
    price: "₹400",
    rating: 4.9,
    reviews: 120,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=400&h=300&fit=crop",
    freelancer: "Emma Wilson",
    delivery: "1 day",
    featured: true
  }
];

// Platform stats
const platformStats = [
  { icon: Users, label: "Active Freelancers", value: "50K+", color: "text-blue-400" },
  { icon: TrendingUp, label: "Projects Completed", value: "100K+", color: "text-green-400" },
  { icon: Award, label: "Client Satisfaction", value: "98%", color: "text-yellow-400" },
  { icon: Clock, label: "Avg. Delivery Time", value: "3.2 days", color: "text-purple-400" }
];

// Recent activities
const recentActivities = [
  { type: "order", message: "New order received for Website Design", time: "2 hours ago", status: "pending" },
  { type: "message", message: "Client message from John Smith", time: "4 hours ago", status: "unread" },
  { type: "payment", message: "Payment received for Logo Design project", time: "1 day ago", status: "completed" },
  { type: "review", message: "5-star review received from TechCorp", time: "2 days ago", status: "positive" }
];

export const DashboardOverview: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [profileChecks, setProfileChecks] = useState({
    profile: false,
    bio: false,
    portfolio: false,
    skills: false
  });

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    function recalcProfileCompletion() {
      const profileRaw = localStorage.getItem(LOCAL_PROFILE_KEY);
      let profile = null;
      if (profileRaw) profile = JSON.parse(profileRaw);
      const skillsRaw = localStorage.getItem(LOCAL_SKILLS_KEY);
      const skills = skillsRaw ? JSON.parse(skillsRaw) : [];
      const portfolioRaw = localStorage.getItem(LOCAL_PORTFOLIO_KEY);
      const portfolio = portfolioRaw ? JSON.parse(portfolioRaw) : [];

      const checks = {
        profile: !!(profile && profile.firstName && profile.lastName && profile.hourlyRate && profile.location),
        bio: !!(profile && profile.bio && String(profile.bio).trim() !== ''),
        portfolio: Array.isArray(portfolio) && portfolio.length > 0,
        skills: Array.isArray(skills) && skills.length > 0
      };
      setProfileChecks(checks);
      const completed = Object.values(checks).filter(Boolean).length;
      setProfileCompletion(Math.round((completed / 4) * 100));
    }
    recalcProfileCompletion();
    window.addEventListener('storage', recalcProfileCompletion);
    window.addEventListener('skills-updated', recalcProfileCompletion);
    return () => {
      window.removeEventListener('storage', recalcProfileCompletion);
      window.removeEventListener('skills-updated', recalcProfileCompletion);
    };
  }, []);

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

      {/* Platform Stats Section */}
      <div className="px-6 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {platformStats.map((stat, index) => (
            <Card key={index} className="glass-effect neon-border p-6 text-center hover-scale-subtle">
              <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-green-400">{stat.label}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="px-6 grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Featured Services Section */}
        <div className="lg:col-span-2">
          <Card className="glass-effect neon-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Featured Services</h2>
              <button
                onClick={() => navigate('/browse-services')}
                className="text-green-400 hover:text-green-300 text-sm font-medium"
              >
                View All →
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuredServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-dark-800/50 rounded-lg p-4 border border-green-500/20 hover:border-green-400/40 transition-all duration-300 hover-scale-subtle cursor-pointer"
                  onClick={() => navigate(`/service/${service.id}`)}
                >
                  <div className="relative mb-3">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    {service.featured && (
                      <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                        Featured
                      </div>
                    )}
                  </div>
                  <h3 className="text-white font-semibold mb-1">{service.title}</h3>
                  <p className="text-green-400 text-sm mb-2">{service.category}</p>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white text-sm ml-1">{service.rating}</span>
                      <span className="text-gray-400 text-sm ml-1">({service.reviews})</span>
                    </div>
                    <span className="text-green-400 font-bold">{service.price}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>by {service.freelancer}</span>
                    <span>Delivery: {service.delivery}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions & Profile Section */}
        <div className="space-y-6">
          {/* Profile Completion Card */}
          {isNewUser && profileCompletion < 100 && (
            <Card className="glass-effect neon-border p-6">
              <h3 className="text-xl font-bold text-white mb-4">Complete Your Profile</h3>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-green-400">Progress</span>
                  <span className="text-white">{profileCompletion}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${profileCompletion}%` }}
                  ></div>
                </div>
              </div>
              <button
                onClick={() => navigate('/profile-completion')}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-all duration-300"
              >
                Complete Profile
              </button>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="glass-effect neon-border p-6">
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

          {/* Recent Activities */}
          <Card className="glass-effect neon-border p-6">
            <h3 className="text-xl font-bold text-white mb-4">Recent Activities</h3>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-dark-800/50 transition-all duration-300">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'completed' ? 'bg-green-400' :
                    activity.status === 'pending' ? 'bg-yellow-400' :
                    activity.status === 'unread' ? 'bg-blue-400' :
                    'bg-green-400'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">{activity.message}</p>
                    <p className="text-gray-400 text-xs">{activity.time}</p>
                  </div>
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
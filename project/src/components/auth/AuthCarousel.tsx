import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Users, Briefcase, Star, Zap, Shield, Globe, CheckCircle, TrendingUp, Award, Clock } from 'lucide-react';

interface CarouselSlide {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  features: string[];
}

interface AuthCarouselProps {
  type: 'login' | 'register';
}

export const AuthCarousel: React.FC<AuthCarouselProps> = ({ type }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const loginSlides: CarouselSlide[] = [
    {
      id: 1,
      title: "Welcome Back",
      description: "Access your personalized workspace and continue where you left off.",
      icon: <Shield className="w-12 h-12" />,
      color: "from-emerald-500 to-green-600",
      features: ["Secure Access", "Quick Login", "24/7 Available"]
    },
    {
      id: 2,
      title: "Your Projects",
      description: "Manage your ongoing work and discover new opportunities.",
      icon: <Briefcase className="w-12 h-12" />,
      color: "from-green-500 to-emerald-600",
      features: ["Project Overview", "Recent Activity", "Quick Actions"]
    },
    {
      id: 3,
      title: "Premium Features",
      description: "Enjoy exclusive tools and priority support as a returning member.",
      icon: <Award className="w-12 h-12" />,
      color: "from-teal-500 to-green-600",
      features: ["Priority Support", "Exclusive Tools", "Member Benefits"]
    },
    {
      id: 4,
      title: "Analytics Dashboard",
      description: "Track your performance and growth with detailed insights.",
      icon: <TrendingUp className="w-12 h-12" />,
      color: "from-emerald-600 to-green-700",
      features: ["Performance Metrics", "Earnings Tracking", "Growth Insights"]
    },
    {
      id: 5,
      title: "Secure Payments",
      description: "Manage your transactions with enterprise-grade security.",
      icon: <Shield className="w-12 h-12" />,
      color: "from-green-600 to-emerald-700",
      features: ["Protected Transactions", "Instant Payments", "Secure Storage"]
    }
  ];

  const registerSlides: CarouselSlide[] = [
    {
      id: 1,
      title: "Join Our Community",
      description: "Connect with elite professionals and discover amazing opportunities worldwide.",
      icon: <Users className="w-12 h-12" />,
      color: "from-emerald-500 to-green-600",
      features: ["Verified Professionals", "Global Network", "Quality Guaranteed"]
    },
    {
      id: 2,
      title: "Start Your Journey",
      description: "Create your profile and showcase your expertise to potential clients.",
      icon: <Briefcase className="w-12 h-12" />,
      color: "from-green-500 to-emerald-600",
      features: ["Easy Setup", "Portfolio Builder", "Skill Matching"]
    },
    {
      id: 3,
      title: "Grow Your Business",
      description: "Access premium tools and features to scale your freelance career.",
      icon: <TrendingUp className="w-12 h-12" />,
      color: "from-teal-500 to-green-600",
      features: ["Analytics Dashboard", "Payment Protection", "Growth Tools"]
    },
    {
      id: 4,
      title: "Premium Support",
      description: "Get dedicated support and guidance to maximize your success.",
      icon: <Star className="w-12 h-12" />,
      color: "from-emerald-600 to-green-700",
      features: ["24/7 Support", "Success Coaching", "Priority Access"]
    }
  ];

  const slides = type === 'login' ? loginSlides : registerSlides;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Welcome Text Overlay */}
      <div className="absolute top-8 left-8 right-8 text-center z-20">
        <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 mb-4 border border-white/10">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-white/90 font-medium">FreelanceHub</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          {type === 'login' ? 'Welcome Back' : 'Join FreelanceHub'}
        </h1>
        <p className="text-white/70">
          {type === 'login' ? 'Sign in to your account' : 'Start your professional journey today'}
        </p>
      </div>

      {/* Slides */}
      <div className="relative h-full w-full pt-32">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 flex flex-col items-center justify-center p-6 md:p-8 transition-all duration-1000 ease-in-out ${
              index === currentSlide
                ? 'opacity-100 translate-x-0'
                : index < currentSlide
                ? 'opacity-0 -translate-x-full'
                : 'opacity-0 translate-x-full'
            }`}
          >
            {/* Icon */}
            <div className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br ${slide.color} flex items-center justify-center mb-6 md:mb-8 shadow-2xl transform hover:scale-105 transition-transform duration-300 border border-white/10`}>
              <div className="text-white">
                {slide.icon}
              </div>
            </div>

            {/* Content */}
            <div className="text-center max-w-md mx-auto">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 md:mb-6 leading-tight">
                {slide.title}
              </h2>
              <p className="text-sm md:text-base lg:text-lg text-white/80 mb-6 leading-relaxed">
                {slide.description}
              </p>

              {/* Features - Only show for register */}
              {type === 'register' && (
                <div className="space-y-3">
                  {slide.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center justify-center space-x-3 text-white/70">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      <span className="text-sm md:text-base font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/5 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-all duration-300 group border border-white/10 z-20"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/5 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-all duration-300 group border border-white/10 z-20"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 md:space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-emerald-400 scale-125'
                : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}; 
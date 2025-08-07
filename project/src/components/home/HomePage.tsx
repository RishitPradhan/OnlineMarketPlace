import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { serviceManagement } from '../../lib/service-management';
import { 
  ArrowRight,
  Star,
  Users,
  TrendingUp,
  Award,
  Globe,
  Zap,
  Shield,
  CheckCircle,
  Briefcase,
  Palette,
  Code,
  Camera,
  Music,
  PenTool,
  ChevronDown,
  X
} from 'lucide-react';
import { Button } from '../ui/Button';
import RotatingText from './RotatingText';
import CardSwap, { Card } from './CardSwap';

// Fullscreen transition overlay component
const FullScreenTransition = ({ show }: { show: boolean }) => (
  <div
    className={`fixed inset-0 z-50 bg-gradient-to-br from-green-500 to-blue-700 flex items-center justify-center transition-all duration-700
      ${show ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-110 pointer-events-none'}`}
    style={{ transitionProperty: 'opacity, transform' }}
  >
    <span className="text-5xl font-bold text-white drop-shadow-lg">Loading...</span>
  </div>
);

// Demo images from public folder - only using your provided images
const demoImages = [
  '/OIPbg.png',
  '/OIPfdf.png',
  '/OIPfef.png',
  '/OIPefe.png',
  '/OIPcdf.png',
  '/OIPnc.png',
  '/OIPb.png',
  '/OIPg.png',
  '/why-trust-slideuplift-presentation-design-services-6.png',
  '/OIPn.png',
  '/OIPf.png',
  '/OIPdf.png',
  '/OIPvg.png',
  '/OIPfg.png',
  '/wp9517064.png',
  '/representations_user_experience_interface_design_23_2150038900_74c059d2e1.png',
  '/OIP78.png',
  '/R.png',
  '/OIPuj.png',
  '/graphic-design.png',
  '/OIPj.png',
  '/Thumbnail-1.png',
  '/seo-techniques.png',
  '/Facility_Management_Software_fd01278999.png',
  '/OIPh.png',
  '/OIP34.png',
  '/OIPt.png',
  '/banner-content-writing.png',
  '/6.png',
  '/business-women-work-computers-write-notepad-with-pen-calculate-financial-statements-office_931309-4329.png',
  '/574-5741689_content-writing-services-png-transparent-png.png',
  '/OIP9.png',
  '/OIP.8png.png',
  '/OIP7.png',
  '/OIP6.png',
  '/OIP5.png',
  '/OIP4.png',
  '/OIP3.png',
  '/OIP2.png',
  '/7-Tips-to-Localize-and-Translate-Apps.png',
  '/Social-media-marketing-01-1024x536.png',
  '/social-media-engagement_839035-839915.png',
  '/datadriven-social-media-management-for-startups-ihh.png',
  '/featured_homepage.png',
  '/OIP1.png',
  '/pexels-francesco-paggiaro-2111015-scaled.png',
  '/wp4269240.png',
  '/InTheStudio.png',
  '/music-8589292_640.png',
  '/OIP.png',
  '/TharLU.png',
  '/Artboard-22.png'
];

// Function to get random demo image based on index for consistency
const getRandomDemoImage = (index: number) => {
  return demoImages[index % demoImages.length];
};

interface Plan {
  name: string;
  price: number;
  desc: string;
  features: string[];
  delivery: string;
}

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  const [showFirstText, setShowFirstText] = useState(false);
  const [showPageTransition, setShowPageTransition] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const whatWeDoRef = useRef<HTMLDivElement>(null);
  const transitionRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scroll = window.scrollY;
      setScrollY(scroll);
      
      // Determine active section based on scroll position
      const sections = [heroRef, whatWeDoRef, transitionRef, servicesRef, projectsRef, ctaRef];
      const windowHeight = window.innerHeight;
      
      sections.forEach((ref, index) => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          if (rect.top <= windowHeight * 0.5 && rect.bottom >= windowHeight * 0.5) {
            setActiveSection(index);
          }
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Trigger animations on mount
    setTimeout(() => setIsVisible(true), 100);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (scrollY > 600 && !showFirstText) {
      setTimeout(() => setShowFirstText(true), 400); // Delay text after image
    } else if (scrollY <= 600 && showFirstText) {
      setShowFirstText(false);
    }
  }, [scrollY]);

  // Fetch real service data
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        // Fetch popular services (limit to 4 for card swap)
        const popularResponse = await serviceManagement.listServices();
        if (popularResponse.success && popularResponse.data) {
          console.log('Popular services fetched:', popularResponse.data);
          setPopularServices(popularResponse.data.slice(0, 4));
        }
        
        // Fetch featured works (top services)
        const featuredResponse = await serviceManagement.listServices();
        if (featuredResponse.success && featuredResponse.data) {
          console.log('Featured works fetched:', featuredResponse.data);
          setFeaturedWorks(featuredResponse.data.slice(0, 4));
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Popular services will be fetched from the database
  const [popularServices, setPopularServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Category icons mapping
  const categoryIcons: { [key: string]: React.ReactNode } = {
    'web-development': <Code className="w-8 h-8" />,
    'design': <Palette className="w-8 h-8" />,
    'video-production': <Camera className="w-8 h-8" />,
    'audio-music': <Music className="w-8 h-8" />,
    'digital-art': <PenTool className="w-8 h-8" />,
    'business-consulting': <Briefcase className="w-8 h-8" />,
    'seo': <Globe className="w-8 h-8" />,
    'app-development': <Zap className="w-8 h-8" />,
    'cybersecurity': <Shield className="w-8 h-8" />,
    'branding': <Star className="w-8 h-8" />,
    'social-media': <TrendingUp className="w-8 h-8" />,
    'copywriting': <Award className="w-8 h-8" />,
  };

  // Default icon for unknown categories
  const getCategoryIcon = (category: string) => {
    return categoryIcons[category] || <Briefcase className="w-8 h-8" />;
  };

  // Featured works will be fetched from the database
  const [featuredWorks, setFeaturedWorks] = useState<any[]>([]);

  // Function to get lowest price from plans
  const getLowestPrice = (service: any) => {
    if (service.plans) {
      try {
        const plans: Plan[] = typeof service.plans === 'string' 
          ? JSON.parse(service.plans) 
          : service.plans;
        
        if (plans && plans.length > 0) {
          const prices = plans.map(plan => plan.price);
          return Math.min(...prices);
        }
      } catch (e) {
        console.error('Error parsing plans:', e);
      }
    }
    return service.price || 0;
  };

  // Helper function to handle navigation with auth check
  const handleServiceNavigation = (category: string) => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/browse-services', { 
        state: { 
          selectedCategory: category.toLowerCase().replace(' ', '-').replace('&', 'and') 
        } 
      });
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Particles background removed */}
      </div>
      <div className="relative min-h-screen bg-white dark:bg-black text-black dark:text-white overflow-x-hidden z-10">
      {/* Hero Section */}
      <section ref={heroRef} className="min-h-screen flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-white dark:from-black dark:to-gray-900"></div>
        <div className="absolute inset-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
          >
            <source src="/3130284-uhd_3840_2160_30fps.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        
        <div className="relative z-10 text-left px-6" style={{ marginLeft: '0', maxWidth: 'none', position: 'absolute', left: '20px' }}>
          <div className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-8xl lg:text-9xl font-bold mb-8 leading-none text-white">
              <span className={`block transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}> 
                Find the perfect
              </span>
              <span className={`block text-white transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}> 
                <RotatingText
                  texts={["freelancer", "service", "talent"]}
                  mainClassName="inline-block text-white"
                  elementLevelClassName="inline-block"
                  rotationInterval={2000}
                  splitBy="characters"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              </span>
            </h1>
            
            <p className={`text-xl lg:text-2xl text-white mb-12 max-w-2xl leading-relaxed transition-all duration-700 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Connect with skilled professionals and talented freelancers. Post projects, find services, and get work done with confidence on our trusted marketplace platform.
            </p>

            <div className={`flex flex-col sm:flex-row gap-6 justify-start items-start transition-all duration-700 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <button
                onClick={() => navigate('/login')}
                className="group relative px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-medium text-lg rounded-full overflow-hidden transition-all duration-300 hover:scale-102 hover:shadow-2xl"
              >
                <span className="relative z-10 transition-all duration-300 group-hover:translate-x-1">Let's Talk</span>
                <div className="absolute inset-0 bg-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </button>
              
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 border-2 border-black dark:border-white text-black dark:text-white font-medium text-lg rounded-full hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-300 hover:scale-102 hover:shadow-xl"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-1500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <ChevronDown className="w-6 h-6 text-gray-400 animate-bounce" />
        </div>
      </section>

      {/* What We Do Section */}
      <section ref={whatWeDoRef} className="py-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className={`text-6xl lg:text-7xl font-bold mb-8 transition-all duration-1000 ${scrollY > 300 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Our Marketplace
            </h2>
            {/* Updated description */}
            <p className={`text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${scrollY > 300 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              We connect clients with skilled freelancers through our comprehensive marketplace. Post projects, browse services, manage orders, and handle payments all in one secure platform designed for seamless collaboration.
            </p>
          </div>

          {/* Interactive Cards */}
          <div className="flex flex-col gap-16">
            {/* First image and text */}
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className={`group transition-all duration-1000 delay-300 ${scrollY > 400 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}> 
                <img
                  src="https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=800&q=80"
                  alt="Freelancers and clients connecting handshake"
                  className="w-80 h-64 object-cover rounded-2xl shadow-lg group-hover:scale-102 transition-transform duration-700"
                />
              </div>
              <div className={`flex-1 transition-all duration-1000 delay-400 ${scrollY > 400 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}> 
                <h3 className="text-3xl lg:text-4xl font-bold mb-2 text-green-700 dark:text-green-400">Post Projects & Browse Services</h3>
                <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  Clients can post detailed project requirements while freelancers showcase their services with portfolios, ratings, and pricing. Our matching system helps you find the perfect fit.
                </p>
              </div>
            </div>
            {/* Second image and text */}
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className={`group transition-all duration-1000 delay-800 ${scrollY > 800 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}> 
                <img
                  src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80"
                  alt="Project management and payments team collaboration"
                  className="w-80 h-64 object-cover rounded-2xl shadow-lg group-hover:scale-102 transition-transform duration-700"
                />
              </div>
              <div className={`flex-1 transition-all duration-1000 delay-1100 ${scrollY > 800 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}> 
                <h3 className="text-3xl lg:text-4xl font-bold mb-2 text-green-700 dark:text-green-400">Secure Orders & Payment Processing</h3>
                <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  Place orders with confidence using our secure payment system. Track project progress, communicate directly with freelancers, and release payments only when you're satisfied with the work.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider for clear separation */}
      <div className="h-12 md:h-24"></div>

      {/* Popular Services */}
      <section ref={servicesRef} className="py-32 px-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className={`text-6xl lg:text-7xl font-bold mb-8 transition-all duration-1000 ${scrollY > 1200 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Popular Categories
            </h2>
            <p className={`text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${scrollY > 1200 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Explore the most in-demand services from our verified freelancers across various professional categories
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left side - Text content */}
            <div className="flex-1 space-y-8">
              <div className={`transition-all duration-1000 delay-300 ${scrollY > 1200 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                <h3 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                  Verified Freelancers
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                  Every freelancer on our platform is verified and rated by previous clients. 
                  Browse portfolios, read reviews, and choose from thousands of skilled professionals ready to deliver quality work.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Quality Guaranteed</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Fast Delivery</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Secure Payments</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Card animation */}
            <div className="flex-1 flex justify-center items-end">
              <div className={`transition-all duration-1000 delay-500 mt-16 ${scrollY > 1200 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                {loading ? (
                  <div className="flex items-center justify-center w-full h-64">
                    <div className="text-gray-500 dark:text-gray-400">Loading services...</div>
                  </div>
                ) : popularServices.length > 0 ? (
                  <CardSwap width={450} height={380} cardDistance={50} verticalDistance={60} delay={3000} skewAmount={4}>
                    {popularServices.map((service, index) => (
                    <Card 
                      key={service.id || index} 
                      customClass="p-8 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 cursor-pointer"
                      onClick={() => handleServiceNavigation(service.category)}
                    >
                      <div className="mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-105 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                          {getCategoryIcon(service.category)}
                        </div>
                        <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                          {service.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                          {service.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-medium text-sm">4.8</span>
                          <span className="text-gray-500 text-xs">(12 reviews)</span>
                        </div>
                        <span className="font-bold text-green-600 dark:text-green-400 text-lg">
                          ₹{getLowestPrice(service)}
                        </span>
                      </div>
                    </Card>
                  ))}
                </CardSwap>
                ) : (
                  <div className="flex items-center justify-center w-full h-64">
                    <div className="text-gray-500 dark:text-gray-400 flex flex-col items-center gap-4">
                      <div className="text-lg font-medium">No services available</div>
                      <div className="text-sm">Check back later for new services</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section ref={projectsRef} className="py-32 px-6 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className={`text-6xl lg:text-7xl font-bold mb-8 transition-all duration-1000 ${scrollY > 2000 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Top Services
            </h2>
            <p className={`text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${scrollY > 2000 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Browse our highest-rated services from top-performing freelancers with proven track records
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {loading ? (
              <div className="col-span-2 flex items-center justify-center py-20">
                <div className="text-gray-500 dark:text-gray-400">Loading featured services...</div>
              </div>
            ) : featuredWorks.length > 0 ? (
              featuredWorks.map((work, index) => (
              <div key={work.id || index} className={`group transition-all duration-1000 ${scrollY > 1600 + (index * 100) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${index * 100}ms` }}>
                <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                  <div className="relative overflow-hidden rounded-t-3xl">
                    <img
                      src={work.imageUrl || work.images?.[0] || getRandomDemoImage(index)}
                      alt={work.title}
                      className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        console.log('Image failed to load:', e.currentTarget.src);
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = getRandomDemoImage(index);
                      }}
                      onLoad={() => {
                        console.log('Image loaded successfully:', work.title);
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute top-4 left-4">
                      <span className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-full shadow-lg">
                        {work.category}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center space-x-1 bg-white/90 dark:bg-gray-800/90 px-3 py-1 rounded-full">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-medium text-sm">4.8</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                      {work.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed text-sm">
                      {work.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">(12 reviews)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-green-600 dark:text-green-400 font-medium">Featured</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-bold text-green-600 dark:text-green-400">
                          ₹{getLowestPrice(work)}
                        </span>
                        <div className="text-xs text-gray-500">Starting Price</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <button 
                        onClick={() => handleServiceNavigation(work.category)}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-medium py-2 px-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:shadow-lg transform hover:scale-102 text-sm"
                      >
                        View Service Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
            ) : (
              <div className="col-span-2 flex items-center justify-center py-20">
                <div className="text-gray-500 dark:text-gray-400 flex flex-col items-center gap-4">
                  <div className="text-lg font-medium">No featured services available</div>
                  <div className="text-sm">Check back later for featured services</div>
                </div>
              </div>
            )}
          </div>

          <div className={`text-center mt-16 transition-all duration-1000 delay-400 ${scrollY > 1800 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <button 
              onClick={() => user ? navigate('/browse-services') : navigate('/login')}
              className="group relative px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-medium text-lg rounded-full overflow-hidden transition-all duration-300 hover:scale-102 hover:shadow-2xl"
            >
              <span className="relative z-10 transition-all duration-300 group-hover:translate-x-1">Browse All Services</span>
              <div className="absolute inset-0 bg-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-6xl lg:text-7xl font-bold mb-8 transition-all duration-1000 ${scrollY > 2200 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Ready to get started?
          </h2>
          <p className={`text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto transition-all duration-1000 delay-200 ${scrollY > 2200 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Join thousands of clients and freelancers who trust our marketplace for their projects and services.
          </p>
          
          <button
            onClick={() => navigate('/login')}
            className={`group relative px-12 py-6 bg-black dark:bg-white text-white dark:text-black font-bold text-xl rounded-full overflow-hidden transition-all duration-500 hover:scale-102 hover:shadow-2xl ${scrollY > 2200 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: '400ms' }}
          >
            <span className="relative z-10 transition-all duration-300 group-hover:translate-x-2">Let's Talk</span>
            <div className="absolute inset-0 bg-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
          </button>
        </div>
      </section>


      <FullScreenTransition show={showPageTransition} />
    </div>
    </>
  );
}; 
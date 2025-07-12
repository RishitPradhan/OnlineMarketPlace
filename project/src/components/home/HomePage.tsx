import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [showServicesModal, setShowServicesModal] = useState(false);
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

  const popularServices = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Web Development",
      description: "Modern, responsive websites built with cutting-edge technologies",
      price: "From ₹50",
      rating: 4.9,
      reviews: 1247
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Graphic Design",
      description: "Creative visual solutions that make your brand stand out",
      price: "From ₹25",
      rating: 4.8,
      reviews: 2156
    },
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Video Production",
      description: "Professional video content that tells your story",
      price: "From ₹100",
      rating: 4.9,
      reviews: 892
    },
    {
      icon: <Music className="w-8 h-8" />,
      title: "Audio & Music",
      description: "High-quality audio production and sound design",
      price: "From ₹30",
      rating: 4.7,
      reviews: 1567
    },
    {
      icon: <PenTool className="w-8 h-8" />,
      title: "Digital Art",
      description: "Stunning illustrations and digital artwork",
      price: "From ₹40",
      rating: 4.8,
      reviews: 1345
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "Business Consulting",
      description: "Strategic guidance to grow your business",
      price: "From ₹75",
      rating: 4.9,
      reviews: 678
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "SEO Optimization",
      description: "Boost your website's ranking and visibility on search engines",
      price: "From ₹60",
      rating: 4.8,
      reviews: 980
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "App Prototyping",
      description: "Interactive prototypes to bring your app ideas to life",
      price: "From ₹120",
      rating: 4.9,
      reviews: 410
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Cybersecurity Audit",
      description: "Comprehensive security checks for your digital assets",
      price: "From ₹200",
      rating: 5.0,
      reviews: 150
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Brand Strategy",
      description: "Craft a unique brand identity and market positioning",
      price: "From ₹90",
      rating: 4.7,
      reviews: 320
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Social Media Marketing",
      description: "Grow your audience and engagement across platforms",
      price: "From ₹35",
      rating: 4.6,
      reviews: 1120
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Copywriting",
      description: "Persuasive and creative copy for ads, blogs, and websites",
      price: "From ₹20",
      rating: 4.9,
      reviews: 2100
    },
  ];

  const featuredWorks = [
    {
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
      title: "E-commerce Platform",
      category: "Web Development",
      price: "₹2,500",
      rating: 5.0,
      reviews: 89
    },
    {
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
      title: "Brand Identity",
      category: "Graphic Design",
      price: "₹800",
      rating: 4.9,
      reviews: 156
    },
    {
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
      title: "Product Launch",
      category: "Video Production",
      price: "₹1,200",
      rating: 5.0,
      reviews: 234
    },
    {
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
      title: "Mobile App",
      category: "App Development",
      price: "₹5,000",
      rating: 4.8,
      reviews: 67
    }
  ];

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
                make it
              </span>
              <span className={`block text-white transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}> 
                <RotatingText
                  texts={["creative", "bold", "modern"]}
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
              I'm FreelanceHub, a platform that connects elite talent with visionary projects. 
              Let's create something extraordinary together.
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
              What we do
            </h2>
            {/* Updated description */}
            <p className={`text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${scrollY > 300 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              We empower businesses and freelancers to connect, collaborate, and succeed. Our platform bridges the gap between clients and top talent, while providing seamless tools for project management, communication, and secure payments.
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
                <h3 className="text-3xl lg:text-4xl font-bold mb-2 text-green-700 dark:text-green-400">Connects Freelancers and Clients</h3>
                <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  It allows clients to post projects or gigs and freelancers to offer services, enabling both parties to find suitable work or talent.
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
                <h3 className="text-3xl lg:text-4xl font-bold mb-2 text-green-700 dark:text-green-400">Facilitates Project Management and Payments</h3>
                <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  It provides tools for messaging, tracking work progress, handling payments, and reviewing completed jobs, ensuring a smooth workflow from start to finish.
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
              Our Services
            </h2>
            <p className={`text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${scrollY > 1200 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Discover our comprehensive range of professional services designed to elevate your business
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left side - Text content */}
            <div className="flex-1 space-y-8">
              <div className={`transition-all duration-1000 delay-300 ${scrollY > 1200 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                <h3 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                  Professional Excellence
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                  We connect you with top-tier freelancers who deliver exceptional results. 
                  From web development to creative design, our platform ensures quality and reliability.
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
                <CardSwap width={450} height={380} cardDistance={50} verticalDistance={60} delay={3000} skewAmount={4}>
                  {popularServices.slice(0, 4).map((service, index) => (
                    <Card key={index} customClass="p-8 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                      <div className="mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-105 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                          {service.icon}
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
                          <span className="font-medium text-sm">{service.rating}</span>
                          <span className="text-gray-500 text-xs">({service.reviews})</span>
                        </div>
                        <span className="font-bold text-green-600 dark:text-green-400 text-lg">
                          {service.price}
                        </span>
                      </div>
                    </Card>
                  ))}
                </CardSwap>
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
              Featured Work
            </h2>
            <p className={`text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${scrollY > 2000 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Discover exceptional projects that showcase the talent and creativity of our community
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {featuredWorks.map((work, index) => (
              <div key={index} className={`group transition-all duration-1000 ${scrollY > 1600 + (index * 100) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${index * 100}ms` }}>
                <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                  <div className="relative overflow-hidden rounded-t-3xl">
                    <img
                      src={work.image}
                      alt={work.title}
                      className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-700"
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
                        <span className="font-medium text-sm">{work.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                      {work.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed text-sm">
                      Exceptional work delivered with precision and creativity. This project demonstrates the high quality and professional standards our freelancers maintain.
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">({work.reviews} reviews)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-green-600 dark:text-green-400 font-medium">Featured</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-bold text-green-600 dark:text-green-400">
                          {work.price}
                        </span>
                        <div className="text-xs text-gray-500">Starting Price</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-medium py-2 px-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:shadow-lg transform hover:scale-102 text-sm">
                        View Project Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={`text-center mt-16 transition-all duration-1000 delay-400 ${scrollY > 1800 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <button className="group relative px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-medium text-lg rounded-full overflow-hidden transition-all duration-300 hover:scale-102 hover:shadow-2xl">
              <span className="relative z-10 transition-all duration-300 group-hover:translate-x-1">Explore More Projects</span>
              <div className="absolute inset-0 bg-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-6xl lg:text-7xl font-bold mb-8 transition-all duration-1000 ${scrollY > 2200 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Get in touch
          </h2>
          <p className={`text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto transition-all duration-1000 delay-200 ${scrollY > 2200 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Ready to start your next project? Let's create something amazing together.
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

      {showServicesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-2xl max-w-3xl w-full p-8 relative animate-fade-in-up">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-green-600 text-2xl"
              onClick={() => setShowServicesModal(false)}
              aria-label="Close"
            >
              <X className="w-7 h-7" />
            </button>
            <h2 className="text-3xl font-bold mb-8 text-center text-green-700 dark:text-green-400">Browse Services</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {popularServices.map((service, index) => (
                <div
                  key={index}
                  className="group p-6 border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-green-500 dark:hover:border-green-400 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-white dark:bg-dark-800"
                  onClick={() => {
                    setShowPageTransition(true);
                    setTimeout(() => {
                      navigate('/featured-project');
                    }, 700); // Match duration to overlay animation
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="mb-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400 mb-2 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">{service.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-medium text-sm">{service.rating}</span>
                      <span className="text-gray-500 text-xs">({service.reviews})</span>
                    </div>
                    <span className="font-bold text-green-600 dark:text-green-400 text-sm">
                      {service.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <FullScreenTransition show={showPageTransition} />
    </div>
    </>
  );
}; 
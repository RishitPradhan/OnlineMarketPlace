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

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [showServicesModal, setShowServicesModal] = useState(false);

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
                className="group relative px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-medium text-lg rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <span className="relative z-10 transition-all duration-300 group-hover:translate-x-1">Let's Talk</span>
                <div className="absolute inset-0 bg-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </button>
              
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 border-2 border-black dark:border-white text-black dark:text-white font-medium text-lg rounded-full hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-300 hover:scale-105 hover:shadow-xl"
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
      <section ref={whatWeDoRef} className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className={`text-6xl lg:text-7xl font-bold mb-8 transition-all duration-1000 ${scrollY > 500 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              What we do
            </h2>
            <p className={`text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${scrollY > 500 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              We create memorable experiences with smooth animations and interactive elements that keep users engaged.
            </p>
          </div>

          {/* Interactive Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className={`group transition-all duration-1000 delay-300 ${scrollY > 600 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                <h3 className="text-3xl font-bold mb-4">3D card hover effect</h3>
                <div className="w-full h-64 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-2xl transform group-hover:rotate-y-12 group-hover:scale-105 transition-all duration-700 shadow-lg hover:shadow-2xl"></div>
              </div>
              
              <div className={`group transition-all duration-1000 delay-500 ${scrollY > 600 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                <h3 className="text-3xl font-bold mb-4">Image hover parallax</h3>
                <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-2xl transform group-hover:translate-x-4 group-hover:scale-105 transition-all duration-700 shadow-lg hover:shadow-2xl"></div>
              </div>
            </div>

            <div className="space-y-8">
              <p className={`text-lg text-gray-600 dark:text-gray-300 leading-relaxed transition-all duration-1000 delay-400 ${scrollY > 600 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                There are many more eye-catching techniques that make your website stand out from the crowd.
              </p>
              
              <div className="space-y-4">
                <div className={`flex items-center space-x-4 transition-all duration-1000 delay-600 ${scrollY > 600 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">🐌</span>
                  </div>
                  <span className="text-xl font-medium">slow</span>
                </div>
                
                <div className={`flex items-center space-x-4 transition-all duration-1000 delay-700 ${scrollY > 600 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <span className="text-xl font-medium">speedy</span>
                </div>
              </div>
              
              <p className={`text-lg text-gray-600 dark:text-gray-300 leading-relaxed transition-all duration-1000 delay-800 ${scrollY > 600 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                Parallax scrolling is a trending web design technique to add depth and visual interest. 
                It creates a dynamic experience that keeps users engaged.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Full Screen Transition */}
      <section ref={transitionRef} className="py-32 px-6 bg-black dark:bg-white text-white dark:text-black relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-r from-green-600/20 to-blue-600/20 transition-all duration-1000 ${scrollY > 1200 ? 'opacity-100' : 'opacity-0'}`}></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h2 className={`text-6xl lg:text-7xl font-bold mb-8 transition-all duration-1000 ${scrollY > 1200 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Full screen transition
          </h2>
          <p className={`text-xl lg:text-2xl text-gray-300 dark:text-gray-600 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${scrollY > 1200 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Smooth transitions between sections create a seamless user experience.
          </p>
        </div>
      </section>

      {/* Popular Services */}
      <section ref={servicesRef} className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className={`text-6xl lg:text-7xl font-bold mb-8 transition-all duration-1000 ${scrollY > 1800 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Services
            </h2>
            <p className={`text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${scrollY > 1800 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              We offer a range of services focused on creative solutions—whether it's brand building or digital innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularServices.map((service, index) => (
              <div
                key={index}
                className={`group p-8 border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-green-500 dark:hover:border-green-400 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${scrollY > 2000 + (index * 100) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="mb-6">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400 mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">{service.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {service.description}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{service.rating}</span>
                    <span className="text-gray-500">({service.reviews})</span>
                  </div>
                  <span className="font-bold text-green-600 dark:text-green-400">
                    {service.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section ref={projectsRef} className="py-32 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className={`text-6xl lg:text-7xl font-bold mb-8 transition-all duration-1000 ${scrollY > 2800 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Projects
            </h2>
            <p className={`text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${scrollY > 2800 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Showcase of exceptional work completed by our top freelancers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {featuredWorks.map((work, index) => (
              <div key={index} className={`group transition-all duration-1000 ${scrollY > 3000 + (index * 200) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${index * 200}ms` }}>
                <div className="relative overflow-hidden rounded-2xl mb-6">
                  <img
                    src={work.image}
                    alt={work.title}
                    className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                    {work.category}
                  </div>
                  <h3 className="text-2xl font-bold group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">{work.title}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{work.rating}</span>
                      <span className="text-gray-500">({work.reviews})</span>
                    </div>
                    <span className="font-bold text-green-600 dark:text-green-400">
                      {work.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-6xl lg:text-7xl font-bold mb-8 transition-all duration-1000 ${scrollY > 3800 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Get in touch
          </h2>
          <p className={`text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto transition-all duration-1000 delay-200 ${scrollY > 3800 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Ready to start your next project? Let's create something amazing together.
          </p>
          
          <button
            onClick={() => navigate('/login')}
            className={`group relative px-12 py-6 bg-black dark:bg-white text-white dark:text-black font-bold text-xl rounded-full overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl ${scrollY > 3800 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
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
                  onClick={() => navigate('/featured-project')}
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
    </div>
    </>
  );
}; 
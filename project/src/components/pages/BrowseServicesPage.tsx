import React from 'react';
import { useNavigate } from 'react-router-dom';

const serviceCategories = [
  { 
    title: 'Web Development', 
    icon: '💻', 
    gradient: 'from-blue-500 to-blue-600', 
    bgGradient: 'from-blue-500/20 to-blue-600/20',
    description: 'Websites, web apps, and landing pages.'
  },
  { 
    title: 'Mobile App Development', 
    icon: '📱', 
    gradient: 'from-green-500 to-green-600', 
    bgGradient: 'from-green-500/20 to-green-600/20',
    description: 'iOS, Android, and cross-platform apps.'
  },
  { 
    title: 'Graphic Design', 
    icon: '🎨', 
    gradient: 'from-pink-500 to-pink-600', 
    bgGradient: 'from-pink-500/20 to-pink-600/20',
    description: 'Logos, branding, and digital art.'
  },
  { 
    title: 'Content Writing', 
    icon: '✍️', 
    gradient: 'from-yellow-500 to-yellow-600', 
    bgGradient: 'from-yellow-500/20 to-yellow-600/20',
    description: 'Blogs, articles, and copywriting.'
  },
  { 
    title: 'Digital Marketing', 
    icon: '📈', 
    gradient: 'from-purple-500 to-purple-600', 
    bgGradient: 'from-purple-500/20 to-purple-600/20',
    description: 'SEO, social media, and ads.'
  },
  { 
    title: 'Video Production', 
    icon: '🎬', 
    gradient: 'from-red-500 to-red-600', 
    bgGradient: 'from-red-500/20 to-red-600/20',
    description: 'Editing, animation, and promo videos.'
  },
  { 
    title: 'SEO', 
    icon: '🔍', 
    gradient: 'from-teal-500 to-teal-600', 
    bgGradient: 'from-teal-500/20 to-teal-600/20',
    description: 'Search engine optimization services.'
  },
  { 
    title: 'UI/UX Design', 
    icon: '🖌️', 
    gradient: 'from-indigo-500 to-indigo-600', 
    bgGradient: 'from-indigo-500/20 to-indigo-600/20',
    description: 'User interface and experience design.'
  },
  { 
    title: 'Voice Over', 
    icon: '🎤', 
    gradient: 'from-orange-500 to-orange-600', 
    bgGradient: 'from-orange-500/20 to-orange-600/20',
    description: 'Voice acting for ads, videos, and more.'
  },
  { 
    title: 'Translation', 
    icon: '🌐', 
    gradient: 'from-cyan-500 to-cyan-600', 
    bgGradient: 'from-cyan-500/20 to-cyan-600/20',
    description: 'Translate documents and websites.'
  },
  { 
    title: 'Business Consulting', 
    icon: '💼', 
    gradient: 'from-gray-600 to-gray-700', 
    bgGradient: 'from-gray-600/20 to-gray-700/20',
    description: 'Strategy, planning, and advice.'
  },
  { 
    title: 'Social Media Management', 
    icon: '📲', 
    gradient: 'from-blue-400 to-blue-500', 
    bgGradient: 'from-blue-400/20 to-blue-500/20',
    description: 'Grow and manage your social presence.'
  },
  { 
    title: 'E-Commerce Development', 
    icon: '🛒', 
    gradient: 'from-green-600 to-green-700', 
    bgGradient: 'from-green-600/20 to-green-700/20',
    description: 'Online stores and shopping carts.'
  },
  { 
    title: 'Data Analysis', 
    icon: '📊', 
    gradient: 'from-purple-600 to-purple-700', 
    bgGradient: 'from-purple-600/20 to-purple-700/20',
    description: 'Data visualization and analytics.'
  },
  { 
    title: 'Game Development', 
    icon: '🎮', 
    gradient: 'from-pink-600 to-pink-700', 
    bgGradient: 'from-pink-600/20 to-pink-700/20',
    description: '2D, 3D, and mobile games.'
  },
  { 
    title: 'Music & Audio', 
    icon: '🎵', 
    gradient: 'from-yellow-600 to-yellow-700', 
    bgGradient: 'from-yellow-600/20 to-yellow-700/20',
    description: 'Music production, mixing, and jingles.'
  },
  { 
    title: 'Presentation Design', 
    icon: '📑', 
    gradient: 'from-blue-600 to-blue-700', 
    bgGradient: 'from-blue-600/20 to-blue-700/20',
    description: 'Slides for business or school.'
  },
  { 
    title: 'Legal Consulting', 
    icon: '⚖️', 
    gradient: 'from-gray-500 to-gray-600', 
    bgGradient: 'from-gray-500/20 to-gray-600/20',
    description: 'Contracts, advice, and legal docs.'
  },
  { 
    title: 'Virtual Assistant', 
    icon: '🧑‍💼', 
    gradient: 'from-green-400 to-green-500', 
    bgGradient: 'from-green-400/20 to-green-500/20',
    description: 'Admin, scheduling, and support.'
  },
  { 
    title: 'Branding', 
    icon: '🏷️', 
    gradient: 'from-pink-400 to-pink-500', 
    bgGradient: 'from-pink-400/20 to-pink-500/20',
    description: 'Brand strategy and identity.'
  },
];

const BrowseServicesPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 to-dark-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Browse Services
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Find the perfect service for your project. Click a category to see top freelancers!
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {serviceCategories.map((cat, index) => (
            <button
              key={cat.title}
              onClick={() => navigate('/service', { state: { service: { title: cat.title, category: cat.title } } })}
              className="group relative overflow-hidden bg-gradient-to-br from-white/95 to-white/90 dark:from-dark-800/95 dark:to-dark-900/90 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 border border-white/20 dark:border-dark-700/50 focus:outline-none focus:ring-4 focus:ring-green-400/30 backdrop-blur-sm"
              style={{ 
                minHeight: 280,
                animationDelay: `${index * 100}ms`
              }}
            >
              {/* Background gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              {/* Floating particles effect */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-green-400/20 to-green-600/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full blur-lg group-hover:scale-125 transition-transform duration-700 delay-100"></div>
              </div>

              <div className="relative flex flex-col items-center h-full w-full p-8">
                {/* Icon with enhanced styling */}
                <div className={`relative w-20 h-20 rounded-2xl flex items-center justify-center text-5xl mb-6 shadow-2xl bg-gradient-to-br ${cat.gradient} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 transform`}>
                  <div className="absolute inset-0 bg-white/20 rounded-2xl blur-sm"></div>
                  <div className="relative z-10 drop-shadow-lg">{cat.icon}</div>
                </div>

                {/* Title with gradient text */}
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 text-center group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-green-500 group-hover:to-blue-500 transition-all duration-300">
                  {cat.title}
                </h2>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 text-center mb-6 text-sm leading-relaxed min-h-[48px] group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
                  {cat.description}
                </p>

                {/* Enhanced CTA button */}
                <div className="mt-auto w-full">
                  <div className="relative overflow-hidden rounded-xl">
                    {/* Button background with gradient matching card theme */}
                    <span className={`block w-full px-6 py-3 bg-gradient-to-r ${cat.gradient} hover:brightness-110 text-white font-semibold shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300 text-sm tracking-wide relative z-10`}>
                      View Freelancers
                    </span>
                    
                    {/* Shine effect for button */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    
                    {/* Floating particles around button matching card colors */}
                    <div className={`absolute -top-1 -right-1 w-3 h-3 bg-white/30 rounded-full blur-sm group-hover:scale-150 transition-transform duration-500`}></div>
                    <div className={`absolute -bottom-1 -left-1 w-2 h-2 bg-white/20 rounded-full blur-sm group-hover:scale-125 transition-transform duration-500 delay-100`}></div>
                  </div>
                </div>

                {/* Arrow indicator */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrowseServicesPage; 
import React from 'react';
import { useNavigate } from 'react-router-dom';

const serviceCategories = [
  { title: 'Web Development', icon: '💻', color: 'bg-blue-500', description: 'Websites, web apps, and landing pages.' },
  { title: 'Mobile App Development', icon: '📱', color: 'bg-green-500', description: 'iOS, Android, and cross-platform apps.' },
  { title: 'Graphic Design', icon: '🎨', color: 'bg-pink-500', description: 'Logos, branding, and digital art.' },
  { title: 'Content Writing', icon: '✍️', color: 'bg-yellow-500', description: 'Blogs, articles, and copywriting.' },
  { title: 'Digital Marketing', icon: '📈', color: 'bg-purple-500', description: 'SEO, social media, and ads.' },
  { title: 'Video Production', icon: '🎬', color: 'bg-red-500', description: 'Editing, animation, and promo videos.' },
  { title: 'SEO', icon: '🔍', color: 'bg-teal-500', description: 'Search engine optimization services.' },
  { title: 'UI/UX Design', icon: '🖌️', color: 'bg-indigo-500', description: 'User interface and experience design.' },
  { title: 'Voice Over', icon: '🎤', color: 'bg-orange-500', description: 'Voice acting for ads, videos, and more.' },
  { title: 'Translation', icon: '🌐', color: 'bg-cyan-500', description: 'Translate documents and websites.' },
  { title: 'Business Consulting', icon: '💼', color: 'bg-gray-700', description: 'Strategy, planning, and advice.' },
  { title: 'Social Media Management', icon: '📲', color: 'bg-blue-400', description: 'Grow and manage your social presence.' },
  { title: 'E-Commerce Development', icon: '🛒', color: 'bg-green-600', description: 'Online stores and shopping carts.' },
  { title: 'Data Analysis', icon: '📊', color: 'bg-purple-600', description: 'Data visualization and analytics.' },
  { title: 'Game Development', icon: '🎮', color: 'bg-pink-600', description: '2D, 3D, and mobile games.' },
  { title: 'Music & Audio', icon: '🎵', color: 'bg-yellow-600', description: 'Music production, mixing, and jingles.' },
  { title: 'Presentation Design', icon: '📑', color: 'bg-blue-600', description: 'Slides for business or school.' },
  { title: 'Legal Consulting', icon: '⚖️', color: 'bg-gray-600', description: 'Contracts, advice, and legal docs.' },
  { title: 'Virtual Assistant', icon: '🧑‍💼', color: 'bg-green-400', description: 'Admin, scheduling, and support.' },
  { title: 'Branding', icon: '🏷️', color: 'bg-pink-400', description: 'Brand strategy and identity.' },
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
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {serviceCategories.map((cat) => (
            <button
              key={cat.title}
              onClick={() => navigate('/service', { state: { service: { title: cat.title, category: cat.title } } })}
              className="group relative bg-white/90 dark:bg-dark-900 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-green-100/10 focus:outline-none focus:ring-2 focus:ring-green-400/60 p-0.5"
              style={{ minHeight: 240 }}
            >
              <div className="flex flex-col items-center h-full w-full rounded-2xl p-7">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-4xl mb-5 shadow-lg ${cat.color} bg-opacity-90 group-hover:scale-110 transition-all`}>
                  {cat.icon}
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center group-hover:text-green-500 transition-all">{cat.title}</h2>
                <p className="text-gray-500 dark:text-gray-300 text-center mb-4 text-base min-h-[44px]">{cat.description}</p>
                <span className="mt-auto inline-block px-5 py-2 bg-green-600 text-white rounded-lg font-semibold shadow group-hover:bg-green-700 group-hover:scale-105 transition-all text-base tracking-wide">
                  View Freelancers
                </span>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrowseServicesPage; 
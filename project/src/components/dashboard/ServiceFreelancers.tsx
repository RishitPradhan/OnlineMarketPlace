import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Star, ArrowLeft } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface Freelancer {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  price: number;
  tagline: string;
  workThumb: string;
  projectCount: number;
  skills: string[];
  location: string;
  responseTime: string;
  completionRate: number;
}

export const ServiceFreelancers: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { service } = (location.state || {}) as any;

  // Use a single default thumbnail for all freelancers
  const gigBannerUrl = '/gigbanner.webp';

  // Use a set of actual, static Unsplash portrait images for avatars (50+ unique)
  const staticAvatars = [
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=150&h=150&q=80',
    'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=150&h=150&q=80',
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=facearea&w=150&h=150&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=150&h=150&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=facearea&w=150&h=150&q=80',
    // ... add 45+ more unique Unsplash portrait URLs ...
  ];

  // Shuffle helper
  function shuffleArray<T>(array: T[]): T[] {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Shuffle avatars and thumbnails for each render
  const shuffledAvatars = shuffleArray(staticAvatars);

  // Themed SVG fallback for any image error
  const fallbackThumb =
    "data:image/svg+xml,%3Csvg width='400' height='240' xmlns='http://www.w3.org/2000/svg'%3E%3Crect fill='%2310b981' width='400' height='240'/%3E%3Ctext x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='32'%3EGig%3C/text%3E%3C/svg%3E";

  // Service-specific freelancer data
  const getServiceSpecificFreelancers = (serviceType: string): Freelancer[] => {
    const serviceData = {
      'Web Development': {
        names: ['Alex Chen', 'Sarah Rodriguez', 'Marcus Johnson', 'Emma Thompson', 'David Kim', 'Lisa Wang', 'James Wilson', 'Maria Garcia', 'Robert Lee', 'Anna Smith', 'Michael Brown', 'Jennifer Davis', 'Christopher Miller', 'Amanda Taylor', 'Daniel Anderson', 'Rachel White'],
        taglines: [
          'Full-stack developer specializing in modern web applications',
          'React expert with 5+ years building scalable frontends',
          'Node.js backend specialist with AWS experience',
          'Vue.js developer creating beautiful user interfaces',
          'Python Django developer for robust web solutions',
          'Angular specialist with enterprise experience',
          'PHP Laravel developer for custom web applications',
          'WordPress expert with custom theme development',
          'MERN stack developer for modern web apps',
          'Ruby on Rails developer for rapid prototyping',
          'ASP.NET Core developer for enterprise solutions',
          'Flutter web developer for cross-platform apps',
          'GraphQL specialist with Apollo experience',
          'Microservices architect with Docker expertise',
          'Progressive Web App developer',
          'E-commerce specialist with Shopify/Stripe'
        ],
        skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'GraphQL', 'Vue.js', 'Angular', 'Python', 'PHP', 'Ruby', 'Flutter', 'Next.js', 'Laravel'],
        priceRange: { min: 500, max: 5000 }
      },
      'Graphic Design': {
        names: ['Sophie Anderson', 'Carlos Mendez', 'Isabella Park', 'Lucas Thompson', 'Ava Rodriguez', 'Ethan Chen', 'Mia Johnson', 'Noah Williams', 'Zoe Davis', 'Liam Brown', 'Chloe Wilson', 'Mason Taylor', 'Harper Garcia', 'Evelyn Martinez', 'Sebastian Lee', 'Victoria Kim'],
        taglines: [
          'Creative designer specializing in brand identity',
          'UI/UX designer with mobile app expertise',
          'Logo designer creating memorable brand marks',
          'Print designer for marketing materials',
          'Digital illustrator with unique artistic style',
          'Packaging designer for product presentation',
          'Social media graphics specialist',
          'Typography expert with custom font design',
          'Infographic designer for data visualization',
          'Web designer with modern aesthetic',
          'Poster designer for events and promotions',
          'Icon designer for app interfaces',
          'Brochure designer for business materials',
          'T-shirt designer with trendy graphics',
          'Business card designer with elegant layouts',
          'Banner designer for digital advertising'
        ],
        skills: ['Adobe Illustrator', 'Photoshop', 'InDesign', 'Figma', 'Sketch', 'Canva', 'Typography', 'Color Theory', 'Branding', 'Logo Design', 'UI/UX', 'Print Design', 'Digital Art', 'Vector Graphics', 'Layout Design', 'Icon Design'],
        priceRange: { min: 300, max: 3000 }
      },
      'Digital Marketing': {
        names: ['Ryan Mitchell', 'Jessica Torres', 'Brandon Lewis', 'Nicole Adams', 'Kevin Patel', 'Amber Foster', 'Tyler Green', 'Hannah Baker', 'Jordan Cooper', 'Lauren Phillips', 'Austin Campbell', 'Kayla Evans', 'Cameron Collins', 'Morgan Stewart', 'Reese Morris', 'Casey Rogers'],
        taglines: [
          'SEO specialist driving organic traffic growth',
          'Social media strategist for brand engagement',
          'PPC expert optimizing ad campaigns',
          'Content marketing specialist with storytelling',
          'Email marketing strategist for conversions',
          'Influencer marketing coordinator',
          'Analytics expert with data-driven insights',
          'Conversion rate optimization specialist',
          'Local SEO expert for small businesses',
          'Facebook ads specialist for lead generation',
          'Google Ads expert with ROI focus',
          'Content creator for social media',
          'Marketing automation specialist',
          'Brand strategist with market research',
          'Video marketing specialist',
          'Affiliate marketing coordinator'
        ],
        skills: ['SEO', 'Google Ads', 'Facebook Ads', 'Email Marketing', 'Social Media', 'Content Marketing', 'Analytics', 'CRO', 'Marketing Automation', 'Brand Strategy', 'Video Marketing', 'Influencer Marketing', 'Local SEO', 'PPC', 'Market Research', 'Lead Generation'],
        priceRange: { min: 400, max: 3500 }
      },
      'Content Writing': {
        names: ['Olivia Bennett', 'Nathan Rivera', 'Grace Coleman', 'Isaac Reed', 'Scarlett Ward', 'Leo Cox', 'Luna Richardson', 'Felix Howard', 'Stella Ward', 'Miles Peterson', 'Nova Bailey', 'Atlas Cooper', 'Iris Richardson', 'Phoenix Morgan', 'Sage Coleman', 'River Bennett'],
        taglines: [
          'Copywriter specializing in conversion-focused content',
          'Blog writer with SEO optimization expertise',
          'Technical writer for complex documentation',
          'Creative writer for engaging storytelling',
          'Business writer for professional content',
          'Product description specialist',
          'Email copywriter for sales sequences',
          'Social media content creator',
          'Whitepaper writer for thought leadership',
          'Press release specialist',
          'Script writer for video content',
          'Case study writer for social proof',
          'Landing page copywriter',
          'Newsletter writer for engagement',
          'Ghostwriter for books and articles',
          'Academic writer with research expertise'
        ],
        skills: ['Copywriting', 'SEO Writing', 'Blog Writing', 'Technical Writing', 'Creative Writing', 'Email Copy', 'Social Media', 'Content Strategy', 'Editing', 'Proofreading', 'Research', 'Storytelling', 'Brand Voice', 'Conversion Copy', 'Ghostwriting', 'Academic Writing'],
        priceRange: { min: 200, max: 2000 }
      },
      'Video Editing': {
        names: ['Xavier Rodriguez', 'Sofia Martinez', 'Diego Hernandez', 'Valentina Lopez', 'Mateo Gonzalez', 'Camila Perez', 'Adrian Torres', 'Isabella Morales', 'Gabriel Silva', 'Lucia Vargas', 'Rafael Castro', 'Elena Ruiz', 'Javier Mendoza', 'Carmen Ortega', 'Fernando Herrera', 'Rosa Jimenez'],
        taglines: [
          'Video editor specializing in cinematic storytelling',
          'YouTube content editor with viral potential',
          'Commercial video editor for brand campaigns',
          'Wedding video editor with emotional storytelling',
          'Music video editor with creative effects',
          'Corporate video editor for presentations',
          'Social media video editor for platforms',
          'Documentary editor with narrative focus',
          'Animation video editor with motion graphics',
          'Product video editor for e-commerce',
          'Event video editor for live recordings',
          'Educational video editor for courses',
          'Promotional video editor for marketing',
          'Short-form video editor for TikTok/Reels',
          'Film trailer editor with dramatic impact',
          'Podcast video editor for YouTube'
        ],
        skills: ['Adobe Premiere Pro', 'After Effects', 'Final Cut Pro', 'DaVinci Resolve', 'Motion Graphics', 'Color Grading', 'Sound Design', 'Video Effects', 'Animation', 'Storytelling', 'Cinematography', 'Video Compression', 'Green Screen', 'Video Transitions', 'Audio Sync', 'Video Optimization'],
        priceRange: { min: 800, max: 8000 }
      }
    };

    const serviceInfo = serviceData[serviceType as keyof typeof serviceData] || serviceData['Web Development'];
    const { names, taglines, skills, priceRange } = serviceInfo;

    return Array.from({ length: 16 }).map((_, i) => {
      const name = names[i % names.length];
      const tagline = taglines[i % taglines.length];
      const price = Math.floor(Math.random() * (priceRange.max - priceRange.min + 1)) + priceRange.min;
      const rating = 4.0 + Math.random() * 1.0;
      const reviewCount = Math.floor(Math.random() * 500) + 50;
      const projectCount = Math.floor(Math.random() * 200) + 20;
      const completionRate = 85 + Math.random() * 15;
      const responseTime = ['1 hour', '2 hours', '4 hours', '6 hours', '12 hours', '1 day'][Math.floor(Math.random() * 6)];
      const location = ['New York, USA', 'London, UK', 'Toronto, Canada', 'Sydney, Australia', 'Berlin, Germany', 'Tokyo, Japan', 'Mumbai, India', 'São Paulo, Brazil'][Math.floor(Math.random() * 8)];
      
      // Select 3-5 random skills for this freelancer
      const freelancerSkills = skills.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 3);
      
      return {
        id: `${serviceType.toLowerCase().replace(' ', '-')}-${i + 1}`,
        name,
        avatar: shuffledAvatars[i % shuffledAvatars.length],
        rating: Math.round(rating * 10) / 10,
        reviewCount,
        price,
        tagline,
        workThumb: gigBannerUrl,
        projectCount,
        skills: freelancerSkills,
        location,
        responseTime,
        completionRate: Math.round(completionRate)
      };
    });
  };

  const dummyFreelancers = getServiceSpecificFreelancers(service?.title || 'Web Development');

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-green-50 dark:from-dark-950 dark:to-dark-900 py-12 px-0">
      <div className="glass-effect rounded-none md:rounded-2xl p-4 md:p-12 shadow-2xl w-full">
        <button onClick={() => navigate(-1)} className="mb-8 px-6 py-2 bg-green-600 text-white rounded-lg font-medium flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-3xl font-bold text-green-700 dark:text-green-400 mb-8 text-center">{service ? service.title : 'Service'} Freelancers</h1>
        {service && (
          <div className="text-center text-green-700 dark:text-green-400 mb-8">
            <span className="font-semibold">Category:</span> {service.category} | <span className="font-semibold">Price:</span> <span>₹{service.price}</span>
          </div>
        )}
        {/* Section Title */}
        <h2 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-6">Gigs you may like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full">
          {dummyFreelancers.map((freelancer, i) => (
            <div
              key={i}
              className="bg-white dark:bg-dark-800 rounded-xl shadow-md hover:shadow-xl border border-gray-200 dark:border-dark-700 transition-all duration-300 cursor-pointer flex flex-col min-h-[340px]"
              onClick={() => navigate(`/freelancer/${i + 1}`, { state: { freelancer, service } })}
            >
              {/* Main project image */}
              <div className="relative w-full h-40 rounded-t-xl overflow-hidden flex-shrink-0">
                <img src={freelancer.workThumb}
                     alt="Work Thumbnail"
                     className="w-full h-40 object-cover object-center"
                     onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = fallbackThumb; }} />
                {/* Project count badge */}
                <span className="absolute top-2 left-2 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">{freelancer.projectCount} Projects</span>
              </div>
              {/* Avatar below image, fully visible */}
              <div className="flex justify-center mt-4 mb-2">
                <img src={freelancer.avatar} alt={freelancer.name} className="w-14 h-14 rounded-full object-cover border-2 border-green-200 bg-white dark:bg-dark-800 shadow-md" onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=150&h=150&q=80'; }} />
              </div>
              {/* Info below */}
              <div className="flex-1 flex flex-col justify-between p-4 pt-0 min-h-[100px]">
                <div className="text-gray-900 dark:text-white font-bold text-base mb-1 text-center">{freelancer.name}</div>
                <div className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-2 text-center">{freelancer.tagline}</div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="flex items-center text-yellow-500 text-xs font-semibold">
                    <Star className="w-4 h-4 mr-1" /> {freelancer.rating}
                  </span>
                  <span className="font-bold text-green-600 dark:text-green-400 text-base">From ₹{freelancer.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 
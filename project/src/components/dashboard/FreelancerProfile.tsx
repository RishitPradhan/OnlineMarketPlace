import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Star, ArrowLeft, Share2, Bookmark, Flag, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export const FreelancerProfile: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [freelancer, setFreelancer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(1);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  React.useEffect(() => {
    if (!id) return;
    setLoading(true);
    supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setFreelancer(data);
        setLoading(false);
      });
  }, [id]);

  // Only after all hooks, do your early returns:
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-green-500 text-xl">Loading profile...</div>;
  }
  if (!freelancer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-950 to-dark-900">
        <div className="glass-effect rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-green-700 mb-4">No freelancer data found.</h2>
          <button onClick={() => navigate(-1)} className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg font-medium flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>
      </div>
    );
  }

  // Dummy works/projects for the gallery
  const works = Array.from({ length: 4 }).map((_, i) => ({
    title: `Project ${i + 1}`,
    image: `https://source.unsplash.com/600x400/?work,creative,${i}`,
    description: 'A creative project delivered with excellence.',
    price: `₹${1000 + i * 500}`,
    rating: (4.5 + Math.random() * 0.5).toFixed(1),
  }));

  // Dummy packages
  const packages = [
    {
      name: 'Basic',
      price: 2000,
      desc: 'Starter package for small needs',
      features: ['1 page', 'Responsive design', '2 revisions', 'Delivery in 3 days'],
      delivery: '3 days',
    },
    {
      name: 'Standard',
      price: 4000,
      desc: 'Most popular for growing businesses',
      features: ['Up to 5 pages', 'Responsive design', '5 revisions', 'SEO optimized', 'Delivery in 5 days'],
      delivery: '5 days',
    },
    {
      name: 'Premium',
      price: 8000,
      desc: 'Full-featured package for large projects',
      features: ['Up to 10 pages', 'Custom animations', 'Unlimited revisions', 'SEO & Analytics', 'Delivery in 7 days'],
      delivery: '7 days',
    },
  ];

  // Dummy FAQ
  const faqs = [
    { q: 'What do you need to get started?', a: 'A brief about your business, content, and any design inspiration you have.' },
    { q: 'Can you redesign my existing website?', a: 'Absolutely! I can modernize and improve your current site.' },
    { q: 'Do you provide support after delivery?', a: 'Yes, I offer 2 weeks of free support after project completion.' },
  ];

  // Dummy reviews
  const reviews = Array.from({ length: 7 }).map((_, i) => ({
    name: ['Alice', 'Bob', 'Charlie', 'Diana', 'Ethan', 'Fiona', 'George'][i],
    avatar: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${i + 10}.jpg`,
    rating: (4 + Math.random()).toFixed(1),
    date: `2024-0${(i % 6) + 1}-1${i}`,
    comment: 'Great work! Delivered on time and exceeded expectations. Highly recommended.'
  }));

  // Dummy skills/tags
  const skills = freelancer?.skills || ['Web Design', 'Framer', 'UI/UX', 'Responsive', 'Animation'];

  // Static gig banners (at least 16 unique Unsplash banner URLs)
  const gigBanners = [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1519340333755-c6e2a6a1b49a?auto=format&fit=crop&w=800&q=80',
  ];
  // Pick a banner based on freelancer id or name hash
  function getBannerIndex(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return Math.abs(hash) % gigBanners.length;
  }
  // Use the same default thumbnail as ServiceFreelancers
  const defaultThumb = 'https://images.unsplash.com/photo-1519340333755-c6e2a6a1b49a?auto=format&fit=crop&w=800&q=80';
  const fallbackBanner = defaultThumb;
  const gigBannerUrl = '/gigbanner.webp';
  const gigBanner = gigBannerUrl;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-green-50 dark:from-dark-950 dark:to-dark-900 py-8 px-0 relative">
      {/* Small circular back button in top left */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 z-20 p-2 bg-green-600 text-white rounded-full shadow hover:bg-green-700 focus:outline-none"
        aria-label="Back"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Breadcrumbs & Header */}
          <div className="flex items-center text-sm text-gray-500 mb-2 gap-2">
            <button onClick={() => navigate('/')} className="hover:underline">Home</button>
            <span>/</span>
            <button onClick={() => navigate(-1)} className="hover:underline">{freelancer.service_title || 'Service'}</button>
            <span>/</span>
            <span className="text-green-700 dark:text-green-400 font-semibold">{freelancer.name}</span>
          </div>
          {/* Gig Title & Seller */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-green-700 dark:text-green-400 flex-1">{freelancer.tagline || 'I will create a modern website for you'}</h1>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-full hover:bg-green-100 dark:hover:bg-dark-800"><Share2 className="w-5 h-5" /></button>
              <button className="p-2 rounded-full hover:bg-green-100 dark:hover:bg-dark-800"><Bookmark className="w-5 h-5" /></button>
              <button className="p-2 rounded-full hover:bg-green-100 dark:hover:bg-dark-800"><Flag className="w-5 h-5" /></button>
            </div>
          </div>
          {/* Seller Info */}
          <div className="flex items-center gap-3 mb-6">
            <img src={freelancer.avatar} alt={freelancer.name} className="w-12 h-12 rounded-full object-cover border-2 border-green-200" />
            <div>
              <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2">{freelancer.name} <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full ml-1">Top Rated</span></div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>{freelancer.rating}</span>
                <span className="text-gray-400">({freelancer.review_count} reviews)</span>
              </div>
            </div>
          </div>
          {/* Gig Image Gallery */}
          <div className="mb-8">
            <div className="w-full aspect-video rounded-xl overflow-hidden bg-white dark:bg-dark-800 shadow-md flex items-center justify-center">
              <img 
                src={gigBanner} 
                alt="Gig Banner" 
                className="object-cover w-full h-full" 
                onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = fallbackBanner; }}
              />
            </div>
          </div>
          {/* About this gig */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-green-700 dark:text-green-400 mb-2">About this gig</h2>
            <p className="text-gray-700 dark:text-gray-200 mb-2">I will design and build a modern, creative, and interactive website tailored to your needs. My services include responsive design, smooth animations, and a focus on user experience. Let's bring your vision to life!</p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-200">
              <li>Modern, creative design</li>
              <li>Fully responsive and mobile-friendly</li>
              <li>Fast delivery and unlimited revisions</li>
              <li>SEO optimized and accessible</li>
            </ul>
          </div>
          {/* FAQ Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-green-700 dark:text-green-400 mb-2">FAQ</h2>
            <div className="divide-y divide-green-100 dark:divide-dark-700">
              {faqs.map((faq, i) => (
                <div key={i}>
                  <button className="w-full flex items-center justify-between py-3 text-left font-medium text-gray-800 dark:text-gray-200 focus:outline-none" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span>{faq.q}</span>
                    {openFaq === i ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  {openFaq === i && <div className="pb-3 text-gray-600 dark:text-gray-300 text-sm">{faq.a}</div>}
                </div>
              ))}
            </div>
          </div>
          {/* Reviews Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-green-700 dark:text-green-400 mb-2">Reviews</h2>
            <div className="space-y-6">
              {reviews.map((review, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <img src={review.avatar} alt={review.name} className="w-10 h-10 rounded-full object-cover border-2 border-green-200" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 dark:text-white">{review.name}</span>
                      <span className="flex items-center text-yellow-500 text-xs font-semibold"><Star className="w-4 h-4 mr-1" /> {review.rating}</span>
                      <span className="text-xs text-gray-400">{review.date}</span>
                    </div>
                    <div className="text-gray-700 dark:text-gray-200 text-sm mt-1">{review.comment}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Tags/Skills */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-green-700 dark:text-green-400 mb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill: string, i: number) => (
                <span key={i} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">{skill}</span>
              ))}
            </div>
          </div>
        </div>
        {/* Sidebar */}
        <aside className="w-full md:w-96 flex-shrink-0 md:sticky md:top-8">
          <div className="glass-effect rounded-2xl p-6 mb-6 shadow-xl">
            {/* Package Selector */}
            <div className="flex gap-2 mb-4">
              {packages.map((pkg, i) => (
                <button
                  key={pkg.name}
                  className={`flex-1 py-2 rounded-lg font-bold text-sm ${selectedPackage === i ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700'} transition`}
                  onClick={() => setSelectedPackage(i)}
                >
                  {pkg.name}
                </button>
              ))}
            </div>
            <div className="mb-2">
              <span className="text-3xl font-bold text-green-700 dark:text-green-400">₹{packages[selectedPackage].price}</span>
              <span className="ml-2 text-gray-500 text-sm">{packages[selectedPackage].desc}</span>
            </div>
            <ul className="mb-4 mt-2 space-y-2">
              {packages[selectedPackage].features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-700 dark:text-gray-200 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" /> {feature}
                </li>
              ))}
            </ul>
            <div className="mb-4 text-sm text-gray-500">Delivery: <span className="font-semibold text-green-700 dark:text-green-400">{packages[selectedPackage].delivery}</span></div>
            <button className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition mb-2">Continue (₹{packages[selectedPackage].price})</button>
            <button className="w-full py-2 bg-green-100 hover:bg-green-200 text-green-700 font-bold rounded-lg transition">Contact Seller</button>
          </div>
          {/* About Seller Card */}
          <div className="glass-effect rounded-2xl p-6 shadow-xl flex flex-col items-center text-center">
            <img src={freelancer.avatar} alt={freelancer.name} className="w-20 h-20 rounded-full object-cover border-2 border-green-200 mb-2" />
            <div className="font-bold text-lg text-gray-900 dark:text-white mb-1">{freelancer.name}</div>
            <div className="flex items-center gap-2 justify-center mb-2">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="font-medium">{freelancer.rating}</span>
              <span className="text-gray-400">({freelancer.review_count} reviews)</span>
            </div>
            <div className="text-gray-600 dark:text-gray-300 text-sm mb-2">{freelancer.tagline}</div>
            <div className="flex flex-wrap gap-2 justify-center mb-2">
              {skills.slice(0, 4).map((skill: string, i: number) => (
                <span key={i} className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">{skill}</span>
              ))}
            </div>
            <button className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition">Contact</button>
          </div>
        </aside>
      </div>
    </div>
  );
}; 
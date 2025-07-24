import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Star, ArrowLeft, Share2, Bookmark, Flag, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

const DummyFreelancerProfile: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const serviceType = location.state?.serviceType || 'web-development';
  let freelancer = location.state?.freelancer;
  if (!freelancer && id) {
    const key = `dummyFreelancers_${serviceType}`;
    const dummyList = JSON.parse(localStorage.getItem(key) || '[]');
    freelancer = dummyList.find((f: any) => f.id === id);
  }
  const [selectedPackage, setSelectedPackage] = useState(1);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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

  // Dummy packages, FAQ, reviews, etc.
  const packages = [
    {
      name: 'Basic',
      price: freelancer.price,
      desc: 'Starter package for small needs',
      features: ['1 page', 'Responsive design', '2 revisions', 'Delivery in 3 days'],
      delivery: '3 days',
    },
    {
      name: 'Standard',
      price: freelancer.price + 1000,
      desc: 'Most popular for growing businesses',
      features: ['Up to 5 pages', 'Responsive design', '5 revisions', 'SEO optimized', 'Delivery in 5 days'],
      delivery: '5 days',
    },
    {
      name: 'Premium',
      price: freelancer.price + 3000,
      desc: 'Full-featured package for large projects',
      features: ['Up to 10 pages', 'Custom animations', 'Unlimited revisions', 'SEO & Analytics', 'Delivery in 7 days'],
      delivery: '7 days',
    },
  ];

  const faqs = [
    { q: 'What do you need to get started?', a: 'A brief about your business, content, and any design inspiration you have.' },
    { q: 'Can you redesign my existing website?', a: 'Absolutely! I can modernize and improve your current site.' },
    { q: 'Do you provide support after delivery?', a: 'Yes, I offer 2 weeks of free support after project completion.' },
  ];

  const reviews = Array.from({ length: 7 }).map((_, i) => ({
    name: ['Alice', 'Bob', 'Charlie', 'Diana', 'Ethan', 'Fiona', 'George'][i],
    avatar: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${i + 10}.jpg`,
    rating: (4 + Math.random()).toFixed(1),
    date: `2024-0${(i % 6) + 1}-1${i}`,
    comment: 'Great work! Delivered on time and exceeded expectations. Highly recommended.'
  }));

  const skills = freelancer.skills || [];
  const displayName = freelancer.name || 'Unknown';
  const displayAvatar = freelancer.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(displayName);
  const displayTagline = freelancer.tagline || '';
  const gigImage = freelancer.workThumb || '/gigbanner.webp';

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-green-50 dark:from-dark-950 dark:to-dark-900 py-8 px-0 relative">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 z-20 p-2 bg-green-600 text-white rounded-full shadow hover:bg-green-700 focus:outline-none"
        aria-label="Back"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 px-4">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Gig Banner */}
          <div className="w-full aspect-video rounded-xl overflow-hidden bg-white dark:bg-dark-800 shadow-md mb-6 flex items-center justify-center">
            <img 
              src={gigImage} 
              alt="Gig Banner" 
              className="object-cover w-full h-full" 
              onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/gigbanner.webp'; }}
            />
          </div>
          {/* Title & Seller */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h1 className="text-3xl font-bold text-green-700 dark:text-green-400 flex-1">{displayTagline || 'I will create a modern website for you'}</h1>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-full hover:bg-green-100 dark:hover:bg-dark-800"><Share2 className="w-5 h-5" /></button>
              <button className="p-2 rounded-full hover:bg-green-100 dark:hover:bg-dark-800"><Bookmark className="w-5 h-5" /></button>
              <button className="p-2 rounded-full hover:bg-green-100 dark:hover:bg-dark-800"><Flag className="w-5 h-5" /></button>
            </div>
          </div>
          {/* Seller Info */}
          <div className="flex items-center gap-4 mb-6">
            <img src={displayAvatar} alt={displayName} className="w-16 h-16 rounded-full object-cover border-2 border-green-200" />
            <div>
              <div className="font-bold text-xl text-gray-900 dark:text-white flex items-center gap-2">{displayName} <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full ml-1">Top Rated</span></div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>{freelancer.rating}</span>
                <span className="text-gray-400">({freelancer.reviewCount} reviews)</span>
              </div>
            </div>
          </div>
          {/* About this gig */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-green-700 dark:text-green-400 mb-2">About this gig</h2>
            <p className="text-gray-700 dark:text-gray-200 mb-2">{displayTagline || 'I will design and build a modern, creative, and interactive website tailored to your needs. My services include responsive design, smooth animations, and a focus on user experience. Let\'s bring your vision to life!'}</p>
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
          {/* Skills/Tags */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-green-700 dark:text-green-400 mb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill: string, i: number) => (
                <span key={i} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">{skill}</span>
              ))}
            </div>
          </div>
        </div>
        {/* Sidebar - Packages */}
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
        </aside>
      </div>
    </div>
  );
};

export default DummyFreelancerProfile; 
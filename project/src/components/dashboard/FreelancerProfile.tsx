import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Star, ArrowLeft, Share2, Bookmark, Flag, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export const FreelancerProfile: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [freelancer, setFreelancer] = useState<any>(location.state?.freelancer || null);
  const [loading, setLoading] = useState(!location.state?.freelancer);
  const [service, setService] = useState<any>(location.state?.service || null);
  const [selectedPackage, setSelectedPackage] = useState(1);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);

  // Fetch freelancer and their service
  React.useEffect(() => {
    async function fetchData() {
      if (!id) return;
      setLoading(true);
      // Fetch freelancer
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      setFreelancer(userData);
      // Fetch service for this freelancer if not in state
      if (!location.state?.service) {
        const { data: serviceData } = await supabase
          .from('services')
          .select('*')
          .eq('freelancerid', id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        setService(serviceData);
      }
      setLoading(false);
    }
    if (!freelancer || (!service && !location.state?.service)) fetchData();
  }, [id]);

  // Fetch reviews for the service
  React.useEffect(() => {
    if (!service?.id) return;
    supabase
      .from('reviews')
      .select('*, reviewer:reviewer_id (name, avatar)')
      .eq('service_id', service.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => setReviews(data || []));
  }, [service?.id]);

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

  // Remove all dummy data fallback logic. Only use the real service data from state or fetch by id.
  // Always show real images, plans, and faqs if present.
  const gigImages = service?.images ? (typeof service.images === 'string' ? JSON.parse(service.images) : service.images) : [];
  const gigPlans = service?.plans ? (typeof service.plans === 'string' ? JSON.parse(service.plans) : service.plans) : [];
  const gigFaqs = service?.faqs ? (typeof service.faqs === 'string' ? JSON.parse(service.faqs) : service.faqs) : [];
  const gigSkills = service?.tags ? (typeof service.tags === 'string' ? JSON.parse(service.tags) : service.tags) : [];
  const gigDescription = service?.description || '';
  const gigBanner = gigImages[0] || '';

  // Guard against empty gigPlans
  if (!service || !gigPlans || gigPlans.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-green-500 text-xl">
        No service or plans found for this freelancer.
      </div>
    );
  }

  // In the sidebar and main content, before mapping features:
  const plan = gigPlans[selectedPackage] || {};
  const features = Array.isArray(plan.features)
    ? plan.features
    : typeof plan.features === 'string'
      ? plan.features.split(',').map((f: string) => f.trim()).filter(Boolean)
      : [];

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
            <button onClick={() => navigate(-1)} className="hover:underline">{gigDescription}</button>
            <span>/</span>
            <span className="text-green-700 dark:text-green-400 font-semibold">{freelancer.name}</span>
          </div>
          {/* Gig Title & Seller */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-green-700 dark:text-green-400 flex-1">{gigDescription}</h1>
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
              />
            </div>
          </div>
          {/* About this gig */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-green-700 dark:text-green-400 mb-2">About this gig</h2>
            <p className="text-gray-700 dark:text-gray-200 mb-2">
              {gigDescription ? gigDescription : <span className="text-red-500">No description provided.</span>}
            </p>
          </div>
          {/* FAQ Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-green-700 dark:text-green-400 mb-2">FAQ</h2>
            <div className="divide-y divide-green-100 dark:divide-dark-700">
              {gigFaqs.map((faq: any, i: number) => (
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
              {reviews.length === 0 && <div className="text-gray-500">No reviews yet.</div>}
              {reviews.map((review, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <img src={review.reviewer?.avatar || 'https://images.unsplash.com/photo-1519340333755-c6e2a6a1b49a?auto=format&fit=crop&w=800&q=80'} alt={review.reviewer?.name || 'User'} className="w-10 h-10 rounded-full object-cover border-2 border-green-200" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 dark:text-white">{review.reviewer?.name || 'User'}</span>
                      <span className="flex items-center text-yellow-500 text-xs font-semibold"><Star className="w-4 h-4 mr-1" /> {review.rating}</span>
                      <span className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString()}</span>
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
              {gigSkills && gigSkills.length > 0 ? (
                gigSkills.map((skill: string, i: number) => (
                  <span key={i} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">{skill}</span>
                ))
              ) : (
                <span className="text-red-500">No skills/tags provided.</span>
              )}
            </div>
          </div>
        </div>
        {/* Sidebar */}
        <aside className="w-full md:w-96 flex-shrink-0 md:sticky md:top-8">
          <div className="glass-effect rounded-2xl p-6 mb-6 shadow-xl">
            {/* Package Selector */}
            <div className="flex gap-2 mb-4">
              {gigPlans && gigPlans.length > 0 ? (
                gigPlans.map((pkg: any, i: number) => (
                  <button
                    key={pkg.name}
                    className={`flex-1 py-2 rounded-lg font-bold text-sm ${selectedPackage === i ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700'} transition`}
                    onClick={() => setSelectedPackage(i)}
                  >
                    {pkg.name}
                  </button>
                ))
              ) : (
                <span className="text-red-500">No plans/packages provided.</span>
              )}
            </div>
            {gigPlans && gigPlans.length > 0 && gigPlans[selectedPackage] ? (
              <>
                <div className="mb-2 flex items-center gap-4">
                  <span className="text-3xl font-bold text-green-700 dark:text-green-400">₹{gigPlans[selectedPackage].price}</span>
                </div>
                {gigPlans[selectedPackage].desc && (
                  <div className="mb-2 text-gray-700 dark:text-gray-300 text-base">{gigPlans[selectedPackage].desc}</div>
                )}
                <ul className="mb-4 mt-2 space-y-2">
                  {features.map((feature: any, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-gray-700 dark:text-gray-200 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" /> {feature}
                    </li>
                  ))}
                </ul>
                <div className="mb-4 text-sm text-gray-500">Delivery: <span className="font-semibold text-green-700 dark:text-green-400">3 days</span></div>
                <button className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition mb-2">Continue (₹{gigPlans[selectedPackage].price})</button>
                <button className="w-full py-2 bg-green-100 hover:bg-green-200 text-green-700 font-bold rounded-lg transition">Contact Seller</button>
              </>
            ) : (
              <span className="text-red-500">No plan/package details available.</span>
            )}
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
              {gigSkills.slice(0, 4).map((skill: string, i: number) => (
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
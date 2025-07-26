import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Star, ArrowLeft, Share2, Bookmark, Flag, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export const FreelancerProfile: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [freelancer, setFreelancer] = useState<any>(null);
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=User&background=10b981&color=fff&size=128';

  // Fetch freelancer and their service
  useEffect(() => {
    console.log('FreelancerProfile useEffect triggered with ID:', id);
    
    async function fetchData() {
      if (!id) {
        console.log('No ID provided, returning early');
        setLoading(false);
        return;
      }
      
      console.log('Starting to fetch data for ID:', id);
      setLoading(true);
      
      try {
        // Fetch freelancer
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', id)
          .single();
        
        if (userError) {
          console.error('Error fetching user data:', userError);
          setLoading(false);
          return;
        }
        
        console.log('Raw user data from DB:', userData);
        
        // Map database data to frontend format
        const mappedFreelancer = userData ? {
          id: userData.id,
          email: userData.email,
          firstName: userData.first_name,
          lastName: userData.last_name,
          role: userData.role,
          avatar: userData.avatar,
          createdAt: userData.created_at,
          updatedAt: userData.updated_at,
        } : null;
        
        console.log('Mapped freelancer data:', mappedFreelancer);
        setFreelancer(mappedFreelancer);
        
        // Fetch service for this freelancer
        const { data: serviceData } = await supabase
          .from('services')
          .select('*')
          .eq('freelancerid', id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        console.log('Service data:', serviceData);
        
        // If no service found, create a dummy service for testing
        if (!serviceData) {
          console.log('No service found, creating dummy service for testing');
          const dummyService = {
            id: 'dummy-service-id',
            freelancerid: id,
            title: 'Professional Web Development',
            description: 'I will create a modern, responsive website for your business. Includes SEO optimization, mobile-friendly design, and fast loading times.',
            category: 'web-development',
            price: 1500.00,
            tags: ['React', 'Node.js', 'TypeScript', 'SEO'],
            plans: [
              {
                name: "Basic",
                price: 1500,
                desc: "Simple website with basic features",
                features: ["5 pages", "Responsive design", "Contact form", "Basic SEO", "3 revisions"],
                delivery: "7 days"
              },
              {
                name: "Standard", 
                price: 2500,
                desc: "Professional website with advanced features",
                features: ["10 pages", "Responsive design", "Contact form", "Advanced SEO", "Blog section", "5 revisions"],
                delivery: "10 days"
              },
              {
                name: "Premium",
                price: 4000,
                desc: "Full-featured website with custom functionality",
                features: ["Unlimited pages", "Responsive design", "Contact form", "Advanced SEO", "Blog section", "Custom features", "Unlimited revisions"],
                delivery: "14 days"
              }
            ],
            images: ["/gigbanner.webp", "/gigbanner.webp", "/gigbanner.webp"],
            faqs: [
              {"q": "What do you need to get started?", "a": "A brief about your business, content, and any design inspiration you have."},
              {"q": "Can you redesign my existing website?", "a": "Absolutely! I can modernize and improve your current site."},
              {"q": "Do you provide support after delivery?", "a": "Yes, I offer 2 weeks of free support after project completion."}
            ]
          };
          setService(dummyService);
        } else {
          setService(serviceData);
        }
        
      } catch (error) {
        console.error('Error in fetchData:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [id]);

  // Loading state
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-green-500 text-xl">Loading profile...</div>;
  }

  // No freelancer found
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

  // Parse service data
  const gigImages = service?.images ? (typeof service.images === 'string' ? JSON.parse(service.images) : service.images) : [];
  const gigPlans = service?.plans ? (typeof service.plans === 'string' ? JSON.parse(service.plans) : service.plans) : [];
  const gigFaqs = service?.faqs ? (typeof service.faqs === 'string' ? JSON.parse(service.faqs) : service.faqs) : [];
  const gigSkills = service?.tags ? (typeof service.tags === 'string' ? JSON.parse(service.tags) : service.tags) : [];
  const gigDescription = service?.description || '';
  const gigBanner = gigImages[0] || '';

  // No service or plans found
  if (!service || !gigPlans || gigPlans.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-green-500 text-xl">
        No service or plans found for this freelancer.
      </div>
    );
  }

  // Get current plan and features
  const plan = gigPlans[selectedPackage] || {};
  const features = Array.isArray(plan.features)
    ? plan.features
    : typeof plan.features === 'string'
      ? plan.features.split(',').map((f: string) => f.trim()).filter(Boolean)
      : [];

  // Handler to go to payment page
  const handleContinueToStripe = async () => {
    const selectedPlan = gigPlans && gigPlans[selectedPackage];
    if (!selectedPlan) {
      alert('Please select a package first');
      return;
    }

    // Get freelancer name correctly
    const freelancerName = freelancer?.firstName && freelancer?.lastName 
      ? `${freelancer.firstName} ${freelancer.lastName}`
      : freelancer?.firstName || 'Freelancer';

    console.log('Freelancer object:', freelancer);
    console.log('Constructed freelancer name:', freelancerName);
    console.log('Service object:', service);
    console.log('Selected plan:', selectedPlan);

    const paymentData = {
      amount: selectedPlan.price,
      serviceId: service?.id,
      freelancerId: freelancer?.id,
      freelancerName: freelancerName,
      serviceTitle: gigDescription,
      packageName: selectedPlan.name,
      packageDescription: selectedPlan.desc
    };

    console.log('Payment data being passed:', paymentData);

    navigate('/payment', {
      state: paymentData
    });
  };

  // Handler to go to messages page
  const handleContactSeller = () => {
    if (freelancer && freelancer.id) {
      navigate('/messages', {
        state: {
          openChat: {
            type: 'user',
            id: freelancer.id,
            name: freelancer?.firstName && freelancer?.lastName 
              ? `${freelancer.firstName} ${freelancer.lastName}`
              : freelancer?.firstName || 'Seller',
          }
        }
      });
    }
  };

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
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Breadcrumbs & Header */}
          <div className="flex items-center text-sm text-gray-500 mb-2 gap-2">
            <button onClick={() => navigate('/')} className="hover:underline">Home</button>
            <span>/</span>
            <button onClick={() => navigate(-1)} className="hover:underline">{gigDescription}</button>
            <span>/</span>
            <span className="text-green-700 dark:text-green-400 font-semibold">
              {freelancer?.firstName && freelancer?.lastName 
                ? `${freelancer.firstName} ${freelancer.lastName}`
                : freelancer?.firstName || 'Freelancer'}
            </span>
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
            <img src={freelancer.avatar || DEFAULT_AVATAR} alt={freelancer?.firstName || 'Freelancer'} className="w-12 h-12 rounded-full object-cover border-2 border-green-200" />
            <div>
              <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                {freelancer?.firstName && freelancer?.lastName 
                  ? `${freelancer.firstName} ${freelancer.lastName}`
                  : freelancer?.firstName || 'Freelancer'} 
                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full ml-1">Top Rated</span>
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
                <button className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition mb-2" onClick={handleContinueToStripe}>Continue (₹{gigPlans[selectedPackage].price})</button>
                <button className="w-full py-2 bg-green-100 hover:bg-green-200 text-green-700 font-bold rounded-lg transition" onClick={handleContactSeller}>Contact Seller</button>
              </>
            ) : (
              <span className="text-red-500">No plan/package details available.</span>
            )}
          </div>
          
          {/* About Seller Card */}
          <div className="glass-effect rounded-2xl p-6 shadow-xl flex flex-col items-center text-center">
            <img src={freelancer.avatar || DEFAULT_AVATAR} alt={freelancer?.firstName || 'Freelancer'} className="w-20 h-20 rounded-full object-cover border-2 border-green-200 mb-2" />
            <div className="font-bold text-lg text-gray-900 dark:text-white mb-1">
              {freelancer?.firstName && freelancer?.lastName 
                ? `${freelancer.firstName} ${freelancer.lastName}`
                : freelancer?.firstName || 'Freelancer'}
            </div>
            <div className="text-gray-600 dark:text-gray-300 text-sm mb-2">{freelancer.tagline}</div>
            <div className="flex flex-wrap gap-2 justify-center mb-2">
              {gigSkills && gigSkills.slice(0, 4).map((skill: string, i: number) => (
                <span key={i} className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">{skill}</span>
              ))}
            </div>
            <button className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition" onClick={handleContactSeller}>Contact</button>
          </div>
        </aside>
      </div>
    </div>
  );
}; 
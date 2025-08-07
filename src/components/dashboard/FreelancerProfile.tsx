import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Star, ArrowLeft, Share2, Bookmark, Flag, CheckCircle, ChevronDown, ChevronUp, Edit } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export const FreelancerProfile: React.FC = () => {
  // All hooks must be called in the same order every render
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // All useState hooks
  const [freelancer, setFreelancer] = useState<any>(null);
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [displayedReviews, setDisplayedReviews] = useState(5);
  const [loadingMoreReviews, setLoadingMoreReviews] = useState(false);
  const [allReviews, setAllReviews] = useState<any[]>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: '',
    name: 'Anonymous'
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  // All useEffect hooks
  useEffect(() => {
    if (user) {
      setReviewForm(prev => ({
        ...prev,
        name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.firstName || 'Anonymous'
      }));
    }
  }, [user]);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    
    async function fetchData() {
      setLoading(true);
      
      try {
        console.log('Fetching user data for ID:', id);
        // Fetch freelancer
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', id)
          .single();
        
        console.log('User data fetched:', userData);
        console.log('User error:', userError);
        
        if (userError) {
          console.error('Error fetching user data:', userError);
          setLoading(false);
          return;
        }
        
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
        
        setFreelancer(mappedFreelancer);
        
        // Fetch service for this freelancer
        const { data: serviceData, error: serviceError } = await supabase
          .from('services')
          .select('*')
          .eq('freelancerid', id)
          .eq('isactive', true)
          .order('updated_at', { ascending: false })
          .limit(1);
        
        if (!serviceData || serviceData.length === 0) {
          const dummyService = {
            id: 'dummy-service-id',
            freelancer_id: id,
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
            images: ["/OIPbg.png", "/OIPfdf.png", "/OIPfef.png"],
            faqs: [
              {"q": "What do you need to get started?", "a": "A brief about your business, content, and any design inspiration you have."},
              {"q": "Can you redesign my existing website?", "a": "Absolutely! I can modernize and improve your current site."},
              {"q": "Do you provide support after delivery?", "a": "Yes, I offer 2 weeks of free support after project completion."}
            ]
          };
          setService(dummyService);
        } else {
          const service = serviceData[0];
          setService(service);
        }
        
        // Initialize reviews
        const finalService = serviceData && serviceData.length > 0 ? serviceData[0] : null;
        if (finalService) {
          const reviews = getReviewsForService(finalService.id, finalService.created_at);
          setAllReviews(reviews);
        } else {
          const reviews = getReviewsForService('dummy-service-id', new Date().toISOString());
          setAllReviews(reviews);
        }
        
      } catch (error) {
        console.error('Error in fetchData:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [id]);

  // Helper functions
  const getRandomDemoImage = (serviceId: string) => {
    const demoImages = [
      "/OIP.png", "/OIP1.png", "/OIP2.png", "/OIP3.png", "/OIP4.png", "/OIP5.png", "/OIP6.png", "/OIP7.png", "/OIP8.png", "/OIP9.png",
      "/OIPb.png", "/OIPcdf.png", "/OIPdf.png", "/OIPefe.png", "/OIPf.png", "/OIPfdf.png", "/OIPfef.png", "/OIPfg.png", "/OIPg.png", "/OIPh.png",
      "/OIPj.png", "/OIPn.png", "/OIPnc.png", "/OIPt.png", "/OIPuj.png", "/OIPvg.png", "/R.png", "/TharLU.png", "/Thumbnail-1.png", "/wp4269240.png",
      "/wp9517064.png", "/OIP34.png", "/OIP78.png", "/OIPbg.png", "/OIPfdf.png", "/OIPfef.png", "/OIPfg.png", "/OIPg.png", "/OIPh.png", "/OIPj.png"
    ];
    const index = parseInt(serviceId.slice(-2), 16) % demoImages.length;
    return demoImages[index];
  };

  const getReviewsForService = (serviceId: string, serviceCreatedAt: string) => {
    const serviceAge = new Date().getTime() - new Date(serviceCreatedAt).getTime();
    const daysSinceCreation = Math.floor(serviceAge / (1000 * 60 * 60 * 24));
    
    if (daysSinceCreation < 30) {
      return [];
    }
    
    return [
      {
        id: 1,
        name: "Alex Johnson",
        avatar: getRandomDemoImage(serviceId),
        rating: 5,
        date: "2 days ago",
        comment: "Excellent work! The website was delivered on time and exceeded my expectations. The design is modern and responsive. Highly recommended!",
        completed: true
      },
      {
        id: 2,
        name: "Sarah Chen",
        avatar: getRandomDemoImage(serviceId),
        rating: 4,
        date: "1 week ago",
        comment: "Great communication throughout the project. The freelancer was very professional and delivered exactly what I asked for. Will definitely work with again!",
        completed: true
      },
      {
        id: 3,
        name: "Mike Rodriguez",
        avatar: getRandomDemoImage(serviceId),
        rating: 5,
        date: "2 weeks ago",
        comment: "Outstanding quality and attention to detail. The freelancer went above and beyond to ensure the project was perfect. Highly skilled and reliable!",
        completed: true
      },
      {
        id: 4,
        name: "Emma Davis",
        avatar: getRandomDemoImage(serviceId),
        rating: 4,
        date: "3 weeks ago",
        comment: "Very responsive and professional. The work was delivered on time and the quality was excellent. Would definitely recommend!",
        completed: true
      },
      {
        id: 5,
        name: "David Wilson",
        avatar: getRandomDemoImage(serviceId),
        rating: 5,
        date: "1 month ago",
        comment: "Exceptional service! The freelancer understood my requirements perfectly and delivered a fantastic result. Will hire again!",
        completed: true
      },
      {
        id: 6,
        name: "Lisa Brown",
        avatar: getRandomDemoImage(serviceId),
        rating: 4,
        date: "1 month ago",
        comment: "Great experience working with this freelancer. Professional, timely, and high-quality work. Highly satisfied!",
        completed: true
      },
      {
        id: 7,
        name: "Tom Anderson",
        avatar: getRandomDemoImage(serviceId),
        rating: 5,
        date: "2 months ago",
        comment: "Amazing work quality and communication. The freelancer was very patient with my changes and delivered exactly what I wanted.",
        completed: true
      }
    ];
  };

  const generateAvatarUrl = (firstName: string | undefined, lastName: string | undefined) => {
    const name = `${firstName || ''} ${lastName || ''}`.trim();
    if (!name) return 'https://ui-avatars.com/api/?name=User&background=10b981&color=fff&size=128';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=10b981&color=fff&size=128`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-950 to-dark-900">
        <div className="glass-effect rounded-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-green-700 mb-2">Loading profile...</h2>
          <p className="text-green-400">Please wait while we fetch the freelancer data</p>
        </div>
      </div>
    );
  }

  // No freelancer found
  if (!freelancer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-950 to-dark-900">
        <div className="glass-effect rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-green-700 mb-4">No freelancer data found.</h2>
          <p className="text-green-400 mb-4">The freelancer profile could not be loaded.</p>
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

  // Use actual plans from database, fallback to calculated plans if none exist
  const servicePrice = service?.price || 1500;
  const finalGigPlans = gigPlans && gigPlans.length > 0 ? gigPlans : [
    {
      name: "Basic",
      price: servicePrice,
      desc: "Basic service package with essential features",
      features: ["Standard features", "Quality work", "Timely delivery", "Basic support"],
      delivery: "7 days"
    },
    {
      name: "Standard", 
      price: servicePrice * 1.5,
      desc: "Enhanced service package with advanced features",
      features: ["Advanced features", "Priority support", "Faster delivery", "Revisions included"],
      delivery: "5 days"
    },
    {
      name: "Premium",
      price: servicePrice * 2,
      desc: "Premium service package with all features",
      features: ["All features", "VIP support", "Express delivery", "Unlimited revisions"],
      delivery: "3 days"
    }
  ];

  // Get current plan and features
  const plan = finalGigPlans[selectedPackage] || {};
  const features = Array.isArray(plan.features) ? plan.features : [];

  // Handlers
  const handleContinueToPayment = async () => {
    const selectedPlan = finalGigPlans && finalGigPlans[selectedPackage];
    if (!selectedPlan) {
      alert('Please select a package first');
      return;
    }

    const freelancerName = freelancer?.firstName && freelancer?.lastName 
      ? `${freelancer.firstName} ${freelancer.lastName}`
      : freelancer?.firstName || 'Freelancer';

    const paymentData = {
      amount: selectedPlan.price,
      serviceId: service?.id,
      freelancerId: freelancer?.id,
      freelancerName: freelancerName,
      serviceTitle: gigDescription,
      packageName: selectedPlan.name,
      packageDescription: selectedPlan.desc
    };

    navigate('/payments/premium', {
      state: paymentData
    });
  };

  const handleContactSeller = async () => {
    if (!user) {
      alert('Please log in to contact the seller');
      return;
    }
    
    if (freelancer && freelancer.id) {
      const freelancerName = freelancer?.firstName && freelancer?.lastName 
        ? `${freelancer.firstName} ${freelancer.lastName}`
        : freelancer?.firstName || 'Seller';
        
      // Navigate to messages with the chat open
      console.log('Opening chat with:', {
        type: 'user',
        id: freelancer.id,
        name: freelancerName,
      });
      console.log('Freelancer data:', freelancer);
      
      navigate('/messages', {
        state: {
          openChat: {
            type: 'user',
            id: freelancer.id,
            name: freelancerName,
          }
        }
      });
    } else {
      alert('Unable to contact seller. Please try again.');
    }
  };

  const handleLoadMoreReviews = async () => {
    setLoadingMoreReviews(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setDisplayedReviews(prev => Math.min(prev + 3, allReviews.length));
    setLoadingMoreReviews(false);
  };

  const handleSubmitReview = async () => {
    if (!reviewForm.comment.trim()) {
      alert('Please enter a review comment');
      return;
    }

    setSubmittingReview(true);
    
    try {
      const newReview = {
        id: Date.now(),
        name: reviewForm.name,
        avatar: generateAvatarUrl(reviewForm.name?.split(' ')[0], reviewForm.name?.split(' ')[1]),
        rating: reviewForm.rating,
        date: 'Just now',
        comment: reviewForm.comment,
        completed: true,
        service_id: service?.id,
        reviewed_id: freelancer?.id,
        reviewer_id: user?.id
      };

      try {
        const { data, error } = await supabase
          .from('reviews')
          .insert([{
            id: newReview.id.toString(),
            service_id: newReview.service_id,
            reviewed_id: newReview.reviewed_id,
            reviewer_id: newReview.reviewer_id,
            rating: newReview.rating,
            comment: newReview.comment,
            created_at: new Date().toISOString()
          }]);

        if (error) {
          console.error('Error saving review to database:', error);
        }
      } catch (dbError) {
        console.error('Database error:', dbError);
      }

      setAllReviews(prev => [newReview, ...prev]);
      
      setReviewForm({
        rating: 5,
        comment: '',
        name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.firstName || 'Anonymous'
      });
      
      setShowReviewModal(false);
      alert('Review submitted successfully!');
      
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleLeaveReview = () => {
    if (!user) {
      alert('Please log in to leave a review');
      return;
    }

    const testReviewsTable = async () => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .limit(1);
        
        if (error) {
          console.error('Reviews table error:', error);
          alert('Reviews table not accessible. Please contact support.');
          return;
        }
      } catch (error) {
        console.error('Error testing reviews table:', error);
        alert('Reviews table not found. Please contact support.');
        return;
      }
    };

    testReviewsTable();

    setEditingReview(null);
    setReviewForm({
      rating: 5,
      comment: '',
      name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.firstName || 'Anonymous'
    });
    setShowReviewModal(true);
  };

  const handleEditReview = (review: any) => {
    if (!user || review.reviewer_id !== user.id) {
      alert('You can only edit your own reviews');
      return;
    }
    setEditingReview(review);
    setReviewForm({
      rating: review.rating,
      comment: review.comment,
      name: review.name
    });
    setShowReviewModal(true);
  };

  const handleUpdateReview = async () => {
    if (!reviewForm.comment.trim()) {
      alert('Please enter a review comment');
      return;
    }

    setSubmittingReview(true);
    
    try {
      const { data, error } = await supabase
        .from('reviews')
        .update({
          rating: reviewForm.rating,
          comment: reviewForm.comment,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingReview.id);

      if (error) {
        console.error('Error updating review:', error);
        alert('Failed to update review. Please try again.');
        return;
      }

      setAllReviews(prev => prev.map(review => 
        review.id === editingReview.id 
          ? { ...review, rating: reviewForm.rating, comment: reviewForm.comment }
          : review
      ));
      
      setEditingReview(null);
      setReviewForm({
        rating: 5,
        comment: '',
        name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.firstName || 'Anonymous'
      });
      setShowReviewModal(false);
      
      alert('Review updated successfully!');
      
    } catch (error) {
      console.error('Error updating review:', error);
      alert('Failed to update review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Calculate review statistics
  const totalReviews = allReviews.length;
  const averageRating = totalReviews > 0 
    ? allReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
    : 0;
  const ratingDistribution = {
    5: allReviews.filter(r => r.rating === 5).length,
    4: allReviews.filter(r => r.rating === 4).length,
    3: allReviews.filter(r => r.rating === 3).length,
    2: allReviews.filter(r => r.rating === 2).length,
    1: allReviews.filter(r => r.rating === 1).length
  };

  // Get currently displayed reviews
  const currentReviews = allReviews.slice(0, displayedReviews);

  // Render the component
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
            <img 
              src={freelancer.avatar || generateAvatarUrl(freelancer?.firstName, freelancer?.lastName)} 
              alt={freelancer?.firstName || 'Freelancer'} 
              className="w-12 h-12 rounded-full object-cover border-2 border-green-200 cursor-pointer hover:scale-110 transition-transform duration-200" 
              onClick={() => {
                if (freelancer?.id) {
                  navigate(`/user/${freelancer.id}`);
                }
              }}
            />
            <div>
              <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                {freelancer?.firstName && freelancer?.lastName 
                  ? `${freelancer.firstName} ${freelancer.lastName}`
                  : freelancer?.firstName || 'Freelancer'}
                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full ml-1">Top Rated</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Member since {freelancer?.createdAt ? new Date(freelancer.createdAt).toLocaleDateString() : 'N/A'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {freelancer?.email || 'Email not available'}
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-dark-800 rounded-lg p-4 text-center border border-green-200 dark:border-green-800">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {totalReviews}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Reviews</div>
            </div>
            <div className="bg-white dark:bg-dark-800 rounded-lg p-4 text-center border border-green-200 dark:border-green-800">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {averageRating.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Rating</div>
            </div>
            <div className="bg-white dark:bg-dark-800 rounded-lg p-4 text-center border border-green-200 dark:border-green-800">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {gigSkills?.length || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Skills</div>
            </div>
            <div className="bg-white dark:bg-dark-800 rounded-lg p-4 text-center border border-green-200 dark:border-green-800">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {service?.category ? service.category.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'N/A'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Category</div>
            </div>
          </div>

          {/* Gig Image Gallery */}
          <div className="mb-8">
            <div className="w-full aspect-video rounded-xl overflow-hidden bg-white dark:bg-dark-800 shadow-md flex items-center justify-center">
              {service?.id ? (
                <img
                  src={getRandomDemoImage(service.id)} 
                  alt="Gig Banner" 
                  className="object-cover w-full h-full" 
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = getRandomDemoImage('default');
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 dark:from-dark-700 dark:to-dark-600 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📸</div>
                    <div className="text-gray-600 dark:text-gray-300">Gig Banner</div>
                  </div>
                </div>
              )}
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

          {/* Services Offered */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-green-700 dark:text-green-400 mb-2">Services Offered</h2>
            <div className="bg-white dark:bg-dark-800 rounded-lg p-4 border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {service?.title || service?.name || 'Professional Service'}
                </h3>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {service?.category ? service.category.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'General'}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                {service?.description || 'Professional service with high quality standards and timely delivery.'}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-green-600 dark:text-green-400 font-semibold">
                  Starting from ₹{finalGigPlans[0]?.price || 'N/A'}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {finalGigPlans[0]?.delivery || '7 days'} delivery
                </span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-green-700 dark:text-green-400 mb-2">Contact Information</h2>
            <div className="bg-white dark:bg-dark-800 rounded-lg p-4 border border-green-200 dark:border-green-800">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Name</div>
                    <div className="text-gray-900 dark:text-white font-medium">
                      {freelancer?.firstName && freelancer?.lastName 
                        ? `${freelancer.firstName} ${freelancer.lastName}`
                        : freelancer?.firstName || 'Not provided'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Email</div>
                    <div className="text-gray-900 dark:text-white font-medium">
                      {freelancer?.email || 'Not provided'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Member Since</div>
                    <div className="text-gray-900 dark:text-white font-medium">
                      {freelancer?.createdAt ? new Date(freelancer.createdAt).toLocaleDateString() : 'Not available'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-green-700 dark:text-green-400">Reviews</h2>
              {totalReviews > 0 ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="ml-1 font-semibold text-gray-700 dark:text-gray-300">
                      {totalReviews > 0 ? averageRating.toFixed(1) : 'No rating'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">({totalReviews} reviews)</span>
                </div>
              ) : (
                <span className="text-sm text-gray-500 dark:text-gray-400">No reviews yet</span>
              )}
            </div>
            
            {/* Review Stats */}
            {totalReviews > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-dark-800 rounded-lg p-4 border border-green-100 dark:border-dark-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">5 Stars</span>
                    <span className="text-sm font-semibold text-green-700 dark:text-green-400">{ratingDistribution[5]}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(ratingDistribution[5] / totalReviews) * 100}%` }}></div>
                  </div>
                </div>
                <div className="bg-white dark:bg-dark-800 rounded-lg p-4 border border-green-100 dark:border-dark-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">4 Stars</span>
                    <span className="text-sm font-semibold text-green-700 dark:text-green-400">{ratingDistribution[4]}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(ratingDistribution[4] / totalReviews) * 100}%` }}></div>
                  </div>
                </div>
                <div className="bg-white dark:bg-dark-800 rounded-lg p-4 border border-green-100 dark:border-dark-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">3 Stars</span>
                    <span className="text-sm font-semibold text-green-700 dark:text-green-400">{ratingDistribution[3]}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(ratingDistribution[3] / totalReviews) * 100}%` }}></div>
                  </div>
                </div>
                <div className="bg-white dark:bg-dark-800 rounded-lg p-4 border border-green-100 dark:border-dark-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">2 Stars</span>
                    <span className="text-sm font-semibold text-green-700 dark:text-green-400">{ratingDistribution[2]}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(ratingDistribution[2] / totalReviews) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-dark-800 rounded-lg p-8 border border-green-100 dark:border-dark-700 text-center">
                <div className="text-4xl mb-4">⭐</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Reviews Yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  This service is new and hasn't received any reviews yet. Reviews can be added from the orders page after completing a service.
                </p>
              </div>
            )}

            {/* Individual Reviews */}
            {totalReviews > 0 && (
              <>
                <div className="space-y-4">
                  {currentReviews.map((review) => (
                    <div key={review.id} className="bg-white dark:bg-dark-800 rounded-lg p-6 border border-green-100 dark:border-dark-700">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={review.avatar}
                            alt={review.name}
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = generateAvatarUrl(review.name?.split(' ')[0], review.name?.split(' ')[1]);
                            }}
                          />
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">{review.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{review.date}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                          {user && review.reviewer_id === user.id && (
                            <button
                              onClick={() => handleEditReview(review)}
                              className="p-1 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 transition-colors"
                              title="Edit review"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        "{review.comment}"
                      </p>
                      {review.completed && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Project completed successfully</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Load More Reviews Button */}
                {displayedReviews < allReviews.length && (
                  <div className="text-center mt-6">
                    <button 
                      onClick={handleLoadMoreReviews}
                      disabled={loadingMoreReviews}
                      className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                        loadingMoreReviews 
                          ? 'bg-gray-400 text-white cursor-not-allowed' 
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {loadingMoreReviews ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Loading...
                        </div>
                      ) : (
                        `Load More Reviews (${allReviews.length - displayedReviews} remaining)`
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        
        {/* Sidebar */}
        <aside className="w-full md:w-96 flex-shrink-0 md:sticky md:top-8">
          <div className="glass-effect rounded-2xl p-6 mb-6 shadow-xl">
            {/* Package Selector */}
            <div className="flex gap-2 mb-4">
              {finalGigPlans && finalGigPlans.length > 0 ? (
                finalGigPlans.map((pkg: any, i: number) => (
                  <button
                    key={pkg.name}
                    className={`flex-1 py-2 rounded-lg font-bold text-sm ${selectedPackage === i ? 'bg-green-600 text-white shadow-lg' : 'bg-green-100 text-green-700 hover:bg-green-200'} transition-all duration-200`}
                    onClick={() => {
                      setSelectedPackage(i);
                    }}
                  >
                    {pkg.name}
                  </button>
                ))
              ) : (
                <span className="text-red-500">No plans/packages provided.</span>
              )}
            </div>
            
            {finalGigPlans && finalGigPlans.length > 0 && finalGigPlans[selectedPackage] ? (
              <>
                <div className="mb-2 flex items-center gap-4">
                  <span className="text-3xl font-bold text-green-700 dark:text-green-400 transition-all duration-300">
                    ₹{finalGigPlans[selectedPackage].price}
                  </span>
                  <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    Selected
                  </span>
                </div>
                {finalGigPlans[selectedPackage].desc && (
                  <div className="mb-2 text-gray-700 dark:text-gray-300 text-base">{finalGigPlans[selectedPackage].desc}</div>
                )}
                <ul className="mb-4 mt-2 space-y-2">
                  {features.map((feature: any, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-gray-700 dark:text-gray-200 text-sm transition-all duration-200">
                      <CheckCircle className="w-4 h-4 text-green-500" /> {feature}
                    </li>
                  ))}
                </ul>
                <div className="mb-4 text-sm text-gray-500">Delivery: <span className="font-semibold text-green-700 dark:text-green-400">{finalGigPlans[selectedPackage].delivery || '3 days'}</span></div>
                <button className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition mb-2" onClick={handleContinueToPayment}>Continue (₹{finalGigPlans[selectedPackage].price})</button>
                <button className="w-full py-2 bg-green-100 hover:bg-green-200 text-green-700 font-bold rounded-lg transition" onClick={handleContactSeller}>Contact Seller</button>
              </>
            ) : (
              <span className="text-red-500">No plan/package details available.</span>
            )}
          </div>
          
          {/* About Seller Card */}
          <div className="glass-effect rounded-2xl p-6 shadow-xl flex flex-col items-center text-center">
            <img 
              src={freelancer.avatar || generateAvatarUrl(freelancer?.firstName, freelancer?.lastName)} 
              alt={freelancer?.firstName || 'Freelancer'} 
              className="w-20 h-20 rounded-full object-cover border-2 border-green-200 mb-2 cursor-pointer hover:scale-110 transition-transform duration-200" 
              onClick={() => {
                if (freelancer?.id) {
                  navigate(`/user/${freelancer.id}`);
                }
              }}
            />
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

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingReview ? 'Edit Review' : 'Leave a Review'}
              </h3>
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setEditingReview(null);
                  setReviewForm({
                    rating: 5,
                    comment: '',
                    name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.firstName || 'Anonymous'
                  });
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Rating
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                    className={`text-2xl ${star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={reviewForm.name}
                onChange={(e) => setReviewForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                placeholder="Your name"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Review
              </label>
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-dark-700 dark:text-white resize-none"
                rows={4}
                placeholder="Share your experience with this freelancer..."
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setEditingReview(null);
                  setReviewForm({
                    rating: 5,
                    comment: '',
                    name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.firstName || 'Anonymous'
                  });
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingReview ? handleUpdateReview : handleSubmitReview}
                disabled={submittingReview || (!reviewForm.comment.trim() && !editingReview)}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  submittingReview || (!reviewForm.comment.trim() && !editingReview)
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {submittingReview ? 'Submitting...' : editingReview ? 'Update Review' : 'Submit Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 
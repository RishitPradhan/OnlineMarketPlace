import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Star, Clock, User, MessageCircle, Heart, Share2, ArrowLeft, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingScreen } from '../ui/LoadingScreen';

interface Plan {
  name: string;
  price: number;
  desc: string;
  features: string[];
  delivery: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  delivery_time: number;
  image_url?: string;
  tags?: string[];
  is_active: boolean;
  freelancerid: string;
  created_at: string;
  updated_at: string;
  plans?: Plan[];
  users?: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
  reviews?: Array<{
    id: string;
    rating: number;
    comment: string;
    created_at: string;
    reviewer_id: string;
  }>;
}

export const ServiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<number>(0);

  useEffect(() => {
    const fetchService = async () => {
      if (!id) return;

      try {
        setLoading(true);
        // First, let's log the ID to see what we're searching for
        console.log('Searching for service with ID:', id);
        console.log('ID type:', typeof id);
        console.log('ID length:', id?.length);
        
        // First fetch the service
        const { data: serviceData, error: serviceError } = await supabase
          .from('services')
          .select('*')
          .eq('id', id)
          .single();

        console.log('Service data fetched:', serviceData);

        if (serviceError) {
          console.error('Error fetching service:', serviceError);
          setError('Service not found');
          setLoading(false);
          return;
        }

        if (!serviceData) {
          console.error('No service data found');
          setError('Service not found');
          setLoading(false);
          return;
        }

        console.log('Service freelancerid:', serviceData.freelancerid);
        
        // Fetch freelancer data
        const { data: freelancerData, error: freelancerError } = await supabase
          .from('users')
          .select('*')
          .eq('id', serviceData.freelancerid)
          .single();

        if (freelancerError) {
          console.error('Error fetching freelancer:', freelancerError);
        }

        // Fetch reviews
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('id, rating, comment, created_at, reviewer_id')
          .eq('order_id', serviceData.id);

        // Parse plans if they exist
        let plans: Plan[] = [];
        if (serviceData.plans) {
          try {
            plans = typeof serviceData.plans === 'string' 
              ? JSON.parse(serviceData.plans) 
              : serviceData.plans;
          } catch (e) {
            console.error('Error parsing plans:', e);
            plans = [];
          }
        }

        const data = {
          ...serviceData,
          plans,
          users: freelancerData,
          reviews: reviewsData || []
        };

        const error = serviceError || freelancerError || reviewsError;

        if (error) {
          console.error('Error fetching service:', error);
          setError('Service not found');
        } else {
          setService(data);
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load service');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  if (loading) {
    return <LoadingScreen message="Loading service details..." />;
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-950 to-dark-900 flex items-center justify-center">
        <Card className="glass-effect neon-border p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Service Not Found</h2>
          <p className="text-green-400 mb-6">The service you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/browse-services')} className="mr-4">
            Browse Services
          </Button>
          <Button onClick={() => navigate('/dashboard')} variant="outline">
            Go to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const averageRating = service.reviews && service.reviews.length > 0
    ? service.reviews.reduce((sum, review) => sum + review.rating, 0) / service.reviews.length
    : 0;

  const reviewCount = service.reviews?.length || 0;

  // Debug logging
  console.log('Service data:', service);
  console.log('Reviews:', service.reviews);
  console.log('Average rating:', averageRating);
  console.log('Plans:', service.plans);

  const handleOrderNow = () => {
    if (!service.plans || service.plans.length === 0) {
      alert('No plans available for this service');
      return;
    }

    const selectedPlanData = service.plans[selectedPlan];
    if (!selectedPlanData) {
      alert('Please select a plan first');
      return;
    }

    // Navigate to payment page with plan details
    navigate('/payments/premium', {
      state: {
        amount: selectedPlanData.price,
        serviceId: service.id,
        freelancerId: service.freelancerid,
        freelancerName: service.users ? `${service.users.first_name} ${service.users.last_name}` : 'Freelancer',
        serviceTitle: service.title,
        packageName: selectedPlanData.name,
        packageDescription: selectedPlanData.desc
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 to-dark-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-green-400 hover:text-green-300 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="glass-effect neon-border p-6 mb-6">
              {/* Service Image */}
              <div className="relative mb-6">
                <img
                  src={service.image_url || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?w=800&h=400&fit=crop`}
                  alt={service.title}
                  className="w-full h-64 object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?w=800&h=400&fit=crop`;
                  }}
                />
              </div>

              {/* Service Title and Category */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-2">{service.title}</h1>
                <p className="text-green-400 text-lg">{service.category}</p>
              </div>

              {/* Rating and Reviews */}
              <div className="flex items-center mb-6">
                <div className="flex items-center mr-4">
                  <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                  <span className="text-white font-semibold">{averageRating.toFixed(1)}</span>
                  <span className="text-gray-400 ml-1">({reviewCount} reviews)</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{service.delivery_time} days delivery</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-3">Description</h3>
                <p className="text-gray-300 leading-relaxed">{service.description}</p>
              </div>

              {/* Reviews Section */}
              {service.reviews && service.reviews.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Reviews</h3>
                  <div className="space-y-4">
                    {service.reviews.slice(0, 3).map((review) => (
                      <div key={review.id} className="border border-green-500/20 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                              <span className="text-white text-sm font-semibold">
                                U
                              </span>
                            </div>
                            <span className="text-white font-medium">
                              User {review.reviewer_id.slice(0, 8)}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                            <span className="text-white">{review.rating}</span>
                          </div>
                        </div>
                        <p className="text-gray-300">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Plans */}
            {service.plans && service.plans.length > 0 ? (
              <Card className="glass-effect neon-border p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Choose Your Plan</h3>
                <div className="space-y-4">
                  {service.plans.map((plan, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedPlan === index
                          ? 'border-green-500 bg-green-600/10'
                          : 'border-green-500/20 bg-dark-700/50 hover:border-green-500/40'
                      }`}
                      onClick={() => setSelectedPlan(index)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-semibold text-white">{plan.name}</h4>
                        <div className="text-2xl font-bold text-green-400">₹{plan.price}</div>
                      </div>
                      <p className="text-gray-300 text-sm mb-3">{plan.desc}</p>
                      <ul className="space-y-1 mb-3">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center text-gray-300 text-sm">
                            <CheckCircle className="w-3 h-3 text-green-400 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <div className="text-gray-400 text-xs">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {plan.delivery}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-4">
                  <Button className="w-full" size="lg" onClick={handleOrderNow}>
                    Order Now - ₹{service.plans[selectedPlan]?.price}
                  </Button>
                  <Button variant="outline" className="w-full">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact Freelancer
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Heart className="w-4 h-4 mr-2" />
                    Save to Wishlist
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Service
                  </Button>
                </div>
              </Card>
            ) : (
              /* Fallback to fixed price if no plans */
              <Card className="glass-effect neon-border p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-white mb-2">₹{service.price}</div>
                  <p className="text-green-400">Fixed Price</p>
                </div>

                <div className="space-y-4">
                  <Button className="w-full" size="lg">
                    Order Now
                  </Button>
                  <Button variant="outline" className="w-full">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact Freelancer
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Heart className="w-4 h-4 mr-2" />
                    Save to Wishlist
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Service
                  </Button>
                </div>
              </Card>
            )}

            {/* Freelancer Info */}
            <Card className="glass-effect neon-border p-6">
              <h3 className="text-xl font-semibold text-white mb-4">About the Freelancer</h3>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-semibold">
                    {service.users?.first_name?.[0] || 'U'}
                  </span>
                </div>
                <div>
                  <p className="text-white font-semibold">
                    {service.users?.first_name} {service.users?.last_name}
                  </p>
                  <p className="text-green-400 text-sm">Member since {new Date(service.created_at).getFullYear()}</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <User className="w-4 h-4 mr-2" />
                View Profile
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}; 
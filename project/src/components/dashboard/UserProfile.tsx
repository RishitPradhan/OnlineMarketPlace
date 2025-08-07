import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Star, Calendar, Mail, User, Award, Briefcase, MessageSquare } from 'lucide-react';

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=User&background=10b981&color=fff&size=128';

const generateAvatarUrl = (firstName: string | undefined, lastName: string | undefined) => {
  if (!firstName && !lastName) {
    return 'https://ui-avatars.com/api/?name=User&background=10b981&color=fff&size=128';
  }
  const name = `${firstName || ''} ${lastName || ''}`.trim();
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=10b981&color=fff&size=128`;
};

const UserProfile: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    
    const fetchUserData = async () => {
      try {
        // Fetch user data
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', id)
          .single();
        
        setUser(userData);

        // Fetch user's services
        const { data: servicesData } = await supabase
          .from('services')
          .select('*')
          .eq('freelancerid', id)
          .eq('isactive', true)
          .order('created_at', { ascending: false });

        setServices(servicesData || []);

        // Fetch user's reviews
        const { data: reviewsData } = await supabase
          .from('reviews')
          .select('*')
          .eq('reviewed_id', id)
          .order('created_at', { ascending: false });

        setReviews(reviewsData || []);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  const calculateAverageRating = () => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  const getRandomDemoImage = (serviceId: string) => {
    const demoImages = [
      "/OIP.png", "/OIP1.png", "/OIP2.png", "/OIP3.png", "/OIP4.png", "/OIP5.png", "/OIP6.png", "/OIP7.png", "/OIP8.png", "/OIP9.png",
      "/OIPb.png", "/OIPcdf.png", "/OIPdf.png", "/OIPefe.png", "/OIPf.png", "/OIPfdf.png", "/OIPfef.png", "/OIPfg.png", "/OIPg.png", "/OIPh.png",
      "/OIPj.png", "/OIPn.png", "/OIPnc.png", "/OIPt.png", "/OIPuj.png", "/OIPvg.png", "/R.png", "/TharLU.png", "/Thumbnail-1.png", "/wp4269240.png",
      "/wp9517064.png", "/OIP34.png", "/OIP78.png", "/OIPbg.png", "/OIPfdf.png", "/OIPfef.png", "/OIPfg.png", "/OIPg.png", "/OIPh.png", "/OIPj.png"
    ];
    const index = parseInt(serviceId.slice(-1), 16) % demoImages.length;
    return demoImages[index];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-950 to-dark-900 flex items-center justify-center">
        <div className="glass-effect rounded-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-green-400 text-lg">Loading user profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-950 to-dark-900">
        <div className="glass-effect rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-green-700 mb-4">User not found.</h2>
          <button onClick={() => navigate(-1)} className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg font-medium flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 to-dark-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="glass-effect rounded-3xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(-1)}
              className="p-3 glass-effect text-gray-400 rounded-xl hover:bg-green-500/10 hover:text-green-400 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-bold text-white">User Profile</h1>
            <div className="w-10"></div>
          </div>

          {/* User Info */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative">
              <img 
                src={user.avatar || generateAvatarUrl(user.first_name, user.last_name)} 
                alt={(user.first_name || '') + ' ' + (user.last_name || '')} 
                className="w-32 h-32 rounded-full object-cover border-4 border-green-200 shadow-lg" 
              />
              <span className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-green-400 border-2 border-white dark:border-dark-900 shadow-md"></span>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="font-extrabold text-3xl text-white mb-2 tracking-tight leading-tight">
                {(user.first_name || 'Unknown')} {(user.last_name || '')}
              </div>
              <span className="inline-block bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200 px-3 py-1 rounded-full text-xs font-semibold mb-4 uppercase tracking-wider shadow-sm">
                {user.role || 'User'}
              </span>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">{services.length}</div>
                  <div className="text-gray-400 text-sm">Services</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">{reviews.length}</div>
                  <div className="text-gray-400 text-sm">Reviews</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">{calculateAverageRating()}</div>
                  <div className="text-gray-400 text-sm">Rating</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </div>
                  <div className="text-gray-400 text-sm">Member Since</div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
                <div className="flex items-center gap-2 text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{user.email || 'No email provided'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    Joined {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        {user.skills && Array.isArray(user.skills) && user.skills.length > 0 && (
          <div className="glass-effect rounded-3xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-green-400" />
              Skills & Expertise
            </h2>
            <div className="flex flex-wrap gap-3">
              {user.skills.map((skill: string, i: number) => (
                <span key={i} className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 px-4 py-2 rounded-full text-sm font-semibold shadow-sm border border-green-200 dark:border-green-800">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Services Section */}
        {services.length > 0 && (
          <div className="glass-effect rounded-3xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-green-400" />
              Services Offered
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div key={service.id} className="bg-white/10 rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
                  <div className="w-full h-32 rounded-lg overflow-hidden mb-4">
                    <img
                      src={getRandomDemoImage(service.id)}
                      alt={service.title || service.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {service.title || service.name || 'Professional Service'}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {service.description || 'Professional service with high quality standards.'}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-green-400 font-semibold">
                      Starting from ₹{service.price || 'N/A'}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {service.category ? service.category.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) : 'General'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <div className="glass-effect rounded-3xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Star className="w-6 h-6 text-green-400" />
              Reviews ({reviews.length})
            </h2>
            <div className="space-y-4">
              {reviews.slice(0, 5).map((review) => (
                <div key={review.id} className="bg-white/10 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <div className="text-white font-semibold">Anonymous User</div>
                        <div className="text-gray-400 text-sm">
                          {review.created_at ? new Date(review.created_at).toLocaleDateString() : 'Recently'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star}
                          className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-300">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Button */}
        <div className="glass-effect rounded-3xl p-8 text-center">
          <button 
            onClick={() => navigate('/messages')}
            className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-bold flex items-center gap-2 mx-auto hover:from-green-700 hover:to-green-600 shadow-lg transition-all duration-300 hover:scale-105"
          >
            <MessageSquare className="w-5 h-5" />
            Contact User
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 
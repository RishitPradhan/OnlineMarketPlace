import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import ServiceCard from '../services/ServiceCard';
import { 
  Plus, 
  Package, 
  TrendingUp, 
  Star, 
  Users, 
  DollarSign,
  ArrowLeft,
  Sparkles,
  Zap,
  Award,
  Target,
  Rocket
} from 'lucide-react';

export default function MyServicesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from('services')
      .select('*')
      .eq('freelancerid', user.id)
      .eq('isactive', true)
      .then(({ data, error }) => {
        setServices(data || []);
        setError(error ? error.message : null);
        setLoading(false);
      });
  }, [user]);

  const getTotalEarnings = () => {
    return services.reduce((sum, service) => sum + (service.price || 0), 0);
  };

  const getAverageRating = () => {
    if (services.length === 0) return 0;
    const totalRating = services.reduce((sum, service) => sum + (service.rating || 0), 0);
    return (totalRating / services.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-950 to-dark-900 flex items-center justify-center">
        <div className="glass-effect neon-border rounded-3xl p-8">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            <span className="text-white text-lg">Loading your services...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-950 to-dark-900 flex items-center justify-center p-4">
        <div className="glass-effect neon-border rounded-3xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Error Loading Services</h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-600 shadow-lg transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 to-dark-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Premium Header */}
        <div className="glass-effect neon-border rounded-3xl p-8 mb-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-3 glass-effect text-gray-400 rounded-xl hover:bg-green-500/10 hover:text-green-400 transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">My Services</h1>
                <p className="text-green-400/80 text-lg">
                  Manage and showcase your professional services
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/services/new')}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-600 shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Service
              </button>
            </div>
          </div>

          {/* Premium Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="glass-effect rounded-2xl p-6 border border-green-500/20 hover:border-green-500/40 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-green-400" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">{services.length}</div>
              <div className="text-gray-400 text-sm">Active Services</div>
            </div>

            <div className="glass-effect rounded-2xl p-6 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-blue-400" />
                </div>
                <Award className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">{getAverageRating()}</div>
              <div className="text-gray-400 text-sm">Average Rating</div>
            </div>

            <div className="glass-effect rounded-2xl p-6 border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-yellow-400" />
                </div>
                <Target className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                {services.reduce((sum, service) => sum + (service.orders_count || 0), 0)}
              </div>
              <div className="text-gray-400 text-sm">Total Orders</div>
            </div>

            <div className="glass-effect rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-purple-400" />
                </div>
                <Rocket className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">₹{getTotalEarnings().toLocaleString()}</div>
              <div className="text-gray-400 text-sm">Total Value</div>
            </div>
          </div>
        </div>

        {/* Services Content */}
        {services.length === 0 ? (
          <div className="glass-effect neon-border rounded-3xl p-12 text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <Sparkles className="w-16 h-16 text-green-400" />
            </div>
            
            <h2 className="text-4xl font-bold text-white mb-6">
              Start Your Service Journey
            </h2>
            
            <p className="text-gray-400 text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
              Create your first service and start earning from your skills. Showcase your expertise, 
              set your prices, and connect with clients worldwide.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
              <div className="glass-effect rounded-2xl p-6 border border-green-500/20 hover:border-green-500/40 transition-all duration-300">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Quick Setup</h3>
                <p className="text-gray-400 text-sm">
                  Create your service in minutes with our intuitive builder
                </p>
              </div>

              <div className="glass-effect rounded-2xl p-6 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Grow Revenue</h3>
                <p className="text-gray-400 text-sm">
                  Start earning immediately with secure payments
                </p>
              </div>

              <div className="glass-effect rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Build Reputation</h3>
                <p className="text-gray-400 text-sm">
                  Get reviews and build your professional brand
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/services/new')}
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-600 shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="w-5 h-5 mr-2 inline" />
                Create Your First Service
              </button>
              <button
                onClick={() => navigate('/browse-services')}
                className="px-8 py-4 border-2 border-green-500/30 text-green-400 font-bold rounded-xl hover:bg-green-500/10 hover:border-green-500/50 transition-all duration-300"
              >
                <Package className="w-5 h-5 mr-2 inline" />
                Explore Services
              </button>
            </div>

            <div className="mt-12 p-6 glass-effect rounded-2xl border border-green-500/20">
              <h3 className="text-xl font-bold text-white mb-4">Why Create Services?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Monetize Your Skills</h4>
                    <p className="text-gray-400 text-sm">Turn your expertise into a profitable business</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Global Reach</h4>
                    <p className="text-gray-400 text-sm">Connect with clients from around the world</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Flexible Schedule</h4>
                    <p className="text-gray-400 text-sm">Work on your own terms and timeline</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Secure Payments</h4>
                    <p className="text-gray-400 text-sm">Get paid safely and on time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Your Services</h2>
              <button
                onClick={() => navigate('/services/new')}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-600 shadow-lg transition-all duration-300"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(service => (
          <ServiceCard
            key={service.id}
            service={service}
            onUpdate={() => {
              setServices(s => s.filter(sv => sv.id !== service.id));
            }}
            isOwner={true}
          />
        ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
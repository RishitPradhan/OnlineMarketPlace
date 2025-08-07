import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ServiceCard from '../services/ServiceCard';
import ServiceForm from '../services/ServiceForm';
import { serviceManagement } from '../../lib/service-management';
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
  Rocket,
  X,
  Briefcase
} from 'lucide-react';

const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [services, setServices] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loadingServices, setLoadingServices] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadServices();
    // eslint-disable-next-line
  }, [user]);

  const loadServices = async () => {
    if (!user) return;
    setLoadingServices(true);
    try {
      const response = await serviceManagement.listServices({ freelancerId: user.id });
      if (response.success) {
        setServices(response.data || []);
      }
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoadingServices(false);
    }
  };

  const handleServiceCreated = async () => {
    setShowAddForm(false);
    await loadServices();
  };

  const getTotalEarnings = () => {
    return services.reduce((sum, service) => sum + (service.price || 0), 0);
  };

  const getAverageRating = () => {
    if (services.length === 0) return 0;
    const totalRating = services.reduce((sum, service) => sum + (service.rating || 0), 0);
    return (totalRating / services.length).toFixed(1);
  };

  if (loading || !user) {
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
                  Create and manage your professional services
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowAddForm(true)}
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

        {/* Service Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass-effect neon-border rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Create New Service</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <ServiceForm
                onSuccess={handleServiceCreated}
                onCancel={() => setShowAddForm(false)}
              />
            </div>
          </div>
        )}

        {/* Services Content */}
        {loadingServices ? (
          <div className="glass-effect neon-border rounded-3xl p-12 text-center">
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              <span className="text-white text-lg">Loading your services...</span>
            </div>
          </div>
        ) : services.length === 0 ? (
          <div className="glass-effect neon-border rounded-3xl p-12 text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <Briefcase className="w-16 h-16 text-green-400" />
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
                onClick={() => setShowAddForm(true)}
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
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-600 shadow-lg transition-all duration-300"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onUpdate={loadServices}
                  isOwner={user.id === service.freelancerId}
                />
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-600 shadow-lg transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2 inline" />
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate('/browse-services')}
            className="px-8 py-3 border-2 border-green-500/30 text-green-400 font-bold rounded-xl hover:bg-green-500/10 hover:border-green-500/50 transition-all duration-300"
          >
            <Package className="w-4 h-4 mr-2 inline" />
            Browse Services
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage; 
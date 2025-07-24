import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ServiceCard from '../services/ServiceCard';
import ServiceForm from '../services/ServiceForm';
import { serviceManagement } from '../../lib/service-management';
import { Button } from '../ui/Button';

const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [services, setServices] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (!user) return;
    loadServices();
    // eslint-disable-next-line
  }, [user]);

  const loadServices = async () => {
    if (!user) return;
    try {
      const response = await serviceManagement.listServices({ freelancerId: user.id });
      if (response.success) {
        setServices(response.data);
      }
    } catch (error) {
      console.error('Error loading services:', error);
    }
  };

  const handleServiceCreated = async () => {
    setShowAddForm(false);
    await loadServices();
  };

  if (loading || !user) {
    return <div className="flex items-center justify-center min-h-screen text-xl text-green-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 to-dark-900">
      <div className="w-full px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">My Services 💼</h1>
          <Button onClick={() => setShowAddForm((v) => !v)}>
            {showAddForm ? 'Cancel' : 'Add New Service'}
          </Button>
        </div>
        {showAddForm && (
          <div className="mb-8 bg-dark-800 rounded-lg p-8">
            <ServiceForm
              onSuccess={handleServiceCreated}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}
        {services.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💼</div>
            <h3 className="text-xl font-semibold text-white mb-2">No Services Yet</h3>
            <p className="text-gray-300 mb-6">Create your first service to start earning</p>
            <Button onClick={() => setShowAddForm(true)}>
              Create Your First Service
            </Button>
          </div>
        ) : (
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
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button
            onClick={() => navigate('/dashboard')}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors duration-200"
          >
            Back to Dashboard
          </Button>
          <Button
            onClick={() => navigate('/quick-start')}
            className="px-8 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-lg font-semibold transition-colors duration-200"
          >
            Quick Start Guide
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage; 
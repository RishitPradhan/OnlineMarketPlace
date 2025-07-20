import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ServicesPage: React.FC = () => {
  console.log('ServicesPage MOUNT');
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const userId = user?.id;
  const LOCAL_KEY = userId ? `servicesData_${userId}` : null;
  const [activeTab, setActiveTab] = useState('create');
  const [newService, setNewService] = useState({
    title: '',
    category: '',
    description: '',
    price: '',
    deliveryTime: '',
    features: ['']
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    if (!LOCAL_KEY) return;
    const data = localStorage.getItem(LOCAL_KEY);
    setServices(data ? JSON.parse(data) : []);
  }, [LOCAL_KEY]);

  if (loading || !userId) {
    return <div className="flex items-center justify-center min-h-screen text-xl text-green-400">Loading...</div>;
  }

  // Debug: log gigs array every render
  console.log('ServicesPage render services:', services);

  const categories = [
    'Web Development',
    'Graphic Design',
    'Mobile Development',
    'Content Writing',
    'Digital Marketing',
    'Video Production',
    'SEO',
    'UI/UX Design'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewService(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    console.log('Service Submit');
    e.preventDefault();
    if (editIndex !== null) {
      const updated = [...services];
      updated[editIndex] = { ...newService };
      setServices(updated);
      if (LOCAL_KEY) {
        localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
      }
      setEditIndex(null);
      setSuccessMsg('Service updated!');
    } else {
      const updated = [
        ...services,
        { ...newService, id: Date.now() }
      ];
      console.log('Updated services:', updated);
      setServices(updated);
      if (LOCAL_KEY) {
        localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
      }
      setSuccessMsg('Service created!');
    }
    setNewService({ title: '', category: '', description: '', price: '', deliveryTime: '', features: [''] });
    setActiveTab('manage');
    setTimeout(() => setSuccessMsg(''), 1500);
  };

  const handleEdit = (idx: number) => {
    setEditIndex(idx);
    setNewService(services[idx]);
    setActiveTab('create');
  };

  const handleDelete = (idx: number) => {
    const updated = services.filter((_: any, i: number) => i !== idx);
    setServices(updated);
    if (LOCAL_KEY) {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
    }
    setSuccessMsg('Service deleted!');
    setTimeout(() => setSuccessMsg(''), 1500);
  };

  const handleReset = () => {
    setNewService({ title: '', category: '', description: '', price: '', deliveryTime: '', features: [''] });
    setEditIndex(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 to-dark-900">
      <div className="w-full px-6 py-8">
        <button
          onClick={() => navigate('/profile-completion')}
          className="mb-6 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow transition-all"
        >
          Profile
        </button>
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            My Services 💼
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Create and manage your service offerings to attract clients and grow your business.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-dark-800 rounded-lg p-1 mb-8">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'create'
                ? 'bg-green-600 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Create New Service
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'manage'
                ? 'bg-green-600 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Manage Services
          </button>
        </div>

        {activeTab === 'create' ? (
          /* Create Service Form */
          <div className="bg-dark-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Create New Service</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Service Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={newService.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
                    placeholder="e.g., Professional Website Development"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Category *</label>
                  <select
                    name="category"
                    value={newService.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-green-500 focus:outline-none"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-medium">Description *</label>
                <textarea
                  name="description"
                  value={newService.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
                  placeholder="Describe your service in detail..."
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    value={newService.price}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
                    placeholder="500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Delivery Time *</label>
                  <input
                    type="text"
                    name="deliveryTime"
                    value={newService.deliveryTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
                    placeholder="e.g., 3-5 days"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('manage')}
                  className="px-6 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                >
                  Create Service
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Manage Services */
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">My Services</h2>
              <button
                onClick={() => setActiveTab('create')}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
              >
                + Create New Service
              </button>
            </div>

            {services.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💼</div>
                <h3 className="text-xl font-semibold text-white mb-2">No Services Yet</h3>
                <p className="text-gray-300 mb-6">Create your first service to start earning</p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                >
                  Create Your First Service
                </button>
              </div>
            ) : (
              <div className="grid gap-6">
                {services.map((service: any, idx: number) => (
                  <div key={service.id} className="bg-dark-800 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
                        <p className="text-gray-300 mb-2">{service.category}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-green-400 font-medium">{service.price}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-400">{service.orders} orders</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-yellow-400">★ {service.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          service.status === 'active' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {service.status}
                        </span>
                        <button 
                          onClick={() => handleEdit(idx)}
                          className="px-4 py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors duration-200"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(idx)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors duration-200"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate('/quick-start')}
            className="px-8 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-lg font-semibold transition-colors duration-200"
          >
            Quick Start Guide
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage; 
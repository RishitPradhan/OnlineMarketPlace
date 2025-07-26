import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderManagement } from '../../lib/order-management';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle, Package } from 'lucide-react';

interface Order {
  id: string;
  serviceId: string;
  clientId: string;
  freelancerId: string;
  status: string;
  requirements: string;
  deliveryDate: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
  service?: any;
  client?: any;
  freelancer?: any;
}

const MyOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'client' | 'freelancer'>('client');

  console.log('MyOrdersPage rendered, user:', user);

  useEffect(() => {
    if (user?.id) {
      loadOrders();
    } else {
      setLoading(false);
      setError('User not authenticated');
    }
  }, [user?.id]);

  const loadOrders = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Loading orders for user:', user.id);
      
      // Try to load as client first
      const clientResult = await orderManagement.listOrders({
        userId: user.id,
        role: 'client'
      });

      console.log('Client orders result:', clientResult);

      if (clientResult.success && clientResult.data && clientResult.data.length > 0) {
        console.log('Found client orders:', clientResult.data);
        setOrders(clientResult.data);
        setUserRole('client');
      } else {
        // Try to load as freelancer
        const freelancerResult = await orderManagement.listOrders({
          userId: user.id,
          role: 'freelancer'
        });

        console.log('Freelancer orders result:', freelancerResult);

        if (freelancerResult.success && freelancerResult.data) {
          console.log('Found freelancer orders:', freelancerResult.data);
          setOrders(freelancerResult.data);
          setUserRole('freelancer');
        } else {
          console.log('No orders found for user');
          setOrders([]);
        }
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'in_progress':
        return <Package className="w-4 h-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'disputed':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'disputed':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">{error}</div>
          <button
            onClick={loadOrders}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">My Orders</h1>
              <p className="text-gray-400">
                {userRole === 'client' ? 'Orders you placed' : 'Orders you received'}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/services')}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Browse Services
          </button>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No orders yet</h3>
            <p className="text-gray-400 mb-6">
              {userRole === 'client' 
                ? "You haven't placed any orders yet." 
                : "You haven't received any orders yet."
              }
            </p>
            <button
              onClick={() => navigate('/services')}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Browse Services
            </button>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-gray-300 font-medium">Order ID</th>
                    <th className="px-6 py-4 text-left text-gray-300 font-medium">Service</th>
                    <th className="px-6 py-4 text-left text-gray-300 font-medium">
                      {userRole === 'client' ? 'Freelancer' : 'Client'}
                    </th>
                    <th className="px-6 py-4 text-left text-gray-300 font-medium">Amount</th>
                    <th className="px-6 py-4 text-left text-gray-300 font-medium">Status</th>
                    <th className="px-6 py-4 text-left text-gray-300 font-medium">Date</th>
                    <th className="px-6 py-4 text-left text-gray-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-750">
                      <td className="px-6 py-4 text-white font-mono text-sm">
                        #{order.id.slice(0, 8)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white font-medium">
                          {order.service?.title || 'Service'}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {order.requirements}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={userRole === 'client' 
                              ? order.freelancer?.avatar || 'https://ui-avatars.com/api/?name=User&background=10b981&color=fff&size=32'
                              : order.client?.avatar || 'https://ui-avatars.com/api/?name=User&background=10b981&color=fff&size=32'
                            }
                            alt="Avatar"
                            className="w-8 h-8 rounded-full"
                          />
                                                     <div>
                             <div className="text-white font-medium">
                               {userRole === 'client'
                                 ? (order.freelancer?.firstName && order.freelancer?.lastName 
                                     ? `${order.freelancer.firstName} ${order.freelancer.lastName}`
                                     : order.freelancer?.name || 'Freelancer')
                                 : (order.client?.firstName && order.client?.lastName 
                                     ? `${order.client.firstName} ${order.client.lastName}`
                                     : order.client?.name || 'Client')
                               }
                             </div>
                           </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-green-400 font-bold">
                        ₹{order.amount}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status.replace('_', ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => navigate(`/orders/${order.id}`)}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage; 
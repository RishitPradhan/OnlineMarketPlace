import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { orderManagement } from '../../lib/order-management';
import { Order, OrderStatus } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Loader2, ArrowLeft, Clock, CheckCircle, XCircle, AlertTriangle, User, Calendar, DollarSign, FileText, Play, Pause, MessageCircle, Download } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (id && user) {
      loadOrder();
    }
  }, [id, user]);

  const loadOrder = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const response = await orderManagement.getOrder(id);
      
      if (response.success && response.data) {
        setOrder(response.data);
      } else {
        setError(response.error || 'Failed to load order');
      }
    } catch (error: any) {
      console.error('Error loading order:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!order) return;

    setUpdating(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const response = await orderManagement.updateOrderStatus(order.id, newStatus);
      if (response.success) {
        await loadOrder(); // Reload the order to get updated data
        const statusMessages: Record<OrderStatus, string> = {
          'pending': 'Order status updated successfully!',
          'in_progress': 'Order accepted! You are now working on this order.',
          'completed': 'Order marked as completed! The client will be notified.',
          'cancelled': 'Order has been cancelled.',
          'disputed': 'Issue reported. Our support team will review the case.'
        };
        setSuccessMessage(statusMessages[newStatus]);
        
        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(null), 5000);
      } else {
        setError(response.error || 'Failed to update order status');
      }
    } catch (error: any) {
      console.error('Error updating order status:', error);
      setError(error.message);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in_progress':
        return <Play className="h-5 w-5 text-blue-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'disputed':
        return <AlertTriangle className="h-5 w-5 text-purple-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-900 text-green-100 border-green-700';
      case 'in_progress':
        return 'bg-blue-900 text-blue-100 border-blue-700';
      case 'pending':
        return 'bg-yellow-900 text-yellow-100 border-yellow-700';
      case 'cancelled':
        return 'bg-red-900 text-red-100 border-red-700';
      case 'disputed':
        return 'bg-purple-900 text-purple-100 border-purple-700';
      default:
        return 'bg-gray-800 text-gray-100 border-gray-600';
    }
  };

  const getStatusDescription = (status: OrderStatus, isClient: boolean, isFreelancer: boolean) => {
    switch (status) {
      case 'pending':
        return isClient 
          ? 'Waiting for freelancer to accept your order'
          : 'You have a new order to review and accept';
      case 'in_progress':
        return isClient
          ? 'Freelancer is working on your order'
          : 'You are currently working on this order';
      case 'completed':
        return isClient
          ? 'Order has been completed by the freelancer'
          : 'You have marked this order as completed';
      case 'cancelled':
        return 'This order has been cancelled';
      case 'disputed':
        return 'This order is under dispute';
      default:
        return '';
    }
  };

  const getProgressSteps = (status: OrderStatus) => {
    const steps = [
      { key: 'pending', label: 'Order Placed', completed: true },
      { key: 'in_progress', label: 'In Progress', completed: ['in_progress', 'completed'].includes(status) },
      { key: 'completed', label: 'Completed', completed: status === 'completed' }
    ];
    return steps;
  };

  if (!user) {
    return (
      <div className="container mx-auto py-8 bg-gray-900 min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Authentication Required</h1>
          <p className="text-gray-300">Please log in to view order details.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 bg-gray-900 min-h-screen">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
          <span className="ml-2 text-gray-300">Loading order details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 bg-gray-900 min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Error Loading Order</h1>
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={() => navigate('/my-orders')} className="bg-gray-700 hover:bg-gray-600 text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto py-8 bg-gray-900 min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Order Not Found</h1>
          <p className="text-gray-300 mb-4">The order you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/my-orders')} className="bg-gray-700 hover:bg-gray-600 text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  const isClient = user.id === order.clientId;
  const isFreelancer = user.id === order.freelancerId;
  const canUpdateStatus = isFreelancer || isClient;

  return (
    <div className="container mx-auto py-8 px-4 bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate('/my-orders')}
            className="flex items-center bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">
              Order #{order.id.slice(0, 8)}
            </h1>
            <p className="text-gray-300">
              {order.service?.title || 'Service Order'}
            </p>
          </div>
        </div>
                <div className="flex items-center space-x-2">
          {getStatusIcon(order.status)}
          <Badge className={`${getStatusColor(order.status)} border`}>
            {order.status.replace('_', ' ')}
          </Badge>
        </div>
      </div>

      {/* Progress Indicator */}
      <Card className="bg-gray-800 border-gray-700 mb-8">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            {getProgressSteps(order.status).map((step, index) => (
              <div key={step.key} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  step.completed 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'bg-gray-700 border-gray-600 text-gray-400'
                }`}>
                  {step.completed ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <span className="text-xs font-medium">{index + 1}</span>
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  step.completed ? 'text-blue-400' : 'text-gray-400'
                }`}>
                  {step.label}
                </span>
                {index < getProgressSteps(order.status).length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    step.completed ? 'bg-blue-600' : 'bg-gray-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Success Message */}
      {successMessage && (
        <Card className="bg-green-900 border-green-700 mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <p className="text-green-200">{successMessage}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Message */}
      {error && (
        <Card className="bg-red-900 border-red-700 mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <p className="text-red-200">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Description */}
      <Card className="bg-gray-800 border-gray-700 mb-8">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            {getStatusIcon(order.status)}
            <div>
              <h3 className="text-white font-medium mb-1">
                Current Status: {order.status.replace('_', ' ')}
              </h3>
              <p className="text-gray-300">
                {getStatusDescription(order.status, isClient, isFreelancer)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Information */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <FileText className="h-5 w-5 mr-2 text-blue-400" />
                Order Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-400">Order ID</label>
                  <p className="text-gray-200 font-mono">{order.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Created</label>
                  <p className="text-gray-200">
                    {format(new Date(order.createdAt), 'PPP')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Amount</label>
                  <p className="text-green-400 font-bold text-lg">₹{order.amount}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Delivery Date</label>
                  <p className="text-gray-200">
                    {order.deliveryDate 
                      ? format(new Date(order.deliveryDate), 'PPP')
                      : 'Not set'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          {order.requirements && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 whitespace-pre-wrap">{order.requirements}</p>
              </CardContent>
            </Card>
          )}

          {/* Service Details */}
          {order.service && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Service Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-400">Service Title</label>
                    <p className="text-gray-200 font-medium">{order.service.title}</p>
                  </div>
                  {order.service.description && (
                    <div>
                      <label className="text-sm font-medium text-gray-400">Description</label>
                      <p className="text-gray-300">{order.service.description}</p>
                    </div>
                  )}
                  {order.service.category && (
                    <div>
                      <label className="text-sm font-medium text-gray-400">Category</label>
                      <p className="text-gray-200">{order.service.category}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* User Information */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <User className="h-5 w-5 mr-2 text-blue-400" />
                {isClient ? 'Freelancer' : 'Client'} Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isClient && order.freelancer ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={order.freelancer.avatar || `https://ui-avatars.com/api/?name=${order.freelancer.firstName}+${order.freelancer.lastName}&background=10b981&color=fff&size=64`}
                      alt="Freelancer Avatar"
                      className="w-12 h-12 rounded-full border-2 border-gray-600"
                    />
                    <div>
                      <p className="text-gray-200 font-medium">
                        {order.freelancer.firstName} {order.freelancer.lastName}
                      </p>
                      <p className="text-gray-400 text-sm">Freelancer</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium text-gray-400">Email</label>
                      <p className="text-gray-200">{order.freelancer.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-400">User ID</label>
                      <p className="text-gray-400 font-mono text-xs">{order.freelancer.id}</p>
                    </div>
                  </div>
                </div>
              ) : isFreelancer && order.client ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={order.client.avatar || `https://ui-avatars.com/api/?name=${order.client.firstName}+${order.client.lastName}&background=3b82f6&color=fff&size=64`}
                      alt="Client Avatar"
                      className="w-12 h-12 rounded-full border-2 border-gray-600"
                    />
                    <div>
                      <p className="text-gray-200 font-medium">
                        {order.client.firstName} {order.client.lastName}
                      </p>
                      <p className="text-gray-400 text-sm">Client</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium text-gray-400">Email</label>
                      <p className="text-gray-200">{order.client.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-400">User ID</label>
                      <p className="text-gray-400 font-mono text-xs">{order.client.id}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-gray-400">User information not available</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status Actions */}
          {canUpdateStatus && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isFreelancer && order.status === 'pending' && (
                  <div className="space-y-2">
                    <Button
                      onClick={() => handleStatusChange('in_progress')}
                      disabled={updating}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      {updating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      <Play className="h-4 w-4 mr-2" />
                      Accept & Start Working
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleStatusChange('cancelled')}
                      disabled={updating}
                      className="w-full border-gray-600 text-gray-200 hover:bg-gray-700"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Decline Order
                    </Button>
                  </div>
                )}

                {isFreelancer && order.status === 'in_progress' && (
                  <div className="space-y-2">
                    <Button
                      onClick={() => handleStatusChange('completed')}
                      disabled={updating}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {updating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Completed
                    </Button>
                    <p className="text-xs text-gray-400 text-center">
                      You are currently working on this order
                    </p>
                  </div>
                )}

                {isClient && order.status === 'in_progress' && (
                  <div className="space-y-2">
                    <div className="bg-blue-900 border border-blue-700 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <Play className="h-4 w-4 text-blue-400" />
                        <span className="text-blue-200 font-medium">Work in Progress</span>
                      </div>
                      <p className="text-blue-300 text-sm">
                        The freelancer is currently working on your order. You'll be notified when it's completed.
                      </p>
                    </div>
                  </div>
                )}

                {isClient && order.status === 'completed' && (
                  <div className="space-y-2">
                    <div className="bg-green-900 border border-green-700 rounded-lg p-3 mb-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-green-200 font-medium">Order Completed!</span>
                      </div>
                      <p className="text-green-300 text-sm">
                        Your order has been completed by the freelancer. Review the work and let us know if you're satisfied.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => handleStatusChange('disputed')}
                      disabled={updating}
                      className="w-full border-red-600 text-red-400 hover:bg-red-900"
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Report Issue
                    </Button>
                  </div>
                )}

                {isFreelancer && order.status === 'completed' && (
                  <div className="bg-green-900 border border-green-700 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-green-200 font-medium">Order Completed</span>
                    </div>
                    <p className="text-green-300 text-sm">
                      You have successfully completed this order. The client will review your work.
                    </p>
                  </div>
                )}

                {order.status === 'pending' && isClient && (
                  <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="h-4 w-4 text-yellow-400" />
                      <span className="text-yellow-200 font-medium">Waiting for Response</span>
                    </div>
                    <p className="text-yellow-300 text-sm">
                      Your order is waiting for the freelancer to accept and start working on it.
                    </p>
                  </div>
                )}

                {order.status === 'pending' && isFreelancer && (
                  <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="h-4 w-4 text-yellow-400" />
                      <span className="text-yellow-200 font-medium">New Order Received</span>
                    </div>
                    <p className="text-yellow-300 text-sm">
                      You have received a new order. Please review the requirements and decide whether to accept it.
                    </p>
                  </div>
                )}

                {order.status === 'cancelled' && (
                  <div className="bg-red-900 border border-red-700 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <XCircle className="h-4 w-4 text-red-400" />
                      <span className="text-red-200 font-medium">Order Cancelled</span>
                    </div>
                    <p className="text-red-300 text-sm">
                      This order has been cancelled and is no longer active.
                    </p>
                  </div>
                )}

                {order.status === 'disputed' && (
                  <div className="bg-purple-900 border border-purple-700 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-purple-400" />
                      <span className="text-purple-200 font-medium">Order Under Dispute</span>
                    </div>
                    <p className="text-purple-300 text-sm">
                      This order is currently under dispute. Our support team will review the case.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 
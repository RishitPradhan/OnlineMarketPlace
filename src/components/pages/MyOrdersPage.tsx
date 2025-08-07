import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderManagement } from '../../lib/order-management';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Package, 
  Search, 
  Filter,
  RefreshCw,
  Eye,
  MessageSquare,
  Star,
  Calendar,
  DollarSign,
  User,
  TrendingUp,
  Award,
  Zap,
  Edit
} from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);
  
  // Review states
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: '',
    name: ''
  });
  const [orderReviews, setOrderReviews] = useState<{[key: string]: any[]}>({});

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
      // Try to load as client first
      const clientResult = await orderManagement.listOrders({
        userId: user.id,
        role: 'client'
      });

      if (clientResult.success && clientResult.data && clientResult.data.length > 0) {
        setOrders(clientResult.data);
        setUserRole('client');
      } else {
        // Try to load as freelancer
        const freelancerResult = await orderManagement.listOrders({
          userId: user.id,
          role: 'freelancer'
        });

        if (freelancerResult.success && freelancerResult.data && freelancerResult.data.length > 0) {
          setOrders(freelancerResult.data);
          setUserRole('freelancer');
        } else {
          setOrders([]);
        }
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'in_progress':
        return <Package className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'in_progress':
        return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20';
      case 'completed':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'cancelled':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Awaiting freelancer to start work';
      case 'in_progress':
        return 'Work is currently in progress';
      case 'completed':
        return 'Order has been completed';
      case 'cancelled':
        return 'Order has been cancelled';
      default:
        return 'Unknown status';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusCount = (status: string) => {
    return orders.filter(order => order.status.toLowerCase() === status.toLowerCase()).length;
  };

  const getTotalEarnings = () => {
    return orders
      .filter(order => order.status === 'completed' && userRole === 'freelancer')
      .reduce((total, order) => total + order.amount, 0);
  };

  const getActiveOrders = () => {
    return orders.filter(order => 
      order.status === 'pending' || order.status === 'in_progress'
    ).length;
  };

  const generateAvatarUrl = (firstName: string | undefined, lastName: string | undefined, role: 'client' | 'freelancer') => {
    const name = `${firstName || 'User'} ${lastName || ''}`.trim();
    const colors = role === 'freelancer' ? ['4F46E5', '7C3AED', 'DC2626', 'EA580C', 'D97706', '059669', '0D9488', '0891B2', '2563EB', '7C2D12'] : ['10B981', '3B82F6', '8B5CF6', 'F59E0B', 'EF4444', '06B6D4', '84CC16', 'F97316', 'EC4899', '6366F1'];
    const color = colors[Math.abs(name.length) % colors.length];
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${color}&color=fff&size=128&font-size=0.4&bold=true`;
  };

  const generateReviewAvatarUrl = (firstName: string | undefined, lastName: string | undefined) => {
    const name = `${firstName || 'User'} ${lastName || ''}`.trim();
    const colors = ['10B981', '3B82F6', '8B5CF6', 'F59E0B', 'EF4444', '06B6D4', '84CC16', 'F97316', 'EC4899', '6366F1'];
    const color = colors[Math.abs(name.length) % colors.length];
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${color}&color=fff&size=128&font-size=0.4&bold=true`;
  };

  const handleSubmitReview = async () => {
    if (!editingReview) return;
    
    setSubmittingReview(true);
    
    try {
      const newReview = {
        order_id: editingReview.orderId,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
        reviewer_id: user?.id,
        reviewed_id: editingReview.reviewedId,
        reviewer_name: reviewForm.name || `${user?.firstName || 'User'} ${user?.lastName || ''}`.trim()
      };

      const { data, error } = await supabase
        .from('reviews')
        .insert([newReview]);

      if (error) {
        console.error('Error submitting review:', error);
        throw new Error('Failed to submit review');
      }

      // Update local state
      const updatedReviews = orderReviews[editingReview.orderId] || [];
      updatedReviews.push({
        ...newReview,
        id: data?.[0]?.id,
        created_at: new Date().toISOString()
      });
      
      setOrderReviews({
        ...orderReviews,
        [editingReview.orderId]: updatedReviews
      });

      // Reset form
      setReviewForm({
        rating: 5,
        comment: '',
        name: ''
      });
      setShowReviewModal(false);
      setEditingReview(null);

    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleLeaveReview = (order: Order) => {
    const reviewedId = userRole === 'client' ? order.freelancerId : order.clientId;
    const reviewedName = userRole === 'client' 
      ? `${order.freelancer?.firstName || 'Freelancer'} ${order.freelancer?.lastName || ''}`.trim()
      : `${order.client?.firstName || 'Client'} ${order.client?.lastName || ''}`.trim();

    setEditingReview({
      orderId: order.id,
      reviewedId,
      reviewedName,
      orderTitle: order.service?.title || 'Service'
    });

    setReviewForm({
      rating: 5,
      comment: '',
      name: `${user?.firstName || 'User'} ${user?.lastName || ''}`.trim()
    });

    setShowReviewModal(true);
  };

  const handleEditReview = (review: any) => {
    setEditingReview({
      orderId: review.order_id,
      reviewedId: review.reviewed_id,
      reviewedName: review.reviewed_name,
      orderTitle: review.order_title || 'Service'
    });

    setReviewForm({
      rating: review.rating,
      comment: review.comment,
      name: review.reviewer_name
    });

    setShowReviewModal(true);
  };

  const handleUpdateReview = async () => {
    if (!editingReview) return;
    
    setSubmittingReview(true);
    
    try {
      const { error } = await supabase
        .from('reviews')
        .update({
          rating: reviewForm.rating,
          comment: reviewForm.comment,
          reviewer_name: reviewForm.name
        })
        .eq('order_id', editingReview.orderId)
        .eq('reviewer_id', user?.id);

      if (error) {
        console.error('Error updating review:', error);
        throw new Error('Failed to update review');
      }

      // Update local state
      const updatedReviews = orderReviews[editingReview.orderId] || [];
      const reviewIndex = updatedReviews.findIndex(r => r.reviewer_id === user?.id);
      
      if (reviewIndex !== -1) {
        updatedReviews[reviewIndex] = {
          ...updatedReviews[reviewIndex],
          rating: reviewForm.rating,
          comment: reviewForm.comment,
          reviewer_name: reviewForm.name
        };
        
        setOrderReviews({
          ...orderReviews,
          [editingReview.orderId]: updatedReviews
        });
      }

      // Reset form
      setReviewForm({
        rating: 5,
        comment: '',
        name: ''
      });
      setShowReviewModal(false);
      setEditingReview(null);

    } catch (error) {
      console.error('Error updating review:', error);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-950 to-dark-900 flex items-center justify-center">
        <div className="glass-effect neon-border rounded-3xl p-8">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            <span className="text-white text-lg">Loading your orders...</span>
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
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Error Loading Orders</h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={loadOrders}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-600 shadow-lg transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.service?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.requirements?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
                <h1 className="text-4xl font-bold text-white mb-2">My Orders</h1>
                <p className="text-green-400/80 text-lg">
                  {userRole === 'client' ? 'Orders you placed' : 'Orders you received'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-600 shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={() => navigate('/browse-services')}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-600 shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Browse Services
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
              <div className="text-3xl font-bold text-white mb-2">{orders.length}</div>
              <div className="text-gray-400 text-sm">Total Orders</div>
            </div>

            <div className="glass-effect rounded-2xl p-6 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-blue-400" />
                </div>
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">{getActiveOrders()}</div>
              <div className="text-gray-400 text-sm">Active Orders</div>
            </div>

            <div className="glass-effect rounded-2xl p-6 border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-yellow-400" />
                </div>
                <Award className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">{getStatusCount('completed')}</div>
              <div className="text-gray-400 text-sm">Completed</div>
            </div>

            <div className="glass-effect rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-purple-400" />
                </div>
                <Star className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">{formatCurrency(getTotalEarnings())}</div>
              <div className="text-gray-400 text-sm">Total Earnings</div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search orders by service or requirements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 glass-effect border border-green-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-3 glass-effect border border-green-500/30 rounded-xl text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300 appearance-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="disputed">Disputed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="glass-effect neon-border rounded-3xl p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-green-400" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">No orders found</h3>
            <p className="text-gray-400 mb-8 text-lg max-w-md mx-auto">
              {orders.length === 0 
                ? (userRole === 'client' 
                    ? "You haven't placed any orders yet. Start by browsing our amazing services!" 
                    : "You haven't received any orders yet. Create services to attract clients!")
                : "No orders match your current filters. Try adjusting your search criteria."
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/browse-services')}
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-600 shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Browse Services
              </button>
              <button
                onClick={handleRefresh}
                className="px-8 py-4 border-2 border-green-500/30 text-green-400 font-bold rounded-xl hover:bg-green-500/10 hover:border-green-500/50 transition-all duration-300"
              >
                Refresh Orders
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="glass-effect neon-border rounded-3xl p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="text-white font-mono text-sm glass-effect px-3 py-1 rounded-lg border border-green-500/20">
                            #{order.id.slice(0, 8)}
                          </div>
                          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {order.status.replace('_', ' ')}
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          {order.service?.title || 'Service Order'}
                        </h3>
                        <p className="text-gray-400 text-sm mb-3">
                          {getStatusDescription(order.status)}
                        </p>
                        <p className="text-gray-300 text-sm line-clamp-2">
                          {order.requirements}
                        </p>
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">Created: {formatDate(order.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">Delivery: {formatDate(order.deliveryDate)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-green-400">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-sm font-semibold">{formatCurrency(order.amount)}</span>
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={userRole === 'client' 
                            ? order.freelancer?.avatar || generateAvatarUrl(order.freelancer?.firstName, order.freelancer?.lastName, 'freelancer')
                            : order.client?.avatar || generateAvatarUrl(order.client?.firstName, order.client?.lastName, 'client')
                          }
                          alt="Avatar"
                          className="w-10 h-10 rounded-full border-2 border-green-500/30 cursor-pointer hover:scale-110 transition-transform duration-200"
                          onClick={() => {
                            if (userRole === 'client' && order.freelancer?.id) {
                              navigate(`/user/${order.freelancer.id}`);
                            }
                          }}
                        />
                        <div>
                          <div className="text-white font-semibold cursor-pointer hover:text-green-400 transition-colors duration-200"
                               onClick={() => {
                                 if (userRole === 'client' && order.freelancer?.id) {
                                   navigate(`/user/${order.freelancer.id}`);
                                 }
                               }}>
                            {userRole === 'client'
                              ? (order.freelancer?.firstName && order.freelancer?.lastName 
                                  ? `${order.freelancer.firstName} ${order.freelancer.lastName}`
                                  : order.freelancer?.name || 'Freelancer')
                              : (order.client?.firstName && order.client?.lastName 
                                  ? `${order.client.firstName} ${order.client.lastName}`
                                  : order.client?.name || 'Client')
                            }
                          </div>
                          <div className="text-gray-400 text-sm">
                            {userRole === 'client' ? 'Freelancer' : 'Client'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Reviews Section */}
                    {order.status === 'completed' && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-white font-semibold">Reviews</h4>
                          <button
                            onClick={() => handleLeaveReview(order)}
                            className="text-sm text-green-400 hover:text-green-300 transition-colors"
                          >
                            + Add Review
                          </button>
                        </div>
                        {orderReviews[order.id] && orderReviews[order.id].length > 0 ? (
                          <div className="space-y-3">
                            {orderReviews[order.id].map((review) => (
                              <div key={review.id} className="glass-effect rounded-lg p-4 border border-green-500/20">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <img 
                                      src={review.avatar} 
                                      alt={review.name} 
                                      className="w-8 h-8 rounded-full object-cover"
                                      onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = generateReviewAvatarUrl(review.name?.split(' ')[0], review.name?.split(' ')[1]);
                                      }}
                                    />
                                    <div>
                                      <div className="text-white font-medium text-sm">{review.name}</div>
                                      <div className="text-gray-400 text-xs">{review.date}</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star 
                                        key={star}
                                        className={`w-3 h-3 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                      />
                                    ))}
                                    {user && review.reviewer_id === user.id && (
                                      <button
                                        onClick={() => handleEditReview(review)}
                                        className="ml-2 p-1 text-gray-500 hover:text-green-600 transition-colors"
                                        title="Edit review"
                                      >
                                        <Edit className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                                <p className="text-gray-300 text-sm">{review.comment}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-gray-400 text-sm text-center py-4">
                            No reviews yet. Be the first to leave a review!
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 lg:items-end">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-400 mb-1">
                        {formatCurrency(order.amount)}
                      </div>
                      <div className="text-gray-400 text-sm">
                        Order Value
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => navigate(`/orders/${order.id}`)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-600 shadow-lg transition-all duration-300 transform hover:scale-105"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </button>
                      <button 
                        onClick={() => navigate('/messages')}
                        className="px-4 py-2 border-2 border-green-500/30 text-green-400 font-semibold rounded-xl hover:bg-green-500/10 hover:border-green-500/50 transition-all duration-300"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message
                      </button>
                      {order.status === 'completed' && (
                        <button 
                          onClick={() => handleLeaveReview(order)}
                          className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-yellow-500 text-white font-semibold rounded-xl hover:from-yellow-700 hover:to-yellow-600 shadow-lg transition-all duration-300 transform hover:scale-105"
                        >
                          <Star className="w-4 h-4 mr-2" />
                          Leave Review
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-effect neon-border rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">
                {editingReview?.id ? 'Edit Review' : 'Leave a Review'}
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
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Rating */}
              <div>
                <label className="block text-white font-semibold mb-3">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                      className={`text-2xl ${star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-400'} hover:text-yellow-400 transition-colors`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-white font-semibold mb-2">Your Name</label>
                <input
                  type="text"
                  value={reviewForm.name}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 glass-effect border border-green-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
                  placeholder="Enter your name"
                />
              </div>

              {/* Comment */}
              <div>
                <label className="block text-white font-semibold mb-2">Review Comment</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 glass-effect border border-green-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300 resize-none"
                  placeholder="Share your experience with this service..."
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <button
                  onClick={editingReview?.id ? handleUpdateReview : handleSubmitReview}
                  disabled={submittingReview}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-600 shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                >
                  {submittingReview ? 'Submitting...' : (editingReview?.id ? 'Update Review' : 'Submit Review')}
                </button>
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
                  className="px-6 py-3 border-2 border-green-500/30 text-green-400 font-bold rounded-xl hover:bg-green-500/10 hover:border-green-500/50 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage; 
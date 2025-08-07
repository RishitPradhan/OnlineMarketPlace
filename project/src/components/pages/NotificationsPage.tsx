import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { notificationService, Notification } from '../../lib/notification-service';
import { 
  Bell, 
  Package, 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign, 
  Star,
  ArrowLeft,
  Trash2,
  Eye,
  Calendar,
  User,
  TrendingUp,
  AlertCircle,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'orders'>('all');

  useEffect(() => {
    if (!user) return;
    
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const data = await notificationService.getNotifications(user.id);
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead(user!.id);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) {
        console.error('Error deleting notification:', error);
        return;
      }

      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order_created':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'order_updated':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'order_completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'order_cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'payment_received':
        return <DollarSign className="w-5 h-5 text-green-500" />;
      case 'review_received':
        return <Star className="w-5 h-5 text-yellow-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'order_created':
        return 'border-blue-500/20 bg-blue-500/10';
      case 'order_updated':
        return 'border-yellow-500/20 bg-yellow-500/10';
      case 'order_completed':
        return 'border-green-500/20 bg-green-500/10';
      case 'order_cancelled':
        return 'border-red-500/20 bg-red-500/10';
      case 'payment_received':
        return 'border-green-500/20 bg-green-500/10';
      case 'review_received':
        return 'border-yellow-500/20 bg-yellow-500/10';
      default:
        return 'border-gray-500/20 bg-gray-500/10';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'orders') return notification.type.includes('order');
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-950 to-dark-900 flex items-center justify-center">
        <div className="glass-effect rounded-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-green-400 text-lg">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 to-dark-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="glass-effect rounded-3xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-3 glass-effect text-gray-400 rounded-xl hover:bg-green-500/10 hover:text-green-400 transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Notifications</h1>
                <p className="text-gray-400">
                  {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all duration-300"
                >
                  Mark All Read
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                filter === 'all' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-dark-800/50 text-gray-400 hover:text-white'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                filter === 'unread' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-dark-800/50 text-gray-400 hover:text-white'
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setFilter('orders')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                filter === 'orders' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-dark-800/50 text-gray-400 hover:text-white'
              }`}
            >
              Orders ({notifications.filter(n => n.type.includes('order')).length})
            </button>
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="glass-effect rounded-3xl p-12 text-center">
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bell className="w-12 h-12 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">No notifications</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              {filter === 'all' 
                ? "You're all caught up! When you receive order updates, payments, or important alerts, they'll show up here."
                : filter === 'unread'
                ? "No unread notifications. You're all caught up!"
                : "No order-related notifications found."
              }
            </p>
            <button
              onClick={() => navigate('/browse-services')}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-bold hover:from-green-700 hover:to-green-600 transition-all duration-300"
            >
              Browse Services
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`glass-effect rounded-2xl p-6 border transition-all duration-300 hover:scale-[1.02] ${
                  notification.read 
                    ? 'border-gray-500/20 bg-dark-800/30' 
                    : `${getNotificationColor(notification.type)} border-2`
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-dark-800/50 flex items-center justify-center flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-white">
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-gray-300 mb-3">{notification.message}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(notification.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(notification.created_at).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all duration-300"
                        title="Mark as read"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteNotification(notification.id)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-300"
                      title="Delete notification"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage; 
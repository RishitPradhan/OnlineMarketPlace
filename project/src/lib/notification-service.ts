import { supabase } from './supabase';

export interface Notification {
  id: string;
  user_id: string;
  type: 'order_created' | 'order_updated' | 'order_completed' | 'order_cancelled' | 'payment_received' | 'review_received';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  created_at: string;
}

export const notificationService = {
  // Create a new notification
  async createNotification(notification: Omit<Notification, 'id' | 'created_at'>): Promise<Notification | null> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([notification])
        .select()
        .single();

      if (error) {
        console.error('Error creating notification:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error creating notification:', error);
      return null;
    }
  },

  // Get notifications for a user
  async getNotifications(userId: string): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notifications:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  },

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) {
        console.error('Error marking notification as read:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  },

  // Mark all notifications as read for a user
  async markAllAsRead(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId);

      if (error) {
        console.error('Error marking all notifications as read:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  },

  // Get unread notification count
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) {
        console.error('Error getting unread count:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  },

  // Create order-related notifications
  async createOrderNotification(order: any, type: 'order_created' | 'order_updated' | 'order_completed' | 'order_cancelled'): Promise<void> {
    const notifications = [];

    // Notification for client
    const clientNotification = {
      user_id: order.clientId,
      type,
      title: this.getNotificationTitle(type, 'client'),
      message: this.getNotificationMessage(type, 'client', order),
      data: { orderId: order.id, order },
      read: false
    };
    notifications.push(clientNotification);

    // Notification for freelancer
    const freelancerNotification = {
      user_id: order.freelancerId,
      type,
      title: this.getNotificationTitle(type, 'freelancer'),
      message: this.getNotificationMessage(type, 'freelancer', order),
      data: { orderId: order.id, order },
      read: false
    };
    notifications.push(freelancerNotification);

    // Create notifications
    for (const notification of notifications) {
      await this.createNotification(notification);
    }
  },

  // Helper methods for notification content
  getNotificationTitle(type: string, role: 'client' | 'freelancer'): string {
    const titles = {
      order_created: {
        client: 'New Order Created',
        freelancer: 'New Order Received'
      },
      order_updated: {
        client: 'Order Updated',
        freelancer: 'Order Updated'
      },
      order_completed: {
        client: 'Order Completed',
        freelancer: 'Order Completed'
      },
      order_cancelled: {
        client: 'Order Cancelled',
        freelancer: 'Order Cancelled'
      }
    };
    return titles[type as keyof typeof titles]?.[role] || 'Notification';
  },

  getNotificationMessage(type: string, role: 'client' | 'freelancer', order: any): string {
    const messages = {
      order_created: {
        client: `Your order for "${order.service?.title || 'Service'}" has been created successfully.`,
        freelancer: `You have received a new order for "${order.service?.title || 'Service'}" from ${order.client?.firstName || 'Client'}.`
      },
      order_updated: {
        client: `Your order for "${order.service?.title || 'Service'}" has been updated.`,
        freelancer: `The order for "${order.service?.title || 'Service'}" has been updated.`
      },
      order_completed: {
        client: `Your order for "${order.service?.title || 'Service'}" has been completed successfully.`,
        freelancer: `You have completed the order for "${order.service?.title || 'Service'}" successfully.`
      },
      order_cancelled: {
        client: `Your order for "${order.service?.title || 'Service'}" has been cancelled.`,
        freelancer: `The order for "${order.service?.title || 'Service'}" has been cancelled.`
      }
    };
    return messages[type as keyof typeof messages]?.[role] || 'You have a new notification.';
  }
}; 
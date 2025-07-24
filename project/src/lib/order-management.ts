import { supabase } from "./supabase";
import type { ApiResponse } from "../types";

export const orderManagement = {
  async createOrder(order: Omit<Order, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Order>> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([{
          ...order,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: this.mapOrderFromDB(data)
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  async updateOrderStatus(id: string, status: OrderStatus): Promise<ApiResponse<Order>> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: this.mapOrderFromDB(data)
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  async getOrder(id: string): Promise<ApiResponse<Order>> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          service:serviceId(*),
          client:clientId(id, firstName, lastName, avatar),
          freelancer:freelancerId(id, firstName, lastName, avatar)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      return {
        success: true,
        data: this.mapOrderFromDB(data)
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  async listOrders(filters: {
    userId: string;
    role: 'client' | 'freelancer';
    status?: OrderStatus;
  }): Promise<ApiResponse<Order[]>> {
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          service:serviceId(*),
          client:clientId(id, firstName, lastName, avatar),
          freelancer:freelancerId(id, firstName, lastName, avatar)
        `);

      if (filters.role === 'client') {
        query = query.eq('clientId', filters.userId);
      } else {
        query = query.eq('freelancerId', filters.userId);
      }

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query;

      if (error) throw error;

      return {
        success: true,
        data: data.map(this.mapOrderFromDB)
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  async getOrderAnalytics(userId: string, role: 'client' | 'freelancer'): Promise<ApiResponse<OrderAnalytics>> {
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('status')
        .or(`clientId.eq.${userId},freelancerId.eq.${userId}`);

      if (error) throw error;

      const analytics: OrderAnalytics = {
        totalOrders: orders.length,
        activeOrders: orders.filter(o => o.status === 'in_progress').length,
        completedOrders: orders.filter(o => o.status === 'completed').length,
        cancelledOrders: orders.filter(o => o.status === 'cancelled').length,
        disputedOrders: orders.filter(o => o.status === 'disputed').length,
        ordersByStatus: [
          { status: 'pending', count: orders.filter(o => o.status === 'pending').length },
          { status: 'in_progress', count: orders.filter(o => o.status === 'in_progress').length },
          { status: 'completed', count: orders.filter(o => o.status === 'completed').length },
          { status: 'cancelled', count: orders.filter(o => o.status === 'cancelled').length },
          { status: 'disputed', count: orders.filter(o => o.status === 'disputed').length }
        ]
      };

      return {
        success: true,
        data: analytics
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  mapOrderFromDB(data: any): Order {
    return {
      id: data.id,
      serviceId: data.serviceId,
      clientId: data.clientId,
      freelancerId: data.freelancerId,
      status: data.status,
      requirements: data.requirements,
      deliveryDate: data.deliveryDate,
      amount: data.amount,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      service: data.service,
      client: data.client,
      freelancer: data.freelancer
    };
  }
};
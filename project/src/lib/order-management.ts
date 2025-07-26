import { supabase } from "./supabase";
import type { ApiResponse, Order, OrderStatus, OrderAnalytics } from "../types";

export const orderManagement = {
  async createOrder(order: Omit<Order, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Order>> {
    try {
      console.log('createOrder called with:', order);
      
      const orderData = {
        serviceid: order.serviceId,
        clientid: order.clientId,
        freelancerid: order.freelancerId,
        amount: order.amount,
        requirements: order.requirements,
        deliverydate: order.deliveryDate,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log('Inserting order data:', orderData);
      
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      console.log('Supabase insert result:', { data, error });

      if (error) throw error;

      const mappedData = this.mapOrderFromDB(data);
      console.log('Mapped order data:', mappedData);

      return {
        success: true,
        data: mappedData
      };
    } catch (error: any) {
      console.error('createOrder error:', error);
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
      // First get the order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

      if (orderError) throw orderError;

      // Get related service
      let serviceData = null;
      if (orderData.serviceid) {
        const { data: service, error: serviceError } = await supabase
          .from('services')
          .select('*')
          .eq('id', orderData.serviceid)
          .single();
        
        if (!serviceError) {
          serviceData = service;
        }
      }

      // Get related client
      let clientData = null;
      if (orderData.clientid) {
        const { data: client, error: clientError } = await supabase
          .from('users')
          .select('id, first_name, last_name, email, avatar')
          .eq('id', orderData.clientid)
          .single();
        
        if (!clientError) {
          clientData = client;
        }
      }

      // Get related freelancer
      let freelancerData = null;
      if (orderData.freelancerid) {
        const { data: freelancer, error: freelancerError } = await supabase
          .from('users')
          .select('id, first_name, last_name, email, avatar')
          .eq('id', orderData.freelancerid)
          .single();
        
        if (!freelancerError) {
          freelancerData = freelancer;
        }
      }

      // Combine all data
      const combinedData = {
        ...orderData,
        service: serviceData,
        client: clientData,
        freelancer: freelancerData
      };

      return {
        success: true,
        data: this.mapOrderFromDB(combinedData)
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
      console.log('listOrders called with filters:', filters);
      
      let query = supabase
        .from('orders')
        .select('*');

      if (filters.role === 'client') {
        query = query.eq('clientid', filters.userId);
      } else {
        query = query.eq('freelancerid', filters.userId);
      }

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query;
      console.log('Supabase query result:', { data, error });

      if (error) throw error;

      const mappedData = data.map(this.mapOrderFromDB);
      console.log('Mapped orders:', mappedData);

      return {
        success: true,
        data: mappedData
      };
    } catch (error: any) {
      console.error('listOrders error:', error);
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
      serviceId: data.serviceid,
      clientId: data.clientid,
      freelancerId: data.freelancerid,
      status: data.status,
      requirements: data.requirements,
      deliveryDate: data.deliverydate,
      amount: data.amount,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      service: data.service ? {
        id: data.service.id,
        title: data.service.title,
        description: data.service.description,
        category: data.service.category,
        price: data.service.price,
        deliveryTime: data.service.deliverytime || 7,
        imageUrl: data.service.imageurl,
        images: data.service.images || [],
        freelancerId: data.service.freelancerid,
        isActive: true, // Assuming active by default
        createdAt: data.service.created_at,
        updatedAt: data.service.updated_at
      } : undefined,
      client: data.client ? {
        id: data.client.id,
        firstName: data.client.first_name,
        lastName: data.client.last_name,
        email: data.client.email,
        avatar: data.client.avatar,
        role: 'client' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } : undefined,
      freelancer: data.freelancer ? {
        id: data.freelancer.id,
        firstName: data.freelancer.first_name,
        lastName: data.freelancer.last_name,
        email: data.freelancer.email,
        avatar: data.freelancer.avatar,
        role: 'freelancer' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } : undefined
    };
  }
};
import { supabase } from "./supabase";
import type { ApiResponse } from "../types";

export const serviceManagement = {
  async createService(service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Service>> {
    try {
      const { data, error } = await supabase
        .from('services')
        .insert([{
          ...service,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: this.mapServiceFromDB(data)
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  async updateService(id: string, updates: Partial<Service>): Promise<ApiResponse<Service>> {
    try {
      const { data, error } = await supabase
        .from('services')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: this.mapServiceFromDB(data)
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  async getService(id: string): Promise<ApiResponse<Service>> {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*, freelancer:freelancerId(id, firstName, lastName, avatar)')
        .eq('id', id)
        .single();

      if (error) throw error;

      return {
        success: true,
        data: this.mapServiceFromDB(data)
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  async listServices(filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    freelancerId?: string;
    searchQuery?: string;
  }): Promise<ApiResponse<Service[]>> {
    try {
      let query = supabase
        .from('services')
        .select('*, freelancer:freelancerId(id, firstName, lastName, avatar)')
        .eq('isActive', true);

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      if (filters?.minPrice) {
        query = query.gte('price', filters.minPrice);
      }

      if (filters?.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }

      if (filters?.freelancerId) {
        query = query.eq('freelancerId', filters.freelancerId);
      }

      if (filters?.searchQuery) {
        query = query.or(`title.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      return {
        success: true,
        data: data.map(this.mapServiceFromDB)
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  async deleteService(id: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return {
        success: true
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  mapServiceFromDB(data: any): Service {
    return {
      id: data.id,
      freelancerId: data.freelancerId,
      title: data.title,
      description: data.description,
      category: data.category,
      price: data.price,
      deliveryTime: data.deliveryTime,
      imageUrl: data.imageUrl,
      tags: data.tags,
      isActive: data.isActive,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }
};
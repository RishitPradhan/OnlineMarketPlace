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
        .select('*')
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
        .select('*')
        .eq('isactive', true);

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
        query = query.eq('freelancerid', filters.freelancerId);
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
    // Robustly parse images
    let images: string[] = [];
    if (Array.isArray(data.images)) {
      images = data.images;
    } else if (typeof data.images === 'string') {
      try {
        const parsed = JSON.parse(data.images);
        if (Array.isArray(parsed)) images = parsed;
      } catch {}
    }
    return {
      id: data.id,
      freelancerId: data.freelancerid, // snake_case
      title: data.title,
      description: data.description,
      category: data.category,
      price: data.price,
      deliveryTime: data.deliverytime, // snake_case
      imageUrl: data.imageurl, // snake_case
      images, // always array
      tags: data.tags,
      isActive: data.isactive, // snake_case
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }
};
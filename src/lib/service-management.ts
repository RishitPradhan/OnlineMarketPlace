import { supabase } from "./supabase";
import type { ApiResponse, Service } from "../types";

export const serviceManagement = {
  async createService(service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Service>> {
    try {
      // Convert camelCase to snake_case for database
      const dbService = {
        title: service.title,
        description: service.description,
        category: service.category,
        price: service.price,
        deliverytime: service.deliveryTime, // camelCase to snake_case
        imageurl: service.imageUrl, // camelCase to snake_case
        images: service.images,
        tags: service.tags,
        freelancerid: service.freelancerId, // camelCase to snake_case
        isactive: service.isActive, // camelCase to snake_case
        plans: service.plans,
        faqs: service.faqs,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('services')
        .insert([dbService])
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
      // Check if this service has uploaded images that should be preserved
      const { data: existingService } = await supabase
        .from('services')
        .select('images_uploaded, original_images')
        .eq('id', id)
        .single();

      // If service has uploaded images, preserve them
      if (existingService?.images_uploaded && existingService?.original_images) {
        // Don't override images if they were uploaded by user
        const { images, imageUrl, ...otherUpdates } = updates;
        updates = otherUpdates;
      }

      // Convert camelCase to snake_case for database
      const dbUpdates: any = {};
      if (updates.title) dbUpdates.title = updates.title;
      if (updates.description) dbUpdates.description = updates.description;
      if (updates.category) dbUpdates.category = updates.category;
      if (updates.price) dbUpdates.price = updates.price;
      if (updates.deliveryTime) dbUpdates.deliverytime = updates.deliveryTime; // camelCase to snake_case
      if (updates.imageUrl) dbUpdates.imageurl = updates.imageUrl; // camelCase to snake_case
      if (updates.images) dbUpdates.images = updates.images;
      if (updates.tags) dbUpdates.tags = updates.tags;
      if (updates.freelancerId) dbUpdates.freelancerid = updates.freelancerId; // camelCase to snake_case
      if (updates.isActive !== undefined) dbUpdates.isactive = updates.isActive; // camelCase to snake_case
      if (updates.plans) dbUpdates.plans = updates.plans;
      if (updates.faqs) dbUpdates.faqs = updates.faqs;
      
      dbUpdates.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('services')
        .update(dbUpdates)
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
        .eq('isactive', true)
        .order('updated_at', { ascending: false }); // Order by most recently updated

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
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      category: data.category,
      price: data.price,
      deliveryTime: data.deliverytime,
      imageUrl: data.image_url || data.imageurl || null, // Support both snake_case and camelCase
      images: data.images || [],
      tags: data.tags || [],
      freelancerId: data.freelancerid,
      isActive: data.isactive,
      plans: data.plans || [],
      faqs: data.faqs || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },

  async uploadServiceImages(serviceId: string, uploadedImages: string[]): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('services')
        .update({
          images: uploadedImages,
          images_uploaded: true,
          original_images: uploadedImages,
          updated_at: new Date().toISOString()
        })
        .eq('id', serviceId);

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
  }
};
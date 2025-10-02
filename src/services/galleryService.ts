import { supabase } from '../lib/supabase';
import type { GalleryItem, GalleryCreate, GalleryUpdate, GalleryLike, GallerySave } from '../types/database';

export class GalleryService {
  // Get all gallery items
  static async getGalleryItems(category?: string, limit?: number): Promise<GalleryItem[]> {
    try {
      let query = supabase
        .from('gallery')
        .select(`
          *,
          profiles (
            id,
            full_name,
            username,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      throw error;
    }
  }

  // Get featured gallery items
  static async getFeaturedGalleryItems(limit = 8): Promise<GalleryItem[]> {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select(`
          *,
          profiles (
            id,
            full_name,
            username,
            avatar_url
          )
        `)
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching featured gallery items:', error);
      throw error;
    }
  }

  // Get gallery item by ID
  static async getGalleryItem(id: string): Promise<GalleryItem | null> {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select(`
          *,
          profiles (
            id,
            full_name,
            username,
            avatar_url
          )
        `)
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching gallery item:', error);
      throw error;
    }
  }

  // Get gallery items by user
  static async getUserGalleryItems(userId: string): Promise<GalleryItem[]> {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select(`
          *,
          profiles (
            id,
            full_name,
            username,
            avatar_url
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching user gallery items:', error);
      throw error;
    }
  }

  // Create gallery item
  static async createGalleryItem(item: GalleryCreate): Promise<GalleryItem> {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .insert(item)
        .select(`
          *,
          profiles (
            id,
            full_name,
            username,
            avatar_url
          )
        `)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error creating gallery item:', error);
      throw error;
    }
  }

  // Update gallery item
  static async updateGalleryItem(id: string, updates: GalleryUpdate): Promise<GalleryItem> {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          profiles (
            id,
            full_name,
            username,
            avatar_url
          )
        `)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error updating gallery item:', error);
      throw error;
    }
  }

  // Delete gallery item
  static async deleteGalleryItem(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      throw error;
    }
  }

  // Like gallery item
  static async likeGalleryItem(userId: string, galleryId: string): Promise<GalleryLike> {
    try {
      const { data, error } = await supabase
        .from('gallery_likes')
        .insert({ user_id: userId, gallery_id: galleryId })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error liking gallery item:', error);
      throw error;
    }
  }

  // Unlike gallery item
  static async unlikeGalleryItem(userId: string, galleryId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('gallery_likes')
        .delete()
        .eq('user_id', userId)
        .eq('gallery_id', galleryId);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error unliking gallery item:', error);
      throw error;
    }
  }

  // Check if user liked gallery item
  static async checkIfUserLiked(userId: string, galleryId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('gallery_likes')
        .select('id')
        .eq('user_id', userId)
        .eq('gallery_id', galleryId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking if user liked gallery item:', error);
      throw error;
    }
  }

  // Save gallery item
  static async saveGalleryItem(userId: string, galleryId: string): Promise<GallerySave> {
    try {
      const { data, error } = await supabase
        .from('gallery_saves')
        .insert({ user_id: userId, gallery_id: galleryId })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error saving gallery item:', error);
      throw error;
    }
  }

  // Unsave gallery item
  static async unsaveGalleryItem(userId: string, galleryId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('gallery_saves')
        .delete()
        .eq('user_id', userId)
        .eq('gallery_id', galleryId);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error unsaving gallery item:', error);
      throw error;
    }
  }

  // Check if user saved gallery item
  static async checkIfUserSaved(userId: string, galleryId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('gallery_saves')
        .select('id')
        .eq('user_id', userId)
        .eq('gallery_id', galleryId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking if user saved gallery item:', error);
      throw error;
    }
  }

  // Get user's saved gallery items
  static async getUserSavedItems(userId: string): Promise<GalleryItem[]> {
    try {
      const { data, error } = await supabase
        .from('gallery_saves')
        .select(`
          gallery (
            *,
            profiles (
              id,
              full_name,
              username,
              avatar_url
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data?.map(item => item.gallery).filter(Boolean) || [];
    } catch (error) {
      console.error('Error fetching user saved gallery items:', error);
      throw error;
    }
  }

  // Search gallery items
  static async searchGalleryItems(query: string, category?: string): Promise<GalleryItem[]> {
    try {
      let searchQuery = supabase
        .from('gallery')
        .select(`
          *,
          profiles (
            id,
            full_name,
            username,
            avatar_url
          )
        `)
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (category) {
        searchQuery = searchQuery.eq('category', category);
      }

      const { data, error } = await searchQuery;

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error searching gallery items:', error);
      throw error;
    }
  }

  // Toggle gallery item featured status (admin only)
  static async toggleFeatured(id: string, featured: boolean): Promise<GalleryItem> {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .update({ featured })
        .eq('id', id)
        .select(`
          *,
          profiles (
            id,
            full_name,
            username,
            avatar_url
          )
        `)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error toggling gallery item featured status:', error);
      throw error;
    }
  }

  // Get gallery items with user interaction status
  static async getGalleryItemsWithUserStatus(
    userId?: string,
    category?: string,
    limit?: number
  ): Promise<(GalleryItem & { isLiked?: boolean; isSaved?: boolean })[]> {
    try {
      const items = await this.getGalleryItems(category, limit);

      if (!userId) {
        return items;
      }

      // Get user likes and saves for these items
      const itemIds = items.map(item => item.id);
      
      const [likesResult, savesResult] = await Promise.all([
        supabase
          .from('gallery_likes')
          .select('gallery_id')
          .eq('user_id', userId)
          .in('gallery_id', itemIds),
        supabase
          .from('gallery_saves')
          .select('gallery_id')
          .eq('user_id', userId)
          .in('gallery_id', itemIds)
      ]);

      const likedIds = new Set(likesResult.data?.map(l => l.gallery_id) || []);
      const savedIds = new Set(savesResult.data?.map(s => s.gallery_id) || []);

      return items.map(item => ({
        ...item,
        isLiked: likedIds.has(item.id),
        isSaved: savedIds.has(item.id)
      }));
    } catch (error) {
      console.error('Error fetching gallery items with user status:', error);
      throw error;
    }
  }
}
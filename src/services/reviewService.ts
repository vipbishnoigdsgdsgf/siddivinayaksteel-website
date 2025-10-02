import { supabase } from '../lib/supabase';
import type { Review, ReviewCreate, ReviewUpdate } from '../types/database';

export class ReviewService {
  // Get all approved reviews
  static async getReviews(limit?: number): Promise<Review[]> {
    try {
      let query = supabase
        .from('reviews')
        .select(`
          *,
          profiles (
            id,
            full_name,
            username,
            avatar_url
          ),
          projects (
            id,
            title,
            category,
            images
          )
        `)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  }

  // Get featured reviews (high ratings)
  static async getFeaturedReviews(limit = 6): Promise<Review[]> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles (
            id,
            full_name,
            username,
            avatar_url
          ),
          projects (
            id,
            title,
            category,
            images
          )
        `)
        .eq('is_approved', true)
        .gte('rating', 4)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching featured reviews:', error);
      throw error;
    }
  }

  // Get review by ID
  static async getReview(id: string): Promise<Review | null> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles (
            id,
            full_name,
            username,
            avatar_url
          ),
          projects (
            id,
            title,
            category,
            images
          )
        `)
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching review:', error);
      throw error;
    }
  }

  // Get reviews for a specific project
  static async getProjectReviews(projectId: string): Promise<Review[]> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles (
            id,
            full_name,
            username,
            avatar_url
          )
        `)
        .eq('project_id', projectId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching project reviews:', error);
      throw error;
    }
  }

  // Get reviews by user
  static async getUserReviews(userId: string): Promise<Review[]> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          projects (
            id,
            title,
            category,
            images
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      throw error;
    }
  }

  // Create review
  static async createReview(review: ReviewCreate): Promise<Review> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert(review)
        .select(`
          *,
          profiles (
            id,
            full_name,
            username,
            avatar_url
          ),
          projects (
            id,
            title,
            category,
            images
          )
        `)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  }

  // Update review
  static async updateReview(id: string, updates: ReviewUpdate): Promise<Review> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          profiles (
            id,
            full_name,
            username,
            avatar_url
          ),
          projects (
            id,
            title,
            category,
            images
          )
        `)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  }

  // Delete review
  static async deleteReview(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  }

  // Approve review (admin only)
  static async approveReview(id: string): Promise<Review> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .update({ is_approved: true })
        .eq('id', id)
        .select(`
          *,
          profiles (
            id,
            full_name,
            username,
            avatar_url
          ),
          projects (
            id,
            title,
            category,
            images
          )
        `)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error approving review:', error);
      throw error;
    }
  }

  // Reject review (admin only)
  static async rejectReview(id: string): Promise<Review> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .update({ is_approved: false })
        .eq('id', id)
        .select(`
          *,
          profiles (
            id,
            full_name,
            username,
            avatar_url
          ),
          projects (
            id,
            title,
            category,
            images
          )
        `)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error rejecting review:', error);
      throw error;
    }
  }

  // Get pending reviews (admin only)
  static async getPendingReviews(): Promise<Review[]> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles (
            id,
            full_name,
            username,
            avatar_url
          ),
          projects (
            id,
            title,
            category,
            images
          )
        `)
        .eq('is_approved', false)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching pending reviews:', error);
      throw error;
    }
  }

  // Get review statistics
  static async getReviewStats(): Promise<{
    totalReviews: number;
    averageRating: number;
    pendingReviews: number;
    ratingDistribution: { [rating: number]: number };
  }> {
    try {
      const [allReviews, pendingResult] = await Promise.all([
        supabase.from('reviews').select('rating, is_approved'),
        supabase.from('reviews').select('id', { count: 'exact' }).eq('is_approved', false)
      ]);

      const reviews = allReviews.data || [];
      const approvedReviews = reviews.filter(r => r.is_approved);
      
      const totalReviews = approvedReviews.length;
      const pendingReviews = pendingResult.count || 0;
      
      const averageRating = totalReviews > 0 
        ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews 
        : 0;

      // Calculate rating distribution
      const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      approvedReviews.forEach(review => {
        if (review.rating >= 1 && review.rating <= 5) {
          ratingDistribution[review.rating]++;
        }
      });

      return {
        totalReviews,
        averageRating: Math.round(averageRating * 100) / 100,
        pendingReviews,
        ratingDistribution
      };
    } catch (error) {
      console.error('Error fetching review stats:', error);
      throw error;
    }
  }

  // Search reviews
  static async searchReviews(query: string): Promise<Review[]> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles (
            id,
            full_name,
            username,
            avatar_url
          ),
          projects (
            id,
            title,
            category,
            images
          )
        `)
        .eq('is_approved', true)
        .or(`comment.ilike.%${query}%,reviewer_name.ilike.%${query}%,project_type.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error searching reviews:', error);
      throw error;
    }
  }

  // Get recent reviews
  static async getRecentReviews(days = 30, limit = 10): Promise<Review[]> {
    try {
      const date = new Date();
      date.setDate(date.getDate() - days);
      const dateString = date.toISOString();

      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles (
            id,
            full_name,
            username,
            avatar_url
          ),
          projects (
            id,
            title,
            category,
            images
          )
        `)
        .eq('is_approved', true)
        .gte('created_at', dateString)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching recent reviews:', error);
      throw error;
    }
  }
}
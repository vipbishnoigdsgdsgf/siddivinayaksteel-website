import { supabase } from '../lib/supabase';
import type { Project, ProjectCreate, ProjectUpdate } from '../types/database';

export class ProjectService {
  // Get all active projects
  static async getProjects(category?: string, limit?: number): Promise<Project[]> {
    try {
      let query = supabase
        .from('projects')
        .select(`
          *,
          profiles (
            id,
            full_name,
            username,
            avatar_url
          )
        `)
        .eq('status', 'active')
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
      console.error('Error fetching projects:', error);
      throw error;
    }
  }

  // Get featured projects
  static async getFeaturedProjects(limit = 6): Promise<Project[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          profiles (
            id,
            full_name,
            username,
            avatar_url
          )
        `)
        .eq('status', 'active')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching featured projects:', error);
      throw error;
    }
  }

  // Get project by ID
  static async getProject(id: string): Promise<Project | null> {
    try {
      const { data, error } = await supabase
        .from('projects')
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
      console.error('Error fetching project:', error);
      throw error;
    }
  }

  // Get projects by user
  static async getUserProjects(userId: string, includeInactive = false): Promise<Project[]> {
    try {
      let query = supabase
        .from('projects')
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

      if (!includeInactive) {
        query = query.eq('status', 'active');
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching user projects:', error);
      throw error;
    }
  }

  // Create project
  static async createProject(project: ProjectCreate): Promise<Project> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert(project)
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
      console.error('Error creating project:', error);
      throw error;
    }
  }

  // Update project
  static async updateProject(id: string, updates: ProjectUpdate): Promise<Project> {
    try {
      const { data, error } = await supabase
        .from('projects')
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
      console.error('Error updating project:', error);
      throw error;
    }
  }

  // Delete project
  static async deleteProject(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }

  // Search projects
  static async searchProjects(query: string, category?: string): Promise<Project[]> {
    try {
      let searchQuery = supabase
        .from('projects')
        .select(`
          *,
          profiles (
            id,
            full_name,
            username,
            avatar_url
          )
        `)
        .eq('status', 'active')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,location.ilike.%${query}%`)
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
      console.error('Error searching projects:', error);
      throw error;
    }
  }

  // Toggle project featured status (admin only)
  static async toggleFeatured(id: string, featured: boolean): Promise<Project> {
    try {
      const { data, error } = await supabase
        .from('projects')
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
      console.error('Error toggling project featured status:', error);
      throw error;
    }
  }

  // Get projects by category with counts
  static async getProjectCategories(): Promise<{ category: string; count: number }[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('category')
        .eq('status', 'active');

      if (error) {
        throw error;
      }

      // Count projects by category
      const categoryMap = new Map<string, number>();
      data?.forEach((project) => {
        if (project.category) {
          categoryMap.set(project.category, (categoryMap.get(project.category) || 0) + 1);
        }
      });

      return Array.from(categoryMap.entries()).map(([category, count]) => ({
        category,
        count,
      }));
    } catch (error) {
      console.error('Error fetching project categories:', error);
      throw error;
    }
  }
}
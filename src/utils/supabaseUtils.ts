
import { supabase } from "../lib/supabase";
import { PostgrestError } from '@supabase/supabase-js';
import { TABLE_NAMES } from '../types/database';

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY";

// ✅ Named export (important!)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
//

Define better return types for our wrapper functions
export type TableNames = typeof TABLE_NAMES[keyof typeof TABLE_NAMES];

// Create a generic type that works with any data shape
export type AnyData = Record<string, any>;

// Enhanced response type with better error handling
export interface SupabaseResponse<T = any> {
  data: T | null;
  error: PostgrestError | Error | null;
}

// UUID validation utility
const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// Error handler that provides better context
const handleSupabaseError = (error: any, operation: string, table?: string): Error => {
  if (error?.code === 'PGRST116') {
    return new Error(`No rows found in ${table} table for ${operation}`);
  }
  
  if (error?.code === 'PGRST106') {
    return new Error(`Column not found in ${table} table. Check your column names.`);
  }
  
  if (error?.message?.includes('406')) {
    return new Error(`API format error: ${error.message}. Ensure proper Accept headers.`);
  }
  
  if (error?.message?.includes('uuid')) {
    return new Error(`Invalid UUID format: ${error.message}`);
  }
  
  return error instanceof Error ? error : new Error(`${operation} failed: ${error?.message || 'Unknown error'}`);
};

// Enhanced generic wrapper functions for Supabase operations
export const safeSelect = <T extends TableNames>(table: T) => {
  const query = supabase.from(table);
  
  // Override the original select method to add proper headers
  const originalSelect = query.select.bind(query);
  query.select = (columns?: string) => {
    const selectQuery = originalSelect(columns);
    
    // Ensure proper headers are set for the request
    selectQuery.headers = {
      ...selectQuery.headers,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    
    return selectQuery;
  };
  
  return query;
};

// Enhanced insertion with better error handling and validation
export const safeInsert = async <T extends TableNames>(
  table: T,
  data: any,
  options?: { onConflict?: string; returning?: string }
): Promise<SupabaseResponse> => {
  try {
    // Validate UUIDs if present
    if (data.id && typeof data.id === 'string' && !isValidUUID(data.id)) {
      throw new Error(`Invalid UUID format for id: ${data.id}`);
    }
    
    if (data.user_id && typeof data.user_id === 'string' && !isValidUUID(data.user_id)) {
      throw new Error(`Invalid UUID format for user_id: ${data.user_id}`);
    }
    
    const query = supabase.from(table).insert(data);
    
    if (options?.onConflict) {
      // @ts-ignore - onConflict might not be typed properly
      query.onConflict?.(options.onConflict);
    }
    
    const { data: result, error } = await query;
    
    if (error) {
      throw handleSupabaseError(error, 'insert', table);
    }
    
    return { data: result, error: null };
  } catch (error) {
    return { data: null, error: handleSupabaseError(error, 'insert', table) };
  }
};

// Enhanced delete with better error handling
export const safeDelete = async <T extends TableNames>(
  table: T,
  conditions: { column: string; value: any }[]
): Promise<SupabaseResponse> => {
  try {
    let query = supabase.from(table).delete();
    
    // Apply conditions
    conditions.forEach(({ column, value }) => {
      if (column.includes('id') && typeof value === 'string' && !isValidUUID(value)) {
        throw new Error(`Invalid UUID format for ${column}: ${value}`);
      }
      query = query.eq(column, value);
    });
    
    const { data, error } = await query;
    
    if (error) {
      throw handleSupabaseError(error, 'delete', table);
    }
    
    return { data, error: null };
  } catch (error) {
    return { data: null, error: handleSupabaseError(error, 'delete', table) };
  }
};

// Enhanced update with better error handling and validation
export const safeUpdate = async <T extends TableNames>(
  table: T,
  data: any,
  conditions: { column: string; value: any }[]
): Promise<SupabaseResponse> => {
  try {
    // Validate UUIDs in update data
    Object.keys(data).forEach(key => {
      if (key.includes('id') && typeof data[key] === 'string' && !isValidUUID(data[key])) {
        throw new Error(`Invalid UUID format for ${key}: ${data[key]}`);
      }
    });
    
    let query = supabase.from(table).update(data);
    
    // Apply conditions
    conditions.forEach(({ column, value }) => {
      if (column.includes('id') && typeof value === 'string' && !isValidUUID(value)) {
        throw new Error(`Invalid UUID format for ${column}: ${value}`);
      }
      query = query.eq(column, value);
    });
    
    const { data: result, error } = await query;
    
    if (error) {
      throw handleSupabaseError(error, 'update', table);
    }
    
    return { data: result, error: null };
  } catch (error) {
    return { data: null, error: handleSupabaseError(error, 'update', table) };
  }
};

// Enhanced helper for fetching user profile with better error handling
export const fetchUserProfile = async (userId: string): Promise<SupabaseResponse> => {
  try {
    // Validate UUID format
    if (!isValidUUID(userId)) {
      throw new Error(`Invalid UUID format for user ID: ${userId}`);
    }
    
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle(); // Use maybeSingle instead of single to handle no results gracefully
      
    if (error) {
      throw handleSupabaseError(error, 'fetch profile', 'profiles');
    }
    
    return { data, error: null };
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    return { data: null, error: handleSupabaseError(error, 'fetch profile', 'profiles') };
  }
};

// New helper for creating or updating profiles with proper error handling
export const upsertUserProfile = async (profileData: {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  location?: string;
  phone?: string;
}): Promise<SupabaseResponse> => {
  try {
    // Validate UUID
    if (!isValidUUID(profileData.id)) {
      throw new Error(`Invalid UUID format for profile ID: ${profileData.id}`);
    }
    
    const { data, error } = await supabase
      .from("profiles")
      .upsert(profileData, {
        onConflict: 'id',
        ignoreDuplicates: false,
      })
      .select()
      .single();
      
    if (error) {
      throw handleSupabaseError(error, 'upsert profile', 'profiles');
    }
    
    return { data, error: null };
  } catch (error: any) {
    console.error('Error upserting profile:', error);
    return { data: null, error: handleSupabaseError(error, 'upsert profile', 'profiles') };
  }
};

// Helper to check if a profile exists
export const checkProfileExists = async (userId: string): Promise<boolean> => {
  try {
    if (!isValidUUID(userId)) {
      return false;
    }
    
    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .maybeSingle();
      
    return !error && !!data;
  } catch (error) {
    console.error('Error checking profile existence:', error);
    return false;
  }
};

// Upload image to Supabase Storage
export const uploadImage = async (file: File, path: string) => {
  try {
    const { data, error } = await supabase.storage
      .from('images')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;
    
    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from('images')
      .getPublicUrl(path);

    return { data: publicUrlData.publicUrl, error: null };
  } catch (error: any) {
    console.error('Error uploading image:', error);
    return { data: null, error };
  }
};

// Delete image from storage
export const deleteImage = async (path: string) => {
  try {
    const { error } = await supabase.storage
      .from('images')
      .remove([path]);
      
    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    console.error('Error deleting image:', error);
    return { error };
  }
};

// Type definitions for common data structures used with the safe functions
// These are not used in the functions above, but provided for reference
// when working with the specific tables
export interface ProjectInsertData {
  title: string;
  category?: string;
  description?: string;
  user_id?: string;
  images?: string[];
}

export interface ReviewInsertData {
  user_id?: string;
  project_id?: string;
  rating: number;
  comment?: string;
  reviewer_name?: string;
  reviewer_email?: string;
  anonymous_name?: string;
  anonymous_email?: string;
  project_type?: string;
  is_approved?: boolean;
}

export interface LikeInsertData {
  user_id: string;
  gallery_id: string;
}

export interface SavedProjectInsertData {
  user_id: string;
  gallery_id: string;
}

export interface CommentInsertData {
  user_id?: string;
  project_id?: string;
  message: string;
}

export interface MeetingRegistrationInsertData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  message?: string;
  status?: string;
  meeting_id?: string;
  project_id?: string;
}

export interface AdminNotificationInsertData {
  type: string;
  message: string;
  details?: Json;
  recipient_emails?: string[];
  read?: boolean;
}

// Gallery types
export interface GalleryItemInsertData {
  title: string;
  description?: string;
  category?: string;
  image_url: string;
  images?: string[];
  user_id?: string;
}

export interface GalleryLikeInsertData {
  user_id: string;
  gallery_id: string;
}

export interface GallerySaveInsertData {
  user_id: string;
  gallery_id: string;
}

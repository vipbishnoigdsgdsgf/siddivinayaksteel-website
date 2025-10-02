// 🚀 FRESH SUPABASE CLIENT - CLEAN SLATE
// New backend system with proper configuration

import { createClient } from '@supabase/supabase-js';

// New Supabase project credentials
const SUPABASE_URL = 'https://fcakzjucizdbjjbuelms.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjYWt6anVjaXpkYmpqYnVlbG1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5NzE5NTQsImV4cCI6MjA3NDU0Nzk1NH0.jmfmSJZn4OYijjjJ_XXCH5sqbuRLVaS0dZALiG-wcE8';

// Create the Supabase client with optimal configuration
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'ganesh-steel-auth',
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'X-Client-Info': 'ganesh-steel-works@1.0.0',
    },
  },
});

// Project configuration
export const SUPABASE_CONFIG = {
  url: SUPABASE_URL,
  anonKey: SUPABASE_ANON_KEY,
  serviceRoleKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjYWt6anVjaXpkYmpqYnVlbG1zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODk3MTk1NCwiZXhwIjoyMDc0NTQ3OTU0fQ.Ue0H_yJE-G1fgrtcyuizJ5L3uavtNqlbHSgtHNh0ehU',
  projectId: 'fcakzjucizdbjjbuelms',
  publishableKey: 'sb_publishable_DkJzpvLcxHYvY4ocHp8GOw_1CARpxV8',
};

// Database table names - centralized for easy maintenance
export const TABLES = {
  PROFILES: 'profiles',
  PROJECTS: 'projects', 
  REVIEWS: 'reviews',
  GALLERY: 'gallery',
  MEETINGS: 'meetings',
  MEETING_REGISTRATIONS: 'meeting_registrations',
  NOTIFICATIONS: 'notifications',
} as const;

// Storage buckets
export const BUCKETS = {
  AVATARS: 'avatars',
  IMAGES: 'images',
  DOCUMENTS: 'documents',
} as const;

// Helper function to check if client is properly initialized
export const isSupabaseReady = (): boolean => {
  return !!(supabase && SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey);
};

// Helper to get authenticated user
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Helper to get current session
export const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Error getting current session:', error);
    return null;
  }
};

console.log('🚀 Fresh Supabase client initialized:', {
  url: SUPABASE_CONFIG.url,
  projectId: SUPABASE_CONFIG.projectId,
  ready: isSupabaseReady(),
});
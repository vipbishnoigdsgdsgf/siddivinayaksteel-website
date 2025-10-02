
import { supabase } from '../lib/supabase';

/**
 * Safely initializes authentication by getting the current session
 * Returns the session or null on error
 */
export const initializeAuth = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Error initializing auth:", error);
      return null;
    }
    return data.session;
  } catch (error) {
    console.error("Unexpected error initializing auth:", error);
    return null;
  }
};

/**
 * Helper to safely fetch a user's profile data
 */
export const fetchUserProfile = async (userId: string) => {
  try {
    if (!userId) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Unexpected error fetching profile:", error);
    return null;
  }
};

/**
 * Helper function to safely handle auth state changes
 * Now the callback doesn't return anything (void)
 */
export const setupAuthListener = () => {
  try {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      // No return value needed
    });
    
    return data;
  } catch (error) {
    console.error("Error setting up auth listener:", error);
    return { 
      subscription: { unsubscribe: () => {} } 
    };
  }
};

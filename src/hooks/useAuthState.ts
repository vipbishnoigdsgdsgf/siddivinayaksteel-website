
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Profile } from '@/types/auth';
import { fetchUserProfile } from '@/utils/supabaseUtils';
import { initializeAuth, setupAuthListener } from '@/utils/authUtils';

export function useAuthState() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Set up auth listener directly without using setupAuthListener helper
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;
      
      console.log("Auth state changed in subscription:", event);
      
      setSession(session);
      setUser(session?.user ?? null);
        
      if (session?.user) {
        // Use setTimeout to break the synchronous execution chain
        setTimeout(() => {
          if (isMounted) {
            fetchUserProfileData(session.user.id);
          }
        }, 0);
      } else {
        if (isMounted) {
          setProfile(null);
          setIsLoading(false);
        }
      }
    });
    
    // Then check for existing session
    const checkSession = async () => {
      try {
        const session = await initializeAuth();
        
        if (!isMounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          fetchUserProfileData(session.user.id);
        } else {
          setIsLoading(false);
        }
      } catch (err) {
        if (!isMounted) return;
        
        console.error('Error checking session:', err);
        setError(err as Error);
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfileData = async (userId: string) => {
    try {
      const { data, error } = await fetchUserProfile(userId);
      
      if (error) {
        console.error('Error fetching profile:', error);
        setIsLoading(false);
        return;
      }
      
      console.log("Profile data retrieved:", data);
      if (data) {
        setProfile(data as Profile);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setIsLoading(false);
    }
  };

  return { session, user, profile, isLoading, error, setProfile };
}


import { createContext, useState, useEffect, useContext } from 'react';
import {
  Session,
  User,
  AuthError,
} from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { ProfileService } from '../services/profileService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signInWithPhone: (phone: string) => Promise<any>;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  updateUserPassword: (password: string) => Promise<any>;
  setProfile: (profile: any) => void;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<any>; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<{
    session: Session | null;
    user: User | null;
    profile: any | null;
    isLoading: boolean;
    profileFetched: boolean;
  }>({
    session: null,
    user: null,
    profile: null,
    isLoading: true,
    profileFetched: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    
    // Wrap the auth initialization in a try-catch to prevent blank screens
    try {
      // First, set up auth state change listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!mounted) return;
        
        console.log("Auth state changed:", event, session?.user?.id);
        
        // Update session and user state
        setState(prev => ({ 
          ...prev, 
          session: session, 
          user: session?.user ?? null,
          profileFetched: false // Reset profile fetch status
        }));
        
        // Only fetch profile if we have a user and haven't fetched yet
        if (session?.user && !state.profileFetched) {
          fetchProfile(session.user.id);
        } else if (!session?.user) {
          setState(prev => ({ ...prev, profile: null, isLoading: false, profileFetched: false }));
        }
      });

      // Then check for existing session
      const initializeAuth = async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (!mounted) return;
          
          setState(prev => ({ 
            ...prev, 
            session: session, 
            user: session?.user ?? null,
            profileFetched: false
          }));
          
          if (session?.user) {
            fetchProfile(session.user.id);
          } else {
            setState(prev => ({ ...prev, isLoading: false }));
          }
        } catch (error) {
          console.error("Error initializing auth:", error);
          if (mounted) {
            setState(prev => ({ ...prev, isLoading: false }));
          }
        }
      };
      
      initializeAuth();
      
      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    } catch (error) {
      console.error("Critical error in AuthProvider:", error);
      if (mounted) {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    }
  }, []); // Remove state.profileFetched from dependencies to prevent infinite loops

  const fetchProfile = async (userId: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const profile = await ProfileService.getProfile(userId);

      setState(prev => ({ 
        ...prev, 
        profile, 
        isLoading: false, 
        profileFetched: true 
      }));
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      // Don't show error toast for profile fetch failures during auth - normal for new users
      setState(prev => ({ 
        ...prev, 
        profile: null,
        isLoading: false, 
        profileFetched: true 
      }));
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success('Login successful!');
      navigate('/profile');
      return { data, error: null };
    } catch (error: any) {
      console.error("Login failed:", error);
      return { data: null, error };
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const signup = async (email: string, password: string, userData: any) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: userData,
          emailRedirectTo: `${window.location.origin}/email-confirmation`,
        }
      });

      if (error) throw error;

      // Create the profile immediately after signup using our new ProfileService
      if (data.user?.id) {
        try {
          const profileData = {
            id: data.user.id,
            username: userData.username || undefined,
            full_name: userData.full_name || undefined,
            avatar_url: userData.avatar_url || undefined,
            phone: userData.phone || undefined,
            location: userData.location || undefined,
          };

          const profileResult = await ProfileService.upsertProfile(profileData);
          
          console.log('Profile created successfully:', profileResult);
          toast.success('Signup successful! Profile created.');
          
          // Update the state with the new profile
          setState(prev => ({ 
            ...prev, 
            profile: profileResult, 
            profileFetched: true 
          }));
        } catch (profileError: any) {
          console.error("Error creating profile:", profileError);
          toast.error("Account created but failed to create profile");
        }
      }

      toast.success('Signup successful! Check your email to verify.');
      return { data, error: null };
    } catch (error: any) {
      console.error("Signup failed:", error);
      return { data: null, error };
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const logout = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      await supabase.auth.signOut();
      toast.success('Logout successful!');
      navigate('/');
    } catch (error: any) {
      console.error("Logout failed:", error);
      toast.error(error.message || 'Logout failed');
    } finally {
      setState(prev => ({ ...prev, isLoading: false, user: null, profile: null }));
    }
  };

  const updatePassword = async (password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const { data, error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success('Password updated successfully!');
      return { data, error: null };
    } catch (error: any) {
      console.error("Password update failed:", error);
      return { data: null, error };
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Add resetPassword method
  const resetPassword = async (email: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error("Password reset failed:", error);
      return { data: null, error };
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Added signInWithGoogle and signInWithPhone implementations
  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error("Google sign in error:", error);
      return { data: null, error };
    }
  };

  const signInWithPhone = async (phone: string) => {
    try {
      // Check if phone number is in E.164 format
      if (!phone.startsWith('+')) {
        throw new Error('Phone number must be in E.164 format (e.g., +919876543210)');
      }
      
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: phone,
      });
      
      if (error) {
        // Handle specific Twilio configuration errors
        if (error.message.includes('sms_send_failed') || 
            error.message.includes('SMS') ||
            error.message.includes('Twilio') ||
            error.message.includes('20404') ||
            error.message.includes('requested resource') ||
            error.message.includes('not found')) {
          throw new Error('SMS service is temporarily unavailable due to configuration issues. Please use email login or contact support.');
        }
        
        // Handle other common SMS errors
        if (error.message.includes('Phone number')) {
          throw new Error('Invalid phone number format. Please check and try again.');
        }
        
        if (error.message.includes('rate limit')) {
          throw new Error('Too many attempts. Please wait a few minutes before trying again.');
        }
        
        throw error;
      }
      
      return { data, error: null };
    } catch (error: any) {
      console.error("Phone sign in error:", error);
      return { data: null, error };
    }
  };

  const value = {
    user: state.user,
    profile: state.profile,
    isLoading: state.isLoading,
    login: login,
    logout: logout,
    signIn: login,
    signInWithGoogle: signInWithGoogle,
    signInWithPhone: signInWithPhone,
    signUp: signup,
    updateUserPassword: updatePassword,
    setProfile: (profile: any) => {
      setState(prev => ({ ...prev, profile }));
    },
    signOut: logout,
    resetPassword: resetPassword,
  };

  // Important: Render a simple loading state instead of null
  // This prevents blank screens during initialization
  if (state.isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-dark-100">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-steel border-t-transparent"></div>
          <p className="text-steel font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

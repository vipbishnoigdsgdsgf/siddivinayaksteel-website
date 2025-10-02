
import { supabase } from '../lib/supabase';
import { Profile } from '@/types/auth';
import { safeUpdate } from '@/utils/supabaseUtils';
import { toast } from "sonner"; 

export function useAuthMethods() {
  // We'll solely use the sonner toast for consistency
  
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Login error:", error.message);
        toast.error("Login failed", {
          description: error.message,
        });
        return { error };
      }
      
      toast.success("Login successful", {
        description: "Welcome back!",
      });
      return { error: null };
    } catch (error) {
      console.error("Unexpected login error:", error);
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string, phone: string) => {
    try {
      console.log("Signing up user:", { email, fullName, phone });
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
          },
          emailRedirectTo: `${window.location.origin}/email-confirmation`,
        }
      });
      
      if (error) {
        toast.error("Registration failed", {
          description: error.message,
        });
        return { error };
      }
      
      toast.success("Registration successful", {
        description: "Please check your email to verify your account.",
      });
      return { error: null };
    } catch (error) {
      console.error("Unexpected registration error:", error);
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out", {
        description: "You have been successfully logged out",
      });
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      console.log("Updating profile with:", updates);
      
      if (!updates.id) {
        console.error("No user ID provided for profile update");
        toast.error("Update failed", {
          description: "User ID is required for profile updates",
        });
        return { error: new Error("User ID is required") };
      }
      
      const { error } = await safeUpdate("profiles", updates)
        .eq("id", updates.id);
        
      if (error) {
        console.error("Profile update error:", error);
        toast.error("Update failed", {
          description: error.message,
        });
        return { error };
      }
      
      toast.success("Profile updated", {
        description: "Your profile has been successfully updated",
      });
      return { error: null };
    } catch (error) {
      console.error("Unexpected profile update error:", error);
      return { error: error as Error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error("Google sign in error:", error);
      return { error: error as Error };
    }
  };

  const signInWithPhone = async (phoneNumber: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
      });
      
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error("Phone sign in error:", error);
      return { error: error as Error };
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    updateProfile,
    signInWithGoogle,
    signInWithPhone,
  };
}

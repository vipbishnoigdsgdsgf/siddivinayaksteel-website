
import { supabase } from "../lib/supabase";
import { safeSelect, safeUpdate } from "@/utils/supabaseUtils";

// Function to check if a user has admin access
export async function isAdmin(email: string): Promise<boolean> {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  // Admin emails list - Only these specific emails have admin access
  const adminEmails = [
    'omprkashbishnoi2000@gmail.com',  // Primary Admin/Owner
    'vipbishnoi47@gmail.com',         // Additional Admin
    'ramubishnoi47@gmail.com',        // Additional Admin  
    'admin@siddivinayakasteel.shop'   // Business Admin Email
  ];
  
  // Normalize email and check against admin list
  const normalizedEmail = email.toLowerCase().trim();
  
  // Additional security: Check if user exists in Supabase auth
  try {
    const { data, error } = await supabase.auth.admin.getUserByEmail(normalizedEmail);
    if (error || !data.user) {
      console.warn(`Admin check failed - user not found: ${normalizedEmail}`);
      return false;
    }
  } catch (error) {
    console.warn('Admin check - auth verification failed:', error);
    // Continue with email check even if auth check fails
  }
  
  // Return true if the email is in the admin list
  const isAuthorized = adminEmails.some(adminEmail => 
    adminEmail.toLowerCase() === normalizedEmail
  );
  
  if (isAuthorized) {
    console.log(`✅ Admin access granted for: ${normalizedEmail}`);
  } else {
    console.warn(`❌ Admin access denied for: ${normalizedEmail}`);
  }
  
  return isAuthorized;
}

// Function to check if a given user has admin access based on user object
export async function checkAdminStatus(user: any): Promise<boolean> {
  if (!user || !user.email) return false;
  return isAdmin(user.email);
}

// Function to get meeting registrations from the database
export async function getMeetingRegistrations() {
  try {
    // Using safeSelect to avoid TypeScript errors
    const { data, error } = await safeSelect("meeting_registrations")
      .select(`
        *,
        projects(title), 
        meetings(title, date, time),
        profiles(full_name, avatar_url)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching meeting registrations:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Error in getMeetingRegistrations:', err);
    return [];
  }
}

// Function to update meeting registration status
export async function updateRegistrationStatus(id: string, status: string) {
  try {
    // Using safeUpdate to avoid TypeScript errors
    const { error } = await safeUpdate("meeting_registrations", { status })
      .eq('id', id);

    if (error) {
      console.error('Error updating meeting registration status:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error in updateRegistrationStatus:', err);
    return false;
  }
}

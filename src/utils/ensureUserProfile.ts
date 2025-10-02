import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export async function ensureUserProfile(currentUser?: any) {
  if (!currentUser) {
    const { data: { user } } = await supabase.auth.getUser();
    currentUser = user;
  }
  
  if (!currentUser) {
    console.log('No current user found');
    return null;
  }

  try {
    console.log('🔍 Checking if user profile exists for:', currentUser.email);
    
    // Check if user profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', currentUser.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 is "not found" error, anything else is a real problem
      console.error('Error checking profile:', checkError);
      return null;
    }

    if (existingProfile) {
      console.log('✅ User profile already exists');
      return existingProfile;
    }

    // Create profile if it doesn't exist
    console.log('➕ Creating user profile...');
    const newProfile = {
      id: currentUser.id,
      email: currentUser.email,
      full_name: currentUser.user_metadata?.full_name || 
                currentUser.user_metadata?.name || 
                null,
      username: currentUser.user_metadata?.username || 
               currentUser.user_metadata?.preferred_username || 
               currentUser.email?.split('@')[0] || 
               null,
      avatar_url: currentUser.user_metadata?.avatar_url || 
                 currentUser.user_metadata?.picture || 
                 null,
      created_at: currentUser.created_at || new Date().toISOString(),
      is_active: true,
      phone: currentUser.user_metadata?.phone || null,
      location: currentUser.user_metadata?.location || null
    };

    const { data: createdProfile, error: createError } = await supabase
      .from('profiles')
      .insert(newProfile)
      .select()
      .single();

    if (createError) {
      console.error('Error creating profile:', createError);
      toast.error('Failed to create user profile');
      return null;
    }

    console.log('✅ User profile created successfully');
    toast.success('User profile created!');
    return createdProfile;

  } catch (error) {
    console.error('Error in ensureUserProfile:', error);
    return null;
  }
}

export async function ensureAllUsersHaveProfiles() {
  try {
    console.log('🔄 Ensuring all users have profiles...');
    
    // This requires admin privileges, might not work
    const { data: authUsers, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.log('Cannot access auth users (admin required):', error.message);
      return;
    }

    if (!authUsers?.users || authUsers.users.length === 0) {
      console.log('No auth users found');
      return;
    }

    console.log(`Found ${authUsers.users.length} auth users`);
    
    // Get existing profiles
    const { data: existingProfiles } = await supabase
      .from('profiles')
      .select('id');
    
    const existingIds = new Set(existingProfiles?.map(p => p.id) || []);
    
    // Create profiles for users who don't have them
    const missingProfiles = authUsers.users.filter(user => !existingIds.has(user.id));
    
    if (missingProfiles.length === 0) {
      console.log('All users already have profiles');
      return;
    }

    console.log(`Creating ${missingProfiles.length} missing profiles...`);
    
    const profilesToCreate = missingProfiles.map(user => ({
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
      username: user.user_metadata?.username || user.user_metadata?.preferred_username || null,
      avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
      created_at: user.created_at,
      is_active: true
    }));

    const { data, error: insertError } = await supabase
      .from('profiles')
      .insert(profilesToCreate)
      .select();

    if (insertError) {
      console.error('Error creating missing profiles:', insertError);
      return;
    }

    console.log(`✅ Created ${data?.length || 0} profiles`);
    toast.success(`Created ${data?.length || 0} user profiles`);
    
  } catch (error) {
    console.error('Error in ensureAllUsersHaveProfiles:', error);
  }
}
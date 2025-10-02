// Manual database setup - Run this in browser console if SQL Editor didn't work

console.log('🔧 Manual database setup starting...');

const manualSetup = async () => {
  try {
    // Check current user
    const { data: { user } } = await supabase.auth.getUser();
    console.log('Current user:', user?.id);
    
    if (!user) {
      console.error('❌ User not authenticated');
      return;
    }

    // Try to create a profile manually
    console.log('1️⃣ Testing profile creation...');
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        full_name: user.user_metadata?.full_name || 'Test User',
        username: `user_${Date.now()}`,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (profileError) {
      console.error('❌ Profile creation failed:', profileError);
    } else {
      console.log('✅ Profile created:', profileData);
    }

    // Test gallery table
    console.log('2️⃣ Testing gallery access...');
    const { data: galleryData, error: galleryError } = await supabase
      .from('gallery')
      .select('*')
      .limit(1);

    if (galleryError) {
      console.error('❌ Gallery access failed:', galleryError);
    } else {
      console.log('✅ Gallery accessible:', galleryData.length, 'items');
    }

    // Test storage buckets
    console.log('3️⃣ Testing storage buckets...');
    const { data: buckets, error: storageError } = await supabase.storage.listBuckets();
    
    if (storageError) {
      console.error('❌ Storage access failed:', storageError);
    } else {
      console.log('✅ Storage buckets:', buckets.map(b => b.id));
    }

  } catch (error) {
    console.error('💥 Manual setup failed:', error);
  }
};

// Create storage bucket if missing
const createBucket = async (bucketName) => {
  try {
    const { data, error } = await supabase.storage.createBucket(bucketName, { public: true });
    if (error) {
      console.error(`❌ Failed to create bucket ${bucketName}:`, error);
    } else {
      console.log(`✅ Created bucket: ${bucketName}`);
    }
  } catch (err) {
    console.error(`💥 Bucket creation error for ${bucketName}:`, err);
  }
};

// Run setup
manualSetup().then(() => {
  console.log('🏁 Manual setup complete');
  
  // Try creating essential buckets
  ['images', 'gallery', 'avatars'].forEach(bucket => {
    createBucket(bucket);
  });
});
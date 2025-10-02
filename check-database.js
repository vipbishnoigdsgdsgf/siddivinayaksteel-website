// Quick database check - Paste this in browser console

console.log('🔍 Checking database status...');

// Check if tables exist
const checkTables = async () => {
  const tables = ['profiles', 'gallery', 'projects', 'reviews', 'meetings'];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('id').limit(1);
      if (error) {
        console.error(`❌ Table ${table}: ${error.message}`);
      } else {
        console.log(`✅ Table ${table}: EXISTS`);
      }
    } catch (err) {
      console.error(`💥 Table ${table}: ${err.message}`);
    }
  }
};

// Check storage buckets
const checkBuckets = async () => {
  try {
    const { data, error } = await supabase.storage.listBuckets();
    if (error) {
      console.error('❌ Storage error:', error.message);
    } else {
      console.log('✅ Storage buckets:', data.map(b => b.id));
    }
  } catch (err) {
    console.error('💥 Storage error:', err.message);
  }
};

// Run checks
Promise.all([checkTables(), checkBuckets()]).then(() => {
  console.log('🏁 Database check complete');
});
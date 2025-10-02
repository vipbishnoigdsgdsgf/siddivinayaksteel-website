import { supabase } from '../lib/supabase';

// Test database connectivity and schema
export const validateDatabase = async (): Promise<{
  success: boolean;
  results: { [table: string]: any };
  errors: string[];
}> => {
  const results: { [table: string]: any } = {};
  const errors: string[] = [];
  let success = true;

  console.group('🔍 Database Validation');

  // Test each table
  const tables = ['profiles', 'projects', 'gallery', 'gallery_likes', 'gallery_saves', 'reviews', 'meetings', 'meeting_registrations', 'notifications'];

  for (const table of tables) {
    try {
      console.log(`Testing table: ${table}`);
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (error) {
        errors.push(`${table}: ${error.message}`);
        results[table] = { status: 'ERROR', error: error.message };
        success = false;
      } else {
        results[table] = { status: 'OK', count: data?.length || 0 };
      }
    } catch (err: any) {
      errors.push(`${table}: ${err.message}`);
      results[table] = { status: 'EXCEPTION', error: err.message };
      success = false;
    }
  }

  // Test profile operations specifically
  try {
    console.log('Testing profile operations...');
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Test profile read
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) {
        errors.push(`Profile read: ${profileError.message}`);
        results['profile_ops'] = { status: 'ERROR', error: profileError.message };
        success = false;
      } else {
        results['profile_ops'] = { status: 'OK', has_profile: !!profile };
      }
    } else {
      results['profile_ops'] = { status: 'NO_USER', message: 'Not authenticated' };
    }
  } catch (err: any) {
    errors.push(`Profile operations: ${err.message}`);
    results['profile_ops'] = { status: 'EXCEPTION', error: err.message };
    success = false;
  }

  console.log('📊 Validation Results:');
  console.table(results);

  if (errors.length > 0) {
    console.log('❌ Errors found:');
    errors.forEach(error => console.log(`  - ${error}`));
  }

  console.groupEnd();

  return { success, results, errors };
};

// Export to window for console access
if (typeof window !== 'undefined') {
  (window as any).validateDatabase = validateDatabase;
}

export default validateDatabase;
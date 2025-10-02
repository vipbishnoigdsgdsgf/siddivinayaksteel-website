// Database schema verification script to check profiles table structure

import { supabase } from '../lib/supabase';

export const checkProfilesTableSchema = async () => {
  console.group('🔍 Checking Profiles Table Schema');
  
  try {
    // Method 1: Try to query the table structure using information_schema
    console.log('1️⃣ Checking table columns via information_schema...');
    
    const { data: columns, error: columnsError } = await supabase
      .rpc('get_table_columns', { table_name: 'profiles' })
      .catch(async () => {
        // Fallback: Direct query to information_schema
        return await supabase
          .from('information_schema.columns' as any)
          .select('column_name, data_type, is_nullable')
          .eq('table_name', 'profiles')
          .eq('table_schema', 'public');
      });
    
    if (columns) {
      console.log('✅ Table columns found:', columns);
    } else {
      console.log('⚠️ Could not fetch columns via information_schema');
    }

    // Method 2: Try to insert a minimal record to see what columns are accepted
    console.log('2️⃣ Testing minimal profile creation...');
    
    const testId = 'test-' + Date.now();
    const minimalProfile = {
      id: testId
      // Only ID - no username
    };
    
    const { error: insertError } = await supabase
      .from('profiles')
      .insert(minimalProfile);
    
    if (insertError) {
      console.log('Minimal insert error:', insertError.message);
    } else {
      console.log('✅ Minimal profile insert succeeded');
      
      // Clean up test record
      await supabase.from('profiles').delete().eq('id', testId);
    }

    // Method 3: Try to insert with username to see the exact error
    console.log('3️⃣ Testing profile creation with username...');
    
    const testId2 = 'test-' + (Date.now() + 1);
    const profileWithUsername = {
      id: testId2,
      username: 'test_user_' + Date.now()
    };
    
    const { error: usernameError } = await supabase
      .from('profiles')
      .insert(profileWithUsername);
    
    if (usernameError) {
      console.log('❌ Username insert error:', usernameError);
      console.log('Error details:', {
        code: usernameError.code,
        message: usernameError.message,
        details: usernameError.details,
        hint: usernameError.hint
      });
    } else {
      console.log('✅ Profile with username insert succeeded');
      
      // Clean up test record
      await supabase.from('profiles').delete().eq('id', testId2);
    }

    // Method 4: Check what columns actually exist by trying to select them
    console.log('4️⃣ Testing column access via select...');
    
    const { data: existingProfiles, error: selectError } = await supabase
      .from('profiles')
      .select('id, full_name, phone, location, avatar_url, created_at, updated_at')
      .limit(1);
    
    if (selectError) {
      console.log('Select error (without username):', selectError.message);
    } else {
      console.log('✅ Basic columns accessible');
    }

    // Method 5: Test username column specifically
    const { data: usernameTest, error: usernameSelectError } = await supabase
      .from('profiles')
      .select('id, username')
      .limit(1);
    
    if (usernameSelectError) {
      console.log('❌ Username column select error:', usernameSelectError.message);
    } else {
      console.log('✅ Username column is accessible');
    }

    console.log('\n📊 Schema Check Summary:');
    console.table({
      'Information Schema': columns ? '✅ Available' : '❌ Not accessible',
      'Minimal Insert': !insertError ? '✅ Working' : '❌ Failed',
      'Username Insert': !usernameError ? '✅ Working' : '❌ Failed',
      'Basic Select': !selectError ? '✅ Working' : '❌ Failed', 
      'Username Select': !usernameSelectError ? '✅ Working' : '❌ Failed',
    });

    return {
      hasUsernameColumn: !usernameSelectError,
      canInsertBasic: !insertError,
      canInsertUsername: !usernameError,
      schemaInfo: columns,
      errors: {
        columnsError,
        insertError,
        usernameError,
        selectError,
        usernameSelectError
      }
    };

  } catch (error: any) {
    console.error('💥 Schema check failed:', error);
    return {
      hasUsernameColumn: false,
      canInsertBasic: false,
      canInsertUsername: false,
      schemaInfo: null,
      errors: { generalError: error }
    };
  } finally {
    console.groupEnd();
  }
};

// Make available in console
if (typeof window !== 'undefined') {
  (window as any).checkProfilesTableSchema = checkProfilesTableSchema;
}

export default checkProfilesTableSchema;
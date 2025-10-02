// Quick test script to verify profile creation and updates work

import { ProfileService } from '../services/profileService';

// Test profile operations
export const testProfileOperations = async () => {
  console.group('🧪 Testing Profile Operations');
  
  try {
    // Test 1: Create a profile for a test user
    const testUserId = '00000000-0000-4000-8000-000000000001';
    const testProfileData = {
      id: testUserId,
      username: 'testuser123',
      full_name: 'Test User',
      phone: '+1234567890',
      location: 'Test City, Test Country'
    };

    console.log('1️⃣ Testing profile creation...');
    let createSuccess = false;
    try {
      await ProfileService.upsertProfile(testProfileData);
      console.log('✅ Create test: SUCCESS');
      createSuccess = true;
    } catch (error: any) {
      if (error.message.includes('409') || error.message.includes('already exists')) {
        console.log('✅ Create test: Profile already exists (expected for test)');
        createSuccess = true;
      } else {
        console.error('❌ Create test failed:', error.message);
        createSuccess = false;
      }
    }

    // Test 2: Fetch the profile
    console.log('2️⃣ Testing profile fetch...');
    let fetchSuccess = false;
    try {
      const profile = await ProfileService.getProfile(testUserId);
      console.log('✅ Fetch test: SUCCESS');
      fetchSuccess = true;
    } catch (error: any) {
      console.error('❌ Fetch test failed:', error.message);
      fetchSuccess = false;
    }

    // Test 3: Update the profile
    console.log('3️⃣ Testing profile update...');
    const updateData = {
      full_name: 'Updated Test User',
      location: 'Updated City'
    };
    
    let updateSuccess = false;
    try {
      await ProfileService.updateProfile(testUserId, updateData);
      console.log('✅ Update test: SUCCESS');
      updateSuccess = true;
    } catch (error: any) {
      console.error('❌ Update test failed:', error.message);
      updateSuccess = false;
    }

    // Summary (createSuccess is already defined above)
    
    console.log('\n📊 Test Results:');
    console.table({
      'Profile Creation': createSuccess ? '✅ PASS' : '❌ FAIL',
      'Profile Fetching': fetchSuccess ? '✅ PASS' : '❌ FAIL', 
      'Profile Updates': updateSuccess ? '✅ PASS' : '❌ FAIL',
      'Overall': (createSuccess && fetchSuccess && updateSuccess) ? '✅ ALL TESTS PASS' : '❌ SOME TESTS FAILED'
    });

    return {
      createSuccess,
      fetchSuccess, 
      updateSuccess,
      allPass: createSuccess && fetchSuccess && updateSuccess
    };

  } catch (error: any) {
    console.error('💥 Test execution failed:', error.message);
    return {
      createSuccess: false,
      fetchSuccess: false,
      updateSuccess: false,
      allPass: false
    };
  } finally {
    console.groupEnd();
  }
};

// Auto-run in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Make test available in console
  (window as any).testProfileOperations = testProfileOperations;
  
  // Auto-run after a delay
  setTimeout(() => {
    console.log('🚀 Auto-running profile operation tests...');
    testProfileOperations().then(results => {
      if (results.allPass) {
        console.log('🎉 ALL PROFILE TESTS PASSED! New user profiles should work now.');
      } else {
        console.log('⚠️ Some profile tests failed. Check the errors above.');
      }
    });
  }, 3000);
}

export default testProfileOperations;
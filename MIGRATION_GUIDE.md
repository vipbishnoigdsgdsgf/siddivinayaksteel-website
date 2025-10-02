# Migration Guide - Fixing Wallet & Supabase Issues

This guide helps you migrate from the problematic code patterns to the new, enhanced utilities that fix both wallet and Supabase 406 errors.

## 🔧 Issues Fixed

### Issue 1: `wallet must has at least one account` (inpage.js:167)
- **Root Cause**: No proper wallet connection handling
- **Solution**: New `walletUtils.ts` with error prevention and proper connection management

### Issue 2: `406 (Not Acceptable) on GET /profiles`
- **Root Cause**: Missing headers, UUID validation issues, and improper error handling
- **Solution**: Enhanced `supabaseUtils.ts` with proper headers and error handling

## 📦 New Files Added

```
src/utils/
├── walletUtils.ts      # Wallet connection management & error prevention
├── debugUtils.ts       # Comprehensive debugging tools
└── supabaseUtils.ts    # Enhanced (updated existing file)
```

## 🔄 Migration Steps

### Step 1: Update Imports

**Before:**
```typescript
import { supabase } from '@/integrations/supabase/client';
```

**After:**
```typescript
import { fetchUserProfile, upsertUserProfile, safeSelect, safeInsert } from '@/utils/supabaseUtils';
import { connectWallet, getWalletConnection } from '@/utils/walletUtils';
```

### Step 2: Update Profile Queries

**Before (problematic):**
```typescript
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single();
```

**After (fixed):**
```typescript
const { data, error } = await fetchUserProfile(userId);
```

### Step 3: Update Profile Updates

**Before:**
```typescript
const { error } = await supabase
  .from('profiles')
  .update(profileData)
  .eq('id', userId);
```

**After:**
```typescript
const { data, error } = await safeUpdate('profiles', profileData, [
  { column: 'id', value: userId }
]);
```

### Step 4: Add Wallet Support (if needed)

**New functionality:**
```typescript
// Check if wallet is available
if (isWalletAvailable()) {
  // Connect wallet
  const connection = await connectWallet();
  if (connection.isConnected) {
    console.log('Wallet connected:', connection.address);
  }
}
```

### Step 5: Update Error Handling

**Before:**
```typescript
try {
  const result = await someSupabaseOperation();
} catch (error) {
  console.error('Error:', error);
}
```

**After:**
```typescript
const { data, error } = await someSupabaseOperation();
if (error) {
  console.error('Detailed error:', error.message);
  // Handle specific error cases
}
```

## 🔍 Debugging Tools

### Console Commands
After the migration, these functions are available in the browser console:

```javascript
// Run comprehensive system diagnosis
runDiagnosis()

// Test Supabase profiles specifically  
testSupabaseProfiles()

// Test wallet functionality
testWalletConnection()
```

### Development Debugging
```typescript
import { runDiagnosis } from '@/utils/debugUtils';

// Run during development to identify issues
useEffect(() => {
  if (process.env.NODE_ENV === 'development') {
    runDiagnosis();
  }
}, []);
```

## 📋 Specific File Updates

### Update `src/context/AuthContext.tsx`

**Replace profile fetching:**
```typescript
// OLD
const { data: profileData } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single();

// NEW  
const { data: profileData } = await fetchUserProfile(user.id);
```

### Update `src/hooks/useAuthMethods.ts`

**Replace profile updates:**
```typescript
// OLD
const { error } = await supabase
  .from('profiles')
  .update(updates)
  .eq('id', user.id);

// NEW
const { error } = await safeUpdate('profiles', updates, [
  { column: 'id', value: user.id }
]);
```

### Update any component using profiles

**Replace direct Supabase calls:**
```typescript
// OLD
const { data: profiles } = await supabase
  .from('profiles')
  .select('*')
  .in('id', userIds);

// NEW
const profileQuery = safeSelect('profiles')
  .select('*')
  .in('id', userIds);
const { data: profiles, error } = await profileQuery;
```

## ✅ Verification

After migration, verify everything works:

1. Open browser console
2. Run `runDiagnosis()`
3. Check that both Supabase and wallet tests pass
4. Test profile operations in your app
5. Verify no more 406 errors or wallet errors

## 🆘 Troubleshooting

### If Supabase tests fail:
- Check your `.env` file has correct Supabase credentials
- Verify your Supabase project is running
- Check Row Level Security (RLS) policies on profiles table

### If wallet tests fail:
- Install MetaMask or another wallet extension
- Check for browser extension conflicts
- Try in incognito mode to rule out extension issues

### If you see TypeScript errors:
- Run `npm run build` to check for type issues
- Update imports to use the new utilities
- Ensure all UUID validations are in place

## 🎯 Benefits After Migration

- ✅ No more wallet-related console errors
- ✅ No more 406 Supabase errors  
- ✅ Better error messages and debugging
- ✅ UUID validation prevents database errors
- ✅ Proper headers for all API requests
- ✅ Comprehensive error handling
- ✅ Development debugging tools
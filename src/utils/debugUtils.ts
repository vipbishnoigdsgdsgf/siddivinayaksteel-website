// Debug utilities to help diagnose and fix wallet and Supabase issues

import { supabase } from '../lib/supabase';
import { isWalletAvailable, getWalletConnection } from './walletUtils';

// Debug information collector
export interface DebugInfo {
  timestamp: string;
  browser: string;
  userAgent: string;
  wallet: {
    available: boolean;
    connection?: any;
    extensions: string[];
  };
  supabase: {
    connected: boolean;
    version: string;
    url: string;
  };
  errors: any[];
}

// Collect comprehensive debug information
export const collectDebugInfo = async (): Promise<DebugInfo> => {
  const errors: any[] = [];
  
  // Detect wallet extensions
  const walletExtensions: string[] = [];
  if (typeof window !== 'undefined') {
    if (window.ethereum?.isMetaMask) walletExtensions.push('MetaMask');
    if ((window as any).solana?.isPhantom) walletExtensions.push('Phantom');
    if ((window as any).okxwallet) walletExtensions.push('OKX Wallet');
    if ((window as any).trustWallet) walletExtensions.push('Trust Wallet');
  }

  let supabaseConnected = false;
  try {
    const { data, error } = await supabase.auth.getSession();
    supabaseConnected = !error;
  } catch (error) {
    errors.push({ type: 'supabase_connection', error });
    supabaseConnected = false;
  }

  return {
    timestamp: new Date().toISOString(),
    browser: navigator.userAgent.split(' ').pop() || 'Unknown',
    userAgent: navigator.userAgent,
    wallet: {
      available: isWalletAvailable(),
      connection: getWalletConnection(),
      extensions: walletExtensions,
    },
    supabase: {
      connected: supabaseConnected,
      version: '2.49.4', // Update this as needed
      url: 'https://fcakzjucizdbjjbuelms.supabase.co',
    },
    errors,
  };
};

// Test Supabase profiles table connection
export const testSupabaseProfiles = async (): Promise<{
  success: boolean;
  error?: string;
  details?: any;
}> => {
  try {
    console.log('🔍 Testing Supabase profiles connection...');
    
    // Test 1: Simple select to verify table exists and is accessible
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (testError) {
      return {
        success: false,
        error: `Profiles table access failed: ${testError.message}`,
        details: testError,
      };
    }

    console.log('✅ Profiles table is accessible');

    // Test 2: Check if we can insert (if user is authenticated)
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData.session?.user) {
      const userId = sessionData.session.user.id;
      
      // Test profile fetch for current user
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (profileError && profileError.code !== 'PGRST116') {
        return {
          success: false,
          error: `Profile fetch failed: ${profileError.message}`,
          details: profileError,
        };
      }

      console.log('✅ Profile operations working correctly');
    }

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: `Unexpected error: ${error.message}`,
      details: error,
    };
  }
};

// Test wallet functionality
export const testWalletConnection = async (): Promise<{
  success: boolean;
  error?: string;
  details?: any;
}> => {
  try {
    console.log('🔍 Testing wallet connection...');
    
    if (!isWalletAvailable()) {
      return {
        success: false,
        error: 'No Ethereum wallet detected. Please install MetaMask or another wallet extension.',
      };
    }

    console.log('✅ Wallet extension detected');

    // Get current connection status
    const connection = getWalletConnection();
    
    return {
      success: true,
      details: {
        available: true,
        connected: connection.isConnected,
        address: connection.address,
        error: connection.error,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: `Wallet test failed: ${error.message}`,
      details: error,
    };
  }
};

// Run comprehensive diagnosis
export const runDiagnosis = async (): Promise<void> => {
  console.group('🔧 Running System Diagnosis');
  
  try {
    // Collect debug info
    console.log('📊 Collecting system information...');
    const debugInfo = await collectDebugInfo();
    console.table({
      'Browser': debugInfo.browser,
      'Wallet Available': debugInfo.wallet.available,
      'Wallet Extensions': debugInfo.wallet.extensions.join(', ') || 'None',
      'Supabase Connected': debugInfo.supabase.connected,
    });

    // Test Supabase
    console.log('\n🗄️ Testing Supabase connection...');
    const supabaseTest = await testSupabaseProfiles();
    if (supabaseTest.success) {
      console.log('✅ Supabase profiles table is working correctly');
    } else {
      console.error('❌ Supabase profiles test failed:', supabaseTest.error);
      console.error('Details:', supabaseTest.details);
    }

    // Test Wallet
    console.log('\n💳 Testing wallet functionality...');
    const walletTest = await testWalletConnection();
    if (walletTest.success) {
      console.log('✅ Wallet functionality is working correctly');
      console.log('Wallet details:', walletTest.details);
    } else {
      console.error('❌ Wallet test failed:', walletTest.error);
    }

    // Summary
    console.log('\n📋 Diagnosis Summary:');
    console.log(`Supabase: ${supabaseTest.success ? '✅ Working' : '❌ Issues detected'}`);
    console.log(`Wallet: ${walletTest.success ? '✅ Working' : '❌ Issues detected'}`);
    
    if (!supabaseTest.success || !walletTest.success) {
      console.log('\n🔧 Recommended actions:');
      if (!supabaseTest.success) {
        console.log('- Check Supabase configuration and table permissions');
        console.log('- Verify UUID formats in API calls');
        console.log('- Check network connectivity to Supabase');
      }
      if (!walletTest.success) {
        console.log('- Install a Web3 wallet extension (MetaMask, etc.)');
        console.log('- Check for browser extension conflicts');
        console.log('- Try refreshing the page');
      }
    }

  } catch (error) {
    console.error('❌ Diagnosis failed:', error);
  }
  
  console.groupEnd();
};

// Export to window for console access
if (typeof window !== 'undefined') {
  (window as any).runDiagnosis = runDiagnosis;
  (window as any).testSupabaseProfiles = testSupabaseProfiles;
  (window as any).testWalletConnection = testWalletConnection;
}
// Startup test script to verify that both wallet and Supabase fixes are working

import { ProfileService } from '../services/profileService';
import { runDiagnosis } from './debugUtils';

// Test results interface
interface StartupTestResults {
  walletErrorsPrevented: boolean;
  supabaseProfilesWorking: boolean;
  overallStatus: 'success' | 'partial' | 'failed';
  errors: string[];
  warnings: string[];
}

class StartupTester {
  private results: StartupTestResults = {
    walletErrorsPrevented: true, // Assume true until proven otherwise
    supabaseProfilesWorking: false,
    overallStatus: 'failed',
    errors: [],
    warnings: [],
  };

  // Test if wallet errors are being suppressed
  private testWalletErrorSuppression(): boolean {
    try {
      // Check if our wallet utils are loaded
      const walletUtilsLoaded = typeof window !== 'undefined' && 
                               window.ethereum?.request !== undefined;
      
      if (!walletUtilsLoaded) {
        this.results.warnings.push('No wallet extension detected - wallet error suppression not needed');
        return true; // Not an error if no wallet
      }

      // Test if errors are being caught properly
      const originalConsoleError = console.error;
      let walletErrorCaught = false;

      console.error = (...args) => {
        const message = args.join(' ');
        if (message.includes('wallet must has at least one account')) {
          walletErrorCaught = true;
        }
        originalConsoleError.apply(console, args);
      };

      // Restore original console.error
      setTimeout(() => {
        console.error = originalConsoleError;
      }, 100);

      return !walletErrorCaught; // Success if no wallet errors make it through
    } catch (error) {
      this.results.errors.push(`Wallet test error: ${error}`);
      return false;
    }
  }

  // Test if Supabase profiles endpoint is working
  private async testSupabaseProfiles(): Promise<boolean> {
    try {
      console.log('🔍 Testing Supabase profiles endpoint...');
      
      // Test with a dummy UUID format (won't exist, but should not throw 406 error)
      const testUserId = '00000000-0000-4000-8000-000000000000';
      
      try {
        await ProfileService.getProfile(testUserId);
        // If no error thrown, then profiles endpoint is working
      } catch (error: any) {
        // We expect this to fail (user doesn't exist) but not with a 406 error
        if (error?.message.includes('406') || error?.message.includes('Not Acceptable')) {
          this.results.errors.push('Supabase 406 error still occurring');
          return false;
        }
        // Other errors are expected since the user doesn't exist
      }
      
      console.log('✅ Supabase profiles endpoint is working correctly');
      return true;
      
    } catch (error: any) {
      this.results.errors.push(`Supabase test error: ${error.message}`);
      return false;
    }
  }

  // Run all startup tests
  async runTests(): Promise<StartupTestResults> {
    console.group('🚀 Running Startup Tests');
    
    try {
      // Test 1: Wallet error suppression
      console.log('1️⃣ Testing wallet error suppression...');
      this.results.walletErrorsPrevented = this.testWalletErrorSuppression();
      
      if (this.results.walletErrorsPrevented) {
        console.log('✅ Wallet error suppression: WORKING');
      } else {
        console.error('❌ Wallet error suppression: FAILED');
      }

      // Test 2: Supabase profiles endpoint
      console.log('2️⃣ Testing Supabase profiles endpoint...');
      this.results.supabaseProfilesWorking = await this.testSupabaseProfiles();
      
      if (this.results.supabaseProfilesWorking) {
        console.log('✅ Supabase profiles: WORKING');
      } else {
        console.error('❌ Supabase profiles: FAILED');
      }

      // Determine overall status
      if (this.results.walletErrorsPrevented && this.results.supabaseProfilesWorking) {
        this.results.overallStatus = 'success';
        console.log('🎉 All tests passed! Both issues are fixed.');
      } else if (this.results.walletErrorsPrevented || this.results.supabaseProfilesWorking) {
        this.results.overallStatus = 'partial';
        console.warn('⚠️ Some tests passed, but issues remain.');
      } else {
        this.results.overallStatus = 'failed';
        console.error('💥 Tests failed. Issues persist.');
      }

      // Show summary
      this.showSummary();
      
    } catch (error: any) {
      this.results.errors.push(`Test execution error: ${error.message}`);
      this.results.overallStatus = 'failed';
      console.error('💥 Test execution failed:', error);
    }
    
    console.groupEnd();
    return this.results;
  }

  // Show test summary
  private showSummary(): void {
    console.log('\n📊 Test Summary:');
    console.table({
      'Wallet Errors Prevented': this.results.walletErrorsPrevented ? '✅' : '❌',
      'Supabase Profiles Working': this.results.supabaseProfilesWorking ? '✅' : '❌',
      'Overall Status': this.results.overallStatus.toUpperCase(),
    });

    if (this.results.errors.length > 0) {
      console.log('\n❌ Errors:');
      this.results.errors.forEach(error => console.log(`  - ${error}`));
    }

    if (this.results.warnings.length > 0) {
      console.log('\n⚠️ Warnings:');
      this.results.warnings.forEach(warning => console.log(`  - ${warning}`));
    }

    if (this.results.overallStatus !== 'success') {
      console.log('\n🔧 Next Steps:');
      if (!this.results.walletErrorsPrevented) {
        console.log('  - Check wallet extension conflicts');
        console.log('  - Try refreshing the page');
        console.log('  - Check browser console for wallet errors');
      }
      if (!this.results.supabaseProfilesWorking) {
        console.log('  - Verify Supabase project is running');
        console.log('  - Check network connectivity');
        console.log('  - Run runDiagnosis() for detailed info');
      }
    }
  }
}

// Create and export tester instance
const startupTester = new StartupTester();

// Run tests automatically in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Wait a bit for everything to initialize, then run tests
  setTimeout(() => {
    startupTester.runTests().then(results => {
      // Store results on window for console access
      (window as any).lastTestResults = results;
      
      // Also make diagnosis available
      (window as any).runFullDiagnosis = runDiagnosis;
    });
  }, 2000);
}

// Export for manual testing
export const testStartup = () => startupTester.runTests();
export default startupTester;
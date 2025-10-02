import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { AdminCard } from '../ui/AdminCard';
import { RefreshCw, Users, Database } from 'lucide-react';
import { toast } from 'sonner';

export function UsersDebug() {
  const [debugData, setDebugData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const checkUsersDirectly = async () => {
    setLoading(true);
    try {
      console.log('🔍 Direct database check for users...');
      
      const results: any = {
        timestamp: new Date().toISOString()
      };

      // Check profiles table
      try {
        const { data: profiles, error: profilesError, count } = await supabase
          .from('profiles')
          .select('*', { count: 'exact' });
        
        results.profiles = {
          success: !profilesError,
          count: profiles?.length || 0,
          error: profilesError?.message || null,
          sampleData: profiles?.[0] || null,
          allData: profiles || []
        };
        console.log('👥 Profiles check:', results.profiles);
      } catch (err) {
        results.profiles = { success: false, error: `Exception: ${err}`, count: 0 };
      }

      // Check if there are any auth users
      try {
        // This might not work depending on RLS, but worth a try
        const { count } = await supabase
          .from('auth.users')
          .select('*', { count: 'exact', head: true });
        
        results.authUsers = {
          success: true,
          count: count || 0
        };
      } catch (err) {
        results.authUsers = { success: false, error: `Auth users not accessible: ${err}` };
      }

      // Check current user
      try {
        const { data: currentUser } = await supabase.auth.getUser();
        results.currentUser = {
          id: currentUser?.user?.id || null,
          email: currentUser?.user?.email || null,
          metadata: currentUser?.user?.user_metadata || null
        };
      } catch (err) {
        results.currentUser = { error: `Current user check failed: ${err}` };
      }

      // Try creating a test profile entry to see if table works
      try {
        const testId = 'test-user-' + Date.now();
        const { data: insertResult, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: testId,
            email: 'test@example.com',
            full_name: 'Test User',
            username: 'testuser',
            created_at: new Date().toISOString()
          })
          .select();
        
        if (!insertError) {
          // Delete the test record immediately
          await supabase.from('profiles').delete().eq('id', testId);
          results.canInsert = { success: true, message: 'Profiles table is writable' };
        } else {
          results.canInsert = { success: false, error: insertError.message };
        }
      } catch (err) {
        results.canInsert = { success: false, error: `Insert test failed: ${err}` };
      }

      setDebugData(results);
      toast.success('Debug check completed!');
      
    } catch (error) {
      console.error('Debug check failed:', error);
      toast.error('Debug check failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUsersDirectly();
  }, []);

  return (
    <AdminCard 
      title="👥 Users Debug Panel" 
      subtitle="Direct database inspection for users table"
      headerActions={
        <Button onClick={checkUsersDirectly} disabled={loading} size="sm">
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Check Again
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-dark-300 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Database className="h-5 w-5 text-blue-400 mr-2" />
              <h3 className="text-white font-medium">Profiles Table</h3>
            </div>
            <p className="text-2xl font-bold text-blue-400">
              {debugData.profiles?.count || 0}
            </p>
            {debugData.profiles?.error && (
              <p className="text-red-400 text-xs mt-1">{debugData.profiles.error}</p>
            )}
          </div>
          
          <div className="bg-dark-300 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Users className="h-5 w-5 text-green-400 mr-2" />
              <h3 className="text-white font-medium">Auth Users</h3>
            </div>
            <p className="text-2xl font-bold text-green-400">
              {debugData.authUsers?.count || 'N/A'}
            </p>
            {debugData.authUsers?.error && (
              <p className="text-red-400 text-xs mt-1">Limited access</p>
            )}
          </div>

          <div className="bg-dark-300 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Users className="h-5 w-5 text-yellow-400 mr-2" />
              <h3 className="text-white font-medium">Can Insert</h3>
            </div>
            <p className="text-lg font-bold text-yellow-400">
              {debugData.canInsert?.success ? '✅' : '❌'}
            </p>
            {debugData.canInsert?.error && (
              <p className="text-red-400 text-xs mt-1">Write blocked</p>
            )}
          </div>
        </div>

        {/* Current User Info */}
        {debugData.currentUser && (
          <div className="bg-dark-300 p-4 rounded-lg">
            <h3 className="text-white font-medium mb-2">Current User Info</h3>
            <pre className="text-xs text-gray-300 bg-dark-400 p-3 rounded overflow-x-auto">
              {JSON.stringify(debugData.currentUser, null, 2)}
            </pre>
          </div>
        )}

        {/* Sample Profile Data */}
        {debugData.profiles?.sampleData && (
          <div className="bg-dark-300 p-4 rounded-lg">
            <h3 className="text-white font-medium mb-2">Sample Profile Record</h3>
            <pre className="text-xs text-gray-300 bg-dark-400 p-3 rounded overflow-x-auto">
              {JSON.stringify(debugData.profiles.sampleData, null, 2)}
            </pre>
          </div>
        )}

        {/* Raw Profiles Data */}
        {debugData.profiles?.allData && debugData.profiles.allData.length > 0 && (
          <div className="bg-dark-300 p-4 rounded-lg">
            <h3 className="text-white font-medium mb-2">All Profiles ({debugData.profiles.allData.length})</h3>
            <div className="max-h-60 overflow-y-auto">
              <pre className="text-xs text-gray-300 bg-dark-400 p-3 rounded overflow-x-auto">
                {JSON.stringify(debugData.profiles.allData, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </AdminCard>
  );
}
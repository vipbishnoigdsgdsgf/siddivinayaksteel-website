import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AdminCard } from './AdminCard';
import { supabase } from '@/lib/supabase';
import { RefreshCw, Database, Users, FolderKanban } from 'lucide-react';
import { toast } from 'sonner';

interface AdminDebugPanelProps {
  className?: string;
}

export function AdminDebugPanel({ className = '' }: AdminDebugPanelProps) {
  const [debugData, setDebugData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const fetchDebugData = async () => {
    setLoading(true);
    try {
      console.log('🔍 Starting debug data fetch...');
      
      // Fetch profiles count
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' });
      
      // Fetch gallery count  
      const { data: galleryData, error: galleryError } = await supabase
        .from('gallery')  
        .select('*', { count: 'exact' });

      // Fetch projects count
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*', { count: 'exact' });

      // Fetch reviews count
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('*', { count: 'exact' });

      setDebugData({
        profiles: {
          count: profilesData?.length || 0,
          error: profilesError?.message || null,
          data: profilesData?.slice(0, 3) || [] // First 3 records for preview
        },
        gallery: {
          count: galleryData?.length || 0,
          error: galleryError?.message || null,
          data: galleryData?.slice(0, 3) || []
        },
        projects: {
          count: projectsData?.length || 0,
          error: projectsError?.message || null,
          data: projectsData?.slice(0, 3) || []
        },
        reviews: {
          count: reviewsData?.length || 0,
          error: reviewsError?.message || null,
          data: reviewsData?.slice(0, 3) || []
        }
      });

      console.log('🔍 Debug data collected:', {
        profiles: profilesData?.length,
        gallery: galleryData?.length,
        projects: projectsData?.length,
        reviews: reviewsData?.length
      });

      toast.success('Debug data refreshed!');
    } catch (error) {
      console.error('Debug fetch error:', error);
      toast.error('Failed to fetch debug data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebugData();
  }, []);

  return (
    <AdminCard 
      title="🔍 Database Debug Panel" 
      subtitle="Direct database inspection for troubleshooting"
      className={className}
      headerActions={
        <Button 
          onClick={fetchDebugData} 
          disabled={loading}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Database Tables Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'profiles', icon: Users, color: 'text-blue-400' },
            { name: 'gallery', icon: FolderKanban, color: 'text-green-400' },
            { name: 'projects', icon: FolderKanban, color: 'text-purple-400' },
            { name: 'reviews', icon: Database, color: 'text-yellow-400' }
          ].map(({ name, icon: Icon, color }) => (
            <div key={name} className="bg-dark-300 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Icon className={`h-5 w-5 ${color}`} />
                {debugData[name]?.error && (
                  <span className="text-red-400 text-xs">Error</span>
                )}
              </div>
              <h3 className="text-white font-medium capitalize">{name}</h3>
              <p className={`text-2xl font-bold ${color}`}>
                {debugData[name]?.count || 0}
              </p>
              {debugData[name]?.error && (
                <p className="text-red-400 text-xs mt-1">
                  {debugData[name].error}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Sample Data Preview */}
        <div className="space-y-4">
          <h3 className="text-white font-medium">Sample Data Preview</h3>
          
          {Object.entries(debugData).map(([tableName, tableData]: [string, any]) => (
            <div key={tableName} className="bg-dark-300 rounded-lg p-4">
              <h4 className="text-gray-300 font-medium mb-2 capitalize">
                {tableName} Table ({tableData?.count || 0} records)
              </h4>
              
              {tableData?.error ? (
                <p className="text-red-400 text-sm">Error: {tableData.error}</p>
              ) : tableData?.data && tableData.data.length > 0 ? (
                <div className="bg-dark-400 rounded p-3">
                  <pre className="text-xs text-gray-300 overflow-x-auto">
                    {JSON.stringify(tableData.data[0], null, 2)}
                  </pre>
                  {tableData.data.length > 1 && (
                    <p className="text-gray-400 text-xs mt-2">
                      ... and {tableData.data.length - 1} more records
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No data found</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </AdminCard>
  );
}
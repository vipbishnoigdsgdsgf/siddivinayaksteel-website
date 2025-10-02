import { useState, useEffect } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FolderKanban, 
  Calendar,
  MessageSquare,
  Eye,
  Download,
  RefreshCw,
  Globe,
  Monitor
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { getAnalyticsSummary, AnalyticsSummary } from '@/utils/analyticsUtils';

interface AnalyticsData {
  totalUsers: number;
  totalProjects: number;
  totalMeetings: number;
  totalReviews: number;
  newUsersThisMonth: number;
  activeProjects: number;
  pendingMeetings: number;
  averageRating: number;
}

export function AnalyticsTab() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    totalProjects: 0,
    totalMeetings: 0,
    totalReviews: 0,
    newUsersThisMonth: 0,
    activeProjects: 0,
    pendingMeetings: 0,
    averageRating: 0,
  });

  // Website visitor analytics state
  const [visitorAnalytics, setVisitorAnalytics] = useState<AnalyticsSummary>({
    total_visits: 0,
    unique_visitors: 0,
    today_visits: 0,
    weekly_visits: 0,
    monthly_visits: 0,
    popular_pages: [],
    daily_stats: []
  });

  const [loading, setLoading] = useState(true);

  // Load real analytics data on component mount
  useEffect(() => {
    fetchAnalyticsData();
    fetchVisitorAnalytics();
  }, []);

  // Fetch website visitor analytics
  const fetchVisitorAnalytics = async () => {
    try {
      const data = await getAnalyticsSummary();
      setVisitorAnalytics(data);
      console.log('📊 Website visitor analytics loaded:', data);
    } catch (error) {
      console.error('❌ Error fetching visitor analytics:', error);
    }
  };

  // Fetch real analytics data from Supabase
  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Get current date for filtering
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      
      // Fetch total users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('id, created_at');
      
      if (usersError) {
        console.error('Error fetching users:', usersError);
      }
      
      // Fetch total projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('id, status, created_at');
        
      if (projectsError) {
        console.error('Error fetching projects:', projectsError);
      }
      
      // Fetch meetings
      const { data: meetingsData, error: meetingsError } = await supabase
        .from('meetings')
        .select('id, date, created_at');
        
      if (meetingsError) {
        console.error('Error fetching meetings:', meetingsError);
      }
      
      // Fetch reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('id, rating, created_at');
        
      if (reviewsError) {
        console.error('Error fetching reviews:', reviewsError);
      }
      
      // Fetch meeting registrations
      const { data: registrationsData, error: registrationsError } = await supabase
        .from('meeting_registrations')
        .select('id, status, created_at');
        
      if (registrationsError) {
        console.error('Error fetching registrations:', registrationsError);
      }
      
      // Calculate analytics
      const totalUsers = usersData?.length || 0;
      const totalProjects = projectsData?.length || 0;
      const totalMeetings = meetingsData?.length || 0;
      const totalReviews = reviewsData?.length || 0;
      
      // Calculate new users this month
      const newUsersThisMonth = usersData?.filter(user => 
        new Date(user.created_at) >= firstDayOfMonth
      ).length || 0;
      
      // Calculate active projects (status = 'published' or not archived)
      const activeProjects = projectsData?.filter(project => 
        project.status === 'published' || !project.status || project.status === 'active'
      ).length || 0;
      
      // Calculate pending meetings (future dates)
      const pendingMeetings = meetingsData?.filter(meeting => {
        if (!meeting.date) return false;
        const meetingDate = new Date(meeting.date);
        return meetingDate > currentDate;
      }).length || 0;
      
      // Calculate average rating
      let averageRating = 0;
      if (reviewsData && reviewsData.length > 0) {
        const totalRating = reviewsData.reduce((sum, review) => sum + (review.rating || 0), 0);
        averageRating = Number((totalRating / reviewsData.length).toFixed(1));
      }
      
      // Update analytics state
      setAnalytics({
        totalUsers,
        totalProjects,
        totalMeetings,
        totalReviews,
        newUsersThisMonth,
        activeProjects,
        pendingMeetings,
        averageRating,
      });
      
      console.log('📈 Analytics data loaded:', {
        totalUsers,
        totalProjects,
        totalMeetings,
        totalReviews,
        newUsersThisMonth,
        activeProjects,
        pendingMeetings,
        averageRating,
      });
      
    } catch (error) {
      console.error('❌ Error fetching analytics data:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };
  
  const refreshAnalytics = async () => {
    await fetchAnalyticsData();
    await fetchVisitorAnalytics();
    toast.success('🔄 Analytics data refreshed');
  };

  const exportData = () => {
    // Create CSV data
    const csvData = [
      ['Metric', 'Value'],
      ['Total Users', analytics.totalUsers],
      ['Total Projects', analytics.totalProjects],
      ['Total Meetings', analytics.totalMeetings],
      ['Total Reviews', analytics.totalReviews],
      ['New Users This Month', analytics.newUsersThisMonth],
      ['Active Projects', analytics.activeProjects],
      ['Pending Meetings', analytics.pendingMeetings],
      ['Average Rating', analytics.averageRating],
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Analytics Dashboard</h2>
          <p className="text-gray-400 mt-1">Comprehensive business intelligence and insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={refreshAnalytics}
            disabled={loading}
            variant="outline"
            className="border-gray-700 text-gray-300 hover:bg-dark-300"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={exportData}
            className="bg-steel hover:bg-steel/80 text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Website Visitor Analytics */}
      <Card className="bg-gradient-to-br from-steel/20 to-steel/30 border-steel/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Website Visitor Analytics - Today's Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{visitorAnalytics.today_visits}</div>
              <p className="text-xs text-gray-300">Today's Visits</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{visitorAnalytics.weekly_visits}</div>
              <p className="text-xs text-gray-300">This Week</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{visitorAnalytics.unique_visitors}</div>
              <p className="text-xs text-gray-300">Unique Visitors</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{visitorAnalytics.total_visits}</div>
              <p className="text-xs text-gray-300">Total Visits</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-blue-500 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalUsers.toLocaleString()}</div>
            <p className="text-xs opacity-80 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{analytics.newUsersThisMonth} this month
            </p>
          </CardContent>
        </Card>

        {/* Total Projects */}
        <Card className="bg-gradient-to-br from-green-600 to-green-700 border-green-500 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FolderKanban className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalProjects}</div>
            <p className="text-xs opacity-80 flex items-center mt-1">
              <Eye className="h-3 w-3 mr-1" />
              {analytics.activeProjects} active
            </p>
          </CardContent>
        </Card>

        {/* Total Meetings */}
        <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-purple-500 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Meetings</CardTitle>
            <Calendar className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalMeetings}</div>
            <p className="text-xs opacity-80 flex items-center mt-1">
              <Calendar className="h-3 w-3 mr-1" />
              {analytics.pendingMeetings} pending
            </p>
          </CardContent>
        </Card>

        {/* Average Rating */}
        <Card className="bg-gradient-to-br from-yellow-600 to-orange-600 border-yellow-500 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
            <MessageSquare className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.averageRating}/5.0</div>
            <p className="text-xs opacity-80 flex items-center mt-1">
              <MessageSquare className="h-3 w-3 mr-1" />
              {analytics.totalReviews} reviews
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card className="bg-dark-200 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-steel" />
              User Growth Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-dark-300 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Chart visualization coming soon</p>
                <p className="text-gray-500 text-sm">Integration with Chart.js or similar</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Popular Website Pages */}
        <Card className="bg-dark-200 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Monitor className="h-5 w-5 mr-2 text-steel" />
              Popular Website Pages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {visitorAnalytics.popular_pages.length > 0 ? (
                visitorAnalytics.popular_pages.slice(0, 5).map((page, index) => {
                  const pageNames: { [key: string]: string } = {
                    '/': 'Home Page',
                    '/about': 'About Us',
                    '/contact': 'Contact Us',
                    '/gallery': 'Gallery',
                    '/portfolio': 'Portfolio',
                    '/login': 'Login'
                  };
                  const pageName = pageNames[page.page] || page.page;
                  const maxVisits = Math.max(...visitorAnalytics.popular_pages.map(p => p.visits));
                  const percentage = maxVisits > 0 ? (page.visits / maxVisits) * 100 : 0;
                  
                  return (
                    <div key={page.page} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">{pageName}</span>
                        <span className="text-steel font-semibold">{page.visits}</span>
                      </div>
                      <div className="bg-dark-300 rounded-full h-2">
                        <div 
                          className="bg-steel rounded-full h-2 transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-400 text-center py-4">No page visits recorded yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-dark-200 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Eye className="h-5 w-5 mr-2 text-steel" />
            Recent Activity Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-600/20 p-4 rounded-lg mb-3">
                <Users className="h-8 w-8 text-blue-400 mx-auto" />
              </div>
              <h4 className="text-white font-semibold">User Engagement</h4>
              <p className="text-gray-400 text-sm">Daily active users up 12%</p>
            </div>
            <div className="text-center">
              <div className="bg-green-600/20 p-4 rounded-lg mb-3">
                <FolderKanban className="h-8 w-8 text-green-400 mx-auto" />
              </div>
              <h4 className="text-white font-semibold">Project Activity</h4>
              <p className="text-gray-400 text-sm">5 new projects this week</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600/20 p-4 rounded-lg mb-3">
                <Calendar className="h-8 w-8 text-purple-400 mx-auto" />
              </div>
              <h4 className="text-white font-semibold">Meeting Bookings</h4>
              <p className="text-gray-400 text-sm">8 meetings scheduled</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
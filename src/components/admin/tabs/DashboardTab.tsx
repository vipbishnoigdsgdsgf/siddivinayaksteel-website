
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Users, 
  FileText, 
  Calendar, 
  RefreshCw, 
  TrendingUp, 
  Activity, 
  Clock,
  UserCheck,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  Globe,
  Eye
} from "lucide-react";
import { toast } from "sonner";
import { AdminCard } from '../ui/AdminCard';
import { AdminStats } from '../ui/AdminStats';
import { AdminActions } from '../ui/AdminActions';
import { AdminDebugPanel } from '../ui/AdminDebugPanel';
import { getAnalyticsSummary, AnalyticsSummary } from '@/utils/analyticsUtils';


interface DashboardTabProps {
  users: any[];
  projects: any[];
  reviews: any[];
  meetings: any[];
  registrations?: any[];
  onDataRefresh?: () => void;
  onTabChange?: (tabId: string) => void;
}

// Real Admin Dashboard - Shows actual website data from database
export function DashboardTab({ users, projects, reviews, meetings, registrations = [], onDataRefresh, onTabChange }: DashboardTabProps) {
  const [refreshing, setRefreshing] = useState(false);
  const [visitorAnalytics, setVisitorAnalytics] = useState<AnalyticsSummary>({
    total_visits: 0,
    unique_visitors: 0,
    today_visits: 0,
    weekly_visits: 0,
    monthly_visits: 0,
    popular_pages: [],
    daily_stats: []
  });

  // Load visitor analytics on component mount
  useEffect(() => {
    loadVisitorAnalytics();
  }, []);

  const loadVisitorAnalytics = async () => {
    try {
      const data = await getAnalyticsSummary();
      setVisitorAnalytics(data);
    } catch (error) {
      console.error('Failed to load visitor analytics:', error);
    }
  };

  const handleRefresh = async () => {
    if (!onDataRefresh) return;
    
    try {
      setRefreshing(true);
      await onDataRefresh();
      await loadVisitorAnalytics();
      toast.success('📊 Data refreshed successfully!');
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.error('Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };
  
  const handleNavClick = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
      toast.success(`Switching to ${tabId} tab`);
    }
  };
  
  
  // Calculate real website statistics
  const activeUsers = users.filter(u => u.is_active !== false).length;
  const recentUsers = users.filter(u => {
    const created = new Date(u.created_at);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return created >= thirtyDaysAgo;
  }).length;
  
  const publishedProjects = projects.filter(p => p.status === 'published').length;
  const featuredProjects = projects.filter(p => p.is_featured).length;
  
  const pendingReviews = reviews.filter(r => r.is_approved === null || r.is_approved === undefined).length;
  const approvedReviews = reviews.filter(r => r.is_approved === true).length;
  
  const upcomingMeetings = meetings.filter(m => {
    const meetingDate = new Date(m.date);
    return meetingDate > new Date();
  }).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400 mt-2">Manage your website users, projects, reviews and content</p>
        </div>
        
        {/* Real Admin Controls */}
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-400">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
          <Button 
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline" 
            size="sm"
            className="border-steel text-white hover:bg-steel hover:text-white transition-all duration-200"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </div>
      </div>
      
      {/* Website Visitor Analytics */}
      <AdminCard title="Today's Website Analytics" subtitle="Real-time visitor insights from your website" className="mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-dark-300 rounded-lg">
            <Eye className="h-6 w-6 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{visitorAnalytics.today_visits}</div>
            <p className="text-sm text-gray-400">Today's Visits</p>
          </div>
          <div className="text-center p-4 bg-dark-300 rounded-lg">
            <Users className="h-6 w-6 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{visitorAnalytics.unique_visitors}</div>
            <p className="text-sm text-gray-400">Unique Visitors</p>
          </div>
          <div className="text-center p-4 bg-dark-300 rounded-lg">
            <TrendingUp className="h-6 w-6 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{visitorAnalytics.weekly_visits}</div>
            <p className="text-sm text-gray-400">This Week</p>
          </div>
          <div className="text-center p-4 bg-dark-300 rounded-lg">
            <Globe className="h-6 w-6 text-steel mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{visitorAnalytics.total_visits}</div>
            <p className="text-sm text-gray-400">Total Visits</p>
          </div>
        </div>
      </AdminCard>

      {/* Real Website Statistics */}
      <AdminStats 
        stats={[
          {
            label: 'Website Users',
            value: users.length,
            icon: Users,
            change: activeUsers,
            changeLabel: 'active users',
            color: 'blue'
          },
          {
            label: 'Projects',
            value: projects.length,
            icon: FileText,
            change: publishedProjects,
            changeLabel: 'published',
            color: 'green'
          },
          {
            label: 'Reviews',
            value: reviews.length,
            icon: BarChart,
            change: pendingReviews,
            changeLabel: 'pending approval',
            color: 'yellow'
          },
          {
            label: 'Meetings',
            value: meetings.length,
            icon: Calendar,
            change: upcomingMeetings,
            changeLabel: 'upcoming',
            color: 'purple'
          }
        ]} 
      />
      
      {/* Quick Admin Actions */}
      <AdminActions 
        title="Quick Actions"
        subtitle="Manage your website content and users"
        actions={[
          {
            label: 'Moderate Reviews',
            icon: MessageSquare,
            onClick: () => handleNavClick('reviews'),
            count: pendingReviews,
            variant: pendingReviews > 0 ? 'secondary' : 'outline'
          },
          {
            label: 'Manage Users',
            icon: UserCheck,
            onClick: () => handleNavClick('users'),
            count: users.filter(u => u.is_active === false).length,
            variant: 'default'
          },
          {
            label: 'Active Projects',
            icon: CheckCircle,
            onClick: () => handleNavClick('projects'),
            count: projects.filter(p => p.status === 'published').length,
            variant: 'default'
          }
        ]}
      />
      
      {/* Temporary Debug Panel - Remove after fixing data issues */}
      <AdminDebugPanel className="border-2 border-yellow-600" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Website Visitor Trends */}
        <AdminCard 
          title="Daily Visitor Trends" 
          subtitle="Last 7 days website activity"
          className="lg:col-span-1"
        >
          <VisitorTrendsChart dailyStats={visitorAnalytics.daily_stats} />
        </AdminCard>

        {/* Popular Pages */}
        <AdminCard 
          title="Popular Pages" 
          subtitle="Most visited pages on your website"
          className="lg:col-span-1"
        >
          <PopularPagesList pages={visitorAnalytics.popular_pages.slice(0, 6)} />
        </AdminCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AdminCard 
          title="Recent Projects" 
          subtitle={`Latest ${Math.min(5, projects.length)} projects from your website`}
          className="lg:col-span-1"
        >
          <RecentProjectsList projects={projects.slice(0, 5)} />
        </AdminCard>
        
        <AdminCard 
          title="Recent Reviews" 
          subtitle={`Latest ${Math.min(5, reviews.length)} customer reviews`}
          className="lg:col-span-1"
        >
          <RecentReviewsList reviews={reviews.slice(0, 5)} />
        </AdminCard>
      </div>
    </div>
  );
}


function RecentProjectsList({ projects }: { projects: any[] }) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">No projects available</p>
        <p className="text-gray-500 text-sm">Projects will appear here when users create them</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <div key={project.id} className="flex items-center justify-between p-4 bg-dark-300 rounded-lg hover:bg-dark-400 transition-colors">
          <div className="flex-1">
            <h3 className="text-white font-medium">{project.title}</h3>
            <p className="text-gray-400 text-sm">{project.category || "Uncategorized"}</p>
            {project.profiles && (
              <p className="text-gray-500 text-xs mt-1">
                by {project.profiles.full_name || project.profiles.username || 'User'}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm">
              {new Date(project.created_at).toLocaleDateString()}
            </p>
            {project.status === 'published' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-600 text-white mt-1">
                Published
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function VisitorTrendsChart({ dailyStats }: { dailyStats: Array<{ date: string; visits: number }> }) {
  if (dailyStats.length === 0) {
    return (
      <div className="text-center py-8">
        <TrendingUp className="h-12 w-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">No visitor data available</p>
        <p className="text-gray-500 text-sm">Visit analytics will appear here as users visit your website</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const maxVisits = Math.max(...dailyStats.map(d => d.visits));

  return (
    <div className="space-y-4">
      {dailyStats.map((day, index) => {
        const percentage = maxVisits > 0 ? (day.visits / maxVisits) * 100 : 0;
        
        return (
          <div key={day.date} className="flex items-center space-x-4">
            <span className="text-sm text-gray-400 w-16">
              {formatDate(day.date)}
            </span>
            <div className="flex-1 bg-dark-300 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-steel to-blue-500 rounded-full h-3 transition-all duration-500 ease-out"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <span className="text-sm text-white font-medium w-12 text-right">
              {day.visits}
            </span>
          </div>
        );
      })}
      
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex justify-between text-sm text-gray-400">
          <span>Total: {dailyStats.reduce((sum, day) => sum + day.visits, 0)} visits</span>
          <span>Avg: {Math.round(dailyStats.reduce((sum, day) => sum + day.visits, 0) / dailyStats.length)} per day</span>
        </div>
      </div>
    </div>
  );
}

function PopularPagesList({ pages }: { pages: Array<{ page: string; visits: number }> }) {
  if (pages.length === 0) {
    return (
      <div className="text-center py-8">
        <Globe className="h-12 w-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">No page visits recorded</p>
        <p className="text-gray-500 text-sm">Popular pages will appear here as users visit your website</p>
      </div>
    );
  }

  const getPageName = (path: string) => {
    const pageNames: { [key: string]: string } = {
      '/': '🏠 Home Page',
      '/about': '👥 About Us', 
      '/contact': '📞 Contact Us',
      '/gallery': '🖼️ Gallery',
      '/portfolio': '💼 Portfolio',
      '/login': '🔐 Login',
      '/profile': '👤 Profile',
      '/meeting': '📅 Meetings'
    };
    return pageNames[path] || `📄 ${path}`;
  };

  const maxVisits = Math.max(...pages.map(p => p.visits));

  return (
    <div className="space-y-3">
      {pages.map((page, index) => {
        const percentage = maxVisits > 0 ? (page.visits / maxVisits) * 100 : 0;
        
        return (
          <div key={page.page} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-white font-medium">
                {getPageName(page.page)}
              </span>
              <span className="text-sm text-steel font-bold">
                {page.visits} visits
              </span>
            </div>
            <div className="bg-dark-300 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-steel to-blue-500 rounded-full h-2 transition-all duration-500 ease-out"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        );
      })}
      
      {pages.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="text-center text-sm text-gray-400">
            Total page views: {pages.reduce((sum, page) => sum + page.visits, 0)}
          </div>
        </div>
      )}
    </div>
  );
}

function RecentReviewsList({ reviews }: { reviews: any[] }) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <BarChart className="h-12 w-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">No reviews available</p>
        <p className="text-gray-500 text-sm">Customer reviews will appear here</p>
      </div>
    );
  }

  const getStarRating = (rating: number) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const getStatusColor = (isApproved?: boolean | null) => {
    if (isApproved === true) return 'text-green-400';
    if (isApproved === false) return 'text-red-400';
    return 'text-yellow-400';
  };

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="p-4 bg-dark-300 rounded-lg hover:bg-dark-400 transition-colors">
          <div className="flex items-start space-x-3">
            <div className="h-10 w-10 rounded-full bg-steel flex items-center justify-center text-white font-bold text-sm">
              {review.profiles?.full_name?.charAt(0) || 
               review.reviewer_name?.charAt(0) || 
               'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-white font-medium">
                  {review.profiles?.full_name || review.reviewer_name || "Anonymous User"}
                </h4>
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-400 text-sm">
                    {getStarRating(review.rating)}
                  </span>
                  <span className={`text-xs ${getStatusColor(review.is_approved)}`}>
                    {review.is_approved === true ? '✓' : review.is_approved === false ? '✗' : '⏳'}
                  </span>
                </div>
              </div>
              {review.comment && (
                <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                  {review.comment.length > 100 ? review.comment.substring(0, 100) + '...' : review.comment}
                </p>
              )}
              <p className="text-gray-500 text-xs mt-2">
                {new Date(review.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

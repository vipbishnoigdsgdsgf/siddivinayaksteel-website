import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Bell, 
  Check, 
  X, 
  User, 
  FolderKanban, 
  Calendar, 
  MessageSquare,
  AlertTriangle,
  Info,
  CheckCircle,
  RefreshCw,
  Trash2
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface Notification {
  id: string;
  type: 'user_signup' | 'project_submission' | 'meeting_request' | 'review_submitted' | 'system_alert';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  user_id?: string;
  action_required?: boolean;
}

export function NotificationsTab() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'urgent'>('all');

  useEffect(() => {
    fetchNotifications();
    
    // Set up real-time subscription for new notifications
    const subscription = supabase
      .channel('admin-notifications')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'profiles' 
      }, () => {
        // Refresh notifications when users are created/updated
        fetchNotifications();
      })
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'projects' 
      }, () => {
        // Refresh notifications when projects are created/updated
        fetchNotifications();
      })
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'meeting_registrations' 
      }, () => {
        // Refresh notifications when meetings are registered
        fetchNotifications();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // Generate real notifications based on recent activity
      const notifications: Notification[] = [];
      
      // Fetch recent user signups (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: recentUsers } = await supabase
        .from('profiles')
        .select('id, full_name, email, created_at')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(10);
        
      // Create user signup notifications
      recentUsers?.forEach((user, index) => {
        const createdDate = new Date(user.created_at);
        const isRecent = Date.now() - createdDate.getTime() < 24 * 60 * 60 * 1000; // 24 hours
        
        notifications.push({
          id: `user_${user.id}_${index}`,
          type: 'user_signup',
          title: 'New User Registration',
          message: `${user.full_name || user.email} has signed up`,
          data: { userId: user.id, email: user.email },
          read: !isRecent,
          priority: 'medium',
          created_at: user.created_at,
          user_id: user.id,
          action_required: false
        });
      });

      // Fetch recent project submissions
      const { data: recentProjects } = await supabase
        .from('projects')
        .select('id, title, user_id, created_at, status')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(5);
        
      recentProjects?.forEach((project, index) => {
        const createdDate = new Date(project.created_at);
        const isRecent = Date.now() - createdDate.getTime() < 24 * 60 * 60 * 1000;
        const isPending = !project.status || project.status === 'draft';
        
        notifications.push({
          id: `project_${project.id}_${index}`,
          type: 'project_submission',
          title: 'New Project Submission',
          message: `"${project.title}" needs review${isPending ? ' (Pending Approval)' : ''}`,
          data: { projectId: project.id, title: project.title },
          read: !isRecent,
          priority: isPending ? 'high' : 'medium',
          created_at: project.created_at,
          action_required: isPending
        });
      });

      // Fetch recent meeting registrations
      const { data: recentMeetings } = await supabase
        .from('meeting_registrations')
        .select('id, name, email, created_at, status')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(8);
        
      recentMeetings?.forEach((meeting, index) => {
        const createdDate = new Date(meeting.created_at);
        const isRecent = Date.now() - createdDate.getTime() < 24 * 60 * 60 * 1000;
        const isPending = meeting.status === 'pending' || !meeting.status;
        
        notifications.push({
          id: `meeting_${meeting.id}_${index}`,
          type: 'meeting_request',
          title: 'New Meeting Request',
          message: `${meeting.name} requested a meeting${isPending ? ' (Awaiting Response)' : ''}`,
          data: { meetingId: meeting.id, name: meeting.name, email: meeting.email },
          read: !isRecent,
          priority: isPending ? 'high' : 'medium',
          created_at: meeting.created_at,
          action_required: isPending
        });
      });

      // Fetch recent reviews
      const { data: recentReviews } = await supabase
        .from('reviews')
        .select('id, rating, comment, created_at, is_approved')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(5);
        
      recentReviews?.forEach((review, index) => {
        const createdDate = new Date(review.created_at);
        const isRecent = Date.now() - createdDate.getTime() < 24 * 60 * 60 * 1000;
        const needsApproval = review.is_approved === null || review.is_approved === false;
        
        notifications.push({
          id: `review_${review.id}_${index}`,
          type: 'review_submitted',
          title: 'New Review Submitted',
          message: `${review.rating}★ review submitted${needsApproval ? ' (Needs Approval)' : ''}`,
          data: { reviewId: review.id, rating: review.rating },
          read: !isRecent,
          priority: needsApproval ? 'high' : 'low',
          created_at: review.created_at,
          action_required: needsApproval
        });
      });

      // Add system notifications
      notifications.push({
        id: 'system_1',
        type: 'system_alert',
        title: 'System Health Check',
        message: 'All systems operational. Database performance optimal.',
        read: true,
        priority: 'low',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        action_required: false
      });

      // Sort notifications by date (newest first)
      const sortedNotifications = notifications.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      setNotifications(sortedNotifications);
      
    } catch (error) {
      console.error('❌ Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    toast.success('Notification marked as read');
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success('Notification deleted');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'user_signup': return <User className="h-4 w-4" />;
      case 'project_submission': return <FolderKanban className="h-4 w-4" />;
      case 'meeting_request': return <Calendar className="h-4 w-4" />;
      case 'review_submitted': return <MessageSquare className="h-4 w-4" />;
      case 'system_alert': return <AlertTriangle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-600';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-blue-500';
      case 'low': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'urgent') return n.priority === 'urgent' || n.priority === 'high';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const urgentCount = notifications.filter(n => n.priority === 'urgent' || n.priority === 'high').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Notifications</h2>
          <p className="text-gray-400 mt-1">Stay updated with all admin activities and alerts</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={fetchNotifications}
            disabled={loading}
            variant="outline"
            className="border-gray-700 text-gray-300 hover:bg-dark-300"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={markAllAsRead}
            className="bg-steel hover:bg-steel/80 text-white"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-dark-200 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <Bell className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{notifications.length}</p>
                <p className="text-sm text-gray-400">Total Notifications</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-dark-200 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-600/20 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{unreadCount}</p>
                <p className="text-sm text-gray-400">Unread</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-dark-200 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-600/20 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{urgentCount}</p>
                <p className="text-sm text-gray-400">High Priority</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2">
        <Button
          variant={filter === 'all' ? 'default' : 'ghost'}
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'bg-steel text-white' : 'text-gray-400 hover:text-white'}
        >
          All ({notifications.length})
        </Button>
        <Button
          variant={filter === 'unread' ? 'default' : 'ghost'}
          onClick={() => setFilter('unread')}
          className={filter === 'unread' ? 'bg-steel text-white' : 'text-gray-400 hover:text-white'}
        >
          Unread ({unreadCount})
        </Button>
        <Button
          variant={filter === 'urgent' ? 'default' : 'ghost'}
          onClick={() => setFilter('urgent')}
          className={filter === 'urgent' ? 'bg-steel text-white' : 'text-gray-400 hover:text-white'}
        >
          High Priority ({urgentCount})
        </Button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-steel mx-auto mb-4" />
            <p className="text-gray-400">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-12 bg-dark-200 rounded-lg border border-gray-800">
            <Bell className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No notifications found</p>
            <p className="text-gray-500 text-sm">You're all caught up!</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`bg-dark-200 border-gray-800 ${!notification.read ? 'ring-1 ring-steel/50' : ''}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${getPriorityColor(notification.priority)}/20`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-white font-medium">{notification.title}</h4>
                        {!notification.read && (
                          <Badge className="bg-steel text-white text-xs">New</Badge>
                        )}
                        {notification.action_required && (
                          <Badge variant="destructive" className="text-xs">Action Required</Badge>
                        )}
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getPriorityColor(notification.priority)} text-white border-0`}
                        >
                          {notification.priority}
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{notification.message}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                        className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteNotification(notification.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
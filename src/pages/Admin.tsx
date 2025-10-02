
import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  MessageSquare, 
  Calendar, 
  Settings,
  Check,
  Bell,
  Shield,
  Activity,
  BarChart3,
  Mail,
  User
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Analytics } from '@vercel/analytics/react';
import { safeSelect } from "@/utils/supabaseUtils";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/layouts/AdminLayout";
import { DashboardTab } from "@/components/admin/tabs/DashboardTab";
import { MeetingsTab } from "@/components/admin/tabs/MeetingsTab";
import { MeetingRegistrationsTab } from "@/components/admin/tabs/MeetingRegistrationsTab";
import { UsersTab } from "@/components/admin/tabs/UsersTab";
import { ProjectsTab } from "@/components/admin/tabs/ProjectsTab";
import { AnalyticsTab } from "@/components/admin/tabs/AnalyticsTab";
import { NotificationsTab } from "@/components/admin/tabs/NotificationsTab";
import { ReviewsTab } from "@/components/admin/tabs/ReviewsTab";
import { ContactMessagesTab } from "@/components/admin/tabs/ContactMessagesTab";
import { ProfileTab } from "@/components/admin/tabs/ProfileTab";
import { 
  verifyAdminAccess, 
  createAdminSession, 
  validateAdminSession,
  clearAdminSession,
  hasPermission
} from "@/utils/adminSecurity";
import { ensureUserProfile, ensureAllUsersHaveProfiles } from "@/utils/ensureUserProfile";

export default function Admin() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [meetings, setMeetings] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminAccess, setAdminAccess] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [adminRole, setAdminRole] = useState<'SUPER_ADMIN' | 'ADMIN' | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Calculate real counts and create navigation
  const unreadNotifications = 3; // This will be calculated from real data
  const pendingReviews = reviews.filter(r => r.is_approved === null || r.is_approved === undefined).length;
  const newContactMessages = contactMessages.filter(m => m.status === 'new').length;
  
  const allNavigation = [
    { name: 'Dashboard', href: '#dashboard', icon: LayoutDashboard, count: null, id: 'dashboard', permission: 'VIEW_DASHBOARD' },
    { name: 'Analytics', href: '#analytics', icon: BarChart3, count: null, id: 'analytics', permission: 'VIEW_DASHBOARD' },
    { name: 'Users', href: '#users', icon: Users, count: users.length || 0, id: 'users', permission: 'VIEW_USERS' },
    { name: 'Projects', href: '#projects', icon: FolderKanban, count: projects.length || 0, id: 'projects', permission: 'VIEW_PROJECTS' },
    { name: 'Reviews', href: '#reviews', icon: MessageSquare, count: pendingReviews || 0, id: 'reviews', permission: 'VIEW_REVIEWS' },
    { name: 'Contact Messages', href: '#contact-messages', icon: Mail, count: newContactMessages || 0, id: 'contact-messages', permission: 'VIEW_DASHBOARD' },
    { name: 'Meetings', href: '#meetings', icon: Calendar, count: meetings.length || 0, id: 'meetings', permission: 'VIEW_MEETINGS' },
    { name: 'Registrations', href: '#registrations', icon: Check, count: registrations.length || 0, id: 'registrations', permission: 'VIEW_MEETINGS' },
    { name: 'Notifications', href: '#notifications', icon: Bell, count: unreadNotifications, id: 'notifications', permission: 'VIEW_DASHBOARD' },
    { name: 'Profile', href: '#profile', icon: User, count: null, id: 'profile', permission: 'VIEW_DASHBOARD' },
    { name: 'Security', href: '#security', icon: Shield, count: null, id: 'security', permission: 'SYSTEM_SETTINGS' },
    { name: 'Settings', href: '#settings', icon: Settings, count: null, id: 'settings', permission: 'SYSTEM_SETTINGS' },
  ];
  
  // Filter navigation based on permissions (but always show basic items)
  const navigation = allNavigation.filter(item => {
    // Always show basic items
    if (['dashboard', 'analytics', 'users', 'projects', 'reviews', 'contact-messages', 'meetings', 'registrations', 'notifications', 'profile'].includes(item.id)) {
      return true;
    }
    // Check permissions for advanced items
    return permissions.includes(item.permission);
  });

  useEffect(() => {
    // Check if user is logged in
    if (!user) {
      toast.error("Admin access only. Please log in with admin credentials.");
      navigate("/login");
      return;
    }

    // Advanced admin access verification
    const checkAdmin = async () => {
      if (user && user.email) {
        try {
          // Check session first
          if (!validateAdminSession()) {
            clearAdminSession();
          }
          
          const adminResult = await verifyAdminAccess(user.email);
          
          if (!adminResult.isAdmin) {
            toast.error("🚫 Unauthorized access attempt detected");
            navigate("/");
            return;
          }
          
          // Set admin state
          setAdminAccess(true);
          setAdminUser(adminResult.user);
          setAdminRole(adminResult.role!);
          setPermissions(adminResult.permissions!);
          
          // Create secure session
          if (adminResult.user) {
            createAdminSession(adminResult.user);
          }
          
          // Welcome message with role
          toast.success(`🎯 Welcome, ${adminResult.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}!`);
          
          // Ensure current user has a profile in database
          await ensureUserProfile(user);
          
          // Try to ensure all users have profiles (if admin has permissions)
          if (adminResult.role === 'SUPER_ADMIN') {
            await ensureAllUsersHaveProfiles();
          }
          
          // Fetch data only after successful verification
          fetchAdminData();
          
        } catch (error) {
          console.error("❌ Admin verification failed:", error);
          toast.error("Security verification failed");
          navigate("/");
        }
      }
    };
    
    checkAdmin();
  }, [user, navigate]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      console.log('🔄 Fetching real website data from database...');
      
      // Fetch meetings with better error handling
      try {
        const { data: meetingsData, error: meetingsError } = await supabase
          .from('meetings')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (meetingsError) {
          console.warn('Meetings table might not exist:', meetingsError.message);
          setMeetings([]);
        } else {
          console.log('📅 Meetings loaded:', meetingsData?.length || 0);
          setMeetings(meetingsData || []);
        }
      } catch (err) {
        console.warn('Meetings fetch failed:', err);
        setMeetings([]);
      }
      
      // Fetch meeting registrations with better error handling
      try {
        const { data: registrationsData, error: registrationsError } = await supabase
          .from('meeting_registrations')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (registrationsError) {
          console.warn('Meeting registrations table might not exist:', registrationsError.message);
          setRegistrations([]);
        } else {
          console.log('📋 Registrations loaded:', registrationsData?.length || 0);
          setRegistrations(registrationsData || []);
        }
      } catch (err) {
        console.warn('Registrations fetch failed:', err);
        setRegistrations([]);
      }
      
      // Fetch website reviews with user and project information
      try {
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select(`
            *,
            profiles:user_id (
              full_name,
              username,
              avatar_url
            ),
            projects:project_id (
              title,
              category
            )
          `)
          .order('created_at', { ascending: false });
        
        if (reviewsError) {
          console.warn('Reviews table error:', reviewsError.message);
          setReviews([]);
        } else {
          console.log('⭐ Website reviews loaded:', reviewsData?.length || 0);
          setReviews(reviewsData || []);
        }
      } catch (err) {
        console.warn('Reviews fetch failed:', err);
        setReviews([]);
      }
      
      // Fetch website users (profiles) - try different approaches
      try {
        console.log('👥 Fetching users from profiles table...');
        
        // First try with last_sign_in_at column
        let { data: usersData, error: usersError } = await supabase
          .from('profiles')
          .select(`
            *,
            last_sign_in_at
          `)
          .order('created_at', { ascending: false });
        
        if (usersError && usersError.message.includes('last_sign_in_at')) {
          console.log('👥 Retrying without last_sign_in_at column...');
          // Retry without last_sign_in_at if column doesn't exist
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });
          
          usersData = fallbackData;
          usersError = fallbackError;
        }
        
        if (usersError) {
          console.error('👥 Profiles table error:', usersError);
          
          // Try auth.users as fallback (if accessible)
          console.log('👥 Trying auth.users as fallback...');
          try {
            const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
            if (!authError && authUsers?.users) {
              const mappedUsers = authUsers.users.map(user => ({
                id: user.id,
                email: user.email || 'No email',
                full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
                username: user.user_metadata?.username || user.user_metadata?.preferred_username || null,
                avatar_url: user.user_metadata?.avatar_url || null,
                created_at: user.created_at,
                last_sign_in_at: user.last_sign_in_at,
                is_active: true
              }));
              console.log('👥 Users loaded from auth.users:', mappedUsers.length);
              setUsers(mappedUsers);
              return;
            }
          } catch (authErr) {
            console.warn('Auth users fetch also failed:', authErr);
          }
          
          setUsers([]);
        } else {
          console.log('👥 Website users loaded from profiles:', usersData?.length || 0);
          console.log('👥 Sample user data:', usersData?.[0]);
          setUsers(usersData || []);
        }
      } catch (err) {
        console.error('Users fetch completely failed:', err);
        setUsers([]);
      }
      
      // Fetch website projects/gallery with user information
      try {
        // First try to get from gallery table (since that's where your real data is)
        const { data: galleryData, error: galleryError } = await supabase
          .from('gallery')
          .select(`
            *,
            profiles:user_id (
              full_name,
              username,
              avatar_url
            )
          `)
          .order('created_at', { ascending: false });
        
        if (galleryError) {
          console.warn('Gallery table error, trying projects table:', galleryError.message);
          
          // Fallback to projects table
          const { data: projectsData, error: projectsError } = await supabase
            .from('projects')
            .select(`
              *,
              profiles:user_id (
                full_name,
                username,
                avatar_url
              )
            `)
            .order('created_at', { ascending: false });
          
          if (projectsError) {
            console.warn('Projects table also failed:', projectsError.message);
            setProjects([]);
          } else {
            console.log('📁 Website projects loaded (from projects table):', projectsData?.length || 0);
            setProjects(projectsData || []);
          }
        } else {
          console.log('📁 Website projects loaded (from gallery table):', galleryData?.length || 0);
          // Map gallery data to project format
          const mappedProjects = galleryData.map(item => ({
            ...item,
            title: item.title || `Project ${item.id.substring(0, 8)}`,
            status: item.status || 'published',
            is_featured: item.is_featured || false
          }));
          setProjects(mappedProjects || []);
        }
      } catch (err) {
        console.warn('Projects fetch failed:', err);
        setProjects([]);
      }
      
      // Fetch contact messages with better error handling
      try {
        const { data: contactMessagesData, error: messagesError } = await supabase
          .from('contact_messages')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (messagesError) {
          console.warn('Contact messages table might not exist:', messagesError.message);
          setContactMessages([]);
        } else {
          console.log('📧 Contact messages loaded:', contactMessagesData?.length || 0);
          setContactMessages(contactMessagesData || []);
        }
      } catch (err) {
        console.warn('Contact messages fetch failed:', err);
        setContactMessages([]);
      }
      
      // Show success summary (wait a moment for state to update)
      setTimeout(() => {
        const totalData = {
          users: users.length,
          projects: projects.length,
          reviews: reviews.length,
          meetings: meetings.length,
          registrations: registrations.length,
          contactMessages: contactMessages.length
        };
        
        const totalRecords = Object.values(totalData).reduce((sum, count) => sum + count, 0);
        
        console.log('✅ Admin data loaded successfully:', totalData);
        if (totalRecords > 0) {
          toast.success(`🚀 Admin data loaded! ${totalRecords} total records`);
        } else {
          toast.info('📊 No data found - consider creating test data');
        }
      }, 100);
      
    } catch (error) {
      console.error("❌ Error fetching admin data:", error);
      toast.error("Failed to load some admin data - check console for details");
    } finally {
      setLoading(false);
    }
  };

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="h-16 w-16 border-4 border-steel/20 border-t-steel rounded-full animate-spin mx-auto mb-6"></div>
            <Shield className="h-8 w-8 text-steel absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Initializing Admin Dashboard</h3>
          <p className="text-gray-400">Verifying credentials and loading secure environment...</p>
          <div className="mt-4 flex items-center justify-center space-x-1">
            <div className="h-2 w-2 bg-steel rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="h-2 w-2 bg-steel rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="h-2 w-2 bg-steel rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!adminAccess) {
    return (
      <div className="min-h-screen bg-dark-100 flex items-center justify-center">
        <div className="text-center bg-dark-200 p-8 rounded-lg border border-gray-800">
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-gray-300 mb-6">You don't have permission to access the admin panel.</p>
          <button 
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-steel text-white rounded hover:bg-steel-600"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Analytics />
      <AdminLayout
        navigation={navigation}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        activeTab={activeTab}
        handleNavClick={handleNavClick}
        activeTabName={navigation.find(item => item.id === activeTab)?.name || 'Dashboard'}
        adminUser={adminUser}
        adminRole={adminRole}
      >
          {activeTab === 'dashboard' && (
            <DashboardTab 
              users={users}
              projects={projects}
              reviews={reviews}
              meetings={meetings}
              registrations={registrations}
              onDataRefresh={fetchAdminData}
              onTabChange={handleNavClick}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsTab />
          )}

          {activeTab === 'meetings' && (
            <MeetingsTab meetings={meetings} />
          )}
          
          {activeTab === 'registrations' && (
            <MeetingRegistrationsTab />
          )}

          {activeTab === 'users' && (
            <UsersTab users={users} onUserUpdate={fetchAdminData} />
          )}

          {activeTab === 'projects' && (
            <ProjectsTab projects={projects} onProjectUpdate={fetchAdminData} />
          )}

          {activeTab === 'notifications' && (
            <NotificationsTab />
          )}

          {activeTab === 'reviews' && (
            <ReviewsTab reviews={reviews} onReviewUpdate={fetchAdminData} />
          )}

          {activeTab === 'contact-messages' && (
            <ContactMessagesTab messages={contactMessages} onMessageUpdate={fetchAdminData} />
          )}

          {activeTab === 'profile' && (
            <ProfileTab 
              adminUser={adminUser} 
              adminRole={adminRole} 
              onProfileUpdate={fetchAdminData} 
            />
          )}

          {/* Security and Settings tabs coming soon */}
          {(activeTab === 'security' || activeTab === 'settings') && (
            <div className="bg-dark-200 border border-gray-800 rounded-lg p-6">
              <div className="text-center py-12">
                <div className="mb-4">
                  {activeTab === 'security' && <Shield className="h-16 w-16 text-gray-600 mx-auto" />}
                  {activeTab === 'settings' && <Settings className="h-16 w-16 text-gray-600 mx-auto" />}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Panel
                </h3>
                <p className="text-gray-400 mb-4">Advanced {activeTab} management features coming soon</p>
                <p className="text-gray-500 text-sm">This section will include comprehensive {activeTab} tools and controls</p>
              </div>
            </div>
          )}
      </AdminLayout>
    </>
  );
}

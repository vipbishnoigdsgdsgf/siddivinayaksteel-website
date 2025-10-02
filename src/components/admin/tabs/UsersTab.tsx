import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  MoreVertical, 
  User,
  Mail,
  Calendar,
  Shield,
  Ban,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { safeUpdate } from "@/utils/supabaseUtils";
import { UsersDebug } from '../debug/UsersDebug';

interface User {
  id: string;
  email: string;
  full_name?: string;
  username?: string;
  avatar_url?: string;
  created_at: string;
  last_sign_in_at?: string;
  is_active?: boolean;
  phone?: string;
  location?: string;
}

interface UsersTabProps {
  users: User[];
  onUserUpdate: () => void;
}

export function UsersTab({ users, onUserUpdate }: UsersTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  // Debug logging
  console.log('UsersTab received users:', users?.length || 0, users);

  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      (user.email?.toLowerCase() || '').includes(searchLower) ||
      (user.full_name?.toLowerCase() || '').includes(searchLower) ||
      (user.username?.toLowerCase() || '').includes(searchLower);
    
    const matchesStatus = 
      selectedStatus === 'all' ||
      (selectedStatus === 'active' && user.is_active !== false) ||
      (selectedStatus === 'inactive' && user.is_active === false);
    
    return matchesSearch && matchesStatus;
  });

  const handleUserAction = async (userId: string, action: 'activate' | 'deactivate' | 'delete') => {
    setLoading(true);
    try {
      let updateData: any = {};
      let successMessage = '';
      
      switch (action) {
        case 'activate':
          updateData = { 
            is_active: true
          };
          successMessage = 'User activated successfully ✅';
          break;
        case 'deactivate':
          updateData = { 
            is_active: false
          };
          successMessage = 'User deactivated successfully ⏸️';
          break;
        case 'delete':
          // Soft delete - mark as inactive since we don't have deleted_at column
          updateData = { 
            is_active: false
          };
          successMessage = 'User account deactivated successfully 🗑️';
          break;
      }

      // Update user in database
      const { error } = await safeUpdate('profiles', updateData, [{ column: 'id', value: userId }]);
      
      if (error) {
        throw error;
      }

      // Log admin activity
      await logAdminActivity(action, 'user', userId, updateData);
      
      toast.success(successMessage);
      onUserUpdate();
    } catch (error: any) {
      console.error(`❌ Error ${action}ing user:`, error);
      toast.error(`Failed to ${action} user: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Log admin activities for audit trail
  const logAdminActivity = async (action: string, resourceType: string, resourceId: string, changes: any) => {
    try {
      const logData = {
        action: `${action.toUpperCase()}_${resourceType.toUpperCase()}`,
        resource_type: resourceType,
        resource_id: resourceId,
        changes: JSON.stringify(changes),
        timestamp: new Date().toISOString(),
        admin_email: 'current_admin@example.com', // This should come from auth context
      };
      
      console.log('📊 Admin Activity:', logData);
      // In production, store this in an admin_logs table
      // await supabase.from('admin_logs').insert(logData);
    } catch (error) {
      console.warn('Failed to log admin activity:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Website Users Management</h2>
          <p className="text-gray-400">Manage registered users from your website</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-dark-200 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Users</option>
            <option value="active">Active Users</option>
            <option value="inactive">Inactive Users</option>
          </select>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-dark-200 border-gray-700 text-white w-64"
            />
          </div>
        </div>
      </div>

      <div className="bg-dark-200 border border-gray-800 rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700 hover:bg-dark-300">
              <TableHead className="text-gray-300">User</TableHead>
              <TableHead className="text-gray-300">Email</TableHead>
              <TableHead className="text-gray-300">Joined</TableHead>
              <TableHead className="text-gray-300">Last Sign In</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-gray-300 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="border-gray-700 hover:bg-dark-300">
                <TableCell>
                  <div className="flex items-center space-x-3">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.full_name || user.username || "User"}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-steel/20 flex items-center justify-center">
                        <User className="h-4 w-4 text-steel" />
                      </div>
                    )}
                    <div>
                      <p className="text-white font-medium">
                        {user.full_name || user.username || "Unnamed User"}
                      </p>
                      {user.username && user.full_name && (
                        <p className="text-gray-400 text-sm">@{user.username}</p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">{user.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">{formatDate(user.created_at)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-gray-300">
                    {user.last_sign_in_at ? formatDate(user.last_sign_in_at) : 'Never'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {user.is_active !== false ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-green-400">Active</span>
                      </>
                    ) : (
                      <>
                        <Ban className="h-4 w-4 text-red-500" />
                        <span className="text-red-400">Inactive</span>
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-dark-200 border-gray-700">
                      {user.is_active !== false ? (
                        <DropdownMenuItem
                          onClick={() => handleUserAction(user.id, 'deactivate')}
                          disabled={loading}
                          className="text-yellow-400 hover:text-yellow-300 hover:bg-dark-300"
                        >
                          <Ban className="h-4 w-4 mr-2" />
                          Deactivate
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => handleUserAction(user.id, 'activate')}
                          disabled={loading}
                          className="text-green-400 hover:text-green-300 hover:bg-dark-300"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Activate
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => handleUserAction(user.id, 'delete')}
                        disabled={loading}
                        className="text-red-400 hover:text-red-300 hover:bg-dark-300"
                      >
                        <Ban className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            {users.length === 0 ? (
              <div>
                <p className="text-gray-400 text-lg mb-2">No users found in database</p>
                <p className="text-gray-500 text-sm mb-4">Users will appear here when they register on your website</p>
                <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4 max-w-md mx-auto">
                  <p className="text-blue-400 text-sm">
                    🔍 Debug Info: Total users received: {users.length}
                  </p>
                  <p className="text-gray-400 text-xs mt-2">
                    Make sure users are registering through your website's signup flow
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-gray-400 text-lg">No users match your filters</p>
                <p className="text-gray-500">Try adjusting your search criteria or status filter</p>
                <p className="text-blue-400 text-sm mt-2">Total users available: {users.length}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-dark-200 border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">User Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-dark-300 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Total Users</p>
            <p className="text-2xl font-bold text-white">{users.length}</p>
          </div>
          <div className="bg-dark-300 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Active Users</p>
            <p className="text-2xl font-bold text-green-400">
              {users.filter(u => u.is_active !== false).length}
            </p>
          </div>
          <div className="bg-dark-300 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">New This Month</p>
            <p className="text-2xl font-bold text-blue-400">
              {users.filter(u => 
                new Date(u.created_at).getMonth() === new Date().getMonth()
              ).length}
            </p>
          </div>
          <div className="bg-dark-300 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">With Profiles</p>
            <p className="text-2xl font-bold text-purple-400">
              {users.filter(u => u.full_name || u.username).length}
            </p>
          </div>
        </div>
      </div>
      
      {/* Debug Panel - Remove after fixing users issue */}
      <UsersDebug />
    </div>
  );
}

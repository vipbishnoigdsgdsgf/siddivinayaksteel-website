import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  FolderKanban,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { safeUpdate, safeDelete } from "@/utils/supabaseUtils";

interface Project {
  id: string;
  title: string;
  description?: string;
  category?: string;
  user_id?: string;
  created_at: string;
  updated_at?: string;
  status?: 'draft' | 'published' | 'archived';
  is_featured?: boolean;
  images?: string[];
  profiles?: {
    full_name?: string;
    username?: string;
    avatar_url?: string;
  };
}

interface ProjectsTabProps {
  projects: Project[];
  onProjectUpdate: () => void;
}

export function ProjectsTab({ projects, onProjectUpdate }: ProjectsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(false);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.category?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleProjectAction = async (projectId: string, action: 'publish' | 'archive' | 'feature' | 'unfeature' | 'delete') => {
    setLoading(true);
    try {
      let updateData: any = {};
      let successMessage = '';
      
      switch (action) {
        case 'publish':
          updateData = { 
            status: 'published',
            published_at: new Date().toISOString(),
            updated_at: new Date().toISOString() 
          };
          successMessage = 'Project published successfully 🚀';
          break;
        case 'archive':
          updateData = { 
            status: 'archived',
            archived_at: new Date().toISOString(),
            updated_at: new Date().toISOString() 
          };
          successMessage = 'Project archived successfully 🗄️';
          break;
        case 'feature':
          updateData = { 
            is_featured: true,
            featured_at: new Date().toISOString(),
            updated_at: new Date().toISOString() 
          };
          successMessage = 'Project featured successfully ⭐';
          break;
        case 'unfeature':
          updateData = { 
            is_featured: false,
            unfeatured_at: new Date().toISOString(),
            updated_at: new Date().toISOString() 
          };
          successMessage = 'Project unfeatured successfully 🔄';
          break;
        case 'delete':
          // Soft delete for projects
          const deleteData = {
            status: 'deleted',
            deleted_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          const { error: deleteError } = await safeUpdate('projects', deleteData, [{ column: 'id', value: projectId }]);
          if (deleteError) throw deleteError;
          
          await logProjectActivity(action, projectId, deleteData);
          toast.success("Project deleted successfully 🗑️");
          onProjectUpdate();
          return;
      }

      // Update project in database
      const { error } = await safeUpdate('projects', updateData, [{ column: 'id', value: projectId }]);
      
      if (error) {
        throw error;
      }

      // Log admin activity
      await logProjectActivity(action, projectId, updateData);
      
      toast.success(successMessage);
      onProjectUpdate();
    } catch (error: any) {
      console.error(`❌ Error ${action}ing project:`, error);
      toast.error(`Failed to ${action} project: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Log project activities for audit trail
  const logProjectActivity = async (action: string, projectId: string, changes: any) => {
    try {
      const logData = {
        action: `${action.toUpperCase()}_PROJECT`,
        resource_type: 'project',
        resource_id: projectId,
        changes: JSON.stringify(changes),
        timestamp: new Date().toISOString(),
        admin_email: 'current_admin@example.com', // This should come from auth context
      };
      
      console.log('📊 Project Activity:', logData);
      // In production, store this in an admin_logs table
      // await supabase.from('admin_logs').insert(logData);
    } catch (error) {
      console.warn('Failed to log project activity:', error);
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-600 hover:bg-green-700"><CheckCircle className="h-3 w-3 mr-1" />Published</Badge>;
      case 'archived':
        return <Badge variant="secondary"><XCircle className="h-3 w-3 mr-1" />Archived</Badge>;
      case 'draft':
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Draft</Badge>;
      default:
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Draft</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getProjectStats = () => {
    return {
      total: projects.length,
      published: projects.filter(p => p.status === 'published').length,
      featured: projects.filter(p => p.is_featured).length,
      thisMonth: projects.filter(p => 
        new Date(p.created_at).getMonth() === new Date().getMonth()
      ).length,
    };
  };

  const stats = getProjectStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Projects Management</h2>
          <p className="text-gray-400">Manage project listings and content</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-dark-200 border border-gray-700 text-white rounded-lg px-3 py-2"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-dark-200 border-gray-700 text-white w-64"
            />
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-dark-200 p-4 rounded-lg border border-gray-800">
          <p className="text-gray-400 text-sm">Total Projects</p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="bg-dark-200 p-4 rounded-lg border border-gray-800">
          <p className="text-gray-400 text-sm">Published</p>
          <p className="text-2xl font-bold text-green-400">{stats.published}</p>
        </div>
        <div className="bg-dark-200 p-4 rounded-lg border border-gray-800">
          <p className="text-gray-400 text-sm">Featured</p>
          <p className="text-2xl font-bold text-yellow-400">{stats.featured}</p>
        </div>
        <div className="bg-dark-200 p-4 rounded-lg border border-gray-800">
          <p className="text-gray-400 text-sm">This Month</p>
          <p className="text-2xl font-bold text-blue-400">{stats.thisMonth}</p>
        </div>
      </div>

      <div className="bg-dark-200 border border-gray-800 rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700 hover:bg-dark-300">
              <TableHead className="text-gray-300">Project</TableHead>
              <TableHead className="text-gray-300">Owner</TableHead>
              <TableHead className="text-gray-300">Category</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-gray-300">Created</TableHead>
              <TableHead className="text-gray-300 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.map((project) => (
              <TableRow key={project.id} className="border-gray-700 hover:bg-dark-300">
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-lg bg-steel/20 flex items-center justify-center">
                      <FolderKanban className="h-5 w-5 text-steel" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{project.title}</p>
                      {project.description && (
                        <p className="text-gray-400 text-sm truncate max-w-xs">
                          {project.description.length > 50 
                            ? `${project.description.substring(0, 50)}...` 
                            : project.description}
                        </p>
                      )}
                      {project.is_featured && (
                        <Badge variant="outline" className="text-yellow-400 border-yellow-400 mt-1">
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {project.profiles?.avatar_url ? (
                      <img
                        src={project.profiles.avatar_url}
                        alt="Owner"
                        className="h-6 w-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-6 w-6 rounded-full bg-gray-600 flex items-center justify-center">
                        <User className="h-3 w-3 text-gray-300" />
                      </div>
                    )}
                    <span className="text-gray-300 text-sm">
                      {project.profiles?.full_name || project.profiles?.username || 'Unknown'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-gray-300">{project.category || 'Uncategorized'}</span>
                </TableCell>
                <TableCell>
                  {getStatusBadge(project.status)}
                </TableCell>
                <TableCell>
                  <span className="text-gray-300">{formatDate(project.created_at)}</span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-dark-200 border-gray-700">
                      <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-dark-300">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-dark-300">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      
                      {project.status !== 'published' && (
                        <DropdownMenuItem
                          onClick={() => handleProjectAction(project.id, 'publish')}
                          disabled={loading}
                          className="text-green-400 hover:text-green-300 hover:bg-dark-300"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Publish
                        </DropdownMenuItem>
                      )}
                      
                      {project.status !== 'archived' && (
                        <DropdownMenuItem
                          onClick={() => handleProjectAction(project.id, 'archive')}
                          disabled={loading}
                          className="text-yellow-400 hover:text-yellow-300 hover:bg-dark-300"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                      )}
                      
                      {!project.is_featured ? (
                        <DropdownMenuItem
                          onClick={() => handleProjectAction(project.id, 'feature')}
                          disabled={loading}
                          className="text-purple-400 hover:text-purple-300 hover:bg-dark-300"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Feature
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => handleProjectAction(project.id, 'unfeature')}
                          disabled={loading}
                          className="text-purple-400 hover:text-purple-300 hover:bg-dark-300"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Unfeature
                        </DropdownMenuItem>
                      )}
                      
                      <DropdownMenuItem
                        onClick={() => handleProjectAction(project.id, 'delete')}
                        disabled={loading}
                        className="text-red-400 hover:text-red-300 hover:bg-dark-300"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <FolderKanban className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No projects found</p>
            <p className="text-gray-500">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
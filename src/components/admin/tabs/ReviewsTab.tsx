import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  MessageSquare,
  Star,
  Check,
  X,
  Trash2,
  Eye,
  User,
  Calendar,
  Clock
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface Review {
  id: string;
  rating: number;
  comment?: string;
  reviewer_name?: string;
  reviewer_email?: string;
  anonymous_name?: string;
  anonymous_email?: string;
  project_type?: string;
  is_approved?: boolean;
  created_at: string;
  updated_at?: string;
  user_id?: string;
  project_id?: string;
}

interface ReviewsTabProps {
  reviews: Review[];
  onReviewUpdate: () => void;
}

export function ReviewsTab({ reviews, onReviewUpdate }: ReviewsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(false);

  const filteredReviews = reviews.filter(review => {
    const searchText = searchQuery.toLowerCase();
    const matchesSearch = 
      review.comment?.toLowerCase().includes(searchText) ||
      review.reviewer_name?.toLowerCase().includes(searchText) ||
      review.reviewer_email?.toLowerCase().includes(searchText) ||
      review.anonymous_name?.toLowerCase().includes(searchText) ||
      review.project_type?.toLowerCase().includes(searchText);
    
    const matchesStatus = 
      statusFilter === "all" ||
      (statusFilter === "approved" && review.is_approved === true) ||
      (statusFilter === "pending" && (review.is_approved === null || review.is_approved === undefined)) ||
      (statusFilter === "rejected" && review.is_approved === false);
    
    return matchesSearch && matchesStatus;
  });

  const handleReviewAction = async (reviewId: string, action: 'approve' | 'reject' | 'delete') => {
    setLoading(true);
    try {
      let updateData: any = {};
      let successMessage = '';
      
      switch (action) {
        case 'approve':
          updateData = { 
            is_approved: true,
            approved_at: new Date().toISOString(),
            updated_at: new Date().toISOString() 
          };
          successMessage = 'Review approved successfully ✅';
          break;
        case 'reject':
          updateData = { 
            is_approved: false,
            rejected_at: new Date().toISOString(),
            updated_at: new Date().toISOString() 
          };
          successMessage = 'Review rejected successfully ❌';
          break;
        case 'delete':
          const { error: deleteError } = await supabase
            .from('reviews')
            .delete()
            .eq('id', reviewId);
          
          if (deleteError) throw deleteError;
          
          toast.success("Review deleted successfully 🗑️");
          onReviewUpdate();
          return;
      }

      const { error } = await supabase
        .from('reviews')
        .update(updateData)
        .eq('id', reviewId);
      
      if (error) throw error;

      console.log(`📝 Review ${action}d:`, { reviewId, updateData });
      toast.success(successMessage);
      onReviewUpdate();
      
    } catch (error: any) {
      console.error(`❌ Error ${action}ing review:`, error);
      toast.error(`Failed to ${action} review: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (review: Review) => {
    if (review.is_approved === true) {
      return <Badge className="bg-green-600 hover:bg-green-700"><Check className="h-3 w-3 mr-1" />Approved</Badge>;
    } else if (review.is_approved === false) {
      return <Badge variant="destructive"><X className="h-3 w-3 mr-1" />Rejected</Badge>;
    } else {
      return <Badge variant="outline" className="text-yellow-400 border-yellow-400"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    }
  };

  const getStarRating = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-400'
            }`}
          />
        ))}
        <span className="text-sm text-gray-300 ml-2">({rating}/5)</span>
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getReviewStats = () => {
    return {
      total: reviews.length,
      approved: reviews.filter(r => r.is_approved === true).length,
      pending: reviews.filter(r => r.is_approved === null || r.is_approved === undefined).length,
      rejected: reviews.filter(r => r.is_approved === false).length,
      averageRating: reviews.length > 0 
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : '0.0',
    };
  };

  const stats = getReviewStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Reviews Management</h2>
          <p className="text-gray-400 mt-1">Moderate customer reviews and feedback</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-dark-200 border border-gray-700 text-white rounded-lg px-3 py-2"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-dark-200 border-gray-700 text-white w-64"
            />
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-dark-200 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <MessageSquare className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
                <p className="text-sm text-gray-400">Total Reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-dark-200 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Check className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-2xl font-bold text-white">{stats.approved}</p>
                <p className="text-sm text-gray-400">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-dark-200 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Clock className="h-8 w-8 text-yellow-400" />
              <div>
                <p className="text-2xl font-bold text-white">{stats.pending}</p>
                <p className="text-sm text-gray-400">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-dark-200 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Star className="h-8 w-8 text-yellow-400" />
              <div>
                <p className="text-2xl font-bold text-white">{stats.averageRating}</p>
                <p className="text-sm text-gray-400">Avg Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews Table */}
      <Card className="bg-dark-200 border-gray-800">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700 hover:bg-dark-300">
                <TableHead className="text-gray-300">Review</TableHead>
                <TableHead className="text-gray-300">Rating</TableHead>
                <TableHead className="text-gray-300">Reviewer</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Date</TableHead>
                <TableHead className="text-gray-300 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReviews.map((review) => (
                <TableRow key={review.id} className="border-gray-700 hover:bg-dark-300">
                  <TableCell className="max-w-sm">
                    <div>
                      <p className="text-white font-medium mb-1">
                        {review.project_type && (
                          <Badge variant="outline" className="mr-2 text-xs">
                            {review.project_type}
                          </Badge>
                        )}
                      </p>
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {review.comment || 'No comment provided'}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStarRating(review.rating)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-white text-sm font-medium">
                          {review.reviewer_name || review.anonymous_name || 'Anonymous'}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {review.reviewer_email || review.anonymous_email || 'No email'}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(review)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-300 text-sm">
                        {formatDate(review.created_at)}
                      </span>
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
                        <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-dark-300">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        
                        {review.is_approved !== true && (
                          <DropdownMenuItem
                            onClick={() => handleReviewAction(review.id, 'approve')}
                            disabled={loading}
                            className="text-green-400 hover:text-green-300 hover:bg-dark-300"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Approve
                          </DropdownMenuItem>
                        )}
                        
                        {review.is_approved !== false && (
                          <DropdownMenuItem
                            onClick={() => handleReviewAction(review.id, 'reject')}
                            disabled={loading}
                            className="text-red-400 hover:text-red-300 hover:bg-dark-300"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Reject
                          </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuItem
                          onClick={() => handleReviewAction(review.id, 'delete')}
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

          {filteredReviews.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No reviews found</p>
              <p className="text-gray-500 text-sm">
                {reviews.length === 0 
                  ? "No reviews have been submitted yet"
                  : "Try adjusting your search criteria or filters"
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
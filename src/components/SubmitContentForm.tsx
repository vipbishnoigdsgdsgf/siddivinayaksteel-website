
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { safeInsert } from "@/utils/supabaseUtils";
import { useAuth } from "@/context/AuthContext";

export default function SubmitContentForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState(5);
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    comment: "",
    projectType: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      projectType: value
    }));
  };

  const handleRatingClick = (value: number) => {
    setRating(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Create review data object based on whether user is logged in or not
      const reviewData: any = {
        rating: rating,
        comment: formData.comment,
        project_id: null, // For general website review
        project_type: formData.projectType,
        is_approved: false, // Reviews need approval by default
      };

      // If user is logged in, use their ID and profile info
      if (user?.id) {
        reviewData.user_id = user.id;
        reviewData.reviewer_name = null; // Clear anonymous fields when user is logged in
        reviewData.reviewer_email = null;
        reviewData.anonymous_name = null;
        reviewData.anonymous_email = null;
      } else {
        // For non-logged-in users, store their details in anonymous fields
        reviewData.user_id = null;
        reviewData.reviewer_name = formData.name; // Keep for backward compatibility
        reviewData.reviewer_email = formData.email; // Keep for backward compatibility  
        reviewData.anonymous_name = formData.name;
        reviewData.anonymous_email = formData.email;
      }
      
      const { error } = await safeInsert("reviews", reviewData);

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      toast.success("Thank you! Your review has been submitted successfully and is pending approval!");
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        comment: "",
        projectType: ""
      });
      setRating(5);
    } catch (error: any) {
      console.error("Error submitting review:", error);
      
      // Provide more specific error messages
      if (error.code === 'PGRST204') {
        toast.error("Database schema error. Please contact the administrator.");
      } else if (error.message?.includes('column')) {
        toast.error("Database configuration issue. Please try again later.");
      } else {
        toast.error("Failed to submit your review. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="neumorphic-card">
      <h3 className="text-xl font-bold text-white mb-6">Submit Your Review</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {!user && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="name" className="text-steel mb-2 block">Your Name</Label>
                <Input 
                  id="name" 
                  placeholder="Enter your name" 
                  className="neumorphic-input"
                  value={formData.name}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-steel mb-2 block">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter your email" 
                  className="neumorphic-input"
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>
          )}
          
          <div>
            <Label htmlFor="projectType" className="text-steel mb-2 block">Project Type</Label>
            <Select value={formData.projectType} onValueChange={handleSelectChange}>
              <SelectTrigger className="neumorphic-input">
                <SelectValue placeholder="Select project type" />
              </SelectTrigger>
              <SelectContent className="bg-dark-200 border-dark-300 text-white">
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="custom">Custom Design</SelectItem>
                <SelectItem value="general">General Feedback</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="text-steel mb-2 block">Rating</Label>
            <div className="flex space-x-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  className="focus:outline-none"
                >
                  <Star 
                    className={`h-6 w-6 ${star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-600"}`} 
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <Label htmlFor="comment" className="text-steel mb-2 block">Your Review</Label>
            <Textarea 
              id="comment" 
              placeholder="Share your experience..." 
              className="neumorphic-input min-h-[120px]"
              value={formData.comment}
              onChange={handleChange}
              required 
            />
          </div>
          
          <Button 
            type="submit" 
            variant="steel" 
            className="w-full h-12 rounded-xl shadow-neumorphic hover:shadow-neumorphic-inset" 
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </form>
    </div>
  );
}


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import ProfileImageUpload from "@/components/profile/ProfileImageUpload";
import { MapPin, Loader2 } from "lucide-react";
import { ProfileService } from "../services/profileService";

export default function ProfileSettings() {
  const { profile, user, setProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    phone: "",
    location: "",
  });
  const navigate = useNavigate();

  // Load profile data when component mounts
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        username: profile.username || "",
        phone: profile.phone || "",
        location: profile.location || "",
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to update your profile");
      return;
    }
    
    setIsLoading(true);

    try {
      // Check if username is already taken (only if username is changed)
      if (formData.username !== profile?.username && formData.username) {
        // For now, skip username uniqueness check due to schema issues
        // TODO: Implement proper username check with direct REST API call
        console.log('Username changed to:', formData.username);
      }
      
      // Update profile with non-empty values only
      const updateData: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };
      
      if (formData.full_name) updateData.full_name = formData.full_name;
      if (formData.phone !== undefined) updateData.phone = formData.phone;
      if (formData.location !== undefined) updateData.location = formData.location;
      
      // Only update username if it's not empty
      if (formData.username) {
        updateData.username = formData.username;
      }
      
      // Use new ProfileService
      const updatedProfile = await ProfileService.updateProfile(user.id, updateData);

      toast.success("Profile updated successfully");
      
      // Update local profile state
      if (updatedProfile && profile) {
        setProfile({
          ...profile,
          ...updatedProfile
        });
      }
      
      // Navigate back to profile page
      navigate(`/profile/${user.id}`);
      
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-dark-100">
      <Navbar />
      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-dark-200 p-8 rounded-lg border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-6">Profile Settings</h2>
            
            <div className="mb-8">
              <ProfileImageUpload />
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">              
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="bg-dark-300 border-gray-700"
                />
              </div>
              
              <div>
                <Label htmlFor="username">Username (optional)</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="bg-dark-300 border-gray-700"
                  placeholder="Leave blank if you don't want a username"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-dark-300 border-gray-700"
                />
              </div>
              
              <div>
                <Label htmlFor="location" className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-steel" />
                  Location
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="bg-dark-300 border-gray-700"
                  placeholder="Enter your location (e.g., Hyderabad, India)"
                />
              </div>
              
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="border-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-steel hover:bg-steel-dark"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" /> 
                      Saving...
                    </div>
                  ) : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

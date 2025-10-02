
import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Loader } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { useProfileData } from "@/hooks/useProfileData";

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const activeTabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(activeTabParam || "reviews");
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const isCurrentUser = !id || id === user?.id;
  
  useEffect(() => {
    if (activeTabParam) {
      setActiveTab(activeTabParam);
    }
  }, [activeTabParam]);

  const {
    loading,
    errors,
    profileData,
    projects,
    likedProjects,
    savedProjects,
    reviews,
  } = useProfileData(id, isCurrentUser);
  
  if (!user) {
    navigate('/login');
    return null;
  }
  
  if (loading.profile || loading.projects) {
    return (
      <div className="min-h-screen bg-dark-100">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <Loader className="h-8 w-8 animate-spin text-steel" />
          <span className="ml-2 text-steel">Loading profile...</span>
        </div>
      </div>
    );
  }
  
  if (!profileData && !loading.profile) {
    return (
      <div className="min-h-screen bg-dark-100">
        <Navbar />
        <div className="flex items-center justify-center h-screen flex-col">
          <h1 className="text-2xl font-bold text-white mb-4">Profile Not Found</h1>
          <p className="text-gray-400">The requested profile could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-100">
      <Navbar />
      <main className="pt-20">
        <ProfileHeader profileData={profileData} isCurrentUser={isCurrentUser} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ProfileStats
            projects={projects}
            likedProjects={likedProjects}
            reviews={reviews}
            isLoading={{
              projects: loading.projects,
              likes: loading.likes,
              reviews: loading.reviews,
            }}
          />
          
          <ProfileTabs
            activeTab={activeTab}
            isCurrentUser={isCurrentUser}
            projects={projects}
            reviews={reviews}
            likedProjects={likedProjects}
            savedProjects={savedProjects}
            userId={id}
            loading={loading}
            errors={errors}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}

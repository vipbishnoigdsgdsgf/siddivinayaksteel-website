
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectsList } from "@/components/profile/ProjectsList";
import { UserReviews } from "@/components/profile/UserReviews";
import { LikedProjects } from "@/components/profile/LikedProjects";
import { SavedProjects } from "@/components/profile/SavedProjects";
import { Loader } from "lucide-react";

interface ProfileTabsProps {
  activeTab: string;
  isCurrentUser: boolean;
  projects: any[];
  reviews: any[];
  likedProjects: any[];
  savedProjects: any[];
  userId?: string;
  loading: {
    projects: boolean;
    reviews: boolean;
    likes: boolean;
    saved: boolean;
  };
  errors: {
    projects: string | null;
    reviews: string | null;
    likes: string | null;
    saved: string | null;
  };
}

export function ProfileTabs({
  activeTab,
  isCurrentUser,
  projects,
  reviews,
  likedProjects,
  savedProjects,
  userId,
  loading,
  errors,
}: ProfileTabsProps) {
  const [, setSearchParams] = useSearchParams();
  const [currentTab, setCurrentTab] = useState(activeTab);
  const navigate = useNavigate();
  
  // Update URL when tab changes
  useEffect(() => {
    setCurrentTab(activeTab);
  }, [activeTab]);

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    
    // Update query params
    setSearchParams({ tab: value });
  };

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-dark-200 border border-gray-800">
        <TabsTrigger 
          value="projects" 
          className={`${currentTab === 'projects' ? 'bg-steel text-white' : 'bg-dark-300 text-gray-400'}`}
        >
          Projects
        </TabsTrigger>
        <TabsTrigger 
          value="reviews" 
          className={`${currentTab === 'reviews' ? 'bg-steel text-white' : 'bg-dark-300 text-gray-400'}`}
        >
          Reviews
        </TabsTrigger>
        <TabsTrigger 
          value="liked" 
          className={`${currentTab === 'liked' ? 'bg-steel text-white' : 'bg-dark-300 text-gray-400'}`}
        >
          Liked
        </TabsTrigger>
        <TabsTrigger 
          value="saved" 
          className={`${currentTab === 'saved' ? 'bg-steel text-white' : 'bg-dark-300 text-gray-400'}`}
          disabled={!isCurrentUser}
        >
          Saved
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="projects" className="mt-6">
        <h2 className="text-2xl font-bold text-white mb-4">Projects</h2>
        
        {loading.projects ? (
          <div className="flex justify-center py-12">
            <Loader className="h-6 w-6 animate-spin text-steel" />
          </div>
        ) : errors.projects ? (
          <div className="text-center py-12">
            <p className="text-red-400">{errors.projects}</p>
          </div>
        ) : (
          <ProjectsList projects={projects} isCurrentUser={isCurrentUser} />
        )}
      </TabsContent>
      
      <TabsContent value="reviews" className="mt-6">
        <h2 className="text-2xl font-bold text-white mb-4">Reviews</h2>
        
        {loading.reviews ? (
          <div className="flex justify-center py-12">
            <Loader className="h-6 w-6 animate-spin text-steel" />
          </div>
        ) : errors.reviews ? (
          <div className="text-center py-12">
            <p className="text-red-400">{errors.reviews}</p>
          </div>
        ) : (
          <UserReviews reviews={reviews} />
        )}
      </TabsContent>
      
      <TabsContent value="liked" className="mt-6">
        <h2 className="text-2xl font-bold text-white mb-4">Liked Projects</h2>
        
        {loading.likes ? (
          <div className="flex justify-center py-12">
            <Loader className="h-6 w-6 animate-spin text-steel" />
          </div>
        ) : errors.likes ? (
          <div className="text-center py-12">
            <p className="text-red-400">{errors.likes}</p>
          </div>
        ) : (
          <LikedProjects likedProjects={likedProjects} />
        )}
      </TabsContent>
      
      <TabsContent value="saved" className="mt-6">
        <h2 className="text-2xl font-bold text-white mb-4">Saved Projects</h2>
        
        {!isCurrentUser ? (
          <div className="text-center py-12">
            <p className="text-gray-400">You can only view your own saved projects</p>
          </div>
        ) : loading.saved ? (
          <div className="flex justify-center py-12">
            <Loader className="h-6 w-6 animate-spin text-steel" />
          </div>
        ) : errors.saved ? (
          <div className="text-center py-12">
            <p className="text-red-400">{errors.saved}</p>
          </div>
        ) : (
          <SavedProjects savedProjects={savedProjects} />
        )}
      </TabsContent>
    </Tabs>
  );
}

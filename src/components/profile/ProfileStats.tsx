
import { FileText, Heart, Bookmark } from "lucide-react";
import { Project, ReviewWithRelations } from "@/types/auth";
import { Loader } from "lucide-react";

interface ProfileStatsProps {
  projects: Project[];
  likedProjects: Project[];
  reviews: ReviewWithRelations[];
  isLoading: {
    projects: boolean;
    likes: boolean;
    reviews: boolean;
  };
}

export function ProfileStats({ 
  projects, 
  likedProjects, 
  reviews,
  isLoading 
}: ProfileStatsProps) {
  const renderStatValue = (value: number, isLoading: boolean) => {
    if (isLoading) {
      return <Loader className="h-4 w-4 animate-spin text-steel" />;
    }
    return <div className="text-2xl font-bold text-white">{value}</div>;
  };

  return (
    <div className="flex flex-wrap gap-4 md:gap-8 mb-8">
      <div className="bg-dark-200 p-4 rounded-lg border border-gray-800 flex items-center">
        <div className="h-12 w-12 rounded-full bg-steel/20 flex items-center justify-center text-steel mr-4">
          <FileText className="h-6 w-6" />
        </div>
        <div>
          {renderStatValue(projects.length, isLoading.projects)}
          <div className="text-gray-400 text-sm">Projects</div>
        </div>
      </div>
      
      <div className="bg-dark-200 p-4 rounded-lg border border-gray-800 flex items-center">
        <div className="h-12 w-12 rounded-full bg-steel/20 flex items-center justify-center text-steel mr-4">
          <Heart className="h-6 w-6" />
        </div>
        <div>
          {renderStatValue(likedProjects.length, isLoading.likes)}
          <div className="text-gray-400 text-sm">Likes</div>
        </div>
      </div>
      
      <div className="bg-dark-200 p-4 rounded-lg border border-gray-800 flex items-center">
        <div className="h-12 w-12 rounded-full bg-steel/20 flex items-center justify-center text-steel mr-4">
          <Bookmark className="h-6 w-6" />
        </div>
        <div>
          {renderStatValue(reviews.length, isLoading.reviews)}
          <div className="text-gray-400 text-sm">Reviews</div>
        </div>
      </div>
    </div>
  );
}

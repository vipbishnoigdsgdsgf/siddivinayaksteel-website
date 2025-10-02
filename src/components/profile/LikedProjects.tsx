
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface Project {
  id: string;
  title: string;
  category: string | null;
  images: string[];
  created_at: string;
}

interface LikedProjectsProps {
  likedProjects: Project[];
}

export function LikedProjects({ likedProjects }: LikedProjectsProps) {
  return (
    <>
      {likedProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {likedProjects.map((project) => (
            <Card key={project.id} className="bg-dark-200 border-gray-800 hover:border-steel transition duration-300 overflow-hidden">
              <div className="h-48 overflow-hidden relative">
                <img 
  src={project.images?.[0] || "/assets/profilebanner.jpg"} 
  alt={project.title}
  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
/>

                <div className="absolute top-2 right-2">
                  <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-dark-100/70">
                    <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-white">{project.title}</h3>
                  {project.category && (
                    <Badge variant="outline" className="border-steel text-steel">
                      {project.category}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-400">{new Date(project.created_at).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400">No liked projects</p>
        </div>
      )}
    </>
  );
}

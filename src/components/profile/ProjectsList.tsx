
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Link } from "react-router-dom";

interface Project {
  id: string;
  title: string;
  category: string | null;
  images: string[];
  created_at: string;
}

interface ProjectsListProps {
  projects: Project[];
  isCurrentUser: boolean;
}

// Map of keywords to appropriate images
const imageKeywords = {
  handrail: "/assets/Stainless Steel Handrail Installation.jpeg",
  railing: "/assets/Stainless Steel Railing for Luxury Villa.jpeg",
  fencing: "/assets/Steel Security Fencing Project.jpeg",
  pool: "/assets/Stainless Steel Pool Fencing.jpeg",
  staircase: "/assets/Steel and Glass Staircase.jpeg",
  office: "/assets/Glass Office Partition System.jpeg",
  elevator: "/assets/Glass Elevator Enclosure.jpeg",
  partition: "/assets/Glass Office Partition System.jpeg",
  acoustic: "/assets/Acoustic Glass Wall System.jpeg",
  terrace: "/assets/Glass Wind Barrier for Terrace.jpeg",
  skylight: "/assets/Glass Roof Skylight Project.jpeg",
  gate: "/assets/Custom Steel Gate Design.jpeg",
  table: "/assets/Custom Glass Table Tops.jpeg",
  pergola: "/assets/Steel Pergola Design and Installation.jpeg",
  countertop: "/assets/Stainless Steel Kitchen Countertop.jpeg",
  shower: "/assets/Frameless Glass Shower Enclosure.jpeg",
  bridge: "/assets/Glass Bridge Walkway Installation.jpeg",
  balcony: "/assets/Toughened Glass Balcony Railing.jpeg",
  kitchen: "/assets/Stainless Steel Kitchen Countertop.jpeg",
  door: "/assets/Residential Glass Door Installation.jpeg",
  steel: "/assets/Steel Security Fencing Project.jpeg",
  glass: "/assets/Glass Office Partition System.jpeg",
};

// Array of high-quality project images based on categories
const projectImages = {
  residential: [
    "/assets/Stainless Steel Handrail Installation.jpeg",
    "/assets/Stainless Steel Railing for Luxury Villa.jpeg",
    "/assets/Steel Security Fencing Project.jpeg",
    "/assets/Steel and Glass Staircase.jpeg"
  ],
  commercial: [
    "/assets/Glass Office Partition System.jpeg",
    "/assets/Glass Elevator Enclosure.jpeg",
    "/assets/Acoustic Glass Wall System.jpeg",
    "/assets/Glass Roof Skylight Project.jpeg"
  ],
  custom: [
    "/assets/Custom Steel Gate Design.jpeg",
    "/assets/Custom Glass Table Tops.jpeg",
    "/assets/Steel Pergola Design and Installation.jpeg",
    "/assets/Stainless Steel Kitchen Countertop.jpeg"
  ],
  default: [
    "/assets/Steel and Glass Staircase.jpeg",
    "/assets/Glass Bridge Walkway Installation.jpeg",
    "/assets/Glass Roof Skylight Project.jpeg",
    "/assets/Toughened Glass Balcony Railing.jpeg"
  ]
};

export function ProjectsList({ projects, isCurrentUser }: ProjectsListProps) {
  // Helper function to get appropriate image for a project
  const getProjectImage = (project: Project, index: number) => {
    // If project already has valid images, use the first one
    if (project.images && project.images.length > 0 && 
        project.images[0] && 
        !project.images[0].includes('placeholder') && 
        !project.images[0].endsWith('/')) {
      return project.images[0];
    }
    
    // Try to match based on project title keywords
    const title = project.title.toLowerCase();
    
    // Check for keywords in the title
    for (const keyword of Object.keys(imageKeywords)) {
      if (title.includes(keyword)) {
        return imageKeywords[keyword as keyof typeof imageKeywords];
      }
    }
    
    // If no keyword match, use category-based images
    const category = project.category?.toLowerCase() || 'default';
    const categoryImages = 
      projectImages[category as keyof typeof projectImages] || projectImages.default;
    
    // Use a consistent image selection based on project ID and index
    return categoryImages[index % categoryImages.length];
  };

  return (
    <>
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <Card key={project.id} className="bg-dark-200 border-gray-800 hover:border-steel transition duration-300 overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img 
                  src={getProjectImage(project, index)} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = projectImages.default[index % projectImages.default.length];
                  }}
                />
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
          <p className="text-gray-400">No projects found</p>
          {isCurrentUser && (
            <Link to="/gallery">
              <Button variant="outline" className="mt-4 border-steel text-steel">
                <Edit className="h-4 w-4 mr-2" />
                Create a Project
              </Button>
            </Link>
          )}
        </div>
      )}
    </>
  );
}

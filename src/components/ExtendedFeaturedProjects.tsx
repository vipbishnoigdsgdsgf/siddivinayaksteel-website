
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MessageSquare, Eye, Bookmark, Heart, Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { safeSelect, safeInsert, safeDelete, AnyData } from "@/utils/supabaseUtils";
import { Project } from "@/types/auth";

interface ExtendedProject extends Project {
  rating?: number;
  comments?: number;
  location?: string;
  completedDate?: string;
}

export default function ExtendedFeaturedProjects() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [bookmarkedProjects, setBookmarkedProjects] = useState<string[]>([]);
  const [likedProjects, setLikedProjects] = useState<string[]>([]);
  const [projects, setProjects] = useState<ExtendedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const projectsPerPage = 9;
  
  // Array of high-quality project images from assets folder
  const projectImages = [
  "/assets/Glass Office Partition System.jpeg",
  "/assets/Glass Roof Skylight Project.jpeg",
  "/assets/Custom Glass Table Tops.jpeg",
  "/assets/Stainless Steel Pool Fencing.jpeg",
  "/assets/Stainless Steel Railing for Luxury Villa.jpeg",
  "/assets/Glass Elevator Enclosure.jpeg",
  "/assets/Glass Wind Barrier for Terrace.jpeg",
  "/assets/Glass Bridge Walkway Installation.jpeg",
  "/assets/Stainless Steel Handrail Installation.jpeg",
  "/assets/Stainless Steel Handrail Installation.jpeg",
  "/assets/Stainless Steel Kitchen Countertop.jpeg",
  "/assets/Glass Bridge Walkway Installation.jpeg",
  "/assets/Glass Elevator Enclosure.jpeg",
  "/assets/Frameless Glass Shower Enclosure.jpeg",
  "/assets/Steel Pergola Design and Installation.jpeg",
  "/assets/Frameless Glass Shower Enclosure.jpeg",
  "/assets/Stainless Steel Pool Fencing.jpeg",
  "/assets/Steel and Glass Staircase1.jpeg",
  "/assets/Toughened Glass Balcony Railing.jpeg"
];

  
  // Function to get image based on project category and index
  const getImageForProject = (project: ExtendedProject, index: number) => {
    // If project already has images, use the first one
    if (project.images && project.images.length > 0 && 
        project.images[0] && 
        !project.images[0].includes('placeholder') && 
        !project.images[0].endsWith('/')) {
      return project.images[0];
    }
    
    // Otherwise assign an image based on category and index
    let categoryImages;
    switch (project.category) {
      case "residential":
        categoryImages = [
          "/assets/Stainless Steel Handrail Installation.jpeg",
          "/assets/Stainless Steel Railing for Luxury Villa.jpeg",
          "/assets/Steel Security Fencing Project.jpeg",
          "/assets/Steel and Glass Staircase.jpeg"
        ];
        break;
      case "commercial":
        categoryImages = [
          "/assets/Glass Office Partition System.jpeg",
          "/assets/Glass Elevator Enclosure.jpeg",
          "/assets/Acoustic Glass Wall System.jpeg",
          "/assets/Glass Roof Skylight Project.jpeg"
        ];
        break;
      case "custom":
        categoryImages = [
          "/assets/Custom Steel Gate Design.jpeg",
          "/assets/Custom Glass Table Tops.jpeg",
          "/assets/Steel Pergola Design and Installation.jpeg",
          "/assets/Stainless Steel Kitchen Countertop.jpeg"
        ];
        break;
      default:
        categoryImages = projectImages;
    }
    
    // Use a consistent image selection based on index
    return categoryImages[index % categoryImages.length];
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        
        // Build the query with type assertion to avoid deep type instantiation
        const queryBuilder = safeSelect("projects") as any;
        let query = queryBuilder.select("*", { count: "exact" });
          
        // Apply category filter if not "all"
        if (activeCategory !== "all") {
          query = query.eq("category", activeCategory);
        }
        
        // Apply pagination
        const start = (currentPage - 1) * projectsPerPage;
        const end = start + projectsPerPage - 1;
        
        const { data, error, count } = await query
          .order("created_at", { ascending: false })
          .range(start, end);
          
        if (error) {
          throw error;
        }
        
        // Calculate total pages
        if (count !== null) {
          setTotalPages(Math.ceil(count / projectsPerPage));
        }
        
        // Process projects
        const processedProjects = await Promise.all(
          (data || []).map(async (project: AnyData) => {
            // Get comments count with type assertion
            const commentsQuery = safeSelect("comments") as any;
            const { count: commentCount } = await commentsQuery
              .select("*", { count: "exact", head: true })
              .eq("project_id", project.id);
              
            // Get average rating from reviews with type assertion
            const reviewsQuery = safeSelect("reviews") as any;
            const { data: reviews } = await reviewsQuery
              .select("rating")
              .eq("project_id", project.id);
              
            let avgRating = 0;
            if (reviews && reviews.length > 0) {
              avgRating = reviews.reduce((sum: number, review: any) => sum + (review.rating || 0), 0) / reviews.length;
            }
            
            return {
              ...project,
              comments: commentCount || 0,
              rating: avgRating || 4.7,
              location: "Hyderabad, Telangana",
              completedDate: new Date(project.created_at).toLocaleDateString()
            };
          })
        );
        
        setProjects(processedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast({
          title: "Error",
          description: "Failed to load projects",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, [activeCategory, currentPage, toast]);
  
  useEffect(() => {
    // Fetch user's liked and bookmarked projects
    const fetchUserInteractions = async () => {
      if (!user) return;
      
      try {
        // Fetch liked projects with type assertion
        const likesQuery = safeSelect("likes") as any;
        const { data: likedData, error: likedError } = await likesQuery
          .select("project_id")
          .eq("user_id", user.id);
          
        if (likedError) throw likedError;
        
        // Fetch bookmarked projects with type assertion
        const savedQuery = safeSelect("saved_projects") as any;
        const { data: savedData, error: savedError } = await savedQuery
          .select("project_id")
          .eq("user_id", user.id);
          
        if (savedError) throw savedError;
        
        setLikedProjects((likedData || []).map((item: any) => item.project_id));
        setBookmarkedProjects((savedData || []).map((item: any) => item.project_id));
      } catch (error) {
        console.error("Error fetching user interactions:", error);
      }
    };
    
    fetchUserInteractions();
  }, [user]);

  const toggleBookmark = async (id: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to bookmark projects",
      });
      return;
    }
    
    try {
      if (bookmarkedProjects.includes(id)) {
        // Remove bookmark with type assertion
        const deleteQuery = safeDelete("saved_projects") as any;
        await deleteQuery
          .eq("user_id", user.id)
          .eq("project_id", id);
          
        setBookmarkedProjects(prevState => 
          prevState.filter(projectId => projectId !== id)
        );
        
        toast({
          title: "Project removed from bookmarks",
          description: "Project has been removed from your saved list",
        });
      } else {
        // Add bookmark
        await safeInsert("saved_projects", {
          user_id: user.id,
          project_id: id
        });
          
        setBookmarkedProjects(prevState => [...prevState, id]);
        
        toast({
          title: "Project saved",
          description: "Project has been added to your saved list",
        });
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast({
        title: "Error",
        description: "Failed to save project",
        variant: "destructive",
      });
    }
  };

  const toggleLike = async (id: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like projects",
      });
      return;
    }
    
    try {
      if (likedProjects.includes(id)) {
        // Remove like
        const deleteQuery = safeDelete("likes") as any;
        await deleteQuery
          .eq("user_id", user.id)
          .eq("project_id", id);
          
        setLikedProjects(prevState => 
          prevState.filter(projectId => projectId !== id)
        );
        
        toast({
          title: "Like removed",
          description: "You have removed your like from this project",
        });
      } else {
        // Add like
        await safeInsert("likes", {
          user_id: user.id,
          project_id: id
        });
          
        setLikedProjects(prevState => [...prevState, id]);
        
        toast({
          title: "Project liked",
          description: "You have liked this project",
        });
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast({
        title: "Error",
        description: "Failed to like project",
        variant: "destructive",
      });
    }
  };

  const categories = [
    { id: "all", name: "All Projects" },
    { id: "residential", name: "Residential" },
    { id: "commercial", name: "Commercial" },
    { id: "custom", name: "Custom Designs" }
  ];
  
  // Updated getImageUrl function to use our enhanced image selector
  const getImageUrl = (project: ExtendedProject, index: number) => {
    return getImageForProject(project, index);
  };

  return (
    <section className="py-16 bg-dark-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Our Complete <span className="text-steel">Project Portfolio</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
            Browse through our extensive collection of steel fitting projects completed across India.
          </p>
        </div>

        <div className="flex justify-center flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category.id
                  ? "bg-steel text-white"
                  : "bg-dark-300 text-gray-400 hover:bg-dark-200 hover:text-gray-300"
              }`}
              onClick={() => {
                setActiveCategory(category.id);
                setCurrentPage(1); // Reset to first page when changing category
              }}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader className="h-8 w-8 animate-spin text-steel mr-2" />
            <span className="text-gray-400">Loading projects...</span>
          </div>
        ) : (
          <>
            {projects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, index) => (
                  <Card 
                    key={project.id} 
                    className="bg-dark-300 rounded-lg overflow-hidden border border-gray-800 transition-transform hover:transform hover:scale-[1.02]"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={getImageUrl(project, index)}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        onError={(e) => {
                          // Fallback if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.src = projectImages[index % projectImages.length];
                        }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark-300 to-transparent p-4">
                        <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-steel/20 text-steel">
                          {project.category ? project.category.charAt(0).toUpperCase() + project.category.slice(1) : "Custom"}
                        </span>
                      </div>
                      <div className="absolute top-2 right-2 flex space-x-1">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8 rounded-full bg-dark-100/70 hover:bg-dark-100/90"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleBookmark(project.id);
                          }}
                        >
                          <Bookmark 
                            className={`h-4 w-4 ${bookmarkedProjects.includes(project.id) ? "text-steel fill-steel" : "text-white"}`} 
                          />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8 rounded-full bg-dark-100/70 hover:bg-dark-100/90"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleLike(project.id);
                          }}
                        >
                          <Heart 
                            className={`h-4 w-4 ${likedProjects.includes(project.id) ? "text-red-500 fill-red-500" : "text-white"}`} 
                          />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {project.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-400 mb-4">
                        <span>{project.location}</span>
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-white font-medium">{project.rating?.toFixed(1) || "4.8"}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center">
                            <MessageSquare className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-gray-400 text-sm">{project.comments || 0}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          Completed: {project.completedDate}
                        </div>
                        <Link to={`/project/${project.id}`} className="flex items-center text-steel hover:text-steel-light">
                          <Eye className="h-4 w-4 mr-1" />
                          <span className="text-sm">View Project</span>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400">No projects found in this category. Please check back later or try a different category.</p>
              </div>
            )}
            
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-700"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  >
                    Previous
                  </Button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Calculate which page numbers to show
                    let pageNum;
                    if (totalPages <= 5) {
                      // Show all pages if 5 or less
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      // Show first 5 pages
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      // Show last 5 pages
                      pageNum = totalPages - 4 + i;
                    } else {
                      // Show current page and 2 before/after
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === currentPage ? "default" : "outline"}
                        size="sm"
                        className={pageNum === currentPage ? "bg-steel hover:bg-steel-dark" : "border-gray-700"}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-700"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

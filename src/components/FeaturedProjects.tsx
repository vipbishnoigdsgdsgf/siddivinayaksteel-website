
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Star, Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { safeSelect } from "@/utils/supabaseUtils";
import { Project } from "@/types/auth";

interface FeaturedProject extends Project {
  rating?: number;
  location?: string;
}

export default function FeaturedProjects() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [projects, setProjects] = useState<FeaturedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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


  // Direct mapping for specific project titles to ensure exact matches
  const exactTitleMatches = {
    "glass office partition system": "/assets/Glass Office Partition System.jpeg",
    "glass roof skylight project": "/assets/Glass Roof Skylight Project.jpeg",
    "custom glass table tops": "/assets/Custom Glass Table Tops.jpeg", 
    "stainless steel pool fencing": "/assets/Stainless Steel Pool Fencing.jpeg",
    "stainless steel railing for luxury villa": "/assets/Stainless Steel Railing for Luxury Villa.jpeg",
    "glass elevator enclosure": "/assets/Glass Elevator Enclosure.jpeg",
    "frameless glass shower enclosure": "/assets/Frameless Glass Shower Enclosure.jpeg",
    "acoustic glass wall system": "/assets/Acoustic Glass Wall System.jpeg",
    "glass wind barrier for terrace": "/assets/Glass Wind Barrier for Terrace.jpeg",
    "custom steel gate design": "/assets/Custom Steel Gate Design.jpeg",
    "steel pergola design and installation": "/assets/Steel Pergola Design and Installation.jpeg",
    "stainless steel kitchen countertop": "/assets/Stainless Steel Kitchen Countertop.jpeg",
    "steel security fencing project": "/assets/Steel Security Fencing Project.jpeg",
    "steel and glass staircase": "/assets/Steel and Glass Staircase.jpeg",
    "glass bridge walkway installation": "/assets/Glass Bridge Walkway Installation.jpeg",
    "toughened glass balcony railing": "/assets/Toughened Glass Balcony Railing.jpeg",
    "residential glass door installation": "/assets/Residential Glass Door Installation.jpeg"
  };
  
  // Category-based image pools for consistent selection
  const categoryImages = {
    residential: [
      "/assets/Stainless Steel Handrail Installation.jpeg",
      "/assets/Stainless Steel Railing for Luxury Villa.jpeg",
      "/assets/Steel Security Fencing Project.jpeg",
      "/assets/Stainless Steel Pool Fencing.jpeg",
      "/assets/Steel and Glass Staircase.jpeg",
      "/assets/Residential Glass Door Installation.jpeg"
    ],
    commercial: [
      "/assets/Glass Office Partition System.jpeg",
      "/assets/Glass Elevator Enclosure.jpeg",
      "/assets/Acoustic Glass Wall System.jpeg",
      "/assets/Glass Wind Barrier for Terrace.jpeg",
      "/assets/Glass Roof Skylight Project.jpeg"
    ],
    custom: [
      "/assets/Custom Steel Gate Design.jpeg",
      "/assets/Custom Glass Table Tops.jpeg",
      "/assets/Steel Pergola Design and Installation.jpeg",
      "/assets/Stainless Steel Kitchen Countertop.jpeg",
      "/assets/Toughened Glass Balcony Railing.jpeg"
    ],
    default: [
      "/assets/Steel and Glass Staircase.jpeg",
      "/assets/Glass Bridge Walkway Installation.jpeg",
      "/assets/Glass Roof Skylight Project.jpeg",
      "/assets/Toughened Glass Balcony Railing.jpeg"
    ]
  };

  // Function to get image based on project title, category and index
  const getImageForProject = (project: FeaturedProject, index: number) => {
    // If project already has valid images, use the first one
    if (project.images && project.images.length > 0 && 
        project.images[0] && 
        !project.images[0].includes('placeholder') && 
        !project.images[0].endsWith('/')) {
      return project.images[0];
    }
    
    // Check for exact title match first (case insensitive)
    const lowercaseTitle = project.title.toLowerCase();
    if (exactTitleMatches[lowercaseTitle as keyof typeof exactTitleMatches]) {
      return exactTitleMatches[lowercaseTitle as keyof typeof exactTitleMatches];
    }
    
    // If no exact match, try to find keyword matches in the title
    const title = project.title.toLowerCase();
    
    // Keywords to match for appropriate images
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
      door: "/assets/Residential Glass Door Installation.jpeg",
      steel: "/assets/Steel Security Fencing Project.jpeg",
      glass: "/assets/Glass Office Partition System.jpeg",
    };
    
    // Check title for keywords
    for (const keyword of Object.keys(imageKeywords)) {
      if (title.includes(keyword)) {
        return imageKeywords[keyword as keyof typeof imageKeywords];
      }
    }
    
    // If no keyword match, use category-based selection
    const category = project.category?.toLowerCase() || 'default';
    const categorySet = categoryImages[category as keyof typeof categoryImages] || categoryImages.default;
    
    return categorySet[index % categorySet.length];
  };
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);

        // Create base query - cast the result to any to avoid type instantiation issues
        const projectsQuery = safeSelect("projects") as any;

        // Apply category filter
        let query;
        if (activeCategory !== 'all') {
          query = projectsQuery.select("*").eq("category", activeCategory);
        } else {
          query = projectsQuery.select("*");
        }

        // Execute the query with limit and ordering
        const {
          data,
          error
        } = await query.order("created_at", {
          ascending: false
        }).limit(6);
        if (error) {
          throw error;
        }

        // For each project, get the comment count with explicit typing
        const projectsWithData = await Promise.all((data as any[] || []).map(async project => {
          // Get average rating from reviews
          const reviewsQuery = safeSelect("reviews") as any;
          const {
            data: reviews
          } = await reviewsQuery.select("rating").eq("project_id", project.id);
          let avgRating = 0;
          if (reviews && reviews.length > 0) {
            avgRating = reviews.reduce((sum: number, review: any) => sum + (review.rating || 0), 0) / reviews.length;
          }

          // Return with additional data
          return {
            ...project,
            rating: avgRating || 4.7,
            // Fallback rating if no reviews
            location: "Hyderabad, Telangana" // Default location
          } as FeaturedProject;
        }));
        setProjects(projectsWithData);
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast({
          title: "Error",
          description: "Failed to load projects",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [activeCategory, toast]);

  // Updated getImageUrl function to use our enhanced image selector
  const getImageUrl = (project: FeaturedProject, index: number) => {
    return getImageForProject(project, index);
  };

  const categories = [
    { id: "all", name: "All Projects" },
    { id: "residential", name: "Steel Fittings" },
    { id: "commercial", name: "Glass Work" },
    { id: "custom", name: "Custom Designs" }
  ];

  return (
    <section className="py-16 bg-dark-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Our Steel & Glass <span className="text-steel">Projects</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
            Browse through our collection of premium steel fitting and glass work projects in Hyderabad and surrounding areas.
          </p>
        </div>

        <div className="flex justify-center flex-wrap gap-2 mb-8">
          {categories.map(category => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category.id
                  ? "bg-steel text-white"
                  : "bg-dark-300 text-gray-400 hover:bg-dark-200 hover:text-gray-300"
              }`}
              onClick={() => setActiveCategory(category.id)}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.length > 0 ? (
              projects.map((project, index) => (
                <div
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
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {project.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-400 mb-4">
                      <span>{project.location || "Hyderabad, Telangana"}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-white font-medium text-base">{project.rating?.toFixed(1) || "4.8"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-steel/40 hover:border-steel"
                          onClick={() => window.open('https://jsdl.in/DT-283E5AIMN4P', '_blank', 'noopener')}

                        >
                          <span className="text-sm">Schedule</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-10">
                <p className="text-gray-400">No projects found in this category. Please check back later.</p>
              </div>
            )}
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link to="/gallery">
            <Button variant="outline" className="border-steel text-white hover:bg-steel hover:text-white">
              View All Projects
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

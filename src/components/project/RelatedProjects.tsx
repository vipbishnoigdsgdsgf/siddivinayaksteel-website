
import { Link } from "react-router-dom";

interface RelatedProject {
  id: number | string;
  title: string;
  category: string;
  image?: string;
}

interface RelatedProjectsProps {
  projects: RelatedProject[];
}

// Array of high-quality project images based on categories and keywords
const projectImages = {
  residential: {
    handrail: "/assets/Stainless Steel Handrail Installation.jpeg",
    railing: "/assets/Stainless Steel Railing for Luxury Villa.jpeg",
    fencing: "/assets/Steel Security Fencing Project.jpeg",
    pool: "/assets/Stainless Steel Pool Fencing.jpeg",
    staircase: "/assets/Steel and Glass Staircase.jpeg",
    default: "/assets/Stainless Steel Railing for Luxury Villa.jpeg"
  },
  commercial: {
    office: "/assets/Glass Office Partition System.jpeg",
    elevator: "/assets/Glass Elevator Enclosure.jpeg",
    partition: "/assets/Glass Office Partition System.jpeg",
    acoustic: "/assets/Acoustic Glass Wall System.jpeg",
    terrace: "/assets/Glass Wind Barrier for Terrace.jpeg",
    skylight: "/assets/Glass Roof Skylight Project.jpeg",
    default: "/assets/Glass Office Partition System.jpeg"
  },
  custom: {
    gate: "/assets/Custom Steel Gate Design.jpeg",
    table: "/assets/Custom Glass Table Tops.jpeg",
    pergola: "/assets/Steel Pergola Design and Installation.jpeg",
    countertop: "/assets/Stainless Steel Kitchen Countertop.jpeg",
    default: "/assets/Custom Steel Gate Design.jpeg"
  },
  default: [
    "/assets/Steel and Glass Staircase.jpeg",
    "/assets/Glass Bridge Walkway Installation.jpeg",
    "/assets/Glass Roof Skylight Project.jpeg",
    "/assets/Toughened Glass Balcony Railing.jpeg"
  ]
};

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
  "toughened glass balcony railing": "/assets/Toughened Glass Balcony Railing.jpeg"
};

export function RelatedProjects({ projects }: RelatedProjectsProps) {
  // Helper to select the right image based on title and category
  const getAppropriateImage = (project: RelatedProject) => {
    // If the project already has a valid image URL, use it
    if (project.image && !project.image.includes('placeholder') && !project.image.endsWith('/')) {
      return project.image;
    }
    
    // Check for exact title match first (case insensitive)
    const lowercaseTitle = project.title.toLowerCase();
    if (exactTitleMatches[lowercaseTitle as keyof typeof exactTitleMatches]) {
      return exactTitleMatches[lowercaseTitle as keyof typeof exactTitleMatches];
    }
    
    // Find appropriate image based on project title keywords and category
    const title = project.title.toLowerCase();
    const category = project.category?.toLowerCase() || 'default';
    
    // Get category-specific images
    const categoryImages = projectImages[category as keyof typeof projectImages];
    
    // If category is not residential, commercial, or custom, use default images
    if (!categoryImages) {
      // Use project id as a deterministic way to pick an image
      const index = typeof project.id === 'number' ? project.id : 0;
      return projectImages.default[index % projectImages.default.length];
    }
    
    // Handle the case when categoryImages is an array (for "default" category)
    if (Array.isArray(categoryImages)) {
      const index = typeof project.id === 'number' ? project.id : 0;
      return categoryImages[index % categoryImages.length];
    }
    
    // Check title keywords to find the most relevant image
    // Go through keywords to find matching image
    const keywords = Object.keys(categoryImages);
    for (const keyword of keywords) {
      if (title.includes(keyword)) {
        return categoryImages[keyword as keyof typeof categoryImages];
      }
    }
    
    // If no keyword match, return default for that category
    return categoryImages.default;
  };

  return (
    <div className="bg-dark-200 rounded-lg p-6 border border-gray-800">
      <h3 className="text-lg font-semibold text-white mb-4">Related Projects</h3>
      <div className="space-y-4">
        {projects.map(project => (
          <Link key={project.id} to={`/project/${project.id}`}>
            <div className="flex items-center p-2 hover:bg-dark-300 rounded-lg transition-colors">
              <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                <img 
                  src={getAppropriateImage(project)} 
                  alt={project.title} 
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = projectImages.default[0];
                  }}
                />
              </div>
              <div className="ml-3">
                <h4 className="text-white text-sm font-medium">{project.title}</h4>
                <p className="text-gray-400 text-xs">{project.category}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

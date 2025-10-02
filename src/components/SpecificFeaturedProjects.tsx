
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

// Specific featured projects with exact matching images
const FEATURED_PROJECTS = [
  {
    id: "1",
    title: "Glass Office Partition System",
    category: "commercial",
    image: "/assets/Glass Office Partition System.jpeg",
    location: "Hyderabad, Telangana",
    rating: 4.7
  },
  {
    id: "2",
    title: "Glass Roof Skylight Project",
    category: "custom",
    image: "/assets/Glass Roof Skylight Project.jpeg",
    location: "Hyderabad, Telangana",
    rating: 4.8
  },
  {
    id: "3",
    title: "Custom Glass Table Tops",
    category: "custom",
    image: "/assets/Custom Glass Table Tops.jpeg",
    location: "Hyderabad, Telangana",
    rating: 4.7
  },
  {
    id: "4",
    title: "Stainless Steel Railing for Luxury Villa",
    category: "residential",
    image: "/assets/Stainless Steel Railing for Luxury Villa.jpeg",
    location: "Hyderabad, Telangana",
    rating: 4.9
  },
  {
    id: "5",
    title: "Stainless Steel Pool Fencing",
    category: "residential",
    image: "/assets/Stainless Steel Pool Fencing.jpeg",
    location: "Hyderabad, Telangana",
    rating: 4.8
  },
  {
    id: "6",
    title: "Stainless Steel Handrail Installation",
    category: "residential",
    image: "/assets/Stainless Steel Handrail Installation.jpeg",
    location: "Hyderabad, Telangana",
    rating: 4.8
  }
];

export default function SpecificFeaturedProjects() {
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURED_PROJECTS.map((project) => (
            <div
              key={project.id}
              className="bg-dark-300 rounded-lg overflow-hidden border border-gray-800 transition-transform hover:transform hover:scale-[1.02]"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark-300 to-transparent p-4">
                  <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-steel/20 text-steel">
                    {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  {project.title}
                </h3>
                <div className="flex items-center text-sm text-gray-400 mb-4">
                  <span>{project.location}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-white font-medium text-base">{project.rating.toFixed(1)}</span>
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
          ))}
        </div>
        
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

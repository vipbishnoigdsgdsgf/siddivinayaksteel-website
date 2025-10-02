
import { Badge } from "@/components/ui/badge";
import { Star, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

interface ProjectHeaderProps {
  title: string;
  category: string;
  rating: number;
  reviewCount: number;
  completedDate: string;
  image?: string;
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

// Category-based default images
const categoryImages = {
  residential: "/assets/Stainless Steel Railing for Luxury Villa.jpeg",
  commercial: "/assets/Glass Office Partition System.jpeg",
  custom: "/assets/Custom Steel Gate Design.jpeg",
  default: "/assets/Steel and Glass Staircase.jpeg"
};

export function ProjectHeader({
  title,
  category,
  rating,
  reviewCount,
  completedDate,
  image,
}: ProjectHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Select appropriate header image based on title keywords or category
  const getHeaderImage = () => {
    // If we have a valid image already, use it
    if (image && !image.includes('placeholder') && !image.endsWith('/')) {
      return image;
    }
    
    // Check for keywords in the title
    const titleLower = title.toLowerCase();
    for (const keyword of Object.keys(imageKeywords)) {
      if (titleLower.includes(keyword)) {
        return imageKeywords[keyword as keyof typeof imageKeywords];
      }
    }
    
    // If no keyword match, use category-based image
    const categoryLower = category.toLowerCase();
    return categoryImages[categoryLower as keyof typeof categoryImages] || categoryImages.default;
  };

  // Add scroll effect for parallax
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative h-[60vh] overflow-hidden">
      <div 
        className="absolute inset-0 transition-transform duration-500"
        style={{ transform: isScrolled ? 'scale(1.05)' : 'scale(1)' }}
      >
        <img
          src={getHeaderImage()}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = categoryImages.default;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-100 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 w-full p-8">
        <div className="max-w-7xl mx-auto">
          <Badge className="bg-steel mb-4">{category}</Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h1>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <span className="ml-1 text-white font-medium">{rating}</span>
            </div>
            <div className="text-gray-300">
              {reviewCount} reviews
            </div>
            <div className="text-gray-300">
              Completed: {completedDate}
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <div className="flex flex-col items-center">
          <span className="text-sm opacity-80 mb-1">Scroll for details</span>
          <ChevronDown className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

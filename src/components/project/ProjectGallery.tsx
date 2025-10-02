
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, Download, Share2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ProjectGalleryProps {
  images: string[];
  title?: string;
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

// Array of high-quality project images
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

// Category-specific related images to group
const categoryImages = {
  residential: [
    "/assets/Stainless Steel Handrail Installation.jpeg",
    "/assets/Stainless Steel Railing for Luxury Villa.jpeg",
    "/assets/Steel Security Fencing Project.jpeg",
    "/assets/Stainless Steel Pool Fencing.jpeg",
    "/assets/Steel and Glass Staircase.jpeg",
    "/assets/Residential Glass Door Installation.jpeg",
  ],
  commercial: [
    "/assets/Glass Office Partition System.jpeg",
    "/assets/Glass Elevator Enclosure.jpeg",
    "/assets/Acoustic Glass Wall System.jpeg",
    "/assets/Glass Wind Barrier for Terrace.jpeg",
    "/assets/Glass Roof Skylight Project.jpeg",
    "/assets/GlassOfficePartitionSystem.jpg",
  ],
  custom: [
    "/assets/Custom Steel Gate Design.jpeg",
    "/assets/Custom Glass Table Tops.jpeg",
    "/assets/Steel Pergola Design and Installation.jpeg",
    "/assets/Stainless Steel Kitchen Countertop.jpeg",
    "/assets/Toughened Glass Balcony Railing.jpeg",
  ]
};

export function ProjectGallery({ images, title }: ProjectGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  
  // Filter out any invalid image URLs and ensure we have valid images
  const validImages = images && images.length > 0 
    ? images.filter(img => img && typeof img === 'string' && img.trim() !== '')
    : [];
  
  // Create the final image array - use provided images or fallback to stock images
  const allImages = validImages.length > 0 
    ? validImages 
    : projectImages.slice(0, 4); // Use first 4 stock images as fallback

  // Navigation functions with bounds checking
  const nextImage = () => {
    if (allImages.length === 0) return;
    setActiveIndex((prev) => (prev >= allImages.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    if (allImages.length === 0) return;
    setActiveIndex((prev) => (prev <= 0 ? allImages.length - 1 : prev - 1));
  };

  const nextLightboxImage = () => {
    setLightboxIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const prevLightboxImage = () => {
    setLightboxIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const downloadImage = (imageUrl: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `siddhi-vinayak-steel-project-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareImage = async (imageUrl: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Siddhi Vinayak Steel Project',
          text: 'Check out this amazing steel and glass fitting project!',
          url: imageUrl
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(imageUrl);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLightboxOpen) {
        if (e.key === 'ArrowRight') nextLightboxImage();
        if (e.key === 'ArrowLeft') prevLightboxImage();
        if (e.key === 'Escape') setIsLightboxOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen]);

  // Ensure activeIndex is within bounds when images change
  useEffect(() => {
    if (activeIndex >= allImages.length && allImages.length > 0) {
      setActiveIndex(0);
    }
  }, [allImages.length, activeIndex]);

  // No complex loading state needed - images will load naturally

  // Safety check - ensure we have images to display
  if (!allImages || allImages.length === 0) {
    return (
      <div className="bg-gradient-to-br from-dark-200 to-dark-300 rounded-2xl p-6 border border-gray-800 mb-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <ZoomIn className="h-12 w-12 mx-auto mb-4 text-gray-500" />
            <p className="text-gray-400">No images available for this project</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gradient-to-br from-dark-200 to-dark-300 rounded-2xl p-6 border border-gray-800 mb-8 overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <ZoomIn className="h-6 w-6 mr-3 text-steel" />
            Project Gallery
          </h2>
          <div className="text-steel text-sm font-medium">
            {allImages.length} {allImages.length === 1 ? 'Photo' : 'Photos'}
          </div>
        </div>
        
        {/* Featured image with enhanced controls */}
        <div className="relative mb-6 rounded-2xl overflow-hidden group bg-black/20">
          <div className="aspect-w-16 aspect-h-9 relative">
            <img 
              src={allImages[activeIndex]} 
              alt={`Featured project image`}
              className="w-full h-[400px] sm:h-[500px] object-cover transition-all duration-300 rounded-2xl"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = projectImages[0];
              }}
            />
            
            {/* Navigation arrows */}
            <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button 
                variant="ghost" 
                size="icon" 
                className="bg-black/50 hover:bg-black/70 rounded-full backdrop-blur-sm transition-all h-12 w-12 border border-white/10"
                onClick={prevImage}
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="bg-black/50 hover:bg-black/70 rounded-full backdrop-blur-sm transition-all h-12 w-12 border border-white/10"
                onClick={nextImage}
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </Button>
            </div>
            
            {/* Image controls overlay */}
            <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button 
                variant="ghost" 
                size="icon" 
                className="bg-black/50 hover:bg-black/70 rounded-full backdrop-blur-sm h-10 w-10 border border-white/10"
                onClick={() => openLightbox(activeIndex)}
              >
                <Maximize2 className="h-4 w-4 text-white" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="bg-black/50 hover:bg-black/70 rounded-full backdrop-blur-sm h-10 w-10 border border-white/10"
                onClick={() => shareImage(allImages[activeIndex])}
              >
                <Share2 className="h-4 w-4 text-white" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="bg-black/50 hover:bg-black/70 rounded-full backdrop-blur-sm h-10 w-10 border border-white/10"
                onClick={() => downloadImage(allImages[activeIndex])}
              >
                <Download className="h-4 w-4 text-white" />
              </Button>
            </div>
            
            {/* Image counter - always visible */}
            <div className="absolute bottom-4 right-4">
              <div className="bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-medium border border-white/20">
                <span className="text-steel font-bold">{activeIndex + 1}</span>
                <span className="mx-1 text-gray-300">/</span>
                <span>{allImages.length}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced thumbnail grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {allImages.map((image, index) => (
            <div 
              key={index} 
              className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-300 group ${
                index === activeIndex 
                  ? "border-steel shadow-lg shadow-steel/25 scale-105" 
                  : "border-transparent hover:border-steel/50 hover:scale-105"
              }`}
              onClick={() => setActiveIndex(index)}
            >
              <img 
                src={image} 
                alt={`Project thumbnail ${index + 1}`}
                className="w-full h-20 sm:h-24 object-cover transition-all duration-500 group-hover:scale-110"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = projectImages[index % projectImages.length];
                }}
              />
              
              {/* Thumbnail overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ZoomIn className="h-4 w-4 text-white" />
                </div>
              </div>
              
              {/* Active indicator */}
              {index === activeIndex && (
                <div className="absolute inset-0 bg-steel/20 border-2 border-steel rounded-xl" />
              )}
            </div>
          ))}
        </div>
        
        {/* Mobile swipe hint */}
        <div className="mt-4 text-center text-gray-400 text-xs sm:hidden">
          ← Swipe or use arrows to navigate →
        </div>
      </div>

      {/* Enhanced Lightbox Modal */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-screen-lg w-full h-full bg-black/95 border-none p-0 m-0">
          <div className="relative w-full h-full flex items-center justify-center">
            <img 
              src={allImages[lightboxIndex]} 
              alt={`Lightbox image ${lightboxIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = projectImages[lightboxIndex % projectImages.length];
              }}
            />
            
            {/* Lightbox Navigation */}
            <div className="absolute inset-0 flex items-center justify-between p-6">
              <Button 
                variant="ghost" 
                size="icon" 
                className="bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm h-14 w-14 border border-white/20"
                onClick={prevLightboxImage}
              >
                <ChevronLeft className="h-8 w-8 text-white" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm h-14 w-14 border border-white/20"
                onClick={nextLightboxImage}
              >
                <ChevronRight className="h-8 w-8 text-white" />
              </Button>
            </div>
            
            {/* Lightbox Controls */}
            <div className="absolute top-6 right-6 flex space-x-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className="bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm h-12 w-12 border border-white/20"
                onClick={() => shareImage(allImages[lightboxIndex])}
              >
                <Share2 className="h-5 w-5 text-white" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm h-12 w-12 border border-white/20"
                onClick={() => downloadImage(allImages[lightboxIndex])}
              >
                <Download className="h-5 w-5 text-white" />
              </Button>
            </div>
            
            {/* Lightbox Counter */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full text-white font-medium border border-white/20">
                <span className="text-steel">{lightboxIndex + 1}</span>
                <span className="mx-3 text-gray-300">/</span>
                <span>{allImages.length}</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

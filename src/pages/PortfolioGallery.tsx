
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CallToAction from "@/components/CallToAction";
import { Button } from "@/components/ui/button";
import PortfolioCard from "@/components/portfolio/PortfolioCard";
import PortfolioUploadModal from "@/components/portfolio/PortfolioUploadModal";
import PortfolioFilterBar, { CategoryFilter, SortOption } from "@/components/portfolio/PortfolioFilterBar";
import { safeSelect } from "@/utils/supabaseUtils";
import { useAuth } from "@/context/AuthContext";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  image_url: string;
  user_id: string | null;
  created_at: string;
  profiles?: {
    username: string | null;
    full_name: string | null;
  };
  likes_count?: number;
  saves_count?: number;
  has_user_liked?: boolean;
  has_user_saved?: boolean;
}

// Default images from assets folder
const DEFAULT_IMAGES = [
  "/assets/Glass Office Partition System.jpeg",
  "/assets/Custom Glass Table Tops.jpeg",
  "/assets/Custom Steel Gate Design.jpeg",
  "/assets/Glass Roof Skylight Project.jpeg",
  "/assets/Stainless Steel Pool Fencing.jpeg",
  "/assets/Steel and Glass Staircase.jpeg",
  "/assets/Toughened Glass Balcony Railing.jpeg",
  "/assets/Steel Pergola Design and Installation.jpeg",
  "/assets/Stainless Steel Handrail Installation.jpeg",
];

export default function PortfolioGallery() {
  const { user } = useAuth();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const itemsPerPage = 9;
  
  useEffect(() => {
    fetchPortfolioItems(true);
  }, [activeCategory, sortBy]);

  const fetchPortfolioItems = async (resetPage: boolean = false) => {
    const page = resetPage ? 1 : currentPage;
    
    if (resetPage) {
      setLoading(true);
      setItems([]);
    } else {
      setIsLoadingMore(true);
    }

    try {
      // Build query with joins and counts
      let query = safeSelect("gallery")
        .select(`
          *,
          profiles:user_id (username, full_name),
          likes_count:gallery_likes (count),
          saves_count:gallery_saves (count)
        `);

      // Apply category filter if not "all"
      if (activeCategory !== "all") {
        query = query.eq("category", activeCategory);
      }

      // Apply sorting
      if (sortBy === "likes") {
        query = query.order("likes_count", { ascending: false });
      } else if (sortBy === "saves") {
        query = query.order("saves_count", { ascending: false });
      } else {
        query = query.order("created_at", { ascending: false });
      }

      // Apply pagination
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage - 1;
      query = query.range(start, end);

      // Execute query
      const { data, error, count } = await query;

      if (error) throw error;

      // Process data
      let portfolioItems: any[] = [];
      
      if (data && data.length > 0) {
        // Process Supabase data
        portfolioItems = await Promise.all(data.map(async (item: any) => {
          // Check if user has liked this item
          let hasUserLiked = false;
          let hasUserSaved = false;
          
          if (user) {
            // Check likes
            const { data: likeData } = await safeSelect("gallery_likes")
              .select()
.eq("gallery_id", item.id)
              .eq("user_id", user.id)
              .maybeSingle();
              
            hasUserLiked = !!likeData;
            
            // Check saves
            const { data: saveData } = await safeSelect("gallery_saves")
              .select()
              .eq("gallery_id", item.id)
              .eq("user_id", user.id)
              .maybeSingle();
              
            hasUserSaved = !!saveData;
          }
          
          return {
            ...item,
            likes_count: item.likes_count?.length || 0,
            saves_count: item.saves_count?.length || 0,
            has_user_liked: hasUserLiked,
            has_user_saved: hasUserSaved
          };
        }));
      } else if (page === 1) {
        // If no actual gallery items and we're on the first page, use default images
        portfolioItems = DEFAULT_IMAGES.map((image, index) => ({
          id: `default-${index}`,
          title: `Sample Gallery Item ${index + 1}`,
          description: "Default gallery image showcasing our work",
          category: index % 2 === 0 ? "residential" : "commercial",
          image_url: image,
          user_id: null,
          created_at: new Date().toISOString(),
          likes_count: Math.floor(Math.random() * 20),
          saves_count: Math.floor(Math.random() * 10),
        }));
      }
      
      // Update state
      if (resetPage) {
        setItems(portfolioItems);
        setCurrentPage(1);
      } else {
        setItems(prev => [...prev, ...portfolioItems]);
      }
      
      // Check if there are more pages
      if (count !== undefined) {
        setHasMorePages((start + portfolioItems.length) < count);
      } else {
        setHasMorePages(portfolioItems.length === itemsPerPage);
      }
    } catch (error) {
      console.error("Error fetching gallery items:", error);
      toast.error("Failed to load gallery items");
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  const loadMoreItems = () => {
    setCurrentPage(prev => prev + 1);
    fetchPortfolioItems(false);
  };
  
  const handleRefresh = () => {
    fetchPortfolioItems(true);
  };

  return (
    <div className="min-h-screen bg-dark-100">
      <Navbar />
      <main className="pt-20">
        <section className="py-16 bg-dark-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-6">
                Our <span className="text-steel">Gallery</span>
              </h1>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                Explore our showcase of glass and steel projects, and share your own work with the community.
              </p>

              {!user && (
                <div className="mt-6">
                  <p className="text-gray-400 mb-3">Sign in to upload your own projects and interact with others</p>
                  <Link to="/login">
                    <Button 
                      variant="outline" 
                      className="border-steel text-steel hover:bg-steel hover:text-white"
                    >
                      Sign In to Contribute
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-dark-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <PortfolioFilterBar 
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              sortBy={sortBy}
              setSortBy={setSortBy}
              onUploadClick={() => setShowUploadModal(true)}
            />
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader className="h-10 w-10 animate-spin text-steel mb-4" />
                <p className="text-gray-400">Loading gallery items...</p>
              </div>
            ) : (
              <>
                {items.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                      <PortfolioCard 
                        key={item.id} 
                        item={item} 
                        onLikeChange={handleRefresh}
                        onSaveChange={handleRefresh}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <p className="text-gray-400 mb-4">No items found in this category.</p>
                    {user && (
                      <Button 
                        onClick={() => setShowUploadModal(true)}
                        className="bg-steel hover:bg-steel-700 text-white"
                      >
                        Be the First to Upload
                      </Button>
                    )}
                  </div>
                )}
                
                {hasMorePages && (
                  <div className="text-center mt-10">
                    <Button 
                      onClick={loadMoreItems}
                      variant="outline"
                      className="border-gray-700 text-white"
                      disabled={isLoadingMore}
                    >
                      {isLoadingMore ? (
                        <>
                          <Loader className="mr-2 h-4 w-4 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        "Load More"
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
        
        <PortfolioUploadModal 
          isOpen={showUploadModal} 
          onClose={() => setShowUploadModal(false)} 
          onSuccess={handleRefresh}
        />
        
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}

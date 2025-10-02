import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CallToAction from "@/components/CallToAction";
import { Button } from "@/components/ui/button";
import GalleryCard from "@/components/gallery/GalleryCard";
import GalleryUploadModal from "@/components/gallery/GalleryUploadModal";
import GalleryFilterBar, { CategoryFilter, SortOption } from "@/components/gallery/GalleryFilterBar";
import { safeSelect } from "@/utils/supabaseUtils";
import { useAuth } from "@/context/AuthContext";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
interface GalleryItem {
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
const DEFAULT_IMAGES = ["/assets/Glass Office Partition System.jpeg", "/assets/Custom Glass Table Tops.jpeg", "/assets/Custom Steel Gate Design.jpeg", "/assets/Glass Roof Skylight Project.jpeg", "/assets/Stainless Steel Pool Fencing.jpeg", "/assets/Steel and Glass Staircase.jpeg", "/assets/Toughened Glass Balcony Railing.jpeg", "/assets/Steel Pergola Design and Installation.jpeg", "/assets/Stainless Steel Handrail Installation.jpeg"];
export default function GalleryPage() {
  const {
    user
  } = useAuth();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const itemsPerPage = 9;
  useEffect(() => {
    fetchGalleryItems(true);
  }, [activeCategory, sortBy]);
  const fetchGalleryItems = async (resetPage: boolean = false) => {
    const page = resetPage ? 1 : currentPage;
    if (resetPage) {
      setLoading(true);
      setItems([]);
    } else {
      setIsLoadingMore(true);
    }
    
    try {
      // Try to fetch from database first
      let query = safeSelect("gallery").select(`
          *,
          profiles:user_id (username, full_name)
        `);

      // Apply category filter if not "all"
      if (activeCategory !== "all") {
        query = query.eq("category", activeCategory);
      }

      // Apply sorting
      query = query.order("created_at", { ascending: false });

      // Apply pagination
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage - 1;
      query = query.range(start, end);

      // Execute query with timeout
      const { data, error } = await Promise.race([
        query,
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database timeout')), 3000)
        )
      ]) as any;
      
      let galleryItems: GalleryItem[] = [];
      
      if (data && data.length > 0 && !error) {
        // Process database data
        galleryItems = data.map((item: any) => ({
          ...item,
          likes_count: Math.floor(Math.random() * 20),
          saves_count: Math.floor(Math.random() * 10),
          has_user_liked: false,
          has_user_saved: false
        }));
      } else {
        throw new Error('No database data or error occurred');
      }
      
      // Update state
      if (resetPage) {
        setItems(galleryItems);
        setCurrentPage(1);
      } else {
        setItems(prev => [...prev, ...galleryItems]);
      }
      
      setHasMorePages(galleryItems.length === itemsPerPage);
      
    } catch (error) {
      console.log("Database not available, using default images:", error);
      
      // Fallback to default images
      const defaultGalleryItems = DEFAULT_IMAGES.map((image, index) => ({
        id: `default-${index}`,
        title: `Steel & Glass Project ${index + 1}`,
        description: `Professional steel and glass fitting work showcasing our expertise in modern design and construction.`,
        category: (['residential', 'commercial', 'custom', 'industrial'][index % 4]) as string,
        image_url: image,
        user_id: null,
        created_at: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString(),
        likes_count: Math.floor(Math.random() * 25) + 5,
        saves_count: Math.floor(Math.random() * 15) + 3
      }));
      
      // Filter by category if needed
      const filteredItems = activeCategory === 'all' 
        ? defaultGalleryItems 
        : defaultGalleryItems.filter(item => item.category === activeCategory);
      
      // Apply pagination
      const start = (page - 1) * itemsPerPage;
      const paginatedItems = filteredItems.slice(start, start + itemsPerPage);
      
      if (resetPage) {
        setItems(paginatedItems);
        setCurrentPage(1);
      } else {
        setItems(prev => [...prev, ...paginatedItems]);
      }
      
      setHasMorePages(start + paginatedItems.length < filteredItems.length);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };
  const loadMoreItems = () => {
    setCurrentPage(prev => prev + 1);
    fetchGalleryItems(false);
  };
  const handleRefresh = () => {
    fetchGalleryItems(true);
  };
  return <div className="min-h-screen bg-dark-100">
      <Navbar />
      <main className="pt-20">
        <section className="py-16 bg-dark-200 mx-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-6">
                Our <span className="text-steel">Gallery</span>
              </h1>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                Explore our showcase of glass and steel projects, and share your own work with the community.
              </p>

              {!user && <div className="mt-6">
                  <p className="text-gray-400 mb-3">Sign in to upload your own projects and interact with others</p>
                  <Link to="/login">
                    <Button variant="outline" className="border-steel text-steel hover:bg-steel hover:text-white">
                      Sign In to Contribute
                    </Button>
                  </Link>
                </div>}
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-dark-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <GalleryFilterBar activeCategory={activeCategory} setActiveCategory={setActiveCategory} sortBy={sortBy} setSortBy={setSortBy} onUploadClick={() => setShowUploadModal(true)} />
            
            {loading ? <div className="flex flex-col items-center justify-center py-20">
                <Loader className="h-10 w-10 animate-spin text-steel mb-4" />
                <p className="text-gray-400">Loading gallery items...</p>
              </div> : <>
                {items.length > 0 ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map(item => <GalleryCard key={item.id} item={item} onLikeChange={handleRefresh} onSaveChange={handleRefresh} />)}
                  </div> : <div className="text-center py-20">
                    <p className="text-gray-400 mb-4">No items found in this category.</p>
                    {user && <Button onClick={() => setShowUploadModal(true)} className="bg-steel hover:bg-steel-700 text-white">
                        Be the First to Upload
                      </Button>}
                  </div>}
                
                {hasMorePages && <div className="text-center mt-10">
                    <Button onClick={loadMoreItems} variant="outline" className="border-gray-700 text-white" disabled={isLoadingMore}>
                      {isLoadingMore ? <>
                          <Loader className="mr-2 h-4 w-4 animate-spin" />
                          Loading...
                        </> : "Load More"}
                    </Button>
                  </div>}
              </>}
          </div>
        </section>
        
        <GalleryUploadModal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} onSuccess={handleRefresh} />
        
        <CallToAction />
      </main>
      <Footer />
    </div>;
}
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SlidersHorizontal, ListFilter, PlusCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
export type SortOption = "recent" | "likes" | "saves";
export type CategoryFilter = "all" | "residential" | "commercial" | "custom" | "industrial";
interface GalleryFilterBarProps {
  activeCategory: CategoryFilter;
  setActiveCategory: (category: CategoryFilter) => void;
  sortBy: SortOption;
  setSortBy: (option: SortOption) => void;
  onUploadClick: () => void;
}
export default function GalleryFilterBar({
  activeCategory,
  setActiveCategory,
  sortBy,
  setSortBy,
  onUploadClick
}: GalleryFilterBarProps) {
  const {
    user
  } = useAuth();
  const categories = [{
    id: "all",
    name: "All Items"
  }, {
    id: "residential",
    name: "Residential"
  }, {
    id: "commercial",
    name: "Commercial"
  }, {
    id: "custom",
    name: "Custom Designs"
  }, {
    id: "industrial",
    name: "Industrial"
  }];
  return <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-6">
      <div className="flex flex-wrap gap-2">
        {categories.map(category => <Button key={category.id} variant="ghost" size="sm" className={`px-3 py-1 rounded-full text-sm transition-colors ${activeCategory === category.id ? "bg-steel text-white" : "bg-dark-300 text-gray-400 hover:bg-dark-200 hover:text-gray-300"}`} onClick={() => setActiveCategory(category.id as CategoryFilter)}>
            {category.name}
          </Button>)}
      </div>
      
      <div className="flex items-center gap-3">
        
        
        {user && <Button onClick={onUploadClick} className="bg-steel hover:bg-steel-700 text-white flex items-center gap-1" size="sm">
            <PlusCircle className="h-4 w-4" />
            <span>Upload</span>
          </Button>}
      </div>
    </div>;
}

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, Heart, Calendar, Loader } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { safeInsert, safeDelete } from "@/utils/supabaseUtils";
import { toast } from "sonner";

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

interface PortfolioCardProps {
  item: PortfolioItem;
  onLikeChange?: () => void;
  onSaveChange?: () => void;
  className?: string;
}

export default function PortfolioCard({ item, onLikeChange, onSaveChange, className }: PortfolioCardProps) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(item.has_user_liked || false);
  const [isSaved, setIsSaved] = useState(item.has_user_saved || false);
  const [likesCount, setLikesCount] = useState(item.likes_count || 0);
  const [savesCount, setSavesCount] = useState(item.saves_count || 0);
  const [isProcessingLike, setIsProcessingLike] = useState(false);
  const [isProcessingSave, setIsProcessingSave] = useState(false);
  
  // Update state when item props change
  useEffect(() => {
    setIsLiked(item.has_user_liked || false);
    setIsSaved(item.has_user_saved || false);
    setLikesCount(item.likes_count || 0);
    setSavesCount(item.saves_count || 0);
  }, [item]);
  
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleLikeToggle = async () => {
    if (!user) {
      toast.error("Please sign in to like items");
      return;
    }

    setIsProcessingLike(true);

    try {
      if (isLiked) {
        // Remove like
        const deleteQuery = safeDelete("gallery_likes") as any;
        await deleteQuery
          .eq("user_id", user.id)
.eq("gallery_id", item.id);
        
        setLikesCount(prev => Math.max(0, prev - 1));
        setIsLiked(false);
      } else {
        // Add like
        await safeInsert("gallery_likes", {
          user_id: user.id,
          gallery_id: item.id
        });
        
        setLikesCount(prev => prev + 1);
        setIsLiked(true);
      }

      // Notify parent component
      if (onLikeChange) {
        onLikeChange();
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to process like");
    } finally {
      setIsProcessingLike(false);
    }
  };

  const handleSaveToggle = async () => {
    if (!user) {
      toast.error("Please sign in to save items");
      return;
    }

    setIsProcessingSave(true);

    try {
      if (isSaved) {
        // Remove save
        const deleteQuery = safeDelete("gallery_saves") as any;
        await deleteQuery
          .eq("user_id", user.id)
          .eq("gallery_id", item.id);
        
        setSavesCount(prev => Math.max(0, prev - 1));
        setIsSaved(false);
      } else {
        // Add save
        await safeInsert("gallery_saves", {
          user_id: user.id,
          gallery_id: item.id
        });
        
        setSavesCount(prev => prev + 1);
        setIsSaved(true);
      }

      // Notify parent component
      if (onSaveChange) {
        onSaveChange();
      }
    } catch (error) {
      console.error("Error toggling save:", error);
      toast.error("Failed to process save");
    } finally {
      setIsProcessingSave(false);
    }
  };

  const getCategoryLabel = (category: string | null) => {
    if (!category) return "Other";
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <Card className={`bg-dark-300 border-gray-800 overflow-hidden hover:shadow-lg transition-all ${className}`}>
      <div className="relative h-60 overflow-hidden">
        <img 
          src={item.image_url} 
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          onError={(e) => {
            // Fallback if image fails to load
            const target = e.target as HTMLImageElement;
            target.src = "/assets/placeholder.svg";
          }}
        />
        <div className="absolute top-0 left-0 right-0 p-3 flex justify-between items-start">
          <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-steel/80 text-white">
            {getCategoryLabel(item.category)}
          </span>
          
          <div className="flex space-x-2">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full bg-dark-100/70 hover:bg-dark-100/90"
              onClick={handleSaveToggle}
              disabled={isProcessingSave}
            >
              {isProcessingSave ? (
                <Loader className="h-4 w-4 animate-spin text-white" />
              ) : (
                <Bookmark 
                  className={`h-4 w-4 ${isSaved ? "fill-steel text-steel" : "text-white"}`} 
                />
              )}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full bg-dark-100/70 hover:bg-dark-100/90"
              onClick={handleLikeToggle}
              disabled={isProcessingLike}
            >
              {isProcessingLike ? (
                <Loader className="h-4 w-4 animate-spin text-white" />
              ) : (
                <Heart 
                  className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : "text-white"}`} 
                />
              )}
            </Button>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-white text-lg mb-1">{item.title}</h3>
        
        {item.description && (
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">{item.description}</p>
        )}
        
        <div className="flex justify-between items-center mt-2 text-sm">
          <div className="flex items-center space-x-2">
            <Heart className="h-4 w-4 text-red-400" />
            <span className="text-gray-300">{likesCount}</span>
            <Bookmark className="h-4 w-4 text-steel ml-2" />
            <span className="text-gray-300">{savesCount}</span>
          </div>
          
          <div className="flex items-center text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            <span className="text-xs">{formatDate(item.created_at)}</span>
          </div>
        </div>
        
        {item.profiles && (
          <div className="mt-3 pt-3 border-t border-gray-800 text-xs text-gray-500">
            By: {item.profiles.full_name || item.profiles.username || "Anonymous user"}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

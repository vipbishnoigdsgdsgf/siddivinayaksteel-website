
import { Star } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface Review {
  id: number | string;
  userName?: string;
  userImage?: string;
  rating: number;
  date: string;
  text?: string;
  comment?: string;
  profiles?: {
    avatar_url?: string;
    username?: string;
    full_name?: string;
  };
}

interface ProjectReviewsProps {
  rating: number;
  reviews: Review[];
}

export function ProjectReviews({ rating, reviews }: ProjectReviewsProps) {
  return (
    <div className="bg-dark-200 rounded-lg p-6 border border-gray-800 mb-8">
      <h3 className="text-lg font-semibold text-white mb-4">Project Reviews</h3>
      <div className="flex items-center mb-6">
        <div className="flex">
          {[1, 2, 3, 4, 5].map(star => (
            <Star 
              key={star} 
              className={`h-5 w-5 ${star <= Math.floor(rating) ? "text-yellow-500 fill-yellow-500" : star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-600"}`} 
            />
          ))}
        </div>
        <span className="ml-2 text-white font-medium">{rating}/5</span>
        <span className="text-gray-400 text-sm ml-2">({reviews.length} reviews)</span>
      </div>
      <div className="space-y-4">
        {reviews.map(review => {
          const reviewText = review.text || review.comment || "";
          const userName = review.userName || review.profiles?.username || review.profiles?.full_name || "Anonymous";
          const userImage = review.userImage || review.profiles?.avatar_url || "";
          const reviewDate = typeof review.date === 'string' ? review.date : new Date().toISOString();
          
          return (
            <div key={review.id} className="pb-4 border-b border-gray-700 last:border-0">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8">
                    <img src={userImage} alt={userName} onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/assets/Steel and Glass Staircase.jpeg";
                    }} />
                  </Avatar>
                  <span className="ml-2 text-white text-sm">{userName}</span>
                </div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star 
                      key={star} 
                      className={`h-3 w-3 ${star <= review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-600"}`} 
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-1">{reviewText}</p>
              <p className="text-gray-500 text-xs">{new Date(reviewDate).toLocaleDateString()}</p>
            </div>
          );
        })}
      </div>
      <Button variant="link" className="p-0 h-auto text-steel mt-2">View all reviews</Button>
    </div>
  );
}

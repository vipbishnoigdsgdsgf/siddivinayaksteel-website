
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { ReviewWithRelations } from "@/types/auth";

interface UserReviewsProps {
  reviews: ReviewWithRelations[];
}

export function UserReviews({ reviews }: UserReviewsProps) {
  return (
    <>
      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <Card key={review.id} className="bg-dark-200 border-gray-800 hover:border-steel transition duration-300">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  {review.project_id ? (
                    <Link to={`/project/${review.project_id}`} className="hover:text-steel transition-colors">
                      <h3 className="font-semibold text-white">{review.projects?.title || "General Review"}</h3>
                    </Link>
                  ) : (
                    <h3 className="font-semibold text-white">General Website Review</h3>
                  )}
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`h-4 w-4 ${star <= review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-600"}`} 
                      />
                    ))}
                  </div>
                </div>
                
                <div className="bg-dark-300 rounded-md p-3 mb-4">
                  <p className="text-gray-300 text-sm">{review.comment}</p>
                </div>
                
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span>{new Date(review.created_at).toLocaleDateString()}</span>
                  {review.projects?.category && (
                    <span className="px-2 py-1 bg-dark-300 rounded-full text-steel">
                      {review.projects.category}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400">No reviews found</p>
        </div>
      )}
    </>
  );
}

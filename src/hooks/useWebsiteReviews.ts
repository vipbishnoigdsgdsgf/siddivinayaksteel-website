
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { ReviewWithRelations } from "@/types/auth";

export function useWebsiteReviews() {
  const [reviews, setReviews] = useState<ReviewWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch reviews without trying to join profiles or likes
        const { data: reviewsData, error: reviewsError } = await supabase
          .from("reviews")
          .select("*")
          .order('created_at', { ascending: false })
          .limit(10);

        if (reviewsError) throw reviewsError;
        
        // Map reviews to include default profile and projects data
        // Convert the id from number to string to match the ReviewWithRelations type
        const reviewsWithRelations: ReviewWithRelations[] = reviewsData.map((review) => ({
          id: review.id.toString(), // Convert number id to string
          rating: review.rating || 0,
          comment: review.comment || "",
          created_at: review.created_at || "",
          user_id: review.user_id || "",
          project_id: review.project_id || "",
          likes_count: 0, // Set default likes count
          // Set default profiles data
          profiles: {
            username: review.anonymous_name || "Anonymous",
            avatar_url: null,
            full_name: review.anonymous_name || "Anonymous",
          },
          // Set default projects data
          projects: {
            title: review.project_id ? "Project Review" : "General Website Review",
            category: review.project_type || null,
            images: []
          }
        }));
        
        // If there are reviews with user_ids, fetch their profiles
        const userIds = reviewsWithRelations
          .filter(review => review.user_id)
          .map(review => review.user_id);
          
        if (userIds.length > 0) {
          const { data: profilesData, error: profilesError } = await supabase
            .from("profiles")
            .select("id, username, avatar_url, full_name, location")
            .in("id", userIds);

          if (!profilesError && profilesData) {
            // Create a map of profiles by user_id for easier lookup
            const profilesMap = profilesData.reduce((acc, profile) => {
              acc[profile.id] = profile;
              return acc;
            }, {} as Record<string, any>);
            
            // Update reviews with actual profile data when available
            reviewsWithRelations.forEach(review => {
              if (review.user_id && profilesMap[review.user_id]) {
                review.profiles = {
                  username: profilesMap[review.user_id].username || "User",
                  avatar_url: profilesMap[review.user_id].avatar_url,
                  full_name: profilesMap[review.user_id].full_name || profilesMap[review.user_id].username || "User",
                };
                // Store location separately as it's not part of the ReviewWithRelations interface
                review.location = profilesMap[review.user_id].location || null;
              }
            });
          }
        }
        
        // Count likes for each review by fetching the likes separately
        // Use project_id in the likes table as there is no review_id column
        const reviewIds = reviewsWithRelations.map(review => review.id);
        
        if (reviewIds.length > 0) {
          // Remove the .execute() call as it's not needed
          const { data: likesData, error: likesError } = await supabase
            .from("likes")
            .select("project_id, count")
            .in("project_id", reviewIds);
            
          if (!likesError && likesData) {
            // Create a map of likes by review id
            const likesMap = likesData.reduce((acc, like) => {
              if (like.project_id) {
                acc[like.project_id] = like.count || 0;
              }
              return acc;
            }, {} as Record<string, number>);
            
            // Update reviews with likes count
            reviewsWithRelations.forEach(review => {
              review.likes_count = likesMap[review.id] || 0;
            });
            
            // Sort reviews by likes count
            reviewsWithRelations.sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0));
          }
        }
        
        setReviews(reviewsWithRelations);
      } catch (error: any) {
        console.error('Error fetching reviews:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return { reviews, isLoading, error };
}

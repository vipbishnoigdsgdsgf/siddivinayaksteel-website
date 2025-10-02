
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Profile, Project, ReviewWithRelations } from "@/types/auth";
import { safeSelect, AnyData } from "@/utils/supabaseUtils";

interface LoadingStates {
  profile: boolean;
  projects: boolean;
  reviews: boolean;
  likes: boolean;
  saved: boolean;
}

interface ErrorStates {
  profile: string | null;
  projects: string | null;
  reviews: string | null;
  likes: string | null;
  saved: string | null;
}

export function useProfileData(id: string | undefined, isCurrentUser: boolean) {
  const { user } = useAuth();
  const [loading, setLoading] = useState<LoadingStates>({
    profile: true,
    projects: true,
    reviews: true,
    likes: true,
    saved: true,
  });
  const [errors, setErrors] = useState<ErrorStates>({
    profile: null,
    projects: null,
    reviews: null,
    likes: null,
    saved: null,
  });
  
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [likedProjects, setLikedProjects] = useState<Project[]>([]);
  const [savedProjects, setSavedProjects] = useState<Project[]>([]);
  const [reviews, setReviews] = useState<ReviewWithRelations[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      const profileId = isCurrentUser ? user?.id : id;
      if (!profileId) {
        setLoading({
          profile: false,
          projects: false,
          reviews: false,
          likes: false,
          saved: false,
        });
        return;
      }

      // Fetch profile data
      try {
        const profileQuery = safeSelect("profiles") as any;
        const { data: profileData, error: profileError } = await profileQuery
          .select("*")
          .eq("id", profileId)
          .single();

        if (profileError) {
          setErrors(prev => ({ ...prev, profile: "Failed to load profile data" }));
          toast({
            title: "Error",
            description: "Failed to load profile data",
            variant: "destructive",
          });
        } else if (profileData) {
          setProfileData(profileData as Profile);
        }
      } catch (error) {
        setErrors(prev => ({ ...prev, profile: "Failed to load profile data" }));
      } finally {
        setLoading(prev => ({ ...prev, profile: false }));
      }

      // Fetch gallery items created by the user
      try {
        const galleryQuery = safeSelect("gallery") as any;
        const { data: galleryData, error: galleryError } = await galleryQuery
          .select("*")
          .eq("user_id", profileId)
          .order("created_at", { ascending: false });

        if (galleryError) {
          setErrors(prev => ({ ...prev, projects: "Failed to load projects" }));
          toast({
            title: "Error",
            description: "Failed to load projects",
            variant: "destructive",
          });
        } else if (galleryData) {
          // Convert gallery items to the Project format
          const projectsData = galleryData.map((item: any) => ({
            id: item.id,
            title: item.title,
            category: item.category,
            description: item.description,
            images: [item.image_url],
            user_id: item.user_id,
            created_at: item.created_at,
            updated_at: item.updated_at || item.created_at
          }));
          setProjects(projectsData as Project[]);
        }
      } catch (error) {
        setErrors(prev => ({ ...prev, projects: "Failed to load projects" }));
      } finally {
        setLoading(prev => ({ ...prev, projects: false }));
      }

      // Fetch reviews
      try {
        const reviewsQuery = safeSelect("reviews") as any;
        const { data: reviewsData, error: reviewsError } = await reviewsQuery
          .select(`
            *,
            projects (
              title,
              category,
              images
            )
          `)
          .eq("user_id", profileId);

        if (reviewsError) {
          setErrors(prev => ({ ...prev, reviews: "Failed to load reviews" }));
          toast({
            title: "Error",
            description: "Failed to load reviews",
            variant: "destructive",
          });
        } else if (reviewsData) {
          // Process the reviews data
          const profileDetails = profileData ? {
            username: profileData.username,
            avatar_url: profileData.avatar_url,
            full_name: profileData.full_name
          } : {
            username: null,
            avatar_url: null,
            full_name: null
          };

          const reviewsWithProfiles = (reviewsData as AnyData[]).map((review) => ({
            ...review,
            profiles: profileDetails,
            projects: review.projects || {
              title: "General Website Review",
              category: null,
              images: []
            }
          }));
          
          setReviews(reviewsWithProfiles as ReviewWithRelations[]);
        }
      } catch (error) {
        setErrors(prev => ({ ...prev, reviews: "Failed to load reviews" }));
      } finally {
        setLoading(prev => ({ ...prev, reviews: false }));
      }

      // Fetch saved gallery items for current user
      if (isCurrentUser) {
        try {
          const savedGalleryQuery = safeSelect("gallery_saves") as any;
          const { data: savedData, error: savedError } = await savedGalleryQuery
            .select(`
              id,
              gallery_id,
              created_at,
              gallery:gallery_id (*)
            `)
            .eq("user_id", user?.id)
            .order("created_at", { ascending: false });

          if (savedError) {
            setErrors(prev => ({ ...prev, saved: "Failed to load saved projects" }));
            toast({
              title: "Error",
              description: "Failed to load saved projects",
              variant: "destructive",
            });
          } else if (savedData) {
            // Convert gallery items to Project format
            const savedProjectsList = (savedData as any[])
              .map(item => {
                if (!item.gallery) return null;
                return {
                  id: item.gallery.id,
                  title: item.gallery.title,
                  category: item.gallery.category,
                  description: item.gallery.description,
                  images: [item.gallery.image_url],
                  user_id: item.gallery.user_id,
                  created_at: item.gallery.created_at,
                  updated_at: item.gallery.updated_at || item.gallery.created_at
                };
              })
              .filter(Boolean);
            
            setSavedProjects(savedProjectsList as Project[]);
          }
        } catch (error) {
          setErrors(prev => ({ ...prev, saved: "Failed to load saved projects" }));
        } finally {
          setLoading(prev => ({ ...prev, saved: false }));
        }
      }

      // Fetch liked gallery items
      try {
        const likesQuery = safeSelect("gallery_likes") as any;
        const { data: likesData, error: likesError } = await likesQuery
          .select(`
            id,
            gallery_id,
            created_at,
            gallery:gallery_id (*)
          `)
          .eq("user_id", profileId);

        if (likesError) {
          setErrors(prev => ({ ...prev, likes: "Failed to load liked projects" }));
          toast({
            title: "Error",
            description: "Failed to load liked projects",
            variant: "destructive",
          });
        } else {
          if (likesData && likesData.length > 0) {
            // Convert gallery items to Project format
            const likedProjectsList = likesData
              .map((item: any) => {
                if (!item.gallery) return null;
                return {
                  id: item.gallery.id,
                  title: item.gallery.title,
                  category: item.gallery.category,
                  description: item.gallery.description,
                  images: [item.gallery.image_url],
                  user_id: item.gallery.user_id,
                  created_at: item.gallery.created_at,
                  updated_at: item.gallery.updated_at || item.gallery.created_at
                };
              })
              .filter(Boolean);
            
            setLikedProjects(likedProjectsList as Project[]);
          } else {
            setLikedProjects([]);
          }
        }
      } catch (error) {
        setErrors(prev => ({ ...prev, likes: "Failed to load liked projects" }));
      } finally {
        setLoading(prev => ({ ...prev, likes: false }));
      }
    };

    if (user) {
      fetchData();
    }
  }, [id, user, isCurrentUser, toast]);

  return {
    loading,
    errors,
    profileData,
    projects,
    likedProjects,
    savedProjects,
    reviews,
  };
}

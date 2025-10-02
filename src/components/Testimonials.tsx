import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, ArrowLeft, ArrowRight, Loader } from "lucide-react";
import { ReviewWithRelations } from "@/types/auth";
import { Avatar } from "@/components/ui/avatar";
import { safeSelect } from "@/utils/supabaseUtils";
import { supabase } from "../lib/supabase";

interface TestimonialsProps {
  websiteReviews?: ReviewWithRelations[];
  isLoading?: boolean;
}

export default function Testimonials({ websiteReviews = [], isLoading = false }: TestimonialsProps) {
  const [allReviews, setAllReviews] = useState<ReviewWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // If we already have website reviews passed as props, use them
    if (websiteReviews && websiteReviews.length > 0) {
      setAllReviews(websiteReviews);
      setLoading(false);
      return;
    }

    // Otherwise fetch reviews directly
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('is_approved', true)
          .order('created_at', { ascending: false })
          .limit(10);
          
        if (error) {
          console.error('Error fetching reviews:', error);
        } else if (data) {
          // Map the data to match ReviewWithRelations interface
          const mappedReviews = data.map((review: any) => ({
            id: review.id,
            rating: review.rating || 0,
            comment: review.comment || '',
            created_at: review.created_at,
            user_id: review.user_id || '',
            project_id: review.project_id || '',
            likes_count: 0,
            profiles: {
              username: review.reviewer_name || 'Anonymous',
              avatar_url: null,
              full_name: review.reviewer_name || 'Anonymous'
            },
            projects: review.projects || {
              title: 'General Review',
              category: null,
              images: []
            }
          }));
          setAllReviews(mappedReviews);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, [websiteReviews]);

  // Convert reviews to testimonial format
  const testimonials = allReviews.map(review => ({
    id: review.id,
    userId: review.user_id,
    name: review.profiles?.full_name || review.profiles?.username || "Customer",
    position: "",
    company: "",
    image: review.profiles?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${review.profiles?.full_name || "User"}`,
    rating: review.rating,
    comment: review.comment || "",
    projectTitle: review.projects?.title || "General Review"
  }));

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  if (loading || isLoading) {
    return (
      <section className="py-16 bg-dark-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              What Our <span className="text-steel">Clients Say</span>
            </h2>
          </div>
          <div className="flex justify-center items-center py-20">
            <Loader className="h-8 w-8 animate-spin text-steel" />
            <span className="ml-2 text-steel">Loading reviews...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-dark-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            What Our <span className="text-steel">Clients Say</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
            Don't just take our word for it. Hear what our satisfied clients have to say about our work.
          </p>
        </div>

        {testimonials.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-400">No reviews available yet. Be the first to share your experience!</p>
          </div>
        ) : (
          <>
            <div className="relative max-w-4xl mx-auto">
              <div className="neumorphic-card p-8 md:p-12 transition-all duration-500 hover:shadow-lg hover:shadow-steel/20">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-shrink-0">
                    {testimonials[currentIndex].userId ? (
                      <Link 
                        to={`/profile/${testimonials[currentIndex].userId}`}
                        className="profile-link block hover:scale-105 transition-transform duration-300"
                      >
                        <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-steel shadow-neumorphic">
                          <img
                            src={testimonials[currentIndex].image}
                            alt={testimonials[currentIndex].name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      </Link>
                    ) : (
                      <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-steel shadow-neumorphic">
                        <img
                          src={testimonials[currentIndex].image}
                          alt={testimonials[currentIndex].name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex mb-4">
                      {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-steel fill-steel" />
                      ))}
                      {[...Array(5 - testimonials[currentIndex].rating)].map((_, i) => (
                        <Star key={i + testimonials[currentIndex].rating} className="h-5 w-5 text-gray-600" />
                      ))}
                    </div>

                    <blockquote className="relative">
                      <div className="absolute -top-6 -left-6 text-7xl text-steel/20 font-serif">"</div>
                      <p className="text-lg text-gray-300 relative z-10">"{testimonials[currentIndex].comment}"</p>
                      <div className="absolute -bottom-6 -right-6 text-7xl text-steel/20 font-serif">"</div>
                    </blockquote>

                    <div className="mt-6">
                      <div className="font-medium text-steel text-lg">
                        {testimonials[currentIndex].userId ? (
                          <Link 
                            to={`/profile/${testimonials[currentIndex].userId}`}
                            className="hover:underline"
                          >
                            {testimonials[currentIndex].name}
                          </Link>
                        ) : (
                          testimonials[currentIndex].name
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-5 w-full flex justify-center gap-4">
                <button
                  onClick={prevTestimonial}
                  className="h-10 w-10 rounded-full bg-dark-200 shadow-neumorphic flex items-center justify-center text-steel hover:shadow-neumorphic-inset hover:bg-steel hover:text-white transition-all duration-300"
                  aria-label="Previous testimonial"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="h-10 w-10 rounded-full bg-dark-200 shadow-neumorphic flex items-center justify-center text-steel hover:shadow-neumorphic-inset hover:bg-steel hover:text-white transition-all duration-300"
                  aria-label="Next testimonial"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex justify-center mt-12">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  className={`h-3 w-3 mx-1.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex 
                      ? "bg-steel shadow-[0_0_10px_rgba(14,183,234,0.6)] scale-125" 
                      : "bg-gray-600 hover:bg-gray-500"
                  }`}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to testimonial ${idx + 1}`}
                ></button>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

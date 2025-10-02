
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ProjectHeader } from "@/components/project/ProjectHeader";
import { ProjectOverview } from "@/components/project/ProjectOverview";
import { ProjectGallery } from "@/components/project/ProjectGallery";
import { ProjectTestimonial } from "@/components/project/ProjectTestimonial";
import { ProjectContact } from "@/components/project/ProjectContact";
import { ProjectReviews } from "@/components/project/ProjectReviews";
import { RelatedProjects } from "@/components/project/RelatedProjects";
import { ProjectLoading } from "@/components/project/ProjectLoading";
import { ProjectError } from "@/components/project/ProjectError";
import { useProjectData } from "@/hooks/useProjectData";

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const { project, relatedProjects, reviews, loading, error } = useProjectData(id);

  if (loading) {
    return <ProjectLoading />;
  }

  if (error || !project) {
    return <ProjectError />;
  }

  // Format reviews for the ProjectReviews component
  const formattedReviews = reviews.map(review => ({
    id: review.id,
    userName: review.profiles?.full_name || review.profiles?.username || "Anonymous",
    userImage: review.profiles?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${review.user_id}`,
    rating: review.rating,
    date: review.created_at,
    text: review.comment
  }));

  return (
    <div className="min-h-screen bg-dark-100">
      <Navbar />
      <main className="pt-20">
        <ProjectHeader 
          title={project.title}
          category={project.category}
          rating={project.rating}
          reviewCount={project.reviewCount}
          completedDate={project.completedDate}
          image={project.images && project.images.length > 0 ? project.images[0] : "/assets/steel-railing-1.jpg"}
        />
        
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-2/3">
                <ProjectOverview 
                  description={project.description}
                  longDescription={project.longDescription}
                  completedDate={project.completedDate}
                  duration={project.duration}
                  client={project.client}
                  location={project.location}
                  features={project.features}
                  team={project.team}
                />
                
                <ProjectGallery images={project.images} />
                
                <ProjectTestimonial 
                  text={project.testimonial.text}
                  author={project.testimonial.author}
                  position={project.testimonial.position}
                  image={project.testimonial.image}
                />
              </div>
              
              <div className="lg:w-1/3">
                <ProjectContact />
                
                <ProjectReviews 
                  rating={project.rating}
                  reviews={formattedReviews}
                />
                
                <RelatedProjects 
                  projects={relatedProjects.map((relProj) => ({
                    id: relProj.id,
                    title: relProj.title,
                    category: relProj.category,
                    image: relProj.images && relProj.images.length > 0 ? 
                      relProj.images[0] : 
                      "/assets/steel-railing-1.jpg"
                  }))}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

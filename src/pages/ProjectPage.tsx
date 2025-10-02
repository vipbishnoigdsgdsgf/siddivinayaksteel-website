
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ProjectHeader } from "@/components/project/ProjectHeader";
import { ProjectGallery } from "@/components/project/ProjectGallery";
import { ProjectOverview } from "@/components/project/ProjectOverview";
import { ProjectReviews } from "@/components/project/ProjectReviews";
import { RelatedProjects } from "@/components/project/RelatedProjects";
import { ProjectLoading } from "@/components/project/ProjectLoading";
import { ProjectError } from "@/components/project/ProjectError";
import { ProjectContact } from "@/components/project/ProjectContact";
import { useProjectData } from "@/hooks/useProjectData";
import { useScrollToTop } from "@/hooks/useScrollToTop";

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const { project, loading, error, relatedProjects, reviews } = useProjectData(id || '');
  
  useScrollToTop();

  // Pre-load images when project data is available
  useEffect(() => {
    if (project && project.images) {
      project.images.forEach((image: string) => {
        const img = new Image();
        img.src = image;
      });
    }
  }, [project]);

  if (loading) {
    return <ProjectLoading />;
  }

  if (error || !project) {
    return <ProjectError errorMessage={error} />;
  }

  return (
    <div className="min-h-screen bg-dark-100">
      <Navbar />
      
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ProjectHeader 
            title={project.title} 
            category={project.category}
            rating={project.rating || 5}
            reviewCount={reviews?.length || 0}
            completedDate={project.created_at ? new Date(project.created_at).getFullYear().toString() : "2024"}
            image={project.image_url || project.images?.[0]} 
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2">
              <ProjectGallery images={project.images || [project.image_url]} />
              <ProjectOverview
                description={project.description || ""}
                longDescription={project.longDescription || project.description || ""}
                completedDate={project.created_at ? new Date(project.created_at).toLocaleDateString() : "Recently completed"}
                duration={project.duration || "Contact for timeline"}
                client={project.profiles?.full_name || project.profiles?.username || "Client"}
                location={project.location || "Hyderabad, India"}
                features={project.features || []}
                team={project.team || []}
              />
              <ProjectReviews 
                rating={project.rating || 5} 
                reviews={reviews || []} 
              />
            </div>
            
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <ProjectContact />
              </div>
            </div>
          </div>
          
          <RelatedProjects projects={relatedProjects || []} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

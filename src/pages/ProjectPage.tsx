import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/utils/supabaseUtils"; // Make sure this path is correct

// Your Components
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

// Your Hooks
import { useProjectData } from "@/hooks/useProjectData";
import { useScrollToTop } from "@/hooks/useScrollToTop";

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // --- 💡 Smart Redirect Logic Starts ---
  const [isResolvingId, setIsResolvingId] = useState(true);
  const [isValidId, setIsValidId] = useState(false);

  useEffect(() => {
    const resolveAndRedirect = async () => {
      if (!id) {
        setIsValidId(false);
        setIsResolvingId(false);
        return;
      }
      
      const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);

      if (isUUID) {
        setIsValidId(true);
        setIsResolvingId(false);
        return;
      }
      
      console.log(`Resolving short_id: ${id}`);
      const { data, error } = await supabase
        .from('gallery')
        .select('id')
        .eq('short_id', id)
        .single();

      if (error || !data) {
        console.error('Could not resolve short_id:', id, error);
        setIsValidId(false);
        setIsResolvingId(false);
        return;
      }

      console.log(`Redirecting to UUID: ${data.id}`);
      navigate(`/gallery/${data.id}`, { replace: true });
    };

    resolveAndRedirect();
  }, [id, navigate]);
  // --- Smart Redirect Logic Ends ---

  // Fetch data ONLY when we have a valid UUID
  const { project, loading, error, relatedProjects, reviews } = useProjectData(isValidId ? id : null);
  
  useScrollToTop();

  // Your original image pre-loader is also here, perfect!
  useEffect(() => {
    if (project && project.images) {
      project.images.forEach((image: string) => {
        const img = new Image();
        img.src = image;
      });
    }
  }, [project]);

  // Combined loading state for both ID check and data fetching
  if (isResolvingId || loading) {
    return <ProjectLoading />;
  }

  // Combined error state
  if (!isValidId || error || !project) {
    return <ProjectError errorMessage={error || "Project not found or invalid link."} />;
  }

  // Your final page render
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

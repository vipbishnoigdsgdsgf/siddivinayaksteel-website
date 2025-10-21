import { useParams } from "react-router-dom";
import { useProjectData } from "@/hooks/useProjectData";
import { useScrollToTop } from "@/hooks/useScrollToTop";

// Import your components
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ProjectLoading } from "@/components/project/ProjectLoading";
import { ProjectError } from "@/components/project/ProjectError";
import { ProjectHeader } from "@/components/project/ProjectHeader";
import { ProjectGallery } from "@/components/project/ProjectGallery";
import { ProjectOverview } from "@/components/project/ProjectOverview";
import { ProjectReviews } from "@/components/project/ProjectReviews";
import { RelatedProjects } from "@/components/project/RelatedProjects";
import { ProjectContact } from "@/components/project/ProjectContact";

export default function ProjectPage() {
  // Server redirect ke baad, 'id' hamesha ek poora UUID hi hoga.
  const { id } = useParams<{ id: string }>();

  // Custom hook to scroll to top on page load
  useScrollToTop();

  // No more useEffect to resolve ID! Just fetch data directly.
  const { project, loading, error, relatedProjects, reviews } = useProjectData(id || "");

  if (loading) return <ProjectLoading />;
  if (error || !project) return <ProjectError errorMessage={error || "Project could not be found."} />;

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
            <div className="lg-col-span-2">
              <ProjectGallery images={project.images || [project.image_url]} />
              <ProjectOverview
                description={project.description || ""}
                longDescription={project.longDescription || ""}
                completedDate={project.created_at ? new Date(project.created_at).toLocaleDateString() : ""}
                duration={project.duration || "—"}
                client={project.profiles?.full_name || "Client"}
                location={project.location || "India"}
                features={project.features || []}
                team={project.team || []}
              />
              <ProjectReviews rating={project.rating || 5} reviews={reviews || []} />
            </div>

            <div className="lg-col-span-1">
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

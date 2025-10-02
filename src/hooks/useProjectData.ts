
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useProjectData(projectId: string) {
  const [project, setProject] = useState<any>(null);
  const [relatedProjects, setRelatedProjects] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!projectId) {
        setError("No project ID provided");
        setLoading(false);
        return;
      }

      try {
        // Fetch the project with profile data
        const { data: projectData, error: projectError } = await supabase
          .from("gallery")
          .select(`
            *,
            profiles:user_id (username, full_name)
          `)
          .eq("id", projectId)
          .single();

        if (projectError) throw projectError;
        if (!projectData) throw new Error("Project not found");

        setProject(projectData);

        // Fetch related projects (same category but different ID)
        const { data: relatedData, error: relatedError } = await supabase
          .from("gallery")
          .select("*")
          .eq("category", projectData.category)
          .neq("id", projectId)
          .limit(3);

        if (relatedError) throw relatedError;
        setRelatedProjects(relatedData || []);

        // Fetch project reviews
        const { data: reviewsData, error: reviewsError } = await supabase
          .from("reviews")
          .select("*, profiles(*)")
          .eq("project_id", projectId)
          .order("created_at", { ascending: false });

        if (reviewsError) throw reviewsError;
        setReviews(reviewsData || []);

      } catch (err: any) {
        console.error("Error fetching project data:", err);
        setError(err.message || "Failed to load project data");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId]);

  return { project, relatedProjects, reviews, loading, error };
}

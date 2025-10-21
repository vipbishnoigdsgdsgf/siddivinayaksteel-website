import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase"; // <- Check if this path is correct

export function useProjectData(projectId: string | null) { // Added | null for safety
  const [project, setProject] = useState<any>(null);
  const [relatedProjects, setRelatedProjects] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchProjectData = async () => {
      // Reset state on new ID
      setProject(null);
      setError("");
      setLoading(true);

      if (!projectId) {
        // setError("No project ID provided"); // We can remove this to avoid false errors
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
          .maybeSingle(); // ✅ THE FIX IS HERE

        if (projectError) throw projectError;
        if (!projectData) throw new Error("Project not found"); // This error will now show correctly

        setProject(projectData);

        // --- Baaki ka code bilkul same rahega ---

        // Fetch related projects (same category but different ID)
        const { data: relatedData, error: relatedError } = await supabase
          .from("gallery")
          .select("*")
          .eq("category", projectData.category)
          .neq("id", projectId)
          .limit(3);

        if (relatedError) console.error("Related projects error:", relatedError);
        else setRelatedProjects(relatedData || []);

        // Fetch project reviews
        const { data: reviewsData, error: reviewsError } = await supabase
          .from("reviews")
          .select("*, profiles(*)")
          .eq("project_id", projectId)
          .order("created_at", { ascending: false });

        if (reviewsError) console.error("Reviews error:", reviewsError);
        else setReviews(reviewsData || []);

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

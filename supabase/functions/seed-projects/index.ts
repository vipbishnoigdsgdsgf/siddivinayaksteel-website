
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

// Sample steel and glass projects data
const sampleProjects = [
  {
    title: "Modern Steel Staircase Railing",
    category: "residential",
    description: "Custom designed steel staircase railing with glass inserts for a modern home in Hyderabad. This project combines durability with elegant aesthetics.",
    images: [
      "https://images.unsplash.com/photo-1600607686527-6fb886090705?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200",
      "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200"
    ]
  },
  {
    title: "Commercial Glass Partition System",
    category: "commercial",
    description: "Custom glass partition system for office spaces featuring steel frames and frosted glass panels. Perfect for creating private yet open workspace environments.",
    images: [
      "https://images.unsplash.com/photo-1597484662317-c93dd6707b48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200"
    ]
  },
  {
    title: "Artistic Steel Gate Design",
    category: "custom",
    description: "Hand-crafted steel gate with intricate design elements, showcasing traditional patterns combined with modern fabrication techniques.",
    images: [
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200",
      "https://images.unsplash.com/photo-1618220179428-22790b461013?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200"
    ]
  },
  {
    title: "Glass Railing for Balcony",
    category: "residential",
    description: "Tempered glass railing system with stainless steel fixtures for residential balcony, offering unobstructed views while maintaining safety.",
    images: [
      "https://images.unsplash.com/photo-1521401830884-6c03c1c87ebb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200",
      "https://images.unsplash.com/photo-1508967289497-a04ebbf8e257?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200"
    ]
  },
  {
    title: "Steel Frame Showcase Display",
    category: "commercial",
    description: "Custom steel framing with glass shelving for retail display units. Engineered to highlight products while maintaining a minimalist appearance.",
    images: [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200",
      "https://images.unsplash.com/photo-1555116505-38ab61800975?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200"
    ]
  },
  {
    title: "Decorative Steel Window Grills",
    category: "residential",
    description: "Security window grills with decorative steel patterns, combining home security with aesthetic elements that complement the building's architecture.",
    images: [
      "https://images.unsplash.com/photo-1530089711124-9ca31fb9e863?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200"
    ]
  },
  {
    title: "Steel & Glass Entrance Door",
    category: "custom",
    description: "Modern entrance door featuring a steel frame with tempered glass panels. Custom designed for both security and aesthetic appeal.",
    images: [
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200",
      "https://images.unsplash.com/photo-1632082210332-1aa0884a0e14?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200"
    ]
  },
  {
    title: "Steel Pergola with Glass Roof",
    category: "residential",
    description: "Outdoor steel pergola structure with tempered glass roof panels, perfect for garden seating areas that require weather protection while maintaining natural light.",
    images: [
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200",
      "https://images.unsplash.com/photo-1604014308824-d8c8f6c95075?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200"
    ]
  },
  {
    title: "Industrial Steel Shelving",
    category: "commercial",
    description: "Heavy-duty industrial steel shelving system designed for warehouse and storage facilities. Engineered for maximum load capacity and durability.",
    images: [
      "https://images.unsplash.com/photo-1600566752355-35492563d8d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200",
      "https://images.unsplash.com/photo-1600566752447-f4e219736bf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200"
    ]
  },
  {
    title: "Decorative Steel Room Divider",
    category: "custom",
    description: "Artistically designed steel room divider with custom pattern cutouts, creating distinct areas while maintaining an open feel to the space.",
    images: [
      "https://images.unsplash.com/photo-1618220384386-a463b3a0064f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200",
      "https://images.unsplash.com/photo-1569230516306-5a8cb5586399?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200"
    ]
  }
];

serve(async (req) => {
  try {
    // Create a Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get admin user to assign projects to
    const { data: adminUsers, error: adminError } = await supabase
      .from("profiles")
      .select("id")
      .limit(1);
      
    if (adminError || !adminUsers || adminUsers.length === 0) {
      return new Response(JSON.stringify({
        error: "No users found to assign projects to",
        message: "Please create at least one user account first"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    const userId = adminUsers[0].id;
    
    // Check if we already have projects
    const { count, error: countError } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true });
      
    if (countError) {
      throw countError;
    }
    
    // Only seed if we have fewer than 5 projects
    if (count !== null && count >= 5) {
      return new Response(JSON.stringify({
        message: "Database already has enough projects",
        count: count
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    // Prepare projects with user_id
    const projectsToInsert = sampleProjects.map(project => ({
      ...project,
      user_id: userId
    }));
    
    // Insert projects
    const { data, error } = await supabase
      .from("projects")
      .insert(projectsToInsert)
      .select();
      
    if (error) {
      throw error;
    }
    
    return new Response(JSON.stringify({
      message: "Successfully seeded projects",
      count: data.length,
      projects: data.map(p => p.title)
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});

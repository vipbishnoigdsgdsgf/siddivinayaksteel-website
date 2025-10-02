
import { supabase } from "../lib/supabase";

// Define project titles by category
const projectTitles = {
  residential: [
    "Modern Home Staircase Railing",
    "Contemporary Balcony Glass Railing",
    "Villa Entrance Steel Gate",
    "Luxury Villa Stainless Steel Railing",
    "Duplex Home Steel Staircase",
    "Apartment Balcony Glass Partition",
    "Residential Complex Steel Entrance",
    "Penthouse Steel & Glass Railing",
    "Farmhouse Boundary Steel Fencing",
    "Premium Home Steel Door Design",
    "Minimalist Home Glass Partition",
    "Luxury Home Steel Window Frames",
    "Curved Residential Staircase Railing",
    "Balcony Steel-Glass Combined Railing",
    "Residential Security Steel Gate",
    "Premium Villa Steel Boundary Design",
    "Modern Home Glass Shower Partition"
  ],
  commercial: [
    "Office Building Glass Partition",
    "Commercial Complex Staircase Railing",
    "Restaurant Glass Wall Design",
    "Hotel Entrance Glass Door",
    "Shopping Mall Glass Railing",
    "Corporate Office Glass Partition",
    "Bank Steel Security Entrance",
    "Hospital Building Glass Partition",
    "Commercial Plaza Stainless Steel Railing",
    "Retail Store Glass Display System",
    "Hotel Lobby Glass Balustrade",
    "Office Building Glass Elevator Enclosure",
    "Restaurant Outdoor Glass Barrier",
    "Conference Center Steel & Glass Staircase",
    "Commercial Building Steel Window Frames",
    "Mall Glass Balcony Railing",
    "Office Space Glass Room Dividers"
  ],
  custom: [
    "Customized Spiral Staircase Railing",
    "Bespoke Stainless Steel Entrance Gate",
    "Art Deco Inspired Glass Partition",
    "Custom Designed Security Door",
    "Personalized Glass & Steel Railing",
    "Signature Steel Boundary Wall",
    "Artistic Glass Shower Enclosure",
    "Designer Steel Furniture Frame",
    "Modern Art Inspired Staircase",
    "Executive Office Custom Glass Partition",
    "Uniquely Crafted Home Railing",
    "Personalized Steel Gazebo",
    "Custom Glass Wine Cellar",
    "Decorative Steel Gate with Motifs",
    "Bespoke Glass Room Divider with Design",
    "Luxury Custom Steel Door with Engravings"
  ]
};

const projectDescriptions = [
  "Expertly crafted with premium quality stainless steel, delivering both durability and aesthetic appeal. This project showcases our commitment to excellence in craftsmanship.",
  "A perfect blend of modern design and functionality, featuring tempered glass and high-grade steel components that enhance the space while ensuring safety.",
  "Combining contemporary design with traditional craftsmanship, this installation demonstrates our attention to detail and commitment to quality.",
  "Custom designed to client specifications, this project features innovative use of materials and precision engineering to create a stunning visual impact.",
  "Utilizing the latest fabrication techniques and premium materials to create a seamless integration of steel and glass elements that complement the existing architecture.",
  "An elegant solution that balances form and function, crafted with meticulous attention to detail and finished to the highest standards."
];

// Generate random date within past 2 years
const randomDate = () => {
  const start = new Date();
  start.setFullYear(start.getFullYear() - 2);
  const end = new Date();
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Image placeholder URLs for different categories
const categoryImages = {
  residential: [
    "/assets/steel-railing-1.jpg",
    "/assets/steel-railing-2.jpg",
    "/assets/steel-railing-3.jpg"
  ],
  commercial: [
    "/assets/glass-partition-1.jpg",
    "/assets/glass-partition-2.jpg",
    "/assets/glass-partition-3.jpg"
  ],
  custom: [
    "/assets/custom-design-1.jpg",
    "/assets/custom-design-2.jpg",
    "/assets/custom-design-3.jpg"
  ]
};

// Function to get random images for a category
const getRandomImages = (category: string, count: number = 3) => {
  const images = categoryImages[category as keyof typeof categoryImages] || categoryImages.custom;
  const selectedImages = [];
  
  for (let i = 0; i < count; i++) {
    selectedImages.push(images[Math.floor(Math.random() * images.length)]);
  }
  
  return selectedImages;
};

export async function seedProjects(count: number = 50, userId: string = "ramesh-bishnoi") {
  console.log(`Starting to seed ${count} projects...`);
  const projectsToCreate = [];
  const categories = Object.keys(projectTitles);
  
  for (let i = 0; i < count; i++) {
    // Select random category
    const category = categories[Math.floor(Math.random() * categories.length)];
    const titles = projectTitles[category as keyof typeof projectTitles];
    
    // Create project data
    const project = {
      title: titles[Math.floor(Math.random() * titles.length)],
      description: projectDescriptions[Math.floor(Math.random() * projectDescriptions.length)],
      category,
      images: getRandomImages(category),
      user_id: userId,
      created_at: randomDate().toISOString()
    };
    
    projectsToCreate.push(project);
  }
  
  try {
    // Insert projects in batches
    const batchSize = 10;
    let successCount = 0;
    
    for (let i = 0; i < projectsToCreate.length; i += batchSize) {
      const batch = projectsToCreate.slice(i, i + batchSize);
      const { data, error } = await supabase.from("projects").insert(batch);
      
      if (error) {
        console.error(`Error inserting batch ${i/batchSize + 1}:`, error);
      } else {
        successCount += batch.length;
        console.log(`Successfully inserted batch ${i/batchSize + 1} (${successCount}/${count} projects)`);
      }
    }
    
    return {
      success: true,
      message: `Successfully created ${successCount} projects`,
      count: successCount
    };
  } catch (error) {
    console.error("Error seeding projects:", error);
    return {
      success: false,
      message: "Failed to seed projects",
      error
    };
  }
}

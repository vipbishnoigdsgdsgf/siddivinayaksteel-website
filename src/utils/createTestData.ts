import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

// Comprehensive test data generation for admin panel
export const createTestData = async (options = { clearExisting: false }) => {
  console.log('🔧 Creating comprehensive test data for admin panel...');
  
  try {
    // Clear existing test data if requested
    if (options.clearExisting) {
      await clearExistingTestData();
    }
    
    // Generate realistic test users with more variety
    const testUsers = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        email: 'john.doe@example.com',
        full_name: 'John Doe',
        username: 'johndoe',
        phone: '+91 9876543210',
        location: 'Mumbai, India',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        last_sign_in_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        is_active: true
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002', 
        email: 'jane.smith@example.com',
        full_name: 'Jane Smith',
        username: 'janesmith',
        phone: '+91 9876543211',
        location: 'Delhi, India',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        last_sign_in_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        is_active: true
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        email: 'mike.wilson@example.com', 
        full_name: 'Mike Wilson',
        username: 'mikew',
        phone: '+91 9876543212',
        location: 'Bangalore, India',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
        created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        last_sign_in_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        is_active: false
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440004',
        email: 'sarah.johnson@example.com',
        full_name: 'Sarah Johnson',
        username: 'sarahj',
        phone: '+91 9876543213',
        location: 'Chennai, India',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        last_sign_in_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        is_active: true
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440005',
        email: 'alex.brown@example.com',
        full_name: 'Alex Brown',
        username: 'alexb',
        phone: '+91 9876543214',
        location: 'Pune, India',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        last_sign_in_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        is_active: true
      }
    ];
    
    // Create comprehensive test projects with better variety
    const testProjects = [
      {
        id: '550e8400-e29b-41d4-a716-446655440101',
        title: 'Modern Residential Steel Railing',
        description: 'Elegant stainless steel railing system for modern apartment balcony with glass panels and LED lighting integration.',
        category: 'residential',
        status: 'published',
        is_featured: true,
        images: ['/assets/steel-railing-1.jpg', '/assets/steel-railing-2.jpg'],
        location: 'Mumbai, India',
        completion_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        budget_range: '₹50,000 - ₹75,000',
        user_id: '550e8400-e29b-41d4-a716-446655440001',
        created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440102',
        title: 'Commercial Office Glass Partition',
        description: 'Sleek steel-framed glass partition system for corporate office spaces with soundproofing and privacy features.',
        category: 'commercial', 
        status: 'published',
        is_featured: false,
        images: ['/assets/glass-partition-1.jpg', '/assets/glass-partition-2.jpg'],
        location: 'Pune, India',
        completion_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        budget_range: '₹2,00,000 - ₹3,50,000',
        user_id: '550e8400-e29b-41d4-a716-446655440002',
        created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440103',
        title: 'Industrial Warehouse Steel Structure', 
        description: 'Heavy-duty steel framework for large scale warehouse with advanced coating for corrosion resistance.',
        category: 'custom',
        status: 'published',
        is_featured: true,
        images: ['/assets/custom-design-1.jpg', '/assets/custom-design-2.jpg'],
        location: 'Chennai, India',
        completion_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        budget_range: '₹15,00,000 - ₹25,00,000',
        user_id: '550e8400-e29b-41d4-a716-446655440003',
        created_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440104',
        title: 'Luxury Villa Security Gate',
        description: 'Custom designed ornamental steel security gate with automated opening system and decorative elements.',
        category: 'residential',
        status: 'draft',
        is_featured: false,
        images: ['/assets/steel-railing-3.jpg'],
        location: 'Goa, India',
        completion_date: null,
        budget_range: '₹1,25,000 - ₹2,00,000',
        user_id: '550e8400-e29b-41d4-a716-446655440004',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440105',
        title: 'Shopping Mall Steel Staircase',
        description: 'Grand spiral staircase with steel structure and glass railings for premium shopping mall entrance.',
        category: 'commercial',
        status: 'archived',
        is_featured: false,
        images: ['/assets/glass-partition-3.jpg', '/assets/custom-design-3.jpg'],
        location: 'Delhi, India',
        completion_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        budget_range: '₹8,00,000 - ₹12,00,000',
        user_id: '550e8400-e29b-41d4-a716-446655440005',
        created_at: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    // Create comprehensive test reviews with profile relationships
    const testReviews = [
      {
        id: '550e8400-e29b-41d4-a716-446655440201',
        rating: 5,
        comment: 'Outstanding steel work! The team delivered exactly what we envisioned. Professional, timely, and excellent quality craftsmanship.',
        reviewer_name: 'Alex Johnson',
        reviewer_email: 'alex.johnson@example.com',
        reviewer_phone: '+91 9876543220',
        project_type: 'Residential Railing',
        location: 'Mumbai, India',
        project_id: '550e8400-e29b-41d4-a716-446655440101',
        user_id: '550e8400-e29b-41d4-a716-446655440001',
        is_approved: true,
        approved_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440202',
        rating: 4,
        comment: 'Very satisfied with the glass partition work. Good quality materials and professional installation team.',
        reviewer_name: 'Sarah Davis',
        reviewer_email: 'sarah.davis@example.com', 
        reviewer_phone: '+91 9876543221',
        project_type: 'Commercial Glass Partition',
        location: 'Pune, India',
        project_id: '550e8400-e29b-41d4-a716-446655440102',
        user_id: '550e8400-e29b-41d4-a716-446655440002',
        is_approved: null, // Pending approval
        created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440203',
        rating: 3,
        comment: 'The work was completed but there were some delays. Quality is average, could be improved.',
        reviewer_name: 'Tom Brown',
        reviewer_email: 'tom.brown@example.com',
        reviewer_phone: '+91 9876543222',
        project_type: 'Industrial Structure',
        location: 'Chennai, India',
        project_id: '550e8400-e29b-41d4-a716-446655440103',
        user_id: '550e8400-e29b-41d4-a716-446655440003',
        is_approved: false, // Rejected - needs improvement
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440204',
        rating: 5,
        comment: 'Exceptional service! The custom steel gate exceeded our expectations. Highly recommend Sri Ganesh Steel for luxury projects.',
        reviewer_name: 'Priya Sharma',
        reviewer_email: 'priya.sharma@example.com',
        reviewer_phone: '+91 9876543223',
        project_type: 'Custom Steel Gate',
        location: 'Delhi, India',
        project_id: '550e8400-e29b-41d4-a716-446655440104',
        user_id: '550e8400-e29b-41d4-a716-446655440004',
        is_approved: true,
        approved_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440205',
        rating: 4,
        comment: 'Great experience working with the team. The mall staircase project was handled professionally with attention to detail.',
        reviewer_name: 'Rajesh Patel',
        reviewer_email: 'rajesh.patel@example.com',
        reviewer_phone: '+91 9876543224',
        project_type: 'Commercial Staircase',
        location: 'Ahmedabad, India',
        project_id: '550e8400-e29b-41d4-a716-446655440105',
        user_id: '550e8400-e29b-41d4-a716-446655440005',
        is_approved: null, // Pending approval
        created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    // Create comprehensive test meetings with better variety
    const testMeetings = [
      {
        id: '550e8400-e29b-41d4-a716-446655440301',
        title: 'Residential Steel Structure Consultation',
        description: 'Detailed consultation for modern residential steel railing and balcony design.',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        time: '10:00 AM',
        duration: 60, // minutes
        location: 'Mumbai Office',
        meeting_type: 'consultation',
        status: 'scheduled',
        attendees_limit: 4,
        current_attendees: 2,
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440302',
        title: 'Commercial Glass Partition Project Review',
        description: 'Progress review and final approval for office glass partition installation.',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        time: '2:00 PM', 
        duration: 90, // minutes
        location: 'Client Site - Pune',
        meeting_type: 'project_review',
        status: 'confirmed',
        attendees_limit: 6,
        current_attendees: 5,
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440303',
        title: 'Industrial Steel Framework Planning',
        description: 'Initial planning and design discussion for large scale industrial project.',
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
        time: '11:00 AM',
        duration: 120, // minutes
        location: 'Chennai Office',
        meeting_type: 'planning',
        status: 'scheduled',
        attendees_limit: 8,
        current_attendees: 1,
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    // Create comprehensive test meeting registrations
    const testRegistrations = [
      {
        id: '550e8400-e29b-41d4-a716-446655440401',
        meeting_id: '550e8400-e29b-41d4-a716-446655440301',
        name: 'David Miller',
        email: 'david.miller@example.com',
        phone: '+91 9876543230',
        company: 'Miller Construction Pvt Ltd',
        designation: 'Project Manager',
        message: 'Interested in steel structure consultation for our new residential complex project in Bandra.',
        project_type: 'Residential',
        budget_range: '₹10,00,000 - ₹15,00,000',
        status: 'confirmed',
        registered_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        confirmed_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440402',
        meeting_id: '550e8400-e29b-41d4-a716-446655440302',
        name: 'Lisa Anderson', 
        email: 'lisa.anderson@example.com',
        phone: '+91 9876543231',
        company: 'Anderson Developers & Architects',
        designation: 'Senior Architect',
        message: 'Need detailed consultation for commercial steel work and glass partitions for our upcoming office complex.',
        project_type: 'Commercial',
        budget_range: '₹25,00,000 - ₹35,00,000',
        status: 'pending',
        registered_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440403',
        meeting_id: '550e8400-e29b-41d4-a716-446655440303',
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@example.com',
        phone: '+91 9876543232',
        company: 'Kumar Industries',
        designation: 'Operations Head',
        message: 'Require consultation for industrial warehouse steel structure. Large scale project.',
        project_type: 'Industrial',
        budget_range: '₹50,00,000+',
        status: 'waitlisted',
        registered_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    // Start data insertion with progress tracking
    const results = {
      users: { success: 0, failed: 0 },
      projects: { success: 0, failed: 0 },
      reviews: { success: 0, failed: 0 },
      meetings: { success: 0, failed: 0 },
      registrations: { success: 0, failed: 0 }
    };
    
    // Insert users with progress tracking
    console.log('👥 Inserting test users...');
    for (const user of testUsers) {
      try {
        const { error } = await supabase.from('profiles').upsert(user, { onConflict: 'id' });
        if (error) throw error;
        results.users.success++;
        console.log(`✅ User inserted: ${user.full_name}`);
      } catch (err) {
        results.users.failed++;
        console.warn(`❌ User insert failed for ${user.full_name}:`, err);
      }
    }
    
    // Insert projects with progress tracking
    console.log('📁 Inserting test projects...');  
    for (const project of testProjects) {
      try {
        const { error } = await supabase.from('projects').upsert(project, { onConflict: 'id' });
        if (error) throw error;
        results.projects.success++;
        console.log(`✅ Project inserted: ${project.title}`);
      } catch (err) {
        results.projects.failed++;
        console.warn(`❌ Project insert failed for ${project.title}:`, err);
      }
    }
    
    // Insert reviews with progress tracking
    console.log('⭐ Inserting test reviews...');
    for (const review of testReviews) {
      try {
        const { error } = await supabase.from('reviews').upsert(review, { onConflict: 'id' });
        if (error) throw error;
        results.reviews.success++;
        console.log(`✅ Review inserted: ${review.reviewer_name} - ${review.rating} stars`);
      } catch (err) {
        results.reviews.failed++;
        console.warn(`❌ Review insert failed for ${review.reviewer_name}:`, err);
      }
    }
    
    // Insert meetings with progress tracking
    console.log('📅 Inserting test meetings...');
    for (const meeting of testMeetings) {
      try {
        const { error } = await supabase.from('meetings').upsert(meeting, { onConflict: 'id' });
        if (error) throw error;
        results.meetings.success++;
        console.log(`✅ Meeting inserted: ${meeting.title}`);
      } catch (err) {
        results.meetings.failed++;
        console.warn(`❌ Meeting insert failed for ${meeting.title}:`, err);
      }
    }
    
    // Insert registrations with progress tracking
    console.log('📋 Inserting test registrations...');
    for (const registration of testRegistrations) {
      try {
        const { error } = await supabase.from('meeting_registrations').upsert(registration, { onConflict: 'id' });
        if (error) throw error;
        results.registrations.success++;
        console.log(`✅ Registration inserted: ${registration.name}`);
      } catch (err) {
        results.registrations.failed++;
        console.warn(`❌ Registration insert failed for ${registration.name}:`, err);
      }
    }
    
    // Summary of results
    const totalSuccess = Object.values(results).reduce((sum, result) => sum + result.success, 0);
    const totalFailed = Object.values(results).reduce((sum, result) => sum + result.failed, 0);
    
    console.log('✅ Test data creation completed!');
    console.log('📊 Results Summary:');
    console.log(`✅ Successfully created: ${totalSuccess} records`);
    console.log(`❌ Failed to create: ${totalFailed} records`);
    console.log('📋 Detailed breakdown:', results);
    
    return {
      success: totalFailed === 0,
      message: `Created ${totalSuccess} records successfully${totalFailed > 0 ? ` (${totalFailed} failed)` : ''}`,
      data: {
        users: results.users.success,
        projects: results.projects.success,
        reviews: results.reviews.success,
        meetings: results.meetings.success,
        registrations: results.registrations.success
      },
      results
    };
    
  } catch (error) {
    console.error('❌ Error creating test data:', error);
    throw error;
  }
};

// Helper function to clear existing test data
const clearExistingTestData = async () => {
  console.log('🗑️ Clearing existing test data...');
  
  const testIdPrefixes = ['550e8400-e29b-41d4-a716-4466554404'];
  
  try {
    // Clear in reverse dependency order
    await supabase.from('meeting_registrations').delete().like('id', '550e8400-e29b-41d4-a716-4466554404%');
    await supabase.from('meetings').delete().like('id', '550e8400-e29b-41d4-a716-4466554404%');
    await supabase.from('reviews').delete().like('id', '550e8400-e29b-41d4-a716-4466554404%');
    await supabase.from('projects').delete().like('id', '550e8400-e29b-41d4-a716-4466554404%');
    await supabase.from('profiles').delete().like('id', '550e8400-e29b-41d4-a716-4466554404%');
    
    console.log('✅ Existing test data cleared successfully');
  } catch (error) {
    console.warn('⚠️ Some test data may not have been cleared:', error);
  }
};

// Quick data seeder for development
export const createQuickTestData = async () => {
  console.log('🚀 Creating quick test data set...');
  
  const quickResult = await createTestData({ clearExisting: false });
  
  if (quickResult.success) {
    toast.success(`🎯 Quick test data created! ${Object.values(quickResult.data).reduce((a, b) => a + b, 0)} items total`);
  } else {
    toast.error('⚠️ Some test data creation failed - check console');
  }
  
  return quickResult;
};

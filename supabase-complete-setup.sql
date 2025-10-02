-- =====================================================
-- Siddhi Vinayak Steel - Complete Supabase Database Setup
-- =====================================================
-- Run this complete SQL script in your Supabase SQL Editor
-- This will create all necessary tables, policies, and functions

-- =====================================================
-- 1. ENABLE EXTENSIONS
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 2. PROFILES TABLE
-- =====================================================
-- Drop existing table if needed (uncomment next line if you need to reset)
-- DROP TABLE IF EXISTS profiles CASCADE;

CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  website TEXT,
  location TEXT,
  phone TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. PROJECTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  category TEXT,
  location TEXT,
  client_name TEXT,
  completion_date DATE,
  cost_range TEXT,
  materials_used TEXT[] DEFAULT '{}',
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 4. GALLERY TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 5. REVIEWS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reviewer_name TEXT NOT NULL,
  reviewer_email TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 6. SERVICES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon_name TEXT,
  price_range TEXT,
  duration TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  featured_image TEXT,
  gallery_images TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 7. MEETINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS meetings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  meeting_date TIMESTAMPTZ NOT NULL,
  location TEXT,
  max_participants INTEGER DEFAULT 10,
  current_participants INTEGER DEFAULT 0,
  meeting_type TEXT DEFAULT 'consultation',
  status TEXT DEFAULT 'scheduled',
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 8. MEETING REGISTRATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS meeting_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  participant_name TEXT NOT NULL,
  participant_email TEXT NOT NULL,
  participant_phone TEXT,
  notes TEXT,
  status TEXT DEFAULT 'registered',
  registered_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 9. CONTACT MESSAGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  is_replied BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 10. ADMIN NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS admin_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 11. COMMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 12. LIKES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- =====================================================
-- 13. SAVED PROJECTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS saved_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- =====================================================
-- 14. BLOG POSTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  featured_image TEXT,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'draft',
  tags TEXT[] DEFAULT '{}',
  view_count INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 15. TESTIMONIALS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_company TEXT,
  client_avatar TEXT,
  testimonial TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) DEFAULT 5,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 16. ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 17. SECURITY POLICIES
-- =====================================================

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Projects policies
CREATE POLICY "Published projects are viewable by everyone" ON projects FOR SELECT USING (is_published = true);
CREATE POLICY "Users can view own projects" ON projects FOR SELECT USING (auth.uid() = created_by);
CREATE POLICY "Authenticated users can create projects" ON projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own projects" ON projects FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete own projects" ON projects FOR DELETE USING (auth.uid() = created_by);

-- Gallery policies
CREATE POLICY "Public gallery are viewable by everyone" ON gallery FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create gallery" ON gallery FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own gallery" ON gallery FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete own gallery" ON gallery FOR DELETE USING (auth.uid() = created_by);

-- Reviews policies
CREATE POLICY "Approved reviews are viewable by everyone" ON reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Users can view own reviews" ON reviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Authenticated users can create reviews" ON reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON reviews FOR DELETE USING (auth.uid() = user_id);

-- Services policies
CREATE POLICY "Active services are viewable by everyone" ON services FOR SELECT USING (is_active = true);

-- Meetings policies
CREATE POLICY "Public meetings are viewable by everyone" ON meetings FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create meetings" ON meetings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own meetings" ON meetings FOR UPDATE USING (auth.uid() = created_by);

-- Meeting registrations policies
CREATE POLICY "Users can view own registrations" ON meeting_registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Authenticated users can register for meetings" ON meeting_registrations FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own registrations" ON meeting_registrations FOR UPDATE USING (auth.uid() = user_id);

-- Contact messages policies
CREATE POLICY "Anyone can send contact messages" ON contact_messages FOR INSERT WITH CHECK (true);

-- Comments policies
CREATE POLICY "Approved comments are viewable by everyone" ON comments FOR SELECT USING (is_approved = true);
CREATE POLICY "Users can view own comments" ON comments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Authenticated users can create comments" ON comments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own comments" ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON comments FOR DELETE USING (auth.uid() = user_id);

-- Likes policies
CREATE POLICY "Users can view all likes" ON likes FOR SELECT USING (true);
CREATE POLICY "Users can manage own likes" ON likes FOR ALL USING (auth.uid() = user_id);

-- Saved projects policies
CREATE POLICY "Users can view own saved projects" ON saved_projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own saved projects" ON saved_projects FOR ALL USING (auth.uid() = user_id);

-- Blog posts policies
CREATE POLICY "Published blog posts are viewable by everyone" ON blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Users can view own blog posts" ON blog_posts FOR SELECT USING (auth.uid() = author_id);

-- Testimonials policies
CREATE POLICY "Approved testimonials are viewable by everyone" ON testimonials FOR SELECT USING (is_approved = true);
CREATE POLICY "Anyone can submit testimonials" ON testimonials FOR INSERT WITH CHECK (true);

-- =====================================================
-- 18. FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Function to increment project view count
CREATE OR REPLACE FUNCTION increment_project_views(project_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE projects 
  SET view_count = view_count + 1 
  WHERE id = project_id;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Function to get project statistics
CREATE OR REPLACE FUNCTION get_project_stats(project_id UUID)
RETURNS JSON AS $$
BEGIN
  RETURN (
    SELECT json_build_object(
      'total_likes', COALESCE(like_count, 0),
      'total_comments', COALESCE(comment_count, 0),
      'total_saves', COALESCE(save_count, 0),
      'avg_rating', COALESCE(avg_rating, 0)
    )
    FROM (
      SELECT 
        (SELECT COUNT(*) FROM likes WHERE likes.project_id = $1) as like_count,
        (SELECT COUNT(*) FROM comments WHERE comments.project_id = $1 AND is_approved = true) as comment_count,
        (SELECT COUNT(*) FROM saved_projects WHERE saved_projects.project_id = $1) as save_count,
        (SELECT AVG(rating) FROM reviews WHERE reviews.project_id = $1 AND is_approved = true) as avg_rating
    ) stats
  );
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- =====================================================
-- 19. TRIGGERS
-- =====================================================

-- Trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- Update triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_projects_updated_at 
  BEFORE UPDATE ON projects 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_services_updated_at 
  BEFORE UPDATE ON services 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_meetings_updated_at 
  BEFORE UPDATE ON meetings 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_comments_updated_at 
  BEFORE UPDATE ON comments 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at 
  BEFORE UPDATE ON blog_posts 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- =====================================================
-- 20. INDEXES FOR PERFORMANCE
-- =====================================================

-- Projects indexes
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(is_published);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);

-- Gallery indexes
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery(category);
CREATE INDEX IF NOT EXISTS idx_gallery_featured ON gallery(is_featured);
CREATE INDEX IF NOT EXISTS idx_gallery_project_id ON gallery(project_id);

-- Reviews indexes
CREATE INDEX IF NOT EXISTS idx_reviews_project_id ON reviews(project_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- Comments indexes
CREATE INDEX IF NOT EXISTS idx_comments_project_id ON comments(project_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_approved ON comments(is_approved);

-- Likes indexes
CREATE INDEX IF NOT EXISTS idx_likes_project_id ON likes(project_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);

-- =====================================================
-- 21. SAMPLE DATA (OPTIONAL)
-- =====================================================

-- Insert sample services
INSERT INTO services (name, description, icon_name, price_range, is_active) VALUES
('Steel Structure Design', 'Custom steel structure design and fabrication for residential and commercial projects', 'building', '₹50,000 - ₹5,00,000', true),
('Glass Fitting Solutions', 'Professional glass installation and fitting services', 'glass', '₹15,000 - ₹1,00,000', true),
('Maintenance & Repairs', 'Regular maintenance and repair services for steel structures', 'wrench', '₹5,000 - ₹50,000', true),
('Custom Fabrication', 'Bespoke steel fabrication services tailored to your needs', 'hammer', '₹25,000 - ₹3,00,000', true)
ON CONFLICT DO NOTHING;

-- =====================================================
-- SETUP COMPLETE
-- =====================================================
-- Your Supabase database is now fully configured!
-- 
-- Next steps:
-- 1. Update your .env file with Supabase credentials
-- 2. Test the connection from your application
-- 3. Start using the database in your React app
-- 
-- Tables created:
-- - profiles, projects, gallery, reviews, services
-- - meetings, meeting_registrations, contact_messages
-- - admin_notifications, comments, likes, saved_projects
-- - blog_posts, testimonials
--
-- All tables have proper RLS policies and are ready to use!
-- =====================================================
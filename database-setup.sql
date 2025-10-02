-- 🚀 GANESH STEEL WORKS - COMPLETE DATABASE SCHEMA
-- Run this in your Supabase SQL Editor

-- ============================================
-- 1. ENABLE EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 2. PROFILES TABLE (User profiles)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    username TEXT UNIQUE,
    avatar_url TEXT,
    phone TEXT,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. PROJECTS TABLE (Project portfolio)
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT CHECK (category IN ('residential', 'commercial', 'custom', 'industrial')),
    images TEXT[], -- Array of image URLs
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    location TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 4. GALLERY TABLE (Gallery items)
-- ============================================
CREATE TABLE IF NOT EXISTS gallery (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT CHECK (category IN ('residential', 'commercial', 'custom', 'industrial')),
    image_url TEXT NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    likes_count INTEGER DEFAULT 0,
    saves_count INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 5. GALLERY LIKES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS gallery_likes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    gallery_id UUID REFERENCES gallery(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, gallery_id)
);

-- ============================================
-- 6. GALLERY SAVES TABLE  
-- ============================================
CREATE TABLE IF NOT EXISTS gallery_saves (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    gallery_id UUID REFERENCES gallery(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, gallery_id)
);

-- ============================================
-- 7. REVIEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    reviewer_name TEXT, -- For anonymous reviews
    reviewer_email TEXT, -- For anonymous reviews
    anonymous_email TEXT, -- Alternative column name used in some forms
    project_type TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 8. MEETINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS meetings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    meeting_date DATE NOT NULL,
    meeting_time TIME NOT NULL,
    location TEXT NOT NULL,
    address TEXT,
    max_spots INTEGER DEFAULT 50,
    current_spots INTEGER DEFAULT 0,
    image_url TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 9. MEETING REGISTRATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS meeting_registrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    company TEXT,
    message TEXT,
    status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'confirmed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(meeting_id, user_id)
);

-- ============================================
-- 10. NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT CHECK (type IN ('info', 'success', 'warning', 'error')),
    read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 11. CREATE INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_gallery_user_id ON gallery(user_id);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery(category);
CREATE INDEX IF NOT EXISTS idx_gallery_featured ON gallery(featured);
CREATE INDEX IF NOT EXISTS idx_reviews_project_id ON reviews(project_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_meetings_date ON meetings(meeting_date);
CREATE INDEX IF NOT EXISTS idx_meeting_registrations_meeting_id ON meeting_registrations(meeting_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- ============================================
-- 12. CREATE UPDATED_AT TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_gallery_updated_at BEFORE UPDATE ON gallery FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_meetings_updated_at BEFORE UPDATE ON meetings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_meeting_registrations_updated_at BEFORE UPDATE ON meeting_registrations FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ============================================
-- 13. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id OR auth.uid() IS NOT NULL);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id OR auth.uid() IS NOT NULL);
CREATE POLICY "Users can delete their own profile" ON profiles FOR DELETE USING (auth.uid() = id);

-- PROJECTS POLICIES
CREATE POLICY "Anyone can view active projects" ON projects FOR SELECT USING (status = 'active');
CREATE POLICY "Users can insert their own projects" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own projects" ON projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own projects" ON projects FOR DELETE USING (auth.uid() = user_id);

-- GALLERY POLICIES
CREATE POLICY "Anyone can view gallery items" ON gallery FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert gallery items" ON gallery FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own gallery items" ON gallery FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own gallery items" ON gallery FOR DELETE USING (auth.uid() = user_id);

-- GALLERY LIKES POLICIES
CREATE POLICY "Users can view all gallery likes" ON gallery_likes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can like gallery items" ON gallery_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own likes" ON gallery_likes FOR DELETE USING (auth.uid() = user_id);

-- GALLERY SAVES POLICIES
CREATE POLICY "Users can view their own saves" ON gallery_saves FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Authenticated users can save gallery items" ON gallery_saves FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own saves" ON gallery_saves FOR DELETE USING (auth.uid() = user_id);

-- REVIEWS POLICIES
CREATE POLICY "Anyone can view approved reviews" ON reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Authenticated users can insert reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can update their own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reviews" ON reviews FOR DELETE USING (auth.uid() = user_id);

-- MEETINGS POLICIES
CREATE POLICY "Anyone can view active meetings" ON meetings FOR SELECT USING (status = 'active');
CREATE POLICY "Only admins can manage meetings" ON meetings FOR INSERT WITH CHECK (false); -- Admin only
CREATE POLICY "Only admins can update meetings" ON meetings FOR UPDATE USING (false); -- Admin only
CREATE POLICY "Only admins can delete meetings" ON meetings FOR DELETE USING (false); -- Admin only

-- MEETING REGISTRATIONS POLICIES
CREATE POLICY "Users can view their own registrations" ON meeting_registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Authenticated users can register for meetings" ON meeting_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own registrations" ON meeting_registrations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can cancel their own registrations" ON meeting_registrations FOR DELETE USING (auth.uid() = user_id);

-- NOTIFICATIONS POLICIES
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- 14. CREATE FUNCTIONS
-- ============================================

-- Function to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update gallery like/save counts
CREATE OR REPLACE FUNCTION update_gallery_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_TABLE_NAME = 'gallery_likes' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE gallery SET likes_count = likes_count + 1 WHERE id = NEW.gallery_id;
      RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE gallery SET likes_count = likes_count - 1 WHERE id = OLD.gallery_id;
      RETURN OLD;
    END IF;
  ELSIF TG_TABLE_NAME = 'gallery_saves' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE gallery SET saves_count = saves_count + 1 WHERE id = NEW.gallery_id;
      RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE gallery SET saves_count = saves_count - 1 WHERE id = OLD.gallery_id;
      RETURN OLD;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers for gallery counts
CREATE TRIGGER gallery_likes_count_trigger
  AFTER INSERT OR DELETE ON gallery_likes
  FOR EACH ROW EXECUTE FUNCTION update_gallery_counts();

CREATE TRIGGER gallery_saves_count_trigger
  AFTER INSERT OR DELETE ON gallery_saves
  FOR EACH ROW EXECUTE FUNCTION update_gallery_counts();

-- ============================================
-- 15. SAMPLE DATA (OPTIONAL)
-- ============================================
-- Sample meetings
INSERT INTO meetings (title, description, meeting_date, meeting_time, location, address, max_spots) VALUES
('Steel & Glass Solutions Workshop', 'Learn about modern steel and glass fitting techniques', '2024-12-15', '10:00', 'Hyderabad Office', 'Gajanan Steel Reling Glass Office, Medipally Hyderabad', 30),
('Commercial Projects Consultation', 'Discuss your commercial steel fitting needs', '2024-12-20', '14:00', 'Karimnagar Office', 'Subhash Nagar, Karimnagar', 20);

-- ============================================
-- SETUP COMPLETE! 🎉
-- ============================================
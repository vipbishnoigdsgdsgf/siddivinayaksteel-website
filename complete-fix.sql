-- 🔧 COMPLETE FIX SCRIPT - GANESH STEEL WORKS
-- Run this SINGLE script in your Supabase SQL Editor to fix ALL issues

-- ============================================
-- 1. ENABLE EXTENSIONS AND CLEAN SLATE
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing policies first
DO $$
BEGIN
    -- Drop all policies if they exist
    DROP POLICY IF EXISTS "Allow authenticated users full access to profiles" ON profiles;
    DROP POLICY IF EXISTS "Allow authenticated users full access to projects" ON projects;
    DROP POLICY IF EXISTS "Allow authenticated users full access to gallery" ON gallery;
    DROP POLICY IF EXISTS "Allow authenticated users full access to gallery_likes" ON gallery_likes;
    DROP POLICY IF EXISTS "Allow authenticated users full access to gallery_saves" ON gallery_saves;
    DROP POLICY IF EXISTS "Allow authenticated users full access to reviews" ON reviews;
    DROP POLICY IF EXISTS "Allow authenticated users full access to meetings" ON meetings;
    DROP POLICY IF EXISTS "Allow authenticated users full access to meeting_registrations" ON meeting_registrations;
    DROP POLICY IF EXISTS "Allow authenticated users full access to notifications" ON notifications;
    
    -- Drop public access policies
    DROP POLICY IF EXISTS "Allow public read access to profiles" ON profiles;
    DROP POLICY IF EXISTS "Allow public read access to projects" ON projects;
    DROP POLICY IF EXISTS "Allow public read access to gallery" ON gallery;
    DROP POLICY IF EXISTS "Allow public read access to reviews" ON reviews;
    DROP POLICY IF EXISTS "Allow public read access to meetings" ON meetings;
    
    -- Drop storage policies
    DROP POLICY IF EXISTS "Allow public access to avatars" ON storage.objects;
    DROP POLICY IF EXISTS "Allow authenticated users to upload avatars" ON storage.objects;
    DROP POLICY IF EXISTS "Allow users to update their own avatars" ON storage.objects;
    DROP POLICY IF EXISTS "Allow users to delete their own avatars" ON storage.objects;
    DROP POLICY IF EXISTS "Allow public access to images" ON storage.objects;
    DROP POLICY IF EXISTS "Allow authenticated users to upload images" ON storage.objects;
    DROP POLICY IF EXISTS "Allow users to update their own images" ON storage.objects;
    DROP POLICY IF EXISTS "Allow users to delete their own images" ON storage.objects;
    DROP POLICY IF EXISTS "Allow public access to gallery" ON storage.objects;
    DROP POLICY IF EXISTS "Allow authenticated users to upload gallery" ON storage.objects;
    DROP POLICY IF EXISTS "Allow users to update their own gallery images" ON storage.objects;
    DROP POLICY IF EXISTS "Allow users to delete their own gallery images" ON storage.objects;
    DROP POLICY IF EXISTS "Allow public access to projects" ON storage.objects;
    DROP POLICY IF EXISTS "Allow authenticated users to upload projects" ON storage.objects;
    DROP POLICY IF EXISTS "Allow users to update their own project images" ON storage.objects;
    DROP POLICY IF EXISTS "Allow users to delete their own project images" ON storage.objects;
    DROP POLICY IF EXISTS "Allow public access to meetings" ON storage.objects;
    DROP POLICY IF EXISTS "Allow authenticated users to upload meetings" ON storage.objects;
    DROP POLICY IF EXISTS "Allow users to update their own meeting images" ON storage.objects;
    DROP POLICY IF EXISTS "Allow users to delete their own meeting images" ON storage.objects;
EXCEPTION
    WHEN OTHERS THEN
        -- Ignore errors, policies might not exist
        NULL;
END $$;

-- Drop tables if they exist (CASCADE to handle foreign keys)
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS meeting_registrations CASCADE;
DROP TABLE IF EXISTS meetings CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS gallery_saves CASCADE;
DROP TABLE IF EXISTS gallery_likes CASCADE;
DROP TABLE IF EXISTS gallery CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- ============================================
-- 2. CREATE TABLES WITH CORRECT SCHEMA
-- ============================================

-- PROFILES TABLE
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    username TEXT UNIQUE,
    avatar_url TEXT,
    phone TEXT,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PROJECTS TABLE
CREATE TABLE projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT CHECK (category IN ('residential', 'commercial', 'custom', 'industrial')),
    images TEXT[],
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    location TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- GALLERY TABLE
CREATE TABLE gallery (
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

-- GALLERY LIKES TABLE
CREATE TABLE gallery_likes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    gallery_id UUID REFERENCES gallery(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, gallery_id)
);

-- GALLERY SAVES TABLE  
CREATE TABLE gallery_saves (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    gallery_id UUID REFERENCES gallery(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, gallery_id)
);

-- REVIEWS TABLE (WITH ALL REQUIRED COLUMNS)
CREATE TABLE reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    reviewer_name TEXT,
    reviewer_email TEXT,
    anonymous_name TEXT,
    anonymous_email TEXT,
    project_type TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- MEETINGS TABLE
CREATE TABLE meetings (
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

-- MEETING REGISTRATIONS TABLE
CREATE TABLE meeting_registrations (
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

-- NOTIFICATIONS TABLE
CREATE TABLE notifications (
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
-- 3. CREATE STORAGE BUCKETS
-- ============================================

-- Create buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('avatars', 'avatars', true),
  ('images', 'images', true),
  ('gallery', 'gallery', true),
  ('projects', 'projects', true),
  ('meetings', 'meetings', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 4. CREATE INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_gallery_user_id ON gallery(user_id);
CREATE INDEX IF NOT EXISTS idx_gallery_likes_user_id ON gallery_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_gallery_likes_gallery_id ON gallery_likes(gallery_id);
CREATE INDEX IF NOT EXISTS idx_gallery_saves_user_id ON gallery_saves(user_id);
CREATE INDEX IF NOT EXISTS idx_gallery_saves_gallery_id ON gallery_saves(gallery_id);
CREATE INDEX IF NOT EXISTS idx_reviews_project_id ON reviews(project_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_meetings_date ON meetings(meeting_date);
CREATE INDEX IF NOT EXISTS idx_meeting_registrations_meeting_id ON meeting_registrations(meeting_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- ============================================
-- 5. CREATE UPDATED_AT TRIGGERS
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
-- 6. ENABLE ROW LEVEL SECURITY
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

-- ============================================
-- 7. CREATE VERY PERMISSIVE POLICIES FOR TESTING
-- ============================================

-- PROFILES POLICIES
CREATE POLICY "Allow authenticated users full access to profiles" ON profiles 
    FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow public read access to profiles" ON profiles FOR SELECT USING (true);

-- PROJECTS POLICIES  
CREATE POLICY "Allow authenticated users full access to projects" ON projects
    FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow public read access to projects" ON projects FOR SELECT USING (true);

-- GALLERY POLICIES
CREATE POLICY "Allow authenticated users full access to gallery" ON gallery
    FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow public read access to gallery" ON gallery FOR SELECT USING (true);

-- GALLERY LIKES POLICIES
CREATE POLICY "Allow authenticated users full access to gallery_likes" ON gallery_likes
    FOR ALL USING (auth.role() = 'authenticated');

-- GALLERY SAVES POLICIES
CREATE POLICY "Allow authenticated users full access to gallery_saves" ON gallery_saves
    FOR ALL USING (auth.role() = 'authenticated');

-- REVIEWS POLICIES
CREATE POLICY "Allow authenticated users full access to reviews" ON reviews
    FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow public read access to reviews" ON reviews FOR SELECT USING (true);

-- MEETINGS POLICIES
CREATE POLICY "Allow authenticated users full access to meetings" ON meetings
    FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow public read access to meetings" ON meetings FOR SELECT USING (true);

-- MEETING REGISTRATIONS POLICIES
CREATE POLICY "Allow authenticated users full access to meeting_registrations" ON meeting_registrations
    FOR ALL USING (auth.role() = 'authenticated');

-- NOTIFICATIONS POLICIES
CREATE POLICY "Allow authenticated users full access to notifications" ON notifications
    FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- 8. CREATE STORAGE POLICIES
-- ============================================

-- IMAGES BUCKET POLICIES (MAIN BUCKET)
CREATE POLICY "Allow public access to images" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "Allow authenticated users to upload images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

CREATE POLICY "Allow users to update their own images" ON storage.objects
FOR UPDATE USING (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Allow users to delete their own images" ON storage.objects
FOR DELETE USING (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- GALLERY BUCKET POLICIES  
CREATE POLICY "Allow public access to gallery storage" ON storage.objects
FOR SELECT USING (bucket_id = 'gallery');

CREATE POLICY "Allow authenticated users to upload gallery storage" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'gallery' AND auth.role() = 'authenticated');

-- AVATARS BUCKET POLICIES
CREATE POLICY "Allow public access to avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Allow authenticated users to upload avatars" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- ============================================
-- 9. CREATE HELPER FUNCTIONS
-- ============================================

-- Function to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================
-- 10. SAMPLE DATA
-- ============================================

-- Sample meetings
INSERT INTO meetings (title, description, meeting_date, meeting_time, location, address, max_spots) VALUES
('Steel & Glass Solutions Workshop', 'Learn about modern steel and glass fitting techniques', '2024-12-15', '10:00', 'Hyderabad Office', 'Gajanan Steel Reling Glass Office, Medipally Hyderabad', 30),
('Commercial Projects Consultation', 'Discuss your commercial steel fitting needs', '2024-12-20', '14:00', 'Karimnagar Office', 'Subhash Nagar, Karimnagar', 20)
ON CONFLICT DO NOTHING;

-- ============================================
-- 11. VERIFICATION QUERY
-- ============================================

-- Run this to verify everything is working
SELECT 
  'profiles' as table_name, count(*) as row_count FROM profiles
UNION ALL
SELECT 'projects', count(*) FROM projects
UNION ALL
SELECT 'gallery', count(*) FROM gallery
UNION ALL
SELECT 'gallery_likes', count(*) FROM gallery_likes
UNION ALL
SELECT 'gallery_saves', count(*) FROM gallery_saves
UNION ALL
SELECT 'reviews', count(*) FROM reviews
UNION ALL
SELECT 'meetings', count(*) FROM meetings
UNION ALL
SELECT 'meeting_registrations', count(*) FROM meeting_registrations
UNION ALL
SELECT 'notifications', count(*) FROM notifications;

-- Verify buckets
SELECT 'Storage Buckets' as info, count(*) as bucket_count FROM storage.buckets WHERE id IN ('avatars', 'images', 'gallery', 'projects', 'meetings');

-- ============================================
-- 🎉 COMPLETE FIX DONE!
-- ============================================
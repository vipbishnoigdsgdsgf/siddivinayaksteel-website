-- Fix Admin Panel Database Schema Issues
-- Run this in your Supabase SQL Editor

-- ================================
-- 1. Fix Reviews Table
-- ================================

-- Add missing columns to reviews table
DO $$ 
BEGIN
    -- Add approved_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='reviews' AND column_name='approved_at') THEN
        ALTER TABLE reviews ADD COLUMN approved_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    -- Add rejected_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='reviews' AND column_name='rejected_at') THEN
        ALTER TABLE reviews ADD COLUMN rejected_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    -- Add admin_notes column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='reviews' AND column_name='admin_notes') THEN
        ALTER TABLE reviews ADD COLUMN admin_notes TEXT;
    END IF;
END $$;

-- Create reviews table if it doesn't exist
CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    project_id UUID,
    reviewer_name TEXT,
    reviewer_email TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_approved BOOLEAN DEFAULT NULL,
    approved_at TIMESTAMP WITH TIME ZONE,
    rejected_at TIMESTAMP WITH TIME ZONE,
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ================================
-- 2. Fix Projects Table
-- ================================

-- Add missing columns to projects table
DO $$ 
BEGIN
    -- Add archived_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='projects' AND column_name='archived_at') THEN
        ALTER TABLE projects ADD COLUMN archived_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    -- Add featured_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='projects' AND column_name='featured_at') THEN
        ALTER TABLE projects ADD COLUMN featured_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    -- Add is_featured column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='projects' AND column_name='is_featured') THEN
        ALTER TABLE projects ADD COLUMN is_featured BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Create projects table if it doesn't exist
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    status TEXT DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT false,
    archived_at TIMESTAMP WITH TIME ZONE,
    featured_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ================================
-- 3. Fix Gallery Table (Alternative to Projects)
-- ================================

-- Add missing columns to gallery table if it exists
DO $$ 
BEGIN
    -- Check if gallery table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='gallery') THEN
        -- Add archived_at column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name='gallery' AND column_name='archived_at') THEN
            ALTER TABLE gallery ADD COLUMN archived_at TIMESTAMP WITH TIME ZONE;
        END IF;
        
        -- Add featured_at column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name='gallery' AND column_name='featured_at') THEN
            ALTER TABLE gallery ADD COLUMN featured_at TIMESTAMP WITH TIME ZONE;
        END IF;
        
        -- Add is_featured column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name='gallery' AND column_name='is_featured') THEN
            ALTER TABLE gallery ADD COLUMN is_featured BOOLEAN DEFAULT false;
        END IF;
    END IF;
END $$;

-- ================================
-- 4. Create Meetings Table
-- ================================

CREATE TABLE IF NOT EXISTS meetings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TIME NOT NULL,
    location TEXT,
    max_attendees INTEGER DEFAULT 50,
    status TEXT DEFAULT 'scheduled',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ================================
-- 5. Create Meeting Registrations Table
-- ================================

CREATE TABLE IF NOT EXISTS meeting_registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    attendee_name TEXT NOT NULL,
    attendee_email TEXT NOT NULL,
    attendee_phone TEXT,
    status TEXT DEFAULT 'registered',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ================================
-- 6. Create Profiles Table (if not exists)
-- ================================

CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    full_name TEXT,
    username TEXT UNIQUE,
    avatar_url TEXT,
    phone TEXT,
    location TEXT,
    bio TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ================================
-- 7. Create Indexes for Better Performance
-- ================================

-- Reviews indexes
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_is_approved ON reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);

-- Projects indexes
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_is_featured ON projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

-- Gallery indexes (if exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='gallery') THEN
        CREATE INDEX IF NOT EXISTS idx_gallery_user_id ON gallery(user_id);
        CREATE INDEX IF NOT EXISTS idx_gallery_status ON gallery(status);
        CREATE INDEX IF NOT EXISTS idx_gallery_is_featured ON gallery(is_featured);
        CREATE INDEX IF NOT EXISTS idx_gallery_created_at ON gallery(created_at DESC);
    END IF;
END $$;

-- Meetings indexes
CREATE INDEX IF NOT EXISTS idx_meetings_date ON meetings(date);
CREATE INDEX IF NOT EXISTS idx_meetings_status ON meetings(status);
CREATE INDEX IF NOT EXISTS idx_meetings_created_at ON meetings(created_at DESC);

-- Meeting registrations indexes
CREATE INDEX IF NOT EXISTS idx_meeting_registrations_meeting_id ON meeting_registrations(meeting_id);
CREATE INDEX IF NOT EXISTS idx_meeting_registrations_user_id ON meeting_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_meeting_registrations_email ON meeting_registrations(attendee_email);
CREATE INDEX IF NOT EXISTS idx_meeting_registrations_status ON meeting_registrations(status);

-- ================================
-- 8. Create Update Triggers
-- ================================

-- Update trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_reviews_updated_at 
    BEFORE UPDATE ON reviews 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at 
    BEFORE UPDATE ON projects 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meetings_updated_at 
    BEFORE UPDATE ON meetings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meeting_registrations_updated_at 
    BEFORE UPDATE ON meeting_registrations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ================================
-- 9. Insert Sample Data for Testing
-- ================================

-- Insert sample meetings
INSERT INTO meetings (title, description, date, time, location) VALUES
('Steel Design Workshop', 'Learn modern steel design techniques', CURRENT_DATE + INTERVAL '7 days', '10:00:00', 'Hyderabad Office'),
('Project Review Meeting', 'Monthly project status review', CURRENT_DATE + INTERVAL '14 days', '14:00:00', 'Conference Room A'),
('Client Consultation', 'Discuss new commercial project requirements', CURRENT_DATE + INTERVAL '3 days', '11:30:00', 'Online - Zoom')
ON CONFLICT DO NOTHING;

-- Insert sample reviews
INSERT INTO reviews (reviewer_name, reviewer_email, rating, comment, is_approved) VALUES
('John Smith', 'john.smith@example.com', 5, 'Excellent steel work! Very professional team.', true),
('Sarah Johnson', 'sarah.j@company.com', 4, 'Great quality but delivery was slightly delayed.', true),
('Raj Patel', 'raj.patel@gmail.com', 5, 'Outstanding craftsmanship. Highly recommended!', null),
('Maria Garcia', 'maria.garcia@email.com', 3, 'Good work but could improve communication.', null)
ON CONFLICT DO NOTHING;

-- Insert sample projects (if projects table is used)
INSERT INTO projects (title, description, category, status, is_featured) VALUES
('Modern Office Building', 'Steel framework for 10-story commercial building', 'Commercial', 'published', true),
('Residential Complex Gate', 'Custom designed steel gates for luxury housing', 'Residential', 'published', false),
('Industrial Warehouse', 'Large span steel structure for logistics company', 'Industrial', 'draft', false)
ON CONFLICT DO NOTHING;

-- ================================
-- 10. Enable RLS (Optional)
-- ================================

-- Enable RLS on tables
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies (basic - can be customized)
-- Allow authenticated users to read
CREATE POLICY "Authenticated users can read reviews" ON reviews FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can read projects" ON projects FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can read meetings" ON meetings FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can read registrations" ON meeting_registrations FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can read profiles" ON profiles FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to update their own data
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Allow authenticated users to insert
CREATE POLICY "Authenticated users can insert reviews" ON reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert meeting registrations" ON meeting_registrations FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ================================
-- 11. Grant Permissions
-- ================================

-- Grant permissions to authenticated and anon users
GRANT ALL ON reviews TO authenticated;
GRANT ALL ON projects TO authenticated;
GRANT ALL ON meetings TO authenticated;
GRANT ALL ON meeting_registrations TO authenticated;
GRANT ALL ON profiles TO authenticated;

GRANT SELECT ON reviews TO anon;
GRANT SELECT ON projects TO anon;
GRANT SELECT ON meetings TO anon;
GRANT INSERT ON meeting_registrations TO anon;

-- ================================
-- 12. Show Table Status
-- ================================

-- Show all tables and their column counts
SELECT 
    schemaname,
    tablename,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = tablename) as column_count
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN ('reviews', 'projects', 'gallery', 'meetings', 'meeting_registrations', 'profiles', 'contact_messages')
ORDER BY tablename;
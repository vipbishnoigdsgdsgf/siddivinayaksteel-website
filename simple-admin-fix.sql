-- Simple Admin Panel Database Fix
-- Copy paste this into Supabase SQL Editor

-- 1. Fix Reviews Table
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- 2. Fix Projects Table  
ALTER TABLE projects ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS featured_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- 3. Fix Gallery Table (if exists)
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS featured_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- 4. Create Meetings Table
CREATE TABLE IF NOT EXISTS meetings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TIME NOT NULL,
    location TEXT,
    status TEXT DEFAULT 'scheduled',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Create Meeting Registrations Table
CREATE TABLE IF NOT EXISTS meeting_registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    meeting_id UUID REFERENCES meetings(id),
    attendee_name TEXT NOT NULL,
    attendee_email TEXT NOT NULL,
    attendee_phone TEXT,
    status TEXT DEFAULT 'registered',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. Disable RLS for testing (enable later if needed)
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE meetings DISABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_registrations DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 7. Insert test data
INSERT INTO meetings (title, description, date, time, location) VALUES
('Steel Workshop', 'Learn steel design', CURRENT_DATE + 7, '10:00', 'Office'),
('Project Review', 'Monthly review', CURRENT_DATE + 14, '14:00', 'Conference Room')
ON CONFLICT DO NOTHING;

INSERT INTO reviews (reviewer_name, reviewer_email, rating, comment, is_approved) VALUES
('Test User', 'test@example.com', 5, 'Great work!', true),
('Another User', 'user@test.com', 4, 'Good quality', null)
ON CONFLICT DO NOTHING;
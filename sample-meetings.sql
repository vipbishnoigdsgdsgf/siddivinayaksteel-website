-- Sample meetings for Siddi Vinayaka Steel Works
-- Run this in your Supabase SQL Editor to add functional meetings

-- First, ensure the meetings table exists with correct structure
CREATE TABLE IF NOT EXISTS meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  address TEXT,
  spots INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add sample meetings
INSERT INTO meetings (title, description, date, time, location, address, spots) VALUES 
(
  'Free Steel Railing Consultation',
  'Get expert advice on custom steel railing designs for your home or business. Our experienced team will discuss your requirements, provide design suggestions, and give you a detailed quote.',
  CURRENT_DATE + INTERVAL '3 days',
  '10:00 AM - 6:00 PM',
  'Siddi Vinayaka Steel Office',
  'Chengicherla X Road, Peerzadiguda, Hyderabad, Telangana 500098',
  5
),
(
  'Glass Fitting & Steel Work Consultation',
  'Comprehensive consultation for glass fitting solutions combined with steel framework. Perfect for modern architectural projects, glass railings, and commercial installations.',
  CURRENT_DATE + INTERVAL '5 days',
  '9:00 AM - 5:00 PM',
  'Main Workshop',
  'Chengicherla X Road, Peerzadiguda, Hyderabad, Telangana 500098',
  3
),
(
  'Commercial Steel Project Meeting',
  'Specialized consultation for large commercial and industrial steel projects. Discuss bulk requirements, project timelines, and custom fabrication needs.',
  CURRENT_DATE + INTERVAL '7 days',
  '11:00 AM - 4:00 PM',
  'Siddi Vinayaka Steel Office',
  'Chengicherla X Road, Peerzadiguda, Hyderabad, Telangana 500098',
  2
),
(
  'Weekend Steel Work Consultation',
  'Weekend consultation for busy professionals. Get expert advice on residential steel work, railings, gates, and custom fabrication projects.',
  CURRENT_DATE + INTERVAL '10 days',
  '10:00 AM - 3:00 PM',
  'Siddi Vinayaka Steel Office',
  'Chengicherla X Road, Peerzadiguda, Hyderabad, Telangana 500098',
  4
),
(
  'Custom Staircase Railing Design Session',
  'Specialized session focused on custom staircase railing designs. Bring your architectural plans and get personalized design recommendations.',
  CURRENT_DATE + INTERVAL '12 days',
  '2:00 PM - 6:00 PM',
  'Design Studio',
  'Chengicherla X Road, Peerzadiguda, Hyderabad, Telangana 500098',
  6
);

-- Create admin_notifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  details JSONB,
  recipient_emails TEXT[],
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_meetings_updated_at ON meetings;
CREATE TRIGGER update_meetings_updated_at 
  BEFORE UPDATE ON meetings 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on meetings table
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;

-- Create policies for meetings table
DROP POLICY IF EXISTS "Everyone can view meetings" ON meetings;
CREATE POLICY "Everyone can view meetings" ON meetings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only authenticated users can insert meetings" ON meetings;
CREATE POLICY "Only authenticated users can insert meetings" ON meetings FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Only authenticated users can update meetings" ON meetings;
CREATE POLICY "Only authenticated users can update meetings" ON meetings FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Only authenticated users can delete meetings" ON meetings;
CREATE POLICY "Only authenticated users can delete meetings" ON meetings FOR DELETE USING (auth.role() = 'authenticated');

-- Enable RLS on admin_notifications table
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_notifications table
DROP POLICY IF EXISTS "Only authenticated users can view admin notifications" ON admin_notifications;
CREATE POLICY "Only authenticated users can view admin notifications" ON admin_notifications FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Only authenticated users can insert admin notifications" ON admin_notifications;
CREATE POLICY "Only authenticated users can insert admin notifications" ON admin_notifications FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Only authenticated users can update admin notifications" ON admin_notifications;
CREATE POLICY "Only authenticated users can update admin notifications" ON admin_notifications FOR UPDATE USING (auth.role() = 'authenticated');

-- Insert success message
INSERT INTO admin_notifications (type, message, details, recipient_emails, read) VALUES (
  'system',
  'Sample meetings have been successfully added to your system',
  '{"meetings_added": 5, "date": "' || CURRENT_DATE || '"}',
  ARRAY['omprkashbishnoi2000@gmail.com'],
  false
);

-- Show the created meetings
SELECT 
  id,
  title,
  date,
  time,
  location,
  spots,
  '/register-meeting/' || id as registration_url
FROM meetings 
ORDER BY date ASC;
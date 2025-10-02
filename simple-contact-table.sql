-- Simple contact_messages table creation
-- Copy and paste this into Supabase SQL Editor

CREATE TABLE contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Disable RLS for now (enable later if needed)
ALTER TABLE contact_messages DISABLE ROW LEVEL SECURITY;

-- Insert test data
INSERT INTO contact_messages (name, email, message, status) VALUES
('John Doe', 'john@example.com', 'Interested in steel gate designs. Please provide pricing.', 'new'),
('Sarah Wilson', 'sarah@company.com', 'Looking for office partition solutions. Timeline?', 'new'),
('Raj Sharma', 'raj@gmail.com', 'Can you install skylight for kitchen? Materials?', 'read'),
('Mohammed Ali', 'm.ali@business.com', 'Excellent work! Very satisfied with quality.', 'replied'),
('Test User', 'test@test.com', 'This is a test message from the website contact form.', 'new');
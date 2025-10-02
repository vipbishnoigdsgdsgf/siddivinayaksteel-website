-- Create contact_messages table for storing contact form submissions
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add comments to the table and columns
COMMENT ON TABLE public.contact_messages IS 'Stores contact form submissions from website visitors';
COMMENT ON COLUMN public.contact_messages.id IS 'Unique identifier for each message';
COMMENT ON COLUMN public.contact_messages.name IS 'Name of the person who sent the message';
COMMENT ON COLUMN public.contact_messages.email IS 'Email address of the sender';
COMMENT ON COLUMN public.contact_messages.message IS 'The actual message content';
COMMENT ON COLUMN public.contact_messages.status IS 'Current status: new, read, replied, or archived';
COMMENT ON COLUMN public.contact_messages.created_at IS 'When the message was submitted';
COMMENT ON COLUMN public.contact_messages.updated_at IS 'When the message was last modified';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON public.contact_messages(email);

-- Enable Row Level Security (RLS)
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Allow anyone to insert (for contact form submissions)
CREATE POLICY "Anyone can submit contact messages" ON public.contact_messages
    FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read messages (for admin panel)
CREATE POLICY "Authenticated users can read contact messages" ON public.contact_messages
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to update messages (for status changes)
CREATE POLICY "Authenticated users can update contact messages" ON public.contact_messages
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create a trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_contact_messages_updated_at 
    BEFORE UPDATE ON public.contact_messages 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO public.contact_messages (name, email, message, status, created_at) VALUES
    ('John Doe', 'john.doe@example.com', 'Hello! I''m interested in your steel gate designs for my home. Could you please provide some pricing information?', 'new', now()),
    ('Sarah Wilson', 'sarah@company.com', 'We are looking for office partition solutions. Do you handle commercial projects? What''s your typical lead time?', 'new', now() - interval '2 hours'),
    ('Raj Sharma', 'raj.sharma@gmail.com', 'Hi, I saw your glass roofing work. Can you install a skylight for my kitchen? What materials do you recommend?', 'read', now() - interval '1 day'),
    ('Mohammed Ali', 'm.ali@business.com', 'Excellent work on the project! Very satisfied with the quality and service. Would definitely recommend to others.', 'replied', now() - interval '3 days'),
    ('Priya Patel', 'priya@home.com', 'Can you provide a quote for custom steel railings for my balcony? What''s the installation process?', 'new', now() - interval '30 minutes');

-- Grant necessary permissions
GRANT ALL ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO anon;

-- Show table structure
\d public.contact_messages;

-- Show sample data
SELECT id, name, email, LEFT(message, 50) as message_preview, status, created_at 
FROM public.contact_messages 
ORDER BY created_at DESC;
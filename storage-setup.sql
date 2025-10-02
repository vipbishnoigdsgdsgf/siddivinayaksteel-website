-- 🗂️ SUPABASE STORAGE BUCKETS SETUP
-- Run this after the main database setup

-- ============================================
-- CREATE STORAGE BUCKETS
-- ============================================

-- Create buckets for different types of uploads
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('avatars', 'avatars', true),
  ('images', 'images', true),
  ('gallery', 'gallery', true),
  ('projects', 'projects', true),
  ('meetings', 'meetings', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STORAGE POLICIES (PERMISSIVE FOR TESTING)
-- ============================================

-- AVATARS BUCKET POLICIES
CREATE POLICY "Allow public access to avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Allow authenticated users to upload avatars" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Allow users to update their own avatars" ON storage.objects
FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Allow users to delete their own avatars" ON storage.objects
FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- IMAGES BUCKET POLICIES
CREATE POLICY "Allow public access to images" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "Allow authenticated users to upload images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

CREATE POLICY "Allow users to update their own images" ON storage.objects
FOR UPDATE USING (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Allow users to delete their own images" ON storage.objects
FOR DELETE USING (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- GALLERY BUCKET POLICIES
CREATE POLICY "Allow public access to gallery" ON storage.objects
FOR SELECT USING (bucket_id = 'gallery');

CREATE POLICY "Allow authenticated users to upload gallery" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'gallery' AND auth.role() = 'authenticated');

CREATE POLICY "Allow users to update their own gallery images" ON storage.objects
FOR UPDATE USING (bucket_id = 'gallery' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Allow users to delete their own gallery images" ON storage.objects
FOR DELETE USING (bucket_id = 'gallery' AND auth.uid()::text = (storage.foldername(name))[1]);

-- PROJECTS BUCKET POLICIES
CREATE POLICY "Allow public access to projects" ON storage.objects
FOR SELECT USING (bucket_id = 'projects');

CREATE POLICY "Allow authenticated users to upload projects" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'projects' AND auth.role() = 'authenticated');

CREATE POLICY "Allow users to update their own project images" ON storage.objects
FOR UPDATE USING (bucket_id = 'projects' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Allow users to delete their own project images" ON storage.objects
FOR DELETE USING (bucket_id = 'projects' AND auth.uid()::text = (storage.foldername(name))[1]);

-- MEETINGS BUCKET POLICIES
CREATE POLICY "Allow public access to meetings" ON storage.objects
FOR SELECT USING (bucket_id = 'meetings');

CREATE POLICY "Allow authenticated users to upload meetings" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'meetings' AND auth.role() = 'authenticated');

CREATE POLICY "Allow users to update their own meeting images" ON storage.objects
FOR UPDATE USING (bucket_id = 'meetings' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Allow users to delete their own meeting images" ON storage.objects
FOR DELETE USING (bucket_id = 'meetings' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================
-- STORAGE SETUP COMPLETE! 🎉
-- ============================================

-- Verify buckets were created
SELECT id, name, public, created_at 
FROM storage.buckets 
ORDER BY created_at;
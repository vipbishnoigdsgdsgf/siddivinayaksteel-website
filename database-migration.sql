-- Migration to add images array support to gallery table
-- Run this in Supabase SQL Editor

-- Add images column to gallery table
ALTER TABLE gallery 
ADD COLUMN IF NOT EXISTS images TEXT[];

-- Add comment to describe the column
COMMENT ON COLUMN gallery.images IS 'Array of image URLs for the gallery item. First image is also stored in image_url for backward compatibility.';

-- Update existing records to have images array with single image
UPDATE gallery 
SET images = ARRAY[image_url] 
WHERE images IS NULL AND image_url IS NOT NULL;

-- Optional: Add a check constraint to ensure at least one image
-- ALTER TABLE gallery 
-- ADD CONSTRAINT gallery_has_images 
-- CHECK (
--   (images IS NOT NULL AND array_length(images, 1) >= 1 AND array_length(images, 1) <= 4) 
--   OR 
--   (image_url IS NOT NULL)
-- );
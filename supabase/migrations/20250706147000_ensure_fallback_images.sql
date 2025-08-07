/*
  # Ensure Fallback Images

  This migration ensures all services have at least a fallback image
  so that gig banners always display something.
*/

-- Update all services that have no image_url to use the fallback
UPDATE services 
SET image_url = 'gigbanner.webp'
WHERE image_url IS NULL OR image_url = '' OR image_url = 'null';

-- Update all services that have no images array to use the fallback
UPDATE services 
SET images = '["gigbanner.webp"]'
WHERE images IS NULL OR images = '[]' OR images = 'null';

-- Ensure all services have at least one image in the images array
UPDATE services 
SET images = '["gigbanner.webp"]'
WHERE images IS NULL OR images = '[]' OR images = 'null';

-- For services that have image_url but no images array, create images array
UPDATE services 
SET images = jsonb_build_array(image_url)
WHERE (images IS NULL OR images = '[]' OR images = 'null') 
  AND image_url IS NOT NULL 
  AND image_url != '';

-- Final check: ensure all services have both image_url and images
UPDATE services 
SET 
  image_url = COALESCE(image_url, 'gigbanner.webp'),
  images = COALESCE(images, '["gigbanner.webp"]')
WHERE image_url IS NULL OR images IS NULL; 
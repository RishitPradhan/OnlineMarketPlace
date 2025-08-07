/*
  # Fix Image Consistency

  This migration ensures that all services have consistent image data
  so that gig banners and thumbnails show the same images.
*/

-- Update all services to have consistent image data
-- Set image_url to the first image from images array if available
UPDATE services 
SET image_url = (
  CASE 
    WHEN images IS NOT NULL AND images != '[]' AND images != 'null' THEN
      CASE 
        WHEN jsonb_typeof(images) = 'array' THEN 
          COALESCE(images->0, '"gigbanner.webp"')
        WHEN jsonb_typeof(images) = 'string' THEN
          COALESCE(images, '"gigbanner.webp"')
        ELSE '"gigbanner.webp"'
      END
    ELSE 'gigbanner.webp'
  END
)
WHERE image_url IS NULL OR image_url = '';

-- Ensure all services have images array with at least one image
UPDATE services 
SET images = (
  CASE 
    WHEN images IS NULL OR images = '[]' OR images = 'null' THEN
      CASE 
        WHEN image_url IS NOT NULL AND image_url != '' THEN
          jsonb_build_array(image_url)
        ELSE
          jsonb_build_array('gigbanner.webp')
      END
    ELSE images
  END
)
WHERE images IS NULL OR images = '[]' OR images = 'null';

-- For services that have image_url but no images array, create images array
UPDATE services 
SET images = jsonb_build_array(image_url)
WHERE (images IS NULL OR images = '[]' OR images = 'null') 
  AND image_url IS NOT NULL 
  AND image_url != '';

-- Ensure all services have at least one image in the images array
UPDATE services 
SET images = jsonb_build_array('gigbanner.webp')
WHERE images IS NULL OR images = '[]' OR images = 'null';

-- Update specific services to have better image consistency
UPDATE services 
SET 
  image_url = 'gigbanner.webp',
  images = jsonb_build_array('gigbanner.webp', 'gigbanner.webp', 'gigbanner.webp')
WHERE category IN ('web-development', 'app-development', 'graphic-design', 'ui-ux-design');

-- Update mobile app development services with specific images
UPDATE services 
SET 
  image_url = 'gigbanner.webp',
  images = jsonb_build_array('gigbanner.webp', 'gigbanner.webp', 'gigbanner.webp')
WHERE id LIKE 'mobile-%';

-- Update graphic design services with specific images
UPDATE services 
SET 
  image_url = 'gigbanner.webp',
  images = jsonb_build_array('gigbanner.webp', 'gigbanner.webp', 'gigbanner.webp')
WHERE id LIKE 'graphic-%';

-- Update UI/UX design services with specific images
UPDATE services 
SET 
  image_url = 'gigbanner.webp',
  images = jsonb_build_array('gigbanner.webp', 'gigbanner.webp', 'gigbanner.webp')
WHERE id LIKE 'uiux-%';

-- Update video production services with specific images
UPDATE services 
SET 
  image_url = 'gigbanner.webp',
  images = jsonb_build_array('gigbanner.webp', 'gigbanner.webp', 'gigbanner.webp')
WHERE id LIKE 'video-%';

-- Update audio/music services with specific images
UPDATE services 
SET 
  image_url = 'gigbanner.webp',
  images = jsonb_build_array('gigbanner.webp', 'gigbanner.webp', 'gigbanner.webp')
WHERE id LIKE 'audio-%';

-- Update translation services with specific images
UPDATE services 
SET 
  image_url = 'gigbanner.webp',
  images = jsonb_build_array('gigbanner.webp', 'gigbanner.webp', 'gigbanner.webp')
WHERE id LIKE 'trans-%';

-- Update voice over services with specific images
UPDATE services 
SET 
  image_url = 'gigbanner.webp',
  images = jsonb_build_array('gigbanner.webp', 'gigbanner.webp', 'gigbanner.webp')
WHERE id LIKE 'voice-%';

-- Update photography services with specific images
UPDATE services 
SET 
  image_url = 'gigbanner.webp',
  images = jsonb_build_array('gigbanner.webp', 'gigbanner.webp', 'gigbanner.webp')
WHERE id LIKE 'photo-%';

-- Update illustration services with specific images
UPDATE services 
SET 
  image_url = 'gigbanner.webp',
  images = jsonb_build_array('gigbanner.webp', 'gigbanner.webp', 'gigbanner.webp')
WHERE id LIKE 'illus-%';

-- Update animation services with specific images
UPDATE services 
SET 
  image_url = 'gigbanner.webp',
  images = jsonb_build_array('gigbanner.webp', 'gigbanner.webp', 'gigbanner.webp')
WHERE id LIKE 'anim-%';

-- Update game development services with specific images
UPDATE services 
SET 
  image_url = 'gigbanner.webp',
  images = jsonb_build_array('gigbanner.webp', 'gigbanner.webp', 'gigbanner.webp')
WHERE id LIKE 'game-%';

-- Update virtual assistant services with specific images
UPDATE services 
SET 
  image_url = 'gigbanner.webp',
  images = jsonb_build_array('gigbanner.webp', 'gigbanner.webp', 'gigbanner.webp')
WHERE id LIKE 'va-%';

-- Update cybersecurity services with specific images
UPDATE services 
SET 
  image_url = 'gigbanner.webp',
  images = jsonb_build_array('gigbanner.webp', 'gigbanner.webp', 'gigbanner.webp')
WHERE id LIKE 'cyber-%';

-- Update data analysis services with specific images
UPDATE services 
SET 
  image_url = 'gigbanner.webp',
  images = jsonb_build_array('gigbanner.webp', 'gigbanner.webp', 'gigbanner.webp')
WHERE id LIKE 'data-%';

-- Final consistency check: ensure all services have both image_url and images
UPDATE services 
SET 
  image_url = COALESCE(image_url, 'gigbanner.webp'),
  images = COALESCE(images, jsonb_build_array('gigbanner.webp'))
WHERE image_url IS NULL OR images IS NULL; 
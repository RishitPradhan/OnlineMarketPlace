/*
  # Fix Image References
  
  This migration updates all services to use actual available images
  instead of the non-existent 'gigbanner.webp' file.
*/

-- Available images from the public folder
WITH available_images AS (
  SELECT unnest(ARRAY[
    '/OIPbg.png',
    '/OIPfdf.png',
    '/OIPfef.png',
    '/OIPefe.png',
    '/OIPcdf.png',
    '/OIPnc.png',
    '/OIPb.png',
    '/OIPg.png',
    '/why-trust-slideuplift-presentation-design-services-6.png',
    '/OIPn.png',
    '/OIPf.png',
    '/OIPdf.png',
    '/OIPvg.png',
    '/OIPfg.png',
    '/wp9517064.png',
    '/representations_user_experience_interface_design_23_2150038900_74c059d2e1.png',
    '/OIP78.png',
    '/R.png',
    '/OIPuj.png',
    '/graphic-design.png',
    '/OIPj.png',
    '/Thumbnail-1.png',
    '/seo-techniques.png',
    '/Facility_Management_Software_fd01278999.png',
    '/OIPh.png',
    '/OIP34.png',
    '/OIPt.png',
    '/banner-content-writing.png',
    '/6.png',
    '/business-women-work-computers-write-notepad-with-pen-calculate-financial-statements-office_931309-4329.png',
    '/574-5741689_content-writing-services-png-transparent-png.png',
    '/OIP9.png',
    '/OIP.8png.png',
    '/OIP7.png',
    '/OIP6.png',
    '/OIP5.png',
    '/OIP4.png',
    '/OIP3.png',
    '/OIP2.png',
    '/7-Tips-to-Localize-and-Translate-Apps.png',
    '/Social-media-marketing-01-1024x536.png',
    '/social-media-engagement_839035-839915.png',
    '/datadriven-social-media-management-for-startups-ihh.png',
    '/featured_homepage.png',
    '/OIP1.png',
    '/pexels-francesco-paggiaro-2111015-scaled.png',
    '/wp4269240.png',
    '/InTheStudio.png',
    '/music-8589292_640.png',
    '/OIP.png',
    '/TharLU.png',
    '/Artboard-22.png'
  ]) as image_path
)
-- Update all services to use random available images
UPDATE services 
SET 
  image_url = (
    SELECT image_path 
    FROM available_images 
    ORDER BY (id::text || image_path)::hash 
    LIMIT 1
  ),
  images = (
    SELECT jsonb_build_array(
      (SELECT image_path FROM available_images ORDER BY (id::text || image_path)::hash LIMIT 1),
      (SELECT image_path FROM available_images ORDER BY (id::text || image_path)::hash LIMIT 1 OFFSET 1),
      (SELECT image_path FROM available_images ORDER BY (id::text || image_path)::hash LIMIT 1 OFFSET 2)
    )
  )
WHERE image_url = 'gigbanner.webp' 
   OR image_url IS NULL 
   OR image_url = '';

-- Also update any services that have empty or null images arrays
UPDATE services 
SET images = jsonb_build_array(image_url)
WHERE images IS NULL 
   OR images = '[]' 
   OR images = 'null';

-- Ensure all services have at least one image
UPDATE services 
SET 
  image_url = COALESCE(image_url, '/OIPbg.png'),
  images = COALESCE(images, jsonb_build_array('/OIPbg.png'))
WHERE image_url IS NULL 
   OR images IS NULL; 
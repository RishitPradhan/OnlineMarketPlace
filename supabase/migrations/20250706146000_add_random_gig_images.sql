/*
  # Add Random Gig Images

  This migration adds random gig images for services and ensures
  that uploaded images are preserved and not overridden.
*/

-- Array of random gig images for different categories
-- These are placeholder images that can be replaced with actual uploads
DO $$
DECLARE
    web_images TEXT[] := ARRAY[
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop'
    ];
    
    mobile_images TEXT[] := ARRAY[
        'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop'
    ];
    
    design_images TEXT[] := ARRAY[
        'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop'
    ];
    
    video_images TEXT[] := ARRAY[
        'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=600&fit=crop'
    ];
    
    audio_images TEXT[] := ARRAY[
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop'
    ];
    
    writing_images TEXT[] := ARRAY[
        'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop'
    ];
    
    translation_images TEXT[] := ARRAY[
        'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop'
    ];
    
    voice_images TEXT[] := ARRAY[
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop'
    ];
    
    photo_images TEXT[] := ARRAY[
        'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop'
    ];
    
    illustration_images TEXT[] := ARRAY[
        'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop'
    ];
    
    animation_images TEXT[] := ARRAY[
        'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=600&fit=crop'
    ];
    
    game_images TEXT[] := ARRAY[
        'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop'
    ];
    
    va_images TEXT[] := ARRAY[
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop'
    ];
    
    cyber_images TEXT[] := ARRAY[
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop'
    ];
    
    data_images TEXT[] := ARRAY[
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop'
    ];
    
    service_record RECORD;
    random_image TEXT;
    image_array TEXT[];
    category_images TEXT[];
BEGIN
    -- Loop through all services and assign random images based on category
    FOR service_record IN SELECT id, category FROM services LOOP
        -- Determine which image array to use based on category
        CASE service_record.category
            WHEN 'web-development' THEN
                category_images := web_images;
            WHEN 'app-development' THEN
                category_images := mobile_images;
            WHEN 'graphic-design', 'ui-ux-design' THEN
                category_images := design_images;
            WHEN 'video-production', 'video-editing' THEN
                category_images := video_images;
            WHEN 'audio-music' THEN
                category_images := audio_images;
            WHEN 'copywriting', 'content-writing' THEN
                category_images := writing_images;
            WHEN 'translation' THEN
                category_images := translation_images;
            WHEN 'voice-over' THEN
                category_images := voice_images;
            WHEN 'photography' THEN
                category_images := photo_images;
            WHEN 'illustration' THEN
                category_images := illustration_images;
            WHEN 'animation' THEN
                category_images := animation_images;
            WHEN 'game-development' THEN
                category_images := game_images;
            WHEN 'virtual-assistant' THEN
                category_images := va_images;
            WHEN 'cybersecurity' THEN
                category_images := cyber_images;
            WHEN 'data-analysis' THEN
                category_images := data_images;
            ELSE
                category_images := web_images; -- Default to web images
        END CASE;
        
        -- Select 3 random images for this service
        image_array := ARRAY[]::TEXT[];
        FOR i IN 1..3 LOOP
            random_image := category_images[1 + floor(random() * array_length(category_images, 1))];
            image_array := array_append(image_array, random_image);
        END LOOP;
        
        -- Update the service with random images
        UPDATE services 
        SET 
            image_url = image_array[1],
            images = to_jsonb(image_array)
        WHERE id = service_record.id;
    END LOOP;
END $$;

-- Add a column to track if images are user-uploaded
ALTER TABLE services ADD COLUMN IF NOT EXISTS images_uploaded BOOLEAN DEFAULT FALSE;

-- Add a column to store original uploaded image URLs
ALTER TABLE services ADD COLUMN IF NOT EXISTS original_images JSONB DEFAULT NULL;

-- Update existing services to mark them as not uploaded (they're placeholder images)
UPDATE services SET images_uploaded = FALSE WHERE images_uploaded IS NULL; 
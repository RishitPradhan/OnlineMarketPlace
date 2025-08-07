/*
  # Remove adi randi video services specifically

  1. Remove Services
    - Remove all services from users with "adi" or "randi" in their names
    - Remove any video services with "adi" or "randi" references
    - Clean up video editing category completely

  2. Add Replacement Video Services
    - Add professional video editing services from legitimate users
    - Ensure video editing category has proper services
*/

-- Step 1: Remove all services from users with "adi" or "randi" in their names
DELETE FROM services 
WHERE freelancer_id IN (
  SELECT id FROM users 
  WHERE email ILIKE '%adi%' 
     OR email ILIKE '%randi%' 
     OR first_name ILIKE '%adi%' 
     OR last_name ILIKE '%randi%'
);

-- Step 2: Remove any services with "adi" or "randi" in title or description
DELETE FROM services 
WHERE title ILIKE '%adi%' 
   OR title ILIKE '%randi%' 
   OR description ILIKE '%adi%' 
   OR description ILIKE '%randi%';

-- Step 3: Remove any video services that might be problematic
DELETE FROM services 
WHERE category IN ('video-editing', 'video-production')
  AND (title ILIKE '%adi%' 
       OR title ILIKE '%randi%' 
       OR description ILIKE '%adi%' 
       OR description ILIKE '%randi%'
       OR freelancer_id IN (
         SELECT id FROM users 
         WHERE email ILIKE '%adi%' 
            OR email ILIKE '%randi%' 
            OR first_name ILIKE '%adi%' 
            OR last_name ILIKE '%randi%'
       ));

-- Step 4: Add professional video editing services from legitimate users
INSERT INTO services (id, freelancer_id, title, description, category, price, delivery_time, image_url, tags, is_active, created_at, updated_at) VALUES
  (
    've-001-professional-editing',
    '55555555-5555-5555-5555-555555555555',
    'Professional Video Editing',
    'Professional video editing with color grading, transitions, and audio enhancement for all types of content.',
    'video-editing',
    400.00,
    5,
    '/gigbanner.webp',
    ARRAY['Video Editing', 'Color Grading', 'Transitions', 'Audio Enhancement'],
    true,
    now(),
    now()
  ),
  (
    've-002-youtube-editing',
    '55555555-5555-5555-5555-555555555555',
    'YouTube Video Editing',
    'Specialized YouTube video editing with thumbnails, captions, and optimization for engagement.',
    'video-editing',
    300.00,
    4,
    '/gigbanner.webp',
    ARRAY['YouTube Editing', 'Thumbnails', 'Captions', 'Engagement'],
    true,
    now(),
    now()
  ),
  (
    've-003-commercial-editing',
    '55555555-5555-5555-5555-555555555555',
    'Commercial Video Editing',
    'Professional commercial video editing for advertisements, promotional content, and brand videos.',
    'video-editing',
    600.00,
    7,
    '/gigbanner.webp',
    ARRAY['Commercial Editing', 'Advertisements', 'Brand Videos', 'Promotional'],
    true,
    now(),
    now()
  ),
  (
    've-004-wedding-editing',
    '55555555-5555-5555-5555-555555555555',
    'Wedding Video Editing',
    'Beautiful wedding video editing with emotional storytelling and cinematic effects.',
    'video-editing',
    500.00,
    10,
    '/gigbanner.webp',
    ARRAY['Wedding Editing', 'Cinematic', 'Storytelling', 'Emotional'],
    true,
    now(),
    now()
  ),
  (
    've-005-corporate-editing',
    '55555555-5555-5555-5555-555555555555',
    'Corporate Video Editing',
    'Professional corporate video editing for businesses, presentations, and training materials.',
    'video-editing',
    450.00,
    6,
    '/gigbanner.webp',
    ARRAY['Corporate Video', 'Business Video', 'Presentations', 'Training'],
    true,
    now(),
    now()
  );

-- Step 5: Add video production services
INSERT INTO services (id, freelancer_id, title, description, category, price, delivery_time, image_url, tags, is_active, created_at, updated_at) VALUES
  (
    'vp-001-video-production',
    '55555555-5555-5555-5555-555555555555',
    'Complete Video Production',
    'Full video production services including filming, editing, and post-production for all types of content.',
    'video-production',
    800.00,
    14,
    '/gigbanner.webp',
    ARRAY['Video Production', 'Filming', 'Editing', 'Post-production'],
    true,
    now(),
    now()
  ),
  (
    'vp-002-animation-production',
    '55555555-5555-5555-5555-555555555555',
    'Animation & Motion Graphics',
    'Professional animation and motion graphics for commercials, presentations, and social media content.',
    'video-production',
    600.00,
    8,
    '/gigbanner.webp',
    ARRAY['Animation', 'Motion Graphics', 'After Effects', 'Commercials'],
    true,
    now(),
    now()
  ),
  (
    'vp-003-social-media-videos',
    '55555555-5555-5555-5555-555555555555',
    'Social Media Video Production',
    'Engaging social media video production for Instagram, TikTok, and other platforms.',
    'video-production',
    350.00,
    5,
    '/gigbanner.webp',
    ARRAY['Social Media', 'Instagram', 'TikTok', 'Engaging Content'],
    true,
    now(),
    now()
  );

-- Step 6: Update all new video services with plans, images, and FAQs
UPDATE services SET 
  plans = '[
    {
      "name": "Basic",
      "price": 300,
      "desc": "Essential video editing package",
      "features": ["Basic editing", "Color correction", "Audio sync", "2 revisions"],
      "delivery": "5 days"
    },
    {
      "name": "Standard",
      "price": 500,
      "desc": "Professional video editing package",
      "features": ["Advanced editing", "Color grading", "Audio enhancement", "5 revisions"],
      "delivery": "3 days"
    },
    {
      "name": "Premium",
      "price": 800,
      "desc": "Complete video editing package",
      "features": ["Full editing", "Professional grading", "Audio mastering", "Unlimited revisions"],
      "delivery": "1 day"
    }
  ]',
  images = '["/gigbanner.webp", "/gigbanner.webp", "/gigbanner.webp"]',
  faqs = '[
    {"q": "What video formats do you support?", "a": "I support all major video formats including MP4, MOV, AVI, and more."},
    {"q": "How long does video editing take?", "a": "Editing time depends on the package. Basic: 5 days, Standard: 3 days, Premium: 1 day."},
    {"q": "Do you provide source files?", "a": "Yes, I provide all source files and project files upon request."}
  ]'
WHERE id IN (
  've-001-professional-editing',
  've-002-youtube-editing',
  've-003-commercial-editing',
  've-004-wedding-editing',
  've-005-corporate-editing',
  'vp-001-video-production',
  'vp-002-animation-production',
  'vp-003-social-media-videos'
);

-- Step 7: Ensure no services remain from problematic users
DELETE FROM services 
WHERE freelancer_id IN (
  SELECT id FROM users 
  WHERE email ILIKE '%adi%' 
     OR email ILIKE '%randi%' 
     OR first_name ILIKE '%adi%' 
     OR last_name ILIKE '%randi%'
); 
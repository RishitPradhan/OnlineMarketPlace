/*
  # Remove adi randi services and add missing categories

  1. Remove Services
    - Remove all services from "adi randi" user
    - Remove any services with "adi" or "randi" references

  2. Add Missing Services
    - Add Graphic Design services
    - Add Video Editing services (replacing adi randi's)
    - Add UI/UX Design services
    - Add Content Writing services
*/

-- First, remove any services from users with "adi" or "randi" in their names
DELETE FROM services 
WHERE freelancer_id IN (
  SELECT id FROM users 
  WHERE email ILIKE '%adi%' 
     OR email ILIKE '%randi%' 
     OR first_name ILIKE '%adi%' 
     OR last_name ILIKE '%randi%'
);

-- Remove any services with "adi" or "randi" in title or description
DELETE FROM services 
WHERE title ILIKE '%adi%' 
   OR title ILIKE '%randi%' 
   OR description ILIKE '%adi%' 
   OR description ILIKE '%randi%';

-- Add Graphic Design services
INSERT INTO services (id, freelancer_id, title, description, category, price, delivery_time, image_url, tags, is_active, created_at, updated_at) VALUES
  (
    'gd-001-graphic-design',
    '44444444-4444-4444-4444-444444444444',
    'Professional Graphic Design',
    'Professional graphic design services including logos, brochures, business cards, and marketing materials.',
    'graphic-design',
    250.00,
    4,
    '/gigbanner.webp',
    ARRAY['Graphic Design', 'Logo Design', 'Brochures', 'Business Cards'],
    true,
    now(),
    now()
  ),
  (
    'gd-002-print-design',
    '44444444-4444-4444-4444-444444444444',
    'Print Design Services',
    'Complete print design services including flyers, posters, banners, and promotional materials.',
    'graphic-design',
    180.00,
    3,
    '/gigbanner.webp',
    ARRAY['Print Design', 'Flyers', 'Posters', 'Banners'],
    true,
    now(),
    now()
  ),
  (
    'gd-003-digital-graphics',
    '44444444-4444-4444-4444-444444444444',
    'Digital Graphics Design',
    'Modern digital graphics for social media, websites, and digital marketing campaigns.',
    'graphic-design',
    120.00,
    2,
    '/gigbanner.webp',
    ARRAY['Digital Graphics', 'Social Media', 'Web Graphics', 'Marketing'],
    true,
    now(),
    now()
  );

-- Add Video Editing services (replacing adi randi's services)
INSERT INTO services (id, freelancer_id, title, description, category, price, delivery_time, image_url, tags, is_active, created_at, updated_at) VALUES
  (
    've-001-video-editing',
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
  );

-- Add UI/UX Design services
INSERT INTO services (id, freelancer_id, title, description, category, price, delivery_time, image_url, tags, is_active, created_at, updated_at) VALUES
  (
    'ui-001-ui-design',
    '44444444-4444-4444-4444-444444444444',
    'UI/UX Design',
    'Professional UI/UX design for web and mobile applications with user-centered design approach.',
    'ui-ux-design',
    800.00,
    10,
    '/gigbanner.webp',
    ARRAY['UI Design', 'UX Design', 'User Research', 'Prototyping'],
    true,
    now(),
    now()
  ),
  (
    'ui-002-wireframing',
    '44444444-4444-4444-4444-444444444444',
    'Wireframing & Prototyping',
    'Professional wireframing and prototyping services for web and mobile applications.',
    'ui-ux-design',
    400.00,
    5,
    '/gigbanner.webp',
    ARRAY['Wireframing', 'Prototyping', 'User Flows', 'Information Architecture'],
    true,
    now(),
    now()
  );

-- Add Content Writing services
INSERT INTO services (id, freelancer_id, title, description, category, price, delivery_time, image_url, tags, is_active, created_at, updated_at) VALUES
  (
    'cw-003-blog-writing',
    '11111111-1111-1111-1111-111111111111',
    'Blog Writing Services',
    'Professional blog writing services with SEO optimization and engaging content for your website.',
    'content-writing',
    100.00,
    3,
    '/gigbanner.webp',
    ARRAY['Blog Writing', 'SEO Content', 'Engaging Content', 'Website Content'],
    true,
    now(),
    now()
  ),
  (
    'cw-004-product-descriptions',
    '11111111-1111-1111-1111-111111111111',
    'Product Description Writing',
    'Compelling product descriptions that convert browsers into buyers for e-commerce websites.',
    'content-writing',
    80.00,
    2,
    '/gigbanner.webp',
    ARRAY['Product Descriptions', 'E-commerce', 'Conversion', 'Sales Copy'],
    true,
    now(),
    now()
  );

-- Add more services for categories that need more representation
INSERT INTO services (id, freelancer_id, title, description, category, price, delivery_time, image_url, tags, is_active, created_at, updated_at) VALUES
  (
    'wd-003-php-development',
    '22222222-2222-2222-2222-222222222222',
    'PHP Development',
    'Professional PHP development for web applications, APIs, and custom solutions.',
    'web-development',
    1200.00,
    12,
    '/gigbanner.webp',
    ARRAY['PHP', 'Laravel', 'WordPress', 'API Development'],
    true,
    now(),
    now()
  ),
  (
    'ds-003-logo-design',
    '44444444-4444-4444-4444-444444444444',
    'Logo Design Services',
    'Professional logo design with multiple concepts, revisions, and brand guidelines.',
    'design',
    200.00,
    5,
    '/gigbanner.webp',
    ARRAY['Logo Design', 'Brand Identity', 'Vector Graphics', 'Brand Guidelines'],
    true,
    now(),
    now()
  ),
  (
    'sm-003-instagram-marketing',
    '11111111-1111-1111-1111-111111111111',
    'Instagram Marketing',
    'Complete Instagram marketing services including content creation, growth strategies, and engagement.',
    'social-media',
    250.00,
    30,
    '/gigbanner.webp',
    ARRAY['Instagram Marketing', 'Content Creation', 'Growth Strategy', 'Engagement'],
    true,
    now(),
    now()
  );

-- Update all new services with plans, images, and FAQs
UPDATE services SET 
  plans = '[
    {
      "name": "Basic",
      "price": 200,
      "desc": "Essential service package",
      "features": ["Basic features", "Standard delivery", "2 revisions"],
      "delivery": "5 days"
    },
    {
      "name": "Standard",
      "price": 400,
      "desc": "Professional service package",
      "features": ["Advanced features", "Priority delivery", "5 revisions"],
      "delivery": "3 days"
    },
    {
      "name": "Premium",
      "price": 800,
      "desc": "Complete service package",
      "features": ["All features", "Express delivery", "Unlimited revisions"],
      "delivery": "1 day"
    }
  ]',
  images = '["/gigbanner.webp", "/gigbanner.webp", "/gigbanner.webp"]',
  faqs = '[
    {"q": "What is included in your service?", "a": "My service includes all the features listed in the package you selected, plus professional support throughout the process."},
    {"q": "How long does delivery take?", "a": "Delivery time depends on the package you choose. Basic: 5 days, Standard: 3 days, Premium: 1 day."},
    {"q": "Do you offer revisions?", "a": "Yes, I offer revisions based on your package. Basic: 2 revisions, Standard: 5 revisions, Premium: Unlimited revisions."}
  ]'
WHERE id IN (
  'gd-001-graphic-design',
  'gd-002-print-design',
  'gd-003-digital-graphics',
  've-001-video-editing',
  've-002-youtube-editing',
  've-003-commercial-editing',
  'ui-001-ui-design',
  'ui-002-wireframing',
  'cw-003-blog-writing',
  'cw-004-product-descriptions',
  'wd-003-php-development',
  'ds-003-logo-design',
  'sm-003-instagram-marketing'
); 
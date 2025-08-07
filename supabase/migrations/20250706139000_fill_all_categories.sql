/*
  # Fill all categories with services

  1. Additional Services
    - Add services for missing categories
    - Ensure every category has at least 2-3 services
    - Cover all major service types
    - Add services for categories that need more representation
*/

-- Add services for missing categories

-- Virtual Assistant Services
INSERT INTO services (id, freelancer_id, title, description, category, price, delivery_time, image_url, tags, is_active, created_at, updated_at) VALUES
  (
    'va-001-virtual-assistant',
    '11111111-1111-1111-1111-111111111111',
    'Virtual Assistant Services',
    'Professional virtual assistant services including email management, scheduling, and administrative tasks.',
    'virtual-assistant',
    150.00,
    1,
    '/gigbanner.webp',
    ARRAY['Virtual Assistant', 'Administrative', 'Email Management', 'Scheduling'],
    true,
    now(),
    now()
  ),
  (
    'va-002-executive-assistant',
    '55555555-5555-5555-5555-555555555555',
    'Executive Assistant',
    'High-level executive assistant services including project management, research, and strategic support.',
    'virtual-assistant',
    300.00,
    1,
    '/gigbanner.webp',
    ARRAY['Executive Assistant', 'Project Management', 'Research', 'Strategic Support'],
    true,
    now(),
    now()
  );

-- Translation Services
INSERT INTO services (id, freelancer_id, title, description, category, price, delivery_time, image_url, tags, is_active, created_at, updated_at) VALUES
  (
    'tr-001-translation',
    '44444444-4444-4444-4444-444444444444',
    'Professional Translation',
    'High-quality translation services for documents, websites, and content in multiple languages.',
    'translation',
    200.00,
    3,
    '/gigbanner.webp',
    ARRAY['Translation', 'Multilingual', 'Documents', 'Content'],
    true,
    now(),
    now()
  ),
  (
    'tr-002-localization',
    '11111111-1111-1111-1111-111111111111',
    'Website Localization',
    'Complete website localization services including translation, cultural adaptation, and SEO optimization.',
    'translation',
    500.00,
    7,
    '/gigbanner.webp',
    ARRAY['Localization', 'Website Translation', 'Cultural Adaptation', 'SEO'],
    true,
    now(),
    now()
  );

-- Voice Over Services
INSERT INTO services (id, freelancer_id, title, description, category, price, delivery_time, image_url, tags, is_active, created_at, updated_at) VALUES
  (
    'vo-001-voice-over',
    '55555555-5555-5555-5555-555555555555',
    'Professional Voice Over',
    'Professional voice over services for commercials, videos, and presentations with multiple voice options.',
    'voice-over',
    250.00,
    2,
    '/gigbanner.webp',
    ARRAY['Voice Over', 'Recording', 'Professional Voice', 'Commercials'],
    true,
    now(),
    now()
  ),
  (
    'vo-002-character-voice',
    '44444444-4444-4444-4444-444444444444',
    'Character Voice Acting',
    'Professional character voice acting for animations, games, and entertainment projects.',
    'voice-over',
    400.00,
    5,
    '/gigbanner.webp',
    ARRAY['Voice Acting', 'Character Voices', 'Animation', 'Games'],
    true,
    now(),
    now()
  );

-- Photography Services
INSERT INTO services (id, freelancer_id, title, description, category, price, delivery_time, image_url, tags, is_active, created_at, updated_at) VALUES
  (
    'ph-001-photography',
    '44444444-4444-4444-4444-444444444444',
    'Professional Photography',
    'High-quality photography services for products, events, and portraits with professional editing.',
    'photography',
    300.00,
    5,
    '/gigbanner.webp',
    ARRAY['Photography', 'Product Photos', 'Event Photography', 'Portraits'],
    true,
    now(),
    now()
  ),
  (
    'ph-002-product-photography',
    '55555555-5555-5555-5555-555555555555',
    'Product Photography',
    'Professional product photography for e-commerce with white background and lifestyle shots.',
    'photography',
    200.00,
    3,
    '/gigbanner.webp',
    ARRAY['Product Photography', 'E-commerce', 'White Background', 'Lifestyle'],
    true,
    now(),
    now()
  );

-- Illustration Services
INSERT INTO services (id, freelancer_id, title, description, category, price, delivery_time, image_url, tags, is_active, created_at, updated_at) VALUES
  (
    'il-001-illustration',
    '44444444-4444-4444-4444-444444444444',
    'Custom Illustration',
    'Custom illustrations for books, websites, and marketing materials with unique artistic style.',
    'illustration',
    180.00,
    4,
    '/gigbanner.webp',
    ARRAY['Illustration', 'Custom Art', 'Digital Art', 'Creative'],
    true,
    now(),
    now()
  ),
  (
    'il-002-character-design',
    '44444444-4444-4444-4444-444444444444',
    'Character Design',
    'Custom character design for games, animations, and branding with multiple style options.',
    'illustration',
    250.00,
    5,
    '/gigbanner.webp',
    ARRAY['Character Design', 'Digital Art', 'Animation', 'Gaming'],
    true,
    now(),
    now()
  );

-- Animation Services
INSERT INTO services (id, freelancer_id, title, description, category, price, delivery_time, image_url, tags, is_active, created_at, updated_at) VALUES
  (
    'an-001-animation',
    '55555555-5555-5555-5555-555555555555',
    '2D Animation',
    'Professional 2D animation services for videos, presentations, and marketing materials.',
    'animation',
    500.00,
    7,
    '/gigbanner.webp',
    ARRAY['Animation', '2D Animation', 'Motion Graphics', 'Video'],
    true,
    now(),
    now()
  ),
  (
    'an-002-motion-graphics',
    '44444444-4444-4444-4444-444444444444',
    'Motion Graphics',
    'Professional motion graphics for commercials, presentations, and social media content.',
    'animation',
    400.00,
    5,
    '/gigbanner.webp',
    ARRAY['Motion Graphics', 'After Effects', 'Commercials', 'Social Media'],
    true,
    now(),
    now()
  );

-- Game Development Services
INSERT INTO services (id, freelancer_id, title, description, category, price, delivery_time, image_url, tags, is_active, created_at, updated_at) VALUES
  (
    'gd-001-game-development',
    '22222222-2222-2222-2222-222222222222',
    'Game Development',
    'Complete game development services including design, programming, and testing for mobile and web games.',
    'game-development',
    2000.00,
    30,
    '/gigbanner.webp',
    ARRAY['Game Development', 'Unity', 'Programming', 'Game Design'],
    true,
    now(),
    now()
  ),
  (
    'gd-002-mobile-games',
    '22222222-2222-2222-2222-222222222222',
    'Mobile Game Development',
    'Mobile game development for iOS and Android with monetization strategies and app store optimization.',
    'game-development',
    1500.00,
    25,
    '/gigbanner.webp',
    ARRAY['Mobile Games', 'iOS', 'Android', 'Monetization'],
    true,
    now(),
    now()
  );

-- Additional services for categories that need more representation

-- Web Development (additional)
INSERT INTO services (id, freelancer_id, title, description, category, price, delivery_time, image_url, tags, is_active, created_at, updated_at) VALUES
  (
    'wd-001-full-stack',
    '22222222-2222-2222-2222-222222222222',
    'Full Stack Development',
    'Complete full-stack web application development with modern technologies and best practices.',
    'web-development',
    3000.00,
    20,
    '/gigbanner.webp',
    ARRAY['Full Stack', 'React', 'Node.js', 'Database'],
    true,
    now(),
    now()
  ),
  (
    'wd-002-python-development',
    '22222222-2222-2222-2222-222222222222',
    'Python Web Development',
    'Python web development using Django and Flask with database integration and API development.',
    'web-development',
    1800.00,
    15,
    '/gigbanner.webp',
    ARRAY['Python', 'Django', 'Flask', 'API Development'],
    true,
    now(),
    now()
  );

-- Design (additional)
INSERT INTO services (id, freelancer_id, title, description, category, price, delivery_time, image_url, tags, is_active, created_at, updated_at) VALUES
  (
    'ds-001-website-design',
    '44444444-4444-4444-4444-444444444444',
    'Website Design',
    'Modern and responsive website design with user experience focus and conversion optimization.',
    'design',
    500.00,
    7,
    '/gigbanner.webp',
    ARRAY['Website Design', 'UX/UI', 'Responsive', 'Conversion'],
    true,
    now(),
    now()
  ),
  (
    'ds-002-app-design',
    '44444444-4444-4444-4444-444444444444',
    'Mobile App Design',
    'Professional mobile app design for iOS and Android with modern UI/UX principles.',
    'design',
    600.00,
    8,
    '/gigbanner.webp',
    ARRAY['Mobile App Design', 'iOS Design', 'Android Design', 'UI/UX'],
    true,
    now(),
    now()
  );

-- Copywriting (additional)
INSERT INTO services (id, freelancer_id, title, description, category, price, delivery_time, image_url, tags, is_active, created_at, updated_at) VALUES
  (
    'cw-001-sales-copy',
    '11111111-1111-1111-1111-111111111111',
    'Sales Copywriting',
    'Compelling sales copy that converts visitors into customers. High-converting landing pages and ads.',
    'copywriting',
    150.00,
    3,
    '/gigbanner.webp',
    ARRAY['Sales Copy', 'Landing Pages', 'Ads', 'Conversion'],
    true,
    now(),
    now()
  ),
  (
    'cw-002-technical-writing',
    '33333333-3333-3333-3333-333333333333',
    'Technical Writing',
    'Professional technical documentation and user manuals. Clear and comprehensive writing.',
    'copywriting',
    200.00,
    4,
    '/gigbanner.webp',
    ARRAY['Technical Writing', 'Documentation', 'User Manuals', 'Technical Content'],
    true,
    now(),
    now()
  );

-- Social Media (additional)
INSERT INTO services (id, freelancer_id, title, description, category, price, delivery_time, image_url, tags, is_active, created_at, updated_at) VALUES
  (
    'sm-001-social-management',
    '55555555-5555-5555-5555-555555555555',
    'Social Media Management',
    'Complete social media management including content creation, posting, and community engagement.',
    'social-media',
    400.00,
    30,
    '/gigbanner.webp',
    ARRAY['Social Media', 'Content Creation', 'Management', 'Engagement'],
    true,
    now(),
    now()
  ),
  (
    'sm-002-social-ads',
    '11111111-1111-1111-1111-111111111111',
    'Social Media Advertising',
    'Professional social media advertising campaigns for Facebook, Instagram, and LinkedIn.',
    'social-media',
    300.00,
    5,
    '/gigbanner.webp',
    ARRAY['Social Media Ads', 'Facebook Ads', 'Instagram Ads', 'LinkedIn Ads'],
    true,
    now(),
    now()
  );

-- Video Production (additional)
INSERT INTO services (id, freelancer_id, title, description, category, price, delivery_time, image_url, tags, is_active, created_at, updated_at) VALUES
  (
    'vp-001-video-editing',
    '55555555-5555-5555-5555-555555555555',
    'Video Editing',
    'Professional video editing services with color grading, transitions, and audio enhancement.',
    'video-production',
    400.00,
    5,
    '/gigbanner.webp',
    ARRAY['Video Editing', 'Color Grading', 'Transitions', 'Audio'],
    true,
    now(),
    now()
  ),
  (
    'vp-002-corporate-video',
    '55555555-5555-5555-5555-555555555555',
    'Corporate Video Production',
    'Professional corporate video production for companies, presentations, and marketing materials.',
    'video-production',
    800.00,
    10,
    '/gigbanner.webp',
    ARRAY['Corporate Video', 'Business Video', 'Presentations', 'Marketing'],
    true,
    now(),
    now()
  );

-- Audio/Music (additional)
INSERT INTO services (id, freelancer_id, title, description, category, price, delivery_time, image_url, tags, is_active, created_at, updated_at) VALUES
  (
    'am-001-music-production',
    '55555555-5555-5555-5555-555555555555',
    'Music Production',
    'Professional music production and composition. Original tracks for videos, games, and projects.',
    'audio-music',
    500.00,
    7,
    '/gigbanner.webp',
    ARRAY['Music Production', 'Composition', 'Original Music', 'Soundtrack'],
    true,
    now(),
    now()
  ),
  (
    'am-002-audio-editing',
    '55555555-5555-5555-5555-555555555555',
    'Audio Editing',
    'Professional audio editing services for podcasts, videos, and music with noise reduction and enhancement.',
    'audio-music',
    200.00,
    3,
    '/gigbanner.webp',
    ARRAY['Audio Editing', 'Podcast Editing', 'Noise Reduction', 'Audio Enhancement'],
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
  'va-001-virtual-assistant',
  'va-002-executive-assistant',
  'tr-001-translation',
  'tr-002-localization',
  'vo-001-voice-over',
  'vo-002-character-voice',
  'ph-001-photography',
  'ph-002-product-photography',
  'il-001-illustration',
  'il-002-character-design',
  'an-001-animation',
  'an-002-motion-graphics',
  'gd-001-game-development',
  'gd-002-mobile-games',
  'wd-001-full-stack',
  'wd-002-python-development',
  'ds-001-website-design',
  'ds-002-app-design',
  'cw-001-sales-copy',
  'cw-002-technical-writing',
  'sm-001-social-management',
  'sm-002-social-ads',
  'vp-001-video-editing',
  'vp-002-corporate-video',
  'am-001-music-production',
  'am-002-audio-editing'
); 
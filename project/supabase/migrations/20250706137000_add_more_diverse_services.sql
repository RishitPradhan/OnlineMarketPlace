/*
  # Add more diverse services from different freelancers

  1. Additional Services
    - Add services for more freelancers to ensure diversity
    - Cover all major categories to prevent empty pages
    - Include realistic pricing and descriptions
    - Add services for Bob Wilson (convert to freelancer) and new users
*/

-- First, let's add more freelancer users
INSERT INTO users (id, email, first_name, last_name, role, password_hash, created_at, updated_at) VALUES
  (
    '66666666-6666-6666-6666-666666666666',
    'sarah.chen@example.com',
    'Sarah',
    'Chen',
    'freelancer',
    '$2a$10$dummy.hash.for.testing',
    now(),
    now()
  ),
  (
    '77777777-7777-7777-7777-777777777777',
    'mike.rodriguez@example.com',
    'Mike',
    'Rodriguez',
    'freelancer',
    '$2a$10$dummy.hash.for.testing',
    now(),
    now()
  ),
  (
    '88888888-8888-8888-8888-888888888888',
    'emma.davis@example.com',
    'Emma',
    'Davis',
    'freelancer',
    '$2a$10$dummy.hash.for.testing',
    now(),
    now()
  ),
  (
    '99999999-9999-9999-9999-999999999999',
    'david.kumar@example.com',
    'David',
    'Kumar',
    'freelancer',
    '$2a$10$dummy.hash.for.testing',
    now(),
    now()
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'lisa.wang@example.com',
    'Lisa',
    'Wang',
    'freelancer',
    '$2a$10$dummy.hash.for.testing',
    now(),
    now()
  )
ON CONFLICT (email) DO NOTHING;

-- Add services for Sarah Chen (Video Production & Audio)
INSERT INTO services (id, freelancer_id, title, description, category, price, delivery_time, image_url, tags, is_active, created_at, updated_at) VALUES
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '66666666-6666-6666-6666-666666666666',
    'Professional Video Editing',
    'I will edit your videos with professional quality. Includes color grading, transitions, and audio enhancement.',
    'video-production',
    500.00,
    5,
    '/gigbanner.webp',
    ARRAY['Video Editing', 'Color Grading', 'Premiere Pro', 'After Effects'],
    true,
    now(),
    now()
  ),
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    '66666666-6666-6666-6666-666666666666',
    'Voice Over Recording',
    'Professional voice over services for commercials, videos, and presentations. Multiple voice options available.',
    'audio-music',
    200.00,
    3,
    '/gigbanner.webp',
    ARRAY['Voice Over', 'Recording', 'Audio Editing', 'Professional Voice'],
    true,
    now(),
    now()
  );

-- Add services for Mike Rodriguez (Mobile App Development)
INSERT INTO services (id, freelancer_id, title, description, category, price, delivery_time, image_url, tags, is_active, created_at, updated_at) VALUES
  (
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    '77777777-7777-7777-7777-777777777777',
    'iOS App Development',
    'I will create a native iOS app for your business. Includes App Store submission and maintenance.',
    'app-development',
    3000.00,
    14,
    '/gigbanner.webp',
    ARRAY['iOS', 'Swift', 'Xcode', 'App Store'],
    true,
    now(),
    now()
  ),
  (
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    '77777777-7777-7777-7777-777777777777',
    'Android App Development',
    'Professional Android app development with modern UI/UX design and Google Play Store submission.',
    'app-development',
    2800.00,
    12,
    '/gigbanner.webp',
    ARRAY['Android', 'Kotlin', 'Java', 'Google Play'],
    true,
    now(),
    now()
  );

-- Add services for Emma Davis (Digital Art & Graphic Design)
INSERT INTO services (id, freelancer_id, title, description, category, price, delivery_time, image_url, tags, is_active, created_at, updated_at) VALUES
  (
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    '88888888-8888-8888-8888-888888888888',
    'Digital Illustration',
    'Custom digital illustrations for books, websites, and marketing materials. Unique artistic style.',
    'digital-art',
    150.00,
    4,
    '/gigbanner.webp',
    ARRAY['Digital Art', 'Illustration', 'Procreate', 'Photoshop'],
    true,
    now(),
    now()
  ),
  (
    'gggggggg-gggg-gggg-gggg-gggggggggggg',
    '88888888-8888-8888-8888-888888888888',
    'Social Media Graphics',
    'Eye-catching social media graphics for Instagram, Facebook, and Twitter. Consistent branding included.',
    'design',
    80.00,
    2,
    '/gigbanner.webp',
    ARRAY['Social Media', 'Graphics', 'Canva', 'Branding'],
    true,
    now(),
    now()
  );

-- Add services for David Kumar (SEO & Digital Marketing)
INSERT INTO services (id, freelancer_id, title, description, category, price, delivery_time, image_url, tags, is_active, created_at, updated_at) VALUES
  (
    'hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh',
    '99999999-9999-9999-9999-999999999999',
    'SEO Optimization',
    'Comprehensive SEO optimization for your website. Includes keyword research, on-page SEO, and monthly reports.',
    'seo',
    400.00,
    7,
    '/gigbanner.webp',
    ARRAY['SEO', 'Keyword Research', 'Google Analytics', 'Ranking'],
    true,
    now(),
    now()
  ),
  (
    'iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii',
    '99999999-9999-9999-9999-999999999999',
    'Google Ads Management',
    'Professional Google Ads campaign management. Includes setup, optimization, and monthly performance reports.',
    'social-media',
    600.00,
    5,
    '/gigbanner.webp',
    ARRAY['Google Ads', 'PPC', 'Campaign Management', 'ROI'],
    true,
    now(),
    now()
  );

-- Add services for Lisa Wang (Business Consulting & Copywriting)
INSERT INTO services (id, freelancer_id, title, description, category, price, delivery_time, image_url, tags, is_active, created_at, updated_at) VALUES
  (
    'jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Business Strategy Consulting',
    'Strategic business consulting to help grow your company. Includes market analysis and growth planning.',
    'business-consulting',
    800.00,
    10,
    '/gigbanner.webp',
    ARRAY['Business Strategy', 'Market Analysis', 'Growth Planning', 'Consulting'],
    true,
    now(),
    now()
  ),
  (
    'kkkkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Website Copywriting',
    'Compelling website copy that converts visitors into customers. SEO-optimized content included.',
    'copywriting',
    250.00,
    4,
    '/gigbanner.webp',
    ARRAY['Copywriting', 'Website Content', 'SEO', 'Conversion'],
    true,
    now(),
    now()
  );

-- Add more services for existing freelancers to ensure variety
INSERT INTO services (id, freelancer_id, title, description, category, price, delivery_time, image_url, tags, is_active, created_at, updated_at) VALUES
  (
    'llllllll-llll-llll-llll-llllllllllll',
    '22222222-2222-2222-2222-222222222222',
    'React Native App Development',
    'Cross-platform mobile app development using React Native. Works on both iOS and Android.',
    'app-development',
    2200.00,
    15,
    '/gigbanner.webp',
    ARRAY['React Native', 'Cross-platform', 'Mobile App', 'JavaScript'],
    true,
    now(),
    now()
  ),
  (
    'mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm',
    '44444444-4444-4444-4444-444444444444',
    'Brand Identity Design',
    'Complete brand identity package including logo, color palette, typography, and brand guidelines.',
    'branding',
    600.00,
    8,
    '/gigbanner.webp',
    ARRAY['Brand Identity', 'Logo Design', 'Brand Guidelines', 'Typography'],
    true,
    now(),
    now()
  ),
  (
    'nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn',
    '66666666-6666-6666-6666-666666666666',
    'YouTube Video Production',
    'Complete YouTube video production including scripting, filming, editing, and thumbnail design.',
    'video-production',
    800.00,
    7,
    '/gigbanner.webp',
    ARRAY['YouTube', 'Video Production', 'Scripting', 'Editing'],
    true,
    now(),
    now()
  ),
  (
    'oooooooo-oooo-oooo-oooo-oooooooooooo',
    '88888888-8888-8888-8888-888888888888',
    'Character Design',
    'Custom character design for games, animations, and branding. Multiple style options available.',
    'digital-art',
    200.00,
    5,
    '/gigbanner.webp',
    ARRAY['Character Design', 'Digital Art', 'Animation', 'Gaming'],
    true,
    now(),
    now()
  ),
  (
    'pppppppp-pppp-pppp-pppp-pppppppppppp',
    '99999999-9999-9999-9999-999999999999',
    'Content Marketing Strategy',
    'Comprehensive content marketing strategy including blog posts, social media content, and email campaigns.',
    'social-media',
    450.00,
    6,
    '/gigbanner.webp',
    ARRAY['Content Marketing', 'Blog Writing', 'Social Media', 'Email Marketing'],
    true,
    now(),
    now()
  );

-- Update all new services with plans, images, and FAQs
UPDATE services SET 
  plans = '[
    {
      "name": "Basic",
      "price": 500,
      "desc": "Essential service package",
      "features": ["Basic features", "Standard delivery", "2 revisions"],
      "delivery": "5 days"
    },
    {
      "name": "Standard",
      "price": 800,
      "desc": "Professional service package",
      "features": ["Advanced features", "Priority delivery", "5 revisions"],
      "delivery": "3 days"
    },
    {
      "name": "Premium",
      "price": 1200,
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
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  'ffffffff-ffff-ffff-ffff-ffffffffffff',
  'gggggggg-gggg-gggg-gggg-gggggggggggg',
  'hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh',
  'iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii',
  'jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj',
  'kkkkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk',
  'llllllll-llll-llll-llll-llllllllllll',
  'mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm',
  'nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn',
  'oooooooo-oooo-oooo-oooo-oooooooooooo',
  'pppppppp-pppp-pppp-pppp-pppppppppppp'
); 
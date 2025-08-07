/*
  # Add comprehensive services from real users

  1. Additional Services
    - Add services for all existing users to ensure diversity
    - Cover all major categories to prevent empty pages
    - Include realistic pricing and descriptions
    - Ensure every category has multiple services
*/

-- Add more services for Jane Smith (existing freelancer)
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
    '22222222-2222-2222-2222-222222222222',
    'WordPress Development',
    'Custom WordPress website development with themes and plugins. SEO optimized and mobile responsive.',
    'web-development',
    800.00,
    5,
    '/gigbanner.webp',
    ARRAY['WordPress', 'PHP', 'MySQL', 'SEO'],
    true,
    now(),
    now()
  ),
  (
    'nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn',
    '22222222-2222-2222-2222-222222222222',
    'API Development',
    'RESTful API development for your applications. Includes documentation and testing.',
    'web-development',
    1200.00,
    8,
    '/gigbanner.webp',
    ARRAY['API', 'REST', 'Node.js', 'Documentation'],
    true,
    now(),
    now()
  );

-- Add more services for Alice Johnson (existing freelancer)
INSERT INTO services (id, freelancer_id, title, description, category, price, delivery_time, image_url, tags, is_active, created_at, updated_at) VALUES
  (
    'oooooooo-oooo-oooo-oooo-oooooooooooo',
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
    'pppppppp-pppp-pppp-pppp-pppppppppppp',
    '44444444-4444-4444-4444-444444444444',
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
  ),
  (
    'qqqqqqqq-qqqq-qqqq-qqqq-qqqqqqqqqqqq',
    '44444444-4444-4444-4444-444444444444',
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
  );

-- Add services for John Doe (convert to freelancer)
INSERT INTO services (id, freelancer_id, title, description, category, price, delivery_time, image_url, tags, is_active, created_at, updated_at) VALUES
  (
    'rrrrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr',
    '11111111-1111-1111-1111-111111111111',
    'Content Writing',
    'Professional content writing for blogs, websites, and marketing materials. SEO optimized content.',
    'copywriting',
    100.00,
    3,
    '/gigbanner.webp',
    ARRAY['Content Writing', 'Blog Posts', 'SEO', 'Marketing'],
    true,
    now(),
    now()
  ),
  (
    'ssssssss-ssss-ssss-ssss-ssssssssssss',
    '11111111-1111-1111-1111-111111111111',
    'Email Marketing',
    'Complete email marketing campaigns including design, copywriting, and automation setup.',
    'social-media',
    300.00,
    5,
    '/gigbanner.webp',
    ARRAY['Email Marketing', 'Automation', 'Copywriting', 'Design'],
    true,
    now(),
    now()
  ),
  (
    'tttttttt-tttt-tttt-tttt-tttttttttttt',
    '11111111-1111-1111-1111-111111111111',
    'Business Consulting',
    'Strategic business consulting to help grow your company. Includes market analysis and growth planning.',
    'business-consulting',
    500.00,
    7,
    '/gigbanner.webp',
    ARRAY['Business Strategy', 'Market Analysis', 'Growth Planning', 'Consulting'],
    true,
    now(),
    now()
  );

-- Add services for Bob Wilson (convert to freelancer)
INSERT INTO services (id, freelancer_id, title, description, category, price, delivery_time, image_url, tags, is_active, created_at, updated_at) VALUES
  (
    'uuuuuuuu-uuuu-uuuu-uuuu-uuuuuuuuuuuu',
    '55555555-5555-5555-5555-555555555555',
    'Video Production',
    'Professional video production for commercials, social media, and marketing. Includes editing and post-production.',
    'video-production',
    800.00,
    7,
    '/gigbanner.webp',
    ARRAY['Video Production', 'Editing', 'Post-production', 'Marketing'],
    true,
    now(),
    now()
  ),
  (
    'vvvvvvvv-vvvv-vvvv-vvvv-vvvvvvvvvvvv',
    '55555555-5555-5555-5555-555555555555',
    'Audio Production',
    'Professional audio production for podcasts, music, and voice overs. High-quality recording and mixing.',
    'audio-music',
    400.00,
    5,
    '/gigbanner.webp',
    ARRAY['Audio Production', 'Podcasting', 'Music', 'Voice Over'],
    true,
    now(),
    now()
  ),
  (
    'wwwwwwww-wwww-wwww-wwww-wwwwwwwwwwww',
    '55555555-5555-5555-5555-555555555555',
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
  );

-- Add services for Admin User (convert to freelancer for diversity)
INSERT INTO services (id, freelancer_id, title, description, category, price, delivery_time, image_url, tags, is_active, created_at, updated_at) VALUES
  (
    'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    '33333333-3333-3333-3333-333333333333',
    'Cybersecurity Audit',
    'Comprehensive security checks for your digital assets. Includes vulnerability assessment and recommendations.',
    'cybersecurity',
    1200.00,
    10,
    '/gigbanner.webp',
    ARRAY['Cybersecurity', 'Security Audit', 'Vulnerability Assessment', 'Penetration Testing'],
    true,
    now(),
    now()
  ),
  (
    'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy',
    '33333333-3333-3333-3333-333333333333',
    'Data Analysis',
    'Professional data analysis and visualization. Includes insights and actionable recommendations.',
    'data-analysis',
    600.00,
    8,
    '/gigbanner.webp',
    ARRAY['Data Analysis', 'Visualization', 'Insights', 'Python'],
    true,
    now(),
    now()
  ),
  (
    'zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz',
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
  'llllllll-llll-llll-llll-llllllllllll',
  'mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm',
  'nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn',
  'oooooooo-oooo-oooo-oooo-oooooooooooo',
  'pppppppp-pppp-pppp-pppp-pppppppppppp',
  'qqqqqqqq-qqqq-qqqq-qqqq-qqqqqqqqqqqq',
  'rrrrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr',
  'ssssssss-ssss-ssss-ssss-ssssssssssss',
  'tttttttt-tttt-tttt-tttt-tttttttttttt',
  'uuuuuuuu-uuuu-uuuu-uuuu-uuuuuuuuuuuu',
  'vvvvvvvv-vvvv-vvvv-vvvv-vvvvvvvvvvvv',
  'wwwwwwww-wwww-wwww-wwww-wwwwwwwwwwww',
  'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy',
  'zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz'
);

-- Update user roles to ensure all users are freelancers for service creation
UPDATE users SET role = 'freelancer' WHERE id IN (
  '11111111-1111-1111-1111-111111111111',
  '55555555-5555-5555-5555-555555555555',
  '33333333-3333-3333-3333-333333333333'
); 
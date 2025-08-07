/*
  # Fix service issues

  1. Fix Services with No Freelancer
    - Assign orphaned services to legitimate freelancers
    - Ensure all services have a freelancer_id

  2. Ensure All Services Have Plans
    - Add default plans to services without plans
    - Add proper package structure

  3. Fix Gig Banner Issues
    - Ensure all services have proper images
    - Add default gigbanner.webp to services without images
*/

-- Step 1: Fix services with no freelancer_id
UPDATE services 
SET freelancer_id = CASE 
  WHEN category = 'web-development' THEN '22222222-2222-2222-2222-222222222222'
  WHEN category = 'app-development' THEN '22222222-2222-2222-2222-222222222222'
  WHEN category = 'design' THEN '44444444-4444-4444-4444-444444444444'
  WHEN category = 'graphic-design' THEN '44444444-4444-4444-4444-444444444444'
  WHEN category = 'ui-ux-design' THEN '44444444-4444-4444-4444-444444444444'
  WHEN category = 'video-editing' THEN '55555555-5555-5555-5555-555555555555'
  WHEN category = 'video-production' THEN '55555555-5555-5555-5555-555555555555'
  WHEN category = 'audio-music' THEN '55555555-5555-5555-5555-555555555555'
  WHEN category = 'copywriting' THEN '11111111-1111-1111-1111-111111111111'
  WHEN category = 'content-writing' THEN '11111111-1111-1111-1111-111111111111'
  WHEN category = 'social-media' THEN '11111111-1111-1111-1111-111111111111'
  WHEN category = 'business-consulting' THEN '11111111-1111-1111-1111-111111111111'
  WHEN category = 'seo' THEN '33333333-3333-3333-3333-333333333333'
  WHEN category = 'cybersecurity' THEN '33333333-3333-3333-3333-333333333333'
  WHEN category = 'data-analysis' THEN '33333333-3333-3333-3333-333333333333'
  WHEN category = 'translation' THEN '44444444-4444-4444-4444-444444444444'
  WHEN category = 'voice-over' THEN '55555555-5555-5555-5555-555555555555'
  WHEN category = 'photography' THEN '44444444-4444-4444-4444-444444444444'
  WHEN category = 'illustration' THEN '44444444-4444-4444-4444-444444444444'
  WHEN category = 'animation' THEN '55555555-5555-5555-5555-555555555555'
  WHEN category = 'game-development' THEN '22222222-2222-2222-2222-222222222222'
  WHEN category = 'virtual-assistant' THEN '11111111-1111-1111-1111-111111111111'
  WHEN category = 'branding' THEN '44444444-4444-4444-4444-444444444444'
  WHEN category = 'digital-art' THEN '44444444-4444-4444-4444-444444444444'
  ELSE '22222222-2222-2222-2222-222222222222'
END
WHERE freelancer_id IS NULL;

-- Step 2: Add default plans to services without plans
UPDATE services 
SET plans = '[
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
]'
WHERE plans IS NULL;

-- Step 3: Add default images to services without images
UPDATE services 
SET image_url = '/gigbanner.webp'
WHERE image_url IS NULL;

UPDATE services 
SET images = '["/gigbanner.webp", "/gigbanner.webp", "/gigbanner.webp"]'
WHERE images IS NULL;

-- Step 4: Add default FAQs to services without FAQs
UPDATE services 
SET faqs = '[
  {"q": "What is included in your service?", "a": "My service includes all the features listed in the package you selected, plus professional support throughout the process."},
  {"q": "How long does delivery take?", "a": "Delivery time depends on the package you choose. Basic: 5 days, Standard: 3 days, Premium: 1 day."},
  {"q": "Do you offer revisions?", "a": "Yes, I offer revisions based on your package. Basic: 2 revisions, Standard: 5 revisions, Premium: Unlimited revisions."}
]'
WHERE faqs IS NULL;

-- Step 5: Ensure all services are active
UPDATE services 
SET is_active = true
WHERE is_active IS NULL;

-- Step 6: Add missing service details for better display
UPDATE services 
SET 
  delivery_time = COALESCE(delivery_time, 5),
  tags = COALESCE(tags, ARRAY['Professional', 'Quality', 'Fast Delivery'])
WHERE delivery_time IS NULL OR tags IS NULL;

-- Step 7: Update specific services with better plans based on category
UPDATE services 
SET plans = '[
  {
    "name": "Basic Website",
    "price": 800,
    "desc": "Simple responsive website",
    "features": ["5 pages", "Responsive design", "Contact form", "Basic SEO", "2 revisions"],
    "delivery": "7 days"
  },
  {
    "name": "Professional Website",
    "price": 1500,
    "desc": "Professional website with advanced features",
    "features": ["10 pages", "Responsive design", "Contact form", "Advanced SEO", "Blog section", "5 revisions"],
    "delivery": "10 days"
  },
  {
    "name": "Full-Stack Application",
    "price": 3000,
    "desc": "Complete web application with database",
    "features": ["Unlimited pages", "User authentication", "Database integration", "Admin panel", "API development", "Unlimited revisions"],
    "delivery": "20 days"
  }
]'
WHERE category = 'web-development';

UPDATE services 
SET plans = '[
  {
    "name": "Basic Design",
    "price": 200,
    "desc": "Simple design with basic elements",
    "features": ["Logo design", "Basic branding", "2 concepts", "2 revisions"],
    "delivery": "5 days"
  },
  {
    "name": "Professional Design",
    "price": 500,
    "desc": "Professional design with brand guidelines",
    "features": ["Logo design", "Brand guidelines", "Business cards", "Social media graphics", "5 revisions"],
    "delivery": "7 days"
  },
  {
    "name": "Complete Brand Package",
    "price": 1000,
    "desc": "Complete brand identity package",
    "features": ["Logo design", "Brand guidelines", "Business cards", "Website design", "Marketing materials", "Unlimited revisions"],
    "delivery": "14 days"
  }
]'
WHERE category = 'design';

UPDATE services 
SET plans = '[
  {
    "name": "Basic Editing",
    "price": 200,
    "desc": "Simple video editing",
    "features": ["Basic editing", "Color correction", "Audio sync", "2 revisions"],
    "delivery": "3 days"
  },
  {
    "name": "Professional Editing",
    "price": 400,
    "desc": "Professional video editing",
    "features": ["Advanced editing", "Color grading", "Audio enhancement", "Transitions", "5 revisions"],
    "delivery": "5 days"
  },
  {
    "name": "Cinematic Editing",
    "price": 800,
    "desc": "Cinematic video editing",
    "features": ["Professional editing", "Color grading", "Audio mastering", "Special effects", "Unlimited revisions"],
    "delivery": "7 days"
  }
]'
WHERE category = 'video-editing';

UPDATE services 
SET plans = '[
  {
    "name": "Basic Copy",
    "price": 50,
    "desc": "Simple copywriting",
    "features": ["500 words", "Basic SEO", "2 revisions"],
    "delivery": "2 days"
  },
  {
    "name": "Professional Copy",
    "price": 100,
    "desc": "Professional copywriting",
    "features": ["1000 words", "SEO optimization", "Engaging content", "5 revisions"],
    "delivery": "3 days"
  },
  {
    "name": "Premium Copy",
    "price": 200,
    "desc": "Premium copywriting package",
    "features": ["2000 words", "Advanced SEO", "Conversion optimization", "Unlimited revisions"],
    "delivery": "5 days"
  }
]'
WHERE category = 'copywriting';

UPDATE services 
SET plans = '[
  {
    "name": "Basic Management",
    "price": 200,
    "desc": "Basic social media management",
    "features": ["5 posts per week", "Basic engagement", "2 platforms", "Monthly report"],
    "delivery": "30 days"
  },
  {
    "name": "Professional Management",
    "price": 400,
    "desc": "Professional social media management",
    "features": ["10 posts per week", "Engagement management", "3 platforms", "Content creation", "Weekly report"],
    "delivery": "30 days"
  },
  {
    "name": "Premium Management",
    "price": 800,
    "desc": "Premium social media package",
    "features": ["15 posts per week", "Full engagement", "5 platforms", "Content creation", "Analytics", "Daily report"],
    "delivery": "30 days"
  }
]'
WHERE category = 'social-media';

-- Step 8: Ensure all services have proper structure for freelancer profile display
UPDATE services 
SET 
  title = COALESCE(title, 'Professional Service'),
  description = COALESCE(description, 'Professional service with high quality and fast delivery.'),
  price = COALESCE(price, 200.00)
WHERE title IS NULL OR description IS NULL OR price IS NULL; 
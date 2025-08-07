/*
  # Fix pricing consistency for all service categories
  
  This migration ensures that all services have the correct pricing
  based on their category, fixing any inconsistencies.
*/

-- Web Development Services - Correct Pricing
UPDATE services SET 
  plans = '[
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

-- Design Services - Correct Pricing
UPDATE services SET 
  plans = '[
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

-- Video Editing Services - Correct Pricing
UPDATE services SET 
  plans = '[
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

-- Copywriting Services - Correct Pricing
UPDATE services SET 
  plans = '[
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

-- Social Media Services - Correct Pricing
UPDATE services SET 
  plans = '[
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

-- App Development Services - Correct Pricing
UPDATE services SET 
  plans = '[
    {
      "name": "Basic App",
      "price": 1500,
      "desc": "Simple mobile application",
      "features": ["5 screens", "Basic functionality", "User interface", "Testing", "2 revisions"],
      "delivery": "15 days"
    },
    {
      "name": "Professional App",
      "price": 2500,
      "desc": "Professional mobile app with features",
      "features": ["10 screens", "Advanced features", "User authentication", "Database", "Push notifications", "5 revisions"],
      "delivery": "25 days"
    },
    {
      "name": "Enterprise App",
      "price": 4000,
      "desc": "Full-featured enterprise application",
      "features": ["Unlimited screens", "Complex features", "Backend integration", "Analytics", "App store submission", "Unlimited revisions"],
      "delivery": "35 days"
    }
  ]'
WHERE category = 'app-development';

-- Graphic Design Services - Correct Pricing
UPDATE services SET 
  plans = '[
    {
      "name": "Basic Graphics",
      "price": 120,
      "desc": "Simple graphic design",
      "features": ["Logo design", "Basic graphics", "2 concepts", "2 revisions"],
      "delivery": "3 days"
    },
    {
      "name": "Professional Graphics",
      "price": 250,
      "desc": "Professional graphic design",
      "features": ["Logo design", "Print materials", "Digital graphics", "5 revisions"],
      "delivery": "5 days"
    },
    {
      "name": "Complete Graphics Package",
      "price": 500,
      "desc": "Complete graphic design package",
      "features": ["Logo design", "Print materials", "Digital graphics", "Brand guidelines", "Unlimited revisions"],
      "delivery": "10 days"
    }
  ]'
WHERE category = 'graphic-design';

-- UI/UX Design Services - Correct Pricing
UPDATE services SET 
  plans = '[
    {
      "name": "Basic Design",
      "price": 400,
      "desc": "Basic UI/UX design",
      "features": ["5 screens", "Wireframes", "Basic prototype", "2 revisions"],
      "delivery": "5 days"
    },
    {
      "name": "Professional Design",
      "price": 800,
      "desc": "Professional UI/UX design",
      "features": ["10 screens", "User research", "Interactive prototype", "Style guide", "5 revisions"],
      "delivery": "10 days"
    },
    {
      "name": "Premium Design",
      "price": 1500,
      "desc": "Premium UI/UX package",
      "features": ["Unlimited screens", "User research", "Interactive prototype", "Style guide", "User testing", "Unlimited revisions"],
      "delivery": "15 days"
    }
  ]'
WHERE category = 'ui-ux-design';

-- Audio/Music Services - Correct Pricing
UPDATE services SET 
  plans = '[
    {
      "name": "Basic Audio",
      "price": 200,
      "desc": "Basic audio production",
      "features": ["Simple recording", "Basic editing", "2 revisions"],
      "delivery": "3 days"
    },
    {
      "name": "Professional Audio",
      "price": 400,
      "desc": "Professional audio production",
      "features": ["Professional recording", "Advanced editing", "Mixing", "5 revisions"],
      "delivery": "5 days"
    },
    {
      "name": "Premium Audio",
      "price": 800,
      "desc": "Premium audio package",
      "features": ["Professional recording", "Advanced editing", "Mixing", "Mastering", "Unlimited revisions"],
      "delivery": "7 days"
    }
  ]'
WHERE category = 'audio-music';

-- Business Consulting Services - Correct Pricing
UPDATE services SET 
  plans = '[
    {
      "name": "Basic Consultation",
      "price": 300,
      "desc": "Basic business consultation",
      "features": ["1-hour consultation", "Basic analysis", "Written report", "2 follow-ups"],
      "delivery": "3 days"
    },
    {
      "name": "Professional Consultation",
      "price": 600,
      "desc": "Professional business consultation",
      "features": ["3-hour consultation", "Detailed analysis", "Strategy plan", "5 follow-ups"],
      "delivery": "7 days"
    },
    {
      "name": "Premium Consultation",
      "price": 1200,
      "desc": "Premium business package",
      "features": ["5-hour consultation", "Comprehensive analysis", "Strategy implementation", "Unlimited follow-ups"],
      "delivery": "14 days"
    }
  ]'
WHERE category = 'business-consulting';

-- SEO Services - Correct Pricing
UPDATE services SET 
  plans = '[
    {
      "name": "Basic SEO",
      "price": 200,
      "desc": "Basic SEO optimization",
      "features": ["Keyword research", "On-page SEO", "Basic report", "2 months support"],
      "delivery": "7 days"
    },
    {
      "name": "Professional SEO",
      "price": 400,
      "desc": "Professional SEO optimization",
      "features": ["Keyword research", "On-page SEO", "Technical SEO", "Monthly reports", "6 months support"],
      "delivery": "14 days"
    },
    {
      "name": "Premium SEO",
      "price": 800,
      "desc": "Premium SEO package",
      "features": ["Comprehensive SEO", "Content optimization", "Link building", "Monthly reports", "12 months support"],
      "delivery": "30 days"
    }
  ]'
WHERE category = 'seo';

-- Content Writing Services - Correct Pricing
UPDATE services SET 
  plans = '[
    {
      "name": "Basic Content",
      "price": 80,
      "desc": "Simple content writing",
      "features": ["500 words", "Basic research", "2 revisions"],
      "delivery": "2 days"
    },
    {
      "name": "Professional Content",
      "price": 150,
      "desc": "Professional content writing",
      "features": ["1000 words", "Research", "SEO optimization", "5 revisions"],
      "delivery": "3 days"
    },
    {
      "name": "Premium Content",
      "price": 300,
      "desc": "Premium content package",
      "features": ["2000 words", "Deep research", "SEO optimization", "Unlimited revisions"],
      "delivery": "5 days"
    }
  ]'
WHERE category = 'content-writing';

-- Video Production Services - Correct Pricing
UPDATE services SET 
  plans = '[
    {
      "name": "Basic Production",
      "price": 500,
      "desc": "Simple video production",
      "features": ["Script writing", "Basic filming", "Simple editing", "3 revisions"],
      "delivery": "7 days"
    },
    {
      "name": "Professional Production",
      "price": 800,
      "desc": "Professional video production",
      "features": ["Script writing", "Professional filming", "Advanced editing", "Color grading", "5 revisions"],
      "delivery": "14 days"
    },
    {
      "name": "Cinematic Production",
      "price": 1500,
      "desc": "Cinematic video production",
      "features": ["Script writing", "Professional filming", "Cinematic editing", "Color grading", "Special effects", "Unlimited revisions"],
      "delivery": "21 days"
    }
  ]'
WHERE category = 'video-production';

-- For any remaining services with generic pricing, apply a default structure
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
  ]'
WHERE plans IS NULL OR plans = '[]' OR plans = 'null'; 
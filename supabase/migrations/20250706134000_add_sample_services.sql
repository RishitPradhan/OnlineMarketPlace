/*
  # Add sample services for testing

  1. Sample Services
    - Add services for Jane Smith (freelancer)
    - Add services for Alice Johnson (freelancer)
    - Include proper pricing, descriptions, and plans
*/

-- Insert sample services for Jane Smith (freelancer)
INSERT INTO services (id, freelancer_id, title, description, category, price, delivery_time, image_url, tags, is_active, created_at, updated_at) VALUES
  (
    '5b9eb8a0-0747-4b2c-a937-3e41e86e7fc4',
    '22222222-2222-2222-2222-222222222222',
    'Professional Web Development',
    'I will create a modern, responsive website for your business. Includes SEO optimization, mobile-friendly design, and fast loading times.',
    'web-development',
    1500.00,
    7,
    '/gigbanner.webp',
    ARRAY['React', 'Node.js', 'TypeScript', 'SEO'],
    true,
    now(),
    now()
  ),
  (
    '6c0fc8b1-1858-5d3d-b048-4f52f97f8fc5',
    '22222222-2222-2222-2222-222222222222',
    'E-commerce Website',
    'Complete e-commerce solution with payment integration, inventory management, and admin dashboard.',
    'web-development',
    2500.00,
    10,
    '/gigbanner.webp',
    ARRAY['E-commerce', 'Payment Gateway', 'Inventory Management'],
    true,
    now(),
    now()
  );

-- Insert sample services for Alice Johnson (freelancer)
INSERT INTO services (id, freelancer_id, title, description, category, price, delivery_time, image_url, tags, is_active, created_at, updated_at) VALUES
  (
    '7d1gd9c2-2969-6e4e-c159-5g63g08g9gd6',
    '44444444-4444-4444-4444-444444444444',
    'UI/UX Design',
    'Professional UI/UX design for web and mobile applications. User-centered design with modern aesthetics.',
    'design',
    800.00,
    5,
    '/gigbanner.webp',
    ARRAY['UI Design', 'UX Design', 'Figma', 'Prototyping'],
    true,
    now(),
    now()
  ),
  (
    '8e2he0d3-3a7a-7f5f-d26a-6h74h19h0he7',
    '44444444-4444-4444-4444-444444444444',
    'Logo Design',
    'Creative and professional logo design for your brand. Multiple concepts and revisions included.',
    'design',
    300.00,
    3,
    '/gigbanner.webp',
    ARRAY['Logo Design', 'Branding', 'Illustrator'],
    true,
    now(),
    now()
  );

-- Update the services table to include the new structure with plans, images, faqs
ALTER TABLE services ADD COLUMN IF NOT EXISTS plans jsonb;
ALTER TABLE services ADD COLUMN IF NOT EXISTS images jsonb;
ALTER TABLE services ADD COLUMN IF NOT EXISTS faqs jsonb;

-- Update Jane Smith's web development service with plans
UPDATE services SET 
  plans = '[
    {
      "name": "Basic",
      "price": 1500,
      "desc": "Simple website with basic features",
      "features": ["5 pages", "Responsive design", "Contact form", "Basic SEO", "3 revisions"],
      "delivery": "7 days"
    },
    {
      "name": "Standard", 
      "price": 2500,
      "desc": "Professional website with advanced features",
      "features": ["10 pages", "Responsive design", "Contact form", "Advanced SEO", "Blog section", "5 revisions"],
      "delivery": "10 days"
    },
    {
      "name": "Premium",
      "price": 4000,
      "desc": "Full-featured website with custom functionality",
      "features": ["Unlimited pages", "Responsive design", "Contact form", "Advanced SEO", "Blog section", "Custom features", "Unlimited revisions"],
      "delivery": "14 days"
    }
  ]',
  images = '["/gigbanner.webp", "/gigbanner.webp", "/gigbanner.webp"]',
  faqs = '[
    {"q": "What do you need to get started?", "a": "A brief about your business, content, and any design inspiration you have."},
    {"q": "Can you redesign my existing website?", "a": "Absolutely! I can modernize and improve your current site."},
    {"q": "Do you provide support after delivery?", "a": "Yes, I offer 2 weeks of free support after project completion."}
  ]'
WHERE id = '5b9eb8a0-0747-4b2c-a937-3e41e86e7fc4';

-- Update Alice Johnson's UI/UX design service with plans
UPDATE services SET 
  plans = '[
    {
      "name": "Basic",
      "price": 800,
      "desc": "Simple UI design for web application",
      "features": ["5 screens", "Mobile responsive", "Style guide", "2 revisions"],
      "delivery": "5 days"
    },
    {
      "name": "Standard",
      "price": 1200,
      "desc": "Complete UI/UX design with user research",
      "features": ["10 screens", "Mobile responsive", "Style guide", "User research", "Prototype", "3 revisions"],
      "delivery": "7 days"
    },
    {
      "name": "Premium",
      "price": 2000,
      "desc": "Full UI/UX design with advanced features",
      "features": ["Unlimited screens", "Mobile responsive", "Style guide", "User research", "Interactive prototype", "User testing", "Unlimited revisions"],
      "delivery": "10 days"
    }
  ]',
  images = '["/gigbanner.webp", "/gigbanner.webp", "/gigbanner.webp"]',
  faqs = '[
    {"q": "What design tools do you use?", "a": "I use Figma, Adobe XD, and Sketch for design work."},
    {"q": "Do you provide source files?", "a": "Yes, I provide all source files and design assets."},
    {"q": "Can you work with existing brand guidelines?", "a": "Absolutely! I can follow your existing brand guidelines and style."}
  ]'
WHERE id = '7d1gd9c2-2969-6e4e-c159-5g63g08g9gd6'; 
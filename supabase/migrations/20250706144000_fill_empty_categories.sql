/*
  # Fill Empty Categories with Services

  This migration adds services to categories that are currently empty
  including mobile app development, graphic design, and other missing categories.
*/

-- Mobile App Development Services
INSERT INTO services (id, freelancer_id, title, description, category, price, delivery_time, image_url, tags, is_active, created_at, updated_at) VALUES 
('mobile-001-react-native', '22222222-2222-2222-2222-222222222222', 'React Native Mobile App Development', 'Professional React Native mobile app development for iOS and Android platforms with modern UI/UX design.', 'app-development', 2500.00, 21, '/gigbanner.webp', ARRAY['React Native', 'Mobile Development', 'iOS', 'Android', 'Cross-platform'], true, now(), now()),
('mobile-002-flutter-app', '22222222-2222-2222-2222-222222222222', 'Flutter Cross-Platform App', 'Complete Flutter app development with beautiful UI and native performance for both iOS and Android.', 'app-development', 3000.00, 25, '/gigbanner.webp', ARRAY['Flutter', 'Dart', 'Mobile Development', 'Cross-platform', 'UI/UX'], true, now(), now()),
('mobile-003-ios-app', '22222222-2222-2222-2222-222222222222', 'iOS Native App Development', 'Native iOS app development using Swift and SwiftUI with App Store submission.', 'app-development', 3500.00, 30, '/gigbanner.webp', ARRAY['iOS', 'Swift', 'SwiftUI', 'Xcode', 'App Store'], true, now(), now()),
('mobile-004-android-app', '22222222-2222-2222-2222-222222222222', 'Android Native App Development', 'Native Android app development using Kotlin and Jetpack Compose.', 'app-development', 3200.00, 28, '/gigbanner.webp', ARRAY['Android', 'Kotlin', 'Jetpack Compose', 'Google Play'], true, now(), now()),
('mobile-005-hybrid-app', '22222222-2222-2222-2222-222222222222', 'Hybrid Mobile App Development', 'Hybrid mobile app development using Ionic or Cordova for cross-platform compatibility.', 'app-development', 2000.00, 18, '/gigbanner.webp', ARRAY['Ionic', 'Cordova', 'Hybrid', 'Cross-platform'], true, now(), now());

-- Graphic Design Services
INSERT INTO services (id, freelancer_id, title, description, category, price, delivery_time, image_url, tags, is_active, created_at, updated_at) VALUES 
('graphic-001-logo-design', '44444444-4444-4444-4444-444444444444', 'Professional Logo Design', 'Custom logo design with multiple concepts, revisions, and brand guidelines.', 'graphic-design', 300.00, 5, '/gigbanner.webp', ARRAY['Logo Design', 'Brand Identity', 'Vector Graphics', 'Adobe Illustrator'], true, now(), now()),
('graphic-002-brand-identity', '44444444-4444-4444-4444-444444444444', 'Complete Brand Identity Package', 'Complete brand identity including logo, business cards, letterhead, and brand guidelines.', 'graphic-design', 800.00, 10, '/gigbanner.webp', ARRAY['Brand Identity', 'Logo Design', 'Business Cards', 'Brand Guidelines'], true, now(), now()),
('graphic-003-social-media-graphics', '44444444-4444-4444-4444-444444444444', 'Social Media Graphics Package', 'Complete social media graphics package for all platforms with consistent branding.', 'graphic-design', 400.00, 7, '/gigbanner.webp', ARRAY['Social Media', 'Graphics', 'Marketing', 'Adobe Photoshop'], true, now(), now()),
('graphic-004-print-materials', '44444444-4444-4444-4444-444444444444', 'Print Design & Materials', 'Professional print design including brochures, flyers, posters, and business materials.', 'graphic-design', 500.00, 8, '/gigbanner.webp', ARRAY['Print Design', 'Brochures', 'Flyers', 'Posters'], true, now(), now()),
('graphic-005-digital-illustration', '44444444-4444-4444-4444-444444444444', 'Digital Illustration & Artwork', 'Custom digital illustrations and artwork for various purposes and styles.', 'graphic-design', 600.00, 12, '/gigbanner.webp', ARRAY['Digital Art', 'Illustration', 'Custom Artwork', 'Adobe Illustrator'], true, now(), now());

-- UI/UX Design Services
INSERT INTO services (id, freelancer_id, title, description, category, price, delivery_time, image_url, tags, is_active, created_at, updated_at) VALUES 
('uiux-001-web-design', '44444444-4444-4444-4444-444444444444', 'Modern Web UI/UX Design', 'Complete web UI/UX design with wireframes, prototypes, and design systems.', 'ui-ux-design', 1200.00, 15, '/gigbanner.webp', ARRAY['UI/UX Design', 'Web Design', 'Wireframes', 'Prototyping'], true, now(), now()),
('uiux-002-mobile-ui', '44444444-4444-4444-4444-444444444444', 'Mobile App UI/UX Design', 'Mobile app UI/UX design with user research, wireframes, and interactive prototypes.', 'ui-ux-design', 1500.00, 18, '/gigbanner.webp', ARRAY['Mobile UI', 'UX Design', 'User Research', 'Prototyping'], true, now(), now()),
('uiux-003-dashboard-design', '44444444-4444-4444-4444-444444444444', 'Dashboard & Admin Panel Design', 'Professional dashboard and admin panel UI/UX design with data visualization.', 'ui-ux-design', 2000.00, 20, '/gigbanner.webp', ARRAY['Dashboard Design', 'Admin Panel', 'Data Visualization', 'UI/UX'], true, now(), now()),
('uiux-004-ecommerce-ui', '44444444-4444-4444-4444-444444444444', 'E-commerce UI/UX Design', 'Complete e-commerce website UI/UX design with user journey optimization.', 'ui-ux-design', 1800.00, 16, '/gigbanner.webp', ARRAY['E-commerce', 'UI/UX Design', 'User Journey', 'Conversion'], true, now(), now()),
('uiux-005-design-system', '44444444-4444-4444-4444-444444444444', 'Design System Creation', 'Complete design system with component library, style guide, and documentation.', 'ui-ux-design', 2500.00, 25, '/gigbanner.webp', ARRAY['Design System', 'Component Library', 'Style Guide', 'Documentation'], true, now(), now());

-- Video Production Services
INSERT INTO services (id, freelancer_id, title, description, category, price, delivery_time, image_url, tags, is_active, created_at, updated_at) VALUES 
('video-001-corporate-video', '55555555-5555-5555-5555-555555555555', 'Corporate Video Production', 'Professional corporate video production with scripting, filming, and post-production.', 'video-production', 1500.00, 14, '/gigbanner.webp', ARRAY['Corporate Video', 'Video Production', 'Filming', 'Post-production'], true, now(), now()),
('video-002-product-video', '55555555-5555-5555-5555-555555555555', 'Product Video & Commercial', 'High-quality product videos and commercials for marketing and advertising.', 'video-production', 1200.00, 10, '/gigbanner.webp', ARRAY['Product Video', 'Commercial', 'Marketing', 'Advertising'], true, now(), now()),
('video-003-event-video', '55555555-5555-5555-5555-555555555555', 'Event Video Coverage', 'Professional event video coverage and highlights for conferences, weddings, and events.', 'video-production', 800.00, 7, '/gigbanner.webp', ARRAY['Event Video', 'Coverage', 'Highlights', 'Events'], true, now(), now()),
('video-004-documentary', '55555555-5555-5555-5555-555555555555', 'Documentary Video Production', 'Documentary video production with storytelling and professional editing.', 'video-production', 2500.00, 21, '/gigbanner.webp', ARRAY['Documentary', 'Storytelling', 'Video Production', 'Editing'], true, now(), now()),
('video-005-animation-video', '55555555-5555-5555-5555-555555555555', 'Animated Video Production', 'Custom animated videos and motion graphics for marketing and entertainment.', 'video-production', 1800.00, 15, '/gigbanner.webp', ARRAY['Animation', 'Motion Graphics', 'Video Production', 'Marketing'], true, now(), now());

-- Audio/Music Services
INSERT INTO services (id, freelancer_id, title, description, category, price, delivery_time, image_url, tags, is_active, created_at, updated_at) VALUES 
('audio-001-music-production', '55555555-5555-5555-5555-555555555555', 'Music Production & Composition', 'Professional music production and composition for various genres and purposes.', 'audio-music', 800.00, 10, '/gigbanner.webp', ARRAY['Music Production', 'Composition', 'Recording', 'Mixing'], true, now(), now()),
('audio-002-podcast-editing', '55555555-5555-5555-5555-555555555555', 'Podcast Audio Editing', 'Professional podcast audio editing with noise reduction and quality enhancement.', 'audio-music', 300.00, 3, '/gigbanner.webp', ARRAY['Podcast', 'Audio Editing', 'Noise Reduction', 'Quality Enhancement'], true, now(), now()),
('audio-003-voice-over', '55555555-5555-5555-5555-555555555555', 'Professional Voice Over', 'Professional voice over recording for commercials, videos, and presentations.', 'audio-music', 400.00, 5, '/gigbanner.webp', ARRAY['Voice Over', 'Recording', 'Commercial', 'Professional'], true, now(), now()),
('audio-004-sound-design', '55555555-5555-5555-5555-555555555555', 'Sound Design & Effects', 'Custom sound design and audio effects for videos, games, and multimedia projects.', 'audio-music', 600.00, 8, '/gigbanner.webp', ARRAY['Sound Design', 'Audio Effects', 'Multimedia', 'Games'], true, now(), now()),
('audio-005-audio-mastering', '55555555-5555-5555-5555-555555555555', 'Audio Mastering & Mixing', 'Professional audio mastering and mixing for music and audio projects.', 'audio-music', 500.00, 7, '/gigbanner.webp', ARRAY['Audio Mastering', 'Mixing', 'Music', 'Professional'], true, now(), now());

-- Translation Services
INSERT INTO services (id, freelancer_id, title, description, category, price, delivery_time, image_url, tags, is_active, created_at, updated_at) VALUES 
('trans-001-document-translation', '44444444-4444-4444-4444-444444444444', 'Document Translation Services', 'Professional document translation in multiple languages with proofreading.', 'translation', 200.00, 5, '/gigbanner.webp', ARRAY['Translation', 'Documents', 'Multiple Languages', 'Proofreading'], true, now(), now()),
('trans-002-website-translation', '44444444-4444-4444-4444-444444444444', 'Website Content Translation', 'Complete website content translation with SEO optimization for multiple languages.', 'translation', 400.00, 7, '/gigbanner.webp', ARRAY['Website Translation', 'Content', 'SEO', 'Multiple Languages'], true, now(), now()),
('trans-003-technical-translation', '44444444-4444-4444-4444-444444444444', 'Technical Document Translation', 'Technical document translation with industry-specific terminology and accuracy.', 'translation', 300.00, 6, '/gigbanner.webp', ARRAY['Technical Translation', 'Documents', 'Industry-specific', 'Accuracy'], true, now(), now()),
('trans-004-marketing-translation', '44444444-4444-4444-4444-444444444444', 'Marketing Content Translation', 'Marketing content translation with cultural adaptation and localization.', 'translation', 250.00, 4, '/gigbanner.webp', ARRAY['Marketing Translation', 'Cultural Adaptation', 'Localization', 'Content'], true, now(), now()),
('trans-005-certified-translation', '44444444-4444-4444-4444-444444444444', 'Certified Translation Services', 'Certified translation services for legal and official documents.', 'translation', 500.00, 8, '/gigbanner.webp', ARRAY['Certified Translation', 'Legal Documents', 'Official', 'Certification'], true, now(), now());

-- Voice Over Services
INSERT INTO services (id, freelancer_id, title, description, category, price, delivery_time, image_url, tags, is_active, created_at, updated_at) VALUES 
('voice-001-commercial-voice', '55555555-5555-5555-5555-555555555555', 'Commercial Voice Over', 'Professional commercial voice over for advertisements and marketing videos.', 'voice-over', 300.00, 3, '/gigbanner.webp', ARRAY['Commercial Voice Over', 'Advertising', 'Marketing', 'Professional'], true, now(), now()),
('voice-002-narration-voice', '55555555-5555-5555-5555-555555555555', 'Narration Voice Over', 'Professional narration voice over for documentaries, presentations, and videos.', 'voice-over', 400.00, 4, '/gigbanner.webp', ARRAY['Narration', 'Documentary', 'Presentations', 'Voice Over'], true, now(), now()),
('voice-003-character-voice', '55555555-5555-5555-5555-555555555555', 'Character Voice Acting', 'Character voice acting for animations, games, and entertainment projects.', 'voice-over', 500.00, 5, '/gigbanner.webp', ARRAY['Character Voice', 'Voice Acting', 'Animation', 'Games'], true, now(), now()),
('voice-004-elearning-voice', '55555555-5555-5555-5555-555555555555', 'E-learning Voice Over', 'Professional e-learning voice over for educational content and courses.', 'voice-over', 350.00, 4, '/gigbanner.webp', ARRAY['E-learning', 'Educational', 'Voice Over', 'Courses'], true, now(), now()),
('voice-005-multilingual-voice', '55555555-5555-5555-5555-555555555555', 'Multilingual Voice Over', 'Multilingual voice over services in various languages and accents.', 'voice-over', 600.00, 6, '/gigbanner.webp', ARRAY['Multilingual', 'Multiple Languages', 'Voice Over', 'Accents'], true, now(), now());

-- Photography Services
INSERT INTO services (id, freelancer_id, title, description, category, price, delivery_time, image_url, tags, is_active, created_at, updated_at) VALUES 
('photo-001-product-photography', '44444444-4444-4444-4444-444444444444', 'Product Photography', 'Professional product photography with studio lighting and post-processing.', 'photography', 400.00, 5, '/gigbanner.webp', ARRAY['Product Photography', 'Studio', 'Lighting', 'Post-processing'], true, now(), now()),
('photo-002-portrait-photography', '44444444-4444-4444-4444-444444444444', 'Portrait Photography', 'Professional portrait photography for individuals and families.', 'photography', 300.00, 4, '/gigbanner.webp', ARRAY['Portrait Photography', 'Individuals', 'Families', 'Professional'], true, now(), now()),
('photo-003-event-photography', '44444444-4444-4444-4444-444444444444', 'Event Photography', 'Event photography coverage for weddings, corporate events, and special occasions.', 'photography', 600.00, 7, '/gigbanner.webp', ARRAY['Event Photography', 'Weddings', 'Corporate Events', 'Coverage'], true, now(), now()),
('photo-004-real-estate-photography', '44444444-4444-4444-4444-444444444444', 'Real Estate Photography', 'Professional real estate photography with virtual tours and drone shots.', 'photography', 500.00, 6, '/gigbanner.webp', ARRAY['Real Estate', 'Virtual Tours', 'Drone Photography', 'Property'], true, now(), now()),
('photo-005-food-photography', '44444444-4444-4444-4444-444444444444', 'Food Photography', 'Professional food photography for restaurants, menus, and marketing materials.', 'photography', 350.00, 4, '/gigbanner.webp', ARRAY['Food Photography', 'Restaurants', 'Menus', 'Marketing'], true, now(), now());

-- Illustration Services
INSERT INTO services (id, freelancer_id, title, description, category, price, delivery_time, image_url, tags, is_active, created_at, updated_at) VALUES 
('illus-001-custom-illustration', '44444444-4444-4444-4444-444444444444', 'Custom Digital Illustration', 'Custom digital illustrations in various styles for books, websites, and marketing.', 'illustration', 500.00, 8, '/gigbanner.webp', ARRAY['Digital Illustration', 'Custom Art', 'Various Styles', 'Marketing'], true, now(), now()),
('illus-002-character-design', '44444444-4444-4444-4444-444444444444', 'Character Design & Illustration', 'Professional character design and illustration for games, books, and animations.', 'illustration', 600.00, 10, '/gigbanner.webp', ARRAY['Character Design', 'Games', 'Books', 'Animation'], true, now(), now()),
('illus-003-concept-art', '44444444-4444-4444-4444-444444444444', 'Concept Art & Design', 'Concept art and design for games, movies, and creative projects.', 'illustration', 800.00, 12, '/gigbanner.webp', ARRAY['Concept Art', 'Games', 'Movies', 'Creative'], true, now(), now()),
('illus-004-technical-illustration', '44444444-4444-4444-4444-444444444444', 'Technical Illustration', 'Technical illustrations for manuals, documentation, and educational materials.', 'illustration', 400.00, 6, '/gigbanner.webp', ARRAY['Technical Illustration', 'Manuals', 'Documentation', 'Educational'], true, now(), now()),
('illus-005-storybook-illustration', '44444444-4444-4444-4444-444444444444', 'Storybook Illustration', 'Complete storybook illustrations for children books and educational materials.', 'illustration', 700.00, 14, '/gigbanner.webp', ARRAY['Storybook', 'Children Books', 'Educational', 'Illustration'], true, now(), now());

-- Animation Services
INSERT INTO services (id, freelancer_id, title, description, category, price, delivery_time, image_url, tags, is_active, created_at, updated_at) VALUES 
('anim-001-2d-animation', '55555555-5555-5555-5555-555555555555', '2D Animation Production', 'Professional 2D animation production for videos, commercials, and entertainment.', 'animation', 1200.00, 15, '/gigbanner.webp', ARRAY['2D Animation', 'Video Production', 'Commercials', 'Entertainment'], true, now(), now()),
('anim-002-motion-graphics', '55555555-5555-5555-5555-555555555555', 'Motion Graphics Design', 'Professional motion graphics for videos, presentations, and marketing materials.', 'animation', 800.00, 10, '/gigbanner.webp', ARRAY['Motion Graphics', 'Videos', 'Presentations', 'Marketing'], true, now(), now()),
('anim-003-character-animation', '55555555-5555-5555-5555-555555555555', 'Character Animation', 'Professional character animation for games, videos, and interactive content.', 'animation', 1500.00, 18, '/gigbanner.webp', ARRAY['Character Animation', 'Games', 'Videos', 'Interactive'], true, now(), now()),
('anim-004-explainer-video', '55555555-5555-5555-5555-555555555555', 'Explainer Video Animation', 'Animated explainer videos for businesses, products, and services.', 'animation', 1000.00, 12, '/gigbanner.webp', ARRAY['Explainer Video', 'Business', 'Products', 'Services'], true, now(), now()),
('anim-005-logo-animation', '55555555-5555-5555-5555-555555555555', 'Logo Animation & Branding', 'Professional logo animation and brand identity motion graphics.', 'animation', 600.00, 8, '/gigbanner.webp', ARRAY['Logo Animation', 'Branding', 'Motion Graphics', 'Identity'], true, now(), now());

-- Game Development Services
INSERT INTO services (id, freelancer_id, title, description, category, price, delivery_time, image_url, tags, is_active, created_at, updated_at) VALUES 
('game-001-mobile-game', '22222222-2222-2222-2222-222222222222', 'Mobile Game Development', 'Complete mobile game development for iOS and Android platforms.', 'game-development', 5000.00, 45, '/gigbanner.webp', ARRAY['Mobile Games', 'iOS', 'Android', 'Game Development'], true, now(), now()),
('game-002-web-game', '22222222-2222-2222-2222-222222222222', 'Web Game Development', 'Browser-based game development with HTML5 and JavaScript.', 'game-development', 3000.00, 30, '/gigbanner.webp', ARRAY['Web Games', 'HTML5', 'JavaScript', 'Browser Games'], true, now(), now()),
('game-003-unity-game', '22222222-2222-2222-2222-222222222222', 'Unity Game Development', 'Professional Unity game development for multiple platforms.', 'game-development', 6000.00, 50, '/gigbanner.webp', ARRAY['Unity', 'Game Development', 'Cross-platform', 'C#'], true, now(), now()),
('game-004-game-art', '22222222-2222-2222-2222-222222222222', 'Game Art & Assets', 'Professional game art and asset creation for games and interactive projects.', 'game-development', 2000.00, 20, '/gigbanner.webp', ARRAY['Game Art', 'Assets', 'Sprites', '3D Models'], true, now(), now()),
('game-005-game-design', '22222222-2222-2222-2222-222222222222', 'Game Design & Mechanics', 'Game design and mechanics development for various game genres.', 'game-development', 2500.00, 25, '/gigbanner.webp', ARRAY['Game Design', 'Mechanics', 'Gameplay', 'Design'], true, now(), now());

-- Virtual Assistant Services
INSERT INTO services (id, freelancer_id, title, description, category, price, delivery_time, image_url, tags, is_active, created_at, updated_at) VALUES 
('va-001-administrative-support', '11111111-1111-1111-1111-111111111111', 'Administrative Virtual Assistant', 'Professional administrative support including email management, scheduling, and data entry.', 'virtual-assistant', 300.00, 30, '/gigbanner.webp', ARRAY['Administrative', 'Email Management', 'Scheduling', 'Data Entry'], true, now(), now()),
('va-002-customer-support', '11111111-1111-1111-1111-111111111111', 'Customer Support Virtual Assistant', 'Professional customer support and service for businesses and e-commerce.', 'virtual-assistant', 400.00, 30, '/gigbanner.webp', ARRAY['Customer Support', 'Service', 'E-commerce', 'Business'], true, now(), now()),
('va-003-research-assistant', '11111111-1111-1111-1111-111111111111', 'Research & Data Virtual Assistant', 'Research and data analysis support for projects and business needs.', 'virtual-assistant', 350.00, 30, '/gigbanner.webp', ARRAY['Research', 'Data Analysis', 'Projects', 'Business'], true, now(), now()),
('va-004-social-media-va', '11111111-1111-1111-1111-111111111111', 'Social Media Virtual Assistant', 'Social media management and content creation for businesses and influencers.', 'virtual-assistant', 500.00, 30, '/gigbanner.webp', ARRAY['Social Media', 'Management', 'Content Creation', 'Business'], true, now(), now()),
('va-005-project-coordination', '11111111-1111-1111-1111-111111111111', 'Project Coordination Virtual Assistant', 'Project coordination and management support for teams and businesses.', 'virtual-assistant', 600.00, 30, '/gigbanner.webp', ARRAY['Project Coordination', 'Management', 'Teams', 'Business'], true, now(), now());

-- Cybersecurity Services
INSERT INTO services (id, freelancer_id, title, description, category, price, delivery_time, image_url, tags, is_active, created_at, updated_at) VALUES 
('cyber-001-security-audit', '33333333-3333-3333-3333-333333333333', 'Security Audit & Assessment', 'Comprehensive security audit and vulnerability assessment for systems and networks.', 'cybersecurity', 1500.00, 14, '/gigbanner.webp', ARRAY['Security Audit', 'Vulnerability Assessment', 'Systems', 'Networks'], true, now(), now()),
('cyber-002-penetration-testing', '33333333-3333-3333-3333-333333333333', 'Penetration Testing Services', 'Professional penetration testing and ethical hacking services.', 'cybersecurity', 2000.00, 21, '/gigbanner.webp', ARRAY['Penetration Testing', 'Ethical Hacking', 'Security', 'Testing'], true, now(), now()),
('cyber-003-security-consulting', '33333333-3333-3333-3333-333333333333', 'Cybersecurity Consulting', 'Professional cybersecurity consulting and strategy development.', 'cybersecurity', 1200.00, 10, '/gigbanner.webp', ARRAY['Cybersecurity', 'Consulting', 'Strategy', 'Security'], true, now(), now()),
('cyber-004-incident-response', '33333333-3333-3333-3333-333333333333', 'Incident Response & Recovery', 'Security incident response and recovery services for businesses.', 'cybersecurity', 2500.00, 7, '/gigbanner.webp', ARRAY['Incident Response', 'Recovery', 'Security', 'Business'], true, now(), now()),
('cyber-005-compliance-audit', '33333333-3333-3333-3333-333333333333', 'Compliance & Regulatory Audit', 'Compliance and regulatory audit services for various industries.', 'cybersecurity', 1800.00, 16, '/gigbanner.webp', ARRAY['Compliance', 'Regulatory', 'Audit', 'Industries'], true, now(), now());

-- Data Analysis Services
INSERT INTO services (id, freelancer_id, title, description, category, price, delivery_time, image_url, tags, is_active, created_at, updated_at) VALUES 
('data-001-business-analytics', '33333333-3333-3333-3333-333333333333', 'Business Analytics & Insights', 'Professional business analytics and data insights for strategic decision making.', 'data-analysis', 800.00, 10, '/gigbanner.webp', ARRAY['Business Analytics', 'Data Insights', 'Strategic', 'Decision Making'], true, now(), now()),
('data-002-data-visualization', '33333333-3333-3333-3333-333333333333', 'Data Visualization & Dashboards', 'Professional data visualization and interactive dashboard creation.', 'data-analysis', 600.00, 8, '/gigbanner.webp', ARRAY['Data Visualization', 'Dashboards', 'Interactive', 'Analytics'], true, now(), now()),
('data-003-predictive-analytics', '33333333-3333-3333-3333-333333333333', 'Predictive Analytics & Modeling', 'Advanced predictive analytics and statistical modeling services.', 'data-analysis', 1200.00, 15, '/gigbanner.webp', ARRAY['Predictive Analytics', 'Statistical Modeling', 'Advanced', 'Analytics'], true, now(), now()),
('data-004-market-research', '33333333-3333-3333-3333-333333333333', 'Market Research & Analysis', 'Comprehensive market research and competitive analysis services.', 'data-analysis', 1000.00, 12, '/gigbanner.webp', ARRAY['Market Research', 'Competitive Analysis', 'Research', 'Analysis'], true, now(), now()),
('data-005-big-data-analysis', '33333333-3333-3333-3333-333333333333', 'Big Data Analysis & Processing', 'Big data analysis and processing for large-scale datasets.', 'data-analysis', 1500.00, 18, '/gigbanner.webp', ARRAY['Big Data', 'Analysis', 'Processing', 'Large-scale'], true, now(), now());

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
  'mobile-001-react-native', 'mobile-002-flutter-app', 'mobile-003-ios-app', 'mobile-004-android-app', 'mobile-005-hybrid-app',
  'graphic-001-logo-design', 'graphic-002-brand-identity', 'graphic-003-social-media-graphics', 'graphic-004-print-materials', 'graphic-005-digital-illustration',
  'uiux-001-web-design', 'uiux-002-mobile-ui', 'uiux-003-dashboard-design', 'uiux-004-ecommerce-ui', 'uiux-005-design-system',
  'video-001-corporate-video', 'video-002-product-video', 'video-003-event-video', 'video-004-documentary', 'video-005-animation-video',
  'audio-001-music-production', 'audio-002-podcast-editing', 'audio-003-voice-over', 'audio-004-sound-design', 'audio-005-audio-mastering',
  'trans-001-document-translation', 'trans-002-website-translation', 'trans-003-technical-translation', 'trans-004-marketing-translation', 'trans-005-certified-translation',
  'voice-001-commercial-voice', 'voice-002-narration-voice', 'voice-003-character-voice', 'voice-004-elearning-voice', 'voice-005-multilingual-voice',
  'photo-001-product-photography', 'photo-002-portrait-photography', 'photo-003-event-photography', 'photo-004-real-estate-photography', 'photo-005-food-photography',
  'illus-001-custom-illustration', 'illus-002-character-design', 'illus-003-concept-art', 'illus-004-technical-illustration', 'illus-005-storybook-illustration',
  'anim-001-2d-animation', 'anim-002-motion-graphics', 'anim-003-character-animation', 'anim-004-explainer-video', 'anim-005-logo-animation',
  'game-001-mobile-game', 'game-002-web-game', 'game-003-unity-game', 'game-004-game-art', 'game-005-game-design',
  'va-001-administrative-support', 'va-002-customer-support', 'va-003-research-assistant', 'va-004-social-media-va', 'va-005-project-coordination',
  'cyber-001-security-audit', 'cyber-002-penetration-testing', 'cyber-003-security-consulting', 'cyber-004-incident-response', 'cyber-005-compliance-audit',
  'data-001-business-analytics', 'data-002-data-visualization', 'data-003-predictive-analytics', 'data-004-market-research', 'data-005-big-data-analysis'
); 
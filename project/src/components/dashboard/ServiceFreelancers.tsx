import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Star, ArrowLeft, Filter, Search, SortAsc, SortDesc, MapPin, Clock, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Freelancer {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  price: number;
  tagline: string;
  workThumb: string;
  projectCount: number;
  skills: string[];
  location: string;
  responseTime: string;
  completionRate: number;
}

interface Plan {
  name: string;
  price: number;
  desc: string;
  features: string[];
  delivery: string;
}

type SortOption = 'rating' | 'price-low' | 'price-high' | 'reviews' | 'completion';
type FilterOption = 'all' | 'top-rated' | 'under-1000' | 'under-2000' | 'fast-delivery';

export const ServiceFreelancers: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const service = useMemo(() => {
    let s = (location.state && (location.state as any).service) || null;
    let categoryFromQuery = '';
    if (!s) {
      const params = new URLSearchParams(location.search);
      categoryFromQuery = params.get('category') || '';
      if (categoryFromQuery) {
        s = { title: categoryFromQuery, category: categoryFromQuery };
      }
    }
    return s;
  }, [location.state, location.search]);
  // If no category, redirect to browse-services
  React.useEffect(() => {
    if (!service) {
      setLoading(false);
      navigate('/browse-services');
    }
  }, [service, navigate]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [services, setServices] = useState<any[]>([]);

  // Fetch real services from Supabase for this category
  useEffect(() => {
    async function fetchServices() {
      setLoading(true);
      try {
        let query = supabase.from('services').select('*');
        if (service?.category) {
          query = query.ilike('category', `%${service.category}%`);
        } else if (service?.title) {
          query = query.ilike('category', `%${service.title}%`);
        }
        query = query.eq('isactive', true);
        const { data, error } = await query;
        // Fetch freelancer avatars for each service
        const servicesWithAvatars = await Promise.all((data || []).map(async (svc: any) => {
          if (svc.freelancerid) {
            const { data: freelancer, error: freelancerError } = await supabase
              .from('users')
              .select('avatar, first_name, last_name')
              .eq('id', svc.freelancerid)
              .single();
            
            if (freelancerError) {
              // Create dummy freelancer data based on service ID for consistent display
              const dummyNames = [
                { first_name: 'John', last_name: 'Doe' },
                { first_name: 'Jane', last_name: 'Smith' },
                { first_name: 'Mike', last_name: 'Johnson' },
                { first_name: 'Sarah', last_name: 'Wilson' },
                { first_name: 'David', last_name: 'Brown' },
                { first_name: 'Lisa', last_name: 'Davis' },
                { first_name: 'Tom', last_name: 'Miller' },
                { first_name: 'Emma', last_name: 'Taylor' },
                { first_name: 'Alex', last_name: 'Anderson' },
                { first_name: 'Rachel', last_name: 'White' }
              ];
              
              // Use service ID to consistently assign a dummy name
              const nameIndex = parseInt(svc.id.slice(-1), 16) % dummyNames.length;
              const dummyFreelancer = dummyNames[nameIndex];
              
              return { 
                ...svc, 
                freelancer: dummyFreelancer,
                reviews: generateDummyReviews(svc.id)
              };
            }
            
            // Fetch reviews for this service
            const { data: reviews, error: reviewsError } = await supabase
              .from('reviews')
              .select('rating, comment, created_at')
              .eq('service_id', svc.id);
            
            if (reviewsError) {
              console.log('Error fetching reviews:', reviewsError);
            }
            
            // Only use real reviews, no dummy reviews
            const finalReviews = reviews || [];
            
            // Calculate average rating and review count
            const reviewCount = finalReviews.length;
            const averageRating = finalReviews.length > 0 
              ? finalReviews.reduce((sum: number, review: any) => sum + review.rating, 0) / finalReviews.length
              : 0; // No rating when no reviews
            
            return { 
              ...svc, 
              freelancer: { 
                ...freelancer,
                rating: averageRating,
                reviewCount: reviewCount
              },
              reviews: finalReviews
            };
          }
          return svc;
        }));
        setServices(servicesWithAvatars);
        if (error) setError(error.message || 'Failed to fetch services');
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, [service]);

  // State for filters and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Themed SVG fallback for any image error
  const fallbackThumb =
    "data:image/svg+xml,%3Csvg width='400' height='240' xmlns='http://www.w3.org/2000/svg'%3E%3Crect fill='%2310b981' width='400' height='240'/%3E%3Ctext x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='32'%3EGig%3C/text%3E%3C/svg%3E";

  // Comment out all dummy data code
  // const getServiceSpecificFreelancers = (serviceType: string): Freelancer[] => {
  //   const serviceData = {
  //     'Web Development': {
  //       names: ['Alex Chen', 'Sarah Rodriguez', 'Marcus Johnson', 'Emma Thompson', 'David Kim', 'Lisa Wang', 'James Wilson', 'Maria Garcia', 'Robert Lee', 'Anna Smith', 'Michael Brown', 'Jennifer Davis', 'Christopher Miller', 'Amanda Taylor', 'Daniel Anderson', 'Rachel White'],
  //       taglines: [
  //         'Full-stack developer specializing in modern web applications',
  //         'React expert with 5+ years building scalable frontends',
  //         'Node.js backend specialist with AWS experience',
  //         'Vue.js developer creating beautiful user interfaces',
  //         'Python Django developer for robust web solutions',
  //         'Angular specialist with enterprise experience',
  //         'PHP Laravel developer for custom web applications',
  //         'WordPress expert with custom theme development',
  //         'MERN stack developer for modern web apps',
  //         'Ruby on Rails developer for rapid prototyping',
  //         'ASP.NET Core developer for enterprise solutions',
  //         'Flutter web developer for cross-platform apps',
  //         'GraphQL specialist with Apollo experience',
  //         'Microservices architect with Docker expertise',
  //         'Progressive Web App developer',
  //         'E-commerce specialist with Shopify/Stripe'
  //       ],
  //       skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'GraphQL', 'Vue.js', 'Angular', 'Python', 'PHP', 'Ruby', 'Flutter', 'Next.js', 'Laravel'],
  //       priceRange: { min: 500, max: 5000 }
  //     },
  //     'Graphic Design': {
  //       names: ['Sophie Anderson', 'Carlos Mendez', 'Isabella Park', 'Lucas Thompson', 'Ava Rodriguez', 'Ethan Chen', 'Mia Johnson', 'Noah Williams', 'Zoe Davis', 'Liam Brown', 'Chloe Wilson', 'Mason Taylor', 'Harper Garcia', 'Evelyn Martinez', 'Sebastian Lee', 'Victoria Kim'],
  //       taglines: [
  //         'Creative designer specializing in brand identity',
  //         'UI/UX designer with mobile app expertise',
  //         'Logo designer creating memorable brand marks',
  //         'Print designer for marketing materials',
  //         'Digital illustrator with unique artistic style',
  //         'Packaging designer for product presentation',
  //         'Social media graphics specialist',
  //         'Typography expert with custom font design',
  //         'Infographic designer for data visualization',
  //         'Web designer with modern aesthetic',
  //         'Poster designer for events and promotions',
  //         'Icon designer for app interfaces',
  //         'Brochure designer for business materials',
  //         'T-shirt designer with trendy graphics',
  //         'Business card designer with elegant layouts',
  //         'Banner designer for digital advertising'
  //       ],
  //       skills: ['Adobe Illustrator', 'Photoshop', 'InDesign', 'Figma', 'Sketch', 'Canva', 'Typography', 'Color Theory', 'Branding', 'Logo Design', 'UI/UX', 'Print Design', 'Digital Art', 'Vector Graphics', 'Layout Design', 'Icon Design'],
  //       priceRange: { min: 300, max: 3000 }
  //     },
  //     'Digital Marketing': {
  //       names: ['Ryan Mitchell', 'Jessica Torres', 'Brandon Lewis', 'Nicole Adams', 'Kevin Patel', 'Amber Foster', 'Tyler Green', 'Hannah Baker', 'Jordan Cooper', 'Lauren Phillips', 'Austin Campbell', 'Kayla Evans', 'Cameron Collins', 'Morgan Stewart', 'Reese Morris', 'Casey Rogers'],
  //       taglines: [
  //         'SEO specialist driving organic traffic growth',
  //         'Social media strategist for brand engagement',
  //         'PPC expert optimizing ad campaigns',
  //         'Content marketing specialist with storytelling',
  //         'Email marketing strategist for conversions',
  //         'Influencer marketing coordinator',
  //         'Analytics expert with data-driven insights',
  //         'Conversion rate optimization specialist',
  //         'Local SEO expert for small businesses',
  //         'Facebook ads specialist for lead generation',
  //         'Google Ads expert with ROI focus',
  //         'Content creator for social media',
  //         'Marketing automation specialist',
  //         'Brand strategist with market research',
  //         'Video marketing specialist',
  //         'Affiliate marketing coordinator'
  //       ],
  //       skills: ['SEO', 'Google Ads', 'Facebook Ads', 'Email Marketing', 'Social Media', 'Content Marketing', 'Analytics', 'CRO', 'Marketing Automation', 'Brand Strategy', 'Video Marketing', 'Influencer Marketing', 'Local SEO', 'PPC', 'Market Research', 'Lead Generation'],
  //       priceRange: { min: 400, max: 3500 }
  //     },
  //     'Content Writing': {
  //       names: ['Olivia Bennett', 'Nathan Rivera', 'Grace Coleman', 'Isaac Reed', 'Scarlett Ward', 'Leo Cox', 'Luna Richardson', 'Felix Howard', 'Stella Ward', 'Miles Peterson', 'Nova Bailey', 'Atlas Cooper', 'Iris Richardson', 'Phoenix Morgan', 'Sage Coleman', 'River Bennett'],
  //       taglines: [
  //         'Copywriter specializing in conversion-focused content',
  //         'Blog writer with SEO optimization expertise',
  //         'Technical writer for complex documentation',
  //         'Creative writer for engaging storytelling',
  //         'Business writer for professional content',
  //         'Product description specialist',
  //         'Email copywriter for sales sequences',
  //         'Social media content creator',
  //         'Whitepaper writer for thought leadership',
  //         'Press release specialist',
  //         'Script writer for video content',
  //         'Case study writer for social proof',
  //         'Landing page copywriter',
  //         'Newsletter writer for engagement',
  //         'Ghostwriter for books and articles',
  //         'Academic writer with research expertise'
  //       ],
  //       skills: ['Copywriting', 'SEO Writing', 'Blog Writing', 'Technical Writing', 'Creative Writing', 'Email Copy', 'Social Media', 'Content Strategy', 'Editing', 'Proofreading', 'Research', 'Storytelling', 'Brand Voice', 'Conversion Copy', 'Ghostwriting', 'Academic Writing'],
  //       priceRange: { min: 200, max: 2000 }
  //     },
  //     'Video Editing': {
  //       names: ['Xavier Rodriguez', 'Sofia Martinez', 'Diego Hernandez', 'Valentina Lopez', 'Mateo Gonzalez', 'Camila Perez', 'Adrian Torres', 'Isabella Morales', 'Gabriel Silva', 'Lucia Vargas', 'Rafael Castro', 'Elena Ruiz', 'Javier Mendoza', 'Carmen Ortega', 'Fernando Herrera', 'Rosa Jimenez'],
  //       taglines: [
  //         'Video editor specializing in cinematic storytelling',
  //         'YouTube content editor with viral potential',
  //         'Commercial video editor for brand campaigns',
  //         'Wedding video editor with emotional storytelling',
  //         'Music video editor with creative effects',
  //         'Corporate video editor for presentations',
  //         'Social media video editor for platforms',
  //         'Documentary editor with narrative focus',
  //         'Animation video editor with motion graphics',
  //         'Product video editor for e-commerce',
  //         'Event video editor for live recordings',
  //         'Educational video editor for courses',
  //         'Promotional video editor for marketing',
  //         'Short-form video editor for TikTok/Reels',
  //         'Film trailer editor with dramatic impact',
  //         'Podcast video editor for YouTube'
  //       ],
  //       skills: ['Adobe Premiere Pro', 'After Effects', 'Final Cut Pro', 'DaVinci Resolve', 'Motion Graphics', 'Color Grading', 'Sound Design', 'Video Effects', 'Animation', 'Storytelling', 'Cinematography', 'Video Compression', 'Green Screen', 'Video Transitions', 'Audio Sync', 'Video Optimization'],
  //       priceRange: { min: 800, max: 8000 }
  //     }
  //   };

  //   const serviceInfo = serviceData[serviceType as keyof typeof serviceData] || serviceData['Web Development'];
  //   const { names, taglines, skills, priceRange } = serviceInfo;

  //   const freelancers = Array.from({ length: 24 }).map((_, i) => {
  //     const name = names[i % names.length];
  //     const tagline = taglines[i % taglines.length];
  //     const price = Math.floor(Math.random() * (priceRange.max - priceRange.min + 1)) + priceRange.min;
  //     const rating = 4.0 + Math.random() * 1.0;
  //     const reviewCount = Math.floor(Math.random() * 500) + 50;
  //     const projectCount = Math.floor(Math.random() * 200) + 20;
  //     const completionRate = 85 + Math.random() * 15;
  //     const responseTime = ['1 hour', '2 hours', '4 hours', '6 hours', '12 hours', '1 day'][Math.floor(Math.random() * 6)];
  //     const location = ['New York, USA', 'London, UK', 'Toronto, Canada', 'Sydney, Australia', 'Berlin, Germany', 'Tokyo, Japan', 'Mumbai, India', 'São Paulo, Brazil'][Math.floor(Math.random() * 8)];
      
  //     // Select 3-5 random skills for this freelancer
  //     const freelancerSkills = skills.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 3);
      
  //     return {
  //       id: `${serviceType.toLowerCase().replace(' ', '-')}-${i + 1}`,
  //       name,
  //       avatar: shuffledAvatars[i % shuffledAvatars.length],
  //       rating: Math.round(rating * 10) / 10,
  //       reviewCount,
  //       price,
  //       tagline,
  //       workThumb: gigBannerUrl,
  //       projectCount,
  //       skills: freelancerSkills,
  //       location,
  //       responseTime,
  //       completionRate: Math.round(completionRate)
  //     };
  //   });
  //   // Store in localStorage for profile page access
  //   localStorage.setItem('dummyFreelancers', JSON.stringify(freelancers));
  //   return freelancers;
  // };

  // const allFreelancers = getServiceSpecificFreelancers(service?.title || 'Web Development');

  // Filter and sort services
  const filteredAndSortedServices = useMemo(() => {
    let filtered = services.filter(service => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        (service.title || '').toLowerCase().includes(searchLower) ||
        (service.description || '').toLowerCase().includes(searchLower) ||
        (service.freelancer?.first_name || '').toLowerCase().includes(searchLower) ||
        (service.category || '').toLowerCase().includes(searchLower) ||
        (service.freelancer?.skills || service.skills || []).some((skill: string) => 
          skill.toLowerCase().includes(searchLower)
        );

      if (!matchesSearch) return false;

      // Category filters
      switch (filterBy) {
        case 'top-rated':
          const rating = parseFloat(service.freelancer?.rating || service.rating || '0');
          return rating >= 4.5;
        case 'under-1000':
          return (service.price || 0) <= 1000;
        case 'under-2000':
          return (service.price || 0) <= 2000;
        case 'fast-delivery':
          // For real services, we'll assume all are fast delivery for now
          return true;
        default:
          return true;
      }
    });

    // Sort services
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => {
          const ratingA = parseFloat(a.freelancer?.rating || a.rating || '0');
          const ratingB = parseFloat(b.freelancer?.rating || b.rating || '0');
          return ratingB - ratingA;
        });
        break;
      case 'price-low':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'reviews':
        filtered.sort((a, b) => {
          const reviewsA = parseInt(a.freelancer?.reviewCount || a.reviewCount || '0');
          const reviewsB = parseInt(b.freelancer?.reviewCount || b.reviewCount || '0');
          return reviewsB - reviewsA;
        });
        break;
      case 'completion':
        filtered.sort((a, b) => {
          const completionA = parseFloat(a.freelancer?.completionRate || a.completionRate || '0');
          const completionB = parseFloat(b.freelancer?.completionRate || b.completionRate || '0');
          return completionB - completionA;
        });
        break;
    }

    return filtered;
  }, [services, searchTerm, sortBy, filterBy]);

  // Debug logging
  useEffect(() => {
    console.log('Search term:', searchTerm);
    console.log('Sort by:', sortBy);
    console.log('Filter by:', filterBy);
    console.log('Total services:', services.length);
    console.log('Filtered services:', filteredAndSortedServices.length);
  }, [searchTerm, sortBy, filterBy, services.length, filteredAndSortedServices.length]);

  // Only show real services in the grid
  if (!loading && services.length === 0) {
    return <div className="text-center py-12 text-green-400">No real services found for this category.</div>;
  }

  const isRealFreelancer = (freelancer: any) => {
    // Heuristic: real freelancers have a UUID id (36 chars, with dashes), dummy have custom ids
    return typeof freelancer.id === 'string' && freelancer.id.length === 36 && freelancer.id.includes('-');
  };

  const generateAvatarUrl = (firstName: string | undefined, lastName: string | undefined, first_name: string | undefined, last_name: string | undefined) => {
    const name = `${firstName || first_name || ''} ${lastName || last_name || ''}`.trim();
    if (!name) return 'https://ui-avatars.com/api/?name=Freelancer&background=random&color=random';
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=random`;
    return avatarUrl;
  };

  // Generate dummy reviews for services that don't have real reviews
  const generateDummyReviews = (serviceId: string) => {
    const dummyReviews = [
      { rating: 5, comment: 'Excellent work! Very professional and delivered on time.', created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
      { rating: 4, comment: 'Great service, highly recommended!', created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() },
      { rating: 5, comment: 'Very responsive and delivered quality results.', created_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString() },
      { rating: 4, comment: 'Good quality work, would work with again.', created_at: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString() },
      { rating: 5, comment: 'Professional service, exceeded expectations.', created_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString() },
      { rating: 4, comment: 'Great communication and timely delivery.', created_at: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString() },
      { rating: 5, comment: 'Reliable freelancer, would recommend.', created_at: new Date(Date.now() - 49 * 24 * 60 * 60 * 1000).toISOString() }
    ];
    
    // Use service ID to consistently assign reviews (3-7 reviews per service)
    const numReviews = (parseInt(serviceId.slice(-2), 16) % 5) + 3;
    return dummyReviews.slice(0, numReviews);
  };

  // Function to get lowest price from plans
  const getLowestPrice = (service: any) => {
    if (service.plans) {
      try {
        const plans: Plan[] = typeof service.plans === 'string' 
          ? JSON.parse(service.plans) 
          : service.plans;
        
        if (plans && plans.length > 0) {
          const prices = plans.map(plan => plan.price);
          return Math.min(...prices);
        }
      } catch (e) {
        console.error('Error parsing plans:', e);
      }
    }
    return service.price || 0;
  };

  // Demo images from public folder - only using your provided images
  const demoImages = [
    '/OIPbg.png',
    '/OIPfdf.png',
    '/OIPfef.png',
    '/OIPefe.png',
    '/OIPcdf.png',
    '/OIPnc.png',
    '/OIPb.png',
    '/OIPg.png',
    '/why-trust-slideuplift-presentation-design-services-6.png',
    '/OIPn.png',
    '/OIPf.png',
    '/OIPdf.png',
    '/OIPvg.png',
    '/OIPfg.png',
    '/wp9517064.png',
    '/representations_user_experience_interface_design_23_2150038900_74c059d2e1.png',
    '/OIP78.png',
    '/R.png',
    '/OIPuj.png',
    '/graphic-design.png',
    '/OIPj.png',
    '/Thumbnail-1.png',
    '/seo-techniques.png',
    '/Facility_Management_Software_fd01278999.png',
    '/OIPh.png',
    '/OIP34.png',
    '/OIPt.png',
    '/banner-content-writing.png',
    '/6.png',
    '/business-women-work-computers-write-notepad-with-pen-calculate-financial-statements-office_931309-4329.png',
    '/574-5741689_content-writing-services-png-transparent-png.png',
    '/OIP9.png',
    '/OIP.8png.png',
    '/OIP7.png',
    '/OIP6.png',
    '/OIP5.png',
    '/OIP4.png',
    '/OIP3.png',
    '/OIP2.png',
    '/7-Tips-to-Localize-and-Translate-Apps.png',
    '/Social-media-marketing-01-1024x536.png',
    '/social-media-engagement_839035-839915.png',
    '/datadriven-social-media-management-for-startups-ihh.png',
    '/featured_homepage.png',
    '/OIP1.png',
    '/pexels-francesco-paggiaro-2111015-scaled.png',
    '/wp4269240.png',
    '/InTheStudio.png',
    '/music-8589292_640.png',
    '/OIP.png',
    '/TharLU.png',
    '/Artboard-22.png'
  ];

  // Function to get random demo image based on service ID for consistency
  const getRandomDemoImage = (serviceId: string) => {
    const index = parseInt(serviceId.slice(-2), 16) % demoImages.length;
    return demoImages[index];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 to-dark-900 py-8 px-6">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="mb-6 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium flex items-center gap-2 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
          
          <div className="text-center mb-8">
            <div className="inline-block">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent mb-4">
                {service ? service.title : 'Service'} Freelancers
              </h1>
              <div className="h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full mx-auto w-24"></div>
            </div>
            {service && (
              <div className="text-green-400 text-lg mt-4">
                <span className="font-semibold">Category:</span> {service.category}
              </div>
            )}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="glass-effect rounded-2xl p-6 mb-8 border-0">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search freelancers, skills, or services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-dark-800/50 border border-green-200/20 rounded-xl text-white placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium flex items-center gap-2 transition-all duration-300"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-green-200/20">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Sort Options */}
                <div>
                  <label className="block text-green-400 font-medium mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="w-full px-4 py-3 bg-dark-800/50 border border-green-200/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2310b981' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 0.5rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.5em 1.5em',
                      paddingRight: '2.5rem'
                    }}
                  >
                    <option value="rating" className="bg-dark-800 text-white">Highest Rated</option>
                    <option value="price-low" className="bg-dark-800 text-white">Price: Low to High</option>
                    <option value="price-high" className="bg-dark-800 text-white">Price: High to Low</option>
                    <option value="reviews" className="bg-dark-800 text-white">Most Reviews</option>
                    <option value="completion" className="bg-dark-800 text-white">Highest Completion Rate</option>
                  </select>
                </div>

                {/* Filter Options */}
                <div>
                  <label className="block text-green-400 font-medium mb-2">Filter By</label>
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value as FilterOption)}
                    className="w-full px-4 py-3 bg-dark-800/50 border border-green-200/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2310b981' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 0.5rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.5em 1.5em',
                      paddingRight: '2.5rem'
                    }}
                  >
                    <option value="all" className="bg-dark-800 text-white">All Freelancers</option>
                    <option value="top-rated" className="bg-dark-800 text-white">Top Rated (4.5+)</option>
                    <option value="under-1000" className="bg-dark-800 text-white">Under ₹1,000</option>
                    <option value="under-2000" className="bg-dark-800 text-white">Under ₹2,000</option>
                    <option value="fast-delivery" className="bg-dark-800 text-white">Fast Delivery</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-green-400">
            Showing {filteredAndSortedServices.length} of {services.length} freelancers
          </p>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="text-center py-12 text-green-400">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedServices.map((service, i) => (
              <div
                key={service.id}
                className="group bg-white dark:bg-dark-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden transform hover:scale-105"
                onClick={() => {
                  if (service.freelancerid) {
                    navigate(`/freelancer/${service.freelancerid}`, { state: { service } });
                  }
                }}
              >
                {/* Gig Image */}
                <div className="relative">
                  <div className="w-full h-48 overflow-hidden">
                    <img
                      src={getRandomDemoImage(service.id)}
                      alt={service.title || service.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={e => { 
                        e.currentTarget.onerror = null; 
                        e.currentTarget.src = getRandomDemoImage(service.id); 
                      }}
                    />
                  </div>
                  {/* Avatar overlay */}
                  <div className="absolute -bottom-8 left-4">
                    <div className="relative">
                      <img
                        src={service.freelancer?.avatar || generateAvatarUrl(service.freelancer?.firstName, service.freelancer?.lastName, service.freelancer?.first_name, service.freelancer?.last_name)}
                        alt={service.freelancer?.first_name && service.freelancer?.last_name 
                          ? `${service.freelancer.first_name} ${service.freelancer.last_name}`
                          : service.freelancer?.first_name || 'Freelancer'}
                        className="w-16 h-16 rounded-full border-4 border-white dark:border-dark-800 shadow-lg cursor-pointer hover:scale-110 transition-transform duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (service.freelancer?.id) {
                            navigate(`/user/${service.freelancer.id}`);
                          }
                        }}
                        onError={e => { 
                          e.currentTarget.onerror = null; 
                          e.currentTarget.src = getRandomDemoImage(service.id); 
                        }}
                      />
                    </div>
                  </div>
                  {/* Price badge */}
                  <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    ₹{getLowestPrice(service)}
                  </div>
                </div>
                {/* Content */}
                <div className="p-6 pt-12">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                        {service.title || service.name}
                      </h3>
                      {/* Freelancer Name */}
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        by <span 
                          className="cursor-pointer hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (service.freelancer?.id) {
                              navigate(`/user/${service.freelancer.id}`);
                            }
                          }}
                        >
                          {(() => {
                            const firstName = service.freelancer?.first_name;
                            const lastName = service.freelancer?.last_name;
                            
                            if (firstName && lastName) {
                              return `${firstName} ${lastName}`;
                            } else if (firstName) {
                              return firstName;
                            } else {
                              return 'Freelancer';
                            }
                          })()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {service.freelancer?.reviewCount > 0 
                            ? `${service.freelancer?.rating?.toFixed(1)} (${service.freelancer?.reviewCount})`
                            : 'No reviews yet'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {service.description || service.tagline || ''}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {(service.freelancer?.skills || service.skills || []).slice(0, 3).map((skill: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* No results message */}
        {!loading && filteredAndSortedServices.length === 0 && (
          <div className="text-center py-12">
            <div className="text-green-400 text-xl font-medium mb-2">
              {services.length === 0 ? 'No freelancers found' : 'No results match your search'}
            </div>
            <p className="text-gray-400">
              {services.length === 0 ? 'No services available for this category' : 'Try adjusting your search or filters'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}; 
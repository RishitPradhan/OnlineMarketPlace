import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';

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

// Function to get random demo image based on index for consistency
const getRandomDemoImage = (index: number) => {
  return demoImages[index % demoImages.length];
};

const featuredProject = {
  id: 'featured-1',
  title: 'Professional Web Development',
  description: 'Modern, responsive website development with SEO optimization and mobile-first design.',
  banner: getRandomDemoImage(0),
  price: 1500,
  rating: 4.9,
  reviews: 127,
  delivery: '7 days',
  category: 'Web Development',
  skills: ['React', 'Node.js', 'UI/UX', 'Stripe', 'Responsive', 'Performance'],
  reviewList: [
    { name: 'Priya Sharma', rating: 5, comment: 'Outstanding work! The new site is fast and beautiful.', date: '2024-06-01' },
    { name: 'Rahul Verma', rating: 4.5, comment: 'Great attention to detail and user experience.', date: '2024-06-10' },
    { name: 'Aisha Khan', rating: 5, comment: 'Delivered on time and exceeded expectations.', date: '2024-06-15' },
  ]
};

export const FeaturedProject: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-green-50 dark:from-dark-950 dark:to-dark-900 py-8 px-0 relative">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 z-20 p-2 bg-green-600 text-white rounded-full shadow hover:bg-green-700 focus:outline-none"
        aria-label="Back"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div className="max-w-3xl mx-auto flex flex-col gap-8">
        {/* Banner */}
        <div className="w-full aspect-video rounded-xl overflow-hidden bg-white dark:bg-dark-800 shadow-md flex items-center justify-center">
          <img src={featuredProject.banner} alt="Project Banner" className="object-cover w-full h-full" />
        </div>
        {/* Title & Description */}
        <div>
          <h1 className="text-3xl font-bold text-green-700 dark:text-green-400 mb-2">{featuredProject.title}</h1>
          <p className="text-gray-700 dark:text-gray-200 mb-4">{featuredProject.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {featuredProject.skills.map(skill => (
              <span key={skill} className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">{skill}</span>
            ))}
          </div>
        </div>
        {/* Reviews */}
        <div>
          <h2 className="text-xl font-bold text-green-700 dark:text-green-400 mb-2">Reviews</h2>
          <div className="space-y-6">
            {featuredProject.reviewList.map((review, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center font-bold text-green-800">
                  {review.name[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 dark:text-white">{review.name}</span>
                    <span className="flex items-center text-yellow-500 text-xs font-semibold"><Star className="w-4 h-4 mr-1" /> {review.rating}</span>
                    <span className="text-xs text-gray-400">{review.date}</span>
                  </div>
                  <div className="text-gray-700 dark:text-gray-300 text-sm mt-1">{review.comment}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 
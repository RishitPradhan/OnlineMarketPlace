import React, { useState } from 'react';
import { Star, Clock, Edit, Trash, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { serviceManagement } from '../../lib/service-management';

interface Plan {
  name: string;
  price: number;
  desc: string;
  features: string[];
  delivery: string;
}

interface ServiceCardProps {
  service: any;
  onUpdate: () => void;
  isOwner: boolean;
}

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

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onUpdate, isOwner }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);

  // Clean image logic - handle all possible image field variations
  const images = Array.isArray(service.images) && service.images.length > 0
    ? service.images
    : (service.imageUrl || service.imageurl || service.image_url ? [service.imageUrl || service.imageurl || service.image_url] : []);

  const defaultThumb = getRandomDemoImage(service.id);

  // Parse plans and get the lowest price
  const getLowestPrice = () => {
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

  const lowestPrice = getLowestPrice();

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    setLoading(true);
    try {
      const response = await serviceManagement.deleteService(service.id);
      if (response.success) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error deleting service:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderNow = () => {
    navigate(`/orders/new?serviceId=${service.id}`);
  };

  return (
    <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden border border-green-100 dark:border-dark-700">
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={images[imgIdx] || defaultThumb}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = defaultThumb;
          }}
        />
        {images.length > 1 && (
          <>
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-green-50/90 dark:bg-dark-800 rounded-full p-1 shadow hover:bg-green-200 dark:hover:bg-green-600 transition"
              onClick={e => { e.stopPropagation(); setImgIdx((imgIdx - 1 + images.length) % images.length); }}
            >
              <ChevronLeft className="w-5 h-5 text-green-700 dark:text-green-200" />
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-50/90 dark:bg-dark-800 rounded-full p-1 shadow hover:bg-green-200 dark:hover:bg-green-600 transition"
              onClick={e => { e.stopPropagation(); setImgIdx((imgIdx + 1) % images.length); }}
            >
              <ChevronRight className="w-5 h-5 text-green-700 dark:text-green-200" />
            </button>
            {/* Carousel indicators */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_: any, i: number) => (
                <span key={i} className={`w-2 h-2 rounded-full ${i === imgIdx ? 'bg-green-600 dark:bg-green-400' : 'bg-green-200 dark:bg-dark-700'} transition-all`}></span>
              ))}
            </div>
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 line-clamp-2">
            {service.title}
          </h3>
          <span className="inline-block bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 px-2 py-1 rounded-full text-xs font-semibold">
            {service.category}
          </span>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
          {service.description}
        </p>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              {service.rating || 4.8}
            </span>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            ({service.reviewCount || 12} reviews)
          </span>
        </div>

        {/* Price and Delivery */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-green-600 dark:text-green-400">
              ₹{lowestPrice}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">starting from</span>
          </div>
          
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{service.deliveryTime || service.deliverytime || '7 days'}</span>
          </div>
        </div>

        {/* Action Buttons */}
        {isOwner ? (
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/services/edit/${service.id}`)}
              disabled={loading}
              className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              <Edit className="w-4 h-4 inline mr-1" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleOrderNow}
            className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition"
          >
            Order Now
          </button>
        )}
      </div>
    </div>
  );
};

export default ServiceCard;
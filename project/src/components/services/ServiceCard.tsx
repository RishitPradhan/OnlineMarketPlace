import { Card, CardContent, CardFooter, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Clock, DollarSign, Edit, Trash, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { serviceManagement } from '../../lib/service-management';
import ServiceForm from './ServiceForm';
import { useNavigate } from 'react-router-dom';

interface ServiceCardProps {
  service: any;
  onUpdate: () => void;
  isOwner: boolean;
}

export default function ServiceCard({ service, onUpdate, isOwner }: ServiceCardProps) {
  console.log('ServiceCard data:', service);
  const navigate = useNavigate();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  // New: image carousel
  const images = service.images && service.images.length > 0 ? service.images : (service.imageUrl ? [service.imageUrl] : []);
  const [imgIdx, setImgIdx] = useState(0);
  // New: FAQ
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  // New: plans/packages
  const plans = service.plans || [];
  // New: faqs
  const faqs = service.faqs || [];

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

  const handleServiceUpdated = () => {
    setShowEditDialog(false);
    onUpdate();
  };

  const handleOrderNow = () => {
    navigate(`/orders/new?serviceId=${service.id}`);
  };

  return (
    <Card className="overflow-hidden shadow-xl rounded-2xl border border-green-200 bg-white dark:bg-dark-900 hover:shadow-2xl transition-shadow duration-300">
      {/* Image carousel */}
      {images.length > 0 && (
        <div className="relative aspect-video w-full overflow-hidden group">
          <img
            src={images[imgIdx]}
            alt={service.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 rounded-t-2xl"
          />
          {images.length > 1 && (
            <>
              <button
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-dark-800 rounded-full p-1 shadow hover:bg-green-100 dark:hover:bg-green-700 transition"
                onClick={e => { e.stopPropagation(); setImgIdx((imgIdx - 1 + images.length) % images.length); }}
              >
                <ChevronLeft className="w-5 h-5 text-green-700 dark:text-green-200" />
              </button>
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-dark-800 rounded-full p-1 shadow hover:bg-green-100 dark:hover:bg-green-700 transition"
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
        </div>
      )}
      <CardHeader className="space-y-2 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold text-green-900 dark:text-green-200 mb-1 leading-tight">{service.title}</h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">by <span className="font-semibold text-green-700 dark:text-green-300">{service.freelancer?.firstName} {service.freelancer?.lastName}</span></p>
          </div>
          <span className="inline-block bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 px-3 py-1 rounded-full text-xs font-semibold shadow">{service.category}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <p className="text-gray-800 dark:text-gray-200 text-base line-clamp-3 mb-2">{service.description}</p>
        {/* Plans/Packages */}
        {plans.length > 0 && (
          <div className="mb-4">
            <h4 className="font-bold text-green-700 dark:text-green-300 mb-2 text-lg">Plans</h4>
            <div className="flex flex-col gap-3">
              {plans.map((plan: any, i: number) => (
                <div key={i} className="border border-green-200 dark:border-green-700 rounded-xl p-4 bg-green-50 dark:bg-dark-800 shadow-sm hover:shadow-md transition">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-green-700 dark:text-green-200 text-base">{plan.name}</span>
                    <span className="font-bold text-green-700 dark:text-green-200 text-lg">₹{plan.price}</span>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 mb-1">{plan.desc}</div>
                  <div className="flex flex-wrap gap-1 mb-1">
                    {plan.features && plan.features.split(',').map((f: string, idx: number) => (
                      <span key={idx} className="bg-green-200 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-0.5 rounded-full text-xs font-medium shadow-sm">{f.trim()}</span>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Delivery: {plan.delivery}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex items-center space-x-4 text-sm text-gray-700 dark:text-gray-300">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-green-500" />
            <span className="font-semibold text-green-700">{service.deliveryTime}</span> days delivery
          </div>
          <div className="flex items-center font-semibold text-green-700">
            <DollarSign className="h-4 w-4 mr-1" />
            <span className="text-lg">{service.price?.toFixed ? service.price.toFixed(2) : service.price}</span>
          </div>
        </div>
        {service.tags && service.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {service.tags.map((tag: string) => (
              <span key={tag} className="inline-block border border-green-300 text-green-700 px-3 py-1 rounded-full text-xs font-medium bg-green-50 shadow-sm">{tag}</span>
            ))}
          </div>
        )}
        {/* FAQ Section */}
        {faqs.length > 0 && (
          <div className="mt-4">
            <h4 className="font-bold text-green-700 mb-2 text-lg">FAQs</h4>
            <div className="divide-y divide-green-100 dark:divide-dark-700 rounded-xl overflow-hidden">
              {faqs.map((faq: any, i: number) => (
                <div key={i}>
                  <button className="w-full flex items-center justify-between py-3 px-2 text-left font-medium text-gray-800 dark:text-gray-200 focus:outline-none bg-green-50 hover:bg-green-100 transition" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span>{faq.q}</span>
                    {openFaq === i ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  <div className={`transition-all duration-300 overflow-hidden ${openFaq === i ? 'max-h-40 opacity-100 py-2 px-4 bg-white' : 'max-h-0 opacity-0 py-0 px-4'}`}>
                    {openFaq === i && <div className="text-gray-600 dark:text-gray-300 text-sm">{faq.a}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-4 border-t bg-gradient-to-r from-green-50 to-green-100">
        {isOwner ? (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEditDialog(true)}
              disabled={loading}
              className="border-green-500 text-green-700 hover:bg-green-100 hover:text-green-900 shadow"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-500 text-white hover:bg-red-600 shadow border-none"
            >
              <Trash className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        ) : (
          <Button onClick={handleOrderNow} className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2 rounded-lg shadow">
            Order Now
          </Button>
        )}
      </CardFooter>
      {/* Edit dialog/modal can be implemented here if needed */}
      {showEditDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => setShowEditDialog(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Edit Service</h2>
            <ServiceForm
              service={service}
              onSuccess={handleServiceUpdated}
              onCancel={() => setShowEditDialog(false)}
            />
          </div>
        </div>
      )}
    </Card>
  );
}
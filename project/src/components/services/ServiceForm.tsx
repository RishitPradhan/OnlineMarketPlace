'use client';

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { serviceManagement } from '../../lib/service-management';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Listbox } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';

// Replace the categories array with a deduplicated, sorted list from all sources
const categories = Array.from(new Set([
  // From BrowseServicesPage
  'Web Development', 'Mobile App Development', 'Graphic Design', 'Content Writing', 'Digital Marketing', 'Video Production', 'SEO', 'UI/UX Design', 'Voice Over', 'Translation', 'Business Consulting', 'Social Media Management', 'E-Commerce Development', 'Data Analysis', 'Game Development', 'Music & Audio', 'Presentation Design', 'Legal Consulting', 'Virtual Assistant', 'Branding',
  // From HomePage
  'Audio & Music', 'Digital Art', 'SEO Optimization', 'App Prototyping',
  // From PortfolioPage
  'Mobile Development', 'UI/UX Design', 'Other',
  // From Dashboard featuredWorks
  'App Development', 'Animation', 'Design', 'Business', 'Languages',
  // From your previous static list
  'Design & Creative', 'Development & IT', 'Writing & Translation', 'Marketing & Sales', 'Business & Finance', 'Music & Audio', 'Video & Animation'
])).sort();

interface ServiceFormProps {
  service?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ServiceForm({ service, onSuccess, onCancel }: ServiceFormProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New: plans/packages
  const [plans, setPlans] = useState([
    { name: 'Basic', price: '', desc: '', features: '', delivery: '' },
    { name: 'Standard', price: '', desc: '', features: '', delivery: '' },
    { name: 'Premium', price: '', desc: '', features: '', delivery: '' },
  ]);
  // New: FAQ
  const [faqs, setFaqs] = useState([{ q: '', a: '' }]);
  // New: images
  const [images, setImages] = useState([service?.imageUrl || '']);

  const [formData, setFormData] = useState({
    title: service?.title || '',
    description: service?.description || '',
    category: service?.category || '',
    price: service?.price?.toString() || '',
    deliveryTime: service?.deliveryTime?.toString() || '',
    imageUrl: service?.imageUrl || '',
    tags: service?.tags?.join(', ') || ''
  });

  const handlePlanChange = (idx: number, field: string, value: string) => {
    setPlans(prev => prev.map((p, i) => i === idx ? { ...p, [field]: value } : p));
  };
  const handleFaqChange = (idx: number, field: string, value: string) => {
    setFaqs(prev => prev.map((f, i) => i === idx ? { ...f, [field]: value } : f));
  };
  const addFaq = () => setFaqs(prev => [...prev, { q: '', a: '' }]);
  const removeFaq = (idx: number) => setFaqs(prev => prev.filter((_, i) => i !== idx));
  const handleImageChange = (idx: number, value: string) => {
    setImages(prev => prev.map((img, i) => i === idx ? value : img));
  };
  const addImage = () => setImages(prev => [...prev, '']);
  const removeImage = (idx: number) => setImages(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const serviceData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        deliveryTime: parseInt(formData.deliveryTime),
        imageUrl: images[0] || undefined,
        images: images.filter(Boolean),
        tags: formData.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean),
        freelancerId: user.id,
        isActive: true,
        plans,
        faqs
      };
      const response = service
        ? await serviceManagement.updateService(service.id, serviceData)
        : await serviceManagement.createService(serviceData);
      if (response.success) {
        // After successful upload, navigate to /service for the selected category
        navigate('/service', { state: { service: { title: formData.category, category: formData.category } } });
        if (onSuccess) onSuccess();
      } else {
        throw new Error(response.error || 'Failed to save service');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-bold text-green-900 dark:text-green-200">Title</label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="e.g., Professional Logo Design"
          required
        />
      </div>

      <div className="space-y-2">
        <div className="relative">
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder=" "
            required
            className="block w-full rounded-md border border-green-300 bg-green-50 dark:bg-dark-800 py-3 px-4 text-green-900 dark:text-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-all shadow-sm resize-none min-h-[100px] peer"
          />
          <label htmlFor="description" className="absolute left-4 top-1.5 text-xs text-green-700 dark:text-green-300 bg-green-50 dark:bg-dark-800 px-1 pointer-events-none transition-all duration-200 peer-focus:-top-3 peer-focus:text-xs peer-focus:text-green-700 dark:peer-focus:text-green-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base">Description</label>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex-1 space-y-2">
          <label htmlFor="category" className="block text-sm font-bold text-green-900 dark:text-green-200 mb-1">Category</label>
          <Listbox value={formData.category} onChange={value => handleChange('category', value)}>
            {({ open }: { open: boolean }) => (
              <div className="relative">
                <Listbox.Button className="block w-full h-[48px] rounded-md border border-green-300 bg-green-50 dark:bg-dark-800 py-3 px-4 text-left text-green-900 dark:text-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-all shadow-sm appearance-none font-normal">
                  {formData.category || 'Select category'}
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-700 dark:text-green-200 pointer-events-none">▼</span>
                </Listbox.Button>
                <Listbox.Options className="absolute z-50 mt-2 w-full rounded-md bg-white dark:bg-dark-800 shadow-lg border border-green-200 dark:border-dark-700 max-h-60 overflow-auto focus:outline-none">
                  {categories.map((category) => (
                    <Listbox.Option
                      key={category}
                      value={category}
                      className={({ active, selected }: { active: boolean; selected: boolean }) =>
                        `cursor-pointer select-none relative py-2 pl-10 pr-4 ${
                          active ? 'bg-green-100 dark:bg-green-700 text-green-900 dark:text-green-100' : 'text-green-900 dark:text-green-200'
                        } ${selected ? 'font-bold' : ''}`
                      }
                    >
                      {({ selected }: { selected: boolean }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-bold' : ''}`}>{category}</span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-green-600 dark:text-green-300">✓</span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            )}
          </Listbox>
        </div>
        <div className="flex-1 space-y-2">
          <label htmlFor="price" className="block text-sm font-bold text-green-900 dark:text-green-200 mb-1">Price ($)</label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.01"
            required
            className="h-[48px]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="deliveryTime" className="block text-sm font-bold text-green-900 dark:text-green-200">Delivery Time (days)</label>
          <Input
            id="deliveryTime"
            type="number"
            value={formData.deliveryTime}
            onChange={(e) => handleChange('deliveryTime', e.target.value)}
            placeholder="1"
            min="1"
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="imageUrl" className="block text-sm font-bold text-green-900 dark:text-green-200">Image URL</label>
          <Input
            id="imageUrl"
            type="url"
            value={formData.imageUrl}
            onChange={(e) => handleChange('imageUrl', e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="tags" className="block text-sm font-bold text-green-900 dark:text-green-200">Tags (comma-separated)</label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => handleChange('tags', e.target.value)}
          placeholder="e.g., logo, branding, design"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-bold text-green-900 dark:text-green-200">Gig Images (URLs)</label>
        {images.map((img, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <Input
              type="url"
              value={img}
              onChange={e => handleImageChange(i, e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
            {images.length > 1 && (
              <Button type="button" variant="outline" onClick={() => removeImage(i)}>-</Button>
            )}
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addImage}>+ Add Image</Button>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-bold text-green-900 dark:text-green-200">Plans/Packages</label>
        {plans.map((plan, i) => (
          <div key={i} className="border rounded-lg p-4 mb-2">
            <div className="flex gap-2 mb-2">
              <Input
                value={plan.name}
                onChange={e => handlePlanChange(i, 'name', e.target.value)}
                placeholder="Plan Name (e.g., Basic)"
                className="w-1/3"
              />
              <Input
                value={plan.price}
                onChange={e => handlePlanChange(i, 'price', e.target.value)}
                placeholder="Price"
                type="number"
                className="w-1/3"
              />
              <Input
                value={plan.delivery}
                onChange={e => handlePlanChange(i, 'delivery', e.target.value)}
                placeholder="Delivery (e.g., 3 days)"
                className="w-1/3"
              />
            </div>
            <Input
              value={plan.desc}
              onChange={e => handlePlanChange(i, 'desc', e.target.value)}
              placeholder="Description"
              className="mb-2"
            />
            <Input
              value={plan.features}
              onChange={e => handlePlanChange(i, 'features', e.target.value)}
              placeholder="Features (comma separated)"
            />
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-bold text-green-900 dark:text-green-200">FAQs</label>
        {faqs.map((faq, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <Input
              value={faq.q}
              onChange={e => handleFaqChange(i, 'q', e.target.value)}
              placeholder="Question"
              className="w-1/2"
            />
            <Input
              value={faq.a}
              onChange={e => handleFaqChange(i, 'a', e.target.value)}
              placeholder="Answer"
              className="w-1/2"
            />
            {faqs.length > 1 && (
              <Button type="button" variant="outline" onClick={() => removeFaq(i)}>-</Button>
            )}
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addFaq}>+ Add FAQ</Button>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : service ? 'Update Service' : 'Create Service'}
        </Button>
      </div>
    </form>
  );
}
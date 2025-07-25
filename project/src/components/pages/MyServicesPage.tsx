import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import ServiceCard from '../services/ServiceCard';

export default function MyServicesPage() {
  const { user } = useAuth();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from('services')
      .select('*')
      .eq('freelancerid', user.id)
      .eq('isactive', true)
      .then(({ data, error }) => {
        setServices(data || []);
        setError(error ? error.message : null);
        setLoading(false);
      });
  }, [user]);

  if (loading) return <div className="text-center py-12 text-green-400">Loading...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;
  if (services.length === 0) return <div className="text-center py-12 text-green-400">You have not created any services yet.</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">My Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map(service => (
          <ServiceCard
            key={service.id}
            service={service}
            onUpdate={() => {
              // Remove deleted service from list
              setServices(s => s.filter(sv => sv.id !== service.id));
            }}
            isOwner={true}
          />
        ))}
      </div>
    </div>
  );
} 
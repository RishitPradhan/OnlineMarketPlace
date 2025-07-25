import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ServiceForm from '../services/ServiceForm';
import { supabase } from '../../lib/supabase';

export default function EditServicePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          setError(error.message);
          setService(null);
        } else {
          setService(data);
        }
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-center py-12 text-green-400">Loading...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;
  if (!service) return <div className="text-center py-12 text-green-400">Service not found.</div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Edit Service</h1>
      <ServiceForm
        service={service}
        onSuccess={() => navigate('/services')}
        onCancel={() => navigate('/services')}
      />
    </div>
  );
} 
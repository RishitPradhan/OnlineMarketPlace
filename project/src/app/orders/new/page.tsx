'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { serviceManagement } from '@/lib/service-management';
import { orderManagement } from '@/lib/order-management';
import { paymentManagement } from '@/lib/payment-management';
import { Service } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { Elements } from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '@/components/payments/PaymentForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function NewOrderPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get('serviceId');

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requirements, setRequirements] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [receiverId, setReceiverId] = useState<string | null>(null);

  useEffect(() => {
    if (serviceId) {
      loadService();
    }
  }, [serviceId]);

  const loadService = async () => {
    if (!serviceId) return;

    setLoading(true);
    try {
      const response = await serviceManagement.getService(serviceId);
      if (response.success) {
        setService(response.data);
      } else {
        throw new Error(response.error || 'Failed to load service');
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async () => {
    if (!user || !service) return;

    try {
      const orderResponse = await orderManagement.createOrder({
        serviceId: service.id,
        clientId: user.id,
        freelancerId: service.freelancerId,
        amount: service.price,
        requirements,
        deliveryDate: new Date(
          Date.now() + service.deliveryTime * 24 * 60 * 60 * 1000
        ).toISOString()
      });

      if (!orderResponse.success) {
        throw new Error(orderResponse.error || 'Failed to create order');
      }

      setOrderId(orderResponse.data.id); // Store the new order ID
      setReceiverId(service.freelancerId); // Store the freelancer's user ID
      setShowPayment(true);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handlePaymentSuccess = () => {
    router.push('/orders/my-orders');
  };

  if (!user) {
    return <div>Please log in to place an order.</div>;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !service) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {error || 'Service not found'}
        </AlertDescription>
      </Alert>
    );
  }

  if (user.id === service.freelancerId) {
    return (
      <Alert>
        <AlertDescription>
          You cannot order your own service.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Place Order</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-semibold">${service.price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Delivery Time</p>
                  <p className="font-semibold">{service.deliveryTime} days</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Freelancer</p>
                <p className="font-semibold">
                  {service.freelancer?.firstName} {service.freelancer?.lastName}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {!showPayment ? (
            <Card>
              <CardHeader>
                <CardTitle>Order Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Describe your requirements in detail..."
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  rows={6}
                />

                <Button
                  onClick={handleCreateOrder}
                  className="w-full"
                  disabled={!requirements.trim()}
                >
                  Continue to Payment
                </Button>
              </CardContent>
            </Card>
          ) : (
            showPayment && orderId && receiverId && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <Elements stripe={stripePromise}>
                    <PaymentForm
                      onSuccess={handlePaymentSuccess}
                      orderId={orderId}
                      receiverId={receiverId}
                      amount={service.price * 100} // pass in cents
                    />
                  </Elements>
                </CardContent>
              </Card>
            )
          )}
        </div>
      </div>
    </div>
  );
}
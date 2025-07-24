'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { paymentManagement } from '@/lib/payment-management';
import { CardElement, useStripe, useElements } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PaymentFormProps {
  onSuccess: () => void;
  orderId: string;
  receiverId: string;
  amount: number;
}

export default function PaymentForm({ onSuccess, orderId, receiverId, amount }: PaymentFormProps) {
  const { user } = useAuth();
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !user) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    setLoading(true);
    setError(null);

    try {
      // Create payment record and get client secret
      const paymentResponse = await paymentManagement.initiatePayment({
        amount, // already in cents
        paymentMethod: 'card',
        orderId,
        payerId: user.id,
        receiverId,
        paymentDetails: {}
      });

      if (!paymentResponse.success || !paymentResponse.data?.clientSecret) {
        throw new Error(paymentResponse.error || 'Failed to initiate payment');
      }

      // Confirm card payment
      const { error: stripeError } = await stripe.confirmCardPayment(
        paymentResponse.data.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              email: user.email,
              name: `${user.firstName} ${user.lastName}`
            }
          }
        }
      );

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      setSuccess(true);
      onSuccess();

      // Reset form
      cardElement.clear();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>Payment processed successfully!</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label>Card Details</Label>
        <div className="border rounded-md p-3">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4'
                  }
                },
                invalid: {
                  color: '#9e2146'
                }
              }
            }}
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={!stripe || loading}
        className="w-full"
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </Button>
    </form>
  );
}
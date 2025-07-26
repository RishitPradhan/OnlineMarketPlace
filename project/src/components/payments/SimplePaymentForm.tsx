'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { paymentManagement } from '@/lib/payment-management';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface SimplePaymentFormProps {
  onSuccess: () => void;
}

export default function SimplePaymentForm({ onSuccess }: SimplePaymentFormProps) {
  const { user } = useAuth();
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [amount, setAmount] = useState('');
  const [receiverEmail, setReceiverEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !user || !amount || !receiverEmail) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    setLoading(true);
    setError(null);

    try {
      // For demo purposes, we'll use a dummy order ID and receiver ID
      const dummyOrderId = `order_${Date.now()}`;
      const dummyReceiverId = `receiver_${Date.now()}`;

      // Create payment record and get client secret
      const paymentResponse = await paymentManagement.initiatePayment({
        amount: parseFloat(amount) * 100, // Convert to cents
        paymentMethod: 'card',
        orderId: dummyOrderId,
        payerId: user.id,
        receiverId: dummyReceiverId,
        paymentDetails: { receiverEmail }
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
      setAmount('');
      setReceiverEmail('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          Payment processed successfully!
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Amount (USD)
        </label>
        <Input
          type="number"
          step="0.01"
          min="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Receiver Email
        </label>
        <Input
          type="email"
          value={receiverEmail}
          onChange={(e) => setReceiverEmail(e.target.value)}
          placeholder="Enter receiver email"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Card Details
        </label>
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
        disabled={!stripe || loading || !amount || !receiverEmail}
        className="w-full"
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </Button>
    </form>
  );
} 
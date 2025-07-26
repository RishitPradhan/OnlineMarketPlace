'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { paymentManagement } from '@/lib/payment-management';
import { Payment, PaymentStatus } from '@/types';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import SimplePaymentForm from '@/components/payments/SimplePaymentForm';
import TransactionHistory from '@/components/payments/TransactionHistory';
import PaymentStats from '@/components/payments/PaymentStats';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Simple loading and error components
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-32">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
);

const ErrorAlert = ({ message }: { message: string }) => (
  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
    {message}
  </div>
);

export default function PaymentsPage() {
  const { user } = useAuth();
  const [activePayments, setActivePayments] = useState<Payment[]>([]);
  const [completedPayments, setCompletedPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus>('pending');

  const loadPayments = async () => {
    try {
      setLoading(true);
      const { data, error } = await paymentManagement.listPayments(
        user?.id!, 
        'sent',
        selectedStatus
      );
      if (error) throw error;
      
      if (data) {
        setActivePayments(data.filter(p => p.status === 'pending'));
        setCompletedPayments(data.filter(p => p.status === 'completed'));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) loadPayments();
  }, [user, selectedStatus]);

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'processing':
        return 'text-blue-600';
      case 'failed':
        return 'text-red-600';
      case 'refunded':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  if (!user) {
    return <div>Please log in to view payments.</div>;
  }

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div className="p-6">
      <div className="mb-6 flex gap-4">
        {['pending', 'completed', 'failed'].map(status => (
          <Button
            key={status}
            variant={selectedStatus === status ? 'primary' : 'outline'}
            onClick={() => setSelectedStatus(status as PaymentStatus)}
          >
            {status}
          </Button>
        ))}
      </div>
      
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Payments & Transactions</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <PaymentStats
            totalTransactions={completedPayments.length + activePayments.length}
            pendingAmount={activePayments.reduce((sum, payment) => sum + payment.amount, 0)}
            completedAmount={completedPayments.reduce((sum, payment) => 
              payment.status === 'completed' ? sum + payment.amount : sum, 0
            )}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Make Payment Section */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Make a Payment</h3>
            </CardHeader>
            <CardContent>
              <Elements stripe={stripePromise}>
                <SimplePaymentForm onSuccess={loadPayments} />
              </Elements>
            </CardContent>
          </Card>

          {/* Active Payments Section */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Active Payments</h3>
            </CardHeader>
            <CardContent>
              <TransactionHistory
                payments={activePayments}
                getStatusColor={getStatusColor}
                loading={loading}
              />
            </CardContent>
          </Card>
        </div>

        {/* Payment History Section */}
        <Card className="mt-8">
          <CardHeader>
            <h3 className="text-lg font-semibold">Payment History</h3>
          </CardHeader>
          <CardContent>
            <TransactionHistory
              payments={completedPayments}
              getStatusColor={getStatusColor}
              loading={loading}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
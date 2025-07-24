'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { paymentManagement } from '@/lib/payment-management';
import { Payment, PaymentStatus } from '@/types';
import { Elements } from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '@/components/payments/PaymentForm';
import TransactionHistory from '@/components/payments/TransactionHistory';
import PaymentStats from '@/components/payments/PaymentStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorAlert } from '@/components/ui/error-alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Add proper type for payment status filter
const PaymentStatusValues = ['pending', 'completed', 'failed'] as const;

// Ensure environment variables are properly typed
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
      SUPABASE_URL: string;
      SUPABASE_ANON_KEY: string;
    }
  }
}

// Add proper error boundaries
const PaymentErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Payment Error:', error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  return hasError ? (
    <ErrorAlert message="Payment system unavailable - please try again later" />
  ) : (
    <>{children}</>
  );
};

export default function PaymentsPage() {
  const { user } = useAuth();
  const [activePayments, setActivePayments] = useState<Payment[]>([]);
  const [completedPayments, setCompletedPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadPayments = async () => {
      try {
        setLoading(true);
        const { data, error } = await paymentManagement.listPayments(user?.id!, 'sent');
        if (error) throw error;
        setActivePayments(data.filter(p => p.status === 'pending'));
        setCompletedPayments(data.filter(p => p.status === 'completed'));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load payments');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) loadPayments();
  }, [user]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

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

  // Add state for status filtering
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus>('pending');

  // Update payment loading logic with status filter
  useEffect(() => {
    const loadPayments = async () => {
      try {
        const { data, error } = await paymentManagement.listPayments(
          user?.id!, 
          'sent',
          selectedStatus
        );
        if (error) throw error;
        setActivePayments(data.filter(p => p.status === 'pending'));
        setCompletedPayments(data.filter(p => p.status === 'completed'));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load payments');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) loadPayments();
  }, [user, selectedStatus]);

  // Add status filter UI
  return (
    <div className="p-6">
      <div className="mb-6 flex gap-4">
        {PaymentStatusValues.map(status => (
          <Button
            key={status}
            variant={selectedStatus === status ? 'default' : 'outline'}
            onClick={() => setSelectedStatus(status)}
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

        <Tabs defaultValue="make-payment" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="make-payment">Make Payment</TabsTrigger>
            <TabsTrigger value="active">Active Payments</TabsTrigger>
            <TabsTrigger value="history">Payment History</TabsTrigger>
          </TabsList>

          <TabsContent value="make-payment">
            <Card>
              <CardHeader>
                <CardTitle>Make a Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <Elements stripe={stripePromise}>
                  <PaymentForm onSuccess={loadPayments} />
                </Elements>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active">
            <Card>
              <CardHeader>
                <CardTitle>Active Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <TransactionHistory
                  payments={activePayments}
                  getStatusColor={getStatusColor}
                  loading={loading}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                <TransactionHistory
                  payments={completedPayments}
                  getStatusColor={getStatusColor}
                  loading={loading}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
}
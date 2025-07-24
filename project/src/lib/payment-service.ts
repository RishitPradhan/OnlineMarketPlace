import { supabase } from './supabase';
import { loadStripe } from '@stripe/stripe-js';
import type { PaymentMethod, PaymentStatus } from '../types';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export interface PaymentDetails {
  orderId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  payerId: string;
  receiverId: string;
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  transactionId?: string;
  error?: string;
  status: PaymentStatus;
}

export const paymentService = {
  async initializePayment(details: PaymentDetails): Promise<PaymentResult> {
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to initialize');
      // Add error boundary for missing Stripe elements
      const { error: supabaseError } = await supabase
        .from('payments')
        .insert({
          order_id: details.orderId,
          payer_id: details.payerId,
          receiver_id: details.receiverId,
          amount: details.amount,
          payment_method: details.paymentMethod,
          status: 'pending',
          payment_details: {}
        })
        .select()
        .single();

      if (dbError || !payment) {
        throw new Error(dbError?.message || 'Failed to create payment record');
      }

      // Create Stripe payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: details.amount * 100, // Convert to cents
          payment_id: payment.id,
        }),
      });

      const { clientSecret, error: stripeError } = await response.json();
      if (stripeError) {
        throw new Error(stripeError);
      }

      // Confirm card payment
      const { error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: details.paymentMethod === 'card' ? details.paymentMethod : undefined,
          billing_details: {
            email: details.payerId // User's email
          }
        }
      });

      if (confirmError) {
        // Update payment status to failed
        await supabase
          .from('payments')
          .update({
            status: 'failed',
            payment_details: { error: confirmError.message }
          })
          .eq('id', payment.id);

        return {
          success: false,
          paymentId: payment.id,
          error: confirmError.message,
          status: 'failed'
        };
      }

      // Update payment status to completed
      const { data: updatedPayment, error: updateError } = await supabase
        .from('payments')
        .update({
          status: 'completed',
          transaction_id: clientSecret.split('_secret_')[0],
          payment_details: { clientSecret }
        })
        .eq('id', payment.id)
        .select()
        .single();

      if (updateError || !updatedPayment) {
        throw new Error(updateError?.message || 'Failed to update payment status');
      }

      return {
        success: true,
        paymentId: updatedPayment.id,
        transactionId: updatedPayment.transaction_id,
        status: 'completed'
      };
    } catch (error) {
      console.error('Payment processing error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment processing failed',
        status: 'failed'
      };
    }
  },

  async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    const { data: payment, error } = await supabase
      .from('payments')
      .select('status')
      .eq('id', paymentId)
      .single();

    if (error || !payment) {
      throw new Error(error?.message || 'Payment not found');
    }

    return payment.status;
  },

  async getPaymentHistory(userId: string) {
    const { data: payments, error } = await supabase
      .from('payments')
      .select(`
        *,
        orders (*),
        payer:payer_id (*),
        receiver:receiver_id (*)
      `)
      .or(`payer_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return payments;
  },

  async processRefund(paymentId: string): Promise<PaymentResult> {
    try {
      const { data: payment, error: fetchError } = await supabase
        .from('payments')
        .select('*')
        .eq('id', paymentId)
        .single();

      if (fetchError || !payment) {
        throw new Error(fetchError?.message || 'Payment not found');
      }

      // Call Stripe refund API
      const response = await fetch('/api/refund-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_id: paymentId,
          transaction_id: payment.transaction_id
        }),
      });

      const { success, error: refundError } = await response.json();
      if (!success) {
        throw new Error(refundError || 'Refund failed');
      }

      // Update payment status to refunded
      const { data: updatedPayment, error: updateError } = await supabase
        .from('payments')
        .update({
          status: 'refunded',
          payment_details: { ...payment.payment_details, refunded: true }
        })
        .eq('id', paymentId)
        .select()
        .single();

      if (updateError || !updatedPayment) {
        throw new Error(updateError?.message || 'Failed to update refund status');
      }

      return {
        success: true,
        paymentId: updatedPayment.id,
        transactionId: updatedPayment.transaction_id,
        status: 'refunded'
      };
    } catch (error) {
      console.error('Refund processing error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Refund processing failed',
        status: 'failed'
      };
    }
  }
};
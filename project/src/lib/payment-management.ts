import { supabase } from "./supabase";
import type { ApiResponse, Payment, PaymentStatus, EarningsSummary } from "../types";
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export const paymentManagement = {
  async initiatePayment(payment: Omit<Payment, 'id' | 'status' | 'transactionId' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<{ clientSecret: string }>> {
    try {
      // Create a payment intent with Stripe
      const response = await fetch('http://localhost:3001/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: payment.amount,
          paymentMethod: payment.paymentMethod,
          orderId: payment.orderId,
          payerId: payment.payerId,
          receiverId: payment.receiverId
        }),
      });

      const { clientSecret, error } = await response.json();

      if (error) throw new Error(error.message);

      // Create a payment record in Supabase
      const { data: paymentData, error: dbError } = await supabase
        .from('payments')
        .insert([{
          order_id: payment.orderId,
          payer_id: payment.payerId,
          receiver_id: payment.receiverId,
          amount: payment.amount,
          payment_method: payment.paymentMethod,
          status: 'pending',
          payment_details: payment.paymentDetails,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (dbError) throw dbError;

      return {
        success: true,
        data: { clientSecret }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  async updatePaymentStatus(id: string, status: PaymentStatus, transactionId?: string): Promise<ApiResponse<Payment>> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .update({
          status,
          transactionId,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: this.mapPaymentFromDB(data)
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  async getPayment(id: string): Promise<ApiResponse<Payment>> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          order:order_id(*),
          payer:payer_id(id, firstName, lastName, avatar),
          receiver:receiver_id(id, firstName, lastName, avatar)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      return {
        success: true,
        data: this.mapPaymentFromDB(data)
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  async listPayments(userId: string, type: 'sent' | 'received', status?: PaymentStatus): Promise<ApiResponse<Payment[]>> {
    try {
      let query = supabase
        .from('payments')
        .select(`
          *,
          order:order_id(*),
          payer:payer_id(id, firstName, lastName, avatar),
          receiver:receiver_id(id, firstName, lastName, avatar)
        `)
        .eq(type === 'sent' ? 'payer_id' : 'receiver_id', userId);
  
      if (status) {
        query = query.eq('status', status);
      }
  
      const { data, error } = await query;
      if (error) throw error;
  
      return {
        success: true,
        data: data.map(this.mapPaymentFromDB)
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment list failed'
      };
    }
  },

  async getEarningsSummary(userId: string): Promise<ApiResponse<EarningsSummary>> {
    try {
      const { data: payments, error } = await supabase
        .from('payments')
        .select('amount, status, created_at')
        .eq('receiver_id', userId);

      if (error) throw error;

      const monthlyEarnings: { [key: string]: number } = {};
      let totalEarnings = 0;
      let pendingPayments = 0;
      let completedPayments = 0;

      payments.forEach(payment => {
        const month = new Date(payment.created_at).toISOString().slice(0, 7);
        
        if (payment.status === 'completed') {
          totalEarnings += payment.amount;
          completedPayments += payment.amount;
          monthlyEarnings[month] = (monthlyEarnings[month] || 0) + payment.amount;
        } else if (payment.status === 'pending' || payment.status === 'processing') {
          pendingPayments += payment.amount;
        }
      });

      const summary: EarningsSummary = {
        totalEarnings,
        pendingPayments,
        completedPayments,
        monthlyEarnings: Object.entries(monthlyEarnings)
          .map(([month, amount]) => ({ month, amount }))
          .sort((a, b) => b.month.localeCompare(a.month))
      };

      return {
        success: true,
        data: summary
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  mapPaymentFromDB(data: any): Payment {
    return {
      id: data.id,
      orderId: data.order_id,
      payerId: data.payer_id,
      receiverId: data.receiver_id,
      amount: data.amount,
      paymentMethod: data.payment_method,
      status: data.status,
      transactionId: data.transaction_id,
      paymentDetails: data.payment_details,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      order: data.order,
      payer: data.payer,
      receiver: data.receiver
    };
  }
};
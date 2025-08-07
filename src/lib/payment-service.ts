import { supabase } from './supabase';

export interface PaymentMethod {
  id: string;
  type: 'upi' | 'wallet';
  upiId?: string;
  walletType?: string;
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  error?: string;
}

export const processPayment = async (
  amount: number,
  paymentMethod: PaymentMethod,
  orderId: string,
  payerId: string,
  receiverId: string
): Promise<PaymentResult> => {
  try {
    // Validate required fields
    if (!amount || amount <= 0) {
      throw new Error('Invalid payment amount');
    }
    
    if (!orderId || !payerId || !receiverId) {
      throw new Error('Missing required payment information');
    }
    
    // Log payment attempt for debugging
    console.log('Processing payment:', {
      amount,
      paymentMethod: paymentMethod.type,
      orderId,
      payerId,
      receiverId
    });

    // Create payment record in database
    const { error: dbError, data: payment } = await supabase
      .from('payments')
      .insert({
        order_id: orderId,
        payer_id: payerId,
        receiver_id: receiverId,
        amount: amount,
        payment_method: paymentMethod.type,
        status: 'pending',
      })
      .select()
      .single();

    if (dbError) {
      throw new Error(dbError?.message || 'Failed to create payment record');
    }

    // Simulate payment processing based on method
    if (paymentMethod.type === 'upi') {
      // Simulate UPI payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update payment status to completed
      const { error: updateError } = await supabase
        .from('payments')
        .update({ status: 'completed' })
        .eq('id', payment.id);

      if (updateError) {
        throw new Error('Payment processed but failed to update status');
      }

      return { success: true, paymentId: payment.id };
    } else if (paymentMethod.type === 'wallet') {
      // Simulate wallet payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update payment status to completed
      const { error: updateError } = await supabase
        .from('payments')
        .update({ status: 'completed' })
        .eq('id', payment.id);

      if (updateError) {
        throw new Error('Payment processed but failed to update status');
      }

      return { success: true, paymentId: payment.id };
    }

    throw new Error('Unsupported payment method');

  } catch (error) {
    console.error('Payment processing error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Payment processing failed' 
    };
  }
};

export const getPaymentStatus = async (paymentId: string) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error fetching payment status:', error);
    throw error;
  }
};

export const getPaymentHistory = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .or(`payer_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error fetching payment history:', error);
    throw error;
  }
};

const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());

// Special handling for Stripe webhooks to get raw body
app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }));

// Regular JSON parsing for other routes
app.use(express.json());

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://yibfobsxadyhmurcynrx.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpYmZvYnN4YWR5aG11cmN5bnJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MDUxMTAsImV4cCI6MjA2NzM4MTExMH0.HPhNXbaR7jgdcYk2iezll7M7RLIdZgeg6lG2sXakdq4';

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Initialize Stripe
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
let stripe = null;

if (stripeSecretKey) {
  stripe = new Stripe(stripeSecretKey, { apiVersion: '2023-10-16' });
} else {
  console.warn('⚠️  STRIPE_SECRET_KEY is not set. Stripe payment features will be disabled.');
}

// Create payment intent endpoint
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    console.log('Received payment intent request:', req.body);
    const { amount, paymentMethod, orderId, payerId, receiverId } = req.body;
    
    // Log each field to see what's missing
    console.log('Parsed fields:', {
      amount: amount,
      paymentMethod: paymentMethod,
      orderId: orderId,
      payerId: payerId,
      receiverId: receiverId
    });
    
    if (!amount || !paymentMethod || !orderId || !payerId || !receiverId) {
      console.log('Missing fields:', {
        amount: !amount,
        paymentMethod: !paymentMethod,
        orderId: !orderId,
        payerId: !payerId,
        receiverId: !receiverId
      });
      return res.status(400).json({ error: { message: 'Missing required fields' } });
    }

    // Check if Stripe is configured
    if (!stripe) {
      console.log('Stripe not configured, returning mock payment intent');
      // Return a mock client secret for development
      const mockClientSecret = 'pi_mock_' + Date.now() + '_secret_' + Math.random().toString(36).substr(2, 9);
      return res.json({
        success: true,
        data: {
          clientSecret: mockClientSecret
        }
      });
    }

    // For testing purposes, bypass database check
    console.log('Bypassing database check for testing');
    // Uncomment the following code in production
    /*
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return res.status(404).json({ error: { message: 'Order not found' } });
    }

    // Verify the amount matches the order
    if (order.amount !== amount) {
      return res.status(400).json({ error: { message: 'Payment amount does not match order amount' } });
    }
    */

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      payment_method_types: [paymentMethod],
      metadata: {
        orderId,
        payerId,
        receiverId
      }
    });

    res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret
      }
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({
      error: {
        message: 'Error creating payment intent',
        details: error.message
      }
    });
  }
});

// Stripe webhook endpoint
app.post('/api/webhooks/stripe', async (req, res) => {
  const signature = req.headers['stripe-signature'];
  
  if (!signature) {
    return res.status(400).json({ error: { message: 'Missing stripe-signature header' } });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.warn('⚠️  STRIPE_WEBHOOK_SECRET is not set. Webhook verification is disabled.');
    return res.status(200).json({ received: true });
  }

  if (!stripe) {
    console.warn('⚠️  Stripe is not configured. Webhook processing is disabled.');
    return res.status(200).json({ received: true });
  }

  let event;

  try {
    // For Express, we need to get the raw body
    const rawBody = req.rawBody || JSON.stringify(req.body);
    
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: { message: `Webhook Error: ${err.message}` } });
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const { orderId, payerId, receiverId } = paymentIntent.metadata;

        // Update payment status in database
        const { error: paymentError } = await supabase
          .from('payments')
          .insert({
            orderid: orderId,
            payerid: payerId,
            receiverid: receiverId,
            amount: paymentIntent.amount / 100, // Convert from cents
            paymentmethod: 'card',
            status: 'completed',
            transactionid: paymentIntent.id,
            paymentdetails: {
              payment_method: paymentIntent.payment_method,
              currency: paymentIntent.currency
            }
          });

        if (paymentError) {
          console.error('Error updating payment:', paymentError);
          return res.status(500).json({ error: { message: 'Error updating payment' } });
        }

        // Update order status
        const { error: orderError } = await supabase
          .from('orders')
          .update({ status: 'paid' })
          .eq('id', orderId);

        if (orderError) {
          console.error('Error updating order:', orderError);
          return res.status(500).json({ error: { message: 'Error updating order' } });
        }

        break;
      }
      // Handle other event types as needed
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: { message: 'Error processing webhook' } });
  }
});

// Notify freelancer endpoint
app.post('/api/notify-freelancer', async (req, res) => {
  try {
    const { freelancerId, message, orderId } = req.body;
    
    if (!freelancerId || !message || !orderId) {
      return res.status(400).json({ error: { message: 'Missing required fields' } });
    }
    
    // In a real app, you would send a notification to the freelancer
    // For now, we'll just log it and return success
    console.log(`Notifying freelancer ${freelancerId} about order ${orderId}: ${message}`);
    
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    res.json({
      success: true,
      data: {
        message: 'Notification sent successfully'
      }
    });
  } catch (error) {
    console.error('Error notifying freelancer:', error);
    res.status(500).json({
      error: {
        message: 'Error notifying freelancer',
        details: error.message
      }
    });
  }
});

// UPI payment endpoint
app.post('/api/upi-payment', async (req, res) => {
  try {
    const { amount, upiId, orderId, payerId, receiverId } = req.body;
    
    if (!amount || !upiId || !orderId || !payerId || !receiverId) {
      return res.status(400).json({ error: { message: 'Missing required fields' } });
    }
    
    // Simulate UPI payment processing
    // In a real app, you would integrate with a UPI payment gateway
    console.log(`Processing UPI payment of ${amount} to ${upiId} for order ${orderId}`);
    
    // Simulate a delay and 90% success rate for demo purposes
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Randomly succeed or fail (90% success rate)
    const success = Math.random() < 0.9;
    
    if (success) {
      res.json({
        success: true,
        data: {
          transactionId: 'upi_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
          status: 'completed'
        }
      });
    } else {
      res.status(400).json({
        error: {
          message: 'UPI payment failed',
          details: 'Payment gateway rejected the transaction'
        }
      });
    }
  } catch (error) {
    console.error('Error processing UPI payment:', error);
    res.status(500).json({
      error: {
        message: 'Error processing UPI payment',
        details: error.message
      }
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
let stripe = null;

if (stripeSecretKey) {
  stripe = new Stripe(stripeSecretKey, { apiVersion: '2023-10-16' });
} else {
  console.warn('⚠️  STRIPE_SECRET_KEY is not set. Stripe payment features will be disabled.');
}

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
      res.json({ clientSecret: mockClientSecret });
      return;
    }

    // NOTE: You should validate the order and amount here with your DB if needed.
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: { orderId, payerId, receiverId },
    });
    console.log('Payment intent created successfully:', paymentIntent.id);
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: { message: error.message } });
  }
});

app.post('/api/notify-freelancer', async (req, res) => {
  try {
    const { freelancerId, orderId, serviceTitle, amount, clientName } = req.body;
    
    console.log(`🔔 Notifying freelancer ${freelancerId} about new order ${orderId}`);
    console.log(`Service: ${serviceTitle}, Amount: ₹${amount}, Client: ${clientName}`);
    
    // Here you would typically:
    // 1. Send email notification
    // 2. Send push notification
    // 3. Update in-app notifications
    // 4. Send SMS (if configured)
    
    // For now, just log the notification
    console.log(`✅ Notification sent to freelancer ${freelancerId}`);
    
    res.json({ success: true, message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: { message: error.message } });
  }
});

app.post('/api/create-upi-payment', async (req, res) => {
  console.log('UPI payment request received:', req.body);
  const { upiId, amount } = req.body;
  if (!upiId || !amount) {
    console.log('Missing fields:', { upiId, amount });
    return res.status(400).json({ error: 'UPI ID and amount are required.' });
  }
  
  try {
    // For demo purposes, we'll simulate a UPI payment
    // In a real implementation, you would integrate with a UPI payment gateway
    console.log(`Processing UPI payment: ${upiId} for ₹${amount}`);
    
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate successful payment (90% success rate for demo)
    const isSuccess = Math.random() > 0.1;
    
    if (isSuccess) {
      console.log('UPI payment successful');
      res.json({
        status: 'succeeded',
        transactionId: `upi_${Date.now()}`,
        message: 'Payment successful'
      });
    } else {
      console.log('UPI payment failed');
      res.json({
        status: 'failed',
        message: 'Payment failed'
      });
    }
  } catch (err) {
    console.error('UPI payment error:', err);
    res.status(500).json({ 
      status: 'failed',
      error: 'Payment processing failed' 
    });
  }
});

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
}); 
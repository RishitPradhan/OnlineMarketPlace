import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { supabase } from "../../../../lib/supabase";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('STRIPE_WEBHOOK_SECRET is not set');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: { message: 'Missing stripe-signature header' } },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: { message: `Webhook Error: ${err.message}` } },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const { orderId, payerId, receiverId } = paymentIntent.metadata;

        // Update payment status in database
        const { error: paymentError } = await supabase
          .from('payments')
          .update({
            status: 'completed',
            transactionId: paymentIntent.id,
            updated_at: new Date().toISOString()
          })
          .eq('orderId', orderId);

        if (paymentError) throw paymentError;

        // Update order status
        const { error: orderError } = await supabase
          .from('orders')
          .update({
            status: 'in_progress',
            updated_at: new Date().toISOString()
          })
          .eq('id', orderId);

        if (orderError) throw orderError;

        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const { orderId } = paymentIntent.metadata;

        // Update payment status in database
        const { error: paymentError } = await supabase
          .from('payments')
          .update({
            status: 'failed',
            transactionId: paymentIntent.id,
            updated_at: new Date().toISOString()
          })
          .eq('orderId', orderId);

        if (paymentError) throw paymentError;

        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntent = await stripe.paymentIntents.retrieve(charge.payment_intent as string);
        const { orderId } = paymentIntent.metadata;

        // Update payment status in database
        const { error: paymentError } = await supabase
          .from('payments')
          .update({
            status: 'refunded',
            updated_at: new Date().toISOString()
          })
          .eq('orderId', orderId);

        if (paymentError) throw paymentError;

        // Update order status
        const { error: orderError } = await supabase
          .from('orders')
          .update({
            status: 'cancelled',
            updated_at: new Date().toISOString()
          })
          .eq('id', orderId);

        if (orderError) throw orderError;

        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: { message: 'Error processing webhook' } },
      { status: 500 }
    );
  }
}
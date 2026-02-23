import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Lazy-init Stripe to avoid build errors when env var is missing
function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not set');
  }
  return new Stripe(key);
}

// Product configuration - prices in cents
const PRODUCTS: Record<string, {
  name: string;
  description: string;
  price: number; // in cents
  productId: string;
  type?: 'digital' | 'session';
}> = {
  'openclaw-setup': {
    name: 'The Complete OpenClaw Setup Guide',
    description: 'From zero to your own AI assistant. 30+ pages covering installation, configuration, and troubleshooting.',
    price: 1999, // $19.99
    productId: 'openclaw-setup',
    type: 'digital',
  },
  'openclaw-session': {
    name: '1-on-1 OpenClaw Setup Session',
    description: '1 hour video call with Norman to set up your OpenClaw instance and answer all your questions.',
    price: 9900, // $99.00
    productId: 'openclaw-session',
    type: 'session',
  },
};

export async function POST(req: NextRequest) {
  try {
    const { productId } = await req.json();
    
    const product = PRODUCTS[productId];
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jimmytools.net';

    // Create Stripe Checkout Session
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: product.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/api/stripe-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}?canceled=true`,
      metadata: {
        productId: product.productId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

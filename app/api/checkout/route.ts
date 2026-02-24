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
  'foia-mastery': {
    name: 'FOIA Request Mastery',
    description: 'Complete guide to filing effective FOIA requests, appeals, and litigation. 50+ pages with templates.',
    price: 2499, // $24.99
    productId: 'foia-mastery',
    type: 'digital',
  },
  'osint-playbook': {
    name: "OSINT Investigator's Playbook",
    description: '50+ techniques to find anyone and investigate anything using open source intelligence. 60+ pages.',
    price: 2999, // $29.99
    productId: 'osint-playbook',
    type: 'digital',
  },
  'background-check-diy': {
    name: 'Background Check DIY',
    description: 'Research anyone legally using public records. Save $100+ per search. 50+ pages with checklists.',
    price: 2499, // $24.99
    productId: 'background-check-diy',
    type: 'digital',
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
      // Don't restrict payment_method_types - let Stripe auto-enable Link, Apple Pay, etc.
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

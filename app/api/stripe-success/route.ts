import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import jwt from 'jsonwebtoken';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const JWT_SECRET = process.env.JWT_SECRET || 'jimmy-tools-default-secret-change-me';

// Product info for download page
const PRODUCT_INFO: Record<string, {
  name: string;
  description: string;
  fileType?: string;
  fileSize?: string;
  type: 'digital' | 'session';
  schedulingUrl?: string;
}> = {
  'openclaw-setup': {
    name: 'The Complete OpenClaw Setup Guide',
    description: 'Go from zero to your own AI assistant. Installation, configuration, channels, troubleshooting. 30+ pages.',
    fileType: 'PDF',
    fileSize: '1.4 MB',
    type: 'digital',
  },
  'openclaw-session': {
    name: '1-on-1 OpenClaw Setup Session',
    description: '1 hour video call to set up your OpenClaw instance.',
    type: 'session',
    schedulingUrl: 'https://calendar.app.google/G6Pge7VEa6uXeDhz6',
  },
};

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get('session_id');
    
    if (!sessionId) {
      return NextResponse.redirect(new URL('/?error=missing_session', req.url));
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status !== 'paid') {
      return NextResponse.redirect(new URL('/?error=payment_incomplete', req.url));
    }

    const productId = session.metadata?.productId || 'openclaw-setup';
    const product = PRODUCT_INFO[productId] || PRODUCT_INFO['openclaw-setup'];
    const email = session.customer_details?.email || 'customer@example.com';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jimmytools.net';

    // For session products, redirect to booking confirmation page
    if (product.type === 'session') {
      return NextResponse.redirect(`${baseUrl}/booking`);
    }

    // For digital products, generate JWT download token
    const token = jwt.sign(
      {
        saleId: session.id,
        productId,
        productName: product.name,
        email,
        description: product.description,
        fileType: product.fileType,
        fileSize: product.fileSize,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Redirect to download page
    return NextResponse.redirect(`${baseUrl}/download/${token}`);

  } catch (error: any) {
    console.error('Stripe success handler error:', error);
    return NextResponse.redirect(new URL('/?error=verification_failed', req.url));
  }
}

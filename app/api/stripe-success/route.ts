import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import jwt from 'jsonwebtoken';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const JWT_SECRET = process.env.JWT_SECRET || 'jimmy-tools-default-secret-change-me';

// Product info for download page
const PRODUCT_INFO: Record<string, {
  name: string;
  description: string;
  downloadUrl: string;
  fileType: string;
  fileSize: string;
}> = {
  'openclaw-setup': {
    name: 'The Complete OpenClaw Setup Guide',
    description: 'Go from zero to your own AI assistant. Installation, configuration, channels, troubleshooting. 30+ pages.',
    downloadUrl: '/files/openclaw-setup-guide.pdf',
    fileType: 'PDF',
    fileSize: '2.4 MB',
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

    // Generate JWT download token
    const token = jwt.sign(
      {
        saleId: session.id,
        productId,
        productName: product.name,
        email,
        downloadUrl: product.downloadUrl,
        description: product.description,
        fileType: product.fileType,
        fileSize: product.fileSize,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Redirect to download page
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jimmytools.net';
    return NextResponse.redirect(`${baseUrl}/download/${token}`);

  } catch (error: any) {
    console.error('Stripe success handler error:', error);
    return NextResponse.redirect(new URL('/?error=verification_failed', req.url));
  }
}

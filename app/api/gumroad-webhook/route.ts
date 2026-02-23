import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Secret for signing tokens - set in Vercel environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'jimmy-tools-default-secret-change-me';

// Product mapping
const PRODUCT_MAPPING: Record<string, {
  name: string;
  downloadUrl: string;
  description: string;
  fileType: string;
  fileSize: string;
}> = {
  'hbhni': {
    name: 'The Complete OpenClaw Setup Guide',
    downloadUrl: '/files/openclaw-setup-guide.pdf',
    description: 'Go from zero to your own AI assistant. Installation, configuration, channels, troubleshooting. 30+ pages.',
    fileType: 'PDF',
    fileSize: '2.4 MB',
  },
  'openclaw-setup': {
    name: 'The Complete OpenClaw Setup Guide',
    downloadUrl: '/files/openclaw-setup-guide.pdf',
    description: 'Go from zero to your own AI assistant. Installation, configuration, channels, troubleshooting. 30+ pages.',
    fileType: 'PDF',
    fileSize: '2.4 MB',
  },
};

export async function POST(req: NextRequest) {
  try {
    // Parse the form data from Gumroad
    const formData = await req.formData();
    
    const saleId = formData.get('sale_id') as string;
    const productId = formData.get('product_id') as string;
    const productName = formData.get('product_name') as string;
    const email = formData.get('email') as string;
    const permalink = formData.get('permalink') as string;

    // Log the webhook
    console.log('Gumroad webhook received:', { saleId, productId, productName, email, permalink });

    // For verification pings (no sale data), just return success
    if (!saleId && !email) {
      return NextResponse.json({ success: true, message: 'Webhook verified' });
    }

    // Validate required fields for actual sales
    if (!saleId || !email) {
      console.error('Missing required fields:', { saleId, email });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get product info (use Gumroad's productId or permalink)
    const product = PRODUCT_MAPPING[productId] || PRODUCT_MAPPING[permalink] || {
      name: productName || 'Digital Product',
      downloadUrl: '/files/product.pdf',
      description: 'Your purchased digital product',
      fileType: 'PDF',
      fileSize: 'Unknown',
    };

    // Create JWT token with purchase info (expires in 7 days)
    const token = jwt.sign(
      {
        saleId,
        productId: productId || permalink,
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

    // Construct download URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jimmytools.net';
    const downloadUrl = `${baseUrl}/download/${token}`;

    console.log('Token generated for:', email, downloadUrl);

    return NextResponse.json({
      success: true,
      download_url: downloadUrl,
    });

  } catch (error) {
    console.error('Error processing Gumroad webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Health check / verification endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Gumroad webhook endpoint is active',
  });
}

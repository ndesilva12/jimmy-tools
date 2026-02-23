import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

// Path to store tokens (in production, use a database)
const TOKENS_FILE = path.join(process.cwd(), 'data', 'tokens.json');

interface TokenData {
  token: string;
  productId: string;
  productName: string;
  email: string;
  saleId: string;
  createdAt: number;
  downloadCount: number;
  expiresAt: number;
}

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Read tokens from file
function readTokens(): Record<string, TokenData> {
  ensureDataDir();
  if (!fs.existsSync(TOKENS_FILE)) {
    return {};
  }
  try {
    const data = fs.readFileSync(TOKENS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading tokens file:', error);
    return {};
  }
}

// Write tokens to file
function writeTokens(tokens: Record<string, TokenData>) {
  ensureDataDir();
  fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokens, null, 2));
}

// Product mapping - matches the slug-based products
const PRODUCT_MAPPING: Record<string, {
  name: string;
  downloadUrl: string;
}> = {
  'investigation-methodology': {
    name: 'Investigation Methodology Guide',
    downloadUrl: '/files/investigation-methodology.pdf',
  },
  'foia-guide': {
    name: 'FOIA Request Guide',
    downloadUrl: '/files/foia-guide.pdf',
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

    // Validate required fields
    if (!saleId || !productId || !email) {
      console.error('Missing required fields:', { saleId, productId, email });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Log the webhook for debugging
    console.log('Gumroad webhook received:', {
      saleId,
      productId,
      productName,
      email,
      permalink,
    });

    // Generate unique token
    const token = uuidv4();
    
    // Token expires in 7 days
    const expiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000);

    // Store token data
    const tokens = readTokens();
    tokens[token] = {
      token,
      productId,
      productName: productName || 'Unknown Product',
      email,
      saleId,
      createdAt: Date.now(),
      downloadCount: 0,
      expiresAt,
    };
    writeTokens(tokens);

    // Construct download URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jimmytools.net';
    const downloadUrl = `${baseUrl}/download/${token}`;

    console.log('Token generated:', { token, downloadUrl });

    // Return success with download URL
    // Gumroad can redirect to this URL if configured
    return NextResponse.json({
      success: true,
      download_url: downloadUrl,
      token,
    });

  } catch (error) {
    console.error('Error processing Gumroad webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Gumroad webhook endpoint is active',
  });
}

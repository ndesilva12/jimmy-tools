import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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

// Product metadata - matches the webhook mapping
const PRODUCT_INFO: Record<string, {
  description: string;
  downloadUrl: string;
  fileType: string;
  fileSize: string;
}> = {
  'hbhni': {
    description: 'Go from zero to your own AI assistant. Installation, configuration, channels, troubleshooting. 30+ pages.',
    downloadUrl: '/files/openclaw-setup-guide.pdf',
    fileType: 'PDF',
    fileSize: '2.4 MB',
  },
  'openclaw-setup': {
    description: 'Go from zero to your own AI assistant. Installation, configuration, channels, troubleshooting. 30+ pages.',
    downloadUrl: '/files/openclaw-setup-guide.pdf',
    fileType: 'PDF',
    fileSize: '2.4 MB',
  },
  'investigation-methodology': {
    description: 'A comprehensive PDF guide covering OSINT techniques, source verification, document analysis, and investigative workflows used by professional researchers.',
    downloadUrl: '/files/investigation-methodology.pdf',
    fileType: 'PDF',
    fileSize: '2.4 MB',
  },
  'foia-guide': {
    description: 'Master the Freedom of Information Act. Templates, agency contacts, appeal strategies, and fee waiver requests.',
    downloadUrl: '/files/foia-guide.pdf',
    fileType: 'PDF',
    fileSize: '1.8 MB',
  },
};

function readTokens(): Record<string, TokenData> {
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

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { valid: false, error: 'No token provided' },
        { status: 400 }
      );
    }

    const tokens = readTokens();
    const tokenData = tokens[token];

    if (!tokenData) {
      return NextResponse.json(
        { valid: false, error: 'Invalid token' },
        { status: 404 }
      );
    }

    // Check if token has expired
    if (Date.now() > tokenData.expiresAt) {
      return NextResponse.json(
        { valid: false, error: 'Token has expired' },
        { status: 410 }
      );
    }

    // Check if download limit reached (5 downloads max)
    if (tokenData.downloadCount >= 5) {
      return NextResponse.json(
        { valid: false, error: 'Download limit reached' },
        { status: 410 }
      );
    }

    // Get product info
    const productInfo = PRODUCT_INFO[tokenData.productId] || {
      description: 'Your purchased digital product',
      downloadUrl: '/files/unknown.pdf',
      fileType: 'PDF',
      fileSize: 'Unknown',
    };

    return NextResponse.json({
      valid: true,
      product: {
        name: tokenData.productName,
        description: productInfo.description,
        downloadUrl: productInfo.downloadUrl,
        fileType: productInfo.fileType,
        fileSize: productInfo.fileSize,
        downloadCount: tokenData.downloadCount,
        expiresAt: tokenData.expiresAt,
      },
    });

  } catch (error) {
    console.error('Error validating token:', error);
    return NextResponse.json(
      { valid: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

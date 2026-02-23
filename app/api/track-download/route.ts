import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Use /tmp on Vercel (ephemeral but writable)
const TOKENS_FILE = process.env.VERCEL 
  ? '/tmp/tokens.json' 
  : path.join(process.cwd(), 'data', 'tokens.json');

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

function writeTokens(tokens: Record<string, TokenData>) {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokens, null, 2));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No token provided' },
        { status: 400 }
      );
    }

    const tokens = readTokens();
    const tokenData = tokens[token];

    if (!tokenData) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 404 }
      );
    }

    // Increment download count
    tokenData.downloadCount += 1;
    tokens[token] = tokenData;
    writeTokens(tokens);

    console.log('Download tracked:', {
      token,
      downloadCount: tokenData.downloadCount,
      productName: tokenData.productName,
    });

    return NextResponse.json({
      success: true,
      downloadCount: tokenData.downloadCount,
    });

  } catch (error) {
    console.error('Error tracking download:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

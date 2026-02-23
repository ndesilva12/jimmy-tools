import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { readFile } from 'fs/promises';
import path from 'path';

const JWT_SECRET = process.env.JWT_SECRET || 'jimmy-tools-default-secret-change-me';

// Map product IDs to protected files
const PROTECTED_FILES: Record<string, { path: string; filename: string; contentType: string }> = {
  'openclaw-setup': {
    path: 'protected-files/openclaw-setup-guide.pdf',
    filename: 'OpenClaw-Setup-Guide.pdf',
    contentType: 'application/pdf',
  },
  'sec-edgar-scraper': {
    path: 'protected-files/sec-edgar-scraper.ipynb',
    filename: 'SEC-EDGAR-Scraper-JimmyTools.ipynb',
    contentType: 'application/x-ipynb+json',
  },
  'gov-salary-scraper': {
    path: 'protected-files/gov-salary-scraper.ipynb',
    filename: 'Government-Salary-Scraper-JimmyTools.ipynb',
    contentType: 'application/x-ipynb+json',
  },
};

interface TokenPayload {
  saleId: string;
  productId: string;
  productName: string;
  email: string;
  iat: number;
  exp: number;
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 400 });
    }

    // Verify the JWT
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

    // Get the file info for this product
    const fileInfo = PROTECTED_FILES[decoded.productId];
    
    if (!fileInfo) {
      return NextResponse.json({ error: 'Product file not found' }, { status: 404 });
    }

    // Read the file from protected directory
    const filePath = path.join(process.cwd(), fileInfo.path);
    const fileBuffer = await readFile(filePath);

    // Return the file with proper headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': fileInfo.contentType,
        'Content-Disposition': `attachment; filename="${fileInfo.filename}"`,
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'no-store', // Don't cache paid content
      },
    });

  } catch (error: any) {
    console.error('Download error:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return NextResponse.json({ error: 'Download link has expired' }, { status: 410 });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: 'Invalid download link' }, { status: 400 });
    }

    if (error.code === 'ENOENT') {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Download failed' }, { status: 500 });
  }
}

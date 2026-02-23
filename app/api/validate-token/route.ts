import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'jimmy-tools-default-secret-change-me';

interface TokenPayload {
  saleId: string;
  productId: string;
  productName: string;
  email: string;
  description: string;
  fileType: string;
  fileSize: string;
  iat: number;
  exp: number;
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ valid: false, error: 'No token provided' }, { status: 400 });
    }

    // Verify and decode the JWT
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

    // Generate protected download URL with the same token
    const downloadUrl = `/api/download-file?token=${encodeURIComponent(token!)}`;
    
    return NextResponse.json({
      valid: true,
      product: {
        name: decoded.productName,
        description: decoded.description,
        downloadUrl: downloadUrl,
        fileType: decoded.fileType,
        fileSize: decoded.fileSize,
        expiresAt: decoded.exp * 1000, // Convert to milliseconds
      },
    });

  } catch (error: any) {
    console.error('Token validation error:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return NextResponse.json({ valid: false, error: 'Token has expired' }, { status: 410 });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ valid: false, error: 'Invalid token' }, { status: 400 });
    }

    return NextResponse.json({ valid: false, error: 'Validation failed' }, { status: 500 });
  }
}

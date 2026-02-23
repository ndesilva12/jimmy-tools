import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

// Allowed files for admin download
const ALLOWED_FILES: Record<string, { path: string; contentType: string }> = {
  'openclaw-setup-guide.pdf': {
    path: 'protected-files/openclaw-setup-guide.pdf',
    contentType: 'application/pdf',
  },
  'foia-mastery.pdf': {
    path: 'protected-files/foia-mastery.pdf',
    contentType: 'application/pdf',
  },
  'osint-playbook.pdf': {
    path: 'protected-files/osint-playbook.pdf',
    contentType: 'application/pdf',
  },
  'background-check-diy.pdf': {
    path: 'protected-files/background-check-diy.pdf',
    contentType: 'application/pdf',
  },
  'sec-edgar-scraper.ipynb': {
    path: 'protected-files/sec-edgar-scraper.ipynb',
    contentType: 'application/x-ipynb+json',
  },
  'gov-salary-scraper.ipynb': {
    path: 'protected-files/gov-salary-scraper.ipynb',
    contentType: 'application/x-ipynb+json',
  },
};

export async function GET(req: NextRequest) {
  try {
    const filename = req.nextUrl.searchParams.get('file');

    if (!filename) {
      return NextResponse.json({ error: 'No file specified' }, { status: 400 });
    }

    const fileInfo = ALLOWED_FILES[filename];
    
    if (!fileInfo) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const filePath = path.join(process.cwd(), fileInfo.path);
    const fileBuffer = await readFile(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': fileInfo.contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    });

  } catch (error: any) {
    console.error('Admin download error:', error.message);
    
    if (error.code === 'ENOENT') {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Download failed' }, { status: 500 });
  }
}

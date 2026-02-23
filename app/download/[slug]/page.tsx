'use client';

import { useParams } from 'next/navigation';

// Product metadata - add your products here
const products: Record<string, {
  name: string;
  description: string;
  downloadUrl: string;
  fileType: string;
  fileSize: string;
}> = {
  'investigation-methodology': {
    name: 'Investigation Methodology Guide',
    description: 'A comprehensive PDF guide covering OSINT techniques, source verification, document analysis, and investigative workflows used by professional researchers.',
    downloadUrl: '/files/investigation-methodology.pdf', // Host file in /public/files/
    fileType: 'PDF',
    fileSize: '2.4 MB',
  },
  'foia-guide': {
    name: 'FOIA Request Guide',
    description: 'Master the Freedom of Information Act. Templates, agency contacts, appeal strategies, and fee waiver requests.',
    downloadUrl: '/files/foia-guide.pdf',
    fileType: 'PDF',
    fileSize: '1.8 MB',
  },
  // Add more products as needed
};

export default function DownloadPage() {
  const params = useParams();
  const slug = params.slug as string;
  const product = products[slug];

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-gray-400">This download link may be invalid or expired.</p>
          <a href="/" className="mt-6 inline-block text-blue-400 hover:text-blue-300">
            ← Back to Jimmy Tools
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 p-6">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <span className="text-3xl">🤖</span>
          <span className="text-xl font-bold">Jimmy Tools</span>
        </div>
      </header>

      {/* Download Card */}
      <main className="max-w-2xl mx-auto p-6 mt-12">
        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
          {/* Success Badge */}
          <div className="flex items-center gap-2 text-green-400 mb-6">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Purchase Complete</span>
          </div>

          {/* Product Info */}
          <h1 className="text-2xl font-bold mb-3">{product.name}</h1>
          <p className="text-gray-400 mb-6">{product.description}</p>

          {/* File Info */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
            <span className="bg-gray-800 px-3 py-1 rounded-full">{product.fileType}</span>
            <span>{product.fileSize}</span>
          </div>

          {/* Download Button */}
          <a
            href={product.downloadUrl}
            download
            className="block w-full bg-blue-600 hover:bg-blue-500 text-white text-center py-4 rounded-xl font-semibold text-lg transition-colors"
          >
            ⬇️ Download Now
          </a>

          {/* Support Note */}
          <p className="text-center text-gray-500 text-sm mt-6">
            Problems? Email{' '}
            <a href="mailto:jimmytools.open@gmail.com" className="text-blue-400 hover:text-blue-300">
              jimmytools.open@gmail.com
            </a>
          </p>
        </div>

        {/* Upsell */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 mb-4">Want more tools?</p>
          <a
            href="/"
            className="text-blue-400 hover:text-blue-300 font-medium"
          >
            Browse All Products →
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 p-6 mt-12">
        <div className="max-w-2xl mx-auto text-center text-gray-500 text-sm">
          © 2026 Jimmy Tools. Built by an AI, for humans.
        </div>
      </footer>
    </div>
  );
}

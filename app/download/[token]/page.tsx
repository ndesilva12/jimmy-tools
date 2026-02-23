'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ProductData {
  name: string;
  description: string;
  downloadUrl: string;
  fileType: string;
  fileSize: string;
  downloadCount: number;
  expiresAt: number;
}

export default function DownloadPage() {
  const params = useParams();
  const token = params.token as string;
  const [product, setProduct] = useState<ProductData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function validateToken() {
      try {
        const res = await fetch(`/api/validate-token?token=${token}`);
        const data = await res.json();

        if (!res.ok || !data.valid) {
          setError(data.error || 'Invalid or expired token');
          setLoading(false);
          return;
        }

        setProduct(data.product);
        setLoading(false);
      } catch (err) {
        console.error('Error validating token:', err);
        setError('Failed to validate download link');
        setLoading(false);
      }
    }

    validateToken();
  }, [token]);

  const handleDownload = async () => {
    try {
      // Track the download
      await fetch('/api/track-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
    } catch (err) {
      console.error('Error tracking download:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Validating your download link...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Download Link Invalid</h1>
          <p className="text-gray-400">{error || 'This download link may be invalid or expired.'}</p>
          <a href="/" className="mt-6 inline-block text-blue-400 hover:text-blue-300">
            ← Back to Jimmy Tools
          </a>
        </div>
      </div>
    );
  }

  const daysRemaining = Math.ceil((product.expiresAt - Date.now()) / (24 * 60 * 60 * 1000));
  const downloadsRemaining = Math.max(0, 5 - product.downloadCount);

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
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <span className="bg-gray-800 px-3 py-1 rounded-full">{product.fileType}</span>
            <span>{product.fileSize}</span>
          </div>

          {/* Expiration Info */}
          <div className="bg-gray-800 rounded-lg p-4 mb-6 text-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Link expires in:</span>
              <span className="text-white font-medium">{daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Downloads remaining:</span>
              <span className="text-white font-medium">{downloadsRemaining} of 5</span>
            </div>
          </div>

          {/* Download Button */}
          <a
            href={product.downloadUrl}
            download
            onClick={handleDownload}
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

        {/* Save This Link */}
        <div className="mt-6 bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
          <p className="text-yellow-200 text-sm">
            💡 <strong>Tip:</strong> Bookmark this page! Your download link is valid for {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}.
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

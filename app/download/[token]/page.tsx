'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ProductInfo {
  name: string;
  description: string;
  downloadUrl: string;
  fileType: string;
  fileSize: string;
  expiresAt: number;
}

export default function DownloadPage() {
  const params = useParams();
  const token = params.token as string;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<ProductInfo | null>(null);

  useEffect(() => {
    async function validateToken() {
      try {
        const res = await fetch(`/api/validate-token?token=${encodeURIComponent(token)}`);
        const data = await res.json();
        
        if (data.valid && data.product) {
          setProduct(data.product);
        } else {
          setError(data.error || 'Invalid or expired download link');
        }
      } catch (err) {
        setError('Failed to validate download link');
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      validateToken();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Validating download link...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-400 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-4">Download Unavailable</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <a href="/" className="text-blue-400 hover:text-blue-300">
            ← Back to Jimmy Tools
          </a>
        </div>
      </div>
    );
  }

  const expiresIn = Math.max(0, Math.floor((product.expiresAt - Date.now()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 p-6">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <span className="text-3xl">🛠️</span>
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

          {/* Expiration Notice */}
          <div className="text-sm text-gray-500 mb-8">
            ⏱️ This link expires in {expiresIn} day{expiresIn !== 1 ? 's' : ''}
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
            Problems?{' '}
            <a href="/contact" className="text-blue-400 hover:text-blue-300">
              Contact Support
            </a>
          </p>
        </div>

        {/* Upsell */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 mb-4">Want more tools?</p>
          <a href="/" className="text-blue-400 hover:text-blue-300 font-medium">
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

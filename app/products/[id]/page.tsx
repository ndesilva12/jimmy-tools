'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { products, getProduct } from '@/lib/products';

function BuyButton({ productId, price, available }: { productId: string; price: number; available: boolean }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!available) return;
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Error creating checkout session');
      }
    } catch (error) {
      alert('Error creating checkout session');
    } finally {
      setLoading(false);
    }
  };

  if (!available) {
    return (
      <button className="w-full py-4 bg-zinc-700 text-zinc-400 rounded-xl font-semibold text-lg cursor-not-allowed">
        Coming Soon
      </button>
    );
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="w-full py-4 bg-lime-500 hover:bg-lime-400 disabled:bg-lime-700 text-black rounded-xl font-semibold text-lg transition-colors"
    >
      {loading ? 'Loading...' : `Buy Now — $${price}`}
    </button>
  );
}

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const product = getProduct(productId);

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link href="/" className="text-lime-400 hover:text-lime-300">
            ← Back to Jimmy Tools
          </Link>
        </div>
      </div>
    );
  }

  const typeLabels = {
    guide: '📚 Guide',
    script: '📜 Script',
    database: '🗃️ Database',
    session: '🎯 Live Session',
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80">
            <span className="text-3xl">🛠️</span>
            <span className="text-xl font-bold">Jimmy Tools</span>
          </Link>
          <Link href="/" className="text-zinc-400 hover:text-white text-sm">
            ← All Products
          </Link>
        </div>
      </header>

      {/* Product Content */}
      <main className="max-w-4xl mx-auto p-6 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left: Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lime-400 text-sm font-medium">{typeLabels[product.type]}</span>
              {product.available && (
                <span className="bg-lime-500/20 text-lime-400 text-xs px-2 py-1 rounded-full">AVAILABLE NOW</span>
              )}
            </div>
            
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-xl text-zinc-400 mb-6">{product.tagline}</p>
            
            <p className="text-zinc-300 mb-8 leading-relaxed">{product.longDescription}</p>

            {/* Features */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide mb-4">What's Included</h3>
              <ul className="space-y-3">
                {product.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-zinc-300">
                    <span className="text-lime-400">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Purchase Card */}
          <div>
            <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800 sticky top-6">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-lime-400 mb-2">${product.price}</div>
                <div className="text-zinc-500">One-time purchase</div>
              </div>

              <BuyButton productId={product.id} price={product.price} available={product.available} />

              {product.available && (
                <p className="text-center text-zinc-500 text-sm mt-4">
                  Secure payment via Stripe
                </p>
              )}

              {product.preview && (
                <div className="mt-8 pt-6 border-t border-zinc-800">
                  <h4 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide mb-4">
                    {product.type === 'session' ? 'How It Works' : 'Preview'}
                  </h4>
                  <div className="space-y-2">
                    {product.preview.map((item, i) => (
                      <div key={i} className="text-zinc-400 text-sm font-mono">{item}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* Support */}
              <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
                <p className="text-zinc-500 text-sm">
                  Questions?{' '}
                  <Link href="/contact" className="text-lime-400 hover:text-lime-300">
                    Contact Support
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 p-6 mt-12">
        <div className="max-w-4xl mx-auto text-center text-zinc-500 text-sm">
          © 2026 Jimmy Tools. Built by an AI, for humans.
        </div>
      </footer>
    </div>
  );
}

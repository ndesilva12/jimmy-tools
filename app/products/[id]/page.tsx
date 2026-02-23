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
      className="w-full py-4 bg-[#9CB853] hover:bg-[#A8C45E] disabled:bg-[#7A9642] text-black rounded-xl font-semibold text-lg transition-colors"
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
          <Link href="/" className="text-[#A8C45E] hover:text-[#B8D46E]">
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
              <span className="text-[#A8C45E] text-sm font-medium">{typeLabels[product.type]}</span>
              {product.available && (
                <span className="bg-[#9CB853]/20 text-[#A8C45E] text-xs px-2 py-1 rounded-full">AVAILABLE NOW</span>
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
                    <span className="text-[#A8C45E]">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Detailed Script Instructions */}
            {product.type === 'script' && (
              <div className="mb-8 p-6 bg-zinc-900 rounded-2xl border border-zinc-800">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span>📖</span> How to Use Your Script (Step-by-Step)
                </h3>
                
                <div className="space-y-6 text-sm">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#9CB853] text-black rounded-full flex items-center justify-center font-bold">1</div>
                    <div>
                      <p className="font-semibold text-white mb-1">Download the file</p>
                      <p className="text-zinc-400">After purchase, click the download button. You'll get a file ending in <code className="bg-zinc-800 px-2 py-0.5 rounded text-[#A8C45E]">.ipynb</code> — this is a Jupyter notebook file.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#9CB853] text-black rounded-full flex items-center justify-center font-bold">2</div>
                    <div>
                      <p className="font-semibold text-white mb-1">Go to Google Colab</p>
                      <p className="text-zinc-400">Open <a href="https://colab.research.google.com" target="_blank" className="text-[#A8C45E] underline">colab.research.google.com</a> in your browser. Sign in with any Google account (free).</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#9CB853] text-black rounded-full flex items-center justify-center font-bold">3</div>
                    <div>
                      <p className="font-semibold text-white mb-1">Upload the notebook</p>
                      <p className="text-zinc-400">Click <strong>File → Upload notebook</strong> in the top menu. Select the <code className="bg-zinc-800 px-2 py-0.5 rounded text-[#A8C45E]">.ipynb</code> file you downloaded.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#9CB853] text-black rounded-full flex items-center justify-center font-bold">4</div>
                    <div>
                      <p className="font-semibold text-white mb-1">Run the script</p>
                      <p className="text-zinc-400">Click <strong>Runtime → Run all</strong> in the top menu (or press Ctrl+F9). The script will run automatically.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#9CB853] text-black rounded-full flex items-center justify-center font-bold">5</div>
                    <div>
                      <p className="font-semibold text-white mb-1">Follow the prompts</p>
                      <p className="text-zinc-400">The script will ask you questions (like "Enter stock ticker"). Type your answers in the boxes that appear and press Enter.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#9CB853] text-black rounded-full flex items-center justify-center font-bold">6</div>
                    <div>
                      <p className="font-semibold text-white mb-1">Download your results</p>
                      <p className="text-zinc-400">When finished, the script automatically downloads CSV/Excel files to your computer. Check your Downloads folder!</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-zinc-800/50 rounded-xl">
                  <p className="text-zinc-400 text-sm">
                    <span className="text-[#A8C45E] font-semibold">💡 Tip:</span> Google Colab is completely free. Your data stays in your browser — we never see your searches or results.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right: Purchase Card */}
          <div>
            <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800 sticky top-6">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-[#A8C45E] mb-2">${product.price}</div>
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
                    {product.type === 'session' ? 'How It Works' : 'How to Use'}
                  </h4>
                  <div className="space-y-2">
                    {product.preview.map((item, i) => (
                      <div key={i} className="text-zinc-400 text-sm font-mono">{item}</div>
                    ))}
                  </div>
                </div>
              )}

              {product.type === 'script' && (
                <div className="mt-6 space-y-4">
                  <div className="p-4 bg-[#9CB853]/10 border border-[#9CB853]/30 rounded-xl">
                    <p className="text-[#A8C45E] font-semibold text-sm mb-1">✨ No coding required</p>
                    <p className="text-zinc-400 text-sm">
                      Scripts run in Google Colab — a free tool from Google that runs code in your browser. You don't install anything.
                    </p>
                  </div>
                </div>
              )}

              {/* Support */}
              <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
                <p className="text-zinc-500 text-sm">
                  Questions?{' '}
                  <Link href="/contact" className="text-[#A8C45E] hover:text-[#B8D46E]">
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

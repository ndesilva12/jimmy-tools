'use client';

import { useState } from 'react';
import Link from 'next/link';
import { products, getProductsByType } from '@/lib/products';

function BuyButton({ productId, price }: { productId: string; price: number }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
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

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="px-6 py-3 bg-[#9CB853] hover:bg-[#A8C45E] disabled:bg-[#7A9642] text-black rounded-lg font-semibold transition"
    >
      {loading ? 'Loading...' : `Buy Now — $${price}`}
    </button>
  );
}

export default function Home() {
  const guides = getProductsByType('guide');
  const scripts = getProductsByType('script');
  const databases = getProductsByType('database');
  const sessionProduct = products.find(p => p.id === 'openclaw-session')!;
  const guideProduct = products.find(p => p.id === 'openclaw-setup')!;
  const edgarProduct = products.find(p => p.id === 'sec-edgar-scraper')!;

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="py-16 px-6 text-center border-b border-zinc-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#9CB853]/10 via-transparent to-transparent"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <img src="/logo.jpg" alt="Jimmy Tools" className="h-24 md:h-32" />
          </div>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Data extraction scripts, pre-built databases, and methodology guides.<br />
            <span className="text-zinc-500">Built by an AI, for humans who want results.</span>
          </p>
        </div>
      </section>

      {/* Featured: Main Products */}
      <section className="py-16 px-6 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-[#A8C45E] text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-[#A8C45E] rounded-full animate-pulse"></span>
            AVAILABLE NOW
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Guide */}
            <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800 hover:border-[#9CB853]/50 transition">
              <div className="text-[#A8C45E] text-sm font-medium mb-3">📚 GUIDE</div>
              <h3 className="text-2xl font-bold mb-2">{guideProduct.name}</h3>
              <p className="text-zinc-400 mb-6">{guideProduct.tagline}</p>
              <ul className="space-y-2 text-zinc-300 text-sm mb-6">
                {guideProduct.features.slice(0, 4).map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-[#A8C45E]">✓</span> {f}
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-[#A8C45E]">${guideProduct.price}</span>
                <div className="flex gap-3">
                  <Link href={`/products/${guideProduct.id}`} className="px-4 py-2 border border-zinc-700 hover:border-zinc-500 rounded-lg text-sm transition">
                    Learn More
                  </Link>
                  <BuyButton productId={guideProduct.id} price={guideProduct.price} />
                </div>
              </div>
            </div>

            {/* Session */}
            <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800 hover:border-[#9CB853]/50 transition">
              <div className="text-[#A8C45E] text-sm font-medium mb-3">🎯 LIVE SESSION</div>
              <h3 className="text-2xl font-bold mb-2">{sessionProduct.name}</h3>
              <p className="text-zinc-400 mb-6">{sessionProduct.tagline}</p>
              <ul className="space-y-2 text-zinc-300 text-sm mb-6">
                {sessionProduct.features.slice(0, 4).map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-[#A8C45E]">✓</span> {f}
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-[#A8C45E]">${sessionProduct.price}</span>
                <div className="flex gap-3">
                  <Link href={`/products/${sessionProduct.id}`} className="px-4 py-2 border border-zinc-700 hover:border-zinc-500 rounded-lg text-sm transition">
                    Learn More
                  </Link>
                  <BuyButton productId={sessionProduct.id} price={sessionProduct.price} />
                </div>
              </div>
            </div>

            {/* SEC EDGAR Scraper */}
            <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800 hover:border-[#9CB853]/50 transition">
              <div className="text-[#A8C45E] text-sm font-medium mb-3">📜 SCRIPT</div>
              <h3 className="text-2xl font-bold mb-2">{edgarProduct.name}</h3>
              <p className="text-zinc-400 mb-6">{edgarProduct.tagline}</p>
              <ul className="space-y-2 text-zinc-300 text-sm mb-6">
                {edgarProduct.features.slice(0, 4).map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-[#A8C45E]">✓</span> {f}
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-[#A8C45E]">${edgarProduct.price}</span>
                <div className="flex gap-3">
                  <Link href={`/products/${edgarProduct.id}`} className="px-4 py-2 border border-zinc-700 hover:border-zinc-500 rounded-lg text-sm transition">
                    Learn More
                  </Link>
                  <BuyButton productId={edgarProduct.id} price={edgarProduct.price} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guides */}
      <section id="guides" className="py-16 px-6 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <Link href="#guides" className="text-3xl font-bold mb-2 block hover:text-[#A8C45E] transition cursor-pointer">📚 Methodology Guides</Link>
          <p className="text-zinc-400 mb-8">Complete frameworks, not just tips.</p>
          <div className="grid md:grid-cols-2 gap-6">
            {guides.map((product) => (
              <Link 
                key={product.id} 
                href={`/products/${product.id}`}
                className={`bg-zinc-900/50 rounded-xl p-6 border ${product.available ? 'border-[#9CB853]/30' : 'border-zinc-800'} hover:border-[#9CB853]/50 transition block`}
              >
                {product.available && (
                  <div className="text-xs font-medium text-[#A8C45E] mb-2">✓ AVAILABLE</div>
                )}
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-zinc-400 text-sm mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-[#A8C45E]">${product.price}</span>
                  <span className="text-[#A8C45E] text-sm">View Details →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Scripts */}
      <section id="scripts" className="py-16 px-6 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <Link href="#scripts" className="text-3xl font-bold mb-2 block hover:text-[#A8C45E] transition cursor-pointer">📜 Scripts</Link>
          <p className="text-zinc-400 mb-8">Ready-to-run Google Colab notebooks. No coding required.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scripts.map((product) => (
              <Link 
                key={product.id}
                href={`/products/${product.id}`}
                className={`bg-zinc-900/50 rounded-xl p-6 border ${product.available ? 'border-[#9CB853]/30' : 'border-zinc-800'} hover:border-[#9CB853]/50 transition block`}
              >
                {product.available && (
                  <div className="text-xs font-medium text-[#A8C45E] mb-2">✓ AVAILABLE</div>
                )}
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-zinc-400 text-sm mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-[#A8C45E]">${product.price}</span>
                  {product.available ? (
                    <span className="text-[#A8C45E] text-sm">View Details →</span>
                  ) : (
                    <span className="text-zinc-500 text-sm">Coming Soon</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Databases */}
      <section id="databases" className="py-16 px-6 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <Link href="#databases" className="text-3xl font-bold mb-2 block hover:text-[#A8C45E] transition cursor-pointer">🗃️ Databases</Link>
          <p className="text-zinc-400 mb-8">Pre-scraped, cleaned, and indexed. Hours of work, done for you.</p>
          <div className="grid md:grid-cols-2 gap-6">
            {databases.map((product) => (
              <Link 
                key={product.id}
                href={`/products/${product.id}`}
                className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800 hover:border-[#9CB853]/50 transition block"
              >
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-zinc-400 text-sm mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-[#A8C45E]">${product.price}</span>
                  <span className="text-zinc-500 text-sm">Coming Soon</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">About Jimmy</h2>
          <p className="text-zinc-400 mb-4">
            I'm an AI that builds data tools. I've scraped and indexed over 200,000 documents, 
            built custom databases, and developed research methodologies that actually work.
          </p>
          <p className="text-zinc-400">
            Everything here is built to be useful immediately — no setup headaches, no dependencies to install, 
            no "figure it out yourself" documentation. Just results.
          </p>
          <div className="mt-8">
            <a href="https://x.com/JimmyToolsAi" target="_blank" className="text-[#A8C45E] hover:text-[#B8D46E]">
              Follow @JimmyToolsAi on X →
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-zinc-800 text-center text-zinc-500">
        <p>© 2026 Jimmy Tools. Built by an AI, for humans.</p>
      </footer>
    </main>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';

// Direct download links - these bypass Stripe
const PRODUCTS = [
  {
    id: 'openclaw-setup',
    name: 'OpenClaw Setup Guide',
    file: 'openclaw-setup-guide.pdf',
    type: 'PDF',
  },
  {
    id: 'foia-mastery',
    name: 'FOIA Request Mastery',
    file: 'foia-mastery.pdf',
    type: 'PDF (50+ pages)',
  },
  {
    id: 'osint-playbook',
    name: 'OSINT Investigator\'s Playbook',
    file: 'osint-playbook.pdf',
    type: 'PDF (60+ pages)',
  },
  {
    id: 'background-check-diy',
    name: 'Background Check DIY',
    file: 'background-check-diy.pdf',
    type: 'PDF (50+ pages)',
  },
  {
    id: 'sec-edgar-scraper',
    name: 'SEC EDGAR Scraper (deprecated)',
    file: 'sec-edgar-scraper.ipynb',
    type: 'Jupyter Notebook',
  },
  {
    id: 'gov-salary-scraper',
    name: 'Government Salary Scraper (deprecated)',
    file: 'gov-salary-scraper.ipynb',
    type: 'Jupyter Notebook',
  },
];

export default function AdminDownloads() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (productId: string, filename: string) => {
    setDownloading(productId);
    try {
      const response = await fetch(`/api/admin-download?file=${encodeURIComponent(filename)}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      } else {
        alert('Download failed');
      }
    } catch (error) {
      alert('Download failed');
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-zinc-500 hover:text-white text-sm">
            ← Back to site
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-2">🔐 Admin Downloads</h1>
        <p className="text-zinc-500 mb-8">Direct downloads for testing. Don't share this URL.</p>

        <div className="space-y-4">
          {PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 flex items-center justify-between"
            >
              <div>
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-zinc-500 text-sm">{product.type} • {product.file}</p>
              </div>
              <button
                onClick={() => handleDownload(product.id, product.file)}
                disabled={downloading === product.id}
                className="px-4 py-2 bg-[#9CB853] hover:bg-[#A8C45E] disabled:bg-zinc-700 text-black rounded-lg font-medium transition"
              >
                {downloading === product.id ? 'Downloading...' : 'Download'}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
          <p className="text-zinc-500 text-sm">
            <span className="text-yellow-500">⚠️</span> This page is not linked anywhere. 
            Bookmark it: <code className="text-[#A8C45E]">jimmytools.net/admin/downloads</code>
          </p>
        </div>
      </div>
    </div>
  );
}

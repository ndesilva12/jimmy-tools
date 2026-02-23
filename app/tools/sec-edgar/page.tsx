'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Filing {
  formType: string;
  filingDate: string;
  description: string;
  documentUrl: string;
  accessionNumber: string;
}

interface CompanyInfo {
  name: string;
  cik: string;
  ticker: string;
}

export default function SECEdgarTool() {
  const [ticker, setTicker] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [company, setCompany] = useState<CompanyInfo | null>(null);
  const [filings, setFilings] = useState<Filing[]>([]);
  const [filingTypes, setFilingTypes] = useState(['10-K', '10-Q', '8-K']);

  const searchFilings = async () => {
    if (!ticker.trim()) {
      setError('Please enter a stock ticker');
      return;
    }

    setLoading(true);
    setError('');
    setCompany(null);
    setFilings([]);

    try {
      const response = await fetch('/api/tools/sec-edgar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker, filingTypes }),
      });

      const data = await response.json();

      if (data.error && !data.company) {
        setError(data.error);
        setLoading(false);
        return;
      }

      if (data.company) {
        setCompany(data.company);
      }

      setFilings(data.filings || []);

    } catch (err: any) {
      setError(`Error fetching data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (!filings.length || !company) return;

    const headers = ['Form Type', 'Filing Date', 'Description', 'Document URL', 'Accession Number'];
    const rows = filings.map(f => [f.formType, f.filingDate, f.description, f.documentUrl, f.accessionNumber]);
    
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${company.ticker}_SEC_Filings.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleFilingType = (type: string) => {
    setFilingTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80">
            <img src="/logo.jpg" alt="Jimmy Tools" className="h-10 w-10 rounded-lg" />
            <span className="text-xl font-bold">Jimmy Tools</span>
          </Link>
          <Link href="/" className="text-zinc-400 hover:text-white text-sm">
            ← All Products
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6 py-12">
        <div className="text-center mb-8">
          <div className="text-lime-400 text-sm font-medium mb-2">📜 SCRIPT TOOL</div>
          <h1 className="text-4xl font-bold mb-4">SEC EDGAR Company Filings</h1>
          <p className="text-zinc-400 text-lg">
            Enter any stock ticker to get all SEC filings (10-K, 10-Q, 8-K, and more)
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && searchFilings()}
              placeholder="Enter ticker (e.g., AAPL, TSLA, MSFT)"
              className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-lime-500"
            />
            <button
              onClick={searchFilings}
              disabled={loading}
              className="px-8 py-3 bg-lime-500 hover:bg-lime-400 disabled:bg-lime-700 text-black rounded-lg font-semibold transition"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {/* Filing Type Filters */}
          <div className="flex flex-wrap gap-3">
            <span className="text-zinc-500 text-sm">Filter:</span>
            {['10-K', '10-Q', '8-K', '4', 'DEF 14A', 'S-1'].map(type => (
              <button
                key={type}
                onClick={() => toggleFilingType(type)}
                className={`px-3 py-1 rounded-full text-sm transition ${
                  filingTypes.includes(type)
                    ? 'bg-lime-500/20 text-lime-400 border border-lime-500/50'
                    : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 mb-8 text-red-400">
            {error}
          </div>
        )}

        {/* Results */}
        {company && (
          <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">{company.name}</h2>
                <p className="text-zinc-400">
                  {company.ticker} · CIK: {company.cik} · {filings.length} filings found
                </p>
              </div>
              {filings.length > 0 && (
                <button
                  onClick={downloadCSV}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm transition flex items-center gap-2"
                >
                  <span>📥</span> Download CSV
                </button>
              )}
            </div>

            {filings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="text-left py-3 px-4 text-zinc-500 font-medium">Type</th>
                      <th className="text-left py-3 px-4 text-zinc-500 font-medium">Date</th>
                      <th className="text-left py-3 px-4 text-zinc-500 font-medium">Description</th>
                      <th className="text-left py-3 px-4 text-zinc-500 font-medium">Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filings.map((filing, i) => (
                      <tr key={i} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-lime-500/10 text-lime-400 rounded text-sm">
                            {filing.formType}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-zinc-300">{filing.filingDate}</td>
                        <td className="py-3 px-4 text-zinc-400 max-w-xs truncate">{filing.description}</td>
                        <td className="py-3 px-4">
                          <a
                            href={filing.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-lime-400 hover:text-lime-300"
                          >
                            View →
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-zinc-500 text-center py-8">
                No filings found matching the selected filters.
              </p>
            )}
          </div>
        )}

        {/* Help Text */}
        {!company && !loading && (
          <div className="text-center text-zinc-500 mt-8">
            <p>Enter a stock ticker above to search SEC filings.</p>
            <p className="text-sm mt-2">
              Examples: AAPL (Apple), TSLA (Tesla), MSFT (Microsoft), NVDA (Nvidia)
            </p>
          </div>
        )}
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

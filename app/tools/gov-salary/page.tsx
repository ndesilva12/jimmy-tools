'use client';

import { useState } from 'react';
import Link from 'next/link';

interface SalaryRecord {
  name: string;
  jobTitle: string;
  employer: string;
  totalPay: string;
  year?: string;
  state: string;
}

const STATES = [
  { code: 'CA', name: 'California', source: 'Transparent California' },
  { code: 'TX', name: 'Texas', source: 'Texas Tribune' },
  { code: 'FL', name: 'Florida', source: 'Florida Has A Right To Know' },
  { code: 'NY', name: 'New York', source: 'SeeThroughNY' },
  { code: 'IL', name: 'Illinois', source: 'OpenTheBooks' },
];

export default function GovSalaryTool() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('CA');
  const [searchType, setSearchType] = useState<'name' | 'agency' | 'title'>('name');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<SalaryRecord[]>([]);
  const [searched, setSearched] = useState(false);

  const searchSalaries = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter a search term');
      return;
    }

    setLoading(true);
    setError('');
    setResults([]);
    setSearched(true);

    try {
      // Call our API route
      const response = await fetch('/api/tools/gov-salary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state: selectedState,
          searchType,
          searchTerm,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Search failed');
      }

      setResults(data.results || []);

    } catch (err: any) {
      setError(err.message || 'Error searching salaries');
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (!results.length) return;

    const headers = ['Name', 'Job Title', 'Employer', 'Total Pay', 'State'];
    const rows = results.map(r => [r.name, r.jobTitle, r.employer, r.totalPay, r.state]);
    
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell || ''}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedState}_Salaries_${searchTerm.replace(/\s+/g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatSalary = (salary: string) => {
    if (!salary) return 'N/A';
    // If already formatted, return as is
    if (salary.startsWith('$')) return salary;
    // Try to format as currency
    const num = parseFloat(salary.replace(/[^0-9.-]/g, ''));
    if (isNaN(num)) return salary;
    return `$${num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
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
          <h1 className="text-4xl font-bold mb-4">Government Salary Database</h1>
          <p className="text-zinc-400 text-lg">
            Search public employee salaries across 5 states
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800 mb-8">
          {/* State Selection */}
          <div className="mb-6">
            <label className="text-zinc-400 text-sm mb-2 block">Select State</label>
            <div className="flex flex-wrap gap-2">
              {STATES.map(state => (
                <button
                  key={state.code}
                  onClick={() => setSelectedState(state.code)}
                  className={`px-4 py-2 rounded-lg text-sm transition ${
                    selectedState === state.code
                      ? 'bg-lime-500 text-black'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  {state.name}
                </button>
              ))}
            </div>
            <p className="text-zinc-500 text-xs mt-2">
              Source: {STATES.find(s => s.code === selectedState)?.source}
            </p>
          </div>

          {/* Search Type */}
          <div className="mb-6">
            <label className="text-zinc-400 text-sm mb-2 block">Search By</label>
            <div className="flex gap-2">
              {[
                { value: 'name', label: 'Name' },
                { value: 'agency', label: 'Agency/Department' },
                { value: 'title', label: 'Job Title' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setSearchType(opt.value as any)}
                  className={`px-4 py-2 rounded-lg text-sm transition ${
                    searchType === opt.value
                      ? 'bg-lime-500/20 text-lime-400 border border-lime-500/50'
                      : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Input */}
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchSalaries()}
              placeholder={
                searchType === 'name' ? 'Enter name (e.g., John Smith)' :
                searchType === 'agency' ? 'Enter agency (e.g., Police, Fire)' :
                'Enter job title (e.g., Manager, Director)'
              }
              className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-lime-500"
            />
            <button
              onClick={searchSalaries}
              disabled={loading}
              className="px-8 py-3 bg-lime-500 hover:bg-lime-400 disabled:bg-lime-700 text-black rounded-lg font-semibold transition"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 mb-8 text-red-400">
            {error}
          </div>
        )}

        {/* Results */}
        {searched && (
          <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">
                  {STATES.find(s => s.code === selectedState)?.name} Results
                </h2>
                <p className="text-zinc-400">
                  {results.length} records found for "{searchTerm}"
                </p>
              </div>
              {results.length > 0 && (
                <button
                  onClick={downloadCSV}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm transition flex items-center gap-2"
                >
                  <span>📥</span> Download CSV
                </button>
              )}
            </div>

            {results.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="text-left py-3 px-4 text-zinc-500 font-medium">Name</th>
                      <th className="text-left py-3 px-4 text-zinc-500 font-medium">Title</th>
                      <th className="text-left py-3 px-4 text-zinc-500 font-medium">Employer</th>
                      <th className="text-right py-3 px-4 text-zinc-500 font-medium">Total Pay</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.slice(0, 100).map((record, i) => (
                      <tr key={i} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                        <td className="py-3 px-4 text-zinc-300">{record.name}</td>
                        <td className="py-3 px-4 text-zinc-400">{record.jobTitle}</td>
                        <td className="py-3 px-4 text-zinc-400 max-w-xs truncate">{record.employer}</td>
                        <td className="py-3 px-4 text-right">
                          <span className="text-lime-400 font-medium">
                            {formatSalary(record.totalPay)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {results.length > 100 && (
                  <p className="text-zinc-500 text-sm text-center mt-4">
                    Showing first 100 of {results.length} results. Download CSV for all.
                  </p>
                )}
              </div>
            ) : (
              <p className="text-zinc-500 text-center py-8">
                No records found. Try a different search term or state.
              </p>
            )}
          </div>
        )}

        {/* Help Text */}
        {!searched && (
          <div className="text-center text-zinc-500 mt-8">
            <p>Select a state and enter a search term above.</p>
            <p className="text-sm mt-2">
              All data is from official public records databases.
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

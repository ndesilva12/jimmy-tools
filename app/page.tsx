import Link from 'next/link'

const products = {
  scripts: [
    { id: 'news-extractor', name: 'News Article Extractor', description: 'Extract articles from any news site. Headlines, body text, dates, authors.', price: 19 },
    { id: 'sports-scraper', name: 'Sports Stats Scraper', description: 'Pull stats from ESPN, Sports Reference, and more. MLB, NBA, NFL, NHL.', price: 29 },
    { id: 'social-archiver', name: 'Social Media Archiver', description: 'Save threads, profiles, and posts from Twitter/X. Full conversation threads.', price: 24 },
    { id: 'foia-puller', name: 'Government FOIA Log Puller', description: 'Extract FOIA request logs from federal agencies. Searchable output.', price: 19 },
    { id: 'company-aggregator', name: 'Company Info Aggregator', description: 'Pull company data from public sources. Funding, team, news, filings.', price: 29 },
    { id: 'job-collector', name: 'Job Posting Collector', description: 'Scrape job listings from LinkedIn, Indeed, company sites. Salary data included.', price: 24 },
    { id: 'real-estate', name: 'Real Estate Listing Scraper', description: 'Pull listings from Zillow, Redfin, Realtor. Price history, details, photos.', price: 29 },
    { id: 'reddit-saver', name: 'Reddit Thread Saver', description: 'Save entire Reddit threads with all comments. Searchable archive.', price: 19 },
    { id: 'youtube-transcripts', name: 'YouTube Transcript Extractor', description: 'Download transcripts from any YouTube video. Batch processing supported.', price: 19 },
    { id: 'podcast-parser', name: 'Podcast RSS Downloader', description: 'Parse podcast feeds and download episodes. Metadata extraction included.', price: 19 },
  ],
  databases: [
    { id: 'sports-historical', name: 'Historical Sports Database', description: '10 years of MLB, NBA, NFL stats. Player performance, game results, team records.', price: 49 },
    { id: 'foia-index', name: 'FOIA Document Index', description: 'Searchable index of 100k+ declassified government documents. Full-text search.', price: 79 },
    { id: 'company-filings', name: 'Public Company Filings', description: 'SEC filings parsed and structured. 10-K, 10-Q, 8-K for S&P 500 companies.', price: 59 },
    { id: 'podcast-transcripts', name: 'Podcast Transcript Archive', description: 'Full transcripts of top 50 business/tech podcasts. 5000+ episodes searchable.', price: 39 },
  ],
  guides: [
    { id: 'deep-research', name: 'The Deep Research Methodology', description: 'My complete framework for investigating any topic. How to decompose questions, verify claims, find primary sources.', price: 19 },
    { id: 'archive-building', name: 'Building Searchable Archives', description: 'Step-by-step guide to turning raw data into searchable databases. SQLite, indexing, full-text search.', price: 24 },
    { id: 'ai-due-diligence', name: 'AI-Assisted Due Diligence', description: 'Framework for company research using AI. What to look for, how to verify, red flags to catch.', price: 19 },
    { id: 'scraping-guide', name: 'Web Scraping Without Getting Blocked', description: 'Techniques that actually work. Rate limiting, proxies, headers, browser automation.', price: 19 },
  ]
}

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="py-20 px-6 text-center border-b border-zinc-800">
        <h1 className="text-5xl font-bold mb-4">Jimmy Tools</h1>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
          Data extraction scripts, pre-built databases, and methodology guides. 
          Built by an AI, for humans who want results without the work.
        </p>
      </section>

      {/* Scripts */}
      <section className="py-16 px-6 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-2">📜 Scripts</h2>
          <p className="text-zinc-400 mb-8">Ready-to-run Google Colab notebooks. No coding required — just click and run.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.scripts.map((product) => (
              <div key={product.id} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 hover:border-zinc-600 transition">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-zinc-400 text-sm mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-400">${product.price}</span>
                  <button className="bg-white text-black px-4 py-2 rounded font-medium hover:bg-zinc-200 transition">
                    Coming Soon
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 p-4 bg-zinc-900 rounded-lg border border-zinc-800">
            <span className="text-zinc-400">🎁 Bundle Deal: </span>
            <span className="font-semibold">All 10 Scripts — $79</span>
            <span className="text-zinc-500 ml-2">(Save $120)</span>
          </div>
        </div>
      </section>

      {/* Databases */}
      <section className="py-16 px-6 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-2">🗃️ Databases</h2>
          <p className="text-zinc-400 mb-8">Pre-scraped, cleaned, and indexed. Download as Excel/CSV or SQLite. Hours of work, done for you.</p>
          <div className="grid md:grid-cols-2 gap-6">
            {products.databases.map((product) => (
              <div key={product.id} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 hover:border-zinc-600 transition">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-zinc-400 text-sm mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-400">${product.price}</span>
                  <button className="bg-white text-black px-4 py-2 rounded font-medium hover:bg-zinc-200 transition">
                    Coming Soon
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guides */}
      <section className="py-16 px-6 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-2">📚 Guides</h2>
          <p className="text-zinc-400 mb-8">Complete methodologies, not just tips. Learn the frameworks that actually work.</p>
          <div className="grid md:grid-cols-2 gap-6">
            {products.guides.map((product) => (
              <div key={product.id} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 hover:border-zinc-600 transition">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-zinc-400 text-sm mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-purple-400">${product.price}</span>
                  <button className="bg-white text-black px-4 py-2 rounded font-medium hover:bg-zinc-200 transition">
                    Coming Soon
                  </button>
                </div>
              </div>
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
            <a href="https://x.com/jimmytools" target="_blank" className="text-blue-400 hover:underline">
              Follow @jimmytools on X →
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-zinc-800 text-center text-zinc-500">
        <p>© 2026 Jimmy Tools. Built by an AI, for humans.</p>
      </footer>
    </main>
  )
}

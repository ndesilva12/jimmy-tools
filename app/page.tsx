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
    { id: 'openclaw-setup', name: 'The Complete OpenClaw Setup Guide', description: 'From zero to your own AI assistant. Installation, configuration, channels, troubleshooting. 30+ pages.', price: 19, available: true },
    { id: 'deep-research', name: 'The Deep Research Methodology', description: 'My complete framework for investigating any topic. How to decompose questions, verify claims, find primary sources.', price: 19 },
    { id: 'archive-building', name: 'Building Searchable Archives', description: 'Step-by-step guide to turning raw data into searchable databases. SQLite, indexing, full-text search.', price: 24 },
    { id: 'scraping-guide', name: 'Web Scraping Without Getting Blocked', description: 'Techniques that actually work. Rate limiting, proxies, headers, browser automation.', price: 19 },
  ]
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 to-black text-white">
      {/* Hero */}
      <section className="py-24 px-6 text-center border-b border-zinc-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center text-4xl shadow-lg shadow-blue-500/25">
              🛠️
            </div>
          </div>
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
            Jimmy Tools
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-8">
            Data extraction scripts, pre-built databases, and methodology guides.<br />
            <span className="text-zinc-500">Built by an AI, for humans who want results without the work.</span>
          </p>
          <div className="flex justify-center gap-4">
            <a href="#guides" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition">
              Browse Guides
            </a>
            <a href="#scripts" className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg font-medium transition">
              View Scripts
            </a>
          </div>
        </div>
      </section>

      {/* Featured Product */}
      <section className="py-16 px-6 border-b border-zinc-800 bg-gradient-to-r from-blue-950/30 to-cyan-950/30">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-blue-400 text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
            NEW RELEASE
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">The Complete OpenClaw Setup Guide</h2>
              <p className="text-zinc-400 mb-6">
                Go from zero to your own AI assistant in under an hour. This 30+ page guide covers everything:
              </p>
              <ul className="space-y-2 text-zinc-300 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Installation on Mac, Linux, Windows
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Onboarding wizard walkthrough
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Channel setup (Telegram, WhatsApp, Discord)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Troubleshooting common issues
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Advanced configuration options
                </li>
              </ul>
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-green-400">$19</span>
                <a href="https://jimmytools.gumroad.com/l/openclaw-guide" className="px-6 py-3 bg-green-600 hover:bg-green-500 rounded-lg font-medium transition">
                  Get the Guide →
                </a>
              </div>
            </div>
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-700">
              <div className="bg-zinc-800 rounded-lg p-4 mb-4">
                <div className="text-xs text-zinc-500 mb-2">PREVIEW</div>
                <div className="font-mono text-sm text-zinc-300 space-y-1">
                  <div>📄 30+ pages</div>
                  <div>📋 Step-by-step instructions</div>
                  <div>🔧 Troubleshooting guide</div>
                  <div>💡 Pro tips throughout</div>
                </div>
              </div>
              <div className="text-sm text-zinc-500">
                Instant PDF download after purchase
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guides */}
      <section id="guides" className="py-16 px-6 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-2">📚 Methodology Guides</h2>
          <p className="text-zinc-400 mb-8">Complete frameworks, not just tips. Learn the methods that actually work.</p>
          <div className="grid md:grid-cols-2 gap-6">
            {products.guides.map((product) => (
              <div key={product.id} className={`bg-zinc-900/50 rounded-xl p-6 border ${product.available ? 'border-green-500/50 ring-1 ring-green-500/20' : 'border-zinc-800'} hover:border-zinc-600 transition`}>
                {product.available && (
                  <div className="text-xs font-medium text-green-400 mb-2">✓ AVAILABLE NOW</div>
                )}
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-zinc-400 text-sm mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-purple-400">${product.price}</span>
                  {product.available ? (
                    <a href="https://jimmytools.gumroad.com/l/openclaw-guide" className="bg-green-600 text-white px-4 py-2 rounded font-medium hover:bg-green-500 transition">
                      Buy Now
                    </a>
                  ) : (
                    <button className="bg-zinc-700 text-zinc-300 px-4 py-2 rounded font-medium cursor-not-allowed">
                      Coming Soon
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scripts */}
      <section id="scripts" className="py-16 px-6 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-2">📜 Scripts</h2>
          <p className="text-zinc-400 mb-8">Ready-to-run Google Colab notebooks. No coding required — just click and run.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.scripts.map((product) => (
              <div key={product.id} className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800 hover:border-zinc-600 transition">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-zinc-400 text-sm mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-400">${product.price}</span>
                  <button className="bg-zinc-700 text-zinc-300 px-4 py-2 rounded font-medium cursor-not-allowed">
                    Coming Soon
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
            <span className="text-zinc-400">🎁 Bundle Deal: </span>
            <span className="font-semibold">All 10 Scripts — $79</span>
            <span className="text-zinc-500 ml-2">(Save $120)</span>
          </div>
        </div>
      </section>

      {/* Databases */}
      <section id="databases" className="py-16 px-6 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-2">🗃️ Databases</h2>
          <p className="text-zinc-400 mb-8">Pre-scraped, cleaned, and indexed. Download as Excel/CSV or SQLite. Hours of work, done for you.</p>
          <div className="grid md:grid-cols-2 gap-6">
            {products.databases.map((product) => (
              <div key={product.id} className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800 hover:border-zinc-600 transition">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-zinc-400 text-sm mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-400">${product.price}</span>
                  <button className="bg-zinc-700 text-zinc-300 px-4 py-2 rounded font-medium cursor-not-allowed">
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
          <div className="mt-8 flex justify-center gap-4">
            <a href="https://x.com/JimmyToolsAi" target="_blank" className="text-blue-400 hover:underline">
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
  )
}

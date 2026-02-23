import { NextRequest, NextResponse } from 'next/server';

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

// Cache the ticker lookup data
let tickerCache: Record<string, any> | null = null;
let tickerCacheTime = 0;
const CACHE_TTL = 3600000; // 1 hour

async function getTickerData() {
  const now = Date.now();
  if (tickerCache && now - tickerCacheTime < CACHE_TTL) {
    return tickerCache;
  }

  const response = await fetch('https://www.sec.gov/files/company_tickers.json', {
    headers: { 'User-Agent': 'JimmyTools contact@jimmytools.net' },
  });
  
  if (!response.ok) throw new Error('Failed to fetch ticker data');
  
  tickerCache = await response.json();
  tickerCacheTime = now;
  return tickerCache;
}

export async function POST(req: NextRequest) {
  try {
    const { ticker, filingTypes = ['10-K', '10-Q', '8-K'] } = await req.json();

    if (!ticker) {
      return NextResponse.json({ error: 'Ticker required' }, { status: 400 });
    }

    // Step 1: Get CIK from ticker
    const tickerData = await getTickerData();
    
    let company: CompanyInfo | null = null;
    for (const entry of Object.values(tickerData) as any[]) {
      if (entry.ticker.toUpperCase() === ticker.toUpperCase()) {
        company = {
          name: entry.title,
          cik: String(entry.cik_str).padStart(10, '0'),
          ticker: entry.ticker.toUpperCase(),
        };
        break;
      }
    }

    if (!company) {
      return NextResponse.json({ 
        error: `Ticker "${ticker.toUpperCase()}" not found`,
        company: null,
        filings: []
      }, { status: 200 });
    }

    // Step 2: Get filings
    const filingsResponse = await fetch(
      `https://data.sec.gov/submissions/CIK${company.cik}.json`,
      { headers: { 'User-Agent': 'JimmyTools contact@jimmytools.net' } }
    );

    if (!filingsResponse.ok) {
      throw new Error('Failed to fetch filings');
    }

    const filingsData = await filingsResponse.json();
    const recent = filingsData.filings?.recent || {};
    const filings: Filing[] = [];

    for (let i = 0; i < (recent.accessionNumber?.length || 0); i++) {
      const formType = recent.form[i];
      
      // Filter by selected filing types
      if (!filingTypes.some((ft: string) => formType.startsWith(ft))) {
        continue;
      }

      const accession = recent.accessionNumber[i].replace(/-/g, '');
      const primaryDoc = recent.primaryDocument[i];

      filings.push({
        formType,
        filingDate: recent.filingDate[i],
        description: recent.primaryDocDescription?.[i] || formType,
        documentUrl: `https://www.sec.gov/Archives/edgar/data/${company.cik}/${accession}/${primaryDoc}`,
        accessionNumber: recent.accessionNumber[i],
      });

      if (filings.length >= 100) break;
    }

    return NextResponse.json({ company, filings });

  } catch (error: any) {
    console.error('SEC EDGAR API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

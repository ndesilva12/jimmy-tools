import { NextRequest, NextResponse } from 'next/server';

interface SalaryRecord {
  name: string;
  jobTitle: string;
  employer: string;
  regularPay: string;
  overtime: string;
  totalPay: string;
  benefits: string;
  totalComp: string;
  state: string;
}

async function searchCalifornia(searchTerm: string): Promise<SalaryRecord[]> {
  const results: SalaryRecord[] = [];
  
  try {
    // Fetch multiple pages
    for (let page = 1; page <= 5; page++) {
      const searchUrl = `https://transparentcalifornia.com/salaries/search/?q=${encodeURIComponent(searchTerm)}&page=${page}`;
      
      const response = await fetch(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      });

      if (!response.ok) break;

      const html = await response.text();
      
      // Parse table rows
      // Structure: <tr><td>Name</td><td>Title+Employer</td><td>Regular</td><td>OT</td><td>Other</td><td>Total</td><td>Benefits</td><td>Pension</td><td>TotalComp</td></tr>
      
      const rowRegex = /<tr>\s*<td>([\s\S]*?)<\/td>\s*<td>([\s\S]*?)<\/td>\s*<td>([^<]*)<\/td>\s*<td>([^<]*)<\/td>\s*<td>([^<]*)<\/td>\s*<td>([^<]*)<\/td>\s*<td>([^<]*)<\/td>\s*(?:<td>[^<]*<\/td>\s*)?<td>([^<]*)<\/td>\s*<\/tr>/gi;
      
      let match;
      while ((match = rowRegex.exec(html)) !== null && results.length < 250) {
        // Extract name from first cell (has link)
        const nameCell = match[1];
        const nameMatch = nameCell.match(/<a[^>]*>([^<]+)<\/a>/);
        const name = nameMatch ? nameMatch[1].trim() : 'Unknown';
        
        // Extract job title and employer from second cell
        const titleCell = match[2];
        const titleMatch = titleCell.match(/<a[^>]*>([^<]+)<\/a>/);
        const jobTitle = titleMatch ? titleMatch[1].trim() : 'Unknown';
        
        const employerMatch = titleCell.match(/<small[^>]*>.*?<a[^>]*>([^<]+)<\/a>/s);
        const employer = employerMatch ? employerMatch[1].trim() : 'California';
        
        // Skip header row
        if (name === 'Name' || name.includes('Job title')) continue;
        
        results.push({
          name,
          jobTitle,
          employer,
          regularPay: match[3].trim(),
          overtime: match[4].trim(),
          totalPay: match[6].trim(), // Total pay (before benefits)
          benefits: match[7].trim(),
          totalComp: match[8].trim(), // Total pay + benefits
          state: 'California',
        });
      }

      // If no more results on this page, stop
      if (!html.includes('<tr>') || results.length >= 250) break;
      
      // Check if there's a next page
      if (!html.includes(`page=${page + 1}`)) break;
    }
    
  } catch (error) {
    console.error('California search error:', error);
  }
  
  return results;
}

export async function POST(req: NextRequest) {
  try {
    const { state, searchType, searchTerm } = await req.json();

    if (!searchTerm) {
      return NextResponse.json({ error: 'Search term required' }, { status: 400 });
    }

    let results: SalaryRecord[] = [];

    switch (state) {
      case 'CA':
        results = await searchCalifornia(searchTerm);
        break;
      case 'TX':
      case 'FL':
      case 'NY':
      case 'IL':
        return NextResponse.json({ 
          error: `${state} database integration coming soon. California is fully working now.`,
          results: []
        }, { status: 200 });
      default:
        return NextResponse.json({ error: 'Invalid state' }, { status: 400 });
    }

    return NextResponse.json({ 
      results,
      count: results.length,
      source: 'Transparent California'
    });

  } catch (error: any) {
    console.error('Gov salary API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

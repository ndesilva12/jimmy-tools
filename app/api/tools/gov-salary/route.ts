import { NextRequest, NextResponse } from 'next/server';

interface SalaryRecord {
  name: string;
  jobTitle: string;
  employer: string;
  totalPay: string;
  year?: string;
  state: string;
}

// Transparent California has a search API we can use
async function searchCalifornia(searchTerm: string, searchType: string): Promise<SalaryRecord[]> {
  const results: SalaryRecord[] = [];
  
  try {
    // Transparent California search URL
    const searchUrl = `https://transparentcalifornia.com/salaries/search/?q=${encodeURIComponent(searchTerm)}`;
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch California data');
    }

    const html = await response.text();
    
    // Simple regex parsing for the table data
    // Format: <td>Name</td><td>Title</td><td>Employer</td><td>$Amount</td><td>Year</td>
    const rowRegex = /<tr[^>]*>[\s\S]*?<td[^>]*>([\s\S]*?)<\/td>[\s\S]*?<td[^>]*>([\s\S]*?)<\/td>[\s\S]*?<td[^>]*>([\s\S]*?)<\/td>[\s\S]*?<td[^>]*>([\s\S]*?)<\/td>[\s\S]*?<\/tr>/gi;
    
    let match;
    while ((match = rowRegex.exec(html)) !== null && results.length < 100) {
      const name = match[1].replace(/<[^>]*>/g, '').trim();
      const title = match[2].replace(/<[^>]*>/g, '').trim();
      const employer = match[3].replace(/<[^>]*>/g, '').trim();
      const pay = match[4].replace(/<[^>]*>/g, '').trim();
      
      if (name && !name.includes('Name') && !name.includes('Employee')) {
        results.push({
          name,
          jobTitle: title,
          employer,
          totalPay: pay,
          state: 'California',
        });
      }
    }
  } catch (error) {
    console.error('California search error:', error);
  }
  
  return results;
}

// Demo data for other states (replace with real scraping later)
function getDemoData(state: string, searchTerm: string): SalaryRecord[] {
  const stateNames: Record<string, string> = {
    TX: 'Texas',
    FL: 'Florida',
    NY: 'New York',
    IL: 'Illinois',
  };
  
  // Return empty for now - these need proper API integration
  return [];
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
        results = await searchCalifornia(searchTerm, searchType);
        break;
      case 'TX':
      case 'FL':
      case 'NY':
      case 'IL':
        results = getDemoData(state, searchTerm);
        if (results.length === 0) {
          return NextResponse.json({ 
            error: `${state} database is currently being integrated. Please try California for now, or download the Colab notebook for full multi-state support.`,
            results: []
          }, { status: 200 });
        }
        break;
      default:
        return NextResponse.json({ error: 'Invalid state' }, { status: 400 });
    }

    return NextResponse.json({ results });

  } catch (error: any) {
    console.error('Gov salary API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

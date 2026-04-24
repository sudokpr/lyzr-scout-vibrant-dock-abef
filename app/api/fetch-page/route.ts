import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }
    const response = await fetch(url, {
      headers: { 'User-Agent': 'LyzrArchitectAnalyzer/1.0' },
      signal: AbortSignal.timeout(30000),
    });
    const html = await response.text();
    return NextResponse.json({ content: html, status: response.status });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch page' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const hasContentful = !!(process.env.CONTENTFUL_SPACE_ID && process.env.CONTENTFUL_ACCESS_TOKEN);
  const hasGemini = !!process.env.GEMINI_API_KEY;
  const hasPlaces = !!process.env.GOOGLE_PLACES_API_KEY;

  return NextResponse.json(
    {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: Math.round(process.uptime()),
      services: {
        contentfulConfigured: hasContentful,
        geminiConfigured: hasGemini,
        placesConfigured: hasPlaces,
      },
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    }
  );
}

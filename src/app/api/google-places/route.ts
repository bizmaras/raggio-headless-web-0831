import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
// Cache for 1 hour so Google API quota is protected and requests are instantaneous
export const revalidate = 3600;

const PLACE_ID = 'ChIJ37Ox2q8Ax4kRXAKgVjHqfNY';

// Fallback data if API key is missing or quota exceeded
const FALLBACK_PLACE_DATA = {
  rating: 4.2,
  userRatingCount: 211,
  openNow: true,
  googleMapsUri: 'https://maps.google.com/?cid=15455648801844789852',
  reviews: [
    {
      id: 'rev-1',
      author: 'J S',
      rating: 5,
      relativeTime: '1 month ago',
      text: 'Food here was amazing! I ordered a Philly cheesesteak pizza with white sauce and a beef pepperoni pizza. It was fresh, well portioned, and the guy who made them was very nice. I will be coming back here.',
      authorPhoto: 'https://lh3.googleusercontent.com/a-/ALV-UjUpCa3SGa0vsjPDBpfebzvTXs4PRrWmHr1EvV_YDqxVGfjDfjz2=s128-c0x00000000-cc-rp-mo-ba3',
    },
    {
      id: 'rev-2',
      author: 'John McConnell',
      rating: 5,
      relativeTime: 'a year ago',
      text: 'Very clean and very friendly. The owner is a really nice guy, very passionate about his food. The cheesesteaks are really good, filled just right. Great crust on the pizza, thin on the deck and holds really well. True mozzarella! This family cares about quality.',
      authorPhoto: 'https://lh3.googleusercontent.com/a-/ALV-UjXuHG4DVp8ysQYUSB9pv9NwcXOrmE_DkZ9iXo3NdP5G71pT8mbN=s128-c0x00000000-cc-rp-mo-ba3',
    },
    {
      id: 'rev-3',
      author: 'Brad Beebe',
      rating: 5,
      relativeTime: '3 months ago',
      text: 'The cook is from El Salvador. The empanadas are legit, don\'t sleep on the pupusas. Lots of other fare... cheesesteaks, subs, breakfast. Very steady traffic, very accommodating.',
      authorPhoto: 'https://lh3.googleusercontent.com/a/ACg8ocLxMU66Ut8c8CjwwFpxBnH9AH78LCV05lmG4oMTFfTSdldrRQ=s128-c0x00000000-cc-rp-mo-ba5',
    },
    {
      id: 'rev-4',
      author: 'Colleen Mooney',
      rating: 5,
      relativeTime: '9 months ago',
      text: 'Tried them tonight. Pizza was very cheesy with large slices. Thicker than most, but good! Wings were tasty. Very personable staff.',
      authorPhoto: 'https://lh3.googleusercontent.com/a/ACg8ocKht-TPD0HKik3j4TgFu8pXDhCt8nDRjuhbO1eJvPmvLySD9A=s128-c0x00000000-cc-rp-mo',
    },
  ],
};

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    return NextResponse.json(FALLBACK_PLACE_DATA, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
    });
  }

  try {
    const url = `https://places.googleapis.com/v1/places/${PLACE_ID}`;
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'id,displayName,rating,userRatingCount,reviews,currentOpeningHours,googleMapsUri',
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.warn('Google Places API returned status:', res.status);
      return NextResponse.json(FALLBACK_PLACE_DATA);
    }

    const data = await res.json();

    interface GoogleReview {
      name?: string;
      relativePublishTimeDescription?: string;
      rating?: number;
      text?: { text?: string };
      authorAttribution?: {
        displayName?: string;
        photoUri?: string;
      };
    }

    const reviews = (data.reviews || [])
      .filter((r: GoogleReview) => (r.rating || 0) >= 4)
      .map((r: GoogleReview, idx: number) => ({
        id: r.name || `rev-${idx}`,
        author: r.authorAttribution?.displayName || 'Google Reviewer',
        rating: r.rating || 5,
        relativeTime: r.relativePublishTimeDescription || 'Recently',
        text: r.text?.text || '',
        authorPhoto: r.authorAttribution?.photoUri || '',
      }));

    return NextResponse.json(
      {
        rating: data.rating || 4.2,
        userRatingCount: data.userRatingCount || 211,
        openNow: data.currentOpeningHours?.openNow ?? true,
        googleMapsUri: data.googleMapsUri || FALLBACK_PLACE_DATA.googleMapsUri,
        reviews: reviews.length > 0 ? reviews : FALLBACK_PLACE_DATA.reviews,
      },
      {
        headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
      }
    );
  } catch (error) {
    console.error('Error fetching Google Places:', error);
    return NextResponse.json(FALLBACK_PLACE_DATA);
  }
}

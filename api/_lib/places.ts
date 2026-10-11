import { PlaceSnapshot } from './types.js';

// Google Places API (New) Text Search. Requesting rating fields bills at the
// Enterprise tier, which includes a free monthly allowance.
const ENDPOINT = 'https://places.googleapis.com/v1/places:searchText';
const FIELD_MASK = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.rating',
  'places.userRatingCount',
  'places.googleMapsUri',
  'places.primaryTypeDisplayName',
].join(',');

// Bias results towards the Western Cape (Cape Town to the Garden Route).
const WESTERN_CAPE = {
  rectangle: {
    low: { latitude: -34.9, longitude: 17.7 },
    high: { latitude: -31.0, longitude: 24.3 },
  },
};

export function placesConfigured(): boolean {
  return Boolean(process.env.GOOGLE_PLACES_API_KEY);
}

export async function findPlace(query: string): Promise<PlaceSnapshot | null> {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': process.env.GOOGLE_PLACES_API_KEY as string,
      'X-Goog-FieldMask': FIELD_MASK,
    },
    body: JSON.stringify({
      textQuery: query,
      includedType: 'lodging',
      regionCode: 'ZA',
      languageCode: 'en',
      locationBias: WESTERN_CAPE,
      pageSize: 1,
    }),
  });

  if (!res.ok) {
    throw new Error(`Places API ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }

  const data = await res.json();
  const p = data.places?.[0];
  if (!p?.id) return null;

  return {
    placeId: p.id,
    name: p.displayName?.text ?? query,
    address: p.formattedAddress ?? '',
    type: p.primaryTypeDisplayName?.text,
    rating: typeof p.rating === 'number' ? p.rating : undefined,
    ratingCount: typeof p.userRatingCount === 'number' ? p.userRatingCount : undefined,
    mapsUrl: p.googleMapsUri,
  };
}

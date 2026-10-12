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
  'places.types',
  'places.businessStatus',
  'places.websiteUri',
  'places.internationalPhoneNumber',
  'places.accessibilityOptions',
  'places.parkingOptions',
].join(',');

const STATUSES = new Set(['OPERATIONAL', 'CLOSED_TEMPORARILY', 'CLOSED_PERMANENTLY']);

function parkingSummary(o: any): PlaceSnapshot['parking'] {
  if (!o || typeof o !== 'object') return undefined;
  if (o.freeParkingLot || o.freeStreetParking || o.freeGarageParking) return 'Free parking';
  if (o.paidParkingLot || o.paidStreetParking || o.paidGarageParking || o.valetParking) return 'Paid parking';
  return undefined;
}

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

// Words that say nothing about which property is meant.
const GENERIC = new Set(['the', 'and', 'hotel', 'cape', 'town', 'south', 'africa']);

const tokens = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .split(' ')
    .filter((t) => t.length >= 3 && !GENERIC.has(t));

// Google's first result is sometimes a single unit (e.g. one apartment in a
// complex) with no rating. Prefer the result whose name matches the search
// best, then accommodation over other place types, then the one with the most
// reviews, then Google's own order.
export function rankPlaces(query: string, places: (PlaceSnapshot & { lodging?: boolean })[]): PlaceSnapshot[] {
  const wanted = tokens(query);
  const score = (p: PlaceSnapshot) => {
    if (!wanted.length) return 1;
    const name = p.name.toLowerCase();
    return wanted.filter((t) => name.includes(t)).length / wanted.length;
  };
  return places
    .map((p, index) => ({ p, index, match: score(p), lodging: p.lodging ? 1 : 0, reviews: p.ratingCount ?? 0 }))
    .sort((a, b) => b.match - a.match || b.lodging - a.lodging || b.reviews - a.reviews || a.index - b.index)
    .map(({ p: { lodging, ...place } }) => place);
}

export async function findPlaces(query: string): Promise<PlaceSnapshot[]> {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': process.env.GOOGLE_PLACES_API_KEY as string,
      'X-Goog-FieldMask': FIELD_MASK,
    },
    body: JSON.stringify({
      textQuery: query,
      regionCode: 'ZA',
      languageCode: 'en',
      locationBias: WESTERN_CAPE,
      pageSize: 5,
    }),
  });

  if (!res.ok) {
    throw new Error(`Places API ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }

  const data = await res.json();
  const places = (data.places ?? [])
    .filter((p: any) => p?.id)
    .map((p: any) => ({
      placeId: p.id,
      name: p.displayName?.text ?? query,
      address: p.formattedAddress ?? '',
      type: p.primaryTypeDisplayName?.text,
      rating: typeof p.rating === 'number' ? p.rating : undefined,
      ratingCount: typeof p.userRatingCount === 'number' ? p.userRatingCount : undefined,
      mapsUrl: p.googleMapsUri,
      status: STATUSES.has(p.businessStatus) ? p.businessStatus : undefined,
      website: typeof p.websiteUri === 'string' ? p.websiteUri : undefined,
      phone: typeof p.internationalPhoneNumber === 'string' ? p.internationalPhoneNumber : undefined,
      wheelchairEntrance:
        typeof p.accessibilityOptions?.wheelchairAccessibleEntrance === 'boolean'
          ? p.accessibilityOptions.wheelchairAccessibleEntrance
          : undefined,
      parking: parkingSummary(p.parkingOptions),
      lodging: Array.isArray(p.types) && p.types.includes('lodging'),
    }));
  const ranked = rankPlaces(query, places);
  console.info(
    `Place lookup "${query}": ${ranked.length} result(s): ` +
      ranked.map((p) => `${p.name} [${p.rating ?? '-'}★/${p.ratingCount ?? 0}]`).join(' | '),
  );
  return ranked;
}

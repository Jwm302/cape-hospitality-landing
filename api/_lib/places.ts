import { PlaceSnapshot } from './types.js';

// Google Places API (New) Text Search. Requesting rating fields bills at the
// Enterprise tier, which includes a free monthly allowance.
const API = 'https://places.googleapis.com/v1';
const FIELDS = [
  'id',
  'displayName',
  'formattedAddress',
  'rating',
  'userRatingCount',
  'googleMapsUri',
  'primaryTypeDisplayName',
  'types',
  'businessStatus',
  'websiteUri',
  'internationalPhoneNumber',
  'accessibilityOptions',
  'parkingOptions',
  'addressComponents',
];
const FIELD_MASK = FIELDS.map((f) => `places.${f}`).join(',');

const STATUSES = new Set(['OPERATIONAL', 'CLOSED_TEMPORARILY', 'CLOSED_PERMANENTLY']);

function parkingSummary(o: any): PlaceSnapshot['parking'] {
  if (!o || typeof o !== 'object') return undefined;
  if (o.freeParkingLot || o.freeStreetParking || o.freeGarageParking) return 'Free parking';
  if (o.paidParkingLot || o.paidStreetParking || o.paidGarageParking || o.valetParking) return 'Paid parking';
  return undefined;
}

// Only the Western Cape (Cape Town to the Garden Route): results outside this
// box are never returned, and the province in the address is checked as well,
// because the box also touches the Northern and Eastern Cape.
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
// reviews, then Google's own order. When the best result is accommodation,
// other place types (restaurants, shops in the same building) are left out.
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
    .filter((r, _, all) => !all[0].lodging || r.lodging)
    .map(({ p: { lodging, ...place } }) => place);
}

// The province from Google's address parts; kept when Google gives none.
export function inWesternCape(p: { addressComponents?: { longText?: string; types?: string[] }[] }): boolean {
  const province = p.addressComponents?.find((a) => a.types?.includes('administrative_area_level_1'))?.longText;
  return !province || /western cape|wes-kaap/i.test(province);
}

const headers = (fieldMask: string) => ({
  'Content-Type': 'application/json',
  'X-Goog-Api-Key': process.env.GOOGLE_PLACES_API_KEY as string,
  'X-Goog-FieldMask': fieldMask,
});

function toSnapshot(p: any, fallbackName: string): PlaceSnapshot & { lodging: boolean } {
  return {
    placeId: p.id,
    name: p.displayName?.text ?? fallbackName,
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
  };
}

export interface Suggestion {
  placeId: string;
  name: string;
  area: string;
}

// Hotel names as the visitor types (Places Autocomplete), Western Cape
// accommodation only. The session token groups the keystrokes with the
// details lookup of the hotel picked, which Google bills as one session.
export async function suggestPlaces(input: string, sessionToken?: string): Promise<Suggestion[]> {
  const res = await fetch(`${API}/places:autocomplete`, {
    method: 'POST',
    headers: headers('suggestions.placePrediction.placeId,suggestions.placePrediction.structuredFormat'),
    body: JSON.stringify({
      input,
      sessionToken,
      includedRegionCodes: ['za'],
      includedPrimaryTypes: ['lodging'],
      languageCode: 'en',
      locationRestriction: WESTERN_CAPE,
    }),
  });
  if (!res.ok) throw new Error(`Places autocomplete ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  return ((data.suggestions ?? []) as any[])
    .map((s) => s.placePrediction)
    .filter((p) => p?.placeId && p.structuredFormat?.mainText?.text)
    .map((p) => ({
      placeId: p.placeId,
      name: p.structuredFormat.mainText.text,
      area: String(p.structuredFormat.secondaryText?.text ?? '').replace(/,?\s*South Africa$/i, ''),
    }));
}

// One place by its id (a picked suggestion); null outside the Western Cape.
export async function getPlace(placeId: string, sessionToken?: string): Promise<PlaceSnapshot | null> {
  const params = new URLSearchParams({ languageCode: 'en', regionCode: 'ZA' });
  if (sessionToken) params.set('sessionToken', sessionToken);
  const res = await fetch(`${API}/places/${encodeURIComponent(placeId)}?${params}`, {
    headers: headers(FIELDS.join(',')),
  });
  if (!res.ok) throw new Error(`Place details ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const p = await res.json();
  if (!p?.id || !inWesternCape(p)) return null;
  const { lodging, ...place } = toSnapshot(p, placeId);
  return place;
}

export async function findPlaces(query: string): Promise<PlaceSnapshot[]> {
  const res = await fetch(`${API}/places:searchText`, {
    method: 'POST',
    headers: headers(FIELD_MASK),
    body: JSON.stringify({
      textQuery: query,
      regionCode: 'ZA',
      languageCode: 'en',
      locationRestriction: WESTERN_CAPE,
      pageSize: 10,
    }),
  });

  if (!res.ok) {
    throw new Error(`Places API ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }

  const data = await res.json();
  const places = (data.places ?? [])
    .filter((p: any) => p?.id && inWesternCape(p))
    .map((p: any) => toSnapshot(p, query));
  const ranked = rankPlaces(query, places);
  console.info(
    `Place lookup "${query}": ${ranked.length} result(s): ` +
      ranked.map((p) => `${p.name} [${p.rating ?? '-'}★/${p.ratingCount ?? 0}]`).join(' | '),
  );
  return ranked;
}

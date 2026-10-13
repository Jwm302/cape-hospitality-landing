import { cacheGet, cacheSet } from '../cache.js';
import { PlaceSnapshot, Review, ReviewBatch } from '../types.js';
import { dataForSeoConfigured, dfsCall, getTask, parseTimestamp, postTask } from './dataforseo-client.js';

// DataForSEO Tripadvisor Reviews API. Tripadvisor is searched by name, so the
// listing it returns is checked against the Google name before any review is used.
const PATH = '/business_data/tripadvisor';
const DEPTH = 50; // newest reviews; billed per 10
const LOCATION_CACHE_KEY = 'tripadvisor:location:za';

// Words too common in hotel names to tell two places apart.
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'by', 'of', 'at', 'on', 'in', 'hotel', 'hotels', 'guest', 'house', 'guesthouse',
  'lodge', 'spa', 'resort', 'apartments', 'apartment', 'suites', 'boutique', 'villa', 'villas', 'bnb',
  'self', 'catering', 'cape', 'town', 'south', 'africa', 'managed', 'collection',
]);

function nameTokens(name: string): string[] {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’`]/g, '')
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));
}

// True when the Tripadvisor listing title names the same place as Google.
// "Cape Grace - A Fairmont Managed Hotel" matches "Cape Grace";
// "Tintswalo Atlantic" does not match "Tintswalo Safari Lodge".
export function sameBusiness(googleName: string, listingTitle: string): boolean {
  const a = nameTokens(googleName);
  const b = new Set(nameTokens(listingTitle));
  if (!a.length || !b.size) return false;
  const shared = a.filter((t) => b.has(t));
  if (!shared.length) return false;
  if (shared.length === 1 && shared[0].length < 4) return false;
  return shared.length / Math.min(a.length, b.size) >= 0.6;
}

// "Chapmans Peak Dr, Hout Bay, 7806" -> "Hout Bay": narrows the search to the right town.
export function townFromAddress(address: string): string | undefined {
  const parts = address.split(',').map((p) => p.trim()).filter(Boolean);
  const places = parts.slice(parts.length > 2 ? 1 : 0).filter((p) => !/\d{4}/.test(p) && !/south africa/i.test(p));
  return places[0];
}

let memoLocation: number | null = null;

// Tripadvisor tasks need a Tripadvisor location; South Africa is looked up once and cached.
async function locationParam(): Promise<Record<string, unknown>> {
  const fromEnv = Number(process.env.TRIPADVISOR_LOCATION_CODE);
  if (fromEnv) return { location_code: fromEnv };
  if (memoLocation) return { location_code: memoLocation };
  const cached = await cacheGet<number>(LOCATION_CACHE_KEY);
  if (cached) return { location_code: (memoLocation = cached) };
  try {
    const data = await dfsCall(`${PATH}/locations/za`);
    const list: any[] = data.tasks?.[0]?.result ?? [];
    const country =
      list.find((l) => /country/i.test(String(l.location_type)) && /south africa/i.test(String(l.location_name))) ??
      list.find((l) => String(l.location_name).toLowerCase() === 'south africa');
    if (typeof country?.location_code === 'number') {
      memoLocation = country.location_code;
      await cacheSet(LOCATION_CACHE_KEY, country.location_code, 30 * 24 * 3600);
      return { location_code: country.location_code };
    }
    console.warn(`Tripadvisor location lookup: no country entry among ${list.length} results`);
  } catch (err: any) {
    console.warn('Tripadvisor location lookup failed:', err?.message);
  }
  return { location_name: 'South Africa' };
}

function normalizeItems(items: any[]): Review[] {
  return items
    .filter((i) => i && (i.review_text || i.title || typeof i.rating?.value === 'number'))
    .map((i, idx) => ({
      id: `ta-${i.review_id ?? idx}`,
      source: 'Tripadvisor',
      date: parseTimestamp(i.timestamp),
      rating: typeof i.rating?.value === 'number' ? i.rating.value : undefined,
      text: [i.title, i.review_text].filter((s) => typeof s === 'string' && s.trim()).join('. ').trim(),
      language:
        typeof i.original_language === 'string' ? i.original_language
        : typeof i.language === 'string' ? i.language
        : undefined,
    }));
}

export const tripadvisor = {
  isConfigured: () => dataForSeoConfigured() && process.env.TRIPADVISOR_REVIEWS !== 'off',

  async start(place: PlaceSnapshot): Promise<string | null> {
    const keyword = [place.name, townFromAddress(place.address)].filter(Boolean).join(', ');
    return postTask(`${PATH}/reviews/task_post`, {
      keyword,
      ...(await locationParam()),
      depth: DEPTH,
      sort_by: 'most_recent',
      translate_reviews: false, // keep the original language, so German reviews can be counted
      priority: 2,
      tag: place.name.slice(0, 255), // echoed back, used to check the match
    });
  },

  // null while running; a batch with no reviews when Tripadvisor found a different place.
  async poll(taskId: string): Promise<ReviewBatch | null> {
    const t = await getTask(`${PATH}/reviews/task_get/${encodeURIComponent(taskId)}`);
    if (!t) return null;
    const result = t.result?.[0];
    const googleName = String(t.data?.tag ?? '');
    const title = String(result?.title ?? '');
    const url = typeof result?.check_url === 'string' ? result.check_url : undefined;
    const notLodging = /Restaurant_Review|Attraction_Review/i.test(url ?? '');
    if (!title || notLodging || !sameBusiness(googleName, title)) {
      console.info(`Tripadvisor match rejected: "${googleName}" -> "${title}" ${url ?? ''}`);
      return { reviews: [], listings: [] };
    }
    return {
      reviews: normalizeItems(result?.items ?? []),
      listings: [{ source: 'Tripadvisor', name: title, url, total: result?.reviews_count }],
    };
  },
};

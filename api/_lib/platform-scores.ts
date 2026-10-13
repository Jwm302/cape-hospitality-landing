import { sameBusiness, townFromAddress } from './names.js';
import { dfsCall } from './reviews/dataforseo-client.js';
import { PlaceSnapshot, PlatformScore, PlatformScores } from './types.js';

// Scores from other booking and review sites, as Google Hotels shows them under
// "Reviews from the web" (via DataForSEO's Google Hotels endpoints).
const PATH = '/business_data/google';
const SOUTH_AFRICA = 2710;
const MAX_SITES = 6;

async function live(path: string, task: Record<string, unknown>): Promise<any | null> {
  const data = await dfsCall(path, { method: 'POST', body: JSON.stringify([task]) });
  const t = data.tasks?.[0];
  if (t?.status_code !== 20000) {
    console.warn(`DataForSEO ${path}: ${t?.status_code} ${t?.status_message}`);
    return null;
  }
  return t.result?.[0] ?? null;
}

// "9.2" with max 10 -> 9.2/10; percentages stay percentages.
export function toScore(entry: any): PlatformScore | null {
  const site = typeof entry?.title === 'string' ? entry.title.trim() : '';
  const value = entry?.rating?.value;
  if (!site || typeof value !== 'number' || !(value > 0)) return null;
  const percent = /percent/i.test(String(entry.rating.rating_type));
  const max = percent ? 100 : typeof entry.rating.rating_max === 'number' ? entry.rating.rating_max : undefined;
  return {
    site,
    value,
    max,
    votes: typeof entry.rating.votes_count === 'number' ? entry.rating.votes_count : undefined,
    url: typeof entry.url === 'string' && /^https?:\/\//.test(entry.url) ? entry.url : undefined,
  };
}

export async function fetchPlatformScores(place: PlaceSnapshot): Promise<PlatformScores> {
  const keyword = [place.name, townFromAddress(place.address)].filter(Boolean).join(', ');
  const search = await live(`${PATH}/hotel_searches/live`, {
    keyword,
    location_code: SOUTH_AFRICA,
    language_code: 'en',
    search_this_area: false,
  });
  const items: any[] = search?.items ?? [];
  const match =
    items.find((i) => !i.is_paid && i.hotel_identifier && sameBusiness(place.name, String(i.title ?? ''))) ??
    items.find((i) => i.hotel_identifier && sameBusiness(place.name, String(i.title ?? '')));
  if (!match) {
    console.info(`Google Hotels: no listing for "${place.name}" among ${items.map((i) => i.title).join(' | ')}`);
    return { status: 'none' };
  }

  const info = await live(`${PATH}/hotel_info/live/advanced`, {
    hotel_identifier: match.hotel_identifier,
    location_code: SOUTH_AFRICA,
    language_code: 'en',
  });
  const seen = new Set<string>();
  const scores = ((info?.reviews?.other_sites_reviews ?? []) as any[])
    .map(toScore)
    .filter((s): s is PlatformScore => {
      if (!s || seen.has(s.site.toLowerCase())) return false;
      seen.add(s.site.toLowerCase());
      return true;
    })
    .slice(0, MAX_SITES);

  if (!scores.length) return { status: 'none', listing: info?.title ?? match.title };
  return { status: 'ok', listing: info?.title ?? match.title, scores };
}

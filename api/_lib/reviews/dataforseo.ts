import { PlaceSnapshot, Review, ReviewJob, ReviewSource } from '../types';

// DataForSEO Google Reviews API (task-based: post a task, then poll for it).
const BASE = 'https://api.dataforseo.com/v3/business_data/google/reviews';
const SOUTH_AFRICA = 2710;
// Status codes while a task is still being processed.
const PENDING_CODES = new Set([40601, 40602]);

function authHeader(): string {
  const creds = `${process.env.DATAFORSEO_LOGIN}:${process.env.DATAFORSEO_PASSWORD}`;
  return `Basic ${Buffer.from(creds).toString('base64')}`;
}

async function call(path: string, init?: RequestInit): Promise<any> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { Authorization: authHeader(), 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`DataForSEO ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }
  return res.json();
}

async function postTask(task: Record<string, unknown>): Promise<string | null> {
  const data = await call('/task_post', { method: 'POST', body: JSON.stringify([task]) });
  const t = data.tasks?.[0];
  return t?.status_code === 20100 && t.id ? t.id : null;
}

// "2024-03-05 14:21:09 +00:00" -> ISO 8601
function parseTimestamp(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const iso = value.replace(' ', 'T').replace(' ', '');
  const time = Date.parse(iso);
  return Number.isNaN(time) ? undefined : new Date(time).toISOString();
}

export function normalizeItems(items: any[]): Review[] {
  return items
    .filter((i) => i && (i.review_text || i.original_review_text))
    .map((i, idx) => ({
      id: String(i.review_id ?? idx),
      date: parseTimestamp(i.timestamp),
      rating: typeof i.rating?.value === 'number' ? i.rating.value : undefined,
      text: String(i.review_text || i.original_review_text).trim(),
      language: typeof i.original_language === 'string' ? i.original_language : undefined,
    }));
}

export const dataForSeo: ReviewSource = {
  id: 'dataforseo',
  label: 'Google reviews',
  reportsLanguage: true,

  isConfigured() {
    return Boolean(process.env.DATAFORSEO_LOGIN && process.env.DATAFORSEO_PASSWORD);
  },

  async start(place: PlaceSnapshot, limit: number): Promise<ReviewJob> {
    const common = {
      location_code: SOUTH_AFRICA,
      language_code: 'en',
      depth: limit,
      sort_by: 'newest',
      priority: 2, // faster queue, still cents per hotel
    };
    // Prefer the exact Google place; fall back to name + address.
    const id =
      (await postTask({ ...common, place_id: place.placeId })) ??
      (await postTask({ ...common, keyword: `${place.name}, ${place.address}` }));
    if (!id) throw new Error('DataForSEO did not accept the review task');
    return { kind: 'pending', jobId: id };
  },

  async poll(jobId: string): Promise<Review[] | null> {
    const data = await call(`/task_get/${encodeURIComponent(jobId)}`);
    const t = data.tasks?.[0];
    if (!t || PENDING_CODES.has(t.status_code)) return null;
    if (t.status_code !== 20000) {
      throw new Error(`DataForSEO task ${t.status_code}: ${t.status_message}`);
    }
    return normalizeItems(t.result?.[0]?.items ?? []);
  },
};

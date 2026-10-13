import { PlaceSnapshot, Review, ReviewBatch, ReviewJob, ReviewSource } from '../types.js';
import { dataForSeoConfigured, getTask, parseTimestamp, postTask } from './dataforseo-client.js';

// DataForSEO Google Reviews API (task-based: post a task, then poll for it).
const PATH = '/business_data/google/reviews';
const SOUTH_AFRICA = 2710;

export function normalizeItems(items: any[]): Review[] {
  return items
    // Keep star-only reviews too: they count towards the average and dates.
    .filter((i) => i && (i.review_text || i.original_review_text || typeof i.rating?.value === 'number'))
    .map((i, idx) => ({
      id: String(i.review_id ?? idx),
      source: 'Google',
      date: parseTimestamp(i.timestamp),
      rating: typeof i.rating?.value === 'number' ? i.rating.value : undefined,
      text: String(i.review_text || i.original_review_text || '').trim(),
      language: typeof i.original_language === 'string' ? i.original_language : undefined,
    }));
}

export const dataForSeo: ReviewSource = {
  id: 'dataforseo',
  label: 'Google reviews',
  reportsLanguage: true,

  isConfigured: dataForSeoConfigured,

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
      (await postTask(`${PATH}/task_post`, { ...common, place_id: place.placeId })) ??
      (await postTask(`${PATH}/task_post`, { ...common, keyword: `${place.name}, ${place.address}` }));
    if (!id) throw new Error('DataForSEO did not accept the review task');
    return { kind: 'pending', jobId: id };
  },

  async poll(jobId: string): Promise<ReviewBatch | null> {
    const t = await getTask(`${PATH}/task_get/${encodeURIComponent(jobId)}`);
    if (!t) return null;
    const result = t.result?.[0];
    return {
      reviews: normalizeItems(result?.items ?? []),
      listings: [{ source: 'Google', name: result?.title, total: result?.reviews_count }],
    };
  },
};

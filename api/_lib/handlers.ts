import { analyzeReviews } from './analysis.js';
import { cacheConfigured, cacheGet, cacheSet, countToday } from './cache.js';
import { findPlace, placesConfigured } from './places.js';
import { getReviewSource } from './reviews/index.js';
import { PlaceSnapshot, ReviewAnalysis, ReviewsState, SnapshotResponse } from './types.js';

// Framework-agnostic request handlers, shared by the Vercel functions in /api
// and the local Express dev server.

const REVIEW_LIMIT = 100;
const ANALYSIS_TTL = 30 * 24 * 3600; // reuse a hotel's analysis for 30 days
const JOB_TTL = 15 * 60;
const MAX_REVIEW_LOOKUPS_PER_DAY = Number(process.env.MAX_REVIEW_LOOKUPS_PER_DAY) || 200;

const SAFE_ID = /^[A-Za-z0-9_-]{6,300}$/;

export interface HandlerResult {
  status: number;
  body: unknown;
}

const ok = (body: unknown): HandlerResult => ({ status: 200, body });

export async function handleSnapshot(query: unknown): Promise<HandlerResult> {
  if (typeof query !== 'string' || query.trim().length < 2 || query.length > 120) {
    return { status: 400, body: { error: 'Please enter a hotel name.' } };
  }
  if (!placesConfigured()) {
    console.warn('Place lookup skipped: GOOGLE_PLACES_API_KEY is not set for this deployment');
    return ok({ status: 'unavailable' } satisfies SnapshotResponse);
  }

  let place: PlaceSnapshot | null;
  try {
    place = await findPlace(query.trim());
  } catch (err: any) {
    console.warn('Place lookup failed:', err?.message);
    return ok({ status: 'unavailable' } satisfies SnapshotResponse);
  }
  if (!place) {
    console.info(`Place lookup: no Google match for "${query.trim()}"`);
    return ok({ status: 'not_found' } satisfies SnapshotResponse);
  }

  return ok({ status: 'ok', place, reviews: await startReviews(place) } satisfies SnapshotResponse);
}

async function startReviews(place: PlaceSnapshot): Promise<ReviewsState> {
  const source = getReviewSource();
  if (!source) return { status: 'disabled' };

  const analysisKey = `analysis:${source.id}:${place.placeId}`;
  const jobKey = `job:${source.id}:${place.placeId}`;

  const cached = await cacheGet<ReviewAnalysis>(analysisKey);
  if (cached) return { status: 'ready', analysis: cached };

  const runningJob = await cacheGet<string>(jobKey);
  if (runningJob) return { status: 'pending', jobId: runningJob };

  if (cacheConfigured && (await countToday('review-lookups')) > MAX_REVIEW_LOOKUPS_PER_DAY) {
    return { status: 'disabled' };
  }

  try {
    const job = await source.start(place, REVIEW_LIMIT);
    if (job.kind === 'pending') {
      await cacheSet(jobKey, job.jobId, JOB_TTL);
      return { status: 'pending', jobId: job.jobId };
    }
    const analysis = await analyzeReviews(job.reviews, source.label, source.reportsLanguage);
    await cacheSet(analysisKey, analysis, ANALYSIS_TTL);
    return { status: 'ready', analysis };
  } catch (err: any) {
    console.warn('Review lookup failed:', err?.message);
    return { status: 'error' };
  }
}

export async function handleReviewPoll(jobId: unknown, placeId: unknown): Promise<HandlerResult> {
  if (typeof jobId !== 'string' || typeof placeId !== 'string' || !SAFE_ID.test(jobId) || !SAFE_ID.test(placeId)) {
    return { status: 400, body: { error: 'Invalid request.' } };
  }
  const source = getReviewSource();
  if (!source) return ok({ status: 'error' } satisfies ReviewsState);

  const analysisKey = `analysis:${source.id}:${placeId}`;
  const cached = await cacheGet<ReviewAnalysis>(analysisKey);
  if (cached) return ok({ status: 'ready', analysis: cached } satisfies ReviewsState);

  try {
    const reviews = await source.poll(jobId);
    if (!reviews) return ok({ status: 'pending', jobId } satisfies ReviewsState);
    const analysis = await analyzeReviews(reviews, source.label, source.reportsLanguage);
    await cacheSet(analysisKey, analysis, ANALYSIS_TTL);
    return ok({ status: 'ready', analysis } satisfies ReviewsState);
  } catch (err: any) {
    console.warn('Review poll failed:', err?.message);
    return ok({ status: 'error' } satisfies ReviewsState);
  }
}

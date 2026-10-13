import { PlaceSnapshot, Review, ReviewBatch, ReviewJob, ReviewSource } from '../types.js';
import { dataForSeo } from './dataforseo.js';
import { tripadvisor } from './tripadvisor.js';

// Google reviews plus Tripadvisor reviews, analysed as one sample. Google is
// required; Tripadvisor is added when it finds the same hotel in time.
const TRIPADVISOR_WAIT_MS = 60_000; // after this, results show with Google reviews alone

// Job id: "<googleTaskId>_t<tripadvisorTaskId>_s<startedEpochSeconds>".
// DataForSEO task ids use only hex digits and hyphens, so "_" is a safe separator.
export function encodeJob(googleId: string, tripadvisorId: string | null, startedMs: number): string {
  return [googleId, tripadvisorId && `t${tripadvisorId}`, `s${Math.floor(startedMs / 1000)}`].filter(Boolean).join('_');
}

export function decodeJob(jobId: string): { googleId: string; tripadvisorId?: string; startedMs: number } {
  const [googleId, ...rest] = jobId.split('_');
  const tripadvisorId = rest.find((p) => p.startsWith('t'))?.slice(1);
  const started = Number(rest.find((p) => p.startsWith('s'))?.slice(1));
  return { googleId, tripadvisorId, startedMs: Number.isFinite(started) ? started * 1000 : 0 };
}

export const googleAndTripadvisor: ReviewSource = {
  id: 'google-tripadvisor',
  label: 'Google & Tripadvisor reviews',
  reportsLanguage: true,

  isConfigured: () => dataForSeo.isConfigured(),

  async start(place: PlaceSnapshot, limit: number): Promise<ReviewJob> {
    const [google, tripadvisorId] = await Promise.all([
      dataForSeo.start(place, limit),
      tripadvisor.isConfigured()
        ? tripadvisor.start(place).catch((err) => {
            console.warn('Tripadvisor lookup could not start:', err?.message);
            return null;
          })
        : Promise.resolve(null),
    ]);
    if (google.kind === 'ready') return google;
    return { kind: 'pending', jobId: encodeJob(google.jobId, tripadvisorId, Date.now()) };
  },

  async poll(jobId: string): Promise<ReviewBatch | null> {
    const { googleId, tripadvisorId, startedMs } = decodeJob(jobId);
    const google = await dataForSeo.poll(googleId);
    if (!google) return null;
    if (!tripadvisorId) return google;

    let extra: ReviewBatch | null;
    try {
      extra = await tripadvisor.poll(tripadvisorId);
    } catch (err: any) {
      console.warn('Tripadvisor reviews unavailable:', err?.message);
      return google;
    }
    if (!extra) return Date.now() - startedMs < TRIPADVISOR_WAIT_MS ? null : google;
    return {
      reviews: [...google.reviews, ...withoutCrossPosts(extra.reviews, google.reviews)],
      listings: [...google.listings, ...extra.listings],
    };
  },
};

const squash = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase();

// Some guests post the same review on Google and Tripadvisor; count it once.
// Tripadvisor text starts with the review title, so containment is checked both ways.
export function withoutCrossPosts(extra: Review[], google: Review[]): Review[] {
  const googleTexts = google.map((r) => squash(r.text)).filter((t) => t.length >= 40);
  return extra.filter((r) => {
    const text = squash(r.text);
    return text.length < 40 || !googleTexts.some((g) => text.includes(g) || g.includes(text));
  });
}

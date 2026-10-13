import { GoogleGenAI } from '@google/genai';
import { Review, ReviewAnalysis, ReviewBatch, RiskCheck, SourceCount, Theme, ThemeQuote } from './types.js';

const MODEL = 'gemini-3.8-flash';
const MIN_REVIEWS_PER_THEME = 3;
const MAX_THEMES = 6;
const MAX_QUOTE_CHARS = 220;
const MAX_REVIEW_CHARS = 800; // long reviews are trimmed before grouping, to keep it quick

// Checked on every hotel, so operators can compare like with like.
export const RISK_CHECKS = [
  { key: 'noise', label: 'Noise', hint: 'traffic, neighbours, music, thin walls, noise at night' },
  { key: 'hot_water', label: 'Hot water & showers', hint: 'cold or lukewarm water, low pressure, broken showers' },
  { key: 'cleanliness', label: 'Cleanliness', hint: 'dirty rooms or bathrooms, stained linen, pests' },
  { key: 'wifi', label: 'Wi-Fi', hint: 'slow, unreliable or no internet' },
  { key: 'safety', label: 'Safety & security', hint: 'theft, break-ins, feeling unsafe, poor security' },
  { key: 'power', label: 'Power cuts', hint: 'load-shedding, outages, no backup power' },
] as const;

const round1 = (n: number) => Math.round(n * 10) / 10;
const squash = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase();

// Counts, dates, averages and language share are computed here from the
// review data itself. The model is only asked which reviews mention which
// topic; its answer is checked before anything is shown.
export async function analyzeReviews(batch: ReviewBatch, reportsLanguage: boolean): Promise<ReviewAnalysis> {
  const reviews = batch.reviews;
  const sources = countSources(batch);
  const dates = reviews.map((r) => r.date).filter((d): d is string => Boolean(d)).sort();
  const ratings = reviews.map((r) => r.rating).filter((n): n is number => typeof n === 'number');
  const written = reviews.filter((r) => r.text.length > 0);
  const yearAgo = Date.now() - 365 * 24 * 3600 * 1000;
  const grouped = await groupReviews(written).catch((err) => {
    console.warn('Theme grouping unavailable:', err?.message);
    return { themes: [] as Theme[], risks: undefined };
  });

  return {
    sourceLabel: `${sources.map((s) => s.source).join(' & ') || 'Google'} reviews`,
    sources,
    sampleSize: reviews.length,
    writtenCount: written.length,
    lastYearCount: dates.filter((d) => Date.parse(d) >= yearAgo).length,
    dateFrom: dates[0],
    dateTo: dates[dates.length - 1],
    averageRating: ratings.length ? round1(ratings.reduce((a, b) => a + b, 0) / ratings.length) : undefined,
    germanCount: reportsLanguage
      ? written.filter((r) => r.language?.toLowerCase().startsWith('de')).length
      : undefined,
    themes: grouped.themes,
    risks: grouped.risks,
    generatedAt: new Date().toISOString(),
  };
}

// Reviews per source, in the order the sources were fetched.
export function countSources(batch: ReviewBatch): SourceCount[] {
  const counts = new Map<string, number>();
  for (const r of batch.reviews) counts.set(r.source ?? 'Google', (counts.get(r.source ?? 'Google') ?? 0) + 1);
  return [...counts].map(([source, count]) => ({ ...batch.listings.find((l) => l.source === source), source, count }));
}

interface ModelTheme {
  label?: unknown;
  sentiment?: unknown;
  reviews?: unknown;
  quotes?: { review?: unknown; text?: unknown }[];
}

interface ModelRisk {
  reviews?: unknown;
  quote?: { review?: unknown; text?: unknown } | null;
}

async function groupReviews(reviews: Review[]): Promise<{ themes: Theme[]; risks?: RiskCheck[] }> {
  if (!process.env.GEMINI_API_KEY || reviews.length === 0) return { themes: [] };

  const numbered = reviews.map((r, i) => ({ n: i, rating: r.rating, text: r.text.slice(0, MAX_REVIEW_CHARS) }));
  const prompt = `You group hotel guest reviews by topic for a hotel quality report.

Reviews (JSON, "n" is the review number):
${JSON.stringify(numbered)}

Return JSON: {"themes":[{"label":string,"sentiment":"positive"|"negative"|"mixed","reviews":number[],"quotes":[{"review":number,"text":string}]}],
"risks":{${RISK_CHECKS.map((r) => `"${r.key}":{"reviews":number[],"quote":{"review":number,"text":string}|null}`).join(',')}}}

Rules:
- Up to ${MAX_THEMES} themes that matter to travellers (e.g. cleanliness, noise, breakfast, staff, location, value, hot water, Wi-Fi).
- "label": 2-5 plain English words, e.g. "Noise at night", "Friendly staff".
- "reviews": every review number that clearly mentions the theme. Only include a theme mentioned by at least ${MIN_REVIEWS_PER_THEME} reviews.
- "quotes": up to 2 short phrases copied EXACTLY, word for word, from the review text (no edits, no ellipses).
- "risks": for each key, list ONLY the reviews that COMPLAIN about that problem at this property (praise such as "quiet" or "very secure" does not count). Use [] and null when no review complains.
${RISK_CHECKS.map((r) => `  - ${r.key}: ${r.hint}`).join('\n')}
- Use only what the reviews say. Do not add facts, scores or advice.`;

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: { responseMimeType: 'application/json', temperature: 0 },
  });

  const parsed = JSON.parse(response.text || '{}');
  const raw: ModelTheme[] = Array.isArray(parsed.themes) ? parsed.themes : [];
  const themes = raw.map((t) => verifyTheme(t, reviews)).filter((t): t is Theme => t !== null).slice(0, MAX_THEMES);
  const risks =
    parsed.risks && typeof parsed.risks === 'object'
      ? RISK_CHECKS.map((r) => verifyRisk(r, parsed.risks[r.key], reviews))
      : undefined;
  return { themes, risks };
}

const validIndexes = (ids: unknown, max: number) =>
  [...new Set((Array.isArray(ids) ? ids : []).filter((n): n is number => Number.isInteger(n) && n >= 0 && n < max))];

// Same checks as themes: known review numbers only, quote word for word.
export function verifyRisk(
  check: { key: string; label: string },
  raw: ModelRisk | undefined,
  reviews: Review[],
): RiskCheck {
  const valid = validIndexes(raw?.reviews, reviews.length);
  const result: RiskCheck = { key: check.key, label: check.label, count: valid.length };
  const n = raw?.quote?.review;
  const text = typeof raw?.quote?.text === 'string' ? raw.quote.text.trim() : '';
  if (Number.isInteger(n) && valid.includes(n as number) && text.length >= 8) {
    const review = reviews[n as number];
    if (squash(review.text).includes(squash(text))) {
      result.quote = {
        text: text.length > MAX_QUOTE_CHARS ? `${text.slice(0, MAX_QUOTE_CHARS).trimEnd()}…` : text,
        date: review.date,
        rating: review.rating,
        source: review.source,
      };
    }
  }
  return result;
}

// Rejects anything the reviews don't support: unknown review numbers, too few
// mentions, or quotes that are not word-for-word in the cited review.
export function verifyTheme(t: ModelTheme, reviews: Review[]): Theme | null {
  if (typeof t.label !== 'string' || !t.label.trim()) return null;
  const sentiment = t.sentiment === 'positive' || t.sentiment === 'negative' ? t.sentiment : 'mixed';

  const valid = validIndexes(t.reviews, reviews.length);
  if (valid.length < MIN_REVIEWS_PER_THEME) return null;

  const quotes: ThemeQuote[] = [];
  for (const q of t.quotes ?? []) {
    const n = q?.review;
    const text = typeof q?.text === 'string' ? q.text.trim() : '';
    if (!Number.isInteger(n) || !valid.includes(n as number) || text.length < 8) continue;
    const review = reviews[n as number];
    if (!squash(review.text).includes(squash(text))) continue;
    quotes.push({
      text: text.length > MAX_QUOTE_CHARS ? `${text.slice(0, MAX_QUOTE_CHARS).trimEnd()}…` : text,
      date: review.date,
      rating: review.rating,
      source: review.source,
    });
    if (quotes.length === 2) break;
  }

  return { label: t.label.trim().slice(0, 60), sentiment, count: valid.length, quotes };
}

import { GoogleGenAI } from '@google/genai';
import { Review, ReviewAnalysis, Theme, ThemeQuote } from './types';

const MODEL = 'gemini-3.8-flash';
const MIN_REVIEWS_PER_THEME = 3;
const MAX_THEMES = 6;
const MAX_QUOTE_CHARS = 220;

const round1 = (n: number) => Math.round(n * 10) / 10;
const squash = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase();

// Counts, dates, averages and language share are computed here from the
// review data itself. The model is only asked which reviews mention which
// topic; its answer is checked before anything is shown.
export async function analyzeReviews(
  reviews: Review[],
  sourceLabel: string,
  reportsLanguage: boolean,
): Promise<ReviewAnalysis> {
  const dates = reviews.map((r) => r.date).filter((d): d is string => Boolean(d)).sort();
  const ratings = reviews.map((r) => r.rating).filter((n): n is number => typeof n === 'number');

  return {
    sourceLabel,
    sampleSize: reviews.length,
    dateFrom: dates[0],
    dateTo: dates[dates.length - 1],
    averageRating: ratings.length ? round1(ratings.reduce((a, b) => a + b, 0) / ratings.length) : undefined,
    germanCount: reportsLanguage
      ? reviews.filter((r) => r.language?.toLowerCase().startsWith('de')).length
      : undefined,
    themes: await groupThemes(reviews).catch((err) => {
      console.warn('Theme grouping unavailable:', err?.message);
      return [];
    }),
    generatedAt: new Date().toISOString(),
  };
}

interface ModelTheme {
  label?: unknown;
  sentiment?: unknown;
  reviews?: unknown;
  quotes?: { review?: unknown; text?: unknown }[];
}

async function groupThemes(reviews: Review[]): Promise<Theme[]> {
  if (!process.env.GEMINI_API_KEY || reviews.length < MIN_REVIEWS_PER_THEME) return [];

  const numbered = reviews.map((r, i) => ({ n: i, rating: r.rating, text: r.text.slice(0, 1200) }));
  const prompt = `You group hotel guest reviews by topic for a hotel quality report.

Reviews (JSON, "n" is the review number):
${JSON.stringify(numbered)}

Return JSON: {"themes":[{"label":string,"sentiment":"positive"|"negative"|"mixed","reviews":number[],"quotes":[{"review":number,"text":string}]}]}

Rules:
- Up to ${MAX_THEMES} themes that matter to travellers (e.g. cleanliness, noise, breakfast, staff, location, value, hot water, Wi-Fi).
- "label": 2-5 plain English words, e.g. "Noise at night", "Friendly staff".
- "reviews": every review number that clearly mentions the theme. Only include a theme mentioned by at least ${MIN_REVIEWS_PER_THEME} reviews.
- "quotes": up to 2 short phrases copied EXACTLY, word for word, from the review text (no edits, no ellipses).
- Use only what the reviews say. Do not add facts, scores or advice.`;

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: { responseMimeType: 'application/json', temperature: 0 },
  });

  const parsed = JSON.parse(response.text || '{}');
  const raw: ModelTheme[] = Array.isArray(parsed.themes) ? parsed.themes : [];
  return raw.map((t) => verifyTheme(t, reviews)).filter((t): t is Theme => t !== null).slice(0, MAX_THEMES);
}

// Rejects anything the reviews don't support: unknown review numbers, too few
// mentions, or quotes that are not word-for-word in the cited review.
export function verifyTheme(t: ModelTheme, reviews: Review[]): Theme | null {
  if (typeof t.label !== 'string' || !t.label.trim()) return null;
  const sentiment = t.sentiment === 'positive' || t.sentiment === 'negative' ? t.sentiment : 'mixed';

  const ids = Array.isArray(t.reviews) ? t.reviews : [];
  const valid = [...new Set(ids.filter((n): n is number => Number.isInteger(n) && n >= 0 && n < reviews.length))];
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
    });
    if (quotes.length === 2) break;
  }

  return { label: t.label.trim().slice(0, 60), sentiment, count: valid.length, quotes };
}

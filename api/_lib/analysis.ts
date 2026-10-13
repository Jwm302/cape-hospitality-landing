import { GoogleGenAI, ThinkingLevel } from '@google/genai';
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
  complaints?: { review?: unknown; quote?: unknown }[];
}

// Accepts the expected {complaints:[{review,quote}]} and close variants
// (a bare array, "reviews", or plain review numbers), so a small change in
// the model's answer cannot silently turn complaints into zero.
function complaintList(raw: unknown): { review?: unknown; quote?: unknown }[] {
  const r = raw as any;
  const list = Array.isArray(r) ? r : Array.isArray(r?.complaints) ? r.complaints : Array.isArray(r?.reviews) ? r.reviews : [];
  return list.map((c: any) => (typeof c === 'number' || typeof c === 'string' ? { review: c } : c));
}

// Two smaller requests run side by side (themes, and the risk checklist), with
// minimal model "thinking": the task is sorting and copying, not reasoning.
// A JSON schema fixes the shape of each answer. If the faster setting is ever
// rejected, the request is repeated with defaults.
async function askJson(ai: GoogleGenAI, prompt: string, schema: object, label: string): Promise<any> {
  const base = { responseMimeType: 'application/json', temperature: 0 };
  const attempts = [
    { mode: 'minimal', config: { ...base, responseJsonSchema: schema, thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL } } },
    { mode: 'default', config: { ...base, responseJsonSchema: schema } },
    { mode: 'no schema', config: base },
  ];
  const started = Date.now();
  let lastError: any;
  for (const { mode, config } of attempts) {
    try {
      const res = await ai.models.generateContent({ model: MODEL, contents: prompt, config });
      const parsed = JSON.parse(res.text || '{}');
      console.info(`Gemini ${label} (${mode}): ${Date.now() - started} ms, thoughts ${res.usageMetadata?.thoughtsTokenCount ?? 0} tokens`);
      return parsed;
    } catch (err: any) {
      lastError = err;
      console.warn(`Gemini ${label} (${mode}) failed: ${err?.message}`);
    }
  }
  throw lastError;
}

const QUOTE_SCHEMA = {
  type: 'object',
  properties: { review: { type: 'integer' }, text: { type: 'string' } },
  required: ['review', 'text'],
};
const THEMES_SCHEMA = {
  type: 'object',
  properties: {
    themes: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          label: { type: 'string' },
          sentiment: { type: 'string', enum: ['positive', 'negative', 'mixed'] },
          reviews: { type: 'array', items: { type: 'integer' } },
          quotes: { type: 'array', items: QUOTE_SCHEMA },
        },
        required: ['label', 'sentiment', 'reviews', 'quotes'],
      },
    },
  },
  required: ['themes'],
};
const RISKS_SCHEMA = {
  type: 'object',
  properties: {
    risks: {
      type: 'object',
      properties: Object.fromEntries(
        RISK_CHECKS.map((r) => [
          r.key,
          {
            type: 'object',
            properties: {
              complaints: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: { review: { type: 'integer' }, quote: { type: 'string' } },
                  required: ['review', 'quote'],
                },
              },
            },
            required: ['complaints'],
          },
        ]),
      ),
      required: RISK_CHECKS.map((r) => r.key),
    },
  },
  required: ['risks'],
};

async function groupReviews(reviews: Review[]): Promise<{ themes: Theme[]; risks?: RiskCheck[] }> {
  if (!process.env.GEMINI_API_KEY || reviews.length === 0) return { themes: [] };

  const numbered = reviews.map((r, i) => ({ n: i, rating: r.rating, text: r.text.slice(0, MAX_REVIEW_CHARS) }));
  const intro = `You analyse hotel guest reviews for a hotel quality report.

Reviews (JSON, "n" is the review number):
${JSON.stringify(numbered)}
`;
  const themesPrompt = `${intro}
Return JSON: {"themes":[{"label":string,"sentiment":"positive"|"negative"|"mixed","reviews":number[],"quotes":[{"review":number,"text":string}]}]}

Rules:
- Up to ${MAX_THEMES} themes that matter to travellers (e.g. location, staff, breakfast, food, rooms, value, pool, views).
- Do NOT make themes about these topics, which a separate checklist counts: ${RISK_CHECKS.map((r) => r.label.toLowerCase()).join(', ')}.
- "label": 2-5 plain English words, e.g. "Noise at night", "Friendly staff".
- "reviews": every review number that clearly mentions the theme. Only include a theme mentioned by at least ${MIN_REVIEWS_PER_THEME} reviews.
- "quotes": up to 2 short phrases copied EXACTLY, word for word, from the review text (no edits, no ellipses).
- Use only what the reviews say. Do not add facts, scores or advice.`;
  const risksPrompt = `${intro}
Return JSON: {"risks":{${RISK_CHECKS.map((r) => `"${r.key}":{"complaints":[{"review":number,"quote":string}]}`).join(',')}}}

Rules:
- For each key, list ONLY the reviews that COMPLAIN about that problem at this property (praise such as "quiet" or "very secure" does not count), one entry per review, with "quote" = the complaint copied EXACTLY, word for word, from that review (one sentence or phrase). Use [] when no review complains.
${RISK_CHECKS.map((r) => `  - ${r.key}: ${r.hint}`).join('\n')}
- Use only what the reviews say. Do not add facts, scores or advice.`;

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const [themesResult, risksResult] = await Promise.allSettled([
    askJson(ai, themesPrompt, THEMES_SCHEMA, 'themes'),
    askJson(ai, risksPrompt, RISKS_SCHEMA, 'risks'),
  ]);

  let themes: Theme[] = [];
  if (themesResult.status === 'fulfilled') {
    const raw: ModelTheme[] = Array.isArray(themesResult.value.themes) ? themesResult.value.themes : [];
    themes = raw.map((t) => verifyTheme(t, reviews)).filter((t): t is Theme => t !== null).slice(0, MAX_THEMES);
  } else {
    console.warn('Theme grouping unavailable:', themesResult.reason?.message);
  }

  let risks: RiskCheck[] | undefined;
  // Normally {"risks":{...}}; also accept the topics at the top level.
  const value = risksResult.status === 'fulfilled' ? risksResult.value : undefined;
  const parsedRisks = value?.risks ?? (RISK_CHECKS.some((r) => value && r.key in value) ? value : undefined);
  if (parsedRisks && typeof parsedRisks === 'object') {
    risks = RISK_CHECKS.map((r) => verifyRisk(r, parsedRisks[r.key], reviews));
  } else if (risksResult.status === 'rejected') {
    console.warn('Risk checklist unavailable:', risksResult.reason?.message);
  }
  return { themes, risks };
}

const validIndexes = (ids: unknown, max: number) =>
  [...new Set((Array.isArray(ids) ? ids : []).filter((n): n is number => Number.isInteger(n) && n >= 0 && n < max))];

const clip = (text: string) => (text.length > MAX_QUOTE_CHARS ? `${text.slice(0, MAX_QUOTE_CHARS).trimEnd()}…` : text);

// Same checks as themes: known review numbers only, each review counted once.
// Each complaint keeps the model's quote only if it is word for word in that
// review; otherwise the opening of the review itself is shown.
export function verifyRisk(
  check: { key: string; label: string },
  raw: ModelRisk | undefined,
  reviews: Review[],
): RiskCheck {
  const seen = new Set<number>();
  const mentions: ThemeQuote[] = [];
  for (const c of complaintList(raw)) {
    const n = typeof c?.review === 'string' ? Number(c.review) : c?.review;
    if (!Number.isInteger(n) || (n as number) < 0 || (n as number) >= reviews.length || seen.has(n as number)) continue;
    seen.add(n as number);
    const review = reviews[n as number];
    const quote = typeof c.quote === 'string' ? c.quote.trim() : '';
    const verified = quote.length >= 8 && squash(review.text).includes(squash(quote));
    const text = verified ? quote : review.text.trim();
    if (!text) continue;
    mentions.push({ text: clip(text), date: review.date, rating: review.rating, source: review.source });
  }
  mentions.sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));
  return { key: check.key, label: check.label, count: seen.size, quote: mentions[0], mentions };
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

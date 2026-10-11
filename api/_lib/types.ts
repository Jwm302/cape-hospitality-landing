// Shared types for the live hotel lookup. Everything shown to visitors comes
// from a named source; nothing here is estimated or generated.

export interface PlaceSnapshot {
  placeId: string;
  name: string;
  address: string;
  type?: string;
  rating?: number;
  ratingCount?: number;
  mapsUrl?: string;
}

export interface Review {
  id: string;
  date?: string; // ISO 8601
  rating?: number; // 1-5
  text: string;
  language?: string; // original language code, when the source reports it
}

export type ReviewJob =
  | { kind: 'pending'; jobId: string }
  | { kind: 'ready'; reviews: Review[] };

// A source of recent reviews for a place. Implementations can be synchronous
// (return 'ready' from start) or asynchronous (return a job id to poll), so a
// paid API and a self-hosted scraper fit the same interface.
export interface ReviewSource {
  id: string;
  label: string; // shown to visitors, e.g. "Google reviews"
  isConfigured(): boolean;
  start(place: PlaceSnapshot, limit: number): Promise<ReviewJob>;
  poll(jobId: string): Promise<Review[] | null>; // null = still running
  reportsLanguage: boolean; // whether `language` is populated
}

export interface ThemeQuote {
  text: string;
  date?: string;
  rating?: number;
}

export interface Theme {
  label: string;
  sentiment: 'positive' | 'negative' | 'mixed';
  count: number; // reviews in the sample that mention the theme
  quotes: ThemeQuote[];
}

export interface ReviewAnalysis {
  sourceLabel: string;
  sampleSize: number;
  dateFrom?: string;
  dateTo?: string;
  averageRating?: number;
  germanCount?: number; // undefined when the source does not report language
  themes: Theme[]; // empty when theme grouping is unavailable
  generatedAt: string;
}

export type ReviewsState =
  | { status: 'disabled' }
  | { status: 'pending'; jobId: string }
  | { status: 'ready'; analysis: ReviewAnalysis }
  | { status: 'error' };

export type SnapshotResponse =
  | { status: 'ok'; place: PlaceSnapshot; alternatives?: PlaceSnapshot[]; reviews: ReviewsState }
  | { status: 'not_found' }
  | { status: 'unavailable' };

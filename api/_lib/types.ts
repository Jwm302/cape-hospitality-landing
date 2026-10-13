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
  status?: 'OPERATIONAL' | 'CLOSED_TEMPORARILY' | 'CLOSED_PERMANENTLY';
  website?: string;
  phone?: string;
  wheelchairEntrance?: boolean;
  parking?: 'Free parking' | 'Paid parking';
}

export interface Review {
  id: string;
  source?: string; // e.g. "Google", "Tripadvisor"
  date?: string; // ISO 8601
  rating?: number; // 1-5
  text: string;
  language?: string; // original language code, when the source reports it
}

// Where a batch of reviews came from, shown to visitors for transparency.
export interface SourceListing {
  source: string; // e.g. "Tripadvisor"
  name?: string; // listing title on that site
  url?: string;
  total?: number; // all reviews on that listing
}

export interface ReviewBatch {
  reviews: Review[];
  listings: SourceListing[];
}

export type ReviewJob =
  | { kind: 'pending'; jobId: string }
  | { kind: 'ready'; batch: ReviewBatch };

// A source of recent reviews for a place. Implementations can be synchronous
// (return 'ready' from start) or asynchronous (return a job id to poll), so a
// paid API and a self-hosted scraper fit the same interface.
export interface ReviewSource {
  id: string;
  label: string; // shown to visitors, e.g. "Google reviews"
  isConfigured(): boolean;
  start(place: PlaceSnapshot, limit: number): Promise<ReviewJob>;
  poll(jobId: string): Promise<ReviewBatch | null>; // null = still running
  reportsLanguage: boolean; // whether `language` is populated
}

export interface ThemeQuote {
  text: string;
  source?: string;
  date?: string;
  rating?: number;
}

export interface Theme {
  label: string;
  sentiment: 'positive' | 'negative' | 'mixed';
  count: number; // reviews in the sample that mention the theme
  quotes: ThemeQuote[];
}

// A fixed list of problems that matter to European guests. Each entry counts
// written reviews that complain about it (0 is a real result, not a gap).
export interface RiskCheck {
  key: string;
  label: string;
  count: number;
  quote?: ThemeQuote;
}

export interface SourceCount extends SourceListing {
  count: number; // reviews from this source in the sample
}

export interface ReviewAnalysis {
  sourceLabel: string;
  sources?: SourceCount[];
  sampleSize: number; // all reviews fetched, including star-only ones
  writtenCount: number; // reviews with a written comment
  lastYearCount: number; // reviews from the last 12 months
  dateFrom?: string;
  dateTo?: string;
  averageRating?: number;
  germanCount?: number; // written reviews in German; undefined when the source does not report language
  themes: Theme[]; // empty when theme grouping is unavailable
  risks?: RiskCheck[]; // undefined when the AI step did not run
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

import { ReviewSource } from '../types.js';
import { googleAndTripadvisor } from './combined.js';
import { dataForSeo } from './dataforseo.js';

// Review sources available to the live lookup. To swap providers (for example
// a self-hosted open-source scraper), add an implementation of ReviewSource
// here and select it with the REVIEW_SOURCE environment variable.
// REVIEW_SOURCE=dataforseo uses Google reviews only.
const SOURCES: Record<string, ReviewSource> = {
  'google-tripadvisor': googleAndTripadvisor,
  dataforseo: dataForSeo,
};

export function getReviewSource(): ReviewSource | null {
  const source = SOURCES[process.env.REVIEW_SOURCE || 'google-tripadvisor'];
  return source?.isConfigured() ? source : null;
}

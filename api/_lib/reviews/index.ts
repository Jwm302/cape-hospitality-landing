import { ReviewSource } from '../types.js';
import { dataForSeo } from './dataforseo.js';

// Review sources available to the live lookup. To swap providers (for example
// a self-hosted open-source scraper), add an implementation of ReviewSource
// here and select it with the REVIEW_SOURCE environment variable.
const SOURCES: Record<string, ReviewSource> = {
  dataforseo: dataForSeo,
};

export function getReviewSource(): ReviewSource | null {
  const source = SOURCES[process.env.REVIEW_SOURCE || 'dataforseo'];
  return source?.isConfigured() ? source : null;
}

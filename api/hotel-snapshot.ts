import { handleSnapshot } from './_lib/handlers.js';

// Starts the Google and Tripadvisor review lookups; the first call also looks up
// Tripadvisor's South Africa location code.
export const maxDuration = 30;

// POST { query } -> live Google snapshot of a hotel, and the state of the
// recent-review analysis (ready, pending with a job id, or disabled).
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const result = await handleSnapshot(req.body?.query);
  return res.status(result.status).json(result.body);
}

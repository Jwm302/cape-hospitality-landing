import { handlePlatformScores } from './_lib/handlers.js';

// Two live Google Hotels lookups; usually 10-30 seconds together, occasionally over a minute.
export const maxDuration = 120;

// GET ?placeId=... -> scores from other booking and review sites for a place found by a search.
export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const result = await handlePlatformScores(req.query?.placeId);
  return res.status(result.status).json(result.body);
}

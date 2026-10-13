import { handleReviewPoll } from './_lib/handlers.js';

// Grouping 150 Google and Tripadvisor reviews into themes can take close to a minute.
export const maxDuration = 300;

// GET ?jobId=...&placeId=... -> { status: 'pending' } or the finished analysis.
export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const result = await handleReviewPoll(req.query?.jobId, req.query?.placeId);
  return res.status(result.status).json(result.body);
}

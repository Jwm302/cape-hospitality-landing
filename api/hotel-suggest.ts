import { handleSuggest } from './_lib/handlers.js';

export const maxDuration = 10;

// GET ?q=<typed text>&s=<session token> -> { suggestions: [{ placeId, name, area }] }
export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const result = await handleSuggest(req.query?.q, req.query?.s);
  return res.status(result.status).json(result.body);
}

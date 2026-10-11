// Optional Redis cache (Upstash REST API, e.g. via Vercel's Upstash/KV
// integration). Without it, everything still works; results just aren't reused.
const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

export const cacheConfigured = Boolean(REDIS_URL && TOKEN);

async function command(...args: (string | number)[]): Promise<any> {
  if (!cacheConfigured) return null;
  try {
    const res = await fetch(REDIS_URL as string, {
      method: 'POST',
      headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(args.map(String)),
    });
    if (!res.ok) return null;
    return (await res.json()).result ?? null;
  } catch {
    return null;
  }
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const value = await command('GET', key);
  if (typeof value !== 'string') return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export async function cacheSet(key: string, value: unknown, ttlSeconds: number): Promise<void> {
  await command('SET', key, JSON.stringify(value), 'EX', ttlSeconds);
}

// Counts events per UTC day; returns the new count (0 when no cache).
export async function countToday(name: string): Promise<number> {
  const key = `count:${name}:${new Date().toISOString().slice(0, 10)}`;
  const n = await command('INCR', key);
  if (n === 1) await command('EXPIRE', key, 90000);
  return typeof n === 'number' ? n : 0;
}

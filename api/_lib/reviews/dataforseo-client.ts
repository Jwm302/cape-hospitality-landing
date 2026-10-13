// Shared DataForSEO API access (Google and Tripadvisor reviews use the same account).
const API = 'https://api.dataforseo.com/v3';

// Status codes while a task is still being processed.
export const PENDING_CODES = new Set([40601, 40602]);

export function dataForSeoConfigured(): boolean {
  return Boolean(process.env.DATAFORSEO_LOGIN && process.env.DATAFORSEO_PASSWORD);
}

function authHeader(): string {
  const creds = `${process.env.DATAFORSEO_LOGIN}:${process.env.DATAFORSEO_PASSWORD}`;
  return `Basic ${Buffer.from(creds).toString('base64')}`;
}

export async function dfsCall(path: string, init?: RequestInit): Promise<any> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { Authorization: authHeader(), 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`DataForSEO ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }
  return res.json();
}

// Posts one task; returns its id, or null when DataForSEO did not accept it.
export async function postTask(path: string, task: Record<string, unknown>): Promise<string | null> {
  const data = await dfsCall(path, { method: 'POST', body: JSON.stringify([task]) });
  const t = data.tasks?.[0];
  if (t?.status_code === 20100 && t.id) return t.id;
  console.warn(`DataForSEO did not accept task ${path}: ${t?.status_code} ${t?.status_message}`);
  return null;
}

// Returns the finished task, or null while it is still running.
export async function getTask(path: string): Promise<any | null> {
  const data = await dfsCall(path);
  const t = data.tasks?.[0];
  if (!t || PENDING_CODES.has(t.status_code)) return null;
  if (t.status_code !== 20000) {
    throw new Error(`DataForSEO task ${t.status_code}: ${t.status_message}`);
  }
  return t;
}

// "2024-03-05 14:21:09 +00:00" -> ISO 8601
export function parseTimestamp(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const iso = value.replace(' ', 'T').replace(' ', '');
  const time = Date.parse(iso);
  return Number.isNaN(time) ? undefined : new Date(time).toISOString();
}

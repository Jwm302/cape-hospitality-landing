// Delivers form submissions to the company inbox via Web3Forms (free tier).
// The access key is public by design: it can only route mail to the inbox it
// was created for. Set VITE_WEB3FORMS_KEY in the Vercel project settings.

export const CONTACT_EMAIL = 'contact@capehospitalityadvisors.com';

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;

export type InquiryFields = Record<string, string | undefined>;

export async function sendInquiry(subject: string, fields: InquiryFields, replyTo: string): Promise<void> {
  if (!WEB3FORMS_KEY) {
    throw new Error('Form delivery is not configured');
  }

  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: WEB3FORMS_KEY,
      subject,
      from_name: 'Cape Hospitality Advisors website',
      replyto: replyTo,
      ...fields,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) {
    throw new Error(data.message || `Submission failed (${res.status})`);
  }
}

// Fallback when delivery fails: a pre-filled email the visitor can send themselves.
export function mailtoLink(subject: string, fields: InquiryFields): string {
  const body = Object.entries(fields)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

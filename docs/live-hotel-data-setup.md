# Live hotel data: setup guide

The Virtual Audit demo shows only real data:

1. **Google snapshot (instant).** Google Places gives the rating, review count, address and a Google Maps link.
2. **Recent-review analysis (up to a minute).** DataForSEO fetches the latest 100 Google reviews. Gemini groups them into themes. Counts, dates, averages and the German-language share are calculated in code, and every quote is checked word for word against the review it came from.

Each part switches on when its keys are added in Vercel. Until then, the demo shows a "request the 24h brief" message and never shows invented figures.

After adding or changing any variable, redeploy: Vercel → **Deployments** → **⋯** on the latest → **Redeploy**.

---

## 1. Google Places API key (required, about $0/month)

1. Go to <https://console.cloud.google.com> and create a project, e.g. "Cape Hospitality".
2. **Billing:** link a billing account. A card is required, but the monthly free allowance covers a low-traffic demo.
3. **APIs & Services → Library:** search "Places API (New)" and click **Enable**.
4. **APIs & Services → Credentials → Create credentials → API key.**
5. Click the new key and set:
   - **API restrictions → Restrict key → Places API (New)** only.
   - Leave application restrictions as **None**. The key is only used by the server, never in the browser.
6. Cap the spend:
   - **APIs & Services → Places API (New) → Quotas:** set *Text Search requests per day* to e.g. **100**.
   - **Billing → Budgets & alerts:** create a budget of e.g. **$5** with email alerts.
7. In Vercel, add `GOOGLE_PLACES_API_KEY` = the key (Production), then redeploy.

The live demo now shows the Google rating, review count and address.

## 2. DataForSEO (optional, about 1–2 cents per hotel)

1. Sign up at <https://dataforseo.com> and top up a small balance. The balance is prepaid, so it also acts as a spending cap.
2. In the dashboard, open **API Access** and copy your **API login** and **API password**. These are not your website login.
3. In Vercel, add `DATAFORSEO_LOGIN` and `DATAFORSEO_PASSWORD`, then redeploy.

The demo now also shows "What recent guests say": the recent average, the share of reviews written in German, and themes with counts and dated quotes.

## 3. Gemini key (optional, for themes)

If `GEMINI_API_KEY` is not already set in Vercel:

1. Create a key at <https://aistudio.google.com/apikey>.
2. In Vercel, add `GEMINI_API_KEY`, then redeploy.

Without it, the review stats still show, but without themes.

## 4. Cache (optional, recommended once DataForSEO is on)

This saves each hotel's analysis for 30 days, so repeat searches are instant and free. It also adds a daily limit on new review lookups (default 200).

1. In Vercel, open **Storage** (or **Marketplace**), choose **Upstash Redis** (free plan) and connect it to this project.
2. Vercel adds `KV_REST_API_URL` and `KV_REST_API_TOKEN` automatically. Redeploy.

## Swapping providers later

- **Review source:** review sources live in `api/_lib/reviews/`. To use a different provider, such as a self-hosted open-source scraper:
  1. Add a file that implements the `ReviewSource` interface in `api/_lib/types.ts`.
  2. Register it in `api/_lib/reviews/index.ts`.
  3. Set `REVIEW_SOURCE` in Vercel to its id.
- **Hotel lookup:** this is isolated in `api/_lib/places.ts`.

## Local development

Copy `.env.example` to `.env`, fill in the keys, and run `npm run dev`.

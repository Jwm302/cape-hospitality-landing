# Progress and next steps

Last updated: 27 October 2026. Read this first when picking the project up again.

## Where things stand

The redesigned site is live (merged to `main` in pull request #29 and deployed by Vercel).

### Home page (top to bottom)
1. Menu: Home, Try the Demo, Services (dropdown), Sample Report, Contact, plus the English / Deutsch switch (South African and German flags).
2. Photo banner with the white-and-gold logo (`src/assets/images/logo_light.webp`), tagline and the Gutman Milne quote.
3. "The Independent Choice": two sentences, one button, three icon columns (Independent, Fast, On the Ground).
4. Hotel check ("Try It: Check Any Hotel"), presented as a consolidated multi-platform rating, not a Google search.
   - The rating box shows **Our score**: the hotel's ratings on every platform found, combined into one score out of 5 and weighted by review counts (`ourScore` / `combineScores` in `src/components/AgentVirtualAudit.tsx`).
   - No platform names are shown to visitors ("from aggregated sources"); quotes show date and stars only. The only mention is a tiny "Powered by Google" credit, kept because Google Maps Platform terms require attribution. Emails to the team keep the per-platform details.
5. Our Services: three short cards; "Check now" opens one tier's full details at a time; "Most Popular" on the core tier.
6. Contact form and grey footer.

Design model: evershine.co.za (simple, short text, one call to action). Keep new sections in that spirit.

### Services (`src/data/landingData.ts`, English and German)
- Free Virtual Audit: 24-hour desk brief.
- On-Site Mystery Audit (core, about EUR 1,000, price not shown on the site): 24–48 h anonymous stay, full report within 48 hours (about five pages), plus a 30-minute Zoom call with the inspector.
- Portfolio Quality Partnership: dedicated inspectors who know the client's hotels, a quarterly review call, and month-by-month guest-sentiment tracking.

### Sample report (`/sample-report`, `src/components/SampleAuditReport.tsx`)
Five slides for the archetype "The Historic City Hotel": summary, department scorecard, 22-hour timeline, evidence (photo collage plus shower-temperature and noise charts), risks and recommendations.
- The overall score (81) is calculated from the weighted department scores; change the data, not the number.
- Photos in `src/assets/images/sample-report/` were cropped from AI-made example sheets supplied by the owner. Fine for an archetype sample; real client reports must use real inspector photos.
- Problems without a photo show the measured reading instead (shower 38 °C, AC 47 dB, fire door).

### German version (`src/i18n.tsx`, `src/components/LanguageSwitch.tsx`)
- Each component keeps its English and German text side by side (`COPY` / `TEXT` objects).
- The choice is remembered in the browser; `?lang=de` opens the site in German.
- Enquiry emails to the team stay in English and include "please reply in German" when sent from the German site.

### Browser support (`vite.config.ts`)
- Tailwind 4 puts all styles in cascade layers (`@layer`) and uses `oklch` / `color-mix` colours. Safari before 15.4 (older Macs that can no longer update) ignores layered styles and showed the site unstyled (reported on 21 Oct 2026).
- A build step (`legacyCss`) flattens the layers and adds rgb fallbacks; JavaScript is built for the same browsers (Safari 12+, Chrome/Edge 80+, Firefox 78+). Modern browsers render pixel-identically.
- Logos and flags carry width/height attributes so the page stays readable even if the stylesheet fails to load.
- Known cosmetic limits on Safari 12–14.0: spacing between some flex items (no flex `gap`).

## Open items

1. **German proofreading.** A native speaker should read every German text. Confirm "Virtuelles Audit" and "24h-Kurzbericht" (Desk Brief).
2. **Hotel check showed "Live hotel data is temporarily unavailable" on a preview.** Check the live site; if it happens, read the Vercel logs: "GOOGLE_PLACES_API_KEY is not set" means redeploy, "Places API 403/429" means a Google key, quota or billing problem. See `docs/live-hotel-data-setup.md`.
3. **Privacy notice is English only.** A German version should be checked by someone qualified.
4. **AI theme names in the hotel check are English** on the German site. Could ask Gemini for German labels (back-end change in `api/_lib/analysis.ts`).
5. **Problem photos.** Shower thermometer, AC unit, sash-window gap and wedged fire door still use reading tiles; swap in photos if they become available.
6. **Sentiment tracking for the Partnership tier** is promised on the site but not built. The hotel check analyses the latest reviews once and keeps no history.

## Marketing plan (for consideration)

Buyers are a small group: product, contracting and quality managers at German and European tour operators selling Cape Town / Garden Route, plus Cape Town DMCs. Aim for targeted, personal contact rather than broad advertising.

### Channels
1. **LinkedIn (main channel, ~70% of effort)**
   - Active personal profiles for the founders and inspectors, not just a company page.
   - 1–2 short posts a week: "what we found" stories from inspections, "3 things German guests complain about in Cape Town hotels" from review data, short anonymised inspection videos.
   - Small paid budget to start (about EUR 300–500 a month), targeted by job title (Product Manager, Einkauf, Contracting, Quality) at tour operators in Germany, Austria and Switzerland; ads in German.
2. **Direct outreach (where the first clients come from)**
   - List of 50–100 named contacts at tour operators selling Cape Town.
   - LinkedIn connection with a personal note, then something useful: a free check of a hotel from their catalogue and an offer of the full brief.
   - Legal caution: in Germany, unsolicited marketing email to businesses generally needs prior consent (§7 UWG). Use LinkedIn messages or calls first; email after they reply or ask.
3. **Facebook and Instagram (support, ~10–20%)**
   - Credibility (an active company with field photos) and cheap retargeting of website visitors. Reuse the LinkedIn visuals.

### Call to action
- One main call to action everywhere: **"Check any hotel in your Cape Town programme — free"** linking to the hotel check (`/#virtual-audit`, or `/?lang=de#virtual-audit` for German audiences).
- Next step: **"Get the free 24-hour Desk Brief"** (captures their email). The on-site audit (about EUR 1,000) comes after trust is built; don't lead with it.
- Email list idea: a short monthly German-language note, "Cape Town hotel watch".

### Set up before running ads
1. UTM tags on every post and ad link, so enquiries can be traced to a channel.
2. LinkedIn Insight Tag and Meta Pixel for retargeting. These need a cookie consent banner and a privacy-notice update (GDPR, German visitors).
3. A proper social sharing preview (image, title, description) when the site link is posted.

### Work that could be built next
- Site: UTM-aware enquiry emails ("came from LinkedIn ad"), tracking tags behind a consent banner, social sharing image.
- Content: four weeks of LinkedIn posts in English and German, plus a few ad versions.
- Outreach: personal LinkedIn message and follow-up sequence.
- A shareable strategy document of this plan.

## Earlier roadmap ideas (not started)
- Link a Virtual Audit result to a brief request with the hotel pre-filled (partly done via the "Request the 24h Desk Brief" form in the hotel check).
- Connect the R desk brief (`analysis/german_guest_brief.R`) to the same data or move it into the API.
- Track searches against brief requests to see whether the demo brings leads.
- Booking.com reviews in the live hotel check (German guests are concentrated there).
- Automated tests for the review parser and duplicate removal.

## How to preview and roll back
- Every pushed branch gets a Vercel preview link (Vercel, then Deployments, then the Preview for the branch).
- To undo a live change: Vercel, then Deployments, then **Instant Rollback** on the previous Production deployment; or **Revert** the pull request on GitHub.

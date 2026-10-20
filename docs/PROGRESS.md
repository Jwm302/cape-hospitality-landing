# Progress and next steps

Last updated: 20 October 2026. Read this first when picking the project up again.

## Where things stand

The redesigned site is live (merged to `main` in pull request #29 and deployed by Vercel).

### Home page (top to bottom)
1. Menu: Home, Try the Demo, Services (dropdown), Sample Report, Contact, plus the English / Deutsch switch (South African and German flags).
2. Photo banner with the white-and-gold logo (`src/assets/images/logo_light.webp`), tagline and the Gutman Milne quote.
3. "The Independent Choice": two sentences, one button, three icon columns (Independent, Fast, On the Ground).
4. Hotel check ("Try It: Check Any Hotel"), presented as a consolidated multi-platform rating, not a Google search.
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

## Open items

1. **German proofreading.** A native speaker should read every German text. Confirm "Virtuelles Audit" and "24h-Kurzbericht" (Desk Brief).
2. **Hotel check showed "Live hotel data is temporarily unavailable" on a preview.** Check the live site; if it happens, read the Vercel logs: "GOOGLE_PLACES_API_KEY is not set" means redeploy, "Places API 403/429" means a Google key, quota or billing problem. See `docs/live-hotel-data-setup.md`.
3. **Privacy notice is English only.** A German version should be checked by someone qualified.
4. **AI theme names in the hotel check are English** on the German site. Could ask Gemini for German labels (back-end change in `api/_lib/analysis.ts`).
5. **Problem photos.** Shower thermometer, AC unit, sash-window gap and wedged fire door still use reading tiles; swap in photos if they become available.
6. **Sentiment tracking for the Partnership tier** is promised on the site but not built. The hotel check analyses the latest reviews once and keeps no history.

## Earlier roadmap ideas (not started)
- Link a Virtual Audit result to a brief request with the hotel pre-filled (partly done via the "Request the 24h Desk Brief" form in the hotel check).
- Connect the R desk brief (`analysis/german_guest_brief.R`) to the same data or move it into the API.
- Track searches against brief requests to see whether the demo brings leads.
- Booking.com reviews in the live hotel check (German guests are concentrated there).
- Automated tests for the review parser and duplicate removal.

## How to preview and roll back
- Every pushed branch gets a Vercel preview link (Vercel, then Deployments, then the Preview for the branch).
- To undo a live change: Vercel, then Deployments, then **Instant Rollback** on the previous Production deployment; or **Revert** the pull request on GitHub.

import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { generateContextualAuditProfile } from './src/lib/propertyAuditEngine.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI
const ai = new GoogleGenAI();

// API Route: Live Hotel Web-Grounded Audit
app.post('/api/audit-hotel', async (req: Request, res: Response) => {
  const query = req.body?.query;
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return res.status(400).json({ error: 'Property query is required' });
  }

  const cleanQuery = query.trim();

  try {
    const prompt = `You are a senior hospitality intelligence specialist for Cape Hospitality Advisors, auditing accommodation properties for European travel companies.

Search the live web for the following property in South Africa (or Southern Africa): "${cleanQuery}".
Execute targeted searches across Google Maps reviews, Booking.com, TripAdvisor, Airbnb, HolidayCheck, and travel listings for "${cleanQuery}" Western Cape South Africa to find authentic public review data.

ACCURACY & AGGREGATION DIRECTIVES (CRITICAL):
1. SIGNATURE LOCATION & NATURAL PRAISES:
   - Inspect the real geographic setting and guest sentiment.
   - If the property is oceanfront or beachfront (e.g. Neptune Isle, Tintswalo, etc.), the top praises MUST capture the actual sea views, beach access, and mountain vistas (e.g., "Uninterrupted sea views across Table Bay", "Direct beach access steps to the sand", "Postcard Table Mountain vistas").
   - If it is a wine estate or historic hotel, capture its signature estate grounds, dining, or heritage setting.
2. PHYSICAL SECURITY VS RECEPTION DESK NUANCE:
   - Clearly distinguish between PHYSICAL SECURITY (e.g., 24/7 guarded gate access, perimeter security, secured parking) and HOSPITALITY DESK CONCIERGE (e.g., full-service 24/7 hotel front-desk concierge vs self-catering lockbox / host greeting).
   - NEVER report that an establishment lacks security if it has 24-hour gate security or access control! If it is self-catering, accurately note: "Self-catering arrival format (lockbox / pre-arranged key handover) rather than 24/7 staffed hotel reception desk (notwithstanding active 24-hr access gate security)".
3. REAL SCORES AGGREGATION:
   - Look for actual rating numbers in search results (e.g., Booking.com 8.2/10 -> 82%, Google 4.4/5 -> 88%, TripAdvisor 4.0/5 -> 80%).
   - Normalize all 8 provider scores to 0-100% percentages based on real web data found.
4. UNIQUE, TAILORED INSPECTION DELTA DRIVERS (NEVER REUSE GENERIC TEMPLATES):
   - You MUST generate 3 distinct operational reality gap drivers tailored STRICTLY to this property's setting, building type, and European catalog risk factors.
   - For oceanfront/beachfront: focus on sea vs rear road acoustic allocation, coastal southeaster wind/salt door wear, or self-catering gate arrival vs concierge desk.
   - For wine estates: focus on wedding decibel curfews, dawn agricultural tractor noise, or outlying cottage walking distances.
   - For urban/waterfront: focus on working harbor/traffic acoustics, peak tour coach breakfast pacing, or courtyard vs mountain view allocations.
   - For heritage: focus on single-glazed sash windows, legacy boiler loops, or historic room size variances.
   - NEVER use the generic boilerplate phrases: "Acoustic insulation variance in street-facing or mechanical equipment wings" or "Morning shower hot water temperature drops during 07:15–08:15 peak rushes".

5. DISTINCT, REAL PUBLIC CRITIQUES (BAN GENERIC CLICHES):
   - ABSOLUTELY DO NOT repeat generic boilerplate critiques like "breakfast queue", "elevator wait times", or "substantial rate premiums required".
   - Extract the TRUE, HIGHLY SPECIFIC friction points mentioned in real guest reviews for this exact property typology:
     * For self-catering / holiday apartments: unit decor inconsistency across private owners, lack of daily towel service, tight basement parking bays, lockbox arrival logistics.
     * For boutique guesthouses / villas: absence of elevator (steep stairs with luggage), no on-site night reception after 20:00, intimate pool size.
     * For wine estates: vineyard tractor / harvest noise at dawn, seasonal insects/midges in summer vineyards, distance walking from outlying cottages to main dining.
     * For safari reserves: bumpy unpaved gravel access road, limited solar/inverter appliance wattage, spotty bush Wi-Fi.
     * For beachfront / coastal properties: southeaster coastal gale wind on balconies, ocean salt corrosion on patio doors, sea fog dampness.
     * For city center / business hotels: commercial delivery bay noise, parking garage surcharge, lack of opening fresh-air windows.

Output ONLY a raw valid JSON object without markdown code blocks, following this exact schema:
{
  "name": "Exact Official Property Name",
  "location": "District/Suburb, City/Region, South Africa",
  "propertyType": "Specific Type (e.g. Oceanfront Self-Catering Apartments, 5-Star Boutique Lodge, Historic Heritage Hotel)",
  "classification": "Classification Tier (e.g. 5-Star Luxury Asset, 4-Star Commercial Hotel, 3-Star / Self-Catering Holiday Asset)",
  "chaScore": 84,
  "chaStatus": "Optimal" | "Advisory" | "Attention Required",
  "chaDeltaReason": "-X% vs Public OTA Avg: Specific operational reality gap explanation.",
  "inspectionDeltaDrivers": [
    "Specific operational delta driver 1",
    "Specific operational delta driver 2",
    "Specific operational delta driver 3"
  ],
  "publicMetaAverage": 90.5,
  "platformScores": [
    { "id": "booking", "name": "Booking.com", "scorePercent": 91, "label": "Verified Stays", "category": "Global OTA" },
    { "id": "tripadvisor", "name": "TripAdvisor", "scorePercent": 90, "label": "Traveler Bubble", "category": "Review Community" },
    { "id": "google", "name": "Google Reviews", "scorePercent": 92, "label": "Global Sentiment", "category": "Public Network" },
    { "id": "holidaycheck", "name": "HolidayCheck", "scorePercent": 91, "label": "DACH Benchmark", "category": "German Travelers" },
    { "id": "expedia", "name": "Expedia Group", "scorePercent": 90, "label": "Package Stays", "category": "Global OTA" },
    { "id": "agoda", "name": "Agoda", "scorePercent": 92, "label": "Luxury Network", "category": "Global OTA" },
    { "id": "trustyou", "name": "TrustYou™", "scorePercent": 91, "label": "Meta Aggregate", "category": "Meta Index" },
    { "id": "tui", "name": "TUI / DERTOUR", "scorePercent": 89, "label": "Catalog Satisfaction", "category": "Travel Companies" }
  ],
  "reviewCount": "500+ Reviews",
  "subscores": {
    "cleanliness": 90,
    "comfort": 88,
    "location": 96,
    "service": 87,
    "dining": 82,
    "value": 86
  },
  "travelerSegments": {
    "couples": 52,
    "families": 28,
    "solo": 12,
    "business": 8
  },
  "europeanShare": 48,
  "frequentPraise": [
    "Accurate grounded praise 1 (e.g. Uninterrupted sea views across Table Bay)",
    "Accurate grounded praise 2 (e.g. Direct beach access steps to the sand)",
    "Accurate grounded praise 3 (e.g. 24-hour guarded security & gated access)"
  ],
  "frequentCritiques": [
    "Accurate grounded critique 1",
    "Accurate grounded critique 2",
    "Accurate grounded critique 3"
  ],
  "publicSummary": "Two sentence factual summary.",
  "blindSpots": [
    { "title": "Blind Spot 1 Title", "description": "Operational detail for travel companies." },
    { "title": "Blind Spot 2 Title", "description": "Operational detail for travel companies." },
    { "title": "Blind Spot 3 Title", "description": "Operational detail for travel companies." }
  ],
  "provenanceTier": "LIVE_GROUNDED",
  "provenanceLabel": "Live Multi-Platform Web Radar (High Web Presence)",
  "webPresenceStrength": "High",
  "sentimentDisclaimer": "Aggregated from unweighted online guest reviews across public OTAs. Physical on-site inspection independently verifies catalog compliance."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const responseText = response.text || '';
    
    // Extract JSON from response text (handling potential markdown wrapper)
    let jsonString = responseText.trim();
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.slice(7);
    } else if (jsonString.startsWith('```')) {
      jsonString = jsonString.slice(3);
    }
    if (jsonString.endsWith('```')) {
      jsonString = jsonString.slice(0, -3);
    }
    jsonString = jsonString.trim();

    const profile = JSON.parse(jsonString);

    return res.json({
      success: true,
      profile,
      grounded: true,
    });
  } catch (error: any) {
    console.warn('Gemini live grounding unavailable or quota reached, generating tailored contextual synthesis fallback:', error?.message);

    const fallbackProfile = generateContextualAuditProfile(cleanQuery);

    return res.json({
      success: true,
      profile: fallbackProfile,
      grounded: false,
    });
  }
});

// Vite middleware for dev / static for prod
const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} (dev mode: ${!isProduction})`);
  });
}

startServer();

import { GoogleGenAI } from '@google/genai';
import { generateContextualAuditProfile } from '../src/lib/propertyAuditEngine';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const query = req.body?.query;
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return res.status(400).json({ error: 'Property query is required' });
  }

  const cleanQuery = query.trim();

  try {
    const ai = new GoogleGenAI();
    const prompt = `You are a senior hospitality intelligence specialist for Cape Hospitality Advisors, auditing accommodation properties for European travel companies.

Search the live web for the following property in South Africa (or Southern Africa): "${cleanQuery}".
Execute targeted searches across Google Maps reviews, Booking.com, TripAdvisor, Airbnb, HolidayCheck, and travel listings for "${cleanQuery}" Western Cape South Africa to find authentic public review data.

ACCURACY & AGGREGATION DIRECTIVES (CRITICAL):
1. SIGNATURE LOCATION & NATURAL PRAISES:
   - Inspect the real geographic setting and guest sentiment.
   - If the property is oceanfront or beachfront (e.g. Neptune Isle, Tintswalo, etc.), the top praises MUST capture the actual sea views, beach access, and mountain vistas.
   - If it is a wine estate or historic hotel, capture its signature estate grounds, dining, or heritage setting.
2. PHYSICAL SECURITY VS RECEPTION DESK NUANCE:
   - Clearly distinguish between PHYSICAL SECURITY (e.g. 24/7 guarded gate access) and HOSPITALITY CONCIERGE (e.g. full-service hotel reception vs self-catering lockbox / host greeting).
   - NEVER report that an establishment lacks security if it has 24-hour gate security or access control!
3. REAL SCORES AGGREGATION:
   - Normalize all 8 provider scores to 0-100% percentages based on authentic web data found.
4. UNIQUE, TAILORED INSPECTION DELTA DRIVERS (NEVER REUSE GENERIC TEMPLATES):
   - Generate 3 distinct operational reality gap drivers tailored STRICTLY to this property's setting.
5. DISTINCT, REAL PUBLIC CRITIQUES (BAN GENERIC CLICHES):
   - DO NOT repeat generic boilerplate critiques like "breakfast queue", "elevator wait times", or "substantial rate premiums required".
   - Extract the TRUE, HIGHLY SPECIFIC friction points from real guest reviews for this exact property.

6. NO LEGAL OR TECHNICAL CLAIMS:
   - Do NOT cite laws, the Frankfurt Table / Frankfurter Tabelle, the EU Package Travel Directive, refund percentages, or legal liability.
   - Describe risks in plain terms: likely guest complaints, refund requests, and catalog accuracy. Do not present findings as technical or certified measurements.

Output ONLY a raw valid JSON object without markdown code blocks, following this exact schema:
{
  "name": "Exact Official Property Name",
  "location": "District/Suburb, City/Region, South Africa",
  "propertyType": "Specific Type",
  "classification": "Classification Tier",
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
    "Accurate grounded praise 1",
    "Accurate grounded praise 2",
    "Accurate grounded praise 3"
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

    return res.status(200).json({
      success: true,
      profile,
      grounded: true,
    });
  } catch (error: any) {
    console.warn('Gemini live grounding fallback:', error?.message);
    const fallbackProfile = generateContextualAuditProfile(cleanQuery);
    return res.status(200).json({
      success: true,
      profile: fallbackProfile,
      grounded: false,
    });
  }
}

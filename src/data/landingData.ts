import { PillarItem, InspectionDeliverableData } from '../types';

export const HERO_CONTENT = {
  headline: "Protecting Your Brand Standards Across the Cape, from Cape Town to the Garden Route.",
  subheadline: "Independent, anonymous hotel quality inspections tailored for premier European tour operators. We ensure your portfolio delivers on its promises across the Western Cape.",
  primaryCta: "Schedule a Briefing",
  secondaryCta: "View Our Inspection Pillars",
  keyStats: [
    { label: "Post-Audit SLA", value: "48h", caption: "Full dossier in your inbox" },
    { label: "Inspection Checkpoints", value: "420+", caption: "Rigorous luxury benchmarks" },
    { label: "Inspector Discretion", value: "100%", caption: "Unannounced mystery guest" },
    { label: "Regional Coverage", value: "Western Cape", caption: "Cape Town to Garden Route" },
  ],
  coveredDestinations: [
    "Cape Town (Atlantic Seaboard & City Bowl)",
    "Cape Peninsula & False Bay",
    "Constantia & Cape Winelands",
    "Overberg & Hermanus Coast",
    "Knysna & Plettenberg Bay",
    "Garden Route Coastal Corridor",
  ],
};

export const VALUE_PROPOSITION_CONTENT = {
  sectionTitle: "Risk Mitigation for Global Tour Operators",
  bodyText: "German holidaymakers expect precision. A single drop in service or safety standard at a partner hotel risks your brand reputation and operator liability. We act as your on-the-ground eyes and ears, auditing properties against strict international luxury benchmarks.",
  keyRisksAddressed: [
    {
      title: "EU Package Travel & Liability Defense",
      description: "Under strict European consumer protection laws (e.g. Frankfurter Tabelle), service deviations and hygiene shortcomings expose operators to mandatory post-trip compensations.",
      tag: "Financial Defense",
    },
    {
      title: "Reputational & Brand Shielding",
      description: "Word-of-mouth among high-net-worth European travelers spreads rapidly. One compromised stay compromises your entire seasonal client renewal rate.",
      tag: "Brand Equity",
    },
    {
      title: "Objective SLA Contract Enforcement",
      description: "Hotels often market 5-star claims while quietly trimming staff ratios. Our audits provide contractual leverage to enforce agreed service standards or renegotiate allocations.",
      tag: "Contract Integrity",
    },
  ],
};

export const FOUR_PILLARS_CONTENT: PillarItem[] = [
  {
    id: 'guest-journey',
    columnNumber: 1,
    title: "Guest Journey & Service Flow",
    description: "Evaluation of check-in, concierge responsiveness, and staff hospitality compliance.",
    iconName: "Compass",
    focusAreas: [
      "Arrival protocol & luggage handling speed",
      "Check-in warmth & bespoke personalization",
      "Concierge local mastery & responsiveness",
      "Staff greeting cadence & emotional intelligence",
      "Express check-out accuracy & farewell warmth",
    ],
    metricsSample: "94.2% Service Flow Index",
  },
  {
    id: 'housekeeping',
    columnNumber: 2,
    title: "Housekeeping & Room Readiness",
    description: "Deep-dive technical audits of room hygiene, maintenance, and setup standards.",
    iconName: "BedDouble",
    focusAreas: [
      "UV & luminescence hygiene verification",
      "Linen thread count & pillow integrity",
      "HVAC, water pressure & acoustic isolation",
      "Turndown execution & amenities staging",
      "Wear-and-tear & preventive maintenance log",
    ],
    metricsSample: "98.1% Hygiene Standard",
  },
  {
    id: 'food-and-beverage',
    columnNumber: 3,
    title: "Food & Beverage Excellence",
    description: "Anonymous testing of culinary quality, service pacing, and hygiene protocols.",
    iconName: "UtensilsCrossed",
    focusAreas: [
      "Breakfast mise-en-place & dietary attentiveness",
      "Wine cellar service & sommelier pairing",
      "Course pacing & serving temperature precision",
      "Back-of-house hygiene & HACCP adherence",
      "Room service delivery timing & presentation",
    ],
    metricsSample: "89.7% Culinary Benchmark",
  },
  {
    id: 'safety-compliance',
    columnNumber: 4,
    title: "Safety & Compliance",
    description: "Verification of asset protection, guest safety measures, and facility upkeep.",
    iconName: "ShieldCheck",
    focusAreas: [
      "Fire egress routes & smoke detection tests",
      "Pool, spa & recreational area safety",
      "Generator backup & critical power resilience",
      "Secure perimeter & night patrol integrity",
      "Health emergency kits & staff first-responder drill",
    ],
    metricsSample: "100% Life-Safety Compliance",
  },
];

export const DELIVERABLE_CONTENT = {
  sectionTitle: "Data-Driven, Actionable Intelligence",
  bodyText: "We don't just provide opinions; we deliver comprehensive, checklist-based metrics. Within 48 hours of an inspection, you receive a full compliance report mapping out exact service gaps, photographic evidence, and immediate training recommendations for the hotel management.",
  sampleInspection: {
    title: "Executive Audit Dossier: Sample Cape Coastal Boutique Hotel",
    propertyCategory: "Luxury Coastal Retreat (Cape Peninsula / Garden Route)",
    inspectionDate: "Recent Mystery Stay",
    overallScore: 91.4,
    slaHours: 48,
    pillarsScores: [
      { name: "Guest Journey & Service Flow", score: 94, benchmark: 90 },
      { name: "Housekeeping & Room Readiness", score: 96, benchmark: 92 },
      { name: "Food & Beverage Excellence", score: 84, benchmark: 90 },
      { name: "Safety & Compliance", score: 92, benchmark: 95 },
    ],
    sampleGaps: [
      {
        category: "Food & Beverage",
        severity: "Medium" as const,
        finding: "Dinner main course delay of 38 minutes between entrée and venison loin; wine pairing poured 15 minutes prior to food arrival.",
        remedy: "Expediter training required on tasting menu sequencing; pass-timing protocol reinforcement.",
      },
      {
        category: "Housekeeping",
        severity: "Low" as const,
        finding: "Private plunge pool heater thermostat fluctuating 4°C below standard night temperature.",
        remedy: "Immediate thermostatic calibration assigned to resort engineering team.",
      },
      {
        category: "Safety & Compliance",
        severity: "High" as const,
        finding: "Secondary fire egress door near eastern pavilion suite slightly obstructed by service linen trolley at 22:30.",
        remedy: "Unobstructed night corridor mandate issued to night duty manager with daily photographic check-in.",
      },
    ],
  },
};

export const CONFIDENTIALITY_CONTENT = {
  sectionTitle: "100% Discrete Operations",
  bodyText: "Anonymity is our core asset. Our inspectors blend in perfectly as high-end leisure or business travelers. Hotel management and on-site staff remain entirely unaware of the audit until your team decides to share the results.",
  protocols: [
    {
      title: "Natural European Traveler Profiles",
      description: "Inspectors check in using genuine, individual private identities matching standard affluent European holidaymaker demographics. No corporate telltales.",
    },
    {
      title: "Direct Independent Payment Channels",
      description: "All incidental and lodging expenditures are settled through neutral private consumer accounts, leaving zero trace in hotel accounting systems.",
    },
    {
      title: "Zero In-Stay Confrontation",
      description: "Service slips are meticulously recorded with timestamped, high-resolution evidence without triggering staff suspicion or altered behavior.",
    },
    {
      title: "Embargoed Partner Release",
      description: "You hold sole ownership of the findings. The audited property only ever learns of the results if, when, and how your executive team chooses to present them.",
    },
  ],
};

export const FOOTER_CONTENT = {
  headline: "Secure Your Portfolio's Quality.",
  submitButtonText: "Request a Sample Audit Report",
  subtext: "Join leading tour operators from Frankfurt, Munich, Zurich, and London who rely on Cape Hospitality Advisors to safeguard their reputation across the Cape, from Cape Town to the Garden Route.",
};

export const SERVICES_HEADER_CONTENT = {
  eyebrow: "HOTEL QUALITY ASSURANCE FOR TRAVEL COMPANIES",
  headline: "Independent. Anonymous. On the Ground.",
  subheadline: "Your customers experience the hotel. We experience it as your customer.",
  mission: "Cape Hospitality Advisors provides independent, anonymous hotel inspections for tour operators, travel agencies and travel companies. Our mission is simple: to make sure the hotel you sell today still delivers the quality your customers expect.",
};

export const PRICING_PACKAGES = [
  {
    id: "essential",
    tierNumber: "01",
    tier: "ESSENTIAL",
    title: "Essential Hotel Check",
    tagline: "A fast, independent reality check.",
    description: "For travel companies who need to verify the current condition of a hotel without commissioning a full audit. The Essential Hotel Check provides a focused snapshot of the most important guest-facing areas.",
    ctaText: "Inquire for Essential Check",
    features: [
      "Anonymous hotel inspection",
      "Arrival & check-in experience",
      "Guest room & bathroom inspection",
      "Cleanliness & general maintenance",
      "Basic service assessment",
      "Breakfast / F&B impression",
      "Public areas & facilities",
      "Photographic evidence",
      "Key findings summary",
      "Overall Quality Score",
    ],
    idealFor: "A quick verification before contracting, renewing or recommending a hotel.",
    questionAnswered: "“Is this hotel still delivering what we are selling?”",
  },
  {
    id: "professional",
    tierNumber: "02",
    tier: "PROFESSIONAL",
    title: "Professional Hotel Audit",
    tagline: "The complete independent hotel quality audit.",
    description: "Our core service for travel companies that need a reliable, objective assessment of their hotel partners. The Professional Hotel Audit follows the complete guest journey and evaluates the hotel against clearly defined quality criteria.",
    isPopular: true,
    additiveNote: "Includes everything in Essential, plus:",
    ctaText: "Select Professional Audit",
    features: [
      "Full guest journey assessment",
      "Detailed room & housekeeping inspection",
      "Front Office & reception",
      "Staff interaction & service quality",
      "Restaurant & breakfast service",
      "Hotel facilities & amenities",
      "Maintenance & condition",
      "Service consistency",
      "Detailed quality scoring",
      "Extensive photographic documentation",
      "Executive Management Summary",
      "Priority findings",
      "Recommended corrective actions",
    ],
    idealFor: "Regular quality control of contracted hotels and important destination properties.",
    questionAnswered: "“What would our customer actually experience if they stayed here today?”",
    highlights: ["The Professional Hotel Audit gives you the best balance between depth, insight and cost."],
  },
  {
    id: "premium",
    tierNumber: "03",
    tier: "PREMIUM",
    title: "Premium Deep-Dive Audit",
    tagline: "Go beyond the symptoms. Understand what has changed.",
    description: "Designed for high-value hotels, critical properties or situations where you need a deeper investigation. The Premium Deep-Dive looks at the hotel from the perspective of a demanding international guest — across multiple touchpoints and, where appropriate, different times of the day.",
    additiveNote: "Includes everything in Professional, plus:",
    ctaText: "Inquire for Premium Deep-Dive",
    features: [
      "Extended guest experience assessment",
      "Multiple service touchpoints",
      "Deeper F&B assessment",
      "Service consistency analysis",
      "Staff interaction analysis",
      "Detailed facility assessment",
      "Maintenance & deterioration analysis",
      "Comparison with previous inspection results, where available",
      "Risk identification",
      "Management-level recommendations",
      "Detailed Improvement Action Plan",
      "Priority ranking of critical findings",
      "Follow-up consultation with the travel company",
    ],
    idealFor: "Hotels where quality concerns have emerged, important strategic properties, or hotels showing signs of deterioration.",
    questionAnswered: "“What has changed — and what could negatively affect our customers?”",
  },
  {
    id: "partnership",
    tierNumber: "04",
    tier: "PARTNERSHIP",
    title: "Hotel Quality Monitoring Partnership",
    tagline: "Continuous independent quality control.",
    description: "Don’t wait for customer complaints to tell you that something has changed. Hotels can change quickly: management changes, staff changes, chefs change, maintenance deteriorates, and service standards decline. Our Quality Monitoring Partnership provides travel companies with ongoing independent oversight of their hotel portfolio.",
    ctaText: "Discuss Quality Partnership",
    features: [
      "Regular anonymous hotel inspections",
      "Agreed inspection frequency",
      "Consistent Quality Score methodology",
      "Comparison with previous inspections",
      "Identification of quality trends",
      "Early warning of deterioration",
      "Photographic evidence",
      "Management summaries",
      "Corrective action recommendations",
      "Follow-up inspections",
      "Portfolio-level reporting",
      "Priority alerts for significant quality issues",
    ],
    idealFor: "Tour operators and travel companies with multiple contracted hotels who want continuous control of their destination portfolio.",
    questionAnswered: "“Is our hotel portfolio maintaining the quality we promise our customers?”",
  },
];

export const QUALITY_LADDER_CONTENT = {
  title: "THE CAPE HOSPITALITY QUALITY LADDER",
  tagline: "Start with a Check. Move to an Audit. Go deeper when necessary. Monitor continuously when quality really matters.",
  steps: [
    {
      id: "essential",
      tierNumber: "01",
      name: "ESSENTIAL",
      tagline: "A quick reality check.",
      tierKey: "ESSENTIAL",
    },
    {
      id: "professional",
      tierNumber: "02",
      name: "PROFESSIONAL",
      tagline: "The complete hotel audit.",
      isPopular: true,
      tierKey: "PROFESSIONAL",
    },
    {
      id: "premium",
      tierNumber: "03",
      name: "PREMIUM",
      tagline: "Deep investigation & improvement plan.",
      tierKey: "PREMIUM",
    },
    {
      id: "partnership",
      tierNumber: "04",
      name: "QUALITY PARTNERSHIP",
      tagline: "Continuous portfolio monitoring.",
      tierKey: "PARTNERSHIP",
    },
  ],
};

export const CORE_PROMISE_CONTENT = {
  title: "OUR CORE PROMISE",
  lead: "We don’t inspect hotels for the sake of producing reports. We help travel companies protect their product.",
  body1: "Your hotel contracts may have been negotiated months or even years ago. But the hotel your customer experiences today may be very different.",
  body2: "We give you an independent set of eyes on the ground — before your customers give you their feedback.",
};

export const OUR_USPS = [
  {
    key: "LOCAL",
    title: "LOCAL",
    tagline: "On the ground across the Western Cape, including the famous Garden Route.",
    description: "No international flight delays or remote guesswork. Our teams are permanently based on the ground across the whole of the Western Cape—including Cape Town, the Winelands, and the Garden Route—with rapid deployment to luxury boutique hotels, coastal estates, and premier safari lodges.",
    icon: "MapPin",
  },
  {
    key: "HOSPITALITY EXPERTISE",
    title: "HOSPITALITY EXPERTISE",
    tagline: "Executive traveler standards & operations expertise.",
    description: "Our inspectors evaluate properties with the exacting eye of seasoned European hospitality professionals. We know exactly what your high-end clients expect because we have operated luxury properties and lived out of premium hotels worldwide.",
    icon: "Award",
  },
  {
    key: "GERMAN PERSPECTIVE",
    title: "GERMAN OPERATOR CRITERIA",
    tagline: "We evaluate based on German tour operator requirements.",
    description: "Trained on the exacting nuances German travelers and tour operators expect: uncompromising punctuality, precision logistics, acoustic noise isolation, spotless bathroom hygiene, and culinary consistency.",
    icon: "Compass",
  },
  {
    key: "INDEPENDENT",
    title: "INDEPENDENT",
    tagline: "We work strictly for the travel company's quality interests.",
    description: "We hold zero commercial ties to audited properties. In simple terms: we observe, assess and recommend — we do not certify or legally determine compliance, providing an unvarnished reality check.",
    icon: "ShieldCheck",
  },
  {
    key: "FAST",
    title: "FAST 48H SLA",
    tagline: "Problems can be checked before they become complaints.",
    description: "Rapid deployment and 48-hour executive report delivery. Pinpoint emerging service degradation or maintenance slippage before it ever manifests in negative European reviews or catalog compensation claims.",
    icon: "Zap",
  },
  {
    key: "VIRTUAL AUDIT",
    title: "AGENT VIRTUAL AUDIT",
    tagline: "Instant digital benchmarking against German standards.",
    description: "Before deploying physical inspectors, our Agent Virtual Audit evaluates multi-source operational signals against German catalog benchmarks. Get your free data package now to review any Cape property.",
    icon: "BarChart3",
  },
];

export const DATA_SCIENCE_CONTENT = {
  headline: "Data-Science & Sentiment Alignment",
  quote: "We combine deep physical mystery guest audits with all-time historical review sentiment data to pinpoint exactly where your revenue is leaking.",
  heroMetricTitle: "The Hero Metric (10% Risk Discrepancy)",
  heroStatisticalBlurb: "Standard booking platform filters blindside operators to critical contract hazards, leaving a 10% compliance data blind spot hidden directly inside the text reviews of your premium assets—exposing your organization to severe liability (Veranstalterhaftung) under German travel law.",
  analystVerdict: {
    badge: "ANALYST VERDICT • CORPORATE LIABILITY ANALYSIS",
    paragraph1: "Traditional Booking.com scoring structures create a dangerous corporate blind spot. Relying on aggregate metrics (like an 8.2/10 rating) masks critical operational decay.",
    paragraph2: "Our pilot study demonstrates that a collective 10% of text reviews nested inside these highly rated profiles contain hidden, unmanaged safety and hygiene hazards. Standard filters blindside procurement teams to these contract defects—leaving a collective 10% compliance data blind spot hidden in your premium assets that directly exposes your organization to severe liability under German travel law (Veranstalterhaftung).",
  },
  description: "Traditional mystery shopping provides only a single snapshot in time. We cross-reference our 420-point on-site physical inspection metrics with multi-year NLP sentiment data scraped from TripAdvisor, Google Reviews, and Booking.com across your partner hotels. This statistical triangulation exposes whether a service failure is an isolated slip or an ingrained systemic leak driving booking cancellations.",
  benchmarkTable: [
    {
      assetCode: "Premium Maritime Waterfront Asset",
      descriptor: "Cape Town V&A Waterfront Corridor • Booking.com 8.0/10",
      platformRating: "⭐ 4.0 / 5",
      hygieneIndex: "88% (Suboptimal)",
      hygieneStatus: "suboptimal",
      safetyIndex: "95% (Optimal)",
      safetyStatus: "optimal",
    },
    {
      assetCode: "Urban Convention & Business Hub",
      descriptor: "Cape Town City Bowl & Convention Center • Booking.com 8.2/10",
      platformRating: "⭐ 4.1 / 5",
      hygieneIndex: "100% (Exzellent)",
      hygieneStatus: "exzellent",
      safetyIndex: "100% (Exzellent)",
      safetyStatus: "exzellent",
    },
    {
      assetCode: "Coastal Eco-Resort & Spa Property",
      descriptor: "Garden Route Coastal Eco-Resort & Spa • Booking.com 8.2/10",
      platformRating: "⭐ 4.1 / 5",
      hygieneIndex: "82% (Risiko)",
      hygieneStatus: "critical",
      safetyIndex: "82% (Risiko)",
      safetyStatus: "critical",
    },
  ],
  enginePerformanceInsights: {
    sectionTitle: "ENGINE PERFORMANCE & OPERATIONS INSIGHTS",
    columns: [
      {
        id: "risk-severity-triage",
        columnLabel: "RISK SEVERITY TRIAGE",
        subLabel: "Die Triage-Matrix",
        title: "Automated Risk Level Classification",
        metric: "20.0% Level 3 Liability",
        metricValue: "20.0%",
        metricUnit: "Level 3 Liability",
        copy: "Our algorithm reads text profiles and triages anomalies into operational lenses. Across our active portfolio data, 20% of flagged text blocks represent critical Level 3 Legal Liabilities (Haftungsrisiko), while 60% expose Level 2 Contractual Defects (Mängel)—allowing compliance teams to triage risks instantly.",
      },
      {
        id: "workload-optimization",
        columnLabel: "WORKLOAD OPTIMIZATION",
        subLabel: "The Hybrid Trigger",
        title: "Efficiency-Driven Resource Allocation",
        metric: "95.5% Noise Reduction",
        metricValue: "95.5%",
        metricUnit: "Noise Reduction",
        copy: "Our deterministic filtering layer automatically reduces manual quality management audit overhead by 95.5%.\n\nBy evaluating incoming text arrays locally, the system completely filters out conversational noise and generic praise. Only 2.0% of portfolio reviews contain critical anomalies that trigger our advanced AI semantic processing, automatically routing targeted, high-priority deployment orders to our physical on-site field inspectors. This transforms human auditing from a blind corporate expense into a precision risk-mitigation tool.",
      },
      {
        id: "temporal-compliance-drift",
        columnLabel: "TEMPORAL COMPLIANCE DRIFT",
        subLabel: "Frühwarnsystem",
        title: "Predictive Performance Drift Vector",
        metric: "+12.0 Performance Drift",
        metricValue: "+12.0",
        metricUnit: "Performance Drift",
        copy: "Our temporal engine separates long-term data baselines from ultra-recent feedback windows. While our comparative benchmarking table captures the macro-historical average of 88% for the Premium Maritime Waterfront Asset, this module isolates a +12.0 performance correction vector based strictly on the latest rolling window of recent reviews—capturing a real-time shift to 100% compliance well before traditional platform ratings register a change.",
      },
    ],
  },
};

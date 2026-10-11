import { ServiceTier, UspItem } from '../types';

// Single source of truth for the service ladder. The pricing cards, the
// inquiry form and the briefing modal all read from this list.
export const SERVICE_TIERS: ServiceTier[] = [
  {
    key: 'VIRTUAL_AUDIT',
    tierNumber: '01',
    badge: 'FREE',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    title: 'Free Virtual Audit',
    shortLabel: 'Free Virtual Audit (24h desk brief)',
    tagline: 'A 24-hour desk check of any hotel on your books.',
    description: 'Name a hotel. Our Cape Town desk reviews European guest feedback against German catalog criteria and sends you a 2-page brief within 24 hours.',
    isFree: true,
    priceDisplay: 'Free for travel companies',
    ctaText: 'Request Free Virtual Audit',
    features: [
      'Brief in your inbox within 24 hours',
      'Specific to the hotel you name',
      'Checked against German travel company (DRV) expectations',
      'Flags noise, bathroom hygiene & service-flow risks',
      'Sets the checklist if an on-site audit follows',
    ],
    questionAnswered: '“Does this hotel deliver what we sell?”',
  },
  {
    key: 'PHYSICAL_AUDIT',
    tierNumber: '02',
    badge: 'CORE SERVICE',
    badgeColor: 'bg-[#b38a54]/10 text-[#9c753e] border-[#b38a54]/30',
    isPopular: true,
    title: 'On-Site Mystery Audit',
    shortLabel: 'On-Site Mystery Audit',
    tagline: 'An anonymous, unannounced stay by our inspectors.',
    description: 'A 24–48 hour mystery stay anywhere from Cape Town to the Garden Route, carried out by European-trained hospitality professionals.',
    priceDisplay: 'Quoted per property',
    ctaText: 'Commission On-Site Audit',
    features: [
      '24–48 hour anonymous mystery stay',
      'Arrival, room, bed comfort & bathroom hygiene',
      'Night-time noise and morning hot-water checks',
      'Dated photos, timings & indicative readings',
      'Factual record to answer disputed guest claims',
      'Management report within 48 hours',
    ],
    questionAnswered: '“What would our guest experience if they arrived today?”',
  },
  {
    key: 'PARTNERSHIP',
    tierNumber: '03',
    badge: 'ONGOING',
    badgeColor: 'bg-zinc-100 text-zinc-800 border-zinc-200',
    title: 'Portfolio Quality Partnership',
    shortLabel: 'Portfolio Quality Partnership',
    tagline: 'Continuous oversight of your Western Cape hotels.',
    description: 'Managers move on, chefs leave, maintenance slips. Regular unannounced inspections catch the decline before your guests do.',
    priceDisplay: 'Seasonal retainer',
    ctaText: 'Discuss a Partnership',
    features: [
      'Scheduled unannounced inspections',
      'Comparable scores across every partner hotel',
      'Early warning when standards slip',
      'Pre-season checks before peak European arrivals',
      'Direct line to your procurement team',
    ],
    questionAnswered: '“Is our whole portfolio keeping its promise?”',
  },
];

export const getServiceTier = (key: string): ServiceTier =>
  SERVICE_TIERS.find((t) => t.key === key) ?? SERVICE_TIERS[1];

export const OUR_USPS: UspItem[] = [
  {
    key: 'INDEPENDENT',
    title: 'PAID ONLY BY YOU',
    tagline: 'We work for the travel company, never the hotel.',
    description: 'No awards, plaques or consulting sold to hotels. Our only client is the company whose reputation is on the line.',
    icon: 'ShieldCheck',
  },
  {
    key: 'HYPOTHESIS-DRIVEN',
    title: 'TARGETED, NOT GENERIC',
    tagline: 'Every stay is briefed by the Virtual Audit.',
    description: 'Before arrival, the Virtual Audit tells our inspectors what guests complain about at that specific hotel, so the stay tests the real weak points.',
    icon: 'BarChart3',
  },
  {
    key: 'OBJECTIVE EVIDENCE',
    title: 'FACTS, NOT REVIEWS',
    tagline: 'Reviews show patterns. We document facts.',
    description: 'Online reviews are anonymous and unverified, and carry little weight when a complaint is disputed. Our inspectors record dated, first-hand observations with photographs and timings, giving your customer-care and contracting teams a factual record to work from.',
    icon: 'Zap',
  },
  {
    key: 'LOCAL',
    title: 'ON THE GROUND, 48H REPORTS',
    tagline: 'Based in Cape Town and the Western Cape.',
    description: 'No flights to arrange and no remote guesswork. Full report with photographs within 48 hours of check-out.',
    icon: 'MapPin',
  },
];

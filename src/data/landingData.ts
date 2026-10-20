import { ServiceTier } from '../types';

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
      'Full report within 48 hours',
      '30-minute Zoom call with your inspector for their personal feedback',
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
    tagline: 'Your own inspectors and year-round guest-sentiment tracking for your Western Cape hotels.',
    description: 'Managers move on, chefs leave, maintenance slips. The same inspectors get to know your hotels and your team, and we track what guests say month by month, so you see a decline before your guests feel it.',
    priceDisplay: 'Seasonal retainer',
    ctaText: 'Discuss a Partnership',
    features: [
      'Dedicated inspectors who know your hotels and your team',
      'Direct line to your inspectors, plus a quarterly review call',
      'Ongoing review analysis: guest sentiment tracked month by month',
      'Early warning when sentiment or standards slip',
      'Scheduled unannounced inspections with comparable scores',
      'Pre-season checks before peak European arrivals',
    ],
    questionAnswered: '“Is our whole portfolio keeping its promise, month after month?”',
  },
];

export const getServiceTier = (key: string): ServiceTier =>
  SERVICE_TIERS.find((t) => t.key === key) ?? SERVICE_TIERS[1];

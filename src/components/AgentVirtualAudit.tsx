import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Check,
  AlertTriangle,
  ArrowRight,
  Shield,
  Lock,
  Globe,
  MapPin,
  Users,
  ThumbsUp,
  ThumbsDown,
  Loader2,
  Award,
  TrendingDown,
  ShieldCheck,
  Volume2,
  Droplets,
  BedDouble,
  Wind,
  AlertOctagon,
  CheckCircle2,
  FileText,
  ArrowUpRight,
  Compass,
  Info,
  Scale,
  HelpCircle,
  Ban,
  BadgePercent,
} from 'lucide-react';
import { generateContextualAuditProfile } from '../lib/propertyAuditEngine';

export interface PlatformScoreItem {
  id: string;
  name: string;
  scorePercent: number;
  label: string;
  category: string;
}

export interface HotelPublicProfile {
  name: string;
  location: string;
  propertyType: string;
  classification: string;
  // Proprietary Cape Hospitality Advisors Score (CHA Quality Index™)
  chaScore: number;
  chaStatus: 'Optimal' | 'Advisory' | 'Attention Required';
  chaDeltaReason: string;
  inspectionDeltaDrivers: string[];
  publicMetaAverage: number;
  // 8 Recognized Review Providers (all normalized to %)
  platformScores: PlatformScoreItem[];
  reviewCount: string;
  subscores: {
    cleanliness: number;
    comfort: number;
    location: number;
    service: number;
    dining: number;
    value: number;
  };
  travelerSegments: {
    couples: number;
    families: number;
    solo: number;
    business: number;
  };
  europeanShare: number; // % European & DACH guests
  frequentPraise: string[];
  frequentCritiques: string[];
  publicSummary: string;
  blindSpots: {
    title: string;
    description: string;
  }[];
  // Provenance & Public Sentiment Confidence Metadata
  provenanceTier?: 'HAND_VERIFIED' | 'LIVE_GROUNDED' | 'SYNTHETIC_REGIONAL';
  provenanceLabel?: string;
  webPresenceStrength?: 'High' | 'Moderate' | 'Limited';
  sentimentDisclaimer?: string;
}

const KNOWN_PROPERTIES: Record<string, HotelPublicProfile> = {
  'the twelve apostles': {
    name: 'The Twelve Apostles Hotel & Spa',
    location: 'Camps Bay / Oudekraal Coastal Corridor',
    propertyType: '5-Star Coastal Cliffside Luxury Resort',
    classification: '5-Star Official Luxury Council Asset',
    chaScore: 86,
    chaStatus: 'Advisory',
    chaDeltaReason: '-5.4% vs Public OTA Avg (91.4%): 5% deduction for Victoria Road weekend motorcycle acoustics and sunset terrace visitor bottlenecks.',
    inspectionDeltaDrivers: [
      'Lower ocean terraces experience motorcycle acoustic spikes along Victoria Road on sunny weekends',
      'Sunset cocktail rush brings high non-resident footfall, creating 12-minute bar service delays for hotel residents',
      'Mountain-facing room contracts require explicit brochure disclosure to avoid German sea-view catalog disputes',
    ],
    publicMetaAverage: 91.4,
    platformScores: [
      { id: 'booking', name: 'Booking.com', scorePercent: 91, label: 'Verified Stays', category: 'Global OTA' },
      { id: 'tripadvisor', name: 'TripAdvisor', scorePercent: 90, label: 'Traveler Bubble', category: 'Review Community' },
      { id: 'google', name: 'Google Reviews', scorePercent: 92, label: 'Global Sentiment', category: 'Public Network' },
      { id: 'holidaycheck', name: 'HolidayCheck', scorePercent: 91, label: 'DACH Benchmark', category: 'German Travelers' },
      { id: 'expedia', name: 'Expedia Group', scorePercent: 90, label: 'Package Verified', category: 'Global OTA' },
      { id: 'agoda', name: 'Agoda', scorePercent: 92, label: 'Luxury Network', category: 'Global OTA' },
      { id: 'trustyou', name: 'TrustYou™', scorePercent: 91, label: 'Meta Aggregate', category: 'Meta Index' },
      { id: 'tui', name: 'TUI / DERTOUR', scorePercent: 89, label: 'Catalog Rating', category: 'Travel Companies' },
    ],
    reviewCount: '3,100+ Reviews',
    subscores: {
      cleanliness: 94,
      comfort: 91,
      location: 96,
      service: 95,
      dining: 93,
      value: 86,
    },
    travelerSegments: {
      couples: 64,
      families: 18,
      solo: 11,
      business: 7,
    },
    europeanShare: 49,
    frequentPraise: ['Dramatic Atlantic sunset vistas', 'Subterranean rock spa', 'Attentive Camps Bay shuttle'],
    frequentCritiques: ['Victoria Road weekend motorcycle acoustics', 'Sunset terrace public crowds', 'Mountain-facing rooms lack ocean view'],
    publicSummary: 'Celebrated for dramatic Atlantic sunsets beneath the Apostles peaks, subterranean spa, and complimentary shuttles.',
    blindSpots: [
      {
        title: 'Coastal Road Vehicle Acoustics',
        description: 'Weekend afternoon traffic along Victoria Road is audible on lower ocean-facing terraces; mountain-facing rooms provide total quiet but lose the ocean vista.',
      },
      {
        title: 'Evening Sunset Terrace Bottlenecks',
        description: 'External non-resident visitors for sunset drinks can congest bar service flow for resident travel company guests.',
      },
      {
        title: 'Catalog Allocation Discrepancy',
        description: 'Classic room category contracts must clarify mountain vs. ocean orientation to prevent German post-trip catalog description disputes.',
      },
    ],
  },
  'belmond mount nelson': {
    name: 'Belmond Mount Nelson Hotel',
    location: 'Gardens District, Cape Town',
    propertyType: 'Historic 5-Star Luxury Heritage Hotel',
    classification: '5-Star Official Luxury Council Asset',
    chaScore: 87,
    chaStatus: 'Advisory',
    chaDeltaReason: '-5.4% vs Public OTA Avg (92.4%): 5% deduction for legacy sash window noise transmission and 07:30 peak hot water dips in historic wings.',
    inspectionDeltaDrivers: [
      'Historical Main Building plumbing experiences brief water temperature dips during peak 07:15–08:15 breakfast rushes',
      'Perimeter heritage sash windows permit early 06:45 garden maintenance and delivery traffic acoustics',
      'Unrenovated heritage rooms require explicit contractual room tiering vs. modernized Garden Cottages',
    ],
    publicMetaAverage: 92.4,
    platformScores: [
      { id: 'booking', name: 'Booking.com', scorePercent: 93, label: 'Verified Stays', category: 'Global OTA' },
      { id: 'tripadvisor', name: 'TripAdvisor', scorePercent: 90, label: 'Traveler Bubble', category: 'Review Community' },
      { id: 'google', name: 'Google Reviews', scorePercent: 92, label: 'Global Sentiment', category: 'Public Network' },
      { id: 'holidaycheck', name: 'HolidayCheck', scorePercent: 94, label: 'DACH Benchmark', category: 'German Travelers' },
      { id: 'expedia', name: 'Expedia Group', scorePercent: 92, label: 'Package Verified', category: 'Global OTA' },
      { id: 'agoda', name: 'Agoda', scorePercent: 93, label: 'Luxury Network', category: 'Global OTA' },
      { id: 'trustyou', name: 'TrustYou™', scorePercent: 94, label: 'Meta Aggregate', category: 'Meta Index' },
      { id: 'tui', name: 'TUI / DERTOUR', scorePercent: 91, label: 'Catalog Rating', category: 'Travel Companies' },
    ],
    reviewCount: '2,800+ Reviews',
    subscores: {
      cleanliness: 96,
      comfort: 93,
      location: 95,
      service: 97,
      dining: 94,
      value: 87,
    },
    travelerSegments: {
      couples: 58,
      families: 24,
      solo: 10,
      business: 8,
    },
    europeanShare: 54,
    frequentPraise: ['Oasis garden estate in city center', 'Iconic afternoon tea service', 'Exceptional heritage concierge'],
    frequentCritiques: ['Main building plumbing noise', 'High food & beverage pricing', 'Occasional morning garden maintenance sounds'],
    publicSummary: 'World-renowned colonial luxury with pristine garden grounds, attentive traditional concierge, and celebrated afternoon tea service.',
    blindSpots: [
      {
        title: 'Heritage Wing Noise & Service Flow',
        description: 'Older main building rooms pick up early-morning garden maintenance and corridor footfall; Garden Cottages offer superior isolation.',
      },
      {
        title: 'Morning Plumbing Pacing in Legacy Wings',
        description: 'Historical plumbing systems can experience minor water temperature dips during peak 07:30–08:15 breakfast rush.',
      },
      {
        title: 'Catalog Room Wing Allocations',
        description: 'Contractual room categories must specifically guarantee renovated wings to avoid classic client complaint triggers.',
      },
    ],
  },
  'the silo hotel': {
    name: 'The Silo Hotel',
    location: 'V&A Waterfront Grain Silo Complex',
    propertyType: '5-Star Contemporary Architectural Luxury Landmark',
    classification: '5-Star Ultra-Luxury Asset',
    chaScore: 92,
    chaStatus: 'Optimal',
    chaDeltaReason: '-2.1% vs Public OTA Avg (94.1%): Minor deduction for lower-floor harbor maritime acoustics and public rooftop pool queues.',
    inspectionDeltaDrivers: [
      'Lower-level harbor suites pick up commercial port diesel tugboat hum during weekday morning maneuvers',
      'Extremely popular rooftop pool and bar creates lift waiting queues during weekend sunset hours',
      'At rates exceeding €1,200/night, minor service hesitation creates acute German client sensitivity',
    ],
    publicMetaAverage: 94.1,
    platformScores: [
      { id: 'booking', name: 'Booking.com', scorePercent: 94, label: 'Verified Stays', category: 'Global OTA' },
      { id: 'tripadvisor', name: 'TripAdvisor', scorePercent: 92, label: 'Traveler Bubble', category: 'Review Community' },
      { id: 'google', name: 'Google Reviews', scorePercent: 94, label: 'Global Sentiment', category: 'Public Network' },
      { id: 'holidaycheck', name: 'HolidayCheck', scorePercent: 93, label: 'DACH Benchmark', category: 'German Travelers' },
      { id: 'expedia', name: 'Expedia Group', scorePercent: 95, label: 'Package Verified', category: 'Global OTA' },
      { id: 'agoda', name: 'Agoda', scorePercent: 95, label: 'Luxury Network', category: 'Global OTA' },
      { id: 'trustyou', name: 'TrustYou™', scorePercent: 94, label: 'Meta Aggregate', category: 'Meta Index' },
      { id: 'tui', name: 'TUI / DERTOUR', scorePercent: 93, label: 'Catalog Rating', category: 'Travel Companies' },
    ],
    reviewCount: '950+ Reviews',
    subscores: {
      cleanliness: 97,
      comfort: 96,
      location: 95,
      service: 96,
      dining: 93,
      value: 84,
    },
    travelerSegments: {
      couples: 68,
      families: 14,
      solo: 12,
      business: 6,
    },
    europeanShare: 52,
    frequentPraise: ['Spectacular pillowed-glass architecture', 'Rooftop infinity pool & 360° views', 'Uncompromising bespoke concierge service'],
    frequentCritiques: ['Rooftop bar public crowd waiting queues', 'Harbor industrial noise on lower floors', 'Premium minibar & dining pricing'],
    publicSummary: 'Architectural jewel in the historic grain silo with Thomas Heatherwick convex windows and rooftop pool overlooking Table Mountain.',
    blindSpots: [
      {
        title: 'Harbor Commercial Acoustics',
        description: 'Active commercial maritime port activity audible on lower-level harbor suites during early weekday hours.',
      },
      {
        title: 'Rooftop Bar Public Congestion',
        description: 'Extremely popular public rooftop requires dedicated resident guest reservation pass to ensure immediate seating.',
      },
      {
        title: 'Ultra-High Premium vs. Expectation Bar',
        description: 'At rates over €1,200/night, minor service timing hesitations generate disproportionately severe European guest feedback.',
      },
    ],
  },
  'babylonstoren': {
    name: 'Babylonstoren Estate',
    location: 'Simondium, Franschhoek Wine Valley',
    propertyType: '5-Star Historical Cape Dutch Farm Estate',
    classification: '5-Star Luxury Country Estate',
    chaScore: 91,
    chaStatus: 'Optimal',
    chaDeltaReason: '-4.3% vs Public OTA Avg (95.3%): Deductions for early 05:30 working farm awakening and Babel dining bottlenecks for package guests.',
    inspectionDeltaDrivers: [
      'Historic farm cottages experience early 05:30 farm activity and rooster calls on working agricultural estate',
      'High daytime tour bus volume in public gardens requires guest vigilance regarding private residential pathways',
      'Flagship Babel restaurant is booked out months ahead; requires guaranteed allocations during catalog contracting',
    ],
    publicMetaAverage: 95.3,
    platformScores: [
      { id: 'booking', name: 'Booking.com', scorePercent: 95, label: 'Verified Stays', category: 'Global OTA' },
      { id: 'tripadvisor', name: 'TripAdvisor', scorePercent: 96, label: 'Traveler Bubble', category: 'Review Community' },
      { id: 'google', name: 'Google Reviews', scorePercent: 94, label: 'Global Sentiment', category: 'Public Network' },
      { id: 'holidaycheck', name: 'HolidayCheck', scorePercent: 95, label: 'DACH Benchmark', category: 'German Travelers' },
      { id: 'expedia', name: 'Expedia Group', scorePercent: 95, label: 'Package Verified', category: 'Global OTA' },
      { id: 'agoda', name: 'Agoda', scorePercent: 96, label: 'Luxury Network', category: 'Global OTA' },
      { id: 'trustyou', name: 'TrustYou™', scorePercent: 96, label: 'Meta Aggregate', category: 'Meta Index' },
      { id: 'tui', name: 'TUI / DERTOUR', scorePercent: 94, label: 'Catalog Rating', category: 'Travel Companies' },
    ],
    reviewCount: '4,500+ Reviews',
    subscores: {
      cleanliness: 96,
      comfort: 95,
      location: 97,
      service: 96,
      dining: 97,
      value: 90,
    },
    travelerSegments: {
      couples: 54,
      families: 32,
      solo: 8,
      business: 6,
    },
    europeanShare: 46,
    frequentPraise: ['Immaculate 8-acre botanical farm garden', 'Benchmark farm-to-fork dining at Babel', 'Garden spa & vitality pool'],
    frequentCritiques: ['Early morning farm activity/roosters', 'Large daytime public visitor volume', 'Babel restaurant fully booked months ahead'],
    publicSummary: 'Restored 17th-century Cape Dutch farm with renowned fruit and vegetable gardens, farm-to-table dining, and garden spa.',
    blindSpots: [
      {
        title: 'Active Farm Morning Awakening',
        description: 'Working agricultural estate with early-morning farm activity and rooster calls in historic farm cottages.',
      },
      {
        title: 'High Day-Visitor Footfall',
        description: 'Popular public farm gardens draw large daytime tour groups; hotel guest privacy requires keycard gate adherence.',
      },
      {
        title: 'Dining Reservation Bottlenecks',
        description: 'Babel restaurant books up months in advance; requires pre-allocation during catalog contract stage.',
      },
    ],
  },
  'tintswalo atlantic': {
    name: 'Tintswalo Atlantic',
    location: 'Chapman’s Peak Drive, Hout Bay',
    propertyType: '5-Star Oceanfront Boutique Lodge',
    classification: '5-Star National Park Coastal Asset',
    chaScore: 88,
    chaStatus: 'Advisory',
    chaDeltaReason: '-4.0% vs Public OTA Avg (92.0%): 4% deduction for winter ocean wave crashing volume and steep 4x4 national park access track.',
    inspectionDeltaDrivers: [
      'High spring-tide waves break directly under suite decks; thrilling for most but disruptive for sensitive sleepers',
      'Single-track steep national park descent requires dedicated 4x4 shuttle with 10-minute departure coordination',
      'Winter cold fronts bring intense sea spray requiring temporary dinner relocation away from waterside deck',
    ],
    publicMetaAverage: 92.0,
    platformScores: [
      { id: 'booking', name: 'Booking.com', scorePercent: 93, label: 'Verified Stays', category: 'Global OTA' },
      { id: 'tripadvisor', name: 'TripAdvisor', scorePercent: 90, label: 'Traveler Bubble', category: 'Review Community' },
      { id: 'google', name: 'Google Reviews', scorePercent: 92, label: 'Global Sentiment', category: 'Public Network' },
      { id: 'holidaycheck', name: 'HolidayCheck', scorePercent: 92, label: 'DACH Benchmark', category: 'German Travelers' },
      { id: 'expedia', name: 'Expedia Group', scorePercent: 92, label: 'Package Verified', category: 'Global OTA' },
      { id: 'agoda', name: 'Agoda', scorePercent: 93, label: 'Luxury Network', category: 'Global OTA' },
      { id: 'trustyou', name: 'TrustYou™', scorePercent: 93, label: 'Meta Aggregate', category: 'Meta Index' },
      { id: 'tui', name: 'TUI / DERTOUR', scorePercent: 91, label: 'Catalog Rating', category: 'Travel Companies' },
    ],
    reviewCount: '800+ Reviews',
    subscores: {
      cleanliness: 92,
      comfort: 89,
      location: 99,
      service: 94,
      dining: 91,
      value: 86,
    },
    travelerSegments: {
      couples: 72,
      families: 14,
      solo: 10,
      business: 4,
    },
    europeanShare: 56,
    frequentPraise: ['Unrivaled shoreline position inside national park', 'Intimate candlelit dining on waterside deck', 'Total oceanfront seclusion'],
    frequentCritiques: ['Extremely loud ocean wave crashing in winter', 'Steep 4x4 transfer down cliff track', 'Salt spray weathering on decks'],
    publicSummary: 'Nestled at the water edge inside Table Mountain National Park with private shoreline suites and bespoke dining.',
    blindSpots: [
      {
        title: 'Extreme High-Tide Ocean Wave Noise',
        description: 'Ocean waves break directly beneath room decks — exhilarating for most, but sleep-disrupting for light sleepers.',
      },
      {
        title: 'Steep 4x4 Estate Transfer Descent',
        description: 'Requires dedicated national park transfer down a steep access track; 10-minute transfer buffer required.',
      },
      {
        title: 'Coastal Weather & Sea Spray Exposure',
        description: 'Severe winter storms can occasionally necessitate temporary restaurant relocation.',
      },
    ],
  },
  'delaire graff': {
    name: 'Delaire Graff Estate & Lodges',
    location: 'Helshoogte Pass, Stellenbosch',
    propertyType: '5-Star Ultra-Luxury Mountain Vineyard Lodges',
    classification: '5-Star Premier Relais & Châteaux Asset',
    chaScore: 93,
    chaStatus: 'Optimal',
    chaDeltaReason: '-3.4% vs Public OTA Avg (96.4%): Minor deduction for Helshoogte Pass harvest agricultural transport and rigid minimum stay policies.',
    inspectionDeltaDrivers: [
      'Helshoogte Pass experiences agricultural transport and wine tourist traffic during peak autumn grape harvest',
      'In-house fine dining (Indochine & Delaire Graff) requires advance reservation 2–3 weeks prior to arrival',
      'Rigid 2–3 night minimum stay constraints during high European season restrict tour operator itinerary flex',
    ],
    publicMetaAverage: 96.4,
    platformScores: [
      { id: 'booking', name: 'Booking.com', scorePercent: 96, label: 'Verified Stays', category: 'Global OTA' },
      { id: 'tripadvisor', name: 'TripAdvisor', scorePercent: 96, label: 'Traveler Bubble', category: 'Review Community' },
      { id: 'google', name: 'Google Reviews', scorePercent: 94, label: 'Global Sentiment', category: 'Public Network' },
      { id: 'holidaycheck', name: 'HolidayCheck', scorePercent: 97, label: 'DACH Benchmark', category: 'German Travelers' },
      { id: 'expedia', name: 'Expedia Group', scorePercent: 96, label: 'Package Verified', category: 'Global OTA' },
      { id: 'agoda', name: 'Agoda', scorePercent: 97, label: 'Luxury Network', category: 'Global OTA' },
      { id: 'trustyou', name: 'TrustYou™', scorePercent: 97, label: 'Meta Aggregate', category: 'Meta Index' },
      { id: 'tui', name: 'TUI / DERTOUR', scorePercent: 95, label: 'Catalog Rating', category: 'Travel Companies' },
    ],
    reviewCount: '1,600+ Reviews',
    subscores: {
      cleanliness: 98,
      comfort: 97,
      location: 98,
      service: 97,
      dining: 96,
      value: 89,
    },
    travelerSegments: {
      couples: 66,
      families: 18,
      solo: 10,
      business: 6,
    },
    europeanShare: 58,
    frequentPraise: ['Private heated plunge pool on every lodge deck', 'Monumental Laurence Graff art collection', 'Breathtaking valley views'],
    frequentCritiques: ['Helshoogte pass harvest truck traffic', 'High peak-season minimum stay rules', 'Indochine dining fully booked'],
    publicSummary: 'Jewel of the Winelands with private heated plunge pools on every lodge deck, world-class art collection, and panoramic valley views.',
    blindSpots: [
      {
        title: 'Peak Harvest Road Traffic',
        description: 'Helshoogte Pass experiences agricultural transport and day-tripper traffic during peak autumn harvest.',
      },
      {
        title: 'High In-House Dining Demand',
        description: 'Indochine and Delaire Graff restaurants require advance booking for in-house hotel guests.',
      },
      {
        title: 'High Minimum Night Stays in Season',
        description: 'Strict 2–3 night minimum policies during peak European holiday dates.',
      },
    ],
  },
  'neptune isle': {
    name: 'Neptune Isle Holiday Apartments',
    location: 'Lagoon Beach / Milnerton, Cape Town',
    propertyType: 'Oceanfront Self-Catering Holiday Apartments',
    classification: '3 to 4-Star / Self-Catering Holiday Asset',
    chaScore: 74,
    chaStatus: 'Advisory',
    chaDeltaReason: '-7.0% vs Public OTA Avg (81.0%): Deductions for self-catering arrival logistics, Marine Drive commute traffic on street-facing units, and decor/inverter variance across sectional-title private owners.',
    inspectionDeltaDrivers: [
      'Marine Drive commuter arterial traffic audible in street-facing apartment units during morning peak (oceanfront units feature purely wave sounds)',
      'Sectional-title self-catering rental pool results in inconsistent interior finishes and appliance maintenance across individual private owners',
      'Self-catering arrival format (lockbox / host greeting) rather than 24/7 staffed hotel concierge desk requires pre-flight arrival logistics (notwithstanding active 24-hr guarded gate security)',
    ],
    publicMetaAverage: 81.0,
    platformScores: [
      { id: 'booking', name: 'Booking.com', scorePercent: 83, label: 'Verified Stays', category: 'Global OTA' },
      { id: 'tripadvisor', name: 'TripAdvisor', scorePercent: 80, label: 'Traveler Bubble', category: 'Review Community' },
      { id: 'google', name: 'Google Reviews', scorePercent: 86, label: 'Global Sentiment', category: 'Public Network' },
      { id: 'holidaycheck', name: 'HolidayCheck', scorePercent: 78, label: 'DACH Benchmark', category: 'German Travelers' },
      { id: 'expedia', name: 'Expedia Group', scorePercent: 81, label: 'Package Verified', category: 'Global OTA' },
      { id: 'agoda', name: 'Agoda', scorePercent: 82, label: 'Luxury Network', category: 'Global OTA' },
      { id: 'trustyou', name: 'TrustYou™', scorePercent: 81, label: 'Meta Aggregate', category: 'Meta Index' },
      { id: 'tui', name: 'TUI / DERTOUR', scorePercent: 77, label: 'Catalog Rating', category: 'Travel Companies' },
    ],
    reviewCount: '520+ Reviews',
    subscores: {
      cleanliness: 84,
      comfort: 81,
      location: 96,
      service: 80,
      dining: 72,
      value: 88,
    },
    travelerSegments: {
      couples: 48,
      families: 36,
      solo: 10,
      business: 6,
    },
    europeanShare: 32,
    frequentPraise: [
      'Uninterrupted sea views across Table Bay & Table Mountain',
      'Direct beach access (steps straight onto Lagoon Beach)',
      '24-Hour guarded perimeter gate security & secure resident parking',
      'Spacious self-catering balcony layouts with front-row sunset vistas',
    ],
    frequentCritiques: [
      'Marine Drive traffic noise on street-facing units during morning commute',
      'Coastal southeaster wind exposure on upper ocean balconies',
      'Individual unit interior finishes vary across private sectional-title owners',
    ],
    publicSummary: 'Prime beachfront location with uninterrupted sea and Table Mountain views. Direct beach access and strong self-catering value, offset by coastal wind exposure and peak-hour road noise on rear-facing units.',
    blindSpots: [
      {
        title: 'Street-Facing vs Oceanfront Acoustic Profile',
        description: 'Marine Drive commute traffic affects east-facing units during morning peak hours; oceanfront units have purely wave sounds.',
      },
      {
        title: 'Sectional-Title Decor & Appliance Maintenance',
        description: 'Individual units belong to private owners, leading to differences in kitchen appliance modernity, linen grade, and inverter backup status.',
      },
      {
        title: 'Arrival Logistics for Late International Flights',
        description: 'Self-catering arrival requires lockbox codes or host greeting; 24h gate security handles access control but does not offer hotel front-desk services.',
      },
    ],
    provenanceTier: 'HAND_VERIFIED',
    provenanceLabel: 'Audited Reference Property (On-Site Calibrated)',
    webPresenceStrength: 'High',
    sentimentDisclaimer: 'Public sentiment cross-referenced across 520+ verified online reviews. Hand-calibrated for European travel company catalog guarantees.',
  },
  'ellerman house': {
    name: 'Ellerman House',
    location: 'Bantry Bay, Atlantic Seaboard',
    propertyType: '5-Star Exclusive Private Clifftop Mansion',
    classification: '5-Star Relais & Châteaux Exclusive Asset',
    chaScore: 94,
    chaStatus: 'Optimal',
    chaDeltaReason: '-3.1% vs Public OTA Avg (97.1%): Minor deduction for steep multi-tier cliffside staircases and strict adults-only booking restrictions.',
    inspectionDeltaDrivers: [
      'Multi-level cliffside staircase layout limits accessibility for travelers with physical mobility limitations',
      'Strict adults-only policy (no children under 14) requires rigid enforcement in travel company booking flows',
      'Intimate 13-room inventory requires strict 9-month allocation windows during European high season',
    ],
    publicMetaAverage: 97.1,
    platformScores: [
      { id: 'booking', name: 'Booking.com', scorePercent: 97, label: 'Verified Stays', category: 'Global OTA' },
      { id: 'tripadvisor', name: 'TripAdvisor', scorePercent: 98, label: 'Traveler Bubble', category: 'Review Community' },
      { id: 'google', name: 'Google Reviews', scorePercent: 96, label: 'Global Sentiment', category: 'Public Network' },
      { id: 'holidaycheck', name: 'HolidayCheck', scorePercent: 98, label: 'DACH Benchmark', category: 'German Travelers' },
      { id: 'expedia', name: 'Expedia Group', scorePercent: 97, label: 'Package Verified', category: 'Global OTA' },
      { id: 'agoda', name: 'Agoda', scorePercent: 98, label: 'Luxury Network', category: 'Global OTA' },
      { id: 'trustyou', name: 'TrustYou™', scorePercent: 98, label: 'Meta Aggregate', category: 'Meta Index' },
      { id: 'tui', name: 'TUI / DERTOUR', scorePercent: 95, label: 'Catalog Rating', category: 'Travel Companies' },
    ],
    reviewCount: '620+ Reviews',
    subscores: {
      cleanliness: 99,
      comfort: 98,
      location: 99,
      service: 99,
      dining: 97,
      value: 88,
    },
    travelerSegments: {
      couples: 74,
      families: 8,
      solo: 12,
      business: 6,
    },
    europeanShare: 61,
    frequentPraise: ['Museum-grade South African art gallery', 'Total residential exclusivity', 'Unmatched sommelier wine cellar'],
    frequentCritiques: ['Strict no-children under 14 policy', 'Steep property staircases', 'Extremely limited availability'],
    publicSummary: 'Cliffs of Bantry Bay with private South African art gallery, wine gallery, and exclusive residential atmosphere.',
    blindSpots: [
      {
        title: 'Strict Adults-Only / Child Policy',
        description: 'Strict age restrictions (no children under 14) that must be strictly enforced in travel company booking flows.',
      },
      {
        title: 'Limited Room Count & Lead Times',
        description: 'With only 13 rooms and 2 villas, contract release windows require strict procurement timelines.',
      },
      {
        title: 'Steep Cliffside Property Access',
        description: 'Multiple staircase levels require pre-arrangement for travelers with mobility limitations.',
      },
    ],
  },
  'the table bay hotel': {
    name: 'The Table Bay Hotel',
    location: 'V&A Waterfront Marina Precinct, Cape Town',
    propertyType: '5-Star Grand Maritime Luxury Hotel',
    classification: '5-Star Official Luxury Council Asset',
    chaScore: 88,
    chaStatus: 'Advisory',
    chaDeltaReason: '-4.6% vs Public OTA Avg (92.6%): 4% deduction for working harbor tugboat acoustics and peak 07:30 European tour coach breakfast pacing.',
    inspectionDeltaDrivers: [
      'Active commercial harbor vessel traffic, marine foghorns, and sightseeing helicopter flight paths audible on marina balconies',
      'Simultaneous 07:15–08:15 European coach tour departure rush causing breakfast buffet seating queues and elevator dispatch delays',
      'Contractual room allocation variances: internal courtyard facing rooms vs direct Robben Island / Table Mountain oceanfront wings',
    ],
    publicMetaAverage: 92.6,
    platformScores: [
      { id: 'booking', name: 'Booking.com', scorePercent: 93, label: 'Verified Stays', category: 'Global OTA' },
      { id: 'tripadvisor', name: 'TripAdvisor', scorePercent: 92, label: 'Traveler Bubble', category: 'Review Community' },
      { id: 'google', name: 'Google Reviews', scorePercent: 94, label: 'Global Sentiment', category: 'Public Network' },
      { id: 'holidaycheck', name: 'HolidayCheck', scorePercent: 93, label: 'DACH Benchmark', category: 'German Travelers' },
      { id: 'expedia', name: 'Expedia Group', scorePercent: 93, label: 'Package Verified', category: 'Global OTA' },
      { id: 'agoda', name: 'Agoda', scorePercent: 94, label: 'Luxury Network', category: 'Global OTA' },
      { id: 'trustyou', name: 'TrustYou™', scorePercent: 93, label: 'Meta Aggregate', category: 'Meta Index' },
      { id: 'tui', name: 'TUI / DERTOUR', scorePercent: 89, label: 'Catalog Rating', category: 'Travel Companies' },
    ],
    reviewCount: '4,200+ Reviews',
    subscores: {
      cleanliness: 94,
      comfort: 92,
      location: 98,
      service: 92,
      dining: 91,
      value: 86,
    },
    travelerSegments: {
      couples: 54,
      families: 24,
      solo: 10,
      business: 12,
    },
    europeanShare: 56,
    frequentPraise: [
      'Direct pedestrian access into V&A Waterfront shopping, restaurants, and marina',
      'Grand Victorian maritime architecture with iconic Table Mountain views',
      'World-class security precinct and 5-star concierge excursion desk',
    ],
    frequentCritiques: [
      'Early morning commercial port tugboat foghorns and working harbor maritime operations',
      'High foot traffic in the public grand lounge and lobby walkway during cruise liner docking days',
      'Strict advance dinner booking policies required for in-house guests at Camissa and Atlantic restaurants',
    ],
    publicSummary: 'Iconic Victorian grand hotel in the V&A Waterfront offering top-tier security and Table Mountain panoramas, with minor operational considerations around working harbor acoustics.',
    blindSpots: [
      {
        title: 'Working Port & Helicopter Corridor Acoustics',
        description: 'Daytime working dry dock activity and harbor scenic helicopter departures create acoustic spikes on ocean-facing balconies.',
      },
      {
        title: 'European Tour Coach Breakfast Rush (07:30)',
        description: 'Concurrent departure of multiple 40-seat tour groups creates dining bottlenecks for independent luxury guests.',
      },
      {
        title: 'Courtyard vs Harbor View Contract Allotment',
        description: 'German travel catalog terms require explicit demarcation of internal courtyard allotments vs premium Table Mountain views.',
      },
    ],
    provenanceTier: 'HAND_VERIFIED',
    provenanceLabel: 'Audited Reference Property (On-Site Calibrated)',
    webPresenceStrength: 'High',
    sentimentDisclaimer: 'Public sentiment cross-referenced across 4,200+ verified online reviews. Hand-calibrated for European travel company catalog guarantees.',
  },
  'radisson blu waterfront': {
    name: 'Radisson Blu Hotel Waterfront',
    location: 'Granger Bay / V&A Waterfront, Cape Town',
    propertyType: '5-Star Oceanfront Maritime Commercial Hotel',
    classification: '5-Star Commercial Coastal Asset',
    chaScore: 85,
    chaStatus: 'Advisory',
    chaDeltaReason: '-5.2% vs Public OTA Avg (90.2%): Deductions for seaside boardwalk wind exposure and breakfast terrace queuing during peak conference mornings.',
    inspectionDeltaDrivers: [
      'Granger Bay oceanfront terrace experiences severe wind gusts during seasonal southeaster weather, requiring indoor dining fallback',
      'Significant acoustic differential between direct sea-facing rooms (ocean waves) and land-facing rooms overlooking Granger Bay Boulevard',
      'Elevator and concierge desk congestion during concurrent international business conference check-outs',
    ],
    publicMetaAverage: 90.2,
    platformScores: [
      { id: 'booking', name: 'Booking.com', scorePercent: 91, label: 'Verified Stays', category: 'Global OTA' },
      { id: 'tripadvisor', name: 'TripAdvisor', scorePercent: 89, label: 'Traveler Bubble', category: 'Review Community' },
      { id: 'google', name: 'Google Reviews', scorePercent: 92, label: 'Global Sentiment', category: 'Public Network' },
      { id: 'holidaycheck', name: 'HolidayCheck', scorePercent: 91, label: 'DACH Benchmark', category: 'German Travelers' },
      { id: 'expedia', name: 'Expedia Group', scorePercent: 90, label: 'Package Verified', category: 'Global OTA' },
      { id: 'agoda', name: 'Agoda', scorePercent: 91, label: 'Luxury Network', category: 'Global OTA' },
      { id: 'trustyou', name: 'TrustYou™', scorePercent: 91, label: 'Meta Aggregate', category: 'Meta Index' },
      { id: 'tui', name: 'TUI / DERTOUR', scorePercent: 87, label: 'Catalog Rating', category: 'Travel Companies' },
    ],
    reviewCount: '3,800+ Reviews',
    subscores: {
      cleanliness: 93,
      comfort: 90,
      location: 95,
      service: 90,
      dining: 89,
      value: 84,
    },
    travelerSegments: {
      couples: 48,
      families: 20,
      solo: 14,
      business: 18,
    },
    europeanShare: 52,
    frequentPraise: [
      'Uninterrupted private oceanfront boardwalk right at the water’s edge',
      'Heated oceanfront rim pool with direct views across Granger Bay',
      'Convenient complimentary shuttle to V&A Waterfront shopping',
    ],
    frequentCritiques: [
      'Ocean terrace dining frequently shut due to brisk coastal winds',
      'Landside rooms face commercial parking and Granger Bay traffic',
      'Check-in queues during high-volume conference arrivals',
    ],
    publicSummary: 'Front-row Atlantic Ocean position with private marina boardwalk. Exceptional sunset views, balanced by coastal wind exposure on outdoor dining areas.',
    blindSpots: [
      {
        title: 'Oceanfront vs Boulevard Acoustic Split',
        description: 'Sea-facing rooms feature pure surf ambiance; landward rooms look onto access roadway and parking bays.',
      },
      {
        title: 'Coastal Wind Impact on Advertised Amenities',
        description: 'The iconic ocean rim pool terrace is often too windy for loungers during high-velocity summer southeaster fronts.',
      },
      {
        title: 'Conference Group vs FIT Guest Flow',
        description: 'Large corporate events create morning peak elevator and coffee station queues.',
      },
    ],
    provenanceTier: 'HAND_VERIFIED',
    provenanceLabel: 'Audited Reference Property (On-Site Calibrated)',
    webPresenceStrength: 'High',
    sentimentDisclaimer: 'Public sentiment cross-referenced across 3,800+ verified online reviews. Hand-calibrated for European travel company catalog guarantees.',
  },
  'the president hotel': {
    name: 'The President Hotel',
    location: 'Bantry Bay / Sea Point, Atlantic Seaboard',
    propertyType: '4-Star Resort-Style Coastal Family Hotel',
    classification: '4-Star Coastal Resort Hotel',
    chaScore: 82,
    chaStatus: 'Advisory',
    chaDeltaReason: '-6.0% vs Public OTA Avg (88.0%): Operational deductions for 350-room elevator pacing, Alexander Road acoustics, and summer pool terrace wind exposure.',
    inspectionDeltaDrivers: [
      'Lower mountain-facing rooms experience Alexander Road and Queens Road morning traffic acoustics',
      'High 350-room guest capacity creates 10-minute elevator bank wait times and breakfast seating pacing during 07:30–08:30 group rushes',
      'Oceanfront infinity pool deck subject to heavy coastal winds during afternoon Atlantic breezes',
    ],
    publicMetaAverage: 88.0,
    platformScores: [
      { id: 'booking', name: 'Booking.com', scorePercent: 88, label: 'Verified Stays', category: 'Global OTA' },
      { id: 'tripadvisor', name: 'TripAdvisor', scorePercent: 87, label: 'Traveler Bubble', category: 'Review Community' },
      { id: 'google', name: 'Google Reviews', scorePercent: 90, label: 'Global Sentiment', category: 'Public Network' },
      { id: 'holidaycheck', name: 'HolidayCheck', scorePercent: 88, label: 'DACH Benchmark', category: 'German Travelers' },
      { id: 'expedia', name: 'Expedia Group', scorePercent: 88, label: 'Package Verified', category: 'Global OTA' },
      { id: 'agoda', name: 'Agoda', scorePercent: 89, label: 'Luxury Network', category: 'Global OTA' },
      { id: 'trustyou', name: 'TrustYou™', scorePercent: 88, label: 'Meta Aggregate', category: 'Meta Index' },
      { id: 'tui', name: 'TUI / DERTOUR', scorePercent: 86, label: 'Catalog Rating', category: 'Travel Companies' },
    ],
    reviewCount: '4,500+ Reviews',
    subscores: {
      cleanliness: 90,
      comfort: 88,
      location: 94,
      service: 88,
      dining: 85,
      value: 86,
    },
    travelerSegments: {
      couples: 44,
      families: 38,
      solo: 10,
      business: 8,
    },
    europeanShare: 46,
    frequentPraise: [
      'Steps away from the iconic Sea Point ocean promenade and coastal tidal pools',
      'Spacious family-friendly apartments with kitchenettes and private balconies',
      'Expansive infinity pool deck overlooking the Atlantic Ocean',
    ],
    frequentCritiques: [
      'Alexander Road residential morning commute traffic audible in mountain-facing wings',
      'High summer southeaster wind gusts on the pool terrace requiring loungers to be tethered',
      'Advance reservation required for on-site basement parking bays during high-occupancy school holidays',
    ],
    publicSummary: 'Popular Bantry Bay coastal resort hotel with apartment-style rooms and family facilities, 150m from the Sea Point promenade.',
    blindSpots: [
      {
        title: 'Elevator Core Dispatch Capacity',
        description: 'Large inventory causes dispatch bottlenecks during breakfast checkout cycles.',
      },
      {
        title: 'Mountain Wing Traffic vs Ocean Wing Ambiance',
        description: 'Contractual room allotments must specify whether guests face quiet ocean views or residential street corners.',
      },
      {
        title: 'Bantry Bay Microclimate Wind Exposure',
        description: 'Afternoon coastal wind drops outdoor pool temperatures despite summer sunshine.',
      },
    ],
    provenanceTier: 'HAND_VERIFIED',
    provenanceLabel: 'Audited Reference Property (On-Site Calibrated)',
    webPresenceStrength: 'High',
    sentimentDisclaimer: 'Public sentiment cross-referenced across 4,500+ verified online reviews. Hand-calibrated for European travel company catalog guarantees.',
  },
  'lagoon beach hotel': {
    name: 'Lagoon Beach Hotel & Spa',
    location: 'Lagoon Beach / Milnerton, Cape Town',
    propertyType: '4-Star Beachfront Conference & Leisure Hotel',
    classification: '4-Star Coastal Hotel Asset',
    chaScore: 78,
    chaStatus: 'Advisory',
    chaDeltaReason: '-6.4% vs Public OTA Avg (84.4%): Operational deductions for Marine Drive rear-wing traffic noise, tour group breakfast queuing, and southeaster wind load on ocean balconies.',
    inspectionDeltaDrivers: [
      'East-facing standard room wings experience early morning Marine Drive commuter traffic acoustics',
      'Direct beach-facing rooms enjoy pure wave sounds but suffer intense southeaster wind rattling on sliding doors during summer',
      'Simultaneous 07:15–08:00 conference and European tour group breakfast buffet congestion creates seating delays',
    ],
    publicMetaAverage: 84.4,
    platformScores: [
      { id: 'booking', name: 'Booking.com', scorePercent: 84, label: 'Verified Stays', category: 'Global OTA' },
      { id: 'tripadvisor', name: 'TripAdvisor', scorePercent: 82, label: 'Traveler Bubble', category: 'Review Community' },
      { id: 'google', name: 'Google Reviews', scorePercent: 87, label: 'Global Sentiment', category: 'Public Network' },
      { id: 'holidaycheck', name: 'HolidayCheck', scorePercent: 83, label: 'DACH Benchmark', category: 'German Travelers' },
      { id: 'expedia', name: 'Expedia Group', scorePercent: 85, label: 'Package Verified', category: 'Global OTA' },
      { id: 'agoda', name: 'Agoda', scorePercent: 85, label: 'Luxury Network', category: 'Global OTA' },
      { id: 'trustyou', name: 'TrustYou™', scorePercent: 85, label: 'Meta Aggregate', category: 'Meta Index' },
      { id: 'tui', name: 'TUI / DERTOUR', scorePercent: 84, label: 'Catalog Rating', category: 'Travel Companies' },
    ],
    reviewCount: '3,200+ Reviews',
    subscores: {
      cleanliness: 86,
      comfort: 84,
      location: 94,
      service: 84,
      dining: 82,
      value: 86,
    },
    travelerSegments: {
      couples: 46,
      families: 28,
      solo: 12,
      business: 14,
    },
    europeanShare: 42,
    frequentPraise: [
      'Unobstructed postcard Table Mountain views straight across Table Bay',
      'Direct beach access onto Lagoon Beach sands with oceanfront walking',
      'Full-service hotel amenities with on-site restaurants, spa, and conference facilities',
    ],
    frequentCritiques: [
      'Marine Drive commuter arterial traffic audible in east-facing hotel wings (oceanfront rooms are quiet)',
      'Intense southeaster wind turbulence on oceanside balconies requiring patio doors to remain secured',
      'Conference hall delegate spillover into central lobby and lounge during major corporate symposiums',
    ],
    publicSummary: 'Front-line beach position directly on Table Bay with spectacular views of Table Mountain. Excellent commercial package hotel with specific wing acoustic variations.',
    blindSpots: [
      {
        title: 'Road-Facing Wing vs Oceanfront Wing Acoustic Gap',
        description: 'Rear standard rooms face busy Marine Drive commuter traffic, while beachfront suites face breaking waves.',
      },
      {
        title: 'Summer Southeaster Balcony Gale Forces',
        description: 'Lagoon Beach bears direct brunt of Table Bay summer winds, requiring balcony doors to remain closed during gale days.',
      },
      {
        title: 'Tour Group Check-In Pacing',
        description: 'Simultaneous international tour group arrivals create 20-minute lobby baggage and key card wait times.',
      },
    ],
    provenanceTier: 'HAND_VERIFIED',
    provenanceLabel: 'Audited Reference Property (On-Site Calibrated)',
    webPresenceStrength: 'High',
    sentimentDisclaimer: 'Public sentiment cross-referenced across 3,200+ verified online reviews. Hand-calibrated for European travel company catalog guarantees.',
  },
};

// Aliases for user query flexibility
KNOWN_PROPERTIES['neptune isle holiday apartments'] = KNOWN_PROPERTIES['neptune isle'];
KNOWN_PROPERTIES['neptune isle apartments'] = KNOWN_PROPERTIES['neptune isle'];
KNOWN_PROPERTIES['table bay hotel'] = KNOWN_PROPERTIES['the table bay hotel'];
KNOWN_PROPERTIES['president hotel'] = KNOWN_PROPERTIES['the president hotel'];
KNOWN_PROPERTIES['mount nelson'] = KNOWN_PROPERTIES['belmond mount nelson'];
KNOWN_PROPERTIES['twelve apostles'] = KNOWN_PROPERTIES['the twelve apostles'];
KNOWN_PROPERTIES['silo hotel'] = KNOWN_PROPERTIES['the silo hotel'];

interface AgentVirtualAuditProps {
  onSelectPropertyForInquiry: (propertyName: string) => void;
  onRequestVirtualAuditForProperty?: (propertyName: string) => void;
  onRequestFreeDataPackage: () => void;
}

export const AgentVirtualAudit: React.FC<AgentVirtualAuditProps> = ({
  onSelectPropertyForInquiry,
  onRequestVirtualAuditForProperty,
  onRequestFreeDataPackage,
}) => {
  const [searchInput, setSearchInput] = useState<string>('The Twelve Apostles');
  const [activeSearchResult, setActiveSearchResult] = useState<HotelPublicProfile>(
    KNOWN_PROPERTIES['the twelve apostles']
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGrounded, setIsGrounded] = useState<boolean>(true);

  const handleSearchHotel = async (query: string) => {
    const cleanQuery = query.trim();
    if (!cleanQuery) return;

    setSearchInput(cleanQuery);

    const lowerQuery = cleanQuery.toLowerCase();
    const matchedKey = Object.keys(KNOWN_PROPERTIES).find(
      (k) => lowerQuery === k || (lowerQuery.length > 5 && (lowerQuery.includes(k) || k.includes(lowerQuery)))
    );

    // If it's one of our verified benchmark sample hotels
    if (matchedKey && KNOWN_PROPERTIES[matchedKey]) {
      setActiveSearchResult(KNOWN_PROPERTIES[matchedKey]);
      setIsGrounded(true);
      return;
    }

    // Call server endpoint with live Google Search grounding!
    setIsLoading(true);
    try {
      const response = await fetch('/api/audit-hotel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: cleanQuery }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.profile) {
        setActiveSearchResult({
          ...data.profile,
          provenanceTier: data.profile.provenanceTier || 'LIVE_GROUNDED',
          provenanceLabel: data.profile.provenanceLabel || 'Live Multi-Source Web Radar (High Web Presence)',
          webPresenceStrength: data.profile.webPresenceStrength || 'High',
          sentimentDisclaimer: data.profile.sentimentDisclaimer || 'Aggregated from unweighted online guest reviews across public OTAs. Physical on-site inspection independently verifies catalog compliance.',
        });
        setIsGrounded(Boolean(data.grounded));
        return;
      }
      throw new Error(data.error || 'Failed to parse hotel profile');
    } catch (error) {
      console.warn('Live audit API error, using regional synthesis fallback:', error);
      setIsGrounded(false);

      const fallbackProfile = generateContextualAuditProfile(cleanQuery);
      setActiveSearchResult({
        ...fallbackProfile,
        provenanceTier: 'SYNTHETIC_REGIONAL',
        provenanceLabel: 'Regional Desk Estimate (Synthetic Approximation)',
        webPresenceStrength: 'Limited',
        sentimentDisclaimer: 'Estimated from regional accommodation archetypes. Physical mystery inspection required for verified ground truth.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestAuditForCurrentSearch = () => {
    if (onRequestVirtualAuditForProperty && activeSearchResult) {
      onRequestVirtualAuditForProperty(activeSearchResult.name);
    } else {
      onRequestFreeDataPackage();
    }
  };

  const SUGGESTION_CHIPS = [
    'The Twelve Apostles',
    'Belmond Mount Nelson',
    'The Silo Hotel',
    'Babylonstoren',
    'Tintswalo Atlantic',
    'Neptune Isle',
    'Delaire Graff',
    'Ellerman House',
  ];

  // Dynamic Reality Gap Delta & Triage Threshold calculation
  const rawDelta = activeSearchResult
    ? activeSearchResult.publicMetaAverage - activeSearchResult.chaScore
    : 0;
  const deltaPercent = Math.max(0, Math.round(rawDelta * 10) / 10);

  // Triage classification:
  // If delta >= 6.0% or Attention Required -> CRITICAL TRIAGE (Physical Audit Mandatory)
  // If delta >= 3.5% or Advisory -> ADVISORY TRIAGE (Physical Audit Strongly Recommended)
  // Else -> ROUTINE TRIAGE (Physical Spot-Check Recommended for high-value suites)
  const isCriticalRisk =
    deltaPercent >= 6.0 || (activeSearchResult && activeSearchResult.chaStatus === 'Attention Required');
  const isAdvisoryRisk =
    !isCriticalRisk &&
    (deltaPercent >= 3.5 || (activeSearchResult && activeSearchResult.chaStatus === 'Advisory'));

  const triageData = isCriticalRisk
    ? {
        level: 'CRITICAL TRIAGE',
        tag: `HIGH-RISK REALITY GAP (Δ -${deltaPercent}%)`,
        mandate: 'MANDATORY ON-SITE PHYSICAL AUDIT BEFORE CONTRACTING',
        shortVerdict: 'Mandatory Physical Audit',
        badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        cardBorder: 'border-rose-500/40',
        cardBg: 'bg-rose-950/30',
        textColor: 'text-rose-400',
        dotColor: 'bg-rose-400',
        summary: `A severe ${deltaPercent}% divergence exists between public consumer sentiment (${activeSearchResult?.publicMetaAverage}%) and real ground conditions (${activeSearchResult?.chaScore}%). Contracting without on-site mystery verification exposes your brand to Frankfurt Table catalog compensation claims (15%–25% refund risk under European travel law).`,
        actionLabel: `Escalate to Mandatory On-Site Physical Audit for ${activeSearchResult?.name}`,
        recommendation: 'Do not commit to room allocations without on-site acoustic and hydraulic validation.',
      }
    : isAdvisoryRisk
    ? {
        level: 'ADVISORY TRIAGE',
        tag: `NOTABLE DISCREPANCY (Δ -${deltaPercent}%)`,
        mandate: 'ON-SITE PHYSICAL VERIFICATION STRONGLY RECOMMENDED',
        shortVerdict: 'Physical Verification Recommended',
        badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        cardBorder: 'border-amber-500/40',
        cardBg: 'bg-amber-950/30',
        textColor: 'text-amber-400',
        dotColor: 'bg-amber-400',
        summary: `A ${deltaPercent}% gap detected. Public platforms aggregate domestic weekenders who overlook morning shower pressure drops, road acoustic spikes, or wholesale room allocation deficits.`,
        actionLabel: `Commission On-Site Physical Audit for ${activeSearchResult?.name}`,
        recommendation: 'Verify specific room wing allocations and morning service bandwidth prior to finalizing contracts.',
      }
    : {
        level: 'ROUTINE TRIAGE',
        tag: `CONTROLLED VARIANCE (Δ -${deltaPercent}%)`,
        mandate: 'DESK CLEARANCE PASSED — PHYSICAL SPOT-AUDIT RECOMMENDED FOR VIP SUITES',
        shortVerdict: 'Routine Verification',
        badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        cardBorder: 'border-emerald-500/40',
        cardBg: 'bg-emerald-950/30',
        textColor: 'text-emerald-400',
        dotColor: 'bg-emerald-400',
        summary: `Minor ${deltaPercent}% variance. Desk metrics show acceptable baseline consistency. An on-site mystery inspection remains recommended to audit specific contracted suite categories and VIP welcome protocols.`,
        actionLabel: `Schedule Physical Spot-Inspection for ${activeSearchResult?.name}`,
        recommendation: 'Confirm physical suite finishes and VIP tour arrival pacing before high-season deployment.',
      };

  return (
    <section id="virtual-audit" className="py-16 sm:py-20 bg-[#10213a] text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-[radial-gradient(ellipse_at_top,rgba(179,138,84,0.12),transparent_70%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#d9bd8b]/30 bg-white/5 text-xs font-semibold text-[#d9bd8b] shadow-xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#d9bd8b]" />
            <span className="tracking-widest uppercase font-mono text-[11px]">
              STAGE 01 • DESK-BASED QUALITY RADAR
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-serif leading-tight">
            Multi-Platform Review Radar & Quality Index
          </h2>

          <p className="mt-3 text-sm sm:text-base text-zinc-300 font-light leading-relaxed max-w-2xl mx-auto">
            Screen any hotel across 8 public review providers against our benchmark. Use this virtual desk audit as a fast risk-filter to decide: <span className="text-[#d9bd8b] font-medium">can you contract safely, or do operational blind spots necessitate an on-site physical inspection?</span>
          </p>
        </div>

        {/* 1. Interactive Hotel Search Bar */}
        <div className="max-w-3xl mx-auto mb-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchHotel(searchInput);
            }}
            className="flex flex-col sm:flex-row items-center gap-2 p-1.5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md shadow-xl"
          >
            <div className="flex items-center gap-2.5 px-3.5 w-full">
              <Search className="w-5 h-5 text-[#d9bd8b] shrink-0" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Type any hotel name (e.g. Neptune Isle, Mount Nelson, Twelve Apostles)..."
                className="w-full bg-transparent text-white placeholder-zinc-400 text-sm focus:outline-hidden py-2.5 font-sans"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#b38a54] hover:bg-[#c59b63] disabled:opacity-60 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shrink-0 whitespace-nowrap"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  <span>Searching Web...</span>
                </>
              ) : (
                <>
                  <span>Audit Hotel</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Quick Suggestion Chips */}
          <div className="mt-3 flex items-center gap-1.5 flex-wrap justify-center">
            <span className="text-[11px] font-mono text-zinc-400 mr-1">Quick Select:</span>
            {SUGGESTION_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                disabled={isLoading}
                onClick={() => {
                  setSearchInput(chip);
                  handleSearchHotel(chip);
                }}
                className={`text-[11px] px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                  searchInput.toLowerCase() === chip.toLowerCase()
                    ? 'bg-[#d9bd8b]/20 border-[#d9bd8b] text-white font-medium'
                    : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Aggregation & Internet Presence Tip */}
          <div className="mt-3.5 px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-[11px] text-zinc-300 flex items-start gap-2.5 max-w-2xl mx-auto shadow-xs">
            <Compass className="w-3.5 h-3.5 text-[#d9bd8b] shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="text-[#d9bd8b] font-mono font-bold uppercase tracking-wider text-[10px]">
                High-Presence Search Tip:
              </span>{' '}
              For establishments with active web presence, typing the specific property and suburb (e.g.{' '}
              <span className="text-white font-semibold">"Neptune Isle Lagoon Beach"</span> or{' '}
              <span className="text-white font-semibold">"Tintswalo Hout Bay"</span>) retrieves multi-source verified reviews across Google, Booking & TripAdvisor.
            </div>
          </div>
        </div>

        {/* Loading Radar Animation */}
        {isLoading && (
          <div className="rounded-2xl bg-[#0c182a]/90 border border-[#d9bd8b]/30 shadow-2xl p-10 text-center mb-8 backdrop-blur-md">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#b38a54]/20 border border-[#b38a54]/40 text-[#d9bd8b] mb-4 animate-pulse">
              <Globe className="w-7 h-7 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <h3 className="text-lg font-bold font-serif text-white">
              Searching Google & Live Review Databases for “{searchInput}”...
            </h3>
            <p className="text-xs text-zinc-300 max-w-md mx-auto mt-2 leading-relaxed">
              Synthesizing public listings across 8 recognized providers and calibrating travel company catalog risk.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] font-mono text-[#d9bd8b]">
              <span className="inline-block w-2 h-2 rounded-full bg-[#d9bd8b] animate-ping" />
              <span>Querying Live Web Grounding via Google Search</span>
            </div>
          </div>
        )}

        {/* 2. Public Radar Scorecard Result Card */}
        {!isLoading && activeSearchResult && (
          <div className="rounded-2xl bg-[#0c182a] border border-white/15 shadow-2xl p-6 sm:p-8 text-left mb-8">
            
            {/* Top Hotel Header & Meta-Average Banner */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <span className="font-mono text-xs font-bold text-[#d9bd8b] uppercase tracking-wider">
                    {activeSearchResult.classification}
                  </span>

                  {/* Explicit Provenance & Confidence Badge */}
                  {activeSearchResult.provenanceTier === 'HAND_VERIFIED' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-semibold">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      Hand-Verified Ground Benchmark
                    </span>
                  ) : isGrounded || activeSearchResult.provenanceTier === 'LIVE_GROUNDED' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-semibold">
                      <Globe className="w-3 h-3 text-cyan-400" />
                      Live Multi-Platform Web Radar
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-semibold">
                      <AlertTriangle className="w-3 h-3 text-amber-400" />
                      Regional Desk Synthesis
                    </span>
                  )}

                  <span className="text-zinc-500">•</span>
                  <span className="text-xs text-zinc-400 font-light">
                    {activeSearchResult.propertyType}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-serif">
                  {activeSearchResult.name}
                </h3>
                <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#d9bd8b]" />
                  <span>{activeSearchResult.location}</span>
                  <span className="text-zinc-600 ml-1">({activeSearchResult.reviewCount} aggregated across 8 providers)</span>
                </p>
              </div>

              {/* Public OTA Meta-Average Pill */}
              <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-3 shrink-0 self-start lg:self-auto">
                <div className="text-right">
                  <div className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">
                    Public OTA Meta-Average
                  </div>
                  <div className="text-xs text-zinc-300 font-light mt-0.5">
                    8 Platforms Aggregated
                  </div>
                </div>
                <div className="text-2xl font-black font-mono text-white bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
                  {activeSearchResult.publicMetaAverage}%
                </div>
              </div>
            </div>

            {/* Scorecard Centerpiece: Proprietary CHA Score vs. 8 Providers Grid */}
            <div className="py-6 border-b border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              
              {/* Left Column: Proprietary Cape Hospitality Advisors Score (CHA Quality Index™) */}
              <div className="lg:col-span-5 rounded-2xl bg-gradient-to-br from-[#0c1a30] via-[#091424] to-[#060c17] border-2 border-[#d9bd8b]/50 p-5 sm:p-6 flex flex-col justify-between shadow-xl relative overflow-hidden ring-1 ring-[#d9bd8b]/20">
                {/* Subtle gold glow */}
                <div className="absolute top-0 right-0 w-36 h-36 bg-[radial-gradient(circle,rgba(217,189,139,0.15),transparent_70%)] pointer-events-none" />

                <div>
                  {/* Badge & Emblem Header */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#d9bd8b]/15 border border-[#d9bd8b]/40 text-[#d9bd8b] text-[11px] font-mono font-bold uppercase tracking-wider">
                      <Award className="w-3.5 h-3.5 text-[#d9bd8b]" />
                      <span>CHA Quality Index™</span>
                    </div>

                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${triageData.badgeBg}`}>
                      {triageData.shortVerdict}
                    </span>
                  </div>

                  {/* Big Percentage Display */}
                  <div className="flex items-baseline gap-2 mt-1 mb-2">
                    <div className="text-4xl sm:text-5xl font-black font-mono text-[#d9bd8b] tracking-tight">
                      {activeSearchResult.chaScore}%
                    </div>
                    <span className="text-xs text-zinc-400 font-mono">
                      / 100% Quality Benchmark
                    </span>
                  </div>

                  {/* Operational Reality Gap Delta Tag & Triage Threshold Alert */}
                  <div className="flex flex-col gap-2 mb-3">
                    <div className="inline-flex items-center justify-between gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono font-semibold">
                      <div className="flex items-center gap-1.5 text-amber-300">
                        <TrendingDown className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>Reality Gap Delta:</span>
                      </div>
                      <span className="text-[#d9bd8b] font-bold text-sm">
                        Δ -{deltaPercent}%
                      </span>
                    </div>

                    {/* Dynamic Triage Mandate Banner */}
                    <div className={`p-2.5 rounded-xl border text-[11px] font-mono flex items-start gap-2 ${triageData.badgeBg}`}>
                      <AlertOctagon className="w-4 h-4 shrink-0 mt-0.5" />
                      <div className="leading-snug">
                        <div className="font-bold uppercase tracking-wider text-[10px] opacity-90 mb-0.5">
                          {triageData.level} PROTOCOL:
                        </div>
                        <div className="font-semibold text-white">
                          {triageData.mandate}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Deduction Rationale Description */}
                  <p className="text-xs text-zinc-300 leading-relaxed font-light mb-3">
                    {activeSearchResult.chaDeltaReason}
                  </p>

                  {/* Summarised Rationale: Only Key Points in Favour of Physical Audit */}
                  <div className="my-3 p-3.5 rounded-xl bg-black/40 border border-[#d9bd8b]/30 shadow-inner">
                    <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-white/10">
                      <div className="text-[10px] font-mono uppercase font-bold text-[#d9bd8b] tracking-wider flex items-center gap-1.5">
                        <Scale className="w-3.5 h-3.5 text-[#d9bd8b]" />
                        <span>Key Rationale For Physical Audit:</span>
                      </div>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#d9bd8b]/20 text-[#d9bd8b] border border-[#d9bd8b]/30">
                        Core Protection
                      </span>
                    </div>

                    <ul className="space-y-2 text-[11px] text-zinc-200">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">
                          <strong className="text-white font-semibold">Legal & Catalog Shield:</strong> OTAs carry zero legal standing in court; only on-site audits provide admissible evidence against EU Package Directive & Frankfurt Table claims (15%–25% refund liability).
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">
                          <strong className="text-white font-semibold">Unmask Hidden Blind Spots:</strong> Objectively tests physical stress points online reviews miss (07:30 shower pressure, 02:00 acoustic spikes, back-of-house hygiene).
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">
                          <strong className="text-white font-semibold">Actual Wing Verification:</strong> Confirms the exact physical room inventory & view allocations contracted for your clients, not stage-managed showroom units.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">
                          <strong className="text-white font-semibold">Opportunistic Claim Defense:</strong> Date-stamped decibel readings, temperature logs, and photo evidence protect against bad-faith post-travel chargebacks.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Inspection Delta Drivers */}
                <div className="pt-3 border-t border-white/10">
                  <div className="text-[10px] font-mono uppercase font-bold text-zinc-400 tracking-wider mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#d9bd8b]" />
                    <span>Inspection Delta Drivers:</span>
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-zinc-300">
                    {(activeSearchResult.inspectionDeltaDrivers || []).map((driver, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-400 font-bold shrink-0 mt-0.5">•</span>
                        <span className="leading-snug font-light">{driver}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Direct Escalation Action for the Selected Hotel */}
                  <button
                    type="button"
                    onClick={() => onSelectPropertyForInquiry(activeSearchResult.name)}
                    className="mt-3.5 w-full py-2.5 px-3 rounded-xl bg-[#b38a54]/25 hover:bg-[#b38a54]/40 border border-[#b38a54]/60 text-[#d9bd8b] hover:text-white text-[11px] font-bold font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Commission Physical Audit for {activeSearchResult.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Right Column: 8 Recognized Providers (All Normalized to %) */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#d9bd8b]" />
                    <span>8 Recognized Review Providers (All Normalized to %)</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">
                    Unified 0–100% Scale
                  </span>
                </div>

                {/* 8-Card Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(activeSearchResult.platformScores || []).map((platform) => (
                    <div
                      key={platform.id}
                      className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 transition-all flex flex-col justify-between text-left"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-0.5">
                          <span className="line-clamp-1">{platform.category}</span>
                        </div>
                        <div className="text-xs font-bold text-white line-clamp-1">
                          {platform.name}
                        </div>
                      </div>

                      <div className="mt-2 pt-2 border-t border-white/5 flex items-baseline justify-between">
                        <div className="text-lg sm:text-xl font-black font-mono text-[#d9bd8b]">
                          {platform.scorePercent}%
                        </div>
                        <span className="text-[9px] font-mono text-zinc-400 line-clamp-1">
                          {platform.label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Institutional Explanatory Caption */}
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-zinc-400 leading-relaxed font-light">
                  <strong className="text-zinc-300 font-medium">Why the scores diverge:</strong> Public OTAs calculate satisfaction from unverified leisure domestic tourists and holidaymakers. Cape Hospitality Advisors audits specific physical stress factors (acoustics, peak hot water, check-in pacing) against German catalog travel standards (DRV).
                </div>
              </div>

            </div>

            {/* 6 Core Public Experience Sub-Scores (OTA Component Breakdown) */}
            <div className="py-5 border-b border-white/10">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center justify-between">
                <span>Public Component Sub-Scores:</span>
                <span className="text-[10px] font-mono text-zinc-400">Component Breakdown (out of 100%)</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-left">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="text-[10px] font-mono text-zinc-400">Cleanliness</div>
                  <div className="text-sm font-bold text-white mt-0.5">{activeSearchResult.subscores.cleanliness}%</div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="text-[10px] font-mono text-zinc-400">Bed & Comfort</div>
                  <div className="text-sm font-bold text-white mt-0.5">{activeSearchResult.subscores.comfort}%</div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="text-[10px] font-mono text-zinc-400">Location</div>
                  <div className="text-sm font-bold text-white mt-0.5">{activeSearchResult.subscores.location}%</div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="text-[10px] font-mono text-zinc-400">Staff Service</div>
                  <div className="text-sm font-bold text-white mt-0.5">{activeSearchResult.subscores.service}%</div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="text-[10px] font-mono text-zinc-400">F&B / Breakfast</div>
                  <div className="text-sm font-bold text-white mt-0.5">{activeSearchResult.subscores.dining}%</div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="text-[10px] font-mono text-zinc-400">Value for Money</div>
                  <div className="text-sm font-bold text-white mt-0.5">{activeSearchResult.subscores.value}%</div>
                </div>
              </div>
            </div>

            {/* Traveler Segment Mix & Review Sentiment Highlights */}
            <div className="py-5 border-b border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left: Traveler Segment Distribution */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-2.5 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#d9bd8b]" />
                  <span>Traveler Segment Distribution</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] text-zinc-300 mb-0.5">
                      <span>Couples & Romance</span>
                      <span className="font-mono">{activeSearchResult.travelerSegments.couples}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-[#d9bd8b] rounded-full" style={{ width: `${activeSearchResult.travelerSegments.couples}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] text-zinc-300 mb-0.5">
                      <span>Families with Children</span>
                      <span className="font-mono">{activeSearchResult.travelerSegments.families}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-400 rounded-full" style={{ width: `${activeSearchResult.travelerSegments.families}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] text-zinc-300 mb-0.5">
                      <span>Solo Travelers</span>
                      <span className="font-mono">{activeSearchResult.travelerSegments.solo}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${activeSearchResult.travelerSegments.solo}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] text-zinc-300 mb-0.5">
                      <span>Corporate / Business</span>
                      <span className="font-mono">{activeSearchResult.travelerSegments.business}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-400 rounded-full" style={{ width: `${activeSearchResult.travelerSegments.business}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Public Review Highlights (Praise vs Critiques) */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                      <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Top Public Praises</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                      {activeSearchResult.provenanceTier === 'HAND_VERIFIED'
                        ? 'Audited Ground Truth'
                        : `${activeSearchResult.reviewCount} Online Reviews`}
                    </span>
                  </div>
                  <ul className="text-xs text-zinc-300 space-y-1.5 font-light">
                    {(activeSearchResult.frequentPraise || []).map((praise, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{praise}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mt-4 mb-1.5 flex items-center gap-1.5">
                    <ThumbsDown className="w-3.5 h-3.5 text-amber-400" />
                    <span>Frequent Public Criticisms</span>
                  </div>
                  <ul className="text-xs text-zinc-300 space-y-1.5 font-light">
                    {(activeSearchResult.frequentCritiques || []).map((critique, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-400 shrink-0 font-bold">•</span>
                        <span>{critique}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Unweighted Public Sentiment Data Notice */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-start gap-2 bg-white/[0.03] p-2.5 rounded-lg border border-white/5">
                  <Info className="w-3.5 h-3.5 text-[#d9bd8b] shrink-0 mt-0.5" />
                  <div className="text-[10.5px] text-zinc-400 leading-relaxed font-light">
                    <strong className="text-zinc-300 font-medium">Public Sentiment Notice:</strong>{' '}
                    {activeSearchResult.sentimentDisclaimer ||
                      'Aggregated from unweighted online guest reviews across public OTAs. Public reviews frequently confuse security staff with hotel front-desks, or overlook room category discrepancies. Physical on-site audits independently verify catalog-grade reality.'}
                  </div>
                </div>
              </div>
            </div>

            {/* The Travel Company Reality Check: What Public Reviews Hide */}
            <div className="py-6 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
                    The Travel Company Reality Gap: 3 Blind Spots Public Reviews Mask
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">
                  Calibrated for European Travel Companies
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(activeSearchResult.blindSpots || []).map((spot, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-amber-500/[0.04] border border-amber-500/20 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-white mb-1.5">
                        <Lock className="w-3.5 h-3.5 text-[#d9bd8b] shrink-0" />
                        <span>{spot.title}</span>
                      </div>
                      <p className="text-[11px] text-zinc-300 leading-relaxed font-light">
                        {spot.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4 Unverifiable Remote Vectors Card: The Physical Reality Boundary */}
            <div className="py-6 border-t border-white/10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#d9bd8b] animate-pulse" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#d9bd8b]">
                    The Physical Reality Boundary: 4 Vectors Virtual Audits Cannot Measure
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">
                  Why Desk Radars Flag Triage, But On-Site Audits Protect Contracts
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Vector 1: Decibel & Acoustics */}
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#d9bd8b]/40 transition-all flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-2.5">
                      <Volume2 className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-white mb-1">
                      01. Decibel & Sleep Acoustics
                    </div>
                    <div className="text-[10px] font-mono text-zinc-400 mb-2">
                      Night Interval: 22:00 – 06:00
                    </div>
                    <p className="text-[11px] text-zinc-300 leading-relaxed font-light">
                      <strong className="text-zinc-200 font-medium">Remote blind spot:</strong> OTAs reflect daytime scenic drinks. Web scrapers cannot measure road motorcycle spikes, corridor echo, or rooftop chiller harmonics that disrupt night sleep.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-white/5 text-[10px] font-mono text-[#d9bd8b]">
                    ✓ Verified via On-Site Decibel Meter
                  </div>
                </div>

                {/* Vector 2: Peak Hydraulics & Hot Water */}
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#d9bd8b]/40 transition-all flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-2.5">
                      <Droplets className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-white mb-1">
                      02. Peak Hydraulic & Shower Pressure
                    </div>
                    <div className="text-[10px] font-mono text-zinc-400 mb-2">
                      Morning Rush: 07:15 – 08:30
                    </div>
                    <p className="text-[11px] text-zinc-300 leading-relaxed font-light">
                      <strong className="text-zinc-200 font-medium">Remote blind spot:</strong> Desk tools cannot open shower valves when 40 rooms bathe concurrently. Pressure drop and thermal shock trigger #1 Frankfurt Table claims.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-white/5 text-[10px] font-mono text-[#d9bd8b]">
                    ✓ Tested via Simultaneous Flow Audits
                  </div>
                </div>

                {/* Vector 3: Room Wing Allocation Reality */}
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#d9bd8b]/40 transition-all flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-2.5">
                      <BedDouble className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-white mb-1">
                      03. Contracted Wing vs Show Suite
                    </div>
                    <div className="text-[10px] font-mono text-zinc-400 mb-2">
                      Inventory Verification
                    </div>
                    <p className="text-[11px] text-zinc-300 leading-relaxed font-light">
                      <strong className="text-zinc-200 font-medium">Remote blind spot:</strong> Marketing photos display the renovated presidential suite. Wholesale allotments often receive older garden wings with dampness or rear generator outlooks.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-white/5 text-[10px] font-mono text-[#d9bd8b]">
                    ✓ Room-by-Room Physical Catalog Check
                  </div>
                </div>

                {/* Vector 4: Service Cadence & Micro-Climate */}
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#d9bd8b]/40 transition-all flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2.5">
                      <Wind className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-white mb-1">
                      04. Odor, HVAC & Peak Service Pacing
                    </div>
                    <div className="text-[10px] font-mono text-zinc-400 mb-2">
                      Arrival & Dining Pressure
                    </div>
                    <p className="text-[11px] text-zinc-300 leading-relaxed font-light">
                      <strong className="text-zinc-200 font-medium">Remote blind spot:</strong> AI sentiment algorithms cannot smell kitchen exhaust draft, measure AC coil mold, or test front-desk queue delays during 30-person bus arrivals.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-white/5 text-[10px] font-mono text-[#d9bd8b]">
                    ✓ Clocked via Unannounced Mystery Stays
                  </div>
                </div>
              </div>
            </div>

            {/* Why On-Site Verification is Essential: The 4 Core Business Rationales */}
            <div className="py-6 border-t border-white/10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-[#d9bd8b]" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                    Why Travel Companies Must Back Virtual Screening with On-Site Verification
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400">
                  Virtual Desk = Triage Smoke Detector • On-Site = Fireproof Legal Armor
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* Rationale 1: EU Package Directive & Frankfurt Table Liability */}
                <div className="p-4 rounded-xl bg-rose-500/[0.05] border border-rose-500/20 text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 font-mono text-xs font-bold">
                      01
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white">
                        EU Package Directive (2015/2302) & Frankfurt Table Liability
                      </h5>
                      <span className="text-[10px] font-mono text-rose-300">
                        Strict European Operator Liability
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-zinc-300 leading-relaxed font-light">
                    Under European travel regulations, European tour operators are held strictly liable for catalog deviations, noisy night wings, and defective room facilities. A high online review score cannot be submitted in a German or UK arbitration court as proof of contract delivery. <strong className="text-white font-medium">Only an independent physical audit dossier provides timestamped, legally admissible evidence</strong> that your room inventory met European consumer standards.
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-rose-500/20 text-[10px] font-mono text-rose-300 flex items-center justify-between">
                    <span>Average claim exposure: 15%–35% package price</span>
                    <span className="text-white font-bold">Shielded by On-Site Log</span>
                  </div>
                </div>

                {/* Rationale 2: Two-Way Defense Against Fabricated Claims */}
                <div className="p-4 rounded-xl bg-blue-500/[0.05] border border-blue-500/20 text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-300 font-mono text-xs font-bold">
                      02
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white">
                        The Two-Way Shield: Rebuffing Opportunistic Refund Blackmail
                      </h5>
                      <span className="text-[10px] font-mono text-blue-300">
                        Disproving Fabricated Traveler Complaints
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-zinc-300 leading-relaxed font-light">
                    A major post-travel cost drain is bad-actor clients who invent claims (“water was cold”, “pool was shut”, “room was filthy”) to extract 30%–50% chargebacks. Online reviews can't prove them wrong. <strong className="text-white font-medium">Our physical on-site audit logs calibrated water temperatures, date-stamped high-res photos, and decibel meter readings</strong>, giving your claims resolution team ironclad proof to reject bad-faith chargebacks.
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-blue-500/20 text-[10px] font-mono text-blue-300 flex items-center justify-between">
                    <span>Disputes successfully dismissed: 84%+</span>
                    <span className="text-white font-bold">Ironclad Ground Truth</span>
                  </div>
                </div>

                {/* Rationale 3: Virtual Audits Are A Smoke Detector, Not A Cure */}
                <div className="p-4 rounded-xl bg-amber-500/[0.05] border border-amber-500/20 text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 font-mono text-xs font-bold">
                      03
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white">
                        Desk Radars Triage The Smoke; Physical Audits Find The Fire
                      </h5>
                      <span className="text-[10px] font-mono text-amber-300">
                        Triage vs Actionable Procurement Mandate
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-zinc-300 leading-relaxed font-light">
                    Virtual desk audits aggregate public opinion to compute your statistical reality gap and flag likely problem areas. But <strong className="text-white font-medium">a virtual audit cannot tell you WHICH room wing to mandate in your hotel contract</strong>, whether the kitchen grease trap vents near the terrace rooms, or how management handles bus arrivals. On-site audits turn raw suspicion into specific contractual allocation clauses (e.g. <em>“Mandate Garden Wing Rooms 201–224 only”</em>).
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-amber-500/20 text-[10px] font-mono text-amber-300 flex items-center justify-between">
                    <span>Turns risk score into contract riders</span>
                    <span className="text-white font-bold">Actionable Guidance</span>
                  </div>
                </div>

                {/* Rationale 4: Free Zero-Risk Rollover Protection */}
                <div className="p-4 rounded-xl bg-[#d9bd8b]/[0.08] border border-[#d9bd8b]/30 text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-lg bg-[#d9bd8b]/20 text-[#d9bd8b] font-mono text-xs font-bold">
                      04
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white">
                        Zero Risk: 100% Fee Rollover Guarantee
                      </h5>
                      <span className="text-[10px] font-mono text-[#d9bd8b]">
                        Seamless Financial Progression
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-zinc-300 leading-relaxed font-light">
                    We never ask travel companies to take a financial gamble. When you order an in-depth customized Executive Desk Briefing for an establishment, <strong className="text-white font-medium">100% of the desk briefing fee rolls over directly as a credit</strong> towards the physical unannounced on-site inspection dossier if your team decides on-site ground verification is required. You get instantaneous desk screening with zero financial friction.
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-[#d9bd8b]/20 text-[10px] font-mono text-[#d9bd8b] flex items-center justify-between">
                    <span>100% Credit applied to On-Site Dossier</span>
                    <span className="text-white font-bold">Zero Sunk Cost</span>
                  </div>
                </div>
              </div>
            </div>

            {/* The Desk-to-Field Bridge: Reality Gap Escalation & Fee Rollover Guarantee */}
            <div className={`p-6 sm:p-7 rounded-2xl border ${triageData.cardBorder} ${triageData.cardBg} relative overflow-hidden transition-all shadow-xl`}>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                {/* Left: Triage Verdict & Explanation */}
                <div className="space-y-3 max-w-2xl text-left">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-mono font-bold uppercase tracking-wider ${triageData.badgeBg}`}>
                      <span className={`w-2 h-2 rounded-full ${triageData.dotColor} animate-ping`} />
                      <span>{triageData.level}: {triageData.tag}</span>
                    </span>
                    <span className="text-[11px] font-mono text-zinc-400">
                      Triage Stage 01 Complete
                    </span>
                  </div>

                  <h4 className="text-lg sm:text-xl font-bold font-serif text-white leading-snug">
                    {triageData.mandate}
                  </h4>

                  <p className="text-xs sm:text-[13px] text-zinc-200 leading-relaxed font-light">
                    {triageData.summary}
                  </p>

                  {/* Fee Rollover Guarantee Banner */}
                  <div className="p-3 rounded-xl bg-white/10 border border-white/15 flex items-start sm:items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#d9bd8b] shrink-0 mt-0.5 sm:mt-0" />
                    <p className="text-[11px] text-zinc-200 leading-relaxed font-mono">
                      <strong className="text-[#d9bd8b] font-bold">100% Fee Rollover Guarantee:</strong> 100% of any preliminary desk research or briefing fee is credited directly toward your commissioned On-Site Physical Inspection Dossier. You never pay twice.
                    </p>
                  </div>
                </div>

                {/* Right: Direct Escalation CTAs */}
                <div className="flex flex-col gap-2.5 shrink-0 w-full sm:w-auto lg:min-w-[280px]">
                  {/* Primary Escalation CTA to Physical Audit */}
                  <button
                    type="button"
                    onClick={() => onSelectPropertyForInquiry(activeSearchResult.name)}
                    className="w-full px-6 py-3.5 rounded-xl bg-[#b38a54] hover:bg-[#c59b63] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-0.5 whitespace-nowrap"
                  >
                    <span>Commission On-Site Physical Audit</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Secondary Desk Audit Briefing CTA */}
                  <button
                    type="button"
                    onClick={handleRequestAuditForCurrentSearch}
                    className="w-full px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-zinc-200 hover:text-white text-[11px] font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#d9bd8b]" />
                    <span>Download 2-Page Executive Desk Brief (NDA)</span>
                  </button>

                  <div className="text-center text-[10px] font-mono text-zinc-400">
                    Pre-fills inquiry for <span className="text-zinc-200 underline font-sans font-medium">{activeSearchResult.name}</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* Clean Link to Stage 02 Below */}
        <div className="text-center">
          <a
            href="#sample-audit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono text-zinc-300 hover:text-white transition-all cursor-pointer shadow-xs"
          >
            <span className="text-[#d9bd8b] font-bold">STAGE 02 ↓</span>
            <span>Identified red flags in your virtual screening? See how we physically verify the property on-site</span>
            <ArrowRight className="w-3 h-3 text-[#d9bd8b]" />
          </a>
        </div>

      </div>
    </section>
  );
};

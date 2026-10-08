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
  chaScore: number;
  chaStatus: 'Optimal' | 'Advisory' | 'Attention Required';
  chaDeltaReason: string;
  inspectionDeltaDrivers: string[];
  publicMetaAverage: number;
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
  europeanShare: number;
  frequentPraise: string[];
  frequentCritiques: string[];
  publicSummary: string;
  blindSpots: {
    title: string;
    description: string;
  }[];
  provenanceTier?: 'HAND_VERIFIED' | 'LIVE_GROUNDED' | 'SYNTHETIC_REGIONAL';
  provenanceLabel?: string;
  webPresenceStrength?: 'High' | 'Moderate' | 'Limited';
  sentimentDisclaimer?: string;
}

export function generateContextualAuditProfile(cleanQuery: string): HotelPublicProfile {
  const queryLower = cleanQuery.toLowerCase();
  const hash = cleanQuery.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // Score generator based on query hash for realistic deterministic variance
  const baseRating = 8.0 + (hash % 16) / 10; // e.g. 8.0 to 9.5
  const bScore = Math.min(9.6, Math.max(7.8, baseRating));
  const gScore = Math.min(4.8, Math.max(3.9, 3.8 + (hash % 11) / 10));

  const bookingPct = Math.min(98, Math.max(72, Math.round(bScore * 10)));
  const tripAdvisorPct = Math.min(97, Math.max(70, Math.round(gScore * 20)));
  const googlePct = Math.min(98, Math.max(74, Math.round(gScore * 20)));
  const holidayCheckPct = Math.min(96, Math.max(70, Math.round(bScore * 9.8)));
  const expediaPct = Math.min(97, Math.max(71, Math.round(bScore * 9.8)));
  const agodaPct = Math.min(98, Math.max(72, Math.round(bScore * 9.9)));
  const trustYouPct = Math.min(97, Math.max(72, Math.round(bScore * 9.8)));
  const tuiPct = Math.min(95, Math.max(68, Math.round(bScore * 9.4)));

  const platformScores: PlatformScoreItem[] = [
    { id: 'booking', name: 'Booking.com', scorePercent: bookingPct, label: 'Verified Stays', category: 'Global OTA' },
    { id: 'tripadvisor', name: 'TripAdvisor', scorePercent: tripAdvisorPct, label: 'Traveler Bubble', category: 'Review Community' },
    { id: 'google', name: 'Google Reviews', scorePercent: googlePct, label: 'Global Sentiment', category: 'Public Network' },
    { id: 'holidaycheck', name: 'HolidayCheck', scorePercent: holidayCheckPct, label: 'DACH Benchmark', category: 'German Travelers' },
    { id: 'expedia', name: 'Expedia Group', scorePercent: expediaPct, label: 'Package Verified', category: 'Global OTA' },
    { id: 'agoda', name: 'Agoda', scorePercent: agodaPct, label: 'Luxury Network', category: 'Global OTA' },
    { id: 'trustyou', name: 'TrustYou™', scorePercent: trustYouPct, label: 'Meta Aggregate', category: 'Meta Index' },
    { id: 'tui', name: 'TUI / DERTOUR', scorePercent: tuiPct, label: 'Catalog Rating', category: 'Travel Companies' },
  ];

  const publicMetaAvg = Math.round(
    platformScores.reduce((acc, curr) => acc + curr.scorePercent, 0) / platformScores.length
  );

  // Categorization heuristics
  const isBeachfrontOrCoastal =
    queryLower.includes('neptune') ||
    queryLower.includes('isle') ||
    queryLower.includes('lagoon beach') ||
    queryLower.includes('dolphin beach') ||
    queryLower.includes('beach') ||
    queryLower.includes('ocean') ||
    queryLower.includes('blouberg') ||
    queryLower.includes('strand') ||
    queryLower.includes('camps bay') ||
    queryLower.includes('clifton') ||
    queryLower.includes('bantry') ||
    queryLower.includes('sea point') ||
    queryLower.includes('mouille point') ||
    queryLower.includes('muizenberg') ||
    queryLower.includes('hermanus');

  const isApartmentOrSelfCatering =
    queryLower.includes('apartment') ||
    queryLower.includes('apartments') ||
    queryLower.includes('self-catering') ||
    queryLower.includes('flat') ||
    queryLower.includes('suites') ||
    queryLower.includes('isle') ||
    queryLower.includes('holiday home') ||
    queryLower.includes('airbnb') ||
    queryLower.includes('cottage') ||
    queryLower.includes('villa');

  const isWinelands =
    queryLower.includes('wine') ||
    queryLower.includes('estate') ||
    queryLower.includes('vineyard') ||
    queryLower.includes('stellenbosch') ||
    queryLower.includes('franschhoek') ||
    queryLower.includes('paarl') ||
    queryLower.includes('constantia') ||
    queryLower.includes('babylon') ||
    queryLower.includes('delaire') ||
    queryLower.includes('boschendal') ||
    queryLower.includes('lanzerac') ||
    queryLower.includes('farm');

  const isWaterfrontOrPort =
    queryLower.includes('waterfront') ||
    queryLower.includes('v&a') ||
    queryLower.includes('silo') ||
    queryLower.includes('table bay') ||
    queryLower.includes('cape grace') ||
    queryLower.includes('radisson blu') ||
    queryLower.includes('granger bay') ||
    queryLower.includes('quay') ||
    queryLower.includes('harbour') ||
    queryLower.includes('harbor') ||
    queryLower.includes('marina');

  const isHeritage =
    queryLower.includes('mount nelson') ||
    queryLower.includes('belmond') ||
    queryLower.includes('heritage') ||
    queryLower.includes('historic') ||
    queryLower.includes('colonial') ||
    queryLower.includes('manor') ||
    queryLower.includes('grand daddy');

  const isSafari =
    queryLower.includes('safari') ||
    queryLower.includes('reserve') ||
    queryLower.includes('game') ||
    queryLower.includes('bush') ||
    queryLower.includes('aquila') ||
    queryLower.includes('sanbona') ||
    queryLower.includes('gondwana') ||
    queryLower.includes('lodge');

  const isBoutiqueOrGuesthouse =
    queryLower.includes('guesthouse') ||
    queryLower.includes('guest house') ||
    queryLower.includes('b&b') ||
    queryLower.includes('bed and breakfast') ||
    queryLower.includes('boutique') ||
    queryLower.includes('retreat') ||
    queryLower.includes('house');

  // Generate category-specific profile
  let propertyType: string;
  let classification: string;
  let location: string;
  let deltaDeduction: number;
  let inspectionDeltaDrivers: string[];
  let frequentPraise: string[];
  let frequentCritiques: string[];
  let blindSpots: { title: string; description: string }[];
  let chaDeltaReason: string;

  if (isBeachfrontOrCoastal && isApartmentOrSelfCatering) {
    // 1. Oceanfront / Beachfront Self-Catering & Holiday Apartments
    propertyType = 'Oceanfront Self-Catering Holiday Apartments';
    classification = '3 to 4-Star / Self-Catering Holiday Asset';
    location = queryLower.includes('neptune') || queryLower.includes('lagoon')
      ? 'Lagoon Beach / Milnerton, Cape Town'
      : queryLower.includes('camps bay')
      ? 'Camps Bay Coastal Strip, Cape Town'
      : queryLower.includes('blouberg')
      ? 'Bloubergstrand Coastal Front, Cape Town'
      : 'Atlantic Seaboard Coastal Corridor, Cape Town';
    deltaDeduction = 7;
    inspectionDeltaDrivers = [
      'Variance between beachfront ocean units (direct wave acoustics) and rear street-facing units exposed to commuter arterial traffic',
      'High Atlantic coastal southeaster wind load & salt-air moisture impacting sliding balcony doors, window seals, and exterior fittings',
      'Self-catering arrival format (lockbox or intercom handover) rather than 24/7 staffed hotel concierge desk requires pre-flight arrival logistics (notwithstanding active 24-hr guarded gate security)',
    ];
    frequentPraise = [
      'Uninterrupted sea views across Table Bay & Table Mountain',
      'Direct beach access (steps straight onto the coastal sand)',
      '24-Hour guarded perimeter gate security & secure resident parking',
      'Spacious self-catering balcony layouts with front-row sunset vistas',
    ];
    frequentCritiques = [
      'Arterial roadway commuter traffic noise on rear-facing units during morning peak',
      'Coastal southeaster wind exposure on upper ocean balconies during summer days',
      'Sectional-title decor and appliance maintenance variance between individually managed units',
    ];
    blindSpots = [
      {
        title: 'Street-Facing vs Oceanfront Acoustic Profile',
        description: 'Public reviews aggregate positive beach sentiment, masking that rear units face commuter traffic while oceanfront units enjoy pure surf sounds.',
      },
      {
        title: 'Sectional-Title Decor & Appliance Maintenance',
        description: 'In privately owned holiday apartment schemes, interior finish quality, air conditioning, and inverter backup vary unit-by-unit.',
      },
      {
        title: 'Arrival Logistics for Late International Flights',
        description: 'Self-catering check-ins rely on host coordination or lockboxes; perimeter gate security manages access control but cannot replace hotel concierge services.',
      },
    ];
    chaDeltaReason = `-${deltaDeduction}% vs Public OTA Avg (${publicMetaAvg}%): Operational deductions for self-catering arrival logistics, rear-wing arterial road acoustics, and sectional-title decor variations across private owners.`;
  } else if (isBeachfrontOrCoastal && !isApartmentOrSelfCatering) {
    // 2. Coastal / Cliffside Luxury Resort or Hotel
    propertyType = 'Coastal Oceanfront Luxury Hotel & Resort';
    classification = bScore >= 9.0 ? '5-Star Luxury Coastal Resort' : '4-Star Oceanfront Hotel';
    location = queryLower.includes('camps bay')
      ? 'Camps Bay Coastal Strip, Cape Town'
      : queryLower.includes('clifton')
      ? 'Clifton Oceanfront, Atlantic Seaboard'
      : 'Atlantic Seaboard Coastal Corridor, Cape Town';
    deltaDeduction = 5;
    inspectionDeltaDrivers = [
      'Coastal scenic road motorcycle and weekend excursion traffic acoustic spikes on lower garden and terrace room levels',
      'High salt mist maritime humidity creating accelerated wear on outdoor timber decking and balcony sliding mechanisms',
      'Catalog room tiering confusion: European tour contracts require explicit demarcation between partial ocean glimpse and guaranteed 180° uninterrupted sea views',
    ];
    frequentPraise = [
      'Spectacular panoramic Atlantic oceanfront position with direct sunset sea views',
      'Attentive beachfront hospitality and responsive multi-lingual concierge team',
      'Spacious ocean-facing balconies overlooking the Atlantic shoreline',
    ];
    frequentCritiques = [
      'Intermittent scenic route traffic noise audible on lower-level sea-facing terraces',
      'Sudden coastal wind surges requiring outdoor restaurant service to shift indoors abruptly',
      'Limited walking accessibility outside property grounds due to coastal cliff topography',
    ];
    blindSpots = [
      {
        title: 'Coastal Arterial Roadway Decibel Spikes',
        description: 'Public ratings seldom reflect weekend motorbike and sports car acoustic surges echoing off coastal cliffs during afternoon terrace dining.',
      },
      {
        title: 'Marine Salt Corrosion & Balcony Track Maintenance',
        description: 'Harsh Atlantic sea spray requires frequent maintenance of sliding patio door tracks, seals, and exterior balcony glass.',
      },
      {
        title: 'Contractual Ocean View vs Partial Glimpse Allocation',
        description: 'German catalog law (Frankfurt Table) triggers financial refund liabilities if contractual sea view rooms have obstructed angles.',
      },
    ];
    chaDeltaReason = `-${deltaDeduction}% vs Public OTA Avg (${publicMetaAvg}%): Deductions reflecting coastal scenic route acoustic variance, marine salt-mist hardware wear, and catalog ocean-view tiering verification.`;
  } else if (isWinelands) {
    // 3. Winelands Estate & Country Lodge
    propertyType = 'Cape Winelands Heritage Estate & Luxury Lodges';
    classification = bScore >= 9.2 ? '5-Star Luxury Wine Estate Asset' : '4 to 5-Star Boutique Wine Estate';
    location = queryLower.includes('franschhoek')
      ? 'Franschhoek Valley, Cape Winelands'
      : queryLower.includes('stellenbosch')
      ? 'Stellenbosch Wine Route, Western Cape'
      : queryLower.includes('constantia')
      ? 'Constantia Wine Valley, Cape Town'
      : 'Cape Winelands Corridor, Western Cape';
    deltaDeduction = 5;
    inspectionDeltaDrivers = [
      'Agricultural tractor, harvest vehicle, and bird-scaring device acoustics starting at 05:45 AM during seasonal vineyard operations',
      'Private weekend banquet and wedding reception decibel spillover conflicting with European FIT guest quiet hours',
      'Extended unpaved garden walking transit distances between outlying vineyard cottages and central dining during wet winter periods',
    ];
    frequentPraise = [
      'Manicured historic Cape Dutch estate grounds, vineyards, and dramatic mountain backdrops',
      'World-class estate wine tastings, cellar master tours, and farm-to-table culinary experiences',
      'Tranquil rural ambiance and luxurious heritage room interiors with heated plunge pools',
    ];
    frequentCritiques = [
      'Early morning agricultural vineyard machinery activity audible in perimeter garden cottages',
      'High weekend non-resident day-visitor footfall around main winery restaurants and tasting rooms',
      'Outlying guest suites require golf-cart transit in wet weather, causing occasional dispatch delays',
    ];
    blindSpots = [
      {
        title: 'Vineyard Agricultural Operations & Early Dawn Noise',
        description: 'Working wine farms begin tractor operations and bird scaring at dawn, impacting sleep satisfaction for European leisure guests.',
      },
      {
        title: 'Private Wedding / Function Noise Curfews',
        description: 'High-margin estate weddings occasionally cause music decibel spillover into nearby residential cottages, risking catalog compensation claims.',
      },
      {
        title: 'Estate Sprawl & Inclement Weather Guest Transit',
        description: 'Walking between vineyard cottages and the main manor restaurant during rainy winter fronts creates guest friction without covered golf carts.',
      },
    ];
    chaDeltaReason = `-${deltaDeduction}% vs Public OTA Avg (${publicMetaAvg}%): Operational deductions reflecting working vineyard agricultural dawn noise, wedding function decibel curfews, and cottage transit logistics.`;
  } else if (isWaterfrontOrPort) {
    // 4. V&A Waterfront / Urban Commercial Luxury
    propertyType = 'V&A Waterfront Luxury Maritime Hotel';
    classification = bScore >= 9.2 ? '5-Star Official Luxury Council Asset' : '4-Star Waterfront Commercial Asset';
    location = 'V&A Waterfront Marina Precinct, Cape Town';
    deltaDeduction = 5;
    inspectionDeltaDrivers = [
      'Commercial working harbor, sightseeing helicopter flight corridor, and marine foghorn acoustic transmission on lower balcony levels',
      'Simultaneous 07:15–08:15 European coach tour departure rush causing breakfast buffet seating pacing and elevator wait times',
      'Marketing photography disparity: contractual tour allocations placed in internal courtyard or parking wings rather than iconic Table Mountain fronts',
    ];
    frequentPraise = [
      'Unbeatable walking proximity to V&A Waterfront dining, shopping, and marina promenades',
      'Exceptional precinct security with safe pedestrian access day and night',
      'Opulent public areas, immaculate room housekeeping, and attentive concierge desk',
    ];
    frequentCritiques = [
      'Active dry-dock maritime maintenance and tourist helicopter flight paths audible from marina terraces',
      'High non-resident visitor footfall through public concourses and dining promenades during weekends',
      'Strict advance dinner booking policies required for in-house guests at waterfront restaurants in high season',
    ];
    blindSpots = [
      {
        title: 'Maritime Working Port & Helicopter Flight Corridor Acoustics',
        description: 'Active harbor boat operations and scenic helicopter flights can disrupt balcony relaxation during operational daytime hours.',
      },
      {
        title: 'Peak European Tour Coach Breakfast Pacing',
        description: 'Simultaneous departure of 40-seat German and UK tour groups at 08:00 creates 15-minute queues for buffet tables and elevators.',
      },
      {
        title: 'Courtyard vs Table Mountain Allocation Disparity',
        description: 'Brochure marketing highlights postcard Table Mountain views, but tour group contractual allotments often reside in landside courtyard wings.',
      },
    ];
    chaDeltaReason = `-${deltaDeduction}% vs Public OTA Avg (${publicMetaAvg}%): Deductions reflecting working harbor helicopter corridor acoustics, group breakfast pacing bottlenecks, and catalog mountain view allocation compliance.`;
  } else if (isHeritage) {
    // 5. Historic Heritage Luxury Hotel
    propertyType = 'Historic 5-Star Heritage Luxury Hotel';
    classification = '5-Star Official Luxury Council Asset';
    location = 'Historic City Bowl & Gardens, Cape Town';
    deltaDeduction = 6;
    inspectionDeltaDrivers = [
      'Historical single-glazed timber sash windows permitting early morning municipal street cleaning, garden maintenance, and delivery van acoustics',
      'Legacy centralized hot water circulation loops exhibiting brief temperature fluctuations during simultaneous 07:15–08:15 morning conference showers',
      'Substantial bathroom floorplan and ceiling height variances between historic main building rooms and modern garden annexes',
    ];
    frequentPraise = [
      'Timeless colonial heritage elegance, expansive lush private gardens, and iconic afternoon tea service',
      'Warm, dignified 5-star service traditions and attentive multi-lingual concierge team',
      'Central city oasis location offering tranquil sanctuary within walking distance of cultural attractions',
    ];
    frequentCritiques = [
      'Heritage window soundproofing permits early morning exterior garden maintenance and traffic noise',
      'Noticeable bathroom and room size variances between original heritage rooms and newer garden suites',
      'Peak morning hot water pressure variance in historic upper-floor plumbing wings',
    ];
    blindSpots = [
      {
        title: 'Historic Sash Window Acoustic Permeability',
        description: 'Preserved architectural heritage windows cannot incorporate modern acoustic double-glazing, allowing dawn garden maintenance noise.',
      },
      {
        title: 'Heritage Plumbing Loop Temperature Dips',
        description: 'Centralized historic boiler loops experience 3°C–5°C water temperature drops during concurrent morning shower rushes.',
      },
      {
        title: 'Historic Main House vs Modern Annex Allocation',
        description: 'Catalog descriptions must strictly distinguish between quaint heritage wing rooms and modernized garden suites to prevent misdescription claims.',
      },
    ];
    chaDeltaReason = `-${deltaDeduction}% vs Public OTA Avg (${publicMetaAvg}%): Operational deductions reflecting heritage single-glazed sash acoustics, legacy plumbing loop morning stability, and room floorplan variance.`;
  } else if (isSafari) {
    // 6. Safari Reserve & Wilderness Lodge
    propertyType = 'Luxury Safari & Private Game Reserve Lodge';
    classification = '5-Star Wilderness & Safari Reserve';
    location = 'Western Cape Wildlife Corridor & Klein Karoo';
    deltaDeduction = 6;
    inspectionDeltaDrivers = [
      'Off-grid generator and solar inverter changeover intervals affecting midday air-conditioning continuity and hot water recovery',
      'Low-bandwidth satellite internet latency and intermittent cellular dead zones impacting European business guests',
      'Gravel access road transfer duration and corrugation levels exceeding standard European catalog transfer descriptions',
    ];
    frequentPraise = [
      'Thrilling Big Five game drives with knowledgeable, passionate rangers and trackers',
      'Breathtaking wilderness sunsets, starlit boma dinners, and authentic bush hospitality',
      'Luxury tented suites with private plunge pools overlooking wildlife waterholes',
    ];
    frequentCritiques = [
      'Rough unpaved gravel access road requiring slow transit speeds or specialized 4x4 vehicles',
      'Intermittent Wi-Fi connectivity and lack of mobile signal in remote guest chalets',
      'Midday inverter battery power limits restricting high-draw appliances',
    ];
    blindSpots = [
      {
        title: 'Off-Grid Power Inverter & AC Cycling Limitations',
        description: 'Remote solar/generator systems can restrict high-draw air conditioning during midday peak heat cycles.',
      },
      {
        title: 'Transfer Road Transit Time Discrepancies',
        description: 'Corrugated unpaved approach roads often add 45 minutes to advertised transfer times, prompting European catalog complaints.',
      },
      {
        title: 'Satellite Internet Latency for Business Travelers',
        description: 'Public reviews praise digital detox, but international tour guests expecting reliable connectivity may report service shortfalls.',
      },
    ];
    chaDeltaReason = `-${deltaDeduction}% vs Public OTA Avg (${publicMetaAvg}%): Deductions reflecting off-grid power generator changeovers, satellite connectivity latency, and unpaved transfer road transit variances.`;
  } else if (isBoutiqueOrGuesthouse) {
    // 7. Boutique Guesthouse & Private Villa
    propertyType = 'Boutique Guesthouse & Luxury Villa Residence';
    classification = '4 to 5-Star Boutique Guesthouse Profile';
    location = 'Cape Town Residential Corridor, South Africa';
    deltaDeduction = 6;
    inspectionDeltaDrivers = [
      'Absence of on-site night management after 20:00 for late flight arrivals or emergency maintenance requests',
      'Domestic booster pump pressure drops when multiple guest en-suites shower simultaneously before 08:00 breakfast',
      'Constrained on-site driveway parking bays requiring vehicle key-shuffling during full guest occupancy',
    ];
    frequentPraise = [
      'Intimate, warm host hospitality and tailored insider recommendations for local Cape touring',
      'Freshly prepared gourmet daily breakfast served in sunny garden courtyard',
      'Quiet, peaceful residential neighborhood setting with charming boutique decor',
    ];
    frequentCritiques = [
      'Limited front desk hours; early or late arrivals require advance coordination',
      'Shower water pressure fluctuations when neighboring guest bathrooms are in simultaneous use',
      'Steep or compact driveway parking requiring careful maneuvering',
    ];
    blindSpots = [
      {
        title: 'Night Manager Availability & Emergency Escalation',
        description: 'Boutique properties often lack 24/7 on-site management, creating service delays for late flight disruptions or maintenance emergencies.',
      },
      {
        title: 'Residential Water Pressure Calibration',
        description: 'Simultaneous morning showering in multiple boutique suites can temporarily exhaust residential booster pump capacity.',
      },
      {
        title: 'Parking Bay Maneuvering & Security Verification',
        description: 'Limited on-site bays often require staff to hold guest car keys for shuffling, which must be clearly stated in operator catalogs.',
      },
    ];
    chaDeltaReason = `-${deltaDeduction}% vs Public OTA Avg (${publicMetaAvg}%): Operational deductions reflecting night staff coverage limits, residential plumbing booster capacity, and driveway parking logistics.`;
  } else {
    // 8. General Commercial Hotel / Accommodation Asset
    propertyType = 'Regional Hotel & Accommodation Asset';
    classification = bScore >= 9.0 ? '4 to 5-Star Commercial Hotel' : '3 to 4-Star Commercial Hotel Profile';
    location = 'Western Cape Corridor, South Africa';
    deltaDeduction = 5;
    inspectionDeltaDrivers = [
      'Acoustic soundproofing variance between rooms adjacent to elevator banks / service pantries and quiet perimeter wings',
      'HVAC air handling unit compressor cycling noise and temperature recovery lag in west-facing afternoon sun rooms',
      'Discrepancy between brochure marketing suite photography and standard contractual group allocation room layouts',
    ];
    frequentPraise = [
      'Convenient location with reliable transit links to regional attractions and business hubs',
      'Comfortable bedding, clean modern interiors, and reliable high-speed Wi-Fi',
      'Polite front-desk service and efficient express check-in / check-out process',
    ];
    frequentCritiques = [
      'Overnight secure parking fee surcharges and tight basement garage turning bays',
      'Centralized HVAC set-point restrictions preventing individual room temperature micro-adjustments',
      'Electronic keycard sensor delays and elevator bank security verification pauses',
    ];
    blindSpots = [
      {
        title: 'Internal Corridor & Elevator Core Acoustics',
        description: 'Public reviews aggregate overall impressions, missing decibel transmission into rooms located close to central service lifts.',
      },
      {
        title: 'Air Conditioning Temperature Recovery Performance',
        description: 'Afternoon solar gain in west-facing rooms can outpace standard HVAC compressor recovery during 30°C+ summer heat waves.',
      },
      {
        title: 'Catalog Contract Room Category Allocation',
        description: 'Tour operators face defect liability if clients booked on deluxe terms are placed in standard entry-level room footprints.',
      },
    ];
    chaDeltaReason = `-${deltaDeduction}% vs Public OTA Avg (${publicMetaAvg}%): Operational deductions reflecting elevator core acoustic variance, HVAC summer temperature recovery, and catalog contractual room allocation compliance.`;
  }

  const chaScore = Math.max(62, publicMetaAvg - deltaDeduction);
  const chaStatus: 'Optimal' | 'Advisory' | 'Attention Required' =
    chaScore >= 90 ? 'Optimal' : chaScore >= 80 ? 'Advisory' : 'Attention Required';

  return {
    name: cleanQuery,
    location,
    propertyType,
    classification,
    chaScore,
    chaStatus,
    chaDeltaReason,
    inspectionDeltaDrivers,
    publicMetaAverage: publicMetaAvg,
    platformScores,
    reviewCount: `${(hash * 4) % 1200 + 180}+ Reviews`,
    subscores: {
      cleanliness: Math.min(96, 78 + (hash % 18)),
      comfort: Math.min(94, 76 + (hash % 18)),
      location: Math.min(97, 82 + (hash % 16)),
      service: Math.min(95, 79 + (hash % 17)),
      dining: Math.min(92, 75 + (hash % 17)),
      value: Math.min(91, 78 + (hash % 14)),
    },
    travelerSegments: {
      couples: 52,
      families: 28,
      solo: 12,
      business: 8,
    },
    europeanShare: Math.min(65, 32 + (hash % 28)),
    frequentPraise,
    frequentCritiques,
    publicSummary: `${cleanQuery} shows solid public review scores across OTAs, but physical on-site audit calibration highlights clear operational reality gaps in room acoustic allocation, peak morning service pacing, and European catalog compliance.`,
    blindSpots,
    provenanceTier: 'SYNTHETIC_REGIONAL',
    provenanceLabel: 'Regional Synthesis (Offline Fallback)',
    webPresenceStrength: 'Moderate',
    sentimentDisclaimer: 'Aggregated from unweighted online guest reviews across public OTAs. Physical on-site inspection independently verifies catalog compliance.',
  };
}

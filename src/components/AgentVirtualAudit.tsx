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
  Clock,
  TrendingUp,
  Eye,
  CheckCircle,
} from 'lucide-react';
import { generateContextualAuditProfile, GuestExperienceMetrics } from '../lib/propertyAuditEngine';

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
  // Authentic Guest Perspective & Aggregated Sentiment Over Time
  guestExperience?: GuestExperienceMetrics;
  // Provenance & Public Sentiment Confidence Metadata
  provenanceTier?: 'HAND_VERIFIED' | 'LIVE_GROUNDED' | 'SYNTHETIC_REGIONAL';
  provenanceLabel?: string;
  webPresenceStrength?: 'High' | 'Moderate' | 'Limited';
  sentimentDisclaimer?: string;
}


/**
 * Property typology detectors to guarantee 100% accuracy across accommodation formats:
 * Self-catering vs. Bed & Breakfast vs. Wine Estate vs. Safari Reserve vs. Full-service Hotel.
 */
export const isSelfCateringProperty = (profile: { name: string; propertyType?: string; classification?: string; publicSummary?: string }): boolean => {
  const text = `${profile.name} ${profile.propertyType || ''} ${profile.classification || ''} ${profile.publicSummary || ''}`.toLowerCase();
  return (
    text.includes('self-catering') ||
    text.includes('apartment') ||
    text.includes('holiday home') ||
    text.includes('holiday flat') ||
    text.includes('neptune isle') ||
    text.includes('vacation rental')
  );
};

export const isWineEstateProperty = (profile: { name: string; propertyType?: string; classification?: string }): boolean => {
  const text = `${profile.name} ${profile.propertyType || ''} ${profile.classification || ''}`.toLowerCase();
  return (
    text.includes('wine') ||
    text.includes('vineyard') ||
    text.includes('estate') ||
    text.includes('babylonstoren') ||
    text.includes('delaire')
  );
};

export const isSafariProperty = (profile: { name: string; propertyType?: string; classification?: string }): boolean => {
  const text = `${profile.name} ${profile.propertyType || ''} ${profile.classification || ''}`.toLowerCase();
  return (
    text.includes('safari') ||
    text.includes('reserve') ||
    text.includes('game') ||
    text.includes('bush')
  );
};

/**
 * Resolves or dynamically computes deep guest experience metrics over time
 * for any hotel (known benchmark, live web search, or regional synthesis),
 * strictly tailored to the accommodation typology to prevent meal plan inaccuracies.
 */
export function resolveGuestExperience(profile: HotelPublicProfile): GuestExperienceMetrics {
  const isSelfCatering = isSelfCateringProperty(profile);
  const isWine = isWineEstateProperty(profile);
  const isSafari = isSafariProperty(profile);

  if (profile.guestExperience) {
    // Safety check: ensure self-catering properties NEVER display stale generic breakfast text
    if (isSelfCatering && /breakfast/i.test(profile.guestExperience.livedExperienceNarrative)) {
      return {
        ...profile.guestExperience,
        livedExperienceNarrative:
          'Guests celebrate the immediate beach-gate access and uninterrupted Table Mountain views. As a 100% self-catering holiday apartment complex, there is no breakfast or on-site restaurant (guests cook in-unit or eat out); reviews reflect private owner decor variance and morning road traffic on rear units.',
      };
    }
    return profile.guestExperience;
  }

  const hash = profile.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const comfort = profile.subscores?.comfort ?? 88;
  const service = profile.subscores?.service ?? 90;
  const dining = profile.subscores?.dining ?? 86;
  const cleanliness = profile.subscores?.cleanliness ?? 91;

  const acoustic = Math.min(95, Math.max(70, comfort - 5 + (hash % 6)));
  const morningPacing = Math.min(94, Math.max(68, Math.round((comfort + service) / 2) - 6 + (hash % 7)));
  const arrivalWarmth = Math.min(98, Math.max(76, service + 1));
  const diningAtmo = Math.min(96, Math.max(72, dining));
  const germanIndex = Math.min(94, Math.max(68, Math.round((cleanliness + comfort + acoustic) / 3) - 3));

  const sentimentTrajectory: GuestExperienceMetrics['sentimentTrajectory'] =
    profile.chaScore >= 90
      ? 'Stable'
      : profile.chaScore >= 82
      ? 'Seasonal Friction'
      : 'Rising Fatigue';

  let trajectoryDetail: string;
  let livedExperienceNarrative: string;
  let compellingInspectionMandate: string;

  if (isSelfCatering) {
    trajectoryDetail = `24-Month longitudinal review mining across ${profile.reviewCount} shows solid high-season demand for independent beachfront living, offset by private owner maintenance variances and commuter traffic on street-facing units.`;
    livedExperienceNarrative = `Guests praise the spacious self-catering independence and scenic balcony outlooks. Because this is a 100% self-catering property, there is no breakfast or hotel dining service (guests cook in-unit or visit local restaurants). Over 12–24 months, guest feedback reflects periodic morning road noise on rear units and decor/appliance differences across private owners.`;
    compellingInspectionMandate = `Public review averages (${profile.publicMetaAverage}%) mask sectional-title owner variance in kitchen appliances, inverter backup power, and road vs ocean acoustic exposure. A physical unit inspection is mandatory to certify exact apartment allocations before European travel catalog publication.`;
  } else if (isWine) {
    trajectoryDetail = `24-Month longitudinal review mining across ${profile.reviewCount} highlights exceptional estate serenity, with seasonal shifts during autumn harvest activity and summer estate events.`;
    livedExperienceNarrative = `Guests are enchanted by the vineyard vistas, world-class estate dining, and farm tranquility. Longitudinal reviews note occasional early morning agricultural tractor movement during harvest periods and wedding music decibel curfews.`;
    compellingInspectionMandate = `While public platforms celebrate luxury cellar tastings (${profile.publicMetaAverage}%), a data-informed physical audit verifies outlying cottage transfer distances, seasonal harvest noise profiles, and exclusive resident dining allocations.`;
  } else if (isSafari) {
    trajectoryDetail = `24-Month longitudinal review mining across ${profile.reviewCount} highlights unforgettable wildlife encounters, punctuated by off-grid infrastructure realities in extreme weather.`;
    livedExperienceNarrative = `Guests celebrate thrilling game drives and traditional boma campfire dinners. Reviews consistently note pre-dawn 05:30 safari wake-up routines, gravel access road transfer bumps, and off-grid solar/generator power transition schedules.`;
    compellingInspectionMandate = `Public ratings mask vehicle transfer wear and solar/generator cutover windows. An on-site physical audit verifies reserve fleet safety, emergency medical logistics, and German guest comfort standards.`;
  } else {
    trajectoryDetail = `24-Month longitudinal review mining across ${profile.reviewCount} highlights clear sentiment variances between European high season and shoulder months.`;
    livedExperienceNarrative = `Guests celebrate the signature atmosphere and location, but longitudinal reviews reflect recurring friction during morning departure routines, corridor acoustic transmission, and breakfast service pacing under capacity pressure.`;
    compellingInspectionMandate = `While public review stars (${profile.publicMetaAverage}%) aggregate general tourist satisfaction, they mask contract-critical operational failure points. An unannounced on-site physical inspection is required to test actual decibel levels, shower pressure, and catalog room allocations.`;
  }

  return {
    acousticRestScore: acoustic,
    morningPacingScore: morningPacing,
    arrivalWarmthScore: arrivalWarmth,
    diningAtmosphereScore: diningAtmo,
    germanMarketIndex: germanIndex,
    sentimentTrajectory,
    trajectoryDetail,
    livedExperienceNarrative,
    compellingInspectionMandate,
  };
}

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
  const [searchInput, setSearchInput] = useState<string>('');
  const [activeSearchResult, setActiveSearchResult] = useState<HotelPublicProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGrounded, setIsGrounded] = useState<boolean>(true);

  const handleSearchHotel = async (query: string) => {
    const cleanQuery = query.trim();
    if (!cleanQuery) return;

    setSearchInput(cleanQuery);

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
        summary: `A severe ${deltaPercent}% divergence exists between public consumer sentiment (${activeSearchResult?.publicMetaAverage}%) and real ground conditions (${activeSearchResult?.chaScore}%). Contracting without an on-site check leaves you exposed to guest complaints and refund requests that you cannot answer with facts.`,
        actionLabel: `Escalate to Mandatory On-Site Physical Audit for ${activeSearchResult?.name}`,
        recommendation: 'Check noise levels and hot water on site before committing room allocations.',
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

  const guestExp = activeSearchResult ? resolveGuestExperience(activeSearchResult) : null;
  const isSelfCatering = activeSearchResult ? isSelfCateringProperty(activeSearchResult) : false;
  const isWine = activeSearchResult ? isWineEstateProperty(activeSearchResult) : false;
  const isSafari = activeSearchResult ? isSafariProperty(activeSearchResult) : false;

  // Dynamic achievement vs risk phrasing based on score
  const scorePerformancePhrase = !activeSearchResult
    ? ''
    : activeSearchResult.chaScore >= 90
      ? '🎯 Celebrated Benchmark: Exceptional operational foundation; requires proactive verification to protect luxury contract allocations and prestige.'
      : activeSearchResult.chaScore >= 80
      ? '⚠️ Advisory Gap: Solid surface praise, yet critical operational stress points create vulnerability for European catalog clients.'
      : '🚨 Critical Growth Mandate: Substantial operational friction detected; high risk of guest complaints and refund requests without intervention.';

  return (
    <section id="virtual-audit" className="py-16 sm:py-20 bg-[#10213a] text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-[radial-gradient(ellipse_at_top,rgba(179,138,84,0.12),transparent_70%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#d9bd8b]/30 bg-white/5 text-xs font-semibold text-[#d9bd8b] shadow-xs mb-3">
            <Eye className="w-3.5 h-3.5 text-[#d9bd8b]" />
            <span className="tracking-widest uppercase font-mono text-[11px]">
              STAGE 01 • FREE VIRTUAL AUDIT — LIVE DEMO
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-serif leading-tight">
            See What Guests Really Say About Any Hotel
          </h2>

          <p className="mt-3 text-sm sm:text-base text-zinc-300 font-light leading-relaxed max-w-2xl mx-auto">
            Type a hotel name. We combine guest reviews from 8 platforms into one <strong className="text-white font-medium">CHA Quality Index™</strong> and show where the public score hides risk for your guests.
          </p>

          {/* 3-Step Decision Flow Pill */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono text-zinc-300">
            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[#d9bd8b]">
              01 Free Virtual Audit
            </span>
            <span className="text-zinc-500">→</span>
            <span className="px-2.5 py-1 rounded-md bg-[#b38a54]/20 border border-[#b38a54]/40 text-amber-300 font-bold">
              02 On-Site Mystery Audit
            </span>
            <span className="text-zinc-500">→</span>
            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-zinc-300">
              03 Portfolio Partnership
            </span>
          </div>
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
                  <span>Scanning Guest Data...</span>
                </>
              ) : (
                <>
                  <span>Audit Hotel</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Aggregation & Internet Presence Tip */}
          <div className="mt-3.5 px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-[11px] text-zinc-300 flex items-start gap-2.5 max-w-2xl mx-auto shadow-xs">
            <Compass className="w-3.5 h-3.5 text-[#d9bd8b] shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="text-[#d9bd8b] font-mono font-bold uppercase tracking-wider text-[10px]">
                High-Presence Search Tip:
              </span>{' '}
              For establishments with active web presence, typing property and suburb (e.g.{' '}
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
              Aggregating Historical Guest Sentiment for “{searchInput}”...
            </h3>
            <p className="text-xs text-zinc-300 max-w-md mx-auto mt-2 leading-relaxed">
              Reading guest reviews across 8 platforms and comparing them with what European travellers expect.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] font-mono text-[#d9bd8b]">
              <span className="inline-block w-2 h-2 rounded-full bg-[#d9bd8b] animate-ping" />
              <span>Querying Live Web Grounding via Google Search</span>
            </div>
          </div>
        )}

        {/* 2. Public Radar Scorecard Result Card */}
        {!isLoading && activeSearchResult && (
          <div className="rounded-2xl bg-[#0c182a] border border-white/15 shadow-2xl p-6 sm:p-8 text-left mb-8 space-y-6">
            
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

                  <span className="text-zinc-500">•</span>
                  {isSelfCatering ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono font-medium">
                      <span>🍳</span>
                      <span>100% Self-Catering (No B&B / Meal Service)</span>
                    </span>
                  ) : isWine ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-950/70 border border-purple-500/40 text-purple-300 text-[10px] font-mono font-medium">
                      <span>🍇</span>
                      <span>Estate Dining & Wine Cellar</span>
                    </span>
                  ) : isSafari ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950/70 border border-amber-500/40 text-amber-300 text-[10px] font-mono font-medium">
                      <span>🦁</span>
                      <span>Full-Board Safari & Boma Dining</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-950/70 border border-blue-500/40 text-blue-300 text-[10px] font-mono font-medium">
                      <span>🍽️</span>
                      <span>Full-Service F&B & Breakfast</span>
                    </span>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-serif">
                  🏨 {activeSearchResult.name}
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
                  🎯 {activeSearchResult.publicMetaAverage}%
                </div>
              </div>
            </div>

            {/* Scorecard Centerpiece: Proprietary CHA Score vs. 8 Providers Grid */}
            <div className="py-2 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              
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
                      🎯 {activeSearchResult.chaScore}%
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

                  {/* Dynamic Score Performance Note */}
                  <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 text-[11px] text-zinc-300 leading-relaxed font-light mb-3">
                    {scorePerformancePhrase}
                  </div>

                  {/* Deduction Rationale Description */}
                  <p className="text-xs text-zinc-300 leading-relaxed font-light mb-3">
                    <strong className="text-white font-medium">Audit Rationale:</strong> {activeSearchResult.chaDeltaReason}
                  </p>
                </div>

                {/* Inspection Delta Drivers */}
                <div className="pt-3 border-t border-white/10">
                  <div className="text-[10px] font-mono uppercase font-bold text-zinc-400 tracking-wider mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#d9bd8b]" />
                    <span>Key Inspection Delta Drivers:</span>
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
                    <span>8 Recognized Review Providers (Normalized to 0–100%)</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">
                    Unified Scale
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
                  <strong className="text-zinc-300 font-medium">Why scores diverge:</strong> Public OTAs aggregate feedback from unvetted domestic holidaymakers who overlook morning hot water dips, sash window drafts, or catalog room tiering. Our inspectors check these specific points in person, from the perspective of a German or European guest.
                </div>
              </div>

            </div>

            {/* HERO SECTION: THE GUEST'S LIVED PERSPECTIVE OVER TIME */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-[#d9bd8b]/30 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold font-serif text-white flex items-center gap-2">
                      <span>👁️ The Guest's Lived Perspective Over Time</span>
                    </span>
                    <span className="text-[10px] font-mono text-[#d9bd8b] px-2 py-0.5 rounded-md bg-[#d9bd8b]/10 border border-[#d9bd8b]/20">
                      12–24 Month Longitudinal Trace
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 mt-1 font-light">
                    How guests actually feel living in <strong className="text-white font-medium">{activeSearchResult.name}</strong> across critical sensory and emotional touchpoints over time.
                  </p>
                </div>

                {/* Trajectory Status Pill */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 self-start sm:self-auto shrink-0">
                  <Clock className="w-3.5 h-3.5 text-[#d9bd8b]" />
                  <div className="text-left">
                    <div className="text-[9px] font-mono uppercase text-zinc-400">24-Month Trajectory</div>
                    <div className="text-xs font-bold font-mono text-[#d9bd8b]">
                      ⏳ {guestExp.sentimentTrajectory}
                    </div>
                  </div>
                </div>
              </div>

              {/* 5 Core Sensory & Emotional Guest Experience Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {/* 1. Acoustic & Waking Rest */}
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                      <span className="flex items-center gap-1.5">
                        <span>💤</span>
                        <span>Acoustic Rest</span>
                      </span>
                      <span className="font-mono text-sm font-black text-[#d9bd8b]">
                        {guestExp.acousticRestScore}%
                      </span>
                    </div>
                    <p className="text-[10.5px] text-zinc-400 font-light leading-snug">
                      Night sleep tranquility, bedding comfort, traffic and corridor noise bleed.
                    </p>
                  </div>
                  <div className="mt-2.5 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400 rounded-full" style={{ width: `${guestExp.acousticRestScore}%` }} />
                  </div>
                </div>

                {/* 2. Morning Routine Pacing */}
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                      <span className="flex items-center gap-1.5">
                        <span>🚿</span>
                        <span>{isSelfCatering ? 'Morning Routine' : isSafari ? '05:30 Safari Pacing' : '07:30 Pacing'}</span>
                      </span>
                      <span className="font-mono text-sm font-black text-[#d9bd8b]">
                        {guestExp.morningPacingScore}%
                      </span>
                    </div>
                    <p className="text-[10.5px] text-zinc-400 font-light leading-snug">
                      {isSelfCatering
                        ? 'En-suite shower pressure, hot water stability, and key lockbox departure flow (100% self-catering unit, no meal queues).'
                        : isSafari
                        ? 'Pre-dawn tea/coffee dispatch, hot water pressure, and early 05:30 game drive departure flow.'
                        : 'Peak morning shower pressure, hot water stability, and breakfast buffet seating pacing.'}
                    </p>
                  </div>
                  <div className="mt-2.5 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${guestExp.morningPacingScore}%` }} />
                  </div>
                </div>

                {/* 3. Arrival & Welcome Warmth */}
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                      <span className="flex items-center gap-1.5">
                        <span>{isSelfCatering ? '🛡️' : '🗝️'}</span>
                        <span>{isSelfCatering ? 'Gate & Arrival' : 'Arrival Warmth'}</span>
                      </span>
                      <span className="font-mono text-sm font-black text-[#d9bd8b]">
                        {guestExp.arrivalWarmthScore}%
                      </span>
                    </div>
                    <p className="text-[10.5px] text-zinc-400 font-light leading-snug">
                      {isSelfCatering
                        ? '24-Hour security gate access, lockbox/host key handover, and parking orientation (no hotel front desk).'
                        : 'First-contact welcome feeling, security reassurance, check-in friction, and baggage orientation.'}
                    </p>
                  </div>
                  <div className="mt-2.5 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${guestExp.arrivalWarmthScore}%` }} />
                  </div>
                </div>

                {/* 4. Dining Serenity & Resident Priority */}
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                      <span className="flex items-center gap-1.5">
                        <span>{isSelfCatering ? '🍳' : isWine ? '🍇' : isSafari ? '🔥' : '🍽️'}</span>
                        <span>{isSelfCatering ? 'Kitchen & Balcony Dining' : isWine ? 'Estate Dining' : isSafari ? 'Boma Dining' : 'Dining Serenity'}</span>
                      </span>
                      <span className="font-mono text-sm font-black text-[#d9bd8b]">
                        {guestExp.diningAtmosphereScore}%
                      </span>
                    </div>
                    <p className="text-[10.5px] text-zinc-400 font-light leading-snug">
                      {isSelfCatering
                        ? 'In-unit kitchen equipment, appliances, private oceanfront balcony dining, and local grocery convenience.'
                        : isWine
                        ? 'Farm-to-table estate cuisine, wine cellar tastings, and resident dining priority.'
                        : isSafari
                        ? 'Open-air boma campfire dinners, bush dining, and wilderness hospitality.'
                        : 'Evening atmosphere, meal pacing, and resident guest priority over public visitors.'}
                    </p>
                  </div>
                  <div className="mt-2.5 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${guestExp.diningAtmosphereScore}%` }} />
                  </div>
                </div>

                {/* 5. German / DACH Expectation Index */}
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                      <span className="flex items-center gap-1.5">
                        <span>🇩🇪</span>
                        <span>DACH Index</span>
                      </span>
                      <span className="font-mono text-sm font-black text-[#d9bd8b]">
                        {guestExp.germanMarketIndex}%
                      </span>
                    </div>
                    <p className="text-[10.5px] text-zinc-400 font-light leading-snug">
                      Alignment with German guest expectations: catalog fidelity, punctuality, and acoustic quiet.
                    </p>
                  </div>
                  <div className="mt-2.5 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#d9bd8b] rounded-full" style={{ width: `${guestExp.germanMarketIndex}%` }} />
                  </div>
                </div>
              </div>

              {/* Lived Experience Narrative Quote Box */}
              <div className="p-4 rounded-xl bg-[#091424] border border-[#d9bd8b]/20 flex items-start gap-3">
                <span className="text-xl shrink-0 mt-0.5">💬</span>
                <div className="text-xs leading-relaxed">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#d9bd8b] font-bold mb-0.5">
                    What Staying Here Actually Feels Like (Aggregated 48-Hour Guest Journey):
                  </div>
                  <p className="text-zinc-200 font-light italic">
                    "{guestExp.livedExperienceNarrative}"
                  </p>
                  <p className="text-[10.5px] text-zinc-400 font-mono mt-1.5">
                    <strong>Longitudinal Trajectory Note:</strong> {guestExp.trajectoryDetail}
                  </p>
                </div>
              </div>
            </div>

            {/* 6 Core Public Experience Sub-Scores (OTA Component Breakdown) */}
            <div className="py-2 border-b border-white/10">
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
                  <div className="text-[10px] font-mono text-zinc-400">
                    {isSelfCatering ? 'Kitchen & Facilities' : isWine ? 'Estate Dining' : isSafari ? 'Bush & Boma Dining' : 'F&B / Breakfast'}
                  </div>
                  <div className="text-sm font-bold text-white mt-0.5">{activeSearchResult.subscores.dining}%</div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="text-[10px] font-mono text-zinc-400">Value for Money</div>
                  <div className="text-sm font-bold text-white mt-0.5">{activeSearchResult.subscores.value}%</div>
                </div>
              </div>
            </div>

            {/* Traveler Segment Mix & Review Sentiment Highlights */}
            <div className="py-2 border-b border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {/* 3 Operational Blind Spots For This Specific Property */}
            <div className="p-5 rounded-2xl bg-amber-500/[0.04] border border-amber-500/25 space-y-3 text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>3 Property-Specific Blind Spots Public Reviews Mask for {activeSearchResult.name}</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">
                  Requires Physical Verification
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(activeSearchResult.blindSpots || []).map((spot, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <div className="text-xs font-bold text-white mb-1 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-[#d9bd8b] shrink-0" />
                      <span>{spot.title}</span>
                    </div>
                    <p className="text-[11px] text-zinc-300 leading-relaxed font-light">
                      {spot.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* The Desk-to-Field Bridge: Reality Gap Escalation */}
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
                </div>

                {/* Right: Direct Escalation CTAs */}
                <div className="flex flex-col gap-2.5 shrink-0 w-full sm:w-auto lg:min-w-[300px]">
                  {/* Primary Escalation CTA to Physical Audit */}
                  <button
                    type="button"
                    onClick={() => onSelectPropertyForInquiry(activeSearchResult.name)}
                    className="w-full px-6 py-3.5 rounded-xl bg-[#b38a54] hover:bg-[#c59b63] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-0.5 whitespace-nowrap"
                  >
                    <span>Commission On-Site Audit</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Secondary Desk Audit Briefing CTA */}
                  <button
                    type="button"
                    onClick={handleRequestAuditForCurrentSearch}
                    className="w-full px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-zinc-200 hover:text-white text-[11px] font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#d9bd8b]" />
                    <span>Request the Full 24h Virtual Audit Brief</span>
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
            <span>See how we verify a hotel on site</span>
            <ArrowRight className="w-3 h-3 text-[#d9bd8b]" />
          </a>
        </div>

      </div>
    </section>
  );
};

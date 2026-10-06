import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  Lock,
} from 'lucide-react';

export interface AuditPreset {
  id: string;
  name: string;
  archetypeLabel: string;
  location: string;
  officialStars: number;
  experienceScore: number;
  status: 'optimal' | 'advisory' | 'attention';
  statusText: string;
  headline: string;
  categories: {
    name: string;
    score: number;
    benchmark: number;
    status: 'pass' | 'warning' | 'alert';
    finding: string;
  }[];
  observe: string;
  assess: string;
  recommend: string;
}

const AUDIT_PRESETS: AuditPreset[] = [
  {
    id: 'waterfront-landmark',
    name: 'Waterfront Architectural Landmark Asset',
    archetypeLabel: '5-Star Contemporary Urban Luxury Archetype',
    location: 'V&A Waterfront Corridor, Cape Town',
    officialStars: 5,
    experienceScore: 92,
    status: 'optimal',
    statusText: 'High Standard • Minor Noise Advisory',
    headline: 'Celebrated contemporary luxury design with exceptional service flow; occasional harbor acoustics.',
    categories: [
      {
        name: 'Hygiene & Housekeeping Precision',
        score: 96,
        benchmark: 90,
        status: 'pass',
        finding: 'Flawless bathroom and linen inspection. Luminescence and turn-down execution top-tier.',
      },
      {
        name: 'Acoustic Comfort & Sleep Quality',
        score: 84,
        benchmark: 90,
        status: 'warning',
        finding: 'Lower-floor harbor-facing suites experience low-frequency hum from maritime harbor and rooftop elevator traffic.',
      },
      {
        name: 'Punctuality & Arrival Efficiency',
        score: 95,
        benchmark: 88,
        status: 'pass',
        finding: 'Private check-in seated within 3 minutes; luggage delivery under 4 minutes to suite.',
      },
      {
        name: 'Breakfast & F&B Quality Consistency',
        score: 93,
        benchmark: 88,
        status: 'pass',
        finding: 'Artisanal à la carte presentation; consistent barista coffee and fresh local produce.',
      },
      {
        name: 'Facility Upkeep vs 5-Star Promise',
        score: 94,
        benchmark: 92,
        status: 'pass',
        finding: 'Pillowed glass architectural facade meticulously maintained; elevator responsiveness excellent.',
      },
    ],
    observe: 'Exemplary service delivery and high-end design. Noticeable weekend acoustic hum on harbor-facing lower suites during maritime vessel maneuvers.',
    assess: 'German luxury clients will praise the aesthetic and dining, but sound-sensitive clients in standard suite categories may note weekend morning harbor acoustics.',
    recommend: 'Request upper-floor suites for German clients prioritizing sleep tranquility. Note harbor proximity transparently in itinerary notes.',
  },
  {
    id: 'heritage-grand',
    name: 'Colonial Heritage Grand Estate',
    archetypeLabel: '5-Star Historic Prestige Archetype',
    location: 'Gardens District, Cape Town',
    officialStars: 5,
    experienceScore: 81,
    status: 'advisory',
    statusText: 'Advisory Warning • Infrastructure Aging',
    headline: 'Historic charm retains prestige, but legacy plumbing and air conditioning lag behind 5-star expectations.',
    categories: [
      {
        name: 'Hygiene & Housekeeping Precision',
        score: 87,
        benchmark: 90,
        status: 'warning',
        finding: 'Cleanliness is well-maintained, but antique tile grout in historical wing bathrooms shows moisture staining.',
      },
      {
        name: 'Acoustic Comfort & Sleep Quality',
        score: 78,
        benchmark: 90,
        status: 'alert',
        finding: 'Older sash windows permit perimeter traffic noise; bedroom air conditioning units produce an audible cycling rattle.',
      },
      {
        name: 'Punctuality & Arrival Efficiency',
        score: 85,
        benchmark: 88,
        status: 'warning',
        finding: 'Afternoon tea rush causes 12-minute reception queue during simultaneous group tour arrivals.',
      },
      {
        name: 'Breakfast & F&B Quality Consistency',
        score: 88,
        benchmark: 88,
        status: 'pass',
        finding: 'Buffet presentation is generous and traditional; hot egg orders took 18 minutes during peak 08:30 rush.',
      },
      {
        name: 'Facility Upkeep vs 5-Star Promise',
        score: 79,
        benchmark: 92,
        status: 'alert',
        finding: 'A 5-star facade masking legacy hot water delivery systems with noticeable morning temperature fluctuations.',
      },
    ],
    observe: 'High brand name recognition and stunning grounds, but mechanical infrastructure in historical wing has deteriorated over the past 24 months.',
    assess: 'German guests who paid €550+/night expect instant water temperature stability and silent climate control. High risk of post-trip catalog complaint.',
    recommend: 'Mandate modern garden-wing allocations for your bookings; seek written guarantee from hotel management regarding room category renovation status.',
  },
  {
    id: 'oceanfront-boutique',
    name: 'Atlantic Coastal Luxury Boutique',
    archetypeLabel: '5-Star Oceanfront Boutique Archetype',
    location: 'Camps Bay Corridor, Cape Town',
    officialStars: 5,
    experienceScore: 76,
    status: 'attention',
    statusText: 'Critical Attention • Experience Discrepancy',
    headline: 'Breathtaking ocean views compromised by seasonal service bottlenecks and maintenance delays.',
    categories: [
      {
        name: 'Hygiene & Housekeeping Precision',
        score: 82,
        benchmark: 90,
        status: 'warning',
        finding: 'Balcony salt mist accumulation not cleared prior to 15:00 check-in; sea-facing glass doors stiff to slide.',
      },
      {
        name: 'Acoustic Comfort & Sleep Quality',
        score: 72,
        benchmark: 90,
        status: 'alert',
        finding: 'Sunset terrace cocktail music reverberates directly into sea-facing master suites until 23:30 on weekends.',
      },
      {
        name: 'Punctuality & Arrival Efficiency',
        score: 79,
        benchmark: 88,
        status: 'alert',
        finding: 'Valet parking bottleneck during high season; room keys delayed 25 minutes past published check-in hour.',
      },
      {
        name: 'Breakfast & F&B Quality Consistency',
        score: 86,
        benchmark: 88,
        status: 'warning',
        finding: 'Scenic terrace breakfast overwhelmed on clear mornings; 22-minute wait for barista coffee.',
      },
      {
        name: 'Facility Upkeep vs 5-Star Promise',
        score: 74,
        benchmark: 92,
        status: 'alert',
        finding: 'Plunge pool heater offline; sea spray corrosion visible on suite fixtures.',
      },
    ],
    observe: 'Spectacular sunset location, but chronic seasonal understaffing leads to service bottlenecks and late room handovers.',
    assess: 'Discerning European travelers booking luxury beach suites will feel shortchanged by late room readiness and terrace noise.',
    recommend: 'Request rear quiet mountain suites for early-to-bed travelers. Contract explicit check-in priority clauses for European arrivals.',
  },
  {
    id: 'wine-estate',
    name: 'Historic Wine Valley Estate & Spa',
    archetypeLabel: '5-Star Winelands Country Archetype',
    location: 'Franschhoek / Stellenbosch Valley Corridor',
    officialStars: 5,
    experienceScore: 89,
    status: 'optimal',
    statusText: 'Optimal Standard • Strong Dining Flow',
    headline: 'World-class gastronomy and vineyard tranquility; minor transfer pacing during peak harvest.',
    categories: [
      {
        name: 'Hygiene & Housekeeping Precision',
        score: 94,
        benchmark: 90,
        status: 'pass',
        finding: 'Immaculate country manor suite presentation; wood-burning fireplaces pre-laid and spotless.',
      },
      {
        name: 'Acoustic Comfort & Sleep Quality',
        score: 93,
        benchmark: 90,
        status: 'pass',
        finding: 'Deep country silence; zero night vehicle traffic. Estate irrigation timed away from bedroom hours.',
      },
      {
        name: 'Punctuality & Arrival Efficiency',
        score: 88,
        benchmark: 88,
        status: 'pass',
        finding: 'Estate concierge welcome seamless; internal buggy transfers took 8 minutes during cellar tour changeover.',
      },
      {
        name: 'Breakfast & F&B Quality Consistency',
        score: 95,
        benchmark: 88,
        status: 'pass',
        finding: 'Benchmark wine estate culinary execution; farm-to-table breakfast exemplary.',
      },
      {
        name: 'Facility Upkeep vs 5-Star Promise',
        score: 91,
        benchmark: 92,
        status: 'warning',
        finding: 'Spa vitality pool under routine maintenance; manicured gardens and manor house in pristine state.',
      },
    ],
    observe: 'Remarkable tranquility and benchmark dining standards. Minor estate buggy delay during wedding and harvest events.',
    assess: 'Delivers completely on European catalog promises. High client satisfaction and zero catalog liability risk.',
    recommend: 'An exceptional anchor property for premium itineraries. Pre-book spa and estate dining 14 days prior to arrival.',
  },
  {
    id: 'coastal-safari',
    name: 'Coastal Wilderness & Marine Eco-Lodge',
    archetypeLabel: '5-Star Coastal Eco-Lodge Archetype',
    location: 'Plettenberg Bay / Garden Route Coastal Corridor',
    officialStars: 5,
    experienceScore: 85,
    status: 'advisory',
    statusText: 'Advisory Warning • Backup Power Logistics',
    headline: 'Superb marine cliff views; generator placement audible in south-facing ocean suites.',
    categories: [
      {
        name: 'Hygiene & Housekeeping Precision',
        score: 91,
        benchmark: 90,
        status: 'pass',
        finding: 'Very high standards of bedroom and bathroom maintenance; beach amenities and footwear setup pristine.',
      },
      {
        name: 'Acoustic Comfort & Sleep Quality',
        score: 80,
        benchmark: 90,
        status: 'warning',
        finding: 'Automated municipal backup diesel generator kicks in with noticeable low hum in south suites.',
      },
      {
        name: 'Punctuality & Arrival Efficiency',
        score: 87,
        benchmark: 88,
        status: 'pass',
        finding: 'Valet and check-in prompt; attentive greeting by resident lodge manager.',
      },
      {
        name: 'Breakfast & F&B Quality Consistency',
        score: 90,
        benchmark: 88,
        status: 'pass',
        finding: 'Fresh seafood emphasis; continental breakfast selection matches European expectations.',
      },
      {
        name: 'Facility Upkeep vs 5-Star Promise',
        score: 84,
        benchmark: 92,
        status: 'warning',
        finding: 'Coastal wooden decking requires seasonal resurfacing; access track requires careful driving.',
      },
    ],
    observe: 'A genuine jewel on the Garden Route coastline. Main operational flaw is generator acoustic baffling during regional power fluctuations.',
    assess: 'Solid 5-star guest experience for 90% of the stay. Sound-sensitive German guests during storm periods note generator hum.',
    recommend: 'Contract specifically for North-facing Cliff Suites to isolate guests from mechanical plant noise.',
  },
];

interface AgentVirtualAuditProps {
  onSelectPropertyForInquiry: (propertyName: string) => void;
  onRequestFreeDataPackage: () => void;
}

export const AgentVirtualAudit: React.FC<AgentVirtualAuditProps> = ({
  onSelectPropertyForInquiry,
  onRequestFreeDataPackage,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('heritage-grand');
  const currentPreset = AUDIT_PRESETS.find((p) => p.id === selectedPresetId) || AUDIT_PRESETS[1];

  return (
    <section id="virtual-audit" className="py-16 sm:py-24 bg-[#10213a] text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-[radial-gradient(ellipse_at_top,rgba(179,138,84,0.12),transparent_70%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#d9bd8b]/30 bg-white/5 text-xs font-semibold text-[#d9bd8b] shadow-xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#d9bd8b]" />
            <span className="tracking-widest uppercase font-mono text-[11px]">
              STAGE 01 • 24-HOUR VIRTUAL DESK RADAR
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-serif leading-tight">
            Desk-Based Quality Audits (5 Regional Archetypes)
          </h2>

          <p className="mt-3 text-sm sm:text-base text-zinc-300 font-light leading-relaxed max-w-2xl mx-auto">
            Before committing client bookings or sending an inspector, submit any hotel for a 24-hour desk audit. We analyze recent verified European guest signals against German catalog criteria (DRV benchmarks).
          </p>

          <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-zinc-300">
            <Lock className="w-3.5 h-3.5 text-[#d9bd8b]" />
            <span>Simulated demonstration archetypes • Strictly confidential under NDA</span>
          </div>
        </div>

        {/* 5 Regional Archetype Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 mb-6">
          {AUDIT_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => setSelectedPresetId(preset.id)}
                className={`p-3 rounded-xl text-left transition-all cursor-pointer border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white/15 border-[#d9bd8b] text-white shadow-md ring-1 ring-[#d9bd8b]/50'
                    : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-1">
                    <span>5★ Asset</span>
                    <span className={`px-1.5 py-0.2 rounded font-bold uppercase text-[9px] ${
                      preset.status === 'optimal'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : preset.status === 'advisory'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {preset.experienceScore}/100
                    </span>
                  </div>
                  <div className="font-bold text-xs text-white line-clamp-1 leading-snug">
                    {preset.name}
                  </div>
                  <div className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">
                    {preset.location.split(',')[0]}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Audit Dashboard Card */}
        <div className="rounded-2xl bg-[#0c182a] border border-white/15 shadow-2xl p-6 sm:p-8 text-left">
          
          {/* Top Metadata Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold text-[#d9bd8b] uppercase tracking-wider">
                  Audited Archetype:
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {currentPreset.name}
                </h3>
              </div>
              <p className="text-xs text-zinc-300 mt-1 font-light">
                {currentPreset.location} • <span className="italic text-[#d9bd8b]">{currentPreset.headline}</span>
              </p>
            </div>

            {/* Score Comparison Display */}
            <div className="flex items-center gap-3 bg-white/5 px-3.5 py-2.5 rounded-xl border border-white/10 shrink-0 self-start sm:self-auto">
              <div className="text-center pr-3 border-r border-white/10">
                <div className="text-[9px] font-mono text-zinc-400 uppercase">Official Status</div>
                <div className="text-xs font-bold text-zinc-200 mt-0.5">5-Star Council</div>
              </div>

              <div className="text-center pl-1">
                <div className="text-[9px] font-mono text-[#d9bd8b] uppercase font-bold">
                  Experience Reality
                </div>
                <div className={`text-xl font-black font-mono tracking-tight ${
                  currentPreset.status === 'optimal'
                    ? 'text-emerald-400'
                    : currentPreset.status === 'advisory'
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}>
                  {currentPreset.experienceScore}<span className="text-xs text-zinc-400">/100</span>
                </div>
              </div>
            </div>
          </div>

          {/* 5 Checkpoints Grid */}
          <div className="py-5 grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {currentPreset.categories.map((cat, idx) => {
              const isPass = cat.status === 'pass';
              const isWarning = cat.status === 'warning';

              return (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white/[0.03] border border-white/10"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-semibold text-white">
                      {cat.name}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      isPass
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : isWarning
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {cat.score}% (Std {cat.benchmark}%)
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-300 leading-relaxed font-light">
                    {cat.finding}
                  </p>
                </div>
              );
            })}
          </div>

          {/* 3 Core Mandates: We Observe, We Assess Risk, We Recommend */}
          <div className="pt-5 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
            {/* 1. We Observe */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[11px] font-mono font-bold text-zinc-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d9bd8b]" />
                <span>1. We Observe</span>
              </div>
              <p className="text-[11px] text-zinc-300 leading-relaxed">
                {currentPreset.observe}
              </p>
            </div>

            {/* 2. We Assess Risk */}
            <div className="p-3.5 rounded-xl bg-amber-500/[0.04] border border-amber-500/20">
              <div className="text-[11px] font-mono font-bold text-amber-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>2. We Assess Risk</span>
              </div>
              <p className="text-[11px] text-zinc-300 leading-relaxed">
                {currentPreset.assess}
              </p>
            </div>

            {/* 3. We Recommend */}
            <div className="p-3.5 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/20">
              <div className="text-[11px] font-mono font-bold text-emerald-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>3. We Recommend</span>
              </div>
              <p className="text-[11px] text-zinc-300 leading-relaxed">
                {currentPreset.recommend}
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] text-zinc-400 font-mono">
              Have a hotel on your books? We deliver a bespoke 2-page brief in 24 hours.
            </span>

            <button
              onClick={onRequestFreeDataPackage}
              className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#b38a54] hover:bg-[#c59b63] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Request Free 24h Virtual Audit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Clean Link to Stage 02 Below */}
        <div className="mt-8 text-center">
          <a
            href="#sample-audit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono text-zinc-300 hover:text-white transition-all cursor-pointer shadow-xs"
          >
            <span className="text-[#d9bd8b] font-bold">STAGE 02 ↓</span>
            <span>View Actual On-Site Mystery Audit Case Study: The Gardens Heritage Manor</span>
            <ArrowRight className="w-3 h-3 text-[#d9bd8b]" />
          </a>
        </div>

      </div>
    </section>
  );
};

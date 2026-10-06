import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ArrowRight,
  Shield,
  Download,
  Building,
  RefreshCw,
  HelpCircle,
  TrendingDown,
  Info,
  Lock,
  Database
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
        finding: 'Lower-floor harbor-facing suites experience low-frequency hum from working maritime harbor and rooftop elevator traffic.',
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
    assess: 'German guests who paid €550+/night expect instant water temperature stability and silent climate control. High risk of post-trip catalog complaint under standard European travel benchmarks.',
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
        finding: 'Balcony glass salt-film buildup due to coastal winds; bathroom ventilation fan noisy.',
      },
      {
        name: 'Acoustic Comfort & Sleep Quality',
        score: 72,
        benchmark: 90,
        status: 'alert',
        finding: 'Coastal road traffic and beachfront weekend evening venue bass clearly audible in oceanfront suites until 01:30.',
      },
      {
        name: 'Punctuality & Arrival Efficiency',
        score: 76,
        benchmark: 88,
        status: 'alert',
        finding: 'Delayed room handover past 15:30 official check-in time for 3 of 8 monitored arrivals.',
      },
      {
        name: 'Breakfast & F&B Quality Consistency',
        score: 79,
        benchmark: 88,
        status: 'warning',
        finding: 'Breakfast terrace congested; limited staff to handle simultaneous table turnovers.',
      },
      {
        name: 'Facility Upkeep vs 5-Star Promise',
        score: 74,
        benchmark: 92,
        status: 'alert',
        finding: 'Official 5-star grading awarded years ago; property shows clear wear on outdoor deck, pool heating inconsistent.',
      },
    ],
    observe: 'The official 5-star plaque remains on the wall, but recent operational cutbacks have created severe service gaps and unmanaged noise exposure.',
    assess: 'Significant mismatch between brochure promise and current guest reality. German tour operators face acute risk of customer dissatisfaction and refund demands regarding noise and delayed check-ins.',
    recommend: 'Consider shifting allocations to quieter residential alternatives until management resolves staffing and acoustic issues.',
  },
  {
    id: 'winelands-estate',
    name: 'Historic Wine Valley Estate & Spa',
    archetypeLabel: '5-Star Winelands Country Retreat Archetype',
    location: 'Franschhoek Winelands Corridor',
    officialStars: 5,
    experienceScore: 89,
    status: 'optimal',
    statusText: 'Meets Standards • Minor Digital Connectivity Gap',
    headline: 'Exceptional wine country tranquility and cuisine; remote vineyard cottages need Wi-Fi upgrade.',
    categories: [
      {
        name: 'Hygiene & Housekeeping Precision',
        score: 95,
        benchmark: 90,
        status: 'pass',
        finding: 'Spotless estate suites, pristine freestanding baths, and nightly fireplace preparation.',
      },
      {
        name: 'Acoustic Comfort & Sleep Quality',
        score: 96,
        benchmark: 90,
        status: 'pass',
        finding: 'Absolute silence across vineyard grounds. Zero road noise; premium mattresses and acoustic seals.',
      },
      {
        name: 'Punctuality & Arrival Efficiency',
        score: 91,
        benchmark: 88,
        status: 'pass',
        finding: 'Welcoming glass of estate Cap Classique upon arrival; seamless escort to cottage.',
      },
      {
        name: 'Breakfast & F&B Quality Consistency',
        score: 94,
        benchmark: 88,
        status: 'pass',
        finding: 'Farm-to-table breakfast of outstanding quality. Estate preserves, sourdough, and organic eggs.',
      },
      {
        name: 'Facility Upkeep vs 5-Star Promise',
        score: 86,
        benchmark: 92,
        status: 'warning',
        finding: 'Wi-Fi speeds drop to under 5 Mbps in detached garden villas during peak evening hours.',
      },
    ],
    observe: 'Superb hospitality product that completely delivers on the 5-star luxury escapism promise. Isolated Wi-Fi latency in outer vineyard cottages.',
    assess: 'German guests who travel with light business obligations will find internet connectivity frustrating in outer villas, though leisure satisfaction remains near 95%.',
    recommend: 'Safe recommendation for high-end German leisure clients. Advise hotel to assign main manor rooms for clients needing stable connectivity.',
  },
  {
    id: 'gardenroute-cliff',
    name: 'Garden Route Coastal Cliffside Lodge',
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
        finding: 'Very high standards of bedroom and bathroom maintenance; beach towels and footwear setup pristine.',
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
    assess: 'Solid 5-star guest experience for 90% of the stay. Sound-sensitive German guests during storm or load shedding periods have noted generator hum.',
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
  const [customInput, setCustomInput] = useState<string>('');
  const [customActiveName, setCustomActiveName] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStepText, setScanStepText] = useState<string>('');
  const [showDataOriginModal, setShowDataOriginModal] = useState<boolean>(false);

  const currentPreset = AUDIT_PRESETS.find((p) => p.id === selectedPresetId) || AUDIT_PRESETS[1];

  const handleSelectPreset = (presetId: string) => {
    if (presetId === selectedPresetId && !customActiveName) return;
    setCustomActiveName('');
    setIsScanning(true);
    setScanStepText('Querying German tour operator benchmark database...');

    setTimeout(() => {
      setScanStepText('Analyzing guest journey touchpoints & review signals...');
    }, 350);

    setTimeout(() => {
      setScanStepText('Cross-referencing room maintenance & acoustic indices...');
    }, 700);

    setTimeout(() => {
      setSelectedPresetId(presetId);
      setIsScanning(false);
      setScanStepText('');
    }, 1000);
  };

  const handleCustomSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    const searchedName = customInput.trim();
    setIsScanning(true);
    setScanStepText(`Initializing Agent Virtual Audit for "${searchedName}"...`);

    setTimeout(() => {
      setScanStepText('Filtering review signals against German catalog criteria (DRV standards)...');
    }, 400);

    setTimeout(() => {
      setScanStepText('Synthesizing observation, assessment & recommendation...');
    }, 850);

    setTimeout(() => {
      setCustomActiveName(searchedName);
      setSelectedPresetId('oceanfront-boutique');
      setIsScanning(false);
      setScanStepText('');
    }, 1250);
  };

  return (
    <section id="virtual-audit" className="py-20 sm:py-28 bg-[#10213a] text-white relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-[radial-gradient(ellipse_at_top,rgba(179,138,84,0.15),transparent_70%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#d9bd8b]/30 bg-white/5 text-xs font-semibold text-[#d9bd8b] shadow-xs mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#d9bd8b] animate-pulse" />
            <span className="tracking-widest uppercase font-mono text-[11px]">
              STAGE 01 • AGENT VIRTUAL AUDIT RADAR
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-serif leading-tight">
            5 Regional Luxury Archetypes (Based on Virtual Desk Audits)
          </h2>

          <p className="mt-4 text-base sm:text-lg text-zinc-300 font-light leading-relaxed max-w-2xl mx-auto">
            Before committing client bookings or deploying an on-site inspector, request a Virtual Audit for any hotel on your books — compiled by our Cape Town desk within 24 hours. The 5 showcases below demonstrate our desk-based Virtual Audit methodology. Directly below this section, you can review an actual on-site physical mystery audit conducted in person.
          </p>

          {/* Anonymity & Boundary Clarity Banner */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-zinc-300">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
              <Lock className="w-3.5 h-3.5 text-[#d9bd8b]" />
              <span>Virtual Pre-Audit Archetypes • Based on verified European guest signals</span>
            </span>
            <button
              onClick={() => setShowDataOriginModal(!showDataOriginModal)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-[#d9bd8b]/50 text-[#d9bd8b] hover:text-white cursor-pointer transition-all shadow-xs"
            >
              <Database className="w-3.5 h-3.5 text-[#d9bd8b]" />
              <span className="font-semibold">Data Origin & How It Works</span>
            </button>
          </div>

          {/* Expandable Data Origin Drawer */}
          {showDataOriginModal && (
            <div className="mt-5 p-6 rounded-3xl bg-[#0c182a] border border-[#d9bd8b]/30 text-left max-w-2xl mx-auto shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#d9bd8b]" />
                  <span className="font-mono text-xs font-bold text-[#d9bd8b] uppercase tracking-wider">
                    How We Conduct an Agent Virtual Audit
                  </span>
                </div>
                <button
                  onClick={() => setShowDataOriginModal(false)}
                  className="text-xs text-zinc-400 hover:text-white cursor-pointer px-2 py-1 rounded-md hover:bg-white/5"
                >
                  ✕ Close
                </button>
              </div>

              <div className="space-y-3.5 text-xs text-zinc-200 leading-relaxed font-light">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="font-bold text-white text-xs font-mono uppercase mb-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d9bd8b]" />
                    <span>Desk-Based Quality Analysis (No Big-Data Mystery)</span>
                  </div>
                  <p className="text-zinc-300">
                    When you submit a hotel on your books, you do not receive generic AI-generated fluff. Our Cape Town desk conducts a structured, on-demand quality check using real-world public signals and local intelligence.
                  </p>
                </div>

                <div className="space-y-2 pl-1">
                  <p>
                    <strong className="text-white font-medium">1. European & German Guest Review Filtering:</strong> We analyze the hotel's latest 30–50 verified public reviews (Google, Booking.com, TripAdvisor), specifically isolating feedback from German and European holidaymakers searching for chronic friction points: noise, bathroom mold, water pressure, and breakfast delays.
                  </p>
                  <p>
                    <strong className="text-white font-medium">2. German Tour Operator Standards:</strong> We map the findings against European catalog expectations (such as DRV standards and Frankfurt Table defect classifications) to determine whether the hotel delivers on its brochure promises.
                  </p>
                  <p>
                    <strong className="text-white font-medium">3. Regional Western Cape Reality:</strong> We factor in local ground realities—generator noise during load shedding, coastal wind wear, and seasonal staffing bottlenecks.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#b38a54]/10 border border-[#b38a54]/20 text-[11px] text-zinc-300 font-mono">
                  <strong className="text-[#d9bd8b] block mb-0.5">The Bridge to the Physical Audit:</strong>
                  The Virtual Audit serves as an instant radar. If our desk check identifies emerging operational decay, we dispatch our local inspector for an anonymous, physical on-site mystery stay to verify the facts before your guests arrive.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Interactive Property Archetype Selector */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
              Select an Anonymized Regional Archetype (Virtual Pre-Audit):
            </span>
            <span className="text-[11px] font-mono text-[#d9bd8b]">
              Strict Client Non-Disclosure Standard
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {AUDIT_PRESETS.map((preset) => {
              const isSelected = selectedPresetId === preset.id && !customActiveName;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset.id)}
                  className={`p-3.5 rounded-2xl text-left transition-all cursor-pointer border flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white/15 border-[#d9bd8b] text-white shadow-lg ring-1 ring-[#d9bd8b]/50 -translate-y-0.5'
                      : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-1.5">
                      <span>{'★'.repeat(preset.officialStars)} Asset</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                        preset.status === 'optimal'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : preset.status === 'advisory'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {preset.experienceScore}/100
                      </span>
                    </div>
                    <div className="font-bold text-xs sm:text-sm text-white line-clamp-1 leading-snug">
                      {preset.name}
                    </div>
                    <div className="text-[10px] text-[#d9bd8b] line-clamp-1 mt-0.5 font-mono">
                      {preset.archetypeLabel.split('•')[0]}
                    </div>
                    <div className="text-[10px] text-zinc-400 line-clamp-1 mt-1">
                      {preset.location}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Custom Search / Request Input */}
          <form onSubmit={handleCustomSearch} className="mt-4 flex items-center gap-2 max-w-xl mx-auto sm:mx-0">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Enter any Cape Town, Winelands, or Garden Route partner hotel..."
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-white/5 border border-white/15 rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:border-[#d9bd8b]"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#b38a54] hover:bg-[#c59b63] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
            >
              <span>Request 24h Virtual Audit</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </form>
        </div>

        {/* Audit Dashboard Card */}
        <div className="rounded-3xl bg-[#0c182a] border border-white/15 shadow-2xl p-6 sm:p-9 relative overflow-hidden text-left">
          
          {/* Scanning Overlay Animation */}
          {isScanning && (
            <div className="absolute inset-0 z-30 bg-[#0c182a]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-150">
              <RefreshCw className="w-8 h-8 text-[#d9bd8b] animate-spin mb-4" />
              <div className="font-serif text-lg font-bold text-white mb-2">
                Running Virtual Quality Audit...
              </div>
              <p className="text-xs font-mono text-[#d9bd8b] animate-pulse">
                {scanStepText}
              </p>
            </div>
          )}

          {/* Top Metadata Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="font-mono text-xs font-bold text-[#d9bd8b] uppercase tracking-wider">
                  Audited Asset:
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {customActiveName ? customActiveName : currentPreset.name}
                </h3>
                <span className="text-xs font-mono text-zinc-400 bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                  {currentPreset.location}
                </span>
                {customActiveName && (
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Custom Partner Simulation
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 mt-1.5 font-light">
                {currentPreset.headline}
              </p>
            </div>

            {/* Score Comparison Display */}
            <div className="flex items-center gap-4 bg-white/5 p-3 sm:p-4 rounded-2xl border border-white/10 shrink-0">
              <div className="text-center pr-3 border-r border-white/10">
                <div className="text-[10px] font-mono text-zinc-400 uppercase">Official Status</div>
                <div className="text-sm font-bold text-zinc-200 mt-0.5">
                  {'★'.repeat(currentPreset.officialStars)} (5-Star)
                </div>
                <div className="text-[9px] text-zinc-400">Formal Grading</div>
              </div>

              <div className="text-center pl-1">
                <div className="text-[10px] font-mono text-[#d9bd8b] uppercase font-bold">
                  Experience Reality
                </div>
                <div className={`text-2xl font-black font-mono tracking-tight ${
                  currentPreset.status === 'optimal'
                    ? 'text-emerald-400'
                    : currentPreset.status === 'advisory'
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}>
                  {currentPreset.experienceScore}<span className="text-xs text-zinc-400">/100</span>
                </div>
                <div className="text-[9px] font-semibold text-zinc-300">
                  {currentPreset.statusText.split('•')[0]}
                </div>
              </div>
            </div>
          </div>

          {/* Central Callout Banner: The Reality Gap */}
          <div className="my-6 p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-[#d9bd8b] flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="text-xs text-zinc-200">
                <span className="font-bold text-white block sm:inline mr-1">
                  “A five-star hotel does not automatically guarantee a five-star guest experience.”
                </span>
                <span className="text-zinc-400">
                  This audit reflects what your European customers will actually encounter today.
                </span>
              </div>
            </div>
            <button
              onClick={onRequestFreeDataPackage}
              className="px-3.5 py-1.5 rounded-full bg-[#d9bd8b] hover:bg-white text-[#10213a] text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
            >
              Get Free Data Package
            </button>
          </div>

          {/* 5 German Tour Operator Benchmark Checkpoints */}
          <div className="space-y-3 mb-8">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#d9bd8b]" />
              <span>Assessment Matrix: German Tour Operator Standards</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentPreset.categories.map((cat, idx) => {
                const isPass = cat.status === 'pass';
                const isWarning = cat.status === 'warning';

                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-bold text-white">
                        {cat.name}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        isPass
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : isWarning
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
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
          </div>

          {/* The 3 Core Mandates: We Observe, We Assess Risk, We Recommend */}
          <div className="pt-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* 1. We Observe */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-[#d9bd8b]" />
                <span>1. We Observe</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {currentPreset.observe}
              </p>
            </div>

            {/* 2. We Assess Risk */}
            <div className="p-4 rounded-2xl bg-white/5 border border-amber-500/30 bg-amber-500/[0.04]">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300 uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>2. We Assess Risk</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {currentPreset.assess}
              </p>
            </div>

            {/* 3. We Recommend */}
            <div className="p-4 rounded-2xl bg-white/5 border border-emerald-500/30 bg-emerald-500/[0.04]">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>3. We Recommend</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {currentPreset.recommend}
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-zinc-400 font-mono flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#d9bd8b]" />
              <span>Independent & current quality perspective • Cape Town to Garden Route</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={onRequestFreeDataPackage}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#d9bd8b]" />
                <span>Get Free Data Package</span>
              </button>

              <button
                onClick={() => onSelectPropertyForInquiry(customActiveName || currentPreset.name)}
                className="flex-1 sm:flex-initial px-6 py-2.5 rounded-full bg-[#b38a54] hover:bg-[#c59b63] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>Commission On-Site Audit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bridge to Physical Audit Directly Below */}
        <div className="mt-8 text-center">
          <a
            href="#sample-audit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono text-zinc-300 hover:text-white transition-all cursor-pointer shadow-xs group"
          >
            <span className="text-[#d9bd8b] font-bold">STAGE 02 ↓</span>
            <span>View Actual On-Site Mystery Audit Case Study: The Gardens Heritage Manor</span>
            <ArrowRight className="w-3 h-3 text-[#d9bd8b] group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

      </div>
    </section>
  );
};

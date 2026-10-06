import React, { useState } from 'react';
import {
  FileText,
  Shield,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Download,
  Eye,
  Camera,
  Activity,
  Calendar,
  UserCheck,
  ChevronRight,
  Printer,
  Copy,
  Check
} from 'lucide-react';

interface PhysicalAuditDossierProps {
  onCommissionAudit: () => void;
  onRequestFreeDataPackage: () => void;
}

export const PhysicalAuditDossier: React.FC<PhysicalAuditDossierProps> = ({
  onCommissionAudit,
  onRequestFreeDataPackage,
}) => {
  const [activeTab, setActiveTab] = useState<'sample' | 'template' | 'workflow'>('sample');
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  const handleCopyTemplate = () => {
    const templateText = `CAPE HOSPITALITY ADVISORS — PHYSICAL AUDIT REPORT (CHA FORM-101)
CONFIDENTIAL EXECUTIVE DOSSIER • PREPARED EXCLUSIVELY FOR TOUR OPERATOR PROCUREMENT
[Property Trade Name Masked by Pseudonym pursuant to POPIA & Non-Disclosure Agreement]

SECTION 1: AUDIT METADATA & FIELD DEPLOYMENT
- Target Property: [Property Pseudonym / Trade Name under NDA]
- Archetype Classification: [e.g. 5-Star Historic Prestige Archetype]
- Location: [Western Cape / Cape Town / Garden Route Corridor]
- Inspection Type: 24-Hour Anonymous Mystery Guest Stay (Single-Blind Deployment)
- Lead Inspector: Senior European Hospitality Inspector (DACH Hospitality Background)
- Virtual Pre-Audit Flag: [Summary of preliminary signals from Google/Booking/HolidayCheck desk review]

SECTION 2: CHRONOLOGICAL FIELD LOG (PHYSICAL TOUCHPOINTS)
1. ARRIVAL & CHECK-IN PACING:
   - Arrival Time: [e.g. 15:15] | Handover Time: [e.g. 15:28] (Benchmark: < 5 mins)
   - Luggage Escort Time: [e.g. 6 mins to room]
   - Observation: [Staff greeting demeanour, baggage handling, welcome beverage]

2. ROOM CONDITION & GUEST COMFORT:
   - Room Category & Wing: [e.g. Garden Suite / Heritage Wing]
   - Bathroom & Cleanliness: Water temperature stability, drainage speed, towel freshness.
   - Night Sleep & Acoustic Comfort: Night noise levels, air conditioning sound, window seals.
   - Lighting & Maintenance: Bedside switches, wardrobe space, turn-down execution.

3. CULINARY & BREAKFAST EXECUTION:
   - Morning Pacing: Table seating delay, order-to-table delivery time [Benchmark: < 12 mins].
   - German Catalog Benchmarks: Coffee temperature, continental variety, egg dish freshness.

SECTION 3: THE 3-STEP EXECUTIVE CONCLUSION
1. WE OBSERVE (The Ground Facts):
   [Chronological field observations with photographic evidence log]

2. WE ASSESS RISK (The Guest Experience & Complaint Risk):
   [Evaluating guest friction, brochure credibility, and complaint risk through the eyes of a paying traveler]

3. WE RECOMMEND (Actionable Solutions):
   [Contract clauses, specific room wing allocations, and hotel management discussion points]`;

    navigator.clipboard.writeText(templateText).then(() => {
      setCopiedTemplate(true);
      setTimeout(() => setCopiedTemplate(false), 2500);
    });
  };

  return (
    <section id="sample-audit" className="py-20 sm:py-28 bg-[#f5f5f3] border-t border-zinc-200/90 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 shadow-xs mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#b38a54]" />
            <span className="tracking-widest uppercase font-mono text-[11px]">
              STAGE 02 • ON-SITE MYSTERY AUDIT CASE STUDY
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#10213a] tracking-tight font-serif leading-tight">
            Actual On-Site Physical Audit: The Gardens Heritage Manor
          </h2>

          <p className="mt-4 text-base sm:text-lg text-zinc-600 font-normal leading-relaxed">
            While the regional archetypes in Stage 1 above demonstrate our desk-based Virtual Audits, below is an actual on-site mystery inspection performed by Cape Hospitality Advisors. This case study details an unannounced overnight stay conducted at an actual 5-star hotel in Cape Town (masked under the property pseudonym <em>“The Gardens Heritage Manor”</em>, classified under our Historic Prestige archetype).
          </p>

          {/* POPIA / Discretion Banner */}
          <div className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-zinc-300 text-xs text-zinc-700 shadow-xs text-left max-w-2xl">
            <Lock className="w-4 h-4 text-[#b38a54] shrink-0" />
            <span className="leading-relaxed">
              <strong>POPIA & Confidentiality Notice:</strong> This is an actual physical audit performed on site by our team. In compliance with the South African Protection of Personal Information Act (POPIA) and bilateral non-disclosure agreements, the real establishment trade name is masked under the property pseudonym <em>“The Gardens Heritage Manor”</em> (classified under our Historic Prestige archetype).
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 rounded-2xl bg-zinc-200/80 border border-zinc-300/80 shadow-xs">
            <button
              onClick={() => setActiveTab('sample')}
              className={`px-5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'sample'
                  ? 'bg-white text-[#10213a] shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Actual Field Audit: The Gardens Heritage Manor
            </button>
            <button
              onClick={() => setActiveTab('workflow')}
              className={`px-5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'workflow'
                  ? 'bg-white text-[#10213a] shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              The 2-Stage Workflow
            </button>
            <button
              onClick={() => setActiveTab('template')}
              className={`px-5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'template'
                  ? 'bg-white text-[#10213a] shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <span>Repeatable Client Template</span>
              <span className="text-[10px] bg-[#b38a54]/10 text-[#9c753e] font-mono px-1.5 py-0.5 rounded">
                Form-101
              </span>
            </button>
          </div>
        </div>

        {/* TAB 1: Actual On-Site Audit Dossier */}
        {activeTab === 'sample' && (
          <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-xl overflow-hidden text-left animate-in fade-in duration-200">
            
            {/* Dossier Header Bar */}
            <div className="bg-[#10213a] text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="font-mono text-[11px] text-[#d9bd8b] tracking-wider uppercase font-semibold">
                    PHYSICAL INSPECTION DOSSIER • REF: CHA-CPT-2026-084
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono px-2.5 py-0.5 rounded border border-emerald-500/30 font-bold uppercase">
                    ACTUAL COMPLETED AUDIT • PROPERTY PSEUDONYM
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                  The Gardens Heritage Manor
                </h3>
                <p className="text-xs text-zinc-300 mt-1.5 flex items-center gap-3 flex-wrap font-light">
                  <span className="text-[#d9bd8b] font-mono text-[11px] font-medium">
                    (Actual 5-Star Hotel • Classified under Historic Prestige Archetype)
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#d9bd8b]" /> Gardens District, Cape Town
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#d9bd8b]" /> 24-Hour Anonymous Overnight Stay
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-[#d9bd8b]" /> European Hospitality Mystery Inspector
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right pr-4 border-r border-white/15">
                  <div className="text-[10px] font-mono uppercase text-zinc-400">Experience Reality</div>
                  <div className="text-2xl font-black font-mono text-amber-400">81<span className="text-xs text-zinc-400">/100</span></div>
                  <div className="text-[10px] text-amber-300 font-medium">Advisory Action Required</div>
                </div>
                <button
                  onClick={onCommissionAudit}
                  className="px-4 py-2 rounded-xl bg-[#b38a54] hover:bg-[#c59b63] text-white text-xs font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap"
                >
                  Commission Similar Audit
                </button>
              </div>
            </div>

            {/* Audit Content Body */}
            <div className="p-6 sm:p-10 space-y-8">
              
              {/* How This Audit Was Triggered (The Virtual Link) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold text-amber-900 uppercase">
                      Case Origin: Triggered by Stage 1 Virtual Pre-Audit Signals
                    </div>
                    <p className="text-xs text-amber-900/90 mt-0.5 leading-relaxed">
                      Prior to deploying an inspector, our Stage 1 Virtual Audit of this property detected recurring guest feedback citing "cold water during morning showers" and "noisy bedroom air conditioning." The tour operator commissioned our team to physically stay at this hotel to verify the facts before committing client bookings.
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-200/60 text-amber-900 text-[11px] font-mono font-bold whitespace-nowrap self-start sm:self-auto">
                  Physical Mystery Check Confirmed Findings
                </span>
              </div>

              {/* Physical Checkpoints Grid */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                  <h4 className="text-sm font-mono font-bold text-[#10213a] uppercase tracking-wider">
                    Physical Field Checkpoints (Eyes & Ears on the Ground)
                  </h4>
                  <span className="text-xs font-mono text-zinc-400">
                    Targeted Testing of Flags from Stage 1
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Point 1: Arrival & Reception */}
                  <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#10213a] flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#b38a54]" />
                        15:15 Check-In Flow & Handover
                      </span>
                      <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                        12 Min Queue (Warning)
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      Only one receptionist staffed during simultaneous 15:00 tour arrival. Inspector waited 12 minutes in the foyer without luggage assistance or seating offered. Welcome drink was delayed; room escort completed at 15:28.
                    </p>
                  </div>

                  {/* Point 2: Night Sleep & AC Noise */}
                  <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#10213a] flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5 text-[#b38a54]" />
                        02:30 Night Sleep Comfort & Noise
                      </span>
                      <span className="text-[10px] font-mono font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                        Audible Rattle (Defect)
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      In Room 114 (Historic East Wing), the bedroom air conditioning unit emitted an annoying, persistent mechanical rattle every few minutes, waking the inspector twice. Switching off the unit resulted in an uncomfortably warm room. At 05:45 AM, older single-glazed sash windows let in perimeter street sweeping sounds.
                    </p>
                  </div>

                  {/* Point 3: Morning Shower & Water Temperature */}
                  <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#10213a] flex items-center gap-2">
                        <Camera className="w-3.5 h-3.5 text-[#b38a54]" />
                        07:15 Morning Shower & Water Pressure
                      </span>
                      <span className="text-[10px] font-mono font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                        Lukewarm Water (Defect)
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      Shower water took over 4 minutes to warm up and turned noticeably lukewarm during the peak 07:15–07:35 morning showering rush. This directly confirmed the complaints reported by German travelers on review portals.
                    </p>
                  </div>

                  {/* Point 4: Breakfast Execution */}
                  <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#10213a] flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#b38a54]" />
                        08:30 F&B Quality & Presentation
                      </span>
                      <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        90% Quality (Pass)
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      Continental breakfast buffet was generous and fresh: artisanal breads, local cheeses, and ripe fruit. The hot egg order took 17 minutes during peak rush, but presentation, coffee quality, and dining room service were attentive.
                    </p>
                  </div>
                </div>
              </div>

              {/* The 3-Step Executive Conclusion */}
              <div className="p-6 sm:p-8 rounded-2xl bg-zinc-50 border border-zinc-200">
                <div className="text-xs font-mono font-bold text-[#b38a54] uppercase tracking-wider mb-4">
                  EXECUTIVE SUMMARY: WE OBSERVE • WE ASSESS RISK • WE RECOMMEND
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Step 1: We Observe */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#10213a] uppercase">
                      <span className="w-2 h-2 rounded-full bg-[#10213a]" />
                      <span>1. We Observe</span>
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      Historic East Wing rooms suffer from persistent AC rattling during the night and unpredictable morning shower water temperatures. The dining and estate grounds are magnificent, but basic sleep and bathroom comfort in legacy rooms fall short of a 5-star experience.
                    </p>
                  </div>

                  {/* Step 2: We Assess Risk */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-800 uppercase">
                      <span className="w-2 h-2 rounded-full bg-amber-600" />
                      <span>2. We Assess Risk</span>
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      From the perspective of a discerning guest paying luxury rates, interrupted night sleep and lukewarm showers represent acute experience failures. There is a very high probability of client frustration, negative post-trip reviews, and catalog refund demands if your clients are allocated to these legacy rooms.
                    </p>
                  </div>

                  {/* Step 3: We Recommend */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-800 uppercase">
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      <span>3. We Recommend</span>
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      Do not cancel your contract with the hotel. Instead, contractually mandate room allocations in the renovated Garden Wing (Rooms 201–224) where AC units and plumbing are modern and quiet. Require written allocation confirmation from the General Manager prior to guest check-in.
                    </p>
                  </div>
                </div>
              </div>

              {/* The Two-Way Shield: Defending Tour Operators Against False & Exaggerated Guest Reviews */}
              <div className="p-6 rounded-2xl bg-[#0c182a] text-white border border-white/10 text-left">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#d9bd8b] mb-1.5">
                  <Shield className="w-4 h-4 text-[#d9bd8b]" />
                  <span>The Two-Way Protection Shield</span>
                </div>
                <h4 className="text-base font-bold font-serif text-white mb-2">
                  Protecting Tour Operators from Bad Actors & Unfounded Compensation Claims
                </h4>
                <p className="text-xs text-zinc-300 leading-relaxed font-light">
                  Our audits protect you on both fronts. When a hotel genuinely underperforms, we alert you so you can mandate room adjustments before your guests arrive. But our audits also provide an indispensable defense against <strong>opportunistic travelers and bad actors</strong> who return home making fabricated or exaggerated complaints to extract 20%–50% post-trip refunds or threaten damaging reviews. With our unannounced, timestamped photographic logs, recorded room decibels, and verified water temperature measurements, your customer care and legal teams possess undeniable ground proof to reject unjustified claims.
                </p>
              </div>

              {/* Download / Action Row */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-200">
                <div className="text-xs font-mono text-zinc-500">
                  Comprehensive physical inspection report with high-resolution photographic appendix available upon request.
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={onRequestFreeDataPackage}
                    className="px-4 py-2.5 rounded-full border border-zinc-300 text-xs font-bold text-zinc-700 hover:bg-zinc-100 transition-all cursor-pointer"
                  >
                    Request Sample PDF
                  </button>
                  <button
                    onClick={onCommissionAudit}
                    className="px-5 py-2.5 rounded-full bg-[#10213a] text-white text-xs font-bold hover:bg-[#1a335a] transition-all cursor-pointer shadow-sm"
                  >
                    Commission Mystery Audit for Your Hotel
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: The 2-Stage Workflow */}
        {activeTab === 'workflow' && (
          <div className="bg-white rounded-3xl border border-zinc-200 p-8 sm:p-12 shadow-sm text-left animate-in fade-in duration-200">
            <h3 className="text-xl font-bold font-serif text-[#10213a] mb-2">
              The Dual-Engine Quality Assurance Model
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 mb-8 max-w-2xl leading-relaxed">
              How European tour operators use Cape Hospitality Advisors to protect their catalog guarantees and client satisfaction across South Africa:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
              {/* Stage 1 */}
              <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 relative space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-[#b38a54] uppercase tracking-wider">
                    STAGE 01 • RAPID RADAR
                  </span>
                  <span className="text-xs font-mono text-zinc-400">Desk-Based (Free)</span>
                </div>
                <h4 className="text-lg font-bold text-[#10213a]">
                  The Agent Virtual Audit
                </h4>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  You give us any hotel on your books. Within 24 hours, our desk aggregates verified German guest sentiment across Google, Booking.com, and HolidayCheck, filtering for chronic catalog failure points (plumbing, noise, delayed check-ins).
                </p>
                <div className="pt-2 text-xs font-mono text-zinc-700 bg-white p-3 rounded-xl border border-zinc-200">
                  <strong>Output:</strong> 2-Page Pre-Audit Risk Brief (*We Observe, We Assess Risk, We Recommend*).
                </div>
              </div>

              {/* Stage 2 */}
              <div className="p-6 rounded-2xl bg-[#10213a] text-white relative space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-[#d9bd8b] uppercase tracking-wider">
                    STAGE 02 • THE PHYSICAL TRUTH
                  </span>
                  <span className="text-xs font-mono text-zinc-400">On-Site Mystery Stay</span>
                </div>
                <h4 className="text-lg font-bold text-white">
                  The On-Site Mystery Inspection (Custom-Calibrated)
                </h4>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  When a virtual check flags operational friction, our Cape Town mystery guest deploys for an anonymous 24–48 hour stay. Crucially, our preliminary virtual audit data directly feeds into the inspector's checklist before arrival. The inspection is never a generic checklist—it is custom-calibrated to physically test and verify that establishment's specific suspected risk areas.
                </p>
                <div className="pt-2 text-xs font-mono text-zinc-200 bg-white/10 p-3 rounded-xl border border-white/10">
                  <strong>Output:</strong> Comprehensive Evidence Dossier with photographic proof & contractual guidance within 48h.
                </div>
              </div>
            </div>

            {/* 4 Strategic Principles from Global Benchmarking */}
            <div className="mt-8 p-6 rounded-2xl bg-zinc-50 border border-zinc-200">
              <div className="text-xs font-mono font-bold text-[#b38a54] uppercase tracking-wider mb-3">
                4 Core Inspection Principles (Benchmarked Against Global Standards)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
                <div className="p-3.5 rounded-xl bg-white border border-zinc-200/80">
                  <div className="text-xs font-bold text-[#10213a] mb-1">1. Conflict-Free Buyer's Agent</div>
                  <p className="text-[11px] text-zinc-600 leading-relaxed font-normal">
                    We work 100% for the travel company. Zero commercial ties or marketing awards sold to audited hotels.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-zinc-200/80">
                  <div className="text-xs font-bold text-[#10213a] mb-1">2. Service Flow &gt; Hardware</div>
                  <p className="text-[11px] text-zinc-600 leading-relaxed font-normal">
                    75% of guest complaints stem from living service breakdowns (reception pacing, breakfast delays, AC noise)—not static plaques.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-zinc-200/80">
                  <div className="text-xs font-bold text-[#10213a] mb-1">3. Hypothesis-Driven Audits</div>
                  <p className="text-[11px] text-zinc-600 leading-relaxed font-normal">
                    Our Stage 1 virtual data custom-calibrates the field checklist so mystery inspectors test the property's specific suspected pain points.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-zinc-200/80">
                  <div className="text-xs font-bold text-[#10213a] mb-1">4. Objective Timings</div>
                  <p className="text-[11px] text-zinc-600 leading-relaxed font-normal">
                    Timestamped operational metrics: check-in queue minutes, luggage speed, order-to-table delivery, and shower consistency.
                  </p>
                </div>
              </div>
            </div>

            {/* The Two-Way Shield: Defending Operators Against Bad-Faith Guest Claims */}
            <div className="mt-6 p-6 rounded-2xl bg-[#0c182a] text-white border border-white/10 text-left">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#d9bd8b] mb-1.5">
                <Shield className="w-4 h-4 text-[#d9bd8b]" />
                <span>The Two-Way Protection Shield</span>
              </div>
              <h4 className="text-base font-bold font-serif text-white mb-2">
                Defending Tour Operators Against False & Exaggerated Guest Reviews
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed font-light">
                Our audits protect you on both fronts. While they alert you when a hotel is genuinely underperforming, they also provide an indispensable defense against <strong>opportunistic travelers and bad actors</strong> who return home making fabricated complaints to extract 20%–50% post-trip refunds. With our unannounced, timestamped photographic logs, recorded water temperatures, and verified service pacing, your customer service and legal teams possess undeniable ground proof to reject unjustified compensation claims.
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs font-mono text-zinc-500">
                “A five-star hotel does not automatically guarantee a five-star guest experience.”
              </span>
              <button
                onClick={onCommissionAudit}
                className="px-6 py-3 rounded-full bg-[#b38a54] text-white text-xs font-bold hover:bg-[#c59b63] transition-all cursor-pointer shadow-sm"
              >
                Start with a Free Virtual Audit Check
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: Repeatable Client Template (CHA Form-101) */}
        {activeTab === 'template' && (
          <div className="bg-white rounded-3xl border border-zinc-200 p-8 sm:p-10 shadow-sm text-left animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-zinc-200">
              <div>
                <span className="text-[11px] font-mono font-bold text-[#b38a54] uppercase tracking-wider">
                  CHA AUDIT PROTOCOL FORM-101
                </span>
                <h3 className="text-xl font-bold font-serif text-[#10213a] mt-0.5">
                  Standardized Physical Audit Inspection Template
                </h3>
                <p className="text-xs text-zinc-600 mt-1">
                  Use this standardized reporting structure for all newly commissioned client audits. Room is provided for preliminary data signals.
                </p>
              </div>

              <button
                onClick={handleCopyTemplate}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 text-white text-xs font-bold hover:bg-zinc-800 transition-all cursor-pointer shadow-xs whitespace-nowrap self-start sm:self-auto"
              >
                {copiedTemplate ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Template Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Blank Template</span>
                  </>
                )}
              </button>
            </div>

            {/* Template Preview Display */}
            <div className="bg-zinc-900 text-zinc-200 rounded-2xl p-6 font-mono text-xs overflow-x-auto leading-relaxed border border-zinc-800 space-y-4">
              <div className="text-emerald-400 font-bold border-b border-zinc-800 pb-2">
                # CAPE HOSPITALITY ADVISORS — PHYSICAL AUDIT REPORT (CHA FORM-101)
                <br /># CONFIDENTIAL EXECUTIVE DOSSIER • PREPARED FOR TOUR OPERATOR PROCUREMENT
                <br /># [Property Trade Name Masked by Pseudonym pursuant to POPIA & Non-Disclosure Agreement]
              </div>

              <div className="space-y-1">
                <span className="text-[#d9bd8b] font-bold">1. AUDIT METADATA & FIELD DEPLOYMENT</span>
                <div className="pl-4 text-zinc-300">
                  • Target Property: [Property Pseudonym / Trade Name under NDA]<br />
                  • Archetype Classification: [e.g. 5-Star Historic Prestige Archetype]<br />
                  • Location: [Western Cape / Cape Town / Garden Route Corridor]<br />
                  • Inspection Type: 24-Hour Anonymous Mystery Guest Stay (Single-Blind)<br />
                  • Virtual Pre-Audit Flag: [Preliminary virtual data directly custom-shapes the inspector's checklist, making the physical audit unique to this establishment]<br />
                  • Lead Inspector: Senior European Hospitality Inspector (DACH Background)
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[#d9bd8b] font-bold">2. CHRONOLOGICAL FIELD LOG (PHYSICAL TOUCHPOINTS)</span>
                <div className="pl-4 text-zinc-300">
                  • Arrival & Check-In: [Queue time, greeting, luggage handover pacing]<br />
                  • Room Condition & Upkeep: [Bathroom water warmth, bed firmness, linen cleanliness score]<br />
                  • Night Sleep & Acoustics: [Air conditioning noise, corridor footsteps, morning street sound]<br />
                  • Morning Routine: [Hot water temperature stability during peak breakfast hours]<br />
                  • Breakfast & Dining: [Table seating delay, order-to-table delivery, coffee freshness]
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[#d9bd8b] font-bold">3. THE 3-STEP EXECUTIVE CONCLUSION</span>
                <div className="pl-4 text-zinc-300">
                  • <strong className="text-white">1. WE OBSERVE:</strong> [Chronological field facts, photographic evidence log]<br />
                  • <strong className="text-white">2. WE ASSESS RISK:</strong> [Evaluating guest friction & catalog complaint risk purely through the eyes of a paying traveler]<br />
                  • <strong className="text-white">3. WE RECOMMEND:</strong> [Room wing contract stipulations, GM discussion points, or alternative bookings]
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500 font-mono">
              <span>Standard operating procedure adheres to DRV European catalog criteria.</span>
              <button
                onClick={onCommissionAudit}
                className="text-[#b38a54] font-bold hover:underline cursor-pointer"
              >
                Commission an on-site audit using this template →
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

import React from 'react';
import {
  Shield,
  Clock,
  MapPin,
  CheckCircle2,
  Lock,
  Camera,
  Activity,
  Calendar,
  UserCheck,
  ArrowRight,
} from 'lucide-react';

interface PhysicalAuditDossierProps {
  onCommissionAudit: () => void;
  onRequestFreeDataPackage: () => void;
}

export const PhysicalAuditDossier: React.FC<PhysicalAuditDossierProps> = ({
  onCommissionAudit,
  onRequestFreeDataPackage,
}) => {
  return (
    <section id="sample-audit" className="py-16 sm:py-24 bg-[#f5f5f3] border-t border-zinc-200/90 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 shadow-xs mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#b38a54]" />
            <span className="tracking-widest uppercase font-mono text-[11px]">
              STAGE 02 • ON-SITE MYSTERY AUDIT CASE STUDY
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#10213a] tracking-tight font-serif leading-tight">
            Actual On-Site Physical Audit: The Gardens Heritage Manor
          </h2>

          <p className="mt-3 text-sm sm:text-base text-zinc-600 font-normal leading-relaxed">
            While Stage 1 above demonstrates our desk-based Virtual Audits, below is an actual on-site mystery inspection performed by Cape Hospitality Advisors. Conducted as an unannounced overnight stay at a 5-star hotel in Cape Town.
          </p>

          {/* POPIA / Discretion Banner */}
          <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-zinc-300 text-xs text-zinc-700 shadow-xs text-left max-w-2xl">
            <Lock className="w-3.5 h-3.5 text-[#b38a54] shrink-0" />
            <span className="text-[11px] leading-relaxed">
              <strong>POPIA & Confidentiality Notice:</strong> In compliance with the South African Protection of Personal Information Act (POPIA) and client non-disclosure agreements, the real establishment trade name is masked under the property pseudonym <em>“The Gardens Heritage Manor”</em>.
            </span>
          </div>
        </div>

        {/* The Executive Dossier Card */}
        <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-lg overflow-hidden text-left">
          
          {/* Dossier Header Bar */}
          <div className="bg-[#10213a] text-white p-5 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-mono text-[10px] text-[#d9bd8b] tracking-wider uppercase font-semibold">
                  PHYSICAL INSPECTION DOSSIER • REF: CHA-CPT-2026-084
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-mono px-2 py-0.2 rounded border border-emerald-500/30 font-bold uppercase">
                  ACTUAL COMPLETED AUDIT
                </span>
              </div>
              <h3 className="text-xl font-serif font-bold text-white">
                The Gardens Heritage Manor
              </h3>
              <p className="text-xs text-zinc-300 mt-1 flex items-center gap-2 flex-wrap font-light">
                <span className="text-[#d9bd8b] font-mono text-[11px]">
                  (5-Star Hotel • Historic Prestige Archetype)
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#d9bd8b]" /> Gardens, Cape Town
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#d9bd8b]" /> 24h Mystery Stay
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <UserCheck className="w-3 h-3 text-[#d9bd8b]" /> European Inspector
                </span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right pr-3 border-r border-white/15">
                <div className="text-[9px] font-mono uppercase text-zinc-400">Experience Reality</div>
                <div className="text-xl font-black font-mono text-amber-400">81<span className="text-xs text-zinc-400">/100</span></div>
              </div>
              <button
                onClick={onCommissionAudit}
                className="px-4 py-2 rounded-xl bg-[#b38a54] hover:bg-[#c59b63] text-white text-xs font-bold transition-all shadow-xs cursor-pointer whitespace-nowrap"
              >
                Commission For Your Hotel
              </button>
            </div>
          </div>

          {/* Dossier Content */}
          <div className="p-5 sm:p-8 space-y-6">
            
            {/* Origin Trigger */}
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 flex items-start gap-3">
              <Activity className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-900 leading-relaxed">
                <strong>Why This Audit Was Commissioned:</strong> Our Stage 1 Virtual Audit of this hotel flagged recurring German guest feedback regarding lukewarm morning showers and rattling bedroom air conditioning. The travel company commissioned our Cape Town team to physically verify the ground reality before contracting.
              </p>
            </div>

            {/* 4 Checkpoints */}
            <div className="space-y-3">
              <div className="text-xs font-mono font-bold text-[#10213a] uppercase tracking-wider">
                Physical Field Findings
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Point 1 */}
                <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-[#10213a] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#b38a54]" />
                      15:15 Check-In Pacing
                    </span>
                    <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                      12 Min Queue
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-600 leading-relaxed">
                    Single receptionist staffed during tour group arrival. 12-minute wait in foyer without luggage escort or seating. Welcome drink delayed.
                  </p>
                </div>

                {/* Point 2 */}
                <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-[#10213a] flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-[#b38a54]" />
                      02:30 AC & Sleep Comfort
                    </span>
                    <span className="text-[10px] font-mono font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                      Audible Rattle (Defect)
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-600 leading-relaxed">
                    Room 114 (Historic East Wing) AC unit produced an audible mechanical rattle every few minutes, disturbing sleep. Older sash windows let in 05:45 street cleaning noise.
                  </p>
                </div>

                {/* Point 3 */}
                <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-[#10213a] flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-[#b38a54]" />
                      07:15 Morning Water Temp
                    </span>
                    <span className="text-[10px] font-mono font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                      Lukewarm (Defect)
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-600 leading-relaxed">
                    Water took 4 minutes to warm up and remained lukewarm during the 07:15–07:35 morning rush. Directly confirmed review complaints.
                  </p>
                </div>

                {/* Point 4 */}
                <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-[#10213a] flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#b38a54]" />
                      08:30 Breakfast Execution
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      90% Quality (Pass)
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-600 leading-relaxed">
                    Buffet was fresh with artisanal breads and local produce. Hot egg order took 17 minutes, but dining room service and coffee quality were attentive.
                  </p>
                </div>
              </div>
            </div>

            {/* 3-Step Summary */}
            <div className="p-4 sm:p-5 rounded-xl bg-zinc-50 border border-zinc-200">
              <div className="text-[11px] font-mono font-bold text-[#b38a54] uppercase tracking-wider mb-3">
                EXECUTIVE SUMMARY: WE OBSERVE • WE ASSESS RISK • WE RECOMMEND
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-xs font-bold text-[#10213a] mb-1">1. We Observe</div>
                  <p className="text-[11px] text-zinc-600 leading-relaxed">
                    Historic East Wing rooms suffer from AC rattling at night and lukewarm morning shower water. Dining and gardens are exemplary, but sleep comfort falls short.
                  </p>
                </div>

                <div>
                  <div className="text-xs font-bold text-amber-800 mb-1">2. We Assess Risk</div>
                  <p className="text-[11px] text-zinc-600 leading-relaxed">
                    High probability of negative reviews and post-trip catalog compensation demands from European travelers if booked into these legacy rooms.
                  </p>
                </div>

                <div>
                  <div className="text-xs font-bold text-emerald-800 mb-1">3. We Recommend</div>
                  <p className="text-[11px] text-zinc-600 leading-relaxed">
                    Do not cancel your contract. Mandate room allocations in the renovated Garden Wing (Rooms 201–224) where AC and plumbing are modern and quiet.
                  </p>
                </div>
              </div>
            </div>

            {/* The Two-Way Shield */}
            <div className="p-4 sm:p-5 rounded-xl bg-[#0c182a] text-white border border-white/10 text-left">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#d9bd8b] mb-1">
                <Shield className="w-3.5 h-3.5 text-[#d9bd8b]" />
                <span>The Two-Way Protection Shield</span>
              </div>
              <h4 className="text-sm font-bold font-serif text-white mb-1.5">
                Protecting Travel Companies from Bad Actors & False Guest Refund Claims
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed font-light">
                Our audits protect you in both directions. When a hotel genuinely underperforms, we alert you so you can fix allocations. But our unannounced, timestamped photos, recorded decibels, and water temperature logs also provide bulletproof evidence for your customer care team to <strong>refute opportunistic bad actors</strong> who submit fabricated complaints to extract 20%–50% post-trip refunds.
              </p>
            </div>

            {/* Action Row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-zinc-200">
              <div className="text-[11px] font-mono text-zinc-500">
                Full 15-page dossier with photographic appendix available on request.
              </div>
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  onClick={onRequestFreeDataPackage}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-full border border-zinc-300 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 transition-all cursor-pointer"
                >
                  Request Sample PDF
                </button>
                <button
                  onClick={onCommissionAudit}
                  className="flex-1 sm:flex-initial px-5 py-2 rounded-full bg-[#10213a] text-white text-xs font-bold hover:bg-[#1a335a] transition-all cursor-pointer shadow-xs"
                >
                  Commission Mystery Audit
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

import React from 'react';
import { ShieldCheck, Eye, AlertTriangle, Compass, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

interface RealityGapSectionProps {
  onExploreVirtualAudit: () => void;
  onRequestFreeDataPackage: () => void;
}

export const RealityGapSection: React.FC<RealityGapSectionProps> = ({
  onExploreVirtualAudit,
  onRequestFreeDataPackage,
}) => {
  return (
    <section id="reality-gap" className="py-20 sm:py-28 bg-[#fbfbfa] border-t border-zinc-200/80 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Core Philosophy Banner */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 shadow-xs mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#b38a54]" />
            <span className="tracking-wider uppercase font-mono text-[11px]">
              THE QUALITY PERSPECTIVE
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#10213a] tracking-tight font-serif leading-tight">
            “A five-star hotel does not automatically guarantee a five-star guest experience.”
          </h2>

          <p className="mt-4 text-base sm:text-lg text-zinc-600 font-normal leading-relaxed">
            This is not about replacing the official grading system. It is about providing an additional, independent and current quality perspective for travel companies that need to know what their customers will actually experience today.
          </p>
        </div>

        {/* 3 Core Operational Pillars: We Observe, We Assess Risk, We Recommend */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Card 1: We Observe */}
          <div className="bg-white rounded-2xl p-7 sm:p-8 border border-zinc-200/90 shadow-sm flex flex-col justify-between hover:border-zinc-300 transition-all text-left">
            <div>
              <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center text-[#10213a] mb-5">
                <Eye className="w-6 h-6 stroke-[2]" />
              </div>
              <span className="text-[11px] font-mono font-bold text-[#b38a54] tracking-widest uppercase">
                Step 01
              </span>
              <h3 className="text-xl font-bold text-[#10213a] mt-1 mb-3">
                We Observe
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
                We look at what is genuinely happening on the ground. Check-in pacing, bathroom cleanliness, acoustic isolation, breakfast execution, and room upkeep. No polite corporate filters—just unvarnished facts.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-zinc-100 text-xs font-mono text-zinc-400">
              ✓ 100% independent observation
            </div>
          </div>

          {/* Card 2: We Assess Risk */}
          <div className="bg-white rounded-2xl p-7 sm:p-8 border border-zinc-200/90 shadow-sm flex flex-col justify-between hover:border-zinc-300 transition-all text-left">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-700 mb-5 border border-amber-500/20">
                <AlertTriangle className="w-6 h-6 stroke-[2]" />
              </div>
              <span className="text-[11px] font-mono font-bold text-[#b38a54] tracking-widest uppercase">
                Step 02
              </span>
              <h3 className="text-xl font-bold text-[#10213a] mt-1 mb-3">
                We Assess Risk
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
                We evaluate how ground findings impact your European guests and catalog promises. We pinpoint where reality deviates from your brochure, flagging chronic complaint triggers and refund risks before travelers check in.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-zinc-100 text-xs font-mono text-zinc-400">
              ✓ German catalog & liability standards
            </div>
          </div>

          {/* Card 3: We Recommend */}
          <div className="bg-white rounded-2xl p-7 sm:p-8 border border-zinc-200/90 shadow-sm flex flex-col justify-between hover:border-zinc-300 transition-all text-left">
            <div>
              <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center text-[#10213a] mb-5">
                <Compass className="w-6 h-6 stroke-[2]" />
              </div>
              <span className="text-[11px] font-mono font-bold text-[#b38a54] tracking-widest uppercase">
                Step 03
              </span>
              <h3 className="text-xl font-bold text-[#10213a] mt-1 mb-3">
                We Recommend
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
                We provide clear, actionable guidance: specific room allocations to request, service points to raise with hotel management, or adjustments needed to safeguard your clients' holiday experience.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-zinc-100 text-xs font-mono text-zinc-400">
              ✓ Actionable operational clarity
            </div>
          </div>
        </div>

        {/* Executive 2-Stage Architecture Bridge */}
        <div className="rounded-3xl bg-[#10213a] text-white p-8 sm:p-10 shadow-lg text-left relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#d9bd8b]">
                <ShieldCheck className="w-4 h-4 text-[#d9bd8b]" />
                <span>The Dual-Engine Model • 24h Radar to 48h Ground Truth</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-bold font-serif text-white">
                From Digital Pre-Audit Radar to Physical Verification on the Ground
              </h4>
              <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed pt-1">
                Official star grading committees award ratings every few years based on structural checklists (room size, elevator counts). We answer the question that protects your brand: <em>What will your client actually experience tomorrow morning?</em>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
              <button
                onClick={onExploreVirtualAudit}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#b38a54] hover:bg-[#c59b63] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Explore Live Demo Archetypes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onRequestFreeDataPackage}
                className="w-full sm:w-auto px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition-all text-center cursor-pointer"
              >
                Request 24h Partner Audit
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

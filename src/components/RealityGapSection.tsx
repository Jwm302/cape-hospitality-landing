import React from 'react';
import { Eye, AlertTriangle, Compass, ArrowRight } from 'lucide-react';

interface RealityGapSectionProps {
  onExploreVirtualAudit: () => void;
  onRequestFreeDataPackage: () => void;
}

export const RealityGapSection: React.FC<RealityGapSectionProps> = ({
  onExploreVirtualAudit,
  onRequestFreeDataPackage,
}) => {
  return (
    <section id="reality-gap" className="py-16 sm:py-20 bg-white border-t border-zinc-200/80 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Core Philosophy Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-200 bg-zinc-50 text-xs font-semibold text-zinc-700 shadow-xs mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#b38a54]" />
            <span className="tracking-wider uppercase font-mono text-[11px]">
              OUR 3-STEP AUDIT METHODOLOGY
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#10213a] tracking-tight font-serif">
            How We Protect Your Bookings & Catalog Reputation
          </h2>

          <p className="mt-3 text-sm sm:text-base text-zinc-600 font-normal leading-relaxed">
            Official star grading committees award ratings every few years based on structural checklists. We answer the question that protects your business: <em>What will your client actually encounter tomorrow morning?</em>
          </p>
        </div>

        {/* 3 Core Operational Pillars: We Observe, We Assess Risk, We Recommend */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {/* Card 1: We Observe */}
          <div className="bg-[#fafafa] rounded-2xl p-6 sm:p-7 border border-zinc-200/90 shadow-xs flex flex-col justify-between hover:border-zinc-300 hover:bg-white transition-all text-left">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-[#10213a] mb-4 shadow-xs">
                <Eye className="w-5 h-5 stroke-[2]" />
              </div>
              <span className="text-[11px] font-mono font-bold text-[#b38a54] tracking-widest uppercase">
                Step 01
              </span>
              <h3 className="text-lg font-bold text-[#10213a] mt-1 mb-2">
                We Observe
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed font-normal">
                Unvarnished ground reality: arrival queue pacing, luggage handover, bathroom cleanliness, night acoustic isolation, and morning shower stability. No polite corporate filters.
              </p>
            </div>
            <div className="pt-4 mt-5 border-t border-zinc-200/60 text-[11px] font-mono text-zinc-400">
              ✓ 100% Conflict-free inspection
            </div>
          </div>

          {/* Card 2: We Assess Risk */}
          <div className="bg-[#fafafa] rounded-2xl p-6 sm:p-7 border border-zinc-200/90 shadow-xs flex flex-col justify-between hover:border-zinc-300 hover:bg-white transition-all text-left">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700 mb-4 shadow-xs">
                <AlertTriangle className="w-5 h-5 stroke-[2]" />
              </div>
              <span className="text-[11px] font-mono font-bold text-[#b38a54] tracking-widest uppercase">
                Step 02
              </span>
              <h3 className="text-lg font-bold text-[#10213a] mt-1 mb-2">
                We Assess Risk
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed font-normal">
                We evaluate where hotel reality contradicts your catalog promise. Crucially, our timestamped data also defends you against bad actors fabricating claims for post-trip refunds.
              </p>
            </div>
            <div className="pt-4 mt-5 border-t border-zinc-200/60 text-[11px] font-mono text-amber-700/80 font-medium">
              ✓ Two-Way Shield & false claim defense
            </div>
          </div>

          {/* Card 3: We Recommend */}
          <div className="bg-[#fafafa] rounded-2xl p-6 sm:p-7 border border-zinc-200/90 shadow-xs flex flex-col justify-between hover:border-zinc-300 hover:bg-white transition-all text-left">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-[#10213a] mb-4 shadow-xs">
                <Compass className="w-5 h-5 stroke-[2]" />
              </div>
              <span className="text-[11px] font-mono font-bold text-[#b38a54] tracking-widest uppercase">
                Step 03
              </span>
              <h3 className="text-lg font-bold text-[#10213a] mt-1 mb-2">
                We Recommend
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed font-normal">
                Actionable solutions: specific quiet room wings to mandate, management negotiation points, or itinerary adjustments to safeguard your clients' experience.
              </p>
            </div>
            <div className="pt-4 mt-5 border-t border-zinc-200/60 text-[11px] font-mono text-zinc-400">
              ✓ Actionable procurement clarity
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

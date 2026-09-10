import React from 'react';
import { ArrowRight, ChevronRight, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';
import { CapeLogo } from './CapeLogo';

interface HeroProps {
  onScheduleBriefing: () => void;
  onViewPricing: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onScheduleBriefing,
  onViewPricing,
}) => {
  return (
    <section className="relative pt-24 sm:pt-28 pb-16 sm:pb-20 overflow-hidden bg-[#fbfbfa]">
      {/* Subtle radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-[radial-gradient(ellipse_at_top,rgba(179,138,84,0.08),transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Prominent Logo at Top of Page as Requested - Just like upload */}
        <div className="w-full max-w-2xl mx-auto mb-10 sm:mb-12">
          <CapeLogo variant="prominent" showTagline={true} />
        </div>

        {/* Clear, Focused Value Statement */}
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#10213a] tracking-tight leading-snug">
            Independent Hotel Quality Inspections Across the Cape, from Cape Town to the Garden Route
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 font-normal leading-relaxed max-w-2xl mx-auto">
            We act as the anonymous on-the-ground eyes and ears for European tour operators and travel brands, ensuring partner properties across the Cape, from Cape Town to the Garden Route, consistently deliver on their promises.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          <button
            onClick={onScheduleBriefing}
            id="hero-primary-cta"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs sm:text-sm font-bold rounded-full bg-[#10213a] text-white hover:bg-[#1a335a] active:scale-[0.98] transition-all duration-200 shadow-md shadow-zinc-300/80 cursor-pointer"
          >
            <span>Schedule Confidential Briefing</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onViewPricing}
            id="hero-secondary-cta"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs sm:text-sm font-semibold rounded-full border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50 active:scale-[0.98] transition-all duration-200 shadow-xs cursor-pointer"
          >
            <span>View Inspection Packages</span>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </button>
        </div>

        {/* 3 Essential Quick Highlights */}
        <div className="mt-12 pt-8 border-t border-zinc-200/80 w-full max-w-3xl grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3 p-3 rounded-xl bg-white border border-zinc-200 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-[#b38a54] shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#10213a]">100% Anonymous</div>
              <div className="text-[11px] text-zinc-500">Unannounced mystery stays</div>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3 p-3 rounded-xl bg-white border border-zinc-200 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-[#b38a54] shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#10213a]">Cape Town Bureau</div>
              <div className="text-[11px] text-zinc-500">On-the-ground presence</div>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3 p-3 rounded-xl bg-white border border-zinc-200 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-[#b38a54] shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#10213a]">48-Hour Turnaround</div>
              <div className="text-[11px] text-zinc-500">Fast, actionable reporting</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

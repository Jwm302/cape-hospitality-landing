import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, MapPin, CheckCircle2, ChevronRight, FileSpreadsheet } from 'lucide-react';
import { CapeLogo } from './CapeLogo';

interface HeroProps {
  onScheduleBriefing: () => void;
  onViewPricing: () => void;
  onExploreVirtualAudit: () => void;
  onRequestFreeDataPackage: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onScheduleBriefing,
  onViewPricing,
  onExploreVirtualAudit,
  onRequestFreeDataPackage,
}) => {
  return (
    <section className="relative pt-24 sm:pt-28 pb-16 sm:pb-20 overflow-hidden bg-[#fbfbfa]">
      {/* Subtle radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[950px] h-[380px] bg-[radial-gradient(ellipse_at_top,rgba(179,138,84,0.09),transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Prominent Brand Logo */}
        <div className="w-full max-w-2xl mx-auto mb-8 sm:mb-10">
          <CapeLogo variant="prominent" showTagline={true} />
        </div>

        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 shadow-xs mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#b38a54]" />
          <span className="tracking-widest uppercase font-mono text-[11px]">
            Independent Hotel Quality Auditing • Western Cape
          </span>
        </div>

        {/* Primary Headline: The Big Reality */}
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#10213a] tracking-tight leading-tight font-serif">
            “A five-star hotel does not automatically guarantee a five-star guest experience.”
          </h1>

          {/* Problem-Solving Subheadline */}
          <p className="text-base sm:text-lg lg:text-xl text-zinc-700 font-normal leading-relaxed max-w-3xl mx-auto pt-2">
            How do you ensure that your customers receive the customer experience you are selling them?
          </p>

          <p className="text-sm sm:text-base text-zinc-600 font-light leading-relaxed max-w-2xl mx-auto">
            This is not about replacing the official grading system. It is about providing an additional, independent and current quality perspective for travel companies that need to know what their customers will actually experience today.
          </p>

          {/* Simple Mission Pill */}
          <div className="pt-2">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200 text-xs font-mono font-medium">
              <span>In simple terms:</span>
              <strong className="text-[#10213a]">we observe, assess and recommend</strong>
              <span>— we do not certify or legally determine compliance.</span>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
          {/* Virtual Audit Callout */}
          <button
            onClick={onExploreVirtualAudit}
            id="hero-primary-cta"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-xs sm:text-sm font-bold rounded-full bg-[#10213a] text-white hover:bg-[#1a335a] active:scale-[0.98] transition-all shadow-md shadow-zinc-300/80 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#d9bd8b]" />
            <span>Try Agent Virtual Audit</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Free Data Package CTA */}
          <button
            onClick={onRequestFreeDataPackage}
            id="hero-free-data-cta"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-xs sm:text-sm font-semibold rounded-full border border-[#b38a54] bg-[#b38a54]/10 text-[#9c753e] hover:bg-[#b38a54] hover:text-white active:scale-[0.98] transition-all shadow-xs cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Get Your Free Data Package Now</span>
          </button>

          {/* Inspection Packages */}
          <button
            onClick={onViewPricing}
            id="hero-secondary-cta"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-medium rounded-full border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 active:scale-[0.98] transition-all shadow-xs cursor-pointer"
          >
            <span>View Services</span>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </button>
        </div>

        {/* 3 Simple, Clear Highlights */}
        <div className="mt-12 pt-8 border-t border-zinc-200/80 w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-zinc-200 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-[#b38a54] shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#10213a]">Current Reality, Not Static Plaques</div>
              <div className="text-[11px] text-zinc-500 leading-snug mt-0.5">What guests experience today, not when the star plaque was issued.</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-zinc-200 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-[#b38a54] shrink-0 mt-0.5">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#10213a]">German Operator Lens</div>
              <div className="text-[11px] text-zinc-500 leading-snug mt-0.5">Evaluated against European standards: acoustics, hygiene, punctuality & service.</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-zinc-200 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-[#b38a54] shrink-0 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#10213a]">Observe, Assess, Recommend</div>
              <div className="text-[11px] text-zinc-500 leading-snug mt-0.5">Actionable advisory to protect your brand before client complaints occur.</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

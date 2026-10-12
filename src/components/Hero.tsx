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
        {/* Brand Logo (the navbar already carries the full lockup) */}
        <div className="w-full mx-auto mb-5 sm:mb-6">
          <CapeLogo variant="prominent" showTagline={true} />
        </div>

        {/* Headline: what we do, for whom, where */}
        <div className="max-w-4xl mx-auto space-y-4">
          <div>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#b38a54]" />
              <span className="tracking-widest uppercase font-serif text-[11px] font-semibold text-zinc-700">
                Independent Hotel Quality Auditing • Western Cape
              </span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#10213a] leading-tight tracking-tight">
            Know what your guests will find, before they arrive.
          </h1>

          <p className="text-base sm:text-lg text-zinc-600 leading-relaxed max-w-2xl mx-auto">
            Independent, anonymous hotel inspections for European travel companies across Cape Town and the Western Cape.
          </p>
        </div>

        {/* Action Buttons: 2 Clear, Focused Choices (Action vs Exploration) */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
          {/* Primary Action: Request 24h Audit */}
          <button
            onClick={onRequestFreeDataPackage}
            id="hero-primary-cta"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs sm:text-sm font-bold rounded-full bg-[#10213a] text-white hover:bg-[#1a335a] active:scale-[0.98] transition-all shadow-md shadow-zinc-300/80 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#d9bd8b]" />
            <span>Request Free Virtual Audit</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Secondary Exploration: Explore Demo & Case Study */}
          <button
            onClick={onExploreVirtualAudit}
            id="hero-secondary-cta"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-xs sm:text-sm font-semibold rounded-full border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 active:scale-[0.98] transition-all shadow-xs cursor-pointer"
          >
            <span>Try the Live Demo</span>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </button>
        </div>

        {/* Attributed quote */}
        <figure className="mt-10 max-w-2xl mx-auto">
          <blockquote className="font-[Georgia,serif] italic text-base sm:text-lg text-zinc-600 leading-relaxed">
            “A five-star hotel does not automatically guarantee a five-star guest experience.”
          </blockquote>
          <figcaption className="mt-1.5 text-[11px] sm:text-xs text-zinc-400">
            — A. Gutman Milne, Library Hotel Collection, New York
          </figcaption>
        </figure>

        {/* 3 Simple, Clear Highlights */}
        <div className="mt-8 pt-8 border-t border-zinc-200/80 w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-zinc-200 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-[#b38a54] shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#10213a]">Today’s Reality, Not Old Star Ratings</div>
              <div className="text-[11px] text-zinc-500 leading-snug mt-0.5">What guests experience now, not when the rating was issued.</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-zinc-200 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-[#b38a54] shrink-0 mt-0.5">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#10213a]">German Travel Company Lens</div>
              <div className="text-[11px] text-zinc-500 leading-snug mt-0.5">Judged on what European guests notice: noise, hygiene, punctuality, service.</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-zinc-200 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-[#b38a54] shrink-0 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#10213a]">On the Ground, Reports in 48h</div>
              <div className="text-[11px] text-zinc-500 leading-snug mt-0.5">Inspectors based in the Western Cape, from Cape Town to the Garden Route.</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

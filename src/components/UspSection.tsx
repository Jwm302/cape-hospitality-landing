import React from 'react';
import { MapPin, Award, Compass, ShieldCheck, Zap, BarChart3, Check, X, Shield, ArrowRight } from 'lucide-react';
import { OUR_USPS } from '../data/landingData';

export const UspSection: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'MapPin':
        return <MapPin className="w-5 h-5 text-[#b38a54]" />;
      case 'Award':
        return <Award className="w-5 h-5 text-[#b38a54]" />;
      case 'Compass':
        return <Compass className="w-5 h-5 text-[#b38a54]" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-[#b38a54]" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-[#b38a54]" />;
      case 'BarChart3':
        return <BarChart3 className="w-5 h-5 text-[#b38a54]" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-[#b38a54]" />;
    }
  };

  return (
    <section id="usp" className="py-16 sm:py-24 bg-white border-t border-zinc-200/80 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-200 bg-zinc-50 text-xs font-semibold text-zinc-700 shadow-xs mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#b38a54]" />
            <span className="tracking-widest uppercase font-mono text-[11px]">THE INSTITUTIONAL EDGE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#10213a] tracking-tight font-serif">
            Why European Tour Operators Partner With Us
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-600 font-normal leading-relaxed">
            Six operational principles engineered for travel procurement: conflict-free, hypothesis-driven, and aligned with European catalog liability.
          </p>
        </div>

        {/* 6-Item Grid: 2 rows of 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-14">
          {OUR_USPS.map((usp, index) => (
            <div
              key={usp.key}
              className="flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-[#fafafa] border border-zinc-200/90 hover:border-zinc-300 hover:bg-white transition-all shadow-xs text-left"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-zinc-200 flex items-center justify-center shadow-xs">
                    {getIcon(usp.icon)}
                  </div>
                  <span className="font-mono text-xs font-bold text-zinc-400">
                    0{index + 1}
                  </span>
                </div>

                <div className="font-bold text-xs sm:text-sm tracking-wider uppercase text-[#10213a]">
                  {usp.title}
                </div>

                <div className="text-xs font-semibold text-[#b38a54] mt-1 leading-snug">
                  {usp.tagline}
                </div>

                <p className="text-xs text-zinc-600 font-normal mt-2.5 leading-relaxed">
                  {usp.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Strategic Comparison: Clean 3-Way Responsive Cards */}
        <div className="rounded-2xl bg-[#0c182a] text-white p-6 sm:p-8 border border-white/15 shadow-xl text-left">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#d9bd8b] mb-1">
                <Shield className="w-4 h-4" />
                <span>Strategic Comparison</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-serif text-white">
                How We Differ from Traditional Bureaus
              </h3>
            </div>
            <div className="text-xs font-mono text-zinc-400">
              Procurement Intelligence vs. Marketing Plaques
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Model 1: Star Councils */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[10px] font-mono text-zinc-400 uppercase mb-1">Official Star Councils</div>
              <div className="text-sm font-bold text-zinc-300 mb-2">Static Hardware Checklists</div>
              <ul className="text-xs text-zinc-400 space-y-1.5 font-light">
                <li className="flex items-start gap-1.5">
                  <X className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  <span>Hotel pays inspection fee (conflict of interest)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <X className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  <span>Announced visits every 3–5 years</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <X className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  <span>No data to defend against bad-actor refund claims</span>
                </li>
              </ul>
            </div>

            {/* Model 2: Hotel Marketing Bureaus */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[10px] font-mono text-zinc-400 uppercase mb-1">Hotel-Funded Bureaus</div>
              <div className="text-sm font-bold text-zinc-300 mb-2">Plaques & Marketing Awards</div>
              <ul className="text-xs text-zinc-400 space-y-1.5 font-light">
                <li className="flex items-start gap-1.5">
                  <X className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  <span>Hotels pay for awards and promotional plaque placement</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <X className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  <span>Generic 900-question sheets without regional context</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <X className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  <span>Takes 3–4 weeks for bloated 50-page internal decks</span>
                </li>
              </ul>
            </div>

            {/* Model 3: Cape Hospitality Advisors */}
            <div className="p-4 rounded-xl bg-[#b38a54]/10 border border-[#d9bd8b]/40 ring-1 ring-[#d9bd8b]/30">
              <div className="text-[10px] font-mono text-[#d9bd8b] uppercase font-bold mb-1">Cape Hospitality Advisors</div>
              <div className="text-sm font-bold text-white mb-2">Conflict-Free Buyer's Agent</div>
              <ul className="text-xs text-zinc-200 space-y-1.5 font-light">
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="font-medium text-white">Paid 100% exclusively by the tour operator</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Hypothesis-driven: focuses on live guest flow & acoustics</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Timestamped sensor evidence to refute false guest reviews</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-zinc-400 font-mono text-[11px]">
              We answer the buyer's question: <em>What will your client experience tomorrow morning?</em>
            </span>
            <a
              href="#virtual-audit"
              className="inline-flex items-center gap-1.5 text-[#d9bd8b] font-bold hover:text-white transition-colors cursor-pointer"
            >
              <span>Test the Virtual Audit Radar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

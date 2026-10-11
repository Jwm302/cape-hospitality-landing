import React, { useState } from 'react';
import { Check, ChevronRight, Sparkles, HelpCircle } from 'lucide-react';
import { SERVICE_TIERS } from '../data/landingData';

interface PricingSectionProps {
  onSelectTier: (tier: string) => void;
  onRequestFreeDataPackage: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  onSelectTier,
  onRequestFreeDataPackage,
}) => {
  const [selectedTier, setSelectedTier] = useState<string>('PHYSICAL_AUDIT');

  const handleSelect = (tierKey: string) => {
    setSelectedTier(tierKey);
    onSelectTier(tierKey);
  };

  return (
    <section id="pricing" className="py-20 sm:py-28 bg-[#fbfbfa] border-t border-zinc-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 shadow-xs mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#b38a54]" />
            <span className="tracking-wider uppercase font-mono text-[11px]">
              Services & Engagement Options
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#10213a] tracking-tight font-serif">
            Three Ways to Work With Us
          </h2>

          <p className="mt-3 text-base sm:text-lg text-zinc-600 font-normal leading-relaxed max-w-2xl mx-auto">
            Start with a free desk check, verify on site, or monitor your whole portfolio.
          </p>
        </div>

        {/* 3-Tier Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {SERVICE_TIERS.map((pkg) => {
            const isSelected = selectedTier === pkg.key;
            const isPopular = pkg.isPopular;

            return (
              <div
                key={pkg.key}
                onClick={() => handleSelect(pkg.key)}
                className={`relative flex flex-col justify-between rounded-3xl transition-all duration-200 cursor-pointer p-7 sm:p-8 text-left ${
                  isPopular
                    ? 'bg-white border-2 border-[#b38a54] shadow-xl ring-1 ring-[#b38a54]/20 -translate-y-1'
                    : isSelected
                    ? 'bg-white border-2 border-[#10213a] shadow-md'
                    : 'bg-white border border-zinc-200 hover:border-zinc-300 hover:shadow-md'
                }`}
              >
                {/* Popular Pill */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-[#10213a] text-white text-[10px] font-bold tracking-widest uppercase shadow-md flex items-center gap-1.5 whitespace-nowrap">
                    <Sparkles className="w-3 h-3 text-[#d9bd8b]" />
                    <span>Most Popular</span>
                  </div>
                )}

                <div className="flex flex-col flex-grow">
                  {/* Top Row: Tier Number & Tag */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-xs font-bold tracking-widest text-zinc-400">
                      TIER {pkg.tierNumber}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-md border ${pkg.badgeColor}`}>
                      {pkg.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-bold text-[#10213a] tracking-tight leading-snug">
                    {pkg.title}
                  </h3>

                  {/* Tagline */}
                  <p className="mt-1 text-xs font-semibold text-[#b38a54] leading-snug">
                    {pkg.tagline}
                  </p>

                  {/* Description */}
                  <p className="mt-3 text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
                    {pkg.description}
                  </p>

                  {/* Price Banner */}
                  <div className="my-5 p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-center">
                    <div className="font-mono text-xs font-bold text-[#10213a]">
                      {pkg.priceDisplay}
                    </div>
                  </div>

                  {/* Includes List */}
                  <div className="mb-6 flex-grow">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-700 block mb-2.5 font-mono">
                      Includes:
                    </span>
                    <ul className="space-y-2.5 text-xs text-zinc-600">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                          <span className="leading-snug text-zinc-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* The Question We Answer */}
                  <div className="mt-auto pt-4 border-t border-zinc-100">
                    <div className="bg-[#10213a]/5 p-3 rounded-xl border border-[#10213a]/10 text-xs">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#10213a] uppercase tracking-wider mb-1">
                        <HelpCircle className="w-3.5 h-3.5 text-[#b38a54]" />
                        <span>The Question We Answer:</span>
                      </div>
                      <p className="font-serif italic font-semibold text-[#10213a] text-xs leading-snug">
                        {pkg.questionAnswered}
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="pt-5 mt-5 border-t border-zinc-200/60">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (pkg.isFree) {
                        onRequestFreeDataPackage();
                      } else {
                        handleSelect(pkg.key);
                      }
                    }}
                    id={`pricing-btn-${pkg.key.toLowerCase()}`}
                    className={`w-full py-3 px-4 rounded-full font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isPopular
                        ? 'bg-[#10213a] text-white hover:bg-[#1a335a] shadow-sm'
                        : pkg.isFree
                        ? 'bg-[#b38a54] text-white hover:bg-[#9c753e] shadow-sm'
                        : 'bg-zinc-100 text-zinc-900 hover:bg-[#10213a] hover:text-white border border-zinc-200'
                    }`}
                  >
                    <span>{pkg.ctaText}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

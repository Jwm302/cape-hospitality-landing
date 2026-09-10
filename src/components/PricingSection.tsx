import React, { useState } from 'react';
import { Check, ChevronRight, Sparkles, ShieldCheck, Cpu } from 'lucide-react';
import { PRICING_PACKAGES } from '../data/landingData';

interface PricingSectionProps {
  onSelectTier: (tier: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectTier }) => {
  const [selectedTier, setSelectedTier] = useState<string>('GOLD');

  return (
    <section id="pricing" className="py-20 sm:py-24 bg-white border-t border-zinc-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-200 bg-zinc-50 text-xs font-semibold text-zinc-700 shadow-xs mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#b38a54]" />
            <span className="tracking-wider uppercase font-mono text-[11px]">Audit Packages</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#10213a] tracking-tight">
            Transparent Pricing
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-600 font-normal leading-relaxed">
            Fixed rates for single-property audits and multi-property portfolio spot-checks.
          </p>
        </div>

        {/* 4-Tier Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {PRICING_PACKAGES.map((pkg) => {
            const isGold = pkg.tier === 'GOLD';
            const isPlatinum = pkg.tier === 'PLATINUM';

            return (
              <div
                key={pkg.tier}
                onClick={() => setSelectedTier(pkg.tier)}
                className={`relative flex flex-col justify-between rounded-2xl transition-all duration-200 cursor-pointer p-6 text-left ${
                  isGold
                    ? 'bg-white border-2 border-[#b38a54] shadow-lg ring-1 ring-[#b38a54]/20 -translate-y-1'
                    : 'bg-[#fafafa] border border-zinc-200 hover:border-zinc-300 hover:bg-white shadow-xs'
                }`}
              >
                {/* Gold Highlight Tag */}
                {isGold && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#10213a] text-white text-[10px] font-bold tracking-widest uppercase shadow-sm flex items-center gap-1 whitespace-nowrap">
                    <Sparkles className="w-2.5 h-2.5 text-[#d9bd8b]" />
                    <span>Most Popular</span>
                  </div>
                )}

                <div className="flex flex-col flex-grow">
                  {/* Top Row: Tier and Delivery/Subtitle Parameter */}
                  <div className="flex items-start justify-between gap-2 min-h-[44px]">
                    <span className="font-mono text-xs font-bold tracking-widest uppercase text-zinc-500 shrink-0 pt-0.5">
                      {pkg.tier}
                    </span>
                    <span className="text-[10px] font-mono font-semibold px-2 py-1 rounded-md bg-zinc-100 border border-zinc-200/80 text-zinc-700 text-right leading-tight max-w-[170px]">
                      {pkg.subtitle}
                    </span>
                  </div>

                  {/* Price & Rate/Condition note */}
                  <div className="mt-3">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-extrabold text-[#10213a] tracking-tight">
                        €{pkg.priceEur.toLocaleString()}
                      </span>
                      <span className="text-xs text-zinc-500 font-medium">/ audit</span>
                    </div>
                    <div className="min-h-[22px] mt-1 flex items-center">
                      <span
                        className={`text-[11px] font-mono ${
                          pkg.minimumContract?.includes('Volume')
                            ? 'font-bold text-[#b38a54]'
                            : 'text-zinc-500 font-medium'
                        }`}
                      >
                        {pkg.minimumContract}
                      </span>
                    </div>
                  </div>

                  {/* Core Header */}
                  <div className="font-bold text-sm sm:text-base text-zinc-900 mt-2 min-h-[44px] flex items-center">
                    {pkg.title}
                  </div>

                  <div className="h-px bg-zinc-200/80 my-3" />

                  {/* Features List */}
                  <ul className="space-y-2.5 text-xs text-zinc-600 flex-grow">
                    {pkg.features.map((feature, idx) => {
                      const isAdditive = feature.startsWith('Includes all');
                      const isFootnote = feature.startsWith('*');
                      const colonIdx = feature.indexOf(':');
                      const hasColon = colonIdx > -1;
                      const titlePart = hasColon ? feature.slice(0, colonIdx) : '';
                      const descPart = hasColon ? feature.slice(colonIdx + 1) : feature;

                      if (isAdditive) {
                        return (
                          <li
                            key={idx}
                            className="flex items-center gap-1.5 pb-2 text-[11px] font-mono font-bold tracking-tight text-[#10213a] border-b border-zinc-200/80 mb-1"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#10213a] shrink-0" />
                            <span>{feature}</span>
                          </li>
                        );
                      }

                      return (
                        <li
                          key={idx}
                          className={`flex items-start gap-2 ${
                            isFootnote
                              ? 'text-zinc-900 font-semibold pt-2 border-t border-zinc-200/80 mt-2'
                              : ''
                          }`}
                        >
                          <div
                            className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                              isFootnote
                                ? 'bg-[#b38a54]/10 text-[#b38a54]'
                                : 'bg-emerald-50 text-emerald-600'
                            }`}
                          >
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                          <span className="leading-snug">
                            {hasColon ? (
                              <>
                                <strong className="font-semibold text-zinc-900">
                                  {titlePart}:
                                </strong>
                                {descPart}
                              </>
                            ) : (
                              feature
                            )}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Select Button */}
                <div className="pt-5 mt-5 border-t border-zinc-200/60">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTier(pkg.tier);
                    }}
                    id={`pricing-btn-${pkg.tier.toLowerCase()}`}
                    className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isGold
                        ? 'bg-[#10213a] text-white hover:bg-[#1a335a] shadow-sm'
                        : isPlatinum
                        ? 'bg-[#b38a54] text-white hover:bg-[#9c753e] shadow-sm'
                        : 'bg-white text-zinc-800 hover:bg-zinc-100 border border-zinc-300'
                    }`}
                  >
                    <span>{pkg.ctaText || `Inquire for ${pkg.tier}`}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Platform Technical Standard Alert Banner */}
        <div className="mt-8 sm:mt-10 p-5 sm:p-6 rounded-2xl bg-zinc-50 border border-zinc-200/90 shadow-xs relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 sm:gap-5">
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-[#10213a] text-[#d9bd8b] flex items-center justify-center shadow-xs">
                <Cpu className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[11px] font-bold tracking-widest uppercase text-[#10213a]">
                  Technical Architecture
                </span>
                <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Universal Pipeline Standard
                </span>
              </div>
            </div>

            <div className="h-px w-full md:w-px md:h-10 bg-zinc-200" />

            <div className="flex-1 text-xs text-zinc-700 leading-relaxed font-normal text-left">
              <p>
                <strong className="font-bold text-[#10213a] uppercase tracking-wider font-mono mr-1.5">
                  PLATFORM STANDARD:
                </strong>
                Every tier—from Bronze to Platinum—leverages our data science architecture. Before an inspector is dispatched anywhere in the Cape or Garden Route, a complete historical text audit is executed via our local R-intelligence pipeline. This pre-incident data radar shapes the targeted field directives for our inspectors, ensuring zero blind spots regardless of the tier selected.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

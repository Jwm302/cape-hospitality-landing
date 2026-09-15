import React, { useState } from 'react';
import {
  Check,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Target,
  HelpCircle,
  Cpu,
  ArrowDown,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import {
  PRICING_PACKAGES,
  SERVICES_HEADER_CONTENT,
  QUALITY_LADDER_CONTENT,
  CORE_PROMISE_CONTENT,
} from '../data/landingData';

interface PricingSectionProps {
  onSelectTier: (tier: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectTier }) => {
  const [selectedTier, setSelectedTier] = useState<string>('PROFESSIONAL');

  const handleSelect = (tierKey: string) => {
    setSelectedTier(tierKey);
    onSelectTier(tierKey);
  };

  return (
    <section id="pricing" className="py-20 sm:py-28 bg-[#fbfbfa] border-t border-zinc-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Main Positioning Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 shadow-xs mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#b38a54]" />
            <span className="tracking-wider uppercase font-mono text-[11px]">
              {SERVICES_HEADER_CONTENT.eyebrow}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#10213a] tracking-tight font-serif">
            {SERVICES_HEADER_CONTENT.headline}
          </h2>

          <div className="mt-4 space-y-2">
            <p className="text-lg sm:text-xl text-[#10213a] font-medium italic">
              {SERVICES_HEADER_CONTENT.subheadline}
            </p>
            <p className="text-sm sm:text-base text-zinc-600 font-normal leading-relaxed max-w-2xl mx-auto pt-2">
              {SERVICES_HEADER_CONTENT.mission}
            </p>
          </div>
        </div>

        {/* 4-Tier Service Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-20">
          {PRICING_PACKAGES.map((pkg) => {
            const isSelected = selectedTier === pkg.tier;
            const isPopular = pkg.isPopular;

            return (
              <div
                key={pkg.id}
                onClick={() => handleSelect(pkg.tier)}
                className={`relative flex flex-col justify-between rounded-2xl transition-all duration-200 cursor-pointer p-6 sm:p-7 text-left ${
                  isPopular
                    ? 'bg-white border-2 border-[#b38a54] shadow-xl ring-1 ring-[#b38a54]/20 -translate-y-1'
                    : isSelected
                    ? 'bg-white border-2 border-[#10213a] shadow-md'
                    : 'bg-white border border-zinc-200 hover:border-zinc-300 hover:shadow-md'
                }`}
              >
                {/* Most Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-[#10213a] text-white text-[10px] font-bold tracking-widest uppercase shadow-md flex items-center gap-1.5 whitespace-nowrap">
                    <Sparkles className="w-3 h-3 text-[#d9bd8b]" />
                    <span>⭐ Most Popular</span>
                  </div>
                )}

                <div className="flex flex-col flex-grow">
                  {/* Top Row: Tier Number & Tag */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-extrabold tracking-widest text-[#b38a54]">
                      {pkg.tierNumber} — {pkg.tier}
                    </span>
                    {isPopular && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#b38a54]/10 text-[#9c753e]">
                        CORE SERVICE
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-[#10213a] tracking-tight leading-snug">
                    {pkg.title}
                  </h3>

                  {/* Tagline */}
                  <p className="mt-1 text-xs font-semibold text-[#b38a54] min-h-[32px] flex items-center">
                    {pkg.tagline}
                  </p>

                  {/* Description Context */}
                  <p className="mt-2 text-xs text-zinc-600 leading-relaxed font-normal min-h-[64px]">
                    {pkg.description}
                  </p>

                  <div className="h-px bg-zinc-200/80 my-4" />

                  {/* Additive Note if available */}
                  {pkg.additiveNote && (
                    <div className="mb-3 px-2.5 py-1.5 rounded-lg bg-zinc-50 border border-zinc-200 text-[11px] font-bold text-[#10213a] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#b38a54] shrink-0" />
                      <span>{pkg.additiveNote}</span>
                    </div>
                  )}

                  {/* Includes List */}
                  <div className="mb-4 flex-grow">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-700 block mb-2 font-mono">
                      Includes:
                    </span>
                    <ul className="space-y-2 text-xs text-zinc-600">
                      {pkg.features.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="w-3.5 h-3.5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                          <span className="leading-snug text-zinc-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Perfect For Section */}
                  <div className="mt-auto pt-3 border-t border-zinc-100">
                    <div className="flex items-start gap-1.5 text-xs text-zinc-600 mb-3 bg-zinc-50/80 p-2.5 rounded-xl border border-zinc-200/60">
                      <Target className="w-3.5 h-3.5 text-[#b38a54] shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-semibold text-[#10213a] block text-[11px] uppercase font-mono">
                          Perfect for:
                        </strong>
                        <span className="text-[11px] leading-snug">{pkg.idealFor}</span>
                      </div>
                    </div>

                    {/* The Question We Answer Section */}
                    <div className="bg-[#10213a]/5 p-2.5 rounded-xl border border-[#10213a]/10 text-xs">
                      <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-[#10213a] uppercase tracking-wider mb-0.5">
                        <HelpCircle className="w-3 h-3 text-[#b38a54]" />
                        <span>The question we answer:</span>
                      </div>
                      <p className="font-serif italic font-semibold text-[#10213a] text-xs leading-snug">
                        {pkg.questionAnswered}
                      </p>
                    </div>

                    {/* Popular Highlight Note if present */}
                    {pkg.highlights && pkg.highlights.length > 0 && (
                      <div className="mt-2.5 p-2 rounded-lg bg-[#b38a54]/10 border border-[#b38a54]/20 text-[11px] font-semibold text-[#9c753e] leading-tight text-center">
                        {pkg.highlights[0]}
                      </div>
                    )}
                  </div>
                </div>

                {/* CTA Action Button */}
                <div className="pt-5 mt-5 border-t border-zinc-200/60">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(pkg.tier);
                    }}
                    id={`pricing-btn-${pkg.id}`}
                    className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isPopular
                        ? 'bg-[#10213a] text-white hover:bg-[#1a335a] shadow-sm'
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

        {/* ========================================================= */}
        {/* THE CAPE HOSPITALITY QUALITY LADDER                      */}
        {/* ========================================================= */}
        <div className="mb-20 bg-white rounded-3xl border border-zinc-200/90 p-8 sm:p-12 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 bg-zinc-50 text-[11px] font-mono font-bold uppercase text-zinc-700 mb-3">
              <Layers className="w-3 h-3 text-[#b38a54]" />
              <span>Structured Quality Progression</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#10213a] tracking-tight font-serif">
              {QUALITY_LADDER_CONTENT.title}
            </h3>
            <p className="mt-2 text-sm text-zinc-600 font-normal leading-relaxed">
              {QUALITY_LADDER_CONTENT.tagline}
            </p>
          </div>

          {/* Stepper / Ladder Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 relative">
            {QUALITY_LADDER_CONTENT.steps.map((step, idx) => {
              const isSelected = selectedTier === step.tierKey;
              return (
                <div
                  key={step.id}
                  onClick={() => handleSelect(step.tierKey)}
                  className={`group relative rounded-2xl p-5 sm:p-6 transition-all cursor-pointer border flex flex-col justify-between ${
                    step.isPopular
                      ? 'bg-[#fbfbfa] border-2 border-[#b38a54] shadow-sm'
                      : isSelected
                      ? 'bg-zinc-50 border-2 border-[#10213a]'
                      : 'bg-zinc-50/60 border-zinc-200 hover:bg-white hover:border-zinc-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="w-7 h-7 rounded-full bg-[#10213a] text-white font-mono text-xs font-bold flex items-center justify-center">
                        {step.tierNumber}
                      </span>
                      {step.isPopular && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#b38a54] text-white">
                          ⭐ POPULAR
                        </span>
                      )}
                    </div>
                    <h4 className="font-extrabold text-base text-[#10213a] tracking-tight">
                      {step.name}
                    </h4>
                    <p className="text-xs text-zinc-600 mt-1 font-medium">
                      {step.tagline}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-200/60 flex items-center justify-between text-xs font-semibold text-[#10213a] group-hover:text-[#b38a54] transition-colors">
                    <span>View Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Micro Progression Indicators on Mobile/Desktop */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-zinc-500 font-mono">
            <span>Check</span>
            <span>&rarr;</span>
            <span>Audit</span>
            <span>&rarr;</span>
            <span>Deep Dive</span>
            <span>&rarr;</span>
            <span className="font-bold text-[#10213a]">Continuous Monitoring</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* OUR CORE PROMISE                                          */}
        {/* ========================================================= */}
        <div className="bg-[#10213a] text-white rounded-3xl p-8 sm:p-12 lg:p-14 shadow-xl relative overflow-hidden mb-16">
          {/* Subtle background ornamentation */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/[0.03] rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/10 text-xs font-mono font-bold text-[#d9bd8b] tracking-wider uppercase mb-5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#d9bd8b]" />
              <span>{CORE_PROMISE_CONTENT.title}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-serif tracking-tight leading-snug">
              {CORE_PROMISE_CONTENT.lead}
            </h3>

            <div className="mt-6 space-y-4 text-sm sm:text-base text-zinc-300 font-normal leading-relaxed">
              <p>{CORE_PROMISE_CONTENT.body1}</p>
              <p className="text-white font-medium text-base sm:text-lg border-t border-white/15 pt-4">
                {CORE_PROMISE_CONTENT.body2}
              </p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => handleSelect('PROFESSIONAL')}
                className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#b38a54] text-white text-xs font-bold hover:bg-[#9c753e] transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                id="promise-cta-btn"
              >
                <span>Commission an Inspection</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Universal Technical Architecture Banner */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-zinc-200/90 shadow-xs relative overflow-hidden">
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
                Every service tier—from the Essential Hotel Check to continuous Quality Partnerships—leverages our data science architecture. Before an inspector is dispatched anywhere in the Cape or Garden Route, a complete historical text audit is executed via our local R-intelligence pipeline. This pre-incident data radar shapes the targeted field directives for our inspectors, ensuring zero blind spots regardless of the tier selected.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

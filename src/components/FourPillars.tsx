import React, { useState } from 'react';
import {
  Compass,
  BedDouble,
  UtensilsCrossed,
  ShieldCheck,
  Check,
  ChevronDown,
  ChevronUp,
  Layers,
  Sparkles,
} from 'lucide-react';
import { FOUR_PILLARS_CONTENT } from '../data/landingData';

export const FourPillars: React.FC = () => {
  const [activePillar, setActivePillar] = useState<string | null>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass':
        return <Compass className="w-5 h-5 text-emerald-600" />;
      case 'BedDouble':
        return <BedDouble className="w-5 h-5 text-indigo-600" />;
      case 'UtensilsCrossed':
        return <UtensilsCrossed className="w-5 h-5 text-[#a07c48]" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-purple-600" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#a07c48]" />;
    }
  };

  return (
    <section id="pillars" className="py-24 bg-[#f8fafc] relative overflow-hidden border-t border-zinc-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 shadow-xs mb-4">
            <Layers className="w-3.5 h-3.5 text-[#a07c48]" />
            <span className="tracking-widest uppercase font-mono text-[11px]">Methodology & Scope</span>
          </div>
          <h2 className="font-sans text-3xl sm:text-5xl font-extrabold text-[#162544] tracking-tight leading-tight">
            The Four Pillars of Inspection
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 max-w-2xl mx-auto">
            Our comprehensive 420-point audit matrix deconstructs every touchpoint of the guest lifecycle into quantifiable, objective luxury benchmarks.
          </p>
        </div>

        {/* The 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FOUR_PILLARS_CONTENT.map((pillar) => {
            const isExpanded = activePillar === pillar.id;

            return (
              <div
                key={pillar.id}
                id={`pillar-column-${pillar.columnNumber}`}
                className={`group relative flex flex-col justify-between rounded-2xl p-6 transition-all duration-300 bg-white ${
                  isExpanded
                    ? 'border-2 border-[#b89764] shadow-xl ring-1 ring-[#b89764]/20'
                    : 'border border-zinc-200 hover:border-zinc-300 hover:shadow-md'
                }`}
              >
                {/* Top: Column Indicator and Icon */}
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                      {getIcon(pillar.iconName)}
                    </div>
                    <span className="font-mono text-xs font-bold text-zinc-400 tracking-wider">
                      PILLAR 0{pillar.columnNumber}
                    </span>
                  </div>

                  {/* Pillar Title */}
                  <h3 className="font-sans text-lg font-bold text-[#162544] leading-snug tracking-tight">
                    {pillar.title}
                  </h3>

                  {/* Verbatim Draft Body Text */}
                  <p className="mt-3 text-xs sm:text-sm text-zinc-600 font-normal leading-relaxed">
                    {pillar.description}
                  </p>

                  {/* Benchmark Tag */}
                  <div className="mt-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-[11px] font-mono text-zinc-700">
                    <span className="text-[#a07c48] font-bold">Benchmark:</span> {pillar.metricsSample}
                  </div>
                </div>

                {/* Audit Checkpoint Details / Accordion */}
                <div className="mt-6 pt-4 border-t border-zinc-100">
                  <button
                    onClick={() => setActivePillar(isExpanded ? null : pillar.id)}
                    className="w-full flex items-center justify-between text-xs font-bold text-zinc-700 hover:text-zinc-900 py-1 cursor-pointer transition-colors"
                  >
                    <span>{isExpanded ? 'Hide Criteria' : 'Inspection Scope'}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-zinc-800" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-zinc-500" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="mt-3 pt-2 space-y-2 text-left animate-in fade-in duration-200">
                      {pillar.focusAreas.map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-zinc-600">
                          <Check className="w-3.5 h-3.5 text-[#a07c48] shrink-0 mt-0.5" />
                          <span className="leading-snug">{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Metric Banner */}
        <div className="mt-12 p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs sm:text-sm text-zinc-700 font-semibold">
              Benchmarked against Leading Quality Assurance (LQA) and Forbes Travel Guide 5-Star Standards.
            </span>
          </div>
          <span className="text-xs font-mono text-[#a07c48] font-bold whitespace-nowrap">
            Zero Discretionary Bias
          </span>
        </div>
      </div>
    </section>
  );
};

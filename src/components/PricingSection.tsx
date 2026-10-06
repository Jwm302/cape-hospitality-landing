import React, { useState } from 'react';
import {
  Check,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Target,
  HelpCircle,
  FileSpreadsheet,
  ArrowRight,
  Eye,
  Activity
} from 'lucide-react';

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

  const PACKAGES = [
    {
      id: 'virtual-audit',
      tierKey: 'VIRTUAL_AUDIT',
      tierNumber: '01',
      badge: 'COMPLIMENTARY ACCESS',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      title: 'Agent Virtual Audit & Data Package',
      tagline: 'Bespoke 24-hour desk pre-audit & catalog risk check.',
      description: 'Submit any hotel currently on your books. Our Cape Town desk synthesizes verified European guest signals and German catalog criteria into a bespoke 2-page brief delivered to your inbox within 24 hours.',
      isFree: true,
      priceDisplay: 'Free for Verified Operators',
      ctaText: 'Get Free Data Package Now',
      features: [
        'Delivered to your corporate inbox within 24 hours',
        'Bespoke analysis for your specific contracted property',
        'Evaluated against German tour operator standards (DRV)',
        'Acoustics, bathroom hygiene, and service flow risk check',
        'Official stars vs. experience discrepancy index',
        'Directly calibrates the custom checklist for physical audits',
      ],
      idealFor: 'Initial screening before contracting, renewals, or answering specific client queries.',
      questionAnswered: '“Does this hotel actually deliver what we are selling to European clients?”',
    },
    {
      id: 'physical-audit',
      tierKey: 'PHYSICAL_AUDIT',
      tierNumber: '02',
      badge: 'CORE AUDIT SERVICE',
      badgeColor: 'bg-[#b38a54]/10 text-[#9c753e] border-[#b38a54]/30',
      isPopular: true,
      title: 'On-Site Mystery Hotel Audit',
      tagline: 'The complete independent, on-the-ground verification.',
      description: 'Our flagship on-site service. An anonymous, unannounced mystery stay conducted by European-trained hospitality professionals across Cape Town or the Garden Route.',
      priceDisplay: 'Tailored per Property / Stay',
      ctaText: 'Commission On-Site Audit',
      features: [
        'Custom-calibrated using preliminary Virtual Audit data',
        '100% anonymous 24-48 hour mystery guest stay',
        'Arrival flow, luggage handling & check-in pacing',
        'Room upkeep, bathroom hygiene & bed comfort',
        'Night acoustic isolation & bedroom AC quietness',
        'Breakfast & dinner mystery dining evaluations',
        'Shower water temperature stability & morning pressure',
        'Timestamped photographic & sensor evidence dossier',
        'Factual defense logs to refute bad actors & false guest refund claims',
        'Executive Management Report delivered in 48 hours',
        'Concrete recommendations: We Observe, We Assess Risk, We Recommend',
      ],
      idealFor: 'Contracted high-yield hotels, VIP client bookings, or refuting disputed complaints from bad actors.',
      questionAnswered: '“What would our German customer actually experience if they arrived today?”',
    },
    {
      id: 'portfolio-monitoring',
      tierKey: 'PARTNERSHIP',
      tierNumber: '03',
      badge: 'STRATEGIC OVERVIEW',
      badgeColor: 'bg-zinc-100 text-zinc-800 border-zinc-200',
      title: 'Portfolio Quality Partnership',
      tagline: 'Continuous oversight across the Western Cape.',
      description: 'Hotels change: management changes, chefs leave, maintenance slips, and service standards deteriorate. We provide ongoing, proactive oversight of your regional portfolio.',
      priceDisplay: 'Seasonal Portfolio Retainer',
      ctaText: 'Inquire for Portfolio Monitoring',
      features: [
        'Regular scheduled unannounced inspections',
        'Consistent comparative scoring across all partner hotels',
        'Early-warning alert system for service degradation',
        'Cross-season deterioration and trend analysis',
        'Portfolio-level executive reporting for procurement teams',
        'Pre-season readiness audits prior to peak European arrivals',
        'Direct advisory consultation with tour operator management',
      ],
      idealFor: 'European tour operators and luxury agencies managing 5+ partner hotels in South Africa.',
      questionAnswered: '“Is our hotel portfolio maintaining the brand reputation we promise?”',
    },
  ];

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
            Simple, Transparent Quality Assurance
          </h2>

          <p className="mt-3 text-base sm:text-lg text-zinc-600 font-normal leading-relaxed max-w-2xl mx-auto">
            From an instant virtual data package to rigorous on-the-ground mystery stays, choose the level of quality perspective your tour operation requires.
          </p>
        </div>

        {/* 3-Tier Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch mb-16">
          {PACKAGES.map((pkg) => {
            const isSelected = selectedTier === pkg.tierKey;
            const isPopular = pkg.isPopular;

            return (
              <div
                key={pkg.id}
                onClick={() => handleSelect(pkg.tierKey)}
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
                    <span>⭐ Most Popular Option</span>
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
                        handleSelect(pkg.tierKey);
                      }
                    }}
                    id={`pricing-btn-${pkg.id}`}
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

        {/* Grounding Philosophy Card */}
        <div className="bg-[#10213a] text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="max-w-3xl mx-auto text-center relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/20 bg-white/10 text-xs font-mono font-bold text-[#d9bd8b] tracking-wider uppercase mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#d9bd8b]" />
              <span>Independent & Objective</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-serif tracking-tight leading-snug">
              “We don’t inspect hotels for the sake of producing reports. We help travel companies protect their product.”
            </h3>

            <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed pt-2">
              Your contracts may have been negotiated months ago. But the hotel your European customer experiences today may be very different. We give you an independent set of eyes on the ground — before your customers give you their feedback.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onRequestFreeDataPackage}
                className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#b38a54] text-white text-xs font-bold hover:bg-[#c59b63] transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Get Your Free Data Package Now</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

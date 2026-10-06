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

  const COMPARISON_ROWS = [
    {
      metric: 'Commercial Client Alignment',
      starCouncil: 'Hotel pays inspection fee',
      hotelBureaus: 'Hotel pays for plaques/awards',
      cha: '100% Conflict-Free: Paid exclusively by the Tour Operator',
      highlight: true,
    },
    {
      metric: 'Primary Evaluation Focus',
      starCouncil: 'Static hardware (room size, elevator count)',
      hotelBureaus: '900+ rigid operational checkboxes',
      cha: 'Living Service Flow & Acoustics (Where 75% of complaints occur)',
      highlight: false,
    },
    {
      metric: 'Testing Methodology',
      starCouncil: 'Scheduled, announced visit every 3–5 yrs',
      hotelBureaus: 'Generic, one-size-fits-all sheets',
      cha: 'Hypothesis-Driven: Calibrated by Virtual Pre-Audit data',
      highlight: true,
    },
    {
      metric: 'European Guest Lens & Complaint Risk',
      starCouncil: 'None (Local structural criteria only)',
      hotelBureaus: 'None (Generic luxury hospitality benchmarks)',
      cha: 'Discerning traveler expectations & brochure complaint prevention',
      highlight: false,
    },
    {
      metric: 'Bad-Actor & False Review Defense',
      starCouncil: 'Zero support (No evidence logs for customer disputes)',
      hotelBureaus: 'None (Generic marketing scores cannot resolve legal disputes)',
      cha: 'Timestamped ground evidence (decibels, water temps, photos) to refute false claims',
      highlight: true,
    },
    {
      metric: 'Actionable Executive SLA',
      starCouncil: 'Formal bureaucratic certificate',
      hotelBureaus: '3–4 weeks for 50-page internal deck',
      cha: '24h Virtual Pre-Audit • 48h Physical Mystery Dossier',
      highlight: true,
    },
  ];

  return (
    <section id="usp" className="py-20 sm:py-28 bg-white border-t border-zinc-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-200 bg-zinc-50 text-xs font-semibold text-zinc-700 shadow-xs mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#b38a54]" />
            <span className="tracking-widest uppercase font-mono text-[11px]">The Institutional Edge</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#10213a] tracking-tight font-serif">
            Why European Tour Operators Partner With Us
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-600 font-normal leading-relaxed">
            Six operational principles engineered for travel procurement: conflict-free, hypothesis-driven, and aligned with European catalog liability.
          </p>
        </div>

        {/* 6-Item Grid: 2 rows of 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-16">
          {OUR_USPS.map((usp, index) => (
            <div
              key={usp.key}
              className="flex flex-col justify-between p-6 rounded-2xl bg-[#fafafa] border border-zinc-200/90 hover:border-zinc-300 hover:bg-white transition-all duration-200 shadow-xs text-left"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center shadow-xs">
                    {getIcon(usp.icon)}
                  </div>
                  <span className="font-mono text-xs font-bold text-zinc-400">
                    0{index + 1}
                  </span>
                </div>

                <div className="font-bold text-sm tracking-wider uppercase text-[#10213a]">
                  {usp.title}
                </div>

                <div className="text-xs font-semibold text-[#b38a54] mt-1.5 leading-snug">
                  {usp.tagline}
                </div>

                <p className="text-xs text-zinc-600 font-normal mt-3 leading-relaxed">
                  {usp.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Competitor Positioning Matrix: How CHA Differs from Traditional Bureaus */}
        <div className="rounded-3xl bg-[#0c182a] text-white p-6 sm:p-10 border border-white/15 shadow-xl text-left overflow-hidden">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#d9bd8b] mb-1">
                <Shield className="w-4 h-4" />
                <span>Strategic Comparison Matrix</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-white">
                How Cape Hospitality Differs from Legacy Bureaus
              </h3>
            </div>
            <div className="text-xs font-mono text-zinc-400">
              Procurement Intelligence vs. Marketing Plaques
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-3 pr-4 font-normal">Core Operational Dimension</th>
                  <th className="py-3 px-4 font-normal text-zinc-400">Official Star Councils</th>
                  <th className="py-3 px-4 font-normal text-zinc-400">Hotel-Funded Bureaus</th>
                  <th className="py-3 pl-4 font-bold text-[#d9bd8b] bg-white/5 rounded-t-xl">Cape Hospitality Advisors</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-light">
                {COMPARISON_ROWS.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 pr-4 font-medium text-white font-sans">
                      {row.metric}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400">
                      {row.starCouncil}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400">
                      {row.hotelBureaus}
                    </td>
                    <td className="py-3.5 pl-4 font-medium text-emerald-300 bg-white/5">
                      <span className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-[#d9bd8b] shrink-0" />
                        <span>{row.cha}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <span className="text-zinc-400 font-mono text-[11px]">
              We answer the buyer's question: <em>What will your client experience tomorrow morning?</em>
            </span>
            <a
              href="#virtual-audit"
              className="inline-flex items-center gap-1.5 text-[#d9bd8b] font-bold hover:text-white transition-colors cursor-pointer"
            >
              <span>Test the Agent Virtual Audit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

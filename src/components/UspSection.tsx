import React from 'react';
import { MapPin, Award, Compass, ShieldCheck, Zap, BarChart3 } from 'lucide-react';
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
    <section id="usp" className="py-20 sm:py-24 bg-white border-t border-zinc-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-200 bg-zinc-50 text-xs font-semibold text-zinc-700 shadow-xs mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#b38a54]" />
            <span className="tracking-widest uppercase font-mono text-[11px]">Why Partner With Us</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#10213a] tracking-tight">
            OUR USP
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-600 font-normal leading-relaxed">
            The six core operational standards that guide every Cape Hospitality audit.
          </p>
        </div>

        {/* 6-Item Grid: 2 rows of 3 columns on large screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
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
      </div>
    </section>
  );
};

import React from 'react';
import { SERVICE_TIERS } from '../data/landingData';

interface ServicesSectionProps {
  onSelectTier: (tier: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectTier }) => (
  <section id="services" className="scroll-mt-20 bg-[#f5f5f3] py-14 sm:py-16 border-t border-zinc-200">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-2xl sm:text-3xl font-bold text-zinc-800">Our Services</h2>
      <p className="mt-3 text-sm sm:text-base text-zinc-700">
        Start with a free desk check, verify on site, or keep watch over your whole portfolio.
      </p>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        {SERVICE_TIERS.map((tier) => (
          <div key={tier.key} className="flex flex-col bg-white border border-zinc-200 p-6">
            <h3 className="text-lg font-semibold text-zinc-800">{tier.title}</h3>
            <p className="mt-2 text-sm text-zinc-600 leading-relaxed flex-grow">{tier.tagline}</p>
            <p className="mt-4 text-sm font-semibold text-[#9c753e]">{tier.priceDisplay}</p>
            <button
              onClick={() => onSelectTier(tier.key)}
              id={`pricing-btn-${tier.key.toLowerCase()}`}
              className="mt-4 self-start px-5 py-2 rounded-full border border-[#b38a54] text-[#9c753e] hover:bg-[#b38a54] hover:text-white text-sm font-semibold transition-colors"
            >
              Enquire
            </button>
          </div>
        ))}
      </div>
    </div>
  </section>
);

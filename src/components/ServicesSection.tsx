import React, { useState } from 'react';
import { Check, ChevronDown, ChevronRight, HelpCircle, Sparkles } from 'lucide-react';
import { tiersFor } from '../data/landingData';
import { useLang } from '../i18n';

const COPY = {
  en: {
    title: 'Our Services',
    intro: 'Start with a free desk check, verify on site, or keep watch over your whole portfolio.',
    tier: 'TIER',
    popular: 'Most Popular',
    includes: 'Includes:',
    question: 'The Question We Answer:',
    open: 'Check now',
    close: 'Show less',
  },
  de: {
    title: 'Unsere Leistungen',
    intro: 'Beginnen Sie mit einem kostenlosen Check vom Schreibtisch, prüfen Sie vor Ort oder behalten Sie Ihr gesamtes Portfolio im Blick.',
    tier: 'STUFE',
    popular: 'Am beliebtesten',
    includes: 'Enthalten:',
    question: 'Die Frage, die wir beantworten:',
    open: 'Jetzt ansehen',
    close: 'Weniger anzeigen',
  },
};

interface ServicesSectionProps {
  onSelectTier: (tier: string) => void;
}

// Each card shows a short summary; "Check now" opens the full details of that
// tier only, and closes any other open card.
export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectTier }) => {
  const [openTier, setOpenTier] = useState<string | null>(null);
  const { lang } = useLang();
  const c = COPY[lang];

  const toggle = (key: string) => setOpenTier((prev) => (prev === key ? null : key));

  return (
    <section id="services" className="scroll-mt-20 bg-[#f5f5f3] py-14 sm:py-16 border-t border-zinc-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-zinc-800">{c.title}</h2>
        <p className="mt-3 text-sm sm:text-base text-zinc-700">
          {c.intro}
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 items-start text-left">
          {tiersFor(lang).map((tier) => {
            const isOpen = openTier === tier.key;

            return (
              <div
                key={tier.key}
                className={`relative flex flex-col bg-white p-6 ${
                  tier.isPopular ? 'border-2 border-[#b38a54]' : 'border border-zinc-200'
                }`}
              >
                {tier.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-[#10213a] text-white text-[10px] font-bold tracking-widest uppercase shadow-md flex items-center gap-1.5 whitespace-nowrap">
                    <Sparkles className="w-3 h-3 text-[#d9bd8b]" />
                    <span>{c.popular}</span>
                  </div>
                )}

                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold tracking-widest text-zinc-400">{c.tier} {tier.tierNumber}</span>
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-md border ${tier.badgeColor}`}>
                    {tier.badge}
                  </span>
                </div>

                <h3 className="mt-3 text-lg font-semibold text-zinc-800">{tier.title}</h3>
                <p className="mt-2 text-sm text-zinc-600 leading-relaxed">{tier.tagline}</p>
                <p className="mt-4 text-sm font-semibold text-[#9c753e]">{tier.priceDisplay}</p>

                {isOpen && (
                  <div id={`tier-details-${tier.key.toLowerCase()}`} className="mt-5 pt-5 border-t border-zinc-100">
                    <p className="text-sm text-zinc-600 leading-relaxed">{tier.description}</p>

                    <span className="mt-5 text-[11px] font-bold uppercase tracking-wider text-zinc-700 block mb-2.5 font-mono">
                      {c.includes}
                    </span>
                    <ul className="space-y-2.5 text-xs text-zinc-600">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5">
                          <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                          <span className="leading-snug text-zinc-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-5 bg-[#10213a]/5 p-3 rounded-xl border border-[#10213a]/10 text-xs">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#10213a] uppercase tracking-wider mb-1">
                        <HelpCircle className="w-3.5 h-3.5 text-[#b38a54]" />
                        <span>{c.question}</span>
                      </div>
                      <p className="font-serif italic font-semibold text-[#10213a] text-xs leading-snug">
                        {tier.questionAnswered}
                      </p>
                    </div>

                    <button
                      onClick={() => onSelectTier(tier.key)}
                      id={`pricing-btn-${tier.key.toLowerCase()}`}
                      className="mt-5 w-full py-3 px-4 rounded-full bg-[#b38a54] hover:bg-[#9c753e] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
                    >
                      <span>{tier.ctaText}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <button
                  onClick={() => toggle(tier.key)}
                  aria-expanded={isOpen}
                  aria-controls={`tier-details-${tier.key.toLowerCase()}`}
                  className={`mt-4 self-start inline-flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                    isOpen
                      ? 'text-zinc-500 hover:text-zinc-800'
                      : 'px-5 py-2 rounded-full border border-[#b38a54] text-[#9c753e] hover:bg-[#b38a54] hover:text-white'
                  }`}
                >
                  {isOpen ? c.close : c.open}
                  <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

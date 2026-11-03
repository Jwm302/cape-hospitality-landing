import React, { useMemo, useState } from 'react';
import { ShieldCheck, Clock, MapPin } from 'lucide-react';
import logoLightImg from '../assets/images/logo_light.webp';
import { useLang } from '../i18n';
import { COVER } from '../lib/cover';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

interface HeroProps {
  onRequestFreeDataPackage: () => void;
}

const COPY = {
  en: {
    tagline: 'Know what your guests will find, before they arrive.',
    quote: '“A five-star hotel does not automatically guarantee a five-star guest experience.”',
    introTitle: 'The Independent Choice',
    intro1: 'We check hotels in Cape Town and the Western Cape for European travel companies, anonymously and unannounced.',
    intro2: 'You see what your guests will actually experience, not what a star rating said years ago.',
    cta: 'Request a free virtual audit',
    highlights: [
      { title: 'Independent', text: 'Paid only by the travel company, never by the hotel.' },
      { title: 'Fast', text: 'A free desk brief within 24 hours, an on-site report within 48 hours.' },
      { title: 'On the Ground', text: 'Inspectors based in the Western Cape, from Cape Town to the Garden Route.' },
    ],
  },
  de: {
    tagline: 'Wissen, was Ihre Gäste erwartet – bevor sie ankommen.',
    quote: '„Ein Fünf-Sterne-Hotel garantiert nicht automatisch ein Fünf-Sterne-Gästeerlebnis.“',
    introTitle: 'Die unabhängige Wahl',
    intro1: 'Wir prüfen Hotels in Kapstadt und am Westkap für europäische Reiseveranstalter – anonym und unangekündigt.',
    intro2: 'Sie sehen, was Ihre Gäste tatsächlich erleben, nicht was eine Sterne-Klassifizierung vor Jahren aussagte.',
    cta: 'Kostenloses Virtuelles Audit anfordern',
    highlights: [
      { title: 'Unabhängig', text: 'Bezahlt ausschließlich vom Reiseveranstalter, nie vom Hotel.' },
      { title: 'Schnell', text: 'Kostenloser Kurzbericht in 24 Stunden, Bericht vor Ort in 48 Stunden.' },
      { title: 'Vor Ort', text: 'Inspektoren mit Sitz am Westkap, von Kapstadt bis zur Garden Route.' },
    ],
  },
};

const ICONS = [ShieldCheck, Clock, MapPin];

export const Hero: React.FC<HeroProps> = ({ onRequestFreeDataPackage }) => {
  const c = COPY[useLang().lang];
  const still = useMemo(prefersReducedMotion, []);
  // Where the clip is, for covers whose banner text follows the clip.
  const [time, setTime] = useState(0);
  const during = (span?: [number, number]) => !!span && time >= span[0] && time < span[1];
  const quiet = during(COVER.quiet);
  const sloganOn = during(COVER.slogan?.show);
  const onTimeUpdate =
    COVER.quiet || COVER.slogan
      ? (e: React.SyntheticEvent<HTMLVideoElement>) => setTime(e.currentTarget.currentTime)
      : undefined;
  return (
    <>
      {/* Photo banner */}
      <section className="relative overflow-hidden flex items-center justify-center min-h-[440px] sm:min-h-[560px] lg:min-h-[min(720px,calc(100vh-72px))] bg-[#10213a]">
        {/* Moving banner; a still frame for visitors who prefer reduced motion. */}
        {still ? (
          <img src={COVER.poster} alt="" aria-hidden="true" className={`absolute inset-0 w-full h-full object-cover ${COVER.position}`} />
        ) : (
          <video
            className={`absolute inset-0 w-full h-full object-cover ${COVER.position}`}
            poster={COVER.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            onTimeUpdate={onTimeUpdate}
          >
            <source src={COVER.webm} type="video/webm" />
            <source src={COVER.mp4} type="video/mp4" />
          </video>
        )}
        <div className={`absolute inset-0 ${COVER.shade} transition-opacity duration-1000 ${quiet ? 'opacity-30' : ''}`} />
        {COVER.slogan && !still && (
          // Top right like the poster on wider screens; over the sea on phones,
          // where the right half of the clip is cropped away.
          <img
            src={COVER.slogan.src}
            alt=""
            aria-hidden="true"
            className={`absolute z-10 w-[58%] left-1/2 -translate-x-1/2 bottom-[3%] sm:w-[30%] sm:max-w-[420px] sm:left-auto sm:translate-x-0 sm:right-[5%] sm:top-[8%] sm:bottom-auto drop-shadow-[0_2px_10px_rgba(16,33,58,0.6)] select-none pointer-events-none transition-[opacity,clip-path] duration-1000 ${sloganOn ? 'opacity-100 [clip-path:inset(0_0_0_0)]' : 'opacity-0 [clip-path:inset(0_100%_0_0)]'}`}
          />
        )}
        <div className="relative z-10 px-4 py-10 text-center text-white">
          <h1>
            <img
              src={logoLightImg}
              alt="Cape Hospitality Advisors"
              width={320}
              height={227}
              className="mx-auto w-56 sm:w-80 h-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] select-none"
              loading="eager"
            />
          </h1>
          <div className={`transition-opacity duration-1000 ${quiet ? 'opacity-0' : ''}`}>
            <p className="mt-6 text-2xl sm:text-4xl font-light leading-snug drop-shadow-md max-w-3xl mx-auto">{c.tagline}</p>
            <figure className="mt-6 max-w-2xl mx-auto drop-shadow-md">
              <blockquote className="font-[Georgia,serif] italic text-base sm:text-lg text-white/90 leading-relaxed">
                {c.quote}
              </blockquote>
              <figcaption className="mt-1.5 text-xs sm:text-sm text-white/75">
                — A. Gutman Milne, Library Hotel Collection, New York
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Intro + three reasons */}
      <section className="bg-white py-14 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-800">{c.introTitle}</h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-700 leading-relaxed max-w-3xl mx-auto">{c.intro1}</p>
          <p className="mt-3 text-sm sm:text-base text-zinc-700 leading-relaxed max-w-3xl mx-auto">{c.intro2}</p>

          <button
            onClick={onRequestFreeDataPackage}
            id="hero-primary-cta"
            className="mt-6 px-6 py-2.5 rounded-full bg-[#b38a54] hover:bg-[#9c753e] text-white text-sm font-semibold transition-colors"
          >
            {c.cta}
          </button>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-10">
            {c.highlights.map(({ title, text }, i) => {
              const Icon = ICONS[i];
              return (
                <div key={title} className="flex flex-col items-center">
                  <Icon className="w-12 h-12 text-[#b38a54]" strokeWidth={1.25} />
                  <h3 className="mt-4 text-xl font-light text-zinc-800">{title}</h3>
                  <p className="mt-2 text-sm text-zinc-600 leading-relaxed max-w-xs">{text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

import React from 'react';
import { ShieldCheck, Clock, MapPin } from 'lucide-react';
import heroImg from '../assets/images/cape_luxury_hotel_1788963250076.jpg';
import logoLightImg from '../assets/images/logo_light.webp';

interface HeroProps {
  onRequestFreeDataPackage: () => void;
}

const HIGHLIGHTS = [
  {
    icon: ShieldCheck,
    title: 'Independent',
    text: 'Paid only by the travel company, never by the hotel.',
  },
  {
    icon: Clock,
    title: 'Fast',
    text: 'A free desk brief within 24 hours, an on-site report within 48 hours.',
  },
  {
    icon: MapPin,
    title: 'On the Ground',
    text: 'Inspectors based in the Western Cape, from Cape Town to the Garden Route.',
  },
];

export const Hero: React.FC<HeroProps> = ({ onRequestFreeDataPackage }) => (
  <>
    {/* Photo banner */}
    <section
      className="relative flex items-center justify-center min-h-[440px] sm:min-h-[560px] bg-cover bg-center"
      style={{ backgroundImage: `url(${heroImg})` }}
    >
      <div className="absolute inset-0 bg-black/45" />
      <div className="relative z-10 px-4 py-10 text-center text-white">
        <h1>
          <img
            src={logoLightImg}
            alt="Cape Hospitality Advisors"
            className="mx-auto w-56 sm:w-80 h-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] select-none"
            loading="eager"
          />
        </h1>
        <p className="mt-6 text-2xl sm:text-4xl font-light leading-snug drop-shadow-md max-w-3xl mx-auto">
          Know what your guests will find, before they arrive.
        </p>
      </div>
    </section>

    {/* Intro + three reasons */}
    <section className="bg-white py-14 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-zinc-800">The Independent Choice</h2>
        <p className="mt-4 text-sm sm:text-base text-zinc-700 leading-relaxed max-w-3xl mx-auto">
          We check hotels in Cape Town and the Western Cape for European travel companies, anonymously and unannounced.
        </p>
        <p className="mt-3 text-sm sm:text-base text-zinc-700 leading-relaxed max-w-3xl mx-auto">
          You see what your guests will actually experience, not what a star rating said years ago.
        </p>

        <button
          onClick={onRequestFreeDataPackage}
          id="hero-primary-cta"
          className="mt-6 px-6 py-2.5 rounded-full bg-[#b38a54] hover:bg-[#9c753e] text-white text-sm font-semibold transition-colors"
        >
          Request a free virtual audit
        </button>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-10">
          {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex flex-col items-center">
              <Icon className="w-12 h-12 text-[#b38a54]" strokeWidth={1.25} />
              <h3 className="mt-4 text-xl font-light text-zinc-800">{title}</h3>
              <p className="mt-2 text-sm text-zinc-600 leading-relaxed max-w-xs">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </>
);

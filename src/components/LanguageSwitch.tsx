import React from 'react';
import { Lang, useLang } from '../i18n';

// Drawn flags: emoji flags show as letters on Windows.
const FlagZA: React.FC = () => (
  <svg viewBox="0 0 900 600" className="w-5 h-auto rounded-[2px] shadow-sm" aria-hidden="true">
    <rect width="900" height="300" fill="#E03C31" />
    <rect y="300" width="900" height="300" fill="#001489" />
    <path d="M0,0 L450,300 L0,600 M450,300 H900" fill="none" stroke="#FFF" strokeWidth="200" />
    <path d="M0,0 L450,300 L0,600 M450,300 H900" fill="none" stroke="#007749" strokeWidth="120" />
    <path d="M0,72 L342,300 L0,528 Z" fill="#FFB81C" />
    <path d="M0,120 L270,300 L0,480 Z" fill="#000" />
  </svg>
);

const FlagDE: React.FC = () => (
  <svg viewBox="0 0 5 3" className="w-5 h-auto rounded-[2px] shadow-sm" aria-hidden="true">
    <rect width="5" height="1" fill="#000" />
    <rect y="1" width="5" height="1" fill="#DD0000" />
    <rect y="2" width="5" height="1" fill="#FFCE00" />
  </svg>
);

const OPTIONS: { lang: Lang; label: string; flag: React.ReactNode }[] = [
  { lang: 'en', label: 'English', flag: <FlagZA /> },
  { lang: 'de', label: 'Deutsch', flag: <FlagDE /> },
];

export const LanguageSwitch: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { lang, setLang } = useLang();
  return (
    <div className="flex items-center gap-1" role="group" aria-label="Language / Sprache">
      {OPTIONS.map((o) => (
        <button
          key={o.lang}
          onClick={() => setLang(o.lang)}
          aria-pressed={lang === o.lang}
          title={o.label}
          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold transition-colors ${
            lang === o.lang ? 'bg-zinc-100 text-zinc-900 ring-1 ring-zinc-300' : 'text-zinc-500 hover:text-zinc-900 opacity-70 hover:opacity-100'
          }`}
        >
          {o.flag}
          <span className={compact ? 'sr-only' : ''}>{o.label}</span>
        </button>
      ))}
    </div>
  );
};

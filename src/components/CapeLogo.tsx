import React from 'react';
import logoImg from '../assets/images/logo.png';

interface CapeLogoProps {
  variant?: 'navbar' | 'full' | 'prominent' | 'mark-only';
  className?: string;
  showTagline?: boolean;
  subtitle?: string;
}

export const CapeLogo: React.FC<CapeLogoProps> = ({
  variant = 'navbar',
  className = '',
}) => {
  // 1. Variant: Prominent (Hero section primary brand display - seamlessly blended into page background)
  if (variant === 'prominent') {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <div className="relative w-full max-w-lg mx-auto flex flex-col items-center justify-center">
          <img
            src={logoImg}
            alt="Cape Hospitality Advisors - Cape Town, South Africa"
            className="w-full max-w-[310px] sm:max-w-[390px] md:max-w-[430px] h-auto object-contain select-none mix-blend-multiply transition-all"
            loading="eager"
          />
        </div>
      </div>
    );
  }

  // 2. Variant: Full (Direct full-width logo)
  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <img
          src={logoImg}
          alt="Cape Hospitality Advisors"
          className="w-full max-w-xs h-auto object-contain select-none mix-blend-multiply"
          loading="lazy"
        />
      </div>
    );
  }

  // 3. Variant: Mark-Only (Emblem / icon view for modals and badges)
  if (variant === 'mark-only') {
    return (
      <div className={`flex items-center justify-center overflow-hidden ${className}`}>
        <img
          src={logoImg}
          alt="Cape Hospitality Advisors Emblem"
          className="w-full h-full object-contain select-none mix-blend-multiply"
          loading="lazy"
        />
      </div>
    );
  }

  // 4. Default: Navbar Lockup (Compact and clean for header navigation)
  return (
    <div className={`flex items-center gap-3 text-left ${className}`}>
      <div className="h-10 sm:h-12 w-auto flex items-center justify-center">
        <img
          src={logoImg}
          alt="Cape Hospitality Advisors"
          className="h-full w-auto object-contain select-none mix-blend-multiply"
          loading="eager"
        />
      </div>
      <div className="flex flex-col justify-center leading-none">
        <span className="font-serif tracking-[0.22em] text-[#10213a] font-bold text-sm sm:text-base">
          CAPE HOSPITALITY
        </span>
        <span className="text-[9px] sm:text-[10px] tracking-[0.26em] uppercase text-[#b48c58] font-semibold mt-0.5">
          ADVISORS
        </span>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { UspSection } from './components/UspSection';
import { DataScienceSection } from './components/DataScienceSection';
import { PricingSection } from './components/PricingSection';
import { LeadCaptureFooter } from './components/LeadCaptureFooter';
import { BriefingModal } from './components/BriefingModal';
import logoImg from './assets/images/logo.png';

const SECRET_ACCESS_KEY = 'cape2026';

// Synchronous check: Runs BEFORE the page ever renders to prevent any delay/flash
const checkInitialAuth = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const params = new URLSearchParams(window.location.search);
    const accessParam = params.get('access')?.trim().toLowerCase();
    const storedAuth = localStorage.getItem('cha_authenticated') === 'true';

    if (accessParam === SECRET_ACCESS_KEY.toLowerCase() || storedAuth) {
      try {
        localStorage.setItem('cha_authenticated', 'true');
      } catch {
        // Fallback if browser blocks localStorage in private mode
      }
      return true;
    }
  } catch (err) {
    console.error('Auth verification error:', err);
  }
  return false;
};

export default function App() {
  // Initialize state directly from the check (instant unlock, 0 millisecond delay)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(checkInitialAuth);
  const [passkeyInput, setPasskeyInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isBriefingModalOpen, setIsBriefingModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string>('GOLD');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passkeyInput.trim().toLowerCase() === SECRET_ACCESS_KEY.toLowerCase()) {
      setIsAuthenticated(true);
      try {
        localStorage.setItem('cha_authenticated', 'true');
      } catch {
        // Safe fallback for strict privacy modes
      }
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid passkey. Please check with your advisory contact.');
    }
  };

  // 1. GATEWAY SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#10213a] text-white flex flex-col items-center justify-center px-6 selection:bg-white selection:text-[#10213a]">
        <div className="max-w-md w-full text-center border border-white/15 bg-white/5 p-8 sm:p-12 rounded-sm backdrop-blur-md shadow-2xl">
          <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-[#fbfbfa] p-2.5 shadow-xl flex items-center justify-center border border-white/20">
            <img src={logoImg} alt="Cape Hospitality Advisors" className="w-full h-full object-contain mix-blend-multiply" />
          </div>
          <div className="font-cinzel tracking-[0.25em] font-bold text-xl mb-2 text-[#fbfbfa]">
            CAPE HOSPITALITY
          </div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-400 font-montserrat mb-8">
            Advisors • Private Client Portal
          </p>

          <p className="text-sm text-zinc-300 font-light leading-relaxed mb-8">
            Access to our hotel inspection protocols, methodology, and pricing matrix is restricted to authorized European tour operators.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={passkeyInput}
                onChange={(e) => setPasskeyInput(e.target.value)}
                placeholder="Enter client passkey"
                className="w-full bg-white/10 border border-white/20 px-4 py-3 text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-white text-center rounded-xs tracking-wider"
              />
              {errorMsg && (
                <p className="text-rose-400 text-xs mt-2 text-left">{errorMsg}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#fbfbfa] text-[#10213a] py-3 text-xs uppercase tracking-widest font-bold hover:bg-zinc-200 transition-all rounded-xs"
            >
              Unlock Advisory Portal
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-xs text-zinc-400">
            Need access? Contact <span className="text-zinc-200 underline">advisory@capehospitalityadvisors.com</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. UNLOCKED SITE
  const handleScrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectPricingTier = (tier: string) => {
    setSelectedTier(tier);
    handleScrollToSection('contact');
  };

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-zinc-900 selection:bg-[#10213a] selection:text-white">
      <Navbar
        onScheduleBriefing={() => setIsBriefingModalOpen(true)}
        onContactClick={() => handleScrollToSection('contact')}
      />

      <main>
        <Hero
          onScheduleBriefing={() => setIsBriefingModalOpen(true)}
          onViewPricing={() => handleScrollToSection('pricing')}
        />

        <UspSection />

        <DataScienceSection />

        <PricingSection onSelectTier={handleSelectPricingTier} />

        <LeadCaptureFooter
          onScheduleBriefing={() => setIsBriefingModalOpen(true)}
          selectedTier={selectedTier}
        />
      </main>

      <BriefingModal
        isOpen={isBriefingModalOpen}
        onClose={() => setIsBriefingModalOpen(false)}
        selectedTier={selectedTier}
        onRequestSampleReport={() => {
          setIsBriefingModalOpen(false);
          handleScrollToSection('contact');
        }}
      />
    </div>
  );
}

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { RealityGapSection } from './components/RealityGapSection';
import { AgentVirtualAudit } from './components/AgentVirtualAudit';
import { UspSection } from './components/UspSection';
import { PricingSection } from './components/PricingSection';
import { LeadCaptureFooter } from './components/LeadCaptureFooter';
import { BriefingModal } from './components/BriefingModal';
import logoImg from './assets/images/logo.png';
import { ArrowRight, Sparkles, Shield, Info } from 'lucide-react';

const SECRET_ACCESS_KEY = 'cape2026';

// Synchronous check: Runs BEFORE the page ever renders
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
        // Fallback
      }
      return true;
    }
  } catch (err) {
    console.error('Auth verification error:', err);
  }
  return false;
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(checkInitialAuth);
  const [passkeyInput, setPasskeyInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isBriefingModalOpen, setIsBriefingModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string>('PHYSICAL_AUDIT');
  const [targetProperty, setTargetProperty] = useState<string>('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passkeyInput.trim().toLowerCase() === SECRET_ACCESS_KEY.toLowerCase()) {
      setIsAuthenticated(true);
      try {
        localStorage.setItem('cha_authenticated', 'true');
      } catch {
        // Safe fallback
      }
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid passkey. You can also use Instant Preview below.');
    }
  };

  const handleInstantUnlock = () => {
    setIsAuthenticated(true);
    try {
      localStorage.setItem('cha_authenticated', 'true');
    } catch {
      // Safe fallback
    }
  };

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

  const handleRequestFreeDataPackage = () => {
    setSelectedTier('VIRTUAL_AUDIT');
    handleScrollToSection('contact');
  };

  const handleSelectPropertyForInquiry = (propertyName: string) => {
    setTargetProperty(propertyName);
    setSelectedTier('PHYSICAL_AUDIT');
    handleScrollToSection('contact');
  };

  // 1. GATEWAY SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#10213a] text-white flex flex-col items-center justify-center px-4 sm:px-6 selection:bg-white selection:text-[#10213a] py-12">
        <div className="max-w-md w-full text-center border border-white/15 bg-white/5 p-7 sm:p-10 rounded-3xl backdrop-blur-md shadow-2xl">
          <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-[#fbfbfa] p-2.5 shadow-xl flex items-center justify-center border border-white/20">
            <img src={logoImg} alt="Cape Hospitality Advisors" className="w-full h-full object-contain mix-blend-multiply" />
          </div>
          <div className="font-serif tracking-[0.22em] font-bold text-xl mb-1 text-[#fbfbfa]">
            CAPE HOSPITALITY
          </div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#d9bd8b] font-mono mb-6">
            Advisors • European Tour Operator Portal
          </p>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 mb-6 text-left space-y-1.5">
            <div className="text-xs font-serif italic text-white font-semibold">
              “A five-star hotel does not automatically guarantee a five-star guest experience.”
            </div>
            <p className="text-[11px] text-zinc-300 font-light leading-relaxed">
              We provide independent and current quality perspectives for European travel companies. We observe, assess and recommend — we do not certify or legally determine compliance.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <div className="mb-2.5 flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-mono font-semibold tracking-wider text-[#d9bd8b]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d9bd8b] animate-pulse" />
                <span>Get your free data package now</span>
              </div>
              <input
                type="password"
                value={passkeyInput}
                onChange={(e) => setPasskeyInput(e.target.value)}
                placeholder="Enter client passkey (cape2026)"
                className="w-full bg-white/10 border border-white/20 px-4 py-3 text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-[#d9bd8b] text-center rounded-xl tracking-wider"
              />
              {errorMsg && (
                <p className="text-rose-400 text-xs mt-2 text-left">{errorMsg}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#b38a54] text-white py-3 text-xs uppercase tracking-widest font-bold hover:bg-[#c59b63] transition-all rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Unlock Client Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleInstantUnlock}
              className="w-full bg-white/10 text-zinc-200 hover:text-white hover:bg-white/15 py-2.5 text-xs font-semibold transition-all rounded-xl flex items-center justify-center gap-1.5 cursor-pointer border border-white/15"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#d9bd8b]" />
              <span>Explore Interactive Demo / Get Free Package</span>
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10 text-xs text-zinc-400">
            Authorized contact: <span className="text-zinc-200">advisory@capehospitalityadvisors.com</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. UNLOCKED SITE
  return (
    <div className="min-h-screen bg-[#fbfbfa] text-zinc-900 selection:bg-[#10213a] selection:text-white">
      <Navbar
        onScheduleBriefing={() => setIsBriefingModalOpen(true)}
        onContactClick={() => handleScrollToSection('contact')}
        onRequestFreeDataPackage={handleRequestFreeDataPackage}
      />

      <main>
        {/* 1. Hero Section: Core Statement & Problem Solving */}
        <Hero
          onScheduleBriefing={() => setIsBriefingModalOpen(true)}
          onViewPricing={() => handleScrollToSection('pricing')}
          onExploreVirtualAudit={() => handleScrollToSection('virtual-audit')}
          onRequestFreeDataPackage={handleRequestFreeDataPackage}
        />

        {/* 2. The Reality Gap: Observe, Assess, Recommend */}
        <RealityGapSection
          onExploreVirtualAudit={() => handleScrollToSection('virtual-audit')}
          onRequestFreeDataPackage={handleRequestFreeDataPackage}
        />

        {/* 3. The Centerpiece: Agent Virtual Audit Tool */}
        <AgentVirtualAudit
          onSelectPropertyForInquiry={handleSelectPropertyForInquiry}
          onRequestFreeDataPackage={handleRequestFreeDataPackage}
        />

        {/* 4. Why Partner With Us: Our 6 USPs */}
        <UspSection />

        {/* 5. Clear, Simplified Services & Pricing */}
        <PricingSection
          onSelectTier={handleSelectPricingTier}
          onRequestFreeDataPackage={handleRequestFreeDataPackage}
        />

        {/* 6. Lead Capture & Free Data Package Form */}
        <LeadCaptureFooter
          onScheduleBriefing={() => setIsBriefingModalOpen(true)}
          selectedTier={selectedTier}
          targetProperty={targetProperty}
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

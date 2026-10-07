import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { RealityGapSection } from './components/RealityGapSection';
import { AgentVirtualAudit } from './components/AgentVirtualAudit';
import { PhysicalAuditDossier } from './components/PhysicalAuditDossier';
import { UspSection } from './components/UspSection';
import { PricingSection } from './components/PricingSection';
import { LeadCaptureFooter } from './components/LeadCaptureFooter';
import { BriefingModal } from './components/BriefingModal';
import logoImg from './assets/images/logo.png';
import { ArrowRight, Sparkles, Shield, Lock } from 'lucide-react';

const SECRET_ACCESS_KEY = 'cape2026';

// Synchronous check: Runs BEFORE the page renders
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
      setErrorMsg('Invalid passkey. Please enter cape2026 or use the link with ?access=cape2026');
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

  const handleRequestVirtualAuditForProperty = (propertyName: string) => {
    setTargetProperty(propertyName);
    setSelectedTier('VIRTUAL_AUDIT');
    handleScrollToSection('contact');
  };

  const handleSelectPropertyForInquiry = (propertyName: string) => {
    setTargetProperty(propertyName);
    setSelectedTier('PHYSICAL_AUDIT');
    handleScrollToSection('contact');
  };

  // 1. GATEWAY SCREEN (Shown if ?access=cape2026 is missing and user has not authenticated yet)
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
            Advisors • European Travel Company Portal
          </p>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-6 text-left space-y-2">
            <div className="text-xs font-serif italic text-white font-semibold flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-[#d9bd8b]" />
              <span>Restricted Client Preview</span>
            </div>
            <p className="text-[11px] text-zinc-300 font-light leading-relaxed">
              This portal is currently private. To access, enter the passkey below or visit via your invitation link containing <code className="text-[#d9bd8b] font-mono bg-white/10 px-1 py-0.5 rounded">?access=cape2026</code>.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <input
                type="password"
                value={passkeyInput}
                onChange={(e) => setPasskeyInput(e.target.value)}
                placeholder="Enter passkey (cape2026)"
                className="w-full bg-white/10 border border-white/20 px-4 py-3 text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-[#d9bd8b] text-center rounded-xl tracking-wider"
              />
              {errorMsg && (
                <p className="text-rose-400 text-xs mt-2 text-center">{errorMsg}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#b38a54] text-white py-3 text-xs uppercase tracking-widest font-bold hover:bg-[#c59b63] transition-all rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Unlock Client Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <p className="text-[10px] text-zinc-400 font-mono">
              In simple terms: we observe, we assess and we recommend.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2. MAIN EXPERIENCE (When authenticated)
  return (
    <div className="min-h-screen bg-[#fbfbfa] text-zinc-900 selection:bg-[#10213a] selection:text-white font-sans antialiased">
      {/* Global Navigation */}
      <Navbar
        onScheduleBriefing={() => setIsBriefingModalOpen(true)}
        onRequestFreeDataPackage={handleRequestFreeDataPackage}
      />

      {/* Main Flow: Executive, Cohesive Journey */}
      <main>
        {/* 1. Hero Section: Core Statement & Problem Solving */}
        <Hero
          onScheduleBriefing={() => setIsBriefingModalOpen(true)}
          onViewPricing={() => handleScrollToSection('pricing')}
          onExploreVirtualAudit={() => handleScrollToSection('virtual-audit')}
          onRequestFreeDataPackage={handleRequestFreeDataPackage}
        />

        {/* 2. The Reality Gap: We Observe, We Assess Risk, We Recommend */}
        <RealityGapSection
          onExploreVirtualAudit={() => handleScrollToSection('virtual-audit')}
          onRequestFreeDataPackage={handleRequestFreeDataPackage}
        />

        {/* 3. The Centerpiece: Agent Virtual Audit Tool */}
        <AgentVirtualAudit
          onSelectPropertyForInquiry={handleSelectPropertyForInquiry}
          onRequestVirtualAuditForProperty={handleRequestVirtualAuditForProperty}
          onRequestFreeDataPackage={handleRequestFreeDataPackage}
        />

        {/* 4. The Workflow & Actual On-Site Physical Audit Case Study */}
        <PhysicalAuditDossier
          onCommissionAudit={() => {
            setSelectedTier('PHYSICAL_AUDIT');
            handleScrollToSection('contact');
          }}
          onRequestFreeDataPackage={handleRequestFreeDataPackage}
        />

        {/* 5. Why Partner With Us: The Institutional Edge & Comparison Matrix */}
        <UspSection />

        {/* 6. Clear, Simplified Services & Pricing */}
        <PricingSection
          onSelectTier={handleSelectPricingTier}
          onRequestFreeDataPackage={handleRequestFreeDataPackage}
        />

        {/* 7. Lead Capture & Free Data Package Form */}
        <LeadCaptureFooter
          onScheduleBriefing={() => setIsBriefingModalOpen(true)}
          selectedTier={selectedTier}
          targetProperty={targetProperty}
        />
      </main>

      {/* Direct Scheduling Briefing Modal */}
      <BriefingModal
        isOpen={isBriefingModalOpen}
        onClose={() => setIsBriefingModalOpen(false)}
        selectedTier={selectedTier}
      />
    </div>
  );
}

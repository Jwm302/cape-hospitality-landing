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

export default function App() {
  const [isBriefingModalOpen, setIsBriefingModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string>('PHYSICAL_AUDIT');
  const [targetProperty, setTargetProperty] = useState<string>('');

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

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-zinc-900 selection:bg-[#10213a] selection:text-white font-sans antialiased">
      {/* Global Navigation */}
      <Navbar
        onScheduleBriefing={() => setIsBriefingModalOpen(true)}
        onContactClick={() => handleScrollToSection('contact')}
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

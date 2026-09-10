import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { UspSection } from './components/UspSection';
import { DataScienceSection } from './components/DataScienceSection';
import { PricingSection } from './components/PricingSection';
import { LeadCaptureFooter } from './components/LeadCaptureFooter';
import { BriefingModal } from './components/BriefingModal';

export default function App() {
  const [isBriefingModalOpen, setIsBriefingModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string>('GOLD');

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
      {/* 1. Header (Navigation Bar) */}
      <Navbar
        onScheduleBriefing={() => setIsBriefingModalOpen(true)}
        onContactClick={() => handleScrollToSection('contact')}
      />

      {/* Main Clean Single-Page Structure */}
      <main>
        {/* 2. Hero with Prominent Logo matching uploaded artwork */}
        <Hero
          onScheduleBriefing={() => setIsBriefingModalOpen(true)}
          onViewPricing={() => handleScrollToSection('pricing')}
        />

        {/* 3. OUR USP (5 Essential Points) */}
        <UspSection />

        {/* 4. Data-Science & Sentiment Alignment */}
        <DataScienceSection />

        {/* 5. Pricing (Bronze €590, Silver €750, Gold €990, Platinum €1,850) */}
        <PricingSection onSelectTier={handleSelectPricingTier} />

        {/* 6. Simple Confidential Partner Inquiry & Footer */}
        <LeadCaptureFooter
          onScheduleBriefing={() => setIsBriefingModalOpen(true)}
          selectedTier={selectedTier}
        />
      </main>

      {/* Strategy Briefing Modal */}
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

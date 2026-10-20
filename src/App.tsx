import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { AgentVirtualAudit } from './components/AgentVirtualAudit';
import { PhysicalAuditDossier } from './components/PhysicalAuditDossier';
import { LeadCaptureFooter } from './components/LeadCaptureFooter';
import { PrivacyNotice } from './components/PrivacyNotice';

export default function App() {
  const [selectedTier, setSelectedTier] = useState<string>('PHYSICAL_AUDIT');
  const [targetProperty, setTargetProperty] = useState<string>('');

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectTier = (tier: string) => {
    setSelectedTier(tier);
    scrollToContact();
  };

  const handleRequestFreeDataPackage = () => handleSelectTier('VIRTUAL_AUDIT');

  const handleSelectPropertyForInquiry = (propertyName: string, tier: string) => {
    setTargetProperty(propertyName);
    handleSelectTier(tier);
  };

  // vercel.json serves index.html for every path, so extra pages are routed here.
  const path = window.location.pathname.replace(/\/+$/, '');
  if (path === '/privacy') {
    return <PrivacyNotice />;
  }

  const page =
    path === '/sample-report' ? (
      <main className="bg-[#f5f5f3]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <a href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9c753e] hover:text-[#10213a]">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to the website
          </a>
        </div>
        <PhysicalAuditDossier
          onCommissionAudit={() => (window.location.href = '/#contact')}
          onRequestFreeDataPackage={() => (window.location.href = '/#contact')}
        />
      </main>
    ) : (
      <main>
        <Hero onRequestFreeDataPackage={handleRequestFreeDataPackage} />
        <AgentVirtualAudit
          onSelectPropertyForInquiry={(name) => handleSelectPropertyForInquiry(name, 'PHYSICAL_AUDIT')}
          onRequestVirtualAuditForProperty={(name) => handleSelectPropertyForInquiry(name, 'VIRTUAL_AUDIT')}
          onRequestFreeDataPackage={handleRequestFreeDataPackage}
        />
        <ServicesSection onSelectTier={handleSelectTier} />
        <LeadCaptureFooter selectedTier={selectedTier} targetProperty={targetProperty} />
      </main>
    );

  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-[#10213a] selection:text-white font-sans antialiased">
      <Navbar />
      {page}
    </div>
  );
}

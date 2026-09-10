import React, { useState } from 'react';
import { X, Lock, Download, CheckCircle2, AlertTriangle, FileText, Camera, Shield, Printer, ChevronRight } from 'lucide-react';
import { LeadFormData } from '../types';
import reportImage from '../assets/images/audit_report_preview_1788963233970.jpg';
import { CapeLogo } from './CapeLogo';

interface SampleReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadData?: LeadFormData;
  onScheduleBriefing: () => void;
}

export const SampleReportModal: React.FC<SampleReportModalProps> = ({
  isOpen,
  onClose,
  leadData,
  onScheduleBriefing,
}) => {
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleDownloadSimulatedPdf = () => {
    setDownloaded(true);
    const tierPrices: Record<string, number> = { BRONZE: 590, SILVER: 750, GOLD: 990, PLATINUM: 1850 };
    const currentTier = leadData?.selectedTier || 'GOLD';
    const currentPrice = tierPrices[currentTier] || 990;
    const reportText = `CAPE HOSPITALITY ADVISERS
CONFIDENTIAL HOTEL QUALITY INSPECTION AUDIT REPORT (SAMPLE EXCERPT)
Prepared for: ${leadData?.company || 'Premier European Tour Operator'}
Recipient: ${leadData?.name || 'Executive Director'}
Package Tier: ${currentTier} (€${currentPrice})
Property Inspected: [REDACTED 5-STAR LUXURY BOUTIQUE RETREAT, CAPE PENINSULA / GARDEN ROUTE]
Inspection Type: 100% Anonymous Mystery Guest (2 Nights / 3 Days)
Turnaround SLA: 48 Hours Post-Checkout
Overall Composite Quality Index: 91.4% (Threshold: 90.0%)

PILLAR BREAKDOWN:
1. Guest Journey & Service Flow: 94.2% [PASS]
   - Flawless pre-arrival coordination & champagne greeting.
   - Minor: Luggage arrival delayed by 9 minutes at eastern suite.
2. Housekeeping & Room Readiness: 96.1% [PASS]
   - Technical cleanliness pristine; HVAC sound decibels measured at 31dB (excellent).
   - Minor: Plunge pool thermostat calibrated 4°C below standard night setpoint.
3. Food & Beverage Excellence: 84.0% [ACTION REQUIRED]
   - Breakfast presentation exceptional.
   - Dinner service pacing issue: 38 min gap between course 2 and course 3.
   - Action: Expediter kitchen line re-training recommended.
4. Safety, Life-Safety & Compliance: 92.5% [ACTION REQUIRED]
   - Water filtration testing meets European potable standards.
   - Finding: Secondary night egress corridor impeded by laundry trolley. Immediate corrective action logged.

DATA SCIENCE & SENTIMENT ALIGNMENT:
Triangulated against 1,480 historic guest reviews (TripAdvisor & Booking.com) identifying €14,200 annual revenue leakage from dinner service pacing delays.

CONFIDENTIALITY GUARANTEE:
This document is distributed under strict bilateral NDA. The audited hotel has not been alerted to this inspection.`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'CHA_Confidential_Audit_Report_Sample.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white border border-zinc-200 rounded-3xl shadow-2xl overflow-hidden text-left">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-4 bg-zinc-50 border-b border-zinc-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-8 rounded-xl bg-white border border-zinc-200 flex items-center justify-center p-1 shadow-xs">
              <CapeLogo variant="mark-only" className="w-full h-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-sans text-sm sm:text-base font-extrabold text-[#162544]">
                  Sample Executive Audit Dossier
                </h3>
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700">
                  Confidential
                </span>
              </div>
              <p className="text-[11px] text-zinc-500">
                Cape Hospitality Advisers &bull; 48-Hour Turnaround Deliverable
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-500 hover:text-zinc-900 rounded-full hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Operator recipient strip */}
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-mono font-semibold">
                Recipient Dossier:
              </span>
              <span className="text-[#162544] font-bold ml-2">
                {leadData?.name || 'Authorized Operator'} ({leadData?.company || 'European Tour Operator Partner'})
              </span>
            </div>
            <div className="text-[11px] text-[#a07c48] font-mono font-bold">
              Audit Ref: #CHA-ZA-2026-084
            </div>
          </div>

          {/* Document visual with redacted overlay */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-5 rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-100 relative shadow-sm">
              <img
                src={reportImage}
                alt="Confidential Report Dossier"
                referrerPolicy="no-referrer"
                className="w-full h-64 object-cover object-top filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-white/95 backdrop-blur-md border border-zinc-200 text-[11px] shadow-sm">
                <div className="text-[#a07c48] font-bold">Includes Photographic Proof</div>
                <div className="text-zinc-600">36-page unannounced audit binder</div>
              </div>
            </div>

            <div className="md:col-span-7 space-y-4">
              <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono uppercase text-zinc-500 font-semibold">Composite Score</span>
                  <span className="font-mono text-2xl font-extrabold text-[#162544]">91.4%</span>
                </div>
                <div className="space-y-2.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-zinc-700 font-medium">1. Guest Journey & Service Flow</span>
                    <span className="text-[#a07c48] font-mono font-bold">94.2%</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-zinc-700 font-medium">2. Housekeeping & Room Readiness</span>
                    <span className="text-[#a07c48] font-mono font-bold">96.1%</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-zinc-700 font-medium">3. Food & Beverage Excellence</span>
                    <span className="text-amber-700 font-mono font-bold">84.0% (Action Required)</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-zinc-700 font-medium">4. Safety & Compliance</span>
                    <span className="text-[#a07c48] font-mono font-bold">92.5%</span>
                  </div>
                </div>
              </div>

              {/* Sample Gaps Section */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-bold">
                  Sample Actionable Gap & Corrective Recommendation:
                </span>
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-[11px] space-y-2">
                  <div className="flex items-center gap-1.5 text-amber-800 font-bold">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Food & Beverage Pacing (Dinner Day 1)</span>
                  </div>
                  <p className="text-zinc-700 leading-relaxed">
                    <strong>Audit Finding:</strong> 38-minute delay between appetizer clearing and entrée service at Table 4. Sommelier served reserve red wine too early at ambient room temperature (24°C vs standard 17°C).
                  </p>
                  <p className="text-zinc-600 leading-relaxed">
                    <strong className="text-[#a07c48]">Action Recommendation for Lodge GM:</strong> Implement kitchen expeditor ticket timing boards; calibrate wine room cooler sensors before safari dinner peak.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center gap-3">
            <Lock className="w-4 h-4 text-[#a07c48] shrink-0" />
            <span className="text-[11px] text-zinc-600 leading-relaxed font-normal">
              Full 420-point checklist includes UV cleanliness testing, emergency generator load verification, staff tip handling equity, and German-speaking guest assistance responsiveness.
            </span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-5 sm:px-8 bg-zinc-50 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleDownloadSimulatedPdf}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-100 transition-colors cursor-pointer text-xs font-semibold shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-[#a07c48]" />
            <span>{downloaded ? 'Sample Excerpt Downloaded' : 'Download Sample Dossier (.txt)'}</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onScheduleBriefing();
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#162544] text-white hover:bg-[#1f3460] transition-colors cursor-pointer text-xs font-bold shadow-sm"
            >
              <span>Schedule Confidential Briefing</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

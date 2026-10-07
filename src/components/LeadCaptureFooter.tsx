import React, { useState } from 'react';
import {
  CheckCircle2,
  Lock,
  ArrowRight,
  Mail,
  Building,
  User,
  MapPin,
  Sparkles,
  FileSpreadsheet
} from 'lucide-react';
import { LeadFormData } from '../types';

interface LeadCaptureFooterProps {
  onScheduleBriefing: () => void;
  selectedTier?: string;
  targetProperty?: string;
}

export const LeadCaptureFooter: React.FC<LeadCaptureFooterProps> = ({
  onScheduleBriefing,
  selectedTier = 'PHYSICAL_AUDIT',
  targetProperty = '',
}) => {
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    company: '',
    corporateEmail: '',
    location: targetProperty || '',
    selectedTier: selectedTier,
  });

  React.useEffect(() => {
    if (selectedTier) {
      setFormData((prev) => ({ ...prev, selectedTier }));
    }
  }, [selectedTier]);

  React.useEffect(() => {
    if (targetProperty) {
      setFormData((prev) => ({ ...prev, location: targetProperty }));
    }
  }, [targetProperty]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.company.trim() || !formData.corporateEmail.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    if (!formData.corporateEmail.includes('@') || !formData.corporateEmail.includes('.')) {
      setErrorMsg('Please provide a valid corporate email address.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 450);
  };

  return (
    <footer id="contact" className="bg-[#fbfbfa] border-t border-zinc-200/80 pt-16 sm:pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Contact Form Card */}
        <div className="max-w-3xl mx-auto rounded-3xl bg-white border border-zinc-200 p-8 sm:p-10 shadow-sm text-left mb-16">
          
          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 bg-zinc-50 text-xs font-semibold text-zinc-700 shadow-xs mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#b38a54]" />
              <span className="tracking-wider uppercase font-mono text-[11px]">
                Travel Company Inquiries
              </span>
            </div>
            
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#10213a] tracking-tight font-serif">
              Ensure Your Customers Receive the Experience You Sold Them
            </h3>

            <p className="mt-2 text-xs sm:text-sm text-zinc-600 font-normal leading-relaxed">
              Request an independent Agent Virtual Audit, obtain a free data package, or commission an on-the-ground mystery inspection across Cape Town and the Garden Route.
            </p>
          </div>

          {isSubmitted ? (
            <div
              id="lead-capture-success"
              className="p-8 rounded-2xl bg-zinc-50 border border-zinc-200 text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-[#10213a]">
                Request Confirmed
              </h4>
              <p className="text-xs sm:text-sm text-zinc-600 max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-zinc-900">{formData.name}</strong> ({formData.company}). Your request for <span className="font-semibold text-[#10213a]">{formData.selectedTier === 'VIRTUAL_AUDIT' ? 'Free Data Package' : 'Hotel Quality Audit'}</span> has been received. Our senior advisory contact will reach out to <span className="font-mono text-[#10213a] font-semibold">{formData.corporateEmail}</span> within 4 hours.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="text-xs text-zinc-500 hover:text-zinc-800 underline pt-2 cursor-pointer"
              >
                Submit another inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} id="lead-capture-form" className="space-y-4">
              
              {/* High-Contrast Free Data Package Banner */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#10213a]/5 border border-[#10213a]/15">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#b38a54] animate-pulse" />
                  <span className="text-xs sm:text-sm font-bold text-[#10213a] tracking-wide">
                    Get your free data package now
                  </span>
                </div>
                <span className="text-[11px] font-mono font-medium text-zinc-500 hidden sm:inline">
                  Instant Access • Zero Obligation
                </span>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                  {errorMsg}
                </div>
              )}

              {/* 3 Main Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {/* Field 1: Name */}
                <div className="space-y-1">
                  <label htmlFor="field-name" className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 font-mono">
                    Your Name *
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="field-name"
                      type="text"
                      required
                      placeholder="e.g. Thomas Weber"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-[#10213a] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Field 2: Company */}
                <div className="space-y-1">
                  <label htmlFor="field-company" className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 font-mono">
                    Travel Company / Agency *
                  </label>
                  <div className="relative">
                    <Building className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="field-company"
                      type="text"
                      required
                      placeholder="e.g. DER Touristik / Studiosus"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-[#10213a] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Field 3: Email */}
                <div className="space-y-1">
                  <label htmlFor="field-corporate-email" className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 font-mono">
                    Work Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="field-corporate-email"
                      type="email"
                      required
                      placeholder="weber@touristik.de"
                      value={formData.corporateEmail}
                      onChange={(e) => setFormData({ ...formData, corporateEmail: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-[#10213a] focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Service Selection & Target Hotel */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label htmlFor="field-service-tier" className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 font-mono">
                    Requested Service / Option
                  </label>
                  <select
                    id="field-service-tier"
                    value={formData.selectedTier}
                    onChange={(e) => setFormData({ ...formData, selectedTier: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-[#10213a] focus:bg-white transition-all font-medium"
                  >
                    <option value="VIRTUAL_AUDIT">01 — Agent Virtual Audit & Free Data Package (Complimentary)</option>
                    <option value="PHYSICAL_AUDIT">02 — On-Site Mystery Hotel Audit (⭐ Most Popular)</option>
                    <option value="PARTNERSHIP">03 — Continuous Portfolio Quality Monitoring</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="field-target-location" className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 font-mono">
                    Target Property or Destination
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="field-target-location"
                      type="text"
                      placeholder="e.g. Cape Town Waterfront, Franschhoek, Knysna"
                      value={formData.location || ''}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-[#10213a] focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  id="footer-submit-btn"
                  className="w-full py-3.5 px-6 rounded-full bg-[#10213a] text-white font-bold text-xs hover:bg-[#1a335a] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Processing Request...</span>
                  ) : (
                    <>
                      <span>Submit Inquiry & Receive Data Package</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              {/* Legal clarity & Discretion notice */}
              <div className="pt-2 text-center space-y-1.5">
                <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500">
                  <Lock className="w-3 h-3 text-[#b38a54]" />
                  <span>Strict confidentiality: In simple terms: we observe, we assess and we recommend — zero data shared with audited hotels.</span>
                </div>
                <p className="text-[10px] text-zinc-400 font-mono">
                  “A five-star hotel does not automatically guarantee a five-star guest experience.”
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Clean Footer Info */}
        <div className="pt-8 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <span className="font-bold text-[#10213a]">Cape Hospitality Advisors</span>
            <span className="hidden sm:inline text-zinc-300">|</span>
            <span>Cape Town & Garden Route, South Africa</span>
            <span className="hidden sm:inline text-zinc-300">|</span>
            <span className="font-mono text-[#b38a54]">advisory@capehospitalityadvisors.com</span>
          </div>
          <p>© {new Date().getFullYear()} Cape Hospitality Advisors. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
};

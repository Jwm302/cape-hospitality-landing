import React, { useState } from 'react';
import {
  CheckCircle2,
  Lock,
  ArrowRight,
  Mail,
  Building,
  User,
  MapPin,
  Calendar,
} from 'lucide-react';
import { LeadFormData } from '../types';

interface LeadCaptureFooterProps {
  onScheduleBriefing: () => void;
  selectedTier?: string;
}

export const LeadCaptureFooter: React.FC<LeadCaptureFooterProps> = ({
  onScheduleBriefing,
  selectedTier = 'GOLD',
}) => {
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    company: '',
    corporateEmail: '',
    location: '',
    selectedTier: selectedTier,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.company.trim() || !formData.corporateEmail.trim()) {
      setErrorMsg('Please complete all fields.');
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
    }, 400);
  };

  return (
    <footer id="contact" className="bg-[#fbfbfa] border-t border-zinc-200/80 pt-16 sm:pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Contact Form Card */}
        <div className="max-w-3xl mx-auto rounded-3xl bg-white border border-zinc-200 p-8 sm:p-10 shadow-sm text-left mb-16">
          <div className="text-center max-w-xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 bg-zinc-50 text-xs font-semibold text-zinc-700 shadow-xs mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#b38a54]" />
              <span className="tracking-wider uppercase font-mono text-[11px]">Direct Partner Inquiries</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#10213a] tracking-tight">
              Initiate a Confidential Audit
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-zinc-600 font-normal leading-relaxed">
              Our physical field operations focus exclusively on luxury hotel assets in Cape Town, the Cape Peninsula, and the Garden Route. We respond to European travel operators within 4 hours.
            </p>
          </div>

          {isSubmitted ? (
            <div
              id="lead-capture-success"
              className="p-8 rounded-2xl bg-zinc-50 border border-zinc-200 text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-[#10213a]">
                Inquiry Received
              </h4>
              <p className="text-xs sm:text-sm text-zinc-600 max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-zinc-900">{formData.name}</strong> ({formData.company}). Our senior auditor will contact you shortly at{' '}
                <span className="font-mono text-[#10213a] font-semibold">{formData.corporateEmail}</span>.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="text-xs text-zinc-500 hover:text-zinc-800 underline pt-2 cursor-pointer"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} id="lead-capture-form" className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {/* Field 1: Name */}
                <div className="space-y-1">
                  <label htmlFor="field-name" className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700">
                    Your Name
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="field-name"
                      type="text"
                      required
                      placeholder="e.g. Thomas Becker"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-[#10213a] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Field 2: Company */}
                <div className="space-y-1">
                  <label htmlFor="field-company" className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700">
                    Tour Operator / Agency
                  </label>
                  <div className="relative">
                    <Building className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="field-company"
                      type="text"
                      required
                      placeholder="Company name"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-[#10213a] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Field 3: Email */}
                <div className="space-y-1">
                  <label htmlFor="field-corporate-email" className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700">
                    Work Email
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="field-corporate-email"
                      type="email"
                      required
                      placeholder="email@company.de"
                      value={formData.corporateEmail}
                      onChange={(e) => setFormData({ ...formData, corporateEmail: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-[#10213a] focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Field 4: Target Property Location */}
              <div className="space-y-1">
                <label htmlFor="field-target-location" className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700">
                  Target Property Location
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="field-target-location"
                    type="text"
                    placeholder="Target Property Location (e.g., Cape Town, Stellenbosch, Knysna, Plettenberg Bay, or Garden Route Region)"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-[#10213a] focus:bg-white transition-all placeholder:text-zinc-400"
                  />
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
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <span>Submit Confidential Inquiry</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                {/* Subtle validation note */}
                <p className="text-[11px] text-zinc-500 text-center mt-2.5 font-normal leading-relaxed">
                  <strong className="font-semibold text-zinc-700">Bitte beachten Sie:</strong> Unser hybrides Prüfnetzwerk konzentriert sich exklusiv auf Hotelbestände in Kapstadt, der Kap-Halbinsel und der Garden Route.
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500 pt-1">
                <Lock className="w-3 h-3 text-[#b38a54]" />
                <span>Strict non-disclosure: Zero data shared with inspected properties</span>
              </div>
            </form>
          )}
        </div>

        {/* Clean Footer Info */}
        <div className="pt-8 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <span className="font-semibold text-zinc-800">Cape Hospitality Advisers</span>
            <span className="hidden sm:inline text-zinc-300">|</span>
            <span>Cape Town, South Africa</span>
            <span className="hidden sm:inline text-zinc-300">|</span>
            <span className="font-mono text-[#b38a54]">contact@capehospitalityadvisers.com</span>
          </div>
          <p>© {new Date().getFullYear()} Cape Hospitality Advisers. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

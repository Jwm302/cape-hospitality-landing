import React, { useState } from 'react';
import { SERVICE_TIERS, getServiceTier } from '../data/landingData';
import { CONTACT_EMAIL, sendInquiry, mailtoLink } from '../lib/sendInquiry';
import { X, Calendar, Clock, CheckCircle2, Shield, ArrowRight, Building, Mail, User, ChevronRight } from 'lucide-react';

interface BriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTier?: string;
}

export const BriefingModal: React.FC<BriefingModalProps> = ({
  isOpen,
  onClose,
  selectedTier,
}) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [fallbackHref, setFallbackHref] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    tier: selectedTier || 'PHYSICAL_AUDIT',
    date: '',
    focusRegion: 'Cape Town & Peninsula Luxury Assets',
    notes: '',
  });

  React.useEffect(() => {
    if (selectedTier) {
      setFormData((prev) => ({ ...prev, tier: selectedTier }));
    }
  }, [selectedTier]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setFallbackHref('');
    setIsSubmitting(true);

    const subject = `Briefing request — ${formData.company}`;
    const fields = {
      Name: formData.name,
      Company: formData.company,
      Email: formData.email,
      Service: getServiceTier(formData.tier).title,
      Region: formData.focusRegion,
      'Preferred times': formData.date,
    };

    try {
      await sendInquiry(subject, fields, formData.email);
      setStep('success');
    } catch {
      setErrorMsg(`Your request could not be sent. Please email us directly at ${CONTACT_EMAIL}.`);
      setFallbackHref(mailtoLink(subject, fields));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border border-zinc-200 rounded-3xl shadow-2xl overflow-hidden text-left">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-4 bg-zinc-50 border-b border-zinc-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#162544] flex items-center justify-center text-white shadow-xs">
              <Calendar className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-sans text-sm sm:text-base font-extrabold text-[#162544]">
                Schedule Portfolio Briefing
              </h3>
              <p className="text-[11px] text-zinc-500">20-Minute Confidential Strategy Call</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-500 hover:text-zinc-900 rounded-full hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {step === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-[11px] text-zinc-600 leading-relaxed font-normal">
                Meet with our Cape Town inspection directors to discuss your Western Cape hotel portfolio (from Cape Town to the Garden Route), mystery audit scheduling, and risk mitigation priorities.
              </div>

              <div className="space-y-1.5 text-left">
                <label className="block font-bold uppercase tracking-wider text-zinc-700 text-[11px] font-mono">
                  Full Name <span className="text-[#a07c48]">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Stefan Krause"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-3 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#162544] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5 text-left">
                  <label className="block font-bold uppercase tracking-wider text-zinc-700 text-[11px] font-mono">
                    Company (Travel Company) <span className="text-[#a07c48]">*</span>
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kuoni Reisen"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full pl-10 pr-3 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#162544] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="block font-bold uppercase tracking-wider text-zinc-700 text-[11px] font-mono">
                    Corporate Email <span className="text-[#a07c48]">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="s.krause@kuoni.ch"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-3 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#162544] focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="block font-bold uppercase tracking-wider text-zinc-700 text-[11px] font-mono">
                  Service of Interest
                </label>
                <select
                  value={formData.tier}
                  onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                  className="w-full px-3.5 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 focus:outline-none focus:border-[#162544] transition-all font-medium"
                >
                  {SERVICE_TIERS.map((t) => (
                    <option key={t.key} value={t.key}>
                      {t.tierNumber} — {t.shortLabel}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="block font-bold uppercase tracking-wider text-zinc-700 text-[11px] font-mono">
                  Primary Regional Focus
                </label>
                <select
                  value={formData.focusRegion}
                  onChange={(e) => setFormData({ ...formData, focusRegion: e.target.value })}
                  className="w-full px-3.5 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 focus:outline-none focus:border-[#162544] transition-all"
                >
                  <option value="Cape Town & Peninsula Luxury Assets">Cape Town & Peninsula (Atlantic Seaboard, V&A, City Bowl)</option>
                  <option value="Cape Winelands & Estates">Cape Winelands (Stellenbosch, Franschhoek, Paarl)</option>
                  <option value="Garden Route Coastal Properties">Garden Route Coastal Corridor (Knysna, Plettenberg Bay, George)</option>
                  <option value="Overberg & Whale Coast">Overberg & Whale Coast (Hermanus, Walker Bay)</option>
                  <option value="Entire Western Cape Portfolio">Entire Western Cape Portfolio (Cape Town to Garden Route)</option>
                </select>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="block font-bold uppercase tracking-wider text-zinc-700 text-[11px] font-mono">
                  Preferred Days & Times (CET)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tue or Thu afternoon"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3.5 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#162544] focus:bg-white transition-all"
                />
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                  {errorMsg}
                  {fallbackHref && (
                    <>
                      {' '}
                      <a href={fallbackHref} className="underline font-semibold">
                        Open a pre-filled email
                      </a>
                    </>
                  )}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full disabled:opacity-50 py-3.5 px-6 rounded-full bg-[#162544] text-white font-bold tracking-wide hover:bg-[#1f3460] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 text-xs shadow-sm active:scale-[0.99]"
                >
                  <span>{isSubmitting ? 'Sending...' : 'Request Briefing'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[10px] text-zinc-400 text-center">
                We use your details only to arrange the briefing.{' '}
                <a href="/privacy" className="underline hover:text-zinc-700">Privacy notice</a>
              </p>
            </form>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-sans text-xl font-extrabold text-[#162544]">Request Received</h3>
              <p className="text-xs text-zinc-600 leading-relaxed max-w-sm mx-auto">
                Thank you. We will email <span className="font-mono text-emerald-700 font-bold">{formData.email}</span> to confirm a time for your 20-minute briefing.
              </p>
              <div className="pt-3 flex justify-center gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-800 text-xs font-semibold hover:bg-zinc-200 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

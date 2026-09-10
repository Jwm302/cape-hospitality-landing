import React, { useState } from 'react';
import { X, Calendar, Clock, CheckCircle2, Shield, ArrowRight, Building, Mail, User, ChevronRight } from 'lucide-react';

interface BriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestSampleReport: () => void;
  selectedTier?: string;
}

export const BriefingModal: React.FC<BriefingModalProps> = ({
  isOpen,
  onClose,
  onRequestSampleReport,
  selectedTier,
}) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    tier: selectedTier || 'GOLD',
    date: 'Tomorrow at 14:00 CET',
    focusRegion: 'Cape Town & Peninsula Luxury Assets',
    notes: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('success');
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
                    Company (Operator) <span className="text-[#a07c48]">*</span>
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
                  Preferred Time Window
                </label>
                <select
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3.5 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 focus:outline-none focus:border-[#162544] transition-all"
                >
                  <option value="Tomorrow at 10:00 CET">Tomorrow at 10:00 CET (Munich / Zurich / Frankfurt)</option>
                  <option value="Tomorrow at 14:00 CET">Tomorrow at 14:00 CET (Munich / Zurich / Frankfurt)</option>
                  <option value="Thursday at 11:00 CET">Thursday at 11:00 CET</option>
                  <option value="Next Week Monday 15:00 CET">Next Week Monday 15:00 CET</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-full bg-[#162544] text-white font-bold tracking-wide hover:bg-[#1f3460] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 text-xs shadow-sm active:scale-[0.99]"
                >
                  <span>Confirm Confidential Briefing</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-sans text-xl font-extrabold text-[#162544]">Briefing Confirmed</h3>
              <p className="text-xs text-zinc-600 leading-relaxed max-w-sm mx-auto">
                We have registered your briefing for <strong className="text-zinc-900">{formData.date}</strong>. A calendar invitation and bilateral NDA confirmation have been sent to <span className="font-mono text-emerald-700 font-bold">{formData.email}</span>.
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

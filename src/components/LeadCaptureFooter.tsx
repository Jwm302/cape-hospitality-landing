import React, { useState } from 'react';
import {
  CheckCircle2,
  Lock,
  ArrowRight,
  Mail,
  Building,
  User,
  MapPin,
} from 'lucide-react';
import { LeadFormData } from '../types';
import { getServiceTier, tiersFor } from '../data/landingData';
import { CONTACT_EMAIL, sendInquiry, mailtoLink } from '../lib/sendInquiry';
import { useLang } from '../i18n';

interface LeadCaptureFooterProps {
  selectedTier?: string;
  targetProperty?: string;
}

const COPY = {
  en: {
    title: 'Contact Us',
    intro: 'Tell us which hotel concerns you. We reply within 4 hours on business days.',
    required: 'Please complete all required fields.',
    invalidEmail: 'Please provide a valid corporate email address.',
    sendFailed: `Your inquiry could not be sent. Please email us directly at ${CONTACT_EMAIL}.`,
    openEmail: 'Open a pre-filled email',
    confirmed: 'Request Confirmed',
    thanks: (name: string, company: string, service: string, email: string) => (
      <>
        Thank you, <strong className="text-zinc-900">{name}</strong> ({company}). Your request for{' '}
        <span className="font-semibold text-[#10213a]">{service}</span> has been received. Our senior advisory contact
        will reach out to <span className="font-mono text-[#10213a] font-semibold">{email}</span> within 4 hours.
      </>
    ),
    another: 'Submit another inquiry',
    name: 'Your Name *',
    namePh: 'e.g. Thomas Weber',
    companyPh: 'e.g. DER Touristik / Studiosus',
    company: 'Travel Company / Agency *',
    email: 'Work Email *',
    service: 'Service',
    target: 'Target Property or Destination',
    targetPh: 'e.g. Cape Town Waterfront, Franschhoek, Knysna',
    sending: 'Processing Request...',
    submitFree: 'Request Free Virtual Audit',
    submit: 'Send Inquiry',
    confidential: 'Strictly confidential. Nothing is shared with the hotels we audit. We observe and report; we do not provide technical or legal certification. See our',
    privacy: 'privacy notice',
    footerTagline: 'Independent hotel inspections for travel companies',
    contact: 'Contact',
    location: 'Cape Town & Garden Route, South Africa',
    privacyCap: 'Privacy notice',
  },
  de: {
    title: 'Kontakt',
    intro: 'Nennen Sie uns das Hotel, um das es geht. Wir antworten an Werktagen innerhalb von 4 Stunden.',
    required: 'Bitte füllen Sie alle Pflichtfelder aus.',
    invalidEmail: 'Bitte geben Sie eine gültige geschäftliche E-Mail-Adresse an.',
    sendFailed: `Ihre Anfrage konnte nicht gesendet werden. Bitte schreiben Sie uns direkt an ${CONTACT_EMAIL}.`,
    openEmail: 'Vorausgefüllte E-Mail öffnen',
    confirmed: 'Anfrage bestätigt',
    thanks: (name: string, company: string, service: string, email: string) => (
      <>
        Vielen Dank, <strong className="text-zinc-900">{name}</strong> ({company}). Ihre Anfrage für{' '}
        <span className="font-semibold text-[#10213a]">{service}</span> ist eingegangen. Unser Ansprechpartner meldet sich
        innerhalb von 4 Stunden unter <span className="font-mono text-[#10213a] font-semibold">{email}</span>.
      </>
    ),
    another: 'Weitere Anfrage senden',
    name: 'Ihr Name *',
    namePh: 'z. B. Thomas Weber',
    companyPh: 'z. B. DER Touristik / Studiosus',
    company: 'Reiseveranstalter / Agentur *',
    email: 'Geschäftliche E-Mail *',
    service: 'Leistung',
    target: 'Hotel oder Reiseziel',
    targetPh: 'z. B. Kapstadt Waterfront, Franschhoek, Knysna',
    sending: 'Anfrage wird gesendet...',
    submitFree: 'Kostenloses Virtuelles Audit anfordern',
    submit: 'Anfrage senden',
    confidential: 'Streng vertraulich. Nichts wird mit den geprüften Hotels geteilt. Wir beobachten und berichten; wir erteilen keine technischen oder rechtlichen Zertifizierungen. Siehe unsere',
    privacy: 'Datenschutzhinweise',
    footerTagline: 'Unabhängige Hotelinspektionen für Reiseveranstalter',
    contact: 'Kontakt',
    location: 'Kapstadt & Garden Route, Südafrika',
    privacyCap: 'Datenschutzhinweise',
  },
};

export const LeadCaptureFooter: React.FC<LeadCaptureFooterProps> = ({
  selectedTier = 'PHYSICAL_AUDIT',
  targetProperty = '',
}) => {
  const { lang } = useLang();
  const c = COPY[lang];
  const tiers = tiersFor(lang);
  const tierTitle = (key: string) => (tiers.find((t) => t.key === key) ?? tiers[1]).title;

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
  const [fallbackHref, setFallbackHref] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.company.trim() || !formData.corporateEmail.trim()) {
      setErrorMsg(c.required);
      return;
    }

    if (!formData.corporateEmail.includes('@') || !formData.corporateEmail.includes('.')) {
      setErrorMsg(c.invalidEmail);
      return;
    }

    setErrorMsg('');
    setFallbackHref('');
    setIsSubmitting(true);

    // The email to our team stays in English and says which language to reply in.
    const serviceTitle = getServiceTier(formData.selectedTier || '').title;
    const subject = `Website inquiry: ${serviceTitle} — ${formData.company}`;
    const fields = {
      Name: formData.name,
      Company: formData.company,
      Email: formData.corporateEmail,
      Service: serviceTitle,
      'Property or destination': formData.location,
      ...(lang === 'de' ? { Language: 'German (Deutsch): please reply in German' } : {}),
    };

    try {
      await sendInquiry(subject, fields, formData.corporateEmail);
      setIsSubmitted(true);
    } catch {
      setErrorMsg(c.sendFailed);
      setFallbackHref(mailtoLink(subject, fields));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <section id="contact" className="bg-white border-t border-zinc-200 py-14 sm:py-16 scroll-mt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Contact Form */}
        <div className="max-w-3xl mx-auto text-left">

          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-800">
              {c.title}
            </h2>

            <p className="mt-3 text-sm sm:text-base text-zinc-700 leading-relaxed">
              {c.intro}
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
                {c.confirmed}
              </h4>
              <p className="text-xs sm:text-sm text-zinc-600 max-w-md mx-auto leading-relaxed">
                {c.thanks(formData.name, formData.company, tierTitle(formData.selectedTier || ''), formData.corporateEmail)}
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="text-xs text-zinc-500 hover:text-zinc-800 underline pt-2 cursor-pointer"
              >
                {c.another}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} id="lead-capture-form" className="space-y-4">

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                  {errorMsg}
                  {fallbackHref && (
                    <>
                      {' '}
                      <a href={fallbackHref} className="underline font-semibold">
                        {c.openEmail}
                      </a>
                    </>
                  )}
                </div>
              )}

              {/* 3 Main Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {/* Field 1: Name */}
                <div className="space-y-1">
                  <label htmlFor="field-name" className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 font-mono">
                    {c.name}
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="field-name"
                      type="text"
                      required
                      placeholder={c.namePh}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-[#10213a] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Field 2: Company */}
                <div className="space-y-1">
                  <label htmlFor="field-company" className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 font-mono">
                    {c.company}
                  </label>
                  <div className="relative">
                    <Building className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="field-company"
                      type="text"
                      required
                      placeholder={c.companyPh}
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-[#10213a] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Field 3: Email */}
                <div className="space-y-1">
                  <label htmlFor="field-corporate-email" className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 font-mono">
                    {c.email}
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
                    {c.service}
                  </label>
                  <select
                    id="field-service-tier"
                    value={formData.selectedTier}
                    onChange={(e) => setFormData({ ...formData, selectedTier: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-[#10213a] focus:bg-white transition-all font-medium"
                  >
                    {tiers.map((t) => (
                      <option key={t.key} value={t.key}>
                        {t.tierNumber} — {t.shortLabel}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="field-target-location" className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 font-mono">
                    {c.target}
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="field-target-location"
                      type="text"
                      placeholder={c.targetPh}
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
                    <span>{c.sending}</span>
                  ) : (
                    <>
                      <span>{formData.selectedTier === 'VIRTUAL_AUDIT' ? c.submitFree : c.submit}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              {/* Legal clarity & Discretion notice */}
              <div className="pt-2 text-center space-y-1.5">
                <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500">
                  <Lock className="w-3 h-3 text-[#b38a54]" />
                  <span>
                    {c.confidential}{' '}
                    <a href="/privacy" className="underline hover:text-zinc-800">{c.privacy}</a>.
                  </span>
                </div>
              </div>
            </form>
          )}
        </div>

      </div>
    </section>

    {/* Footer */}
    <footer className="bg-zinc-500 text-white text-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row justify-between gap-6">
        <div>
          <p className="font-semibold">Cape Hospitality Advisors</p>
          <p className="mt-1 text-zinc-100">{c.footerTagline}</p>
        </div>
        <div className="space-y-1">
          <p className="font-semibold">{c.contact}</p>
          <p>
            E-mail: <a href={`mailto:${CONTACT_EMAIL}`} className="hover:underline">{CONTACT_EMAIL}</a>
          </p>
          <p>{c.location}</p>
          <p className="pt-2 text-zinc-100">
            © {new Date().getFullYear()} Cape Hospitality Advisors ·{' '}
            <a href="/privacy" className="underline">{c.privacyCap}</a>
          </p>
        </div>
      </div>
    </footer>
    </>
  );
};

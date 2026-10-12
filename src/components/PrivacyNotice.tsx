import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { CONTACT_EMAIL } from '../lib/sendInquiry';

const LAST_UPDATED = '12 October 2026';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="space-y-2">
    <h2 className="text-lg font-bold text-[#10213a]">{title}</h2>
    <div className="space-y-2 text-sm text-zinc-700 leading-relaxed">{children}</div>
  </section>
);

// Plain-language notice covering what this website collects and why
// (POPIA and GDPR). Keep it in step with the forms and the hotel lookup.
export const PrivacyNotice: React.FC = () => (
  <main className="min-h-screen bg-[#fbfbfa]">
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8">
      <a href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9c753e] hover:text-[#10213a]">
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to the website
      </a>

      <header className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#10213a]">Privacy Notice</h1>
        <p className="text-xs text-zinc-500">Last updated: {LAST_UPDATED}</p>
        <p className="text-sm text-zinc-700 leading-relaxed">
          This notice explains what personal information Cape Hospitality Advisors collects through this website, why,
          and what choices you have. It applies under South Africa’s Protection of Personal Information Act (POPIA) and,
          for visitors in the European Union, the General Data Protection Regulation (GDPR).
        </p>
      </header>

      <Section title="Who we are">
        <p>
          Cape Hospitality Advisors, Cape Town, South Africa, is responsible for the personal information described
          here. Contact us about privacy at{' '}
          <a className="text-[#9c753e] underline" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </Section>

      <Section title="What we collect">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong>Enquiry and briefing forms:</strong> your name, company, work email, the service you are interested
            in, the property or region you mention, and any preferred meeting times.
          </li>
          <li>
            <strong>“Email me the snapshot” requests:</strong> your email address and a summary of the hotel results
            you were viewing.
          </li>
          <li>
            <strong>Hotel searches:</strong> the hotel name you type. We do not ask for, or link searches to, your
            identity.
          </li>
          <li>
            <strong>Technical data:</strong> our hosting provider keeps short-lived server logs (such as IP address,
            browser type and the pages requested) to run and secure the website.
          </li>
        </ul>
        <p>We do not use advertising or analytics cookies, and we do not sell personal information.</p>
      </Section>

      <Section title="Why we use it">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>To answer your enquiry, prepare the brief or audit you ask for, and arrange a briefing call.</li>
          <li>To show live hotel information for the hotel you search.</li>
          <li>To keep the website running securely.</li>
        </ul>
        <p>
          We rely on your request (steps taken before or under a contract with you) and our legitimate interest in
          responding to business enquiries and operating the website. We only send you marketing if you ask for it, and
          you can opt out at any time.
        </p>
      </Section>

      <Section title="Who processes it for us">
        <p>We use these service providers, which process data on our behalf:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong>Vercel</strong>: website hosting and server logs.
          </li>
          <li>
            <strong>Web3Forms</strong>: delivers form submissions to our inbox.
          </li>
          <li>
            <strong>Spaceship (Spacemail)</strong>: our email service.
          </li>
          <li>
            <strong>Google (Places API, Gemini)</strong> and <strong>DataForSEO</strong>: look up and summarise public
            information about the hotel you search. Only the hotel name and its public reviews are sent, not your
            details.
          </li>
          <li>
            <strong>Upstash</strong>: stores hotel review summaries for up to 30 days so repeat searches are faster.
            No personal information about you is stored there.
          </li>
        </ul>
        <p>
          Some of these providers process data outside South Africa and the EU, for example in the United States. Where
          that happens we rely on the providers’ contractual safeguards.
        </p>
      </Section>

      <Section title="How long we keep it">
        <p>
          We keep enquiry emails for as long as needed to handle your request and any resulting business relationship,
          and delete them when they are no longer needed, generally within 24 months of our last contact unless we must
          keep them longer by law.
        </p>
      </Section>

      <Section title="Your rights">
        <p>
          You can ask to see, correct or delete your personal information, or object to how we use it, by emailing{' '}
          <a className="text-[#9c753e] underline" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
          . You may also complain to South Africa’s Information Regulator or, if you are in the EU, to your local data
          protection authority.
        </p>
      </Section>

      <Section title="Changes">
        <p>We will update this notice if how we handle personal information changes. The date above shows the latest version.</p>
      </Section>
    </div>
  </main>
);

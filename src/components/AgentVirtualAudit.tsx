import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  Accessibility,
  AlertTriangle,
  ArrowRight,
  Car,
  CheckCircle2,
  Compass,
  Globe,
  Mail,
  Phone,
  ExternalLink,
  FileText,
  Loader2,
  MapPin,
  MessageSquareQuote,
  Search,
  Star,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react';
import type {
  PlaceSnapshot,
  PlatformScores,
  ReviewAnalysis,
  ReviewsState,
  RiskCheck,
  SnapshotResponse,
  Theme,
} from '../../api/_lib/types';
import { CONTACT_EMAIL, mailtoLink, sendInquiry } from '../lib/sendInquiry';
import { Lang, dateLocale, useLang } from '../i18n';

interface AgentVirtualAuditProps {
  onSelectPropertyForInquiry: (propertyName: string) => void;
  onRequestVirtualAuditForProperty?: (propertyName: string) => void;
  onRequestFreeDataPackage: () => void;
}

const POLL_INTERVAL_MS = 5000;
const MAX_POLLS = 36; // ~3 minutes

const formatMonth = (iso?: string, lang: Lang = 'en') =>
  iso ? new Date(iso).toLocaleDateString(dateLocale(lang), { month: 'short', year: 'numeric' }) : '';

const formatCount = (n: number, lang: Lang = 'en') => n.toLocaleString(lang === 'de' ? 'de-DE' : 'en-US');

// One decimal place, with a decimal comma in German (4,7 rather than 4.7).
const formatRating = (n: number, lang: Lang = 'en') => {
  const text = n.toFixed(1);
  return lang === 'de' ? text.replace('.', ',') : text;
};

// Visitor-facing text. Guest quotes stay word for word in their original language,
// and emails to our team stay in English.
const COPY = {
  en: {
    title: 'Try It: Check Any Hotel',
    intro: 'Type a hotel name to see its consolidated rating across booking platforms and what recent guests say, counted, dated and sourced.',
    placeholder: 'Type a hotel name and town (e.g. Tintswalo Hout Bay)...',
    hotelName: 'Hotel name',
    enterName: 'Please enter a hotel name.',
    lookingUp: 'Looking up...',
    auditHotel: 'Audit Hotel',
    liveData: 'Live data combined from several review platforms. Adding the town gives the most precise match.',
    finding: (q: string) => `Finding “${q}”...`,
    notFoundTitle: (q: string) => `We couldn’t find “${q}”.`,
    notFoundBody: 'Try the full hotel name plus the town, e.g. “Tintswalo Atlantic Hout Bay”.',
    unavailableTitle: 'Live hotel data is temporarily unavailable.',
    unavailableBody: 'Our team can still prepare the free 24-hour Desk Brief for this hotel.',
    unavailableAction: 'Request the 24h Desk Brief',
    sampleLink: 'See a sample on-site report',
    viewMaps: 'View on map',
    ourScore: 'Our score',
    fromReviews: (n: string, sites: number) => `from ${n} reviews on ${sites} platform${sites === 1 ? '' : 's'}`,
    fromSites: (sites: number) => `across ${sites} platform${sites === 1 ? '' : 's'}`,
    noRating: 'No rating yet',
    aggregated: 'Aggregated from several sources',
    collecting: 'Adding other booking platforms...',
    notRight: 'Not the right place? Other matches:',
    status: { OPERATIONAL: 'Operating', CLOSED_TEMPORARILY: 'Temporarily closed', CLOSED_PERMANENTLY: 'Permanently closed' },
    wheelchairYes: 'Wheelchair-accessible entrance',
    wheelchairNo: 'No wheelchair-accessible entrance',
    parking: { 'Free parking': 'Free parking', 'Paid parking': 'Paid parking' } as Record<string, string>,
    website: 'Website',
    reviewsDisabled: 'A breakdown of recent guest reviews is included in the free 24-hour Desk Brief.',
    pendingTitle: 'Aggregating and analysing recent guest reviews from several platforms...',
    pendingBody: 'We combine the reviews, remove duplicates, count every complaint and check each quote. This usually takes about a minute.',
    reviewsError: 'The recent-review breakdown couldn’t be loaded right now.',
    noReviews: 'No recent written reviews were found for this hotel.',
    above: (r: string) => `above our score of ${r}`,
    below: (r: string) => `below our score of ${r}`,
    inLine: (r: string) => `in line with our score of ${r}`,
    whatGuestsSay: 'What recent guests say',
    basedOn: (sample: string, written: number) => `Based on the latest ${sample} (${written} with written comments)`,
    reviews: 'reviews',
    recentAverage: 'Recent average',
    last12: 'Last 12 months',
    of: (a: number, b: number) => `${a} of ${b}`,
    inSample: (newest: string) => `reviews in this sample${newest ? ` · newest ${newest}` : ''}`,
    writtenGerman: 'Written in German',
    writtenReviews: 'written reviews',
    analysed: 'Reviews analysed',
    withComments: (n: string) => `${n} with comments`,
    only: (n: number) => `only ${n}`,
    noThemes: 'A theme breakdown isn’t available for this hotel.',
    footnote: 'Themes are grouped by AI from the review text. Counts show how many written reviews in this sample mention each theme, and quotes are copied word for word. The average includes star-only ratings. Review data from aggregated sources.',
    riskTitle: 'Risk checklist',
    riskIntro: (n: number) => `Complaints in the ${n} written reviews about the issues European guests notice most. Click a line to read them.`,
    noComplaints: 'No complaints',
    complaints: (n: number) => `${n} complaint${n === 1 ? '' : 's'}`,
    risk: {} as Record<string, string>,
    briefTitle: 'Want the deeper picture? Get the 24-hour Desk Brief',
    briefBody: (hotel: string) =>
      `This snapshot is instant and automated. The Desk Brief on ${hotel} goes further: what German-speaking guests say compared with other guests, a risk checklist with verbatim quotes, and what to check on site. Our team reviews it and emails it to you within 24 hours. Free for travel companies.`,
    briefSent: (hotel: string, email: React.ReactNode) => (
      <>Thank you. Our team is preparing the Desk Brief on {hotel} and will email it, with this snapshot, to {email} within 24 hours.</>
    ),
    workEmail: 'Your work email',
    sending: 'Sending...',
    sendBrief: 'Send me the 24h Desk Brief',
    emailOnly: 'We use your email only to send this brief.',
    privacy: 'Privacy notice',
    sendFailed: `This couldn’t be sent right now. Please email us at ${CONTACT_EMAIL} —`,
    openEmail: 'open a pre-filled email',
    invalidEmail: 'Please enter a valid email address.',
    commission: 'Commission On-Site Audit',
    fullForm: 'or use the full enquiry form',
  },
  de: {
    title: 'Testen Sie es: Prüfen Sie ein Hotel',
    intro: 'Geben Sie einen Hotelnamen ein und sehen Sie die konsolidierte Bewertung über alle Buchungsportale sowie was Gäste zuletzt sagen – gezählt, datiert und mit Quelle.',
    placeholder: 'Hotelname und Ort eingeben (z. B. Tintswalo Hout Bay)...',
    hotelName: 'Hotelname',
    enterName: 'Bitte geben Sie einen Hotelnamen ein.',
    lookingUp: 'Suche läuft...',
    auditHotel: 'Hotel prüfen',
    liveData: 'Live-Daten, zusammengeführt aus mehreren Bewertungsportalen. Mit Ortsangabe wird das Ergebnis am genauesten.',
    finding: (q: string) => `Suche nach „${q}“...`,
    notFoundTitle: (q: string) => `„${q}“ wurde nicht gefunden.`,
    notFoundBody: 'Versuchen Sie den vollständigen Hotelnamen mit Ort, z. B. „Tintswalo Atlantic Hout Bay“.',
    unavailableTitle: 'Live-Hoteldaten sind vorübergehend nicht verfügbar.',
    unavailableBody: 'Unser Team kann den kostenlosen 24h-Kurzbericht für dieses Hotel trotzdem erstellen.',
    unavailableAction: '24h-Kurzbericht anfordern',
    sampleLink: 'Beispielbericht eines Audits vor Ort ansehen',
    viewMaps: 'Auf der Karte ansehen',
    ourScore: 'Unsere Bewertung',
    fromReviews: (n: string, sites: number) => `aus ${n} Bewertungen auf ${sites} ${sites === 1 ? 'Portal' : 'Portalen'}`,
    fromSites: (sites: number) => `über ${sites} ${sites === 1 ? 'Portal' : 'Portale'}`,
    noRating: 'Noch keine Bewertung',
    aggregated: 'Aus mehreren Quellen zusammengeführt',
    collecting: 'Weitere Buchungsportale werden einbezogen...',
    notRight: 'Nicht das richtige Hotel? Weitere Treffer:',
    status: { OPERATIONAL: 'Geöffnet', CLOSED_TEMPORARILY: 'Vorübergehend geschlossen', CLOSED_PERMANENTLY: 'Dauerhaft geschlossen' },
    wheelchairYes: 'Rollstuhlgerechter Eingang',
    wheelchairNo: 'Kein rollstuhlgerechter Eingang',
    parking: { 'Free parking': 'Kostenlose Parkplätze', 'Paid parking': 'Kostenpflichtige Parkplätze' } as Record<string, string>,
    website: 'Website',
    reviewsDisabled: 'Eine Auswertung der aktuellen Gästebewertungen ist im kostenlosen 24h-Kurzbericht enthalten.',
    pendingTitle: 'Aktuelle Gästebewertungen mehrerer Portale werden zusammengeführt und ausgewertet...',
    pendingBody: 'Wir führen die Bewertungen zusammen, entfernen Doppelte, zählen jede Beschwerde und prüfen jedes Zitat. Das dauert meist etwa eine Minute.',
    reviewsError: 'Die Auswertung der aktuellen Bewertungen konnte gerade nicht geladen werden.',
    noReviews: 'Für dieses Hotel wurden keine aktuellen schriftlichen Bewertungen gefunden.',
    above: (r: string) => `über unserer Bewertung von ${r}`,
    below: (r: string) => `unter unserer Bewertung von ${r}`,
    inLine: (r: string) => `im Einklang mit unserer Bewertung von ${r}`,
    whatGuestsSay: 'Was Gäste zuletzt sagen',
    basedOn: (sample: string, written: number) => `Basierend auf den neuesten ${sample} (${written} mit schriftlichem Kommentar)`,
    reviews: 'Bewertungen',
    recentAverage: 'Aktueller Schnitt',
    last12: 'Letzte 12 Monate',
    of: (a: number, b: number) => `${a} von ${b}`,
    inSample: (newest: string) => `Bewertungen in dieser Stichprobe${newest ? ` · neueste ${newest}` : ''}`,
    writtenGerman: 'Auf Deutsch verfasst',
    writtenReviews: 'schriftliche Bewertungen',
    analysed: 'Ausgewertete Bewertungen',
    withComments: (n: string) => `${n} mit Kommentar`,
    only: (n: number) => `nur ${n}`,
    noThemes: 'Für dieses Hotel ist keine Auswertung nach Themen verfügbar.',
    footnote: 'Die Themen werden per KI aus dem Bewertungstext gruppiert (Themennamen auf Englisch). Die Zahlen zeigen, wie viele schriftliche Bewertungen dieser Stichprobe ein Thema erwähnen; Zitate sind wörtlich übernommen. Der Durchschnitt enthält auch reine Sterne-Bewertungen. Bewertungsdaten aus aggregierten Quellen.',
    riskTitle: 'Risiko-Checkliste',
    riskIntro: (n: number) => `Beschwerden in den ${n} schriftlichen Bewertungen zu den Punkten, die europäischen Gästen am meisten auffallen. Klicken Sie auf eine Zeile, um sie zu lesen.`,
    noComplaints: 'Keine Beschwerden',
    complaints: (n: number) => `${n} ${n === 1 ? 'Beschwerde' : 'Beschwerden'}`,
    risk: {
      noise: 'Lärm',
      hot_water: 'Warmwasser & Duschen',
      cleanliness: 'Sauberkeit',
      wifi: 'WLAN',
      safety: 'Sicherheit',
      power: 'Stromausfälle',
    } as Record<string, string>,
    briefTitle: 'Mehr Tiefe? Fordern Sie den 24h-Kurzbericht an',
    briefBody: (hotel: string) =>
      `Diese Momentaufnahme ist sofort verfügbar und automatisch erstellt. Der Kurzbericht zu ${hotel} geht weiter: was deutschsprachige Gäste im Vergleich zu anderen Gästen sagen, eine Risiko-Checkliste mit wörtlichen Zitaten und was vor Ort zu prüfen ist. Unser Team prüft ihn und sendet ihn Ihnen innerhalb von 24 Stunden. Kostenlos für Reiseveranstalter.`,
    briefSent: (hotel: string, email: React.ReactNode) => (
      <>Vielen Dank. Unser Team erstellt den Kurzbericht zu {hotel} und sendet ihn zusammen mit dieser Momentaufnahme innerhalb von 24 Stunden an {email}.</>
    ),
    workEmail: 'Ihre geschäftliche E-Mail',
    sending: 'Wird gesendet...',
    sendBrief: '24h-Kurzbericht anfordern',
    emailOnly: 'Wir verwenden Ihre E-Mail nur für den Versand dieses Berichts.',
    privacy: 'Datenschutzhinweise',
    sendFailed: `Das konnte gerade nicht gesendet werden. Bitte schreiben Sie uns an ${CONTACT_EMAIL} –`,
    openEmail: 'vorausgefüllte E-Mail öffnen',
    invalidEmail: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
    commission: 'Audit vor Ort beauftragen',
    fullForm: 'oder das vollständige Anfrageformular nutzen',
  },
};

const useCopy = () => {
  const { lang } = useLang();
  return { lang, c: COPY[lang] };
};

export const AgentVirtualAudit: React.FC<AgentVirtualAuditProps> = ({
  onSelectPropertyForInquiry,
  onRequestVirtualAuditForProperty,
  onRequestFreeDataPackage,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SnapshotResponse | null>(null);
  const [reviews, setReviews] = useState<ReviewsState | null>(null);
  const [scores, setScores] = useState<PlatformScores | 'loading' | null>(null);
  const [inputError, setInputError] = useState('');
  const { c } = useCopy();
  // Incremented on every search so stale polls stop updating the page.
  const searchId = useRef(0);

  useEffect(() => () => {
    searchId.current += 1;
  }, []);

  const requestBrief = (name: string) => {
    if (onRequestVirtualAuditForProperty) onRequestVirtualAuditForProperty(name);
    else onRequestFreeDataPackage();
  };

  const loadScores = async (placeId: string, id: number) => {
    setScores('loading');
    try {
      const res = await fetch(`/api/platform-scores?placeId=${encodeURIComponent(placeId)}`);
      const data: PlatformScores = res.ok ? await res.json() : { status: 'unavailable' };
      if (searchId.current === id) setScores(data);
    } catch {
      if (searchId.current === id) setScores({ status: 'unavailable' });
    }
  };

  const pollReviews = async (jobId: string, placeId: string, id: number) => {
    for (let attempt = 0; attempt < MAX_POLLS; attempt++) {
      await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
      if (searchId.current !== id) return;
      try {
        const res = await fetch(
          `/api/hotel-reviews?jobId=${encodeURIComponent(jobId)}&placeId=${encodeURIComponent(placeId)}`,
        );
        const data: ReviewsState = await res.json();
        if (searchId.current !== id) return;
        if (data.status !== 'pending') {
          setReviews(data);
          return;
        }
      } catch {
        // transient network error: keep polling
      }
    }
    if (searchId.current === id) setReviews({ status: 'error' });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch(searchInput.trim());
  };

  const runSearch = async (query: string) => {
    if (query.length < 2) {
      setInputError(c.enterName);
      return;
    }
    const id = ++searchId.current;
    setSearchInput(query);
    setInputError('');
    setSubmittedQuery(query);
    setIsLoading(true);
    setResult(null);
    setReviews(null);
    setScores(null);

    try {
      const res = await fetch('/api/hotel-snapshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (searchId.current !== id) return;
      if (res.status === 400) {
        setInputError(c.enterName);
        return;
      }
      const snapshot: SnapshotResponse = res.ok ? data : { status: 'unavailable' };
      setResult(snapshot);
      if (snapshot.status === 'ok') {
        setReviews(snapshot.reviews);
        loadScores(snapshot.place.placeId, id);
        if (snapshot.reviews.status === 'pending') {
          pollReviews(snapshot.reviews.jobId, snapshot.place.placeId, id);
        }
      }
    } catch {
      if (searchId.current === id) setResult({ status: 'unavailable' });
    } finally {
      if (searchId.current === id) setIsLoading(false);
    }
  };

  return (
    <section id="virtual-audit" className="scroll-mt-20 py-16 sm:py-20 bg-[#10213a] text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-[radial-gradient(ellipse_at_top,rgba(179,138,84,0.12),transparent_70%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            {c.title}
          </h2>

          <p className="mt-3 text-sm sm:text-base text-zinc-300 leading-relaxed">
            {c.intro}
          </p>
        </div>

        {/* Search */}
        <div className="max-w-3xl mx-auto mb-6">
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row items-center gap-2 p-1.5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md shadow-xl"
          >
            <div className="flex items-center gap-2.5 px-3.5 w-full">
              <Search className="w-5 h-5 text-[#d9bd8b] shrink-0" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={c.placeholder}
                maxLength={120}
                aria-label={c.hotelName}
                className="w-full bg-transparent text-white placeholder-zinc-400 text-sm focus:outline-hidden py-2.5 font-sans"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#b38a54] hover:bg-[#c59b63] disabled:opacity-60 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shrink-0 whitespace-nowrap"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  <span>{c.lookingUp}</span>
                </>
              ) : (
                <>
                  <span>{c.auditHotel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
          {inputError && <p className="mt-2 text-center text-xs text-rose-300">{inputError}</p>}
          <p className="mt-3 text-center text-[11px] text-zinc-400 flex items-center justify-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-[#d9bd8b]" />
            {c.liveData}
          </p>
        </div>

        {/* Results */}
        <div className="max-w-4xl mx-auto mb-8" aria-live="polite">
          {isLoading && (
            <div className="rounded-2xl bg-[#0c182a]/90 border border-[#d9bd8b]/30 p-8 text-center">
              <Loader2 className="w-7 h-7 animate-spin text-[#d9bd8b] mx-auto mb-3" />
              <p className="text-sm text-zinc-200">{c.finding(submittedQuery)}</p>
            </div>
          )}

          {!isLoading && result?.status === 'not_found' && (
            <Notice
              title={c.notFoundTitle(submittedQuery)}
              body={c.notFoundBody}
            />
          )}

          {!isLoading && result?.status === 'unavailable' && (
            <Notice
              title={c.unavailableTitle}
              body={c.unavailableBody}
              actionLabel={c.unavailableAction}
              onAction={() => requestBrief(submittedQuery)}
            />
          )}

          {!isLoading && result?.status === 'ok' && (
            <div className="rounded-2xl bg-[#0c182a] border border-white/15 shadow-2xl p-6 sm:p-8 text-left space-y-6">
              <PlaceHeader place={result.place} scores={scores} />
              {result.alternatives && result.alternatives.length > 0 && (
                <Alternatives
                  places={result.alternatives}
                  onPick={(p) => runSearch(`${p.name}, ${p.address}`.slice(0, 120))}
                />
              )}
              <ReviewsPanel state={reviews} overallRating={ourScore(result.place, scores)?.average} />
              <BriefCta
                place={result.place}
                reviews={reviews}
                scores={scores}
                onBrief={() => requestBrief(result.place.name)}
                onAudit={() => onSelectPropertyForInquiry(result.place.name)}
              />
            </div>
          )}
        </div>

        {/* Link to the sample on-site report */}
        <div className="text-center">
          <a
            href="/sample-report"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-zinc-300 hover:text-white transition-all cursor-pointer shadow-xs"
          >
            <span>{c.sampleLink}</span>
            <ArrowRight className="w-3 h-3 text-[#d9bd8b]" />
          </a>
        </div>
      </div>
    </section>
  );
};

const Notice: React.FC<{ title: string; body: string; actionLabel?: string; onAction?: () => void }> = ({
  title,
  body,
  actionLabel,
  onAction,
}) => (
  <div className="rounded-2xl bg-[#0c182a] border border-white/15 p-6 text-center space-y-2">
    <p className="text-sm font-semibold text-white">{title}</p>
    <p className="text-xs text-zinc-300">{body}</p>
    {actionLabel && onAction && (
      <button
        type="button"
        onClick={onAction}
        className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#b38a54] hover:bg-[#c59b63] text-white text-xs font-bold cursor-pointer"
      >
        <span>{actionLabel}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    )}
  </div>
);

const PlaceHeader: React.FC<{ place: PlaceSnapshot; scores: PlatformScores | 'loading' | null }> = ({ place, scores }) => {
  const { lang, c } = useCopy();
  const score = ourScore(place, scores);
  return (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
    <div className="min-w-0">
      {place.type && (
        <span className="font-mono text-[11px] font-bold text-[#d9bd8b] uppercase tracking-wider">{place.type}</span>
      )}
      <h3 className="text-xl sm:text-2xl font-bold text-white font-serif mt-1">{place.name}</h3>
      {place.address && (
        <p className="text-xs text-zinc-400 mt-1 flex items-start gap-1">
          <MapPin className="w-3.5 h-3.5 text-[#d9bd8b] shrink-0 mt-px" />
          <span>{place.address}</span>
        </p>
      )}
      <PlaceFacts place={place} />
      {place.mapsUrl && (
        <a
          href={place.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-[11px] text-[#d9bd8b] hover:text-white"
        >
          {c.viewMaps} <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </div>

    <div className="shrink-0 rounded-xl bg-white/5 border border-white/10 px-5 py-4 text-center sm:min-w-[170px]">
      <div className="text-[10px] font-mono uppercase tracking-wider text-[#d9bd8b]">{c.ourScore}</div>
      {score ? (
        <>
          <div className="mt-1 flex items-center justify-center gap-1.5">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span className="text-3xl font-bold text-white">{formatRating(score.average, lang)}</span>
            <span className="text-xs text-zinc-400 self-end mb-1">/ 5</span>
          </div>
          <div className="text-[11px] text-zinc-300 mt-1">
            {score.reviews ? c.fromReviews(formatCount(score.reviews, lang), score.sites) : c.fromSites(score.sites)}
          </div>
        </>
      ) : (
        <div className="mt-1 text-xs text-zinc-300">{c.noRating}</div>
      )}
      {scores === 'loading' ? (
        <div className="text-[10px] text-zinc-400 mt-2 flex items-center justify-center gap-1.5">
          <Loader2 className="w-3 h-3 animate-spin text-[#d9bd8b]" /> {c.collecting}
        </div>
      ) : (
        <div className="text-[10px] font-mono text-zinc-500 mt-2">{c.aggregated}</div>
      )}
    </div>
  </div>
  );
};

// Google Hotels sends site scores on a 5-point scale, often without saying so.
const formatScore = (s: { value: number; max?: number }, lang: Lang = 'en') => {
  if (s.max === 100) return `${Math.round(s.value)}%`;
  const max = s.max ?? (s.value <= 5 ? 5 : s.value <= 10 ? 10 : undefined);
  const value = Math.round(s.value * 10) / 10;
  return `${Number.isInteger(value) ? value : formatRating(value, lang)}${max ? `/${max}` : ''}`;
};

// Our score: the hotel's ratings on every platform we found, as one score out of 5,
// weighted by each platform's number of reviews when every platform reports it.
function ourScore(place: PlaceSnapshot, scores: PlatformScores | 'loading' | null) {
  const all: { value: number; max?: number; votes?: number }[] = [];
  if (typeof place.rating === 'number') all.push({ value: place.rating, max: 5, votes: place.ratingCount });
  if (scores && scores !== 'loading' && scores.status === 'ok') all.push(...scores.scores);
  return combineScores(all);
}

function combineScores(scores: { value: number; max?: number; votes?: number }[]) {
  const out5 = scores
    .map((s) => {
      const max = s.max ?? (s.value <= 5 ? 5 : s.value <= 10 ? 10 : s.value <= 100 ? 100 : undefined);
      return max ? { score: (s.value / max) * 5, votes: s.votes } : null;
    })
    .filter((s): s is { score: number; votes: number | undefined } => s !== null);
  if (!out5.length) return null;
  const weighted = out5.every((s) => typeof s.votes === 'number' && s.votes > 0);
  const weight = (s: { votes?: number }) => (weighted ? (s.votes as number) : 1);
  const total = out5.reduce((sum, s) => sum + weight(s), 0);
  return {
    average: out5.reduce((sum, s) => sum + s.score * weight(s), 0) / total,
    sites: out5.length,
    reviews: weighted ? total : 0,
  };
}

const Alternatives: React.FC<{ places: PlaceSnapshot[]; onPick: (p: PlaceSnapshot) => void }> = ({
  places,
  onPick,
}) => {
  const { lang, c } = useCopy();
  return (
  <div className="-mt-2">
    <p className="text-[11px] text-zinc-400 mb-2">{c.notRight}</p>
    <div className="flex flex-wrap gap-2">
      {places.map((p) => (
        <button
          key={p.placeId}
          type="button"
          onClick={() => onPick(p)}
          className="text-left text-[11px] px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-200 hover:bg-white/10 hover:text-white cursor-pointer max-w-full"
        >
          <span className="font-semibold">{p.name}</span>
          {typeof p.rating === 'number' && (
            <span className="text-zinc-400">
              {' '}
              · {formatRating(p.rating, lang)}★{p.ratingCount ? ` (${formatCount(p.ratingCount, lang)})` : ''}
            </span>
          )}
        </button>
      ))}
    </div>
  </div>
  );
};

const STATUS_TONE: Record<NonNullable<PlaceSnapshot['status']>, string> = {
  OPERATIONAL: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10',
  CLOSED_TEMPORARILY: 'text-rose-300 border-rose-500/40 bg-rose-500/15',
  CLOSED_PERMANENTLY: 'text-rose-300 border-rose-500/40 bg-rose-500/15',
};

const chip = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10.5px]';
const plainChip = `${chip} text-zinc-300 border-white/10 bg-white/5`;

// Facts straight from the Google listing; anything Google doesn't report is left out.
const PlaceFacts: React.FC<{ place: PlaceSnapshot }> = ({ place }) => {
  const { c } = useCopy();
  const status = place.status ? { text: c.status[place.status], tone: STATUS_TONE[place.status] } : null;
  const hasFacts =
    status || place.wheelchairEntrance !== undefined || place.parking || place.website || place.phone;
  if (!hasFacts) return null;
  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5">
      {status && <span className={`${chip} ${status.tone}`}>{status.text}</span>}
      {place.wheelchairEntrance !== undefined && (
        <span className={plainChip}>
          <Accessibility className="w-3 h-3" />
          {place.wheelchairEntrance ? c.wheelchairYes : c.wheelchairNo}
        </span>
      )}
      {place.parking && (
        <span className={plainChip}>
          <Car className="w-3 h-3" />
          {c.parking[place.parking] ?? place.parking}
        </span>
      )}
      {place.website && (
        <a href={place.website} target="_blank" rel="noopener noreferrer" className={`${plainChip} hover:text-white`}>
          <Globe className="w-3 h-3" />
          {c.website}
        </a>
      )}
      {place.phone && (
        <a href={`tel:${place.phone.replace(/\s+/g, '')}`} className={`${plainChip} hover:text-white`}>
          <Phone className="w-3 h-3" />
          {place.phone}
        </a>
      )}
    </div>
  );
};

const ReviewsPanel: React.FC<{ state: ReviewsState | null; overallRating?: number }> = ({ state, overallRating }) => {
  const { c } = useCopy();
  if (!state || state.status === 'disabled') {
    return (
      <p className="text-xs text-zinc-400">
        {c.reviewsDisabled}
      </p>
    );
  }
  if (state.status === 'pending') {
    return (
      <div className="rounded-xl bg-white/[0.03] border border-white/10 p-5 flex items-center gap-3">
        <Loader2 className="w-5 h-5 animate-spin text-[#d9bd8b] shrink-0" />
        <div>
          <p className="text-sm text-white">{c.pendingTitle}</p>
          <p className="text-[11px] text-zinc-400">{c.pendingBody}</p>
        </div>
      </div>
    );
  }
  if (state.status === 'error') {
    return <p className="text-xs text-zinc-400">{c.reviewsError}</p>;
  }
  return <AnalysisView analysis={state.analysis} overallRating={overallRating} />;
};

const AnalysisView: React.FC<{ analysis: ReviewAnalysis; overallRating?: number }> = ({ analysis, overallRating }) => {
  const { lang, c } = useCopy();
  const n = analysis.sampleSize;
  const written = analysis.writtenCount ?? n;
  if (n === 0) {
    return <p className="text-xs text-zinc-400">{c.noReviews}</p>;
  }

  const range =
    analysis.dateFrom && analysis.dateTo
      ? ` · ${formatMonth(analysis.dateFrom, lang)} – ${formatMonth(analysis.dateTo, lang)}`
      : '';

  let comparison = '';
  if (typeof analysis.averageRating === 'number' && typeof overallRating === 'number') {
    const diff = analysis.averageRating - overallRating;
    comparison =
      diff >= 0.2 ? c.above(formatRating(overallRating, lang))
      : diff <= -0.2 ? c.below(formatRating(overallRating, lang))
      : c.inLine(formatRating(overallRating, lang));
  }

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-base font-bold text-white font-serif">{c.whatGuestsSay}</h4>
        <p className="text-[11px] font-mono text-zinc-400 mt-0.5">
          {c.basedOn(`${n} ${c.reviews}`, written)}
          {range}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {typeof analysis.averageRating === 'number' && (
          <Stat
            label={c.recentAverage}
            value={`${formatRating(analysis.averageRating, lang)} ★`}
            note={comparison}
          />
        )}
        {typeof analysis.lastYearCount === 'number' && (
          <Stat
            label={c.last12}
            value={c.of(analysis.lastYearCount, n)}
            note={c.inSample(formatMonth(analysis.dateTo, lang))}
          />
        )}
        {typeof analysis.germanCount === 'number' && written > 0 && (
          <Stat label={c.writtenGerman} value={c.of(analysis.germanCount, written)} note={c.writtenReviews} />
        )}
        <Stat
          label={c.analysed}
          value={String(n)}
          note={c.withComments(written < 20 ? c.only(written) : String(written))}
        />
      </div>

      {analysis.risks && <RiskChecklist risks={analysis.risks} total={written} />}

      {analysis.themes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {analysis.themes.map((theme) => (
            <ThemeCard key={theme.label} theme={theme} total={written} />
          ))}
        </div>
      ) : (
        <p className="text-xs text-zinc-400">{c.noThemes}</p>
      )}

      <p className="text-[10px] text-zinc-500 leading-relaxed">
        {c.footnote}
      </p>
    </div>
  );
};

const RiskChecklist: React.FC<{ risks: RiskCheck[]; total: number }> = ({ risks, total }) => {
  const { lang, c } = useCopy();
  return (
  <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4">
    <h5 className="text-sm font-bold text-white">{c.riskTitle}</h5>
    <p className="text-[11px] text-zinc-400 mt-0.5">{c.riskIntro(total)}</p>
    <ul className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 items-start">
      {risks.map((r) => {
        const icon =
          r.count === 0 ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className={`w-4 h-4 shrink-0 ${r.count >= 3 ? 'text-rose-400' : 'text-amber-300'}`} />
          );
        const count = (
          <span className="text-[11px] font-mono text-zinc-300 whitespace-nowrap">
            {r.count === 0 ? c.noComplaints : c.complaints(r.count)}
          </span>
        );
        const title = (
          <span className="flex items-center gap-2 text-xs font-semibold text-white">
            {icon}
            {c.risk[r.key] ?? r.label}
          </span>
        );
        const mentions = r.mentions ?? [];
        return (
          <li key={r.key} className="rounded-lg bg-white/[0.03] border border-white/5 px-3 py-2">
            {mentions.length > 0 ? (
              // Click to read every complaint behind the count.
              <details className="group">
                <summary className="flex items-center justify-between gap-2 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  {title}
                  <span className="flex items-center gap-1.5">
                    {count}
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-400 transition-transform group-open:rotate-180" />
                  </span>
                </summary>
                <ul className="mt-2 space-y-2 border-t border-white/5 pt-2">
                  {mentions.map((m, i) => (
                    <li key={i} className="text-[11px] text-zinc-300 leading-relaxed">
                      <span className="italic">“{m.text}”</span>
                      <span className="text-zinc-500">
                        {' '}
                        — {[formatMonth(m.date, lang), typeof m.rating === 'number' ? `${m.rating}★` : ''].filter(Boolean).join(', ')}
                      </span>
                    </li>
                  ))}
                </ul>
              </details>
            ) : (
              <>
                <div className="flex items-center justify-between gap-2">
                  {title}
                  {count}
                </div>
                {r.quote && (
                  <p className="mt-1 text-[11px] text-zinc-400 leading-relaxed">
                    <span className="italic">“{r.quote.text}”</span>
                    {r.quote.date && (
                      <span className="text-zinc-500"> — {formatMonth(r.quote.date, lang)}</span>
                    )}
                  </p>
                )}
              </>
            )}
          </li>
        );
      })}
    </ul>
  </div>
  );
};

const Stat: React.FC<{ label: string; value: string; note?: string }> = ({ label, value, note }) => (
  <div className="rounded-xl bg-white/[0.04] border border-white/10 p-3.5">
    <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">{label}</div>
    <div className="text-xl font-bold text-white mt-0.5">{value}</div>
    {note && <div className="text-[11px] text-zinc-400">{note}</div>}
  </div>
);

const ThemeCard: React.FC<{ theme: Theme; total: number }> = ({ theme, total }) => {
  const { lang, c } = useCopy();
  const tone =
    theme.sentiment === 'positive'
      ? { icon: <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" /> }
      : theme.sentiment === 'negative'
      ? { icon: <ThumbsDown className="w-3.5 h-3.5 text-rose-400" /> }
      : { icon: <MessageSquareQuote className="w-3.5 h-3.5 text-amber-300" /> };

  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          {tone.icon}
          <span>{theme.label}</span>
        </div>
        <span className="text-[11px] font-mono text-zinc-300 whitespace-nowrap">
          {c.of(theme.count, total)}
        </span>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full bg-[#b38a54]" style={{ width: `${Math.min(100, (theme.count / total) * 100)}%` }} />
      </div>
      {theme.quotes.length > 0 && (
        <ul className="mt-3 space-y-2">
          {theme.quotes.map((q, i) => (
            <li key={i} className="text-[11px] text-zinc-300 leading-relaxed">
              <span className="italic">“{q.text}”</span>
              <span className="text-zinc-500">
                {' '}
                — {[formatMonth(q.date, lang), typeof q.rating === 'number' ? `${q.rating}★` : ''].filter(Boolean).join(', ')}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// "100 Google + 50 Tripadvisor reviews", or "100 Google reviews" for older or Google-only results.
// For the email to our team, which keeps the platform names.
function sampleText(a: ReviewAnalysis): string {
  if (!a.sources?.length) return `${a.sampleSize} ${a.sourceLabel}`;
  return `${a.sources.map((s) => `${s.count} ${s.source}`).join(' + ')} reviews`;
}

// Plain-text summary of what the visitor saw, sent with their snapshot request.
function snapshotText(place: PlaceSnapshot, reviews: ReviewsState | null, scores?: PlatformScores | 'loading' | null): string {
  const lines = [
    `Hotel: ${place.name}`,
    place.address && `Address: ${place.address}`,
    typeof place.rating === 'number' && `Google rating: ${place.rating} from ${place.ratingCount ?? '?'} reviews`,
    place.status && `Google status: ${place.status}`,
    place.mapsUrl && `Google Maps: ${place.mapsUrl}`,
  ];
  if (reviews?.status === 'ready') {
    const a = reviews.analysis;
    const w = a.writtenCount ?? a.sampleSize;
    lines.push(
      `Sample: latest ${sampleText(a)} (${w} written), ${formatMonth(a.dateFrom)} – ${formatMonth(a.dateTo)}`,
      ...(a.sources ?? [])
        .filter((s) => s.source !== 'Google' && s.name)
        .map((s) => `${s.source} listing: ${s.name}${s.url ? ` (${s.url})` : ''}`),
      typeof a.averageRating === 'number' && `Recent average: ${a.averageRating}`,
      typeof a.lastYearCount === 'number' && `Last 12 months: ${a.lastYearCount} of the ${a.sampleSize} reviews in the sample`,
      typeof a.germanCount === 'number' && `Written in German: ${a.germanCount} of ${w}`,
      a.themes.length > 0 && `Themes: ${a.themes.map((t) => `${t.label} (${t.count}/${w})`).join('; ')}`,
      a.risks && `Risk checklist: ${a.risks.map((r) => `${r.label} ${r.count}`).join('; ')}`,
    );
  }
  if (scores && scores !== 'loading' && scores.status === 'ok') {
    lines.push(`Other platforms (Google Hotels): ${scores.scores.map((s) => `${s.site} ${formatScore(s)}`).join('; ')}`);
  }
  const score = ourScore(place, scores && scores !== 'loading' ? scores : null);
  if (score) {
    lines.push(`Our score (shown to the visitor): ${score.average.toFixed(1)}/5 across ${score.sites} platform(s)${score.reviews ? `, ${score.reviews} reviews` : ''}`);
  }
  return lines.filter(Boolean).join('\n');
}

const BriefCta: React.FC<{
  place: PlaceSnapshot;
  reviews: ReviewsState | null;
  scores: PlatformScores | 'loading' | null;
  onBrief: () => void;
  onAudit: () => void;
}> = ({ place, reviews, scores, onBrief, onAudit }) => {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [fallbackHref, setFallbackHref] = useState('');
  const { lang, c } = useCopy();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const address = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
      setState('error');
      setFallbackHref('');
      return;
    }
    setState('sending');
    const subject = `Desk Brief request — ${place.name}`;
    const fields = {
      Email: address,
      Hotel: place.name,
      ...(lang === 'de' ? { Language: 'German (Deutsch): please reply in German' } : {}),
      Snapshot: snapshotText(place, reviews, scores),
    };
    try {
      await sendInquiry(subject, fields, address);
      setState('sent');
    } catch {
      setFallbackHref(mailtoLink(subject, fields));
      setState('error');
    }
  };

  return (
    <div className="rounded-2xl border border-[#d9bd8b]/40 bg-[#b38a54]/10 p-5 sm:p-6 space-y-4">
      <div>
        <h4 className="text-base sm:text-lg font-bold text-white font-serif">
          {c.briefTitle}
        </h4>
        <p className="text-xs text-zinc-300 mt-1 leading-relaxed">{c.briefBody(place.name)}</p>
      </div>

      {state === 'sent' ? (
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-200 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-px" />
          <span>{c.briefSent(place.name, <strong>{email.trim()}</strong>)}</span>
        </div>
      ) : (
        <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2">
          <div className="flex items-center gap-2 px-3 rounded-xl bg-white/10 border border-white/20 flex-1">
            <Mail className="w-4 h-4 text-[#d9bd8b] shrink-0" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={c.workEmail}
              aria-label={c.workEmail}
              className="w-full bg-transparent text-white placeholder-zinc-400 text-sm py-2.5 focus:outline-hidden"
            />
          </div>
          <button
            type="submit"
            disabled={state === 'sending'}
            className="px-5 py-2.5 rounded-xl bg-[#b38a54] hover:bg-[#c59b63] disabled:opacity-60 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{state === 'sending' ? c.sending : c.sendBrief}</span>
          </button>
        </form>
      )}

      {state !== 'sent' && (
        <p className="text-[10px] text-zinc-400">
          {c.emailOnly}{' '}
          <a href="/privacy" className="underline hover:text-white">
            {c.privacy}
          </a>
        </p>
      )}

      {state === 'error' && (
        <p className="text-[11px] text-rose-300">
          {fallbackHref ? (
            <>
              {c.sendFailed}{' '}
              <a href={fallbackHref} className="underline font-semibold">
                {c.openEmail}
              </a>
              .
            </>
          ) : (
            c.invalidEmail
          )}
        </p>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pt-1">
        <button
          type="button"
          onClick={onAudit}
          className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-zinc-200 hover:text-white text-[11px] font-semibold flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>{c.commission}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={onBrief} className="text-[11px] text-zinc-400 hover:text-white underline cursor-pointer">
          {c.fullForm}
        </button>
      </div>
    </div>
  );
};

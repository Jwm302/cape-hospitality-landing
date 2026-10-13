import React, { useEffect, useRef, useState } from 'react';
import {
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
  Eye,
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

interface AgentVirtualAuditProps {
  onSelectPropertyForInquiry: (propertyName: string) => void;
  onRequestVirtualAuditForProperty?: (propertyName: string) => void;
  onRequestFreeDataPackage: () => void;
}

const POLL_INTERVAL_MS = 5000;
const MAX_POLLS = 36; // ~3 minutes

const formatMonth = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : '';

const formatCount = (n: number) => n.toLocaleString('en-US');

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
      setInputError('Please enter a hotel name.');
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
        setInputError(data.error || 'Please enter a hotel name.');
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
    <section id="virtual-audit" className="py-16 sm:py-20 bg-[#10213a] text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-[radial-gradient(ellipse_at_top,rgba(179,138,84,0.12),transparent_70%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#d9bd8b]/30 bg-white/5 text-xs font-semibold text-[#d9bd8b] shadow-xs mb-3">
            <Eye className="w-3.5 h-3.5 text-[#d9bd8b]" />
            <span className="tracking-widest uppercase font-mono text-[11px]">
              STAGE 01 • FREE VIRTUAL AUDIT — LIVE DEMO
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-serif leading-tight">
            See What Guests Really Say About Any Hotel
          </h2>

          <p className="mt-3 text-sm sm:text-base text-zinc-300 font-light leading-relaxed max-w-2xl mx-auto">
            Two parts. First an <strong className="text-white font-medium">instant snapshot</strong>: the hotel&rsquo;s
            live Google rating and what recent guests say on Google and Tripadvisor, counted, dated and sourced. Then, on request,
            the <strong className="text-white font-medium">free 24-hour Desk Brief</strong>: what German-speaking guests
            say, checked by our team and emailed to you.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono text-zinc-300">
            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[#d9bd8b]">01 Free Virtual Audit</span>
            <span className="text-zinc-500">→</span>
            <span className="px-2.5 py-1 rounded-md bg-[#b38a54]/20 border border-[#b38a54]/40 text-amber-300 font-bold">02 On-Site Mystery Audit</span>
            <span className="text-zinc-500">→</span>
            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-zinc-300">03 Portfolio Partnership</span>
          </div>
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
                placeholder="Type a hotel name and town (e.g. Tintswalo Hout Bay)..."
                maxLength={120}
                aria-label="Hotel name"
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
                  <span>Looking up...</span>
                </>
              ) : (
                <>
                  <span>Audit Hotel</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
          {inputError && <p className="mt-2 text-center text-xs text-rose-300">{inputError}</p>}
          <p className="mt-3 text-center text-[11px] text-zinc-400 flex items-center justify-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-[#d9bd8b]" />
            Live data from Google. Adding the town gives the most precise match.
          </p>
        </div>

        {/* Results */}
        <div className="max-w-4xl mx-auto mb-8" aria-live="polite">
          {isLoading && (
            <div className="rounded-2xl bg-[#0c182a]/90 border border-[#d9bd8b]/30 p-8 text-center">
              <Loader2 className="w-7 h-7 animate-spin text-[#d9bd8b] mx-auto mb-3" />
              <p className="text-sm text-zinc-200">Looking up “{submittedQuery}” on Google...</p>
            </div>
          )}

          {!isLoading && result?.status === 'not_found' && (
            <Notice
              title={`We couldn’t find “${submittedQuery}” on Google Maps.`}
              body="Try the full hotel name plus the town, e.g. “Tintswalo Atlantic Hout Bay”."
            />
          )}

          {!isLoading && result?.status === 'unavailable' && (
            <Notice
              title="Live hotel data is temporarily unavailable."
              body="Our team can still prepare the free 24-hour Desk Brief for this hotel."
              actionLabel="Request the 24h Desk Brief"
              onAction={() => requestBrief(submittedQuery)}
            />
          )}

          {!isLoading && result?.status === 'ok' && (
            <div className="rounded-2xl bg-[#0c182a] border border-white/15 shadow-2xl p-6 sm:p-8 text-left space-y-6">
              <PlaceHeader place={result.place} />
              <PlatformScoresRow state={scores} />
              {result.alternatives && result.alternatives.length > 0 && (
                <Alternatives
                  places={result.alternatives}
                  onPick={(p) => runSearch(`${p.name}, ${p.address}`.slice(0, 120))}
                />
              )}
              <ReviewsPanel state={reviews} overallRating={result.place.rating} />
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

        {/* Link to Stage 02 */}
        <div className="text-center">
          <a
            href="#sample-audit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono text-zinc-300 hover:text-white transition-all cursor-pointer shadow-xs"
          >
            <span className="text-[#d9bd8b] font-bold">STAGE 02 ↓</span>
            <span>See how we verify a hotel on site</span>
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

const PlaceHeader: React.FC<{ place: PlaceSnapshot }> = ({ place }) => (
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
          View on Google Maps <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </div>

    <div className="shrink-0 rounded-xl bg-white/5 border border-white/10 px-5 py-4 text-center sm:min-w-[170px]">
      {typeof place.rating === 'number' ? (
        <>
          <div className="flex items-center justify-center gap-1.5">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span className="text-3xl font-bold text-white">{place.rating.toFixed(1)}</span>
          </div>
          <div className="text-[11px] text-zinc-300 mt-1">
            {place.ratingCount ? `from ${formatCount(place.ratingCount)} reviews` : 'Google rating'}
          </div>
        </>
      ) : (
        <div className="text-xs text-zinc-300">No Google rating yet</div>
      )}
      <div className="text-[10px] font-mono text-zinc-500 mt-2">Source: Google Maps</div>
    </div>
  </div>
);

// Google Hotels sends site scores on a 5-point scale, often without saying so.
const formatScore = (s: { value: number; max?: number }) => {
  if (s.max === 100) return `${Math.round(s.value)}%`;
  const max = s.max ?? (s.value <= 5 ? 5 : s.value <= 10 ? 10 : undefined);
  const value = Math.round(s.value * 10) / 10;
  return `${Number.isInteger(value) ? value : value.toFixed(1)}${max ? `/${max}` : ''}`;
};

const PlatformScoresRow: React.FC<{ state: PlatformScores | 'loading' | null }> = ({ state }) => {
  if (!state || (typeof state === 'object' && state.status === 'unavailable')) return null;
  if (state === 'loading') {
    return (
      <p className="text-[11px] text-zinc-400 flex items-center gap-2 -mt-2">
        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#d9bd8b]" /> Checking scores on other booking sites...
      </p>
    );
  }
  if (state.status === 'none') {
    return (
      <p className="text-[11px] text-zinc-500 -mt-2">
        No scores from other booking sites are listed for this property on Google Hotels.
      </p>
    );
  }
  return (
    <div className="-mt-2">
      <h4 className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Scores across platforms</h4>
      <ul className="mt-2 flex flex-wrap gap-2">
        {state.scores.map((s) => {
          const body = (
            <>
              <span className="text-zinc-300">{s.site}</span>
              <span className="font-bold text-white">{formatScore(s)}</span>
              {typeof s.votes === 'number' && <span className="text-zinc-500">({formatCount(s.votes)})</span>}
            </>
          );
          return (
            <li key={s.site}>
              {s.url ? (
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.04] border border-white/10 hover:border-[#d9bd8b]/50 px-3 py-1.5 text-xs"
                >
                  {body}
                </a>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.04] border border-white/10 px-3 py-1.5 text-xs">
                  {body}
                </span>
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-1.5 text-[10px] text-zinc-500">
        As listed on Google Hotels under “Reviews from the web”. Each site uses its own scale.
      </p>
    </div>
  );
};

const Alternatives: React.FC<{ places: PlaceSnapshot[]; onPick: (p: PlaceSnapshot) => void }> = ({
  places,
  onPick,
}) => (
  <div className="-mt-2">
    <p className="text-[11px] text-zinc-400 mb-2">Not the right place? Other matches on Google:</p>
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
              · {p.rating.toFixed(1)}★{p.ratingCount ? ` (${formatCount(p.ratingCount)})` : ''}
            </span>
          )}
        </button>
      ))}
    </div>
  </div>
);

const STATUS_LABEL: Record<NonNullable<PlaceSnapshot['status']>, { text: string; tone: string }> = {
  OPERATIONAL: { text: 'Operating', tone: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10' },
  CLOSED_TEMPORARILY: { text: 'Temporarily closed', tone: 'text-rose-300 border-rose-500/40 bg-rose-500/15' },
  CLOSED_PERMANENTLY: { text: 'Permanently closed', tone: 'text-rose-300 border-rose-500/40 bg-rose-500/15' },
};

const chip = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10.5px]';
const plainChip = `${chip} text-zinc-300 border-white/10 bg-white/5`;

// Facts straight from the Google listing; anything Google doesn't report is left out.
const PlaceFacts: React.FC<{ place: PlaceSnapshot }> = ({ place }) => {
  const status = place.status ? STATUS_LABEL[place.status] : null;
  const hasFacts =
    status || place.wheelchairEntrance !== undefined || place.parking || place.website || place.phone;
  if (!hasFacts) return null;
  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5">
      {status && <span className={`${chip} ${status.tone}`}>{status.text} (Google)</span>}
      {place.wheelchairEntrance !== undefined && (
        <span className={plainChip}>
          <Accessibility className="w-3 h-3" />
          {place.wheelchairEntrance ? 'Wheelchair-accessible entrance' : 'No wheelchair-accessible entrance'}
        </span>
      )}
      {place.parking && (
        <span className={plainChip}>
          <Car className="w-3 h-3" />
          {place.parking}
        </span>
      )}
      {place.website && (
        <a href={place.website} target="_blank" rel="noopener noreferrer" className={`${plainChip} hover:text-white`}>
          <Globe className="w-3 h-3" />
          Website
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
  if (!state || state.status === 'disabled') {
    return (
      <p className="text-xs text-zinc-400">
        A breakdown of recent guest reviews is included in the free 24-hour Desk Brief.
      </p>
    );
  }
  if (state.status === 'pending') {
    return (
      <div className="rounded-xl bg-white/[0.03] border border-white/10 p-5 flex items-center gap-3">
        <Loader2 className="w-5 h-5 animate-spin text-[#d9bd8b] shrink-0" />
        <div>
          <p className="text-sm text-white">Reading the latest Google and Tripadvisor reviews...</p>
          <p className="text-[11px] text-zinc-400">This usually takes about a minute. The Google rating above is already live.</p>
        </div>
      </div>
    );
  }
  if (state.status === 'error') {
    return <p className="text-xs text-zinc-400">The recent-review breakdown couldn’t be loaded right now.</p>;
  }
  return <AnalysisView analysis={state.analysis} overallRating={overallRating} />;
};

const AnalysisView: React.FC<{ analysis: ReviewAnalysis; overallRating?: number }> = ({ analysis, overallRating }) => {
  const n = analysis.sampleSize;
  const written = analysis.writtenCount ?? n;
  if (n === 0) {
    return <p className="text-xs text-zinc-400">No recent written reviews were found for this hotel.</p>;
  }

  const range =
    analysis.dateFrom && analysis.dateTo
      ? ` · ${formatMonth(analysis.dateFrom)} – ${formatMonth(analysis.dateTo)}`
      : '';

  let comparison = '';
  if (typeof analysis.averageRating === 'number' && typeof overallRating === 'number') {
    const diff = analysis.averageRating - overallRating;
    comparison =
      diff >= 0.2 ? `above the overall ${overallRating.toFixed(1)}`
      : diff <= -0.2 ? `below the overall ${overallRating.toFixed(1)}`
      : `in line with the overall ${overallRating.toFixed(1)}`;
  }

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-base font-bold text-white font-serif">What recent guests say</h4>
        <p className="text-[11px] font-mono text-zinc-400 mt-0.5">
          Based on the latest {sampleText(analysis)} ({written} with written comments)
          {range}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {typeof analysis.averageRating === 'number' && (
          <Stat
            label="Recent average"
            value={`${analysis.averageRating.toFixed(1)} ★`}
            note={comparison}
          />
        )}
        {typeof analysis.lastYearCount === 'number' && (
          <Stat
            label="Last 12 months"
            value={`${analysis.lastYearCount} review${analysis.lastYearCount === 1 ? '' : 's'}`}
            note={analysis.dateTo ? `most recent: ${formatMonth(analysis.dateTo)}` : undefined}
          />
        )}
        {typeof analysis.germanCount === 'number' && written > 0 && (
          <Stat label="Written in German" value={`${analysis.germanCount} of ${written}`} note="written reviews" />
        )}
        <Stat
          label="Reviews analysed"
          value={String(n)}
          note={written < 20 ? `only ${written} with comments` : `${written} with comments`}
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
        <p className="text-xs text-zinc-400">A theme breakdown isn’t available for this hotel.</p>
      )}

      <p className="text-[10px] text-zinc-500 leading-relaxed">
        Themes are grouped by AI from the review text. Counts show how many written reviews in this sample mention each
        theme, and quotes are copied word for word. The average includes star-only ratings. Review data:{' '}
        {sourceNames(analysis)}.
        {analysis.sources
          ?.filter((s) => s.source !== 'Google' && s.name)
          .map((s) => (
            <span key={s.source}>
              {' '}
              {s.source} listing:{' '}
              {s.url ? (
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-300">
                  {s.name}
                </a>
              ) : (
                s.name
              )}
              .
            </span>
          ))}
      </p>
    </div>
  );
};

const RiskChecklist: React.FC<{ risks: RiskCheck[]; total: number }> = ({ risks, total }) => (
  <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4">
    <h5 className="text-sm font-bold text-white">Risk checklist</h5>
    <p className="text-[11px] text-zinc-400 mt-0.5">
      Complaints in the {total} written reviews about the issues European guests notice most.
    </p>
    <ul className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
      {risks.map((r) => {
        const icon =
          r.count === 0 ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className={`w-4 h-4 shrink-0 ${r.count >= 3 ? 'text-rose-400' : 'text-amber-300'}`} />
          );
        return (
          <li key={r.key} className="rounded-lg bg-white/[0.03] border border-white/5 px-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-xs font-semibold text-white">
                {icon}
                {r.label}
              </span>
              <span className="text-[11px] font-mono text-zinc-300 whitespace-nowrap">
                {r.count === 0 ? 'No complaints' : `${r.count} complaint${r.count === 1 ? '' : 's'}`}
              </span>
            </div>
            {r.quote && (
              <p className="mt-1 text-[11px] text-zinc-400 leading-relaxed">
                <span className="italic">“{r.quote.text}”</span>
                {(r.quote.date || r.quote.source) && (
                  <span className="text-zinc-500"> — {[formatMonth(r.quote.date), r.quote.source].filter(Boolean).join(', ')}</span>
                )}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  </div>
);

const Stat: React.FC<{ label: string; value: string; note?: string }> = ({ label, value, note }) => (
  <div className="rounded-xl bg-white/[0.04] border border-white/10 p-3.5">
    <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">{label}</div>
    <div className="text-xl font-bold text-white mt-0.5">{value}</div>
    {note && <div className="text-[11px] text-zinc-400">{note}</div>}
  </div>
);

const ThemeCard: React.FC<{ theme: Theme; total: number }> = ({ theme, total }) => {
  const tone =
    theme.sentiment === 'positive'
      ? { icon: <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />, bar: 'bg-emerald-400' }
      : theme.sentiment === 'negative'
      ? { icon: <ThumbsDown className="w-3.5 h-3.5 text-rose-400" />, bar: 'bg-rose-400' }
      : { icon: <MessageSquareQuote className="w-3.5 h-3.5 text-amber-300" />, bar: 'bg-amber-300' };

  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          {tone.icon}
          <span>{theme.label}</span>
        </div>
        <span className="text-[11px] font-mono text-zinc-300 whitespace-nowrap">
          {theme.count} of {total}
        </span>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div className={`h-full ${tone.bar}`} style={{ width: `${Math.min(100, (theme.count / total) * 100)}%` }} />
      </div>
      {theme.quotes.length > 0 && (
        <ul className="mt-3 space-y-2">
          {theme.quotes.map((q, i) => (
            <li key={i} className="text-[11px] text-zinc-300 leading-relaxed">
              <span className="italic">“{q.text}”</span>
              <span className="text-zinc-500">
                {' '}
                — {[formatMonth(q.date), typeof q.rating === 'number' ? `${q.rating}★` : '', q.source].filter(Boolean).join(', ')}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// "100 Google + 50 Tripadvisor reviews", or "100 Google reviews" for older or Google-only results.
function sampleText(a: ReviewAnalysis): string {
  if (!a.sources?.length) return `${a.sampleSize} ${a.sourceLabel}`;
  return `${a.sources.map((s) => `${s.count} ${s.source}`).join(' + ')} reviews`;
}

function sourceNames(a: ReviewAnalysis): string {
  return a.sources?.length ? a.sources.map((s) => s.source).join(' and ') : 'Google';
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
      typeof a.lastYearCount === 'number' && `Reviews in last 12 months: ${a.lastYearCount}`,
      typeof a.germanCount === 'number' && `Written in German: ${a.germanCount} of ${w}`,
      a.themes.length > 0 && `Themes: ${a.themes.map((t) => `${t.label} (${t.count}/${w})`).join('; ')}`,
      a.risks && `Risk checklist: ${a.risks.map((r) => `${r.label} ${r.count}`).join('; ')}`,
    );
  }
  if (scores && scores !== 'loading' && scores.status === 'ok') {
    lines.push(`Other platforms (Google Hotels): ${scores.scores.map((s) => `${s.site} ${formatScore(s)}`).join('; ')}`);
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
    const fields = { Email: address, Hotel: place.name, Snapshot: snapshotText(place, reviews, scores) };
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
          Want the deeper picture? Get the 24-hour Desk Brief
        </h4>
        <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
          This snapshot is instant and based on Google. The Desk Brief on {place.name} goes further: what
          German-speaking guests say on Booking.com compared with other guests, a risk checklist with verbatim quotes,
          and what to check on site. Our team reviews it and emails it to you within 24 hours. Free for travel
          companies.
        </p>
      </div>

      {state === 'sent' ? (
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-200 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-px" />
          <span>
            Thank you. Our team is preparing the Desk Brief on {place.name} and will email it, with this
            snapshot, to <strong>{email.trim()}</strong> within 24 hours.
          </span>
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
              placeholder="Your work email"
              aria-label="Your work email"
              className="w-full bg-transparent text-white placeholder-zinc-400 text-sm py-2.5 focus:outline-hidden"
            />
          </div>
          <button
            type="submit"
            disabled={state === 'sending'}
            className="px-5 py-2.5 rounded-xl bg-[#b38a54] hover:bg-[#c59b63] disabled:opacity-60 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{state === 'sending' ? 'Sending...' : 'Send me the 24h Desk Brief'}</span>
          </button>
        </form>
      )}

      {state !== 'sent' && (
        <p className="text-[10px] text-zinc-400">
          We use your email only to send this brief.{' '}
          <a href="/privacy" className="underline hover:text-white">
            Privacy notice
          </a>
        </p>
      )}

      {state === 'error' && (
        <p className="text-[11px] text-rose-300">
          {fallbackHref ? (
            <>
              This couldn’t be sent right now. Please email us at {CONTACT_EMAIL} —{' '}
              <a href={fallbackHref} className="underline font-semibold">
                open a pre-filled email
              </a>
              .
            </>
          ) : (
            'Please enter a valid email address.'
          )}
        </p>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pt-1">
        <button
          type="button"
          onClick={onAudit}
          className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-zinc-200 hover:text-white text-[11px] font-semibold flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Commission On-Site Audit</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={onBrief} className="text-[11px] text-zinc-400 hover:text-white underline cursor-pointer">
          or use the full enquiry form
        </button>
      </div>
    </div>
  );
};

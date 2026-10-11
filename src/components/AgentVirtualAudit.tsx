import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Compass,
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
  ReviewAnalysis,
  ReviewsState,
  SnapshotResponse,
  Theme,
} from '../../api/_lib/types';

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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInput.trim();
    if (query.length < 2) {
      setInputError('Please enter a hotel name.');
      return;
    }
    const id = ++searchId.current;
    setInputError('');
    setSubmittedQuery(query);
    setIsLoading(true);
    setResult(null);
    setReviews(null);

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
            Type a hotel name to see its live Google rating and what the latest 100 guests talk about —{' '}
            <strong className="text-white font-medium">counted, dated and sourced</strong>.
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
              body="Our desk can still prepare your free 24-hour brief for this hotel."
              actionLabel="Request Free 24h Brief"
              onAction={() => requestBrief(submittedQuery)}
            />
          )}

          {!isLoading && result?.status === 'ok' && (
            <div className="rounded-2xl bg-[#0c182a] border border-white/15 shadow-2xl p-6 sm:p-8 text-left space-y-6">
              <PlaceHeader place={result.place} />
              <ReviewsPanel state={reviews} overallRating={result.place.rating} />
              <BriefCta
                name={result.place.name}
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

const ReviewsPanel: React.FC<{ state: ReviewsState | null; overallRating?: number }> = ({ state, overallRating }) => {
  if (!state || state.status === 'disabled') {
    return (
      <p className="text-xs text-zinc-400">
        A breakdown of recent guest reviews is included in the free 24-hour brief.
      </p>
    );
  }
  if (state.status === 'pending') {
    return (
      <div className="rounded-xl bg-white/[0.03] border border-white/10 p-5 flex items-center gap-3">
        <Loader2 className="w-5 h-5 animate-spin text-[#d9bd8b] shrink-0" />
        <div>
          <p className="text-sm text-white">Reading the latest 100 guest reviews...</p>
          <p className="text-[11px] text-zinc-400">This can take up to a minute. The Google rating above is already live.</p>
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
          Based on the latest {n} {analysis.sourceLabel}
          {range}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {typeof analysis.averageRating === 'number' && (
          <Stat
            label="Recent average"
            value={`${analysis.averageRating.toFixed(1)} ★`}
            note={comparison}
          />
        )}
        {typeof analysis.germanCount === 'number' && (
          <Stat label="Written in German" value={`${analysis.germanCount} of ${n}`} note="reviews in this sample" />
        )}
        <Stat label="Reviews analysed" value={String(n)} note={n < 20 ? 'small sample' : 'most recent first'} />
      </div>

      {analysis.themes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {analysis.themes.map((theme) => (
            <ThemeCard key={theme.label} theme={theme} total={n} />
          ))}
        </div>
      ) : (
        <p className="text-xs text-zinc-400">A theme breakdown isn’t available for this hotel.</p>
      )}

      <p className="text-[10px] text-zinc-500 leading-relaxed">
        Themes are grouped by AI from the review text. Counts show how many reviews in this sample mention each theme,
        and quotes are copied word for word. Review data: Google.
      </p>
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
                — {[formatMonth(q.date), typeof q.rating === 'number' ? `${q.rating}★` : ''].filter(Boolean).join(', ')}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const BriefCta: React.FC<{ name: string; onBrief: () => void; onAudit: () => void }> = ({ name, onBrief, onAudit }) => (
  <div className="rounded-2xl border border-[#d9bd8b]/40 bg-[#b38a54]/10 p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
    <div className="max-w-xl">
      <h4 className="text-base sm:text-lg font-bold text-white font-serif">
        Want HolidayCheck, Booking.com and German-guest analysis?
      </h4>
      <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
        Our desk adds the platforms German travellers use and sends a 2-page brief on {name} within 24 hours. Free for
        travel companies.
      </p>
    </div>
    <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
      <button
        type="button"
        onClick={onBrief}
        className="px-5 py-3 rounded-xl bg-[#b38a54] hover:bg-[#c59b63] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
      >
        <FileText className="w-3.5 h-3.5" />
        <span>Request Free 24h Brief</span>
      </button>
      <button
        type="button"
        onClick={onAudit}
        className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-zinc-200 hover:text-white text-[11px] font-semibold flex items-center justify-center gap-2 cursor-pointer"
      >
        <span>Commission On-Site Audit</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
);

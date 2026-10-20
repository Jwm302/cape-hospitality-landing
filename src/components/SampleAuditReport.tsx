import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BedDouble,
  Building2,
  Camera,
  CheckCircle2,
  Clock,
  Coffee,
  DoorOpen,
  FileCheck2,
  Lock,
  ShieldCheck,
  ShowerHead,
  Sparkles,
  Thermometer,
  Volume2,
  Wrench,
} from 'lucide-react';
import queueImg from '../assets/images/sample-report/queue.jpg';
import luggageImg from '../assets/images/sample-report/luggage.jpg';
import conciergeImg from '../assets/images/sample-report/concierge.jpg';
import buffetEmptyImg from '../assets/images/sample-report/buffet-empty.jpg';
import bedroomImg from '../assets/images/sample-report/bedroom.jpg';
import bedImg from '../assets/images/sample-report/bed.jpg';
import bathroomImg from '../assets/images/sample-report/bathroom.jpg';
import restaurantImg from '../assets/images/sample-report/restaurant.jpg';
import breakfastImg from '../assets/images/sample-report/breakfast.jpg';
import barImg from '../assets/images/sample-report/bar.jpg';
import poolImg from '../assets/images/sample-report/pool.jpg';
import spaImg from '../assets/images/sample-report/spa.jpg';

interface SampleAuditReportProps {
  onCommissionAudit: () => void;
  onRequestFreeDataPackage: () => void;
}

// Illustrative report for an archetype hotel. Every figure on a slide comes
// from the data below, so the overall score always matches the departments.

const REPORT = {
  id: 'CHA-OS-2026-0147',
  hotel: 'The Historic City Hotel',
  archetype: 'Historic 5-star city hotel, Cape Town City Bowl · 146 rooms in two wings',
  stay: 'Tue 14 – Wed 15 Oct 2026 · 1 night, 22 hours on property',
  rooms: 'Room 214 (heritage wing, booked as a standard tour-operator room) · Room 508 (garden wing, inspected at check-out)',
  inspector: 'Senior inspector, 14 years in European luxury hotel operations',
  delivered: 'Thu 16 Oct 2026, 10:00 (36 hours after check-out)',
};

const DEPARTMENTS: { name: string; weight: number; score: number; icon: React.ElementType; note: string }[] = [
  { name: 'Arrival & front office', weight: 12, score: 76, icon: Building2, note: '12-min queue at a coach arrival, concierge unstaffed, luggage left 25 min; warm check-in once served' },
  { name: 'Room & sleep comfort', weight: 20, score: 72, icon: BedDouble, note: 'Excellent bed; AC rattle and 05:45 street noise in the heritage wing' },
  { name: 'Bathroom & hot water', weight: 15, score: 64, icon: ShowerHead, note: 'Shower peaked at 38 °C during the 07:15 rush; spotless otherwise' },
  { name: 'Housekeeping & cleanliness', weight: 15, score: 90, icon: Sparkles, note: 'No dust or hair at 14 hidden check-points; turndown on time' },
  { name: 'Breakfast & dining', weight: 13, score: 88, icon: Coffee, note: 'Fresh, local, attentive; hot buffet empty 11 min, eggs took 17 min' },
  { name: 'Public areas, pool & spa', weight: 10, score: 93, icon: Camera, note: 'Immaculate lounge and terrace; pool towels restocked hourly' },
  { name: 'Staff & service recovery', weight: 10, score: 92, icon: Wrench, note: 'Shower complaint fixed with a room offer within 25 minutes' },
  { name: 'Safety & security', weight: 5, score: 86, icon: ShieldCheck, note: 'Key cards checked at lifts; one fire door wedged open on floor 2' },
];

const OVERALL = Math.round(DEPARTMENTS.reduce((sum, d) => sum + d.weight * d.score, 0) / 100);

const TIMELINE: { time: string; title: string; text: string; tone: 'ok' | 'warn' | 'bad' }[] = [
  { time: '15:03', title: 'Arrival with a coach group', text: 'One receptionist and no concierge as 28 guests arrive. 12-min queue, no drink offered; group luggage left unattended for 25 min.', tone: 'warn' },
  { time: '15:41', title: 'Room 214, heritage wing', text: 'Handsome room, excellent mattress. Sash window does not seal; AC unit marked for service in May.', tone: 'warn' },
  { time: '19:30', title: 'Dinner, à la carte', text: 'Starter in 11 min, main in 24 min. Wine served at the right temperature. Waiter recommends local dishes in German.', tone: 'ok' },
  { time: '02:30', title: 'Night noise', text: 'AC rattles every 3–4 min, peaks of 47 dB at the pillow. Inspector wakes twice.', tone: 'bad' },
  { time: '05:45', title: 'Street cleaning', text: 'Municipal sweeper under the window for 9 min, 52 dB inside the room.', tone: 'bad' },
  { time: '07:15', title: 'Morning shower test', text: '4 min to warm up, peaks at 38 °C. Same test in garden-wing room 508: 42 °C after 40 seconds.', tone: 'bad' },
  { time: '07:40', title: 'Service recovery test', text: 'Inspector reports the shower. Duty manager calls back in 6 min, engineer arrives in 25 min, room move offered.', tone: 'ok' },
  { time: '08:30', title: 'Breakfast', text: 'Fresh breads, local fruit, good coffee. Hot buffet empty for 11 min; cooked eggs take 17 min.', tone: 'ok' },
  { time: '11:00', title: 'Check-out', text: 'Bill correct, 4 min. Concierge books a taxi and checks the flight time unprompted.', tone: 'ok' },
];

// Indicative readings: probe thermometer (±0.5 °C) and a phone sound meter (±3 dB).
const SHOWER_214 = [18, 22, 27, 31, 34, 36, 37.5, 38, 38];
const SHOWER_508 = [24, 42, 43, 43, 43, 43, 43, 43, 43];
const NOISE: [string, number][] = [
  ['22:00', 34], ['23:00', 33], ['00:00', 31], ['01:00', 31], ['02:00', 33], ['02:30', 47],
  ['03:00', 45], ['04:00', 44], ['05:00', 36], ['05:45', 52], ['06:30', 40], ['07:00', 42],
];

const RISKS: { issue: string; who: string; likelihood: 'High' | 'Medium' | 'Low'; impact: string }[] = [
  { issue: 'Lukewarm morning showers', who: 'Heritage-wing rooms, 07:00–08:00', likelihood: 'High', impact: 'Typical German guest complaint; supports a price-reduction claim under package-travel rules' },
  { issue: 'Night noise (AC, street cleaning)', who: 'Heritage-wing rooms facing the street', likelihood: 'High', impact: 'Sleep complaints, poor reviews in the first night of the trip' },
  { issue: 'Queue on coach arrival', who: 'Groups arriving 14:30–16:00', likelihood: 'Medium', impact: 'Weak first impression after a long-haul flight' },
  { issue: 'Fire door wedged open', who: 'Floor 2', likelihood: 'Low', impact: 'Safety finding; to be raised with the hotel in writing' },
];

const RECOMMENDATIONS: { title: string; text: string }[] = [
  { title: 'Keep the contract, change the allocation', text: 'Write into the contract that your guests are allocated to the garden wing (floors 4–6). It scored 91 for sleep and 95 for the shower in our tests.' },
  { title: 'Ask for two fixes by a date', text: 'Hot-water recirculation in the heritage wing and AC service in rooms 201–232, both before 1 December, ahead of the European peak season.' },
  { title: 'Protect group arrivals', text: 'Send rooming lists 48 h ahead and ask for a second receptionist and welcome drinks for coaches arriving 14:30–16:00.' },
  { title: 'Re-check in 90 days', text: 'A short unannounced re-visit confirms the fixes before your peak bookings arrive.' },
];

const SLIDES = ['Summary', 'Scorecard', '24 hours', 'Evidence', 'Recommendations'];

const toneStyles = {
  ok: 'bg-emerald-500',
  warn: 'bg-amber-500',
  bad: 'bg-rose-500',
};

const scoreColor = (s: number) => (s >= 85 ? 'bg-emerald-500' : s >= 75 ? 'bg-amber-400' : 'bg-rose-500');
const scoreText = (s: number) => (s >= 85 ? 'text-emerald-700' : s >= 75 ? 'text-amber-700' : 'text-rose-700');

// ---------- small building blocks ----------

const SlideHeader: React.FC<{ index: number; title: string; subtitle: string }> = ({ index, title, subtitle }) => (
  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-4 mb-5 border-b border-zinc-200">
    <div>
      <div className="font-mono text-[10px] tracking-widest uppercase text-[#9c753e] font-bold">
        {String(index + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')} · {REPORT.hotel}
      </div>
      <h3 className="mt-1 text-xl sm:text-2xl font-bold text-[#10213a]">{title}</h3>
      <p className="mt-1 text-xs sm:text-sm text-zinc-500">{subtitle}</p>
    </div>
    <div className="font-mono text-[10px] text-zinc-400 shrink-0">{REPORT.id} · Confidential</div>
  </div>
);

const LineChart: React.FC<{
  series: { values: number[]; color: string; label: string }[];
  min: number;
  max: number;
  labels: string[];
  band?: [number, number, string];
  unit: string;
}> = ({ series, min, max, labels, band, unit }) => {
  const W = 320;
  const H = 150;
  const pad = { l: 30, r: 16, t: 10, b: 22 };
  const n = labels.length;
  const x = (i: number) => pad.l + (i * (W - pad.l - pad.r)) / (n - 1);
  const y = (v: number) => pad.t + ((max - v) * (H - pad.t - pad.b)) / (max - min);
  const ticks = [min, (min + max) / 2, max];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img">
      {band && (
        <>
          <rect x={pad.l} y={y(band[1])} width={W - pad.l - pad.r} height={y(band[0]) - y(band[1])} fill="#10b981" opacity="0.1" />
          <text x={W - pad.r - 3} y={y(band[0]) - 3} textAnchor="end" fontSize="8" fill="#047857">{band[2]}</text>
        </>
      )}
      {ticks.map((t) => (
        <g key={t}>
          <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke="#e4e4e7" strokeWidth="0.75" />
          <text x={pad.l - 4} y={y(t) + 3} textAnchor="end" fontSize="8" fill="#a1a1aa">{t}{unit}</text>
        </g>
      ))}
      {labels.map((l, i) =>
        i % Math.ceil(n / 6) === 0 ? (
          <text key={l} x={x(i)} y={H - 6} textAnchor="middle" fontSize="8" fill="#a1a1aa">{l}</text>
        ) : null,
      )}
      {series.map((s) => (
        <g key={s.label}>
          <polyline
            fill="none"
            stroke={s.color}
            strokeWidth="2"
            strokeLinejoin="round"
            points={s.values.map((v, i) => `${x(i)},${y(v)}`).join(' ')}
          />
          {s.values.map((v, i) => (
            <circle key={i} cx={x(i)} cy={y(v)} r="1.8" fill={s.color} />
          ))}
        </g>
      ))}
    </svg>
  );
};

// ---------- slides ----------

const SummarySlide: React.FC = () => (
  <>
    <SlideHeader index={0} title="Executive summary" subtitle="On-site mystery audit · what your guests will experience" />

    <div className="relative mb-5 h-36 sm:h-44 rounded-xl overflow-hidden">
      <img src={restaurantImg} alt="Restaurant of the audited hotel" className="absolute inset-0 w-full h-full object-cover object-[50%_30%]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#10213a]/90 via-[#10213a]/50 to-transparent" />
      <div className="relative h-full flex flex-col justify-end p-4 sm:p-5 text-white max-w-md">
        <div className="text-lg sm:text-xl font-semibold">{REPORT.hotel}</div>
        <div className="text-[11px] sm:text-xs text-zinc-200">{REPORT.archetype}</div>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
      <div className="lg:col-span-2 rounded-xl bg-[#10213a] text-white p-5 flex flex-col">
        <div className="font-mono text-[10px] tracking-widest uppercase text-[#d9bd8b]">Experience reality score</div>
        <div className="mt-2 flex items-end gap-2">
          <span className="text-6xl font-light leading-none">{OVERALL}</span>
          <span className="text-zinc-400 mb-1">/ 100</span>
        </div>
        <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full bg-[#d9bd8b]" style={{ width: `${OVERALL}%` }} />
        </div>
        <div className="mt-5 rounded-lg bg-white/5 border border-white/10 p-3">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Verdict</div>
          <div className="mt-1 text-base font-semibold text-white">Keep contracting, with conditions</div>
          <p className="mt-1 text-xs text-zinc-300 leading-relaxed">
            A genuinely excellent hotel let down by its older wing. Allocate your guests to the garden wing and the risk
            largely disappears.
          </p>
        </div>
        <dl className="mt-5 space-y-2 text-[11px] text-zinc-300">
          <div><dt className="inline text-zinc-500">Stay: </dt><dd className="inline">{REPORT.stay}</dd></div>
          <div><dt className="inline text-zinc-500">Inspector: </dt><dd className="inline">{REPORT.inspector}</dd></div>
          <div><dt className="inline text-zinc-500">Delivered: </dt><dd className="inline">{REPORT.delivered}</dd></div>
        </dl>
      </div>

      <div className="lg:col-span-3 space-y-4">
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
          <div className="text-[10px] font-mono uppercase tracking-wider text-amber-800 font-bold">Why we went</div>
          <p className="mt-1 text-sm text-amber-950 leading-relaxed">
            The Virtual Audit counted <strong>23 recent complaints</strong> about lukewarm showers and noisy air
            conditioning, <strong>9 of them from German-speaking guests</strong>. You asked us to verify before signing the
            2027 allocation of 40 rooms a week.
          </p>
        </div>

        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold mb-2">What we found</div>
          <ul className="space-y-2.5">
            {[
              { icon: CheckCircle2, color: 'text-rose-600', text: <>The complaints are <strong>real and specific to the heritage wing</strong>: shower peaked at 38 °C, AC peaks of 47 dB at night.</> },
              { icon: CheckCircle2, color: 'text-emerald-600', text: <>The <strong>garden wing is excellent</strong>: 42 °C water in 40 seconds, quiet at night, renovated in 2019.</> },
              { icon: CheckCircle2, color: 'text-emerald-600', text: <>Staff are the hotel’s strength: the shower complaint was <strong>resolved in 25 minutes</strong> with a room move.</> },
              { icon: CheckCircle2, color: 'text-amber-600', text: <>Coach arrivals overwhelm the front desk: <strong>12-minute queue</strong> with one receptionist.</> },
            ].map((f, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-700 leading-relaxed">
                <f.icon className={`w-4 h-4 mt-0.5 shrink-0 ${f.color}`} />
                <span>{f.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-zinc-200 p-4">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold">The one thing to do</div>
          <p className="mt-1 text-sm text-[#10213a] font-semibold leading-relaxed">
            Add a garden-wing allocation clause before signing. It addresses the two issues behind most of the complaints.
          </p>
        </div>
      </div>
    </div>
  </>
);

const ScorecardSlide: React.FC = () => (
  <>
    <SlideHeader index={1} title="Department scorecard" subtitle="8 departments, 112 check-points, weighted for what European guests notice" />

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 space-y-3">
        {DEPARTMENTS.map((d) => (
          <div key={d.name} className="grid grid-cols-[1.25rem_1fr_auto] items-start gap-x-3">
            <d.icon className="w-4 h-4 mt-0.5 text-[#b38a54]" />
            <div>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-semibold text-[#10213a]">{d.name}</span>
                <span className="text-[10px] font-mono text-zinc-400">weight {d.weight}%</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-zinc-100 overflow-hidden">
                <div className={`h-full ${scoreColor(d.score)}`} style={{ width: `${d.score}%` }} />
              </div>
              <p className="mt-1 text-[11px] text-zinc-500 leading-snug">{d.note}</p>
            </div>
            <span className={`text-lg font-semibold tabular-nums ${scoreText(d.score)}`}>{d.score}</span>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-4">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold">One hotel, two experiences</div>
          <table className="mt-3 w-full text-xs">
            <thead>
              <tr className="text-zinc-500">
                <th className="text-left font-normal pb-1.5"></th>
                <th className="text-right font-normal pb-1.5">Heritage<br />214</th>
                <th className="text-right font-normal pb-1.5">Garden<br />508</th>
              </tr>
            </thead>
            <tbody className="text-zinc-700">
              {[
                ['Sleep comfort', 58, 91],
                ['Shower', 52, 95],
                ['Room condition', 84, 93],
                ['View & light', 88, 86],
              ].map(([label, a, b]) => (
                <tr key={label as string} className="border-t border-zinc-200">
                  <td className="py-1.5">{label}</td>
                  <td className={`py-1.5 text-right font-semibold tabular-nums ${scoreText(a as number)}`}>{a}</td>
                  <td className={`py-1.5 text-right font-semibold tabular-nums ${scoreText(b as number)}`}>{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-[11px] text-zinc-500 leading-snug">
            The overall score is held down by the heritage wing. Garden-wing rooms alone would score about 89.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 p-4">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold">How to read the scores</div>
          <ul className="mt-2 space-y-1.5 text-[11px] text-zinc-600">
            <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> 85+ meets what you sell</li>
            <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> 75–84 noticeable, manageable</li>
            <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> below 75 likely to cause complaints</li>
          </ul>
        </div>
      </div>
    </div>
  </>
);

const TimelineSlide: React.FC = () => (
  <>
    <SlideHeader index={2} title="22 hours as your guest" subtitle="Every observation is dated and timed, so it can be checked later" />

    <ol className="relative grid grid-cols-1 md:grid-cols-3 gap-3">
      {TIMELINE.map((t) => (
        <li key={t.time} className="rounded-xl border border-zinc-200 p-3.5 bg-white">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${toneStyles[t.tone]}`} />
            <span className="font-mono text-xs font-bold text-[#10213a]">{t.time}</span>
            <span className="text-xs font-semibold text-zinc-800">{t.title}</span>
          </div>
          <p className="mt-1.5 text-[11px] text-zinc-600 leading-relaxed">{t.text}</p>
        </li>
      ))}
    </ol>

    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[11px] text-zinc-500">
      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> as expected</span>
      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> below standard</span>
      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500" /> likely complaint</span>
      <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> 41 timed observations in the full report</span>
    </div>
  </>
);

// A photo, or for a problem without a photo, the measured reading itself.
const PhotoTile: React.FC<{ src?: string; reading?: string; label: string; stamp: string; icon?: React.ElementType; finding: string; className?: string; tone?: keyof typeof toneStyles }> = ({
  src,
  reading,
  label,
  stamp,
  icon: Icon,
  finding,
  className = '',
  tone = 'ok',
}) => (
  <figure className={`relative overflow-hidden rounded-lg bg-[#10213a] min-h-[120px] ${className}`}>
    {src ? (
      <img src={src} alt={label} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
    ) : (
      <div className="absolute inset-0 flex items-center justify-center gap-2 pb-8 bg-[radial-gradient(circle_at_30%_20%,#1f3a5f,#0c182a)]">
        {Icon && <Icon className={`${reading ? 'w-6 h-6' : 'w-10 h-10'} text-[#d9bd8b]/80`} strokeWidth={1.5} />}
        {reading && <span className="text-2xl sm:text-3xl font-semibold text-rose-400 tabular-nums">{reading}</span>}
      </div>
    )}
    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
    <span className="absolute top-2 left-2 whitespace-nowrap font-mono text-[9px] text-white/80 bg-black/40 px-1.5 py-0.5 rounded">{stamp}</span>
    <span className={`absolute top-2 right-2 w-2 h-2 rounded-full ${toneStyles[tone]}`} />
    <figcaption className="absolute bottom-0 inset-x-0 p-2.5">
      <div className="text-[11px] font-semibold text-white">{label}</div>
      <div className="text-[10px] text-zinc-300 leading-snug">{finding}</div>
    </figcaption>
  </figure>
);

const EvidenceSlide: React.FC = () => (
  <>
    <SlideHeader index={3} title="Evidence" subtitle="Photographs and measurements from the stay · 64 photos in the full appendix" />

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Collage: photos for what we saw, measured readings for the problems */}
      <div className="grid grid-cols-2 sm:grid-cols-3 auto-rows-[150px] sm:auto-rows-[120px] gap-1.5">
        <PhotoTile src={queueImg} label="Coach arrival" stamp="IMG_0116 · 15:09" finding="28 guests, one receptionist: 12-min queue" tone="bad" className="sm:col-span-2" />
        <PhotoTile icon={Thermometer} reading="38.0 °C" label="Shower, room 214" stamp="IMG_0207 · 07:19" finding="Peak after 4 min; comfortable is 40–45 °C" tone="bad" />
        <PhotoTile src={luggageImg} label="Group luggage" stamp="IMG_0121 · 15:22" finding="Left in the lobby, unattended for 25 min" tone="warn" />
        <PhotoTile src={bedroomImg} label="Room 214, heritage wing" stamp="IMG_0131 · 15:44" finding="Handsome and well kept; sash window does not seal" tone="warn" className="sm:col-span-2" />
        <PhotoTile src={restaurantImg} label="Dinner" stamp="IMG_0174 · 19:34" finding="Attentive, recommends local dishes" className="sm:col-span-2" />
        <PhotoTile icon={Volume2} reading="47 dB" label="AC rattle, room 214" stamp="REC_0012 · 02:31" finding="Every 3–4 min at the pillow" tone="bad" />
        <PhotoTile src={breakfastImg} label="Breakfast buffet" stamp="IMG_0229 · 08:22" finding="Fresh, local, well presented" />
        <PhotoTile src={buffetEmptyImg} label="Hot buffet" stamp="IMG_0234 · 08:41" finding="Empty for 11 min; eggs took 17 min" tone="warn" />
        <PhotoTile src={barImg} label="Bar" stamp="IMG_0188 · 21:10" finding="Cocktail served in 6 min" />
        <PhotoTile src={bedImg} label="Bed & linen" stamp="IMG_0133 · 15:46" finding="Crisp linen, excellent mattress" />
        <PhotoTile icon={DoorOpen} label="Fire door, floor 2" stamp="IMG_0249 · 10:12" finding="Wedged open with a doorstop" tone="warn" />
        <PhotoTile src={spaImg} label="Spa" stamp="IMG_0168 · 17:40" finding="Quiet; treatment started on time" />
        <PhotoTile src={conciergeImg} label="Concierge" stamp="IMG_0119 · 15:12" finding="Desk unstaffed during the arrival rush" tone="warn" className="col-span-2 sm:col-span-1" />
        <PhotoTile src={poolImg} label="Pool deck" stamp="IMG_0162 · 17:05" finding="Immaculate; towels restocked hourly" className="col-span-2" />
      </div>

      {/* Measurements */}
      <div className="space-y-4">
        <div className="rounded-xl border border-zinc-200 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#10213a] flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5 text-[#b38a54]" /> Shower temperature, first 4 minutes
            </span>
            <span className="text-[10px] font-mono text-zinc-400">07:15</span>
          </div>
          <LineChart
            min={15}
            max={45}
            unit="°"
            labels={['0:00', '0:30', '1:00', '1:30', '2:00', '2:30', '3:00', '3:30', '4:00']}
            band={[40, 45, 'comfortable 40–45 °C']}
            series={[
              { values: SHOWER_214, color: '#e11d48', label: 'Heritage 214' },
              { values: SHOWER_508, color: '#10b981', label: 'Garden 508' },
            ]}
          />
          <div className="flex gap-4 text-[10px] text-zinc-500">
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-rose-600" /> Heritage wing, room 214</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-emerald-500" /> Garden wing, room 508</span>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#10213a] flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-[#b38a54]" /> Noise at the pillow overnight, room 214
            </span>
            <span className="text-[10px] font-mono text-zinc-400">dB(A)</span>
          </div>
          <LineChart
            min={25}
            max={55}
            unit=""
            labels={NOISE.map(([t]) => t)}
            band={[25, 35, 'quiet bedroom']}
            series={[{ values: NOISE.map(([, v]) => v), color: '#10213a', label: 'Room 214' }]}
          />
          <p className="text-[10px] text-zinc-500 leading-snug">
            Peaks: AC rattle from 02:30 (47 dB), street sweeper at 05:45 (52 dB).
          </p>
        </div>

        <p className="text-[10px] text-zinc-400 leading-snug">
          Indicative readings: probe thermometer (±0.5 °C) and phone sound meter (±3 dB). We observe and record; we do not
          provide technical certification.
        </p>
      </div>
    </div>
  </>
);

const RecommendationsSlide: React.FC<SampleAuditReportProps> = ({ onCommissionAudit, onRequestFreeDataPackage }) => (
  <>
    <SlideHeader index={4} title="Risk & recommendations" subtitle="What this means for your guests, and what to do about it" />

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div>
        <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold mb-2">Complaint risk for your guests</div>
        <div className="space-y-2">
          {RISKS.map((r) => (
            <div key={r.issue} className="rounded-xl border border-zinc-200 p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-[#10213a] flex items-center gap-1.5">
                  <AlertTriangle className={`w-3.5 h-3.5 ${r.likelihood === 'High' ? 'text-rose-600' : r.likelihood === 'Medium' ? 'text-amber-600' : 'text-zinc-400'}`} />
                  {r.issue}
                </span>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    r.likelihood === 'High'
                      ? 'bg-rose-100 text-rose-700'
                      : r.likelihood === 'Medium'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-zinc-100 text-zinc-600'
                  }`}
                >
                  {r.likelihood}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-zinc-500">{r.who}</p>
              <p className="mt-0.5 text-[11px] text-zinc-700 leading-snug">{r.impact}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold mb-2">Our recommendations</div>
          <ol className="space-y-2.5">
            {RECOMMENDATIONS.map((r, i) => (
              <li key={r.title} className="flex gap-3">
                <span className="w-6 h-6 shrink-0 rounded-full bg-[#10213a] text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
                <div>
                  <div className="text-sm font-semibold text-[#10213a]">{r.title}</div>
                  <p className="text-[11px] text-zinc-600 leading-relaxed">{r.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-xl bg-[#10213a] text-white p-4">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-[#d9bd8b]">
            <FileCheck2 className="w-3.5 h-3.5" /> A factual record for your customer-care team
          </div>
          <p className="mt-1.5 text-xs text-zinc-300 leading-relaxed">
            If a guest claims the pool was closed or the room was dirty, this report shows what we found, with dates,
            times and photographs. If a complaint matches our findings, you know it is genuine before you reply.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={onCommissionAudit}
            className="flex-1 px-5 py-3 rounded-full bg-[#b38a54] hover:bg-[#9c753e] text-white text-sm font-semibold transition-colors"
          >
            Commission an audit for your hotel
          </button>
          <button
            onClick={onRequestFreeDataPackage}
            className="flex-1 px-5 py-3 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 text-sm font-semibold transition-colors"
          >
            Start with a free virtual audit
          </button>
        </div>
      </div>
    </div>
  </>
);

// ---------- viewer ----------

export const SampleAuditReport: React.FC<SampleAuditReportProps> = (props) => {
  const [slide, setSlide] = useState(0);
  const last = SLIDES.length - 1;
  const go = (i: number) => setSlide(Math.max(0, Math.min(last, i)));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setSlide((s) => Math.min(last, s + 1));
      if (e.key === 'ArrowLeft') setSlide((s) => Math.max(0, s - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [last]);

  const slides = [
    <SummarySlide />,
    <ScorecardSlide />,
    <TimelineSlide />,
    <EvidenceSlide />,
    <RecommendationsSlide {...props} />,
  ];

  return (
    <section id="sample-audit" className="py-10 sm:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-800">Sample On-Site Audit Report</h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-600 leading-relaxed">
            What your team receives within 48 hours of an unannounced stay. Five pages from a 22-page report.
          </p>
          <p className="mt-3 inline-flex items-center gap-2 text-[11px] text-zinc-500">
            <Lock className="w-3.5 h-3.5 text-[#b38a54] shrink-0" />
            “{REPORT.hotel}” is an archetype; findings are representative. Client reports are confidential and never published.
          </p>
        </div>

        {/* Slide tabs */}
        <nav className="mt-8 flex flex-wrap justify-center gap-1.5" aria-label="Report pages">
          {SLIDES.map((name, i) => (
            <button
              key={name}
              onClick={() => go(i)}
              aria-current={slide === i ? 'page' : undefined}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                slide === i ? 'bg-[#10213a] text-white' : 'bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-400'
              }`}
            >
              {i + 1}. {name}
            </button>
          ))}
        </nav>

        {/* Slide */}
        <div className="mt-5 bg-white rounded-2xl border border-zinc-200 shadow-lg overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-[#10213a] via-[#10213a] to-[#b38a54]" />
          <div className="p-5 sm:p-8 min-h-[560px]">{slides[slide]}</div>

          <div className="flex items-center justify-between px-5 sm:px-8 py-3 border-t border-zinc-100 bg-zinc-50">
            <button
              onClick={() => go(slide - 1)}
              disabled={slide === 0}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900 disabled:opacity-30"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Previous
            </button>
            <div className="flex gap-1.5">
              {SLIDES.map((name, i) => (
                <span key={name} className={`h-1.5 rounded-full transition-all ${slide === i ? 'w-6 bg-[#b38a54]' : 'w-1.5 bg-zinc-300'}`} />
              ))}
            </div>
            <button
              onClick={() => go(slide + 1)}
              disabled={slide === last}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900 disabled:opacity-30"
            >
              Next <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

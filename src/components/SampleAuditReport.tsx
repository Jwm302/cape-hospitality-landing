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
import restaurantImg from '../assets/images/sample-report/restaurant.jpg';
import breakfastImg from '../assets/images/sample-report/breakfast.jpg';
import barImg from '../assets/images/sample-report/bar.jpg';
import poolImg from '../assets/images/sample-report/pool.jpg';
import spaImg from '../assets/images/sample-report/spa.jpg';
import { useLang } from '../i18n';

interface SampleAuditReportProps {
  onCommissionAudit: () => void;
  onRequestFreeDataPackage: () => void;
}

// Illustrative report for an archetype hotel. Figures live in the data below and
// are shared by both languages, so the overall score always matches the departments.

const HOTEL = 'The Historic City Hotel';
const REPORT_ID = 'CHA-OS-2026-0147';

type Tone = 'ok' | 'warn' | 'bad';
type Level = 'high' | 'medium' | 'low';

const DEPARTMENTS: { weight: number; score: number; icon: React.ElementType }[] = [
  { weight: 12, score: 76, icon: Building2 },
  { weight: 20, score: 72, icon: BedDouble },
  { weight: 15, score: 64, icon: ShowerHead },
  { weight: 15, score: 90, icon: Sparkles },
  { weight: 13, score: 88, icon: Coffee },
  { weight: 10, score: 93, icon: Camera },
  { weight: 10, score: 92, icon: Wrench },
  { weight: 5, score: 86, icon: ShieldCheck },
];

const OVERALL = Math.round(DEPARTMENTS.reduce((sum, d) => sum + d.weight * d.score, 0) / 100);

const WINGS: [number, number][] = [
  [58, 91],
  [52, 95],
  [84, 93],
  [88, 86],
];

const TIMELINE: { time: string; tone: Tone }[] = [
  { time: '15:03', tone: 'warn' },
  { time: '15:41', tone: 'warn' },
  { time: '19:30', tone: 'ok' },
  { time: '02:30', tone: 'bad' },
  { time: '05:45', tone: 'bad' },
  { time: '07:15', tone: 'bad' },
  { time: '07:40', tone: 'ok' },
  { time: '08:30', tone: 'ok' },
  { time: '11:00', tone: 'ok' },
];

// Indicative readings: probe thermometer (±0.5 °C) and a phone sound meter (±3 dB).
const SHOWER_214 = [18, 22, 27, 31, 34, 36, 37.5, 38, 38];
const SHOWER_508 = [24, 42, 43, 43, 43, 43, 43, 43, 43];
const NOISE: [string, number][] = [
  ['22:00', 34], ['23:00', 33], ['00:00', 31], ['01:00', 31], ['02:00', 33], ['02:30', 47],
  ['03:00', 45], ['04:00', 44], ['05:00', 36], ['05:45', 52], ['06:30', 40], ['07:00', 42],
];

const RISK_LEVELS: Level[] = ['high', 'high', 'medium', 'low'];

const TILES: { src?: string; icon?: React.ElementType; reading?: boolean; stamp: string; tone: Tone; className?: string }[] = [
  { src: queueImg, stamp: 'IMG_0116 · 15:09', tone: 'bad', className: 'sm:col-span-2' },
  { icon: Thermometer, reading: true, stamp: 'IMG_0207 · 07:19', tone: 'bad' },
  { src: luggageImg, stamp: 'IMG_0121 · 15:22', tone: 'warn' },
  { src: bedroomImg, stamp: 'IMG_0131 · 15:44', tone: 'warn', className: 'sm:col-span-2' },
  { src: restaurantImg, stamp: 'IMG_0174 · 19:34', tone: 'ok', className: 'sm:col-span-2' },
  { icon: Volume2, reading: true, stamp: 'REC_0012 · 02:31', tone: 'bad' },
  { src: breakfastImg, stamp: 'IMG_0229 · 08:22', tone: 'ok' },
  { src: buffetEmptyImg, stamp: 'IMG_0234 · 08:41', tone: 'warn' },
  { src: barImg, stamp: 'IMG_0188 · 21:10', tone: 'ok' },
  { src: bedImg, stamp: 'IMG_0133 · 15:46', tone: 'ok' },
  { icon: DoorOpen, stamp: 'IMG_0249 · 10:12', tone: 'warn' },
  { src: spaImg, stamp: 'IMG_0168 · 17:40', tone: 'ok' },
  { src: conciergeImg, stamp: 'IMG_0119 · 15:12', tone: 'warn', className: 'col-span-2 sm:col-span-1' },
  { src: poolImg, stamp: 'IMG_0162 · 17:05', tone: 'ok', className: 'col-span-2' },
];

// ---------- text (arrays line up with the data above) ----------

const TEXT = {
  en: {
    archetype: 'Historic 5-star city hotel, Cape Town City Bowl · 146 rooms in two wings',
    stay: 'Tue 14 – Wed 15 Oct 2026 · 1 night, 22 hours on property',
    inspector: 'Senior inspector, 14 years in European luxury hotel operations',
    delivered: 'Thu 16 Oct 2026, 10:00 (36 hours after check-out)',
    confidential: 'Confidential',
    slides: ['Summary', 'Scorecard', '24 hours', 'Evidence', 'Recommendations'],
    departments: [
      ['Arrival & front office', '12-min queue at a coach arrival, concierge unstaffed, luggage left 25 min; warm check-in once served'],
      ['Room & sleep comfort', 'Excellent bed; AC rattle and 05:45 street noise in the heritage wing'],
      ['Bathroom & hot water', 'Shower peaked at 38 °C during the 07:15 rush; spotless otherwise'],
      ['Housekeeping & cleanliness', 'No dust or hair at 14 hidden check-points; turndown on time'],
      ['Breakfast & dining', 'Fresh, local, attentive; hot buffet empty 11 min, eggs took 17 min'],
      ['Public areas, pool & spa', 'Immaculate lounge and terrace; pool towels restocked hourly'],
      ['Staff & service recovery', 'Shower complaint fixed with a room offer within 25 minutes'],
      ['Safety & security', 'Key cards checked at lifts; one fire door wedged open on floor 2'],
    ],
    timeline: [
      ['Arrival with a coach group', 'One receptionist and no concierge as 28 guests arrive. 12-min queue, no drink offered; group luggage left unattended for 25 min.'],
      ['Room 214, heritage wing', 'Handsome room, excellent mattress. Sash window does not seal; AC unit marked for service in May.'],
      ['Dinner, à la carte', 'Starter in 11 min, main in 24 min. Wine served at the right temperature. Waiter recommends local dishes in German.'],
      ['Night noise', 'AC rattles every 3–4 min, peaks of 47 dB at the pillow. Inspector wakes twice.'],
      ['Street cleaning', 'Municipal sweeper under the window for 9 min, 52 dB inside the room.'],
      ['Morning shower test', '4 min to warm up, peaks at 38 °C. Same test in garden-wing room 508: 42 °C after 40 seconds.'],
      ['Service recovery test', 'Inspector reports the shower. Duty manager calls back in 6 min, engineer arrives in 25 min, room move offered.'],
      ['Breakfast', 'Fresh breads, local fruit, good coffee. Hot buffet empty for 11 min; cooked eggs take 17 min.'],
      ['Check-out', 'Bill correct, 4 min. Concierge books a taxi and checks the flight time unprompted.'],
    ],
    risks: [
      ['Lukewarm morning showers', 'Heritage-wing rooms, 07:00–08:00', 'Typical German guest complaint; supports a price-reduction claim under package-travel rules'],
      ['Night noise (AC, street cleaning)', 'Heritage-wing rooms facing the street', 'Sleep complaints, poor reviews in the first night of the trip'],
      ['Queue on coach arrival', 'Groups arriving 14:30–16:00', 'Weak first impression after a long-haul flight'],
      ['Fire door wedged open', 'Floor 2', 'Safety finding; to be raised with the hotel in writing'],
    ],
    levels: { high: 'High', medium: 'Medium', low: 'Low' },
    recommendations: [
      ['Keep the contract, change the allocation', 'Write into the contract that your guests are allocated to the garden wing (floors 4–6). It scored 91 for sleep and 95 for the shower in our tests.'],
      ['Ask for two fixes by a date', 'Hot-water recirculation in the heritage wing and AC service in rooms 201–232, both before 1 December, ahead of the European peak season.'],
      ['Protect group arrivals', 'Send rooming lists 48 h ahead and ask for a second receptionist and welcome drinks for coaches arriving 14:30–16:00.'],
      ['Re-check in 90 days', 'A short unannounced re-visit confirms the fixes before your peak bookings arrive.'],
    ],
    tiles: [
      ['Coach arrival', '28 guests, one receptionist: 12-min queue'],
      ['Shower, room 214', 'Peak after 4 min; comfortable is 40–45 °C'],
      ['Group luggage', 'Left in the lobby, unattended for 25 min'],
      ['Room 214, heritage wing', 'Handsome and well kept; sash window does not seal'],
      ['Dinner', 'Attentive, recommends local dishes'],
      ['AC rattle, room 214', 'Every 3–4 min at the pillow'],
      ['Breakfast buffet', 'Fresh, local, well presented'],
      ['Hot buffet', 'Empty for 11 min; eggs took 17 min'],
      ['Bar', 'Cocktail served in 6 min'],
      ['Bed & linen', 'Crisp linen, excellent mattress'],
      ['Fire door, floor 2', 'Wedged open with a doorstop'],
      ['Spa', 'Quiet; treatment started on time'],
      ['Concierge', 'Desk unstaffed during the arrival rush'],
      ['Pool deck', 'Immaculate; towels restocked hourly'],
    ],
    readings: ['38.0 °C', '47 dB'],
    summary: {
      title: 'Executive summary',
      subtitle: 'On-site mystery audit · what your guests will experience',
      coverAlt: 'Restaurant of the audited hotel',
      score: 'Experience reality score',
      verdict: 'Verdict',
      verdictTitle: 'Keep contracting, with conditions',
      verdictText: 'A genuinely excellent hotel let down by its older wing. Allocate your guests to the garden wing and the risk largely disappears.',
      stay: 'Stay',
      inspector: 'Inspector',
      delivered: 'Delivered',
      why: 'Why we went',
      whyText: (
        <>
          The Virtual Audit counted <strong>23 recent complaints</strong> about lukewarm showers and noisy air conditioning,{' '}
          <strong>9 of them from German-speaking guests</strong>. You asked us to verify before signing the 2027 allocation of
          40 rooms a week.
        </>
      ),
      found: 'What we found',
      findings: [
        <>The complaints are <strong>real and specific to the heritage wing</strong>: shower peaked at 38 °C, AC peaks of 47 dB at night.</>,
        <>The <strong>garden wing is excellent</strong>: 42 °C water in 40 seconds, quiet at night, renovated in 2019.</>,
        <>Staff are the hotel’s strength: the shower complaint was <strong>resolved in 25 minutes</strong> with a room move.</>,
        <>Coach arrivals overwhelm the front desk: <strong>12-minute queue</strong> with one receptionist.</>,
      ],
      oneThing: 'The one thing to do',
      oneThingText: 'Add a garden-wing allocation clause before signing. It addresses the two issues behind most of the complaints.',
    },
    scorecard: {
      title: 'Department scorecard',
      subtitle: '8 departments, 112 check-points, weighted for what European guests notice',
      weight: 'weight',
      twoTitle: 'One hotel, two experiences',
      heritage: 'Heritage',
      garden: 'Garden',
      rows: ['Sleep comfort', 'Shower', 'Room condition', 'View & light'],
      twoNote: 'The overall score is held down by the heritage wing. Garden-wing rooms alone would score about 89.',
      howTitle: 'How to read the scores',
      high: '85+ meets what you sell',
      mid: '75–84 noticeable, manageable',
      low: 'below 75 likely to cause complaints',
    },
    timelineSlide: {
      title: '22 hours as your guest',
      subtitle: 'Every observation is dated and timed, so it can be checked later',
      ok: 'as expected',
      warn: 'below standard',
      bad: 'likely complaint',
      count: '41 timed observations in the full report',
    },
    evidence: {
      title: 'Evidence',
      subtitle: 'Photographs and measurements from the stay · 64 photos in the full appendix',
      shower: 'Shower temperature, first 4 minutes',
      showerBand: 'comfortable 40–45 °C',
      heritage: 'Heritage wing, room 214',
      garden: 'Garden wing, room 508',
      noise: 'Noise at the pillow overnight, room 214',
      noiseBand: 'quiet bedroom',
      peaks: 'Peaks: AC rattle from 02:30 (47 dB), street sweeper at 05:45 (52 dB).',
      disclaimer: 'Indicative readings: probe thermometer (±0.5 °C) and phone sound meter (±3 dB). We observe and record; we do not provide technical certification.',
    },
    recs: {
      title: 'Risk & recommendations',
      subtitle: 'What this means for your guests, and what to do about it',
      risk: 'Complaint risk for your guests',
      ours: 'Our recommendations',
      recordTitle: 'A factual record for your customer-care team',
      recordText: 'If a guest claims the pool was closed or the room was dirty, this report shows what we found, with dates, times and photographs. If a complaint matches our findings, you know it is genuine before you reply.',
      commission: 'Commission an audit for your hotel',
      free: 'Start with a free virtual audit',
    },
    viewer: {
      title: 'Sample On-Site Audit Report',
      intro: 'What your team receives within 48 hours of an unannounced stay. Five pages from a 22-page report.',
      note: `“${HOTEL}” is an archetype; findings are representative. Client reports are confidential and never published.`,
      pages: 'Report pages',
      previous: 'Previous',
      next: 'Next',
    },
  },
  de: {
    archetype: 'Historisches 5-Sterne-Stadthotel, Kapstadt City Bowl · 146 Zimmer in zwei Flügeln',
    stay: 'Di 14. – Mi 15. Okt. 2026 · 1 Nacht, 22 Stunden im Hotel',
    inspector: 'Senior-Inspektor, 14 Jahre in der europäischen Luxushotellerie',
    delivered: 'Do 16. Okt. 2026, 10:00 Uhr (36 Stunden nach der Abreise)',
    confidential: 'Vertraulich',
    slides: ['Zusammenfassung', 'Bewertung', '24 Stunden', 'Belege', 'Empfehlungen'],
    departments: [
      ['Ankunft & Rezeption', '12 Min. Warteschlange bei einer Busankunft, Concierge nicht besetzt, Gepäck 25 Min. unbeaufsichtigt; herzlicher Check-in, sobald man an der Reihe ist'],
      ['Zimmer & Schlafkomfort', 'Ausgezeichnetes Bett; Klappern der Klimaanlage und Straßenlärm um 05:45 im Altbauflügel'],
      ['Bad & Warmwasser', 'Dusche erreichte im Morgenandrang um 07:15 höchstens 38 °C; ansonsten makellos'],
      ['Housekeeping & Sauberkeit', 'Kein Staub und keine Haare an 14 versteckten Prüfpunkten; Abendservice pünktlich'],
      ['Frühstück & Restaurant', 'Frisch, regional, aufmerksam; warmes Buffet 11 Min. leer, Eierspeisen dauerten 17 Min.'],
      ['Öffentliche Bereiche, Pool & Spa', 'Makellose Lounge und Terrasse; Pooltücher stündlich aufgefüllt'],
      ['Personal & Beschwerdemanagement', 'Duschbeschwerde innerhalb von 25 Minuten mit einem Zimmerangebot gelöst'],
      ['Sicherheit', 'Schlüsselkarten an den Aufzügen geprüft; eine Brandschutztür im 2. Stock aufgekeilt'],
    ],
    timeline: [
      ['Ankunft mit einer Busgruppe', 'Eine Person an der Rezeption und kein Concierge, als 28 Gäste ankommen. 12 Min. Warteschlange, kein Getränk angeboten; Gruppengepäck 25 Min. unbeaufsichtigt.'],
      ['Zimmer 214, Altbauflügel', 'Schönes Zimmer, ausgezeichnete Matratze. Schiebefenster schließt nicht dicht; Klimaanlage seit Mai zur Wartung vorgemerkt.'],
      ['Abendessen à la carte', 'Vorspeise nach 11 Min., Hauptgang nach 24 Min. Wein richtig temperiert. Der Kellner empfiehlt lokale Gerichte auf Deutsch.'],
      ['Nachtlärm', 'Die Klimaanlage klappert alle 3–4 Min., Spitzen von 47 dB am Kopfkissen. Der Inspektor wacht zweimal auf.'],
      ['Straßenreinigung', 'Kehrmaschine 9 Min. unter dem Fenster, 52 dB im Zimmer.'],
      ['Duschtest am Morgen', '4 Min. bis das Wasser warm wird, höchstens 38 °C. Derselbe Test in Zimmer 508 im Gartenflügel: 42 °C nach 40 Sekunden.'],
      ['Test des Beschwerdemanagements', 'Der Inspektor meldet die Dusche. Der diensthabende Manager ruft nach 6 Min. zurück, ein Techniker kommt nach 25 Min., ein Zimmerwechsel wird angeboten.'],
      ['Frühstück', 'Frisches Brot, regionales Obst, guter Kaffee. Warmes Buffet 11 Min. leer; Eierspeisen dauern 17 Min.'],
      ['Abreise', 'Rechnung korrekt, 4 Min. Der Concierge bestellt ungefragt ein Taxi und prüft die Flugzeit.'],
    ],
    risks: [
      ['Lauwarme Duschen am Morgen', 'Zimmer im Altbauflügel, 07:00–08:00', 'Typische Beschwerde deutscher Gäste; kann eine Reisepreisminderung nach Pauschalreiserecht begründen'],
      ['Nachtlärm (Klimaanlage, Straßenreinigung)', 'Zimmer im Altbauflügel zur Straße', 'Beschwerden über den Schlaf, schlechte Bewertungen schon nach der ersten Nacht'],
      ['Warteschlange bei Busankunft', 'Gruppen mit Ankunft 14:30–16:00', 'Schwacher erster Eindruck nach einem Langstreckenflug'],
      ['Brandschutztür aufgekeilt', '2. Stock', 'Sicherheitsbefund; schriftlich beim Hotel anzusprechen'],
    ],
    levels: { high: 'Hoch', medium: 'Mittel', low: 'Niedrig' },
    recommendations: [
      ['Vertrag behalten, Zuteilung ändern', 'Legen Sie vertraglich fest, dass Ihre Gäste im Gartenflügel (4.–6. Etage) untergebracht werden. Dort erreichten Schlafkomfort 91 und Dusche 95 Punkte in unseren Tests.'],
      ['Zwei Mängelbehebungen mit Frist verlangen', 'Warmwasser-Zirkulation im Altbauflügel und Wartung der Klimaanlagen in den Zimmern 201–232, beides vor dem 1. Dezember und damit vor der europäischen Hauptsaison.'],
      ['Gruppenankünfte absichern', 'Rooming-Listen 48 Std. im Voraus senden und für Busse mit Ankunft 14:30–16:00 eine zweite Person an der Rezeption und Willkommensgetränke vereinbaren.'],
      ['Nachprüfung in 90 Tagen', 'Ein kurzer, unangekündigter Folgebesuch bestätigt die Mängelbehebung, bevor Ihre Gäste der Hauptsaison anreisen.'],
    ],
    tiles: [
      ['Busankunft', '28 Gäste, eine Person an der Rezeption: 12 Min. Warteschlange'],
      ['Dusche, Zimmer 214', 'Höchstwert nach 4 Min.; angenehm sind 40–45 °C'],
      ['Gruppengepäck', '25 Min. unbeaufsichtigt in der Lobby'],
      ['Zimmer 214, Altbauflügel', 'Schön und gepflegt; Schiebefenster schließt nicht dicht'],
      ['Abendessen', 'Aufmerksam, empfiehlt lokale Gerichte'],
      ['Klimaanlage, Zimmer 214', 'Klappert alle 3–4 Min. am Kopfkissen'],
      ['Frühstücksbuffet', 'Frisch, regional, schön präsentiert'],
      ['Warmes Buffet', '11 Min. leer; Eierspeisen dauerten 17 Min.'],
      ['Bar', 'Cocktail nach 6 Min. serviert'],
      ['Bett & Wäsche', 'Frische Wäsche, ausgezeichnete Matratze'],
      ['Brandschutztür, 2. Stock', 'Mit einem Türstopper aufgekeilt'],
      ['Spa', 'Ruhig; Behandlung begann pünktlich'],
      ['Concierge', 'Während des Ankunftsandrangs nicht besetzt'],
      ['Pooldeck', 'Makellos; Handtücher stündlich aufgefüllt'],
    ],
    readings: ['38,0 °C', '47 dB'],
    summary: {
      title: 'Zusammenfassung',
      subtitle: 'Mystery-Audit vor Ort · was Ihre Gäste erleben werden',
      coverAlt: 'Restaurant des geprüften Hotels',
      score: 'Realitätswert Gästeerlebnis',
      verdict: 'Fazit',
      verdictTitle: 'Weiter unter Vertrag nehmen – mit Auflagen',
      verdictText: 'Ein wirklich ausgezeichnetes Hotel, das von seinem älteren Flügel ausgebremst wird. Bringen Sie Ihre Gäste im Gartenflügel unter, und das Risiko verschwindet weitgehend.',
      stay: 'Aufenthalt',
      inspector: 'Inspektor',
      delivered: 'Geliefert',
      why: 'Anlass der Prüfung',
      whyText: (
        <>
          Das Virtuelle Audit zählte <strong>23 aktuelle Beschwerden</strong> über lauwarme Duschen und laute Klimaanlagen,{' '}
          <strong>9 davon von deutschsprachigen Gästen</strong>. Sie baten uns um eine Prüfung vor der Unterzeichnung des
          Kontingents 2027 mit 40 Zimmern pro Woche.
        </>
      ),
      found: 'Was wir festgestellt haben',
      findings: [
        <>Die Beschwerden sind <strong>berechtigt und betreffen den Altbauflügel</strong>: Dusche höchstens 38 °C, Klimaanlage nachts mit Spitzen von 47 dB.</>,
        <>Der <strong>Gartenflügel ist ausgezeichnet</strong>: 42 °C warmes Wasser nach 40 Sekunden, nachts ruhig, 2019 renoviert.</>,
        <>Das Personal ist die Stärke des Hotels: Die Duschbeschwerde wurde <strong>in 25 Minuten gelöst</strong>, mit Zimmerwechsel.</>,
        <>Busankünfte überfordern die Rezeption: <strong>12 Minuten Warteschlange</strong> bei nur einer Person am Empfang.</>,
      ],
      oneThing: 'Das Wichtigste',
      oneThingText: 'Vereinbaren Sie vor der Unterzeichnung eine Zuteilungsklausel für den Gartenflügel. Sie beseitigt die beiden Ursachen der meisten Beschwerden.',
    },
    scorecard: {
      title: 'Bewertung nach Bereichen',
      subtitle: '8 Bereiche, 112 Prüfpunkte, gewichtet nach dem, was europäischen Gästen auffällt',
      weight: 'Gewichtung',
      twoTitle: 'Ein Hotel, zwei Erlebnisse',
      heritage: 'Altbau',
      garden: 'Garten',
      rows: ['Schlafkomfort', 'Dusche', 'Zimmerzustand', 'Aussicht & Licht'],
      twoNote: 'Der Gesamtwert wird vom Altbauflügel nach unten gezogen. Zimmer im Gartenflügel allein kämen auf etwa 89.',
      howTitle: 'So lesen Sie die Werte',
      high: '85+ entspricht dem, was Sie verkaufen',
      mid: '75–84 spürbar, beherrschbar',
      low: 'unter 75 wahrscheinlich Beschwerden',
    },
    timelineSlide: {
      title: '22 Stunden als Ihr Gast',
      subtitle: 'Jede Beobachtung ist mit Datum und Uhrzeit erfasst und damit später überprüfbar',
      ok: 'wie erwartet',
      warn: 'unter Standard',
      bad: 'wahrscheinliche Beschwerde',
      count: '41 zeitlich erfasste Beobachtungen im vollständigen Bericht',
    },
    evidence: {
      title: 'Belege',
      subtitle: 'Fotos und Messwerte vom Aufenthalt · 64 Fotos im vollständigen Anhang',
      shower: 'Duschtemperatur, erste 4 Minuten',
      showerBand: 'angenehm 40–45 °C',
      heritage: 'Altbauflügel, Zimmer 214',
      garden: 'Gartenflügel, Zimmer 508',
      noise: 'Geräuschpegel am Kopfkissen in der Nacht, Zimmer 214',
      noiseBand: 'ruhiges Schlafzimmer',
      peaks: 'Spitzen: Klimaanlage ab 02:30 (47 dB), Kehrmaschine um 05:45 (52 dB).',
      disclaimer: 'Richtwerte: Einstichthermometer (±0,5 °C) und Schallpegel-App (±3 dB). Wir beobachten und dokumentieren; wir erteilen keine technischen Zertifizierungen.',
    },
    recs: {
      title: 'Risiken & Empfehlungen',
      subtitle: 'Was das für Ihre Gäste bedeutet und was zu tun ist',
      risk: 'Beschwerderisiko für Ihre Gäste',
      ours: 'Unsere Empfehlungen',
      recordTitle: 'Sachliche Dokumentation für Ihren Kundenservice',
      recordText: 'Behauptet ein Gast, der Pool sei geschlossen oder das Zimmer schmutzig gewesen, zeigt dieser Bericht, was wir vorgefunden haben – mit Datum, Uhrzeit und Fotos. Deckt sich eine Beschwerde mit unseren Befunden, wissen Sie vor Ihrer Antwort, dass sie berechtigt ist.',
      commission: 'Audit für Ihr Hotel beauftragen',
      free: 'Mit einem kostenlosen Virtuellen Audit beginnen',
    },
    viewer: {
      title: 'Beispielbericht: Mystery-Audit vor Ort',
      intro: 'Das erhält Ihr Team innerhalb von 48 Stunden nach einem unangekündigten Aufenthalt. Fünf Seiten aus einem 22-seitigen Bericht.',
      note: `„${HOTEL}“ ist ein Musterhotel; die Befunde sind repräsentativ. Kundenberichte sind vertraulich und werden nie veröffentlicht.`,
      pages: 'Berichtsseiten',
      previous: 'Zurück',
      next: 'Weiter',
    },
  },
};

type Text = (typeof TEXT)['en'];
const useText = (): Text => TEXT[useLang().lang];

const toneStyles: Record<Tone, string> = {
  ok: 'bg-emerald-500',
  warn: 'bg-amber-500',
  bad: 'bg-rose-500',
};

const scoreColor = (s: number) => (s >= 85 ? 'bg-emerald-500' : s >= 75 ? 'bg-amber-400' : 'bg-rose-500');
const scoreText = (s: number) => (s >= 85 ? 'text-emerald-700' : s >= 75 ? 'text-amber-700' : 'text-rose-700');

// ---------- small building blocks ----------

const SlideHeader: React.FC<{ index: number; title: string; subtitle: string }> = ({ index, title, subtitle }) => {
  const t = useText();
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-4 mb-5 border-b border-zinc-200">
      <div>
        <div className="font-mono text-[10px] tracking-widest uppercase text-[#9c753e] font-bold">
          {String(index + 1).padStart(2, '0')} / {String(t.slides.length).padStart(2, '0')} · {HOTEL}
        </div>
        <h3 className="mt-1 text-xl sm:text-2xl font-bold text-[#10213a]">{title}</h3>
        <p className="mt-1 text-xs sm:text-sm text-zinc-500">{subtitle}</p>
      </div>
      <div className="font-mono text-[10px] text-zinc-400 shrink-0">{REPORT_ID} · {t.confidential}</div>
    </div>
  );
};

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

const SummarySlide: React.FC = () => {
  const t = useText();
  const s = t.summary;
  const findingColors = ['text-rose-600', 'text-emerald-600', 'text-emerald-600', 'text-amber-600'];
  return (
    <>
      <SlideHeader index={0} title={s.title} subtitle={s.subtitle} />

      <div className="relative mb-5 h-36 sm:h-44 rounded-xl overflow-hidden">
        <img src={restaurantImg} alt={s.coverAlt} className="absolute inset-0 w-full h-full object-cover object-[50%_30%]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#10213a]/90 via-[#10213a]/50 to-transparent" />
        <div className="relative h-full flex flex-col justify-end p-4 sm:p-5 text-white max-w-md">
          <div className="text-lg sm:text-xl font-semibold">{HOTEL}</div>
          <div className="text-[11px] sm:text-xs text-zinc-200">{t.archetype}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2 rounded-xl bg-[#10213a] text-white p-5 flex flex-col">
          <div className="font-mono text-[10px] tracking-widest uppercase text-[#d9bd8b]">{s.score}</div>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-6xl font-light leading-none">{OVERALL}</span>
            <span className="text-zinc-400 mb-1">/ 100</span>
          </div>
          <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full bg-[#d9bd8b]" style={{ width: `${OVERALL}%` }} />
          </div>
          <div className="mt-5 rounded-lg bg-white/5 border border-white/10 p-3">
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">{s.verdict}</div>
            <div className="mt-1 text-base font-semibold text-white">{s.verdictTitle}</div>
            <p className="mt-1 text-xs text-zinc-300 leading-relaxed">{s.verdictText}</p>
          </div>
          <dl className="mt-5 space-y-2 text-[11px] text-zinc-300">
            <div><dt className="inline text-zinc-500">{s.stay}: </dt><dd className="inline">{t.stay}</dd></div>
            <div><dt className="inline text-zinc-500">{s.inspector}: </dt><dd className="inline">{t.inspector}</dd></div>
            <div><dt className="inline text-zinc-500">{s.delivered}: </dt><dd className="inline">{t.delivered}</dd></div>
          </dl>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
            <div className="text-[10px] font-mono uppercase tracking-wider text-amber-800 font-bold">{s.why}</div>
            <p className="mt-1 text-sm text-amber-950 leading-relaxed">{s.whyText}</p>
          </div>

          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold mb-2">{s.found}</div>
            <ul className="space-y-2.5">
              {s.findings.map((text, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-700 leading-relaxed">
                  <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${findingColors[i]}`} />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-zinc-200 p-4">
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold">{s.oneThing}</div>
            <p className="mt-1 text-sm text-[#10213a] font-semibold leading-relaxed">{s.oneThingText}</p>
          </div>
        </div>
      </div>
    </>
  );
};

const ScorecardSlide: React.FC = () => {
  const t = useText();
  const s = t.scorecard;
  return (
    <>
      <SlideHeader index={1} title={s.title} subtitle={s.subtitle} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-3">
          {DEPARTMENTS.map((d, i) => {
            const [name, note] = t.departments[i];
            return (
              <div key={i} className="grid grid-cols-[1.25rem_1fr_auto] items-start gap-x-3">
                <d.icon className="w-4 h-4 mt-0.5 text-[#b38a54]" />
                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm font-semibold text-[#10213a]">{name}</span>
                    <span className="text-[10px] font-mono text-zinc-400">{s.weight} {d.weight}%</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-zinc-100 overflow-hidden">
                    <div className={`h-full ${scoreColor(d.score)}`} style={{ width: `${d.score}%` }} />
                  </div>
                  <p className="mt-1 text-[11px] text-zinc-500 leading-snug">{note}</p>
                </div>
                <span className={`text-lg font-semibold tabular-nums ${scoreText(d.score)}`}>{d.score}</span>
              </div>
            );
          })}
        </div>

        <div className="space-y-4">
          <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-4">
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold">{s.twoTitle}</div>
            <table className="mt-3 w-full text-xs">
              <thead>
                <tr className="text-zinc-500">
                  <th className="text-left font-normal pb-1.5"></th>
                  <th className="text-right font-normal pb-1.5">{s.heritage}<br />214</th>
                  <th className="text-right font-normal pb-1.5">{s.garden}<br />508</th>
                </tr>
              </thead>
              <tbody className="text-zinc-700">
                {WINGS.map(([a, b], i) => (
                  <tr key={i} className="border-t border-zinc-200">
                    <td className="py-1.5">{s.rows[i]}</td>
                    <td className={`py-1.5 text-right font-semibold tabular-nums ${scoreText(a)}`}>{a}</td>
                    <td className={`py-1.5 text-right font-semibold tabular-nums ${scoreText(b)}`}>{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-[11px] text-zinc-500 leading-snug">{s.twoNote}</p>
          </div>

          <div className="rounded-xl border border-zinc-200 p-4">
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold">{s.howTitle}</div>
            <ul className="mt-2 space-y-1.5 text-[11px] text-zinc-600">
              <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> {s.high}</li>
              <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> {s.mid}</li>
              <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> {s.low}</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

const TimelineSlide: React.FC = () => {
  const t = useText();
  const s = t.timelineSlide;
  return (
    <>
      <SlideHeader index={2} title={s.title} subtitle={s.subtitle} />

      <ol className="relative grid grid-cols-1 md:grid-cols-3 gap-3">
        {TIMELINE.map((item, i) => {
          const [title, text] = t.timeline[i];
          return (
            <li key={item.time} className="rounded-xl border border-zinc-200 p-3.5 bg-white">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${toneStyles[item.tone]}`} />
                <span className="font-mono text-xs font-bold text-[#10213a]">{item.time}</span>
                <span className="text-xs font-semibold text-zinc-800">{title}</span>
              </div>
              <p className="mt-1.5 text-[11px] text-zinc-600 leading-relaxed">{text}</p>
            </li>
          );
        })}
      </ol>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[11px] text-zinc-500">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> {s.ok}</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> {s.warn}</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500" /> {s.bad}</span>
        <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {s.count}</span>
      </div>
    </>
  );
};

// A photo, or for a problem without a photo, the measured reading itself.
const PhotoTile: React.FC<{ src?: string; reading?: string; label: string; stamp: string; icon?: React.ElementType; finding: string; className?: string; tone: Tone }> = ({
  src,
  reading,
  label,
  stamp,
  icon: Icon,
  finding,
  className = '',
  tone,
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

const EvidenceSlide: React.FC = () => {
  const t = useText();
  const s = t.evidence;
  let readingIndex = 0;
  return (
    <>
      <SlideHeader index={3} title={s.title} subtitle={s.subtitle} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Collage: photos for what we saw, measured readings for the problems */}
        <div className="grid grid-cols-2 sm:grid-cols-3 auto-rows-[150px] sm:auto-rows-[120px] gap-1.5">
          {TILES.map((tile, i) => {
            const [label, finding] = t.tiles[i];
            return (
              <PhotoTile
                key={tile.stamp}
                src={tile.src}
                icon={tile.icon}
                reading={tile.reading ? t.readings[readingIndex++] : undefined}
                label={label}
                finding={finding}
                stamp={tile.stamp}
                tone={tile.tone}
                className={tile.className}
              />
            );
          })}
        </div>

        {/* Measurements */}
        <div className="space-y-4">
          <div className="rounded-xl border border-zinc-200 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#10213a] flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-[#b38a54]" /> {s.shower}
              </span>
              <span className="text-[10px] font-mono text-zinc-400">07:15</span>
            </div>
            <LineChart
              min={15}
              max={45}
              unit="°"
              labels={['0:00', '0:30', '1:00', '1:30', '2:00', '2:30', '3:00', '3:30', '4:00']}
              band={[40, 45, s.showerBand]}
              series={[
                { values: SHOWER_214, color: '#e11d48', label: 'Heritage 214' },
                { values: SHOWER_508, color: '#10b981', label: 'Garden 508' },
              ]}
            />
            <div className="flex gap-4 text-[10px] text-zinc-500">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-rose-600" /> {s.heritage}</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-emerald-500" /> {s.garden}</span>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#10213a] flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-[#b38a54]" /> {s.noise}
              </span>
              <span className="text-[10px] font-mono text-zinc-400">dB(A)</span>
            </div>
            <LineChart
              min={25}
              max={55}
              unit=""
              labels={NOISE.map(([time]) => time)}
              band={[25, 35, s.noiseBand]}
              series={[{ values: NOISE.map(([, v]) => v), color: '#10213a', label: 'Room 214' }]}
            />
            <p className="text-[10px] text-zinc-500 leading-snug">{s.peaks}</p>
          </div>

          <p className="text-[10px] text-zinc-400 leading-snug">{s.disclaimer}</p>
        </div>
      </div>
    </>
  );
};

const levelStyles: Record<Level, { icon: string; badge: string }> = {
  high: { icon: 'text-rose-600', badge: 'bg-rose-100 text-rose-700' },
  medium: { icon: 'text-amber-600', badge: 'bg-amber-100 text-amber-800' },
  low: { icon: 'text-zinc-400', badge: 'bg-zinc-100 text-zinc-600' },
};

const RecommendationsSlide: React.FC<SampleAuditReportProps> = ({ onCommissionAudit, onRequestFreeDataPackage }) => {
  const t = useText();
  const s = t.recs;
  return (
    <>
      <SlideHeader index={4} title={s.title} subtitle={s.subtitle} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold mb-2">{s.risk}</div>
          <div className="space-y-2">
            {t.risks.map(([issue, who, impact], i) => {
              const level = RISK_LEVELS[i];
              return (
                <div key={i} className="rounded-xl border border-zinc-200 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-[#10213a] flex items-center gap-1.5">
                      <AlertTriangle className={`w-3.5 h-3.5 shrink-0 ${levelStyles[level].icon}`} />
                      {issue}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${levelStyles[level].badge}`}>
                      {t.levels[level]}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-zinc-500">{who}</p>
                  <p className="mt-0.5 text-[11px] text-zinc-700 leading-snug">{impact}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold mb-2">{s.ours}</div>
            <ol className="space-y-2.5">
              {t.recommendations.map(([title, text], i) => (
                <li key={i} className="flex gap-3">
                  <span className="w-6 h-6 shrink-0 rounded-full bg-[#10213a] text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  <div>
                    <div className="text-sm font-semibold text-[#10213a]">{title}</div>
                    <p className="text-[11px] text-zinc-600 leading-relaxed">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-xl bg-[#10213a] text-white p-4">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-[#d9bd8b]">
              <FileCheck2 className="w-3.5 h-3.5" /> {s.recordTitle}
            </div>
            <p className="mt-1.5 text-xs text-zinc-300 leading-relaxed">{s.recordText}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={onCommissionAudit}
              className="flex-1 px-5 py-3 rounded-full bg-[#b38a54] hover:bg-[#9c753e] text-white text-sm font-semibold transition-colors"
            >
              {s.commission}
            </button>
            <button
              onClick={onRequestFreeDataPackage}
              className="flex-1 px-5 py-3 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 text-sm font-semibold transition-colors"
            >
              {s.free}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// ---------- viewer ----------

export const SampleAuditReport: React.FC<SampleAuditReportProps> = (props) => {
  const t = useText();
  const v = t.viewer;
  const [slide, setSlide] = useState(0);
  const last = t.slides.length - 1;
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
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-800">{v.title}</h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-600 leading-relaxed">{v.intro}</p>
          <p className="mt-3 inline-flex items-center gap-2 text-[11px] text-zinc-500">
            <Lock className="w-3.5 h-3.5 text-[#b38a54] shrink-0" />
            {v.note}
          </p>
        </div>

        {/* Slide tabs */}
        <nav className="mt-8 flex flex-wrap justify-center gap-1.5" aria-label={v.pages}>
          {t.slides.map((name, i) => (
            <button
              key={i}
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
              <ArrowLeft className="w-3.5 h-3.5" /> {v.previous}
            </button>
            <div className="flex gap-1.5">
              {t.slides.map((_, i) => (
                <span key={i} className={`h-1.5 rounded-full transition-all ${slide === i ? 'w-6 bg-[#b38a54]' : 'w-1.5 bg-zinc-300'}`} />
              ))}
            </div>
            <button
              onClick={() => go(slide + 1)}
              disabled={slide === last}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900 disabled:opacity-30"
            >
              {v.next} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

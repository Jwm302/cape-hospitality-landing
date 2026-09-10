import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldCheck,
  Scale,
  CheckCircle2,
  TrendingDown,
  FileWarning,
  Eye,
  Sliders,
  HelpCircle,
  ArrowUpRight,
} from 'lucide-react';
import { VALUE_PROPOSITION_CONTENT } from '../data/landingData';

export const ValueProposition: React.FC = () => {
  const [passengerVolume, setPassengerVolume] = useState<number>(250);
  const [averageTourPrice, setAverageTourPrice] = useState<number>(8500);

  // Calculated exposure under European Package Travel Directive / Frankfurter Tabelle
  const estimatedAnnualTurnover = passengerVolume * averageTourPrice;
  const potentialClaimExposure = Math.round(estimatedAnnualTurnover * 0.085); // typical 8.5% dispute risk on unmonitored luxury tours
  const resolvedWithCha = Math.round(potentialClaimExposure * 0.94); // 94% prevented or contractually recovered

  return (
    <section id="risk-mitigation" className="py-24 bg-white border-t border-zinc-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Eyebrow */}
        <div className="flex flex-col items-start mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-200 bg-zinc-50 text-xs font-semibold text-zinc-700 shadow-xs mb-4">
            <Scale className="w-3.5 h-3.5 text-[#a07c48]" />
            <span className="tracking-widest uppercase font-mono text-[11px]">The Value Proposition</span>
          </div>

          {/* Section Title: Risk Mitigation for Global Tour Operators */}
          <h2
            id="value-prop-title"
            className="font-sans text-3xl sm:text-5xl font-extrabold text-[#162544] tracking-tight leading-[1.15] max-w-3xl"
          >
            {VALUE_PROPOSITION_CONTENT.sectionTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Context & Verbatim Copy */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Body Text: German holidaymakers expect precision... */}
            <div className="p-6 sm:p-7 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
              <p className="text-base sm:text-lg text-zinc-800 font-semibold leading-relaxed">
                "{VALUE_PROPOSITION_CONTENT.bodyText}"
              </p>
              <p className="text-xs sm:text-sm text-zinc-600 font-normal leading-relaxed pt-3 border-t border-zinc-200">
                When European travelers invest €8,000 to €25,000 per person in Cape luxury boutique hotels, wine estates, and coastal retreats from Cape Town to the Garden Route, standards cannot fluctuate. Remote property management often hides deferred maintenance, kitchen shortcuts, and staff turnover until customer complaints trigger legal claims back home in Germany, Switzerland, or the UK.
              </p>
            </div>

            {/* Key Risk Dimensions in Bento Style */}
            <div className="space-y-3">
              {VALUE_PROPOSITION_CONTENT.keyRisksAddressed.map((risk, idx) => (
                <div
                  key={idx}
                  className="group p-5 rounded-2xl bg-white border border-zinc-200 hover:border-zinc-300 hover:shadow-xs transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-[#162544] group-hover:text-[#a07c48] transition-colors flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#b89764]" />
                      {risk.title}
                    </h3>
                    <span className="text-[10px] uppercase font-mono font-semibold px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200">
                      {risk.tag}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 leading-relaxed pl-3.5">
                    {risk.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Interactive Risk & Exposure Simulator */}
          <div className="lg:col-span-6 space-y-5 text-left">
            <div className="rounded-3xl bg-[#fafafa] border border-zinc-200 p-6 sm:p-8 shadow-lg shadow-zinc-200/60 relative">
              {/* Header */}
              <div className="flex items-center justify-between pb-5 border-b border-zinc-200">
                <div>
                  <span className="text-[11px] font-mono tracking-widest text-[#a07c48] uppercase font-bold">
                    EUROPEAN OPERATOR COMPLIANCE MODEL
                  </span>
                  <h3 className="font-sans text-base sm:text-lg font-bold text-[#162544] mt-0.5">
                    Frankfurter Tabelle Liability & Shield
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-[#a07c48] shadow-xs">
                  <Eye className="w-4 h-4" />
                </div>
              </div>

              {/* Side-by-side exposure contrast */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                {/* Red Card: Unmonitored */}
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-rose-700 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Unmonitored Portfolio</span>
                  </div>
                  <p className="text-zinc-600 text-[11px] leading-relaxed">
                    Air conditioning failure, noisy generator, or substandard game drive vehicles lead to statutory 15–35% refunds under European consumer regulations.
                  </p>
                </div>

                {/* Emerald Card: CHA Inspected */}
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Cape Hospitality Shield</span>
                  </div>
                  <p className="text-zinc-600 text-[11px] leading-relaxed">
                    420-point pre-season & mid-season unannounced inspections discover and rectify anomalies before high-value guests arrive.
                  </p>
                </div>
              </div>

              {/* Interactive Tour Operator Liability Calculator */}
              <div className="mt-6 pt-5 border-t border-zinc-200 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#162544] flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-[#a07c48]" />
                    Interactive Portfolio Risk Exposure Calculator
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 font-semibold">Live Simulation</span>
                </div>

                {/* Slider 1: Annual Guests to Western Cape */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-zinc-700">
                    <span>Annual High-End Guests to Western Cape (Cape Town & Garden Route):</span>
                    <span className="font-mono font-bold text-[#162544]">{passengerVolume} guests</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="1000"
                    step="25"
                    value={passengerVolume}
                    onChange={(e) => setPassengerVolume(Number(e.target.value))}
                    className="w-full accent-[#162544] bg-zinc-200 h-2 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Slider 2: Average Tour Value */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-zinc-700">
                    <span>Average Package Value per Guest:</span>
                    <span className="font-mono font-bold text-[#162544]">€{averageTourPrice.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="3000"
                    max="20000"
                    step="500"
                    value={averageTourPrice}
                    onChange={(e) => setAverageTourPrice(Number(e.target.value))}
                    className="w-full accent-[#162544] bg-zinc-200 h-2 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Calculated Result Box */}
                <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-xs flex items-center justify-between">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-mono font-semibold">
                      Estimated Annual Dispute Risk
                    </div>
                    <div className="text-xl font-mono font-extrabold text-rose-600 mt-0.5">
                      €{potentialClaimExposure.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-zinc-400">Potential refund drag & legal overhead</div>
                  </div>

                  <div className="text-right">
                    <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-mono font-semibold">
                      Safeguarded by CHA
                    </div>
                    <div className="text-xl font-mono font-extrabold text-emerald-600 mt-0.5">
                      €{resolvedWithCha.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-emerald-700 font-semibold">94% Claim reduction rate</div>
                  </div>
                </div>
              </div>

              {/* Bottom Quote Banner */}
              <div className="mt-5 pt-3 border-t border-zinc-200 flex items-center justify-between text-[11px] text-zinc-500">
                <span>International Benchmark:</span>
                <span className="font-mono text-[#a07c48] font-bold">
                  Leading Quality Assurance (LQA) Standard Equivalent
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

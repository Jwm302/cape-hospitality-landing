import React from 'react';
import { BrainCircuit, AlertTriangle, ShieldCheck, CheckCircle2, TrendingDown, Database, Scale, ShieldAlert, Cpu, Activity } from 'lucide-react';
import { DATA_SCIENCE_CONTENT } from '../data/landingData';

export const DataScienceSection: React.FC = () => {
  return (
    <section id="data-science" className="py-20 sm:py-24 bg-[#f8fafc] border-t border-zinc-200/80 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 shadow-xs mb-4">
          <BrainCircuit className="w-3.5 h-3.5 text-[#b38a54]" />
          <span className="tracking-wider uppercase font-mono text-[11px]">Western Cape Regional Pilot Audit (Cape Town & Garden Route Portfolio)</span>
        </div>

        {/* Section Heading */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#10213a] tracking-tight">
          {DATA_SCIENCE_CONTENT.headline}
        </h2>
        <p className="mt-3 text-sm sm:text-base text-zinc-600 max-w-2xl mx-auto leading-relaxed">
          Real-world case study metrics cross-referencing public guest sentiment with our unannounced on-site mystery inspections.
        </p>

        {/* 1. HERO STATISTICAL BLURB */}
        <div className="mt-8 max-w-4xl mx-auto p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-white via-amber-50/20 to-white border border-amber-200/80 shadow-sm text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-amber-100/40 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 relative z-10">
            {/* Prominent Stat Badge */}
            <div className="shrink-0 flex sm:flex-col items-center justify-center w-auto sm:w-32 py-2 sm:py-3 px-4 sm:px-3 rounded-xl bg-[#10213a] text-white shadow-sm border border-zinc-800">
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#b38a54]">10%</span>
              <span className="ml-2 sm:ml-0 text-[10px] uppercase font-mono font-semibold tracking-wider text-zinc-300 text-center">
                Risk Discrepancy
              </span>
            </div>

            {/* Blurb Body */}
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 tracking-wide uppercase font-mono">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>The Hero Metric (10% Risk Discrepancy)</span>
              </div>
              <p
                className="text-base sm:text-lg font-bold text-[#10213a] leading-snug"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                “{DATA_SCIENCE_CONTENT.heroStatisticalBlurb}”
              </p>
            </div>
          </div>
        </div>

        {/* 2. REAL ANONYMISED B2B AUDIT BENCHMARKING TABLE */}
        <div className="mt-10 max-w-4xl mx-auto text-left">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            {/* Table Header / Context bar */}
            <div className="px-6 py-4 bg-zinc-50 border-b border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[#b38a54]" />
                <h3 className="text-sm font-bold text-[#10213a]">
                  Anonymised B2B Audit Benchmarking Table
                </h3>
              </div>
              <span className="inline-flex items-center text-[11px] font-mono text-zinc-500 bg-white px-2.5 py-1 rounded-md border border-zinc-200">
                Western Cape Regional Pilot Audit (Cape Town & Garden Route Portfolio)
              </span>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-100/70 text-zinc-700 font-semibold">
                    <th className="py-3.5 px-4 sm:px-6 w-5/12">Anonymer Asset-Code</th>
                    <th className="py-3.5 px-4 text-center whitespace-nowrap w-2/12">Plattform-Rating</th>
                    <th className="py-3.5 px-4 text-center whitespace-nowrap w-2.5/12">Audit Hygiene-Index</th>
                    <th className="py-3.5 px-4 text-center whitespace-nowrap w-2.5/12">Audit Sicherheits-Index</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {DATA_SCIENCE_CONTENT.benchmarkTable.map((row) => {
                    const isCritical = row.hygieneStatus === 'critical' || row.safetyStatus === 'critical';
                    const isSuboptimal = row.hygieneStatus === 'suboptimal' || row.safetyStatus === 'suboptimal';

                    const renderBadge = (indexText: string, status: string) => {
                      if (status === 'critical') {
                        return (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-300 text-rose-900 font-bold text-xs">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                            <span>{indexText}</span>
                          </span>
                        );
                      }
                      if (status === 'suboptimal') {
                        return (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 font-bold text-xs">
                            <TrendingDown className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                            <span>{indexText}</span>
                          </span>
                        );
                      }
                      return (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-900 font-semibold text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span>{indexText}</span>
                        </span>
                      );
                    };

                    return (
                      <tr
                        key={row.assetCode}
                        className={`transition-colors ${
                          isCritical
                            ? 'hover:bg-rose-50/30'
                            : isSuboptimal
                            ? 'hover:bg-amber-50/30'
                            : 'hover:bg-emerald-50/20'
                        }`}
                      >
                        <td className="py-4 px-4 sm:px-6">
                          <div className="font-bold text-[#10213a] text-sm sm:text-base">
                            {row.assetCode}
                          </div>
                          <div className="text-xs text-zinc-500 font-normal mt-0.5">
                            ({row.descriptor})
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-zinc-100 border border-zinc-200 font-mono text-xs font-semibold text-zinc-800">
                            {row.platformRating}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center whitespace-nowrap">
                          {renderBadge(row.hygieneIndex, row.hygieneStatus)}
                        </td>
                        <td className="py-4 px-4 text-center whitespace-nowrap">
                          {renderBadge(row.safetyIndex, row.safetyStatus)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Clinical Analyst Verdict */}
            <div className="p-5 sm:p-7 bg-zinc-50/95 border-t border-zinc-200 text-left">
              <div className="flex items-center justify-between mb-3.5 flex-wrap gap-2">
                <div className="inline-flex items-center gap-2">
                  <Scale className="w-4 h-4 text-[#b38a54]" />
                  <span className="text-xs font-bold text-[#10213a] uppercase tracking-wider font-mono">
                    ANALYST VERDICT • CORPORATE LIABILITY ANALYSIS
                  </span>
                </div>
                <span className="inline-flex items-center text-[10px] uppercase font-mono font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
                  Veranstalterhaftung Risk
                </span>
              </div>
              
              <div className="space-y-3 text-xs sm:text-sm text-zinc-700 leading-relaxed font-normal">
                <p>
                  Traditional Booking.com scoring structures create a dangerous corporate blind spot. Relying on aggregate metrics (like an 8.2/10 rating) masks critical operational decay.
                </p>
                <p>
                  Our pilot study demonstrates that <strong className="font-semibold text-zinc-900">a collective 10% of text reviews nested inside these highly rated profiles</strong> contain hidden, unmanaged safety and hygiene hazards. Standard filters blindside procurement teams to these contract defects—leaving a <strong className="font-semibold text-zinc-900">collective 10% compliance data blind spot</strong> hidden in your premium assets that directly exposes your organization to severe liability under German travel law (<em className="font-semibold text-rose-900">Veranstalterhaftung</em>).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. ENGINE PERFORMANCE & OPERATIONS INSIGHTS DASHBOARD */}
        <div className="mt-8 max-w-4xl mx-auto text-left">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="inline-flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#b38a54]" />
              <h3 className="text-xs font-bold text-[#10213a] uppercase tracking-wider font-mono">
                {DATA_SCIENCE_CONTENT.enginePerformanceInsights.sectionTitle}
              </h3>
            </div>
            <span className="inline-flex items-center text-[10px] uppercase font-mono font-semibold px-2.5 py-1 rounded-md bg-white border border-zinc-200 text-zinc-500">
              Western Cape Regional Pipeline Telemetry (Cape Town & Garden Route)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Column 1: RISK SEVERITY TRIAGE (Die Triage-Matrix) */}
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-5 sm:p-6 flex flex-col justify-between hover:border-zinc-300 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-mono font-bold text-rose-900 bg-rose-50 px-2.5 py-1 rounded border border-rose-200 uppercase tracking-wider">
                    RISK SEVERITY TRIAGE
                  </span>
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                </div>
                <div className="text-[11px] font-mono font-medium text-zinc-400 mb-1">
                  (Die Triage-Matrix)
                </div>
                <h4 className="text-sm sm:text-base font-bold text-[#10213a] leading-snug mb-3">
                  Automated Risk Level Classification
                </h4>

                {/* Display Metric */}
                <div className="py-3 px-3.5 rounded-xl bg-zinc-50 border border-zinc-100 mb-4">
                  <div className="text-2xl sm:text-3xl font-black text-[#10213a] font-mono tracking-tight">
                    20.0%
                  </div>
                  <div className="text-[11px] font-mono font-semibold text-rose-800 uppercase tracking-wider mt-0.5">
                    Level 3 Liability
                  </div>
                </div>
              </div>

              <p className="text-xs text-zinc-600 leading-relaxed font-normal pt-3 border-t border-zinc-100">
                Our algorithm reads text profiles and triages anomalies into operational lenses. Across our active portfolio data, 20% of flagged text blocks represent critical Level 3 Legal Liabilities (Haftungsrisiko), while 60% expose Level 2 Contractual Defects (Mängel)—allowing compliance teams to triage risks instantly.
              </p>
            </div>

            {/* Column 2: WORKLOAD OPTIMIZATION (The Hybrid Trigger) */}
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-5 sm:p-6 flex flex-col justify-between hover:border-zinc-300 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-mono font-bold text-[#10213a] bg-zinc-100 px-2.5 py-1 rounded border border-zinc-200 uppercase tracking-wider">
                    WORKLOAD OPTIMIZATION
                  </span>
                  <Cpu className="w-4 h-4 text-[#10213a] shrink-0" />
                </div>
                <div className="text-[11px] font-mono font-medium text-zinc-400 mb-1">
                  (The Hybrid Trigger)
                </div>
                <h4 className="text-sm sm:text-base font-bold text-[#10213a] leading-snug mb-3">
                  Efficiency-Driven Resource Allocation
                </h4>

                {/* Display Metric */}
                <div className="py-3 px-3.5 rounded-xl bg-zinc-50 border border-zinc-100 mb-4">
                  <div className="text-2xl sm:text-3xl font-black text-[#10213a] font-mono tracking-tight">
                    95.5%
                  </div>
                  <div className="text-[11px] font-mono font-semibold text-zinc-700 uppercase tracking-wider mt-0.5">
                    Noise Reduction
                  </div>
                </div>
              </div>

              <p className="text-xs text-zinc-600 leading-relaxed font-normal pt-3 border-t border-zinc-100">
                <span className="block font-medium text-zinc-800 mb-2">
                  Our deterministic filtering layer automatically reduces manual quality management audit overhead by 95.5%.
                </span>
                By evaluating incoming text arrays locally, the system completely filters out conversational noise and generic praise. Only 2.0% of portfolio reviews contain critical anomalies that trigger our advanced AI semantic processing, automatically routing targeted, high-priority deployment orders to our physical on-site field inspectors. This transforms human auditing from a blind corporate expense into a precision risk-mitigation tool.
              </p>
            </div>

            {/* Column 3: TEMPORAL COMPLIANCE DRIFT (Frühwarnsystem) */}
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-5 sm:p-6 flex flex-col justify-between hover:border-zinc-300 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-mono font-bold text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 uppercase tracking-wider">
                    TEMPORAL DRIFT
                  </span>
                  <Activity className="w-4 h-4 text-emerald-700 shrink-0" />
                </div>
                <div className="text-[11px] font-mono font-medium text-zinc-400 mb-1">
                  (Frühwarnsystem)
                </div>
                <h4 className="text-sm sm:text-base font-bold text-[#10213a] leading-snug mb-3">
                  Predictive Performance Drift Vector
                </h4>

                {/* Display Metric */}
                <div className="py-3 px-3.5 rounded-xl bg-zinc-50 border border-zinc-100 mb-4">
                  <div className="text-2xl sm:text-3xl font-black text-emerald-800 font-mono tracking-tight">
                    +12.0
                  </div>
                  <div className="text-[11px] font-mono font-semibold text-emerald-700 uppercase tracking-wider mt-0.5">
                    Performance Drift
                  </div>
                </div>
              </div>

              <p className="text-xs text-zinc-600 leading-relaxed font-normal pt-3 border-t border-zinc-100">
                Our temporal engine separates long-term data baselines from ultra-recent feedback windows. While our comparative benchmarking table captures the macro-historical average of 88% for the Premium Maritime Waterfront Asset, this module isolates a +12.0 performance correction vector based strictly on the latest rolling window of recent reviews—capturing a real-time shift to 100% compliance well before traditional platform ratings register a change.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import {
  FileText,
  Clock,
  Camera,
  CheckCircle2,
  AlertCircle,
  Lock,
  Download,
  Eye,
  EyeOff,
  BarChart3,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { DELIVERABLE_CONTENT } from '../data/landingData';
import reportImage from '../assets/images/audit_report_preview_1788963233970.jpg';

interface DeliverableReportProps {
  onRequestSampleReport: () => void;
}

export const DeliverableReport: React.FC<DeliverableReportProps> = ({
  onRequestSampleReport,
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'breakdown' | 'gaps'>('preview');
  const [isRedactedBlur, setIsRedactedBlur] = useState(true);

  return (
    <section id="deliverable" className="py-24 bg-white border-t border-zinc-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Description & Value Delivery */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-200 bg-zinc-50 text-xs font-semibold text-zinc-700 shadow-xs">
              <FileText className="w-3.5 h-3.5 text-[#a07c48]" />
              <span className="tracking-widest uppercase font-mono text-[11px]">The Deliverable</span>
            </div>

            {/* Section Title: Data-Driven, Actionable Intelligence */}
            <h2
              id="deliverable-title"
              className="font-sans text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#162544] tracking-tight leading-[1.12]"
            >
              {DELIVERABLE_CONTENT.sectionTitle}
            </h2>

            {/* Verbatim Draft Body Text */}
            <p
              id="deliverable-body"
              className="text-base sm:text-lg text-zinc-600 font-normal leading-relaxed"
            >
              {DELIVERABLE_CONTENT.bodyText}
            </p>

            {/* Feature Highlights Bento List */}
            <div className="pt-2 space-y-3">
              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-zinc-50 border border-zinc-200 hover:border-zinc-300 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#162544] uppercase tracking-wide">
                    Strict 48-Hour Turnaround
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                    Preliminary alert within 12 hours for critical life-safety issues; complete calibrated executive report in under 48 hours.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-zinc-50 border border-zinc-200 hover:border-zinc-300 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#162544] uppercase tracking-wide">
                    Photographic Proof & Timestamped Logs
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                    Every shortfall is cross-referenced with geotagged photography, exact timecodes, and location mapping.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-zinc-50 border border-zinc-200 hover:border-zinc-300 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[#b89764]/20 text-[#a07c48] flex items-center justify-center shrink-0 mt-0.5">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#162544] uppercase tracking-wide">
                    Ready-to-Implement Hotel Action Plan
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                    Clear training recommendations and manager SOP corrective guidelines formatted to share directly with GM leadership.
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Trigger */}
            <div className="pt-2">
              <button
                onClick={onRequestSampleReport}
                className="inline-flex items-center gap-2 text-xs font-bold px-7 py-3.5 rounded-full bg-[#162544] text-white hover:bg-[#1f3460] transition-all duration-200 shadow-md shadow-zinc-300/80 cursor-pointer active:scale-[0.98]"
                id="deliverable-sample-cta"
              >
                <span>Request Sample Audit Report</span>
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              </button>
            </div>
          </div>

          {/* Right Column: Visual Asset: Placeholder box for blurred corporate PDF report / data chart */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-white border border-zinc-200 shadow-xl shadow-zinc-200/70 overflow-hidden relative text-left">
              {/* Header bar of simulated viewer */}
              <div className="bg-zinc-50 px-5 py-3.5 border-b border-zinc-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-[11px] font-mono text-zinc-600 font-medium ml-1">
                    CHA_AUDIT_DOSSIER_CONFIDENTIAL.PDF
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-mono font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    48h SLA Certified
                  </span>
                  <button
                    onClick={() => setIsRedactedBlur(!isRedactedBlur)}
                    className="text-[11px] flex items-center gap-1 text-zinc-700 hover:text-zinc-950 px-2.5 py-1 rounded-lg bg-white border border-zinc-200 hover:bg-zinc-100 transition-colors cursor-pointer font-medium"
                    title={isRedactedBlur ? "Unblur report preview" : "Blur report preview"}
                  >
                    {isRedactedBlur ? <Eye className="w-3 h-3 text-[#a07c48]" /> : <EyeOff className="w-3 h-3" />}
                    <span>{isRedactedBlur ? "Preview Unblur" : "Re-blur"}</span>
                  </button>
                </div>
              </div>

              {/* Sub-tabs to view different aspects of deliverable */}
              <div className="flex border-b border-zinc-200 bg-zinc-100/70 text-xs px-2">
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`px-4 py-2.5 transition-all cursor-pointer ${
                    activeTab === 'preview'
                      ? 'border-b-2 border-[#162544] text-[#162544] font-bold bg-white'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  Visual PDF Asset
                </button>
                <button
                  onClick={() => setActiveTab('breakdown')}
                  className={`px-4 py-2.5 transition-all cursor-pointer ${
                    activeTab === 'breakdown'
                      ? 'border-b-2 border-[#162544] text-[#162544] font-bold bg-white'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  Score Index ({DELIVERABLE_CONTENT.sampleInspection.overallScore}%)
                </button>
                <button
                  onClick={() => setActiveTab('gaps')}
                  className={`px-4 py-2.5 transition-all cursor-pointer ${
                    activeTab === 'gaps'
                      ? 'border-b-2 border-[#162544] text-[#162544] font-bold bg-white'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  Actionable Gaps & Fixes (3)
                </button>
              </div>

              {/* Tab 1: Visual Asset: Placeholder box for blurred image of corporate PDF report/data chart */}
              {activeTab === 'preview' && (
                <div className="p-4 sm:p-6 bg-zinc-50/50 relative">
                  {/* The visual asset box required by draft */}
                  <div
                    id="deliverable-pdf-placeholder"
                    className="relative rounded-xl overflow-hidden border border-zinc-200 shadow-sm group"
                  >
                    {/* Image with blur toggle */}
                    <img
                      src={reportImage}
                      alt="Blurred corporate PDF report and data chart"
                      referrerPolicy="no-referrer"
                      className={`w-full h-80 sm:h-96 object-cover object-top transition-all duration-300 ${
                        isRedactedBlur ? 'filter blur-[5px] scale-[1.02]' : 'filter blur-0 scale-100'
                      }`}
                    />

                    {/* Redacted & Confidential Stamp Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 via-transparent to-zinc-900/30 pointer-events-none" />

                    {/* Prominent Stamp Label */}
                    <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-col gap-1 pointer-events-none">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-mono font-bold tracking-widest uppercase shadow-lg">
                        <Lock className="w-3.5 h-3.5 text-white" />
                        <span>CONFIDENTIAL • TRAVEL COMPANY EMBARGO</span>
                      </div>
                      <span className="text-[10px] text-white font-mono bg-black/60 px-2.5 py-0.5 rounded-full w-fit">
                        PROPERTY: [REDACTED 5-STAR CAPE COASTAL RETREAT]
                      </span>
                    </div>

                    {/* Floating stats card on the document */}
                    <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                      <div>
                        <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-mono font-semibold">
                          Comprehensive Checklist Metrics
                        </div>
                        <div className="font-sans text-base sm:text-lg font-extrabold text-[#162544]">
                          420 Points Audited • Overall Compliance: 91.4%
                        </div>
                      </div>
                      <button
                        onClick={onRequestSampleReport}
                        className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold rounded-full bg-[#162544] text-white hover:bg-[#1f3460] transition-colors shrink-0 cursor-pointer shadow-sm"
                      >
                        Request Unredacted Sample
                      </button>
                    </div>
                  </div>

                  <p className="mt-3 text-center text-[11px] text-zinc-500 font-medium">
                    Placeholder preview of client deliverable: 36-page interactive compliance dossier with executive scorecard.
                  </p>
                </div>
              )}

              {/* Tab 2: Quantitative Score Breakdown */}
              {activeTab === 'breakdown' && (
                <div className="p-6 bg-white space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                    <div>
                      <h4 className="font-sans text-base font-bold text-[#162544]">
                        Sample Benchmark Index vs Industry Target
                      </h4>
                      <p className="text-xs text-zinc-500">
                        Weighted scoring based on high-net-worth European travel company expectations
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-mono font-extrabold text-[#162544]">91.4%</span>
                      <div className="text-[10px] text-zinc-400 uppercase font-mono font-semibold">Composite Score</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {DELIVERABLE_CONTENT.sampleInspection.pillarsScores.map((p, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-zinc-700">{p.name}</span>
                          <span className="font-mono text-[#a07c48]">
                            {p.score}% <span className="text-zinc-400 text-[10px] font-normal">(Benchmark: {p.benchmark}%)</span>
                          </span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-zinc-100 overflow-hidden border border-zinc-200/60">
                          <div
                            className={`h-full rounded-full transition-all ${
                              p.score >= p.benchmark ? 'bg-[#b89764]' : 'bg-amber-500'
                            }`}
                            style={{ width: `${p.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 text-xs text-zinc-500 flex items-center justify-between border-t border-zinc-100 font-medium">
                    <span>Standard Turnaround: 48 Hours</span>
                    <span className="text-[#a07c48] font-mono font-bold">Format: PDF + Secure Online Portal</span>
                  </div>
                </div>
              )}

              {/* Tab 3: Actionable Gaps & Recommendations */}
              {activeTab === 'gaps' && (
                <div className="p-6 bg-white space-y-4">
                  <h4 className="font-sans text-base font-bold text-[#162544]">
                    Service Gap Resolution Protocol (Sample Findings)
                  </h4>
                  <div className="space-y-3">
                    {DELIVERABLE_CONTENT.sampleInspection.sampleGaps.map((gap, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#162544]">{gap.category}</span>
                          <span
                            className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              gap.severity === 'High'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : gap.severity === 'Medium'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-zinc-200 text-zinc-700'
                            }`}
                          >
                            {gap.severity} Priority
                          </span>
                        </div>
                        <p className="text-zinc-700 leading-relaxed">
                          <strong className="text-rose-700 font-semibold">Finding:</strong> {gap.finding}
                        </p>
                        <p className="text-zinc-600 leading-relaxed">
                          <strong className="text-[#a07c48] font-semibold">Remedy:</strong> {gap.remedy}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

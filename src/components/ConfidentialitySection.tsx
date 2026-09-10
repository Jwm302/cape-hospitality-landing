import React from 'react';
import { Lock, UserCheck, ShieldAlert, FileCheck2, EyeOff, KeyRound, ShieldCheck } from 'lucide-react';
import { CONFIDENTIALITY_CONTENT } from '../data/landingData';

export const ConfidentialitySection: React.FC = () => {
  return (
    <section id="confidentiality" className="py-24 bg-[#f8fafc] border-t border-zinc-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 shadow-xs mb-4">
            <Lock className="w-3.5 h-3.5 text-[#a07c48]" />
            <span className="tracking-widest uppercase font-mono text-[11px]">The Confidentiality Guarantee</span>
          </div>

          {/* Section Title: 100% Discrete Operations */}
          <h2
            id="confidentiality-title"
            className="font-sans text-3xl sm:text-5xl font-extrabold text-[#162544] tracking-tight leading-tight"
          >
            {CONFIDENTIALITY_CONTENT.sectionTitle}
          </h2>

          {/* Body Text: Anonymity is our core asset... */}
          <p
            id="confidentiality-body"
            className="mt-4 text-base sm:text-lg text-zinc-600 font-normal leading-relaxed max-w-2xl mx-auto"
          >
            {CONFIDENTIALITY_CONTENT.bodyText}
          </p>
        </div>

        {/* 4 Protocol Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {CONFIDENTIALITY_CONTENT.protocols.map((item, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-7 rounded-2xl bg-white border border-zinc-200 hover:border-zinc-300 transition-all duration-300 group flex flex-col justify-between shadow-xs hover:shadow-md"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center text-[#a07c48] mb-5 group-hover:scale-105 transition-transform shadow-xs">
                  {idx === 0 && <UserCheck className="w-5 h-5 text-emerald-600" />}
                  {idx === 1 && <EyeOff className="w-5 h-5 text-indigo-600" />}
                  {idx === 2 && <ShieldAlert className="w-5 h-5 text-[#a07c48]" />}
                  {idx === 3 && <KeyRound className="w-5 h-5 text-purple-600" />}
                </div>

                <h3 className="font-sans text-base font-bold text-[#162544] mb-2 tracking-tight">
                  {item.title}
                </h3>

                <p className="text-xs text-zinc-600 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-semibold">
                <span>Protocol 0{idx + 1}</span>
                <span className="text-emerald-700 font-bold">Strict NDA</span>
              </div>
            </div>
          ))}
        </div>

        {/* Security and Ethics Callout */}
        <div className="mt-12 p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs max-w-3xl mx-auto flex items-center gap-4 text-left">
          <div className="w-10 h-10 rounded-xl bg-[#b89764]/15 border border-[#b89764]/30 flex items-center justify-center shrink-0 text-[#a07c48]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-xs text-zinc-600 leading-relaxed">
            <span className="font-bold text-[#162544]">Legally Binding Non-Disclosure Agreement:</span> All inspection mandates operate under strict non-disclosure protocols executed under South African, English, or German jurisdiction before inspector deployment.
          </div>
        </div>
      </div>
    </section>
  );
};

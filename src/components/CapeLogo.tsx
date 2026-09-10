import React, { useState, useEffect, useRef } from 'react';
import { Upload, Check, Image as ImageIcon, Sparkles, Download, RotateCcw } from 'lucide-react';
import {
  initLogoStore,
  getLogoState,
  subscribeLogo,
  saveLogoImage,
  setLogoMode,
  setLogoSpelling,
  clearLogoImage,
} from '../lib/logoStore';

interface CapeLogoProps {
  variant?: 'navbar' | 'full' | 'prominent' | 'mark-only';
  className?: string;
  showTagline?: boolean;
  subtitle?: string;
}

export const CapeLogo: React.FC<CapeLogoProps> = ({
  variant = 'navbar',
  className = '',
  showTagline = true,
  subtitle = 'HOSPITALITY ADVISORS',
}) => {
  const NAVY = '#0c2340';
  const GOLD = '#b48c58';
  const GOLD_LIGHT = '#ddc38f';
  const GOLD_MID = '#caa66e';
  const BRONZE = '#9e7b46';

  const [logoState, setLogoState] = useState(getLogoState());
  const [isDragging, setIsDragging] = useState(false);
  const [showOriginalComparison, setShowOriginalComparison] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    initLogoStore();
    const unsubscribe = subscribeLogo(() => {
      setLogoState(getLogoState());
    });
    return unsubscribe;
  }, []);

  const openFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await saveLogoImage(file);
      } catch (err) {
        console.error('Failed to load logo image:', err);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      try {
        await saveLogoImage(file);
      } catch (err) {
        console.error('Failed to drop logo image:', err);
      }
    }
  };

  const handleDownloadPatched = () => {
    const targetUrl = logoState.patchedImage || logoState.image;
    if (!targetUrl) return;
    const a = document.createElement('a');
    a.href = targetUrl;
    a.download = `cape-hospitality-${logoState.spelling.toLowerCase()}-logo.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Vector Emblem strictly matching the uploaded Cape Hospitality drawing
  const renderEmblem = (emblemClass = 'w-full h-auto') => (
    <svg
      viewBox="0 0 940 250"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={emblemClass}
    >
      <defs>
        <linearGradient id="facetGoldLight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={GOLD_LIGHT} />
          <stop offset="100%" stopColor={GOLD_MID} />
        </linearGradient>
        <linearGradient id="facetGoldMid" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={GOLD_MID} />
          <stop offset="100%" stopColor={BRONZE} />
        </linearGradient>
      </defs>

      {/* ========================================== */}
      {/* 1. MOUNTAIN RIDGELINE & TABLE MOUNTAIN     */}
      {/* ========================================== */}

      {/* Devil's Peak (Western Peak - Behind Towers) */}
      <polygon points="315,170 345,140 372,110 382,135 352,185 315,185" fill={NAVY} />
      <polygon points="372,110 410,135 392,168 358,142" fill="url(#facetGoldLight)" />
      <polygon points="372,110 425,116 452,156 410,135" fill="url(#facetGoldMid)" />

      {/* Curved bronze shadow sweep contour */}
      <path
        d="M 392 168 Q 445 188 525 190 L 515 198 Q 438 194 380 176 Z"
        fill={BRONZE}
      />

      {/* Table Mountain Plateau: Truly Flat Horizontal Navy Summit Line */}
      <line
        x1="425"
        y1="116"
        x2="665"
        y2="116"
        stroke={NAVY}
        strokeWidth="5.5"
        strokeLinecap="round"
      />

      {/* Vertical couloir shadow clefts */}
      <polygon points="455,116 458,144 463,134 467,148 471,116" fill={NAVY} />
      <polygon points="490,116 493,138 498,130 503,142 507,116" fill={NAVY} />
      <polygon points="530,116 534,146 540,132 546,150 551,116" fill={NAVY} />
      <polygon points="575,116 580,168 587,144 595,172 602,116" fill={NAVY} />
      <polygon points="622,116 626,144 631,132 636,148 641,116" fill={NAVY} />

      {/* Eastern Cliff Face */}
      <polygon
        points="665,116 680,145 698,168 715,178 705,166 688,142 675,146 668,126"
        fill={NAVY}
      />

      {/* Eastern Ridgeline: Saddle, Lion's Head peak, Signal Hill */}
      <path
        d="M 705 166 Q 728 182 748 168 L 778 136 Q 788 126 795 136 L 815 168 Q 842 158 868 166 Q 898 184 925 210"
        stroke={NAVY}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Lion's Head Horn Peak */}
      <polygon points="748,168 778,136 795,136 782,160" fill={NAVY} />
      <polygon points="748,168 778,136 768,156" fill={GOLD_MID} />

      {/* ========================================== */}
      {/* 2. MODERN CITY TOWERS (Left Foreground)    */}
      {/* ========================================== */}
      <polygon points="156,215 156,165 172,148 172,215" fill={GOLD_MID} />
      <polygon points="178,215 178,144 196,124 196,215" fill={GOLD_MID} />
      <polygon points="202,215 202,112 222,92 222,215" fill={NAVY} />
      <polygon points="228,215 228,82 242,82 242,215" fill={GOLD_MID} />
      <polygon points="264,215 264,102 278,102 278,215" fill={GOLD_MID} />
      <polygon points="228,82 242,56 278,102 264,102 242,75 228,82" fill={GOLD_MID} />
      <polygon points="246,215 246,120 260,120 260,215" fill={GOLD_MID} />
      <polygon points="284,215 284,152 302,140 302,215" fill={GOLD_MID} />
      <polygon points="308,215 308,166 324,156 324,215" fill={BRONZE} />

      {/* ========================================== */}
      {/* 3. SILHOUETTED PALM TREE                   */}
      {/* ========================================== */}
      <ellipse cx="140" cy="216" rx="8" ry="2" fill={NAVY} />
      <path d="M 137 216 Q 140 178 143 148 L 147 148 Q 143 178 141 216 Z" fill={NAVY} />
      <path d="M 145 148 C 126 142, 106 152, 102 165 C 112 156, 128 152, 145 148 Z" fill={NAVY} />
      <path d="M 145 148 C 124 130, 112 136, 106 146 C 116 138, 130 138, 145 148 Z" fill={NAVY} />
      <path d="M 145 148 C 135 122, 140 114, 144 110 C 147 120, 147 134, 145 148 Z" fill={NAVY} />
      <path d="M 145 148 C 154 128, 166 132, 172 142 C 162 139, 153 141, 145 148 Z" fill={NAVY} />
      <path d="M 145 148 C 158 150, 170 158, 174 168 C 164 162, 155 158, 145 148 Z" fill={NAVY} />

      {/* ========================================== */}
      {/* 4. WATERLINE & GOLDEN BEACH COVE           */}
      {/* ========================================== */}
      <line x1="70" y1="216" x2="925" y2="216" stroke={NAVY} strokeWidth="3" />
      <line x1="240" y1="218" x2="925" y2="218" stroke={GOLD} strokeWidth="1.2" />
      <path
        d="M 640 217 C 698 238, 790 248, 925 248 C 815 235, 725 225, 640 217 Z"
        fill={GOLD_MID}
      />
      <path
        d="M 685 230 C 740 244, 810 249, 910 249 C 825 241, 760 234, 685 230 Z"
        fill={GOLD}
        opacity="0.8"
      />
      <path
        d="M 690 224 C 740 232, 795 236, 860 234"
        stroke={NAVY}
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 720 231 C 765 237, 810 239, 855 238"
        stroke={NAVY}
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );

  const isShowingUploaded = logoState.mode === 'uploaded' && Boolean(logoState.image);
  const activeDisplayImage = showOriginalComparison ? logoState.rawImage : (logoState.patchedImage || logoState.image);

  // Variant: Prominent (The primary hero logo card)
  if (variant === 'prominent') {
    return (
      <div className={`flex flex-col items-center justify-center text-center ${className}`}>
        {/* Hidden File Input for uploading original picture */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          id="original-logo-upload-input"
        />

        {/* Crisp White Card Container with Drag and Drop */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative w-full max-w-xl mx-auto bg-white rounded-2xl p-6 sm:p-9 shadow-sm border transition-all ${
            isDragging ? 'border-[#b48c58] ring-4 ring-[#b48c58]/20 bg-amber-50/10' : 'border-zinc-200/90'
          } flex flex-col items-center`}
        >
          {/* Top Control Toolbar */}
          <div className="w-full flex flex-wrap items-center justify-between gap-2 mb-5 px-1 pb-3 border-b border-zinc-100 text-xs">
            {/* Mode Switcher Tabs */}
            <div className="flex items-center bg-zinc-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setLogoMode('uploaded')}
                className={`px-3 py-1 rounded-md font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                  isShowingUploaded
                    ? 'bg-white text-[#0c2340] shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-[#b48c58]" />
                Original File
                {logoState.image && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block ml-0.5" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setLogoMode('vector')}
                className={`px-3 py-1 rounded-md font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                  !isShowingUploaded
                    ? 'bg-white text-[#0c2340] shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#b48c58]" />
                Vector Logo
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Spelling Switcher: ADVISORS vs ADVISERS */}
              {isShowingUploaded && (
                <div className="flex items-center bg-zinc-100 p-0.5 rounded-md text-[11px] font-semibold text-zinc-600">
                  <button
                    type="button"
                    onClick={() => setLogoSpelling('ADVISORS')}
                    className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                      logoState.spelling === 'ADVISORS'
                        ? 'bg-[#0c2340] text-white shadow-2xs'
                        : 'hover:text-zinc-900'
                    }`}
                    title="Spell with 'O': ADVISORS"
                  >
                    ADVISORS
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogoSpelling('ADVISERS')}
                    className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                      logoState.spelling === 'ADVISERS'
                        ? 'bg-[#0c2340] text-white shadow-2xs'
                        : 'hover:text-zinc-900'
                    }`}
                    title="Spell with 'E': ADVISERS"
                  >
                    ADVISERS
                  </button>
                </div>
              )}

              {isShowingUploaded && (
                <button
                  type="button"
                  onClick={handleDownloadPatched}
                  className="px-2.5 py-1.5 rounded-md font-medium text-xs bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors flex items-center gap-1 cursor-pointer"
                  title="Download the updated logo file"
                >
                  <Download className="w-3 h-3 text-[#b48c58]" />
                  <span className="hidden sm:inline">Download</span>
                </button>
              )}

              <button
                type="button"
                onClick={openFilePicker}
                className="px-3 py-1.5 rounded-md font-semibold text-xs bg-[#0c2340] hover:bg-[#162f52] text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                title="Select or drop your original image file"
              >
                <Upload className="w-3.5 h-3.5 text-[#b48c58]" />
                {logoState.image ? 'Change File' : 'Use Original File'}
              </button>
            </div>
          </div>

          {/* EITHER: Render user's original uploaded image */}
          {isShowingUploaded && activeDisplayImage ? (
            <div className="w-full flex flex-col items-center animate-in fade-in duration-200">
              <div className="relative w-full max-w-lg overflow-hidden rounded-xl bg-white p-2">
                {/* The patched original image with ADVISORS replacing AUDITORS directly in the artwork */}
                <img
                  src={activeDisplayImage}
                  alt="Cape Hospitality Advisers Original Logo"
                  className="w-full h-auto object-contain max-h-[400px] mx-auto select-none"
                />
              </div>

              {/* Status and Tools Bar */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 w-full max-w-md px-2 text-[11px] text-zinc-500 border-t border-zinc-100 pt-2.5">
                <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  Original file active with {logoState.spelling} replacing AUDITORS
                </span>

                <div className="flex items-center gap-2.5 text-zinc-400">
                  {logoState.rawImage && (
                    <button
                      type="button"
                      onClick={() => setShowOriginalComparison(!showOriginalComparison)}
                      className="hover:text-zinc-700 underline cursor-pointer flex items-center gap-1"
                      title="Compare with untouched original file"
                    >
                      <RotateCcw className="w-2.5 h-2.5" />
                      {showOriginalComparison ? 'Show Replaced' : 'View Untouched'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={clearLogoImage}
                    className="hover:text-rose-600 underline cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* OR: Render precision vector artwork */
            <div className="w-full flex flex-col items-center animate-in fade-in duration-200">
              {/* Emblem Graphic */}
              <div className="w-full max-w-lg px-2 sm:px-4">
                {renderEmblem()}
              </div>

              {/* Typography Lockup */}
              <div className="w-full flex flex-col items-center justify-center mt-6 sm:mt-8">
                <h1
                  className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-[0.28em] -mr-[0.28em] select-none leading-none"
                  style={{
                    fontFamily: "'Cinzel', 'Trajan Pro', 'Times New Roman', serif",
                    color: NAVY,
                  }}
                >
                  CAPE
                </h1>

                <div
                  className="text-xs sm:text-sm md:text-base font-semibold tracking-[0.32em] -mr-[0.32em] uppercase select-none mt-3 sm:mt-4"
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    color: GOLD,
                  }}
                >
                  {subtitle}
                </div>

                {showTagline && (
                  <>
                    <div className="w-full max-w-md mx-auto flex items-center justify-center gap-3 sm:gap-4 mt-4 sm:mt-5 px-4">
                      <div className="h-[1.5px] w-8 sm:w-16 bg-[#b48c58]" />
                      <span
                        className="text-[9px] sm:text-[11px] font-semibold tracking-[0.18em] -mr-[0.18em] uppercase whitespace-nowrap select-none"
                        style={{
                          fontFamily: "'Montserrat', sans-serif",
                          color: NAVY,
                        }}
                      >
                        INDEPENDENT STANDARDS. HIGHER PERFORMANCE.
                      </span>
                      <div className="h-[1.5px] w-8 sm:w-16 bg-[#b48c58]" />
                    </div>

                    <div
                      className="text-[8px] sm:text-[10px] font-semibold tracking-[0.24em] -mr-[0.24em] uppercase select-none mt-2 sm:mt-2.5"
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        color: NAVY,
                      }}
                    >
                      <span>CAPE TOWN</span>
                      <span className="text-[#b48c58] mx-2 font-normal">|</span>
                      <span>SOUTH AFRICA</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Variant: Full (Used in footer or secondary sections)
  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center justify-center text-center ${className}`}>
        {isShowingUploaded && activeDisplayImage ? (
          <img
            src={activeDisplayImage}
            alt="Cape Hospitality Advisers"
            className="w-full max-w-xs h-auto object-contain mx-auto"
          />
        ) : (
          <>
            <div className="w-full max-w-sm px-2">{renderEmblem()}</div>
            <div className="mt-4 flex flex-col items-center">
              <div
                className="text-2xl sm:text-3xl font-bold tracking-[0.26em] -mr-[0.26em]"
                style={{
                  fontFamily: "'Cinzel', 'Trajan Pro', serif",
                  color: NAVY,
                }}
              >
                CAPE
              </div>
              <div
                className="text-[10px] sm:text-xs font-semibold tracking-[0.26em] -mr-[0.26em] uppercase mt-1"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  color: GOLD,
                }}
              >
                {subtitle}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Variant: Mark-Only (Graphic emblem alone without wordmark)
  if (variant === 'mark-only') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        {isShowingUploaded && activeDisplayImage ? (
          <img
            src={activeDisplayImage}
            alt="Emblem"
            className="w-full h-full object-contain"
          />
        ) : (
          renderEmblem()
        )}
      </div>
    );
  }

  // Default: Navbar compact lockup
  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 text-left ${className}`}>
      {/* Compact emblem */}
      <div className="w-14 sm:w-16 shrink-0 flex items-center justify-center">
        {isShowingUploaded && activeDisplayImage ? (
          <img
            src={activeDisplayImage}
            alt="Logo"
            className="w-12 h-8 object-contain"
          />
        ) : (
          renderEmblem()
        )}
      </div>

      <div className="flex flex-col justify-center">
        <div className="flex items-baseline gap-1.5 leading-none">
          <span
            className="text-base sm:text-lg font-bold tracking-[0.24em]"
            style={{
              fontFamily: "'Cinzel', 'Trajan Pro', serif",
              color: NAVY,
            }}
          >
            CAPE
          </span>
          <span
            className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              color: GOLD,
            }}
          >
            {logoState.spelling}
          </span>
        </div>
        <div
          className="text-[8px] tracking-[0.18em] uppercase text-zinc-500 font-medium mt-0.5 hidden sm:block"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          Cape Town &bull; South Africa
        </div>
      </div>
    </div>
  );
};

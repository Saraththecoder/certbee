import { ArrowRight, Award, Layers, Sparkles } from 'lucide-react';
import { useState } from 'react';
import botanicalBackdrop from '../assets/images/botanical_shadow_slate_1794682854352.jpg';
import wideBackdrop from '../assets/images/wide_botanical_backdrop_1794682854967.jpg';
import { useBatchWorkspace } from '../hooks/useBatchWorkspace';
import { CertBeeMark } from './CertBeeLogo';

export function Hero() {
  const { startEmptyBatch, navigate } = useBatchWorkspace();
  const [imgErrLeft, setImgErrLeft] = useState(false);
  const [imgErrRight, setImgErrRight] = useState(false);


  return (
    <section className="relative overflow-hidden px-4 pt-8 pb-10 sm:px-8 sm:pt-14 sm:pb-16">
      <div className="mx-auto max-w-4xl flex flex-col items-center text-center">
        {/* Handwritten-style micro label */}
        <p
          data-hero-stagger
          className="font-serif-editorial italic text-xs sm:text-sm text-[#141414] underline decoration-[#141414]/40 underline-offset-4"
        >
          bulk certificate studio
        </p>

        {/* Framed Centerpiece with Tilted Sticky-Note Tags */}
        <div className="relative mt-5 inline-flex flex-col items-center">
          {/* Desktop Top-Left Sticky Tag */}
          <span
            data-hero-note
            className="hidden md:inline-block absolute -left-32 -top-7 -rotate-3 rounded-sm border border-[#141414] bg-[#C8EFE0] px-2.5 py-1 font-mono-tabular text-[10px] font-semibold tracking-wider text-[#141414] shadow-[2px_2px_0_#141414]"
          >
            ONE TEMPLATE
          </span>

          {/* Desktop Top-Right Sticky Tag */}
          <span
            data-hero-note
            className="hidden md:inline-block absolute -right-36 -top-6 rotate-2 rounded-sm border border-[#141414] bg-[#F6EBB8] px-2.5 py-1 font-mono-tabular text-[10px] font-semibold tracking-wider text-[#141414] shadow-[2px_2px_0_#141414]"
          >
            ZERO SERVER UPLOAD
          </span>

          {/* Framed CERTBEE Title Box */}
          <div
            data-hero-stagger
            className="relative inline-flex items-center gap-3 sm:gap-4 border-2 border-[#EA580C] bg-[#FBFBF8] px-6 py-3.5 sm:px-11 sm:py-4.5 shadow-[4px_4px_0_rgba(20,20,20,0.08)]"
          >
            <CertBeeMark className="h-10 w-10 sm:h-14 sm:w-14 shrink-0 drop-shadow-[2px_2px_0_#141414]" />
            <h1
              aria-label="CERTBEE"
              className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#141414] leading-none flex items-center"
            >
              <span aria-hidden="true" className="inline-flex">
                {'CERT'.split('').map((ch, idx) => (
                  <span key={`c-${idx}`} className="inline-block overflow-hidden">
                    <span data-hero-char className="inline-block">
                      {ch}
                    </span>
                  </span>
                ))}
              </span>
              <span aria-hidden="true" className="inline-flex text-[#EA580C]">
                {'BEE'.split('').map((ch, idx) => (
                  <span key={`b-${idx}`} className="inline-block overflow-hidden">
                    <span data-hero-char className="inline-block">
                      {ch}
                    </span>
                  </span>
                ))}
              </span>
            </h1>
          </div>

          {/* Desktop Bottom-Left Callout Tag + Arrow */}
          <div
            data-hero-note
            className="hidden md:flex items-center gap-1.5 absolute -left-36 -bottom-6 rotate-1"
          >
            <span className="rounded-sm border border-[#141414] bg-[#F6C33E] px-2.5 py-1 font-mono-tabular text-[10px] font-semibold text-[#141414] shadow-[2px_2px_0_#141414]">
              CSV · Excel · Sheets
            </span>
            <svg width="24" height="18" viewBox="0 0 24 18" fill="none" aria-hidden="true">
              <path
                d="M2 15C10 14 16 10 21 3M21 3L15 4M21 3L20 9"
                stroke="#141414"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Desktop Bottom-Right Callout Tag + Arrow */}
          <div
            data-hero-note
            className="hidden md:flex items-center gap-1.5 absolute -right-36 -bottom-6 -rotate-1"
          >
            <svg width="24" height="18" viewBox="0 0 24 18" fill="none" aria-hidden="true">
              <path
                d="M22 15C14 14 8 10 3 3M3 3L9 4M3 3L4 9"
                stroke="#141414"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="rounded-sm border border-[#141414] bg-[#C8EFE0] px-2.5 py-1 font-mono-tabular text-[10px] font-semibold text-[#141414] shadow-[2px_2px_0_#141414]">
              Instant PDF + ZIP
            </span>
          </div>
        </div>

        {/* Mobile/Tablet Responsive Sticky-Note Tags Row */}
        <div
          data-hero-note
          className="mt-4 flex md:hidden flex-wrap items-center justify-center gap-2"
        >
          <span className="rounded-sm border border-[#141414] bg-[#C8EFE0] px-2 py-0.5 font-mono-tabular text-[10px] font-semibold text-[#141414] shadow-[2px_2px_0_#141414]">
            ONE TEMPLATE
          </span>
          <span className="rounded-sm border border-[#141414] bg-[#F6C33E] px-2 py-0.5 font-mono-tabular text-[10px] font-semibold text-[#141414] shadow-[2px_2px_0_#141414]">
            CSV · Excel · Sheets
          </span>
          <span className="rounded-sm border border-[#141414] bg-[#F6EBB8] px-2 py-0.5 font-mono-tabular text-[10px] font-semibold text-[#141414] shadow-[2px_2px_0_#141414]">
            ZERO UPLOAD
          </span>
          <span className="rounded-sm border border-[#141414] bg-[#C8EFE0] px-2 py-0.5 font-mono-tabular text-[10px] font-semibold text-[#141414] shadow-[2px_2px_0_#141414]">
            PDF + ZIP
          </span>
        </div>

        {/* Clean Status Caption Row */}
        <div
          data-hero-stagger
          className="mt-6 md:mt-8 flex flex-wrap items-center justify-center gap-2 font-mono-tabular text-[10px] sm:text-[11px] font-medium tracking-wider text-[#52525B]"
        >
          <span className="inline-block h-2 w-2 rounded-full bg-[#2563EB]" aria-hidden="true" />
          <span>FREE · NO ACCOUNT · RUNS LOCALLY IN YOUR BROWSER</span>
        </div>

        {/* Main Statement + Flanking Tactile Thumbnail Medallions */}
        <div className="relative mt-7 sm:mt-9 w-full flex items-center justify-center">
          {/* Left Circular Medallion */}
          <div
            data-hero-badge
            aria-hidden="true"
            className="hidden lg:flex absolute left-10 -top-2 h-16 w-16 rounded-full border-2 border-[#EA580C] bg-white p-1 shadow-[3px_3px_0_#141414] overflow-hidden -rotate-3"
          >
            {!imgErrLeft ? (
              <img
                src={botanicalBackdrop}
                alt=""
                onError={() => setImgErrLeft(true)}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <div className="h-full w-full rounded-full bg-[#C8EFE0]" />
            )}
          </div>

          <div data-hero-stagger className="max-w-2xl space-y-3 sm:space-y-4 px-1">
            <h2
              className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-[#141414] leading-[1.15]"
              style={{ textWrap: 'balance' }}
            >
              <span className="inline-block overflow-hidden align-bottom">
                <span data-hero-word className="inline-block">
                  One design
                </span>
              </span>{' '}
              <span
                data-hero-word
                aria-hidden="true"
                className="inline-flex h-7 w-7 sm:h-10 sm:w-10 align-middle items-center justify-center rounded-full border-[1.5px] border-[#141414] bg-[#1FA971] text-white"
              >
                <Layers className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
              </span>{' '}
              <br className="hidden sm:inline" />
              <span className="relative inline-block overflow-hidden align-bottom px-1">
                <span
                  data-hero-highlight
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-1 h-3 sm:h-4 -z-10 origin-left bg-[#F6C33E]/70"
                />
                <span data-hero-word className="inline-block">
                  Every certificate.
                </span>
              </span>{' '}
              <span
                data-hero-word
                aria-hidden="true"
                className="inline-flex h-7 w-7 sm:h-10 sm:w-10 align-middle items-center justify-center rounded-full border-[1.5px] border-[#141414] bg-[#EC4899] text-white"
              >
                <Sparkles className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
              </span>
            </h2>

            <p className="mx-auto max-w-lg text-sm sm:text-base leading-relaxed text-[#52525B]">
              Upload your certificate background, import names from Excel, CSV, or Google Sheets, and export personalized PDFs in one ZIP.
            </p>
          </div>

          {/* Right Circular Medallion */}
          <div
            data-hero-badge
            aria-hidden="true"
            className="hidden lg:flex absolute right-10 top-6 h-16 w-16 rounded-full border-2 border-[#EA580C] bg-white p-1 shadow-[3px_3px_0_#141414] overflow-hidden rotate-3"
          >
            {!imgErrRight ? (
              <img
                src={wideBackdrop}
                alt=""
                onError={() => setImgErrRight(true)}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <div className="h-full w-full rounded-full bg-[#F6C33E]" />
            )}
          </div>
        </div>

        {/* Primary Dark CTA Button with Cobalt Square Accent */}
        <div data-hero-stagger className="mt-7 sm:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={startEmptyBatch}
            className="inline-flex items-center gap-2.5 rounded-sm border-[1.5px] border-[#141414] bg-[#141414] px-5 py-3 font-mono-tabular text-xs font-semibold tracking-wider text-white hover:bg-[#27272A] transition-colors shadow-[3px_3px_0_#2563EB] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-[2px] bg-[#2563EB] text-white">
              <Award className="h-3.5 w-3.5" />
            </span>
            <span>START A BATCH</span>
            <ArrowRight className="h-3.5 w-3.5 text-[#F6C33E]" />
          </button>

          <button
            type="button"
            onClick={() => navigate('guide')}
            className="inline-flex items-center gap-1.5 rounded-sm border-[1.5px] border-[#141414] bg-white px-4 py-3 font-mono-tabular text-xs font-semibold tracking-wider text-[#141414] hover:bg-[#F6C33E] transition-colors whitespace-nowrap shrink-0"
          >
            <span>PREPARATION GUIDE</span>
          </button>
        </div>
      </div>

      {/* Subtle Curved Notebook Divider Line */}
      <div className="mt-10 sm:mt-14 w-full overflow-hidden" aria-hidden="true">
        <svg viewBox="0 0 1000 32" fill="none" className="w-full h-6">
          <path
            d="M0 24 Q 500 -4 1000 22"
            stroke="#141414"
            strokeOpacity="0.22"
            strokeWidth="1.2"
          />
        </svg>
      </div>
    </section>
  );
}

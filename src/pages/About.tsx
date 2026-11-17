import { ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react';
import React, { useRef } from 'react';
import { SITE_CONFIG } from '../config/site';
import { getRoutePath, useBatchWorkspace } from '../hooks/useBatchWorkspace';
import { usePageReveal } from '../hooks/usePageReveal';

export function About() {
  const { startEmptyBatch, navigate } = useBatchWorkspace();
  const mainRef = useRef<HTMLElement | null>(null);

  usePageReveal(mainRef);

  const handleNav = (e: React.MouseEvent, target: 'privacy' | 'terms' | 'guide' | 'contact') => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(target);
  };

  return (
    <main ref={mainRef} className="min-h-[75vh]">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-8 sm:py-16 space-y-12">
        <div data-page-reveal className="space-y-4">
          <span className="inline-block rounded-md border-[1.5px] border-[#12151E] bg-[#F6C844] px-3 py-1 font-mono-tabular text-xs font-semibold text-[#12151E] shadow-[2px_2px_0_#12151E]">
            About
          </span>
          <h1
            className="font-display text-3xl sm:text-5xl font-bold tracking-[-0.025em] text-[#12151E]"
            style={{ textWrap: 'balance' }}
          >
            Built so one design can serve an entire room
          </h1>
          <p className="text-base sm:text-lg leading-relaxed text-[#4B5263]">
            Built by a Google Student Ambassador for ambassador programs, student clubs, and campus hackathons. Organizers spend hours designing a clean certificate in Figma or Canva—only to lose an entire evening pasting names one by one and exporting dozens of PDFs by hand. CertBee removes the repetitive middle step without forcing you to abandon your own artwork.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <section
            data-page-reveal
            className="rounded-xl border-[1.5px] border-[#12151E] bg-white p-6 space-y-2 shadow-[4px_4px_0_#12151E]"
          >
            <h2 className="font-display text-lg font-semibold text-[#12151E]">
              Bring your own craft
            </h2>
            <p className="text-sm leading-relaxed text-[#4B5263]">
              You know your typography, seals, and brand margins best. Upload a static PNG, JPG, SVG, or vector PDF export and use CertBee strictly as the precision data-merge layer on top.
            </p>
          </section>
          <section
            data-page-reveal
            className="rounded-xl border-[1.5px] border-[#12151E] bg-white p-6 space-y-2 shadow-[4px_4px_0_#12151E]"
          >
            <h2 className="font-display text-lg font-semibold text-[#12151E]">
              Local-first by default
            </h2>
            <p className="text-sm leading-relaxed text-[#4B5263]">
              Participant spreadsheets often contain student names and personal email addresses. Running PDF generation and ZIP archiving directly inside your browser ensures your roster stays on your device.
            </p>
          </section>
        </div>

        {/* Verifiable Architecture & Open Source Trust */}
        <section
          data-page-reveal
          aria-labelledby="trust-architecture-heading"
          className="rounded-xl border-[1.5px] border-[#12151E] bg-white p-6 sm:p-8 space-y-4 shadow-[4px_4px_0_#12151E]"
        >
          <div className="flex items-center gap-2 text-sm font-bold text-[#12151E]">
            <ShieldCheck className="h-5 w-5 text-[#10B981]" aria-hidden="true" />
            <h2 id="trust-architecture-heading" className="font-display text-lg font-bold">
              What happens inside your browser vs external requests
            </h2>
          </div>
          <ul className="space-y-2 text-sm leading-relaxed text-[#4B5263] list-disc pl-5">
            <li>
              <strong className="text-[#12151E]">Templates &amp; Spreadsheets:</strong> Processed strictly in browser memory with PapaParse, SheetJS, pdf-lib, fontkit, and JSZip.
            </li>
            <li>
              <strong className="text-[#12151E]">Active Draft Storage:</strong> Persisted locally in your browser&apos;s IndexedDB database so refreshing does not wipe coordinates—clearable anytime via &ldquo;New batch&rdquo;.
            </li>
            <li>
              <strong className="text-[#12151E]">Public Google Sheets:</strong> Only triggered when you paste a public Google Sheets link, fetched read-only directly from your browser tab.
            </li>
            <li>
              <strong className="text-[#12151E]">Independent Project:</strong> CertBee is not affiliated with, endorsed by, or officially connected to Google LLC, Canva Pty Ltd, Microsoft Corporation, Figma, Inc., or Adobe Inc.
            </li>
          </ul>
          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs sm:text-sm font-semibold">
            <a
              href={SITE_CONFIG.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#12151E] hover:text-[#2563EB] transition-colors"
            >
              <span>Inspect source on GitHub</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
            <a
              href={getRoutePath('privacy')}
              onClick={(e) => handleNav(e, 'privacy')}
              className="text-[#2563EB] hover:text-[#12151E] transition-colors"
            >
              Read Privacy Policy →
            </a>
            <a
              href={getRoutePath('terms')}
              onClick={(e) => handleNav(e, 'terms')}
              className="text-[#2563EB] hover:text-[#12151E] transition-colors"
            >
              Read Terms of Use →
            </a>
          </div>
        </section>

        <div
          data-page-reveal
          className="rounded-2xl border-[1.5px] border-[#12151E] bg-[#F6C844] p-6 sm:p-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between shadow-[5px_5px_0_#12151E]"
        >
          <div className="space-y-1">
            <h2 className="font-display text-xl font-bold text-[#12151E]">
              Ready to run a batch?
            </h2>
            <p className="text-sm text-[#12151E]/85">
              Upload your certificate artwork and generate your batch locally in minutes.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <button
              type="button"
              onClick={startEmptyBatch}
              className="inline-flex h-10 items-center gap-2 rounded-lg border-[1.5px] border-[#12151E] bg-[#12151E] px-5 text-sm font-semibold text-white shadow-[3px_3px_0_#FFFFFF] hover:bg-[#1E2333] active:translate-x-[1px] active:translate-y-[1px] transition-[background-color,transform] duration-150 cursor-pointer"
            >
              <span>Start a batch</span>
              <ArrowRight className="h-4 w-4 text-[#F6C844]" strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

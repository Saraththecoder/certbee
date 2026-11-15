import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import { useBatchWorkspace } from '../hooks/useBatchWorkspace';
import { usePageReveal } from '../hooks/usePageReveal';

export function About() {
  const { startEmptyBatch } = useBatchWorkspace();
  const mainRef = useRef<HTMLElement | null>(null);

  usePageReveal(mainRef);

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
          <div data-page-reveal className="rounded-xl border-[1.5px] border-[#12151E] bg-white p-6 space-y-2 shadow-[4px_4px_0_#12151E]">
            <h2 className="font-display text-lg font-semibold text-[#12151E]">
              Bring your own craft
            </h2>
            <p className="text-sm leading-relaxed text-[#4B5263]">
              You know your typography, seals, and brand margins best. Upload a static PNG, JPG, SVG, or vector PDF export and use CertBee strictly as the precision data-merge layer on top.
            </p>
          </div>
          <div data-page-reveal className="rounded-xl border-[1.5px] border-[#12151E] bg-white p-6 space-y-2 shadow-[4px_4px_0_#12151E]">
            <h2 className="font-display text-lg font-semibold text-[#12151E]">
              Local-first by default
            </h2>
            <p className="text-sm leading-relaxed text-[#4B5263]">
              Participant spreadsheets often contain student names and personal email addresses. Running PDF generation directly inside your browser ensures your list stays on your device.
            </p>
          </div>
        </div>

        <div data-page-reveal className="rounded-2xl border-[1.5px] border-[#12151E] bg-[#F6C844] p-6 sm:p-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between shadow-[5px_5px_0_#12151E]">
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
              <ArrowRight className="h-4 w-4 text-[#F6C844]" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

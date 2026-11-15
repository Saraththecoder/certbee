import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import { useBatchWorkspace } from '../hooks/useBatchWorkspace';
import { usePageReveal } from '../hooks/usePageReveal';

export function Guide() {
  const { startEmptyBatch, navigate } = useBatchWorkspace();
  const mainRef = useRef<HTMLElement | null>(null);

  usePageReveal(mainRef);

  return (
    <main ref={mainRef} className="min-h-[75vh]">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-8 sm:py-16 space-y-10">
        <div data-page-reveal className="space-y-4">
          <span className="inline-block rounded-md border-[1.5px] border-[#12151E] bg-[#2563EB] px-3 py-1 font-mono-tabular text-xs font-semibold text-white shadow-[2px_2px_0_#12151E]">
            Preparation guide
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.025em] text-[#12151E]">
            How to prepare templates and spreadsheets
          </h1>
          <p className="text-base leading-relaxed text-[#4B5263]">
            Follow these four practical steps before uploading so generated PDFs stay crisp on screen and on paper.
          </p>
        </div>

        <div className="space-y-4">
          <section data-page-reveal className="rounded-xl border-[1.5px] border-[#12151E] bg-white p-6 space-y-2 shadow-[4px_4px_0_#12151E]">
            <h2 className="font-display text-lg font-semibold text-[#12151E] flex items-center gap-3">
              <span className="inline-flex h-6 w-7 shrink-0 items-center justify-center rounded border border-[#12151E] bg-[#F6C844] font-mono-tabular tabular-nums text-[11px] font-bold text-[#12151E]">
                01
              </span>
              <span>Export artwork without placeholder names</span>
            </h2>
            <p className="pl-10 text-sm leading-relaxed text-[#4B5263]">
              In Figma, Canva, or PowerPoint, remove any sample recipient name, date, or award text that changes per person. Export as a vector PDF or SVG for sharp borders and logos, or as PNG at 1920 × 1080 px for digital delivery and 3508 × 2480 px at 300 DPI for print.
            </p>
          </section>

          <section id="sheets-guide" data-page-reveal className="rounded-xl border-[1.5px] border-[#12151E] bg-white p-6 space-y-2 shadow-[4px_4px_0_#12151E]">
            <h2 className="font-display text-lg font-semibold text-[#12151E] flex items-center gap-3">
              <span className="inline-flex h-6 w-7 shrink-0 items-center justify-center rounded border border-[#12151E] bg-[#F6C844] font-mono-tabular tabular-nums text-[11px] font-bold text-[#12151E]">
                02
              </span>
              <span>Format your CSV, Excel (.xlsx), or Google Sheet</span>
            </h2>
            <p className="pl-10 text-sm leading-relaxed text-[#4B5263]">
              Keep column headers in the first row, such as Name, Email, Role, and Date. Upload CSV or Excel workbooks directly, paste names one per line, or set a Google Sheet to &ldquo;Anyone with the link can view&rdquo;.
            </p>
          </section>

          <section data-page-reveal className="rounded-xl border-[1.5px] border-[#12151E] bg-white p-6 space-y-2 shadow-[4px_4px_0_#12151E]">
            <h2 className="font-display text-lg font-semibold text-[#12151E] flex items-center gap-3">
              <span className="inline-flex h-6 w-7 shrink-0 items-center justify-center rounded border border-[#12151E] bg-[#F6C844] font-mono-tabular tabular-nums text-[11px] font-bold text-[#12151E]">
                03
              </span>
              <span>Test the longest name in Step 03</span>
            </h2>
            <p className="pl-10 text-sm leading-relaxed text-[#4B5263]">
              Use the participant switcher at the top of the Design Editor to jump to the longest name in your list. Keep Auto-fit enabled in the properties panel so long names scale down cleanly inside margins.
            </p>
          </section>

          <section data-page-reveal className="rounded-xl border-[1.5px] border-[#12151E] bg-white p-6 space-y-2 shadow-[4px_4px_0_#12151E]">
            <h2 className="font-display text-lg font-semibold text-[#12151E] flex items-center gap-3">
              <span className="inline-flex h-6 w-7 shrink-0 items-center justify-center rounded border border-[#12151E] bg-[#F6C844] font-mono-tabular tabular-nums text-[11px] font-bold text-[#12151E]">
                04
              </span>
              <span>Export your ZIP locally</span>
            </h2>
            <p className="pl-10 text-sm leading-relaxed text-[#4B5263]">
              In Step 04, CertBee renders each PDF with a sanitized filename such as Certificate_Aarav_Kumar.pdf and bundles the batch into one ZIP archive inside your browser.
            </p>
          </section>
        </div>

        <div data-page-reveal className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={startEmptyBatch}
            className="inline-flex h-11 items-center gap-2 rounded-lg border-[1.5px] border-[#12151E] bg-[#12151E] px-5 text-sm font-semibold text-white shadow-[3px_3px_0_#F6C844] hover:bg-[#1E2333] active:translate-x-[1px] active:translate-y-[1px] transition-[background-color,transform] duration-150 cursor-pointer"
          >
            <span>Start a batch</span>
            <ArrowRight className="h-4 w-4 text-[#F6C844]" strokeWidth={1.75} aria-hidden="true" />
          </button>

          <div className="flex flex-wrap items-center gap-4 text-sm font-semibold">
            <a
              href="/certificate-generator-from-excel"
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                e.preventDefault();
                navigate('certificate-generator-from-excel');
              }}
              className="text-[#2563EB] hover:text-[#12151E] transition-colors"
            >
              Excel (.xlsx) guide
            </a>
            <a
              href="/certificate-generator-from-google-sheets"
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                e.preventDefault();
                navigate('certificate-generator-from-google-sheets');
              }}
              className="text-[#2563EB] hover:text-[#12151E] transition-colors"
            >
              Google Sheets guide
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

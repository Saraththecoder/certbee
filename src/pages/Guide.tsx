import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import { useBatchWorkspace } from '../hooks/useBatchWorkspace';
import { usePageReveal } from '../hooks/usePageReveal';

export function Guide() {
  const { startEmptyBatch } = useBatchWorkspace();
  const mainRef = useRef<HTMLElement | null>(null);

  usePageReveal(mainRef);

  return (
    <main ref={mainRef} className="min-h-[75vh]">
      <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16 space-y-10">
        <div data-page-reveal className="space-y-4">
          <span className="inline-block rounded-sm border border-[#141414] bg-[#F6C33E] px-2.5 py-1 font-mono-tabular text-[11px] font-semibold uppercase tracking-wider text-[#141414]">
            Practical Guide
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#141414]">
            How to prepare templates and spreadsheets for clean batches
          </h1>
          <p className="text-base leading-relaxed text-[#52525B]">
            Follow these four practical guidelines before uploading so your generated PDFs look crisp on screen and on paper.
          </p>
        </div>

        <div className="space-y-5">
          <section data-page-reveal className="rounded-sm border-[1.5px] border-[#141414] bg-white p-6 space-y-3 shadow-[4px_4px_0_#141414]">
            <h2 className="font-display text-lg font-bold text-[#141414]">
              <span className="mr-2 inline-block rounded-sm border border-[#141414] bg-[#F6C33E] px-2 py-0.5 font-mono-tabular text-xs">
                01
              </span>
              Export your artwork without placeholder names
            </h2>
            <p className="text-sm leading-relaxed text-[#52525B]">
              In Figma, Canva, or PowerPoint, remove any sample recipient name, date, or award text that changes per person. Export as a <strong className="text-[#141414]">vector PDF or SVG</strong> for razor-sharp borders and logos, or as a <strong className="text-[#141414]">PNG</strong> at <strong className="text-[#141414]">1920 × 1080 px</strong> for digital delivery or <strong className="text-[#141414]">3508 × 2480 px</strong> for print-ready A4 at 300 DPI.
            </p>
          </section>

          <section id="sheets-guide" data-page-reveal className="rounded-sm border-[1.5px] border-[#141414] bg-white p-6 space-y-3 shadow-[4px_4px_0_#141414]">
            <h2 className="font-display text-lg font-bold text-[#141414]">
              <span className="mr-2 inline-block rounded-sm border border-[#141414] bg-[#1FA971] px-2 py-0.5 font-mono-tabular text-xs text-white">
                02
              </span>
              Format your CSV, Excel (.xlsx), or public Google Sheet
            </h2>
            <p className="text-sm leading-relaxed text-[#52525B]">
              Keep column headers in the first row (for example: <code className="font-mono-tabular bg-[#F3F1EA] border border-[#141414]/25 px-1.5 py-0.5 rounded text-[#141414]">Name</code>, <code className="font-mono-tabular bg-[#F3F1EA] border border-[#141414]/25 px-1.5 py-0.5 rounded text-[#141414]">Email</code>, <code className="font-mono-tabular bg-[#F3F1EA] border border-[#141414]/25 px-1.5 py-0.5 rounded text-[#141414]">Role</code>, <code className="font-mono-tabular bg-[#F3F1EA] border border-[#141414]/25 px-1.5 py-0.5 rounded text-[#141414]">Date</code>). Upload CSV or Excel workbooks directly, paste names one per line, or set a Google Sheet to <strong className="text-[#141414]">Anyone with the link (Viewer)</strong>.
            </p>
          </section>

          <section data-page-reveal className="rounded-sm border-[1.5px] border-[#141414] bg-white p-6 space-y-3 shadow-[4px_4px_0_#141414]">
            <h2 className="font-display text-lg font-bold text-[#141414]">
              <span className="mr-2 inline-block rounded-sm border border-[#141414] bg-[#EC4899] px-2 py-0.5 font-mono-tabular text-xs text-white">
                03
              </span>
              Test the longest name in Step 03
            </h2>
            <p className="text-sm leading-relaxed text-[#52525B]">
              Use the participant switcher at the top of the Design Editor to jump to the longest name in your list. Keep <strong className="text-[#141414]">Auto-fit long names</strong> enabled in the properties panel so unusually long names scale down smoothly instead of overflowing borders.
            </p>
          </section>

          <section data-page-reveal className="rounded-sm border-[1.5px] border-[#141414] bg-white p-6 space-y-3 shadow-[4px_4px_0_#141414]">
            <h2 className="font-display text-lg font-bold text-[#141414]">
              <span className="mr-2 inline-block rounded-sm border border-[#141414] bg-[#2563EB] px-2 py-0.5 font-mono-tabular text-xs text-white">
                04
              </span>
              Export your ZIP locally
            </h2>
            <p className="text-sm leading-relaxed text-[#52525B]">
              In Step 04, CertBee builds each PDF with a sanitized filename such as <code className="font-mono-tabular bg-[#F3F1EA] border border-[#141414]/25 px-1.5 py-0.5 rounded text-[#141414]">Certificate_Aarav_Kumar.pdf</code> and bundles the complete batch into one ZIP archive.
            </p>
          </section>
        </div>

        <div data-page-reveal>
          <button
            type="button"
            onClick={startEmptyBatch}
            className="inline-flex items-center gap-2 rounded-sm border-[1.5px] border-[#141414] bg-[#141414] px-5 py-3 font-mono-tabular text-xs font-semibold tracking-wider text-white hover:bg-[#27272A] transition-colors shadow-[3px_3px_0_#2563EB]"
          >
            OPEN CERTIFICATE TOOL
            <ArrowRight className="h-4 w-4 text-[#F6C33E]" />
          </button>
        </div>
      </div>
    </main>
  );
}

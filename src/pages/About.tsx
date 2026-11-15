import { ArrowRight } from 'lucide-react';
import { useBatchWorkspace } from '../hooks/useBatchWorkspace';

export function About() {
  const { startEmptyBatch } = useBatchWorkspace();

  return (
    <main className="min-h-[75vh]">
      <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16 space-y-12">
        <div className="space-y-4">
          <span className="inline-block rounded-sm border border-[#141414] bg-[#C8EFE0] px-2.5 py-1 font-mono-tabular text-[11px] font-semibold uppercase tracking-wider text-[#141414]">
            About CertBee
          </span>
          <h1
            className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-[#141414]"
            style={{ textWrap: 'balance' }}
          >
            Built so one clean design can serve an entire room.
          </h1>
          <p className="text-base sm:text-lg leading-relaxed text-[#52525B]">
            Organizers spend hours designing a thoughtful certificate in Figma or Canva—only to lose an entire evening duplicating slides, pasting names one by one, and exporting dozens of PDFs by hand. CertBee removes the repetitive middle step without forcing you to abandon your own artwork.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-sm border-[1.5px] border-[#141414] bg-white p-6 space-y-2 shadow-[4px_4px_0_#141414]">
            <h2 className="font-display text-lg font-bold text-[#141414]">
              Bring your own craft
            </h2>
            <p className="text-sm leading-relaxed text-[#52525B]">
              You know your typography, seals, and brand margins best. Upload a static PNG, JPG, SVG, or vector PDF export and use CertBee strictly as the precision data-merge layer on top.
            </p>
          </div>
          <div className="rounded-sm border-[1.5px] border-[#141414] bg-white p-6 space-y-2 shadow-[4px_4px_0_#141414]">
            <h2 className="font-display text-lg font-bold text-[#141414]">
              Local-first by default
            </h2>
            <p className="text-sm leading-relaxed text-[#52525B]">
              Participant spreadsheets often contain student names and personal email addresses. Running PDF generation directly inside your browser ensures your list stays on your device.
            </p>
          </div>
        </div>

        <div className="rounded-sm border-[1.5px] border-[#141414] bg-[#F6C33E] p-6 sm:p-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between shadow-[5px_5px_0_#141414]">
          <div className="space-y-1">
            <h2 className="font-display text-xl font-extrabold text-[#141414]">
              Ready to run a batch?
            </h2>
            <p className="text-sm text-[#141414]/80">
              Upload your certificate artwork and generate your batch locally in minutes.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <button
              type="button"
              onClick={startEmptyBatch}
              className="inline-flex items-center gap-2 rounded-sm border-[1.5px] border-[#141414] bg-[#141414] px-5 py-2.5 font-mono-tabular text-xs font-semibold tracking-wider text-white hover:bg-[#27272A] transition-colors shadow-[3px_3px_0_#2563EB]"
            >
              START A BATCH
              <ArrowRight className="h-4 w-4 text-[#F6C33E]" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

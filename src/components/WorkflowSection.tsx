import { ArrowRight, Download, FileSpreadsheet, Move, UploadCloud } from 'lucide-react';
import { useBatchWorkspace } from '../hooks/useBatchWorkspace';

const WORKFLOW_STEPS = [
  {
    id: '01',
    title: 'Upload design',
    description: 'Drop in any clean PNG, JPG, SVG, or vector PDF template exported without sample names.',
    formatHint: 'PNG · JPG · SVG · PDF',
    icon: UploadCloud,
    badgeBg: 'bg-[#F97316]',
  },
  {
    id: '02',
    title: 'Import list',
    description: 'Load CSV or Excel files, paste plain text rows, or fetch a public Google Sheet link.',
    formatHint: 'CSV · XLSX · SHEETS',
    icon: FileSpreadsheet,
    badgeBg: 'bg-[#2563EB]',
  },
  {
    id: '03',
    title: 'Place fields',
    description: 'Align text boxes directly over your artwork, set Auto-fit margins, and preview long names.',
    formatHint: 'Auto-fit · Custom TTF/OTF',
    icon: Move,
    badgeBg: 'bg-[#10B981]',
  },
  {
    id: '04',
    title: 'Export ZIP',
    description: 'Render crisp personalized PDFs and download everything bundled in one browser-built ZIP.',
    formatHint: 'One PDF per participant',
    icon: Download,
    badgeBg: 'bg-[#EC4899]',
  },
] as const;

export function WorkflowSection() {
  const { startEmptyBatch } = useBatchWorkspace();

  return (
    <section id="workflow" data-workflow-section className="px-4 py-10 sm:px-6 lg:px-8 sm:py-12">
      <div className="mx-auto max-w-5xl">
        {/* Cobalt Folder Tab Header */}
        <div
          data-workflow-head
          className="inline-flex items-center gap-2 rounded-t-lg border-[1.5px] border-b-0 border-[#12151E] bg-[#2563EB] px-4 py-1.5 font-mono-tabular text-xs font-semibold text-white"
        >
          <span>How it works</span>
        </div>

        {/* High-Contrast Charcoal Studio Block */}
        <div className="rounded-2xl rounded-tl-none border-[1.5px] border-[#12151E] bg-[#11131B] p-6 sm:p-8 lg:p-10 text-white shadow-[5px_5px_0_#12151E]">
          <div
            data-workflow-head
            className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
          >
            <div className="max-w-xl space-y-2.5">
              <h2
                className="font-display text-2xl sm:text-4xl font-bold tracking-[-0.025em] text-white leading-[1.12]"
                style={{ textWrap: 'balance' }}
              >
                From spreadsheet to ZIP in 4 steps.
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-white/75">
                Keep your own borders, seals, and typography. Upload your template, import your list, place fields once, and export one clean PDF per participant.
              </p>
            </div>

            <button
              type="button"
              onClick={startEmptyBatch}
              className="group inline-flex h-10 shrink-0 items-center gap-2 self-start sm:self-auto rounded-lg border-[1.5px] border-white/25 bg-[#2563EB] px-4 text-xs sm:text-sm font-semibold text-white shadow-[3px_3px_0_#000000] hover:-translate-y-0.5 active:translate-y-0.5 hover:bg-[#1D4ED8] transition-[background-color,transform] duration-150 whitespace-nowrap cursor-pointer"
            >
              <span>Start a batch</span>
              <ArrowRight
                className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
                strokeWidth={1.75}
              />
            </button>
          </div>

          {/* 4 Structured Dark Cards */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {WORKFLOW_STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.id}
                  data-workflow-card
                  className="group flex flex-col justify-between rounded-xl border border-white/15 bg-[#181B26] p-5 text-left transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-white/30"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 ${step.badgeBg} text-white transition-transform duration-200 group-hover:scale-105`}
                      >
                        <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                      </span>
                      <span className="font-mono-tabular tabular-nums text-xs font-medium text-white/55">
                        {step.id}
                      </span>
                    </div>

                    <h3 className="mt-4 font-display text-base font-semibold text-white">
                      {step.title}
                    </h3>
                    <p className="mt-1 font-mono-tabular text-[11px] text-white/55">
                      {step.formatHint}
                    </p>
                  </div>

                  <p className="mt-3 text-xs sm:text-sm leading-relaxed text-white/75">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

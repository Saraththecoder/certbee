import { ArrowRight, Maximize2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getRoutePath, useBatchWorkspace } from '../hooks/useBatchWorkspace';

const WORKFLOW_STEPS = [
  {
    id: '01',
    label: 'Step 1',
    title: 'Upload your design',
    description:
      'Drop in any clean PNG, JPG, SVG, or vector PDF template exported without placeholder recipient names.',
    screenshot: '/images/certbee-step-1-upload-certificate-template.webp',
    screenshotAlt:
      'CertBee Step 1 template uploader showing PNG, JPG, SVG, and vector PDF certificate dropzone',
  },
  {
    id: '02',
    label: 'Step 2',
    title: 'Import your list',
    description:
      'Load a CSV or Excel workbook, paste names one per line, or fetch a public Google Sheet directly in your browser.',
    screenshot: '/images/certbee-step-2-import-participants-spreadsheet.webp',
    screenshotAlt:
      'CertBee Step 2 participant import screen supporting Excel (.xlsx), CSV, pasted names, and Google Sheets URLs',
  },
  {
    id: '03',
    label: 'Step 3',
    title: 'Place the fields',
    description:
      'Drag the name box into place on your template, pick a font and color, and enable Auto-fit so long names never overflow.',
    screenshot: '/images/certbee-step-3-design-certificate-fields.webp',
    screenshotAlt:
      'CertBee Step 3 canvas editor with draggable participant name field, font dropdown, and alignment properties',
  },
  {
    id: '04',
    label: 'Step 4',
    title: 'Export your ZIP',
    description:
      'Verify every column once, generate every personalized PDF locally, and download the complete batch in one ZIP archive.',
    screenshot: '/images/certbee-step-4-generate-download-zip.webp',
    screenshotAlt:
      'CertBee Step 4 batch generation dashboard validating participant count and downloading certificates_batch.zip locally',
  },
] as const;

export function WorkflowSection() {
  const { startEmptyBatch, navigate } = useBatchWorkspace();
  const [zoomedStepId, setZoomedStepId] = useState<string | null>(null);

  const zoomedStep = WORKFLOW_STEPS.find((s) => s.id === zoomedStepId) ?? null;

  useEffect(() => {
    if (!zoomedStepId) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoomedStepId(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [zoomedStepId]);

  return (
    <section id="workflow" data-workflow-section className="px-4 py-12 sm:px-6 lg:px-8 sm:py-16">
      <div className="mx-auto max-w-5xl space-y-12 sm:space-y-14">
        {/* Section Header */}
        <div
          data-workflow-head
          className="flex flex-col gap-5 border-b-[1.5px] border-[#12151E]/15 pb-8 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="max-w-xl space-y-2.5 text-left">
            <span className="inline-block rounded-md border-[1.5px] border-[#12151E] bg-[#2563EB] px-3 py-1 font-mono-tabular text-xs font-semibold text-white shadow-[2px_2px_0_#12151E]">
              How it works
            </span>
            <h2
              className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.025em] text-[#12151E] leading-[1.12]"
              style={{ textWrap: 'balance' }}
            >
              From spreadsheet to ZIP in 4 steps.
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-[#4B5263]">
              Keep your own borders, seals, and typography while CertBee merges your sheet locally.
            </p>
          </div>

          <button
            type="button"
            onClick={startEmptyBatch}
            className="group inline-flex h-10 shrink-0 items-center gap-2 self-start sm:self-auto rounded-lg border-[1.5px] border-[#12151E] bg-[#12151E] px-4 text-xs sm:text-sm font-semibold text-white shadow-[3px_3px_0_#F6C844] hover:-translate-y-0.5 active:translate-y-0.5 hover:bg-[#1E2333] transition-[background-color,transform] duration-150 whitespace-nowrap cursor-pointer"
          >
            <span>Start a batch</span>
            <ArrowRight
              className="h-4 w-4 text-[#F6C844] transition-transform duration-150 group-hover:translate-x-0.5"
              strokeWidth={1.75}
            />
          </button>
        </div>

        {/* Clean Stacked Two-Column Step Rows (Screenshot Left + Step Text Right) */}
        <div className="space-y-12 sm:space-y-16">
          {WORKFLOW_STEPS.map((step) => (
            <div
              key={step.id}
              data-workflow-card
              className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center lg:gap-12"
            >
              {/* Step Screenshot Left */}
              <div className="lg:col-span-7">
                <button
                  type="button"
                  onClick={() => setZoomedStepId(step.id)}
                  aria-label={`Inspect ${step.title} screenshot`}
                  className="group relative block w-full overflow-hidden rounded-xl border-[1.5px] border-[#12151E] bg-white shadow-[5px_5px_0_#12151E] hover:-translate-y-0.5 transition-transform duration-200 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#12151E]"
                >
                  <img
                    src={step.screenshot}
                    alt={step.screenshotAlt}
                    width={1280}
                    height={585}
                    sizes="(max-width: 1024px) 100vw, 600px"
                    loading="lazy"
                    decoding="async"
                    className="block w-full h-auto transition-transform duration-300 ease-out group-hover:scale-[1.015]"
                  />
                  <span className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-md border-[1.5px] border-[#12151E] bg-white/95 px-2.5 py-1 font-mono-tabular text-[11px] font-semibold text-[#12151E] shadow-[2px_2px_0_#12151E] opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                    <Maximize2 className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                    <span>Expand</span>
                  </span>
                </button>
              </div>

              {/* Step Copy Right */}
              <div className="lg:col-span-5 space-y-3.5 text-left">
                <span className="inline-block rounded-md border-[1.5px] border-[#12151E] bg-[#FFF4CC] px-3 py-1 font-mono-tabular text-xs font-semibold text-[#12151E] shadow-[2px_2px_0_#12151E]">
                  {step.label}
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-[#12151E] leading-tight">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base leading-relaxed text-[#4B5263]">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Helpful Internal Navigation Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border-[1.5px] border-[#12151E] bg-white px-5 py-4 shadow-[3px_3px_0_#12151E]">
          <p className="text-sm text-[#4B5263]">
            Need a walkthrough for <strong className="font-semibold text-[#12151E]">Excel</strong>,{' '}
            <strong className="font-semibold text-[#12151E]">Google Sheets</strong>, or{' '}
            <strong className="font-semibold text-[#12151E]">campus events</strong>?
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-semibold">
            <a
              href={getRoutePath('features')}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                e.preventDefault();
                navigate('features');
              }}
              className="text-[#2563EB] hover:text-[#12151E] transition-colors"
            >
              All features
            </a>
            <a
              href={getRoutePath('certificate-generator-from-excel')}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                e.preventDefault();
                navigate('certificate-generator-from-excel');
              }}
              className="text-[#2563EB] hover:text-[#12151E] transition-colors"
            >
              Excel guide
            </a>
            <a
              href={getRoutePath('certificate-generator-from-google-sheets')}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                e.preventDefault();
                navigate('certificate-generator-from-google-sheets');
              }}
              className="text-[#2563EB] hover:text-[#12151E] transition-colors"
            >
              Google Sheets
            </a>
            <a
              href={getRoutePath('how-it-works')}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                e.preventDefault();
                navigate('how-it-works');
              }}
              className="text-[#12151E] underline decoration-[#F6C844] decoration-2 underline-offset-4 hover:text-[#2563EB] transition-colors"
            >
              Detailed workflow →
            </a>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Preview Modal */}
      {zoomedStep && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${zoomedStep.title} preview`}
          onClick={() => setZoomedStepId(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#12151E]/80 p-4 backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl overflow-hidden rounded-2xl border-[1.5px] border-[#12151E] bg-[#FAF9F5] shadow-[6px_6px_0_#F6C844]"
          >
            <div className="flex items-center justify-between border-b-[1.5px] border-[#12151E] bg-white px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex h-6 items-center justify-center rounded border border-[#12151E] bg-[#F6C844] px-2 font-mono-tabular text-[11px] font-bold text-[#12151E]">
                  {zoomedStep.label}
                </span>
                <span className="font-display text-sm font-semibold text-[#12151E]">
                  {zoomedStep.title}
                </span>
              </div>
              <button
                type="button"
                aria-label="Close preview"
                onClick={() => setZoomedStepId(null)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border-[1.5px] border-[#12151E] bg-white text-[#12151E] hover:bg-[#F3F1EA] cursor-pointer"
              >
                <X className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </div>
            <img
              src={zoomedStep.screenshot}
              alt={zoomedStep.screenshotAlt}
              width={1280}
              height={585}
              className="block w-full h-auto"
            />
          </div>
        </div>
      )}
    </section>
  );
}

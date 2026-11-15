import gsap from 'gsap';
import {
  ArrowRight,
  FileSpreadsheet,
  FolderArchive,
  SlidersHorizontal,
  Upload,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import botanicalBackdrop from '../assets/images/botanical_shadow_slate_1794682854352.jpg';
import wideBackdrop from '../assets/images/wide_botanical_backdrop_1794682854967.jpg';
import { useBatchWorkspace } from '../hooks/useBatchWorkspace';

const WORKFLOW_STEPS = [
  {
    id: '01',
    label: '01 · Upload Template',
    title: 'Choose the background',
    description: 'Upload a PNG, JPG, SVG, or PDF exported without placeholder recipient names.',
    color: 'bg-[#F6C33E] text-[#141414]',
    icon: Upload,
  },
  {
    id: '02',
    label: '02 · Import List',
    title: 'Add your recipients',
    description: 'Import CSV, Excel (.xlsx), paste names, or link a public Google Sheet.',
    color: 'bg-[#1FA971] text-white',
    icon: FileSpreadsheet,
  },
  {
    id: '03',
    label: '03 · Place Fields',
    title: 'Style & auto-fit names',
    description: 'Position dynamic text once, preview long names, and keep proportions crisp.',
    color: 'bg-[#EC4899] text-white',
    icon: SlidersHorizontal,
  },
  {
    id: '04',
    label: '04 · Export ZIP',
    title: 'Download every PDF',
    description: 'Build named PDFs locally in your browser and save one ready ZIP archive.',
    color: 'bg-[#2563EB] text-white',
    icon: FolderArchive,
  },
] as const;

export function WorkflowSection() {
  const { startEmptyBatch } = useBatchWorkspace();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [leftErr, setLeftErr] = useState(false);
  const [rightErr, setRightErr] = useState(false);
  const stepNoteRef = useRef<HTMLDivElement | null>(null);

  const activeStep = WORKFLOW_STEPS[selectedIdx] ?? WORKFLOW_STEPS[0];

  useEffect(() => {
    const node = stepNoteRef.current;
    if (!node) return;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        node,
        { opacity: 0.4, y: 5 },
        { opacity: 1, y: 0, duration: 0.22, ease: 'power2.out', clearProps: 'transform,opacity' }
      );
    });
    return () => mm.revert();
  }, [selectedIdx]);

  return (
    <section id="workflow" className="px-4 py-8 sm:px-10 sm:py-12 overflow-hidden">
      <div className="mx-auto max-w-5xl space-y-8">
        <p className="font-serif-editorial italic text-xs text-[#52525B] underline decoration-[#141414]/30 underline-offset-4">
          from design to batch
        </p>

        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          {/* Left Tilted Masking-Taped Polaroid Frame */}
          <div data-wf-card className="lg:col-span-3 flex justify-center">
            <div className="relative w-56 -rotate-3 rounded-[2px] border border-[#141414]/25 bg-white p-2.5 pb-4 shadow-[0_12px_26px_rgba(0,0,0,0.14)]">
              <span
                aria-hidden="true"
                className="masking-tape absolute -left-3 -top-2.5 h-4 w-12 -rotate-12"
              />
              <span
                aria-hidden="true"
                className="masking-tape absolute -right-3 -top-2 h-4 w-10 rotate-12"
              />

              <div className="relative h-44 w-full overflow-hidden rounded-[2px] bg-[#1C2A25] p-3 flex flex-col justify-center items-center">
                {!leftErr && (
                  <img
                    src={botanicalBackdrop}
                    alt=""
                    aria-hidden="true"
                    onError={() => setLeftErr(true)}
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-85"
                  />
                )}
                <div className="relative space-y-1.5 w-full">
                  <div className="-rotate-2 rounded-[2px] border border-[#D8D1C5] bg-[#F7F3EA] px-3 py-2 text-center shadow-sm">
                    <p className="font-serif-editorial text-xs font-semibold text-[#141414]">
                      Alex Morgan
                    </p>
                  </div>
                  <div className="rotate-1 rounded-[2px] border border-[#D8D1C5] bg-[#F7F3EA] px-3 py-2 text-center shadow-md">
                    <p className="font-mono-tabular text-[7px] tracking-[0.18em] text-[#52525B]">
                      CERTIFICATE
                    </p>
                    <p className="font-serif-editorial text-sm font-semibold text-[#141414]">
                      Jordan Lee
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-2.5 text-center font-mono-tabular text-[10px] text-[#52525B]">
                one layout
              </p>
            </div>
          </div>

          {/* Center Boxed Heading + Tactile Stamp Badges */}
          <div data-wf-card className="lg:col-span-6 flex flex-col items-center text-center space-y-5">
            <h2
              data-scroll-text
              className="inline-block border-[1.5px] border-[#141414] bg-white px-4 py-1.5 font-display text-xl sm:text-2xl font-bold tracking-tight text-[#141414] shadow-[3px_3px_0_#141414]"
            >
              how it works
            </h2>

            <p data-scroll-text className="max-w-md text-sm sm:text-base leading-relaxed text-[#141414]">
              Keep your own typography, borders, and seals. CertBee binds your spreadsheet columns onto your artwork and exports a clean PDF for every participant.
            </p>

            {/* 4 Colored Stamp Badges matching reference middle badges */}
            <div data-wf-stamps className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
              {WORKFLOW_STEPS.map((step, idx) => {
                const Icon = step.icon;
                const active = selectedIdx === idx;
                return (
                  <div key={step.id} data-wf-stamp className="inline-flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedIdx(idx)}
                      className={`inline-flex items-center gap-2 rounded-sm border-[1.5px] border-[#141414] px-3.5 py-2 text-xs font-bold tracking-tight transition-transform whitespace-nowrap ${
                        step.color
                      } ${
                        active
                          ? '-translate-y-0.5 shadow-[3px_3px_0_#141414]'
                          : 'shadow-[2px_2px_0_#141414] hover:-translate-y-0.5'
                      }`}
                    >
                      <span>{step.label}</span>
                    </button>
                    <button
                      type="button"
                      aria-label={`Open ${step.label}`}
                      onClick={() => setSelectedIdx(idx)}
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-sm border-[1.5px] border-[#141414] ${step.color} shadow-[2px_2px_0_#141414]`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Active Step Explanation Note */}
            <div
              ref={stepNoteRef}
              className="w-full max-w-md rounded-md border-[1.5px] border-[#141414] bg-white px-4 py-3 text-left shadow-[3px_3px_0_#141414]"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono-tabular text-[11px] font-bold uppercase tracking-wider text-[#2563EB]">
                  STEP {activeStep.id} · {activeStep.title}
                </p>
                <button
                  type="button"
                  onClick={startEmptyBatch}
                  className="inline-flex items-center gap-1 font-mono-tabular text-[11px] font-bold text-[#141414] hover:text-[#2563EB] whitespace-nowrap"
                >
                  <span>Launch</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-[#52525B]">
                {activeStep.description}
              </p>
            </div>
          </div>

          {/* Right Tilted Masking-Taped Polaroid Frame */}
          <div data-wf-card className="lg:col-span-3 flex justify-center">
            <div className="relative w-56 rotate-3 rounded-[2px] border border-[#141414]/25 bg-white p-2.5 pb-4 shadow-[0_12px_26px_rgba(0,0,0,0.14)]">
              <span
                aria-hidden="true"
                className="masking-tape absolute -left-3 -top-2 h-4 w-10 -rotate-12"
              />
              <span
                aria-hidden="true"
                className="masking-tape absolute -right-3 -top-2.5 h-4 w-12 rotate-12"
              />

              <div className="relative h-44 w-full overflow-hidden rounded-[2px] bg-[#1B2226] p-3 flex flex-col justify-center items-center">
                {!rightErr && (
                  <img
                    src={wideBackdrop}
                    alt=""
                    aria-hidden="true"
                    onError={() => setRightErr(true)}
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-85"
                  />
                )}
                <div className="relative w-full rounded-[2px] border border-[#D8D1C5] bg-[#FBFBF8] p-3 text-center shadow-md">
                  <p className="font-mono-tabular text-[7px] tracking-[0.2em] text-[#52525B]">
                    AUTO-FIT FIELD
                  </p>
                  <div className="mt-1.5 border border-dashed border-[#2563EB] bg-[#2563EB]/10 px-2 py-1">
                    <p className="font-serif-editorial text-sm italic text-[#141414]">
                      {'{{name}}'}
                    </p>
                  </div>
                  <p className="mt-1.5 font-mono-tabular text-[7px] text-[#52525B]">
                    BATCH ZIP EXPORT
                  </p>
                </div>
              </div>

              <p className="mt-2.5 text-center font-mono-tabular text-[10px] text-[#52525B]">
                local merge
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

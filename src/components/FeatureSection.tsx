import gsap from 'gsap';
import {
  ArrowRight,
  Check,
  ClipboardList,
  Eye,
  FileSpreadsheet,
  Link2,
  Table2,
  Timer,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useBatchWorkspace } from '../hooks/useBatchWorkspace';

const SAMPLE_RECIPIENTS = [
  { name: 'Alex Morgan', role: 'Workshop Speaker', date: 'Nov 14, 2026' },
  { name: 'Jordan Lee', role: 'Design Lead', date: 'Nov 14, 2026' },
  { name: 'Sam Rivera', role: 'Program Fellow', date: 'Nov 14, 2026' },
  { name: 'Taylor Kim', role: 'Best Capstone', date: 'Nov 14, 2026' },
] as const;

const IMPORT_TYPES = [
  {
    id: 'csv',
    label: 'CSV / Excel',
    formats: '.csv · .xlsx · .xls',
    icon: FileSpreadsheet,
    accent: '#2563EB',
    iconColor: '#FFFFFF',
    summary: 'Drop any spreadsheet file; headers auto-map to certificate fields.',
  },
  {
    id: 'paste',
    label: 'Paste names',
    formats: 'One per line · Comma or tab',
    icon: ClipboardList,
    accent: '#F6C33E',
    iconColor: '#141414',
    summary: 'Paste rosters straight from Slack, Notion, Docs, or email.',
  },
  {
    id: 'sheets',
    label: 'Google Sheets',
    formats: 'Viewer-shared link',
    icon: Link2,
    accent: '#1FA971',
    iconColor: '#FFFFFF',
    summary: 'Fetch any public Google Sheet tab directly without downloading.',
  },
  {
    id: 'manual',
    label: 'Manual table',
    formats: 'Inline browser grid',
    icon: Table2,
    accent: '#EA580C',
    iconColor: '#FFFFFF',
    summary: 'Type or fix recipient rows right inside the local workspace.',
  },
] as const;

export function FeatureSection() {
  const { startEmptyBatch } = useBatchWorkspace();
  const [selectedRowIdx, setSelectedRowIdx] = useState(0);
  const [showRoleField, setShowRoleField] = useState(true);
  const [certCount, setCertCount] = useState(120);

  const previewStageRef = useRef<HTMLDivElement | null>(null);
  const manualValRef = useRef<HTMLSpanElement | null>(null);
  const certlyValRef = useRef<HTMLSpanElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const animatedNumbers = useRef({ manual: 240, certly: 5 });

  const manualMinutes = Math.round(certCount * 2);
  const certlyMinutes = Math.max(3, Math.round(4 + (certCount * 0.25) / 60));
  const speedRatioPct = Math.max(4, Math.min(100, Math.round((certlyMinutes / manualMinutes) * 100)));

  const formatDuration = (mins: number) => {
    const rounded = Math.round(mins);
    if (rounded < 60) return `${rounded} min`;
    const hours = Math.floor(rounded / 60);
    const rem = rounded % 60;
    return rem === 0 ? `${hours} hr` : `${hours} hr ${rem} min`;
  };

  useEffect(() => {
    const node = previewStageRef.current;
    if (!node) return;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        node,
        { opacity: 0.45, y: 10, scale: 0.985 },
        { opacity: 1, y: 0, scale: 1, duration: 0.26, ease: 'power2.out', clearProps: 'transform,opacity' }
      );
    });
    return () => mm.revert();
  }, [selectedRowIdx, showRoleField]);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.to(animatedNumbers.current, {
        manual: manualMinutes,
        certly: certlyMinutes,
        duration: 0.34,
        ease: 'power2.out',
        onUpdate: () => {
          if (manualValRef.current) {
            manualValRef.current.textContent = `~${formatDuration(animatedNumbers.current.manual)}`;
          }
          if (certlyValRef.current) {
            certlyValRef.current.textContent = `~${formatDuration(animatedNumbers.current.certly)}`;
          }
        },
      });
      if (barRef.current) {
        gsap.to(barRef.current, {
          width: `${speedRatioPct}%`,
          duration: 0.34,
          ease: 'power2.out',
        });
      }
    });

    mm.add('(prefers-reduced-motion: reduce)', () => {
      if (manualValRef.current) manualValRef.current.textContent = `~${formatDuration(manualMinutes)}`;
      if (certlyValRef.current) certlyValRef.current.textContent = `~${formatDuration(certlyMinutes)}`;
      if (barRef.current) barRef.current.style.width = `${speedRatioPct}%`;
    });

    return () => mm.revert();
  }, [manualMinutes, certlyMinutes, speedRatioPct]);

  const activeRecipient = SAMPLE_RECIPIENTS[selectedRowIdx] ?? SAMPLE_RECIPIENTS[0];

  return (
    <section id="capabilities" className="px-4 py-8 sm:px-6 lg:px-8 sm:py-12 overflow-hidden">
      <div className="mx-auto max-w-7xl space-y-12">
        {/* SECTION 01: Import List */}
        <div data-folder-reveal>
          <div className="flex items-end">
            <div className="folder-tab-left inline-flex items-center gap-2 bg-[#2563EB] px-4 py-2.5 pr-7 sm:px-6 sm:pr-9 font-mono-tabular text-[11px] font-bold tracking-wider text-white whitespace-nowrap shrink-0">
              <span>01. IMPORT LIST</span>
            </div>
          </div>

          <div className="border-t-2 border-[#2563EB] bg-[#141414] text-white px-5 py-8 sm:px-10 sm:py-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-xl space-y-2.5">
                <p className="font-mono-tabular text-xs font-medium text-zinc-400">
                  Step 02 · Participant List
                </p>
                <h2
                  data-scroll-text
                  className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-[1.12]"
                  style={{ textWrap: 'balance' }}
                >
                  Start with the list you already have.
                </h2>
                <p className="text-sm sm:text-[15px] leading-relaxed text-zinc-300">
                  Import participants from files, plain text, or Google Sheets—parsed locally in your browser with zero server uploads.
                </p>
              </div>

              <button
                type="button"
                onClick={startEmptyBatch}
                className="inline-flex min-h-[42px] items-center gap-2 self-start sm:self-end rounded-sm bg-[#2563EB] px-5 py-2.5 text-xs font-bold tracking-wide text-white hover:bg-[#1D4ED8] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>Import your list</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div data-import-grid className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {IMPORT_TYPES.map((type, idx) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    type="button"
                    data-import-card
                    onClick={startEmptyBatch}
                    className="group flex flex-col justify-between rounded-sm border border-zinc-700 bg-[#1B1D20] p-5 text-left transition-all duration-200 hover:-translate-y-1.5 hover:border-[#F6C33E] hover:bg-[#202327] hover:shadow-[4px_4px_0_#F6C33E] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F6C33E]"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-[#141414] transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-6"
                          style={{ backgroundColor: type.accent, color: type.iconColor }}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="font-mono-tabular text-[11px] text-zinc-400 tabular-nums">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-display text-base font-bold text-white group-hover:text-[#F6C33E] transition-colors">
                          {type.label}
                        </h3>
                        <p className="font-mono-tabular text-[11px] text-zinc-400">
                          {type.formats}
                        </p>
                      </div>

                      <p className="text-xs leading-relaxed text-zinc-300">
                        {type.summary}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* SECTION 02: Live Preview */}
        <div id="live-preview-section" data-folder-reveal>
          <div className="flex items-end">
            <div className="folder-tab-left inline-flex items-center gap-2 bg-[#1FA971] px-4 py-2.5 pr-7 sm:px-6 sm:pr-9 font-mono-tabular text-[11px] font-bold tracking-wider text-white whitespace-nowrap shrink-0">
              <Eye className="h-3.5 w-3.5 shrink-0" />
              <span>02. LIVE PREVIEW</span>
            </div>
          </div>

          <div className="border-[1.5px] border-[#141414] border-t-2 border-t-[#1FA971] bg-[#F3F1EA] text-[#141414] px-4 py-7 sm:px-10 sm:py-10 shadow-[4px_4px_0_#141414]">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
              {/* Left Recipient Inspector Controls */}
              <div className="lg:col-span-5 space-y-5">
                <div className="flex items-center gap-2 font-mono-tabular text-[11px] font-semibold tracking-wider text-[#52525B]">
                  <span>Step 03 · Instant field binding</span>
                </div>

                <h2
                  data-scroll-text
                  className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-[#141414] leading-[1.1]"
                  style={{ textWrap: 'balance' }}
                >
                  Every row fills the exact same layout.
                </h2>

                <p className="text-sm leading-relaxed text-[#52525B]">
                  Switch between participants to inspect how your imported columns populate typography, role tags, and dates directly on the certificate before exporting.
                </p>

                <div className="space-y-3 rounded-sm border-[1.5px] border-[#141414] bg-white p-4 shadow-[3px_3px_0_#141414]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono-tabular text-[11px] font-bold tracking-wider text-[#52525B]">
                      ACTIVE RECIPIENT ({selectedRowIdx + 1} OF {SAMPLE_RECIPIENTS.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowRoleField((prev) => !prev)}
                      className={`inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1 font-mono-tabular text-[10px] font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        showRoleField
                          ? 'border-[#141414] bg-[#C8EFE0] text-[#141414]'
                          : 'border-[#141414]/25 bg-[#FBFBF8] text-[#52525B] hover:text-[#141414]'
                      }`}
                    >
                      {showRoleField && <Check className="h-3 w-3 text-[#1FA971]" />}
                      <span>Role field</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {SAMPLE_RECIPIENTS.map((person, idx) => (
                      <button
                        key={person.name}
                        type="button"
                        onClick={() => setSelectedRowIdx(idx)}
                        className={`truncate rounded-sm border px-2.5 py-2 text-left text-xs font-semibold transition-colors cursor-pointer ${
                          idx === selectedRowIdx
                            ? 'border-[#141414] bg-[#141414] text-white'
                            : 'border-[#141414]/20 bg-[#FBFBF8] text-[#141414] hover:border-[#141414]'
                        }`}
                      >
                        {person.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={startEmptyBatch}
                    className="inline-flex items-center gap-2 rounded-sm border-[1.5px] border-[#141414] bg-[#1FA971] px-4 py-2.5 font-mono-tabular text-xs font-bold tracking-wider text-white hover:bg-[#178E5E] transition-colors shadow-[2px_2px_0_#141414] whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>OPEN DESIGN STUDIO</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Right Live Certificate Preview */}
              <div className="lg:col-span-7">
                <div className="relative mx-auto max-w-xl pt-2">
                  <span
                    aria-hidden="true"
                    className="masking-tape absolute left-3 top-0 z-20 h-4 w-12 -rotate-6"
                  />
                  <span
                    aria-hidden="true"
                    className="masking-tape absolute right-3 top-0 z-20 h-4 w-12 rotate-6"
                  />

                  <div className="studio-grid-bg rounded-sm border border-[#141414] p-4 sm:p-6 shadow-2xl">
                    <div ref={previewStageRef} className="space-y-3">
                      <div className="flex items-center justify-between rounded-sm border border-zinc-700 bg-[#141414] px-3 py-2 font-mono-tabular text-[10px] text-zinc-300">
                        <span>
                          Template: <strong className="text-white">Certificate of Appreciation</strong>
                        </span>
                        <span>
                          Recipient{' '}
                          <strong className="text-[#F6C33E]">
                            {selectedRowIdx + 1}/{SAMPLE_RECIPIENTS.length}
                          </strong>
                        </span>
                      </div>

                      <div className="rounded-sm border-[1.5px] border-[#141414] bg-[#F7F3EA] p-2.5 sm:p-3.5 text-center text-[#141414] shadow-[4px_4px_0_#141414]">
                        <div className="relative w-full overflow-hidden rounded-[2px] border border-[#141414]/25 bg-white">
                          <img
                            src="/assets/aistudio/Minimal_Abstract_Beige_and_White_Certificate_of_Appreciation_05e0b24b.png"
                            alt="Live studio certificate preview"
                            className="block w-full h-auto select-none pointer-events-none"
                          />
                          {/* Dynamic Name Field */}
                          <div
                            style={{ left: '22%', top: '39.5%', width: '56%' }}
                            className="absolute border border-dashed border-[#2563EB] bg-[#2563EB]/10 px-2 py-0.5 text-center"
                          >
                            <p className="truncate font-serif-editorial text-base sm:text-xl italic font-semibold text-[#141414] leading-tight">
                              {activeRecipient.name || 'Recipient Name'}
                            </p>
                          </div>

                          {/* Dynamic Role Field */}
                          {showRoleField && (
                            <div
                              style={{ left: '30%', top: '48.8%', width: '40%' }}
                              className="absolute border border-dashed border-[#1FA971] bg-[#1FA971]/10 px-2 py-0.5 text-center"
                            >
                              <p className="truncate font-mono-tabular text-[8px] sm:text-[9px] font-semibold uppercase tracking-wider text-[#141414] leading-none">
                                {activeRecipient.role || 'Participant'}
                              </p>
                            </div>
                          )}

                          {/* Dynamic Date Field */}
                          <div
                            style={{ left: '14%', top: '73%', width: '20%' }}
                            className="absolute border border-dashed border-[#2563EB]/70 bg-[#2563EB]/8 px-1 py-0.5 text-center"
                          >
                            <p className="truncate font-mono-tabular text-[8px] sm:text-[9px] font-semibold text-[#141414] leading-none">
                              {activeRecipient.date}
                            </p>
                          </div>

                          {/* Signature Label */}
                          <div
                            style={{ left: '66%', top: '72.5%', width: '20%' }}
                            className="absolute px-1 py-0.5 text-center"
                          >
                            <p className="truncate font-serif-editorial text-[10px] sm:text-xs italic text-[#141414]/85 leading-none">
                              CertBee Host
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 03: Marigold Batch Speed Estimator */}
        <div data-folder-reveal>
          <div className="flex justify-center">
            <div className="folder-tab-center inline-flex items-center gap-2 bg-[#F6C33E] px-7 py-2 font-mono-tabular text-[11px] font-bold tracking-wider text-[#141414]">
              <span>✦ BATCH SPEED</span>
            </div>
          </div>

          <div className="bg-[#F6C33E] text-[#141414] px-4 py-7 sm:px-10 sm:py-10">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-5 space-y-2.5">
                <div className="inline-flex items-center gap-2 font-mono-tabular text-[11px] font-bold tracking-wider text-[#141414]">
                  <Timer className="h-4 w-4" />
                  <span>ESTIMATOR</span>
                </div>
                <h3
                  data-scroll-text
                  className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#141414]"
                  style={{ textWrap: 'balance' }}
                >
                  More names. Not more name edits.
                </h3>
                <p data-scroll-text className="text-xs sm:text-sm leading-relaxed text-[#141414]/80">
                  Illustrative time estimate (~2 min manual slide edits per person vs. one-time field setup and local browser export).
                </p>
              </div>

              <div className="lg:col-span-7 rounded-md border-[1.5px] border-[#141414] bg-[#FBFBF8] p-5 sm:p-6 shadow-[4px_4px_0_#141414] space-y-5">
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between text-xs">
                    <label htmlFor="batch-size-slider" className="font-bold text-[#141414]">
                      Number of certificates
                    </label>
                    <span className="font-mono-tabular text-xl font-extrabold text-[#2563EB]">
                      {certCount}
                    </span>
                  </div>
                  <input
                    id="batch-size-slider"
                    type="range"
                    min={10}
                    max={1000}
                    step={10}
                    value={certCount}
                    onChange={(e) => setCertCount(Number(e.target.value))}
                    className="w-full accent-[#141414] cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 border-t border-[#141414]/15 pt-4">
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-[#52525B]">Manual edits</span>
                    <p>
                      <span
                        ref={manualValRef}
                        className="font-mono-tabular text-xl font-bold text-[#141414]"
                      >
                        ~{formatDuration(manualMinutes)}
                      </span>
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-[#2563EB]">CertBee local batch</span>
                    <p>
                      <span
                        ref={certlyValRef}
                        className="font-mono-tabular text-xl font-bold text-[#2563EB]"
                      >
                        ~{formatDuration(certlyMinutes)}
                      </span>
                    </p>
                    <div className="h-2 w-full rounded-full border border-[#141414] bg-white overflow-hidden">
                      <div
                        ref={barRef}
                        className="h-full bg-[#141414]"
                        style={{ width: `${speedRatioPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import {
  ArrowRight,
  Check,
  FileSpreadsheet,
  FileText,
  FolderArchive,
} from 'lucide-react';
import { useBatchWorkspace } from '../hooks/useBatchWorkspace';

const SAMPLE_PREVIEW_ROWS = [
  { name: 'Aarav Kumar', role: 'Winner', date: 'Nov 15, 2026', file: 'Certificate_Aarav_Kumar.pdf' },
  { name: 'Meera Nair', role: 'Speaker', date: 'Nov 15, 2026', file: 'Certificate_Meera_Nair.pdf' },
  { name: 'Jordan Lee', role: 'Participant', date: 'Nov 15, 2026', file: 'Certificate_Jordan_Lee.pdf' },
] as const;

export function Hero() {
  const { startEmptyBatch, loadSampleBatch } = useBatchWorkspace();

  return (
    <section className="px-4 pt-12 pb-12 sm:px-6 lg:px-8 sm:pt-16 sm:pb-14">
      <div className="mx-auto max-w-5xl flex flex-col items-center text-center">
        {/* Clear High-Contrast Objection Killer */}
        <div
          data-hero-stagger
          className="mb-6 inline-flex flex-wrap items-center justify-center gap-2 rounded-lg border-[1.5px] border-[#12151E] bg-white px-4 py-1.5 text-xs sm:text-sm font-semibold text-[#12151E] shadow-[2px_2px_0_#12151E]"
        >
          <span>Free</span>
          <span aria-hidden="true" className="text-[#4B5263]">·</span>
          <span>No watermark</span>
          <span aria-hidden="true" className="text-[#4B5263]">·</span>
          <span>Runs in your browser</span>
        </div>

        {/* Display Headline */}
        <h1
          data-hero-stagger
          className="font-display text-4xl sm:text-[56px] font-bold tracking-[-0.03em] text-[#12151E] leading-[1.06]"
          style={{ textWrap: 'balance' }}
        >
          One design.
          <br />
          <span className="inline-block mt-1 rounded-lg border-[1.5px] border-[#12151E] bg-[#F6C844] px-3 py-0.5 text-[#12151E] shadow-[3px_3px_0_#12151E]">
            Every certificate.
          </span>
        </h1>

        {/* Concise Subcopy + Dedicated Ambassador Line */}
        <div data-hero-stagger className="mt-6 max-w-xl space-y-2">
          <p className="text-base sm:text-lg font-normal leading-relaxed text-[#4B5263]">
            Upload your certificate template, import a CSV or Excel sheet, and export personalized PDFs in one ZIP.
          </p>
          <p className="text-sm sm:text-base font-semibold text-[#12151E]">
            Built by a Google Student Ambassador for ambassador programs, clubs, and hackathons.
          </p>
        </div>

        {/* Primary & Secondary Actions */}
        <div data-hero-stagger className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          <button
            type="button"
            onClick={startEmptyBatch}
            className="inline-flex h-11 items-center gap-2 rounded-lg border-[1.5px] border-[#12151E] bg-[#12151E] px-5 text-sm font-semibold text-white shadow-[3px_3px_0_#F6C844] hover:bg-[#1E2333] active:translate-x-[1px] active:translate-y-[1px] transition-[background-color,transform] duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#12151E]"
          >
            <span>Start a batch</span>
            <ArrowRight className="h-4 w-4 text-[#F6C844]" strokeWidth={1.75} />
          </button>

          <button
            type="button"
            onClick={loadSampleBatch}
            className="inline-flex h-11 items-center gap-2 rounded-lg border-[1.5px] border-[#12151E] bg-white px-5 text-sm font-semibold text-[#12151E] shadow-[3px_3px_0_#12151E] hover:bg-[#F3F1EA] active:translate-x-[1px] active:translate-y-[1px] transition-[background-color,transform] duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#12151E]"
          >
            <span>Try with sample data</span>
          </button>
        </div>

        {/* Tactile Print-Studio Workbench Visual: CSV -> Certificate Specimen + ZIP */}
        <div
          data-hero-stagger
          className="mt-10 w-full rounded-2xl border-[1.5px] border-[#12151E] bg-[#F3F1EA] p-4 sm:p-6 text-left shadow-[5px_5px_0_#12151E]"
        >
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-center">
            {/* CSV / Excel Roster Card */}
            <div className="lg:col-span-5 rounded-xl border-[1.5px] border-[#12151E] bg-white overflow-hidden shadow-[3px_3px_0_#12151E]">
              <div className="flex items-center justify-between border-b-[1.5px] border-[#12151E] bg-[#FAF9F5] px-4 py-2.5 text-xs">
                <span className="inline-flex items-center gap-2 font-semibold text-[#12151E]">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-[#12151E] bg-[#2563EB] text-white">
                    <FileSpreadsheet className="h-3.5 w-3.5" strokeWidth={1.75} />
                  </span>
                  <span>participants.csv</span>
                </span>
                <span className="font-mono-tabular text-[11px] text-[#6B7280]">CSV · Excel · Sheets</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#12151E]/15 text-[#6B7280]">
                      <th className="px-4 py-2.5 font-semibold">Name</th>
                      <th className="px-4 py-2.5 font-semibold">Role</th>
                      <th className="px-4 py-2.5 font-semibold text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#12151E]/10 text-[#12151E]">
                    {SAMPLE_PREVIEW_ROWS.map((row) => (
                      <tr key={row.name} className="h-10">
                        <td className="px-4 py-2 font-semibold whitespace-nowrap">{row.name}</td>
                        <td className="px-4 py-2 text-[#4B5263] whitespace-nowrap">{row.role}</td>
                        <td className="px-4 py-2 text-right font-mono-tabular tabular-nums text-[11px] text-[#6B7280] whitespace-nowrap">
                          {row.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Crisp Transformation Connector */}
            <div className="lg:col-span-1 flex items-center justify-center">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border-[1.5px] border-[#12151E] bg-[#F6C844] text-[#12151E] shadow-[2px_2px_0_#12151E] rotate-90 lg:rotate-0">
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
              </span>
            </div>

            {/* Rendered Specimen Thumbnail + ZIP Archive */}
            <div className="lg:col-span-6 rounded-xl border-[1.5px] border-[#12151E] bg-white p-4 shadow-[3px_3px_0_#12151E]">
              <div className="flex items-center justify-between border-b-[1.5px] border-[#12151E] pb-2.5 mb-4 text-xs">
                <span className="inline-flex items-center gap-2 font-semibold text-[#12151E]">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-[#12151E] bg-[#10B981] text-white">
                    <FolderArchive className="h-3.5 w-3.5" strokeWidth={1.75} />
                  </span>
                  <span>certificates_batch.zip</span>
                </span>
                <span className="font-mono-tabular tabular-nums text-[11px] font-medium text-[#4B5263]">
                  3 PDF files
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                {/* Uploaded Finished Certificate Specimen */}
                <div className="sm:col-span-5">
                  <div className="overflow-hidden rounded-lg border-[1.5px] border-[#12151E] bg-[#FAF9F5] shadow-[2px_2px_0_#12151E]">
                    <img
                      src="/assets/aistudio/Colorful_Abstract_Painting_Art_Completion_Certificate_4fe08b87.png"
                      alt="Generated certificate for Aarav Kumar inside certificates_batch.zip"
                      className="block aspect-[16/11.3] w-full object-cover"
                    />
                  </div>
                </div>

                {/* Unclipped Clean PDF Output Rows */}
                <div className="sm:col-span-7">
                  <ul className="divide-y divide-[#12151E]/10 text-xs">
                    {SAMPLE_PREVIEW_ROWS.map((row) => (
                      <li
                        key={row.file}
                        className="flex h-9 items-center justify-between gap-2"
                      >
                        <span className="inline-flex items-center gap-2 min-w-0 font-mono-tabular text-[11px] font-medium text-[#12151E]">
                          <FileText className="h-4 w-4 shrink-0 text-[#4B5263]" strokeWidth={1.6} />
                          <span className="truncate">{row.file}</span>
                        </span>
                        <Check className="h-4 w-4 shrink-0 text-[#10B981]" strokeWidth={2} aria-hidden="true" />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

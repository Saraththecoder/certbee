import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRef, useState } from 'react';
import { useBatchWorkspace } from '../hooks/useBatchWorkspace';
import { usePageReveal } from '../hooks/usePageReveal';

interface BlogArticle {
  id: string;
  title: string;
  topic: string;
  date: string;
  readTime: string;
  summary: string;
  body: string[];
}

const ARTICLES: BlogArticle[] = [
  {
    id: 'print-ready-resolution',
    title: 'Why 300 DPI PNGs beat compressed JPEGs for certificate text overlays',
    topic: 'Production craft',
    date: 'Nov 2026',
    readTime: '3 min read',
    summary:
      'Small compression halos around borders and seals become obvious once crisp vector-sharp names sit over them. Here is the clean export checklist.',
    body: [
      'When designing a certificate in Figma, Canva, or Illustrator, borders, thin horizontal rules, and vector seals suffer most under lossy JPEG compression. Even at 85% quality, high-contrast ink lines on warm cream paper show subtle ringing artifacts.',
      'Exporting your static certificate background as a lossless PNG at 1920 × 1080 px (for digital sharing) or 3508 × 2480 px (for A4 300 DPI printing) keeps those borders sharp while adding only a couple megabytes inside browser memory.',
      'CertBee embeds your original PNG resolution directly into each pdf-lib page, preserving exact proportions without downscaling your artwork.',
    ],
  },
  {
    id: 'handling-long-names',
    title: 'Designing certificate name boxes that survive 32-character names',
    topic: 'Typography',
    date: 'Oct 2026',
    readTime: '4 min read',
    summary:
      'A layout centered around "Priya Sharma" breaks when "Vikramaditya Subramanian" enters the spreadsheet. Two simple rules prevent clipped PDFs.',
    body: [
      'Every event organizer eventually hits the long-name problem: you align a serif heading at 64pt for an average 12-character name, and three rows later a double-barrel surname runs right over the border.',
      'First, stretch your dynamic field bounding box to at least 65%–75% of the certificate width rather than wrapping tightly around a short sample name. Second, turn on Auto-fit in Step 03 so any name exceeding that box width scales proportionally while keeping its vertical baseline steady.',
      'Always cycle through at least three names—including your longest row—using the preview bar before downloading your ZIP.',
    ],
  },
  {
    id: 'local-privacy-batches',
    title: 'Why participant spreadsheets never need an upload to generate PDFs',
    topic: 'Privacy',
    date: 'Sep 2026',
    readTime: '3 min read',
    summary:
      'Modern browsers have everything needed to parse CSVs, measure typography, and compile multi-page PDFs locally—with no account friction.',
    body: [
      'Certificate batches almost always contain personal data: full student names, institutional email addresses, and distinction ranks. Uploading that spreadsheet to a third-party cloud server just to merge text onto a PNG is unnecessary overhead.',
      'By pairing PapaParse and SheetJS for deterministic spreadsheet parsing with pdf-lib and JSZip inside the browser, your browser acts as the complete print shop. Your draft persists locally in IndexedDB while you refine coordinates, and your finished ZIP downloads straight to disk.',
    ],
  },
];

export function Blog() {
  const { startEmptyBatch } = useBatchWorkspace();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = ARTICLES.find((a) => a.id === selectedId) ?? null;
  const mainRef = useRef<HTMLElement | null>(null);

  usePageReveal(mainRef, [selectedId]);

  return (
    <main ref={mainRef} className="min-h-[75vh]">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-8 sm:py-16 space-y-10">
        {!selected ? (
          <>
            <div data-page-reveal className="space-y-3">
              <span className="inline-block rounded-md border-[1.5px] border-[#12151E] bg-[#10B981] px-3 py-1 font-mono-tabular text-xs font-semibold text-white shadow-[2px_2px_0_#12151E]">
                Journal
              </span>
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.025em] text-[#12151E]">
                Notes on certificate craft
              </h1>
              <p className="text-base text-[#4B5263]">
                Practical notes on typography, batch preparation, and local-first document workflows.
              </p>
            </div>

            <div className="space-y-5">
              {ARTICLES.map((article) => (
                <article
                  key={article.id}
                  data-page-reveal
                  className="rounded-xl border-[1.5px] border-[#12151E] bg-white p-6 sm:p-7 space-y-3 shadow-[4px_4px_0_#12151E]"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#6B7280]">
                    <span className="font-semibold text-[#12151E]">{article.topic}</span>
                    <span aria-hidden="true">·</span>
                    <span>{article.date}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono-tabular tabular-nums">{article.readTime}</span>
                  </div>
                  <h2 className="font-display text-xl font-bold text-[#12151E]">
                    {article.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-[#4B5263]">{article.summary}</p>
                  <button
                    type="button"
                    onClick={() => setSelectedId(article.id)}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#2563EB] hover:text-[#12151E] transition-colors duration-150 cursor-pointer"
                  >
                    <span>Read article</span>
                    <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                </article>
              ))}
            </div>
          </>
        ) : (
          <article className="space-y-6">
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="inline-flex h-9 items-center gap-2 rounded-lg border-[1.5px] border-[#12151E] bg-white px-3.5 text-xs font-semibold text-[#12151E] shadow-[2px_2px_0_#12151E] hover:bg-[#F3F1EA] transition-colors duration-150 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4 text-[#12151E]" strokeWidth={1.75} />
              <span>All articles</span>
            </button>

            <div data-page-reveal className="rounded-xl border-[1.5px] border-[#12151E] bg-white p-6 sm:p-8 space-y-6 shadow-[4px_4px_0_#12151E]">
              <div className="space-y-3 border-b border-[#12151E]/15 pb-6">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#6B7280]">
                  <span className="font-semibold text-[#12151E]">{selected.topic}</span>
                  <span aria-hidden="true">·</span>
                  <span>{selected.date}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-tabular tabular-nums">{selected.readTime}</span>
                </div>
                <h1
                  className="font-display text-2xl sm:text-4xl font-bold tracking-[-0.025em] text-[#12151E]"
                  style={{ textWrap: 'balance' }}
                >
                  {selected.title}
                </h1>
              </div>

              <div className="space-y-5 text-base leading-relaxed">
                {selected.body.map((para, idx) => (
                  <p key={idx} className="text-[#4B5263]">
                    {para}
                  </p>
                ))}
              </div>

              <div className="border-t border-[#12151E]/15 pt-6">
                <button
                  type="button"
                  onClick={startEmptyBatch}
                  className="inline-flex h-10 items-center gap-2 rounded-lg border-[1.5px] border-[#12151E] bg-[#12151E] px-5 text-sm font-semibold text-white shadow-[3px_3px_0_#F6C844] hover:bg-[#1E2333] active:translate-x-[1px] active:translate-y-[1px] transition-[background-color,transform] duration-150 cursor-pointer"
                >
                  <span>Start a batch</span>
                  <ArrowRight className="h-4 w-4 text-[#F6C844]" strokeWidth={1.75} />
                </button>
              </div>
            </div>
          </article>
        )}
      </div>
    </main>
  );
}

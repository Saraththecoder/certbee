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
    topic: 'Production Craft',
    date: 'Nov 2026',
    readTime: '3 min read',
    summary:
      'Small compression halos around borders and seals become obvious once crisp vector-sharp names sit over them. Here is the clean export checklist.',
    body: [
      'When designing a certificate in Figma, Canva, or Illustrator, borders, thin horizontal rules, and vector seals suffer most under lossy JPEG compression. Even at 85% quality, high-contrast ink lines on warm cream paper show subtle ringing artifacts.',
      'Exporting your static certificate background as a lossless PNG at 1920 × 1080 px (for digital sharing) or 3508 × 2480 px (for A4 300 DPI printing) keeps those borders razor sharp while adding only a couple megabytes inside browser memory.',
      'CertBee embeds your original PNG resolution directly into each pdf-lib page, preserving exact proportions without downscaling your artwork.',
    ],
  },
  {
    id: 'handling-long-names',
    title: 'Designing certificate name boxes that gracefully survive 32-character names',
    topic: 'Typography',
    date: 'Oct 2026',
    readTime: '4 min read',
    summary:
      'A layout centered around "Priya Sharma" often breaks when "Vikramaditya Subramanian" enters the spreadsheet. Two simple rules prevent clipped PDFs.',
    body: [
      'Every event organizer eventually hits the long-name problem: you align a serif heading at 64pt for an average 12-character name, and three rows later a double-barrel surname runs right over the border.',
      'First, stretch your dynamic field bounding box to at least 65%–75% of the certificate width rather than wrapping tightly around a short sample name. Second, turn on Auto-fit in Step 03 so any name exceeding that box width scales proportionally while keeping its vertical baseline steady.',
      'Always cycle through at least three names—including your longest row—using the preview bar before downloading your ZIP.',
    ],
  },
  {
    id: 'local-privacy-batches',
    title: 'Why participant spreadsheets should never need an upload to generate PDFs',
    topic: 'Privacy',
    date: 'Sep 2026',
    readTime: '3 min read',
    summary:
      'Modern browsers have everything needed to parse CSVs, measure typography, and compile multi-page PDFs locally—with zero account friction.',
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
      <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16 space-y-10">
        {!selected ? (
          <>
            <div data-page-reveal className="space-y-3">
              <span className="inline-block rounded-sm border border-[#141414] bg-[#F6EBB8] px-2.5 py-1 font-mono-tabular text-[11px] font-semibold uppercase tracking-wider text-[#141414]">
                Notes &amp; Essays
              </span>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#141414]">
                CertBee Journal
              </h1>
              <p className="text-base text-[#52525B]">
                Practical notes on certificate typography, batch preparation, and local-first document workflows.
              </p>
            </div>

            <div className="space-y-4">
              {ARTICLES.map((article) => (
                <article
                  key={article.id}
                  data-page-reveal
                  className="rounded-sm border-[1.5px] border-[#141414] bg-white p-6 sm:p-7 space-y-3 shadow-[4px_4px_0_#141414] hover:-translate-y-0.5 transition-transform"
                >
                  <div className="flex flex-wrap items-center gap-2 font-mono-tabular text-xs text-[#52525B]">
                    <span className="rounded-sm border border-[#141414] bg-[#C8EFE0] px-2 py-0.5 font-semibold text-[#141414]">
                      {article.topic}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{article.date}</span>
                    <span aria-hidden="true">·</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h2 className="font-display text-xl font-bold text-[#141414]">
                    {article.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-[#52525B]">{article.summary}</p>
                  <button
                    type="button"
                    onClick={() => setSelectedId(article.id)}
                    className="inline-flex items-center gap-1.5 font-mono-tabular text-xs font-bold text-[#2563EB] hover:underline underline-offset-4"
                  >
                    READ ARTICLE
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </article>
              ))}
            </div>
          </>
        ) : (
          <article className="space-y-8">
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="inline-flex items-center gap-1.5 rounded-sm border-[1.5px] border-[#141414] bg-white px-3 py-1.5 font-mono-tabular text-xs font-semibold text-[#141414] hover:bg-[#F6C33E] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All articles
            </button>

            <div data-page-reveal className="rounded-sm border-[1.5px] border-[#141414] bg-white p-6 sm:p-9 space-y-6 shadow-[5px_5px_0_#141414]">
              <div className="space-y-3 border-b border-[#141414]/15 pb-6">
                <div className="flex flex-wrap items-center gap-2 font-mono-tabular text-xs text-[#52525B]">
                  <span className="rounded-sm border border-[#141414] bg-[#C8EFE0] px-2 py-0.5 font-semibold text-[#141414]">
                    {selected.topic}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{selected.date}</span>
                  <span aria-hidden="true">·</span>
                  <span>{selected.readTime}</span>
                </div>
                <h1
                  className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-[#141414]"
                  style={{ textWrap: 'balance' }}
                >
                  {selected.title}
                </h1>
              </div>

              <div className="space-y-5 text-base leading-relaxed">
                {selected.body.map((para, idx) => (
                  <p key={idx} className="text-[#52525B]">
                    {para}
                  </p>
                ))}
              </div>

              <div className="border-t border-[#141414]/15 pt-6">
                <button
                  type="button"
                  onClick={startEmptyBatch}
                  className="inline-flex items-center gap-2 rounded-sm border-[1.5px] border-[#141414] bg-[#141414] px-5 py-2.5 font-mono-tabular text-xs font-semibold tracking-wider text-white hover:bg-[#27272A] transition-colors shadow-[3px_3px_0_#2563EB]"
                >
                  TRY IT IN THE STUDIO
                  <ArrowRight className="h-4 w-4 text-[#F6C33E]" />
                </button>
              </div>
            </div>
          </article>
        )}
      </div>
    </main>
  );
}

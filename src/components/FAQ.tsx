import gsap from 'gsap';
import { ArrowRight, BookOpen, ChevronDown, HelpCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useBatchWorkspace } from '../hooks/useBatchWorkspace';

const FAQ_ITEMS = [
  {
    q: 'What template formats work best?',
    a: 'Upload a vector PDF, SVG, PNG, or JPG exported without placeholder recipient names. Vector PDFs stay crisp at any zoom; for PNG/JPG exports, use 1920 × 1080 px for digital delivery or 3508 × 2480 px at 300 DPI for print.',
  },
  {
    q: 'Which participant lists can I import?',
    a: 'Import Excel (.xlsx/.xls) workbooks, UTF-8 CSV files, pasted lines of names, or a public Google Sheets link shared as "Anyone with the link can view".',
  },
  {
    q: 'Does any participant data leave my device?',
    a: 'No. Template rendering, column mapping, PDF assembly, and ZIP packaging run inside browser memory and local IndexedDB storage.',
  },
  {
    q: 'How are long participant names handled?',
    a: 'Enable Auto-fit inside Step 03 and preview the longest name in your dataset—oversized names scale down proportionally inside their field box.',
  },
];

export function FAQ() {
  const { navigate } = useBatchWorkspace();
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const answerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = answerRef.current;
    if (!node || openIdx === null) return;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        node,
        { opacity: 0, y: -4 },
        { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out', clearProps: 'transform,opacity' }
      );
    });
    return () => mm.revert();
  }, [openIdx]);

  return (
    <section id="faq" className="px-4 py-10 sm:px-10 sm:py-14 overflow-hidden">
      <div className="mx-auto max-w-5xl space-y-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div data-faq-reveal className="lg:col-span-4 space-y-5">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-sm border-[1.5px] border-[#141414] bg-[#C8EFE0] shadow-[2px_2px_0_#141414]">
              <HelpCircle className="h-5 w-5 text-[#141414]" />
            </div>
            <div className="space-y-2">
              <h2
                data-scroll-text
                className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#141414]"
                style={{ textWrap: 'balance' }}
              >
                A few things to know.
              </h2>
              <p data-scroll-text className="text-sm leading-relaxed text-[#52525B]">
                Quick answers before you launch your certificate batch.
              </p>
            </div>

            <nav aria-label="Quick resources" className="flex flex-col items-start gap-2.5 pt-1 text-sm">
              <button
                type="button"
                onClick={() => navigate('guide')}
                className="inline-flex items-center gap-2 font-semibold text-[#2563EB] hover:underline underline-offset-4"
              >
                <BookOpen className="h-4 w-4" />
                <span>Preparation guide</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => navigate('about')}
                className="text-[#52525B] hover:text-[#141414] transition-colors"
              >
                About CertBee
              </button>
              <button
                type="button"
                onClick={() => navigate('contact')}
                className="text-[#52525B] hover:text-[#141414] transition-colors"
              >
                Contact support
              </button>
            </nav>
          </div>

          <div
            data-faq-reveal
            className="lg:col-span-8 space-y-2.5"
          >
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div
                  key={item.q}
                  className="rounded-sm border-[1.5px] border-[#141414] bg-white shadow-[3px_3px_0_#141414]"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                  >
                    <span className="flex items-center gap-3 font-display text-sm sm:text-base font-bold text-[#141414]">
                      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-sm border border-[#141414] bg-[#F6C33E] font-mono-tabular text-[11px] font-bold text-[#141414]">
                        0{idx + 1}
                      </span>
                      <span>{item.q}</span>
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-[#52525B] transition-transform duration-150 ${
                        isOpen ? 'rotate-180 text-[#141414]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div
                      ref={answerRef}
                      className="border-t border-[#141414]/15 bg-[#FBFBF8] px-5 py-4 text-sm leading-relaxed text-[#52525B]"
                    >
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

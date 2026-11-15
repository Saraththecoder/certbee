import { ArrowRight, BookOpen, ChevronDown, HelpCircle, Mail } from 'lucide-react';
import React, { useState } from 'react';
import { getRoutePath, useBatchWorkspace } from '../hooks/useBatchWorkspace';

const FAQ_ITEMS = [
  {
    q: 'Does it handle long names?',
    a: 'Yes. Turn on Auto-fit in Step 03 and drag the text box wide across your template. Any name that exceeds the box scales down proportionally to stay inside your margins, and you can preview the longest name in your sheet before exporting.',
  },
  {
    q: 'Does it support Telugu, Hindi, or other non-English names?',
    a: 'Yes. Standard PDF fonts only cover English ASCII glyphs, so CertBee renders Telugu, Hindi (Devanagari), and other complex scripts with native browser shaping so ligatures and matras stay intact. You can also upload custom .ttf or .otf fonts in Step 03.',
  },
  {
    q: 'What is the print quality?',
    a: 'Vector PDF and SVG templates keep borders, logos, and typed names sharp at any print size. For PNG or JPG artwork, export at 3508 × 2480 px (300 DPI for A4) and CertBee embeds that full resolution into each PDF.',
  },
  {
    q: 'Why is it free, and what is the catch?',
    a: 'None. I built it for my own events as a Google Student Ambassador. Because all PDF and ZIP generation runs inside your browser tab instead of backend servers, there are no accounts, no watermarks, and participant lists never reach our servers (optional Google Sheets links fetch directly from Google in your browser).',
  },
  {
    q: 'How many certificates can I export in one batch?',
    a: 'Because processing runs inside browser memory, dozens up to ~200–300 PDFs bundle smoothly into one ZIP archive. For 500 or more participants, split your CSV into batches of ~200 rows.',
  },
];

export function FAQ() {
  const { navigate } = useBatchWorkspace();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const handleNav = (e: React.MouseEvent, target: 'guide' | 'about' | 'contact') => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(target);
  };

  return (
    <section id="faq" data-faq-section className="px-4 py-12 sm:px-6 lg:px-8 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div data-faq-aside className="lg:col-span-4 space-y-4">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border-[1.5px] border-[#12151E] bg-[#D1FAE5] text-[#059669] shadow-[2px_2px_0_#12151E]">
              <HelpCircle className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
            </span>

            <div className="space-y-2">
              <h2
                className="font-display text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-[#12151E]"
                style={{ textWrap: 'balance' }}
              >
                A few things to know.
              </h2>
              <p className="text-sm leading-relaxed text-[#4B5263]">
                Quick answers on long names, Indian and non-English scripts, print quality, and batch limits.
              </p>
            </div>

            <nav aria-label="Helpful links" className="flex flex-col items-start gap-2.5 pt-2 text-sm">
              <a
                href={getRoutePath('guide')}
                onClick={(e) => handleNav(e, 'guide')}
                className="group inline-flex items-center gap-2 font-semibold text-[#2563EB] hover:text-[#12151E] transition-colors duration-150"
              >
                <BookOpen className="h-4 w-4" strokeWidth={1.75} />
                <span>Preparation guide</span>
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
                  strokeWidth={1.75}
                />
              </a>
              <a
                href={getRoutePath('about')}
                onClick={(e) => handleNav(e, 'about')}
                className="text-sm font-medium text-[#4B5263] hover:text-[#12151E] transition-colors duration-150"
              >
                About CertBee
              </a>
              <a
                href={getRoutePath('contact')}
                onClick={(e) => handleNav(e, 'contact')}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#4B5263] hover:text-[#12151E] transition-colors duration-150"
              >
                <Mail className="h-4 w-4" strokeWidth={1.75} />
                <span>Ask a question</span>
              </a>
            </nav>
          </div>

          <div className="lg:col-span-8 space-y-3">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div
                  key={item.q}
                  data-faq-item
                  className="rounded-xl border-[1.5px] border-[#12151E] bg-white shadow-[3px_3px_0_#12151E] overflow-hidden"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-[#FAF9F5] transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#12151E]"
                  >
                    <span className="flex items-center gap-3 font-display text-sm sm:text-base font-semibold text-[#12151E]">
                      <span className="inline-flex h-6 w-7 shrink-0 items-center justify-center rounded border border-[#12151E] bg-[#F6C844] font-mono-tabular tabular-nums text-[11px] font-bold text-[#12151E]">
                        0{idx + 1}
                      </span>
                      <span>{item.q}</span>
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-[#12151E] transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      strokeWidth={1.75}
                    />
                  </button>

                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t border-[#12151E]/15 bg-[#FAF9F5] px-5 py-4 text-sm leading-relaxed text-[#4B5263]">
                        {item.a}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

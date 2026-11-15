import { ArrowRight, BookOpen, ChevronDown, HelpCircle, Mail } from 'lucide-react';
import React, { useState } from 'react';
import { getRoutePath, useBatchWorkspace } from '../hooks/useBatchWorkspace';
import { HOME_FAQ_ITEMS } from '../seo/faqData';

export function FAQ() {
  const { navigate } = useBatchWorkspace();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const handleNav = (
    e: React.MouseEvent,
    target: 'guide' | 'about' | 'contact' | 'privacy' | 'features'
  ) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(target);
  };

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      data-faq-section
      className="px-4 py-12 sm:px-6 lg:px-8 sm:py-16"
    >
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div data-faq-aside className="lg:col-span-4 space-y-4">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border-[1.5px] border-[#12151E] bg-[#D1FAE5] text-[#059669] shadow-[2px_2px_0_#12151E]">
              <HelpCircle className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
            </span>

            <div className="space-y-2">
              <h2
                id="faq-heading"
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
                <BookOpen className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                <span>Preparation guide</span>
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </a>
              <a
                href={getRoutePath('privacy')}
                onClick={(e) => handleNav(e, 'privacy')}
                className="text-sm font-medium text-[#4B5263] hover:text-[#12151E] transition-colors duration-150"
              >
                Browser-native privacy details
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
                <Mail className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                <span>Ask a question</span>
              </a>
            </nav>
          </div>

          <div className="lg:col-span-8 space-y-3">
            {HOME_FAQ_ITEMS.map((item, idx) => {
              const isOpen = openIdx === idx;
              const panelId = `home-faq-panel-${idx}`;
              const buttonId = `home-faq-btn-${idx}`;

              return (
                <div
                  key={item.q}
                  data-faq-item
                  className="rounded-xl border-[1.5px] border-[#12151E] bg-white shadow-[3px_3px_0_#12151E] overflow-hidden"
                >
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
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
                      aria-hidden="true"
                    />
                  </button>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
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

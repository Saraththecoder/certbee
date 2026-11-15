import { ArrowRight, Check, ChevronDown } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { LANDING_PAGES, LandingRouteKey } from '../data/landingPages';
import { getBlogPostPath, getRoutePath, useBatchWorkspace } from '../hooks/useBatchWorkspace';
import { usePageReveal } from '../hooks/usePageReveal';

export function LandingPage({ pageKey }: { pageKey: LandingRouteKey }) {
  const { startEmptyBatch, loadSampleBatch, navigate, navigateBlogPost } = useBatchWorkspace();
  const data = LANDING_PAGES[pageKey];
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const mainRef = useRef<HTMLElement | null>(null);

  usePageReveal(mainRef, [pageKey]);

  const handleNav = (e: React.MouseEvent, target: Parameters<typeof navigate>[0]) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(target);
  };

  return (
    <main ref={mainRef} className="min-h-[75vh]">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-8 sm:py-16 space-y-12">
        {/* Breadcrumb + Header */}
        <div data-page-reveal className="space-y-5">
          <nav aria-label="Breadcrumb" className="text-xs text-[#525866]">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <a
                  href={getRoutePath('home')}
                  onClick={(e) => handleNav(e, 'home')}
                  className="hover:text-[#12151E] underline-offset-4 hover:underline"
                >
                  Home
                </a>
              </li>
              <li aria-hidden="true">/</li>
              <li className="font-semibold text-[#12151E]" aria-current="page">
                {data.badge}
              </li>
            </ol>
          </nav>

          <span
            className="inline-block rounded-md border-[1.5px] border-[#12151E] px-3 py-1 font-mono-tabular text-xs font-semibold shadow-[2px_2px_0_#12151E]"
            style={{
              backgroundColor: data.badgeColor,
              color: data.badgeTextColor || '#12151E',
            }}
          >
            {data.badge}
          </span>

          <h1
            className="font-display text-3xl sm:text-5xl font-bold tracking-[-0.025em] text-[#12151E] leading-[1.1]"
            style={{ textWrap: 'balance' }}
          >
            {data.h1}
          </h1>

          <p className="max-w-3xl text-base sm:text-lg leading-relaxed text-[#4B5263]">
            {data.intro}
          </p>

          <div className="flex flex-wrap items-center gap-3.5 pt-1">
            <button
              type="button"
              onClick={startEmptyBatch}
              className="group inline-flex h-11 items-center gap-2 rounded-lg border-[1.5px] border-[#12151E] bg-[#12151E] px-5 text-sm font-semibold text-white shadow-[3px_3px_0_#F6C844] hover:-translate-y-0.5 active:translate-y-0.5 hover:bg-[#1E2333] transition-[background-color,transform] duration-150 cursor-pointer"
            >
              <span>Start a batch</span>
              <ArrowRight
                className="h-4 w-4 text-[#F6C844] transition-transform duration-150 group-hover:translate-x-0.5"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            </button>
            <button
              type="button"
              onClick={loadSampleBatch}
              className="inline-flex h-11 items-center gap-2 rounded-lg border-[1.5px] border-[#12151E] bg-white px-5 text-sm font-semibold text-[#12151E] shadow-[3px_3px_0_#12151E] hover:-translate-y-0.5 active:translate-y-0.5 hover:bg-[#F3F1EA] transition-[background-color,transform] duration-150 cursor-pointer"
            >
              <span>Try with sample data</span>
            </button>
          </div>
        </div>

        {/* Highlights Spec Grid */}
        <div data-page-reveal className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.highlights.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border-[1.5px] border-[#12151E] bg-white p-4 shadow-[3px_3px_0_#12151E] space-y-1"
            >
              <p className="font-mono-tabular text-[11px] font-semibold uppercase tracking-wider text-[#525866]">
                {item.label}
              </p>
              <p className="text-sm font-bold text-[#12151E]">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Verified Product Screenshot */}
        <figure
          data-page-reveal
          className="overflow-hidden rounded-2xl border-[1.5px] border-[#12151E] bg-white shadow-[5px_5px_0_#12151E]"
        >
          <img
            src={data.screenshot}
            alt={data.screenshotAlt}
            width={data.screenshot.includes('sample') ? 900 : 1280}
            height={data.screenshot.includes('sample') ? 636 : 585}
            loading="lazy"
            decoding="async"
            className="block w-full h-auto"
          />
          <figcaption className="border-t-[1.5px] border-[#12151E] bg-[#FAF9F5] px-5 py-3 text-xs text-[#4B5263]">
            {data.screenshotCaption}
          </figcaption>
        </figure>

        {/* Detailed Sections */}
        <div className="space-y-6">
          {data.sections.map((sec) => (
            <section
              key={sec.title}
              data-page-reveal
              className="rounded-xl border-[1.5px] border-[#12151E] bg-white p-6 sm:p-8 space-y-3 shadow-[4px_4px_0_#12151E]"
            >
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#12151E]">
                {sec.title}
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-[#4B5263]">{sec.body}</p>
              {sec.bullets && (
                <ul className="space-y-2 pt-2">
                  {sec.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-[#4B5263]">
                      <Check
                        className="h-4 w-4 shrink-0 text-[#10B981] mt-0.5"
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        {/* Dedicated Use-Case FAQs */}
        {data.faqs.length > 0 && (
          <section data-page-reveal aria-labelledby="landing-faq-heading" className="space-y-4">
            <h2
              id="landing-faq-heading"
              className="font-display text-2xl font-bold text-[#12151E]"
            >
              Frequently asked questions
            </h2>
            <div className="space-y-3">
              {data.faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={faq.q}
                    className="rounded-xl border-[1.5px] border-[#12151E] bg-white shadow-[3px_3px_0_#12151E] overflow-hidden"
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-[#FAF9F5] transition-colors cursor-pointer"
                    >
                      <span className="font-display text-sm sm:text-base font-semibold text-[#12151E]">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-[#12151E] transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                    {isOpen && (
                      <div className="border-t border-[#12151E]/15 bg-[#FAF9F5] px-5 py-4 text-sm leading-relaxed text-[#4B5263]">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Contextual Internal Links */}
        <section
          data-page-reveal
          aria-label="Related tutorials and workflows"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2"
        >
          <div className="rounded-xl border-[1.5px] border-[#12151E] bg-[#FAF9F5] p-6 space-y-3 shadow-[3px_3px_0_#12151E]">
            <h2 className="font-display text-base font-bold text-[#12151E]">Related tutorials</h2>
            <ul className="space-y-2 text-sm">
              {data.relatedArticles.map((art) => (
                <li key={art.slug}>
                  <a
                    href={getBlogPostPath(art.slug)}
                    onClick={(e) => {
                      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                      e.preventDefault();
                      navigateBlogPost(art.slug);
                    }}
                    className="inline-flex items-center gap-1.5 font-semibold text-[#2563EB] hover:text-[#12151E] transition-colors"
                  >
                    <span>{art.label}</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border-[1.5px] border-[#12151E] bg-[#FAF9F5] p-6 space-y-3 shadow-[3px_3px_0_#12151E]">
            <h2 className="font-display text-base font-bold text-[#12151E]">More workflows</h2>
            <ul className="space-y-2 text-sm">
              {data.relatedPages.map((pg) => (
                <li key={pg.route}>
                  <a
                    href={getRoutePath(pg.route)}
                    onClick={(e) => handleNav(e, pg.route)}
                    className="inline-flex items-center gap-1.5 font-semibold text-[#2563EB] hover:text-[#12151E] transition-colors"
                  >
                    <span>{pg.label}</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}

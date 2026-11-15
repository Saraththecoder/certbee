import { ArrowLeft, ArrowRight } from 'lucide-react';
import React, { useRef } from 'react';
import { BLOG_POSTS, getBlogPostBySlug } from '../data/blogPosts';
import { getBlogPostPath, getRoutePath, useBatchWorkspace } from '../hooks/useBatchWorkspace';
import { usePageReveal } from '../hooks/usePageReveal';

export function Blog({ slug }: { slug?: string | null }) {
  const { startEmptyBatch, navigate, navigateBlogPost } = useBatchWorkspace();
  const selected = slug ? getBlogPostBySlug(slug) ?? null : null;
  const mainRef = useRef<HTMLElement | null>(null);

  usePageReveal(mainRef, [slug]);

  const handleBlogNav = (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate('blog');
  };

  return (
    <main ref={mainRef} className="min-h-[75vh]">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-8 sm:py-16 space-y-10">
        {!selected ? (
          <>
            <div data-page-reveal className="space-y-3">
              <span className="inline-block rounded-md border-[1.5px] border-[#12151E] bg-[#10B981] px-3 py-1 font-mono-tabular text-xs font-semibold text-white shadow-[2px_2px_0_#12151E]">
                Guides &amp; Journal
              </span>
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.025em] text-[#12151E]">
                Practical guides for bulk certificates
              </h1>
              <p className="text-base text-[#4B5263]">
                Playbooks on Excel workbooks, Google Sheets, typography craft, hackathon roles, and browser-native PDF generation.
              </p>
            </div>

            <div className="space-y-5">
              {BLOG_POSTS.map((article) => (
                <article
                  key={article.slug}
                  data-page-reveal
                  className="rounded-xl border-[1.5px] border-[#12151E] bg-white p-6 sm:p-7 space-y-3 shadow-[4px_4px_0_#12151E] hover:-translate-y-0.5 transition-transform duration-150"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#525866]">
                    <span className="font-semibold text-[#12151E]">{article.topic}</span>
                    <span aria-hidden="true">·</span>
                    <time dateTime={article.publishedDate}>{article.displayDate}</time>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono-tabular tabular-nums">{article.readTime}</span>
                  </div>
                  <h2 className="font-display text-xl font-bold text-[#12151E]">
                    <a
                      href={getBlogPostPath(article.slug)}
                      onClick={(e) => {
                        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                        e.preventDefault();
                        navigateBlogPost(article.slug);
                      }}
                      className="hover:text-[#2563EB] transition-colors"
                    >
                      {article.title}
                    </a>
                  </h2>
                  <p className="text-sm leading-relaxed text-[#4B5263]">{article.summary}</p>
                  <a
                    href={getBlogPostPath(article.slug)}
                    onClick={(e) => {
                      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                      e.preventDefault();
                      navigateBlogPost(article.slug);
                    }}
                    className="group inline-flex items-center gap-2 text-xs font-semibold text-[#2563EB] hover:text-[#12151E] transition-colors duration-150"
                  >
                    <span>Read guide</span>
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </a>
                </article>
              ))}
            </div>
          </>
        ) : (
          <article className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <a
                href={getRoutePath('blog')}
                onClick={handleBlogNav}
                className="inline-flex h-9 items-center gap-2 rounded-lg border-[1.5px] border-[#12151E] bg-white px-3.5 text-xs font-semibold text-[#12151E] shadow-[2px_2px_0_#12151E] hover:bg-[#F3F1EA] transition-colors duration-150"
              >
                <ArrowLeft className="h-4 w-4 text-[#12151E]" strokeWidth={1.75} aria-hidden="true" />
                <span>All guides</span>
              </a>

              <nav aria-label="Breadcrumb" className="text-xs text-[#525866]">
                <ol className="flex items-center gap-2">
                  <li>
                    <a
                      href={getRoutePath('home')}
                      onClick={(e) => {
                        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                        e.preventDefault();
                        navigate('home');
                      }}
                      className="hover:text-[#12151E] hover:underline"
                    >
                      Home
                    </a>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li>
                    <a
                      href={getRoutePath('blog')}
                      onClick={handleBlogNav}
                      className="hover:text-[#12151E] hover:underline"
                    >
                      Blog
                    </a>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li className="font-semibold text-[#12151E]">{selected.topic}</li>
                </ol>
              </nav>
            </div>

            <div
              data-page-reveal
              className="rounded-xl border-[1.5px] border-[#12151E] bg-white p-6 sm:p-8 space-y-6 shadow-[4px_4px_0_#12151E]"
            >
              <div className="space-y-3 border-b border-[#12151E]/15 pb-6">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#525866]">
                  <span className="font-semibold text-[#12151E]">{selected.topic}</span>
                  <span aria-hidden="true">·</span>
                  <time dateTime={selected.publishedDate}>{selected.displayDate}</time>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-tabular tabular-nums">{selected.readTime}</span>
                </div>
                <h1
                  className="font-display text-2xl sm:text-4xl font-bold tracking-[-0.025em] text-[#12151E]"
                  style={{ textWrap: 'balance' }}
                >
                  {selected.title}
                </h1>
                <p className="text-base text-[#4B5263] leading-relaxed">{selected.summary}</p>
              </div>

              <figure className="overflow-hidden rounded-xl border-[1.5px] border-[#12151E] bg-[#FAF9F5]">
                <img
                  src={selected.screenshot}
                  alt={selected.screenshotAlt}
                  width={selected.screenshotWidth}
                  height={selected.screenshotHeight}
                  decoding="async"
                  className="block w-full h-auto"
                />
              </figure>

              <div className="space-y-7">
                {selected.sections.map((section) => (
                  <section key={section.heading} className="space-y-3">
                    <h2 className="font-display text-lg sm:text-xl font-bold text-[#12151E]">
                      {section.heading}
                    </h2>
                    {section.paragraphs.map((para, pIdx) => (
                      <p key={pIdx} className="text-sm sm:text-base leading-relaxed text-[#4B5263]">
                        {para}
                      </p>
                    ))}
                    {section.callout && (
                      <div className="rounded-lg border-[1.5px] border-[#12151E] bg-[#FFF4CC]/70 px-4 py-3 text-xs sm:text-sm font-medium text-[#12151E]">
                        {section.callout}
                      </div>
                    )}
                  </section>
                ))}
              </div>

              <div className="border-t border-[#12151E]/15 pt-6 flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={startEmptyBatch}
                  className="inline-flex h-10 items-center gap-2 rounded-lg border-[1.5px] border-[#12151E] bg-[#12151E] px-5 text-sm font-semibold text-white shadow-[3px_3px_0_#F6C844] hover:bg-[#1E2333] active:translate-x-[1px] active:translate-y-[1px] transition-[background-color,transform] duration-150 cursor-pointer"
                >
                  <span>Start a batch</span>
                  <ArrowRight className="h-4 w-4 text-[#F6C844]" strokeWidth={1.75} aria-hidden="true" />
                </button>

                <a
                  href={getRoutePath(selected.relatedRoute.route)}
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                    e.preventDefault();
                    navigate(selected.relatedRoute.route);
                  }}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] hover:text-[#12151E] transition-colors"
                >
                  <span>{selected.relatedRoute.label}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>

            {selected.relatedSlugs.length > 0 && (
              <div
                data-page-reveal
                className="rounded-xl border-[1.5px] border-[#12151E] bg-[#FAF9F5] p-6 space-y-3 shadow-[3px_3px_0_#12151E]"
              >
                <h2 className="font-display text-base font-bold text-[#12151E]">
                  Related tutorials
                </h2>
                <ul className="space-y-2 text-sm">
                  {selected.relatedSlugs.map((relSlug) => {
                    const rel = getBlogPostBySlug(relSlug);
                    if (!rel) return null;
                    return (
                      <li key={rel.slug}>
                        <a
                          href={getBlogPostPath(rel.slug)}
                          onClick={(e) => {
                            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                            e.preventDefault();
                            navigateBlogPost(rel.slug);
                          }}
                          className="inline-flex items-center gap-1.5 font-semibold text-[#2563EB] hover:text-[#12151E] transition-colors"
                        >
                          <span>{rel.title}</span>
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </article>
        )}
      </div>
    </main>
  );
}

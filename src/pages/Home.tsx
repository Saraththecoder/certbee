import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import { FAQ } from '../components/FAQ';
import { Hero } from '../components/Hero';
import { WorkflowSection } from '../components/WorkflowSection';
import { BLOG_POSTS } from '../data/blogPosts';
import { getBlogPostPath, getRoutePath, NavTarget, useBatchWorkspace } from '../hooks/useBatchWorkspace';

gsap.registerPlugin(ScrollTrigger);

const USE_CASE_LINKS: Array<{ route: NavTarget; title: string; summary: string }> = [
  {
    route: 'certificate-generator-from-excel',
    title: 'From Excel & CSV',
    summary: 'Drop .xlsx, .xls, or CSV spreadsheets and auto-map Name, Role, Date, and Email locally.',
  },
  {
    route: 'certificate-generator-from-google-sheets',
    title: 'From Google Sheets',
    summary: 'Load public Google Sheets tabs directly without Workspace add-ons or OAuth logins.',
  },
  {
    route: 'workshop-certificate-generator',
    title: 'Workshops & Training',
    summary: 'Paste attendance rosters, set default roles & dates, and add crisp instructor signatures.',
  },
  {
    route: 'hackathon-certificate-generator',
    title: 'Hackathons & Judges',
    summary: 'Merge Winners, Finalists, Mentors, and Participants from one template using Role columns.',
  },
  {
    route: 'student-certificate-generator',
    title: 'Students & Campus Clubs',
    summary: 'Keep student email rosters private on your device with Unicode Devanagari & Telugu support.',
  },
  {
    route: 'bulk-certificate-generator',
    title: 'Large Batches & ZIP Export',
    summary: 'Generate up to ~200–300 named PDFs locally inside one clean ZIP archive.',
  },
];

export function Home() {
  const { navigate, navigateBlogPost } = useBatchWorkspace();
  const mainRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = mainRef.current;
    if (!root) return;

    const mm = gsap.matchMedia(root);

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        '[data-hero-stagger]',
        { y: 14, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.38,
          stagger: 0.055,
          clearProps: 'transform,opacity',
        }
      )
        .fromTo(
          '[data-hero-stamp]',
          { scale: 0.94, y: 6 },
          {
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: 'back.out(1.4)',
            clearProps: 'transform',
          },
          0.14
        )
        .fromTo(
          '[data-workbench-csv]',
          { x: -12, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.32, clearProps: 'transform,opacity' },
          0.28
        )
        .fromTo(
          '[data-workbench-arrow]',
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.24, ease: 'back.out(1.6)', clearProps: 'transform,opacity' },
          0.34
        )
        .fromTo(
          '[data-workbench-zip]',
          { x: 12, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.32, clearProps: 'transform,opacity' },
          0.36
        )
        .fromTo(
          '[data-workbench-file]',
          { y: 6, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.22, stagger: 0.045, clearProps: 'transform,opacity' },
          0.42
        );

      const workflowSection = root.querySelector('[data-workflow-section]');
      if (workflowSection) {
        const heads = workflowSection.querySelectorAll('[data-workflow-head]');
        const cards = workflowSection.querySelectorAll('[data-workflow-card]');

        gsap.set(heads, { y: 14, opacity: 0 });
        ScrollTrigger.create({
          trigger: workflowSection,
          start: 'top 86%',
          once: true,
          onEnter: () => {
            gsap.to(heads, {
              y: 0,
              opacity: 1,
              duration: 0.36,
              ease: 'power3.out',
              clearProps: 'transform,opacity',
            });
          },
        });

        cards.forEach((card) => {
          gsap.set(card, { y: 16, opacity: 0 });
          ScrollTrigger.create({
            trigger: card,
            start: 'top 88%',
            once: true,
            onEnter: () => {
              gsap.to(card, {
                y: 0,
                opacity: 1,
                duration: 0.38,
                ease: 'power3.out',
                clearProps: 'transform,opacity',
              });
            },
          });
        });
      }

      const faqSection = root.querySelector('[data-faq-section]');
      if (faqSection) {
        const aside = faqSection.querySelectorAll('[data-faq-aside]');
        const items = faqSection.querySelectorAll('[data-faq-item]');

        gsap.set(aside, { y: 14, opacity: 0 });
        gsap.set(items, { y: 14, opacity: 0 });

        ScrollTrigger.create({
          trigger: faqSection,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            gsap.to(aside, {
              y: 0,
              opacity: 1,
              duration: 0.36,
              ease: 'power3.out',
              clearProps: 'transform,opacity',
            });
            gsap.to(items, {
              y: 0,
              opacity: 1,
              duration: 0.32,
              stagger: 0.05,
              delay: 0.06,
              ease: 'power3.out',
              clearProps: 'transform,opacity',
            });
          },
        });
      }

      ScrollTrigger.refresh();
    });

    return () => mm.revert();
  }, []);

  const handleNav = (e: React.MouseEvent, target: NavTarget) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(target);
  };

  return (
    <main ref={mainRef}>
      <Hero />
      <WorkflowSection />

      {/* Browser-Native Architecture, Supported Formats & Workflow Links */}
      <section aria-labelledby="capabilities-heading" className="px-4 py-10 sm:px-6 lg:px-8 sm:py-12">
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="rounded-2xl border-[1.5px] border-[#12151E] bg-white p-6 sm:p-8 shadow-[4px_4px_0_#12151E] space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b border-[#12151E]/15 pb-5">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 rounded-md border-[1.5px] border-[#12151E] bg-[#D1FAE5] px-2.5 py-1 font-mono-tabular text-xs font-semibold text-[#12151E]">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#059669]" aria-hidden="true" />
                  <span>Browser-native &amp; local-first</span>
                </span>
                <h2
                  id="capabilities-heading"
                  className="font-display text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-[#12151E]"
                >
                  Built for real event rosters and strict student privacy
                </h2>
              </div>
              <a
                href={getRoutePath('privacy')}
                onClick={(e) => handleNav(e, 'privacy')}
                className="text-xs sm:text-sm font-semibold text-[#2563EB] hover:text-[#12151E] whitespace-nowrap transition-colors"
              >
                How local processing works →
              </a>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 text-sm leading-relaxed text-[#4B5263]">
              <div className="space-y-1.5">
                <h3 className="font-display text-base font-semibold text-[#12151E]">
                  Supported certificate formats
                </h3>
                <p>
                  Upload clean PNG, JPG, SVG, or vector PDF backgrounds exported from Figma, Canva, or Illustrator—without watermarks or aspect distortion.
                </p>
              </div>
              <div className="space-y-1.5">
                <h3 className="font-display text-base font-semibold text-[#12151E]">
                  Spreadsheet &amp; script ready
                </h3>
                <p>
                  Import Excel (.xlsx, .xls), UTF-8 CSV, pasted attendee names, or public Google Sheets tabs, with Auto-fit sizing plus Hindi and Telugu support.
                </p>
              </div>
              <div className="space-y-1.5">
                <h3 className="font-display text-base font-semibold text-[#12151E]">
                  Zero server uploads
                </h3>
                <p>
                  Spreadsheet parsing, custom TTF/OTF font embedding, PDF creation, and ZIP compression run locally in browser memory with IndexedDB drafts.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 pt-2">
              {USE_CASE_LINKS.map((item) => (
                <a
                  key={item.route}
                  href={getRoutePath(item.route)}
                  onClick={(e) => handleNav(e, item.route)}
                  className="group rounded-xl border-[1.5px] border-[#12151E] bg-[#FAF9F5] p-4 hover:bg-[#FFF4CC]/60 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#12151E]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-sm font-bold text-[#12151E] group-hover:text-[#2563EB] transition-colors">
                      {item.title}
                    </h3>
                    <ArrowRight
                      className="h-3.5 w-3.5 text-[#12151E] transition-transform duration-150 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-[#4B5263]">{item.summary}</p>
                </a>
              ))}
            </div>
          </div>

          {/* Practical Tutorials Strip */}
          <div className="rounded-xl border-[1.5px] border-[#12151E] bg-[#F3F1EA] px-5 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-0.5">
              <h2 className="font-display text-base font-bold text-[#12151E]">
                Step-by-step guides &amp; preparation tutorials
              </h2>
              <p className="text-xs text-[#4B5263]">
                Practical notes on Excel formatting, 300 DPI exports, and handling 30+ character names.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
              <a
                href={getBlogPostPath(BLOG_POSTS[0].slug)}
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                  e.preventDefault();
                  navigateBlogPost(BLOG_POSTS[0].slug);
                }}
                className="text-[#2563EB] hover:text-[#12151E] transition-colors"
              >
                Excel tutorial
              </a>
              <a
                href={getBlogPostPath(BLOG_POSTS[2].slug)}
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                  e.preventDefault();
                  navigateBlogPost(BLOG_POSTS[2].slug);
                }}
                className="text-[#2563EB] hover:text-[#12151E] transition-colors"
              >
                Google Sheets guide
              </a>
              <a
                href={getRoutePath('canva-certificate-generator')}
                onClick={(e) => handleNav(e, 'canva-certificate-generator')}
                className="text-[#2563EB] hover:text-[#12151E] transition-colors"
              >
                Canva template guide
              </a>
              <a
                href={getRoutePath('blog')}
                onClick={(e) => handleNav(e, 'blog')}
                className="inline-flex items-center gap-1 rounded-md border-[1.5px] border-[#12151E] bg-white px-3 py-1.5 text-[#12151E] shadow-[2px_2px_0_#12151E] hover:bg-[#F6C844] transition-colors"
              >
                <span>Read all guides</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <FAQ />
    </main>
  );
}

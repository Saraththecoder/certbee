import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';
import { FAQ } from '../components/FAQ';
import { Hero } from '../components/Hero';
import { WorkflowSection } from '../components/WorkflowSection';

gsap.registerPlugin(ScrollTrigger);

export function Home() {
  const mainRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = mainRef.current;
    if (!root) return;

    const mm = gsap.matchMedia(root);

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Hero choreographed entrance
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        '[data-hero-stagger]',
        { y: 16, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.42,
          stagger: 0.065,
          clearProps: 'transform,opacity',
        }
      )
        .fromTo(
          '[data-hero-stamp]',
          { scale: 0.94, y: 6 },
          {
            scale: 1,
            y: 0,
            duration: 0.34,
            ease: 'back.out(1.4)',
            clearProps: 'transform',
          },
          0.16
        )
        .fromTo(
          '[data-workbench-csv]',
          { x: -14, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.36, clearProps: 'transform,opacity' },
          0.32
        )
        .fromTo(
          '[data-workbench-arrow]',
          { scale: 0.78, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.28, ease: 'back.out(1.6)', clearProps: 'transform,opacity' },
          0.38
        )
        .fromTo(
          '[data-workbench-zip]',
          { x: 14, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.36, clearProps: 'transform,opacity' },
          0.4
        )
        .fromTo(
          '[data-workbench-file]',
          { y: 8, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.26, stagger: 0.055, clearProps: 'transform,opacity' },
          0.48
        );

      // Scroll-triggered Workflow Dark Block entrance
      const workflowSection = root.querySelector('[data-workflow-section]');
      if (workflowSection) {
        const heads = workflowSection.querySelectorAll('[data-workflow-head]');
        const cards = workflowSection.querySelectorAll('[data-workflow-card]');

        gsap.set(heads, { y: 16, opacity: 0 });
        gsap.set(cards, { y: 20, opacity: 0 });

        ScrollTrigger.create({
          trigger: workflowSection,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            gsap.to(heads, {
              y: 0,
              opacity: 1,
              duration: 0.4,
              stagger: 0.06,
              ease: 'power3.out',
              clearProps: 'transform,opacity',
            });
            gsap.to(cards, {
              y: 0,
              opacity: 1,
              duration: 0.42,
              stagger: 0.075,
              delay: 0.12,
              ease: 'power3.out',
              clearProps: 'transform,opacity',
            });
          },
        });
      }

      // Scroll-triggered FAQ entrance
      const faqSection = root.querySelector('[data-faq-section]');
      if (faqSection) {
        const aside = faqSection.querySelectorAll('[data-faq-aside]');
        const items = faqSection.querySelectorAll('[data-faq-item]');

        gsap.set(aside, { y: 16, opacity: 0 });
        gsap.set(items, { y: 16, opacity: 0 });

        ScrollTrigger.create({
          trigger: faqSection,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            gsap.to(aside, {
              y: 0,
              opacity: 1,
              duration: 0.4,
              ease: 'power3.out',
              clearProps: 'transform,opacity',
            });
            gsap.to(items, {
              y: 0,
              opacity: 1,
              duration: 0.36,
              stagger: 0.06,
              delay: 0.08,
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

  return (
    <main ref={mainRef}>
      <Hero />
      <WorkflowSection />
      <FAQ />
    </main>
  );
}

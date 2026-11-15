import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';
import { BenefitsSection } from '../components/BenefitsSection';
import { FAQ } from '../components/FAQ';
import { FeatureSection } from '../components/FeatureSection';
import { Hero } from '../components/Hero';
import { WorkflowSection } from '../components/WorkflowSection';

gsap.registerPlugin(ScrollTrigger);

export function Home() {
  const mainRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = mainRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // 1. Hero subtle fade-in, letter/word kinetic reveal & highlight sweep
        const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        heroTl
          .fromTo(
            '[data-hero-stagger]',
            { y: 18, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.45,
              stagger: 0.06,
              clearProps: 'transform,opacity',
            }
          )
          .fromTo(
            '[data-hero-char]',
            { yPercent: 105, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.44,
              stagger: 0.032,
              ease: 'power4.out',
              clearProps: 'transform,opacity',
            },
            0.06
          )
          .fromTo(
            '[data-hero-word]',
            { yPercent: 110, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.5,
              stagger: 0.06,
              ease: 'power4.out',
              clearProps: 'transform,opacity',
            },
            0.16
          )
          .fromTo(
            '[data-hero-highlight]',
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 0.42,
              ease: 'power2.out',
              clearProps: 'transform',
            },
            0.38
          )
          .fromTo(
            '[data-hero-note]',
            { y: 10, scale: 0.94, opacity: 0 },
            {
              y: 0,
              scale: 1,
              opacity: 1,
              duration: 0.38,
              stagger: 0.05,
              clearProps: 'transform,opacity',
            },
            '-=0.3'
          )
          .fromTo(
            '[data-hero-badge]',
            { y: 12, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.42,
              stagger: 0.08,
              clearProps: 'transform,opacity',
            },
            '-=0.25'
          );

        // 2. Benefit cards staggered fade-up on scroll
        gsap.fromTo(
          '[data-benefit-card]',
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.48,
            stagger: 0.08,
            ease: 'power3.out',
            clearProps: 'transform,opacity',
            scrollTrigger: {
              trigger: '#benefits',
              start: 'top 88%',
              once: true,
            },
          }
        );

        // 3. Workflow cards & steps staggered fade-up on scroll
        gsap.fromTo(
          '[data-wf-card]',
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.09,
            ease: 'power3.out',
            clearProps: 'transform,opacity',
            scrollTrigger: {
              trigger: '#workflow',
              start: 'top 86%',
              once: true,
            },
          }
        );

        gsap.fromTo(
          '[data-wf-stamp]',
          { y: 18, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.42,
            stagger: 0.07,
            ease: 'power3.out',
            clearProps: 'transform,opacity',
            scrollTrigger: {
              trigger: '[data-wf-stamps]',
              start: 'top 90%',
              once: true,
            },
          }
        );

        // 4. Feature folder cards staggered fade-up on scroll
        gsap.fromTo(
          '[data-folder-reveal]',
          { y: 26, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.52,
            stagger: 0.12,
            ease: 'power3.out',
            clearProps: 'transform,opacity',
            scrollTrigger: {
              trigger: '#capabilities',
              start: 'top 86%',
              once: true,
            },
          }
        );

        // 5. FAQ & closing banner cards staggered fade-up on scroll
        gsap.fromTo(
          '[data-faq-reveal]',
          { y: 22, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.48,
            stagger: 0.09,
            ease: 'power3.out',
            clearProps: 'transform,opacity',
            scrollTrigger: {
              trigger: '#faq',
              start: 'top 88%',
              once: true,
            },
          }
        );

        // 6. Scroll-triggered kinetic text reveals across home section headings
        gsap.utils.toArray<HTMLElement>('[data-scroll-text]').forEach((el) => {
          gsap.fromTo(
            el,
            { y: 16, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.48,
              ease: 'power3.out',
              clearProps: 'transform,opacity',
              scrollTrigger: {
                trigger: el,
                start: 'top 90%',
                once: true,
              },
            }
          );
        });
      });
    }, root);

    const raf = window.requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      window.cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, []);

  return (
    <main ref={mainRef}>
      <Hero />
      <BenefitsSection />
      <WorkflowSection />
      <FeatureSection />
      <FAQ />
    </main>
  );
}

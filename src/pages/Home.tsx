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

    const mm = gsap.matchMedia(root);

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // 1. Hero entrance timeline: centerpiece, cascading letters, words, highlight & sticky notes
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      heroTl
        .fromTo(
          '[data-hero-stagger]',
          { y: 26, scale: 0.96, opacity: 0 },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 0.55,
            stagger: 0.09,
            ease: 'back.out(1.3)',
            clearProps: 'transform,opacity',
          }
        )
        .fromTo(
          '[data-hero-char]',
          { yPercent: 115, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.04,
            ease: 'back.out(1.4)',
            clearProps: 'transform,opacity',
          },
          0.08
        )
        .fromTo(
          '[data-hero-word]',
          { yPercent: 115, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.55,
            stagger: 0.08,
            ease: 'power4.out',
            clearProps: 'transform,opacity',
          },
          0.2
        )
        .fromTo(
          '[data-hero-highlight]',
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.48,
            ease: 'power2.out',
            clearProps: 'transform',
          },
          0.42
        )
        .fromTo(
          '[data-hero-note]',
          { y: 16, scale: 0.78, opacity: 0 },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 0.48,
            stagger: 0.08,
            ease: 'back.out(1.8)',
            clearProps: 'transform,opacity',
          },
          0.25
        )
        .fromTo(
          '[data-hero-badge]',
          { y: 20, scale: 0.85, opacity: 0 },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 0.5,
            stagger: 0.12,
            ease: 'back.out(1.5)',
            clearProps: 'transform,opacity',
          },
          0.28
        );

      // Draw curved notebook divider SVG path
      const heroLine = root.querySelector<SVGPathElement>('[data-hero-line]');
      if (heroLine && typeof heroLine.getTotalLength === 'function') {
        const len = heroLine.getTotalLength();
        gsap.set(heroLine, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(heroLine, {
          strokeDashoffset: 0,
          duration: 0.9,
          delay: 0.35,
          ease: 'power2.out',
        });
      }

      // Living ambient studio motion on medallions, bee mark & sticky tags
      gsap.to('[data-hero-badge]', {
        y: -10,
        rotation: 2.5,
        duration: 2.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.5,
        delay: 0.9,
      });

      gsap.to('[data-hero-bee]', {
        y: -4,
        rotation: -4,
        duration: 2.0,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.8,
      });

      gsap.to('[data-hero-note]', {
        y: -4,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.35,
        delay: 1.0,
      });

      // 2. Benefit cards staggered spring reveal on scroll
      gsap.fromTo(
        '[data-benefit-card]',
        { y: 36, scale: 0.95, opacity: 0 },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 0.55,
          stagger: 0.1,
          ease: 'back.out(1.3)',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: '#benefits',
            start: 'top 90%',
            once: true,
          },
        }
      );

      // 3. Workflow polaroids slide/tilt in from left & right + stamps pop in
      gsap.fromTo(
        '[data-wf-left]',
        { x: -44, rotation: -6, opacity: 0 },
        {
          x: 0,
          rotation: 0,
          opacity: 1,
          duration: 0.6,
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
        '[data-wf-center]',
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
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
        '[data-wf-right]',
        { x: 44, rotation: 6, opacity: 0 },
        {
          x: 0,
          rotation: 0,
          opacity: 1,
          duration: 0.6,
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
        { y: 20, scale: 0.82, opacity: 0 },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 0.45,
          stagger: 0.08,
          ease: 'back.out(1.7)',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: '[data-wf-stamps]',
            start: 'top 90%',
            once: true,
          },
        }
      );

      // 4. Each capability folder (01. IMPORT LIST, 02. LIVE PREVIEW, BATCH SPEED) animates on its own scroll trigger
      gsap.utils.toArray<HTMLElement>('[data-folder-reveal]').forEach((folder) => {
        gsap.fromTo(
          folder,
          { y: 44, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power3.out',
            clearProps: 'transform,opacity',
            scrollTrigger: {
              trigger: folder,
              start: 'top 86%',
              once: true,
            },
          }
        );
      });

      gsap.fromTo(
        '[data-import-card]',
        { y: 26, scale: 0.94, opacity: 0 },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 0.45,
          stagger: 0.09,
          ease: 'back.out(1.3)',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: '[data-import-grid]',
            start: 'top 88%',
            once: true,
          },
        }
      );

      // 5. FAQ intro & individual accordion items staggered reveal on scroll
      gsap.fromTo(
        '[data-faq-reveal]',
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
          stagger: 0.1,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: '#faq',
            start: 'top 88%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        '[data-faq-item]',
        { y: 22, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.45,
          stagger: 0.08,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: '#faq',
            start: 'top 84%',
            once: true,
          },
        }
      );

      // 6. Scroll-triggered kinetic text reveals across section headings
      gsap.utils.toArray<HTMLElement>('[data-scroll-text]').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
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

    const refresh = () => ScrollTrigger.refresh();
    const raf = window.requestAnimationFrame(refresh);
    window.addEventListener('load', refresh);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('load', refresh);
      mm.revert();
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

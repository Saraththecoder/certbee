import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import { FAQ } from '../components/FAQ';
import { Hero } from '../components/Hero';
import { WorkflowSection } from '../components/WorkflowSection';

export function Home() {
  const mainRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = mainRef.current;
    if (!root) return;

    const mm = gsap.matchMedia(root);

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        '[data-hero-stagger]',
        { y: 10, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.34,
          stagger: 0.045,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
        }
      );
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

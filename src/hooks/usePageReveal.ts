import gsap from 'gsap';
import { RefObject, useEffect } from 'react';

export function usePageReveal(
  containerRef: RefObject<HTMLElement | null>,
  deps: ReadonlyArray<unknown> = []
) {
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const targets = root.querySelectorAll('[data-page-reveal]');
      if (targets.length > 0) {
        gsap.fromTo(
          targets,
          { y: 8, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.34,
            stagger: 0.045,
            ease: 'power2.out',
            clearProps: 'transform,opacity',
          }
        );
      } else {
        gsap.fromTo(
          root,
          { y: 8, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.32,
            ease: 'power2.out',
            clearProps: 'transform,opacity',
          }
        );
      }
    });

    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

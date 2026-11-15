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
          { y: 14, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.42,
            stagger: 0.06,
            ease: 'power3.out',
            clearProps: 'transform,opacity',
          }
        );
      } else {
        gsap.fromTo(
          root,
          { y: 12, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.38,
            ease: 'power3.out',
            clearProps: 'transform,opacity',
          }
        );
      }
    });

    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

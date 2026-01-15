import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealOptions {
  y?: number;
  x?: number;
  opacity?: number;
  scale?: number;
  duration?: number;
  delay?: number;
  ease?: string;
  start?: string;
  end?: string;
  toggleActions?: string;
  scrub?: boolean | number;
  markers?: boolean;
}

const defaultOptions: ScrollRevealOptions = {
  y: 60,
  opacity: 0,
  duration: 1,
  ease: 'power3.out',
  start: 'top 85%',
  toggleActions: 'play none none reverse',
};

/**
 * Hook for scroll-triggered reveal animations
 */
export function useScrollReveal<T extends HTMLElement>(options: ScrollRevealOptions = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const opts = { ...defaultOptions, ...options };
    const element = ref.current;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        element,
        {
          opacity: opts.opacity ?? 0,
          y: opts.y ?? 0,
          x: opts.x ?? 0,
          scale: opts.scale ?? 1,
        },
        {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          duration: opts.duration,
          delay: opts.delay,
          ease: opts.ease,
          scrollTrigger: {
            trigger: element,
            start: opts.start,
            end: opts.end,
            toggleActions: opts.toggleActions,
            scrub: opts.scrub,
            markers: opts.markers,
          },
        }
      );
    });

    return () => ctx.revert();
  }, [options]);

  return ref;
}

/**
 * Hook for staggered reveal of child elements
 */
export function useStaggerReveal<T extends HTMLElement>(
  childSelector: string,
  options: ScrollRevealOptions & { stagger?: number } = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const opts = { ...defaultOptions, stagger: 0.1, ...options };
    const element = ref.current;
    const children = element.querySelectorAll(childSelector);

    if (children.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        children,
        {
          opacity: opts.opacity ?? 0,
          y: opts.y ?? 0,
          x: opts.x ?? 0,
          scale: opts.scale ?? 1,
        },
        {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          duration: opts.duration,
          ease: opts.ease,
          stagger: opts.stagger,
          scrollTrigger: {
            trigger: element,
            start: opts.start,
            end: opts.end,
            toggleActions: opts.toggleActions,
          },
        }
      );
    });

    return () => ctx.revert();
  }, [childSelector, options]);

  return ref;
}

/**
 * Hook for parallax scroll effect
 */
export function useParallax<T extends HTMLElement>(speed: number = 0.5) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    const ctx = gsap.context(() => {
      gsap.to(element, {
        yPercent: speed * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, [speed]);

  return ref;
}

/**
 * Hook for horizontal scroll section
 */
export function useHorizontalScroll<T extends HTMLElement>(containerSelector: string) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    const container = element.querySelector(containerSelector) as HTMLElement;
    
    if (!container) return;

    const ctx = gsap.context(() => {
      const scrollWidth = container.scrollWidth - element.offsetWidth;

      gsap.to(container, {
        x: -scrollWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: 'top top',
          end: () => `+=${scrollWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });
    });

    return () => ctx.revert();
  }, [containerSelector]);

  return ref;
}

/**
 * Hook for text reveal animation (character by character)
 */
export function useTextReveal<T extends HTMLElement>(options: ScrollRevealOptions = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    const text = element.textContent || '';
    
    // Split text into spans
    element.innerHTML = text
      .split('')
      .map((char) => `<span class="char">${char === ' ' ? '&nbsp;' : char}</span>`)
      .join('');

    const chars = element.querySelectorAll('.char');

    const ctx = gsap.context(() => {
      gsap.fromTo(
        chars,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.05,
          stagger: 0.02,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: element,
            start: options.start || 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    return () => {
      ctx.revert();
      element.textContent = text;
    };
  }, [options]);

  return ref;
}

export { ScrollTrigger };

'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

// Un solo registro de plugins y un solo reloj para toda la página.
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

// Curvas de la espina (PLAN.md · 3)
export const EASE_OUT = 'expo.out';
export const EASE_SOFT = 'power3.out';

let lenisInstance = null;
export const setLenis = (l) => { lenisInstance = l; };
export const getLenis = () => lenisInstance;

export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Desplazamiento suave a un ancla, con o sin Lenis.
export function scrollToTarget(target, opts = {}) {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.4, ...opts });
    return;
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (el && el.scrollIntoView) el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  else if (typeof target === 'number') window.scrollTo({ top: target });
}

export { gsap, ScrollTrigger, SplitText };

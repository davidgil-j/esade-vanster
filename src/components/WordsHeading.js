'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, SplitText, EASE, D, prefersReducedMotion } from '@/lib/motion';

// Titular que entra por palabras (La idea). Visible por defecto: solo se esconde en el instante
// en que empieza su animación.
export default function WordsHeading({ as: Tag = 'h2', className = '', children, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;
    let split;
    let tween;
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        split = SplitText.create(el, { type: 'words', mask: 'words', wordsClass: 'split-word' });
        tween = gsap.from(split.words, {
          yPercent: 100,
          duration: D.enter,
          ease: EASE,
          stagger: 0.035,
          onComplete: () => split?.revert(),
        });
      },
    });
    return () => { st.kill(); tween?.revert(); split?.revert(); };
  }, []);
  return <Tag ref={ref} className={className} {...rest}>{children}</Tag>;
}

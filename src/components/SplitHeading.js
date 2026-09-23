'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, SplitText, EASE_OUT, prefersReducedMotion } from '@/lib/motion';

// Titular que entra por líneas con máscara (coro 6). Ley 2: el titular está visible
// por defecto y solo se esconde en el instante en que empieza su animación.
export default function SplitHeading({ as: Tag = 'h2', className = '', children, delay = 0, start = 'top 85%', ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;
    let split;
    let tween;
    const st = ScrollTrigger.create({
      trigger: el,
      start,
      once: true,
      onEnter: () => {
        split = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'split-line' });
        tween = gsap.from(split.lines, {
          yPercent: 110,
          duration: 0.9,
          ease: EASE_OUT,
          stagger: 0.07,
          delay,
          onComplete: () => split?.revert(),
        });
      },
    });
    return () => {
      st.kill();
      tween?.revert();
      split?.revert();
    };
  }, [delay, start]);

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}

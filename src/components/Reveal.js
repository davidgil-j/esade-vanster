'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, EASE, D, prefersReducedMotion } from '@/lib/motion';

// Entrada al aparecer: fundido corto para el texto y recorte (clip-path) para los objetos.
// Visible por defecto: el estado inicial solo se aplica en el instante en que arranca.
export default function Reveal({ as: Tag = 'div', className = '', children, delay = 0, y = 24, start = 'top 88%', variant = 'clip', ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;
    let tween;
    const st = ScrollTrigger.create({
      trigger: el,
      start,
      once: true,
      onEnter: () => {
        tween = variant === 'fade'
          ? gsap.fromTo(el, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: D.enter, ease: EASE, delay, clearProps: 'opacity,transform' })
          : gsap.fromTo(
            el,
            { clipPath: 'inset(100% 0% 0% 0%)', y },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              y: 0,
              duration: D.enter,
              ease: EASE,
              delay,
              clearProps: 'clipPath,transform',
            }
          );
      },
    });
    return () => {
      st.kill();
      tween?.revert();
    };
  }, [delay, y, start, variant]);

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}

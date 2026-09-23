'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, EASE_OUT, prefersReducedMotion } from '@/lib/motion';

// Revelado por clip-path de abajo arriba (coro 16). Visible por defecto (ley 2):
// el recorte solo se aplica en el instante en que arranca la animación.
export default function Reveal({ as: Tag = 'div', className = '', children, delay = 0, y = 24, start = 'top 88%', ...rest }) {
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
        tween = gsap.fromTo(
          el,
          { clipPath: 'inset(100% 0% 0% 0%)', y },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            y: 0,
            duration: 1.1,
            ease: EASE_OUT,
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
  }, [delay, y, start]);

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}

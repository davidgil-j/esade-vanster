'use client';

import { useEffect, useRef, useState } from 'react';
import RollLabel from './RollLabel';
import { COPY } from '@/content/copy';
import { MAILTO, copyEmail } from '@/lib/mail';
import { gsap, isFinePointer, prefersReducedMotion } from '@/lib/motion';

// «Quiero hablarlo» de la cabecera: una píldora pequeña de toque, con letras que ruedan.
// Magnética solo con ratón: se desplaza como mucho 8 px hacia el cursor.
export default function CtaPill({ className = '' }) {
  const ref = useRef(null);
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !isFinePointer() || prefersReducedMotion()) return undefined;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'vanster' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'vanster' });
    let box = null;
    const enter = () => { box = el.getBoundingClientRect(); };
    const move = (e) => {
      if (!box) return;
      const dx = e.clientX - (box.left + box.width / 2);
      const dy = e.clientY - (box.top + box.height / 2);
      const k = Math.min(1, 8 / Math.max(1, Math.hypot(dx, dy) * 0.35));
      xTo(dx * 0.35 * k);
      yTo(dy * 0.35 * k);
    };
    const leave = () => { box = null; xTo(0); yTo(0); };
    const zone = el.parentElement; // la zona incluye el aviso: el imán no salta al pasar por él
    zone.addEventListener('pointerenter', enter);
    zone.addEventListener('pointermove', move);
    zone.addEventListener('pointerleave', leave);
    return () => {
      zone.removeEventListener('pointerenter', enter);
      zone.removeEventListener('pointermove', move);
      zone.removeEventListener('pointerleave', leave);
    };
  }, []);

  const onClick = async () => {
    if (await copyEmail()) {
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2400);
    }
  };

  return (
    <span className={`cta-zone ${className}`}>
      <span ref={ref} className="magnet">
        <a className="pill press" href={MAILTO} onClick={onClick}>
          <RollLabel text={COPY.cierre.cta} />
        </a>
      </span>
      <span className={`toast ${copied ? 'is-on' : ''}`} role="status" aria-live="polite">
        {copied ? COPY.cierre.copied : ''}
      </span>
    </span>
  );
}

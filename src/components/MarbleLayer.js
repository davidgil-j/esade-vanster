'use client';

import { useEffect, useRef, useState } from 'react';
import { Marble, MARBLE } from '@/lib/marble';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/motion';

// Capa de mármol de una sección de Vänster.
// - Primero se pinta el color y la miniatura de 64 px (marcador de posición).
// - Con WebGL: mármol vivo (lib/marble.js). Sin WebGL o con movimiento reducido: imagen fija
//   «marmol-texto» (el texto blanco se lee a 4,5:1 en el 100 % de los píxeles).
// - Si el aparato no llega a 55 fps: imagen fija con un parallax suave.
// Los bordes líquidos sobresalen de la sección (40 px, 20 en móvil): la capa es más alta que ella.
export default function MarbleLayer({ name, edgeTop = false, edgeBottom = false, variant = 'fucsia', blend = false, onInstance, speed = 1, className = '' }) {
  const hostRef = useRef(null);
  const canvasRef = useRef(null);
  const [mode, setMode] = useState('placeholder'); // placeholder | live | still | parallax
  const [shape, setShape] = useState('wide');

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;
    const r = host.getBoundingClientRect();
    const tall = r.height > r.width * 1.1;
    setShape(tall ? 'tall' : 'wide');
    const mobile = window.matchMedia('(pointer: coarse), (max-width: 899px)').matches;
    if (prefersReducedMotion()) { setMode('still'); return undefined; }
    let marble;
    let io;
    let dead = false;
    const refresh = () => marble?.resize();
    const start = () => {
      if (dead || marble) return;
      try {
        marble = new Marble(canvasRef.current, {
          sources: MARBLE[variant][`${tall ? 'tall' : 'wide'}${mobile && MARBLE[variant].wideMobile ? 'Mobile' : ''}`],
          edgeTop,
          edgeBottom,
          amp: mobile ? 20 : 40,
          mobile,
          speed,
          onReady: () => setMode('live'),
          onSlow: () => { setMode('parallax'); marble?.destroy(); marble = null; },
        });
        canvasRef.current.dataset.name = name;
        onInstance?.(marble);
        ScrollTrigger.addEventListener('refresh', refresh);
      } catch {
        setMode('still');
      }
    };
    // WebGL solo cuando la sección se acerca (una pantalla y media antes): al cargar la página solo
    // arrancan los lienzos que se ven, y el resto no compite con la primera pintura.
    io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { io.disconnect(); start(); }
    }, { rootMargin: '150% 0px' });
    io.observe(host);
    return () => {
      dead = true;
      io?.disconnect();
      ScrollTrigger.removeEventListener('refresh', refresh);
      marble?.destroy();
      onInstance?.(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Parallax suave de la imagen fija (solo si el mármol vivo no llegaba a 55 fps)
  useEffect(() => {
    if (mode !== 'parallax') return undefined;
    const img = hostRef.current?.querySelector('.marble__still');
    if (!img) return undefined;
    const tween = gsap.fromTo(img, { yPercent: -4 }, {
      yPercent: 4,
      ease: 'none',
      scrollTrigger: { trigger: hostRef.current, start: 'top bottom', end: 'bottom top', scrub: 0.3 },
    });
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, [mode]);

  const pre = variant === 'fucsia' ? 'marmol-fucsia' : 'marmol';
  const lq = `/marmol/${pre}-lq-${shape === 'tall' ? '9x16' : '16x9'}.webp`;
  const still = variant === 'normal' ? 'marmol' : `${pre}-texto`;
  const stillSize = shape === 'tall' ? '9x16' : '16x9';
  const edges = `${edgeTop ? ' marble--top' : ''}${edgeBottom ? ' marble--bottom' : ''}`;

  return (
    <div
      ref={hostRef}
      className={`marble${edges}${blend ? ' marble--multiply' : ''} is-${mode} ${className}`}
      style={{ '--marble-lq': `url(${lq})` }}
      aria-hidden="true"
    >
      {mode === 'still' || mode === 'parallax' ? (
        <picture>
          <source type="image/avif" srcSet={`/marmol/${still}-${stillSize}.avif`} />
          <img className="marble__still" src={`/marmol/${still}-${stillSize}.webp`} alt="" loading="lazy" decoding="async" />
        </picture>
      ) : null}
      <canvas ref={canvasRef} className="marble__canvas" />
    </div>
  );
}

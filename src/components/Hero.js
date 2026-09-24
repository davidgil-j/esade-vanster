'use client';

import { useEffect, useRef } from 'react';
import Lockup from './Lockup';
import { COPY } from '@/content/copy';
import { gsap, ScrollTrigger, SplitText, EASE, D, prefersReducedMotion, scrollToTarget } from '@/lib/motion';
import { heroGate } from '@/lib/gate';

const SLATS = 16;

// Portada (PLAN.md · 5, punto 4): la fachada de Esade, desenfocada, al salir de la hoja de carga.
// 1. Lamas: 16 lamas verticales blancas, como las de la fachada, se abren desde su centro.
// 2. Foco: de la imagen muy desenfocada al vídeo, que ya se está reproduciendo.
// 3. El titular cae por líneas con máscara justo cuando llega el foco.
// 4. El subtexto y, al final, el lockup grande bajo el titular (FlyingLockup).
// El titular se pinta desde el primer fotograma debajo de la hoja y de las lamas: solo se esconde
// (partido en líneas) en el instante en que empieza su caída, tapado por las lamas.
export default function Hero() {
  const rootRef = useRef(null);
  const innerRef = useRef(null);
  const videoRef = useRef(null);
  const stillRef = useRef(null);
  const finalRef = useRef(null);
  const titleRef = useRef(null);
  const slatsRef = useRef(null);

  // Vídeo: fuente según el formato de la pantalla; se empieza a descargar ya, durante la carga.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;
    const portrait = window.matchMedia('(orientation: portrait) and (max-width: 899px)').matches;
    const base = portrait ? '/video/portada-movil' : '/video/portada';
    const webm = video.canPlayType('video/webm; codecs="vp9"');
    if (prefersReducedMotion()) {
      // Movimiento reducido: el último fotograma (el anochecer), quieto.
      rootRef.current?.classList.add('is-final');
      return undefined;
    }
    video.src = `${base}.${webm ? 'webm' : 'mp4'}`;
    video.load();
    // Fuera de pantalla no se descodifica (el vídeo ya habrá acabado casi siempre).
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting && !video.paused) video.pause();
      else if (e.isIntersecting && video.dataset.started && !video.ended && video.paused) video.play().catch(() => {});
    });
    io.observe(rootRef.current);
    return () => io.disconnect();
  }, []);

  // Secuencia de entrada
  useEffect(() => {
    const root = rootRef.current;
    const d = document.documentElement;
    const video = videoRef.current;
    let tl;
    let split;
    let onResize;
    let alive = true;

    const focus = () => {
      // «Enfoca»: la imagen muy desenfocada cede al vídeo en cuanto está reproduciéndose.
      const show = () => gsap.to(stillRef.current, { opacity: 0, duration: D.enter, ease: EASE });
      if (!video.paused && video.readyState >= 3) show();
      else video.addEventListener('playing', show, { once: true });
    };
    const startVideo = () => {
      if (prefersReducedMotion() || !video.src) return;
      video.dataset.started = '1';
      video.play().catch(() => {
        // Sin reproducción automática (ahorro de energía): el último fotograma, quieto.
        root.classList.add('is-final');
      });
    };

    heroGate?.then(() => {
      if (!alive) return;
      if (d.classList.contains('hero-fallback') || prefersReducedMotion()) {
        d.classList.add('hero-go');
        startVideo();
        focus();
        return;
      }
      split = SplitText.create(titleRef.current, { type: 'lines', mask: 'lines', linesClass: 'hero__line' });
      gsap.set(split.lines, { yPercent: -110 });
      gsap.set(root.querySelectorAll('.hero__sub, .hero__cta'), { opacity: 0, y: 12 });
      d.classList.add('hero-go');
      startVideo();
      // Al acabar, el titular se queda partido (recomponerlo contaría como desplazamiento, CLS);
      // solo se recompone si cambia el ancho de la ventana.
      tl = gsap.timeline({ onComplete: () => slatsRef.current?.remove() });
      const w0 = window.innerWidth; // en el móvil, la barra del navegador cambia el alto, no el ancho
      onResize = () => {
        if (window.innerWidth === w0) return;
        split?.revert();
        split = null;
        window.removeEventListener('resize', onResize);
      };
      window.addEventListener('resize', onResize);
      tl.to(slatsRef.current.children, {
        scaleX: 0,
        duration: 1.1,
        ease: 'expo.out',
        stagger: { each: 0.035, from: 'center' },
      }, 0)
        .add(focus, 0.35)
        .to(split.lines, { yPercent: 0, duration: D.enter, ease: EASE, stagger: 0.08 }, 0.35)
        .to(root.querySelector('.hero__sub'), { opacity: 1, y: 0, duration: D.enter, ease: EASE }, 0.6)
        .to(root.querySelector('.hero__cta'), { opacity: 1, y: 0, duration: D.enter, ease: EASE }, 0.72)
        .add(() => window.dispatchEvent(new Event('vx:lockup-in')), 0.85);
    });

    return () => {
      alive = false;
      tl?.kill();
      if (onResize) window.removeEventListener('resize', onResize);
      split?.revert();
    };
  }, []);

  // Al subir «La idea» por encima, la portada se queda debajo: escala a 0,94 y se oscurece un poco.
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const over = document.getElementById('idea');
    if (!over) return undefined;
    const tl = gsap.timeline({
      scrollTrigger: { trigger: over, start: 'top bottom', end: 'top top', scrub: true },
    });
    tl.fromTo(innerRef.current, { scale: 1 }, { scale: 0.94, ease: 'none' }, 0)
      .fromTo(rootRef.current.querySelector('.hero__dim'), { opacity: 0 }, { opacity: 0.4, ease: 'none' }, 0);
    // La invitación a bajar se retira en cuanto hay scroll
    const st = ScrollTrigger.create({
      start: 8,
      end: 'max',
      onToggle: (self) => rootRef.current?.classList.toggle('is-scrolled', self.isActive),
    });
    return () => { tl.scrollTrigger?.kill(); tl.kill(); st.kill(); };
  }, []);

  return (
    <section ref={rootRef} className="hero" data-tone="video" aria-labelledby="hero-title">
      <div ref={innerRef} className="hero__inner">
        <div className="hero__media">
          <video
            ref={videoRef}
            className="hero__video"
            muted
            playsInline
            preload="auto"
            disableRemotePlayback
            aria-hidden="true"
            tabIndex={-1}
          />
          <picture ref={finalRef} className="hero__final">
            <source type="image/avif" media="(orientation: portrait) and (max-width: 899px)" srcSet="/video/final-movil.avif" />
            <source type="image/avif" srcSet="/video/final.avif" />
            <img src="/video/final.webp" alt="" loading="lazy" decoding="async" />
          </picture>
          <picture ref={stillRef} className="hero__still">
            <source type="image/avif" media="(orientation: portrait) and (max-width: 899px)" srcSet="/video/fija-movil.avif" />
            <source type="image/avif" srcSet="/video/fija.avif" />
            <img src="/video/fija.webp" alt="" decoding="async" fetchPriority="high" />
          </picture>
        </div>
        <div className="hero__scrim" aria-hidden="true" />
        <div className="hero__dim" aria-hidden="true" />
        <div className="hero__content">
          <h1 ref={titleRef} id="hero-title" className="hero__title">{COPY.hero.title}</h1>
          <p className="hero__sub">{COPY.hero.sub}</p>
          <a
            className="hero__cta link"
            href="#idea"
            onClick={(e) => { e.preventDefault(); scrollToTarget('#idea'); }}
          >
            {COPY.hero.cta}
            <span className="hero__scroll" aria-hidden="true"><span /></span>
          </a>
          <div id="hero-lockup-slot" className="hero__slot">
            <Lockup tone="dark" className="lockup--big hero__static-lockup" />
          </div>
        </div>
        <div ref={slatsRef} className="slats" aria-hidden="true">
          {Array.from({ length: SLATS }, (_, i) => <span key={i} />)}
        </div>
      </div>
    </section>
  );
}

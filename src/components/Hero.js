'use client';

import { useEffect, useRef } from 'react';
import Lockup from './Lockup';
import MarbleLayer from './MarbleLayer';
import { COPY } from '@/content/copy';
import { gsap, ScrollTrigger, SplitText, EASE, D, prefersReducedMotion } from '@/lib/motion';
import { heroGate } from '@/lib/gate';

const SLATS = 16;

// Portada: la Rambla de la Innovación del campus de Esade en Sant Cugat, a mediodía (foto de Jorge
// Franganillo, CC BY 2.0; el crédito va en el pie). Los banderines de Esade con sus lemas, el cielo
// limpio arriba y la gente paseando.
// Entrada, al levantarse la hoja de carga:
// 1. Lamas: 16 lamas verticales blancas, como las de la fachada, se abren desde su centro.
// 2. Foco: de la foto muy desenfocada a la nítida, con un acercamiento lento (1,06 → 1).
// 3. El titular cae por líneas con máscara justo cuando llega el foco.
// 4. Al final, «vänster × esade» abajo (FlyingLockup lo sube con la página hasta la isla).
// El titular, en Esade Type y el azul oscuro de Esade, va en el hueco de cielo entre el edificio y
// los banderines: ninguna letra pisa el banderín «esade».
// El paso a «La idea» no tapa la portada: la tiñe. Al bajar, el fucsia de Vänster sube de abajo arriba
// en multiplicar y encima se funde el mármol vivo; el titular se retira mientras tanto. Todo ligado a
// la posición del scroll (sin pin, sin tiempo).
// El titular se pinta desde el primer fotograma debajo de la hoja y de las lamas: solo se esconde
// (partido en líneas) en el instante en que empieza su caída, tapado por las lamas.
export default function Hero() {
  const rootRef = useRef(null);
  const innerRef = useRef(null);
  const photoRef = useRef(null);
  const stillRef = useRef(null);
  const titleRef = useRef(null);
  const slatsRef = useRef(null);
  const marbleInst = useRef(null);

  // Secuencia de entrada
  useEffect(() => {
    const root = rootRef.current;
    const d = document.documentElement;
    let tl;
    let split;
    let onResize;
    let alive = true;

    // «Enfoca»: la foto desenfocada cede a la nítida, que se acerca despacio hasta su sitio.
    const focus = () => {
      gsap.to(stillRef.current, { opacity: 0, duration: 1.1, ease: EASE });
      gsap.fromTo(photoRef.current, { scale: 1.06 }, { scale: 1, duration: 2.6, ease: 'expo.out', clearProps: 'transform' });
    };

    heroGate?.then(() => {
      if (!alive) return;
      if (d.classList.contains('hero-fallback') || prefersReducedMotion()) {
        d.classList.add('hero-go');
        gsap.set(stillRef.current, { opacity: 0 });
        return;
      }
      split = SplitText.create(titleRef.current, { type: 'lines', mask: 'lines', linesClass: 'hero__line' });
      gsap.set(split.lines, { yPercent: -110 });
      d.classList.add('hero-go');
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
        .add(() => window.dispatchEvent(new Event('vx:lockup-in')), 0.9);
    });

    return () => {
      alive = false;
      tl?.kill();
      if (onResize) window.removeEventListener('resize', onResize);
      split?.revert();
    };
  }, []);

  // El tinte: de 0 a 0,45 pantallas de scroll (0,3 en el móvil)
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const root = rootRef.current;
    const tint = root.querySelector('.hero__tint');
    const marble = root.querySelector('.hero__marble');
    const content = root.querySelector('.hero__content');
    const c01 = (v) => Math.min(1, Math.max(0, v));
    const apply = (p) => {
      tint.style.setProperty('--t', c01(p / 0.8).toFixed(4));
      const mo = c01((p - 0.4) / 0.5);
      marble.style.opacity = mo.toFixed(3);
      // Invisible, el mármol no se pinta (antes trabajaba desde el primer fotograma de la portada)
      if (marbleInst.current) marbleInst.current.paused = mo === 0;
      const out = c01(p / 0.35);
      content.style.opacity = (1 - out).toFixed(3);
      content.style.transform = out ? `translate3d(0,${(-24 * out).toFixed(1)}px,0)` : '';
    };
    apply(0);
    const st = ScrollTrigger.create({
      start: 0,
      // En el móvil, antes: el lockup sube por el centro y el rótulo tiene que estar ya cubierto
      end: () => window.innerHeight * (window.matchMedia('(max-width: 899px)').matches ? 0.3 : 0.45),
      onUpdate: (self) => apply(self.progress),
      onRefresh: (self) => apply(self.progress),
    });
    return () => st.kill();
  }, []);

  return (
    <section ref={rootRef} className="hero" data-tone="light" aria-labelledby="hero-title">
      <div ref={innerRef} className="hero__inner">
        <div className="hero__media">
          <picture ref={photoRef} className="hero__photo">
            <source type="image/avif" media="(orientation: portrait) and (max-width: 899px)" srcSet="/foto/rambla-movil.avif" />
            <source type="image/avif" srcSet="/foto/rambla-1600.avif 1600w, /foto/rambla.avif 2560w" sizes="100vw" />
            <source type="image/webp" media="(orientation: portrait) and (max-width: 899px)" srcSet="/foto/rambla-movil.webp" />
            <img src="/foto/rambla-1600.webp" srcSet="/foto/rambla-1600.webp 1600w, /foto/rambla.webp 2560w" sizes="100vw" alt="La Rambla de la Innovación del campus de Esade en Sant Cugat, con los banderines de Esade" decoding="async" fetchPriority="high" />
          </picture>
          <picture ref={stillRef} className="hero__still" aria-hidden="true">
            <source type="image/avif" media="(orientation: portrait) and (max-width: 899px)" srcSet="/foto/rambla-movil-desenfocada.avif" />
            <source type="image/avif" srcSet="/foto/rambla-desenfocada.avif" />
            <img src="/foto/rambla-desenfocada.webp" alt="" decoding="async" />
          </picture>
        </div>
        <div className="hero__scrim" aria-hidden="true" />
        <div className="hero__tint" aria-hidden="true" />
        <div className="hero__marble" aria-hidden="true">
          <MarbleLayer name="idea" onInstance={(m) => { marbleInst.current = m; if (m) m.paused = true; }} />
        </div>
        <div className="hero__dim" aria-hidden="true" />
        <div className="hero__content">
          <h1 ref={titleRef} id="hero-title" className="hero__title">
            <span className="hero__year">{COPY.hero.year}</span> {COPY.hero.title}
          </h1>
          <div id="hero-lockup-slot" className="hero__slot">
            <span className="hero__lockup-color"><Lockup tone="light" className="lockup--big hero__static-lockup" /></span>
            <span className="hero__lockup-white"><Lockup tone="dark" className="lockup--big hero__static-lockup" /></span>
          </div>
        </div>
        <div ref={slatsRef} className="slats" aria-hidden="true">
          {Array.from({ length: SLATS }, (_, i) => <span key={i} />)}
        </div>
      </div>
    </section>
  );
}

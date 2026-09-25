'use client';

import { useEffect, useRef, useState } from 'react';
import MarbleLayer from './MarbleLayer';
import { gsap, EASE, D, prefersReducedMotion } from '@/lib/motion';
import { openHeroGate } from '@/lib/gate';

// Pantalla de carga: la hoja de 2026 pasa a 2027 (PLAN.md · 5, punto 3).
// - Espera a la carga REAL: tipografías, la imagen fija de la portada y los datos del vídeo.
// - El 6 gira a 7 como un marcador de tablillas (rotateX por mitades) y la hoja entera gira hacia
//   arriba sobre su borde superior, como una página de calendario de sobremesa.
// - Entre 0,9 y 2,2 s desde que se abre la página. En cada carga de la página (también al recargar). Con movimiento reducido,
//   un fundido de 300 ms. Sin JavaScript no existe (solo se pinta con html.js).
// - La hoja es de mármol vivo y su flujo va más deprisa cuanto más ha cargado.
const MIN_TOTAL = 900;
const MAX_START = 1000; // como tarde empieza el cambio de cifra: 1,0 + 0,45 + 0,7 = 2,15 s
const MIN_READ = 500; // «2026» se lee medio segundo como mínimo

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = resolve;
    img.src = src;
  });
}

export default function Loader() {
  const [gone, setGone] = useState(false);
  const rootRef = useRef(null);
  const sheetRef = useRef(null);
  const marbleRef = useRef(null);
  const progress = useRef(0);

  useEffect(() => {
    const d = document.documentElement;
    if (d.classList.contains('no-loader') || d.classList.contains('hero-fallback')) {
      setGone(true);
      openHeroGate();
      return undefined;
    }
    const t0 = window.__t0 ?? 0;
    const since = () => performance.now() - t0;
    const portrait = window.matchMedia('(orientation: portrait) and (max-width: 899px)').matches;
    const video = document.querySelector('.hero__video');
    const meta = new Promise((resolve) => {
      if (!video || video.readyState >= 1) { resolve(); return; }
      video.addEventListener('loadedmetadata', resolve, { once: true });
      video.addEventListener('error', resolve, { once: true });
    });
    const items = [
      document.fonts?.ready ?? Promise.resolve(),
      loadImage(portrait ? '/video/fija-movil.avif' : '/video/fija.avif'),
      meta,
    ];
    items.forEach((p) => p.then(() => {
      progress.current += 1 / items.length;
      if (marbleRef.current) marbleRef.current.speed = 0.6 + 2.4 * progress.current;
    }));

    let killed = false;
    let tl;
    const finish = () => {
      setGone(true);
    };
    const run = () => {
      if (killed) return;
      const root = rootRef.current;
      if (!root) return;
      const late = since() > 1900; // el JS llegó tarde: se retira sin ceremonia
      if (prefersReducedMotion() || late) {
        root.classList.add('is-2027');
        openHeroGate();
        tl = gsap.to(root, { opacity: 0, duration: D.ui, ease: 'none', onComplete: finish });
        return;
      }
      const q = (s) => root.querySelector(s);
      tl = gsap.timeline({ onComplete: finish });
      // 6 → 7 en un giro de 450 ms partido en dos mitades: cae la de arriba del 6 (acelera, como
      // una tablilla que cae) y baja la de abajo del 7 (frena al asentarse).
      const half = D.mid / 2;
      // Sin tablillas opacas, cada mitad solo se ve cuando le toca: la de arriba del 7 aparece al
      // empezar a caer la del 6; la de abajo del 6 se retira antes de que baje la del 7.
      tl.set(q('.flap__back.flap__half--top'), { visibility: 'visible' })
        .to(q('.flap__top'), { rotateX: -90, duration: half, ease: 'power2.in' })
        .set([q('.flap__top'), q('.flap__back.flap__half--bottom')], { visibility: 'hidden' })
        .fromTo(q('.flap__bottom'), { rotateX: 90, visibility: 'visible' }, { rotateX: 0, duration: half, ease: EASE })
        .add(() => root.classList.add('is-2027'))
        // La hoja se levanta sobre su borde superior y deja ver la portada
        .to(sheetRef.current, { rotateX: 92, duration: D.enter, ease: EASE })
        .add(() => openHeroGate(), '<0.12');
    };
    const wait = Math.max(0, MAX_START - since());
    Promise.race([Promise.all(items), new Promise((r) => setTimeout(r, wait))]).then(() => {
      // Si todo estaba ya, se espera lo justo para que se lea «2026». La secuencia dura 1,15 s,
      // así que el total nunca baja de MIN_TOTAL.
      setTimeout(run, Math.max(0, MIN_READ - since(), MIN_TOTAL - 1150 - since()));
    });
    return () => {
      killed = true;
      tl?.kill();
    };
  }, []);

  if (gone) return null;

  return (
    <div ref={rootRef} className="loader" aria-hidden="true">
      <div ref={sheetRef} className="loader__sheet">
        <MarbleLayer name="loader" onInstance={(m) => { marbleRef.current = m; if (m) m.speed = 0.6 + 2.4 * progress.current; }} />
        <div className="loader__year">
          <span>202</span>
          <span className="flap">
            <span className="flap__size">0</span>
            {/* Detrás: arriba el 7, abajo el 6. Delante giran: la mitad de arriba del 6 y la de abajo del 7 */}
            <span className="flap__half flap__half--top flap__back"><span>7</span></span>
            <span className="flap__half flap__half--bottom flap__back"><span>6</span></span>
            <span className="flap__half flap__half--top flap__top"><span>6</span></span>
            <span className="flap__half flap__half--bottom flap__bottom"><span>7</span></span>
          </span>
        </div>
      </div>
    </div>
  );
}

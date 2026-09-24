'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import Photo from './Photo';
import Handle from './Handle';
import { FOTOS } from '@/content/fotos';
import { MONTHS } from '@/content/copy';
import { quadToMatrix3d } from '@/lib/quad';
import {
  gsap, ScrollTrigger, EASE, D, SPRING_SOFT, spring, project, clamp, isCoarse, prefersReducedMotion, panY, loadDrag,
} from '@/lib/motion';

// Hojear el calendario de sobremesa (PLAN.md · 5, punto 6). Sobre la foto del caballete, cada
// hoja (con la luz de la foto horneada) va encima de la hoja blanca con matrix3d desde sus
// esquinas. La hoja de delante gira sobre la anilla de arriba (rotateX, origen arriba), sube hacia
// quien mira y pasa por encima, detrás del caballete, y deja ver la siguiente.
// - Ratón: arrastrando hacia arriba (y hacia abajo para volver). Táctil: deslizando en
//   horizontal o con un toque (touch-action: pan-y). Con velocidad: un golpe rápido pasa el mes.
// - Flechas del teclado y dos botones discretos para quien no arrastre.
// - Al elegir una fecha, las hojas pasan en ráfaga (60 ms por hoja) hasta ese mes.
const G = FOTOS.calendario;
const SW = 1000;
const SH = Math.round(SW / FOTOS.sheetRatio);
const [rx, ry, rw, rh] = G.anillas;

// Opacidad de una hoja según su ángulo: detrás del caballete a partir de ~100°
const fade = (a) => (a <= 100 ? 1 : Math.max(0, 1 - (a - 100) / 50));

const CalendarFlip = forwardRef(function CalendarFlip({ marked, onMonth }, ref) {
  const stageRef = useRef(null);
  const sheetsRef = useRef(null);
  const angles = useRef(Array(12).fill(0));
  const [month, setMonth] = useState(0);
  const cur = useRef(0);
  const anims = useRef([]);
  const [matrix, setMatrix] = useState(null);

  const paint = (i) => {
    const el = sheetsRef.current?.children[i];
    if (!el) return;
    const a = angles.current[i];
    el.style.transform = a ? `rotateX(${a}deg)` : '';
    el.style.opacity = fade(a);
    el.style.visibility = a >= 150 || i > cur.current + 1 ? 'hidden' : 'visible';
    // mientras sube, delante de todo; al pasar de 90°, detrás (va hacia la espalda del caballete)
    el.style.zIndex = a > 90 ? 0 : 20 - i;
  };
  const paintAll = () => { for (let i = 0; i < 12; i++) paint(i); };

  const setCurrent = (m) => {
    cur.current = m;
    setMonth(m);
    onMonth?.(m);
    paintAll();
  };

  const animateSheet = (i, to, { velocity = 0, duration, delay = 0 } = {}) => {
    anims.current[i]?.stop?.();
    anims.current[i]?.kill?.();
    if (prefersReducedMotion()) { angles.current[i] = to; paint(i); return Promise.resolve(); }
    return new Promise((resolve) => {
      if (duration) {
        const o = { a: angles.current[i] };
        anims.current[i] = gsap.to(o, {
          a: to, duration, delay, ease: EASE,
          onUpdate: () => { angles.current[i] = o.a; paint(i); },
          onComplete: resolve,
        });
      } else {
        anims.current[i] = spring({
          from: angles.current[i], to, velocity, ...SPRING_SOFT,
          onUpdate: (v) => { angles.current[i] = v; paint(i); },
          onComplete: resolve,
        });
      }
    });
  };

  const next = (velocity) => {
    const m = cur.current;
    if (m >= 11) return;
    setCurrent(m + 1);
    animateSheet(m, 180, velocity === undefined ? { duration: D.mid } : { velocity });
  };
  const prev = (velocity) => {
    const m = cur.current;
    if (m <= 0) return;
    cur.current = m - 1;
    paintAll();
    animateSheet(m - 1, 0, velocity === undefined ? { duration: D.mid } : { velocity }).then(() => setCurrent(cur.current));
    setMonth(m - 1);
    onMonth?.(m - 1);
  };

  // Ráfaga hasta un mes: 60 ms por hoja
  const goTo = (target) => {
    const m = cur.current;
    if (target === m) return;
    if (prefersReducedMotion()) {
      for (let i = 0; i < 12; i++) angles.current[i] = i < target ? 180 : 0;
      setCurrent(target);
      return;
    }
    if (target > m) {
      for (let i = m; i < target; i++) animateSheet(i, 180, { duration: D.ui, delay: (i - m) * 0.06 });
    } else {
      for (let i = m - 1; i >= target; i--) animateSheet(i, 0, { duration: D.ui, delay: (m - 1 - i) * 0.06 });
    }
    setCurrent(target);
  };

  useImperativeHandle(ref, () => ({ goTo, next, prev }));

  useEffect(() => {
    const stage = stageRef.current;
    const measure = () => {
      const w = stage.offsetWidth;
      const h = stage.offsetHeight;
      setMatrix(quadToMatrix3d(SW, SH, G.hoja.map(([x, y]) => [x * w, y * h])));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    paintAll();
    if (prefersReducedMotion()) return () => ro.disconnect();

    // Arrastre: ratón en vertical; táctil en horizontal (el vertical es del scroll).
    const touch = isCoarse();
    const proxy = document.createElement('div');
    let start = 0;
    let dir = 0; // 1 = hacia delante (la hoja actual sube), -1 = hacia atrás (vuelve la anterior)
    let a0 = 0;
    const span = () => (touch ? stage.offsetWidth * 0.55 : stage.offsetHeight * 0.6);
    let drag;
    let dead = false;
    loadDrag().then(({ Draggable, InertiaPlugin }) => {
      if (dead) return;
      [drag] = Draggable.create(proxy, {
        trigger: sheetsRef.current,
        type: touch ? 'x' : 'y',
        allowNativeTouchScrolling: true,
        minimumMovement: 6,
        onPress() {
          start = touch ? this.x : this.y;
          dir = 0;
          InertiaPlugin.track(proxy, touch ? 'x' : 'y');
        },
        onDrag() {
          const d = (touch ? this.x : this.y) - start; // negativo = izquierda / arriba
          if (!dir) {
            dir = d < 0 ? 1 : -1;
            if (dir === 1 && cur.current >= 11) dir = 0;
            if (dir === -1 && cur.current <= 0) dir = 0;
            if (!dir) return;
            const i = dir === 1 ? cur.current : cur.current - 1;
            anims.current[i]?.stop?.();
            anims.current[i]?.kill?.();
            a0 = angles.current[i];
            if (dir === -1) { cur.current -= 1; paintAll(); }
          }
          const i = cur.current; // hacia atrás, cur ya apunta a la hoja que vuelve
          const a = clamp(a0 + (-d / span()) * 180, 0, 180);
          angles.current[i] = a;
          paint(i);
        },
        onDragEnd() {
          const v = InertiaPlugin.getVelocity(proxy, touch ? 'x' : 'y');
          InertiaPlugin.untrack(proxy, touch ? 'x' : 'y');
          if (!dir) return;
          const i = cur.current;
          const va = (-v / span()) * 180;
          const goes = angles.current[i] + project(va) > 90;
          if (dir === 1) {
            if (goes) { setCurrent(i + 1); animateSheet(i, 180, { velocity: va }); } else animateSheet(i, 0, { velocity: va });
          } else if (goes) {
            // no volvió: la anterior regresa detrás
            animateSheet(i, 180, { velocity: va }).then(() => setCurrent(i + 1));
            cur.current = i + 1;
          } else {
            animateSheet(i, 0, { velocity: va });
            setCurrent(i);
          }
          dir = 0;
        },
        onClick() {
          next(); // un toque (o un clic) pasa el mes
        },
      });
      if (touch) panY(drag);
    });

    // Pista de uso: la hoja se levanta un poco al entrar en pantalla, una vez
    const st = ScrollTrigger.create({
      trigger: stage,
      start: 'top 65%',
      once: true,
      onEnter: () => {
        const i = cur.current;
        if (angles.current[i]) return;
        const o = { a: 0 };
        gsap.to(o, {
          a: 14, duration: D.ui, ease: EASE,
          onUpdate: () => { angles.current[i] = o.a; paint(i); },
          onComplete: () => animateSheet(i, 0),
        });
      },
    });
    return () => { dead = true; ro.disconnect(); drag?.kill(); st.kill(); anims.current.forEach((a) => { a?.stop?.(); a?.kill?.(); }); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); next(); }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); prev(); }
  };

  const markedCell = marked ? FOTOS.cells[marked.m].find((c) => c[0] === marked.d) : null;

  return (
    <div className="cal">
      <div
        className="cal__frame"
        tabIndex={0}
        role="group"
        aria-roledescription="calendario"
        aria-label={`Calendario de sobremesa 2027 de Esade: ${MONTHS[month]}. Flechas para pasar de mes.`}
        onKeyDown={onKeyDown}
      >
      <div ref={stageRef} className="cal__stage">
        <Photo base="/fotos/calendario" sizes="(max-width: 899px) 100vw, 55vw" width={2400} height={1600} className="cal__plate" alt="" />
        <div ref={sheetsRef} className="cal__sheets" style={{ width: SW, height: SH, transform: matrix || 'scale(0)' }}>
          {MONTHS.map((mname, i) => (
            <div key={mname} className="cal__sheet">
              <div className="cal__front">
                <Photo base={`/fotos/hoja-${String(i + 1).padStart(2, '0')}`} widths={[870, 1740]} sizes="(max-width: 899px) 60vw, 32vw" width={1740} height={1199} alt="" />
                {markedCell && marked.m === i ? (
                  <span
                    className="cal__mark"
                    style={{ left: `${markedCell[1] * 100}%`, top: `${markedCell[2] * 100}%`, width: `${markedCell[3] * 100}%`, height: `${markedCell[4] * 100}%` }}
                  />
                ) : null}
              </div>
              <span className="cal__back" />
            </div>
          ))}
        </div>
        <picture className="cal__rings" style={{ left: `${rx * 100}%`, top: `${ry * 100}%`, width: `${rw * 100}%`, height: `${rh * 100}%` }} aria-hidden="true">
          <source type="image/avif" srcSet="/fotos/calendario-anillas-1200.avif 702w, /fotos/calendario-anillas-2400.avif 1403w" sizes="(max-width: 899px) 56vw, 30vw" />
          <img src="/fotos/calendario-anillas-2400.webp" alt="" loading="lazy" decoding="async" draggable={false} />
        </picture>
      </div>
      </div>
      <div className="cal__controls">
        <button type="button" className="handle-btn press" aria-label="Mes anterior" disabled={month === 0} onClick={() => prev()}>
          <Handle dir="left" />
        </button>
        <button type="button" className="handle-btn press" aria-label="Mes siguiente" disabled={month === 11} onClick={() => next()}>
          <Handle dir="right" />
        </button>
      </div>
    </div>
  );
});

export default CalendarFlip;

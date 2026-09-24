'use client';

import { useEffect, useRef, useState } from 'react';
import Photo from './Photo';
import Handle from './Handle';
import { gsap, ScrollTrigger, EASE, D, clamp, prefersReducedMotion, panY, loadDrag } from '@/lib/motion';

// Comparador (La idea): la misma foto de la agenda cerrada con dos tapas. A la izquierda de la
// costura, la diseñada para Esade; a la derecha, una de catálogo (polipiel negra con el logo
// pequeño abajo a la derecha). En reposo (56 %), la costura no corta ningún logo: el de la tapa
// diseñada acaba en el 44 % y el de catálogo empieza en el 65 %.
// Se arrastra con ratón y con dedo en horizontal (touch-action: pan-y: el scroll vertical es libre).
const MIN = 5;
const MAX = 95;
const REST = 56;

export default function Comparator() {
  const frameRef = useRef(null);
  const topRef = useRef(null);
  const knobRef = useRef(null);
  const pos = useRef(REST);
  const [value, setValue] = useState(REST);

  const apply = (p) => {
    pos.current = p;
    topRef.current.style.clipPath = `inset(0 0 0 ${p}%)`;
    knobRef.current.style.transform = `translate3d(${(p / 100) * frameRef.current.offsetWidth}px,0,0)`;
  };

  useEffect(() => {
    const frame = frameRef.current;
    let width = frame.offsetWidth;
    apply(REST);
    const ro = new ResizeObserver(() => { width = frame.offsetWidth; apply(pos.current); });
    ro.observe(frame);

    let left = 0;
    const proxy = document.createElement('div');
    let drag;
    let dead = false;
    loadDrag().then(({ Draggable }) => {
      if (dead) return;
      [drag] = Draggable.create(proxy, {
        trigger: frame,
        type: 'x',
        allowNativeTouchScrolling: true, // el eje vertical sigue siendo del scroll
        minimumMovement: 4,
        onPress(e) {
          left = frame.getBoundingClientRect().left;
          frame.classList.add('is-dragging');
          gsap.killTweensOf(pos);
          const p = clamp(((e.clientX ?? e.touches?.[0]?.clientX ?? 0) - left) / width * 100, MIN, MAX);
          if (e.pointerType === 'mouse' || e.type === 'mousedown') apply(p);
        },
        onDrag() {
          apply(clamp((this.pointerX - left) / width * 100, MIN, MAX));
        },
        onRelease() {
          frame.classList.remove('is-dragging');
          setValue(Math.round(pos.current));
        },
      });
      panY(drag);
    });

    // Al entrar en pantalla: barrido de la pista hasta el 30 % y vuelta, una vez.
    let st;
    if (!prefersReducedMotion()) {
      st = ScrollTrigger.create({
        trigger: frame,
        start: 'top 70%',
        once: true,
        onEnter: () => {
          const o = { p: pos.current };
          gsap.timeline()
            .to(o, { p: 30, duration: D.enter, ease: EASE, onUpdate: () => apply(o.p) })
            .to(o, { p: REST, duration: D.enter, ease: EASE, onUpdate: () => apply(o.p), onComplete: () => setValue(REST) });
        },
      });
    }
    return () => { dead = true; drag?.kill(); ro.disconnect(); st?.kill(); };
  }, []);

  const onKeyDown = (e) => {
    const step = e.shiftKey ? 10 : 2;
    const keys = {
      ArrowLeft: (p) => p - step, ArrowDown: (p) => p - step,
      ArrowRight: (p) => p + step, ArrowUp: (p) => p + step,
      PageDown: (p) => p - 20, PageUp: (p) => p + 20,
      Home: () => MIN, End: () => MAX,
    };
    if (!keys[e.key]) return;
    e.preventDefault();
    const p = clamp(keys[e.key](pos.current), MIN, MAX);
    apply(p);
    setValue(Math.round(p));
  };

  return (
    <div ref={frameRef} className="compare">
      <Photo base="/fotos/agenda-esade" sizes="(max-width: 899px) 100vw, 50vw" width={2400} height={1600} className="compare__photo" alt="" />
      <div ref={topRef} className="compare__top">
        <Photo base="/fotos/agenda-catalogo" sizes="(max-width: 899px) 100vw, 50vw" width={2400} height={1600} className="compare__photo" alt="" />
      </div>
      <div className="compare__seam" ref={knobRef}>
        <span className="compare__line" aria-hidden="true" />
        <span
          className="compare__knob"
          role="slider"
          tabIndex={0}
          aria-label="Comparar la agenda diseñada para Esade con una agenda de catálogo"
          aria-valuemin={MIN}
          aria-valuemax={MAX}
          aria-valuenow={value}
          aria-valuetext={`${value} % de la agenda diseñada a la vista`}
          onKeyDown={onKeyDown}
        >
          <Handle dir="both" />
        </span>
      </div>
    </div>
  );
}

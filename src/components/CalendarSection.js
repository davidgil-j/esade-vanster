'use client';

import { useEffect, useId, useRef, useState } from 'react';
import SplitHeading from './SplitHeading';
import Reveal from './Reveal';
import CalendarFlip from './CalendarFlip';
import { COPY, MONTHS, WEEKDAYS } from '@/content/copy';
import { monthGrid } from '@/lib/brand';
import { scrollToTarget } from '@/lib/motion';

const pad = (n) => String(n).padStart(2, '0');
const toISO = (m, d) => `2027-${pad(m + 1)}-${pad(d)}`;

// Selector propio (escritorio): una rejilla de 2027 en un desplegable, con teclado.
// El foco vuelve al botón al elegir o al cerrar; el botón anuncia la fecha elegida.
function DatePicker({ value, onChange, labelId }) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(value ? value.m : 0);
  const [focusDay, setFocusDay] = useState(value ? value.d : 1);
  const wrapRef = useRef(null);
  const gridRef = useRef(null);
  const buttonRef = useRef(null);
  const valueId = useId();

  const close = (returnFocus = true) => {
    setOpen(false);
    if (returnFocus) requestAnimationFrame(() => buttonRef.current?.focus());
  };

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => { if (!wrapRef.current?.contains(e.target)) close(false); };
    const onKey = (e) => { if (e.key === 'Escape') { e.preventDefault(); close(true); } };
    document.addEventListener('pointerdown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('pointerdown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [open]);

  // Foco itinerante: solo un día es tabulable; se enfoca al abrir y al moverse.
  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => gridRef.current?.querySelector(`[data-day="${focusDay}"]`)?.focus());
  }, [open, view, focusDay]);

  const cells = monthGrid(view);
  const daysIn = (m) => new Date(2027, m + 1, 0).getDate();

  const moveTo = (m, d) => {
    if (m < 0 || m > 11) return;
    setView(m);
    setFocusDay(Math.min(Math.max(1, d), daysIn(m)));
  };

  const onGridKey = (e) => {
    const d = focusDay;
    const map = {
      ArrowLeft: () => (d > 1 ? moveTo(view, d - 1) : moveTo(view - 1, 31)),
      ArrowRight: () => (d < daysIn(view) ? moveTo(view, d + 1) : moveTo(view + 1, 1)),
      ArrowUp: () => (d > 7 ? moveTo(view, d - 7) : moveTo(view - 1, daysIn(view - 1 < 0 ? 0 : view - 1) - (7 - d))),
      ArrowDown: () => (d + 7 <= daysIn(view) ? moveTo(view, d + 7) : moveTo(view + 1, d + 7 - daysIn(view))),
      PageUp: () => moveTo(view - 1, d),
      PageDown: () => moveTo(view + 1, d),
      Home: () => moveTo(view, 1),
      End: () => moveTo(view, daysIn(view)),
    };
    if (map[e.key]) { e.preventDefault(); map[e.key](); }
  };

  const display = value ? `${pad(value.d)} / ${pad(value.m + 1)} / 2027` : 'dd / mm / 2027';
  const spoken = value ? `${value.d} de ${MONTHS[value.m]} de 2027` : 'sin fecha';

  return (
    <div
      ref={wrapRef}
      className="picker"
      onBlur={(e) => { if (open && !wrapRef.current?.contains(e.relatedTarget)) close(false); }}
    >
      <button
        ref={buttonRef}
        type="button"
        className="picker__button"
        aria-labelledby={`${labelId} ${valueId}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          if (open) { close(false); return; }
          setView(value ? value.m : view);
          setFocusDay(value ? value.d : 1);
          setOpen(true);
        }}
      >
        <span className={value ? '' : 'picker__empty'} aria-hidden="true">{display}</span>
        <span id={valueId} className="sr-only">{spoken}</span>
        <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
          <rect x="2.5" y="4" width="15" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <line x1="2.5" y1="8" x2="17.5" y2="8" stroke="currentColor" strokeWidth="1.5" />
          <line x1="6.5" y1="2" x2="6.5" y2="5.5" stroke="currentColor" strokeWidth="1.5" />
          <line x1="13.5" y1="2" x2="13.5" y2="5.5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      {open ? (
        <div className="picker__panel" role="dialog" aria-label={`${MONTHS[view]} de 2027`}>
          <div className="picker__head">
            <button type="button" className="picker__nav" aria-label="Mes anterior" disabled={view === 0} onClick={() => moveTo(view - 1, focusDay)}>
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
            </button>
            <span className="picker__title" aria-live="polite">{MONTHS[view]} 2027</span>
            <button type="button" className="picker__nav" aria-label="Mes siguiente" disabled={view === 11} onClick={() => moveTo(view + 1, focusDay)}>
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
            </button>
          </div>
          <div className="picker__week" aria-hidden="true">
            {WEEKDAYS.map((w, i) => <span key={w + i}>{w}</span>)}
          </div>
          <div ref={gridRef} className="picker__grid" role="group" aria-label={`Días de ${MONTHS[view]}`} onKeyDown={onGridKey}>
            {cells.map((d, i) => (d ? (
              <button
                key={i}
                type="button"
                data-day={d}
                className="picker__day"
                tabIndex={d === focusDay ? 0 : -1}
                aria-pressed={value && value.m === view && value.d === d ? 'true' : 'false'}
                aria-label={`${d} de ${MONTHS[view]} de 2027`}
                onClick={() => { onChange({ m: view, d }); close(true); }}
              >
                {d}
              </button>
            ) : <span key={i} aria-hidden="true" />))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

// Pieza 2 · El calendario de sobremesa 2027. Misma estructura que la agenda (pieza 1): título a
// toda anchura, objeto protagonista, texto y campo al lado; sobre gris papel para marcar el cambio.
export default function CalendarSection() {
  const [value, setValue] = useState(null);
  const [coarse, setCoarse] = useState(false);
  const flipRef = useRef(null);
  const objRef = useRef(null);
  const labelId = useId();

  useEffect(() => {
    setCoarse(window.matchMedia('(hover: none) and (pointer: coarse)').matches);
  }, []);

  // Al elegir una fecha, las hojas pasan en ráfaga hasta ese mes y el día queda marcado en azul claro.
  const choose = (v) => {
    setValue(v);
    if (!v) return;
    flipRef.current?.goTo(v.m);
    // En móvil el calendario queda por encima del campo: se trae a la vista para ver la ráfaga.
    const el = objRef.current;
    if (el && window.matchMedia('(max-width: 899px)').matches) {
      const r = el.getBoundingClientRect();
      if (r.top < 0 || r.bottom > window.innerHeight) {
        const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 64;
        setTimeout(() => scrollToTarget(r.top + window.scrollY - header - 16, { duration: 0.7 }), 60);
      }
    }
  };

  return (
    <section id="calendario" className="piece piece--calendar" data-tone="light" aria-labelledby="calendar-title">
      <div className="grid-page piece__grid">
        <SplitHeading className="piece__title" id="calendar-title">{COPY.calendar.title}</SplitHeading>
        <div ref={objRef} className="piece__object">
          <CalendarFlip ref={flipRef} marked={value} />
        </div>
        <Reveal variant="fade" className="piece__body">
          {COPY.calendar.body.map((p) => <p key={p}>{p}</p>)}
        </Reveal>
        <div className="field piece__field">
          <span className="field__label" id={labelId}>{COPY.calendar.fieldLabel}</span>
          {coarse ? (
            <input
              className="field__input field__input--date"
              type="date"
              min="2027-01-01"
              max="2027-12-31"
              aria-labelledby={labelId}
              value={value ? toISO(value.m, value.d) : ''}
              onChange={(e) => {
                const [y, m, d] = e.target.value.split('-').map(Number);
                choose(y === 2027 ? { m: m - 1, d } : null);
              }}
            />
          ) : (
            <DatePicker value={value} onChange={choose} labelId={labelId} />
          )}
        </div>
      </div>
    </section>
  );
}

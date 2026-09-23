'use client';

import { useRef, useState } from 'react';
import RollLabel from './RollLabel';
import { CONTACT, COPY } from '@/content/copy';

// CTA «Quiero hablarlo» (coro 8 y 17): abre el correo y, además, copia la dirección
// con el aviso «Correo copiado», por si no hay cliente de correo configurado.
export default function CtaMail({ variant = 'solid', size = 'lg', className = '' }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2400);
    } catch {
      // Sin permiso de portapapeles: el mailto sigue funcionando igual.
    }
  };

  return (
    <span className={`cta-wrap ${className}`}>
      <a
        className={`btn btn--${variant} btn--${size}`}
        href={`mailto:${CONTACT.email}`}
        onClick={onClick}
      >
        <RollLabel text={COPY.cierre.cta} />
      </a>
      <span className={`toast ${copied ? 'is-on' : ''}`} role="status" aria-live="polite">
        {copied ? COPY.cierre.copied : ''}
      </span>
    </span>
  );
}

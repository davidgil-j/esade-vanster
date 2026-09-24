'use client';

import Lockup from './Lockup';
import CtaPill from './CtaPill';
import { useToneAt } from '@/lib/useTone';

// Cabecera fija: el lockup cambia de archivo según el fondo que tiene debajo (sin recolorear).
// Mientras el lockup grande de la portada viaja hacia aquí, el de la cabecera espera escondido.
export default function Header() {
  const tone = useToneAt(() => 36, 'video');
  return (
    <header className={`site-header tone-${tone}`}>
      <a className="site-header__brand link" href="#top" aria-label="vänster × esade, inicio">
        <Lockup tone={tone === 'light' ? 'light' : 'dark'} />
      </a>
      <CtaPill className="site-header__cta" />
    </header>
  );
}

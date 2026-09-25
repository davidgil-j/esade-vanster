'use client';

import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

// La agenda en vídeo (agenda_video, 10 s, sin sonido): cerrada, se abre y se hojea. Como los vídeos de
// producto de L'Occitane: no descarga nada hasta estar a una pantalla, se reproduce en bucle en cuanto
// asoma y se para al salir. Con movimiento reducido, su primer fotograma quieto.
export default function AgendaVideo() {
  const ref = useRef(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || prefersReducedMotion()) return undefined;
    const near = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      video.preload = 'auto';
      video.load();
      near.disconnect();
    }, { rootMargin: '100% 0px' });
    const view = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    near.observe(video);
    view.observe(video);
    return () => { near.disconnect(); view.disconnect(); };
  }, []);

  return (
    <div className="media-frame media-frame--wide">
      <video
        ref={ref}
        className="media-frame__video"
        poster="/video/agenda-poster.webp"
        muted
        loop
        playsInline
        preload="none"
        disableRemotePlayback
        aria-label="La agenda 2027 de Esade: se abre y se hojea sobre la mesa"
      >
        <source src="/video/agenda.webm" type="video/webm" />
        <source src="/video/agenda.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

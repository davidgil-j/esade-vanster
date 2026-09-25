import SmoothScroll from '@/components/SmoothScroll';
import Loader from '@/components/Loader';
import Header from '@/components/Header';
import ProgressRail from '@/components/ProgressRail';
import Hero from '@/components/Hero';
import MarbleTitle from '@/components/MarbleTitle';
import Reveal from '@/components/Reveal';
import Comparator from '@/components/Comparator';
import AgendaSection from '@/components/AgendaSection';
import CalendarSection from '@/components/CalendarSection';
import Nosotros from '@/components/Nosotros';
import Cierre from '@/components/Cierre';
import FlyingLockup from '@/components/FlyingLockup';
import MarbleClosing from '@/components/MarbleClosing';
import { COPY } from '@/content/copy';

// Orden cerrado en la fase 1. Vänster habla (mármol, bordes líquidos); Esade se enseña (fotos de
// sus objetos, bordes rectos y lamas). Un apilado sin pin: «La idea» sube sobre la portada.
export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Loader />
      <Header />
      <ProgressRail />
      <main id="top">
        <div className="stack">
          <Hero />
          {/* La idea (habla Vänster) */}
          {/* Sin fondo propio: se lee sobre la portada ya teñida de mármol (Hero) */}
          <section id="idea" className="idea sec-marble" data-tone="marble" aria-labelledby="idea-title">
            <div className="grid-page idea__grid">
              <div className="idea__text">
                <MarbleTitle className="h2 h2--xl" id="idea-title" marble={false}>{COPY.idea.title}</MarbleTitle>
                <Reveal as="p" variant="fade" className="idea__body">{COPY.idea.body}</Reveal>
              </div>
              <Reveal className="idea__compare">
                <Comparator />
              </Reveal>
            </div>
          </section>
        </div>

        <AgendaSection />
        <CalendarSection />

        <MarbleClosing top={<Nosotros />}>
          <Cierre />
        </MarbleClosing>
      </main>
      <FlyingLockup />
    </>
  );
}

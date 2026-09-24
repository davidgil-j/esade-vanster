import SmoothScroll from '@/components/SmoothScroll';
import Loader from '@/components/Loader';
import Header from '@/components/Header';
import ProgressRail from '@/components/ProgressRail';
import Hero from '@/components/Hero';
import FlyingLockup from '@/components/FlyingLockup';
import MarbleLayer from '@/components/MarbleLayer';
import WordsHeading from '@/components/WordsHeading';
import Reveal from '@/components/Reveal';
import Comparator from '@/components/Comparator';
import AgendaSection from '@/components/AgendaSection';
import CalendarSection from '@/components/CalendarSection';
import MarcaSection from '@/components/MarcaSection';
import Nosotros from '@/components/Nosotros';
import Cierre from '@/components/Cierre';
import StackCover from '@/components/StackCover';
import { COPY } from '@/content/copy';

// Orden cerrado en la fase 1. Vänster habla (mármol, bordes líquidos); Esade se enseña (fotos de
// sus objetos, bordes rectos y lamas). Dos apilados sin pin: «La idea» sube sobre la portada y
// «Quiénes somos» sube sobre «Con vuestra marca».
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
          <section id="idea" className="idea sec-marble" data-tone="marble" aria-labelledby="idea-title">
            <MarbleLayer name="idea" edgeTop edgeBottom />
            <div className="grid-page idea__grid">
              <div className="idea__text">
                <WordsHeading className="h2 h2--xl" id="idea-title">
                  {COPY.idea.title.split(/(?<=\.)\s+/).map((s) => (
                    <span key={s} className="idea__title-line">{s} </span>
                  ))}
                </WordsHeading>
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

        <div className="stack">
          <StackCover over="#nosotros">
            <MarcaSection />
          </StackCover>
          <Nosotros />
        </div>

        <Cierre />
      </main>
      <FlyingLockup />
    </>
  );
}

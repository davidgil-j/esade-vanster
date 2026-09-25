import Lockup from './Lockup';

// La isla: «vänster × esade» flotando arriba en el centro, en una píldora clara translúcida, con los
// logos oficiales en color (vänster en su fucsia, esade en su azul). Es el mismo en toda la página:
// no cambia con el fondo ni lleva botones (el «Quiero hablarlo» vive solo en el cierre). Pulsarla
// vuelve al inicio. Al principio no se ve: el lockup grande de la portada viaja hasta aquí al bajar
// (FlyingLockup) y la píldora aparece a la vez; al llegar, la isla toma el relevo.
export default function Header() {
  return (
    <header className="island" data-print="hide">
      <a className="island__pill press" href="#top" aria-label="vänster × esade, volver al inicio">
        <Lockup tone="light" />
      </a>
    </header>
  );
}

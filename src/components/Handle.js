// El tirador: un solo componente para los cuatro sitios que se arrastran o se pulsan
// (deslizable del cierre, comparador, borde de la tapa y meses del calendario).
// Círculo de 44 px en tinta con filete blanco de 1 px y flecha de 1,5 px en el amarillo de la
// veta del mármol (8,9:1 sobre la tinta). La flecha se desplaza 0,75 px hacia la punta para que
// se vea centrada (centro óptico, no matemático).
const PATHS = {
  left: 'M24.25 15.5 17.75 22l6.5 6.5',
  right: 'M19.75 15.5 26.25 22l-6.5 6.5',
  up: 'M15.5 24.25 22 17.75l6.5 6.5',
  down: 'M15.5 19.75 22 26.25l6.5-6.5',
  both: 'M18.5 16.5 13 22l5.5 5.5M25.5 16.5 31 22l-5.5 5.5',
};

export default function Handle({ dir = 'right', className = '' }) {
  return (
    <span className={`handle ${className}`} aria-hidden="true">
      <svg viewBox="0 0 44 44" width="44" height="44">
        <path className="handle__arrow" d={PATHS[dir]} />
      </svg>
    </span>
  );
}

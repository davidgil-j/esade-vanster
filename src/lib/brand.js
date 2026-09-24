// Colores de marca. Vänster habla (la página); Esade se enseña (los objetos).
// Fuentes: marca/vanster/LEEME.md y marca/esade.md (manual Esade 2026, p. 10).

export const VANSTER = '#C40452';

export const ESADE = {
  dark: '#000B3D',
  light: '#224BA0',
  white: '#FFFFFF',
};

export const LOGOS = {
  esadeBlue: '/brand/esade-logo.svg',
  esadeWhite: '/brand/esade-logo-blanco.svg',
  // Vectoriales, sacados tal cual del PDF de aplicaciones de Vänster (marca/vanster/LEEME.md)
  vansterColor: '/brand/vanster-logotipo-fucsia.svg',
  vansterWhite: '/brand/vanster-logotipo-blanco.svg',
};

// Proporciones de los logos (px del archivo original)
export const ESADE_LOGO_RATIO = 196 / 393;
export const VANSTER_LOGO_RATIO = 26.68 / 133;

export const tanDeg = (deg) => Math.tan((deg * Math.PI) / 180);

// Doce hojas del calendario. Cada hoja es una pieza de Esade: como mucho 3 colores
// (el cuadro de la fecha marcada va en azul claro, así que solo azules y blanco),
// diagonales de 5, 10 o 15 grados medidas desde la horizontal, una o dos por hoja.
export const MONTH_DESIGNS = [
  { bg: 'dark', band: 'light', angle: 10, dir: 'up', second: null, logo: 'white' },
  { bg: 'light', band: 'dark', angle: 5, dir: 'down', second: null, logo: 'white' },
  { bg: 'white', band: 'light', angle: 15, dir: 'up', second: 'dark', logo: 'blue' },
  { bg: 'dark', band: 'light', angle: 5, dir: 'up', second: null, logo: 'white' },
  { bg: 'light', band: 'dark', angle: 15, dir: 'down', second: null, logo: 'white' },
  { bg: 'white', band: 'dark', angle: 10, dir: 'down', second: 'light', logo: 'blue' },
  { bg: 'dark', band: 'light', angle: 15, dir: 'down', second: null, logo: 'white' },
  { bg: 'light', band: 'dark', angle: 10, dir: 'up', second: null, logo: 'white' },
  { bg: 'white', band: 'light', angle: 5, dir: 'down', second: 'dark', logo: 'blue' },
  { bg: 'dark', band: 'light', angle: 10, dir: 'down', second: null, logo: 'white' },
  { bg: 'light', band: 'dark', angle: 5, dir: 'up', second: null, logo: 'white' },
  { bg: 'white', band: 'dark', angle: 15, dir: 'up', second: 'light', logo: 'blue' },
];

// Días del mes de 2027, con el hueco inicial para que la semana empiece en lunes.
export function monthGrid(month) {
  const first = new Date(2027, month, 1);
  const days = new Date(2027, month + 1, 0).getDate();
  const offset = (first.getDay() + 6) % 7; // lunes = 0
  const cells = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);
  while (cells.length % 7) cells.push(null);
  return cells;
}

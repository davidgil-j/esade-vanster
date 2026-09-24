// Renderiza los diseños planos de Esade a su resolución final, desde SVG, con el logo oficial.
// Uso: node scripts/render-designs.cjs   (necesita Playwright; lee design/fotos/esquinas.json)
// Salida: design/fotos/disenos/*.png y design/fotos/disenos/meta.json (casillas de los días y
// comprobación de que ninguna diagonal toca el nombre del mes).
// Piezas de Esade: solo #000B3D, #224BA0 y blanco; diagonales de 5, 10 o 15 grados; el logo
// nunca se estira (se recoloca la composición según la proporción real de cada soporte).
const path = require('path');
const fs = require('fs');
const { chromium } = require(process.env.PW || '/Users/davidgiljaques/Documents/GitHub/L-OCCITANE/node_modules/playwright');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'design/fotos/disenos');
fs.mkdirSync(OUT, { recursive: true });
// El logo oficial va incrustado (data URI) para que la página en blanco de Playwright lo cargue.
const dataUri = (f) => 'data:image/svg+xml;base64,' + fs.readFileSync(path.join(ROOT, f)).toString('base64');
const LOGO_W = dataUri('marca/esade/esade-logo-blanco.svg');
const LOGO_B = dataUri('marca/esade/esade-logo.svg');
const LOGO_RATIO = 196 / 393;
const C = { dark: '#000B3D', light: '#224BA0', white: '#FFFFFF' };
const tan = (d) => Math.tan((d * Math.PI) / 180);
const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const WEEK = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const FONTS = '<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Mulish:wght@400;600;700&display=swap" rel="stylesheet">';

const corners = JSON.parse(fs.readFileSync(path.join(ROOT, 'design/fotos/esquinas.json'), 'utf8'));
const PAGE_RATIO = corners['agenda-abierta'].quads.derecha.ratio_wh; // ≈ 0,77 (la tapa es de la misma agenda)
const SHEET_RATIO = corners.calendario.quads.hoja.ratio_wh; // ≈ 1,45

// ── Tapa de Esade (sin nombre: el nombre va en HTML encima) ──
function coverEsade(W) {
  const H = Math.round(W / PAGE_RATIO);
  const y0 = H * 0.8;
  const y1 = y0 - W * tan(10);
  const lw = W * 0.4;
  return {
    W, H, svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <rect width="${W}" height="${H}" fill="${C.dark}"/>
    <polygon points="0,${y0} ${W},${y1} ${W},${H} 0,${H}" fill="${C.light}"/>
    <image href="${LOGO_W}" x="${W * 0.12}" y="${H * 0.09}" width="${lw}" height="${lw * LOGO_RATIO}"/>
    <text x="${W * 0.88}" y="${H * 0.94}" text-anchor="end" fill="${C.white}" font-family="Montserrat" font-weight="700" font-size="${W * 0.062}">2027</text>
  </svg>`,
    // zona del nombre (fracciones de la tapa): línea base y tamaño relativos al ancho
    name: { x: 0.12, baseline: 0.6, size: 0.072, maxW: 0.72 },
  };
}

// ── Tapa de catálogo: polipiel negra, goma y el logo oficial blanco pequeño en una esquina ──
function coverCatalogo(W) {
  const H = Math.round(W / PAGE_RATIO);
  const lw = W * 0.2;
  return {
    W, H, svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs><pattern id="g" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#2A292E"/><circle cx="2" cy="2" r="0.9" fill="#323137"/></pattern></defs>
    <rect width="${W}" height="${H}" fill="url(#g)"/>
    <rect x="${W * 0.86}" y="0" width="${W * 0.045}" height="${H}" fill="#1B1A1E"/>
    <rect x="${W * 0.86}" y="0" width="${W * 0.006}" height="${H}" fill="#3A3940"/>
    <image href="${LOGO_W}" x="${W * 0.62}" y="${H * 0.86}" width="${lw}" height="${lw * LOGO_RATIO}"/>
  </svg>`,
  };
}

// ── Interior de la tapa (guarda): azul claro liso ──
function endpaper(W) {
  const H = Math.round(W / PAGE_RATIO);
  return { W, H, svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="${C.light}"/></svg>` };
}

// ── Semana del 4 al 10 de enero de 2027, en una página ──
function week(W) {
  const H = Math.round(W / PAGE_RATIO);
  const m = W * 0.09;
  const top = H * 0.1;
  const rowH = (H * 0.86) / 7;
  const days = [[4, 'lunes'], [5, 'martes'], [6, 'miércoles'], [7, 'jueves'], [8, 'viernes'], [9, 'sábado'], [10, 'domingo']];
  let rows = '';
  days.forEach(([n, name], i) => {
    const y = top + rowH * i;
    rows += `<text x="${m}" y="${y + rowH * 0.42}" fill="${C.dark}" font-family="Montserrat" font-weight="700" font-size="${W * 0.06}">${n}</text>
      <text x="${m + W * 0.11}" y="${y + rowH * 0.42}" fill="${C.dark}" font-family="Mulish" font-weight="600" font-size="${W * 0.03}">${name}</text>
      <line x1="${m}" y1="${y + rowH * 0.72}" x2="${W - m}" y2="${y + rowH * 0.72}" stroke="${C.light}" stroke-width="${W * 0.0011}"/>
      <line x1="${m}" y1="${y + rowH * 0.98}" x2="${W - m}" y2="${y + rowH * 0.98}" stroke="${C.light}" stroke-width="${W * 0.0011}"/>`;
  });
  return {
    W, H, svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <rect width="${W}" height="${H}" fill="${C.white}"/>
    <text x="${m}" y="${H * 0.065}" fill="${C.light}" font-family="Montserrat" font-weight="700" font-size="${W * 0.032}">enero 2027</text>
    ${rows}
  </svg>`,
  };
}

// ── Hoja del calendario: panel de diseño y panel del mes, con margen arriba para las anillas ──
const DESIGNS = [
  { bg: 'dark', band: 'light', angle: 10, dir: 'up', second: null },
  { bg: 'light', band: 'dark', angle: 5, dir: 'down', second: null },
  { bg: 'white', band: 'light', angle: 15, dir: 'up', second: 'dark' },
  { bg: 'dark', band: 'light', angle: 5, dir: 'up', second: null },
  { bg: 'light', band: 'dark', angle: 15, dir: 'down', second: null },
  { bg: 'white', band: 'dark', angle: 10, dir: 'down', second: 'light' },
  { bg: 'dark', band: 'light', angle: 15, dir: 'down', second: null },
  { bg: 'light', band: 'dark', angle: 10, dir: 'up', second: null },
  { bg: 'white', band: 'light', angle: 5, dir: 'down', second: 'dark' },
  { bg: 'dark', band: 'light', angle: 10, dir: 'down', second: null },
  { bg: 'light', band: 'dark', angle: 5, dir: 'up', second: null },
  { bg: 'white', band: 'dark', angle: 15, dir: 'up', second: 'light' },
];

function monthCells(month) {
  const first = new Date(2027, month, 1);
  const days = new Date(2027, month + 1, 0).getDate();
  const offset = (first.getDay() + 6) % 7;
  const cells = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);
  while (cells.length % 7) cells.push(null);
  return cells;
}

function sheet(month, W) {
  const H = Math.round(W / SHEET_RATIO);
  const RING = H * 0.085; // franja superior de las anillas, en blanco
  const PW = W * 0.46; // panel de diseño
  const d = DESIGNS[month];
  const bg = C[d.bg];
  const fg = d.bg === 'white' ? C.dark : C.white;
  const nameSize = PW * 0.12;
  const nameX = PW * 0.1;
  const nameY = RING + (H - RING) * 0.5;
  // la banda empieza por debajo del nombre, sea cual sea el ángulo y el sentido
  const clear = nameY + nameSize * 0.45 + PW * 0.06; // aire mínimo bajo el nombre (descendentes incluidos)
  const rise = PW * tan(d.angle);
  const nameEnd = PW * 0.92;
  const y0 = d.dir === 'up' ? Math.max(RING + (H - RING) * 0.66, clear + nameEnd * tan(d.angle)) : Math.max(RING + (H - RING) * 0.66, clear + rise - nameX * tan(d.angle));
  const band = d.dir === 'up'
    ? `0,${y0} ${PW},${y0 - rise} ${PW},${H} 0,${H}`
    : `0,${y0 - rise} ${PW},${y0} ${PW},${H} 0,${H}`;
  let second = '';
  if (d.second) {
    const y2 = Math.max(RING + (H - RING) * 0.86, y0 + H * 0.05);
    const r2 = PW * tan(5);
    second = d.dir === 'up' ? `<polygon points="0,${y2 - r2} ${PW},${y2} ${PW},${H} 0,${H}" fill="${C[d.second]}"/>` : `<polygon points="0,${y2} ${PW},${y2 - r2} ${PW},${H} 0,${H}" fill="${C[d.second]}"/>`;
  }
  const lw = PW * 0.34;
  const logo = d.bg === 'white' ? LOGO_B : LOGO_W;
  // panel del mes
  const mx = PW + W * 0.035;
  const mw = W - PW - W * 0.07;
  const colW = mw / 7;
  const gridTop = RING + (H - RING) * 0.2;
  const rowH = (H - RING) * 0.12;
  const cells = monthCells(month);
  const meta = [];
  let grid = WEEK.map((w, i) => `<text x="${mx + colW * (i + 0.5)}" y="${gridTop}" text-anchor="middle" fill="${C.light}" font-family="Mulish" font-weight="700" font-size="${W * 0.016}">${w}</text>`).join('');
  cells.forEach((day, i) => {
    if (!day) return;
    const col = i % 7;
    const row = Math.floor(i / 7);
    const cx = mx + colW * (col + 0.5);
    const cy = gridTop + rowH * (row + 0.85);
    grid += `<text x="${cx}" y="${cy}" text-anchor="middle" fill="${C.dark}" font-family="Mulish" font-weight="600" font-size="${W * 0.021}">${day}</text>`;
    meta.push({ day, x: (cx - colW * 0.42) / W, y: (cy - rowH * 0.66) / H, w: (colW * 0.84) / W, h: (rowH * 0.88) / H, cx: cx / W, cy: cy / H });
  });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <rect width="${W}" height="${H}" fill="${C.white}"/>
    <rect x="0" y="${RING}" width="${PW}" height="${H - RING}" fill="${bg}"/>
    <polygon id="band" points="${band.replace(/(\d+(?:\.\d+)?),(\d+(?:\.\d+)?)/g, (m, x, y) => `${x},${Math.max(RING, +y)}`)}" fill="${C[d.band]}"/>
    ${second}
    <image href="${logo}" x="${PW * 0.1}" y="${RING + (H - RING) * 0.09}" width="${lw}" height="${lw * LOGO_RATIO}"/>
    <text id="mname" x="${nameX}" y="${nameY}" fill="${fg}" font-family="Montserrat" font-weight="700" font-size="${nameSize}" letter-spacing="-0.02em">${MONTHS[month]}</text>
    <text x="${W - W * 0.035}" y="${RING + (H - RING) * 0.1}" text-anchor="end" fill="${C.light}" font-family="Montserrat" font-weight="700" font-size="${W * 0.02}">2027</text>
    ${grid}
  </svg>`;
  return { W, H, svg, meta, month };
}

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  const render = async (name, spec) => {
    await p.setViewportSize({ width: spec.W, height: spec.H });
    await p.setContent(`<html><head>${FONTS}<style>html,body{margin:0;background:transparent}</style></head><body>${spec.svg}</body></html>`, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(150);
    await p.screenshot({ path: path.join(OUT, `${name}.png`), clip: { x: 0, y: 0, width: spec.W, height: spec.H } });
  };
  const cover = coverEsade(1540);
  await render('tapa-esade', cover);
  await render('tapa-catalogo', coverCatalogo(1540));
  await render('guarda', endpaper(770));
  await render('semana', week(1540));
  const meta = { pageRatio: PAGE_RATIO, sheetRatio: SHEET_RATIO, coverName: cover.name, months: [] };
  for (let m = 0; m < 12; m++) {
    const s = sheet(m, 2400);
    await render(`hoja-${String(m + 1).padStart(2, '0')}`, s);
    // Comprobación: la caja del nombre del mes frente a la banda (y la segunda diagonal)
    const check = await p.evaluate(() => {
      const t = document.getElementById('mname').getBBox();
      const svg = document.querySelector('svg');
      let minGap = Infinity;
      document.querySelectorAll('polygon').forEach((poly) => {
        const pts = poly.getAttribute('points').trim().split(/\s+/).map((s) => s.split(',').map(Number));
        // borde superior de la banda: entre los dos primeros puntos
        const [a, b2] = [pts[0], pts[1]];
        for (let x = t.x; x <= t.x + t.width; x += 4) {
          const yTop = a[1] + ((b2[1] - a[1]) * (x - a[0])) / (b2[0] - a[0]);
          minGap = Math.min(minGap, yTop - (t.y + t.height));
        }
      });
      return { gap: Math.round(minGap), box: [Math.round(t.x), Math.round(t.y), Math.round(t.width), Math.round(t.height)] };
    });
    meta.months.push({ month: m, cells: s.meta, nameGapPx: check.gap });
    console.log(`hoja ${m + 1}: separación nombre-diagonal ${check.gap} px ${check.gap > 0 ? 'OK' : 'TOCA'}`);
  }
  fs.writeFileSync(path.join(OUT, 'meta.json'), JSON.stringify(meta, null, 1));
  await b.close();
  console.log('→', OUT);
})();

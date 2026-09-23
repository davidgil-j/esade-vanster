// Genera el render estático de la agenda (plan B de la firma) a partir del modelo 3D
// y la posición del nombre sobre la imagen. Uso: node scripts/render-agenda.cjs
// Requiere el servidor en http://localhost:3002 y Playwright (del proyecto L'Occitane).
const { chromium } = require(process.env.PW || '/Users/davidgiljaques/Documents/GitHub/L-OCCITANE/node_modules/playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

(async () => {
  const root = path.resolve(__dirname, '..');
  const b = await chromium.launch({ args: ['--use-angle=metal', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1400, height: 1100 }, deviceScaleFactor: 1.5 });
  await p.goto('http://localhost:3002/?render=agenda', { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: '.site-header{display:none!important}' });
  await p.locator('#agenda').scrollIntoViewIfNeeded();
  await p.waitForSelector('html[data-agenda-quad="ready"]', { timeout: 30000 });
  await p.waitForTimeout(800);
  const quad = await p.evaluate(() => window.__agendaQuad);
  const el = p.locator('.agenda3d');
  const png = path.join(root, 'public/agenda/render.png');
  await el.screenshot({ path: png, omitBackground: true });
  const box = await el.boundingBox();
  execFileSync('cwebp', ['-quiet', '-q', '84', '-alpha_q', '90', '-m', '6', png, '-o', path.join(root, 'public/agenda/render.webp')]);
  fs.unlinkSync(png);
  const round = (n) => Math.round(n * 10000) / 10000;
  const js = `// Render estático de la agenda (plan B de la firma en móvil sin WebGL y con movimiento
// reducido). Lo genera scripts/render-agenda.cjs a partir del propio modelo 3D.
// quad: esquinas de la zona del nombre sobre la imagen, en fracciones (x, y).
export const AGENDA_RENDER = {
  src: '/agenda/render.webp',
  aspect: '${Math.round(box.width)} / ${Math.round(box.height)}',
  quad: ${JSON.stringify(quad.map(([x, y]) => [round(x), round(y)]))},
};
`;
  fs.writeFileSync(path.join(root, 'src/content/agendaRender.js'), js);
  console.log('render ok', box, quad);
  await b.close();
})();

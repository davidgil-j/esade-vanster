// Mármol vivo de Vänster (PLAN.md · 5 · punto 9B). WebGL a mano, un solo quad por canvas.
// - La pintura fluye con dos capas de «domain warping» sobre la textura; ciclo visible de ~20 s.
// - La velocidad del scroll la agita hasta 3× y se calma con un muelle en ~1,2 s.
// - En escritorio, el cursor la remueve (radio de 180 px, estela que se disipa en 1 s).
// - Bordes líquidos opcionales arriba y abajo: una onda que ondula con el scroll (40 px / 20 px).
// - Se pausa fuera de pantalla; DPR ≤ 1,5 (1 en móvil); en móvil, media resolución y sin cursor.
// - Si el aparato no llega a 55 fps, avisa (onSlow) y la sección pasa a la imagen fija.
import { gsap } from 'gsap';

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform sampler2D uTex;
uniform sampler2D uNoise;
uniform vec2 uRes;      // tamaño del canvas en píxeles del dispositivo
uniform vec2 uTexSize;
uniform float uTime;
uniform float uScroll;  // posición del scroll (px CSS), mueve la onda
uniform float uAmp;     // amplitud de la onda (px del dispositivo); 0 = sin borde
uniform float uTop;     // 1 = borde líquido arriba
uniform float uBot;     // 1 = borde líquido abajo
uniform float uScale;   // px CSS -> px del dispositivo
uniform vec3 uTrail[8]; // estela del cursor: x, y (px del dispositivo, desde arriba) y fuerza
uniform float uRadius;  // radio del cursor (px del dispositivo)
uniform float uTrailN;  // puntos vivos de la estela (0 = el bucle no trabaja)

vec2 field(vec2 p) { return texture2D(uNoise, p).rg - 0.5; }

float wave(float x, float t, float s) {
  return sin(x * 0.0042 + s * 0.0021 + t * 0.21) * 0.55
       + sin(x * 0.0113 - s * 0.0016 + 1.3 + t * 0.13) * 0.3
       + sin(x * 0.0231 + s * 0.0009 + t * 0.34 + 4.0) * 0.15;
}

void main() {
  vec2 px = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y); // desde arriba
  // Encuadre «cover» de la textura en el canvas
  float ra = uRes.x / uRes.y;
  float ta = uTexSize.x / uTexSize.y;
  vec2 uv = px / uRes;
  vec2 sc = ra > ta ? vec2(1.0, ta / ra) : vec2(ra / ta, 1.0);
  uv = (uv - 0.5) * sc * 0.9 + 0.5; // 10 % de margen para que el flujo no llegue al borde

  // Flujo: dos capas de deformación del dominio, muy lentas
  vec2 p = px / uScale / 1400.0;
  float t = uTime;
  vec2 q = field(p * 0.9 + vec2(t * 0.011, -t * 0.007));
  vec2 r = field(p * 1.6 + q * 0.85 + vec2(-t * 0.009, t * 0.013));
  vec2 d = (q * 0.55 + r) * 0.085;

  // Cursor: remolino que se disipa
  for (int i = 0; i < 8; i++) {
    if (float(i) >= uTrailN) break;
    vec3 tr = uTrail[i];
    if (tr.z > 0.001) {
      vec2 dv = px - tr.xy;
      float w = tr.z * exp(-dot(dv, dv) / (uRadius * uRadius));
      d += w * vec2(-dv.y, dv.x) / uRadius * 0.022 * sc;
    }
  }

  vec3 col = texture2D(uTex, clamp(uv + d * sc, 0.001, 0.999)).rgb;

  // Bordes líquidos: la onda vive solo en la franja que sobresale de la sección (uAmp), así
  // nunca deja ver lo que hay debajo de la propia sección.
  float a = 1.0;
  if (uAmp > 0.0) {
    float xs = px.x / uScale;
    if (uTop > 0.5) {
      float w = 0.5 + 0.5 * wave(xs, t, uScroll);          // 0–1
      float b = uAmp * (0.96 - 0.86 * w);
      a *= smoothstep(b - 1.2, b + 1.2, px.y);
    }
    if (uBot > 0.5) {
      float w = 0.5 + 0.5 * wave(xs + 700.0, t * 1.1, -uScroll);
      float b = uRes.y - uAmp * (0.96 - 0.86 * w);
      a *= 1.0 - smoothstep(b - 1.2, b + 1.2, px.y);
    }
  }
  gl_FragColor = vec4(col * a, a);
}
`;

// Campo de ruido periódico y suave (suma de senos con frecuencias enteras), RG. Se calcula una
// sola vez para todos los lienzos y a 128×128: es tan suave que el filtro lineal lo interpola sin
// perder nada (antes, 256×256 por lienzo costaba cientos de ms con la CPU lenta).
let noiseCache = null;
function noiseTexture() {
  if (noiseCache) return noiseCache;
  const N = 128;
  const data = new Uint8Array(N * N * 4);
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const waves = () => {
    const out = [];
    for (let i = 0; i < 6; i++) {
      const f = 1 + Math.floor(rnd() * (i < 3 ? 2 : 4));
      const g = Math.floor(rnd() * 5) - 2;
      out.push([f, g === 0 ? 1 : g, rnd() * Math.PI * 2, 1 / (1 + i * 0.6)]);
    }
    return out;
  };
  const R = waves();
  const G = waves();
  let norm = 0;
  for (let i = 0; i < 6; i++) norm += R[i][3];
  const TAU = Math.PI * 2;
  for (let y = 0; y < N; y++) {
    const v = y / N;
    for (let x = 0; x < N; x++) {
      const u = x / N;
      let r = 0;
      let g = 0;
      for (let k = 0; k < 6; k++) {
        r += R[k][3] * Math.sin(TAU * (R[k][0] * u + R[k][1] * v) + R[k][2]);
        g += G[k][3] * Math.sin(TAU * (G[k][0] * u + G[k][1] * v) + G[k][2]);
      }
      const i = (y * N + x) * 4;
      data[i] = Math.round(127.5 + (127 * r) / norm);
      data[i + 1] = Math.round(127.5 + (127 * g) / norm);
      data[i + 3] = 255;
    }
  }
  noiseCache = { N, data };
  return noiseCache;
}

function loadImage(sources) {
  // sources: [avif, webp]; si el navegador no sabe AVIF, falla y pasa al siguiente
  return new Promise((resolve, reject) => {
    const tryAt = (i) => {
      if (i >= sources.length) { reject(new Error('marble')); return; }
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => resolve(img);
      img.onerror = () => tryAt(i + 1);
      img.src = sources[i];
    };
    tryAt(0);
  });
}

// Velocidad del scroll compartida por todos los canvas (px/s), medida en el reloj de GSAP.
let scrollVel = 0;
let lastY = null;
let velUsers = 0;
const velTick = (_t, dt) => {
  const y = window.scrollY;
  if (lastY !== null && dt > 0) scrollVel = ((y - lastY) / dt) * 1000;
  lastY = y;
};

export class Marble {
  constructor(canvas, { sources, edgeTop = false, edgeBottom = false, amp = 40, mobile = false, cursor = true, onSlow, onReady, speed = 1 }) {
    this.canvas = canvas;
    this.mobile = mobile;
    this.cursor = cursor && !mobile;
    this.edgeTop = edgeTop;
    this.edgeBottom = edgeBottom;
    this.amp = amp;
    this.onSlow = onSlow;
    this.speed = speed; // multiplicador externo (la pantalla de carga lo usa para la carga real)
    this.visible = false;
    this.time = Math.random() * 40;
    this.agitation = 1;
    this.agitationV = 0;
    this.trail = [];
    this.frames = [];
    this.alive = true;
    this.ready = false;

    const opts = { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, powerPreference: 'high-performance' };
    const gl = canvas.getContext('webgl', opts);
    if (!gl) throw new Error('no-webgl');
    this.gl = gl;
    this.program = this.makeProgram(VERT, FRAG);
    gl.useProgram(this.program);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(this.program, 'aPos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    this.u = {};
    ['uTex', 'uNoise', 'uRes', 'uTexSize', 'uTime', 'uScroll', 'uAmp', 'uTop', 'uBot', 'uScale', 'uTrail', 'uRadius', 'uTrailN'].forEach((n) => {
      this.u[n] = gl.getUniformLocation(this.program, n);
    });

    // Ruido
    const { N, data } = noiseTexture();
    this.noise = gl.createTexture();
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.noise);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, N, N, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.uniform1i(this.u.uNoise, 1);
    gl.uniform1i(this.u.uTex, 0);

    // GPU: temporizador si el navegador lo expone (para la traza de rendimiento)
    this.timerExt = gl.getExtension('EXT_disjoint_timer_query');
    this.gpuSamples = [];
    this.drawn = 0;

    this.resize = this.resize.bind(this);
    this.tick = this.tick.bind(this);
    this.onMove = this.onMove.bind(this);
    this.ro = new ResizeObserver(this.resize);
    this.ro.observe(canvas);
    this.io = new IntersectionObserver(([e]) => {
      this.visible = e.isIntersecting;
      if (this.visible) this.frames = [];
    }, { rootMargin: '80px 0px' });
    this.io.observe(canvas);
    if (this.cursor) window.addEventListener('pointermove', this.onMove, { passive: true });
    if (velUsers++ === 0) gsap.ticker.add(velTick);
    gsap.ticker.add(this.tick);

    loadImage(sources).then((img) => {
      if (!this.alive) return;
      this.texSize = [img.naturalWidth, img.naturalHeight];
      this.tex = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.tex);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.uniform2f(this.u.uTexSize, img.naturalWidth, img.naturalHeight);
      this.ready = true;
      this.resize(); // ya se sabe el tamaño de la textura: resolución interna ajustada
      this.draw();
      onReady?.();
    }).catch(() => onSlow?.('texture'));
  }

  makeProgram(vs, fs) {
    const gl = this.gl;
    const sh = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
      return s;
    };
    const p = gl.createProgram();
    gl.attachShader(p, sh(gl.VERTEX_SHADER, vs));
    gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    return p;
  }

  resize() {
    // Solo al cambiar de tamaño: nada de leer el layout dentro del bucle.
    const r = this.canvas.getBoundingClientRect();
    // Como mucho 1 píxel de dispositivo por píxel CSS (en retina, 4 veces menos trabajo que a 2×; la
    // textura es suave y no se nota). Si el equipo va justo, baja un escalón más (lowRes).
    const dpr = this.lowRes ? 0.6 : 1;
    const k = this.mobile ? 0.5 : 1; // en móvil, media resolución interna
    // Nunca más píxeles de los que tiene la textura en ese encuadre (un poco menos: la textura ya es
    // suave y el filtro lineal la reparte): por encima no se gana detalle y la tarjeta gráfica
    // trabaja de más (presupuesto: 1 ms por fotograma).
    let texCap = Infinity;
    if (this.texSize) {
      const [tw, th] = this.texSize;
      texCap = 0.95 * Math.min((0.9 * tw) / r.width, (0.9 * th) / r.height);
    }
    this.scale = Math.max(0.5, Math.min(dpr * k, texCap));
    this.canvas.width = Math.max(2, Math.round(r.width * this.scale));
    this.canvas.height = Math.max(2, Math.round(r.height * this.scale));
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    if (this.ready) this.draw();
  }

  onMove(e) {
    if (!this.visible) return;
    // Posición relativa al canvas medida en el momento: la capa del cierre es sticky (se queda fija
    // en la pantalla mientras la página baja) y la posición guardada + el scroll la desfasaba.
    // Una lectura por movimiento, sin escrituras en medio: no fuerza maquetación.
    const r = this.canvas.getBoundingClientRect();
    const x = (e.clientX - r.left) * this.scale;
    const y = (e.clientY - r.top) * this.scale;
    const last = this.trail[this.trail.length - 1];
    if (last && Math.hypot(last.x - x, last.y - y) < 12 * this.scale) return;
    this.trail.push({ x, y, life: 1 });
    if (this.trail.length > 8) this.trail.shift();
  }

  tick(_t, deltaTime) {
    if (!this.alive || !this.ready || !this.visible || this.paused || document.hidden) return;
    const dt = Math.min(deltaTime, 50) / 1000;
    // Agitación por el scroll: de 1 a 1,4× como mucho, con un muelle críticamente amortiguado (~1,2 s)
    const target = 1 + Math.min(0.4, Math.abs(scrollVel) / 4000);
    const w = 4;
    const acc = w * w * (target - this.agitation) - 2 * w * this.agitationV;
    this.agitationV += acc * dt;
    this.agitation += this.agitationV * dt;
    this.time += dt * this.agitation * this.speed * 0.6;
    this.trail.forEach((p) => { p.life -= dt * 1.4; });
    this.trail = this.trail.filter((p) => p.life > 0);
    this.draw();
    // Vigilancia de rendimiento: si la mediana de 90 fotogramas baja de 50 fps, se baja la resolución
    // interna una vez, sin cambiar de aspecto. Antes se cambiaba a una imagen fija a mitad de vista (un
    // salto visible: parecía que el mármol «se rompía»). Solo con 30 fps o menos pasa a imagen fija.
    if (this.frames.length < 90) {
      this.frames.push(deltaTime);
      if (this.frames.length === 90) {
        const sorted = [...this.frames].sort((a, b) => a - b);
        const fps = 1000 / sorted[45];
        if (fps < 30 && this.lowRes) this.onSlow?.('fps');
        else if (fps < 50 && !this.lowRes) { this.lowRes = true; this.resize(); this.frames = []; }
      }
    }
  }

  draw() {
    const gl = this.gl;
    const u = this.u;
    let q = null;
    this.drawn += 1;
    // Medida de la GPU: se descartan los 12 primeros fotogramas (subida de la textura y compilación)
    if (this.timerExt && this.drawn > 12 && this.gpuSamples.length < 120 && !this.pendingQuery) {
      this.pendingQuery = true;
      q = this.timerExt.createQueryEXT();
      this.timerExt.beginQueryEXT(this.timerExt.TIME_ELAPSED_EXT, q);
    }
    gl.uniform2f(u.uRes, this.canvas.width, this.canvas.height);
    gl.uniform1f(u.uTime, this.time);
    gl.uniform1f(u.uScroll, window.scrollY);
    gl.uniform1f(u.uScale, this.scale || 1);
    gl.uniform1f(u.uAmp, (this.edgeTop || this.edgeBottom) ? this.amp * (this.scale || 1) : 0);
    gl.uniform1f(u.uTop, this.edgeTop ? 1 : 0);
    gl.uniform1f(u.uBot, this.edgeBottom ? 1 : 0);
    gl.uniform1f(u.uRadius, 180 * (this.scale || 1));
    const arr = new Float32Array(24);
    this.trail.forEach((p, i) => {
      arr[i * 3] = p.x;
      arr[i * 3 + 1] = p.y;
      arr[i * 3 + 2] = Math.max(0, p.life) ** 2; // se disipa en 1 s
    });
    gl.uniform3fv(u.uTrail, arr);
    gl.uniform1f(u.uTrailN, this.trail.length);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    if (q) {
      this.timerExt.endQueryEXT(this.timerExt.TIME_ELAPSED_EXT);
      const ext = this.timerExt;
      const poll = () => {
        if (!this.alive) return;
        if (ext.getQueryObjectEXT(q, ext.QUERY_RESULT_AVAILABLE_EXT)) {
          this.pendingQuery = false;
          if (!gl.getParameter(ext.GPU_DISJOINT_EXT)) this.gpuSamples.push(ext.getQueryObjectEXT(q, ext.QUERY_RESULT_EXT) / 1e6);
          ext.deleteQueryEXT(q);
          if (typeof window !== 'undefined') {
            window.__marbleGpu = window.__marbleGpu || {};
            window.__marbleGpu[this.canvas.dataset.name || 'marble'] = this.gpuSamples.slice();
          }
        } else requestAnimationFrame(poll);
      };
      requestAnimationFrame(poll);
    }
  }

  destroy() {
    this.alive = false;
    gsap.ticker.remove(this.tick);
    if (--velUsers === 0) { gsap.ticker.remove(velTick); lastY = null; }
    this.ro.disconnect();
    this.io.disconnect();
    window.removeEventListener('pointermove', this.onMove);
    this.gl.getExtension('WEBGL_lose_context')?.loseContext();
  }
}

export const MARBLE = {
  // El de la web: comprimido hacia el fucsia #C40452 (scripts/marmol.py)
  fucsia: {
    wide: ['/marmol/marmol-fucsia-texto-16x9.avif', '/marmol/marmol-fucsia-texto-16x9.webp'],
    tall: ['/marmol/marmol-fucsia-texto-9x16.avif', '/marmol/marmol-fucsia-texto-9x16.webp'],
    wideMobile: ['/marmol/marmol-fucsia-texto-16x9-movil.avif', '/marmol/marmol-fucsia-texto-16x9-movil.webp'],
    tallMobile: ['/marmol/marmol-fucsia-texto-9x16-movil.avif', '/marmol/marmol-fucsia-texto-9x16-movil.webp'],
  },
  texto: {
    wide: ['/marmol/marmol-texto-16x9.avif', '/marmol/marmol-texto-16x9.webp'],
    tall: ['/marmol/marmol-texto-9x16.avif', '/marmol/marmol-texto-9x16.webp'],
    // en móvil se pinta a media resolución: basta la textura a la mitad (36 KB en vez de 108)
    wideMobile: ['/marmol/marmol-texto-16x9-movil.avif', '/marmol/marmol-texto-16x9-movil.webp'],
    tallMobile: ['/marmol/marmol-texto-9x16-movil.avif', '/marmol/marmol-texto-9x16-movil.webp'],
  },
  normal: {
    wide: ['/marmol/marmol-16x9.avif', '/marmol/marmol-16x9.webp'],
    tall: ['/marmol/marmol-9x16.avif', '/marmol/marmol-9x16.webp'],
  },
};

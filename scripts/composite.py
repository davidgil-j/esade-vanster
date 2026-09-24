"""
Composición de los diseños de Esade sobre las fotos de producto (PLAN.md · rediseño final, punto 5).

Uso (con OpenCV):  python scripts/composite.py corners   → afina esquinas y guarda design/fotos/esquinas.json
                   python scripts/composite.py compose   → compone con los diseños ya renderizados

Reglas:
  - Fotos ampliadas ×2 antes de componer (design/fotos/x2, Real-ESRGAN x4plus y Lanczos a la mitad).
  - El diseño se renderiza a su resolución final desde los SVG reales (scripts/render-designs.cjs);
    el logo nunca se amplía ni se estira: si la proporción real no es la del diseño, se recoloca.
  - Mapa de luz = luminancia del papel / su percentil 95. Se multiplica el diseño por el mapa.
  - Color: en la zona mejor iluminada, #000B3D y #224BA0 a menos de ΔE 3 (se mide y se apunta).
"""
import json
import sys
from pathlib import Path

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
FOTOS = ROOT / 'design' / 'fotos'
X2 = FOTOS / 'x2'
OUT_PUBLIC = ROOT / 'public' / 'fotos'
DEBUG = ROOT / 'design' / 'fotos' / 'debug'

# Esquinas aproximadas (a ojo sobre la rejilla, píxeles de la foto ×2), en orden
# arriba-izquierda, arriba-derecha, abajo-derecha, abajo-izquierda. Se afinan con los bordes.
APPROX = {
    'agenda-cerrada': {'tapa': [(714, 426), (1854, 164), (2496, 1454), (1240, 1812)]},
    'agenda-abierta': {
        'izquierda': [(440, 292), (1508, 292), (1508, 1690), (430, 1690)],
        'derecha': [(1542, 292), (2612, 292), (2632, 1690), (1542, 1690)],
    },
    'calendario': {'hoja': [(676, 424), (2432, 446), (2412, 1670), (622, 1622)]},
}
# Bordes que no se afinan porque los tapa la espiral (se quedan en la línea aproximada).
SKIP = {('agenda-abierta', 'izquierda', 1), ('agenda-abierta', 'derecha', 3), ('calendario', 'hoja', 0)}


def luminance(img):
    return cv2.cvtColor(img, cv2.COLOR_BGR2GRAY).astype(np.float32)


def refine_edge(gray, p, q, search=36, samples=60):
    """Busca el borde real cerca del segmento p-q: máximo del gradiente perpendicular."""
    p = np.array(p, np.float32)
    q = np.array(q, np.float32)
    d = q - p
    length = np.linalg.norm(d)
    t = d / length
    n = np.array([-t[1], t[0]], np.float32)
    gx = cv2.Sobel(gray, cv2.CV_32F, 1, 0, ksize=3)
    gy = cv2.Sobel(gray, cv2.CV_32F, 0, 1, ksize=3)
    pts = []
    h, w = gray.shape
    for s in np.linspace(0.08, 0.92, samples):
        c = p + d * s
        best, bestv = None, 0
        for k in np.arange(-search, search + 1, 0.5):
            x, y = c + n * k
            if not (1 <= x < w - 1 and 1 <= y < h - 1):
                continue
            g = abs(gx[int(y), int(x)] * n[0] + gy[int(y), int(x)] * n[1])
            if g > bestv:
                bestv, best = g, (x, y)
        if best is not None and bestv > 25:
            pts.append(best)
    if len(pts) < samples * 0.35:
        return None
    pts = np.array(pts, np.float32)
    vx, vy, x0, y0 = cv2.fitLine(pts, cv2.DIST_HUBER, 0, 0.01, 0.01).flatten()
    return (x0, y0, vx, vy)


def line_from_points(p, q):
    p = np.array(p, np.float32)
    q = np.array(q, np.float32)
    d = (q - p) / np.linalg.norm(q - p)
    return (p[0], p[1], d[0], d[1])


def intersect(l1, l2):
    x1, y1, dx1, dy1 = l1
    x2, y2, dx2, dy2 = l2
    A = np.array([[dx1, -dx2], [dy1, -dy2]], np.float64)
    b = np.array([x2 - x1, y2 - y1], np.float64)
    s, _ = np.linalg.solve(A, b)
    return (float(x1 + dx1 * s), float(y1 + dy1 * s))


def corners():
    result = {}
    DEBUG.mkdir(parents=True, exist_ok=True)
    for photo, quads in APPROX.items():
        img = cv2.imread(str(X2 / f'{photo}.png'))
        gray = cv2.GaussianBlur(luminance(img), (0, 0), 1.2)
        vis = img.copy()
        result[photo] = {'size': [img.shape[1], img.shape[0]], 'quads': {}}
        for name, q in quads.items():
            lines = []
            for i in range(4):
                p, r = q[i], q[(i + 1) % 4]
                refined = None if (photo, name, i) in SKIP else refine_edge(gray, p, r)
                lines.append(refined if refined is not None else line_from_points(p, r))
                if refined is None:
                    print(f'  {photo}/{name}: borde {i} sin afinar (se queda el aproximado)')
            pts = [intersect(lines[(i - 1) % 4], lines[i]) for i in range(4)]
            # Proporción real tras rectificar (media de lados opuestos)
            wlen = (np.linalg.norm(np.subtract(pts[1], pts[0])) + np.linalg.norm(np.subtract(pts[2], pts[3]))) / 2
            hlen = (np.linalg.norm(np.subtract(pts[3], pts[0])) + np.linalg.norm(np.subtract(pts[2], pts[1]))) / 2
            ratio = wlen / hlen
            result[photo]['quads'][name] = {'px': [[round(x, 1), round(y, 1)] for x, y in pts], 'ratio_wh': round(ratio, 4)}
            cv2.polylines(vis, [np.array(pts, np.int32)], True, (0, 0, 255), 3)
            for x, y in pts:
                cv2.circle(vis, (int(x), int(y)), 14, (0, 200, 0), 3)
            print(f'{photo}/{name}: esquinas {[(round(x), round(y)) for x, y in pts]} · proporción {ratio:.4f}')
        cv2.imwrite(str(DEBUG / f'esquinas-{photo}.jpg'), cv2.resize(vis, (1536, 1024)))
    (FOTOS / 'esquinas.json').write_text(json.dumps(result, indent=2))
    print('→', FOTOS / 'esquinas.json')


# ───────────────────────────── Composición ─────────────────────────────
DISENOS = FOTOS / 'disenos'
SUPER = 4  # supermuestreo para los bordes de las máscaras


def rgb01(path):
    img = cv2.imread(str(path), cv2.IMREAD_COLOR)
    return img.astype(np.float32) / 255.0


def quad_px(photo, name, esq):
    return np.array(esq[photo]['quads'][name]['px'], np.float32)


def quad_mask(shape, quad):
    """Cobertura antialiasada del cuadrilátero (supermuestreo ×4)."""
    h, w = shape[:2]
    big = np.zeros((h * SUPER, w * SUPER), np.uint8)
    cv2.fillPoly(big, [np.round(quad * SUPER).astype(np.int32)], 255, lineType=cv2.LINE_AA)
    return cv2.resize(big, (w, h), interpolation=cv2.INTER_AREA).astype(np.float32) / 255.0


def homography(w, h, quad):
    src = np.array([(0, 0), (w, 0), (w, h), (0, h)], np.float32)
    return cv2.getPerspectiveTransform(src, quad.astype(np.float32))


def warp_design(design, quad, shape):
    """Lleva el diseño plano a la foto. Se reduce antes (INTER_AREA) para no perder nitidez."""
    h, w = shape[:2]
    side = max(np.linalg.norm(quad[1] - quad[0]), np.linalg.norm(quad[2] - quad[3]))
    scale = min(1.0, side * 1.15 / design.shape[1])
    d = cv2.resize(design, None, fx=scale, fy=scale, interpolation=cv2.INTER_AREA) if scale < 1 else design
    H = homography(d.shape[1], d.shape[0], quad)
    return np.clip(cv2.warpPerspective(d, H, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE), 0, 1)


def rectify(img, quad, w, h):
    """Lo contrario: saca de la foto el cuadrilátero en plano, a w×h."""
    H = cv2.getPerspectiveTransform(quad.astype(np.float32), np.array([(0, 0), (w, 0), (w, h), (0, h)], np.float32))
    return cv2.warpPerspective(img, H, (w, h), flags=cv2.INTER_AREA if w < 1200 else cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)


def lum(img):
    return img[..., 0] * 0.0722 + img[..., 1] * 0.7152 + img[..., 2] * 0.2126  # BGR


def ring_mask(img, region, dark, edge_rel=0.9, gthr=0.06, min_area=120):
    """Anillas y taladros. Metal: o muy oscuro frente al papel, o con bordes marcados (las sombras
    que dejan en el papel son lisas y se quedan fuera: son luz, van al mapa de luz)."""
    L = lum(img)
    x0, y0, x1, y1 = region
    sub = L[y0:y1, x0:x1]
    paper = cv2.GaussianBlur(cv2.dilate(sub, np.ones((61, 61), np.uint8)), (0, 0), 25)
    g = cv2.GaussianBlur(sub, (0, 0), 1.0)
    gm = np.hypot(cv2.Sobel(g, cv2.CV_32F, 1, 0, ksize=3), cv2.Sobel(g, cv2.CV_32F, 0, 1, ksize=3)) / 8
    m = (dark(sub, paper) | ((gm > gthr) & (sub < paper * edge_rel))).astype(np.uint8)
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)))
    # solo huecos pequeños (brillos del metal), no el papel que se ve dentro de cada anilla
    n2, lab2, st2, _ = cv2.connectedComponentsWithStats(1 - m, 4)
    small = np.zeros(n2, bool)
    small[1:] = st2[1:, cv2.CC_STAT_AREA] < 60
    m[small[lab2]] = 1
    n, lab, st, _ = cv2.connectedComponentsWithStats(m, 8)
    keep = np.zeros(n, bool)
    keep[1:] = st[1:, cv2.CC_STAT_AREA] >= min_area
    full = np.zeros(L.shape, np.float32)
    full[y0:y1, x0:x1] = keep[lab]
    return full


def light_map(img, mask_region, ring):
    """Mapa de luz = luminancia del papel / su percentil 95 (las anillas se rellenan, no son luz)."""
    L = lum(img)
    sel = (mask_region > 0.99) & (ring < 0.5)
    p95 = np.percentile(L[sel], 95)
    m = L / p95
    if ring.any():
        r8 = (cv2.dilate(ring, np.ones((5, 5), np.uint8)) > 0.5).astype(np.uint8)
        m8 = np.clip(m * 200, 0, 255).astype(np.uint8)
        m = cv2.inpaint(m8, r8, 6, cv2.INPAINT_TELEA).astype(np.float32) / 200
    return np.clip(m, 0, 1.08), float(p95)


# ── ΔE 2000 ──
def to_lab(bgr01):
    return cv2.cvtColor(np.asarray(bgr01, np.float32).reshape(-1, 1, 3), cv2.COLOR_BGR2Lab).reshape(-1, 3)


def hex_bgr(h):
    h = h.lstrip('#')
    return np.array([int(h[4:6], 16), int(h[2:4], 16), int(h[0:2], 16)], np.float32) / 255


def de2000(lab1, lab2):
    L1, a1, b1 = lab1
    L2, a2, b2 = lab2
    C1, C2 = np.hypot(a1, b1), np.hypot(a2, b2)
    Cm = (C1 + C2) / 2
    G = 0.5 * (1 - np.sqrt(Cm ** 7 / (Cm ** 7 + 25 ** 7)))
    a1p, a2p = (1 + G) * a1, (1 + G) * a2
    C1p, C2p = np.hypot(a1p, b1), np.hypot(a2p, b2)
    h1p, h2p = np.degrees(np.arctan2(b1, a1p)) % 360, np.degrees(np.arctan2(b2, a2p)) % 360
    dLp, dCp = L2 - L1, C2p - C1p
    dh = h2p - h1p
    if C1p * C2p == 0:
        dh = 0
    elif dh > 180:
        dh -= 360
    elif dh < -180:
        dh += 360
    dHp = 2 * np.sqrt(C1p * C2p) * np.sin(np.radians(dh / 2))
    Lm, Cmp = (L1 + L2) / 2, (C1p + C2p) / 2
    hs = h1p + h2p
    if C1p * C2p == 0:
        hm = hs
    elif abs(h1p - h2p) <= 180:
        hm = hs / 2
    else:
        hm = (hs + 360) / 2 if hs < 360 else (hs - 360) / 2
    T = 1 - 0.17 * np.cos(np.radians(hm - 30)) + 0.24 * np.cos(np.radians(2 * hm)) + 0.32 * np.cos(np.radians(3 * hm + 6)) - 0.20 * np.cos(np.radians(4 * hm - 63))
    dth = 30 * np.exp(-(((hm - 275) / 25) ** 2))
    Rc = 2 * np.sqrt(Cmp ** 7 / (Cmp ** 7 + 25 ** 7))
    Sl = 1 + 0.015 * (Lm - 50) ** 2 / np.sqrt(20 + (Lm - 50) ** 2)
    Sc, Sh = 1 + 0.045 * Cmp, 1 + 0.015 * Cmp * T
    Rt = -np.sin(np.radians(2 * dth)) * Rc
    return float(np.sqrt((dLp / Sl) ** 2 + (dCp / Sc) ** 2 + (dHp / Sh) ** 2 + Rt * (dCp / Sc) * (dHp / Sh)))


def measure_de(out, design_warped, lmap, region, colors=('#000B3D', '#224BA0')):
    """En la zona mejor iluminada (mapa ≥ su percentil 90), color medio de cada tinta frente a su hex."""
    res = {}
    lit = (lmap >= np.percentile(lmap[region > 0.99], 90)) & (region > 0.99)
    for hx in colors:
        target = hex_bgr(hx)
        sel = lit & (np.abs(design_warped - target).max(axis=2) < 0.02)
        sel = cv2.erode(sel.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
        if sel.sum() < 200:
            continue
        got = out[sel].mean(axis=0)
        res[hx] = round(de2000(to_lab(target)[0], to_lab(got)[0]), 2)
    return res


# ── Relleno de lino (quitar la página izquierda de la vista abierta) ──
def harmonic_fill(values, unknown, domain, iters=1200):
    """Interpolación armónica (Laplace) dentro de 'unknown'. Solo promedian las celdas del dominio
    (lo que no es lino, como el lomo o la página derecha, no aporta). Pirámide de gruesa a fina."""
    def solve(v, unk, dom, init, n):
        v = v.copy()
        if init is not None:
            v[unk] = init[unk]
        else:
            v[unk] = v[dom & ~unk].mean(axis=0)
        w = dom.astype(np.float32)[..., None]
        for _ in range(n):
            vw = v * w
            num = np.roll(vw, 1, 0) + np.roll(vw, -1, 0) + np.roll(vw, 1, 1) + np.roll(vw, -1, 1)
            den = np.roll(w, 1, 0) + np.roll(w, -1, 0) + np.roll(w, 1, 1) + np.roll(w, -1, 1)
            avg = num / np.maximum(den, 1e-6)
            v[unk] = avg[unk]
        return v
    levels = [4, 2, 1]
    init = None
    h, w = unknown.shape
    for f in levels:
        sz = (w // f, h // f)
        vv = cv2.resize(values, sz, interpolation=cv2.INTER_AREA)
        uu = cv2.resize(unknown.astype(np.float32), sz, interpolation=cv2.INTER_AREA) > 0
        dd = (cv2.resize(domain.astype(np.float32), sz, interpolation=cv2.INTER_AREA) > 0.999) | uu
        ii = cv2.resize(init, sz, interpolation=cv2.INTER_LINEAR) if init is not None else None
        init = solve(vv, uu, dd, ii, iters)
    return init


def linen_texture(img, sources, sigma=6):
    """Trama del lino normalizada: (luminancia / paso bajo − 1) / contraste local. Así se pueden coser
    trozos con sol y con sombra; el contraste se vuelve a poner después, interpolado."""
    L = lum(img)
    low = cv2.GaussianBlur(L, (0, 0), sigma)
    t = L / np.maximum(low, 1e-3) - 1
    c = np.sqrt(cv2.GaussianBlur(t * t, (0, 0), sigma * 1.5)) + 1e-4
    tn = t / c
    return [tn[y0:y1, x0:x1] for (x0, y0, x1, y1) in sources], c


def quilt(tiles, W, H, tw=150, ov=28, rng=None):
    """Llena W×H con columnas de trama; cada columna se une a la anterior por un corte de error mínimo."""
    rng = rng or np.random.default_rng(7)
    out = np.zeros((H, W), np.float32)
    x = 0
    first = True
    while x < W:
        best = None
        for _ in range(60):
            t = tiles[rng.integers(len(tiles))]
            if t.shape[0] < H or t.shape[1] < tw:
                continue
            sy = rng.integers(0, t.shape[0] - H + 1)
            sx = rng.integers(0, t.shape[1] - tw + 1)
            cand = t[sy:sy + H, sx:sx + tw]
            if first:
                best = (0, cand)
                break
            err = ((cand[:, :ov] - out[:, x:x + ov]) ** 2).sum()
            if best is None or err < best[0]:
                best = (err, cand)
        cand = best[1]
        w = min(tw, W - x)
        if first:
            out[:, x:x + w] = cand[:, :w]
            first = False
        else:
            e = (cand[:, :ov] - out[:, x:x + ov]) ** 2
            # corte vertical de coste mínimo (programación dinámica)
            cost = e.copy()
            for r in range(1, H):
                prev = cost[r - 1]
                left = np.r_[np.inf, prev[:-1]]
                right = np.r_[prev[1:], np.inf]
                cost[r] += np.minimum(np.minimum(left, prev), right)
            seam = np.zeros(H, np.int32)
            seam[-1] = int(np.argmin(cost[-1]))
            for r in range(H - 2, -1, -1):
                c = seam[r + 1]
                lo, hi = max(0, c - 1), min(ov, c + 2)
                seam[r] = lo + int(np.argmin(cost[r, lo:hi]))
            cols = np.arange(ov)[None, :]
            alpha = np.clip((cols - seam[:, None] + 1.5) / 3, 0, 1)  # 3 px de transición en el corte
            out[:, x:x + ov] = out[:, x:x + ov] * (1 - alpha) + cand[:, :ov] * alpha
            out[:, x + ov:x + w] = cand[:, ov:w]
        x += tw - ov if x + tw < W else tw
    return out


def remove_left_page(img, rect, sources, spine_x, feather=5):
    """Quita la página izquierda de la foto ORIGINAL (1×) y rellena con lino; después se amplía
    con Real-ESRGAN como las demás, para que la trama nueva y la vieja se inventen igual."""
    x0, y0, x1, y1 = rect
    h, w = img.shape[:2]
    S = 4
    tiles, contrast = linen_texture(img, sources)
    low = cv2.GaussianBlur(img, (0, 0), 7)
    stack = np.dstack([low, contrast])  # color de fondo + contraste de la trama
    small = cv2.resize(stack, (w // S, h // S), interpolation=cv2.INTER_AREA)
    unknown = np.zeros(small.shape[:2], bool)
    unknown[y0 // S - 1:y1 // S + 2, x0 // S - 1:x1 // S + 2] = True
    domain = np.ones_like(unknown)
    domain[y0 // S - 1:y1 // S + 2, spine_x // S:] = False  # lomo y página derecha: fuera
    filled = cv2.resize(harmonic_fill(small, unknown, domain), (w, h), interpolation=cv2.INTER_CUBIC)
    low_f, c_f = filled[..., :3], filled[..., 3]
    tn = quilt(tiles, x1 - x0, y1 - y0)
    tex = 1 + tn * c_f[y0:y1, x0:x1]
    patch = low_f[y0:y1, x0:x1] * tex[..., None]
    a = np.ones((y1 - y0, x1 - x0), np.float32)
    ramp = np.linspace(0, 1, feather)
    a[:feather, :] *= ramp[:, None]
    a[-feather:, :] *= ramp[::-1][:, None]
    a[:, :feather] *= ramp[None, :]
    out = img.copy()
    out[y0:y1, x0:x1] = img[y0:y1, x0:x1] * (1 - a[..., None]) + patch * a[..., None]
    return np.clip(out, 0, 1)


def plate_sin_izquierda():
    """design/fotos/agenda-abierta-sin-izquierda.png (1×): la vista cenital sin la página izquierda."""
    esq = json.loads((FOTOS / 'esquinas.json').read_text())
    img = rgb01(FOTOS / 'agenda-abierta.png')
    qi = quad_px('agenda-abierta', 'izquierda', esq) / 2
    qd = quad_px('agenda-abierta', 'derecha', esq) / 2
    rect = (int(qi[:, 0].min()) - 36, int(qi[:, 1].min()) - 28, int(qi[1, 0]) + 1, int(qi[:, 1].max()) + 70)
    src = [(0, 0, int(qi[:, 0].min()) - 40, img.shape[0]), (int(qd[:, 0].max()) + 35, 0, img.shape[1], img.shape[0]),
           (0, int(qi[:, 1].max()) + 60, img.shape[1], img.shape[0])]
    src = [r for r in src if r[3] - r[1] >= rect[3] - rect[1]]
    out = remove_left_page(img, rect, src, int(qi[1, 0]) + 1)
    cv2.imwrite(str(FOTOS / 'agenda-abierta-sin-izquierda.png'), np.clip(out * 255 + 0.5, 0, 255).astype(np.uint8))
    print('→ agenda-abierta-sin-izquierda.png; amplíala con Real-ESRGAN a x2/ antes de compose')


# ── Salida ──
def save_variants(bgr01, name, widths, alpha=None, q_webp=82, q_avif=62, suffix=None):
    OUT_PUBLIC.mkdir(parents=True, exist_ok=True)
    tmp = DEBUG / f'{name}.png'
    out = []
    for w in widths:
        h = round(bgr01.shape[0] * w / bgr01.shape[1])
        img = cv2.resize(bgr01, (w, h), interpolation=cv2.INTER_AREA)
        px = np.clip(img * 255 + 0.5, 0, 255).astype(np.uint8)
        if alpha is not None:
            a = cv2.resize(alpha, (w, h), interpolation=cv2.INTER_AREA)
            px = np.dstack([px, np.clip(a * 255 + 0.5, 0, 255).astype(np.uint8)])
        cv2.imwrite(str(tmp), px)
        base = OUT_PUBLIC / f'{name}-{suffix or w}'
        import subprocess
        subprocess.run(['cwebp', '-quiet', '-q', str(q_webp), '-m', '6', '-sharp_yuv', *(['-exact', '-alpha_q', '100'] if alpha is not None else []), str(tmp), '-o', f'{base}.webp'], check=True)
        subprocess.run(['avifenc', '-q', str(q_avif), '-s', '4', '-y', '444' if alpha is not None else '420', str(tmp), f'{base}.avif'], check=True, capture_output=True)
        out.append({'w': w, 'h': h, 'webp': (base.with_suffix('.webp')).stat().st_size, 'avif': (base.with_suffix('.avif')).stat().st_size})
    return out


def norm(quad, size):
    return [[round(float(x) / size[0], 5), round(float(y) / size[1], 5)] for x, y in quad]


def compose():
    esq = json.loads((FOTOS / 'esquinas.json').read_text())
    meta = json.loads((DISENOS / 'meta.json').read_text())
    report = {'deltaE': {}, 'files': {}, 'p95': {}}
    DEBUG.mkdir(parents=True, exist_ok=True)

    # 1) Agenda cerrada en tres cuartos: tapa de Esade y tapa de catálogo, horneadas en la foto.
    img = rgb01(X2 / 'agenda-cerrada.png')
    size = esq['agenda-cerrada']['size']
    q = quad_px('agenda-cerrada', 'tapa', esq)
    region = quad_mask(img.shape, q)
    x0, y0 = int(q[:, 0].min()) - 40, int(q[:, 1].min()) - 40
    x1, y1 = int(q[:, 0].max()) + 40, int(q[:, 1].max()) + 40
    rings = ring_mask(img, (max(0, x0), max(0, y0), x1, y1), lambda s, p: s < p * 0.74) * region
    lmap, p95 = light_map(img, region, rings)
    report['p95']['agenda-cerrada'] = round(p95 * 255, 1)
    a = (region * (1 - cv2.GaussianBlur(rings, (0, 0), 0.8)))[..., None]
    cv2.imwrite(str(DEBUG / 'anillas-cerrada.png'), (rings * 255).astype(np.uint8))
    for variant in ('esade', 'catalogo'):
        design = rgb01(DISENOS / f'tapa-{variant}.png')
        dw = warp_design(design, q, img.shape)
        out = np.clip(img * (1 - a) + dw * lmap[..., None] * a, 0, 1)
        if variant == 'esade':
            report['deltaE']['agenda-cerrada'] = measure_de(out, dw, lmap, region * (1 - rings))
        report['files'][f'agenda-{variant}'] = save_variants(out, f'agenda-{variant}', [2400, 1200, 800])
        cv2.imwrite(str(DEBUG / f'comp-agenda-{variant}.jpg'), (out * 255).astype(np.uint8))

    # 2) Agenda abierta, vista cenital: placa sin página izquierda y con la semana en la derecha;
    #    tapa e interior de tapa en plano con la luz horneada; anillas en capa aparte.
    img = rgb01(X2 / 'agenda-abierta.png')
    qd = quad_px('agenda-abierta', 'derecha', esq)
    qi = quad_px('agenda-abierta', 'izquierda', esq)
    rd, ri = quad_mask(img.shape, qd), quad_mask(img.shape, qi)
    spine = (int(qi[:, 0].max()) - 70, int(qd[:, 1].min()) + 6, int(qd[:, 0].min()) + 90, int(qd[:, 1].max()) - 6)
    rings = ring_mask(img, spine, lambda s, p: s < p * 0.74)
    gap = (int(qi[1, 0]) + 2, int(qd[0, 0]) - 2)  # el lomo se queda en la placa
    rings_ov = rings.copy()
    rings_ov[:, gap[0]:gap[1]] = 0
    lm_d, p95d = light_map(img, rd, rings * rd)
    lm_i, p95i = light_map(img, ri, rings * ri)
    report['p95']['agenda-abierta'] = [round(p95i * 255, 1), round(p95d * 255, 1)]
    week = rgb01(DISENOS / 'semana.png')
    dw = warp_design(week, qd, img.shape)
    a = (rd * (1 - rings))[..., None]
    # base: la misma vista sin la página izquierda (plate_sin_izquierda + Real-ESRGAN), misma geometría
    base = rgb01(X2 / 'agenda-abierta-sin-izquierda.png')
    plate = np.clip(base * (1 - a) + dw * lm_d[..., None] * a, 0, 1)
    report['deltaE']['semana'] = measure_de(plate, dw, lm_d, rd * (1 - rings), colors=('#000B3D',))
    report['files']['agenda-abierta'] = save_variants(plate, 'agenda-abierta', [2400, 1200, 800])
    cv2.imwrite(str(DEBUG / 'comp-agenda-abierta.jpg'), (plate * 255).astype(np.uint8))
    # capa de anillas (con alfa), recortada a su caja
    ys, xs = np.where(rings_ov > 0)
    bx0, by0, bx1, by1 = xs.min() - 4, ys.min() - 4, xs.max() + 5, ys.max() + 5
    alpha = cv2.GaussianBlur(rings_ov, (0, 0), 0.7)[by0:by1, bx0:bx1]
    ring_rgb = img[by0:by1, bx0:bx1]
    sc = 2400 / img.shape[1]
    ring_files = []
    for w_full in (2400, 1200):
        s = w_full / img.shape[1]
        wpx = round((bx1 - bx0) * s)
        ring_files.append(save_variants(ring_rgb, 'agenda-anillas', [wpx], alpha=alpha, suffix=w_full)[0])
    report['files']['agenda-anillas'] = ring_files
    # tapa y guarda en plano, con la luz de su página horneada
    Wf = 1060
    Hf = round(Wf / meta['pageRatio'])
    lm_df = rectify(lm_d, qd, Wf, Hf)
    lm_if = rectify(lm_i, qi, Wf, Hf)
    tapa = cv2.resize(rgb01(DISENOS / 'tapa-esade.png'), (Wf, Hf), interpolation=cv2.INTER_AREA)
    guarda = cv2.resize(rgb01(DISENOS / 'guarda.png'), (Wf, Hf), interpolation=cv2.INTER_AREA)
    tapa_l = np.clip(tapa * lm_df[..., None], 0, 1)
    guarda_l = np.clip(guarda * lm_if[..., None], 0, 1)
    report['deltaE']['tapa-plana'] = measure_de(tapa_l, tapa, lm_df, np.ones_like(lm_df))
    report['deltaE']['guarda-plana'] = measure_de(guarda_l, guarda, lm_if, np.ones_like(lm_if), colors=('#224BA0',))
    report['files']['tapa-plana'] = save_variants(tapa_l, 'tapa-plana', [Wf, Wf // 2])
    report['files']['guarda-plana'] = save_variants(guarda_l, 'guarda-plana', [Wf, Wf // 2])
    semana_f = np.clip(cv2.resize(week, (Wf, Hf), interpolation=cv2.INTER_AREA) * lm_df[..., None], 0, 1)
    report['files']['semana-plana'] = save_variants(semana_f, 'semana-plana', [Wf, Wf // 2])
    abierta_geo = {'size': esq['agenda-abierta']['size'], 'derecha': norm(qd, esq['agenda-abierta']['size']), 'izquierda': norm(qi, esq['agenda-abierta']['size']),
                   'anillas': [round(float(v), 5) for v in (bx0 / img.shape[1], by0 / img.shape[0], (bx1 - bx0) / img.shape[1], (by1 - by0) / img.shape[0])]}

    # 3) Calendario: 12 hojas en plano con la luz de la hoja horneada; anillas en capa aparte.
    img = rgb01(X2 / 'calendario.png')
    qc = quad_px('calendario', 'hoja', esq)
    rc = quad_mask(img.shape, qc)
    top = int(min(qc[0, 1], qc[1, 1]))
    strip = (int(qc[:, 0].min()) - 30, top - 190, int(qc[:, 0].max()) + 30, top + 120)
    rings_c = ring_mask(img, strip, lambda s, p: s < 0.62, edge_rel=0.8, gthr=0.07)
    lm_c, p95c = light_map(img, rc, rings_c * rc)
    report['p95']['calendario'] = round(p95c * 255, 1)
    Ws = 1740
    Hs = round(Ws / meta['sheetRatio'])
    lm_cf = rectify(lm_c, qc, Ws, Hs)
    report['deltaE']['hojas'] = {}
    sheet_files = []
    for m in range(12):
        d = cv2.resize(rgb01(DISENOS / f'hoja-{m + 1:02d}.png'), (Ws, Hs), interpolation=cv2.INTER_AREA)
        dl = np.clip(d * lm_cf[..., None], 0, 1)
        report['deltaE']['hojas'][m + 1] = measure_de(dl, d, lm_cf, np.ones_like(lm_cf))
        sheet_files.append(save_variants(dl, f'hoja-{m + 1:02d}', [Ws, Ws // 2]))
        if m == 0:
            dw = warp_design(rgb01(DISENOS / 'hoja-01.png'), qc, img.shape)
            ac = (rc * (1 - rings_c))[..., None]
            prev = np.clip(img * (1 - ac) + dw * lm_c[..., None] * ac, 0, 1)
            cv2.imwrite(str(DEBUG / 'comp-calendario.jpg'), (prev * 255).astype(np.uint8))
            report['files']['calendario'] = save_variants(prev, 'calendario', [2400, 1200, 800])
    report['files']['hojas'] = sheet_files
    ys, xs = np.where(rings_c > 0)
    bx0, by0, bx1, by1 = xs.min() - 4, ys.min() - 4, xs.max() + 5, ys.max() + 5
    alpha = cv2.GaussianBlur(rings_c, (0, 0), 0.7)[by0:by1, bx0:bx1]
    ring_files = []
    for w_full in (2400, 1200):
        wpx = round((bx1 - bx0) * w_full / img.shape[1])
        ring_files.append(save_variants(img[by0:by1, bx0:bx1], 'calendario-anillas', [wpx], alpha=alpha, suffix=w_full)[0])
    report['files']['calendario-anillas'] = ring_files
    cal_geo = {'size': esq['calendario']['size'], 'hoja': norm(qc, esq['calendario']['size']),
               'anillas': [round(float(v), 5) for v in (bx0 / img.shape[1], by0 / img.shape[0], (bx1 - bx0) / img.shape[1], (by1 - by0) / img.shape[0])]}

    geo = {
        'cerrada': {'size': esq['agenda-cerrada']['size'], 'tapa': norm(quad_px('agenda-cerrada', 'tapa', esq), esq['agenda-cerrada']['size']), 'nombre': meta['coverName']},
        'abierta': abierta_geo,
        'calendario': cal_geo,
        'pageRatio': meta['pageRatio'],
        'sheetRatio': meta['sheetRatio'],
        'cells': [[[c['day'], round(c['x'], 4), round(c['y'], 4), round(c['w'], 4), round(c['h'], 4)] for c in mo['cells']] for mo in meta['months']],
    }
    js = '// Generado por scripts/composite.py compose: no editar a mano.\n' \
         '// Esquinas normalizadas (0-1) de cada soporte en su foto y casillas de los días de cada hoja.\n' \
         f'export const FOTOS = {json.dumps(geo, ensure_ascii=False)};\n'
    (ROOT / 'src' / 'content' / 'fotos.js').write_text(js)
    (FOTOS / 'composicion.json').write_text(json.dumps(report, indent=1, ensure_ascii=False))
    print(json.dumps(report['deltaE'], indent=1))
    print('p95', report['p95'])


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'corners'
    if cmd == 'corners':
        corners()
    elif cmd == 'vaciar':
        plate_sin_izquierda()
    elif cmd == 'compose':
        compose()

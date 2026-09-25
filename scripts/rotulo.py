"""
El rótulo «esade» del edificio, nítido, en el fotograma de noche del cierre.

El último fotograma del vídeo de la portada (public/video/final.*) está desenfocado a propósito y el
rótulo se lee mal. Este script pega encima el rótulo de la foto original (design/esade-campus-
original.jpg, nítida): alinea las dos imágenes con puntos característicos (SIFT + homografía),
lleva el trozo a la luz de noche del fotograma (medias en Lab) y lo funde con un borde suave. El resto
de la foto sigue desenfocado; solo el rótulo gana definición.

Uso: <venv>/bin/python scripts/rotulo.py
Sale: public/video/final-rotulo.{avif,webp} (1280×720) y final-rotulo-movil.{avif,webp} (recorte
vertical, el mismo encuadre que final-movil).
"""
import subprocess
from pathlib import Path

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
VID = ROOT / 'public' / 'video'
TMP = ROOT / 'design' / 'fotos' / 'debug'
TMP.mkdir(parents=True, exist_ok=True)

night = cv2.imread(str(VID / 'final.webp'))
orig = cv2.imread(str(ROOT / 'design' / 'esade-campus-original.jpg'))
H, W = night.shape[:2]
# La original a una escala parecida a la del fotograma (1,5× para que el trozo tenga más detalle)
scale = (W * 1.5) / orig.shape[1]
orig_s = cv2.resize(orig, None, fx=scale, fy=scale, interpolation=cv2.INTER_AREA)

# Alineación: SIFT sobre las dos, desenfocando la original como el fotograma para que casen los rasgos
g_n = cv2.cvtColor(night, cv2.COLOR_BGR2GRAY)
g_o = cv2.GaussianBlur(cv2.cvtColor(orig_s, cv2.COLOR_BGR2GRAY), (0, 0), 4)
g_n = cv2.equalizeHist(g_n)
g_o = cv2.equalizeHist(g_o)
sift = cv2.SIFT_create(6000)
kn, dn = sift.detectAndCompute(g_n, None)
ko, do = sift.detectAndCompute(g_o, None)
matches = cv2.BFMatcher().knnMatch(do, dn, k=2)
good = [m for m, n in matches if m.distance < 0.72 * n.distance]
src = np.float32([ko[m.queryIdx].pt for m in good])
dst = np.float32([kn[m.trainIdx].pt for m in good])
Hm, inl = cv2.findHomography(src, dst, cv2.RANSAC, 3.0)
print('coincidencias', len(good), 'inliers', int(inl.sum()))
warped = cv2.warpPerspective(orig_s, Hm, (W, H), flags=cv2.INTER_LANCZOS4)

# Zona del rótulo en el fotograma (letras y banda de debajo), en fracciones medidas
x0, x1, y0, y1 = int(W * 0.345), int(W * 0.545), int(H * 0.285), int(H * 0.51)
mask = np.zeros((H, W), np.float32)
mask[y0:y1, x0:x1] = 1
mask = cv2.GaussianBlur(mask, (0, 0), 9)

# Luz de noche: medias Lab del fotograma en la zona; el contraste propio de la original, algo
# rebajado (0,9) para que no parezca pegado
lab_w = cv2.cvtColor(warped, cv2.COLOR_BGR2LAB).astype(np.float32)
lab_n = cv2.cvtColor(night, cv2.COLOR_BGR2LAB).astype(np.float32)
reg = (slice(y0, y1), slice(x0, x1))
for c in range(3):
    mw, sw = lab_w[reg][..., c].mean(), lab_w[reg][..., c].std()
    mn, sn = lab_n[reg][..., c].mean(), lab_n[reg][..., c].std()
    k = 0.9 if c == 0 else 1.0
    lab_w[..., c] = (lab_w[..., c] - mw) * (max(sn, sw * k) / max(sw, 1e-3)) * (k if c == 0 else 1) + mn
graded = cv2.cvtColor(np.clip(lab_w, 0, 255).astype(np.uint8), cv2.COLOR_LAB2BGR)
graded = cv2.GaussianBlur(graded, (0, 0), 0.6)  # «ligeramente»: nítido, pero no recortado

out = (night.astype(np.float32) * (1 - mask[..., None]) + graded.astype(np.float32) * mask[..., None])
out = np.clip(out, 0, 255).astype(np.uint8)

# Fuera la bandera azul (también pone «esade») y la farola de la que cuelga: «vänster ×» va a la
# izquierda del rótulo, justo donde estaban, y ninguna letra debe pisar otro «esade». Se rellena con
# lo de alrededor (inpaint) y se suaviza como el resto del fotograma, que ya está desenfocado.
hole = np.zeros((H, W), np.uint8)
cv2.rectangle(hole, (int(W * 0.258), int(H * 0.05)), (int(W * 0.325), H - 1), 255, -1)      # bandera y poste
cv2.rectangle(hole, (int(W * 0.258), int(H * 0.055)), (int(W * 0.335), int(H * 0.2)), 255, -1)  # brazo y lámpara
filled = cv2.inpaint(out, hole, 9, cv2.INPAINT_TELEA)
soft = cv2.GaussianBlur(filled, (0, 0), 7)
feather = cv2.GaussianBlur(hole.astype(np.float32) / 255, (0, 0), 6)[..., None]
out = np.clip(filled * (1 - feather) + soft * feather, 0, 255).astype(np.uint8)
cv2.imwrite(str(TMP / 'final-rotulo-sin-bandera.png'), out[60:620, 200:760])
cv2.imwrite(str(TMP / 'final-rotulo-antes-despues.png'), np.hstack([night[y0 - 40:y1 + 40, x0 - 60:x1 + 60], out[y0 - 40:y1 + 40, x0 - 60:x1 + 60]]))


def enc(img, name):
    png = TMP / f'{name}.png'
    cv2.imwrite(str(png), img)
    subprocess.run(['cwebp', '-quiet', '-q', '82', str(png), '-o', str(VID / f'{name}.webp')], check=True)
    subprocess.run(['avifenc', '-q', '60', '-s', '4', str(png), str(VID / f'{name}.avif')], check=True, capture_output=True)
    print(name, img.shape[1], '×', img.shape[0])


enc(out, 'final-rotulo')
# El móvil: el mismo recorte vertical que final-movil (se localiza por correlación)
mob = cv2.imread(str(VID / 'final-movil.webp'))
mh, mw = mob.shape[:2]
k = H / mh
mob_s = cv2.resize(mob, (round(mw * k), H), interpolation=cv2.INTER_CUBIC)
res = cv2.matchTemplate(cv2.cvtColor(night, cv2.COLOR_BGR2GRAY), cv2.cvtColor(mob_s, cv2.COLOR_BGR2GRAY), cv2.TM_CCOEFF_NORMED)
_, score, _, (mx, _) = cv2.minMaxLoc(res)
print('recorte del móvil en x =', mx, 'correlación', round(score, 3))
crop = out[:, mx:mx + mob_s.shape[1]]
enc(cv2.resize(crop, (mw * 2, mh * 2), interpolation=cv2.INTER_CUBIC), 'final-rotulo-movil')

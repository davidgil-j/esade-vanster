# Listón · cómo está hecho L'Occitane × Vänster

Leído de `~/Documents/GitHub/L-OCCITANE/src` el 2026-09-23. Se copian **el acabado y el ritmo**, no los
efectos.

## Curva y duraciones
- **Una sola curva para toda la página:** `cubic-bezier(0.22, 1, 0.36, 1)` (`animations/easing.js`,
  `EASE` y `EASE_CSS`). Cualquier transición nueva la importa de ahí.
- **Entradas de texto:** 0,6 s en los fundidos (`FadeIn`) y 0,8 s en las máscaras por líneas
  (`MaskReveal`, `RevealLines`), con escalonado por línea.
- **Enlaces y botones de texto:** `transition-opacity duration-300`, `hover:opacity-70` y
  `active:opacity-60`. Objetivo táctil `min-h-11` (44 px).
- **Pulsación con muelle:** en el deslizable (`SwitchButton`), `{ type: 'spring', duration: 0.55,
  bounce: 0 }`, sin rebote.
- **Pastilla del deslizable:** `h-14` (56 px), `rounded-full`, `touch-pan-y select-none`, borde de 1 px.
- **Tarjetas de producto:** al pulsar, 500 ms; al soltar, 250 ms (`ProductMedia`).
- **Cabecera:** progreso suavizado con `useSpring({ stiffness: 90, damping: 22, mass: 0.9 })`.
- **Fondo de mármol:** deriva CSS muy lenta, `marble-drift 36s ease-in-out infinite alternate`.
- **Portada:** escala de 1 a 0,86 y radio de 0 a 36 px ligados al scroll, con una curva cuadrática
  (`Hero.jsx`).

## Pantalla de carga
- De 0,9 s como mínimo a 2,5 s como máximo, medida con `performance.now()` desde la apertura, no desde
  el efecto.
- Espera a la **carga real**: `document.fonts.ready`, la foto de la portada y el mármol del titular.
- Sale como una máscara que sube (la capa exterior sube y el contenido baja lo mismo), solo con
  transforms.
- **Seguro en CSS** (`loader-failsafe`) que la retira a los 2,5 s aunque el JS no arranque; con 3G
  llegó a tardar 16 s.

## Cómo evita los tirones
- **Un solo reloj:** Lenis no lleva su propio requestAnimationFrame y avanza dentro del bucle de
  Framer Motion (`frame.update`). Con dos bucles, uno movía el scroll y el otro leía la posición en
  otro momento del fotograma: **ese era el conflicto de Lenis con Framer Motion**.
- **Lenis solo con ratón** (`DESKTOP_POINTER`). En táctil, scroll nativo, porque Lenis llegó a
  bloquear el desplazamiento en el Safari del iPhone.
- **Anclas internas por `lenis.scrollTo`** (el salto nativo pelea con la interpolación) y sin escribir
  en el historial.
- **Animaciones ligadas al scroll con `useScroll` y `useTransform`** sobre la posición nativa, sin
  listeners propios.

## Qué hacemos aquí distinto (esade)
- **El reloj único es el de GSAP:** `gsap.ticker` mueve Lenis, ScrollTrigger y el shader del mármol.
  Motion no se usa en los mismos componentes, así que no se repite el conflicto de L'Occitane.
- **Curva y tokens:** misma curva, con duraciones cerradas a 100, 300, 450 y 700 ms.
- **Efectos propios:** la hoja de 2026 a 2027, las lamas de la fachada, el mármol vivo, abrir y
  hojear arrastrando, y el deslizable de pintura. No se repite el vídeo en letras, el raíl de
  lavanda ni la pantalla de carga con filete.

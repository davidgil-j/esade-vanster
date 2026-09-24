# Landing Esade × Vänster

Propuesta de Vänster (estudio de diseño de Barcelona) a Esade: agendas y calendarios diseñados como regalo de fin de año para los trabajadores (público interno). No es un tono de venta agresivo.

## Al empezar cada sesión
- Lee PLAN.md (si existe) y di en qué fase del método /diseno estamos.
- Trabajamos con la skill /diseno. Las fases van en orden. No se escribe código de la web antes de la fase 4.
- Ante cualquier duda, pregúntame antes de hacer nada.

## Reglas fijas
- Stack (rediseño final): Next.js (última estable) App Router + JavaScript + Tailwind 3 + GSAP (ScrollTrigger, SplitText, Draggable, InertiaPlugin) + Lenis + WebGL a mano para el mármol (un canvas y un quad por sección, sin three), todo instalado con npm. Framer Motion sigue instalado pero no se usa. Sin three.js, React Three Fiber ni drei. NO TypeScript. Nada de shadcn. Un solo reloj: Lenis, ScrollTrigger y el shader dentro de `gsap.ticker`; GSAP y Motion no se mezclan en el mismo componente.
- Servidor local: `next dev -p 3002` (el 3001 es L'Occitane).
- Idioma de la web: castellano. "esade" en minúsculas cuando actúa como elemento gráfico; "Esade" dentro de un texto.
- NUNCA hagas commit ni push: lo hago yo con GitHub Desktop.
- NUNCA uses imágenes con logos de otros clientes de Vänster. Nunca textos de "pendiente" visibles en la web.
- Logotipos oficiales (Esade, Vänster) intactos: sin deformar, recolorear ni animar.
- metadata robots: noindex, nofollow.
- Los PDFs de marca viven en marca/pdf/ y no se suben a GitHub.
- Un solo archivo de decisiones de diseño: PLAN.md. No crear otros archivos de decisiones.

## Uso de skills (todas las fases, todas las sesiones)
- Cada respuesta empieza con dos líneas: "Fase: X" y "Skills usadas en esta respuesta: ...".
- En cada fase se invocan EXPLÍCITAMENTE todas las skills que .claude/skills/diseno/piezas.md asigna a esa fase. Si en una fase no se usa alguna de las asignadas, se dice cuál y por qué.
  - Fase 0: impeccable shape.
  - Fase 1: slopmonster.
  - Fase 2: prototype y los estilos cerrados (high-end-visual-design, minimalist-ui, industrial-brutalist-ui).
  - Fase 3: impeccable typeset y colorize, apple-design.
  - Fase 4: design-taste-frontend, impeccable layout y adapt, mobile-native, el estilo cerrado elegido.
  - Fase 5: emil-design-eng, animate, review-animations, apple-design.
  - Fase 6: impeccable audit, critique y polish, review-animations, mobile-native, slopmonster.
- **prototype y review-animations solo las puede lanzar David** (llevan `disable-model-invocation`). No se tocan sus SKILL.md. Al llegar a su fase, le doy la orden exacta que tiene que escribir.
- **slopmonster en castellano:** su nota es de inglés. En las fases 1 y 6 paso yo el linter (`deslop.py`) y reviso a mano contra la lista de morralla de `.claude/skills/diseno/criterio.md` (ley 1). No hay anexo de castellano. La limpieza con otro modelo (`cleanse.sh`) no se ejecuta aquí: preparo el texto y David lo pega en ChatGPT, una sola vez y con el texto final.

## Marca
Fichas en marca/. Es una landing DE VÄNSTER para Esade: Vänster es quien habla (marco, voz, lockup «esade × Vänster», botones, CTA, progreso, «Quiénes somos» y cierre, con su fucsia, Montserrat y Mulish); Esade es lo que se enseña (la agenda y el calendario llevan sus azules, sus diagonales y su logo según su manual). La regla de máximo 3 colores es para las piezas de Esade, no para la página.
Contacto de Vänster: info@vanster.design

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

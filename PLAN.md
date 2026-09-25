# Plan · Landing esade × Vänster

Fase actual: 4 · Construir, terminada el 2026-09-23 (en autonomía). Siguiente: fase 5 · El movimiento
(review-animations la lanza David). Las decisiones tomadas sin David están al final.
Listón: loccitane-vanster.vercel.app (misma campaña, otro cliente) y evomeet-reportia.vercel.app

## 0 · Entrevista

**Qué es:** propuesta de Vänster (estudio de diseño de Barcelona) a Esade: agendas y calendarios
diseñados como regalo de fin de año para los trabajadores de Esade.
**Para quién:** quien decide el regalo en Esade (RRHH o Comunicación interna). Tono de propuesta,
no de venta agresiva.
**Modo:** Persuadir.
**Éxito:** que quien decide el regalo escriba a Vänster (info@vanster.design) para hablar de la
propuesta.
**Idioma:** castellano.
**Aparatos obligatorios:** ordenador y móvil.

**Viene trabajado:** contenido **no** (se construye en la fase 1) · marca **ficha**
(`marca/vanster/LEEME.md` para la página, `marca/esade.md` para los productos) · dirección **referencias** (las de
David Comellas, abajo) · código **esqueleto vacío** (Next.js 16 en `src/`, publicado en
esade-vanster.vercel.app, sin diseño).

**Tipografía provisional:** Montserrat (titulares) + Mulish (cuerpo), hasta tener Esade Type.

**Productos:** dos piezas, cada una con su sección: una **agenda 2027** y un **calendario de
sobremesa**, las dos con la marca de Esade.
**Imágenes, en dos capas:**
1. **El objeto, con Gemini.** Solo el objeto físico (agenda, calendario) en su escena, con la
   superficie de la tapa o de la hoja **limpia, sin logo ni texto de marca**. Yo escribo el texto
   de generación y David genera y me deja los archivos. **La IA nunca pone el logotipo.**
2. **El diseño, en plano y por mí.** Las tapas de la agenda y las hojas del calendario, con el
   logotipo real de `marca/esade/` y los colores exactos del manual. Se montan encima del hueco
   limpio.

El nivel es el de las fotos de producto de L'Occitane.

**Quién habla (corregido el 2026-09-23):** es una landing DE VÄNSTER para Esade. **Vänster es quien
habla; Esade es lo que se enseña.**
- **De Vänster** (`marca/vanster/LEEME.md`) es el marco y la voz: fucsia `#C40452`, Montserrat y Mulish, su logo
  visible (no solo en el pie), el lockup «esade × Vänster» fijo arriba, botones, CTA, indicador
  de progreso, «Quiénes somos» y cierre.
- **De Esade** (`marca/esade.md`) son los productos: la agenda y el calendario llevan sus azules, sus
  diagonales y su logo, según su manual.
- Como en L'Occitane (lockup de las dos marcas, cierre y progreso en color Vänster). Se copia la
  idea de la mezcla, no el aspecto.

**Movimiento (añadido el 2026-09-23):** tiene que ser muy dinámica. El listón de movimiento es
L'Occitane o más, **sin repetir sus efectos**: nada de vídeo dentro de las letras, ni raíl lateral
de espiga, ni la misma pantalla de carga.

**Límites que ya vienen de las marcas y de CLAUDE.md:**
- Logotipos intactos. Solo tenemos el de Esade con la cinta "UNIVERSIDAD RAMON LLULL", en azul y
  en blanco.
- En las piezas de Esade (agenda, calendario): máximo 3 colores y siempre un azul. Esa regla no se
  aplica a la página.
- Las diagonales de Esade están autorizadas para web y para material interno (manual, p. 23).
- Ninguna imagen con logos de otros clientes de Vänster.
- `noindex, nofollow`.

### El listón: qué nivel marca

- **L'Occitane × Vänster:**
  - Cada producto tiene su propia sección, con fotografía del objeto con la marca, puesto en la
    escena de la marca (agenda, calendario, bidón, mochila).
  - Vídeo dentro de las letras del titular, texto que se revela al bajar y una ramita de lavanda
    como raíl lateral.
  - Una píldora con las dos marcas se queda fija arriba.
  - Cierre en el magenta de Vänster con textura de mármol y todos los datos de contacto.
  - Unas 7 secciones y unos 5.000 px; en móvil está trabajada aparte.
- **EvoMeet × ReportIA:**
  - Vídeo dentro del titular, con cursor de escritura.
  - Cifras que cuentan al entrar, texto que se enfoca al bajar y un grafo animado.
  - Un globo de puntos, el precio en tarjetas y el logotipo como raíl lateral.
  - La misma píldora de co-marca.
  - Tres tipografías de Fontshare.

**Lo que marcan juntas:**
- Una firma visual por página y calma en el resto.
- Imagen propia, nunca de stock.
- La co-marca siempre visible.
- Movimiento ligado al scroll.
- Un cierre con contacto concreto.

**Se copia el nivel, no el aspecto:** si esta landing vuelve a llevar vídeo en letras y raíl
lateral, será L'Occitane con otro logotipo.

### Criterio del rediseño final: nivel Apple

*Añadido el 2026-09-23 con el prompt «REDISEÑO FINAL». Manda sobre la fase 4.*

- **Fluidez antes que efecto.** Cero pins y cero scroll-jacking: ninguna animación detiene, retrasa
  ni captura el scroll. Si un efecto no llega al presupuesto, se simplifica hasta que llega.
- **Presupuestos:**
  - 60 fps estables (120 donde la pantalla lo permita).
  - Ninguna tarea de más de 50 ms durante el scroll.
  - INP < 200 ms, CLS < 0,02.
  - LCP < 2,0 s en escritorio y < 2,5 s en móvil.
  - JS inicial < 250 KB comprimido.
  - Vídeo < 2 MB.
  - Lighthouse móvil ≥ 90.
- **L'Occitane es el listón de acabado y de ritmo, no de efectos** (medido en `design/listón.md`).
  Todas las ideas son propias: hoja 2026 → 2027, lamas de la fachada, mármol vivo, abrir y hojear
  arrastrando, deslizable de pintura.
- **«Esade es geometría, Vänster es líquido».** Las secciones de Esade tienen bordes rectos (lamas y
  diagonales). Las de Vänster son de mármol vivo con bordes ondulados. El lockup es líquido por
  geometría.
- **Objetos fotográficos:** las fotos de producto se componen con el diseño real (OpenCV) y los
  logos oficiales. No se usa 3D.

### Caja de referencias (David Comellas)

David: *«todo en general. lo que consideres.»* Entran las tres, y yo decido en las fases 2 y 5
cuánto se usa de cada una, siempre supeditado a la marca de Esade.

```
Chelsea & Co · chelseaco.agency · cómo separa secciones
Lo que se toma: bloques de color a sangre que cambian de una sección a otra; titular de serifa
a gran tamaño; tres columnas separadas por filetes verticales ("We Build / We Create / We Empower").
Lo que NO se toma: el sector (bebidas), la ilustración retro, la paleta amarillo y coral.

Skiper UI 58 · "Text roll navigation" · el gesto al pasar el ratón
Lo que se toma: palabras grandes en mayúsculas cuyas letras ruedan al pasar el cursor. Para el
menú o el CTA, en la fase 5.
Lo que NO se toma: el código (no se instala) ni el menú a pantalla completa.

Skiper UI 95 · "Scroll progress 003" · cuánto queda por leer
Lo que se toma: una regla lateral de marcas finas con un número que avanza con el scroll.
Lo que NO se toma: el código (no se instala).
```

No son referencias de pieza, son fuentes de consulta:
- **Five Shelves** (design-inspo-bay.vercel.app): 40 sitios de inspiración en cinco estantes.
  Es de donde sale el barrido de la fase 2.
- **Fontshare Pairs** (fontshare.com/pairs): 59 parejas tipográficas en uso. Para la fase 3, si
  se revisa la tipografía provisional.

**Lo mío:**
- He usado `impeccable shape` para la entrevista.
- No he usado `impeccable init`, porque escribiría PRODUCT.md y aquí el archivo único es este plan.
- La parte de dirección visual de `shape` va a la fase 2.

## 1 · Mensaje

*Cerrada. La estructura se aprobó tal cual (7 secciones y las tres cosas añadidas) y el copy con
dos cambios y la dirección confirmada, todo ya aplicado.*

**Qué tiene que creer al terminar:** *«Vänster puede diseñar para nuestra gente una agenda y un
calendario que parezcan hechos por Esade, no comprados en un catálogo.»*

**Lector:** quien decide el regalo de fin de año en Esade (RRHH o Comunicación interna).
- No ha pedido esta propuesta, pero conoce a Vänster porque ya ha trabajado para Esade.
- Tiene que poder reenviar la página hacia arriba y resumirla en dos frases.
- Trato: de vosotros.

**Secciones y su argumento:**
1. **Portada.** *Esto es para Esade y es un regalo para su gente.* Co-marca esade × Vänster, la
   propuesta en una línea y el objeto a la vista. Cuatro elementos de texto como mucho.
2. **La idea.** *No es un objeto promocional con nuestro logo: se diseña desde cero con nuestra
   identidad.* Es el contraste con el catálogo, la frase de lo que no somos.
3. **La agenda 2027.** *Es un objeto que nuestra gente usará cada día y que habla como Esade.*
   Espiral, tapa dura, tamaño tipo A5. Como idea a proponer: el nombre de cada persona en la
   tapa.
4. **El calendario de sobremesa 2027.** *Acompaña el puesto de trabajo los doce meses.* Dos
   paneles: el mes a un lado y el diseño al otro. Como idea a proponer: las fechas propias de
   Esade marcadas.
5. **Con vuestra marca.** *Respeta nuestro manual; no habrá que corregir nada de marca.* Sus
   azules, sus diagonales, "esade" en minúsculas como elemento gráfico.
6. **Quiénes somos.** *Ya nos conocen.* Vänster ya ha diseñado para Esade programas, informes y
   gráficas para eventos y jornadas. Estudio de diseño de Barcelona desde 2010, del diseño a la
   producción.
7. **Cierre.** *Hablarlo cuesta un correo.* Si ya regaláis algo, esto puede serlo este año; si
   no, es una forma sencilla de empezar. Precio, cantidades y plazos se hablan juntos. Correo,
   teléfono, dirección y web.

**Lo que no se dice:**
- Precios, cantidades ni plazos concretos. Tampoco "desde X €".
- Nada sobre sostenibilidad o materiales que no esté confirmado.
- "Con tu logo", "personalizado", "visibilidad de marca", "merchandising".
- Que Esade ya regala algo, ni qué.
- Que Esade la ha pedido.
- Que forma parte de una campaña con otros clientes. Tampoco se nombra a ninguno.
- Las ideas (nombre por persona, fechas de Esade) no se prometen: se proponen.
- El claim de Esade ("Do Good. Do Better.") no se usa como titular nuestro.

**La acción final:** *«Quiero hablarlo»*, que abre un correo a info@vanster.design. Al lado,
el teléfono, la dirección y la web de Vänster.

**Expresiones de David, tal cual:**
- *«un catálogo pone tu logo en una agenda genérica»*
- *«diseña la agenda y el calendario desde cero con la identidad de Esade: sus azules, sus
  diagonales, su forma de escribir "esade"»*
- *«Es un objeto que parece hecho por Esade para su gente, no un regalo promocional.»*
- *«como ya hemos trabajado con ellos, conocemos su marca»*
- *«si ya regaláis algo, esto lo hace mejor; si no, es una forma sencilla de empezar»*

**Lo investigado (lo mío):**
- **Esade, con sus palabras:**
  - *«Do Good. Do Better.»*
  - *«Para nosotros lo primero son las personas»* (en "Trabaja con nosotros").
  - *«Las personas son el activo más importante de nuestra institución»* (en "Personas").
  - Valores: integridad, sensibilidad, diversidad, bien común, justicia y sostenibilidad.
  - Tiene una iniciativa interna, Community Building, para *«crear sentimiento de comunidad»*.
  - Tres campus: Barcelona-Pedralbes, Barcelona-Sant Cugat y Madrid.
  - Plan de Sostenibilidad con 6 compromisos y 127 acciones.
  - Fuente: esade.edu, consultada el 2026-09-23.
- **Número de trabajadores:** (?) no está publicado. El manual enseña una captura de LinkedIn
  con "3208 empleados" (p. 33); no vale como cifra.
- **Lo que ya hacen y no rinde:** (?) no se sabe si Esade ya regala algo a fin de año, ni qué.
  David: no se afirma nada.
- **Vänster y Esade:** Esade sale en la lista de clientes de vanster.design. Su ficha de
  portfolio dice: *«maquetamos y diseñamos todo tipo de soportes comunicativos: programas,
  informes y gráficas para eventos y jornadas»*. Servicios: diseño, maquetación, iconografía.
  Comprobado en vanster.design el 2026-09-23.
- **El lenguaje de la competencia (se evita):** agencias de catálogo con "agendas
  personalizadas desde 1,28 €", "con logo", "visibilidad de tu marca durante 12 meses",
  "regalo clásico". Las palabras que no hay que usar: personalizado con logo, visibilidad,
  merchandising, desde X €.
- **El calendario del encargo:** el sector recomienda cerrar las agendas entre septiembre y
  octubre para llegar a Navidad.
- **La misma campaña con L'Occitane:**
  - Estructura: portada, ¿qué os proponemos?, productos, quiénes somos, ¿hablamos?
  - Trata al lector de vosotros.
  - Tics que no se repiten: números 01/02 como decoración, etiqueta en mayúsculas encima de
    los titulares, "Your online & offline creative partner".

### El copy

*Ronda de David del 2026-09-24: menos letra, títulos sutiles y estratégicos, dos en pregunta. Pasado
por el linter de slopmonster (5/5, su nota es de inglés) y revisado a mano contra la ley 1 de
`criterio.md`. Fuente única: `src/content/copy.js`. De unas 434 palabras visibles a 240.*

**1 · Portada**
- H1: Un año entero sobre la mesa
- Subtexto: La agenda y el calendario 2027 de Esade, para regalar a fin de año.
- Botón: Ver la propuesta

**2 · La idea**
- H2: ¿Un logo en una agenda o una agenda de Esade?
- Una agenda de catálogo con un logo se reconoce enseguida como regalo promocional. Nosotros
  diseñamos el objeto entero con la identidad de Esade.

**3 · La agenda**
- H2: ¿Dónde pasa el año una agenda?
- Abierta sobre la mesa. Por eso es de espiral, con tapa dura y tamaño A5, y lleva los azules y las
  diagonales de Esade.

**4 · El calendario**
- H2: Doce meses a la vista
- En un panel, el mes; en el otro, el diseño de Esade. Y sus fechas marcadas, las que no trae
  ningún calendario comprado.
- Campo: Marca una fecha de Esade

**5 · Quiénes somos** (el 1-2-3 de L'Occitane, sin párrafos)
- H2 (etiqueta): Quiénes somos
- 01 Diseñamos desde cero · 02 Con vuestra marca · 03 Y lo producimos

**6 · Cierre**
- H2: ¿Hablamos de los próximos pasos?
- Nos encantaría presentaros la propuesta en persona, resolver cualquier duda y ajustar cada pieza
  a lo que necesitan de verdad vuestros equipos.
- Botón: Quiero hablarlo (abre un correo a info@vanster.design)
- Datos: info@vanster.design · 93 164 89 25 · c. Diputació, 322, 08009 Barcelona (abre Google Maps)
  · vanster.design

**Fuera:** la sección «Con el manual de Esade abierto al lado» (eliminada por David el 2026-09-24,
con su apilado).

**Descripción para compartir el enlace:** Propuesta de Vänster para Esade: una agenda y un
calendario 2027 diseñados con la identidad de Esade, como regalo de fin de año para vuestra gente.

**Comprobado:**
- 0 rayas largas.
- Sin cifras inventadas. "Desde 2010" y el trabajo para Esade salen de vanster.design; el
  teléfono, también; los 5–15 grados y los tres colores, del manual.
- Sin párrafo final que resuma y sin "no solo X, sino Y".
- Sin palabras vetadas. Lo único que aparece es "desde 2010", que es un año, no un precio.
- Dos enumeraciones de tres, y las dos son listas reales: lo que Vänster hizo para Esade y
  "precio, cantidades y plazos".
- Frases de longitud muy distinta en cada bloque.

**La dirección de Vänster:** c. Diputació, 322, 08009 Barcelona. La confirmó David el 2026-09-23;
la de vanster.design (Sant Cugat) está desactualizada.

## 2 · Bocetos

*Reabierta. La ronda 1 (Bañada, Editorial y Diagonal, estáticas y con Esade mandando) se descarta:
la marca que hablaba era la equivocada y parecían webs estáticas. La ronda 2 aplica los dos
cambios.*

**Decisiones de David, ronda 2 (2026-09-23).** Los bocetos siguen en
`scratchpad/bocetos2/` hasta cerrar la fase.

**Dirección elegida: una mezcla con *Editorial* de base.**
- La página es la de *Editorial*, con fondo claro. Esade solo vive dentro de los objetos (tapa,
  calendario, piezas).
- De *Bañada* se toman los bloques fucsia de Vänster (`#C40452`), solo en las secciones donde
  habla Vänster: La idea, Quiénes somos y el cierre.
- Ninguna sección a pantalla completa en azul oscuro de Esade. La marca que manda en la página es
  Vänster.
- El lockup es **«vänster × esade»**, con Vänster primero.

**Portada nueva: el vídeo del campus ligado al scroll.** Sustituye al efecto 12.
- Archivo: `gemini_generated_video_37904c00.mp4`. No va al repo.
- Sección sticky de 300vh. El scroll elige el frame que se pinta en un `<canvas>`, en modo
  "cover" y respetando el punto focal. No se usa `video.currentTime`.
- Punto focal: el rótulo y la puerta, más o menos al 44 % del ancho y al 45 % del alto.
- Carga:
  - el primer frame va como imagen normal, para el LCP;
  - después se precarga uno de cada cuatro frames y luego los intermedios;
  - con movimiento reducido, solo el último frame.
- Frames:
  - en WebP a 12 fps, calidad de unos 75, sin audio;
  - escritorio, ancho máximo de 1920 px;
  - móvil, un recorte 9:16 centrado en el punto focal, sin escalar si queda por debajo de 720 px;
  - todo en Vercel Blob.
- Texto encima, con la marca de Vänster:
  - «vänster × esade» arriba;
  - hacia el 70 %, el titular (de momento «TITULAR PENDIENTE»; lo cambia David antes de
    publicar).
- Al 100 %, la agenda sube y tapa el vídeo.
- Paso 0 hecho el 2026-09-23 (ffprobe y hoja de contactos en `design/check-logo.png`). **Pendiente
  de que David confirme que no se deforma ninguna letra.**

**Firma: el 1, el nombre en la tapa, con el listón del objeto subido.**
- Iluminación de entorno suave de estudio y sombra de contacto.
- Tapa rígida con grosor y canto visibles.
- Espiral metálica con reflejos.
- Papel con textura.
- El nombre en estampación en caliente: metálico, con un brillo que se desplaza cuando la agenda
  se inclina.
- Plan B en móvil, si no llega a ese nivel: un render estático de calidad, no una tapa plana.

**Segunda firma: el 3, en versión corta.** Mismo modelo 3D: después de escribir el nombre, la agenda
se abre. El 4 (12 meses) queda fuera, porque con el pin de la portada la página se hace demasiado
larga en móvil.

**Calendario: el 2 (fecha marcada).** Selector propio en escritorio; el nativo solo en pantallas
táctiles.

**Coro:**
- 6 · titulares con máscara.
- 8 · CTA con letras que ruedan: 15 ms por letra y 300 ms o menos en total.
- 9 · el objeto se inclina hacia el puntero.
- 11 · el lockup cambia de archivo según el fondo.
- 13 · el comparador catálogo contra diseño. La agenda "genérica" la dibujamos nosotros; nunca
  una foto de catálogo ni logos de otros clientes.
- 16 · revelado por clip-path.
- 17 · copiar el correo, con el aviso «Correo copiado».

**Fuera:** 5, 7, 10, 12, 14, 15 y 18.

**Texto aprobado en esta ronda:**
- «Pon un nombre en la tapa» (con «Marta Puig» de ejemplo).
- «Marca una fecha de Esade».
- «Correo copiado».
- Dentro de los objetos: «2027», «enero» y los días de la semana en castellano. **(?) Pendiente de
  que Vänster confirme el idioma** de los objetos.

**Tipografía dentro de los objetos:** Montserrat y Mulish, **provisionales hasta la fase 3**.

Se toma de las descartadas: de *Bañada*, los bloques fucsia y el nombre en la tapa 3D. De
*Diagonal*, la fecha marcada. De *Editorial*, la base, la agenda que se abre y el revelado.
Referencias: la caja de la fase 0 y el barrido del 2026-09-23 (Appointed, Papier, Baronfig, Hex
Pens, Octaevo, Next Chapter, Collins, Koto, Y Studio).
Lo que chirría, para vigilar: el objeto 3D de los bocetos parece un dibujo plano.

**El fucsia de Vänster es `#C40452`**, el del PDF oficial (confirmado por David el 2026-09-23). El
`#EE3364` era el de su web, pintado al 90 %, y no se usa.

**Librerías:** en los bocetos, GSAP, Lenis y three se cargan por CDN. En la web definitiva se
instalan con npm (antes se pregunta y se actualiza el stack de CLAUDE.md).


## 3 · Espina

*Extraída del boceto *Editorial* de la ronda 2 y regularizada. La aprobé yo en autonomía; ver
«Decidido sin David».*

**Rejilla:**
- 12 columnas, con hueco de `clamp(16px, 2vw, 32px)` y margen exterior de `clamp(20px, 5vw, 72px)`.
  Anchura máxima de 1360 px.
- Solo dos líneas de arranque: la columna 1 (titulares y texto) y la columna 7 (objetos o segunda
  columna).
- En móvil, una columna con 20 px de margen.

**Letras:** Montserrat para titulares (800 en el H1, 700 en el H2) y Mulish para el texto (400 y
600). Escala fluida:

| Rol | Tamaño | Interlínea | Tracking |
|---|---|---|---|
| H1 | `clamp(2.5rem, 5.4vw, 5.5rem)` (techo de 88 px) | 1,02 | -0,035em |
| H2 | `clamp(2rem, 3.6vw, 3.5rem)` | 1,05 | -0,025em |
| Frase grande (Quiénes somos) | `clamp(1.5rem, 2.4vw, 2.25rem)` | 1,25 | — |
| Cuerpo | 1,125 rem | 1,6 | — |
| Etiqueta | 0,875 rem | — | — |

La medida máxima del texto es de 60ch.

**Color:** comprometido en la voz de Vänster y contenido en el resto.

| Token | Valor | Contraste con blanco |
|---|---|---|
| `paper` | `#FFFFFF` | — |
| `ink` | `#16141A` | 18:1 |
| `ink-2` | `#55515A` | 7,8:1 |
| `rule` | `#E7E5E9` | — |
| `vanster` | `#C40452` | 6,0:1 |
| `on-vanster-2` | `#FCE6EE` (texto secundario sobre fucsia) | 5,0:1 sobre fucsia |

- Fucsia a pantalla completa solo en La idea, Quiénes somos y el cierre.
- El color de Esade solo vive dentro de los objetos.
- **Claro:** fondo blanco. La escena es una oficina de día y un enlace reenviado por correo.

**Imagen:** el vídeo del campus en la portada, y los objetos hechos por nosotros (3D y SVG). Nada
de stock.

**El efecto que manda:** el nombre en la tapa (firma 1). La apertura de la agenda (3) es su segundo
tiempo, sobre el mismo objeto. El vídeo de la portada es la escena de entrada: va sin efectos de
texto propios.

**Formas:**
- Radio 0 en todo: botones, campos y selector.
- Bordes con filete de 1 px `rule`.
- Profundidad solo en los objetos, con sombra de contacto.

**Botones:**
- **Primario:** fondo fucsia y texto blanco, en mayúsculas (Montserrat 600, tracking 0,06em), de
  52 px de alto. Sobre fucsia se invierte: blanco con texto fucsia.
- **Estados:**
  - Hover: las letras ruedan (15 ms por letra, 300 ms en total).
  - Foco: anillo de 2 px en fucsia (blanco sobre fucsia), a 3 px del botón.
  - Pulsado: `scale(0.97)`.
  - Desactivado: 40 % de opacidad.
- **Secundario:** enlace con subrayado fucsia de 2 px.

**Encabezados y navegación:**
- Los H2 arrancan en la columna 1. Sin etiquetas encima y sin números.
- Cabecera fija de 72 px (64 en móvil): lockup «vänster × esade» a la izquierda y CTA a la
  derecha. Cambia de logo según el fondo (blanco sobre el vídeo y el fucsia).

**Idioma del movimiento:**
- Curvas con duración: `--ease-out: cubic-bezier(0.23,1,0.32,1)` y, en GSAP, `expo.out` o
  `power3.out`.
- Entradas de 600 a 900 ms, interfaz por debajo de 300 ms, scroll con `scrub` de 0,6 a 1.
- Única excepción: el objeto 3D sigue al puntero con amortiguación crítica, sin rebote.
- Un solo reloj: Lenis dentro de `gsap.ticker`.

**Tokens:** `src/app/globals.css` (`:root`) y `tailwind.config.js`, que lee las mismas variables.

**Aparatos:** ordenador y móvil.

## 4 · Construir

*Terminada. Vista en captura a 1440 y a 390 px (`design/final-check/`), con movimiento reducido y
sin JavaScript.*

**Se desvió de la espina:**
- La portada mide 400svh, no 300: 200 de vídeo, 100 para que suba «La idea» y el propio alto de la
  pantalla.
- La cabecera sobre el vídeo lleva un velo oscuro degradado, porque sobre las lamas blancas no se
  leía.
- En móvil la agenda no se fija: se abre al pasar por delante.

**Archivos de la pieza:**
- `src/app` (layout, página y tokens en `globals.css`).
- `src/components` (una pieza por archivo).
- `src/content/copy.js` (todo el texto) y `src/content/agendaRender.js`.
- `src/lib` (marca, movimiento, texturas y homografía).
- `public/brand` (logos) y `public/agenda/render.webp`.
- `scripts/render-agenda.cjs` (regenera el render del plan B).
- **Fuera de Git:** los frames de la portada (`public/hero-frames/`), provisionales y a 720p.

**Pendiente, fuera de mi alcance:**
- **El parche del vídeo:** `design/esade-campus-original.jpg` no ha llegado. Cuando esté, se hace la
  homografía SIFT sobre las cuatro zonas.
- **El vídeo en 4K**, en 16:9 y 9:16.
- **Subir los frames a Vercel Blob.**


## 5 · Rediseño final

*Prompt «REDISEÑO FINAL» (2026-09-23/24), hecho en autonomía. Sustituye a la construcción de la
fase 4: sin 3D, con objetos fotográficos, mármol vivo y lamas. Verificado en producción.*

**Tokens de movimiento** (`src/app/globals.css` y `src/lib/motion.js`):

| Token | Valor | Uso |
|---|---|---|
| Curva única de entrada | `cubic-bezier(0.22, 1, 0.36, 1)` (`--ease`, GSAP `'vanster'`) | Toda entrada y todo cambio de estado |
| Pulsación | `scale(0.97)` en 100 ms | Botones, píldoras, tiradores, campos |
| Muelle sin rebote | rigidez 400, amortiguación 40 (crítica) · CSS `--spring` = `linear()` de 450 ms | Al soltar; tapa, hojas y deslizable |
| Muelle lento | rigidez 170, amortiguación 26 (crítica) | Giros grandes (tapa, hojas) |
| Duraciones | 100 · 300 · 450 · 700 ms | Pulsar · interfaz · giros · entradas |
| Enlaces | opacidad 0,7 al pasar, 0,6 al pulsar, 300 ms | Solo con `(hover: hover) and (pointer: fine)` |
| Radios | 0 · 999 px · 12 px | Piezas de Esade y campos · píldoras y círculos · el panel del selector |

**Excepciones pedidas por David:** las lamas de la portada van con `expo.out` en 1,1 s y un
escalonado de 35 ms; el tirador lleva la flecha en el amarillo de la veta `#FBA90E`.

**Arquitectura:**
- Un solo reloj: `gsap.ticker` mueve Lenis (solo rueda y trackpad), ScrollTrigger, los muelles y
  los cuatro lienzos del mármol.
- Cero pins. Los apilados son CSS sticky con scrub:
  - la portada queda debajo de «La idea», escala a 0,94 y se oscurece;
  - «Con vuestra marca» queda debajo de «Quiénes somos».
- **Objetos fotográficos** (`scripts/composite.py`, `scripts/render-designs.cjs`):
  - Tres fotos ampliadas ×2 con Real-ESRGAN.
  - Esquinas afinadas con gradiente y Huber.
  - Diseños renderizados desde el SVG oficial, deformados con homografía y multiplicados por el mapa
    de luz (luminancia / p95).
  - Las anillas, recortadas en una capa aparte.
- **Mármol vivo** (`src/lib/marble.js`): WebGL a mano, un quad por lienzo, dos capas de *domain
  warping*.
  - Se agita con el scroll (hasta 3×) y el cursor lo remueve.
  - Bordes líquidos que solo ondulan en la franja que sobresale.
  - Arranca por proximidad y se pausa fuera de pantalla.
  - Pasa a imagen fija si no llega a 55 fps.
- **Vídeo** (`scripts/video.sh`): sin audio, desenfoque σ 5 dentro del archivo, y σ 14 solo en la
  placa y en el banderín con texto inventado.
- **Mármol en imagen** (`scripts/marmol.py`): versión para texto con la luminancia comprimida en
  OKLab; contraste mínimo medido 4,8:1 con texto blanco en el 100 % de los píxeles.

**Verificación (producción, `next build` + `next start`):**

| Medida | Presupuesto | 1440 (rueda) | 390 (táctil) |
|---|---|---|---|
| fps en el recorrido completo, normal y a ráfagas | 60 | 59,8 | 59,9 |
| Tareas largas durante el scroll | 0 > 50 ms | 0 | 0 |
| LCP (traza real) | < 2,0 / 2,5 s | 124 ms | 60 ms |
| CLS | < 0,02 | 0,008 | 0,0001 |
| INP (aprox.) | < 200 ms | 64 ms | 64 ms |
| Mármol en la GPU (mediana por lienzo) | ≤ 1 ms | 0,62–0,86 ms | 0,07–0,19 ms |
| JS inicial | < 250 KB | 243 KB gzip · 211 KB brotli | — |
| Vídeo | < 2 MB | 646 KB mp4 · 388 KB webm | 220 KB · 151 KB |
| Lighthouse | ≥ 90 en móvil | 98 escritorio | 91–93 (accesibilidad 100) |

- **LCP de Lighthouse en móvil:** su simulación da 3,0–3,5 s. Es su modelo pesimista, que suma la
  descarga de todo el JS en 4G lento; el LCP real es la hoja de «2026», pintada a los 60–124 ms.
- **Pruebas de uso** con ratón, dedo y teclado:
  - el comparador, abrir y cerrar la agenda, y hojear el calendario (arrastrando, con un toque,
    con las flechas y con los botones);
  - el selector, que hace pasar las hojas en ráfaga y marca el día;
  - el deslizable: correo, portapapeles y aviso.
  - Además, el scroll vertical nunca se bloquea encima de los objetos.
- **Archivos:** capturas, trazas resumidas, informes de Lighthouse y la comparativa con L'Occitane,
  en `design/final-check/`.

**Pendiente, fuera de mi alcance:** la tira de trabajos de Vänster para Esade (ver «Decidido sin
David»). Hacen falta piezas con la identidad actual de Esade.

### Ronda de David (2026-09-24): el relato por delante de los efectos

Crítica completa (impeccable critique, 20/32) a partir de sus notas. Él eligió «fucsia + mármol una
vez» y «jerarquía solo con composición»; lo de la agenda me lo dejó a mí.
- **Dos piezas, dos capítulos gemelos:**
  - Cada pieza lleva título a toda anchura, objeto protagonista (8 columnas, encuadre 1,2:1) y, al
    lado, texto y campo.
  - La agenda va sobre blanco y el calendario sobre gris papel, así que el cambio de fondo marca el
    cambio de pieza.
  - Ya no hay objeto antes del título.
- **La agenda, una sola vez:** la vista cenital, cerrada y centrada con el nombre.
  - Se personaliza desde el campo; si estaba abierta, se cierra al tocarlo.
  - Se abre arrastrando en el mismo sitio, y el encuadre se desplaza con el giro hasta centrar la
    doble página.
  - La foto en tres cuartos queda solo en el comparador de «La idea», que es el argumento.
- **Fucsia de Vänster:**
  - El mármol sale una sola vez (la hoja de carga y «La idea»), comprimido hacia el fucsia #C40452.
  - Quiénes somos va en fucsia plano con el logotipo blanco grande.
  - El cierre es el anochecer bajo el fucsia en multiplicar, como las tarjetas de Vänster: mármol
    delante, fucsia detrás.
- **Lamas solo en la portada:** las de «Con vuestra marca» y el cierre no significaban nada. Fuera.

## Decidido sin David

*Una línea por decisión, con el porqué. David la revisa al final.*

- **Fase 3 cerrada sin candado de modo plan.** David está en clase y pidió autonomía; la espina está
  arriba para revisarla.
- **Vänster: Montserrat y Mulish.** Son las de su web y las del PDF (`marca/vanster/LEEME.md`), así
  que no hay sustituto.
- **Radio 0 en toda la página.** Las tarjetas de Vänster y el CTA web del manual de Esade son
  rectos; un único sistema de radios.
- **Portada:** el titular que aparece hacia el 70 % es el H1 aprobado («La agenda y el calendario
  de Esade para 2027»), con el subtexto y «Ver la propuesta». «TITULAR PENDIENTE» no se pone
  porque CLAUDE.md prohíbe textos de pendiente visibles en la web.
- **Al 100 % del vídeo sube «La idea»** (el bloque fucsia) con el comparador de agendas, no la
  sección de la agenda. Así se respeta el orden de secciones cerrado en la fase 1 y el paso del
  edificio al producto se ve igual, porque en el comparador ya está la agenda.
- **Frames del vídeo:** se extrajeron con `cwebp`, porque el ffmpeg instalado no trae WebP. El
  recorte de móvil sale a 404×720 px.
- **Portada de 400svh en lugar de 300vh:** con 300 no había tramo para que «La idea» subiera
  después del vídeo; tapaba el titular a mitad.
- **Unidades svh en la portada:** en el iPhone, `vh` mide la pantalla sin la barra del navegador y
  el scroll no cuadraría con el vídeo.
- **Cabecera sobre el vídeo con velo degradado oscuro** (de 50 % a 0): el lockup y el botón blancos
  no se leían sobre las lamas blancas.
- **Lockup en la cabecera:** Vänster a 21 px de alto y esade a 38 px (15 y 27 px en móvil). En
  móvil, el botón de la cabecera se compacta para que no pise el logo.
- **Título de la pestaña:** «vänster × esade», el mismo orden que el lockup.
- **CTA en la cabecera y en el cierre**, con la misma etiqueta («Quiero hablarlo»). Es una sola
  intención y está siempre a mano.
- **Letras que ruedan:** 15 ms por letra y 90 ms por letra, 300 ms en total, como aprobó David.
- **Comparador (coro 13):** a la izquierda, un cuaderno negro de polipiel con goma y el logo de
  Esade impreso pequeño en una tinta; a la derecha, la tapa diseñada. Sin rótulos visibles, solo
  una etiqueta para lectores de pantalla. Se mueve arrastrando o con las flechas.
- **Agenda 3D (firma 1):**
  - Tapa de 3,4 mm con canto redondeado, espiral de 24 anillas metálicas y papel con grano.
  - Nombre en plata metálica con barniz: el brillo sale de los reflejos del estudio y se desplaza
    al inclinar.
  - Tono neutro de color, para no agrisar los azules de Esade.
  - Entorno de estudio hecho con softboxes, sin descargar nada de fuera.
- **Plan B de la firma:** un render estático del propio modelo (`public/agenda/render.webp`) con el
  nombre en HTML superpuesto en perspectiva exacta. Se usa si no hay WebGL2, con movimiento
  reducido o con ahorro de datos. En móvil con WebGL2 se ve el 3D.
- **Apertura (firma 3, corta):**
  - En escritorio, la escena se fija; el primer 30 % del tramo es para leer y escribir, y después
    se abre la tapa.
  - En móvil no se fija: se ve cerrada junto al campo y se abre al subir.
  - Intro en el campo baja hasta la agenda abierta.
- **Calendario:**
  - Las 12 hojas solo usan azul oscuro, azul claro y blanco, porque el cuadro del día marcado va
    en azul claro y así nunca pasan de 3 colores.
  - Con dos diagonales, siempre azul oscuro más otro color, como pide el manual.
  - Los nombres de los 12 meses van en castellano; «enero» estaba aprobado y el resto sigue la
    misma regla. **Pendiente de que Vänster confirme el idioma.**
- **Selector propio de fecha:** cuando está vacío muestra «dd / mm / 2027», como hace el selector
  nativo. En el panel, el día elegido va en fucsia (es interfaz de Vänster), mientras que en la
  hoja del calendario va en azul claro (es pieza de Esade).
- **«Con vuestra marca»:** un pliego con tres piezas sin rótulos: los dos azules con una diagonal
  a 15º, la palabra esade (el logotipo) y una diagonal a 5º. Fondo gris neutro `#F3F3F4`, para
  separar la sección de sus vecinas blancas.
- **Quiénes somos y cierre, seguidos en fucsia:** es un solo capítulo de Vänster; los separa un
  filete blanco y tienen composiciones distintas.
- **Pie:** solo el lockup, porque los datos de contacto ya están en el cierre. Sin «©», que no está
  en el copy aprobado.
- **Movimiento:**
  - Todo con GSAP y ScrollTrigger dentro del reloj de Lenis.
  - Motion (Framer Motion) no se usa en esta versión: no hacía falta y así no se mezclan motores.
  - La inclinación del objeto usa amortiguación crítica sin rebote.
- **Ley 2:**
  - Titulares y bloques visibles por defecto; solo se esconden en el instante en que empieza su
    animación.
  - Sin JavaScript se leen todos los textos, el comparador sale en dos columnas y la agenda
    aparece como render.
- **Icono del comparador y del selector:** dos flechas y un calendario dibujados como formas
  geométricas simples, sin librería de iconos, porque no estaba autorizada.

### Rediseño final (2026-09-23/24)

- **Skills: hay 13 de las 23 esperadas.** Faltan improve-animations, find-animation-opportunities,
  animation-vocabulary, pick-ui-library, redesign-existing-projects, image-to-code,
  imagegen-frontend-web, brandkit, full-output-enforcement y youtube. No las instalo: no estaban
  autorizadas.
- **21st.dev:** sin su MCP en esta sesión. Los componentes (revelado, magnético, arrastre con
  inercia) salen de GSAP (SplitText, Draggable, InertiaPlugin) y de código propio. Nada de shadcn.
- **Fotos de GPT** renombradas: agenda-cerrada (tres cuartos), agenda-abierta (cenital) y
  calendario (caballete). Se amplían con Real-ESRGAN x4 y se reducen a ×2 con Lanczos, porque la
  opción -s 2 del modelo x4plus rompía los mosaicos. Las ampliaciones quedan fuera de Git.
- **Proporción real medida:** la tapa y las páginas son de 0,77, no el A5 0,705, y la hoja del
  calendario de 1,45. Los diseños se recomponen para esas proporciones; nunca se estiran.
- **Color medido tras el mapa de luz:** ΔE2000 ≤ 0,2 en la zona mejor iluminada, para #000B3D y
  #224BA0 en las tapas, la guarda y las 12 hojas. El límite era 3.
- **Vista cenital de la agenda:** la página izquierda se quita del todo en vez de esconderla con
  clip-path.
  - El hueco se rellena con lino en la foto original (luz interpolada y trama cosida con corte de
    error mínimo), y se amplía con Real-ESRGAN para que la trama nueva y la vieja se inventen igual.
  - Así, cerrada, la agenda es solo la tapa sobre la mesa.
- **Tapa de catálogo:** logo blanco oficial pequeño abajo a la derecha, antes de la goma.
  - En el comparador, la diseñada va a la izquierda y la de catálogo a la derecha, con la costura en
    reposo al 56 %.
  - Así ningún logo queda cortado: el de Esade acaba en el 44 % y el de catálogo empieza en el 65 %.
- **Nombre en la tapa:** su línea base pasa del 66 % al 60 % del alto, para que en tapas de 0,77 no
  roce la diagonal.
- **Vídeo:** el desenfoque general (σ 5) aún dejaba adivinar «UNIVERSITY» y «Do Good Do Better».
  Solo esas dos zonas llevan σ 14, con un borde suave; el vinilo del cristal y «esade.edu» ya no se
  leían.
- **Mármol:**
  - El amarillo de la veta, muestreado, es #FBA90E.
  - La versión «marmol-texto» se oscurece en OKLab, devolviendo croma a las vetas claras y girando
    un poco el amarillo hacia el naranja para que no se vuelva oliva.
  - Contraste mínimo medido: 4,8:1.
  - El móvil usa la textura a la mitad y el botón una de 560 px.
- **Tira de trabajos de Quiénes somos: fuera.** Descargué las 7 imágenes de la ficha de Esade en
  vanster.design:
  - Seis llevan la identidad anterior: el logotipo «ESADE» en mayúsculas o con la «E» en bloque,
    que el manual actual prohíbe como elemento gráfico.
  - E3b lleva además logos de otras organizaciones (Fundación abertis, EY, PwC).
  - Solo E1 («Resumen ejecutivo») pasa, y una pieza sola no hace la tira de 3 a 5 que se pedía.
  - Si Vänster tiene piezas con la identidad nueva, entran sin tocar el código.
- **CTA magnético:** el imán (8 px como máximo, solo con ratón) va en la píldora de la cabecera. El
  «Quiero hablarlo» del cierre es el deslizable de pintura del punto 10C, que es posterior y más
  concreto.
- **El amarillo de la veta** está en el «×», en el anillo de foco y en la flecha del tirador (10B).
  El fucsia plano #C40452 queda en la selección de texto, la barra de scroll, el raíl sobre claro y
  el primer color de la hoja de carga. Las anillas no llevan mármol (punto F).
- **Anillo de foco:** amarillo de la veta con un filete de tinta pegado al control, para que se vea
  sobre cualquier fondo. Sobre el vídeo es blanco (12.C). Sigue el radio del control.
- **El tirador:**
  - círculo de 44 px en tinta con filete blanco de 1 px y flecha amarilla, con contraste de 8,9:1
    entre flecha y fondo;
  - es el mismo en el comparador (flecha doble), el borde de la tapa, los meses del calendario y el
    deslizable;
  - la flecha se desplaza 0,75 px hacia la punta (centro óptico).
- **Muelle «sin rebote»:** con rigidez 400 y amortiguación 30 rebota un 3 %. Uso la amortiguación
  crítica (40).
- **Lamas en scaleX por franja,** no con clip-path: el efecto es el mismo y el transform no repinta.
  - La franja arranca 20vh por encima de la frontera.
  - Se cierran despacio y se abren deprisa, para no tapar el texto ni el final de la página.
  - El cierre mide al menos 115svh.
- **Bordes líquidos:** la onda solo vive en los 40 px que sobresalen de la sección (20 en móvil).
  Metida dentro de la sección dejaba ver lo que había debajo.
- **Hoja de carga:**
  - El 6 → 7 dura 450 ms en dos mitades de 225 ms. Como no hay tablillas opacas, cada mitad aparece
    solo cuando le toca.
  - «2026» se lee al menos 0,5 s.
  - La hoja se levanta con rotateX 92° en 700 ms.
  - Si el JS llega después de 1,9 s, se retira con un fundido.
  - Red de seguridad en CSS a los 3,2 s.
- **Titular de la portada:** se pinta desde el primer fotograma bajo la hoja y las lamas (LCP
  temprano), se parte en líneas tapado y no se recompone al acabar. Recomponerlo contaba como
  desplazamiento (CLS); solo se recompone si cambia el ancho de la ventana.
- **Lockup volante:** su punto de partida va en transform, no en left/top (que contaban como CLS).
- **Draggable e InertiaPlugin** se cargan aparte, después de hidratar: el JS inicial baja de 257 a
  243 KB con gzip.
  - Con allowNativeTouchScrolling, Draggable ponía `touch-action: manipulation` y el navegador
    cortaba el arrastre horizontal.
  - Lo fuerzo a `pan-y`: el vertical es del scroll y el horizontal, del dedo.
- **Rendimiento del mármol:**
  - Nunca más píxeles de los que da la textura en ese encuadre.
  - El ruido se calcula una vez (128 × 128) para todos los lienzos; antes costaba cientos de ms con
    la CPU lenta.
  - Cada lienzo arranca cuando su sección está a pantalla y media.
  - Resultado: Lighthouse móvil pasa de 65 a 91–93.
- **Fotos de escena en 800, 1200 y 2400 px**, porque Lighthouse pedía 162 KB menos en móvil.
- **Líneas de escritura de la semana:** azul claro sólido y fino, no al 35 %. Es la ronda de Laura:
  una tinta más clara contaba como un color más.
- **`.gitignore`:** `public/video/*.mp4` sí se sube (lo exige 12 · verificación); quedan fuera los
  vídeos de origen, `design/portfolio/`, las ampliaciones ×2 y las trazas crudas de Chrome.
- **Ronda de las cinco personas sobre la versión nueva:**
  - **Montse (iPhone):** todo lo táctil mide 44 px o más, los campos 18 px (sin zoom), sin desborde
    y el scroll libre sobre los objetos. El deslizable no respondía al dedo (lo del touch-action):
    corregido.
  - **Laura (marca), con las reglas previas de David:** logos oficiales sin cajas ni opacidad; tapas
    y hojas en tres colores y diagonales de 5, 10 y 15°. Corregida la tinta de la semana.
    - Propone quitar «ESADE» en mayúsculas de la demostración. No lo aplico: es la pieza que pidió
      David (se funde en el logo).
    - Señala que el manual no da tamaño mínimo del logo y que en la cabecera móvil la cinta se lee
      pequeña. Lo apunto para Esade.
  - **Jordi (accesibilidad):** Lighthouse 100; orden de tabulación lógico; foco visible en todo;
    un h1 y seis h2.
    - El botón de la tapa pasa a «Abrir la agenda de Marta Puig» (etiqueta y nombre visible).
    - Fuera el aria-label que SplitText ponía en un párrafo.
  - **Pau (rendimiento):** todo en presupuesto salvo el LCP simulado de Lighthouse en móvil
    (explicado arriba).
  - **Yasmina (contra L'Occitane):**
    - Las lamas del cierre tapaban el final de la página: corregido.
    - Los mármoles no se confunden: el suyo es rosa, de piedra, quieto y de fondo; el nuestro es
      pintura roja y naranja que fluye y hace de firma.
    - Quiénes somos queda más sobrio que el suyo por la falta de la tira de trabajos.

### Ronda de David (2026-09-24)

- **Agenda (me lo dejó a mí): solo la vista cenital.**
  - Con la foto en tres cuartos y la cenital en la misma sección parecían dos agendas.
  - El encuadre (80 % del ancho de la foto; 76 % en móvil) se desplaza con el giro de la tapa.
    Cerrada, la agenda queda casi centrada; abierta, la doble página se centra en el lomo.
- **Logotipo vectorial de Vänster:** los trazos salen del PDF de aplicaciones (página del
  mosaico), sin redibujar, y coinciden con el PNG de su web. Los PNG no aguantaban el tamaño de
  Quiénes somos. Ahora el lockup también usa el SVG.
- **Mármol comprimido hacia el fucsia (k = 0,35 en OKLCh):**
  - Se lee fucsia y conserva un hilo del naranja y el amarillo de sus tarjetas.
  - La versión para texto sigue a 4,8:1 o más en el 100 % de los píxeles.
  - El mármol original y la versión naranja siguen en `public/marmol/`, pero la web ya no los
    carga.
- **Quiénes somos sube sobre «Con vuestra marca»** con la onda de Vänster en fucsia plano
  (máscara CSS, sin WebGL). «Con vuestra marca» pasa a blanco con un filete, porque el gris es
  ahora del calendario.
- **Cierre en fucsia en multiplicar sobre el anochecer:** el texto blanco nunca baja de 6:1,
  porque el multiplicar solo oscurece el fucsia.

### Auditoría de David sobre esade-vanster.vercel.app (2026-09-24)

- **Open Graph:** imagen de 1200×630 (`public/og/vanster-esade.jpg`, 128 KB, generada con
  `scripts/og-image.cjs`).
  - Lleva el lockup en blanco sobre el mármol fucsia y la agenda cerrada con «Marta Puig», con la
    misma transformación desde las esquinas que la web.
  - La foto se recorta sobre la agenda y nunca pisa el lockup: en el primer intento tapaba el logo
    de Esade.
  - `metadataBase` es `https://esade-vanster.vercel.app`, con tarjeta grande de X
    (`summary_large_image`).
  - Vista previa comprobada con las etiquetas reales en `design/final-check/antes-despues/og-vista-previa.png`.
    En producción se verá cuando se despliegue.
- **Serif en los objetos de Esade:** primero Georgia, la equivalente del manual; después
  **Newsreader**, aplicada por el encargo de David («la libre más parecida a Esade Type»): en las
  fotos y en el nombre de la tapa (next/font, línea base medida de 0,735em).
  - Va en el nombre de la tapa, el año de la tapa, los meses, los días y las letras de la semana
    del calendario, y la semana de la agenda.
  - La interfaz sigue en Montserrat y Mulish.
  - El nombre del mes sigue sin rozar ninguna diagonal en las 12 hojas: margen de 93 a 225 px.
- **Agenda de catálogo sin el logo de Esade:** lleva un logo genérico neutro (un punto y «LOGO»)
  impreso pequeño en una sola tinta gris plata, en el mismo sitio. La costura en reposo sigue sin
  cortar ningún logo.
- **Barra de progreso:**
  - 24 marcas finas horizontales en vez de anillas de espiral, que en pequeño se leían como una
    columna de ceros.
  - Las recorridas son más largas y más gruesas, en fucsia sobre claro y en blanco sobre color.
  - El trazo no se escala con el tamaño (`vector-effect: non-scaling-stroke`).

### Ronda de David (2026-09-24, tarde)

- **Vuelta atrás:** el rehecho de la landing (portada con foto fija y escenas de agenda y calendario
  fijadas con sticky que retenían el scroll) se deshizo entero. El código vuelve al commit
  «changes 1» más la auditoría. **Regla:** ninguna animación retiene el scroll.
- **Fuera «Con el manual de Esade abierto al lado».**
- **Menos letra y títulos sutiles:** el copy de arriba. El título del cierre baja a la escala del H1
  (`--fs-h1`) para quedar en dos líneas.

### Ronda de David (2026-09-24, noche)

- **La agenda no se personaliza:** fuera el campo, el nombre de la tapa (CoverName) y la frase; la
  imagen para compartir, sin nombre.
- **Redondeo:** tres radios. 10px en fotos y ventana de mármol (leve, no compite con las diagonales
  de Esade), 20px en el panel del selector y 999px en botones y campos. Nada en ángulo recto. En
  móvil las fotos ya no van a sangre (media calle a cada lado) para que se vea el redondeo.
- **Selector de fecha:** en píldora; el panel se abre hacia donde cabe dentro de la sección (antes
  lo tapaba «Quiénes somos») y los días son círculos.
- **Mármol en el catálogo:** bruma del mármol fucsia al 22 % detrás de las palabras de la agenda y
  del calendario (MarbleWash, la de las fichas de L'Occitane): parallax con scrub y deriva de 30 s
  en escritorio; quieta en móvil y con movimiento reducido.
- **Quiénes somos:** el 1-2-3 de L'Occitane. Fucsia plano, tres ideas y una ventana cuadrada del
  mármol con el logotipo blanco.
- **Paso al cierre (MarbleClosing):** la ventana se abre hasta cubrir la pantalla (capa sticky
  recortada con clip-path, sin pin: el scroll nunca se retiene) y, a mitad de camino, el campus al
  anochecer entra por el mármol en multiplicar. Empieza con la ventana al 72 % de la pantalla y
  acaba con el cierre al 30 %. 60 fps medidos (p99 16,8 ms). Con movimiento reducido, la ventana
  fija y el cierre de antes.

### Ronda de David (2026-09-24, cierre y catálogo)

- **Mármol en el catálogo, mejor:** el mármol oscuro para titulares dentro de las letras de «¿Dónde
  pasa el año una agenda?» y «Doce meses a la vista» (MarbleTitle: 6,4:1 sobre blanco y 5,7:1
  sobre el gris papel en el píxel más claro; deriva de 40 s), y la bruma convertida en un halo
  detrás del titular en vez de una mancha a la derecha.
- **Cierre:** el título en pregunta, «¿Hablamos de los próximos pasos?». Todo el contenido en una
  columna a la derecha (8-12): la mitad izquierda es del campus y su rótulo, que el título ya no
  pisa (comprobado a 1024, 1280, 1440 y 1920; en el móvil el título queda por encima del rótulo).
  Jerarquía: pregunta, texto, botón y, tras un filete, los datos más pequeños (en dos columnas
  desde 1200 px).
- **La dirección abre Google Maps** en otra pestaña (en el móvil, la app si está instalada).
- **Personas:** Marta (RR. HH. de Esade, portátil), Pau (iPhone y tableta), Núria (teclado,
  lector y movimiento reducido), Jordi (director de arte de Vänster) y Alex (QA de rendimiento).

### Ronda de David (2026-09-25)

- **Mármol del catálogo, más presente:** la bruma ya no es un halo solo en el titular: cubre toda
  la pieza (titular, texto y alrededor de la foto) al 30 % y se desvanece hacia los bordes.
- **Mármol vivo que sigue al cursor, arreglado:** guardaba la posición del lienzo en la página y le
  sumaba el scroll; la capa del cierre es sticky (fija en pantalla), así que el efecto salía muy por
  encima del cursor. Ahora mide el lienzo en cada movimiento (una lectura, sin escrituras).
- **«Quiero hablarlo» del cierre:** con ratón, al pasar por encima el tirador se desliza solo hasta el
  final llenando la píldora de mármol, y el texto se aparta sin desaparecer; al salir, vuelve (muelle
  suave, sin rebote). En táctil, tocar o deslizar como antes.

### Ronda de David (2026-09-25, piezas alternas)

Skills: impeccable (polish, layout, animate, bolder), design-taste-frontend (lectura: landing
editorial de gama alta; diales 7/6/3), high-end-visual-design, minimalist-ui (estilo cerrado),
emil-design-eng, animate, apple-design, mobile-native e industrial-brutalist-ui (solo consulta: su
geometría en ángulo recto choca con la regla de redondeo, así que no se aplica).
- **Las piezas en zeta:** la agenda con título y foto a la izquierda y texto a la derecha; el
  calendario en espejo (título sobre su foto a la derecha, texto y campo a la izquierda).
- **Un mármol distinto en cada pieza:** la agenda, el apaisado, a la derecha y subiendo con el
  scroll; el calendario, el vertical (otras vetas, a otra escala), volteado, a la izquierda y
  bajando. El mármol de las letras de cada titular arranca en un punto distinto y deriva al revés.
- **Un momento de movimiento por pieza:** la foto entra barriendo desde su lado (la agenda de
  izquierda a derecha; el calendario en espejo) y se asienta de 1,06 a 1 (1,15 s, expo.out), y
  luego un parallax corto con scrub, solo con ratón (PieceMedia). Sin pin; 60 fps medidos (p99
  16,8 ms). Con movimiento reducido, quieto.
- El texto de las piezas sube a 19 px con medida de 36 caracteres.

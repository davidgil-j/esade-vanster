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

*Pasado por el linter de slopmonster (5/5, pero su nota es de inglés y aquí no vale) y revisado a
mano contra la ley 1 de `criterio.md`. Aprobado por David con tres cambios, ya aplicados.*

**1 · Portada**
- H1: La agenda y el calendario de Esade para 2027
- Subtexto: Una propuesta de Vänster para regalar a vuestra gente a fin de año.
- Botón: Ver la propuesta

**2 · La idea**
- H2: Un catálogo pone vuestro logo. Nosotros diseñamos el objeto.
- Una agenda genérica con un logo impreso se reconoce enseguida como regalo promocional. Nosotros
  empezamos por la página en blanco y diseñamos la agenda y el calendario con la identidad de
  Esade, para que quien los abra en enero piense que los ha hecho Esade.

**3 · La agenda 2027**
- H2: La agenda 2027
- De espiral, con tapa dura y en un tamaño tipo A5. La espiral deja que se abra plana sobre la
  mesa, que es donde va a pasar el año.
- Las tapas llevan los azules de Esade y sus diagonales, y la palabra esade escrita como en el
  logotipo.
- Una idea para hablarlo: el nombre de cada persona en su tapa. Así nadie se lleva de la sala de
  reuniones la agenda de otro.

**4 · El calendario de sobremesa 2027**
- H2: El calendario de sobremesa 2027
- Dos paneles: en uno, el mes; en el otro, el diseño. Se queda en la mesa de cada persona los
  doce meses, a la vista de quien trabaja ahí y de quien pasa por delante.
- Otra idea: marcar en él las fechas propias de Esade, las que no salen en ningún calendario
  comprado.

**5 · Con vuestra marca**
- H2: Con el manual de Esade abierto al lado
- Los dos azules principales, en cada pieza. Como mucho tres colores por pieza, como pide el
  manual. Las diagonales entre 5 y 15 grados. Y esade en minúsculas cada vez que el nombre hace de
  elemento gráfico.
- Para que no tengáis que devolvernos una prueba por un color.

**6 · Quiénes somos**
- H2: Ya conocemos vuestra marca
- Somos Vänster, un estudio de diseño de Barcelona desde 2010. Para Esade hemos maquetado y
  diseñado programas, informes y gráficas para eventos y jornadas.
- Diseñamos el objeto y nos ocupamos también de producirlo, así que tenéis un solo interlocutor
  de la primera idea al objeto impreso.

**7 · Cierre**
- H2: ¿Lo hablamos?
- Si ya regaláis algo a vuestra gente a fin de año, esto puede serlo este año. Si no, es una forma
  sencilla de empezar.
- El precio, las cantidades y los plazos los vemos juntos cuando nos escribáis.
- Botón: Quiero hablarlo (abre un correo a info@vanster.design)
- Datos: info@vanster.design · 93 164 89 25 · c. Diputació, 322, 08009 Barcelona · vanster.design

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

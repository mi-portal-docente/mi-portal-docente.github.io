# Progreso · rama `grok-plataforma`

Registro del trabajo autónomo sobre la plataforma (fases 1–8 del encargo). La rama sale de `main`
(14538d9) y **no se ha tocado `main`**. Cada fase tiene su commit; si hay commits intermedios («WIP»),
se dice aquí.

## Cómo se compila y se prueba

* Compilar: `cd fuente/tools && npm ci && npm run build` (salida en `js/` de la raíz).
* Caché: `bash fuente/tools/subir-cache.sh <etiqueta>` cambia todas las `?v=` de `index.html` y `js/acceso.js`.
* Pruebas unitarias nuevas: `node plataforma_test.mjs`.
* Reglas: `cd firebase && npm run test:reglas` (incluye `test/plataforma.test.mjs`).
* E2E de las novedades (emuladores): `bash e2e/run_plataforma.sh` (o `FASES=1,2 bash e2e/run_plataforma.sh`).
  Capturas en `fuente/capturas/fN_*.png` (ignoradas por git).
* E2E de siempre: `bash e2e/ejecutar.sh`.

## Reglas de Firestore

El archivo `fuente/tools/firebase/firestore.rules` cambia en esta rama (ver cada fase). **No se han
desplegado.** Al pasar la rama a `main` hay que pegar las reglas nuevas en la consola de Firebase
(Firestore → Reglas → Publicar) **a la vez** que se publica el código. La versión con el correo del
profesor se genera con `node prepara-reglas.mjs <correo>` (no se sube al repositorio).

Antes de empezar, en `main` la prueba E2E de siempre tenía 1 fallo de 148 (`aula_e2e`: espera de
`.ac-fb` en la actividad 3D, por tiempo); no lo he causado yo.

---

## Fase 1 · Importar JSON y criterio — HECHA

**Qué hay**
* «Trabajo de clase» (y «Organización») → botón **📥 Importar JSON**: pegar o abrir un `.json`; valida,
  muestra los errores en castellano con la ruta (`preguntas[0].correcta`…) y una vista previa; guarda
  **siempre como borrador**. Acepta un elemento, una lista o `{ "elementos": [ … ] }` (hasta 50).
  Tipos: tarea, examen (con preguntas y soluciones), material, pregunta, cuestionario, actividad,
  práctica, proyecto, y los motores nuevos se registran con `registrarMotor()` (fases siguientes).
* Campo opcional **criterio** (p. ej. `eee_c1_1`) en cada tarea/entregable y en cada pregunta de examen,
  visible y editable en el editor. Se valida (sin espacios, máx. 60).
* **⬇ Exportar JSON** en el menú ⋮ de cada elemento y botón «JSON» en el editor: copiar o descargar.
  Los exámenes salen con sus soluciones (aviso en pantalla). Sirve de plantilla: exportar → cambiar → importar.
* Formato documentado con ejemplos en `src/lms/semilla/FORMATO_IMPORTAR.md` (las pruebas comprueban que
  los ejemplos `json` del documento son válidos).

**Archivos**: `src/lms/elemento.js` (nuevo: validar/leer/exportar), `src/lms/preguntas.js` (nuevo:
tipos de pregunta), `src/portal/aula-json.js` (nuevo: ventanas importar/exportar), `src/portal/aula-clase.js`,
`src/portal/aula-editor.js`, `src/lms/semilla/FORMATO_IMPORTAR.md`, `css/plataforma.css` (nuevo, cargado
después de `ios.css`), `index.html`, `js/acceso.js` (caché `gp1-20261113`), `firebase/firestore.rules`,
`firebase/test/plataforma.test.mjs`, `plataforma_test.mjs`, `e2e/plataforma_e2e.mjs`, `e2e/plataforma_f1.mjs`,
`e2e/run_plataforma.sh`, `subir-cache.sh`.

**Reglas**: `items` admite el campo `criterio` (texto ≤ 60). El criterio de las preguntas va dentro de
`examenes/{id}.preguntas` (no cambia la regla). Las tareas sin criterio se guardan igual que antes.

**Pruebas**: `plataforma_test.mjs` 7/7 · E2E fase 1 12/12 · reglas ✔. Las suites de siempre (placa, circ, circ_pins, viv, viv_modelo, aula_modelo, acceso, E2E) se pasan con el estado de esta fase; resultado anotado en la fase 2.

**Capturas**: `f1_importar_errores.png`, `f1_importar_vista_previa.png`, `f1_editor_criterio.png`, `f1_exportar.png`.

**Dudas / pendiente**: ninguna.

---

## Fase 2 · Tipos de pregunta, banco y modo examen — HECHA

**Qué hay**
* Tipos nuevos de pregunta en el editor de exámenes, en la importación JSON y en la vista del alumno:
  **emparejar** (desplegable por fila; distractores opcionales), **ordenar** (botones ↑ ↓, accesible con
  teclado; nunca aparece ya ordenado), **completar huecos** (`[[respuesta|otra válida]]`, sin tildes ni
  mayúsculas), **numérica** con tolerancia absoluta o en % (admite coma decimal y unidad) e **imagen con
  zonas** (el alumno pulsa un punto; zonas en % de la imagen; también con flechas del teclado).
* **Puntuación parcial** en emparejar (por pareja), ordenar (por posición) y huecos (por hueco). La
  autocorrección del cuaderno y el detalle de cada entrega muestran la respuesta y la solución de cada tipo.
* Las soluciones de los tipos nuevos van a `claves` (solo profesor): en `examenes` la derecha y el orden
  van barajados, los huecos como `[[1]]`, y sin zonas ni valor.
* **🗄 Banco de preguntas** por asignatura (botón en «Trabajo de clase»): añadir por JSON (cada pregunta
  con su `criterio`) o copiando las de un examen del curso, verlas por criterio, borrarlas, exportarlas, y
  **generar un examen** con n preguntas al azar de cada criterio (se guarda como borrador). En el editor,
  «🗄 Del banco…» añade preguntas a un examen.
* **Modo examen** (casilla en el examen): pide pantalla completa al empezar, franja fija con «Volver a
  pantalla completa», y anota en `incidencias/{item_grupo_nº}` cada salida de la pestaña o de la pantalla
  completa (hora y duración). El alumno lo sabe antes de empezar. El profesor lo ve en el detalle del
  cuaderno («🛡 Modo examen · salidas»). **Es solo informativo: ni anula ni cambia la nota.** El barajado y
  el tiempo límite ya existían y se mantienen.
* Formatos y ejemplos en `FORMATO_IMPORTAR.md` (tabla de tipos, ejemplo con todos, formato del banco).

**Archivos**: `src/lms/preguntas.js` (tipos nuevos), `src/lms/modelo.js` (corrección genérica),
`src/lms/banco.js` (nuevo), `src/portal/examen-ui.js` (nuevo: pintar/leer respuestas), `src/portal/modo-examen.js`
(nuevo), `src/portal/aula-banco.js` (nuevo), `src/portal/aula-vistas.js`, `src/portal/aula-editor.js`,
`src/portal/aula-panel.js`, `src/portal/aula-clase.js`, `css/plataforma.css`, `FORMATO_IMPORTAR.md`,
`firebase/firestore.rules`, `firebase/test/plataforma.test.mjs`, `plataforma_test.mjs`, `e2e/plataforma_f2.mjs`,
caché `gp2-20261113`.

**Reglas (cambian, sin desplegar)**: nueva colección `incidencias` (el alumno solo crea/añade las suyas, con
claves fijas, `fecha == request.time`, máx. 400 salidas, solo en exámenes publicados para su grupo; no las
puede leer; el profesor lee y borra); nueva colección `banco` (solo profesor); `examenes` admite
`pantallaCompleta` (booleano). Regenerado `/workspace/portal-acceso/firestore.rules.para-pegar.txt`
(fuera del repositorio; la copia anterior está en `/workspace/copias/`).

**Nota técnica**: Firestore no admite listas dentro de listas; la clave de «huecos» guarda cada hueco como
texto `"a|b"` y el banco guarda las parejas como `{i, d}`. Hay una prueba unitaria que lo vigila.

**Pruebas**: `plataforma_test.mjs` 16/16 · reglas 89/89 (fases 1 y 2 incluidas) · E2E fases 1+2: 12/12 y
17/17. Regresión de siempre con el estado de la fase 1: placa, circ, circ_pins, viv, viv_modelo,
aula_modelo, acceso, extra y reglas ✔; E2E `fb_e2e` 59/59 y `aula_e2e` 115/116 (falla «el curso ya no tiene
T.I.Cs 1º Bach…», la comprobación se hace justo después de quitar la asignatura; no toca código de esta
rama: se repite en la fase 3 para ver si es de tiempo).

**Capturas**: `f2_editor_tipos_nuevos.png`, `f2_alumno_examen_tipos.png`, `f2_cuaderno_salidas.png`, `f2_banco.png`.

**Dudas / pendiente**: en iPhone (Safari) la pantalla completa no existe para páginas; allí solo se anota
la salida de la pestaña. Las preguntas generadas del banco conservan el criterio.

---

## Fase 3 · Notas y analítica — HECHA

**Qué hay**
* Cuaderno de calificaciones → **Exportar CSV** (nuevo, por grupo y asignatura): columnas exactamente
  `nº de lista; actividad; fecha; nota; criterio` (nota 0–10 con coma decimal, fecha AAAA-MM-DD, separador «;»
  y BOM para Excel). **Sin nombres.** Los exámenes salen con **una fila por criterio** (puntos de las preguntas
  de ese criterio / máximo × 10; las preguntas sin criterio cuentan para el criterio del examen); las tareas
  y actividades con su `criterio` (o vacío); las prácticas del laboratorio de EEE con criterio vacío. Solo
  filas con nota. El CSV de antes (tabla ancha) sigue como «CSV (tabla)».
* Panel del profesor → **Analítica** (Seguimiento): grupo, asignatura y examen; % de acierto **por criterio**
  y **por pregunta**, ordenados de menor a mayor, con barra de color, nº de alumnos sin la máxima y en blanco,
  y la lista de las **5 preguntas más falladas**. Cuenta la puntuación parcial y, si el profesor cambió a mano
  la puntuación de una pregunta, cuenta la suya. Funciona en móvil (columna de criterio oculta).
* **Iconos**: lo nuevo de las fases 1–3 usa iconos de línea Lucide (`ic()` de `src/ui/iconos.js`, vía
  `src/portal/ico.js`) en lugar de emoji. Se han añadido a `iconos-datos.js` (regenerado con `iconos-gen.mjs`
  y Lucide 1.72.0, la misma versión) los iconos que faltaban: arrow-down, radio, code, upload, table, etc.
  El menú lateral del panel admite ya nombres de icono Lucide.

**Archivos**: `src/lms/analitica.js` (nuevo, funciones puras), `src/portal/aula-panel.js`, `src/portal/panel.js`,
`src/portal/ico.js` (nuevo), `src/portal/aula-json.js`, `aula-banco.js`, `aula-clase.js`, `aula-editor.js`,
`aula-vistas.js`, `examen-ui.js` (iconos), `src/ui/iconos-datos.js`, `iconos-gen.mjs`, `css/plataforma.css`,
`plataforma_test.mjs`, `e2e/plataforma_f3.mjs`, caché `gp3-20261113`.

**Reglas**: no cambian en esta fase.

**Pruebas**: `plataforma_test.mjs` 19/19 · E2E fases 1+2+3: 34/34 · `aula_e2e` con el estado de esta fase:
116/116 (el fallo de la fase 2 —«quitar T.I.Cs»— y un tiempo agotado al importar de Classroom en otra
pasada eran de tiempo con la máquina cargada: con esta fase pasan todas). Regresión completa con el estado
de la fase 2: placa, circ, circ_pins, viv, viv_modelo, aula_modelo, acceso, extra y reglas ✔; `fb_e2e` 59/59.

**Capturas**: `f3_cuaderno_csv.png`, `f3_analitica.png`, `f3_analitica_movil.png`.

**Dudas / pendiente**: el CSV es por grupo (el nº de lista solo identifica dentro de un grupo); si se
quiere uno con todos los grupos de la asignatura habría que añadir la columna grupo (no la he puesto
porque pediste exactamente esas 5 columnas).

---

## Fase 4 · Explicaciones interactivas y pregunta en directo — HECHA

**Qué hay**
* Tipo nuevo **Explicación interactiva** (`explicacion`): diapositivas con título, texto, imagen o **vídeo**
  (YouTube/Vimeo sin cookies o `.mp4` del portal), **preguntas de control** test o V/F con respuesta al
  momento y su explicación (no puntúan como examen), **laboratorio del portal incrustado** (`"lab": "#eee/circuitos"`,
  se abre con `?incrustado=1`, sin la cabecera del portal, y con «Abrir en otra pestaña») y **resumen final**.
  Anterior/Siguiente, puntos de progreso y flechas del teclado; recuerda la diapositiva al recargar.
  Al terminar, «He terminado: entregar» guarda «Aciertos: a/t» y el cuaderno lo pasa a nota con «Poner notas»
  (solo si el profesor quiere). Se importa por JSON y se edita en el editor (campo «contenido (JSON)» con
  botón «Poner el ejemplo»). Formato con ejemplo en `FORMATO_IMPORTAR.md`.
* Mecanismo común para los **motores** de las fases siguientes: `src/lms/motores/` (validación con errores
  en castellano, `registrarMotor`), campo `contenido` en el item, editor JSON genérico y montaje de la vista
  en la página del elemento (`MOTORES_UI` o `window.PORTAL_MOTORES[tipo]` para los laboratorios de `app.js`),
  sin repintar mientras el alumno trabaja.
* **Pregunta en directo** («Trabajo de clase» → «Pregunta en directo»): grupo, pregunta y opciones (o V/F).
  Pantalla grande (botón de pantalla completa) con el gráfico en tiempo real; cerrar/volver a abrir; «Mostrar
  el gráfico a los alumnos». Los alumnos conectados del grupo la ven en una tarjeta flotante en cualquier
  página (móvil y PC), responden y pueden cambiar la respuesta mientras está abierta. **Anónimo**: el
  profesor solo ve el recuento; los alumnos no pueden leer respuestas de nadie.

**Archivos**: `src/lms/motores/{comun,explicacion,index}.js` (nuevos), `src/portal/explicacion-ui.js` (nuevo),
`src/portal/directo.js` (nuevo), `src/portal/aula-vistas.js`, `aula-editor.js`, `aula-json.js`, `aula-clase.js`,
`src/portal/main.js`, `src/lms/biblioteca.js` (tipo nuevo), `css/plataforma.css`, `FORMATO_IMPORTAR.md`,
`firebase/firestore.rules`, `firebase/test/plataforma.test.mjs`, `plataforma_test.mjs`, `e2e/plataforma_f4.mjs`,
caché `gp4-20261113`. (El selector «Tipo» del editor ya no lleva emoji delante.)

**Reglas (cambian, sin desplegar)**: `items` admite `contenido` (mapa) y el tipo `explicacion`; los trabajos
de tipo tarea admiten items `explicacion`; colecciones nuevas `directo` (escribe el profesor; el alumno lee
las de su grupo) y `respDirecto` (el alumno escribe solo la suya, con la pregunta abierta, de su grupo y con
opción válida; solo el profesor lee). Regenerado el `para-pegar` (fuera del repositorio).

**Pruebas**: `plataforma_test.mjs` 22/22 · reglas 93/93 · E2E fases 2+4: 33/33.

**Capturas**: `f4_editor_explicacion.png`, `f4_explicacion_alumno.png`, `f4_explicacion_lab.png`,
`f4_explicacion_resumen.png`, `f4_directo_profesor.png`, `f4_directo_alumno_movil.png`.

**Dudas / pendiente**: las preguntas en directo cerradas se quedan guardadas (solo el recuento); se pueden
borrar con la limpieza de fin de curso más adelante. El laboratorio incrustado usa la misma sesión del alumno.

## Fase 5 · Laboratorio p5.js (CDPC) — HECHA

**Qué hay**
* **CDPC → Laboratorio → «Laboratorio p5.js»** (`#cdpc1/p5`), con la misma estructura que los de EEE (tarjeta en
  la pestaña Laboratorio, portada, retos y modo libre). Editor de código con números de línea (Tab sangra;
  Esc y Tab para salir; Ctrl+Intro ejecuta), **lienzo aislado** (`iframe sandbox="allow-scripts"`, sin acceso
  al portal, a la sesión ni a las cookies) y **consola en castellano**: los errores de JavaScript salen
  traducidos y con el número de línea del código del alumno (p. ej. «Línea 7: «circel» no existe…»), y los
  `console.log` del programa también se ven. Botones Ejecutar, Parar, Comprobar, Pista (de una en una) y
  Código inicial; el código se guarda en el navegador mientras se escribe.
* **Retos en JSON** (`"tipo": "p5"`): enunciado, código inicial, pistas y comprobaciones sobre el **código**
  (contiene / no contiene / regex), sobre **variables** (igual, mín., máx.) y sobre **píxeles** del lienzo
  (color con tolerancia o «distinto de»). Se importan con el importador de la fase 1 y se editan en el
  editor (contenido JSON). Formato y ejemplo en `FORMATO_IMPORTAR.md`.
* **Entregable**: en Trabajo de clase el elemento abre el editor con todos sus retos; «Entregar el código»
  guarda «Aciertos: a/t» (retos superados) y **el código de cada reto** en el trabajo → el profesor lo ve en
  el cuaderno y «Poner notas» lo pasa a nota. Los 2 retos de ejemplo del laboratorio también se pueden
  **asignar como tarea** desde su tarjeta (tarea «actividad» con el enlace al reto; el alumno entrega desde
  el laboratorio). La página común de laboratorios (`src/labs/pagina.js`) servirá para los de TIC (fase 6).
* p5.js 1.11.13 va copiado en `vendor/p5/` (LGPL-2.1, con su licencia), sin CDN.

**Archivos**: `src/lms/motores/p5.js` (nuevo: validar, comprobar, traducir errores), `src/labs/{pagina,p5-ui,p5-lab}.js`
(nuevos), `vendor/p5/` (nuevo), `src/main.js` (ruta `#asig/lab/reto` y `window.PORTAL_MOTORES.p5`), `src/subjects.js`
(laboratorio de cdpc1), `src/asig.js` (icono Lucide en las tarjetas de laboratorio), `src/portal/aula-vistas.js`
(enlaces de reto en tareas «actividad»; los motores se desmontan al cambiar de elemento), `aula-editor.js`,
`lms/biblioteca.js`, `css/plataforma.css`, `FORMATO_IMPORTAR.md`, reglas y pruebas. Caché `gp5-20261113`.

**Reglas (cambian, sin desplegar)**: el tipo `p5` se admite en `items` y en las entregas de tipo tarea.
Regenerado el `para-pegar` (fuera del repositorio).

**Pruebas**: `plataforma_test.mjs` 24/24 · reglas 95/95 · E2E fases 4+5: 35/35.

**Capturas**: `f5_portada.png`, `f5_consola_error.png`, `f5_reto_superado.png`, `f5_alumno_elemento.png`, `f5_alumno_movil.png`.

**Dudas / pendiente**: un bucle infinito (`while (true)`) puede bloquear la pestaña: el lienzo está aislado
pero el navegador puede ejecutarlo en el mismo proceso; «Parar» lo corta solo si el navegador sigue
respondiendo. Los errores que se producen dentro de p5.js (no en el código del alumno) llegan sin detalle
por estar aislados y se explican de forma genérica. Las comprobaciones de píxel se miden medio segundo
después de arrancar (sirven para dibujos fijos, no para animaciones).

## Fase 6 · Laboratorios de TIC I y TIC II — HECHA (mínimo sólido)

**Qué hay** (TIC I → Laboratorio; TIC II tiene los mismos menos Anatomía del PC). Todos se usan como práctica
libre y, desde la tarjeta de cada reto, «Asignar como tarea» (el alumno entrega desde el laboratorio y el
resultado «Aciertos: a/t» llega al cuaderno). Además, cada motor es un **tipo de elemento importable en JSON**
para que el profesorado cree sus propios retos (formatos y ejemplos en `FORMATO_IMPORTAR.md`).
* **Anatomía del PC** (3D): actividad del motor de Actividades 3D con piezas nuevas del kit (`src/kit3d/pc.js`:
  placa base, CPU, disipador, RAM, gráfica, fuente, SSD, HDD, M.2) y dos niveles (reconocer y para qué sirve).
  Sale en Laboratorio y en Actividades de clase; se asigna como cualquier actividad 3D.
* **Representación de la información** (`info`): conversor decimal ↔ binario ↔ hexadecimal ↔ ASCII con los 8
  bits a la vista, y preguntas de conversión y de **tamaño de archivo** (imagen, audio, texto, vídeo) que se
  corrigen solas (1 K = 1024 por defecto, configurable). En una tarea, cada pregunta se comprueba una vez.
* **Ciberseguridad** (`ciber`): bandeja de correos (fiable / phishing, con explicación; enlace visible sin
  ser clicable), **medidor de contraseñas** (nivel, bits aproximados y consejos; la contraseña **no se guarda
  ni se envía**, solo cuenta si se alcanzó el nivel) y **red de una pyme** (diagrama con equipos y riesgos;
  se responde la medida en cada equipo marcado). En una tarea cuenta la primera respuesta.
* **Editor web en vivo** (`web`): HTML + CSS con vista previa **aislada sin scripts** (`sandbox="allow-same-origin"`
  + CSP `script-src 'none'`), retos con comprobaciones de selector/texto, **estilo calculado** (p. ej. color
  rojo valga como `red`, `#f00` o `rgb`) y código. Modo libre.
* **Retos por bloques** (`bloques`): Blockly 11.2.2 (en `vendor/blockly/`, Apache-2.0, se carga solo al abrir)
  con bloques propios en castellano (avanzar, girar, repetir N veces, repetir hasta la meta, si hay camino /
  si no) y un robot en una cuadrícula animada. Niveles en JSON (mapa, bloques disponibles, máximo de bloques).
  El programa se interpreta (no se evalúa JavaScript).
* Página común de laboratorios (fase 5) reutilizada; caja «Entregar» común (`src/labs/comun.js`).
* Iconos: solo Lucide (añadidos al generador: globe, blocks, binary, shield…, fish, router, cctv, cloud, bot…).

**Archivos**: `src/lms/motores/{web,info,ciber,bloques}.js`, `src/labs/{comun,web-ui,info-ui,ciber-ui,bloques-ui,tic-labs}.js`,
`src/kit3d/pc.js`, `src/act/{registro,juego}.js` (actividad y escena «pc»), `src/subjects.js`, `src/asig.js`
(tarjetas con `enlace`), `src/main.js`, `src/ui/iconos-datos.js` + `iconos-gen.mjs`, `lms/biblioteca.js`,
`aula-editor.js`, `css/plataforma.css`, `vendor/blockly/`, `FORMATO_IMPORTAR.md`, reglas y pruebas. Caché `gp6-20261113`.
`e2e/aula_e2e.mjs`: la comprobación «Laboratorio sin laboratorios → Próximamente» pasa de TIC I (que ya
tiene) a Proyectos II.

**Reglas (cambian, sin desplegar)**: tipos `web`, `info`, `ciber` y `bloques` en `items` y en las entregas de
tipo tarea. Regenerado el `para-pegar`.

**Pruebas**: `plataforma_test.mjs` 25/25 · reglas 97/97 · E2E fases 5+6: 39/39.

**Capturas**: `f6_laboratorios_tic`, `f6_anatomia_pc`, `f6_informacion`, `f6_phishing`, `f6_contrasena`, `f6_red`,
`f6_red_movil`, `f6_web`, `f6_bloques`, `f6_alumno_info`.

**Dudas / pendiente**: Blockly no es del todo accesible con teclado/lector (es la librería pedida); el resto
sí. El «tamaño de vídeo» es sin compresión (cálculo teórico). La Anatomía del PC es un ejemplo mínimo de 8
retos; para más niveles hay que añadirlos en `registro.js` (las actividades 3D aún no se importan en JSON).

## Fase 7 · EEE: polímetro y «Encuentra la avería» — HECHA (mínimo sólido)

**Polímetro de Circuitos** (ya tenía V, A, Ω, bornes VΩmA/10A, fusible y avisos): nueva posición de la rueda
**continuidad «·)))»** (también en el modelo 3D y la pantalla): pita (con el zumbador del laboratorio) por
debajo de 50 Ω y marca OL por encima; aviso «quita la alimentación» si se usa con tensión (como en Ω), y en ese
caso no pita.

**«Encuentra la avería»** (tipo de elemento `averia`, importable en JSON): un montaje exportado de Circuitos con
una avería escondida en un componente (`abierto`, `corto`, `valor` en resistencias) o un cable (`cable`). El
simulador la aplica sin cambiar el montaje que se ve (`model.averia` en `netlist.js`: el elemento abierto no
tiene elementos eléctricos, el corto es 0,01 Ω entre patas, el cable cortado no une sus extremos). En la
página del elemento: enunciado, «Abrir el circuito» y estado de la entrega (el profesor ve la solución).
En Circuitos (`#eee/circuitos/averia-<id>`) hay una pestaña «Avería»: pasos, pistas una a una, elemento
señalado con un clic, tipo de avería y «Entregar diagnóstico». El texto entregado es
«Diagnóstico: R1 · … Aciertos: a/2» (elemento y tipo), que «Poner notas» del cuaderno pasa a nota.
En la tarea no se muestra si ha acertado. Ejemplo para practicar (con corrección inmediata) en la portada
de Circuitos: `#eee/circuitos/averia-ejemplo`.

**Archivos**: `src/circ/{parts,engine,netlist,models3d,lab}.js`, `src/lms/motores/averia.js`, `src/labs/averia-ui.js`,
`src/main.js` (ruta y motor), `src/portal/{aula-vistas,main}.js` (`P.aula.elemento(id)`), `lms/biblioteca.js`,
`aula-editor.js`, `css/circuitos.css`, `css/plataforma.css`, `FORMATO_IMPORTAR.md`. Caché `gp7-20261113`.

**Reglas (cambian, sin desplegar)**: tipo `averia` en `items` y en las entregas de tipo tarea. Regenerado el `para-pegar`.

**Pruebas**: `plataforma_test.mjs` 26/26 (simulación con cada tipo de avería y continuidad) · reglas 99/99 ·
E2E fase 7: 19/19.

**Capturas**: `f7_averia_medir`, `f7_continuidad`, `f7_averia_encontrada`, `f7_alumno_elemento`,
`f7_alumno_entregado`, `f7_alumno_movil`.

**Dudas / pendiente**: como en las fases 5 y 6, el contenido del elemento (también la avería) lo puede leer
el alumno con las herramientas del navegador; para exámenes de verdad habría que ocultarlo en el servidor
(Cloud Functions), fuera del alcance. Una avería por montaje.

## Fase 8 · PIAC, recuperación, calendario, avisos programados, duplicar, rúbrica y voz — HECHA (mínimo sólido)

* **Proyecto en equipo (PIAC)** (tipo `piac`, importable en JSON): en la página del elemento el alumno ve su
  equipo y tiene tres pestañas: **Tablero** (pendiente / en curso / hecho; cada tarea con responsable por nº de
  lista y fecha, se mueve con botones accesibles), **Diario** del equipo (entradas con fecha y nº, no se editan)
  y **Evaluación** (autoevaluación y coevaluación de cada compañero con la rúbrica, 1–4 por criterio).
  El profesor configura los equipos («Nombre: 1, 4, 7» por grupo) y ve, por equipo, las tareas por estado,
  el tablero y el diario, y una tabla por alumno con autoevaluación, media de coevaluación y la autoría según
  el equipo. Colecciones nuevas `piac` y `piacEval` (solo nº de lista; nada de nombres).
* **Recuperación** (tipo `recuperacion`): tarea que solo ven los nº de lista elegidos (`para` + `visibleAl`);
  el resto del grupo no la recibe ni la abre con el enlace. Se publica, programa, entrega y califica como una tarea.
* **Calendario del alumno** (`#calendario`, enlace «Calendario» en la barra): próximos 15 días y mes con las
  fechas de entrega y exámenes de todas sus asignaturas y su estado (entregado, nota…). El profesor ve el del curso.
* **Avisos programados en el tablón**: «Programar para» fecha y hora (campo `pub`, ya admitido por las reglas);
  el alumno no lo ve hasta esa hora; en «Tus anuncios» sale como «Programado».
* **Duplicar en otro grupo o curso**: menú ⋮ del elemento → elige curso escolar y grupos; la copia queda en borrador.
* **Plantilla de rúbrica** de 5 criterios ponderados con uno de **autoría** (`src/lms/rubrica.js`): botón en el
  editor (campo Rúbrica) y rúbrica por defecto del PIAC.
* **Leer en voz alta**: botón en la página de cada elemento con instrucciones (voz del navegador en castellano;
  se para al cambiar de página).

**Archivos**: `src/lms/{rubrica,modelo,biblioteca}.js`, `src/lms/motores/piac.js`, `src/portal/{piac-ui,aula-datos,
aula-vistas,aula-editor,aula-clase,main}.js`, `src/main.js` (ruta `#calendario`), `css/plataforma.css`,
`FORMATO_IMPORTAR.md`. Caché `gp8-20261113`.

**Reglas (cambian, sin desplegar)**: `items` admite `para` y `visibleAl` y los tipos `recuperacion` y `piac`;
el alumno lee un item si su grupo está en `visible` **o** su `grupo_nº` está en `visibleAl`; una recuperación
publicada tiene `visible` vacío y `visibleAl` con alumnos. Las entregas (`trabajos`) aceptan `recuperacion` y
comprueban `visibleAl`. Nuevas `piac/{id}` (solo miembros del equipo: leen, crean, mueven y borran tareas; el
diario solo se crea) y `piacEval/{item_grupo_de_a}` (cada alumno solo escribe y lee lo que puntúa él, y solo a
miembros de su equipo). Regenerado el `para-pegar`.

**Pruebas**: `plataforma_test.mjs` 27/27 · reglas 105/105 · E2E fase 8: 19/19.

**Capturas**: `f8_piac_tablero`, `f8_piac_evaluacion`, `f8_piac_profesor`, `f8_recuperacion_alumno`,
`f8_calendario`, `f8_calendario_movil`, `f8_aviso_programado`, `f8_duplicar`.

**Dudas / pendiente**: los avisos e items programados llegan al navegador del alumno antes de la hora (se
ocultan en la interfaz; las reglas no comparan con la hora) — igual que ya pasaba con los items programados.
La auto/coevaluación no pasa sola al cuaderno: el profesor la ve en el resumen y pone la nota del proyecto.
La lectura en voz alta depende de las voces instaladas en el dispositivo.

## Regresión final (13/11/2026)

Todas las suites, una vez, sobre la rama: `placa`, `circ`, `circ_pins`, `viv`, `viv_modelo`, `aula_modelo`, resto de
`*_test.mjs`: OK · `acceso` 28/28 · reglas 105/105 · `fb_e2e` 59/59 · `aula_e2e` 116/116 · plataforma (fases 1–8) 121/121.
Ajustes de pruebas (no de la web): `acceso_test` cuenta 14 tarjetas en Circuitos (se añade «Encuentra la avería»);
`aula_e2e` espera hasta 10 s a que «Quitar del curso» llegue al servidor (antes leía demasiado pronto);
`plataforma_f7` espera la lectura de continuidad en vez de un tiempo fijo.

## Para pasar la rama a `main`

1. **Reglas de Firestore primero**: pegar `/workspace/portal-acceso/firestore.rules.para-pegar.txt` (ya lleva el
   correo del profesor) en Firebase → Firestore → Reglas → Publicar. Sin ellas fallan los tipos nuevos, la
   recuperación, el PIAC y las entregas de los laboratorios. Las reglas nuevas aceptan todo lo que ya había.
2. Revisar el PR `grok-plataforma` → `main` y fusionarlo (la web es estática: no hay que compilar nada en el
   servidor; `js/app.js` y `js/portal-fb.js` ya están generados y la caché está en `gp8-20261113`).
3. Después, en el portal: abrir una vez como profesor; probar un «Importar JSON» y un laboratorio.
No hace falta crear índices compuestos: las consultas nuevas (`piac`, `piacEval`, `visibleAl`) usan solo igualdades
o `array-contains`.

## Fase 9 · Entregas completas (13/11/2026)

**Hecho**
- Estados del trabajo: `borrador` → `entregado` → `devuelto` (para rehacer) → calificado (sale de la nota;
  el alumno lo ve cuando está publicada). Los trabajos antiguos sin estado cuentan como `entregado`.
- Página de la tarea (alumno, `src/portal/entrega-ui.js`): **Guardar** (sin entregar), **Entregar**,
  **Anular la entrega** (mientras no tenga nota), **Volver a entregar** si se devuelve, **Imprimir / PDF** (hoja
  limpia con título, grupo y nº, estado, fecha, nota, texto y enlaces; «Guardar como PDF» del navegador).
- Guardado automático a los 3 s de dejar de escribir, cada 15 s si hay cambios, al cambiar de página, al ocultar la
  pestaña y al cerrar. Indicador «Guardado hh:mm» / «Cambios sin guardar» / «Sin conexión…». Copia en
  `localStorage` (`borr:<trabajo>`): si se corta la red no se pierde nada y se envía al volver (gana la más reciente).
- Historial: cada entrega guarda una versión en `versiones/{trabajo}_v{n mod 5}` (las 5 últimas). Solo la lee el
  profesor (cuaderno → casilla → «Versiones entregadas»).
- Profesor (cuaderno): casillas nuevas «borrador» (lápiz) y «devuelto» (flecha); detalle con estado y nº de entrega,
  **Devolver para corregir** con comentario y **comentarios privados** (`trabajos/{id}/comentarios`), en los dos
  sentidos. «Poner notas» ignora los borradores.
- **Mis trabajos** (`#mis-trabajos`, enlace en la barra del alumno): todos sus trabajos de todas las asignaturas,
  con estado, fecha y nota publicada, filtros Todos / Pendientes / Entregados / Calificados; también las prácticas
  de los laboratorios.
- **Fallo corregido · entregas de los laboratorios**: las nuevas se guardan como `entregas/{grupo}_{nº}_{práctica}`
  con `al = grupo_nº`, así que el alumno las ve desde cualquier ordenador con su nº y su PIN. Las antiguas
  (`{uid}_{grupo}_{nº}_{práctica}`) se siguen leyendo.
- **Migración (sin pérdidas, idempotente)**: al abrir el panel del profesor (y con el botón «Migrar N entregas
  antiguas» de «Entregas del laboratorio») cada entrega antigua se **copia** al ID nuevo con su fecha, nota y
  comentario y `migradaDe` = ID original. **No se borra nada.** Si un mismo nº tiene varias antiguas de la misma
  práctica (varios ordenadores), se copia la que tiene nota; si ninguna, la más reciente; las demás siguen ahí. El
  panel oculta las antiguas que ya tienen copia. Una práctica con nota (aunque sea antigua) no se puede reentregar.

**Reglas de Firestore** (`firebase/firestore.rules`)
- `trabajos`: el alumno puede escribir `estado` `borrador` o `entregado` (+ `guardado`, `entregadoEn`, `nEntregas`;
  y ya preparados `doc`, `registro`, `datos` para la fase 11); se puede cambiar mientras no haya nota, o si el profesor
  lo ha devuelto (y luego en borrador); no puede poner `devuelto` ni tocar `devFecha`. El profesor solo puede
  cambiar `estado: 'devuelto'` + `devFecha` de una tarea entregada.
- `trabajos/{id}/comentarios/{cid}` (nuevo): profesor y alumno dueño leen y escriben (autor fijo), nadie más.
- `versiones/{id}` (nuevo): el alumno crea/actualiza solo las suyas en el hueco correcto; solo el profesor lee.
- `entregas`: lectura también por `al == grupo_nº` de la sesión; creación con ID nuevo; el ID antiguo se sigue
  aceptando (clientes con la caché vieja); el profesor puede crear las copias de migración.
- Pruebas en el emulador (6 nuevas, con entregas antiguas sembradas): 111/111.

**Pruebas**: `plataforma_test.mjs` 30/30 · reglas 111/111 · E2E fase 9: 23/23 (incluye corte de red con
`setOffline`, otro ordenador con otro uid y migración). `aula_e2e` y `plataforma_f8` adaptados al formulario nuevo.

**Capturas**: `f9_borrador_guardado`, `f9_entregado`, `f9_profesor_devolver`, `f9_alumno_devuelto`,
`f9_mis_trabajos`, `f9_mis_trabajos_otro_ordenador`.

**A tener en cuenta**: con el portal sin red, la entrega queda en cola en Firestore y la página avisa («no cierres
la página»); el borrador sí queda en el ordenador. Tras reentregar algo que tenía nota (devuelto → entregado) queda
bloqueado hasta que el profesor ponga la nota nueva o lo vuelva a devolver.

## Fase 10 · Vista de corrección (13/11/2026)

**Hecho** (`src/portal/correccion-ui.js`)
- Cuaderno → botón **Corregir** en cada columna (y «Vista de corrección» en el detalle de una casilla): un alumno
  cada vez, el trabajo a la izquierda (estado, fecha, nº de entrega, texto o documento, enlaces, resultado de la
  actividad y, cuando lo haya, el registro de edición) y la rúbrica a la derecha.
- Rúbrica **por niveles**: Insuficiente · Suficiente · Bien · Excelente (= puntos · 1/4, 2/4, 3/4, 4/4), con los
  descriptores de cada nivel si el elemento los trae; clic para marcar y otra vez para quitar. La nota se calcula
  sola y se puede cambiar a mano.
- Criterio **«lo evalúa el profesor en clase»** (`"clase": true` / «Criterio | clase»): aparece en la rúbrica (y al
  alumno como «Se evalúa en clase») pero no puntúa aquí.
- **Anterior / Siguiente** (y Alt+← / Alt+→), con «Solo con entrega»; «Guardar y siguiente».
- **Comentarios rápidos** reutilizables (clic para añadirlos; «Guardar el comentario como rápido»; quitar con ×).
  Se guardan en `config/comentarios` (solo el profesor), así que están en cualquier ordenador.
- Las notas se guardan **en borrador** (sin publicar) y se publican a mano: una («Guardar y publicar») o todas las
  del grupo a la vez («Publicar N»). También «Devolver para corregir» con el comentario.

**Reglas**: nuevo `config/comentarios` (solo profesor, `{ lista }` ≤ 60). Pruebas: 113/113.
**Formato JSON**: `rubrica[].niveles` (4 textos) y `rubrica[].clase` en `FORMATO_IMPORTAR.md`.
**Pruebas**: `plataforma_test.mjs` 31/31 · reglas 113/113 · E2E fase 10: 14/14 · `fb_e2e` 59/59 y `aula_e2e`
116/116 tras la fase 9.
**Capturas**: `f10_correccion`, `f10_alumno_nota`.

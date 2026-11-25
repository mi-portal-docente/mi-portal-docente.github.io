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

## Fase 11 · Editor de documentos (13/11/2026)

**Hecho** (`src/portal/doc-editor.js`, `src/lms/doc-html.js`, `src/lms/docx.js`, motor `documento`)
- Nuevo tipo de tarea **Documento**: editor con títulos (H2/H3), negrita, cursiva, subrayado, listas, tablas,
  enlaces, imágenes y bloques de código; deshacer/rehacer; contador de palabras; guardado automático (el de la
  fase 9: borrador, versiones, entregar/anular, comentarios).
- **Plantilla del profesor** (en el editor del elemento) que el alumno encuentra al empezar; mínimo/máximo de
  palabras (aviso antes de entregar) y nº de imágenes permitidas (0–3).
- Todo el HTML pasa por una **lista blanca** (al pegar, al guardar, al mostrar, al imprimir y al corregir): fuera
  scripts, `on*`, `javascript:`, estilos y etiquetas desconocidas.
- **Imágenes**: se comprimen en el navegador a JPEG ≤ 300 KB, máximo 3 por trabajo, en la subcolección
  `trabajos/{id}/imagenes/img1..img3` (sin Storage). Para archivos grandes, enlace.
- **PDF** con Imprimir (formato e imágenes) y **.docx**: exportador propio (ZIP + WordprocessingML) en
  `src/lms/docx.js`, **sin librería nueva** (la librería `docx` pesa >1 MB); comprobado abriéndolo con LibreOffice.
  Lo descargan el alumno y el profesor (vista de corrección).
- **Registro de edición** solo para el profesor (`registros/{id}`): minutos editando y pegados grandes (≥ 200
  caracteres, con hora y longitud). Es solo informativo: no penaliza nada.

**Reglas**: nuevas `trabajos/{id}/imagenes/{img}` (img1–img3, data:image ≤ ~400 KB, dueño o profesor) y
`registros/{id}` (el alumno crea/actualiza el suyo, solo el profesor lo lee). `documento` añadido a los tipos.
**Formato JSON**: sección «Documento» en `FORMATO_IMPORTAR.md` (`plantilla`, `palabrasMin`, `palabrasMax`, `imagenes`).
**Pruebas**: `plataforma_test.mjs` 34/34 · reglas 116/116 · E2E fase 11: 17/17.
**Capturas**: `f11_plantilla_profesor`, `f11_editor_alumno`, `f11_correccion_documento`.

## Fase 12 · Nuevos tipos de pregunta y actividad interactiva (13/11/2026)

**Hecho**
- **Clasificar en grupos** (`clasificar`): el alumno arrastra cada elemento a su grupo; también con el desplegable de
  cada elemento (teclado, lector de pantalla y móvil). Puntuación parcial.
- **Completar tabla** (`tabla`): celdas `[[respuesta|otra]]` en una tabla; números con coma o punto. Parcial.
- **Respuesta abierta** (`abierta`) corta o larga (larga = editor con negrita, cursiva y listas, pegado limpio,
  contador de palabras). Con **rúbrica** opcional por pregunta: en el cuaderno, botones 1–4 por criterio
  (Insuficiente → Excelente) que suman los puntos de la pregunta; el detalle se guarda en la nota (`qid_rN`).
  El autocorrector la deja a 0 y marcada «revisar».
- Editor del profesor: botones «Clasificar», «Tabla», «Respuesta abierta» con campos de texto sencillos.
- **Actividad interactiva** (`"tipo": "interactiva"`): preguntas de examen sin tiempo límite y con varios intentos
  (0 = sin límite). «Comprobar» marca cada pregunta (bien / a medias / mal) y enseña la solución de lo que falla
  (si `soluciones` no es `false`); «Intentar de nuevo» baraja de nuevo. Se guarda el **mejor** intento
  («Aciertos: a/t» + `datos`), y en el cuaderno «Poner notas» lo pasa a nota. Es práctica: las soluciones van con la
  actividad (para evaluar en serio, el examen). Se guarda separada en preguntas + claves (Firestore no admite
  listas dentro de listas); el editor la enseña con las soluciones dentro de cada pregunta.
- «Aciertos: a/t» admite decimales (3,5/5).

**Reglas**: `interactiva` añadido a los tipos de elemento y de trabajo (sin reglas nuevas). Pruebas: 117/117.
**Formato JSON**: secciones «Preguntas nuevas…» y «Actividad interactiva» en `FORMATO_IMPORTAR.md`.
**Pruebas**: `plataforma_test.mjs` 38/38 · reglas 117/117 · E2E fase 12: 21/21 (fase 11: 17/17).
**Capturas**: `f12_editor_preguntas`, `f12_alumno_examen`, `f12_cuaderno_rubrica`, `f12_interactiva_intento`.

## Fase 13 · Hoja de cálculo, visor de PDF y visor 3D (13/11/2026)

**Hecho**
- **Visor de PDF** dentro del portal (pdf.js 3.11.174 en `vendor/pdfjs/`, Apache-2.0): pantalla completa, páginas que
  se pintan al verse, ir a página, zoom y «ajustar al ancho», teclado (Esc, flechas, + / −), descargar y abrir aparte;
  en móvil ocupa toda la pantalla. Los enlaces a PDF del propio sitio (materiales) se abren en el visor.
  `isEvalSupported:false`.
- **Hoja de cálculo** (`"tipo": "hoja"`): barra de fórmulas, fórmulas en castellano (SUMA, PROMEDIO, SI, CONTAR.SI,
  BUSCARV, MIN, MAX, CONTAR, REDONDEAR, Y, O; `$A$1`), errores tipo hoja (#DIV/0!, #N/A, #CICLO!…), teclado,
  gráfico SVG (barras / líneas), tabla dinámica sencilla, CSV. Se entrega como un trabajo (guardado automático,
  versiones, imprimir). **Retos** con comprobación de celdas en el JSON (valor y función obligatoria) →
  «Aciertos: a/t» → «Poner notas». El profesor la ve en la corrección con valores, gráfico y tabla dinámica.
- **Visor 3D** (three.js, ya incluido: STLLoader, GLTFLoader, OrbitControls, MIT): STL / GLB por enlace o un STL de
  ≤ 600 KB subido por el alumno (`trabajos/{id}/modelos/m1` en base64 + resumen `modelo` en el trabajo). Girar,
  zoom, medidas, rejilla. El profesor lo abre al corregir. Una entrega puede ser solo el modelo.

**Reglas** (en `fuente/tools/firebase/firestore.rules`, sin desplegar):
- `hoja` añadido a los tipos de elemento y de trabajo.
- Trabajo: campo opcional `modelo` (mapa solo con `nombre` y `bytes`).
- Nueva subcolección `trabajos/{id}/modelos/{m}`: solo `m1`; `data` base64 ≤ 820 000 caracteres, `nombre` ≤ 120,
  `bytes` ≤ 614 400, `fecha` = hora del servidor; escribe solo el alumno dueño; leen el dueño y el profesor; borran
  el dueño y el profesor. Pruebas: 119/119.

**Librerías**: pdf.js 3.11.174 (Apache-2.0, anotada en LEEME.txt). three.js ya estaba (MIT).
**Formato JSON**: secciones «Hoja de cálculo» y «Modelo 3D en una entrega» en `FORMATO_IMPORTAR.md`.
**Pruebas**: `plataforma_test.mjs` 40/40 · reglas 119/119 · E2E fase 13: 17/17.
**Capturas**: `f13_hoja_alumno`, `f13_hoja_correccion`, `f13_visor_pdf`, `f13_visor_3d`.

## Fase 14 · Copia y limpieza del curso escolar y rendimiento (13/11/2026)

**Hecho**
- **«Exportar todo»** (Ajustes y limpieza): JSON de un curso escolar con elementos, temas, anuncios, exámenes y claves,
  trabajos con sus comentarios, imágenes y modelos 3D, versiones, notas, registros, incidencias, PIAC y directo.
  Lecturas justas: una consulta por colección (las ligadas a elementos, con `in` en trozos de 30), los comentarios
  con una sola consulta de grupo y las imágenes / modelos solo de los trabajos que los usan.
- **«Limpiar curso escolar…»**: descarga antes la copia, enseña cuántos documentos va a borrar y pide **dos
  confirmaciones** (aceptar y escribir el nombre del curso). Borra los datos del alumnado (también las subcolecciones,
  que el antiguo «Borrar trabajos y notas» dejaba huérfanas) y conserva el contenido salvo que se marque la casilla.
  Sustituye al botón antiguo.
- **Rendimiento con 100 alumnos**: el cuaderno escucha solo los trabajos de la asignatura elegida (antes, todos los del
  grupo, que pesan por los documentos); el panel deja de escuchar (sesiones, accesos, entregas…) si la pestaña está
  oculta más de 2 minutos y se reanuda al volver (cada latido de 100 alumnos era una lectura por minuto). Los
  elementos del profesor ya se escuchaban solo del curso elegido.

**Reglas** (sin desplegar): lectura de los comentarios con consulta de grupo `/{ruta=**}/comentarios/{cid}` solo
para el profesor (que ya podía leer cada uno). Pruebas: 120/120.
**Librerías**: ninguna nueva.
**Formato JSON**: sección «Copia de un curso escolar» en `FORMATO_IMPORTAR.md`.
**Pruebas**: `plataforma_test.mjs` 41/41 · reglas 120/120 · E2E fase 14: 7/7 (fases 9–14 seguidas: ver abajo).
**Capturas**: `f14_ajustes_copia`, `f14_limpiar_hecho`.

## Fusión con main (diseño cristal, cri3) · 13/11/2026

- `origin/main` (c67fccd: cristal en todo el portal, foto de aula, barra superior más alta y navegación fija) fusionada
  en grok-plataforma (main **no** se ha tocado). Se conservan las dos cosas: el bloque «Cristal» al final de
  `css/plataforma.css` (después de los bloques de las fases) y todas las reglas y estilos de la plataforma.
- Navegación: «Calendario» siempre visible (fija, como en main) y «Mis trabajos» para el alumno.
- Los componentes nuevos (hoja de cálculo, visor PDF / 3D, modelo 3D) usan los tokens de cristal de `ios.css`
  (`--glass`, `--glass-fuerte`, `--glass-borde`, `--glass-osc`, `--blur`, `--sh1`).
- Segunda fusión: main dac3d77 (fondo de malla en CSS, sin foto de aula: `aula.webp` eliminada). Caché final:
  `cri5-gp14-20261113` (por encima de cri4).

## Resumen de las fases 9–14

| Fase | Commit | Estado |
|---|---|---|
| 9 · Entregas completas | 6e5e1c3 | hecha |
| 10 · Vista de corrección | 681ec76 | hecha |
| 11 · Editor de documentos | 4fbf4b7 | hecha |
| 12 · Más tipos de actividad | e686081 | hecha |
| 13 · Hoja de cálculo, PDF, 3D | f012852 | hecha |
| 14 · Copia, limpieza y rendimiento | a468571 | hecha |

Reglas para pegar (sin desplegar): `/workspace/portal-acceso/firestore.rules.para-pegar.txt` (fuera del repositorio).

## Estado final (13/11/2026)

- Rama `grok-plataforma` subida; main sin tocar. Fases 9–14 hechas; nada pendiente de las fases pedidas.
- Arreglos de la regresión: la caja de entrega de los laboratorios TIC sin «entregar» ahora tiene `actualizar()`
  (error de consola «p.actualizar is not a function»); el ejemplo de la copia del curso va como `text` (no es un
  formato importable); E2E fase 7 espera a la lectura del polímetro (con el cristal la simulación tarda más en headless).
- Pruebas: `plataforma_test.mjs` 41/41 · reglas 120/120 · E2E plataforma 1–14 y fb_e2e en verde (las que fallan
  de forma intermitente por tiempos en headless se han repetido solas: ver el informe final).
- Límites conocidos: el STL subido es de 600 KB como máximo (para más, enlace); la hoja tiene 100 × 26 celdas; la
  actividad interactiva lleva las soluciones en el navegador (es práctica, no examen); el cristal (backdrop-filter)
  pesa más en ordenadores lentos y en headless.

## Realismo 3D · todos los laboratorios al nivel del ESP32 (rama grok-3d, 13/11/2026)

Referencia: la placa ESP32 (`src/scene.js`): luz de estudio suave, sombras de contacto, cámara con inercia.
**Común**: `kit3d/escena.js` — `estudio()` (hemisférica + clave con sombra suave + relleno + contraluz + suelo de
sombra, entorno RoomEnvironment), `camaraSuave()` (inercia 0,12, zoom hacia el cursor, paneo en pantalla) y `volar()`
(transición suave de cámara solo desde los botones/teclas; las pruebas siguen colocando la cámara al instante).
Calidad baja (Chromebook / ≤ 4 núcleos / ≤ 4 GB o `kit3d:calidad=baja`): menos segmentos, sin transmisión en el LED,
sombras solo donde hacen falta.

**Circuitos** (`circ/detalle.js`, `models3d.js`): resistencia en hueso de perro con bandas que siguen el perfil, LED
de 5 mm con brida, yunque, poste y hilo; TO-92 con cara plana rotulada; relé, condensador con funda y respiradero,
pila 9 V con broches, portapilas AA con muelles, polímetro con funda, rueda estriada, anillo de escalas y bornes de
4 mm; puntas con guarda; Dupont con enganche, cocodrilo con mordazas dentadas y funda, banana. Protoboard con canal
central real. Patas y bornes en las mismas posiciones (52/52 en `circ_pins_test`).
**Vivienda** (`viv/modelos3d.js`, `lab.js`…): aparamenta con perfil DIN (palanca estriada, ventana del rótulo, pozos de
tornillo, pestaña de carril), carril DIN de sombrero, fichas de palanca / inserción / regleta de tornillo, cajas con
nervios y tornillos de tapa, bornes con cabeza PZ; símbolos dibujados (campana, flechas, cruce, reloj, tierra) en vez
de emojis. `viv_test` más estable: comprobaciones con reintento hasta 6 s y clics que esperan al botón.
**Actividades 3D**: el polímetro del kit (maletín y taller) es el modelo detallado de Circuitos escalado a cm.
**Anatomía del PC** (`kit3d/pc.js`): placa ATX con serigrafía y pistas, zócalo LGA, VRM, DIMM, PCIe reforzadas, SATA,
pila, cabezales; CPU con IHS; RAM con disipador y muesca; gráfica con radiador, heatpipes y ventiladores de aspas
curvas; fuente con rejilla, IEC, etiqueta y haz de cables; SSD, HDD y M.2. Las piezas repetidas que comparten
material se fusionan (una malla por material) para que el banco siga ligero.
**Librerías / modelos**: ninguno nuevo (todo procedural). Caché: `r3d-20261113`.
**Capturas** (fuente/capturas, ignoradas por git): `real3d_antes_*` / `real3d_despues_*` (circ_*, viv_*, act_*, pc_*).
**Nota de pruebas**: `viv_test`, `circ_test` y los E2E usan `PORTAL_BASE` (por defecto :8765). Si otro árbol ya sirve
:8765, lanza un servidor propio y pasa `PORTAL_BASE=http://127.0.0.1:<puerto>/index.html`. `fb_e2e` y `aula_e2e` aceptan
ahora `E2E_FS_PORT` / `E2E_AUTH_PORT` (como `plataforma_e2e`): la inestabilidad de `aula_e2e` («.ac-fb» que no
llegaba) venía de compartir los emuladores 8080/9099 con otro árbol que borraba los datos a la vez. `pantallaDe()` de
las actividades ya no devuelve un punto tapado por una etiqueta HTML (busca en una rejilla sobre la pieza).
`circ_test`: la portada tiene 12 prácticas + 2 tarjetas libres (modo libre y avería); la prueba esperaba 13.

## Realismo 3D · fase 2 (13/11/2026, rama grok-3d)
- Vivienda: base Schuko con fondo rotulado (16 A 250 V~), obturadores, alvéolos y clips curvos de tierra; teclas basculantes con lomo; rótulo de características en el lateral del mecanismo; Wago 221 con palanca de perfil real (bisagra, pestaña estriada) y ranura de prueba delante; cables del tablero con el rotulado H07V-K continuo (aislTex compartido) y puntas de cobre con hebras retorcidas.
- Vivienda real (casa3d + nuevo viv/casaDeco.js): sol con sombras, suelos con textura (tarima, gres, baldosa), rodapiés, muebles modelados (cama, sofá, mesa con sillas, bañera, lavabo con espejo, inodoro, cocina con encimera, fregadero, placa y frigorífico), puerta con marco; mecanismos y bases como placas reales orientadas a su pared (pegarPared), plafón con portalámparas y bombilla, cuadro empotrado con ventana y aparamenta DIN, tubo corrugado con estrías.
- Actividades: polímetro compartido en kit3d/polimetro.js (Circuitos y kit); rótulo «POLÍMETRO DIGITAL» ya no queda tapado por la pantalla; clavijas banana con funda en el multímetro del kit; hebras de cobre en hélice (paso 16 mm); rollos de cable con espiras (surcos, vueltas sueltas, film).
- Anatomía del PC: fundas trenzadas con termorretráctil y conectores reales (24 pines, EPS 8, PCIe y SATA con cavidades, pestaña y hilos de colores), aspas combadas y suaves, palanca del zócalo visible (leva, codo, mango y gancho), CPU mostrada ×1,6.

## Arreglos (15/11/2026, rama grok-arreglos, publicados uno a uno en main)
### 1 · Avance de las prácticas guiadas de Circuitos por usuario
- El avance (`done:`), los montajes guardados (`auto:`, `save:`) y las respuestas de avería (`avr:`) se guardan con el ámbito de quien ha entrado: profesor («p») o alumno (huella corta de grupo + nº; no se guarda el código en claro). Las preferencias (`pref:`) siguen siendo del navegador.
- Migración: lo que había sin ámbito se lo queda una sola vez la primera identidad que abre el laboratorio en ese navegador y después se borra (no pasa a otros). No se pisa nada que ya exista.
- Si cambia la sesión con el laboratorio abierto, se recarga el montaje de la nueva identidad y no se guarda el de la anterior en su espacio.
- Archivos: src/circ/almacen.js (nuevo), src/circ/lab.js, src/portal/main.js (`PORTAL.ambito()`), circ_almacen_test.mjs (nuevo, 9 pruebas), circ_test.mjs (espera más antes de recargar).
- Pruebas: circ_almacen_test 9/9; circ_test 41/41 con servidor http (con file:// la prueba de recarga falla a veces también en main: Chrome no siempre conserva localStorage de file:// al recargar).
- Probar a mano: entrar como profesor, avanzar una práctica; salir y entrar como alumno en el mismo navegador: la práctica aparece sin empezar. Dos alumnos distintos: cada uno ve solo lo suyo.
- Sin cambios en reglas de Firestore.

### 2 · Barra de la asignatura encima de laboratorios y simuladores
- Nuevo `#asigbar` (src/main.js `mostrarBarraAsig`): al abrir Circuitos, Vivienda, ESP32, una actividad 3D o un laboratorio ligero desde una asignatura, se queda arriba la barra con la asignatura y sus pestañas (Trabajo de clase, Tablón, Laboratorio, Actividades…); el simulador empieza debajo (`--asigbar-h`). En el móvil las pestañas pasan a una segunda fila desplazable.
- El encuadre inicial del montaje en Circuitos se aparta un poco de la barra de herramientas.
- Archivos: src/main.js, src/circ/lab.js, css/ios.css.
- Pruebas: circ_test 41/41 (http); viv_test 77/78 (la última solo por el tiempo máximo de la prueba).
- Probar a mano: abrir cada simulador desde la asignatura (profesor y alumno, ordenador y móvil) y cambiar de pestaña desde la barra.

### 3 · Menú «Archivo» de los simuladores
- La barra del laboratorio queda por encima del visor 3D y de las migas; el desplegable es opaco, con desplazamiento si no cabe. En el móvil la barra ocupa dos filas (antes las migas tapaban «Archivo») y el menú se abre a todo el ancho.
- Archivos: css/ios.css (Circuitos y Vivienda).
- Comprobado con capturas (ordenador 1440×900 y móvil 390×844): el menú se ve entero y sus botones reciben el clic.
- Probar a mano: abrir «Archivo» en Circuitos y Vivienda en el móvil y en el ordenador, también en tema oscuro.

### 4 · El profesor desbloquea las prácticas guiadas una a una (por grupo)
- Panel del profesor → Grupos → botón «Prácticas guiadas» en cada grupo con EEE: casilla «Las desbloqueo yo una a una», casillas por práctica y botón «Desbloquear la siguiente». Se guarda al momento.
- Se guarda como un elemento más de la lista `apartados` del grupo y de su código (`guiadas:c1,c2,…`), que los alumnos ya reciben en directo: **no cambian las reglas de Firestore**. Sin ese elemento (grupos de antes) todo sigue abierto. Editar el grupo conserva el desbloqueo.
- Alumno: las bloqueadas salen con candado y no se pueden abrir (ni con el enlace directo: vuelve a la portada con un aviso). Profesor: lo ve todo.
- Archivos: src/circ/guiadas.js (nuevo), guiadas_test.mjs (nuevo, 9 pruebas), src/circ/lab.js, src/portal/panel.js, css/ios.css.
- Pruebas: guiadas_test 9/9, circ_test 41/41 (http), captura de la portada con 2 desbloqueadas. No se han podido pasar las pruebas del emulador (no hay Java en esta máquina); las reglas no cambian.
- Probar a mano: activar el control en un grupo, desbloquear la 1 y la 2 y entrar como alumno de ese grupo (puede hacer falta recargar la página del alumno para ver los cambios).

### 5 · Prácticas de Tinkercad de «Trabajo de clase» como prácticas guiadas (13 a 16)
- c13 «Tinkercad 1 · El LED protegido», c14 «LED en paralelo», c15 «Pulsador e interruptor», c16 «Control combinado en paralelo»: enunciados de los circuitos 1 a 4 de la práctica de Tinkercad de «Trabajo de clase», mejorados (objetivo, teoría, material, esquema, pasos guiados, comprobación automática, preguntas con cálculo y reto con los apartados de Tinkercad). La pila de botón de 3 V se sustituye por el portapilas 2×AA (3 V).
- Archivos: src/circ/practices.js, circ_test.mjs (16 prácticas, todas recorridas paso a paso), acceso_test.mjs (cuenta de tarjetas).
- Pruebas: circ_test 45/45 (http).
- Probar a mano: hacer la 13 a la 16 como alumno; si se usa el desbloqueo por grupo, aparecen al final de la lista del panel.

## Arreglos (17/11/2026, rama grok-arreglos, publicados uno a uno en main)
### 6 · Nombres de las prácticas guiadas 13 a 16 (sin «Tinkercad»)
- Títulos nuevos, en la misma línea que las prácticas 1 a 12: 13 «El LED protegido con 3 V», 14 «Dos LED en paralelo», 15 «Pulsador e interruptor en serie», 16 «Interruptor general y ramas en paralelo». El contenido (enunciado, pasos, comprobación, preguntas y reto) no cambia; el avance guardado de cada alumno se conserva (mismos identificadores c13–c16).
- Archivos: src/circ/practices.js. Caché arr-20261117a.
- Probar a mano: portada de Circuitos, tarjetas 13 a 16.

### 7 · Componentes nuevos (fusible y final de carrera) y prácticas guiadas 17 a 21
- Simulador: **fusible** (nuevo; vidrio 3,6 × 10 mm con casquillos, hilo a la vista, calibre 50 mA–1 A). El hilo se calienta con I² por encima del calibre (rápido: a 2 × In se funde en décimas de segundo), se pone al rojo, se funde con humo y aviso, el vidrio queda ahumado y el hilo cortado; el circuito queda abierto (el polímetro mide la tensión entre sus patas y OL en continuidad). Sigue fundido aunque se pare la simulación: se cambia desde su panel («Cambiar el fusible», cuenta los cambios). **Final de carrera** (nuevo; microinterruptor KW11 con palanca de rodillo, botón rojo, rótulo C·NO·NC y contacto dibujado que se ilumina con la corriente): clic en la pieza o botón del panel para apretar/soltar la palanca. **Diodo**: el panel dice si conduce (directa) o bloquea (inversa). Transistor NPN y relé ya existían (corte/saturación, bobina con NO/NC).
- Símbolos nuevos en los esquemas: fusible, diodo horizontal, transistor NPN, motor y final de carrera.
- Prácticas guiadas nuevas (entran en el desbloqueo por grupo al final de la lista): 17 «El fusible protege el circuito», 18 «Final de carrera: el motor que se para solo», 19 «El diodo: polaridad y caída de tensión» (con medida de 0,7 V), 20 «El transistor NPN como interruptor», 21 «Transistor, relé y final de carrera» (automatismo con diodo de libre circulación).
- Archivos: src/circ/parts.js, engine.js, guide.js (los fusibles se comprueban «nuevos»; `c.part()` en las comprobaciones), lab.js, models3d.js, schem.js, practices.js, css/ios.css; circ_componentes_test.mjs (nuevo, 17 pruebas), circ_test.mjs (21 prácticas recorridas paso a paso), acceso_test.mjs (cuenta de tarjetas).
- Pruebas: circ_componentes_test 17/17, circ_test 50/50 (http), acceso_test 28/28, guiadas_test 9/9, circ_almacen_test 9/9. Sin cambios en reglas de Firestore. Caché arr-20261117b.
- Probar a mano: hacer la 17 (pulsar el pulsador funde el fusible; cambiarlo) y la 18 (clic en la palanca) en ordenador y móvil; revisar a ojo las piezas nuevas en el catálogo «Componentes».

### 8 · «Evaluación de circuitos» por niveles (pruebas sin pasos ni pistas, nota automática)
- Laboratorio de Circuitos: pestañas «Prácticas guiadas» / «Evaluación de circuitos» (#eee/circuitos/evaluacion). Cuatro niveles (#eee/circuitos/n1…n4): N1 LED, serie y paralelo (13, 4, 5) · N2 interruptores, pulsadores y conmutadores (1, 15, 7, 16) · N3 fusible, final de carrera y diodo (17, 18, 19) · N4 transistor y relé (20, 12, 21).
- Cada circuito: solo enunciado, esquema y material; sin pasos, pistas ni solución. El montaje de cada circuito se guarda solo (por usuario). «Enviar la prueba» corrige todos a la vez con las comprobaciones de la práctica (sin las de medir ni las propias del recorrido guiado): bien/mal por circuito y nota = media de requisitos cumplidos × 10.
- Alumno: se guarda como entrega (práctica n1…n4) con el montaje de todos los circuitos y la nota automática en `datos.comprobacion.nota`; después ya no puede cambiarla. Profesor/invitado: modo de prueba («Volver a intentarlo»), no se entrega.
- Profesor: en Grupos → «Prácticas guiadas» hay una lista «Evaluación de circuitos» para abrir cada nivel por grupo (token `evaluacion:n1,n2` en «apartados»; sin token, todos cerrados). En Entregas aparece «Evaluación de circuitos · Nivel N», con la nota automática como propuesta; «Revisar» vuelve a corregir con los montajes enviados (no se fía del resultado de la entrega), deja ver cada circuito y poner o cambiar la nota.
- Reglas de Firestore (cambio necesario, NO desplegado): la expresión de `practica` en entregas pasa a `^(c[1-9][0-9]?|a[1-9][0-9]?|n[1-9]|p[1-8]|v[1-9])$`. Arregla también un fallo previo: las prácticas guiadas 10 a 21 no se podían entregar. Prueba nueva en firebase/test/reglas.test.mjs (no se ha podido ejecutar: falta Java para el emulador). Copia para pegar en la consola: /workspace/portal-acceso/firestore.rules.para-pegar.txt.
- Archivos: src/circ/evaluaciones.js (nuevo), guiadas.js, lab.js, main.js, portal/panel.js, css/ios.css, firebase/firestore.rules; pruebas evaluaciones_test.mjs y evaluacion_e2e.mjs (nuevas), guiadas_test.mjs.
- Pruebas: evaluaciones_test 20/20, evaluacion_e2e 12/12 (http), guiadas_test 15/15, circ_test 50/50, acceso_test 28/28, circ_componentes_test 17/17, circ_almacen_test 9/9. Caché arr-20261117c.
- Probar a mano: publicar las reglas; como profesor abrir el nivel 1 a un grupo; como alumno hacer y enviar el nivel 1; como profesor ver la entrega, «Revisar» y guardar la nota.

### 9 · Prácticas del cuaderno integradas (commit 90e1ca3)
- 8 prácticas guiadas nuevas a partir del cuaderno de prácticas del profesor (sin datos del centro ni nombres): c22 «Dos LED en serie», c23 «Dos LED en paralelo con una sola resistencia», c24 «Cada rama con su control», c25 «Un LED desde tres interruptores», c26 «Reto: tres interruptores y tres LED», c27 «El condensador: luz que se apaga despacio», c28 «El LED RGB: mezcla de colores», c29 «Luz nocturna con transistor y LDR». Las que coincidían con prácticas ya existentes no se duplican (la tarjeta indica los apartados del cuaderno).
- Portada de Circuitos ordenada por temas, con numeración lógica; los identificadores internos (cN) no cambian, así que el avance guardado y las entregas se conservan.
- Evaluación de circuitos: nivel 5 «Condensador, LED RGB y sensores» (27, 28, 29).
- Archivos: src/circ/practices.js, guide.js, schem.js, lab.js, evaluaciones.js, css/ios.css; circ_test.mjs, acceso_test.mjs. Sin cambios en reglas (las entregas c22–c29 ya entran en la expresión de 8). Caché arr-20261117d.
- Probar a mano: portada por temas; hacer como alumno una de las nuevas (p. ej. 27 y 29); abrir el nivel 5 a un grupo y enviarlo.

### 10 · Dos niveles por práctica: «Guiada completada» y «Autónoma completada»
- Cada práctica guiada tiene ahora una **práctica autónoma** (#eee/circuitos/aN): el mismo objetivo, con esquema y material, pero sin pasos, pistas ni solución, y con el montaje vacío. «Comprobar mi circuito» la corrige sola (las comprobaciones de la práctica, sin las de medir ni las del recorrido guiado) y dice qué falla; se puede repetir.
- El alumno solo puede abrir la autónoma cuando ha completado la guiada (todos los pasos y «Comprobar circuito» en verde) y la práctica está desbloqueada para su grupo. El profesor puede abrirla siempre (modo de prueba, no se entrega).
- Insignias «Guiada completada» y «Autónoma completada»: en la tarjeta de cada práctica de la portada, en la pestaña «Práctica» de la guiada (recuadro «Práctica autónoma» con el botón para hacerla) y en la propia autónoma. El avance sigue siendo por usuario (almacén local con ámbito de usuario + entregas).
- Alumno: al salir bien, se guarda una entrega con práctica aN (montaje y requisitos cumplidos), una sola vez. Profesor: en Grupos, botón «Progreso en Circuitos» con una tabla por nº de lista y práctica (punto verde = guiada completada, azul = autónoma completada, y totales G · A); en Entregas aparece «Circuitos N · … (autónoma)» y «Revisar» carga el montaje.
- Reglas de Firestore: sin cambios nuevos (la expresión de 8 ya admite aN). Hace falta que estén publicadas las reglas de 8 para que se guarden las autónomas de los alumnos.
- Archivos: src/circ/evaluaciones.js (autonomaDe, idAutonoma), lab.js, main.js (ruta aN), portal/panel.js, css/ios.css; pruebas evaluaciones_test.mjs (+2), evaluacion_e2e.mjs (+6), circ_pins_test.mjs (la comprobación «Has cambiado el fusible fundido» es del recorrido guiado y ya no se exige al montaje final; fallaba desde 7).
- Pruebas: evaluaciones_test 25/25, evaluacion_e2e 18/18 (http), guiadas_test 15/15, circ_test 58/58 (http), circ_pins_test 69/69, circ_componentes_test 17/17, circ_almacen_test 9/9, acceso_test 28/28, proteccion_test, plataforma_test y aula_modelo_test en verde. Caché arr-20261117e.
- Probar a mano: como alumno, completar una guiada, pulsar «Hacer la práctica autónoma», comprobar vacía (sale qué falla) y bien montada (insignia); como profesor, Grupos → «Progreso en Circuitos» y Entregas → la autónoma → «Revisar»; ver la tabla en el móvil (se desplaza en horizontal).

## Arreglo urgente · acceso del profesor (18/11/2026, caché arr-20261118a)
- Causa: el archivo de reglas «para pegar» del 17/11 se generó copiando `firestore.rules` sin sustituir el marcador `PROFESOR_EMAIL`. Con esas reglas publicadas nadie es profesor: la lectura de `config/profesores` da permission-denied y el portal muestra «no tiene permiso de profesor». Reproducido en el emulador (marcador → denegado; con correo → permitido).
- Además, al volver a la puerta tras un error, el botón se quedaba en «Abriendo Google…» desactivado (formulario «ocupado»), y parecía que se quedaba cargando.
- Cambios (src/portal/main.js): `mostrarGate` siempre deja el formulario y los botones libres; la comprobación de profesor tiene un tiempo máximo de 20 s; el mensaje de permiso avisa de revisar el correo en las reglas; si el panel falla al abrirse, se muestra el error en vez de quedarse en blanco.
- Reglas: sin cambios en el repositorio. Hay que volver a pegar las reglas generadas con `node prepara-reglas.mjs <correo>` (nunca `firestore.rules` tal cual).
- Pruebas: test:reglas 142/142, fb_e2e 59/59, tests unitarios en verde.
- Probar a mano: pegar reglas → Ctrl+F5 → entrar como profesor.

## v5 · SuperProfe Pablo para alumnos: secciones por asignatura (19/11/2026, rama grok-arreglos → main, caché v5-20261119*)
Encargo: /workspace/portal-v5/ESPEC-v5.md (redactado con Claude). Por fases, cada una publicada en main.

### Fase 1 · Secciones por asignatura — HECHA
- Secciones: Avisos · Teoría · Ejercicios en clase · Tareas · Test · Exámenes · Laboratorio y, para el profesor, «Gestión».
  Lógica pura en `src/lms/secciones.js` (tabla tipo → sección, configuración, enlaces antiguos, contadores, agrupar por tema).
- **Migración automática en lectura**: la sección se deduce del tipo (`seccionDe`); si el elemento trae `seccion`, manda esa.
  No se reescribe ni se borra ningún documento (lo comprueba `secciones_e2e`). `examen` → Test; con PDF o «sin elementos externos» → Exámenes.
- **Activado solo en EEE y Proyecto (proy2)** por defecto. Lista configurable en Gestión → «Secciones de la asignatura»
  (se guarda en `config/secciones.activas`, sin tocar código). Las demás siguen con «Trabajo de clase · Tablón».
- **Configurable por asignatura** (orden, nombre, ocultar) en `config/secciones.asig[asig] = [{ id, nombre, orden, visible }]`.
  Una sección oculta no se abre ni con el enlace directo.
- **Gestión** (profesor) = lo que estaba en «Trabajo de clase»: importar (Classroom/JSON), banco, pregunta en directo, filtros por estado,
  grupos y seguimiento (cuaderno, entregas), programación de la asignatura y papelera; más la configuración de secciones.
- En cada sección: agrupado por tema/SA en el orden del profesor con filtro por tema (lo de siempre, reutilizado); el profesor puede crear,
  arrastrar, publicar… igual que antes. Ejercicios en clase incluye las actividades 3D; Laboratorio, los laboratorios 3D.
- **Contador** en cada pestaña: alumno = lo que tiene pendiente (sin entregar, fuera de plazo/devuelto, borrador, examen abierto);
  profesor = elementos «pendientes de completar».
- **Enlaces antiguos**: `#asig/x/tablon` → avisos, `/actividades` → clase, `/laboratorio` → laboratorio, `/trabajo` → teoría (alumno) o
  gestión (profesor). `#trabajo/<id>` sigue abriendo el elemento.
- Editor: campo «Sección» (opcional, «según el tipo»), solo con las reglas v5. Al editar se conservan `seccion`, `pdf` e `interactivo`.
- Diseño: pestañas píldora de cristal con icono Lucide y contador rojo en ordenador; barra inferior fija y desplazable en el móvil.
- **Reglas** (en el repositorio, sin desplegar): `config/secciones` (leer profesor y alumno con sesión; escribir profesor), items con
  `seccion`/`pdf`/`interactivo` validados, `origenes/{id}` y `plantillas/{id}` solo profesor. Pruebas: `firebase/test/v5.test.mjs`.
- **Degradación**: con las reglas antiguas el portal funciona igual (secciones por defecto; el editor no escribe campos nuevos y Gestión avisa
  de pegar las reglas). Comprobado con `REGLAS_VIEJAS=1` en `secciones_e2e`.
- Pruebas: `secciones_test.mjs` (11), `firebase/test/v5.test.mjs` (en `npm run test:reglas`, 149/149), `e2e/secciones_e2e.mjs`.
  `aula_e2e` recorre el modo clásico: desactiva las secciones de EEE al empezar (una línea) y sigue 118/118.
- Verificación antes de publicar (19/11): build OK; tests unitarios 80/80 (secciones, importador_v5, aula_modelo, plataforma, protección, acceso, evaluaciones);
  circ_test 77/77, barra_test 90/90, circ_auditoria 63/63, circ_estados 93/93, guiadas 20/20 (http local); test:reglas 149/149 (emulador);
  secciones_e2e 39/39, aula_e2e 118/118. Caché v5-20261119a.
- Probar a mano: pegar las reglas nuevas (/workspace/portal-acceso/firestore.rules.para-pegar.txt) → Ctrl+F5 → EEE: pestañas de secciones;
  Gestión → «Secciones de la asignatura» (renombrar, ordenar, ocultar); como alumno, contador de pendientes y barra inferior en el móvil.

### Fase 2 · Nombre «SuperProfe Pablo para alumnos» y las dos caras de cada elemento — HECHA (caché v5-20261119b)
- Nombre completo en la pestaña, el manifest, la pantalla de entrada (también la de js/acceso.js) y la portada; en la cabecera,
  completo desde 1280 px y «SuperProfe» si no cabe (móvil, tableta). `apple-mobile-web-app-title` y `short_name` siguen «SuperProfe».
- PDF oficial y versión interactiva (§3 del encargo): ya publicado con la Fase 1 (src/lms/caras.js, portal/caras-ui.js): botones
  «Ver PDF» (visor de solo lectura; «Permitir descargarlo» por archivo) y «Versión interactiva» solo si existe; campos `pdf` e
  `interactivo` validados en las reglas; `origen` (Drive) solo en `origenes/{id}`, que solo lee el profesor. El portal no abre Drive.
- Pruebas: acceso_test 28/28, barra_test 90/90 (con el nombre largo a 1280 y 1366 sin solapes).
- Probar a mano: Ctrl+F5 → pestaña y entrada con el nombre nuevo; en un elemento, editor → «PDF oficial, versión interactiva y origen».

### Fase 3 · Notas sin porcentajes: cuaderno por criterio — HECHA (caché v5-20261119c)
- Lo que ya existía: el cuaderno ya no mostraba la media ponderada por categorías (solo la nota de cada actividad) y el CSV por
  criterio ya estaba. Ningún sitio del alumno muestra media ni nota final.
- Nuevo: en el cuaderno, píldoras «Por actividad» / «Por criterio». «Por criterio» = tabla nº de lista × criterio con las notas de cada
  actividad de ese criterio (las preguntas de los exámenes cuentan en su criterio), sin medias ni porcentajes; la nota final la calcula QE.
  Lógica pura `tablaPorCriterio` en src/lms/analitica.js.
- Quitado: el código muerto que guardaba pesos por categoría (`guardarPesos`). Los pesos antiguos de `cursos/{id}.pesos` NO se borran
  (se siguen copiando tal cual al editar el curso), solo dejan de usarse. `mediaPonderada` se conserva en lms/modelo.js por compatibilidad.
- Rúbrica por defecto sin pesos: los 5 criterios de la plantilla valen lo mismo (2 puntos / 20 cada uno). En PIAC, si todos los criterios
  valen lo mismo, ya no se enseña «(20 %)». Las rúbricas guardadas no cambian.
- Pruebas: notas_v5_test.mjs (2), plataforma_test y aula_modelo_test 56/56, aula_e2e 119/119 (nueva: «Por criterio»), barra_test 40/40.
- Probar a mano: Panel → Cuaderno → «Por criterio» con un grupo que tenga notas.

### Fase 4 · Exportar asignatura en PDF (ZIP) y PDF de cuestionarios — HECHA (caché v5-20261119d)
- Gestión → «Exportar asignatura en PDF»: casillas por sección y por tema → ZIP generado en el navegador y descargado en el equipo
  (no se envía a ningún sitio; el portal no se conecta a Drive). Carpetas 1_Teoria/, 2_Ejercicios_clase/, 3_Tareas/, 4_Test/,
  5_Examenes/, 6_Laboratorio/ con una carpeta por tema (01_…, 00_Sin_tema); los PDF del portal (el oficial y los demás adjuntos PDF,
  también los de materiales/); los cuestionarios del portal pasados a PDF (preguntas y, aparte, _soluciones.pdf); indice.pdf con la lista
  (y lo que no se haya podido leer); manifiesto.json (sección, tema, título, archivo y origen si lo hay). Sin datos de alumnos.
- En el menú de cada cuestionario: «PDF (enunciado y soluciones)» (adelanta el punto 6.6 del encargo).
- Librería: jsPDF 4.2.1 (MIT) en vendor/jspdf/, cargada solo al exportar; anotada en LEEME.txt. El ZIP es el código propio de lms/docx.js
  (ya existía), así que no hace falta JSZip.
- Archivos: src/lms/exportar-zip.js (plan, nombres, manifiesto, texto de preguntas), src/portal/exportar-ui.js, aula-clase.js.
- Pruebas: exportar_zip_test.mjs (7), secciones_e2e 44/44 (descarga el ZIP y lo abre: carpetas, PDF válidos, manifiesto; PDF de soluciones).
  Ejemplo generado en /workspace/capturas-v5/v5_f4_ejemplo.zip (datos de prueba).
- Probar a mano: EEE → Gestión → «Exportar asignatura en PDF» → Descargar ZIP y abrirlo; en un cuestionario, menú → «PDF (enunciado y soluciones)».

### Bloque 5 · Punto 7: Biblioteca y cursos con secciones — HECHO (caché v5-20261119e)
- Copiar curso (Panel → Cursos «Copiar de…») pasa a src/portal/aula-copia.js (lo usan el Panel y la Biblioteca). Copia el elemento
  entero (sección, PDF, versión interactiva incluidos), cuestionarios y claves, como borrador y sin grupos; y además el origen en Drive
  (origenes/{id}, solo profesor, solo con reglas v5).
- «Reutilizar publicación» (de otro curso), «Duplicar» y «Duplicar en otro grupo o curso» usan copiar() de aula-clase.js: ya copiaban
  todos los campos del elemento; ahora también el origen (origenes/{id}).
- Biblioteca: al «Añadir al curso» una asignatura sin contenido en el curso activo, propone copiar el del último curso que la tuvo
  (confirmación; borrador). No se borra nada del curso anterior.
- Las secciones de la asignatura están en config/secciones (no por curso): se conservan solas.
- Añadir una asignatura NUEVA a la Biblioteca sigue exigiendo tocar código (src/lms/biblioteca.js); no se ha cambiado.
- Pruebas: aula_e2e 120/120 (nueva: volver a dar T.I.Cs II copia del curso pasado con sección, interactivo y origen); secciones_e2e 45/45
  (nueva: duplicar copia sección, interactivo y origen); test:reglas 149/149; unitarias 112/112; circ 77/77, barra 90/90,
  circ_auditoria 63/63, circ_estados 93/93, guiadas 20/20. Arreglado un tropiezo de tiempos en aula_e2e (arrastrar tema).
- Probar a mano: Biblioteca → «Quitar del curso» una asignatura que tuviera contenido el curso pasado y «Añadir al curso» → aceptar
  «Copiar» → aparecen los elementos como borrador en su sección.

### Bloque 6 · Punto 5: importador — HECHO (caché v5-20261119f)
- Ya existía (Fase 1, src/lms/elemento.js + portal/aula-json.js): seccion, tema por nombre, pdf, interactivo, origen (aparte, en
  origenes/) y la lista «secciones»; sin seccion se deduce del tipo; vista previa; aviso con reglas antiguas; Exportar JSON con origen.
- Nuevo: «secciones» del archivo se FUSIONAN con las guardadas (fusionarSecciones/parcialSecciones en lms/secciones.js): basta poner
  las que cambian; antes un archivo con una sola sección borraba el nombre/orden/visibilidad que el profesor tenía en las demás.
  La vista previa lo dice y avisa si la asignatura aún no usa secciones (importar no las activa). Mensaje «Secciones guardadas.»
  cuando el archivo solo trae secciones.
- Documentado: LEEME.txt (ejemplo completo) y src/lms/semilla/FORMATO_IMPORTAR.md (sección v5 con ejemplo y reglas de fusión).
- Pruebas: importador_v5_test 8/8 (nueva: fusión), secciones_e2e 47/47 (nueva: importar solo «examenes» conserva Apuntes y
  Laboratorio oculto), aula_e2e 120/120, unitarias OK, acceso 28/28, barra 90/90. Reglas sin cambios.
- Probar a mano: Gestión → Importar JSON → pegar {"secciones":[{"id":"examenes","nombre":"Pruebas escritas"}]} → Validar → Guardar:
  cambia solo ese nombre.

### Bloque 6 · Punto 6a y 6b: banco con dificultad y filtros, importador del banco, plantillas de examen — HECHO (caché v5-20261119g)
- Ya existía: banco por asignatura con criterio (banco/{id}), «Generar rápido por criterio», copiar preguntas de un examen, exportar JSON,
  «Del banco…» en el editor. Se reutiliza todo.
- 6a: cada pregunta puede llevar «tema» y «dificultad» (1 básica, 2 media, 3 avanzada; también vale la palabra). Van dentro de `q`, así
  que banco/{id} no cambia de reglas y las preguntas antiguas (sin tema ni dificultad) siguen igual. Filtros por criterio, tema
  («Sin tema» incluido) y dificultad, con etiqueta de dificultad en gris/rojo. Importador: tema, dificultad, «apartados» (abiertas →
  su rúbrica con puntos) y «paso» (escalones de la puntuación parcial). Al pasar al examen se quitan tema y dificultad (también en
  «Del banco…»). Documentado en LEEME.txt y FORMATO_IMPORTAR.md.
- 6b: plantillas de examen (filas «n preguntas de criterio/tema/dificultad», máx. 30), ordenadas de menos a más difícil; de una plantilla
  salen Examen (sección Exámenes), Test de repaso (sección Test) y Recuperación (Exámenes) sin repetir preguntas, como borrador.
  Guardar/usar/borrar plantillas en plantillas/{id} (solo profesor; la regla ya estaba en las reglas v5 de la Fase 1 con pruebas en
  v5.test.mjs). Sin reglas v5 se puede generar pero no guardar plantillas.
- Pruebas: banco_v5_test 8/8, plataforma_test 41/41, importador_v5 8/8, exportar_zip 7/7, secciones 11/11; E2E plataforma fase 2 21/21
  (filtros, plantilla guardada, 3 versiones distintas). Reglas sin cambios. Captura /workspace/capturas-v5/v5_f6_banco_plantillas.png.
- Probar a mano: Gestión → Banco de preguntas → filtros; Plantillas → una fila, marcar Test de repaso y Recuperación → Generar.

### Bloque 6 · Puntos 6c, 6d, 6e y 6f — HECHO (caché v5-20261119h)
(Se publican juntos porque tocan los mismos archivos: aula-panel.js, modelo.js.)
- 6c · examen distinto por alumno. Ya existía: preguntas y opciones barajadas por alumno y datos propios en las numéricas con
  variables, con una semilla fija = elemento + grupo_nº (los dos ya se guardan en su trabajo, así que se puede rehacer siempre;
  no hace falta campo nuevo ni reglas nuevas). Nuevo: `versionAlumno()` en lms/modelo.js (la usan el alumno y el profesor) y, al
  revisar en el cuaderno, las respuestas salen en el orden que le salieron al alumno, con «(n.º X del examen)» y la semilla.
  La nota no depende del orden (respuestas por id).
- 6d · puntuación por apartados con subniveles. Ya existía: parcial en emparejar/ordenar/huecos/clasificar/tabla, rúbrica de
  las abiertas con 4 niveles, ajuste a mano de 0,25 en 0,25. Nuevo: «paso» en las de parcial (6a) y en cada apartado de la
  rúbrica de una abierta (botones 0 · 0,25 · 0,5 … hasta sus puntos; sin paso, 0 y los 4 niveles: ahora con botón 0). En el
  editor, «Criterio | puntos | paso» por línea; la línea antigua «Criterio | puntos» sigue valiendo. Arreglado de paso: el editor
  ya no pierde los niveles descritos de los apartados al guardar.
- 6e · alumno × criterio. Ya existía (Fase 3): cuaderno «Por criterio» y CSV largo. Nuevo: en Analítica de cada examen, tabla
  nº de lista × criterio (puntos y nota 0–10 del criterio, sin medias) y «CSV alumno × criterio» (sin nombres).
- 6f · PDF de cualquier examen o test. Ya existía (Fase 4): menú del cuestionario → «PDF (enunciado y soluciones)». Nuevo: al
  generar desde una plantilla, botones «PDF» y «Soluciones» de cada versión (examen, test de repaso, recuperación).
- Pruebas: examen_v5_test 8/8 (nuevo), banco_v5 8/8, plataforma_test 41/41, importador_v5 8/8, exportar_zip 7/7, secciones 11/11,
  aula_modelo 15/15; E2E plataforma fases 2,3,12 52/52 (6c semilla, 6d subniveles, 6e tabla y CSV, 6f PDF); aula_e2e 120/120;
  secciones_e2e 47/47; test:reglas 149/149 (reglas sin cambios).
- Capturas: /workspace/capturas-v5/v5_f6_revision_version_alumno.png, v5_f6_subniveles_apartados.png, v5_f6_alumno_criterio.png,
  v5_f6_plantilla_generados.png, v5_f6_test_repaso.pdf.
- Probar a mano: Cuaderno → casilla de un examen entregado (orden del alumno y semilla); editor de una abierta → «Plantea | 1 | 0,25»;
  Panel → Analítica → examen → «Alumno × criterio» → CSV; Banco → Plantillas → Generar → «PDF Test de repaso».

### Resumen final v5 (19/11/2026) · lo que falta y riesgos para los datos
- Hecho: secciones (F1), nombre (F2), notas sin porcentajes (F3), exportar ZIP/PDF (F4), Biblioteca y cursos (B5), importador (B6 p5),
  banco y exámenes 6a–6f. Main en caché v5-20261119h.
- Falta / decisiones abiertas: activar secciones en el resto de asignaturas (interruptor, cuando Pablo lo diga); añadir una asignatura
  nueva a la Biblioteca sigue exigiendo tocar src/lms/biblioteca.js; la semilla del alumno no se guarda como campo aparte (se
  rehace con elemento + grupo_nº).
- Riesgos para los datos:
  1. Reglas v5 sin pegar: el portal funciona como antes, pero no se guardan plantillas, secciones ni origen (avisa en pantalla). No se pierde nada.
  2. Si el profesor cambia las preguntas de un examen ya hecho, la «versión del alumno» de la revisión se rehace con la lista nueva
     (la nota no cambia: las respuestas van por id de pregunta). Recomendación: duplicar el examen en vez de editarlo después.
  3. Las preguntas antiguas del banco (sin tema, dificultad ni paso) siguen igual; tema y dificultad van dentro de `q`, sin cambio de reglas.
  4. Ninguna migración reescribe ni borra entregas, notas, evidencias ni pesos antiguos (las secciones se deducen al leer).
  5. Los CSV y PDF van sin nombres (solo nº de lista); los PDF de soluciones no deben llegar a los alumnos.

### Márgenes y móvil del alumno — HECHO (caché v5-20261120a, 20/11/2026)
- Arreglos de maquetación en css/ios.css (y el nombre largo de la portada en dos tramos, para que en el móvil quepa «SuperProfe»).
- La barra inferior de secciones (≤720 px) ya no queda debajo del contenido ni tapa el final de la página; el fondo difuminado deja de ensanchar el scroll; la navegación, la portada, Mis trabajos, el calendario (sin morado), el panel y los enunciados de examen se ven bien a todos los anchos.
- Pruebas: margenes_e2e 204/204; barra_test 90/90; circ_test 77/77; secciones_e2e 47/47; aula_e2e 120/120. Reglas y firebase-config.js sin cambios.
- Capturas: /workspace/capturas-margenes/antes y despues.
- Probar a mano: Ctrl+F5; en el móvil, una asignatura de EEE y comprobar que la barra inferior de secciones se ve y se puede pulsar, y que la página no se desliza hacia los lados.

### Vivienda · tablero eléctrico paso a paso (t158u + t159u, 22/11/2026)
Pablo: prácticas una a una como en Circuitos (Guiada y Autónoma, candados), más realismo y siempre con el REBT; los cables nunca por
encima de los tubos. t159u: la vivienda 3D completa (casa) se deja; solo paso a paso y tablero. No se borra nada (proyectos 1–8,
tablero de la SA1, modo libre, juego, averías, materiales).
- Bloque A — HECHO (caché v5-20261122a): cables por dentro del tubo y mecanismos realistas.
  - modelo.js: `lineaTubo` (eje del tubo de boca a boca con curvas redondeadas) y `recorridoCable` (del borne baja dentro de la caja,
    entra por la boca, sigue el eje con su sitio fijo en el haz sin tocar la pared, y sale por la otra boca; en el cuadro baja al
    canal de abajo/arriba de la aparamenta). Bornes de los mecanismos y del portalámparas DENTRO de la pieza (antes, fuera de la caja).
  - lab.js: tubos con las curvas redondeadas; botones (Lucide) «Ver los cables por dentro del tubo» (tubo translúcido) y
    «Poner o quitar marcos y teclas». Sin marco se ve el mecanismo empotrable con bastidor, garras y bornes; con marco, tecla
    basculante con arista y visor, schuko con alvéolos y contactos de tierra. Un clic en el centro de un mecanismo lo selecciona.
  - Prueba nueva: viv_tubos_test.mjs (76 cables de los montajes de referencia: ningún punto fuera de la pared del tubo).
  - Capturas: fuente/tools/capturas_viv.mjs → /workspace/capturas-vivienda/antes_* y d5_* (escritorio y 390×844).
  - Pruebas: viv_test 94/94, viv_modelo_test OK, viv_tubos_test OK.
- Bloque B — HECHO (caché v5-20261122b): prácticas del tablero una a una, como en Circuitos.
  - src/viv/practicas.js (nuevo, puro): circuitos C1–C5 de la ITC-BT-25 (PIA, sección y tubo), aparamenta del CGMP y 7 prácticas
    vp1 Cuadro general (IGA, ID 30 mA, PIAs; disparo con T, sobrecarga y corto) · vp2 Punto de luz con interruptor · vp3 Conmutada ·
    vp4 Schuko 16 A con tierra (con fuga) · vp5 Caja de registro con empalmes · vp6 Circuito completo · vp7 Cruzamiento.
    Cada una reutiliza el montaje y la corrección de su proyecto; los pasos se ponen en verde en orden según el montaje real.
  - src/viv/practilab.js (nuevo): portada con tarjetas, progreso «n de 7 guiadas», Guiada (#eee/vivienda/vpN) y Autónoma
    (#eee/vivienda/vpN-auto; el alumno la abre al terminar la guiada), panel Guía/Esquema/REBT, Comprobar, Empezar de nuevo.
    Entrega única «v6» (tipo vivienda) con el estado de todas las prácticas: no hace falta cambiar las reglas de Firestore.
  - Candados del profesor: token «vivienda:vp1,…» en los apartados del grupo (sin token, todas abiertas), igual que «guiadas:».
    panel.js lo conserva al editar el grupo. Arreglo: los tokens de candado ya no cuentan como apartados (main.js/asig.js),
    así un grupo sin apartados elegidos no pierde el laboratorio al cerrar una práctica.
  - Se mantienen el ejercicio guiado del tablero de la SA1, los 8 proyectos, el modo libre, averías y materiales.
  - Pruebas nuevas: viv_practicas_test.mjs (11/11) y viv_practicas_e2e.mjs (todo OK, con candados de alumno).
  - Pruebas: viv_test 94/94, viv_modelo_test 16/16, viv_tubos_test OK, guiadas_test OK, circ_test 77/77, barra_test 90/90.
  - Capturas: /workspace/capturas-vivienda/d6_* (portada, vp1, vp2, móvil; scrollWidth 390).
- Bloque C — HECHO (caché v5-20261122c): cuadro más real y explicado.
  - modelos3d.js: serigrafía de los aparatos en su ventana: IGA «C25 · [6000] · 230/400 V~», diferencial «ID 40 A · IΔn 30 mA ·
    Tipo AC 230 V~» con el botón T amarillo, PIAs «C10 / C1 [6000] / 230 V~» (curva, calibre, circuito, poder de corte, tensión).
  - lab.js: peine 1P+N real: barra aislada gris solo sobre las entradas de los PIAs, con un diente de cobre en cada borne.
  - practilab.js, pestaña REBT: esquema 2D del cuadro de electrificación básica (IGA, ID y PIAs C1–C5 con su serigrafía y peine),
    cómo se lee un PIA, y las pruebas de disparo (botón T, fuga a tierra, sobrecarga, cortocircuito) en 1–2 frases cada una.
  - Pruebas: viv_test 94/94, viv_practicas_test 11/11, viv_practicas_e2e OK, viv_tubos_test OK. Capturas c3_cuadro*.png, c3_vp1_rebt.png.
  - Pendiente: el tablero 3D de vp1 sigue con C1 y C2 montados (C3–C5 solo en el esquema 2D y la tabla).
- Bloque E — HECHO (caché v5-20261122d): remates.
  - Plano: `planoSVG` usaba `rutaTubo(...)?.pts`, pero rutaTubo devuelve un array, así que los tubos NUNCA se dibujaban en el
    plano. Arreglado (proyectos.js) y con prueba (viv_practicas_test: un trazo por tubo). Captura e_plano.png (3 tubos en la práctica 2).
  - Emoji: el portal ya los cambia al vuelo por iconos Lucide (instalarIconos) en el texto; prueba nueva viv_emoji_e2e.mjs recorre
    portada, prácticas, proyectos, tablero y modo libre (texto, opciones, title, aria-label): 0 emoji a la vista. El rótulo 3D de la
    manguera ya no lleva 🔌. (Los emoji siguen en el código fuente como clave del mapa de iconos; no se ven.)
  - REBT en el móvil: el esquema del cuadro ya no es un SVG que se encoge: es HTML con texto de 13–15 px que se reparte en dos filas
    (IGA + ID arriba; peine y C1…C5 abajo). Captura e_rebt_movil.png (390 px, sin desbordar).
  - Práctica 1: el carril lleva también C3 25 A, C4 20 A y C5 16 A (serigrafía C25/C20/C16, [6000], 230 V~), sin cablear; el
    peine 1P+N cubre los cinco PIAs. La práctica sigue pidiendo solo C1 y C2 (`conReserva`, también en montajes guardados).
  - Cuadro: los cables entre aparatos (IGA→ID, ID→C1, puentes C1→C2) van peinados: bajan o suben a su canal, cada uno en su carril,
    y si van de abajo a arriba suben por el canal lateral izquierdo (`recorridoInterno` en modelo.js). Sin bucles sueltos.
  - Autónoma (t161u): montaje libre que empieza sin cables, sin pasos que se marquen solos, con «Comprobar mi montaje» al final
    (comprobado en viv_practicas_e2e). La guiada de la SA1 sigue tal cual.
  - Medidas revisadas con fichas de fabricante:
    - Marco: Simon 82 1 elemento (ref. 82610-30) 89 × 87 mm (simonelectric.com, ficha técnica); el modelo usa 84 mm, dentro del
      rango habitual de 80–89 mm. Bastidor 71 mm (estándar de caja universal).
    - Caja universal de empotrar: 70 × 70 × 40/42 mm (fichas EN 60670-22 en ideco4.com y latiendadeelectricidad.com).
    - Caja de registro 100 × 100 mm: ya era la medida del modelo (CE 100×100).
    - Tubo corrugado: Ø16 (C1) y Ø20 (C2, C4, C5), Ø25 (C3), como la ITC-BT-25.
    - PIA 1P+N: Schneider iDPN (A9N21644) 18 mm = 1 módulo, 81 mm de alto, curva C, 6000 A, pelado 13 mm, par 2 N·m (el
      modelo: 1 módulo de 18 mm, 85 mm, pelado ideal 14 mm, par 2 N·m).
    - Diferencial: Schneider iID 2P 40 A 30 mA (A9R21240) 36 mm = 2 módulos, 91 mm de alto, botón T (el modelo: 2 módulos, 36 mm).
    - Schuko 16 A con contactos de tierra laterales: ya estaba en el modelo (bloque A). Nada que corregir en medidas.
  - Pruebas: viv_practicas_test 13/13, viv_modelo_test 16/16, viv_tubos_test OK, viv_practicas_e2e OK, viv_emoji_e2e OK, viv_test 94/94, circ_test 77/77.
  - Capturas: /workspace/capturas-vivienda/e_cuadro.png, e_plano.png, e_rebt_movil.png (y e_cuadro_movil.png).
- Bloque F — HECHO (caché v5-20261122e): mecanismos, fichas y cables revisados con piezas reales (Schneider New Unica/Elda, WAGO).
  - Regla: los ids internos de los bornes NO cambian (1, 2, C, 1–4, L/N/PE), así que los montajes guardados y la guía de la SA1
    siguen valiendo; solo cambia lo que se ve (marcado, nombre del borne, esquema trasero) y los textos que lo nombran.
  - Visor «Ver en 3D»: cada mecanismo lleva por detrás su esquema serigrafiado (símbolo IEC, bornes, L en rojo, valores
    nominales), la tecla de desenclavar del borne de fase en rojo (como New Unica) y la tierra con su símbolo.
  - Comprobación: un cable flexible (H07V-K, el del laboratorio) en un conector de inserción tipo WAGO 2273 ahora es FALLO en modo
    realista (sim.js, «flexible»): el 2273 solo admite rígido. Ninguna solución ni la SA1 usan esas fichas.

  | Elemento | Referencia real | Lo que había | Lo que he cambiado | Fuente |
  |---|---|---|---|---|
  | Interruptor simple | Schneider New Unica NU310118 / Elda, 10 AX 250 V~; dos bornes arriba marcados L y 1; esquema detrás | Bornes «C» y «↓» | Marcado L / 1, borne L rojo, esquema trasero «L —/ 1 · 10 AX 250 V~», textos y preguntas con L y 1 | rolearmais.pt/uploads/product_documents/RM_LSB03605EN.pdf (catálogo New Unica: esquema en la parte trasera, L y 1) |
  | Conmutador | New Unica NU310318, 10 AX; común L + viajeros 1 y 2 | Marcado L, 1, 2 (ya correcto) | Borne L rojo y esquema trasero del conmutador | mismo catálogo New Unica |
  | Cruzamiento | New Unica NU310518, 10 AX 250 V~, 22,5×45 mm; dos circuitos de distinto color | Bornes 1–4 | Marcado E1/E2 (entradas, tecla roja) y S1/S2 (salidas, tecla negra); esquema recto + cruzado detrás | latiendadeelectricidad.com, ficha NU310518 |
  | Pulsador | New Unica NU310618, 10 A 250 V~ NA, bornes sin tornillo 0–2,5 mm² | Bornes «C» y «↓» | Marcado L / 1, esquema de pulsador NA, «10 A 250 V~» | latiendadeelectricidad.com, ficha NU310618 |
  | Base schuko | New Unica 2P+T 16 A 250 V~ (tierra lateral) | L/N/PE, tierra lateral | Símbolo de tierra en el borne PE, esquema L/N/tierra detrás, «16 A 250 V~ 2P+T»; L/N sin polaridad obligatoria (dicho en el texto) | catálogo New Unica; ITC-BT-19 colores |
  | Minutero | Automático de escalera de 4 bornes L, N, 3, lámpara | L, N, 3, ↓ | Sin cambios (el borne de lámpara se marca con símbolo) | — |
  | Cajas de empalme | Caja estanca de registro 80/100 mm con conos y tapa de 4 tornillos (tipo Plexo) | Igual | Sin cambios | bloque E (EN 60670-22) |
  | Fichas de palanca | WAGO 221: 0,14–4 mm² rígido y flexible, 32 A 450 V, pelado 11 mm | Igual | Sin cambios | wago.com/es (221-412/413/415) |
  | Fichas de inserción | WAGO 2273: SOLO rígido 0,5–2,5 mm², 24 A 450 V, pelado 11 mm; tapa 2 blanca, 3 naranja, 4 roja, 5 amarilla, 8 gris | Admitían el H07V-K flexible; tapa de 2 gris | Fallo realista con cable flexible; texto de la referencia; colores de tapa reales | wago.com/es/…/p/2273-203; sparx-elec.fr/wago-221-vs-2273 |
  | Regleta | Clema de polietileno de tornillo | Igual | Sin cambios | — |
  | Cables | H07V-K 450/750 V (UNE-EN 50525-2-31); 1,5 (C1), 2,5 (C2, C5), 4 (C4), 6 (C3) mm²; marrón/negro/gris fase, azul neutro, verde-amarillo tierra | Serigrafía «H07V-K 1x… mm² 450/750 V Eca» | Sin cambios (correcto; ES07Z1-K solo es obligatorio en pública concurrencia, ITC-BT-28) | ITC-BT-19, ITC-BT-25 tabla 1 |
  | Portalámparas E27 | Contacto central = fase (retorno), rosca = neutro | Igual | Sin cambios | UNE-EN 60238 |

  - Pruebas: viv_modelo_test 16/16, viv_practicas_test 13/13, viv_tubos_test OK (76 cables en su tubo), viv_practicas_e2e OK, viv_emoji_e2e OK, viv_test 94/94 (actualizada: interruptor marcado L y 1), circ_test 77/77. Commit 40363d6.
  - Capturas f_<mecanismo>_delante.png y _detras.png en /workspace/capturas-vivienda/ (capturas_mec.mjs).
  - Pendiente: las refs NU310118 y NU310318 no las he contrastado con una ficha (sí NU310518 y NU310618); en el enchufe el esquema
    trasero queda cerca del borne de tierra; caja de empalme sin referencia Schneider concreta.
- Bloque G — HECHO (caché v5-20261122f): la SA1 y las prácticas nuevas, cada una con su marcado (t163u: «hazlo independiente a la otra guiada»).
  - La guía de la SA1 (montaje.js) y los proyectos guiados (proyectos.js) vuelven EXACTAMENTE a como estaban antes del bloque F
    (archivos restaurados de 40363d6^: «L y ↓», cruzamiento 1–4, sus preguntas y su material). Su lógica no cambia.
  - Dos juegos de marcas en catalogo.js: MARCAS_SA1 (las de siempre) y MARCAS_REAL (New Unica: L/1, E1-E2/S1-S2). `MARCAS` y
    `REFERENCIAS` eligen el juego con `varianteMarcas(real)` (modelo.js), que también pone los nombres de bornes y la descripción
    de TIPOS. Se activa SOLO al abrir una práctica nueva (vp1–vp7, guiada y autónoma) o al revisar su entrega «v6»; en cualquier
    otra pantalla (SA1, tablero, proyectos, libre, taller, casa, averías) se vuelve al marcado de siempre.
  - Lo del bloque F que solo sale en las prácticas nuevas: esquema serigrafiado detrás, tecla roja de la fase, símbolo de tierra,
    textos con referencias New Unica, marcas del plano y el fallo «WAGO 2273 con cable flexible» (sim.js). Los ids de los bornes
    son los mismos en las dos variantes: ningún montaje guardado se rompe.
  - Cruzamiento (prácticas): las etiquetas de los cables se colocan por fuera (arriba y abajo) y ya no tapan el esquema.
  - viv_test vuelve a esperar su texto original (interruptor «L y ↓» en modo libre). viv_practicas_e2e comprueba las dos variantes:
    práctica 2 L/1 con esquema, proyecto 1 L/↓ sin esquema, práctica 7 E1/E2/S1/S2, proyecto 5 cruzamiento 1–4.
  - Pruebas: viv_modelo_test 16/16, viv_practicas_test 13/13, viv_tubos_test OK, viv_practicas_e2e OK (con las 4 comprobaciones nuevas), viv_emoji_e2e OK, viv_test 94/94, circ_test 77/77.
  - Capturas: g_interruptor_p1-montar_detras.png (SA1/proyecto, L y ↓), g_interruptor_vp2_detras.png, g_cruzamiento_vp7_detras.png.
- Bloque H (t165u) — EN CURSO: las 7 prácticas de vivienda con la MISMA estructura que Circuitos 3D.
  - Estructura de Circuitos 3D (estudiada en src/circ/lab.js, guiadas.js, evaluaciones.js y portal/panel.js):
    1. Portada (homeHTML): hero con «Empezar por la práctica N» y «Modo libre»; pestañas `cx-htabs` «Prácticas guiadas» |
       «Evaluación de circuitos» (#eee/circuitos/evaluacion); barra de grupo del profesor (`cx-gbar`, «Candados para el grupo»);
       tarjetas `cx-card` por temas (nº, icono, insignia, candado, título, subtítulo, meta nivel/duración/RA); «Por tu cuenta»
       (modo libre, averías) y «Cómo se usa».
    2. Guiada (guideHTML): cabecera con nº, título, nivel y duración; barra de progreso «n / total pasos»; desplegables
       «Objetivo y teoría», «Esquema eléctrico», «Material», «Resultados de aprendizaje»; pasos en orden (hecho / actual / por hacer)
       y solo el actual explica qué hacer y dónde; «Comprobar circuito» y «Ver solución»; caja «Práctica autónoma»; preguntas;
       reto; entrega.
    3. Autónoma (aN): se abre al completar la guiada (el alumno no entra antes: aviso y vuelta a la guiada); sin pasos ni pistas,
       con enunciado, esquema y material; se corrige con las mismas comprobaciones.
    4. Insignias de dos niveles: «Guiada completada» y «Autónoma completada | pendiente» (en la tarjeta y en la guía).
    5. Candados por grupo: token en `apartados` del grupo y del código («guiadas:c1,c2», niveles «evaluacion:n1»); tarjeta
       `locked` con desenfoque y sin enlace para el alumno; el profesor ve el botón candado en cada tarjeta y elige el grupo;
       entrar por enlace a una cerrada → aviso y vuelta a la portada. Panel → Grupos → «Prácticas guiadas» hace lo mismo.
    6. Registro: progreso local por usuario (almacen.js: clave con el ámbito del usuario y migración de lo antiguo) y entrega
       automática a Firestore al superar «Comprobar» (una entrega por práctica: cN guiada, aN autónoma, nN evaluación);
       Panel → Grupos → «Progreso en Circuitos»: tabla nº de lista × práctica con dos puntos (guiada, autónoma) y totales.
    7. «Evaluación de circuitos»: niveles N1…N5, cerrados hasta que el profesor los abre; cada nivel tiene varios circuitos sin
       pasos ni pistas; «Enviar» corrige, da la nota (media de requisitos, 0–10) y la entrega (nN) con la nota propuesta.
    8. Entregas y cuaderno: Panel → Entregas (filtro por práctica, «Ver el montaje», nota y comentario); cada id de entrega es
       una columna de laboratorio en el cuaderno del grupo (aula-panel.js).
  - Plan para vivienda (sin cambiar las reglas: la regex de `practica` ya admite v1–v9):
    portada con las mismas pestañas y tarjetas cx-card; guía con los mismos desplegables (teoría REBT, esquema, material, norma)
    y pasos con su «por qué»; autónoma tras la guiada; candados con el token «vivienda:» ya existente y «vivev:» para los niveles;
    registro por usuario + entrega automática del registro «v6» (ya existente, compatible) al completar; «Progreso en Vivienda»
    en el panel leyendo «v6»; «Evaluación de vivienda» con 3 niveles entregados como v7, v8 y v9.
  - H1 — HECHO (caché v5-20261122g): portada de vivienda con la estructura de Circuitos: hero con «Empezar por la práctica N» y
    «Modo libre», pestañas «Prácticas guiadas | Evaluación de vivienda», barra «Candados para el grupo», tarjetas cx-card por
    temas (nº, icono Lucide, insignia, candado, meta) con insignias «Guiada completada · Autónoma completada/pendiente»; debajo
    «Por tu cuenta» con los proyectos antiguos, la SA1, el modo libre, el taller, la casa y las averías (sin tocar). Registro: la
    entrega «v6» se envía SOLA al completar una guiada o una autónoma (como Circuitos), con «Tu registro» y «Enviar ahora».
    Pruebas: viv_practicas_e2e (con pestañas, temas e insignias), viv_emoji_e2e, viv_test 94/94.
    (La guía nueva y la evaluación aún no están construidas en este commit; el código de la guía está en src, sin publicar.)

### H2 — Guía de cada práctica como la de Circuitos (caché v5-20261122h)
- Guía en panel cx-panel: cabecera, barra «n / total pasos», desplegables «Objetivo y teoría» (REBT), «Esquema de montaje», «Material», «Normativa»; pasos en orden con su «Por qué» y «Te falta»; «Hazlo por mí»; comprobar; caja de la autónoma; 2 preguntas con explicación; reto; registro.
- Autónoma: enunciado, plano de piezas, material, comprobar y registro (sin pasos ni pistas).
- Módulo puro de evaluación (src/viv/evaluacion.js: niveles ve1–ve3 → entregas v7–v9) y candados 'vivev:' en circ/guiadas.js (cerrados por defecto), con viv_eval_test (4/4). Sin cambio de reglas.
- Pruebas: viv_modelo 16/16, viv_practicas 13/13, viv_eval 4/4, viv_practicas_e2e TODO OK (con comprobaciones nuevas de la guía), viv_emoji_e2e OK, viv_test 94/94.
- Falta: interfaz de la evaluación (H3), «Progreso en Vivienda» en el panel, almacenamiento por usuario, capturas h_*.

### H3 — Evaluación de vivienda, candados y «Progreso en Vivienda» (caché v5-20261122i)
- Pestaña «Evaluación de vivienda»: 3 niveles en tarjetas cx-evcard (N1 Puntos de luz, N2 Schuko y caja de registro, N3 Cuadro y avería) con candado del profesor (token 'vivev:', cerrados por defecto, igual que Circuitos) y nota en la tarjeta.
- Prueba (src/viv/evallab.js): pestaña «Prueba» con los montajes del nivel, enunciado y plano de piezas, sin pasos, sin «Hazlo por mí» y sin solución para el alumno; un solo envío que corrige todo. Entrega v7/v8/v9 con comprobacion.nota (las reglas actuales ya lo admiten).
- Nota de cada montaje: 0 si no funciona; si funciona, 10 − 2,5 por requisito del REBT incumplido (−5 en la avería). Entregar sin hacer nada = 0.
- Panel → Grupos: botón «Progreso en Vivienda» (guiada/autónoma de las 7 prácticas por nº de lista a partir del registro v6, más N1–N3); en «Prácticas guiadas», casillas para las prácticas y los niveles de vivienda; editar un grupo conserva los candados de vivienda; títulos de v6–v9 en Entregas.
- Arreglo: el botón «Enviar ahora» del registro en la portada no hacía nada.
- Pruebas: viv_eval 5/5, viv_practicas_e2e TODO OK (con evaluación, candados de nivel, entrega v8 y registro v6), viv_emoji OK, viv_test 94/94.
- Falta: almacenamiento por usuario en el mismo navegador, captura de la tabla del profesor (necesita Firebase), circ_test completo.

### H4 — Avance de vivienda por usuario (caché v5-20261122j)
- src/viv/almacen.js, como circ/almacen.js: «pr:…» (montajes, guiadas, autónomas, respuestas) y «evres:…» (pruebas enviadas) se guardan por identidad (PORTAL.ambito()) en el navegador. SA1, proyectos, modo libre y preferencias no cambian de sitio.
- Migración compatible: los datos sin ámbito se los queda, una vez, el primero que abre el laboratorio en ese navegador. Lo enviado al profesor (v6–v9) está en Firestore y no se toca.
- Pruebas: viv_eval 6/6 (con la migración), viv_practicas_e2e, viv_emoji, viv_test 94/94, circ_test 77/77.
- Bloque H terminado salvo: captura de la tabla «Progreso en Vivienda» (necesita sesión de profesor con Firebase) y una prueba e2e del panel con el emulador.

## Encargo t167u (22/11/2026) · reloj, «Probar como alumno», imágenes y «colores» — retomado el 24/11/2026
Punto de partida: main 7e709a9 (con lo de Claude: c3c284b imagen de `zonas` en «Ver preguntas y soluciones» con la zona
correcta en verde, las demás en gris y la solución debajo; 49215db tablas de condensador e inductor; SVG de img/eee/test).
Nada de lo de Claude se toca (ni preguntas, ni SVG, ni entregas). Todos los campos nuevos son opcionales.

### Bloques 1 y 2 — HECHO (caché v5-20261124a)
- Bloque 1 · reloj: src/portal/reloj-examen.js (nuevo). Fijo arriba de la pantalla (colgado del <body>, visible al bajar y a
  pantalla completa), 28 px, icono Lucide «timer», barra del tiempo que queda; gris #506C88 normal, ámbar a 5 min, rojo
  #DE0714 con parpadeo suave a 1 min (sin animación si el sistema pide menos movimiento); avisos «Te quedan 5 minutos» /
  «Te queda 1 minuto» que se cierran solos (sin alert). Portada: «Tienes N minutos desde que pulses Empezar» (o «Sin
  límite de tiempo · hasta que cierre: fecha»). Sin límite → cuenta hasta el cierre («hasta que cierre»).
  aula-vistas.js: abrirExamen/tic/entregarExamen usan el reloj nuevo; se quita al entregar, al salir o al cambiar de página.
  El texto accesible sigue siendo «Tiempo restante: mm:ss». Nada cambia en lo que se guarda.
- Bloque 2 · «Probar como alumno» (botón en el examen del profesor): su versión barajada, el reloj (limiteMin real; sin
  límite → hasta el cierre o 30 min simulados), imágenes y corrección al final con cada pregunta marcada y la solución.
  SOLO LEE examenes/{id} y claves/{id}: no escribe nada ni cuenta como entrega (comprobado en e2e contando /trabajos).
  La marca de corrección se ha sacado a examen-ui.js (marcarCorreccion) y la usa también la actividad interactiva
  (mismo HTML que antes). Lo de `zonas` en «Ver preguntas y soluciones» ya lo había hecho Claude (imagen, zonas y texto de
  la solución debajo): no se ha tocado.
- Pruebas: aula_e2e 126/126 (antes 120; 6 nuevas: portada con minutos, reloj fijo al bajar, reloj fuera al entregar,
  «Probar como alumno» con reloj, nota y marcas, y que no escribe en Firestore); examen_v5, importador_v5, notas_v5,
  banco_v5, plataforma, aula_modelo OK. Sin reglas nuevas.
- Capturas: /workspace/capturas-colores/b1_*.png y las de la e2e (aula_alumno_examen*.png, aula_profesor_probar.png).

### Bloque 3 · imágenes en todas las preguntas — HECHO (caché v5-20261124b)
- Campo opcional `imagen` (+ `alt`) en cualquier tipo (en `zonas` sigue siendo la imagen de las zonas, como lo dejó Claude).
  Opciones de test, parejas/distractores de emparejar y elementos de clasificar aceptan texto o `{ "texto", "imagen", "alt" }`.
  Rutas válidas: https://…, materiales/…, img/… (error en castellano si no).
- Alumno (examen-ui.js): imagen sobre el enunciado; opciones con imagen en tarjetas (2 columnas en móvil, 4 en escritorio);
  emparejar con galería «A · B · C»; chips con miniatura. Botón lupa (zoom-in) → visor a pantalla completa
  (src/portal/visor-img.js: pellizcar, arrastrar, doble toque, rueda, +/−, Esc). En `zonas` la imagen ocupa todo el ancho
  (hasta 800 px) y la lupa está fuera de la imagen, así que tocar sigue marcando.
- Profesor: campo «Imagen encima del enunciado» en el editor; vista previa con imagen y miniaturas. Emparejar/clasificar
  con imágenes se cargan por JSON (el editor lo avisa y no las pisa). Exportar ZIP y evidencias escriben «texto [imagen: ruta]».
- Compatibilidad: las preguntas sin imagen se validan, separan, corrigen y pintan IGUAL que antes (imagenes_test.mjs compara
  con preguntas.js de 7e709a9 con 12 preguntas tipo «Test Temas 5 y 6», y el HTML de preguntaHTML sale idéntico).
- Pruebas: imagenes_test 3/3, aula_e2e 126/126, examen_v5, importador_v5, notas_v5, banco_v5, plataforma, aula_modelo,
  circ_test 77/77. Formato en FORMATO_IMPORTAR.md («Imágenes en todas las preguntas»). Sin reglas nuevas.
- Capturas: /workspace/capturas-colores/b3_*.png.

### Bloque 4 · código de colores — HECHO (caché v5-20261124c)
- src/lms/colores.js: tablas exactas del encargo (resistencias de 4 y 5 bandas, condensadores con tensión, inductores
  en µH), cálculo, validación en castellano, aleatorios con semilla y corrección. src/portal/colores-ui.js: dibujos
  propios (resistencia beige, bobina verde, condensador), tabla al lado que se ilumina (fila del color + columna de la
  banda) al pasar el dedo o el ratón, paleta para pintar, marcas de corrección y solución en la tabla.
- Tipo de pregunta nuevo `colores` (examen, interactiva): «leer» (valor + unidad + tolerancia [+ tensión], nota parcial
  por partes, 4,7 kΩ = 4700 Ω) y «pintar» (cuenta cada banda; cualquier combinación equivalente vale entera).
- Interactiva con atajo `"colores": { "modo", "componentes", "aleatorio": n, "clases" }`: los fijos y, además, n al
  azar de cada clase en cada intento (mismos si se recarga). Errores con ruta en castellano.
- Circuitos 3D: tarjeta «Código de colores» en «Por tu cuenta» → #eee/circuitos/colores, práctica libre al azar, sin nota
  y sin guardar nada.
- Borrador: src/lms/semilla/colores_repaso_borrador.json (14 componentes: R1–R9, C1–C3, L1–L2, bandas leídas de los SVG
  de Claude img/eee/test/eee_rep_*.svg). No se ha cargado en Firestore ni publicado: se importa a mano sin publicar.
  No están R10–R13 (el PDF de clase no está en la caja).
- Ojo: en los SVG de Claude (eee_rep_r*) los multiplicadores Violeta, Gris y Blanco salen «—»; el encargo t167u da
  ×10 000 000, ×100 000 000 y ×1 000 000 000 y es lo que usa el motor. Los SVG no se han tocado.
- Compatibilidad: nada existente cambia; campos nuevos opcionales; sin migraciones; sin reglas nuevas.
- Pruebas: colores_test 6/6, imagenes_test 3/3 (corrección idéntica a 7e709a9), plataforma 41/41 y el resto de *_v5,
  aula_e2e, circ_test, viv_test. Capturas: /workspace/capturas-colores/b4_*.png.

## 24-25/11/2026 · Cabecera y márgenes + revisión del examen de cada alumno (t171u)

### Encabezado que no sigue al cuerpo — causa y arreglo (caché v5-20261124d)
- Causa: las pantallas (`.screen`) hacen scroll por sí mismas y la cabecera pegajosa mide lo que la ventana. Si el cuerpo era más
  ancho (tabla sin contenedor o rejilla `1fr` que no encoge, p. ej. «Entregas del laboratorio» y «Usuarios y conectados» en 390 px:
  480 y 641 px), la pantalla se deslizaba hacia los lados y la cabecera se quedaba atrás (medido: cabecera en x = −90 y −251).
- Arreglo (css/plataforma.css, src/portal/tablas-scroll.js): rejillas `minmax(0, 1fr)`; cada tabla ancha va dentro de
  `.tbl-scroll` (scroll propio, nunca ensancha la página); `.screen { overflow-x: hidden }` como red de seguridad; textos/URL
  largos se parten; las tiras deslizables del móvil se desvanecen en el borde. No cambia `a472df0`.
- Prueba: `e2e/barrido_layout.mjs` (se activa con `BARRIDO=<etiqueta>`; `BARRIDO_ESTRES=1` añade 24 actividades al cuaderno;
  lanzador `e2e/run_barrido.sh`) recorre 1280/1024/768/390, profesor y alumno, y comprueba scrollWidth, intento de scroll lateral y
  cabecera 0..ancho. Capturas en /workspace/capturas-encabezado (antes_* / despues_*).
- Nota: `margenes_e2e` ya fallaba en c42fa46 («examen 390/430: el menú de la cabecera queda tapado por svg») por el reloj fijo del
  bloque 2; no es de este cambio.

### Revisión del examen de cada alumno (solo lectura)
- Ya existía: Panel → Cuaderno → casilla del alumno → «Respuestas» (cada pregunta, su respuesta, solución y puntos).
- Nuevo: botón «Ver el examen completo (solo lectura)» (src/portal/revision-examen.js): el examen entero como lo contestó, con
  imágenes ampliables, `zonas` (marca del alumno + zona correcta), `colores` (corrección por partes), marcas y nota. No escribe nada.
- Entregas antiguas (sin campos nuevos) y exámenes empezados se abren igual; lo no contestado sale «sin responder».
- Prueba: `e2e/plataforma_f15.mjs` (también comprueba que no cambia el nº de documentos). Sin reglas nuevas, sin migraciones.

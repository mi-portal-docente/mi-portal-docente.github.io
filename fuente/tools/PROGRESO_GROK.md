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

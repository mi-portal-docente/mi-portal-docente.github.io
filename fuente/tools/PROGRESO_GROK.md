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

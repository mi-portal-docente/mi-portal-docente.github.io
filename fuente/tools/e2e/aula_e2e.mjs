// E2E del AULA VIRTUAL con los emuladores (Auth + Firestore): el profesor crea el curso escolar,
// los grupos, copia contenido de la biblioteca, crea un examen; el alumno entra con nº + PIN,
// entrega una tarea y hace el examen; el profesor corrige y publica; el alumno ve sus notas
// desde otro navegador con su PIN. Se lanza desde e2e/ejecutar.sh (después de fb_e2e.mjs).
import { chromium } from 'playwright-core';
import { readFileSync } from 'fs';
import { SHOTS } from '../rutas.mjs';

const BASE = process.env.PORTAL_BASE || 'http://127.0.0.1:8765/index.html';
const PROJ = 'demo-portal';
const CFG = `window.PORTAL_FIREBASE={apiKey:'demo-key',authDomain:'${PROJ}.firebaseapp.com',projectId:'${PROJ}',appId:'1:1:web:1'};window.PORTAL_FIREBASE_EMU={auth:'http://127.0.0.1:9099',firestoreHost:'127.0.0.1',firestorePort:8080};`;
const results = [];
const PROMPT = []; // respuestas para los prompt() (nombre de tema, título…)
const ok = (name, cond, info = '') => { results.push({ name, ok: !!cond, info }); console.log((cond ? 'OK  ' : 'FAIL') + ' ' + name + (info ? ' · ' + info : '')); };
const errores = [];
const benigno = (t) => /favicon|WebGL|GPU stall|swiftshader|GroupMarkerNotSet/i.test(t);
const REST = `http://127.0.0.1:8080/v1/projects/${PROJ}/databases/(default)/documents`;
const owner = { headers: { Authorization: 'Bearer owner' } };

await fetch(`http://127.0.0.1:8080/emulator/v1/projects/${PROJ}/databases/(default)/documents`, { method: 'DELETE' });
await fetch(`http://127.0.0.1:9099/emulator/v1/projects/${PROJ}/accounts`, { method: 'DELETE' });

const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
async function contexto(nombre, viewport = { width: 1440, height: 900 }) {
  const ctx = await b.newContext({ viewport, acceptDownloads: true });
  await ctx.route('**/js/firebase-config.js*', r => r.fulfill({ contentType: 'application/javascript', body: CFG }));
  const pg = await ctx.newPage();
  pg.on('console', m => { if (m.type() === 'error' && !benigno(m.text())) errores.push(`[${nombre}] console: ${m.text()}`); });
  pg.on('pageerror', e => errores.push(`[${nombre}] pageerror: ${e.message}`));
  pg.on('dialog', d => d.type() === 'prompt' ? d.accept(PROMPT.shift() ?? d.defaultValue()) : d.accept());
  return { ctx, pg };
}
const gateListo = (pg) => pg.waitForSelector('#gate-body:not([hidden])', { timeout: 20000 });
async function loginGoogle(pg, email) {
  await gateListo(pg); await pg.click('[data-gate-rol="profesor"]');
  const [pop] = await Promise.all([pg.waitForEvent('popup'), pg.click('#gate-google')]);
  await pop.waitForLoadState();
  const existe = pop.locator(`text=${email}`);
  if (await existe.count()) await existe.first().click();
  else { await pop.click('text=Add new account'); await pop.fill('#email-input', email); await pop.fill('#display-name-input', 'Profe'); await pop.click('#sign-in'); }
}
async function loginAlumno(pg, codigo, numero, pin) {
  await gateListo(pg);
  await pg.fill('#gate-code', codigo); await pg.selectOption('#gate-num', String(numero)); await pg.fill('#gate-pin', pin);
  await pg.click('#gate-alumno .gate-go');
}
const local = (ms) => { const d = new Date(ms); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16); };

try {
// ================================================================ 1. profesor: curso escolar
const P = await contexto('profesor');
await P.pg.goto(BASE);
await loginGoogle(P.pg, 'profe@test.es');
await P.pg.waitForSelector('#pnGrupoForm', { timeout: 30000 });
await P.pg.goto(BASE + '#panel/cursos');
await P.pg.waitForSelector('#apCursoForm');
ok('curso escolar sugerido según la fecha (2026/27)', (await P.pg.inputValue('#apCursoForm [name=nombre]')) === '2026/27');
await P.pg.check('#apCursoForm [name=asig][value=tic1]');
await P.pg.check('#apCursoForm [name=asig][value=eee]');
await P.pg.click('#apCursoForm button[type=submit]');
await P.pg.waitForSelector('.pn-grupo[data-curso] h3:has-text("2026/27")', { timeout: 15000 });
ok('crear el curso escolar 2026/27 con T.I.Cs 1º Bach y EEE', /Curso activo/.test(await P.pg.textContent('.pn-grupo[data-curso]')));
await P.pg.screenshot({ path: SHOTS + 'aula_cursos.png' });

// ================================================================ 2. grupos del curso
async function crearGrupo(nombre, asigs) {
  await P.pg.goto(BASE + '#panel/grupos');
  await P.pg.waitForFunction(() => document.querySelector('#pnGrupoForm [name=curso]')?.selectedOptions[0]?.textContent.includes('2026/27'), null, { timeout: 15000 });
  await P.pg.fill('#pnGrupoForm [name=nombre]', nombre);
  await P.pg.fill('#pnGrupoForm [name=alumnos]', '12');
  for (const cb of await P.pg.$$('#pnGrupoForm [name=asig]')) { const v = await cb.getAttribute('value'); if (asigs.includes(v) !== await cb.isChecked()) await cb.click(); }
  await P.pg.click('#pnGrupoForm button[type=submit]');
  await P.pg.waitForFunction(() => /creado/.test(document.querySelector('#pnFormMsg')?.textContent || ''), null, { timeout: 15000 });
  return P.pg.evaluate((n) => { const g = [...document.querySelectorAll('.pn-grupo')].find(x => x.querySelector('h3').textContent === n); return { codigo: g.querySelector('.pn-code').textContent, id: g.dataset.grupo }; }, nombre);
}
const ofrecidas = await (async () => { await P.pg.goto(BASE + '#panel/grupos'); await P.pg.waitForFunction(() => document.querySelector('#pnGrupoForm [name=curso]')?.selectedOptions[0]?.textContent.includes('2026/27'), null, { timeout: 15000 }); return P.pg.$$eval('#pnGrupoForm [name=asig]', l => l.map(x => x.value).join()); })();
ok('el formulario de grupo solo ofrece las asignaturas del curso escolar', ofrecidas === 'tic1,eee' || ofrecidas === 'eee,tic1', ofrecidas);
const GA = await crearGrupo('1º Bach A', ['tic1']);
const GE = await crearGrupo('2º CFGB', ['eee']);
ok('grupos creados con su código', /^[A-Z]+-\d{3}$/.test(GA.codigo) && /^[A-Z]+-\d{3}$/.test(GE.codigo), `${GA.codigo} / ${GE.codigo}`);
const gdoc = await (await fetch(`${REST}/grupos/${GA.id}`, owner)).json();
ok('el grupo guarda curso escolar y nº de alumnos', gdoc.fields?.curso?.stringValue && gdoc.fields?.alumnos?.integerValue === '12');

// ================================================================ 3. Trabajo de clase (como Classroom)
// encabezado: Biblioteca y Panel fuera de las tarjetas de asignaturas
await P.pg.goto(BASE + '#asignaturas');
await P.pg.waitForSelector('#subjects .bib-card');
ok('encabezado del profesor: «Biblioteca de asignaturas» y «Panel del profesor»', (await P.pg.$$('#subjects .top-nav a[href="#biblioteca"], #subjects .top-nav a[href="#panel"]')).length === 2);
ok('la pantalla de asignaturas solo tiene asignaturas (2), sin Biblioteca ni Panel', (await P.pg.$$('#subjects .bib-card')).length === 2 && !/Biblioteca|Panel/.test(await P.pg.textContent('#subjects .subj-grid')));
await P.pg.screenshot({ path: SHOTS + 'portal_encabezado.png' });

await P.pg.goto(BASE + '#asig/tic1');
await P.pg.waitForSelector('#asOrg .org, #asOrg .au-vacio, #asOrg .cl-vacio', { timeout: 20000 });
const tabsProf = await P.pg.$$eval('#asig .as-tabs [role=tab]', (l) => l.map((x) => x.textContent.trim().replace(/^\S+\s/, '')));
ok('asignatura: una sola barra de pestañas (Organización · Trabajo de clase · Tablón del alumno · Laboratorio · Actividades de clase)', tabsProf.join('|') === 'Organización|Trabajo de clase|Tablón del alumno|Laboratorio|Actividades de clase', tabsProf.join('|'));
ok('profesor: la pestaña por defecto es «Organización» (#asig/tic1/organizacion) y el programa está dentro, plegado', (await P.pg.evaluate(() => location.hash)) === '#asig/tic1/organizacion' && !!(await P.pg.$('#asig .bib-prog:not([open])')) && (await P.pg.getAttribute('#tab-organizacion', 'aria-selected')) === 'true');
await P.pg.goto(BASE + '#asig/tic1/trabajo');
await P.pg.waitForSelector('#asTrabajo [data-cl=crear]', { timeout: 20000 });
ok('enlace directo #asig/tic1/trabajo abre «Trabajo de clase» (pestaña activa, sin barra interna antigua)', (await P.pg.getAttribute('#tab-trabajo', 'aria-selected')) === 'true' && !(await P.pg.$('#asig .cl-tabs, #asig .cl-h')));
PROMPT.push('SdA 1. Mi Primer Dossier Académico');
await P.pg.click('#asTrabajo [data-cl=crear]');
await P.pg.click('#asTrabajo [data-cl=nuevoTema]');
await P.pg.waitForSelector('#asTrabajo .cl-th h3:has-text("SdA 1. Mi Primer Dossier")', { timeout: 15000 });
ok('＋ Crear → Tema', true);
const TEMA1 = await P.pg.getAttribute('#asTrabajo .cl-tema:has(h3:has-text("SdA 1."))', 'data-tema');
await P.pg.click(`#asTrabajo [data-cl=filtro][data-tema="${TEMA1}"]`);
await P.pg.click('#asTrabajo [data-cl=crear]');
await P.pg.click('#asTrabajo [data-cl=nuevo][data-tipo=tarea]');
await P.pg.waitForSelector('#apItemForm');
ok('el tema filtrado viene elegido en el editor', (await P.pg.inputValue('#apItemForm [name=tema]')) === TEMA1);
ok('el grupo del curso viene marcado por defecto', await P.pg.isChecked(`#apItemForm [name=grupos][value="${GA.id}"]`));
await P.pg.fill('#apItemForm [name=titulo]', 'Desafío 1 (Documentos de Google)');
await P.pg.fill('#apItemForm [name=texto]', 'Crea un documento con **portada**, índice automático y dos secciones.\nEntrega el enlace compartido.');
await P.pg.fill('#apItemForm [name=adjT]', 'Guía de estilos'); await P.pg.fill('#apItemForm [name=adjU]', 'https://docs.google.com/document/d/guia');
await P.pg.click('#apItemForm [data-ed=adj]');
await P.pg.fill('#apItemForm [name=rubrica]', 'Portada e índice | 4\nFormato y estilos | 6');
await P.pg.fill('#apItemForm [name=fechaEntrega]', local(Date.now() + 3 * 864e5));
await P.pg.fill('#apItemForm [name=puntos]', '10');
await P.pg.check('#apItemForm [name=estado][value=publicar]');
await P.pg.screenshot({ path: SHOTS + 'clase_editor_tarea.png' });
await P.pg.click('#apItemForm button[type=submit]');
await P.pg.waitForSelector('#asTrabajo .cl-it.pub:has-text("Desafío 1 (Documentos")', { timeout: 15000 });
ok('crear y publicar una tarea con instrucciones, adjunto, fecha, puntos y rúbrica', /Publicado/.test(await P.pg.textContent('#asTrabajo .cl-it:has-text("Desafío 1 (Documentos")')));
const ID_T = await P.pg.getAttribute('#asTrabajo .cl-it:has-text("Desafío 1 (Documentos")', 'data-item');
const docT = await (await fetch(`${REST}/items/${ID_T}`, owner)).json();
ok('la tarea guarda tema, puntos y adjunto', docT.fields?.tema?.stringValue === TEMA1 && docT.fields?.puntos?.integerValue === '10' && /guia/.test(JSON.stringify(docT.fields?.enlaces)));

// examen («Tarea de cuestionario»)
await P.pg.click('#asTrabajo [data-cl=crear]');
await P.pg.waitForSelector('#asTrabajo .cl-crear-m');
ok('menú ＋ Crear: Tarea, Tarea de cuestionario, Pregunta, Material, Reutilizar publicación, Tema', /Tarea.*Tarea de cuestionario.*Pregunta.*Material.*Reutilizar publicación.*Tema/s.test(await P.pg.textContent('#asTrabajo .cl-crear-m')));
await P.pg.screenshot({ path: SHOTS + 'clase_menu_crear.png' });
await P.pg.click('#asTrabajo [data-cl=nuevo][data-tipo=examen]');
await P.pg.waitForSelector('#apItemForm [name=desde]');
await P.pg.fill('#apItemForm [name=titulo]', 'Cuestionario: hoja de cálculo');
await P.pg.fill('#apItemForm [name=desde]', local(Date.now() - 10 * 60e3));
await P.pg.fill('#apItemForm [name=hasta]', local(Date.now() + 3600e3));
await P.pg.fill('#apItemForm [name=limiteMin]', '20');
await P.pg.click('[data-ed="q+test"]');
await P.pg.fill('.ap-q[data-qi="0"] [data-qf=enunciado]', '¿Qué función suma un rango de celdas?');
const ops = ['=PROMEDIO()', '=SUMA()', '=CONTAR()'];
for (let j = 0; j < 3; j++) await P.pg.fill(`.ap-q[data-qi="0"] [data-qf=op][data-j="${j}"]`, ops[j]);
await P.pg.check('.ap-q[data-qi="0"] [data-qf=correcta][value="1"]');
await P.pg.click('[data-ed="q+vf"]');
await P.pg.fill('.ap-q[data-qi="1"] [data-qf=enunciado]', 'Una celda se nombra con número de fila y después letra de columna.');
await P.pg.selectOption('.ap-q[data-qi="1"] [data-qf=correcta]', 'false');
await P.pg.click('[data-ed="q+corta"]');
await P.pg.fill('.ap-q[data-qi="2"] [data-qf=enunciado]', '¿Cómo se llama la intersección de una fila y una columna?');
await P.pg.fill('.ap-q[data-qi="2"] [data-qf=aceptadas]', 'celda\nla celda');
await P.pg.fill('.ap-q[data-qi="2"] [data-qf=puntos]', '2');
await P.pg.check('#apItemForm [name=estado][value=publicar]');
ok('las preguntas siguen escritas tras añadir otras (editor)', (await P.pg.inputValue('.ap-q[data-qi="0"] [data-qf=enunciado]')).startsWith('¿Qué función'));
await P.pg.screenshot({ path: SHOTS + 'aula_panel_examen.png' });
await P.pg.click('#apItemForm button[type=submit]');
await P.pg.waitForSelector('#asTrabajo .cl-it.pub:has-text("Cuestionario: hoja de cálculo")', { timeout: 15000 });
ok('crear y publicar una tarea de cuestionario (test, V/F y respuesta corta)', true);
const ID_E = await P.pg.getAttribute('#asTrabajo .cl-it:has-text("Cuestionario: hoja")', 'data-item');
const itemE = JSON.stringify(await (await fetch(`${REST}/items/${ID_E}`, owner)).json());
const exE = JSON.stringify(await (await fetch(`${REST}/examenes/${ID_E}`, owner)).json());
const clE = await (await fetch(`${REST}/claves/${ID_E}`, owner)).json();
ok('soluciones guardadas aparte (claves) y no en items/examenes', !!clE.fields?.respuestas && !/correcta|respuestas|"celda"/.test(itemE + exE.replace(/intersección/g, '')), Object.keys(clE.fields?.respuestas?.mapValue?.fields || {}).join());
// borrador: no lo ve el alumno
await P.pg.click('#asTrabajo [data-cl=crear]');
await P.pg.click('#asTrabajo [data-cl=nuevo][data-tipo=material]');
await P.pg.waitForSelector('#apItemForm');
await P.pg.fill('#apItemForm [name=titulo]', 'Material en preparación');
await P.pg.check('#apItemForm [name=estado][value=borrador]');
await P.pg.click('#apItemForm button[type=submit]');
await P.pg.waitForSelector('#asTrabajo .cl-it.borr:has-text("Material en preparación") .cl-est.e-borr', { timeout: 15000 });
ok('guardar un material como borrador (marcado «Borrador»)', true);
await P.pg.click('#asTrabajo [data-cl=filtro][data-tema=""]');

// ================================================================ 3b. EEE: importar de Classroom, borradores, arrastrar
await P.pg.goto(BASE + '#eee');
await P.pg.waitForFunction(() => location.hash === '#asig/eee/organizacion');
ok('#eee (enlace antiguo) → página única de EEE', true);
await P.pg.goto(BASE + '#asig/eee/trabajo');
await P.pg.waitForSelector('#asTrabajo [data-cl=importar]', { timeout: 20000 });
await P.pg.click('#asTrabajo [data-cl=importar]');
await P.pg.waitForSelector('.cl-modal [data-m=importar]');
await P.pg.click('.cl-modal [data-m=importar]');
await P.pg.waitForFunction(() => /✔/.test(document.querySelector('#clImpMsg')?.textContent || ''), null, { timeout: 30000 });
const impMsg = await P.pg.textContent('#clImpMsg');
ok('importar EEE de Classroom: 8 temas y 61 elementos', /8 temas y 61 elementos/.test(impMsg), impMsg);
await P.pg.click('.cl-modal [data-m=cerrar]');
await P.pg.waitForFunction(() => document.querySelectorAll('#asTrabajo .cl-it').length >= 61, null, { timeout: 20000 });
const temasEEE = await P.pg.$$eval('#asTrabajo .cl-tema:not(.cl-sin) .cl-th h3', (l) => l.map((x) => x.textContent));
ok('mismos temas y orden que en Classroom', temasEEE[0] === 'Evaluación Inicial' && temasEEE[1].startsWith('SA 1- B1') && temasEEE[7] === 'RECUPERACIÓN POR BLOQUES', temasEEE.join(' | '));
const nBorr = (await P.pg.$$('#asTrabajo .cl-it.borr')).length;
ok('los 45 borradores de Classroom siguen en borrador', nBorr === 45, String(nBorr));
ok('aviso «Pendiente de completar» (solo profesor) en lo que no tiene detalle', (await P.pg.$$('#asTrabajo .cl-pend')).length > 0);
const ej3 = '#asTrabajo .cl-it:has-text("Ejercicio 3 PREPARAMOS")';
ok('Ejercicio 3 del tablero: con el PDF alojado en el portal', /materiales\/eee\/sa1\/SA1_Trabajo3/.test(JSON.stringify(await (await fetch(`${REST}/items/${await P.pg.getAttribute(ej3, 'data-item')}`, owner)).json())));
// importar otra vez no duplica
await P.pg.click('#asTrabajo [data-cl=importar]');
await P.pg.click('.cl-modal [data-m=importar]');
await P.pg.waitForFunction(() => /✔/.test(document.querySelector('#clImpMsg')?.textContent || ''), null, { timeout: 30000 });
ok('importar dos veces no duplica', /0 temas y 0 elementos/.test(await P.pg.textContent('#clImpMsg')));
await P.pg.click('.cl-modal [data-m=cerrar]');
// arrastrar un elemento a otro tema (con captura a mitad del arrastre)
const temaB2 = await P.pg.getAttribute('#asTrabajo .cl-tema:has(.cl-th h3:text-is("BLOQUE 2. Conmutación y componentes."))', 'data-tema');
const ref = '#asTrabajo .cl-it:has-text("Tablero eléctrico: imagen de referencia")';
const ID_REF = await P.pg.getAttribute(ref, 'data-item');
const primeroB2 = `#asTrabajo .cl-tema[data-tema="${temaB2}"] .cl-it >> nth=0`;
await P.pg.locator(primeroB2).scrollIntoViewIfNeeded();
await P.pg.evaluate(() => window.scrollBy(0, -260));
await P.pg.locator(ref).scrollIntoViewIfNeeded();
const sb = await P.pg.locator(`${ref} .cl-grip`).boundingBox();
await P.pg.mouse.move(sb.x + 4, sb.y + 6); await P.pg.mouse.down();
const tb = await P.pg.locator(primeroB2).boundingBox();
await P.pg.mouse.move(tb.x + 80, tb.y + 6, { steps: 12 });
await P.pg.waitForTimeout(150);
await P.pg.screenshot({ path: SHOTS + 'clase_trabajo_arrastrar.png' });
await P.pg.mouse.up();
await P.pg.waitForTimeout(800);
let dref = await (await fetch(`${REST}/items/${ID_REF}`, owner)).json();
if (dref.fields?.tema?.stringValue !== temaB2) { // respaldo: dragAndDrop de Playwright
  await P.pg.dragAndDrop(`${ref}`, primeroB2, { targetPosition: { x: 40, y: 4 } }); await P.pg.waitForTimeout(800);
  dref = await (await fetch(`${REST}/items/${ID_REF}`, owner)).json();
}
ok('arrastrar un elemento a otro tema: se guarda el tema y queda el primero', dref.fields?.tema?.stringValue === temaB2 && (await P.pg.getAttribute(primeroB2, 'data-item')) === ID_REF);
// teclado: Alt+↓ lo baja una posición
await P.pg.focus(`#asTrabajo [data-item="${ID_REF}"]`); await P.pg.keyboard.press('Alt+ArrowDown'); await P.pg.waitForTimeout(600);
ok('alternativa de teclado (Alt+↓) mueve el elemento', (await P.pg.getAttribute(`#asTrabajo .cl-tema[data-tema="${temaB2}"] .cl-it >> nth=1`, 'data-item')) === ID_REF);
// mover a otro tema con el menú y arrastrar un tema
await P.pg.click(`#asTrabajo [data-item="${ID_REF}"] [data-cl=up]`); await P.pg.waitForTimeout(500);
const temaRec = await P.pg.getAttribute('#asTrabajo .cl-tema:has(.cl-th h3:text-is("RECUPERACIÓN POR BLOQUES"))', 'data-tema');
const temaEv = await P.pg.getAttribute('#asTrabajo .cl-tema:has(.cl-th h3:text-is("Evaluación Inicial"))', 'data-tema');
async function arrastrar(desde, hasta, dy = 4) {
  await P.pg.locator(desde).scrollIntoViewIfNeeded();
  const s0 = await P.pg.locator(desde).boundingBox();
  await P.pg.mouse.move(s0.x + 5, s0.y + s0.height / 2); await P.pg.mouse.down();
  await P.pg.mouse.move(s0.x + 15, s0.y + s0.height / 2 - 20, { steps: 4 });
  await P.pg.locator(hasta).scrollIntoViewIfNeeded().catch(() => {});
  const t1 = await P.pg.locator(hasta).boundingBox();
  await P.pg.mouse.move(t1.x + 60, t1.y + dy, { steps: 15 }); await P.pg.waitForTimeout(100);
  await P.pg.mouse.up(); await P.pg.waitForTimeout(800);
}
await arrastrar(`#asTrabajo [data-tema-h="${temaRec}"] .cl-grip`, `#asTrabajo [data-tema-h="${temaEv}"]`);
let t0 = await P.pg.$$eval('#asTrabajo .cl-tema:not(.cl-sin) .cl-th h3', (l) => l.map((x) => x.textContent));
ok('arrastrar un tema (RECUPERACIÓN arriba del todo)', t0[0] === 'RECUPERACIÓN POR BLOQUES', t0.slice(0, 2).join(' | '));
await P.pg.click(`#asTrabajo .cl-tema[data-tema="${temaRec}"] [data-cl=temaDown]`); await P.pg.waitForTimeout(600);
t0 = await P.pg.$$eval('#asTrabajo .cl-tema:not(.cl-sin) .cl-th h3', (l) => l.map((x) => x.textContent));
ok('botón ↓ del tema (alternativa al arrastre)', t0[1] === 'RECUPERACIÓN POR BLOQUES');
for (let k = 0; k < 6; k++) { await P.pg.click(`#asTrabajo .cl-tema[data-tema="${temaRec}"] [data-cl=temaDown]`); await P.pg.waitForTimeout(350); }
const tdoc = await (await fetch(`${REST}/temas/${temaRec}`, owner)).json();
ok('el orden de los temas se guarda', typeof (tdoc.fields?.orden?.doubleValue ?? tdoc.fields?.orden?.integerValue) !== 'undefined');
// renombrar un tema y un borrador, y publicar un borrador
PROMPT.push('Evaluación Inicial (prueba)');
await P.pg.click(`#asTrabajo .cl-tema[data-tema="${temaEv}"] [data-cl=temaRen]`);
await P.pg.waitForSelector('#asTrabajo .cl-th h3:text-is("Evaluación Inicial (prueba)")', { timeout: 10000 });
PROMPT.push('Evaluación Inicial');
await P.pg.click(`#asTrabajo .cl-tema[data-tema="${temaEv}"] [data-cl=temaRen]`);
await P.pg.waitForSelector('#asTrabajo .cl-th h3:text-is("Evaluación Inicial")', { timeout: 10000 });
ok('cambiar el nombre de un tema', true);
const borr1 = await P.pg.getAttribute('#asTrabajo .cl-it.borr >> nth=0', 'data-item');
const tBorr = (await P.pg.textContent(`#asTrabajo [data-item="${borr1}"] .cl-tx b`)).trim();
PROMPT.push(tBorr + ' (revisado)');
await P.pg.click(`#asTrabajo [data-item="${borr1}"] .cl-mas summary`);
await P.pg.click(`#asTrabajo [data-item="${borr1}"] [data-cl=renombrar]`);
await P.pg.waitForSelector(`#asTrabajo [data-item="${borr1}"]:has-text("(revisado)")`, { timeout: 10000 });
ok('cambiar el título de un borrador desde el menú ⋮', true);
// pregunta publicada en EEE
await P.pg.click('#asTrabajo [data-cl=crear]');
await P.pg.click('#asTrabajo [data-cl=nuevo][data-tipo=pregunta]');
await P.pg.waitForSelector('#apItemForm [name=opciones]');
await P.pg.fill('#apItemForm [name=titulo]', '¿Qué color tiene el conductor de tierra?');
await P.pg.fill('#apItemForm [name=opciones]', 'Azul\nAmarillo-verde\nMarrón');
await P.pg.selectOption('#apItemForm [name=tema]', temaEv);
await P.pg.check('#apItemForm [name=estado][value=publicar]');
await P.pg.click('#apItemForm button[type=submit]');
await P.pg.waitForSelector('#asTrabajo .cl-it.pub:has-text("conductor de tierra")', { timeout: 15000 });
ok('＋ Crear → Pregunta (con opciones) publicada', true);
// Tablón del alumno: anuncios + vista previa fiel de lo que ve el alumno
await P.pg.goto(BASE + '#asig/eee/tablon');
await P.pg.waitForSelector('#clAnuncio');
await P.pg.fill('#clAnuncio [name=texto]', 'Mañana traed el tablero y los destornilladores.');
await P.pg.click('#clAnuncio button[type=submit]');
await P.pg.waitForSelector('#asTrabajo [data-preview] .cl-post:has-text("destornilladores")', { timeout: 15000 });
ok('Tablón: publicar un anuncio para el grupo (aparece en la vista del alumno)', true);
await P.pg.click('[data-cl=verTab][data-v=trabajo]');
await P.pg.waitForSelector('#asTrabajo [data-preview] .cl-it');
const prevTxt = await P.pg.textContent('#asTrabajo [data-preview]');
var nPrev = (await P.pg.$$('#asTrabajo [data-preview] .cl-it')).length;
ok('vista previa del alumno: solo lo publicado (17), sin borradores, pendientes, notas privadas ni controles', nPrev === 17 && !/Borrador|Pendiente de completar|Nota privada|\(revisado\)|Material en preparación/.test(prevTxt) && !(await P.pg.$('#asTrabajo [data-preview] [data-cl=pub], #asTrabajo [data-preview] [draggable=true], #asTrabajo [data-preview] a[href^="#trabajo/"]')), String(nPrev));
await P.pg.screenshot({ path: SHOTS + 'aula_tablon_vista_alumno.png' });
// Organización: todo, con filtros
await P.pg.goto(BASE + '#asig/eee/organizacion');
await P.pg.waitForSelector('#asOrg .org-stats');
await P.pg.click('[data-cl=orgF][data-f=borr]');
const nOrgB = (await P.pg.$$('#asOrg .org-it')).length;
await P.pg.click('[data-cl=orgF][data-f=pend]');
const nOrgP = (await P.pg.$$('#asOrg .org-it .cl-pend')).length;
await P.pg.click('[data-cl=orgF][data-f=todo]');
ok('Organización: todo el contenido con borradores (45) y pendientes; grupos y enlace al cuaderno', nOrgB === 45 && nOrgP > 0 && (await P.pg.$$('#asOrg .org-it')).length >= 62 && /2º CFGB/.test(await P.pg.textContent('#asOrg .org-grupos')) && !!(await P.pg.$('#asOrg a[href="#panel/notas"]')), `${nOrgB} / ${nOrgP}`);
await P.pg.goto(BASE + '#asig/eee/trabajo');
await P.pg.waitForSelector('#asTrabajo [data-cl=crear]');
await P.pg.evaluate(() => window.scrollTo(0, 0));

// biblioteca (profesor)
await P.pg.goto(BASE + '#biblioteca');
await P.pg.waitForSelector('#bibQ');
ok('biblioteca: 5 asignaturas y marca las que imparte este curso', (await P.pg.$$('#bibRes .bib-card')).length === 5 && (await P.pg.$$('#bibRes .bib-marca')).length === 2 && (await P.pg.$$('#bibRes .bib-grupo')).length >= 2);
await P.pg.click('[data-bib-etapa="CFGB"]');
ok('biblioteca: filtro por etapa (CFGB → 2)', (await P.pg.$$('#bibRes .bib-card')).length === 2);
await P.pg.click('[data-bib-etapa=""]');
await P.pg.fill('#bibQ', 'tablero');
await P.pg.waitForSelector('.bib-hits li');
ok('biblioteca: búsqueda de elementos («tablero»)', (await P.pg.$$('.bib-hits li')).length >= 2);
await P.pg.fill('#bibQ', '');
await P.pg.screenshot({ path: SHOTS + 'aula_biblioteca.png' });
await P.pg.goto(BASE + '#biblioteca/tic1');
await P.pg.waitForFunction(() => location.hash === '#asig/tic1/organizacion');
await P.pg.waitForSelector('#asig .bib-prog');
ok('biblioteca → la misma página de la asignatura, en «Organización»', true);
ok('biblioteca → estructura de Classroom de T.I.Cs (Borrador / Pendiente de completar)', /SdA 4\. Anatomía digital/.test(await P.pg.textContent('#asig .bib-prog')) && (await P.pg.$$('#asig .bib-borr')).length === 21);
await P.pg.goto(BASE + '#panel/contenido');
await P.pg.waitForFunction(() => /^#asig\/\w+\/organizacion$/.test(location.hash));
ok('#panel/contenido (antiguo) → Organización de la asignatura (sin pestaña duplicada en el panel)', true);
await P.pg.goto(BASE + '#panel/grupos');
await P.pg.waitForSelector('#pnTabs .pn-g');
const navPanel = await P.pg.$$eval('#pnTabs .pn-gt', (l) => l.map((x) => x.textContent));
ok('panel por bloques: Clases · Seguimiento · Ajustes, sin «Contenido»', navPanel.join('|') === 'Clases|Seguimiento|Ajustes' && !(await P.pg.$('#pnTabs a[href="#panel/contenido"]')), navPanel.join('|'));
await P.pg.goto(BASE + '#panel/limpieza');
await P.pg.waitForSelector('#pnLimp .pn-card');
ok('#panel/limpieza → Ajustes (cuenta, PIN y limpieza)', /Tu cuenta/.test(await P.pg.textContent('#pnBody')) && /PIN de los alumnos/.test(await P.pg.textContent('#pnBody')));

// ================================================================ 3c. Actividades de clase: asignar como tarea
await P.pg.goto(BASE + '#asig/eee/actividades');
await P.pg.waitForSelector('.ac-card [data-asignar=maletin]');
ok('Actividades de clase de EEE: al menos 2 actividades 3D', (await P.pg.$$('.ac-card')).length >= 2);
await P.pg.click('[data-asignar=maletin]');
await P.pg.waitForSelector('#apItemForm');
ok('«Asignar como tarea» abre el editor con la actividad ya rellena', (await P.pg.inputValue('#apItemForm [name=titulo]')) === 'El maletín de herramientas' && /#asig\/eee\/actividades\/maletin/.test(await P.pg.inputValue('#apItemForm [name=enlaces]')));
await P.pg.check('#apItemForm [name=estado][value=publicar]');
await P.pg.click('#apItemForm button[type=submit]');
await P.pg.waitForSelector('.ac-card[data-act=maletin] .ac-est', { timeout: 15000 });
var ID_ACT = (await P.pg.getAttribute('.ac-card[data-act=maletin] .ac-est a', 'href')).replace('#trabajo/', '');
ok('la actividad queda asignada (tarea publicada de tipo «actividad»)', /Asignada en 1 tarea/.test(await P.pg.textContent('.ac-card[data-act=maletin] .ac-est')) && JSON.stringify(await (await fetch(`${REST}/items/${ID_ACT}`, owner)).json()).includes('"actividad"'));
await P.pg.goto(BASE + '#asig/tic1/laboratorio');
await P.pg.waitForSelector('#asig .as-vacio');
ok('Laboratorio de una asignatura sin laboratorios → «Próximamente»', /Próximamente/.test(await P.pg.textContent('#asig .as-vacio')));

// ================================================================ 4. alumno: entra con PIN, entrega y hace el examen
const A = await contexto('alumno5');
await A.pg.goto(BASE + '#asig/tic1/trabajo');
await loginAlumno(A.pg, GA.codigo, 5, '12');
await A.pg.waitForSelector('#gate-err-a:not([hidden])');
ok('PIN demasiado corto → pide 4 a 8 cifras', /4 a 8 cifras/.test(await A.pg.textContent('#gate-err-a')));
await A.pg.fill('#gate-pin', '4321'); await A.pg.click('#gate-alumno .gate-go');
await A.pg.waitForSelector('#asTrabajo .cl-it', { timeout: 30000 });
ok('alumno entra con nº + PIN y ve lo publicado (2), no el borrador', (await A.pg.$$('#asTrabajo .cl-it')).length === 2 && !/en preparación/.test(await A.pg.textContent('#asTrabajo')));
ok('el alumno no tiene «＋ Crear» ni arrastre', !(await A.pg.$('#asTrabajo [data-cl=crear], #asTrabajo [draggable=true]')));
ok('el alumno ve el tema de Classroom', /SdA 1\. Mi Primer Dossier/.test(await A.pg.textContent('#asTrabajo')));
const pin = await (await fetch(`${REST}/pines/${GA.id}_5`, owner)).json();
ok('se guarda solo el hash del PIN (no el PIN)', /^[0-9a-f]{64}$/.test(pin.fields?.h?.stringValue || '') && !JSON.stringify(pin).includes('4321'));
const asigs = await A.pg.evaluate(() => window.PORTAL_SESION.asignaturas.join());
ok('el alumno solo tiene las asignaturas de su grupo', asigs === 'tic1', asigs);
await A.pg.goto(BASE + '#eee');
await A.pg.waitForFunction(() => location.hash === '#asignaturas');
ok('una asignatura que no es de su grupo (#eee) → vuelve a Asignaturas', true);
await A.pg.goto(BASE + '#trabajo/' + ID_T);
await A.pg.waitForSelector('#auEntrega');
ok('la tarea muestra instrucciones y rúbrica', /portada/.test(await A.pg.textContent('.au-texto')) && /Formato y estilos/.test(await A.pg.textContent('.au-t')));
await A.pg.fill('#auEntrega [name=texto]', 'He hecho el documento con índice.');
await A.pg.fill('#auEntrega [name=enlaces]', 'https://docs.google.com/document/d/ejemplo\njavascript:alert(1)');
await A.pg.click('#auEntrega button[type=submit]');
await A.pg.waitForSelector('.au-ok:has-text("Entregado")', { timeout: 15000 });
ok('el alumno entrega la tarea (texto + enlace)', true);
const trT = await (await fetch(`${REST}/trabajos/${ID_T}_${GA.id}_5`, owner)).json();
ok('el enlace «javascript:» se descarta', !JSON.stringify(trT).includes('javascript'));

await A.pg.goto(BASE + '#trabajo/' + ID_E);
await A.pg.waitForSelector('[data-au=empezar]');
await A.pg.screenshot({ path: SHOTS + 'aula_alumno_examen_inicio.png' });
await A.pg.click('[data-au=empezar]');
await A.pg.waitForSelector('#auExamen', { timeout: 15000 });
ok('empezar el examen: se ven las preguntas y el reloj', /Tiempo restante: 19:|Tiempo restante: 20:/.test(await A.pg.textContent('#auReloj')));
await A.pg.check('fieldset.au-q:has-text("suma un rango") label:has-text("=SUMA()") input');
await A.pg.check('fieldset.au-q:has-text("Una celda se nombra") label:has-text("Falso") input');
await A.pg.fill('fieldset.au-q:has-text("intersección") input.au-corta', 'Celda');
await A.pg.screenshot({ path: SHOTS + 'aula_alumno_examen.png' });
await A.pg.click('#auExamen button[type=submit]');
await A.pg.waitForSelector('.au-ok:has-text("Examen entregado")', { timeout: 15000 });
ok('entregar el examen', true);
const trE = await (await fetch(`${REST}/trabajos/${ID_E}_${GA.id}_5`, owner)).json();
ok('el examen guarda las respuestas por id de pregunta y estado «entregado»', trE.fields?.estado?.stringValue === 'entregado' && Object.keys(trE.fields?.respuestas?.mapValue?.fields || {}).length === 3);
await A.pg.goto(BASE + '#asig/tic1/trabajo');
await A.pg.waitForSelector('#asTrabajo .au-est');
await A.pg.goto(BASE + '#biblioteca');
await A.pg.waitForFunction(() => location.hash === '#asignaturas');
ok('la biblioteca es solo del profesor (el alumno vuelve a Asignaturas y su menú no tiene Biblioteca ni Panel)', !(await A.pg.$('#subjects .top-nav a[href="#biblioteca"], #subjects .top-nav a[href="#panel"]')) && !!(await A.pg.$('#subjects .top-nav a[href="#asignaturas"]')));
await A.pg.goto(BASE + '#asig/tic1/trabajo');
await A.pg.waitForSelector('#asTrabajo .au-est');
ok('en la lista se ve «Entregado» en las dos', (await A.pg.$$eval('#asTrabajo .au-est', l => l.filter(x => /Entregado/.test(x.textContent)).length)) === 2);

// ================================================================ 5. profesor: cuaderno, autocorrección, rúbrica, publicar
await P.pg.goto(BASE + '#panel/notas');
await P.pg.waitForSelector('[data-ap-f=gGrupo]', { timeout: 15000 });
await P.pg.selectOption('[data-ap-f=gGrupo]', GA.id);
await P.pg.waitForSelector('.ap-tabla', { timeout: 15000 });
ok('cuaderno: 12 filas (nº de alumnos del grupo) y las 2 columnas', (await P.pg.$$('.ap-tabla tbody tr')).length === 12 && (await P.pg.$$('.ap-tabla th[data-col]')).length === 2);
await P.pg.waitForSelector(`td[data-celda="${ID_E}"][data-n="5"].e-entregado`, { timeout: 15000 });
await P.pg.click(`th[data-col="${ID_E}"] [data-ap=autocorregir]`);
await P.pg.waitForSelector(`td[data-celda="${ID_E}"][data-n="5"].e-nota`, { timeout: 15000 });
ok('autocorregir el examen: 10 (test, V/F y respuesta corta sin tildes/mayúsculas)', (await P.pg.textContent(`td[data-celda="${ID_E}"][data-n="5"]`)).trim() === '10');
await P.pg.click(`td[data-celda="${ID_T}"][data-n="5"]`);
await P.pg.waitForSelector('#apNotaForm');
ok('el detalle muestra la entrega del alumno', /índice/.test(await P.pg.textContent('#apDetalle')));
await P.pg.fill('.ap-rpts[data-ri="0"]', '3');
await P.pg.fill('.ap-rpts[data-ri="1"]', '5');
ok('la rúbrica calcula la nota (8/10 → 8)', (await P.pg.inputValue('#apNota')) === '8');
await P.pg.fill('#apNotaForm [name=comentario]', 'Buen índice; revisa los estilos de título.');
await P.pg.check('#apNotaForm [name=publicada]');
await P.pg.click('#apNotaForm button[type=submit]');
await P.pg.waitForFunction(() => /Guardado/.test(document.querySelector('#apNotaMsg')?.textContent || ''), null, { timeout: 15000 });
ok('guardar la nota con rúbrica y comentario (publicada)', true);
// el alumno aún NO ve la nota del examen (sin publicar)
await A.pg.goto(BASE + '#trabajo/' + ID_E);
await A.pg.waitForSelector('.au-ok:has-text("Examen entregado")');
ok('nota sin publicar: el alumno no la ve', !(await A.pg.$('.au-nota')));
await P.pg.click(`th[data-col="${ID_E}"] [data-ap=publicarNotas]`);
await P.pg.waitForFunction((id) => !document.querySelector(`th[data-col="${id}"] [data-ap=publicarNotas]`), ID_E, { timeout: 15000 });
ok('publicar las notas del examen', true);
// Desde ead2b10 el cuaderno solo muestra la nota de cada actividad (la nota por criterios va en SuperProfe y QE)
const fila5 = await P.pg.$$eval('.ap-tabla tbody tr:nth-child(5) td.ap-c', (tds) => tds.map((t) => t.textContent.trim()));
ok('cuaderno: la fila del nº 5 muestra la nota de cada actividad (10 y 8), sin medias ni nota final', fila5.includes('10') && fila5.includes('8') && !(await P.pg.$('.ap-tabla .ap-media')), fila5.join(' | '));
await P.pg.screenshot({ path: SHOTS + 'aula_cuaderno.png' });
const [dl] = await Promise.all([P.pg.waitForEvent('download'), P.pg.click('[data-ap=csvNotas]')]);
const csvTxt = readFileSync(await dl.path(), 'utf8');
ok('CSV del cuaderno: solo nº de lista y notas', /"05";"8";"10"|"05";"10";"8"/.test(csvTxt) && !/Nota final/.test(csvTxt) && !/@/.test(csvTxt), csvTxt.split('\r\n')[5]);

// ================================================================ 6. alumno ve las notas; desde otro navegador con el PIN
await A.pg.waitForSelector('.au-nota', { timeout: 15000 });
ok('el alumno ve la nota del examen al publicarla', /10/.test(await A.pg.textContent('.au-nota')));
await A.pg.goto(BASE + '#trabajo/' + ID_T);
await A.pg.waitForSelector('.au-nota');
ok('y la de la tarea con el comentario y los puntos de la rúbrica', /8/.test(await A.pg.textContent('.au-nota')) && /estilos de título/.test(await A.pg.textContent('.au-nota')) && /3/.test(await A.pg.textContent('.au-t')));
await A.pg.screenshot({ path: SHOTS + 'aula_alumno_nota.png' });
const A2 = await contexto('alumno5-otro-pc');
await A2.pg.goto(BASE + '#asig/tic1/trabajo');
await loginAlumno(A2.pg, GA.codigo, 5, '9999');
await A2.pg.waitForSelector('#gate-err-a:not([hidden])', { timeout: 20000 });
ok('mismo nº con OTRO PIN → no entra', /ya tiene otro PIN/.test(await A2.pg.textContent('#gate-err-a')));
await A2.pg.fill('#gate-pin', '4321'); await A2.pg.click('#gate-alumno .gate-go');
await A2.pg.waitForSelector('#asTrabajo .au-est.e-nota', { timeout: 30000 });
ok('desde otro navegador, con su PIN, ve sus notas (sin datos personales)', (await A2.pg.$$('#asTrabajo .au-est.e-nota')).length === 2);
await A2.pg.goto(BASE + '#trabajo/' + ID_E);
await A2.pg.waitForSelector('.au-nota');
ok('el examen no se puede repetir (no aparece «Empezar»)', !(await A2.pg.$('[data-au=empezar]')));
await A2.ctx.close();
// otro alumno del grupo de EEE no ve nada de T.I.Cs
const E = await contexto('alumnoEEE');
await E.pg.goto(BASE + '#asig/eee');
await loginAlumno(E.pg, GE.codigo, 3, '5555');
await E.pg.waitForSelector('#asTrabajo .cl-stream', { timeout: 30000 });
const tabsAl = await E.pg.$$eval('#asig .as-tabs [role=tab]', (l) => l.map((x) => x.textContent.trim().replace(/^\S+\s/, '')));
ok('alumno: pestañas Trabajo de clase · Tablón · Laboratorio · Actividades (sin Organización); por defecto el Tablón', tabsAl.join('|') === 'Trabajo de clase|Tablón|Laboratorio|Actividades de clase' && (await E.pg.evaluate(() => location.hash)) === '#asig/eee/tablon', tabsAl.join('|'));
await E.pg.goto(BASE + '#asig/eee/organizacion');
await E.pg.waitForFunction(() => location.hash === '#asig/eee/tablon');
ok('alumno: #asig/eee/organizacion → Tablón', true);
await E.pg.goto(BASE + '#asig/eee/trabajo');
await E.pg.waitForSelector('#asTrabajo .cl-it', { timeout: 30000 });
const txtE = await E.pg.textContent('#asTrabajo');
const nE = (await E.pg.$$('#asTrabajo .cl-it')).length;
ok('alumno de EEE: ve lo publicado de Classroom (17 con la pregunta, + la actividad) y ningún borrador', nE === 18 && !/Borrador|Pendiente de completar|\(revisado\)/.test(txtE), String(nE));
ok('la vista previa del profesor coincide con lo que ve el alumno (+1: la actividad, asignada después)', nE === nPrev + 1, `${nPrev} / ${nE}`);
ok('alumno de EEE: no ve nada de T.I.Cs', !/Desafío 1 \(Documentos/.test(txtE));
await E.pg.goto(BASE + '#asig/eee/tablon');
await E.pg.waitForSelector('#asTrabajo .cl-post:has-text("destornilladores")', { timeout: 15000 });
ok('alumno de EEE: ve el anuncio del Tablón', true);
await E.pg.goto(BASE + '#asig/eee/laboratorio');
await E.pg.waitForSelector('#asig .ap-card');
ok('alumno de EEE: Laboratorio con ESP32, Circuitos e Instalación de vivienda (grabar la placa va dentro de cada proyecto ESP32)', (await E.pg.$$('#asig a.ap-card')).length === 3 && !!(await E.pg.$('#asig a.ap-card[href="#eee/vivienda"]')) && !(await E.pg.$('#asig a.ap-card[href="#eee/placa"]')));
// actividad asignada: hacerla en 3D y entregar el resultado
await E.pg.goto(BASE + '#asig/eee/actividades');
await E.pg.waitForSelector('.ac-card[data-act=maletin] .ac-est');
ok('alumno: la actividad muestra «Tarea asignada»', /Tarea asignada/.test(await E.pg.textContent('.ac-card[data-act=maletin] .ac-est')));
await E.pg.goto(BASE + '#asig/eee/actividades/maletin');
await E.pg.waitForFunction(() => window.__act && document.querySelector('#acGL canvas') && document.querySelector('[data-ac=empezar]'), null, { timeout: 20000 });
await E.pg.click('[data-ac=empezar]');
let nR = 0, clic3d = false;
for (;;) {
  const R = await E.pg.evaluate(() => { const r = window.__act.ronda(); return r && { tipo: r.tipo, ok: r.ok, correcta: r.correcta, sol: r.solucion, n: (r.opciones || []).length, mal: r.ok ? window.__act.def.objetos.map((o) => o.id).find((id) => !r.ok.includes(id)) : null }; });
  if (!R) break;
  // modo juego: rondas con opciones (pregunta, punta del destornillador, longitud de pelado), cablear una clavija o pulsar la pieza
  if (R.n) await E.pg.click(`[data-ac=op][data-k="${nR === 0 ? (R.correcta + 1) % R.n : R.correcta}"]`);
  else if (R.tipo === 'colores') { for (const [b, c] of Object.entries(R.sol)) await E.pg.click(`[data-ac=col][data-b="${b}"][data-c="${c}"]`); await E.pg.click('[data-ac=comprobar]'); }
  else if (nR === 0) await E.pg.click(`[data-ac=pieza][data-id="${R.mal}"]`); // un fallo a propósito
  else if (!clic3d) { const p = await E.pg.evaluate((id) => window.__act.pantallaDe(id), R.ok[0]); await E.pg.mouse.click(p.x, p.y); clic3d = true; }
  else await E.pg.click(`[data-ac=pieza][data-id="${R.ok[0]}"]`);
  await E.pg.waitForSelector('.ac-fb');
  nR++; await E.pg.click('[data-ac=sig]');
}
const resTxt = await E.pg.textContent('#acLado');
const nTot = await E.pg.evaluate(() => window.__act.estado.rondas.length);
ok('actividad 3D (modo juego, 3 niveles con retos): se responde pulsando la pieza en la mesa 3D, su número o la opción del reto, y da la nota', clic3d && /aciertos · Nota/.test(resTxt) && nR === nTot && nTot >= 14, `${nR}/${nTot} · ${resTxt.slice(0, 80)}`);
await E.pg.click('[data-ac=entregar]');
await E.pg.waitForFunction(() => /Entregado/.test(document.querySelector('#acMsg')?.textContent || ''), null, { timeout: 15000 });
const trAct = await (await fetch(`${REST}/trabajos/${ID_ACT}_${GE.id}_3`, owner)).json();
ok('alumno: entrega el resultado de la actividad (sin datos personales)', new RegExp(`Aciertos: ${nTot - 1}/${nTot}`).test(trAct.fields?.texto?.stringValue || ''), trAct.fields?.texto?.stringValue?.slice(0, 60));
await E.pg.screenshot({ path: SHOTS + 'aula_actividad_resultado.png' });
// laboratorio «Instalación de vivienda»: el alumno entrega el tablero de la SA1 y el profesor lo revisa y califica
await E.pg.goto(BASE + '#eee/vivienda/tablero');
await E.pg.waitForFunction(() => window.__viv && window.__viv.kind === 'tablero' && !!document.querySelector('#vvGL canvas'), null, { timeout: 20000 });
await E.pg.evaluate(() => window.__viv.cargarSolucion());
await E.pg.click('[data-tab=comprobar]'); await E.pg.click('[data-v=comprobar]');
await E.pg.waitForSelector('.vv-check.ok');
await E.pg.click('[data-v=entregar]');
await E.pg.waitForSelector('text=¡Entregado al profesor!', { timeout: 15000 });
const entV = (await (await fetch(`${REST}/entregas?pageSize=50`, owner)).json()).documents?.find((d) => d.fields?.tipo?.stringValue === 'vivienda');
ok('alumno de EEE: entrega el tablero de vivienda (práctica v1, comprobación correcta y materiales)', entV && entV.fields.practica.stringValue === 'v1' && entV.fields.datos.mapValue.fields.comprobacion.mapValue.fields.ok.booleanValue === true && /Tubo corrugado/.test(entV.fields.datos.mapValue.fields.materiales.stringValue));
// cuaderno: la nota de la actividad sale del resultado
await P.pg.goto(BASE + '#panel/notas');
await P.pg.waitForSelector('[data-ap-f=gGrupo]', { timeout: 15000 });
await P.pg.selectOption('[data-ap-f=gGrupo]', GE.id);
await P.pg.waitForSelector(`th[data-col="${ID_ACT}"] [data-ap=notasActividad]`, { timeout: 20000 });
await P.pg.click(`td[data-celda="${ID_ACT}"][data-n="3"]`);
await P.pg.waitForSelector('#apDetalle .ap-act');
ok('cuaderno: la casilla de la actividad propone la nota del resultado', /nota sugerida/.test(await P.pg.textContent('#apDetalle .ap-act')));
await P.pg.click(`th[data-col="${ID_ACT}"] [data-ap=notasActividad]`);
await P.pg.waitForTimeout(1200);
const ntAct = await (await fetch(`${REST}/notas/${ID_ACT}_${GE.id}_3`, owner)).json();
const notaAct = Number(ntAct.fields?.nota?.doubleValue ?? ntAct.fields?.nota?.integerValue);
ok('cuaderno: «⚡ Poner notas» de la actividad (sin publicar)', notaAct === Math.round(((nTot - 1) / nTot) * 100) / 10 && ntAct.fields?.publicada?.booleanValue === false, String(notaAct));
await P.pg.selectOption('[data-ap-f=gGrupo]', GA.id);
await P.pg.goto(BASE + '#panel/entregas');
await P.pg.waitForSelector('#pnTabla [data-ent]:has-text("Vivienda")', { timeout: 20000 });
await P.pg.click('#pnTabla [data-ent]:has-text("Vivienda")');
ok('panel: la entrega de vivienda muestra ✅ y la lista de materiales', /Materiales \(Trabajo 3\)/.test(await P.pg.textContent('#pnDetalle')));
await P.pg.click('#pnDetalle [data-pn="revisar"]');
await P.pg.waitForFunction(() => window.__viv && window.__viv.modo === 'revision' && window.__viv.m.parts.length > 10, null, { timeout: 20000 });
ok('el profesor abre el tablero entregado en 3D (solo lectura)', await P.pg.evaluate(() => window.__viv.ro));
await P.pg.fill('#vvNota', '9');
await P.pg.fill('#vvCom', 'Muy bien montado. Revisa los metros de cable del presupuesto.');
await P.pg.click('[data-v=revGuardar]');
await P.pg.waitForFunction(() => /Guardado/.test(document.querySelector('#vvGradeMsg')?.textContent || ''), null, { timeout: 15000 });
ok('el profesor califica la entrega de vivienda', true);
await P.pg.screenshot({ path: SHOTS + 'vivienda_revision_profesor.png' });
await P.pg.goto(BASE + '#panel/notas');
await P.pg.waitForSelector(`td[data-celda]`, { timeout: 20000 });
await E.ctx.close();

// ================================================================ 7. reiniciar PIN
await P.pg.click(`td[data-celda="${ID_T}"][data-n="5"]`);
await P.pg.waitForSelector('[data-ap=pinReset]');
await P.pg.click('[data-ap=pinReset]');
await P.pg.waitForTimeout(800);
const pin2 = await fetch(`${REST}/pines/${GA.id}_5`, owner);
ok('el profesor reinicia el PIN de un nº', pin2.status === 404);
const A3 = await contexto('alumno5-pin-nuevo');
await A3.pg.goto(BASE + '#asig/tic1/trabajo');
await loginAlumno(A3.pg, GA.codigo, 5, '2468');
await A3.pg.waitForSelector('#asTrabajo .au-est.e-nota', { timeout: 30000 });
ok('tras reiniciarlo, el alumno elige un PIN nuevo y conserva sus notas', true);
await A3.ctx.close();

// ================================================================ 8. vista previa del profesor y portada
await P.pg.goto(BASE + '#trabajo/' + ID_E);
await P.pg.click('[data-au=verPreguntas]');
await P.pg.waitForSelector('.au-prev');
ok('vista previa del profesor: preguntas con soluciones', /=SUMA\(\)/.test(await P.pg.textContent('.au-prev .ok')));
await P.pg.goto(BASE + '#asignaturas');
await P.pg.waitForSelector('#subjects .bib-card');
ok('profesor: «Curso 2026/27» solo con las del curso', /Curso 2026\/27/.test(await P.pg.textContent('#subjects h1')) && (await P.pg.$$('#subjects .bib-card')).length === 2);
await P.pg.screenshot({ path: SHOTS + 'aula_asignaturas_profesor.png' });
await A.pg.goto(BASE + '#asig/tic1/trabajo');
await A.pg.waitForSelector('#asTrabajo .cl-it');
await A.pg.screenshot({ path: SHOTS + 'aula_alumno_trabajo.png' });

// ================================================================ 9. Curso (este año) y Biblioteca (todas, también otros años)
// un curso anterior archivado, para ver «También en 2025/26» en la Biblioteca
const val = (v) => Array.isArray(v) ? { arrayValue: { values: v.map(val) } } : typeof v === 'boolean' ? { booleanValue: v } : typeof v === 'number' ? { integerValue: String(v) } : typeof v === 'object' ? { mapValue: { fields: {} } } : { stringValue: v };
const cursoAnt = { nombre: '2025/26', asignaturas: ['tic1', 'tic2', 'cdpc1'], activo: false, pesos: {}, creado: 1 };
await fetch(`${REST}/cursos/c2025-26`, { method: 'PATCH', headers: { ...owner.headers, 'Content-Type': 'application/json' }, body: JSON.stringify({ fields: Object.fromEntries(Object.entries(cursoAnt).map(([k, v]) => [k, val(v)])) }) });
const cursoDoc = async () => { const L = (await (await fetch(`${REST}/cursos`, owner)).json()).documents || []; const d = L.find((x) => x.fields?.activo?.booleanValue); return { id: d?.name.split('/').pop(), asigs: (d?.fields?.asignaturas?.arrayValue?.values || []).map((v) => v.stringValue) }; };
const asigsDe = async (col, id) => ((await (await fetch(`${REST}/${col}/${id}`, owner)).json()).fields?.asignaturas?.arrayValue?.values || []).map((v) => v.stringValue);
await P.pg.goto(BASE + '#asignaturas');
await P.pg.waitForSelector('#subjects [data-cur=quitar]');
ok('nombre nuevo: «Curso» en el menú (en lugar de «Mis asignaturas»)', /Curso/.test(await P.pg.textContent('#subjects .top-nav a[href="#asignaturas"]')) && !/Mis asignaturas/.test(await P.pg.textContent('#subjects')));
ok('Curso: título «Curso 2026/27», migas «Inicio › Curso» y «Quitar del curso» en cada asignatura', /Curso 2026\/27/.test(await P.pg.textContent('#subjects h1')) && /Inicio › Curso/.test(await P.pg.textContent('#subjects .crumbs')) && (await P.pg.$$('#subjects [data-cur=quitar]')).length === 2);
await P.pg.click('#sesBtn'); await P.pg.waitForSelector('#sesMenu:not([hidden])');
ok('menú de la sesión: enlaces a Curso y Biblioteca', !!(await P.pg.$('#sesMenu a[href="#asignaturas"]')) && !!(await P.pg.$('#sesMenu a[href="#biblioteca"]')));
await P.pg.keyboard.press('Escape');
await P.pg.screenshot({ path: SHOTS + 'curso_profesor_claro.png' });
await P.pg.evaluate(() => window.portalTema?.elegir('dark')); await P.pg.waitForTimeout(300);
await P.pg.screenshot({ path: SHOTS + 'curso_profesor_oscuro.png' });
await P.pg.goto(BASE + '#biblioteca');
await P.pg.waitForSelector('#bibRes [data-cur=añadir]');
await P.pg.waitForFunction(() => /También en 2025\/26/.test(document.querySelector('#bibRes')?.textContent || ''), null, { timeout: 15000 });
ok('Biblioteca: las 5 asignaturas (este curso y anteriores), 2 «En el curso 2026/27» (con «Quitar del curso») y 3 «Añadir al curso»', (await P.pg.$$('#bibRes .bib-card')).length === 5 && (await P.pg.$$('#bibRes [data-cur=quitar]')).length === 2 && (await P.pg.$$('#bibRes .bib-marca:not(.bib-arch)')).length === 2 && (await P.pg.$$('#bibRes [data-cur=añadir]')).length === 3);
ok('Biblioteca: archivo de otros años («También en 2025/26»)', (await P.pg.$$('#bibRes .bib-arch')).length === 3);
await P.pg.screenshot({ path: SHOTS + 'biblioteca_profesor_oscuro.png', fullPage: true });
await P.pg.evaluate(() => window.portalTema?.elegir('light')); await P.pg.waitForTimeout(300);
await P.pg.screenshot({ path: SHOTS + 'biblioteca_profesor_claro.png', fullPage: true });
// añadir T.I.Cs 2º Bach al curso
await P.pg.click('#bibRes [data-cur=añadir][data-asig=tic2]');
await P.pg.waitForFunction(() => document.querySelectorAll('#bibRes [data-cur=quitar]').length === 3, null, { timeout: 15000 });
let cd = await cursoDoc();
ok('«Añadir al curso» guarda la asignatura en el curso activo', cd.asigs.includes('tic2') && cd.asigs.length === 3, cd.asigs.join());
ok('Biblioteca: aviso y contador tras añadir', /añadida al curso 2026\/27/.test(await P.pg.textContent('#bibResumen')) && /3\s*en el curso/.test(await P.pg.textContent('#bibResumen')));
await P.pg.screenshot({ path: SHOTS + 'biblioteca_anadida.png' });
await P.pg.goto(BASE + '#asignaturas');
await P.pg.waitForFunction(() => document.querySelectorAll('#subjects .bib-card').length === 3, null, { timeout: 15000 });
ok('Curso: aparece la asignatura añadida (3)', true);
// quitar T.I.Cs 1º Bach (la tiene el grupo 1º Bach A): no se borra nada, el grupo deja de verla
let dlg = ''; P.pg.once('dialog', (d) => { dlg = d.message(); });
await P.pg.click('#subjects [data-cur=quitar][data-asig=tic1]');
await P.pg.waitForFunction(() => document.querySelectorAll('#subjects .bib-card').length === 2, null, { timeout: 15000 });
ok('«Quitar del curso» pide confirmación, explica que no se borra nada y avisa del grupo', /No se borra nada/.test(dlg) && /1º Bach A/.test(dlg), dlg.split('\n')[0]);
cd = await cursoDoc();
ok('el curso ya no tiene T.I.Cs 1º Bach; el grupo y su código tampoco', !cd.asigs.includes('tic1') && !(await asigsDe('grupos', GA.id)).includes('tic1') && !(await asigsDe('codigos', GA.codigo)).includes('tic1'));
ok('quitar del curso no borra el contenido (la tarea sigue)', (await fetch(`${REST}/items/${ID_E}`, owner)).status === 200);
await P.pg.screenshot({ path: SHOTS + 'curso_quitada.png' });
await P.pg.goto(BASE + '#biblioteca');
await P.pg.waitForSelector('#bibRes [data-cur=añadir][data-asig=tic1]');
ok('la asignatura quitada sigue en la Biblioteca, con «Añadir al curso»', (await P.pg.$$('#bibRes .bib-card')).length === 5);
// el alumno de 1º Bach A deja de verla (sus asignaturas son las del curso)
await A.pg.goto(BASE + '#asignaturas'); await A.pg.reload();
await A.pg.waitForSelector('#subjects .subj-h1');
ok('alumno: el menú dice «Curso» y ya no ve la asignatura quitada', /Curso/.test(await A.pg.textContent('#subjects .top-nav')) && !(await A.pg.$('#subjects a[href="#asig/tic1"]')));
await A.pg.screenshot({ path: SHOTS + 'curso_alumno.png' });
// página de la asignatura fuera del curso: botón «Añadir al curso»
await P.pg.goto(BASE + '#asig/tic1/organizacion');
await P.pg.waitForSelector('#asig [data-cur=añadir]');
ok('asignatura fuera del curso: migas desde la Biblioteca y «Añadir al curso»', /Biblioteca/.test(await P.pg.textContent('#asig .crumbs')));
await P.pg.click('#asig [data-cur=añadir]');
await P.pg.waitForFunction(() => !document.querySelector('#asig [data-cur=añadir]') && /Inicio › Curso/.test(document.querySelector('#asig .crumbs')?.textContent || ''), null, { timeout: 15000 });
cd = await cursoDoc();
ok('vuelve a estar en el curso (desde su página)', cd.asigs.includes('tic1'));
// el grupo se vuelve a marcar en Panel → Grupos (aquí, directamente) para dejarlo como estaba
for (const [col, id] of [['grupos', GA.id], ['codigos', GA.codigo]]) await fetch(`${REST}/${col}/${id}?updateMask.fieldPaths=asignaturas`, { method: 'PATCH', headers: { ...owner.headers, 'Content-Type': 'application/json' }, body: JSON.stringify({ fields: { asignaturas: val(['tic1']) } }) });
// móvil
const M = await contexto('profesor-movil', { width: 390, height: 844 });
await M.pg.goto(BASE);
await loginGoogle(M.pg, 'profe@test.es');
await M.pg.waitForSelector('#pnGrupoForm', { timeout: 30000 });
await M.pg.goto(BASE + '#asignaturas');
await M.pg.waitForFunction(() => document.querySelectorAll('#subjects [data-cur=quitar]').length === 3, null, { timeout: 20000 });
ok('móvil: Curso con 3 asignaturas y sus botones', true);
await M.pg.screenshot({ path: SHOTS + 'curso_movil.png' });
await M.pg.goto(BASE + '#biblioteca');
await M.pg.waitForSelector('#bibRes [data-cur=quitar]');
await M.pg.screenshot({ path: SHOTS + 'biblioteca_movil.png' });
await M.ctx.close();
} catch (e) {
  console.log('EXCEPCIÓN:', e.message.split('\n').slice(0, 4).join(' | '));
  ok('sin excepciones', false, e.message.split('\n')[0]);
}
ok('sin errores de consola', errores.length === 0, errores.slice(0, 5).join(' | '));
await b.close();
const fails = results.filter(r => !r.ok);
console.log(`\n${results.length - fails.length}/${results.length} OK`);
process.exit(fails.length ? 1 : 0);

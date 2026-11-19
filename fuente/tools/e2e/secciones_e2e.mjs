// E2E de la v5 · secciones de la asignatura (emuladores Auth + Firestore). EEE con secciones:
// pestañas del profesor y del alumno, migración automática en lectura (no se reescribe ningún elemento),
// enlaces antiguos, configuración en «Gestión», contador de pendientes, filtro por tema y móvil.
// Lanzar como aula_e2e (E2E_FS_PORT, E2E_AUTH_PORT, PORTAL_BASE). Capturas en CAPTURAS_V5 (si se define).
import { chromium } from 'playwright-core';
import { mkdirSync } from 'fs';
import { SHOTS } from '../rutas.mjs';
const FSP = process.env.E2E_FS_PORT || '8080', AUP = process.env.E2E_AUTH_PORT || '9099';
const BASE = process.env.PORTAL_BASE || 'http://127.0.0.1:8765/index.html';
const CAP = process.env.CAPTURAS_V5 ? process.env.CAPTURAS_V5.replace(/\/?$/, '/') : SHOTS; mkdirSync(CAP, { recursive: true });
const PROJ = 'demo-portal';
const VIEJAS = !!process.env.REGLAS_VIEJAS; // prueba de degradación: reglas anteriores a la v5
const CFG = `window.PORTAL_FIREBASE={apiKey:'demo-key',authDomain:'${PROJ}.firebaseapp.com',projectId:'${PROJ}',appId:'1:1:web:1'};window.PORTAL_FIREBASE_EMU={auth:'http://127.0.0.1:${AUP}',firestoreHost:'127.0.0.1',firestorePort:${FSP}};`;
const REST = `http://127.0.0.1:${FSP}/v1/projects/${PROJ}/databases/(default)/documents`;
const owner = { headers: { Authorization: 'Bearer owner', 'Content-Type': 'application/json' } };
const results = []; const errores = [];
const ok = (name, cond, info = '') => { results.push({ name, ok: !!cond }); console.log((cond ? 'OK  ' : 'FAIL') + ' ' + name + (info ? ' · ' + info : '')); };
const benigno = (t) => /favicon|WebGL|GPU stall|swiftshader|GroupMarkerNotSet/i.test(t);
// Firestore REST: objeto JS ↔ campos
const val = (v) => v === null ? { nullValue: null } : Array.isArray(v) ? { arrayValue: { values: v.map(val) } } : typeof v === 'boolean' ? { booleanValue: v } : typeof v === 'number' ? (Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v }) : typeof v === 'object' ? { mapValue: { fields: campos(v) } } : { stringValue: String(v) };
const campos = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, val(v)]));
const poner = (ruta, o) => fetch(`${REST}/${ruta}`, { method: 'PATCH', ...owner, body: JSON.stringify({ fields: campos(o) }) });
const leer = async (ruta) => (await fetch(`${REST}/${ruta}`, owner)).json();

await fetch(`http://127.0.0.1:${FSP}/emulator/v1/projects/${PROJ}/databases/(default)/documents`, { method: 'DELETE' });
await fetch(`http://127.0.0.1:${AUP}/emulator/v1/projects/${PROJ}/accounts`, { method: 'DELETE' });
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
async function contexto(nombre, viewport = { width: 1440, height: 900 }) {
  const ctx = await b.newContext({ viewport, acceptDownloads: true, ...(viewport.width < 500 ? { isMobile: true, hasTouch: true, deviceScaleFactor: 2 } : {}) });
  await ctx.route('**/js/firebase-config.js*', r => r.fulfill({ contentType: 'application/javascript', body: CFG }));
  const pg = await ctx.newPage(); await pg.addInitScript(() => { window.__dialogosNativos = true; });
  pg.on('console', m => { if (m.type() === 'error' && !benigno(m.text())) errores.push(`[${nombre}] console: ${m.text()}`); });
  pg.on('pageerror', e => errores.push(`[${nombre}] pageerror: ${e.message}`));
  pg.on('dialog', d => d.accept());
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
const pestañas = (pg) => pg.$$eval('#asig .as-tabs [role=tab] .as-tt', (l) => l.map((x) => x.textContent.trim()));
const hash = (pg) => pg.evaluate(() => location.hash);

try {
  // ---------------------------------------------------------------- profesor: curso y grupo
  const P = await contexto('profesor');
  await P.pg.goto(BASE); await loginGoogle(P.pg, 'profe@test.es');
  await P.pg.waitForSelector('#pnGrupoForm', { timeout: 30000 });
  await P.pg.goto(BASE + '#panel/cursos'); await P.pg.waitForSelector('#apCursoForm');
  await P.pg.check('#apCursoForm [name=asig][value=eee]'); await P.pg.check('#apCursoForm [name=asig][value=tic1]');
  await P.pg.click('#apCursoForm button[type=submit]');
  await P.pg.waitForSelector('.pn-grupo[data-curso]', { timeout: 15000 });
  const curso = await P.pg.getAttribute('.pn-grupo[data-curso]', 'data-curso');
  await P.pg.goto(BASE + '#panel/grupos');
  await P.pg.waitForFunction(() => document.querySelector('#pnGrupoForm [name=curso]')?.selectedOptions[0]?.textContent.includes('2026/27'), null, { timeout: 15000 });
  await P.pg.fill('#pnGrupoForm [name=nombre]', '2º CFGB'); await P.pg.fill('#pnGrupoForm [name=alumnos]', '12');
  for (const cb of await P.pg.$$('#pnGrupoForm [name=asig]')) { const v = await cb.getAttribute('value'); if ((v === 'eee') !== await cb.isChecked()) await cb.click(); }
  await P.pg.click('#pnGrupoForm button[type=submit]');
  await P.pg.waitForFunction(() => /creado/.test(document.querySelector('#pnFormMsg')?.textContent || ''), null, { timeout: 15000 });
  const G = await P.pg.evaluate(() => { const g = [...document.querySelectorAll('.pn-grupo')].find(x => x.querySelector('h3').textContent === '2º CFGB'); return { codigo: g.querySelector('.pn-code').textContent, id: g.dataset.grupo }; });

  // ---------------------------------------------------------------- contenido antiguo (sin «seccion»)
  const base = { curso, asig: 'eee', texto: '', enlaces: [], grupos: [G.id], visible: [G.id], publicado: true };
  await poner('temas/tmUno01', { curso, asig: 'eee', nombre: 'SA1 · Electricidad', orden: 1 });
  await poner('temas/tmDos02', { curso, asig: 'eee', nombre: 'SA2 · Componentes', orden: 2 });
  const ITEMS = {
    itMat001: { ...base, tipo: 'material', titulo: 'Apuntes de la ley de Ohm', tema: 'tmUno01', orden: 1, enlaces: [{ t: 'Ley de Ohm.pdf', u: 'materiales/eee/sa1/SA1_Trabajo2_cables.pdf' }] },
    itExp002: { ...base, tipo: 'explicacion', titulo: 'Explicación: la resistencia', tema: 'tmDos02', orden: 2 },
    itTar003: { ...base, tipo: 'tarea', titulo: 'Tarea: medir tensiones', tema: 'tmUno01', orden: 3, fechaEntrega: Date.now() + 5 * 864e5, puntos: 10 },
    itPre004: { ...base, tipo: 'pregunta', titulo: '¿Qué es un circuito?', tema: 'tmDos02', orden: 4, puntos: 10 },
    itAct005: { ...base, tipo: 'actividad', titulo: 'Actividad: código de colores', tema: 'tmDos02', orden: 5, puntos: 10 },
    itPra006: { ...base, tipo: 'practica', titulo: 'Práctica: el polímetro', tema: 'tmUno01', orden: 6, puntos: 10 },
    itRec007: { ...base, tipo: 'tarea', titulo: 'Tarea en borrador', tema: 'tmUno01', orden: 7, publicado: false, visible: [] },
  };
  for (const [id, it] of Object.entries(ITEMS)) await poner('items/' + id, it);
  await poner('anuncios/anUno001', { curso, asig: 'eee', texto: 'Mañana traed el polímetro.', grupos: [G.id], visible: [G.id], fecha: Date.now() });
  const antes = JSON.stringify(await Promise.all(Object.keys(ITEMS).map((id) => leer('items/' + id).then((d) => d.fields))));

  // ---------------------------------------------------------------- profesor: pestañas y secciones
  await P.pg.goto(BASE + '#asig/eee');
  await P.pg.waitForSelector('#asTrabajo .sg-caja', { timeout: 20000 });
  ok('profesor: por defecto «Gestión»', (await hash(P.pg)) === '#asig/eee/gestion');
  const tp = await pestañas(P.pg);
  ok('profesor: Avisos · Teoría · Ejercicios en clase · Tareas · Test · Exámenes · Laboratorio · Gestión', tp.join('|') === 'Avisos|Teoría|Ejercicios en clase|Tareas|Test|Exámenes|Laboratorio|Gestión', tp.join('|'));
  ok('Gestión: grupos y seguimiento, filtros por estado, programación y botones de importar', !!(await P.pg.$('#asTrabajo .org-chips')) && /Grupos y seguimiento/.test(await P.pg.textContent('#asig')) && /Programación de la asignatura/.test(await P.pg.textContent('#asig')) && !!(await P.pg.$('#asTrabajo [data-cl=importarJSON]')));
  ok('Gestión: todo junto (7 elementos, también el borrador)', (await P.pg.$$('#asTrabajo .cl-it[data-item]')).length === 7);
  await P.pg.screenshot({ path: CAP + 'v5_profesor_gestion.png', fullPage: false });
  const enSec = async (sec) => { await P.pg.goto(BASE + '#asig/eee/' + sec); await P.pg.waitForFunction((s) => document.querySelector('#tab-' + s)?.getAttribute('aria-selected') === 'true' && document.querySelector('#asTrabajo .cl-bar'), sec, { timeout: 15000 }); return P.pg.$$eval('#asTrabajo .cl-it[data-item]', (l) => l.map((x) => x.dataset.item).sort().join(',')); };
  ok('Teoría: material y explicación', (await enSec('teoria')) === 'itExp002,itMat001');
  ok('Ejercicios en clase: la actividad (y las actividades 3D debajo)', (await enSec('clase')) === 'itAct005' && !!(await P.pg.$('#asig .ac-card')));
  ok('Tareas: tarea, pregunta y borrador', (await enSec('tareas')) === 'itPre004,itRec007,itTar003');
  ok('Laboratorio: la práctica y los laboratorios 3D', (await enSec('laboratorio')) === 'itPra006' && !!(await P.pg.$('#asig .ap-card')));
  ok('Test vacío: mensaje claro', (await P.pg.goto(BASE + '#asig/eee/test'), await P.pg.waitForSelector('#asTrabajo .cl-vacio', { timeout: 15000 }), /Todavía no hay nada en «Test»/.test(await P.pg.textContent('#asTrabajo'))));
  // enlaces antiguos
  await P.pg.goto(BASE + '#asig/eee/trabajo'); await P.pg.waitForFunction(() => location.hash === '#asig/eee/gestion', null, { timeout: 10000 });
  ok('enlace antiguo #asig/eee/trabajo → Gestión (profesor)', true);
  await P.pg.goto(BASE + '#asig/eee/tablon'); await P.pg.waitForFunction(() => location.hash === '#asig/eee/avisos', null, { timeout: 10000 });
  await P.pg.waitForSelector('#clAnuncio', { timeout: 10000 });
  ok('enlace antiguo #asig/eee/tablon → Avisos (formulario del tablón)', true);
  // la otra asignatura sigue como antes
  await P.pg.goto(BASE + '#asig/tic1'); await P.pg.waitForFunction(() => location.hash === '#asig/tic1/trabajo', null, { timeout: 10000 });
  ok('T.I.Cs (sin activar) sigue con «Trabajo de clase»', (await P.pg.$$eval('#asig .as-tabs [role=tab]', (l) => l.map((x) => x.textContent.trim()))).some((t) => /Trabajo de clase/.test(t)));

  // ---------------------------------------------------------------- v5 fase 2: importar con sección, tema, interactivo y origen
  if (!VIEJAS) {
    await P.pg.goto(BASE + '#asig/eee/gestion'); await P.pg.waitForSelector('#asTrabajo [data-cl=importarJSON]');
    await P.pg.click('#asTrabajo [data-cl=importarJSON]'); await P.pg.waitForSelector('.cl-modal [data-m-f=json]');
    const J = { elementos: [{ tipo: 'material', titulo: 'Guía del polímetro', seccion: 'laboratorio', tema: 'SA3 · Medidas', interactivo: { tipo: 'laboratorio', ref: '#eee/circuitos' }, origen: { drive: 'ID_DE_PRUEBA', ruta: '1_EEE_SA3/Polimetro', version: 'v2' } }] };
    await P.pg.fill('.cl-modal [data-m-f=json]', JSON.stringify(J)); await P.pg.click('.cl-modal [data-m=validar]');
    ok('importar: la vista previa muestra sección, tema, versión interactiva y origen', /sección laboratorio · tema «SA3 · Medidas» · versión interactiva \(laboratorio\) · origen 1_EEE_SA3\/Polimetro · v2/.test(await P.pg.textContent('#jsPrev')));
    await P.pg.click('.cl-modal [data-m=guardar]');
    await P.pg.waitForFunction(() => /Guardado/.test(document.querySelector('#jsMsg')?.textContent || ''), null, { timeout: 15000 });
    await P.pg.click('.cl-modal .cl-dlg-b1 > #jsPrev [data-m=cerrar]');
    await P.pg.waitForSelector('#asTrabajo .cl-it:has-text("Guía del polímetro")', { timeout: 15000 });
    const idG = await P.pg.getAttribute('#asTrabajo .cl-it:has-text("Guía del polímetro")', 'data-item');
    const dG = await leer('items/' + idG); const oG = await leer('origenes/' + idG);
    ok('importar: el elemento guarda «seccion» e «interactivo» (y no el origen)', dG.fields?.seccion?.stringValue === 'laboratorio' && dG.fields?.interactivo?.mapValue?.fields?.ref?.stringValue === '#eee/circuitos' && !dG.fields?.origen?.mapValue);
    ok('importar: el origen va aparte, en origenes/ (solo profesor)', oG.fields?.drive?.stringValue === 'ID_DE_PRUEBA' && oG.fields?.version?.stringValue === 'v2');
    const temas = (await (await fetch(`${REST}/temas`, owner)).json()).documents || [];
    ok('importar: «tema» por nombre crea el tema que falta', temas.some((t) => t.fields?.nombre?.stringValue === 'SA3 · Medidas'));
    await P.pg.goto(BASE + '#asig/eee/laboratorio'); await P.pg.waitForSelector(`#asTrabajo .cl-it[data-item="${idG}"]`, { timeout: 15000 });
    ok('Laboratorio: el elemento importado con «seccion» aparece ahí (aunque es un material)', true);
    ok('profesor: «Versión interactiva» en la fila', !!(await P.pg.$(`#asTrabajo .cl-it[data-item="${idG}"] .cl-cara[href="#eee/circuitos"]`)));
    // editor: el origen se carga y se puede cambiar; al guardar se conservan sección e interactivo
    await P.pg.evaluate((x) => document.querySelector(`#asTrabajo [data-item="${x}"] [data-cl=editar]`).click(), idG);
    await P.pg.waitForFunction(() => document.querySelector('#apItemForm [name=orDrive]')?.value === 'ID_DE_PRUEBA', null, { timeout: 10000 });
    ok('editor: «Sección» y el origen cargado (solo profesor)', (await P.pg.inputValue('#apItemForm [name=seccion]')) === 'laboratorio');
    await P.pg.fill('#apItemForm [name=orVer]', 'v3'); await P.pg.click('#apItemForm button[type=submit]');
    await P.pg.waitForSelector('#apItemForm', { state: 'detached', timeout: 15000 });
    await new Promise((r) => setTimeout(r, 800));
    ok('editor: guarda el origen nuevo y conserva sección e interactivo', (await leer('origenes/' + idG)).fields?.version?.stringValue === 'v3' && (await leer('items/' + idG)).fields?.seccion?.stringValue === 'laboratorio' && !!(await leer('items/' + idG)).fields?.interactivo);
    // v5 · punto 7: duplicar / reutilizar copia sección, interactivo y origen (la copia se borra después para no tocar el resto de la prueba)
    await P.pg.waitForSelector(`#asTrabajo [data-item="${idG}"] [data-cl=duplicar]`, { state: 'attached', timeout: 15000 });
    await P.pg.evaluate((x) => document.querySelector(`#asTrabajo [data-item="${x}"] [data-cl=duplicar]`).click(), idG);
    let dup = null;
    for (let i = 0; i < 20 && !dup; i++) { const L = (await (await fetch(`${REST}/items?pageSize=300`, owner)).json()).documents || []; dup = L.find((d) => d.fields?.titulo?.stringValue === 'Guía del polímetro (copia)') || null; if (!dup) await new Promise((r) => setTimeout(r, 500)); }
    const idDup = dup?.name.split('/').pop(); const oDup = idDup ? await leer('origenes/' + idDup) : null;
    ok('duplicar / reutilizar: la copia lleva sección, versión interactiva y origen (borrador)', !!dup && dup.fields.seccion?.stringValue === 'laboratorio' && dup.fields.interactivo?.mapValue?.fields?.ref?.stringValue === '#eee/circuitos' && dup.fields.publicado?.booleanValue === false && oDup?.fields?.version?.stringValue === 'v3', idDup || 'sin copia');
    if (idDup) { await fetch(`${REST}/items/${idDup}`, { method: 'DELETE', ...owner }); await fetch(`${REST}/origenes/${idDup}`, { method: 'DELETE', ...owner }); await new Promise((r) => setTimeout(r, 800)); }
  }

  // ---------------------------------------------------------------- Gestión: configurar secciones
  await P.pg.goto(BASE + '#asig/eee/gestion'); await P.pg.waitForSelector('#asTrabajo .sg-caja');
  if (VIEJAS) {
    // Reglas antiguas (sin pegar las v5): todo funciona con las secciones por defecto y se avisa al guardar.
    await P.pg.click('#asTrabajo [data-sg-det] > summary');
    ok('reglas antiguas: aviso «pegar las reglas nuevas» y «Guardar» desactivado', /reglas nuevas \(v5\)/.test(await P.pg.textContent('.sg-caja')) && await P.pg.$eval('[data-cl=secGuardar]', (x) => x.disabled));
    await P.pg.click('#asTrabajo [data-cl=nuevo], #asTrabajo [data-cl=crear]'); await P.pg.click('[data-cl=nuevo][data-tipo=material]');
    await P.pg.waitForSelector('#apItemForm'); ok('reglas antiguas: el editor no ofrece «Sección» (no escribiría campos nuevos)', !(await P.pg.$('#apItemForm [name=seccion]')));
    await P.pg.fill('#apItemForm [name=titulo]', 'Material con reglas antiguas'); await P.pg.click('#apItemForm button[type=submit]');
    await P.pg.waitForSelector('#asTrabajo .cl-it:has-text("Material con reglas antiguas")', { timeout: 15000 });
    ok('reglas antiguas: crear un elemento sigue funcionando', true);
    throw new Error('FIN');
  }
  await P.pg.click('#asTrabajo [data-sg-det] > summary');
  await P.pg.fill('.sg-fila[data-sec=teoria] [data-sg-nom]', 'Apuntes');
  await P.pg.uncheck('.sg-fila[data-sec=laboratorio] [data-sg-vis]');
  await P.pg.click('.sg-fila[data-sec=tareas] [data-cl=secUp]');
  await P.pg.click('[data-cl=secGuardar]');
  await P.pg.waitForFunction(() => /Guardado/.test(document.querySelector('.sg-caja .pn-msg')?.textContent || ''), null, { timeout: 15000 });
  const conf = await leer('config/secciones');
  const L = conf.fields?.asig?.mapValue?.fields?.eee?.arrayValue?.values?.map((v) => v.mapValue.fields) || [];
  ok('se guarda en config/secciones: nombre, orden y visibilidad', L.find((s) => s.id.stringValue === 'teoria')?.nombre?.stringValue === 'Apuntes' && L.find((s) => s.id.stringValue === 'laboratorio')?.visible?.booleanValue === false && L.findIndex((s) => s.id.stringValue === 'tareas') < L.findIndex((s) => s.id.stringValue === 'clase'));
  await P.pg.waitForFunction(() => document.querySelector('#tab-teoria .as-tt')?.textContent === 'Apuntes' && !document.querySelector('#tab-laboratorio'), null, { timeout: 10000 }).catch(() => {});
  ok('profesor: pestañas actualizadas (Apuntes, sin Laboratorio, Tareas antes que Ejercicios)', (await pestañas(P.pg)).join('|') === 'Avisos|Apuntes|Tareas|Ejercicios en clase|Test|Exámenes|Gestión', (await pestañas(P.pg)).join('|'));
  await P.pg.screenshot({ path: CAP + 'v5_profesor_gestion_secciones.png' });

  // ---------------------------------------------------------------- alumno
  const A = await contexto('alumno');
  await A.pg.goto(BASE); await loginAlumno(A.pg, G.codigo, 3, '4321');
  await A.pg.waitForSelector('.pchip-who', { timeout: 30000 });
  await A.pg.goto(BASE + '#asig/eee');
  await A.pg.waitForFunction(() => location.hash === '#asig/eee/avisos', null, { timeout: 15000 });
  await A.pg.waitForSelector('#asTrabajo .cl-stream', { timeout: 15000 });
  const ta = await pestañas(A.pg);
  ok('alumno: solo secciones visibles, sin Gestión ni Laboratorio oculto', ta.join('|') === 'Avisos|Apuntes|Tareas|Ejercicios en clase|Test|Exámenes', ta.join('|'));
  ok('alumno: Avisos = el tablón con el aviso', /Mañana traed el polímetro/.test(await A.pg.textContent('#asTrabajo')));
  await A.pg.waitForFunction(() => document.querySelector('#tab-tareas .as-n:not([hidden])'), null, { timeout: 10000 }).catch(() => {});
  ok('alumno: contador de pendientes en Tareas (2: tarea y pregunta; el borrador no cuenta)', ['2'].includes((await A.pg.textContent('#tab-tareas .as-n'))?.trim()), await A.pg.textContent('#tab-tareas .as-n'));
  ok('alumno: Apuntes cuenta la explicación por hacer, no el material (1)', (await A.pg.textContent('#tab-teoria .as-n'))?.trim() === '1');
  ok('alumno: Exámenes sin pendientes (sin contador)', await A.pg.$eval('#tab-examenes .as-n', (x) => x.hidden));
  await A.pg.click('#tab-tareas'); await A.pg.waitForSelector('#asTrabajo .cl-it');
  const ids = await A.pg.$$eval('#asTrabajo .cl-it[data-item]', (l) => l.map((x) => x.dataset.item).sort().join(','));
  ok('alumno: Tareas solo lo publicado (sin el borrador)', ids === 'itPre004,itTar003', ids);
  ok('alumno: agrupado por tema con filtro', (await A.pg.$$('#asTrabajo .cl-lado-b')).length === 3);
  await A.pg.click('#asTrabajo .cl-lado-b[data-tema=tmUno01]');
  ok('alumno: filtro por tema', (await A.pg.$$eval('#asTrabajo .cl-it[data-item]', (l) => l.map((x) => x.dataset.item).join(','))) === 'itTar003');
  await A.pg.screenshot({ path: CAP + 'v5_alumno_ordenador_tareas.png' });
  await A.pg.goto(BASE + '#asig/eee/teoria'); await A.pg.waitForSelector('#asTrabajo .cl-it[data-item=itMat001]', { timeout: 15000 });
  ok('alumno: «Ver PDF» en el material con PDF; sin «Versión interactiva» si no existe', !!(await A.pg.$('#asTrabajo .cl-fila .cl-cara[href="materiales/eee/sa1/SA1_Trabajo2_cables.pdf"]')) && !(await A.pg.$('#asTrabajo .cl-cara[title]')));
  await A.pg.click('#asTrabajo .cl-cara[href$=".pdf"]');
  ok('alumno: «Ver PDF» abre el visor del portal', !!(await A.pg.waitForSelector('#visorPdf, #visorArchivo', { timeout: 15000 }).catch(() => null)));
  await A.pg.screenshot({ path: CAP + 'v5_alumno_ver_pdf.png' });
  await A.pg.keyboard.press('Escape');
  await A.pg.goto(BASE + '#asig/eee/laboratorio'); await A.pg.waitForFunction(() => location.hash === '#asig/eee/avisos', null, { timeout: 10000 });
  ok('alumno: una sección oculta no se abre ni con el enlace (va a la primera)', true);
  await A.pg.goto(BASE + '#asig/eee/actividades'); await A.pg.waitForFunction(() => location.hash === '#asig/eee/clase', null, { timeout: 10000 });
  ok('alumno: enlace antiguo #asig/eee/actividades → Ejercicios en clase', !!(await A.pg.waitForSelector('#asTrabajo .cl-it[data-item=itAct005]', { timeout: 10000 })));
  await A.pg.goto(BASE + '#asig/eee/gestion'); await A.pg.waitForFunction(() => location.hash === '#asig/eee/avisos', null, { timeout: 10000 });
  ok('alumno: #…/gestion no existe para él', true);

  // ---------------------------------------------------------------- móvil
  const M = await contexto('alumno-movil', { width: 390, height: 844 });
  await M.pg.goto(BASE); await loginAlumno(M.pg, G.codigo, 4, '4321');
  await M.pg.waitForSelector('.pchip-who', { timeout: 30000 });
  await M.pg.goto(BASE + '#asig/eee/tareas'); await M.pg.waitForSelector('#asTrabajo .cl-it', { timeout: 15000 });
  const barra = await M.pg.$eval('#asig .as-tabs', (n) => { const r = n.getBoundingClientRect(); const cs = getComputedStyle(n); return { pos: cs.position, bottom: Math.round(innerHeight - r.bottom), w: r.width, scroll: n.scrollWidth > n.clientWidth || n.scrollWidth <= n.clientWidth }; });
  ok('móvil: barra inferior fija con las secciones', barra.pos === 'fixed' && barra.bottom >= 0 && barra.bottom < 40, JSON.stringify(barra));
  ok('móvil: cada sección con icono', (await M.pg.$$('#asig .as-tabs [role=tab] .as-ti svg')).length >= 6);
  await M.pg.screenshot({ path: CAP + 'v5_alumno_movil_tareas.png' });

  // ---------------------------------------------------------------- v5 fase 4: exportar la asignatura en PDF (ZIP)
  await poner('items/itTst008', { ...base, tipo: 'examen', titulo: 'Test: la ley de Ohm', tema: 'tmUno01', orden: 8, puntos: 10, examen: { desde: Date.now() - 864e5, hasta: Date.now() + 864e5, limiteMin: 20, barajar: true } });
  await poner('examenes/itTst008', { curso, asig: 'eee', desde: Date.now() - 864e5, hasta: Date.now() + 864e5, limiteMin: 20, barajar: true, grupos: [G.id], preguntas: [{ id: 'q1', tipo: 'test', enunciado: '¿En qué unidad se mide la resistencia?', puntos: 1, opciones: ['Voltio', 'Ohmio', 'Amperio'] }, { id: 'q2', tipo: 'vf', enunciado: 'La tensión se mide en paralelo.', puntos: 1 }] });
  await poner('claves/itTst008', { respuestas: { q1: 1, q2: true } });
  await P.pg.goto(BASE + '#asig/eee/gestion'); await P.pg.waitForSelector('#asTrabajo [data-cl=exportarZip]', { timeout: 15000 });
  await P.pg.waitForSelector('#asTrabajo .cl-it[data-item=itTst008]', { timeout: 15000 });
  await P.pg.click('#asTrabajo [data-cl=exportarZip]'); await P.pg.waitForSelector('.cl-modal [data-m=exZip]');
  ok('exportar: casillas por sección y por tema', (await P.pg.$$('.cl-modal [data-ex-sec]')).length === 6 && (await P.pg.$$('.cl-modal [data-ex-tema]')).length >= 3);
  await P.pg.waitForTimeout(800); await P.pg.screenshot({ path: CAP + 'v5_f4_exportar_dialogo.png' });
  const [dl] = await Promise.all([P.pg.waitForEvent('download', { timeout: 60000 }), P.pg.click('.cl-modal [data-m=exZip]')]);
  const rutaZip = CAP + 'v5_f4_ejemplo.zip'; await dl.saveAs(rutaZip);
  const { execFileSync } = await import('node:child_process');
  const info = JSON.parse(execFileSync('python3', ['-c', `import zipfile,json,sys
z=zipfile.ZipFile(sys.argv[1]); n=z.namelist(); m=json.loads(z.read('manifiesto.json'))
print(json.dumps({'n':n,'m':m,'pdf':all(z.read(x)[:4]==b'%PDF' for x in n if x.endswith('.pdf')),'sol':z.read([x for x in n if x.endswith('_soluciones.pdf')][0]).count(b'%PDF')}))`, rutaZip]).toString());
  ok('exportar: ZIP con carpetas por sección y tema, indice.pdf y manifiesto.json', info.n.includes('indice.pdf') && info.n.includes('manifiesto.json') && info.n.some((x) => /^1_Teoria\/01_SA1_Electricidad\/Apuntes_de_la_ley_de_Ohm\.pdf$/.test(x)), info.n.join(' '));
  ok('exportar: el test del portal pasa a PDF (preguntas y, aparte, soluciones)', info.n.includes('4_Test/01_SA1_Electricidad/Test_la_ley_de_Ohm.pdf') && info.n.includes('4_Test/01_SA1_Electricidad/Test_la_ley_de_Ohm_soluciones.pdf') && info.pdf);
  ok('exportar: manifiesto con sección, tema, título y archivo, sin datos de alumnos', info.m.archivos.some((a) => a.seccion === 'test' && a.tema === 'SA1 · Electricidad' && a.titulo === 'Test: la ley de Ohm' && a.archivo) && !/codigo|numero|alumno/i.test(JSON.stringify(info.m)));
  await P.pg.click('.cl-modal [data-m=cerrar]');
  // PDF de un cuestionario desde su menú
  await P.pg.evaluate(() => document.querySelector('#asTrabajo [data-item=itTst008] [data-cl=pdfCuestionario]').click());
  await P.pg.waitForSelector('.cl-modal [data-m=pdfSol]');
  const [dl2] = await Promise.all([P.pg.waitForEvent('download', { timeout: 30000 }), P.pg.click('.cl-modal [data-m=pdfSol]')]);
  ok('cuestionario: «PDF (enunciado y soluciones)» descarga las soluciones en PDF', /_soluciones\.pdf$/.test(dl2.suggestedFilename()), dl2.suggestedFilename());
  await P.pg.click('.cl-modal [data-m=cerrar]');

  // ---------------------------------------------------------------- importar solo algunas secciones (lo demás se conserva)
  await P.pg.goto(BASE + '#asig/eee/gestion'); await P.pg.waitForSelector('#asTrabajo [data-cl=importarJSON]');
  await P.pg.click('#asTrabajo [data-cl=importarJSON]'); await P.pg.waitForSelector('.cl-modal [data-m-f=json]');
  await P.pg.fill('.cl-modal [data-m-f=json]', JSON.stringify({ secciones: [{ id: 'examenes', nombre: 'Pruebas escritas' }] })); await P.pg.click('.cl-modal [data-m=validar]');
  ok('importar secciones: la vista previa lo enseña y avisa de que lo demás se queda', /Pruebas escritas\. Lo que no venga en el archivo se queda como está/.test(await P.pg.textContent('#jsPrev')));
  await P.pg.click('.cl-modal [data-m=guardar]');
  await P.pg.waitForFunction(() => /Secciones guardadas/.test(document.querySelector('#jsMsg')?.textContent || ''), null, { timeout: 15000 });
  const L2 = (await leer('config/secciones')).fields?.asig?.mapValue?.fields?.eee?.arrayValue?.values?.map((v) => v.mapValue.fields) || [];
  const s2 = (id) => L2.find((x) => x.id.stringValue === id);
  ok('importar secciones: cambia solo lo que trae y conserva el resto (Apuntes, Laboratorio oculto)', s2('examenes')?.nombre?.stringValue === 'Pruebas escritas' && s2('teoria')?.nombre?.stringValue === 'Apuntes' && s2('laboratorio')?.visible?.booleanValue === false, JSON.stringify(L2.map((x) => x.id.stringValue + ':' + x.nombre?.stringValue)));
  await P.pg.click('.cl-modal header [data-m=cerrar]').catch(() => {});

  // ---------------------------------------------------------------- migración solo en lectura
  const despues = JSON.stringify(await Promise.all(Object.keys(ITEMS).map((id) => leer('items/' + id).then((d) => d.fields))));
  ok('migración en lectura: ningún elemento se ha reescrito (tampoco se añade «seccion»)', antes === despues && !/"seccion"/.test(despues));
} catch (e) { if (e.message !== 'FIN') { ok('sin excepciones', false, e.message); console.log(e.stack); } }
ok('sin errores de consola', errores.length === 0, errores.slice(0, 5).join(' | '));
await b.close();
const n = results.filter((r) => r.ok).length; console.log(`\n${n}/${results.length} OK`);
process.exit(n === results.length ? 0 : 1);

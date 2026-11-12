// Capturas «antes / después» de la revisión de la interfaz (profesor y alumno), con los emuladores.
//   FASE=antes|despues  (lo lanza e2e/capturas_ux.sh)
import { chromium } from 'playwright-core';
import { SHOTS as SHOTS_DIR } from '../rutas.mjs';
const FASE = process.env.FASE || 'despues';
const BASE = process.env.PORTAL_BASE || 'http://127.0.0.1:8765/index.html';
const SHOTS = SHOTS_DIR + 'ux_' + FASE + '_';
const PROJ = 'demo-portal';
const CFG = `window.PORTAL_FIREBASE={apiKey:'demo-key',authDomain:'${PROJ}.firebaseapp.com',projectId:'${PROJ}',appId:'1:1:web:1'};window.PORTAL_FIREBASE_EMU={auth:'http://127.0.0.1:9099',firestoreHost:'127.0.0.1',firestorePort:8080};`;
const REST = `http://127.0.0.1:8080/v1/projects/${PROJ}/databases/(default)/documents`;
const owner = { 'Authorization': 'Bearer owner', 'Content-Type': 'application/json' };
const val = (v) => v === null ? { nullValue: null } : Array.isArray(v) ? { arrayValue: { values: v.map(val) } } : typeof v === 'boolean' ? { booleanValue: v } : typeof v === 'number' ? (Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v }) : typeof v === 'object' ? { mapValue: { fields: Object.fromEntries(Object.entries(v).map(([k, x]) => [k, val(x)])) } } : { stringValue: String(v) };
const poner = (ruta, datos) => fetch(`${REST}/${ruta}`, { method: 'PATCH', headers: owner, body: JSON.stringify({ fields: val(datos).mapValue.fields }) }).then((r) => { if (!r.ok) throw new Error(ruta + ' ' + r.status); });
await fetch(`http://127.0.0.1:8080/emulator/v1/projects/${PROJ}/databases/(default)/documents`, { method: 'DELETE' });
await fetch(`http://127.0.0.1:9099/emulator/v1/projects/${PROJ}/accounts`, { method: 'DELETE' });
const C = 'c2026-27', G = 'g2cfgb', COD = 'FARO-472';
await poner(`cursos/${C}`, { nombre: '2026/27', asignaturas: ['tic1', 'eee'], activo: true, pesos: {}, creado: Date.now() });
const grupo = { nombre: '2º CFGB', asignaturas: ['eee'], apartados: ['esp32', 'circuitos', 'vivienda'], activo: true, horario: null, curso: C };
await poner(`grupos/${G}`, { ...grupo, codigo: COD, creado: Date.now(), alumnos: 12 });
await poner(`codigos/${COD}`, { ...grupo, grupo: G });
await poner('anuncios/anun01x', { curso: C, asig: 'eee', texto: 'Mañana traed los destornilladores y el polímetro para el tablero.', enlaces: [], grupos: [G], visible: [G], fecha: Date.now() - 3600e3, pub: null });

const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const errores = [];
async function contexto(nombre, viewport = { width: 1440, height: 900 }) {
  const ctx = await b.newContext({ viewport });
  await ctx.route('**/js/firebase-config.js*', (r) => r.fulfill({ contentType: 'application/javascript', body: CFG }));
  const pg = await ctx.newPage();
  pg.on('pageerror', (e) => errores.push(`[${nombre}] ${e.message}`));
  pg.on('dialog', (d) => d.accept());
  return { ctx, pg };
}
const espera = (pg, ms = 1800) => pg.waitForTimeout(ms);
const foto = async (pg, hash, nombre, ms) => { await pg.evaluate((h) => { location.hash = h; }, hash); await espera(pg, ms); await pg.screenshot({ path: SHOTS + nombre + '.png', fullPage: false }); console.log('📸', FASE, nombre, hash); };

const P = await contexto('profesor');
await P.pg.goto(BASE); await P.pg.waitForSelector('#gate-body:not([hidden])', { timeout: 20000 });
await P.pg.screenshot({ path: SHOTS + 'entrada.png' });
await P.pg.click('[data-gate-rol="profesor"]');
const [pop] = await Promise.all([P.pg.waitForEvent('popup'), P.pg.click('#gate-google')]);
await pop.waitForLoadState(); await pop.click('text=Add new account'); await pop.fill('#email-input', 'profe@test.es'); await pop.fill('#display-name-input', 'Profe'); await pop.click('#sign-in');
await P.pg.waitForFunction(() => window.__clase && document.body.classList.contains('scr-panelprof'), null, { timeout: 30000 });
await espera(P.pg, 1500);
await P.pg.evaluate(() => window.__clase.importar('eee'));
await P.pg.click('.cl-modal [data-m=importar]');
await P.pg.waitForFunction(() => /✔/.test(document.querySelector('#clImpMsg')?.textContent || ''), null, { timeout: 30000 });
await P.pg.click('.cl-modal [data-m=cerrar]');
const T = FASE === 'antes'
  ? [['#inicio', 'profesor_portada'], ['#asignaturas', 'profesor_asignaturas'], ['#biblioteca', 'profesor_biblioteca'], ['#biblioteca/eee', 'profesor_biblioteca_eee'], ['#eee', 'profesor_eee'], ['#asig/tic1', 'profesor_tic1'], ['#panel/grupos', 'profesor_panel'], ['#panel/contenido', 'profesor_panel_contenido']]
  : [['#inicio', 'profesor_portada'], ['#asignaturas', 'profesor_asignaturas'], ['#biblioteca', 'profesor_biblioteca'], ['#asig/eee/organizacion', 'profesor_eee_organizacion'], ['#asig/eee/trabajo', 'profesor_eee_trabajo'], ['#asig/eee/tablon', 'profesor_eee_tablon'], ['#asig/eee/laboratorio', 'profesor_eee_laboratorio'], ['#asig/eee/actividades', 'profesor_eee_actividades'], ['#asig/tic1/laboratorio', 'profesor_tic1_laboratorio'], ['#asig/tic1/organizacion', 'profesor_tic1_organizacion'], ['#panel/grupos', 'profesor_panel'], ['#panel/notas', 'profesor_panel_cuaderno'], ['#panel/ajustes', 'profesor_panel_ajustes']];
for (const [h, n] of T) await foto(P.pg, h, n);
if (FASE === 'despues') {
  // vista previa del alumno: «Trabajo de clase»
  await P.pg.evaluate(() => { location.hash = '#asig/eee/tablon'; }); await espera(P.pg, 1200);
  await P.pg.click('[data-cl=verTab][data-v=trabajo]'); await espera(P.pg, 600);
  await P.pg.screenshot({ path: SHOTS + 'profesor_eee_tablon_vista_trabajo.png' }); console.log('📸 profesor_eee_tablon_vista_trabajo');
  await P.pg.evaluate(() => { location.hash = '#asig/eee/actividades/maletin'; }); await espera(P.pg, 2500);
  await P.pg.screenshot({ path: SHOTS + 'profesor_actividad_intro.png' });
  await P.pg.click('[data-ac=empezar]'); await espera(P.pg, 800); await P.pg.click('[data-ac=pieza] >> nth=0'); await espera(P.pg, 1200);
  await P.pg.screenshot({ path: SHOTS + 'profesor_actividad_ronda.png' }); console.log('📸 profesor_actividad_*');
}

const A = await contexto('alumno');
await A.pg.goto(BASE + (FASE === 'antes' ? '#eee' : '#asig/eee'));
await A.pg.waitForSelector('#gate-body:not([hidden])', { timeout: 20000 });
await A.pg.fill('#gate-code', COD); await A.pg.selectOption('#gate-num', '3'); await A.pg.fill('#gate-pin', '5555'); await A.pg.click('#gate-alumno .gate-go');
await A.pg.waitForFunction(() => document.querySelector('.cl-it, .cl-post'), null, { timeout: 30000 });
await espera(A.pg, 1500);
const TA = FASE === 'antes'
  ? [['#asignaturas', 'alumno_asignaturas'], ['#eee', 'alumno_eee']]
  : [['#asignaturas', 'alumno_asignaturas'], ['#asig/eee/tablon', 'alumno_eee_tablon'], ['#asig/eee/trabajo', 'alumno_eee_trabajo'], ['#asig/eee/laboratorio', 'alumno_eee_laboratorio'], ['#asig/eee/actividades', 'alumno_eee_actividades']];
for (const [h, n] of TA) await foto(A.pg, h, n);
if (FASE === 'despues') {
  await A.pg.evaluate(() => { location.hash = '#asig/eee/actividades/cables'; }); await espera(A.pg, 2500);
  await A.pg.click('[data-ac=empezar]'); await espera(A.pg, 1500);
  await A.pg.screenshot({ path: SHOTS + 'alumno_actividad_cables.png' }); console.log('📸 alumno_actividad_cables');
  const M = await contexto('alumno-movil', { width: 390, height: 844 });
  await M.pg.goto(BASE + '#asig/eee'); await M.pg.waitForSelector('#gate-body:not([hidden])', { timeout: 20000 });
  await M.pg.screenshot({ path: SHOTS + 'movil_entrada.png' });
  await M.pg.fill('#gate-code', COD); await M.pg.selectOption('#gate-num', '4'); await M.pg.fill('#gate-pin', '4444'); await M.pg.click('#gate-alumno .gate-go');
  await M.pg.waitForFunction(() => document.querySelector('.cl-it, .cl-post'), null, { timeout: 30000 }); await espera(M.pg, 1200);
  await M.pg.screenshot({ path: SHOTS + 'movil_alumno_tablon.png' });
  await foto(M.pg, '#asig/eee/actividades', 'movil_alumno_actividades', 4500);
  await foto(M.pg, '#asig/eee/actividades/maletin', 'movil_alumno_actividad', 2500);
}
console.log(errores.length ? 'ERRORES: ' + errores.join(' | ') : 'sin errores');
await b.close();

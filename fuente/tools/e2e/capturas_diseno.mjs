// Capturas «antes / después» del rediseño visual (estilo iOS) de todas las pantallas, con los emuladores.
//   FASE=antes|despues  bash e2e/capturas_diseno.sh   → fuente/capturas/diseno_<fase>_*.png
import { chromium } from 'playwright-core';
import { SHOTS as SHOTS_DIR } from '../rutas.mjs';
const FASE = process.env.FASE || 'despues';
const BASE = process.env.PORTAL_BASE || 'http://127.0.0.1:8765/index.html';
const SHOTS = SHOTS_DIR + 'diseno_' + FASE + '_';
const PROJ = 'demo-portal';
const CFG = `window.PORTAL_FIREBASE={apiKey:'demo-key',authDomain:'${PROJ}.firebaseapp.com',projectId:'${PROJ}',appId:'1:1:web:1'};window.PORTAL_FIREBASE_EMU={auth:'http://127.0.0.1:9099',firestoreHost:'127.0.0.1',firestorePort:8080};`;
const REST = `http://127.0.0.1:8080/v1/projects/${PROJ}/databases/(default)/documents`;
const owner = { 'Authorization': 'Bearer owner', 'Content-Type': 'application/json' };
const val = (v) => v === null ? { nullValue: null } : Array.isArray(v) ? { arrayValue: { values: v.map(val) } } : typeof v === 'boolean' ? { booleanValue: v } : typeof v === 'number' ? (Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v }) : typeof v === 'object' ? { mapValue: { fields: Object.fromEntries(Object.entries(v).map(([k, x]) => [k, val(x)])) } } : { stringValue: String(v) };
const poner = (ruta, datos) => fetch(`${REST}/${ruta}`, { method: 'PATCH', headers: owner, body: JSON.stringify({ fields: val(datos).mapValue.fields }) }).then((r) => { if (!r.ok) throw new Error(ruta + ' ' + r.status); });
await fetch(`http://127.0.0.1:8080/emulator/v1/projects/${PROJ}/databases/(default)/documents`, { method: 'DELETE' });
await fetch(`http://127.0.0.1:9099/emulator/v1/projects/${PROJ}/accounts`, { method: 'DELETE' });
const C = 'c2026-27', G = 'g2cfgb', COD = 'FARO-472';
await poner(`cursos/${C}`, { nombre: '2026/27', asignaturas: ['tic1', 'eee', 'cdpc1', 'proy2'], activo: true, pesos: {}, creado: Date.now() });
const grupo = { nombre: '2º CFGB', asignaturas: ['eee'], apartados: ['esp32', 'circuitos', 'vivienda'], activo: true, horario: null, curso: C };
await poner(`grupos/${G}`, { ...grupo, codigo: COD, creado: Date.now(), alumnos: 12 });
await poner(`codigos/${COD}`, { ...grupo, grupo: G });
await poner('anuncios/anun01x', { curso: C, asig: 'eee', texto: 'Mañana traed los destornilladores y el polímetro para el tablero.', enlaces: [], grupos: [G], visible: [G], fecha: Date.now() - 3600e3, pub: null });

const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const errores = [], hechas = [];
async function contexto(nombre, viewport = { width: 1440, height: 900 }, colorScheme = 'light') {
  const ctx = await b.newContext({ viewport, colorScheme });
  await ctx.route('**/js/firebase-config.js*', (r) => r.fulfill({ contentType: 'application/javascript', body: CFG }));
  const pg = await ctx.newPage();
  pg.on('pageerror', (e) => errores.push(`[${nombre}] ${e.message}`));
  pg.on('dialog', (d) => d.accept());
  return { ctx, pg };
}
const espera = (pg, ms = 1800) => pg.waitForTimeout(ms);
const shot = async (pg, nombre) => { await pg.screenshot({ path: SHOTS + nombre + '.png', timeout: 90000 }); hechas.push(nombre); console.log('foto', FASE, nombre); };
const foto = async (pg, hash, nombre, ms = 1800, antes = null) => {
  try { await pg.evaluate((h) => { location.hash = h; }, hash); await espera(pg, ms); if (antes) await antes(pg); await shot(pg, nombre); }
  catch (e) { errores.push(`[foto ${nombre}] ${e.message.split('\n')[0]}`); }
};
async function entraProfesor(P) {
  await P.pg.goto(BASE); await P.pg.waitForSelector('#gate-body:not([hidden])', { timeout: 20000 });
  await P.pg.click('[data-gate-rol="profesor"]');
  const [pop] = await Promise.all([P.pg.waitForEvent('popup'), P.pg.click('#gate-google')]);
  await pop.waitForLoadState(); await pop.click('text=Add new account'); await pop.fill('#email-input', 'profe@test.es'); await pop.fill('#display-name-input', 'Profe'); await pop.click('#sign-in');
  await P.pg.waitForFunction(() => window.__clase && document.body.classList.contains('scr-panelprof'), null, { timeout: 30000 });
  await espera(P.pg, 1500);
}
async function entraAlumno(A, num = '3', pin = '5555', hash = '#asig/eee') {
  await A.pg.goto(BASE + hash); await A.pg.waitForSelector('#gate-body:not([hidden])', { timeout: 20000 });
  await A.pg.fill('#gate-code', COD); await A.pg.selectOption('#gate-num', num); await A.pg.fill('#gate-pin', pin); await A.pg.click('#gate-alumno .gate-go');
  await A.pg.waitForFunction(() => document.querySelector('.cl-it, .cl-post'), null, { timeout: 30000 });
  await espera(A.pg, 1200);
}

// ---------------- profesor (escritorio) ----------------
const P = await contexto('profesor');
await P.pg.goto(BASE); await P.pg.waitForSelector('#gate-body:not([hidden])', { timeout: 20000 }); await espera(P.pg, 600);
await shot(P.pg, '01_entrada');
await P.pg.click('[data-gate-rol="profesor"]'); await espera(P.pg, 300); await shot(P.pg, '02_entrada_profesor');
await entraProfesor(P);
await P.pg.evaluate(() => window.__clase.importar('eee'));
await espera(P.pg, 800); await shot(P.pg, '30_dialogo_importar');
await P.pg.click('.cl-modal [data-m=importar]');
await P.pg.waitForFunction(() => /✔/.test(document.querySelector('#clImpMsg')?.textContent || ''), null, { timeout: 30000 });
await P.pg.click('.cl-modal [data-m=cerrar]');
const T = [
  ['#inicio', '03_portada'], ['#asignaturas', '04_asignaturas'], ['#biblioteca', '05_biblioteca'],
  ['#asig/eee/organizacion', '06_asig_organizacion'], ['#asig/eee/trabajo', '07_asig_trabajo'], ['#asig/eee/tablon', '08_asig_tablon'],
  ['#asig/eee/laboratorio', '09_asig_laboratorio'], ['#asig/eee/actividades', '10_asig_actividades'],
  ['#panel/grupos', '11_panel_grupos'], ['#panel/notas', '12_panel_cuaderno'], ['#panel/entregas', '13_panel_entregas'], ['#panel/ajustes', '14_panel_ajustes'],
];
for (const [h, n] of T) await foto(P.pg, h, n);
await foto(P.pg, '#asig/eee/trabajo', '31_menu_crear', 1500, async (pg) => { await pg.click('[data-cl=crear]'); await espera(pg, 400); });
await foto(P.pg, '#asig/eee/trabajo', '32_editor_tarea', 1500, async (pg) => { if (!(await pg.$('.cl-crear-m'))) { await pg.click('[data-cl=crear]'); await espera(pg, 300); } await pg.click('[data-cl=nuevo][data-tipo=tarea]'); await espera(pg, 900); });
await P.pg.keyboard.press('Escape').catch(() => {}); await P.pg.evaluate(() => document.querySelector('.cl-modal [data-m=cerrar]')?.click());
// laboratorios
const L = [
  ['#eee/esp32', '15_esp32_inicio', 4500], ['#p1-3', '16_esp32_paso', 3500], ['#p3-3', '17_esp32_esquema', 2500, async (pg) => { await pg.click('#tabs button[data-tab="esquema"]'); await espera(pg, 400); }],
  ['#p1-99', '18_esp32_grabar', 3500],
  ['#eee/circuitos', '19_circuitos_inicio', 3000], ['#eee/circuitos/c1', '20_circuitos_editor', 5000],
  ['#eee/vivienda', '21_vivienda_inicio', 3500], ['#eee/vivienda/p1', '22_vivienda_proyecto', 5000], ['#eee/vivienda/p2-montar', '23_vivienda_montar', 5000],
  ['#eee/vivienda/libre', '24_vivienda_libre', 5000], ['#eee/vivienda/taller', '25_vivienda_taller', 5000], ['#eee/vivienda/tablero', '26_vivienda_cuadro', 5000],
  ['#eee/vivienda/creditos', '27_creditos', 2500],
  ['#asig/eee/actividades/maletin', '28_actividad_intro', 3000],
];
for (const [h, n, ms, f] of L) await foto(P.pg, h, n, ms, f);
await foto(P.pg, '#asig/eee/actividades/maletin', '29_actividad_juego', 3000, async (pg) => { await pg.click('[data-ac=empezar]'); await espera(pg, 2500); });

// ---------------- alumno ----------------
const A = await contexto('alumno');
await entraAlumno(A);
for (const [h, n] of [['#asignaturas', '40_alumno_asignaturas'], ['#asig/eee/tablon', '41_alumno_tablon'], ['#asig/eee/trabajo', '42_alumno_trabajo'], ['#asig/eee/actividades', '43_alumno_actividades']]) await foto(A.pg, h, n);
try {
  await A.pg.evaluate(() => { location.hash = '#asig/eee/trabajo'; }); await espera(A.pg, 1500);
  const href = await A.pg.evaluate(() => document.querySelector('a.cl-it[href^="#trabajo/"], .cl-it a[href^="#trabajo/"]')?.getAttribute('href'));
  if (href) await foto(A.pg, href, '44_alumno_elemento', 2000);
} catch (e) { errores.push('[alumno elemento] ' + e.message); }

// ---------------- móvil (390 × 844) ----------------
const M = await contexto('movil', { width: 390, height: 844 });
await M.pg.goto(BASE + '#asig/eee'); await M.pg.waitForSelector('#gate-body:not([hidden])', { timeout: 20000 }); await espera(M.pg, 600);
await shot(M.pg, '50_movil_entrada');
await entraAlumno(M, '4', '4444');
await shot(M.pg, '51_movil_tablon');
for (const [h, n, ms] of [['#asignaturas', '52_movil_asignaturas'], ['#asig/eee/laboratorio', '53_movil_laboratorio'], ['#p1-3', '54_movil_esp32', 4000], ['#eee/vivienda', '55_movil_vivienda', 3500], ['#eee/circuitos/c1', '56_movil_circuitos', 5000]]) await foto(M.pg, h, n, ms);

// ---------------- modo oscuro (solo después) ----------------
if (FASE === 'despues') {
  const D = await contexto('oscuro', { width: 1440, height: 900 }, 'dark');
  await D.pg.goto(BASE); await D.pg.waitForSelector('#gate-body:not([hidden])', { timeout: 20000 }); await espera(D.pg, 600);
  await shot(D.pg, '60_oscuro_entrada');
  await entraProfesor(D);
  for (const [h, n, ms] of [['#inicio', '61_oscuro_portada'], ['#asignaturas', '62_oscuro_asignaturas'], ['#asig/eee/trabajo', '63_oscuro_trabajo'], ['#asig/eee/laboratorio', '64_oscuro_laboratorio'], ['#panel/grupos', '65_oscuro_panel'], ['#p1-3', '66_oscuro_esp32', 4000], ['#eee/vivienda', '67_oscuro_vivienda', 3500], ['#eee/circuitos', '68_oscuro_circuitos', 3000]]) await foto(D.pg, h, n, ms);
  const DM = await contexto('oscuro-movil', { width: 390, height: 844 }, 'dark');
  await entraAlumno(DM, '5', '5151');
  await shot(DM.pg, '69_oscuro_movil_tablon');
}
console.log(hechas.length + ' capturas'); console.log(errores.length ? 'ERRORES: ' + errores.join(' | ') : 'sin errores');
await b.close();

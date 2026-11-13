// E2E de las novedades de la rama grok-plataforma, con los emuladores (Auth + Firestore).
// Se lanza con e2e/run_plataforma.sh. FASES=1,2,… elige qué partes se prueban (por defecto, todas).
// Capturas: fuente/capturas/fN_*.png
import { chromium } from 'playwright-core';
import { SHOTS } from '../rutas.mjs';

const FS = process.env.E2E_FS_PORT || '8080'; const AU = process.env.E2E_AUTH_PORT || '9099';
const BASE = process.env.PORTAL_BASE || `http://127.0.0.1:${process.env.E2E_HTTP_PORT || '8765'}/index.html`;
const PROJ = 'demo-portal';
const CFG = `window.PORTAL_FIREBASE={apiKey:'demo-key',authDomain:'${PROJ}.firebaseapp.com',projectId:'${PROJ}',appId:'1:1:web:1'};window.PORTAL_FIREBASE_EMU={auth:'http://127.0.0.1:${AU}',firestoreHost:'127.0.0.1',firestorePort:${FS}};`;
const FASES = (process.env.FASES || '1,2,3,4,5,6,7,8,9,10,11,12,13,14').split(',').map(Number);
const results = []; const errores = [];
export const ok = (name, cond, info = '') => { results.push({ name, ok: !!cond, info }); console.log((cond ? 'OK  ' : 'FAIL') + ' ' + name + (info ? ' · ' + info : '')); };
const benigno = (t) => /favicon|WebGL|GPU stall|swiftshader|GroupMarkerNotSet|Failed to load resource/i.test(t);
const REST = `http://127.0.0.1:${FS}/v1/projects/${PROJ}/databases/(default)/documents`;
const owner = { headers: { Authorization: 'Bearer owner' } };
const PROMPT = [];
const shot = (pg, n) => pg.screenshot({ path: SHOTS + n + '.png' });
const docREST = async (ruta) => (await fetch(`${REST}/${ruta}`, owner)).json();

await fetch(`http://127.0.0.1:${FS}/emulator/v1/projects/${PROJ}/databases/(default)/documents`, { method: 'DELETE' });
await fetch(`http://127.0.0.1:${AU}/emulator/v1/projects/${PROJ}/accounts`, { method: 'DELETE' });
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'] });
async function contexto(nombre, viewport = { width: 1440, height: 900 }) {
  const ctx = await b.newContext({ viewport, acceptDownloads: true });
  await ctx.route('**/js/firebase-config.js*', (r) => r.fulfill({ contentType: 'application/javascript', body: CFG }));
  const pg = await ctx.newPage();
  pg.on('console', (m) => { if (m.type() === 'error' && !benigno(m.text())) errores.push(`[${nombre}] console: ${m.text()}`); });
  pg.on('pageerror', (e) => errores.push(`[${nombre}] pageerror: ${e.message}`));
  pg.on('dialog', (d) => (d.type() === 'prompt' ? d.accept(PROMPT.shift() ?? d.defaultValue()) : d.accept()));
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
export const local = (ms) => { const d = new Date(ms); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16); };
async function pegarJSON(pg, obj) {
  await pg.click('#asTrabajo [data-cl=importarJSON]');
  await pg.waitForSelector('.cl-modal [data-m-f=json]');
  await pg.fill('.cl-modal [data-m-f=json]', typeof obj === 'string' ? obj : JSON.stringify(obj, null, 2));
  await pg.click('.cl-modal [data-m=validar]');
}
async function guardarJSON(pg) {
  await pg.click('.cl-modal [data-m=guardar]');
  await pg.waitForFunction(() => /Guardado|guardados/.test(document.querySelector('#jsMsg')?.textContent || ''), null, { timeout: 15000 });
  await pg.click('.cl-modal .cl-dlg-b1 > #jsPrev [data-m=cerrar]');
}

const T = {}; // estado compartido entre fases
try {
  // ================================================================ preparación: curso, grupos, alumno
  const P = await contexto('profesor'); T.P = P;
  await P.pg.goto(BASE); await loginGoogle(P.pg, 'profe@test.es');
  await P.pg.waitForSelector('#pnGrupoForm', { timeout: 30000 });
  await P.pg.goto(BASE + '#panel/cursos'); await P.pg.waitForSelector('#apCursoForm');
  for (const a of ['tic1', 'cdpc1', 'tic2', 'proy2', 'eee']) await P.pg.check(`#apCursoForm [name=asig][value=${a}]`);
  await P.pg.click('#apCursoForm button[type=submit]');
  await P.pg.waitForSelector('.pn-grupo[data-curso] h3:has-text("2026/27")', { timeout: 15000 });
  async function crearGrupo(nombre, asigs) {
    await P.pg.goto(BASE + '#panel/grupos');
    await P.pg.waitForFunction(() => document.querySelector('#pnGrupoForm [name=curso]')?.selectedOptions[0]?.textContent.includes('2026/27'), null, { timeout: 15000 });
    await P.pg.fill('#pnGrupoForm [name=nombre]', nombre); await P.pg.fill('#pnGrupoForm [name=alumnos]', '12');
    for (const cb of await P.pg.$$('#pnGrupoForm [name=asig]')) { const v = await cb.getAttribute('value'); if (asigs.includes(v) !== await cb.isChecked()) await cb.click(); }
    await P.pg.click('#pnGrupoForm button[type=submit]');
    await P.pg.waitForFunction(() => /creado/.test(document.querySelector('#pnFormMsg')?.textContent || ''), null, { timeout: 15000 });
    return P.pg.evaluate((n) => { const g = [...document.querySelectorAll('.pn-grupo')].find((x) => x.querySelector('h3').textContent === n); return { codigo: g.querySelector('.pn-code').textContent, id: g.dataset.grupo }; }, nombre);
  }
  T.GE = await crearGrupo('2º CFGB', ['eee', 'proy2']);
  T.GB = await crearGrupo('1º Bach A', ['tic1', 'cdpc1', 'tic2']);
  ok('preparación: curso y grupos', !!T.GE.codigo && !!T.GB.codigo);
  T.alumno = async (grupo, n, pin = '4321', viewport) => { const A = await contexto('alumno' + n, viewport); await A.pg.goto(BASE); await loginAlumno(A.pg, grupo.codigo, n, pin); await A.pg.waitForSelector('#cover .btn-enter, #subjects', { timeout: 30000 }); return A; };

  for (const f of FASES) {
    const mod = await import(`./plataforma_f${f}.mjs`).catch((e) => (/Cannot find module|ERR_MODULE_NOT_FOUND/.test(String(e)) ? null : Promise.reject(e)));
    if (!mod) continue;
    console.log(`--- Fase ${f}`);
    try { await mod.default({ T, BASE, ok, shot, docREST, pegarJSON, guardarJSON, local, PROMPT, REST, owner }); }
    catch (e) { ok(`fase ${f} sin excepciones`, false, String(e?.message || e).split('\n').slice(0, 4).join(' | ')); }
  }
} catch (e) { ok('sin excepciones', false, String(e?.message || e).split('\n').slice(0, 4).join(' | ')); }
ok('sin errores de consola', !errores.length, errores.slice(0, 5).join(' || '));
await b.close();
const fallos = results.filter((r) => !r.ok);
console.log(`${results.length - fallos.length}/${results.length} OK`);
process.exit(fallos.length ? 1 : 0);

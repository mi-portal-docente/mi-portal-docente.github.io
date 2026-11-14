// E2E de la protección de evidencias (P2-P4) con los emuladores: copia congelada con huella, prueba sin elementos
// externos (bloqueo y código), pregunta con datos por alumno y «Exportar evidencias» + visor.
// Lanzar (desde fuente/tools/firebase):  npx firebase emulators:exec --only auth,firestore --project demo-portal "node ../e2e/proteccion_e2e.mjs"
// con la web servida en http://127.0.0.1:8765 (ver e2e/ejecutar.sh).
import { chromium } from 'playwright-core';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { SHOTS } from '../rutas.mjs';
import { valoresAlumno } from '../src/lms/formula.js';
import { semillaAlumno } from '../src/lms/modelo.js';

const FSP = process.env.E2E_FS_PORT || '8080', AUP = process.env.E2E_AUTH_PORT || '9099';
const BASE = process.env.PORTAL_BASE || 'http://127.0.0.1:8765/index.html';
const PROJ = 'demo-portal';
const CFG = `window.PORTAL_FIREBASE={apiKey:'demo-key',authDomain:'${PROJ}.firebaseapp.com',projectId:'${PROJ}',appId:'1:1:web:1'};window.PORTAL_FIREBASE_EMU={auth:'http://127.0.0.1:${AUP}',firestoreHost:'127.0.0.1',firestorePort:${FSP}};`;
const REST = `http://127.0.0.1:${FSP}/v1/projects/${PROJ}/databases/(default)/documents`;
const owner = { Authorization: 'Bearer owner' };
const res = []; const ok = (n, c, i = '') => { res.push(!!c); console.log((c ? 'OK  ' : 'FAIL') + ' ' + n + (i ? ' · ' + i : '')); };
const errores = []; const benigno = (t) => /favicon|WebGL|GPU stall|swiftshader|GroupMarkerNotSet|permission|PERMISSION|400 \(\)|403/i.test(t);

// ---- valores de Firestore (REST)
const V = (v) => {
  if (v === null || v === undefined) return { nullValue: null };
  if (v instanceof Date) return { timestampValue: v.toISOString() };
  if (typeof v === 'boolean') return { booleanValue: v };
  if (typeof v === 'number') return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if (typeof v === 'string') return { stringValue: v };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(V) } };
  return { mapValue: { fields: Object.fromEntries(Object.entries(v).map(([k, x]) => [k, V(x)])) } };
};
const D = (x) => { if (!x) return x; const [t, v] = Object.entries(x)[0]; if (t === 'mapValue') return Object.fromEntries(Object.entries(v.fields || {}).map(([k, y]) => [k, D(y)])); if (t === 'arrayValue') return (v.values || []).map(D); if (t === 'integerValue') return Number(v); if (t === 'nullValue') return null; return v; };
const poner = (ruta, obj) => fetch(`${REST}/${ruta}`, { method: 'PATCH', headers: { ...owner, 'Content-Type': 'application/json' }, body: JSON.stringify({ fields: V(obj).mapValue.fields }) }).then((r) => { if (!r.ok) throw new Error('semilla ' + ruta + ' ' + r.status); });
const leer = async (ruta) => { const r = await fetch(`${REST}/${ruta}`, { headers: owner }); if (!r.ok) return null; const j = await r.json(); return D({ mapValue: { fields: j.fields } }); };
const lista = async (col) => { const r = await fetch(`${REST}/${col}?pageSize=100`, { headers: owner }); const j = await r.json(); return (j.documents || []).map((d) => ({ id: d.name.split('/').pop(), ...D({ mapValue: { fields: d.fields } }) })); };

await fetch(`http://127.0.0.1:${FSP}/emulator/v1/projects/${PROJ}/databases/(default)/documents`, { method: 'DELETE' });
await fetch(`http://127.0.0.1:${AUP}/emulator/v1/projects/${PROJ}/accounts`, { method: 'DELETE' });
const ahora = Date.now();
await poner('cursos/c2627', { nombre: '2026/27', asignaturas: ['eee'], activo: true, pesos: {}, creado: 1 });
await poner('grupos/gE', { nombre: '2º CFGB', asignaturas: ['eee'], apartados: [], codigo: 'FARO-472', activo: true, horario: null, creado: 1, curso: 'c2627', alumnos: 12 });
await poner('codigos/FARO-472', { grupo: 'gE', nombre: '2º CFGB', asignaturas: ['eee'], apartados: [], activo: true, horario: null, curso: 'c2627' });
const BASEIT = { curso: 'c2627', asig: 'eee', tema: null, enlaces: [], grupos: ['gE'], visible: ['gE'], publicado: true, pub: null, orden: 1, actualizado: 1 };
await poner('items/itemT01x', { ...BASEIT, tipo: 'tarea', titulo: 'Diseño del cartel en Canva', texto: 'Entrega el enlace de tu cartel.', puntos: 10, copia: true, sinExternos: false, categoria: 'tareas' });
const EXM = { desde: new Date(ahora - 3600e3), hasta: new Date(ahora + 3600e3) };
await poner('items/itemE01x', { ...BASEIT, orden: 2, tipo: 'examen', titulo: 'Prueba de la ley de Ohm', texto: '', sinExternos: true, categoria: 'examenes', examen: { desde: ahora - 3600e3, hasta: ahora + 3600e3, limiteMin: 30, n: 2, pantallaCompleta: true, sinExternos: true } });
const QV = { id: 'q2', tipo: 'variables', enunciado: 'Una resistencia de {R} Ω a {V} V. ¿Qué intensidad circula?', puntos: 1, variables: { R: { min: 10, max: 100, paso: 10 }, V: { min: 5, max: 24, paso: 1 } }, unidad: 'A' };
await poner('examenes/itemE01x', { grupos: ['gE'], publicado: true, ...EXM, limiteMin: 30, barajar: false, pantallaCompleta: true, sinExternos: true, preguntas: [{ id: 'q1', tipo: 'test', enunciado: '¿Unidad de la resistencia?', opciones: ['Voltio', 'Ohmio'], puntos: 1 }, QV] });
await poner('claves/itemE01x', { respuestas: { q1: 1, q2: { f: 'V / R', t: 2, m: 'pct' } } });
await poner('codigosPrueba/itemE01x', { codigo: '4821', fecha: 1 });

const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
async function contexto(nombre) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 860 }, acceptDownloads: true });
  await ctx.route('**/js/firebase-config.js*', (r) => r.fulfill({ contentType: 'application/javascript', body: CFG }));
  const pg = await ctx.newPage(); await pg.addInitScript(() => { window.__dialogosNativos = true; });
  pg.on('console', (m) => { if (m.type() === 'error' && !benigno(m.text())) errores.push(`[${nombre}] ${m.text()}`); });
  pg.on('pageerror', (e) => errores.push(`[${nombre}] pageerror: ${e.message}`));
  pg.on('dialog', (d) => d.accept());
  return { ctx, pg };
}
const gate = (pg) => pg.waitForSelector('#gate-body:not([hidden])', { timeout: 20000 });
try {
  // ======================================================== alumno nº 7
  const A = await contexto('alumno');
  await A.pg.goto(BASE); await gate(A.pg);
  await A.pg.fill('#gate-code', 'FARO-472'); await A.pg.selectOption('#gate-num', '7'); await A.pg.fill('#gate-pin', '2468'); await A.pg.click('#gate-alumno .gate-go');
  await A.pg.waitForFunction(() => !!window.PORTAL?.aula, null, { timeout: 30000 }).catch(() => { });
  await A.pg.waitForTimeout(2500);
  // ---- P2: enlace + copia congelada
  await A.pg.goto(BASE + '#trabajo/itemT01x');
  await A.pg.waitForSelector('#enForm textarea[name=enlaces]', { timeout: 30000 });
  await A.pg.fill('#enForm textarea[name=texto]', 'Mi cartel sobre el reciclaje.');
  await A.pg.fill('#enForm textarea[name=enlaces]', 'https://www.canva.com/design/DAF123/view');
  await A.pg.waitForSelector('#enEnl .cp-enl');
  ok('P2 · reconoce el enlace de Canva, avisa de compartirlo y da las instrucciones', /Canva/.test(await A.pg.textContent('#enEnl')) && /compartido/.test(await A.pg.textContent('#enEnl')) && /Descargar/.test(await A.pg.textContent('#enEnl')));
  await A.pg.click('[data-en=entregar]');
  await A.pg.waitForFunction(() => /copia/.test(document.querySelector('#enMsg')?.textContent || ''), null, { timeout: 15000 });
  ok('P2 · con enlace y sin copia no deja entregar', /sube también una copia/i.test(await A.pg.textContent('#enMsg')));
  const pdf = Buffer.from('%PDF-1.4\n% copia de prueba del cartel\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF\n');
  await A.pg.setInputFiles('.cp-file', { name: 'cartel.pdf', mimeType: 'application/pdf', buffer: pdf });
  await A.pg.waitForSelector('#enCopias .cp-lista li', { timeout: 20000 });
  ok('P2 · la copia aparece con fecha y huella', /Copia entregada el/.test(await A.pg.textContent('#enCopias')) && /huella/.test(await A.pg.textContent('#enCopias')));
  const copias = await lista('trabajos/itemT01x_gE_7/copias');
  const h = createHash('sha256').update(pdf).digest('hex');
  ok('P2 · en el servidor: c01 con la huella SHA-256 de los bytes y fecha del servidor', copias.length === 1 && copias[0].id === 'c01' && copias[0].hash === h && /T/.test(copias[0].fecha), copias[0]?.hash?.slice(0, 12));
  await A.pg.click('[data-en=entregar]');
  await A.pg.waitForFunction(() => /Entregado/.test(document.querySelector('#enMsg')?.textContent || ''), null, { timeout: 15000 });
  const tr = await leer('trabajos/itemT01x_gE_7');
  ok('P2 · entregado con la fecha de cada enlace (enlacesT)', tr?.estado === 'entregado' && Array.isArray(tr.enlacesT) && tr.enlacesT.length === 1 && tr.enlacesT[0] > ahora - 120e3);
  ok('P2 · vista del alumno: «enlace vivo, puede haber cambiado» y copia congelada', /enlace vivo/.test(await A.pg.textContent('#auEntregaM')) && /Copia entregada/.test(await A.pg.textContent('#auEntregaM')));
  await A.pg.screenshot({ path: SHOTS + 'p2_copia_alumno.png', fullPage: true });

  // ---- P4: prueba sin elementos externos + datos por alumno
  await A.pg.goto(BASE + '#trabajo/itemE01x');
  await A.pg.waitForSelector('[data-au=empezar]', { timeout: 20000 });
  ok('P4 · aviso visible antes de empezar', /registra si sales de la pantalla y se bloquea/.test(await A.pg.textContent('.pb-aviso')));
  await A.pg.click('[data-au=empezar]');
  await A.pg.waitForSelector('#auExamen', { timeout: 20000 }).catch(async (e) => { console.log('DEPURA', JSON.stringify(await A.pg.evaluate(() => ({ msg: document.getElementById('auMsg')?.textContent, fs: !!document.fullscreenElement, h: location.hash })))); throw e; });
  const fs = await A.pg.evaluate(() => !!document.fullscreenElement);
  ok('P4 · empieza a pantalla completa', fs);
  const pr0 = await leer('pruebas/itemE01x_gE_7');
  ok('P4 · estado de la prueba creado (desbloqueado)', pr0 && pr0.bloqueado === false && pr0.nBloqueos === 0);
  const vals = valoresAlumno(QV.variables, semillaAlumno('itemE01x', 'gE_7'), 'q2');
  const enun = await A.pg.textContent('fieldset[data-q="q2"] legend');
  ok('P4 · la pregunta muestra SUS datos (sin la fórmula)', enun.includes(`${vals.R} Ω`) && enun.includes(`${String(vals.V).replace('.', ',')} V`) && !/V \/ R/.test(await A.pg.content()), `R=${vals.R} V=${vals.V}`);
  await A.pg.waitForTimeout(1000);
  const pegado = await A.pg.evaluate(() => { const e = new ClipboardEvent('paste', { bubbles: true, cancelable: true }); document.querySelector('fieldset[data-q="q2"] input').dispatchEvent(e); return e.defaultPrevented; });
  ok('P4 · pegar está bloqueado', pegado);
  await A.pg.check('fieldset[data-q="q1"] input[value="1"]').catch(async () => { await A.pg.click('fieldset[data-q="q1"] label:nth-of-type(2)'); });
  await A.pg.fill('fieldset[data-q="q2"] input', String(Math.round((vals.V / vals.R) * 1000) / 1000).replace('.', ','));
  // salir de la pantalla completa → se bloquea
  await A.pg.evaluate(() => document.exitFullscreen());
  await A.pg.waitForSelector('.pb-capa', { timeout: 15000 });
  await A.pg.waitForTimeout(1500);
  const pr1 = await leer('pruebas/itemE01x_gE_7');
  ok('P4 · al salir de la pantalla completa se BLOQUEA (servidor) y queda anotado', pr1?.bloqueado === true && pr1.nBloqueos === 1 && pr1.motivo === 'pantalla');
  await A.pg.screenshot({ path: SHOTS + 'p4_bloqueo_alumno.png' });
  await A.pg.fill('.pb-capa input', '1111'); await A.pg.click('.pb-capa button');
  await A.pg.waitForFunction(() => /incorrecto/.test(document.querySelector('.pb-msg')?.textContent || ''), null, { timeout: 15000 });
  ok('P4 · código equivocado → sigue bloqueada', !!(await A.pg.$('.pb-capa')) && (await leer('pruebas/itemE01x_gE_7')).bloqueado === true);
  await A.pg.fill('.pb-capa input', '4821'); await A.pg.click('.pb-capa button');
  await A.pg.waitForSelector('.pb-capa', { state: 'detached', timeout: 15000 });
  ok('P4 · con el código del profesor se desbloquea', (await leer('pruebas/itemE01x_gE_7')).bloqueado === false);
  await A.pg.click('#auExamen button[type=submit]');
  await A.pg.waitForFunction(() => /entregado/i.test(document.body.textContent), null, { timeout: 20000 });
  const tx = await leer('trabajos/itemE01x_gE_7');
  ok('P4 · examen entregado con sus respuestas', tx?.estado === 'entregado' && tx.respuestas?.q1 === 1 && !!tx.respuestas?.q2);
  const inc = await leer('incidencias/itemE01x_gE_7');
  ok('P4 · incidencias: salida, bloqueo y desbloqueo con su hora', ['pantalla', 'bloqueo', 'desbloqueo'].every((t) => (inc?.salidas || []).some((s) => s.tipo === t)));
  await A.ctx.close();

  // ======================================================== profesor
  const P = await contexto('profesor');
  await P.pg.goto(BASE); await gate(P.pg); await P.pg.click('[data-gate-rol="profesor"]');
  const [pop] = await Promise.all([P.pg.waitForEvent('popup'), P.pg.click('#gate-google')]);
  await pop.waitForLoadState(); await pop.click('text=Add new account'); await pop.fill('#email-input', 'profe@test.es'); await pop.fill('#display-name-input', 'Profe'); await pop.click('#sign-in');
  await P.pg.waitForSelector('#pnGrupoForm', { timeout: 30000 });
  // panel en directo de la prueba
  await P.pg.goto(BASE + '#trabajo/itemE01x');
  await P.pg.waitForSelector('#auPruebaProfe .pb-cod b', { timeout: 20000 });
  await P.pg.waitForFunction(() => /nº 07/.test(document.querySelector('#auPruebaProfe')?.textContent || ''), null, { timeout: 15000 });
  const pp = await P.pg.textContent('#auPruebaProfe');
  ok('P4 · panel del profesor: código, alumno y nº de bloqueos', /\d{4}/.test(await P.pg.textContent('#auPruebaProfe .pb-cod b')) && /nº 07/.test(pp) && /En marcha/.test(pp));
  await P.pg.screenshot({ path: SHOTS + 'p4_panel_profesor.png', fullPage: true });
  // corrección: la pregunta con datos por alumno se corrige con SUS datos
  await P.pg.goto(BASE + '#panel/notas');
  await P.pg.waitForSelector('[data-ap-f=gGrupo]', { timeout: 20000 });
  await P.pg.waitForSelector('td[data-celda="itemE01x"][data-n="7"]', { timeout: 20000 });
  await P.pg.click('td[data-celda="itemE01x"][data-n="7"]');
  await P.pg.waitForFunction(() => /Respuestas ·/.test(document.querySelector('#apDetalle')?.textContent || ''), null, { timeout: 20000 });
  ok('P4 · corrección: 2/2 puntos (la numérica con sus datos)', /Respuestas · 2 \/ 2 puntos/.test(await P.pg.textContent('#apDetalle')), (await P.pg.textContent('#apDetalle')).match(/Respuestas ·[^p]*puntos/)?.[0]);
  // copia en la vista del profesor
  await P.pg.click('td[data-celda="itemT01x"][data-n="7"]');
  await P.pg.waitForSelector('#apDetalle .cp-lista li', { timeout: 20000 });
  ok('P2 · el profesor ve el enlace «vivo» y la copia congelada con su huella', /enlace vivo/.test(await P.pg.textContent('#apDetalle')) && /huella/.test(await P.pg.textContent('#apDetalle')));
  // P3: exportar evidencias
  await P.pg.goto(BASE + '#asig/eee/trabajo');
  await P.pg.waitForSelector('[data-item="itemT01x"]', { timeout: 20000 });
  await P.pg.click('[data-item="itemT01x"] details.cl-mas summary');
  const [dl] = await Promise.all([P.pg.waitForEvent('download'), P.pg.click('[data-item="itemT01x"] [data-cl=evidencias]')]);
  const E = JSON.parse(readFileSync(await dl.path(), 'utf8'));
  const a7 = E.alumnos.find((x) => x.al === 'gE_7');
  ok('P3 · «Exportar evidencias»: nombre AAAAMMDD_Evidencias_…json', /^\d{8}_Evidencias_eee_.*\.json$/.test(dl.suggestedFilename()), dl.suggestedFilename());
  ok('P3 · JSON: enlace con fecha, copia con huella (sin bytes), sin nombres', a7 && a7.trabajo.enlaces[0].fecha > 0 && a7.copias[0].hash === h && !('data' in a7.copias[0]) && !/"nombre":\s*"(?!cartel)/.test(JSON.stringify(a7)));
  const [dlE] = await Promise.all([P.pg.waitForEvent('download'), (async () => { await P.pg.click('[data-item="itemE01x"] details.cl-mas summary'); await P.pg.click('[data-item="itemE01x"] [data-cl=evidencias]'); })()]);
  const EE = JSON.parse(readFileSync(await dlE.path(), 'utf8')); const e7 = EE.alumnos.find((x) => x.al === 'gE_7');
  ok('P3 · examen: respuestas, datos de su pregunta, salidas y bloqueos', e7 && e7.trabajo.respuestas.q1 === 1 && e7.datosExamen.q2.R === vals.R && e7.prueba.nBloqueos === 1 && e7.incidencias.length >= 3);
  // visor
  await P.pg.goto(BASE + '#panel/ajustes');
  await P.pg.waitForSelector('[data-ap=visorEvidencias]', { timeout: 20000 });
  const [fc] = await Promise.all([P.pg.waitForEvent('filechooser'), P.pg.click('[data-ap=visorEvidencias]')]);
  await fc.setFiles(await dlE.path());
  await P.pg.waitForSelector('.ev-capa .ev-al', { timeout: 15000 });
  ok('P3 · visor: abre el JSON en el navegador con el alumno y «Imprimir / PDF de este alumno»', /nº 07/.test(await P.pg.textContent('.ev-capa')) && !!(await P.pg.$('.ev-capa [data-ev=imprimir]')));
  await P.pg.screenshot({ path: SHOTS + 'p3_visor.png', fullPage: false });
  await P.ctx.close();
} catch (e) { ok('sin excepciones', false, e.message.split('\n')[0]); }
ok('sin errores de consola', !errores.length, errores.slice(0, 3).join(' | '));
await b.close();
const fallos = res.filter((x) => !x).length; console.log(`\n${res.length - fallos}/${res.length} correctas`); process.exit(fallos ? 1 : 0);

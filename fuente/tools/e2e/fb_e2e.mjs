// Pruebas de extremo a extremo del control de acceso con Firebase (emuladores de Auth + Firestore).
// Requisitos: emuladores en marcha (tools/firebase: firebase emulators:start --only auth,firestore --project demo-portal)
// con las reglas preparadas para profe@test.es, y la web servida en http://127.0.0.1:8765/.
import { chromium } from 'playwright-core';
import { readFileSync } from 'fs';
import { SHOTS, codigoClase } from '../rutas.mjs';

const BASE = process.env.PORTAL_BASE || 'http://127.0.0.1:8765/index.html';
const PROJ = 'demo-portal';
const CFG = `window.PORTAL_FIREBASE={apiKey:'demo-key',authDomain:'${PROJ}.firebaseapp.com',projectId:'${PROJ}',appId:'1:1:web:1'};window.PORTAL_FIREBASE_EMU={auth:'http://127.0.0.1:9099',firestoreHost:'127.0.0.1',firestorePort:8080};`;

const results = [];
const ok = (name, cond, info = '') => { results.push({ name, ok: !!cond, info }); console.log((cond ? 'OK  ' : 'FAIL') + ' ' + name + (info ? ' · ' + info : '')); };
const errores = [];
const benigno = (t) => /favicon|Download the React DevTools|WebGL|GPU stall|swiftshader|GroupMarkerNotSet/i.test(t);

await fetch(`http://127.0.0.1:8080/emulator/v1/projects/${PROJ}/databases/(default)/documents`, { method: 'DELETE' });
await fetch(`http://127.0.0.1:9099/emulator/v1/projects/${PROJ}/accounts`, { method: 'DELETE' });

const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'] });
async function contexto(nombre, { firebase = true, viewport = { width: 1440, height: 900 } } = {}) {
  const ctx = await b.newContext({ viewport, acceptDownloads: true });
  // Nunca se usa el proyecto real: o emuladores (demo-…) o configuración vacía (modo «código de clase»).
  await ctx.route('**/js/firebase-config.js*', r => r.fulfill({ contentType: 'application/javascript', body: firebase ? CFG : "window.PORTAL_FIREBASE={apiKey:'',projectId:''};" }));
  const pg = await ctx.newPage();
  pg.on('console', m => { if (m.type() === 'error' && !benigno(m.text())) errores.push(`[${nombre}] console: ${m.text()}`); });
  pg.on('pageerror', e => errores.push(`[${nombre}] pageerror: ${e.message}`));
  pg.on('dialog', d => d.accept());
  ctx.on('page', p => { p.on('pageerror', e => errores.push(`[${nombre}-popup] ${e.message}`)); });
  return { ctx, pg };
}
const gateListo = (pg) => pg.waitForSelector('#gate-body:not([hidden])', { timeout: 20000 });
async function loginGoogle(pg, email) {
  await gateListo(pg);
  await pg.click('[data-gate-rol="profesor"]');
  const [pop] = await Promise.all([pg.waitForEvent('popup'), pg.click('#gate-google')]);
  await pop.waitForLoadState();
  const existe = pop.locator(`text=${email}`);
  if (await existe.count()) await existe.first().click();
  else {
    await pop.click('text=Add new account');
    await pop.fill('#email-input', email);
    await pop.fill('#display-name-input', email.split('@')[0]);
    await pop.click('#sign-in');
  }
}
const pinDe = (numero) => String(1000 + numero * 7);
async function loginAlumno(pg, codigo, numero, pin = pinDe(numero)) {
  await gateListo(pg);
  await pg.fill('#gate-code', codigo);
  await pg.selectOption('#gate-num', String(numero));
  await pg.fill('#gate-pin', pin);
  await pg.click('#gate-alumno .gate-go');
}
const textoGate = async (pg) => (await pg.textContent('#gate')) || '';

// ================================================================ 1. respaldo: sin configuración → código de clase
{
  const { ctx, pg } = await contexto('respaldo', { firebase: false });
  await pg.goto(BASE);
  await pg.waitForSelector('#gate-code');
  ok('respaldo: sin config de Firebase se pide el código de clase', await pg.evaluate(() => window.__portalAcceso.modo === 'codigo' && !document.querySelector('[data-gate-rol]')));
  const CODE = codigoClase();
  await pg.fill('#gate-code', CODE); await pg.click('.gate-go');
  await pg.waitForSelector('#cover .btn-enter', { timeout: 20000 });
  ok('respaldo: con el código de clase entra en el portal', true);
  ok('respaldo: botón Salir en la cabecera', await pg.locator('.cov-chip [data-portal="salir"]').count() === 1);
  ok('respaldo: no se carga el SDK de Firebase', await pg.evaluate(() => !document.querySelector('script[src*="portal-fb"]')));
  await ctx.close();
}

// ================================================================ 2. profesor falso
{
  const { ctx, pg } = await contexto('falso');
  await pg.goto(BASE);
  await loginGoogle(pg, 'intruso@gmail.com');
  await pg.waitForSelector('#gate-err-p:not([hidden])', { timeout: 20000 });
  ok('profesor falso (otra cuenta de Google) → rechazado', /no tiene permiso de profesor/.test(await pg.textContent('#gate-err-p')));
  ok('profesor falso: no se carga la aplicación', await pg.evaluate(() => !document.querySelector('script[data-portal-app]')));
  await ctx.close();
}

// ================================================================ 3. profesor: panel y grupos
const P = await contexto('profesor');
await P.pg.goto(BASE);
await gateListo(P.pg);
await P.pg.screenshot({ path: SHOTS + 'fb_entrada.png' });
await P.pg.click('[data-gate-rol="profesor"]');
await P.pg.screenshot({ path: SHOTS + 'fb_entrada_profesor.png' });
await loginGoogle(P.pg, 'profe@test.es');
await P.pg.waitForSelector('#pnGrupoForm', { timeout: 30000 });
ok('profesor entra con Google y llega al panel (#panel)', P.pg.url().includes('#panel'));
async function crearGrupo(nombre, apartados) {
  await P.pg.goto(BASE + '#panel/grupos'); await P.pg.waitForSelector('#pnGrupoForm');
  await P.pg.fill('#pnGrupoForm [name=nombre]', nombre);
  for (const cb of await P.pg.$$('#pnGrupoForm [name=ap]')) { const v = await cb.getAttribute('value'); if (apartados.includes(v) !== await cb.isChecked()) await cb.click(); }
  await P.pg.click('#pnGrupoForm button[type=submit]');
  await P.pg.waitForFunction((n) => [...document.querySelectorAll('.pn-grupo h3')].some(h => h.textContent === n), nombre, { timeout: 30000 })
    .catch(async (e) => { console.log('DEBUG formMsg:', await P.pg.textContent('#pnFormMsg').catch(() => '?'), '| errores:', errores.join(' | ')); await P.pg.screenshot({ path: SHOTS + 'dbg_grupo.png' }); throw e; });
  await P.pg.waitForFunction(() => /creado/.test(document.querySelector('#pnFormMsg')?.textContent || ''), null, { timeout: 15000 });
  return P.pg.evaluate((n) => [...document.querySelectorAll('.pn-grupo')].find(g => g.querySelector('h3').textContent === n).querySelector('.pn-code').textContent, nombre);
}
const COD_A = await crearGrupo('1ºA', ['esp32', 'circuitos']);
const COD_B = await crearGrupo('2ºB', ['circuitos']);
ok('crear grupos: códigos legibles generados', /^[A-Z]{3,8}-\d{3}$/.test(COD_A) && /^[A-Z]{3,8}-\d{3}$/.test(COD_B) && COD_A !== COD_B, `${COD_A} / ${COD_B}`);
await P.pg.screenshot({ path: SHOTS + 'fb_panel_grupos.png' });

// ================================================================ 4. alumno: código malo, entrada, enlace profundo, latido
const A = await contexto('alumno7');
await A.pg.goto(BASE + '#eee/circuitos/c2');
await loginAlumno(A.pg, 'MALO-123', 7);
await A.pg.waitForSelector('#gate-err-a:not([hidden])');
ok('código malo → error claro', /no es correcto/.test(await A.pg.textContent('#gate-err-a')));
await A.pg.selectOption('#gate-num', '');
await A.pg.fill('#gate-code', COD_A.toLowerCase().replace('-', ' '));
await A.pg.click('#gate-alumno .gate-go');
ok('sin número de lista → pide elegirlo', /número de lista/.test(await A.pg.textContent('#gate-err-a')));
await A.pg.selectOption('#gate-num', '7');
await A.pg.click('#gate-alumno .gate-go');
await A.pg.waitForFunction(() => window.__circ && window.__circ.view === 'c2', null, { timeout: 30000 });
ok('alumno entra (código en minúsculas y con espacio) y el enlace profundo #eee/circuitos/c2 abre la práctica 2', A.pg.url().endsWith('#eee/circuitos/c2'));
ok('chip del alumno: «1ºA · nº 07»', /1ºA · nº 07/.test(await A.pg.textContent('#cxProf')));
// datos guardados: sin nombre ni correo
const sesDocs = await (await fetch(`http://127.0.0.1:8080/v1/projects/${PROJ}/databases/(default)/documents/sesiones`, { headers: { Authorization: 'Bearer owner' } })).json();
const claves = Object.keys(sesDocs.documents?.[0]?.fields || {}).sort().join(',');
ok('la sesión guardada solo tiene grupo, nº, código, página, dispositivo (navegador · sistema), horas y el hash del PIN (cero datos personales)', claves === 'codigo,desde,disp,grupo,latido,numero,pagina,pin,revocada', claves);
await P.pg.goto(BASE + '#panel/conectados');
await P.pg.waitForFunction(() => /práctica 2/.test(document.querySelector('#pnCon')?.textContent || ''), null, { timeout: 30000 });
ok('panel «Conectados»: aparece el nº 07 de 1ºA en «Circuitos · práctica 2» (latido)', /1ºA\s*07/.test((await P.pg.textContent('#pnCon')).replace(/\s+/g, ' ')) || /07/.test(await P.pg.textContent('#pnCon')));
// latido al cambiar de página
await A.pg.goto(BASE + '#eee/circuitos/c3'); await A.pg.waitForFunction(() => window.__circ.view === 'c3');
await P.pg.waitForFunction(() => /práctica 3/.test(document.querySelector('#pnCon')?.textContent || ''), null, { timeout: 30000 });
ok('el panel se actualiza solo al cambiar de página el alumno (latido ≤ 15 s)', true);
await P.pg.screenshot({ path: SHOTS + 'fb_panel_conectados.png' });

// ================================================================ 5. entregar práctica de Circuitos y proyecto ESP32
await A.pg.goto(BASE + '#eee/circuitos/c2'); await A.pg.waitForFunction(() => window.__circ.view === 'c2');
await A.pg.evaluate(() => { const l = window.__circ; l.loadSolution(); l.g.answers[0] = '14.8'; });
await A.pg.click('[data-cxtab="guia"]');
await A.pg.click('[data-act="check"]');
await A.pg.click('[data-act="entregar"]');
await A.pg.waitForFunction(() => /Entregado/.test(document.querySelector('#cxEntrega')?.textContent || ''), null, { timeout: 20000 });
ok('alumno entrega la práctica 2 de Circuitos → «Entregado»', true);
await A.pg.goto(BASE + '#p3'); await A.pg.waitForFunction(() => window.__app?.state.lesson?.n === 3);
await A.pg.click('[data-tab="reto"]');
await A.pg.fill('#espMed', 'LDR a oscuras: 2,9 V (esperado ≈3 V)');
await A.pg.fill('#espConc', 'Funciona; reto 1 hecho.');
await A.pg.fill('#espProb', '<img src=x onerror="window.__xss=1"><b>negrita</b>');
await A.pg.click('[data-esp-entregar="3"]');
await A.pg.waitForFunction(() => /Entregado/.test(document.querySelector('#espEstado')?.textContent || ''), null, { timeout: 20000 });
ok('alumno marca el proyecto ESP32 nº 3 como hecho con respuestas del informe → «Entregado»', true);

// ================================================================ 6. profesor revisa, abre en el simulador y califica
await P.pg.goto(BASE + '#panel/entregas');
await P.pg.waitForFunction(() => document.querySelectorAll('#pnTabla [data-ent]').length >= 2, null, { timeout: 20000 });
ok('panel «Entregas»: aparecen las 2 entregas', true);
await P.pg.click('#pnTabla [data-ent]:has-text("ESP32")');
ok('detalle ESP32: se ven las respuestas del informe', /2,9 V/.test(await P.pg.textContent('#pnDetalle')));
ok('XSS: el HTML que escribe un alumno se muestra como texto, no se ejecuta', await P.pg.evaluate(() => !window.__xss && /<img src=x/.test(document.querySelector('#pnDetalle').textContent) && !document.querySelector('#pnDetalle img, #pnDetalle b:not(:first-child) b')));
await P.pg.click('#pnTabla [data-ent]:has-text("Circuitos")');
await P.pg.waitForSelector('#pnDetalle [data-pn="revisar"]');
await P.pg.screenshot({ path: SHOTS + 'fb_entregas.png' });
await P.pg.click('#pnDetalle [data-pn="revisar"]');
await P.pg.waitForFunction(() => window.__circ && window.__circ.view === 'revision' && window.__circ.model.parts.length > 0, null, { timeout: 20000 });
const ro = await P.pg.evaluate(() => { const l = window.__circ; const n = l.model.parts.length; const r = l.commit(() => { l.model.parts = []; }); return { n, r, despues: l.model.parts.length, ro: l.readOnly }; });
ok('el profesor abre el montaje entregado en el simulador en modo lectura', ro.ro && ro.r === false && ro.despues === ro.n, `piezas: ${ro.n}`);
await P.pg.click('#cxSim'); await P.pg.waitForTimeout(800);
ok('en revisión se puede simular el montaje entregado', await P.pg.evaluate(() => window.__circ.running));
await P.pg.click('#cxSim');
await P.pg.fill('#cxNota', '8,5'.replace(',', '.'));
await P.pg.fill('#cxCom', 'Buen montaje. Repasa la ley de Ohm en la pregunta 2.');
await P.pg.click('[data-act="rev-guardar"]');
await P.pg.waitForFunction(() => /Guardado/.test(document.querySelector('#cxGradeMsg')?.textContent || ''), null, { timeout: 15000 });
ok('el profesor pone nota y comentario desde la revisión', true);
await P.pg.screenshot({ path: SHOTS + 'fb_revision.png' });
await P.pg.click('[data-act="rev-volver"]');
await P.pg.waitForSelector('#pnTabla [data-ent]');
await P.pg.click('#pnTabla [data-ent]:has-text("Circuitos")');
const [dl] = await Promise.all([P.pg.waitForEvent('download'), P.pg.click('[data-pn="csv"]')]);
const csv = readFileSync(await dl.path(), 'utf8');
ok('exportar CSV con grupo, nº, práctica y nota', /1ºA/.test(csv) && /8,5/.test(csv) && csv.split('\n').length >= 3, csv.split('\n')[1]?.slice(0, 90));
await P.pg.screenshot({ path: SHOTS + 'fb_entregas.png' });

// ================================================================ 7. el alumno ve su nota
await A.pg.goto(BASE + '#eee/circuitos/c2'); await A.pg.waitForFunction(() => window.__circ.view === 'c2');
await A.pg.click('[data-cxtab="guia"]');
await A.pg.waitForFunction(() => /8,5/.test(document.querySelector('#cxEntrega')?.textContent || ''), null, { timeout: 20000 });
ok('el alumno ve «Entregado», su nota (8,5) y el comentario', /Repasa la ley de Ohm/.test(await A.pg.textContent('#cxEntrega')));
await A.pg.evaluate(() => document.querySelector('#cxEntrega').scrollIntoView({ block: 'center' }));
await A.pg.screenshot({ path: SHOTS + 'fb_alumno.png' });
const reent = await A.pg.locator('#cxEntrega [data-act="entregar"]').count();
ok('una entrega calificada ya no se puede volver a entregar', reent === 0);

// ================================================================ 8. apartados del grupo y expulsar
const B2 = await contexto('alumno2B');
await B2.pg.goto(BASE + '#p3-2');
await loginAlumno(B2.pg, COD_B, 12);
await B2.pg.waitForSelector('#asig a.ap-card', { timeout: 30000 });
const aps = await B2.pg.$$eval('#asig a.ap-card h3', hs => hs.map(h => h.textContent));
ok('grupo solo con «Circuitos»: el enlace a ESP32 lleva al Laboratorio de EEE y solo ve Circuitos', B2.pg.url().endsWith('#asig/eee/laboratorio') && aps.join() === 'Circuitos', aps.join());
await P.pg.goto(BASE + '#panel/conectados');
await P.pg.waitForSelector('#pnCon tr:has-text("2ºB") [data-pn="expulsar"]', { timeout: 20000 });
await P.pg.click('#pnCon tr:has-text("2ºB") [data-pn="expulsar"]');
await B2.pg.waitForSelector('#gate-note:not([hidden])', { timeout: 20000 });
ok('expulsar: el alumno sale al momento con aviso', /cerrado tu sesión/.test(await B2.pg.textContent('#gate-note')));
await P.pg.waitForSelector('#pnCon tr:has-text("Expulsado")', { timeout: 15000 });
ok('el panel muestra la sesión como «Expulsado»', true);
await loginAlumno(B2.pg, COD_B, 12);
await B2.pg.waitForSelector('#asig a.ap-card, #cover .btn-enter', { timeout: 30000 });
ok('el expulsado puede volver a entrar solo con el código vigente (nueva sesión)', true);

// ================================================================ 8b. sesión en la esquina, «Usuarios» y bloqueo de un nº
await B2.pg.waitForSelector('#sesBtn', { timeout: 20000 });
ok('alumno: chip de sesión en la esquina con grupo y nº', /2ºB · nº 12/.test(await B2.pg.textContent('#sesBtn')) && /Sesión iniciada/.test(await B2.pg.getAttribute('#sesBtn', 'aria-label')));
await B2.pg.click('#sesBtn'); await B2.pg.waitForSelector('#sesMenu:not([hidden])'); await B2.pg.waitForTimeout(400);
const menuB = await B2.pg.textContent('#sesMenu');
ok('alumno: el menú dice rol, grupo, «Sesión iniciada» y «Cerrar sesión» (sin nombre)', /Alumno · nº 12/.test(menuB) && /Grupo 2ºB/.test(menuB) && /Sesión iniciada/.test(menuB) && /Cerrar sesión/.test(menuB));
await B2.pg.screenshot({ path: SHOTS + 'sesion_alumno_menu_claro.png' });
await B2.pg.evaluate(() => window.portalTema?.elegir('dark')); await B2.pg.waitForTimeout(300);
await B2.pg.screenshot({ path: SHOTS + 'sesion_alumno_menu_oscuro.png' });
await B2.pg.evaluate(() => window.portalTema?.elegir('auto'));
await B2.pg.keyboard.press('Escape');
ok('alumno: Escape cierra el menú y devuelve el foco', await B2.pg.evaluate(() => document.getElementById('sesMenu').hidden && document.activeElement?.id === 'sesBtn'));
await P.pg.goto(BASE + '#panel/usuarios');
await P.pg.waitForSelector('#sesBtn', { timeout: 20000 });
ok('profesor: chip «Profesor» en la esquina', /Profesor/.test(await P.pg.textContent('#sesBtn')));
await P.pg.click('#sesBtn'); await P.pg.waitForSelector('#sesMenu:not([hidden])'); await P.pg.waitForTimeout(400);
ok('profesor: el menú muestra su cuenta, «Sesión iniciada» y «Cerrar sesión»', /profe@test\.es/.test(await P.pg.textContent('#sesMenu')) && /Cerrar sesión/.test(await P.pg.textContent('#sesMenu')));
await P.pg.screenshot({ path: SHOTS + 'sesion_profesor_menu_claro.png' });
await P.pg.evaluate(() => window.portalTema?.elegir('dark')); await P.pg.waitForTimeout(300);
await P.pg.screenshot({ path: SHOTS + 'sesion_profesor_menu_oscuro.png' });
await P.pg.keyboard.press('Escape');
await P.pg.waitForSelector('#pnUsu [data-pn-u], #pnUsuBar [data-pn-u="grupo"]', { timeout: 15000 });
await P.pg.selectOption('#pnUsuBar [data-pn-u="grupo"]', { label: '2ºB' });
const filaB = '#pnUsu tr[data-usu$="_12"]';
await P.pg.waitForSelector(`${filaB}:has-text("En línea")`, { timeout: 20000 });
const txtFila = (await P.pg.textContent(filaB)).replace(/\s+/g, ' ');
ok('Usuarios: el nº 12 de 2ºB aparece «En línea», con último acceso, dispositivo y PIN registrado', /Chrome/.test(txtFila) && /hace/.test(txtFila) && /Registrado/.test(txtFila), txtFila);
ok('Usuarios: resumen con conectados, registrados y bloqueados', /en línea ahora/.test(await P.pg.textContent('#pnUsuRes')));
await P.pg.screenshot({ path: SHOTS + 'sesion_panel_usuarios_oscuro.png', fullPage: true });
await P.pg.evaluate(() => window.portalTema?.elegir('auto')); await P.pg.waitForTimeout(300);
await P.pg.screenshot({ path: SHOTS + 'sesion_panel_usuarios_claro.png', fullPage: true });
await P.pg.click(`${filaB} [data-pn="bloquear"]`);
await B2.pg.waitForSelector('#gate-note:not([hidden])', { timeout: 20000 });
ok('bloquear: el alumno sale al momento con el aviso de bloqueo', /bloqueado por el profesor/.test(await B2.pg.textContent('#gate-note')));
await B2.pg.screenshot({ path: SHOTS + 'sesion_alumno_bloqueado.png' });
await P.pg.waitForSelector(`${filaB}:has-text("Bloqueado")`, { timeout: 15000 });
ok('Usuarios: el nº 12 aparece «Bloqueado»', true);
await loginAlumno(B2.pg, COD_B, 12);
await B2.pg.waitForSelector('#gate-err-a:not([hidden])', { timeout: 20000 });
ok('bloqueado: no puede volver a entrar aunque su PIN sea correcto', /bloqueado/.test(await B2.pg.textContent('#gate-err-a')));
await B2.pg.screenshot({ path: SHOTS + 'sesion_alumno_bloqueado_entrar.png' });
{
  // las reglas lo impiden también sin la web: una sesión nueva con ese nº es rechazada
  const r = await fetch(`http://127.0.0.1:8080/v1/projects/${PROJ}/databases/(default)/documents/bloqueos`, { headers: { Authorization: 'Bearer owner' } });
  ok('el bloqueo se guarda en bloqueos/{grupo_nº} (sin datos personales)', ((await r.json()).documents || []).some((d) => /_12$/.test(d.name)));
}
await P.pg.click(`${filaB} [data-pn="desbloquear"]`);
await P.pg.waitForSelector(`${filaB} [data-pn="bloquear"]`, { timeout: 15000 });
await loginAlumno(B2.pg, COD_B, 12);
await B2.pg.waitForSelector('#asig a.ap-card, #cover .btn-enter', { timeout: 30000 });
ok('desbloquear: vuelve a poder entrar', true);
{
  const { ctx, pg } = await contexto('movil-ses', { viewport: { width: 390, height: 844 } });
  await pg.goto(BASE + '#asignaturas'); await loginAlumno(pg, COD_B, 13);
  await pg.waitForSelector('#sesBtn', { timeout: 30000 }); await pg.waitForTimeout(500);
  await pg.screenshot({ path: SHOTS + 'sesion_movil_chip.png' });
  await pg.click('#sesBtn'); await pg.waitForSelector('#sesMenu:not([hidden])'); await pg.waitForTimeout(400);
  await pg.screenshot({ path: SHOTS + 'sesion_movil_menu.png' });
  await pg.click('#sesSalir');
  await pg.waitForSelector('#gate-note:not([hidden])', { timeout: 20000 });
  ok('«Cerrar sesión» desde el menú de la esquina: vuelve a la entrada', /Has salido/.test(await pg.textContent('#gate-note')));
  await ctx.close();
}

// ================================================================ 9. reiniciar código expulsa a quien tenía el viejo
await P.pg.goto(BASE + '#panel/grupos');
await P.pg.click('.pn-grupo:has(h3:text-is("1ºA")) [data-pn="reiniciar"]');
await A.pg.waitForSelector('#gate-note:not([hidden])', { timeout: 20000 });
ok('reiniciar código: el alumno con el código viejo sale con aviso', /código del grupo ha cambiado/.test(await A.pg.textContent('#gate-note')));
const COD_A2 = await P.pg.textContent('.pn-grupo:has(h3:text-is("1ºA")) .pn-code');
ok('reiniciar código: hay un código nuevo distinto', COD_A2 !== COD_A && /^[A-Z]{3,8}-\d{3}$/.test(COD_A2), COD_A2);
await loginAlumno(A.pg, COD_A, 7);
await A.pg.waitForSelector('#gate-err-a:not([hidden])');
ok('el código viejo ya no sirve', /no es correcto/.test(await A.pg.textContent('#gate-err-a')));
await A.pg.fill('#gate-code', COD_A2); await A.pg.click('#gate-alumno .gate-go');
await A.pg.waitForFunction(() => !!window.__circ || !!document.querySelector('#cover .btn-enter'), null, { timeout: 30000 });
ok('con el código nuevo vuelve a entrar', true);

// ================================================================ 10. desactivar grupo
await P.pg.click('.pn-grupo:has(h3:text-is("1ºA")) [data-pn="activar"]');
await A.pg.waitForSelector('#gate-note:not([hidden])', { timeout: 20000 });
ok('cerrar el acceso del grupo: el alumno sale con aviso', /cerrado el acceso/.test(await A.pg.textContent('#gate-note')));
await loginAlumno(A.pg, COD_A2, 7);
await A.pg.waitForSelector('#gate-err-a:not([hidden])');
ok('con el acceso cerrado no se puede entrar', /cerrado/.test(await A.pg.textContent('#gate-err-a')));
await P.pg.click('.pn-grupo:has(h3:text-is("1ºA")) [data-pn="activar"]');
await P.pg.waitForSelector('.pn-grupo:has(h3:text-is("1ºA")) .pn-est.si');

// horario: grupo que solo abre mañana → fuera de horario
{
  await P.pg.goto(BASE + '#panel/grupos'); await P.pg.waitForSelector('#pnGrupoForm');
  await P.pg.fill('#pnGrupoForm [name=nombre]', '3ºC');
  await P.pg.check('#pnGrupoForm [name=conHorario]');
  const manana = (new Date().getDay() % 7) + 1; // getDay: 0 = domingo → día ISO de mañana
  for (const cb of await P.pg.$$('#pnGrupoForm [name=dia]')) { const v = +(await cb.getAttribute('value')); const want = v === manana; if (want !== await cb.isChecked()) await cb.evaluate(e => e.click()); }
  await P.pg.click('#pnGrupoForm button[type=submit]');
  await P.pg.waitForFunction(() => [...document.querySelectorAll('.pn-grupo h3')].some(h => h.textContent === '3ºC'), null, { timeout: 15000 });
  const COD_C = await P.pg.textContent('.pn-grupo:has(h3:text-is("3ºC")) .pn-code');
  await loginAlumno(A.pg, COD_C, 3);
  await A.pg.waitForSelector('#gate-err-a:not([hidden])');
  ok('horario: fuera del horario del grupo no se puede entrar (la web avisa; las reglas también lo impiden)', /fuera de su horario/.test(await A.pg.textContent('#gate-err-a')));
}

// ================================================================ 11. enlaces profundos tras el login (contexto nuevo)
{
  const { ctx, pg } = await contexto('profundo');
  await pg.goto(BASE + '#p3-2');
  await loginAlumno(pg, COD_A2, 21);
  await pg.waitForFunction(() => window.__app?.state.lesson?.n === 3, null, { timeout: 30000 });
  ok('enlace profundo #p3-2 tras el login → proyecto 3, paso 2', await pg.evaluate(() => window.__app.state.step === 1 && location.hash === '#p3-2'));
  await pg.reload();
  await pg.waitForFunction(() => window.__app?.state.lesson?.n === 3, null, { timeout: 30000 });
  ok('al recargar, la sesión del alumno sigue (sin volver a pedir el código)', !(await pg.$('#gate')));
  await pg.goto(BASE + '#eee/circuitos/c2');
  await pg.waitForFunction(() => window.__circ?.view === 'c2', null, { timeout: 30000 });
  ok('enlace profundo #eee/circuitos/c2 con sesión', true);
  ok('el alumno no ve el panel (#panel → portada)', await pg.evaluate(async () => { location.hash = '#panel'; await new Promise(r => setTimeout(r, 400)); return location.hash === '#inicio' && !document.body.classList.contains('scr-panelprof'); }));
  await pg.click('[data-portal="salir"] >> nth=0').catch(async () => { await pg.evaluate(() => window.PORTAL.salir()); });
  await pg.waitForSelector('#gate-note:not([hidden])', { timeout: 20000 });
  ok('«Salir» del alumno: vuelve a la entrada', /Has salido/.test(await pg.textContent('#gate-note')));
  await ctx.close();
}
// móvil: pantalla de entrada
{
  const { ctx, pg } = await contexto('movil', { viewport: { width: 390, height: 780 } });
  await pg.goto(BASE); await gateListo(pg);
  await pg.screenshot({ path: SHOTS + 'fb_entrada_movil.png' });
  await ctx.close();
}

// ================================================================ 12. limpieza y salida del profesor
await P.pg.goto(BASE + '#panel/limpieza');
await P.pg.waitForSelector('[data-pn="limpiarSes"]');
const antes = await P.pg.textContent('[data-pn="limpiarSes"]');
await P.pg.click('[data-pn="limpiarSes"]');
await P.pg.waitForFunction((t) => document.querySelector('[data-pn="limpiarSes"]')?.textContent !== t, antes, { timeout: 15000 });
ok('limpieza: borrar sesiones antiguas', true, `${antes.trim()} → ${(await P.pg.textContent('[data-pn="limpiarSes"]')).trim()}`);
await P.pg.reload();
await P.pg.waitForSelector('.pn', { timeout: 30000 });
ok('el profesor sigue dentro al recargar', P.pg.url().includes('#panel'));
await P.pg.click('.pn [data-portal="salir"]');
await P.pg.waitForSelector('#gate-body:not([hidden])', { timeout: 20000 });
ok('«Salir» del profesor', true);

ok('sin errores de consola', errores.length === 0, errores.slice(0, 5).join(' | '));
await b.close();
const fails = results.filter(r => !r.ok);
console.log(`\n${results.length - fails.length}/${results.length} OK`);
process.exit(fails.length ? 1 : 0);

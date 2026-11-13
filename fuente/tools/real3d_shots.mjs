// Capturas antes/después del realismo 3D: PREFIX=antes|despues SITE=<carpeta web> node real3d_shots.mjs
import { chromium } from 'playwright-core';
import { hashCodigo, leerConfig } from './set-codigo.mjs';
import { SHOTS, SITE_URL, codigoClase } from './rutas.mjs';
const PRE = process.env.PREFIX || 'despues';
const SOLO = (process.env.SOLO || '').split(',').filter(Boolean);
const base = SITE_URL + 'index.html';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
await ctx.route('**/js/firebase-config.js*', r => r.fulfill({ contentType: 'application/javascript', body: "window.PORTAL_FIREBASE={apiKey:'',projectId:''};" }));
{ const cfg = leerConfig(); await ctx.addInitScript(([k, v]) => { localStorage.setItem(k, v); localStorage.setItem('kit3d:calidad', 'alta'); }, ['portal.acceso', JSON.stringify({ version: cfg.version, hash: hashCodigo(codigoClase(), cfg.salt) })]); }
const pg = await ctx.newPage(); const errs = [];
pg.on('pageerror', e => errs.push(e.message)); pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
pg.on('dialog', d => d.accept());
const wait = (ms) => pg.waitForTimeout(ms);
const go = async (h, ms = 2000) => { await pg.evaluate((h) => { location.hash = h; }, h); await wait(ms); };
const shot = async (n) => { await pg.screenshot({ path: `${SHOTS}real3d_${PRE}_${n}.png` }); console.log('captura', n); };
const quiero = (n) => !SOLO.length || SOLO.includes(n);
await pg.goto(base + '#inicio'); await wait(1500);

if (quiero('esp32')) { await go('#p3-3', 3000); await shot('esp32'); }

if (quiero('circ')) {
  await go('#eee/circuitos/libre', 2500);
  await pg.evaluate(() => { const L = window.__circ; L.commit(() => { L.model = { parts: [], wires: [] }; }); L.afterChange?.();
    const P = (t, o, pr) => L.autoPlace(L.freshPart(t, pr), o);
    P('resistor', { at: 'b8', rot: 0 }, { r: 220 }); P('led', { at: 'e14', rot: 0 }, { color: 'rojo' }); P('npn', { at: 'e20', rot: 0 }); P('relay', { at: 'e24', rot: 0 });
    P('pot', { at: 'a3', rot: 0 }); P('tact', { at: 'e17', rot: 0 }); P('cap', { at: 'h10', rot: 0 }); P('diode', { at: 'i14', rot: 0 }); P('ldr', { at: 'h4', rot: 0 }); P('buzzer', { at: 'i20', rot: 0 }); P('slide', { at: 'g25', rot: 0 });
    const B = P('bat9', { pos: [-24, -6], rot: 0 }); const A = P('aa2', { pos: [-24, 13], rot: 0 });
    L.commit(() => { L.model.wires.push({ id: 'w1', a: `p:${B.id}:+`, b: 'h:tp2', color: 'rojo', kind: 'cm' }, { id: 'w2', a: `p:${B.id}:-`, b: 'h:tn2', color: 'negro', kind: 'cm' },
      { id: 'w3', a: 'h:tp9', b: 'h:a8', color: 'rojo', kind: 'mm' }, { id: 'w4', a: 'h:a15', b: 'h:tn14', color: 'negro', kind: 'mm' }, { id: 'w5', a: 'h:c12', b: 'h:c13', color: 'amarillo', kind: 'rig' }, { id: 'w6', a: `p:${A.id}:+`, b: 'h:bp3', color: 'rojo', kind: 'mh' }, { id: 'w7', a: `p:${A.id}:-`, b: 'h:bn3', color: 'negro', kind: 'mh' }); });
    L.select(null); });
  await wait(800); await pg.click('#cxSim').catch(() => {}); await wait(1200);
  await shot('circ_vista');
  // de cerca: componentes
  await pg.evaluate(() => { const L = window.__circ; L.userCam = true; L.camera.position.set(4, 26, 22); L.controls.target.set(4, 1, 0); L.controls.update(); });
  await wait(900); await shot('circ_cerca');
  await pg.evaluate(() => { const L = window.__circ; L.camera.position.set(-12, 34, 10); L.controls.target.set(-24, 17, -6); L.controls.update(); });
  await wait(900); await shot('circ_pilas_cocodrilo');
  await pg.click('#cxSim').catch(() => {}); await wait(300);
  await pg.evaluate(() => { const L = window.__circ; L.autoPlace(L.freshPart('meter'), { pos: [27, 0], rot: 0 }); L.select(null); const m = L.model.parts.find(p => p.type === 'meter'); L.setProbe(m, 'red', 'h:c14'); L.setProbe(m, 'com', 'h:c15'); });
  await pg.click('#cxSim').catch(() => {}); await wait(1200);
  await pg.evaluate(() => { const L = window.__circ; L.select(null); L.userCam = true; L.camera.position.set(30, 34, 30); L.controls.target.set(24, 1, 2); L.controls.update(); });
  await wait(900); await shot('circ_polimetro');
}
if (quiero('viv')) {
  await go('#eee/vivienda/taller', 3500); await shot('viv_taller');
  await go('#eee/vivienda/montaje', 3500); await shot('viv_montaje');
  await go('#eee/vivienda', 3000); await shot('viv_inicio');
}
if (quiero('act')) {
  await go('#asig/eee/actividades/maletin', 3500); await shot('act_maletin');
  await go('#asig/eee/actividades/cables', 3500); await shot('act_cables');
}
if (quiero('pc')) { await go('#asig/tic1/actividades/anatomia-pc', 3500); await shot('pc'); }
await b.close();
console.log('errores:', JSON.stringify(errs.slice(0, 8)));

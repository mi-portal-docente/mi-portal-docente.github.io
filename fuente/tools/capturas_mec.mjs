// Capturas de cada mecanismo en el visor «Ver en 3D», por delante y por detrás (con su esquema serigrafiado)
//   PREFIX=f OUT=/workspace/capturas-vivienda node capturas_mec.mjs
import { chromium } from 'playwright-core';
import { hashCodigo, leerConfig } from './set-codigo.mjs';
import { codigoClase } from './rutas.mjs';
const OUT = (process.env.OUT || '/tmp/').replace(/\/?$/, '/'); const PRE = process.env.PREFIX || 'f';
const base = process.env.PORTAL_BASE || 'http://localhost:8765/index.html';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const cfg = leerConfig(); const code = codigoClase();
const ctx = await b.newContext({ viewport: { width: 1280, height: 860 } });
await ctx.route('**/js/firebase-config.js*', r => r.fulfill({ contentType: 'application/javascript', body: "window.PORTAL_FIREBASE={apiKey:'',projectId:''};" }));
await ctx.addInitScript(([k, v]) => { localStorage.setItem(k, v); localStorage.setItem('kit3d:calidad', 'alta'); }, ['portal.acceso', JSON.stringify({ version: cfg.version, hash: hashCodigo(code, cfg.salt) })]);
const pg = await ctx.newPage(); pg.on('pageerror', e => console.log('pageerror', e.message)); pg.on('dialog', d => d.accept());
await pg.goto(base + '#inicio'); await pg.waitForTimeout(1500);
const PIEZAS = [['vp7', 'cruzamiento'], ['vp7', 'conmutador'], ['vp2', 'interruptor'], ['vp4', 'enchufe'], ['p6-montar', 'pulsador'], ['vp2', 'bombilla'], ['vp2', 'caja']];
for (const [ruta, tipo] of PIEZAS) {
  await pg.evaluate((h) => { location.hash = '#eee/vivienda/' + h; }, ruta); await pg.waitForTimeout(3500);
  await pg.evaluate(() => { const V = window.__viv; if (V.kind === 'practica') V.solucionPr(); else V.solucionProy?.(); }); await pg.waitForTimeout(800);
  const ok = await pg.evaluate((t) => { const V = window.__viv; const p = V.m.parts.find((q) => q.type === t); return p ? V.ver3D(p.id) !== false : false; }, tipo);
  if (!ok) { console.log('sin pieza', tipo, 'en', ruta); continue; }
  await pg.waitForTimeout(1500); const vis = await pg.$('.vv-visor');
  await vis.screenshot({ path: `${OUT}${PRE}_${tipo}_detras.png` });
  if (tipo !== 'caja') { await pg.click('[data-vis="girar"]'); await pg.waitForTimeout(1800); await vis.screenshot({ path: `${OUT}${PRE}_${tipo}_delante.png` }); }
  await pg.click('[data-vis="cerrar"]'); await pg.waitForTimeout(400); console.log('ok', tipo);
}
await b.close();

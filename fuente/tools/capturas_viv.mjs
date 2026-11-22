// Capturas del laboratorio «Instalación de vivienda» (escritorio y móvil 390×844)
//   PREFIX=antes|despues OUT=/carpeta PORTAL_BASE=http://localhost:8765/index.html node capturas_viv.mjs
import { chromium } from 'playwright-core';
import { hashCodigo, leerConfig } from './set-codigo.mjs';
import { codigoClase } from './rutas.mjs';
const PRE = process.env.PREFIX || 'despues'; const OUT = (process.env.OUT || '/tmp/') .replace(/\/?$/, '/');
const base = process.env.PORTAL_BASE || 'http://localhost:8765/index.html';
const EXTRA = (process.env.EXTRA || '').split(',').filter(Boolean);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const cfg = leerConfig(); const code = codigoClase();
async function sesion(vp, mobile) {
  const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
  await ctx.route('**/js/firebase-config.js*', r => r.fulfill({ contentType: 'application/javascript', body: "window.PORTAL_FIREBASE={apiKey:'',projectId:''};" }));
  await ctx.addInitScript(([k, v]) => { if (!sessionStorage.getItem('vvInit')) { Object.keys(localStorage).filter((x) => x.startsWith('viv:')).forEach((x) => localStorage.removeItem(x)); sessionStorage.setItem('vvInit', '1'); } localStorage.setItem(k, v); localStorage.setItem('kit3d:calidad', 'alta'); }, ['portal.acceso', JSON.stringify({ version: cfg.version, hash: hashCodigo(code, cfg.salt) })]);
  const pg = await ctx.newPage(); pg.on('dialog', d => d.accept()); pg.on('pageerror', e => console.log('pageerror', e.message));
  await pg.goto(base + '#inicio'); await pg.waitForTimeout(1500); return { ctx, pg };
}
const go = async (pg, h, ms = 2500) => { await pg.evaluate((h) => { location.hash = h; }, h); await pg.waitForTimeout(ms); };
const cam = async (pg, p, t) => { await pg.evaluate(([p, t]) => { const V = window.__viv; V.camera.position.set(...p); V.controls.target.set(...t); V.controls.update(); }, [p, t]); await pg.waitForTimeout(900); };
{ const { ctx, pg } = await sesion({ width: 1440, height: 900 }, false);
  await go(pg, '#eee/vivienda'); await pg.screenshot({ path: OUT + PRE + '_portada.png' });
  await pg.screenshot({ path: OUT + PRE + '_portada_completa.png', fullPage: true });
  await go(pg, '#eee/vivienda/p3-montar', 3500);
  await pg.evaluate(() => { window.__viv.solucionProy(); }); await pg.waitForTimeout(1500);
  await pg.screenshot({ path: OUT + PRE + '_tablero.png' });
  const q = await pg.evaluate(() => { const V = window.__viv; const f = (t) => V.m.parts.find((p) => p.type === t); const P = (p) => p ? [p.x, p.y] : null; return { c: P(f('cuadro')), i: P(f('interruptor')), e: P(f('enchufe')), k: P(f('caja')) }; });
  if (q.c) { await cam(pg, [q.c[0], q.c[1] - 16, 42], [q.c[0], q.c[1], 4]); await pg.screenshot({ path: OUT + PRE + '_cuadro.png' }); }
  if (q.i) { await cam(pg, [q.i[0] + 8, q.i[1] - 16, 24], [q.i[0], q.i[1], 1]); await pg.screenshot({ path: OUT + PRE + '_interruptor.png' }); }
  if (q.e) { await cam(pg, [q.e[0] + 8, q.e[1] - 16, 24], [q.e[0], q.e[1], 1]); await pg.screenshot({ path: OUT + PRE + '_enchufe.png' }); }
  await pg.evaluate(() => document.querySelector('#vvTapas')?.click()); await pg.waitForTimeout(800);
  if (q.i) { await cam(pg, [q.i[0] + 8, q.i[1] - 16, 24], [q.i[0], q.i[1], 1]); await pg.screenshot({ path: OUT + PRE + '_interruptor_cerrado.png' }); }
  if (q.e) { await cam(pg, [q.e[0] + 8, q.e[1] - 16, 24], [q.e[0], q.e[1], 1]); await pg.screenshot({ path: OUT + PRE + '_enchufe_cerrado.png' }); }
  await pg.evaluate(() => { document.querySelector('#vvTapas')?.click(); document.querySelector('#vvVerTubos')?.click(); }); await pg.waitForTimeout(800);
  if (q.k) { await cam(pg, [q.k[0] + 10, q.k[1] - 22, 30], [q.k[0], q.k[1], 1]); await pg.screenshot({ path: OUT + PRE + '_caja_tubos.png' }); }
  await pg.evaluate(() => window.__viv.vista()); await pg.waitForTimeout(800); await pg.screenshot({ path: OUT + PRE + '_tubos_transparentes.png' });
  for (const h of EXTRA) { await go(pg, '#eee/vivienda/' + h, 3500); await pg.screenshot({ path: OUT + PRE + '_' + h + '.png' }); }
  await ctx.close(); }
{ const { ctx, pg } = await sesion({ width: 390, height: 844 }, true);
  await go(pg, '#eee/vivienda'); await pg.screenshot({ path: OUT + PRE + '_movil_portada.png' });
  await go(pg, '#eee/vivienda/tablero', 3500); await pg.screenshot({ path: OUT + PRE + '_movil_tablero.png' });
  for (const h of EXTRA) { await go(pg, '#eee/vivienda/' + h, 3500); await pg.screenshot({ path: OUT + PRE + '_movil_' + h + '.png' }); }
  const sw = await pg.evaluate(() => document.documentElement.scrollWidth); console.log('scrollWidth móvil', sw);
  await ctx.close(); }
await b.close(); console.log('hecho');

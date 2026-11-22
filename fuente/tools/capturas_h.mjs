// Capturas del bloque H: vivienda al lado de su equivalente de Circuitos 3D
//   OUT=/workspace/capturas-vivienda node capturas_h.mjs [rutaViv=rutaCirc:nombre ...]
import { chromium } from 'playwright-core';
import { hashCodigo, leerConfig } from './set-codigo.mjs';
import { codigoClase } from './rutas.mjs';
const OUT = (process.env.OUT || '/tmp/').replace(/\/?$/, '/');
const base = process.env.PORTAL_BASE || 'http://localhost:8765/index.html';
const W = +(process.env.W || 1280);
const pares = process.argv.slice(2).length ? process.argv.slice(2) : ['vivienda=circuitos:portada', 'vivienda/evaluacion=circuitos/evaluacion:evaluacion', 'vivienda/vp2=circuitos/c1:guia'];
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const cfg = leerConfig(); const code = codigoClase();
const ctx = await b.newContext({ viewport: { width: W, height: 900 } });
await ctx.route('**/js/firebase-config.js*', r => r.fulfill({ contentType: 'application/javascript', body: "window.PORTAL_FIREBASE={apiKey:'',projectId:''};" }));
await ctx.addInitScript(([k, v]) => { localStorage.setItem(k, v); }, ['portal.acceso', JSON.stringify({ version: cfg.version, hash: hashCodigo(code, cfg.salt) })]);
const pg = await ctx.newPage(); pg.on('pageerror', e => console.log('pageerror', e.message));
await pg.goto(base + '#inicio'); await pg.waitForTimeout(1200);
for (const par of pares) {
  const [rutas, nom] = par.split(':'); const [rv, rc] = rutas.split('=');
  for (const [r, lado] of [[rv, 'viv'], [rc, 'circ']]) {
    await pg.evaluate((h) => { location.hash = '#eee/' + h; }, r); await pg.waitForTimeout(3500);
    await pg.screenshot({ path: `${OUT}h_${nom}_${lado}.png`, fullPage: !/\/(vp|c)\d/.test(r) });
    console.log('ok', nom, lado);
  }
}
await b.close();

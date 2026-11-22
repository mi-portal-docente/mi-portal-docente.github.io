import { chromium } from 'playwright-core';
import { hashCodigo, leerConfig } from './set-codigo.mjs';
import { codigoClase } from './rutas.mjs';
const OUT='/workspace/capturas-vivienda/'; const PRE=process.env.PREFIX||'c1';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const cfg = leerConfig(); const code = codigoClase();
for (const [vp, mob, suf] of [[{ width: 1440, height: 900 }, false, ''], [{ width: 390, height: 844 }, true, '_movil']]) {
const ctx = await b.newContext({ viewport: vp, isMobile: mob, hasTouch: mob });
await ctx.route('**/js/firebase-config.js*', r => r.fulfill({ contentType: 'application/javascript', body: "window.PORTAL_FIREBASE={apiKey:'',projectId:''};" }));
await ctx.addInitScript(([k, v]) => { localStorage.setItem(k, v); localStorage.setItem('kit3d:calidad', 'alta'); }, ['portal.acceso', JSON.stringify({ version: cfg.version, hash: hashCodigo(code, cfg.salt) })]);
const pg = await ctx.newPage(); pg.on('pageerror', e => console.log('pageerror', e.message)); pg.on('dialog', d => d.accept());
await pg.goto('http://localhost:8765/index.html#eee/vivienda/vp1'); await pg.waitForTimeout(5000);
await pg.evaluate(() => window.__viv.solucionPr()); await pg.waitForTimeout(1500);
const c = await pg.evaluate(() => { const p = window.__viv.m.parts.find((p) => p.type === 'cuadro'); return [p.x, p.y]; });
await pg.evaluate(([x, y]) => { const V = window.__viv; V.camera.position.set(x, y - 8, 40); V.controls.target.set(x, y + 1, 4); V.controls.update(); }, c); await pg.waitForTimeout(1200);
await pg.screenshot({ path: OUT + PRE + '_cuadro' + suf + '.png' });
const tab = async (re) => { await pg.evaluate((s) => { const t = [...document.querySelectorAll('.vv-side button, .vv-lado button, button')].find((e) => new RegExp(s).test(e.textContent.trim())); t?.click(); }, re); await pg.waitForTimeout(900); };
if (mob) { await tab('^REBT$');
  // el visor 3D tapa el panel en el móvil: se copia el contenido de la pestaña REBT (mismo CSS, 390 px) en una capa para la foto
  await pg.evaluate(() => { const e = document.querySelector('.vv-cq'); const par = e.parentElement; const d = document.createElement('div'); d.className = 'vv'; d.style.cssText = 'position:fixed;inset:0;z-index:99999;overflow:auto;background:#f5f5f7;padding:14px;box-sizing:border-box'; d.innerHTML = par.innerHTML; document.body.appendChild(d); });
  await pg.waitForTimeout(400); await pg.screenshot({ path: OUT + PRE + '_rebt_movil.png' });
  console.log('scrollWidth', await pg.evaluate(() => document.documentElement.scrollWidth)); }
if (!mob) { await pg.evaluate(() => { location.hash = '#eee/vivienda/vp2'; }); await pg.waitForTimeout(3500); await tab('^Esquema$'); await pg.evaluate(() => document.querySelector('.viv-plano')?.scrollIntoView({ block: 'center' })); await pg.waitForTimeout(500);
  const el = await pg.$('.viv-plano'); if (el) await el.screenshot({ path: OUT + PRE + '_plano.png' }); else await pg.screenshot({ path: OUT + PRE + '_plano.png' });
  console.log('tubos en el plano', await pg.evaluate(() => document.querySelectorAll('.viv-plano polyline[stroke="#9aa1a8"]').length));
  await pg.evaluate(() => { location.hash = '#eee/vivienda/vp1'; }); await pg.waitForTimeout(3500); }
if (false) { await pg.click('[data-v="red"]').catch(()=>{}); await pg.waitForTimeout(800); await pg.click('text=Norma').catch(()=>{}); await pg.evaluate(()=>{ const t=[...document.querySelectorAll('button,[data-tab]')].find(e=>/REBT/.test(e.textContent)); t?.click(); }); await pg.waitForTimeout(800); await pg.evaluate(()=>{ const h=[...document.querySelectorAll('h4')].find(e=>/electrificación básica/.test(e.textContent)); h?.scrollIntoView(); }); await pg.waitForTimeout(400); await pg.screenshot({ path: OUT + PRE + '_vp1_rebt.png' }); }
await ctx.close(); }
await b.close();

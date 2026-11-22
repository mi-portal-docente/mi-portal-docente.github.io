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
await pg.evaluate(([x, y]) => { const V = window.__viv; V.camera.position.set(x + 2, y - 10, 46); V.controls.target.set(x + 2, y + 2, 4); V.controls.update(); }, c); await pg.waitForTimeout(1200);
await pg.screenshot({ path: OUT + PRE + '_cuadro' + suf + '.png' });
if (!mob) { await pg.click('[data-v="red"]').catch(()=>{}); await pg.waitForTimeout(800); await pg.click('text=Norma').catch(()=>{}); await pg.evaluate(()=>{ const t=[...document.querySelectorAll('button,[data-tab]')].find(e=>/REBT/.test(e.textContent)); t?.click(); }); await pg.waitForTimeout(800); await pg.evaluate(()=>{ const h=[...document.querySelectorAll('h4')].find(e=>/electrificación básica/.test(e.textContent)); h?.scrollIntoView(); }); await pg.waitForTimeout(400); await pg.screenshot({ path: OUT + PRE + '_vp1_rebt.png' }); }
await ctx.close(); }
await b.close();

// e2e: la interfaz de vivienda no deja emoji a la vista (texto, opciones, title, aria-label, rótulos)
//   PORTAL_BASE=http://localhost:8765/index.html node viv_emoji_e2e.mjs
import { chromium } from 'playwright-core';
import { hashCodigo, leerConfig } from './set-codigo.mjs';
import { codigoClase } from './rutas.mjs';
const base = process.env.PORTAL_BASE || 'http://localhost:8765/index.html';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const cfg = leerConfig(); const code = codigoClase();
const ctx = await b.newContext({ viewport: { width: 1280, height: 860 } });
await ctx.route('**/js/firebase-config.js*', r => r.fulfill({ contentType: 'application/javascript', body: "window.PORTAL_FIREBASE={apiKey:'',projectId:''};" }));
await ctx.addInitScript(([k, v]) => { localStorage.setItem(k, v); }, ['portal.acceso', JSON.stringify({ version: cfg.version, hash: hashCodigo(code, cfg.salt) })]);
const pg = await ctx.newPage(); pg.on('dialog', d => d.accept());
await pg.goto(base + '#inicio'); await pg.waitForTimeout(1500);
const RUTAS = (process.env.RUTAS || 'eee/vivienda,eee/vivienda/vp1,eee/vivienda/vp2,eee/vivienda/vp4-auto,eee/vivienda/p3-montar,eee/vivienda/p1,eee/vivienda/tablero,eee/vivienda/libre').split(',');
let total = 0;
for (const r of RUTAS) {
  await pg.evaluate((h) => { location.hash = '#' + h; }, r); await pg.waitForTimeout(3000);
  if (/vp|montar|tablero/.test(r)) { await pg.click('#vvRed').catch(() => {}); await pg.waitForTimeout(800); }
  const malos = await pg.evaluate(() => {
    const RE = /[\u{1F000}-\u{1FAFF}\u2600-\u27BF\u2B00-\u2BFF]/u; const out = [];
    const raiz = document.querySelector('.vv') || document.body;
    const w = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT); while (w.nextNode()) { const n = w.currentNode; if (!RE.test(n.nodeValue)) continue; const p = n.parentElement; if (p.closest('.ic-t,script,style')) continue; if (!p.offsetParent && p.tagName !== 'OPTION') continue; out.push(p.tagName + ': ' + n.nodeValue.trim().slice(0, 60)); }
    raiz.querySelectorAll('[title],[aria-label],[placeholder]').forEach((e) => { for (const a of ['title', 'aria-label', 'placeholder']) { const v = e.getAttribute(a); if (v && RE.test(v)) out.push('@' + a + ': ' + v.slice(0, 60)); } });
    return [...new Set(out)];
  });
  total += malos.length; console.log(r, malos.length); malos.slice(0, 40).forEach((x) => console.log('   ' + x));
}
await b.close(); console.log(total ? `FALLOS ${total}` : 'TODO OK'); process.exit(total ? 1 : 0);

import { chromium } from 'playwright-core';
import { SHOTS, SITE_URL } from './rutas.mjs';
const out = process.env.OUT || SHOTS;
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
const BASE = process.env.BASE || SITE_URL + 'index.html';
const go = async (hash, tab, file, wait = 2500) => {
  await p.goto('about:blank'); await p.goto(BASE + hash); await p.waitForTimeout(wait);
  if (tab) { await p.click(`#tabs button[data-tab="${tab}"]`); await p.waitForTimeout(400); }
  await p.screenshot({ path: `${out}/${file}` });
};
await go('', null, 'inicio.png');
await go('#asignaturas', null, 'asignaturas.png');
await go('#eee', null, 'web_inicio.png');
// flujo con clics: portada -> Entrar -> tarjeta -> asignatura
await p.goto('about:blank'); await p.goto(BASE);
await p.click('.btn-enter'); await p.waitForTimeout(300);
const h1 = await p.evaluate(() => location.hash);
await p.click('a.subj'); await p.waitForTimeout(1500);
const h2 = await p.evaluate(() => [location.hash, !!document.querySelector('#panel .cards'), document.body.className]);
await p.click('#crumbs a[href="#asignaturas"]'); await p.waitForTimeout(300);
const h3 = await p.evaluate(() => [location.hash, getComputedStyle(document.querySelector('#subjects')).display]);
// enlace profundo
await p.goto('about:blank'); await p.goto(BASE + '#p3-2'); await p.waitForTimeout(2000);
const h4 = await p.evaluate(() => [location.hash, document.querySelector('#stepcount').textContent, getComputedStyle(document.querySelector('#cover')).display, document.querySelector('#crumbs').textContent]);
console.log('flujo:', h1, JSON.stringify(h2), JSON.stringify(h3), JSON.stringify(h4));
await go('#p1-3', null, 'web_p1_paso3.png');
await go('#p4-3', 'esquema', 'web_p4_esquema.png');
await go('#p5-3', 'ficha', 'web_p5_ficha.png');
await go('#p6-5', 'codigo', 'web_p6_codigo.png');
await go('#p7-5', null, 'web_p7_paso5.png');
await go('#p7-6', 'prueba', 'web_p7_prueba.png');
await go('#p8-7', null, 'web_p8_paso7.png');
await go('#p8-1', 'software', 'web_p8_preparar_pc.png');
// móvil
await p.setViewportSize({ width: 390, height: 844 });
await go('#p3-3', null, 'web_movil_p3.png');
await go('', null, 'movil_inicio.png', 800);
await go('#asignaturas', null, 'movil_asignaturas.png', 800);
await b.close();
console.log('errores:', JSON.stringify(errs));

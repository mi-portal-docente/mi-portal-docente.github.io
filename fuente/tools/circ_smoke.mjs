import { chromium } from 'playwright-core';
import { SHOTS, SITE_URL } from './rutas.mjs';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--allow-file-access-from-files'] });
const pg = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
pg.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.type() + ': ' + m.text()); });
pg.on('pageerror', e => errs.push('pageerror: ' + e.message + '\n' + e.stack));
const base = process.env.PORTAL_BASE || SITE_URL + 'index.html';
for (const h of ['#eee', '#eee/circuitos', '#eee/circuitos/libre', '#eee/circuitos/c2']) {
  await pg.goto(base + h); await pg.waitForTimeout(2500);
  console.log(h, '->', await pg.evaluate(() => location.hash + ' body=' + document.body.className));
}
await pg.screenshot({ path: SHOTS + 'smoke.png' });
console.log(errs.join('\n') || 'no errors');
await b.close();

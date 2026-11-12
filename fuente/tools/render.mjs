import { chromium } from 'playwright-core';
import { execSync } from 'child_process';
const only = process.argv[2] ? process.argv[2].split(',').map(Number) : null;
const outDir = process.argv[3] || SITE + 'renders';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 2 });
p.on('pageerror', e => console.log('PAGEERR', e.message));
p.on('console', m => { if (m.type() === 'error') console.log('CONSOLE', m.text()); });
await p.goto(SITE_URL + 'index.html?render=1', { waitUntil: 'load' });
await p.waitForFunction(() => window.renderReady);
await p.evaluate(() => document.fonts.ready);
const info = await p.evaluate(() => window.lessonInfo);
const files = [];
for (const L of info) {
  if (only && !only.includes(L.n)) continue;
  const shots = [...Array(L.steps).keys()].map(i => i + 1).concat(['final']);
  for (const s of shots) {
    await p.evaluate(([n, s]) => window.renderShot(n, s), [L.n, s]);
    await p.waitForTimeout(350);
    const f = `${outDir}/p${L.n}_${s === 'final' ? 'final' : 'paso' + s}.png`;
    await p.screenshot({ path: f + '.tmp.png', clip: { x: 0, y: 0, width: 1600, height: 900 } });
    files.push(f);
  }
}
await b.close();
// reducir de 3200x1800 a 1600x900 con buena calidad
execSync(`python3 - <<'PY'
from PIL import Image
import sys
import { SITE, SITE_URL } from './rutas.mjs';
for f in ${JSON.stringify(files)}:
    im = Image.open(f + '.tmp.png').convert('RGB')
    im = im.resize((1600, 900), Image.LANCZOS)
    im.save(f, optimize=True)
    import os; os.remove(f + '.tmp.png')
PY`);
console.log(files.length + ' renders');

// Verificación de la pantalla de código de clase (playwright-core + Chrome headless)
import { chromium } from 'playwright-core';
import { readFileSync } from 'fs';
import { createHash } from 'crypto';
import { normalizeCodigo, hashCodigo, leerConfig } from './set-codigo.mjs';
import { SHOTS, SITE, SITE_URL, codigoClase } from './rutas.mjs';

const base = process.env.PORTAL_BASE || SITE_URL + 'index.html';
const CODE = codigoClase();
const cfg = leerConfig();

const b = await chromium.launch({
  executablePath: '/usr/bin/google-chrome',
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'],
});

const results = [];
const ok = (name, cond, info = '') => {
  results.push({ name, ok: !!cond, info });
  console.log((cond ? 'OK  ' : 'FAIL') + ' ' + name + (info ? ' · ' + info : ''));
};

function ignoreConsole(t) {
  return /Failed to load resource|net::ERR_|Download the React DevTools|favicon/.test(t);
}

async function fresh(opts = {}) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, ...opts.context });
  // Nunca usar el proyecto Firebase real en las pruebas: modo «código de clase»
  await ctx.route('**/js/firebase-config.js*', r => r.fulfill({ contentType: 'application/javascript', body: "window.PORTAL_FIREBASE={apiKey:'',projectId:''};" }));
  const pg = await ctx.newPage();
  const errs = [];
  pg.on('console', m => {
    if (m.type() === 'error') {
      const t = m.text();
      if (!ignoreConsole(t)) errs.push('console: ' + t);
    }
  });
  pg.on('pageerror', e => errs.push('pageerror: ' + e.message));
  if (opts.init) await ctx.addInitScript(opts.init);
  return { ctx, pg, errs };
}

async function goto(pg, hash = '', wait = 800) {
  const url = base + hash;
  await pg.goto(url, { waitUntil: 'domcontentloaded' });
  await pg.waitForTimeout(wait);
}

async function gateVisible(pg) {
  return pg.evaluate(() => {
    const g = document.getElementById('gate');
    if (!g) return { gate: false };
    const st = getComputedStyle(g);
    const text = document.body.innerText;
    return {
      gate: st.display !== 'none' && g.getClientRects().length > 0,
      title: (document.querySelector('#gate-title') || {}).textContent || '',
      hasCodeLabel: /C[oó]digo de clase/i.test(text),
      leak: /Salesianos|Pablo Mateos|Equipos el[eé]ctricos|Sem[aá]foro|Laboratorio de Circuitos|M[oó]dulo 3015/i.test(text),
      app: !!window.__app,
      circ: !!window.__circ,
      cover: !!document.querySelector('#cover') && document.querySelector('#cover').innerHTML.trim().length > 0,
    };
  });
}

async function enterCode(pg, code) {
  await pg.fill('#gate-code', code);
  await pg.click('.gate-go');
  await pg.waitForTimeout(1500);
}

// 0) hashes y normalización
{
  const n1 = normalizeCodigo('  ' + CODE.toUpperCase().replace(/-/g, ' ') + '  ');
  const n2 = normalizeCodigo(CODE);
  ok('normalizar es insensible a mayúsculas y espacios', n1 === n2, n1);
  const h = hashCodigo(CODE, cfg.salt);
  ok('hash del código coincide con la config', cfg.hashes.includes(h), h.slice(0, 16));
}

// 1) sin código no se ve contenido
{
  const { ctx, pg, errs } = await fresh();
  await goto(pg, '', 900);
  const g = await gateVisible(pg);
  ok('sin código aparece la pantalla de acceso', g.gate && g.title === 'Super Profe Pablo' && g.hasCodeLabel, JSON.stringify(g));
  ok('sin código no se ve contenido del portal', !g.leak && !g.app && !g.circ && !g.cover, JSON.stringify(g));
  await pg.screenshot({ path: SHOTS + 'codigo_clase.png' });
  ok('captura codigo_clase.png', true, SHOTS + 'codigo_clase.png');
  ok('sin código no hay errores de consola', errs.length === 0, errs.join(' | '));
  await ctx.close();
}

// 2) código incorrecto
{
  const { ctx, pg, errs } = await fresh();
  await goto(pg);
  await enterCode(pg, 'codigo-falso-00');
  const g = await gateVisible(pg);
  const msg = await pg.evaluate(() => {
    const e = document.getElementById('gate-err');
    return e && !e.hidden ? e.textContent : '';
  });
  ok('código incorrecto muestra un mensaje claro y no entra', g.gate && /no es correcto/i.test(msg) && !g.app, msg);
  ok('código incorrecto no hay errores de consola', errs.length === 0, errs.join(' | '));
  await ctx.close();
}

// 3) código correcto entra
{
  const { ctx, pg, errs } = await fresh();
  await goto(pg, '', 900);
  await enterCode(pg, CODE);
  await pg.waitForFunction(() => window.__app || document.getElementById('cover'), { timeout: 15000 }).catch(() => {});
  await pg.waitForTimeout(800);
  const st = await pg.evaluate(() => ({
    gate: !!document.getElementById('gate'),
    cover: !!(document.getElementById('cover') && document.getElementById('cover').innerHTML),
    scr: document.body.classList.contains('scr-cover'),
    salir: !!document.querySelector('[data-portal="salir"]'),
    prof: /Pablo Mateos Lema/.test(document.body.innerText),
    hash: location.hash,
  }));
  ok('código correcto entra en la portada', !st.gate && st.cover && st.scr && st.prof, JSON.stringify(st));
  ok('aparece el botón Salir', st.salir);
  ok('código correcto no hay errores de consola', errs.length === 0, errs.join(' | '));

  // 4) recarga recuerda
  await pg.reload({ waitUntil: 'domcontentloaded' });
  await pg.waitForFunction(() => window.__app || document.getElementById('cover'), { timeout: 15000 }).catch(() => {});
  await pg.waitForTimeout(800);
  const st2 = await pg.evaluate(() => ({
    gate: !!document.getElementById('gate'),
    cover: !!(document.getElementById('cover') && document.getElementById('cover').innerHTML),
    stored: localStorage.getItem('portal.acceso'),
  }));
  const stored = st2.stored ? JSON.parse(st2.stored) : null;
  ok('la recarga recuerda el acceso y no pide el código', !st2.gate && st2.cover, JSON.stringify(st2));
  ok('localStorage guarda hash y versión, no el código', !!(stored && stored.hash && stored.version === cfg.version && !JSON.stringify(stored).includes(CODE)));

  // 5) Salir olvida
  await pg.click('[data-portal="salir"] >> visible=true');
  await pg.waitForTimeout(1200);
  const st3 = await gateVisible(pg);
  const leftover = await pg.evaluate(() => localStorage.getItem('portal.acceso'));
  ok('Salir olvida el acceso y vuelve a pedir el código', st3.gate && !st3.app && !st3.cover && !leftover, JSON.stringify(st3) + ' ls=' + leftover);
  ok('Salir no hay errores de consola', errs.length === 0, errs.join(' | '));
  await ctx.close();
}

// 6) mayúsculas y espacios
{
  const { ctx, pg } = await fresh();
  await goto(pg);
  const spaced = '  ' + CODE.toUpperCase().replace(/-/g, '  ') + '  ';
  await enterCode(pg, spaced);
  await pg.waitForFunction(() => window.__app || document.getElementById('cover'), { timeout: 15000 }).catch(() => {});
  await pg.waitForTimeout(600);
  const st = await pg.evaluate(() => ({ gate: !!document.getElementById('gate'), cover: !!(document.getElementById('cover') && document.getElementById('cover').innerHTML) }));
  ok('acepta el código con mayúsculas y espacios de más', !st.gate && st.cover, JSON.stringify(st));
  await ctx.close();
}

// 7) enlace profundo #p3-2 pide código y luego abre el paso
{
  const { ctx, pg, errs } = await fresh();
  await goto(pg, '#p3-2', 900);
  const g = await gateVisible(pg);
  ok('#p3-2 pide código antes de mostrar el paso', g.gate && !g.app, JSON.stringify(g));
  const hashBefore = await pg.evaluate(() => location.hash);
  ok('#p3-2 conserva el destino', hashBefore === '#p3-2', hashBefore);
  await enterCode(pg, CODE);
  await pg.waitForFunction(() => window.__app && window.__app.state && window.__app.state.lesson, { timeout: 20000 }).catch(() => {});
  await pg.waitForTimeout(1500);
  const st = await pg.evaluate(() => ({
    h: location.hash,
    n: window.__app && window.__app.state.lesson && window.__app.state.lesson.n,
    s: window.__app && window.__app.state.step,
    gate: !!document.getElementById('gate'),
    cls: document.body.className,
  }));
  ok('#p3-2 después del código abre el proyecto 3, paso 2', !st.gate && st.h === '#p3-2' && st.n === 3 && st.s === 1, JSON.stringify(st));
  ok('#p3-2 no hay errores de consola', errs.length === 0, errs.join(' | '));
  await ctx.close();
}

// 8) Circuitos sigue funcionando (con sesión ya abierta)
{
  const hash = hashCodigo(CODE, cfg.salt);
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  // Nunca usar el proyecto Firebase real en las pruebas: modo «código de clase»
  await ctx.route('**/js/firebase-config.js*', r => r.fulfill({ contentType: 'application/javascript', body: "window.PORTAL_FIREBASE={apiKey:'',projectId:''};" }));
  await ctx.addInitScript(([key, val]) => { localStorage.setItem(key, val); }, ['portal.acceso', JSON.stringify({ version: cfg.version, hash })]);
  const pg = await ctx.newPage();
  const errs = [];
  pg.on('console', m => { if (m.type() === 'error' && !ignoreConsole(m.text())) errs.push('console: ' + m.text()); });
  pg.on('pageerror', e => errs.push('pageerror: ' + e.message));
  await goto(pg, '#eee/circuitos', 2000);
  await pg.waitForFunction(() => document.querySelectorAll('.cx-card').length >= 10, { timeout: 15000 }).catch(() => {});
  const st = await pg.evaluate(() => ({
    gate: !!document.getElementById('gate'),
    cards: document.querySelectorAll('.cx-card').length,
    scr: document.body.classList.contains('scr-circ'),
    sales: /salesian/i.test((document.querySelector('#circ') || {}).innerHTML || ''),
  }));
  ok('Circuitos: portada con 12 prácticas + modo libre, sin pedir código otra vez', !st.gate && st.cards === 13 && st.scr, JSON.stringify(st));
  ok('Circuitos: sin marca salesiana dentro del laboratorio', !st.sales);
  await pg.evaluate(() => { location.hash = '#eee/circuitos/c2'; });
  await pg.waitForTimeout(2000);
  const st2 = await pg.evaluate(() => ({
    h: location.hash,
    title: (document.getElementById('cxPTitle') || {}).textContent || document.body.innerText.slice(0, 200),
  }));
  ok('Circuitos: el enlace #eee/circuitos/c2 abre la práctica 2', st2.h === '#eee/circuitos/c2' && /2|LED|resistencia|práctica/i.test(st2.title), JSON.stringify(st2).slice(0, 240));
  ok('Circuitos no hay errores de consola', errs.length === 0, errs.join(' | '));
  await ctx.close();
}

// 9) respaldo SHA-256 puro
{
  const ctx = await b.newContext({ viewport: { width: 800, height: 600 } });
  // Nunca usar el proyecto Firebase real en las pruebas: modo «código de clase»
  await ctx.route('**/js/firebase-config.js*', r => r.fulfill({ contentType: 'application/javascript', body: "window.PORTAL_FIREBASE={apiKey:'',projectId:''};" }));
  await ctx.addInitScript(() => { window.__PORTAL_FORCE_PURE_SHA = true; });
  const pg = await ctx.newPage();
  await goto(pg, '', 700);
  const cmp = await pg.evaluate(async (expected) => {
    const empty = window.__portalAcceso.sha256pure('');
    const abc = window.__portalAcceso.sha256pure('abc');
    return {
      empty: empty === 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      abc: abc === 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
      emptyVal: empty,
      forced: !!window.__PORTAL_FORCE_PURE_SHA,
    };
  });
  ok('SHA-256 puro coincide con vectores conocidos', cmp.empty && cmp.abc, JSON.stringify(cmp));
  await enterCode(pg, CODE);
  await pg.waitForFunction(() => document.getElementById('cover') || window.__app, { timeout: 15000 }).catch(() => {});
  await pg.waitForTimeout(600);
  const st = await pg.evaluate(() => ({ gate: !!document.getElementById('gate'), cover: !!(document.getElementById('cover') && document.getElementById('cover').innerHTML) }));
  ok('el respaldo SHA-256 puro acepta el código válido', !st.gate && st.cover, JSON.stringify(st));
  await ctx.close();
}

// 10) robots
{
  const { ctx, pg } = await fresh();
  await goto(pg, '', 400);
  const robots = await pg.evaluate(() => (document.querySelector('meta[name="robots"]') || {}).content || '');
  ok('meta robots noindex, nofollow', /noindex/i.test(robots) && /nofollow/i.test(robots), robots);
  if (base.startsWith('http')) {
    const robotsUrl = new URL('/robots.txt', base).href;
    const res = await ctx.request.get(robotsUrl);
    const txt = await res.text();
    ok('robots.txt bloquea todo', res.ok() && /Disallow:\s*\//i.test(txt), txt.slice(0, 120));
  } else {
    const txt = readFileSync(SITE + 'robots.txt', 'utf8');
    ok('robots.txt bloquea todo', /Disallow:\s*\//i.test(txt), txt.trim());
  }
  await ctx.close();
}

await b.close();
const failed = results.filter(r => !r.ok);
console.log('---');
console.log('Total ' + results.length + ' · OK ' + (results.length - failed.length) + ' · FAIL ' + failed.length);
if (failed.length) process.exit(1);

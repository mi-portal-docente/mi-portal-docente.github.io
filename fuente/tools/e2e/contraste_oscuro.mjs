// Comprobación de contraste en modo oscuro (t173u): texto vs fondo, en reposo y en :hover.
// Se puede lanzar sola (run_contraste.sh: plantilla CSS + vistas del portal con emulador)
// o importarse desde secciones_e2e.mjs con CONTRASTE=1.
import { chromium } from 'playwright-core';
import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const SITE = resolve(__dir, '../..', '..'); // raíz del sitio (css/, index.html)
const BASE = process.env.PORTAL_BASE || 'http://127.0.0.1:8765/index.html';
const ORIGIN = BASE.replace(/\/index\.html.*$/, '');
const CAP = (process.env.CAPTURAS_OSCURO || '/workspace/capturas-oscuro').replace(/\/?$/, '/');
const ETAPA = process.env.CONTRASTE_ETAPA || 'despues'; // 'antes' | 'despues'
mkdirSync(CAP + ETAPA, { recursive: true });
mkdirSync(CAP + 'claro', { recursive: true });

const CSS = ['css/style.css', 'css/circuitos.css', 'css/portal.css', 'css/aula.css', 'css/vivienda.css', 'css/ios.css', 'css/plataforma.css'];

const SELECTORES = [
  '.as-tabs a',
  '.as-tabs a.on',
  '.asb-tabs a',
  '.asb-tabs a.on',
  '.pn-tabs a',
  '.pn-tabs a.on',
  '.gate-tabs button',
  '.gate-tabs button.on',
  '.bib-chip',
  '.bib-chip.on',
  '.tabs button',
  '.tabs button.on',
  '.pi-tabs button, .pi-tabs a',
  '.top-nav-a',
  '.top-nav-a.on',
  '.navb',
  '.pchip-b',
  '.btn:not(.primary):not(.pn-peligro)',
  '.btn.primary',
  '.cl-th-chev',
  'a.cl-it, .cl-it',
  '.org-it',
  '.cl-post-it',
  '.sg-card',
  '.sg-card .btn:not(.primary)',
  '.sg-fila',
  '.pn-nav a',
  '.pn-row td',
  '.tbl td, .au-t td, .pn-t td',
  'a.subj',
  '.ap-card',
  '.cx-card',
  '.cov-links a',
  '.tema-btn',
  '.tema-menu button',
  '.ses-chip',
  'input[type=text], input[type=search], select, textarea',
  '.ap-vista-b',
  '.ap-c',
  '.cl-lado-b',
  '.bib-hits li',
];

function parseColor(s) {
  if (!s || s === 'transparent' || s === 'none') return [0, 0, 0, 0];
  const m = String(s).match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/);
  if (m) return [+m[1], +m[2], +m[3], m[4] == null ? 1 : +m[4]];
  const h = String(s).match(/^#([0-9a-f]{3,8})$/i);
  if (h) {
    let x = h[1];
    if (x.length === 3 || x.length === 4) x = [...x].map((c) => c + c).join('');
    const n = parseInt(x.slice(0, 6), 16);
    const a = x.length >= 8 ? parseInt(x.slice(6, 8), 16) / 255 : 1;
    return [n >> 16, (n >> 8) & 255, n & 255, a];
  }
  return [0, 0, 0, 0];
}
function over(fg, bg) {
  const a = fg[3] + bg[3] * (1 - fg[3]);
  if (a === 0) return [0, 0, 0, 0];
  return [
    (fg[0] * fg[3] + bg[0] * bg[3] * (1 - fg[3])) / a,
    (fg[1] * fg[3] + bg[1] * bg[3] * (1 - fg[3])) / a,
    (fg[2] * fg[3] + bg[2] * bg[3] * (1 - fg[3])) / a,
    a,
  ];
}
function lin(c) { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }
function lum(c) { return 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]); }
function ratio(a, b) { const [x, y] = lum(a) > lum(b) ? [lum(a), lum(b)] : [lum(b), lum(a)]; return (x + 0.05) / (y + 0.05); }
const hex = (c) => '#' + [c[0], c[1], c[2]].map((n) => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, '0')).join('');

const MEDIR_JS = ({ selectores, lienzo }) => {
  const parse = (s) => {
    if (!s || s === 'transparent' || s === 'none') return [0, 0, 0, 0];
    const m = String(s).match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/);
    if (m) return [+m[1], +m[2], +m[3], m[4] == null ? 1 : +m[4]];
    return [0, 0, 0, 0];
  };
  const over = (fg, bg) => {
    const a = fg[3] + bg[3] * (1 - fg[3]);
    if (a === 0) return [0, 0, 0, 0];
    return [
      (fg[0] * fg[3] + bg[0] * bg[3] * (1 - fg[3])) / a,
      (fg[1] * fg[3] + bg[1] * bg[3] * (1 - fg[3])) / a,
      (fg[2] * fg[3] + bg[2] * bg[3] * (1 - fg[3])) / a,
      a,
    ];
  };
  const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  const lum = (c) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
  const ratio = (a, b) => { const [x, y] = lum(a) > lum(b) ? [lum(a), lum(b)] : [lum(b), lum(a)]; return (x + 0.05) / (y + 0.05); };
  const hex = (c) => '#' + [c[0], c[1], c[2]].map((n) => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, '0')).join('');
  const fondoEfectivo = (el) => {
    const capas = [];
    let n = el;
    while (n && n !== document) {
      const st = getComputedStyle(n);
      capas.push(parse(st.backgroundColor));
      n = n.parentElement;
    }
    let acc = lienzo.slice();
    for (let i = capas.length - 1; i >= 0; i--) acc = over(capas[i], acc);
    return acc;
  };
  const visible = (el) => {
    const st = getComputedStyle(el);
    if (st.display === 'none' || st.visibility === 'hidden' || st.opacity === '0') return false;
    const r = el.getBoundingClientRect();
    return r.width >= 4 && r.height >= 4;
  };
  const out = [];
  const vistos = new Set();
  for (const sel of selectores) {
    let lista = [];
    try { lista = [...document.querySelectorAll(sel)]; } catch { continue; }
    for (const el of lista) {
      if (!visible(el) || vistos.has(el)) continue;
      vistos.add(el);
      const st = getComputedStyle(el);
      const color = parse(st.color);
      const bg = fondoEfectivo(el);
      const r = ratio(color, bg);
      const fs = parseFloat(st.fontSize) || 16;
      const fw = parseInt(st.fontWeight, 10) || 400;
      const grande = fs >= 18 || (fs >= 14 && fw >= 700);
      const umbral = grande ? 3 : 4.5;
      const txt = (el.innerText || el.getAttribute('aria-label') || el.title || el.tagName).trim().slice(0, 40);
      out.push({
        sel, tag: el.tagName.toLowerCase(), className: String(el.className || '').slice(0, 80),
        text: txt, color: hex(color), bg: hex(bg), ratio: Math.round(r * 100) / 100,
        fontSize: fs, weight: fw, grande, umbral, ok: r + 1e-6 >= umbral,
        lumText: Math.round(lum(color) * 1000) / 1000, lumBg: Math.round(lum(bg) * 1000) / 1000,
      });
    }
  }
  return out;
};

export function umbralDe(item) { return item.umbral; }

export async function forzarHover(page, el) {
  try {
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('DOM.enable');
    await cdp.send('CSS.enable');
    const obj = await el.evaluateHandle((n) => n);
    const { nodeId } = await cdp.send('DOM.describeNode', { objectId: obj.remoteObject().objectId, depth: 0 }).catch(() => ({}));
    // describeNode no always returns a backend node we can force; use pierce + box hover
    await el.scrollIntoViewIfNeeded().catch(() => {});
    await el.hover({ force: true }).catch(() => {});
    return cdp;
  } catch {
    await el.hover({ force: true }).catch(() => {});
    return null;
  }
}

async function medirPagina(page, { hover = false, lienzo } = {}) {
  const tema = await page.evaluate(() => document.documentElement.getAttribute('data-theme') || 'light');
  const fondo = lienzo || (tema === 'dark' ? [10, 10, 12, 1] : [245, 245, 247, 1]);
  if (!hover) return page.evaluate(MEDIR_JS, { selectores: SELECTORES, lienzo: fondo });
  // Medir cada elemento forzado en :hover (el ratón encima)
  const handles = [];
  for (const sel of SELECTORES) {
    const loc = page.locator(sel);
    const n = await loc.count();
    for (let i = 0; i < Math.min(n, 8); i++) handles.push(loc.nth(i));
  }
  const out = [];
  const seen = new Set();
  for (const loc of handles) {
    const box = await loc.boundingBox().catch(() => null);
    if (!box || box.width < 4 || box.height < 4) continue;
    const key = await loc.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return el.tagName + '|' + el.className + '|' + Math.round(r.x) + '|' + Math.round(r.y);
    }).catch(() => null);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    await loc.scrollIntoViewIfNeeded().catch(() => {});
    await loc.hover({ force: true }).catch(() => {});
    const item = await loc.evaluate((el, lienzo) => {
      const parse = (s) => {
        if (!s || s === 'transparent' || s === 'none') return [0, 0, 0, 0];
        const m = String(s).match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/);
        if (m) return [+m[1], +m[2], +m[3], m[4] == null ? 1 : +m[4]];
        return [0, 0, 0, 0];
      };
      const over = (fg, bg) => {
        const a = fg[3] + bg[3] * (1 - fg[3]);
        if (a === 0) return [0, 0, 0, 0];
        return [
          (fg[0] * fg[3] + bg[0] * bg[3] * (1 - fg[3])) / a,
          (fg[1] * fg[3] + bg[1] * bg[3] * (1 - fg[3])) / a,
          (fg[2] * fg[3] + bg[2] * bg[3] * (1 - fg[3])) / a,
          a,
        ];
      };
      const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
      const lum = (c) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
      const ratio = (a, b) => { const [x, y] = lum(a) > lum(b) ? [lum(a), lum(b)] : [lum(b), lum(a)]; return (x + 0.05) / (y + 0.05); };
      const hex = (c) => '#' + [c[0], c[1], c[2]].map((n) => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, '0')).join('');
      const capas = [];
      let n = el;
      while (n && n !== document) { capas.push(parse(getComputedStyle(n).backgroundColor)); n = n.parentElement; }
      let acc = lienzo.slice();
      for (let i = capas.length - 1; i >= 0; i--) acc = over(capas[i], acc);
      const st = getComputedStyle(el);
      const color = parse(st.color);
      const r = ratio(color, acc);
      const fs = parseFloat(st.fontSize) || 16;
      const fw = parseInt(st.fontWeight, 10) || 400;
      const grande = fs >= 18 || (fs >= 14 && fw >= 700);
      const umbral = grande ? 3 : 4.5;
      return {
        sel: el.matches('.as-tabs a') ? '.as-tabs a' : (el.className || el.tagName),
        tag: el.tagName.toLowerCase(), className: String(el.className || '').slice(0, 80),
        text: (el.innerText || '').trim().slice(0, 40),
        color: hex(color), bg: hex(acc), ratio: Math.round(r * 100) / 100,
        fontSize: fs, weight: fw, grande, umbral, ok: r + 1e-6 >= umbral,
        lumText: Math.round(lum(color) * 1000) / 1000, lumBg: Math.round(lum(acc) * 1000) / 1000,
        hoverBg: st.backgroundColor,
      };
    }, fondo).catch(() => null);
    if (item) out.push(item);
  }
  // quitar el hover
  await page.mouse.move(0, 0).catch(() => {});
  return out;
}

function plantillaHTML() {
  return `<!DOCTYPE html>
<html lang="es" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Plantilla contraste modo oscuro</title>
${CSS.map((c) => `<link rel="stylesheet" href="${ORIGIN}/${c}?v=${Date.now()}">`).join('\n')}
<style>
  /* Solo la plantilla: no forma parte del portal */
  .fx { padding: 24px; display: grid; gap: 22px; }
  .fx h2 { margin: 0 0 8px; font-size: 13px; font-weight: 650; color: var(--gris); text-transform: uppercase; letter-spacing: .04em; }
</style>
</head>
<body class="scr-asig" style="background: var(--fondo); color: var(--tinta);">
<div class="fx">
  <section>
    <h2>Pestañas de la asignatura</h2>
    <nav class="as-tabs as-secs" role="tablist">
      <a role="tab" class="on" href="#t"><span class="as-tt">Teoría</span></a>
      <a role="tab" href="#p"><span class="as-tt">Presentaciones</span></a>
      <a role="tab" href="#g"><span class="as-tt">Gestión</span></a>
      <a role="tab" href="#l"><span class="as-tt">Laboratorio</span></a>
    </nav>
  </section>
  <section>
    <h2>Pestañas del panel</h2>
    <nav class="pn-tabs">
      <a class="on" href="#cursos">Cursos</a>
      <a href="#grupos">Grupos</a>
      <a href="#cuaderno">Cuaderno</a>
    </nav>
  </section>
  <section>
    <h2>Pestañas de entrada y biblioteca</h2>
    <div class="gate-tabs">
      <button type="button" class="on">Soy profesor</button>
      <button type="button">Soy alumno</button>
    </div>
    <div class="bib-chips" style="margin-top:10px">
      <button type="button" class="bib-chip on">Todas</button>
      <button type="button" class="bib-chip">EEE</button>
      <button type="button" class="bib-chip">TIC I</button>
    </div>
    <div class="tabs" style="margin-top:10px">
      <button type="button" class="on">Material</button>
      <button type="button">Esquema</button>
      <button type="button">Prueba</button>
    </div>
  </section>
  <section>
    <h2>Barra de la asignatura</h2>
    <div class="asigbar">
      <div class="asb-tabs">
        <a class="on" href="#t">Teoría</a>
        <a href="#p">Prácticas</a>
        <a href="#l">Laboratorio</a>
      </div>
    </div>
  </section>
  <section>
    <h2>Navegación, botones y chevrones</h2>
    <nav class="top-nav">
      <a class="top-nav-a on" href="#asig">Asignatura</a>
      <a class="top-nav-a" href="#aula">Aula</a>
      <a class="top-nav-a" href="#cal">Calendario</a>
    </nav>
    <p>
      <button type="button" class="btn">Secundario</button>
      <button type="button" class="btn primary">Primario</button>
      <button type="button" class="pchip-b">Salir</button>
      <button type="button" class="cl-th-chev" aria-label="Plegar tema"><svg class="ic" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg></button>
    </p>
  </section>
  <section>
    <h2>Lista de trabajos y gestión</h2>
    <div class="cl-items">
      <a class="cl-it" href="#it"><span class="cl-tx"><b>Apuntes de la ley de Ohm</b></span></a>
      <div class="cl-it"><span class="cl-tx"><b>Tarea: medir tensiones</b></span></div>
    </div>
    <div class="sg-grid" style="margin-top:14px">
      <article class="sg-card" data-sg-card="calificaciones">
        <div class="sg-card-h"><span class="sg-card-ic">★</span><h3>Calificaciones</h3></div>
        <div class="sg-card-acts"><button type="button" class="btn">Cuaderno de calificaciones</button></div>
      </article>
      <article class="sg-card" data-sg-card="exportar">
        <div class="sg-card-h"><span class="sg-card-ic">↓</span><h3>Exportar y copias</h3></div>
        <div class="sg-card-acts"><button type="button" class="btn">Exportar asignatura</button></div>
      </article>
    </div>
    <ul class="sg-lista" style="margin-top:10px">
      <li class="sg-fila"><span>Teoría</span><button type="button" class="btn tiny">Ocultar</button></li>
    </ul>
  </section>
  <section>
    <h2>Tablas, campos y calendario</h2>
    <table class="tbl"><thead><tr><th>Alumno</th><th>Nota</th></tr></thead>
    <tbody><tr class="pn-row"><td>nº 4</td><td>7,5</td></tr><tr class="pn-row"><td>nº 5</td><td>8,0</td></tr></tbody></table>
    <p><input type="text" value="buscar" aria-label="buscar"> <select aria-label="grupo"><option>2º CFGB</option></select></p>
    <div class="ap-vista"><button type="button" class="ap-vista-b on">Por actividad</button><button type="button" class="ap-vista-b">Por criterio</button></div>
  </section>
</div>
</body></html>`;
}

export async function cargarPlantilla(page, { theme = 'dark', bodyClass = 'scr-asig' } = {}) {
  await page.setContent(plantillaHTML(), { waitUntil: 'load' });
  await page.evaluate(({ theme, bodyClass }) => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.className = bodyClass;
  }, { theme, bodyClass });
  await page.waitForTimeout(200);
}

export async function capturarHover(page, sel, ruta) {
  const loc = page.locator(sel).first();
  if (!(await loc.count())) return false;
  await loc.scrollIntoViewIfNeeded();
  await loc.hover({ force: true });
  await page.waitForTimeout(80);
  await page.screenshot({ path: ruta, fullPage: false });
  return true;
}

function resumir(items, etiqueta) {
  const mal = items.filter((x) => !x.ok);
  const lavado = items.filter((x) => x.lumText >= 0.7 && x.lumBg >= 0.7);
  return { etiqueta, total: items.length, ok: items.length - mal.length, fallos: mal, lavado };
}

function imprimir(res) {
  console.log(`\n[${res.etiqueta}] ${res.ok}/${res.total} con contraste suficiente`);
  if (res.lavado.length) {
    console.log(`  fondeados claros con texto claro: ${res.lavado.length}`);
    for (const x of res.lavado.slice(0, 20)) {
      console.log(`    LAVADO  ${x.ratio}:1  texto ${x.color} (L=${x.lumText}) fondo ${x.bg} (L=${x.lumBg})  «${x.text}»  .${x.className}`);
    }
  }
  for (const x of res.fallos) {
    console.log(`    FALLO   ${x.ratio}:1 < ${x.umbral}  texto ${x.color} fondo ${x.bg}  «${x.text}»  .${x.className}`);
  }
}

export async function barrerPlantilla(page, { etapa = ETAPA, viewport = { width: 1280, height: 800 } } = {}) {
  await page.setViewportSize(viewport);
  await cargarPlantilla(page, { theme: 'dark', bodyClass: 'scr-asig' });
  const repo = await medirPagina(page, { hover: false });
  await page.waitForTimeout(120);
  await page.screenshot({ path: `${CAP}${etapa}/plantilla_oscuro_${viewport.width}.png`, fullPage: false });
  await capturarHover(page, '.as-tabs a:not(.on)', `${CAP}${etapa}/pestana_as_hover_${viewport.width}.png`);
  await capturarHover(page, '.pn-tabs a:not(.on)', `${CAP}${etapa}/pestana_pn_hover_${viewport.width}.png`);
  await capturarHover(page, '.gate-tabs button:not(.on)', `${CAP}${etapa}/pestana_gate_hover_${viewport.width}.png`);
  await capturarHover(page, '.bib-chip:not(.on)', `${CAP}${etapa}/pestana_bib_hover_${viewport.width}.png`);
  await capturarHover(page, '.tabs button:not(.on)', `${CAP}${etapa}/pestana_tabs_hover_${viewport.width}.png`);
  await capturarHover(page, 'a.cl-it, .cl-it', `${CAP}${etapa}/cl_it_hover_${viewport.width}.png`);
  await capturarHover(page, '.btn:not(.primary):not(.pn-peligro)', `${CAP}${etapa}/btn_hover_${viewport.width}.png`);
  const hover = await medirPagina(page, { hover: true });
  const r1 = resumir(repo, `${etapa} plantilla ${viewport.width} reposo`);
  const r2 = resumir(hover, `${etapa} plantilla ${viewport.width} hover`);
  imprimir(r1); imprimir(r2);
  return { repo, hover, r1, r2 };
}

export async function ponerOscuro(page) {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.evaluate(() => { try { localStorage.setItem('portal.tema', 'dark'); } catch {} window.portalTema?.elegir('dark'); document.documentElement.setAttribute('data-theme', 'dark'); });
  await page.waitForTimeout(200);
}

export async function ponerClaro(page) {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.evaluate(() => { try { localStorage.setItem('portal.tema', 'light'); } catch {} window.portalTema?.elegir('light'); document.documentElement.setAttribute('data-theme', 'light'); });
  await page.waitForTimeout(200);
}

export async function barrerPortal(page, { etiqueta, rutas, etapa = ETAPA, ok = null, viewports = [{ width: 1280, height: 800 }, { width: 390, height: 844 }] } = {}) {
  const informes = [];
  for (const vp of viewports) {
    await page.setViewportSize(vp);
    await ponerOscuro(page);
    for (const ruta of rutas) {
      await page.goto(ruta, { waitUntil: 'domcontentloaded' }).catch(() => {});
      await page.waitForTimeout(400);
      await ponerOscuro(page);
      const slug = etiqueta + '_' + (ruta.split('#')[1] || 'ini').replace(/[^\w]+/g, '_') + '_' + vp.width;
      await page.screenshot({ path: `${CAP}${etapa}/${slug}.png`, fullPage: false });
      const repo = await medirPagina(page, { hover: false });
      // hover de la primera pestaña no activa, si hay
      const hayTab = await page.$('.as-tabs a:not(.on), .pn-tabs a:not(.on), .bib-chip:not(.on), .tabs button:not(.on)');
      if (hayTab) {
        await capturarHover(page, '.as-tabs a:not(.on), .pn-tabs a:not(.on), .bib-chip:not(.on), .tabs button:not(.on)', `${CAP}${etapa}/${slug}_hover.png`);
      }
      const hover = await medirPagina(page, { hover: true });
      const r1 = resumir(repo, `${etapa} ${etiqueta} ${vp.width} ${ruta} reposo`);
      const r2 = resumir(hover, `${etapa} ${etiqueta} ${vp.width} ${ruta} hover`);
      imprimir(r1); imprimir(r2);
      informes.push({ ruta, vp, r1, r2, repo, hover });
      if (ok) {
        ok(`contraste oscuro ${r1.etiqueta}: sin lavados blanco-sobre-claro`, r1.lavado.length === 0, r1.lavado.map((x) => x.text).join(', '));
        ok(`contraste oscuro ${r2.etiqueta}: sin lavados blanco-sobre-claro`, r2.lavado.length === 0, r2.lavado.map((x) => x.text).join(', '));
        const graves = [...r1.fallos, ...r2.fallos].filter((x) => x.lumText >= 0.55 && x.lumBg >= 0.55);
        ok(`contraste oscuro ${r2.etiqueta}: texto claro no cae sobre fondo claro`, graves.length === 0, graves.map((x) => `${x.text} ${x.ratio}`).join(', '));
      }
    }
  }
  return informes;
}

export async function barrerContraste({ P, A, M, BASE: B, ok, cap } = {}) {
  const base = B || BASE;
  if (cap) { /* las capturas siguen yendo a CAP; cap se acepta por si el llamador pasa carpeta */ }
  const rutasP = [
    base + '#panel/cursos',
    base + '#asig/eee/teoria',
    base + '#asig/eee/gestion',
    base + '#biblio',
    base + '#asignaturas',
  ];
  const rutasA = [
    base + '#asig/eee/teoria',
    base + '#asig/eee/tareas',
    base + '#aula',
  ];
  const out = [];
  if (P?.pg) out.push(...await barrerPortal(P.pg, { etiqueta: 'profesor', rutas: rutasP, ok }));
  if (A?.pg) out.push(...await barrerPortal(A.pg, { etiqueta: 'alumno', rutas: rutasA, ok }));
  if (M?.pg) out.push(...await barrerPortal(M.pg, { etiqueta: 'alumno-movil', rutas: [base + '#asig/eee/teoria', base + '#asig/eee/tareas'], ok, viewports: [{ width: 390, height: 844 }] }));
  return out;
}

function guardarInforme(nombre, data) {
  const ruta = CAP + nombre;
  writeFileSync(ruta, JSON.stringify(data, null, 2));
  console.log('Informe:', ruta);
  return ruta;
}

// --- ejecución directa (plantilla CSS; el portal se barre desde run_contraste.sh / secciones_e2e)
const soyPrincipal = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (soyPrincipal && process.env.CONTRASTE_IMPORT !== '1') {
  const soloCss = process.env.CONTRASTE_SOLO_CSS === '1' || !process.env.CONTRASTE_PORTAL;
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, colorScheme: 'dark' });
  const page = await ctx.newPage();
  const informes = {};
  informes.plantilla1280 = await barrerPlantilla(page, { etapa: ETAPA, viewport: { width: 1280, height: 800 } });
  informes.plantilla390 = await barrerPlantilla(page, { etapa: ETAPA, viewport: { width: 390, height: 844 } });
  // modo claro de la plantilla: referencia de que no lo tocamos
  await page.setViewportSize({ width: 1280, height: 800 });
  await cargarPlantilla(page, { theme: 'light', bodyClass: 'scr-asig' });
  const claroRepo = await medirPagina(page, { hover: false });
  await capturarHover(page, '.as-tabs a:not(.on)', `${CAP}claro/pestana_as_hover_1280_${ETAPA}.png`);
  await page.screenshot({ path: `${CAP}claro/plantilla_claro_1280_${ETAPA}.png`, fullPage: false });
  informes.claro = resumir(claroRepo, `${ETAPA} plantilla clara 1280 reposo`);
  imprimir(informes.claro);
  guardarInforme(`informe_${ETAPA}.json`, {
    etapa: ETAPA,
    plantilla: {
      d1280: { reposo: informes.plantilla1280.r1, hover: informes.plantilla1280.r2 },
      d390: { reposo: informes.plantilla390.r1, hover: informes.plantilla390.r2 },
      claro: informes.claro,
    },
    hover1280: informes.plantilla1280.hover,
    repo1280: informes.plantilla1280.repo,
  });
  await b.close();
  const malos = [...informes.plantilla1280.r2.fallos, ...informes.plantilla1280.r2.lavado, ...informes.plantilla1280.r1.lavado];
  if (ETAPA === 'despues' && process.env.CONTRASTE_SOLO_CSS === '1') {
    const graves = malos.filter((x) => x.lumText >= 0.55 && x.lumBg >= 0.55);
    if (graves.length) {
      console.error('\nFallo: siguen elementos con texto claro sobre fondo claro en hover.');
      process.exit(1);
    }
  }
}

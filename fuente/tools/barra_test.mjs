// Barras superiores sin textos solapados (cabecera, barra de la asignatura, migas, cabeceras de los simuladores
// y la esquina de sesión) en 5 tamaños, como alumno y como profesor (simulados, sin Firebase).
// Uso: node barra_test.mjs            (web local)
//      PORTAL_BASE=https://…/index.html SHOTS_DIR=/ruta node barra_test.mjs   (otra web / guardar capturas)
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
import { hashCodigo, leerConfig } from './set-codigo.mjs';
import { SITE_URL, codigoClase } from './rutas.mjs';
const base = process.env.PORTAL_BASE || SITE_URL + 'index.html';
const DIR = process.env.SHOTS_DIR || ''; if (DIR) mkdirSync(DIR, { recursive: true });
const SIZES = [[1366, 768], [1280, 800], [1024, 768], [768, 1024], [390, 844]];
const ROUTES = (process.env.RUTAS || '#inicio,#asignaturas,#asig/eee,#asig/eee/laboratorio,#eee/circuitos,#eee/circuitos/evaluacion,#eee/circuitos/c16,#eee/esp32,#eee/vivienda').split(',');
const ROLES = (process.env.ROLES || 'alumno,profesor').split(',');
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const cfg = leerConfig(); const acc = JSON.stringify({ version: cfg.version, hash: hashCodigo(codigoClase(), cfg.salt) });
const fallos = []; let n = 0;
// sesión simulada: el chip de la esquina y las entradas del encabezado iguales a las de la versión con Firebase
function simular(rol) {
  const prof = rol === 'profesor'; const a = (h, t) => `<a class="top-nav-a" href="${h}">${t}</a>`;
  window.PORTAL = Object.assign(window.PORTAL || {}, { rol, esProfesor: prof,
    chipHTML: () => prof ? '<span class="pchip prof"><span class="pchip-who">Profesor</span><button type="button" class="pchip-b">Salir</button></span>' : '<span class="pchip"><span class="pchip-who">1º A CFGB · nº 07</span><button type="button" class="pchip-b">Salir</button></span>',
    navHTML: () => `<nav class="top-nav" aria-label="Principal">${a('#asignaturas', '📅 Curso')}${prof ? '' : a('#mis-trabajos', 'Mis trabajos')}${a('#calendario', 'Calendario')}${prof ? a('#biblioteca', '🗂 Biblioteca') + a('#panel', '⚙️ Panel del profesor') : ''}</nav>` });
  const caja = document.createElement('div'); caja.id = 'sesCaja'; caja.className = 'ses-caja no-ic';
  caja.innerHTML = `<button type="button" class="ses-chip" id="sesBtn"><span class="ses-av ${prof ? 'prof' : 'alu'}">${prof ? 'PM' : '07'}<i class="ses-on"></i></span><span class="ses-t">${prof ? 'Profesor' : '1º A CFGB · nº 07'}</span></button>`;
  const t = document.getElementById('temaCaja'); if (t) t.insertBefore(caja, t.firstChild); else { caja.classList.add('sola'); document.body.appendChild(caja); }
  const w = Math.ceil((t || caja).getBoundingClientRect().width); document.documentElement.style.setProperty('--esquina-w', w + 'px');
  document.documentElement.classList.add('con-sesion');
}
// cajas de texto de las barras de arriba que se cruzan, se salen de la pantalla o quedan tapadas
function auditar() {
  const SEL = 'header.top, .scr-top, #asigbar, .cx-top, .cx-crumbs, #cxCrumbs, #crumbs, .crumbs, .vtitle, .stepbar, .vv-top, #temaCaja, #sesCaja, .cx-gbar';
  const vis = (el) => { for (let e = el; e && e !== document.body; e = e.parentElement) { const s = getComputedStyle(e); if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) return false; } return true; };
  // solo lo que está a la vista: la pantalla activa (o la página base del ESP32), la barra de la asignatura y la esquina
  const scr = [...document.querySelectorAll('.screen')].find(x => getComputedStyle(x).display !== 'none');
  const enVista = (c) => c.closest('#asigbar, #temaCaja') || (scr ? scr.contains(c) : !c.closest('.screen'));
  const conts = [...document.querySelectorAll(SEL)].filter(c => enVista(c) && vis(c) && c.getBoundingClientRect().height > 0 && c.getBoundingClientRect().top < innerHeight * 0.45);
  // parte visible de una caja: recortada por los contenedores con desbordamiento oculto o con desplazamiento
  // (texto con puntos suspensivos o navegación que se desliza): lo que no se ve no puede solaparse
  const recorte = (el, q) => { let L = q.left, T = q.top, Rr = q.right, B = q.bottom;
    for (let e = el; e && e !== document.body; e = e.parentElement) { const s = getComputedStyle(e); if (s.overflowX !== 'visible') { const c = e.getBoundingClientRect(); L = Math.max(L, c.left); Rr = Math.min(Rr, c.right); } if (s.overflowY !== 'visible') { const c = e.getBoundingClientRect(); T = Math.max(T, c.top); B = Math.min(B, c.bottom); } }
    return Rr - L > 0 && B - T > 0 ? { left: L, top: T, right: Rr, bottom: B, width: Rr - L, height: B - T } : null; };
  const atoms = [];
  for (const c of conts) {
    const tw = document.createTreeWalker(c, NodeFilter.SHOW_TEXT);
    for (let t; (t = tw.nextNode());) {
      if (!t.nodeValue.trim() || !vis(t.parentElement) || t.parentElement.closest('.ic-e, [aria-hidden="true"], option, select, script, style')) continue;
      const r = document.createRange(); r.selectNodeContents(t);
      for (const q0 of r.getClientRects()) { const q = recorte(t.parentElement, q0); if (q && q.width > 1 && q.height > 1) atoms.push({ el: t.parentElement, r: q, txt: t.nodeValue.trim().slice(0, 30) }); }
    }
    for (const s of c.querySelectorAll('svg.ic, select')) if (vis(s)) { const q = recorte(s, s.getBoundingClientRect()); if (q && q.width > 1) atoms.push({ el: s, r: q, txt: s.tagName === 'SELECT' ? '[select]' : '[icono]' }); }
  }
  const name = (e) => (e.id ? '#' + e.id : '') + (typeof e.className === 'string' && e.className ? '.' + e.className.trim().split(/\s+/)[0] : '') || e.tagName.toLowerCase();
  const out = []; const seen = new Set();
  for (let i = 0; i < atoms.length; i++) for (let j = i + 1; j < atoms.length; j++) {
    const A = atoms[i], B = atoms[j]; if (A.el === B.el || A.el.contains(B.el) || B.el.contains(A.el)) continue;
    const w = Math.min(A.r.right, B.r.right) - Math.max(A.r.left, B.r.left), h = Math.min(A.r.bottom, B.r.bottom) - Math.max(A.r.top, B.r.top);
    if (w > 2 && h > 2) { const k = A.txt + '|' + B.txt; if (!seen.has(k)) { seen.add(k); out.push(`solape «${A.txt}» (${name(A.el)}) con «${B.txt}» (${name(B.el)})`); } }
  }
  for (const A of atoms) {
    if (A.txt.startsWith('[')) continue;
    if (A.r.right > innerWidth + 1 || A.r.left < -1) { out.push(`fuera de pantalla «${A.txt}» (${name(A.el)})`); continue; }
    // texto cortado sin puntos suspensivos
    for (let e = A.el; e && e !== document.body; e = e.parentElement) { const s = getComputedStyle(e); if ((s.overflowX === 'hidden' || s.overflowX === 'clip') && e.scrollWidth > e.clientWidth + 2) { const q = e.getBoundingClientRect(); if ((A.r.right > q.right + 1 || A.r.left < q.left - 1) && s.textOverflow !== 'ellipsis' && !(e.scrollWidth && getComputedStyle(A.el).textOverflow === 'ellipsis')) out.push(`cortado «${A.txt}» (${name(A.el)} en ${name(e)})`); break; } }
    // tapado por otra cosa (p. ej. la barra de la asignatura o la esquina de sesión)
    const cx = Math.min(innerWidth - 1, A.r.left + A.r.width / 2), cy = A.r.top + A.r.height / 2; if (cy < 0 || cy > innerHeight) continue;
    const top = document.elementFromPoint(cx, cy);
    if (top && !A.el.contains(top) && !top.contains(A.el) && !A.el.closest('label')?.contains(top)) out.push(`tapado «${A.txt}» (${name(A.el)}) por ${name(top)}`);
  }
  // encabezado alineado con el contenido: bordes izquierdo y derecho iguales (±2 px) que el contenedor principal;
  // sin contenedor (simulador a pantalla completa), todas las barras con el mismo margen
  const BARS = [...document.querySelectorAll('#asigbar .asb-top, .scr-top, .crumbs, .cx-top, .cx-crumbs, .vv-top, .vv-crumbs, header.top')].filter(e => enVista(e) && vis(e) && e.getBoundingClientRect().height > 0);
  const cont = [...(scr || document).querySelectorAll('.subj-wrap, .as-hero-in, .as-wrap, .cx-hwrap, .vv-hw, .bib-wrap, .pn-wrap')].find(e => e.offsetParent !== null && e.getBoundingClientRect().width > 200);
  const tc = document.getElementById('temaCaja'); const tcv = tc && getComputedStyle(tc).display !== 'none' ? tc.getBoundingClientRect() : null;
  const bordes = (e) => { const q = e.getBoundingClientRect(), cs = getComputedStyle(e); let r = q.right - parseFloat(cs.paddingRight); if (tcv && e.matches('.scr-top:not(.asb-top)') && tcv.top < q.bottom) r = tcv.right; return { l: q.left + parseFloat(cs.paddingLeft), r }; };
  if (cont) {
    const q = cont.getBoundingClientRect(), cs = getComputedStyle(cont); const cl = q.left + parseFloat(cs.paddingLeft), cr = q.right - parseFloat(cs.paddingRight);
    for (const e of BARS) { const B = bordes(e); if (Math.abs(B.l - cl) > 2 || Math.abs(B.r - cr) > 2) out.push(`desalineado ${name(e)}: barra ${Math.round(B.l)}–${Math.round(B.r)} · contenido ${Math.round(cl)}–${Math.round(cr)}`); }
  } else if (BARS.length > 1) {
    const L = BARS.map(e => bordes(e).l); if (Math.max(...L) - Math.min(...L) > 2) out.push(`barras con márgenes distintos: ${BARS.map((e, i) => name(e) + ' ' + Math.round(L[i])).join(', ')}`);
  }
  // la barra de la asignatura no debe tapar la pantalla de debajo
  const ab = document.getElementById('asigbar');
  if (ab && !ab.hidden && document.body.classList.contains('con-asigbar')) {
    const h = ab.getBoundingClientRect().bottom; const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--asigbar-h')) || 0;
    if (Math.abs(h - v) > 2) out.push(`--asigbar-h (${v}px) no coincide con la altura de la barra (${Math.round(h)}px)`);
  }
  return out;
}
for (const rol of ROLES) for (const [w, h] of SIZES) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, ...(w < 800 ? { isMobile: true, hasTouch: true, deviceScaleFactor: 2 } : {}) });
  await ctx.route('**/js/firebase-config.js*', r => r.fulfill({ contentType: 'application/javascript', body: "window.PORTAL_FIREBASE={apiKey:'',projectId:''};" }));
  await ctx.addInitScript(([k, v]) => localStorage.setItem(k, v), ['portal.acceso', acc]);
  const pg = await ctx.newPage();
  await pg.goto(base + '#inicio'); await pg.waitForTimeout(1800); await pg.evaluate(simular, rol);
  for (const r of ROUTES) {
    await pg.evaluate((r) => { location.hash = r; }, r); await pg.waitForTimeout(r.includes('circuitos/c') || r.includes('esp32') || r.includes('vivienda') ? 2200 : 1100);
    await pg.evaluate(() => window.dispatchEvent(new Event('resize'))); await pg.waitForTimeout(250);
    const p = await pg.evaluate(auditar); n++;
    if (p.length) fallos.push(`${rol} ${w}x${h} ${r}: ${p.join(' · ')}`);
    if (DIR) await pg.screenshot({ path: `${DIR}/${rol}_${w}x${h}_${r.replace(/[#/]+/g, '_').replace(/^_/, '')}.png` });
  }
  await ctx.close();
}
await b.close();
for (const f of fallos) console.log('FAIL', f);
console.log(`\n${n - fallos.length}/${n} pantallas sin textos solapados en las barras de arriba`); process.exit(fallos.length ? 1 : 0);

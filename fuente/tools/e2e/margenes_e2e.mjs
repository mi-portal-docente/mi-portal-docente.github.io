// E2E de márgenes y maquetación (emuladores Auth + Firestore), como ALUMNO y como PROFESOR, en varios anchos:
// cabecera, migas, encabezado de la asignatura, pestañas y contenido con los mismos bordes; sin desbordamiento
// horizontal; nombre largo sin cortar a lo bruto; nada tapado por la cabecera fija ni por la barra inferior del móvil;
// la cabecera y la barra de secciones siguen accesibles al hacer scroll, al abrir el teclado y al cambiar de pestaña.
// Lanzar como aula_e2e (E2E_FS_PORT, E2E_AUTH_PORT, PORTAL_BASE). Capturas en CAPTURAS_MARGENES (si se define).
import { chromium } from 'playwright-core';
import { mkdirSync } from 'fs';
const FSP = process.env.E2E_FS_PORT || '8080', AUP = process.env.E2E_AUTH_PORT || '9099';
const BASE = process.env.PORTAL_BASE || 'http://127.0.0.1:8765/index.html';
const CAP = process.env.CAPTURAS_MARGENES ? process.env.CAPTURAS_MARGENES.replace(/\/?$/, '/') : ''; if (CAP) mkdirSync(CAP, { recursive: true });
const PROJ = 'demo-portal';
const CFG = `window.PORTAL_FIREBASE={apiKey:'demo-key',authDomain:'${PROJ}.firebaseapp.com',projectId:'${PROJ}',appId:'1:1:web:1'};window.PORTAL_FIREBASE_EMU={auth:'http://127.0.0.1:${AUP}',firestoreHost:'127.0.0.1',firestorePort:${FSP}};`;
const REST = `http://127.0.0.1:${FSP}/v1/projects/${PROJ}/databases/(default)/documents`;
const owner = { headers: { Authorization: 'Bearer owner', 'Content-Type': 'application/json' } };
const val = (v) => v === null ? { nullValue: null } : v instanceof Date ? { timestampValue: v.toISOString() } : Array.isArray(v) ? { arrayValue: { values: v.map(val) } } : typeof v === 'boolean' ? { booleanValue: v } : typeof v === 'number' ? (Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v }) : typeof v === 'object' ? { mapValue: { fields: campos(v) } } : { stringValue: String(v) };
const campos = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, val(v)]));
const poner = (ruta, o) => fetch(`${REST}/${ruta}`, { method: 'PATCH', ...owner, body: JSON.stringify({ fields: campos(o) }) });
const SIZES = (process.env.TAMANOS || '1440x900,1280x800,1024x768,768x1024,430x932,390x844,844x390').split(',').map(s => s.split('x').map(Number));
const ROLES = (process.env.ROLES || 'alumno,profesor').split(',');
const SOLO = process.env.RUTAS ? process.env.RUTAS.split(',') : null;
const fallos = []; let n = 0; const errores = [];
const benigno = (t) => /favicon|WebGL|GPU stall|swiftshader|GroupMarkerNotSet|Failed to load resource/i.test(t);

await fetch(`http://127.0.0.1:${FSP}/emulator/v1/projects/${PROJ}/databases/(default)/documents`, { method: 'DELETE' });
await fetch(`http://127.0.0.1:${AUP}/emulator/v1/projects/${PROJ}/accounts`, { method: 'DELETE' });
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
async function contexto(nombre, [w, h]) {
  const movil = w < 900 && (w < 600 || h < 500);
  const ctx = await b.newContext({ viewport: { width: w, height: h }, ...(movil ? { isMobile: true, hasTouch: true, deviceScaleFactor: 2 } : {}) });
  await ctx.route('**/js/firebase-config.js*', r => r.fulfill({ contentType: 'application/javascript', body: CFG }));
  const pg = await ctx.newPage(); await pg.addInitScript(() => { window.__dialogosNativos = true; }); await pg.addInitScript(utilidades);
  pg.on('pageerror', e => errores.push(`[${nombre}] pageerror: ${e.message}`));
  pg.on('console', m => { if (m.type() === 'error' && !benigno(m.text())) errores.push(`[${nombre}] console: ${m.text()}`); });
  pg.on('dialog', d => d.accept());
  return { ctx, pg };
}
const gateListo = (pg) => pg.waitForSelector('#gate-body:not([hidden])', { timeout: 20000 });
async function loginGoogle(pg, email) {
  await gateListo(pg); await pg.click('[data-gate-rol="profesor"]');
  const [pop] = await Promise.all([pg.waitForEvent('popup'), pg.click('#gate-google')]);
  await pop.waitForLoadState();
  const existe = pop.locator(`text=${email}`);
  if (await existe.count()) await existe.first().click();
  else { await pop.click('text=Add new account'); await pop.fill('#email-input', email); await pop.fill('#display-name-input', 'Profe'); await pop.click('#sign-in'); }
}
async function loginAlumno(pg, codigo, numero, pin) {
  await gateListo(pg);
  await pg.fill('#gate-code', codigo); await pg.selectOption('#gate-num', String(numero)); await pg.fill('#gate-pin', pin);
  await pg.click('#gate-alumno .gate-go');
}

// ---------------------------------------------------------------- medición (se ejecuta en la página)
// utilidades comunes: se inyectan con addInitScript como window.__mg
function utilidades() {
  const vis = (el) => { if (!el) return false; if (el.checkVisibility && !el.checkVisibility({ visibilityProperty: true, opacityProperty: true })) return false; if (el.closest('details:not([open])') && !el.closest('summary')) return false; for (let e = el; e && e !== document.documentElement; e = e.parentElement) { const s = getComputedStyle(e); if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) return false; } const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const name = (e) => !e ? '?' : (e.id ? '#' + e.id : '') + (typeof e.className === 'string' && e.className ? '.' + e.className.trim().split(/\s+/)[0] : '') || e.tagName.toLowerCase();
  const pantalla = () => [...document.querySelectorAll('.screen')].find(x => getComputedStyle(x).display !== 'none') || null;
  // el elemento que hace scroll: la pantalla activa (pantallas fijas con scroll propio) o la ventana
  const scroller = () => { const s = pantalla(); return s && s.scrollHeight > s.clientHeight + 2 && /auto|scroll/.test(getComputedStyle(s).overflowY) ? s : document.scrollingElement; };
  // cabeceras de verdad: fijas o pegajosas, arriba y visibles por encima de todo (no tapadas por otra pantalla)
  const cabeceras = () => [...document.querySelectorAll('header.top, .scr-top, #asigbar .asb-top, .cx-top, .vv-top')].filter(e => { if (!vis(e)) return false; const p = getComputedStyle(e).position; if (p !== 'fixed' && p !== 'sticky') return false; const r = e.getBoundingClientRect(); if (r.top > 4 || r.bottom < 10) return false; const t = document.elementFromPoint(Math.min(innerWidth - 2, r.left + 4), r.top + Math.min(r.height / 2, 20)); return t && (e.contains(t) || t.closest('#temaCaja')); });
  const barraInf = () => { const t = document.querySelector('#asig .as-tabs'); return t && vis(t) && getComputedStyle(t).position === 'fixed' && t.getBoundingClientRect().top > innerHeight * 0.5 ? t : null; };
  const encima = (el) => { const r = el.getBoundingClientRect(); const pts = [[r.left + r.width / 2, r.top + Math.min(r.height / 2, 12)], [r.left + 6, r.top + Math.min(r.height / 2, 12)]]; for (const [x, y] of pts) { if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) continue; const t = document.elementFromPoint(x, y); if (t && !el.contains(t) && !t.contains(el)) return t; } return null; };
  window.__mg = { vis, name, pantalla, scroller, cabeceras, barraInf, encima };
}
function auditar() {
  const { vis, name, pantalla, cabeceras, barraInf, encima } = window.__mg;
  const out = []; const W = innerWidth, H = innerHeight; const scr = pantalla();
  // 1) desbordamiento horizontal de la página
  const sw = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth, scr ? scr.scrollWidth : 0);
  if (sw > W + 1) {
    const culp = [...(scr || document.body).querySelectorAll('*')].filter(e => { if (!vis(e)) return false; const r = e.getBoundingClientRect(); if (r.right <= W + 1) return false; for (let p = e.parentElement; p && p !== document.body && p !== scr; p = p.parentElement) { if (getComputedStyle(p).overflowX !== 'visible') return false; } return true; });
    out.push(`desborda: ${sw} px > ${W} (${culp.filter(e => !culp.includes(e.parentElement)).slice(0, 4).map(e => name(e) + ' ' + Math.round(e.getBoundingClientRect().right)).join(', ')})`);
  }
  // 2) texto que se sale por la derecha dentro de una tarjeta que lo recorta (sin puntos suspensivos)
  if (scr) for (const e of scr.querySelectorAll('p, a, li, td, h1, h2, h3, .au-texto, .cl-it')) {
    if (!vis(e) || e.closest('.as-tabs, .top-nav, .crumbs, pre, code, svg, canvas')) continue;
    let rec = false; for (let p = e.parentElement; p && p !== scr; p = p.parentElement) if (getComputedStyle(p).overflowX !== 'visible') { rec = true; break; } if (rec) continue;
    const r = e.getBoundingClientRect(); if (r.right > W + 1 && getComputedStyle(e).position !== 'fixed') { out.push(`fuera de pantalla ${name(e)} «${e.textContent.trim().slice(0, 30)}» (${Math.round(r.right)} > ${W})`); break; }
  }
  // 3) nombre largo de la cabecera: sin cortar a lo bruto ni salirse
  for (const e of document.querySelectorAll('.brand-n, .brand-t, .cov-brand')) {
    if (!vis(e) || parseFloat(getComputedStyle(e).fontSize) === 0) continue;
    if (scr ? !scr.contains(e) && !e.closest('#asigbar') : false) continue; /* la cabecera general queda detrás de la pantalla activa */
    const s = getComputedStyle(e); const r = e.getBoundingClientRect();
    if (e.scrollWidth > e.clientWidth + 2 && s.textOverflow !== 'ellipsis' && /hidden|clip/.test(s.overflowX)) out.push(`nombre cortado ${name(e)}`);
    if (r.right > W + 1) out.push(`nombre fuera de pantalla ${name(e)}`);
    const t = encima(e); if (t && !t.closest('header, .cov-band')?.contains(e)) out.push(`nombre tapado por ${name(t)}`);
    const tc = document.getElementById('temaCaja'); if (tc && vis(tc)) { const q = tc.getBoundingClientRect(); if (r.right > q.left + 1 && r.bottom > q.top && r.top < q.bottom) out.push(`nombre debajo de la esquina de sesión (${Math.round(r.right)} > ${Math.round(q.left)})`); }
  }
  // 4) la navegación de la cabecera: cada enlace entero, no tapado por la esquina de sesión
  const heads = cabeceras(); const tc = document.getElementById('temaCaja'); const q = tc && vis(tc) ? tc.getBoundingClientRect() : null;
  for (const h of heads) for (const a of h.querySelectorAll('.top-nav a, .top-nav-a')) {
    if (!vis(a)) continue; const rg = document.createRange(); rg.selectNodeContents(a); const r = rg.getBoundingClientRect(); const nav = a.closest('.top-nav'); const n = nav.getBoundingClientRect();
    if (q && r.right > q.left + 1 && r.bottom > q.top + 1 && r.top < q.bottom - 1 && r.left < q.right) out.push(`«${a.textContent.trim()}» debajo de la esquina de sesión`);
    if (r.right > n.right + 1 && nav.scrollWidth <= nav.clientWidth + 1) out.push(`«${a.textContent.trim()}» cortado`);
    else if (r.right > n.right + 1 && n.right < W - 30) out.push(`«${a.textContent.trim()}» cortado (la navegación no usa todo el ancho: ${Math.round(n.right)} de ${W})`);
  }
  // 5) bordes izquierdos alineados: cabecera, migas, encabezado de la asignatura, pestañas y contenido
  const cont = [...(scr || document).querySelectorAll('.subj-wrap, .as-hero-in, .as-wrap, .cx-hwrap, .vv-hw, .bib-wrap, .pn-wrap')].find(e => vis(e) && e.getBoundingClientRect().width > 200);
  if (cont) { const L = (e) => e.getBoundingClientRect().left + parseFloat(getComputedStyle(e).paddingLeft); const cl = L(cont);
    for (const e of [...(scr || document).querySelectorAll('.scr-top, .crumbs, .as-hero-in, .as-wrap')].filter(vis)) if (Math.abs(L(e) - cl) > 2) out.push(`desalineado ${name(e)}: ${Math.round(L(e))} · contenido ${Math.round(cl)}`);
    const tabs = document.querySelector('#asig .as-tabs'); if (tabs && vis(tabs) && !barraInf() && Math.abs(tabs.getBoundingClientRect().left - cl) > 6) out.push(`pestañas desalineadas: ${Math.round(tabs.getBoundingClientRect().left)} · contenido ${Math.round(cl)}`); }
  // 6) el principio del contenido no queda debajo de la cabecera fija
  if (scr) { const prim = [...scr.querySelectorAll('h1, h2, .crumbs a, .crumbs span, .cl-it, p, .btn')].find(e => vis(e) && !heads.some(h => h.contains(e)) && getComputedStyle(e).position !== 'fixed' && !e.closest('.as-tabs, .ses-menu, [hidden]'));
    if (prim) { const t = encima(prim); if (t && heads.some(h => h.contains(t))) out.push(`tapado por la cabecera: ${name(prim)}`); } }
  // 8) enunciados de las preguntas (legend) dentro de su tarjeta, no montados sobre el borde
  if (scr) for (const f of scr.querySelectorAll('fieldset.au-q')) { const lg = f.querySelector(':scope > legend'); if (!vis(f) || !lg) continue; if (lg.getBoundingClientRect().top < f.getBoundingClientRect().top - 1) { out.push(`enunciado montado sobre el borde de la pregunta «${lg.textContent.trim().slice(0, 25)}»`); break; } }
  // 7) solapes: botones, enlaces y pestañas que se montan unos sobre otros (en flujo, dentro de la pantalla activa)
  if (scr) { const cs = [...scr.querySelectorAll('a, button, [role=tab], .btn, .chip, .pill')].filter(e => vis(e) && !e.closest('svg, canvas, .labg, .cx-stage, [hidden]') && !(() => { for (let x = e; x && x !== scr; x = x.parentElement) { const ps = getComputedStyle(x).position; if (ps === 'fixed' || ps === 'sticky' || ps === 'absolute') return true; } return false; })());
    const rs = cs.map(e => e.getBoundingClientRect()); let hay = 0;
    for (let i = 0; i < cs.length && hay < 2; i++) for (let j = i + 1; j < cs.length && hay < 2; j++) { if (cs[i].contains(cs[j]) || cs[j].contains(cs[i])) continue; const a = rs[i], c = rs[j];
      const ix = Math.min(a.right, c.right) - Math.max(a.left, c.left), iy = Math.min(a.bottom, c.bottom) - Math.max(a.top, c.top);
      if (ix > 4 && iy > 4 && a.bottom > 0 && c.bottom > 0 && a.top < H && c.top < H) { hay++; out.push(`solape ${name(cs[i])} «${cs[i].textContent.trim().slice(0, 20)}» con ${name(cs[j])} «${cs[j].textContent.trim().slice(0, 20)}»`); } } }
  return out;
}
// tras un gesto (scroll, cambio de pestaña, teclado): la cabecera y la barra de secciones siguen a la vista y se pueden pulsar
function accesible() {
  const { vis, name, pantalla, barraInf, encima } = window.__mg;
  const out = []; const scr = pantalla(); const H = innerHeight;
  const head = scr ? [...scr.querySelectorAll('.scr-top')].find(vis) : null;
  if (head) { const a = [...head.querySelectorAll('a, button')].find(vis); if (a) { const r = a.getBoundingClientRect(); if (r.bottom < 1 || r.top > H) out.push('el menú de la cabecera se va de la vista'); else { const t = encima(a); if (t && !t.closest('#temaCaja')) out.push(`el menú de la cabecera queda tapado por ${name(t)}`); } } }
  const bi = barraInf();
  const tabs = document.querySelector('#asig .as-tabs');
  // en el móvil, dentro de una asignatura con secciones, la barra inferior tiene que estar (no vale que se esconda)
  if (!bi && innerWidth <= 720 && /^#asig\//.test(location.hash) && document.querySelector('#asig .as-tabs.as-secs')) out.push('la barra inferior de secciones no se ve');
  if (bi) { for (const t of [...bi.querySelectorAll('[role=tab]')].filter(vis)) { const r = t.getBoundingClientRect(); if (r.left < 0 || r.right > innerWidth) continue; const x = encima(t); if (x) { out.push(`la barra de secciones queda debajo de ${name(x)}`); break; } } }
  else if (tabs && vis(tabs) && scr && scr.contains(tabs)) { /* pestañas en flujo (ordenador): se puede volver a ellas, no se exige que se vean */ }
  return out;
}
// el final del contenido no queda debajo de la barra inferior (con todo desplazado hasta abajo)
function finTapado() {
  const { pantalla, barraInf } = window.__mg; const bi = barraInf(); if (!bi) return [];
  const bt = bi.getBoundingClientRect().top; const scr = pantalla(); if (!scr) return [];
  const els = [...scr.querySelectorAll('a, button, p, li, h2, h3, .cl-it, input, textarea')].filter(e => !bi.contains(e) && window.__mg.vis(e) && getComputedStyle(e).position !== 'fixed' && !e.closest('[hidden], .ses-menu'));
  const last = els.sort((a, b) => b.getBoundingClientRect().bottom - a.getBoundingClientRect().bottom)[0];
  if (last && last.getBoundingClientRect().bottom > bt + 2) return [`lo último de la página queda debajo de la barra inferior (${Math.round(last.getBoundingClientRect().bottom)} > ${Math.round(bt)})`];
  return [];
}
const alFinal = () => { const s = window.__mg.scroller(); s.scrollTo(0, s.scrollHeight); };
const alPrincipio = () => { const s = window.__mg.scroller(); s.scrollTo(0, 0); window.scrollTo(0, 0); };

async function revisar(pg, rol, size, ruta, espera, etiqueta) {
  const [w, h] = size; const tag = etiqueta || ruta;
  if (espera === 'goto') { await pg.goto(BASE + ruta); } else { await pg.evaluate((r) => { location.hash = r; }, ruta); }
  await pg.waitForTimeout(/circuitos|esp32|vivienda/.test(ruta) ? 2600 : 1400);
  await pg.evaluate(alPrincipio); await pg.waitForTimeout(150);
  const p = await pg.evaluate(auditar);
  if (CAP) await pg.screenshot({ path: `${CAP}${rol}_${w}x${h}_${tag.replace(/[#/]+/g, '_').replace(/^_/, '')}.png` });
  // scroll hasta abajo: menús accesibles y final no tapado
  await pg.evaluate(alFinal); await pg.waitForTimeout(350);
  p.push(...(await pg.evaluate(accesible)).map(x => 'tras scroll: ' + x), ...(await pg.evaluate(finTapado)));
  if (CAP && w < 900) await pg.screenshot({ path: `${CAP}${rol}_${w}x${h}_${tag.replace(/[#/]+/g, '_').replace(/^_/, '')}_abajo.png` });
  await pg.evaluate(alPrincipio); n++;
  if (p.length) fallos.push(`${rol} ${w}x${h} ${tag}: ${p.join(' · ')}`);
}

let G, curso;
try {
  // ---------------------------------------------------------------- profesor: curso, grupo y contenido
  const P = await contexto('profesor-setup', [1440, 900]);
  await P.pg.goto(BASE); await loginGoogle(P.pg, 'profe@test.es');
  await P.pg.waitForSelector('#pnGrupoForm', { timeout: 30000 });
  await P.pg.goto(BASE + '#panel/cursos'); await P.pg.waitForSelector('#apCursoForm');
  await P.pg.check('#apCursoForm [name=asig][value=eee]'); await P.pg.check('#apCursoForm [name=asig][value=tic1]');
  await P.pg.click('#apCursoForm button[type=submit]');
  await P.pg.waitForSelector('.pn-grupo[data-curso]', { timeout: 15000 });
  curso = await P.pg.getAttribute('.pn-grupo[data-curso]', 'data-curso');
  await P.pg.goto(BASE + '#panel/grupos');
  await P.pg.waitForFunction(() => document.querySelector('#pnGrupoForm [name=curso]')?.selectedOptions[0]?.textContent.includes('2026/27'), null, { timeout: 15000 });
  await P.pg.fill('#pnGrupoForm [name=nombre]', '2º CFGB'); await P.pg.fill('#pnGrupoForm [name=alumnos]', '20');
  for (const cb of await P.pg.$$('#pnGrupoForm [name=asig]')) { const v = await cb.getAttribute('value'); if ((v === 'eee' || v === 'tic1') !== await cb.isChecked()) await cb.click(); }
  await P.pg.click('#pnGrupoForm button[type=submit]');
  await P.pg.waitForFunction(() => /creado/.test(document.querySelector('#pnFormMsg')?.textContent || ''), null, { timeout: 15000 });
  G = await P.pg.evaluate(() => { const g = [...document.querySelectorAll('.pn-grupo')].find(x => x.querySelector('h3').textContent === '2º CFGB'); return { codigo: g.querySelector('.pn-code').textContent, id: g.dataset.grupo }; });
  const base = { curso, texto: '', enlaces: [], grupos: [G.id], visible: [G.id], publicado: true };
  await poner('temas/tmUno01', { curso, asig: 'eee', nombre: 'SA1 · Electricidad y circuitos básicos del taller', orden: 1 });
  const largo = 'Instrucciones: medid la tensión en cada resistencia con el polímetro y anotad los valores en la tabla. '.repeat(6) + ' https://www.ejemplo-de-enlace-muy-largo-sin-espacios.es/ruta/que/no/se/corta/bien/en/el/movil/archivo.pdf';
  const ITEMS = {
    itMat001: { ...base, asig: 'eee', tipo: 'material', titulo: 'Apuntes de la ley de Ohm', tema: 'tmUno01', orden: 1, seccion: 'teoria', enlaces: [{ t: 'Ley de Ohm.pdf', u: 'materiales/eee/sa1/SA1_Trabajo2_cables.pdf' }] },
    itTar003: { ...base, asig: 'eee', tipo: 'tarea', titulo: 'Tarea: medir tensiones en un circuito en serie con tres resistencias distintas', tema: 'tmUno01', orden: 3, texto: largo, fechaEntrega: Date.now() + 5 * 864e5, puntos: 10 },
    itPre004: { ...base, asig: 'eee', tipo: 'pregunta', titulo: '¿Qué es un circuito?', tema: 'tmUno01', orden: 4, puntos: 10 },
    itAct005: { ...base, asig: 'eee', tipo: 'actividad', titulo: 'Actividad: código de colores', tema: 'tmUno01', orden: 5, puntos: 10 },
    itPra006: { ...base, asig: 'eee', tipo: 'practica', titulo: 'Práctica: el polímetro', tema: 'tmUno01', orden: 6, puntos: 10 },
    itTic007: { ...base, asig: 'tic1', tipo: 'tarea', titulo: 'Tarea de T.I.C.: hoja de cálculo', orden: 1, fechaEntrega: Date.now() + 3 * 864e5, puntos: 10 },
    itTst008: { ...base, asig: 'eee', tipo: 'examen', titulo: 'Test: la ley de Ohm', tema: 'tmUno01', orden: 8, puntos: 10, examen: { desde: Date.now() - 864e5, hasta: Date.now() + 864e5, limiteMin: 20, barajar: false } },
  };
  for (const [id, it] of Object.entries(ITEMS)) await poner('items/' + id, it);
  await poner('examenes/itTst008', { curso, asig: 'eee', publicado: true, desde: new Date(Date.now() - 864e5), hasta: new Date(Date.now() + 864e5), limiteMin: 20, barajar: false, grupos: [G.id], preguntas: [{ id: 'q1', tipo: 'test', enunciado: '¿En qué unidad se mide la resistencia eléctrica de un conductor?', puntos: 1, opciones: ['Voltio', 'Ohmio', 'Amperio'] }, { id: 'q2', tipo: 'vf', enunciado: 'La tensión se mide en paralelo.', puntos: 1 }, { id: 'q3', tipo: 'corta', enunciado: '¿Qué aparato mide la intensidad?', puntos: 1 }] });
  await poner('claves/itTst008', { respuestas: { q1: 1, q2: true, q3: 'amperimetro' } });
  await poner('anuncios/anUno001', { curso, asig: 'eee', texto: 'Mañana traed el polímetro. ' + 'Recordad también la libreta del taller. '.repeat(3), grupos: [G.id], visible: [G.id], fecha: Date.now() });
  await P.ctx.close();

  const RUTAS_ALU = ['#inicio', '#asignaturas', '#asig/eee/avisos', '#asig/eee/teoria', '#asig/eee/clase', '#asig/eee/tareas', '#asig/eee/test', '#asig/eee/examenes', '#asig/eee/laboratorio', '#asig/tic1', '#mis-trabajos', '#calendario', '#trabajo/itTar003', '#eee/circuitos', '#eee/esp32', '#eee/vivienda'];
  const RUTAS_PROF = ['#inicio', '#asignaturas', '#asig/eee/gestion', '#asig/eee/tareas', '#asig/eee/laboratorio', '#asig/tic1', '#calendario', '#biblioteca', '#panel', '#trabajo/itTar003', '#eee/circuitos'];
  let num = 1;
  for (const rol of ROLES) for (const size of SIZES) {
    const { ctx, pg } = await contexto(`${rol}-${size.join('x')}`, size);
    if (rol === 'alumno') { await pg.goto(BASE); await loginAlumno(pg, G.codigo, num++, '4321'); await pg.waitForSelector('.pchip-who, #sesCaja', { timeout: 30000 }); }
    else { await pg.goto(BASE); await loginGoogle(pg, 'profe@test.es'); await pg.waitForSelector('#pnGrupoForm, .pchip-who', { timeout: 30000 }); }
    await pg.waitForTimeout(800);
    for (const r of (SOLO || (rol === 'alumno' ? RUTAS_ALU : RUTAS_PROF))) await revisar(pg, rol, size, r);
    if (rol === 'alumno' && !SOLO) {
      // cambio de pestaña con la barra inferior: sigue a la vista y el contenido empieza arriba
      await pg.goto(BASE + '#asig/eee/tareas'); await pg.waitForTimeout(1400);
      await pg.evaluate(alFinal); await pg.waitForTimeout(300);
      const t = await pg.$('#asig .as-tabs #tab-avisos'); if (t) { await t.click({ timeout: 5000 }).catch((e) => fallos.push(`${rol} ${size.join('x')} cambiar de pestaña: no se puede pulsar «Avisos» (${e.message.split('\n')[0]})`)); await pg.waitForTimeout(900); const a = await pg.evaluate(accesible); n++; if (a.length) fallos.push(`${rol} ${size.join('x')} tras cambiar de pestaña: ${a.join(' · ')}`); }
      // teclado: enfoca el campo de la entrega y encoge la vista (como el teclado del móvil)
      if (size[0] < 900) {
        await pg.goto(BASE + '#trabajo/itTar003'); await pg.waitForTimeout(1500);
        const campo = await pg.$('#enForm [name=texto], textarea, input[type=text]');
        if (campo) { await campo.focus(); await pg.setViewportSize({ width: size[0], height: Math.round(size[1] * 0.55) }); await pg.waitForTimeout(300); await campo.evaluate((e) => e.scrollIntoView({ block: 'nearest' })); await pg.waitForTimeout(300);
          const a = await pg.evaluate(() => { const f = document.activeElement; const r = f.getBoundingClientRect(); const out = []; const hd = [...(window.__mg.pantalla() || document).querySelectorAll('.scr-top')].find(window.__mg.vis); const hb = hd ? hd.getBoundingClientRect().bottom : 0; if (r.top < hb - 2) out.push(`el campo con el teclado queda debajo de la cabecera`); if (r.top > innerHeight - 20) out.push('el campo con el teclado queda fuera de la vista'); return out; });
          a.push(...await pg.evaluate(accesible)); n++; if (a.length) fallos.push(`${rol} ${size.join('x')} con teclado: ${a.join(' · ')}`);
          if (CAP) await pg.screenshot({ path: `${CAP}${rol}_${size.join('x')}_teclado.png` });
          await pg.setViewportSize({ width: size[0], height: size[1] }); }
        // modo examen
        await pg.goto(BASE + '#trabajo/itTst008'); const emp = await pg.waitForSelector('[data-au=empezar]', { timeout: 15000 }).catch(() => null);
        if (emp) { let abierto = null; for (let i = 0; i < 4 && !abierto; i++) { await pg.locator('[data-au=empezar]').click({ timeout: 5000 }).catch(() => {}); abierto = await pg.waitForSelector('#auExamen', { timeout: 4000 }).catch(() => null); } if (!abierto) fallos.push(`${rol} ${size.join('x')} examen: no se abre (${await pg.textContent('#auMsg').catch(() => '')})`); await revisar(pg, rol, size, '#trabajo/itTst008', 'stay', 'examen'); }
      }
    }
    await ctx.close();
  }
} catch (e) { fallos.push('ERROR ' + e.message.split('\n')[0]); console.log(e.stack); }
await b.close();
for (const f of fallos) console.log('FAIL', f);
for (const e of errores.slice(0, 15)) console.log('ERR ', e);
console.log(`\n${n - fallos.length}/${n} pantallas sin problemas de márgenes`); process.exit(fallos.length ? 1 : 0);

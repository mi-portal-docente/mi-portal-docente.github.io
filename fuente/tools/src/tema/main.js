// Tema claro / oscuro / automático del portal. Se carga el primero en <head> (síncrono) para que no haya destello:
// pone data-theme="light|dark" en <html> antes de pintar y, al cargar la página, añade el botón de la esquina.
// La preferencia se guarda en localStorage («portal.tema» = light | dark | auto). Los laboratorios 3D siguen claros.
const CLAVE = 'portal.tema';
const OPC = [
  { v: 'light', t: 'Claro', i: 'sun' },
  { v: 'dark', t: 'Oscuro', i: 'moon' },
  { v: 'auto', t: 'Automático (sistema)', i: 'monitor' },
];
// Iconos Lucide (ISC), en línea: no se descarga nada
const SVG = {
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  moon: '<path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/>',
  monitor: '<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
};
const ic = (n) => `<svg class="ic" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${SVG[n]}</svg>`;

const root = document.documentElement;
const mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
function leer() { try { const v = localStorage.getItem(CLAVE); return v === 'light' || v === 'dark' ? v : 'auto'; } catch (e) { return 'auto'; } }
function resuelto(p) { return p === 'auto' ? (mq && mq.matches ? 'dark' : 'light') : p; }
let pref = leer();
function aplicar() {
  const t = resuelto(pref);
  root.setAttribute('data-theme', t);
  root.setAttribute('data-tema-pref', pref);
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => { m.setAttribute('content', t === 'dark' ? '#000000' : '#f2f2f7'); m.removeAttribute('media'); });
  pintarBoton();
}
function elegir(p) {
  pref = p;
  try { if (p === 'auto') localStorage.removeItem(CLAVE); else localStorage.setItem(CLAVE, p); } catch (e) { /* modo privado: solo esta visita */ }
  aplicar();
}
if (mq) { const f = () => { if (pref === 'auto') aplicar(); }; mq.addEventListener ? mq.addEventListener('change', f) : mq.addListener && mq.addListener(f); }
window.addEventListener('storage', (e) => { if (e.key === CLAVE) { pref = leer(); aplicar(); } });

// ---- botón de la esquina con menú (Claro / Oscuro / Automático)
let caja = null;
function pintarBoton() {
  if (!caja) return;
  const o = OPC.find((x) => x.v === pref);
  const b = caja.querySelector('.tema-btn');
  b.innerHTML = ic(o.i);
  b.setAttribute('aria-label', `Tema: ${o.t}. Cambiar entre claro, oscuro o automático`);
  b.title = `Tema: ${o.t}`;
  caja.querySelectorAll('[role=menuitemradio]').forEach((it) => it.setAttribute('aria-checked', String(it.dataset.tema === pref)));
}
function abrir(foco) {
  const m = caja.querySelector('.tema-menu'); const b = caja.querySelector('.tema-btn');
  m.hidden = false; b.setAttribute('aria-expanded', 'true');
  const its = [...m.querySelectorAll('[role=menuitemradio]')];
  (foco === 'ultimo' ? its[its.length - 1] : its.find((x) => x.dataset.tema === pref) || its[0]).focus();
}
function cerrar(devolverFoco) {
  const m = caja.querySelector('.tema-menu'); const b = caja.querySelector('.tema-btn');
  if (m.hidden) return; m.hidden = true; b.setAttribute('aria-expanded', 'false'); if (devolverFoco) b.focus();
}
function crearBoton() {
  caja = document.createElement('div');
  caja.id = 'temaCaja'; caja.className = 'tema-caja no-ic';
  caja.innerHTML = `<button type="button" class="tema-btn" id="temaBtn" aria-haspopup="menu" aria-expanded="false" aria-controls="temaMenu"></button>
    <div class="tema-menu" id="temaMenu" role="menu" aria-label="Apariencia" hidden>
      <div class="tema-tit" aria-hidden="true">Apariencia</div>
      ${OPC.map((o) => `<button type="button" role="menuitemradio" aria-checked="false" data-tema="${o.v}" tabindex="-1">${ic(o.i)}<span>${o.t}</span><span class="tema-ok">${ic('check')}</span></button>`).join('')}
    </div>`;
  const b = caja.querySelector('.tema-btn'); const m = caja.querySelector('.tema-menu');
  b.addEventListener('click', () => (m.hidden ? abrir() : cerrar()));
  b.addEventListener('keydown', (e) => { if (e.key === 'ArrowDown') { e.preventDefault(); abrir(); } else if (e.key === 'ArrowUp') { e.preventDefault(); abrir('ultimo'); } });
  m.addEventListener('click', (e) => { const it = e.target.closest('[data-tema]'); if (it) { elegir(it.dataset.tema); cerrar(true); } });
  m.addEventListener('keydown', (e) => {
    const its = [...m.querySelectorAll('[role=menuitemradio]')]; const i = its.indexOf(document.activeElement);
    if (e.key === 'Escape') { e.preventDefault(); cerrar(true); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); its[(i + 1) % its.length].focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); its[(i - 1 + its.length) % its.length].focus(); }
    else if (e.key === 'Home') { e.preventDefault(); its[0].focus(); }
    else if (e.key === 'End') { e.preventDefault(); its[its.length - 1].focus(); }
    else if (e.key === 'Tab') cerrar(false);
  });
  document.addEventListener('pointerdown', (e) => { if (!caja.contains(e.target)) cerrar(false); });
  pintarBoton();
}
function colocar() { if (!caja) crearBoton(); if (caja.parentNode !== document.body) document.body.appendChild(caja); }
aplicar();
function iniciar() {
  colocar();
  // si alguna pantalla rehace el <body>, el botón vuelve a su sitio
  new MutationObserver(() => { if (caja.parentNode !== document.body) document.body.appendChild(caja); }).observe(document.body, { childList: true });
}
if (document.body) iniciar(); else document.addEventListener('DOMContentLoaded', iniciar);
window.portalTema = { elegir, get preferencia() { return pref; }, get tema() { return resuelto(pref); } };

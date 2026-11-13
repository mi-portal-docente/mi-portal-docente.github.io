// Chip de sesión en la esquina superior derecha (junto al botón de tema): quién ha entrado, «Sesión iniciada»
// y «Cerrar sesión». Profesor: iniciales y su correo (solo lo ve él). Alumno: grupo y nº de lista (sin nombre).
// Iconos Lucide (ISC) en línea.
import { esc } from './util.js';

const P = {
  'log-out': '<path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/>',
  panel: '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
  escudo: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  libro: '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
};
const ic = (n) => `<svg class="ic" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${P[n]}</svg>`;
const hora = (t) => new Date(t).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

function iniciales({ nombre, email }) {
  const n = String(nombre || '').trim();
  if (n) { const p = n.split(/\s+/); return ((p[0][0] || '') + (p.length > 1 ? p[1][0] : (p[0][1] || ''))).toUpperCase(); }
  const e = String(email || 'P').split('@')[0].replace(/[^a-zA-Z]/g, ''); return (e.slice(0, 2) || 'P').toUpperCase();
}

// datos = { rol: 'profesor'|'alumno', email, nombre, grupo, numero, desde, salir }
export function montarChipSesion(datos) {
  document.getElementById('sesCaja')?.remove();
  const esProf = datos.rol === 'profesor';
  const pad = (n) => String(n).padStart(2, '0');
  const av = esProf ? iniciales(datos) : pad(datos.numero);
  const corto = esProf ? 'Profesor' : `${datos.grupo || 'Grupo'} · nº ${pad(datos.numero)}`;
  const titulo = esProf ? (datos.nombre || 'Profesor') : `Alumno · nº ${pad(datos.numero)}`;
  const sub = esProf ? datos.email || '' : `Grupo ${datos.grupo || ''}`;
  const caja = document.createElement('div');
  caja.id = 'sesCaja'; caja.className = 'ses-caja no-ic';
  caja.innerHTML = `<button type="button" class="ses-chip" id="sesBtn" aria-haspopup="menu" aria-expanded="false" aria-controls="sesMenu"
      aria-label="Sesión iniciada: ${esc(corto)}. Abrir el menú de la cuenta" title="Sesión iniciada · ${esc(corto)}">
      <span class="ses-av ${esProf ? 'prof' : 'alu'}" aria-hidden="true">${esc(av)}<i class="ses-on"></i></span><span class="ses-t">${esc(corto)}</span></button>
    <div class="ses-menu" id="sesMenu" role="menu" aria-label="Cuenta" hidden>
      <div class="ses-cab" role="presentation"><span class="ses-av grande ${esProf ? 'prof' : 'alu'}" aria-hidden="true">${esc(av)}</span>
        <div><div class="ses-nom">${esc(titulo)}</div><div class="ses-sub">${esc(sub)}</div>
        <div class="ses-est"><i class="ses-on"></i>Sesión iniciada${datos.desde ? ' · desde las ' + hora(datos.desde) : ''}</div></div></div>
      <div class="ses-rol" role="presentation">${ic(esProf ? 'escudo' : 'libro')}<span>${esProf ? 'Profesor · cuenta de Google autorizada' : 'Alumno · sin nombre ni correo: solo grupo y nº'}</span></div>
      ${esProf ? `<a role="menuitem" tabindex="-1" href="#panel">${ic('panel')}<span>Panel del profesor</span></a>
      <a role="menuitem" tabindex="-1" href="#panel/usuarios">${ic('users')}<span>Usuarios y conectados</span></a>` : ''}
      <button type="button" role="menuitem" tabindex="-1" class="ses-salir" id="sesSalir">${ic('log-out')}<span>Cerrar sesión</span></button>
    </div>`;
  const b = caja.querySelector('#sesBtn'); const m = caja.querySelector('#sesMenu');
  const its = () => [...m.querySelectorAll('[role=menuitem]')];
  const abrir = (ult) => {
    const tm = document.getElementById('temaMenu'); if (tm && !tm.hidden) { tm.hidden = true; document.getElementById('temaBtn')?.setAttribute('aria-expanded', 'false'); }
    m.hidden = false; b.setAttribute('aria-expanded', 'true'); const L = its(); (ult ? L[L.length - 1] : L[0])?.focus();
  };
  const cerrar = (foco) => { if (m.hidden) return; m.hidden = true; b.setAttribute('aria-expanded', 'false'); if (foco) b.focus(); };
  b.addEventListener('click', () => (m.hidden ? abrir() : cerrar()));
  b.addEventListener('keydown', (e) => { if (e.key === 'ArrowDown') { e.preventDefault(); abrir(); } else if (e.key === 'ArrowUp') { e.preventDefault(); abrir(true); } });
  m.addEventListener('keydown', (e) => {
    const L = its(); const i = L.indexOf(document.activeElement);
    if (e.key === 'Escape') { e.preventDefault(); cerrar(true); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); L[(i + 1) % L.length].focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); L[(i - 1 + L.length) % L.length].focus(); }
    else if (e.key === 'Home') { e.preventDefault(); L[0].focus(); }
    else if (e.key === 'End') { e.preventDefault(); L[L.length - 1].focus(); }
    else if (e.key === 'Tab') cerrar(false);
  });
  m.addEventListener('click', (e) => { if (e.target.closest('a')) cerrar(false); });
  caja.querySelector('#sesSalir').addEventListener('click', () => { cerrar(false); datos.salir(); });
  document.addEventListener('pointerdown', (e) => { if (!caja.contains(e.target)) cerrar(false); });
  document.addEventListener('click', (e) => { if (e.target.closest && e.target.closest('#temaBtn')) cerrar(false); });
  // Va dentro del grupo de la esquina (junto al botón de tema); si no existe, crea el suyo.
  const colocar = () => {
    const t = document.getElementById('temaCaja');
    if (t) { if (caja.parentNode !== t) t.insertBefore(caja, t.firstChild); }
    else if (caja.parentNode !== document.body) { caja.classList.add('sola'); document.body.appendChild(caja); }
    medir();
  };
  const medir = () => { const t = document.getElementById('temaCaja') || caja; const w = Math.ceil(t.getBoundingClientRect().width) || 0; if (w) document.documentElement.style.setProperty('--esquina-w', w + 'px'); };
  document.documentElement.classList.add('con-sesion');
  colocar();
  new MutationObserver(() => { if (!caja.isConnected) colocar(); }).observe(document.body, { childList: true, subtree: false });
  if (window.ResizeObserver) new ResizeObserver(medir).observe(caja);
  window.addEventListener('resize', medir);
  return { quitar() { caja.remove(); document.documentElement.classList.remove('con-sesion'); } };
}

// Resumen del dispositivo sin datos personales: navegador · sistema (· móvil / tableta).
export function resumenDispositivo() {
  const ua = navigator.userAgent || '';
  const nav = /Edg\//.test(ua) ? 'Edge' : /OPR\//.test(ua) ? 'Opera' : /SamsungBrowser/.test(ua) ? 'Samsung Internet' : /Firefox\//.test(ua) ? 'Firefox'
    : /CriOS|Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : 'Navegador';
  const so = /CrOS/.test(ua) ? 'ChromeOS' : /Android/.test(ua) ? 'Android' : /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) ? (/iPad/.test(ua) || /Macintosh/.test(ua) ? 'iPadOS' : 'iOS')
    : /Windows/.test(ua) ? 'Windows' : /Mac OS X/.test(ua) ? 'macOS' : /Linux/.test(ua) ? 'Linux' : '';
  const tipo = /Mobi|iPhone/.test(ua) ? 'móvil' : /iPad|Tablet/.test(ua) || so === 'iPadOS' || (so === 'Android' && !/Mobi/.test(ua)) ? 'tableta' : '';
  return [nav, so, tipo].filter(Boolean).join(' · ').slice(0, 60);
}

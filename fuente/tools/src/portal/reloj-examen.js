// Reloj del examen bien visible (bloque 1): fijo arriba de la pantalla (también con scroll y a pantalla
// completa), números grandes, barra del tiempo que queda, ámbar a 5 min y rojo con parpadeo suave a 1 min,
// y avisos que se cierran solos (sin alert()). Se cuelga del <body> para que ningún contenedor lo recorte.
// Si el examen no tiene límite de tiempo, cuenta lo que falta para que cierre.
import { ic } from './ico.js';

const pad = (n) => String(n).padStart(2, '0');
export function fmtReloj(s) {
  s = Math.max(0, Math.round(s)); const h = Math.floor(s / 3600); const m = Math.floor((s % 3600) / 60);
  return h ? `${h}:${pad(m)}:${pad(s % 60)}` : `${pad(m)}:${pad(s % 60)}`;
}
// Estado del reloj según los segundos que quedan: '' (normal) · 'ambar' (≤ 5 min) · 'rojo' (≤ 1 min)
export const nivelReloj = (s) => (s <= 60 ? 'rojo' : s <= 300 ? 'ambar' : '');

export function aviso(texto, { ms = 4500, tipo = '' } = {}) {
  const t = document.createElement('div'); t.className = 'ex-toast ' + tipo; t.setAttribute('role', 'alert');
  t.innerHTML = `${ic('timer')}<span></span>`; t.querySelector('span').textContent = texto;
  document.body.appendChild(t); requestAnimationFrame(() => t.classList.add('on'));
  setTimeout(() => { t.classList.remove('on'); setTimeout(() => t.remove(), 400); }, ms);
  return t;
}

// fin: ms en que se acaba; inicio: ms en que empezó (para la barra); sinLimite: true → «hasta que cierre»
// extra: texto pequeño (p. ej. «Prueba del profesor · no se guarda»)
export function crearReloj({ id = 'auReloj', fin, inicio, sinLimite = false, extra = '' }) {
  document.getElementById(id)?.remove();
  const el = document.createElement('div'); el.className = 'ex-reloj'; el.id = id; el.setAttribute('role', 'timer');
  el.innerHTML = `<div class="ex-reloj-in"><div class="ex-reloj-n">${ic('timer')}<span class="ex-sr">Tiempo restante: </span><b class="ex-reloj-t">--:--</b></div>
    <div class="ex-reloj-sub">${sinLimite ? 'hasta que cierre' : 'te quedan'}${extra ? ' · ' + extra : ''}</div>
    <div class="ex-reloj-barra" aria-hidden="true"><i></i></div></div>`;
  document.body.appendChild(el); document.body.classList.add('con-reloj');
  const total = Math.max(1, (fin - inicio) / 1000); const avisados = new Set();
  function tic(ahora = Date.now()) {
    const s = Math.max(0, Math.round((fin - ahora) / 1000));
    el.querySelector('.ex-reloj-t').textContent = fmtReloj(s);
    el.querySelector('.ex-reloj-barra i').style.width = Math.max(0, Math.min(100, (s / total) * 100)).toFixed(2) + '%';
    const nv = nivelReloj(s); el.classList.toggle('ambar', nv === 'ambar'); el.classList.toggle('rojo', nv === 'rojo');
    el.classList.toggle('poco', s < 120);
    if (s > 0 && s <= 60 && !avisados.has(1)) { avisados.add(1); avisados.add(5); aviso('Te queda 1 minuto', { tipo: 'rojo' }); }
    else if (s > 60 && s <= 300 && !avisados.has(5)) { avisados.add(5); aviso('Te quedan 5 minutos', { tipo: 'ambar' }); }
    return s;
  }
  function quitar() { el.remove(); if (!document.querySelector('.ex-reloj')) document.body.classList.remove('con-reloj'); }
  tic();
  return { tic, quitar, el };
}

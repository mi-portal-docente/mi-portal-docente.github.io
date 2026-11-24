// Bloque 3 · visor de imágenes de las preguntas: se abre ampliada al tocarla, con zoom de dos dedos en el
// móvil (y rueda o botones + / − en el ordenador), arrastrar para moverla y doble toque para acercar.
// Sin librerías: Pointer Events. Se cierra con la X, con Esc o tocando fuera de la imagen.
import { ic } from './ico.js';

export function abrirVisor(src, alt = '') {
  document.querySelector('.ex-visor')?.remove();
  const ov = document.createElement('div'); ov.className = 'ex-visor'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Imagen ampliada');
  ov.innerHTML = `<div class="ex-visor-zona"><img alt="" draggable="false"></div>
    <div class="ex-visor-bar"><button type="button" class="ex-visor-b" data-v="menos" aria-label="Alejar">${ic('zoom-out')}</button><button type="button" class="ex-visor-b" data-v="mas" aria-label="Acercar">${ic('zoom-in')}</button><button type="button" class="ex-visor-b" data-v="cerrar" aria-label="Cerrar">${ic('x')}</button></div>
    <p class="ex-visor-ayuda">Pellizca con dos dedos para ampliar</p>`;
  const img = ov.querySelector('img'); img.src = src; img.alt = alt || 'Imagen ampliada';
  const T = { s: 1, x: 0, y: 0 }; const P = new Map(); let ini = null; let ultimoToque = 0; let movido = false;
  const lim = () => { T.s = Math.max(1, Math.min(6, T.s)); if (T.s === 1) { T.x = 0; T.y = 0; } };
  const pintar = () => { lim(); img.style.transform = `translate(${T.x}px, ${T.y}px) scale(${T.s})`; ov.classList.toggle('zoom', T.s > 1); };
  const zoomEn = (f, cx, cy) => { const r = ov.getBoundingClientRect(); const px = (cx ?? r.width / 2) - r.width / 2, py = (cy ?? r.height / 2) - r.height / 2; const s0 = T.s; T.s = Math.max(1, Math.min(6, T.s * f)); const k = T.s / s0; T.x = px - (px - T.x) * k; T.y = py - (py - T.y) * k; pintar(); };
  const cerrar = () => { ov.remove(); document.removeEventListener('keydown', tecla, true); volver?.focus?.(); };
  const tecla = (e) => { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); cerrar(); } if (e.key === '+') zoomEn(1.4); if (e.key === '-') zoomEn(1 / 1.4); };
  const volver = document.activeElement;
  ov.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.ex-visor-bar')) return;
    ov.setPointerCapture?.(e.pointerId); P.set(e.pointerId, { x: e.clientX, y: e.clientY }); movido = false;
    if (P.size === 2) { const [a, b] = [...P.values()]; ini = { d: Math.hypot(a.x - b.x, a.y - b.y), s: T.s, x: T.x, y: T.y, cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2 }; }
    else if (P.size === 1) ini = { px: e.clientX, py: e.clientY, x: T.x, y: T.y };
  });
  ov.addEventListener('pointermove', (e) => {
    if (!P.has(e.pointerId)) return; P.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (P.size === 2 && ini?.d) { const [a, b] = [...P.values()]; const d = Math.hypot(a.x - b.x, a.y - b.y); const r = ov.getBoundingClientRect(); const s0 = ini.s; T.s = Math.max(1, Math.min(6, s0 * d / ini.d)); const k = T.s / s0; const px = ini.cx - r.width / 2, py = ini.cy - r.height / 2; const cx = (a.x + b.x) / 2 - ini.cx, cy = (a.y + b.y) / 2 - ini.cy; T.x = px - (px - ini.x) * k + cx; T.y = py - (py - ini.y) * k + cy; movido = true; pintar(); }
    else if (P.size === 1 && ini?.px != null && T.s > 1) { T.x = ini.x + e.clientX - ini.px; T.y = ini.y + e.clientY - ini.py; if (Math.abs(e.clientX - ini.px) + Math.abs(e.clientY - ini.py) > 4) movido = true; pintar(); }
  });
  const fin = (e) => {
    if (!P.has(e.pointerId)) return; P.delete(e.pointerId);
    if (P.size === 1) { const [a] = [...P.values()]; ini = { px: a.x, py: a.y, x: T.x, y: T.y }; return; }
    if (P.size) return; ini = null;
    if (e.type !== 'pointerup' || movido) return;
    const ahora = Date.now();
    if (ahora - ultimoToque < 320) { ultimoToque = 0; if (T.s > 1) { T.s = 1; pintar(); } else zoomEn(2.5, e.clientX, e.clientY); return; }
    ultimoToque = ahora;
    if (e.target === ov || e.target.classList.contains('ex-visor-zona')) setTimeout(() => { if (ultimoToque === ahora && T.s === 1) cerrar(); }, 330);
  };
  ov.addEventListener('pointerup', fin); ov.addEventListener('pointercancel', fin);
  ov.addEventListener('wheel', (e) => { e.preventDefault(); zoomEn(e.deltaY < 0 ? 1.15 : 1 / 1.15, e.clientX, e.clientY); }, { passive: false });
  ov.addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (!b) return; if (b.dataset.v === 'cerrar') cerrar(); if (b.dataset.v === 'mas') zoomEn(1.5); if (b.dataset.v === 'menos') zoomEn(1 / 1.5); });
  document.addEventListener('keydown', tecla, true);
  document.body.appendChild(ov);
  ov.querySelector('[data-v=cerrar]').focus();
  return { cerrar, ov };
}

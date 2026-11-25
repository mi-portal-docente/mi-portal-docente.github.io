// Revisión del examen de un alumno (profesor): el examen COMPLETO como lo contestó, en una ventana de solo lectura,
// con cada pregunta marcada (correcta / a medias / incorrecta), la solución y los puntos. No escribe nada en Firestore:
// solo pinta con los datos que ya están cargados en el cuaderno.
import { esc } from './util.js';
import { ic } from './ico.js';
import { fmtNota } from '../lms/modelo.js';
import { preguntaHTML, marcarCorreccion } from './examen-ui.js';
import { abrirVisor } from './visor-img.js';

// V: versión del alumno ({ preguntas, semilla }); K: soluciones; resp: sus respuestas; auto: resultado de corregirExamen
export function abrirRevisionExamen({ titulo, quien, examen, V, K, resp, auto, estado = '', fecha = '', nota = null, publicada = false, comentario = '' }) {
  document.querySelector('.rv-modal')?.remove();
  const m = document.createElement('div'); m.className = 'cl-modal rv-modal'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); m.setAttribute('aria-label', 'Examen del alumno');
  const pq = V.preguntas || [];
  const sin = pq.filter((q) => resp?.[q.id] == null).length;
  m.innerHTML = `<div class="cl-dlg cl-dlg-s rv-dlg">
    <header class="cl-dlg-h rv-h"><button type="button" class="btn small" data-rv="cerrar" aria-label="Cerrar">${ic('x')} Cerrar</button><h3>${esc(titulo)} · ${esc(quien)}</h3></header>
    <div class="cl-dlg-b1 rv-body">
      <div class="au-aviso rv-aviso">${ic('eye')} <b>Solo lectura</b>: así contestó el examen. No se guarda nada.${estado ? ' ' + esc(estado) : ''}${fecha ? ' · ' + esc(fecha) : ''}</div>
      <div class="ia-res ${auto.nota >= 5 ? 'ok' : 'ko'} rv-res" role="status"><b>${esc(fmtNota(auto.puntos))} / ${esc(fmtNota(auto.max))} puntos · Nota ${esc(fmtNota(auto.nota))}</b><span>${nota != null ? `Nota guardada: <b>${esc(fmtNota(nota))}</b> (${publicada ? 'publicada' : 'sin publicar'})` : 'Todavía sin nota guardada'}${sin ? ` · ${sin} pregunta${sin === 1 ? '' : 's'} sin responder` : ''}${auto.revisar?.length ? ` · ${auto.revisar.length} para corregir a mano` : ''}</span></div>
      ${comentario ? `<p class="au-small rv-com">${ic('message-square')} ${esc(comentario)}</p>` : ''}
      <form class="au-form rv-form" autocomplete="off" onsubmit="return false">${pq.map((q, n) => preguntaHTML(q, resp?.[q.id], { n: n + 1, barajarOps: !!examen?.barajar, s: V.semilla })).join('')}</form>
    </div></div>`;
  document.body.appendChild(m);
  const form = m.querySelector('.rv-form');
  marcarCorreccion([...form.querySelectorAll('fieldset[data-q]')], pq, K || {}, auto.detalle || {}, true, resp || {});
  // solo lectura: los campos no se pueden tocar, pero las imágenes se siguen pudiendo ampliar
  form.querySelectorAll('fieldset[data-q]').forEach((fs) => { fs.disabled = false; });
  form.querySelectorAll('input, select, textarea, button:not([data-zoom])').forEach((e) => { e.disabled = true; });
  form.querySelectorAll('[contenteditable]').forEach((e) => e.setAttribute('contenteditable', 'false'));
  form.querySelectorAll('[draggable="true"]').forEach((e) => e.setAttribute('draggable', 'false'));
  form.querySelectorAll('.ex-ab-barra').forEach((e) => e.remove());
  const cerrar = () => { m.remove(); document.removeEventListener('keydown', tecla); window.removeEventListener('hashchange', cerrar); };
  const tecla = (e) => { if (e.key === 'Escape' && !document.querySelector('.ex-visor')) cerrar(); };
  document.addEventListener('keydown', tecla); window.addEventListener('hashchange', cerrar);
  m.addEventListener('click', (e) => {
    if (e.target === m || e.target.closest('[data-rv=cerrar]')) return cerrar();
    const z = e.target.closest('[data-zoom]'); if (z) { e.preventDefault(); abrirVisor(z.dataset.zoom, z.dataset.alt || ''); }
  });
  m.querySelector('[data-rv=cerrar]').focus();
  return { cerrar };
}

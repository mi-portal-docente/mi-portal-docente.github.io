// Revisión del examen de un alumno (profesor): el examen COMPLETO como lo contestó, en una ventana de solo lectura,
// con cada pregunta marcada (correcta / a medias / incorrecta), la solución y los puntos. No escribe nada en Firestore:
// solo pinta con los datos que ya están cargados en el cuaderno.
import { esc } from './util.js';
import { ic } from './ico.js';
import { fmtNota } from '../lms/modelo.js';
import { preguntaHTML, marcarCorreccion } from './examen-ui.js';
import { abrirVisor } from './visor-img.js';
import { ajusteDe } from '../lms/ajustes.js';

// V: versión del alumno ({ preguntas, semilla }); K: soluciones; resp: sus respuestas; auto: resultado de corregirExamen
export function abrirRevisionExamen({ titulo, quien, examen, V, K, resp, auto, estado = '', fecha = '', nota = null, publicada = false, comentario = '', ajustes = null, ajustar = null }) {
  document.querySelector('.rv-modal')?.remove();
  const m = document.createElement('div'); m.className = 'cl-modal rv-modal'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); m.setAttribute('aria-label', 'Examen del alumno');
  const pq = V.preguntas || [];
  const sin = pq.filter((q) => resp?.[q.id] == null).length;
  m.innerHTML = `<div class="cl-dlg cl-dlg-s rv-dlg">
    <header class="cl-dlg-h rv-h"><button type="button" class="btn small" data-rv="cerrar" aria-label="Cerrar">${ic('x')} Cerrar</button><h3>${esc(titulo)} · ${esc(quien)}</h3></header>
    <div class="cl-dlg-b1 rv-body">
      <div class="au-aviso rv-aviso">${ic('eye')} <b>Solo lectura</b>: así contestó el examen. Sus respuestas no se cambian${ajustar ? '; solo puedes ajustar los puntos de una pregunta' : '. No se guarda nada'}.${estado ? ' ' + esc(estado) : ''}${fecha ? ' · ' + esc(fecha) : ''}</div>
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
  // Ajustes del profesor (fuera del formulario deshabilitado): «Dar por válida», «Deshacer» y la marca «Ajustada»
  if (ajustar) form.querySelectorAll('fieldset[data-q]').forEach((fs) => {
    const q = pq.find((x) => x.id === fs.dataset.q); if (!q || q.tipo === 'abierta') return;
    const aj = ajusteDe(ajustes, q.id); const max = Number(q.puntos) > 0 ? Number(q.puntos) : 1; const p = auto.detalle?.[q.id] ?? 0;
    const d = document.createElement('div'); d.className = 'aj-bar'; d.setAttribute('role', 'group'); d.setAttribute('aria-label', 'Ajuste del profesor');
    d.innerHTML = `${aj ? `<span class="aj-badge">${ic('user-check')} Ajustada por el profesor · antes ${esc(fmtNota(aj.a))} pt</span>` : ''}<span class="au-small">${esc(fmtNota(p))} / ${esc(fmtNota(max))} pt</span>${p < max ? `<button type="button" class="btn small aj-ok" data-rv="valida" data-qid="${esc(q.id)}">${ic('check')} Dar por válida</button>` : ''}${aj ? `<button type="button" class="btn small" data-rv="deshacer" data-qid="${esc(q.id)}">${ic('undo-2')} Deshacer</button>` : ''}`;
    fs.after(d);
  });
  const cerrar = () => { m.remove(); document.removeEventListener('keydown', tecla); window.removeEventListener('hashchange', cerrar); };
  const tecla = (e) => { if (e.key === 'Escape' && !document.querySelector('.ex-visor')) cerrar(); };
  document.addEventListener('keydown', tecla); window.addEventListener('hashchange', cerrar);
  m.addEventListener('click', (e) => {
    if (e.target === m || e.target.closest('[data-rv=cerrar]')) return cerrar();
    const aj = e.target.closest('[data-rv=valida], [data-rv=deshacer]');
    if (aj && ajustar) { const q = pq.find((x) => x.id === aj.dataset.qid); aj.disabled = true; const y = m.querySelector('.rv-body')?.scrollTop || 0; Promise.resolve(ajustar(aj.dataset.qid, aj.dataset.rv === 'valida' ? (Number(q?.puntos) > 0 ? Number(q.puntos) : 1) : null)).then(() => { const b = document.querySelector('.rv-modal .rv-body'); if (b) b.scrollTop = y; }); return; }
    const z = e.target.closest('[data-zoom]'); if (z) { e.preventDefault(); abrirVisor(z.dataset.zoom, z.dataset.alt || ''); }
  });
  m.querySelector('[data-rv=cerrar]').focus();
  return { cerrar };
}

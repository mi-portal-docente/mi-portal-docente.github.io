// Revisión del examen de un alumno (profesor): el examen COMPLETO como lo contestó, en pantalla completa.
// Las respuestas no se pueden cambiar. Si se pasa «ajustar», el profesor puede dar por válida una pregunta,
// poner puntos o deshacer, con la misma lógica que en el detalle del cuaderno (lms/ajustes.js).
import { esc } from './util.js';
import { ic } from './ico.js';
import { fmtNota, corregirExamen } from '../lms/modelo.js';
import { preguntaHTML, marcarCorreccion } from './examen-ui.js';
import { abrirVisor } from './visor-img.js';
import { barraAjusteHTML } from './ajuste-ui.js';

function textoNota(res) {
  return `Nota <b>${esc(fmtNota(res.nota))}</b> · ${esc(fmtNota(res.puntos))} / ${esc(fmtNota(res.max))} pt`;
}

// V: versión del alumno ({ preguntas, semilla }); K: soluciones; resp: sus respuestas; auto: resultado de corregirExamen
// mismos: { idPregunta: n } compañeros del grupo con la misma respuesta (para «válida para todos»).
export function abrirRevisionExamen({ titulo, quien, examen, V, K, resp, auto, estado = '', fecha = '', nota = null, publicada = false, comentario = '', ajustes = null, ajustar = null, mismos = {} }) {
  document.querySelector('.rv-modal')?.remove();
  const m = document.createElement('div'); m.className = 'cl-modal rv-modal'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); m.setAttribute('aria-label', ajustar ? 'Examen del alumno, con corrección' : 'Examen del alumno');
  const pq = V.preguntas || [];
  const sin = pq.filter((q) => resp?.[q.id] == null).length;
  const aviso = ajustar
    ? `${ic('clipboard-check')} Así contestó el examen. Sus respuestas no se cambian; puedes dar por válida una pregunta, cambiar sus puntos o deshacer un ajuste.`
    : `${ic('eye')} <b>Solo lectura</b>: así contestó el examen. Sus respuestas no se cambian. No se guarda nada.`;
  m.innerHTML = `<div class="cl-dlg cl-dlg-s rv-dlg">
    <header class="cl-dlg-h rv-h"><button type="button" class="btn small" data-rv="cerrar" aria-label="Cerrar">${ic('x')} Cerrar</button><h3>${esc(titulo)} · ${esc(quien)}</h3><p class="rv-h-nota" role="status">${textoNota(auto)}</p></header>
    <div class="cl-dlg-b1 rv-body">
      <div class="au-aviso rv-aviso">${aviso}${estado ? ' ' + esc(estado) : ''}${fecha ? ' · ' + esc(fecha) : ''}</div>
      <div class="ia-res ${auto.nota >= 5 ? 'ok' : 'ko'} rv-res" role="status"><b>${esc(fmtNota(auto.puntos))} / ${esc(fmtNota(auto.max))} puntos · Nota ${esc(fmtNota(auto.nota))}</b><span>${nota != null ? `Nota guardada: <b>${esc(fmtNota(nota))}</b> (${publicada ? 'publicada' : 'sin publicar'})` : 'Todavía sin nota guardada'}${sin ? ` · ${sin} pregunta${sin === 1 ? '' : 's'} sin responder` : ''}${auto.revisar?.length ? ` · ${auto.revisar.length} para corregir a mano` : ''}</span></div>
      ${comentario ? `<p class="au-small rv-com">${ic('message-square')} ${esc(comentario)}</p>` : ''}
      <form class="au-form rv-form" autocomplete="off" onsubmit="return false">${pq.map((q, n) => preguntaHTML(q, resp?.[q.id], { n: n + 1, barajarOps: !!examen?.barajar, s: V.semilla })).join('')}</form>
    </div></div>`;
  document.body.appendChild(m);
  const form = m.querySelector('.rv-form');
  marcarCorreccion([...form.querySelectorAll('fieldset[data-q]')], pq, K || {}, auto.detalle || {}, true, resp || {});
  // las respuestas no se pueden tocar, pero las imágenes se siguen pudiendo ampliar
  form.querySelectorAll('fieldset[data-q]').forEach((fs) => { fs.disabled = false; });
  form.querySelectorAll('input, select, textarea, button:not([data-zoom])').forEach((e) => { e.disabled = true; });
  form.querySelectorAll('[contenteditable]').forEach((e) => e.setAttribute('contenteditable', 'false'));
  form.querySelectorAll('[draggable="true"]').forEach((e) => e.setAttribute('draggable', 'false'));
  form.querySelectorAll('.ex-ab-barra').forEach((e) => e.remove());
  // Ajustes del profesor (fuera de los campos deshabilitados): mismos controles que en el cuaderno
  if (ajustar) form.querySelectorAll('fieldset[data-q]').forEach((fs) => {
    const q = pq.find((x) => x.id === fs.dataset.q); if (!q || q.tipo === 'abierta') return;
    const p = auto.detalle?.[q.id] ?? 0;
    const wrap = document.createElement('div');
    wrap.innerHTML = barraAjusteHTML({ q, p, det: ajustes, otros: mismos[q.id] || 0, prefijo: 'rv', conPuntos: true });
    fs.after(wrap.firstElementChild);
  });
  const ctx = V.semilla != null ? { s: V.semilla } : {};
  const pintarNota = (res) => {
    const h = m.querySelector('.rv-h-nota'); if (h) h.innerHTML = textoNota(res);
    const el = m.querySelector('.rv-res'); if (!el) return;
    el.classList.toggle('ok', res.nota >= 5); el.classList.toggle('ko', res.nota < 5);
    const b = el.querySelector('b'); if (b) b.textContent = `${fmtNota(res.puntos)} / ${fmtNota(res.max)} puntos · Nota ${fmtNota(res.nota)}`;
  };
  const previsualizar = () => {
    const manual = { ...(auto.detalle || {}) };
    m.querySelectorAll('.aj-bar .ap-qpts').forEach((i) => {
      const v = String(i.value ?? '').replace(',', '.');
      if (v !== '' && !Number.isNaN(+v)) manual[i.dataset.qid] = +v;
    });
    pintarNota(corregirExamen(pq, K || {}, resp || {}, manual, ctx));
  };
  const cerrar = () => { m.remove(); document.removeEventListener('keydown', tecla, true); window.removeEventListener('hashchange', cerrar); };
  const tecla = (e) => { if (e.key === 'Escape' && !document.querySelector('.ex-visor, dialog[open], .dlg-portal')) cerrar(); };
  document.addEventListener('keydown', tecla, true); window.addEventListener('hashchange', cerrar);
  m.addEventListener('input', (e) => { if (ajustar && e.target.closest?.('.ap-qpts')) previsualizar(); });
  // PIP-6: los puntos escritos se aplican solos al salir de la casilla (antes había que pulsar «Aplicar puntos» y, si no, la nota no
  // cambiaba en el cuaderno aunque la cabecera ya mostrara la nueva). «Deshacer» sigue disponible.
  m.addEventListener('change', (e) => {
    const i = ajustar && e.target.closest?.('.aj-bar .ap-qpts'); if (!i) return;
    const v = String(i.value ?? '').replace(',', '.'); if (v === '' || Number.isNaN(+v) || +v === Number(i.defaultValue)) return;
    const b = i.closest('.aj-bar')?.querySelector(`[data-rv=puntos][data-qid="${CSS.escape(i.dataset.qid)}"]`); if (!b || b.disabled) return;
    setTimeout(() => { const a = document.activeElement; foco = a?.classList?.contains('ap-qpts') ? a.dataset.qid : null; b.click(); }, 0);
  });
  let foco = null; // casilla de puntos que el profesor estaba tocando al aplicar solos los puntos escritos
  m.addEventListener('click', (e) => {
    if (e.target === m || e.target.closest('[data-rv=cerrar]')) return cerrar();
    const acc = e.target.closest('[data-rv=valida], [data-rv=deshacer], [data-rv=puntos], [data-rv=todos]');
    if (acc && ajustar) {
      const q = pq.find((x) => x.id === acc.dataset.qid);
      const max = Number(q?.puntos) > 0 ? Number(q.puntos) : 1;
      let pts = max;
      if (acc.dataset.rv === 'deshacer') pts = null;
      if (acc.dataset.rv === 'puntos') {
        const i = m.querySelector(`.aj-bar .ap-qpts[data-qid="${CSS.escape(acc.dataset.qid)}"]`);
        const v = String(i?.value ?? '').replace(',', '.');
        if (v === '' || Number.isNaN(+v)) return;
        pts = +v;
      }
      acc.disabled = true;
      const y = m.querySelector('.rv-body')?.scrollTop || 0;
      Promise.resolve(ajustar(acc.dataset.qid, pts, acc.dataset.rv === 'todos')).then(() => { const b = document.querySelector('.rv-modal .rv-body'); if (b) b.scrollTop = y; if (foco) document.querySelector(`.rv-modal .ap-qpts[data-qid="${CSS.escape(foco)}"]`)?.focus(); foco = null; });
      return;
    }
    const z = e.target.closest('[data-zoom]'); if (z) { e.preventDefault(); abrirVisor(z.dataset.zoom, z.dataset.alt || ''); }
  });
  m.querySelector('[data-rv=cerrar]').focus();
  return { cerrar };
}

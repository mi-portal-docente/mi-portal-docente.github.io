// Barra de ajuste del profesor en la corrección de un examen.
// Misma markup en el detalle del cuaderno y en el examen completo; el cálculo vive en lms/ajustes.js.
import { esc } from './util.js';
import { ic } from './ico.js';
import { fmtNota } from '../lms/modelo.js';
import { ajusteDe } from '../lms/ajustes.js';

const maxDe = (q) => (Number(q?.puntos) > 0 ? Number(q.puntos) : 1);

// prefijo 'ap': data-ap=ajValida (detalle del cuaderno). 'rv': data-rv=valida (examen completo).
// conPuntos: el recuadro de puntos va en la barra (en el detalle ya está en la pregunta).
export function barraAjusteHTML({ q, p, det, otros = 0, prefijo = 'ap', conPuntos = false }) {
  const aj = ajusteDe(det, q.id); const max = maxDe(q); const q1 = esc(q.id);
  const acc = prefijo === 'ap'
    ? { valida: 'ajValida', puntos: 'ajPuntos', deshacer: 'ajDeshacer', todos: 'ajTodos' }
    : { valida: 'valida', puntos: 'puntos', deshacer: 'deshacer', todos: 'todos' };
  const attr = (a) => `${prefijo === 'ap' ? 'data-ap' : 'data-rv'}="${a}" data-qid="${q1}"`;
  const pts = conPuntos
    ? `<label class="pn-small aj-pts">Puntos <input type="number" class="ap-qpts" data-qid="${q1}" min="0" max="${esc(max)}" step="${esc(q.paso || 0.25)}" value="${esc(p)}" aria-label="Puntos de esta pregunta"> / ${esc(fmtNota(max))}</label>`
    : '';
  return `<div class="aj-bar" role="group" aria-label="Ajuste del profesor">${aj ? `<span class="aj-badge" title="Automática: ${esc(fmtNota(aj.a))} pt">${ic('user-check')} Ajustada por el profesor · antes ${esc(fmtNota(aj.a))} pt</span>` : ''}${pts}
      ${p < max ? `<button type="button" class="btn small aj-ok" ${attr(acc.valida)}>${ic('check')} Dar por válida</button>` : ''}
      <button type="button" class="btn small" ${attr(acc.puntos)} title="Guarda los puntos escritos en esta pregunta">${ic('pencil')} Aplicar puntos</button>
      ${aj ? `<button type="button" class="btn small" ${attr(acc.deshacer)}>${ic('undo-2')} Deshacer</button>` : ''}
      ${p < max && otros > 0 ? `<button type="button" class="btn small" ${attr(acc.todos)} title="La misma respuesta, en este grupo">${ic('users')} Válida para todos los que respondieron igual (${otros + 1})</button>` : ''}</div>`;
}

// Rúbrica como tabla (como en Classroom): el profesor la crea fila a fila (criterio, puntos y lo que
// significa cada nivel) y el alumno la ve como una cuadrícula con su nivel marcado en cada criterio.
// Modelo (sin cambios): [{ c, p, niveles?: [insuficiente, suficiente, bien, excelente], clase? }].
// Puntos de cada nivel: p · nivel / 4 (puntosNivel).
import { esc } from './util.js';
import { ic } from './ico.js';
import { NIVELES, puntosNivel, nivelDePuntos, fmtNota, redondea, leeRubrica, rubricaTexto } from '../lms/modelo.js';
import { RUBRICA_PLANTILLA } from '../lms/rubrica.js';

// De mejor a peor, como en Classroom
export const NIVELES_TABLA = [...NIVELES].reverse();
const MAX = 20;

// ---------------------------------------------------------------- editor (profesor)
function filaEditor(r, i, n) {
  const clase = !!r.clase;
  return `<tr class="rb-fila${clase ? ' clase' : ''}" data-rb-i="${i}">
    <td class="rb-crit"><textarea data-rb="c" rows="2" maxlength="200" placeholder="Criterio (p. ej. Contenido correcto y completo)" aria-label="Criterio ${i + 1}">${esc(r.c || '')}</textarea>
      <label class="rb-clase"><input type="checkbox" data-rb="clase" ${clase ? 'checked' : ''}> Lo evalúo en clase (no puntúa aquí)</label></td>
    <td class="rb-pts"><input data-rb="p" type="number" min="0.25" max="100" step="0.25" value="${esc(clase ? '' : r.p ?? 1)}" ${clase ? 'disabled' : ''} aria-label="Puntos del criterio ${i + 1}"></td>
    ${NIVELES_TABLA.map(([k, t]) => `<td class="rb-niv"><span class="rb-np">${clase ? '' : esc(fmtNota(puntosNivel(r.p ?? 1, k))) + ' p'}</span><textarea data-rb="n${k}" rows="2" maxlength="200" placeholder="Qué tiene que hacer" ${clase ? 'disabled' : ''} aria-label="${esc(t)} · criterio ${i + 1}">${esc(r.niveles?.[k - 1] || '')}</textarea></td>`).join('')}
    <td class="rb-acc"><button type="button" class="btn tiny" data-ed="rbUp" data-i="${i}" ${i === 0 ? 'disabled' : ''} aria-label="Subir">↑</button><button type="button" class="btn tiny" data-ed="rbDown" data-i="${i}" ${i === n - 1 ? 'disabled' : ''} aria-label="Bajar">↓</button><button type="button" class="btn tiny" data-ed="rbDel" data-i="${i}" aria-label="Quitar el criterio">✕</button></td></tr>`;
}
export function totalRubrica(R) { return redondea((R || []).filter((r) => !r.clase).reduce((a, r) => a + (Number(r.p) || 0), 0)); }
export function editorRubricaInner(R) {
  R = R || [];
  return `<div class="rb-scroll"><table class="rb-t"><thead><tr><th>Criterio</th><th class="c">Puntos</th>${NIVELES_TABLA.map(([, t]) => `<th>${esc(t)}</th>`).join('')}<th></th></tr></thead>
    <tbody>${R.length ? R.map((r, i) => filaEditor(r, i, R.length)).join('') : `<tr><td colspan="7" class="pn-small rb-vacia">Sin rúbrica: el elemento se califica con la nota directamente. Añade criterios o usa la plantilla.</td></tr>`}</tbody></table></div>
    <div class="pn-acts rb-pie"><button type="button" class="btn small" data-ed="rbAdd" ${R.length >= MAX ? 'disabled' : ''}>${ic('plus')} Añadir criterio</button>
      <button type="button" class="btn small" data-ed="plantillaRubrica">${ic('list-checks')} Plantilla: 5 criterios (con autoría)</button>
      <span class="pn-grow"></span><span class="pn-small" data-rb-total>Total: <b>${esc(fmtNota(totalRubrica(R)))}</b> puntos${R.length ? ` · ${R.filter((r) => !r.clase).length} criterios` : ''}</span></div>
    <details class="rb-txt"><summary class="pn-small">Pegar la rúbrica como texto</summary>
      <p class="pn-small">Una línea por criterio: «Criterio | puntos | insuficiente; suficiente; bien; excelente» (los niveles son opcionales) o «Criterio | clase».</p>
      <textarea data-rb-texto rows="4" maxlength="8000">${esc(rubricaTexto(R))}</textarea>
      <div class="pn-acts"><button type="button" class="btn small" data-ed="rbTexto">${ic('table')} Pasar el texto a la tabla</button></div></details>`;
}
export const editorRubricaHTML = (R) => `<div class="pn-f rb-ed" data-rb-ed><span class="rb-tit">Rúbrica (opcional)</span>${editorRubricaInner(R)}</div>`;

/** Lee la tabla del editor (las filas sin criterio se ignoran). */
export function leerEditorRubrica(root) {
  const ed = root.querySelector('[data-rb-ed]'); if (!ed) return null;
  return [...ed.querySelectorAll('.rb-fila')].map((tr) => {
    const v = (k) => tr.querySelector(`[data-rb="${k}"]`);
    const c = String(v('c')?.value || '').trim().slice(0, 200);
    if (v('clase')?.checked) return { c, p: 0, clase: true };
    const p = Number(String(v('p')?.value || '').replace(',', '.'));
    const niveles = [1, 2, 3, 4].map((k) => String(v('n' + k)?.value || '').trim().slice(0, 200));
    return { c, p: Number.isFinite(p) && p > 0 ? redondea(Math.min(100, p)) : 1, ...(niveles.some(Boolean) ? { niveles } : {}) };
  });
}
const pintar = (ed, R) => { ed.innerHTML = `<span class="rb-tit">Rúbrica (opcional)</span>${editorRubricaInner(R)}`; };

/** Botones del editor (data-ed=rb…). Devuelve true si la acción era de la rúbrica. */
export async function accionRubrica(b, confirmar) {
  const ed = b.closest('[data-rb-ed]'); if (!ed) return false;
  const acc = b.dataset.ed; const i = +b.dataset.i;
  let R = leerEditorRubrica(ed.parentElement);
  if (acc === 'rbAdd') { if (R.length < MAX) R.push({ c: '', p: 2 }); pintar(ed, R); ed.querySelector(`.rb-fila[data-rb-i="${R.length - 1}"] [data-rb=c]`)?.focus(); return true; }
  if (acc === 'rbDel') { if (!R[i]?.c || await confirmar(`¿Quitar el criterio «${R[i].c}»?`)) { R.splice(i, 1); pintar(ed, R); } return true; }
  if (acc === 'rbUp' && i > 0) { [R[i - 1], R[i]] = [R[i], R[i - 1]]; pintar(ed, R); return true; }
  if (acc === 'rbDown' && i < R.length - 1) { [R[i + 1], R[i]] = [R[i], R[i + 1]]; pintar(ed, R); return true; }
  if (acc === 'rbTexto') { const t = ed.querySelector('[data-rb-texto]')?.value || ''; const N = leeRubrica(t); if (!R.some((r) => r.c) || await confirmar('¿Cambiar la tabla por la rúbrica del texto?')) pintar(ed, N); return true; }
  if (acc === 'plantillaRubrica') { if (!R.some((r) => r.c) || await confirmar('¿Cambiar la rúbrica por la plantilla de 5 criterios?')) pintar(ed, RUBRICA_PLANTILLA.map((r) => ({ c: r.c, p: redondea(r.peso / 10) }))); return true; }
  return acc.startsWith('rb');
}
/** Cambios en la tabla: puntos de cada nivel y total al momento; «en clase» desactiva los puntos. */
export function cambioRubrica(t) {
  const ed = t.closest?.('[data-rb-ed]'); if (!ed) return false;
  if (t.dataset.rb === 'clase') { pintar(ed, leerEditorRubrica(ed.parentElement)); return true; }
  const R = leerEditorRubrica(ed.parentElement);
  const tr = t.closest('.rb-fila'); if (tr) { const r = R[+tr.dataset.rbI]; if (r && !r.clase) tr.querySelectorAll('.rb-np').forEach((s, j) => { s.textContent = fmtNota(puntosNivel(r.p, NIVELES_TABLA[j][0])) + ' p'; }); }
  const tot = ed.querySelector('[data-rb-total]'); if (tot) tot.innerHTML = `Total: <b>${esc(fmtNota(totalRubrica(R)))}</b> puntos · ${R.filter((r) => !r.clase).length} criterios`;
  return true;
}

// ---------------------------------------------------------------- vista del alumno
/** Nivel guardado de un criterio (o el que corresponde a sus puntos). */
export const nivelGuardado = (r, det, i) => det?.['n' + i] ?? nivelDePuntos(r.p, det?.['r' + i]);

export function rubricaAlumnoHTML(it, n) {
  const R = it.rubrica || []; if (!R.length) return '';
  const det = n?.detalle || {}; const calif = !!n;
  return `<section class="rb-al"><h4>${ic('list-checks')} Rúbrica${calif ? ': así se ha calificado tu trabajo' : ': así se va a calificar'}</h4>
    <div class="rb-scroll"><table class="rb-t rb-ver"><thead><tr><th>Criterio</th>${NIVELES_TABLA.map(([, t]) => `<th>${esc(t)}</th>`).join('')}${calif ? '<th class="c">Tu nota</th>' : '<th class="c">Máx.</th>'}</tr></thead><tbody>
    ${R.map((r, i) => {
      if (r.clase) return `<tr class="clase"><th scope="row">${esc(r.c)}</th><td colspan="5" class="pn-small">Lo evalúa el profesor en clase</td></tr>`;
      const nv = calif ? nivelGuardado(r, det, i) : null; const pts = det['r' + i];
      return `<tr><th scope="row">${esc(r.c)}</th>${NIVELES_TABLA.map(([k, t]) => `<td class="rb-c${nv === k ? ' on' : ''}"${nv === k ? ' aria-current="true"' : ''}><span class="rb-np">${nv === k ? '✔ ' : ''}${esc(fmtNota(puntosNivel(r.p, k)))} p</span>${r.niveles?.[k - 1] ? `<span class="rb-d">${esc(r.niveles[k - 1])}</span>` : ''}${nv === k ? `<span class="sr-only">Tu nivel: ${esc(t)}</span>` : ''}</td>`).join('')}
        <td class="c rb-tot">${calif ? `<b>${pts != null && pts !== '' ? esc(fmtNota(pts)) : '—'}</b><span class="pn-small"> / ${esc(fmtNota(r.p))}</span>` : esc(fmtNota(r.p))}</td></tr>`;
    }).join('')}</tbody></table></div></section>`;
}

/** Tarjeta de la nota para el alumno (nota grande, puntos y comentario). */
export function notaAlumnoHTML(n, icono = '💬') {
  if (!n || n.nota == null) return '';
  const ap = n.nota >= 5;
  return `<div class="au-nota rb-nota ${ap ? 'ok' : 'ko'}"><div class="rb-nota-n"><span class="rb-nota-big">${esc(fmtNota(n.nota))}</span><span class="rb-nota-de">/ 10</span></div>
    <div class="rb-nota-tx"><b>${ap ? 'Aprobado' : 'Sin aprobar todavía'}</b>${n.max && n.puntos != null ? `<span class="pn-small">${esc(fmtNota(n.puntos))} de ${esc(fmtNota(n.max))} puntos de la rúbrica</span>` : ''}
    ${n.detalle && Object.keys(n.detalle).some((k) => k.startsWith('aj:') && k !== 'aj:_') ? `<span class="aj-badge">Ajustada por el profesor</span>` : ''}
    ${n.comentario ? `<div class="au-nota-c">${icono} ${esc(n.comentario)}</div>` : ''}</div></div>`;
}

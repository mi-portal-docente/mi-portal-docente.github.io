// «Encuentra la avería» en Trabajo de clase: la página del elemento muestra el enunciado y abre el circuito
// en el laboratorio de Circuitos (#eee/circuitos/averia-<id>), donde el alumno mide y entrega su diagnóstico.
import { motor } from '../lms/elemento.js';
import { TIPOS_AVERIA, evaluarAveria } from '../lms/motores/averia.js';
import { ic } from '../ui/iconos.js';
import { esc } from './comun.js';

const sinAciertos = (t) => String(t || '').replace(/\s*Aciertos:.*$/s, '').replace(/^Diagnóstico:\s*/, '');
export function textoDiagnostico(c, resp) {
  const r = evaluarAveria(c.averia || {}, resp);
  return `Diagnóstico: ${resp.elemento} · ${TIPOS_AVERIA[resp.tipo] || resp.tipo}. Aciertos: ${r.a}/${r.t}`;
}
// e: resultado de P.aula.elemento(id) o { ejemplo: true }
export function defAveria(e, entregar) {
  if (e.ejemplo) { const c = motor('averia').ejemplo; return { id: 'ejemplo', titulo: 'Ejemplo', ...c, calificable: false }; }
  const it = e.it, c = it.contenido || {}; const alumno = e.rol === 'alumno';
  return { id: it.id, titulo: it.titulo, enunciado: c.enunciado, montaje: c.montaje, averia: c.averia, pistas: c.pistas || [], explicacion: c.explicacion,
    calificable: alumno, entregada: alumno && e.trabajo ? sinAciertos(e.trabajo.texto) : null,
    entregar: alumno ? (resp) => { const t = textoDiagnostico(c, resp); return entregar(it.id, t).then(() => sinAciertos(t)); } : null };
}
export function montarAveria(nodo, it, cx) {
  const c = it.contenido || {}; const prof = cx.rol !== 'alumno'; let entregado = cx.entregadoTexto, nota = cx.nota;
  const pintar = () => {
    nodo.innerHTML = `<div class="avi">
      ${c.enunciado ? `<p class="avi-enun">${esc(c.enunciado)}</p>` : ''}
      <p class="avi-small">Abre el circuito, inicia la simulación y mide con el polímetro (V, A, Ω y continuidad). Cuando sepas qué está averiado, haz clic en él, elige qué le pasa y ${prof ? 'comprueba el diagnóstico' : 'entrega tu diagnóstico'}.</p>
      <a class="btn primary avi-abrir" href="#eee/circuitos/averia-${esc(it.id)}">${ic('search-check')} Abrir el circuito</a>
      ${!prof && entregado ? `<p class="avi-ok" role="status">${ic('circle-check')} Entregado: ${esc(sinAciertos(entregado))}${nota != null ? ` · Nota: <b>${esc(nota)}</b>` : ''}</p>` : ''}
      ${prof ? `<p class="avi-sol">${ic('eye')} Solución (solo la ves tú): <b>${esc(c.averia?.elemento || '')}</b> · ${esc(TIPOS_AVERIA[c.averia?.tipo] || '')}${c.averia?.tipo === 'valor' ? ` (${esc(c.averia.valor)} Ω)` : ''}</p>` : ''}
    </div>`;
  };
  pintar();
  return { actualizar(o) { entregado = o.entregadoTexto; nota = o.nota; pintar(); }, destruir() { nodo.innerHTML = ''; } };
}

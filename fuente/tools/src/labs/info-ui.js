// Representación de la información: conversor (decimal, binario, hexadecimal, ASCII) y preguntas de
// conversión y de tamaño de archivo que se corrigen solas.
import { ic } from '../ui/iconos.js';
import { convertir, SISTEMAS, enunciadoInfo, solucionInfo, correctaInfo, aNumero } from '../lms/motores/info.js';
import { esc, leerJSON, guardar, cajaEntrega } from './comun.js';

function conversorHTML() {
  return `<section class="if-conv" aria-label="Conversor"><h2>${ic('binary')} Conversor</h2>
    <div class="if-fila"><label>Valor<input data-i="valor" value="65" autocomplete="off" spellcheck="false"></label>
    <label>Está en<select data-i="de">${Object.entries(SISTEMAS).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}</select></label></div>
    <dl class="if-res" data-i="res" aria-live="polite"></dl><div class="if-bits" data-i="bits" aria-hidden="true"></div></section>`;
}
export function montarInfo(nodo, contenido, ctx = {}) {
  const P = contenido?.preguntas || []; const clave = ctx.clave || 'infolab';
  const est = { resp: leerJSON(clave + ':resp', {}), hecho: leerJSON(clave + ':ok', {}) };
  nodo.classList.add('ifl');
  nodo.innerHTML = `${conversorHTML()}${P.length ? `<section class="if-preg" aria-label="Preguntas"><h2>${ic('list-checks')} Preguntas</h2>${ctx.entregar ? `<p class="muted">${ic('info')} Es una tarea: cada pregunta se comprueba una sola vez.</p>` : ''}<ol class="if-lista">${P.map((p, i) => `<li data-ip="${i}"><p>${esc(enunciadoInfo(p))}</p>
      <div class="if-fila"><label class="sr">Tu respuesta a la pregunta ${i + 1}<input data-ir="${i}" value="${esc(est.resp[i] || '')}" autocomplete="off" spellcheck="false" inputmode="${p.tipo === 'tamano' || p.a === 'dec' ? 'decimal' : 'text'}" placeholder="${p.tipo === 'tamano' ? `en ${esc(p.unidad)}` : esc(SISTEMAS[p.a])}"></label><button type="button" class="btn sec" data-ic="${i}">${ic('check')} Comprobar</button></div><div class="if-fb" data-if="${i}" aria-live="polite"></div></li>`).join('')}</ol></section><div data-i="ent"></div>` : ''}`;
  const $ = (s) => nodo.querySelector(s);
  function conv() {
    const v = $('[data-i=valor]').value; const de = $('[data-i=de]').value; const out = Object.keys(SISTEMAS).filter((k) => k !== de).map((a) => [a, convertir(v, de, a)]);
    $('[data-i=res]').innerHTML = out.map(([a, r]) => `<div><dt>${esc(SISTEMAS[a])}</dt><dd>${r == null ? '<span class="muted">—</span>' : esc(r)}</dd></div>`).join('');
    const n = de === 'ascii' ? (v.length === 1 ? v.charCodeAt(0) : null) : aNumero(v, de);
    $('[data-i=bits]').innerHTML = n != null && n < 256 ? n.toString(2).padStart(8, '0').split('').map((b, i) => `<span class="${b === '1' ? 'on' : ''}"><b>${b}</b><small>${2 ** (7 - i)}</small></span>`).join('') : '';
  }
  const aciertos = () => P.filter((_, i) => est.hecho[i]).length;
  const ent = P.length ? cajaEntrega($('[data-i=ent]'), ctx, () => ({ a: aciertos(), t: P.length, texto: `${ctx.titulo || 'Representación de la información'}. Aciertos: ${aciertos()}/${P.length}\n\n${P.map((p, i) => `${i + 1}. ${enunciadoInfo(p)}\n   Respuesta: ${est.resp[i] || '—'} (${est.hecho[i] ? 'bien' : 'mal'})`).join('\n')}` })) : null;
  function comprobar(i) {
    if (ctx.entregar && est.hecho[i] !== undefined) return;
    const p = P[i]; const r = $(`[data-ir="${i}"]`).value.trim(); if (!r) return; est.resp[i] = r; const ok = correctaInfo(p, r); est.hecho[i] = ok;
    guardar(clave + ':resp', JSON.stringify(est.resp)); guardar(clave + ':ok', JSON.stringify(est.hecho));
    $(`[data-if="${i}"]`).innerHTML = ok ? `<span class="ok">${ic('circle-check')} ¡Correcto!</span> ${esc(p.explicacion || '')}` : `<span class="mal">${ic('circle-x')} No es correcto.</span> ${ctx.entregar ? 'Revisa el cálculo y vuelve a intentarlo.' : `Solución: <b>${esc(solucionInfo(p))}</b>. ${esc(p.explicacion || '')}`}`;
    if (ctx.entregar) { $(`[data-ir="${i}"]`).disabled = true; $(`[data-ic="${i}"]`).disabled = true; }
    ent?.pintar();
  }
  nodo.addEventListener('input', (e) => { if (e.target.matches('[data-i=valor]')) conv(); });
  nodo.addEventListener('change', (e) => { if (e.target.matches('[data-i=de]')) conv(); });
  nodo.addEventListener('click', (e) => { const b = e.target.closest('[data-ic]'); if (b) comprobar(Number(b.dataset.ic)); });
  nodo.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.matches('[data-ir]')) comprobar(Number(e.target.dataset.ir)); });
  if (ctx.entregar) P.forEach((_, i) => { if (est.hecho[i] !== undefined) { $(`[data-ir="${i}"]`).disabled = true; $(`[data-ic="${i}"]`).disabled = true; $(`[data-if="${i}"]`).innerHTML = est.hecho[i] ? `<span class="ok">${ic('circle-check')} Correcto</span>` : `<span class="mal">${ic('circle-x')} Incorrecto</span>`; } });
  conv();
  return { destruir() {}, actualizar: (o) => ent?.actualizar(o) };
}

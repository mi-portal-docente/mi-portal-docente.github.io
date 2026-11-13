// Cómo se ve y se responde cada tipo de pregunta en el examen del alumno (y en la vista previa del
// profesor). Test, V/F y respuesta corta mantienen el marcado de siempre.
import { esc } from './util.js';
import { ic } from './ico.js';
import { barajar, semilla, fmtNota } from '../lms/modelo.js';
import { textoHTML } from './aula-vistas.js';
import { TIPOS_PREGUNTA, leeNumero, alternativas } from '../lms/preguntas.js';

export const ayudaTipo = {
  emparejar: 'Elige, para cada elemento de la izquierda, el que le corresponde. Cuenta cada pareja bien hecha.',
  ordenar: 'Ordena los elementos con los botones de subir y bajar. Cuenta cada posición correcta.',
  huecos: 'Escribe la palabra que falta en cada hueco. Cuenta cada hueco bien escrito.',
  numerica: 'Escribe un número (puedes usar coma decimal).',
  zonas: 'Pulsa en la imagen el punto que se pide. Puedes cambiarlo pulsando en otro sitio.',
};
// Orden inicial de «ordenar» para un alumno (barajado y distinto del guardado)
export function ordenInicial(q, s) { return barajar((q.elementos || []).map((_, i) => i), s ^ semilla('ord' + q.id)); }

export function preguntaHTML(q, r, { n, barajarOps = false, s = 1 } = {}) {
  const nm = 'q_' + q.id;
  const leyenda = `<legend><span class="au-qn">${n}</span> ${textoHTML(q.enunciado)}<span class="au-small"> (${esc(fmtNota(q.puntos || 1))} pt)</span></legend>`;
  let cuerpo = '';
  if (q.tipo === 'test') {
    const idx = (q.opciones || []).map((_, i) => i); const orden = barajarOps ? barajar(idx, s ^ semilla(q.id)) : idx;
    cuerpo = orden.map((i) => `<label class="au-op"><input type="radio" name="${esc(nm)}" value="${i}" ${r === i ? 'checked' : ''}> ${esc(q.opciones[i])}</label>`).join('');
  } else if (q.tipo === 'vf') cuerpo = `<label class="au-op"><input type="radio" name="${esc(nm)}" value="true" ${r === true ? 'checked' : ''}> Verdadero</label><label class="au-op"><input type="radio" name="${esc(nm)}" value="false" ${r === false ? 'checked' : ''}> Falso</label>`;
  else if (q.tipo === 'corta') cuerpo = `<input type="text" class="au-corta" name="${esc(nm)}" maxlength="500" value="${esc(r || '')}" placeholder="Tu respuesta" aria-label="Tu respuesta">`;
  else if (q.tipo === 'emparejar') {
    const R = Array.isArray(r) ? r : [];
    cuerpo = `<div class="ex-emp">${(q.izquierda || []).map((iz, i) => `<label class="ex-emp-f"><span class="ex-emp-iz">${esc(iz)}</span><select data-emp="${i}" name="${esc(nm)}_${i}"><option value="">— elige —</option>${(q.derecha || []).map((d, j) => `<option value="${j}" ${R[i] === j ? 'selected' : ''}>${esc(d)}</option>`).join('')}</select></label>`).join('')}</div>`;
  } else if (q.tipo === 'ordenar') {
    const R = Array.isArray(r) && r.length === (q.elementos || []).length ? r : ordenInicial(q, s);
    cuerpo = `<ol class="ex-ord" data-orden="${esc(JSON.stringify(R))}">${R.map((i, p) => `<li data-i="${i}"><span class="ex-ord-t">${esc(q.elementos[i])}</span><span class="ex-ord-b"><button type="button" class="btn tiny" data-ord="-1" ${p ? '' : 'disabled'} aria-label="Subir «${esc(q.elementos[i])}»">${ic('arrow-up')}</button><button type="button" class="btn tiny" data-ord="1" ${p < R.length - 1 ? '' : 'disabled'} aria-label="Bajar «${esc(q.elementos[i])}»">${ic('arrow-down')}</button></span></li>`).join('')}</ol>`;
  } else if (q.tipo === 'huecos') {
    const R = Array.isArray(r) ? r : [];
    const partes = esc(q.texto || '').replace(/\[\[(\d+)\]\]/g, (_, k) => `<input type="text" class="ex-hueco" data-hueco="${k - 1}" maxlength="120" value="${esc(R[k - 1] || '')}" aria-label="Hueco ${k}" size="10">`);
    cuerpo = `<p class="ex-huecos">${partes.replace(/\n/g, '<br>')}</p>`;
  } else if (q.tipo === 'numerica') cuerpo = `<label class="ex-num"><input type="text" inputmode="decimal" name="${esc(nm)}" maxlength="40" value="${esc(r ?? '')}" placeholder="Número" aria-label="Respuesta numérica">${q.unidad ? `<span>${esc(q.unidad)}</span>` : ''}</label>`;
  else if (q.tipo === 'zonas') {
    const p = r && typeof r === 'object' ? r : null;
    cuerpo = `<div class="ex-zonas" data-zonas tabindex="0" role="button" aria-label="Imagen: pulsa el punto que se pide. Con el teclado: flechas para mover la marca"><img src="${esc(q.imagen)}" alt="${esc(q.alt || 'Imagen de la pregunta')}" draggable="false">${p ? `<span class="ex-marca" style="left:${p.x}%;top:${p.y}%"></span>` : ''}</div>`;
  }
  const ayuda = ayudaTipo[q.tipo] ? `<p class="au-small ex-ayuda">${esc(ayudaTipo[q.tipo])}</p>` : '';
  return `<fieldset class="au-q" data-q="${esc(q.id)}" data-tipo="${esc(q.tipo)}">${leyenda}${ayuda}${cuerpo}</fieldset>`;
}

// Lee la respuesta de una pregunta del formulario. undefined = sin responder.
export function leerRespuesta(q, fs) {
  const nm = 'q_' + q.id;
  if (q.tipo === 'corta') { const v = fs.querySelector(`[name="${CSS.escape(nm)}"]`)?.value || ''; return v.trim() ? v.slice(0, 500) : undefined; }
  if (q.tipo === 'test' || q.tipo === 'vf') { const c = fs.querySelector(`input[name="${CSS.escape(nm)}"]:checked`); if (!c) return null; return q.tipo === 'vf' ? c.value === 'true' : Number(c.value); }
  if (q.tipo === 'emparejar') { const L = [...fs.querySelectorAll('[data-emp]')].map((s) => (s.value === '' ? null : Number(s.value))); return L.some((x) => x != null) ? L : undefined; }
  if (q.tipo === 'ordenar') { try { return JSON.parse(fs.querySelector('.ex-ord')?.dataset.orden || 'null') || undefined; } catch (e) { return undefined; } }
  if (q.tipo === 'huecos') { const L = [...fs.querySelectorAll('[data-hueco]')].map((i) => i.value.slice(0, 120)); return L.some((x) => x.trim()) ? L : undefined; }
  if (q.tipo === 'numerica') { const v = fs.querySelector(`[name="${CSS.escape(nm)}"]`)?.value || ''; return v.trim() ? v.trim().slice(0, 40) : undefined; }
  if (q.tipo === 'zonas') { const m = fs.querySelector('.ex-marca'); return m ? { x: parseFloat(m.style.left), y: parseFloat(m.style.top) } : undefined; }
  return undefined;
}

// Interacción: botones de ordenar y clic en la imagen. alCambiar() se llama tras cada cambio.
export function enlazarPreguntas(raiz, alCambiar) {
  if (raiz.dataset.exOk) return; raiz.dataset.exOk = '1';
  raiz.addEventListener('click', (e) => {
    const b = e.target.closest('[data-ord]');
    if (b) {
      const ol = b.closest('.ex-ord'); const li = b.closest('li'); const L = JSON.parse(ol.dataset.orden); const p = [...ol.children].indexOf(li); const d = Number(b.dataset.ord);
      if (p + d < 0 || p + d >= L.length) return; [L[p], L[p + d]] = [L[p + d], L[p]];
      const fs = b.closest('fieldset'); const q = { id: fs.dataset.q };
      ol.dataset.orden = JSON.stringify(L);
      const items = [...ol.children]; if (d < 0) ol.insertBefore(items[p], items[p - 1]); else ol.insertBefore(items[p + 1], items[p]);
      [...ol.children].forEach((x, i) => { x.querySelector('[data-ord="-1"]').disabled = i === 0; x.querySelector('[data-ord="1"]').disabled = i === L.length - 1; });
      ol.children[p + d]?.querySelector(`[data-ord="${d}"]:not(:disabled)`)?.focus() || ol.children[p + d]?.querySelector('button:not(:disabled)')?.focus();
      alCambiar?.(q); return;
    }
    const z = e.target.closest('[data-zonas]');
    if (z) { const img = z.querySelector('img'); const r = img.getBoundingClientRect(); marcar(z, ((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100); alCambiar?.({ id: z.closest('fieldset').dataset.q }); }
  });
  raiz.addEventListener('keydown', (e) => {
    const z = e.target.closest?.('[data-zonas]'); if (!z || !/^Arrow/.test(e.key)) return; e.preventDefault();
    const m = z.querySelector('.ex-marca'); let x = m ? parseFloat(m.style.left) : 50, y = m ? parseFloat(m.style.top) : 50; const d = e.shiftKey ? 1 : 4;
    if (e.key === 'ArrowLeft') x -= d; if (e.key === 'ArrowRight') x += d; if (e.key === 'ArrowUp') y -= d; if (e.key === 'ArrowDown') y += d;
    marcar(z, x, y); alCambiar?.({ id: z.closest('fieldset').dataset.q });
  });
}
function marcar(z, x, y) {
  x = Math.max(0, Math.min(100, Math.round(x * 10) / 10)); y = Math.max(0, Math.min(100, Math.round(y * 10) / 10));
  let m = z.querySelector('.ex-marca'); if (!m) { m = document.createElement('span'); m.className = 'ex-marca'; z.appendChild(m); }
  m.style.left = x + '%'; m.style.top = y + '%';
}

// Texto de una respuesta y de la solución (cuaderno del profesor, vista previa)
export function respuestaTexto(q, v) {
  if (v == null) return '— sin responder';
  if (q.tipo === 'test') return (q.opciones || [])[v] ?? String(v);
  if (q.tipo === 'vf') return v ? 'Verdadero' : 'Falso';
  if (q.tipo === 'emparejar') return (q.izquierda || []).map((iz, i) => `${iz} → ${v[i] == null ? '—' : (q.derecha || [])[v[i]]}`).join(' · ');
  if (q.tipo === 'ordenar') return (Array.isArray(v) ? v : []).map((i) => (q.elementos || [])[i]).join(' → ');
  if (q.tipo === 'huecos') return (Array.isArray(v) ? v : []).map((x, i) => `${i + 1}: ${x || '—'}`).join(' · ');
  if (q.tipo === 'numerica') { const x = leeNumero(v); return (x == null ? String(v) : String(x).replace('.', ',')) + (q.unidad ? ' ' + q.unidad : ''); }
  if (q.tipo === 'zonas') return `punto (${Math.round(v.x)} %, ${Math.round(v.y)} %)`;
  return String(v);
}
export function solucionTexto(q, k) {
  if (q.tipo === 'test') return (q.opciones || [])[k];
  if (q.tipo === 'vf') return k ? 'Verdadero' : 'Falso';
  if (q.tipo === 'corta') return (k || []).join(' · ') || '(manual)';
  if (q.tipo === 'emparejar') return (q.izquierda || []).map((iz, i) => `${iz} → ${(q.derecha || [])[(k || [])[i]] ?? '?'}`).join(' · ');
  if (q.tipo === 'ordenar') return (k || []).map((i) => (q.elementos || [])[i]).join(' → ');
  if (q.tipo === 'huecos') return (k || []).map((a, i) => `${i + 1}: ${alternativas(a).join(' / ')}`).join(' · ');
  if (q.tipo === 'numerica') return k ? `${String(k.v).replace('.', ',')}${q.unidad ? ' ' + q.unidad : ''} ± ${String(k.t).replace('.', ',')}${k.m === 'pct' ? ' %' : ''}` : '';
  if (q.tipo === 'zonas') return (k || []).filter((z) => z.correcta).map((z) => z.nombre || `zona (${z.x}, ${z.y})`).join(' · ');
  return '';
}
export const nombreTipoPregunta = (t) => TIPOS_PREGUNTA[t]?.nombre || t;

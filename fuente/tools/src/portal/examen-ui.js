// Cómo se ve y se responde cada tipo de pregunta en el examen del alumno (y en la vista previa del
// profesor). Test, V/F y respuesta corta mantienen el marcado de siempre.
import { esc } from './util.js';
import { ic } from './ico.js';
import { barajar, semilla, fmtNota } from '../lms/modelo.js';
import { textoHTML } from './aula-vistas.js';
import { TIPOS_PREGUNTA, leeNumero, alternativas } from '../lms/preguntas.js';
import { limpiarDoc, textoDeDoc, contarPalabras } from '../lms/doc-html.js';

export const ayudaTipo = {
  emparejar: 'Elige, para cada elemento de la izquierda, el que le corresponde. Cuenta cada pareja bien hecha.',
  ordenar: 'Ordena los elementos con los botones de subir y bajar. Cuenta cada posición correcta.',
  huecos: 'Escribe la palabra que falta en cada hueco. Cuenta cada hueco bien escrito.',
  numerica: 'Escribe un número (puedes usar coma decimal).',
  zonas: 'Pulsa en la imagen el punto que se pide. Puedes cambiarlo pulsando en otro sitio.',
  clasificar: 'Arrastra cada elemento a su grupo (o elige el grupo en su desplegable). Cuenta cada elemento bien clasificado.',
  tabla: 'Completa las casillas vacías de la tabla. Cuenta cada casilla bien escrita.',
  abierta: 'Respuesta abierta: la corrige tu profesor (con la rúbrica, si la hay).',
};
const BOT_AB = [['bold', 'letter-b', 'Negrita'], ['italic', 'italic', 'Cursiva'], ['insertUnorderedList', 'list', 'Lista'], ['insertOrderedList', 'list-ordered', 'Lista numerada']];
const rubricaQ = (q) => (q.rubrica?.length ? `<details class="ex-rub"><summary>${ic('list-checks')} Rúbrica (${esc(fmtNota(q.puntos || 1))} pt)</summary><ul>${q.rubrica.map((r) => `<li>${esc(r.c)} · <b>${esc(fmtNota(r.p))}</b></li>`).join('')}</ul></details>` : '');
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
  else if (q.tipo === 'clasificar') {
    const R = Array.isArray(r) ? r : []; const G = q.grupos || [];
    const chip = (e, i) => `<span class="ex-cl-chip" draggable="true" data-cle="${i}"><span class="ex-cl-t">${esc(e)}</span><select data-cl="${i}" aria-label="Grupo de «${esc(e)}»"><option value="">—</option>${G.map((g, j) => `<option value="${j}" ${R[i] === j ? 'selected' : ''}>${esc(g)}</option>`).join('')}</select></span>`;
    const L = (q.elementos || []).map((e, i) => [e, i]);
    cuerpo = `<div class="ex-cl"><div class="ex-cl-pool" data-clg="" aria-label="Sin clasificar">${L.filter(([, i]) => R[i] == null).map(([e, i]) => chip(e, i)).join('')}</div><div class="ex-cl-grupos">${G.map((g, j) => `<div class="ex-cl-grupo" data-clg="${j}"><div class="ex-cl-h">${esc(g)}</div>${L.filter(([, i]) => R[i] === j).map(([e, i]) => chip(e, i)).join('')}</div>`).join('')}</div></div>`;
  } else if (q.tipo === 'tabla') {
    const R = Array.isArray(r) ? r : [];
    cuerpo = `<div class="ex-tab-w"><table class="ex-tab"><thead><tr>${(q.columnas || []).map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${(q.filas || []).map((f) => `<tr>${(f.c || []).map((x) => { const m = /^\[\[(\d+)\]\]$/.exec(x); return m ? `<td><input type="text" class="ex-hueco" data-hueco="${m[1] - 1}" maxlength="120" value="${esc(R[m[1] - 1] || '')}" aria-label="Casilla ${m[1]}"></td>` : `<td>${esc(x)}</td>`; }).join('')}</tr>`).join('')}</tbody></table></div>`;
  } else if (q.tipo === 'abierta') {
    if (q.extension === 'larga') cuerpo = `<div class="ex-ab"><div class="ex-ab-barra" role="toolbar" aria-label="Formato">${BOT_AB.map(([c, i, t]) => `<button type="button" class="dc-b" data-exab="${c}" title="${esc(t)}" aria-label="${esc(t)}">${ic(i)}</button>`).join('')}</div><div class="ex-ab-ed" contenteditable="true" role="textbox" aria-multiline="true" aria-label="Tu respuesta" lang="es" spellcheck="true">${limpiarDoc(typeof r === 'string' ? r : '')}</div><div class="au-small ex-ab-pal">${contarPalabras(typeof r === 'string' ? r : '')} palabras</div></div>`;
    else cuerpo = `<textarea class="ex-ab-c" name="${esc(nm)}" rows="3" maxlength="2000" placeholder="Tu respuesta" aria-label="Tu respuesta">${esc(typeof r === 'string' ? r : '')}</textarea>`;
    cuerpo += rubricaQ(q);
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
  if (q.tipo === 'clasificar') { const L = [...fs.querySelectorAll('[data-cl]')].sort((a, b) => a.dataset.cl - b.dataset.cl).map((s) => (s.value === '' ? null : Number(s.value))); return L.some((x) => x != null) ? L : undefined; }
  if (q.tipo === 'tabla') { const L = [...fs.querySelectorAll('[data-hueco]')].sort((a, b) => a.dataset.hueco - b.dataset.hueco).map((i) => i.value.slice(0, 120)); return L.some((x) => x.trim()) ? L : undefined; }
  if (q.tipo === 'abierta') {
    const ed = fs.querySelector('.ex-ab-ed'); if (ed) { const h = limpiarDoc(ed.innerHTML).slice(0, 20000); return textoDeDoc(h).trim() ? h : undefined; }
    const v = fs.querySelector('.ex-ab-c')?.value || ''; return v.trim() ? v.slice(0, 2000) : undefined;
  }
  if (q.tipo === 'zonas') { const m = fs.querySelector('.ex-marca'); return m ? { x: parseFloat(m.style.left), y: parseFloat(m.style.top) } : undefined; }
  return undefined;
}

// Interacción: botones de ordenar y clic en la imagen. alCambiar() se llama tras cada cambio.
export function enlazarPreguntas(raiz, alCambiar) {
  if (raiz.dataset.exOk) return; raiz.dataset.exOk = '1';
  // clasificar: arrastrar y soltar (y el desplegable de cada elemento, que sirve con teclado y en el móvil)
  const moverChip = (chip, g) => { const fs = chip.closest('fieldset'); const dest = fs.querySelector(`[data-clg="${g}"]`); if (dest) dest.appendChild(chip); chip.querySelector('select').value = g; alCambiar?.({ id: fs.dataset.q }); };
  raiz.addEventListener('dragstart', (e) => { const c = e.target.closest?.('.ex-cl-chip'); if (!c) return; e.dataTransfer.setData('text/plain', c.dataset.cle); e.dataTransfer.effectAllowed = 'move'; c.classList.add('arr'); });
  raiz.addEventListener('dragend', (e) => e.target.closest?.('.ex-cl-chip')?.classList.remove('arr'));
  raiz.addEventListener('dragover', (e) => { const z = e.target.closest?.('[data-clg]'); if (z) { e.preventDefault(); z.classList.add('sobre'); } });
  raiz.addEventListener('dragleave', (e) => e.target.closest?.('[data-clg]')?.classList.remove('sobre'));
  raiz.addEventListener('drop', (e) => {
    const z = e.target.closest?.('[data-clg]'); if (!z) return; e.preventDefault(); z.classList.remove('sobre');
    const chip = z.closest('fieldset')?.querySelector(`.ex-cl-chip[data-cle="${CSS.escape(e.dataTransfer.getData('text/plain'))}"]`); if (chip) moverChip(chip, z.dataset.clg);
  });
  raiz.addEventListener('change', (e) => { const s = e.target.closest?.('[data-cl]'); if (s) moverChip(s.closest('.ex-cl-chip'), s.value); });
  raiz.addEventListener('input', (e) => { const ed = e.target.closest?.('.ex-ab-ed'); if (ed) { const p = ed.parentElement.querySelector('.ex-ab-pal'); if (p) p.textContent = `${contarPalabras(ed.innerHTML)} palabras`; alCambiar?.({ id: ed.closest('fieldset').dataset.q }); } });
  raiz.addEventListener('mousedown', (e) => { if (e.target.closest?.('[data-exab]')) e.preventDefault(); });
  raiz.addEventListener('paste', (e) => {
    const ed = e.target.closest?.('.ex-ab-ed'); if (!ed || !e.clipboardData) return; e.preventDefault();
    const h = e.clipboardData.getData('text/html'); const t = e.clipboardData.getData('text/plain') || '';
    document.execCommand('insertHTML', false, h ? limpiarDoc(h) : esc(t).replace(/\n/g, '<br>'));
  });
  raiz.addEventListener('click', (e) => {
    const bx = e.target.closest('[data-exab]');
    if (bx) { bx.closest('.ex-ab').querySelector('.ex-ab-ed').focus(); document.execCommand(bx.dataset.exab); alCambiar?.({ id: bx.closest('fieldset').dataset.q }); return; }
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
  if (q.tipo === 'clasificar') return (q.grupos || []).map((g, j) => `${g}: ${(q.elementos || []).filter((_, i) => (Array.isArray(v) ? v : [])[i] === j).join(', ') || '—'}`).join(' · ');
  if (q.tipo === 'tabla') return (Array.isArray(v) ? v : []).map((x, i) => `${i + 1}: ${x || '—'}`).join(' · ');
  if (q.tipo === 'abierta') return q.extension === 'larga' ? textoDeDoc(limpiarDoc(String(v))) : String(v);
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
  if (q.tipo === 'clasificar') return (q.grupos || []).map((g, j) => `${g}: ${(q.elementos || []).filter((_, i) => (k || [])[i] === j).join(', ')}`).join(' · ');
  if (q.tipo === 'tabla') return (k || []).map((a, i) => `${i + 1}: ${alternativas(a).join(' / ')}`).join(' · ');
  if (q.tipo === 'abierta') return q.rubrica?.length ? 'con rúbrica: ' + q.rubrica.map((r) => `${r.c} (${fmtNota(r.p)})`).join(' · ') : '(la corriges tú)';
  if (q.tipo === 'zonas') return (k || []).filter((z) => z.correcta).map((z) => z.nombre || `zona (${z.x}, ${z.y})`).join(' · ');
  return '';
}
export const nombreTipoPregunta = (t) => TIPOS_PREGUNTA[t]?.nombre || t;

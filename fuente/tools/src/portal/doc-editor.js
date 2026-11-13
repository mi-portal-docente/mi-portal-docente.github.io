// Fase 11 · Editor de documentos del alumno (sustituye a Google Docs): títulos, negrita, cursiva, listas,
// tablas, enlaces, imágenes (3 como máximo, comprimidas en el navegador a ~300 KB) y bloques de código,
// con contador de palabras, el guardado automático de la fase 9 y exportación a PDF (imprimir) y .docx.
// Registro informativo para el profesor: tiempo editando y pegados grandes (tamaño y hora).
import { doc, getDoc, setDoc, serverTimestamp, increment, arrayUnion } from 'firebase/firestore';
import { esc } from './util.js';
import { ic } from './ico.js';
import { idTrabajo } from '../lms/modelo.js';
import { limpiarDoc, textoDeDoc, contarPalabras, imagenesDe, MAX_IMAGENES, MAX_IMG_BYTES, PEGADO_GRANDE, urlDocValida } from '../lms/doc-html.js';
import { docx } from '../lms/docx.js';

const CACHE = new Map(); // `${tid}/${img}` → { data, w, h }

/** Pone el src de las <img data-img> (las imágenes están en trabajos/{tid}/imagenes). */
export async function rellenarImagenes(raiz, db, tid) {
  if (!raiz) return;
  for (const im of raiz.querySelectorAll('img[data-img]')) {
    const k = `${tid}/${im.dataset.img}`;
    if (!CACHE.has(k)) { try { const d = await getDoc(doc(db, 'trabajos', tid, 'imagenes', im.dataset.img)); CACHE.set(k, d.exists() ? d.data() : null); } catch (e) { CACHE.set(k, null); } }
    const v = CACHE.get(k); if (v?.data) im.src = v.data; else im.alt = '(imagen no disponible)';
  }
}
export const docSeguroHTML = (html) => limpiarDoc(html || '');

/** Comprime una imagen en el navegador: lado máx. 1600 px, JPEG con calidad decreciente hasta ≤ 300 KB. */
export async function comprimirImagen(file) {
  if (!/^image\//.test(file.type)) throw new Error('No es una imagen.');
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((ok, ko) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ko(new Error('No se puede leer la imagen.')); i.src = url; });
    let lado = 1600;
    for (let intento = 0; intento < 8; intento++) {
      const k = Math.min(1, lado / Math.max(img.naturalWidth, img.naturalHeight));
      const w = Math.max(1, Math.round(img.naturalWidth * k)), h = Math.max(1, Math.round(img.naturalHeight * k));
      const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.drawImage(img, 0, 0, w, h);
      for (const q of [0.85, 0.75, 0.65, 0.55, 0.45]) { const data = c.toDataURL('image/jpeg', q); if ((data.length - 23) * 3 / 4 <= MAX_IMG_BYTES) return { data, w, h }; }
      lado = Math.round(lado * 0.75);
    }
    throw new Error('La imagen es demasiado grande incluso comprimida.');
  } finally { URL.revokeObjectURL(url); }
}

export function descargarDocx(html, { titulo, meta, imagenes, nombre }) {
  const bytes = docx(limpiarDoc(html), { titulo, meta, imagenes });
  const url = URL.createObjectURL(new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }));
  const a = document.createElement('a'); a.href = url; a.download = (nombre || titulo || 'documento').replace(/[^\p{L}\p{N} _.-]+/gu, '').trim().slice(0, 80) + '.docx';
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 3000);
}
export async function imagenesParaDocx(db, tid, html) {
  const o = {}; for (const k of imagenesDe(html)) { const c = `${tid}/${k}`; if (!CACHE.has(c)) { try { const d = await getDoc(doc(db, 'trabajos', tid, 'imagenes', k)); CACHE.set(c, d.exists() ? d.data() : null); } catch (e) { CACHE.set(c, null); } } if (CACHE.get(c)) o[k] = CACHE.get(c); }
  return o;
}

const BOTONES = [
  ['p', 'pilcrow', 'Párrafo'], ['h2', 'heading-2', 'Título'], ['h3', 'heading-3', 'Subtítulo'], ['|'],
  ['bold', 'letter-b', 'Negrita (Ctrl+B)'], ['italic', 'italic', 'Cursiva (Ctrl+I)'], ['underline', 'underline', 'Subrayado (Ctrl+U)'], ['|'],
  ['ul', 'list', 'Lista'], ['ol', 'list-ordered', 'Lista numerada'], ['tabla', 'table-2', 'Tabla'], ['enlace', 'link', 'Enlace'], ['imagen', 'image-plus', 'Imagen (máx. 3)'], ['pre', 'square-code', 'Bloque de código'], ['|'],
  ['undo', 'undo-2', 'Deshacer'], ['redo', 'redo-2', 'Rehacer'],
];

/** ctx.editor para entrega-ui. it: elemento (tipo documento); ses: sesión del alumno. */
export function crearEditorDoc(it, { db, ses }) {
  const c = it.contenido || {};
  const tid = idTrabajo(it.id, ses.grupo, ses.numero);
  const al = `${ses.grupo}_${ses.numero}`;
  const R = { seg: 0, ult: 0, pegados: [] };
  let alCambiarCb = null; let api = null;
  const ed = (f) => f.querySelector('.dc-ed');
  function contador(f) {
    const n = contarPalabras(ed(f)?.innerHTML || ''); const el = f.querySelector('.dc-pal'); if (!el) return;
    const fuera = (c.palabrasMin && n < c.palabrasMin) || (c.palabrasMax && n > c.palabrasMax);
    el.innerHTML = `${n} palabra${n === 1 ? '' : 's'}${c.palabrasMin || c.palabrasMax ? ` <span class="${fuera ? 'dc-fuera' : 'dc-dentro'}">(${c.palabrasMin ? 'mín. ' + c.palabrasMin : ''}${c.palabrasMin && c.palabrasMax ? ' · ' : ''}${c.palabrasMax ? 'máx. ' + c.palabrasMax : ''})</span>` : ''}`;
  }
  function actividad() { const t = Date.now(); if (R.ult && t - R.ult < 60000) R.seg += (t - R.ult) / 1000; R.ult = t; }
  const editor = {
    html(v, soloLectura) {
      const contenido = limpiarDoc(v.doc != null && v.doc !== '' ? v.doc : !v.texto ? c.plantilla || '' : `<p>${esc(v.texto).replace(/\n/g, '<br>')}</p>`);
      if (soloLectura) return `<div class="dc-wrap ro"><div class="dc-ed dc-ro">${contenido}</div><div class="dc-pie"><span class="dc-pal"></span><span class="pn-grow"></span><button type="button" class="btn small" data-dc="docx">${ic('file-down')} Descargar .docx</button></div></div>`;
      return `<div class="dc-wrap"><div class="dc-barra" role="toolbar" aria-label="Formato">${BOTONES.map(([k, i, t]) => (k === '|' ? '<span class="dc-sep"></span>' : `<button type="button" class="dc-b" data-dc="${k}" title="${esc(t)}" aria-label="${esc(t)}">${ic(i)}</button>`)).join('')}</div>
        <div class="dc-ed" contenteditable="true" role="textbox" aria-multiline="true" aria-label="Tu documento" spellcheck="true" lang="es">${contenido}</div>
        <input type="file" accept="image/*" class="dc-file" hidden>
        <div class="dc-pie"><span class="dc-pal"></span><span class="pn-grow"></span><span class="au-small">Archivos grandes (vídeos, presentaciones…): pon el enlace abajo.</span><button type="button" class="btn small" data-dc="docx">${ic('file-down')} Descargar .docx</button></div></div>`;
    },
    leer(f) { const h = limpiarDoc(ed(f)?.innerHTML || ''); return { texto: textoDeDoc(h).slice(0, 10000), doc: h }; },
    enlazar(f, alCambiar, apiEntrega) {
      alCambiarCb = alCambiar; api = apiEntrega || null;
      const E = ed(f); if (!E) return;
      contador(f); rellenarImagenes(E, db, tid);
      try { document.execCommand('defaultParagraphSeparator', false, 'p'); } catch (e) { }
      E.addEventListener('input', () => { actividad(); contador(f); alCambiar(); });
      E.addEventListener('keydown', actividad);
      E.addEventListener('paste', (ev) => {
        const cd = ev.clipboardData; if (!cd) return;
        const txt = cd.getData('text/plain') || ''; const htm = cd.getData('text/html');
        if (txt.length >= PEGADO_GRANDE) R.pegados.push({ t: Date.now(), n: txt.length });
        ev.preventDefault();
        const limpio = htm ? limpiarDoc(htm) : esc(txt).split(/\n{2,}/).map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
        document.execCommand('insertHTML', false, limpio || esc(txt));
      });
      f.querySelector('.dc-file')?.addEventListener('change', (ev) => { const file = ev.target.files?.[0]; ev.target.value = ''; if (file) insertarImagen(f, file); });
      f.addEventListener('click', (ev) => { const b = ev.target.closest('[data-dc]'); if (b && f.contains(b)) { ev.preventDefault(); accion(f, b.dataset.dc); } });
      f.querySelector('.dc-barra')?.addEventListener('mousedown', (ev) => { if (ev.target.closest('.dc-b')) ev.preventDefault(); }); // no perder la selección
    },
    enlazarLectura(f) { const E = ed(f); if (E) { rellenarImagenes(E, db, tid); contador(f); } f.addEventListener('click', (ev) => { const b = ev.target.closest('[data-dc=docx]'); if (b) { ev.preventDefault(); accion(f, 'docx'); } }); },
    async alGuardar() {
      const seg = Math.round(R.seg); const peg = R.pegados.splice(0);
      if (seg < 1 && !peg.length) return;
      R.seg -= seg;
      try { await setDoc(doc(db, 'registros', tid), { item: it.id, al, grupo: ses.grupo, numero: ses.numero, seg: increment(seg), ...(peg.length ? { pegados: arrayUnion(...peg) } : {}), fecha: serverTimestamp() }, { merge: true }); }
      catch (e) { R.seg += seg; R.pegados.unshift(...peg); }
    },
  };
  function accion(f, k) {
    const E = ed(f); if (k !== 'docx') E?.focus();
    const cmd = (c1, v) => document.execCommand(c1, false, v);
    if (['p', 'h2', 'h3', 'pre'].includes(k)) cmd('formatBlock', k === 'p' ? 'p' : k);
    else if (['bold', 'italic', 'underline', 'undo', 'redo'].includes(k)) cmd(k);
    else if (k === 'ul') cmd('insertUnorderedList');
    else if (k === 'ol') cmd('insertOrderedList');
    else if (k === 'tabla') { const fl = Math.min(20, Math.max(1, parseInt(prompt('¿Cuántas filas (sin contar la de títulos)?', '3'), 10) || 3)); const co = Math.min(8, Math.max(1, parseInt(prompt('¿Cuántas columnas?', '3'), 10) || 3)); cmd('insertHTML', `<table><thead><tr>${'<th>Título</th>'.repeat(co)}</tr></thead><tbody>${`<tr>${'<td><br></td>'.repeat(co)}</tr>`.repeat(fl)}</tbody></table><p><br></p>`); }
    else if (k === 'enlace') { const u = (prompt('Dirección del enlace (https://…)', 'https://') || '').trim(); if (!u) return; if (!urlDocValida(u)) { alert('El enlace tiene que empezar por https:// o http://'); return; } const sel = window.getSelection(); if (sel && !sel.isCollapsed) cmd('createLink', u); else cmd('insertHTML', `<a href="${esc(u)}">${esc(u)}</a>&nbsp;`); }
    else if (k === 'imagen') f.querySelector('.dc-file')?.click();
    else if (k === 'docx') { (async () => { const h = ed(f)?.innerHTML || ''; const imgs = await imagenesParaDocx(db, tid, h); descargarDocx(h, { titulo: it.titulo, meta: `${ses.grupo} · nº ${ses.numero}`, imagenes: imgs }); })(); return; }
    contador(f); alCambiarCb?.();
  }
  async function insertarImagen(f, file) {
    const E = ed(f); const usadas = new Set(imagenesDe(E.innerHTML));
    const libre = ['img1', 'img2', 'img3'].find((x) => !usadas.has(x));
    if (!libre) { alert(`Como máximo ${MAX_IMAGENES} imágenes por trabajo. Para más, sube las fotos a tu Drive y pega el enlace.`); return; }
    const msg = f.closest('form')?.querySelector('#enMsg');
    try {
      if (msg) { msg.textContent = 'Comprimiendo la imagen…'; msg.className = 'au-msg'; }
      const im = await comprimirImagen(file);
      if (api?.asegurar) await api.asegurar();
      await setDoc(doc(db, 'trabajos', tid, 'imagenes', libre), { data: im.data, w: im.w, h: im.h, fecha: serverTimestamp() });
      CACHE.set(`${tid}/${libre}`, im);
      E.focus(); document.execCommand('insertHTML', false, `<img data-img="${libre}" src="${im.data}" alt="Imagen ${libre.slice(3)}"><p><br></p>`);
      if (msg) { msg.textContent = `Imagen añadida (${Math.round((im.data.length - 23) * 0.75 / 1024)} KB).`; msg.className = 'au-msg ok'; }
      contador(f); alCambiarCb?.();
    } catch (e) { if (msg) { msg.textContent = 'No se ha podido añadir la imagen: ' + (e?.message || e?.code || 'error'); msg.className = 'au-msg ko'; } }
  }
  return editor;
}

// ------------------------------------------------------------ plantilla (editor del profesor)
const BOT_PL = BOTONES.filter(([k]) => k !== 'imagen');
export function plantillaHTML(c = {}) {
  return `<div class="dc-wrap dc-pl"><div class="dc-barra" role="toolbar" aria-label="Formato de la plantilla">${BOT_PL.map(([k, i, t]) => (k === '|' ? '<span class="dc-sep"></span>' : `<button type="button" class="dc-b" data-dp="${k}" title="${esc(t)}" aria-label="${esc(t)}">${ic(i)}</button>`)).join('')}</div>
    <div class="dc-ed" id="dcPlantilla" contenteditable="true" role="textbox" aria-multiline="true" aria-label="Plantilla de partida">${limpiarDoc(c.plantilla || '', { plantilla: true })}</div></div>
    <div class="ap-fila"><label class="pn-f">Mínimo de palabras<input type="number" name="dcMin" min="1" max="20000" value="${esc(c.palabrasMin ?? '')}"></label><label class="pn-f">Máximo de palabras<input type="number" name="dcMax" min="1" max="20000" value="${esc(c.palabrasMax ?? '')}"></label>
    <label class="pn-chk"><input type="checkbox" name="dcImg" ${c.imagenes !== false ? 'checked' : ''}> El alumno puede añadir imágenes (máx. 3)</label></div>`;
}
export function leerPlantilla(f) {
  const n = (k) => { const v = parseInt(f.elements[k]?.value, 10); return Number.isInteger(v) && v > 0 ? v : null; };
  const o = { plantilla: limpiarDoc(f.querySelector('#dcPlantilla')?.innerHTML || '', { plantilla: true }), imagenes: !!f.elements.dcImg?.checked };
  if (n('dcMin')) o.palabrasMin = n('dcMin'); if (n('dcMax')) o.palabrasMax = n('dcMax');
  return o;
}
export function accionPlantilla(b) {
  const E = document.getElementById('dcPlantilla'); if (!E) return; E.focus(); const k = b.dataset.dp; const cmd = (c1, v) => document.execCommand(c1, false, v);
  if (['p', 'h2', 'h3', 'pre'].includes(k)) cmd('formatBlock', k);
  else if (['bold', 'italic', 'underline', 'undo', 'redo'].includes(k)) cmd(k);
  else if (k === 'ul') cmd('insertUnorderedList'); else if (k === 'ol') cmd('insertOrderedList');
  else if (k === 'tabla') cmd('insertHTML', '<table><thead><tr><th>Título</th><th>Título</th></tr></thead><tbody><tr><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td></tr></tbody></table><p><br></p>');
  else if (k === 'enlace') { const u = (prompt('Dirección del enlace (https://…)', 'https://') || '').trim(); if (urlDocValida(u)) cmd('createLink', u); }
}

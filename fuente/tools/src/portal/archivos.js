// Archivos que el profesor adjunta al Trabajo de clase, guardados en el propio portal (sin Drive).
// archivos/{id}: datos (nombre, tipo, tamaño, huella SHA-256, asignatura). Los bytes van troceados en
// archivos/{id}/partes/p00…p19 (≤ 750 KB cada una, ≤ 15 MB en total). Lo leen el profesor y los alumnos
// con sesión cuyo grupo tiene esa asignatura (reglas). En los adjuntos del elemento el enlace es «#archivo/{id}».
import { doc, getDoc, setDoc, writeBatch, serverTimestamp, Bytes } from 'firebase/firestore';
import { esc } from './util.js';
import { ic } from './ico.js';
import { cargarPdfjs } from './visor-pdf.js';

export const PARTE = 768000; // ≤ 786432 de las reglas
export const MAX_ARCHIVO = 15 * 1024 * 1024;
// «#archivo/id» = solo ver (por defecto) · «#archivo/id/descarga» = el profesor permite descargarlo
export const ES_ARCHIVO = /^#archivo\/([A-Za-z0-9]{6,40})(\/descarga)?$/;
const cache = new Map(); // id → Promise<{ blob, meta }>

export function tipoDeArchivo(nombre, mime = '') {
  const n = String(nombre || '').toLowerCase(); const m = String(mime || '').toLowerCase();
  if (m === 'application/pdf' || n.endsWith('.pdf')) return 'pdf';
  if (m.startsWith('image/') || /\.(png|jpe?g|gif|webp|svg)$/.test(n)) return 'imagen';
  if (/\.(docx?|odt|rtf|txt)$/.test(n)) return 'documento';
  if (/\.(pptx?|odp|key)$/.test(n)) return 'presentacion';
  if (/\.(xlsx?|ods|csv)$/.test(n)) return 'hoja';
  return 'archivo';
}
export const ICONO_ARCHIVO = { pdf: ['📕', 'PDF'], imagen: ['🖼️', 'Imagen'], documento: ['📘', 'Documento'], presentacion: ['📙', 'Presentación'], hoja: ['📗', 'Hoja de cálculo'], archivo: ['📎', 'Archivo'] };
export const tamaño = (b) => (b >= 1048576 ? (b / 1048576).toFixed(1).replace('.', ',') + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB');

async function huella(buf) { const h = await crypto.subtle.digest('SHA-256', buf); return [...new Uint8Array(h)].map((x) => x.toString(16).padStart(2, '0')).join(''); }
const nuevoId = () => 'f' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);

/** Sube un archivo (File o Blob con nombre). Devuelve { id, nombre, u }. */
export async function subirArchivo(db, file, { asig, curso, origen = null, nombre = null, progreso = () => {} }) {
  const nom = String(nombre || file.name || 'archivo').slice(0, 150);
  if (!file.size) throw new Error('El archivo está vacío.');
  if (file.size > MAX_ARCHIVO) throw new Error(`«${nom}» ocupa ${tamaño(file.size)}: el máximo es 15 MB. Redúcelo (p. ej. «Exportar como PDF» con calidad web) o divídelo.`);
  const buf = await file.arrayBuffer(); const u8 = new Uint8Array(buf);
  const hash = await huella(buf); const n = Math.ceil(u8.length / PARTE); const id = nuevoId();
  for (let i = 0; i < n; i += 4) { // de 4 en 4 partes (≤ 3 MB por envío)
    const b = writeBatch(db);
    for (let k = i; k < Math.min(n, i + 4); k++) b.set(doc(db, 'archivos', id, 'partes', 'p' + String(k).padStart(2, '0')), { d: Bytes.fromUint8Array(u8.subarray(k * PARTE, (k + 1) * PARTE)) });
    await b.commit(); progreso(Math.min(n, i + 4) / n);
  }
  // el documento con los datos va al final: si se corta la subida, no queda un adjunto a medias
  await setDoc(doc(db, 'archivos', id), { nombre: nom, mime: String(file.type || 'application/octet-stream').slice(0, 100), tipo: tipoDeArchivo(nom, file.type), bytes: u8.length, partes: n, hash, asig, ...(curso ? { curso } : {}), ...(origen ? { origen: String(origen).slice(0, 300) } : {}), fecha: serverTimestamp() });
  return { id, nombre: nom, u: '#archivo/' + id };
}

/** Descarga y une las partes. Devuelve { blob, meta }. */
export function bajarArchivo(db, id) {
  if (!cache.has(id)) cache.set(id, (async () => {
    const m = await getDoc(doc(db, 'archivos', id)); if (!m.exists()) throw new Error('El archivo ya no existe.');
    const meta = m.data();
    const P = await Promise.all(Array.from({ length: meta.partes }, (_, k) => getDoc(doc(db, 'archivos', id, 'partes', 'p' + String(k).padStart(2, '0')))));
    const blob = new Blob(P.map((p) => { if (!p.exists()) throw new Error('Falta una parte del archivo.'); return p.data().d.toUint8Array(); }), { type: meta.mime || 'application/octet-stream' });
    if (blob.size !== meta.bytes) throw new Error('El archivo está incompleto.');
    return { blob, meta };
  })().catch((e) => { cache.delete(id); throw e; }));
  return cache.get(id);
}

// ---------------------------------------------------------------- visor dentro de la página
let urlActual = null; let esProfe = false;
function cerrarVisor() {
  const v = document.getElementById('visorArchivo'); v?.querySelector('.vz-cuerpo')?._cerrar?.(); v?.remove();
  if (urlActual) { URL.revokeObjectURL(urlActual); urlActual = null; }
  document.documentElement.classList.remove('visor-abierto');
}
// PDF pintado con pdf.js en <canvas> (sin el visor del navegador, que trae botón de descarga); las páginas se pintan al acercarse.
async function pintarPDF(c, blob) {
  const lib = await cargarPdfjs();
  const pdf = await lib.getDocument({ data: new Uint8Array(await blob.arrayBuffer()), isEvalSupported: false, enableXfa: false }).promise;
  c.innerHTML = `<div class="vz-pags">${Array.from({ length: pdf.numPages }, (_, i) => `<div class="vz-pag" data-p="${i + 1}"><span class="pn-small">Página ${i + 1} de ${pdf.numPages}</span></div>`).join('')}</div>`;
  const ancho = Math.min(c.clientWidth - 24, 1100); const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const p1 = await pdf.getPage(1); const v1 = p1.getViewport({ scale: 1 }); const esc0 = ancho / v1.width;
  c.querySelectorAll('.vz-pag').forEach((d) => { d.style.width = ancho + 'px'; d.style.minHeight = Math.round(v1.height * esc0) + 'px'; });
  const pinta = async (d) => {
    if (d.dataset.ok) return; d.dataset.ok = '1';
    const pg = await pdf.getPage(+d.dataset.p); const v = pg.getViewport({ scale: (ancho / pg.getViewport({ scale: 1 }).width) * dpr });
    const cv = document.createElement('canvas'); cv.width = v.width; cv.height = v.height; cv.style.width = '100%'; cv.setAttribute('role', 'img'); cv.setAttribute('aria-label', `Página ${d.dataset.p}`);
    await pg.render({ canvasContext: cv.getContext('2d'), viewport: v }).promise;
    d.textContent = ''; d.style.minHeight = ''; d.appendChild(cv);
  };
  const obs = new IntersectionObserver((E) => E.forEach((e) => { if (e.isIntersecting) { obs.unobserve(e.target); pinta(e.target).catch(() => { e.target.textContent = 'No se ha podido pintar esta página.'; }); } }), { root: c, rootMargin: '600px' });
  c.querySelectorAll('.vz-pag').forEach((d) => obs.observe(d));
  c._cerrar = () => { obs.disconnect(); pdf.destroy?.(); };
}
export async function abrirVisor(db, id, titulo = '', { descarga = false } = {}) {
  cerrarVisor();
  const puede = descarga || esProfe; // el profesor siempre puede; el alumno solo si se ha permitido en ese adjunto
  const el = document.createElement('div'); el.id = 'visorArchivo'; el.className = 'vz' + (puede ? '' : ' vz-solover'); el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', titulo || 'Archivo');
  el.innerHTML = `<div class="vz-bar"><b class="vz-t">${esc(titulo || 'Archivo')}</b><span class="vz-info pn-small"></span><span class="pn-grow"></span>${puede ? `<a class="btn small vz-desc" hidden>${ic('download')} Descargar</a>` : '<span class="vz-solo pn-small">🔒 Solo lectura</span>'}<button type="button" class="btn small" data-vz="cerrar">${ic('x')} Cerrar</button></div><div class="vz-cuerpo"><p class="vz-msg">Cargando el archivo…</p></div>`;
  document.body.appendChild(el); document.documentElement.classList.add('visor-abierto');
  el.addEventListener('click', (ev) => { if (ev.target.closest('[data-vz=cerrar]') || ev.target === el) cerrarVisor(); });
  if (!puede) { el.addEventListener('contextmenu', (ev) => ev.preventDefault()); el.addEventListener('dragstart', (ev) => ev.preventDefault()); }
  const esc_ = (ev) => { if (ev.key === 'Escape') { cerrarVisor(); document.removeEventListener('keydown', esc_); } }; document.addEventListener('keydown', esc_);
  el.querySelector('[data-vz=cerrar]').focus();
  try {
    const { blob, meta } = await bajarArchivo(db, id);
    if (!el.isConnected) return;
    if (puede) { urlActual = URL.createObjectURL(blob); const a = el.querySelector('.vz-desc'); a.href = urlActual; a.download = meta.nombre; a.hidden = false; }
    el.querySelector('.vz-t').textContent = titulo || meta.nombre;
    el.querySelector('.vz-info').textContent = `${ICONO_ARCHIVO[meta.tipo]?.[1] || 'Archivo'} · ${tamaño(meta.bytes)}`;
    const c = el.querySelector('.vz-cuerpo');
    if (meta.tipo === 'pdf') {
      try { await pintarPDF(c, blob); }
      catch (e) { c.innerHTML = puede ? `<iframe class="vz-pdf" title="${esc(meta.nombre)}" src="${urlActual}#view=FitH"></iframe>` : '<p class="vz-msg ko">No se ha podido mostrar este PDF aquí. Díselo a tu profesor.</p>'; }
    } else if (meta.tipo === 'imagen' && puede) c.innerHTML = `<img class="vz-img" alt="${esc(meta.nombre)}" src="${urlActual}">`;
    else if (meta.tipo === 'imagen') { // solo ver: pintada en un lienzo, sin dirección que guardar
      const bm = await createImageBitmap(blob); const cv = document.createElement('canvas'); cv.className = 'vz-img'; cv.width = bm.width; cv.height = bm.height; cv.getContext('2d').drawImage(bm, 0, 0); cv.setAttribute('role', 'img'); cv.setAttribute('aria-label', meta.nombre);
      c.textContent = ''; c.appendChild(cv);
    } else c.innerHTML = `<div class="vz-otro"><p>${ICONO_ARCHIVO[meta.tipo]?.[0] || '📎'} <b>${esc(meta.nombre)}</b></p>${puede ? `<p class="pn-small">Este tipo de archivo no se puede ver dentro del portal. Descárgalo para abrirlo.</p><a class="btn primary" href="${urlActual}" download="${esc(meta.nombre)}">${ic('download')} Descargar</a>` : '<p class="pn-small">Este archivo no se puede ver dentro del portal y tu profesor no ha activado la descarga.</p>'}</div>`;
  } catch (e) {
    const c = el.querySelector('.vz-cuerpo'); if (c) c.innerHTML = `<p class="vz-msg ko">No se ha podido abrir el archivo (${esc(e?.code === 'permission-denied' ? 'no tienes acceso' : e?.message || 'error')}).</p>`;
  }
}
/** Un solo escuchador para toda la página: los enlaces «#archivo/…» abren el visor en vez de navegar. */
export function instalarVisor(db, profesor = false) {
  esProfe = !!profesor;
  if (window.__visorArchivos) return; window.__visorArchivos = true;
  document.addEventListener('click', (ev) => {
    const a = ev.target.closest?.('a[href^="#archivo/"]'); if (!a) return;
    const m = a.getAttribute('href').match(ES_ARCHIVO); if (!m) return;
    ev.preventDefault(); abrirVisor(db, m[1], a.dataset.titulo || a.querySelector('b')?.textContent || a.textContent.trim(), { descarga: !!m[2] });
  });
  window.abrirArchivoSuperProfe = (id) => abrirVisor(db, id);
}

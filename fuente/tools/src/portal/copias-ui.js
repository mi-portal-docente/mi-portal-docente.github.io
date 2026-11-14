// P2 · Entregas con enlace + copia congelada (constancia ante reclamaciones).
//  · Lo que hay en un enlace (Canva, Drive, Tinkercad…) puede cambiar después de entregar: el alumno sube también una
//    COPIA de ese momento (PDF, capturas o el archivo). Se guarda en trabajos/{id}/copias/{c01…c20} como bytes, con
//    la huella SHA-256 (el servidor comprueba que es la de esos bytes) y la hora del servidor. No se puede cambiar ni
//    borrar (reglas).
//  · Sin Firebase Storage: imágenes comprimidas a unos 300 KB, PDF hasta 700 KB y archivos hasta 600 KB.
import { doc, setDoc, getDocs, collection, serverTimestamp, Bytes } from 'firebase/firestore';
import { esc, nombreArchivo } from './util.js';
import { ic } from './ico.js';
import { urlSegura } from '../lms/modelo.js';

export const MAX = { imagen: 300 * 1024, pdf: 700 * 1024, archivo: 600 * 1024 };
const fFecha = (t) => (t ? new Date(t).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '');
const kb = (n) => `${Math.max(1, Math.round(n / 1024))} KB`;
const msOf = (x) => x?.toMillis?.() ?? (typeof x === 'number' ? x : null);

// ---------------------------------------------------------------- tipo de enlace
const PLATAFORMAS = [
  [/(^|\.)canva\.(com|link)$/, 'canva', 'Canva', 'palette'],
  [/^docs\.google\.com$/, 'docs', 'Google Docs / Presentaciones', 'file-text'],
  [/^drive\.google\.com$/, 'drive', 'Google Drive', 'folder-open'],
  [/(^|\.)tinkercad\.com$/, 'tinkercad', 'Tinkercad', 'box'],
  [/^editor\.p5js\.org$/, 'p5', 'p5.js', 'code'],
  [/(^|\.)(youtube\.com|youtu\.be)$/, 'youtube', 'YouTube', 'video'],
  [/(^|\.)github\.(com|io)$/, 'github', 'GitHub', 'code'],
];
export function tipoEnlace(u) {
  let h = ''; try { h = new URL(u).hostname.toLowerCase(); } catch (e) { return { tipo: 'otro', nombre: 'Enlace', icono: 'link' }; }
  for (const [re, tipo, nombre, icono] of PLATAFORMAS) if (re.test(h)) return { tipo, nombre, icono };
  return { tipo: 'otro', nombre: h.replace(/^www\./, ''), icono: 'globe' };
}
export const INSTRUCCIONES = {
  canva: 'Canva → Compartir → Descargar → PDF estándar (o PNG de las páginas).',
  docs: 'Archivo → Descargar → Documento PDF.',
  drive: 'Abre el archivo → Archivo → Descargar → PDF (o descárgalo y súbelo).',
  tinkercad: 'Exportar → .STL (si pesa mucho, haz capturas de pantalla del diseño).',
  p5: 'Haz capturas de pantalla del código y del resultado.',
  youtube: 'Haz capturas de pantalla de los momentos importantes (o súbelo también a Drive).',
  github: 'Haz capturas de pantalla o descarga el archivo principal.',
  otro: 'Descárgalo en PDF o haz capturas de pantalla.',
};
// Lista de enlaces que está escribiendo el alumno: plataforma + aviso de compartir.
export function enlacesDetectadosHTML(enlaces) {
  if (!enlaces.length) return '';
  const tipos = new Set();
  const filas = enlaces.map((u) => { const t = tipoEnlace(u); tipos.add(t.tipo); return `<li>${ic(t.icono)} <b>${esc(t.nombre)}</b> · <span class="cp-url">${esc(u)}</span></li>`; }).join('');
  return `<ul class="cp-enl">${filas}</ul><p class="au-small cp-aviso">${ic('eye')} Comprueba que el enlace está compartido para que el profesor pueda verlo.</p>`
    + `<div class="cp-instr"><b>Cómo sacar la copia:</b><ul>${[...tipos].map((t) => `<li>${esc(INSTRUCCIONES[t] || INSTRUCCIONES.otro)}</li>`).join('')}</ul></div>`;
}
// Enlaces entregados (vista de lectura): siempre avisan de que pueden haber cambiado.
export function enlacesVivosHTML(enlaces = [], fechas = []) {
  return enlaces.map((u, i) => { const t = tipoEnlace(u); return `<div class="cp-vivo">${ic(t.icono)} <a href="${esc(urlSegura(u))}" target="_blank" rel="noopener noreferrer">${esc(t.nombre)}</a> <span class="au-small">${fechas[i] ? 'añadido el ' + esc(fFecha(fechas[i])) + ' · ' : ''}enlace vivo, puede haber cambiado después de entregar</span></div>`; }).join('');
}

// ---------------------------------------------------------------- huella y compresión
export async function sha256Hex(bytes) {
  const h = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(h), (b) => b.toString(16).padStart(2, '0')).join('');
}
async function comprimirImagen(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
    for (const lado of [1800, 1400, 1100, 900]) {
      const k = Math.min(1, lado / Math.max(img.naturalWidth, img.naturalHeight));
      const c = document.createElement('canvas'); c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      for (const q of [0.82, 0.7, 0.58, 0.46]) {
        const b = await new Promise((res) => c.toBlob(res, 'image/jpeg', q));
        if (b && b.size <= MAX.imagen) return new Uint8Array(await b.arrayBuffer());
      }
    }
    throw new Error('La imagen no baja de 300 KB: recórtala o haz una captura más pequeña.');
  } finally { URL.revokeObjectURL(url); }
}
// Archivo elegido → { bytes, tipo, mime, nombre } listo para subir (o error con un mensaje para el alumno).
export async function prepararCopia(file) {
  const nombre = String(file.name || 'copia').slice(0, 150);
  if (/^image\//.test(file.type)) {
    const bytes = file.size <= MAX.imagen && file.type === 'image/jpeg' ? new Uint8Array(await file.arrayBuffer()) : await comprimirImagen(file);
    return { bytes, tipo: 'imagen', mime: 'image/jpeg', nombre: nombre.replace(/\.\w+$/, '') + '.jpg' };
  }
  const pdf = file.type === 'application/pdf' || /\.pdf$/i.test(nombre);
  const lim = pdf ? MAX.pdf : MAX.archivo;
  if (file.size > lim) throw new Error(`Pesa ${kb(file.size)} y el máximo es ${kb(lim)}. ${pdf ? 'Exporta el PDF con menos calidad o sube capturas de pantalla.' : 'Sube capturas de pantalla en su lugar.'}`);
  return { bytes: new Uint8Array(await file.arrayBuffer()), tipo: pdf ? 'pdf' : 'archivo', mime: (pdf ? 'application/pdf' : file.type || 'application/octet-stream').slice(0, 80), nombre };
}

// ---------------------------------------------------------------- leer y subir
const CACHE = new Map(); // tid → { t, L }
export async function cargarCopias(db, tid, { fresco = false } = {}) {
  const c = CACHE.get(tid); if (c && !fresco && Date.now() - c.t < 60e3) return c.L;
  const qs = await getDocs(collection(db, 'trabajos', tid, 'copias'));
  const L = qs.docs.map((d) => { const x = d.data({ serverTimestamps: 'estimate' }); return { id: d.id, ...x, fecha: msOf(x.fecha) }; }).sort((a, b) => (a.fecha || 0) - (b.fecha || 0));
  CACHE.set(tid, { t: Date.now(), L }); return L;
}
export async function subirCopia(db, tid, prep, { nEnt = 1, existentes = [] } = {}) {
  const usados = new Set(existentes.map((x) => x.id));
  const id = Array.from({ length: 20 }, (_, i) => 'c' + String(i + 1).padStart(2, '0')).find((x) => !usados.has(x));
  if (!id) throw new Error('Ya hay 20 copias en este trabajo: no caben más.');
  const hash = await sha256Hex(prep.bytes);
  await setDoc(doc(db, 'trabajos', tid, 'copias', id), { data: Bytes.fromUint8Array(prep.bytes), hash, nombre: prep.nombre, mime: prep.mime, bytes: prep.bytes.length, tipo: prep.tipo, fecha: serverTimestamp(), nEnt });
  CACHE.delete(tid);
  return { id, hash };
}
export function abrirCopia(c) {
  const b = new Blob([c.data.toUint8Array()], { type: c.mime || 'application/octet-stream' });
  const url = URL.createObjectURL(b);
  if (/^(application\/pdf|image\/)/.test(c.mime)) window.open(url, '_blank', 'noopener');
  else { const a = document.createElement('a'); a.href = url; a.download = nombreArchivo(c.nombre) || 'copia'; document.body.appendChild(a); a.click(); a.remove(); }
  setTimeout(() => URL.revokeObjectURL(url), 60e3);
}
const icTipo = { pdf: 'file-text', imagen: 'image', archivo: 'paperclip' };
export function copiasHTML(L, { vacio = '' } = {}) {
  if (!L?.length) return vacio;
  return `<ul class="cp-lista">${L.map((c) => `<li>${ic(icTipo[c.tipo] || 'paperclip')} <button type="button" class="cp-abrir" data-cp-abrir="${esc(c.id)}">${esc(c.nombre)}</button> <span class="au-small">${esc(kb(c.bytes))} · Copia entregada el ${esc(fFecha(c.fecha))} · huella <code title="SHA-256: ${esc(c.hash)}">${esc(String(c.hash).slice(0, 12))}…</code></span></li>`).join('')}</ul>`;
}
// Huecos «data-cp-slot="tid"» de una vista: se rellenan con las copias de cada trabajo (y abren al pulsar).
export function slotCopias(tid) { return `<div class="cp-slot" data-cp-slot="${esc(tid)}"></div>`; }
export function rellenarCopias(root, db) {
  root.querySelectorAll('[data-cp-slot]').forEach(async (el) => {
    const tid = el.dataset.cpSlot;
    try {
      const L = await cargarCopias(db, tid); if (!el.isConnected) return;
      el.innerHTML = L.length ? `<div class="cp-tit">${ic('lock')} Copias congeladas (no se pueden cambiar)</div>${copiasHTML(L)}` : '';
      el.onclick = (e) => { const b = e.target.closest('[data-cp-abrir]'); if (!b) return; const c = L.find((x) => x.id === b.dataset.cpAbrir); if (c) abrirCopia(c); };
    } catch (e) { el.innerHTML = ''; }
  });
}

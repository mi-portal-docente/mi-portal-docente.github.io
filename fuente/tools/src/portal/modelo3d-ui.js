// Fase 13 · Modelo 3D de una entrega: el alumno sube un STL pequeño (≤ 600 KB, en Firestore: trabajos/{id}/modelos/m1,
// sin Storage) o pone el enlace a un .stl / .glb. El profesor lo ve en el visor 3D al corregir (window.PORTAL_VISOR3D,
// three.js de app.js). Los botones [data-v3d-url] / [data-v3d-tid] funcionan en cualquier parte del portal.
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp, deleteField } from 'firebase/firestore';
import { esc } from './util.js';
import { ic } from './ico.js';

export const MAX_STL = 600 * 1024;
export const CON_MODELO = (t) => ['tarea', 'practica', 'proyecto', 'actividad', 'recuperacion'].includes(t);
export const es3D = (u) => /\.(stl|glb|gltf)($|[?#])/i.test(String(u || ''));
const b64 = (buf) => { const u = new Uint8Array(buf); let s = ''; for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000)); return btoa(s); };
const deB64 = (t) => { const s = atob(t); const u = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i); return u.buffer; };
export function botonModelo(tr, tid) { return tr?.modelo ? `<button type="button" class="btn small" data-v3d-tid="${esc(tid)}" data-v3d-nombre="${esc(tr.modelo.nombre)}">${ic('box')} Ver «${esc(tr.modelo.nombre)}» en 3D</button>` : ''; }
export const botonesEnlaces3D = (L) => (L || []).filter(es3D).map((u) => `<button type="button" class="btn small" data-v3d-url="${esc(u)}">${ic('box')} Ver ${esc(decodeURIComponent(String(u).split(/[?#]/)[0].split('/').pop()))} en 3D</button>`).join('');
export function modeloHTML(tr, ed, tid) {
  const m = tr?.modelo; const enl = botonesEnlaces3D(tr?.enlaces);
  if (!ed && !m && !enl) return '';
  return `<div class="m3"><div class="m3-h">${ic('box')} <b>Modelo 3D</b> <span class="au-small">(opcional · STL hasta 600 KB, o pon el enlace a un .stl / .glb arriba)</span></div><div class="m3-acts">
    ${m ? `${botonModelo(tr, tid)}<span class="au-small">${esc(Math.round((m.bytes || 0) / 1024))} KB</span>${ed ? `<button type="button" class="btn small" data-en="m3dQuitar">${ic('trash')} Quitar</button>` : ''}` : ed ? `<button type="button" class="btn small" data-en="m3dSubir">${ic('upload')} Subir modelo STL</button><input type="file" class="m3-file" accept=".stl,model/stl,application/sla" hidden>` : ''}${enl}</div></div>`;
}
export async function subirModelo(db, tid, file) {
  if (!/\.stl$/i.test(file.name)) throw new Error('tiene que ser un archivo .stl (para .glb o archivos grandes, pon un enlace).');
  if (file.size > MAX_STL) throw new Error(`pesa ${Math.round(file.size / 1024)} KB y el máximo es 600 KB: reduce la malla o pon un enlace.`);
  const buf = await file.arrayBuffer(); const nombre = file.name.replace(/[^\p{L}\p{N} _.-]+/gu, '').slice(0, 120) || 'modelo.stl';
  await setDoc(doc(db, 'trabajos', tid, 'modelos', 'm1'), { data: b64(buf), nombre, bytes: file.size, fecha: serverTimestamp() });
  await setDoc(doc(db, 'trabajos', tid), { modelo: { nombre, bytes: file.size }, fecha: serverTimestamp() }, { merge: true });
  return { nombre, bytes: file.size };
}
export async function quitarModelo(db, tid) {
  await setDoc(doc(db, 'trabajos', tid), { modelo: deleteField(), fecha: serverTimestamp() }, { merge: true });
  await deleteDoc(doc(db, 'trabajos', tid, 'modelos', 'm1')).catch(() => { });
}
export function instalarBotones3D(db) {
  if (window.__v3dBtn) return; window.__v3dBtn = true;
  document.addEventListener('click', async (e) => {
    const b = e.target.closest?.('[data-v3d-url], [data-v3d-tid]'); if (!b) return; e.preventDefault();
    const V = window.PORTAL_VISOR3D; if (!V) { alert('El visor 3D todavía se está cargando. Prueba otra vez en unos segundos.'); return; }
    if (b.dataset.v3dUrl) return V.abrir({ url: b.dataset.v3dUrl, nombre: decodeURIComponent(b.dataset.v3dUrl.split(/[?#]/)[0].split('/').pop()) });
    b.disabled = true;
    try { const d = await getDoc(doc(db(), 'trabajos', b.dataset.v3dTid, 'modelos', 'm1')); if (!d.exists()) throw new Error('no está'); V.abrir({ buffer: deB64(d.data().data), nombre: d.data().nombre || b.dataset.v3dNombre, formato: 'stl' }); }
    catch (er) { alert('No se ha podido cargar el modelo 3D.'); } finally { b.disabled = false; }
  });
}

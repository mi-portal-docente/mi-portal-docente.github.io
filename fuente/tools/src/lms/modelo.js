// Lógica pura del aula virtual (sin Firebase ni DOM): corrección de exámenes, rúbricas,
// medias ponderadas, barajado determinista, PIN y CSV. Se usa en la web y en las pruebas.
import { CATEGORIAS, TIPOS } from './biblioteca.js';
import { TIPOS_PREGUNTA } from './preguntas.js';

export const TIPOS_ENTREGA = ['tarea', 'pregunta', 'cuestionario', 'actividad', 'practica', 'proyecto', 'recuperacion'];
export const categoriaDe = (tipo) => (TIPOS[tipo] && TIPOS[tipo].cat) || null;
export const redondea = (x, d = 2) => Math.round(x * 10 ** d) / 10 ** d;
export const fmtNota = (n) => (n == null || Number.isNaN(n) ? '' : String(redondea(n)).replace('.', ','));

// Texto para comparar respuestas cortas: minúsculas, sin tildes, sin espacios repetidos ni puntuación final.
export function normaliza(t) {
  return String(t ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[\s\u00a0]+/g, ' ').trim().replace(/[.;:!?¡¿,]+$/g, '').trim();
}

// Corrige un examen.
//  preguntas: [{id, tipo: 'test'|'vf'|'corta'|'emparejar'|'ordenar'|'huecos'|'numerica'|'zonas', puntos}] (ver preguntas.js)
//  claves:    {qid: índice (test) | true/false (vf) | [respuestas aceptadas] (corta)}
//  respuestas:{qid: índice | true/false | texto}
// Devuelve {puntos, max, nota (0-10), detalle: {qid: puntos}, revisar: [qid de respuestas cortas sin coincidencia]}
export function corregirExamen(preguntas, claves, respuestas, manual = {}) {
  let puntos = 0, max = 0; const detalle = {}; const revisar = [];
  for (const q of preguntas || []) {
    const p = Number(q.puntos) > 0 ? Number(q.puntos) : 1; max += p;
    const r = respuestas ? respuestas[q.id] : undefined; const k = claves ? claves[q.id] : undefined;
    let got = 0;
    if (q.id in manual && manual[q.id] != null && manual[q.id] !== '') got = Math.max(0, Math.min(p, Number(manual[q.id]) || 0));
    else if (q.tipo === 'test') got = r != null && Number(r) === Number(k) ? p : 0;
    else if (q.tipo === 'vf') got = r != null && Boolean(r) === Boolean(k) && typeof r === 'boolean' ? p : 0;
    else if (q.tipo === 'corta') {
      const ok = Array.isArray(k) && r != null && String(r).trim() !== '' && k.some((a) => normaliza(a) === normaliza(r));
      got = ok ? p : 0;
      if (!ok && r != null && String(r).trim() !== '') revisar.push(q.id);
    }
    else if (TIPOS_PREGUNTA[q.tipo]) got = redondea(p * TIPOS_PREGUNTA[q.tipo].corregir(q, k, r), 4); // emparejar, ordenar, huecos (parcial), numérica, zonas
    detalle[q.id] = got; puntos += got;
  }
  return { puntos: redondea(puntos), max: redondea(max), nota: max ? redondea((puntos / max) * 10) : 0, detalle, revisar };
}

// Rúbrica: [{c, p}] (criterio y puntos máximos); valores: {índice: puntos obtenidos}.
export function notaRubrica(rubrica, valores) {
  let max = 0, got = 0;
  (rubrica || []).forEach((r, i) => { const p = Number(r.p) || 0; max += p; const v = Number(valores?.[i]); if (!Number.isNaN(v)) got += Math.max(0, Math.min(p, v)); });
  return { puntos: redondea(got), max: redondea(max), nota: max ? redondea((got / max) * 10) : null };
}

// Media de cada categoría y media ponderada final.
//  notas: [{categoria, nota}] (nota 0-10; null = sin nota, no cuenta)
//  pesos: {categoria: peso}. Las categorías sin notas no cuentan y el resto se reescala.
export function mediaPonderada(notas, pesos) {
  const porCat = {};
  for (const n of notas) {
    if (n.nota == null || !n.categoria) continue;
    (porCat[n.categoria] = porCat[n.categoria] || []).push(Number(n.nota));
  }
  const medias = {}; let suma = 0, pesoTotal = 0;
  for (const c of CATEGORIAS) {
    const L = porCat[c.id]; if (!L || !L.length) { medias[c.id] = null; continue; }
    const m = L.reduce((a, b) => a + b, 0) / L.length; medias[c.id] = redondea(m);
    const w = pesos && pesos[c.id] != null ? Number(pesos[c.id]) : c.peso;
    if (w > 0) { suma += m * w; pesoTotal += w; }
  }
  return { medias, final: pesoTotal ? redondea(suma / pesoTotal) : null };
}
export const pesosPorDefecto = () => Object.fromEntries(CATEGORIAS.map((c) => [c.id, c.peso]));

// Barajado determinista (mismo orden para el mismo alumno si recarga la página).
export function semilla(str) { let h = 2166136261; for (const ch of String(str)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
export function barajar(arr, seed) {
  const a = arr.slice(); let s = seed >>> 0 || 1;
  const rnd = () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

// PIN del alumno: 4 a 8 cifras. Se guarda SOLO su hash (SHA-256 con grupo y nº).
export const pinValido = (p) => /^[0-9]{4,8}$/.test(String(p || ''));
export async function hashPin(grupo, numero, pin) {
  const data = new TextEncoder().encode(`portal-docente|${grupo}|${numero}|${pin}`);
  const buf = await globalThis.crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Ids
export const idItem = (rnd = Math.random) => 'i' + Array.from({ length: 11 }, () => 'abcdefghijkmnpqrstuvwxyz23456789'[Math.floor(rnd() * 32)]).join('');
export const idTrabajo = (item, grupo, numero) => `${item}_${grupo}_${numero}`;

// Enlaces escritos como «Título | https://…» (uno por línea) o solo la URL.
export function leeEnlaces(txt, max = 20) {
  return String(txt || '').split('\n').map((l) => l.trim()).filter(Boolean).slice(0, max).map((l) => {
    const m = l.split('|'); const u = (m.length > 1 ? m.slice(1).join('|') : m[0]).trim(); const t = (m.length > 1 ? m[0] : '').trim();
    return { t: t.slice(0, 120), u: u.slice(0, 500) };
  }).filter((e) => enlaceValido(e.u));
}
// Enlaces admitidos: web (http/https), archivos alojados en la propia web (materiales/…) y páginas
// internas del portal (#eee/vivienda…).
export const enlaceValido = (u) => /^https?:\/\/\S+$/i.test(String(u || '')) || (/^(materiales\/[\w\-./]+|#[\w\-/]+)$/.test(String(u || '')) && !String(u).includes('..'));
// Icono y tipo de un adjunto (como en Classroom: Drive, Docs, YouTube, PDF…).
export function tipoAdjunto(u) {
  const s = String(u || '').toLowerCase();
  if (/youtu\.?be/.test(s)) return { ic: '▶️', t: 'YouTube' };
  if (/docs\.google\.com\/document/.test(s)) return { ic: '📘', t: 'Documentos de Google' };
  if (/docs\.google\.com\/spreadsheets/.test(s)) return { ic: '📗', t: 'Hojas de cálculo de Google' };
  if (/docs\.google\.com\/presentation/.test(s)) return { ic: '📙', t: 'Presentaciones de Google' };
  if (/docs\.google\.com\/forms|forms\.gle/.test(s)) return { ic: '🟪', t: 'Formularios de Google' };
  if (/drive\.google\.com/.test(s)) return { ic: '🗂️', t: 'Google Drive' };
  if (/\.pdf($|\?)/.test(s)) return { ic: '📕', t: 'PDF' };
  if (/\.(png|jpe?g|gif|webp|svg)($|\?)/.test(s)) return { ic: '🖼️', t: 'Imagen' };
  if (s.startsWith('#')) return { ic: '🔬', t: 'Portal' };
  return { ic: '🔗', t: 'Enlace' };
}
// Orden «entre» dos vecinos (arrastrar y soltar): no hace falta renumerar todo el tema.
export function ordenEntre(antes, despues) {
  if (antes == null && despues == null) return 1000;
  if (antes == null) return despues - 1000;
  if (despues == null) return antes + 1000;
  return (antes + despues) / 2;
}
export const enlacesTexto = (L) => (L || []).map((e) => (e.t ? `${e.t} | ${e.u}` : e.u)).join('\n');
// Rúbrica escrita como «Criterio | puntos» (una por línea).
export function leeRubrica(txt) {
  return String(txt || '').split('\n').map((l) => l.trim()).filter(Boolean).slice(0, 20).map((l) => {
    const i = l.lastIndexOf('|'); const c = (i >= 0 ? l.slice(0, i) : l).trim().slice(0, 200); const p = i >= 0 ? Number(l.slice(i + 1).trim().replace(',', '.')) : 1;
    return { c, p: Number.isFinite(p) && p > 0 ? redondea(p) : 1 };
  }).filter((r) => r.c);
}
export const rubricaTexto = (R) => (R || []).map((r) => `${r.c} | ${String(r.p).replace('.', ',')}`).join('\n');

// URL segura para enlaces que escribe el profesor o el alumno (solo http/https).
export const urlSegura = (u) => (enlaceValido(u) ? String(u) : '#');

// CSV con «;» y BOM para Excel en español.
export function csv(filas) {
  const q = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  return '\ufeff' + filas.map((r) => r.map(q).join(';')).join('\r\n');
}
// «Recuperación» (fase 8): ids 'grupo_nº' de los alumnos que la ven
export const visibleAlDe = (grupos, para) => (grupos || []).flatMap((g) => (para || []).map((n) => `${g}_${n}`)).slice(0, 200);

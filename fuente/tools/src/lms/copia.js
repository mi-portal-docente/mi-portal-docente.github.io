// Fase 14 · Copia de un curso escolar (JSON) y plan de limpieza. Funciones puras (sin Firestore) para poder probarlas.
export const FORMATO_COPIA = 'portal-docente/copia-curso@1';
// Colecciones de un curso escolar. «curso»: tienen el campo curso; «item»: van ligadas a los elementos del curso;
// «id»: su id es el del elemento (examen y claves). contenido = lo que prepara el profesor (se puede conservar).
export const COLECCIONES_CURSO = [
  { col: 'items', por: 'curso', contenido: true }, { col: 'temas', por: 'curso', contenido: true }, { col: 'anuncios', por: 'curso', contenido: true },
  { col: 'examenes', por: 'id', contenido: true }, { col: 'claves', por: 'id', contenido: true }, { col: 'directo', por: 'curso', contenido: true },
  { col: 'trabajos', por: 'curso' }, { col: 'notas', por: 'curso' }, { col: 'versiones', por: 'curso' }, { col: 'registros', por: 'item' },
  { col: 'incidencias', por: 'item' }, { col: 'piac', por: 'item' }, { col: 'piacEval', por: 'item' }, { col: 'respDirecto', por: 'directo' },
];
// Valor de Firestore → JSON (las fechas como {"__fecha": "ISO"}).
export function aJSON(v) {
  if (v == null || typeof v !== 'object') return v;
  if (typeof v.toDate === 'function') { try { return { __fecha: v.toDate().toISOString() }; } catch (e) { return null; } }
  if (Array.isArray(v)) return v.map(aJSON);
  if (typeof v.latitude === 'number' && typeof v.longitude === 'number') return { lat: v.latitude, lon: v.longitude };
  const o = {}; for (const [k, x] of Object.entries(v)) o[k] = aJSON(x); return o;
}
// Trozos de ≤ 30 para las consultas «in».
export const trozos = (L, n = 30) => { const r = []; for (let i = 0; i < L.length; i += n) r.push(L.slice(i, i + n)); return r; };
// Imágenes que usa un documento (<img data-img="img1">) y si el trabajo tiene modelo 3D.
export const imagenesDe = (tr) => [...new Set(String(tr?.doc || '').match(/data-img="(img[1-3])"/g)?.map((m) => m.slice(10, 14)) || [])];
// Resumen de una copia: número de documentos por colección (lo que se enseña antes de borrar).
export function resumenCopia(c) {
  const n = {}; for (const [k, L] of Object.entries(c?.colecciones || {})) n[k] = L.length;
  for (const [k, L] of Object.entries(c?.subcolecciones || {})) n[k] = (n[k] || 0) + L.length;
  return n;
}
export const totalCopia = (c) => Object.values(resumenCopia(c)).reduce((a, b) => a + b, 0);
export const alumnadoCopia = (c) => ['trabajos', 'notas', 'versiones', 'registros', 'incidencias', 'piac', 'piacEval', 'respDirecto', 'comentarios', 'imagenes', 'modelos']
  .reduce((a, k) => a + (resumenCopia(c)[k] || 0), 0);
// Nombre del archivo: copia-curso-2026-27-AAAAMMDD.json
export const nombreCopia = (nombre, fecha = new Date()) => `copia-curso-${String(nombre || 'curso').replace(/[^\w-]+/g, '-').replace(/^-+|-+$/g, '')}-${fecha.toISOString().slice(0, 10).replace(/-/g, '')}.json`;
// Comprueba la confirmación escrita (doble confirmación): hay que escribir el nombre del curso.
export const confirmacionOk = (escrito, nombre) => String(escrito || '').trim().toLowerCase() === String(nombre || '').trim().toLowerCase() && !!String(nombre || '').trim();

// Banco de preguntas por asignatura (lógica pura). Cada pregunta del banco lleva su criterio.
// Generar un examen = elegir n preguntas al azar de cada criterio.
import { barajar } from './modelo.js';
import { validarPregunta } from './preguntas.js';

// Cuántas preguntas hay de cada criterio. banco: [{id, criterio, q}]
export function porCriterio(banco) {
  const m = new Map();
  for (const b of banco) m.set(b.criterio, (m.get(b.criterio) || 0) + 1);
  return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0], 'es', { numeric: true })).map(([criterio, n]) => ({ criterio, n }));
}
// pedir: {criterio: n}. Devuelve {preguntas, errores}. Las preguntas salen con ids q1, q2… (sin repetir)
export function generarExamen(banco, pedir, seed = Date.now()) {
  const errores = []; const out = [];
  let s = seed >>> 0 || 1;
  for (const [criterio, n0] of Object.entries(pedir || {})) {
    const n = Math.max(0, Math.floor(Number(n0) || 0)); if (!n) continue;
    const L = banco.filter((b) => b.criterio === criterio);
    if (L.length < n) { errores.push(`Del criterio «${criterio}» pides ${n} y en el banco solo hay ${L.length}.`); continue; }
    s = (Math.imul(s, 1103515245) + 12345) >>> 0;
    out.push(...barajar(L, s).slice(0, n));
  }
  if (!out.length && !errores.length) errores.push('Elige cuántas preguntas quieres de algún criterio.');
  return { errores, preguntas: out.map((b, i) => ({ ...b.q, id: 'q' + (i + 1), criterio: b.criterio })) };
}
// Lee preguntas para el banco (JSON: lista de preguntas o {"preguntas": [...]}). Todas necesitan criterio.
export function leerPreguntasBanco(texto, criterioPorDefecto = '') {
  let j; try { j = JSON.parse(String(texto || '')); } catch (e) { return { errores: ['No es un JSON válido. Revisa comas, comillas dobles y corchetes.'], preguntas: [] }; }
  const L = Array.isArray(j) ? j : Array.isArray(j?.preguntas) ? j.preguntas : null;
  if (!L || !L.length) return { errores: ['Tiene que ser una lista de preguntas: [ { … }, { … } ] o { "preguntas": [ … ] }.'], preguntas: [] };
  if (L.length > 300) return { errores: ['Como mucho 300 preguntas de una vez.'], preguntas: [] };
  const errores = []; const preguntas = [];
  L.forEach((q0, i) => {
    const q = { ...q0, criterio: q0?.criterio || criterioPorDefecto || undefined };
    const r = validarPregunta(q, i, (ruta, t) => errores.push(t));
    if (r && !r.criterio) errores.push(`Pregunta ${i + 1}: falta el «criterio» (en el banco todas las preguntas lo llevan).`);
    else if (r) preguntas.push(r);
  });
  return { errores, preguntas: errores.length ? [] : preguntas };
}

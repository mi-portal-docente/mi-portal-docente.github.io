// Fase 3 · Exportar notas por criterio (CSV largo, sin nombres) y analítica de exámenes.
// Funciones puras: las usa el cuaderno del profesor y se prueban en plataforma_test.mjs.
import { corregirExamen, redondea, fmtNota } from './modelo.js';

const ptsDe = (q) => (Number(q.puntos) > 0 ? Number(q.puntos) : 1);
export const SIN_CRITERIO = '';

// Nota (0–10) de un examen desglosada por criterio a partir del detalle {idPregunta: puntos}.
// Las preguntas sin criterio cuentan para el criterio del examen (si lo tiene) o para «sin criterio».
// Si no hay detalle, una sola fila con la nota global y el criterio del examen.
export function notaPorCriterio(preguntas, detalle, notaGlobal, critExamen = '') {
  const P = preguntas || [];
  if (!detalle || !P.some((q) => q.id in detalle)) return [{ criterio: critExamen || SIN_CRITERIO, nota: notaGlobal }];
  const C = new Map();
  for (const q of P) {
    const c = q.criterio || critExamen || SIN_CRITERIO; const p = ptsDe(q);
    const got = Math.max(0, Math.min(p, Number(detalle[q.id]) || 0));
    const x = C.get(c) || { got: 0, max: 0 }; x.got += got; x.max += p; C.set(c, x);
  }
  return [...C.entries()].map(([criterio, x]) => ({ criterio, nota: x.max ? redondea((x.got / x.max) * 10) : 0 }));
}

const fechaISO = (t) => { if (!t) return ''; const d = new Date(t); return isNaN(d) ? '' : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };

// registros: [{ n, actividad, fecha(ms), nota, criterio }] → filas del CSV (cabecera incluida), ordenadas
// por nº de lista, fecha y actividad. Solo 5 columnas y sin nombres.
export const CABECERA_CRITERIOS = ['nº de lista', 'actividad', 'fecha', 'nota', 'criterio'];
export function filasCriterios(registros) {
  const L = (registros || []).filter((r) => r && r.nota != null && !Number.isNaN(Number(r.nota)))
    .sort((a, b) => a.n - b.n || (a.fecha || 0) - (b.fecha || 0) || String(a.actividad).localeCompare(String(b.actividad), 'es') || String(a.criterio).localeCompare(String(b.criterio), 'es', { numeric: true }));
  return [CABECERA_CRITERIOS, ...L.map((r) => [String(r.n).padStart(2, '0'), String(r.actividad ?? ''), fechaISO(r.fecha), fmtNota(Math.max(0, Math.min(10, Number(r.nota)))), String(r.criterio ?? '')])];
}

// Analítica de un examen. entregas: [{ respuestas, detalle? }] (detalle = nota ya puesta por el profesor,
// que manda sobre la corrección automática). Devuelve el % de acierto de cada pregunta y de cada criterio,
// ordenados de menor a mayor, y las preguntas más falladas.
export function analizarExamen(preguntas, claves, entregas) {
  const P = preguntas || []; const E = (entregas || []).filter(Boolean);
  const Q = P.map((q) => ({ id: q.id, tipo: q.tipo, enunciado: String(q.enunciado || ''), criterio: q.criterio || SIN_CRITERIO, puntos: ptsDe(q), suma: 0, fallos: 0, blanco: 0 }));
  for (const e of E) {
    const auto = corregirExamen(P, claves || {}, e.respuestas || {}).detalle;
    Q.forEach((q) => {
      const got = e.detalle && q.id in e.detalle ? Number(e.detalle[q.id]) || 0 : auto[q.id] || 0;
      const f = Math.max(0, Math.min(1, got / q.puntos)); q.suma += f; if (f < 1) q.fallos++;
      const r = e.respuestas?.[q.id]; if (r == null || r === '' || (Array.isArray(r) && !r.some((x) => x != null && String(x).trim() !== ''))) q.blanco++;
    });
  }
  const n = E.length;
  const preg = Q.map((q, i) => ({ ...q, num: i + 1, pct: n ? redondea((q.suma / n) * 100, 1) : null }));
  const C = new Map();
  preg.forEach((q) => { const x = C.get(q.criterio) || { criterio: q.criterio, got: 0, max: 0, preguntas: 0 }; x.got += q.suma * q.puntos; x.max += n * q.puntos; x.preguntas++; C.set(q.criterio, x); });
  const criterios = [...C.values()].map((x) => ({ criterio: x.criterio, preguntas: x.preguntas, pct: x.max ? redondea((x.got / x.max) * 100, 1) : null }));
  const orden = (a, b) => (a.pct ?? 101) - (b.pct ?? 101) || (a.num ?? 0) - (b.num ?? 0) || String(a.criterio).localeCompare(String(b.criterio), 'es', { numeric: true });
  const porPregunta = [...preg].sort(orden);
  return { n, porPregunta, porCriterio: criterios.sort(orden), masFalladas: n ? porPregunta.filter((q) => q.pct < 100).slice(0, 5) : [] };
}

// Ajustes del profesor en la corrección de un examen («Dar por válida», puntos a mano, deshacer).
// Se guardan DENTRO de notas/{id}.detalle (campo que ya existe y que las reglas actuales permiten), con claves nuevas
// que ningún otro código usa:
//   detalle['aj:' + idPregunta] = { a: puntos automáticos que tenía, p: puntos puestos, f: fecha }
//   detalle['aj:_']             = { nota0: nota antes del primer ajuste (o null), pub0: publicada antes, creada: true si
//                                   el documento de nota no existía: al deshacerlo todo queda la nota automática }
// detalle[idPregunta] sigue siendo «los puntos de esa pregunta» (como siempre): el ajuste solo cambia ese número.
// Las respuestas del alumno (trabajos/{id}) no se tocan nunca. Sin ajustes, todo es exactamente como antes.
import { corregirExamen, redondea } from './modelo.js';

export const AJ = 'aj:';
export const AJ_META = 'aj:_';
export const esClaveAjuste = (k) => String(k).startsWith(AJ);
export const ajustesDe = (det) => Object.keys(det || {}).filter((k) => esClaveAjuste(k) && k !== AJ_META).map((k) => k.slice(AJ.length));
export const ajusteDe = (det, qid) => (det || {})[AJ + qid] || null;
export const tieneAjustes = (det) => ajustesDe(det).length > 0;
export const soloAjustes = (det) => Object.fromEntries(Object.entries(det || {}).filter(([k]) => esClaveAjuste(k)));

const maxDe = (q) => (Number(q?.puntos) > 0 ? Number(q.puntos) : 1);
const manualDe = (P, det) => { const m = {}; (P || []).forEach((q) => { if (det[q.id] != null && typeof det[q.id] !== 'object') m[q.id] = det[q.id]; }); return m; };

// Calcula el documento de nota tras ajustar (puntos = número) o deshacer (puntos = null) la pregunta qid.
// ex: { preguntas, claves, respuestas, s }; nt: documento de nota actual (o null); base: campos fijos del documento.
// Devuelve { datos } (el documento completo a guardar con setDoc) o { error }.
export function calcularAjuste(ex, nt, qid, puntos, ahora = Date.now()) {
  const P = ex.preguntas || []; const q = P.find((x) => x.id === qid); if (!q) return { error: 'La pregunta no existe' };
  const ctx = ex.s != null ? { s: ex.s } : {};
  const pura = corregirExamen(P, ex.claves || {}, ex.respuestas || {}, {}, ctx); // corrección automática, sin nada a mano
  const det = { ...(nt?.detalle || {}) };
  if (!nt || !P.some((x) => x.id in det && typeof det[x.id] !== 'object')) P.forEach((x) => { if (!(x.id in det)) det[x.id] = pura.detalle[x.id]; });
  const antes = corregirExamen(P, ex.claves || {}, ex.respuestas || {}, manualDe(P, det), ctx);
  const meta = det[AJ_META] || null; const aj = det[AJ + qid] || null;
  if (puntos == null) {
    if (!aj) return { error: 'Esa pregunta no está ajustada' };
    det[qid] = aj.a; delete det[AJ + qid];
  } else {
    const p = Math.max(0, Math.min(maxDe(q), redondea(Number(puntos) || 0, 4)));
    if (!meta) det[AJ_META] = { nota0: nt?.nota ?? null, pub0: !!nt?.publicada, creada: !nt };
    det[AJ + qid] = { a: aj ? aj.a : (antes.detalle[qid] ?? pura.detalle[qid] ?? 0), p, f: ahora };
    det[qid] = p;
  }
  const desp = corregirExamen(P, ex.claves || {}, ex.respuestas || {}, manualDe(P, det), ctx);
  let nota; let publicada = !!nt?.publicada;
  if (!ajustesDe(det).length) {
    // sin ajustes: vuelve exactamente lo de antes del primer ajuste
    const m = det[AJ_META]; delete det[AJ_META];
    nota = m && !m.creada ? m.nota0 : desp.nota; // si la nota la creó el ajuste, vuelve la automática
  } else if (nt?.nota == null) nota = desp.nota;
  else nota = redondea(Math.max(0, Math.min(10, nt.nota + (desp.nota - antes.nota)))); // conserva lo puesto a mano
  return { datos: { nota, puntos: desp.puntos, max: desp.max, detalle: det, publicada }, auto: pura, antes, despues: desp };
}

// Respuesta normalizada para comparar entre alumnos («Dar por válida para todos»).
export const claveRespuesta = (v) => (v == null ? null : typeof v === 'string' ? v.trim().toLowerCase().replace(/\s+/g, ' ') : JSON.stringify(v));

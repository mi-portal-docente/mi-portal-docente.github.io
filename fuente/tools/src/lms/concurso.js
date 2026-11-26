// Concurso de laboratorios: puntos de cada alumno (nº de lista) en Circuitos y Vivienda, y clasificación del grupo.
// Módulo puro (sin DOM ni Firebase): lo usan el panel del profesor (con las entregas de todos), el alumno (con las suyas,
// para publicar su resumen) y las pruebas. Solo hay números: nunca nombres, correos ni códigos.
//   Circuitos: 1 punto por práctica guiada completada + 1 por la autónoma (la autónoma cuenta también como guiada).
//   Vivienda:  igual, con el registro del alumno (entrega v6).
import { PRACTICES } from '../circ/practices.js';
import { idAutonoma } from '../circ/evaluaciones.js';
import { VIV_PR, VIV_REGISTRO, progresoRegistro } from '../viv/indice.js';

export const N_CIRC = PRACTICES.length, N_VIV = VIV_PR.length;
export const MAX_CIRC = N_CIRC * 2, MAX_VIV = N_VIV * 2, MAX_TOTAL = MAX_CIRC + MAX_VIV;
export const LABS = [['general', 'General'], ['circ', 'Circuitos'], ['viv', 'Vivienda']];

const ent = (n, max) => { n = Math.round(Number(n)); return Number.isFinite(n) ? Math.min(max, Math.max(0, n)) : 0; };

// entregas: iterable de entregas de UN alumno ({practica, datos}). Devuelve {cg, ca, vg, va}: guiadas y autónomas
// completadas en Circuitos (c*) y en Vivienda (v*). Una autónoma completada cuenta también como guiada.
export function resumenAlumno(entregas) {
  const ok = new Set(); let reg = null;
  for (const e of entregas || []) {
    if (!e) continue;
    if (e.datos?.comprobacion?.ok) ok.add(e.practica);
    if (e.practica === VIV_REGISTRO) reg = progresoRegistro(e);
  }
  let cg = 0, ca = 0, vg = 0, va = 0;
  for (const p of PRACTICES) { const a = ok.has(idAutonoma(p.id)); if (a || ok.has(p.id)) cg++; if (a) ca++; }
  for (const p of VIV_PR) { const m = reg?.[p.id]; const a = !!m?.autonoma; if (a || m?.guiada) vg++; if (a) va++; }
  return { cg, ca, vg, va };
}
// Resumen leído de un documento de clasificación (se sanea: enteros dentro de los límites)
export const sanear = (d) => ({ cg: ent(d?.cg, N_CIRC), ca: ent(d?.ca, N_CIRC), vg: ent(d?.vg, N_VIV), va: ent(d?.va, N_VIV) });
export const puntosCirc = (r) => r.cg + r.ca;
export const puntosViv = (r) => r.vg + r.va;
export const puntosDe = (r, lab) => lab === 'circ' ? puntosCirc(r) : lab === 'viv' ? puntosViv(r) : puntosCirc(r) + puntosViv(r);
export const maxDe = (lab) => lab === 'circ' ? MAX_CIRC : lab === 'viv' ? MAX_VIV : MAX_TOTAL;
export const iguales = (a, b) => a.cg === b.cg && a.ca === b.ca && a.vg === b.vg && a.va === b.va;

// filas: [{numero, cg, ca, vg, va}] → filas con puntos y puesto de este laboratorio, de más a menos puntos.
// pct = % del máximo del laboratorio; rel = % respecto al primero (para la longitud de las barras). Empates: mismo puesto (1, 1, 3…); dentro del empate, por nº de lista. Quien tiene 0 puntos no entra.
export function clasificar(filas, lab = 'general') {
  const L = (filas || []).map((f) => ({ numero: f.numero, ...sanear(f) })).map((f) => ({ ...f, pts: puntosDe(f, lab) })).filter((f) => f.pts > 0);
  L.sort((a, b) => b.pts - a.pts || a.numero - b.numero);
  let puesto = 0;
  L.forEach((f, i) => { if (i === 0 || f.pts !== L[i - 1].pts) puesto = i + 1; f.puesto = puesto; f.pct = Math.round((f.pts / maxDe(lab)) * 100); f.rel = Math.round((f.pts / L[0].pts) * 100); });
  return L;
}

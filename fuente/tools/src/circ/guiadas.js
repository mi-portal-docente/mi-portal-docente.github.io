// Prácticas guiadas que el profesor desbloquea una a una (módulo puro, probado en guiadas_test.mjs).
// Se guarda como un elemento más de la lista «apartados» del grupo (y de su código), que los alumnos ya
// reciben en directo: «guiadas:c1,c2,c13». Sin ese elemento, el grupo trabaja como siempre (todas abiertas).
// Así no hace falta cambiar las reglas de Firestore (apartados es una lista corta de textos).
export const PREFIJO = 'guiadas:';
export const esToken = (x) => typeof x === 'string' && x.startsWith(PREFIJO);
export function leerGuiadas(apartados) {
  const t = (Array.isArray(apartados) ? apartados : []).find(esToken);
  if (t == null) return null;
  return new Set(t.slice(PREFIJO.length).split(',').map((x) => x.trim()).filter((x) => /^[a-z0-9_-]{1,20}$/i.test(x)));
}
export function escribirGuiadas(apartados, ids) {
  const resto = (Array.isArray(apartados) ? apartados : []).filter((x) => !esToken(x));
  if (ids == null) return resto;
  return [...resto, PREFIJO + [...new Set(ids)].join(',')];
}
export const guiadaAbierta = (apartados, id) => { const s = leerGuiadas(apartados); return !s || s.has(id); };
export const sinTokens = (apartados) => (Array.isArray(apartados) ? apartados : []).filter((x) => !esToken(x) && !esTokenEv(x) && !(typeof x === 'string' && (x.startsWith('vivienda:') || x.startsWith('vivev:') || x.startsWith('union:'))));
// «Evaluación de circuitos»: los niveles (n1, n2…) van en otro token, «evaluacion:n1,n2». A diferencia de
// las prácticas guiadas, sin token están TODOS cerrados para los alumnos: el profesor abre cada nivel.
export const PREFIJO_EV = 'evaluacion:';
export const esTokenEv = (x) => typeof x === 'string' && x.startsWith(PREFIJO_EV);
export function leerEvaluaciones(apartados) {
  const t = (Array.isArray(apartados) ? apartados : []).find(esTokenEv);
  return new Set(t == null ? [] : t.slice(PREFIJO_EV.length).split(',').map((x) => x.trim()).filter((x) => /^[a-z0-9_-]{1,20}$/i.test(x)));
}
export function escribirEvaluaciones(apartados, ids) {
  const resto = (Array.isArray(apartados) ? apartados : []).filter((x) => !esTokenEv(x));
  const L = [...new Set(ids || [])]; return L.length ? [...resto, PREFIJO_EV + L.join(',')] : resto;
}
export const evaluacionAbierta = (apartados, id) => leerEvaluaciones(apartados).has(id);
// Candado rápido del profesor en la lista del laboratorio: abre o cierra UNA práctica guiada (cN, y con ella su
// autónoma aN) o un nivel de evaluación (nN) para un grupo. Usa los mismos tokens que el panel (Grupos →
// «Prácticas guiadas»), así los dos quedan sincronizados. Si el grupo aún no tenía el control de guiadas
// (todas abiertas), al cerrar una se activa con todas las demás abiertas.
export function alternarBloqueo(apartados, id, abrir, idsGuiadas, idsEval) {
  if (/^n\d+$/.test(id)) { const s = leerEvaluaciones(apartados); if (abrir) s.add(id); else s.delete(id); return escribirEvaluaciones(apartados, idsEval.filter((x) => s.has(x))); }
  const s0 = leerGuiadas(apartados); if (!s0 && abrir) return (Array.isArray(apartados) ? apartados : []).slice();
  const s = s0 ? new Set(s0) : new Set(idsGuiadas); if (abrir) s.add(id); else s.delete(id);
  return escribirGuiadas(apartados, idsGuiadas.filter((x) => s.has(x)));
}
// «Instalación de vivienda»: prácticas del tablero (vp1, vp2…) que el profesor abre una a una. Mismo criterio que
// las guiadas de Circuitos (sin token, todas abiertas), en su propio token «vivienda:vp1,vp2» de «apartados».
export const PREFIJO_VIV = 'vivienda:';
export const esTokenViv = (x) => typeof x === 'string' && x.startsWith(PREFIJO_VIV);
export function leerViv(apartados) {
  const t = (Array.isArray(apartados) ? apartados : []).find(esTokenViv);
  if (t == null) return null;
  return new Set(t.slice(PREFIJO_VIV.length).split(',').map((x) => x.trim()).filter((x) => /^[a-z0-9_-]{1,20}$/i.test(x)));
}
export function escribirViv(apartados, ids) {
  const resto = (Array.isArray(apartados) ? apartados : []).filter((x) => !esTokenViv(x));
  if (ids == null) return resto;
  return [...resto, PREFIJO_VIV + [...new Set(ids)].join(',')];
}
export const vivAbierta = (apartados, id) => { const s = leerViv(apartados); return !s || s.has(id); };
export function alternarViv(apartados, id, abrir, ids) {
  const s0 = leerViv(apartados); if (!s0 && abrir) return (Array.isArray(apartados) ? apartados : []).slice();
  const s = s0 ? new Set(s0) : new Set(ids); if (abrir) s.add(id); else s.delete(id);
  return escribirViv(apartados, ids.filter((x) => s.has(x)));
}
// «Evaluación de vivienda»: niveles ve1, ve2… en el token «vivev:ve1,ve2». Como en «Evaluación de circuitos», sin token
// están TODOS cerrados para los alumnos: el profesor abre cada nivel cuando toca el examen.
export const PREFIJO_VIVEV = 'vivev:';
export const esTokenVivEv = (x) => typeof x === 'string' && x.startsWith(PREFIJO_VIVEV);
export function leerVivEv(apartados) {
  const t = (Array.isArray(apartados) ? apartados : []).find(esTokenVivEv);
  return new Set(t == null ? [] : t.slice(PREFIJO_VIVEV.length).split(',').map((x) => x.trim()).filter((x) => /^[a-z0-9_-]{1,20}$/i.test(x)));
}
export function escribirVivEv(apartados, ids) {
  const resto = (Array.isArray(apartados) ? apartados : []).filter((x) => !esTokenVivEv(x));
  const L = [...new Set(ids || [])]; return L.length ? [...resto, PREFIJO_VIVEV + L.join(',')] : resto;
}
export const vivEvAbierta = (apartados, id) => leerVivEv(apartados).has(id);
export function alternarVivEv(apartados, id, abrir, ids) { const s = leerVivEv(apartados); if (abrir) s.add(id); else s.delete(id); return escribirVivEv(apartados, ids.filter((x) => s.has(x))); }

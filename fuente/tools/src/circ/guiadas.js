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
export const sinTokens = (apartados) => (Array.isArray(apartados) ? apartados : []).filter((x) => !esToken(x) && !esTokenEv(x));
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

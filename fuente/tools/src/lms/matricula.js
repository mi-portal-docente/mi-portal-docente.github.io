// Matrícula por asignatura (PIP-11, parte C): un nº de lista de una clase puede estar de baja en UNA asignatura
// (p. ej. en Proyecto) y de alta en las demás (EEE). Por defecto todos están de alta en todo: sin marca no cambia nada.
// Lógica pura (sin Firebase ni DOM). La marca va en grupos/{id}.apartados y codigos/{código}.apartados, que ya admiten
// cualquier texto corto (sin reglas nuevas): «baja:<asignatura>:<nº>.<nº>…» (un texto por asignatura, nº separados por punto).
// El alumno ya lee su documento de código al entrar, así que filtra lo suyo; el profesor filtra sus listas.
// Nada se borra: las entregas, notas y exámenes del alumno se conservan; al dar de alta vuelve todo.
export const PREFIJO_BAJA = 'baja:';
export const esTokenBaja = (x) => typeof x === 'string' && x.startsWith(PREFIJO_BAJA);
const L = (v) => (Array.isArray(v) ? v : []);
const MAX_APARTADOS = 20; // límite de las reglas (listaCorta(apartados, 20))

// Map asignatura → Set de nº de lista de baja
export function leerBajas(apartados) {
  const m = new Map();
  for (const t of L(apartados)) {
    if (!esTokenBaja(t)) continue;
    const [, asig = '', nums = ''] = t.split(':'); if (!asig) continue;
    const s = m.get(asig) || new Set();
    nums.split('.').map(Number).filter((n) => Number.isInteger(n) && n >= 1 && n <= 99).forEach((n) => s.add(n));
    if (s.size) m.set(asig, s);
  }
  return m;
}
export function escribirBajas(apartados, mapa) {
  const resto = L(apartados).filter((x) => !esTokenBaja(x));
  const t = [...mapa].filter(([, s]) => s.size).sort(([a], [b]) => a.localeCompare(b)).map(([a, s]) => `${PREFIJO_BAJA}${a}:${[...s].sort((x, y) => x - y).join('.')}`);
  return [...resto, ...t];
}
export const estaDeBaja = (apartados, asig, n) => !!leerBajas(apartados).get(asig)?.has(Number(n));
// Pone (baja = true), quita (false) o invierte (undefined) la baja de un nº en una asignatura.
// Devuelve { apartados, baja } o { error }.
export function cambiarBaja(apartados, asig, n, baja) {
  n = Number(n); if (!asig || !(n >= 1 && n <= 99)) return { error: 'Asignatura o nº de lista no válidos.' };
  const m = leerBajas(apartados); const s = m.get(asig) || new Set(); const nueva = baja == null ? !s.has(n) : !!baja;
  if (nueva) s.add(n); else s.delete(n);
  s.size ? m.set(asig, s) : m.delete(asig);
  const ap = escribirBajas(apartados, m);
  if (ap.length > MAX_APARTADOS) return { error: 'Hay demasiadas marcas en esta clase.' };
  return { apartados: ap, baja: nueva };
}
// Asignaturas en las que este nº está de baja / asignaturas que sí ve.
export function bajasDe(apartados, n) { const o = []; for (const [a, s] of leerBajas(apartados)) if (s.has(Number(n))) o.push(a); return o; }
export function asignaturasEfectivas(asignaturas, apartados, n) { const b = new Set(bajasDe(apartados, n)); return L(asignaturas).filter((a) => !b.has(a)); }
// Nº de baja de una asignatura (para filtrar listas)
export const bajasEn = (apartados, asig) => leerBajas(apartados).get(asig) || new Set();
// Al quitar una asignatura de la clase se olvida su lista de bajas
export function sinAsignatura(apartados, asig) { const m = leerBajas(apartados); m.delete(asig); return escribirBajas(apartados, m); }
// Conserva las marcas de baja de las asignaturas que sigue teniendo la clase (para el formulario «Editar»).
export const conBajas = (apartados, previos, asignaturas) => {
  const m = leerBajas(previos); for (const a of [...m.keys()]) if (!L(asignaturas).includes(a)) m.delete(a);
  return escribirBajas(apartados, m);
};

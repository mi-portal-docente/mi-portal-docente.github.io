// Almacenamiento local del laboratorio de circuitos (módulo puro, probado en circ_almacen_test.mjs).
const LS = 'circ:v1:';
// Avance y montajes: cada identidad (profesor / nº de lista) tiene su propio espacio en este navegador.
// Las preferencias (pref:) son del navegador. Migración: los datos antiguos sin ámbito («circ:v1:auto:…») se
// los queda, una sola vez, la primera identidad que abre el laboratorio en este navegador; después se borran.
export function lsKey(k, amb) { return LS + (amb && !k.startsWith('pref:') ? 'u:' + amb + ':' : '') + k; }
export function migrarLegado(amb, ls) {
  if (!amb || !ls) return 0;
  const viejas = [];
  for (let i = 0; i < ls.length; i++) { const k = ls.key(i); if (k && k.startsWith(LS) && /^(auto|done|save|avr):/.test(k.slice(LS.length))) viejas.push(k); }
  let n = 0;
  for (const k of viejas) { const nueva = lsKey(k.slice(LS.length), amb); if (ls.getItem(nueva) == null) { ls.setItem(nueva, ls.getItem(k)); n++; } ls.removeItem(k); }
  return n;
}

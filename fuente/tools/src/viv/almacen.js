// Almacenamiento local de las prácticas y la evaluación de vivienda, como circ/almacen.js: cada identidad (profesor /
// nº de lista, PORTAL.ambito()) tiene su espacio en este navegador para «pr:…» y «evres:…». El resto (SA1, proyectos,
// modo libre, preferencias) sigue como estaba. Migración: los datos «pr:» y «evres:» sin ámbito se los queda, una sola
// vez, la primera identidad que abre el laboratorio en este navegador (así nadie pierde su avance). Probado en viv_eval_test.
export const LS_VIV = 'viv:v1:';
const conAmbito = (k) => /^(pr|evres):/.test(k);
export function lsKeyViv(k, amb) { return LS_VIV + (amb && conAmbito(k) ? 'u:' + amb + ':' : '') + k; }
export function migrarViv(amb, ls) {
  if (!amb || !ls) return 0; const viejas = [];
  for (let i = 0; i < ls.length; i++) { const k = ls.key(i); if (k && k.startsWith(LS_VIV) && conAmbito(k.slice(LS_VIV.length))) viejas.push(k); }
  let n = 0;
  for (const k of viejas) { const nueva = lsKeyViv(k.slice(LS_VIV.length), amb); if (ls.getItem(nueva) == null) { ls.setItem(nueva, ls.getItem(k)); n++; } ls.removeItem(k); }
  return n;
}
const ambito = () => { try { return (typeof window !== 'undefined' && window.PORTAL?.ambito?.()) || null; } catch (e) { return null; } };
let _amb;
function clave(k) { const a = ambito(); if (a !== _amb) { _amb = a; try { migrarViv(a, localStorage); } catch (e) { } } return lsKeyViv(k, a); }
export const leeViv = (k) => { try { return JSON.parse(localStorage.getItem(clave(k))); } catch (e) { return null; } };
export const guardaViv = (k, v) => { try { localStorage.setItem(clave(k), JSON.stringify(v)); } catch (e) { } };

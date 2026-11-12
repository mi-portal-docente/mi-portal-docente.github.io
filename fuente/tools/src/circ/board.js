// Geometría de la protoboard (unidades = 1 paso de 2,54 mm). Módulo puro (sin three.js).
export const COLS = 30;
export const BT = 3.4; // altura de la cara superior de la protoboard sobre la mesa
export const ROWZ = { tp: -8.5, tn: -7.5, a: -5.5, b: -4.5, c: -3.5, d: -2.5, e: -1.5, f: 1.5, g: 2.5, h: 3.5, i: 4.5, j: 5.5, bp: 7.5, bn: 8.5 };
export const RAILS = ['tp', 'tn', 'bp', 'bn'];
export const MAIN_ROWS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
export const BOARD_W = 33, BOARD_D = 20; // tamaño del cuerpo
export const colX = (c) => c - 15.5;
export const isRailCol = (c) => c >= 1 && c <= COLS && c % 6 !== 0;

export function parseHole(id) {
  const m = /^(tp|tn|bp|bn|[a-j])(\d{1,2})$/.exec(id); if (!m) return null;
  const row = m[1], col = +m[2];
  if (col < 1 || col > COLS) return null;
  if (RAILS.includes(row) && !isRailCol(col)) return null;
  return { row, col };
}
export const holeExists = (id) => !!parseHole(id);
export function holePos(id) { const h = parseHole(id); return h ? { x: colX(h.col), z: ROWZ[h.row] } : null; }
export function stripOf(id) {
  const h = parseHole(id); if (!h) return null;
  if (RAILS.includes(h.row)) return h.row;
  return h.col + ('abcde'.includes(h.row) ? 'T' : 'B');
}
// Agujero más cercano a (x, z) dentro de una tolerancia
const ZROWS = Object.entries(ROWZ);
export function holeAt(x, z, tol = 0.5) {
  const col = Math.round(x + 15.5);
  if (col < 1 || col > COLS || Math.abs(colX(col) - x) > tol) return null;
  for (const [row, rz] of ZROWS) if (Math.abs(rz - z) <= tol) { const id = row + col; return holeExists(id) ? id : null; }
  return null;
}
export function holesOfStrip(s) {
  const out = [];
  if (RAILS.includes(s)) { for (let c = 1; c <= COLS; c++) if (isRailCol(c)) out.push(s + c); return out; }
  const col = parseInt(s), rows = s.endsWith('T') ? 'abcde' : 'fghij';
  for (const r of rows) out.push(r + col);
  return out;
}
export function allHoles() {
  const out = [];
  for (const r of Object.keys(ROWZ)) for (let c = 1; c <= COLS; c++) { const id = r + c; if (holeExists(id)) out.push(id); }
  return out;
}
export function holeName(id) {
  const h = parseHole(id); if (!h) return id;
  const rail = { tp: 'carril + de arriba', tn: 'carril − de arriba', bp: 'carril + de abajo', bn: 'carril − de abajo' }[h.row];
  return rail ? `${rail} (col. ${h.col})` : `${h.row}${h.col}`;
}
export function stripName(s) {
  if (RAILS.includes(s)) return { tp: 'carril + de arriba', tn: 'carril − de arriba', bp: 'carril + de abajo', bn: 'carril − de abajo' }[s];
  return `columna ${parseInt(s)} (${s.endsWith('T') ? 'a–e' : 'f–j'})`;
}
// Rotación de un desplazamiento (en pasos) por r cuartos de vuelta, coherente con group.rotation.y = -r·π/2
export function rot(dx, dz, r) { r = ((r % 4) + 4) % 4; for (let i = 0; i < r; i++) [dx, dz] = [-dz, dx]; return [dx, dz]; }

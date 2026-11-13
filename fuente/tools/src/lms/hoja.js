// Fase 13 · Hoja de cálculo: motor de fórmulas propio (sin librerías), en castellano como en Excel/Calc:
//  =SUMA(A1:A5)  =PROMEDIO(B2:B9)  =SI(A1>=5; "Aprobado"; "Suspenso")  =CONTAR.SI(A1:A9; ">5")
//  =BUSCARV(D2; A2:B9; 2; FALSO)  y MIN, MAX, CONTAR, REDONDEAR, Y, O. Separador «;» (o «,» si no hay «;»),
//  coma decimal, + - * / ^ & = <> < > <= >=, referencias A1 / $A$1 y rangos A1:C3. Errores: #DIV/0!, #N/A,
//  #¿NOMBRE?, #VALOR!, #REF!, #CICLO!
export const MAX_FILAS = 100, MAX_COLS = 26;
export const letra = (c) => String.fromCharCode(65 + c);
export const nombreCelda = (f, c) => letra(c) + (f + 1);
export function parteCelda(ref) { const m = /^\$?([A-Z])\$?(\d{1,3})$/.exec(String(ref).toUpperCase()); if (!m) return null; const f = +m[2] - 1, c = m[1].charCodeAt(0) - 65; return f >= 0 && f < MAX_FILAS && c < MAX_COLS ? { f, c } : null; }
const ERR = (e) => ({ err: e });
const esErr = (v) => v && typeof v === 'object' && 'err' in v;
// Texto escrito en una celda (no fórmula) → número si lo parece («3,5», «1.000,5», «-2»), si no texto.
export function valorLiteral(s) {
  const t = String(s ?? '').trim(); if (t === '') return '';
  if (/^-?\d+(,\d+)?$/.test(t)) return Number(t.replace(',', '.'));
  if (/^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(t)) return Number(t.replace(/\./g, '').replace(',', '.'));
  if (/^-?\d*\.\d+$/.test(t)) return Number(t);
  if (/^(verdadero|falso)$/i.test(t)) return /^v/i.test(t);
  return t;
}
function tokens(src) {
  const sep = src.includes(';') ? ';' : ','; const T = []; let i = 0;
  while (i < src.length) {
    const ch = src[i];
    if (/\s/.test(ch)) { i++; continue; }
    if (ch === '"') { let j = i + 1, s = ''; while (j < src.length) { if (src[j] === '"' && src[j + 1] === '"') { s += '"'; j += 2; continue; } if (src[j] === '"') break; s += src[j++]; } if (j >= src.length) throw new Error('#VALOR!'); T.push({ t: 'str', v: s }); i = j + 1; continue; }
    const num = (sep === ';' ? /^\d+(?:[.,]\d+)?/ : /^\d+(?:\.\d+)?/).exec(src.slice(i));
    if (num) { T.push({ t: 'num', v: Number(num[0].replace(',', '.')) }); i += num[0].length; continue; }
    const rng = /^\$?[A-Za-z]\$?\d{1,3}:\$?[A-Za-z]\$?\d{1,3}/.exec(src.slice(i));
    if (rng) { T.push({ t: 'rng', v: rng[0].toUpperCase().replace(/\$/g, '') }); i += rng[0].length; continue; }
    const abs = /^\$[A-Za-z]\$?\d{1,3}(?![\w(])/.exec(src.slice(i));
    if (abs) { T.push({ t: 'ref', v: abs[0].toUpperCase().replace(/\$/g, '') }); i += abs[0].length; continue; }
    const id = /^[A-Za-zÁÉÍÓÚáéíóúÑñ_][A-Za-zÁÉÍÓÚáéíóúÑñ_.\d$]*/.exec(src.slice(i));
    if (id) { const w = id[0].toUpperCase(); i += w.length; if (/^\$?[A-Z]\$?\d{1,3}$/.test(w)) T.push({ t: 'ref', v: w.replace(/\$/g, '') }); else T.push({ t: 'id', v: w }); continue; }
    const op = /^(<=|>=|<>|[-+*/^&=<>()%])/.exec(src.slice(i));
    if (op) { T.push({ t: 'op', v: op[0] }); i += op[0].length; continue; }
    if (ch === sep) { T.push({ t: 'sep' }); i++; continue; }
    throw new Error('#VALOR!');
  }
  return T;
}
// Hoja: { celdas: { A1: 'texto o =fórmula' } } → evaluar(ref) con caché y detección de ciclos.
export function crearHoja(celdas = {}) {
  const C = { ...celdas }; let cache = new Map(); const pila = new Set();
  const H = {
    celdas: C,
    poner(ref, v) { if (v == null || v === '') delete C[ref]; else C[ref] = String(v); cache = new Map(); },
    valor(ref) {
      ref = String(ref).toUpperCase(); if (cache.has(ref)) return cache.get(ref);
      if (pila.has(ref)) return ERR('#CICLO!');
      const raw = C[ref]; let v;
      if (raw == null || raw === '') v = '';
      else if (String(raw).startsWith('=')) { pila.add(ref); try { v = evaluar(String(raw).slice(1), H); } catch (e) { v = ERR(/^#/.test(e.message) ? e.message : '#VALOR!'); } pila.delete(ref); }
      else v = valorLiteral(raw);
      cache.set(ref, v); return v;
    },
    rango(r) {
      const [a, b] = r.split(':').map(parteCelda); if (!a || !b) throw new Error('#REF!');
      const F = []; for (let f = Math.min(a.f, b.f); f <= Math.max(a.f, b.f); f++) { const fila = []; for (let c = Math.min(a.c, b.c); c <= Math.max(a.c, b.c); c++) fila.push(H.valor(nombreCelda(f, c))); F.push(fila); } return F;
    },
    texto(ref) { return mostrar(H.valor(ref)); },
  };
  return H;
}
export function mostrar(v) {
  if (esErr(v)) return v.err; if (v === '' || v == null) return ''; if (typeof v === 'boolean') return v ? 'VERDADERO' : 'FALSO';
  if (typeof v === 'number') { if (!Number.isFinite(v)) return '#NUM!'; return String(Math.round(v * 1e10) / 1e10).replace('.', ','); }
  return String(v);
}
const aNum = (v) => { if (esErr(v)) throw new Error(v.err); if (v === '' || v == null) return 0; if (typeof v === 'boolean') return v ? 1 : 0; if (typeof v === 'number') return v; const n = valorLiteral(v); if (typeof n === 'number') return n; throw new Error('#VALOR!'); };
const aBool = (v) => (typeof v === 'string' ? (() => { throw new Error('#VALOR!'); })() : !!aNum(v));
const plano = (L) => L.flat(Infinity);
const numeros = (args) => plano(args.map((a) => (a && a.rango ? a.rango.flat().filter((x) => typeof x === 'number' || esErr(x)) : [a]))).map(aNum);
function cumple(v, crit) {
  let op = '=', val = crit;
  if (typeof crit === 'string') { const m = /^(<=|>=|<>|<|>|=)?(.*)$/.exec(crit); op = m[1] || '='; val = valorLiteral(m[2]); }
  if (typeof val === 'number' && typeof v === 'number') return { '=': v === val, '<>': v !== val, '<': v < val, '>': v > val, '<=': v <= val, '>=': v >= val }[op];
  const a = String(v ?? '').toLowerCase(), b = String(val ?? '').toLowerCase();
  if (op === '=') return a === b; if (op === '<>') return a !== b; return false;
}
const FUNCIONES = {
  SUMA: (a) => numeros(a).reduce((s, x) => s + x, 0),
  PROMEDIO: (a) => { const L = numeros(a); if (!L.length) throw new Error('#DIV/0!'); return L.reduce((s, x) => s + x, 0) / L.length; },
  MIN: (a) => { const L = numeros(a); return L.length ? Math.min(...L) : 0; },
  MAX: (a) => { const L = numeros(a); return L.length ? Math.max(...L) : 0; },
  CONTAR: (a) => plano(a.map((x) => (x && x.rango ? x.rango : [x]))).filter((x) => typeof x === 'number').length,
  REDONDEAR: (a) => { const d = a.length > 1 ? aNum(a[1]) : 0; const p = 10 ** d; return Math.round(aNum(a[0]) * p) / p; },
  SI: (a) => (aBool(a[0]) ? (a.length > 1 ? a[1] : true) : (a.length > 2 ? a[2] : false)),
  Y: (a) => plano(a.map((x) => (x && x.rango ? x.rango : [x]))).every(aBool),
  O: (a) => plano(a.map((x) => (x && x.rango ? x.rango : [x]))).some(aBool),
  'CONTAR.SI': (a) => { if (!a[0]?.rango) throw new Error('#VALOR!'); return a[0].rango.flat().filter((v) => cumple(v, a[1])).length; },
  BUSCARV: (a) => {
    const R = a[1]?.rango; if (!R) throw new Error('#VALOR!'); const col = aNum(a[2]); if (col < 1 || col > R[0].length) throw new Error('#REF!');
    const exacto = a.length > 3 && !aBool(a[3]); const x = a[0];
    if (exacto) { const f = R.find((fila) => (typeof x === 'number' ? fila[0] === x : String(fila[0]).toLowerCase() === String(x).toLowerCase())); if (!f) throw new Error('#N/A'); return f[col - 1]; }
    let ult = null; for (const fila of R) { if (typeof fila[0] === 'number' && typeof x === 'number' ? fila[0] <= x : String(fila[0]).toLowerCase() <= String(x).toLowerCase()) ult = fila; else break; }
    if (!ult) throw new Error('#N/A'); return ult[col - 1];
  },
};
const ALIAS = { SUM: 'SUMA', AVERAGE: 'PROMEDIO', IF: 'SI', COUNTIF: 'CONTAR.SI', VLOOKUP: 'BUSCARV', COUNT: 'CONTAR', ROUND: 'REDONDEAR', AND: 'Y', OR: 'O' };
export const NOMBRES_FUNCIONES = Object.keys(FUNCIONES);
function evaluar(src, H) {
  const T = tokens(src); let i = 0;
  const ver = () => T[i]; const tomar = (t, v) => { const k = T[i]; if (!k || k.t !== t || (v && k.v !== v)) throw new Error('#VALOR!'); i++; return k; };
  const v = (x) => { if (x && x.rango) { if (x.rango.length === 1 && x.rango[0].length === 1) return x.rango[0][0]; throw new Error('#VALOR!'); } if (esErr(x)) throw new Error(x.err); return x; };
  function comparacion() { let a = concat(); while (ver()?.t === 'op' && ['=', '<>', '<', '>', '<=', '>='].includes(ver().v)) { const op = T[i++].v; const b = concat(); const x = v(a), y = v(b); const n = typeof x === 'number' && typeof y === 'number'; const A = n ? x : String(x).toLowerCase(), B = n ? y : String(y).toLowerCase(); a = { '=': A === B, '<>': A !== B, '<': A < B, '>': A > B, '<=': A <= B, '>=': A >= B }[op]; } return a; }
  function concat() { let a = suma(); while (ver()?.t === 'op' && ver().v === '&') { i++; a = mostrar(v(a)) + mostrar(v(suma())); } return a; }
  function suma() { let a = prod(); while (ver()?.t === 'op' && ['+', '-'].includes(ver().v)) { const op = T[i++].v; const b = prod(); a = op === '+' ? aNum(v(a)) + aNum(v(b)) : aNum(v(a)) - aNum(v(b)); } return a; }
  function prod() { let a = pot(); while (ver()?.t === 'op' && ['*', '/'].includes(ver().v)) { const op = T[i++].v; const b = pot(); if (op === '/') { const d = aNum(v(b)); if (d === 0) throw new Error('#DIV/0!'); a = aNum(v(a)) / d; } else a = aNum(v(a)) * aNum(v(b)); } return a; }
  function pot() { let a = un(); while (ver()?.t === 'op' && ver().v === '^') { i++; a = aNum(v(a)) ** aNum(v(un())); } return a; }
  function un() { if (ver()?.t === 'op' && ['-', '+'].includes(ver().v)) { const op = T[i++].v; const a = aNum(v(un())); return op === '-' ? -a : a; } let a = prim(); if (ver()?.t === 'op' && ver().v === '%') { i++; a = aNum(v(a)) / 100; } return a; }
  function prim() {
    const k = ver(); if (!k) throw new Error('#VALOR!');
    if (k.t === 'num' || k.t === 'str') { i++; return k.v; }
    if (k.t === 'ref') { i++; if (!parteCelda(k.v)) throw new Error('#REF!'); return H.valor(k.v); }
    if (k.t === 'rng') { i++; return { rango: H.rango(k.v) }; }
    if (k.t === 'op' && k.v === '(') { i++; const a = comparacion(); tomar('op', ')'); return a; }
    if (k.t === 'id') {
      i++; if (k.v === 'VERDADERO' || k.v === 'TRUE') return true; if (k.v === 'FALSO' || k.v === 'FALSE') return false;
      const nom = ALIAS[k.v] || k.v; const fn = FUNCIONES[nom]; if (!fn) throw new Error('#¿NOMBRE?');
      tomar('op', '('); const args = [];
      if (!(ver()?.t === 'op' && ver().v === ')')) { for (;;) { const a = comparacion(); args.push(a && a.rango ? a : v(a)); if (ver()?.t === 'sep') { i++; continue; } break; } }
      tomar('op', ')'); return fn(args);
    }
    throw new Error('#VALOR!');
  }
  const r = comparacion(); if (i < T.length) throw new Error('#VALOR!'); return v(r);
}
// Comprobaciones de los retos: [{ celda, valor?, tolerancia?, formula? ('SUMA'…), texto? }]
export function comprobarReto(H, reto) {
  return (reto.comprobar || []).every((k) => {
    const raw = String(H.celdas[String(k.celda).toUpperCase()] ?? ''); const val = H.valor(k.celda);
    if (k.formula && !(raw.startsWith('=') && new RegExp(`\\b${String(k.formula).replace('.', '\\.')}\\s*\\(`, 'i').test(raw))) return false;
    if (k.valor != null) {
      if (typeof k.valor === 'number') { if (typeof val !== 'number' || Math.abs(val - k.valor) > (k.tolerancia ?? 1e-6)) return false; }
      else if (String(mostrar(val)).trim().toLowerCase() !== String(k.valor).trim().toLowerCase()) return false;
    }
    return true;
  });
}
// Tabla dinámica sencilla: agrupa las filas del rango (1.ª fila = títulos) por una columna y resume otra.
export function tablaDinamica(H, { rango, fila, valor, op = 'SUMA' }) {
  const R = H.rango(rango); if (R.length < 2) return { cab: [], filas: [] };
  const cab = R[0].map(mostrar); const iF = typeof fila === 'number' ? fila : cab.indexOf(fila); const iV = typeof valor === 'number' ? valor : cab.indexOf(valor);
  if (iF < 0 || iV < 0) return { cab: [], filas: [] };
  const G = new Map(); for (const r of R.slice(1)) { const k = mostrar(r[iF]); if (k === '') continue; if (!G.has(k)) G.set(k, []); G.get(k).push(r[iV]); }
  const res = (L) => { const N = L.filter((x) => typeof x === 'number'); if (op === 'CONTAR') return L.filter((x) => x !== '').length; if (op === 'PROMEDIO') return N.length ? N.reduce((a, b) => a + b, 0) / N.length : 0; return N.reduce((a, b) => a + b, 0); };
  const filas = [...G.entries()].map(([k, L]) => [k, res(L)]);
  return { cab: [cab[iF], `${op === 'SUMA' ? 'Suma' : op === 'PROMEDIO' ? 'Promedio' : 'Cuenta'} de ${cab[iV]}`], filas, total: res([...G.values()].flat()) };
}
// Datos para un gráfico: rango con la 1.ª columna = etiquetas y el resto = series (1.ª fila = nombres si es texto)
export function datosGrafico(H, rango) {
  const R = H.rango(rango); if (!R.length) return null;
  const conCab = R[0].slice(1).some((x) => typeof x === 'string' && x !== '');
  const nombres = conCab ? R[0].slice(1).map(mostrar) : R[0].slice(1).map((_, i) => `Serie ${i + 1}`);
  const filas = conCab ? R.slice(1) : R;
  return { etiquetas: filas.map((f) => mostrar(f[0])), series: nombres.map((n, j) => ({ nombre: n, num: filas.some((f) => typeof f[j + 1] === 'number'), valores: filas.map((f) => (typeof f[j + 1] === 'number' ? f[j + 1] : 0)) })).filter((x) => x.num).map(({ num, ...x }) => x) }; // columnas de texto fuera
}
export function csvHoja(H, filas, cols) {
  const L = []; for (let f = 0; f < filas; f++) { const r = []; for (let c = 0; c < cols; c++) r.push(H.texto(nombreCelda(f, c))); L.push(r); }
  while (L.length && L[L.length - 1].every((x) => x === '')) L.pop();
  return L.map((r) => r.map((x) => (/[;"\n]/.test(x) ? `"${x.replace(/"/g, '""')}"` : x)).join(';')).join('\n');
}

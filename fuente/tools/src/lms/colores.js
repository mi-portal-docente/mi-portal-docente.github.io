// Bloque 4 · «Código de colores» (EEE, Tema 5): motor puro (sin DOM ni Firebase). Calcula el valor de una
// resistencia (4 y 5 bandas), un condensador o un inductor a partir de sus bandas, con las tablas EXACTAS del
// ejercicio de clase (EEE_EjercicioTema4-6_CodigoColores), valida los componentes del JSON con errores en
// castellano, genera componentes al azar y corrige «leer» (valor + unidad + tolerancia + tensión) y «pintar»
// (cada banda) con puntuación parcial. Nunca todo o nada.

export const COLORES = ['Negro', 'Marrón', 'Rojo', 'Naranja', 'Amarillo', 'Verde', 'Azul', 'Violeta', 'Gris', 'Blanco', 'Oro', 'Plata'];
// Color de cada banda en el dibujo
export const HEX = { Negro: '#111111', Marrón: '#7B3F00', Rojo: '#E31B1B', Naranja: '#F7931E', Amarillo: '#FFD700', Verde: '#1FA33A', Azul: '#1F5FD1', Violeta: '#8A2BE2', Gris: '#8C8C8C', Blanco: '#FFFFFF', Oro: '#C9A227', Plata: '#C0C0C0' };
const CIFRAS = { Negro: 0, Marrón: 1, Rojo: 2, Naranja: 3, Amarillo: 4, Verde: 5, Azul: 6, Violeta: 7, Gris: 8, Blanco: 9 };
// Multiplicador como potencia de 10 (Oro = 10^-1, Plata = 10^-2)
const MULT_9 = { Negro: 0, Marrón: 1, Rojo: 2, Naranja: 3, Amarillo: 4, Verde: 5, Azul: 6, Violeta: 7, Gris: 8, Blanco: 9 };
const MULT_R = { ...MULT_9, Oro: -1, Plata: -2 };
const TOL_R = { Marrón: 1, Rojo: 2, Verde: 0.5, Azul: 0.25, Violeta: 0.1, Gris: 0.05, Oro: 5, Plata: 10 };
const TOL_C = { Negro: 2, Marrón: 1, Rojo: 2, Verde: 5, Blanco: 10 };
const TEN_C = { Marrón: 100, Rojo: 250, Amarillo: 400, Azul: 630 };
const TOL_L = { ...Object.fromEntries(Object.keys(CIFRAS).map((c) => [c, 20])), Oro: 5, Plata: 10 };

// Columnas de la tabla de cada clase: [id, título, tabla color → valor]
const C1 = ['c1', '1.ª cifra', CIFRAS], C2 = ['c2', '2.ª cifra', CIFRAS], C3 = ['c3', '3.ª cifra', CIFRAS];
export const CLASES = {
  resistencia4: { nombre: 'Resistencia de 4 bandas', corto: 'resistencia', unidades: ['Ω', 'kΩ', 'MΩ'], base: 'Ω', columnas: [C1, C2, ['mult', 'Multiplicador', MULT_R], ['tol', 'Tolerancia', TOL_R]], sinTol: 20 },
  resistencia5: { nombre: 'Resistencia de 5 bandas', corto: 'resistencia', unidades: ['Ω', 'kΩ', 'MΩ'], base: 'Ω', columnas: [C1, C2, C3, ['mult', 'Multiplicador', MULT_R], ['tol', 'Tolerancia', TOL_R]], sinTol: 20 },
  condensador: { nombre: 'Condensador', corto: 'condensador', unidades: ['pF', 'nF', 'µF'], base: 'pF', columnas: [C1, C2, ['mult', 'Multiplicador', MULT_9], ['tol', 'Tolerancia', TOL_C], ['ten', 'Tensión', TEN_C]] },
  inductor: { nombre: 'Inductor (bobina)', corto: 'inductor', unidades: ['µH', 'mH', 'H'], base: 'µH', columnas: [C1, C2, ['mult', 'Multiplicador', MULT_R], ['tol', 'Tolerancia', TOL_L]] },
};
export const FACTOR = { 'Ω': 1, 'kΩ': 1e3, 'MΩ': 1e6, pF: 1, nF: 1e3, 'µF': 1e6, 'µH': 1, mH: 1e3, H: 1e6 };
const sinTilde = (s) => String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
// «marron», «MARRÓN», «Marrón» → «Marrón»
export function colorNormal(c) { const k = sinTilde(c); return COLORES.find((x) => sinTilde(x) === k) || null; }
export const fmtNum = (x) => { const r = Math.round(x * 1e6) / 1e6; const [e, d] = String(r).split('.'); return e.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + (d ? ',' + d : ''); };
export const fmtPct = (x) => `±${String(x).replace('.', ',')} %`;
// Celda de la tabla (×1 000, ±5 %, 250 V, 7…)
export function textoCelda(col, v) {
  if (v == null) return '—';
  if (col === 'mult') return '×' + fmtNum(10 ** v);
  if (col === 'tol') return fmtPct(v);
  if (col === 'ten') return v + ' V';
  return String(v);
}

// Número de bandas aceptadas por clase
const NB = { resistencia4: [3, 4], resistencia5: [4, 5], condensador: [5], inductor: [4] };
// Columnas que tocan a cada banda (con 3 bandas en la de 4, o 4 en la de 5, falta la tolerancia → ±20 %)
export function columnasDe(clase, n) { const C = CLASES[clase].columnas; return n < C.length && CLASES[clase].sinTol != null ? C.slice(0, n) : C; }

// Valor de un componente: { cifras, exp, valor (en la unidad base), tol, ten, unidadBase }
export function calcular(clase, bandas) {
  const K = CLASES[clase]; const cols = columnasDe(clase, bandas.length);
  let cifras = ''; let exp = 0; let tol = K.sinTol ?? null; let ten = null;
  cols.forEach(([id, , T], i) => { const v = T[bandas[i]]; if (id.startsWith('c')) cifras += v; else if (id === 'mult') exp = v; else if (id === 'tol') tol = v; else if (id === 'ten') ten = v; });
  const valor = Number(cifras) * 10 ** exp;
  return { cifras, exp, valor: Math.round(valor * 1e6) / 1e6, tol, ten, unidadBase: K.base };
}
// Mejor unidad para mostrar (1 ≤ número < 1000 si se puede)
export function enUnidad(clase, valor) {
  const U = CLASES[clase].unidades; let u = U[0];
  for (const x of U) if (valor >= FACTOR[x]) u = x;
  return { n: Math.round((valor / FACTOR[u]) * 1e6) / 1e6, u };
}
export function textoValor(clase, bandas) {
  const r = calcular(clase, bandas); const { n, u } = enUnidad(clase, r.valor);
  return `${fmtNum(n)} ${u}${r.tol != null ? ' ' + fmtPct(r.tol) : ''}${r.ten != null ? ' · ' + r.ten + ' V' : ''}`;
}

// Valida un componente del JSON. err(ruta, texto). Devuelve { id, clase, bandas } o null.
export function validarComponente(c, i, err, ruta = `componentes[${i}]`) {
  const nom = c && c.id ? `Componente ${c.id}` : `Componente ${i + 1}`;
  if (!c || typeof c !== 'object') { err(ruta, `${nom}: tiene que ser un objeto { "id": "R1", "clase": "resistencia4", "bandas": [ … ] }.`); return null; }
  const K = CLASES[c.clase];
  if (!K) { err(ruta + '.clase', `${nom}: «clase» tiene que ser ${Object.keys(CLASES).map((x) => `"${x}"`).join(', ')}.`); return null; }
  if (!Array.isArray(c.bandas) || !NB[c.clase].includes(c.bandas.length)) { err(ruta + '.bandas', `${nom}: una ${K.nombre.toLowerCase()} lleva ${NB[c.clase].join(' o ')} bandas.`); return null; }
  const cols = columnasDe(c.clase, c.bandas.length); const bandas = [];
  for (const [j, b] of c.bandas.entries()) {
    const col = colorNormal(b);
    if (!col) { err(`${ruta}.bandas[${j}]`, `${nom}: «${b}» no es un color. Usa: ${COLORES.join(', ')}.`); return null; }
    const [, tit, T] = cols[j];
    if (T[col] == null) { err(`${ruta}.bandas[${j}]`, `${nom}: el color ${col} no tiene valor como ${tit.toLowerCase()} (banda ${j + 1}) en ${K.nombre.toLowerCase()}. Mira la tabla.`); return null; }
    bandas.push(col);
  }
  const id = c.id != null && /^[\w.-]{1,20}$/.test(String(c.id)) ? String(c.id) : null;
  return { ...(id ? { id } : {}), clase: c.clase, bandas };
}

// Generador pseudoaleatorio con semilla (para «aleatorio»: n componentes de cada clase, distintos en cada intento)
export function rnd(seed) { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
const elige = (r, L) => L[Math.floor(r() * L.length)];
const RANGO_MULT = { resistencia4: ['Oro', 'Negro', 'Marrón', 'Rojo', 'Naranja', 'Amarillo', 'Verde'], resistencia5: ['Oro', 'Negro', 'Marrón', 'Rojo', 'Naranja', 'Amarillo'], condensador: ['Negro', 'Marrón', 'Rojo', 'Naranja', 'Amarillo', 'Verde'], inductor: ['Oro', 'Negro', 'Marrón', 'Rojo', 'Naranja'] };
export function aleatorios(clase, n, seed) {
  const r = rnd(seed); const L = []; const vistos = new Set(); const D = Object.keys(CIFRAS);
  for (let k = 0; L.length < n && k < n * 20; k++) {
    const cols = CLASES[clase].columnas; const b = cols.map(([id, , T]) => (id === 'c1' ? elige(r, D.slice(1)) : id.startsWith('c') ? elige(r, D) : id === 'mult' ? elige(r, RANGO_MULT[clase]) : elige(r, Object.keys(T))));
    const key = b.join('-'); if (vistos.has(key)) continue; vistos.add(key);
    L.push({ id: `${clase === 'condensador' ? 'C' : clase === 'inductor' ? 'L' : 'R'}${L.length + 1}`, clase, bandas: b });
  }
  return L;
}

// ---- Corrección. Respuesta «leer»: { v: '4,7', u: 'kΩ', t: '5', te: '250' }; «pintar»: { b: ['Amarillo', …] }
const numero = (x) => { if (x == null || String(x).trim() === '') return null; const v = Number(String(x).trim().replace(/\s/g, '').replace(',', '.')); return Number.isFinite(v) ? v : null; };
const sig = (x) => { if (!(x > 0)) return ''; return x.toPrecision(12).replace(/e.*$/, '').replace('.', '').replace(/^0+/, '').replace(/0+$/, ''); };
const igual = (a, b) => Math.abs(a - b) <= Math.max(1e-9, Math.abs(b) * 1e-9);
// Partes que se puntúan (en «leer»): cifras, valor con su unidad, tolerancia y (condensador) tensión
export function partesLeer(clase, bandas, r) {
  const ok = calcular(clase, bandas); const x = numero(r?.v); const f = FACTOR[r?.u];
  const P = [
    { id: 'cifras', nombre: 'Cifras', ok: x != null && sig(x) === sig(ok.valor) },
    { id: 'valor', nombre: 'Valor y unidad', ok: x != null && f != null && CLASES[clase].unidades.includes(r.u) && igual(x * f, ok.valor) },
    { id: 'tol', nombre: 'Tolerancia', ok: numero(r?.t) != null && igual(numero(r.t), ok.tol) },
  ];
  if (ok.ten != null) P.push({ id: 'ten', nombre: 'Tensión', ok: numero(r?.te) != null && igual(numero(r.te), ok.ten) });
  return P;
}
export function bandasOk(clase, bandas, r) {
  const B = Array.isArray(r?.b) ? r.b.map(colorNormal) : [];
  // si las bandas pintadas dan el mismo valor (y tolerancia y tensión), todo bien aunque se haya elegido otra combinación
  const cols = columnasDe(clase, bandas.length);
  if (B.length === bandas.length && B.every((c, i) => c && cols[i][2][c] != null)) {
    const a = calcular(clase, bandas); const b = calcular(clase, B);
    if (igual(a.valor, b.valor) && a.tol === b.tol && a.ten === b.ten) return bandas.map(() => true);
  }
  return bandas.map((c, i) => B[i] === c);
}
export function corregirColores(q, clave, r) {
  const bandas = clave?.bandas || q.bandas; const clase = q.clase; if (!CLASES[clase] || !Array.isArray(bandas) || !r || typeof r !== 'object') return 0;
  const L = q.modo === 'pintar' ? bandasOk(clase, bandas, r) : partesLeer(clase, bandas, r).map((p) => p.ok);
  return L.filter(Boolean).length / L.length;
}
// Opciones de los desplegables de tolerancia y tensión
export const tolerancias = (clase) => [...new Set([...Object.values(CLASES[clase].columnas.find((c) => c[0] === 'tol')[2]), ...(CLASES[clase].sinTol != null ? [CLASES[clase].sinTol] : [])])].sort((a, b) => a - b);
export const tensiones = (clase) => { const c = CLASES[clase].columnas.find((x) => x[0] === 'ten'); return c ? [...new Set(Object.values(c[2]))].sort((a, b) => a - b) : []; };

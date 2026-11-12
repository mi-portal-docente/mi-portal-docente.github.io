// Laboratorio «Instalación de vivienda»: piezas, bornes, tubos, cables, solución del tablero de la SA1
// y lista de materiales. Todo en centímetros sobre un tablero de madera (por defecto 120 × 80 cm; x → derecha, y ↑ arriba).
// Sin dependencias del navegador: se prueba con node (tools/viv_modelo_test.mjs).
import { CIRCUITOS, CALIBRES, CALIBRES_IGA, CALIBRES_ID, CAJAS, FICHAS, BORNES, SECCIONES, TUBOS, GRAPA_MAX } from './catalogo.js';
export { SECCIONES };
export const TABLERO = { w: 120, h: 80 };
export const TAMANOS_TABLERO = [[100, 70], [120, 80], [150, 100]];
export const dims = (m) => (m && m.tablero ? m.tablero : TABLERO);
export const COLORES = {
  marron: { n: 'Marrón', hex: '#7a4a22', clase: 'fase' },
  negro: { n: 'Negro', hex: '#1d1d1d', clase: 'fase' },
  gris: { n: 'Gris', hex: '#8f969c', clase: 'fase' },
  azul: { n: 'Azul', hex: '#1f5fd6', clase: 'neutro' },
  tierra: { n: 'Amarillo-verde', hex: '#3fae2a', clase: 'tierra', raya: '#f2d21b' },
};
export const fmtSec = (s) => String(s).replace('.', ',') + ' mm²';
// Corriente máxima que admite cada sección en la vivienda (la del magnetotérmico que la protege, ITC-BT-25)
export const ADMISIBLE = { 1.5: 10, 2.5: 16, 4: 20, 6: 25 };
// Carril DIN del cuadro: 12 módulos de 1,8 cm (18 mm)
export const MODULO = 1.8, MODULOS = 12;
export const ZT = 2.6, ZMOD = 6.6; // altura de los bornes (piezas sobre el tablero · aparamenta del cuadro)

const mec = (extra) => ({ w: 8.4, h: 8.4, cat: 'Receptores y mecanismos', borne: 'mecanismo', ...extra });
export const TIPOS = {
  cuadro: { nombre: 'Cuadro de distribución (12 módulos)', corto: 'Cuadro', icon: '🗄️', w: 30, h: 24, unico: true, cat: 'Cuadro y acometida', ref: 'cuadro',
    desc: 'Caja de superficie con carril DIN de 12 módulos para el IGA, el diferencial y los magnetotérmicos, y la barra de tierra (PE).', term: [['PE', 12, 8.6, 'Barra de tierra']] },
  iga: { nombre: 'Interruptor general automático (IGA)', corto: 'IGA', icon: '🟥', modulo: true, mods: 2, unico: true, In: 25, cat: 'Cuadro y acometida', ref: 'iga', opcional: true,
    desc: 'Protege toda la instalación contra sobrecargas y cortocircuitos. En una vivienda, 25 A como mínimo.', term: [] },
  id: { nombre: 'Interruptor diferencial ID 30 mA', corto: 'ID 30 mA', icon: '🟦', modulo: true, mods: 2, unico: true, In: 40, cat: 'Cuadro y acometida', ref: 'id',
    desc: 'Corta toda la instalación si se escapa a tierra más de 30 mA (protege a las personas). Botón T = prueba.', term: [] },
  mt10: { nombre: 'Magnetotérmico C1 10 A (alumbrado)', corto: 'C1 10 A', icon: '⬛', modulo: true, mods: 1, In: 10, circ: 'C1', cat: 'Cuadro y acometida', ref: 'mt', unico: true,
    desc: 'Protege el circuito de alumbrado contra sobrecargas y cortocircuitos. Cable de 1,5 mm².', term: [['L', -0.45, -3.4, 'Salida fase'], ['N', 0.45, -3.4, 'Salida neutro']] },
  mt16: { nombre: 'Magnetotérmico C2 16 A (enchufes)', corto: 'C2 16 A', icon: '⬛', modulo: true, mods: 1, In: 16, circ: 'C2', cat: 'Cuadro y acometida', ref: 'mt', unico: true,
    desc: 'Protege el circuito de enchufes. Cable de 2,5 mm².', term: [['L', -0.45, -3.4, 'Salida fase'], ['N', 0.45, -3.4, 'Salida neutro']] },
  mt: { nombre: 'Magnetotérmico 1P+N (elige calibre y curva)', corto: 'Magnetotérmico', icon: '⬛', modulo: true, mods: 1, In: 16, circ: 'C2', cat: 'Cuadro y acometida', ref: 'mt',
    desc: 'Magnetotérmico de 1 módulo: elige el calibre (6–32 A), la curva (B o C) y el circuito (C1–C5).', term: [['L', -0.45, -3.4, 'Salida fase'], ['N', 0.45, -3.4, 'Salida neutro']] },
  manguera: { nombre: 'Manguera de 3 hilos con clavija', corto: 'Manguera', icon: '🔌', unico: true, cat: 'Cuadro y acometida', ref: 'manguera',
    desc: 'Lleva la fase, el neutro y la tierra del enchufe del aula al cuadro. Solo la enchufa el profesor.', term: [] },
  bombilla: { nombre: 'Bombilla con portalámparas (60 W)', corto: 'Bombilla', icon: '💡', w: 9, h: 9, cat: 'Receptores y mecanismos', pref: 'Bombilla', borne: 'portalamparas', ref: 'bombilla',
    desc: 'Portalámparas E27 con bombilla de 60 W: borne de fase (L) y de neutro (N).', term: [['L', -2, -5.4, 'Fase'], ['N', 2, -5.4, 'Neutro']] },
  interruptor: mec({ nombre: 'Interruptor', corto: 'Interruptor', icon: '🔘', pref: 'Interruptor', ref: 'interruptor',
    desc: 'Corta la FASE de la bombilla. Dos bornes: entrada L (1) y salida al punto de luz (2).', term: [['1', -2, 4.8, 'Entrada (L)'], ['2', 2, 4.8, 'Salida']] }),
  conmutador: mec({ nombre: 'Conmutador', corto: 'Conmutador', icon: '🔀', pref: 'Conmutador', opcional: true, ref: 'conmutador',
    desc: 'Para encender una luz desde dos sitios: común (L) y dos viajeros (1 y 2).', term: [['C', 0, 4.8, 'Común (L)'], ['1', -2.6, 4.8, 'Viajero 1'], ['2', 2.6, 4.8, 'Viajero 2']] }),
  cruzamiento: mec({ nombre: 'Cruzamiento', corto: 'Cruzamiento', icon: '✖️', pref: 'Cruzamiento', opcional: true, ref: 'cruzamiento',
    desc: 'Entre dos conmutadores, para encender desde tres sitios. Une 1-3 y 2-4, o 1-4 y 2-3.', term: [['1', -2.6, 4.8, 'Entrada 1'], ['2', -0.9, 4.8, 'Entrada 2'], ['3', 0.9, 4.8, 'Salida 3'], ['4', 2.6, 4.8, 'Salida 4']] }),
  pulsador: mec({ nombre: 'Pulsador', corto: 'Pulsador', icon: '🔔', pref: 'Pulsador', opcional: true, ref: 'pulsador',
    desc: 'Solo cierra mientras lo pulsas (timbre, luz de escalera).', term: [['1', -2, 4.8, 'Entrada (L)'], ['2', 2, 4.8, 'Salida']] }),
  enchufe: mec({ nombre: 'Enchufe con toma de tierra (16 A)', corto: 'Enchufe', icon: '🔌', pref: 'Enchufe', ref: 'enchufe',
    desc: 'Base Schuko 2P+T: fase (L), neutro (N) y tierra (⏚).', term: [['L', -2.6, 4.8, 'Fase'], ['PE', 0, 5.4, 'Tierra'], ['N', 2.6, 4.8, 'Neutro']] }),
  enchufe2: mec({ nombre: 'Enchufe doble con toma de tierra (2 × 16 A)', corto: 'Enchufe doble', icon: '🔌', pref: 'Enchufe doble', ref: 'enchufe', opcional: true, w: 15.5,
    desc: 'Dos bases Schuko en un marco doble, puenteadas por dentro: una sola entrada de fase (L), neutro (N) y tierra (⏚) para las dos.', term: [['L', -2.6, 4.8, 'Fase'], ['PE', 0, 5.4, 'Tierra'], ['N', 2.6, 4.8, 'Neutro']] }),
  minutero: mec({ nombre: 'Minutero de escalera (temporizador)', corto: 'Minutero', icon: '⏱️', pref: 'Minutero', opcional: true, ref: 'minutero',
    desc: 'Automático de escalera: al pulsar cualquier pulsador (borne 3) enciende la luz (borne ↓) unos segundos y la apaga solo. Lleva fase (L) y neutro (N).', term: [['L', -2.7, 4.8, 'Fase'], ['N', -0.9, 4.8, 'Neutro'], ['3', 0.9, 4.8, 'Pulsadores'], ['4', 2.7, 4.8, 'Salida a la luz']] }),
  caja: { nombre: 'Caja de empalme (vacía, con fichas)', corto: 'Caja de empalme', icon: '⬜', w: 10, h: 10, cat: 'Canalización', pref: 'CE', ref: 'caja',
    desc: 'Caja vacía de superficie: dentro se empalman los cables con fichas (conectores de palanca, de inserción o regletas). Elige el tamaño y las fichas.', term: [] },
};
export const PALETA = ['cuadro', 'iga', 'id', 'mt10', 'mt16', 'mt', 'manguera', 'bombilla', 'interruptor', 'conmutador', 'cruzamiento', 'pulsador', 'minutero', 'enchufe', 'enchufe2', 'caja'];
export const CARGAS = [
  { id: 'nada', n: 'Nada enchufado' }, { id: 'l60', n: 'Lámpara 60 W', w: 60 }, { id: 'r2000', n: 'Radiador 2000 W', w: 2000 },
  { id: 'h3000', n: 'Horno 3000 W', w: 3000 }, { id: 'reg5000', n: 'Regleta: horno + radiador (5000 W)', w: 5000 },
  { id: 'fuga', n: 'Lavadora con fuga a la carcasa', w: 2000, fuga: true }, { id: 'corto', n: 'Aparato averiado (cortocircuito)', corto: true },
];

export const esEnchufe = (p) => !!p && (p.type === 'enchufe' || p.type === 'enchufe2');
export const esMecanismo = (p) => !!p && ['interruptor', 'conmutador', 'cruzamiento', 'pulsador', 'minutero', 'enchufe', 'enchufe2'].includes(p.type);
export const esMT = (p) => !!p && (p.type === 'mt10' || p.type === 'mt16' || p.type === 'mt');
export const amperios = (p) => (p ? +(p.In ?? TIPOS[p.type]?.In ?? 0) : 0);
export const circuitoDe = (p) => (p ? p.circ || TIPOS[p.type]?.circ || null : null);
export const curvaDe = (p) => (p && p.curva === 'B' ? 'B' : 'C');
export const nombreMT = (p) => `${circuitoDe(p) || 'MT'} ${amperios(p)} A`;

const clone = (o) => JSON.parse(JSON.stringify(o));
export const vacio = () => ({ v: 2, tablero: { ...TABLERO }, parts: [], tubos: [], cables: [] });
export const partePorId = (m, id) => m.parts.find((p) => p.id === id) || null;
// Grupo de canalización: los módulos y la manguera van dentro del cuadro
export function grupo(m, p) { if (typeof p === 'string') p = partePorId(m, p); if (!p) return null; return TIPOS[p.type].modulo || p.type === 'manguera' ? p.cuadro || null : p.id; }
export function tamCaja(p) { return CAJAS[p?.tam] ? +p.tam : 100; }
export function medidas(p) { const T = TIPOS[p.type]; if (p.type === 'caja') { const c = CAJAS[tamCaja(p)]; return { w: c.w, h: c.w }; } if (T.modulo) return { w: (T.mods || 1) * MODULO, h: 8.5 }; return { w: T.w || 6, h: T.h || 6 }; }
export function posParte(m, p) {
  if (typeof p === 'string') p = partePorId(m, p); if (!p) return null;
  const T = TIPOS[p.type];
  if (T.modulo) { const q = partePorId(m, p.cuadro); if (!q) return null; return { x: q.x - (MODULOS * MODULO) / 2 + ((p.slot ?? 0) + (T.mods || 1) / 2) * MODULO, y: q.y + 1 }; }
  if (p.type === 'manguera') { const q = partePorId(m, p.cuadro); return q ? { x: q.x - 15, y: q.y - 3 } : null; }
  return { x: p.x, y: p.y };
}
// Posiciones de las fichas dentro de una caja de empalme
export function posicionesCaja(tam) { const n = CAJAS[tam]?.pos || 6; return n === 4 ? [[-1.9, 1.6], [1.9, 1.6], [-1.9, -1.6], [1.9, -1.6]] : [[-2.9, 1.7], [0, 1.7], [2.9, 1.7], [-2.9, -1.7], [0, -1.7], [2.9, -1.7]]; }
// Cuadro «sin cablear» (p.cab): el alumno cablea la manguera, el IGA, el diferencial y los magnetotérmicos.
// Como en la aparamenta real: la ENTRADA va arriba (bornes 1 y N) y la SALIDA abajo (2 y N).
export function bornesCab(p) {
  if (p.type === 'manguera') return [{ t: 'L', dx: 2.6, dy: 6.2, n: 'Bornero de entrada · fase (marrón)' }, { t: 'N', dx: 2.6, dy: 4.6, n: 'Bornero de entrada · neutro (azul)' }, { t: 'PE', dx: 2.6, dy: 3.0, n: 'Bornero de entrada · tierra (amarillo-verde)' }];
  const d = (TIPOS[p.type].mods || 1) === 2 ? 0.9 : 0.45;
  return [{ t: 'Le', dx: -d, dy: 3.4, n: 'Entrada fase (borne 1, arriba)' }, { t: 'Ne', dx: d, dy: 3.4, n: 'Entrada neutro (borne N, arriba)' },
    { t: 'L', dx: -d, dy: -3.4, n: 'Salida fase (borne 2, abajo)' }, { t: 'N', dx: d, dy: -3.4, n: 'Salida neutro (borne N, abajo)' }];
}
export function bornes(p) {
  if (p.cab && (TIPOS[p.type].modulo || p.type === 'manguera')) return bornesCab(p);
  if (p.type === 'caja') return posicionesCaja(tamCaja(p)).map(([dx, dy], i) => { const t = 'B' + (i + 1); const f = FICHAS[p.fichas?.[t]]; return { t, dx, dy, n: f ? `Ficha ${i + 1} · ${f.corto}` : `Posición ${i + 1} (sin ficha)` }; });
  return TIPOS[p.type].term.map(([t, dx, dy, n]) => ({ t, dx, dy, n }));
}
export function posBorne(m, ref) {
  const p = partePorId(m, ref.p); if (!p) return null; const c = posParte(m, p); if (!c) return null;
  const b = bornes(p).find((x) => x.t === ref.t); return b ? { x: c.x + b.dx, y: c.y + b.dy } : null;
}
export function zBorne(m, ref) { const p = partePorId(m, ref.p); return p && TIPOS[p.type].modulo ? ZMOD : p?.type === 'caja' ? 1.6 : ZT; }
export function nombreBorne(m, ref) {
  const p = partePorId(m, ref.p); if (!p) return '?'; const b = bornes(p).find((x) => x.t === ref.t);
  return `${p.nombre || TIPOS[p.type].corto} · ${ref.t}${b ? ` (${b.n.toLowerCase()})` : ''}`;
}
// Tipo de borne de una conexión (cómo se pela y con qué se aprieta)
export function tipoBorne(m, ref) {
  const p = partePorId(m, ref.p); if (!p) return null;
  if (TIPOS[p.type].modulo) return 'aparamenta';
  if (p.type === 'manguera') return 'regleta';
  if (p.type === 'cuadro') return 'barraPE';
  if (p.type === 'caja') { const f = FICHAS[p.fichas?.[ref.t]]; return f ? f.kind : null; }
  return TIPOS[p.type].borne || 'mecanismo';
}
export const idealPelado = (m, ref) => BORNES[tipoBorne(m, ref)]?.ideal ?? 10;
export function ocupados(m, cuadroId, sin) { const s = new Set(); for (const p of m.parts) if (p.cuadro === cuadroId && TIPOS[p.type].modulo && p.id !== sin) for (let i = 0; i < (TIPOS[p.type].mods || 1); i++) s.add((p.slot ?? 0) + i); return s; }
export function slotLibre(m, cuadroId, type = 'mt') {
  const k = TIPOS[type]?.mods || 1; const u = ocupados(m, cuadroId);
  for (let s = 0; s + k <= MODULOS; s++) { let ok = true; for (let i = 0; i < k; i++) if (u.has(s + i)) ok = false; if (ok) return s; }
  return undefined;
}
export function siguienteNombre(m, type) {
  const pref = TIPOS[type].pref;
  if (type === 'mt') { const usados = new Set(m.parts.map((p) => p.nombre)); for (let i = 1; ; i++) if (!usados.has(`MT ${i}`)) return `MT ${i}`; }
  if (!pref) return TIPOS[type].corto;
  const usados = new Set(m.parts.filter((p) => p.type === type).map((p) => p.nombre));
  for (let i = 1; ; i++) { const n = type === 'caja' ? `CE${i}` : `${pref} ${i}`; if (!usados.has(n)) return n; }
}
export function nuevoId(m, type) { let i = m.parts.length + 1; const pre = type.slice(0, 2); while (m.parts.some((p) => p.id === pre + i)) i++; return pre + i; }

// ---------------------------------------------------------------- tubos (recorrido en L, sin pisar piezas)
function cajaDe(m, p) { const c = posParte(m, p); const d = medidas(p); return { x0: c.x - d.w / 2, x1: c.x + d.w / 2, y0: c.y - d.h / 2, y1: c.y + d.h / 2 }; }
function cortaSeg(a, b, r, mg = 0.8) {
  const x0 = Math.min(a.x, b.x) - mg, x1 = Math.max(a.x, b.x) + mg, y0 = Math.min(a.y, b.y) - mg, y1 = Math.max(a.y, b.y) + mg;
  return !(x1 < r.x0 || x0 > r.x1 || y1 < r.y0 || y0 > r.y1);
}
export function rutaTubo(m, aId, bId) {
  const A = posParte(m, aId), B = posParte(m, bId); if (!A || !B) return [];
  if (Math.abs(A.x - B.x) < 0.5 || Math.abs(A.y - B.y) < 0.5) return [A, B];
  const otros = m.parts.filter((p) => p.id !== aId && p.id !== bId && !TIPOS[p.type].modulo && p.type !== 'manguera').map((p) => cajaDe(m, p));
  const coste = (k) => otros.filter((r) => cortaSeg(A, k, r) || cortaSeg(k, B, r)).length;
  const k1 = { x: A.x, y: B.y }, k2 = { x: B.x, y: A.y };
  return coste(k1) <= coste(k2) ? [A, k1, B] : [A, k2, B];
}
export const largo = (pts) => pts.reduce((s, p, i) => (i ? s + Math.hypot(p.x - pts[i - 1].x, p.y - pts[i - 1].y) : 0), 0);
export function tuboEntre(m, ga, gb) { return m.tubos.find((t) => (t.a === ga && t.b === gb) || (t.a === gb && t.b === ga)) || null; }
// Lo que sobresale cada pieza desde su centro en la dirección del tubo
function salida(m, id, de, a) { const p = partePorId(m, id); if (!p) return 0; const d = medidas(p); return Math.abs(a.x - de.x) > Math.abs(a.y - de.y) ? d.w / 2 : d.h / 2; }
// Tramo visible del tubo: de borde a borde de las piezas (+1 cm que entra en cada caja)
export function tramoTubo(m, t) {
  const r = rutaTubo(m, t.a, t.b); if (r.length < 2) return { pts: [], L: 0, ini: 0, fin: 0 };
  const ini = salida(m, t.a, r[0], r[1]) - 1, fin = salida(m, t.b, r[r.length - 1], r[r.length - 2]) - 1;
  return { pts: r, L: Math.max(1, largo(r) - ini - fin), ini, fin };
}
export const largoTubo = (m, t) => Math.round(tramoTubo(m, t).L * 2) / 2;
export function puntoEnRuta(pts, s) { // punto a la distancia s del inicio
  let acc = 0; for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i]; const L = Math.hypot(b.x - a.x, b.y - a.y); if (acc + L >= s || i === pts.length - 1) { const f = L ? Math.min(1, Math.max(0, (s - acc) / L)) : 0; return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f, dir: Math.abs(b.x - a.x) > Math.abs(b.y - a.y) ? 'h' : 'v' }; } acc += L; }
  return pts[0];
}
export function grapasAuto(m, t, paso = 40) { const L = largoTubo(m, t); const n = Math.max(L > 30 ? 1 : 0, Math.ceil(L / paso) - 1); t.grapas = Array.from({ length: n }, (_, i) => Math.round(((i + 1) * L) / (n + 1))); return t.grapas; }
export function huecoGrapas(m, t) { const L = largoTubo(m, t); const g = [0, ...(t.grapas || []).filter((x) => x > 0 && x < L).sort((a, b) => a - b), L]; let mx = 0; for (let i = 1; i < g.length; i++) mx = Math.max(mx, g[i] - g[i - 1]); return mx; }
export function rutaCable(m, c) {
  const pa = posBorne(m, c.a), pb = posBorne(m, c.b); if (!pa || !pb) return { pts: [], enTubo: false, interno: false };
  const ga = grupo(m, c.a.p), gb = grupo(m, c.b.p);
  if (ga && ga === gb) return { pts: [pa, pb], enTubo: true, interno: true };
  const t = tuboEntre(m, ga, gb);
  if (!t) return { pts: [pa, pb], enTubo: false, interno: false, tubo: null };
  let r = rutaTubo(m, t.a, t.b); if (t.a !== ga) r = r.slice().reverse();
  return { pts: [pa, ...r.slice(1, -1), pb], enTubo: true, interno: false, tubo: t.id };
}
// Longitud de cable en metros (recorrido + 15 cm por punta para conectar)
export const metrosCable = (m, c) => { const r = rutaCable(m, c); return (largo(r.pts) + (r.interno ? 10 : 30)) / 100; };
export const cablesDelTubo = (m, t) => m.cables.filter((c) => rutaCable(m, c).tubo === t.id);

// ---------------------------------------------------------------- puntas de los cables (pelado y apriete)
export const extremo = (c, lado) => (lado === 'a' ? c.ea : c.eb) || { pel: 0, apr: false };
export function prepararExtremos(m, c) { c.ea = { pel: idealPelado(m, c.a), apr: true }; c.eb = { pel: idealPelado(m, c.b), apr: true }; return c; }
export function prepararTodo(m) { m.cables.forEach((c) => prepararExtremos(m, c)); m.tubos.forEach((t) => { t.med = true; t.cort = 'ok'; if (!t.d) t.d = 16; grapasAuto(m, t); }); m.parts.forEach((p) => { if (!TIPOS[p.type].modulo && p.type !== 'manguera') p.fijado = true; }); return m; }

// ---------------------------------------------------------------- saneado (archivos importados / entregas)
const numEn = (v, L, d) => (L.includes(+v) ? +v : d);
export function sanear(x) {
  const m = vacio(); if (!x || typeof x !== 'object') return m;
  const v2 = x.v === 2;
  const tb = x.tablero && TAMANOS_TABLERO.find(([w, h]) => w === +x.tablero.w && h === +x.tablero.h); if (tb) m.tablero = { w: tb[0], h: tb[1] };
  const D = dims(m); const ids = new Set();
  for (const p of Array.isArray(x.parts) ? x.parts.slice(0, 120) : []) {
    if (!p || !TIPOS[p.type] || typeof p.id !== 'string' || ids.has(p.id) || !/^[\w-]{1,20}$/.test(p.id)) continue;
    const T = TIPOS[p.type];
    const q = { id: p.id, type: p.type, nombre: String(p.nombre || T.corto).slice(0, 30) };
    if (T.modulo || p.type === 'manguera') { q.cuadro = String(p.cuadro || ''); if (T.modulo) q.slot = Number.isInteger(p.slot) && p.slot >= 0 && p.slot < MODULOS ? p.slot : 0; }
    else { q.x = Math.max(0, Math.min(D.w, +p.x || 0)); q.y = Math.max(0, Math.min(D.h, +p.y || 0)); q.fijado = v2 ? !!p.fijado : true; }
    if (p.type === 'interruptor' || p.type === 'pulsador') q.on = !!p.on;
    if (p.type === 'conmutador' || p.type === 'cruzamiento') q.pos = p.pos ? 1 : 0;
    if (p.type === 'enchufe' || p.type === 'enchufe2') q.carga = CARGAS.some((c) => c.id === p.carga) ? p.carga : 'nada';
    if (['interruptor', 'conmutador', 'cruzamiento', 'pulsador', 'minutero', 'enchufe', 'enchufe2'].includes(p.type) && p.montaje === 'empotrar') q.montaje = 'empotrar';
    if (p.type === 'minutero') { q.on = !!p.on; q.seg = [10, 20, 30, 60].includes(+p.seg) ? +p.seg : 20; }
    if (T.modulo) q.on = p.on !== false;
    if (p.type === 'cuadro' && p.cab) q.cab = true;
    if (esMT(q)) { q.In = numEn(p.In, CALIBRES, T.In); q.curva = p.curva === 'B' ? 'B' : 'C'; q.circ = CIRCUITOS[p.circ] ? p.circ : T.circ; }
    if (p.type === 'id') q.In = numEn(p.In, CALIBRES_ID, 40);
    if (p.type === 'iga') q.In = numEn(p.In, CALIBRES_IGA, 25);
    if (p.type === 'caja') {
      q.tam = v2 && CAJAS[p.tam] ? +p.tam : 100; q.fichas = {};
      const pos = posicionesCaja(q.tam).map((_, i) => 'B' + (i + 1));
      if (p.fichas && typeof p.fichas === 'object') for (const k of pos) if (FICHAS[p.fichas[k]]) q.fichas[k] = p.fichas[k];
      if (!v2) { /* cajas antiguas: regletas en todas las posiciones */ }
      if (p.tapa) q.tapa = true;
    }
    ids.add(q.id); m.parts.push(q);
  }
  m.parts = m.parts.filter((p) => !(TIPOS[p.type].modulo || p.type === 'manguera') || m.parts.some((q) => q.id === p.cuadro && q.type === 'cuadro'));
  for (const p of m.parts) if ((TIPOS[p.type].modulo || p.type === 'manguera') && m.parts.some((q) => q.id === p.cuadro && q.cab)) p.cab = true;
  // aparamenta: si se pisa en el carril (o viene de la versión 1), se recoloca en orden IGA → ID → magnetotérmicos
  for (const cu of m.parts.filter((p) => p.type === 'cuadro')) {
    const mods = m.parts.filter((p) => p.cuadro === cu.id && TIPOS[p.type].modulo);
    const pisa = () => { const u = new Map(); for (const p of mods) for (let i = 0; i < TIPOS[p.type].mods; i++) { const s = p.slot + i; if (s >= MODULOS || u.has(s)) return true; u.set(s, 1); } return false; };
    if (!v2 || pisa()) { const ord = { iga: 0, id: 1 }; let s = 0; mods.sort((a, b) => (ord[a.type] ?? 2) - (ord[b.type] ?? 2) || a.slot - b.slot); for (const p of mods) { p.slot = s; s += TIPOS[p.type].mods; } }
    const fuera = mods.filter((p) => p.slot + TIPOS[p.type].mods > MODULOS).map((p) => p.id); m.parts = m.parts.filter((p) => !fuera.includes(p.id));
  }
  const okRef = (r) => r && m.parts.some((p) => p.id === r.p && bornes(p).some((b) => b.t === r.t));
  for (const t of Array.isArray(x.tubos) ? x.tubos.slice(0, 120) : []) if (t && m.parts.some((p) => p.id === t.a) && m.parts.some((p) => p.id === t.b) && t.a !== t.b && !tuboEntre(m, t.a, t.b)) {
    const q = { id: String(t.id || 't' + m.tubos.length).slice(0, 20), a: t.a, b: t.b, d: numEn(t.d, TUBOS, 16), med: v2 ? !!t.med : true, cort: v2 ? (['ok', 'corto', 'largo'].includes(t.cort) ? t.cort : false) : 'ok' };
    q.grapas = v2 && Array.isArray(t.grapas) ? t.grapas.slice(0, 40).map((g) => Math.round(+g * 2) / 2).filter((g) => g > 0 && g < 400) : null;
    m.tubos.push(q); if (!q.grapas) grapasAuto(m, q);
  }
  const ext = (e, ref) => (v2 && e && typeof e === 'object' ? { pel: Math.max(0, Math.min(30, Math.round(+e.pel || 0))), apr: e.apr === 'pasado' ? 'pasado' : !!e.apr } : { pel: idealPelado(m, ref), apr: true });
  for (const c of Array.isArray(x.cables) ? x.cables.slice(0, 300) : []) if (c && okRef(c.a) && okRef(c.b) && !(c.a.p === c.b.p && c.a.t === c.b.t)) {
    const a = { p: c.a.p, t: c.a.t }, b = { p: c.b.p, t: c.b.t };
    m.cables.push({ id: String(c.id || 'w' + m.cables.length).slice(0, 20), a, b, color: COLORES[c.color] ? c.color : 'marron', sec: SECCIONES.includes(+c.sec) ? +c.sec : 1.5, ea: null, eb: null });
  }
  // cajas antiguas (v1): ficha de palanca del tamaño justo en cada posición usada
  if (!v2) for (const p of m.parts.filter((q) => q.type === 'caja')) for (const b of bornes(p)) { const n = m.cables.filter((c) => (c.a.p === p.id && c.a.t === b.t) || (c.b.p === p.id && c.b.t === b.t)).length; if (n) p.fichas[b.t] = n <= 2 ? 'w412' : n <= 3 ? 'w413' : 'w415'; }
  const src = new Map((Array.isArray(x.cables) ? x.cables : []).filter((c) => c && c.id).map((c) => [String(c.id).slice(0, 20), c]));
  for (const c of m.cables) { const o = src.get(c.id) || {}; c.ea = ext(o.ea, c.a); c.eb = ext(o.eb, c.b); }
  return m;
}

// ---------------------------------------------------------------- el tablero de la SA1 (tablero_referencia.png)
// Posiciones de la imagen de referencia (en cm del tablero)
export const REFERENCIA = {
  Q: { type: 'cuadro', x: 21, y: 15, nombre: 'Cuadro' },
  B1: { type: 'bombilla', x: 47.6, y: 65.4, nombre: 'Bombilla 1' }, B2: { type: 'bombilla', x: 78.3, y: 65.4, nombre: 'Bombilla 2' }, B3: { type: 'bombilla', x: 101, y: 65.4, nombre: 'Bombilla 3' },
  CE1: { type: 'caja', x: 47.6, y: 47.2, nombre: 'CE1' }, CE2: { type: 'caja', x: 78.3, y: 47.2, nombre: 'CE2' },
  I1: { type: 'interruptor', x: 47.6, y: 25.2, nombre: 'Interruptor 1' }, I2: { type: 'interruptor', x: 78.3, y: 25.2, nombre: 'Interruptor 2' },
  E1: { type: 'enchufe', x: 64.1, y: 14.5, nombre: 'Enchufe 1' },
};
export const TUBOS_REF = [['Q', 'CE1'], ['CE1', 'B1'], ['CE1', 'I1'], ['CE1', 'CE2'], ['CE2', 'B2'], ['CE2', 'I2'], ['CE2', 'B3'], ['Q', 'E1']];
export function solucionTablero() {
  const m = vacio();
  for (const [id, p] of Object.entries(REFERENCIA)) m.parts.push({ id, ...p, fijado: true, ...(p.type === 'interruptor' ? { on: false } : {}), ...(p.type === 'enchufe' ? { carga: 'nada' } : {}), ...(p.type === 'caja' ? { tam: 100, fichas: {} } : {}) });
  m.parts.push({ id: 'ID', type: 'id', cuadro: 'Q', slot: 0, nombre: 'ID 30 mA', on: true, In: 40 }, { id: 'C1', type: 'mt10', cuadro: 'Q', slot: 2, nombre: 'C1 10 A', on: true, In: 10, curva: 'C', circ: 'C1' },
    { id: 'C2', type: 'mt16', cuadro: 'Q', slot: 3, nombre: 'C2 16 A', on: true, In: 16, curva: 'C', circ: 'C2' }, { id: 'M', type: 'manguera', cuadro: 'Q', nombre: 'Manguera' });
  TUBOS_REF.forEach(([a, b], i) => m.tubos.push({ id: 't' + (i + 1), a, b, d: a === 'Q' && b === 'E1' ? 20 : 16 }));
  const w = (a, b, color, sec = 1.5) => { const [pa, ta] = a.split(':'), [pb, tb] = b.split(':'); m.cables.push({ id: 'w' + (m.cables.length + 1), a: { p: pa, t: ta }, b: { p: pb, t: tb }, color, sec }); };
  // C1 · alumbrado (1,5 mm²): fase y neutro hasta CE1 y de CE1 a CE2
  w('C1:L', 'CE1:B1', 'marron'); w('C1:N', 'CE1:B2', 'azul');
  w('CE1:B1', 'I1:1', 'marron'); w('I1:2', 'CE1:B3', 'negro'); w('CE1:B3', 'B1:L', 'negro'); w('CE1:B2', 'B1:N', 'azul');
  w('CE1:B1', 'CE2:B1', 'marron'); w('CE1:B2', 'CE2:B2', 'azul');
  w('CE2:B1', 'I2:1', 'marron'); w('I2:2', 'CE2:B3', 'negro'); w('CE2:B3', 'B2:L', 'negro'); w('CE2:B3', 'B3:L', 'negro');
  w('CE2:B2', 'B2:N', 'azul'); w('CE2:B2', 'B3:N', 'azul');
  // C2 · enchufe (2,5 mm²) con tierra
  w('C2:L', 'E1:L', 'marron', 2.5); w('C2:N', 'E1:N', 'azul', 2.5); w('Q:PE', 'E1:PE', 'tierra', 2.5);
  // fichas: conector de palanca del número de vías justo
  const ce1 = partePorId(m, 'CE1'), ce2 = partePorId(m, 'CE2');
  Object.assign(ce1.fichas, { B1: 'w413', B2: 'w413', B3: 'w412' }); Object.assign(ce2.fichas, { B1: 'w412', B2: 'w413', B3: 'w413' });
  return prepararTodo(m);
}
// Casos de avería para practicar (parten del tablero bien hecho)
const cab = (m, id) => m.cables.find((x) => x.id === id);
export const AVERIAS = [
  { id: 'neutro', n: 'El interruptor 1 corta el neutro', pista: 'La bombilla 1 enciende y apaga… pero ¿queda con tensión al apagarla? Mídelo con el buscapolos.',
    f: (m) => { const set = (id, a, b, col) => { const w = cab(m, id); w.a = a; w.b = b; if (col) w.color = col; };
      set('w3', { p: 'CE1', t: 'B4' }, { p: 'I1', t: '1' }, 'azul'); set('w4', { p: 'I1', t: '2' }, { p: 'CE1', t: 'B5' }, 'azul'); set('w5', { p: 'CE1', t: 'B1' }, { p: 'B1', t: 'L' }, 'marron'); set('w6', { p: 'CE1', t: 'B5' }, { p: 'B1', t: 'N' }, 'azul');
      m.cables.push({ id: 'w30', a: { p: 'CE1', t: 'B2' }, b: { p: 'CE1', t: 'B4' }, color: 'azul', sec: 1.5 });
      Object.assign(partePorId(m, 'CE1').fichas, { B3: 'w412', B4: 'w412', B5: 'w412' }); m.cables.forEach((c) => prepararExtremos(m, c)); } },
  { id: 'sinTierra', n: 'Al enchufe le falta la tierra', pista: 'Enchufa la lavadora con fuga y mira qué pasa con el diferencial.', f: (m) => { m.cables = m.cables.filter((c) => c.color !== 'tierra'); partePorId(m, 'E1').carga = 'fuga'; } },
  { id: 'seccion', n: 'Enchufe cableado con 1,5 mm²', pista: 'Enchufa el horno y mira la corriente de los cables del C2.', f: (m) => { m.cables.forEach((c) => { if (c.b.p === 'E1') c.sec = 1.5; }); partePorId(m, 'E1').carga = 'h3000'; } },
  { id: 'corto', n: 'Aparato en cortocircuito', pista: '¿Qué protección salta y por qué no salta el diferencial?', f: (m) => { partePorId(m, 'E1').carga = 'corto'; } },
  { id: 'sobrecarga', n: 'Sobrecarga en el enchufe', pista: 'Horno y radiador a la vez en una regleta: calcula la corriente.', f: (m) => { partePorId(m, 'E1').carga = 'reg5000'; } },
  { id: 'fuga', n: 'Lavadora con fuga (instalación bien hecha)', pista: 'Esta vez la tierra está bien: ¿quién protege a la persona?', f: (m) => { partePorId(m, 'E1').carga = 'fuga'; } },
  { id: 'flojo', n: 'Borne flojo en el enchufe', pista: 'Enchufa el horno: el neutro del enchufe no está apretado. ¿Qué pasa en ese borne? Apriétalo con la punta correcta.', f: (m) => { cab(m, 'w16').eb.apr = false; partePorId(m, 'E1').carga = 'h3000'; } },
  { id: 'pelado', n: 'La bombilla 2 no enciende', pista: 'Mide con el multímetro sin enchufar (continuidad) o con el buscapolos. Mira cómo está pelada la punta del cable.', f: (m) => { cab(m, 'w11').eb.pel = 4; } },
  { id: 'ficha', n: 'Ficha de empalme que se queda corta', pista: 'En CE2 hay tres cables que tienen que ir juntos… ¿caben en esa ficha?', f: (m) => { partePorId(m, 'CE2').fichas.B3 = 'w412'; } },
  { id: 'color', n: 'Fase del enchufe con cable azul', pista: 'Funciona… pero el próximo electricista pensará que es el neutro. Revisa los colores.', f: (m) => { cab(m, 'w15').color = 'azul'; cab(m, 'w16').color = 'marron'; } },
  { id: 'calibre', n: 'Magnetotérmico de alumbrado de 20 A', pista: 'Alguien cambió el C1 por uno de 20 A. ¿Protege todavía al cable de 1,5 mm²?', f: (m) => { partePorId(m, 'C1').In = 20; } },
  { id: 'tubo', n: 'Tubo del enchufe fino y sin grapas', pista: 'Tres cables de 2,5 mm² por un tubo de 16 mm y 40 cm sin sujetar: busca la tabla del tubo y la distancia entre grapas.', f: (m) => { const t = m.tubos.find((x) => x.a === 'Q' && x.b === 'E1'); t.d = 16; t.grapas = []; } },
];
export function averia(id) { const a = AVERIAS.find((x) => x.id === id); if (!a) return null; const m = solucionTablero(); a.f(m); return m; }

// ---------------------------------------------------------------- lista de materiales (Trabajo 3: presupuesto)
export const PRECIOS_BASE = {
  cuadro: 9.5, iga25: 14, iga32: 14.5, iga40: 15, id: 24, id25: 22, id40: 24, id63: 38, mt6: 6.5, mt10: 6.5, mt16: 6.9, mt20: 7.1, mt25: 7.4, mt32: 8.2, manguera: 5.5, portalamparas: 1.6, bombilla: 2.2,
  interruptor: 3.2, conmutador: 3.6, cruzamiento: 6.9, pulsador: 3.4, enchufe: 3.9, cajamec: 0.9, caja80: 1.6, caja100: 2.1, caja: 2.1, regleta: 0.9,
  tubo16: 0.45, tubo20: 0.55, tubo25: 0.75, tubo32: 1.1, tubo: 0.45, grapa: 0.08, tornillo: 0.03, 'cable1.5': 0.32, 'cable2.5': 0.52, cable4: 0.85, cable6: 1.25,
  ...Object.fromEntries(Object.entries(FICHAS).map(([k, f]) => ['f_' + k, f.precio])),
};
export function materiales(m) {
  const n = (t) => m.parts.filter((p) => p.type === t).length;
  const L = []; const idx = new Map();
  const add = (k, concepto, cant, ud, u = k) => { if (!(cant > 0)) return; if (idx.has(u)) { idx.get(u).cant = Math.round((idx.get(u).cant + cant) * 100) / 100; return; } const o = { k, concepto, cant: Math.round(cant * 100) / 100, ud }; idx.set(u, o); L.push(o); };
  add('cuadro', 'Cuadro de distribución (1 fila, 12 módulos)', n('cuadro'), 'ud');
  for (const p of m.parts.filter((q) => q.type === 'iga')) add('iga' + amperios(p), `Interruptor general automático (IGA) 2P ${amperios(p)} A`, 1, 'ud');
  for (const p of m.parts.filter((q) => q.type === 'id')) add(amperios(p) === 40 ? 'id' : 'id' + amperios(p), `Interruptor diferencial 2P ${amperios(p)} A 30 mA`, 1, 'ud');
  for (const p of m.parts.filter(esMT)) { const c = circuitoDe(p); add('mt' + amperios(p), `Magnetotérmico 1P+N ${amperios(p)} A curva ${curvaDe(p)}${c ? ` (${c} ${CIRCUITOS[c].n.toLowerCase()})` : ''}`, 1, 'ud'); }
  add('manguera', 'Manguera 3G2,5 mm² con clavija Schuko (1,5 m)', n('manguera'), 'ud');
  add('portalamparas', 'Portalámparas E27 de superficie', n('bombilla'), 'ud');
  add('bombilla', 'Bombilla E27 (60 W o LED equivalente)', n('bombilla'), 'ud');
  add('interruptor', 'Interruptor 10 AX (mecanismo + marco + tecla)', n('interruptor'), 'ud');
  add('conmutador', 'Conmutador 10 AX (mecanismo + marco + tecla)', n('conmutador'), 'ud');
  add('cruzamiento', 'Cruzamiento 10 AX (mecanismo + marco + tecla)', n('cruzamiento'), 'ud');
  add('pulsador', 'Pulsador 10 A (mecanismo + marco + tecla)', n('pulsador'), 'ud');
  add('enchufe', 'Base de enchufe Schuko 16 A 2P+T (mecanismo + marco + tapa)', n('enchufe') + 2 * n('enchufe2'), 'ud');
  add('marco2', 'Marco doble horizontal (71 mm entre ejes)', n('enchufe2'), 'ud');
  add('minutero', 'Minutero de escalera (automático temporizado)', n('minutero'), 'ud');
  { const mecs = m.parts.filter((q) => ['interruptor', 'conmutador', 'cruzamiento', 'pulsador', 'minutero', 'enchufe', 'enchufe2'].includes(q.type)); const emp = mecs.filter((q) => q.montaje === 'empotrar'); const dob = (q) => (q.type === 'enchufe2' ? 2 : 1);
    add('cajamec', 'Caja de superficie para mecanismo', mecs.filter((q) => q.montaje !== 'empotrar').reduce((s, q) => s + dob(q), 0), 'ud'); add('cajaemp', 'Caja universal de empotrar (60 mm entre ejes)', emp.reduce((s, q) => s + dob(q), 0), 'ud'); }
  add('tapareg', 'Tapa de registro para caja de empalme', m.parts.filter((q) => q.type === 'caja' && q.tapa).length, 'ud');
  for (const p of m.parts.filter((q) => q.type === 'caja')) {
    add(tamCaja(p) === 100 ? 'caja' : 'caja' + tamCaja(p), CAJAS[tamCaja(p)].n, 1, 'ud');
    for (const b of bornes(p)) { const f = p.fichas?.[b.t]; if (f && FICHAS[f]) add('f_' + f, `${FICHAS[f].n} (${FICHAS[f].ref})`, 1, 'ud'); }
  }
  for (const d of TUBOS) { const ts = m.tubos.filter((t) => (t.d || 16) === d); const mt = ts.reduce((s, t) => s + largoTubo(m, t), 0) / 100; if (mt > 0) add('tubo' + d, `Tubo corrugado Ø${d} mm (+10 %)`, Math.ceil(mt * 1.1 * 2) / 2, 'm'); }
  add('grapa', 'Grapas o abrazaderas para tubo', m.tubos.reduce((s, t) => s + (t.grapas?.length || 0), 0), 'ud');
  add('tornillo', 'Tornillos de madera (fijación de cajas, cuadro y grapas)', m.parts.filter((p) => !TIPOS[p.type].modulo && p.type !== 'manguera').length * 2 + m.tubos.reduce((s, t) => s + (t.grapas?.length || 0), 0), 'ud');
  for (const sec of SECCIONES) for (const [col, C] of Object.entries(COLORES)) {
    const mts = m.cables.filter((c) => c.color === col && c.sec === sec).reduce((s, c) => s + metrosCable(m, c), 0);
    if (mts > 0) add('cable' + sec, `Cable H07V-K ${fmtSec(sec)} ${C.n.toLowerCase()}`, Math.ceil(mts * 2) / 2, 'm', 'cable' + sec + col);
  }
  return L;
}
export function presupuesto(L, precios = {}) {
  const P = { ...PRECIOS_BASE, ...precios };
  const filas = L.map((l) => ({ ...l, precio: +P[l.k] || 0, total: Math.round((+P[l.k] || 0) * l.cant * 100) / 100 }));
  return { filas, total: Math.round(filas.reduce((s, f) => s + f.total, 0) * 100) / 100 };
}
export { clone, CIRCUITOS, FICHAS, CAJAS, BORNES, TUBOS, GRAPA_MAX };

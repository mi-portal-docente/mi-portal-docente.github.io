// Modo «Vivienda real»: plano de un piso (entrada, pasillo, salón, cocina, baño y dos dormitorios) donde se
// colocan el cuadro, las cajas de registro, los puntos de luz, los mecanismos y las bases por estancia, se tiran
// los tubos y se comprueba contra los mínimos del REBT (ITC-BT-25 grado básico, ITC-BT-27 baños, ITC-BT-21 tubos).
// Sin dependencias del navegador (se prueba con node). Unidades: cm en planta; altura en cm sobre el suelo.
import { CIRCUITOS, CALIBRES, CALIBRES_IGA, CALIBRES_ID, PROTEGE, SECCIONES, TUBOS, tuboMinimo } from './catalogo.js';

export const PLANO = {
  w: 700, h: 800, alto: 250,
  estancias: [
    { id: 'vestibulo', n: 'Entrada (vestíbulo)', tipo: 'vestibulo', r: [0, 330, 200, 470] },
    { id: 'pasillo', n: 'Pasillo', tipo: 'pasillo', r: [200, 350, 700, 470], largo: 500, accesos: [[215, 410], [685, 410]] },
    { id: 'salon', n: 'Salón', tipo: 'salon', r: [0, 470, 400, 800] },
    { id: 'cocina', n: 'Cocina', tipo: 'cocina', r: [400, 470, 700, 800] },
    { id: 'bano', n: 'Baño', tipo: 'bano', r: [0, 0, 200, 330] },
    { id: 'dorm1', n: 'Dormitorio 1', tipo: 'dormitorio', r: [200, 0, 450, 350] },
    { id: 'dorm2', n: 'Dormitorio 2', tipo: 'dormitorio', r: [450, 0, 700, 350] },
  ],
  puertaCalle: { x: 0, y: 405, ancho: 90 },
  // tabiques (con los huecos de las puertas)
  muros: [
    [0, 0, 700, 0], [700, 0, 700, 800], [700, 800, 0, 800], [0, 800, 0, 450], [0, 360, 0, 0],
    [0, 470, 60, 470], [140, 470, 460, 470], [540, 470, 700, 470], [400, 470, 400, 800],
    [0, 330, 60, 330], [140, 330, 200, 330], [200, 0, 200, 350],
    [200, 350, 330, 350], [410, 350, 580, 350], [660, 350, 700, 350], [450, 0, 450, 350],
  ],
  muebles: [
    { t: 'banera', n: 'Bañera', r: [0, 0, 170, 75], h: 55 }, { t: 'lavabo', n: 'Lavabo', r: [130, 250, 200, 310], h: 85 }, { t: 'inodoro', n: 'Inodoro', r: [10, 180, 60, 240], h: 40 },
    { t: 'encimera', n: 'Encimera', r: [400, 740, 700, 800], h: 90 }, { t: 'fregadero', n: 'Fregadero', r: [420, 745, 480, 795], h: 92 }, { t: 'placa', n: 'Placa', r: [630, 745, 690, 795], h: 92 },
    { t: 'frigo', n: 'Frigorífico', r: [640, 560, 700, 620], h: 180 },
    { t: 'cama', n: 'Cama', r: [240, 60, 390, 250], h: 50 }, { t: 'cama', n: 'Cama', r: [520, 60, 670, 250], h: 50 },
    { t: 'sofa', n: 'Sofá', r: [40, 720, 260, 790], h: 80 }, { t: 'mesa', n: 'Mesa', r: [140, 560, 280, 640], h: 75 },
  ],
};
export const area = (e) => ((e.r[2] - e.r[0]) * (e.r[3] - e.r[1])) / 10000;
export const estancia = (id) => PLANO.estancias.find((e) => e.id === id);

export const TIPOS_CASA = {
  luz: { n: 'Punto de luz', icon: '💡', circ: 'C1', h: 250, techo: true },
  interruptor: { n: 'Interruptor 10 A', icon: '🔘', circ: 'C1', h: 110 },
  conmutador: { n: 'Conmutador 10 A', icon: '🔀', circ: 'C1', h: 110 },
  timbre: { n: 'Pulsador de timbre', icon: '🔔', circ: 'C1', h: 140 },
  base16: { n: 'Base 16 A 2P+T', icon: '🔌', circ: 'C2', h: 30 },
  base25: { n: 'Base 25 A 2P+T (cocina/horno)', icon: '🍳', circ: 'C3', h: 50 },
  caja: { n: 'Caja de registro', icon: '⬜', circ: null, h: 230 },
};
export const PALETA_CASA = ['luz', 'interruptor', 'conmutador', 'base16', 'base25', 'timbre', 'caja'];

const clone = (o) => JSON.parse(JSON.stringify(o));
export const casaVacia = () => ({ v: 1, tipo: 'casa', cuadro: null, prot: { iga: null, id: null, mts: {} }, secs: { C1: 1.5, C2: 1.5, C3: 1.5, C4: 1.5, C5: 1.5 }, puntos: [], tubos: [] });
export function estanciaEn(x, y) {
  const { puertaCalle: P } = PLANO;
  if (x < 0 && x > -80 && Math.abs(y - P.y) < 80) return 'acceso';
  const e = PLANO.estancias.find((s) => x >= s.r[0] && x <= s.r[2] && y >= s.r[1] && y <= s.r[3]);
  return e ? e.id : null;
}
// Pega un punto de pared al tabique más cercano (lo deja 3 cm dentro del lado donde se pulsó)
export function pegarPared(x, y) {
  let best = null;
  for (const [x0, y0, x1, y1] of PLANO.muros) {
    const dx = x1 - x0, dy = y1 - y0, L2 = dx * dx + dy * dy; const t = Math.max(0, Math.min(1, ((x - x0) * dx + (y - y0) * dy) / L2));
    const px = x0 + t * dx, py = y0 + t * dy, d = Math.hypot(x - px, y - py);
    if (!best || d < best.d) best = { d, px, py, nx: dx === 0 ? Math.sign(x - px) || 1 : 0, ny: dy === 0 ? Math.sign(y - py) || 1 : 0, horiz: dy === 0 };
  }
  if (!best || best.d > 70) return { x, y, pared: null };
  return { x: Math.round(best.px + best.nx * 4), y: Math.round(best.py + best.ny * 4), pared: best.horiz ? (best.ny > 0 ? 'S' : 'N') : (best.nx > 0 ? 'O' : 'E') };
}
export const posPunto = (m, id) => (id === 'Q' ? (m.cuadro ? { x: m.cuadro.x, y: m.cuadro.y, h: 180 } : null) : (() => { const p = m.puntos.find((q) => q.id === id); return p ? { x: p.x, y: p.y, h: TIPOS_CASA[p.tipo].h } : null; })());
export const ALTO_TUBO = 240;
export function largoTuboCasa(m, t) { const a = posPunto(m, t.a), b = posPunto(m, t.b); if (!a || !b) return 0; return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(ALTO_TUBO - a.h) + Math.abs(ALTO_TUBO - b.h); }
export function circDefecto(tipo, est) { if (tipo !== 'base16') return TIPOS_CASA[tipo].circ; return est === 'bano' ? 'C5' : est === 'cocina' ? 'C5' : 'C2'; }

export function sanearCasa(x) {
  const m = casaVacia(); if (!x || typeof x !== 'object' || x.tipo !== 'casa') return m;
  if (x.cuadro && isFinite(x.cuadro.x) && isFinite(x.cuadro.y)) m.cuadro = { x: Math.max(-50, Math.min(PLANO.w + 50, +x.cuadro.x)), y: Math.max(-50, Math.min(PLANO.h + 50, +x.cuadro.y)) };
  const pr = x.prot || {}; m.prot.iga = CALIBRES_IGA.includes(+pr.iga) ? +pr.iga : null; m.prot.id = CALIBRES_ID.includes(+pr.id) ? +pr.id : null;
  for (const c of Object.keys(CIRCUITOS)) { const q = pr.mts?.[c]; if (q && CALIBRES.includes(+q.In)) m.prot.mts[c] = { In: +q.In, curva: q.curva === 'B' ? 'B' : 'C' }; if (SECCIONES.includes(+x.secs?.[c])) m.secs[c] = +x.secs[c]; }
  const ids = new Set();
  for (const p of Array.isArray(x.puntos) ? x.puntos.slice(0, 200) : []) {
    if (!p || !TIPOS_CASA[p.tipo] || typeof p.id !== 'string' || !/^[\w-]{1,20}$/.test(p.id) || ids.has(p.id) || p.id === 'Q') continue;
    const q = { id: p.id, tipo: p.tipo, x: Math.max(-80, Math.min(PLANO.w, Math.round(+p.x || 0))), y: Math.max(0, Math.min(PLANO.h, Math.round(+p.y || 0))) };
    q.est = estanciaEn(q.x, q.y); q.circ = TIPOS_CASA[p.tipo].circ === null ? null : CIRCUITOS[p.circ] ? p.circ : circDefecto(p.tipo, q.est);
    if (p.tipo === 'interruptor' || p.tipo === 'conmutador') { q.manda = Array.isArray(p.manda) ? p.manda.filter((s) => typeof s === 'string').slice(0, 10) : []; q.on = !!p.on; }
    ids.add(q.id); m.puntos.push(q);
  }
  for (const p of m.puntos) if (p.manda) p.manda = p.manda.filter((id) => m.puntos.some((q) => q.id === id && q.tipo === 'luz'));
  const ok = (id) => id === 'Q' ? !!m.cuadro : ids.has(id);
  for (const t of Array.isArray(x.tubos) ? x.tubos.slice(0, 300) : []) if (t && ok(t.a) && ok(t.b) && t.a !== t.b && !m.tubos.some((u) => (u.a === t.a && u.b === t.b) || (u.a === t.b && u.b === t.a))) m.tubos.push({ id: String(t.id || 't' + m.tubos.length).slice(0, 20), a: t.a, b: t.b, d: TUBOS.includes(+t.d) ? +t.d : 20 });
  return m;
}

// Camino de tubos desde el cuadro hasta cada punto (BFS) y circuitos que pasan por cada tubo
export function caminos(m) {
  const ady = new Map(); const add = (a, b, t) => { if (!ady.has(a)) ady.set(a, []); ady.get(a).push([b, t]); };
  for (const t of m.tubos) { add(t.a, t.b, t); add(t.b, t.a, t); }
  const prev = new Map([['Q', null]]); const cola = ['Q'];
  while (cola.length) { const u = cola.shift(); for (const [v, t] of ady.get(u) || []) if (!prev.has(v)) { prev.set(v, [u, t]); cola.push(v); } }
  const camino = (id) => { if (!prev.has(id)) return null; const L = []; let u = id; while (prev.get(u)) { const [w, t] = prev.get(u); L.push(t); u = w; } return L; };
  const porTubo = new Map(m.tubos.map((t) => [t.id, new Set()]));
  for (const p of m.puntos) { if (!p.circ) continue; const c = camino(p.id); if (c) c.forEach((t) => porTubo.get(t.id).add(p.circ)); }
  return { conectado: (id) => prev.has(id), camino, porTubo };
}
// Mínimos por estancia (ITC-BT-25, tabla 2: grado básico)
export function minimos(e) {
  const S = area(e); const luces = S > 10 ? 2 : 1;
  switch (e.tipo) {
    case 'vestibulo': return { luz: 1, mando: 1, C2: 1 };
    case 'salon': case 'dormitorio': return { luz: luces, mando: luces, C2: Math.max(3, Math.ceil(S / 6)) };
    case 'bano': return { luz: 1, mando: 1, C5: 1 };
    case 'pasillo': { const L = (e.largo || 0) / 100; return { luz: Math.max(1, Math.ceil(L / 5)), mando: (e.accesos || []).length || 1, C2: L > 5 ? 2 : 1 }; }
    case 'cocina': return { luz: luces, mando: luces, C2: 2, C3: 1, C4: 3, C5: 3 };
    default: return {};
  }
}
const distRect = (x, y, r) => Math.hypot(Math.max(r[0] - x, 0, x - r[2]), Math.max(r[1] - y, 0, y - r[3]));
const fmt = (n) => String(Math.round(n * 10) / 10).replace('.', ',');
const lista = (a, n = 4) => a.slice(0, n).join(', ') + (a.length > n ? '…' : '');

export function comprobarCasa(m) {
  const it = []; const add = (ok, t, k, extra) => it.push({ ok: !!ok, t, k, ...(extra || {}) });
  const C = caminos(m); const P = m.puntos;
  const nombre = (p) => `${TIPOS_CASA[p.tipo].n.toLowerCase()} (${estancia(p.est)?.n || (p.est === 'acceso' ? 'acceso' : 'fuera')})`;
  // cuadro y protecciones (ITC-BT-17 y 25)
  const enEntrada = m.cuadro && estanciaEn(m.cuadro.x, m.cuadro.y) === 'vestibulo';
  add(enEntrada, !m.cuadro ? 'Falta el cuadro general de mando y protección: va en la entrada de la vivienda' : enEntrada ? 'Cuadro en la entrada de la vivienda, junto a la puerta (ITC-BT-17)' : 'El cuadro tiene que ir en la entrada (vestíbulo), lo más cerca posible de la puerta', 'cuadro');
  add(m.prot.iga >= 25, m.prot.iga ? (m.prot.iga >= 25 ? `IGA de ${m.prot.iga} A (mínimo 25 A)` : `IGA de ${m.prot.iga} A: mínimo 25 A`) : 'Falta el interruptor general automático (IGA, mínimo 25 A)', 'iga');
  add(m.prot.id && (!m.prot.iga || m.prot.id >= m.prot.iga), !m.prot.id ? 'Falta el interruptor diferencial de 30 mA' : m.prot.iga && m.prot.id < m.prot.iga ? `Diferencial de ${m.prot.id} A con IGA de ${m.prot.iga} A: el diferencial tiene que ser de ${m.prot.iga} A o más` : `Diferencial ${m.prot.id} A 30 mA`, 'id');
  const usados = new Set(P.map((p) => p.circ).filter(Boolean));
  for (const [c, D] of Object.entries(CIRCUITOS)) {
    const mt = m.prot.mts[c]; const sec = m.secs[c]; const hay = usados.has(c);
    if (!mt && !hay) { add(false, `Falta el circuito ${c} (${D.n.toLowerCase()}): es obligatorio en el grado básico`, 'circ' + c); continue; }
    const fallos = [];
    if (!mt) fallos.push(`falta su magnetotérmico de ${D.In} A`); else if (mt.In !== D.In) fallos.push(`su magnetotérmico es de ${mt.In} A y tiene que ser de ${D.In} A`);
    if (sec < D.sec) fallos.push(`el cable es de ${fmt(sec)} mm² y tiene que ser de ${fmt(D.sec)} mm²`);
    else if (mt && mt.In > (PROTEGE[sec] || 0)) fallos.push(`el cable de ${fmt(sec)} mm² no queda protegido por ${mt.In} A`);
    if (!hay) fallos.push('no tiene ningún punto');
    const n = P.filter((p) => p.circ === c && (c === 'C1' ? p.tipo === 'luz' : p.tipo.startsWith('base'))).length;
    if (n > D.max) fallos.push(`tiene ${n} ${c === 'C1' ? 'puntos de luz' : 'tomas'} (máximo ${D.max}): hace falta otro circuito`);
    add(!fallos.length, fallos.length ? `${c} ${D.n}: ${fallos.join('; ')}` : `${c} ${D.n}: ${D.In} A con cable de ${fmt(sec)} mm²`, 'circ' + c);
  }
  // mínimos por estancia
  for (const e of PLANO.estancias) {
    const req = minimos(e); const aqui = P.filter((p) => p.est === e.id);
    const n = { luz: aqui.filter((p) => p.tipo === 'luz').length, mando: aqui.filter((p) => p.tipo === 'interruptor' || p.tipo === 'conmutador').length };
    for (const c of ['C2', 'C3', 'C4', 'C5']) n[c] = aqui.filter((p) => p.tipo.startsWith('base') && p.circ === c).length;
    const falta = Object.entries(req).filter(([k, v]) => (n[k] || 0) < v);
    const nom = { luz: 'puntos de luz', mando: e.tipo === 'pasillo' ? 'interruptores o conmutadores (uno en cada acceso)' : 'interruptores', C2: 'bases C2', C3: 'base de 25 A (C3)', C4: 'bases C4 (lavadora, lavavajillas, termo)', C5: 'bases C5' };
    add(!falta.length, `${e.n} (${fmt(area(e))} m²): ${Object.entries(req).map(([k, v]) => `${v} ${nom[k]}`).join(', ')}${falta.length ? ` — tienes ${falta.map(([k]) => `${n[k] || 0} ${nom[k]}`).join(', ')}` : ' ✓'}`, 'est:' + e.id);
  }
  add(P.some((p) => p.tipo === 'timbre' && (p.est === 'acceso' || Math.hypot(p.x - PLANO.puertaCalle.x, p.y - PLANO.puertaCalle.y) < 100)), 'Pulsador del timbre en el acceso (junto a la puerta de la calle)', 'timbre');
  // mando de las luces
  const mandos = P.filter((p) => p.tipo === 'interruptor' || p.tipo === 'conmutador');
  const sinMando = P.filter((p) => p.tipo === 'luz' && !mandos.some((s) => s.manda?.includes(p.id)));
  const otrosSitios = mandos.filter((s) => (s.manda || []).some((id) => P.find((q) => q.id === id)?.est !== s.est) && s.est !== 'pasillo' && s.est !== 'vestibulo');
  add(!sinMando.length, sinMando.length ? `Puntos de luz sin interruptor que los mande: ${lista(sinMando.map(nombre))} (usa 🔗 Mandar)` : 'Cada punto de luz tiene su interruptor', 'mando');
  if (otrosSitios.length) add(false, `Interruptores que mandan luces de otra estancia: ${lista(otrosSitios.map(nombre))}`, 'mandoSitio');
  const pas = estancia('pasillo'); const lucesPas = P.filter((p) => p.tipo === 'luz' && p.est === 'pasillo');
  if (lucesPas.length) {
    const ok = (pas.accesos || []).every(([ax, ay]) => mandos.some((s) => s.tipo === 'conmutador' && Math.hypot(s.x - ax, s.y - ay) < 130 && (s.manda || []).some((id) => lucesPas.some((l) => l.id === id))));
    add(ok, ok ? 'Pasillo: la luz se enciende y se apaga desde cada acceso (conmutada)' : 'Pasillo: pon un conmutador junto a cada acceso (a la entrada y al fondo) que mande su luz', 'conmutada');
  }
  // circuito de cada punto
  const malC = P.filter((p) => p.circ && ((p.tipo === 'base25' && p.circ !== 'C3') || (p.tipo === 'base16' && p.circ === 'C3') || (p.tipo.startsWith('base') && p.est === 'bano' && p.circ !== 'C5') || (!p.tipo.startsWith('base') && p.circ !== 'C1')));
  add(!malC.length, malC.length ? `Circuito equivocado: ${lista(malC.map((p) => `${nombre(p)} en ${p.circ}`))} (alumbrado C1 · base 25 A C3 · baño C5)` : 'Cada punto está en su circuito (alumbrado C1, tomas C2, cocina/horno C3, lavadora C4, baño y encimera C5)', 'circuitos');
  // baño: volúmenes (ITC-BT-27)
  const ban = PLANO.muebles.find((x) => x.t === 'banera');
  const enVol = P.filter((p) => p.est === 'bano' && p.tipo !== 'luz' && p.tipo !== 'caja' && distRect(p.x, p.y, ban.r) < 60);
  add(!enVol.length, enVol.length ? `Baño: ${lista(enVol.map(nombre))} a menos de 60 cm de la bañera (volúmenes 0, 1 y 2): prohibido (ITC-BT-27)` : 'Baño: bases e interruptores fuera de los volúmenes de la bañera (a 60 cm o más)', 'volumenes');
  const freg = PLANO.muebles.find((x) => x.t === 'fregadero'), placa = PLANO.muebles.find((x) => x.t === 'placa');
  const cercaAgua = P.filter((p) => p.est === 'cocina' && p.circ === 'C5' && (distRect(p.x, p.y, freg.r) < 50 || distRect(p.x, p.y, placa.r) < 50));
  add(!cercaAgua.length, cercaAgua.length ? `Cocina: ${cercaAgua.length} base${cercaAgua.length > 1 ? 's' : ''} C5 a menos de 50 cm del fregadero o de la placa (ITC-BT-25, nota 2)` : 'Cocina: bases de la encimera a 50 cm o más del fregadero y de la placa', 'encimera');
  // tubos
  const sueltos = P.filter((p) => !C.conectado(p.id));
  add(P.length && !sueltos.length, !P.length ? 'Coloca los puntos de la vivienda' : sueltos.length ? `Sin tubo hasta el cuadro: ${lista(sueltos.map(nombre))}` : 'Todos los puntos llegan al cuadro por tubo', 'tubos');
  const finos = m.tubos.filter((t) => { const cs = [...C.porTubo.get(t.id)]; const cond = cs.flatMap((c) => [m.secs[c], m.secs[c], m.secs[c]]); return cond.length && t.d < tuboMinimo(cond); });
  if (m.tubos.length) add(!finos.length, finos.length ? `${finos.length} tubo${finos.length > 1 ? 's' : ''} demasiado fino${finos.length > 1 ? 's' : ''} para los cables que lleva${finos.length > 1 ? 'n' : ''} (ITC-BT-21: C1 Ø16, C2/C4/C5 Ø20, C3 Ø25; con varios circuitos, más)` : 'Diámetro de los tubos correcto para sus cables (ITC-BT-21)', 'tuboDiam', { tubos: finos.map((t) => t.id) });
  return { ok: it.every((i) => i.ok), items: it };
}

// Luces encendidas (con la instalación con tensión)
export function simularCasa(m) {
  const C = caminos(m); const pot = m.prot.iga && m.prot.id && m.prot.mts.C1 && m.cuadro;
  const mandos = m.puntos.filter((p) => p.manda);
  const luces = m.puntos.filter((p) => p.tipo === 'luz').map((l) => {
    const ms = mandos.filter((s) => s.manda.includes(l.id)); const conm = ms.filter((s) => s.tipo === 'conmutador'); const inte = ms.filter((s) => s.tipo === 'interruptor');
    let on = conm.length ? conm.reduce((a, s) => a !== !!s.on, false) : false; if (inte.length) on = conm.length ? on && inte.every((s) => s.on) : inte.some((s) => s.on);
    const llega = pot && C.conectado(l.id) && ms.every((s) => C.conectado(s.id)) && l.circ === 'C1';
    return { id: l.id, on: !!(on && llega), llega: !!llega };
  });
  return { luces, con: !!pot };
}
// Lista de materiales de la vivienda
export function materialesCasa(m) {
  const L = []; const add = (k, concepto, cant, ud) => { if (cant > 0) L.push({ k, concepto, cant: Math.round(cant * 100) / 100, ud }); };
  const n = (t) => m.puntos.filter((p) => p.tipo === t).length;
  if (m.cuadro) add('cuadro', 'Cuadro de vivienda (2 filas, 24 módulos)', 1, 'ud');
  if (m.prot.iga) add('iga' + m.prot.iga, `IGA 2P ${m.prot.iga} A`, 1, 'ud');
  if (m.prot.id) add(m.prot.id === 40 ? 'id' : 'id' + m.prot.id, `Interruptor diferencial 2P ${m.prot.id} A 30 mA`, 1, 'ud');
  for (const [c, q] of Object.entries(m.prot.mts)) add('mt' + q.In, `Magnetotérmico 1P+N ${q.In} A curva ${q.curva} (${c})`, 1, 'ud');
  add('portalamparas', 'Punto de luz (portalámparas o florón)', n('luz'), 'ud'); add('interruptor', 'Interruptor 10 AX', n('interruptor'), 'ud'); add('conmutador', 'Conmutador 10 AX', n('conmutador'), 'ud');
  add('pulsador', 'Pulsador de timbre', n('timbre'), 'ud'); add('enchufe', 'Base Schuko 16 A 2P+T', n('base16'), 'ud'); add('base25', 'Base 25 A 2P+T', n('base25'), 'ud');
  add('cajamec', 'Caja universal de empotrar (mecanismos)', n('interruptor') + n('conmutador') + n('timbre') + n('base16') + n('base25'), 'ud'); add('caja', 'Caja de registro de empotrar 100 × 100 mm', n('caja'), 'ud');
  for (const d of TUBOS) { const mt = m.tubos.filter((t) => t.d === d).reduce((s, t) => s + largoTuboCasa(m, t), 0) / 100; if (mt) add('tubo' + d, `Tubo corrugado Ø${d} mm (+10 %)`, Math.ceil(mt * 1.1), 'm'); }
  const C = caminos(m); const porSec = new Map();
  for (const p of m.puntos) { if (!p.circ) continue; const c = C.camino(p.id); if (!c) continue; const mts = c.reduce((s, t) => s + largoTuboCasa(m, t), 0) / 100 + 0.4; const s = m.secs[p.circ]; porSec.set(s, (porSec.get(s) || 0) + mts); }
  for (const [s, mts] of [...porSec].sort((a, b) => a[0] - b[0])) for (const col of ['marrón', 'azul', 'amarillo-verde']) add('cable' + s, `Cable H07V-K ${String(s).replace('.', ',')} mm² ${col}`, Math.ceil(mts * 1.1), 'm');
  return L;
}
// Una solución de referencia (para el profesor y las pruebas)
export function solucionCasa() {
  const m = casaVacia(); m.cuadro = { x: 4, y: 440 };
  m.prot = { iga: 40, id: 40, mts: Object.fromEntries(Object.entries(CIRCUITOS).map(([c, D]) => [c, { In: D.In, curva: 'C' }])) };
  m.secs = Object.fromEntries(Object.entries(CIRCUITOS).map(([c, D]) => [c, D.sec]));
  let i = 0; const P = (tipo, x, y, extra = {}) => { const id = 'p' + ++i; const est = estanciaEn(x, y); m.puntos.push({ id, tipo, x, y, est, circ: circDefecto(tipo, est), ...extra }); return id; };
  const T = (a, b, d) => m.tubos.push({ id: 't' + (m.tubos.length + 1), a, b, d });
  const reg = { v: P('caja', 100, 466), p: P('caja', 450, 466), s: P('caja', 200, 474), co: P('caja', 550, 474), b: P('caja', 100, 326), d1: P('caja', 325, 346), d2: P('caja', 575, 346) };
  T('Q', reg.v, 32); T(reg.v, reg.p, 32); T(reg.v, reg.s, 20); T(reg.p, reg.co, 32); T(reg.v, reg.b, 20); T(reg.p, reg.d1, 20); T(reg.p, reg.d2, 20);
  const luz = (est, x, y, r, mandos) => { const l = P('luz', x, y); T(r, l, 16); for (const [tp, mx, my] of mandos) { const s = P(tp, mx, my, { manda: [l], on: false }); T(r, s, 16); } return l; };
  // vestíbulo
  luz('vestibulo', 100, 400, reg.v, [['interruptor', 30, 466]]); T(reg.v, P('base16', 196, 340), 20); T(reg.v, P('timbre', -10, 470), 16);
  // pasillo (conmutada) y bases
  const lp = P('luz', 450, 410); T(reg.p, lp, 16); for (const [x, y] of [[215, 354], [685, 380]]) { const s = P('conmutador', x, y, { manda: [lp], on: false }); T(reg.p, s, 16); }
  T(reg.p, P('base16', 300, 466), 20); T(reg.p, P('base16', 620, 466), 20);
  // salón
  luz('salon', 120, 640, reg.s, [['interruptor', 150, 474]]); luz('salon', 300, 640, reg.s, [['interruptor', 170, 474]]);
  for (const [x, y] of [[4, 600], [4, 750], [396, 600], [300, 796]]) T(reg.s, P('base16', x, y), 20);
  // cocina
  luz('cocina', 550, 620, reg.co, [['interruptor', 560, 474]]);
  T(reg.co, P('base16', 696, 590, { circ: 'C2' }), 20); T(reg.co, P('base16', 696, 700, { circ: 'C2' }), 20); T(reg.co, P('base25', 620, 736), 25);
  for (const y of [650, 670, 690]) T(reg.co, P('base16', 696, y, { circ: 'C4' }), 20);
  for (const x of [535, 555, 575]) T(reg.co, P('base16', x, 796, { circ: 'C5' }), 20);
  // baño (fuera de volúmenes) y dormitorios
  luz('bano', 100, 160, reg.b, [['interruptor', 150, 326]]); T(reg.b, P('base16', 196, 220), 20);
  for (const [r, x0] of [[reg.d1, 200], [reg.d2, 450]]) { luz('dorm', x0 + 125, 175, r, [['interruptor', x0 + 20, 346]]); for (const [x, y] of [[x0 + 30, 4], [x0 + 220, 4], [x0 + 246, 300]]) T(r, P('base16', x, y), 20); }
  return m;
}
export { clone };

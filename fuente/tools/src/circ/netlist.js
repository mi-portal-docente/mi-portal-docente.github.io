// Construye la red eléctrica (nodos) a partir del montaje: protoboard + cables + piezas.
import { PARTS } from './parts.js';
import { stripOf, rot, holeAt, holePos } from './board.js';

class UF {
  constructor() { this.p = new Map(); }
  find(x) { if (!this.p.has(x)) this.p.set(x, x); let r = x; while (this.p.get(r) !== r) r = this.p.get(r); let c = x; while (this.p.get(c) !== r) { const n = this.p.get(c); this.p.set(c, r); c = n; } return r; }
  union(a, b) { const ra = this.find(a), rb = this.find(b); if (ra !== rb) this.p.set(ra, rb); }
}
export const termKey = (p, pin) => `p:${p.id}:${pin}`;
export const nodeKey = (k) => k.startsWith('h:') ? 's:' + stripOf(k.slice(2)) : k;

// Agujeros donde caen los pines de una pieza de protoboard (null si alguno no cae en un agujero)
export function partHoles(p) {
  const def = PARTS[p.type]; if (!def.board) return null;
  const a = holePos(p.at); if (!a) return null;
  const out = {};
  for (const [id, dx, dz] of def.pins) { const [rx, rz] = rot(dx, dz, p.rot || 0); const h = holeAt(a.x + rx, a.z + rz, 0.05); if (!h) return null; out[id] = h; }
  return out;
}

// opts.structural: no aplica interruptores ni puntas del polímetro (solo cables + protoboard)
export function connectivity(model, opts = {}) {
  const uf = new UF();
  const touch = (k) => { if (k.startsWith('h:')) uf.union(k, 's:' + stripOf(k.slice(2))); uf.find(k); };
  for (const p of model.parts) {
    const def = PARTS[p.type];
    if (def.board) { const hs = partHoles(p); if (hs) for (const pin in hs) { touch('h:' + hs[pin]); uf.union(termKey(p, pin), 'h:' + hs[pin]); } }
    for (const [pin] of def.pins) uf.find(termKey(p, pin));
    // uniones internas fijas (p. ej. las patas 1–2 y 3–4 del pulsador): son físicas, cuentan siempre
    if (def.internal) for (const [x, y] of def.internal(p)) uf.union(termKey(p, x), termKey(p, y));
    if (!opts.structural) {
      if (def.merges) for (const [x, y] of def.merges(p, opts.runtime?.[p.id] || {})) uf.union(termKey(p, x), termKey(p, y));
    }
    if (def.meter && !opts.structural && p.probes) {
      for (const [pin, k] of [['red', p.probes.red], ['com', p.probes.com]]) if (k) { touch(k); uf.union(termKey(p, pin), k); }
    }
  }
  for (const w of model.wires) { touch(w.a); touch(w.b); uf.union(w.a, w.b); }
  return uf;
}

// Red completa para el solucionador
export function buildNetlist(model, runtime = {}, opts = {}) {
  const uf = connectivity(model, { runtime });
  const idx = new Map(); let n = 0;
  const node = (k) => { const r = uf.find(k); if (!idx.has(r)) idx.set(r, n++); return idx.get(r); };
  const els = [], shorts = [];
  for (const p of model.parts) {
    const def = PARTS[p.type];
    if (def.board && !partHoles(p)) continue;
    const st = runtime[p.id] || {};
    let list = def.els(p, (pin) => termKey(p, pin), st, opts);
    if (opts.zeroSources) list = list.map(e => e.k === 'V' ? { ...e, v: 0 } : e);
    if (opts.skipMeters && def.meter) list = [];
    for (const e of list) {
      const en = { ...e, ta: e.a, tb: e.b, a: node(e.a), b: node(e.b), part: p.id };
      if (en.k === 'V' && en.a === en.b) { shorts.push(p.id); if (!opts.zeroSources) continue; }
      els.push(en);
    }
  }
  return { uf, els, shorts, alloc: node, get n() { return n; }, node: (k) => { const r = uf.find(k); return idx.has(r) ? idx.get(r) : -1; } };
}

// Aristas físicas de la red (para repartir la corriente por cables y tiras de la protoboard)
export function netEdges(model, runtime = {}) {
  const E = [];
  for (const p of model.parts) {
    const def = PARTS[p.type];
    if (def.board) { const hs = partHoles(p); if (hs) for (const pin in hs) E.push({ a: termKey(p, pin), b: 'h:' + hs[pin], kind: 'leg' }); }
    if (def.internal) for (const [x, y] of def.internal(p)) E.push({ a: termKey(p, x), b: termKey(p, y), kind: 'int', part: p.id, pins: [x, y] });
    if (def.merges) for (const [x, y] of def.merges(p, runtime[p.id] || {})) E.push({ a: termKey(p, x), b: termKey(p, y), kind: 'contact', part: p.id, pins: [x, y] });
    if (def.meter && p.probes) for (const pin of ['red', 'com']) if (p.probes[pin]) E.push({ a: termKey(p, pin), b: p.probes[pin], kind: 'probe', part: p.id, pin });
  }
  for (const w of model.wires) E.push({ a: w.a, b: w.b, kind: 'wire', id: w.id });
  const holes = new Set(); for (const e of E) for (const k of [e.a, e.b]) if (k.startsWith('h:')) holes.add(k);
  for (const h of holes) E.push({ a: h, b: 's:' + stripOf(h.slice(2)), kind: 'strip', hole: h.slice(2) });
  return E;
}
// Reparte las corrientes que entran y salen de cada terminal por un árbol de cada red.
// inj: { terminal: corriente que entra en la red desde un componente }. Devuelve el flujo (A) de cada arista en el sentido a→b.
export function routeCurrents(E, inj) {
  const adj = new Map(); const add = (k, i) => { if (!adj.has(k)) adj.set(k, []); adj.get(k).push(i); };
  E.forEach((e, i) => { e.flow = 0; if (e.a !== e.b) { add(e.a, i); add(e.b, i); } });
  const seen = new Set();
  for (const root of adj.keys()) {
    if (seen.has(root)) continue;
    const order = [], par = new Map(); seen.add(root); order.push(root); par.set(root, -1);
    for (let q = 0; q < order.length; q++) { const v = order[q]; for (const ei of adj.get(v)) { const e = E[ei]; const u = e.a === v ? e.b : e.a; if (seen.has(u)) continue; seen.add(u); par.set(u, ei); order.push(u); } }
    const sub = new Map(); for (const v of order) sub.set(v, inj[v] || 0);
    for (let q = order.length - 1; q > 0; q--) {
      const v = order[q], ei = par.get(v), e = E[ei]; const u = e.a === v ? e.b : e.a; const f = sub.get(v);
      e.flow = e.a === v ? f : -f; sub.set(u, sub.get(u) + f);
    }
  }
  return E;
}

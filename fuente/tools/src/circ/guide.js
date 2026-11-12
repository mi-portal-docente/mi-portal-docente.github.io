// Lógica de las prácticas guiadas: solución, estado de cada paso y comprobación final (puro).
import { PARTS, defaultState } from './parts.js';
import { connectivity } from './netlist.js';
import { matchTopology, partMatches, sameNetStructural } from './check.js';
import { simulate } from './engine.js';

const clone = (o) => JSON.parse(JSON.stringify(o));
export function makePart(pl) { return { id: pl.id, type: pl.type, ...(pl.at ? { at: pl.at } : { pos: [...pl.pos] }), rot: pl.rot || 0, props: { ...clone(PARTS[pl.type].props || {}), ...clone(pl.props || {}) }, state: defaultState(pl.type), ...(PARTS[pl.type].meter ? { probes: { red: null, com: null } } : {}) }; }

export function solutionModel(pr, upto = Infinity) {
  const m = { parts: [], wires: [] };
  pr.steps.forEach((st, i) => {
    if (i >= upto) return;
    if (st.place) m.parts.push(makePart(st.place));
    if (st.wire) m.wires.push({ ...st.wire });
    if (st.remove) m.wires = m.wires.filter(w => w.id !== st.remove);
    if (st.setMode) { const mp = m.parts.find(p => p.id === st.meterPart); if (mp) mp.props.mode = st.setMode; }
    if (st.measure) { const mp = m.parts.find(p => PARTS[p.type].meter); if (mp) { mp.props.mode = st.measure.mode; mp.probes = { red: st.measure.red, com: st.measure.com }; } }
    if (st.act && typeof st.act.test === 'function') { const p = m.parts.find(x => x.id === st.act.part); if (p) { if (p.type === 'switch') p.state.closed = true; if (p.type === 'slide' || p.type === 'spdt') p.state.pos = st.act.test({ pos: 1 }) ? 1 : 0; if (p.type === 'pot') p.state.pos = st.act.test({ pos: 0 }) ? 0 : 1; if (p.type === 'ldr') p.state.light = st.act.test({ light: 0 }) ? 0.05 : 0.95; } }
    if (st.act && st.act.test === 'toggled') { const p = m.parts.find(x => x.id === st.act.part); if (p && (p.type === 'spdt' || p.type === 'slide')) p.state.pos = 1 - (p.state.pos || 0); }
  });
  return m;
}

const mapKey = (k, map) => { const m = /^p:([^:]+):(.+)$/.exec(k); return m && map[m[1]] ? `p:${map[m[1]]}:${m[2]}` : k; };

// ctx: { model, running, map, snap (estado al empezar el paso), sim (resultado actual) }
export function stepDone(pr, i, ctx) {
  const st = pr.steps[i], { model, map } = ctx;
  if (st.place) {
    const used = new Set(Object.entries(map).filter(([k]) => k !== st.place.id).map(([, v]) => v));
    const s = makePart(st.place);
    const prev = map[st.place.id] && model.parts.find(p => p.id === map[st.place.id]);
    if (prev && partMatches(s, prev)) return true;
    const u = model.parts.find(p => !used.has(p.id) && partMatches(s, p));
    if (u) { map[st.place.id] = u.id; return true; }
    return false;
  }
  const uf = ctx.uf || (ctx.uf = connectivity(model, { structural: true }));
  if (st.wire) return sameNetStructural(model, mapKey(st.wire.a, map), mapKey(st.wire.b, map), uf);
  if (st.remove) { const w = pr.steps.find(x => x.wire && x.wire.id === st.remove).wire; return !sameNetStructural(model, mapKey(w.a, map), mapKey(w.b, map), uf); }
  if (st.sim) return !!ctx.running;
  if (st.stop) return !ctx.running;
  const meter = () => model.parts.find(p => p.id === map[st.meterPart || 'M1']) || model.parts.find(p => PARTS[p.type].meter);
  if (st.setMode) { const m = meter(); return !!m && m.props.mode === st.setMode; }
  if (st.act) {
    if (!ctx.running) return false;
    const p = model.parts.find(x => x.id === map[st.act.part]); if (!p) return false;
    if (st.act.test === 'toggled') return ctx.snap != null && JSON.stringify(p.state) !== ctx.snap;
    return !!st.act.test(p.state || {});
  }
  if (st.measure) {
    if (!ctx.running) return false;
    const m = meter(); if (!m || m.props.mode !== st.measure.mode || !m.probes?.red || !m.probes?.com) return false;
    const okR = sameNetStructural(model, m.probes.red, mapKey(st.measure.red, map), uf), okC = sameNetStructural(model, m.probes.com, mapKey(st.measure.com, map), uf);
    if (!okR || !okC) return false;
    const r = ctx.sim?.res?.[m.id]?.meter; if (!r) return false;
    if (st.measure.mode === 'A') return Math.abs(r.value) > 1e-5;
    if (st.measure.mode === 'Ω') return isFinite(r.value);
    return Math.abs(r.value) > 0.01;
  }
  return true;
}
export function stepTargetPartId(st) { return st.place?.id || st.act?.part || null; }

export function runChecks(pr, model, ctx = {}) {
  const sol = solutionModel(pr);
  const out = []; let map = ctx.map || {}, topoOk = true;
  for (const ch of pr.checks) {
    if (ch.topo) {
      const t = matchTopology(sol, model); topoOk = t.ok; if (t.map) map = { ...map, ...t.map };
      out.push({ label: 'El montaje coincide con el esquema', ok: t.ok, info: t.ok ? '' : t.msg });
    }
  }
  const run = (over = {}) => {
    const m = clone(model);
    for (const [sid, st] of Object.entries(over)) { const p = m.parts.find(x => x.id === map[sid]); if (p) p.state = { ...(p.state || {}), ...st }; }
    for (const p of m.parts) if (PARTS[p.type].meter) p.probes = { red: null, com: null };
    const r = simulate(m, {});
    return { get: (sid) => r.res[map[sid]] || {}, shorts: r.shorts, raw: r };
  };
  const c = { run };
  for (const ch of pr.checks) {
    if (ch.topo) continue;
    if (ch.measured) { out.push({ label: ch.label, ok: !!ctx.measured?.[ch.measured] }); continue; }
    if (!topoOk) { out.push({ label: ch.label, ok: false, info: 'Corrige primero el montaje.' }); continue; }
    let ok = false, info = '';
    try { ok = !!ch.fn(c); info = ch.info ? ch.info(c) : ''; } catch (e) { ok = false; info = 'No se ha podido comprobar.'; }
    out.push({ label: ch.label, ok, info });
  }
  return { items: out, ok: out.every(x => x.ok), map };
}

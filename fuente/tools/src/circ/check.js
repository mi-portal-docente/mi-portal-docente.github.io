// Comprobaciones de las prácticas: equivalencia de montaje (topología) y estado de cada paso.
import { PARTS } from './parts.js';
import { connectivity, termKey, partHoles, nodeKey } from './netlist.js';
import { stripOf } from './board.js';

const pinLabel = (p, pin) => { const d = PARTS[p.type]; const pn = d.pinNames?.[pin]; return `${d.label(p)}${pn ? ' (' + pn + ')' : d.pins.length > 1 ? ' (pata ' + pin + ')' : ''}`; };

export function sigCounts(parts) { const m = {}; for (const p of parts) { const s = PARTS[p.type].sig(p); m[s] = (m[s] || 0) + 1; } return m; }

export function matchTopology(sol, usr) {
  const sp = sol.parts.filter(p => !PARTS[p.type].meter), up = usr.parts.filter(p => !PARTS[p.type].meter);
  const sc = sigCounts(sp), uc = sigCounts(up);
  const missing = [], extra = [];
  const name = (sig) => { const p = sp.find(x => PARTS[x.type].sig(x) === sig) || up.find(x => PARTS[x.type].sig(x) === sig); return PARTS[p.type].label(p); };
  for (const s in sc) if ((uc[s] || 0) < sc[s]) missing.push(`${sc[s] - (uc[s] || 0)} × ${name(s)}`);
  for (const s in uc) if ((sc[s] || 0) < uc[s]) extra.push(`${uc[s] - (sc[s] || 0)} × ${name(s)}`);
  if (missing.length || extra.length) return { ok: false, msg: (missing.length ? 'Falta: ' + missing.join(', ') + '. ' : '') + (extra.length ? 'Sobra: ' + extra.join(', ') + '.' : '') };
  const bad = up.filter(p => PARTS[p.type].board && !partHoles(p));
  if (bad.length) return { ok: false, msg: `${PARTS[bad[0].type].label(bad[0])} no está bien pinchada en la protoboard.` };
  const ufS = connectivity(sol, { structural: true }), ufU = connectivity(usr, { structural: true });
  const same = (uf, a, b) => uf.find(a) === uf.find(b);
  const map = {}, tmap = {}, used = new Set(), mapped = [];
  let best = { depth: -1, pair: null };
  const order = [...sp].sort((a, b) => PARTS[b.type].pins.length - PARTS[a.type].pins.length);
  function rec(i) {
    if (i === order.length) return true;
    const s = order[i], def = PARTS[s.type], sig = def.sig(s);
    for (const u of up) {
      if (used.has(u.id) || PARTS[u.type].sig(u) !== sig) continue;
      for (const perm of (def.perms || [def.pins.map(x => x[0])])) {
        const added = []; let fail = null;
        def.pins.forEach(([pin], k) => { const ts = termKey(s, pin), tu = termKey(u, perm[k]); tmap[ts] = tu; added.push(ts); });
        outer: for (const t of added) for (const q of [...mapped, ...added]) {
          if (t === q) continue;
          if (same(ufS, t, q) !== same(ufU, tmap[t], tmap[q])) { fail = [t, q, same(ufS, t, q)]; break outer; }
        }
        if (!fail) {
          used.add(u.id); map[s.id] = u.id; mapped.push(...added);
          if (rec(i + 1)) return true;
          used.delete(u.id); delete map[s.id]; mapped.splice(mapped.length - added.length, added.length);
        } else if (i > best.depth) best = { depth: i, pair: fail, solPart: s };
        for (const t of added) delete tmap[t];
      }
    }
    return false;
  }
  if (rec(0)) return { ok: true, map };
  let msg = 'Las conexiones no coinciden con el esquema.';
  if (best.pair) {
    const [t, q, should] = best.pair;
    const lab = (key) => { const [, id, pin] = key.split(':'); const p = sol.parts.find(x => x.id === id); return pinLabel(p, pin); };
    msg = should ? `Deberían estar conectados: ${lab(t)} y ${lab(q)}.` : `No deberían estar conectados: ${lab(t)} y ${lab(q)}.`;
  }
  return { ok: false, msg, map: fallbackMap(sp, up) };
}
function fallbackMap(sp, up) { const map = {}, used = new Set(); for (const s of sp) { const u = up.find(x => !used.has(x.id) && PARTS[x.type].sig(x) === PARTS[s.type].sig(s)); if (u) { used.add(u.id); map[s.id] = u.id; } } return map; }

// ¿La pieza u ocupa (por columnas/carriles equivalentes) el sitio de la pieza esperada s?
export function partMatches(s, u) {
  const def = PARTS[s.type];
  if (u.type !== s.type || def.sig(u) !== def.sig(s)) return false;
  if (!def.board) return true;
  const hs = partHoles(s), hu = partHoles(u); if (!hs || !hu) return false;
  return (def.perms || [def.pins.map(x => x[0])]).some(perm => def.pins.every(([pin], k) => stripOf(hs[pin]) === stripOf(hu[perm[k]])));
}
export function sameNetStructural(model, a, b, uf) { uf = uf || connectivity(model, { structural: true }); return uf.find(nodeKey(a)) === uf.find(nodeKey(b)); }

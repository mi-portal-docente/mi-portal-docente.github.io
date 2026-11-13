// Motor de simulación: monta la red, resuelve y traduce a magnitudes por componente.
import { PARTS, LED_COLORS } from './parts.js';
import { buildNetlist, termKey, netEdges, routeCurrents } from './netlist.js';
import { solve } from './sim.js';

// Corriente que atraviesa un elemento de su terminal a hacia su terminal b
function elemFlow(e, I) {
  const i = I[e.id]; if (!isFinite(i)) return 0;
  if (e.k === 'V' || e.k === 'I') return -i; // la fuente empuja la corriente de b hacia a por dentro
  return i;
}
export function simulate(model, runtime = {}, opt = {}) {
  // Piezas con estado que depende de la solución (relé, transistor, probador de servos): se itera hasta que no cambian
  const iterParts = model.parts.filter(p => PARTS[p.type].iterate);
  let net, sol, don = opt.don || {};
  for (let it = 0; it < (iterParts.length ? 30 : 1); it++) {
    net = buildNetlist(model, runtime);
    for (const p of model.parts) if (PARTS[p.type].meter) { net.alloc(termKey(p, 'red')); net.alloc(termKey(p, 'com')); }
    sol = solve(net.n, net.els, { dt: opt.dt ?? Infinity, capV: opt.capV || {}, don });
    don = sol.don;
    if (!iterParts.length) break;
    const Vn = (k) => { const i = net.node(k); return i < 0 ? 0 : sol.V[i]; };
    let changed = false;
    for (const p of iterParts) {
      const st = runtime[p.id] || (runtime[p.id] = {});
      const s = { I: (id) => sol.I[id] ?? 0, V: (pin) => Vn(termKey(p, pin)) };
      if (PARTS[p.type].iterate(p, st, s)) changed = true;
    }
    if (!changed) break;
  }
  const V = (k) => { const i = net.node(k); return i < 0 ? 0 : sol.V[i]; };
  const res = {}, warnings = [], shorts = new Set(net.shorts);
  const capV = {};
  // corriente que entra/sale de cada terminal y flujo por cada cable
  const inj = {};
  for (const e of net.els) { const f = elemFlow(e, sol.I); if (!f) continue; inj[e.ta] = (inj[e.ta] || 0) - f; inj[e.tb] = (inj[e.tb] || 0) + f; }
  const edges = routeCurrents(netEdges(model, runtime), inj);
  const wireI = {}; for (const e of edges) if (e.kind === 'wire') wireI[e.id] = e.flow;
  for (const p of model.parts) {
    const def = PARTS[p.type]; const T = (pin) => termKey(p, pin); const st = runtime[p.id] || {};
    const r = res[p.id] = {};
    const pins = def.pins.map(x => x[0]);
    if (pins.length >= 2) r.v = V(T(pins[0])) - V(T(pins[pins.length - 1]));
    r.i = sol.I[p.id] ?? 0;
    r.pinI = Object.fromEntries(pins.map(pin => [pin, -(inj[T(pin)] || 0)])); // corriente que entra en la pieza por cada pata
    switch (p.type) {
      case 'resistor': r.p = r.v * r.i; if (Math.abs(r.p) > 0.25) warnings.push({ part: p.id, kind: 'hot', msg: `La resistencia de ${p.props.r} Ω disipa ${(r.p).toFixed(2).replace('.', ',')} W (más de 0,25 W): en la realidad se quemaría.` }); break;
      case 'led': r.bright = st.burnt ? 0 : Math.max(0, Math.min(1.4, r.i / 0.02)); r.on = r.i > 0.0004; r.over = r.i > 0.03; r.burn = r.i > 0.04; r.vf = LED_COLORS[p.props.color].vf; if (r.v < -5) warnings.push({ part: p.id, kind: 'rev', msg: 'Hay un LED conectado al revés: no luce (el ánodo, pata larga, va hacia el +).' }); break;
      case 'rgb': { const ch = ['r', 'g', 'b'].map(c => sol.I[p.id + ':' + c] ?? 0); r.ch = ch.map(i => st.burnt ? 0 : Math.max(0, Math.min(1.4, i / 0.02))); r.i = ch.reduce((a, b) => a + Math.max(0, b), 0); r.on = ch.some(i => i > 0.0004); r.burn = ch.some(i => i > 0.04); r.over = ch.some(i => i > 0.03); break; }
      case 'diode': r.burn = r.i > 1.5; break;
      case 'bulb': r.p = r.v * r.i; r.bright = st.burnt ? 0 : Math.max(0, r.p / def.pnom); r.burn = r.p > 2.5 * def.pnom; break;
      case 'motor': r.speed = r.v / 6; break;
      case 'buzzer': if (p.props.tipo === 'pasivo') { r.on = false; r.dc = Math.abs(r.i) > 0.005; if (r.dc) warnings.push({ part: p.id, kind: 'info', msg: 'El zumbador pasivo recibe corriente continua y no suena: necesita una señal que oscile. Usa uno activo o prográmalo con tone() en el ESP32.' }); } else { r.on = r.i > 0.001; r.vol = Math.min(1, r.i / 0.03); } break;
      case 'cap': capV[p.id] = r.v; if (r.v < -1) warnings.push({ part: p.id, kind: 'cap', msg: 'Condensador electrolítico conectado al revés: en la realidad podría reventar.' }); break;
      case 'pot': r.v1w = V(T('1')) - V(T('w')); r.vw2 = V(T('w')) - V(T('2')); r.i = sol.I[p.id + ':1w'] ?? 0; break;
      case 'tact': case 'slide': case 'spdt': case 'switch': case 'button': {
        const ce = edges.filter(e => e.kind === 'contact' && e.part === p.id); r.contactI = ce.reduce((a, e) => a + Math.abs(e.flow), 0); r.contacts = ce.map(e => ({ pins: e.pins, i: e.flow }));
        if (p.type === 'tact') { const ie = edges.filter(e => e.kind === 'int' && e.part === p.id); r.internalI = ie.map(e => ({ pins: e.pins, i: e.flow })); }
        break;
      }
      case 'relay': r.on = !!st.on; r.coilI = sol.I[p.id + ':coil'] ?? 0; r.coilV = V(T('b1')) - V(T('b2')); { const ce = edges.find(e => e.kind === 'contact' && e.part === p.id); r.contactI = ce ? ce.flow : 0; } break;
      case 'npn': r.ib = Math.max(0, sol.I[p.id + ':be'] ?? 0); r.ic = st.sat ? (sol.I[p.id + ':ce'] ?? 0) : (sol.I[p.id + ':ce'] ?? 0); r.vbe = V(T('b')) - V(T('e')); r.vce = V(T('c')) - V(T('e')); r.sat = !!st.sat; r.mode = r.ib < 1e-6 ? 'corte' : st.sat ? 'saturación' : 'activa'; r.burn = r.ic > 0.15 || r.ib > 0.02; if (r.ib > 0.005) warnings.push({ part: p.id, kind: 'hot', msg: 'La base del transistor recibe demasiada corriente: ponle una resistencia en serie (1 kΩ – 10 kΩ).' }); break;
      case 'servo': { const vs = V(T('v')) - V(T('gnd')); const sig = V(T('s')) - V(T('gnd')); r.powered = vs > 4; r.signal = sig > 0.2 && sig < 0.6; r.target = r.signal ? Math.max(0, Math.min(180, (sig - 0.25) / 0.25 * 180)) : null; if (vs > 7) warnings.push({ part: p.id, kind: 'hot', msg: 'El servo está alimentado con más de 6 V: en la realidad se estropearía.' }); break; }
      case 'stester': r.pw = !!st.pw; r.angle = Math.round((p.state?.knob ?? 0.5) * 180); break;
    }
    if (def.source) {
      const e = net.els.find(x => x.part === p.id && x.k === 'V');
      r.v = V(T('+')) - V(T('-'));
      if (shorts.has(p.id)) { r.short = true; r.i = Infinity; }
      else if (e) { r.i = sol.I[p.id]; if (r.i > Math.min(2, 0.5 * e.v / e.rint) && e.v > 0) { r.short = true; shorts.add(p.id); } }
      if (p.type === 'usb5' && r.i > 0.5 && !r.short) warnings.push({ part: p.id, kind: 'hot', msg: 'La fuente USB está dando más de 0,5 A: el cargador se protegería y cortaría.' });
    }
    if (def.meter) r.meter = meterReading(model, runtime, p, V, sol, net);
  }
  for (const id of shorts) warnings.unshift({ part: id, kind: 'short', msg: '¡Cortocircuito! El + y el − de la alimentación están unidos sin ningún receptor. Para la simulación y revisa los cables.' });
  return { res, warnings, shorts: [...shorts], capV, don: sol.don, converged: sol.converged, V, net, wireI, edges };
}

function meterReading(model, runtime, p, V, sol, net) {
  const st = runtime[p.id] || {}; const mode = p.props.mode;
  const att = !!(p.probes?.red && p.probes?.com);
  if (st.fuse) return { mode, text: 'FUSE', value: NaN, att };
  const jack = p.props.jack || 'VΩmA';
  if (jack === '10A' && mode !== 'A') { const i = att ? (sol.I[p.id] ?? 0) : 0; return { mode, value: NaN, unit: mode, text: mode === 'V' ? '0,00 V' : '0,0 Ω', att, wrongJack: true, i }; }
  if (mode === 'V') { const v = att ? V(termKey(p, 'red')) - V(termKey(p, 'com')) : 0; return { mode, value: v, unit: 'V', text: fmtMeter(v, 'V'), att }; }
  if (mode === 'A') { const i = att ? (sol.I[p.id] ?? 0) : 0; return { mode, value: i, unit: 'A', text: fmtMeter(i, 'A'), att, over: Math.abs(i) > (jack === '10A' ? 10 : 0.2), jack }; }
  // Ω: se resuelve aparte con las fuentes a 0 V y una corriente de prueba de 1 mA
  if (!att) return { mode, value: Infinity, unit: 'Ω', text: 'OL', att };
  const powered = Math.abs(V(termKey(p, 'red')) - V(termKey(p, 'com'))) > 0.05;
  const n2 = buildNetlist(model, runtime, { zeroSources: true, skipMeters: true });
  const a = n2.alloc(termKey(p, 'red')), b = n2.alloc(termKey(p, 'com'));
  const s2 = solve(n2.n, [...n2.els, { k: 'I', id: '_ohm', a, b, i: 1e-3 }], {});
  const R = a === b ? 0 : (s2.V[a] - s2.V[b]) / 1e-3;
  if (mode === '·)))') { const pita = R < 50; return { mode, value: R > 2e7 ? Infinity : R, unit: 'Ω', text: pita ? fmtMeter(R, 'Ω') + ' · pita' : 'OL', att, powered, beep: pita && !powered }; }
  return { mode, value: R > 2e7 ? Infinity : R, unit: 'Ω', text: R > 2e7 ? 'OL' : fmtMeter(R, 'Ω'), att, powered };
}
export function fmtMeter(v, unit) {
  const a = Math.abs(v);
  let s, u = unit;
  if (unit === 'Ω') { if (a >= 999500) { s = (v / 1e6).toFixed(2); u = 'MΩ'; } else if (a >= 999.5) { s = (v / 1e3).toFixed(a >= 1e5 ? 1 : 2); u = 'kΩ'; } else s = v.toFixed(1); }
  else if (unit === 'A') { if (a < 1) { s = (v * 1000).toFixed(a < 0.01 ? 2 : 1); u = 'mA'; } else s = v.toFixed(2); }
  else s = v.toFixed(a >= 10 ? 1 : 2);
  if (/^-0[.,]?0*$/.test(s)) s = s.slice(1);
  return s.replace('.', ',') + ' ' + u;
}

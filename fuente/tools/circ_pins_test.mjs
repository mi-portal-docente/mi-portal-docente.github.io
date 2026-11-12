// Pruebas unitarias del modelo por patas del Laboratorio de Circuitos (sin navegador): node circ_pins_test.mjs
import { simulate } from './src/circ/engine.js';
import { makePart } from './src/circ/guide.js';
import { matchTopology } from './src/circ/check.js';
import { PARTS } from './src/circ/parts.js';
import { partHoles } from './src/circ/netlist.js';
import { fitKind, validKinds, whyNot, socketOf, bestKind, startKinds } from './src/circ/connectors.js';
import { PRACTICES } from './src/circ/practices.js';
import { solutionModel, runChecks } from './src/circ/guide.js';
const res = []; const ok = (n, c, info = '') => { res.push(!!c); console.log((c ? 'OK  ' : 'FAIL') + ' ' + n + (info ? ' · ' + info : '')); };
const P = (id, type, where, props = {}, state) => { const p = makePart({ id, type, ...(typeof where === 'string' ? { at: where } : { pos: where }), props }); if (state) Object.assign(p.state, state); return p; };
const W = (id, a, b) => ({ id, a, b, color: 'rojo' });
const bat = (wires) => [W('wp', 'p:B1:+', 'h:tp2'), W('wn', 'p:B1:-', 'h:tn2'), ...wires];
const mA = (i) => (i * 1000).toFixed(1) + ' mA';

// ---- interruptor deslizante de 3 patas: el camino depende de la pata de extremo que se use
{
  const mk = (pos, throwCol) => ({ parts: [P('B1', 'bat9', [-23, -5]), P('S1', 'slide', 'c8', {}, { pos }), P('R1', 'resistor', 'b14', { r: 470 }), P('L1', 'led', 'e18')],
    wires: bat([W('w1', 'h:tp9', 'h:a9'), W('w2', 'h:a' + throwCol, 'h:a14'), W('w3', 'h:a19', 'h:tn19')]) });
  const on1 = simulate(mk(0, 8), {}).res.L1.i, off1 = simulate(mk(1, 8), {}).res.L1.i;
  ok('Interruptor 3 patas: común + pata 1 → luce solo en la posición C–1', on1 > 0.01 && off1 < 1e-4, `${mA(on1)} / ${mA(off1)}`);
  const on2 = simulate(mk(1, 10), {}).res.L1.i, off2 = simulate(mk(0, 10), {}).res.L1.i;
  ok('Interruptor 3 patas: común + pata 2 → luce solo en la posición C–2', on2 > 0.01 && off2 < 1e-4, `${mA(on2)} / ${mA(off2)}`);
  // error típico: usar las dos patas de los extremos → nunca conduce
  const ext = (pos) => ({ parts: [P('B1', 'bat9', [-23, -5]), P('S1', 'slide', 'c8', {}, { pos }), P('R1', 'resistor', 'b14', { r: 470 }), P('L1', 'led', 'e18')], wires: bat([W('w1', 'h:tp9', 'h:a8'), W('w2', 'h:a10', 'h:a14'), W('w3', 'h:a19', 'h:tn19')]) });
  ok('Interruptor 3 patas: con las dos patas de los extremos nunca se enciende', simulate(ext(0), {}).res.L1.i < 1e-4 && simulate(ext(1), {}).res.L1.i < 1e-4);
  const r = simulate(mk(0, 8), {}).res.S1;
  ok('Interruptor 3 patas: informa de la corriente por el contacto C–1', r.contacts?.length === 1 && r.contacts[0].pins.join('') === 'c1' && r.contactI > 0.01, JSON.stringify(r.contacts));
}
// ---- pulsador de 4 patas: pares 1–2 y 3–4 unidos por dentro
{
  ok('Pulsador: 4 patas a ambos lados del canal (e10, f10, e12, f12)', JSON.stringify(partHoles(P('P1', 'tact', 'e10'))) === JSON.stringify({ 1: 'e10', 2: 'f10', 3: 'e12', 4: 'f12' }));
  // error típico: pulsador girado 90° → las columnas 7 y 10 quedan unidas siempre por el par interno
  { const q = P('P1', 'tact', 'c10'); q.rot = 1; const hs = partHoles(q);
    const mk = (pressed) => { const b = P('P1', 'tact', 'c10', {}, { pressed }); b.rot = 1; return { parts: [P('B1', 'bat9', [-23, -5]), b, P('R1', 'resistor', 'b16', { r: 470 }), P('L1', 'led', 'e20')], wires: bat([W('w1', 'h:tp9', 'h:a7'), W('w2', 'h:a10', 'h:a16'), W('w3', 'h:a21', 'h:tn21')]) }; };
    ok('Pulsador girado 90° (patas c10, c7, e10, e7): luce siempre, sin pulsar (error típico)', hs && hs[2] === 'c7' && simulate(mk(false), {}).res.L1.i > 0.01, JSON.stringify(hs)); }
  const mk = (pressed, colOut, rowOut = 'j') => ({ parts: [P('B1', 'bat9', [-23, -5]), P('P1', 'tact', 'e10', {}, { pressed }), P('R1', 'resistor', 'b16', { r: 470 }), P('L1', 'led', 'e20')],
    wires: bat([W('w1', 'h:tp9', 'h:a10'), W('w2', `h:${rowOut}${colOut}`, 'h:a16'), W('w3', 'h:a21', 'h:tn21')]) });
  // diagonal: entra por la pata 1 (columna 10 arriba) y sale por la pata 4 (columna 12 abajo)
  const d0 = simulate(mk(false, 12), {}).res.L1.i, d1 = simulate(mk(true, 12), {}).res.L1.i;
  ok('Pulsador en diagonal (1 → 4): luce solo al pulsar', d0 < 1e-4 && d1 > 0.01, `${mA(d0)} / ${mA(d1)}`);
  // error típico: mismo par (1 → 2, la pata enfrentada al otro lado del canal) → siempre encendido
  const s0 = simulate(mk(false, 10), {}).res.L1.i, s1 = simulate(mk(true, 10), {}).res.L1.i;
  ok('Pulsador con el mismo par (1 → 2): luce siempre, sin pulsar (error típico)', s0 > 0.01 && s1 > 0.01, `${mA(s0)} / ${mA(s1)}`);
  const r = simulate(mk(false, 10), {}).res.P1;
  ok('Pulsador: la corriente pasa por la unión interna 1–2', r.internalI?.some(x => x.pins.join('') === '12' && Math.abs(x.i) > 0.01));
  // topología: el par usado se reconoce como equivalente (1↔3, 2↔4)
  const sol = mk(false, 12), usr = JSON.parse(JSON.stringify(sol)); usr.wires[3] = W('w2', 'h:j12', 'h:a16');
  ok('Pulsador: comprobación de topología acepta el montaje equivalente', matchTopology(sol, usr).ok);
  const bad = JSON.parse(JSON.stringify(sol)); bad.wires[3] = W('w2', 'h:j10', 'h:a16');
  const t = matchTopology(sol, bad);
  ok('Pulsador: comprobación de topología detecta el mismo par', !t.ok, t.msg);
}
// ---- LED: polaridad
{
  const mk = (at) => ({ parts: [P('B1', 'bat9', [-23, -5]), P('R1', 'resistor', 'b10', { r: 470 }), P('L1', 'led', at)], wires: bat([W('w1', 'h:tp9', 'h:a10'), W('w3', 'h:a15', 'h:tn15')]) });
  const fw = simulate(mk('e14'), {}).res.L1;
  const rv = P('L1', 'led', 'e15'); rv.rot = 2; // girado 180°: ánodo en la columna 15, cátodo en la 14
  const m2 = mk('e14'); m2.parts[2] = rv; const r2 = simulate(m2, {});
  ok('LED: con el ánodo hacia el + luce (≈15 mA)', fw.on && fw.i > 0.013, mA(fw.i));
  ok('LED al revés: no luce y avisa', !r2.res.L1.on && r2.warnings.some(w => w.kind === 'rev'), r2.warnings.map(w => w.kind).join(','));
  const nores = { parts: [P('B1', 'bat9', [-23, -5]), P('L1', 'led', 'e14')], wires: bat([W('w1', 'h:tp9', 'h:a14'), W('w2', 'h:a15', 'h:tn15')]) };
  ok('LED sin resistencia: corriente de fundirse', simulate(nores, {}).res.L1.burn);
}
// ---- LED RGB cátodo y ánodo común
{
  const mk = (common) => ({ parts: [P('B1', 'bat9', [-23, -5]), P('X', 'rgb', 'e10', { common }), P('R1', 'resistor', 'b4', { r: 470 })],
    wires: bat(common === 'cátodo' ? [W('w1', 'h:tp3', 'h:a4'), W('w2', 'h:a8', 'h:a10'), W('w3', 'h:a11', 'h:tn11')] : [W('w1', 'h:tp11', 'h:a11'), W('w2', 'h:a10', 'h:a8'), W('w3', 'h:a4', 'h:tn4')]) });
  const c = simulate(mk('cátodo'), {}).res.X, a = simulate(mk('ánodo'), {}).res.X;
  ok('LED RGB cátodo común: la común al − y el rojo luce', c.ch[0] > 0.5 && c.ch[1] < 0.01, c.ch.map(x => x.toFixed(2)).join('/'));
  ok('LED RGB ánodo común: la común al + y el rojo luce', a.ch[0] > 0.5, a.ch.map(x => x.toFixed(2)).join('/'));
  const wrong = mk('ánodo'); wrong.parts[1].props.common = 'cátodo';
  ok('LED RGB con la común equivocada: no luce', !simulate(wrong, {}).res.X.on);
}
// ---- relé: bobina, COM/NO/NC
{
  const mk = (pressed) => ({ parts: [P('B1', 'aa4', [-31, -1]), P('K1', 'relay', 'e14'), P('P1', 'tact', 'e6', {}, { pressed }), P('L1', 'bulb', 'b22'), P('L2', 'led', 'h22'), P('R2', 'resistor', 'g16', { r: 330 }), P('D1', 'diode', 'c10')],
    wires: bat([W('w1', 'h:tp5', 'h:a6'), W('w2', 'h:j8', 'h:j14'), W('w3', 'h:a14', 'h:tn13'), W('w4', 'h:tp19', 'h:a18'), W('w5', 'h:j18', 'h:a22'), W('w6', 'h:a24', 'h:tn24'), W('w7', 'h:j16', 'h:bp16'), W('wd1', 'h:a10', 'h:b14'), W('wd2', 'h:a14x', 'h:a14')].filter(w => !w.a.includes('x'))) });
  // montaje sencillo de verificación: bobina entre j14 (b2 en f14? ver pines) — se comprueban los contactos con el modelo directo
  const K = P('K1', 'relay', 'e14'); const hs = partHoles(K);
  ok('Relé: 5 patas (B1, COM arriba; B2, NC, NO abajo)', hs && hs.b1 === 'e14' && hs.com === 'e18' && hs.b2 === 'f14' && hs.nc === 'f16' && hs.no === 'f18', JSON.stringify(hs));
  const relay = (on) => ({ parts: [P('B1', 'aa4', [-31, -1]), P('K1', 'relay', 'e14'), P('S1', 'slide', 'c6', {}, { pos: on ? 1 : 0 }), P('L1', 'bulb', 'h24'), P('L2', 'led', 'h20'), P('R2', 'resistor', 'g8', { r: 330 })],
    wires: bat([W('w1', 'h:tp7', 'h:a7'), W('w2', 'h:a8', 'h:a14'), W('w3', 'h:j14', 'h:bn13'), W('w4', 'h:tp19', 'h:a18'), W('w5', 'h:j18', 'h:j24'), W('w6', 'h:j26', 'h:bn25'), W('w7', 'h:j16', 'h:j12'), W('w8', 'h:i8', 'h:i20'), W('w9', 'h:j21', 'h:bn21'), W('wb', 'h:tn3', 'h:bn3')]) });
  const off = simulate(relay(false), {}), on = simulate(relay(true), {});
  ok('Relé en reposo: COM–NC (LED encendido, bombilla apagada)', !off.res.K1.on && off.res.L2.on && off.res.L1.bright < 0.05, `LED ${mA(off.res.L2.i)} · bombilla ${off.res.L1.bright.toFixed(2)}`);
  ok('Relé activado: COM–NO (bombilla encendida, LED apagado)', on.res.K1.on && !on.res.L2.on && on.res.L1.bright > 0.5, `bobina ${mA(on.res.K1.coilI)} · bombilla ${on.res.L1.bright.toFixed(2)}`);
}
// ---- transistor NPN: corte, activa y saturación
{
  const mk = (rb, rc = 330) => ({ parts: [P('B1', 'bat9', [-23, -5]), P('Q1', 'npn', 'c14'), P('RB', 'resistor', 'b6', { r: rb }), P('RC', 'resistor', 'h10', { r: rc }), P('L1', 'led', 'h14')],
    wires: bat([W('w1', 'h:tp5', 'h:a6'), W('w2', 'h:a10', 'h:a15'), W('w3', 'h:a16', 'h:tn16'), W('w4', 'h:bp9', 'h:j10'), W('w5', 'h:j15', 'h:a14'), W('wb', 'h:tp20', 'h:bp20')]) });
  // LED (ánodo h14, cátodo h15) → colector (a14 por w5... ) — circuito: + → RC → LED → C ; B ← RB ← + ; E → −
  const m1 = mk(1e7), m2 = mk(470000), m3 = mk(4700);
  const r1 = simulate(m1, {}).res.Q1, r2 = simulate(m2, {}).res.Q1, r3 = simulate(m3, {}).res.Q1;
  ok('NPN sin corriente de base apreciable: casi en corte', r1.ic < 0.0005, `Ic=${mA(r1.ic)}`);
  ok('NPN en zona activa: Ic ≈ β·Ib', r2.mode === 'activa' && Math.abs(r2.ic / r2.ib - 200) < 5, `Ib=${(r2.ib * 1e6).toFixed(1)} µA Ic=${mA(r2.ic)} (${r2.mode})`);
  ok('NPN saturado: Vce pequeña e Ic limitada por la carga', r3.mode === 'saturación' && r3.vce < 0.3 && r3.ic > 0.015, `Vce=${r3.vce.toFixed(2)} Ic=${mA(r3.ic)}`);
}
// ---- zumbador activo/pasivo
{
  const mk = (tipo) => ({ parts: [P('B1', 'aa2', [-31, -1]), P('Z1', 'buzzer', 'e10', { tipo })], wires: bat([W('w1', 'h:tp9', 'h:a10'), W('w2', 'h:a12', 'h:tn13')]) });
  ok('Zumbador activo suena con continua', simulate(mk('activo'), {}).res.Z1.on);
  const p = simulate(mk('pasivo'), {}); ok('Zumbador pasivo con continua: no suena y avisa', !p.res.Z1.on && p.warnings.some(w => /pasivo/.test(w.msg)));
}
// ---- servo con probador
{
  const mk = (knob, power = true) => ({ parts: [P('B1', 'aa4', [-31, -1]), P('PS', 'stester', [20, 14], {}, { knob }), P('SV', 'servo', [36, 14])],
    wires: [...(power ? [W('a', 'p:B1:+', 'p:PS:in+'), W('b', 'p:B1:-', 'p:PS:in-')] : []), W('c', 'p:PS:gnd', 'p:SV:gnd'), W('d', 'p:PS:v', 'p:SV:v'), W('e', 'p:PS:s', 'p:SV:s')] });
  const r0 = simulate(mk(0), {}).res.SV, r1 = simulate(mk(1), {}).res.SV, rn = simulate(mk(0.5, false), {}).res.SV;
  ok('Servo: el ángulo sigue al mando del probador (0° y 180°)', r0.powered && Math.abs(r0.target) < 3 && Math.abs(r1.target - 180) < 3, `${r0.target?.toFixed(0)}° / ${r1.target?.toFixed(0)}°`);
  ok('Servo sin alimentación: no se mueve', !rn.powered && rn.target == null);
}
// ---- polímetro: bornes
{
  const mk = (mode, jack) => { const m = P('M1', 'meter', [27, 0], { mode, jack }); m.probes = { red: 'h:tp20', com: 'h:tn20' }; return { parts: [P('B1', 'bat9', [-23, -5]), m], wires: bat([]) }; };
  const v = simulate(mk('V', 'VΩmA'), {}); ok('Polímetro: V con la roja en VΩmA mide la pila (≈9 V)', Math.abs(v.res.M1.meter.value - 9) < 0.05, v.res.M1.meter.text);
  const w = simulate(mk('V', '10A'), {}); ok('Polímetro: V con la roja en 10A → cortocircuito', w.shorts.includes('B1') && w.res.M1.meter.wrongJack);
  const a = simulate(mk('A', 'VΩmA'), {}); ok('Polímetro: A en paralelo con la pila (borne mA) → fusible', a.res.M1.meter.over);
}
// ---- conectores
{
  const model = { parts: [P('B1', 'bat9', [-23, -5]), P('MOT', 'motor', [30, 0]), P('F', 'supply', [0, 30]), P('U', 'usb5', [-30, 20]), P('SV', 'servo', [30, 20]), P('A', 'aa4', [-31, -1])] };
  const so = (k) => socketOf(k, model);
  ok('Conector: macho-macho a la protoboard (agujero ↔ agujero)', fitKind('mm', 'hole', 'hole') >= 0);
  ok('Conector: hembra en la protoboard se rechaza y se explica', fitKind('hh', 'hole', 'hole') < 0 && /hembra/.test(whyNot('hh', 'hole', 'hole')), whyNot('hh', 'hole', 'hole'));
  ok('Conector: macho-hembra de la protoboard a un pin macho (USB 5 V)', fitKind('mh', 'hole', so('p:U:+')) >= 0 && fitKind('mm', 'hole', so('p:U:+')) < 0, whyNot('mm', 'hole', so('p:U:+')));
  ok('Conector: el borne de la pila de 9 V necesita pinza de cocodrilo', fitKind('cm', so('p:B1:+'), 'hole') >= 0 && fitKind('mm', so('p:B1:+'), 'hole') < 0, whyNot('mm', so('p:B1:+'), 'hole'));
  ok('Conector: el motor se conecta con cocodrilos', JSON.stringify(validKinds(so('p:MOT:1'), so('p:MOT:2'))) === JSON.stringify(['cc']));
  ok('Conector: fuente de laboratorio con banana', fitKind('bb', so('p:F:+'), so('p:F:-')) >= 0 && fitKind('bc', so('p:F:+'), so('p:MOT:1')) >= 0);
  ok('Conector: una pinza de cocodrilo no entra en un agujero', fitKind('cc', 'hole', 'hole') < 0 && /cocodrilo/.test(whyNot('cc', 'hole', 'hole')));
  ok('Conector: servo (hembra) a la protoboard con macho-macho', fitKind('mm', so('p:SV:s'), 'hole') >= 0 && fitKind('mh', so('p:SV:s'), 'hole') < 0);
  ok('Conector: portapilas (punta estañada) a la protoboard con macho-hembra', bestKind(so('p:A:+'), 'hole') === 'mh');
  ok('Conector: desde un agujero solo pueden salir macho o rígido', JSON.stringify(startKinds('hole')) === JSON.stringify(['mm', 'mh', 'rig', 'cm']), startKinds('hole').join(','));
}
// ---- todas las prácticas: la solución pasa sus comprobaciones
for (const pr of PRACTICES) {
  const sol = solutionModel(pr); const r = runChecks(pr, sol, { map: Object.fromEntries(sol.parts.map(p => [p.id, p.id])), measured: Object.fromEntries(pr.steps.filter(s => s.key).map(s => [s.key, true])) });
  ok(`Práctica ${pr.id}: la solución cumple las comprobaciones`, r.ok, r.items.filter(i => !i.ok).map(i => i.label + ' ' + (i.info || '')).join(' | '));
  for (const p of sol.parts) if (PARTS[p.type].board && !partHoles(p)) ok(`Práctica ${pr.id}: ${p.id} bien pinchado`, false);
}
console.log(`\n${res.filter(Boolean).length}/${res.length} pruebas de patas OK`);
process.exit(res.every(Boolean) ? 0 : 1);

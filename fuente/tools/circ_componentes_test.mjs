// Pruebas (puras) de los componentes nuevos de Circuitos y de las prácticas 17 a 21.
import { PRACTICES } from './src/circ/practices.js';
import { solutionModel, runChecks } from './src/circ/guide.js';
import { simulate } from './src/circ/engine.js';
let ok = 0, fallos = 0; const t = (n, c) => { if (c) { ok++; console.log('OK  ', n); } else { fallos++; console.log('FALLO', n); } };
const clone = (o) => JSON.parse(JSON.stringify(o));
const pr = (id) => PRACTICES.find((p) => p.id === id);
const sim = (m) => simulate(m, {});
const set = (m, id, st) => { const p = m.parts.find((x) => x.id === id); p.state = { ...p.state, ...st }; return m; };
// fusible
let m = solutionModel(pr('c17'));
let r = sim(set(clone(m), 'P1', { pressed: false })).res.F1; t('Fusible: con la bombilla trabaja por debajo del calibre', r.ratio > 0.3 && r.ratio < 1);
r = sim(set(clone(m), 'P1', { pressed: true })).res.F1; t('Fusible: con el cortocircuito pasa más de 10 veces su calibre', r.ratio > 10);
const fund = set(clone(m), 'F1', { blown: true }); r = sim(fund); t('Fusible fundido: circuito abierto, bombilla apagada y 6 V entre sus patas', r.res.L1.bright < 0.01 && Math.abs(r.res.F1.v) > 5);
t('Comprobación: sin cambiar el fusible no se da por buena', !runChecks(pr('c17'), m).ok);
// final de carrera
m = solutionModel(pr('c18'));
t('Final de carrera en reposo: C–NC (motor gira)', Math.abs(sim(set(clone(m), 'FC1', { pos: 0 })).res.MOT1.speed) > 0.3);
t('Final de carrera accionado: C–NO (motor parado, LED)', (() => { const x = sim(set(clone(m), 'FC1', { pos: 1 })).res; return Math.abs(x.MOT1.speed) < 0.05 && x.L1.on; })());
// diodo
m = solutionModel(pr('c19')); r = sim(m).res;
t('Diodo en directa: cae unos 0,7 V', r.D1.on && r.D1.v > 0.6 && r.D1.v < 0.85);
t('Diodo en inversa: bloquea', !r.D2.on && r.D2.rev && !r.L2.on);
const mal = clone(m); const d1 = mal.parts.find((p) => p.id === 'D1'); d1.at = 'c12'; d1.rot = 2; // D1 girado
t('Comprobación: con D1 al revés no se da por buena', !runChecks(pr('c19'), mal, { measured: { vd: true } }).ok);
// transistor
m = solutionModel(pr('c20'));
t('NPN sin base: corte', sim(set(clone(m), 'P1', { pressed: false })).res.Q1.mode === 'corte');
t('NPN con base: saturación y LED encendido', (() => { const x = sim(set(clone(m), 'P1', { pressed: true })).res; return x.Q1.sat && x.L1.on; })());
// automatismo
m = solutionModel(pr('c21'));
const a = sim(set(set(clone(m), 'S1', { pos: 1 }), 'FC1', { pos: 0 })).res, b = sim(set(set(clone(m), 'S1', { pos: 1 }), 'FC1', { pos: 1 })).res;
t('Relé gobernado por transistor: marcha y paro por final de carrera', a.K1.on && Math.abs(a.MOT1.speed) > 0.3 && !b.K1.on && Math.abs(b.MOT1.speed) < 0.05);
// todas las soluciones de 17 a 21 pasan su comprobación
for (const id of ['c17', 'c18', 'c19', 'c20', 'c21']) { const s = solutionModel(pr(id)); for (const p of s.parts) if (p.type === 'fuse') p.state.cambios = 1; t(`Solución de ${id} en verde`, runChecks(pr(id), s, { measured: { vd: true } }).ok); }
console.log(`\n${ok}/${ok + fallos} pruebas de componentes nuevos OK`); if (fallos) process.exit(1);

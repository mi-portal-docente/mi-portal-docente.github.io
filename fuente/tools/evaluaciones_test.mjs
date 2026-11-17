// Pruebas: «Evaluación de circuitos» por niveles (corrección automática sin pasos ni pistas).
import { EVALS, evalDe, practicaDe, corregirNivel, corregirCircuito, checksSolo, autonomaDe, idAutonoma } from './src/circ/evaluaciones.js';
import { PRACTICES } from './src/circ/practices.js';
import { solutionModel } from './src/circ/guide.js';
let ok = 0, fallos = 0; const t = (n, c) => { if (c) { ok++; console.log('OK  ', n); } else { fallos++; console.log('FALLO', n); } };
const vacio = () => ({ parts: [], wires: [] });
t('Hay al menos 4 niveles numerados n1…', EVALS.length >= 4 && EVALS.every((e, i) => e.id === 'n' + (i + 1) && e.nivel === i + 1));
t('Cada nivel agrupa varios circuitos de prácticas que existen', EVALS.every(e => e.circuitos.length >= 2 && e.circuitos.every(c => PRACTICES.some(p => p.id === c.de))));
t('Cada circuito tiene enunciado propio (sin pasos)', EVALS.every(e => e.circuitos.every(c => typeof c.enunciado === 'string' && c.enunciado.length > 40)));
t('Cubren serie/paralelo, LED, interruptores y componentes nuevos', ['c4', 'c5', 'c13', 'c1', 'c17', 'c18', 'c19', 'c20', 'c21'].every(id => EVALS.some(e => e.circuitos.some(c => c.de === id))));
t('evalDe/practicaDe', evalDe('n2')?.nivel === 2 && evalDe('x') == null && practicaDe(EVALS[0].circuitos[0]).id === EVALS[0].circuitos[0].de);
t('Sin comprobaciones de medida ni de pasos guiados', EVALS.every(e => e.circuitos.every(c => checksSolo(practicaDe(c)).every(k => !k.soloGuiada && !k.measured))));
for (const e of EVALS) {
  const sol = corregirNivel(e, e.circuitos.map(c => solutionModel(practicaDe(c))));
  t(`${e.id}: el montaje de la solución saca un 10`, sol.nota === 10 && sol.ok && sol.correctos === e.circuitos.length);
  const nada = corregirNivel(e, e.circuitos.map(vacio));
  t(`${e.id}: sin montar saca un 0`, nada.nota === 0 && !nada.ok && nada.correctos === 0);
  const medio = corregirNivel(e, e.circuitos.map((c, i) => i === 0 ? solutionModel(practicaDe(c)) : vacio()));
  t(`${e.id}: uno bien y el resto vacíos → nota proporcional`, medio.correctos === 1 && medio.nota > 0 && medio.nota < 10 && !medio.ok);
}
// cambiar un valor (resistencia) hace fallar ese circuito pero no los demás
const e1 = EVALS[0]; const mods = e1.circuitos.map(c => solutionModel(practicaDe(c)));
const r = mods[0].parts.find(p => p.type === 'resistor');
if (r) { r.props = { ...r.props, r: 1 }; const res = corregirNivel(e1, mods); t('Un valor mal puesto: ese circuito no es correcto y la nota baja', !res.circuitos[0].ok && res.circuitos.slice(1).every(c => c.ok) && res.nota < 10); }
const c1 = corregirCircuito(practicaDe(e1.circuitos[0]), vacio());
t('corregirCircuito devuelve requisitos legibles', Array.isArray(c1.items) && c1.items.length === c1.n && c1.items.every(i => typeof i.t === 'string'));
t('Autónoma: aN ↔ cN para todas las prácticas', PRACTICES.every(p => autonomaDe(idAutonoma(p.id))?.practica === p.id) && autonomaDe('a99') === null && autonomaDe('c3') === null);
t('Autónoma: la solución de cada práctica pasa y un montaje vacío no', PRACTICES.every(p => { const A = autonomaDe(idAutonoma(p.id)); return corregirNivel(A, [solutionModel(p)]).ok && !corregirNivel(A, [vacio()]).ok; }));
console.log(`\n${ok}/${ok + fallos} pruebas de evaluación OK`); if (fallos) process.exit(1);

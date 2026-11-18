// Pruebas: todas las prácticas (guiadas cN, autónomas aN y niveles de evaluación nN) tienen corrección
// automática y un estado coherente. Ninguna guiada queda «Pendiente de corregir» (como si la corrigiera el profesor).
import { readFileSync } from 'node:fs';
import { PRACTICES } from './src/circ/practices.js';
import { solutionModel, runChecks } from './src/circ/guide.js';
import { EVALS, autonomaDe, idAutonoma, corregirCircuito, corregirNivel, checksSolo } from './src/circ/evaluaciones.js';
let ok = 0, fallos = 0; const t = (n, c, info = '') => { if (c) { ok++; console.log('OK  ', n); } else { fallos++; console.log('FALLO', n, info); } };
const vacio = { parts: [], wires: [] };
for (const pr of PRACTICES) {
  const sol = solutionModel(pr);
  // (las comprobaciones de medir o propias del recorrido guiado se prueban en circ_test.mjs, paso a paso)
  const g = runChecks({ ...pr, checks: checksSolo(pr) }, sol, {});
  t(`${pr.id} (práctica ${pr.n}): tiene comprobación automática y la solución la supera`, pr.checks.length > 0 && g.ok, g.items.filter(x => !x.ok).map(x => x.label).join(' | '));
  t(`${pr.id}: un montaje vacío no la supera`, !runChecks(pr, vacio, {}).ok);
  const A = autonomaDe(idAutonoma(pr.id));
  t(`${idAutonoma(pr.id)} (autónoma ${pr.n}): existe, se corrige sola y la solución sale bien`, A && A.practica === pr.id && checksSolo(pr).length > 0 && corregirCircuito(pr, sol).ok && !corregirCircuito(pr, vacio).ok);
}
for (const ev of EVALS) {
  const r = corregirNivel(ev, ev.circuitos.map(c => solutionModel(PRACTICES.find(p => p.id === c.de))));
  t(`${ev.id} (nivel ${ev.nivel}): nota automática 10 con las soluciones y 0 en blanco`, r.ok && r.nota === 10 && corregirNivel(ev, []).nota === 0 && !corregirNivel(ev, []).ok, JSON.stringify(r).slice(0, 200));
}
const src = readFileSync(new URL('./src/circ/lab.js', import.meta.url), 'utf8');
t('El laboratorio ya no muestra «Pendiente de corregir» en las guiadas', !/Pendiente de corregir/.test(src));
console.log(`\n${ok}/${ok + fallos} comprobaciones OK`); process.exit(fallos ? 1 : 0);

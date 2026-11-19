// Pruebas v5 · 6c (examen distinto por alumno con semilla), 6d (subniveles) y 6e (alumno × criterio). node --test examen_v5_test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { versionAlumno, semillaAlumno, corregirExamen } from './src/lms/modelo.js';
import { preguntaHTML } from './src/portal/examen-ui.js';

const ex = { barajar: true, preguntas: Array.from({ length: 8 }, (_, i) => ({ id: 'q' + (i + 1), tipo: 'test', enunciado: 'P' + i, opciones: ['a', 'b', 'c', 'd'], puntos: 1 })) };
test('6c: cada alumno su orden de preguntas y de opciones, siempre el mismo (semilla)', () => {
  const a = versionAlumno(ex, 'it1', 'g1_1'); const a2 = versionAlumno(ex, 'it1', 'g1_1'); const b = versionAlumno(ex, 'it1', 'g1_2');
  assert.equal(a.semilla, semillaAlumno('it1', 'g1_1'));
  assert.deepEqual(a.preguntas.map((q) => q.id), a2.preguntas.map((q) => q.id));
  assert.deepEqual(a.opciones, a2.opciones);
  assert.notDeepEqual(a.preguntas.map((q) => q.id), b.preguntas.map((q) => q.id));
  assert.deepEqual(a.preguntas.map((q) => q.id).sort(), ex.preguntas.map((q) => q.id).sort());
  assert.ok(Object.values(a.opciones).every((o) => [...o].sort().join() === '0,1,2,3'));
  assert.deepEqual(ex.preguntas.map((q) => q.id), ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8']); // no cambia el original
});
test('6c: la revisión del profesor ve las opciones en el mismo orden que el alumno', () => {
  const V = versionAlumno(ex, 'it1', 'g1_3');
  for (const q of V.preguntas) {
    const html = preguntaHTML(q, undefined, { n: 1, barajarOps: true, s: V.semilla });
    const orden = [...html.matchAll(/value="(\d)"/g)].map((m) => +m[1]);
    assert.deepEqual(orden, V.opciones[q.id]);
  }
});
test('6c: sin barajar, el orden del examen y sin opciones barajadas', () => {
  const V = versionAlumno({ ...ex, barajar: false }, 'it1', 'g1_1');
  assert.deepEqual(V.preguntas.map((q) => q.id), ex.preguntas.map((q) => q.id)); assert.deepEqual(V.opciones, {});
});
test('6c: la nota no depende del orden (respuestas por id)', () => {
  const k = Object.fromEntries(ex.preguntas.map((q) => [q.id, 2])); const r = { q1: 2, q2: 2, q3: 0 };
  assert.equal(corregirExamen(versionAlumno(ex, 'it1', 'g1_1').preguntas, k, r).puntos, corregirExamen(ex.preguntas, k, r).puntos);
});

import { subniveles } from './src/lms/modelo.js';
import { leerRubricaQ, rubricaQTexto, validarPregunta } from './src/lms/preguntas.js';
import { leerPreguntasBanco } from './src/lms/banco.js';
test('6d: subniveles con paso (0, 0,25, 0,5…) y sin paso (0 y 4 niveles)', () => {
  assert.deepEqual(subniveles(1, 0.25), [0, 0.25, 0.5, 0.75, 1]);
  assert.deepEqual(subniveles(0.5, 0.25), [0, 0.25, 0.5]);
  assert.deepEqual(subniveles(1, 0.3), [0, 0.3, 0.6, 0.9, 1]);
  assert.deepEqual(subniveles(2), [0, 0.5, 1, 1.5, 2]);
  assert.deepEqual(subniveles(10, 0.25), [0, 2.5, 5, 7.5, 10]); // demasiados botones → 4 niveles
});
test('6d: rúbrica del editor «Criterio | puntos | paso», compatible con la de antes y sin perder niveles', () => {
  const prev = [{ c: 'Plantea', p: 1, niveles: ['a', 'b', 'c', 'd'] }];
  assert.deepEqual(leerRubricaQ(['Plantea | 1 | 0,25', 'Explica la causa | 2', 'Sin puntos', 'Una | barra | 1'], prev), [
    { c: 'Plantea', p: 1, niveles: ['a', 'b', 'c', 'd'], paso: 0.25 }, { c: 'Explica la causa', p: 2 }, { c: 'Sin puntos', p: 1 }, { c: 'Una | barra', p: 1 }]);
  assert.equal(rubricaQTexto([{ c: 'Plantea', p: 1, paso: 0.25 }, { c: 'X', p: 2 }]), 'Plantea | 1 | 0.25\nX | 2');
});
test('6d: el paso del apartado se guarda al validar y al importar al banco', () => {
  const q = validarPregunta({ tipo: 'abierta', enunciado: 'E', rubrica: [{ c: 'A', p: 1, paso: 0.25 }, { c: 'B', p: 1, paso: 5 }] }, 0, () => { });
  assert.equal(q.rubrica[0].paso, 0.25); assert.ok(!('paso' in q.rubrica[1]));
  const r = leerPreguntasBanco(JSON.stringify([{ tipo: 'abierta', enunciado: 'E', criterio: 'c1', apartados: [{ texto: 'A', puntos: 0.5, paso: '0,25' }] }]));
  assert.deepEqual(r.errores, []); assert.equal(r.preguntas[0].rubrica[0].paso, 0.25);
});

import { examenAlumnoCriterio, csvAlumnoCriterio } from './src/lms/analitica.js';
test('6e: alumno × criterio de un examen (puntos, nota 0–10, lo puesto a mano manda; sin nombres)', () => {
  const P = [{ id: 'q1', tipo: 'vf', puntos: 1, criterio: 'c1' }, { id: 'q2', tipo: 'vf', puntos: 1, criterio: 'c1' }, { id: 'q3', tipo: 'abierta', puntos: 2, criterio: 'c2' }, { id: 'q4', tipo: 'vf', puntos: 1 }];
  const K = { q1: true, q2: true, q4: true };
  const T = examenAlumnoCriterio(P, K, [{ n: 7, respuestas: { q1: true, q2: false, q4: true }, detalle: { q3: 1.5 } }, { n: 2, respuestas: { q1: true, q2: true } }], 'cx');
  assert.deepEqual(T.criterios, ['c1', 'c2', 'cx']);
  assert.deepEqual(T.filas.map((f) => f.n), [2, 7]);
  assert.deepEqual(T.filas[1].celdas.c1, { got: 1, max: 2, nota: 5 }); assert.deepEqual(T.filas[1].celdas.c2, { got: 1.5, max: 2, nota: 7.5 });
  assert.equal(T.filas[0].celdas.c1.nota, 10); assert.equal(T.filas[0].celdas.c2.nota, 0);
  assert.deepEqual(csvAlumnoCriterio(T), [['nº de lista', 'c1', 'c2', 'cx'], ['02', '10', '0', '0'], ['07', '5', '7,5', '10']]);
});

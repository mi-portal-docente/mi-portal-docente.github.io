// Pruebas del banco v5: tema, dificultad, apartados, paso, plantillas y versiones sin repetir (node --test banco_v5_test.mjs)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { leerPreguntasBanco, filtrarBanco, temasBanco, generarDesdePlantilla, generarVersiones, validarPlantilla, limpiarPlantilla, generarExamen, leeDificultad } from './src/lms/banco.js';
import { separarPregunta, unirPregunta } from './src/lms/preguntas.js';
import { corregirExamen } from './src/lms/modelo.js';
import { tablaPorCriterio } from './src/lms/analitica.js';

const vf = (i, extra = {}) => ({ tipo: 'vf', enunciado: 'P' + i, correcta: true, criterio: 'c1', ...extra });
const banco = [];
for (let i = 0; i < 12; i++) banco.push({ id: 'b' + i, criterio: i < 6 ? 'c1' : 'c2', q: { ...vf(i), tema: i % 2 ? 'SA1' : 'SA2', dificultad: (i % 3) + 1 } });

test('importar al banco: tema, dificultad (número o palabra), errores claros', () => {
  const r = leerPreguntasBanco(JSON.stringify([vf(1, { tema: 'SA1', dificultad: 2 }), vf(2, { dificultad: 'avanzada' }), vf(3)]));
  assert.deepEqual(r.errores, []);
  assert.equal(r.preguntas[0].tema, 'SA1'); assert.equal(r.preguntas[0].dificultad, 2); assert.equal(r.preguntas[1].dificultad, 3); assert.ok(!('dificultad' in r.preguntas[2]));
  assert.match(leerPreguntasBanco(JSON.stringify([vf(1, { dificultad: 5 })])).errores[0], /dificultad/);
  assert.equal(leeDificultad('Básica'), 1);
});
test('apartados en respuesta abierta = rúbrica con puntos (y la suma son los puntos)', () => {
  const r = leerPreguntasBanco(JSON.stringify([{ tipo: 'abierta', enunciado: 'Explica', criterio: 'c1', apartados: [{ texto: 'Plantea', puntos: 0.5 }, { texto: 'Resuelve', puntos: 1 }] }]));
  assert.deepEqual(r.errores, []); assert.equal(r.preguntas[0].puntos, 1.5); assert.equal(r.preguntas[0].rubrica.length, 2);
  assert.match(leerPreguntasBanco(JSON.stringify([vf(1, { apartados: [{ texto: 'x', puntos: 1 }] })])).errores[0], /apartados/);
});
test('paso: la parcial va por escalones y nunca es todo o nada', () => {
  const r = leerPreguntasBanco(JSON.stringify([{ tipo: 'ordenar', enunciado: 'Ordena', criterio: 'c1', elementos: ['a', 'b', 'c', 'd', 'e'], puntos: 1, paso: 0.25 }]));
  assert.deepEqual(r.errores, []); const q = { ...r.preguntas[0], id: 'q1' }; assert.equal(q.paso, 0.25);
  const { publica, clave } = separarPregunta(q); assert.equal(publica.paso, 0.25); assert.equal(unirPregunta(publica, clave).paso, 0.25);
  // 3 de 5 bien colocadas = 0,6 → 0,5 con escalones de 0,25
  const resp = [clave[0], clave[1], clave[2], clave[4], clave[3]];
  assert.equal(corregirExamen([publica], { q1: clave }, { q1: resp }).detalle.q1, 0.5);
  const { paso, ...sinPaso } = publica; assert.equal(corregirExamen([sinPaso], { q1: clave }, { q1: resp }).detalle.q1, 0.6);
  assert.equal(corregirExamen([publica], { q1: clave }, { q1: clave }).detalle.q1, 1);
  assert.match(leerPreguntasBanco(JSON.stringify([vf(1, { paso: 0.5 })])).errores[0], /paso/);
});
test('filtros por criterio, tema y dificultad', () => {
  assert.equal(filtrarBanco(banco, { criterio: 'c1' }).length, 6);
  assert.equal(filtrarBanco(banco, { criterio: 'c1', tema: 'SA1', dificultad: 2 }).map((b) => b.id).join(), 'b1');
  assert.deepEqual(temasBanco(banco), ['SA1', 'SA2']);
});
test('plantilla: n por fila, de menos a más difícil, sin tema ni dificultad en el examen', () => {
  assert.equal(validarPlantilla([]), 'La plantilla necesita al menos una fila.');
  assert.deepEqual(limpiarPlantilla([{ criterio: 'c1', tema: '', dificultad: '2', n: '3' }]), [{ n: 3, criterio: 'c1', dificultad: 2 }]);
  const r = generarDesdePlantilla(banco, [{ criterio: 'c2', n: 3 }, { criterio: 'c1', n: 3 }], { seed: 7 });
  assert.deepEqual(r.errores, []); assert.equal(r.preguntas.length, 6);
  const dif = r.usados.map((id) => banco.find((b) => b.id === id).q.dificultad);
  assert.deepEqual(dif, [...dif].sort((a, b) => a - b));
  assert.ok(r.preguntas.every((q) => !('tema' in q) && !('dificultad' in q) && q.criterio));
  assert.deepEqual(r.preguntas.map((q) => q.id), ['q1', 'q2', 'q3', 'q4', 'q5', 'q6']);
  assert.match(generarDesdePlantilla(banco, [{ criterio: 'c1', n: 9 }]).errores[0], /solo quedan 6/);
});
test('examen, repaso y recuperación con preguntas distintas', () => {
  const r = generarVersiones(banco, [{ criterio: 'c1', n: 2 }, { criterio: 'c2', n: 2 }], ['examen', 'repaso', 'recuperacion'], 11);
  assert.deepEqual(r.errores, []);
  const ens = Object.values(r.versiones).map((L) => L.map((q) => q.enunciado));
  const todas = ens.flat(); assert.equal(new Set(todas).size, todas.length);
  const r2 = generarVersiones(banco, [{ criterio: 'c1', n: 4 }], ['examen', 'repaso'], 3);
  assert.equal(r2.errores.length, 1); assert.match(r2.errores[0], /^Test de repaso/);
});
test('generar rápido por criterio sigue igual (sin tema ni dificultad en el examen)', () => {
  const r = generarExamen(banco, { c1: 2 }, 5); assert.equal(r.preguntas.length, 2); assert.ok(!('tema' in r.preguntas[0]));
});
test('resultado por criterio: lo de la Fase 3 (tabla nº × criterio)', () => { assert.equal(typeof tablaPorCriterio, 'function'); });

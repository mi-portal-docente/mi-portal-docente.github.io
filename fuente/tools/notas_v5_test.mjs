// v5 · Notas sin porcentajes: cuaderno por criterio (sin medias) y rúbrica sin pesos por defecto
// (node --test notas_v5_test.mjs)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tablaPorCriterio } from './src/lms/analitica.js';
import { RUBRICA_PLANTILLA, rubricaPlantillaTexto } from './src/lms/rubrica.js';
import { leeRubrica } from './src/lms/modelo.js';

test('tabla alumno × criterio: notas de cada actividad, sin media', () => {
  const T = tablaPorCriterio([
    { n: 2, actividad: 'Examen 1', fecha: 20, nota: 6, criterio: 'CE1.b' },
    { n: 2, actividad: 'Tarea 1', fecha: 10, nota: 8, criterio: 'CE1.b' },
    { n: 2, actividad: 'Tarea 2', fecha: 30, nota: 12, criterio: '' },
    { n: 5, actividad: 'Tarea 1', fecha: 10, nota: 7.5, criterio: 'CE1.a' },
    { n: 5, actividad: 'Sin nota', fecha: 10, nota: null, criterio: 'CE2' },
  ]);
  assert.deepEqual(T.criterios, ['CE1.a', 'CE1.b', '']);
  assert.deepEqual(T.filas.get(2)['CE1.b'].map((x) => x.nota), [8, 6]); // por fecha, sin promediar
  assert.equal(T.filas.get(2)[''][0].nota, 10); // recortada a 10
  assert.equal(T.filas.get(5)['CE1.a'][0].actividad, 'Tarea 1');
  assert.ok(!T.criterios.includes('CE2'));
  assert.equal(tablaPorCriterio([]).criterios.length, 0);
});
test('rúbrica por defecto sin pesos: todos los criterios valen lo mismo', () => {
  assert.equal(new Set(RUBRICA_PLANTILLA.map((c) => c.peso)).size, 1);
  const r = leeRubrica(rubricaPlantillaTexto()); assert.ok(r.every((x) => x.p === 2));
});

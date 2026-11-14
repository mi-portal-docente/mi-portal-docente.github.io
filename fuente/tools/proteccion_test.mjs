// Pruebas de la protección de evidencias (P2-P4) que no necesitan navegador ni Firebase.
// Ejecutar: node proteccion_test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { evaluarFormula, leeVariables, valoresAlumno, sustituir, textoVariables } from './src/lms/formula.js';
import { validarPregunta, separarPregunta, unirPregunta, TIPOS_PREGUNTA } from './src/lms/preguntas.js';
import { corregirExamen, semillaAlumno } from './src/lms/modelo.js';
import { nombreCopia, aJSON } from './src/lms/copia.js';

test('fórmulas: operaciones, potencias, funciones, coma decimal y errores en castellano', () => {
  assert.equal(evaluarFormula('V / R', { V: 12, R: 4 }), 3);
  assert.equal(evaluarFormula('2 + 3 * 4 ^ 2', {}), 50);
  assert.equal(evaluarFormula('-(2+3)*2', {}), -10);
  assert.equal(evaluarFormula('sqrt(P * R)', { P: 4, R: 9 }), 6);
  assert.equal(evaluarFormula('0,5 * 4', {}), 2);
  assert.ok(Math.abs(evaluarFormula('2*pi', {}) - 2 * Math.PI) < 1e-12);
  assert.throws(() => evaluarFormula('V / X', { V: 1 }), /Variable desconocida: X/);
  assert.throws(() => evaluarFormula('2 +', {}), /incompleta/);
  assert.throws(() => evaluarFormula('alert(1)', {}), /Función desconocida/);
  assert.throws(() => evaluarFormula('(2+3', {}), /paréntesis/);
});

test('variables: lectura, valores fijos por alumno y distintos entre alumnos', () => {
  const { V, errores } = leeVariables('R = 10..100 paso 10\nV = 5..24');
  assert.deepEqual(errores, []); assert.deepEqual(V.R, { min: 10, max: 100, paso: 10 });
  assert.match(leeVariables('R = 100..10').errores[0], /máximo/);
  assert.equal(textoVariables(V), 'R = 10..100 paso 10\nV = 5..24');
  const a = valoresAlumno(V, semillaAlumno('ex1', 'g1_7'), 'q1'); const a2 = valoresAlumno(V, semillaAlumno('ex1', 'g1_7'), 'q1');
  assert.deepEqual(a, a2);
  assert.ok(a.R >= 10 && a.R <= 100 && a.R % 10 === 0 && a.V >= 5 && a.V <= 24);
  const distintos = new Set(Array.from({ length: 20 }, (_, i) => JSON.stringify(valoresAlumno(V, semillaAlumno('ex1', 'g1_' + (i + 1)), 'q1'))));
  assert.ok(distintos.size >= 10, 'casi todos los alumnos tienen datos distintos');
  assert.equal(sustituir('Una resistencia de {R} Ω a {V} V', { R: 20, V: 4.5 }), 'Una resistencia de 20 Ω a 4,5 V');
});

test('pregunta «variables»: la fórmula va solo en la clave y se corrige con los datos del alumno', () => {
  const errs = []; const q = validarPregunta({ tipo: 'variables', enunciado: 'R = {R} Ω, V = {V} V. ¿I?', variables: 'R = 10..100 paso 10\nV = 5..24', formula: 'V / R', tolerancia: 2, unidad: 'A' }, 0, (r, t) => errs.push(t));
  assert.deepEqual(errs, []);
  const { publica, clave } = separarPregunta(q);
  assert.equal(JSON.stringify(publica).includes('V / R'), false, 'el alumno no ve la fórmula');
  assert.equal(clave.f, 'V / R');
  assert.deepEqual(unirPregunta(publica, clave).formula, 'V / R');
  const s = semillaAlumno('ex1', 'g1_7'); const v = valoresAlumno(publica.variables, s, publica.id);
  const bien = String(v.V / v.R).replace('.', ',');
  const R = corregirExamen([publica], { [publica.id]: clave }, { [publica.id]: bien }, {}, { s });
  assert.equal(R.nota, 10);
  const otro = corregirExamen([publica], { [publica.id]: clave }, { [publica.id]: bien }, {}, { s: semillaAlumno('ex1', 'g1_8') });
  assert.ok(otro.nota === 0 || valoresAlumno(publica.variables, semillaAlumno('ex1', 'g1_8'), publica.id).R / 1 === v.R, 'con los datos de otro alumno no vale (salvo que coincidan)');
  const sinCtx = corregirExamen([publica], { [publica.id]: clave }, { [publica.id]: bien });
  assert.deepEqual(sinCtx.revisar, [publica.id], 'sin la semilla del alumno, queda para revisar');
  const e2 = []; validarPregunta({ tipo: 'variables', enunciado: 'x', variables: 'R = 1..2', formula: 'R / Q' }, 0, (r, t) => e2.push(t));
  assert.match(e2[0], /Variable desconocida/);
  assert.ok(TIPOS_PREGUNTA.variables.nombre);
});

test('copia del curso: nombre AAAAMMDD_SuperProfe_Alumnos_<curso>.json y bytes en base64', () => {
  assert.equal(nombreCopia('2026/27', new Date(2026, 10, 14, 10)), '20261114_SuperProfe_Alumnos_2026-27.json');
  const bytes = { toBase64: () => 'JVBERg==', toUint8Array: () => new Uint8Array([1]) };
  assert.deepEqual(aJSON({ data: bytes, n: 1 }), { data: { __bytes: 'JVBERg==' }, n: 1 });
});

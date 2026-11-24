// Bloque 4 · código de colores: tablas, validación en castellano, corrección parcial (leer) y por bandas (pintar),
// combinaciones equivalentes, aleatorios reproducibles y carga por JSON (interactiva con «colores»).
import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as C from './src/lms/colores.js';
import { validarPregunta, separarPregunta } from './src/lms/preguntas.js';
import { corregirExamen } from './src/lms/modelo.js';
import { validarElemento } from './src/lms/elemento.js';
import { preguntasAleatorias } from './src/lms/motores/interactiva.js';

test('tablas y cálculo', () => {
  assert.equal(C.textoValor('resistencia4', ['Marrón', 'Verde', 'Marrón', 'Oro']), '150 Ω ±5 %');
  assert.equal(C.textoValor('condensador', ['Marrón', 'Negro', 'Rojo', 'Verde', 'Rojo']), '1 nF ±5 % · 250 V');
  assert.equal(C.textoValor('inductor', ['Amarillo', 'Violeta', 'Rojo', 'Plata']), '4,7 mH ±10 %');
  assert.match(C.textoValor('resistencia4', ['Amarillo', 'Violeta', 'Rojo']), /4,7 kΩ ±20 %/); // sin banda de tolerancia
  assert.match(C.textoValor('resistencia5', ['Marrón', 'Negro', 'Negro', 'Rojo', 'Marrón']), /^10 kΩ ±1 %/);
  assert.equal(C.colorNormal('marron'), 'Marrón');
});

test('validación en castellano', () => {
  const E = []; const err = (r, t) => E.push([r, t]);
  validarPregunta({ id: 'X', tipo: 'colores', enunciado: 'x', clase: 'resistencia4', bandas: ['Oro', 'Verde', 'Marrón', 'Oro'] }, 0, err);
  assert.ok(E.length && /Oro.*1\.ª cifra/.test(E[0][1]), JSON.stringify(E));
  E.length = 0; validarPregunta({ id: 'X', tipo: 'colores', enunciado: 'x', clase: 'diodo', bandas: [] }, 0, err); assert.ok(E.length);
  E.length = 0; validarPregunta({ id: 'X', tipo: 'colores', enunciado: 'x', clase: 'resistencia4', bandas: ['Marrón', 'Verde', 'Marrón', 'Oro'], modo: 'adivinar' }, 0, err); assert.ok(E.length);
});

const sep = (q) => { const s = separarPregunta(validarPregunta(q, 0, (r, t) => { throw new Error(t); })); return [s.publica, s.clave]; };

test('leer: nota parcial y valores equivalentes', () => {
  const [P, K] = sep({ id: 'R1', tipo: 'colores', enunciado: 'R1', clase: 'resistencia4', bandas: ['Amarillo', 'Violeta', 'Rojo', 'Oro'] });
  assert.ok(!P.bandas || P.modo === 'leer'); assert.equal(K.bandas.length, 4);
  const nota = (r) => corregirExamen([P], { R1: K }, { R1: r }).puntos;
  assert.equal(nota({ v: '4,7', u: 'kΩ', t: '5' }), 1);
  assert.equal(nota({ v: '4700', u: 'Ω', t: '5' }), 1);
  assert.ok(nota({ v: '47', u: 'Ω', t: '5' }) > 0 && nota({ v: '47', u: 'Ω', t: '5' }) < 1);
  assert.equal(nota({}), 0);
});

test('pintar: por bandas, y combinación equivalente = bien', () => {
  const [P, K] = sep({ id: 'L', tipo: 'colores', enunciado: 'L', clase: 'inductor', bandas: ['Amarillo', 'Violeta', 'Rojo', 'Plata'], modo: 'pintar' });
  assert.equal(P.bandas, undefined, 'el alumno no ve las bandas'); assert.match(P.valor, /4,7 mH/);
  const nota = (b) => corregirExamen([P], { L: K }, { L: { b } }).puntos;
  assert.equal(nota(['Amarillo', 'Violeta', 'Rojo', 'Plata']), 1);
  assert.equal(nota(['Amarillo', 'Violeta', 'Naranja', 'Plata']), 0.75);
  const [P2, K2] = sep({ id: 'R', tipo: 'colores', enunciado: 'R', clase: 'resistencia5', bandas: ['Marrón', 'Negro', 'Negro', 'Rojo', 'Marrón'], modo: 'pintar' });
  assert.equal(corregirExamen([P2], { R: K2 }, { R: { b: ['Negro', 'Marrón', 'Negro', 'Naranja', 'Marrón'] } }).puntos, 1, '010×1000 = 100×100');
});

test('aleatorios reproducibles y válidos', () => {
  const a = preguntasAleatorias({ modo: 'leer', aleatorio: 3, clases: ['resistencia4', 'condensador'] }, 1234);
  const b = preguntasAleatorias({ modo: 'leer', aleatorio: 3, clases: ['resistencia4', 'condensador'] }, 1234);
  assert.equal(a.length, 6); assert.deepEqual(a, b);
  assert.notDeepEqual(a, preguntasAleatorias({ modo: 'leer', aleatorio: 3, clases: ['resistencia4', 'condensador'] }, 99));
  for (let s = 1; s < 200; s++) for (const x of preguntasAleatorias({ modo: 'pintar', aleatorio: 2 }, s)) assert.ok(C.textoValor(x.publica.clase, x.clave.bandas));
});

test('JSON: interactiva con «colores» (fijos + aleatorio)', () => {
  const { errores: E, el: it } = validarElemento({ tipo: 'interactiva', titulo: 'Código de colores', intentos: 3, colores: { modo: 'leer', aleatorio: 2, componentes: [{ id: 'R1', clase: 'resistencia4', bandas: ['Marrón', 'Verde', 'Marrón', 'Oro'] }] } });
  assert.deepEqual(E, []); assert.equal(it.contenido.preguntas.length, 1); assert.equal(it.contenido.colores.aleatorio, 2);
  const E2 = validarElemento({ tipo: 'interactiva', titulo: 'x', colores: { componentes: [{ id: 'R1', clase: 'resistencia4', bandas: ['Oro', 'Verde', 'Marrón', 'Oro'] }] } }).errores;
  assert.equal(E2.length, 1, JSON.stringify(E2));
});

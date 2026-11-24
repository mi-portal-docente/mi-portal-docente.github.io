// Bloque 3 · imágenes en las preguntas. Comprueba:
//  1) que las preguntas SIN imagen se validan, separan, exportan y corrigen EXACTAMENTE igual que antes
//     (se compara con la versión anterior de lms/preguntas.js, en OLD=… o en /tmp/oldsrc);
//  2) que «imagen»/«alt» se aceptan en todos los tipos, y opciones / parejas / elementos con imagen;
//  3) los errores en castellano para rutas no válidas.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as N from './src/lms/preguntas.js';
import { exportarElemento, validarElemento } from './src/lms/elemento.js';
import { corregirExamen } from './src/lms/modelo.js';
import { existsSync, mkdtempSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
// versión anterior (7e709a9, antes del bloque 3) sacada del propio git
let OLD = process.env.OLD || '/tmp/oldsrc/fuente/tools/src/lms/preguntas.js';
if (!existsSync(OLD)) { const d = mkdtempSync(join(tmpdir(), 'preg-')); execSync(`git archive 7e709a9 src/lms | tar -x -C ${d}`, { cwd: new URL('.', import.meta.url).pathname }); OLD = join(d, 'src/lms/preguntas.js'); }
const O = await import(OLD);
const OM = await import(OLD.replace('preguntas.js', 'modelo.js'));

// Preguntas como las de los exámenes de Claude (Test Temas 5 y 6: test + zonas con img/eee/test/*.svg) y de todos los tipos
const FIX = [
  { id: 'q1', tipo: 'test', enunciado: '¿Qué componente es?', opciones: ['Resistencia', 'Condensador', 'Diodo', 'LED'], correcta: 2, puntos: 1 },
  { id: 'q2', tipo: 'zonas', enunciado: 'Pulsa en el condensador', imagen: 'img/eee/test/eee_t56_componentes.svg', alt: 'Componentes', zonas: [{ x: 10, y: 10, w: 20, h: 20, nombre: 'Componente G' }, { x: 50, y: 50, w: 10, h: 10, correcta: false, nombre: 'Otro' }] },
  { id: 'q3', tipo: 'vf', enunciado: 'Un LED tiene polaridad', correcta: true },
  { id: 'q4', tipo: 'corta', enunciado: 'Unidad de resistencia', aceptadas: ['ohmio', 'Ω'] },
  { id: 'q5', tipo: 'emparejar', enunciado: 'Une', pares: [['R', 'Resistencia'], ['C', 'Condensador']], distractores: ['Bobina'], puntos: 2, paso: 0.5 },
  { id: 'q6', tipo: 'ordenar', enunciado: 'Ordena', elementos: ['a', 'b', 'c'] },
  { id: 'q7', tipo: 'huecos', enunciado: 'Completa', texto: 'La ley de [[Ohm]] y la [[intensidad|corriente]]' },
  { id: 'q8', tipo: 'numerica', enunciado: '¿Cuánto?', valor: 4.7, tolerancia: 1, modo: 'pct', unidad: 'kΩ' },
  { id: 'q9', tipo: 'variables', enunciado: 'R={R}', variables: { R: { min: 10, max: 100, paso: 10 } }, formula: '5/R', tolerancia: 1 },
  { id: 'q10', tipo: 'clasificar', enunciado: 'Clasifica', grupos: [{ nombre: 'Activos', elementos: ['Transistor'] }, { nombre: 'Pasivos', elementos: ['Resistencia', 'Bobina'] }] },
  { id: 'q11', tipo: 'tabla', enunciado: 'Tabla', columnas: ['Magnitud', 'Unidad'], filas: [['Tensión', '[[voltio|V]]']] },
  { id: 'q12', tipo: 'abierta', enunciado: 'Explica', extension: 'larga', rubrica: [{ c: 'Explica', p: 2 }] },
];
const RESP = { q1: 2, q2: { x: 15, y: 15 }, q3: true, q4: 'Ohmio', q5: [0, 1], q6: [0, 1, 2], q7: ['ohm', 'corriente'], q8: '4,7', q9: '0,1', q10: [0, 1, 1], q11: ['V'], q12: 'texto' };

test('las preguntas sin imagen quedan exactamente igual (validar, separar, unir, corregir)', () => {
  FIX.forEach((q, i) => {
    const a = O.validarPregunta(q, i, () => { }); const b = N.validarPregunta(q, i, () => { });
    assert.deepEqual(b, a, 'validar ' + q.tipo);
    const sa = O.separarPregunta(a); const sb = N.separarPregunta(b);
    assert.deepEqual(sb, sa, 'separar ' + q.tipo);
    assert.deepEqual(N.unirPregunta(sb.publica, sb.clave), O.unirPregunta(sa.publica, sa.clave), 'unir ' + q.tipo);
  });
  const PA = FIX.map((q, i) => O.separarPregunta(O.validarPregunta(q, i, () => { })));
  const pub = PA.map((x) => x.publica); const K = Object.fromEntries(PA.map((x) => [x.publica.id, x.clave]));
  for (const R of [RESP, {}, { q1: 0, q2: { x: 55, y: 55 }, q5: [1, 0] }]) assert.deepEqual(corregirExamen(pub, K, R, {}, { s: 123 }), OM.corregirExamen(pub, K, R, {}, { s: 123 }));
});
test('imagen y alt opcionales en todos los tipos (encima del enunciado), se separan y se exportan', () => {
  for (const [i, q] of FIX.entries()) {
    if (q.tipo === 'zonas') continue;
    const v = N.validarPregunta({ ...q, imagen: 'img/eee/test/eee_t5_simbolos.svg', alt: 'Símbolos' }, i, (r, t) => assert.fail(t));
    assert.equal(v.imagen, 'img/eee/test/eee_t5_simbolos.svg'); assert.equal(v.alt, 'Símbolos');
    const s = N.separarPregunta(v); assert.equal(s.publica.imagen, v.imagen);
    assert.equal(N.unirPregunta(s.publica, s.clave).imagen, v.imagen);
    const ex = exportarElemento({ tipo: 'examen', titulo: 'x' }, { preguntas: [s.publica], claves: { [v.id]: s.clave } });
    assert.equal(ex.preguntas[0].imagen, v.imagen); assert.equal(ex.preguntas[0].alt, 'Símbolos');
  }
  const errs = []; N.validarPregunta({ ...FIX[0], imagen: 'javascript:alert(1)' }, 0, (r, t) => errs.push(t));
  assert.match(errs[0], /«imagen» tiene que ser una URL https/);
  const e2 = []; N.validarPregunta({ ...FIX[0], imagen: 'img/../secreto' }, 0, (r, t) => e2.push(t)); assert.equal(e2.length, 1);
});
test('test con opciones de imagen (tarjetas), emparejar y clasificar con imagen', () => {
  const t = N.validarPregunta({ id: 'a', tipo: 'test', enunciado: '¿Cuál es el condensador?', opciones: [{ texto: 'A', imagen: 'img/eee/test/eee_rep_c1.svg' }, { imagen: 'img/eee/test/eee_rep_l1.svg' }, 'Ninguno'], correcta: 0 }, 0, (r, x) => assert.fail(x));
  assert.deepEqual(t.opciones[1], { texto: '', imagen: 'img/eee/test/eee_rep_l1.svg' }); assert.equal(t.opciones[2], 'Ninguno');
  const s = N.separarPregunta(t); assert.equal(N.TIPOS_PREGUNTA.test.corregir(s.publica, s.clave, 0), 1);
  const e = N.validarPregunta({ id: 'b', tipo: 'emparejar', enunciado: 'Une', pares: [[{ imagen: 'img/eee/test/eee_rep_r1.svg' }, '150 Ω'], [{ imagen: 'img/eee/test/eee_rep_r2.svg' }, '1 kΩ']] }, 1, (r, x) => assert.fail(x));
  const se = N.separarPregunta(e); assert.equal(N.TIPOS_PREGUNTA.emparejar.corregir(se.publica, se.clave, se.clave), 1);
  assert.deepEqual(N.unirPregunta(se.publica, se.clave).pares, e.pares);
  const c = N.validarPregunta({ id: 'c', tipo: 'clasificar', enunciado: 'Clasifica', grupos: [{ nombre: 'Polarizados', elementos: [{ texto: 'Electrolítico', imagen: 'img/eee/test/eee_rep_c2.svg' }] }, { nombre: 'No polarizados', elementos: ['Cerámico'] }] }, 2, (r, x) => assert.fail(x));
  const sc = N.separarPregunta(c); assert.deepEqual(N.unirPregunta(sc.publica, sc.clave).grupos, c.grupos);
  const errs = []; N.validarPregunta({ id: 'd', tipo: 'test', enunciado: 'x', opciones: [{ texto: 'a', imagen: 'ftp://x' }, 'b'], correcta: 0 }, 3, (r, x) => errs.push(x));
  assert.match(errs[0], /Opción 1: «imagen» tiene que ser/);
  const { errores } = validarElemento({ tipo: 'examen', titulo: 'T', preguntas: [{ tipo: 'test', enunciado: 'x', imagen: 'img/a.svg', opciones: [{ imagen: 'img/b.svg' }, { imagen: 'img/c.svg' }], correcta: 1 }], examen: {} });
  assert.deepEqual(errores, []);
});

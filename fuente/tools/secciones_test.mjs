// Pruebas de las secciones v5 y de la migración automática (node --test secciones_test.mjs)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { seccionDe, seccionesDe, seccionesVisibles, seccionesActivas, validarSecciones, limpiarSecciones, vistaNueva, pendientesPorSeccion, agruparPorTema, TIPO_A_SECCION, IDS_ELEMENTO, ACTIVAS_DEFECTO } from './src/lms/secciones.js';
import { TIPOS } from './src/lms/biblioteca.js';

test('migración: cada tipo actual va a su sección (tabla del encargo)', () => {
  const esperado = { material: 'teoria', explicacion: 'teoria', actividad: 'clase', p5: 'clase', web: 'clase', info: 'clase', ciber: 'clase', bloques: 'clase',
    tarea: 'tareas', pregunta: 'tareas', proyecto: 'tareas', cuestionario: 'test', examen: 'test', recuperacion: 'examenes', practica: 'laboratorio' };
  for (const [tipo, sec] of Object.entries(esperado)) assert.equal(seccionDe({ tipo }), sec, tipo);
});
test('migración: todos los tipos del portal tienen sección (ninguno se pierde)', () => {
  for (const tipo of Object.keys(TIPOS)) assert.ok(IDS_ELEMENTO.includes(seccionDe({ tipo })), tipo);
  for (const sec of Object.values(TIPO_A_SECCION)) assert.ok(IDS_ELEMENTO.includes(sec));
});
test('examen con PDF o en modo examen → Exámenes; cuestionario normal → Test', () => {
  assert.equal(seccionDe({ tipo: 'examen' }), 'test');
  assert.equal(seccionDe({ tipo: 'examen', pdf: { archivo: 'archivos/abc123' } }), 'examenes');
  assert.equal(seccionDe({ tipo: 'examen', enlaces: [{ t: 'Examen T2.pdf', u: 'materiales/eee/examen.pdf' }] }), 'examenes');
  assert.equal(seccionDe({ tipo: 'examen', sinExternos: true }), 'examenes');
});
test('la sección guardada manda sobre el tipo; una inválida se ignora', () => {
  assert.equal(seccionDe({ tipo: 'material', seccion: 'laboratorio' }), 'laboratorio');
  assert.equal(seccionDe({ tipo: 'material', seccion: 'avisos' }), 'teoria');
  assert.equal(seccionDe({ tipo: 'material', seccion: 'loquesea' }), 'teoria');
});
test('la migración es solo en lectura: no cambia el elemento', () => {
  const it = Object.freeze({ tipo: 'tarea', titulo: 'x' });
  seccionDe(it); assert.deepEqual(it, { tipo: 'tarea', titulo: 'x' });
});
test('activadas por defecto: EEE y Proyecto; la lista configurable activa otras', () => {
  assert.deepEqual(ACTIVAS_DEFECTO, ['eee', 'proy2']);
  assert.ok(seccionesActivas(null, 'eee')); assert.ok(seccionesActivas(null, 'proy2')); assert.ok(!seccionesActivas(null, 'tic1'));
  assert.ok(seccionesActivas({ activas: ['tic1'] }, 'tic1')); assert.ok(!seccionesActivas({ activas: ['tic1'] }, 'eee'));
});
test('secciones configurables: orden, nombre y ocultar', () => {
  const conf = { asig: { eee: [{ id: 'laboratorio', orden: -1, nombre: 'Taller' }, { id: 'test', visible: false }] } };
  const L = seccionesDe(conf, 'eee');
  assert.equal(L[0].id, 'laboratorio'); assert.equal(L[0].nombre, 'Taller'); assert.equal(L.length, 7);
  assert.ok(!seccionesVisibles(conf, 'eee').some((s) => s.id === 'test'));
  assert.deepEqual(seccionesDe(null, 'eee').map((s) => s.id), ['avisos', 'teoria', 'clase', 'tareas', 'test', 'examenes', 'laboratorio']);
});
test('validar y limpiar la lista de secciones (importador)', () => {
  assert.equal(validarSecciones([{ id: 'teoria', nombre: 'Apuntes', orden: 1, visible: true }]), null);
  assert.match(validarSecciones([{ id: 'otra' }]), /desconocida/);
  assert.match(validarSecciones([{ id: 'teoria' }, { id: 'teoria' }]), /repetida/);
  assert.match(validarSecciones({}), /lista/);
  assert.deepEqual(limpiarSecciones([{ id: 'teoria', nombre: ' Apuntes ', orden: '2', visible: false, x: 1 }, { id: 'zzz' }]), [{ id: 'teoria', nombre: 'Apuntes', orden: 2, visible: false }]);
});
test('enlaces antiguos → sección nueva', () => {
  const V = seccionesDe(null, 'eee');
  assert.equal(vistaNueva('tablon', { visibles: V }), 'avisos');
  assert.equal(vistaNueva('actividades', { visibles: V }), 'clase');
  assert.equal(vistaNueva('laboratorio', { visibles: V }), 'laboratorio');
  assert.equal(vistaNueva('trabajo', { visibles: V }), 'teoria');
  assert.equal(vistaNueva('trabajo', { prof: true, visibles: V }), 'gestion');
  assert.equal(vistaNueva('organizacion', { prof: true, visibles: V }), 'gestion');
  assert.equal(vistaNueva('gestion', { prof: false, visibles: V }), 'avisos');
  // sección oculta → la primera visible
  const sinLab = V.filter((s) => s.id !== 'laboratorio');
  assert.equal(vistaNueva('laboratorio', { visibles: sinLab }), 'avisos');
});
test('contador de pendientes por sección', () => {
  const items = [{ id: 1, tipo: 'tarea' }, { id: 2, tipo: 'tarea' }, { id: 3, tipo: 'material' }, { id: 4, tipo: 'examen' }, { id: 5, tipo: 'practica' }];
  const est = { 1: ['pend'], 2: ['ok'], 3: ['mat'], 4: ['abierto'], 5: ['tarde'] };
  const n = pendientesPorSeccion(items, (it) => est[it.id]);
  assert.equal(n.tareas, 1); assert.equal(n.teoria, 0); assert.equal(n.test, 1); assert.equal(n.laboratorio, 1);
});
test('agrupar por tema en el orden del profesor (sin tema primero)', () => {
  const G = agruparPorTema([{ id: 'a', tema: 't2' }, { id: 'b', tema: 't1' }, { id: 'c' }], [{ id: 't2', orden: 2 }, { id: 't1', orden: 1 }, { id: 't3', orden: 3 }]);
  assert.deepEqual(G.map((g) => g.tema?.id ?? null), [null, 't1', 't2']);
});

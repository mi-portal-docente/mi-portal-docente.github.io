// v5 · Exportar asignatura en PDF: plan del ZIP, nombres, manifiesto y texto de las preguntas (node --test exportar_zip_test.mjs)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { planExportar, manifiesto, textoPregunta, aWinAnsi, nombreSeguro, pdfsDe } from './src/lms/exportar-zip.js';
import { zip } from './src/lms/docx.js';

const temas = [{ id: 't2', nombre: 'SA2 · Electricidad', orden: 2 }, { id: 't1', nombre: 'SA1: Seguridad e higiene', orden: 1 }];
const items = [
  { id: 'i1', tipo: 'material', titulo: 'Apuntes del tema 1', tema: 't1', orden: 1, pdf: { archivo: 'archivos/abc123', nombre: 'Apuntes_T1.pdf' } },
  { id: 'i2', tipo: 'tarea', titulo: 'Tarea: ¿Qué es la Ley de Ohm?', tema: 't2', orden: 1, enlaces: [{ t: 'Enunciado.pdf', u: '#archivo/def456' }, { t: 'Anexo.pdf', u: '#archivo/ghi789' }, { t: 'Web', u: 'https://example.org' }] },
  { id: 'i3', tipo: 'examen', titulo: 'Test de repaso', tema: 't2', orden: 2 },
  { id: 'i4', tipo: 'examen', titulo: 'Examen final', tema: '', orden: 3, enlaces: [{ t: 'Examen.pdf', u: '#archivo/jkl012' }] },
  { id: 'i5', tipo: 'material', titulo: 'En la papelera', papelera: true, pdf: { archivo: 'archivos/zzz999' } },
  { id: 'i6', tipo: 'practica', titulo: 'Práctica sin PDF', tema: 't1' },
  { id: 'i7', tipo: 'material', titulo: 'Apuntes del tema 1', tema: 't1', orden: 2, enlaces: [{ t: 'otro.pdf', u: 'materiales/eee/otro.pdf' }] },
];

test('carpetas por sección y tema, sin papelera ni avisos', () => {
  const { entradas } = planExportar({ items, temas });
  assert.deepEqual(entradas.map((e) => e.itemId), ['i1', 'i7', 'i2', 'i3', 'i4', 'i6']);
  const e1 = entradas.find((e) => e.itemId === 'i1');
  assert.equal(e1.carpeta, '1_Teoria/01_SA1_Seguridad_e_higiene'); assert.deepEqual(e1.archivos.map((a) => a.ruta), ['1_Teoria/01_SA1_Seguridad_e_higiene/Apuntes_del_tema_1.pdf']);
  assert.equal(e1.archivos[0].id, 'abc123');
  // mismo título en la misma carpeta → nombre distinto
  assert.equal(entradas.find((e) => e.itemId === 'i7').archivos[0].ruta, '1_Teoria/01_SA1_Seguridad_e_higiene/Apuntes_del_tema_1_2.pdf');
  const e2 = entradas.find((e) => e.itemId === 'i2');
  assert.equal(e2.archivos.length, 2); assert.match(e2.archivos[1].ruta, /^3_Tareas\/02_SA2_Electricidad\/Tarea_Que_es_la_Ley_de_Ohm_Anexo\.pdf$/);
  const e3 = entradas.find((e) => e.itemId === 'i3');
  assert.deepEqual(e3.archivos.map((a) => [a.ruta, a.cuestionario]), [['4_Test/02_SA2_Electricidad/Test_de_repaso.pdf', 'preguntas'], ['4_Test/02_SA2_Electricidad/Test_de_repaso_soluciones.pdf', 'soluciones']]);
  const e4 = entradas.find((e) => e.itemId === 'i4');
  assert.equal(e4.seccion, 'examenes'); assert.equal(e4.carpeta, '5_Examenes/00_Sin_tema'); assert.equal(e4.archivos.length, 3);
  assert.equal(entradas.find((e) => e.itemId === 'i6').carpeta, '6_Laboratorio/01_SA1_Seguridad_e_higiene');
});
test('casillas por sección y por tema', () => {
  assert.deepEqual(planExportar({ items, temas, sel: { secciones: ['test', 'examenes'] } }).entradas.map((e) => e.itemId), ['i3', 'i4']);
  assert.deepEqual(planExportar({ items, temas, sel: { secciones: ['teoria', 'tareas', 'test', 'examenes', 'laboratorio', 'clase'], temas: [''] } }).entradas.map((e) => e.itemId), ['i4']);
  assert.deepEqual(planExportar({ items, temas, sel: { temas: ['t1'] } }).entradas.map((e) => e.itemId), ['i1', 'i7', 'i6']);
});
test('manifiesto: sección, tema, título, archivo y origen; sin datos de alumnos', () => {
  const plan = planExportar({ items, temas });
  const m = manifiesto(plan, { asignatura: 'EEE', curso: '2026/27', origenes: new Map([['i1', { drive: 'X', ruta: '1_PIAC/T1', version: 'v3' }]]) });
  assert.equal(m.formato, 'superprofe/exportacion@1');
  const a1 = m.archivos.find((a) => a.titulo === 'Apuntes del tema 1');
  assert.equal(a1.seccion, 'teoria'); assert.equal(a1.tema, 'SA1: Seguridad e higiene'); assert.equal(a1.origen.ruta, '1_PIAC/T1');
  assert.equal(m.archivos.find((a) => a.titulo === 'Práctica sin PDF').archivo, null);
  assert.equal(m.total, 9);
  assert.ok(!/alumno|numero|grupo|nota"/i.test(JSON.stringify(m).replace(/Practica|Práctica/g, '')));
});
test('pdfsDe: el oficial y los demás adjuntos PDF, sin repetir', () => {
  assert.deepEqual(pdfsDe({ pdf: { archivo: 'archivos/abc123', nombre: 'A.pdf' }, enlaces: [{ t: 'A.pdf', u: '#archivo/abc123' }, { t: 'B.pdf', u: '#archivo/bbb222' }, { t: 'foto.png', u: '#archivo/ccc333' }] }).map((x) => x.id), ['abc123', 'bbb222']);
});
test('texto de las preguntas para el PDF (enunciado y soluciones aparte)', () => {
  const t = textoPregunta({ tipo: 'test', enunciado: '¿Unidad de la resistencia?', opciones: ['Voltio', 'Ohmio', 'Amperio'], correcta: 1 });
  assert.deepEqual(t.lineas, ['a) Voltio', 'b) Ohmio', 'c) Amperio']); assert.deepEqual(t.solucion, ['b) Ohmio']);
  assert.deepEqual(textoPregunta({ tipo: 'vf', enunciado: 'x', correcta: false }).solucion, ['Falso']);
  const h = textoPregunta({ tipo: 'huecos', enunciado: 'Completa', texto: 'La [[tensión|voltaje]] se mide en [[voltios]].' });
  assert.equal(h.lineas[0], 'La ________ se mide en ________.'); assert.deepEqual(h.solucion, ['Hueco 1: tensión / voltaje', 'Hueco 2: voltios']);
  assert.match(textoPregunta({ tipo: 'numerica', enunciado: 'I', valor: 0.5, tolerancia: 2, modo: 'pct', unidad: 'A' }).solucion[0], /0.5 A \(tolerancia 2 %\)/);
  assert.equal(textoPregunta({ tipo: 'emparejar', enunciado: 'E', pares: [['LED', 'luz'], ['Zumbador', 'sonido']], distractores: [] }).solucion[1], '2. Zumbador → sonido');
  // las preguntas no llevan la solución en las líneas del alumno
  assert.ok(!t.lineas.join(' ').includes('correcta'));
});
test('texto para las fuentes del PDF y nombres seguros', () => {
  assert.equal(aWinAnsi('¿Ñandú? 10 Ω → 5 V ≈ «ok»'), '¿Ñandú? 10 ohm -> 5 V ~ «ok»');
  assert.equal(nombreSeguro('  Práctica 3: El relé / ¿cómo va?  '), 'Practica_3_El_rele_como_va');
  assert.equal(nombreSeguro(''), 'sin_nombre');
});
test('el ZIP se puede leer (cabecera PK y entradas)', () => {
  const z = zip([{ nombre: '1_Teoria/01_T/a.pdf', datos: new Uint8Array([37, 80, 68, 70]) }, { nombre: 'manifiesto.json', datos: '{}' }]);
  assert.equal(z[0], 0x50); assert.equal(z[1], 0x4b);
  assert.ok(Buffer.from(z).includes(Buffer.from('1_Teoria/01_T/a.pdf')));
});

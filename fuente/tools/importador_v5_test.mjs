// Pruebas del importador ampliado (v5): sección, tema, PDF, versión interactiva, origen y secciones
// (node --test importador_v5_test.mjs)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import './src/lms/motores/index.js';
import { leerJSON, validarElemento, exportarElemento } from './src/lms/elemento.js';
import { pdfDe, interactivoDe } from './src/lms/caras.js';
import { seccionDe } from './src/lms/secciones.js';

const EL = { formato: 'superprofe/elemento@1', tipo: 'tarea', titulo: 'T3 · Empresa espejo', puntos: 10, seccion: 'tareas', tema: 'SA1',
  pdf: { archivo: 'archivos/abc123', nombre: 'PIAC_SA1_T3_Alumno_v3.pdf', descarga: false }, interactivo: { tipo: 'explicacion', ref: 'iexplica0001' },
  origen: { drive: 'ID_FALSO', ruta: '1_PIAC_SA1/T3_Empresa_espejo', version: 'v3' } };

test('importa los campos nuevos', () => {
  const r = validarElemento(EL); assert.deepEqual(r.errores, []);
  assert.equal(r.el.seccion, 'tareas'); assert.equal(r.el.tema, 'SA1');
  assert.deepEqual(r.el.pdf, { archivo: 'archivos/abc123', nombre: 'PIAC_SA1_T3_Alumno_v3.pdf', descarga: false });
  assert.deepEqual(r.el.interactivo, { tipo: 'explicacion', ref: 'iexplica0001' });
  assert.deepEqual(r.el.origen, { drive: 'ID_FALSO', ruta: '1_PIAC_SA1/T3_Empresa_espejo', version: 'v3' });
});
test('sin campos nuevos: igual que antes (la sección se deduce del tipo)', () => {
  const r = validarElemento({ tipo: 'material', titulo: 'Apuntes' }); assert.deepEqual(r.errores, []);
  assert.equal(r.el.seccion, null); assert.equal(r.el.pdf, null); assert.equal(seccionDe(r.el), 'teoria');
});
test('errores en castellano con la ruta', () => {
  const e = (o) => validarElemento({ ...EL, ...o }).errores.map((x) => x.ruta);
  assert.deepEqual(e({ seccion: 'avisos' }), ['seccion']);
  assert.deepEqual(e({ pdf: { archivo: 'https://drive.google.com/file/d/x' } }), ['pdf.archivo']);
  assert.deepEqual(e({ pdf: { archivo: 'archivos/abc123', descarga: 'si' } }), ['pdf.descarga']);
  assert.deepEqual(e({ interactivo: { tipo: 'raro', ref: 'x' } }), ['interactivo.tipo']);
  assert.deepEqual(e({ interactivo: { tipo: 'p5', ref: 'https://fuera.com' } }), ['interactivo.ref']);
  assert.deepEqual(e({ origen: { drive: 5 } }), ['origen.drive']);
  assert.match(validarElemento({ ...EL, seccion: 'x' }).errores[0].texto, /Sección «x» desconocida/);
});
test('archivo con «secciones» y «elementos»', () => {
  const r = leerJSON(JSON.stringify({ secciones: [{ id: 'laboratorio', nombre: 'Taller', orden: 0, visible: false }], elementos: [EL, { tipo: 'material', titulo: 'B' }] }));
  assert.deepEqual(r.errores, []); assert.equal(r.elementos.length, 2);
  assert.deepEqual(r.secciones, [{ id: 'laboratorio', nombre: 'Taller', orden: 0, visible: false }]);
  const s = leerJSON(JSON.stringify({ secciones: [{ id: 'teoria' }] })); assert.equal(s.elementos.length, 0); assert.equal(s.secciones.length, 1);
  assert.equal(leerJSON(JSON.stringify({ secciones: [{ id: 'nada' }], elementos: [] })).errores[0].ruta, 'secciones');
});
test('exportar y volver a importar conserva sección, PDF, interactivo y origen', () => {
  const it = { tipo: 'tarea', titulo: 'X', puntos: 10, seccion: 'tareas', pdf: EL.pdf, interactivo: EL.interactivo };
  const o = exportarElemento(it, { origen: EL.origen });
  const r = validarElemento(o); assert.deepEqual(r.errores, []);
  assert.equal(r.el.seccion, 'tareas'); assert.deepEqual(r.el.pdf, EL.pdf); assert.deepEqual(r.el.origen, EL.origen);
  assert.ok(!('origen' in exportarElemento(it)), 'sin origen si no se pasa');
});
test('Ver PDF: el oficial, o el primer adjunto PDF de antes', () => {
  assert.equal(pdfDe({ pdf: { archivo: 'archivos/abc123', descarga: true } }).href, '#archivo/abc123/descarga');
  assert.equal(pdfDe({ enlaces: [{ t: 'foto.png', u: '#archivo/zzz9999' }, { t: 'Apuntes.pdf', u: '#archivo/abc999' }] }).href, '#archivo/abc999');
  assert.equal(pdfDe({ enlaces: [{ t: 'ficha', u: 'materiales/eee/ficha.pdf' }] }).href, 'materiales/eee/ficha.pdf');
  assert.equal(pdfDe({ enlaces: [{ t: 'Drive', u: 'https://drive.google.com/x' }] }), null);
});
test('Versión interactiva: otro elemento o enlace interno; nada si no existe', () => {
  assert.equal(interactivoDe({ interactivo: { tipo: 'explicacion', ref: 'iexplica0001' } }).href, '#trabajo/iexplica0001');
  assert.equal(interactivoDe({ interactivo: { tipo: 'laboratorio', ref: '#eee/circuitos/c3' } }).href, '#eee/circuitos/c3');
  assert.equal(interactivoDe({}), null); assert.equal(interactivoDe({ interactivo: { tipo: 'p5', ref: 'javascript:alert(1)' } }), null);
});

// Pruebas unitarias de la rama grok-plataforma: importar/exportar JSON, tipos de pregunta, banco,
// analítica, motores… (node plataforma_test.mjs)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { leerJSON, validarElemento, exportarElemento, criterioValido } from './src/lms/elemento.js';
import { separarPregunta, unirPregunta } from './src/lms/preguntas.js';
import { readFileSync } from 'fs';

test('JSON roto: error en castellano con línea y columna', () => {
  const r = leerJSON('{ "tipo": "tarea", "titulo": "x", }');
  assert.equal(r.elementos.length, 0); assert.match(r.errores[0].texto, /No es un JSON válido/);
});
test('tarea mínima con criterio', () => {
  const r = leerJSON(JSON.stringify({ tipo: 'tarea', titulo: 'Mi tarea', instrucciones: 'Haz esto', puntos: 10, criterio: 'eee_c1_1', fechaEntrega: '2026-11-20T23:59' }));
  assert.deepEqual(r.errores, []); assert.equal(r.elementos[0].criterio, 'eee_c1_1'); assert.ok(r.elementos[0].fechaEntrega > 0);
});
test('errores: tipo desconocido, sin título, criterio con espacios, enlace no válido', () => {
  const r = validarElemento({ tipo: 'tareas', criterio: 'c 1', enlaces: ['ftp://x'] });
  const t = r.errores.map((e) => e.texto).join('\n');
  assert.match(t, /Tipo «tareas» desconocido/); assert.match(t, /Falta el «titulo»/); assert.match(t, /Criterio «c 1» no válido/); assert.match(t, /enlace 1 no es válido/);
  assert.equal(criterioValido('eee_c1_1'), true); assert.equal(criterioValido('eee c1'), false);
});
test('examen: preguntas validadas, criterio por pregunta, separar sin soluciones y volver', () => {
  const ex = { tipo: 'examen', titulo: 'Test', examen: { abre: '2026-11-20T09:00', cierra: '2026-11-20T10:00', limiteMin: 30 }, preguntas: [
    { id: 'a', tipo: 'test', enunciado: '¿2+2?', opciones: ['3', '4'], correcta: 1, criterio: 'mat_1' },
    { tipo: 'vf', enunciado: 'El cobre conduce', correcta: true },
    { tipo: 'corta', enunciado: 'Unidad de tensión', aceptadas: ['voltio', 'V'] }] };
  const r = validarElemento(ex); assert.deepEqual(r.errores, []);
  const q = r.el.preguntas; assert.equal(q[1].id, 'q2'); assert.equal(q[0].criterio, 'mat_1');
  const s = separarPregunta(q[0]); assert.equal(s.clave, 1); assert.equal('correcta' in s.publica, false); assert.equal(s.publica.criterio, 'mat_1');
  assert.deepEqual(unirPregunta(s.publica, s.clave).opciones, ['3', '4']);
  const exp = exportarElemento({ tipo: 'examen', titulo: 'Test', examen: { desde: r.el.examen.desde, hasta: r.el.examen.hasta, limiteMin: 30 } }, { preguntas: q.map((x) => separarPregunta(x).publica), claves: Object.fromEntries(q.map((x) => [x.id, separarPregunta(x).clave])) });
  const r2 = validarElemento(exp); assert.deepEqual(r2.errores, []); assert.deepEqual(r2.el.preguntas, q);
});
test('examen: errores de preguntas', () => {
  const r = validarElemento({ tipo: 'examen', titulo: 'x', preguntas: [{ tipo: 'test', enunciado: 'a', opciones: ['1', '2'], correcta: 5 }, { tipo: 'vf', enunciado: 'b', correcta: 'true' }, { tipo: 'rara', enunciado: 'c' }] });
  const t = r.errores.map((e) => e.texto).join('\n');
  assert.match(t, /Pregunta 1: «correcta» tiene que ser el número/); assert.match(t, /Pregunta 2: «correcta» tiene que ser true/); assert.match(t, /tipo «rara» desconocido/);
});
test('varios elementos de una vez y exportar → importar (ida y vuelta)', () => {
  const r = leerJSON(JSON.stringify({ elementos: [{ tipo: 'material', titulo: 'Apuntes', enlaces: [{ titulo: 'PDF', url: 'https://ejemplo.es/a.pdf' }] }, { tipo: 'pregunta', titulo: '¿Sí o no?', opciones: ['Sí', 'No'] }] }));
  assert.equal(r.elementos.length, 2); assert.equal(r.elementos[0].puntos, null);
  const it = { tipo: 'tarea', titulo: 'T', texto: 'x', enlaces: [{ t: 'a', u: 'https://a.es' }], puntos: 5, rubrica: [{ c: 'Contenido', p: 5 }], criterio: 'c1' };
  const r2 = validarElemento(exportarElemento(it)); assert.deepEqual(r2.errores, []); assert.equal(r2.el.rubrica[0].c, 'Contenido'); assert.equal(r2.el.criterio, 'c1');
});
test('los ejemplos de FORMATO_IMPORTAR.md son válidos', () => {
  const md = readFileSync(new URL('./src/lms/semilla/FORMATO_IMPORTAR.md', import.meta.url), 'utf8');
  const bloques = [...md.matchAll(/```json\n([\s\S]*?)```/g)].map((m) => m[1]);
  assert.ok(bloques.length >= 3);
  for (const b of bloques) { const r = leerJSON(b); assert.deepEqual(r.errores, [], b.slice(0, 80)); }
});

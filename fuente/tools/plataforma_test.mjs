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

// ---------------------------------------------------------------- Fase 2
import { TIPOS_PREGUNTA, validarPregunta } from './src/lms/preguntas.js';
import { corregirExamen } from './src/lms/modelo.js';
import { generarExamen, porCriterio, leerPreguntasBanco } from './src/lms/banco.js';
const sepYCorregir = (q0, resp) => { const q = validarPregunta(q0, 0, (r, t) => { throw new Error(t); }); const s = separarPregunta(q); return { s, c: corregirExamen([s.publica], { [s.publica.id]: s.clave }, { [s.publica.id]: resp(s) }) }; };
test('emparejar: derecha barajada, sin solución visible, puntuación parcial', () => {
  const q = { id: 'e', tipo: 'emparejar', enunciado: 'Une', puntos: 4, pares: [['V', 'voltio'], ['A', 'amperio'], ['Ω', 'ohmio'], ['W', 'vatio']], distractores: ['julio'] };
  const { s } = sepYCorregir(q, () => null);
  assert.equal(s.publica.derecha.length, 5); assert.equal('pares' in s.publica, false);
  const bien = s.clave.slice(); const r = corregirExamen([s.publica], { e: s.clave }, { e: bien }); assert.equal(r.puntos, 4);
  const medio = [bien[0], bien[1], bien[3], bien[2]]; assert.equal(corregirExamen([s.publica], { e: s.clave }, { e: medio }).puntos, 2);
  assert.deepEqual(unirPregunta(s.publica, s.clave).pares, q.pares); assert.deepEqual(unirPregunta(s.publica, s.clave).distractores, ['julio']);
});
test('ordenar: nunca sale ya ordenado; parcial por posiciones', () => {
  const q = { id: 'o', tipo: 'ordenar', enunciado: 'Ordena', puntos: 3, elementos: ['uno', 'dos', 'tres'] };
  const { s } = sepYCorregir(q, () => null);
  assert.notDeepEqual(s.publica.elementos, q.elementos);
  assert.equal(corregirExamen([s.publica], { o: s.clave }, { o: s.clave }).puntos, 3);
  const r = corregirExamen([s.publica], { o: s.clave }, { o: [s.clave[0], s.clave[2], s.clave[1]] }); assert.equal(r.puntos, 1);
  assert.deepEqual(unirPregunta(s.publica, s.clave).elementos, q.elementos);
});
test('huecos: alternativas con «|», sin tildes ni mayúsculas, parcial', () => {
  const q = { id: 'h', tipo: 'huecos', enunciado: 'Completa', puntos: 2, texto: 'La ley de [[Ohm]] relaciona tensión e [[intensidad|corriente]].' };
  const { s } = sepYCorregir(q, () => null);
  assert.equal(s.publica.texto, 'La ley de [[1]] relaciona tensión e [[2]].'); assert.equal(s.publica.huecos, 2);
  assert.equal(corregirExamen([s.publica], { h: s.clave }, { h: ['ohm', 'Corriente'] }).puntos, 2);
  assert.equal(corregirExamen([s.publica], { h: s.clave }, { h: ['OHM', 'voltaje'] }).puntos, 1);
  assert.equal(unirPregunta(s.publica, s.clave).texto, q.texto);
});
test('numérica: tolerancia absoluta y en %, coma decimal', () => {
  const abs = { id: 'n', tipo: 'numerica', enunciado: 'R', valor: 220, tolerancia: 5, modo: 'abs', unidad: 'Ω' };
  const { s } = sepYCorregir(abs, () => null);
  const c = (r) => corregirExamen([s.publica], { n: s.clave }, { n: r }).puntos;
  assert.equal(c('224'), 1); assert.equal(c('226'), 0); assert.equal(c('215,5'), 1); assert.equal(c(''), 0); assert.equal(c('abc'), 0);
  const pct = sepYCorregir({ id: 'p', tipo: 'numerica', enunciado: 'I', valor: 0.5, tolerancia: 10, modo: 'pct' }, () => null).s;
  const c2 = (r) => corregirExamen([pct.publica], { p: pct.clave }, { p: r }).puntos;
  assert.equal(c2('0,54'), 1); assert.equal(c2('0,56'), 0);
  const e = []; validarPregunta({ tipo: 'numerica', enunciado: 'x', valor: 'diez' }, 0, (r, t) => e.push(t)); assert.match(e[0], /«valor» tiene que ser un número/);
});
test('imagen con zonas: dentro / fuera de la zona correcta; las zonas no van al alumno', () => {
  const q = { id: 'z', tipo: 'zonas', enunciado: 'Señala', imagen: 'img/fotos/eee.webp', zonas: [{ x: 10, y: 10, w: 20, h: 20, nombre: 'buena' }, { x: 60, y: 60, w: 10, h: 10, correcta: false }] };
  const { s } = sepYCorregir(q, () => null);
  assert.equal('zonas' in s.publica, false);
  const c = (r) => corregirExamen([s.publica], { z: s.clave }, { z: r }).puntos;
  assert.equal(c({ x: 15, y: 25 }), 1); assert.equal(c({ x: 65, y: 65 }), 0); assert.equal(c(null), 0);
});
test('importar un examen con todos los tipos nuevos', () => {
  const md = readFileSync(new URL('./src/lms/semilla/FORMATO_IMPORTAR.md', import.meta.url), 'utf8');
  assert.match(md, /"tipo": "emparejar"/); assert.match(md, /"tipo": "zonas"/);
});
test('banco: n preguntas al azar de cada criterio, sin repetir ids; avisos si faltan', () => {
  const banco = [...Array(5)].map((_, i) => ({ id: 'a' + i, criterio: 'c1', q: { id: 'x', tipo: 'vf', enunciado: 'A' + i, correcta: true, puntos: 1 } }))
    .concat([...Array(3)].map((_, i) => ({ id: 'b' + i, criterio: 'c2', q: { id: 'x', tipo: 'vf', enunciado: 'B' + i, correcta: false, puntos: 1 } })));
  assert.deepEqual(porCriterio(banco), [{ criterio: 'c1', n: 5 }, { criterio: 'c2', n: 3 }]);
  const r = generarExamen(banco, { c1: 2, c2: 3 }, 42);
  assert.deepEqual(r.errores, []); assert.equal(r.preguntas.length, 5); assert.equal(new Set(r.preguntas.map((q) => q.id)).size, 5);
  assert.equal(r.preguntas.filter((q) => q.criterio === 'c2').length, 3); assert.equal(new Set(r.preguntas.map((q) => q.enunciado)).size, 5);
  assert.match(generarExamen(banco, { c2: 4 }).errores[0], /solo hay 3/);
  assert.notDeepEqual(generarExamen(banco, { c1: 5 }, 1).preguntas.map((q) => q.enunciado), generarExamen(banco, { c1: 5 }, 999).preguntas.map((q) => q.enunciado));
  const L = leerPreguntasBanco(JSON.stringify([{ tipo: 'vf', enunciado: 'x', correcta: true }]), '');
  assert.match(L.errores[0], /falta el «criterio»/);
  assert.equal(leerPreguntasBanco(JSON.stringify([{ tipo: 'vf', enunciado: 'x', correcta: true }]), 'c9').preguntas[0].criterio, 'c9');
});
test('modo examen: resumen de salidas une la salida con su vuelta', async () => {
  const { resumenSalidas } = await import('./src/portal/modo-examen.js').catch(() => ({}));
  if (!resumenSalidas) return; // necesita firebase/firestore (solo navegador); se prueba en el E2E
  const R = resumenSalidas([{ t: 1, tipo: 'pestaña', dur: null }, { t: 1, tipo: 'pestaña', dur: 12 }, { t: 5, tipo: 'pantalla', dur: null }]);
  assert.deepEqual(R.map((x) => x.dur), [12, null]);
});

test('Fase 2 · nada de listas dentro de listas (Firestore no las admite) en examen ni claves', async () => {
  const { validarPregunta, separarPregunta } = await import('./src/lms/preguntas.js');
  const anidada = (v) => Array.isArray(v) ? v.some((x) => Array.isArray(x) || anidada(x)) : (v && typeof v === 'object' ? Object.values(v).some(anidada) : false);
  const Q = [
    { id: 'a', tipo: 'emparejar', enunciado: 'x', pares: [['A', '1'], ['B', '2']], distractores: ['3'] },
    { id: 'b', tipo: 'ordenar', enunciado: 'x', elementos: ['1', '2', '3'] },
    { id: 'c', tipo: 'huecos', enunciado: 'x', texto: 'La [[a|b]] y [[c]]' },
    { id: 'd', tipo: 'numerica', enunciado: 'x', valor: 1, tolerancia: 0.1 },
    { id: 'e', tipo: 'zonas', enunciado: 'x', imagen: 'img/a.webp', zonas: [{ x: 1, y: 1, w: 10, h: 10 }] }];
  for (const q of Q) { const v = validarPregunta(q, 0, (e) => { throw new Error(e); }); const s = separarPregunta(v); assert.ok(!anidada(s.publica) && !anidada(s.clave), q.tipo); }
});

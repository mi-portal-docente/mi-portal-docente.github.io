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

// ------------------------------------------------------------------ Fase 3
test('Fase 3 · nota por criterio de un examen (con detalle, sin detalle, preguntas sin criterio)', async () => {
  const { notaPorCriterio } = await import('./src/lms/analitica.js');
  const P = [{ id: 'a', puntos: 2, criterio: 'c1' }, { id: 'b', puntos: 2, criterio: 'c1' }, { id: 'c', puntos: 1, criterio: 'c2' }, { id: 'd', puntos: 1 }];
  const r = notaPorCriterio(P, { a: 2, b: 1, c: 0, d: 1 }, 6.67, 'cX');
  assert.deepEqual(r, [{ criterio: 'c1', nota: 7.5 }, { criterio: 'c2', nota: 0 }, { criterio: 'cX', nota: 10 }]);
  assert.deepEqual(notaPorCriterio(P, null, 6, 'cX'), [{ criterio: 'cX', nota: 6 }]);
  assert.deepEqual(notaPorCriterio([{ id: 'a' }], { a: 1 }, 10, ''), [{ criterio: '', nota: 10 }]);
});

test('Fase 3 · CSV por criterio: 5 columnas, sin nombres, nota 0–10 con coma, ordenado', async () => {
  const { filasCriterios } = await import('./src/lms/analitica.js');
  const { csv } = await import('./src/lms/modelo.js');
  const F = filasCriterios([
    { n: 3, actividad: 'Examen', fecha: new Date(2026, 10, 13, 10).getTime(), nota: 7.5, criterio: 'c1' },
    { n: 1, actividad: 'Tarea', fecha: new Date(2026, 10, 12, 10).getTime(), nota: 12, criterio: '' },
    { n: 1, actividad: 'Sin nota', fecha: 1, nota: null, criterio: 'c1' }]);
  assert.deepEqual(F[0], ['nº de lista', 'actividad', 'fecha', 'nota', 'criterio']);
  assert.equal(F.length, 3); assert.ok(F.every((f) => f.length === 5));
  assert.deepEqual(F[1], ['01', 'Tarea', '2026-11-12', '10', '']);
  assert.deepEqual(F[2], ['03', 'Examen', '2026-11-13', '7,5', 'c1']);
  assert.match(csv(F), /^\ufeff"nº de lista";"actividad";"fecha";"nota";"criterio"\r\n"01";/);
});

test('Fase 3 · analítica: % por pregunta y por criterio (parcial incluido), de menor a mayor, más falladas', async () => {
  const { analizarExamen } = await import('./src/lms/analitica.js');
  const P = [{ id: 'q1', tipo: 'vf', enunciado: 'Uno', puntos: 1, criterio: 'c1' }, { id: 'q2', tipo: 'test', enunciado: 'Dos', puntos: 1, criterio: 'c2', opciones: ['a', 'b'] },
    { id: 'q3', tipo: 'ordenar', enunciado: 'Tres', puntos: 2, criterio: 'c2', elementos: ['x', 'y'] }];
  const K = { q1: true, q2: 1, q3: [1, 0] };
  const E = [{ respuestas: { q1: true, q2: 0, q3: [1, 0] } }, { respuestas: { q1: true, q2: 1, q3: [0, 1] } }, { respuestas: { q1: false }, detalle: { q1: 1, q2: 0, q3: 1 } }];
  const R = analizarExamen(P, K, E);
  assert.equal(R.n, 3);
  assert.deepEqual(R.porPregunta.map((q) => [q.id, q.pct]), [['q2', 33.3], ['q3', 50], ['q1', 100]]);
  assert.deepEqual(R.porCriterio.map((c) => [c.criterio, c.pct]), [['c2', 44.4], ['c1', 100]]);
  assert.deepEqual(R.masFalladas.map((q) => q.id), ['q2', 'q3']);
  assert.equal(R.porPregunta.find((q) => q.id === 'q2').fallos, 2);
  assert.equal(analizarExamen(P, K, []).masFalladas.length, 0);
});

// ------------------------------------------------------------------ Fase 4
test('Fase 4 · explicación: importar, validar (errores en castellano), vídeo, lab y sin listas anidadas', async () => {
  await import('./src/lms/motores/index.js');
  const { validarElemento, exportarElemento } = await import('./src/lms/elemento.js');
  const { anidada } = await import('./src/lms/motores/comun.js');
  const ok = validarElemento({ tipo: 'explicacion', titulo: 'E', contenido: { diapositivas: [
    { titulo: 'Uno', texto: 'Hola', video: 'https://www.youtube.com/watch?v=abcdefghijk' },
    { titulo: 'Dos', pregunta: { tipo: 'test', enunciado: '¿?', opciones: ['a', 'b'], correcta: 1 } },
    { titulo: 'Tres', lab: '#eee/circuitos' }], resumen: 'R' } });
  assert.deepEqual(ok.errores, []);
  assert.equal(ok.el.contenido.diapositivas[0].video.src, 'https://www.youtube-nocookie.com/embed/abcdefghijk');
  assert.ok(!anidada(ok.el.contenido));
  const mal = validarElemento({ tipo: 'explicacion', titulo: 'E', contenido: { diapositivas: [{ titulo: '', pregunta: { tipo: 'test', enunciado: 'x', opciones: ['a'], correcta: 4 } }, { titulo: 'v', video: 'http://x.com/a.avi' }] } });
  const rutas = mal.errores.map((e) => e.ruta);
  assert.ok(rutas.includes('contenido.diapositivas[0].titulo') && rutas.includes('contenido.diapositivas[0].pregunta.opciones') && rutas.includes('contenido.diapositivas[1].video'), rutas.join());
  assert.match(validarElemento({ tipo: 'explicacion', titulo: 'E' }).errores[0].texto, /necesita «contenido»/);
  const exp = exportarElemento({ tipo: 'explicacion', titulo: 'E', contenido: ok.el.contenido, puntos: 10 });
  assert.deepEqual(validarElemento(exp).errores, []);
});

test('Fase 4 · explicación: aciertos de las preguntas de control', async () => {
  const { aciertoControl, controles } = await import('./src/lms/motores/explicacion.js');
  assert.equal(aciertoControl({ tipo: 'test', correcta: 1 }, 1), true);
  assert.equal(aciertoControl({ tipo: 'test', correcta: 1 }, 0), false);
  assert.equal(aciertoControl({ tipo: 'vf', correcta: false }, false), true);
  assert.equal(aciertoControl({ tipo: 'vf', correcta: false }, 'false'), false);
  assert.equal(controles({ diapositivas: [{ pregunta: {} }, {}, { pregunta: {} }] }), 2);
});

test('Fase 4 · pregunta en directo: recuento anónimo', async () => {
  const { recuentoDe } = await import('./src/portal/directo.js').catch(() => ({}));
  if (!recuentoDe) return; // necesita firebase en node: se prueba en el E2E
  assert.deepEqual(recuentoDe([0, 2, 2, 5, -1, 1.5], 3), [1, 0, 2]);
});

test('Fase 5 · p5.js: validar retos, comprobaciones y exportar', async () => {
  await import('./src/lms/motores/index.js');
  const { anidada } = await import('./src/lms/motores/comun.js');
  const ok = validarElemento({ tipo: 'p5', titulo: 'P', contenido: { retos: [{ titulo: 'Uno', enunciado: 'x', comprobaciones: [
    { tipo: 'codigo', contiene: 'rect(' }, { tipo: 'variable', nombre: 'vel', min: 1, max: 5 }, { tipo: 'pixel', x: 5, y: 5, color: '#FF0000' }] }] } });
  assert.deepEqual(ok.errores, []);
  const r = ok.el.contenido.retos[0];
  assert.equal(r.id, 'r1'); assert.match(r.codigo, /createCanvas/); assert.equal(r.comprobaciones[2].color, '#ff0000'); assert.equal(r.comprobaciones[2].tolerancia, 40);
  assert.equal(anidada(ok.el.contenido), false);
  const mal = validarElemento({ tipo: 'p5', titulo: 'P', contenido: { retos: [{ titulo: 'x', enunciado: 'y', comprobaciones: [{ tipo: 'pixel', x: 1 }, { tipo: 'variable', nombre: 'a;alert(1)' }, { tipo: 'codigo', regex: '(' }, { tipo: 'otra' }] }] } });
  const t = mal.errores.map((e) => e.ruta + ' ' + e.texto).join('\n');
  assert.match(t, /comprobaciones\[0\]/); assert.match(t, /comprobaciones\[1\]\.nombre/); assert.match(t, /comprobaciones\[2\]\.regex/); assert.match(t, /comprobaciones\[3\]\.tipo/);
  assert.match(validarElemento({ tipo: 'p5', titulo: 'P', contenido: { retos: [] } }).errores[0].texto, /al menos 1/);
  const exp = exportarElemento({ tipo: 'p5', titulo: 'P', contenido: ok.el.contenido, puntos: 10 });
  assert.deepEqual(validarElemento(exp).errores, []);
});

test('Fase 5 · p5.js: comprobaciones y errores en castellano', async () => {
  const { evaluarComprobacion: ev, traducirError } = await import('./src/lms/motores/p5.js');
  assert.equal(ev({ tipo: 'codigo', contiene: 'rect(' }, 'rect(1,2,3,4)'), true);
  assert.equal(ev({ tipo: 'codigo', noContiene: 'rect(' }, 'rect(1,2,3,4)'), false);
  assert.equal(ev({ tipo: 'codigo', regex: 'circle\\s*\\(' }, 'circle (1,2,3)'), true);
  const m = { variables: { vel: { existe: true, v: 3 }, n: { existe: false, v: null } }, pixeles: { '5,5': [250, 3, 0] } };
  assert.equal(ev({ tipo: 'variable', nombre: 'vel', min: 1, max: 5 }, '', m), true);
  assert.equal(ev({ tipo: 'variable', nombre: 'vel', igual: 4 }, '', m), false);
  assert.equal(ev({ tipo: 'variable', nombre: 'n' }, '', m), false);
  assert.equal(ev({ tipo: 'pixel', x: 5, y: 5, color: '#ff0000', tolerancia: 10 }, '', m), true);
  assert.equal(ev({ tipo: 'pixel', x: 5, y: 5, distinto: '#ff0000', tolerancia: 10 }, '', m), false);
  assert.equal(ev({ tipo: 'pixel', x: 9, y: 9, color: '#ff0000', tolerancia: 10 }, '', m), false);
  assert.match(traducirError('Uncaught ReferenceError: circel is not defined'), /«circel» no existe/);
  assert.match(traducirError("SyntaxError: Unexpected token '}'"), /cerca de «}»/);
  assert.match(traducirError('SyntaxError: missing ) after argument list'), /paréntesis/);
  assert.match(traducirError('TypeError: fil is not a function'), /«fil» no es una función/);
  assert.match(traducirError('Algo raro'), /^Error: Algo raro/);
});

test('Fase 6 · TIC: validar y comprobar los motores web, info, ciber y bloques', async () => {
  await import('./src/lms/motores/index.js');
  const { motor } = await import('./src/lms/elemento.js');
  const { anidada } = await import('./src/lms/motores/comun.js');
  for (const t of ['web', 'info', 'ciber', 'bloques']) {
    const r = validarElemento({ tipo: t, titulo: 'X', contenido: motor(t).ejemplo });
    assert.deepEqual(r.errores, [], t); assert.equal(anidada(r.el.contenido), false, t + ' sin listas anidadas');
    assert.deepEqual(validarElemento(exportarElemento({ tipo: t, titulo: 'X', contenido: r.el.contenido, puntos: 10 })).errores, [], t + ' exportar/importar');
  }
  // info
  const I = await import('./src/lms/motores/info.js');
  assert.equal(I.convertir('13', 'dec', 'bin'), '1101'); assert.equal(I.convertir('FF', 'hex', 'dec'), '255'); assert.equal(I.convertir('Hi', 'ascii', 'hex'), '48 69'); assert.equal(I.convertir('72 105', 'dec', 'ascii'), 'Hi');
  assert.equal(I.respuestaCorrecta('00001101', '1101', 'bin'), true); assert.equal(I.respuestaCorrecta('ff', 'FF', 'hex'), true);
  const img = { tipo: 'tamano', archivo: { tipo: 'imagen', ancho: 800, alto: 600, bits: 24 }, unidad: 'KB', base: 1024, tolerancia: 1 };
  assert.equal(I.correctaInfo(img, '1406,25'), true); assert.equal(I.correctaInfo(img, '1440'), false);
  assert.equal(I.correctaInfo({ ...img, unidad: 'KB', base: 1000 }, '1440'), true);
  assert.equal(I.correctaInfo({ tipo: 'tamano', archivo: { tipo: 'audio', segundos: 10, hz: 44100, bits: 16, canales: 2 }, unidad: 'B', base: 1024, tolerancia: 1 }, '1764000'), true);
  assert.match(validarElemento({ tipo: 'info', titulo: 'X', contenido: { preguntas: [{ tipo: 'conversion', de: 'bin', a: 'dec', valor: '102' }] } }).errores[0].texto, /no es un número binario/);
  // ciber
  const C = await import('./src/lms/motores/ciber.js');
  assert.equal(C.fuerzaContrasena('1234').nivel, 0); assert.equal(C.fuerzaContrasena('password2024').nivel <= 1, true);
  assert.equal(C.fuerzaContrasena('Pato-Azul-Salta-Muro-8!').nivel >= 3, true);
  assert.match(validarElemento({ tipo: 'ciber', titulo: 'X', contenido: {} }).errores[0].texto, /al menos una parte/);
  assert.match(validarElemento({ tipo: 'ciber', titulo: 'X', contenido: { red: { nodos: [{ id: 'a', nombre: 'A', tipo: 'pc', x: 1, y: 1 }, { id: 'b', nombre: 'B', tipo: 'pc', x: 2, y: 2 }], enlaces: [{ a: 'a', b: 'z' }] } } }).errores.map((e) => e.texto).join(' '), /ids de nodos que existan.*riesgo|riesgo.*ids de nodos/);
  // bloques
  const B = await import('./src/lms/motores/bloques.js');
  const nv = B.validarBloques({ niveles: [{ titulo: 'E', mapa: ['######', '#S...#', '####.#', '####G#', '######'], bloques: ['avanzar', 'girar', 'repetir'], maxBloques: 5 }] }, () => {}).niveles[0];
  const bien = [{ op: 'repetir', n: 3, cuerpo: [{ op: 'avanzar' }] }, { op: 'girar', lado: 'der' }, { op: 'repetir', n: 2, cuerpo: [{ op: 'avanzar' }] }];
  const r1 = B.ejecutar(nv, bien); assert.equal(r1.meta, true); assert.equal(r1.bloques, 5); assert.equal(B.superado(nv, r1), true);
  const r2 = B.ejecutar(nv, [{ op: 'repetir', n: 5, cuerpo: [{ op: 'avanzar' }] }]); assert.match(r2.error, /chocado/);
  const r3 = B.ejecutar(nv, [{ op: 'mientras', cuerpo: [{ op: 'si', dir: 'delante', cuerpo: [{ op: 'avanzar' }], sino: [{ op: 'girar', lado: 'der' }] }] }]); assert.equal(r3.meta, true);
  assert.match(B.ejecutar(nv, [{ op: 'mientras', cuerpo: [{ op: 'girar', lado: 'izq' }] }]).error || 'no termina', /no termina|pasos/);
  const errs = []; B.validarBloques({ niveles: [{ titulo: 'x', mapa: ['#S#', '#.'] }] }, (r, t) => errs.push(r + ' ' + t));
  assert.match(errs.join('\n'), /mismo largo/); assert.match(errs.join('\n'), /exactamente una «S»/);
  // web
  const W = await import('./src/lms/motores/web.js');
  assert.equal(W.evaluarWeb({ tipo: 'codigo', en: 'css', contiene: 'COLOR' }, { html: '', css: 'h1{color:red}' }), true);
  assert.equal(W.evaluarWeb({ tipo: 'selector', selector: 'h1', min: 1, texto: 'mi web' }, {}, { n: 1, textos: ['Mi web'] }), true);
  assert.equal(W.evaluarWeb({ tipo: 'estilo', selector: 'h1', propiedad: 'color', valor: 'red' }, {}, { n: 1, coincide: false }), false);

});

test('Fase 7 · polímetro con continuidad y «Encuentra la avería»', async () => {
  await import('./src/lms/motores/index.js');
  const { motor } = await import('./src/lms/elemento.js');
  const { simulate } = await import('./src/circ/engine.js');
  const AV = await import('./src/lms/motores/averia.js');
  const base = motor('averia').ejemplo.montaje;
  const medir = (mod, mode, red, com) => { const M = structuredClone(base); Object.assign(M, mod); const me = M.parts.find((p) => p.id === 'M1'); me.props.mode = mode; me.probes = { red, com }; return simulate(M, {}, {}).res; };
  assert.equal(medir({}, 'V', 'h:a10', 'h:a14').L1.on, true);
  const ab = medir({ averia: { elemento: 'R1', tipo: 'abierto' } }, 'V', 'h:a10', 'h:a14'); assert.equal(ab.L1.on, false); assert.ok(ab.M1.meter.value > 6, 'R1 abierta: casi toda la tensión de la pila entre sus patas');
  const sinPila = { parts: base.parts.filter((p) => p.id !== 'B1'), wires: base.wires.filter((w) => !['w1', 'w2'].includes(w.id)) };
  const cont = (mod, red, com) => { const M = structuredClone(sinPila); Object.assign(M, mod); const me = M.parts.find((p) => p.id === 'M1'); me.props.mode = '·)))'; me.probes = { red, com }; return simulate(M, {}, {}).res.M1.meter; };
  assert.equal(cont({}, 'h:tp3', 'h:c10').beep, true, 'un cable bueno pita');
  assert.equal(cont({ averia: { elemento: 'w3', tipo: 'cable' } }, 'h:tp3', 'h:c10').beep, false, 'un cable cortado no pita');
  assert.equal(cont({}, 'h:c10', 'h:c14').text, 'OL', '470 Ω no pita');
  assert.equal(cont({ averia: { elemento: 'R1', tipo: 'corto' } }, 'h:c10', 'h:c14').beep, true, 'resistencia en corto pita');
  const rv = medir({ averia: { elemento: 'R1', tipo: 'valor', valor: 10000 } }, 'A', null, null); assert.ok(rv.L1.i < 0.001, 'R1 de 10 kΩ: casi sin corriente');
  assert.equal(medir({}, '·)))', 'h:a10', 'h:a14').M1.meter.powered, true, 'continuidad con alimentación: aviso');
  assert.deepEqual(validarElemento({ tipo: 'averia', titulo: 'X', contenido: motor('averia').ejemplo }).errores, []);
  const ea = (c) => validarElemento({ tipo: 'averia', titulo: 'X', contenido: { ...motor('averia').ejemplo, ...c } }).errores.map((e) => e.texto).join(' ');
  assert.match(ea({ averia: { elemento: 'R9', tipo: 'abierto' } }), /No hay ningún componente ni cable «R9»/);
  assert.match(ea({ averia: { elemento: 'L1', tipo: 'valor', valor: 5 } }), /solo para resistencias/);
  assert.match(ea({ averia: { elemento: 'w1', tipo: 'abierto' } }), /tiene que ser "cable"/);
  assert.match(ea({ montaje: 'no es json' }), /exportado desde el laboratorio/);
  assert.equal(AV.leerMontaje(JSON.stringify({ app: 'circuitos', model: base })).parts.length, 4);
  assert.deepEqual(AV.evaluarAveria({ elemento: 'R1', tipo: 'abierto' }, { elemento: 'R1', tipo: 'corto' }), { elemento: true, tipo: false, a: 1, t: 2 });
  assert.equal(AV.evaluarAveria({ elemento: 'R1', tipo: 'abierto' }, { elemento: 'L1', tipo: 'abierto' }).a, 0);
});

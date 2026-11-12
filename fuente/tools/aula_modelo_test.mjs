// Pruebas unitarias de la lógica del aula virtual (node --test aula_modelo_test.mjs)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { corregirExamen, notaRubrica, mediaPonderada, barajar, semilla, pinValido, hashPin, leeEnlaces, leeRubrica, normaliza, csv, fmtNota } from './src/lms/modelo.js';
import { BIBLIOTECA, itemBiblioteca, cuentaItems, asignatura } from './src/lms/biblioteca.js';
import { enlaceValido, tipoAdjunto, ordenEntre } from './src/lms/modelo.js';
import { parsear, limpiaUrl, neutro } from './importar-classroom.mjs';
import { readFileSync, existsSync } from 'fs';

const P = [{ id: 'a', tipo: 'test', puntos: 1 }, { id: 'b', tipo: 'vf', puntos: 1 }, { id: 'c', tipo: 'corta', puntos: 2 }];
const K = { a: 1, b: false, c: ['celda', 'la celda'] };
test('examen: todo bien → 10; corta sin tildes ni mayúsculas', () => {
  const r = corregirExamen(P, K, { a: 1, b: false, c: 'CÉLDA.' });
  assert.equal(r.nota, 10); assert.equal(r.puntos, 4); assert.deepEqual(r.revisar, []);
});
test('examen: fallos, sin responder y corta a revisar', () => {
  const r = corregirExamen(P, K, { a: 0, c: 'casilla' });
  assert.equal(r.puntos, 0); assert.equal(r.nota, 0); assert.deepEqual(r.revisar, ['c']);
});
test('examen: V/F no acepta textos («false» como cadena)', () => {
  assert.equal(corregirExamen([P[1]], K, { b: 'false' }).puntos, 0);
});
test('examen: puntos manuales del profesor (limitados al máximo)', () => {
  const r = corregirExamen(P, K, { a: 1, b: true, c: 'casilla' }, { c: 5 });
  assert.equal(r.detalle.c, 2); assert.equal(r.puntos, 3); assert.equal(r.nota, 7.5);
});
test('rúbrica', () => {
  assert.deepEqual(notaRubrica([{ c: 'x', p: 4 }, { c: 'y', p: 6 }], { 0: 3, 1: 9 }), { puntos: 9, max: 10, nota: 9 });
  assert.equal(notaRubrica([], {}).nota, null);
});
test('media ponderada: categorías sin notas no cuentan', () => {
  const r = mediaPonderada([{ categoria: 'examenes', nota: 10 }, { categoria: 'tareas', nota: 8 }, { categoria: 'tareas', nota: null }], { examenes: 40, tareas: 30, proyectos: 20, practicas: 10 });
  assert.equal(r.medias.tareas, 8); assert.equal(r.medias.proyectos, null); assert.equal(r.final, 9.14);
  assert.equal(mediaPonderada([], {}).final, null);
});
test('barajado determinista', () => {
  const a = barajar([1, 2, 3, 4, 5, 6], semilla('x|g1_5')); const b = barajar([1, 2, 3, 4, 5, 6], semilla('x|g1_5'));
  assert.deepEqual(a, b); assert.deepEqual([...a].sort(), [1, 2, 3, 4, 5, 6]);
});
test('PIN: formato y hash (no contiene el PIN)', async () => {
  assert.ok(pinValido('1234')); assert.ok(!pinValido('12')); assert.ok(!pinValido('12a4')); assert.ok(!pinValido('123456789'));
  const h = await hashPin('g1', 5, '4321');
  assert.match(h, /^[0-9a-f]{64}$/); assert.notEqual(h, await hashPin('g1', 6, '4321')); assert.ok(!h.includes('4321'));
});
test('enlaces: solo http(s); rúbrica en texto', () => {
  assert.deepEqual(leeEnlaces('Doc | https://a.es/x\njavascript:alert(1)\nhttps://b.es'), [{ t: 'Doc', u: 'https://a.es/x' }, { t: '', u: 'https://b.es' }]);
  assert.deepEqual(leeRubrica('Contenido | 4\nFormato | 2,5\nSin puntos'), [{ c: 'Contenido', p: 4 }, { c: 'Formato', p: 2.5 }, { c: 'Sin puntos', p: 1 }]);
});
test('utilidades', () => {
  assert.equal(normaliza('  Ácido  Nítrico! '), 'acido nitrico'); assert.equal(fmtNota(9.145), '9,15');
  assert.ok(csv([['a', 'b"c']]).startsWith('\ufeff"a";"b""c"'));
});
test('biblioteca: 5 asignaturas, ids únicos y estables, sin datos personales', () => {
  assert.equal(BIBLIOTECA.length, 5);
  const ids = BIBLIOTECA.flatMap((a) => a.unidades.flatMap((u) => u.items.map((i) => i.id)));
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(itemBiblioteca('tic1.t01-sda-1-mi-primer-dossier-academ.12').titulo, 'Desafío Final DOCS Semana del 26');
  assert.ok(BIBLIOTECA.every((a) => cuentaItems(a) > 0));
  assert.ok(!/salesian/i.test(JSON.stringify(BIBLIOTECA)));
});

test('semillas de Classroom 26/27: mismo orden de temas, borradores y avisos de pendiente', () => {
  const eee = asignatura('eee');
  assert.deepEqual(eee.unidades.slice(0, 3).map((u) => u.titulo), ['Sin tema', 'Evaluación Inicial', 'SA 1- B1 (Tema 1,2,3,4)- Construimos nuestro tablero eléctrico.']);
  const its = eee.unidades.flatMap((u) => u.items);
  assert.equal(its.length, 61); assert.equal(its.filter((i) => i.estado === 'borrador').length, 45);
  const ej3 = its.find((i) => /Ejercicio 3 PREPARAMOS/.test(i.titulo));
  assert.ok(ej3.enlaces.some((e) => e.u === 'materiales/eee/sa1/SA1_Trabajo3_montaje_tablero.pdf'));
  assert.ok(ej3.enlaces.some((e) => /drive\.google\.com/.test(e.u)), 'los enlaces de Drive se mantienen');
  const tic1 = asignatura('tic1');
  assert.equal(tic1.unidades.length, 5);
  const d1 = tic1.unidades[1].items[0]; assert.equal(d1.titulo, 'Desafío 1 (DOCS)'); assert.equal(d1.estado, 'borrador'); assert.equal(d1.pendiente, true);
  const ev = tic1.unidades[0].items[1]; assert.equal(ev.pendiente, false); assert.equal(ev.puntos, 100);
  assert.match(ev.enlaces[0].u, /\/viewform$/);
  assert.ok(BIBLIOTECA.every((a) => a.semilla.cursoEscolar === '26/27'));
});
test('importador: viñetas, estado tras el título, «N puntos», fecha relativa y nombre del centro', () => {
  const md = `# X\n\n## Tema A\n- **Tarea — Uno** — Borrador. No se abrió Editar.\n- **Tarea — Dos** — Publicado; entrega: 2 oct, 10:00; 100 puntos. Adjunto: “Doc” — Microsoft Word — https://drive.google.com/file/d/abc/view?usp=classroom_web&authuser=0\n- **Tarea — Tres en Salesianos** — Publicado; entrega: Mañana, 8:00.\n- **Material — Cuatro** — Última modificación: 16 oct (no marcado como borrador).\n`;
  const [t] = parsear(md);
  assert.equal(t.nombre, 'Tema A');
  const [a, b, c, d] = t.items;
  assert.equal(a.estado, 'borrador'); assert.equal(a.pendiente, true); assert.match(a.nota, /Pendiente de completar/);
  assert.equal(b.estado, 'publicado'); assert.equal(b.puntos, 100); assert.equal(b.fechaEntrega, '2026-10-02T10:00'); assert.equal(b.enlaces[0].url, 'https://drive.google.com/file/d/abc/view?usp=classroom_web'); assert.ok(!b.pendiente);
  assert.equal(c.titulo, 'Tres en el cole'); assert.match(c.nota, /fecha relativa/);
  assert.equal(d.estado, 'publicado'); assert.equal(d.tipo, 'material');
  assert.equal(neutro('Logo Salesianos'), 'Logo el centro');
  assert.equal(limpiaUrl('https://docs.google.com/forms/d/X/edit?usp=classroom_web&authuser=0'), 'https://docs.google.com/forms/d/X/viewform');
});
test('adjuntos y orden', () => {
  assert.ok(enlaceValido('https://a.b/c') && enlaceValido('materiales/eee/sa1/x.pdf') && enlaceValido('#eee/vivienda/tablero'));
  assert.ok(!enlaceValido('javascript:alert(1)') && !enlaceValido('materiales/../x') && !enlaceValido('ftp://x'));
  assert.equal(tipoAdjunto('https://www.youtube.com/watch?v=1').t, 'YouTube');
  assert.equal(tipoAdjunto('materiales/eee/sa1/a.pdf').t, 'PDF');
  const o = ordenEntre(1000, 2000); assert.ok(o > 1000 && o < 2000);
  assert.ok(ordenEntre(null, 1000) < 1000 && ordenEntre(1000, null) > 1000);
});
test('sin rastro del nombre del centro en el material publicado', () => {
  for (const f of ['src/lms/semilla/eee.json', 'src/lms/semilla/cdpc1.json', 'src/lms/semilla/extras.json']) assert.ok(!/salesian/i.test(readFileSync(f, 'utf8')), f);
});

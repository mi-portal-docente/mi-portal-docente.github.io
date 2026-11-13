// Pruebas de las reglas de las novedades de la rama grok-plataforma (criterio, modo examen, banco,
// pregunta en directo, PIAC, recuperación…). Misma preparación que aula.test.mjs.
// Ejecutar:  npm run test:reglas   (desde tools/firebase)
import { test, before, after, beforeEach, describe } from 'node:test';
import { readFileSync } from 'node:fs';
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { setLogLevel, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, collection, query, where, serverTimestamp, Timestamp } from 'firebase/firestore';

const PROFE = 'profe@test.es';
let env;
const anon = (uid) => env.authenticatedContext(uid, { firebase: { sign_in_provider: 'anonymous' } }).firestore();
const profe = () => env.authenticatedContext('profe-uid', { email: PROFE, email_verified: true, firebase: { sign_in_provider: 'google.com' } }).firestore();
const H7 = '7'.repeat(64), H9 = '9'.repeat(64), HX = 'f'.repeat(64);
const ahora = () => Date.now();
const ts = (ms) => Timestamp.fromMillis(ms);

async function sembrar(fn) { await env.withSecurityRulesDisabled(async (ctx) => fn(ctx.firestore())); }
const ITEM_T = { curso: 'c2627', asig: 'eee', unidad: 'b2', tipo: 'tarea', titulo: 'Chuletario', texto: 'Haz…', enlaces: [], grupos: ['g1'], visible: ['g1'], publicado: true, orden: 1 };
const ITEM_E = { ...ITEM_T, tipo: 'examen', titulo: 'Test tema 3' };
const EXAMEN = (o = {}) => ({ grupos: ['g1'], publicado: true, desde: ts(ahora() - 3600e3), hasta: ts(ahora() + 3600e3), limiteMin: 30, barajar: true, preguntas: [{ id: 'q1', tipo: 'test', enunciado: '¿?', opciones: ['a', 'b'], puntos: 1 }], ...o });
const sesion = (numero, pin, o = {}) => ({ codigo: 'FARO-472', grupo: 'g1', numero, pagina: 'x', desde: ts(ahora() - 60000), latido: ts(ahora() - 60000), revocada: false, pin, ...o });
const tarea = (uid, o = {}) => ({ item: 'itemT01', curso: 'c2627', asig: 'eee', al: 'g1_7', grupo: 'g1', numero: 7, uid, tipo: 'tarea', texto: 'Mi respuesta', enlaces: ['https://ejemplo.es'], fecha: serverTimestamp(), estado: 'entregado', ...o });
const intento = (uid, o = {}) => ({ item: 'itemE01', curso: 'c2627', asig: 'eee', al: 'g1_7', grupo: 'g1', numero: 7, uid, tipo: 'examen', respuestas: {}, inicio: serverTimestamp(), fecha: serverTimestamp(), estado: 'en_curso', ...o });
const nota = (o = {}) => ({ item: 'itemT01', curso: 'c2627', asig: 'eee', al: 'g1_7', grupo: 'g1', numero: 7, nota: 8, puntos: 8, max: 10, detalle: {}, comentario: 'Bien', publicada: false, fecha: 1, ...o });

before(async () => {
  setLogLevel('silent');
  const [host, port] = (process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8080').split(':');
  env = await initializeTestEnvironment({ projectId: 'demo-portal', firestore: { rules: readFileSync(new URL('../firestore.rules.desplegar', import.meta.url), 'utf8'), host, port: +port } });
});
after(async () => { await env?.cleanup(); });
beforeEach(async () => {
  await env.clearFirestore();
  await sembrar(async (db) => {
    await setDoc(doc(db, 'grupos/g1'), { nombre: '1ºA', asignaturas: ['eee'], apartados: ['esp32'], codigo: 'FARO-472', activo: true, horario: null, creado: 1, curso: 'c2627' });
    await setDoc(doc(db, 'codigos/FARO-472'), { grupo: 'g1', nombre: '1ºA', asignaturas: ['eee'], apartados: ['esp32'], activo: true, horario: null, curso: 'c2627' });
    await setDoc(doc(db, 'grupos/g2'), { nombre: '2ºB', asignaturas: ['tic1'], apartados: [], codigo: 'LUNA-118', activo: true, horario: null, creado: 1 });
    await setDoc(doc(db, 'codigos/LUNA-118'), { grupo: 'g2', nombre: '2ºB', asignaturas: ['tic1'], apartados: [], activo: true, horario: null });
    await setDoc(doc(db, 'sesiones/a7'), sesion(7, H7));
    await setDoc(doc(db, 'pines/g1_7'), { h: H7, creado: 1 });
    await setDoc(doc(db, 'sesiones/a9'), sesion(9, H9));
    await setDoc(doc(db, 'pines/g1_9'), { h: H9, creado: 1 });
    await setDoc(doc(db, 'sesiones/b5'), sesion(5, H7, { codigo: 'LUNA-118', grupo: 'g2' }));
    await setDoc(doc(db, 'pines/g2_5'), { h: H7, creado: 1 });
    await setDoc(doc(db, 'items/itemT01'), ITEM_T);
    await setDoc(doc(db, 'items/itemE01'), ITEM_E);
    await setDoc(doc(db, 'items/itemB01'), { ...ITEM_T, titulo: 'Borrador', publicado: false, visible: [] });
    await setDoc(doc(db, 'examenes/itemE01'), EXAMEN());
    await setDoc(doc(db, 'claves/itemE01'), { respuestas: { q1: 1 } });
  });
});

describe('Fase 1 · criterio', () => {
  test('el profesor guarda un item con criterio; criterio demasiado largo → denegado', async () => {
    await assertSucceeds(setDoc(doc(profe(), 'items/itemC01'), { ...ITEM_T, criterio: 'eee_c1_1' }));
    await assertFails(setDoc(doc(profe(), 'items/itemC02'), { ...ITEM_T, criterio: 'x'.repeat(61) }));
    await assertSucceeds(setDoc(doc(profe(), 'examenes/itemC03'), EXAMEN({ preguntas: [{ id: 'q1', tipo: 'test', enunciado: '¿?', opciones: ['a', 'b'], puntos: 1, criterio: 'eee_c1_1' }] })));
  });
  test('el alumno no puede crear items aunque lleven criterio', async () => {
    await assertFails(setDoc(doc(anon('a7'), 'items/itemC04'), { ...ITEM_T, criterio: 'eee_c1_1' }));
  });
});

describe('Fase 2 · modo examen (incidencias) y banco de preguntas', () => {
  const inc = (uid, o = {}) => ({ item: 'itemE01', al: 'g1_7', grupo: 'g1', numero: 7, uid, salidas: [{ t: 1, tipo: 'pestaña', dur: null }], fecha: serverTimestamp(), ...o });
  test('examen con «pantallaCompleta»; tipo raro → denegado', async () => {
    await assertSucceeds(setDoc(doc(profe(), 'examenes/itemE02'), EXAMEN({ pantallaCompleta: true })));
    await assertFails(setDoc(doc(profe(), 'examenes/itemE03'), EXAMEN({ pantallaCompleta: 'sí' })));
  });
  test('el alumno anota sus salidas (crear y añadir) pero NO puede leerlas; el profesor sí', async () => {
    const db = anon('a7');
    await assertSucceeds(setDoc(doc(db, 'incidencias/itemE01_g1_7'), inc('a7')));
    await assertSucceeds(setDoc(doc(db, 'incidencias/itemE01_g1_7'), inc('a7', { salidas: [{ t: 1, tipo: 'pestaña', dur: null }, { t: 1, tipo: 'pestaña', dur: 9 }] }), { merge: true }));
    await assertFails(getDoc(doc(db, 'incidencias/itemE01_g1_7')));
    await assertSucceeds(getDoc(doc(profe(), 'incidencias/itemE01_g1_7')));
  });
  test('ataque: anotar salidas de otro nº, de otro item o con campos extra → denegado', async () => {
    const db = anon('a7');
    await assertFails(setDoc(doc(db, 'incidencias/itemE01_g1_9'), inc('a7', { al: 'g1_9', numero: 9 })));
    await assertFails(setDoc(doc(db, 'incidencias/itemT01_g1_7'), inc('a7', { item: 'itemT01' })));
    await assertFails(setDoc(doc(db, 'incidencias/itemE01_g1_7'), inc('a7', { nota: 10 })));
    await assertFails(setDoc(doc(anon('b5'), 'incidencias/itemE01_g2_5'), inc('b5', { al: 'g2_5', grupo: 'g2', numero: 5 })));
  });
  test('banco: solo el profesor lee y escribe; criterio obligatorio', async () => {
    const q = { asig: 'eee', criterio: 'eee_c1_1', q: { tipo: 'vf', enunciado: 'x', correcta: true }, fecha: 1 };
    await assertSucceeds(setDoc(doc(profe(), 'banco/bancoA1'), q));
    await assertFails(setDoc(doc(profe(), 'banco/bancoA2'), { ...q, criterio: '' }));
    await assertFails(getDoc(doc(anon('a7'), 'banco/bancoA1')));
    await assertFails(setDoc(doc(anon('a7'), 'banco/bancoA3'), q));
  });
});

describe('Fase 4 · explicación interactiva y pregunta en directo', () => {
  const EXPL = { ...ITEM_T, tipo: 'explicacion', titulo: 'Explicación', contenido: { diapositivas: [{ titulo: 'Uno', texto: 'x' }], resumen: 'r' } };
  const DIR = { curso: 'c2627', asig: 'eee', grupo: 'g1', tipo: 'test', enunciado: '¿Cuál?', opciones: ['a', 'b', 'c'], abierta: true, mostrar: false, recuento: [0, 0, 0], fecha: 1 };
  const resp = (uid, o = {}) => ({ d: 'dirA01', al: 'g1_7', grupo: 'g1', uid, r: 1, fecha: serverTimestamp(), ...o });
  test('el profesor guarda una explicación con «contenido»; contenido que no es objeto → denegado', async () => {
    await assertSucceeds(setDoc(doc(profe(), 'items/itemX01'), EXPL));
    await assertFails(setDoc(doc(profe(), 'items/itemX02'), { ...EXPL, contenido: 'texto' }));
  });
  test('el alumno entrega la explicación como tarea («Aciertos: a/t»)', async () => {
    await sembrar((db) => setDoc(doc(db, 'items/itemX01'), EXPL));
    await assertSucceeds(setDoc(doc(anon('a7'), 'trabajos/itemX01_g1_7'), tarea('a7', { item: 'itemX01', texto: 'Explicación terminada. Aciertos: 2/3', enlaces: [] })));
  });
  test('pregunta en directo: el profesor la lanza; el alumno del grupo la lee y responde (y cambia)', async () => {
    await assertSucceeds(setDoc(doc(profe(), 'directo/dirA01'), DIR));
    const db = anon('a7');
    await assertSucceeds(getDocs(query(collection(db, 'directo'), where('grupo', '==', 'g1'), where('abierta', '==', true))));
    await assertSucceeds(setDoc(doc(db, 'respDirecto/dirA01_g1_7'), resp('a7')));
    await assertSucceeds(setDoc(doc(db, 'respDirecto/dirA01_g1_7'), resp('a7', { r: 2 })));
    await assertSucceeds(getDocs(query(collection(profe(), 'respDirecto'), where('d', '==', 'dirA01'))));
  });
  test('ataque: leer respuestas, responder por otro nº, opción fuera de rango, pregunta cerrada u otro grupo → denegado', async () => {
    await sembrar(async (db) => { await setDoc(doc(db, 'directo/dirA01'), DIR); await setDoc(doc(db, 'directo/dirC01'), { ...DIR, abierta: false }); });
    const db = anon('a7');
    await assertFails(getDocs(query(collection(db, 'respDirecto'), where('d', '==', 'dirA01'))));
    await assertFails(setDoc(doc(db, 'respDirecto/dirA01_g1_9'), resp('a7', { al: 'g1_9' })));
    await assertFails(setDoc(doc(db, 'respDirecto/dirA01_g1_7'), resp('a7', { r: 3 })));
    await assertFails(setDoc(doc(db, 'respDirecto/dirC01_g1_7'), resp('a7', { d: 'dirC01' })));
    await assertFails(setDoc(doc(db, 'respDirecto/dirA01_g1_7'), resp('a7', { nombre: 'x' })));
    await assertFails(getDocs(query(collection(anon('b5'), 'directo'), where('grupo', '==', 'g1'))));
    await assertFails(setDoc(doc(anon('b5'), 'respDirecto/dirA01_g2_5'), resp('b5', { al: 'g2_5', grupo: 'g2' })));
    await assertFails(setDoc(doc(db, 'directo/dirX01'), DIR));
  });
});

describe('Fase 5 · laboratorio p5.js', () => {
  const P5 = { ...ITEM_T, tipo: 'p5', titulo: 'Retos p5', contenido: { retos: [{ id: 'r1', titulo: 'Uno', enunciado: 'x', codigo: 'let a = 1;', pistas: [], comprobaciones: [{ tipo: 'codigo', contiene: 'a', mensaje: '' }] }] } };
  test('el profesor guarda un elemento p5 y el alumno entrega el código como tarea', async () => {
    await assertSucceeds(setDoc(doc(profe(), 'items/itemP501'), P5));
    await sembrar((db) => setDoc(doc(db, 'items/itemP501'), P5));
    await assertSucceeds(setDoc(doc(anon('a7'), 'trabajos/itemP501_g1_7'), tarea('a7', { item: 'itemP501', texto: 'Laboratorio p5.js. Aciertos: 1/1\n\n--- Reto 1 ---\nlet a = 1;', enlaces: [] })));
  });
  test('ataque: un alumno no puede crear elementos p5', async () => {
    await assertFails(setDoc(doc(anon('a7'), 'items/itemP502'), P5));
  });
});

describe('Fase 6 · laboratorios de TIC (web, info, ciber, bloques)', () => {
  const C = { web: { retos: [{ id: 'r1', titulo: 'T', enunciado: 'x', html: '', css: '', pistas: [], comprobaciones: [{ tipo: 'selector', selector: 'h1', min: 1, mensaje: '' }] }] },
    info: { preguntas: [{ tipo: 'conversion', de: 'dec', a: 'bin', valor: '13', enunciado: '', explicacion: '' }] },
    ciber: { contrasena: { minimo: 'fuerte' } },
    bloques: { niveles: [{ id: 'n1', titulo: 'N', enunciado: '', mapa: ['#####', '#S.G#', '#####'], direccion: 'E', bloques: ['avanzar'], maxBloques: null }] } };
  test('el profesor guarda los cuatro tipos y el alumno entrega cada uno como tarea', async () => {
    for (const [t, contenido] of Object.entries(C)) {
      const it = { ...ITEM_T, tipo: t, titulo: t, contenido };
      await assertSucceeds(setDoc(doc(profe(), `items/item${t}01`), it));
      await sembrar((db) => setDoc(doc(db, `items/item${t}01`), it));
      await assertSucceeds(setDoc(doc(anon('a7'), `trabajos/item${t}01_g1_7`), tarea('a7', { item: `item${t}01`, texto: `${t}. Aciertos: 1/1`, enlaces: [] })));
    }
  });
  test('ataque: tipo inventado → denegado', async () => {
    await assertFails(setDoc(doc(profe(), 'items/itemZZ01'), { ...ITEM_T, tipo: 'virus', titulo: 'x', contenido: {} }));
  });
});


describe('Fase 7 · «Encuentra la avería»', () => {
  const contenido = { enunciado: 'El LED no luce', montaje: '{"parts":[],"wires":[]}', averia: { elemento: 'R1', tipo: 'abierto' }, pistas: [], explicacion: '' };
  test('el profesor guarda una avería y el alumno entrega su diagnóstico', async () => {
    const it = { ...ITEM_T, tipo: 'averia', titulo: 'Avería', contenido };
    await assertSucceeds(setDoc(doc(profe(), 'items/itemav01'), it));
    await sembrar((db) => setDoc(doc(db, 'items/itemav01'), it));
    await assertSucceeds(setDoc(doc(anon('a7'), 'trabajos/itemav01_g1_7'), tarea('a7', { item: 'itemav01', texto: 'Diagnóstico: R1 · abierto. Aciertos: 2/2', enlaces: [] })));
  });
  test('ataque: un alumno no puede crear una avería', async () => {
    await assertFails(setDoc(doc(anon('a7'), 'items/itemav02'), { ...ITEM_T, tipo: 'averia', titulo: 'x', contenido }));
  });
});

describe('Fase 8 · recuperación, PIAC y avisos programados', () => {
  const REC = { ...ITEM_T, tipo: 'recuperacion', titulo: 'Recuperación T1', grupos: ['g1'], visible: [], para: [7], visibleAl: ['g1_7'], publicado: true };
  test('recuperación: el profesor la publica solo para algunos nº de lista', async () => {
    await assertSucceeds(setDoc(doc(profe(), 'items/itemR001'), REC));
    await assertSucceeds(setDoc(doc(profe(), 'items/itemR002'), { ...REC, publicado: false, visibleAl: [] }));
    await assertFails(setDoc(doc(profe(), 'items/itemR003'), { ...REC, visible: ['g1'] }), 'no se publica para el grupo entero');
    await assertFails(setDoc(doc(profe(), 'items/itemR004'), { ...ITEM_T, visibleAl: ['g1_7'] }), 'visibleAl solo en recuperación');
    await assertFails(setDoc(doc(profe(), 'items/itemR005'), { ...REC, visibleAl: [] }), 'publicada sin alumnos');
  });
  test('recuperación: la ve y la entrega el nº elegido; otro alumno del grupo no', async () => {
    await sembrar((db) => setDoc(doc(db, 'items/itemR001'), REC));
    await assertSucceeds(getDoc(doc(anon('a7'), 'items/itemR001')));
    await assertSucceeds(getDocs(query(collection(anon('a7'), 'items'), where('visibleAl', 'array-contains', 'g1_7'))));
    await assertSucceeds(getDocs(query(collection(anon('a7'), 'items'), where('visible', 'array-contains', 'g1'))));
    await assertFails(getDoc(doc(anon('a9'), 'items/itemR001')));
    await assertFails(getDocs(query(collection(anon('a9'), 'items'), where('visibleAl', 'array-contains', 'g1_7'))));
    await assertSucceeds(setDoc(doc(anon('a7'), 'trabajos/itemR001_g1_7'), tarea('a7', { item: 'itemR001' })));
    await assertFails(setDoc(doc(anon('a9'), 'trabajos/itemR001_g1_9'), tarea('a9', { item: 'itemR001', al: 'g1_9', numero: 9 })));
  });
  const PIAC = { ...ITEM_T, tipo: 'piac', titulo: 'Proyecto', contenido: { equipos: [{ id: 'e1', nombre: 'Equipo 1', grupo: 'g1', miembros: [7, 9] }, { id: 'e2', nombre: 'Equipo 2', grupo: 'g1', miembros: [3] }], miembros: { e1: [7, 9], e2: [3] }, grupoDe: { e1: 'g1', e2: 'g1' }, criterios: [] } };
  const T1 = (o = {}) => ({ item: 'itemP001', equipo: 'e1', grupo: 'g1', clase: 'tarea', texto: 'Hacer el esquema', estado: 'pendiente', resp: 9, fecha: null, autor: 7, creado: 1, ...o });
  test('PIAC: los miembros crean, mueven y leen las tareas de su equipo', async () => {
    await sembrar((db) => setDoc(doc(db, 'items/itemP001'), PIAC));
    await assertSucceeds(setDoc(doc(anon('a7'), 'piac/tareaA001'), T1()));
    await assertSucceeds(updateDoc(doc(anon('a9'), 'piac/tareaA001'), { estado: 'encurso', actualizado: 2 }));
    await assertSucceeds(getDocs(query(collection(anon('a9'), 'piac'), where('item', '==', 'itemP001'), where('grupo', '==', 'g1'), where('equipo', '==', 'e1'))));
    await assertSucceeds(setDoc(doc(anon('a9'), 'piac/diarioA01'), T1({ clase: 'diario', texto: 'Hoy hemos montado la fuente.', estado: null, resp: null, autor: 9 })));
    await assertFails(updateDoc(doc(anon('a9'), 'piac/diarioA01'), { texto: 'otro' }), 'el diario no se edita');
    await assertSucceeds(deleteDoc(doc(anon('a9'), 'piac/tareaA001')));
  });
  test('PIAC ataques: otro equipo, autor falso, otro grupo, estado inventado', async () => {
    await sembrar((db) => setDoc(doc(db, 'items/itemP001'), PIAC));
    await sembrar((db) => setDoc(doc(db, 'piac/tareaB001'), T1({ equipo: 'e2', autor: 3 })));
    await assertFails(setDoc(doc(anon('a7'), 'piac/tareaA002'), T1({ equipo: 'e2' })));
    await assertFails(getDocs(query(collection(anon('a7'), 'piac'), where('item', '==', 'itemP001'), where('grupo', '==', 'g1'), where('equipo', '==', 'e2'))));
    await assertFails(getDoc(doc(anon('a7'), 'piac/tareaB001')));
    await assertFails(setDoc(doc(anon('a7'), 'piac/tareaA003'), T1({ autor: 9 })));
    await assertFails(setDoc(doc(anon('b5'), 'piac/tareaA004'), T1({ grupo: 'g2', autor: 5 })));
    await assertFails(setDoc(doc(anon('a7'), 'piac/tareaA005'), T1({ estado: 'olvidada' })));
  });
  test('PIAC: auto y coevaluación solo dentro del equipo; cada uno ve solo lo suyo', async () => {
    await sembrar((db) => setDoc(doc(db, 'items/itemP001'), PIAC));
    const ev = (de, a, o = {}) => ({ item: 'itemP001', equipo: 'e1', grupo: 'g1', de, a, puntos: { c1: 3, c2: 4 }, comentario: '', fecha: 1, ...o });
    await assertSucceeds(setDoc(doc(anon('a7'), 'piacEval/itemP001_g1_7_7'), ev(7, 7)));
    await assertSucceeds(setDoc(doc(anon('a7'), 'piacEval/itemP001_g1_7_9'), ev(7, 9)));
    await assertFails(setDoc(doc(anon('a7'), 'piacEval/itemP001_g1_7_3'), ev(7, 3)), 'no es de su equipo');
    await assertFails(setDoc(doc(anon('a7'), 'piacEval/itemP001_g1_9_7'), ev(9, 7)), 'no puede firmar por otro');
    await assertSucceeds(getDocs(query(collection(anon('a7'), 'piacEval'), where('item', '==', 'itemP001'), where('grupo', '==', 'g1'), where('de', '==', 7))));
    await assertFails(getDoc(doc(anon('a9'), 'piacEval/itemP001_g1_7_9')), 'el evaluado no ve quién le ha puntuado');
    await assertSucceeds(getDocs(query(collection(profe(), 'piacEval'), where('item', '==', 'itemP001'))));
  });
  test('tablón: aviso programado (pub en el futuro)', async () => {
    await assertSucceeds(setDoc(doc(profe(), 'anuncios/anunP001'), { curso: 'c2627', asig: 'eee', texto: 'Mañana, examen', grupos: ['g1'], visible: ['g1'], fecha: 1, pub: ahora() + 864e5 }));
  });
});

describe('Fase 9 · entregas completas', () => {
  const borr = (uid, o = {}) => tarea(uid, { estado: 'borrador', texto: 'A medias', enlaces: [], guardado: 1, ...o });
  test('borrador → entregado → anular (sin nota) → entregar otra vez', async () => {
    const db = anon('a7'); const r = doc(db, 'trabajos/itemT01_g1_7');
    await assertSucceeds(setDoc(r, borr('a7')));
    await assertSucceeds(setDoc(r, borr('a7', { texto: 'Un poco más' })));
    await assertSucceeds(setDoc(r, tarea('a7', { entregadoEn: 5, nEntregas: 1 })));
    await assertSucceeds(setDoc(r, borr('a7', { nEntregas: 1 })));
    await assertSucceeds(setDoc(r, tarea('a7', { nEntregas: 2 })));
    await assertFails(setDoc(r, tarea('a7', { estado: 'devuelto' })), 'el alumno no puede ponerse «devuelto»');
    await assertFails(setDoc(r, tarea('a7', { estado: 'calificado' })));
  });
  test('con nota (aunque no esté publicada) ya no se anula ni se cambia', async () => {
    await sembrar(async (db) => { await setDoc(doc(db, 'trabajos/itemT01_g1_7'), { ...tarea('a7'), fecha: 1 }); await setDoc(doc(db, 'notas/itemT01_g1_7'), nota()); });
    await assertFails(setDoc(doc(anon('a7'), 'trabajos/itemT01_g1_7'), borr('a7')));
  });
  test('«Devolver para corregir»: solo el profesor y solo una entrega; el alumno rehace y vuelve a entregar', async () => {
    await sembrar(async (db) => { await setDoc(doc(db, 'trabajos/itemT01_g1_7'), { ...tarea('a7'), fecha: 1 }); await setDoc(doc(db, 'notas/itemT01_g1_7'), nota()); });
    await assertFails(updateDoc(doc(anon('a7'), 'trabajos/itemT01_g1_7'), { estado: 'devuelto', devFecha: 2 }));
    await assertFails(updateDoc(doc(profe(), 'trabajos/itemT01_g1_7'), { estado: 'devuelto', devFecha: 2, texto: 'cambiado' }), 'el profesor no toca el texto');
    await assertSucceeds(updateDoc(doc(profe(), 'trabajos/itemT01_g1_7'), { estado: 'devuelto', devFecha: 2 }));
    await assertFails(setDoc(doc(anon('a7'), 'trabajos/itemT01_g1_7'), tarea('a7', { devFecha: 9 })), 'no cambia la fecha de devolución');
    await assertSucceeds(setDoc(doc(anon('a7'), 'trabajos/itemT01_g1_7'), borr('a7', { devFecha: 2 })));
    await assertSucceeds(setDoc(doc(anon('a7'), 'trabajos/itemT01_g1_7'), tarea('a7', { devFecha: 2, nEntregas: 2 })));
    await assertFails(setDoc(doc(anon('a7'), 'trabajos/itemT01_g1_7'), borr('a7', { devFecha: 2 })), 'reentregada con la nota antigua: bloqueada hasta que el profesor la vuelva a devolver');
    await assertFails(updateDoc(doc(profe(), 'trabajos/itemB02_g1_7'), { estado: 'devuelto', devFecha: 2 }));
  });
  test('comentarios privados: profesor y el alumno dueño; nadie más', async () => {
    await sembrar(async (db) => setDoc(doc(db, 'trabajos/itemT01_g1_7'), { ...tarea('a7'), fecha: 1 }));
    const c = (o = {}) => ({ autor: 'profesor', texto: 'Revisa el apartado 2', fecha: serverTimestamp(), ...o });
    await assertSucceeds(setDoc(doc(profe(), 'trabajos/itemT01_g1_7/comentarios/cmt00001'), c()));
    await assertSucceeds(getDocs(collection(anon('a7'), 'trabajos/itemT01_g1_7/comentarios')));
    await assertSucceeds(setDoc(doc(anon('a7'), 'trabajos/itemT01_g1_7/comentarios/cmt00002'), c({ autor: 'alumno', numero: 7, texto: 'Hecho' })));
    await assertFails(setDoc(doc(anon('a7'), 'trabajos/itemT01_g1_7/comentarios/cmt00003'), c()), 'el alumno no firma como profesor');
    await assertFails(getDocs(collection(anon('a9'), 'trabajos/itemT01_g1_7/comentarios')));
    await assertFails(setDoc(doc(anon('a9'), 'trabajos/itemT01_g1_7/comentarios/cmt00004'), c({ autor: 'alumno', numero: 9 })));
  });
  test('versiones: el alumno las escribe al entregar pero no las lee; el profesor sí', async () => {
    const v = (o = {}) => ({ trabajo: 'itemT01_g1_7', item: 'itemT01', curso: 'c2627', asig: 'eee', al: 'g1_7', grupo: 'g1', numero: 7, n: 6, texto: 'v6', enlaces: [], fecha: serverTimestamp(), ...o });
    await assertSucceeds(setDoc(doc(anon('a7'), 'versiones/itemT01_g1_7_v1'), v()));
    await assertFails(getDoc(doc(anon('a7'), 'versiones/itemT01_g1_7_v1')));
    await assertFails(setDoc(doc(anon('a7'), 'versiones/itemT01_g1_7_v2'), v()), 'hueco equivocado');
    await assertFails(setDoc(doc(anon('a9'), 'versiones/itemT01_g1_7_v1'), v()), 'otro alumno');
    await assertSucceeds(getDocs(query(collection(profe(), 'versiones'), where('trabajo', '==', 'itemT01_g1_7'))));
  });
  test('entregas del laboratorio por grupo + nº: se ven desde otro ordenador; migración del profesor', async () => {
    const ent = (uid, o = {}) => ({ uid, codigo: 'FARO-472', grupo: 'g1', numero: 7, practica: 'c4', tipo: 'circuitos', titulo: 'Práctica 4', fecha: serverTimestamp(), datos: { aciertos: '1/2' }, nota: null, comentario: '', ...o });
    await assertSucceeds(setDoc(doc(anon('a7'), 'entregas/g1_7_c4'), ent('a7', { al: 'g1_7' })));
    await sembrar(async (db) => { await setDoc(doc(db, 'sesiones/a7b'), sesion(7, H7)); });
    await assertSucceeds(getDocs(query(collection(anon('a7b'), 'entregas'), where('al', '==', 'g1_7'))));
    await assertSucceeds(setDoc(doc(anon('a7b'), 'entregas/g1_7_c4'), ent('a7b', { al: 'g1_7' })), 'otro ordenador vuelve a entregar');
    await assertFails(getDoc(doc(anon('a9'), 'entregas/g1_7_c4')));
    await assertFails(setDoc(doc(anon('a9'), 'entregas/g1_7_c5'), ent('a9', { practica: 'c5', al: 'g1_7' })), 'no puede entregar como el nº 7');
    // antigua (ligada al uid) → copia del profesor con su nota
    await sembrar(async (db) => setDoc(doc(db, 'entregas/a7_g1_7_c2'), { ...ent('a7', { practica: 'c2' }), fecha: ts(1000), nota: 7, comentario: 'Bien' }));
    await assertFails(getDoc(doc(anon('a7b'), 'entregas/a7_g1_7_c2')), 'la antigua no se ve desde otro ordenador');
    const copia = { ...ent('a7', { practica: 'c2' }), fecha: ts(1000), nota: 7, comentario: 'Bien', al: 'g1_7', migradaDe: 'a7_g1_7_c2' };
    await assertSucceeds(setDoc(doc(profe(), 'entregas/g1_7_c2'), copia));
    await assertFails(setDoc(doc(profe(), 'entregas/g1_9_c2'), copia), 'ID que no cuadra con grupo y nº');
    await assertSucceeds(getDoc(doc(anon('a7b'), 'entregas/g1_7_c2')));
    await assertSucceeds(getDoc(doc(profe(), 'entregas/a7_g1_7_c2')), 'la original se conserva');
    await assertFails(setDoc(doc(anon('a7b'), 'entregas/g1_7_c2'), ent('a7b', { practica: 'c2', al: 'g1_7' })), 'con nota ya no se cambia');
  });
});

describe('Fase 10 · vista de corrección', () => {
  test('comentarios rápidos: solo el profesor los lee y escribe (lista corta)', async () => {
    await assertSucceeds(setDoc(doc(profe(), 'config/comentarios'), { lista: ['Muy bien.', 'Falta la conclusión.'] }));
    await assertSucceeds(getDoc(doc(profe(), 'config/comentarios')));
    await assertFails(getDoc(doc(anon('a7'), 'config/comentarios')));
    await assertFails(setDoc(doc(anon('a7'), 'config/comentarios'), { lista: [] }));
    await assertFails(setDoc(doc(profe(), 'config/comentarios'), { lista: [], otra: 1 }));
    await assertFails(setDoc(doc(profe(), 'config/otra'), { lista: [] }), 'el resto de config sigue cerrado');
  });
  test('nota en borrador (sin publicar): el alumno no la ve hasta publicarla', async () => {
    await sembrar(async (db) => setDoc(doc(db, 'notas/itemT01_g1_7'), nota({ publicada: false, detalle: { r0: 3, n0: 4 } })));
    await assertFails(getDoc(doc(anon('a7'), 'notas/itemT01_g1_7')));
    await assertSucceeds(updateDoc(doc(profe(), 'notas/itemT01_g1_7'), { publicada: true }));
    await assertSucceeds(getDoc(doc(anon('a7'), 'notas/itemT01_g1_7')));
  });
});

describe('Fase 11 · documento: imágenes y registro informativo', () => {
  const ITEM_D = { curso: 'c2627', asig: 'eee', tipo: 'documento', titulo: 'Doc', texto: '', enlaces: [], grupos: ['g1'], visible: ['g1'], publicado: true, contenido: { plantilla: '<h2>A</h2>' } };
  const img = (o = {}) => ({ data: 'data:image/jpeg;base64,' + 'A'.repeat(1000), w: 100, h: 80, fecha: serverTimestamp(), ...o });
  test('el alumno guarda un documento (tipo documento) con su HTML', async () => {
    await sembrar(async (db) => setDoc(doc(db, 'items/itemD01'), ITEM_D));
    await assertSucceeds(setDoc(doc(anon('a7'), 'trabajos/itemD01_g1_7'), tarea('a7', { item: 'itemD01', estado: 'borrador', doc: '<h2>A</h2><p>Hola</p>', texto: 'A Hola' })));
  });
  test('imágenes: máx. 3 huecos (img1–img3), ~300 KB, solo el dueño y el profesor', async () => {
    await sembrar(async (db) => { await setDoc(doc(db, 'items/itemD01'), ITEM_D); await setDoc(doc(db, 'trabajos/itemD01_g1_7'), { ...tarea('a7', { item: 'itemD01', estado: 'borrador' }), fecha: 1 }); });
    const r = (n, u = 'a7') => doc(anon(u), `trabajos/itemD01_g1_7/imagenes/${n}`);
    await assertSucceeds(setDoc(r('img1'), img()));
    await assertSucceeds(setDoc(r('img3'), img()));
    await assertFails(setDoc(r('img4'), img()), 'no hay cuarto hueco');
    await assertFails(setDoc(r('img2'), img({ data: 'data:image/jpeg;base64,' + 'A'.repeat(420000) })), 'demasiado grande');
    await assertFails(setDoc(r('img2'), img({ data: 'javascript:alert(1)' })));
    await assertFails(setDoc(r('img2', 'a9'), img()), 'otro alumno');
    await assertFails(getDoc(r('img1', 'a9')));
    await assertSucceeds(getDoc(r('img1')));
    await assertSucceeds(getDoc(doc(profe(), 'trabajos/itemD01_g1_7/imagenes/img1')));
    await assertSucceeds(deleteDoc(r('img3')));
  });
  test('registro de edición: el alumno lo suma pero no lo lee; el profesor sí', async () => {
    const reg = (o = {}) => ({ item: 'itemD01', al: 'g1_7', grupo: 'g1', numero: 7, seg: 42, pegados: [{ t: 1, n: 500 }], fecha: serverTimestamp(), ...o });
    await assertSucceeds(setDoc(doc(anon('a7'), 'registros/itemD01_g1_7'), reg()));
    await assertFails(getDoc(doc(anon('a7'), 'registros/itemD01_g1_7')));
    await assertFails(setDoc(doc(anon('a9'), 'registros/itemD01_g1_7'), reg()), 'otro alumno');
    await assertFails(setDoc(doc(anon('a7'), 'registros/itemD01_g1_7'), reg({ nota: 10 })));
    await assertSucceeds(getDoc(doc(profe(), 'registros/itemD01_g1_7')));
  });
});

describe('Fase 12 · actividad interactiva: varios intentos con el mejor resultado', () => {
  const ITEM_I = { curso: 'c2627', asig: 'eee', tipo: 'interactiva', titulo: 'Act', texto: '', enlaces: [], grupos: ['g1'], visible: ['g1'], publicado: true, contenido: { preguntas: [], claves: {}, intentos: 0, soluciones: true } };
  const datos = (n) => ({ intentos: n, mejor: 7.5, puntos: 3, max: 4, ultima: 5, resp: { q1: 1, q2: [0, 1, null] } });
  test('el alumno entrega cada intento (datos con el mejor) mientras no haya nota; luego no', async () => {
    await sembrar(async (db) => setDoc(doc(db, 'items/itemI01'), ITEM_I));
    await assertSucceeds(setDoc(doc(anon('a7'), 'trabajos/itemI01_g1_7'), tarea('a7', { item: 'itemI01', texto: 'Aciertos: 3/4', datos: datos(1) })));
    await assertSucceeds(setDoc(doc(anon('a7'), 'trabajos/itemI01_g1_7'), tarea('a7', { item: 'itemI01', texto: 'Aciertos: 3/4', datos: datos(2) }), { merge: true }));
    await sembrar(async (db) => setDoc(doc(db, 'notas/itemI01_g1_7'), { item: 'itemI01', curso: 'c2627', asig: 'eee', al: 'g1_7', grupo: 'g1', numero: 7, nota: 7.5, publicada: false, fecha: 1 }));
    await assertFails(setDoc(doc(anon('a7'), 'trabajos/itemI01_g1_7'), tarea('a7', { item: 'itemI01', texto: 'Aciertos: 4/4', datos: datos(3) }), { merge: true }));
  });
});

describe('Fase 13 · modelo 3D (STL pequeño) y hoja de cálculo', () => {
  const ITEM_H = { curso: 'c2627', asig: 'eee', tipo: 'hoja', titulo: 'Hoja', texto: '', enlaces: [], grupos: ['g1'], visible: ['g1'], publicado: true, contenido: { filas: 10, columnas: 4, celdas: {}, retos: [] } };
  test('el alumno guarda una hoja (tipo hoja) con el resumen del modelo 3D', async () => {
    await sembrar(async (db) => setDoc(doc(db, 'items/itemH01'), ITEM_H));
    await assertSucceeds(setDoc(doc(anon('a7'), 'trabajos/itemH01_g1_7'), tarea('a7', { item: 'itemH01', estado: 'borrador', doc: '{"v":1,"c":{"A1":"=SUMA(1;2)"}}', modelo: { nombre: 'pieza.stl', bytes: 1200 } })));
    await assertFails(setDoc(doc(anon('a7'), 'trabajos/itemH01_g1_7'), tarea('a7', { item: 'itemH01', estado: 'borrador', modelo: { nombre: 'x', bytes: 1, data: 'AAAA' } })), 'el resumen no lleva datos');
  });
  test('modelos/m1: ≤ 600 KB en base64, solo el dueño escribe; el profesor lo lee', async () => {
    await sembrar(async (db) => { await setDoc(doc(db, 'items/itemH01'), ITEM_H); await setDoc(doc(db, 'trabajos/itemH01_g1_7'), { ...tarea('a7', { item: 'itemH01', estado: 'borrador' }), fecha: 1 }); });
    const m = (n, u = 'a7') => doc(anon(u), `trabajos/itemH01_g1_7/modelos/${n}`);
    const md = (o = {}) => ({ data: 'U1RM'.repeat(100), nombre: 'pieza.stl', bytes: 300, fecha: serverTimestamp(), ...o });
    await assertSucceeds(setDoc(m('m1'), md()));
    await assertFails(setDoc(m('m2'), md()), 'solo m1');
    await assertFails(setDoc(m('m1'), md({ data: 'A'.repeat(830000) })), 'demasiado grande');
    await assertFails(setDoc(m('m1'), md({ data: '<script>' })));
    await assertFails(setDoc(m('m1', 'a9'), md()), 'otro alumno');
    await assertFails(getDoc(m('m1', 'a9')));
    await assertSucceeds(getDoc(doc(profe(), 'trabajos/itemH01_g1_7/modelos/m1')));
    await assertSucceeds(deleteDoc(m('m1')));
  });
});

describe('Fase 14 · copia del curso: comentarios con consulta de grupo', () => {
  test('el profesor lee todos los comentarios con collectionGroup; el alumno no', async () => {
    await sembrar(async (db) => { await setDoc(doc(db, 'trabajos/itemC01_g1_7'), { ...tarea('a7', { item: 'itemC01', estado: 'entregado' }), fecha: 1 }); await setDoc(doc(db, 'trabajos/itemC01_g1_7/comentarios/c00001'), { autor: 'profesor', texto: 'Bien', fecha: 1 }); });
    const { collectionGroup, getDocs } = await import('firebase/firestore');
    await assertSucceeds(getDocs(collectionGroup(profe(), 'comentarios')));
    await assertFails(getDocs(collectionGroup(anon('a7'), 'comentarios')));
  });
});

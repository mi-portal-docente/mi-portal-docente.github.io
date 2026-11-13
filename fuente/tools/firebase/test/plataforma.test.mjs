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

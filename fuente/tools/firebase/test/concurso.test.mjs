// Reglas del concurso de laboratorios: concursos/{grupo} (interruptor) y clasificacion/{grupo_nº} (resumen de puntos).
// Ejecutar:  npm run test:reglas   (desde tools/firebase)
import { test, before, after, beforeEach, describe } from 'node:test';
import { readFileSync } from 'node:fs';
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { setLogLevel, doc, getDoc, getDocs, setDoc, deleteDoc, collection, query, where, serverTimestamp, Timestamp } from 'firebase/firestore';

const PROFE = 'profe@test.es';
let env;
const anon = (uid) => env.authenticatedContext(uid, { firebase: { sign_in_provider: 'anonymous' } }).firestore();
const profe = () => env.authenticatedContext('profe-uid', { email: PROFE, email_verified: true, firebase: { sign_in_provider: 'google.com' } }).firestore();
const H7 = '7'.repeat(64), H8 = '8'.repeat(64);
const ts = (ms) => Timestamp.fromMillis(ms);
async function sembrar(fn) { await env.withSecurityRulesDisabled(async (ctx) => fn(ctx.firestore())); }
const sesion = (numero, pin, o = {}) => ({ codigo: 'FARO-472', grupo: 'g1', numero, pagina: 'x', desde: ts(Date.now() - 60000), latido: ts(Date.now() - 60000), revocada: false, pin, ...o });
const resumen = (o = {}) => ({ grupo: 'g1', numero: 7, cg: 3, ca: 1, vg: 2, va: 0, fecha: serverTimestamp(), ...o });
const activar = (v = true) => sembrar((db) => setDoc(doc(db, 'concursos/g1'), { activo: v, grupo: 'g1', fecha: ts(Date.now()) }));

before(async () => {
  setLogLevel('silent');
  const [host, port] = (process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8080').split(':');
  env = await initializeTestEnvironment({ projectId: 'demo-portal', firestore: { rules: readFileSync(new URL('../firestore.rules.desplegar', import.meta.url), 'utf8'), host, port: +port } });
});
after(async () => { await env?.cleanup(); });
beforeEach(async () => {
  await env.clearFirestore();
  await sembrar(async (db) => {
    for (const g of ['g1', 'g2']) {
      const c = g === 'g1' ? 'FARO-472' : 'LUNA-518';
      await setDoc(doc(db, 'grupos/' + g), { nombre: g, asignaturas: ['eee'], apartados: [], codigo: c, activo: true, horario: null, creado: 1 });
      await setDoc(doc(db, 'codigos/' + c), { grupo: g, nombre: g, asignaturas: ['eee'], apartados: [], activo: true, horario: null });
    }
    await setDoc(doc(db, 'sesiones/a7'), sesion(7, H7));
    await setDoc(doc(db, 'sesiones/a9'), sesion(9, H8));
    await setDoc(doc(db, 'sesiones/b3'), sesion(3, H7, { codigo: 'LUNA-518', grupo: 'g2' }));
    await setDoc(doc(db, 'sesiones/x5'), sesion(5, H7)); // sin PIN registrado
    for (const [id, h] of [['g1_7', H7], ['g1_9', H8], ['g2_3', H7]]) await setDoc(doc(db, 'pines/' + id), { h, creado: 1 });
  });
});

describe('concurso · concursos/{grupo}', () => {
  test('el profesor lo activa y lo apaga; el alumno del grupo lo lee', async () => {
    await assertSucceeds(setDoc(doc(profe(), 'concursos/g1'), { activo: true, grupo: 'g1', fecha: serverTimestamp() }));
    await assertSucceeds(getDoc(doc(anon('a7'), 'concursos/g1')));
    await assertSucceeds(setDoc(doc(profe(), 'concursos/g1'), { activo: false, grupo: 'g1', fecha: serverTimestamp() }));
    await assertSucceeds(getDocs(collection(profe(), 'concursos')));
  });
  test('ataque: el alumno no lo escribe; otro grupo no lo lee; campos extra o grupo distinto → denegado', async () => {
    await assertFails(setDoc(doc(anon('a7'), 'concursos/g1'), { activo: true, grupo: 'g1', fecha: serverTimestamp() }));
    await activar();
    await assertFails(getDoc(doc(anon('b3'), 'concursos/g1')));
    await assertFails(getDoc(doc(anon('x5'), 'concursos/g1')));
    await assertFails(getDocs(collection(anon('a7'), 'concursos')));
    await assertFails(setDoc(doc(profe(), 'concursos/g1'), { activo: true, grupo: 'g1', fecha: serverTimestamp(), extra: 1 }));
    await assertFails(setDoc(doc(profe(), 'concursos/g1'), { activo: true, grupo: 'g2', fecha: serverTimestamp() }));
    await assertFails(setDoc(doc(profe(), 'concursos/g1'), { activo: 'si', grupo: 'g1', fecha: serverTimestamp() }));
    await assertFails(deleteDoc(doc(anon('a7'), 'concursos/g1')));
  });
});

describe('concurso · clasificacion/{grupo_nº}', () => {
  test('el alumno publica su resumen y lo actualiza', async () => {
    await assertSucceeds(setDoc(doc(anon('a7'), 'clasificacion/g1_7'), resumen()));
    await assertSucceeds(setDoc(doc(anon('a7'), 'clasificacion/g1_7'), resumen({ cg: 4, ca: 2 })));
    await assertSucceeds(setDoc(doc(anon('a9'), 'clasificacion/g1_9'), resumen({ numero: 9, cg: 0, ca: 0, vg: 0, va: 0 })));
  });
  test('ataque: no puede escribir por otro nº, otro grupo, con campos extra, valores imposibles ni sin PIN', async () => {
    await assertFails(setDoc(doc(anon('a7'), 'clasificacion/g1_9'), resumen({ numero: 9 })));
    await assertFails(setDoc(doc(anon('a7'), 'clasificacion/g1_9'), resumen()));
    await assertFails(setDoc(doc(anon('a7'), 'clasificacion/g1_7'), resumen({ numero: 9 })));
    await assertFails(setDoc(doc(anon('a7'), 'clasificacion/g2_7'), resumen({ grupo: 'g2' })));
    await assertFails(setDoc(doc(anon('a7'), 'clasificacion/g1_7'), resumen({ nombre: 'Ana' })));
    await assertFails(setDoc(doc(anon('a7'), 'clasificacion/g1_7'), resumen({ cg: 99 })));
    await assertFails(setDoc(doc(anon('a7'), 'clasificacion/g1_7'), resumen({ cg: -1 })));
    await assertFails(setDoc(doc(anon('a7'), 'clasificacion/g1_7'), resumen({ cg: 2, ca: 3 })));
    await assertFails(setDoc(doc(anon('a7'), 'clasificacion/g1_7'), resumen({ vg: 1, va: 2 })));
    await assertFails(setDoc(doc(anon('a7'), 'clasificacion/g1_7'), resumen({ cg: 1.5 })));
    await assertFails(setDoc(doc(anon('a7'), 'clasificacion/g1_7'), resumen({ fecha: ts(1) })));
    await assertFails(setDoc(doc(anon('x5'), 'clasificacion/g1_5'), resumen({ numero: 5 })));
    await assertFails(setDoc(doc(anon('nadie'), 'clasificacion/g1_7'), resumen()));
    await assertFails(setDoc(doc(profe(), 'clasificacion/g1_7'), resumen()));
  });
  test('lectura: con el concurso apagado nadie del grupo lee; con él activo, solo los de su grupo; el profesor siempre', async () => {
    await sembrar((db) => setDoc(doc(db, 'clasificacion/g1_9'), { grupo: 'g1', numero: 9, cg: 5, ca: 2, vg: 0, va: 0, fecha: ts(1) }));
    const lista = (db, g) => getDocs(query(collection(db, 'clasificacion'), where('grupo', '==', g)));
    await assertFails(lista(anon('a7'), 'g1'));
    await assertFails(getDoc(doc(anon('a7'), 'clasificacion/g1_9')));
    await assertSucceeds(lista(profe(), 'g1'));
    await activar(false); await assertFails(lista(anon('a7'), 'g1'));
    await activar(true);
    await assertSucceeds(lista(anon('a7'), 'g1'));
    await assertSucceeds(getDoc(doc(anon('a7'), 'clasificacion/g1_9')));
    await assertFails(lista(anon('a7'), 'g2'));          // el grupo de otro
    await assertFails(lista(anon('b3'), 'g1'));          // un alumno de otro grupo
    await assertFails(getDocs(collection(anon('a7'), 'clasificacion'))); // sin filtrar por grupo
    await assertFails(lista(anon('x5'), 'g1'));          // sin PIN registrado
    await assertFails(getDocs(collection(anon('nadie'), 'clasificacion')));
  });
  test('solo el profesor borra', async () => {
    await sembrar((db) => setDoc(doc(db, 'clasificacion/g1_7'), { grupo: 'g1', numero: 7, cg: 1, ca: 0, vg: 0, va: 0, fecha: ts(1) }));
    await assertFails(deleteDoc(doc(anon('a7'), 'clasificacion/g1_7')));
    await assertSucceeds(deleteDoc(doc(profe(), 'clasificacion/g1_7')));
  });
});

// Pruebas de las reglas de «Usuarios»: dispositivo en la sesión, últimos accesos y bloqueo de un nº de lista.
// Ejecutar:  npm run test:reglas   (desde tools/firebase)
import { test, before, after, beforeEach, describe } from 'node:test';
import { readFileSync } from 'node:fs';
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { setLogLevel, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, collection, query, where, serverTimestamp, Timestamp, writeBatch } from 'firebase/firestore';

const PROFE = 'profe@test.es';
let env;
const anon = (uid) => env.authenticatedContext(uid, { firebase: { sign_in_provider: 'anonymous' } }).firestore();
const profe = () => env.authenticatedContext('profe-uid', { email: PROFE, email_verified: true, firebase: { sign_in_provider: 'google.com' } }).firestore();
const otroGoogle = () => env.authenticatedContext('x-uid', { email: 'intruso@test.es', email_verified: true, firebase: { sign_in_provider: 'google.com' } }).firestore();
const H7 = '7'.repeat(64), H9 = '9'.repeat(64);
const ts = (ms) => Timestamp.fromMillis(ms);
const viejo = () => ts(Date.now() - 60000);
async function sembrar(fn) { await env.withSecurityRulesDisabled(async (ctx) => fn(ctx.firestore())); }
const sesionNueva = (numero, pin, o = {}) => ({ codigo: 'FARO-472', grupo: 'g1', numero, pagina: 'Portada', desde: serverTimestamp(), latido: serverTimestamp(), revocada: false, pin, ...o });
const sesionVieja = (numero, pin, o = {}) => ({ ...sesionNueva(numero, pin), desde: viejo(), latido: viejo(), ...o });
const ITEM = { curso: 'c2627', asig: 'eee', tipo: 'tarea', titulo: 'Tarea', texto: '', enlaces: [], grupos: ['g1'], visible: ['g1'], publicado: true, orden: 1 };

before(async () => {
  setLogLevel('silent');
  const [host, port] = (process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8080').split(':');
  env = await initializeTestEnvironment({ projectId: 'demo-portal', firestore: { rules: readFileSync(new URL('../firestore.rules.desplegar', import.meta.url), 'utf8'), host, port: +port } });
});
after(async () => { await env?.cleanup(); });
beforeEach(async () => {
  await env.clearFirestore();
  await sembrar(async (db) => {
    await setDoc(doc(db, 'grupos/g1'), { nombre: '1ºA', asignaturas: ['eee'], apartados: [], codigo: 'FARO-472', activo: true, horario: null, creado: 1 });
    await setDoc(doc(db, 'codigos/FARO-472'), { grupo: 'g1', nombre: '1ºA', asignaturas: ['eee'], apartados: [], activo: true, horario: null });
    await setDoc(doc(db, 'sesiones/a7'), sesionVieja(7, H7));
    await setDoc(doc(db, 'pines/g1_7'), { h: H7, creado: 1 });
    await setDoc(doc(db, 'sesiones/a9'), sesionVieja(9, H9));
    await setDoc(doc(db, 'pines/g1_9'), { h: H9, creado: 1 });
    await setDoc(doc(db, 'items/itemT01'), ITEM);
    await setDoc(doc(db, 'temas/tema01'), { curso: 'c2627', asig: 'eee', nombre: 'Tema 1', orden: 1 });
  });
});

describe('Sesión con dispositivo', () => {
  test('el alumno guarda un resumen corto del dispositivo; uno larguísimo → denegado', async () => {
    await assertSucceeds(setDoc(doc(anon('n3'), 'sesiones/n3'), sesionNueva(3, 'c'.repeat(64), { disp: 'Chrome · ChromeOS' })));
    await assertFails(setDoc(doc(anon('n4'), 'sesiones/n4'), sesionNueva(4, 'd'.repeat(64), { disp: 'x'.repeat(61) })));
  });
  test('sigue sin admitir otros campos (nombre, correo)', async () => {
    await assertFails(setDoc(doc(anon('n5'), 'sesiones/n5'), sesionNueva(5, 'e'.repeat(64), { disp: 'Chrome', nombre: 'Ana' })));
  });
});

describe('Últimos accesos (accesos/{grupo_nº})', () => {
  test('el alumno registra su último acceso (hora del servidor) y el profesor los lista', async () => {
    await assertSucceeds(setDoc(doc(anon('a7'), 'accesos/g1_7'), { ultimo: serverTimestamp(), disp: 'Chrome · ChromeOS' }));
    await assertSucceeds(updateDoc(doc(anon('a7'), 'accesos/g1_7'), { ultimo: serverTimestamp() }));
    await assertSucceeds(getDocs(collection(profe(), 'accesos')));
    await assertSucceeds(deleteDoc(doc(profe(), 'accesos/g1_7')));
  });
  test('ataque: acceso de OTRO nº, hora falsa o campos extra → denegado', async () => {
    await assertFails(setDoc(doc(anon('a7'), 'accesos/g1_9'), { ultimo: serverTimestamp() }));
    await assertFails(setDoc(doc(anon('a7'), 'accesos/g1_7'), { ultimo: ts(Date.now() - 3600e3) }));
    await assertFails(setDoc(doc(anon('a7'), 'accesos/g1_7'), { ultimo: serverTimestamp(), nombre: 'Ana' }));
  });
  test('ataque: alumno lee o lista accesos; sin sesión no puede escribir', async () => {
    await assertFails(getDocs(collection(anon('a7'), 'accesos')));
    await assertFails(getDoc(doc(anon('a7'), 'accesos/g1_7')));
    await assertFails(setDoc(doc(anon('zz'), 'accesos/g1_7'), { ultimo: serverTimestamp() }));
    await assertFails(getDocs(collection(otroGoogle(), 'accesos')));
  });
});

describe('Bloqueo de un nº de lista (bloqueos/{grupo_nº})', () => {
  const bloquear = () => sembrar((db) => setDoc(doc(db, 'bloqueos/g1_7'), { desde: ts(Date.now()) }));
  test('el profesor bloquea (y cierra la sesión) y desbloquea', async () => {
    const db = profe(); const b = writeBatch(db);
    b.set(doc(db, 'bloqueos/g1_7'), { desde: serverTimestamp() }); b.update(doc(db, 'sesiones/a7'), { revocada: true });
    await assertSucceeds(b.commit());
    await assertSucceeds(getDocs(collection(db, 'bloqueos')));
    await assertSucceeds(deleteDoc(doc(db, 'bloqueos/g1_7')));
  });
  test('ataque: alumno u otra cuenta de Google bloquean / desbloquean / listan → denegado', async () => {
    await assertFails(setDoc(doc(anon('a7'), 'bloqueos/g1_9'), { desde: serverTimestamp() }));
    await assertFails(getDocs(collection(anon('a7'), 'bloqueos')));
    await assertFails(setDoc(doc(otroGoogle(), 'bloqueos/g1_9'), { desde: serverTimestamp() }));
    await bloquear();
    await assertFails(deleteDoc(doc(anon('a7'), 'bloqueos/g1_7')));
    await assertFails(setDoc(doc(profe(), 'bloqueos/g1_9'), { desde: serverTimestamp(), motivo: 'x' }));
  });
  test('el alumno puede comprobar si su nº está bloqueado (get) para ver el aviso', async () => {
    await bloquear();
    const d = await assertSucceeds(getDoc(doc(anon('a7'), 'bloqueos/g1_7')));
    if (!d.exists()) throw new Error('debería existir');
  });
  test('bloqueado: no puede volver a entrar (crear sesión) aunque el PIN sea correcto', async () => {
    await bloquear();
    await assertFails(setDoc(doc(anon('n7'), 'sesiones/n7'), sesionNueva(7, H7)));
    await assertSucceeds(setDoc(doc(anon('n9'), 'sesiones/n9'), sesionNueva(9, H9)));
  });
  test('bloqueado con la sesión aún abierta: ni latidos, ni leer, ni entregar, ni registrar acceso', async () => {
    await bloquear(); const db = anon('a7');
    await assertFails(updateDoc(doc(db, 'sesiones/a7'), { latido: serverTimestamp(), pagina: 'x' }));
    await assertFails(getDoc(doc(db, 'items/itemT01')));
    await assertFails(getDocs(query(collection(db, 'items'), where('visible', 'array-contains', 'g1'))));
    await assertFails(getDocs(collection(db, 'temas')));
    await assertFails(setDoc(doc(db, 'trabajos/itemT01_g1_7'), { item: 'itemT01', curso: 'c2627', asig: 'eee', al: 'g1_7', grupo: 'g1', numero: 7, uid: 'a7', tipo: 'tarea', texto: 'x', enlaces: [], fecha: serverTimestamp(), estado: 'entregado' }));
    await assertFails(setDoc(doc(db, 'entregas/a7_g1_7_c4'), { uid: 'a7', codigo: 'FARO-472', grupo: 'g1', numero: 7, practica: 'c4', tipo: 'circuitos', titulo: 'P4', fecha: serverTimestamp(), datos: {}, nota: null, comentario: '' }));
    await assertFails(setDoc(doc(db, 'accesos/g1_7'), { ultimo: serverTimestamp() }));
    // los demás números del grupo siguen igual
    await assertSucceeds(getDoc(doc(anon('a9'), 'items/itemT01')));
    await assertSucceeds(updateDoc(doc(anon('a9'), 'sesiones/a9'), { latido: serverTimestamp(), pagina: 'x' }));
  });
  test('desbloqueado: vuelve a poder leer', async () => {
    await bloquear(); await assertFails(getDoc(doc(anon('a7'), 'items/itemT01')));
    await sembrar((db) => deleteDoc(doc(db, 'bloqueos/g1_7')));
    await assertSucceeds(getDoc(doc(anon('a7'), 'items/itemT01')));
  });
});

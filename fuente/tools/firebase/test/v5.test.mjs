// Pruebas de las reglas nuevas de la v5 (secciones, PDF + versión interactiva, origen solo profesor, plantillas).
// Ejecutar:  npm run test:reglas   (desde tools/firebase)
import { test, before, after, beforeEach, describe } from 'node:test';
import { readFileSync } from 'node:fs';
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { setLogLevel, doc, getDoc, setDoc, updateDoc, Timestamp } from 'firebase/firestore';

const PROFE = 'profe@test.es';
let env;
const anon = (uid) => env.authenticatedContext(uid, { firebase: { sign_in_provider: 'anonymous' } }).firestore();
const profe = () => env.authenticatedContext('profe-uid', { email: PROFE, email_verified: true, firebase: { sign_in_provider: 'google.com' } }).firestore();
const H7 = '7'.repeat(64);
const ts = (ms) => Timestamp.fromMillis(ms);
async function sembrar(fn) { await env.withSecurityRulesDisabled(async (ctx) => fn(ctx.firestore())); }
const ITEM = { curso: 'c2627', asig: 'eee', tipo: 'material', titulo: 'Apuntes T1', texto: '', enlaces: [], grupos: ['g1'], visible: ['g1'], publicado: true, orden: 1 };
const sesion = (numero, pin, o = {}) => ({ codigo: 'FARO-472', grupo: 'g1', numero, pagina: 'x', desde: ts(Date.now() - 60000), latido: ts(Date.now() - 60000), revocada: false, pin, ...o });

before(async () => {
  setLogLevel('silent');
  const [host, port] = (process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8080').split(':');
  env = await initializeTestEnvironment({ projectId: 'demo-portal', firestore: { rules: readFileSync(new URL('../firestore.rules.desplegar', import.meta.url), 'utf8'), host, port: +port } });
});
after(async () => { await env?.cleanup(); });
beforeEach(async () => {
  await env.clearFirestore();
  await sembrar(async (db) => {
    await setDoc(doc(db, 'grupos/g1'), { nombre: '1ºA', asignaturas: ['eee'], apartados: [], codigo: 'FARO-472', activo: true, horario: null, creado: 1, curso: 'c2627' });
    await setDoc(doc(db, 'codigos/FARO-472'), { grupo: 'g1', nombre: '1ºA', asignaturas: ['eee'], apartados: [], activo: true, horario: null, curso: 'c2627' });
    await setDoc(doc(db, 'sesiones/a7'), sesion(7, H7));
    await setDoc(doc(db, 'pines/g1_7'), { h: H7, creado: 1 });
    await setDoc(doc(db, 'items/itemM01'), ITEM);
    await setDoc(doc(db, 'origenes/itemM01'), { drive: 'ID_DE_PRUEBA', ruta: '1_EEE/T1', version: 'v1', asig: 'eee', curso: 'c2627' });
    await setDoc(doc(db, 'config/secciones'), { activas: ['eee'], asig: { eee: [{ id: 'teoria', nombre: 'Apuntes', orden: 1, visible: true }] } });
  });
});

describe('v5 · config/secciones', () => {
  test('alumno con sesión y profesor la leen; solo el profesor la escribe', async () => {
    await assertSucceeds(getDoc(doc(anon('a7'), 'config/secciones')));
    await assertSucceeds(getDoc(doc(profe(), 'config/secciones')));
    await assertSucceeds(setDoc(doc(profe(), 'config/secciones'), { activas: ['eee', 'proy2'], asig: { eee: [{ id: 'laboratorio', nombre: 'Lab', orden: 0, visible: false }] } }));
    await assertFails(setDoc(doc(anon('a7'), 'config/secciones'), { activas: [] }));
  });
  test('ataque: sin sesión no se lee; campos extra → denegado', async () => {
    await assertFails(getDoc(doc(anon('nadie'), 'config/secciones')));
    await assertFails(setDoc(doc(profe(), 'config/secciones'), { activas: ['eee'], otro: 1 }));
    await assertFails(setDoc(doc(profe(), 'config/secciones'), { activas: 'eee' }));
  });
});

describe('v5 · items con sección, PDF y versión interactiva', () => {
  test('profesor guarda sección, pdf e interactivo válidos', async () => {
    await assertSucceeds(setDoc(doc(profe(), 'items/itemM02'), { ...ITEM, seccion: 'teoria', pdf: { archivo: 'archivos/abc123', nombre: 'EEE_T1_v3.pdf', descarga: false }, interactivo: { tipo: 'explicacion', ref: 'itemX01' } }));
    await assertSucceeds(updateDoc(doc(profe(), 'items/itemM02'), { seccion: 'examenes' }));
    await assertSucceeds(setDoc(doc(profe(), 'items/itemM03'), { ...ITEM, seccion: null, pdf: null, interactivo: null }));
  });
  test('ataque: sección desconocida, pdf fuera del portal o con campos extra → denegado', async () => {
    await assertFails(setDoc(doc(profe(), 'items/itemM04'), { ...ITEM, seccion: 'avisos' }));
    await assertFails(setDoc(doc(profe(), 'items/itemM04'), { ...ITEM, pdf: { archivo: 'https://drive.google.com/x', nombre: 'a.pdf' } }));
    await assertFails(setDoc(doc(profe(), 'items/itemM04'), { ...ITEM, pdf: { archivo: 'archivos/abc123', drive: 'x' } }));
    await assertFails(setDoc(doc(profe(), 'items/itemM04'), { ...ITEM, interactivo: { tipo: 'explicacion', ref: 'x', otro: 1 } }));
  });
  test('los elementos antiguos (sin campos nuevos) se siguen leyendo y escribiendo igual', async () => {
    await assertSucceeds(getDoc(doc(anon('a7'), 'items/itemM01')));
    await assertSucceeds(updateDoc(doc(profe(), 'items/itemM01'), { titulo: 'Apuntes T1 (v2)' }));
  });
});

describe('v5 · origen en Drive: solo el profesor', () => {
  test('el profesor lo lee y escribe; el alumno NUNCA lo lee', async () => {
    await assertSucceeds(getDoc(doc(profe(), 'origenes/itemM01')));
    await assertSucceeds(setDoc(doc(profe(), 'origenes/itemM02'), { drive: 'X', ruta: 'a/b', version: 'v3', asig: 'eee', curso: 'c2627' }));
    await assertFails(getDoc(doc(anon('a7'), 'origenes/itemM01')));
    await assertFails(setDoc(doc(anon('a7'), 'origenes/itemM09'), { drive: 'X' }));
    await assertFails(setDoc(doc(profe(), 'origenes/itemM03'), { drive: 'X', otro: 'y' }));
  });
});

describe('v5 · plantillas de examen', () => {
  test('solo el profesor', async () => {
    const P = { asig: 'eee', nombre: 'Examen T1', reglas: [{ criterio: 'eee_c1', tema: 't1', dificultad: 1, n: 2 }], fecha: 1 };
    await assertSucceeds(setDoc(doc(profe(), 'plantillas/plaA01'), P));
    await assertSucceeds(getDoc(doc(profe(), 'plantillas/plaA01')));
    await assertFails(getDoc(doc(anon('a7'), 'plantillas/plaA01')));
    await assertFails(setDoc(doc(anon('a7'), 'plantillas/plaA02'), P));
    await assertFails(setDoc(doc(profe(), 'plantillas/plaA03'), { ...P, nombre: '' }));
  });
});

describe('t174u · ajustes del profesor en la nota de un examen («Dar por válida»)', () => {
  const N = { item: 'itemM01', curso: 'c2627', asig: 'eee', al: 'g1_7', grupo: 'g1', numero: 7, nota: 3.33, puntos: 1, max: 3, detalle: { t1: 0, v1: 1, c1: 0 }, comentario: '', publicada: true, fecha: 1 };
  const AJ = { ...N, nota: 6.67, puntos: 2, detalle: { t1: 1, v1: 1, c1: 0, 'aj:t1': { a: 0, p: 1, f: 2 }, 'aj:_': { nota0: 3.33, pub0: true, creada: false } } };
  test('el profesor guarda y deshace un ajuste con las reglas de siempre', async () => {
    await assertSucceeds(setDoc(doc(profe(), 'notas/itemM01_g1_7'), N));
    await assertSucceeds(setDoc(doc(profe(), 'notas/itemM01_g1_7'), AJ));
    await assertSucceeds(setDoc(doc(profe(), 'notas/itemM01_g1_7'), N));
  });
  test('el alumno NO puede escribir ajustes ni cambiar su nota (ni crearla, ni actualizarla)', async () => {
    await assertFails(setDoc(doc(anon('a7'), 'notas/itemM01_g1_7'), AJ));
    await sembrar(async (db) => setDoc(doc(db, 'notas/itemM01_g1_7'), N));
    await assertFails(updateDoc(doc(anon('a7'), 'notas/itemM01_g1_7'), { 'detalle.t1': 1, nota: 6.67 }));
    await assertFails(setDoc(doc(anon('a7'), 'notas/itemM01_g1_7'), AJ));
    await assertSucceeds(getDoc(doc(anon('a7'), 'notas/itemM01_g1_7'))); // la suya, publicada, sí la lee
  });
  test('campos nuevos fuera de «detalle» siguen sin estar permitidos (no hay que pegar reglas)', async () => {
    await assertFails(setDoc(doc(profe(), 'notas/itemM01_g1_7'), { ...N, ajustes: {} }));
  });
});

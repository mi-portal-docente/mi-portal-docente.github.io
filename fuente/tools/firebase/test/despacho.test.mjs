// Reglas del Despacho virtual (PIAC SA1 T4): despachos/{item}_{grupo} (centralita) e items/trabajos de tipo «despacho».
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

const ITEM_D = { curso: 'c2627', asig: 'eee', tipo: 'despacho', titulo: 'Despacho virtual', texto: '', enlaces: [], grupos: ['g1'], visible: ['g1'], publicado: true,
  contenido: { dias: ['Lunes', 'Martes'], horario: { ini: 480, fin: 1320 }, viaje_min: 30, empresas: [{ id: 'e1', nombre: 'Empresa', personal: [{ codigo: 'P1', rol: 'Ayudante', turno: 'Mañana' }], recursos: ['Furgoneta'], trabajos: [{ id: 'T01', cliente: 'C', trabajo: 'X', perfil: 'Ayudante', personas: 1, horas: 1, ventana: { ini: 540, fin: 780 }, dia: 0, recurso: null }], llamadas: [{ cuando: 'Lunes', texto: 'Llama un cliente', tipo: 'Urgencia' }] }] } };
const central = (o = {}) => ({ item: 'itemD01', grupo: 'g1', asign: { 7: 'e1' }, llamadas: [{ e: '', k: 0, n: 0, t: 1 }], fecha: serverTimestamp(), ...o });
const trabajo = (o = {}) => ({ item: 'itemD01', curso: 'c2627', asig: 'eee', al: 'g1_7', grupo: 'g1', numero: 7, uid: 'a7', tipo: 'tarea', texto: 'Despacho virtual · Trabajos colocados 1/1', enlaces: [], fecha: serverTimestamp(), estado: 'borrador', doc: JSON.stringify({ v: 'dv1', emp: 'e1', b: { T01: { d: 0, s: 540, p: ['P1'], r: [] } }, h: [], inc: [], at: [], reg: { seg: 0, pest: 0 } }), ...o });

describe('despacho · items de tipo «despacho»', () => {
  test('el profesor crea el elemento con su contenido (empresas, trabajos, llamadas)', async () => {
    await assertSucceeds(setDoc(doc(profe(), 'items/itemD01'), ITEM_D));
  });
  test('el alumno guarda su tablero como borrador y lo entrega (trabajos/{id}.doc)', async () => {
    await sembrar((db) => setDoc(doc(db, 'items/itemD01'), ITEM_D));
    await assertSucceeds(setDoc(doc(anon('a7'), 'trabajos/itemD01_g1_7'), trabajo()));
    await assertSucceeds(setDoc(doc(anon('a7'), 'trabajos/itemD01_g1_7'), trabajo({ estado: 'entregado', entregadoEn: Date.now(), nEntregas: 1 })));
    await assertFails(setDoc(doc(anon('a9'), 'trabajos/itemD01_g1_7'), trabajo({ uid: 'a9' })), 'no por otro alumno');
    await assertFails(setDoc(doc(anon('a7'), 'trabajos/itemD01_g1_7'), trabajo({ doc: 'x'.repeat(300001) })), 'doc demasiado grande');
  });
});

describe('despacho · despachos/{item}_{grupo} (centralita)', () => {
  test('el profesor asigna empresas y lanza llamadas; los alumnos del grupo lo leen (también si aún no existe)', async () => {
    await assertSucceeds(getDoc(doc(anon('a7'), 'despachos/itemD01_g1')));
    await assertSucceeds(setDoc(doc(profe(), 'despachos/itemD01_g1'), central()));
    await assertSucceeds(setDoc(doc(profe(), 'despachos/itemD01_g1'), central({ llamadas: [{ e: '', k: 0, n: 0, t: 1 }, { e: 'e1', k: 1, n: 7, t: 2 }] })));
    await assertSucceeds(getDoc(doc(anon('a7'), 'despachos/itemD01_g1')));
    await assertSucceeds(getDoc(doc(anon('a9'), 'despachos/itemD01_g1')));
    await assertSucceeds(getDoc(doc(profe(), 'despachos/itemD01_g1')));
  });
  test('ataque: el alumno no escribe; otro grupo, sin PIN o sin sesión no leen; campos extra o id que no cuadra → denegado', async () => {
    await sembrar((db) => setDoc(doc(db, 'despachos/itemD01_g1'), { ...central(), fecha: ts(Date.now()) }));
    await assertFails(setDoc(doc(anon('a7'), 'despachos/itemD01_g1'), central()));
    await assertFails(setDoc(doc(anon('a7'), 'despachos/itemD01_g1'), central({ llamadas: [] })));
    await assertFails(deleteDoc(doc(anon('a7'), 'despachos/itemD01_g1')));
    await assertFails(getDoc(doc(anon('b3'), 'despachos/itemD01_g1')));
    await assertFails(getDoc(doc(anon('x5'), 'despachos/itemD01_g1')));
    await assertFails(getDoc(doc(anon('nadie'), 'despachos/itemD01_g1')));
    await assertFails(getDocs(collection(anon('a7'), 'despachos')));
    await assertFails(setDoc(doc(profe(), 'despachos/itemD01_g1'), central({ nombre: 'Ana' })));
    await assertFails(setDoc(doc(profe(), 'despachos/itemD01_g1'), central({ grupo: 'g2' })));
    await assertFails(setDoc(doc(profe(), 'despachos/itemD01_g1'), central({ asign: 'e1' })));
    await assertFails(setDoc(doc(profe(), 'despachos/itemD01_g1'), central({ fecha: ts(1) })));
  });
});

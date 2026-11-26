// Una clase = un código (PIP-11): lo que hace «Unir grupos», «Añadir asignatura» y «Alta/baja» con las reglas
// actuales (SIN cambios de reglas). Y lo que las reglas NO dejan (copiar entregas o PIN de alumnos), que es por lo que
// la unión no copia datos de alumnos. Ejecutar:  npm run test:reglas   (desde tools/firebase)
import { test, before, after, beforeEach, describe } from 'node:test';
import { readFileSync } from 'node:fs';
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { setLogLevel, doc, getDoc, setDoc, updateDoc, deleteDoc, writeBatch, serverTimestamp, Timestamp } from 'firebase/firestore';

const PROFE = 'profe@test.es';
let env;
const anon = (uid) => env.authenticatedContext(uid, { firebase: { sign_in_provider: 'anonymous' } }).firestore();
const profe = () => env.authenticatedContext('profe-uid', { email: PROFE, email_verified: true, firebase: { sign_in_provider: 'google.com' } }).firestore();
const H7 = '7'.repeat(64);
const ts = (ms) => Timestamp.fromMillis(ms);
async function sembrar(fn) { await env.withSecurityRulesDisabled(async (ctx) => fn(ctx.firestore())); }
const sesion = (grupo, codigo, numero, o = {}) => ({ codigo, grupo, numero, pagina: 'x', desde: ts(Date.now() - 60000), latido: ts(Date.now() - 60000), revocada: false, pin: H7, ...o });
const ITEM = { curso: 'c2627', asig: 'proy2', tipo: 'tarea', titulo: 'Tarea de Proyecto', texto: '', enlaces: [], grupos: ['gP'], visible: ['gP'], publicado: true };

before(async () => {
  setLogLevel('silent');
  const [host, port] = (process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8080').split(':');
  env = await initializeTestEnvironment({ projectId: 'demo-portal', firestore: { rules: readFileSync(new URL('../firestore.rules.desplegar', import.meta.url), 'utf8'), host, port: +port } });
});
after(async () => { await env?.cleanup(); });
beforeEach(async () => {
  await env.clearFirestore();
  await sembrar(async (db) => {
    await setDoc(doc(db, 'grupos/gE'), { nombre: '2º CFGB', asignaturas: ['eee'], apartados: ['circuitos'], codigo: 'FARO-472', activo: true, horario: null, creado: 1 });
    await setDoc(doc(db, 'codigos/FARO-472'), { grupo: 'gE', nombre: '2º CFGB', asignaturas: ['eee'], apartados: ['circuitos'], activo: true, horario: null });
    await setDoc(doc(db, 'grupos/gP'), { nombre: '2º CFGB Proyecto', asignaturas: ['proy2'], apartados: [], codigo: 'LUNA-518', activo: true, horario: null, creado: 1 });
    await setDoc(doc(db, 'codigos/LUNA-518'), { grupo: 'gP', nombre: '2º CFGB Proyecto', asignaturas: ['proy2'], apartados: [], activo: true, horario: null });
    await setDoc(doc(db, 'sesiones/a7'), sesion('gE', 'FARO-472', 7));
    await setDoc(doc(db, 'pines/gE_7'), { h: H7, creado: 1 });
    await setDoc(doc(db, 'items/itemP01'), ITEM);
  });
});

describe('clase · unir grupos con las reglas actuales', () => {
  test('el profesor añade la clase principal a la tarea (visible == grupos) y el alumno de la principal la lee', async () => {
    await assertFails(getDoc(doc(anon('a7'), 'items/itemP01')), 'antes no la ve');
    await assertSucceeds(updateDoc(doc(profe(), 'items/itemP01'), { grupos: ['gP', 'gE'], visible: ['gP', 'gE'], actualizado: 1 }));
    await assertSucceeds(getDoc(doc(anon('a7'), 'items/itemP01')));
  });
  test('visible distinto de grupos en una tarea publicada: no se acepta (por eso se cambian juntos)', async () => {
    await assertFails(updateDoc(doc(profe(), 'items/itemP01'), { grupos: ['gP', 'gE'], visible: ['gP'] }));
  });
  test('marca de la unión en apartados del duplicado, cierre del duplicado y Proyecto en la principal (grupo y código)', async () => {
    const db = profe(); const b = writeBatch(db);
    b.update(doc(db, 'grupos/gE'), { asignaturas: ['eee', 'proy2'] }); b.update(doc(db, 'codigos/FARO-472'), { asignaturas: ['eee', 'proy2'] });
    b.update(doc(db, 'grupos/gP'), { activo: false, apartados: ['union:gE:proy2'] }); b.update(doc(db, 'codigos/LUNA-518'), { activo: false });
    await assertSucceeds(b.commit());
  });
  test('copiar la centralita del despacho al grupo principal', async () => {
    await assertSucceeds(setDoc(doc(profe(), 'despachos/itemP01_gE'), { item: 'itemP01', grupo: 'gE', asign: { 7: 'e1' }, llamadas: [], fecha: serverTimestamp() }));
  });
  test('NO se pueden copiar entregas ni PIN de alumnos (el profesor no los crea): la unión no los toca', async () => {
    await assertFails(setDoc(doc(profe(), 'trabajos/itemP01_gE_7'), { item: 'itemP01', curso: 'c2627', asig: 'proy2', al: 'gE_7', grupo: 'gE', numero: 7, uid: 'a7', tipo: 'tarea', texto: 'x', enlaces: [], fecha: serverTimestamp(), estado: 'entregado' }));
    await assertFails(setDoc(doc(profe(), 'pines/gE_8'), { h: H7, creado: serverTimestamp() }));
  });
});

describe('clase · alta y baja por nº de lista (bloqueos)', () => {
  test('dar de baja: el profesor crea bloqueos/{grupo_nº}; dar de alta: lo borra. El PIN no se toca', async () => {
    await assertSucceeds(setDoc(doc(profe(), 'bloqueos/gE_7'), { desde: serverTimestamp() }));
    await assertFails(getDoc(doc(anon('a7'), 'items/itemP01')), 'de baja no lee nada');
    await assertSucceeds(deleteDoc(doc(profe(), 'bloqueos/gE_7')));
    await assertSucceeds(getDoc(doc(profe(), 'pines/gE_7')));
  });
  test('un alumno no puede darse de alta a sí mismo', async () => {
    await sembrar((db) => setDoc(doc(db, 'bloqueos/gE_7'), { desde: 1 }));
    await assertFails(deleteDoc(doc(anon('a7'), 'bloqueos/gE_7')));
  });
});

describe('clase · alta y baja por asignatura (matrícula, parte C: marca «baja:» en apartados, sin reglas nuevas)', () => {
  test('el profesor pone y quita «baja:proy2:7» en grupo y código a la vez, y lo demás no se toca', async () => {
    const db = profe(); const ap = ['circuitos', 'baja:proy2:7'];
    const b = writeBatch(db); b.update(doc(db, 'grupos/gE'), { apartados: ap }); b.update(doc(db, 'codigos/FARO-472'), { apartados: ap }); await assertSucceeds(b.commit());
    const b2 = writeBatch(db); b2.update(doc(db, 'grupos/gE'), { apartados: ['circuitos'] }); b2.update(doc(db, 'codigos/FARO-472'), { apartados: ['circuitos'] }); await assertSucceeds(b2.commit());
  });
  test('el alumno de baja en una asignatura sigue leyendo su código (para saber de qué asignaturas está de baja)', async () => {
    await sembrar((db) => updateDoc(doc(db, 'codigos/FARO-472'), { apartados: ['circuitos', 'baja:eee:7'] }));
    await assertSucceeds(getDoc(doc(anon('a7'), 'codigos/FARO-472')));
  });
  test('un alumno no puede cambiar la matrícula (ni la suya)', async () => {
    await assertFails(updateDoc(doc(anon('a7'), 'codigos/FARO-472'), { apartados: ['circuitos', 'baja:eee:7'] }));
    await assertFails(updateDoc(doc(anon('a7'), 'grupos/gE'), { apartados: [] }));
  });
  test('la baja en una asignatura no cierra el acceso: no hay bloqueo y sus entregas y notas siguen siendo suyas', async () => {
    await sembrar(async (db) => {
      await updateDoc(doc(db, 'codigos/FARO-472'), { apartados: ['circuitos', 'baja:eee:7'] });
      await setDoc(doc(db, 'notas/n1'), { item: 'itemP01', curso: 'c2627', asig: 'proy2', al: 'gE_7', grupo: 'gE', numero: 7, nota: 7, puntos: 7, max: 10, publicada: true });
    });
    await assertSucceeds(getDoc(doc(anon('a7'), 'notas/n1')));
  });
});

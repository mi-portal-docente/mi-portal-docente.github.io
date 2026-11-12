// Pruebas de las reglas de Firestore con el emulador (@firebase/rules-unit-testing).
// Ejecutar:  npm run test:reglas   (desde tools/firebase)
import { test, before, after, beforeEach, describe } from 'node:test';
import { readFileSync } from 'node:fs';
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { setLogLevel, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, collection, query, where, serverTimestamp, Timestamp, writeBatch } from 'firebase/firestore';

const PROFE = 'profe@test.es';
let env;
const anon = (uid) => env.authenticatedContext(uid, { firebase: { sign_in_provider: 'anonymous' } }).firestore();
const google = (uid, email, verified = true) => env.authenticatedContext(uid, { email, email_verified: verified, firebase: { sign_in_provider: 'google.com' } }).firestore();
const profe = () => google('profe-uid', PROFE);
const nadie = () => env.unauthenticatedContext().firestore();

const GRUPO = { nombre: '1ºA', asignaturas: ['eee'], apartados: ['esp32', 'circuitos'], codigo: 'FARO-472', activo: true, horario: null, creado: 1 };
const COD = { grupo: 'g1', nombre: '1ºA', asignaturas: ['eee'], apartados: ['esp32', 'circuitos'], activo: true, horario: null };
const PIN_H = 'a'.repeat(64);
const sesion = (o = {}) => ({ codigo: 'FARO-472', grupo: 'g1', numero: 7, pagina: 'Portada', desde: serverTimestamp(), latido: serverTimestamp(), revocada: false, pin: PIN_H, ...o });
const entrega = (uid, o = {}) => ({ uid, codigo: 'FARO-472', grupo: 'g1', numero: 7, practica: 'c4', tipo: 'circuitos', titulo: 'Práctica 4', fecha: serverTimestamp(), datos: { montaje: '{"parts":[],"wires":[]}', respuestas: { 0: '2.5' }, comprobacion: { ok: true, items: [] }, aciertos: '1/2' }, nota: null, comentario: '', ...o });

async function sembrar(fn) { await env.withSecurityRulesDisabled(async (ctx) => fn(ctx.firestore())); }
async function base() {
  await sembrar(async (db) => {
    await setDoc(doc(db, 'grupos/g1'), GRUPO);
    await setDoc(doc(db, 'codigos/FARO-472'), COD);
    await setDoc(doc(db, 'grupos/g2'), { ...GRUPO, nombre: '2ºB', codigo: 'LUNA-118' });
    await setDoc(doc(db, 'codigos/LUNA-118'), { ...COD, grupo: 'g2', nombre: '2ºB' });
  });
}
// sesión creada «a mano» con una hora de latido antigua (para poder enviar latidos ya)
async function sesionSembrada(uid, o = {}) {
  const viejo = Timestamp.fromMillis(Date.now() - 60000);
  await sembrar((db) => setDoc(doc(db, 'sesiones', uid), { ...sesion(o), desde: viejo, latido: viejo }));
}

before(async () => {
  setLogLevel('silent');
  const [host, port] = (process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8080').split(':');
  env = await initializeTestEnvironment({ projectId: 'demo-portal', firestore: { rules: readFileSync(new URL('../firestore.rules.desplegar', import.meta.url), 'utf8'), host, port: +port } });
});
after(async () => { await env?.cleanup(); });
beforeEach(async () => { await env.clearFirestore(); await base(); });

describe('Profesor', () => {
  test('el profesor (Google, verificado) gestiona grupos y códigos', async () => {
    const db = profe();
    await assertSucceeds(getDocs(collection(db, 'grupos')));
    await assertSucceeds(getDocs(collection(db, 'codigos')));
    await assertSucceeds(setDoc(doc(db, 'grupos/g3'), { ...GRUPO, nombre: '1ºB', codigo: 'ROCA-901' }));
    await assertSucceeds(setDoc(doc(db, 'codigos/ROCA-901'), { ...COD, grupo: 'g3', nombre: '1ºB' }));
    await assertSucceeds(getDoc(doc(db, 'config/profesores')));
  });
  test('reiniciar código (batch: borrar viejo + crear nuevo + actualizar grupo)', async () => {
    const db = profe(); const b = writeBatch(db);
    b.delete(doc(db, 'codigos/FARO-472')); b.set(doc(db, 'codigos/NUBE-333'), COD); b.update(doc(db, 'grupos/g1'), { codigo: 'NUBE-333' });
    await assertSucceeds(b.commit());
  });
  test('profesor con horario válido', async () => {
    await assertSucceeds(updateDoc(doc(profe(), 'grupos/g1'), { horario: { dias: [1, 2, 3, 4, 5], desde: 480, hasta: 870, offset: 60 } }));
    await assertFails(updateDoc(doc(profe(), 'grupos/g1'), { horario: { dias: [1], desde: 900, hasta: 100, offset: 60 } }));
  });
  test('código con formato no válido → rechazado', async () => {
    await assertFails(setDoc(doc(profe(), 'codigos/abc'), COD));
  });
  test('profesor adicional listado en config/profesores', async () => {
    await sembrar((db) => setDoc(doc(db, 'config/profesores'), { emails: ['otra@test.es'] }));
    await assertSucceeds(getDocs(collection(google('u2', 'otra@test.es'), 'grupos')));
    // pero solo el propietario puede cambiar esa lista
    await assertFails(setDoc(doc(google('u2', 'otra@test.es'), 'config/profesores'), { emails: ['otra@test.es', 'x@test.es'] }));
    await assertSucceeds(setDoc(doc(profe(), 'config/profesores'), { emails: ['otra@test.es', 'x@test.es'] }));
  });
});

describe('Ataques: profesor falso', () => {
  test('Google con otro correo → no es profesor', async () => {
    const db = google('falso', 'alumno@gmail.com');
    await assertFails(getDocs(collection(db, 'grupos')));
    await assertFails(getDoc(doc(db, 'config/profesores')));
    await assertFails(setDoc(doc(db, 'grupos/gx'), GRUPO));
  });
  test('correo del profesor pero SIN verificar → no es profesor', async () => {
    await assertFails(getDocs(collection(google('falso', PROFE, false), 'grupos')));
  });
  test('correo del profesor con proveedor correo/contraseña → no es profesor', async () => {
    const db = env.authenticatedContext('falso', { email: PROFE, email_verified: true, firebase: { sign_in_provider: 'password' } }).firestore();
    await assertFails(getDocs(collection(db, 'grupos')));
  });
  test('anónimo con email inventado en el token → no es profesor', async () => {
    const db = env.authenticatedContext('falso', { email: PROFE, email_verified: true, firebase: { sign_in_provider: 'anonymous' } }).firestore();
    await assertFails(getDocs(collection(db, 'entregas')));
  });
  test('Google con otro correo no puede añadirse a config/profesores', async () => {
    await assertFails(setDoc(doc(google('falso', 'malo@gmail.com'), 'config/profesores'), { emails: ['malo@gmail.com'] }));
  });
  test('sin iniciar sesión no se puede leer nada', async () => {
    await assertFails(getDoc(doc(nadie(), 'codigos/FARO-472')));
    await assertFails(getDocs(collection(nadie(), 'entregas')));
  });
});

describe('Códigos (anónimo)', () => {
  test('anónimo puede leer UN código si lo conoce', async () => {
    await assertSucceeds(getDoc(doc(anon('a1'), 'codigos/FARO-472')));
    await assertSucceeds(getDoc(doc(anon('a1'), 'codigos/NOEX-000'))); // no existe → vacío, sin datos
  });
  test('ataque: anónimo LISTANDO códigos → denegado', async () => {
    await assertFails(getDocs(collection(anon('a1'), 'codigos')));
    await assertFails(getDocs(query(collection(anon('a1'), 'codigos'), where('activo', '==', true))));
  });
  test('ataque: anónimo creando/modificando códigos o grupos → denegado', async () => {
    await assertFails(setDoc(doc(anon('a1'), 'codigos/HACK-111'), COD));
    await assertFails(updateDoc(doc(anon('a1'), 'codigos/FARO-472'), { activo: true }));
    await assertFails(getDoc(doc(anon('a1'), 'grupos/g1')));
  });
});

describe('Sesiones', () => {
  test('alumno entra con código vigente y nº de lista', async () => {
    await assertSucceeds(setDoc(doc(anon('a1'), 'sesiones/a1'), sesion()));
    await assertSucceeds(getDoc(doc(anon('a1'), 'sesiones/a1')));
  });
  test('código inexistente → no puede crear sesión', async () => {
    await assertFails(setDoc(doc(anon('a1'), 'sesiones/a1'), sesion({ codigo: 'MALO-000' })));
  });
  test('código de OTRO grupo (grupo no coincide) → denegado', async () => {
    await assertFails(setDoc(doc(anon('a1'), 'sesiones/a1'), sesion({ grupo: 'g2' })));
  });
  test('código inactivo → no puede entrar', async () => {
    await sembrar((db) => updateDoc(doc(db, 'codigos/FARO-472'), { activo: false }));
    await assertFails(setDoc(doc(anon('a1'), 'sesiones/a1'), sesion()));
  });
  test('fuera de horario → no puede entrar; dentro → sí', async () => {
    await sembrar((db) => updateDoc(doc(db, 'codigos/FARO-472'), { horario: { dias: [1, 2, 3, 4, 5, 6, 7], desde: 0, hasta: 1, offset: 0 } }));
    const ahora = new Date(); const m = ahora.getUTCHours() * 60 + ahora.getUTCMinutes();
    if (m > 1) await assertFails(setDoc(doc(anon('a1'), 'sesiones/a1'), sesion()));
    await sembrar((db) => updateDoc(doc(db, 'codigos/FARO-472'), { horario: { dias: [1, 2, 3, 4, 5, 6, 7], desde: 0, hasta: 1440, offset: 0 } }));
    await assertSucceeds(setDoc(doc(anon('a1'), 'sesiones/a1'), sesion()));
  });
  test('PIN: sin hash o con formato malo → denegado; nº con PIN registrado exige el mismo hash', async () => {
    const { pin, ...sinPin } = sesion();
    await assertFails(setDoc(doc(anon('a1'), 'sesiones/a1'), sinPin));
    await assertFails(setDoc(doc(anon('a1'), 'sesiones/a1'), sesion({ pin: '1234' })));
    await sembrar((db) => setDoc(doc(db, 'pines/g1_7'), { h: 'b'.repeat(64), creado: 1 }));
    await assertFails(setDoc(doc(anon('a1'), 'sesiones/a1'), sesion()));
    await assertSucceeds(setDoc(doc(anon('a1'), 'sesiones/a1'), sesion({ pin: 'b'.repeat(64) })));
  });
  test('número de lista fuera de 1-40 o no entero → denegado', async () => {
    await assertFails(setDoc(doc(anon('a1'), 'sesiones/a1'), sesion({ numero: 0 })));
    await assertFails(setDoc(doc(anon('a1'), 'sesiones/a1'), sesion({ numero: 41 })));
    await assertFails(setDoc(doc(anon('a1'), 'sesiones/a1'), sesion({ numero: '7' })));
  });
  test('ataque: alumno se escribe rol profesor / campos extra (nombre) → denegado', async () => {
    await assertFails(setDoc(doc(anon('a1'), 'sesiones/a1'), sesion({ rol: 'profesor' })));
    await assertFails(setDoc(doc(anon('a1'), 'sesiones/a1'), sesion({ nombre: 'Ana García' })));
    await sesionSembrada('a1');
    await assertFails(updateDoc(doc(anon('a1'), 'sesiones/a1'), { rol: 'profesor' }));
    await assertFails(setDoc(doc(anon('a1'), 'config/profesores'), { emails: ['a1'] }));
  });
  test('ataque: alumno crea sesión para otro uid → denegado', async () => {
    await assertFails(setDoc(doc(anon('a1'), 'sesiones/a2'), sesion()));
  });
  test('ataque: alumno se cambia de grupo / número / código / se des-revoca → denegado', async () => {
    await sesionSembrada('a1');
    await assertFails(updateDoc(doc(anon('a1'), 'sesiones/a1'), { numero: 8 }));
    await assertFails(updateDoc(doc(anon('a1'), 'sesiones/a1'), { grupo: 'g2', codigo: 'LUNA-118' }));
    await sembrar((db) => updateDoc(doc(db, 'sesiones/a1'), { revocada: true }));
    await assertFails(updateDoc(doc(anon('a1'), 'sesiones/a1'), { revocada: false }));
  });
  test('latido válido (hora del servidor) y latido con hora falsa → denegado', async () => {
    await sesionSembrada('a1');
    await assertFails(updateDoc(doc(anon('a1'), 'sesiones/a1'), { latido: Timestamp.fromMillis(Date.now() + 3600e3) }));
    await assertSucceeds(updateDoc(doc(anon('a1'), 'sesiones/a1'), { latido: serverTimestamp(), pagina: 'Circuitos · práctica 2' }));
  });
  test('latidos demasiado seguidos (<5 s) → denegado', async () => {
    await assertSucceeds(setDoc(doc(anon('a1'), 'sesiones/a1'), sesion()));
    await assertFails(updateDoc(doc(anon('a1'), 'sesiones/a1'), { latido: serverTimestamp() }));
  });
  test('sesión revocada (expulsado) → no puede enviar latidos ni borrarse', async () => {
    await sesionSembrada('a1', { revocada: true });
    await assertFails(updateDoc(doc(anon('a1'), 'sesiones/a1'), { latido: serverTimestamp() }));
    await assertFails(deleteDoc(doc(anon('a1'), 'sesiones/a1')));
  });
  test('código reiniciado (doc borrado) → latido denegado', async () => {
    await sesionSembrada('a1');
    await sembrar((db) => deleteDoc(doc(db, 'codigos/FARO-472')));
    await assertFails(updateDoc(doc(anon('a1'), 'sesiones/a1'), { latido: serverTimestamp() }));
  });
  test('alumno no puede leer ni listar sesiones de otros', async () => {
    await sesionSembrada('a2', { numero: 9 });
    await assertFails(getDoc(doc(anon('a1'), 'sesiones/a2')));
    await assertFails(getDocs(collection(anon('a1'), 'sesiones')));
  });
  test('profesor lista sesiones y expulsa (solo revocada=true)', async () => {
    await sesionSembrada('a1');
    await assertSucceeds(getDocs(collection(profe(), 'sesiones')));
    await assertFails(updateDoc(doc(profe(), 'sesiones/a1'), { numero: 3 }));
    await assertSucceeds(updateDoc(doc(profe(), 'sesiones/a1'), { revocada: true }));
    await assertSucceeds(deleteDoc(doc(profe(), 'sesiones/a1')));
  });
  test('alumno sale (borra su sesión no revocada)', async () => {
    await sesionSembrada('a1');
    await assertSucceeds(deleteDoc(doc(anon('a1'), 'sesiones/a1')));
  });
});

describe('Entregas', () => {
  test('alumno con sesión válida entrega y re-entrega; ve la suya', async () => {
    await sesionSembrada('a1');
    const db = anon('a1');
    await assertSucceeds(setDoc(doc(db, 'entregas/a1_g1_7_c4'), entrega('a1')));
    await assertSucceeds(setDoc(doc(db, 'entregas/a1_g1_7_c4'), entrega('a1')));
    await assertSucceeds(getDoc(doc(db, 'entregas/a1_g1_7_c4')));
    await assertSucceeds(getDocs(query(collection(db, 'entregas'), where('uid', '==', 'a1'))));
  });
  test('ESP32: marcar proyecto como hecho con informe', async () => {
    await sesionSembrada('a1');
    await assertSucceeds(setDoc(doc(anon('a1'), 'entregas/a1_g1_7_p3'), entrega('a1', { practica: 'p3', tipo: 'esp32', titulo: 'Proyecto 3', datos: { hecho: true, informe: { mediciones: '3,3 V', problemas: '', conclusiones: 'ok' } } })));
  });
  test('ataque: alumno lee entregas AJENAS (get y consulta sin filtro) → denegado', async () => {
    await sesionSembrada('a2', { numero: 9 });
    await sembrar((db) => setDoc(doc(db, 'entregas/a2_g1_9_c4'), { ...entrega('a2', { numero: 9 }), fecha: 1 }));
    await sesionSembrada('a1');
    await assertFails(getDoc(doc(anon('a1'), 'entregas/a2_g1_9_c4')));
    await assertFails(getDocs(collection(anon('a1'), 'entregas')));
    await assertFails(getDocs(query(collection(anon('a1'), 'entregas'), where('grupo', '==', 'g1'))));
    await assertFails(getDocs(query(collection(anon('a1'), 'entregas'), where('uid', '==', 'a2'))));
  });
  test('ataque: entregar en nombre de otro nº / grupo / uid → denegado', async () => {
    await sesionSembrada('a1');
    const db = anon('a1');
    await assertFails(setDoc(doc(db, 'entregas/a1_g1_7_c4'), entrega('a1', { numero: 8 })));
    await assertFails(setDoc(doc(db, 'entregas/a1_g1_7_c4'), entrega('a1', { grupo: 'g2', codigo: 'LUNA-118' })));
    await assertFails(setDoc(doc(db, 'entregas/a2_g1_7_c4'), entrega('a2')));
    await assertFails(setDoc(doc(db, 'entregas/a1_g1_8_c4'), entrega('a1', { numero: 8 })));
    await assertFails(setDoc(doc(db, 'entregas/a1_g1_7_c5'), entrega('a1'))); // id no coincide con la práctica
  });
  test('ataque: alumno se pone nota / comentario → denegado', async () => {
    await sesionSembrada('a1');
    await assertFails(setDoc(doc(anon('a1'), 'entregas/a1_g1_7_c4'), entrega('a1', { nota: 10 })));
    await assertFails(setDoc(doc(anon('a1'), 'entregas/a1_g1_7_c4'), entrega('a1', { comentario: 'Excelente' })));
  });
  test('sin sesión / sesión revocada / código inactivo / código reiniciado → no puede entregar', async () => {
    await assertFails(setDoc(doc(anon('a1'), 'entregas/a1_g1_7_c4'), entrega('a1')));
    await sesionSembrada('a1', { revocada: true });
    await assertFails(setDoc(doc(anon('a1'), 'entregas/a1_g1_7_c4'), entrega('a1')));
    await sesionSembrada('a1');
    await sembrar((db) => updateDoc(doc(db, 'codigos/FARO-472'), { activo: false }));
    await assertFails(setDoc(doc(anon('a1'), 'entregas/a1_g1_7_c4'), entrega('a1')));
    await sembrar((db) => deleteDoc(doc(db, 'codigos/FARO-472')));
    await assertFails(setDoc(doc(anon('a1'), 'entregas/a1_g1_7_c4'), entrega('a1')));
  });
  test('profesor lista, califica (solo nota/comentario) y borra; alumno ya no puede re-entregar', async () => {
    await sesionSembrada('a1');
    await assertSucceeds(setDoc(doc(anon('a1'), 'entregas/a1_g1_7_c4'), entrega('a1')));
    const db = profe();
    await assertSucceeds(getDocs(collection(db, 'entregas')));
    await assertFails(updateDoc(doc(db, 'entregas/a1_g1_7_c4'), { numero: 3 }));
    await assertFails(updateDoc(doc(db, 'entregas/a1_g1_7_c4'), { nota: 11 }));
    await assertSucceeds(updateDoc(doc(db, 'entregas/a1_g1_7_c4'), { nota: 8.5, comentario: 'Bien montado', notaFecha: serverTimestamp() }));
    await assertSucceeds(getDoc(doc(anon('a1'), 'entregas/a1_g1_7_c4')));
    await assertFails(setDoc(doc(anon('a1'), 'entregas/a1_g1_7_c4'), entrega('a1')));
    await assertSucceeds(deleteDoc(doc(db, 'entregas/a1_g1_7_c4')));
  });
  test('alumno no puede borrar entregas', async () => {
    await sesionSembrada('a1');
    await assertSucceeds(setDoc(doc(anon('a1'), 'entregas/a1_g1_7_c4'), entrega('a1')));
    await assertFails(deleteDoc(doc(anon('a1'), 'entregas/a1_g1_7_c4')));
  });
  test('montaje demasiado grande → denegado', async () => {
    await sesionSembrada('a1');
    await assertFails(setDoc(doc(anon('a1'), 'entregas/a1_g1_7_c4'), entrega('a1', { datos: { montaje: 'x'.repeat(200001) } })));
  });
});

describe('Rutas no previstas', () => {
  test('cualquier otra colección → denegada incluso al profesor', async () => {
    await assertFails(setDoc(doc(profe(), 'otra/x'), { a: 1 }));
    await assertFails(setDoc(doc(anon('a1'), 'otra/x'), { a: 1 }));
  });
});

describe('Entregas del laboratorio de vivienda', () => {
  const viv = (o = {}) => entrega('a1', { practica: 'v1', tipo: 'vivienda', titulo: 'Vivienda · Tablero eléctrico de la SA1', datos: { montaje: '{"parts":[]}', comprobacion: { ok: true, items: [] }, aciertos: '12/12', materiales: '{"total":88.09,"filas":[]}' }, ...o });
  test('el alumno entrega el tablero (v1) con su lista de materiales', async () => {
    await sesionSembrada('a1');
    await assertSucceeds(setDoc(doc(anon('a1'), 'entregas/a1_g1_7_v1'), viv()));
    await assertSucceeds(getDoc(doc(anon('a1'), 'entregas/a1_g1_7_v1')));
  });
  test('ataque: práctica no prevista, campo extra en datos o materiales enormes → denegado', async () => {
    await sesionSembrada('a1');
    await assertFails(setDoc(doc(anon('a1'), 'entregas/a1_g1_7_x1'), viv({ practica: 'x1' })));
    await assertFails(setDoc(doc(anon('a1'), 'entregas/a1_g1_7_v1'), viv({ datos: { montaje: '{}', nombre: 'Ana' } })));
    await assertFails(setDoc(doc(anon('a1'), 'entregas/a1_g1_7_v1'), viv({ datos: { materiales: 'x'.repeat(20001) } })));
    await assertFails(setDoc(doc(anon('a1'), 'entregas/a1_g1_7_v1'), viv({ tipo: 'otro' })));
  });
});

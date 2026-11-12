// Pruebas de las reglas del AULA VIRTUAL (cursos, items, exámenes, claves, trabajos, notas, PIN).
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

describe('PIN del alumno', () => {
  test('nº nuevo: crea sesión y registra su PIN; después solo entra con el mismo PIN', async () => {
    await sembrar((db) => deleteDoc(doc(db, 'pines/g1_7')));
    const db = anon('n1');
    await assertSucceeds(setDoc(doc(db, 'sesiones/n1'), { ...sesion(7, H7), desde: serverTimestamp(), latido: serverTimestamp() }));
    await assertFails(getDoc(doc(db, 'pines/g1_7'))); // todavía no existe
    await assertSucceeds(setDoc(doc(db, 'pines/g1_7'), { h: H7, creado: serverTimestamp() }));
    await assertSucceeds(getDoc(doc(db, 'pines/g1_7'))); // ahora coincide
    await assertFails(setDoc(doc(anon('n2'), 'sesiones/n2'), { ...sesion(7, HX), desde: serverTimestamp(), latido: serverTimestamp() }));
  });
  test('ataque: registrar el PIN de OTRO nº, o un hash distinto al de la sesión, o cambiarlo → denegado', async () => {
    await sembrar((db) => deleteDoc(doc(db, 'pines/g1_7')));
    await assertFails(setDoc(doc(anon('a9'), 'pines/g1_7'), { h: H9, creado: serverTimestamp() }));
    await assertFails(setDoc(doc(anon('a7'), 'pines/g1_7'), { h: HX, creado: serverTimestamp() }));
    await assertFails(setDoc(doc(anon('a9'), 'pines/g1_9'), { h: HX, creado: serverTimestamp() }));
  });
  test('ataque: leer o listar PINs ajenos → denegado; el profesor puede reiniciar (borrar)', async () => {
    await assertFails(getDoc(doc(anon('a7'), 'pines/g1_9')));
    await assertFails(getDocs(collection(anon('a7'), 'pines')));
    await assertSucceeds(deleteDoc(doc(profe(), 'pines/g1_9')));
    await assertFails(deleteDoc(doc(anon('a7'), 'pines/g1_7')));
  });
});

describe('Cursos escolares', () => {
  test('solo el profesor crea y lee cursos', async () => {
    const c = { nombre: '2026/27', asignaturas: ['eee', 'tic1'], activo: true, pesos: { eee: { examenes: 40 } }, creado: 1 };
    await assertSucceeds(setDoc(doc(profe(), 'cursos/c2627'), c));
    await assertFails(setDoc(doc(profe(), 'cursos/c2627'), { ...c, raro: 1 }));
    await assertFails(getDoc(doc(anon('a7'), 'cursos/c2627')));
    await assertFails(setDoc(doc(anon('a7'), 'cursos/x'), c));
  });
  test('grupos con curso y nº de alumnos', async () => {
    await assertSucceeds(updateDoc(doc(profe(), 'grupos/g1'), { curso: 'c2627', alumnos: 24 }));
    await assertFails(updateDoc(doc(profe(), 'grupos/g1'), { alumnos: 99 }));
  });
});

describe('Items (contenido)', () => {
  test('alumno lista los items publicados de su grupo (consulta por «visible»)', async () => {
    const qs = await assertSucceeds(getDocs(query(collection(anon('a7'), 'items'), where('visible', 'array-contains', 'g1'))));
    const ids = qs.docs.map(d => d.id).sort();
    if (ids.join() !== 'itemE01,itemT01') throw new Error('ids: ' + ids);
    await assertSucceeds(getDoc(doc(anon('a7'), 'items/itemT01')));
  });
  test('ataque: alumno lee borradores, items de otro grupo, o lista sin filtro → denegado', async () => {
    await assertFails(getDoc(doc(anon('a7'), 'items/itemB01')));
    await assertFails(getDocs(collection(anon('a7'), 'items')));
    await assertFails(getDocs(query(collection(anon('a7'), 'items'), where('visible', 'array-contains', 'g2'))));
    await assertFails(getDoc(doc(anon('b5'), 'items/itemT01')));
  });
  test('alumno sin PIN registrado → no ve el aula', async () => {
    await sembrar((db) => deleteDoc(doc(db, 'pines/g1_7')));
    await assertFails(getDocs(query(collection(anon('a7'), 'items'), where('visible', 'array-contains', 'g1'))));
  });
  test('profesor crea/publica; «visible» tiene que cuadrar con «publicado»', async () => {
    const db = profe();
    await assertSucceeds(setDoc(doc(db, 'items/itemN01'), { ...ITEM_T, publicado: false, visible: [] }));
    await assertSucceeds(updateDoc(doc(db, 'items/itemN01'), { publicado: true, visible: ['g1'] }));
    await assertFails(updateDoc(doc(db, 'items/itemN01'), { publicado: false }));
    await assertFails(setDoc(doc(db, 'items/itemN02'), { ...ITEM_T, tipo: 'raro' }));
    await assertFails(setDoc(doc(anon('a7'), 'items/itemN03'), ITEM_T));
  });
});

describe('Exámenes y claves', () => {
  test('alumno lee las preguntas solo dentro de la ventana', async () => {
    await assertSucceeds(getDoc(doc(anon('a7'), 'examenes/itemE01')));
    await sembrar((db) => setDoc(doc(db, 'examenes/itemE01'), EXAMEN({ desde: ts(ahora() + 3600e3), hasta: ts(ahora() + 7200e3) })));
    await assertFails(getDoc(doc(anon('a7'), 'examenes/itemE01')));
    await sembrar((db) => setDoc(doc(db, 'examenes/itemE01'), EXAMEN({ desde: ts(ahora() - 7200e3), hasta: ts(ahora() - 3600e3) })));
    await assertFails(getDoc(doc(anon('a7'), 'examenes/itemE01')));
  });
  test('ataque: otro grupo / sin publicar → no lee las preguntas', async () => {
    await assertFails(getDoc(doc(anon('b5'), 'examenes/itemE01')));
    await sembrar((db) => setDoc(doc(db, 'examenes/itemE01'), EXAMEN({ publicado: false })));
    await assertFails(getDoc(doc(anon('a7'), 'examenes/itemE01')));
  });
  test('ataque: las respuestas correctas NUNCA son legibles por un alumno', async () => {
    await assertFails(getDoc(doc(anon('a7'), 'claves/itemE01')));
    await assertFails(getDocs(collection(anon('a7'), 'claves')));
    await assertFails(setDoc(doc(anon('a7'), 'claves/itemE01'), { respuestas: {} }));
    await assertSucceeds(getDoc(doc(profe(), 'claves/itemE01')));
  });
  test('profesor guarda examen con ventana válida', async () => {
    await assertSucceeds(setDoc(doc(profe(), 'examenes/itemE02'), EXAMEN()));
    await assertFails(setDoc(doc(profe(), 'examenes/itemE02'), EXAMEN({ desde: ts(ahora()), hasta: ts(ahora() - 1000) })));
    await assertFails(setDoc(doc(profe(), 'examenes/itemE02'), EXAMEN({ limiteMin: 0 })));
  });
});

describe('Trabajos (entregas del aula)', () => {
  test('alumno entrega una tarea, la re-entrega y la ve; no ve las de otros', async () => {
    const db = anon('a7');
    await assertSucceeds(setDoc(doc(db, 'trabajos/itemT01_g1_7'), tarea('a7')));
    await assertSucceeds(setDoc(doc(db, 'trabajos/itemT01_g1_7'), tarea('a7', { texto: 'v2' })));
    await assertSucceeds(getDocs(query(collection(db, 'trabajos'), where('al', '==', 'g1_7'))));
    await assertFails(getDocs(query(collection(db, 'trabajos'), where('al', '==', 'g1_9'))));
    await assertFails(getDocs(collection(db, 'trabajos')));
    await assertFails(getDoc(doc(anon('a9'), 'trabajos/itemT01_g1_7')));
  });
  test('desde OTRO navegador (otra sesión anónima) con el mismo nº + PIN ve sus trabajos', async () => {
    await assertSucceeds(setDoc(doc(anon('a7'), 'trabajos/itemT01_g1_7'), tarea('a7')));
    await sembrar((db) => setDoc(doc(db, 'sesiones/a7bis'), sesion(7, H7)));
    await assertSucceeds(getDoc(doc(anon('a7bis'), 'trabajos/itemT01_g1_7')));
  });
  test('ataque: entregar como otro nº / en item de otro grupo / borrador / campos extra → denegado', async () => {
    const db = anon('a7');
    await assertFails(setDoc(doc(db, 'trabajos/itemT01_g1_9'), tarea('a7', { al: 'g1_9', numero: 9 })));
    await assertFails(setDoc(doc(db, 'trabajos/itemB01_g1_7'), tarea('a7', { item: 'itemB01' })));
    await assertFails(setDoc(doc(db, 'trabajos/itemT01_g1_7'), tarea('a7', { nota: 10 })));
    await assertFails(setDoc(doc(db, 'trabajos/itemT01_g1_7'), tarea('a7', { nombre: 'Ana' })));
    await assertFails(setDoc(doc(anon('b5'), 'trabajos/itemT01_g2_5'), tarea('b5', { al: 'g2_5', grupo: 'g2', numero: 5 })));
  });
  test('una vez calificada no se puede re-entregar', async () => {
    await assertSucceeds(setDoc(doc(anon('a7'), 'trabajos/itemT01_g1_7'), tarea('a7')));
    await assertSucceeds(setDoc(doc(profe(), 'notas/itemT01_g1_7'), nota()));
    await assertFails(setDoc(doc(anon('a7'), 'trabajos/itemT01_g1_7'), tarea('a7', { texto: 'cambio' })));
  });
  test('examen: empezar (una vez), guardar respuestas y entregar; después no se puede tocar', async () => {
    const db = anon('a7');
    await assertSucceeds(setDoc(doc(db, 'trabajos/itemE01_g1_7'), intento('a7')));
    await assertSucceeds(updateDoc(doc(db, 'trabajos/itemE01_g1_7'), { respuestas: { q1: 0 }, fecha: serverTimestamp() }));
    await assertSucceeds(updateDoc(doc(db, 'trabajos/itemE01_g1_7'), { respuestas: { q1: 1 }, estado: 'entregado', fecha: serverTimestamp() }));
    await assertFails(updateDoc(doc(db, 'trabajos/itemE01_g1_7'), { respuestas: { q1: 0 }, fecha: serverTimestamp() }));
    await assertFails(setDoc(doc(db, 'trabajos/itemE01_g1_7'), intento('a7'))); // segundo intento
  });
  test('ataque examen: empezar fuera de la ventana, con hora falsa o con respuestas ya puestas → denegado', async () => {
    const db = anon('a7');
    await assertFails(setDoc(doc(db, 'trabajos/itemE01_g1_7'), intento('a7', { inicio: ts(ahora() + 3600e3) })));
    await assertFails(setDoc(doc(db, 'trabajos/itemE01_g1_7'), intento('a7', { respuestas: { q1: 1 } })));
    await assertFails(setDoc(doc(db, 'trabajos/itemE01_g1_7'), intento('a7', { estado: 'entregado' })));
    await sembrar((d) => setDoc(doc(d, 'examenes/itemE01'), EXAMEN({ desde: ts(ahora() - 7200e3), hasta: ts(ahora() - 3600e3) })));
    await assertFails(setDoc(doc(db, 'trabajos/itemE01_g1_7'), intento('a7')));
  });
  test('examen: pasado el tiempo límite no se aceptan respuestas', async () => {
    await sembrar((d) => setDoc(doc(d, 'trabajos/itemE01_g1_7'), { ...intento('a7'), inicio: ts(ahora() - 40 * 60e3), fecha: ts(ahora() - 40 * 60e3) }));
    await assertFails(updateDoc(doc(anon('a7'), 'trabajos/itemE01_g1_7'), { respuestas: { q1: 1 }, estado: 'entregado', fecha: serverTimestamp() }));
  });
  test('ataque examen: cambiar la hora de inicio → denegado', async () => {
    const db = anon('a7');
    await assertSucceeds(setDoc(doc(db, 'trabajos/itemE01_g1_7'), intento('a7')));
    await assertFails(updateDoc(doc(db, 'trabajos/itemE01_g1_7'), { inicio: ts(ahora() + 600e3), fecha: serverTimestamp() }));
  });
  test('alumno no borra trabajos; el profesor sí', async () => {
    await assertSucceeds(setDoc(doc(anon('a7'), 'trabajos/itemT01_g1_7'), tarea('a7')));
    await assertFails(deleteDoc(doc(anon('a7'), 'trabajos/itemT01_g1_7')));
    await assertSucceeds(deleteDoc(doc(profe(), 'trabajos/itemT01_g1_7')));
  });
});

describe('Notas', () => {
  test('el alumno solo ve sus notas PUBLICADAS', async () => {
    await sembrar((db) => setDoc(doc(db, 'notas/itemT01_g1_7'), nota()));
    const db = anon('a7');
    await assertFails(getDoc(doc(db, 'notas/itemT01_g1_7')));
    await assertSucceeds(getDocs(query(collection(db, 'notas'), where('al', '==', 'g1_7'), where('publicada', '==', true))));
    await assertFails(getDocs(query(collection(db, 'notas'), where('al', '==', 'g1_7'))));
    await sembrar((d) => updateDoc(doc(d, 'notas/itemT01_g1_7'), { publicada: true }));
    await assertSucceeds(getDoc(doc(db, 'notas/itemT01_g1_7')));
    await assertFails(getDoc(doc(anon('a9'), 'notas/itemT01_g1_7')));
    await assertFails(getDocs(query(collection(anon('a9'), 'notas'), where('al', '==', 'g1_7'), where('publicada', '==', true))));
  });
  test('ataque: el alumno se pone nota → denegado', async () => {
    await assertFails(setDoc(doc(anon('a7'), 'notas/itemT01_g1_7'), nota({ publicada: true })));
  });
  test('profesor: nota 0-10, id coherente con item + grupo + nº', async () => {
    const db = profe();
    await assertSucceeds(setDoc(doc(db, 'notas/itemT01_g1_7'), nota()));
    await assertFails(setDoc(doc(db, 'notas/itemT01_g1_7'), nota({ nota: 11 })));
    await assertFails(setDoc(doc(db, 'notas/itemT01_g1_8'), nota()));
    await assertFails(setDoc(doc(db, 'notas/itemT01_g1_7'), nota({ nombre: 'Ana' })));
    await assertSucceeds(getDocs(query(collection(db, 'notas'), where('grupo', '==', 'g1'))));
  });
});

describe('Trabajo de clase: temas, Tablón y campos de los items', () => {
  const TEMA = { curso: 'c2627', asig: 'eee', nombre: 'SA 1 · Instalación de vivienda', orden: 1 };
  const ANUNCIO = { curso: 'c2627', asig: 'eee', texto: 'Traed destornilladores', enlaces: [], grupos: ['g1'], visible: ['g1'], fecha: 1 };
  test('temas: solo el profesor los crea, reordena y borra; el alumno del aula los lee', async () => {
    await assertSucceeds(setDoc(doc(profe(), 'temas/tema01'), TEMA));
    await assertSucceeds(updateDoc(doc(profe(), 'temas/tema01'), { orden: 2.5 }));
    await assertFails(setDoc(doc(profe(), 'temas/tema02'), { ...TEMA, raro: 1 }));
    await assertFails(setDoc(doc(profe(), 'temas/tema03'), { ...TEMA, nombre: '' }));
    await assertFails(setDoc(doc(anon('a7'), 'temas/tema04'), TEMA));
    await assertSucceeds(getDoc(doc(anon('a7'), 'temas/tema01')));
    await assertFails(deleteDoc(doc(anon('a7'), 'temas/tema01')));
    await assertSucceeds(deleteDoc(doc(profe(), 'temas/tema01')));
  });
  test('Tablón: el profesor publica; el alumno lee solo los de su grupo', async () => {
    await assertSucceeds(setDoc(doc(profe(), 'anuncios/anun01'), ANUNCIO));
    await assertSucceeds(setDoc(doc(profe(), 'anuncios/anun02'), { ...ANUNCIO, grupos: ['g2'], visible: ['g2'] }));
    await assertFails(setDoc(doc(profe(), 'anuncios/anun03'), { ...ANUNCIO, visible: ['g2'] }));
    await assertFails(setDoc(doc(anon('a7'), 'anuncios/anun04'), ANUNCIO));
    await assertSucceeds(getDoc(doc(anon('a7'), 'anuncios/anun01')));
    await assertFails(getDoc(doc(anon('a7'), 'anuncios/anun02')));
  });
  test('items con tema, puntos, opciones, programación, «pendiente» y nota privada', async () => {
    const it = { ...ITEM_T, tipo: 'pregunta', tema: 'tema01', orden: 1.5, puntos: 10, opciones: ['Sí', 'No'], pub: null, pendiente: true, nota: 'Pendiente de completar: faltan las instrucciones', origen: 'classroom:eee:abc' };
    await assertSucceeds(setDoc(doc(profe(), 'items/itemP01'), it));
    await assertFails(setDoc(doc(profe(), 'items/itemP02'), { ...it, nota: 'x'.repeat(2001) }));
    await assertFails(setDoc(doc(profe(), 'items/itemP03'), { ...it, alumno: 'Ana' }));
    await assertFails(setDoc(doc(anon('a7'), 'items/itemP04'), it));
  });
  test('el alumno responde a una pregunta y a una tarea de cuestionario', async () => {
    await sembrar(async (db) => { await setDoc(doc(db, 'items/itemQ01'), { ...ITEM_T, tipo: 'pregunta' }); await setDoc(doc(db, 'items/itemC01'), { ...ITEM_T, tipo: 'cuestionario' }); });
    await assertSucceeds(setDoc(doc(anon('a7'), 'trabajos/itemQ01_g1_7'), tarea('a7', { item: 'itemQ01', texto: 'Sí' })));
    await assertSucceeds(setDoc(doc(anon('a7'), 'trabajos/itemC01_g1_7'), tarea('a7', { item: 'itemC01', enlaces: ['https://forms.example/x'] })));
  });
});

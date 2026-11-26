// Pruebas del «Despacho virtual» (lógica pura): importador del JSON, avisos (solape de personal y de recurso,
// perfil requerido, viaje, turnos, ventana, nº de personas), movimientos, empresa de cada alumno y guardado (doc).
import { readFileSync } from 'node:fs';
import * as D from './src/lms/despacho.js';
import './src/lms/motores/index.js';
import { validarElemento } from './src/lms/elemento.js';
let ok = 0, fallos = 0; const t = (n, c, i = '') => { if (c) { ok++; console.log('OK  ', n); } else { fallos++; console.log('FALLO', n, i); } };

// --- Importador ---
const el = JSON.parse(readFileSync(new URL('./src/lms/semilla/despacho_ejemplo.json', import.meta.url)));
const datos = JSON.parse(readFileSync(new URL('./src/lms/semilla/PIAC_SA1_T4_Despacho_datos_ejemplo.json', import.meta.url)));
let r = validarElemento(el);
t('importador: el ejemplo completo (elemento) es válido', !r.errores.length && r.el.tipo === 'despacho', JSON.stringify(r.errores));
const C = r.el.contenido;
t('importador: 4 empresas con 15 trabajos y 3 llamadas cada una', C.empresas.length === 4 && C.empresas.every((e) => e.trabajos.length === 15 && e.llamadas.length === 3));
t('importador: horario 8:00-22:00 y viaje 30 min', C.horario.ini === 480 && C.horario.fin === 1320 && C.viaje_min === 30);
t('importador: ventana y día pasan a números', C.empresas[0].trabajos[0].ventana.ini === 480 && C.empresas[0].trabajos[0].dia === 0);
r = validarElemento(datos);
t('importador: también vale pegar solo el fichero de datos', !r.errores.length && r.el.tipo === 'despacho' && r.el.contenido.empresas.length === 4, JSON.stringify(r.errores));
r = validarElemento({ tipo: 'despacho', titulo: 'X', ...datos });
t('importador: datos sueltos con tipo despacho (sin «contenido»)', !r.errores.length && r.el.contenido.empresas.length === 4, JSON.stringify(r.errores));
const conErr = (mut) => { const j = JSON.parse(JSON.stringify(datos)); mut(j); const E = []; D.validarDespacho(j, (ruta, x) => E.push(ruta + ' ' + x)); return E; };
t('importador: sin empresas → error', conErr((j) => { j.empresas = []; }).length > 0);
t('importador: trabajo con recurso que no existe → error', conErr((j) => { j.empresas[0].trabajos[0].recurso = 'Helicóptero'; }).some((x) => x.includes('Helicóptero')));
t('importador: perfil que nadie tiene → error', conErr((j) => { j.empresas[0].trabajos[0].perfil = 'Astronauta'; }).some((x) => x.includes('Astronauta')));
t('importador: horas no numéricas → error', conErr((j) => { j.empresas[0].trabajos[0].horas = 'mucho'; }).some((x) => x.includes('horas')));
t('importador: día que no existe → error', conErr((j) => { j.empresas[0].trabajos[0].dia = 'Domingo'; }).some((x) => x.includes('Domingo')));
t('importador: turno raro → error', conErr((j) => { j.empresas[0].personal[0].turno = 'Noche'; }).some((x) => x.includes('turno')));
t('importador: códigos de personal repetidos → error', conErr((j) => { j.empresas[0].personal[1].codigo = j.empresas[0].personal[0].codigo; }).some((x) => x.includes('repetido')));
t('importador: ventana mal escrita → error', conErr((j) => { j.empresas[0].trabajos[0].ventana = 'pronto'; }).some((x) => x.includes('ventana')));
t('importador: sin nombres ni correos en el ejemplo', !/@|alumn/i.test(JSON.stringify(datos)));

// --- Tablero y avisos (empresa mínima, controlada) ---
const cont = D.validarDespacho({ horario: '8:00-22:00', viaje_min: 30, empresas: [{ id: 'e', nombre: 'E', personal: [{ codigo: 'A', rol: 'Fontanero/a', turno: 'Mañana' }, { codigo: 'B', rol: 'Ayudante', turno: 'Tarde' }, { codigo: 'F', rol: 'Pintor/a', turno: 'Flexible' }], recursos: ['Furgo', 'Andamio'],
  trabajos: [{ id: 'T1', cliente: 'c1', trabajo: 'x', perfil: 'Fontanero/a', personas: 1, horas: 2, ventana: '8:00-12:00', dia: 'Lunes', recurso: 'Furgo' }, { id: 'T2', cliente: 'c2', trabajo: 'y', perfil: 'Ayudante', personas: 1, horas: 1, ventana: '8:00-22:00', dia: 'Lunes', recurso: 'Furgo' }, { id: 'T3', cliente: 'c3', trabajo: 'z', perfil: 'Pintor/a', personas: 2, horas: 1.5, ventana: 'Tarde', dia: 'Miércoles' }], llamadas: [{ cuando: 'L', texto: 'Hola', tipo: 'Urgencia' }] }] });
const E = cont.empresas[0];
const tipos = (tb) => D.avisos(cont, E, tb).map((a) => `${a.nivel}:${a.tipo}`);
let tb = {};
tb = D.colocar(cont, E, tb, 'T1', 0, 9 * 60); tb = D.asignar(E, tb, 'T1', 'p', 'A'); tb = D.asignar(E, tb, 'T1', 'r', 'Furgo');
t('colocar + asignar: sin avisos', D.avisos(cont, E, tb).length === 0, JSON.stringify(tipos(tb)));
t('el bloque ocupa su duración (2 h → 9:00-11:00)', D.bloques(E, tb)[0].fin === 11 * 60);
tb = D.colocar(cont, E, tb, 'T2', 0, 10 * 60); tb = D.asignar(E, tb, 'T2', 'p', 'A'); tb = D.asignar(E, tb, 'T2', 'r', 'Furgo');
let A = tipos(tb);
t('solape de personal → rojo', A.includes('rojo:solape-persona'), JSON.stringify(A));
t('solape de recurso → rojo', A.includes('rojo:solape-recurso'), JSON.stringify(A));
t('T2 sin persona con perfil Ayudante → rojo perfil', A.includes('rojo:perfil'), JSON.stringify(A));
t('los rojos van primero', D.avisos(cont, E, tb)[0].nivel === 'rojo');
tb = D.desasignar(tb, 'T2', 'p', 'A'); tb = D.asignar(E, tb, 'T2', 'p', 'B'); tb = D.desasignar(tb, 'T2', 'r', 'Furgo');
A = tipos(tb);
t('quitar/poner: sin solapes ni perfil', !A.some((x) => x.startsWith('rojo')), JSON.stringify(A));
t('falta el recurso del trabajo → naranja', A.includes('naranja:recurso'));
t('B (tarde) a las 10:00 → amarillo turno', A.includes('amarillo:turno'));
tb = D.colocar(cont, E, tb, 'T2', 0, 11 * 60); tb = D.desasignar(tb, 'T2', 'p', 'B'); tb = D.asignar(E, tb, 'T2', 'p', 'A'); tb = D.asignar(E, tb, 'T2', 'p', 'B');
A = tipos(tb);
t('mismo equipo sin 30 min de viaje → naranja viaje', A.includes('naranja:viaje'), JSON.stringify(A));
t('nº de personas distinto del pedido → naranja personas', A.includes('naranja:personas'));
tb = D.colocar(cont, E, tb, 'T2', 0, 11 * 60 + 30);
t('con 30 min de hueco ya no hay aviso de viaje', !tipos(tb).includes('naranja:viaje'));
tb = D.colocar(cont, E, tb, 'T1', 1, 13 * 60);
A = tipos(tb);
t('fuera de su ventana → naranja ventana', A.includes('naranja:ventana'), JSON.stringify(A));
t('A (mañana) acaba a las 15:00 → amarillo turno', D.avisos(cont, E, tb).some((a) => a.tipo === 'turno' && a.texto.startsWith('A ')));
tb = D.colocar(cont, E, tb, 'T3', 2, 21 * 60 + 30);
t('no se sale del horario: se ajusta para acabar a las 22:00', tb.T3.s === 22 * 60 - 90);
tb = D.asignar(E, tb, 'T3', 'p', 'F');
t('turno Flexible: sin aviso de turno', !D.avisos(cont, E, tb).some((a) => a.tipo === 'turno' && a.texto.startsWith('F ')));
t('contador: colocados 3/3', D.contador(cont, E, tb).colocados === 3 && D.contador(cont, E, tb).total === 3);
const antes = JSON.stringify(tb); D.colocar(cont, E, tb, 'T1', 3, 600);
t('los movimientos no cambian el tablero anterior (deshacer)', JSON.stringify(tb) === antes);
t('asignar una persona que no es de la empresa: no hace nada', D.asignar(E, tb, 'T1', 'p', 'Z') === tb);
t('quitar trabajo', !D.quitarTrabajo(tb, 'T1').T1 && D.colocados(E, D.quitarTrabajo(tb, 'T1')) === 2);
t('perfil: tildes y mayúsculas no importan', D.cumplePerfil('FONTANERO/A', 'fontanero/a') && D.cumplePerfil('Técnico', 'tecnico'));

// --- Guardado (doc) ---
const doc0 = D.docVacio('e'); doc0.b = tb; D.anotar(doc0, 'colocar', 'T1', 'Lunes 9:00', 1000);
const txt = D.docTexto(doc0); const back = D.leerDoc(txt);
t('guardado: el tablero vuelve igual al leerlo', JSON.stringify(back.b) === JSON.stringify(tb) && back.h.length === 1 && back.emp === 'e');
t('guardado: un doc que no es del despacho → null', D.leerDoc('{"v":1,"c":{}}') === null && D.leerDoc('<p>hola</p>') === null);
t('guardado: el historial no pasa de 400', (() => { const d = D.docVacio('e'); for (let i = 0; i < 450; i++) D.anotar(d, 'mover', 'T1'); return d.h.length === 400; })());
const grande = D.docVacio(C.empresas[0].id); for (const x of C.empresas[0].trabajos) grande.b = D.colocar(C, C.empresas[0], grande.b, x.id, 0, 600);
for (let i = 0; i < 400; i++) D.anotar(grande, 'mover', 'LT01', 'Miércoles 10:30');
for (let i = 0; i < 3; i++) grande.inc.push({ c: 'x', k: i, cambio: 'He cambiado varias cosas del tablero', porque: 'Porque la furgoneta se ha roto hoy', antes: grande.b, despues: grande.b, texto: 'x'.repeat(300) });
t('guardado: un tablero lleno con historial e incidencias cabe en el límite (300 000)', D.docTexto(grande).length < 300000, D.docTexto(grande).length);
t('resumen en texto', D.resumenTexto(cont, E, back).includes('Trabajos colocados 3/3'));
t('incidencia: hace falta una frase en «qué» y en «por qué»', !D.incidenciaOk({ cambio: 'nada', porque: '' }) && D.incidenciaOk({ cambio: 'He movido el trabajo', porque: 'Porque llovía mucho' }));

// --- Empresa de cada alumno y llamadas ---
t('azar estable: el mismo alumno, la misma empresa', D.empresaAzar(C, 'item1', 7) === D.empresaAzar(C, 'item1', 7));
const reparto = new Set([1, 2, 3, 4, 5, 6, 7, 8].map((n) => D.empresaAzar(C, 'item1', n)));
t('azar: se reparten varias empresas', reparto.size >= 2);
t('la del profesor manda si el tablero está vacío', D.empresaPara(C, { itemId: 'i', numero: 3, asign: { 3: 'jardineria' } }) === 'jardineria');
t('si ya empezó con otra empresa, conserva su tablero', D.empresaPara(C, { itemId: 'i', numero: 3, asign: { 3: 'jardineria' }, docEmp: 'limpieza', tableroVacio: false }) === 'limpieza');
const rep = D.repartir(C, [1, 2, 3, 4, 5, 6, 7, 8], () => 0.3); const cuenta = {}; Object.values(rep).forEach((e) => { cuenta[e] = (cuenta[e] || 0) + 1; });
t('repartir equilibrado: 2 alumnos por empresa', Object.values(cuenta).every((n) => n === 2) && Object.keys(cuenta).length === 4, JSON.stringify(cuenta));
const L = [{ e: '', k: 0, n: 0, t: 1 }, { e: 'limpieza', k: 1, n: 0, t: 2 }, { e: 'jardineria', k: 2, n: 5, t: 3 }];
t('llamadas pendientes: todo el grupo + su empresa', D.pendientes(L, { emp: 'limpieza', numero: 7, atendidas: [] }).map((x) => x.k).join() === '0,1');
t('llamadas pendientes: las de otro alumno u otra empresa no', D.pendientes(L, { emp: 'jardineria', numero: 7, atendidas: [] }).map((x) => x.k).join() === '0');
t('llamadas pendientes: las atendidas ya no salen', D.pendientes(L, { emp: 'limpieza', numero: 7, atendidas: [{ c: 'limpieza:0' }] }).map((x) => x.k).join() === '1');

console.log(`\n${ok} OK · ${fallos} fallos`); if (fallos) process.exit(1);

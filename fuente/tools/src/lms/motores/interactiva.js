// Fase 12 · «Actividad interactiva»: preguntas de examen (test, V/F, huecos, emparejar, ordenar, numérica,
// zonas, clasificar, tabla…) SIN tiempo límite y con VARIOS intentos. El alumno comprueba, ve qué ha
// acertado (y la solución, si el profesor lo permite) y vuelve a intentarlo. Entrega «Aciertos: a/t» de su
// mejor intento: en el cuaderno, «Poner notas» lo pasa a nota. Es práctica: las soluciones van con la actividad.
// contenido (forma del profesor): { preguntas: [como en el examen], intentos: 0 (= sin límite) | n, soluciones: true }
// Se guarda separado (Firestore no admite listas dentro de listas): { preguntas: [públicas], claves: { qid: clave }, … }
import { registrarMotor } from '../elemento.js';
import { validarPregunta, separarPregunta, unirPregunta } from '../preguntas.js';
import { CLASES, validarComponente, aleatorios, textoValor } from '../colores.js';

// Bloque 4 · «colores»: { modo: "leer"|"pintar", intentos, componentes: [{ id, clase, bandas }], aleatorio: n, clases: [...] }
// Cada componente se convierte en una pregunta «colores» (la solución la calcula el motor a partir de las bandas).
// «aleatorio»: n componentes al azar de cada clase (o de las de «clases»), distintos en cada intento: practicar sin fin.
const ENUNCIADO = { leer: (c) => `${c.id ? c.id + ' · ' : ''}¿Qué valor tiene ${CLASES[c.clase].corto === 'resistencia' ? 'esta' : 'este'} ${CLASES[c.clase].corto}?`, pintar: (c) => `${c.id ? c.id + ' · ' : ''}Pinta las bandas ${CLASES[c.clase].corto === 'resistencia' ? 'de la resistencia' : CLASES[c.clase].corto === 'condensador' ? 'del condensador' : 'del inductor'}` };
export function preguntaColores(c, modo, i) { return { id: String(c.id || 'c' + (i + 1)).replace(/[^\w-]/g, '_').slice(0, 30), tipo: 'colores', enunciado: ENUNCIADO[modo](c), puntos: 1, clase: c.clase, bandas: c.bandas, modo }; }
export function validarColoresConf(cc, err) {
  if (!cc || typeof cc !== 'object' || Array.isArray(cc)) { err('colores', '«colores» tiene que ser un objeto { "modo": "leer", "componentes": [ … ] }.'); return null; }
  const modo = cc.modo ?? 'leer'; if (!['leer', 'pintar'].includes(modo)) { err('colores.modo', '«modo» tiene que ser "leer" o "pintar".'); return null; }
  const L = cc.componentes ?? [];
  if (!Array.isArray(L)) { err('colores.componentes', '«componentes» tiene que ser una lista: [ { "id": "R1", "clase": "resistencia4", "bandas": [ … ] } ].'); return null; }
  if (L.length > 40) err('colores.componentes', 'Máximo 40 componentes.');
  const comps = []; const ids = new Set();
  L.slice(0, 40).forEach((c, i) => { const v = validarComponente(c, i, (r, t) => err('colores.' + r, t)); if (!v) return; if (v.id && ids.has(v.id)) { err(`colores.componentes[${i}].id`, `El id «${v.id}» está repetido.`); return; } if (v.id) ids.add(v.id); comps.push(v); });
  let aleatorio = 0;
  if (cc.aleatorio != null && cc.aleatorio !== '') { aleatorio = Number(cc.aleatorio); if (!Number.isInteger(aleatorio) || aleatorio < 1 || aleatorio > 10) { err('colores.aleatorio', '«aleatorio» tiene que ser un número entero de 1 a 10 (componentes de cada clase).'); aleatorio = 0; } }
  const clases = cc.clases == null ? Object.keys(CLASES) : cc.clases;
  if (!Array.isArray(clases) || !clases.length || clases.some((c) => !CLASES[c])) { err('colores.clases', `«clases» tiene que ser una lista con: ${Object.keys(CLASES).join(', ')}.`); return null; }
  if (!comps.length && !aleatorio) { if (!L.length) err('colores', 'Pon «componentes» o «aleatorio» (o los dos).'); return null; }
  return { modo, componentes: comps, aleatorio, clases, intentos: cc.intentos };
}
// Preguntas al azar de una actividad «colores» (las mismas para la misma semilla)
export function preguntasAleatorias(conf, seed) {
  const P = []; let i = 0;
  for (const cl of conf.clases || Object.keys(CLASES)) for (const c of aleatorios(cl, conf.aleatorio, (seed ^ ((i++ + 1) * 2654435761)) >>> 0)) P.push({ ...preguntaColores({ ...c, id: null }, conf.modo, P.length), id: 'z' + P.length });
  return P.map((q) => separarPregunta(validarPregunta(q, 0, () => { })));
}

export function validarInteractiva(c, err) {
  let colores = null;
  if (c.colores != null) {
    colores = validarColoresConf(c.colores, err);
    if (!colores) return { preguntas: [], claves: {}, intentos: 0, soluciones: true };
    if (colores && !Array.isArray(c.preguntas)) {
      if (!colores.componentes.length) return { preguntas: [], claves: {}, intentos: intentosDe(colores.intentos ?? c.intentos, err), soluciones: c.soluciones !== false, colores: { modo: colores.modo, aleatorio: colores.aleatorio, clases: colores.clases } };
      c = { ...c, preguntas: colores.componentes.map((x, i) => preguntaColores(x, colores.modo, i)), intentos: c.intentos ?? colores.intentos };
    }
  }
  const P = Array.isArray(c.preguntas) ? c.preguntas : null;
  if (!P || !P.length) { err('preguntas', '«preguntas» tiene que ser una lista con al menos una pregunta (mismo formato que en el examen).'); return { preguntas: [], claves: {}, intentos: 0, soluciones: true }; }
  if (P.length > 40) err('preguntas', 'Máximo 40 preguntas.');
  const K = c.claves && typeof c.claves === 'object' ? c.claves : null;
  const preguntas = []; const claves = {}; const ids = new Set();
  P.slice(0, 40).forEach((q0, i) => {
    const q1 = K && q0 && q0.id != null && q0.id in K ? unirPregunta(q0, K[q0.id]) : q0;
    if (q1?.tipo === 'abierta') { err(`preguntas[${i}]`, `Pregunta ${i + 1}: la respuesta abierta no se puede corregir sola. Úsala en un examen o en una tarea con rúbrica.`); return; }
    const q = validarPregunta(q1, i, (ruta, t) => err(`preguntas[${i}]${ruta ? '.' + ruta : ''}`, t)); if (!q) return;
    if (ids.has(q.id)) { err(`preguntas[${i}].id`, `Pregunta ${i + 1}: el id «${q.id}» está repetido.`); return; } ids.add(q.id);
    const s = separarPregunta(q); preguntas.push(s.publica); claves[q.id] = s.clave ?? null;
  });
  const n = c.intentos == null || c.intentos === '' ? 0 : Number(c.intentos);
  if (!Number.isInteger(n) || n < 0 || n > 20) err('intentos', '«intentos» tiene que ser un número entero de 0 (sin límite) a 20.');
  return { preguntas, claves, intentos: Number.isInteger(n) && n >= 0 && n <= 20 ? n : 0, soluciones: c.soluciones !== false, ...(colores?.aleatorio ? { colores: { modo: colores.modo, aleatorio: colores.aleatorio, clases: colores.clases } } : {}) };
}
function intentosDe(x, err) { const n = x == null || x === '' ? 0 : Number(x); if (!Number.isInteger(n) || n < 0 || n > 20) { err('intentos', '«intentos» tiene que ser un número entero de 0 (sin límite) a 20.'); return 0; } return n; }
// Para el editor del profesor: vuelve a la forma con las soluciones dentro de cada pregunta
export function interactivaParaEditar(c) {
  if (!c || !Array.isArray(c.preguntas) || !c.claves) return c;
  return { preguntas: c.preguntas.map((q) => unirPregunta(q, c.claves[q.id])), intentos: c.intentos ?? 0, soluciones: c.soluciones !== false, ...(c.colores ? { colores: c.colores } : {}) };
}
registrarMotor('interactiva', {
  nombre: 'Actividad interactiva', validar: validarInteractiva, entregable: true, paraEditar: interactivaParaEditar,
  resumen: (c) => `${(c.preguntas || []).length} pregunta(s)${c.colores?.aleatorio ? ` + ${c.colores.aleatorio} al azar de cada clase` : ''} · ${c.intentos ? `${c.intentos} intento(s)` : 'intentos ilimitados'} · sin tiempo límite`,
  ejemplo: {
    intentos: 0, soluciones: true,
    preguntas: [
      { id: 'q1', tipo: 'test', enunciado: '¿Qué mide un amperímetro?', opciones: ['La tensión', 'La intensidad', 'La resistencia'], correcta: 1 },
      { id: 'q2', tipo: 'clasificar', enunciado: 'Clasifica estos materiales', puntos: 2, grupos: [{ nombre: 'Conductores', elementos: ['Cobre', 'Aluminio'] }, { nombre: 'Aislantes', elementos: ['Plástico', 'Madera'] }] },
      { id: 'q3', tipo: 'tabla', enunciado: 'Completa la tabla', puntos: 2, columnas: ['Magnitud', 'Unidad'], filas: [['Tensión', '[[voltio|V]]'], ['Intensidad', '[[amperio|A]]']] },
    ],
  },
});

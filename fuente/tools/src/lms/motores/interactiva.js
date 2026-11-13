// Fase 12 · «Actividad interactiva»: preguntas de examen (test, V/F, huecos, emparejar, ordenar, numérica,
// zonas, clasificar, tabla…) SIN tiempo límite y con VARIOS intentos. El alumno comprueba, ve qué ha
// acertado (y la solución, si el profesor lo permite) y vuelve a intentarlo. Entrega «Aciertos: a/t» de su
// mejor intento: en el cuaderno, «Poner notas» lo pasa a nota. Es práctica: las soluciones van con la actividad.
// contenido (forma del profesor): { preguntas: [como en el examen], intentos: 0 (= sin límite) | n, soluciones: true }
// Se guarda separado (Firestore no admite listas dentro de listas): { preguntas: [públicas], claves: { qid: clave }, … }
import { registrarMotor } from '../elemento.js';
import { validarPregunta, separarPregunta, unirPregunta } from '../preguntas.js';

export function validarInteractiva(c, err) {
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
  return { preguntas, claves, intentos: Number.isInteger(n) && n >= 0 && n <= 20 ? n : 0, soluciones: c.soluciones !== false };
}
// Para el editor del profesor: vuelve a la forma con las soluciones dentro de cada pregunta
export function interactivaParaEditar(c) {
  if (!c || !Array.isArray(c.preguntas) || !c.claves) return c;
  return { preguntas: c.preguntas.map((q) => unirPregunta(q, c.claves[q.id])), intentos: c.intentos ?? 0, soluciones: c.soluciones !== false };
}
registrarMotor('interactiva', {
  nombre: 'Actividad interactiva', validar: validarInteractiva, entregable: true, paraEditar: interactivaParaEditar,
  resumen: (c) => `${(c.preguntas || []).length} pregunta(s) · ${c.intentos ? `${c.intentos} intento(s)` : 'intentos ilimitados'} · sin tiempo límite`,
  ejemplo: {
    intentos: 0, soluciones: true,
    preguntas: [
      { id: 'q1', tipo: 'test', enunciado: '¿Qué mide un amperímetro?', opciones: ['La tensión', 'La intensidad', 'La resistencia'], correcta: 1 },
      { id: 'q2', tipo: 'clasificar', enunciado: 'Clasifica estos materiales', puntos: 2, grupos: [{ nombre: 'Conductores', elementos: ['Cobre', 'Aluminio'] }, { nombre: 'Aislantes', elementos: ['Plástico', 'Madera'] }] },
      { id: 'q3', tipo: 'tabla', enunciado: 'Completa la tabla', puntos: 2, columnas: ['Magnitud', 'Unidad'], filas: [['Tensión', '[[voltio|V]]'], ['Intensidad', '[[amperio|A]]']] },
    ],
  },
});

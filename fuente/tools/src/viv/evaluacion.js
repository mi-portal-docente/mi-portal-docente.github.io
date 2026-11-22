// «Evaluación de vivienda» por niveles, como «Evaluación de circuitos» (src/circ/evaluaciones.js). Módulo puro.
// Cada nivel tiene varios montajes de examen del tablero, sin pasos ni pistas. Se corrige cada montaje como su práctica
// (funciona en todas las posiciones y cumple el REBT) y la nota es la media de los montajes (cada uno, 0 si no funciona y 10 menos 2,5 por requisito del REBT incumplido).
// Cada nivel se entrega en su propio documento (v7, v8, v9: ids que las reglas de Firestore ya admiten).
import { practica, modeloInicial, modeloSolucion, comprobarPractica } from './practicas.js';
import { sanear } from './modelo.js';

const M = (de, enunciado, averia = null) => ({ de, enunciado, averia });
export const EVALS_VIV = [
  { id: 've1', entrega: 'v7', nivel: 1, title: 'Puntos de luz', sub: 'Interruptor simple y conmutada (circuito C1)', duration: '50 min',
    montajes: [M('vp2', 'Desde el C1 (PIA de 10 A, 1,5 mm²), monta un punto de luz mandado por un <b>interruptor simple</b>, con los empalmes en la caja de registro. El interruptor tiene que cortar la fase.'),
      M('vp3', 'Monta una <b>conmutada</b>: la misma lámpara se enciende y se apaga desde dos conmutadores. La fase entra por el común del primero.')] },
  { id: 've2', entrega: 'v8', nivel: 2, title: 'Schuko y caja de registro', sub: 'Toma con tierra (C2) y empalmes de dos circuitos', duration: '60 min',
    montajes: [M('vp4', 'Desde el C2 (PIA de 16 A, 2,5 mm²), conecta una <b>base schuko</b> con su conductor de protección hasta la barra de tierra.'),
      M('vp5', 'Coloca los <b>conectores</b> de la caja de registro y empalma en ella el punto de luz del C1. El enchufe del C2 va por su propio tubo, con 2,5 mm² y tierra.')] },
  { id: 've3', entrega: 'v9', nivel: 3, title: 'Cuadro y avería', sub: 'Cablear el cuadro y reparar una instalación con fallos', duration: '60 min',
    montajes: [M('vp1', 'Cablea el <b>cuadro</b>: bornero → IGA → diferencial → PIAs C1 y C2, con la tierra a la barra. Entrada por arriba, salida por abajo.'),
      M('vp6', 'Esta instalación completa tiene <b>dos fallos</b> que incumplen el REBT. Pruébala, encuéntralos y repáralos hasta que funcione y cumpla la norma.', 'cuadro')] },
];
export const evalVivDe = (id) => EVALS_VIV.find((e) => e.id === id) || null;
export const evalVivPorEntrega = (pr) => EVALS_VIV.find((e) => e.entrega === pr) || null;
export const practicaDeMontaje = (mt) => practica(mt.de);
// Montaje de partida del examen: el de la práctica (piezas sin cables) o, en la avería, la solución con dos fallos:
// el retorno de la lámpara en azul (color del neutro, ITC-BT-19) y la base sin su conductor de protección (ITC-BT-18).
export function modeloExamen(mt) {
  const Pr = practica(mt.de); if (!mt.averia) { const m = modeloInicial(Pr); m.examen = true; return m; }
  const m = modeloSolucion(Pr); const r = m.cables.find((c) => c.id === 'r2'); if (r) r.color = 'azul';
  m.cables = m.cables.filter((c) => c.id !== 'epe'); m.examen = true; return sanear(m);
}
export function corregirMontaje(mt, m, opts = {}) {
  const Pr = practica(mt.de); const R = comprobarPractica(Pr, m || modeloExamen(mt), opts);
  const n = R.items.length, bien = R.items.filter((x) => x.ok).length;
  // Nota del montaje: si no funciona, 0 (un tablero sin cables «cumple» muchas normas sin hacer nada); si funciona,
  // 10 menos 2,5 por cada requisito del REBT que falla (5 en la avería, para que no puntúe dejarla como estaba).
  const funciona = !!R.items[0]?.ok && !R.items.some((x) => !x.ok && /^No funciona|sin fase|no le llegan/i.test(x.t));
  const fallos = n - bien; const score = R.ok ? 1 : funciona ? Math.max(0, 1 - fallos * (mt.averia ? 0.5 : 0.25)) : 0;
  return { ok: R.ok, funciona, items: R.items.map((x) => ({ t: x.t, ok: !!x.ok })), bien, n, score };
}
export function corregirNivelViv(ev, modelos, opts = {}) {
  const montajes = ev.montajes.map((mt, k) => ({ titulo: practica(mt.de).title, ...corregirMontaje(mt, modelos?.[k], opts) }));
  const media = montajes.reduce((a, c) => a + c.score, 0) / (montajes.length || 1);
  return { montajes, nota: Math.round(media * 100) / 10, correctos: montajes.filter((c) => c.ok).length, ok: montajes.every((c) => c.ok) };
}

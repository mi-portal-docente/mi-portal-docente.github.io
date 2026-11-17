// «Evaluación de circuitos» y «Práctica autónoma» (módulo puro, sin three.js ni DOM).
// Cada circuito se corrige igual que su práctica guiada: el montaje tiene que ser equivalente al esquema
// (da igual en qué agujeros) y cumplir el comportamiento pedido. No hay pasos ni pistas.
import { PRACTICES } from './practices.js';
import { runChecks } from './guide.js';

const P = (id) => PRACTICES.find((p) => p.id === id);
// Comprobaciones que valen sin guía: fuera las de medir con el polímetro y las propias del recorrido guiado
export const checksSolo = (pr) => { const L = pr.checks.filter((ch) => !ch.measured && !ch.soloGuiada); return L.length ? L : [{ topo: true }]; }; // (práctica solo de medir: al menos el montaje)
export function corregirCircuito(pr, model) {
  const r = runChecks({ ...pr, checks: checksSolo(pr) }, model || { parts: [], wires: [] }, {});
  const n = r.items.length, bien = r.items.filter((x) => x.ok).length;
  return { ok: r.ok, items: r.items.map((x) => ({ t: x.label, ok: !!x.ok })), bien, n, score: n ? bien / n : 0 };
}
// circuito: { de: id de la práctica, enunciado (HTML corto: qué hay que conseguir) }
const C = (de, enunciado) => ({ de, enunciado });
export const EVALS = [
  { id: 'n1', nivel: 1, title: 'LED, serie y paralelo', sub: 'Resistencia de protección, receptores en serie y en paralelo', duration: '45 min',
    circuitos: [
      C('c13', 'Con el portapilas de 3 V, enciende un LED rojo protegido con una resistencia de 100 Ω en serie. El LED tiene que lucir sin fundirse.'),
      C('c4', 'Con el portapilas de 6 V, monta dos bombillas de 6 V <b>en serie</b>: un solo camino para la corriente.'),
      C('c5', 'Con el portapilas de 6 V, monta dos bombillas de 6 V <b>en paralelo</b>: cada una con su camino, las dos a 6 V.'),
    ] },
  { id: 'n2', nivel: 2, title: 'Interruptores, pulsadores y conmutadores', sub: 'Elementos de control y circuito conmutado', duration: '50 min',
    circuitos: [
      C('c1', 'Con el portapilas de 6 V, enciende y apaga una bombilla con el interruptor deslizante de 3 patas.'),
      C('c15', 'Con el portapilas de 3 V, un LED rojo con su resistencia de 100 Ω tiene que lucir solo si el interruptor está cerrado <b>y</b> además se pulsa el pulsador (los dos en serie).'),
      C('c7', 'Con dos conmutadores, enciende y apaga una bombilla desde dos puntos distintos, como en un pasillo.'),
      C('c16', 'Con el portapilas de 3 V: un interruptor general corta todo; detrás, una rama con LED rojo fijo y otra con LED amarillo que solo luce al pulsar (cada LED con su resistencia de 100 Ω).'),
    ] },
  { id: 'n3', nivel: 3, title: 'Fusible, final de carrera y diodo', sub: 'Protección, detección de fin de recorrido y polaridad', duration: '50 min',
    circuitos: [
      C('c17', 'Protege una bombilla de 6 V con un fusible de 200 mA en serie. Añade un pulsador en paralelo con la bombilla para simular un cortocircuito: con él pulsado, el fusible tiene que fundirse.'),
      C('c18', 'Con un final de carrera: en reposo gira el motor; al apretar la palanca el motor se para y luce un LED rojo de aviso (con 330 Ω).'),
      C('c19', 'Dos ramas a 6 V, cada una con diodo 1N4007, resistencia de 330 Ω y LED: en la rama del LED verde el diodo en directa (luce); en la del rojo, en inversa (no luce).'),
    ] },
  { id: 'n4', nivel: 4, title: 'Transistor y relé', sub: 'Mando y potencia', duration: '60 min',
    circuitos: [
      C('c20', 'Con un BC547: al pulsar el pulsador, la base recibe corriente por una resistencia de 10 kΩ y se enciende un LED rojo (con 330 Ω) conectado al colector.'),
      C('c12', 'Con un relé de 5 V gobernado por un interruptor (y su diodo de protección): en reposo luce un LED rojo (330 Ω) por NC; al activar la bobina luce una bombilla por NO.'),
      C('c21', 'Automatismo: el interruptor de marcha, a través del NC de un final de carrera y una resistencia de 2,2 kΩ, activa un BC547 que mueve la bobina de un relé (con diodo); el NO del relé hace girar el motor. Al apretar el final de carrera, el motor se para.'),
    ] },
  { id: 'n5', nivel: 5, title: 'Condensador, LED RGB y sensores', sub: 'Carga y descarga, mezcla de colores y luz automática', duration: '60 min',
    circuitos: [
      C('c27', 'Con la pila de 9 V: un pulsador alimenta una resistencia de 330 Ω y un LED rojo en serie. Añade un condensador electrolítico de 470 µF (bien polarizado) entre la salida del pulsador y el −, para que al soltar el LED se apague poco a poco.'),
      C('c28', 'Con la pila de 9 V y un LED RGB de cátodo común: cada color (R, G y B) con su resistencia de 330 Ω y su pulsador, de forma que pulsando se puedan mezclar los colores.'),
      C('c29', 'Luz nocturna: un BC547 enciende un LED rojo (con 330 Ω, en el colector) solo cuando hay poca luz. La base se alimenta con un divisor de tensión: 10 kΩ desde el + y una LDR hasta el −.'),
    ] },
];
export const evalDe = (id) => EVALS.find((e) => e.id === id) || null;
// «Práctica autónoma»: la misma práctica guiada (cN) sin pasos ni pistas; su id es aN (mismo número interno).
export const idAutonoma = (prId) => 'a' + String(prId).replace(/^c/, '');
export function autonomaDe(id) {
  const m = /^a(\d{1,2})$/.exec(String(id || '')); const pr = m && P('c' + m[1]); if (!pr) return null;
  return { id, autonoma: true, practica: pr.id, title: pr.title, duration: pr.duration, sub: pr.sub,
    circuitos: [{ de: pr.id, enunciado: `${pr.objetivo} Esta vez lo haces <b>tú solo</b>: sin pasos ni pistas, con el esquema y el material.` }] };
}
export const practicaDe = (c) => P(c.de);
// Corrige un nivel completo. modelos: [model por circuito]. Nota = media de los requisitos cumplidos de cada circuito (0–10, con un decimal).
export function corregirNivel(ev, modelos) {
  const circuitos = ev.circuitos.map((c, k) => ({ titulo: P(c.de).title, ...corregirCircuito(P(c.de), modelos?.[k]) }));
  const media = circuitos.reduce((a, c) => a + c.score, 0) / (circuitos.length || 1);
  return { circuitos, nota: Math.round(media * 100) / 10, correctos: circuitos.filter((c) => c.ok).length, ok: circuitos.every((c) => c.ok) };
}

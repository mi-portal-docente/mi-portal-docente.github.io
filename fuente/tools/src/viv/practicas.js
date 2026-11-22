// Prácticas del tablero eléctrico, una a una, como las de Circuitos: cada una tiene una GUIADA (pasos que el simulador
// comprueba solo, en el tablero 3D) y una AUTÓNOMA (el mismo montaje sin pasos, que se corrige con la prueba de
// funcionamiento y las normas). Siguen el REBT y la ITC-BT-25 (vivienda con electrificación básica).
// Los montajes de partida y las soluciones salen de los proyectos (proyectos.js), así que no se repite nada.
// Sin dependencias del navegador: se prueba con node (tools/viv_practicas_test.mjs).
import { proyecto, solucion, comprobarProyecto } from './proyectos.js';
import { sanear, clone, partePorId, nombreBorne, COLORES, fmtSec, TIPOS } from './modelo.js';

// Los circuitos de la electrificación básica (ITC-BT-25, tabla 1)
export const CIRCUITOS_VIV = [
  { c: 'C1', uso: 'Alumbrado', pia: 10, sec: 1.5, tubo: 16, txt: 'Puntos de luz de toda la vivienda.' },
  { c: 'C2', uso: 'Tomas de uso general', pia: 16, sec: 2.5, tubo: 20, txt: 'Enchufes de dormitorios, salón y pasillo (y el frigorífico).' },
  { c: 'C3', uso: 'Cocina y horno', pia: 25, sec: 6, tubo: 25, txt: 'Solo la placa y el horno: consumen mucho.' },
  { c: 'C4', uso: 'Lavadora, lavavajillas y termo', pia: 20, sec: 4, tubo: 20, txt: 'Aparatos que calientan agua.' },
  { c: 'C5', uso: 'Baño y cocina', pia: 16, sec: 2.5, tubo: 20, txt: 'Enchufes del baño y de la encimera de la cocina.' },
];
// Para qué sirve cada aparato del cuadro (CGMP), en una o dos frases
export const APARATOS = [
  { k: 'ICP', n: 'ICP (en el contador)', txt: 'Limita la potencia que has contratado. Hoy lo hace el contador digital de la compañía; en el cuadro no se monta.' },
  { k: 'IGA', n: 'IGA · interruptor general automático (25 A)', txt: 'Corta toda la vivienda si hay una sobrecarga o un cortocircuito. Es el primero del cuadro.' },
  { k: 'ID', n: 'Diferencial · 40 A / 30 mA', txt: 'Protege a las PERSONAS: si se escapan más de 30 mA a tierra (una derivación o una persona tocando la fase), corta en milisegundos. El botón T sirve para probarlo cada mes.' },
  { k: 'PIA', n: 'PIA · magnetotérmico de cada circuito', txt: 'Protege los CABLES de su circuito: salta por sobrecarga (térmico, en segundos o minutos) o por cortocircuito (magnético, al instante). Su calibre va con la sección del cable.' },
];

// Cada paso: { t: título, txt: explicación corta, cables: [ids de la solución] | fichas: 'CE1' | accion: 'red'|'test'|'sobrecarga'|'corto' }
const P = (t, txt, o = {}) => ({ t, txt, ...o });
export const PRACTICAS = [
  { id: 'vp1', n: 1, proy: 'cuadro', base: 'cuadro', reserva: true, icon: 'shield-check', title: 'El cuadro general: IGA, diferencial y PIAs', sub: 'Cablea el cuadro en orden y prueba que cada protección salta cuando debe.',
    level: 'Iniciación', duration: '2 h', norma: 'ITC-BT-17 y ITC-BT-25', circuito: 'IGA 25 A · ID 40 A/30 mA · C1 10 A · C2 16 A',
    intro: 'El cuadro general de mando y protección (CGMP) reparte la instalación. Orden: manguera → IGA → diferencial → un PIA por circuito. En la aparamenta, la entrada va arriba y la salida abajo.',
    pasos: [
      P('La tierra a la barra', 'Del borne PE del bornero, amarillo-verde de 2,5 mm² a la barra de tierra del cuadro.', { cables: ['mPE'] }),
      P('Bornero → IGA (entrada arriba)', 'Fase marrón al borne 1 de arriba del IGA y neutro azul al N de arriba. 2,5 mm².', { cables: ['mL', 'mN'] }),
      P('IGA → diferencial', 'De la salida del IGA (abajo) a la entrada del diferencial (arriba). El neutro siempre por los bornes N.', { cables: ['gL', 'gN'] }),
      P('Diferencial → PIAs', 'De la salida del diferencial a la entrada del C1, y un puente del C1 al C2 (en el cuadro real, un peine).', { cables: ['dL', 'dN', 'pL', 'pN'] }),
      P('Da tensión', 'Pulsa «Enchufar la manguera» y comprueba que se enciende la luz con el interruptor.', { accion: 'red' }),
      P('Prueba el diferencial', 'Pulsa el botón T del diferencial: tiene que saltar y cortar toda la vivienda. Después vuelve a subirlo.', { accion: 'test' }),
      P('Provoca una sobrecarga en el C2', 'Selecciona el enchufe y conéctale la regleta de 5000 W (unos 22 A): salta el PIA de 16 A por el térmico. Los cables de 2,5 mm² quedan protegidos.', { accion: 'sobrecarga' }),
      P('Provoca un cortocircuito', 'Conecta al enchufe el aparato averiado: el PIA salta al instante por el magnético.', { accion: 'corto' }),
    ] },
  { id: 'vp2', n: 2, proy: 'luz', icon: 'lightbulb', title: 'Punto de luz con interruptor simple', sub: 'Una lámpara mandada por un interruptor, con caja de registro y conectores.',
    level: 'Iniciación', duration: '1 h', norma: 'ITC-BT-19 y ITC-BT-25 (C1)', circuito: 'C1 · PIA 10 A · 1,5 mm² · tubo Ø16',
    intro: 'El interruptor corta siempre la FASE. La fase y el neutro llegan del C1 a la caja de registro; la fase va al interruptor y vuelve como retorno a la lámpara.',
    pasos: [
      P('Fase y neutro del C1 a la caja', 'Marrón y azul de 1,5 mm² desde la salida del C1 hasta los conectores 1 y 2 de la caja.', { cables: ['f', 'n'] }),
      P('Cablea el interruptor', 'Fase del conector 1 al borne L del interruptor; del borne 1 sale el retorno (negro) al conector 3.', { cables: ['fi', 'r1'] }),
      P('Cablea el portalámparas', 'Retorno negro al contacto central (L) y neutro azul a la rosca (N).', { cables: ['r2', 'n2'] }),
      P('Da tensión y pruébalo', 'Pon los marcos, enchufa la manguera y acciona el interruptor: la lámpara enciende y apaga.', { accion: 'red' }),
    ] },
  { id: 'vp3', n: 3, proy: 'conmutada', icon: 'repeat', title: 'Conmutada: una luz desde dos sitios', sub: 'Dos conmutadores mandan la misma lámpara, como en un pasillo.',
    level: 'Básico', duration: '1–2 h', norma: 'ITC-BT-25 (C1)', circuito: 'C1 · PIA 10 A · 1,5 mm²',
    intro: 'La fase entra por el común del primer conmutador; los dos viajeros unen los conmutadores y del común del segundo sale el retorno a la lámpara.',
    pasos: [
      P('Fase al común del conmutador 1', 'Fase y neutro del C1 a la caja; de la fase, un marrón al común (L) del conmutador 1.', { cables: ['f', 'n', 'c1'] }),
      P('Los viajeros', 'Une el viajero 1 con el 1 y el 2 con el 2 de los dos conmutadores, pasando por la caja.', { cables: ['v1', 'v2', 'v3', 'v4'] }),
      P('Retorno y neutro a la lámpara', 'Del común del conmutador 2, el retorno al centro del portalámparas; el neutro azul a la rosca.', { cables: ['r1', 'r2', 'n2'] }),
      P('Prueba desde los dos sitios', 'Da tensión y enciende y apaga la lámpara desde cada conmutador.', { accion: 'red' }),
    ] },
  { id: 'vp4', n: 4, proy: 'enchufe', icon: 'plug', title: 'Toma de corriente schuko 16 A con tierra', sub: 'Una base de enchufe del C2 con su toma de tierra.',
    level: 'Iniciación', duration: '1 h', norma: 'ITC-BT-25 (C2) e ITC-BT-18 (tierra)', circuito: 'C2 · PIA 16 A · 2,5 mm² · tubo Ø20',
    intro: 'La base schuko lleva fase (L), neutro (N) y tierra en las patillas laterales. Sin tierra, un aparato con fuga deja su carcasa con tensión.',
    pasos: [
      P('Fase y neutro a la base', 'Marrón al borne L y azul al borne N de la base, desde la salida del C2. 2,5 mm².', { cables: ['f', 'n'] }),
      P('La tierra', 'Amarillo-verde de la barra de tierra del cuadro al borne de tierra de la base (une las patillas laterales).', { cables: ['pe'] }),
      P('Mide la base con tensión', 'Enchufa la manguera: entre L y N hay unos 230 V.', { accion: 'red' }),
      P('Fuga a tierra', 'Conecta la lavadora con fuga a la carcasa: la tierra se la lleva y salta el diferencial.', { accion: 'fuga' }),
    ] },
  { id: 'vp5', n: 5, proy: 'luz-enchufe', vaciar: 'CE1', icon: 'box', title: 'Caja de registro con empalmes', sub: 'Elige los conectores de la caja y empalma la luz y el enchufe.',
    level: 'Básico', duration: '2 h', norma: 'ITC-BT-21 (cajas y tubos)', circuito: 'C1 10 A · 1,5 mm² y C2 16 A · 2,5 mm²',
    intro: 'Los empalmes se hacen SIEMPRE dentro de una caja de registro, nunca dentro del tubo. Se usan conectores de palanca (tipo Wago), de inserción o regletas, con tantas vías como cables.',
    pasos: [
      P('Pon los conectores en la caja', 'Selecciona la caja CE1 y coloca tres conectores de palanca en las posiciones 1, 2 y 3 (fase, neutro y retorno).', { fichas: 'CE1' }),
      P('C1: fase y neutro a la caja y el interruptor', 'Fase y neutro del C1 a los conectores 1 y 2; fase al interruptor y retorno al conector 3.', { cables: ['f', 'n', 'fi', 'r1'] }),
      P('La lámpara', 'Retorno al centro del portalámparas y neutro a la rosca.', { cables: ['r2', 'n2'] }),
      P('C2: el enchufe con tierra', 'Marrón, azul y amarillo-verde de 2,5 mm² del cuadro a la base, por su propio tubo.', { cables: ['ef', 'en', 'epe'] }),
      P('Prueba', 'Da tensión: la luz y el enchufe funcionan y cada uno sale de su PIA.', { accion: 'red' }),
    ] },
  { id: 'vp6', n: 6, proy: 'cuadro', icon: 'house', title: 'Circuito completo desde el cuadro', sub: 'Del bornero al último mecanismo: cuadro, alumbrado y enchufe.',
    level: 'Medio', duration: '3 h', norma: 'ITC-BT-25', circuito: 'IGA · ID · C1 y C2',
    intro: 'Junta todo: cablea el cuadro, el punto de luz del C1 y la base del C2. Cada circuito sale de su PIA y va por su tubo.',
    pasos: [
      P('El cuadro', 'Tierra a la barra; bornero → IGA → diferencial → C1 y C2 (entrada arriba, salida abajo).', { cables: ['mPE', 'mL', 'mN', 'gL', 'gN', 'dL', 'dN', 'pL', 'pN'] }),
      P('C1: el punto de luz', 'Del C1 a la caja; fase al interruptor, retorno y neutro a la lámpara.', { cables: ['f', 'n', 'fi', 'r1', 'r2', 'n2'] }),
      P('C2: la base con tierra', 'Del C2 a la base, con su amarillo-verde desde la barra de tierra.', { cables: ['ef', 'en', 'epe'] }),
      P('Prueba con tensión', 'Enchufa la manguera, enciende la luz y prueba el botón T del diferencial.', { accion: 'test' }),
    ] },
  { id: 'vp7', n: 7, proy: 'cruzamiento', icon: 'shuffle', title: 'Cruzamiento: una luz desde tres sitios', sub: 'Conmutador, cruzamiento y conmutador mandan la misma lámpara.',
    level: 'Medio', duration: '2 h', norma: 'ITC-BT-25 (C1)', circuito: 'C1 · PIA 10 A · 1,5 mm²',
    intro: 'El cruzamiento va entre los dos conmutadores: los viajeros del primero entran por E1 y E2, y salen por S1 y S2 hacia el segundo.',
    pasos: [
      P('Fase al común del conmutador 1', 'Fase y neutro a la caja; marrón de la fase al común del conmutador 1.', { cables: ['f', 'n', 'c1'] }),
      P('Viajeros por el cruzamiento', 'Viajeros del conmutador 1 a las entradas E1 y E2 del cruzamiento; de las salidas S1 y S2, al conmutador 2.', { cables: ['v1', 'v2', 'v3', 'v4'] }),
      P('Retorno y neutro a la lámpara', 'Del común del conmutador 2 al centro del portalámparas; neutro a la rosca.', { cables: ['r1', 'r2', 'n2'] }),
      P('Prueba desde los tres sitios', 'Da tensión y acciona cada mecanismo.', { accion: 'red' }),
    ] },
];
export const practica = (id) => PRACTICAS.find((p) => p.id === id) || null;
export const proyDe = (Pr) => proyecto(Pr.proy);
export const ACCIONES = { red: 'Con tensión y sin disparos', test: 'Salta el diferencial con T', sobrecarga: 'Salta el PIA por sobrecarga', corto: 'Salta el PIA por cortocircuito', fuga: 'Salta el diferencial por la fuga' };

// Cables que el alumno no tiene que tirar (los da hechos el montaje de partida)
function hechos(Pr) { if (Pr.base === 'cuadro') { const ids = new Set(Pr.pasos.flatMap((s) => s.cables || [])); return (c) => !ids.has(c.id); } return () => false; }
// Montaje de partida: piezas, tubos y aparamenta colocados; sin los cables de la práctica
// PIAs C3, C4 y C5 montados en el carril (como en un cuadro real de electrificación básica), sin cablear en esta práctica
const RESERVA = [['C3', 25, 6, 'cocina y horno'], ['C4', 20, 7, 'lavadora y termo'], ['C5', 16, 8, 'baño y cocina']];
export function conReserva(Pr, m) {
  if (!Pr?.reserva || !m?.parts) return m; const q = m.parts.find((p) => p.type === 'cuadro'); if (!q) return m;
  const usados = new Set(); for (const p of m.parts) if (p.cuadro === q.id && TIPOS[p.type]?.modulo) for (let i = 0; i < (TIPOS[p.type].mods || 1); i++) usados.add((p.slot ?? 0) + i);
  for (const [id, In, slot, uso] of RESERVA) if (!m.parts.some((p) => p.id === id) && !usados.has(slot)) { m.parts.push({ id, type: 'mt', nombre: `${id} ${In} A (${uso})`, cuadro: q.id, slot, on: true, In, curva: 'C', circ: id }); usados.add(slot); }
  return m;
}
export function modeloInicial(Pr) {
  const m = solucion(proyDe(Pr)); const queda = hechos(Pr); m.cables = m.cables.filter(queda); m.proyecto = proyDe(Pr).id; m.practica = Pr.id;
  if (Pr.vaciar) { const c = partePorId(m, Pr.vaciar); if (c) c.fichas = {}; }
  return sanear(conReserva(Pr, m));
}
export const modeloSolucion = (Pr) => { const m = solucion(proyDe(Pr)); m.practica = Pr.id; return sanear(conReserva(Pr, m)); };
const igual = (a, b) => a.p === b.p && a.t === b.t;
const mismoColor = (x, y) => x === y || (COLORES[x]?.clase === 'fase' && COLORES[y]?.clase === 'fase');
// ¿Está el cable c de la solución en el montaje m? (mismos bornes, color de la misma clase y misma sección)
export function cableHecho(m, c) {
  return m.cables.some((w) => ((igual(w.a, c.a) && igual(w.b, c.b)) || (igual(w.a, c.b) && igual(w.b, c.a))) && mismoColor(w.color, c.color) && +w.sec === +c.sec);
}
// Texto de un cable de la solución: «Marrón 1,5 mm²: C1 · L → CE1 · B1»
export function textoCable(m, c) { return `${COLORES[c.color]?.n || c.color} ${fmtSec(c.sec)}: ${nombreBorne(m, c.a)} → ${nombreBorne(m, c.b)}`; }
// Estado de los pasos de la guiada. hechosAcc: { red, test, sobrecarga, corto, fuga } vistos en el simulador.
export function estadoPasos(Pr, m, hechosAcc = {}) {
  const sol = modeloSolucion(Pr); const porId = new Map(sol.cables.map((c) => [c.id, c]));
  let antes = true;
  return Pr.pasos.map((s, i) => {
    let ok = false, faltan = [];
    if (s.cables) { const cs = s.cables.map((id) => porId.get(id)).filter(Boolean); faltan = cs.filter((c) => !cableHecho(m, c)).map((c) => textoCable(sol, c)); ok = !faltan.length; }
    else if (s.fichas) { const p = partePorId(m, s.fichas); ok = !!p && ['B1', 'B2', 'B3'].every((b) => p.fichas?.[b]); }
    else if (s.accion) ok = !!hechosAcc[s.accion];
    const r = { i, ok: ok && antes, okSolo: ok, faltan }; if (!ok) antes = false; return r;
  });
}
// Corrección final (guiada y autónoma): funciona en todas las posiciones y cumple las normas
export function comprobarPractica(Pr, m, opts = {}) { return comprobarProyecto(proyDe(Pr), m, opts); }
export { TIPOS, clone };

// Motor «Encuentra la avería» (EEE): un montaje del laboratorio de Circuitos con una avería escondida
// (componente abierto, en corto, con otro valor o cable cortado). El alumno simula, mide con el polímetro,
// señala el elemento averiado y el tipo de avería. El montaje es el JSON que exporta Circuitos.
import { registrarMotor } from '../elemento.js';
import { texto, lista, numero, esTexto } from './comun.js';

export const TIPOS_AVERIA = { abierto: 'Abierto o fundido: no deja pasar la corriente', corto: 'En cortocircuito: une sus patas como un cable', valor: 'Valor distinto del que indica', cable: 'Cable cortado por dentro' };
export function leerMontaje(m) {
  let o = m; if (esTexto(m)) { try { o = JSON.parse(m); } catch (e) { return null; } }
  if (o && o.model) o = o.model; // archivo exportado por Circuitos { app, version, model }
  if (!o || !Array.isArray(o.parts) || !Array.isArray(o.wires)) return null;
  return { parts: o.parts, wires: o.wires };
}
export function validarAveria(c, err) {
  const montaje = leerMontaje(c.montaje);
  if (!montaje) err('montaje', '«montaje» tiene que ser el circuito exportado desde el laboratorio de Circuitos (con «parts» y «wires»).');
  const txt = montaje ? JSON.stringify(montaje) : '';
  if (txt.length > 60000) err('montaje', 'El montaje es demasiado grande (máx. 60 000 caracteres).');
  const a = c.averia || {}; const o = { enunciado: texto(c.enunciado, 'enunciado', err, { max: 2000, nombre: 'enunciado' }), montaje: txt,
    pistas: lista(c.pistas, 'pistas', err, { max: 6, nombre: 'pistas' }).map((p, i) => texto(p, `pistas[${i}]`, err, { max: 400, nombre: 'pista' })).filter(Boolean),
    explicacion: texto(c.explicacion, 'explicacion', err, { max: 1500, nombre: 'explicacion' }) };
  if (!TIPOS_AVERIA[a.tipo]) { err('averia.tipo', `«averia.tipo» tiene que ser ${Object.keys(TIPOS_AVERIA).map((k) => `"${k}"`).join(', ')}.`); return o; }
  if (!esTexto(a.elemento) || !a.elemento) { err('averia.elemento', 'Falta «averia.elemento» (el id del componente, p. ej. "R1", o del cable, p. ej. "w3").'); return o; }
  if (montaje) {
    const parte = montaje.parts.find((p) => p.id === a.elemento); const cable = montaje.wires.find((w) => w.id === a.elemento);
    if (!parte && !cable) err('averia.elemento', `No hay ningún componente ni cable «${a.elemento}» en el montaje.`);
    else if (a.tipo === 'cable' && !cable) err('averia.tipo', 'El tipo "cable" es solo para cables.');
    else if (a.tipo !== 'cable' && cable) err('averia.tipo', 'En un cable la avería tiene que ser "cable".');
    else if (a.tipo === 'valor' && parte?.type !== 'resistor') err('averia.tipo', 'El tipo "valor" es solo para resistencias.');
    else if (parte?.type === 'meter') err('averia.elemento', 'El polímetro no puede ser el elemento averiado.');
  }
  o.averia = { elemento: a.elemento, tipo: a.tipo };
  if (a.tipo === 'valor') o.averia.valor = numero(a.valor, 'averia.valor', err, { min: 0.1, max: 1e7, obligatorio: true, nombre: 'valor' });
  return o;
}
// resp: { elemento, tipo } → aciertos sobre 2 (elemento y tipo)
export function evaluarAveria(av, resp) {
  const el = !!resp && resp.elemento === av.elemento; const ti = el && resp.tipo === av.tipo;
  return { elemento: el, tipo: ti, a: (el ? 1 : 0) + (ti ? 1 : 0), t: 2 };
}

registrarMotor('averia', {
  nombre: 'Encuentra la avería', validar: validarAveria, entregable: true,
  resumen: (c) => { const m = leerMontaje(c.montaje); return `circuito con ${m ? m.parts.length : 0} componentes y ${m ? m.wires.length : 0} cables · avería oculta`; },
  ejemplo: {
    enunciado: 'El LED no se enciende. Inicia la simulación, mide con el polímetro y señala qué elemento está averiado.',
    montaje: { parts: [{ id: 'B1', type: 'bat9', pos: [-23, -5], rot: 0, props: {}, state: {} }, { id: 'R1', type: 'resistor', at: 'b10', rot: 0, props: { r: 470 }, state: {} }, { id: 'L1', type: 'led', at: 'e14', rot: 0, props: { color: 'rojo' }, state: {} }, { id: 'M1', type: 'meter', pos: [27, 0], rot: 0, props: { mode: 'V', jack: 'VΩmA' }, state: {} }],
      wires: [{ id: 'w1', a: 'p:B1:+', b: 'h:tp2', color: 'rojo' }, { id: 'w2', a: 'p:B1:-', b: 'h:tn2', color: 'negro' }, { id: 'w3', a: 'h:tp9', b: 'h:a10', color: 'rojo' }, { id: 'w4', a: 'h:a15', b: 'h:tn15', color: 'negro' }] },
    averia: { elemento: 'R1', tipo: 'abierto' },
    pistas: ['Mide la tensión en cada componente: el que se queda con toda la tensión de la pila está abierto.'],
    explicacion: 'La resistencia R1 está abierta: entre sus patas hay los 9 V de la pila y no circula corriente.',
  },
});

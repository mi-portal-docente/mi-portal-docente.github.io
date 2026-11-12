// Descripciones en lenguaje claro de cada punto de conexión
const ROWDESC = {
  S: 'pin <b>S</b> (base azul, fila junto al conector azul superior)',
  V: 'pin <b>V</b> (base roja, fila del medio)',
  G: 'pin <b>G</b> (base negra, fila más cercana al centro de la placa)',
};
const POWER_POS = { '0': '1º', '5V': '2º', 'RST': '3º', '3V3': '4º', '5V_2': '5º', 'GND': '6º', 'GND_2': '7º', 'VIN': '8º' };
export function boardDesc(ref) {
  let m;
  if ((m = ref.match(/^D(\d+)\.(S|V|G)$/))) return `${ROWDESC[m[2]]} de la columna <b>GPIO ${m[1]}</b>`;
  if ((m = ref.match(/^A(\d+)\.(S|V|G)$/))) {
    const c = { G: 'pin <b>G</b> (base negra, columna izquierda)', V: 'pin <b>3V3</b> (base roja, columna central)', S: 'pin <b>S</b> (base azul, columna derecha)' }[m[2]];
    return `${c} de la fila <b>${m[1]}</b> del bloque <b>ANALOG</b>`;
  }
  if ((m = ref.match(/^I(\d)\.(G|V|SDA|SCL)$/))) {
    const c = { G: 'pin <b>G</b> (base negra)', V: 'pin <b>V</b> (base roja)', SDA: 'pin <b>SDA</b> (base azul)', SCL: 'pin <b>SCL</b> (base blanca)' }[m[2]];
    return `${c} de la <b>fila ${m[1]}</b> del bloque <b>I2C</b>`;
  }
  if ((m = ref.match(/^P\.(.+)$/))) { const n = m[1].replace('_2', ''); return `agujero <b>${n}</b> del conector azul inferior <b>POWER</b> (el ${POWER_POS[m[1]]} empezando por la izquierda)`; }
  if (ref === 'DC') return 'el <b>jack DC</b> de la placa (esquina inferior izquierda)';
  return ref;
}
export function boardShort(ref) {
  let m;
  if ((m = ref.match(/^D(\d+)\.(S|V|G)$/))) return `GPIO ${m[1]} · ${m[2]}`;
  if ((m = ref.match(/^A(\d+)\.(S|V|G)$/))) return `ANALOG ${m[1]} · ${m[2] === 'V' ? '3V3' : m[2]}`;
  if ((m = ref.match(/^I(\d)\.(.+)$/))) return `I2C fila ${m[1]} · ${m[2]}`;
  if ((m = ref.match(/^P\.(.+)$/))) return `POWER · ${m[1].replace('_2', '')}`;
  if (ref === 'DC') return 'Jack DC';
  return ref;
}
export const COLOR_NAME = { negro: 'NEGRO', rojo: 'ROJO', amarillo: 'AMARILLO', verde: 'VERDE', azul: 'AZUL', blanco: 'BLANCO', naranja: 'NARANJA', marron: 'MARRÓN', morado: 'MORADO', gris: 'GRIS' };

// Catálogo de componentes del laboratorio de circuitos: pines, propiedades y modelo eléctrico (puro, sin three.js).
export const BAND_COLORS = ['negro', 'marrón', 'rojo', 'naranja', 'amarillo', 'verde', 'azul', 'violeta', 'gris', 'blanco'];
export const BAND_HEX = ['#1b1b1b', '#7a4520', '#d22424', '#f07a10', '#f4cf1a', '#1f9d3a', '#1f5fd6', '#8a3ab9', '#8d9399', '#f4f4f4'];
export const E12 = [10, 22, 33, 47, 68, 100, 150, 220, 330, 470, 560, 680, 1000, 1500, 2200, 3300, 4700, 6800, 10000, 22000, 47000, 100000, 220000, 470000, 1000000];
export const LED_COLORS = { rojo: { vf: 1.8, hex: '#ff2a2a', glow: 0xff3020 }, amarillo: { vf: 2.0, hex: '#ffd21a', glow: 0xffc000 }, verde: { vf: 2.1, hex: '#2bd94f', glow: 0x30ff60 }, azul: { vf: 3.0, hex: '#2f7bff', glow: 0x3070ff }, blanco: { vf: 3.0, hex: '#f2f6ff', glow: 0xe8f0ff } };
export const WIRE_COLORS = [
  ['negro', '#1e1e1e'], ['marrón', '#7a4a24'], ['rojo', '#d62020'], ['naranja', '#f07a10'], ['amarillo', '#f2c200'],
  ['verde', '#1f9d3a'], ['azul', '#1f5fd6'], ['morado', '#8a3ab9'], ['gris', '#8a8f96'], ['blanco', '#eeeeee'],
];
export const WIRE_HEX = Object.fromEntries(WIRE_COLORS);

// Formato de números en español con prefijos SI
export function fmtNum(v, dec = 3) {
  if (!isFinite(v)) return '—';
  const a = Math.abs(v); let s;
  if (a >= 100) s = v.toFixed(0); else if (a >= 10) s = v.toFixed(Math.min(1, dec)); else s = v.toFixed(Math.min(2, dec));
  return s.replace('.', ',').replace(/^-0(,0+)?$/, '0$1');
}
export function fmtSI(v, unit) {
  const a = Math.abs(v);
  if (a === 0 || !isFinite(v)) return (isFinite(v) ? '0 ' : '— ') + unit;
  const pre = [[1e6, 'M'], [1e3, 'k'], [1, ''], [1e-3, 'm'], [1e-6, 'µ']];
  for (const [f, p] of pre) if (a >= f * 0.9995) return fmtNum(v / f) + ' ' + p + unit;
  return fmtNum(v / 1e-6) + ' µ' + unit;
}
export const fmtOhm = (r) => fmtSI(r, 'Ω');

export function resistorBands(r) {
  // 4 bandas: 2 cifras + multiplicador + tolerancia (oro, ±5 %)
  let exp = Math.floor(Math.log10(r)) - 1, sig = Math.round(r / Math.pow(10, exp));
  if (sig >= 100) { sig = Math.round(sig / 10); exp++; }
  const d1 = Math.floor(sig / 10), d2 = sig % 10;
  const mult = exp; // -2..9
  const multName = mult === -1 ? 'oro' : mult === -2 ? 'plata' : BAND_COLORS[mult];
  const multHex = mult === -1 ? '#c9a23a' : mult === -2 ? '#c0c0c0' : BAND_HEX[mult];
  return { names: [BAND_COLORS[d1], BAND_COLORS[d2], multName, 'oro'], hex: [BAND_HEX[d1], BAND_HEX[d2], multHex, '#c9a23a'], value: sig * Math.pow(10, exp) };
}

const ldrR = (light) => Math.pow(10, 6 - 3.3 * Math.max(0, Math.min(1, light))); // 1 MΩ (oscuro) … 500 Ω (mucha luz)
export { ldrR };

// pins: [id, dx, dz] en pasos (piezas de protoboard) · terminales [id, dx, dz, y] (piezas de mesa)
// sym: permutaciones de pines equivalentes (para la comprobación de topología)
export const PARTS = {
  resistor: {
    name: 'Resistencia', cat: 'Básicos', board: true, pins: [['1', 0, 0], ['2', 4, 0]], perms: [['1', '2'], ['2', '1']],
    props: { r: 220 }, desc: 'Limita la corriente. Se elige con el código de colores. No tiene polaridad: da igual el sentido.',
    ui: [{ k: 'r', label: 'Resistencia', type: 'res' }],
    sig: (p) => 'resistor:' + p.props.r,
    label: (p) => 'Resistencia ' + fmtOhm(p.props.r),
    pinNames: { 1: 'pata 1', 2: 'pata 2' }, pinDesc: { 1: 'Sin polaridad: vale cualquier sentido.', 2: 'Sin polaridad: vale cualquier sentido.' },
    els: (p, T) => [{ k: 'R', id: p.id, a: T('1'), b: T('2'), r: p.props.r }],
  },
  led: {
    name: 'LED', cat: 'Básicos', board: true, pins: [['a', 0, 0], ['k', 1, 0]], perms: [['a', 'k']],
    props: { color: 'rojo' }, desc: 'Diodo que emite luz. Tiene polaridad: pata larga (ánodo, +) y pata corta (cátodo, −, lado plano de la cápsula). Necesita resistencia.',
    ui: [{ k: 'color', label: 'Color', type: 'select', options: Object.keys(LED_COLORS) }],
    sig: (p) => 'led:' + p.props.color,
    label: (p) => 'LED ' + p.props.color,
    pinNames: { a: 'ánodo (+, pata larga)', k: 'cátodo (−, pata corta)' },
    pinDesc: { a: 'Va hacia el + (a través de la resistencia).', k: 'Va hacia el −. Está en el lado plano de la cápsula.' },
    els: (p, T, st) => st.burnt ? [] : [{ k: 'D', id: p.id, a: T('a'), b: T('k'), vf: LED_COLORS[p.props.color].vf, ron: 15 }],
  },
  rgb: {
    name: 'LED RGB', cat: 'Básicos', board: true, pins: [['r', 0, 0], ['com', 1, 0], ['g', 2, 0], ['b', 3, 0]], perms: [['r', 'com', 'g', 'b']],
    props: { common: 'cátodo' }, desc: 'Tres LED (rojo, verde y azul) en una cápsula con una pata común, la más larga. Cátodo común: la común va al −. Ánodo común: la común va al +. Cada color necesita su resistencia.',
    ui: [{ k: 'common', label: 'Pata común', type: 'select', options: ['cátodo', 'ánodo'], fmt: (v) => v === 'cátodo' ? 'Cátodo común (al −)' : 'Ánodo común (al +)' }],
    sig: (p) => 'rgb:' + p.props.common, label: (p) => 'LED RGB (' + p.props.common + ' común)',
    pinNames: { r: 'R (rojo)', com: 'común (pata más larga)', g: 'G (verde)', b: 'B (azul)' },
    pinDesc: { r: 'Ánodo o cátodo del LED rojo.', com: 'Cátodo común → al −  ·  ánodo común → al +.', g: 'Del LED verde.', b: 'Del LED azul.' },
    els: (p, T, st) => { if (st.burnt) return []; const cc = p.props.common !== 'ánodo'; return [['r', 1.9], ['g', 2.9], ['b', 3.0]].map(([c, vf]) => cc ? { k: 'D', id: p.id + ':' + c, a: T(c), b: T('com'), vf, ron: 15 } : { k: 'D', id: p.id + ':' + c, a: T('com'), b: T(c), vf, ron: 15 }); },
  },
  diode: {
    name: 'Diodo 1N4007', cat: 'Básicos', board: true, pins: [['a', 0, 0], ['k', 4, 0]], perms: [['a', 'k']],
    props: {}, desc: 'Deja pasar la corriente en un solo sentido (de ánodo a cátodo; la franja gris es el cátodo). Se usa como protección (diodo de libre circulación en relés y motores).',
    sig: () => 'diode', label: () => 'Diodo 1N4007', pinNames: { a: 'ánodo', k: 'cátodo (franja)' },
    pinDesc: { a: 'La corriente entra por aquí.', k: 'Lado de la franja: la corriente sale por aquí.' },
    els: (p, T, st) => st.burnt ? [] : [{ k: 'D', id: p.id, a: T('a'), b: T('k'), vf: 0.7, ron: 0.3 }],
  },
  bulb: {
    name: 'Bombilla 6 V', cat: 'Básicos', board: true, pins: [['1', 0, 0], ['2', 2, 0]], perms: [['1', '2'], ['2', '1']],
    props: {}, desc: 'Bombilla de incandescencia de 6 V / 0,1 A (0,6 W) con portalámparas de patas. Sin polaridad.',
    sig: () => 'bulb', label: () => 'Bombilla 6 V', vnom: 6, pnom: 0.6, pinNames: { 1: 'contacto 1', 2: 'contacto 2' },
    els: (p, T, st) => st.burnt ? [] : [{ k: 'R', id: p.id, a: T('1'), b: T('2'), r: 60 }],
  },
  cap: {
    name: 'Condensador', cat: 'Básicos', board: true, pins: [['p', 0, 0], ['n', 1, 0]], perms: [['p', 'n']],
    props: { c: 470 }, desc: 'Almacena carga. Electrolítico: la pata larga es el + y la franja de la cápsula marca el −. En el simulador se carga y descarga de forma simplificada.',
    ui: [{ k: 'c', label: 'Capacidad', type: 'select', options: [100, 470, 1000, 2200], fmt: (v) => v + ' µF' }],
    sig: (p) => 'cap:' + p.props.c, label: (p) => 'Condensador ' + p.props.c + ' µF', pinNames: { p: '+ (pata larga)', n: '− (franja)' },
    pinDesc: { p: 'Al punto de más tensión.', n: 'Al −. Conectado al revés se puede hinchar o reventar.' },
    els: (p, T) => [{ k: 'C', id: p.id, a: T('p'), b: T('n'), c: p.props.c * 1e-6 }, { k: 'R', id: p.id + ':leak', a: T('p'), b: T('n'), r: 5e6 }],
  },
  // ---- control ----
  tact: {
    name: 'Pulsador (4 patas)', cat: 'Control', board: true, pins: [['1', 0, 0], ['2', 0, 3], ['3', 2, 0], ['4', 2, 3]],
    perms: [['1', '2', '3', '4'], ['2', '1', '4', '3'], ['3', '4', '1', '2'], ['4', '3', '2', '1']],
    props: {}, desc: 'Pulsador de 6×6 mm normalmente abierto. Tiene 4 patas unidas por dentro de dos en dos: 1 con 2 y 3 con 4 (las que están enfrentadas a ambos lados del canal central). Al pulsar se unen los dos pares. Conecta el circuito en patas de pares distintos (por ejemplo, en diagonal).',
    sig: () => 'tact', label: (p) => 'Pulsador' + (p.state?.pressed ? ' (pulsado)' : ''), interactive: 'press',
    pinNames: { 1: 'pata 1 (par A)', 2: 'pata 2 (par A)', 3: 'pata 3 (par B)', 4: 'pata 4 (par B)' },
    pinDesc: { 1: 'Unida siempre con la pata 2.', 2: 'Unida siempre con la pata 1.', 3: 'Unida siempre con la pata 4.', 4: 'Unida siempre con la pata 3.' },
    internal: () => [['1', '2'], ['3', '4']],
    merges: (p) => p.state?.pressed ? [['1', '3']] : [], els: () => [],
  },
  slide: {
    name: 'Interruptor deslizante (3 patas)', cat: 'Control', board: true, pins: [['1', 0, 0], ['c', 1, 0], ['2', 2, 0]], perms: [['1', 'c', '2'], ['2', 'c', '1']],
    props: {}, desc: 'Interruptor de corredera SS12D00 con 3 patas: la central es el común (C) y se une con la pata 1 o con la pata 2 según la posición. Para encender y apagar algo usa el común y UNA de las patas de los extremos: con las dos de los extremos nunca se cierra el circuito.',
    sig: () => 'slide', label: (p) => 'Interruptor deslizante (C–' + (p.state?.pos ? '2' : '1') + ')', interactive: 'toggle',
    pinNames: { 1: 'pata 1 (extremo)', c: 'común C (centro)', 2: 'pata 2 (extremo)' },
    pinDesc: { 1: 'Se une con el común cuando la palanca está hacia la pata 1.', c: 'Entrada/salida común: siempre se usa.', 2: 'Se une con el común cuando la palanca está hacia la pata 2.' },
    merges: (p) => p.state?.pos ? [['c', '2']] : [['c', '1']], els: () => [],
  },
  spdt: {
    name: 'Conmutador de palanca (3 patas)', cat: 'Control', board: true, pins: [['1', 0, 0], ['c', 1, 0], ['2', 2, 0]], perms: [['1', 'c', '2'], ['2', 'c', '1']],
    props: {}, desc: 'Conmutador de palanca SPDT: la pata central (común) se conecta con la izquierda o con la derecha. Dos conmutadores sirven para encender una luz desde dos puntos (como en un pasillo).',
    sig: () => 'spdt', label: (p) => 'Conmutador (C–' + (p.state?.pos ? '2' : '1') + ')', interactive: 'toggle',
    pinNames: { 1: 'extremo 1', c: 'común (centro)', 2: 'extremo 2' },
    pinDesc: { 1: 'Se une con el común en la posición 1.', c: 'Común: siempre conectado.', 2: 'Se une con el común en la posición 2.' },
    merges: (p) => p.state?.pos ? [['c', '2']] : [['c', '1']], els: () => [],
  },
  pot: {
    name: 'Potenciómetro', cat: 'Control', board: true, pins: [['1', 0, 0], ['w', 1, 0], ['2', 2, 0]], perms: [['1', 'w', '2'], ['2', 'w', '1']],
    props: { r: 10000 }, desc: 'Resistencia variable de 3 patas. Entre los extremos 1 y 2 siempre hay el valor total; la central (cursor) recorre la pista al girar el mando.',
    ui: [{ k: 'r', label: 'Valor total', type: 'select', options: [1000, 4700, 10000, 47000, 100000], fmt: fmtOhm }, { k: 'pos', label: 'Posición del mando', type: 'range', state: true, live: true }],
    sig: (p) => 'pot:' + p.props.r, label: (p) => 'Potenciómetro ' + fmtOhm(p.props.r), interactive: 'knob',
    pinNames: { 1: 'extremo 1', w: 'cursor (centro)', 2: 'extremo 2' },
    pinDesc: { 1: 'Un extremo de la pista resistiva.', w: 'Cursor: su resistencia a cada extremo cambia al girar.', 2: 'El otro extremo de la pista.' },
    els: (p, T) => { const x = p.state?.pos ?? 0.5, R = p.props.r; return [{ k: 'R', id: p.id + ':1w', a: T('1'), b: T('w'), r: Math.max(1, R * x) }, { k: 'R', id: p.id + ':w2', a: T('w'), b: T('2'), r: Math.max(1, R * (1 - x)) }]; },
  },
  relay: {
    name: 'Relé 5 V', cat: 'Control', board: true, pins: [['b1', 0, 0], ['com', 4, 0], ['b2', 0, 3], ['nc', 2, 3], ['no', 4, 3]],
    perms: [['b1', 'com', 'b2', 'nc', 'no'], ['b2', 'com', 'b1', 'nc', 'no']],
    props: {}, desc: 'Interruptor que se acciona con un electroimán. Bobina (patas B1 y B2, ≈70 Ω, se activa con unos 3,5 V). Contactos: COM se une con NC (normalmente cerrado) en reposo y con NO (normalmente abierto) cuando la bobina recibe corriente. Pon un diodo en paralelo con la bobina (cátodo al +) para protegerlo.',
    sig: () => 'relay', label: () => 'Relé 5 V', pinNames: { b1: 'bobina B1', b2: 'bobina B2', com: 'COM (común)', nc: 'NC (normalmente cerrado)', no: 'NO (normalmente abierto)' },
    pinDesc: { b1: 'Un extremo de la bobina (circuito de mando).', b2: 'El otro extremo de la bobina.', com: 'Contacto móvil: al + del circuito de potencia.', nc: 'Unido con COM en reposo.', no: 'Unido con COM cuando el relé está activado.' },
    merges: (p, st) => st?.on ? [['com', 'no']] : [['com', 'nc']],
    els: (p, T) => [{ k: 'R', id: p.id + ':coil', a: T('b1'), b: T('b2'), r: 70 }],
    iterate: (p, st, s) => { const i = Math.abs(s.I(p.id + ':coil')); const on = st.on ? i > 0.021 : i > 0.05; if (on !== !!st.on) { st.on = on; return true; } return false; },
  },
  npn: {
    name: 'Transistor NPN BC547', cat: 'Control', board: true, pins: [['c', 0, 0], ['b', 1, 0], ['e', 2, 0]], perms: [['c', 'b', 'e']],
    props: { hfe: 200 }, desc: 'Transistor bipolar NPN. Mirando la cara plana con las patas hacia abajo: C (colector), B (base), E (emisor). Una corriente pequeña en la base (con resistencia) controla una corriente grande de colector a emisor: Ic = β · Ib, hasta que se satura.',
    ui: [{ k: 'hfe', label: 'Ganancia β (hFE)', type: 'select', options: [100, 200, 300] }],
    sig: () => 'npn', label: () => 'Transistor NPN BC547', pinNames: { c: 'C · colector', b: 'B · base', e: 'E · emisor' },
    pinDesc: { c: 'Hacia la carga (LED, relé, motor).', b: 'Control: siempre con una resistencia (1 kΩ – 10 kΩ).', e: 'Al −.' },
    els: (p, T, st) => {
      if (st.burnt) return [];
      const out = [{ k: 'D', id: p.id + ':be', a: T('b'), b: T('e'), vf: 0.65, ron: 25 }, { k: 'R', id: p.id + ':leak', a: T('c'), b: T('e'), r: 1e8 }];
      if (st.sat) out.push({ k: 'D', id: p.id + ':ce', a: T('c'), b: T('e'), vf: 0.12, ron: 3 });
      else if ((st.ib || 0) > 0) out.push({ k: 'I', id: p.id + ':ce', a: T('e'), b: T('c'), i: (+p.props.hfe || 200) * st.ib });
      return out;
    },
    iterate: (p, st, s) => {
      const ib = Math.max(0, s.I(p.id + ':be')); const hfe = +p.props.hfe || 200; let ch = false;
      if (st.sat) { const ic = s.I(p.id + ':ce'); if (ic > hfe * ib * 1.001 + 1e-7) { st.sat = false; ch = true; } }
      else if (ib > 1e-7 && s.V('c') - s.V('e') < 0.12) { st.sat = true; ch = true; }
      if (Math.abs((st.ib || 0) - ib) > Math.max(1e-8, ib * 1e-3)) { st.ib = ib; ch = true; }
      return ch;
    },
  },
  // ---- sensores ----
  ldr: {
    name: 'LDR', cat: 'Sensores', board: true, pins: [['1', 0, 0], ['2', 1, 0]], perms: [['1', '2'], ['2', '1']],
    props: {}, desc: 'Resistencia que depende de la luz: con mucha luz baja (≈500 Ω) y a oscuras sube (≈1 MΩ). Sin polaridad.',
    ui: [{ k: 'light', label: 'Luz que recibe', type: 'range', state: true, live: true }],
    sig: () => 'ldr', label: () => 'LDR', interactive: 'light', pinNames: { 1: 'pata 1', 2: 'pata 2' },
    els: (p, T) => [{ k: 'R', id: p.id, a: T('1'), b: T('2'), r: ldrR(p.state?.light ?? 0.5) }],
  },
  // ---- salidas ----
  buzzer: {
    name: 'Zumbador', cat: 'Salidas', board: true, pins: [['p', 0, 0], ['n', 2, 0]], perms: [['p', 'n']],
    props: { tipo: 'activo' }, desc: 'Zumbador de 12 mm con polaridad (+ marcado en la carcasa y pata larga). Activo: lleva su oscilador y suena con tensión continua. Pasivo: es solo un altavoz pequeño; con continua no suena, necesita una señal que oscile (por ejemplo tone() en el ESP32).',
    ui: [{ k: 'tipo', label: 'Tipo', type: 'select', options: ['activo', 'pasivo'], fmt: (v) => v === 'activo' ? 'Activo (con oscilador)' : 'Pasivo (necesita señal)' }],
    sig: (p) => 'buzzer:' + (p.props.tipo || 'activo'), label: (p) => 'Zumbador ' + (p.props.tipo || 'activo'), pinNames: { p: '+ (pata larga)', n: '−' },
    pinDesc: { p: 'Al + (lado marcado con + en la etiqueta).', n: 'Al −.' },
    els: (p, T) => p.props.tipo === 'pasivo' ? [{ k: 'R', id: p.id, a: T('p'), b: T('n'), r: 42 }] : [{ k: 'D', id: p.id, a: T('p'), b: T('n'), vf: 1.5, ron: 200 }],
  },
  // ---- piezas de mesa (se cablean a sus terminales) ----
  bat9: {
    name: 'Pila 9 V', cat: 'Alimentación', board: false, size: [10.6, 7], pins: [['+', -2.4, 0, 19.6], ['-', 2.4, 0, 19.6]], perms: [['+', '-']],
    props: {}, desc: 'Pila de 9 V (resistencia interna ≈1,5 Ω). El borne pequeño redondo es el +; el hexagonal, el −. Se conecta con pinzas de cocodrilo (por ejemplo, cable cocodrilo-macho hasta la protoboard).',
    sig: () => 'bat9', label: () => 'Pila 9 V', source: true, pinNames: { '+': 'borne + (redondo)', '-': 'borne − (hexagonal)' }, sockets: { '+': 'lug', '-': 'lug' },
    els: (p, T) => [{ k: 'V', id: p.id, a: T('+'), b: T('-'), v: 9, rint: 1.5 }],
  },
  aa2: {
    name: 'Portapilas 2×AA (3 V)', cat: 'Alimentación', board: false, size: [13, 22], pins: [['+', -2.2, -9.2, 6.6], ['-', 2.2, -9.2, 6.6]], perms: [['+', '-']],
    props: {}, desc: 'Dos pilas AA de 1,5 V en serie: 3 V. Sus cables rojo y negro acaban en punta estañada: ponles una hembra Dupont (cable macho-hembra hasta la protoboard) o una pinza de cocodrilo.',
    sig: () => 'aa2', label: () => 'Portapilas 2×AA', source: true, pinNames: { '+': 'cable rojo (+)', '-': 'cable negro (−)' }, sockets: { '+': 'lead', '-': 'lead' },
    els: (p, T) => [{ k: 'V', id: p.id, a: T('+'), b: T('-'), v: 3, rint: 0.3 }],
  },
  aa4: {
    name: 'Portapilas 4×AA (6 V)', cat: 'Alimentación', board: false, size: [25, 22], pins: [['+', -2.2, -9.2, 6.6], ['-', 2.2, -9.2, 6.6]], perms: [['+', '-']],
    props: {}, desc: 'Cuatro pilas AA de 1,5 V en serie: 6 V. Sus cables acaban en punta estañada: usa un cable macho-hembra (la hembra en la punta) o una pinza de cocodrilo.',
    sig: () => 'aa4', label: () => 'Portapilas 4×AA', source: true, pinNames: { '+': 'cable rojo (+)', '-': 'cable negro (−)' }, sockets: { '+': 'lead', '-': 'lead' },
    els: (p, T) => [{ k: 'V', id: p.id, a: T('+'), b: T('-'), v: 6, rint: 0.6 }],
  },
  usb5: {
    name: 'Fuente USB 5 V', cat: 'Alimentación', board: false, size: [12, 9], pins: [['+', 1.3, 3.2, 3.6], ['-', -1.3, 3.2, 3.6]], perms: [['+', '-']],
    props: {}, desc: 'Módulo de alimentación por USB (cargador de 5 V, máx. 0,5 A) con dos pines macho: +5 V y GND. Se lleva a la protoboard con cables macho-hembra.',
    sig: () => 'usb5', label: () => 'Fuente USB 5 V', source: true, pinNames: { '+': '+5 V (pin macho)', '-': 'GND (pin macho)' }, sockets: { '+': 'pinM', '-': 'pinM' },
    els: (p, T) => [{ k: 'V', id: p.id, a: T('+'), b: T('-'), v: 5, rint: 0.25 }],
  },
  supply: {
    name: 'Fuente de alimentación', cat: 'Alimentación', board: false, size: [20, 14], pins: [['+', 3.5, 5, 8.8], ['-', 7, 5, 8.8]], perms: [['+', '-']],
    props: { v: 5 }, desc: 'Fuente de laboratorio regulable de 0 a 12 V con bornes para clavija banana de 4 mm (también admiten pinza de cocodrilo o cable pelado).',
    ui: [{ k: 'v', label: 'Tensión (V)', type: 'number', min: 0, max: 12, step: 0.5, live: true }],
    sig: () => 'supply', label: (p) => 'Fuente ' + fmtNum(p.props.v) + ' V', source: true, pinNames: { '+': 'borne + (rojo)', '-': 'borne − (negro)' }, sockets: { '+': 'post', '-': 'post' },
    els: (p, T) => [{ k: 'V', id: p.id, a: T('+'), b: T('-'), v: +p.props.v || 0, rint: 0.05 }],
  },
  motor: {
    name: 'Motor DC', cat: 'Salidas', board: false, size: [16, 9], pins: [['1', -5.6, -1.6, 6.3], ['2', -5.6, 1.6, 6.3]], perms: [['1', '2'], ['2', '1']],
    props: {}, desc: 'Motor de corriente continua (3–6 V). Sus terminales son lengüetas: se conectan con pinzas de cocodrilo. Si inviertes los cables, gira al revés.',
    sig: () => 'motor', label: () => 'Motor DC', pinNames: { 1: 'lengüeta 1', 2: 'lengüeta 2' }, sockets: { 1: 'lug', 2: 'lug' },
    els: (p, T) => [{ k: 'R', id: p.id, a: T('1'), b: T('2'), r: 15 }],
  },
  servo: {
    name: 'Servo SG90', cat: 'Salidas', board: false, size: [14, 14], pins: [['gnd', -7.2, 4.4, 1.1], ['v', -7.2, 5.3, 1.1], ['s', -7.2, 6.2, 1.1]], perms: [['gnd', 'v', 's']],
    props: {}, desc: 'Microservo de 180° con cable de 3 hilos y conector hembra: marrón = GND (−), rojo = + (4,8–6 V), naranja = señal. Gira al ángulo que le marca la señal (pulsos de 1 a 2 ms). Aquí la señal la da el probador de servos.',
    sig: () => 'servo', label: () => 'Servo SG90', pinNames: { gnd: 'marrón · GND (−)', v: 'rojo · + (5 V)', s: 'naranja · señal' }, sockets: { gnd: 'pinF', v: 'pinF', s: 'pinF' },
    pinDesc: { gnd: 'Al − de la alimentación.', v: 'Al + (5–6 V).', s: 'Señal de control (PWM).' },
    els: (p, T) => [{ k: 'R', id: p.id, a: T('v'), b: T('gnd'), r: 120 }, { k: 'R', id: p.id + ':s', a: T('s'), b: T('gnd'), r: 20000 }],
  },
  stester: {
    name: 'Probador de servos', cat: 'Control', board: false, size: [10, 8], pins: [['in+', -3.4, -2.2, 2.6], ['in-', -3.4, -1.0, 2.6], ['gnd', 3.4, -1.2, 2.6], ['v', 3.4, 0, 2.6], ['s', 3.4, 1.2, 2.6]], perms: [['in+', 'in-', 'gnd', 'v', 's']],
    props: {}, desc: 'Genera la señal de un servo (pulsos de 1 a 2 ms) según la posición de su mando. Se alimenta con 4,8–6 V por los pines de entrada y da la alimentación y la señal al servo por los pines de salida (G, +, S).',
    ui: [{ k: 'knob', label: 'Mando (ángulo pedido)', type: 'range', state: true, live: true }],
    sig: () => 'stester', label: () => 'Probador de servos', pinNames: { 'in+': 'entrada +', 'in-': 'entrada −', gnd: 'salida G (−)', v: 'salida +', s: 'salida S (señal)' },
    sockets: { 'in+': 'pinM', 'in-': 'pinM', gnd: 'pinM', v: 'pinM', s: 'pinM' },
    internal: () => [['in+', 'v'], ['in-', 'gnd']],
    // la señal (valor medio de los pulsos: 0,25 V a 0,5 V con 5 V) solo existe si el probador está alimentado
    els: (p, T, st) => [{ k: 'R', id: p.id + ':q', a: T('in+'), b: T('in-'), r: 500 }, ...(st.pw ? [{ k: 'V', id: p.id + ':sig', a: T('s'), b: T('gnd'), v: 0.25 + 0.25 * (p.state?.knob ?? 0.5), rint: 50 }] : [])],
    iterate: (p, st, s) => { const pw = s.V('in+') - s.V('in-') > 4; if (pw !== !!st.pw) { st.pw = pw; return true; } return false; },
  },
  meter: {
    name: 'Polímetro', cat: 'Medida', board: false, size: [14, 24], pins: [['com', -3.6, 9.4, 2.6], ['red', 0, 9.4, 2.6]], perms: [['com', 'red']],
    props: { mode: 'V', jack: 'VΩmA' }, desc: 'Mide tensión (V, en paralelo), corriente (A, en serie), resistencia (Ω, sin alimentación) y continuidad (·))), pita si hay menos de 50 Ω). Punta negra siempre en COM. Punta roja en VΩmA para V, Ω y corrientes pequeñas (fusible de 200 mA), o en 10A para corrientes grandes.',
    ui: [{ k: 'mode', label: 'Función (rueda)', type: 'seg', options: ['V', 'A', 'Ω', '·)))'], live: true }, { k: 'jack', label: 'Borne de la punta roja', type: 'seg', options: ['VΩmA', '10A'], live: true }],
    sig: () => 'meter', label: () => 'Polímetro', meter: true, pinNames: { com: 'COM (punta negra)', red: 'punta roja' },
    els: (p, T, st) => {
      if (st.fuse) return [];
      if (p.props.jack === '10A') return [{ k: 'R', id: p.id, a: T('red'), b: T('com'), r: 0.01 }];
      if (p.props.mode === 'V') return [{ k: 'R', id: p.id, a: T('red'), b: T('com'), r: 1e7 }];
      if (p.props.mode === 'A') return [{ k: 'R', id: p.id, a: T('red'), b: T('com'), r: 1 }];
      return [];
    },
  },
  // ---- modelos antiguos (siguen funcionando en montajes guardados, ya no salen en el catálogo) ----
  button: {
    name: 'Pulsador de 2 patas', cat: 'Control', board: true, legacy: true, pins: [['1', 0, 0], ['2', 2, 0]], perms: [['1', '2'], ['2', '1']],
    props: {}, desc: 'Modelo antiguo simplificado (2 patas). Para montajes nuevos usa el pulsador de 4 patas, que es el real.',
    sig: () => 'button', label: () => 'Pulsador (2 patas)', interactive: 'press', pinNames: { 1: 'pata 1', 2: 'pata 2' },
    merges: (p) => p.state?.pressed ? [['1', '2']] : [], els: () => [],
  },
  switch: {
    name: 'Interruptor de 2 patas', cat: 'Control', board: true, legacy: true, pins: [['1', 0, 0], ['2', 2, 0]], perms: [['1', '2'], ['2', '1']],
    props: {}, desc: 'Modelo antiguo simplificado (2 patas). Los interruptores del kit tienen 3 patas: usa el interruptor deslizante.',
    sig: () => 'switch', label: (p) => 'Interruptor 2 patas (' + (p.state?.closed ? 'cerrado' : 'abierto') + ')', interactive: 'toggle', pinNames: { 1: 'pata 1', 2: 'pata 2' },
    merges: (p) => p.state?.closed ? [['1', '2']] : [], els: () => [],
  },
};
export const CATS = ['Alimentación', 'Básicos', 'Control', 'Sensores', 'Salidas', 'Medida'];
export const ID_PREFIX = { resistor: 'R', led: 'LED', rgb: 'RGB', diode: 'D', bulb: 'L', button: 'P', tact: 'P', switch: 'S', slide: 'S', spdt: 'C', pot: 'POT', relay: 'K', npn: 'Q', ldr: 'LDR', buzzer: 'Z', cap: 'CP', bat9: 'B', aa2: 'B', aa4: 'B', usb5: 'B', supply: 'F', motor: 'MOT', servo: 'SV', stester: 'PS', meter: 'M' };
export function newPartProps(type) { return JSON.parse(JSON.stringify(PARTS[type].props || {})); }
export function defaultState(type) { return { switch: { closed: false }, button: { pressed: false }, tact: { pressed: false }, slide: { pos: 0 }, spdt: { pos: 0 }, pot: { pos: 0.5 }, ldr: { light: 0.5 }, stester: { knob: 0.5 } }[type] || {}; }

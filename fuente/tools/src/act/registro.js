// Registro de las «Actividades de clase» (interactivas / 3D) de cada asignatura.
// Para añadir una actividad nueva: crea su definición (objetos 3D + niveles con retos, ver juego.js; o rondas
// sencillas, ver motor.js) y añádela a ACTIVIDADES con el id de la asignatura. Aparece sola en la pestaña
// «Actividades de clase» y el profesor la puede asignar como tarea (el resultado va al cuaderno).
import { Juego3D, tumbar } from './juego.js';
import { herramienta, KIT_HERRAMIENTAS } from '../kit3d/herramientas.js';
import { conductor, manguera, tuboCorrugado, rollo } from '../kit3d/cables.js';
import * as PC from '../kit3d/pc.js';
import { ic } from '../ui/iconos.js';

const FAMILIAS = ['Destornilladores', 'Alicates', 'Corte y pelado', 'Medida y comprobación', 'Máquinas', 'Canalización'];
// Herramienta del kit compartido colocada en la mesa (o en la espuma del maletín)
const H = (kit, x, z, o = {}) => ({ id: o.id || kit, kit, n: o.n || KIT_HERRAMIENTAS[kit].n, x, z, y: o.y ?? 0, rot: o.rot || 0, tumbar: o.t || {}, crear: (g) => g.add(tumbar(herramienta(kit), o.t || {})) });
const ESPUMA = 8.4; // altura de la espuma del maletín
const ALONG_Z = { ry: 0 };
const PUNTA = (q, tornillo, exp) => {
  const claves = ['plano3', 'PH2', 'PZ1', 'PZ2', 'T20']; const n = { plano3: 'Plana 3,5 mm', PH2: 'Phillips PH2', PZ1: 'Pozidriv PZ1', PZ2: 'Pozidriv PZ2', T20: 'Torx T20' };
  return { tipo: 'punta', q, tornillo, claves, opciones: claves.map((c) => n[c]), correcta: claves.indexOf(tornillo), ayuda: 'Mira la huella del tornillo y pulsa la punta que encaja (en 3D o en la lista).', exp };
};
const MM = [5, 8, 11, 14, 20];
const PELAR = (q, borne, ok, exp, o = {}) => ({ tipo: 'pelar', q, borne, mm: MM, opciones: MM.map((m) => `${m} mm`), correctas: ok.map((m) => MM.indexOf(m)), correcta: MM.indexOf(ok[0]), ayuda: 'El pelacables tiene un tope de longitud: elige cuántos milímetros pelas.', exp, ...o });

const maletin = {
  id: 'maletin', foto: 'img/fotos/maletin.webp', asig: 'eee', icon: '🧰', color: '#DC001B', tipo: '3D', tema: 'SA1 · Trabajo 1 (Tema 1)', duracion: '12 min', juego: Juego3D,
  titulo: 'El maletín de herramientas',
  desc: 'Juego 3D en el banco del taller: reconoce cada herramienta del maletín, para qué sirve y supera los retos (punta del tornillo, pelado a medida).',
  intro: 'Tu maletín está abierto en el banco del taller. Supera los tres niveles: reconoce las herramientas, di para qué sirven y resuelve los retos prácticos. Cuanto más rápido y sin fallos, más puntos y estrellas. Pulsa cualquier herramienta para verla de cerca y cómo se usa.',
  mesa: { w: 170, d: 96 }, maletin: { x: -14, z: -6, w: 106, d: 60 },
  objetos: [
    H('destornillador_plano', -60, -21, { y: ESPUMA, t: ALONG_Z }), H('destornillador_ph', -55, -21, { y: ESPUMA, t: ALONG_Z }), H('destornillador_pz', -50, -21, { y: ESPUMA, t: ALONG_Z }),
    H('destornillador_torx', -45, -21, { y: ESPUMA, t: ALONG_Z }), H('buscapolos', -40, -22, { y: ESPUMA, t: ALONG_Z }),
    H('alicate_universal', -31, -22, { y: ESPUMA, t: ALONG_Z }), H('alicate_corte', -22, -23, { y: ESPUMA, t: ALONG_Z }), H('alicate_punta', -13, -21, { y: ESPUMA, t: ALONG_Z }), H('crimpadora', -4, -22, { y: ESPUMA, t: ALONG_Z }),
    H('pelacables', 6, -21, { y: ESPUMA, t: ALONG_Z }), H('cortatubos', 17, -21, { y: ESPUMA, t: ALONG_Z }), H('cutter', 28, -22, { y: ESPUMA, t: ALONG_Z }),
    H('tijeras', -56, 9, { y: ESPUMA, t: ALONG_Z }), H('flexometro', -43, 9, { y: ESPUMA, t: { ry: 0 } }), H('multimetro', -24, 10, { y: ESPUMA, t: { ry: 0 } }),
    H('taladro', 64, -24, { t: { rz: Math.PI / 2, ry: 0 } }), H('guia', 10, 36), H('nivel', -42, 36, { t: { ry: Math.PI / 2 } }),
  ],
  niveles: [
    { n: 'Reconoce tus herramientas', icono: '🔎', tiempo: 150, desc: 'Señala en el banco la herramienta que te pidan.', rondas: [
      { tipo: 'objeto', q: 'Señala el destornillador plano', ok: ['destornillador_plano'], exp: 'Punta plana (de ranura): regletas y bornes de ranura. Aislado 1000 V para trabajar cerca de partes con tensión.' },
      { tipo: 'objeto', q: 'Señala el destornillador Pozidriv (PZ)', ok: ['destornillador_pz'], exp: 'La PZ tiene rayitas a 45° entre los brazos de la cruz: es la de los bornes de mecanismos y magnetotérmicos.' },
      { tipo: 'objeto', q: 'Señala el buscapolos', ok: ['buscapolos'], exp: 'Su lámpara se enciende al tocar una fase. Solo orienta: para asegurar que no hay tensión, el polímetro.' },
      { tipo: 'objeto', q: 'Señala el alicate universal', ok: ['alicate_universal'], exp: 'Sujeta, dobla, retuerce y corta cables finos. Mango aislado hasta 1000 V.' },
      { tipo: 'objeto', q: 'Señala el alicate de corte diagonal', ok: ['alicate_corte'], exp: 'Corta cables al ras. Saltan trocitos: gafas de protección.' },
      { tipo: 'objeto', q: 'Señala el pelacables automático', ok: ['pelacables'], exp: 'Se ajusta solo a la sección y tiene tope de longitud: pela sin dañar el cobre.' },
      { tipo: 'objeto', q: 'Señala la tijera cortatubos', ok: ['cortatubos'], exp: 'Corta el tubo corrugado recto y sin rebabas.' },
      { tipo: 'objeto', q: 'Señala el polímetro', ok: ['multimetro'], exp: 'Mide tensión (V), resistencia y continuidad (Ω) y corriente (A).' },
      { tipo: 'objeto', q: 'Señala el taladro-atornillador', ok: ['taladro'], exp: 'Taladra para fijar cajas y grapas y atornilla con puntas. Los bornes, a mano: el taladro se pasa de par.' },
      { tipo: 'objeto', q: 'Señala la guía pasacables', ok: ['guia'], exp: 'Se mete por el tubo, se enganchan los cables en su cabeza y se tira de ellos.' },
    ] },
    { n: '¿Para qué sirve?', icono: '🧠', tiempo: 120, desc: 'Usos, familias y seguridad.', rondas: [
      { tipo: 'opcion', q: '¿A qué familia pertenece el pelacables?', foco: ['pelacables'], opciones: FAMILIAS, correcta: 2, exp: 'Corte y pelado, junto con el alicate de corte, el cutter y la cortatubos.' },
      { tipo: 'opcion', q: '¿Para qué sirve la guía pasacables?', foco: ['guia'], opciones: ['Para meter los cables por dentro del tubo', 'Para medir el tubo', 'Para sujetar el tubo a la pared', 'Para pelar los cables'], correcta: 0, exp: 'Pasas la guía por el tubo, atas los cables a su cabeza y tiras.' },
      { tipo: 'opcion', q: '¿Qué significa el doble triángulo con «1000 V» del mango?', foco: ['destornillador_plano', 'alicate_universal'], opciones: ['Herramienta aislada para trabajar hasta 1000 V (EN 60900)', 'Que aguanta 1000 kg', 'Que es de una marca cara', 'Que se puede usar con el taladro'], correcta: 0, exp: 'Herramienta aislada ensayada a 10 000 V para usar cerca de partes con tensión hasta 1000 V.' },
      { tipo: 'opcion', q: 'Antes de tocar los cables del tablero hay que…', foco: ['buscapolos', 'multimetro'], opciones: ['Desenchufar la manguera y comprobar que no hay tensión', 'Bajar solo el diferencial', 'Ponerse guantes y seguir con tensión'], correcta: 0, exp: 'Sin tensión y comprobado (polímetro). Es la primera regla de seguridad.' },
      { tipo: 'opcion', q: '¿Para qué sirve la crimpadora?', foco: ['crimpadora'], opciones: ['Para engastar punteras y terminales en la punta del cable', 'Para cortar tubo', 'Para pelar la manguera', 'Para medir tensión'], correcta: 0, exp: 'La puntera engastada evita que se abran las hebras del cable flexible en el borne.' },
    ] },
    { n: 'Retos de taller', icono: '🛠️', tiempo: 150, desc: 'Elige la punta y pela a la medida.', rondas: [
      PUNTA('Borne de un enchufe o interruptor: ¿qué punta encaja?', 'PZ1', 'Bornes de mecanismos: tornillo mixto Pozidriv/plano, PZ1 o plana de 3,5 mm.'),
      PUNTA('Borne de un magnetotérmico del cuadro: ¿qué punta?', 'PZ2', 'Aparamenta modular: PZ2 y par de apriete de unos 2 N·m.'),
      PUNTA('Tornillo de la tapa de una envolvente con huella de estrella de 6 lóbulos:', 'T20', 'Huella de 6 lóbulos = Torx. Con otra punta se «come» la cabeza.'),
      PELAR('Vas a meter el cable en un conector de palanca (tipo WAGO 221): ¿cuánto pelas?', 'palanca', [11], 'El fabricante marca 11 mm: si pelas menos, el aislante entra en la pinza; si pelas más, queda cobre al aire.'),
      PELAR('Cable de 2,5 mm² a un magnetotérmico del cuadro: ¿cuánto pelas?', 'aparamenta', [14], 'Los bornes de caja de la aparamenta piden 12–16 mm; 14 mm es lo indicado.'),
    ] },
  ],
};

const R2 = (color, x, z, n) => ({ id: color, n, x, z, crear: (g) => g.add(rollo({ sec: 2.5, color })) });
const S = (sec, x, z) => ({ id: 's' + String(sec).replace('.', ''), n: `Cable de ${String(sec).replace('.', ',')} mm²`, x, z, y: 1.2, crear: (g) => { const c = conductor({ sec, color: 'negro', len: 14, pelado: [0, 12] }); c.position.y = 0.5; c.rotation.y = Math.PI / 2; c.position.z = 7; g.add(c); } });
const cables = {
  id: 'cables', foto: 'img/fotos/cables.webp', asig: 'eee', icon: '🧵', color: '#0f5e66', tipo: '3D', tema: 'SA1 · Trabajo 2 (Tema 2)', duracion: '10 min', juego: Juego3D, escena: 'cables',
  titulo: 'Cables: colores y secciones',
  desc: 'Juego 3D con rollos de H07V-K, muestras de sección, mangueras RV-K y H05VV-F y tubo corrugado: colores, secciones de cada circuito y cableado de una clavija.',
  intro: 'En la mesa tienes rollos de cable unipolar H07V-K de cada color, un muestrario de secciones, dos mangueras, un cable rígido y tubo corrugado. Supera los tres niveles: colores (y cablea una clavija), secciones de cada circuito y mangueras y canalización.',
  mesa: { w: 170, d: 96 },
  objetos: [R2('marron', -66, -24, 'Rollo marrón'), R2('negro', -44, -24, 'Rollo negro'), R2('gris', -22, -24, 'Rollo gris'), R2('azul', -66, 2, 'Rollo azul'), R2('tierra', -44, 2, 'Rollo amarillo-verde'),
    S(1.5, 10, -19), S(2.5, 22, -19), S(4, 34, -19), S(6, 46, -19),
    { id: 'rvk', n: 'Manguera RV-K 0,6/1 kV', x: -14, z: 22, crear: (g) => g.add(manguera({ tipo: 'RV-K', sec: 2.5, len: 30 })) },
    { id: 'h05', n: 'Manguera H05VV-F 3G1,5', x: -14, z: 34, crear: (g) => g.add(manguera({ tipo: 'H05VV-F', sec: 1.5, len: 30 })) },
    { id: 'rigido', n: 'Cable rígido H07V-U', x: -60, z: 30, crear: (g) => { const c = conductor({ sec: 2.5, color: 'gris', tipo: 'U', len: 18, pelado: [0, 12] }); c.position.y = 0.4; g.add(c); } },
    { id: 'tubo', n: 'Tubo corrugado Ø20', x: 22, z: 4, crear: (g) => { const t = tuboCorrugado({ d: 20, len: 34 }); t.position.y = 1.0; g.add(t); } }],
  niveles: [
    { n: 'Colores', icono: '🎨', tiempo: 120, desc: 'Fase, neutro y tierra; y cablea una clavija.', rondas: [
      { tipo: 'objeto', q: 'Señala el conductor de protección (tierra)', ok: ['tierra'], exp: 'La tierra siempre es amarillo-verde, y solo se usa para eso.' },
      { tipo: 'objeto', q: 'Señala el neutro', ok: ['azul'], exp: 'El neutro es azul claro.' },
      { tipo: 'objeto', q: 'Señala un conductor de fase', ok: ['marron', 'negro', 'gris'], exp: 'La fase puede ser marrón, negra o gris.' },
      { tipo: 'colores', q: 'Cablea la clavija Schuko: elige el conductor de cada borne', exp: 'Fase marrón al borne L, neutro azul al N y amarillo-verde al borne central de tierra, que va a los contactos laterales. Después se aprieta el prensacables sobre la cubierta, no sobre los hilos.', solucion: { L: 'marron', N: 'azul', PE: 'tierra' } },
      { tipo: 'opcion', q: '¿Cuál de estos colores puede ser una fase?', foco: ['gris'], opciones: ['Gris', 'Azul', 'Amarillo-verde'], correcta: 0, exp: 'Fase: marrón, negro o gris. Azul = neutro; amarillo-verde = tierra.' },
    ] },
    { n: 'Secciones', icono: '📏', tiempo: 150, desc: 'Qué cable lleva cada circuito y cómo se reconoce.', rondas: [
      { tipo: 'objeto', q: 'Alumbrado C1 (magnetotérmico de 10 A): ¿qué cable?', ok: ['s15'], exp: '1,5 mm² para el alumbrado (ITC-BT-25).' },
      { tipo: 'objeto', q: 'Enchufes de uso general C2 (16 A): ¿qué cable?', ok: ['s25'], exp: '2,5 mm² para las tomas de uso general.' },
      { tipo: 'objeto', q: 'Lavadora, lavavajillas y termo C4 (20 A): ¿qué cable?', ok: ['s4'], exp: '4 mm² para el circuito de 20 A.' },
      { tipo: 'objeto', q: 'Cocina y horno C3 (25 A): ¿qué cable?', ok: ['s6'], exp: '6 mm² para el circuito de 25 A.' },
      { tipo: 'seccion', q: 'Mira el corte del cable con la regla: ¿qué sección es?', sec: 2.5, color: 'azul', opciones: ['1,5 mm²', '2,5 mm²', '4 mm²', '6 mm²'], correcta: 1, ayuda: 'El cobre de 2,5 mm² mide unos 1,8 mm de diámetro y el cable entero unos 3,6 mm.', exp: '2,5 mm²: cobre de 1,8 mm, 48 hilos finos en el H07V-K.' },
      { tipo: 'seccion', q: 'Y este, más grueso: ¿qué sección es?', sec: 6, color: 'negro', opciones: ['1,5 mm²', '2,5 mm²', '4 mm²', '6 mm²'], correcta: 3, ayuda: 'Fíjate en el diámetro del cobre con la regla (6 mm² → unos 2,8 mm).', exp: '6 mm²: cobre de unos 2,8 mm y 4,8 mm de diámetro exterior. Es el de la cocina (C3).' },
      { tipo: 'opcion', q: 'Si el cable es más fino de lo que toca para la corriente…', foco: ['s15'], opciones: ['Se calienta y puede quemarse el aislante', 'No pasa nada: solo cambia el color', 'La bombilla luce más'], correcta: 0, exp: 'Idea clave del Trabajo 2: el cable fino se calienta.' },
    ] },
    { n: 'Mangueras y canalización', icono: '🔌', tiempo: 120, desc: 'RV-K, H05VV-F, rígido y tubo.', rondas: [
      { tipo: 'objeto', q: 'Señala la manguera RV-K (cubierta negra, 0,6/1 kV)', ok: ['rvk'], exp: 'RV-K: cables de potencia con cubierta, para instalaciones fijas y derivaciones individuales.' },
      { tipo: 'objeto', q: 'Señala la manguera H05VV-F (la de los aparatos y alargadores)', ok: ['h05'], exp: 'H05VV-F 3G1,5: flexible, 300/500 V, para conectar aparatos (como la manguera del tablero).' },
      { tipo: 'objeto', q: 'Señala el cable rígido (H07V-U)', ok: ['rigido'], exp: 'U = un solo hilo rígido. K = muchos hilos finos (flexible), el que usamos en el taller.' },
      { tipo: 'objeto', q: 'Señala el tubo corrugado', ok: ['tubo'], exp: 'Guía y protege los cables. En superficie, grapas cada 50 cm como máximo.' },
      { tipo: 'opcion', q: '¿Qué significa la «K» de H07V-K?', foco: ['marron'], opciones: ['Conductor flexible de muchos hilos (clase 5)', 'Que es de cobre', 'Que aguanta 1000 V', 'Que es de color'], correcta: 0, exp: 'H = armonizado, 07 = 450/750 V, V = PVC, K = flexible para instalación fija.' },
      PELAR('Cable de 2,5 mm² al borne de un enchufe: ¿cuánto pelas?', 'mecanismo', [11], 'Bornes de mecanismo: 9–12 mm (marca de pelado detrás del mecanismo).', { color: 'marron' }),
    ] },
  ],
};
for (const a of [maletin, cables]) a.rondas = a.niveles.flatMap((n) => n.rondas); // lista plana (tarjetas: «N preguntas»)
// TIC I · Anatomía del PC: las piezas de un ordenador de sobremesa en el banco (ejemplo mínimo)
const P = (id, n, x, z, crear, rot = 0) => ({ id, n, x, z, rot, crear: (g) => g.add(crear()) });
const anatomiaPC = {
  id: 'anatomia-pc', asig: 'tic1', icon: ic('cpu'), color: '#1f6feb', tipo: '3D', tema: 'Hardware', duracion: '8 min', juego: Juego3D, escena: 'pc',
  titulo: 'Anatomía del PC',
  desc: 'Juego 3D: reconoce en el banco las piezas de un ordenador de sobremesa y para qué sirve cada una.',
  intro: 'En el banco tienes las piezas de un ordenador desmontado. Supera los dos niveles: reconoce cada pieza y di para qué sirve.',
  mesa: { w: 170, d: 96 },
  objetos: [
    P('placa', 'Placa base', -48, -18, PC.placaBase), P('cpu', 'Procesador (CPU)', -12, -26, () => { const c = PC.procesador(); c.scale.setScalar(1.6); return c; }), P('disipador', 'Disipador con ventilador', 8, -26, PC.disipadorCPU),
    P('ram', 'Memoria RAM', -12, -8, PC.memoriaRAM), P('gpu', 'Tarjeta gráfica', 40, -24, PC.tarjetaGrafica), P('fuente', 'Fuente de alimentación', 60, 14, PC.fuenteAlimentacion),
    P('ssd', 'Disco SSD', -50, 22, PC.discoSSD), P('hdd', 'Disco duro (HDD)', -24, 24, PC.discoDuro), P('m2', 'SSD M.2 NVMe', 8, 6, PC.m2),
  ],
  niveles: [
    { n: 'Reconoce las piezas', icono: ic('search'), tiempo: 120, desc: 'Señala en el banco la pieza que te pidan.', rondas: [
      { tipo: 'objeto', q: 'Señala la placa base', ok: ['placa'], exp: 'Es la placa a la que se conectan todas las demás piezas.' },
      { tipo: 'objeto', q: 'Señala el procesador (CPU)', ok: ['cpu'], exp: 'Ejecuta las instrucciones de los programas. Va en el zócalo de la placa base.' },
      { tipo: 'objeto', q: 'Señala un módulo de memoria RAM', ok: ['ram'], exp: 'Guarda los datos y programas en uso; se borra al apagar.' },
      { tipo: 'objeto', q: 'Señala la tarjeta gráfica', ok: ['gpu'], exp: 'Genera la imagen que se ve en el monitor.' },
      { tipo: 'objeto', q: 'Señala la fuente de alimentación', ok: ['fuente'], exp: 'Convierte la corriente alterna del enchufe en las tensiones continuas que usa el ordenador.' },
      { tipo: 'objeto', q: 'Señala un almacenamiento sin partes móviles', ok: ['ssd', 'm2'], exp: 'Los SSD (2,5" o M.2) guardan los datos en memoria flash, sin discos ni cabezales.' },
    ] },
    { n: '¿Para qué sirve?', icono: ic('brain'), tiempo: 90, desc: 'Función de cada pieza.', rondas: [
      { tipo: 'opcion', q: '¿Qué pieza pierde su contenido al apagar el ordenador?', foco: ['ram', 'ssd'], opciones: ['La memoria RAM', 'El disco SSD', 'El disco duro'], correcta: 0, exp: 'La RAM es memoria volátil; los discos guardan los datos sin corriente.' },
      { tipo: 'opcion', q: '¿Para qué sirve el disipador?', foco: ['disipador', 'cpu'], opciones: ['Para evacuar el calor del procesador', 'Para guardar datos', 'Para dar corriente a la placa'], correcta: 0, exp: 'Se apoya sobre la CPU con pasta térmica y su ventilador saca el calor.' },
    ] },
  ],
};

export const ACTIVIDADES = [maletin, cables, anatomiaPC];
export const actividadesDe = (asig) => ACTIVIDADES.filter((a) => a.asig === asig);
export const actividad = (asig, id) => ACTIVIDADES.find((a) => a.asig === asig && a.id === id) || null;
export const enlaceActividad = (a) => `#asig/${a.asig}/actividades/${a.id}`;

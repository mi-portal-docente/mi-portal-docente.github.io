// Catálogo técnico del laboratorio «Instalación de vivienda»: datos de productos reales (como referencia, sin logos)
// y tablas del REBT. Todas las medidas en centímetros salvo que se diga otra cosa.
// Fuentes consultadas (nov. 2026): fichas de Schneider Electric New Unica (NU305754: base Schuko 2P+T 16 A,
// 45 × 45 mm, 42 mm de fondo, caja universal de 60 mm entre ejes y 40 mm de fondo mínimo), Resi9 / DPN Resi9
// (magnetotérmico 1P+N de 18 mm, 18 × 81 × 70,5 mm, curva C, pelado 14 mm, tornillo PZ2, 2 N·m; diferencial 2P
// 40 A 30 mA de 36 mm), WAGO 221-412/413/415 (0,2–4 mm², 32 A, 450 V, pelado 11 mm; 13,1 / 18,7 / 29,9 mm de
// ancho), WAGO 2273 (0,5–2,5 mm² rígido, pelado 11 mm), Legrand Plexo (cajas estancas 80 × 80 y 100 × 100),
// Simon 270 / Schneider Unica (conmutador: común L o flecha y viajeros 1 y 2) y el REBT: ITC-BT-19, 21, 25 y 27.

// ---------------------------------------------------------------- circuitos de la vivienda (ITC-BT-25, tabla 1)
export const CIRCUITOS = {
  C1: { n: 'Alumbrado', In: 10, sec: 1.5, tubo: 16, max: 30, uso: 'puntos de luz' },
  C2: { n: 'Tomas de uso general y frigorífico', In: 16, sec: 2.5, tubo: 20, max: 20, uso: 'tomas' },
  C3: { n: 'Cocina y horno', In: 25, sec: 6, tubo: 25, max: 2, uso: 'tomas' },
  C4: { n: 'Lavadora, lavavajillas y termo', In: 20, sec: 4, tubo: 20, max: 3, uso: 'tomas' },
  C5: { n: 'Baño y cuarto de cocina (auxiliares)', In: 16, sec: 2.5, tubo: 20, max: 6, uso: 'tomas' },
};
export const CALIBRES = [6, 10, 16, 20, 25, 32];
export const CURVAS = { B: 'B (disparo magnético 3–5 In: cargas resistivas, cables largos)', C: 'C (5–10 In: uso general en viviendas)' };
export const CALIBRES_IGA = [25, 32, 40];
export const CALIBRES_ID = [25, 40, 63];
// Intensidad máxima del magnetotérmico que protege bien cada sección en la vivienda (ITC-BT-25, tabla 1 / ITC-BT-19)
export const PROTEGE = { 1.5: 10, 2.5: 16, 4: 20, 6: 25 };
export const SECCIONES = [1.5, 2.5, 4, 6];
// Diámetro exterior aproximado de un cable H07V-K con su aislante (mm), para la ocupación del tubo
export const DIAM_CABLE = { 1.5: 3.0, 2.5: 3.6, 4: 4.2, 6: 4.8 };

// ---------------------------------------------------------------- tubo corrugado (ITC-BT-21, tabla 5: empotrado)
export const TUBOS = [16, 20, 25, 32];
export const TUBO_INT = { 16: 10.7, 20: 14.1, 25: 18.3, 32: 24.3 }; // diámetro interior típico (mm)
const TABLA5 = { 1.5: [12, 12, 16, 16, 20], 2.5: [12, 16, 20, 20, 20], 4: [12, 16, 20, 20, 25], 6: [12, 16, 25, 25, 25] };
// Diámetro exterior mínimo para n conductores de la sección dada; con más de 5 o secciones mezcladas, sección
// interior ≥ 2,5 veces la ocupada por los cables.
export function tuboMinimo(conductores) {
  const n = conductores.length; if (!n) return 0;
  const secs = [...new Set(conductores)];
  if (n <= 5 && secs.length === 1) return TABLA5[secs[0]]?.[n - 1] ?? 32;
  const ocupada = conductores.reduce((s, c) => s + Math.PI * ((DIAM_CABLE[c] || 4) / 2) ** 2, 0);
  for (const d of TUBOS) if (Math.PI * (TUBO_INT[d] / 2) ** 2 >= 2.5 * ocupada) return d;
  return 40;
}
export const GRAPA_MAX = 50; // cm entre grapas o abrazaderas (tubo en superficie, ITC-BT-21)

// ---------------------------------------------------------------- cajas de empalme (vacías, con fichas dentro)
export const CAJAS = {
  80: { n: 'Caja de empalme 80 × 80 × 45 mm', w: 8, d: 4.5, pos: 4, conos: 6, precio: 1.6, ref: 'tipo Legrand Plexo 80 × 80 (IP55)' },
  100: { n: 'Caja de empalme 100 × 100 × 50 mm', w: 10, d: 5, pos: 6, conos: 7, precio: 2.1, ref: 'tipo Legrand Plexo 100 × 100 (IP55)' },
};
// Fichas de empalme: «vias» = conductores que admite; smin/smax en mm²; A = corriente asignada.
export const FICHAS = {
  w412: { n: 'Conector de palanca 2 vías', corto: 'Palanca 2', vias: 2, smin: 0.2, smax: 4, A: 32, kind: 'palanca', pel: 11, ancho: 1.31, precio: 0.45, ref: 'tipo WAGO 221-412' },
  w413: { n: 'Conector de palanca 3 vías', corto: 'Palanca 3', vias: 3, smin: 0.2, smax: 4, A: 32, kind: 'palanca', pel: 11, ancho: 1.87, precio: 0.55, ref: 'tipo WAGO 221-413' },
  w415: { n: 'Conector de palanca 5 vías', corto: 'Palanca 5', vias: 5, smin: 0.2, smax: 4, A: 32, kind: 'palanca', pel: 11, ancho: 2.99, precio: 0.8, ref: 'tipo WAGO 221-415' },
  i2: { n: 'Conector de inserción 2 vías', corto: 'Inserción 2', vias: 2, smin: 0.5, smax: 2.5, A: 24, kind: 'insercion', pel: 11, ancho: 0.9, precio: 0.2, ref: 'tipo WAGO 2273-202 (solo cable rígido)' },
  i3: { n: 'Conector de inserción 3 vías', corto: 'Inserción 3', vias: 3, smin: 0.5, smax: 2.5, A: 24, kind: 'insercion', pel: 11, ancho: 1.3, precio: 0.25, ref: 'tipo WAGO 2273-203 (solo cable rígido)' },
  i5: { n: 'Conector de inserción 5 vías', corto: 'Inserción 5', vias: 5, smin: 0.5, smax: 2.5, A: 24, kind: 'insercion', pel: 11, ancho: 2.0, precio: 0.35, ref: 'tipo WAGO 2273-205 (solo cable rígido)' },
  r4: { n: 'Regleta de tornillo 4 mm² (1 polo)', corto: 'Regleta 4', vias: 2, smin: 0.5, smax: 4, A: 24, kind: 'regleta', pel: 8, ancho: 1.0, precio: 0.12, ref: 'clema de 12 polos cortada: 1 cable por lado' },
  r10: { n: 'Regleta de tornillo 10 mm² (1 polo)', corto: 'Regleta 10', vias: 2, smin: 1.5, smax: 10, A: 41, kind: 'regleta', pel: 10, ancho: 1.4, precio: 0.2, ref: 'clema de 10 mm²: para 4 y 6 mm²' },
};

// ---------------------------------------------------------------- bornes: cómo se pela y cómo se aprieta
// pel: [mín, máx] en mm · tornillo: puntas válidas (si no tiene tornillo, null)
export const BORNES = {
  aparamenta: { n: 'Borne de aparamenta (magnetotérmico)', pel: [12, 16], ideal: 14, puntas: ['PZ2', 'plano5'], par: '2 N·m' },
  barraPE: { n: 'Barra de tierra del cuadro', pel: [10, 16], ideal: 12, puntas: ['PZ2', 'plano5'], par: '1,2 N·m' },
  mecanismo: { n: 'Borne de mecanismo', pel: [9, 12], ideal: 10, puntas: ['PZ1', 'plano3'], par: '0,8 N·m' },
  portalamparas: { n: 'Borne del portalámparas', pel: [8, 12], ideal: 9, puntas: ['PH1', 'plano3'], par: '0,5 N·m' },
  palanca: { n: 'Conector de palanca', pel: [10, 12], ideal: 11, puntas: null },
  insercion: { n: 'Conector de inserción', pel: [10, 12], ideal: 11, puntas: null },
  regleta: { n: 'Regleta de tornillo', pel: [7, 10], ideal: 8, puntas: ['plano3', 'PH1'], par: '0,5 N·m' },
};
export const LARGOS_PELADO = [5, 8, 11, 14, 20];
export const PUNTAS = {
  plano3: { n: 'Plana 3,5 mm', tipo: 'Plana', usos: 'Regletas, bornes de mecanismos y portalámparas.' },
  plano5: { n: 'Plana 5,5 mm', tipo: 'Plana', usos: 'Bornes de aparamenta del cuadro, barra de tierra.' },
  PH1: { n: 'Phillips PH1', tipo: 'Phillips', usos: 'Tornillos de cruz pequeños: portalámparas, tapas.' },
  PH2: { n: 'Phillips PH2', tipo: 'Phillips', usos: 'Tornillos de madera para fijar cajas al tablero.' },
  PZ1: { n: 'Pozidriv PZ1', tipo: 'Pozidriv', usos: 'Bornes de mecanismos (tornillo mixto plano/PZ).' },
  PZ2: { n: 'Pozidriv PZ2', tipo: 'Pozidriv', usos: 'Bornes de magnetotérmicos y diferenciales (2 N·m).' },
  T20: { n: 'Torx T20', tipo: 'Torx', usos: 'Tornillos de tapas y envolventes; no se usa en bornes.' },
};

// ---------------------------------------------------------------- mecanismos (medidas reales aproximadas, cm)
export const MECANISMO = { marco: 8.1, modulo: 4.5, fondo: 4.2, cajaSup: 8.4, cajaSupFondo: 4.2, entreEjes: 6.0 };
// Marcas de los bornes por detrás (como en los mecanismos reales)
export const MARCAS = {
  interruptor: { 1: 'L', 2: '↓' }, conmutador: { C: 'L', 1: '1', 2: '2' }, cruzamiento: { 1: '1', 2: '2', 3: '3', 4: '4' },
  pulsador: { 1: 'L', 2: '↓' }, enchufe: { L: 'L', N: 'N', PE: '⏚' }, enchufe2: { L: 'L', N: 'N', PE: '⏚' }, minutero: { L: 'L', N: 'N', 3: '3', 4: '↓' }, bombilla: { L: 'L', N: 'N' },
};

// ---------------------------------------------------------------- herramientas (modo Taller y modos de montaje)
export const HERRAMIENTAS = [
  { id: 'destornillador', n: 'Destornilladores aislados VDE 1000 V', fam: 'Destornilladores', icon: '🪛',
    para: 'Apretar y aflojar los tornillos de los bornes, de las garras de los mecanismos y de los marcos.',
    seguridad: 'Mango aislado con el símbolo del doble triángulo y «1000 V» (norma EN 60900). Usa siempre la punta que encaja: si baila, se «come» la cabeza del tornillo y se escapa hacia los dedos.',
    puntas: 'Plana (3,5 y 5,5 mm), Phillips (PH1, PH2), Pozidriv (PZ1, PZ2) y Torx (T20). Los bornes de los magnetotérmicos llevan PZ2; los de los mecanismos, PZ1 o plana de 3,5 mm.',
    marcas: 'Wera, Wiha, Bahco, Stanley, Knipex' },
  { id: 'taladro', n: 'Taladro-atornillador de batería', fam: 'Máquinas', icon: '🔩',
    para: 'Hacer los agujeros en el tablero o la pared y atornillar las cajas, el cuadro y las grapas.',
    seguridad: 'Gafas siempre. Sujeta la pieza, elige la broca adecuada (madera, pared, metal) y el par del embrague. Nunca para apretar bornes: se pasa el par y se rompe el cable.',
    puntas: 'Brocas de madera (punta de centrado), de pared (widia) y metal (HSS); puntas de atornillar PH2 y PZ2 en portapuntas magnético.',
    marcas: 'Makita, Bosch, DeWalt, Milwaukee' },
  { id: 'alicate', n: 'Alicate universal aislado', fam: 'Alicates', icon: '🗜️',
    para: 'Sujetar, doblar y retorcer cables; tiene una zona de corte cerca del eje.',
    seguridad: 'Aislado 1000 V. No uses los alicates como martillo ni para aflojar tuercas.',
    marcas: 'Knipex, Bahco, Stanley' },
  { id: 'corte', n: 'Alicate de corte diagonal', fam: 'Alicates', icon: '✂️',
    para: 'Cortar los cables a la medida.',
    seguridad: 'Corta con la punta del cable apuntando hacia abajo: el trozo sale disparado. Gafas.',
    marcas: 'Knipex, Bahco' },
  { id: 'punta', n: 'Alicate de punta', fam: 'Alicates', icon: '📍',
    para: 'Hacer ojales en la punta de los cables y trabajar en sitios estrechos (cajas).',
    seguridad: 'No hagas palanca con la punta: se abre.', marcas: 'Knipex, Bahco' },
  { id: 'pelacables', n: 'Pelacables automático', fam: 'Corte y pelado', icon: '🧤',
    para: 'Quitar el aislante de la punta sin dañar el cobre. Tiene tope para pelar siempre la misma longitud.',
    seguridad: 'Elige la sección correcta: si es más pequeña, muerde el cobre y el cable se parte al doblarlo. Longitudes: 11 mm para conectores de palanca, unos 10 mm para mecanismos y 14 mm para los magnetotérmicos.',
    marcas: 'Knipex, Jokari, Wago' },
  { id: 'crimpadora', n: 'Crimpadora de punteras', fam: 'Corte y pelado', icon: '🔧',
    para: 'Poner punteras (terminales) en los cables flexibles para que no se abran los hilos en el borne.',
    seguridad: 'Usa la boca del tamaño de la puntera.', marcas: 'Knipex, Wago, Weidmüller' },
  { id: 'tijeras', n: 'Tijeras de electricista', fam: 'Corte y pelado', icon: '✂️',
    para: 'Cortar cables finos, cinta aislante y bridas; la muesca de la hoja sirve para pelar cables de poca sección.',
    seguridad: 'No cortes con tensión. Guárdalas cerradas.', marcas: 'Knipex, Bahco' },
  { id: 'guia', n: 'Guía pasacables', fam: 'Canalización', icon: '🧵',
    para: 'Pasar los cables por dentro del tubo ya colocado: se mete la guía, se enganchan las puntas de los cables y se tira.',
    seguridad: 'Tira despacio y sin dar tirones. Recógela en su carrete para que no se enrede.', marcas: 'Cimco, Fischer, Mermet' },
  { id: 'cutter', n: 'Cutter', fam: 'Corte y pelado', icon: '🔪',
    para: 'Abrir la cubierta de las mangueras (cortando hacia fuera) y recortar tubos finos.',
    seguridad: 'Corta siempre alejando la hoja del cuerpo y con guantes anticorte. No para pelar cables unipolares: daña el cobre.',
    marcas: 'Stanley, Olfa' },
  { id: 'cortatubos', n: 'Tijera cortatubos', fam: 'Corte y pelado', icon: '✂',
    para: 'Cortar el tubo corrugado y el tubo rígido de PVC en recto, a la medida.',
    seguridad: 'Mide y marca antes de cortar. Mantén la otra mano lejos de la cuchilla.', marcas: 'Rothenberger, Knipex, Virax' },
  { id: 'flexometro', n: 'Flexómetro (metro)', fam: 'Medida', icon: '📏',
    para: 'Medir los tramos de tubo y de cable y las alturas de los mecanismos.',
    seguridad: 'Recoge la cinta despacio: el borde corta.', marcas: 'Stanley, Bahco' },
  { id: 'nivel', n: 'Nivel de burbuja', fam: 'Medida', icon: '📐',
    para: 'Poner rectos el cuadro, las cajas y los mecanismos.', seguridad: 'Sin riesgo especial.', marcas: 'Stabila, Stanley' },
  { id: 'buscapolos', n: 'Buscapolos (detector de tensión)', fam: 'Medida eléctrica', icon: '🔦',
    para: 'Saber cuál es la fase: la lámpara se enciende al tocar la fase y no con el neutro ni la tierra.',
    seguridad: 'Solo orienta: para trabajar sin tensión hay que comprobarlo con el multímetro o un comprobador de tensión.', marcas: 'Fluke, Bahco, Stanley' },
  { id: 'multimetro', n: 'Multímetro (polímetro)', fam: 'Medida eléctrica', icon: '📟',
    para: 'Medir tensión (V~), resistencia (Ω) y continuidad. Sin enchufar: comprueba con continuidad que no hay cortocircuitos y que llegan los cables. Con tensión: 230 V entre fase y neutro.',
    seguridad: 'Categoría CAT III 600 V o más. Nunca midas resistencia o continuidad con tensión. Coge las puntas por detrás de la protección.', marcas: 'Fluke, Kaiweets, Uni-T' },
  { id: 'epi', n: 'Equipos de protección (EPI)', fam: 'Protección', icon: '🥽',
    para: 'Gafas para cortar, taladrar y pelar; guantes para el tubo y el cutter; guantes aislantes si hay tensión.',
    seguridad: 'Antes de tocar nada: desconecta, bloquea, comprueba la ausencia de tensión, pon a tierra y señaliza (las 5 reglas de oro).', marcas: '3M, Portwest' },
];
export const herramienta = (id) => HERRAMIENTAS.find((h) => h.id === id);

// ---------------------------------------------------------------- referencias de producto (solo texto)
export const REFERENCIAS = {
  enchufe: 'Base Schuko 2P+T 16 A 250 V (tipo Schneider New Unica NU3057xx, Simon 270 o Legrand Niloé): mecanismo de 45 × 45 mm y 42 mm de fondo, en caja universal (60 mm entre ejes, 40 mm de fondo mínimo); bornes para cables de hasta 2,5 mm²; tierra por patillas laterales.',
  interruptor: 'Interruptor 10 AX 250 V (tipo Schneider New Unica, Simon 270): dos bornes, entrada L (fase) y salida marcada con una flecha ↓ (retorno a la lámpara). Bornes de tornillo con agujeros de conexión rápida.',
  conmutador: 'Conmutador 10 AX (tipo Schneider New Unica, Simon 270): borne común L (o flecha) y dos viajeros 1 y 2. Sirve como interruptor usando L y 1.',
  cruzamiento: 'Cruzamiento 10 AX: cuatro bornes. Va entre dos conmutadores para encender desde tres o más sitios.',
  pulsador: 'Pulsador 10 A: solo cierra mientras lo pulsas (timbre, automático de escalera).',
  bombilla: 'Portalámparas E27 de superficie con bornes de tornillo L y N. Bombilla LED o incandescente de 60 W.',
  mt: 'Magnetotérmico 1P+N (tipo Schneider DPN Resi9 o Acti9 iC60N): 18 mm de ancho (1 módulo), 81 mm de alto; curva C, poder de corte 6 kA; bornes de tornillo PZ2, pelado 14 mm.',
  id: 'Interruptor diferencial 2P 30 mA clase AC o A (tipo Schneider Resi9 o Acti9 iID): 36 mm (2 módulos), 25 o 40 A. Botón T de prueba: púlsalo una vez al mes.',
  iga: 'Interruptor general automático (IGA) 2P (tipo Schneider Resi9): 36 mm (2 módulos), 25 A como mínimo en vivienda (ITC-BT-25).',
  cuadro: 'Cuadro de superficie de 1 fila y 12 módulos (tipo Schneider Resi9 MP o Legrand Practibox): carril DIN, barra de tierra y de neutro.',
  caja: 'Caja de empalme estanca de superficie (tipo Legrand Plexo): vacía por dentro, con conos o entradas troqueladas para el tubo. Dentro se empalma con fichas.',
  manguera: 'Manguera 3G2,5 (H05VV-F, 3 × 2,5 mm²) con clavija Schuko.',
};

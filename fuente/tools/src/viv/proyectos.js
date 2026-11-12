// Proyectos de «Instalación de vivienda» con la misma estructura que los de ESP32: objetivo, material con fotos,
// paso a paso (herramienta + acciones + comprobación), plano de conexiones, montaje interactivo en 3D, pruebas con el
// polímetro y el buscapolos, y reto final. Sin dependencias del navegador (se prueba con node).
import { vacio, partePorId, prepararTodo, sanear, clone, TIPOS, esEnchufe, bornes, nombreBorne, COLORES, posBorne, posParte, rutaCable, rutaTubo, medidas, dims } from './modelo.js';
import { simular, comprobar, medir } from './sim.js';
import { MARCAS } from './catalogo.js';

// ---------------------------------------------------------------- construcción de los montajes de referencia
// cuadro Q con manguera M y aparamenta [[id, tipo, ranura, extra]] · piezas {id: {type, x, y, nombre}} · tubos [[a, b, Ø]]
// cables [[id, 'pieza:borne', 'pieza:borne', color, sección]]
function crea({ tab = [100, 70], q = [21, 15], cab = false, mods, piezas = {}, tubos = [], fichas = {}, cables = [] }) {
  const m = vacio(); m.tablero = { w: tab[0], h: tab[1] };
  m.parts.push({ id: 'Q', type: 'cuadro', x: q[0], y: q[1], nombre: cab ? 'Cuadro (sin cablear)' : 'Cuadro', fijado: true, ...(cab ? { cab: true } : {}) });
  m.parts.push({ id: 'M', type: 'manguera', cuadro: 'Q', nombre: 'Manguera', ...(cab ? { cab: true } : {}) });
  const NOM = { iga: (x) => `IGA ${x.In || 25} A`, id: () => 'ID 30 mA', mt10: () => 'C1 10 A', mt16: () => 'C2 16 A' };
  for (const [id, type, slot, x = {}] of mods) m.parts.push({ id, type, cuadro: 'Q', slot, on: true, nombre: NOM[type](x), ...(type === 'mt10' ? { In: 10, curva: 'C', circ: 'C1' } : type === 'mt16' ? { In: 16, curva: 'C', circ: 'C2' } : type === 'id' ? { In: 40 } : { In: 25 }), ...(cab ? { cab: true } : {}), ...x });
  for (const [id, p] of Object.entries(piezas)) m.parts.push({ id, ...p, fijado: true, ...(p.type === 'caja' ? { tam: 100, fichas: { ...(fichas[id] || {}) } } : {}), ...(esEnchufe(p) ? { carga: 'nada' } : {}),
    ...(['interruptor', 'pulsador'].includes(p.type) ? { on: false } : {}), ...(['conmutador', 'cruzamiento'].includes(p.type) ? { pos: 0 } : {}), ...(p.type === 'minutero' ? { on: false, seg: 20 } : {}) });
  tubos.forEach(([a, b, d = 16], i) => m.tubos.push({ id: 't' + (i + 1), a, b, d }));
  for (const [id, a, b, color, sec = 1.5] of cables) { const [pa, ta] = a.split(':'), [pb, tb] = b.split(':'); m.cables.push({ id, a: { p: pa, t: ta }, b: { p: pb, t: tb }, color, sec }); }
  return sanear(prepararTodo(m));
}

// ---------------------------------------------------------------- pasos reutilizables
const T = (t, herr, o) => ({ t, herr, ...o });
const EPI = (extra = []) => T('Prepara el puesto: sin tensión y con los EPI', 'epi', {
  opts: ['epi', 'taladro', 'multimetro'], por: 'Antes de tocar nada: gafas de protección y guantes; la manguera desenchufada.',
  take: ['Gafas de protección y guantes de trabajo', 'Tablero de madera con el cuadro ya colocado', ...extra],
  do: ['Comprueba que la <b>manguera está desenchufada</b>: en el aula solo la enchufa el profesor, al final.', 'Recuerda las <b>5 reglas de oro</b>: corta, bloquea, comprueba que no hay tensión, pon a tierra y señaliza.', 'Ordena el material en el banco: mecanismos, cajas, tubo, cables por colores y herramientas.'],
  check: 'Manguera desenchufada, gafas puestas y el material de este proyecto en el banco.', muestra: { parts: ['Q', 'M', 'IGA', 'ID', 'C1', 'C2'] } });
const FIJAR = (ids, take, pos) => T('Coloca y atornilla las cajas y los mecanismos', 'taladro', {
  opts: ['taladro', 'destornillador:PZ1', 'alicate'], por: 'El taladro-atornillador con punta PH2 fija las cajas al tablero con tornillos de madera.',
  take: [...take, 'Tornillos de madera 3,5 × 25 mm (2 por pieza)'], do: [...pos, 'Usa el <b>nivel</b> para que las cajas queden rectas y atornilla con el taladro (embrague bajo, punta PH2).'],
  check: 'Las piezas no se mueven y están a la medida del plano (pestaña «Esquema»).', muestra: { parts: ids }, foco: ids[0] });
const TUBO = (n, d = 16) => T('Mide, corta y grapa el tubo corrugado', 'cortatubos', {
  opts: ['cortatubos', 'corte', 'cutter'], por: 'La tijera cortatubos corta el tubo corrugado en recto; antes, mide el tramo con el flexómetro.',
  take: [`Tubo corrugado Ø${d} mm (${n} tramo${n > 1 ? 's' : ''})`, 'Grapas para tubo y tornillos', 'Flexómetro'],
  do: ['Mide cada tramo con el <b>flexómetro</b>: de caja a caja, dejando que el tubo entre 1 cm en cada una.', 'Corta con la <b>tijera cortatubos</b> en recto.', 'Sujeta el tubo con <b>grapas cada 50 cm como máximo</b> (ITC-BT-21) y una cerca de cada caja.'],
  check: 'Ningún tubo queda corto (sin entrar en la caja) ni colgando entre grapas.', muestra: { tubos: true } });
const GUIA = (cables) => T('Pasa los cables por el tubo con la guía', 'guia', {
  opts: ['guia', 'alicate', 'pelacables'], por: 'La guía pasacables se mete por el tubo, se enganchan las puntas de los cables y se tira despacio.',
  take: cables, do: ['Mete la <b>guía pasacables</b> por el tubo desde la caja de empalme.', 'Pela unos 3 cm las puntas, engánchalas en el ojal de la guía y cúbrelas con cinta.', 'Tira despacio y deja <b>unos 15 cm de cable</b> en cada caja para poder conectar.'],
  check: 'En cada caja hay cable de sobra y cada color está en su tubo.' });
const PELAR = (mm, que) => T(`Pela las puntas a ${mm} mm`, 'pelacables', {
  opts: ['pelacables', 'cutter', 'tijeras'], por: `El pelacables automático quita el aislante sin dañar el cobre; con el tope pelas siempre ${mm} mm.`,
  take: ['Pelacables automático con tope'], do: [`Pela ${mm} mm ${que}: es lo que pide el borne (lo indica el fabricante en el mecanismo o en el conector).`, 'Si se ve cobre fuera del borne, está pelado de más; si el aislante entra en el borne, de menos (no hace contacto).'],
  check: `Puntas de ${mm} mm, rectas y sin hilos cortados.` });
const OHM = (t, a, b, estado, espera) => ({ t, modo: 'ohm', a, b, estado, espera });
const VOL = (t, a, b, estado, espera) => ({ t, modo: 'V', a, b, estado, espera });
const BP = (t, a, estado, espera) => ({ t, modo: 'bp', a, estado, espera });
const PORTA = (cables, c, desde) => T('Cablea el portalámparas: fase al centro, neutro a la rosca', 'destornillador:plano3', { opts: ['destornillador:plano3', 'destornillador:PZ2', 'alicate'],
  por: 'Los bornes del portalámparas son pequeños: punta plana de 3,5 mm (o PH1).', take: ['Portalámparas E27 (bornes L y N)'],
  do: [`El <b>retorno</b> (${c}) ${desde} al borne <b>L</b>: es el <b>contacto central</b> del portalámparas.`, 'El <b>neutro azul</b> de la ficha del neutro al borne <b>N</b>: va a la <b>rosca</b>.', 'Así, al cambiar la bombilla con la luz apagada, la rosca no tiene tensión.'],
  cables, check: `Retorno ${c} en L (centro) y azul en N (rosca).`, foco: 'B1', visor: 'B1' });
const MIDE = (opts, ds, check) => T('Comprueba sin tensión con el polímetro', 'multimetro', { opts, por: 'Sin tensión se mide con el polímetro en Ω (continuidad). El buscapolos solo sirve con tensión.', take: ['Polímetro en Ω'], do: ds, check, prueba: true });
const TENSION = (herr, opts, ds, check) => T('Prueba con tensión', herr, { opts, por: herr === 'buscapolos' ? 'Con tensión, el buscapolos se enciende en la fase: así compruebas qué conductor corta cada mecanismo.' : 'Con tensión se mide en V~: unos 230 V entre fase y neutro.', take: [herr === 'buscapolos' ? 'Buscapolos' : 'Polímetro en V~'], do: ['El profesor enchufa la manguera y sube las protecciones.', ...ds], check, tension: true });

// ---------------------------------------------------------------- los proyectos
export const PROYECTOS = [
  {
    n: 1, id: 'luz', icon: '💡', title: 'Punto de luz simple', level: 'Iniciación', duration: '2 sesiones (2 h)', short: 'Una lámpara mandada por un interruptor, con caja de empalme y fichas WAGO.',
    intro: 'El circuito más básico de una vivienda: el interruptor corta la FASE de la lámpara. La fase y el neutro llegan del C1 (10 A, 1,5 mm²) a la caja de empalme; desde allí la fase va al interruptor y vuelve como «retorno» al portalámparas.',
    objectives: ['Identificar los bornes del interruptor: L (entrada de la fase) y ↓ (salida hacia la lámpara).', 'Conectar el portalámparas: fase al contacto central (L) y neutro a la rosca (N).', 'Empalmar en la caja con conectores de palanca del número de vías justo.', 'Comprobar con el polímetro y el buscapolos.'],
    caution: 'El interruptor SIEMPRE corta la fase: si cortara el neutro, la lámpara apagada seguiría con tensión.', circuito: 'C1 · alumbrado · PIA 10 A · cable 1,5 mm²',
    material: [['interruptor', 1], ['portalamparas', 1], ['caja', 1], ['wago2', 3], ['tubo16', 3], ['h07v15', 3, 'marrón, azul y negro'], ['pia10', 1, 'ya montado en el cuadro'], ['id', 1, 'ya montado en el cuadro']],
    herramientas: ['epi', 'taladro', 'nivel', 'flexometro', 'cortatubos', 'guia', 'pelacables', 'destornillador', 'multimetro', 'buscapolos'],
    modelo: () => crea({ mods: [['ID', 'id', 0], ['C1', 'mt10', 2]], piezas: { CE1: { type: 'caja', x: 58, y: 42, nombre: 'CE1' }, I1: { type: 'interruptor', x: 58, y: 20, nombre: 'Interruptor 1' }, B1: { type: 'bombilla', x: 58, y: 60, nombre: 'Lámpara 1' } },
      tubos: [['Q', 'CE1'], ['CE1', 'I1'], ['CE1', 'B1']], fichas: { CE1: { B1: 'w412', B2: 'w412', B3: 'w412' } },
      cables: [['f', 'C1:L', 'CE1:B1', 'marron'], ['n', 'C1:N', 'CE1:B2', 'azul'], ['fi', 'CE1:B1', 'I1:1', 'marron'], ['r1', 'I1:2', 'CE1:B3', 'negro'], ['r2', 'CE1:B3', 'B1:L', 'negro'], ['n2', 'CE1:B2', 'B1:N', 'azul']] }),
    mandos: ['I1'],
    pasos: () => [
      EPI(),
      FIJAR(['CE1', 'I1', 'B1'], ['Caja de empalme 100 × 100 mm', 'Interruptor en caja de superficie', 'Portalámparas E27'], ['Caja de empalme <b>CE1</b> en el centro; el <b>interruptor</b> debajo, a la altura de la mano; el <b>portalámparas</b> arriba.']),
      TUBO(3), GUIA(['Cable H07V-K 1,5 mm² marrón (fase)', 'Cable 1,5 mm² azul (neutro)', 'Cable 1,5 mm² negro (retorno)']),
      PELAR(11, 'las puntas que van a los conectores de la caja (y 10 mm las del interruptor y el portalámparas)'),
      T('Fase y neutro del C1 a la caja de empalme', 'alicate', { opts: ['alicate', 'destornillador:PZ2', 'cutter'], por: 'Los conectores de palanca no llevan tornillo: se abre la palanca, se mete el cable hasta el fondo y se cierra. El alicate sirve para enderezar las puntas.',
        take: ['2 conectores de palanca de 2 vías (tipo WAGO 221-412)'], do: ['Fase (<b>marrón</b>) del borne 2 del C1 (abajo) a la ficha 1 de CE1.', 'Neutro (<b>azul</b>) del borne N del C1 a la ficha 2.', 'Abre la palanca naranja, mete el cable pelado 11 mm hasta el tope y ciérrala.'],
        cables: ['f', 'n'], check: 'Tira suavemente de cada cable: no sale de la ficha.', foco: 'CE1', visor: 'CE1' }),
      T('Cablea el interruptor: L = entrada, ↓ = salida', 'destornillador:PZ1', { opts: ['destornillador:PZ1', 'destornillador:PZ2', 'destornillador:T20'], por: 'Los bornes de los mecanismos llevan tornillo mixto plano/Pozidriv PZ1 (0,8 N·m).',
        take: ['Interruptor (por detrás: bornes L y ↓)', '1 conector de 2 vías'], do: ['De la ficha de la fase, un cable <b>marrón</b> al borne marcado <b>L</b>.', 'Del borne marcado <b>↓</b> sale el <b>retorno</b> (negro) a la ficha 3 de la caja.', 'Aprieta con el destornillador PZ1: el cable no debe girar.'],
        cables: ['fi', 'r1'], check: 'Mirando el interruptor por detrás: marrón en L y negro en ↓.', foco: 'I1', visor: 'I1' }),
      PORTA(['r2', 'n2'], 'negro', 'de la ficha 3'),
      MIDE(['multimetro', 'buscapolos', 'destornillador:PZ1'], ['Interruptor apagado: entre la fase y el neutro del C1 → <b>OL</b> (circuito abierto, no hay cortocircuito).', 'Interruptor encendido: unos <b>70 Ω</b> (el filamento frío de la bombilla).'], 'Las medidas coinciden con la pestaña «Prueba».'),
      TENSION('buscapolos', ['buscapolos', 'alicate', 'pelacables'], ['Acciona el interruptor: la lámpara se enciende y se apaga.', 'Con la lámpara apagada, el buscapolos en el borne L del portalámparas <b>no se enciende</b>.'], 'Funciona y la lámpara apagada no tiene fase.'),
    ],
    pruebas: [OHM('Ω entre fase y neutro del C1 (interruptor apagado)', 'C1:L', 'C1:N', { I1: false }, 'OL'), OHM('Ω entre fase y neutro del C1 (interruptor encendido)', 'C1:L', 'C1:N', { I1: true }, '≈ 70 Ω'),
      VOL('V entre L y N del portalámparas, encendido', 'B1:L', 'B1:N', { I1: true }, '≈ 230 V'), BP('Buscapolos en L del portalámparas, apagado', 'B1:L', { I1: false }, 'no se enciende'), BP('Buscapolos en el borne L del interruptor', 'I1:1', { I1: false }, 'se enciende')],
    quiz: [
      { q: '¿Qué conductor corta el interruptor?', op: ['El neutro', 'La fase', 'La tierra'], ok: 1, exp: 'Siempre la fase: si cortara el neutro, la lámpara apagada seguiría con tensión.' },
      { q: '¿A qué borne del portalámparas va el neutro?', op: ['Al contacto central (L)', 'A la rosca (N)', 'Da igual'], ok: 1, exp: 'Neutro a la rosca; la fase (retorno) al contacto central, que no se toca al cambiar la bombilla.' },
      { q: '¿Qué sección y qué PIA lleva el circuito de alumbrado C1?', op: ['1,5 mm² y 10 A', '2,5 mm² y 16 A', '1,5 mm² y 16 A'], ok: 0, exp: 'ITC-BT-25: C1, 1,5 mm² protegido con 10 A.' },
      { q: 'En el interruptor, el borne marcado ↓ es…', op: ['La entrada de la fase', 'La salida hacia la lámpara (retorno)', 'El neutro'], ok: 1, exp: 'L = entrada; ↓ = salida hacia el receptor.' },
    ],
  },
  {
    n: 2, id: 'enchufe', icon: '🔌', title: 'Base de enchufe Schuko', level: 'Iniciación', duration: '1 sesión (1 h)', short: 'Una base Schuko 16 A con toma de tierra desde el C2 (2,5 mm²).',
    intro: 'Las bases de enchufe de uso general van en el circuito C2: magnetotérmico de 16 A y cable de 2,5 mm². La base Schuko tiene dos bornes de latón (L y N) y la tierra, que va a las garras laterales y al tornillo central.',
    objectives: ['Reconocer los bornes de la base Schuko: L, N y la tierra ⏚ (garras laterales y tornillo central).', 'Usar 2,5 mm² con su PIA de 16 A.', 'Entender para qué sirven la toma de tierra y el diferencial.'],
    caution: 'Sin tierra, un aparato con fuga deja su carcasa con tensión. Nunca dejes un enchufe sin el cable amarillo-verde.', circuito: 'C2 · tomas de uso general · PIA 16 A · cable 2,5 mm²',
    material: [['enchufe', 1], ['tubo20', 1], ['h07v25', 3, 'marrón, azul y amarillo-verde'], ['pia16', 1, 'ya montado en el cuadro'], ['id', 1, 'ya montado en el cuadro']],
    herramientas: ['epi', 'taladro', 'flexometro', 'cortatubos', 'guia', 'pelacables', 'destornillador', 'multimetro', 'buscapolos'],
    modelo: () => crea({ mods: [['ID', 'id', 0], ['C2', 'mt16', 2]], piezas: { E1: { type: 'enchufe', x: 62, y: 30, nombre: 'Enchufe 1' } }, tubos: [['Q', 'E1', 20]],
      cables: [['f', 'C2:L', 'E1:L', 'marron', 2.5], ['n', 'C2:N', 'E1:N', 'azul', 2.5], ['pe', 'Q:PE', 'E1:PE', 'tierra', 2.5]] }),
    mandos: [],
    pasos: () => [
      EPI(),
      FIJAR(['E1'], ['Base Schuko 2P+T 16 A en caja de superficie'], ['Coloca la caja del enchufe a la derecha del cuadro.']),
      TUBO(1, 20), GUIA(['Cable H07V-K 2,5 mm² marrón (fase)', 'Cable 2,5 mm² azul (neutro)', 'Cable 2,5 mm² amarillo-verde (tierra)']),
      PELAR(10, 'las tres puntas de la base (y 14 mm las del cuadro)'),
      T('Fase y neutro a los bornes de latón L y N', 'destornillador:PZ1', { opts: ['destornillador:PZ1', 'destornillador:T20', 'alicate'], por: 'Los bornes de la base llevan tornillo mixto PZ1/plano.',
        take: ['Base Schuko (por detrás: L, N y ⏚)'], do: ['Fase <b>marrón</b> del borne 2 del C2 al borne de latón marcado <b>L</b>.', 'Neutro <b>azul</b> del borne N del C2 al borne marcado <b>N</b>.', 'Respeta el marcado de la base aunque «funcionaría» al revés.'],
        cables: ['f', 'n'], check: 'Marrón en L, azul en N, bien apretados.', foco: 'E1', visor: 'E1' }),
      T('La tierra: barra del cuadro y borne ⏚ de la base', 'destornillador:PZ2', { opts: ['destornillador:PZ2', 'destornillador:plano3', 'pelacables'], por: 'La barra de tierra del cuadro lleva tornillos grandes: PZ2 (o plana de 5,5 mm).',
        take: ['Cable 2,5 mm² amarillo-verde'], do: ['Del borne de la <b>barra de tierra</b> del cuadro (⏚) al borne central ⏚ de la base.', 'Por dentro, el borne ⏚ une las <b>garras laterales</b> que tocan la tierra de la clavija.'],
        cables: ['pe'], check: 'El amarillo-verde llega de la barra ⏚ al borne central de la base.', foco: 'E1', visor: 'E1' }),
      MIDE(['multimetro', 'buscapolos', 'nivel'], ['Entre L y N de la base, sin nada enchufado → <b>OL</b>.', 'Entre el borne ⏚ de la base y la barra de tierra → <b>≈ 0 Ω</b>.'], 'Sin cortocircuitos y la tierra con continuidad.'),
      TENSION('multimetro', ['multimetro', 'destornillador:PZ1', 'cutter'], ['Mide 230 V entre L y N y entre L y ⏚; 0 V entre N y ⏚.', 'Pulsa el botón <b>T</b> del diferencial: tiene que saltar.'], '230 V en la base y el diferencial salta con T.'),
    ],
    pruebas: [OHM('Ω entre L y N de la base (sin aparato)', 'E1:L', 'E1:N', {}, 'OL'), OHM('Ω entre ⏚ de la base y la barra de tierra', 'E1:PE', 'Q:PE', {}, '≈ 0 Ω'),
      VOL('V entre L y N', 'E1:L', 'E1:N', {}, '≈ 230 V'), VOL('V entre L y ⏚', 'E1:L', 'E1:PE', {}, '≈ 230 V'), VOL('V entre N y ⏚', 'E1:N', 'E1:PE', {}, '≈ 0 V'), BP('Buscapolos en el borne L', 'E1:L', {}, 'se enciende')],
    quiz: [
      { q: '¿Qué sección y PIA llevan los enchufes de uso general (C2)?', op: ['1,5 mm² y 10 A', '2,5 mm² y 16 A', '4 mm² y 20 A'], ok: 1, exp: 'ITC-BT-25: C2, 2,5 mm² y 16 A.' },
      { q: '¿Para qué sirve la toma de tierra?', op: ['Para que el aparato gaste menos', 'Para derivar una fuga y que salte el diferencial', 'Hace de neutro'], ok: 1, exp: 'La carcasa no queda con tensión: la fuga va a tierra y el diferencial corta.' },
      { q: 'En la base Schuko, la tierra está en…', op: ['Los dos agujeros', 'Las garras laterales', 'El tornillo del marco'], ok: 1, exp: 'Las garras (patillas) laterales, unidas al borne central ⏚.' },
      { q: '¿De qué color es el conductor de protección?', op: ['Azul', 'Negro', 'Amarillo-verde'], ok: 2, exp: 'Amarillo-verde, solo para la tierra (ITC-BT-19).' },
    ],
  },
  {
    n: 3, id: 'luz-enchufe', icon: '🏠', title: 'Punto de luz y enchufe', level: 'Básico', duration: '2–3 sesiones (3 h)', short: 'Dos circuitos: C1 alumbrado (10 A) y C2 enchufes (16 A), cada uno con su sección.',
    intro: 'Una habitación sencilla: un punto de luz con interruptor (C1, 1,5 mm²) y una base de enchufe (C2, 2,5 mm²). Cada circuito sale de su magnetotérmico y va por su propio tubo.',
    objectives: ['Separar los circuitos C1 y C2 desde el cuadro.', 'Elegir la sección y el diámetro del tubo de cada circuito.', 'Comprobar con el polímetro que los circuitos no se tocan.'],
    caution: 'No mezcles conductores de distintos circuitos en la misma ficha.', circuito: 'C1 (10 A · 1,5 mm²) + C2 (16 A · 2,5 mm²)',
    material: [['interruptor', 1], ['portalamparas', 1], ['enchufe', 1], ['caja', 1], ['wago2', 3], ['tubo16', 3], ['tubo20', 1], ['h07v15', 3, 'marrón, azul y negro'], ['h07v25', 3, 'marrón, azul y amarillo-verde']],
    herramientas: ['epi', 'taladro', 'nivel', 'flexometro', 'cortatubos', 'guia', 'pelacables', 'destornillador', 'multimetro', 'buscapolos'],
    modelo: () => crea({ mods: [['ID', 'id', 0], ['C1', 'mt10', 2], ['C2', 'mt16', 3]], piezas: { CE1: { type: 'caja', x: 54, y: 44, nombre: 'CE1' }, I1: { type: 'interruptor', x: 54, y: 22, nombre: 'Interruptor 1' }, B1: { type: 'bombilla', x: 54, y: 62, nombre: 'Lámpara 1' }, E1: { type: 'enchufe', x: 84, y: 22, nombre: 'Enchufe 1' } },
      tubos: [['Q', 'CE1'], ['CE1', 'I1'], ['CE1', 'B1'], ['Q', 'E1', 20]], fichas: { CE1: { B1: 'w412', B2: 'w412', B3: 'w412' } },
      cables: [['f', 'C1:L', 'CE1:B1', 'marron'], ['n', 'C1:N', 'CE1:B2', 'azul'], ['fi', 'CE1:B1', 'I1:1', 'marron'], ['r1', 'I1:2', 'CE1:B3', 'negro'], ['r2', 'CE1:B3', 'B1:L', 'negro'], ['n2', 'CE1:B2', 'B1:N', 'azul'],
        ['ef', 'C2:L', 'E1:L', 'marron', 2.5], ['en', 'C2:N', 'E1:N', 'azul', 2.5], ['epe', 'Q:PE', 'E1:PE', 'tierra', 2.5]] }),
    mandos: ['I1'],
    pasos: () => [
      EPI(),
      FIJAR(['CE1', 'I1', 'B1', 'E1'], ['Caja de empalme 100 × 100', 'Interruptor', 'Portalámparas', 'Base Schuko'], ['Coloca CE1, el interruptor, el portalámparas y la base Schuko como en el plano.']),
      TUBO(4), GUIA(['C1: 1,5 mm² marrón, azul y negro', 'C2: 2,5 mm² marrón, azul y amarillo-verde']),
      T('C1: fase y neutro a la caja y cableado del interruptor', 'destornillador:PZ1', { opts: ['destornillador:PZ1', 'destornillador:PZ2', 'tijeras'], por: 'Bornes de mecanismo: PZ1.', take: ['3 conectores de palanca de 2 vías', 'Interruptor'],
        do: ['Del C1: marrón a la ficha 1 y azul a la ficha 2 de CE1.', 'Marrón de la ficha 1 al borne <b>L</b> del interruptor; negro del borne <b>↓</b> a la ficha 3.'], cables: ['f', 'n', 'fi', 'r1'], check: 'El interruptor corta la fase del C1.', foco: 'I1', visor: 'I1' }),
      PORTA(['r2', 'n2'], 'negro', 'de la ficha 3'),
      T('C2: la base de enchufe con tierra', 'destornillador:PZ1', { opts: ['destornillador:PZ1', 'destornillador:T20', 'cortatubos'], por: 'Bornes de la base: PZ1.', take: ['Base Schuko', 'Cables 2,5 mm²'],
        do: ['Del C2: marrón al borne <b>L</b> y azul al <b>N</b>.', 'Amarillo-verde de la barra ⏚ del cuadro al borne central ⏚.'], cables: ['ef', 'en', 'epe'], check: 'Base con L, N y tierra de 2,5 mm².', foco: 'E1', visor: 'E1' }),
      MIDE(['multimetro', 'buscapolos', 'guia'], ['L–N del C1 con el interruptor apagado: OL; encendido: ≈ 70 Ω.', 'L–N de la base: OL.'], 'Medidas como en «Prueba».'),
      TENSION('buscapolos', ['buscapolos', 'cutter', 'nivel'], ['Prueba la lámpara y mide 230 V en la base.', 'Baja el C1: la lámpara se apaga pero la base sigue con tensión.'], 'Cada PIA corta solo su circuito.'),
    ],
    pruebas: [OHM('Ω L–N del C1 (interruptor apagado)', 'C1:L', 'C1:N', { I1: false }, 'OL'), OHM('Ω L–N del C1 (encendido)', 'C1:L', 'C1:N', { I1: true }, '≈ 70 Ω'), OHM('Ω L–N de la base', 'E1:L', 'E1:N', {}, 'OL'),
      VOL('V en la base', 'E1:L', 'E1:N', {}, '≈ 230 V'), VOL('V en la lámpara encendida', 'B1:L', 'B1:N', { I1: true }, '≈ 230 V'), BP('Buscapolos en L de la lámpara apagada', 'B1:L', { I1: false }, 'no se enciende')],
    quiz: [
      { q: '¿Por qué el enchufe va en otro circuito que la luz?', op: ['Por estética', 'Porque necesita más sección y otro PIA (16 A)', 'No hace falta'], ok: 1, exp: 'C2 = 16 A y 2,5 mm²; C1 = 10 A y 1,5 mm².' },
      { q: 'Si bajas el C1…', op: ['Se apaga todo', 'Solo se queda sin tensión el alumbrado', 'Salta el diferencial'], ok: 1, exp: 'Cada magnetotérmico protege y corta su circuito.' },
      { q: '¿Qué tubo mínimo necesitan 3 cables de 2,5 mm² en superficie?', op: ['Ø16 mm', 'Ø20 mm', 'Ø32 mm'], ok: 1, exp: 'ITC-BT-21, tabla 5: Ø20 mm para 3 × 2,5 mm².' },
    ],
  },
  {
    n: 4, id: 'conmutada', icon: '🔀', title: 'Conmutada: luz desde dos sitios', level: 'Básico', duration: '2 sesiones (2 h)', short: 'Dos conmutadores encienden y apagan la misma lámpara (pasillo, dormitorio).',
    intro: 'Cada conmutador tiene un borne COMÚN (marcado L) y dos VIAJEROS (1 y 2). La fase entra por el común del primero, los dos viajeros unen los conmutadores y del común del segundo sale el retorno a la lámpara.',
    objectives: ['Identificar el común y los viajeros del conmutador.', 'Cablear una conmutada con caja de empalme.', 'Comprobar las 4 combinaciones de los conmutadores.'],
    caution: 'El común es distinto de los viajeros: si pones la fase en un viajero, la lámpara solo funciona en algunas posiciones.', circuito: 'C1 · alumbrado · 10 A · 1,5 mm²',
    material: [['conmutador', 2], ['portalamparas', 1], ['caja', 1], ['wago2', 5], ['tubo16', 4], ['h07v15', 4, 'marrón, azul, negro (viajeros) y gris (retorno)']],
    herramientas: ['epi', 'taladro', 'flexometro', 'cortatubos', 'guia', 'pelacables', 'destornillador', 'multimetro', 'buscapolos'],
    modelo: () => crea({ mods: [['ID', 'id', 0], ['C1', 'mt10', 2]], piezas: { CE1: { type: 'caja', x: 64, y: 44, nombre: 'CE1' }, CM1: { type: 'conmutador', x: 48, y: 22, nombre: 'Conmutador 1' }, CM2: { type: 'conmutador', x: 82, y: 22, nombre: 'Conmutador 2' }, B1: { type: 'bombilla', x: 64, y: 62, nombre: 'Lámpara 1' } },
      tubos: [['Q', 'CE1'], ['CE1', 'CM1'], ['CE1', 'CM2'], ['CE1', 'B1']], fichas: { CE1: { B1: 'w412', B2: 'w412', B3: 'w412', B4: 'w412', B5: 'w412' } },
      cables: [['f', 'C1:L', 'CE1:B1', 'marron'], ['n', 'C1:N', 'CE1:B2', 'azul'], ['c1', 'CE1:B1', 'CM1:C', 'marron'], ['v1', 'CM1:1', 'CE1:B3', 'negro'], ['v2', 'CM1:2', 'CE1:B4', 'negro'],
        ['v3', 'CE1:B3', 'CM2:1', 'negro'], ['v4', 'CE1:B4', 'CM2:2', 'negro'], ['r1', 'CM2:C', 'CE1:B5', 'gris'], ['r2', 'CE1:B5', 'B1:L', 'gris'], ['n2', 'CE1:B2', 'B1:N', 'azul']] }),
    mandos: ['CM1', 'CM2'],
    pasos: () => [
      EPI(),
      FIJAR(['CE1', 'CM1', 'CM2', 'B1'], ['2 conmutadores en caja de superficie', 'Caja de empalme', 'Portalámparas'], ['Un conmutador a cada lado (como en las dos puertas de un pasillo) y la caja en el centro.']),
      TUBO(4), GUIA(['1,5 mm²: marrón (fase), azul (neutro), 2 negros (viajeros) y gris (retorno)']),
      T('Fase al común del conmutador 1', 'destornillador:PZ1', { opts: ['destornillador:PZ1', 'destornillador:PZ2', 'buscapolos'], por: 'Bornes de mecanismo: PZ1.', take: ['Conmutador 1 (bornes L, 1 y 2)', '2 conectores de 2 vías'],
        do: ['Del C1, fase y neutro a las fichas 1 y 2 de CE1.', 'De la ficha 1, marrón al borne <b>común (L)</b> del conmutador 1.'], cables: ['f', 'n', 'c1'], check: 'La fase llega al común (borne L) del conmutador 1.', foco: 'CM1', visor: 'CM1' }),
      T('Los viajeros: 1 con 1 y 2 con 2', 'destornillador:PZ1', { opts: ['destornillador:PZ1', 'alicate', 'tijeras'], por: 'Bornes de mecanismo: PZ1.', take: ['4 cables negros', '2 conectores de 2 vías'],
        do: ['Borne <b>1</b> del conmutador 1 → ficha 3 → borne <b>1</b> del conmutador 2.', 'Borne <b>2</b> del conmutador 1 → ficha 4 → borne <b>2</b> del conmutador 2.'], cables: ['v1', 'v2', 'v3', 'v4'], check: 'Los viajeros unen los bornes 1 y 2 de los dos conmutadores.', foco: 'CM2', visor: 'CM2' }),
      PORTA(['r1', 'r2', 'n2'], 'gris', 'desde el común (L) del conmutador 2, pasando por la ficha 5,'),
      MIDE(['multimetro', 'buscapolos', 'taladro'], ['L–N del C1: la lámpara aparece (≈ 70 Ω) en 2 de las 4 combinaciones y OL en las otras 2.', 'Cada vez que mueves UN conmutador, cambia.'], 'Cualquier conmutador enciende y apaga.'),
      TENSION('buscapolos', ['buscapolos', 'nivel', 'guia'], ['Enciende y apaga desde cada conmutador.'], 'Funciona desde los dos sitios.'),
    ],
    pruebas: [OHM('Ω L–N del C1 · CM1 en 1, CM2 en 1', 'C1:L', 'C1:N', { CM1: 0, CM2: 0 }, '≈ 70 Ω'), OHM('Ω L–N del C1 · CM1 en 2, CM2 en 1', 'C1:L', 'C1:N', { CM1: 1, CM2: 0 }, 'OL'),
      VOL('V en la lámpara · los dos en 2', 'B1:L', 'B1:N', { CM1: 1, CM2: 1 }, '≈ 230 V'), BP('Buscapolos en el común de CM1', 'CM1:C', {}, 'se enciende')],
    quiz: [
      { q: '¿Cuántos bornes tiene un conmutador?', op: ['2', '3: común y dos viajeros', '4'], ok: 1, exp: 'Común (L) y viajeros 1 y 2.' },
      { q: '¿Dónde va la fase en una conmutada?', op: ['Al común del primer conmutador', 'A un viajero', 'A la lámpara'], ok: 0, exp: 'Fase al común del primero; del común del segundo sale el retorno.' },
      { q: 'Si cruzas los viajeros (1 con 2)…', op: ['No funciona nunca', 'Sigue funcionando (cambia qué posición enciende)', 'Salta el diferencial'], ok: 1, exp: 'Los viajeros son intercambiables entre sí, pero nunca con el común.' },
    ],
  },
  {
    n: 5, id: 'cruzamiento', icon: '✖️', title: 'Cruzamiento: luz desde tres sitios', level: 'Medio', duration: '2–3 sesiones (3 h)', short: 'Conmutador + cruzamiento + conmutador: una lámpara desde tres puntos.',
    intro: 'Para mandar una luz desde tres o más sitios se pone un CRUZAMIENTO entre los dos conmutadores. Tiene 4 bornes en dos pares: los viajeros del primer conmutador entran por 1 y 2, y salen por 3 y 4 hacia el segundo. Al accionarlo, une 1-3 y 2-4 o los cruza (1-4 y 2-3).',
    objectives: ['Distinguir los dos pares de bornes del cruzamiento.', 'Llevar los viajeros conmutador → cruzamiento → conmutador.', 'Comprobar las 8 combinaciones.'],
    caution: 'No mezcles un viajero de entrada con uno de salida en el mismo par: la lámpara haría cosas raras o habría un cortocircuito entre viajeros.', circuito: 'C1 · alumbrado · 10 A · 1,5 mm²',
    material: [['conmutador', 2], ['cruzamiento', 1], ['portalamparas', 1], ['caja', 1], ['wago2', 3], ['tubo16', 6], ['h07v15', 4, 'marrón, azul, negro (viajeros) y gris (retorno)']],
    herramientas: ['epi', 'taladro', 'flexometro', 'cortatubos', 'guia', 'pelacables', 'destornillador', 'multimetro', 'buscapolos'],
    modelo: () => crea({ mods: [['ID', 'id', 0], ['C1', 'mt10', 2]], piezas: { CE1: { type: 'caja', x: 66, y: 46, nombre: 'CE1' }, CM1: { type: 'conmutador', x: 46, y: 24, nombre: 'Conmutador 1' }, X1: { type: 'cruzamiento', x: 66, y: 24, nombre: 'Cruzamiento' }, CM2: { type: 'conmutador', x: 86, y: 24, nombre: 'Conmutador 2' }, B1: { type: 'bombilla', x: 66, y: 63, nombre: 'Lámpara 1' } },
      tubos: [['Q', 'CE1'], ['CE1', 'CM1'], ['CE1', 'CM2'], ['CE1', 'B1'], ['CM1', 'X1'], ['X1', 'CM2']], fichas: { CE1: { B1: 'w412', B2: 'w412', B3: 'w412' } },
      cables: [['f', 'C1:L', 'CE1:B1', 'marron'], ['n', 'C1:N', 'CE1:B2', 'azul'], ['c1', 'CE1:B1', 'CM1:C', 'marron'], ['v1', 'CM1:1', 'X1:1', 'negro'], ['v2', 'CM1:2', 'X1:2', 'negro'],
        ['v3', 'X1:3', 'CM2:1', 'negro'], ['v4', 'X1:4', 'CM2:2', 'negro'], ['r1', 'CM2:C', 'CE1:B3', 'gris'], ['r2', 'CE1:B3', 'B1:L', 'gris'], ['n2', 'CE1:B2', 'B1:N', 'azul']] }),
    mandos: ['CM1', 'X1', 'CM2'],
    pasos: () => [
      EPI(),
      FIJAR(['CE1', 'CM1', 'X1', 'CM2', 'B1'], ['2 conmutadores', '1 cruzamiento', 'Caja de empalme', 'Portalámparas'], ['Conmutador 1 a la izquierda, cruzamiento en el centro y conmutador 2 a la derecha.']),
      TUBO(6), GUIA(['1,5 mm²: marrón, azul, 4 negros (viajeros) y gris (retorno)']),
      T('Fase al común del conmutador 1', 'destornillador:PZ1', { opts: ['destornillador:PZ1', 'destornillador:plano5', 'alicate'], por: 'Bornes de mecanismo: PZ1.', take: ['Conmutador 1', '2 conectores de 2 vías'],
        do: ['Fase y neutro del C1 a las fichas 1 y 2 de CE1.', 'Marrón de la ficha 1 al <b>común (L)</b> del conmutador 1.'], cables: ['f', 'n', 'c1'], check: 'Fase en el común de CM1.', foco: 'CM1', visor: 'CM1' }),
      T('Viajeros al cruzamiento: entrada 1-2, salida 3-4', 'destornillador:PZ1', { opts: ['destornillador:PZ1', 'pelacables', 'destornillador:T20'], por: 'Bornes de mecanismo: PZ1.', take: ['Cruzamiento (bornes 1, 2 · 3, 4)', '4 cables negros'],
        do: ['Viajeros del conmutador 1 (bornes 1 y 2) a los bornes <b>1 y 2</b> del cruzamiento.', 'De los bornes <b>3 y 4</b> del cruzamiento a los viajeros 1 y 2 del conmutador 2.'], cables: ['v1', 'v2', 'v3', 'v4'], check: 'Un par entra (1-2) y el otro sale (3-4).', foco: 'X1', visor: 'X1' }),
      PORTA(['r1', 'r2', 'n2'], 'gris', 'desde el común del conmutador 2, por la ficha 3,'),
      MIDE(['multimetro', 'buscapolos', 'cortatubos'], ['Prueba combinaciones: cada vez que cambias UN mando, la medida L–N del C1 pasa de ≈ 70 Ω a OL o al revés.'], 'Cualquiera de los 3 mandos cambia el estado.'),
      TENSION('buscapolos', ['buscapolos', 'alicate', 'flexometro'], ['Enciende y apaga desde los tres sitios.'], 'Funciona desde los tres mandos.'),
    ],
    pruebas: [OHM('Ω L–N del C1 · todo en reposo', 'C1:L', 'C1:N', { CM1: 0, X1: 0, CM2: 0 }, '≈ 70 Ω'), OHM('Ω L–N del C1 · cruzamiento accionado', 'C1:L', 'C1:N', { CM1: 0, X1: 1, CM2: 0 }, 'OL'),
      VOL('V en la lámpara · cruzamiento y CM2 accionados', 'B1:L', 'B1:N', { CM1: 0, X1: 1, CM2: 1 }, '≈ 230 V'), BP('Buscapolos en el común de CM1', 'CM1:C', {}, 'se enciende')],
    quiz: [
      { q: '¿Cuántos bornes tiene el cruzamiento?', op: ['3', '4 (dos pares)', '2'], ok: 1, exp: 'Entrada 1-2 y salida 3-4.' },
      { q: 'Para encender desde 4 sitios necesitas…', op: ['4 conmutadores', '2 conmutadores y 2 cruzamientos', '4 cruzamientos'], ok: 1, exp: 'Siempre 2 conmutadores en los extremos y tantos cruzamientos como puntos intermedios.' },
      { q: '¿Dónde va la fase?', op: ['Al cruzamiento', 'Al común de un conmutador', 'A la lámpara'], ok: 1, exp: 'La fase entra por el común del primer conmutador.' },
    ],
  },
  {
    n: 6, id: 'minutero', icon: '⏱️', title: 'Pulsadores y minutero de escalera', level: 'Medio', duration: '2 sesiones (2 h)', short: 'Dos pulsadores en paralelo activan un automático de escalera que apaga la luz solo.',
    intro: 'En las escaleras y portales la luz se enciende con PULSADORES (contacto normalmente abierto, NA) y la apaga un MINUTERO (automático de escalera) pasado un tiempo. El minutero lleva fase (L) y neutro (N); los pulsadores, en paralelo, llevan la fase al borne 3 (orden) y la lámpara sale del borne ↓.',
    objectives: ['Diferenciar pulsador (NA, vuelve solo) e interruptor.', 'Conectar pulsadores en paralelo.', 'Conectar un minutero de 4 bornes (L, N, 3, ↓).'],
    caution: 'El telerruptor se parece al minutero pero no apaga solo: cambia de estado con cada pulsación. Aquí se usa el minutero.', circuito: 'C1 · alumbrado · 10 A · 1,5 mm²',
    material: [['pulsador', 2], ['minutero', 1], ['portalamparas', 1], ['caja', 1], ['wago5', 1], ['wago3', 2], ['wago2', 1], ['tubo16', 5], ['h07v15', 4, 'marrón, azul, negro y gris']],
    herramientas: ['epi', 'taladro', 'flexometro', 'cortatubos', 'guia', 'pelacables', 'destornillador', 'multimetro', 'buscapolos'],
    modelo: () => crea({ mods: [['ID', 'id', 0], ['C1', 'mt10', 2]], piezas: { CE1: { type: 'caja', x: 64, y: 46, nombre: 'CE1' }, PU1: { type: 'pulsador', x: 46, y: 24, nombre: 'Pulsador 1' }, MN: { type: 'minutero', x: 64, y: 24, nombre: 'Minutero' }, PU2: { type: 'pulsador', x: 84, y: 24, nombre: 'Pulsador 2' }, B1: { type: 'bombilla', x: 64, y: 63, nombre: 'Lámpara 1' } },
      tubos: [['Q', 'CE1'], ['CE1', 'PU1'], ['CE1', 'MN'], ['CE1', 'PU2'], ['CE1', 'B1']], fichas: { CE1: { B1: 'w415', B2: 'w413', B3: 'w413', B4: 'w412' } },
      cables: [['f', 'C1:L', 'CE1:B1', 'marron'], ['n', 'C1:N', 'CE1:B2', 'azul'], ['m1', 'CE1:B1', 'MN:L', 'marron'], ['m2', 'CE1:B2', 'MN:N', 'azul'], ['p1', 'CE1:B1', 'PU1:1', 'marron'], ['p2', 'CE1:B1', 'PU2:1', 'marron'],
        ['o1', 'PU1:2', 'CE1:B3', 'negro'], ['o2', 'PU2:2', 'CE1:B3', 'negro'], ['m3', 'CE1:B3', 'MN:3', 'negro'], ['m4', 'MN:4', 'CE1:B4', 'gris'], ['r2', 'CE1:B4', 'B1:L', 'gris'], ['n2', 'CE1:B2', 'B1:N', 'azul']] }),
    mandos: ['PU1', 'PU2', 'MN'],
    pasos: () => [
      EPI(),
      FIJAR(['CE1', 'PU1', 'MN', 'PU2', 'B1'], ['2 pulsadores', 'Minutero (automático de escalera)', 'Caja de empalme', 'Portalámparas'], ['Un pulsador a cada lado, el minutero en el centro.']),
      TUBO(5), GUIA(['1,5 mm²: marrón (fase), azul (neutro), negro (orden de los pulsadores) y gris (salida a la lámpara)']),
      T('Alimenta el minutero: L y N', 'destornillador:PZ1', { opts: ['destornillador:PZ1', 'destornillador:PH2', 'alicate'], por: 'Bornes de mecanismo: PZ1.', take: ['Minutero (bornes L, N, 3 y ↓)', 'Conector de 5 vías (fase) y de 3 vías (neutro)'],
        do: ['Fase del C1 a la ficha de <b>5 vías</b>; neutro a una de <b>3 vías</b>.', 'Marrón de la ficha de fase al borne <b>L</b> del minutero y azul al <b>N</b>.'], cables: ['f', 'n', 'm1', 'm2'], check: 'El minutero tiene fase en L y neutro en N.', foco: 'MN', visor: 'MN' }),
      T('Pulsadores en paralelo hacia el borne 3', 'destornillador:PZ1', { opts: ['destornillador:PZ1', 'cutter', 'buscapolos'], por: 'Bornes de mecanismo: PZ1.', take: ['2 pulsadores (bornes L y ↓)', 'Conector de 3 vías'],
        do: ['De la ficha de fase, un marrón al borne <b>L</b> de cada pulsador.', 'Del borne <b>↓</b> de cada pulsador, un negro a la misma ficha de 3 vías.', 'De esa ficha, un negro al borne <b>3</b> del minutero.'], cables: ['p1', 'p2', 'o1', 'o2', 'm3'], check: 'Cualquier pulsador lleva la fase al borne 3.', foco: 'PU1', visor: 'PU1' }),
      PORTA(['m4', 'r2', 'n2'], 'gris', 'desde el borne ↓ del minutero, por la ficha 4,'),
      MIDE(['multimetro', 'buscapolos', 'nivel'], ['L–N del C1 sin pulsar: el polímetro ve la bobina del minutero (decenas de kΩ), no un corto.', 'Pulsando: la resistencia no baja a 0 (el pulsador no hace corto).'], 'Sin cortocircuitos al pulsar.'),
      TENSION('buscapolos', ['buscapolos', 'pelacables', 'corte'], ['Pulsa cualquier pulsador: la lámpara se enciende y se apaga sola pasado el tiempo.'], 'Funciona desde los dos pulsadores.'),
    ],
    pruebas: [VOL('V entre el borne 3 y N del minutero · pulsando PU1', 'MN:3', 'MN:N', { PU1: true }, '≈ 230 V'), VOL('V entre el borne 3 y N · sin pulsar', 'MN:3', 'MN:N', {}, '≈ 0 V'),
      VOL('V en la lámpara · minutero activado', 'B1:L', 'B1:N', { MN: true }, '≈ 230 V'), BP('Buscapolos en el borne L del minutero', 'MN:L', {}, 'se enciende')],
    quiz: [
      { q: 'Un pulsador es un contacto…', op: ['Normalmente abierto (NA): cierra solo mientras lo pulsas', 'Que se queda encendido', 'Normalmente cerrado'], ok: 0, exp: 'Vuelve a su posición al soltarlo.' },
      { q: '¿Cómo se conectan varios pulsadores de escalera?', op: ['En serie', 'En paralelo', 'Cada uno a una lámpara'], ok: 1, exp: 'En paralelo: cualquiera da la orden.' },
      { q: 'Diferencia entre minutero y telerruptor:', op: ['Ninguna', 'El minutero apaga solo; el telerruptor cambia con cada pulsación', 'El telerruptor apaga solo'], ok: 1, exp: 'Minutero = temporizado; telerruptor = biestable.' },
    ],
  },
  {
    n: 7, id: 'cuadro', icon: '🗄️', title: 'Cuadro: IGA, diferencial y PIAs', level: 'Avanzado', duration: '3 sesiones (3 h)', short: 'Cablea tú el cuadro: manguera → IGA → ID → C1 y C2, entrada arriba y salida abajo.',
    intro: 'El cuadro de mando y protección reparte la instalación. La manguera llega al bornero; de ahí al IGA (interruptor general), luego al diferencial (ID 30 mA) y de él a los magnetotérmicos de cada circuito. En toda la aparamenta la ENTRADA va ARRIBA (bornes 1 y N) y la SALIDA ABAJO (2 y N).',
    objectives: ['Cablear el cuadro en orden: IGA → ID → PIAs.', 'Respetar entrada arriba / salida abajo y el borne N marcado.', 'Probar el diferencial con el botón T.'],
    caution: 'Si alimentas un aparato por abajo o cruzas fase y neutro en el diferencial, puede no proteger. Respeta el marcado.', circuito: 'IGA 25 A · ID 40 A/30 mA · C1 10 A · C2 16 A',
    material: [['cuadro', 1], ['iga', 1], ['id', 1], ['pia10', 1], ['pia16', 1], ['interruptor', 1], ['portalamparas', 1], ['enchufe', 1], ['caja', 1], ['wago2', 3], ['h07v25', 3, 'marrón, azul y amarillo-verde (cuadro)'], ['h07v15', 3, 'marrón, azul y negro']],
    herramientas: ['epi', 'destornillador', 'pelacables', 'corte', 'crimpadora', 'multimetro', 'buscapolos'],
    modelo: () => crea({ q: [28, 40], cab: true, mods: [['IGA', 'iga', 0, { In: 25 }], ['ID', 'id', 2], ['C1', 'mt10', 4], ['C2', 'mt16', 5]],
      piezas: { CE1: { type: 'caja', x: 68, y: 48, nombre: 'CE1' }, I1: { type: 'interruptor', x: 68, y: 26, nombre: 'Interruptor 1' }, B1: { type: 'bombilla', x: 68, y: 63, nombre: 'Lámpara 1' }, E1: { type: 'enchufe', x: 88, y: 26, nombre: 'Enchufe 1' } },
      tubos: [['Q', 'CE1'], ['CE1', 'I1'], ['CE1', 'B1'], ['Q', 'E1', 20]], fichas: { CE1: { B1: 'w412', B2: 'w412', B3: 'w412' } },
      cables: [['mL', 'M:L', 'IGA:Le', 'marron', 2.5], ['mN', 'M:N', 'IGA:Ne', 'azul', 2.5], ['mPE', 'M:PE', 'Q:PE', 'tierra', 2.5], ['gL', 'IGA:L', 'ID:Le', 'marron', 2.5], ['gN', 'IGA:N', 'ID:Ne', 'azul', 2.5],
        ['dL', 'ID:L', 'C1:Le', 'marron', 2.5], ['dN', 'ID:N', 'C1:Ne', 'azul', 2.5], ['pL', 'C1:Le', 'C2:Le', 'marron', 2.5], ['pN', 'C1:Ne', 'C2:Ne', 'azul', 2.5],
        ['f', 'C1:L', 'CE1:B1', 'marron'], ['n', 'C1:N', 'CE1:B2', 'azul'], ['fi', 'CE1:B1', 'I1:1', 'marron'], ['r1', 'I1:2', 'CE1:B3', 'negro'], ['r2', 'CE1:B3', 'B1:L', 'negro'], ['n2', 'CE1:B2', 'B1:N', 'azul'],
        ['ef', 'C2:L', 'E1:L', 'marron', 2.5], ['en', 'C2:N', 'E1:N', 'azul', 2.5], ['epe', 'Q:PE', 'E1:PE', 'tierra', 2.5]] }),
    mandos: ['I1'],
    pasos: () => [
      EPI(['Cuadro con IGA, ID y magnetotérmicos SIN cablear']),
      T('Manguera al bornero y tierra a la barra', 'destornillador:plano3', { opts: ['destornillador:plano3', 'destornillador:PZ2', 'taladro'], por: 'El bornero (regleta) de entrada lleva tornillo pequeño: plana 3,5 mm.', take: ['Manguera de 3 hilos con clavija', 'Cable 2,5 mm² amarillo-verde'],
        do: ['La manguera ya llega al bornero: marrón (L), azul (N) y amarillo-verde (PE).', 'Del borne PE del bornero, amarillo-verde a la <b>barra de tierra</b>.'], cables: ['mPE'], check: 'La tierra llega a la barra ⏚.', foco: 'M', visor: 'Q' }),
      PELAR(14, 'las puntas que van a la aparamenta (bornes de jaula)'),
      T('Bornero → IGA (entrada arriba)', 'destornillador:PZ2', { opts: ['destornillador:PZ2', 'destornillador:PZ1', 'destornillador:T20'], por: 'Los bornes de jaula del IGA, ID y PIAs se aprietan con PZ2 a unos 2 N·m.', take: ['IGA 25 A 1P+N', 'Cables 2,5 mm² marrón y azul'],
        do: ['Del bornero, marrón al borne <b>1 (arriba)</b> del IGA y azul al <b>N (arriba)</b>.'], cables: ['mL', 'mN'], check: 'El IGA se alimenta por ARRIBA y N con N.', foco: 'IGA', visor: 'Q' }),
      T('IGA → diferencial', 'destornillador:PZ2', { opts: ['destornillador:PZ2', 'alicate', 'destornillador:plano3'], por: 'Bornes de jaula: PZ2.', take: ['Diferencial 40 A 30 mA', 'Cables 2,5 mm²'],
        do: ['De la salida del IGA (abajo, 2 y N) a la entrada del ID (arriba, 1 y N).'], cables: ['gL', 'gN'], check: 'El neutro sigue siempre por los bornes N.', foco: 'ID', visor: 'Q' }),
      T('Diferencial → C1 y puente al C2', 'destornillador:PZ2', { opts: ['destornillador:PZ2', 'corte', 'destornillador:PZ1'], por: 'Bornes de jaula: PZ2.', take: ['C1 10 A y C2 16 A', 'Cables 2,5 mm² (o peine de conexión)'],
        do: ['De la salida del ID a la entrada (arriba) del C1.', 'Puentea la entrada del C1 con la del C2 (fase con fase y neutro con neutro).'], cables: ['dL', 'dN', 'pL', 'pN'], check: 'C1 y C2 alimentados por arriba desde el ID.', foco: 'C1', visor: 'Q' }),
      T('Circuitos: luz desde el C1 y enchufe desde el C2', 'destornillador:PZ1', { opts: ['destornillador:PZ1', 'guia', 'cortatubos'], por: 'Los mecanismos se aprietan con PZ1.', take: ['Interruptor, portalámparas, base Schuko, caja y fichas'],
        do: ['Repite el proyecto 3: del C1 (abajo) el punto de luz; del C2 (abajo) la base con su tierra.'], cables: ['f', 'n', 'fi', 'r1', 'r2', 'n2', 'ef', 'en', 'epe'], check: 'Como en el proyecto 3.', foco: 'CE1' }),
      MIDE(['multimetro', 'buscapolos', 'taladro'], ['Con los aparatos en ON y el interruptor apagado: L–N de la manguera → OL.', 'Tierra de la base con la PE de la manguera → ≈ 0 Ω.'], 'Sin cortocircuito y tierra continua.'),
      TENSION('multimetro', ['multimetro', 'alicate', 'cutter'], ['Mide 230 V a la salida de cada PIA.', 'Pulsa T en el diferencial: tiene que saltar y cortar todo.'], 'El ID salta con T.'),
    ],
    pruebas: [OHM('Ω L–N de la manguera · interruptor apagado', 'M:L', 'M:N', { I1: false }, 'OL'), OHM('Ω entre ⏚ de la base y PE de la manguera', 'E1:PE', 'M:PE', {}, '≈ 0 Ω'),
      VOL('V a la salida del C1', 'C1:L', 'C1:N', {}, '≈ 230 V'), VOL('V a la salida del C2', 'C2:L', 'C2:N', {}, '≈ 230 V'), VOL('V en la base', 'E1:L', 'E1:N', {}, '≈ 230 V')],
    quiz: [
      { q: '¿Por dónde se alimenta un magnetotérmico?', op: ['Por arriba (1 y N)', 'Por abajo', 'Da igual siempre'], ok: 0, exp: 'Entrada arriba, salida abajo: así lo marca el fabricante y lo pide el montaje ordenado.' },
      { q: '¿Qué orden lleva el cuadro?', op: ['PIA → ID → IGA', 'IGA → ID → PIAs', 'ID → PIAs → IGA'], ok: 1, exp: 'Primero el IGA, después el diferencial y luego los magnetotérmicos de cada circuito.' },
      { q: '¿Qué protege el diferencial de 30 mA?', op: ['Los cables', 'A las personas frente a derivaciones', 'La bombilla'], ok: 1, exp: 'Corta si se escapan más de 30 mA a tierra.' },
      { q: '¿Qué pasa si el neutro no pasa por el diferencial?', op: ['Nada', 'Salta siempre (desequilibrio) o no protege bien', 'Funciona mejor'], ok: 1, exp: 'El ID compara la corriente de fase y neutro: los dos tienen que atravesarlo.' },
    ],
  },
  {
    n: 8, id: 'vivienda', icon: '🏡', title: 'Vivienda completa (planta real)', level: 'Proyecto final', duration: '4–6 sesiones', short: 'Aplica todo en la planta de una vivienda: estancias, circuitos C1–C5 y presupuesto.',
    intro: 'Con lo aprendido, diseña la instalación de una vivienda real por estancias: puntos de luz, conmutadas, bases de enchufe, cocina y baño, cada uno en su circuito (C1–C5) y con su cuadro.',
    objectives: ['Elegir los puntos mínimos de cada estancia (ITC-BT-25).', 'Asignar cada receptor a su circuito.', 'Comprobar la instalación y entregarla.'],
    caution: 'Electrificación básica: C1 alumbrado 10 A, C2 tomas 16 A, C3 cocina-horno 25 A, C4 lavadora/lavavajillas/termo 20 A, C5 baño y cocina 16 A.', circuito: 'C1–C5 · electrificación básica',
    material: [['cuadro', 1], ['iga', 1], ['id', 1], ['pia10', 1], ['pia16', 2], ['interruptor', 3], ['conmutador', 2], ['enchufe', 6], ['portalamparas', 4]],
    herramientas: ['epi', 'destornillador', 'pelacables', 'multimetro', 'buscapolos'], casa: true, modelo: null, mandos: [],
    pasos: () => [
      T('Abre la planta de la vivienda', 'epi', { opts: ['epi', 'multimetro', 'taladro'], por: 'Primero se planifica: el plano y la lista de puntos por estancia.', take: ['El plano de la vivienda (modo «Vivienda real»)'], do: ['Pulsa <b>Abrir la vivienda</b> en la pestaña «Montaje».', 'Recorre las estancias: salón, dormitorios, cocina, baño y pasillo.'], check: 'Has visto todas las estancias.' }),
      T('Coloca los puntos de cada estancia', 'destornillador:PZ1', { opts: ['destornillador:PZ1', 'cortatubos', 'buscapolos'], por: 'Cada mecanismo con su punta.', take: ['Interruptores, conmutadores, bases y puntos de luz'], do: ['Pasillo: conmutada (proyecto 4).', 'Dormitorio: punto de luz y 3 bases (proyecto 3).', 'Cocina y baño: bases del C5 y C3/C4 para los grandes aparatos.'], check: 'Cada estancia con sus puntos mínimos.' }),
      T('Comprueba y entrega', 'multimetro', { opts: ['multimetro', 'pelacables', 'alicate'], por: 'Antes de entregar, pulsa «Comprobar»: revisa circuitos, secciones y protecciones.', take: ['La vivienda terminada'], do: ['Pulsa <b>Comprobar</b> y corrige lo que salga en rojo.', 'Entrega desde el propio modo vivienda.'], check: 'Todo en verde y entregado.' }),
    ],
    pruebas: [], quiz: [
      { q: '¿En qué circuito va el horno?', op: ['C2', 'C3 (25 A · 6 mm²)', 'C1'], ok: 1, exp: 'C3 cocina y horno: 25 A y 6 mm².' },
      { q: '¿Y la lavadora?', op: ['C4 (20 A · 4 mm²)', 'C1', 'C5'], ok: 0, exp: 'C4: lavadora, lavavajillas y termo.' },
      { q: 'Las bases del baño y de la encimera de la cocina van en…', op: ['C2', 'C5 (16 A · 2,5 mm²)', 'C3'], ok: 1, exp: 'C5: baño y cuarto de cocina.' },
    ],
  },
];
export const proyecto = (x) => PROYECTOS.find((p) => p.id === x || String(p.n) === String(x) || 'p' + p.n === x) || null;

// ---------------------------------------------------------------- material (render propio + foto real con licencia libre, ver créditos)
const F = (f) => `img/viv/fotos/${f}.jpg`;
export const MATERIAL = {
  interruptor: { n: 'Interruptor 10 AX', img: 'interruptor', foto: F('interruptor'), bornes: 'L (entrada de fase) · ↓ (salida al receptor)', ref: 'Tipo Simon 270, Schneider New Unica, Niessen Zenit' },
  conmutador: { n: 'Conmutador 10 AX', img: 'conmutador', foto: F('interruptor_inst'), bornes: 'L = común · 1 y 2 = viajeros', ref: 'Tipo Simon 270, Schneider New Unica' },
  cruzamiento: { n: 'Cruzamiento 10 AX', img: 'cruzamiento', foto: F('cruz_esquema'), bornes: '1-2 entrada · 3-4 salida (dos pares)', ref: 'Tipo Simon 270, Niessen Zenit' },
  pulsador: { n: 'Pulsador 10 A (NA)', img: 'pulsador', foto: F('interruptor'), bornes: 'L · ↓ (cierra solo mientras se pulsa)', ref: 'Tipo Simon 270, Legrand Niloé' },
  minutero: { n: 'Minutero (automático de escalera)', img: 'minutero', foto: F('minutero'), bornes: 'L · N · 3 (pulsadores) · ↓ (lámpara)', ref: 'Tipo Hager EMN001, Schneider MIN' },
  enchufe: { n: 'Base Schuko 2P+T 16 A', img: 'enchufe', foto: F('schuko_frente'), bornes: 'L y N de latón · ⏚ central unido a las garras laterales', ref: 'Tipo Schneider New Unica, Simon 270, Legrand Niloé' },
  portalamparas: { n: 'Portalámparas E27 + bombilla', img: 'portalamparas', foto: F('portalamparas'), bornes: 'L = contacto central · N = rosca', ref: 'Portalámparas de baquelita o termoplástico, bornes de tornillo' },
  caja: { n: 'Caja de empalme 100 × 100 mm', img: 'caja', foto: F('caja_superficie'), bornes: 'Sin bornes: dentro van las fichas', ref: 'Caja de superficie IP54 con conos' },
  wago2: { n: 'Conector de palanca 2 vías', img: 'wago2', foto: F('wago'), bornes: 'Pelar 11 mm · 0,2–4 mm²', ref: 'Tipo WAGO 221-412' },
  wago3: { n: 'Conector de palanca 3 vías', img: 'wago3', foto: F('wago'), bornes: 'Pelar 11 mm · 0,2–4 mm²', ref: 'Tipo WAGO 221-413' },
  wago5: { n: 'Conector de palanca 5 vías', img: 'wago5', foto: F('wago_mec'), bornes: 'Pelar 11 mm · 0,2–4 mm²', ref: 'Tipo WAGO 221-415' },
  tubo16: { n: 'Tubo corrugado Ø16 mm', img: 'tubo', foto: F('tubo'), bornes: 'Hasta 3 × 1,5 mm² o 3 × 2,5 mm² (con margen, ITC-BT-21)', ref: 'Tubo corrugado gris, grapas cada 50 cm' },
  tubo20: { n: 'Tubo corrugado Ø20 mm', img: 'tubo', foto: F('tubo_cables'), bornes: 'Para 3 × 2,5 mm² o más conductores', ref: 'Tubo corrugado gris' },
  h07v15: { n: 'Cable H07V-K 1,5 mm²', img: 'cables15', foto: F('punteras'), bornes: 'Alumbrado (C1) · PIA 10 A', ref: 'Marrón/negro/gris = fase · azul = neutro · amarillo-verde = tierra' },
  h07v25: { n: 'Cable H07V-K 2,5 mm²', img: 'cables25', foto: F('punteras'), bornes: 'Enchufes (C2) · PIA 16 A', ref: 'Marrón/negro/gris = fase · azul = neutro · amarillo-verde = tierra' },
  pia10: { n: 'Magnetotérmico 1P+N 10 A curva C', img: 'pia', foto: F('mt_carril'), bornes: 'Entrada arriba (1 y N) · salida abajo (2 y N)', ref: 'Tipo Hager, Schneider iC60, Legrand DX³' },
  pia16: { n: 'Magnetotérmico 1P+N 16 A curva C', img: 'pia', foto: F('mt'), bornes: 'Entrada arriba (1 y N) · salida abajo (2 y N)', ref: 'Tipo Hager, Schneider iC60, Legrand DX³' },
  id: { n: 'Diferencial 2P 40 A 30 mA', img: 'id', foto: F('diferencial'), bornes: 'Entrada arriba · salida abajo · botón T de prueba', ref: 'Tipo Hager CDA, Schneider iID' },
  iga: { n: 'IGA 1P+N 25 A', img: 'iga', foto: F('id_mt'), bornes: 'Entrada arriba · salida abajo', ref: 'Interruptor general automático' },
  cuadro: { n: 'Cuadro de superficie 12 módulos', img: 'cuadro', foto: F('id_mt'), bornes: 'Carril DIN, barra de tierra ⏚ y bornero de entrada', ref: 'Caja de distribución con puerta' },
};
export const FOTOS_HERRAMIENTA = { multimetro: F('multimetro'), buscapolos: F('buscapolos'), pelacables: F('pelacables'), destornillador: F('destornilladores'), corte: F('corte'), alicate: F('alicate'), crimpadora: F('punteras'), cortatubos: F('tubo') };

// ---------------------------------------------------------------- modelos por paso
const cache = new Map();
export function solucion(P) { if (!P.modelo) return null; if (!cache.has(P.id)) cache.set(P.id, P.modelo()); return clone(cache.get(P.id)); }
export const pasosDe = (P) => (P._pasos ||= P.pasos());
// Montaje parcial hasta el paso i (incluido): piezas a la vista desde que se colocan, tubos desde el paso del tubo y cables por pasos
export function modeloPaso(P, i) {
  const m = solucion(P); if (!m) return null; const S = pasosDe(P); const cab = new Set(); let tubos = false; const vistas = new Set(['Q', 'M', ...m.parts.filter((p) => TIPOS[p.type].modulo).map((p) => p.id)]);
  S.slice(0, i + 1).forEach((s) => { (s.cables || []).forEach((c) => cab.add(c)); if (s.herr === 'cortatubos') tubos = true; (s.muestra?.parts || []).forEach((x) => vistas.add(x)); if (s.foco) vistas.add(s.foco); (s.cables || []).forEach((cid) => { const c = m.cables.find((w) => w.id === cid); if (c) { vistas.add(c.a.p); vistas.add(c.b.p); } }); });
  if (S.slice(0, i + 1).some((s) => s.herr === 'taladro')) m.parts.forEach((p) => vistas.add(p.id));
  if (!S.some((s) => s.herr === 'cortatubos')) { tubos = true; m.parts.forEach((p) => vistas.add(p.id)); }
  m.parts = m.parts.filter((p) => vistas.has(p.id)); m.cables = m.cables.filter((c) => cab.has(c.id)); m.tubos = tubos ? m.tubos : [];
  return m;
}
// Montaje para el alumno: piezas colocadas y tubos puestos, sin cables
export function modeloMontar(P) { const m = solucion(P); if (!m) return null; m.cables = []; m.proyecto = P.id; return m; }

// ---------------------------------------------------------------- funcionamiento (tabla de verdad frente a la solución)
const ES_POS = new Set(['conmutador', 'cruzamiento']);
export function aplicar(m, est = {}) {
  const x = clone(m);
  for (const [id, v] of Object.entries(est)) { const p = partePorId(x, id); if (!p) continue; if (ES_POS.has(p.type)) p.pos = v ? 1 : 0; else p.on = !!v; }
  return x;
}
export function combinaciones(P) {
  const ids = P.mandos || []; const out = [];
  for (let b = 0; b < 1 << ids.length; b++) { const e = {}; ids.forEach((id, i) => { e[id] = (b >> i) & 1; }); out.push(e); }
  return out;
}
export function funcionamiento(m, est) {
  const r = simular(aplicar(m, est), { enchufada: true });
  return { luces: Object.fromEntries(r.bombillas.map((b) => [b.id, b.encendida])), enchufes: Object.fromEntries(r.enchufes.map((e) => [e.id, e.v > 150])), ordenes: Object.fromEntries(r.minuteros.map((x) => [x.id, x.v3 > 150])), disparos: r.disparos.map((d) => d.t), avisos: r.avisos };
}
const txtEst = (P, m, e) => Object.entries(e).map(([id, v]) => { const p = partePorId(m, id); const n = p?.nombre || id; return ES_POS.has(p?.type) ? `${n} en ${v ? '2' : '1'}` : `${n} ${p?.type === 'minutero' ? (v ? 'activado' : 'en reposo') : p?.type === 'pulsador' ? (v ? 'pulsado' : 'sin pulsar') : v ? 'encendido' : 'apagado'}`; }).join(', ');
// Los viajeros son intercambiables: un conmutador o cruzamiento con los viajeros cruzados funciona igual, solo cambia
// qué posición enciende. Se prueban esas inversiones y se queda la que menos fallos da.
export function comprobarFuncion(P, m) {
  const inv = (P.mandos || []).filter((id) => ES_POS.has(partePorId(m, id)?.type)); let mejor = null;
  for (let b = 0; b < 1 << inv.length; b++) { const f = fallosCon(P, m, new Set(inv.filter((_, i) => (b >> i) & 1))); if (!mejor || f.length < mejor.length) mejor = f; if (!f.length) break; }
  return mejor;
}
function fallosCon(P, m, invertidos) {
  const sol = solucion(P); const fallos = [];
  for (const e of combinaciones(P)) {
    const e2 = Object.fromEntries(Object.entries(e).map(([id, v]) => [id, invertidos.has(id) ? 1 - v : v]));
    const a = funcionamiento(sol, e), b = funcionamiento(m, e2);
    if (b.disparos.length && !a.disparos.length) { fallos.push(`Con ${txtEst(P, m, e) || 'la manguera enchufada'}: ${b.disparos[0]}`); continue; }
    for (const [id, on] of Object.entries(a.luces)) if (!!b.luces[id] !== on) fallos.push(`Con ${txtEst(P, m, e)}: ${partePorId(sol, id).nombre} debería estar ${on ? 'encendida' : 'apagada'} y está ${b.luces[id] ? 'encendida' : 'apagada'}`);
    for (const [id, on] of Object.entries(a.enchufes)) if (!!b.enchufes[id] !== on) fallos.push(`${partePorId(sol, id).nombre}: ${on ? 'no le llegan 230 V' : 'tiene tensión cuando no debería'}`);
    for (const [id, on] of Object.entries(a.ordenes)) if (!!b.ordenes[id] !== on) fallos.push(`Con ${txtEst(P, m, e)}: el borne 3 del minutero ${on ? 'no recibe la orden de los pulsadores' : 'recibe fase sin pulsar'}`);
  }
  return [...new Set(fallos)];
}

// ---------------------------------------------------------------- pistas: diferencias de conexiones con la solución
class UF { constructor() { this.p = new Map(); } f(x) { if (!this.p.has(x)) this.p.set(x, x); let r = x; while (this.p.get(r) !== r) r = this.p.get(r); this.p.set(x, r); return r; } u(a, b) { this.p.set(this.f(a), this.f(b)); } }
const kk = (r) => `${r.p}:${r.t}`;
function redesCables(m, swap = {}) {
  const uf = new UF(); const nom = (r) => { const s = swap[r.p]; return s && s[r.t] ? `${r.p}:${s[r.t]}` : kk(r); };
  for (const c of m.cables) uf.u(nom(c.a), nom(c.b));
  const g = new Map(); for (const key of uf.p.keys()) { if (/^CE\d*:B\d$/.test(key) || /^[A-Z]+\d*:B\d$/.test(key) && key.startsWith('CE')) continue; const r = uf.f(key); if (!g.has(r)) g.set(r, new Set()); g.get(r).add(key); }
  return { uf, grupos: [...g.values()].filter((s) => s.size) };
}
const SWAPS = { conmutador: [{ 1: '2', 2: '1' }], cruzamiento: [{ 1: '2', 2: '1' }, { 3: '4', 4: '3' }, { 1: '2', 2: '1', 3: '4', 4: '3' }] };
function difs(sol, m, swap) {
  const S = redesCables(sol).grupos; const A = redesCables(m, swap); const out = [];
  const esCaja = (key) => /^CE\d+:/.test(key);
  for (const g of S) { const ks = [...g].filter((x) => !esCaja(x)); for (let i = 1; i < ks.length; i++) if (!A.uf.p.has(ks[0]) || !A.uf.p.has(ks[i]) || A.uf.f(ks[0]) !== A.uf.f(ks[i])) out.push({ falta: [ks[0], ks[i]] }); }
  const solUF = redesCables(sol).uf;
  for (const g of A.grupos) { const ks = [...g].filter((x) => !esCaja(x)); for (let i = 0; i < ks.length; i++) for (let j = i + 1; j < ks.length; j++) if (!solUF.p.has(ks[i]) || !solUF.p.has(ks[j]) || solUF.f(ks[i]) !== solUF.f(ks[j])) out.push({ sobra: [ks[i], ks[j]] }); }
  return out;
}
export function pistas(P, m) {
  const sol = solucion(P); if (!sol) return [];
  let swap = {}; let best = difs(sol, m, swap);
  for (const p of m.parts.filter((x) => SWAPS[x.type])) for (const s of SWAPS[p.type]) { const t = { ...swap, [p.id]: s }; const d = difs(sol, m, t); if (d.length < best.length) { best = d; swap = t; } }
  const nb = (key) => { const [p, t] = key.split(':'); return nombreBorne(sol, { p, t }); };
  return best.slice(0, 6).map((d) => (d.falta ? `Falta unir ${nb(d.falta[0])} con ${nb(d.falta[1])}` : `${nb(d.sobra[0])} está unido con ${nb(d.sobra[1])} y no debería`));
}
export function comprobarProyecto(P, m, opts = {}) {
  const fallos = comprobarFuncion(P, m); const gen = comprobar(m, { iga: P.id === 'cuadro', ...opts });
  const items = [{ ok: !fallos.length, t: fallos.length ? `No funciona como debe: ${fallos[0]}${fallos.length > 1 ? ` (y ${fallos.length - 1} fallo${fallos.length > 2 ? 's' : ''} más)` : ''}` : 'Funciona como el montaje real en todas las posiciones de los mandos', k: 'funciona', fallos }, ...gen.items];
  return { ok: items.every((x) => x.ok), items, pistas: fallos.length ? pistas(P, m) : [] };
}

// ---------------------------------------------------------------- pruebas con el polímetro y el buscapolos
const ref = (s) => { const [p, t] = s.split(':'); return { p, t }; };
export function medirPrueba(P, pr, m0 = solucion(P)) {
  const m = aplicar(m0, pr.estado || {});
  if (pr.modo === 'bp') { const r = simular(m, { enchufada: true }); const v = Math.abs(r.V(kk(ref(pr.a))) ?? 0); return { txt: v > 50 ? 'se enciende' : 'no se enciende', v, ok: (v > 50) === (pr.espera === 'se enciende') }; }
  if (pr.modo === 'ohm') { const r = medir(m, { enchufada: false }, ref(pr.a), ref(pr.b), 'ohm'); const x = r.r; const txt = !isFinite(x) ? 'OL' : x < 2 ? '≈ 0 Ω' : x < 1000 ? `≈ ${Math.round(x)} Ω` : `≈ ${Math.round(x / 1000)} kΩ`; return { txt, r: x, ok: cerca(txt, pr.espera) }; }
  const r = medir(m, { enchufada: true }, ref(pr.a), ref(pr.b), 'V'); const v = r.v ?? 0; const txt = `≈ ${Math.round(v)} V`; return { txt, v, ok: cerca(txt, pr.espera) };
}
function cerca(a, b) {
  if (a === b) return true; if (a === 'OL' || b === 'OL') return false;
  const n = (s) => parseFloat(String(s).replace(/[^\d.,]/g, '').replace(',', '.')); const x = n(a), y = n(b); if (y === 0) return x < 10;
  return Math.abs(x - y) / y < 0.25 && /k/.test(a) === /k/.test(b);
}

// ---------------------------------------------------------------- plano 2D (esquema de montaje con los colores reales)
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
export function tablaCables(P, m = solucion(P)) {
  if (!m) return [];
  return m.cables.map((c) => ({ id: c.id, de: nombreBorne(m, c.a), a: nombreBorne(m, c.b), color: COLORES[c.color]?.n || c.color, hex: COLORES[c.color]?.hex, sec: String(c.sec).replace('.', ',') + ' mm²' }));
}
export function planoSVG(m, { sel = null, k = 9 } = {}) {
  if (!m) return '';
  const D = dims(m); const W = D.w * k, H = D.h * k; const X = (x) => x * k, Y = (y) => (D.h - y) * k;
  let s = `<svg class="viv-plano" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" font-family="Inter,Arial,sans-serif"><rect width="${W}" height="${H}" rx="10" fill="#e9d3ae" stroke="#b08a57" stroke-width="3"/>`;
  for (const t of m.tubos) { const r = rutaTubo(m, t.a, t.b); if (!r?.pts) continue; s += `<polyline points="${r.pts.map((p) => `${X(p.x)},${Y(p.y)}`).join(' ')}" fill="none" stroke="#9aa1a8" stroke-width="${(t.d || 16) * 0.9}" stroke-linecap="round" opacity=".55"/>`; }
  for (const p of m.parts) {
    if (TIPOS[p.type].modulo || p.type === 'manguera') continue; const c = posParte(m, p); const d = medidas(p);
    const fill = p.type === 'cuadro' ? '#f4f6f8' : p.type === 'caja' ? '#d9dde1' : '#fbfbf8';
    s += `<g class="pl-p${sel === p.id ? ' sel' : ''}" data-id="${p.id}"><rect x="${X(c.x - d.w / 2)}" y="${Y(c.y + d.h / 2)}" width="${d.w * k}" height="${d.h * k}" rx="${p.type === 'bombilla' ? d.w * k / 2 : 8}" fill="${fill}" stroke="${sel === p.id ? '#e1251b' : '#555'}" stroke-width="${sel === p.id ? 4 : 2}"/>`;
    s += `<text x="${X(c.x)}" y="${Y(c.y - d.h / 2) + 18}" text-anchor="middle" font-size="15" font-weight="700" fill="#222">${esc(p.nombre || TIPOS[p.type].corto)}</text></g>`;
  }
  for (const p of m.parts.filter((x) => TIPOS[x.type].modulo)) { const c = posParte(m, p); const w = (TIPOS[p.type].mods || 1) * 1.8; s += `<rect x="${X(c.x - w / 2) + 1}" y="${Y(c.y + 4.2)}" width="${w * k - 2}" height="${8.4 * k}" rx="3" fill="#fff" stroke="#777"/><text x="${X(c.x)}" y="${Y(c.y)}" text-anchor="middle" font-size="11" font-weight="700">${esc(p.nombre.split(' ')[0])}</text>`; }
  m.cables.forEach((c, i) => { const r = rutaCable(m, c); if (!r?.pts) return; const col = COLORES[c.color] || COLORES.negro; const off = ((i % 5) - 2) * 2.2;
    const pts = r.pts.map((p) => `${X(p.x) + off},${Y(p.y) + off}`).join(' ');
    s += `<polyline points="${pts}" fill="none" stroke="${col.hex}" stroke-width="${c.sec >= 2.5 ? 5 : 3.6}" stroke-linejoin="round" stroke-linecap="round"/>`;
    if (col.raya) s += `<polyline points="${pts}" fill="none" stroke="${col.raya}" stroke-width="${c.sec >= 2.5 ? 5 : 3.6}" stroke-dasharray="6 6"/>`; });
  const usados = new Set(m.cables.flatMap((c) => [kk(c.a), kk(c.b)]));
  for (const p of m.parts) for (const b of bornes(p)) { const key = `${p.id}:${b.t}`; if (!usados.has(key) && p.type !== 'caja') continue; const q = posBorne(m, { p: p.id, t: b.t }); if (!q) continue;
    const lab = p.type === 'caja' ? b.t.slice(1) : ({ 2: '↓', C: 'L', Le: '1', Ne: 'N', PE: '⏚' })[b.t] && !['conmutador', 'cruzamiento', 'minutero'].includes(p.type) ? ({ 2: '↓', C: 'L', Le: '1', Ne: 'N', PE: '⏚' })[b.t] : b.t === 'C' ? 'L' : b.t === '4' && p.type === 'minutero' ? '↓' : b.t === 'PE' ? '⏚' : b.t;
    s += `<circle cx="${X(q.x)}" cy="${Y(q.y)}" r="6" fill="${p.type === 'caja' ? (p.fichas?.[b.t] ? '#f39200' : '#bbb') : '#c9a227'}" stroke="#333"/><text x="${X(q.x)}" y="${Y(q.y) - 9}" text-anchor="middle" font-size="12" font-weight="800" fill="#111" paint-order="stroke" stroke="#fff" stroke-width="3">${esc(lab)}</text>`; }
  return s + '</svg>';
}

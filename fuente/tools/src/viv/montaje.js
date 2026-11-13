// Modo «Montaje paso a paso» (juego): el alumno monta en el tablero del taller un punto de luz con interruptor y un enchufe,
// eligiendo en cada paso la herramienta correcta del cinturón (y la punta o la longitud de pelado cuando toca).
// Cada herramienta es la del kit 3D realista compartido con «Actividades». Los fallos, el tiempo y la nota se guardan
// y se pueden entregar al profesor (práctica v4).
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { estudio, camaraSuave } from '../kit3d/escena.js';
import { entorno, pbr, MATS, maderaTex, caja as cajaK, calidad } from '../kit3d/base.js';
import { conductor, tuboCorrugado, grapa, manguera, rollo } from '../kit3d/cables.js';
import { KIT_HERRAMIENTAS } from '../kit3d/herramientas.js';
import { mecanismo3D, bombilla3D, cajaEmpalme3D, herramienta3D } from './modelos3d.js';
import { posicionesCaja } from './modelo.js';
import { PUNTAS } from './catalogo.js';

const esc = (t) => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const V = (x, y, z = 0) => new THREE.Vector3(x, y, z);
const LS = 'viv:v1:montaje';

// ---------------------------------------------------------------- herramientas del cinturón
export const CINTO = [
  ['epi', '🥽', 'Gafas y guantes (EPI)'], ['flexometro', '📏', 'Flexómetro'], ['nivel', '📐', 'Nivel'], ['taladro', '🔩', 'Taladro-atornillador'],
  ['cortatubos', '✂', 'Tijera cortatubos'], ['guia', '🧵', 'Guía pasacables'], ['alicate_corte', '✂️', 'Alicate de corte'], ['alicate_universal', '🗜️', 'Alicate universal'],
  ['alicate_punta', '📍', 'Alicate de punta'], ['cutter', '🔪', 'Cutter'], ['tijeras', '✂️', 'Tijeras'], ['pelacables', '🧤', 'Pelacables'], ['crimpadora', '🔧', 'Crimpadora'],
  ['destornillador', '🪛', 'Destornillador'], ['buscapolos', '🔦', 'Buscapolos'], ['multimetro', '📟', 'Polímetro'], ['mano', '🖐', 'Con la mano'],
];
export const NOMBRE_HERR = Object.fromEntries(CINTO.map(([id, , n]) => [id, n]));
const MM = [5, 8, 10, 11, 14, 20];

// ---------------------------------------------------------------- el tablero (cm, origen abajo a la izquierda)
const TAB = { w: 110, h: 70 };
const POS = { I: [24, 32], CE: [55, 52], B: [90, 52], E: [90, 26] };
const TUBOS = {
  T0: [[-6, 52], [49.6, 52]],
  T1: [[52, 46.6], [52, 41], [24, 41], [24, 36.3]],
  T2: [[60.4, 52], [86, 52]],
  T3: [[58, 46.6], [58, 26], [85.7, 26]],
};
const largo = (P) => P.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - P[i][0], p[1] - P[i][1]), 0);
// conductores que llegan a cada caja (color, tubo por el que entran, borne de destino)
const COLAS = {
  I: [['marron', 'T1', '1'], ['negro', 'T1', '2']],
  B: [['negro', 'T2', 'L'], ['azul', 'T2', 'N']],
  E: [['marron', 'T3', 'L'], ['azul', 'T3', 'N'], ['tierra', 'T3', 'PE']],
  CE: [['marron', 'T0', 'B1'], ['azul', 'T0', 'B3'], ['tierra', 'T0', 'B4'], ['marron', 'T1', 'B1'], ['negro', 'T1', 'B2'], ['negro', 'T2', 'B2'], ['azul', 'T2', 'B3'], ['marron', 'T3', 'B1'], ['azul', 'T3', 'B3'], ['tierra', 'T3', 'B4']],
};
const FICHAS_CE = { B1: 'w413', B2: 'w412', B3: 'w413', B4: 'w412' };

// ---------------------------------------------------------------- los pasos
// herr: herramienta correcta · punta / mm: elección que hay que acertar además · foco: dónde mira la cámara
export const PASOS = [
  { id: 'epi', n: 'Protección', txt: 'Antes de empezar a cortar y taladrar, protégete los ojos y las manos.', herr: 'epi', foco: 'tablero', ok: 'Gafas puestas: las virutas del taladro y los trozos de cable que salen al cortar van a la cara.' },
  { id: 'medir', n: 'Medir y marcar', txt: 'Mide y marca en el tablero dónde va cada caja (interruptor, enchufe, punto de luz y caja de empalme).', herr: 'flexometro', foco: 'CE', ok: 'Marcas hechas a la medida del plano.' },
  { id: 'nivel', n: 'Nivelar', txt: 'Comprueba que las marcas del interruptor quedan rectas antes de fijar la caja.', herr: 'nivel', foco: 'I', ok: 'La burbuja queda entre las dos rayas: la caja irá recta.' },
  { id: 'taladrar', n: 'Fijar las cajas', txt: 'Taladra y atornilla las cajas de superficie y la caja de empalme al tablero.', herr: 'taladro', foco: 'CE', ok: 'Cajas fijadas con dos tornillos cada una.' },
  { id: 'medirTubo', n: 'Medir el tubo', txt: 'Mide cada tramo de tubo corrugado, de caja a caja.', herr: 'flexometro', foco: 'T3', ok: 'Tramos medidos: T1 {T1} cm, T2 {T2} cm y T3 {T3} cm.' },
  { id: 'cortarTubo', n: 'Cortar el tubo', txt: 'Corta los tramos de tubo a la medida.', herr: 'cortatubos', foco: 'T3', ok: 'Corte recto y sin aplastar el tubo.' },
  { id: 'grapas', n: 'Grapar el tubo', txt: 'Fija los tubos al tablero con grapas: como mucho cada 50 cm y una cerca de cada caja.', herr: 'taladro', foco: 'T2', ok: 'Tubos grapados y metidos en los conos de las cajas.' },
  { id: 'guia', n: 'Pasar los cables', txt: 'Pasa la guía por el tubo, engancha las puntas de los cables y tira de ellos.', herr: 'guia', foco: 'T1', ok: 'Cables pasados: fase marrón, retorno negro, neutro azul y tierra amarillo-verde.' },
  { id: 'cortarCable', n: 'Cortar a medida', txt: 'Corta los cables dejando unos 15 cm de reserva en cada caja.', herr: 'alicate_corte', foco: 'CE', ok: 'Con 15 cm de reserva puedes volver a pelar si te equivocas.' },
  { id: 'cubierta', n: 'Abrir la manguera', txt: 'Quita la cubierta exterior de la manguera de entrada sin dañar los hilos.', herr: 'cutter', foco: 'T0', ok: 'Cubierta abierta cortando hacia fuera: los tres hilos quedan sanos.' },
  { id: 'pelar', n: 'Pelar (mecanismos)', txt: 'Pela las puntas de los cables que van a los bornes del interruptor, el enchufe y el portalámparas. ¿Cuántos milímetros?', herr: 'pelacables', mm: 10, foco: 'I', ok: 'Pelado de 10 mm (9–12 mm): el cobre entra entero en el borne y el aislante llega justo hasta él.' },
  { id: 'empalmar', n: 'Empalmar en la caja', txt: 'Pela las puntas de la caja de empalme y únelas con conectores de palanca (fase, retorno, neutro y tierra). ¿Cuánto pelas?', herr: 'pelacables', mm: 11, foco: 'CE', ok: 'Pelado de 11 mm, el que marca el conector de palanca. Cada conductor en su conector.' },
  { id: 'conectar', n: 'Conectar los bornes', txt: 'Mete cada cable en su borne: L y ↓ en el interruptor; L, N y ⏚ en el enchufe; L y N en el portalámparas.', herr: 'mano', foco: 'E', ok: 'Cada cable en su borne, mirando el marcado de detrás del mecanismo.' },
  { id: 'apretar', n: 'Apretar los bornes', txt: 'Aprieta los tornillos de los bornes de los mecanismos. Elige la punta.', herr: 'destornillador', punta: ['PZ1', 'plano3'], foco: 'E', ok: 'Bornes apretados con PZ1 (o plana de 3,5 mm) a unos 0,8 N·m: tira del cable para comprobar que no se sale.' },
  { id: 'garras', n: 'Fijar los mecanismos', txt: 'Mete cada mecanismo en su caja y fíjalo con los tornillos del bastidor.', herr: 'destornillador', punta: ['PZ1', 'PH1', 'PH2', 'plano5'], foco: 'I', ok: 'Mecanismos fijados y rectos, con los cables recogidos dentro de la caja.' },
  { id: 'marco', n: 'Marco y tecla', txt: 'Coloca el marco y la tecla o la tapa del enchufe (van a presión).', herr: 'mano', foco: 'I', ok: 'Marcos y teclas puestos.' },
  { id: 'tapa', n: 'Tapa de registro', txt: 'Cierra la caja de empalme con su tapa de registro.', herr: 'destornillador', punta: ['plano5', 'PH2'], foco: 'CE', ok: 'Caja cerrada: los empalmes nunca quedan a la vista.' },
  { id: 'bombilla', n: 'Bombilla', txt: 'Enrosca la bombilla en el portalámparas.', herr: 'mano', foco: 'B', ok: 'Bombilla puesta.' },
  { id: 'continuidad', n: 'Comprobar sin tensión', txt: 'Sin enchufar la manguera, comprueba que no hay cortocircuito entre la fase y el neutro del enchufe.', herr: 'multimetro', foco: 'E', ok: 'El polímetro en Ω marca «OL» entre L y N: no hay cortocircuito.' },
  { id: 'buscapolos', n: 'Localizar la fase', txt: 'El profesor enchufa la manguera: localiza la fase del enchufe.', herr: 'buscapolos', foco: 'E', ok: 'La lámpara del buscapolos se enciende en el agujero de la izquierda: ahí está la fase.' },
  { id: 'tension', n: 'Medir y probar', txt: 'Mide la tensión del enchufe y enciende la luz con el interruptor.', herr: 'multimetro', foco: 'E', ok: '230 V entre fase y neutro. ¡La luz se enciende con el interruptor!' },
];
const PISTA = {
  epi: 'Lo primero es la seguridad: busca el equipo de protección.', flexometro: 'Para medir y marcar se usa el metro.', nivel: 'Para que quede recto…', taladro: 'Para agujerear el tablero y atornillar cajas o grapas se usa una máquina.',
  cortatubos: 'El tubo corrugado se corta con una tijera especial.', guia: 'Por dentro del tubo no se pueden empujar los cables: hay que tirar de ellos.', alicate_corte: 'Para cortar cable de 1,5–2,5 mm² se usa un alicate concreto.',
  cutter: 'La cubierta de la manguera se abre con una hoja, cortando hacia fuera.', pelacables: 'El pelacables con tope pela sin dañar el cobre.', mano: 'Este paso no necesita herramienta.',
  destornillador: 'Este paso es de tornillos.', buscapolos: 'Para saber cuál es la fase rápidamente…', multimetro: 'Para medir resistencia o tensión.',
};
export const nota = (errores, seg) => Math.max(0, Math.round((10 - errores * 0.5 - (seg > 1200 ? 1 : 0)) * 4) / 4);
export const estrellas = (errores) => (errores === 0 ? 3 : errores <= 3 ? 2 : 1);

export class Montaje {
  constructor(lab) { this.lab = lab; this.sel = null; this.punta = 'PZ1'; this.mm = 10; this.labels = []; this.cargarEstado(); }
  cargarEstado(e) {
    let s = e; if (!s) try { s = JSON.parse(localStorage.getItem(LS)); } catch (er) { s = null; }
    s = s && typeof s === 'object' ? s : {};
    this.hecho = new Set(Array.isArray(s.hecho) ? s.hecho.filter((id) => PASOS.some((p) => p.id === id)) : []);
    this.errores = Number.isFinite(+s.errores) ? +s.errores : 0; this.seg = Number.isFinite(+s.seg) ? +s.seg : 0;
    this.log = Array.isArray(s.log) ? s.log.slice(0, 200) : []; this.msg = null;
  }
  guardar() { try { localStorage.setItem(LS, JSON.stringify(this.datos())); } catch (e) { /* sin almacenamiento */ } }
  datos() { return { hecho: [...this.hecho], errores: this.errores, seg: Math.round(this.seg), log: this.log }; }
  get paso() { return PASOS.find((p) => !this.hecho.has(p.id)) || null; }
  get acabado() { return this.hecho.size >= PASOS.length; }
  reiniciar() { this.hecho = new Set(); this.errores = 0; this.seg = 0; this.log = []; this.msg = null; this.sel = null; this.guardar(); this.construir(); this.enfocar(); }

  // ------------------------------------------------------------ escena
  init(renderer) {
    if (this.scene) return;
    this.renderer = renderer; const Q = calidad();
    const s = this.scene = new THREE.Scene(); s.background = new THREE.Color(0xd9dde0); s.fog = new THREE.Fog(0xd9dde0, 420, 900);
    // luz de estudio común (referencia: laboratorio ESP32), con la sombra suave centrada en el tablero
    const est = estudio(null, s, { escala: 130, dir: [80, 260, 220], objetivo: [0, 120, 0], sombraR: 125, intPrincipal: 2.0, intCielo: 1.15, suelo: 0x7a6a56, colorPrincipal: 0xfff4e6, bias: -0.0004, sombras: Q.sombras, entorno: false });
    entorno(renderer, s, 0.5); const d = est.principal;
    this.camera = new THREE.PerspectiveCamera(36, 1, 1, 2000);
    const c = this.controls = new OrbitControls(this.camera, renderer.domElement); camaraSuave(c, { polarMax: false, min: 18, max: 330 }); c.enabled = false;
    c.minPolarAngle = 0.5; c.maxPolarAngle = 2.0; c.minAzimuthAngle = -1.0; c.maxAzimuthAngle = 1.0; c.screenSpacePanning = true;
    c.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN };
    // sala: suelo, pared y banco de trabajo con los materiales
    const suelo = new THREE.Mesh(new THREE.PlaneGeometry(900, 700), pbr(0x8f8a84, { roughness: 0.92 })); suelo.rotation.x = -Math.PI / 2; suelo.receiveShadow = true; s.add(suelo);
    const pared = new THREE.Mesh(new THREE.PlaneGeometry(900, 420), pbr(0xe8e4dd, { roughness: 0.95 })); pared.position.set(0, 210, -6); pared.receiveShadow = true; s.add(pared);
    const mad = maderaTex('#c9a26b', '#9c7444'); const bm = pbr(0xffffff, { map: mad, roughness: 0.7 });
    const banco = cajaK(190, 5, 70, bm, s, 0, 86, 40); banco.receiveShadow = true;
    for (const [x, z] of [[-90, 10], [90, 10], [-90, 70], [90, 70]]) cajaK(5, 84, 5, MATS.aceroPavonado(), s, x, 42, z);
    // materiales sobre el banco: rollos de cable, tubo enrollado y cajas
    const R = new THREE.Group(); R.position.set(0, 88.5, 50); s.add(R);
    [['marron', -70], ['azul', -52], ['negro', -34], ['tierra', -16]].forEach(([col, x]) => { const r = rollo({ sec: 1.5, color: col }); r.scale.setScalar(0.75); r.position.set(x, 0, 0); R.add(r); });
    const tc = tuboCorrugado({ d: 20, recorrido: Array.from({ length: 40 }, (_, i) => V(30 + Math.cos(i * 0.5) * 12, 1 + i * 0.05, Math.sin(i * 0.5) * 12)) }); R.add(tc);
    // tablero de prácticas colgado en la pared
    const T = this.T = new THREE.Group(); T.position.set(-TAB.w / 2, 98, -2); s.add(T);
    const tabla = cajaK(TAB.w, TAB.h, 2, pbr(0xffffff, { map: maderaTex('#dcb889', '#b48a56'), roughness: 0.75 }), T, TAB.w / 2, TAB.h / 2, -1); tabla.receiveShadow = true;
    cajaK(TAB.w + 3, TAB.h + 3, 1.4, pbr(0x7a5230, { roughness: 0.7 }), T, TAB.w / 2, TAB.h / 2, -2.4);
    this.G = new THREE.Group(); T.add(this.G); this.actor = new THREE.Group(); s.add(this.actor);
    this.ray = new THREE.Raycaster(); this.ndc = new THREE.Vector2();
    this.construir(); this.vista();
  }
  activar(on) { if (this.controls) this.controls.enabled = on; }
  vista() { this.ir([18, 150, 225], [0, 128, 0], this.camera?.position.lengthSq() ? 0.8 : 0); }
  ir(p, t, dur = 0.9) { if (!this.camera) return; if (!dur) { this.camera.position.set(...p); this.controls.target.set(...t); this.controls.update(); return; } this.vuelo = { t: 0, dur, de: this.controls.target.clone(), a: V(...t), cde: this.camera.position.clone(), ca: V(...p) }; }
  w(x, y, z = 0) { return V(x - TAB.w / 2, y + 98, z - 2 + 0); } // tablero → mundo
  focoDe(k) {
    if (k === 'tablero') return { t: this.w(TAB.w / 2, TAB.h / 2), d: 215 };
    if (POS[k]) { const [x, y] = POS[k]; return { t: this.w(x, y, 2), d: k === 'CE' ? 52 : 46 }; }
    if (TUBOS[k]) { const P = TUBOS[k]; const xs = P.map((p) => p[0]), ys = P.map((p) => p[1]); return { t: this.w((Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2, 1), d: 80 }; }
    return { t: this.w(TAB.w / 2, TAB.h / 2), d: 150 };
  }
  enfocar(k = this.paso?.foco || 'tablero') { const f = this.focoDe(k); this.ir([f.t.x + f.d * 0.12, f.t.y + f.d * 0.1, f.t.z + f.d], [f.t.x, f.t.y, f.t.z]); }

  // ------------------------------------------------------------ construir según los pasos hechos
  construir() {
    if (!this.G) return; const H = (id) => this.hecho.has(id); const G = this.G;
    G.traverse((o) => { if (o.geometry && !o.geometry.userData?.compartida) o.geometry.dispose(); }); G.clear(); this.labels = []; this.mecs = {};
    const lapiz = pbr(0x3a3a3a, { roughness: 0.8 });
    if (H('medir') && !H('taladrar')) for (const [x, y] of Object.values(POS)) for (const r of [Math.PI / 4, -Math.PI / 4]) { const m = cajaK(2.2, 0.18, 0.05, lapiz, G, x, y, 0.03); m.rotation.z = r; }
    if (H('medir') && !H('taladrar')) this.labels.push(...Object.entries(POS).map(([k, [x, y]]) => ({ txt: { I: 'Interruptor', CE: 'Caja de empalme', B: 'Punto de luz', E: 'Enchufe' }[k], v: this.w(x, y + 5, 1), cls: 'mini' })));
    if (H('taladrar')) {
      for (const k of ['I', 'E']) { const [x, y] = POS[k]; const m = mecanismo3D(k === 'I' ? 'interruptor' : 'enchufe', { on: this.luz }); m.position.set(x, y, 0); G.add(m); this.mecs[k] = m;
        const P = m.userData.partes; const fuera = H('conectar') && !H('garras'); P.mecanismo.visible = H('conectar'); P.mecanismo.position.z = fuera ? 7 : 0; P.marco.visible = P.tecla.visible = H('marco'); }
      const [bx, by] = POS.B; const b = bombilla3D(this.luz ? 1 : 0); b.position.set(bx, by, 0); b.userData.partes.bombilla.visible = H('bombilla'); G.add(b); this.mecs.B = b;
      if (this.luz) { const pl = new THREE.PointLight(0xffd27a, 120, 140, 1.6); pl.position.set(bx, by, 9); G.add(pl); }
      const [cx, cy] = POS.CE; const ce = cajaEmpalme3D(100, H('empalmar') ? FICHAS_CE : {}, posicionesCaja(100), { tapa: false }); ce.position.set(cx, cy, 0); G.add(ce); this.mecs.CE = ce;
      if (H('tapa')) { const t = cajaK(10.4, 10.4, 0.5, pbr(0xc9ced2, { roughness: 0.5 }), G, cx, cy, ce.userData.D + 0.25); void t; for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.12, 14), MATS.acero()); tr.rotation.x = Math.PI / 2; tr.position.set(cx + sx * 4.1, cy + sy * 4.1, ce.userData.D + 0.55); G.add(tr); } }
      for (const [x, y] of [[POS.I[0], POS.I[1] + 3], [POS.I[0], POS.I[1] - 3], [POS.E[0], POS.E[1] + 3], [POS.E[0], POS.E[1] - 3], [POS.CE[0] - 4.1, POS.CE[1] + 4.1], [POS.CE[0] + 4.1, POS.CE[1] - 4.1]]) { const s = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.1, 12), MATS.niquel()); s.rotation.x = Math.PI / 2; s.position.set(x, y, 0.36); G.add(s); }
    }
    if (H('medirTubo') && !H('cortarTubo')) for (const [k, P] of Object.entries(TUBOS)) { if (k === 'T0') continue; const pts = P.map(([x, y]) => V(x, y, 0.2)); const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineDashedMaterial({ color: 0x2b2f33, dashSize: 1.2, gapSize: 0.9 })); l.computeLineDistances(); G.add(l); const m = pts[Math.floor(pts.length / 2)].clone().lerp(pts[Math.floor(pts.length / 2) - 1], 0.5); this.labels.push({ txt: `${k}: ${Math.round(largo(P))} cm`, v: this.T.localToWorld(m.clone().add(V(0, 2, 1))), cls: 'on' }); }
    if (H('cortarTubo')) for (const [k, P] of Object.entries(TUBOS)) {
      const pts = []; P.forEach(([x, y], i) => { if (i > 0 && i < P.length - 1) { const [ax, ay] = P[i - 1], [bx2, by2] = P[i + 1]; const d1 = Math.hypot(x - ax, y - ay), d2 = Math.hypot(bx2 - x, by2 - y); pts.push(V(x + ((ax - x) / d1) * 3, y + ((ay - y) / d1) * 3, 1), V(x + ((ax - x) / d1) * 0.9 + ((bx2 - x) / d2) * 0.9, y + ((ay - y) / d1) * 0.9 + ((by2 - y) / d2) * 0.9, 1), V(x + ((bx2 - x) / d2) * 3, y + ((by2 - y) / d2) * 3, 1)); } else pts.push(V(x, y, 1)); });
      const tb = tuboCorrugado({ d: 20, recorrido: pts }); G.add(tb);
      if (H('grapas')) for (let i = 1; i < P.length; i++) { const [ax, ay] = P[i - 1], [bx2, by2] = P[i]; const L = Math.hypot(bx2 - ax, by2 - ay); const n = Math.max(1, Math.ceil(L / 25)); for (let j = 0; j <= n; j++) { const f = 0.12 + (0.76 * j) / n; if (L < 8 && j > 0) break; const g = grapa(20); g.rotation.x = Math.PI / 2; if (Math.abs(bx2 - ax) < 0.1) g.rotation.y = Math.PI / 2; g.position.set(ax + (bx2 - ax) * f, ay + (by2 - ay) * f, 1); if (k === 'T0' && ax + (bx2 - ax) * f < 1) continue; G.add(g); } }
    }
    // manguera de entrada por la izquierda
    { const mg = manguera({ tipo: 'H05VV-F', sec: 2.5, len: 30, abierta: H('cubierta') ? 6 : 0.01, pelado: 0, colores: H('cubierta') ? ['marron', 'azul', 'tierra'] : [] }); mg.rotation.z = 0; mg.position.set(-36, 52, 1); if (!H('cortarTubo')) mg.position.x = -30; G.add(mg); }
    // colas de cable en cada caja
    if (H('guia')) {
      const pelM = H('pelar') ? 10 : 0, pelC = H('empalmar') ? 11 : 0; const pc = posicionesCaja(100); const ficha = (t) => pc[+t.slice(1) - 1];
      for (const [k, L] of Object.entries(COLAS)) {
        const [bx, by] = POS[k]; const cuenta = {};
        L.forEach(([col, tubo, borne], i) => {
          const P = TUBOS[tubo]; const ent = k === 'CE' ? (tubo === 'T0' || tubo === 'T2' ? P[tubo === 'T0' ? P.length - 1 : 0] : P[0]) : P[P.length - 1];
          const n = cuenta[tubo] = (cuenta[tubo] || 0) + 1; const off = (n - 2) * 0.45; const dx = ent[0] - bx, dy = ent[1] - by; const hor = Math.abs(dx) > Math.abs(dy);
          const e0 = V(ent[0] + (hor ? 0 : off), ent[1] + (hor ? off : 0), 1.0); const dentro = V(bx + dx * 0.35 + (hor ? 0 : off), by + dy * 0.35 + (hor ? off : 0), 1.4);
          let fin, sale;
          if (k === 'CE') { if (H('empalmar')) { const [fx, fy] = ficha(borne); fin = V(bx + fx + (n - 2) * 0.35, by + fy - 0.9, 2.0); sale = V(bx + fx * 0.6 + off, by + fy * 0.4 - 2.5, 2.4); } else { fin = V(bx + dx * 0.1 + off * 2, by + dy * 0.1 + 6 + i * 0.3, 11 + i * 0.5); sale = V(bx + dx * 0.2 + off, by + dy * 0.2, 4.5); } }
          else if (H('conectar') && this.mecs[k]) { const mm = this.mecs[k]; const b = mm.userData.bornes[borne]; const g = mm.userData.partes[b.grupo]; mm.updateMatrixWorld(true); const wp = b.pos.clone(); g.localToWorld(wp); fin = G.worldToLocal(wp); if (k === 'B') { sale = fin.clone().add(V(0, 0, 2.5)); } else { fin.z += 0.95; sale = fin.clone().add(V(0, -1.2, -2.2)); }
            if (H('garras') && k !== 'B') { fin = V(bx + dx * 0.15 + off, by + dy * 0.15, 3.0); sale = V(bx + dx * 0.25 + off, by + dy * 0.25, 2.2); } }
          else { fin = V(bx + dx * 0.1 + off * 2, by + dy * 0.1 + 5, 10 + i * 0.6); sale = V(bx + dx * 0.25 + off, by + dy * 0.25, 4.5); }
          if (H('garras') && k !== 'B' && k !== 'CE') { if (H('marco')) return; }
          if (k === 'CE' && H('tapa')) return;
          const pel = !H('cortarCable') ? 0 : k === 'CE' ? pelC : pelM;
          const cond = conductor({ sec: k === 'I' || k === 'B' || tubo === 'T1' || tubo === 'T2' ? 1.5 : 2.5, color: col, pelado: [0, pel], recorrido: [e0, dentro, sale, fin] }); G.add(cond);
        });
      }
    }
    if (this.luz) this.labels.push({ txt: '💡 ¡Funciona!', v: this.w(POS.B[0], POS.B[1] + 8, 6), cls: 'on' });
  }

  // ------------------------------------------------------------ juego
  elegir(id) {
    if (this.anim || this.acabado || this.lab.ro) return;
    const P = this.paso; if (!P) return; this.sel = id;
    if (id !== P.herr) { this.fallo(P, `❌ ${NOMBRE_HERR[id] || id} no es la herramienta de este paso. ${PISTA[P.herr] || ''}`); return; }
    if (P.punta || P.mm) { this.msg = { t: P.punta ? `Bien: ${NOMBRE_HERR[id]}. Ahora elige la punta.` : `Bien: el pelacables. Ahora ajusta el tope de longitud.`, cls: 'info' }; this.lab.lado(); this.lab.barra(); return; }
    this.acierto(P);
  }
  elegirPunta(k) { const P = this.paso; if (!P?.punta || this.sel !== 'destornillador' || this.anim) return; this.punta = k; if (!P.punta.includes(k)) return this.fallo(P, `❌ La punta ${PUNTAS[k]?.n || k} no encaja: baila y estropea la cabeza del tornillo.`); this.acierto(P); }
  elegirMM(v) { const P = this.paso; if (!P?.mm || this.sel !== 'pelacables' || this.anim) return; this.mm = +v; if (+v !== P.mm) return this.fallo(P, +v < P.mm ? `❌ ${v} mm es poco: el aislante entraría en el borne y no haría buen contacto.` : `❌ ${v} mm es demasiado: quedaría cobre a la vista fuera del borne.`); this.acierto(P); }
  fallo(P, t) { this.errores++; this.log.push({ p: P.id, h: this.sel === 'destornillador' && P.punta ? 'destornillador ' + this.punta : this.sel === 'pelacables' && P.mm ? 'pelacables ' + this.mm + ' mm' : this.sel, ok: false }); this.msg = { t, cls: 'ko' }; this.guardar(); this.sacudir(); this.lab.lado(); this.lab.barra(); }
  acierto(P) {
    this.log.push({ p: P.id, h: this.sel, ok: true }); this.msg = null;
    this.animar(P, () => {
      this.hecho.add(P.id); if (P.id === 'tension') this.luz = true;
      this.msg = { t: '✅ ' + P.ok.replace(/\{(T\d)\}/g, (_, k) => Math.round(largo(TUBOS[k]))), cls: 'ok' }; this.sel = null; this.guardar(); this.construir();
      if (this.acabado) { this.msg = { t: `🏁 ¡Instalación terminada! ${'★'.repeat(estrellas(this.errores))}${'☆'.repeat(3 - estrellas(this.errores))} · Nota ${String(nota(this.errores, this.seg)).replace('.', ',')}`, cls: 'ok' }; this.vista(); }
      else setTimeout(() => this.enfocar(), 900);
      this.lab.lado(); this.lab.barra(); this.lab.paleta();
    });
    this.lab.lado(); this.lab.barra();
  }
  sacudir() { this.temblor = 0.35; }
  // animación de la herramienta en el sitio del paso
  animar(P, fin) {
    this.actor.clear(); const f = this.focoDe(P.foco); const p = f.t.clone();
    const id = P.herr; let o = null;
    if (id !== 'mano') { o = herramienta3D(id === 'epi' ? 'epi' : id, { punta: this.punta }); this.actor.add(o); }
    const t0 = performance.now(); const dur = id === 'mano' ? 700 : 1700;
    const base = p.clone(); let paso = () => {};
    if (o) {
      if (id === 'flexometro') { o.rotation.set(0, Math.PI / 2, 0); base.add(V(-14, 3, 2)); paso = (k) => o.userData.extender?.(2 + k * 28); }
      else if (id === 'nivel') { o.rotation.set(0, Math.PI / 2, 0); base.add(V(-8, 5.5, 2)); paso = (k) => { o.rotation.z = 0.08 * (1 - k); }; }
      else if (id === 'taladro' || id === 'destornillador' || id === 'buscapolos') { base.add(V(3, 2, 2.5)); paso = (k) => { o.position.z = base.z + (k < 0.25 ? (1 - k / 0.25) * 10 : 0); if (k > 0.25) o.userData.anim?.(k * 4); if (id === 'buscapolos') o.userData.encender?.(k > 0.4); }; }
      else if (id === 'multimetro') { o.rotation.set(-0.3, -0.25, 0); base.add(V(10, -4, 6)); paso = (k) => o.userData.leer?.(k < 0.35 ? '- - -' : P.id === 'continuidad' ? '0.L' : '230.4'); }
      else if (id === 'guia') { o.rotation.set(0, -Math.PI / 2, 0); base.add(V(16, 0, 2)); paso = (k) => o.userData.sacar?.(2 + k * 30); }
      else if (id === 'epi') { base.add(V(0, 0, 60)); paso = (k) => { o.rotation.y = k * Math.PI * 2; o.position.z = base.z + 30 * (1 - k); }; }
      else { o.rotation.set(-Math.PI / 2, 0, 0); base.add(V(0, 3, 4)); paso = (k) => { o.position.y = base.y + (k < 0.3 ? (1 - k / 0.3) * 8 : 0); o.userData.cerrar?.(k > 0.35 && k < 0.8 ? 1 : 0); o.userData.abrir?.(k > 0.35 && k < 0.8 ? 0.03 : 0.3); }; }
      o.position.copy(base);
    }
    this.anim = { paso: (k) => { if (o) paso(k); }, t0, dur, fin: () => { this.actor.clear(); this.anim = null; fin(); } };
    this.ir([p.x + f.d * 0.25, p.y + f.d * 0.2, p.z + f.d * 0.9], [p.x, p.y, p.z], 0.6);
  }
  frame(dt) {
    if (this.vuelo) { const v = this.vuelo; v.t = Math.min(1, v.t + dt / v.dur); const f = 1 - (1 - v.t) ** 3; this.controls.target.lerpVectors(v.de, v.a, f); this.camera.position.lerpVectors(v.cde, v.ca, f); if (v.t >= 1) this.vuelo = null; }
    if (this.anim) { const k = Math.min(1, (performance.now() - this.anim.t0) / this.anim.dur); this.anim.paso(k); if (k >= 1) this.anim.fin(); }
    if (this.temblor > 0) { this.temblor -= dt; this.camera.position.x += Math.sin(performance.now() / 18) * 0.25 * this.temblor; }
    if (!this.acabado && !this.lab.ro && this.hecho.size) { this.seg += dt; if ((this._tk = (this._tk || 0) + dt) > 1) { this._tk = 0; const el = this.lab.host.querySelector('#vmT'); if (el) el.textContent = this.reloj(); } }
    this.controls.update();
  }
  reloj() { const s = Math.round(this.seg); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; }
  etiquetas() { return this.labels; }
  onDown() { return false; }

  // ------------------------------------------------------------ paneles
  // Cinturón de herramientas (barra inferior), con miniaturas 3D de las herramientas del kit
  cintoHTML() {
    const P = this.paso; const mini = this.miniaturas();
    let h = `<div class="vm-cinto">${CINTO.map(([id, ic, n]) => `<button data-mh="${id}" class="${this.sel === id ? 'on' : ''}" title="${esc(n)}">${mini[id] ? `<img src="${mini[id]}" alt="">` : `<span class="vm-ic">${ic}</span>`}<small>${esc(n)}</small></button>`).join('')}</div>`;
    if (P && this.sel === 'destornillador' && P.punta) h += `<div class="vm-sub"><b>Punta:</b>${Object.entries(PUNTAS).map(([k, p]) => `<button data-mpunta="${k}">${esc(p.n)}</button>`).join('')}</div>`;
    if (P && this.sel === 'pelacables' && P.mm) h += `<div class="vm-sub"><b>Tope del pelacables:</b>${MM.map((v) => `<button data-mmm="${v}">${v} mm</button>`).join('')}</div>`;
    return h;
  }
  miniaturas() {
    if (this._mini || !this.renderer) return this._mini || {};
    const r = this.renderer; const out = {}; const W = 96, H = 72; const pr = r.getPixelRatio();
    const s = new THREE.Scene(); s.background = new THREE.Color(0xf3f1ec); entorno(r, s, 0.9); s.add(new THREE.HemisphereLight(0xffffff, 0x888888, 1.2)); const d = new THREE.DirectionalLight(0xffffff, 1.6); d.position.set(3, 5, 8); s.add(d);
    const cam = new THREE.PerspectiveCamera(30, W / H, 0.1, 500); const cv = document.createElement('canvas'); cv.width = W * pr; cv.height = H * pr; const g = cv.getContext('2d');
    const prev = new THREE.Vector4(); r.getViewport(prev); const sc = r.getScissorTest(); r.setScissorTest(true); r.setViewport(0, 0, W, H); r.setScissor(0, 0, W, H);
    for (const [id] of CINTO) {
      if (id === 'mano') continue; const o = herramienta3D(id, { punta: 'PZ1' }); if (!o) continue; o.rotation.set(-0.5, 0.75, 0.25); s.add(o);
      const b = new THREE.Box3().setFromObject(o); const c = b.getCenter(V()); const R = b.getSize(V()).length() / 2;
      cam.position.copy(c).add(V(0, 0, R / Math.tan(THREE.MathUtils.degToRad(15)) * 0.95)); cam.lookAt(c); cam.updateProjectionMatrix();
      r.render(s, cam); g.clearRect(0, 0, cv.width, cv.height); g.drawImage(r.domElement, 0, r.domElement.height - H * pr, W * pr, H * pr, 0, 0, W * pr, H * pr); out[id] = cv.toDataURL('image/png'); s.remove(o);
    }
    r.setViewport(prev); r.setScissorTest(sc); r.setScissor(0, 0, prev.z, prev.w);
    return (this._mini = out);
  }
  paletaHTML() {
    return `<p class="vv-small">Monta el circuito del plano eligiendo en cada paso la herramienta del <b>cinturón</b> (abajo). Si te equivocas, suma un fallo.</p>
      <h4>Plano del montaje</h4><ul class="vm-plano"><li>💡 Punto de luz con <b>interruptor</b> (C1, 1,5 mm²)</li><li>🔌 <b>Enchufe</b> con toma de tierra (C2, 2,5 mm²)</li><li>⬜ Caja de empalme 100×100 con tapa de registro</li><li>〰 Tubo corrugado Ø20 grapado en superficie</li></ul>
      <h4>Materiales</h4><ul class="vm-plano vv-small"><li>Cable H07V-K marrón, negro, azul y amarillo-verde</li><li>Manguera H05VV-F 3G2,5 de entrada</li><li>4 conectores de palanca (2 de 3 vías y 2 de 2 vías)</li><li>2 cajas de superficie, portalámparas E27 y bombilla</li><li>Grapas para tubo Ø20</li></ul>
      <div class="vv-fila"><button class="vv-btn small" data-v="montajeVista">⌂ Vista general</button>${this.lab.ro ? '' : '<button class="vv-btn small" data-v="montajeReiniciar">↺ Empezar de nuevo</button>'}</div>`;
  }
  ladoHTML() {
    const P = this.paso; const n = this.hecho.size; const est = estrellas(this.errores);
    let h = `<section class="vv-insp vm-hud"><div class="vm-marc"><span>✅ ${n}/${PASOS.length}</span><span>❌ <b id="vmE">${this.errores}</b> fallos</span><span>⏱ <b id="vmT">${this.reloj()}</b></span></div><div class="vm-barra"><i style="width:${(n / PASOS.length) * 100}%"></i></div>`;
    if (P) h += `<h4>Paso ${n + 1} · ${esc(P.n)}</h4><p class="vm-txt">${esc(P.txt)}</p>`;
    else h += `<h4>🏁 Montaje terminado</h4><p class="vm-est">${'★'.repeat(est)}${'☆'.repeat(3 - est)}</p><p>Nota del montaje: <b>${String(nota(this.errores, this.seg)).replace('.', ',')}</b> · ${this.errores} fallos · ${this.reloj()}</p>`;
    if (this.msg) h += `<p class="vm-msg ${this.msg.cls}">${esc(this.msg.t)}</p>`;
    h += '</section><section class="vv-insp"><h4>Pasos</h4><ol class="vm-pasos">' + PASOS.map((p) => { const f = this.log.filter((l) => l.p === p.id && !l.ok).length; return `<li class="${this.hecho.has(p.id) ? 'ok' : P && P.id === p.id ? 'act' : ''}">${esc(p.n)}${f ? ` <span class="vm-f">${f}✖</span>` : ''}</li>`; }).join('') + '</ol></section>';
    return h;
  }
  // Datos de la entrega (práctica v4)
  entrega() {
    const items = PASOS.map((p) => { const f = this.log.filter((l) => l.p === p.id && !l.ok); return { t: `${p.n}: ${this.hecho.has(p.id) ? 'hecho' : 'sin hacer'}${f.length ? ` · ${f.length} fallo${f.length > 1 ? 's' : ''} (${[...new Set(f.map((l) => NOMBRE_HERR[l.h] || String(l.h).replace(/^destornillador /, 'Destornillador ').replace(/^pelacables /, 'Pelacables ')))].join(', ')})` : ''}`, ok: this.hecho.has(p.id) && !f.length }; });
    return { ok: this.acabado, items, aciertos: `${items.filter((i) => i.ok).length}/${items.length}`, nota: nota(this.errores, this.seg) };
  }
}

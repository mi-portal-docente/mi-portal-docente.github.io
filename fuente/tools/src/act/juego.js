// Actividades de clase como juego 3D: banco de trabajo con el maletín abierto (o la mesa de cables),
// cámara que se acerca, vitrina giratoria con la herramienta y su animación de uso, y retos prácticos:
//   · «objeto»  señala la pieza en la mesa (o su número)        · «opcion»  pregunta con botones
//   · «punta»   elige la punta que encaja en el tornillo         · «pelar»   pela el cable a la medida del borne
//   · «seccion» identifica la sección mirando el corte           · «colores» cablea la clavija: L, N y tierra
// Niveles con cronómetro, puntos, racha y estrellas. El resultado («Aciertos: a/t») va al cuaderno igual que antes.
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Actividad3D, nota10, textoResultado } from './motor.js';
import { entorno, maderaTex, espumaTex, pbr, MATS, bloqueRedondo, caja, malla, calidad, textoTex, liberar } from '../kit3d/base.js';
import { herramienta, punta as punta3D, PUNTAS3D } from '../kit3d/herramientas.js';
import { conductor, muestraCorte, clavijaSchuko, NOMBRE_COLOR, rCable } from '../kit3d/cables.js';

const esc = (t) => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const barajar = (L) => { const a = L.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const suave = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

// Tumba una pieza del kit (punta en el origen, cuerpo hacia +Z) sobre la mesa: eje largo en X, apoyada en y = 0
export function tumbar(g, o = {}) {
  const w = new THREE.Group(); w.add(g); g.rotation.set(o.rx || 0, o.ry ?? Math.PI / 2, o.rz || 0); w.updateMatrixWorld(true);
  const b = new THREE.Box3().setFromObject(g); g.position.x -= (b.min.x + b.max.x) / 2; g.position.z -= (b.min.z + b.max.z) / 2; g.position.y -= b.min.y; return w;
}
// Cabeza de tornillo grande con su huella (para el reto de la punta)
function tornilloGrande(tipo) {
  const G = new THREE.Group(); const R = 2.2; const ac = MATS.cromo(), osc = pbr(0x15171a, { roughness: 0.7 });
  malla(new THREE.CylinderGeometry(R, R * 1.02, 1.2, 40), ac, G, 0, 0.6, 0); malla(new THREE.CylinderGeometry(0.9, 0.7, 5, 20), ac, G, 0, -2.4, 0);
  const P = PUNTAS3D[tipo]; const y = 1.22;
  if (P.tipo === 'plano') caja(R * 1.8, 0.05, P.a * 2.2, osc, G, 0, y, 0);
  else if (P.tipo === 'T') { const s = new THREE.Shape(); for (let i = 0; i <= 48; i++) { const a = (i / 48) * Math.PI * 2; const k = Math.cos(a * 6); const rr = 0.65 + 0.35 * Math.sign(k) * Math.pow(Math.abs(k), 0.6); i ? s.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : s.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); } const m = malla(new THREE.ShapeGeometry(s), osc, G, 0, y, 0); m.rotation.x = -Math.PI / 2; m.scale.setScalar(P.r * 5); }
  else { const L = P.r * 6; caja(L, 0.05, L * 0.28, osc, G, 0, y, 0); caja(L * 0.28, 0.05, L, osc, G, 0, y, 0); if (P.tipo === 'PZ') for (const a of [Math.PI / 4, -Math.PI / 4]) { const t = caja(L * 0.75, 0.06, 0.06, pbr(0x6a6f75, { metalness: 1, roughness: 0.3 }), G, 0, y + 0.01, 0); t.rotation.y = a; } }
  return G;
}

export class Juego3D extends Actividad3D {
  initScene() {
    const el = this.$('#acGL'); const Q = calidad(); this.anims = []; this.vitrina = null; this.reto = null; this.tw = null;
    try { this.renderer = new THREE.WebGLRenderer({ antialias: !Q.baja, preserveDrawingBuffer: true }); } catch (e) { el.innerHTML = '<p class="ac-sin3d">Este navegador no puede mostrar 3D: usa los números de la lista.</p>'; return; }
    const r = this.renderer; r.setPixelRatio(Q.pixel); r.shadowMap.enabled = Q.sombras; r.shadowMap.type = THREE.PCFSoftShadowMap; el.appendChild(r.domElement);
    this.host.querySelector('.ac-vista').insertAdjacentHTML('beforeend', '<div class="aj-hud" id="ajHud" hidden></div><button class="aj-volver" id="ajVolver" data-ac="mesa" hidden>↩ Volver a la mesa</button>');
    this.host.classList.add('aj');
    const s = this.scene = new THREE.Scene(); s.background = new THREE.Color(0xd9dde1); s.fog = new THREE.Fog(0xd9dde1, 260, 520); entorno(r, s, 0.6);
    s.add(new THREE.HemisphereLight(0xffffff, 0x8a7a66, 0.9));
    const d = new THREE.DirectionalLight(0xfff6e8, 2.1); d.position.set(-40, 120, 70); d.castShadow = Q.sombras; d.shadow.mapSize.set(Q.baja ? 1024 : 2048, Q.baja ? 1024 : 2048); Object.assign(d.shadow.camera, { left: -100, right: 100, top: 80, bottom: -80, near: 10, far: 400 }); d.shadow.bias = -0.0005; s.add(d);
    this.camera = new THREE.PerspectiveCamera(34, 1, 1, 1200);
    // sala: pared con panel perforado y banco de madera
    const pared = malla(new THREE.PlaneGeometry(600, 300), pbr(0xe8e2d8, { roughness: 0.95 }), s, 0, 100, -60); pared.receiveShadow = true;
    const suelo = malla(new THREE.PlaneGeometry(900, 700), pbr(0x9a948b, { roughness: 0.95 }), s, 0, -84, 0); suelo.rotation.x = -Math.PI / 2; suelo.receiveShadow = true;
    const pt = maderaTex('#c9a575', '#9c7a4c'); const panel = malla(new THREE.BoxGeometry(170, 70, 1.5), pbr(0xd8b98a, { map: pt, roughness: 0.85 }), s, 0, 52, -58); void panel;
    const W = this.def.mesa?.w || 150, D = this.def.mesa?.d || 80;
    const tablero = malla(new THREE.BoxGeometry(W, 4, D), pbr(0xffffff, { map: maderaTex(), roughness: 0.65, clearcoat: 0.15 }), s, 0, -2, 0); tablero.receiveShadow = true;
    for (const [x, z] of [[-W / 2 + 5, -D / 2 + 5], [W / 2 - 5, -D / 2 + 5], [-W / 2 + 5, D / 2 - 5], [W / 2 - 5, D / 2 - 5]]) caja(5, 80, 5, MATS.aceroPavonado(), s, x, -44, z);
    this.esc = { W, D }; this.vistas = { general: { p: [0, 128, 150], t: [0, -4, 6] }, mesa: { p: [-8, 70, 70], t: [-8, 0, -2] } };
    // vitrina giratoria (primer plano)
    const V = this.vit = new THREE.Vector3(W / 2 - 22, 0, D / 2 - 20); this.vistas.vitrina = { p: [V.x - 20, 30, V.z + 40], t: [V.x, 6, V.z] };
    malla(new THREE.CylinderGeometry(13, 14, 1.6, 48), pbr(0x2b2e33, { roughness: 0.4, clearcoat: 0.6 }), s, V.x, 0.8, V.z);
    this.plato = new THREE.Group(); this.plato.position.set(V.x, 1.7, V.z); s.add(this.plato);
    if (this.def.escena === 'cables') this.mesaCables(); else this.maletin();
    // objetos (cada uno con materiales propios para poder resaltarlo)
    for (const o of this.def.objetos) {
      const g = new THREE.Group(); o.crear(g); g.position.set(o.x, o.y || 0, o.z); g.rotation.y = o.rot || 0; g.userData.objId = o.id; s.add(g);
      g.traverse((m) => { if (m.isMesh && m.material && !Array.isArray(m.material)) { m.material = m.material.clone(); m.castShadow = Q.sombras; } });
      const caja3 = new THREE.Box3().setFromObject(g); const c = caja3.getCenter(new THREE.Vector3());
      this.objs.set(o.id, { o, g, tag: new THREE.Vector3(c.x, caja3.max.y + 2, c.z), mats: [] });
      g.traverse((m) => { if (m.material && m.material.emissive) this.objs.get(o.id).mats.push(m.material); });
    }
    const c = this.controls = new OrbitControls(this.camera, r.domElement);
    c.enableDamping = true; c.minDistance = 18; c.maxDistance = 300; c.minPolarAngle = 0.15; c.maxPolarAngle = 1.35; c.enablePan = true; c.screenSpacePanning = true;
    this.camera.position.set(0, 140, 190); c.target.set(0, 0, 0);
    this.ray = new THREE.Raycaster(); this.ptr = new THREE.Vector2();
    r.domElement.addEventListener('pointermove', (e) => this.onMove(e));
    r.domElement.addEventListener('pointerdown', (e) => { this.down = [e.clientX, e.clientY]; });
    r.domElement.addEventListener('pointerup', (e) => { if (this.down && Math.hypot(e.clientX - this.down[0], e.clientY - this.down[1]) < 6) this.clic3D(e); this.down = null; });
    this.onResize = () => { const w = el.clientWidth || 600, h = el.clientHeight || 400; r.setSize(w, h); this.camera.aspect = w / h; this.camera.updateProjectionMatrix(); };
    window.addEventListener('resize', this.onResize); this.onResize(); this.ir('general', 1.6); this.reloj = new THREE.Clock(); this.resume();
  }
  maletin() {
    const s = this.scene; const M = this.def.maletin || { x: -12, z: -4, w: 104, d: 58 };
    const rojo = pbr(0xc81e1a, { roughness: 0.42, clearcoat: 0.5, clearcoatRoughness: 0.3 }), negro = pbr(0x1f2124, { roughness: 0.5 });
    const base = bloqueRedondo(M.w, M.d, 7, 3, rojo, s, 0.6); base.rotation.x = -Math.PI / 2; base.position.set(M.x, 3.5, M.z); base.receiveShadow = true;
    const espuma = caja(M.w - 3, 1.2, M.d - 3, pbr(0xffffff, { map: espumaTex(), roughness: 1 }), s, M.x, 7.2, M.z); espuma.receiveShadow = true;
    // tapa abierta con su espuma y el asa
    const tapa = new THREE.Group(); tapa.position.set(M.x, 7, M.z - M.d / 2); s.add(tapa);
    const t1 = bloqueRedondo(M.w, M.d, 4, 3, rojo, tapa, 0.5); t1.rotation.x = -Math.PI / 2; t1.position.set(0, 2, M.d / 2);
    const t2 = caja(M.w - 4, 0.8, M.d - 4, pbr(0xffffff, { map: espumaTex(), roughness: 1 }), tapa, 0, -0.2, M.d / 2); void t2;
    tapa.rotation.x = -1.95;
    for (const sx of [-1, 1]) { caja(8, 2.5, 3, negro, s, M.x + sx * 30, 4, M.z + M.d / 2 + 1); caja(3, 4, 2, MATS.acero(), s, M.x + sx * 30, 5, M.z + M.d / 2 + 1.6); }
    caja(26, 2.4, 2.4, negro, s, M.x, 3, M.z + M.d / 2 + 2.5);
    this.mal = { y: 7.8 }; this.vistas.mesa = { p: [M.x, 78, M.z + 66], t: [M.x, 6, M.z + 2] };
    // rótulo de la caja
    const et = new THREE.Mesh(new THREE.PlaneGeometry(26, 4), new THREE.MeshBasicMaterial({ map: textoTex('MALETÍN DEL TALLER · EEE', { color: '#ffffff', w: 512, h: 80, font: 'bold 40px system-ui' }), transparent: true }));
    et.position.set(M.x, 3.6, M.z + M.d / 2 + 0.66); s.add(et);
  }
  mesaCables() {
    const s = this.scene; const est = pbr(0x8a9097, { metalness: 0.6, roughness: 0.4 });
    const panel = bloqueRedondo(56, 26, 1.2, 1.5, pbr(0xf0ede6, { roughness: 0.8 }), s, 0.2); panel.rotation.x = -Math.PI / 2; panel.position.set(30, 0.6, -18); void est;
    this.vistas.mesa = { p: [0, 80, 70], t: [0, 0, -4] };
  }
  // ------------------------------------------------------------ cámara
  ir(v, dur = 0.9) {
    const V = typeof v === 'string' ? this.vistas[v] : v; if (!V || !this.camera) return;
    this.tw = { p0: this.camera.position.clone(), t0: this.controls.target.clone(), p1: new THREE.Vector3(...V.p), t1: new THREE.Vector3(...V.t), ini: performance.now(), dur: dur * 1000 };
  }
  irVitrina(alto = 18, dist = 46) { const V = this.vit; this.ir({ p: [V.x - dist * 0.55, alto + dist * 0.55, V.z + dist * 0.8], t: [V.x, alto * 0.35, V.z] }); this.$('#ajVolver').hidden = false; }
  // ------------------------------------------------------------ vitrina: herramienta en primer plano con su animación
  limpiarVitrina() { if (this.vitrina) { this.plato.remove(this.vitrina); liberar(this.vitrina); this.vitrina = null; } if (this.reto) { this.scene.remove(this.reto); liberar(this.reto); this.reto = null; } this.anims = []; }
  mostrar(id) {
    const x = this.objs.get(id); if (!x?.o.kit) return;
    this.limpiarVitrina(); const g = herramienta(x.o.kit, x.o.kitOpts); const w = tumbar(g, x.o.tumbar || {}); w.position.y = 8; w.userData.giro = true; this.plato.add(w); this.vitrina = w;
    this.anims.push((t) => { w.rotation.y = t * 0.5; g.userData.anim?.(t); });
    const b = new THREE.Box3().setFromObject(w); const R = b.getSize(new THREE.Vector3()).length(); this.irVitrina(12 + R * 0.3, Math.max(36, R * 1.9));
  }
  volverMesa() { this.limpiarVitrina(); this.$('#ajVolver').hidden = true; const R = this.ronda(); this.ir(R && this.esReto(R) ? 'reto' : 'mesa'); if (R && this.esReto(R)) this.montarReto(R); }
  esReto(R) { return ['punta', 'pelar', 'seccion', 'colores'].includes(R?.tipo); }
  // ------------------------------------------------------------ retos 3D
  montarReto(R) {
    this.limpiarVitrina(); const G = this.reto = new THREE.Group(); const V = this.vit; G.position.set(V.x, 1.7, V.z); this.scene.add(G); const s = this.estado;
    if (R.tipo === 'punta') {
      const tor = tornilloGrande(R.tornillo); tor.position.set(0, 6, 0); G.add(tor);
      const base = caja(30, 1, 6, pbr(0x2b2e33, { roughness: 0.5 }), G, 0, 0.5, 9); void base; this.bits = [];
      R.opciones.forEach((p, k) => { const b = punta3D(R.claves[k]); b.scale.setScalar(5); b.rotation.x = Math.PI / 2; const h = new THREE.Group(); h.add(b); malla(new THREE.CylinderGeometry(0.9, 0.9, 3, 6), MATS.acero(), h, 0, -1.6, 0); h.position.set(-12 + k * (24 / Math.max(1, R.opciones.length - 1)), 4.6, 9); h.userData.bit = k; G.add(h); this.bits.push(h);
        const et = new THREE.Mesh(new THREE.PlaneGeometry(6, 1.6), new THREE.MeshBasicMaterial({ map: textoTex(R.opciones[k], { color: '#fff', w: 256, h: 64, font: 'bold 30px system-ui' }), transparent: true })); et.rotation.x = -Math.PI / 2; et.position.set(h.position.x, 1.05, 11.4); G.add(et); });
      this.anims.push((t) => { tor.rotation.y = s.resp?.ok ? t * 3 : 0; });
      this.vistas.reto = { p: [V.x - 6, 34, V.z + 34], t: [V.x, 4, V.z + 3] };
    } else if (R.tipo === 'pelar') {
      this.L0 = 7; const K = 3; this.pelarK = K; const c = conductor({ sec: R.sec || 2.5, color: R.color || 'marron', len: this.L0, pelado: [0, 0] }); c.scale.setScalar(K); c.position.set(-this.L0 * K, 1.4, 4); G.add(c); this.cable = c;
      const pc = herramienta('pelacables'); const w = tumbar(pc, { ry: -Math.PI / 2 }); w.scale.setScalar(0.8); w.position.set(-10, 0, -6); G.add(w); this.pc = pc;
      const regla = new THREE.Mesh(new THREE.PlaneGeometry((512 / 19) * 0.1 * K, 1.4), new THREE.MeshStandardMaterial({ map: this.reglaTex(), roughness: 0.6 })); regla.rotation.x = -Math.PI / 2; regla.position.set(((512 / 19) * 0.1 * K) / 2 - (16 / 19) * 0.1 * K, 0.05, 5.0); G.add(regla); this.encuadrarEn = [c, regla];
      const dest = this.destinoPelar(R); if (dest) { dest.scale.setScalar(0.7); dest.position.set(8, 0, -1); this.encuadrarEn.push(dest); G.add(dest); }
    } else if (R.tipo === 'seccion') {
      const m = muestraCorte({ sec: R.sec, color: R.color || 'negro', tipo: 'K', len: 3 }); m.scale.setScalar(6); m.rotation.y = -Math.PI / 2 + 0.3; m.position.set(0, 6, 0); G.add(m);
      const soporte = caja(8, 4, 8, pbr(0x2b2e33, { roughness: 0.5 }), G, 0, 2, -6); void soporte;
      const regla = new THREE.Mesh(new THREE.PlaneGeometry(10, 1.8), new THREE.MeshStandardMaterial({ map: this.reglaTex(), roughness: 0.6 })); regla.position.set(0, 2.2 - 0.0, 2.4); regla.rotation.x = -0.25; regla.scale.set(6 / 6, 1, 1); G.add(regla);
      this.vistas.reto = { p: [V.x + 10, 10, V.z + 24], t: [V.x, 6, V.z] };
      this.anims.push((t) => { m.rotation.y = -Math.PI / 2 + 0.3 + Math.sin(t * 0.8) * 0.15; });
    } else if (R.tipo === 'colores') {
      const cl = clavijaSchuko({ cables: {} }); cl.scale.setScalar(3.2); cl.position.set(-6, 2.05 * 3.2, 0); G.add(cl); this.clavija = cl;
      this.vistas.reto = { p: [V.x + 2, 38, V.z + 18], t: [V.x + 2, 0, V.z] };
    }
    if (R.tipo !== 'punta') this.encuadrar(R.tipo === 'pelar' ? this.encuadrarEn : [G], R.tipo === 'seccion' ? [0.35, 0.25, 1] : [0.05, 1.1, 0.9]);
    this.ir('reto');
  }
  encuadrar(L, dir) { const b = new THREE.Box3(); for (const o of L) { o.updateWorldMatrix(true, true); b.expandByObject(o); } const c = b.getCenter(new THREE.Vector3()); const R = b.getSize(new THREE.Vector3()).length() / 2; const d = new THREE.Vector3(...dir).normalize().multiplyScalar((R / Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2))) * (this.reto && this.ronda()?.tipo === "pelar" ? 0.55 : 0.9)); this.vistas.reto = { p: c.clone().add(d).toArray(), t: c.toArray() }; }
  reglaTex() {
    if (this._regla) return this._regla; const c = document.createElement('canvas'); c.width = 512; c.height = 80; const g = c.getContext('2d'); g.fillStyle = '#f6f3e6'; g.fillRect(0, 0, 512, 80); g.fillStyle = '#111'; g.font = 'bold 18px system-ui'; g.textAlign = 'center';
    for (let mm = 0; mm <= 25; mm++) { const x = 16 + mm * 19; const L = mm % 10 === 0 ? 40 : mm % 5 === 0 ? 30 : 18; g.fillRect(x - 1, 0, 2, L); if (mm % 5 === 0) g.fillText(mm + ' mm', x, 66); }
    this._regla = new THREE.CanvasTexture(c); this._regla.colorSpace = THREE.SRGBColorSpace; return this._regla;
  }
  destinoPelar(R) {
    const g = new THREE.Group(); const b = R.borne;
    if (b === 'palanca') { caja(1.9 * 3, 1.9 * 3, 0.85 * 3, MATS.transp(), g, 0, 2.8, 0); for (let i = 0; i < 3; i++) caja(1.6, 0.6, 3.6, MATS.naranja(), g, -1.9 + i * 1.9, 4.4, 0); }
    else if (b === 'aparamenta') { caja(5.4, 4, 12, MATS.plasticoBlanco(), g, 0, 2, 0); caja(1.4, 0.8, 1.4, MATS.plasticoNegro(), g, 0, 4.4, 2); }
    else if (b === 'regleta') { caja(3, 2.4, 4.6, MATS.plasticoBlanco(), g, 0, 1.2, 0); malla(new THREE.CylinderGeometry(0.7, 0.7, 0.4, 16), MATS.acero(), g, 0, 2.6, 1); }
    else { caja(8, 1.4, 8, MATS.plasticoNegro(), g, 0, 0.7, 0); for (const x of [-1.6, 1.6]) caja(1.4, 1.1, 1.6, MATS.laton(), g, x, 1.9, 0); }
    return g;
  }
  // ------------------------------------------------------------ clics en 3D
  clic3D(e) {
    const R = this.ronda(); const s = this.estado;
    if (R && R.tipo === 'punta' && !s.resp && this.bits) {
      this.ray.setFromCamera(this.ndc(e), this.camera); const h = this.ray.intersectObjects(this.bits, true)[0]; let o = h?.object; while (o && o.userData.bit == null) o = o.parent;
      if (o) { this.opcion(o.userData.bit); return; }
    }
    const id = this.pick(e); if (!id) return;
    if (s.fase === 'ronda' && R?.tipo === 'objeto' && !s.resp) { this.elegir(id); return; }
    if (s.fase !== 'ronda' || s.resp || R?.tipo === 'opcion') this.mostrar(id);
  }
  ndc(e) { const rc = this.renderer.domElement.getBoundingClientRect(); return new THREE.Vector2(((e.clientX - rc.left) / rc.width) * 2 - 1, -((e.clientY - rc.top) / rc.height) * 2 + 1); }
  // ------------------------------------------------------------ juego
  empezar() {
    const niveles = this.def.niveles; const rondas = []; niveles.forEach((n, k) => barajar(n.rondas).forEach((r) => rondas.push({ ...r, nivel: k })));
    this.estado = { fase: 'ronda', rondas, i: 0, resp: null, detalle: [], vistos: new Set(), puntos: 0, racha: 0, mejorRacha: 0, tNivel: performance.now(), tRonda: performance.now(), niveles: niveles.map(() => ({ bien: 0, total: 0, seg: 0 })), asig: {} };
    this.$('#ajHud').hidden = false; this.prepararRonda(); this.pintar(); this.resaltar();
  }
  prepararRonda() {
    const R = this.ronda(); if (!R) return; this.estado.tRonda = performance.now(); this.estado.asig = {};
    if (this.esReto(R)) this.montarReto(R); else { this.limpiarVitrina(); this.$('#ajVolver').hidden = true; this.ir('mesa'); }
  }
  puntuar(ok) {
    const s = this.estado; const R = this.ronda(); const seg = (performance.now() - s.tRonda) / 1000; const N = s.niveles[R.nivel]; N.total++;
    if (ok) { s.racha++; s.mejorRacha = Math.max(s.mejorRacha, s.racha); const p = 100 + Math.max(0, Math.round(60 - seg * 4)) + Math.min(5, s.racha - 1) * 10; s.puntos += p; s.ultimo = p; N.bien++; } else { s.racha = 0; s.ultimo = 0; }
  }
  elegir(id) {
    const s = this.estado; const R = this.ronda(); if (!R || s.resp || R.tipo !== 'objeto') return;
    const ok = R.ok.includes(id); s.resp = { id, ok }; s.detalle.push({ q: R.q, ok }); R.ok.forEach((x) => s.vistos.add(x)); s.vistos.add(id); this.puntuar(ok); this.finRonda(); this.pintar(); this.resaltar();
    if (ok) setTimeout(() => { if (this.estado.resp && this.ronda() === R) this.mostrar(id); }, 350);
  }
  opcion(k) {
    const s = this.estado; const R = this.ronda(); if (!R || s.resp || !R.opciones || R.tipo === 'colores') return;
    const ok = (R.correctas || [R.correcta]).includes(k); s.resp = { k, ok }; s.detalle.push({ q: R.q, ok }); this.puntuar(ok); this.animarReto(R, k, ok); this.finRonda(); this.pintar(); this.resaltar();
  }
  asignarColor(b, c) { const s = this.estado; if (s.resp) return; s.asig[b] = c; this.clavija?.userData.cablear(s.asig); this.pintar(); }
  comprobarColores() {
    const s = this.estado; const R = this.ronda(); if (!R || s.resp || R.tipo !== 'colores') return; const a = s.asig;
    const ok = ['marron', 'negro', 'gris'].includes(a.L) && a.N === 'azul' && a.PE === 'tierra'; s.resp = { ok }; s.detalle.push({ q: R.q, ok }); this.puntuar(ok); this.finRonda(); this.pintar();
  }
  animarReto(R, k, ok) {
    const t0 = performance.now();
    if (R.tipo === 'punta' && this.bits?.[k]) { const b = this.bits[k]; const p0 = b.position.clone(); const p1 = new THREE.Vector3(0, 12.5, 0); b.rotation.x = Math.PI; this.anims.push(() => { const f = Math.min(1, (performance.now() - t0) / 700); b.position.lerpVectors(p0, p1, suave(f)); if (f >= 1) { if (ok) b.rotation.y += 0.15; else b.position.x = Math.sin(performance.now() / 30) * 0.4; } }); }
    if (R.tipo === 'pelar' && this.cable) { const mm = R.mm[k]; const c = this.cable; const pc = this.pc; this.anims.push(() => { const f = Math.min(1, (performance.now() - t0) / 900); pc?.userData.cerrar?.(f < 0.6 ? f / 0.6 : 1 - (f - 0.6) / 0.4); });
      setTimeout(() => { if (!this.reto) return; const n = conductor({ sec: R.sec || 2.5, color: R.color || 'marron', len: this.L0 + mm / 10, pelado: [0, mm] }); n.scale.copy(c.scale); n.position.copy(c.position); this.reto.remove(c); liberar(c); this.reto.add(n); this.cable = n; }, 520); }
  }
  finRonda() { const s = this.estado; const R = this.ronda(); const sig = s.rondas[s.i + 1]; if (!sig || sig.nivel !== R.nivel) { const N = s.niveles[R.nivel]; N.seg = (performance.now() - s.tNivel) / 1000; N.estrellas = this.estrellas(N, this.def.niveles[R.nivel]); } }
  estrellas(N, def) { const a = N.total ? N.bien / N.total : 0; return a >= 1 && N.seg <= (def.tiempo || 120) ? 3 : a >= 0.75 ? 2 : a >= 0.5 ? 1 : 0; }
  siguiente() {
    const s = this.estado; if (s.i + 1 >= s.rondas.length) { s.fase = 'fin'; s.aciertos = s.detalle.filter((d) => d.ok).length; this.limpiarVitrina(); this.ir('general'); this.$('#ajHud').hidden = true; this.$('#ajVolver').hidden = true; }
    else { const cambia = s.rondas[s.i + 1].nivel !== s.rondas[s.i].nivel; s.i++; s.resp = null; if (cambia) s.tNivel = performance.now(); this.prepararRonda(); }
    this.pintar(); this.resaltar(); this.$('#acLado [data-ac]')?.focus();
  }
  hud() {
    const s = this.estado; const h = this.$('#ajHud'); if (!h || s.fase !== 'ronda') return; const R = this.ronda(); const N = this.def.niveles[R.nivel];
    const seg = Math.floor((performance.now() - s.tNivel) / 1000); if (h._k === `${s.i}|${seg}|${s.puntos}|${!!s.resp}`) return; h._k = `${s.i}|${seg}|${s.puntos}|${!!s.resp}`;
    const enN = s.rondas.filter((r) => r.nivel === R.nivel); const idx = enN.indexOf(R);
    h.innerHTML = `<span class="aj-niv">${N.icono || '🎯'} Nivel ${R.nivel + 1}/${this.def.niveles.length} · ${esc(N.n)}</span><span class="aj-r">${idx + 1}/${enN.length}</span><span class="aj-t ${seg > (N.tiempo || 120) ? 'tarde' : ''}">⏱ ${mmss(seg)}<small> / ${mmss(N.tiempo || 120)}</small></span><span class="aj-p">🏆 ${s.puntos}</span>${s.racha > 1 ? `<span class="aj-racha">🔥 ×${s.racha}</span>` : ''}`;
  }
  loop() {
    this.raf = requestAnimationFrame(() => this.loop()); if (!this.renderer) return;
    if (this.tw) { const f = Math.min(1, (performance.now() - this.tw.ini) / this.tw.dur); const k = suave(f); this.camera.position.lerpVectors(this.tw.p0, this.tw.p1, k); this.controls.target.lerpVectors(this.tw.t0, this.tw.t1, k); if (f >= 1) this.tw = null; }
    const t = this.reloj?.getElapsedTime() || 0; for (const a of this.anims) a(t);
    this.controls.update(); this.renderer.render(this.scene, this.camera); this.hud();
    const el = this.$('#acTags'); const w = this.renderer.domElement.clientWidth, h = this.renderer.domElement.clientHeight; const vistos = this.estado.vistos || new Set();
    const ver = !this.reto && !this.vitrina; const html = ver ? [...this.objs.values()].map((x, i) => { const v = x.tag.clone().project(this.camera); if (v.z > 1 || Math.abs(v.x) > 1.05 || Math.abs(v.y) > 1.05) return ''; return `<span class="ac-tag ${vistos.has(x.o.id) ? 'visto' : ''}" style="left:${((v.x + 1) / 2) * w}px;top:${((1 - v.y) / 2) * h}px">${i + 1}${vistos.has(x.o.id) ? ' · ' + esc(x.o.n) : ''}</span>`; }).join('') : '';
    if (html !== this._tags) { el.innerHTML = html; this._tags = html; }
  }
  estrellasHTML(n, max = 3) { return `<span class="aj-est">${'★'.repeat(n)}<i>${'★'.repeat(max - n)}</i></span>`; }
  pintar() {
    const s = this.estado; const d = this.def; const L = this.$('#acLado'); if (!L) return; const lista = [...this.objs.values()];
    if (s.fase === 'intro') {
      const total = d.niveles.reduce((a, n) => a + n.rondas.length, 0);
      L.innerHTML = `<h2>${d.icon} ${esc(d.titulo)}</h2><p>${esc(d.intro)}</p><ol class="aj-niveles">${d.niveles.map((n) => `<li><b>${n.icono || '🎯'} ${esc(n.n)}</b><span>${n.rondas.length} retos · ⏱ ${mmss(n.tiempo || 120)}</span><small>${esc(n.desc || '')}</small></li>`).join('')}</ol>
        <ul class="ac-info"><li>📋 ${total} retos en ${d.niveles.length} niveles · ⭐ hasta ${d.niveles.length * 3} estrellas</li><li>📚 ${esc(d.tema || '')}</li><li>🖱 Pulsa cualquier herramienta para verla de cerca y cómo se usa.</li></ul>
        ${this.asignacionHTML()}<div class="ac-acts"><button class="btn primary" data-ac="empezar">▶ Empezar</button></div>`; return;
    }
    if (s.fase === 'fin') {
      const n = nota10(s.aciertos, s.rondas.length); const est = s.niveles.reduce((a, x) => a + (x.estrellas || 0), 0);
      L.innerHTML = `<h2>${n >= 5 ? '🎉' : '💪'} Resultado</h2><div class="aj-fin"><div>${this.estrellasHTML(Math.round(est / d.niveles.length))}</div><div class="ac-nota"><b>${s.aciertos}</b> de ${s.rondas.length} aciertos · Nota <b>${String(n).replace('.', ',')}</b></div><div>🏆 <b>${s.puntos}</b> puntos · 🔥 mejor racha ${s.mejorRacha} · ⭐ ${est}/${d.niveles.length * 3}</div></div>
        <ul class="aj-resniv">${d.niveles.map((nv, k) => `<li>${nv.icono || ''} ${esc(nv.n)} ${this.estrellasHTML(s.niveles[k].estrellas || 0)} <small>${s.niveles[k].bien}/${s.niveles[k].total} · ${mmss(s.niveles[k].seg || 0)}</small></li>`).join('')}</ul>
        <ol class="ac-repaso">${s.detalle.map((x) => `<li class="${x.ok ? 'ok' : 'ko'}">${x.ok ? '✔' : '✖'} ${esc(x.q)}</li>`).join('')}</ol>
        ${this.asignacionHTML(true)}<div class="ac-acts"><button class="btn" data-ac="empezar">↻ Repetir</button><a class="btn" href="${esc(this.opts.volver || '#asignaturas')}">← Actividades</a></div>`; return;
    }
    const R = this.ronda(); const r = s.resp; const N = d.niveles[R.nivel];
    const cab = `<div class="ac-prog" role="progressbar" aria-valuemin="0" aria-valuemax="${s.rondas.length}" aria-valuenow="${s.i + 1}"><span style="width:${((s.i + (r ? 1 : 0)) / s.rondas.length) * 100}%"></span></div>
      <div class="ac-n">Reto ${s.i + 1} de ${s.rondas.length} · ${s.detalle.filter((x) => x.ok).length} aciertos · ${N.icono || ''} ${esc(N.n)}</div><h3 class="ac-q">${esc(R.q)}</h3>`;
    let cuerpo = '';
    if (R.tipo === 'objeto') cuerpo = `<p class="ac-small">Pulsa la pieza en la mesa o su número:</p><div class="ac-nums" role="group" aria-label="Piezas">${lista.map((x, i) => `<button class="ac-num ${r ? (R.ok.includes(x.o.id) ? 'ok' : r.id === x.o.id ? 'ko' : '') : ''}" data-ac="pieza" data-id="${esc(x.o.id)}" ${r ? 'disabled' : ''} aria-label="Pieza ${i + 1}">${i + 1}</button>`).join('')}</div>`;
    else if (R.tipo === 'colores') {
      const cols = ['marron', 'negro', 'gris', 'azul', 'tierra'];
      cuerpo = `<p class="ac-small">Elige el color del conductor para cada borne de la clavija (mírala en 3D) y pulsa «Comprobar».</p><div class="aj-cols">${[['L', 'Borne de fase (L)'], ['N', 'Borne de neutro (N)'], ['PE', 'Borne central de tierra (⏚)']].map(([b, n]) => `<div class="aj-col"><b>${n}</b><div>${cols.map((c) => `<button class="aj-c c-${c} ${s.asig[b] === c ? 'on' : ''}" data-ac="col" data-b="${b}" data-c="${c}" title="${NOMBRE_COLOR[c]}" ${r ? 'disabled' : ''}>${NOMBRE_COLOR[c]}</button>`).join('')}</div></div>`).join('')}</div>
        ${r ? '' : `<div class="ac-acts"><button class="btn primary" data-ac="comprobar" ${Object.keys(s.asig).length < 3 ? 'disabled' : ''}>✔ Comprobar</button></div>`}`;
    } else {
      const ok = R.correctas || [R.correcta];
      cuerpo = `${R.ayuda ? `<p class="ac-small">${esc(R.ayuda)}</p>` : ''}<div class="ac-ops ${R.tipo !== 'opcion' ? 'aj-ops' : ''}" role="group" aria-label="Opciones">${R.opciones.map((o, k) => `<button class="ac-op ${r ? (ok.includes(k) ? 'ok' : k === r.k ? 'ko' : '') : ''}" data-ac="op" data-k="${k}" ${r ? 'disabled' : ''}>${esc(o)}</button>`).join('')}</div>`;
    }
    let fb = '';
    if (r) {
      const finNivel = !s.rondas[s.i + 1] || s.rondas[s.i + 1].nivel !== R.nivel; const NV = s.niveles[R.nivel];
      fb = `<div class="ac-fb ${r.ok ? 'ok' : 'ko'}"><b>${r.ok ? `✔ ¡Correcto! +${s.ultimo} puntos` : '✖ No es esa.'}</b> ${R.tipo === 'objeto' && !r.ok ? `Era: <b>${esc(R.ok.map((id) => this.objs.get(id)?.o.n).join(' / '))}</b>. ` : ''}${esc(R.exp || '')}</div>
        ${finNivel ? `<div class="aj-nivel-ok">🏁 Nivel ${R.nivel + 1} terminado ${this.estrellasHTML(NV.estrellas || 0)}<small>${NV.bien}/${NV.total} aciertos · ${mmss(NV.seg || 0)}</small></div>` : ''}
        <div class="ac-acts"><button class="btn primary" data-ac="sig">${s.i + 1 >= s.rondas.length ? 'Ver el resultado' : finNivel ? 'Siguiente nivel ▶' : 'Siguiente ▶'}</button></div>`;
    }
    L.innerHTML = cab + cuerpo + fb;
  }
  async entregar(b) {
    const s = this.estado; const a = this.opts.asignacion?.(); if (!a) return;
    b.disabled = true; const msg = this.$('#acMsg'); msg.textContent = 'Enviando…'; const est = s.niveles.reduce((x, n) => x + (n.estrellas || 0), 0);
    const txt = textoResultado(this.def, s.aciertos, s.rondas.length, s.detalle) + `\n\n🏆 Puntos: ${s.puntos} · Estrellas: ${est}/${this.def.niveles.length * 3} · Mejor racha: ${s.mejorRacha}`;
    try { await this.opts.entregar(a.itemId, txt); msg.textContent = '✔ Entregado'; msg.className = 'ac-msg ok'; }
    catch (e) { b.disabled = false; msg.textContent = '❌ No se ha podido entregar (' + (e?.code || e?.message || 'error') + ').'; msg.className = 'ac-msg ko'; }
  }
  onClick(e) {
    const b = e.target.closest('[data-ac]'); if (!b || !this.host.contains(b)) return; const a = b.dataset.ac;
    if (a === 'col') { this.asignarColor(b.dataset.b, b.dataset.c); return; }
    if (a === 'comprobar') { this.comprobarColores(); return; }
    if (a === 'mesa') { this.volverMesa(); return; }
    super.onClick(e);
  }
  resaltar() {
    const R = this.ronda(); const st = this.estado;
    for (const [id, x] of this.objs) {
      let col = 0x000000, k = 0;
      if (st.fase === 'ronda' && st.resp && R.tipo === 'objeto') { if (R.ok.includes(id)) { col = 0x1fbf4a; k = 0.45; } else if (st.resp.id === id) { col = 0xdc001b; k = 0.5; } }
      else if (st.fase === 'ronda' && R?.foco?.includes(id)) { col = 0xf39900; k = 0.35; }
      else if (id === this.hover) { col = 0xf39900; k = 0.28; }
      x.mats.forEach((m) => { m.emissive.setHex(col); m.emissiveIntensity = k; });
    }
  }
  onMove(e) { const id = this.reto ? null : this.pick(e); if (id !== this.hover) { this.hover = id; this.renderer.domElement.style.cursor = id ? 'pointer' : ''; this.resaltar(); } }
  destruir() { super.destruir(); this.limpiarVitrina(); }
}

// Modelos detallados (nivel de la placa ESP32): resistencia con cuerpo de «hueso» y bandas que siguen el
// perfil, LED de 5 mm con lente, pestaña plana, yunque y poste internos, TO-92 con cara plana rotulada,
// relé sellado, pila de 9 V con broches reales, portapilas con muelles, polímetro con funda de goma,
// pinzas de cocodrilo estampadas, Dupont con su ventana de enganche y clavijas banana con lamelas.
// Todo procedural (Three.js), con geometrías cacheadas y menos segmentos en equipos modestos.
// Las posiciones de patas y terminales NO cambian (parts.js manda): solo cambia lo que se ve.
import * as THREE from 'three';
import { BT } from './board.js';
import { calidad } from '../kit3d/base.js';

const Q = () => { try { return calidad(); } catch (e) { return { baja: false, seg: 24 }; } };
export const SEG = () => (Q().baja ? 14 : 28);
const gc = new Map();
export const G = (k, f) => { if (!gc.has(k)) { const g = f(); g.userData.compartida = true; gc.set(k, g); } return gc.get(k); };
const mc = new Map();
export function PM(color, o = {}) { // material físico (laca, barniz, plástico brillante)
  const k = color + JSON.stringify(o);
  if (!mc.has(k)) { const fis = o.clearcoat != null || o.transmission != null; const m = fis ? new THREE.MeshPhysicalMaterial({ color, roughness: 0.5, metalness: 0, ...o }) : new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0, ...o }); mc.set(k, m); }
  return mc.get(k);
}
export const ESTANO = () => PM(0xd3d7dc, { metalness: 0.95, roughness: 0.24 });
export const NIQUEL = () => PM(0xc3c8ce, { metalness: 1, roughness: 0.2 });
export const LATON = () => PM(0xd9b862, { metalness: 1, roughness: 0.27 });
export const COBRE = () => PM(0xd4834a, { metalness: 1, roughness: 0.3 });
const NEGRO_MATE = () => PM(0x18191b, { roughness: 0.62 });
export function mesh(geo, mat, x = 0, y = 0, z = 0, p) { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; if (p) p.add(m); return m; }
// Torno alrededor de Y: perfil [[r, y], …]
export function tornoY(perfil, seg = SEG()) { return new THREE.LatheGeometry(perfil.map(([r, y]) => new THREE.Vector2(Math.max(1e-4, r), y)), seg); }
// Tubo por puntos con codos redondeados (patas, hilos)
export function hilo(p, pts, r, mat, seg = 24, rad = 8) {
  const c = new THREE.CatmullRomCurve3(pts.map((q) => new THREE.Vector3(...q)), false, 'centripetal');
  const m = mesh(new THREE.TubeGeometry(c, seg, r, rad, false), mat, 0, 0, 0, p); m.castShadow = false; return m;
}
// Caja con cantos redondeados y bisel (extrusión en XZ, sube desde y)
export function cajaR(w, h, d, r, mat, x, y, z, p, bisel = 0.12) {
  const k = `cr|${w}|${h}|${d}|${r}|${bisel}`;
  const geo = G(k, () => {
    const s = new THREE.Shape(); const hw = w / 2 - r - bisel, hd = d / 2 - r - bisel, W = w / 2 - bisel, D = d / 2 - bisel;
    s.moveTo(-hw, -D); s.lineTo(hw, -D); s.quadraticCurveTo(W, -D, W, -hd); s.lineTo(W, hd); s.quadraticCurveTo(W, D, hw, D); s.lineTo(-hw, D); s.quadraticCurveTo(-W, D, -W, hd); s.lineTo(-W, -hd); s.quadraticCurveTo(-W, -D, -hw, -D);
    const g = new THREE.ExtrudeGeometry(s, { depth: Math.max(0.01, h - 2 * bisel), bevelEnabled: bisel > 0, bevelThickness: bisel, bevelSize: bisel, bevelSegments: 3, curveSegments: 6 });
    g.translate(0, 0, bisel); g.rotateX(-Math.PI / 2); g.translate(0, 0, 0); return g;
  });
  return mesh(geo, mat, x, y, z, p);
}
export function texCanvas(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.userData = { canvas: c, draw }; return t; }
const tc = new Map();
export const texC = (k, w, h, draw) => { if (!tc.has(k)) tc.set(k, texCanvas(w, h, draw)); return tc.get(k); };
// Pegatina plana con textura (cara hacia +y por defecto)
export function placa(p, w, d, tex, x, y, z, o = {}) {
  const m = mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshStandardMaterial({ map: tex, transparent: true, roughness: o.rough ?? 0.5, metalness: 0, polygonOffset: true, polygonOffsetFactor: -2 }), x, y, z, p);
  m.castShadow = false; if (!o.vertical) m.rotation.x = -Math.PI / 2; return m;
}

// ---------------------------------------------------------------- patas estañadas
// Pata recta que entra en el agujero (x, z) hasta h sobre la protoboard
export const pataRecta = (p, x, z, h, r = 0.11) => hilo(p, [[x, BT - 0.45, z], [x, BT + h, z]], r, ESTANO(), 2, 8);
// Pata con codo redondeado: del agujero sube y gira hasta el punto (x2, y2, z2)
export function pataCodo(p, x, z, x2, y2, z2, r = 0.11) {
  const k = BT + 0.5; const m = [(x + x2) / 2, Math.max(k + 0.25, (k + y2) / 2), (z + z2) / 2];
  return hilo(p, [[x, BT - 0.45, z], [x, k, z], m, [x2, y2, z2]], r, ESTANO(), 20, 8);
}

// ---------------------------------------------------------------- resistencia (cuerpo de «hueso», 1/4 W)
const PERFIL_R = [[0, -1.3], [0.2, -1.3], [0.36, -1.27], [0.48, -1.17], [0.54, -1.0], [0.56, -0.8], [0.53, -0.6], [0.47, -0.48], [0.45, -0.38], [0.45, 0.38], [0.47, 0.48], [0.53, 0.6], [0.56, 0.8], [0.54, 1.0], [0.48, 1.17], [0.36, 1.27], [0.2, 1.3], [0, 1.3]];
const rAt = (t) => { for (let i = 1; i < PERFIL_R.length; i++) { const [r0, t0] = PERFIL_R[i - 1], [r1, t1] = PERFIL_R[i]; if (t >= t0 && t <= t1 && t1 > t0) return r0 + (r1 - r0) * (t - t0) / (t1 - t0); } return 0.45; };
function banda(t0, t1) { // anillo de pintura que sigue el perfil
  return G(`banda|${t0}|${t1}|${SEG()}`, () => { const pts = []; for (let i = 0; i <= 6; i++) { const t = t0 + (t1 - t0) * i / 6; pts.push([rAt(t) + 0.012, t]); } return tornoY(pts); });
}
export function resistencia(p, hexBandas) {
  const y = BT + 1.15, cx = 2;
  // patas: bajan al agujero con un codo suave, como dobladas con alicates
  hilo(p, [[0, BT - 0.45, 0], [0, y - 0.45, 0], [0.12, y - 0.1, 0], [0.45, y, 0], [cx - 1.25, y, 0]], 0.11, ESTANO(), 22);
  hilo(p, [[4, BT - 0.45, 0], [4, y - 0.45, 0], [3.88, y - 0.1, 0], [3.55, y, 0], [cx + 1.25, y, 0]], 0.11, ESTANO(), 22);
  const cuerpo = PM(0xdcc69b, { roughness: 0.42, clearcoat: 0.6, clearcoatRoughness: 0.35 });
  const g = new THREE.Group(); g.position.set(cx, y, 0); g.rotation.z = Math.PI / 2; p.add(g);
  mesh(G('resR|' + SEG(), () => tornoY(PERFIL_R)), cuerpo, 0, 0, 0, g);
  // 1.ª banda en el abombado, 2.ª y 3.ª en el centro, tolerancia separada en el otro extremo
  const pos = [[-0.98, -0.78], [-0.42, -0.24], [-0.06, 0.12], [0.66, 0.86]];
  pos.forEach(([a, b], i) => mesh(banda(a, b), PM(new THREE.Color(hexBandas[i]).getHex(), { roughness: 0.38, clearcoat: 0.5, clearcoatRoughness: 0.3, metalness: i === 3 && /c9a23a/i.test(hexBandas[3]) ? 0.6 : 0 }), 0, 0, 0, g).castShadow = false);
}

// ---------------------------------------------------------------- LED de 5 mm
export function led5(p, col, opts = {}) {
  const y0 = BT + 1.7, cx = opts.cx ?? 0.5;
  const baja = Q().baja;
  const mat = new THREE.MeshPhysicalMaterial({ color: col.hex, transparent: true, opacity: 0.82, roughness: 0.06, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.05, transmission: baja ? 0 : 0.35, thickness: 1.2, ior: 1.5, emissive: new THREE.Color(col.hex), emissiveIntensity: 0, side: THREE.FrontSide });
  // cápsula: pestaña con el lado plano (cátodo, hacia +x), cuerpo y cúpula
  const perfil = [[0, 0], [1.14, 0], [1.16, 0.06], [1.16, 0.26], [1.12, 0.31], [0.99, 0.33], [0.99, 2.15]];
  for (let i = 1; i <= 10; i++) { const a = (i / 10) * Math.PI / 2; perfil.push([0.99 * Math.cos(a), 2.15 + 0.99 * Math.sin(a)]); }
  const geo = G('led5|' + SEG(), () => { const g = tornoY(perfil); const P = g.attributes.position; for (let i = 0; i < P.count; i++) if (P.getX(i) > 0.98 && P.getY(i) < 0.4) P.setX(i, 0.98); g.computeVertexNormals(); return g; });
  const body = mesh(geo, mat, cx, y0, 0, p); body.castShadow = true;
  // patas dentro de la resina, yunque (cátodo, grande) con copa reflectora y poste (ánodo) con hilo de oro
  const metal = NIQUEL();
  const ia = mesh(G('ledPost', () => new THREE.BoxGeometry(0.16, 1.55, 0.12)), metal, cx - 0.42, y0 + 0.75, 0, p);
  const ik = mesh(G('ledYunque', () => new THREE.BoxGeometry(0.42, 1.25, 0.12)), metal, cx + 0.3, y0 + 0.6, 0, p);
  const copa = mesh(G('ledCopa', () => tornoY([[0.05, 0], [0.22, 0.02], [0.3, 0.22], [0.26, 0.24], [0.16, 0.06], [0.05, 0.06]], 16)), PM(0xe9edf2, { metalness: 1, roughness: 0.12 }), cx + 0.22, y0 + 1.22, 0, p);
  mesh(G('ledDado', () => new THREE.BoxGeometry(0.1, 0.06, 0.1)), PM(0xf6f2e0, { emissive: 0xffffff, emissiveIntensity: 0.1 }), cx + 0.22, y0 + 1.3, 0, p);
  hilo(p, [[cx + 0.22, y0 + 1.33, 0], [cx - 0.05, y0 + 1.75, 0], [cx - 0.42, y0 + 1.5, 0]], 0.018, PM(0xe2c46a, { metalness: 1, roughness: 0.25 }), 10, 4);
  [ia, ik, copa].forEach((o) => { o.castShadow = false; });
  return { mat, y0, top: y0 + 3.14 };
}

// ---------------------------------------------------------------- transistor TO-92
export function to92(p, rotulo = ['BC', '547']) {
  // patas C B E (x = 0, 1, 2) que se juntan bajo la cápsula
  [0, 1, 2].forEach((x) => hilo(p, [[x, BT - 0.45, 0], [x, BT + 0.35, 0], [0.62 + x * 0.38, BT + 1.05, -0.05], [0.62 + x * 0.38, BT + 1.45, -0.05]], 0.085, ESTANO(), 16, 6));
  const geo = G('to92', () => {
    // dibujo en (x, y) con la cara plana en y = −0,42; al girar −90° en X, y pasa a −z: la cara plana mira a +z (al alumno)
    const s = new THREE.Shape(); const R = 0.95, yc = 0.32; const a0 = Math.asin((-0.42 - yc) / R);
    s.moveTo(Math.cos(a0) * R, -0.42); s.absarc(0, yc, R, a0, Math.PI - a0, false); s.lineTo(Math.cos(a0) * R, -0.42);
    const g = new THREE.ExtrudeGeometry(s, { depth: 1.75, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.05, bevelSegments: 2, curveSegments: 24 });
    g.rotateX(-Math.PI / 2); return g;
  });
  mesh(geo, PM(0x161719, { roughness: 0.55 }), 1, BT + 1.45, 0, p);
  const t = texC('to92|' + rotulo.join(), 128, 128, (c) => { c.fillStyle = '#d6d9dd'; c.font = '700 30px Arial, sans-serif'; c.textAlign = 'center'; c.fillText(rotulo[0], 64, 44); c.fillText(rotulo[1], 64, 78); c.font = '700 17px Arial'; c.fillStyle = '#a9adb3'; c.fillText('C   B   E', 64, 116); });
  const f = placa(p, 1.5, 1.6, t, 1, BT + 2.38, 0.47 + 0.02, { vertical: true }); f.castShadow = false;
}

// ---------------------------------------------------------------- relé sellado de 5 V
export function rele(p) {
  for (const [x, z] of [[0, 0], [4, 0], [0, 3], [2, 3], [4, 3]]) { pataRecta(p, x, z, 0.35, 0.12); mesh(G('relPie', () => new THREE.BoxGeometry(0.5, 0.06, 0.32)), ESTANO(), x, BT + 0.33, z, p).castShadow = false; }
  mesh(G('relBase', () => new THREE.BoxGeometry(5.1, 0.3, 4.3)), PM(0x1a3d86, { roughness: 0.7 }), 2, BT + 0.3, 1.5, p);
  cajaR(5.2, 4.25, 4.4, 0.18, PM(0x2a5fc6, { roughness: 0.3, clearcoat: 0.5, clearcoatRoughness: 0.25 }), 2, BT + 0.42, 1.5, p, 0.1);
  const lado = texC('relLado', 256, 160, (c, w, h) => { c.fillStyle = '#e8efff'; c.font = '800 30px Arial'; c.textAlign = 'center'; c.fillText('05VDC', w / 2, 46); c.font = '600 20px Arial'; c.fillText('10A 250VAC', w / 2, 82); c.fillText('10A 30VDC', w / 2, 110); c.font = '600 16px Arial'; c.fillText('Relé · bobina 70 Ω', w / 2, 142); });
  placa(p, 4.6, 2.9, lado, 2, BT + 2.5, 3.72, { vertical: true });
}

// ---------------------------------------------------------------- pila de 9 V
export function pila9(p) {
  // cuerpo con cantos redondeados, etiqueta que envuelve, cabeza metálica engastada y broches + (redondo) / − (hexagonal)
  cajaR(10.4, 15.2, 6.9, 0.7, PM(0x15161a, { roughness: 0.4, clearcoat: 0.4 }), 0, 0, 0, p, 0.25);
  const et = texC('pila9', 512, 720, (c, w, h) => {
    const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#2a2d33'); g.addColorStop(0.55, '#15171a'); g.addColorStop(1, '#0d0e10'); c.fillStyle = g; c.fillRect(0, 0, w, h);
    c.fillStyle = '#e4a321'; c.fillRect(0, 0, w, 120); c.fillStyle = '#c97f12'; c.fillRect(0, 112, w, 8);
    c.fillStyle = '#ffffff'; c.font = '900 240px Arial'; c.textAlign = 'center'; c.fillText('9V', w / 2, 420);
    c.font = '700 44px Arial'; c.fillStyle = '#e4a321'; c.fillText('ALCALINA', w / 2, 520); c.font = '600 32px Arial'; c.fillStyle = '#b9bec6'; c.fillText('6LR61 · 9 V', w / 2, 580);
  });
  placa(p, 9.8, 13.6, et, 0, 7.5, 3.47, { vertical: true, rough: 0.35 });
  const et2 = texC('pila9b', 256, 720, (c, w, h) => { c.fillStyle = '#15171a'; c.fillRect(0, 0, w, h); c.fillStyle = '#e4a321'; c.fillRect(0, 0, w, 120); c.save(); c.translate(w / 2, h / 2 + 60); c.rotate(-Math.PI / 2); c.fillStyle = '#d0d4da'; c.font = '700 54px Arial'; c.textAlign = 'center'; c.fillText('9 V  ALCALINA', 0, 18); c.restore(); });
  for (const s of [-1, 1]) { const m = placa(p, 5.6, 13.6, et2, s * 5.21, 7.5, 0, { vertical: true, rough: 0.35 }); m.rotation.y = s * Math.PI / 2; }
  const back = placa(p, 9.8, 13.6, et, 0, 7.5, -3.47, { vertical: true, rough: 0.35 }); back.rotation.y = Math.PI;
  // cabeza metálica con el reborde engastado
  cajaR(10.5, 3.6, 7.0, 0.7, PM(0xbfc4ca, { metalness: 1, roughness: 0.3 }), 0, 15.0, 0, p, 0.3);
  cajaR(10.7, 0.5, 7.2, 0.75, PM(0xaeb3b9, { metalness: 1, roughness: 0.35 }), 0, 14.85, 0, p, 0.18);
  cajaR(9.0, 0.35, 5.4, 0.6, PM(0x1b1c1f, { roughness: 0.6 }), 0, 18.55, 0, p, 0.1); // aislante de la tapa
  // + : broche macho redondo con cuello
  mesh(G('p9mas', () => tornoY([[0, 0], [0.75, 0], [0.75, 0.15], [0.6, 0.22], [0.62, 0.45], [0.88, 0.62], [0.9, 0.85], [0.7, 1.0], [0, 1.02]])), NIQUEL(), -2.4, 18.6, 0, p);
  // − : broche hembra hexagonal con láminas
  const hexG = G('p9menos', () => { const g = new THREE.CylinderGeometry(1.18, 1.18, 1.0, 6, 1, true); g.translate(0, 0.5, 0); return g; });
  mesh(hexG, PM(0xc3c8ce, { metalness: 1, roughness: 0.2, side: THREE.DoubleSide }), 2.4, 18.6, 0, p);
  mesh(G('p9menosB', () => new THREE.CylinderGeometry(0.72, 0.72, 0.9, 20)), PM(0x0d0e10, { roughness: 0.8 }), 2.4, 18.62 + 0.45, 0, p);
  for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2 + Math.PI / 6; const l = mesh(G('p9lam', () => new THREE.BoxGeometry(0.42, 0.62, 0.06)), NIQUEL(), 2.4 + Math.cos(a) * 0.86, 19.3, Math.sin(a) * 0.86, p); l.rotation.y = -a + Math.PI / 2; l.rotation.x = 0.35; l.castShadow = false; }
}

// ---------------------------------------------------------------- portapilas AA
export function portapilas(p, n) {
  const w = n === 2 ? 13 : 25;
  const neg = PM(0x1c1e21, { roughness: 0.55 });
  cajaR(w, 1.0, 22, 0.5, neg, 0, 0, 0, p, 0.15); // fondo
  for (const s of [-1, 1]) cajaR(0.55, 3.4, 22, 0.2, neg, s * (w / 2 - 0.28), 0.6, 0, p, 0.08); // laterales
  for (const s of [-1, 1]) cajaR(w, 3.4, 0.8, 0.2, neg, 0, 0.6, s * 10.6, p, 0.08); // testeros
  for (let i = 0; i < n - 1; i++) mesh(G('aaSep', () => new THREE.BoxGeometry(0.3, 1.6, 20)), neg, -w / 2 + 0.6 + 5.95 * (i + 1), 1.6, 0, p);
  const cuerpoG = G('aa|' + SEG(), () => { const g = tornoY([[0, -9.85], [2.6, -9.85], [2.82, -9.7], [2.85, -9.4], [2.85, 9.3], [2.75, 9.5], [1.4, 9.55], [1.0, 9.6], [0.95, 10.05], [0.8, 10.15], [0, 10.15]]); g.rotateX(Math.PI / 2); return g; });
  // u = vuelta alrededor de la pila, v = a lo largo: el texto se escribe girado para que se lea a lo largo
  const etiqueta = texC('aaEt2', 512, 1024, (c, w2, h) => {
    c.fillStyle = '#1f8a4c'; c.fillRect(0, 0, w2, h); c.fillStyle = '#dfe5e9'; c.fillRect(0, 0, w2, h * 0.035); c.fillRect(0, h * 0.965, w2, h * 0.035);
    c.fillStyle = '#145f36'; c.fillRect(0, h * 0.06, w2, h * 0.14);
    c.save(); c.fillStyle = '#ffffff'; c.textAlign = 'center'; c.textBaseline = 'middle';
    for (const x of [w2 * 0.125, w2 * 0.625]) { c.save(); c.translate(x, h * 0.55); c.rotate(-Math.PI / 2); c.font = '800 70px Arial'; c.fillText('AA  1,5 V', 0, -12); c.font = '700 34px Arial'; c.fillText('LR6 · ALCALINA', 0, 46); c.restore(); }
    c.restore();
  });
  etiqueta.wrapS = THREE.RepeatWrapping;
  const pilaM = PM(0xffffff, { map: etiqueta, roughness: 0.35, clearcoat: 0.6, clearcoatRoughness: 0.2 });
  for (let i = 0; i < n; i++) {
    const x = -w / 2 + 0.6 + 2.95 + i * 5.95, dir = i % 2 ? 1 : -1;
    const c = mesh(cuerpoG, pilaM, x, 3.1, 0.6, p); c.rotation.y = dir > 0 ? 0 : Math.PI;
    mesh(G('aaTapa', () => { const g = new THREE.CylinderGeometry(2.6, 2.6, 0.12, SEG()); g.rotateX(Math.PI / 2); return g; }), NIQUEL(), x, 3.1, 0.6 - dir * 9.9, p);
    // muelle en el polo − y lámina en el +
    const zN = 0.6 - dir * 10.0, zW = dir > 0 ? -10.25 : 10.25; const pts = [];
    for (let k = 0; k <= 60; k++) { const a = k / 60 * Math.PI * 2 * 4.5, rr = 1.7 - k / 60 * 0.8; pts.push(new THREE.Vector3(x + Math.cos(a) * rr, 3.1 + Math.sin(a) * rr, zW + (zN - zW) * (k / 60) * 0.9)); }
    const sp = mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 120, 0.1, 5), NIQUEL(), 0, 0, 0, p); sp.castShadow = false;
    mesh(G('aaLam', () => new THREE.BoxGeometry(3.4, 3.6, 0.12)), NIQUEL(), x, 3.0, -zW * 0.99, p).castShadow = false;
  }
  // cables rojo y negro que salen del portapilas y acaban en punta estañada (los terminales «lead»)
  const cols = { '+': 0xc81e1e, '-': 0x1b1b1d };
  for (const [s, x] of [['+', -2.2], ['-', 2.2]]) {
    hilo(p, [[x * 1.4, 1.6, -10.9], [x * 1.2, 2.4, -12.2], [x, 4.0, -10.4], [x, 5.4, -9.2]], 0.32, PM(cols[s], { roughness: 0.45 }), 24, 10).castShadow = true;
    hilo(p, [[x, 5.35, -9.2], [x, 6.75, -9.2]], 0.16, PM(0xd8dbe0, { metalness: 0.95, roughness: 0.3 }), 2, 8);
  }
  mesh(G('aaClip', () => new THREE.BoxGeometry(6.4, 1.2, 1.4)), neg, 0, 4.2, -9.6, p); // pinza que sujeta las puntas
}

// polímetro digital y puntas de prueba: compartidos con el kit en ../kit3d/polimetro.js

// ---------------------------------------------------------------- conectores de cable
const CARCASA = () => PM(0x141416, { roughness: 0.5 });
// Dupont: carcasa 2,54 × 2,54 mm con chaflán, ventana del enganche y pin cuadrado (macho) o boca (hembra)
export function dupont(g, macho, p, EXIT, colorCable, rCable) {
  const { x, y, z } = p;
  if (macho) {
    const pin = mesh(G('dpPin', () => { const b = new THREE.BoxGeometry(0.25, 1.45, 0.25); return b; }), PM(0xd9c585, { metalness: 1, roughness: 0.22 }), x, y - 0.5, z);
    g.add(pin);
    mesh(G('dpPunta', () => new THREE.ConeGeometry(0.17, 0.25, 4).rotateY(Math.PI / 4)), PM(0xd9c585, { metalness: 1, roughness: 0.22 }), x, y - 1.32, z, g).rotation.x = Math.PI;
  }
  const h0 = macho ? y + 0.15 : y - 1.4, h1 = y + (macho ? EXIT.M : EXIT.H) - 0.35;
  const L = h1 - h0;
  mesh(G(`dpCar|${L.toFixed(2)}`, () => { const b = new THREE.BoxGeometry(0.98, L, 0.98, 1, 1, 1); b.translate(0, L / 2, 0); return b; }), CARCASA(), x, h0, z, g);
  mesh(G('dpCham', () => new THREE.CylinderGeometry(0.5, 0.69, 0.2, 4, 1).rotateY(Math.PI / 4)), CARCASA(), x, h0 - 0.1, z, g);
  // ventana del enganche (se ve la lengüeta metálica)
  mesh(G('dpVent|' + L.toFixed(2), () => new THREE.BoxGeometry(0.5, Math.min(1.4, L * 0.35), 0.02)), PM(0x050506, { roughness: 1 }), x, h0 + L * 0.38, z + 0.5, g).castShadow = false;
  mesh(G('dpLeng', () => new THREE.BoxGeometry(0.34, 0.5, 0.03)), PM(0xcfd3d8, { metalness: 1, roughness: 0.3 }), x, h0 + L * 0.36, z + 0.495, g).castShadow = false;
  if (!macho) mesh(G('dpBoca', () => new THREE.BoxGeometry(0.42, 0.03, 0.42)), PM(0x000000, { roughness: 1 }), x, h0 - 0.21, z, g).castShadow = false;
  // aislante del cable entrando en la carcasa (con el color del cable)
  mesh(G(`dpAisl|${rCable}`, () => new THREE.CylinderGeometry(rCable * 1.15, rCable * 1.25, 0.55, 12)), colorCable, x, h1 + 0.2, z, g);
}
// Pinza de cocodrilo: dos mordazas estampadas con dientes, eje con muelle y funda de PVC del color del cable
export function cocodrilo(g, p, mat, dir) {
  const cg = new THREE.Group(); cg.position.set(p.x, p.y, p.z); g.add(cg);
  cg.rotation.y = dir ? Math.atan2(dir.x, dir.z) : 0;
  const inner = new THREE.Group(); inner.rotation.x = -0.32; cg.add(inner);
  const acero = PM(0xc9ced4, { metalness: 1, roughness: 0.3, side: THREE.DoubleSide });
  const mand = G('crMand', () => {
    const s = new THREE.Shape(); s.moveTo(0.02, -0.15);
    for (let i = 0; i < 6; i++) { const yy = 0.05 + i * 0.32; s.lineTo(0.16, yy); s.lineTo(0.04, yy + 0.16); }
    s.lineTo(0.12, 2.1); s.lineTo(0.45, 2.45); s.lineTo(0.55, 3.2); s.lineTo(0.7, 3.4); s.lineTo(0.48, 3.5); s.lineTo(0.32, 2.6); s.lineTo(0.38, 1.4); s.lineTo(0.3, 0.3); s.lineTo(0.02, -0.15);
    const e = new THREE.ExtrudeGeometry(s, { depth: 0.62, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.02, bevelSegments: 1, curveSegments: 4 }); e.translate(0, 0, -0.31); e.rotateY(Math.PI / 2); return e;
  });
  // el dibujo está en (x→z del mundo, y): una mordaza a cada lado
  const a = mesh(mand, acero, 0, 0, 0, inner); const b2 = mesh(mand, acero, 0, 0, 0, inner); b2.scale.z = -1;
  mesh(G('crEje', () => new THREE.CylinderGeometry(0.16, 0.16, 0.9, 12).rotateZ(Math.PI / 2)), NIQUEL(), 0, 2.15, 0, inner);
  const mu = []; for (let k = 0; k <= 30; k++) { const an = k / 30 * Math.PI * 4; mu.push(new THREE.Vector3(-0.32 + k / 30 * 0.64, 2.15 + Math.cos(an) * 0.24, Math.sin(an) * 0.24)); }
  mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(mu), 40, 0.04, 4), NIQUEL(), 0, 0, 0, inner).castShadow = false;
  // funda de PVC
  const f = mesh(G('crFunda|' + SEG(), () => { const g2 = tornoY([[0.1, 2.3], [0.62, 2.45], [0.78, 3.0], [0.82, 4.0], [0.7, 4.8], [0.42, 5.3], [0.3, 5.5], [0.1, 5.55]]); return g2; }), mat, 0, 0, 0, inner);
  f.scale.set(0.78, 1, 1.22);
}
// Clavija banana de 4 mm: lamela partida, cuerpo con estrías y protector
export function banana(g, p, mat, EXIT) {
  const { x, y, z } = p;
  mesh(G('bnPin', () => tornoY([[0, -1.45], [0.14, -1.42], [0.2, -1.2], [0.24, -0.8], [0.2, -0.35], [0.22, 0.2], [0.24, 0.3]], 12)), LATON(), x, y, z, g);
  mesh(G('bnRan', () => new THREE.BoxGeometry(0.03, 0.9, 0.5)), PM(0x3a2e10, { roughness: 1 }), x, y - 0.8, z, g).castShadow = false;
  const pr = [[0.24, 0.2], [0.62, 0.2], [0.64, 0.55], [0.5, 0.7]]; for (let i = 0; i <= 8; i++) pr.push([0.5 + (i % 2 ? 0.05 : 0), 0.8 + i * 0.4]); pr.push([0.42, EXIT.B + 0.2], [0.3, EXIT.B + 0.35]);
  mesh(G('bnCuerpo|' + EXIT.B, () => tornoY(pr, 16)), mat, x, y, z, g);
}

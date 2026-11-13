// Modelos 3D propios (procedurales) de la protoboard y los componentes. Unidades: 1 = 2,54 mm.
import * as THREE from 'three';
import { BT, ROWZ, COLS, colX, isRailCol, BOARD_W, BOARD_D, rot } from './board.js';
import { PARTS, LED_COLORS, resistorBands, WIRE_HEX } from './parts.js';
import { resistencia, led5, to92, rele, pila9, portapilas, dupont, cocodrilo, banana, pataCodo, pataRecta, tornoY, cajaR, PM, ESTANO, NIQUEL, texCanvas } from './detalle.js';
import { polimetro, punta } from '../kit3d/polimetro.js';

const mc = {};
export function M(color, o = {}) { const k = color + JSON.stringify(o); return mc[k] || (mc[k] = new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.05, ...o })); }
const METAL = () => M(0xc4c8ce, { metalness: 0.9, roughness: 0.28 });
function mesh(geo, mat, x = 0, y = 0, z = 0, parent) { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; if (parent) parent.add(m); return m; }
const box = (w, h, d, mat, x, y, z, p) => mesh(new THREE.BoxGeometry(w, h, d), mat, x, y + h / 2, z, p);
const cyl = (r, h, mat, x, y, z, p, seg = 20, r2) => mesh(new THREE.CylinderGeometry(r, r2 ?? r, h, seg), mat, x, y + h / 2, z, p);
function rbox(w, h, d, r, mat, x, y, z, p) { // caja con cantos redondeados
  const s = new THREE.Shape(); const hw = w / 2 - r, hd = d / 2 - r;
  s.moveTo(-hw, -d / 2); s.lineTo(hw, -d / 2); s.quadraticCurveTo(w / 2, -d / 2, w / 2, -hd); s.lineTo(w / 2, hd); s.quadraticCurveTo(w / 2, d / 2, hw, d / 2); s.lineTo(-hw, d / 2); s.quadraticCurveTo(-w / 2, d / 2, -w / 2, hd); s.lineTo(-w / 2, -hd); s.quadraticCurveTo(-w / 2, -d / 2, -hw, -d / 2);
  const g = new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: false, curveSegments: 4 }); g.rotateX(-Math.PI / 2); g.rotateY(0);
  return mesh(g, mat, x, y, z, p);
}
function lead(p, x1, y1, z1, x2, y2, z2, r = 0.11) {
  const a = new THREE.Vector3(x1, y1, z1), b = new THREE.Vector3(x2, y2, z2), d = b.clone().sub(a), L = d.length();
  const m = mesh(new THREE.CylinderGeometry(r, r, L, 8), METAL(), 0, 0, 0, p);
  m.position.copy(a).add(b).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); m.castShadow = false;
  return m;
}
const gcache = new Map();
function geoC(k, f) { if (!gcache.has(k)) { const g = f(); g.userData.compartida = true; gcache.set(k, g); } return gcache.get(k); }
function hiloPata(p, pts, r = 0.11) { const c = new THREE.CatmullRomCurve3(pts.map((q) => new THREE.Vector3(...q)), false, 'centripetal'); const m = new THREE.Mesh(new THREE.TubeGeometry(c, 22, r, 8, false), ESTANO()); p.add(m); return m; }
export function canvasTex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; t.userData = { canvas: c, draw }; return t; }
let glowTex;
export function glowTexture() { return glowTex || (glowTex = canvasTex(128, 128, (g, w) => { const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.25, 'rgba(255,255,255,.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, w); })); }
function glow(color, size, x, y, z, p) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0 })); s.position.set(x, y, z); s.scale.set(size, size, 1); s.userData.base = size; s.renderOrder = 5; s.raycast = () => {}; p.add(s); return s; }

// ---------------- protoboard ----------------
export function buildBreadboard() {
  const g = new THREE.Group(); g.name = 'breadboard';
  const PX = 48, W = BOARD_W, D = BOARD_D;
  const X = (x) => (x + W / 2) * PX, Z = (z) => (z + D / 2) * PX;
  const holesEach = (fn) => { for (const [r, z] of Object.entries(ROWZ)) for (let col = 1; col <= COLS; col++) { if (r.length === 2 && !isRailCol(col)) continue; fn(colX(col), z); } };
  const tex = canvasTex(W * PX, D * PX, (c, w, h) => {
    c.fillStyle = '#f4f2ec'; c.fillRect(0, 0, w, h);
    // textura ligera del plástico
    for (let i = 0; i < 2600; i++) { c.fillStyle = `rgba(0,0,0,${Math.random() * 0.025})`; c.fillRect(Math.random() * w, Math.random() * h, 2, 2); }
    const gr = c.createLinearGradient(0, Z(-0.6), 0, Z(0.6)); gr.addColorStop(0, '#cfcabe'); gr.addColorStop(0.5, '#e6e2d8'); gr.addColorStop(1, '#d8d3c8');
    c.fillStyle = gr; c.fillRect(0, Z(-0.6), w, 1.2 * PX); // canal central
    c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(0, Z(-0.6), w, 3); c.fillStyle = 'rgba(255,255,255,.6)'; c.fillRect(0, Z(0.6) - 3, w, 3);
    // separación de los carriles
    c.fillStyle = '#e2ded3'; c.fillRect(0, Z(-6.6), w, 0.12 * PX); c.fillRect(0, Z(6.48), w, 0.12 * PX);
    const line = (z, col) => { c.fillStyle = col; c.fillRect(X(-15.2), Z(z) - 3, 30.4 * PX, 6); };
    line(-9.25, '#d42a2a'); line(-6.75, '#2a56d4'); line(6.75, '#d42a2a'); line(9.25, '#2a56d4');
    c.font = `700 ${PX * 0.62}px system-ui, Arial`; c.textAlign = 'center'; c.textBaseline = 'middle';
    const sign = (t, z, col) => { c.fillStyle = col; c.fillText(t, X(-15.95), Z(z)); c.fillText(t, X(15.95), Z(z)); };
    sign('+', -8.5, '#d42a2a'); sign('−', -7.5, '#2a56d4'); sign('+', 7.5, '#d42a2a'); sign('−', 8.5, '#2a56d4');
    c.font = `600 ${PX * 0.48}px system-ui, Arial`; c.fillStyle = '#8a8478';
    for (const r of 'abcdefghij') { c.fillText(r, X(-15.95), Z(ROWZ[r])); c.fillText(r, X(15.95), Z(ROWZ[r])); }
    c.font = `600 ${PX * 0.42}px system-ui, Arial`;
    for (let col = 1; col <= COLS; col++) if (col === 1 || col % 5 === 0) { c.fillText(String(col), X(colX(col)), Z(-6.1)); c.fillText(String(col), X(colX(col)), Z(6.1)); }
    // agujeros cuadrados con bisel (como los de una protoboard real) y el brillo del clip metálico al fondo
    holesEach((x, z) => {
      const s = 0.5 * PX, i = 0.34 * PX, cx = X(x), cz = Z(z);
      c.fillStyle = '#d9d4c8'; c.fillRect(cx - s / 2, cz - s / 2, s, s);
      c.fillStyle = '#bdb7aa'; c.beginPath(); c.moveTo(cx - s / 2, cz - s / 2); c.lineTo(cx + s / 2, cz - s / 2); c.lineTo(cx + i / 2, cz - i / 2); c.lineTo(cx - i / 2, cz - i / 2); c.closePath(); c.fill();
      c.fillStyle = '#2b2a27'; c.fillRect(cx - i / 2, cz - i / 2, i, i);
      c.fillStyle = '#6c6a63'; c.fillRect(cx - i / 2 + 3, cz + i / 2 - 6, i - 6, 3);
    });
  });
  const bump = canvasTex(W * 24, D * 24, (c, w, h) => {
    const k = 24, Xb = (x) => (x + W / 2) * k, Zb = (z) => (z + D / 2) * k;
    c.fillStyle = '#fff'; c.fillRect(0, 0, w, h); c.fillStyle = '#7a7a7a'; c.fillRect(0, Zb(-0.6), w, 1.2 * k);
    c.fillStyle = '#000'; holesEach((x, z) => { const i = 0.36 * k; c.fillRect(Xb(x) - i / 2, Zb(z) - i / 2, i, i); });
  });
  bump.colorSpace = THREE.NoColorSpace;
  const side = M(0xeeebe4, { roughness: 0.62 });
  const top = new THREE.MeshStandardMaterial({ map: tex, bumpMap: bump, bumpScale: 3, roughness: 0.62, metalness: 0, transparent: true, opacity: 1 });
  // cuerpo en tres piezas para que el canal central sea un surco de verdad (como en una protoboard real);
  // la cara de arriba de cada pieza recoge su parte de la misma textura (agujeros, carriles, números)
  const pieza = (z0, z1, h) => {
    const geo = new THREE.BoxGeometry(W, h, z1 - z0); geo.translate(0, h / 2, (z0 + z1) / 2);
    const P = geo.attributes.position, U = geo.attributes.uv; const gr = geo.groups[2];
    for (let i = gr.start; i < gr.start + gr.count; i++) { const v = geo.index.getX(i); U.setXY(v, (P.getX(v) + W / 2) / W, 1 - (P.getZ(v) + D / 2) / D); }
    const m = new THREE.Mesh(geo, [side, side, top, side, side, side]); m.receiveShadow = true; m.castShadow = true; g.add(m); return m;
  };
  pieza(-D / 2, -0.6, BT); pieza(0.6, D / 2, BT); pieza(-0.6, 0.6, BT - 1.1);
  // base adhesiva y pestañas de unión laterales
  box(W - 0.4, 0.25, D - 0.4, M(0xd9d5cb, { roughness: 0.8 }), 0, -0.02, 0, g).castShadow = false;
  for (const z of [-6, 0, 6]) { box(0.5, BT * 0.7, 1.4, side, -W / 2 - 0.25, 0.3, z, g); box(0.5, BT * 0.7, 1.2, M(0xd8d3c8), W / 2 + 0.05, 0.3, z, g); }
  // tiras metálicas internas (se ven con «Ver por dentro»)
  const inner = new THREE.Group(); inner.name = 'strips'; inner.visible = false; g.add(inner);
  const clip = M(0xd8c08a, { metalness: 0.85, roughness: 0.3 }), rail = M(0xd8c08a, { metalness: 0.85, roughness: 0.3, emissive: 0x000000 });
  for (let col = 1; col <= COLS; col++) for (const [z0, z1] of [[ROWZ.a, ROWZ.e], [ROWZ.f, ROWZ.j]]) box(0.42, 1.1, z1 - z0 + 0.5, clip, colX(col), BT - 1.6, (z0 + z1) / 2, inner).castShadow = false;
  for (const r of ['tp', 'tn', 'bp', 'bn']) box(30.4, 1.1, 0.42, rail, 0, BT - 1.6, ROWZ[r], inner).castShadow = false;
  g.userData.setXray = (on) => { inner.visible = on; top.opacity = on ? 0.38 : 1; side.transparent = on; side.opacity = on ? 0.38 : 1; top.depthWrite = !on; side.depthWrite = !on; side.needsUpdate = top.needsUpdate = true; };
  return g;
}
// Mesa: tapete de corte verde con cuadrícula (como en el taller)
export function buildMat() {
  const t = canvasTex(1024, 1024, (c, w, h) => {
    c.fillStyle = '#2f6a55'; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 4000; i++) { c.fillStyle = `rgba(255,255,255,${Math.random() * 0.03})`; c.fillRect(Math.random() * w, Math.random() * h, 2, 2); }
    for (let i = 0; i <= 32; i++) { const p = i * w / 32; c.fillStyle = i % 4 === 0 ? 'rgba(220,240,230,.45)' : 'rgba(220,240,230,.16)'; c.fillRect(p - (i % 4 === 0 ? 1.5 : 0.75), 0, i % 4 === 0 ? 3 : 1.5, h); c.fillRect(0, p - (i % 4 === 0 ? 1.5 : 0.75), w, i % 4 === 0 ? 3 : 1.5); }
  });
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(4, 4);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(126, 126), new THREE.MeshStandardMaterial({ map: t, roughness: 0.9 }));
  m.rotation.x = -Math.PI / 2; m.position.y = 0.01; m.receiveShadow = true;
  return m;
}

// ---------------- componentes ----------------
const legDown = (p, x, z, h) => lead(p, x, BT - 0.4, z, x, BT + h, z);
// pata con codo: baja vertical al agujero (x, z) desde el punto (x2, y2, z2) del cuerpo
function legBent(p, x, z, x2, y2, z2, r) { const k = BT + 0.45; lead(p, x, BT - 0.4, z, x, k, z, r); lead(p, x, k, z, x2, y2, z2, r); }
// pegatina plana (canvas) encima de una pieza: sirve para dibujar el esquema interno de contactos
function decal(p, w, d, x, y, z, draw, res = 128) {
  const t = canvasTex(res, Math.round(res * d / w), (g, W, H) => draw(g, W, H, {}));
  const m = mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false }), x, y, z, p); m.rotation.x = -Math.PI / 2; m.castShadow = false; m.receiveShadow = false; m.renderOrder = 2;
  const redraw = (o) => { const c = t.userData.canvas; const g = c.getContext('2d'); g.clearRect(0, 0, c.width, c.height); draw(g, c.width, c.height, o || {}); t.needsUpdate = true; };
  return { mesh: m, redraw };
}
const FLOW = '#ffcf33', IDLE = '#9aa3ad';
// esquema de contactos de un conmutador (1 · C · 2) visto desde arriba
function drawThrow(g, W, H, o) {
  const y = H * 0.55, xs = [W * 0.17, W * 0.5, W * 0.83];
  g.lineCap = 'round'; g.lineWidth = H * 0.13;
  const to = o.pos ? 2 : 0;
  g.strokeStyle = o.flow ? FLOW : '#e9eef2'; g.beginPath(); g.moveTo(xs[1], y); g.lineTo(xs[to], y - H * 0.02); g.stroke();
  g.fillStyle = '#fff'; for (const x of xs) { g.beginPath(); g.arc(x, y, H * 0.11, 0, 7); g.fill(); }
  g.font = `800 ${H * 0.3}px system-ui`; g.textAlign = 'center'; g.fillStyle = '#fff';
  g.fillText('1', xs[0], H * 0.28); g.fillText('C', xs[1], H * 0.28); g.fillText('2', xs[2], H * 0.28);
}
const B = {
  resistor(p, part) { resistencia(p, resistorBands(part.props.r).hex); },
  led(p, part) {
    const col = LED_COLORS[part.props.color];
    // ánodo (pata larga, con codo) y cátodo (pata corta, recta, lado plano de la cápsula)
    pataCodo(p, 0, 0, 0.08, BT + 1.75, 0, 0.1); pataRecta(p, 1, 0, 1.75, 0.1);
    const { mat, y0 } = led5(p, col);
    const gl = glow(col.glow, 9, 0.5, y0 + 2.2, 0, p);
    p.userData.update = (r, st) => {
      const burnt = st.burnt; const b = burnt ? 0 : Math.min(1.3, r.bright || 0);
      mat.emissiveIntensity = b * 2.2; gl.material.opacity = Math.min(1, b * 0.9); gl.scale.setScalar(gl.userData.base * (0.6 + b * 0.6));
      mat.color.set(burnt ? 0x3a2a22 : col.hex); mat.opacity = burnt ? 1 : 0.82;
    };
    p.userData.glowY = y0 + 2.2;
  },
  rgb(p, part) {
    // 4 patas: R, común (la más larga, con codo), G, B
    legDown(p, 0, 0, 1.7); legBent(p, 1, 0, 1.25, BT + 1.7, 0); legDown(p, 2, 0, 1.7); legDown(p, 3, 0, 1.7);
    const mat = new THREE.MeshPhysicalMaterial({ color: 0xf4f6fa, transparent: true, opacity: 0.7, roughness: 0.35, emissive: new THREE.Color(0x000000), emissiveIntensity: 1 });
    const y0 = BT + 1.7;
    cyl(1.25, 0.3, mat, 1.5, y0, 0, p, 28); cyl(1.05, 1.9, mat, 1.5, y0 + 0.3, 0, p, 28);
    mesh(new THREE.SphereGeometry(1.05, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2), mat, 1.5, y0 + 2.2, 0, p);
    const gl = glow(0xffffff, 10, 1.5, y0 + 2.2, 0, p);
    p.userData.update = (r, st) => { const [R, G, B] = (r.ch || [0, 0, 0]).map(v => Math.min(1, v)); const c = new THREE.Color(R, G, B); mat.emissive.copy(c).multiplyScalar(1.6); gl.material.color.copy(c); const m = Math.max(R, G, B); gl.material.opacity = Math.min(1, m * 0.9); mat.color.set(st.burnt ? 0x3a2a22 : 0xf4f6fa); };
    p.userData.glowY = y0 + 2.2;
  },
  diode(p) {
    const y = BT + 0.9;
    for (const [x, sx] of [[0, 1], [4, -1]]) hiloPata(p, [[x, BT - 0.45, 0], [x, y - 0.4, 0], [x + sx * 0.12, y - 0.08, 0], [x + sx * 0.45, y, 0], [2 - sx * 1.0, y, 0]]);
    const g = new THREE.Group(); g.position.set(2, y, 0); g.rotation.z = Math.PI / 2; p.add(g);
    mesh(geoC('diodo', () => tornoY([[0, -1.08], [0.32, -1.08], [0.5, -1.0], [0.56, -0.85], [0.56, 0.85], [0.5, 1.0], [0.32, 1.08], [0, 1.08]])), PM(0x1a1b1d, { roughness: 0.32, clearcoat: 0.5 }), 0, 0, 0, g);
    mesh(geoC('diodoB', () => new THREE.CylinderGeometry(0.575, 0.575, 0.32, 24, 1, true)), PM(0xc9ccd1, { roughness: 0.4 }), 0, -0.68, 0, g).castShadow = false;
  },
  bulb(p) {
    legDown(p, 0, 0, 0.6); legDown(p, 2, 0, 0.6);
    cyl(1.3, 1.0, M(0x2f6d4f), 1, BT + 0.4, 0, p, 24); cyl(0.85, 0.9, METAL(), 1, BT + 1.4, 0, p, 18);
    const glass = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.3, roughness: 0.02, emissive: new THREE.Color(0xffd27a), emissiveIntensity: 0, depthWrite: false });
    const gy = BT + 3.4; const gm = mesh(new THREE.SphereGeometry(1.4, 28, 18), glass, 1, gy, 0, p); gm.castShadow = false;
    const fil = new THREE.MeshStandardMaterial({ color: 0x806040, emissive: new THREE.Color(0xffa040), emissiveIntensity: 0 });
    const f = mesh(new THREE.TorusGeometry(0.45, 0.06, 6, 16, Math.PI), fil, 1, gy - 0.2, 0, p); f.castShadow = false;
    lead(p, 0.55, BT + 2.3, 0, 0.55, gy - 0.2, 0, 0.04); lead(p, 1.45, BT + 2.3, 0, 1.45, gy - 0.2, 0, 0.04);
    const gl = glow(0xffc860, 14, 1, gy, 0, p);
    p.userData.update = (r, st) => { const b = st.burnt ? 0 : Math.min(1.5, r.bright || 0); fil.emissiveIntensity = b * 4; glass.emissiveIntensity = b * 0.8; gl.material.opacity = Math.min(1, b * 0.85); gl.scale.setScalar(gl.userData.base * (0.5 + 0.6 * Math.min(1, b))); f.visible = !st.burnt; glass.color.set(st.burnt ? 0x777777 : 0xffffff); };
    p.userData.glowY = gy;
  },
  tact(p, part) {
    // pulsador 6×6 mm cruzando el canal: patas 1 (0,0) y 2 (0,3) unidas; 3 (2,0) y 4 (2,3) unidas
    for (const [x, z, z2] of [[0, 0, 0.45], [0, 3, 2.55], [2, 0, 0.45], [2, 3, 2.55]]) legBent(p, x, z, x, BT + 0.9, z2, 0.13);
    rbox(2.5, 1.25, 2.5, 0.15, M(0x2a2c30, { roughness: 0.45 }), 1, BT + 0.15, 1.5, p);
    box(2.56, 0.12, 2.56, METAL(), 1, BT + 1.38, 1.5, p);
    for (const [x, z] of [[0.05, 0.55], [1.95, 0.55], [0.05, 2.45], [1.95, 2.45]]) cyl(0.12, 0.08, METAL(), x, BT + 1.5, z, p, 8);
    const capM = M(0xd8322a, { roughness: 0.4 });
    const cap = cyl(0.62, 0.8, capM, 1, BT + 1.5, 1.5, p, 24);
    const d = decal(p, 2.3, 2.3, 1, BT + 1.52, 1.5, (g, W, H, o) => {
      g.lineCap = 'round'; g.lineWidth = W * 0.07;
      const P = { 1: [W * 0.12, H * 0.12], 2: [W * 0.12, H * 0.88], 3: [W * 0.88, H * 0.12], 4: [W * 0.88, H * 0.88] };
      for (const [a, b, on] of [[1, 2, o.f12], [3, 4, o.f34]]) { g.strokeStyle = on ? FLOW : IDLE; g.beginPath(); g.moveTo(...P[a]); g.lineTo(...P[b]); g.stroke(); }
      if (o.pressed) { g.strokeStyle = o.fp ? FLOW : '#ffffff'; g.setLineDash([W * 0.08, W * 0.06]); g.beginPath(); g.moveTo(W * 0.12, H * 0.5); g.lineTo(W * 0.88, H * 0.5); g.stroke(); g.setLineDash([]); }
      g.fillStyle = '#fff'; g.font = `800 ${W * 0.13}px system-ui`; g.textAlign = 'center'; g.textBaseline = 'middle';
      for (const k in P) g.fillText(k, P[k][0] + (P[k][0] < W / 2 ? W * 0.1 : -W * 0.1), P[k][1]);
    });
    let last = '';
    p.userData.update = (r) => {
      const pr = !!part.state?.pressed; cap.position.y = BT + 1.5 + 0.4 - (pr ? 0.32 : 0);
      const fi = (pins) => Math.abs((r.internalI || []).find(x => x.pins.join('') === pins)?.i || 0) > 1e-5;
      const o = { pressed: pr, f12: fi('12'), f34: fi('34'), fp: (r.contactI || 0) > 1e-5 };
      const k = JSON.stringify(o); if (k !== last) { last = k; d.redraw(o); }
    };
    p.userData.update({});
  },
  button(p, part) {
    legDown(p, 0, 0, 0.3); legDown(p, 2, 0, 0.3);
    box(2.5, 1.3, 2.5, M(0x24262a), 1, BT + 0.2, 0, p);
    const cap = cyl(0.75, 0.9, M(0xd8322a), 1, BT + 1.5, 0, p, 20);
    p.userData.update = () => { cap.position.y = BT + 1.5 + 0.45 - (part.state?.pressed ? 0.45 : 0); };
    p.userData.update({}, {});
  },
  switch(p, part) {
    legDown(p, 0, 0, 0.3); legDown(p, 2, 0, 0.3);
    box(3.2, 1.5, 1.6, M(0x2b62b8), 1, BT + 0.2, 0, p);
    box(2.6, 0.06, 0.9, M(0x163a70), 1, BT + 1.7, 0, p);
    const lev = box(0.7, 0.9, 0.7, M(0xf2f2f2), 0.5, BT + 1.7, 0, p);
    p.userData.update = () => { lev.position.x = part.state?.closed ? 1.55 : 0.45; };
    p.userData.update({}, {});
  },
  slide(p, part) {
    // SS12D00: cuerpo metálico con base negra, corredera y 3 patas planas
    for (const x of [0, 1, 2]) { lead(p, x, BT - 0.4, 0, x, BT + 0.4, 0, 0.12); box(0.32, 0.5, 0.08, METAL(), x, BT + 0.1, 0, p); }
    box(3.4, 0.45, 1.5, M(0x1e1f22, { roughness: 0.5 }), 1, BT + 0.35, 0, p);
    box(3.4, 1.0, 1.4, M(0xb9bec4, { metalness: 0.85, roughness: 0.32 }), 1, BT + 0.8, 0, p);
    box(1.8, 0.04, 0.6, M(0x111111), 1, BT + 1.8, 0, p);
    const knob = box(0.62, 0.95, 0.5, M(0x1b1b1b, { roughness: 0.4 }), 0.55, BT + 1.8, 0, p);
    const d = decal(p, 3.0, 1.0, 1, BT + 1.83, -1.25, drawThrow);
    box(3.4, 0.03, 1.2, M(0x0f5e66), 1, BT + 1.8 - 0.02, -1.25, p).castShadow = false;
    let last = '';
    p.userData.update = (r) => { const pos = part.state?.pos ? 1 : 0; knob.position.x = pos ? 1.45 : 0.55; const o = { pos, flow: (r.contactI || 0) > 1e-5 }; const k = JSON.stringify(o); if (k !== last) { last = k; d.redraw(o); } };
    p.userData.update({});
  },
  spdt(p, part) {
    // conmutador de palanca miniatura con casquillo roscado
    for (const x of [0, 1, 2]) legDown(p, x, 0, 0.6);
    box(3.2, 1.6, 1.6, M(0x23262b, { roughness: 0.45 }), 1, BT + 0.4, 0, p);
    cyl(0.75, 0.9, M(0xc9ced4, { metalness: 0.9, roughness: 0.25 }), 1, BT + 2.0, 0, p, 20);
    cyl(0.95, 0.18, M(0xc9ced4, { metalness: 0.9, roughness: 0.25 }), 1, BT + 2.2, 0, p, 6);
    const lev = new THREE.Group(); lev.position.set(1, BT + 2.9, 0); p.add(lev);
    cyl(0.22, 2.4, M(0xe5e8ec, { metalness: 0.9, roughness: 0.2 }), 0, 0, 0, lev, 12, 0.16);
    const d = decal(p, 3.0, 1.0, 1, BT + 2.02, -1.25, drawThrow);
    box(3.4, 0.03, 1.2, M(0x0f5e66), 1, BT + 2.0, -1.25, p).castShadow = false;
    let last = '';
    p.userData.update = (r) => { const pos = part.state?.pos ? 1 : 0; lev.rotation.z = pos ? -0.45 : 0.45; const o = { pos, flow: (r.contactI || 0) > 1e-5 }; const k = JSON.stringify(o); if (k !== last) { last = k; d.redraw(o); } };
    p.userData.update({});
  },
  pot(p, part) {
    // potenciómetro de panel (16 mm) con eje moleteado y mando
    for (const x of [0, 1, 2]) legBent(p, x, 0, x, BT + 0.9, -0.6, 0.12);
    box(3.0, 1.6, 1.0, M(0x1f56a8, { roughness: 0.5 }), 1, BT + 0.4, -0.9, p);
    const body = mesh(new THREE.CylinderGeometry(1.6, 1.6, 1.0, 30), M(0xb9bec4, { metalness: 0.85, roughness: 0.35 }), 1, BT + 1.9, -1.9, p); body.rotation.x = Math.PI / 2;
    const kn = new THREE.Group(); kn.position.set(1, BT + 1.9, -3.4); kn.rotation.x = Math.PI / 2; p.add(kn);
    cyl(1.2, 1.6, M(0x24262a, { roughness: 0.35 }), 0, -1.6, 0, kn, 30); box(0.2, 0.06, 0.9, M(0xffffff), 0, -1.65, 0.6, kn);
    p.userData.update = () => { kn.rotation.y = ((part.state?.pos ?? 0.5) - 0.5) * 4.7; };
    p.userData.update({}, {});
  },
  relay(p, part) {
    // relé encapsulado azul (tipo SRD-05VDC) con sus 5 patas
    rele(p);
    const d = decal(p, 4.8, 4.0, 2, BT + 4.72, 1.5, (g, W, H, o) => {
      g.fillStyle = '#e9f0ff'; g.font = `800 ${W * 0.1}px system-ui`; g.textAlign = 'center'; g.fillText('5VDC', W / 2, H * 0.14);
      const P = { b1: [W * 0.1, H * 0.3], com: [W * 0.9, H * 0.3], b2: [W * 0.1, H * 0.92], nc: [W * 0.5, H * 0.92], no: [W * 0.9, H * 0.92] };
      g.strokeStyle = '#e9f0ff'; g.lineWidth = W * 0.025; g.strokeRect(W * 0.04, H * 0.42, W * 0.12, H * 0.32); // bobina
      g.beginPath(); g.moveTo(...P.b1); g.lineTo(W * 0.1, H * 0.42); g.moveTo(W * 0.1, H * 0.74); g.lineTo(...P.b2); g.stroke();
      g.lineWidth = W * 0.05; g.lineCap = 'round'; g.strokeStyle = o.flow ? FLOW : '#ffffff';
      g.beginPath(); g.moveTo(...P.com); g.lineTo(W * 0.9, H * 0.5); g.lineTo(o.on ? W * 0.88 : W * 0.52, H * 0.78); g.stroke();
      g.strokeStyle = '#e9f0ff'; g.lineWidth = W * 0.03; g.beginPath(); g.moveTo(W * 0.5, H * 0.8); g.lineTo(...P.nc); g.moveTo(W * 0.9, H * 0.8); g.lineTo(...P.no); g.stroke();
      g.fillStyle = o.on ? '#ffcf33' : '#9fb3dd'; g.beginPath(); g.arc(W * 0.3, H * 0.58, W * 0.05, 0, 7); g.fill();
      g.fillStyle = '#fff'; g.font = `700 ${W * 0.075}px system-ui`;
      g.fillText('B1', W * 0.12, H * 0.25); g.fillText('COM', W * 0.82, H * 0.25); g.fillText('B2', W * 0.24, H * 0.97); g.fillText('NC', W * 0.5, H * 0.72); g.fillText('NO', W * 0.76, H * 0.97);
    }, 192);
    let last = '';
    p.userData.update = (r) => { const o = { on: !!r.on, flow: Math.abs(r.contactI || 0) > 1e-5 }; const k = JSON.stringify(o); if (k !== last) { last = k; d.redraw(o); } };
    p.userData.update({});
  },
  npn(p) { to92(p); },
  ldr(p) {
    legDown(p, 0, 0, 2.2); legDown(p, 1, 0, 2.2);
    const top = canvasTex(128, 128, (g) => { g.fillStyle = '#e8b04a'; g.beginPath(); g.arc(64, 64, 62, 0, 7); g.fill(); g.strokeStyle = '#a3321f'; g.lineWidth = 9; g.beginPath(); g.moveTo(22, 30); for (let i = 0; i < 6; i++) { g.lineTo(i % 2 ? 22 : 106, 30 + i * 14); g.lineTo(i % 2 ? 22 : 106, 44 + i * 14); } g.stroke(); });
    const mats = [M(0xc98a35), new THREE.MeshStandardMaterial({ map: top, roughness: 0.4 }), M(0xc98a35)];
    const d = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 0.5, 28), mats); d.position.set(0.5, BT + 2.45, 0); d.castShadow = true; p.add(d);
    const tr = mesh(new THREE.CylinderGeometry(1.1, 1.1, 0.52, 28), new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.18, depthWrite: false }), 0.5, BT + 2.45, 0, p); tr.castShadow = false;
  },
  buzzer(p, part) {
    legDown(p, 0, 0, 0.3); legDown(p, 2, 0, 0.3);
    const pas = part.props.tipo === 'pasivo';
    const topT = canvasTex(128, 128, (g) => { g.fillStyle = pas ? '#14361f' : '#1b1b1d'; g.fillRect(0, 0, 128, 128); g.fillStyle = '#000'; g.beginPath(); g.arc(64, 64, 14, 0, 7); g.fill(); g.fillStyle = '#f2f2f2'; g.font = '700 34px system-ui'; g.textAlign = 'center'; g.fillText('+', 26, 74); g.font = '700 16px system-ui'; g.fillText(pas ? 'PASIVO' : 'ACTIVO', 64, 108); });
    const mats = [M(0x1b1b1d, { roughness: 0.35 }), new THREE.MeshStandardMaterial({ map: topT, roughness: 0.4 }), M(0x1b1b1d)];
    const c = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 1.9, 3.2, 32), mats); c.position.set(1, BT + 0.3 + 1.6, 0); c.castShadow = true; c.rotation.y = Math.PI; p.add(c);
    const rings = [0, 1].map(() => { const r = mesh(new THREE.TorusGeometry(1, 0.06, 6, 32), new THREE.MeshBasicMaterial({ color: 0x14a3a8, transparent: true, opacity: 0 }), 1, BT + 3.7, 0, p); r.rotation.x = Math.PI / 2; r.castShadow = false; return r; });
    p.userData.update = (r, st, t) => { rings.forEach((g, i) => { const ph = ((t * 1.6 + i * 0.5) % 1); g.scale.setScalar(1.9 + ph * 2.5); g.material.opacity = r.on ? (1 - ph) * 0.8 * Math.max(0.4, r.vol) : 0; }); };
  },
  cap(p) {
    pataRecta(p, 0, 0, 0.45, 0.1); pataRecta(p, 1, 0, 0.45, 0.1);
    mesh(geoC('capGoma', () => new THREE.CylinderGeometry(0.9, 0.9, 0.2, 24)), PM(0x2a2a2a, { roughness: 0.9 }), 0.5, BT + 0.5, 0, p);
    const sl = texCanvas(256, 128, (g, w, h) => { g.fillStyle = '#1f4fa6'; g.fillRect(0, 0, w, h); g.fillStyle = '#b9c6de'; g.fillRect(w * 0.62, 0, w * 0.16, h); g.fillStyle = '#1f4fa6'; g.font = '900 30px Arial'; g.textAlign = 'center'; for (let i = 0; i < 4; i++) g.fillText('−', w * 0.7, 22 + i * 30); g.fillStyle = '#e8eef9'; g.font = '700 22px Arial'; g.fillText('100µF', w * 0.3, 56); g.fillText('16V', w * 0.3, 86); });
    mesh(geoC('capCuerpo', () => tornoY([[0, 0], [0.95, 0], [0.97, 0.08], [0.97, 2.55], [0.93, 2.62], [0.9, 2.72], [0, 2.72]])), PM(0xffffff, { map: sl, roughness: 0.35, clearcoat: 0.6 }), 0.5, BT + 0.6, 0, p).rotation.y = -Math.PI * 0.35;
    const tapa = texCanvas(128, 128, (g) => { g.fillStyle = '#c4cad2'; g.fillRect(0, 0, 128, 128); g.strokeStyle = '#7f8790'; g.lineWidth = 6; g.beginPath(); g.moveTo(64, 14); g.lineTo(64, 114); g.moveTo(14, 64); g.lineTo(114, 64); g.stroke(); });
    const t = mesh(new THREE.CircleGeometry(0.88, 24), new THREE.MeshStandardMaterial({ map: tapa, metalness: 0.9, roughness: 0.35 }), 0.5, BT + 3.33, 0, p); t.rotation.x = -Math.PI / 2; t.castShadow = false;
  },
  bat9(p) { pila9(p); },
  aa2(p) { holder(p, 2); }, aa4(p) { holder(p, 4); },
  supply(p, part) {
    box(20, 8, 14, M(0x3d4752, { roughness: 0.5 }), 0, 0, 0, p);
    const disp = canvasTex(256, 96, (g) => drawSupply(g, part.props.v));
    const d = mesh(new THREE.PlaneGeometry(9, 3.4), new THREE.MeshBasicMaterial({ map: disp }), -4, 5.2, 7.01, p);
    cyl(1.3, 0.8, M(0x1c1f23), -4, 0, 7.4, p).rotation.x = Math.PI / 2;
    const kn = cyl(1.4, 1.2, M(0x1c1f23), -4, 2.0, 7.3, p); kn.rotation.x = Math.PI / 2; kn.position.set(-4, 2.2, 7.6);
    cyl(0.75, 0.8, M(0xd42a2a), 3.5, 8, 5, p, 16); cyl(0.75, 0.8, M(0x1c1c1c), 7, 8, 5, p, 16);
    const lab = canvasTex(256, 64, (g) => { g.fillStyle = '#dfe6ec'; g.font = '700 30px system-ui'; g.fillText('FUENTE 0–12 V', 10, 42); });
    mesh(new THREE.PlaneGeometry(9, 2.2), new THREE.MeshBasicMaterial({ map: lab, transparent: true }), 5.2, 6.4, 7.01, p);
    p.userData.refresh = () => { disp.userData.draw(disp.userData.canvas.getContext('2d'), 256, 96); disp.needsUpdate = true; };
    p.userData.drawV = (v) => { drawSupply(disp.userData.canvas.getContext('2d'), part.props.v, v); disp.needsUpdate = true; };
  },
  motor(p) {
    const can = mesh(new THREE.CylinderGeometry(3.9, 3.9, 10, 32), M(0xb8bcc2, { metalness: 0.8, roughness: 0.3 }), 0, 3.9, 0, p); can.rotation.z = Math.PI / 2;
    const cap = mesh(new THREE.CylinderGeometry(3.6, 3.6, 0.8, 28), M(0x1f1f1f), -5.3, 3.9, 0, p); cap.rotation.z = Math.PI / 2;
    box(0.5, 2.6, 0.9, METAL(), -5.6, 3.9, -1.6, p); box(0.5, 2.6, 0.9, METAL(), -5.6, 3.9, 1.6, p);
    box(8, 0.6, 7, M(0x3a3f45), 0, 0, 0, p);
    const sh = mesh(new THREE.CylinderGeometry(0.3, 0.3, 2.4, 10), METAL(), 6.2, 3.9, 0, p); sh.rotation.z = Math.PI / 2;
    const prop = new THREE.Group(); prop.position.set(7.2, 3.9, 0); p.add(prop);
    box(0.4, 7, 1.0, M(0xf2b632), 0, -3.5, 0, prop); box(0.4, 1.0, 7, M(0xf2b632), 0, -0.5, 0, prop);
    cyl(0.7, 0.6, M(0xd42a2a), 0, 0, 0, prop).rotation.z = Math.PI / 2;
    p.userData.update = (r, st, t, dt) => { prop.rotation.x += (r.speed || 0) * dt * 40; };
  },
  usb5(p) {
    box(12, 0.5, 9, M(0x1d5a3a, { roughness: 0.5 }), 0, 0, 0, p);
    box(4.4, 1.6, 3.4, M(0xc9ced4, { metalness: 0.85, roughness: 0.3 }), -3.4, 0.5, -1.2, p); box(3.2, 0.7, 0.1, M(0x111111), -3.4, 0.95, 0.52, p);
    box(2.0, 0.9, 1.6, M(0x1a1a1a), 2.6, 0.5, -2, p); cyl(0.35, 0.3, M(0xff3030, { emissive: 0xff2020, emissiveIntensity: 0.8 }), 3.8, 0.5, 1.2, p, 10);
    box(3.6, 1.0, 1.2, M(0x111111), 0, 0.5, 3.2, p);
    for (const x of [1.3, -1.3]) box(0.26, 2.2, 0.26, M(0xd8c08a, { metalness: 0.9, roughness: 0.25 }), x, 1.5, 3.2, p);
    const lab = canvasTex(256, 64, (g) => { g.fillStyle = '#e8f5ec'; g.font = '700 30px system-ui'; g.textAlign = 'center'; g.fillText('+5V     GND', 128, 42); });
    const l = mesh(new THREE.PlaneGeometry(6, 1.5), new THREE.MeshBasicMaterial({ map: lab, transparent: true }), 0, 0.52, 1.6, p); l.rotation.x = -Math.PI / 2;
  },
  servo(p, part) {
    rbox(12, 6.4, 5.6, 0.4, M(0x2b6fd6, { roughness: 0.35 }), 0, 0, 0, p);
    box(16, 0.6, 5.6, M(0x2b6fd6, { roughness: 0.35 }), 0, 4.6, 0, p);
    cyl(1.4, 1.2, M(0x2b6fd6), 2.8, 6.4, 0, p, 24); cyl(0.6, 0.8, M(0xf2f2f2), 2.8, 7.6, 0, p, 16);
    const horn = new THREE.Group(); horn.position.set(2.8, 8.2, 0); p.add(horn);
    box(7, 0.5, 1.0, M(0xf4f4f4, { roughness: 0.4 }), 2.2, 0, 0, horn);
    const lab = canvasTex(256, 128, (g) => { g.fillStyle = '#2b6fd6'; g.fillRect(0, 0, 256, 128); g.fillStyle = '#fff'; g.font = '800 44px system-ui'; g.textAlign = 'center'; g.fillText('SG90', 128, 60); g.font = '600 22px system-ui'; g.fillText('Micro Servo 9g', 128, 100); });
    mesh(new THREE.PlaneGeometry(10, 4.4), new THREE.MeshStandardMaterial({ map: lab, roughness: 0.4 }), 0, 3.2, 2.81, p).castShadow = false;
    // cable de 3 hilos (marrón, rojo, naranja) hasta su conector hembra
    const cols = [0x6b3d1f, 0xd22424, 0xf08a10];
    [4.4, 5.3, 6.2].forEach((z, i) => { const c = new THREE.CatmullRomCurve3([new THREE.Vector3(-6, 2 + i * 0.15, 0.6 - i * 0.3), new THREE.Vector3(-7.5, 1.2, 2.5), new THREE.Vector3(-7.2, 0.8, z - 0.9)]); const t = new THREE.Mesh(new THREE.TubeGeometry(c, 16, 0.18, 6), M(cols[i], { roughness: 0.5 })); t.castShadow = true; p.add(t); });
    box(1.0, 0.9, 3.0, M(0x18181a), -7.2, 0.2, 5.3, p);
    for (const z of [4.4, 5.3, 6.2]) box(0.4, 0.05, 0.4, M(0x000000), -7.2, 1.11, z, p);
    p.userData.update = (r, st, t, dt) => {
      const target = r.powered && r.target != null ? r.target : (st.angle ?? 90);
      st.angle = st.angle ?? 90; const k = Math.min(1, (dt || 0) * 4); st.angle += (target - st.angle) * k;
      horn.rotation.y = (st.angle - 90) * Math.PI / 180;
    };
  },
  stester(p, part) {
    box(10, 0.5, 8, M(0x1d4f8a, { roughness: 0.5 }), 0, 0, 0, p);
    const kn = new THREE.Group(); kn.position.set(0.2, 0.5, 1.8); p.add(kn);
    cyl(1.6, 1.2, M(0x2f8f4e), 0, 0, 0, kn, 24); box(0.25, 0.08, 1.4, M(0xffffff), 0, 1.2, -0.7, kn);
    for (const [x, z] of [[-3.4, -2.2], [-3.4, -1.0], [3.4, -1.2], [3.4, 0], [3.4, 1.2]]) { box(0.9, 1.0, 0.9, M(0x111111), x, 0.5, z, p); box(0.24, 1.6, 0.24, M(0xd8c08a, { metalness: 0.9, roughness: 0.25 }), x, 1.0, z, p); }
    const led = cyl(0.3, 0.3, M(0x30ff60, { emissive: 0x30ff60, emissiveIntensity: 0 }), -1.8, 0.5, 2.6, p, 10);
    const lab = canvasTex(256, 200, (g) => { g.fillStyle = '#e8f0ff'; g.font = '700 22px system-ui'; g.textAlign = 'center'; g.fillText('SERVO TESTER', 128, 26); g.font = '700 22px system-ui'; g.textAlign = 'left'; g.fillText('+', 12, 62); g.fillText('−', 12, 92); g.textAlign = 'right'; g.fillText('G', 244, 88); g.fillText('+', 244, 118); g.fillText('S', 244, 146); });
    const l = mesh(new THREE.PlaneGeometry(9.6, 7.5), new THREE.MeshBasicMaterial({ map: lab, transparent: true }), 0, 0.52, 0, p); l.rotation.x = -Math.PI / 2; l.castShadow = false;
    p.userData.update = (r) => { kn.rotation.y = ((part.state?.knob ?? 0.5) - 0.5) * -4.7; led.material.emissiveIntensity = r.pw ? 1.4 : 0; };
    p.userData.update({});
  },
  meter(p, part) {
    const { dial, disp } = polimetro(p, drawMeter);
    const ang = { V: -60, A: 30, 'Ω': 120, '·)))': 165 };
    let last = '';
    p.userData.update = (r) => {
      const a = ang[part.props.mode] ?? -150; dial.rotation.y = -(a + 90) * Math.PI / 180;
      const txt = r.meter ? r.meter.text : (r.off ? '' : '');
      const k = part.props.mode + '|' + txt;
      if (k !== last) { last = k; drawMeter(disp.userData.canvas.getContext('2d'), txt, part.props.mode); disp.needsUpdate = true; }
    };
    p.userData.update({}, {});
  },
};
function holder(p, n) { portapilas(p, n); }
function drawSupply(g, set, v) {
  g.fillStyle = '#0b1a12'; g.fillRect(0, 0, 256, 96); g.fillStyle = '#5dff9a'; g.font = '700 58px ui-monospace, Consolas, monospace'; g.textAlign = 'right';
  g.fillText((+set).toFixed(1).replace('.', ',') + ' V', 240, 70);
}
function drawMeter(g, txt, mode) {
  g.fillStyle = '#9fb59a'; g.fillRect(0, 0, 256, 110); g.fillStyle = '#b6ccb0'; g.fillRect(6, 6, 244, 98);
  g.fillStyle = '#1b2418'; g.textAlign = 'right'; g.font = '700 52px ui-monospace, Consolas, monospace';
  g.fillText(txt || (mode ? '----' : ''), 244, 72);
  g.font = '700 20px system-ui'; g.textAlign = 'left'; g.fillText(mode ? (mode === 'Ω' ? 'Ω' : mode === '·)))' ? '·)))' : mode === 'V' ? 'V ⎓' : 'A ⎓') : 'OFF', 12, 28);
}

export function buildPart(part) {
  const g = new THREE.Group(); const inner = new THREE.Group(); g.add(inner);
  (B[part.type] || (() => box(2, 2, 2, M(0xff00ff), 0, BT, 0, inner)))(inner, part);
  g.userData.update = inner.userData.update; g.userData.glowY = inner.userData.glowY; g.userData.inner = inner; g.userData.drawV = inner.userData.drawV;
  return g;
}
// Esferas invisibles para pinchar en los terminales de las piezas de mesa
export function terminalHits(part, group) {
  const def = PARTS[part.type]; if (def.board) return [];
  const out = [];
  for (const [pin, dx, dz, y] of def.pins) {
    if (def.meter) continue;
    const m = new THREE.Mesh(new THREE.SphereGeometry(1.0, 10, 8), new THREE.MeshBasicMaterial({ color: 0x14a3a8, transparent: true, opacity: 0, depthWrite: false }));
    m.position.set(dx, y + 0.2, dz); m.userData.term = `p:${part.id}:${pin}`; group.userData.inner.add(m); out.push(m);
  }
  return out;
}

// ---------------- cables ----------------
export function wireCurve(a, b) {
  const d = a.distanceTo(b); const h = Math.min(5, 0.9 + d * 0.12);
  const up = Math.max(a.y, b.y) + h;
  const pts = [a.clone(), a.clone().setY(a.y + 0.7), new THREE.Vector3((a.x + b.x) / 2, up, (a.z + b.z) / 2), b.clone().setY(b.y + 0.7), b.clone()];
  return new THREE.CatmullRomCurve3(pts, false, 'centripetal');
}
// Altura a la que sale el cable de cada tipo de extremo (desde la punta que encaja en el terminal)
const EXIT = { M: 5.4, H: 3.9, C: 5.6, B: 4.8, S: 0.9 };
const RAD = { M: 0.27, H: 0.27, C: 0.36, B: 0.42, S: 0.2 };
// Curva suave (Bézier cúbica) entre las salidas de los dos conectores
export function cableCurve(a, b, ea = 'M', eb = 'M') {
  const A = a.clone().setY(a.y + EXIT[ea]), B2 = b.clone().setY(b.y + EXIT[eb]);
  if (ea === 'S' && eb === 'S') { // cable rígido: plano y a ras, como los puentes preformados
    const y = Math.max(A.y, B2.y); const dir = B2.clone().sub(A).setY(0); const L = dir.length(); dir.normalize();
    const pts = [a.clone().setY(a.y - 0.2), A.clone().setY(y), A.clone().setY(y).addScaledVector(dir, Math.min(0.5, L * 0.2)), B2.clone().setY(y).addScaledVector(dir, -Math.min(0.5, L * 0.2)), B2.clone().setY(y), b.clone().setY(b.y - 0.2)];
    return new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.1);
  }
  const d = A.distanceTo(B2); const h = Math.min(9, 1.2 + d * 0.28);
  return new THREE.CubicBezierCurve3(A, A.clone().setY(A.y + h), B2.clone().setY(B2.y + h), B2);
}
const HOUSING = () => M(0x161618, { roughness: 0.45 });
const PINMAT = () => M(0xd9dde2, { metalness: 0.95, roughness: 0.2 });
const GOLD = () => M(0xd8c08a, { metalness: 0.9, roughness: 0.25 });
// Conector en un extremo: la punta está en p, el cable sale hacia arriba
function connector(g, end, p, mat, dir) {
  const x = p.x, y = p.y, z = p.z;
  if (end === 'M' || end === 'H') dupont(g, end === 'M', p, EXIT, mat, RAD[end]);
  else if (end === 'S') { cyl(0.15, EXIT.S + 0.7, M(0xc77b3a, { metalness: 0.9, roughness: 0.3 }), x, y - 0.7, z, g, 6); }
  else if (end === 'B') banana(g, p, mat, EXIT);
  else if (end === 'C') cocodrilo(g, p, mat, dir);
}
export function buildWire(a, b, hex, opts = {}) {
  const g = new THREE.Group();
  if (opts.mat) { // silueta (guía, cable a medio tender, selección)
    const c = opts.ends ? cableCurve(a, b, opts.ends[0], opts.ends[1]) : wireCurve(a.clone().setY(a.y + 0.5), b.clone().setY(b.y + 0.5));
    const t = new THREE.Mesh(new THREE.TubeGeometry(c, 40, opts.r || 0.3, 8, false), opts.mat); t.castShadow = false; g.add(t); g.userData.curve = c; return g;
  }
  const [ea, eb] = opts.ends || ['M', 'M'];
  const mat = M(new THREE.Color(hex).getHex(), { roughness: 0.42 });
  const c = cableCurve(a, b, ea, eb);
  const r = Math.max(RAD[ea], RAD[eb]);
  const t = new THREE.Mesh(new THREE.TubeGeometry(c, 56, r, 8, false), mat); t.castShadow = true; g.add(t);
  const dA = b.clone().sub(a).setY(0).normalize(), dB = a.clone().sub(b).setY(0).normalize();
  connector(g, ea, a, mat, dA); connector(g, eb, b, mat, dB);
  g.userData.curve = c;
  return g;
}
export const wireHex = (c) => WIRE_HEX[c] || '#1f9d3a';

// Punta del polímetro
export function buildProbe(color) { return punta(color); }
export { rot };

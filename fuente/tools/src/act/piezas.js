// Piezas 3D sencillas (primitivas de three.js) para las actividades de clase: herramientas del maletín,
// conductores con su color, muestras de sección, manguera y tubo corrugado. Cada pieza es un THREE.Group
// tumbado sobre la mesa (plano XZ, eje Y hacia arriba), con su eje largo en X. Unidades: cm.
import * as THREE from 'three';

// Materiales propios de cada pieza (no compartidos) para poder resaltarlas al pasar el ratón.
export const mat = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.05, ...o });
export const metal = () => mat(0xc9ccd1, { metalness: 0.85, roughness: 0.3 });
const cobre = () => mat(0xd38a45, { metalness: 0.8, roughness: 0.35 });
function m(geo, material, x = 0, y = 0, z = 0, p) { const o = new THREE.Mesh(geo, material); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; p?.add(o); return o; }
// cilindro tumbado a lo largo de X, centrado en x
function cx(r, len, material, x, y, z, p, r2) { const o = m(new THREE.CylinderGeometry(r2 ?? r, r, len, 24), material, x, y, z, p); o.rotation.z = Math.PI / 2; return o; }
const bx = (w, h, d, material, x, y, z, p) => m(new THREE.BoxGeometry(w, h, d), material, x, y, z, p);

// ---------------------------------------------------------------- herramientas
function destornillador(g, { mango = 0xdc001b, punta = 'plano', fino = false } = {}) {
  const R = fino ? 0.9 : 1.5;
  const mg = mango === 'trans' ? mat(0xfff3b0, { transparent: true, opacity: 0.75, roughness: 0.15 }) : mat(mango);
  cx(R, fino ? 9 : 10, mg, -6, R, 0, g); cx(R * 0.8, 1.2, mat(0x222222), -0.6, R, 0, g);
  cx(fino ? 0.22 : 0.35, fino ? 7 : 12, metal(), fino ? 3.4 : 6, R, 0, g);
  const xp = fino ? 7.2 : 12.4;
  if (punta === 'plano') bx(1.2, 0.18, fino ? 0.45 : 0.75, metal(), xp, R, 0, g);
  else { bx(1.2, 0.18, 0.7, metal(), xp, R, 0, g); bx(1.2, 0.7, 0.18, metal(), xp, R, 0, g); }
  if (fino) { const neon = m(new THREE.SphereGeometry(0.35, 12, 8), mat(0xff3b1f, { emissive: 0xff2200, emissiveIntensity: 0.6 }), -4, R, 0, g); neon.scale.set(2, 1, 1); bx(0.4, 0.6, 2.2, metal(), -9, R + 0.9, 0, g); }
}
function alicate(g, tipo) {
  const funda = tipo === 'corte' ? 0x1f6feb : tipo === 'punta' ? 0xf39900 : 0xdc001b;
  for (const s of [-1, 1]) { const h = bx(11, 0.9, 1.3, mat(funda), -6, 0.6, s * 1.2, g); h.rotation.y = s * 0.09; const b = bx(2.5, 0.7, 1.1, mat(0x333333), -12, 0.6, s * 1.75, g); b.rotation.y = s * 0.09; }
  m(new THREE.CylinderGeometry(1.1, 1.1, 1.4, 20), metal(), 0, 0.7, 0, g);
  if (tipo === 'punta') { const c = m(new THREE.ConeGeometry(1, 7.5, 16), metal(), 4.6, 0.7, 0, g); c.rotation.z = -Math.PI / 2; c.scale.set(1, 1, 0.6); }
  else if (tipo === 'corte') { const c = m(new THREE.CylinderGeometry(1.5, 0.4, 3.6, 4), metal(), 2.4, 0.7, 0, g); c.rotation.z = -Math.PI / 2; c.scale.set(1, 1, 0.55); }
  else { bx(4.6, 0.9, 2.4, metal(), 3, 0.7, 0, g); bx(1.2, 0.95, 2.5, mat(0x8d9399, { metalness: 0.7 }), 4.6, 0.7, 0, g); }
}
function pelacables(g) {
  bx(13, 1.6, 2.2, mat(0xf2c200), -3, 1, 0, g); bx(13, 1.2, 1.6, mat(0x222222), -3, 2.3, 0, g);
  bx(4, 2.6, 2.4, metal(), 5.5, 1.6, 0, g); bx(1.2, 0.6, 2.6, mat(0xdc001b), 5, 3.1, 0, g);
  m(new THREE.CylinderGeometry(0.5, 0.5, 2.8, 12), mat(0x555555), -9, 1.6, 0, g).rotation.x = Math.PI / 2;
}
function llaveFija(g) {
  bx(13, 0.5, 1.5, metal(), 0, 0.3, 0, g);
  for (const [x, r, s] of [[-7.6, 1.5, 1], [7.4, 1.2, -1]]) { const t = m(new THREE.TorusGeometry(r, 0.55, 8, 20, Math.PI * 1.35), metal(), x, 0.3, 0, g); t.rotation.x = -Math.PI / 2; t.rotation.z = s > 0 ? Math.PI * 0.82 : -Math.PI * 0.18; }
}
function llaveInglesa(g) {
  bx(12, 0.7, 1.8, metal(), -2, 0.4, 0, g); bx(1.5, 0.75, 5, metal(), 5.2, 0.4, 0, g); bx(3, 0.75, 1.1, metal(), 6.6, 0.4, -1.95, g); bx(2.6, 0.75, 1.1, metal(), 6.6, 0.4, 0.9, g);
  m(new THREE.CylinderGeometry(0.55, 0.55, 2, 12), mat(0x9aa0a6, { metalness: 0.8 }), 4.6, 0.6, 2.2, g).rotation.z = Math.PI / 2;
  bx(4, 0.8, 2, mat(0xdc001b), -6.5, 0.45, 0, g);
}
function polimetro(g) {
  bx(15, 2.6, 9, mat(0xf2c200), 0, 1.3, 0, g); bx(13.4, 0.2, 7.6, mat(0x2b2f33), 0, 2.65, 0, g);
  bx(4.2, 0.12, 5.6, mat(0x9fc5a8, { emissive: 0x1d3a26, emissiveIntensity: 0.3 }), -3.8, 2.8, 0, g);
  m(new THREE.CylinderGeometry(2, 2, 0.6, 28), mat(0x3a3f45), 2.4, 2.9, 0, g); bx(1.8, 0.3, 0.45, mat(0xeeeeee), 2.4, 3.25, 0, g);
  for (const [c, z] of [[0x111111, -2.4], [0xdc001b, 2.4]]) {
    const cur = new THREE.CatmullRomCurve3([new THREE.Vector3(6.6, 2.7, z * 0.4), new THREE.Vector3(10, 0.6, z), new THREE.Vector3(14, 0.5, z * 1.6), new THREE.Vector3(18, 0.5, z * 1.2)]);
    m(new THREE.TubeGeometry(cur, 24, 0.22, 8), mat(c), 0, 0, 0, g); cx(0.4, 4, mat(c), 19.8, 0.5, z * 1.2, g); cx(0.08, 1.4, metal(), 22.4, 0.5, z * 1.2, g);
  }
}
export const HERRAMIENTAS = {
  plano: { n: 'Destornillador plano', f: 'destornilladores', crear: (g) => destornillador(g, { mango: 0xdc001b, punta: 'plano' }) },
  estrella: { n: 'Destornillador de estrella', f: 'destornilladores', crear: (g) => destornillador(g, { mango: 0x1f6feb, punta: 'estrella' }) },
  buscapolos: { n: 'Buscapolos (comprobador de tensión)', f: 'medida', crear: (g) => destornillador(g, { mango: 'trans', punta: 'plano', fino: true }) },
  universal: { n: 'Alicate universal', f: 'alicates', crear: (g) => alicate(g, 'universal') },
  punta: { n: 'Alicate de punta', f: 'alicates', crear: (g) => alicate(g, 'punta') },
  corte: { n: 'Alicate de corte', f: 'corte y pelado', crear: (g) => alicate(g, 'corte') },
  pelacables: { n: 'Pelacables', f: 'corte y pelado', crear: pelacables },
  fija: { n: 'Llave fija', f: 'llaves', crear: llaveFija },
  inglesa: { n: 'Llave inglesa', f: 'llaves', crear: llaveInglesa },
  polimetro: { n: 'Polímetro', f: 'medida', crear: polimetro },
};

// ---------------------------------------------------------------- cables
const tierraTex = (() => { let t = null; return () => { if (t) return t; const c = document.createElement('canvas'); c.width = 256; c.height = 32; const g = c.getContext('2d'); g.fillStyle = '#f2d21b'; g.fillRect(0, 0, 256, 32); g.fillStyle = '#1f9a3a'; for (let x = -32; x < 288; x += 28) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x + 14, 0); g.lineTo(x + 26, 32); g.lineTo(x + 12, 32); g.fill(); } t = new THREE.CanvasTexture(c); t.wrapS = THREE.RepeatWrapping; t.repeat.set(4, 1); t.colorSpace = THREE.SRGBColorSpace; return t; }; })();
export const COLOR_CABLE = { marron: 0x6b3d1f, negro: 0x1b1b1b, gris: 0x8e959b, azul: 0x1f5fd1, tierra: 0xf2d21b, blanco: 0xf3f3f0 };
export function conductor(g, color, { len = 26, r = 0.9 } = {}) {
  const mt = color === 'tierra' ? mat(0xffffff, { map: tierraTex() }) : mat(COLOR_CABLE[color]);
  cx(r, len, mt, 0, r, 0, g); for (const s of [-1, 1]) cx(r * 0.5, 1.6, cobre(), s * (len / 2 + 0.8), r, 0, g);
}
export function muestraSeccion(g, mm2) {
  const rc = 0.42 * Math.sqrt(mm2 / 1.5); const r = rc + 0.35 + rc * 0.25;
  cx(r, 9, mat(COLOR_CABLE.blanco), 0, r, 0, g); cx(rc, 1.2, cobre(), 5.1, r, 0, g);
  const base = bx(12, 0.4, 5, mat(0x51626f), 0, 0.2, 0, g); base.receiveShadow = true; g.children.forEach((o) => { if (o !== base) o.position.y += 0.4; });
}
export function manguera(g) {
  cx(2.1, 20, mat(0xe9e7e2), 0, 2.1, 0, g);
  [['marron', -0.9], ['azul', 0], ['tierra', 0.9]].forEach(([c, z]) => { const s = new THREE.Group(); conductor(s, c, { len: 6, r: 0.55 }); s.position.set(13.2, 1.55, z * 1.25); g.add(s); });
}
export function tubo(g) {
  const mt = mat(0x6d7378, { roughness: 0.7 });
  for (let i = 0; i < 24; i++) { const t = m(new THREE.TorusGeometry(1.9, 0.42, 8, 22), mt, -11.5 + i, 2.1, 0, g); t.rotation.y = Math.PI / 2; }
  cx(1.75, 24, mat(0x50565b), 0, 2.1, 0, g);
}

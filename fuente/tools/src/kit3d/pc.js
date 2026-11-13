// Piezas de un ordenador de sobremesa en 3D (unidades: cm, tamaños reales aproximados) para la
// actividad «Anatomía del PC» de TIC. Modelos procedurales detallados (mismo estilo que la placa ESP32):
// serigrafía y pistas pintadas en lienzo, zócalo con placa de carga, ranuras con pestañas, ventiladores
// con aspas curvas, aletas de los disipadores, conectores SATA/ATX/PCIe con sus contactos…
// Rendimiento (Chromebooks): las piezas repetidas que comparten material se fusionan en una sola malla.
import * as THREE from 'three';
import { mergeGeometries, mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { pbr, MATS, malla, tex, rectRedondo, calidad } from './base.js';

const Q = () => calidad();
// ---------------------------------------------------------------- materiales
const PCB_V = () => pbr(0x17402b, { roughness: 0.5, clearcoat: 0.5, clearcoatRoughness: 0.35 });
const PCB_N = () => pbr(0x15181c, { roughness: 0.55, clearcoat: 0.4, clearcoatRoughness: 0.4 });
const NEGRO = () => pbr(0x1b1c1f, { roughness: 0.5 });
const GRIS = () => pbr(0x5d636b, { roughness: 0.45 });
const ORO = () => pbr(0xe0b04a, { metalness: 1, roughness: 0.25 });
const CHIP = () => pbr(0x1e2023, { roughness: 0.38 });
const ALU = () => pbr(0xc3c8ce, { metalness: 0.9, roughness: 0.32 });
const ALU_OSC = () => pbr(0x4b5058, { metalness: 0.8, roughness: 0.38 });
const ACERO = () => pbr(0xb4b9bf, { metalness: 1, roughness: 0.3 });
const COBRE = () => pbr(0xc8794a, { metalness: 1, roughness: 0.3 });
const PINTURA = () => pbr(0x1d1f23, { metalness: 0.35, roughness: 0.62 });

// ---------------------------------------------------------------- utilidades
const _o = new THREE.Object3D();
const CUBO = new THREE.BoxGeometry(1, 1, 1).toNonIndexed();
// Lote: junta todas las piezas con el mismo material en una sola malla (menos llamadas de dibujo)
class Lote {
  constructor(par) { this.par = par; this.l = new Map(); }
  add(geo, mat, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, s = null) {
    _o.position.set(x, y, z); _o.rotation.set(rx, ry, rz); if (s) _o.scale.set(s[0], s[1], s[2]); else _o.scale.set(1, 1, 1); _o.updateMatrix();
    const g = geo.index ? geo.toNonIndexed() : geo.clone(); g.applyMatrix4(_o.matrix);
    for (const k of Object.keys(g.attributes)) if (k !== 'position' && k !== 'normal' && k !== 'uv') g.deleteAttribute(k);
    g.clearGroups(); if (!this.l.has(mat)) this.l.set(mat, []); this.l.get(mat).push(g); return this;
  }
  // caja con la base en y (no centrada): más cómodo para piezas apoyadas en una placa
  box(w, h, d, mat, x, y, z, ry = 0) { return this.add(CUBO, mat, x, y + h / 2, z, 0, ry, 0, [w, h, d]); }
  cil(r, h, mat, x, y, z, seg = 16, rx = 0, rz = 0) { return this.add(new THREE.CylinderGeometry(r, r, h, seg), mat, x, y, z, rx, 0, rz); }
  fin() { for (const [m, gs] of this.l) malla(gs.length === 1 ? gs[0] : mergeGeometries(gs, false), m, this.par); this.l.clear(); return this.par; }
}
// pegatina / serigrafía: plano con textura (por defecto mirando a +y)
function pegatina(par, w, d, t, x, y, z, o = {}) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshStandardMaterial({ map: t, transparent: true, roughness: o.rough ?? 0.55, metalness: o.metal ?? 0, polygonOffset: true, polygonOffsetFactor: -2 }));
  m.position.set(x, y, z); if (o.cara === 'x+') m.rotation.y = Math.PI / 2; else if (o.cara === 'x-') m.rotation.y = -Math.PI / 2; else if (o.cara === 'z+') { /* mirando a +z */ } else if (o.cara === 'z-') m.rotation.y = Math.PI; else m.rotation.x = -Math.PI / 2;
  m.receiveShadow = true; par.add(m); return m;
}
// Placa de forma libre (puntos en x,z) con espesor e, de y0 a y0+e
function placaForma(pts, e, mat, par, y0 = 0, agujeros = []) {
  const s = new THREE.Shape(); pts.forEach(([x, z], i) => (i ? s.lineTo(x, -z) : s.moveTo(x, -z)));
  for (const [x, z, r] of agujeros) { const h = new THREE.Path(); h.absarc(x, -z, r, 0, Math.PI * 2, true); s.holes.push(h); }
  const g = new THREE.ExtrudeGeometry(s, { depth: e, bevelEnabled: false, curveSegments: 10 }); g.rotateX(-Math.PI / 2); g.translate(0, y0, 0);
  return malla(g, mat, par);
}
function rnd(seed) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
// Contactos dorados en fila (peine de una placa: RAM, PCIe, M.2)
function peineTex(n, huecos = []) {
  return tex(`peine|${n}|${huecos.join(',')}`, 1024, 64, (g, w, h) => {
    g.clearRect(0, 0, w, h); const p = w / n;
    for (let i = 0; i < n; i++) { if (huecos.includes(i)) continue; g.fillStyle = '#e8bb52'; g.fillRect(i * p + p * 0.18, 4, p * 0.64, h - 4); g.fillStyle = 'rgba(255,255,255,0.25)'; g.fillRect(i * p + p * 0.22, 6, p * 0.12, h - 10); }
  });
}
function textoChip(t, sub = '', w = 256, h = 128, color = '#9da3ab') {
  return tex(`chip|${t}|${sub}|${w}|${h}`, w, h, (g) => {
    g.clearRect(0, 0, w, h); g.fillStyle = color; g.textAlign = 'center'; g.font = `600 ${Math.round(h * 0.26)}px Arial`; g.fillText(t, w / 2, h * 0.45);
    if (sub) { g.font = `500 ${Math.round(h * 0.17)}px Arial`; g.fillText(sub, w / 2, h * 0.75); }
    g.beginPath(); g.arc(w * 0.08, h * 0.15, h * 0.05, 0, Math.PI * 2); g.fill();
  });
}

// ---------------------------------------------------------------- ventiladores (aspas curvas)
const geoAspa = new Map();
function aspa(r0, r1, ancho, giro) {
  const k = [r0, r1, ancho, giro].join('|'); if (geoAspa.has(k)) return geoAspa.get(k);
  const s = new THREE.Shape(); s.moveTo(r0, -ancho * 0.35);
  s.quadraticCurveTo((r0 + r1) / 2, -ancho * 0.75, r1, -ancho * 0.25); s.quadraticCurveTo(r1 * 1.02, ancho * 0.4, r1 * 0.9, ancho * 0.6);
  s.quadraticCurveTo((r0 + r1) / 2, ancho * 0.25, r0, ancho * 0.35); s.lineTo(r0, -ancho * 0.35);
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.05, bevelEnabled: false, curveSegments: 6 });
  g.rotateX(Math.PI / 2); g.rotateX(giro); // aspa en el plano xz, inclinada sobre su eje radial
  // curvatura: barre la punta hacia atrás
  const p = g.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i); const a = 0.35 * ((x - r0) / (r1 - r0)) ** 2; p.setX(i, x * Math.cos(a) - z * Math.sin(a)); p.setZ(i, x * Math.sin(a) + z * Math.cos(a)); }
  g.deleteAttribute('normal'); const gm = mergeVertices(g, 1e-4); gm.computeVertexNormals(); geoAspa.set(k, gm); return gm;
}
// Ventilador de eje Y (aspas en el plano xz). marco: 'cuadrado' (de caja/disipador) o null (gráfica, va en el hueco)
function ventilador(par, d, x, y, z, { marco = null, n = 9, colorAspa = 0x24272c, pegat = true } = {}) {
  const g = new THREE.Group(); g.position.set(x, y, z); par.add(g);
  const R = d / 2, L = new Lote(g), mA = pbr(colorAspa, { roughness: 0.42 }), mN = NEGRO();
  const a = aspa(R * 0.3, R * 0.94, R * (n > 8 ? 0.44 : 0.56), 0.42);
  for (let i = 0; i < n; i++) L.add(a, mA, 0, 0, 0, 0, (i / n) * Math.PI * 2, 0);
  L.add(new THREE.CylinderGeometry(R * 0.3, R * 0.32, 0.5, Q().seg), mN, 0, 0, 0);
  if (marco === 'cuadrado') {
    const s = rectRedondo(d, d, d * 0.06); const h = new THREE.Path(); h.absarc(0, 0, R * 0.97, 0, Math.PI * 2, true); s.holes.push(h);
    const fg = new THREE.ExtrudeGeometry(s, { depth: d * 0.2, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 1, curveSegments: 24 }); fg.translate(0, 0, -d * 0.1); fg.rotateX(Math.PI / 2);
    L.add(fg, mN, 0, 0, 0);
    // brazos traseros que sujetan el motor
    for (let i = 0; i < 4; i++) L.add(CUBO, mN, 0, -d * 0.09, 0, 0, Math.PI / 4 + i * Math.PI / 2, 0, [d * 0.04, 0.12, d * 0.66]);
    for (const [sx, sz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) L.add(new THREE.CylinderGeometry(0.22, 0.22, d * 0.205, 10, 1, true), pbr(0x050505, { roughness: 1, side: THREE.DoubleSide }), sx * d * 0.41, 0, sz * d * 0.41);
  }
  L.fin();
  if (pegat) pegatina(g, R * 0.56, R * 0.56, tex('ventPeg', 128, 128, (c) => { c.fillStyle = '#2b2e33'; c.beginPath(); c.arc(64, 64, 62, 0, Math.PI * 2); c.fill(); c.strokeStyle = '#8d939b'; c.lineWidth = 4; c.beginPath(); c.arc(64, 64, 46, 0, Math.PI * 2); c.stroke(); c.fillStyle = '#c3c8ce'; c.font = '600 18px Arial'; c.textAlign = 'center'; c.fillText('12 V', 64, 70); }), 0, 0.26, 0);
  g.userData.giratorio = true; return g;
}

// ---------------------------------------------------------------- placa base ATX (30,5 × 24,4 cm)
function serigrafiaPlaca() {
  return tex('pcSerigrafia', 1024, 820, (g, w, h) => {
    const X = (x) => ((x + 15.25) / 30.5) * w, Z = (z) => ((z + 12.2) / 24.4) * h, S = w / 30.5;
    g.fillStyle = '#16191e'; g.fillRect(0, 0, w, h);
    const r = rnd(7); g.lineCap = 'round';
    for (let i = 0; i < 260; i++) { // pistas (rectas a 45° como en una placa real)
      let x = r() * w, y = r() * h; g.strokeStyle = r() < 0.5 ? '#20252c' : '#1d2127'; g.lineWidth = 1 + r() * 2.5; g.beginPath(); g.moveTo(x, y);
      for (let k = 0; k < 3; k++) { const L = 20 + r() * 90, d = Math.floor(r() * 4); const dx = [1, 0, 0.7, 0.7][d] * (r() < 0.5 ? -1 : 1), dy = [0, 1, 0.7, -0.7][d]; x += dx * L; y += dy * L; g.lineTo(x, y); }
      g.stroke();
    }
    for (let i = 0; i < 500; i++) { g.fillStyle = r() < 0.6 ? '#2a3038' : '#6d6550'; g.fillRect(r() * w, r() * h, 2.5, 2.5); } // vías
    // agujeros de montaje con anillo estañado
    for (const [x, z] of [[-13.6, -10.4], [-13.6, 0.6], [-13.6, 10.6], [-2.9, -10.4], [-2.9, 10.6], [12.4, -10.4], [12.4, 0.6], [12.4, 10.6], [1.5, 0.6]]) {
      g.fillStyle = '#b8ad80'; g.beginPath(); g.arc(X(x), Z(z), 0.55 * S, 0, Math.PI * 2); g.fill(); g.fillStyle = '#0a0b0c'; g.beginPath(); g.arc(X(x), Z(z), 0.3 * S, 0, Math.PI * 2); g.fill();
    }
    g.fillStyle = '#c9ced6'; g.font = `700 ${Math.round(0.42 * S)}px Arial`; g.textAlign = 'left';
    const t = (s, x, z, sz = 0.42) => { g.font = `700 ${Math.round(sz * S)}px Arial`; g.fillText(s, X(x), Z(z)); };
    t('CPU_FAN', -1.0, -10.4, 0.34); t('ATX_12V', -12.0, -11.4, 0.3); t('DDR5_A1', 3.6, 3.6, 0.3); t('A2  B1  B2', 4.2, 4.2, 0.28);
    t('PCIE_X16_1', -11, 2.2, 0.34); t('PCIE_X1', -11, 4.75, 0.3); t('PCIE_X16_2', -11, 8.3, 0.34); t('M2_1', 2.0, 7.0, 0.34);
    t('SATA6G', 11.8, 5.4, 0.32); t('ATX_PWR', 11.6, -6.2, 0.32); t('BAT', 1.4, 5.6, 0.3); t('F_PANEL', 9.5, 11.9, 0.3); t('USB_3', 4.5, 11.9, 0.3); t('AUDIO', -13.8, 11.9, 0.3);
    g.font = `800 ${Math.round(0.9 * S)}px Arial`; g.fillStyle = '#8f96a0'; g.fillText('ATX', X(8.0), Z(-0.6));
    g.strokeStyle = '#c9ced6'; g.lineWidth = 2; g.strokeRect(X(-5.4), Z(-7.4), 4.8 * S, 4.8 * S); // contorno del zócalo
    for (let i = 0; i < 4; i++) g.strokeRect(X(4.15 + i * 1.02), Z(-11.1), 0.7 * S, 13.7 * S);
  });
}
function pinesTex(cols, filas) {
  return tex(`pines|${cols}|${filas}`, 256, Math.round(256 * filas / cols), (g, w, h) => {
    g.fillStyle = '#0f1012'; g.fillRect(0, 0, w, h); const px = w / cols, py = h / filas;
    for (let i = 0; i < cols; i++) for (let j = 0; j < filas; j++) { g.fillStyle = '#000'; g.fillRect(i * px + px * 0.18, j * py + py * 0.18, px * 0.64, py * 0.64); g.fillStyle = '#8c7a4a'; g.fillRect(i * px + px * 0.38, j * py + py * 0.38, px * 0.24, py * 0.24); }
  });
}
export function placaBase() {
  const g = new THREE.Group(); const L = new Lote(g);
  const E = 0.16; L.box(30.5, E, 24.4, PCB_N(), 0, 0, 0);
  pegatina(g, 30.5, 24.4, serigrafiaPlaca(), 0, E + 0.002, 0, { rough: 0.5 });
  const top = E;
  // zócalo LGA: cuerpo, placa de carga con ventana, palanca y campo de contactos
  L.box(4.6, 0.32, 4.6, NEGRO(), -3, top, -5);
  for (const [w, d, x, z] of [[4.8, 0.55, -3, -7.1], [4.8, 0.55, -3, -2.9], [0.55, 3.7, -5.1, -5], [0.55, 3.7, -0.9, -5]]) L.box(w, 0.12, d, ACERO(), x, top + 0.32, z);
  L.add(new THREE.CylinderGeometry(0.07, 0.07, 5.2, 8), ACERO(), -0.3, top + 0.25, -5, Math.PI / 2, 0, 0);
  L.add(new THREE.CylinderGeometry(0.07, 0.07, 1.0, 8), ACERO(), 0.2, top + 0.25, -2.4, 0, 0, Math.PI / 2);
  pegatina(g, 3.6, 3.6, tex('lgaPines', 256, 256, (c) => { c.fillStyle = '#2c2a24'; c.fillRect(0, 0, 256, 256); for (let i = 0; i < 48; i++) for (let j = 0; j < 48; j++) { if (i > 17 && i < 30 && j > 17 && j < 30) continue; c.fillStyle = (i + j) % 2 ? '#c9a24f' : '#b38f43'; c.fillRect(i * 5.33 + 1.3, j * 5.33 + 1.3, 2.6, 2.6); } }), -3, top + 0.33, -5, { metal: 0.6, rough: 0.35 });
  // disipadores de los VRM (aletas) y condensadores sólidos
  for (const [x, z, w, d, rot] of [[-4.5, -10.2, 9.5, 1.9, 0], [-11.2, -5.0, 1.9, 7.5, 1]]) {
    L.box(w, 1.5, d, ALU_OSC(), x, top, z); // bloque de aluminio con ranuras fresadas arriba
    const n = 8; for (let i = 1; i < n; i++) { const f = -0.5 + i / n; if (rot) L.box(w + 0.02, 0.6, 0.14, pbr(0x23262b, { roughness: 0.7 }), x, top + 0.92, z + f * d); else L.box(0.14, 0.6, d + 0.02, pbr(0x23262b, { roughness: 0.7 }), x + f * w, top + 0.92, z); }
  }
  for (let i = 0; i < 9; i++) L.cil(0.32, 0.8, ALU(), -8.6 + i * 1.05, top + 0.4, -8.6, Q().baja ? 8 : 14);
  for (let i = 0; i < 5; i++) L.cil(0.32, 0.8, ALU(), -9.4, top + 0.4, -7.2 + i * 1.05, Q().baja ? 8 : 14);
  // 4 ranuras DIMM con sus pestañas
  for (let i = 0; i < 4; i++) {
    const x = 4.5 + i * 1.02, m = i % 2 ? GRIS() : NEGRO();
    L.box(0.62, 0.85, 13.3, m, x, top, -4.25); L.box(0.22, 0.05, 12.6, pbr(0x050505, { roughness: 1 }), x, top + 0.85, -4.25);
    for (const z of [-11.15, 2.65]) L.box(0.66, 1.1, 0.45, m, x, top, z);
  }
  // conectores de alimentación: ATX 24 pines y EPS 8 pines
  L.box(1.1, 1.3, 5.4, NEGRO(), 13.7, top, -3.2); pegatina(g, 1.0, 5.3, pinesTex(2, 12), 13.7, top + 1.31, -3.2);
  L.box(2.3, 1.2, 1.1, NEGRO(), -9.5, top, -11.6); pegatina(g, 2.2, 1.0, pinesTex(4, 2), -9.5, top + 1.21, -11.6);
  // ranuras PCIe (x16 reforzadas con chapa) y x1
  for (const z of [3.0, 8.8]) { L.box(8.9, 1.05, 0.78, NEGRO(), -6.55, top, z); L.box(9.0, 0.95, 0.84, ACERO(), -6.55, top + 0.05, z); L.box(8.4, 0.06, 0.22, pbr(0x050505, { roughness: 1 }), -6.55, top + 1.0, z); L.box(0.7, 1.3, 0.9, GRIS(), -1.7, top, z); }
  L.box(2.5, 1.05, 0.78, NEGRO(), -9.75, top, 5.2); L.box(2.3, 0.06, 0.22, pbr(0x050505, { roughness: 1 }), -9.75, top + 1.05, 5.2);
  // disipador M.2 y del chipset (con ranuras)
  L.box(8.6, 0.45, 1.9, ALU_OSC(), -3.2, top, 6.5); for (let i = 0; i < 7; i++) L.box(0.12, 0.08, 1.9, pbr(0x2b2f35, { roughness: 0.5 }), -6.8 + i * 1.2, top + 0.45, 6.5);
  L.box(4.6, 0.7, 4.6, ALU_OSC(), 8.6, top, 7.6); for (let i = 0; i < 6; i++) L.box(4.6, 0.25, 0.3, ALU_OSC(), 8.6, top + 0.7, 5.8 + i * 0.72);
  // puertos SATA (2 × 2), pila CR2032, cabezales del panel frontal
  for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) { L.box(1.0, 0.75, 0.62, NEGRO(), 14.3, top + j * 0.78, 8.0 + i * 1.6); L.box(0.6, 0.12, 0.44, ORO(), 14.6, top + j * 0.78 + 0.33, 8.0 + i * 1.6); }
  L.cil(1.05, 0.25, NEGRO(), 2.4, top + 0.12, 4.8, Q().seg); L.cil(1.0, 0.32, ACERO(), 2.4, top + 0.3, 4.8, Q().seg);
  for (const [x, w] of [[5.6, 2.2], [10.6, 2.6], [-12.5, 1.6]]) { L.box(w, 0.25, 0.6, NEGRO(), x, top, 11.4); const n = Math.round(w / 0.254); for (let i = 0; i < n; i++) for (const dz of [-0.13, 0.13]) L.box(0.06, 0.6, 0.06, ORO(), x - w / 2 + 0.13 + i * 0.254, top + 0.25, 11.4 + dz); }
  // condensadores de audio y chips pequeños
  for (let i = 0; i < 4; i++) L.cil(0.3, 0.7, pbr(0xc9a13a, { metalness: 0.5, roughness: 0.4 }), -13 + i * 0.8, top + 0.35, 9.8, 12);
  const rr = rnd(3); for (let i = 0; i < 14; i++) L.box(0.4 + rr() * 0.6, 0.12, 0.4 + rr() * 0.5, CHIP(), 9.2 + rr() * 3.2, top, -0.8 + rr() * 2.3);
  // tapa del panel de E/S y conectores traseros
  L.box(2.8, 3.5, 10.2, pbr(0x2a2e34, { roughness: 0.4, metalness: 0.3 }), -13.85, top, -6.9);
  for (let i = 0; i < 6; i++) L.box(0.08, 0.1, 9.6, pbr(0x6c727b, { metalness: 0.6, roughness: 0.3 }), -12.5, top + 0.6 + i * 0.5, -6.9);
  const puertos = [[-10.6, 1.3, 1.6, 0x1f5fd0], [-8.6, 1.3, 1.6, 0x1f5fd0], [-6.4, 1.6, 1.6, 0x202226], [-4.2, 1.6, 1.5, 0x8c9096], [-2.6, 1.3, 1.1, 0x202226]];
  for (const [z, h, w, c] of puertos) { L.box(0.5, h, w, ACERO(), -15.4, top + 0.6, z); L.box(0.06, h * 0.55, w * 0.7, pbr(c, { roughness: 0.4 }), -15.66, top + 0.6 + h * 0.22, z); }
  L.fin();
  return g;
}

// ---------------------------------------------------------------- procesador (LGA, 4,5 × 4,5 cm)
export function procesador() {
  const g = new THREE.Group(); const L = new Lote(g);
  L.box(4.5, 0.12, 4.5, PCB_V(), 0, 0, 0);
  const r = rnd(11); for (let i = 0; i < 26; i++) { const lado = i % 4, f = -1.9 + r() * 3.8; const [x, z] = [[f, -2.05], [f, 2.05], [-2.05, f], [2.05, f]][lado]; L.box(0.12, 0.06, 0.22, pbr(0x9b7a52, { roughness: 0.4 }), x, 0.12, z, lado > 1 ? 0 : Math.PI / 2); }
  L.add(new THREE.ExtrudeGeometry(rectRedondo(3.95, 3.95, 0.25), { depth: 0.08, bevelEnabled: false, curveSegments: 4 }).rotateX(-Math.PI / 2), pbr(0xb8bcc2, { metalness: 0.95, roughness: 0.3 }), 0, 0.12, 0);
  L.add(new THREE.ExtrudeGeometry(rectRedondo(3.45, 3.45, 0.18), { depth: 0.2, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 2, curveSegments: 4 }).rotateX(-Math.PI / 2), pbr(0xc6c9ce, { metalness: 0.95, roughness: 0.24 }), 0, 0.2, 0);
  L.fin();
  pegatina(g, 3.0, 3.0, tex('cpuGrabado', 256, 256, (c) => { c.clearRect(0, 0, 256, 256); c.fillStyle = 'rgba(70,76,84,0.75)'; c.textAlign = 'left'; c.font = '700 26px Arial'; c.fillText('PROCESADOR', 20, 80); c.font = '600 22px Arial'; c.fillText('8 NÚCLEOS · 3,8 GHz', 20, 118); c.fillText('X64 · 65 W', 20, 150); c.font = '500 18px monospace'; c.fillText('L2304B91 · 0721', 20, 190); }), 0, 0.445, 0, { metal: 0.6, rough: 0.35 });
  pegatina(g, 0.5, 0.5, tex('cpuTri', 64, 64, (c) => { c.fillStyle = '#e0b04a'; c.beginPath(); c.moveTo(4, 4); c.lineTo(60, 4); c.lineTo(4, 60); c.fill(); }), -1.95, 0.125, 1.95, { metal: 1, rough: 0.3 });
  return g;
}

// ---------------------------------------------------------------- memoria RAM DDR (13,3 × 3,1 cm, tumbada)
export function memoriaRAM() {
  const g = new THREE.Group();
  // PCB con la muesca de los contactos y las muescas laterales de las pestañas
  placaForma([[-6.65, -1.55], [6.65, -1.55], [6.65, 0.6], [6.45, 0.75], [6.65, 0.9], [6.65, 1.55], [0.75, 1.55], [0.75, 1.15], [0.45, 1.15], [0.45, 1.55], [-6.65, 1.55], [-6.65, 0.9], [-6.45, 0.75], [-6.65, 0.6]], 0.12, PCB_V(), g);
  pegatina(g, 12.9, 0.38, peineTex(80, [42, 43, 44]), 0, 0.122, 1.34, { metal: 1, rough: 0.25 });
  const L = new Lote(g);
  // disipador de aluminio con relieve, chips asomando y clip lateral
  for (let i = 0; i < 8; i++) L.box(1.05, 0.1, 0.95, CHIP(), -5.6 + i * 1.6, 0.12, -0.25);
  const forma = new THREE.Shape(); forma.moveTo(-6.4, -1.45); forma.lineTo(6.4, -1.45); forma.lineTo(6.4, 0.95); forma.lineTo(1.5, 0.95); forma.lineTo(1.1, 0.7); forma.lineTo(-6.4, 0.7); forma.lineTo(-6.4, -1.45);
  L.add(new THREE.ExtrudeGeometry(forma, { depth: 0.1, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 2 }).rotateX(Math.PI / 2), pbr(0x31353b, { metalness: 0.85, roughness: 0.35 }), 0, 0.36, 0);
  for (let i = 0; i < 5; i++) L.box(0.5, 0.05, 1.6, pbr(0x8f2328, { metalness: 0.6, roughness: 0.35 }), 3.4 + i * 0.6, 0.36, -0.35);
  L.box(0.3, 0.3, 2.2, ALU(), 6.45, 0.08, -0.3); L.box(0.3, 0.3, 2.2, ALU(), -6.45, 0.08, -0.3);
  L.fin();
  pegatina(g, 6.4, 1.6, tex('ramEtiq', 512, 128, (c) => { c.fillStyle = '#d9dde2'; c.fillRect(0, 0, 512, 128); c.fillStyle = '#16181b'; c.font = '800 46px Arial'; c.fillText('DDR5', 16, 56); c.font = '600 28px Arial'; c.fillText('16 GB · 5600 MHz', 150, 52); c.font = '500 22px Arial'; c.fillText('1,1 V · CL36 · DIMM 288 pines', 16, 100); for (let i = 0; i < 40; i++) c.fillRect(400 + i * 2.6, 68, i % 3 ? 1.2 : 2, 44); }), -2.2, 0.405, -0.3, { rough: 0.6 });
  return g;
}

// ---------------------------------------------------------------- tarjeta gráfica (26 × 11 cm, ventiladores arriba)
export function tarjetaGrafica() {
  const g = new THREE.Group(); const L = new Lote(g);
  // PCB y contactos PCIe x16 (con la muesca)
  L.box(24.6, 0.16, 10.0, PCB_N(), 0.4, 0, -0.3);
  placaForma([[-6.6, 4.7], [2.0, 4.7], [2.0, 5.5], [-4.2, 5.5], [-4.2, 5.2], [-4.5, 5.2], [-4.5, 5.5], [-6.6, 5.5]], 0.16, PCB_N(), g);
  pegatina(g, 6.1, 0.5, peineTex(60), -1.1, 0.162, 5.22, { metal: 1, rough: 0.25 }); pegatina(g, 2.0, 0.5, peineTex(18), -5.55, 0.162, 5.22, { metal: 1, rough: 0.25 });
  // radiador: aletas finas a lo largo de x
  const nA = Q().baja ? 34 : 56; for (let i = 0; i < nA; i++) L.box(0.05, 1.9, 9.4, ALU(), -11.8 + (i / (nA - 1)) * 24, 0.25, -0.3);
  for (const dz of [-2.6, -0.9, 0.8, 2.5]) L.add(new THREE.CylinderGeometry(0.3, 0.3, 24.6, 10), COBRE(), 0.4, 0.75, dz, 0, 0, Math.PI / 2);
  // carcasa con dos huecos para los ventiladores
  const sh = rectRedondo(25.4, 10.8, 0.9); for (const x of [-6.4, 6.4]) { const h = new THREE.Path(); h.absarc(x, 0, 4.4, 0, Math.PI * 2, true); sh.holes.push(h); }
  L.add(new THREE.ExtrudeGeometry(sh, { depth: 0.3, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.08, bevelSegments: 2, curveSegments: 32 }).rotateX(-Math.PI / 2), pbr(0x2a2d32, { roughness: 0.42, metalness: 0.2 }), 0.2, 2.3, -0.3);
  for (const [z, sgn] of [[-5.55, 1], [4.95, -1]]) L.box(25.2, 2.2, 0.15, pbr(0x2a2d32, { roughness: 0.42, metalness: 0.2 }), 0.2, 0.3, z + sgn * 0.0);
  for (const z of [-4.9, 4.3]) L.box(10.0, 0.04, 0.35, pbr(0xb8bec6, { metalness: 0.9, roughness: 0.25 }), 0.2, 2.68, z);
  // chapa (bracket) con salidas de vídeo y rejilla
  L.box(0.12, 3.2, 12.0, ACERO(), -12.9, 0, -0.3); L.box(1.0, 0.12, 1.4, ACERO(), -12.4, 3.2, -6.0);
  for (const [z, w, h] of [[-3.6, 1.6, 0.6], [-1.6, 1.6, 0.6], [0.5, 1.5, 0.55], [2.5, 1.6, 0.6]]) L.box(0.5, h, w, pbr(0x0b0b0c, { roughness: 0.8 }), -13.15, 0.45, z);
  // conector de alimentación 8 pines en el canto superior
  L.box(2.1, 0.9, 1.0, NEGRO(), 9.0, 0.16, -5.6);
  L.fin();
  pegatina(g, 2.0, 0.85, pinesTex(4, 2), 9.0, 0.16 + 0.45, -6.11, { cara: 'z-' });
  pegatina(g, 1.0, 2.0, tex('rejillaBr', 64, 128, (c) => { c.fillStyle = '#000'; for (let i = 0; i < 6; i++) for (let j = 0; j < 8; j++) { c.beginPath(); c.arc(8 + i * 10 + (j % 2) * 5, 8 + j * 15, 3.4, 0, Math.PI * 2); c.fill(); } }), -12.97, 2.2, -0.6, { cara: 'x-' });
  pegatina(g, 5.0, 0.6, tex('gpuRot', 512, 64, (c) => { c.fillStyle = '#c3c8ce'; c.font = '700 34px Arial'; c.textAlign = 'center'; c.fillText('TARJETA GRÁFICA · 8 GB', 256, 44); }), 0.2, 2.69, 4.55);
  for (const x of [-6.4, 6.4]) { const v = ventilador(g, 8.6, x, 2.1, -0.3, { n: 11 }); v.rotation.y = x; }
  return g;
}

// ---------------------------------------------------------------- fuente de alimentación ATX (15 × 8,6 × 14 cm)
export function fuenteAlimentacion() {
  const g = new THREE.Group(); const L = new Lote(g);
  L.add(new THREE.ExtrudeGeometry(rectRedondo(15, 8.6, 0.35), { depth: 13.6, bevelEnabled: true, bevelThickness: 0.2, bevelSize: 0.12, bevelSegments: 2, curveSegments: 4 }), PINTURA(), 0, 4.3, -6.8);
  // ventilador superior con rejilla de alambre
  L.cil(5.7, 0.02, pbr(0x050506, { roughness: 1 }), 0, 8.73, 0, 40);
  for (const r of [1.4, 2.4, 3.4, 4.4, 5.4]) L.add(new THREE.TorusGeometry(r, 0.05, 6, Q().baja ? 36 : 64), pbr(0x2b2d31, { metalness: 0.7, roughness: 0.35 }), 0, 9.05, 0, Math.PI / 2, 0, 0);
  for (let i = 0; i < 4; i++) L.add(CUBO, pbr(0x2b2d31, { metalness: 0.7, roughness: 0.35 }), 0, 9.05, 0, 0, i * Math.PI / 4, 0, [11.0, 0.08, 0.1]);
  // trasera: toma IEC C14 e interruptor basculante
  L.box(2.8, 2.0, 0.5, NEGRO(), -4.0, 5.2, -7.1); L.box(2.0, 1.2, 0.1, pbr(0x050505, { roughness: 1 }), -4.0, 5.6, -7.36);
  for (const x of [-4.6, -4.0, -3.4]) L.box(0.12, 0.55, 0.3, ACERO(), x, 5.9, -7.3);
  L.box(1.2, 1.6, 0.4, NEGRO(), -1.0, 5.4, -7.0); L.add(CUBO, pbr(0x111214, { roughness: 0.5 }), -1.0, 6.2, -7.25, 0.25, 0, 0, [1.0, 1.3, 0.25]);
  // haz de cables con malla y conectores (24 pines, EPS 8 pines, SATA)
  const mallaC = pbr(0x1a1b1e, { roughness: 0.75, normalMap: tex('trenza', 64, 64, (c) => { c.fillStyle = 'rgb(128,128,255)'; c.fillRect(0, 0, 64, 64); for (let i = 0; i < 8; i++) { c.fillStyle = 'rgb(170,128,230)'; c.fillRect(0, i * 8, 64, 3); c.fillStyle = 'rgb(90,128,230)'; c.fillRect(0, i * 8 + 4, 64, 3); } }, { rep: [1, 30], datos: true }) });
  const cables = [
    { r: 0.65, pts: [[3.5, 3.0, 6.9], [3.8, 2.8, 10], [6, 1.0, 14.5], [10, 0.7, 15.5]], fin: [5.4, 1.4, 1.1, 'atx'] },
    { r: 0.4, pts: [[0.5, 3.0, 6.9], [0.5, 2.5, 10], [-1.5, 0.5, 15], [-5, 0.45, 16.5]], fin: [2.2, 1.2, 1.1, 'eps'] },
    { r: 0.3, pts: [[-3.5, 3.0, 6.9], [-3.8, 2.4, 9.5], [-7, 0.35, 12.5], [-10.5, 0.35, 12.5]], fin: [2.4, 0.7, 0.6, 'sata'] },
  ];
  for (const c of cables) {
    const cur = new THREE.CatmullRomCurve3(c.pts.map((p) => new THREE.Vector3(...p)));
    malla(new THREE.TubeGeometry(cur, Q().baja ? 20 : 40, c.r, 10), mallaC, g);
    const P = cur.getPoint(1), T = cur.getTangent(1); const [w, h, d] = c.fin;
    L.add(CUBO, NEGRO(), P.x + T.x * w / 2, Math.max(h / 2, P.y), P.z + T.z * w / 2, 0, -Math.atan2(T.z, T.x), 0, [w, h, d]);
  }
  L.add(new THREE.CylinderGeometry(1.0, 1.1, 0.5, 16), pbr(0x111214, { roughness: 0.6 }), 0, 3.0, 7.0, Math.PI / 2, 0, 0); // pasacables
  L.fin();
  pegatina(g, 6.2, 6.6, tex('psuRejilla', 256, 272, (c) => { c.fillStyle = '#1d1f23'; c.fillRect(0, 0, 256, 272); c.fillStyle = '#050506'; for (let j = 0; j < 14; j++) for (let i = 0; i < 13; i++) { const x = 12 + i * 19 + (j % 2) * 9.5, y = 12 + j * 18.5; if (x > 248) continue; c.beginPath(); for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3 + Math.PI / 6; c.lineTo(x + Math.cos(a) * 8, y + Math.sin(a) * 8); } c.fill(); } }), 3.9, 4.3, -7.02, { cara: 'z-', metal: 0.3, rough: 0.6 });
  pegatina(g, 12.4, 7.2, tex('psuEtiqueta', 512, 300, (c) => {
    c.fillStyle = '#d7dbe0'; c.fillRect(0, 0, 512, 300); c.fillStyle = '#15171a'; c.fillRect(0, 0, 512, 64); c.fillStyle = '#f2f2f2'; c.font = '800 36px Arial'; c.fillText('FUENTE ATX  650 W', 18, 45);
    c.fillStyle = '#15171a'; c.font = '600 20px Arial'; c.fillText('ENTRADA: 230 V~  50 Hz  5 A', 18, 96); c.fillText('80 PLUS BRONCE', 330, 96);
    const fil = [['SALIDA', '+3,3 V', '+5 V', '+12 V', '−12 V', '+5 VSB'], ['MÁX.', '20 A', '20 A', '54 A', '0,3 A', '3 A']];
    c.lineWidth = 2; c.strokeStyle = '#15171a'; for (let j = 0; j < 2; j++) for (let i = 0; i < 6; i++) { c.strokeRect(18 + i * 79, 120 + j * 40, 79, 40); c.font = (j === 0 && i === 0 ? '700 ' : '500 ') + '18px Arial'; c.fillText(fil[j][i], 26 + i * 79, 146 + j * 40); }
    c.font = '500 15px Arial'; c.fillText('PELIGRO: no abrir. Alta tensión en el interior aunque esté desenchufada.', 18, 238);
    c.beginPath(); c.moveTo(36, 254); c.lineTo(56, 288); c.lineTo(16, 288); c.closePath(); c.stroke(); c.font = '800 20px Arial'; c.fillText('!', 32, 284); for (let i = 0; i < 60; i++) c.fillRect(300 + i * 3.2, 254, i % 4 ? 1.4 : 2.4, 34);
  }), 7.64, 4.3, 0, { cara: 'x+' });
  pegatina(g, 4.6, 0.7, tex('psuTop', 256, 40, (c) => { c.fillStyle = '#9aa0a8'; c.font = '700 22px Arial'; c.textAlign = 'center'; c.fillText('650 W · ATX', 128, 28); }), 0, 8.725, 6.1);
  ventilador(g, 11, 0, 8.78, 0, { n: 7, pegat: true });
  return g;
}

// ---------------------------------------------------------------- conectores SATA (datos 7 contactos + corriente 15)
function sata(L, g, x, y, z, haciaX = 1) {
  L.box(0.6, 0.55, 2.4, NEGRO(), x, y, z - 1.7); L.box(0.6, 0.55, 1.4, NEGRO(), x, y, z + 0.55);
  L.box(0.3, 0.12, 2.0, ORO(), x + haciaX * 0.15, y + 0.22, z - 1.7); L.box(0.3, 0.12, 1.1, ORO(), x + haciaX * 0.15, y + 0.22, z + 0.55);
}
// ---------------------------------------------------------------- SSD 2,5" (10 × 0,7 × 7 cm)
export function discoSSD() {
  const g = new THREE.Group(); const L = new Lote(g);
  L.add(new THREE.ExtrudeGeometry(rectRedondo(9.9, 6.9, 0.3), { depth: 0.55, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.06, bevelSegments: 2, curveSegments: 4 }).rotateX(-Math.PI / 2), pbr(0x3d4248, { metalness: 0.85, roughness: 0.38 }), 0, 0.06, 0);
  for (const x of [-3.2, 2.6]) for (const sz of [-1, 1]) L.add(new THREE.CylinderGeometry(0.16, 0.16, 0.05, 10), pbr(0x050506, { roughness: 1 }), x, 0.34, sz * 3.52, Math.PI / 2, 0, 0); // agujeros de los tornillos laterales
  sata(L, g, 5.0, 0.08, 0.6);
  L.fin();
  pegatina(g, 8.4, 5.6, tex('ssdEtiq', 512, 340, (c) => {
    c.fillStyle = '#121418'; c.fillRect(0, 0, 512, 340); const gr = c.createLinearGradient(0, 0, 512, 0); gr.addColorStop(0, '#1f6feb'); gr.addColorStop(1, '#20c6c6'); c.fillStyle = gr; c.fillRect(0, 230, 512, 10); c.fillRect(0, 248, 340, 4);
    c.fillStyle = '#f2f3f5'; c.font = '800 70px Arial'; c.fillText('SSD', 28, 110); c.font = '700 44px Arial'; c.fillText('1 TB', 200, 110); c.fillStyle = '#9aa3ad'; c.font = '600 26px Arial'; c.fillText('SATA III · 6 Gb/s · 2,5"', 28, 170); c.font = '500 18px Arial'; c.fillText('Memoria flash NAND 3D · sin partes móviles', 28, 300);
  }), -0.4, 0.68, 0, { rough: 0.5 });
  return g;
}
// ---------------------------------------------------------------- disco duro 3,5" (14,7 × 2,6 × 10,2 cm)
export function discoDuro() {
  const g = new THREE.Group(); const L = new Lote(g);
  L.box(8.2, 0.2, 9.6, PCB_V(), 0.4, 0, 0); // electrónica por debajo
  L.add(new THREE.ExtrudeGeometry(rectRedondo(14.6, 10.1, 0.35), { depth: 2.2, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 1, curveSegments: 4 }).rotateX(-Math.PI / 2), pbr(0x9aa0a7, { metalness: 0.85, roughness: 0.42 }), 0, 0.2, 0);
  const tapa = pbr(0xc6cbd1, { metalness: 0.95, roughness: 0.22 });
  L.add(new THREE.ExtrudeGeometry(rectRedondo(14.1, 9.7, 0.3), { depth: 0.12, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.05, bevelSegments: 1, curveSegments: 4 }).rotateX(-Math.PI / 2), tapa, 0, 2.43, 0);
  L.cil(4.4, 0.1, tapa, -2.6, 2.62, 0, Q().baja ? 32 : 64); L.cil(0.9, 0.06, tapa, -2.6, 2.7, 0, 24); // relieve de los platos y del eje
  L.add(new THREE.ExtrudeGeometry(rectRedondo(2.6, 1.8, 0.6), { depth: 0.08, bevelEnabled: false }).rotateX(-Math.PI / 2), tapa, 4.3, 2.6, -2.8); // relieve del actuador
  const tor = pbr(0x6a7078, { metalness: 1, roughness: 0.3 });
  for (const [x, z] of [[-6.8, -4.5], [-6.8, 4.5], [6.8, -4.5], [6.8, 4.5], [0.0, -4.55], [0, 4.55], [4.3, -2.8], [-2.6, 0]]) { L.cil(0.24, 0.08, tor, x, 2.6, z, 12); L.cil(0.11, 0.02, pbr(0x111111, { roughness: 1 }), x, 2.65, z, 6); }
  for (const z of [-3.5, 0.6, 3.5]) for (const sx of [-1, 1]) L.add(new THREE.CylinderGeometry(0.2, 0.2, 0.06, 10), pbr(0x050506, { roughness: 1 }), sx * 7.33, 0.9, z, 0, 0, Math.PI / 2);
  sata(L, g, 7.45, 0.3, -0.8);
  L.fin();
  pegatina(g, 5.0, 4.4, tex('hddEtiq', 384, 336, (c) => {
    c.fillStyle = '#eef0f2'; c.fillRect(0, 0, 384, 336); c.fillStyle = '#15171a'; c.font = '800 46px Arial'; c.fillText('HDD 2 TB', 18, 60);
    c.font = '600 20px Arial'; c.fillText('Disco duro 3,5" · 7200 rpm', 18, 98); c.fillText('SATA 6 Gb/s · 256 MB caché', 18, 128); c.fillText('+5 V 0,5 A   +12 V 0,6 A', 18, 158);
    c.font = '500 16px Arial'; c.fillText('No abrir: el polvo daña los platos.', 18, 196); for (let i = 0; i < 90; i++) c.fillRect(18 + i * 3.6, 222, i % 3 ? 1.5 : 2.6, 56); c.font = '500 16px monospace'; c.fillText('S/N 2T7Q 4F1K 09', 18, 306);
  }), 4.6, 2.585, 1.8, { rough: 0.6 });
  return g;
}
// ---------------------------------------------------------------- disipador de torre con ventilador
export function disipadorCPU() {
  const g = new THREE.Group(); const L = new Lote(g);
  L.box(4.0, 0.45, 4.0, COBRE(), 0, 0, 0); L.box(3.4, 0.3, 3.0, pbr(0xc5c9cf, { metalness: 1, roughness: 0.25 }), 0, 0.45, 0); // base de cobre y bloque niquelado
  L.box(9.0, 0.15, 0.9, ACERO(), 0, 0.5, 0); for (const sx of [-1, 1]) L.cil(0.22, 0.5, ACERO(), sx * 4.2, 0.65, 0, 10); // puente de anclaje con tornillos
  // heat pipes en U
  const nh = 4; for (let i = 0; i < nh; i++) {
    const w = 1.2 + i * 1.05, z = -1.05 + i * 0.7;
    const cur = new THREE.CatmullRomCurve3([[-w, 7.7, z], [-w, 1.6, z], [-w * 0.6, 0.62, z], [w * 0.6, 0.62, z], [w, 1.6, z], [w, 7.7, z]].map((p) => new THREE.Vector3(...p)));
    L.add(new THREE.TubeGeometry(cur, Q().baja ? 24 : 48, 0.3, 10), pbr(0xd0d3d8, { metalness: 1, roughness: 0.22 }), 0, 0, 0);
    for (const sx of [-1, 1]) L.cil(0.3, 0.05, pbr(0xd0d3d8, { metalness: 1, roughness: 0.22 }), sx * w, 7.78, z, 10);
  }
  // pila de aletas (con los extremos plegados) y tapa
  const nf = Q().baja ? 20 : 30; for (let i = 0; i < nf; i++) { const y = 1.3 + i * (6.3 / nf); L.box(12, 0.05, 5.6, ALU(), 0, y, 0); }
  for (const sz of [-1, 1]) L.box(12, 6.3, 0.05, pbr(0x9aa1a8, { metalness: 0.95, roughness: 0.3 }), 0, 1.3, sz * 2.82);
  L.add(new THREE.ExtrudeGeometry(rectRedondo(12.2, 5.8, 0.5), { depth: 0.25, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 2 }).rotateX(-Math.PI / 2), pbr(0x1c1e22, { metalness: 0.5, roughness: 0.35 }), 0, 7.65, 0);
  for (let i = 0; i < 4; i++) L.box(11.4, 0.02, 0.12, pbr(0x9aa1a8, { metalness: 0.95, roughness: 0.3 }), 0, 7.95, -2.0 + i * 1.3);
  // grapas de alambre del ventilador
  L.fin();
  const v = ventilador(g, 12, 0, 4.45, 4.15, { marco: 'cuadrado', n: 9 }); v.rotation.x = Math.PI / 2;
  return g;
}
// ---------------------------------------------------------------- SSD M.2 2280 NVMe (8 × 2,2 cm)
export function m2() {
  const g = new THREE.Group();
  const p = [[-4.0, -1.1], [3.95, -1.1], [3.95, 0.25], [3.35, 0.25], [3.35, 0.45], [3.95, 0.45], [3.95, 1.1], [-4.0, 1.1], [-4.0, 0.3], [-3.75, 0.3], [-3.75, -0.3], [-4.0, -0.3]];
  placaForma(p, 0.1, PCB_N(), g, 0);
  pegatina(g, 0.62, 2.0, tex('m2Peine', 64, 512, (c) => { for (let i = 0; i < 30; i++) { if (i >= 13 && i <= 15) continue; c.fillStyle = '#e8bb52'; c.fillRect(6, i * 17 + 3, 52, 11); } }), 3.62, 0.102, 0, { metal: 1, rough: 0.25 });
  const L = new Lote(g);
  L.box(1.6, 0.14, 1.6, CHIP(), 1.6, 0.1, 0); L.box(1.6, 0.16, 1.5, CHIP(), -0.6, 0.1, 0); L.box(1.6, 0.16, 1.5, CHIP(), -2.5, 0.1, 0); L.box(0.9, 0.1, 0.8, CHIP(), 2.8, 0.1, -0.4);
  for (let i = 0; i < 10; i++) L.box(0.12, 0.06, 0.06, pbr(0x9b7a52, { roughness: 0.4 }), 0.4 + (i % 5) * 0.2, 0.1, i < 5 ? 0.85 : -0.85);
  L.fin();
  pegatina(g, 1.5, 1.5, textoChip('CTRL', 'NVMe 4.0'), 1.6, 0.242, 0); pegatina(g, 1.5, 1.4, textoChip('NAND', '512 GB'), -0.6, 0.262, 0); pegatina(g, 1.5, 1.4, textoChip('NAND', '512 GB'), -2.5, 0.262, 0);
  pegatina(g, 2.4, 0.55, tex('m2Rot', 256, 56, (c) => { c.fillStyle = '#c9ced6'; c.font = '700 22px Arial'; c.fillText('M.2 2280 · 1 TB', 6, 36); }), -1.6, 0.102, 0.85);
  return g;
}

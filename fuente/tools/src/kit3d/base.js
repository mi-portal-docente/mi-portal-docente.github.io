// Kit 3D compartido (Actividades de clase + laboratorio «Instalación de vivienda»): materiales PBR, texturas
// procedurales (rotulados, estrías de goma, madera, espuma), entorno de reflejos y ajustes de calidad.
// Todo genérico, sin logotipos de marcas. Unidades: cm.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

// ---------------------------------------------------------------- calidad (Chromebook / equipos modestos)
let _q = null;
export function calidad() {
  if (_q) return _q;
  const nav = typeof navigator !== 'undefined' ? navigator : {};
  const ua = nav.userAgent || ''; const nucleos = nav.hardwareConcurrency || 4; const mem = nav.deviceMemory || 4;
  const forzada = typeof localStorage !== 'undefined' ? localStorage.getItem('kit3d:calidad') : null;
  const baja = forzada ? forzada === 'baja' : /CrOS/.test(ua) || nucleos <= 4 || mem <= 4;
  _q = { baja, seg: baja ? 12 : 24, pixel: Math.min(typeof devicePixelRatio !== 'undefined' ? devicePixelRatio : 1, baja ? 1.25 : 2), sombras: !baja, hebras: baja ? 19 : 37 };
  return _q;
}
export const fijarCalidad = (q) => { _q = null; try { localStorage.setItem('kit3d:calidad', q); } catch (e) { /* sin almacenamiento */ } return calidad(); };

// ---------------------------------------------------------------- entorno de reflejos (metal brillante sin texturas externas)
const entornos = new WeakMap();
export function entorno(renderer, scene, intensidad = 0.55) {
  if (!renderer || !scene) return null;
  let tex = entornos.get(renderer);
  if (!tex) { const pm = new THREE.PMREMGenerator(renderer); tex = pm.fromScene(new RoomEnvironment(), 0.04).texture; pm.dispose(); entornos.set(renderer, tex); }
  scene.environment = tex; if ('environmentIntensity' in scene) scene.environmentIntensity = intensidad;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05; renderer.outputColorSpace = THREE.SRGBColorSpace;
  return tex;
}

// ---------------------------------------------------------------- materiales PBR (cacheados y compartidos)
const mc = new Map();
export function pbr(color, o = {}) {
  const k = color + '|' + JSON.stringify(o, (kk, v) => (v && v.isTexture ? v.uuid : v));
  if (!mc.has(k)) { const fis = o.clearcoat != null || o.sheen != null || o.transmission != null; const m = fis ? new THREE.MeshPhysicalMaterial({ color, roughness: 0.5, metalness: 0, ...o }) : new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0, ...o }); m.userData.compartido = true; mc.set(k, m); }
  return mc.get(k);
}
export const MATS = {
  acero: () => pbr(0xd4d8dd, { metalness: 1, roughness: 0.22 }),
  aceroPavonado: () => pbr(0x3a3f45, { metalness: 0.9, roughness: 0.38 }),
  cromo: () => pbr(0xf2f4f6, { metalness: 1, roughness: 0.08 }),
  niquel: () => pbr(0xc8ccd0, { metalness: 1, roughness: 0.18 }),
  laton: () => pbr(0xd8b25a, { metalness: 1, roughness: 0.25 }),
  cobre: () => pbr(0xd9874a, { metalness: 1, roughness: 0.28 }),
  aluminio: () => pbr(0xb9c0c7, { metalness: 0.95, roughness: 0.35 }),
  gomaNegra: () => pbr(0x1d1f21, { roughness: 0.92 }),
  plasticoNegro: () => pbr(0x222427, { roughness: 0.45, clearcoat: 0.3, clearcoatRoughness: 0.4 }),
  plasticoBlanco: () => pbr(0xf3f2ee, { roughness: 0.35, clearcoat: 0.4, clearcoatRoughness: 0.3 }),
  rojoVDE: () => pbr(0xd0201b, { roughness: 0.35, clearcoat: 0.5, clearcoatRoughness: 0.25 }),
  amarilloVDE: () => pbr(0xf5c400, { roughness: 0.6 }),
  naranja: () => pbr(0xff7a12, { roughness: 0.45 }),
  amarillo: () => pbr(0xf6c516, { roughness: 0.5 }),
  azul: () => pbr(0x1d5fd0, { roughness: 0.45 }),
  vidrio: () => pbr(0xe8f4ff, { roughness: 0.05, transmission: 0.85, thickness: 0.3, transparent: true, opacity: 0.55 }),
  transp: () => pbr(0xdfe8ee, { roughness: 0.1, transparent: true, opacity: 0.45, depthWrite: false }),
};

// ---------------------------------------------------------------- texturas procedurales
const tc = new Map();
function lienzo(w, h) { const c = typeof document !== 'undefined' ? document.createElement('canvas') : null; if (!c) return null; c.width = w; c.height = h; return c; }
function texDe(c, o = {}) { const t = new THREE.CanvasTexture(c); t.colorSpace = o.datos ? THREE.NoColorSpace : THREE.SRGBColorSpace; t.anisotropy = 4; if (o.rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(o.rep[0], o.rep[1]); } return t; }
export function tex(k, w, h, dibujar, o = {}) { const kk = k + '|' + (o.rep || ''); if (tc.has(kk)) return tc.get(kk); const c = lienzo(w, h); if (!c) return null; dibujar(c.getContext('2d'), w, h); const t = texDe(c, o); tc.set(kk, t); return t; }
// Texto (rotulado impreso). Fondo transparente salvo bg.
export function textoTex(t, { color = '#ffffff', bg = null, w = 512, h = 64, font = 'bold 34px system-ui, sans-serif', alinear = 'center', rep = null, vertical = false } = {}) {
  // vertical: el texto corre a lo largo de v (eje de un cilindro: mangos, aislamiento de cables)
  const W = vertical ? h : w, H = vertical ? w : h;
  return tex(`txt|${t}|${color}|${bg}|${w}|${h}|${font}|${alinear}|${vertical}`, W, H, (g) => {
    if (bg) { g.fillStyle = bg; g.fillRect(0, 0, W, H); }
    if (vertical) { g.translate(W / 2, H / 2); g.rotate(-Math.PI / 2); g.translate(-w / 2, -h / 2); }
    g.fillStyle = color; g.font = font; g.textAlign = alinear; g.textBaseline = 'middle';
    String(t).split('\n').forEach((l, i, L) => g.fillText(l, alinear === 'left' ? 8 : w / 2, h / 2 + (i - (L.length - 1) / 2) * (parseInt(font.match(/(\d+)px/)?.[1] || 30) * 1.1)));
  }, { rep });
}
// Mapa de normales de estrías (empuñaduras de goma, tubo corrugado): bandas en u
export function estriasNormal(n = 16, suave = 0.5) {
  return tex(`estr|${n}|${suave}`, 64, 256, (g, w, h) => {
    const img = g.createImageData(w, h);
    for (let y = 0; y < h; y++) { const s = Math.sin((y / h) * Math.PI * 2 * n); const nx = 0, ny = s * suave; const nz = Math.sqrt(Math.max(0, 1 - ny * ny));
      for (let x = 0; x < w; x++) { const i = (y * w + x) * 4; img.data[i] = (nx * 0.5 + 0.5) * 255; img.data[i + 1] = (ny * 0.5 + 0.5) * 255; img.data[i + 2] = nz * 255; img.data[i + 3] = 255; } }
    g.putImageData(img, 0, 0);
  }, { datos: true });
}
// Moleteado (rombos) para mordazas y anillos
export function moleteadoNormal() {
  return tex('mol', 128, 128, (g, w, h) => {
    const img = g.createImageData(w, h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const a = Math.sin(((x + y) / w) * Math.PI * 16), b = Math.sin(((x - y) / w) * Math.PI * 16); const nx = a * 0.35, ny = b * 0.35; const i = (y * w + x) * 4; img.data[i] = (nx * 0.5 + 0.5) * 255; img.data[i + 1] = (ny * 0.5 + 0.5) * 255; img.data[i + 2] = 230; img.data[i + 3] = 255; }
    g.putImageData(img, 0, 0);
  }, { datos: true, rep: [4, 4] });
}
export function maderaTex(base = '#b98a57', vetas = '#8a5f34') {
  return tex(`mad|${base}|${vetas}`, 512, 512, (g, w, h) => {
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 90; i++) { const y = Math.random() * h; g.strokeStyle = vetas; g.globalAlpha = 0.08 + Math.random() * 0.18; g.lineWidth = 1 + Math.random() * 3; g.beginPath(); g.moveTo(0, y); for (let x = 0; x <= w; x += 32) g.lineTo(x, y + Math.sin(x / 70 + i) * 6 + Math.random() * 2); g.stroke(); }
    g.globalAlpha = 1;
  });
}
export function espumaTex() {
  return tex('espuma', 256, 256, (g, w, h) => { g.fillStyle = '#2b2e33'; g.fillRect(0, 0, w, h); for (let i = 0; i < 2600; i++) { g.fillStyle = Math.random() < 0.5 ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.05)'; g.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5); } }, { rep: [6, 6] });
}
// Rótulo «1000 V» con el doble triángulo (herramientas aisladas EN 60900)
export function rotulo1000V(color = '#ffffff') {
  return tex(`1000v|${color}`, 256, 64, (g, w, h) => {
    g.strokeStyle = color; g.fillStyle = color; g.lineWidth = 3;
    const tri = (x, y, s) => { g.beginPath(); g.moveTo(x, y - s); g.lineTo(x + s, y + s * 0.8); g.lineTo(x - s, y + s * 0.8); g.closePath(); g.stroke(); };
    tri(32, 30, 16); tri(32, 30, 9); g.font = 'bold 34px system-ui, sans-serif'; g.textBaseline = 'middle'; g.fillText('1000 V', 64, 34);
  });
}

// ---------------------------------------------------------------- geometría
// Torno: perfil [[r, z], …] alrededor del eje Z (z hacia +Z). estrias: n ondulaciones en el contorno.
export function torno(perfil, { seg = calidad().seg, estrias = 0, prof = 0.05, desde = 0, arco = Math.PI * 2 } = {}) {
  const g = new THREE.LatheGeometry(perfil.map(([r, z]) => new THREE.Vector2(Math.max(0.0001, r), z)), seg, desde, arco);
  if (estrias) { const p = g.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i); const a = Math.atan2(z, x); const f = 1 + prof * Math.cos(a * estrias); p.setX(i, x * f); p.setZ(i, z * f); } g.computeVertexNormals(); }
  g.rotateX(Math.PI / 2); // eje Y del torno → eje Z
  return g;
}
export function malla(geo, m, par, x = 0, y = 0, z = 0) { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; par?.add(o); return o; }
export const caja = (w, h, d, m, par, x = 0, y = 0, z = 0) => malla(new THREE.BoxGeometry(w, h, d), m, par, x, y, z);
// cilindro con el eje en Z, centrado en z
export const cilZ = (r, len, m, par, x = 0, y = 0, z = 0, seg = calidad().seg, r2) => { const o = malla(new THREE.CylinderGeometry(r2 ?? r, r, len, seg), m, par, x, y, z); o.rotation.x = Math.PI / 2; return o; };
// cilindro con el eje en X, centrado en x
export const cilX = (r, len, m, par, x = 0, y = 0, z = 0, seg = calidad().seg, r2) => { const o = malla(new THREE.CylinderGeometry(r2 ?? r, r, len, seg), m, par, x, y, z); o.rotation.z = -Math.PI / 2; return o; };
// Extrusión de una silueta 2D (x, y) con espesor en Z centrado
export function extruir(puntos, espesor, m, par, { bisel = 0.08, curva = false } = {}) {
  const s = new THREE.Shape(); puntos.forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y)));
  const g = new THREE.ExtrudeGeometry(s, { depth: espesor, bevelEnabled: bisel > 0, bevelThickness: bisel, bevelSize: bisel, bevelSegments: 2, curveSegments: curva ? 12 : 4 });
  g.translate(0, 0, -espesor / 2); return malla(g, m, par);
}
// Rectángulo redondeado (para cajas de herramientas, carcasas…)
export function rectRedondo(w, h, r) {
  const s = new THREE.Shape(); const x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s;
}
export function bloqueRedondo(w, h, d, r, m, par, bisel = 0.25) {
  const g = new THREE.ExtrudeGeometry(rectRedondo(w, h, r), { depth: d, bevelEnabled: true, bevelThickness: bisel, bevelSize: bisel, bevelSegments: 3, curveSegments: 6 });
  g.translate(0, 0, -d / 2); return malla(g, m, par);
}
// Calcomanía curva sobre un cilindro de eje Z (radio r, de z0 a z1, ángulo centrado en «ang»)
export function calcoCil(t, r, z0, z1, arco, m0, par, ang = 0, rotar = false) {
  if (t && rotar) { t = t.clone(); t.center.set(0.5, 0.5); t.rotation = Math.PI / 2; t.needsUpdate = true; }
  const g = new THREE.CylinderGeometry(r, r, z1 - z0, 24, 1, true, Math.PI + ang - arco / 2, arco); // ang = 0 → cara de arriba (+y)
  const m = m0 || new THREE.MeshStandardMaterial({ map: t, transparent: true, roughness: 0.5, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
  const o = new THREE.Mesh(g, m); o.rotation.x = Math.PI / 2; o.position.z = (z0 + z1) / 2; par?.add(o); return o;
}
// Liberar geometrías y materiales propios de un grupo (los compartidos se conservan)
export function liberar(o) { o?.traverse?.((m) => { if (m.geometry && !m.geometry.userData?.compartida) m.geometry.dispose(); const L = Array.isArray(m.material) ? m.material : m.material ? [m.material] : []; for (const x of L) if (!x.userData?.compartido) x.dispose(); }); }

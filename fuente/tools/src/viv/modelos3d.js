// Modelos 3D procedurales (genéricos, sin logos) del laboratorio «Instalación de vivienda». Unidades: cm.
// Convenio: el objeto se apoya en z = 0 y su frente mira a +z; x → derecha, y ↑ arriba.
// Las medidas siguen productos reales (ver catalogo.js) redondeadas para que se vean bien.
import * as THREE from 'three';
import { FICHAS, CAJAS, MARCAS } from './catalogo.js';
import { pbr, MATS, bloqueRedondo, rectRedondo } from '../kit3d/base.js';
import { herramienta as kitHerr, punta as puntaKit } from '../kit3d/herramientas.js';
import { grapa as grapaKit } from '../kit3d/cables.js';

// ---------------------------------------------------------------- materiales y geometrías compartidas
const mc = new Map();
export function mat(color, o = {}) { const k = color + JSON.stringify(o); if (!mc.has(k)) { const m = new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.05, ...o }); m.userData.compartido = true; mc.set(k, m); } return mc.get(k); }
export const MAT = {
  blanco: () => mat(0xf6f6f3, { roughness: 0.35 }), crema: () => mat(0xeceae4, { roughness: 0.45 }), gris: () => mat(0x8d949a, { roughness: 0.6 }), grisOsc: () => mat(0x3b4045, { roughness: 0.6 }),
  negro: () => mat(0x1b1d1f, { roughness: 0.5 }), laton: () => mat(0xc9a45a, { metalness: 0.85, roughness: 0.3 }), cobre: () => mat(0xc8743c, { metalness: 0.85, roughness: 0.3 }),
  acero: () => mat(0xc4c8ce, { metalness: 0.9, roughness: 0.28 }), zamak: () => mat(0x9aa0a6, { metalness: 0.7, roughness: 0.35 }),
  naranja: () => mat(0xff7a00, { roughness: 0.4 }), transp: () => mat(0xdfe8ee, { roughness: 0.1, transparent: true, opacity: 0.45, depthWrite: false }),
  rojo: () => mat(0xc81e1e, { roughness: 0.45 }), amarillo: () => mat(0xf5c518, { roughness: 0.45 }), azul: () => mat(0x1f5fd6, { roughness: 0.45 }), verde: () => mat(0x2f9e44, { roughness: 0.45 }),
  madera: () => mat(0xc79a62, { roughness: 0.8 }), gomaNegra: () => mat(0x222222, { roughness: 0.85 }), hueco: () => mat(0x111111, { roughness: 0.9 }),
};
const gc = new Map();
const geo = (k, f) => { if (!gc.has(k)) { const g = f(); g.userData.compartida = true; gc.set(k, g); } return gc.get(k); };
export const gBox = (w, h, d) => geo(`b${w}|${h}|${d}`, () => new THREE.BoxGeometry(w, h, d));
export const gCyl = (r, h, s = 20, r2) => geo(`c${r}|${h}|${s}|${r2}`, () => new THREE.CylinderGeometry(r2 ?? r, r, h, s));
export function caja(w, h, d, m, x, y, z, par) { const o = new THREE.Mesh(gBox(w, h, d), m); o.position.set(x, y, z + d / 2); o.castShadow = true; o.receiveShadow = true; par?.add(o); return o; }
// cilindro con el eje en z (se apoya en z)
export function cil(r, d, m, x, y, z, par, s = 20, r2) { const o = new THREE.Mesh(gCyl(r, d, s, r2), m); o.rotation.x = Math.PI / 2; o.position.set(x, y, z + d / 2); o.castShadow = true; par?.add(o); return o; }
// cilindro con el eje en y
export function cilY(r, h, m, x, y, z, par, s = 16, r2) { const o = new THREE.Mesh(gCyl(r, h, s, r2), m); o.position.set(x, y + h / 2, z); o.castShadow = true; par?.add(o); return o; }
const tc = new Map();
// Símbolos impresos dibujados con trazos (nada de emoji): campana (pulsador), flechas (conmutador), cruce, reloj, tierra
export function simboloTex(tipo, color = '#9aa1a6') {
  const k = 'sim|' + tipo + '|' + color; if (tc.has(k)) return tc.get(k);
  const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'); g.strokeStyle = color; g.fillStyle = color; g.lineWidth = 9; g.lineCap = 'round'; g.lineJoin = 'round';
  if (tipo === 'campana') { g.beginPath(); g.moveTo(30, 92); g.quadraticCurveTo(38, 84, 38, 62); g.quadraticCurveTo(40, 30, 64, 28); g.quadraticCurveTo(88, 30, 90, 62); g.quadraticCurveTo(90, 84, 98, 92); g.closePath(); g.stroke(); g.beginPath(); g.arc(64, 102, 8, 0, Math.PI * 2); g.fill(); g.beginPath(); g.moveTo(64, 28); g.lineTo(64, 18); g.stroke(); }
  else if (tipo === 'flechas') { for (const [x, d] of [[44, -1], [84, 1]]) { g.beginPath(); g.moveTo(x, 64 - d * 38); g.lineTo(x, 64 + d * 38); g.moveTo(x - 16, 64 + d * 22); g.lineTo(x, 64 + d * 38); g.lineTo(x + 16, 64 + d * 22); g.stroke(); } }
  else if (tipo === 'cruce') { g.beginPath(); g.moveTo(30, 30); g.lineTo(98, 98); g.moveTo(98, 30); g.lineTo(30, 98); g.stroke(); }
  else if (tipo === 'reloj') { g.beginPath(); g.arc(64, 66, 40, 0, Math.PI * 2); g.stroke(); g.beginPath(); g.moveTo(64, 66); g.lineTo(64, 40); g.moveTo(64, 66); g.lineTo(84, 76); g.stroke(); }
  else if (tipo === 'tierra') { g.beginPath(); g.moveTo(64, 14); g.lineTo(64, 60); g.moveTo(28, 60); g.lineTo(100, 60); g.moveTo(40, 80); g.lineTo(88, 80); g.moveTo(52, 100); g.lineTo(76, 100); g.stroke(); }
  const tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 4; tc.set(k, tx); return tx;
}
function simbolo(tipo, w, x, y, z, par, color) { const m = new THREE.Mesh(geo(`p${w}|${w}`, () => new THREE.PlaneGeometry(w, w)), (() => { const kk = 'simM|' + tipo + color; if (!mc.has(kk)) { const mm = new THREE.MeshBasicMaterial({ map: simboloTex(tipo, color), transparent: true, depthWrite: false }); mm.userData.compartido = true; mc.set(kk, mm); } return mc.get(kk); })()); m.position.set(x, y, z); par?.add(m); return m; }
export function texto(t, { color = '#1d2329', bg = null, w = 128, h = 64, font = 'bold 40px system-ui, sans-serif' } = {}) {
  const k = [t, color, bg, w, h, font].join('|'); if (tc.has(k)) return tc.get(k);
  const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d');
  if (bg) { g.fillStyle = bg; g.fillRect(0, 0, w, h); }
  g.fillStyle = color; g.font = font; g.textAlign = 'center'; g.textBaseline = 'middle'; const L = String(t).split('\n'); L.forEach((l, i) => g.fillText(l, w / 2, h / 2 + (i - (L.length - 1) / 2) * (parseInt(font.match(/(\d+)px/)?.[1] || 40) * 1.05)));
  const tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 4; tc.set(k, tx); return tx;
}
// placa con texto (mira a +z; atras = true → mira a −z)
export function rotulo(t, w, h, x, y, z, par, o = {}) {
  const m = mat(0xffffff); const k = 'rot' + t + JSON.stringify(o); if (!mc.has(k)) { const mm = new THREE.MeshBasicMaterial({ map: texto(t, o), transparent: !o.bg, depthWrite: !!o.bg }); mm.userData.compartido = true; mc.set(k, mm); }
  void m; const p = new THREE.Mesh(geo(`p${w}|${h}`, () => new THREE.PlaneGeometry(w, h)), mc.get(k)); p.position.set(x, y, z); if (o.atras) p.rotation.y = Math.PI; par?.add(p); return p;
}
function marcoHueco(W, H, d, hw, hh, m, z, par) { // marco rectangular con hueco central
  const g = new THREE.Group(); const bw = (W - hw) / 2, bh = (H - hh) / 2;
  caja(W, bh, d, m, 0, H / 2 - bh / 2, z, g); caja(W, bh, d, m, 0, -H / 2 + bh / 2, z, g); caja(bw, hh, d, m, -W / 2 + bw / 2, 0, z, g); caja(bw, hh, d, m, W / 2 - bw / 2, 0, z, g);
  par?.add(g); return g;
}
function tornillo(x, y, z, par, r = 0.32, ranura = 'pz', atras = false) {
  const g = new THREE.Group(); cil(r, 0.25, MAT.acero(), 0, 0, 0, g, 14);
  const s = atras ? -1 : 1; caja(r * 1.6, 0.07, 0.06, MAT.grisOsc(), 0, 0, 0.25, g); if (ranura !== 'plano') caja(0.07, r * 1.6, 0.06, MAT.grisOsc(), 0, 0, 0.25, g);
  g.position.set(x, y, z); if (atras) g.rotation.y = Math.PI; void s; par?.add(g); return g;
}

// ---------------------------------------------------------------- mecanismos (interruptor, conmutador, cruzamiento, pulsador, enchufe)
// Como los de las fotos de referencia: cuerpo de 45×45 mm con bastidor metálico y garras; por detrás, cada borne lleva
// su tornillo, dos agujeros de conexión rápida y el marcado moldeado (L, ↓, 1, 2…); el enchufe lleva bornes de latón,
// las garras de tierra arriba y abajo y el tornillo central.
// Bornes por detrás del mecanismo (posición en el mecanismo, cm)
export const BORNES_MEC = {
  interruptor: { 1: [-1.2, 1.0], 2: [1.2, 1.0] }, pulsador: { 1: [-1.2, 1.0], 2: [1.2, 1.0] },
  conmutador: { C: [0, 1.25], 1: [-1.3, -1.0], 2: [1.3, -1.0] }, cruzamiento: { 1: [-1.3, 1.1], 2: [1.3, 1.1], 3: [-1.3, -1.1], 4: [1.3, -1.1] },
  enchufe: { L: [-1.45, 0.6], N: [1.45, 0.6], PE: [0, -1.5] }, enchufe2: { L: [-1.45, 0.6], N: [1.45, 0.6], PE: [0, -1.5] }, bombilla: { L: [-1.4, 0], N: [1.4, 0] },
  minutero: { L: [-1.3, 1.1], N: [1.3, 1.1], 3: [-1.3, -1.1], 4: [1.3, -1.1] },
};
const PLAST = () => pbr(0xf8f8f5, { roughness: 0.3, clearcoat: 0.4, clearcoatRoughness: 0.35 });
const PLAST_MATE = () => pbr(0xedebe5, { roughness: 0.6 });
const ZAMAK = () => pbr(0xaeb4ba, { metalness: 0.85, roughness: 0.38 });
const LATON = () => pbr(0xd4ab55, { metalness: 1, roughness: 0.28 });
const HUECO = () => pbr(0x15171a, { roughness: 0.9 });
// placa con hueco (rectangular o redondo) y cantos redondeados; frente a +z, apoyada en z
export function placaHueco(W, H, d, hueco, r, m, z, par) {
  const s = rectRedondo(W, H, r); const h = new THREE.Path();
  if (hueco.r) h.absarc(hueco.x || 0, hueco.y || 0, hueco.r, 0, Math.PI * 2, true); else { const q = rectRedondo(hueco.w, hueco.h, hueco.rr ?? 0.3); h.curves = q.curves; }
  s.holes.push(h); const g = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1, bevelSegments: 3, curveSegments: 20 });
  const o = new THREE.Mesh(g, m); o.position.z = z; o.castShadow = true; o.receiveShadow = true; par?.add(o); return o;
}
function tornilloFrente(x, y, z, par, r = 0.24) { const g = new THREE.Group(); const c = new THREE.Mesh(gCyl(r, 0.14, 16, r * 0.92), LATON()); c.rotation.x = Math.PI / 2; c.position.z = 0.07; g.add(c); caja(r * 1.5, 0.06, 0.05, HUECO(), 0, 0, 0.13, g); caja(0.06, r * 1.5, 0.05, HUECO(), 0, 0, 0.13, g); g.position.set(x, y, z); par?.add(g); return g; }
function schukoTex() {
  if (tc.has('schuko')) return tc.get('schuko');
  const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d');
  g.fillStyle = '#ecebe6'; g.beginPath(); g.arc(128, 128, 128, 0, Math.PI * 2); g.fill();
  const sh = g.createRadialGradient(128, 128, 80, 128, 128, 128); sh.addColorStop(0, 'rgba(0,0,0,0)'); sh.addColorStop(1, 'rgba(0,0,0,0.18)'); g.fillStyle = sh; g.fillRect(0, 0, 256, 256);
  for (const x of [128 - 62, 128 + 62]) {
    g.fillStyle = '#dcdad3'; g.beginPath(); g.arc(x, 128, 27, 0, Math.PI * 2); g.fill(); g.strokeStyle = 'rgba(0,0,0,0.18)'; g.lineWidth = 2; g.stroke();
    g.fillStyle = '#121315'; g.beginPath(); g.arc(x, 128, 17, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#9aa0a6'; g.beginPath(); g.arc(x, 128, 13, 0, Math.PI * 2); g.fill(); // obturador
    g.fillStyle = '#5e646a'; g.fillRect(x - 11, 126, 22, 4);
  }
  g.fillStyle = '#9b9a94'; g.font = 'bold 17px Arial'; g.textAlign = 'center'; g.fillText('16 A  250 V~', 128, 196);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; tc.set('schuko', t); return t;
}
// Tecla basculante: arista suave en el centro (el lado pulsado queda hundido)
function teclaBasculante(w, h, par) {
  const t = bloqueRedondo(w, h, 0.45, 0.45, PLAST(), par, 0.12); const P = t.geometry.attributes.position;
  for (let i = 0; i < P.count; i++) { const y = P.getY(i), z = P.getZ(i); const f = Math.max(0, Math.min(1, (z + 0.35) / 0.7)); P.setZ(i, z + f * 0.16 * (1 - Math.min(1, Math.abs(y) / (h / 2)) ** 1.6)); }
  t.geometry.computeVertexNormals(); return t;
}
export function mecanismo3D(tipo, o = {}) {
  const G = new THREE.Group(); G.userData.partes = {}; G.userData.bornes = {};
  const part = (n) => { const g = new THREE.Group(); g.name = n; G.add(g); G.userData.partes[n] = g; return g; };
  const doble = tipo === 'enchufe2'; const esEnch = tipo === 'enchufe' || doble; const dx = doble ? 7.1 : 0; // el doble: dos módulos a 71 mm
  // caja de superficie (vacía) con entrada troquelada arriba; o de empotrar (universal, redonda, solo se ve el borde)
  const cj = part('caja'); const S = 8.4, D = 4.2, e = 0.3;
  if (o.empotrar) { const m = pbr(0x3d6fb6, { roughness: 0.6 }); for (let i = 0; i < (doble ? 2 : 1); i++) { const ring = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.4, D, 28, 1, true), Object.assign(m.clone(), { side: THREE.DoubleSide })); ring.rotation.x = Math.PI / 2; ring.position.set(-dx / 2 + i * dx, 0, D / 2); cj.add(ring); cil(3.4, 0.2, m, -dx / 2 + i * dx, 0, 0, cj, 28); } }
  else {
    const W = S + dx; caja(W, S, e, PLAST_MATE(), 0, 0, 0, cj); caja(W, e, D, PLAST_MATE(), 0, S / 2 - e / 2, 0, cj); caja(W, e, D, PLAST_MATE(), 0, -S / 2 + e / 2, 0, cj); caja(e, S, D, PLAST_MATE(), -W / 2 + e / 2, 0, 0, cj); caja(e, S, D, PLAST_MATE(), W / 2 - e / 2, 0, 0, cj);
    if (!o.tablero) { const k = cil(0.85, 0.05, MAT.gris(), 0, S / 2 + 0.01, 2.1, cj, 18); k.rotation.x = 0; }
  }
  const marcas = MARCAS[tipo] || MARCAS[esEnch ? 'enchufe' : tipo] || {};
  // mecanismo: cuerpo, bastidor de 60 mm entre ejes con garras, y bornes marcados por detrás
  if (!o.tablero) {
    const mc2 = part('mecanismo');
    for (let i = 0; i < (doble ? 2 : 1); i++) {
      const cx = -dx / 2 + i * dx;
      const cu = bloqueRedondo(4.3, 4.3, 2.2, 0.35, PLAST_MATE(), mc2, 0.1); cu.position.set(cx, 0, 2.2);
      const bast = placaHueco(7.1, 7.1, 0.12, { w: 4.6, h: 4.6, rr: 0.4 }, 0.35, ZAMAK(), 3.3, mc2); bast.position.x = cx;
      for (const [sx, sy] of [[0, -3.0], [0, 3.0], [-3.0, 0], [3.0, 0]]) { const r = bloqueRedondo(sx ? 0.35 : 1.0, sx ? 1.0 : 0.35, 0.05, 0.17, HUECO(), mc2, 0.01); r.position.set(cx + sx, sy, 3.47); } // colisos de los tornillos
      for (const sx of [-2.55, 2.55]) { caja(0.5, 1.4, 1.4, ZAMAK(), cx + sx, 0, 1.7, mc2); tornilloFrente(cx + sx * 0.93, 0, 3.42, mc2, 0.2); } // garras con su tornillo
    }
    { const r = rotulo(esEnch ? '16 A 250 V~  2P+T' : tipo === 'minutero' ? '230 V~  1–7 min' : '10 AX 250 V~', 3.4, 0.45, -dx / 2 - 2.27, 0, 2.2, mc2, { color: '#7c8288', w: 256, h: 34, font: 'bold 24px system-ui, sans-serif' }); r.rotation.set(0, -Math.PI / 2, 0); r.rotateZ(Math.PI / 2); } // rótulo en el costado del mecanismo
    for (const [t, [bx0, by]] of Object.entries(BORNES_MEC[tipo] || {})) {
      const bx = bx0 - dx / 2; const mk = marcas[t] || t;
      const col = t === 'PE' ? '#2f9e44' : t === 'N' ? '#1f5fd6' : '#7a4a22';
      if (esEnch) { // borne de latón con tornillo y entrada lateral (foto 5)
        caja(1.05, 0.85, 0.45, LATON(), bx, by + 0.1, 0.55, mc2);
        tornillo(bx, by + 0.18, 0.55, mc2, 0.3, 'pz', true);
        caja(0.42, 0.42, 0.06, HUECO(), bx, by - 0.35, 0.5, mc2);
      } else { // tornillo + dos agujeros de conexión rápida + ranura de liberación (fotos 1 y 2)
        tornillo(bx, by + 0.45, 1.0, mc2, 0.3, 'pz', true);
        for (const s of [-0.26, 0.26]) cil(0.15, 0.05, HUECO(), bx + s, by - 0.3, 0.92, mc2, 12);
        caja(0.55, 0.14, 0.05, HUECO(), bx, by - 0.62, 0.93, mc2);
      }
      rotulo(mk, 0.9, 0.6, bx, by - 1.05, 0.94, mc2, { atras: true, color: col, w: 96, h: 64, font: 'bold 52px system-ui, sans-serif' });
      G.userData.bornes[t] = { grupo: 'mecanismo', pos: new THREE.Vector3(bx, by - 0.35, 0.9) };
    }
    if (esEnch) for (let i = 0; i < (doble ? 2 : 1); i++) { const cx = -dx / 2 + i * dx; // garras de tierra arriba y abajo y tornillo central (foto 5)
      for (const sy of [-1, 1]) { caja(0.9, 0.18, 2.3, MATS.acero(), cx, sy * 1.95, 1.0, mc2); caja(0.9, 0.5, 0.18, MATS.acero(), cx, sy * 1.75, 3.15, mc2); }
      caja(0.25, 3.6, 0.12, MATS.acero(), cx, 0, 0.88, mc2); tornillo(cx, 0.15, 0.98, mc2, 0.26, 'pz', true); }
  }
  // marco y tecla / tapa
  const z0 = o.tablero ? D : 3.6;
  const mr = part('marco'); placaHueco(8.1 + dx, 8.1, 0.8, { w: 4.6 + dx, h: 4.6, rr: 0.35 }, 0.6, PLAST(), z0, mr);
  if (doble) caja(2.5, 4.6, 0.8, PLAST(), 0, 0, z0, mr);
  const tc2 = part('tecla');
  if (esEnch) {
    G.userData.agujeros = {};
    for (let i = 0; i < (doble ? 2 : 1); i++) { const cx = -dx / 2 + i * dx;
      placaHueco(4.4, 4.4, 0.42, { r: 1.95 }, 0.45, PLAST(), z0 + 0.1, tc2).position.x = cx; // tapa con el pozo Schuko
      const pozo = new THREE.Mesh(new THREE.CylinderGeometry(1.95, 1.95, 0.55, 40, 1, true), Object.assign(PLAST_MATE().clone(), { side: THREE.DoubleSide })); pozo.rotation.x = Math.PI / 2; pozo.position.set(cx, 0, z0 + 0.25); tc2.add(pozo);
      cil(1.95, 0.05, PLAST_MATE(), cx, 0, z0, tc2, 40);
      // fondo del pozo: dos alvéolos de 4,8 mm con obturadores (protección infantil) y rótulo 16 A 250 V~
      const fondo = new THREE.Mesh(geo('schFondo', () => new THREE.CircleGeometry(1.94, 48)), (() => { const kk = 'schFondoM'; if (!mc.has(kk)) { const mm = new THREE.MeshStandardMaterial({ map: schukoTex(), roughness: 0.55 }); mm.userData.compartido = true; mc.set(kk, mm); } return mc.get(kk); })());
      fondo.position.set(cx, 0, z0 + 0.06); tc2.add(fondo);
      for (const sx of [-0.95, 0.95]) cil(0.42, 0.1, PLAST_MATE(), cx + sx, 0, z0 - 0.04, tc2, 20); // resaltes de los alvéolos (dentro del dibujo)
      // muescas laterales con los contactos de tierra (lámina de acero curvada que sobresale hacia el centro)
      for (const sy of [-1, 1]) {
        caja(1.15, 0.32, 0.52, HUECO(), cx, sy * 1.78, z0 + 0.02, tc2);
        const clip = new THREE.Mesh(geo('schClip', () => new THREE.TorusGeometry(0.32, 0.07, 6, 14, Math.PI)), MATS.acero()); clip.position.set(cx, sy * 1.84, z0 + 0.3); clip.rotation.set(0, Math.PI / 2, sy > 0 ? Math.PI / 2 : -Math.PI / 2); clip.scale.set(1, 1, 1.6); tc2.add(clip);
      }
      tornilloFrente(cx, 0, z0 + 0.02, tc2, 0.2);
      if (i === 0) G.userData.agujeros = { L: new THREE.Vector3(cx - 0.95, 0, z0 + 0.6), N: new THREE.Vector3(cx + 0.95, 0, z0 + 0.6), PE: new THREE.Vector3(cx, 1.8, z0 + 0.6) };
    }
  } else if (tipo === 'minutero') {
    const t = bloqueRedondo(4.1, 4.1, 0.45, 0.4, PLAST(), tc2, 0.1); t.position.z = z0 + 0.3;
    const pomo = cil(1.0, 0.5, PLAST_MATE(), 0, 0.4, z0 + 0.5, tc2, 28); void pomo; caja(0.2, 0.8, 0.1, MAT.grisOsc(), 0, 0.75, z0 + 1.0, tc2);
    simbolo('reloj', 0.75, -1.25, -1.4, z0 + 0.57, tc2, '#6b7278'); rotulo('1–7 min', 2.6, 0.8, 0.45, -1.4, z0 + 0.56, tc2, { color: '#6b7278', w: 192, h: 56, font: 'bold 36px system-ui, sans-serif' });
  } else {
    const on = tipo === 'interruptor' || tipo === 'pulsador' ? !!o.on : !!o.pos;
    const t = teclaBasculante(4.1, 4.1, tc2); t.position.z = z0 + 0.35; t.rotation.x = on ? -0.07 : 0.07;
    for (const sx of [-2.08, 2.08]) caja(0.06, 3.9, 0.3, HUECO(), sx, 0, z0 + 0.12, tc2); // holgura entre tecla y marco
    const sim = { conmutador: 'flechas', cruzamiento: 'cruce', pulsador: 'campana', interruptor: '' }[tipo];
    if (sim) simbolo(sim, 0.9, 1.3, -1.3, z0 + 0.62, tc2, '#a3aaaf');
    caja(2.6, 0.1, 0.04, MAT.gris(), 0, on ? -1.5 : 1.5, z0 + 0.66, tc2);
    if (tipo === 'pulsador') { const led = cil(0.18, 0.05, pbr(0x6fb6ff, { emissive: 0x2a7fff, emissiveIntensity: 0.6 }), 0, 1.5, z0 + 0.6, tc2, 12); void led; }
  }
  if (o.tablero && o.empotrar) G.userData.partes.caja.visible = false;
  return G;
}
export function bombilla3D(luz = 0, o = {}) {
  const G = new THREE.Group(); G.userData.partes = {}; G.userData.bornes = {};
  const base = new THREE.Group(); base.name = 'portalamparas'; G.add(base); G.userData.partes.portalamparas = base;
  cil(3.9, 1.6, MAT.blanco(), 0, 0, 0, base, 32); cil(2.4, 2.2, MAT.crema(), 0, 0, 1.6, base, 28);
  if (!o.tablero) { // casquillo E27: rosca (neutro) y contacto central (fase), como el portalámparas real
    const rosca = new THREE.Group(); rosca.name = 'rosca';
    for (let k = 0; k < 6; k++) cil(1.42, 0.22, LATON(), 0, 0, 3.8 + k * 0.38, rosca, 28);
    cil(1.33, 2.3, LATON(), 0, 0, 3.8, rosca, 28); base.add(rosca);
    cil(0.42, 0.25, LATON(), 0, 0, 3.6, base, 16); // contacto central
    rotulo('rosca = N', 2.6, 0.55, 3.2, 3.2, 1.62, base, { color: '#1f5fd6', w: 200, h: 44, font: 'bold 32px system-ui, sans-serif' });
    rotulo('centro = L', 2.6, 0.55, -3.2, 3.2, 1.62, base, { color: '#7a4a22', w: 200, h: 44, font: 'bold 32px system-ui, sans-serif' });
  }
  if (!o.tablero) for (const [t, [bx, by]] of Object.entries(BORNES_MEC.bombilla)) { tornillo(bx, by, 1.6, base, 0.3, 'plano'); rotulo(t, 0.8, 0.6, bx, by - 0.9, 1.62, base, { color: t === 'N' ? '#1f5fd6' : '#7a4a22' }); G.userData.bornes[t] = { grupo: 'portalamparas', pos: new THREE.Vector3(bx, by, 1.9) }; }
  const bm = new THREE.MeshStandardMaterial({ color: luz > 0.05 ? 0xfff1a8 : 0xf2efe6, emissive: 0xffd34d, emissiveIntensity: luz * 1.6, roughness: 0.25, transparent: true, opacity: 0.93 });
  const b = new THREE.Mesh(geo('bulbo', () => new THREE.SphereGeometry(3.1, 24, 16)), bm); b.position.set(0, 0, o.tablero ? 6.3 : 10.5); b.castShadow = true; b.name = 'bombilla'; G.add(b); G.userData.partes.bombilla = b;
  return G;
}

// ---------------------------------------------------------------- fichas de empalme
export function ficha3D(tipo) {
  const f = FICHAS[tipo]; const G = new THREE.Group(); if (!f) return G;
  const w = f.ancho, n = f.vias; const pv = w / n;
  if (f.kind === 'palanca') { // tipo 221: cuerpo transparente, pinza de acero con barra de cobre estañado, palancas naranjas con estrías y ranura de prueba
    const cu = bloqueRedondo(w, 1.86, 0.82, 0.12, pbr(0xe6eef2, { roughness: 0.08, transparent: true, opacity: 0.42, depthWrite: false, clearcoat: 1 }), G, 0.04); cu.position.z = 0.41;
    caja(w - 0.12, 1.1, 0.12, MAT.cobre(), 0, -0.25, 0.12, G); // barra de corriente
    for (let i = 0; i < n; i++) { const x = -w / 2 + pv * (i + 0.5);
      // palanca con su perfil real: bisagra atrás, lomo inclinado y pestaña de empuje con estrías
      const lev = new THREE.Group(); lev.position.set(x, 0, 0); G.add(lev);
      const lg = geo('wagoLev|' + pv, () => { const sh = new THREE.Shape(); [[0.9, 0.7], [0.9, 0.9], [0.3, 0.98], [-0.32, 1.12], [-0.55, 1.08], [-0.6, 0.92], [-0.42, 0.84], [0.6, 0.75]].forEach(([y, z], k) => (k ? sh.lineTo(y, z) : sh.moveTo(y, z)));
        const e = new THREE.ExtrudeGeometry(sh, { depth: pv - 0.12, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 1 }); e.translate(0, 0, -(pv - 0.12) / 2);
        e.applyMatrix4(new THREE.Matrix4().set(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1)); return e; });
      const lm = new THREE.Mesh(lg, pbr(0xff7a12, { roughness: 0.36, clearcoat: 0.35 })); lm.castShadow = true; lev.add(lm);
      for (let k = 0; k < 3; k++) caja(pv - 0.18, 0.05, 0.04, pbr(0xd8620a, { roughness: 0.5 }), 0, -0.48 + k * 0.1, 1.11 - k * 0.035, lev);
      cil(0.08, pv - 0.1, MATS.acero(), 0, 0.82, 0.76, G).rotation.set(0, Math.PI / 2, 0); // eje de la bisagra
      caja(pv - 0.22, 0.12, 0.42, MATS.acero(), x, -0.55, 0.22, G); // pinza (resorte)
      cil(0.15, 0.06, MAT.hueco(), x, -0.93, 0.3, G, 10).rotation.x = 0; // boca del cable
      caja(0.1, 0.22, 0.03, MAT.hueco(), x, -0.78, 0.86, G); } // ranura de prueba (delante de la palanca)
  } else if (f.kind === 'insercion') { // tipo 2273: carcasa transparente con tapa de color y entradas redondas
    const cu = bloqueRedondo(w, 1.3, 0.75, 0.1, pbr(0xe6eef2, { roughness: 0.08, transparent: true, opacity: 0.45, depthWrite: false, clearcoat: 1 }), G, 0.03); cu.position.z = 0.375;
    const tp = bloqueRedondo(w + 0.02, 0.5, 0.78, 0.1, pbr(n >= 5 ? 0xf2c200 : n === 3 ? 0xff7a12 : 0xcfd3d6, { roughness: 0.4 }), G, 0.03); tp.position.set(0, 0.42, 0.39);
    caja(w - 0.12, 0.7, 0.1, MAT.cobre(), 0, -0.15, 0.1, G);
    for (let i = 0; i < n; i++) { const x = -w / 2 + pv * (i + 0.5); cil(0.13, 0.05, MAT.hueco(), x, -0.62, 0.3, G, 10); caja(pv - 0.12, 0.08, 0.36, MATS.acero(), x, -0.38, 0.2, G); }
  } else { // regleta (clema) de polietileno: casquillo de latón pasante y dos tornillos, uno por lado
    const cu = bloqueRedondo(w, 1.6, 0.9, 0.12, pbr(0xf2f1ec, { roughness: 0.45, clearcoat: 0.2 }), G, 0.05); cu.position.z = 0.45;
    for (const sx of [-1, 1]) caja(0.08, 1.62, 0.95, pbr(0xe4e2da, { roughness: 0.5 }), sx * (w / 2 - 0.04), 0, 0, G); // tabiques
    cil(0.34, 0.04, MAT.hueco(), 0, 0.4, 0.88, G, 14); cil(0.34, 0.04, MAT.hueco(), 0, -0.4, 0.88, G, 14);
    tornillo(0, 0.4, 0.72, G, 0.28, 'plano'); tornillo(0, -0.4, 0.72, G, 0.28, 'plano');
    const cs = new THREE.Mesh(gCyl(0.3, 1.7, 16), MAT.laton()); cs.position.set(0, 0, 0.42); G.add(cs); // casquillo
    for (const sy of [-0.86, 0.86]) { const b = new THREE.Mesh(gCyl(0.2, 0.02, 12), MAT.hueco()); b.position.set(0, sy, 0.42); G.add(b); }
  }
  return G;
}

// ---------------------------------------------------------------- caja de empalme (vacía, con conos)
export function cajaEmpalme3D(tam, fichas = {}, posiciones = [], o = {}) {
  const C = CAJAS[tam] || CAJAS[100]; const W = C.w, D = C.d, e = 0.35;
  const G = new THREE.Group(); const gris = mat(0xb9bec3, { roughness: 0.6 });
  caja(W, W, e, gris, 0, 0, 0, G);
  caja(W, e, D, gris, 0, W / 2 - e / 2, 0, G); caja(W, e, D, gris, 0, -W / 2 + e / 2, 0, G); caja(e, W, D, gris, -W / 2 + e / 2, 0, 0, G); caja(e, W, D, gris, W / 2 - e / 2, 0, 0, G);
  for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { cil(0.55, D - 0.6, gris, sx * (W / 2 - 0.9), sy * (W / 2 - 0.9), 0, G, 12); cil(0.18, 0.05, MAT.hueco(), sx * (W / 2 - 0.9), sy * (W / 2 - 0.9), D - 0.58, G, 8); }
  // conos de entrada (troquelados) en las paredes
  const cono = mat(0x8e959b, { roughness: 0.7 });
  const conos = [[0, W / 2], [0, -W / 2], [-W / 2, 0], [W / 2, 0]];
  for (const [cx, cy] of conos) { const r = new THREE.Mesh(gCyl(0.9, 0.5, 18, 1.1), cono); r.position.set(cx, cy, D / 2); if (cx === 0) r.rotation.set(0, 0, cy > 0 ? 0 : Math.PI); else r.rotation.set(0, 0, cx > 0 ? -Math.PI / 2 : Math.PI / 2); G.add(r); }
  for (const s2 of [-1, 1]) for (const k of [-0.25, 0.25]) { caja(0.12, 0.5, D - 0.8, gris, k * W, s2 * (W / 2 - e - 0.25), 0.2, G); caja(0.5, 0.12, D - 0.8, gris, s2 * (W / 2 - e - 0.25), k * W, 0.2, G); } // nervios interiores
  if (o.tapa) { const t = caja(W + 0.2, W + 0.2, 0.4, mat(0xc9ced2, { transparent: true, opacity: 0.35, depthWrite: false }), 0, 0, D, G); t.name = 'tapa';
    for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) tornillo(sx * (W / 2 - 0.9), sy * (W / 2 - 0.9), D + 0.4, t.parent, 0.3, 'pz'); }
  posiciones.forEach(([px, py], i) => { const t = 'B' + (i + 1); const tp = fichas[t]; if (!tp) return; const f = ficha3D(tp); f.position.set(px, py, e); G.add(f); });
  G.userData.D = D; return G;
}

// ---------------------------------------------------------------- aparamenta modular (IGA, ID, magnetotérmico)
const perfilDIN = new Map();
function cuerpoDIN(W) { // perfil lateral (y, z) de un aparato modular: base, hombros de los bornes y frente de 45 mm
  if (perfilDIN.has(W)) return perfilDIN.get(W);
  const P = [[-4.25, 0], [4.25, 0], [4.25, 3.0], [4.02, 3.25], [3.98, 4.2], [3.78, 4.4], [2.3, 4.45], [2.25, 6.2], [2.05, 6.4], [-2.05, 6.4], [-2.25, 6.2], [-2.3, 4.45], [-3.78, 4.4], [-3.98, 4.2], [-4.02, 3.25], [-4.25, 3.0]];
  const s = new THREE.Shape(); P.forEach(([y, z], i) => (i ? s.lineTo(z, y) : s.moveTo(z, y)));
  const g = new THREE.ExtrudeGeometry(s, { depth: W - 0.08, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0, bevelOffset: 0, bevelSegments: 1 });
  g.rotateY(-Math.PI / 2); g.translate((W - 0.08) / 2, 0, 0); g.userData.compartida = true; perfilDIN.set(W, g); return g;
}
export function modulo3D(tipo, o = {}) {
  // Perfil DIN real (como Hager, Schneider iC60 o Legrand DX³): cuerpo de 85 mm con escalón frontal de 45 mm, bornes de
  // caja arriba (ENTRADA 1 · N) y abajo (SALIDA 2 · N) con su tornillo PZ2 hundido y la boca del cable, palanca con
  // estrías e I-ON / O-OFF, calibre y curva impresos bajo una ventana, y la pestaña de enganche al carril; el
  // diferencial lleva además el botón T de prueba.
  const mods = tipo === 'iga' || tipo === 'id' ? 2 : 1; const W = mods * 1.8 - 0.06; const G = new THREE.Group();
  const B = pbr(0xf1f1ed, { roughness: 0.42, clearcoat: 0.15 });
  const cu = new THREE.Mesh(cuerpoDIN(W), B); cu.castShadow = true; cu.receiveShadow = true; G.add(cu);
  for (let i = 1; i < mods; i++) caja(0.04, 8.4, 6.3, pbr(0xd9d9d3, { roughness: 0.6 }), -W / 2 + i * 1.8 - 0.03, 0, 0.02, G); // junta entre módulos
  const on = o.on !== false;
  caja(Math.min(1.45, W - 0.3), 2.7, 0.12, MAT.hueco(), 0, 0, 6.32, G); // hueco de la palanca
  const colP = tipo === 'id' ? 0x1f5fd6 : tipo === 'iga' ? 0xb3121f : 0x2b2b2b;
  const lev = new THREE.Group(); lev.name = 'palanca'; lev.position.set(0, on ? 0.6 : -0.6, 6.4); G.add(lev);
  const lw = Math.min(1.25, W - 0.4); const lb = bloqueRedondo(lw, 1.2, 0.85, 0.18, pbr(colP, { roughness: 0.38, clearcoat: 0.3 }), lev, 0.05); lb.position.z = 0.43;
  for (let k = 0; k < 3; k++) caja(lw - 0.15, 0.07, 0.06, pbr(colP, { roughness: 0.6 }), 0, -0.3 + k * 0.3, 0.86, lev);
  rotulo('I-ON  O-OFF', W - 0.15, 0.4, 0, 1.95, 6.42, G, { color: '#c81e1e', w: 192, h: 40, font: 'bold 28px system-ui, sans-serif' });
  const et = tipo === 'id' ? `ID ${o.In || 40} A\nIΔn 30 mA` : tipo === 'iga' ? `IGA\nC${o.In || 25}` : `${o.curva || 'C'}${o.In || 16}\n${o.circ || ''}`;
  rotulo(et, W - 0.2, 0.9, 0, -1.72, 6.42, G, { bg: '#ffffff', w: 128, h: 72, font: 'bold 28px system-ui, sans-serif' });
  caja(W - 0.12, 1.0, 0.05, pbr(0xeef4f8, { roughness: 0.05, transparent: true, opacity: 0.25, depthWrite: false }), 0, -1.72, 6.42, G); // ventana del rótulo
  if (tipo === 'id') { cil(0.32, 0.35, MAT.amarillo(), W / 2 - 0.45, 0.9, 6.4, G, 14); rotulo('T', 0.5, 0.5, W / 2 - 0.45, 0.9, 6.77, G, { color: '#1d2329', w: 48, h: 48, font: 'bold 40px system-ui, sans-serif' }); }
  if (o.disparado) caja(0.5, 0.5, 0.1, mat(0xe02020, { emissive: 0xff0000, emissiveIntensity: 0.8 }), -W / 2 + 0.45, 1.9, 6.4, G);
  // pestaña de enganche al carril (abajo) con su ranura para el destornillador
  caja(Math.min(1.0, W - 0.5), 0.5, 0.9, pbr(0x8d949a, { roughness: 0.55 }), 0, -4.45, 0.15, G); caja(0.5, 0.08, 0.05, MAT.hueco(), 0, -4.6, 1.06, G);
  const polos = mods === 2 ? [-0.9, 0.9] : [-0.45, 0.45];
  polos.forEach((px, i) => {
    const n = i === 1; const col = n ? '#1f5fd6' : '#7a4a22';
    for (const [y, mk] of [[3.4, n ? 'N' : '1'], [-3.4, n ? 'N' : '2']]) {
      cil(0.36, 0.04, MAT.hueco(), px, y, 4.38, G, 16); // pozo del tornillo
      tornillo(px, y, 4.3, G, 0.26, 'pz');
      caja(0.62, 0.42, 0.6, MAT.hueco(), px, y + (y > 0 ? 0.62 : -0.62), 3.3, G); // boca del borne de caja
      caja(0.46, 0.06, 0.4, MATS.acero(), px, y + (y > 0 ? 0.62 : -0.62), 3.42, G); // jaula del borne
      rotulo(mk, 0.62, 0.52, px, y > 0 ? 2.55 : -2.55, 4.47, G, { color: col, bg: '#ffffff', w: 64, h: 52, font: 'bold 42px system-ui, sans-serif' });
    }
  });
  return G;
}
// Cuadro de superficie de 12 módulos: fondo, paredes, carril DIN y barra de tierra (sin aparamenta)
export function cuadro3D(w = 30, h = 24) {
  const G = new THREE.Group(); const B = MAT.blanco();
  caja(w, h, 1.2, B, 0, 0, 0, G); caja(w, 1.2, 8, B, 0, h / 2 - 0.6, 0, G); caja(w, 1.2, 8, B, 0, -h / 2 + 0.6, 0, G); caja(1.2, h, 8, B, -w / 2 + 0.6, 0, 0, G); caja(1.2, h, 8, B, w / 2 - 0.6, 0, 0, G);
  { // carril DIN 35 × 7,5 mm (perfil de sombrero) con ranuras alargadas
    const sh = new THREE.Shape(); const P = [[-1.75, 0], [-1.75, 0.1], [-1.25, 0.1], [-1.25, 0.75], [1.25, 0.75], [1.25, 0.1], [1.75, 0.1], [1.75, 0], [1.15, 0], [1.15, 0.65], [-1.15, 0.65], [-1.15, 0]];
    P.forEach(([y, z], i) => (i ? sh.lineTo(z, y) : sh.moveTo(z, y)));
    const g = new THREE.ExtrudeGeometry(sh, { depth: 23, bevelEnabled: false }); g.rotateY(-Math.PI / 2); g.translate(11.5, 1, 1.2);
    const rail = new THREE.Mesh(g, pbr(0xc9ced3, { metalness: 0.9, roughness: 0.32 })); rail.castShadow = true; rail.receiveShadow = true; G.add(rail);
    for (let i = 0; i < 9; i++) caja(1.5, 0.5, 0.03, MAT.hueco(), -10 + i * 2.5, 1, 1.95, G);
  }
  caja(6, 1.2, 1, MAT.laton(), 12, 8.6, 1.2, G); for (let i = 0; i < 4; i++) tornillo(9.8 + i * 1.5, 8.6, 2.2, G, 0.22, 'plano');
  for (const sx of [9.5, 14.5]) caja(0.6, 1.6, 1.2, pbr(0x2f9e44, { roughness: 0.5 }), sx, 8.6, 0.6, G); // soportes aislantes de la barra de tierra
  simbolo('tierra', 1.1, 8.2, 8.6, 1.26, G, '#2f9e44');
  return G;
}

// ---------------------------------------------------------------- herramientas (punta en el origen, cuerpo hacia +z)
// Las herramientas son las del kit 3D compartido (kit3d/herramientas.js): mismos modelos realistas que en «Actividades».
const MANGO = () => mat(0xd6261c, { roughness: 0.55 });
const KIT_ID = { alicate: 'alicate_universal', corte: 'alicate_corte', punta: 'alicate_punta' };
export function idKit(id, punta = 'PZ1') { if (id !== 'destornillador') return KIT_ID[id] || id; return punta.startsWith('plano') ? 'destornillador_plano' : punta.startsWith('PH') ? 'destornillador_ph' : punta.startsWith('PZ') ? 'destornillador_pz' : 'destornillador_torx'; }
export function punta3D(tipo, par, z = 0) { // punta suelta (muestrario): la misma geometría que la del destornillador del kit
  const g = puntaKit(tipo); g.traverse((m) => { if (m.isMesh) m.castShadow = true; }); g.position.z = z; par?.add(g); return g;
}
export function herramienta3D(id, o = {}) {
  const k = kitHerr(idKit(id, o.punta || 'PZ1'), { punta: o.punta || 'PZ1' });
  if (k) { k.userData.id = id; k.traverse((m) => { if (m.isMesh) m.castShadow = true; }); return k; }
  const G = new THREE.Group();
  if (id === 'epi') { const gl = pbr(0xbfe3ff, { transparent: true, opacity: 0.5, roughness: 0.05, clearcoat: 1 }); bloqueRedondo(14, 4.5, 0.3, 1.8, gl, G, 0.1); caja(0.6, 1, 12, MAT.grisOsc(), -7, 0.8, -12, G); caja(0.6, 1, 12, MAT.grisOsc(), 7, 0.8, -12, G); const gu = bloqueRedondo(8, 11, 2.2, 2.5, pbr(0xffd21e, { roughness: 0.8, sheen: 1, sheenColor: 0xffffff }), G, 0.4); gu.position.set(0, -12, 0); }
  else if (id === 'grapa') { G.add(grapaKit(16)); }
  else { cil(1.2, 10, MANGO(), 0, 0, 0, G, 12); }
  G.userData.id = id; return G;
}

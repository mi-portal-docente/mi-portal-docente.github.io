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
      for (const sx of [-0.95, 0.95]) { cil(0.27, 0.06, HUECO(), cx + sx, 0, z0 + 0.03, tc2, 16); cil(0.3, 0.02, pbr(0xd9d6cf, { roughness: 0.5 }), cx + sx, 0, z0 + 0.05, tc2, 16).scale.set(1, 1, 1); }
      for (const sy of [-1.86, 1.86]) caja(1.0, 0.1, 0.5, MATS.acero(), cx, sy, z0 + 0.03, tc2); // contactos de tierra
      tornilloFrente(cx, 0, z0 + 0.02, tc2, 0.2);
      if (i === 0) G.userData.agujeros = { L: new THREE.Vector3(cx - 0.95, 0, z0 + 0.6), N: new THREE.Vector3(cx + 0.95, 0, z0 + 0.6), PE: new THREE.Vector3(cx, 1.8, z0 + 0.6) };
    }
  } else if (tipo === 'minutero') {
    const t = bloqueRedondo(4.1, 4.1, 0.45, 0.4, PLAST(), tc2, 0.1); t.position.z = z0 + 0.3;
    const pomo = cil(1.0, 0.5, PLAST_MATE(), 0, 0.4, z0 + 0.5, tc2, 28); void pomo; caja(0.2, 0.8, 0.1, MAT.grisOsc(), 0, 0.75, z0 + 1.0, tc2);
    rotulo('⏱ 1–7 min', 3.6, 0.8, 0, -1.4, z0 + 0.56, tc2, { color: '#6b7278', w: 256, h: 56, font: 'bold 36px system-ui, sans-serif' });
  } else {
    const on = tipo === 'interruptor' || tipo === 'pulsador' ? !!o.on : !!o.pos;
    const t = bloqueRedondo(4.1, 4.1, 0.45, 0.45, PLAST(), tc2, 0.12); t.position.z = z0 + 0.35; t.rotation.x = on ? -0.07 : 0.07;
    const sim = { conmutador: '⇅', cruzamiento: '✕', pulsador: '🔔', interruptor: '' }[tipo];
    if (sim) rotulo(sim, 1.0, 1.0, 1.3, -1.3, z0 + 0.62, tc2, { color: '#9aa1a6', w: 64, h: 64, font: 'bold 48px system-ui, sans-serif' });
    caja(2.6, 0.1, 0.04, MAT.gris(), 0, on ? -1.5 : 1.5, z0 + 0.6, tc2);
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
  const w = f.ancho, n = f.vias;
  if (f.kind === 'palanca') { // cuerpo transparente con palancas naranjas
    caja(w, 1.86, 0.84, MAT.transp(), 0, 0, 0, G);
    for (let i = 0; i < n; i++) { const x = -w / 2 + (w / n) * (i + 0.5); caja(w / n - 0.12, 1.3, 0.22, MAT.naranja(), x, 0.2, 0.84, G); caja(w / n - 0.3, 0.12, 0.6, MAT.cobre(), x, -0.9, 0.12, G); }
  } else if (f.kind === 'insercion') {
    caja(w, 1.3, 0.75, MAT.transp(), 0, 0, 0, G); caja(w, 0.5, 0.78, MAT.gris(), 0, 0.42, 0, G);
    for (let i = 0; i < n; i++) cil(0.14, 0.05, MAT.hueco(), -w / 2 + (w / n) * (i + 0.5), -0.62, 0.3, G, 8);
  } else { // regleta de tornillo
    caja(w, 1.6, 0.9, MAT.blanco(), 0, 0, 0, G); tornillo(0, 0.4, 0.9, G, 0.28, 'plano'); tornillo(0, -0.4, 0.9, G, 0.28, 'plano');
    caja(0.5, 0.5, 0.5, MAT.laton(), 0, 0, 0.2, G);
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
  if (o.tapa) { const t = caja(W + 0.2, W + 0.2, 0.4, mat(0xc9ced2, { transparent: true, opacity: 0.35, depthWrite: false }), 0, 0, D, G); t.name = 'tapa'; }
  posiciones.forEach(([px, py], i) => { const t = 'B' + (i + 1); const tp = fichas[t]; if (!tp) return; const f = ficha3D(tp); f.position.set(px, py, e); G.add(f); });
  G.userData.D = D; return G;
}

// ---------------------------------------------------------------- aparamenta modular (IGA, ID, magnetotérmico)
export function modulo3D(tipo, o = {}) {
  // Perfil DIN real (como Hager, Schneider iC60 o Legrand DX³): cuerpo de 85 mm con escalón frontal de 45 mm, bornes de
  // caja arriba (ENTRADA 1 · N) y abajo (SALIDA 2 · N) con su tornillo PZ2 y la boca del cable, palanca con I-ON / O-OFF,
  // calibre y curva impresos; el diferencial lleva además el botón T de prueba.
  const mods = tipo === 'iga' || tipo === 'id' ? 2 : 1; const W = mods * 1.8 - 0.06; const G = new THREE.Group();
  const B = pbr(0xf4f4f1, { roughness: 0.42 });
  caja(W, 8.5, 3.2, B, 0, 0, 0, G); // base sobre el carril
  caja(W, 6.6, 1.2, B, 0, 0, 3.2, G); // hombros de los bornes
  caja(W, 4.5, 2.0, B, 0, 0, 4.4, G); // frente
  const on = o.on !== false;
  const lev = caja(Math.min(1.25, W - 0.4), 1.2, 0.9, mat(tipo === 'id' ? 0x1f5fd6 : tipo === 'iga' ? 0xb3121f : 0x2b2b2b, { roughness: 0.4 }), 0, on ? 0.6 : -0.6, 6.4, G); lev.name = 'palanca';
  rotulo('I-ON  O-OFF', W - 0.15, 0.4, 0, 1.95, 6.42, G, { color: '#c81e1e', w: 192, h: 40, font: 'bold 28px system-ui, sans-serif' });
  const et = tipo === 'id' ? `ID ${o.In || 40} A\nIΔn 30 mA` : tipo === 'iga' ? `IGA\nC${o.In || 25}` : `${o.curva || 'C'}${o.In || 16}\n${o.circ || ''}`;
  rotulo(et, W - 0.2, 0.9, 0, -1.72, 6.42, G, { bg: '#ffffff', w: 128, h: 72, font: 'bold 28px system-ui, sans-serif' });
  if (tipo === 'id') { cil(0.32, 0.35, MAT.amarillo(), W / 2 - 0.45, 0.9, 6.4, G, 14); rotulo('T', 0.5, 0.5, W / 2 - 0.45, 0.9, 6.77, G, { color: '#1d2329', w: 48, h: 48, font: 'bold 40px system-ui, sans-serif' }); }
  if (o.disparado) caja(0.5, 0.5, 0.1, mat(0xe02020, { emissive: 0xff0000, emissiveIntensity: 0.8 }), -W / 2 + 0.45, 1.9, 6.4, G);
  const polos = mods === 2 ? [-0.9, 0.9] : [-0.45, 0.45];
  polos.forEach((px, i) => {
    const n = i === 1; const col = n ? '#1f5fd6' : '#7a4a22';
    for (const [y, mk] of [[3.4, n ? 'N' : '1'], [-3.4, n ? 'N' : '2']]) {
      tornillo(px, y, 4.4, G, 0.26, 'pz');
      caja(0.62, 0.42, 0.6, MAT.hueco(), px, y + (y > 0 ? 0.62 : -0.62), 3.3, G); // boca del borne de caja
      rotulo(mk, 0.62, 0.52, px, y > 0 ? 2.55 : -2.55, 4.42, G, { color: col, bg: '#ffffff', w: 64, h: 52, font: 'bold 42px system-ui, sans-serif' });
    }
  });
  return G;
}
// Cuadro de superficie de 12 módulos: fondo, paredes, carril DIN y barra de tierra (sin aparamenta)
export function cuadro3D(w = 30, h = 24) {
  const G = new THREE.Group(); const B = MAT.blanco();
  caja(w, h, 1.2, B, 0, 0, 0, G); caja(w, 1.2, 8, B, 0, h / 2 - 0.6, 0, G); caja(w, 1.2, 8, B, 0, -h / 2 + 0.6, 0, G); caja(1.2, h, 8, B, -w / 2 + 0.6, 0, 0, G); caja(1.2, h, 8, B, w / 2 - 0.6, 0, 0, G);
  caja(23, 3.5, 0.75, MAT.acero(), 0, 1, 1.2, G); // carril DIN 35 mm
  caja(6, 1.2, 1, MAT.laton(), 12, 8.6, 1.2, G); for (let i = 0; i < 4; i++) tornillo(9.8 + i * 1.5, 8.6, 2.2, G, 0.22, 'plano');
  rotulo('⏚', 1.2, 1, 8.2, 8.6, 1.25, G, { color: '#2f9e44' });
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

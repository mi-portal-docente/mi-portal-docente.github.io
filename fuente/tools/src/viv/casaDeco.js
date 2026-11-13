// Vivienda real en 3D (eje z hacia arriba, cm): suelos con textura (tarima, baldosa, gres), tabiques con rodapié y
// muebles modelados (cama, sofá, mesa, bañera, lavabo, inodoro, cocina con fregadero y placa, frigorífico), además de
// los puntos de la instalación con su forma real (mecanismo de pared, base Schuko, caja de registro, plafón y cuadro).
import * as THREE from 'three';
import { pbr, tex, rectRedondo, calidad } from '../kit3d/base.js';

const Q = () => calidad();
function m3(geo, mat, par, x = 0, y = 0, z = 0) { const o = new THREE.Mesh(geo, mat); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; par.add(o); return o; }
const B = (w, d, h) => new THREE.BoxGeometry(w, d, h);
// caja apoyada en z0 (no centrada en altura)
const bx = (par, w, d, h, mat, x, y, z0 = 0) => m3(B(w, d, h), mat, par, x, y, z0 + h / 2);
// bloque redondeado (cojines, colchón) apoyado en z0
function blando(par, w, d, h, r, mat, x, y, z0) {
  const bt = Math.min(r, h / 2 - 0.1), bs = Math.min(r * 0.6, w / 4, d / 4);
  const g = new THREE.ExtrudeGeometry(rectRedondo(w - 2 * bs, d - 2 * bs, Math.max(0.1, Math.min(r, (w - 2 * bs) / 2 - 0.1, (d - 2 * bs) / 2 - 0.1))), { depth: Math.max(0.1, h - 2 * bt), bevelEnabled: true, bevelThickness: bt, bevelSize: bs, bevelSegments: 3, curveSegments: 6 });
  return m3(g, mat, par, x, y, z0 + bt);
}
// ---------------------------------------------------------------- texturas de suelo
function texSuelo(tipo) {
  return tex('suelo|' + tipo, 512, 512, (g, w, h) => {
    if (tipo === 'tarima') { // lamas de roble de 20 cm con vetas
      let r = 7; const rnd = () => ((r = (r * 9301 + 49297) % 233280) / 233280);
      for (let i = 0; i < 8; i++) { let y0 = 0; const off = rnd() * 300; for (let k = -1; k < 3; k++) { const x0 = i * 64, yy = k * 300 + off; const base = 168 + rnd() * 30; g.fillStyle = `rgb(${base},${base * 0.74 | 0},${base * 0.47 | 0})`; g.fillRect(x0, yy, 64, 300); for (let v = 0; v < 18; v++) { g.strokeStyle = `rgba(90,55,25,${0.05 + rnd() * 0.12})`; g.lineWidth = 1 + rnd() * 2; g.beginPath(); const vx = x0 + rnd() * 64; g.moveTo(vx, yy); g.bezierCurveTo(vx + 6, yy + 100, vx - 6, yy + 200, vx + 2, yy + 300); g.stroke(); } g.fillStyle = 'rgba(40,25,10,0.5)'; g.fillRect(x0, yy, 64, 2); } g.fillStyle = 'rgba(40,25,10,0.45)'; g.fillRect(i * 64, 0, 2, h); void y0; }
    } else if (tipo === 'baldosa') { // gres de 30 × 30 con junta
      g.fillStyle = '#9aa4a8'; g.fillRect(0, 0, w, h); for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { const gr = g.createLinearGradient(i * 128, j * 128, i * 128 + 128, j * 128 + 128); gr.addColorStop(0, '#e9ecec'); gr.addColorStop(1, '#d9dedf'); g.fillStyle = gr; g.fillRect(i * 128 + 3, j * 128 + 3, 122, 122); }
    } else { // piedra / gres beige del pasillo
      g.fillStyle = '#b9ab92'; g.fillRect(0, 0, w, h); for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) { g.fillStyle = (i + j) % 2 ? '#ddd0b8' : '#d6c8ae'; g.fillRect(i * 256 + 3, j * 256 + 3, 250, 250); }
      for (let k = 0; k < 900; k++) { g.fillStyle = `rgba(120,100,70,${Math.random() * 0.12})`; g.fillRect(Math.random() * w, Math.random() * h, 3, 3); }
    }
  }, { rep: [1, 1] });
}
function matSuelo(tipo, wcm, hcm) { const t = texSuelo(tipo).clone(); t.wrapS = t.wrapT = THREE.RepeatWrapping; const esc = tipo === 'tarima' ? 160 : tipo === 'baldosa' ? 120 : 120; t.repeat.set(wcm / esc, hcm / esc); t.needsUpdate = true; return new THREE.MeshStandardMaterial({ map: t, roughness: tipo === 'baldosa' ? 0.35 : 0.7 }); }
const SUELO = { vestibulo: 'piedra', pasillo: 'piedra', salon: 'tarima', dormitorio: 'tarima', cocina: 'baldosa', bano: 'baldosa' };

// ---------------------------------------------------------------- muebles (r = [x0, y0, x1, y1], h = alto)
const TELA = (c) => pbr(c, { roughness: 0.92 });
const MADERA = () => pbr(0x9b7046, { roughness: 0.6 });
const LACADO = () => pbr(0xf4f4f1, { roughness: 0.3, clearcoat: 0.5 });
const CERAMICA = () => pbr(0xfbfbf9, { roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.05 });
const INOX = () => pbr(0xc9ced3, { metalness: 0.95, roughness: 0.28 });
function mueble(par, f) {
  const [x0, y0, x1, y1] = f.r; const w = x1 - x0, d = y1 - y0, h = f.h, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2; const g = new THREE.Group(); par.add(g);
  const largoX = w >= d;
  switch (f.t) {
    case 'cama': { // somier de madera, colchón, nórdico, almohadas y cabecero en el lado de la pared (y0)
      bx(g, w, d, 22, MADERA(), cx, cy, 8); for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) bx(g, 6, 6, 8, MADERA(), cx + sx * (w / 2 - 4), cy + sy * (d / 2 - 4), 0);
      blando(g, w - 4, d - 6, 18, 4, TELA(0xf2f0ea), cx, cy + 2, 30);
      blando(g, w - 2, d * 0.62, 6, 3, TELA(0x7f9cc0), cx, cy + d * 0.18, 44); // nórdico
      for (const sx of [-1, 1]) blando(g, w * 0.4, 24, 9, 4, TELA(0xfdfdfb), cx + sx * w * 0.23, y0 + 22, 46);
      bx(g, w + 4, 5, 95, MADERA(), cx, y0 + 2.5, 0); // cabecero
      break; }
    case 'sofa': { // base, asiento con 3 cojines, respaldo y brazos (respaldo contra la pared en y1)
      const tela = TELA(0x6f7f62); bx(g, w, d, 20, pbr(0x2b2b2b, { roughness: 0.6 }), cx, cy, 0);
      blando(g, w - 4, d, 22, 5, tela, cx, cy, 8);
      for (let i = 0; i < 3; i++) blando(g, (w - 40) / 3 - 2, d - 22, 12, 4, TELA(0x7a8b6c), x0 + 20 + ((w - 40) / 3) * (i + 0.5), cy - 6, 30);
      blando(g, w - 4, 18, 50, 7, tela, cx, y1 - 9, 22);
      for (const sx of [-1, 1]) blando(g, 18, d, 34, 6, tela, cx + sx * (w / 2 - 9), cy, 22);
      break; }
    case 'mesa': { const top = new THREE.ExtrudeGeometry(rectRedondo(w, d, 4), { depth: 3, bevelEnabled: true, bevelThickness: 0.6, bevelSize: 0.6, bevelSegments: 2 }); m3(top, MADERA(), g, cx, cy, h - 3.6);
      for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) m3(new THREE.CylinderGeometry(2.2, 1.6, h - 3.6, 12).rotateX(Math.PI / 2), MADERA(), g, cx + sx * (w / 2 - 8), cy + sy * (d / 2 - 8), (h - 3.6) / 2);
      for (const [sx, sy] of [[-1, 0], [1, 0]]) { const sil = new THREE.Group(); sil.position.set(cx + sx * (w / 2 + 14), cy + sy, 0); g.add(sil); bx(sil, 40, 40, 4, MADERA(), 0, 0, 44); for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) bx(sil, 3, 3, 44, MADERA(), a * 17, b * 17, 0); bx(sil, 4, 40, 40, MADERA(), sx * 18, 0, 48); }
      break; }
    case 'banera': { // carcasa con la cubeta hundida
      const s = rectRedondo(w, d, 6); const hueco = rectRedondo(w - 12, d - 12, 12); const p = new THREE.Path(); p.curves = hueco.curves; s.holes.push(p);
      m3(new THREE.ExtrudeGeometry(s, { depth: h - 2, bevelEnabled: true, bevelThickness: 2, bevelSize: 1.5, bevelSegments: 3, curveSegments: 10 }), CERAMICA(), g, cx, cy, 0);
      blando(g, w - 12, d - 12, 8, 5, CERAMICA(), cx, cy, 6);
      m3(new THREE.CylinderGeometry(1.2, 1.2, 1, 12).rotateX(Math.PI / 2), INOX(), g, cx + w / 2 - 22, cy, 14.6); // desagüe
      m3(new THREE.TorusGeometry(4, 0.8, 8, 16, Math.PI), INOX(), g, cx + w / 2 - 8, cy, h + 4).rotation.set(Math.PI / 2, 0, Math.PI / 2); // grifo
      break; }
    case 'lavabo': { bx(g, w, d, h - 16, LACADO(), cx, cy, 0); bx(g, w - 6, 1, h - 26, pbr(0xdedcd6, { roughness: 0.5 }), cx, y0 - 0.2, 6);
      const s = rectRedondo(w, d, 4); const ho = new THREE.Path(); ho.absellipse(0, 0, w * 0.32, d * 0.3, 0, Math.PI * 2, true); s.holes.push(ho);
      m3(new THREE.ExtrudeGeometry(s, { depth: 12, bevelEnabled: true, bevelThickness: 1.2, bevelSize: 1, bevelSegments: 2, curveSegments: 16 }), CERAMICA(), g, cx, cy, h - 16);
      const pila = m3(new THREE.SphereGeometry(1, 20, 10, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), CERAMICA(), g, cx, cy, h - 4); pila.scale.set(w * 0.32, d * 0.3, 9);
      const gr = new THREE.Group(); gr.position.set(cx, y1 - 6, h); g.add(gr); m3(new THREE.CylinderGeometry(1.4, 1.6, 12, 14).rotateX(Math.PI / 2), INOX(), gr, 0, 0, 6); m3(new THREE.CylinderGeometry(0.9, 0.9, 10, 10), INOX(), gr, 0, -5, 11);
      bx(g, w * 0.9, 2, 70, pbr(0xdfe9ee, { metalness: 0.9, roughness: 0.05 }), cx, y1 + 0.5, h + 25); // espejo
      break; }
    case 'inodoro': { // taza (torno) y cisterna contra la pared (x0)
      const taza = new THREE.LatheGeometry([[0, 0], [12, 0], [13, 10], [17, 30], [18.5, 38], [18.5, 40], [14, 40], [12, 32], [0, 30]].map(([r, z]) => new THREE.Vector2(r, z)), 28); taza.rotateX(Math.PI / 2);
      const t = m3(taza, CERAMICA(), g, cx + 6, cy, 0); t.scale.set(1.25, 0.95, 1);
      blando(g, 44, 36, 3, 1.4, CERAMICA(), cx + 7, cy, 40); // tapa
      blando(g, 18, d, 38, 4, CERAMICA(), x0 + 9, cy, 40); m3(new THREE.CylinderGeometry(2.5, 2.5, 1, 14).rotateX(Math.PI / 2), INOX(), g, x0 + 9, cy, 78.6);
      break; }
    case 'encimera': { // muebles bajos con puertas, zócalo y encimera de 3 cm
      bx(g, w, d - 4, 10, pbr(0x3a3d40, { roughness: 0.6 }), cx, cy + 2, 0);
      bx(g, w, d, h - 13, LACADO(), cx, cy, 10);
      const n = Math.max(1, Math.round(w / 60)); for (let i = 1; i < n; i++) bx(g, 0.6, 1, h - 15, pbr(0x9aa0a6, { roughness: 0.6 }), x0 + (w / n) * i, y0 - 0.3, 11);
      for (let i = 0; i < n; i++) bx(g, 14, 1.6, 1.6, INOX(), x0 + (w / n) * (i + 0.5), y0 - 0.8, h - 14);
      bx(g, w + 2, d + 2, 3, pbr(0x55595e, { roughness: 0.35, clearcoat: 0.6 }), cx, cy - 1, h - 3); // encimera de piedra
      break; }
    case 'fregadero': { const cub = new THREE.Group(); g.add(cub); bx(cub, w, d, 1, INOX(), cx, cy, h - 1.1); m3(B(w - 8, d - 8, 0.5), pbr(0x8f959b, { metalness: 0.9, roughness: 0.4 }), cub, cx, cy, h - 1.0);
      m3(new THREE.TorusGeometry(9, 1.1, 8, 20, Math.PI), INOX(), g, cx, y1 - 4, h + 22).rotation.set(Math.PI / 2, 0, Math.PI / 2); m3(new THREE.CylinderGeometry(1.4, 1.8, 22, 12).rotateX(Math.PI / 2), INOX(), g, cx, y1 - 4, h + 11);
      break; }
    case 'placa': { m3(new THREE.ExtrudeGeometry(rectRedondo(w, d, 2), { depth: 0.6, bevelEnabled: false }), pbr(0x0d0e10, { roughness: 0.05, clearcoat: 1 }), g, cx, cy, h - 0.6);
      const zonas = tex('placaZonas', 256, 256, (c) => { c.clearRect(0, 0, 256, 256); c.strokeStyle = '#8b9096'; c.lineWidth = 4; for (const [x, y, r] of [[70, 70, 48], [186, 70, 38], [70, 186, 38], [186, 186, 48]]) { c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.stroke(); c.beginPath(); c.arc(x, y, r * 0.55, 0, Math.PI * 2); c.stroke(); } });
      const p = new THREE.Mesh(new THREE.PlaneGeometry(w - 4, d - 4), new THREE.MeshBasicMaterial({ map: zonas, transparent: true })); p.position.set(cx, cy, h + 0.02); g.add(p);
      break; }
    case 'frigo': { blando(g, w, d, h, 3, pbr(0xe9ecee, { roughness: 0.25, clearcoat: 0.6 }), cx, cy, 0);
      bx(g, 1, d - 4, 0.8, pbr(0xb9bfc5, { roughness: 0.5 }), x0 - 0.2, cy, h * 0.62); // junta de puertas
      for (const [z0, hh] of [[h * 0.66, h * 0.2], [h * 0.25, h * 0.3]]) bx(g, 2.5, 3, hh, INOX(), x0 - 1.4, y0 + 8, z0);
      break; }
    default: bx(g, w, d, h, pbr(0xcccccc), cx, cy, 0);
  }
  void largoX; return g;
}

// ---------------------------------------------------------------- casa: suelos, tabiques con rodapié y muebles
export function amueblar(s, PLANO) {
  const G = new THREE.Group(); s.add(G);
  for (const e of PLANO.estancias) { const [x0, y0, x1, y1] = e.r; const t = SUELO[e.tipo] || 'piedra'; const f = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, y1 - y0), matSuelo(t, x1 - x0, y1 - y0)); f.position.set((x0 + x1) / 2, (y0 + y1) / 2, 0.05); f.receiveShadow = true; G.add(f); }
  const muro = pbr(0xf4f2ed, { roughness: 0.85 }), canto = pbr(0x5a6168, { roughness: 0.7 }), rodapie = pbr(0xe8e4dc, { roughness: 0.5 });
  for (const [x0, y0, x1, y1] of PLANO.muros) {
    const L = Math.hypot(x1 - x0, y1 - y0) + 10, a = Math.atan2(y1 - y0, x1 - x0), mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
    const w = m3(B(L, 10, PLANO.alto), muro, G, mx, my, PLANO.alto / 2); w.rotation.z = a;
    const t = m3(B(L, 10.5, 1), canto, G, mx, my, PLANO.alto + 0.5); t.rotation.z = a;
    const r = m3(B(L - 10, 11.4, 8), rodapie, G, mx, my, 4); r.rotation.z = a; r.castShadow = false;
  }
  for (const f of PLANO.muebles) mueble(G, f);
  // puerta de la calle con su marco y manilla
  const pc = PLANO.puertaCalle; const pu = new THREE.Group(); pu.position.set(-4, pc.y, 0); G.add(pu);
  bx(pu, 5, pc.ancho - 6, 205, pbr(0x6b4a2b, { roughness: 0.5 }), 0, 0, 0); for (const sy of [-1, 1]) bx(pu, 7, 4, 210, pbr(0xe8e4dc), 0, sy * (pc.ancho / 2 - 1), 0); bx(pu, 7, pc.ancho, 4, pbr(0xe8e4dc), 0, 0, 208);
  m3(new THREE.CylinderGeometry(1.3, 1.3, 9, 10), INOX(), pu, 4, pc.ancho / 2 - 12, 105).rotation.z = Math.PI / 2;
  return G;
}
// Luz de día: sol con sombra suave sobre la planta (z hacia arriba)
export function luzCasa(s, PLANO) {
  s.add(new THREE.HemisphereLight(0xffffff, 0xb9bec6, 1.25));
  const d = new THREE.DirectionalLight(0xfff4e4, 1.9); d.position.set(PLANO.w * 0.15 - 250, -350, 900); d.target.position.set(PLANO.w / 2, PLANO.h / 2, 0); s.add(d, d.target);
  d.castShadow = !Q().baja; Object.assign(d.shadow.camera, { left: -520, right: 520, top: 560, bottom: -560, near: 200, far: 2200 }); d.shadow.mapSize.set(2048, 2048); d.shadow.bias = -0.0006; d.shadow.normalBias = 0.6; d.shadow.radius = 4;
  const r = new THREE.DirectionalLight(0xdfe8ff, 0.45); r.position.set(PLANO.w + 400, PLANO.h + 300, 600); s.add(r);
  return d;
}

// ---------------------------------------------------------------- puntos de la instalación
const BLANCO = () => pbr(0xf8f8f5, { roughness: 0.3, clearcoat: 0.4 });
const S = 1.6; // los mecanismos se dibujan a escala ×1,6 para que se lean en la planta
// placa extruida hacia la estancia (local +y) desde la cara del tabique (y = 1); devuelve la y de su frente
function placa(g, w, h, mat, hueco = null, grosor = 0.8 * S) {
  const sh = rectRedondo(w, h, 0.9 * S); if (hueco) { const p = new THREE.Path(); if (hueco.r) p.absarc(0, 0, hueco.r, 0, Math.PI * 2, true); else p.curves = rectRedondo(hueco.w, hueco.h, 0.6).curves; sh.holes.push(p); }
  const o = m3(new THREE.ExtrudeGeometry(sh, { depth: grosor, bevelEnabled: true, bevelThickness: 0.2, bevelSize: 0.2, bevelSegments: 2, curveSegments: 14 }), mat, g, 0, 1.2, 0); o.rotation.x = -Math.PI / 2;
  return 1.2 + grosor + 0.2;
}
const enPared = (o) => { o.rotation.x = -Math.PI / 2; return o; }; // de plano XY a la pared (normal +y)
// nx, ny: normal de la pared (hacia la estancia)
export function puntoCasa(p, T, { colorCirc = 0x8a8f94, on = false, sel = false, nx = 0, ny = 1 } = {}) {
  const g = new THREE.Group(); g.position.set(p.x, p.y, T.h); g.rotation.z = Math.atan2(ny, nx) - Math.PI / 2; // local +y = hacia la estancia
  const mSel = sel ? pbr(0x2b7bff, { roughness: 0.4, emissive: 0x1144aa, emissiveIntensity: 0.4 }) : null;
  if (p.tipo.startsWith('base')) { // base Schuko: pozo con los dos alvéolos y los contactos de tierra arriba y abajo
    const yF = placa(g, 8.1 * S, 8.1 * S, mSel || (p.tipo === 'base25' ? pbr(0xe9e2d4, { roughness: 0.35, clearcoat: 0.4 }) : BLANCO()), { r: 1.95 * S });
    m3(new THREE.CylinderGeometry(1.95 * S, 1.95 * S, 1.2 * S, 28, 1, true), pbr(0xe4e2dc, { roughness: 0.6, side: THREE.DoubleSide }), g, 0, yF - 0.6 * S, 0);
    const yB = yF - 1.2 * S; enPared(m3(new THREE.CircleGeometry(1.95 * S, 28), pbr(0xdcdad3, { roughness: 0.6 }), g, 0, yB, 0));
    for (const sx of [-0.95, 0.95]) enPared(m3(new THREE.CircleGeometry(0.32 * S, 14), pbr(0x121314, { roughness: 1 }), g, sx * S, yB + 0.03, 0));
    for (const sz of [-1, 1]) m3(B(1.1 * S, 0.9 * S, 0.14 * S), pbr(0xc4c8ce, { metalness: 0.9, roughness: 0.3 }), g, 0, yB + 0.45 * S, sz * 1.86 * S);
    m3(B(2.2 * S, 0.1, 0.45 * S), pbr(colorCirc, { roughness: 0.5 }), g, 0, yF + 0.02, -3.25 * S); // tira del color del circuito
  } else if (p.tipo === 'interruptor' || p.tipo === 'conmutador' || p.tipo === 'pulsador' || p.tipo === 'timbre') {
    const yF = placa(g, 8.1 * S, 8.1 * S, mSel || BLANCO(), { w: 5 * S, h: 5 * S });
    m3(B(5 * S, 1.0, 5 * S), pbr(0xd9d7d0, { roughness: 0.6 }), g, 0, yF - 0.9, 0);
    const tecla = new THREE.ExtrudeGeometry(rectRedondo(4.6 * S, 4.6 * S, 0.5 * S), { depth: 0.4 * S, bevelEnabled: true, bevelThickness: 0.25, bevelSize: 0.2, bevelSegments: 3 });
    const t = enPared(m3(tecla, mSel || BLANCO(), g, 0, yF - 0.5, 0)); t.rotation.x = -Math.PI / 2 + (on ? 0.07 : -0.07);
    if (p.tipo === 'timbre') { const c = m3(new THREE.CylinderGeometry(0.7 * S, 0.7 * S, 0.1, 18), pbr(0xffc24a, { roughness: 0.4, emissive: 0xff9a00, emissiveIntensity: 0.3 }), g, 0, yF + 0.45 * S, 0); void c; }
    else m3(B(2.2 * S, 0.1, 0.12 * S), pbr(on ? 0x2f9e44 : 0x8d949a, { roughness: 0.5 }), g, 0, yF + 0.5 * S, (on ? -1.6 : 1.6) * S);
    if (p.tipo === 'conmutador') for (const sz of [-1, 1]) m3(B(0.9 * S, 0.1, 0.1 * S), pbr(0x8d949a), g, 0, yF + 0.5 * S, sz * 0.6 * S);
  } else if (p.tipo === 'caja') { // caja de registro empotrada: tapa gris con 4 tornillos
    const yF = placa(g, 14, 14, mSel || pbr(0xb9bec3, { roughness: 0.6 }), null, 0.8);
    for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) m3(new THREE.CylinderGeometry(0.6, 0.6, 0.3, 10), pbr(0x9aa0a6, { metalness: 0.8, roughness: 0.3 }), g, sx * 5.6, yF + 0.1, sz * 5.6);
  } else placa(g, 8.1 * S, 8.1 * S, mSel || BLANCO());
  return g;
}
// Plafón de techo con portalámparas y bombilla (z = alto del techo)
export function luzTecho(p, alto, { on = false, sel = false } = {}) {
  const g = new THREE.Group(); g.position.set(p.x, p.y, alto);
  m3(new THREE.CylinderGeometry(6, 7, 2.4, 24).rotateX(Math.PI / 2), sel ? pbr(0x2b7bff, { roughness: 0.4 }) : BLANCO(), g, 0, 0, -1.2);
  m3(new THREE.CylinderGeometry(0.35, 0.35, 8, 6).rotateX(Math.PI / 2), pbr(0x1d1f21, { roughness: 0.6 }), g, 0, 0, -6);
  m3(new THREE.CylinderGeometry(2.2, 2.6, 5, 16).rotateX(Math.PI / 2), pbr(0xf3f2ee, { roughness: 0.4 }), g, 0, 0, -12);
  const b = m3(new THREE.SphereGeometry(5.5, 20, 14), new THREE.MeshStandardMaterial({ color: sel ? 0x7fb2ff : on ? 0xfff1a8 : 0xf2efe6, emissive: 0xffc93a, emissiveIntensity: on ? 1.5 : 0, roughness: 0.25 }), g, 0, 0, -20);
  b.scale.set(1, 1, 1.2); b.castShadow = false; return g;
}
// Cuadro empotrado: marco blanco, ventana ahumada y la aparamenta DIN detrás (IGA, diferencial y PIAs)
export function cuadroCasa(c, sel, nx = 1, ny = 0) {
  const g = new THREE.Group(); g.position.set(c.x, c.y, 180); g.rotation.z = Math.atan2(ny, nx) - Math.PI / 2;
  const yF = placa(g, 34, 30, sel ? pbr(0x7fb2ff, { roughness: 0.4 }) : BLANCO(), { w: 27, h: 13 }, 4);
  m3(B(30, 0.6, 26), pbr(0x3b4046, { roughness: 0.7 }), g, 0, 1.4, 0); // fondo
  m3(B(28, 0.8, 2.6), pbr(0xb4bac0, { metalness: 0.8, roughness: 0.35 }), g, 0, 1.9, 0); // carril DIN
  const anchos = [2, 2, 1, 1, 1, 1, 1]; let x = -12.6;
  anchos.forEach((n, i) => { const w = 1.75 * n - 0.1; m3(B(w, 3.4, 9), pbr(0xf1f1ed, { roughness: 0.45 }), g, x + w / 2, 3.6, 0); m3(B(Math.min(1.2, w * 0.6), 1.4, 2), pbr(i === 1 ? 0x1f5fd6 : 0x2b2b2b, { roughness: 0.4 }), g, x + w / 2, 5.6, 0.8); x += 1.75 * n + 0.6; });
  const v = m3(B(27, 0.3, 13), pbr(0x9fb3c2, { roughness: 0.05, transparent: true, opacity: 0.3, metalness: 0.2 }), g, 0, yF - 0.6, 0); v.castShadow = false;
  return g;
}

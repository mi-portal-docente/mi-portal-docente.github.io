// Polímetro digital compartido por los laboratorios: el de Circuitos (escala 1 = 2,54 mm, eje Y hacia arriba)
// y el multímetro del kit de herramientas (cm). Funda de goma, pantalla LCD, rueda estriada con anillo de
// escalas, bornes de 4 mm con collar, puntas de prueba con guarda y clavijas banana con funda de seguridad.
import * as THREE from 'three';
import { PM, cajaR, tornoY, texCanvas, LATON, NIQUEL, SEG, G, mesh, texC, placa } from '../circ/detalle.js';
import { pbr, malla, calidad } from './base.js';

// ---------------------------------------------------------------- polímetro digital
export function polimetro(p, drawMeter) {
  const goma = PM(0xf0b02a, { roughness: 0.78 });
  cajaR(14, 2.5, 24, 1.8, goma, 0, 0, 0, p, 0.45);                        // funda de goma
  cajaR(12.2, 0.4, 22.0, 1.2, PM(0x2a2e34, { roughness: 0.55 }), 0, 2.2, 0, p, 0.1); // frontal
  cajaR(11.0, 0.3, 5.6, 0.45, PM(0x0e0f11, { roughness: 0.15, clearcoat: 1, clearcoatRoughness: 0.05 }), 0, 2.45, -6.9, p, 0.06); // marco de la pantalla
  const disp = texCanvas(256, 110, (g) => drawMeter(g, '', ''));
  placa(p, 10, 4.3, disp, 0, 2.77, -6.9, { rough: 0.25 });
  // botones HOLD y luz
  for (const [x, t] of [[-3.2, 'HOLD'], [0, 'MAX'], [3.2, 'LUZ']]) {
    cajaR(2.3, 0.45, 1.0, 0.35, PM(0x3b4048, { roughness: 0.5 }), x, 2.5, -3.6, p, 0.08);
    placa(p, 2.0, 0.8, texC('btn|' + t, 128, 48, (c) => { c.fillStyle = '#e6e9ee'; c.font = '700 28px Arial'; c.textAlign = 'center'; c.fillText(t, 64, 34); }), x, 2.97, -3.6);
  }
  // anillo de escalas impreso alrededor de la rueda
  const esc = texC('polEsc', 512, 512, (c) => {
    const C = 256; c.lineCap = 'round';
    const sect = [[-170, -110, '#f0b02a', 'OFF'], [-100, -20, '#ffffff', 'V'], [-10, 70, '#7fd3ff', 'A'], [80, 140, '#9ae6a0', 'Ω'], [150, 180, '#ff9a9a', '·)))']];
    for (const [a0, a1, col] of sect) { c.strokeStyle = col; c.lineWidth = 6; c.beginPath(); c.arc(C, C, 168, a0 * Math.PI / 180, a1 * Math.PI / 180); c.stroke(); for (let a = a0; a <= a1; a += 10) { const r = a * Math.PI / 180; c.lineWidth = 3; c.beginPath(); c.moveTo(C + Math.cos(r) * 176, C + Math.sin(r) * 176); c.lineTo(C + Math.cos(r) * 190, C + Math.sin(r) * 190); c.stroke(); } }
    c.fillStyle = '#f2f2f2'; c.font = '800 46px Arial'; c.textAlign = 'center'; c.textBaseline = 'middle';
    for (const [t, a] of [['OFF', -150], ['V⎓', -60], ['A⎓', 30], ['Ω', 120], ['·)))', 165]]) { const r = a * Math.PI / 180; c.fillText(t, C + Math.cos(r) * 222, C + Math.sin(r) * 222); }
  });
  placa(p, 11.4, 11.4, esc, 0, 2.62, 1.5);
  const dial = new THREE.Group(); dial.position.set(0, 2.5, 1.5); p.add(dial);
  const rueda = G('polRueda|' + SEG(), () => { const g = tornoY([[0, 0], [2.7, 0], [2.75, 0.1], [2.75, 0.55], [2.55, 0.75], [1.2, 0.85], [0, 0.85]], 48); const P = g.attributes.position; for (let i = 0; i < P.count; i++) { const x = P.getX(i), z = P.getZ(i), r = Math.hypot(x, z); if (r > 2.5) { const a = Math.atan2(z, x); const f = 1 + 0.025 * Math.cos(a * 24); P.setX(i, x * f); P.setZ(i, z * f); } } g.computeVertexNormals(); return g; });
  mesh(rueda, PM(0x1b1c1f, { roughness: 0.45 }), 0, 0, 0, dial);
  mesh(G('polAsa', () => new THREE.BoxGeometry(0.9, 0.7, 5.0)), PM(0x23252a, { roughness: 0.4 }), 0, 0.95, 0, dial);
  mesh(G('polFlecha', () => new THREE.BoxGeometry(0.22, 0.05, 1.8)), PM(0xffffff, { roughness: 0.4 }), 0, 1.31, -1.55, dial).castShadow = false;
  // bornes: anillo metálico, collar de color y agujero de 4 mm
  for (const [x, c] of [[-3.6, 0x111111], [0, 0xd42a2a], [3.6, 0xd42a2a]]) {
    mesh(G('polBorne', () => tornoY([[0.42, 0], [0.95, 0], [0.98, 0.1], [0.98, 0.42], [0.82, 0.5], [0.42, 0.5]])), PM(c, { roughness: 0.35, clearcoat: 0.4 }), x, 2.4, 9.4, p);
    mesh(G('polAnillo', () => new THREE.CylinderGeometry(0.44, 0.44, 0.52, 16, 1, true)), LATON(), x, 2.66, 9.4, p).castShadow = false;
    mesh(G('polHueco', () => new THREE.CircleGeometry(0.42, 16).rotateX(-Math.PI / 2)), PM(0x050505, { roughness: 1 }), x, 2.6, 9.4, p).castShadow = false;
  }
  placa(p, 13.5, 1.9, texC('polBornes', 256, 48, (g) => { g.fillStyle = '#f2f2f2'; g.font = '700 22px Arial'; g.textAlign = 'center'; g.fillText('COM', 62, 34); g.fillText('VΩmA', 128, 34); g.fillText('10A', 194, 34); }), 0, 2.62, 7.6);
  placa(p, 8.6, 1.0, texC('polMarca', 256, 32, (g) => { g.fillStyle = '#c9ced6'; g.font = '700 20px Arial'; g.textAlign = 'center'; g.fillText('POLÍMETRO DIGITAL', 128, 23); }), 0, 2.62, -10.3); // rótulo entre el borde y la pantalla (sin taparse)
  placa(p, 3.0, 0.95, texC('polCat', 128, 40, (g) => { g.strokeStyle = '#f0b02a'; g.lineWidth = 3; g.strokeRect(3, 3, 122, 34); g.fillStyle = '#f0b02a'; g.font = '700 20px Arial'; g.textAlign = 'center'; g.fillText('CAT III 600V', 64, 27); }), 0, 2.62, 10.75);
  return { dial, disp };
}
// Punta de prueba: aguja, guarda para los dedos, empuñadura con estrías y funda trasera
export function punta(color) {
  const g = new THREE.Group();
  mesh(G('ptAguja', () => tornoY([[0, -0.32], [0.05, -0.2], [0.07, 0.0], [0.07, 1.0]], 10)), NIQUEL(), 0, 0, 0, g);
  const pm = PM(color, { roughness: 0.42, clearcoat: 0.3 });
  mesh(G('ptCuerpo|' + SEG(), () => { const pr = [[0.07, 0.95], [0.2, 1.0], [0.24, 1.3], [0.52, 1.35], [0.55, 1.55], [0.3, 1.62]]; for (let i = 0; i <= 12; i++) pr.push([0.3 + (i % 2 ? 0.03 : 0), 1.7 + i * 0.22]); pr.push([0.36, 4.4], [0.4, 4.7], [0.36, 5.2], [0.18, 5.3], [0, 5.3]); return tornoY(pr, 18); }), pm, 0, 0, 0, g);
  const hit = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 6, 8), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })); hit.position.y = 2.5; g.add(hit);
  return g;
}


// ---------------------------------------------------------------- multímetro con puntas de prueba
function pantallaLCD(texto) {
  const c = document.createElement('canvas'); c.width = 256; c.height = 112; const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const pintar = (s) => { const g = c.getContext('2d'); g.fillStyle = '#b9c9a5'; g.fillRect(0, 0, 256, 112); g.fillStyle = 'rgba(0,0,0,0.08)'; g.font = 'bold 72px monospace'; g.textAlign = 'right'; g.fillText('88.88', 244, 82); g.fillStyle = '#1b2318'; g.fillText(String(s).slice(0, 6), 244, 82); g.font = 'bold 20px monospace'; g.textAlign = 'left'; g.fillText('AUTO', 10, 24); t.needsUpdate = true; };
  pintar(texto); return { t, pintar };
}
export function multimetro({ conPuntas = true, lectura = '0.00' } = {}) {
  // Mismo modelo detallado que el polímetro del laboratorio de Circuitos (funda de goma, rueda estriada,
  // anillo de escalas, bornes de 4 mm), escalado a cm: ≈ 10 × 17 × 3,8 cm.
  const G = new THREE.Group(); G.userData.id = 'multimetro';
  const cuerpo = new THREE.Group(); cuerpo.scale.set(0.72, 1.5, 0.72); cuerpo.position.set(0, 0, 9.25); G.add(cuerpo);
  const L = pantallaLCD(lectura);
  const { dial, disp } = polimetro(cuerpo, () => {});
  disp.image = L.t.image; disp.needsUpdate = true; // la pantalla usa el lienzo de pantallaLCD
  const pintar = (s) => { L.pintar(s); disp.needsUpdate = true; };
  let lcd = null; cuerpo.traverse((o) => { if (o.isMesh && o.material?.map === disp) lcd = o; });
  if (conPuntas) {
    for (const [x, c, dz] of [[-2.6, 0x111111, -3], [0, 0xd62828, 3]]) {
      const cur = new THREE.CatmullRomCurve3([new THREE.Vector3(x, 6.2, 16), new THREE.Vector3(x * 1.2, 6.6, 18), new THREE.Vector3(x * 1.4, 3.6, 21), new THREE.Vector3(x * 2 + 6, 0.5, 24), new THREE.Vector3(14 + dz, 0.5, 18), new THREE.Vector3(16 + dz, 1.0, 9.5)]);
      malla(new THREE.TubeGeometry(cur, calidad().baja ? 24 : 56, 0.2, 10), pbr(c, { roughness: 0.62, sheen: 0.4, sheenRoughness: 0.8, sheenColor: 0x444444 }), G); // cable de silicona
      // clavija banana de 4 mm con funda de seguridad y estrías de agarre, metida en el borne
      malla(tornoY([[0.0, 3.6], [0.42, 3.6], [0.42, 4.1], [0.56, 4.15], [0.62, 4.5], [0.6, 5.6], [0.66, 5.7], [0.6, 5.85], [0.66, 6.0], [0.42, 6.35], [0.24, 6.5], [0.0, 6.5]], 18), pbr(c, { roughness: 0.4, clearcoat: 0.3 }), G, x, 0, 16);
      const pr = punta(c); pr.children.filter((m) => m.material?.opacity === 0).forEach((m) => pr.remove(m)); pr.scale.setScalar(2.4); pr.rotation.x = Math.PI / 2; pr.position.set(16 + dz, 1.35, 9.5 - 5.3 * 2.4); G.add(pr);
    }
  }
  G.userData.partes = { lcd, dial };
  G.userData.leer = pintar;
  G.userData.anim = (t) => { dial.rotation.y = -0.8 + Math.round((t % 4) / 1.3) * 0.6; pintar(['230.4', '229.8', '0.L', '230.1'][Math.floor(t % 4)]); };
  return G;
}


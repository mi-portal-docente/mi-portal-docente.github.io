// Piezas de un ordenador de sobremesa en 3D (unidades: cm, tamaños reales aproximados) para la
// actividad «Anatomía del PC» de TIC. Geometría sencilla con primitivas y rótulos en textura.
import * as THREE from 'three';
import { pbr, MATS, caja, malla, textoTex, cilZ } from './base.js';

const PCB = () => pbr(0x1d5c3a, { roughness: 0.55, clearcoat: 0.4 });
const NEGRO = () => pbr(0x1b1c1f, { roughness: 0.45 });
const ORO = () => pbr(0xd4a63a, { metalness: 1, roughness: 0.3 });
const rotulo = (t, w, h, par, x, y, z, o = {}) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: textoTex(t, { color: o.color || '#ffffff', w: 512, h: 96, font: 'bold 44px system-ui' }), transparent: true })); m.rotation.x = -Math.PI / 2; m.position.set(x, y, z); par.add(m); return m; };
function ventilador(par, d, x, y, z) {
  const g = new THREE.Group(); g.position.set(x, y, z); par.add(g);
  const marco = malla(new THREE.CylinderGeometry(d / 2, d / 2, 0.6, 40, 1, true), NEGRO(), g, 0, 0, 0); marco.material.side = THREE.DoubleSide;
  cilZ(d * 0.14, 0.7, NEGRO(), g, 0, 0, 0).rotation.x = 0;
  for (let i = 0; i < 7; i++) { const a = caja(d * 0.36, 0.08, d * 0.12, pbr(0x2c2e33, { roughness: 0.5 }), g, 0, 0, 0); a.geometry.translate(d * 0.2, 0, 0); a.rotation.y = (i / 7) * Math.PI * 2; a.rotation.x = 0.35; }
  return g;
}
export function placaBase() {
  const g = new THREE.Group();
  caja(30.5, 0.2, 24.4, PCB(), g, 0, 0.1, 0);
  caja(4.4, 0.5, 4.4, pbr(0xc9ccd1, { metalness: 0.7, roughness: 0.35 }), g, -3, 0.35, -4); // zócalo
  for (let i = 0; i < 4; i++) caja(13.5, 0.7, 0.55, NEGRO(), g, 7.5, 0.45, -8 + i * 1.1).rotation.y = Math.PI / 2; // ranuras RAM
  for (let i = 0; i < 3; i++) caja(9, 0.6, 0.6, NEGRO(), g, -4 + i * 0, 0.4, 3 + i * 3); // PCIe
  caja(4, 0.6, 4, pbr(0x50555c, { metalness: 0.6, roughness: 0.4 }), g, 6, 0.4, 8); // chipset
  caja(2.5, 3.5, 16, pbr(0x3a3d42, { metalness: 0.5, roughness: 0.5 }), g, -13.6, 1.8, -3); // panel de E/S
  caja(5, 1.2, 1.5, NEGRO(), g, 13.5, 0.7, 2); // conector ATX 24 pines
  rotulo('PLACA BASE', 8, 1.5, g, -6, 0.22, 10);
  return g;
}
export function procesador() {
  const g = new THREE.Group();
  caja(4.5, 0.15, 4.5, PCB(), g, 0, 0.08, 0);
  caja(3.8, 0.35, 3.8, pbr(0xc6c9ce, { metalness: 0.85, roughness: 0.28 }), g, 0, 0.32, 0);
  rotulo('CPU', 2.4, 0.6, g, 0, 0.51, 0, { color: '#333333' });
  return g;
}
export function memoriaRAM() {
  const g = new THREE.Group();
  caja(13.3, 0.12, 3.1, PCB(), g, 0, 0.06, 0);
  for (let i = 0; i < 8; i++) caja(1.1, 0.18, 0.9, NEGRO(), g, -5.6 + i * 1.6, 0.2, -0.2);
  caja(12.6, 0.13, 0.35, ORO(), g, 0, 0.07, 1.4);
  rotulo('DDR', 1.5, 0.4, g, 5.5, 0.14, 1, { color: '#e8e8e8' });
  return g;
}
export function tarjetaGrafica() {
  const g = new THREE.Group();
  caja(26, 1.6, 11, pbr(0x2b2d31, { roughness: 0.4, metalness: 0.3 }), g, 0, 0.8, 0);
  ventilador(g, 8.5, -6.5, 1.7, 0); ventilador(g, 8.5, 6.5, 1.7, 0);
  caja(1, 1.6, 11.6, pbr(0x9aa0a6, { metalness: 0.8, roughness: 0.3 }), g, -13.4, 0.8, 0); // chapa
  caja(8.5, 0.15, 0.4, ORO(), g, -2, 0.08, 5.8);
  rotulo('GPU', 3, 0.8, g, 0, 1.62, 4.6);
  return g;
}
export function fuenteAlimentacion() {
  const g = new THREE.Group();
  caja(15, 8.6, 14, pbr(0x2e3034, { metalness: 0.5, roughness: 0.45 }), g, 0, 4.3, 0);
  const f = ventilador(g, 11, 0, 8.65, 0); void f;
  for (let i = 0; i < 6; i++) { const c = cilZ(0.45, 10, pbr([0x202020, 0xd8c33a, 0xc41e1e][i % 3], { roughness: 0.6 }), g, -5 + i * 2, 1.2, 12); c.rotation.x = Math.PI / 2; }
  rotulo('FUENTE 650 W', 7, 1.2, g, 0, 8.62, 6.2);
  return g;
}
export function discoSSD() {
  const g = new THREE.Group();
  caja(10, 0.7, 7, pbr(0x40444a, { metalness: 0.6, roughness: 0.35 }), g, 0, 0.35, 0);
  caja(7, 0.02, 4, pbr(0x111111, { roughness: 0.6 }), g, 0, 0.71, 0);
  rotulo('SSD 1 TB', 4.5, 0.9, g, 0, 0.73, 0);
  return g;
}
export function discoDuro() {
  const g = new THREE.Group();
  caja(14.7, 2.6, 10.2, pbr(0xb9bec4, { metalness: 0.8, roughness: 0.32 }), g, 0, 1.3, 0);
  caja(9, 0.02, 6, pbr(0xf1f1f1, { roughness: 0.8 }), g, -1.5, 2.61, 0);
  caja(8, 0.2, 9.6, PCB(), g, 0, 0.0, 0);
  rotulo('HDD 2 TB', 6, 1.2, g, -1.5, 2.63, 0, { color: '#222222' });
  return g;
}
export function disipadorCPU() {
  const g = new THREE.Group();
  caja(4, 0.5, 4, pbr(0xc07a3a, { metalness: 0.9, roughness: 0.3 }), g, 0, 0.25, 0);
  for (let i = 0; i < 14; i++) caja(12, 0.12, 6, MATS.aluminio ? MATS.aluminio() : pbr(0xd6d9dd, { metalness: 0.9, roughness: 0.3 }), g, 0, 1 + i * 0.45, 0);
  const v = ventilador(g, 11, 0, 4.5, 3.4); v.rotation.x = Math.PI / 2;
  return g;
}
export function m2() {
  const g = new THREE.Group();
  caja(8, 0.12, 2.2, PCB(), g, 0, 0.06, 0);
  for (let i = 0; i < 3; i++) caja(1.6, 0.15, 1.4, NEGRO(), g, -2.4 + i * 2, 0.16, 0);
  caja(0.6, 0.13, 1.8, ORO(), g, 3.8, 0.07, 0);
  return g;
}

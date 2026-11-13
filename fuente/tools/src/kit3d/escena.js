// Escena de estudio común a todos los laboratorios 3D: la misma luz, los mismos materiales y el mismo
// «tacto» de cámara que el laboratorio ESP32 (que es la referencia). Sin texturas externas.
//   estudio(renderer, scene, o)   tono ACES, luz de cielo + principal con sombra suave + relleno + contraluz,
//                                 entorno de reflejos suave para los metales y, si se pide, suelo que solo
//                                 recibe sombra.
//   camaraSuave(controls, o)      amortiguación, límites, zoom hacia el cursor y paneo en pantalla.
//   volar(camera, controls, pos, target, ms)   transición de cámara suavizada (sin saltos).
//   esBaja()                      equipo modesto (Chromebook / poca memoria) → menos sombras y segmentos.
import * as THREE from 'three';
import { calidad, entorno } from './base.js';

export const esBaja = () => { try { return calidad().baja; } catch (e) { return false; } };

// Parámetros de referencia (laboratorio ESP32: scene.js)
export const REF = {
  exposicion: 1.05, cielo: [0xffffff, 0xb9bec6, 1.5], principal: 2.2, relleno: 0.6, contra: 0.35,
  amortiguacion: 0.12, rotacion: 0.85, zoom: 1.0, polarMax: Math.PI * 0.49, sombraSuelo: 0.16,
};

export function estudio(renderer, scene, o = {}) {
  const baja = o.baja ?? esBaja();
  const R = o.escala || 1;           // tamaño típico de la escena (en las unidades del laboratorio)
  if (renderer) {
    renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = o.exposicion ?? REF.exposicion;
    if (o.sombras !== false) { renderer.shadowMap.enabled = !baja || !!o.sombrasSiempre; renderer.shadowMap.type = THREE.PCFSoftShadowMap; }
  }
  if (o.fondo != null) scene.background = new THREE.Color(o.fondo);
  if (renderer && o.entorno !== false) entorno(renderer, scene, o.entorno ?? 0.42);
  if (renderer) renderer.toneMappingExposure = o.exposicion ?? REF.exposicion;
  const L = new THREE.Group(); L.name = 'luces-estudio'; scene.add(L);
  const [c0, c1, ci] = REF.cielo;
  const cielo = new THREE.HemisphereLight(o.cielo ?? c0, o.suelo ?? c1, (o.intCielo ?? ci) * (o.entorno === false ? 1 : 0.75)); L.add(cielo);
  const dir = o.dir ? new THREE.Vector3(...o.dir).normalize() : new THREE.Vector3(-120, 300, 180).normalize();
  const key = new THREE.DirectionalLight(o.colorPrincipal ?? 0xfffaf2, o.intPrincipal ?? REF.principal);
  key.position.copy(dir).multiplyScalar(R * 3); key.castShadow = o.sombras !== false && (!baja || !!o.sombrasSiempre);
  const ms = baja ? 1024 : (o.mapa || 2048); key.shadow.mapSize.set(ms, ms);
  const sc = key.shadow.camera; const S = o.sombraR ?? R * 1.2; Object.assign(sc, { left: -S, right: S, top: S, bottom: -S, near: R * 0.1, far: R * 7 });
  key.shadow.bias = o.bias ?? -0.0006; key.shadow.normalBias = o.normalBias ?? 0.02; key.shadow.radius = 4;
  if (o.objetivo) { key.target.position.set(...o.objetivo); key.position.add(key.target.position); }
  L.add(key, key.target);
  const fill = new THREE.DirectionalLight(0xeaf2ff, o.intRelleno ?? REF.relleno); fill.position.set(R * 1.4, R * 0.8, -R * 0.7); L.add(fill);
  const rim = new THREE.DirectionalLight(0xffffff, o.intContra ?? REF.contra); rim.position.set(R * 0.2, R * 0.6, -R * 2); L.add(rim);
  let suelo = null;
  if (o.sueloSombra) {
    suelo = new THREE.Mesh(new THREE.PlaneGeometry(R * 30, R * 30), new THREE.ShadowMaterial({ opacity: o.sombraOpacidad ?? REF.sombraSuelo }));
    suelo.rotation.x = -Math.PI / 2; suelo.position.y = o.sueloY ?? -0.01; suelo.receiveShadow = true; suelo.name = 'suelo-sombra'; scene.add(suelo);
  }
  return { grupo: L, cielo, principal: key, relleno: fill, contra: rim, suelo, baja };
}

// El mismo tacto de órbita que la placa ESP32: inercia suave, giro algo más lento que el de serie,
// zoom hacia el punto que se señala, paneo en el plano de la pantalla y sin pasar por debajo de la mesa.
export function camaraSuave(c, o = {}) {
  c.enableDamping = true; c.dampingFactor = o.amortiguacion ?? REF.amortiguacion;
  c.rotateSpeed = o.rotacion ?? REF.rotacion; c.zoomSpeed = o.zoom ?? REF.zoom; c.panSpeed = o.paneo ?? 0.9;
  c.screenSpacePanning = true; if ('zoomToCursor' in c && o.zoomCursor !== false) c.zoomToCursor = true;
  if (o.polarMax !== false) c.maxPolarAngle = o.polarMax ?? REF.polarMax;
  if (o.min != null) c.minDistance = o.min; if (o.max != null) c.maxDistance = o.max;
  if (o.minZoom != null) c.minZoom = o.minZoom; if (o.maxZoom != null) c.maxZoom = o.maxZoom;
  return c;
}

// Transición suave de cámara (cúbica de salida). Devuelve una promesa; una nueva transición cancela la anterior.
const vuelos = new WeakMap();
const suav = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : 1 - Math.pow(1 - t, 3));
export function volar(camera, controls, pos, target, ms = 650) {
  const prev = vuelos.get(camera); if (prev) prev.cancel = true;
  const p0 = camera.position.clone(), t0 = controls.target.clone(); const p1 = pos.clone(), t1 = target.clone();
  if (ms <= 0 || typeof requestAnimationFrame === 'undefined') { camera.position.copy(p1); controls.target.copy(t1); controls.update(); return Promise.resolve(); }
  const job = { cancel: false }; vuelos.set(camera, job); const ini = performance.now();
  return new Promise((res) => {
    const paso = () => {
      if (job.cancel) return res();
      const e = suav((performance.now() - ini) / ms);
      camera.position.lerpVectors(p0, p1, e); controls.target.lerpVectors(t0, t1, e); controls.update();
      if (e < 1) requestAnimationFrame(paso); else { vuelos.delete(camera); res(); }
    };
    requestAnimationFrame(paso);
  });
}
// Si el usuario empieza a mover la cámara, se cancela cualquier vuelo en curso.
export function cancelarVuelo(camera) { const j = vuelos.get(camera); if (j) j.cancel = true; }

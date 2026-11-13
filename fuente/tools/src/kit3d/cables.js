// Cables y canalización en 3D (compartidos): conductor unipolar H07V-K (flexible, se ven las hebras al pelarlo)
// y H07V-U (rígido), mangueras RV-K y H05VV-F 3G con su cubierta, tubo corrugado, rollos de cable, corte de
// una sección y clavija Schuko con prensacables. Medidas reales (fichas técnicas H07V-K), en cm.
import * as THREE from 'three';
import { pbr, MATS, malla, caja, cilX, cilZ, torno, tex, calidad, bloqueRedondo, textoTex } from './base.js';

export const COLOR_COND = { marron: '#6e3f1f', negro: '#1c1c1c', gris: '#8f969c', azul: '#2a6fd8', tierra: '#f2d21b', blanco: '#f3f3f0', rojo: '#c81e1e' };
export const NOMBRE_COLOR = { marron: 'Marrón', negro: 'Negro', gris: 'Gris', azul: 'Azul', tierra: 'Amarillo-verde' };
// Diámetro exterior (mm) y nº de hebras del conductor clase 5 (H07V-K)
export const FICHA_COND = { 1.5: { d: 2.9, hebras: 29 }, 2.5: { d: 3.6, hebras: 48 }, 4: { d: 4.2, hebras: 53 }, 6: { d: 4.8, hebras: 80 } };
export const rCobre = (sec) => Math.sqrt((4 * sec) / Math.PI) / 2 / 10; // cm
export const rCable = (sec) => (FICHA_COND[sec]?.d || 3.6) / 2 / 10;
const fmt = (s) => String(s).replace('.', ',');

// ---------------------------------------------------------------- texturas del aislamiento (rotulado continuo)
export function aislTex(color, sec, tipo) {
  const txt = `H07V-${tipo} 1x${fmt(sec)} mm²  450/750 V  Eca  ◇  `;
  return tex(`aisl|${color}|${sec}|${tipo}`, 1024, 64, (g, w, h) => {
    if (color === 'tierra') { g.fillStyle = '#f2d21b'; g.fillRect(0, 0, w, h); g.fillStyle = '#1f9a3a'; g.fillRect(0, 0, w, h * 0.2); g.fillRect(0, h * 0.42, w, h * 0.22); }
    else { g.fillStyle = COLOR_COND[color] || color; g.fillRect(0, 0, w, h); }
    // brillo del PVC
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(255,255,255,0.0)'); gr.addColorStop(0.75, 'rgba(255,255,255,0.10)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.fillStyle = color === 'blanco' || color === 'tierra' || color === 'gris' ? 'rgba(20,20,20,0.75)' : 'rgba(255,255,255,0.78)'; g.font = 'bold 22px system-ui, sans-serif'; g.textBaseline = 'middle';
    g.fillText(txt + txt, 6, h * 0.82);
  }, { rep: [1, 1] });
}
function cubiertaTex(tipo, sec, color) {
  const txt = tipo === 'RV-K' ? `RV-K 0,6/1 kV 3G${fmt(sec)}  ◇  ` : `H05VV-F 3G${fmt(sec)} 300/500 V  ◇  `;
  return tex(`cub|${tipo}|${sec}|${color}`, 1024, 64, (g, w, h) => {
    g.fillStyle = color; g.fillRect(0, 0, w, h); const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0.6, 'rgba(255,255,255,0.12)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.fillStyle = color === '#151617' ? 'rgba(255,255,255,0.8)' : 'rgba(30,30,30,0.75)'; g.font = 'bold 22px system-ui, sans-serif'; g.textBaseline = 'middle'; g.fillText(txt + txt, 6, h * 0.8);
  });
}
function aislMat(color, sec, tipo, len) { const t = aislTex(color, sec, tipo).clone(); t.wrapS = THREE.RepeatWrapping; t.repeat.set(Math.max(1, len / 9), 1); t.needsUpdate = true; return new THREE.MeshPhysicalMaterial({ map: t, roughness: 0.38, clearcoat: 0.35, clearcoatRoughness: 0.35 }); }
// Cara del corte: anillo de aislante + cobre con las hebras dibujadas
function caraTex(sec, tipo, color) {
  return tex(`cara|${sec}|${tipo}|${color}`, 256, 256, (g, w, h) => {
    const R = w / 2, rc = R * (rCobre(sec) / rCable(sec)); g.fillStyle = color === 'tierra' ? '#f2d21b' : COLOR_COND[color]; g.beginPath(); g.arc(R, R, R, 0, Math.PI * 2); g.fill();
    if (color === 'tierra') { g.fillStyle = '#1f9a3a'; g.beginPath(); g.arc(R, R, R, 0.3, 2.2); g.lineTo(R, R); g.fill(); }
    g.fillStyle = '#7a4a1f'; g.beginPath(); g.arc(R, R, rc, 0, Math.PI * 2); g.fill();
    if (tipo === 'U') { const gr = g.createRadialGradient(R - rc * 0.3, R - rc * 0.3, 2, R, R, rc); gr.addColorStop(0, '#f6c08a'); gr.addColorStop(1, '#c0703a'); g.fillStyle = gr; g.beginPath(); g.arc(R, R, rc * 0.98, 0, Math.PI * 2); g.fill(); return; }
    const n = FICHA_COND[sec]?.hebras || 30; const rs = rc * Math.sqrt(0.78 / n);
    let k = 0; for (let ring = 0; k < n; ring++) { const rr = ring * rs * 2; const m = ring === 0 ? 1 : Math.floor((2 * Math.PI * rr) / (rs * 2)); for (let i = 0; i < m && k < n; i++, k++) { const a = (i / m) * Math.PI * 2 + ring; const x = R + Math.cos(a) * rr, y = R + Math.sin(a) * rr; if (Math.hypot(x - R, y - R) + rs > rc) continue; const gr = g.createRadialGradient(x - rs * 0.3, y - rs * 0.3, 0.5, x, y, rs); gr.addColorStop(0, '#ffd2a0'); gr.addColorStop(1, '#b8652e'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, rs * 0.95, 0, Math.PI * 2); g.fill(); } }
  });
}

// ---------------------------------------------------------------- hebras de cobre (InstancedMesh)
// Conductor clase 5: las hebras van cableadas en hélice (paso ≈ 16 mm) y se abren un poco en la punta.
// Una geometría helicoidal por corona; cada hebra de la corona es la misma hélice girada sobre el eje X.
const PASO_HEBRA = 1.6; // cm
function heliceGeo(rf, rs, largo, abierto, rc) {
  const n = Math.max(6, Math.round(largo / 0.12)); const pts = [];
  for (let i = 0; i <= n; i++) { const x = (i / n) * largo; const t = x / largo; const r = rf * (1 + abierto * 4 * t * t * (rf / rc)); const a = (x / PASO_HEBRA) * Math.PI * 2; pts.push(new THREE.Vector3(x, Math.sin(a) * r, Math.cos(a) * r)); }
  const g = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), n, rs, 5, false); return g;
}
function hebras(sec, largo, abierto = 0.06) {
  const rc = rCobre(sec); const n = Math.min(FICHA_COND[sec]?.hebras || 30, calidad().hebras); const rs = rc * Math.sqrt(0.8 / n) * 1.05;
  const G = new THREE.Group(); G.userData.tipo = 'hebras';
  const M = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), S = new THREE.Vector3(1, 1, 1), X = new THREE.Vector3(1, 0, 0);
  let k = 0; for (let ring = 0; k < n; ring++) { const rr = ring * rs * 2; const m = ring === 0 ? 1 : Math.max(1, Math.floor((2 * Math.PI * rr) / (rs * 2.05))); const cnt = Math.min(m, n - k); const rf = Math.min(rr, rc - rs);
    const geo = ring === 0 ? new THREE.CylinderGeometry(rs, rs, largo, 6).rotateZ(-Math.PI / 2).translate(largo / 2, 0, 0) : heliceGeo(rf, rs, largo, abierto, rc);
    const im = new THREE.InstancedMesh(geo, MATS.cobre(), cnt); im.castShadow = true;
    for (let i = 0; i < cnt; i++) { q.setFromAxisAngle(X, (i / m) * Math.PI * 2 + ring * 0.7); M.compose(p, q, S); im.setMatrixAt(i, M); }
    im.instanceMatrix.needsUpdate = true; G.add(im); k += cnt; }
  return G;
}

// ---------------------------------------------------------------- conductor unipolar
// Recorre +X de 0 a len (o la curva «recorrido»: Vector3[]). pelado = [mm en el inicio, mm en el final].
export function conductor({ sec = 2.5, color = 'marron', tipo = 'K', len = 20, pelado = [0, 10], recorrido = null } = {}) {
  const G = new THREE.Group(); G.userData.tipo = 'conductor'; Object.assign(G.userData, { sec, color, tipoCond: tipo });
  const R = rCable(sec), rc = rCobre(sec);
  const pts = recorrido && recorrido.length > 1 ? recorrido.map((v) => v.clone()) : [new THREE.Vector3(0, 0, 0), new THREE.Vector3(len, 0, 0)];
  const curva = pts.length > 2 ? new THREE.CatmullRomCurve3(pts, false, 'centripetal') : new THREE.LineCurve3(pts[0], pts[1]);
  const L = curva.getLength(); const p0 = (pelado[0] || 0) / 10, p1 = (pelado[1] || 0) / 10;
  // aislamiento: de p0 a L − p1 (sub-curva)
  const u0 = Math.min(0.49, p0 / L), u1 = Math.max(0.51, 1 - p1 / L); const sub = []; const N = pts.length > 2 ? 48 : 2;
  for (let i = 0; i <= N; i++) sub.push(curva.getPointAt(u0 + ((u1 - u0) * i) / N));
  const cs = sub.length > 2 ? new THREE.CatmullRomCurve3(sub) : new THREE.LineCurve3(sub[0], sub[1]);
  const ais = malla(new THREE.TubeGeometry(cs, Math.max(2, N), R, calidad().baja ? 10 : 16, false), aislMat(color, sec, tipo, L * (u1 - u0)), G); ais.name = 'aislamiento';
  // caras de corte del aislamiento y puntas de cobre
  const cara = new THREE.MeshStandardMaterial({ map: caraTex(sec, tipo, color), roughness: 0.5, metalness: 0.3 });
  const extremo = (u, pel, dir) => {
    const p = curva.getPointAt(u), t = curva.getTangentAt(u).multiplyScalar(dir);
    const disco = new THREE.Mesh(new THREE.CircleGeometry(R, 24), cara); disco.position.copy(p); disco.lookAt(p.clone().add(t)); G.add(disco);
    if (pel > 0) {
      const g = new THREE.Group(); g.position.copy(p); g.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), t); G.add(g);
      if (tipo === 'U') { cilX(rc, pel, MATS.cobre(), g, pel / 2, 0, 0, 14); malla(new THREE.CircleGeometry(rc, 14), MATS.cobre(), g, pel, 0, 0).rotation.y = Math.PI / 2; }
      else g.add(hebras(sec, pel));
      return g;
    }
    return null;
  };
  const e0 = extremo(u0, p0, -1), e1 = extremo(u1, p1, 1);
  G.userData.extremos = { a: curva.getPointAt(0), b: curva.getPointAt(1) }; G.userData.puntas = { a: e0, b: e1 }; G.userData.curva = curva;
  return G;
}

// ---------------------------------------------------------------- manguera (cubierta + 3 conductores)
export function manguera({ tipo = 'H05VV-F', sec = 1.5, len = 26, abierta = 5, pelado = 8, colores = ['marron', 'azul', 'tierra'] } = {}) {
  const G = new THREE.Group(); G.userData.tipo = 'manguera';
  const Rc = rCable(sec) * 0.86; const Rm = Rc * 2.15 + 0.08; const col = tipo === 'RV-K' ? '#151617' : '#f1f0ec';
  const t = cubiertaTex(tipo, sec, col).clone(); t.wrapS = THREE.RepeatWrapping; t.repeat.set(Math.max(1, (len - abierta) / 10), 1); t.needsUpdate = true;
  malla(new THREE.TubeGeometry(new THREE.LineCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(len - abierta, 0, 0)), 2, Rm, 20), new THREE.MeshPhysicalMaterial({ map: t, roughness: 0.45, clearcoat: 0.25 }), G);
  malla(new THREE.CircleGeometry(Rm, 20), pbr(0xdad7cf, { roughness: 0.7 }), G, len - abierta, 0, 0).rotation.y = Math.PI / 2;
  malla(new THREE.CircleGeometry(Rm, 20), pbr(0xdad7cf, { roughness: 0.7 }), G, 0, 0, 0).rotation.y = -Math.PI / 2;
  const x0 = len - abierta - 0.2; const ang = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3];
  colores.forEach((c, i) => {
    const a = ang[i]; const y = Math.sin(a) * Rc * 1.15, z = Math.cos(a) * Rc * 1.15; const sale = 0.9 + i * 0.15;
    const rec = [new THREE.Vector3(x0, y, z), new THREE.Vector3(x0 + abierta * 0.35, y * 1.8, z * 1.8 + (i - 1) * 0.2), new THREE.Vector3(len + sale * 0.4, y * (2.4 + i * 0.2), z * 3 + (i - 1) * 0.6)];
    const g = conductor({ sec, color: c, tipo: 'K', pelado: [0, pelado], recorrido: rec }); G.add(g);
  });
  G.userData.radio = Rm; return G;
}

// ---------------------------------------------------------------- tubo corrugado
function corrugadoNormal() {
  return tex('corrug', 256, 16, (g, w, h) => { const img = g.createImageData(w, h); for (let x = 0; x < w; x++) { const s = Math.sin((x / w) * Math.PI * 2 * 8); for (let y = 0; y < h; y++) { const i = (y * w + x) * 4; img.data[i] = (s * 0.45 + 0.5) * 255; img.data[i + 1] = 128; img.data[i + 2] = 220; img.data[i + 3] = 255; } } g.putImageData(img, 0, 0); }, { datos: true, rep: [1, 1] });
}
export const COLOR_TUBO = 0x7f878e;
export function tuboCorrugado({ d = 20, len = 30, recorrido = null, color = COLOR_TUBO } = {}) {
  const G = new THREE.Group(); G.userData.tipo = 'tubo'; const R = d / 20; const paso = R * 0.32;
  if (!recorrido) { // tramo recto con el perfil real de las crestas
    const n = Math.max(4, Math.round(len / paso)); const perfil = []; for (let i = 0; i <= n * 4; i++) { const x = (i / (n * 4)) * len; perfil.push([R * (0.93 + 0.07 * Math.cos((x / paso) * Math.PI * 2)), x]); }
    const pi = perfil.map(([r, x]) => [r * 0.82, x]).reverse(); const geo = torno(perfil.concat(pi, [perfil[0]]), { seg: calidad().baja ? 14 : 22 }); geo.rotateY(Math.PI / 2);
    malla(geo, pbr(color, { roughness: 0.55, clearcoat: 0.2 }), G);
  } else {
    const c = new THREE.CatmullRomCurve3(recorrido); const L = c.getLength(); const nm = corrugadoNormal().clone(); nm.wrapS = THREE.RepeatWrapping; nm.repeat.set(L / (paso * 8), 1); nm.needsUpdate = true;
    malla(new THREE.TubeGeometry(c, Math.max(8, Math.round(L / 2)), R, calidad().baja ? 12 : 18), pbr(color, { roughness: 0.55, normalMap: nm, normalScale: new THREE.Vector2(1.2, 1.2) }), G);
  }
  G.userData.radio = R; return G;
}
// Grapa (abrazadera) para tubo en superficie: arco + 2 orejas con tornillo. Eje del tubo en X.
export function grapa(d = 20) {
  const G = new THREE.Group(); const R = d / 20 + 0.05; const m = pbr(0xe9e7e2, { roughness: 0.45 });
  const arco = malla(new THREE.TorusGeometry(R, 0.12, 8, 20, Math.PI), m, G); arco.rotation.y = Math.PI / 2;
  for (const s of [-1, 1]) { caja(0.5, R, 0.24, m, G, 0, -R / 2, s * R); caja(0.9, 0.14, 1.0, m, G, 0, -R + 0.07, s * (R + 0.5)); malla(new THREE.CylinderGeometry(0.17, 0.17, 0.12, 12), MATS.acero(), G, 0, -R + 0.17, s * (R + 0.55)); }
  return G;
}
// ---------------------------------------------------------------- rollo de cable (100 m)
// Las espiras siguen la circunferencia del rollo: la textura del aislamiento corre a lo largo de cada vuelta y un
// mapa de normales marca los surcos entre espiras; unas vueltas sueltas por encima y la etiqueta del fabricante.
function espirasNormal() {
  return tex('espiras', 16, 256, (g, w, h) => { const img = g.createImageData(w, h); for (let y = 0; y < h; y++) { const s = Math.sin((y / h) * Math.PI * 2 * 4); const c = Math.abs(Math.cos((y / h) * Math.PI * 4)); for (let x = 0; x < w; x++) { const i = (y * w + x) * 4; img.data[i] = 128; img.data[i + 1] = (s * 0.5 + 0.5) * 255; img.data[i + 2] = 150 + c * 105; img.data[i + 3] = 255; } } g.putImageData(img, 0, 0); }, { datos: true, rep: [1, 1] });
}
export function rollo({ sec = 2.5, color = 'marron', tipo = 'K' } = {}) {
  const G = new THREE.Group(); G.userData.tipo = 'rollo'; Object.assign(G.userData, { sec, color });
  const R = 7.5 + sec * 0.25, r = 2.2 + sec * 0.25, Rc = rCable(sec); const Q = calidad();
  const vueltas = Math.round((Math.PI * 2 * r) / (Rc * 2 * 4)) * 4; // espiras visibles alrededor de la sección
  const t = aislTex(color, sec, tipo).clone(); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(Math.round((Math.PI * 2 * R) / 9), vueltas); t.needsUpdate = true;
  const nm = espirasNormal().clone(); nm.wrapS = nm.wrapT = THREE.RepeatWrapping; nm.repeat.set(1, vueltas / 4); nm.needsUpdate = true;
  const toro = malla(new THREE.TorusGeometry(R, r, Q.baja ? 16 : 28, Q.baja ? 40 : 72), new THREE.MeshPhysicalMaterial({ map: t, roughness: 0.35, clearcoat: 0.45, clearcoatRoughness: 0.3, normalMap: nm, normalScale: new THREE.Vector2(0.9, 0.9) }), G);
  toro.rotation.x = Math.PI / 2; toro.position.y = r; toro.scale.z = 0.9;
  // espiras sueltas que cruzan por encima (como un rollo real ya empezado)
  const mAis = aislMat(color, sec, tipo, Math.PI * 2 * R);
  for (let j = 0; j < (Q.baja ? 1 : 3); j++) { const pts = []; const a0 = j * 1.9, ph = 0.35 + j * 0.25;
    for (let i = 0; i <= 64; i++) { const a = a0 + (i / 64) * Math.PI * 1.2; const v = Math.PI * (0.25 + 0.5 * i / 64) + j * 0.4; const rr = r + Rc * 1.05; pts.push(new THREE.Vector3(Math.cos(a) * (R + Math.cos(v) * rr * 0.98), r + Math.sin(v) * rr * 0.9 * ph * 2.4 / 1.2, Math.sin(a) * (R + Math.cos(v) * rr * 0.98))); }
    malla(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 64, Rc, 8, false), mAis, G); }
  const film = malla(new THREE.TorusGeometry(R, r + Rc * 2.4, 12, 48), pbr(0xffffff, { roughness: 0.08, transparent: true, opacity: 0.14, depthWrite: false, clearcoat: 1 }), G); film.rotation.x = Math.PI / 2; film.position.y = r; film.scale.z = 0.9;
  const et = new THREE.Mesh(new THREE.PlaneGeometry(5.4, 3.2), new THREE.MeshStandardMaterial({ map: textoTex(`H07V-${tipo}\n1 x ${fmt(sec)} mm²\n100 m`, { color: '#1d2329', bg: '#fbfbf7', w: 256, h: 160, font: 'bold 34px system-ui' }), roughness: 0.7 }));
  et.rotation.x = -Math.PI / 2; et.position.set(0, r * 2 + Rc * 2.6 + 0.06, R); G.add(et);
  // punta suelta pelada
  const p = conductor({ sec, color, tipo, len: 7, pelado: [0, 10] }); p.position.set(R + r * 0.3, 0.3, 0); p.rotation.y = -0.6; G.add(p);
  return G;
}
// Trozo corto con la cara del corte bien visible (reto «¿qué sección es?»)
export function muestraCorte({ sec = 2.5, color = 'blanco', tipo = 'K', len = 6 } = {}) {
  const g = conductor({ sec, color, tipo, len, pelado: [0, 0] }); g.userData.tipo = 'muestra'; return g;
}

// ---------------------------------------------------------------- clavija Schuko desmontada (como en la foto de referencia)
// El frente (patillas) mira a −X; la manguera entra por +X. userData.bornes: { L, N, PE } (posición del tornillo).
export function clavijaSchuko({ cables = null, tapa = false } = {}) {
  const G = new THREE.Group(); G.userData.tipo = 'clavija';
  const negro = pbr(0x1c1d1f, { roughness: 0.4, clearcoat: 0.4 });
  const negroD = pbr(0x1c1d1f, { roughness: 0.4, clearcoat: 0.4, side: THREE.DoubleSide });
  const cuerpo = malla(torno([[0, 0], [1.9, 0], [2.0, 0.4], [1.95, 4.2], [1.4, 5.6], [0.75, 6.4], [0, 6.4]], { seg: 36, desde: -Math.PI / 2, arco: Math.PI }), negroD, G); cuerpo.rotation.y = Math.PI / 2; cuerpo.position.x = -0.4; // media carcasa: se ve el interior
  // media carcasa cortada: se ve el interior (plano negro)
  const interior = caja(6.0, 0.25, 3.6, pbr(0x2a2b2e, { roughness: 0.6 }), G, 2.6, 0.05, 0); void interior;
  // patillas (Ø 4,8 mm, 19 mm) y contactos laterales de tierra
  for (const z of [-0.95, 0.95]) { cilX(0.24, 1.9, MATS.niquel(), G, -1.3, 0, z, 16); malla(new THREE.SphereGeometry(0.24, 12, 8), MATS.niquel(), G, -2.25, 0, z); }
  for (const s of [-1, 1]) { const c = caja(2.6, 0.9, 0.12, MATS.niquel(), G, 1.2, 0, s * 1.98); void c; }
  // bornes de latón con tornillo: L y N a los lados, tierra en el centro (más largo)
  const bornes = { L: new THREE.Vector3(2.0, 0.45, -0.95), N: new THREE.Vector3(2.0, 0.45, 0.95), PE: new THREE.Vector3(3.2, 0.45, 0) };
  for (const [k, v] of Object.entries(bornes)) {
    caja(0.9, 0.6, 0.8, MATS.laton(), G, v.x, 0.3, v.z);
    malla(new THREE.CylinderGeometry(0.22, 0.22, 0.25, 14), MATS.acero(), G, v.x, 0.72, v.z); caja(0.36, 0.05, 0.05, MATS.aceroPavonado(), G, v.x, 0.86, v.z); caja(0.05, 0.05, 0.36, MATS.aceroPavonado(), G, v.x, 0.86, v.z);
    const et = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.45), new THREE.MeshBasicMaterial({ map: textoTex(k === 'PE' ? '⏚' : k, { color: k === 'PE' ? '#2f9e44' : k === 'N' ? '#1f5fd6' : '#7a4a22', bg: '#f4f1e6', w: 96, h: 64, font: 'bold 46px system-ui' }) }));
    et.rotation.x = -Math.PI / 2; et.position.set(v.x - 0.9, 0.2, v.z); G.add(et);
  }
  caja(1.6, 0.25, 0.3, MATS.niquel(), G, 2.6, 0.3, 0); // puente de tierra a los contactos laterales
  // prensacables (brida blanca con dos tornillos)
  const pc = new THREE.Group(); pc.position.set(5.3, 0.9, 0); G.add(pc);
  bloqueRedondo(1.0, 3.6, 0.5, 0.35, pbr(0xeeeeea, { roughness: 0.45 }), pc, 0.12).rotation.set(Math.PI / 2, 0, 0);
  for (const z of [-1.3, 1.3]) { malla(new THREE.CylinderGeometry(0.28, 0.28, 0.3, 16), MATS.acero(), pc, 0, 0.35, z); caja(0.45, 0.06, 0.07, MATS.aceroPavonado(), pc, 0, 0.51, z); }
  // manguera negra que entra por detrás
  const mg = manguera({ tipo: 'H05VV-F', sec: 1.5, len: 14, abierta: 0.1, pelado: 0, colores: [] }); mg.rotation.y = Math.PI; mg.position.set(19, 0.2, 0); G.add(mg);
  G.userData.bornes = bornes; G.userData.entrada = new THREE.Vector3(5.2, 0.25, 0);
  G.userData.cablear = (asig) => { // asig: { L: 'marron', N: 'azul', PE: 'tierra' }
    G.userData.cablesG?.removeFromParent(); const cg = new THREE.Group(); G.add(cg); G.userData.cablesG = cg;
    for (const [b, col] of Object.entries(asig || {})) { if (!col) continue; const v = bornes[b]; const dz = { marron: -0.25, azul: 0.25, tierra: 0, negro: -0.15, gris: 0.15 }[col] || 0;
      const rec = [new THREE.Vector3(5.6, 0.25, dz), new THREE.Vector3(4.6, 0.5, dz * 2), new THREE.Vector3(v.x + 0.9, 0.55, v.z * 0.8), new THREE.Vector3(v.x + 0.15, 0.55, v.z)];
      cg.add(conductor({ sec: 1.5, color: col, tipo: 'K', pelado: [0, 8], recorrido: rec })); }
  };
  if (cables) G.userData.cablear(cables);
  if (tapa) { const tp = malla(torno([[1.95, 0.4], [1.95, 4.2], [1.4, 5.6], [0.75, 6.4]], { seg: 36 }), negro, G); tp.rotation.y = Math.PI / 2; tp.position.x = -0.4; }
  return G;
}

// Escena de prueba
export function demo(s) {
  const add = (g, x, z) => { g.position.set(x, 1, z); s.add(g); return g; };
  [1.5, 2.5, 4, 6].forEach((sec, i) => add(conductor({ sec, color: ['marron', 'azul', 'tierra', 'negro'][i], len: 14, pelado: [0, 12] }), -25, -12 + i * 4));
  add(conductor({ sec: 2.5, color: 'gris', tipo: 'U', len: 14, pelado: [0, 12] }), -25, 6);
  add(manguera({ tipo: 'RV-K', sec: 2.5 }), 0, -12); add(manguera({ tipo: 'H05VV-F', sec: 1.5 }), 0, -4);
  add(tuboCorrugado({ d: 20, len: 22 }), 0, 6); add(tuboCorrugado({ d: 25, recorrido: [new THREE.Vector3(0, 0, 0), new THREE.Vector3(10, 0, 4), new THREE.Vector3(20, 0, 0)] }), 0, 14);
  add(rollo({ sec: 2.5, color: 'azul' }), -20, 22); add(clavijaSchuko({ cables: { L: 'marron', N: 'azul', PE: 'tierra' } }), 20, 22);
  [1.5, 2.5, 4, 6].forEach((sec, i) => { const m = muestraCorte({ sec }); m.rotation.y = Math.PI / 2; add(m, 30 + i * 3, -14); });
}

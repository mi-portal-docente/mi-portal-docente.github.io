// Herramientas del electricista en 3D (genéricas, sin marcas), compartidas por las Actividades de clase y el
// laboratorio «Instalación de vivienda». Medidas reales aproximadas, en cm.
// Convenio: la parte que trabaja (punta, mordaza, broca) está en el origen y el cuerpo se alarga hacia +Z;
// la cara de arriba de la herramienta mira a +Y. Cada herramienta es un THREE.Group con
//   userData.id, userData.partes (piezas móviles) y userData.anim(t) (animación de uso en bucle, t en segundos).
import * as THREE from 'three';
import { MATS, pbr, torno, malla, caja, cilZ, cilX, extruir, bloqueRedondo, calcoCil, textoTex, rotulo1000V, estriasNormal, moleteadoNormal, calidad, tex } from './base.js';

const ROJO = () => MATS.rojoVDE(), AMAR = () => MATS.amarilloVDE();
const gomaAm = () => pbr(0xf5c400, { roughness: 0.75, normalMap: estriasNormal(14, 0.6), normalScale: new THREE.Vector2(0.6, 0.6) });
const gomaRoja = () => pbr(0xc81e1a, { roughness: 0.7, normalMap: estriasNormal(10, 0.4) });
const gomaNegra = () => pbr(0x202224, { roughness: 0.85, normalMap: estriasNormal(18, 0.5) });
const gomaNaranja = () => pbr(0xff6a13, { roughness: 0.7, normalMap: estriasNormal(12, 0.5) });
const plasGris = () => pbr(0x5b6168, { roughness: 0.55 });

// ---------------------------------------------------------------- puntas de destornillador
export const PUNTAS3D = {
  plano3: { n: 'Plana 3,5 mm', tipo: 'plano', a: 0.35 }, plano5: { n: 'Plana 5,5 mm', tipo: 'plano', a: 0.55 },
  PH1: { n: 'Phillips PH1', tipo: 'PH', r: 0.24 }, PH2: { n: 'Phillips PH2', tipo: 'PH', r: 0.31 },
  PZ1: { n: 'Pozidriv PZ1', tipo: 'PZ', r: 0.24 }, PZ2: { n: 'Pozidriv PZ2', tipo: 'PZ', r: 0.31 },
  T20: { n: 'Torx T20', tipo: 'T', r: 0.19 },
};
// Punta (de z = 0, el extremo, a z = 0.9) para el destornillador, la broca del taladro o el portapuntas
export function punta(tipo, m = MATS.acero()) {
  const P = PUNTAS3D[tipo] || PUNTAS3D.PZ1; const g = new THREE.Group(); g.userData.punta = tipo;
  if (P.tipo === 'plano') {
    const geo = new THREE.BoxGeometry(P.a, 0.3, 0.9, 1, 1, 2); const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) { const z = p.getZ(i); const f = 0.18 + 0.82 * ((z + 0.45) / 0.9); p.setY(i, p.getY(i) * f); }
    geo.computeVertexNormals(); geo.translate(0, 0, 0.45); malla(geo, m, g);
  } else if (P.tipo === 'T') {
    const s = new THREE.Shape(); const n = 6, R = P.r, r = P.r * 0.68;
    for (let i = 0; i <= n * 8; i++) { const a = (i / (n * 8)) * Math.PI * 2; const k = Math.cos(a * n); const rr = r + (R - r) * (0.5 + 0.5 * Math.sign(k) * Math.pow(Math.abs(k), 0.6)); const x = Math.cos(a) * rr, y = Math.sin(a) * rr; i ? s.lineTo(x, y) : s.moveTo(x, y); }
    const geo = new THREE.ExtrudeGeometry(s, { depth: 0.8, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.02, bevelSegments: 1 }); geo.translate(0, 0, 0.05); malla(geo, m, g);
  } else { // cruz: cono con 4 aletas (PZ: 4 nervios más a 45°)
    const R = P.r; cilZ(R * 0.35, 0.9, m, g, 0, 0, 0.45, 10, R * 0.95);
    for (let i = 0; i < 4; i++) {
      const geo = new THREE.BoxGeometry(R * 2.1, 0.07, 0.85); const p = geo.attributes.position;
      for (let j = 0; j < p.count; j++) { const z = p.getZ(j); const f = 0.15 + 0.85 * ((z + 0.425) / 0.85); p.setX(j, p.getX(j) * f); }
      geo.computeVertexNormals(); geo.translate(0, 0, 0.45); const o = malla(geo, m, g); o.rotation.z = (i * Math.PI) / 4 * 2;
    }
    if (P.tipo === 'PZ') for (let i = 0; i < 4; i++) { const o = caja(R * 1.3, 0.03, 0.5, m, g, 0, 0, 0.55); o.rotation.z = Math.PI / 4 + (i * Math.PI) / 2; }
  }
  return g;
}

// ---------------------------------------------------------------- destornillador aislado VDE 1000 V
export function destornillador({ punta: tp = 'PZ1', largo = 10 } = {}) {
  const G = new THREE.Group(); G.userData.id = 'destornillador';
  const P = PUNTAS3D[tp] || PUNTAS3D.PZ1; const rv = P.tipo === 'plano' ? Math.max(0.2, P.a * 0.6) : Math.max(0.2, (P.r || 0.25) * 0.9);
  G.add(punta(tp));
  cilZ(rv, 1.2, MATS.acero(), G, 0, 0, 1.4); // vástago visible
  const aisl = torno([[rv + 0.08, 2.0], [rv + 0.16, 2.6], [rv + 0.16, largo + 1.2], [rv + 0.28, largo + 1.6]], { seg: 16 }); malla(aisl, ROJO(), G);
  const L0 = largo + 1.4; // mango
  const perfil = [[0.55, L0], [1.15, L0 + 0.7], [1.22, L0 + 1.4], [1.18, L0 + 2.2], [1.34, L0 + 5], [1.48, L0 + 8.5], [1.42, L0 + 10.2], [1.05, L0 + 11]];
  malla(torno(perfil, { estrias: 6, prof: 0.035 }), ROJO(), G);
  malla(torno([[1.27, L0 + 2.6], [1.42, L0 + 5], [1.56, L0 + 8.2], [1.5, L0 + 9.6]], { estrias: 6, prof: 0.07 }), gomaAm(), G);
  malla(torno([[1.24, L0 + 0.75], [1.3, L0 + 1.0], [1.3, L0 + 1.35], [1.24, L0 + 1.6]], { seg: 24 }), ROJO(), G); // tope de protección
  calcoCil(rotulo1000V('#ffffff'), 1.235, L0 + 1.7, L0 + 2.5, 1.6, null, G, 0, false);
  calcoCil(textoTex(P.n.replace(/^(Phillips|Pozidriv|Torx|Plana) /, ''), { color: '#111', w: 128, h: 48, font: 'bold 30px system-ui' }), 1.43, L0 + 9.7, L0 + 10.3, 1.2, null, G, Math.PI);
  G.userData.partes = { punta: G.children[0] };
  G.userData.anim = (t) => { G.rotation.z = Math.sin(t * 3) * 1.4; };
  return G;
}

// ---------------------------------------------------------------- alicates (universal, corte, punta) y crimpadora
// Media pieza: silueta (x, z) de mordaza + ojo + mango; el mango cruza al lado contrario (x < 0).
function mitadAlicate(tipo) {
  const g = new THREE.Group(); const A = MATS.aceroPavonado(), B = MATS.acero();
  const jaws = {
    universal: [[0, 0], [0.45, 0.2], [0.9, 2.2], [1.1, 4.4]], corte: [[0, 0], [0.2, 0.05], [1.1, 1.4], [1.25, 3.4]],
    punta: [[0, 0], [0.18, 0.05], [0.45, 3.5], [0.85, 6.2], [1.05, 7.4]], crimpadora: [[0, 0], [0.8, 0.1], [1.2, 2.5], [1.25, 4.6]],
  }[tipo];
  const zp = jaws[jaws.length - 1][1] + 1.2; // pivote
  const sil = [...jaws, [1.2, zp], [0.6, zp + 1.3], [-0.5, zp + 3.5], [-1.1, zp + 7.5], [-1.35, zp + 13], [-2.55, zp + 13.2], [-2.35, zp + 7.5], [-1.85, zp + 3.6], [-1.15, zp + 1.5], [-1.1, zp - 0.2], [-0.35, zp - 1.1], [0, zp - 1.4]];
  const s = extruir(sil.map(([x, z]) => [x, z]), 0.75, A, g, { bisel: 0.07 }); s.rotation.x = Math.PI / 2;
  // filo pulido de la mordaza
  const filo = extruir(jaws.concat([[0, jaws[jaws.length - 1][1]]]).map(([x, z]) => [x * 0.6, z]), 0.78, B, g, { bisel: 0.02 }); filo.rotation.x = Math.PI / 2;
  if (tipo === 'universal' || tipo === 'crimpadora') { const st = caja(0.5, 0.8, 2.6, pbr(0x55595e, { metalness: 0.9, roughness: 0.5, normalMap: moleteadoNormal() }), g, 0.32, 0, 1.6); void st; }
  if (tipo === 'crimpadora') [['#d62828', 1.0], ['#1d5fd0', 2.1], ['#f5c400', 3.2]].forEach(([c, z]) => cilX(0.16, 0.08, pbr(new THREE.Color(c).getHex(), { roughness: 0.4 }), g, 1.25, 0.25, z, 12));
  // mango aislado bicolor con tope de protección
  const curva = new THREE.CatmullRomCurve3([new THREE.Vector3(-0.75, 0, zp + 2.6), new THREE.Vector3(-1.45, 0, zp + 6.5), new THREE.Vector3(-1.85, 0, zp + 10.5), new THREE.Vector3(-1.98, 0, zp + 13.6)]);
  const tubo = malla(new THREE.TubeGeometry(curva, 24, 0.78, calidad().baja ? 10 : 16), tipo === 'corte' ? gomaRoja() : ROJO(), g); tubo.scale.y = 0.8;
  const c2 = new THREE.CatmullRomCurve3(curva.getPoints(12).slice(4));
  const t2 = malla(new THREE.TubeGeometry(c2, 16, 0.86, calidad().baja ? 10 : 16), gomaAm(), g); t2.scale.y = 0.82;
  const guard = malla(new THREE.TorusGeometry(0.92, 0.22, 8, 20), ROJO(), g, -0.78, 0, zp + 2.5); guard.rotation.x = 0; guard.scale.set(1, 0.85, 1);
  return { g, zp };
}
export function alicate(tipo = 'universal') {
  const G = new THREE.Group(); G.userData.id = tipo === 'crimpadora' ? 'crimpadora' : 'alicate_' + tipo;
  const a = mitadAlicate(tipo), b = mitadAlicate(tipo); const zp = a.zp;
  const pa = new THREE.Group(), pb = new THREE.Group(); pa.position.z = zp; pb.position.z = zp;
  a.g.position.set(0, 0.42, -zp); b.g.position.set(0, -0.42, -zp); b.g.scale.x = -1; pa.add(a.g); pb.add(b.g); G.add(pa, pb);
  const rem = malla(new THREE.CylinderGeometry(0.62, 0.62, 1.95, 20), MATS.acero(), G, 0, 0, zp); void rem;
  if (tipo === 'crimpadora') { const tr = caja(0.4, 0.3, 4.5, MATS.aceroPavonado(), G, 0, 0, zp + 4); void tr; }
  G.userData.partes = { a: pa, b: pb };
  G.userData.abrir = (ang) => { pa.rotation.y = -ang; pb.rotation.y = ang; };
  G.userData.abrir(0.08);
  G.userData.anim = (t) => { const f = (Math.sin(t * 3) + 1) / 2; G.userData.abrir(0.02 + 0.22 * f); };
  return G;
}

// ---------------------------------------------------------------- pelacables automático (tope de longitud)
export function pelacables() {
  const G = new THREE.Group(); G.userData.id = 'pelacables';
  const sup = new THREE.Group(), inf = new THREE.Group(); G.add(sup, inf);
  // brazo superior fijo (cuerpo de poliamida con fibra) + empuñadura bicomponente
  const b1 = extruir([[0.0, 0.2], [2.3, 0.2], [2.6, 1.8], [2.2, 3.0], [1.4, 8], [1.2, 20], [0.0, 20.2], [-0.1, 8], [-0.4, 3.0], [-0.2, 1.0]].map(([y, z]) => [z, y]), 2.0, pbr(0x26292d, { roughness: 0.5 }), sup, { bisel: 0.15 });
  b1.rotation.set(0, -Math.PI / 2, 0); // silueta en (z, y)
  const gr1 = extruir([[1.6, 8.5], [1.95, 9], [1.7, 19.6], [0.55, 19.8], [0.6, 9]].map(([y, z]) => [z, y]), 2.25, gomaNaranja(), sup, { bisel: 0.2 }); gr1.rotation.set(0, -Math.PI / 2, 0);
  // brazo inferior móvil (pivote en z = 3)
  inf.position.set(0, -0.1, 3);
  const b2 = extruir([[-0.2, -2.4], [-0.8, -1.2], [-1.4, 4], [-2.3, 15.5], [-1.2, 15.8], [-0.2, 4], [0.3, -0.8], [0.2, -2.6]].map(([y, z]) => [z, y]), 1.7, pbr(0x2b2e32, { roughness: 0.5 }), inf, { bisel: 0.15 });
  b2.rotation.set(0, -Math.PI / 2, 0);
  const gr2 = extruir([[-1.5, 5], [-2.25, 15.3], [-1.35, 15.5], [-0.8, 5.2]].map(([y, z]) => [z, y]), 1.95, gomaNaranja(), inf, { bisel: 0.18 }); gr2.rotation.set(0, -Math.PI / 2, 0);
  inf.rotation.x = 0.16;
  // cabezal: mordazas de sujeción con dientes (gris) y cuchillas
  const cab = new THREE.Group(); G.add(cab);
  const md = pbr(0x8a9097, { metalness: 0.4, roughness: 0.55, normalMap: moleteadoNormal() });
  const j1 = caja(1.6, 0.6, 2.6, md, cab, 0, 0.55, 0.9), j2 = caja(1.6, 0.6, 2.6, md, cab, 0, -0.35, 0.9);
  const cu1 = caja(1.4, 0.12, 0.3, MATS.acero(), cab, 0, 0.2, 2.3), cu2 = caja(1.4, 0.12, 0.3, MATS.acero(), cab, 0, 0.06, 2.3);
  // tope de longitud con escala en mm
  const tope = new THREE.Group(); G.add(tope); const tp = caja(1.2, 0.9, 0.25, pbr(0xf2c200, { roughness: 0.5 }), tope, 0, 0.1, -0.6); void tp;
  const reg = caja(0.25, 0.25, 2.6, MATS.acero(), tope, 0.55, -0.2, 0.6); void reg;
  const esc = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.5), new THREE.MeshStandardMaterial({ map: textoTex('3 · 6 · 9 · 12 · 15 · 18 mm', { color: '#111', bg: '#f4f4f4', w: 512, h: 64, font: 'bold 34px system-ui' }), roughness: 0.6 }));
  esc.rotation.y = Math.PI / 2; esc.position.set(1.05, 0.9, 6); sup.add(esc);
  const tor = cilX(0.45, 0.4, pbr(0xd62828, { roughness: 0.45 }), sup, 1.1, 1.0, 9.2, 16); void tor;
  G.userData.partes = { inf, j1, j2, cu1, cu2, tope };
  G.userData.cerrar = (f) => { inf.rotation.x = 0.16 - 0.14 * f; j1.position.y = 0.55 - 0.18 * f; j2.position.y = -0.35 + 0.18 * f; };
  G.userData.anim = (t) => { const f = Math.min(1, (t % 2) / 0.6); const tira = Math.max(0, (t % 2) - 0.6); G.userData.cerrar(f < 1 ? f : 1 - Math.min(1, tira * 1.2)); j1.position.z = j2.position.z = 0.9 + Math.min(0.8, tira * 1.6); };
  return G;
}

// ---------------------------------------------------------------- cutter
export function cutter() {
  const G = new THREE.Group(); G.userData.id = 'cutter';
  const cuerpo = bloqueRedondo(1.9, 15, 1.3, 0.5, pbr(0xf6c516, { roughness: 0.45 }), G, 0.12); cuerpo.rotation.x = -Math.PI / 2; cuerpo.position.set(0, 0, 9.5);
  const goma = bloqueRedondo(2.0, 8, 1.15, 0.5, gomaNegra(), G, 0.12); goma.rotation.x = -Math.PI / 2; goma.position.set(0, -0.08, 12);
  const hoja = new THREE.Group(); G.add(hoja);
  const hs = extruir([[-0.85, 2.2], [0.85, 2.2], [0.85, 0.9], [-0.85, -0.5]].map(([x, z]) => [x, z]), 0.05, MATS.cromo(), hoja, { bisel: 0 }); hs.rotation.x = Math.PI / 2;
  for (let i = 0; i < 3; i++) { const l = caja(1.8, 0.055, 0.03, MATS.aceroPavonado(), hoja, 0, 0, 1.0 + i * 0.6); l.rotation.y = 0.6; }
  const cur = caja(0.9, 0.5, 1.4, gomaNegra(), G, 0, 0.75, 5.4); void cur;
  G.userData.partes = { hoja };
  G.userData.anim = (t) => { G.position.x = Math.sin(t * 2.5) * 1.5; };
  return G;
}

// ---------------------------------------------------------------- tijeras de electricista
export function tijeras() {
  const G = new THREE.Group(); G.userData.id = 'tijeras';
  const mk = (s) => { const p = new THREE.Group(); p.position.z = 5.2;
    const h = extruir([[0, -5.2], [0.25 * s, -5.1], [0.75 * s, -2.5], [0.8 * s, 0.2], [0, 0.6]].map(([x, z]) => [x, z]), 0.18, MATS.acero(), p, { bisel: 0.02 }); h.rotation.x = Math.PI / 2; h.position.y = s * 0.1;
    const ojo = malla(new THREE.TorusGeometry(1.25, 0.42, 10, 24), pbr(0xff7a12, { roughness: 0.5 }), p, -1.4 * s, s * 0.1, 4.6); ojo.rotation.x = Math.PI / 2; ojo.scale.set(1, 1.3, 1);
    const br = caja(0.6, 0.45, 2.8, pbr(0xff7a12, { roughness: 0.5 }), p, -0.55 * s, s * 0.1, 2.0); br.rotation.y = s * 0.45; G.add(p); return p; };
  const a = mk(1), b = mk(-1); cilZ(0.32, 0.5, MATS.acero(), G, 0, 0, 5.2).rotation.set(0, 0, 0);
  G.userData.partes = { a, b }; G.userData.abrir = (x) => { a.rotation.y = x; b.rotation.y = -x; }; G.userData.abrir(0.12);
  G.userData.anim = (t) => G.userData.abrir(0.02 + 0.2 * ((Math.sin(t * 4) + 1) / 2));
  return G;
}

// ---------------------------------------------------------------- flexómetro (cinta con milímetros)
function cintaTex() {
  return tex('cinta', 64, 1024, (g, w, h) => {
    g.fillStyle = '#f7d21c'; g.fillRect(0, 0, w, h); g.fillStyle = '#111'; g.font = 'bold 22px system-ui'; g.textAlign = 'center';
    for (let mm = 0; mm <= 100; mm++) { const y = h - (mm / 100) * h; const L = mm % 10 === 0 ? 28 : mm % 5 === 0 ? 18 : 10; g.fillRect(0, y - 1, L, 2); if (mm % 10 === 0 && mm) { g.save(); g.translate(44, y); g.rotate(-Math.PI / 2); g.fillText(String(mm / 10), 0, 8); g.restore(); } }
    g.fillStyle = '#d62828'; g.fillRect(w - 6, 0, 6, h);
  }, { rep: [1, 1] });
}
export function flexometro({ L = 6 } = {}) {
  const G = new THREE.Group(); G.userData.id = 'flexometro';
  const caja1 = bloqueRedondo(6.6, 6.6, 3.0, 1.4, pbr(0xf6c516, { roughness: 0.45, clearcoat: 0.3 }), G, 0.3); caja1.rotation.y = Math.PI / 2; caja1.position.set(0, 3.3, 0);
  const gom = bloqueRedondo(6.9, 6.9, 1.6, 1.5, gomaNegra(), G, 0.2); gom.rotation.y = Math.PI / 2; gom.position.set(0, 3.3, 0);
  const caja2 = new THREE.Group(); G.add(caja2); G.userData.caja = caja2; caja2.add(caja1, gom);
  cilX(1.3, 3.5, pbr(0x2b2e32, { roughness: 0.4 }), caja2, 0, 3.3, 0, 24).scale.set(1, 1, 1);
  caja(1.4, 0.6, 1.1, pbr(0xd62828, { roughness: 0.5 }), caja2, 0, 6.6, -1.2); // freno
  caja(2.2, 4.5, 0.15, MATS.acero(), caja2, 0, 3.6, 3.4); // clip de cinturón
  const t = cintaTex().clone(); t.needsUpdate = true; t.wrapT = THREE.RepeatWrapping;
  const cmat = new THREE.MeshStandardMaterial({ map: t, metalness: 0.3, roughness: 0.4, side: THREE.DoubleSide });
  const cinta = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.06, 1), cmat); cinta.castShadow = true; G.add(cinta);
  const gancho = caja(2.1, 0.8, 0.1, MATS.laton(), G, 0, 0.35, 0);
  G.userData.partes = { cinta, gancho };
  G.userData.medida = 0;
  G.userData.extender = (len) => { len = Math.max(0.5, len); caja2.position.z = len + 3.3; cinta.scale.z = len; cinta.position.set(0, 0.5, len / 2); t.repeat.set(1, len / 10); t.offset.y = 0; gancho.position.z = 0; G.userData.medida = len; };
  G.userData.extender(L);
  G.userData.anim = (tt) => G.userData.extender(2 + ((Math.sin(tt * 1.2) + 1) / 2) * 20);
  return G;
}

// ---------------------------------------------------------------- nivel de burbuja
export function nivel({ L = 40 } = {}) {
  const G = new THREE.Group(); G.userData.id = 'nivel';
  const perfil = extruir([[-1.1, 0], [1.1, 0], [1.1, 0.35], [0.25, 0.35], [0.25, 4.2], [1.1, 4.2], [1.1, 4.6], [-1.1, 4.6], [-1.1, 4.2], [-0.25, 4.2], [-0.25, 0.35], [-1.1, 0.35]], L, MATS.aluminio(), G, { bisel: 0.03 });
  perfil.position.z = L / 2;
  const ventana = (z, rot) => { const v = new THREE.Group(); v.position.set(0, 2.3, z); G.add(v);
    caja(2.3, 2.6, 2.4, pbr(0x2b2e32, { roughness: 0.5 }), v, 0, 0, 0).scale.set(1, 1, 1);
    const vial = cilZ(0.45, 2.0, pbr(0xa8ff3c, { roughness: 0.05, transparent: true, opacity: 0.75, emissive: 0x264d00, emissiveIntensity: 0.25 }), v, 0, 0, 0, 16); vial.rotation.set(0, 0, 0); vial.rotation.x = 0; vial.rotation.y = Math.PI / 2;
    const burbuja = malla(new THREE.SphereGeometry(0.28, 12, 8), pbr(0xffffff, { roughness: 0.05, transparent: true, opacity: 0.9 }), v, 0, 0.18, 0); burbuja.scale.set(1.6, 0.8, 0.8);
    for (const s of [-0.38, 0.38]) caja(0.05, 1, 1.0, pbr(0x111111), v, s, 0, 0);
    v.rotation.z = rot; v.rotation.y = Math.PI / 2; return burbuja; };
  const b = ventana(L / 2, 0); ventana(5, Math.PI / 2);
  for (const z of [0.4, L - 0.4]) caja(2.6, 4.8, 0.8, gomaNegra(), G, 0, 2.3, z);
  G.userData.partes = { burbuja: b }; G.userData.anim = (t) => { b.position.z = Math.sin(t * 1.5) * 0.4; G.rotation.z = Math.sin(t * 1.5) * 0.03; };
  return G;
}

// ---------------------------------------------------------------- taladro-atornillador de batería
export function taladro({ bit = 'PH2' } = {}) {
  const G = new THREE.Group(); G.userData.id = 'taladro';
  const cuerpo = pbr(0x31363b, { roughness: 0.45, clearcoat: 0.35 }), acento = pbr(0xff7a12, { roughness: 0.45, clearcoat: 0.3 });
  const brocaG = new THREE.Group(); G.add(brocaG); const pt = punta(bit); brocaG.add(pt); cilZ(0.32, 3.2, MATS.acero(), brocaG, 0, 0, 2.4, 6); // vástago hexagonal 1/4"
  const mandril = new THREE.Group(); mandril.position.z = 4; G.add(mandril);
  malla(torno([[0.5, 0], [1.2, 0.6], [1.6, 1.8], [1.65, 3.6], [1.5, 4.2]], { estrias: 10, prof: 0.04 }), pbr(0x1d1f21, { roughness: 0.55, normalMap: estriasNormal(20, 0.5) }), mandril);
  const emb = malla(torno([[1.95, 4.3], [2.05, 4.6], [2.05, 5.6], [1.95, 5.9]], { estrias: 24, prof: 0.02 }), acento, G);
  calcoCil(textoTex('1 · 5 · 10 · 15 · 20 · ⚙', { color: '#fff', w: 512, h: 64, font: 'bold 34px system-ui' }), 2.07, 4.7, 5.5, 2.8, null, G, 0); void emb;
  // carcasa del motor (cilindro achatado) y empuñadura
  const motor = malla(torno([[1.9, 5.9], [2.6, 6.6], [2.85, 9], [2.85, 15.5], [2.6, 17.2], [1.6, 17.9]], {}), cuerpo, G); motor.scale.set(0.95, 1.05, 1);
  const tapa = caja(0.3, 3.2, 8, acento, G, 2.72, 0, 11.5); void tapa; const tapa2 = caja(0.3, 3.2, 8, acento, G, -2.72, 0, 11.5); void tapa2;
  const mango = bloqueRedondo(3.6, 11, 4.4, 1.2, cuerpo, G, 0.35); mango.rotation.set(0, Math.PI / 2, -0.12); mango.position.set(0, -7.2, 13.4);
  const gmango = bloqueRedondo(3.8, 7, 4.2, 1.2, gomaNegra(), G, 0.3); gmango.rotation.set(0, Math.PI / 2, -0.12); gmango.position.set(0, -7.6, 14.6);
  const gatillo = bloqueRedondo(1.4, 2.6, 1.6, 0.4, pbr(0x111111, { roughness: 0.4 }), G, 0.15); gatillo.rotation.set(0, Math.PI / 2, 0.1); gatillo.position.set(0, -3.6, 10.8);
  caja(1.0, 0.8, 1.2, acento, G, 0, -2.2, 12.6); // selector de sentido
  const led = malla(new THREE.SphereGeometry(0.3, 10, 8), pbr(0xffffff, { emissive: 0xfff5cc, emissiveIntensity: 0.3 }), G, 0, -2.8, 9.4); void led;
  const bat = bloqueRedondo(6.4, 4.0, 10.5, 0.9, cuerpo, G, 0.35); bat.position.set(0, -14.2, 14);
  const bat2 = caja(6.6, 0.7, 10.7, acento, G, 0, -12.2, 14); void bat2;
  for (let i = 0; i < 4; i++) caja(0.6, 0.2, 0.4, pbr(0x3cff6a, { emissive: 0x22aa44, emissiveIntensity: i < 3 ? 0.8 : 0 }), G, -1.2 + i * 0.8, -12.3, 8.6);
  G.userData.partes = { mandril, broca: brocaG, gatillo };
  G.userData.cambiarBit = (b) => { brocaG.remove(brocaG.children[0]); const n = punta(b); brocaG.add(n); brocaG.children.unshift(brocaG.children.pop()); };
  G.userData.anim = (t) => { mandril.rotation.z = t * 25; brocaG.rotation.z = t * 25; gatillo.position.z = 10.8 + (Math.sin(t * 6) > 0 ? 0.25 : 0); };
  return G;
}

// ---------------------------------------------------------------- buscapolos (destornillador comprobador)
export function buscapolos() {
  const G = new THREE.Group(); G.userData.id = 'buscapolos';
  G.add(punta('plano3')); cilZ(0.17, 3.2, MATS.acero(), G, 0, 0, 2.2, 10);
  malla(torno([[0.24, 2.0], [0.32, 2.3], [0.32, 5.5], [0.45, 5.8]], { seg: 14 }), ROJO(), G);
  malla(torno([[0.45, 5.8], [0.7, 6.2], [0.72, 13.2], [0.62, 13.6]], { seg: 20 }), pbr(0xd9ecff, { roughness: 0.05, transparent: true, opacity: 0.45, depthWrite: false }), G);
  const neon = cilZ(0.2, 1.6, pbr(0xff5a1f, { emissive: 0xff3300, emissiveIntensity: 0.0, roughness: 0.3 }), G, 0, 0, 8.2, 12);
  cilZ(0.12, 3.5, pbr(0x4a4a4a, { roughness: 0.5 }), G, 0, 0, 10.6, 8);
  cilZ(0.64, 0.6, MATS.niquel(), G, 0, 0, 13.7, 20); // contacto del dedo
  caja(0.5, 0.15, 4.2, ROJO(), G, 0, 0.78, 10.6); // clip
  G.userData.partes = { neon }; G.userData.encender = (on) => { neon.material = pbr(0xff5a1f, { emissive: 0xff3300, emissiveIntensity: on ? 2.4 : 0, roughness: 0.3 }); };
  G.userData.anim = (t) => G.userData.encender(Math.sin(t * 3) > 0);
  return G;
}

// ---------------------------------------------------------------- multímetro con puntas de prueba
function pantallaLCD(texto) {
  const c = document.createElement('canvas'); c.width = 256; c.height = 112; const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const pintar = (s) => { const g = c.getContext('2d'); g.fillStyle = '#b9c9a5'; g.fillRect(0, 0, 256, 112); g.fillStyle = 'rgba(0,0,0,0.08)'; g.font = 'bold 72px monospace'; g.textAlign = 'right'; g.fillText('88.88', 244, 82); g.fillStyle = '#1b2318'; g.fillText(String(s).slice(0, 6), 244, 82); g.font = 'bold 20px monospace'; g.textAlign = 'left'; g.fillText('AUTO', 10, 24); t.needsUpdate = true; };
  pintar(texto); return { t, pintar };
}
export function multimetro({ conPuntas = true, lectura = '0.00' } = {}) {
  const G = new THREE.Group(); G.userData.id = 'multimetro';
  const funda = bloqueRedondo(9.4, 18.5, 4.2, 1.3, pbr(0xf6c516, { roughness: 0.7 }), G, 0.4); funda.rotation.x = -Math.PI / 2; funda.position.set(0, 2.1, 9.25);
  const cara = bloqueRedondo(8.0, 16.6, 0.4, 0.8, pbr(0x2a2d31, { roughness: 0.5 }), G, 0.1); cara.rotation.x = -Math.PI / 2; cara.position.set(0, 4.3, 9.25);
  const L = pantallaLCD(lectura); const lcd = new THREE.Mesh(new THREE.PlaneGeometry(6.2, 3.0), new THREE.MeshStandardMaterial({ map: L.t, roughness: 0.25, emissive: 0x223311, emissiveIntensity: 0.05 }));
  lcd.rotation.x = -Math.PI / 2; lcd.position.set(0, 4.62, 4.2); G.add(lcd);
  const anillo = new THREE.Mesh(new THREE.CircleGeometry(3.2, 40), new THREE.MeshStandardMaterial({ map: textoTex('V~   V⎓   Ω   •)))   A   OFF', { color: '#f5f5f5', bg: '#2a2d31', w: 512, h: 64, font: 'bold 26px system-ui' }), roughness: 0.5 }));
  anillo.rotation.x = -Math.PI / 2; anillo.position.set(0, 4.58, 10); G.add(anillo);
  const dial = new THREE.Group(); dial.position.set(0, 4.6, 10); G.add(dial);
  malla(new THREE.CylinderGeometry(2.3, 2.3, 0.7, 32), pbr(0x1b1d20, { roughness: 0.6 }), dial, 0, 0.35, 0); // rueda selectora (eje vertical)
  const asa = caja(0.9, 0.5, 4.2, pbr(0x3b4045, { roughness: 0.5 }), dial, 0, 0.9, 0); void asa;
  const flecha = caja(0.25, 0.1, 1.5, pbr(0xffffff), dial, 0, 1.18, -1.1); void flecha;
  const bornas = [[-2.6, 0x111111, 'COM'], [0, 0xd62828, 'VΩ'], [2.6, 0xd62828, '10A']];
  bornas.forEach(([x, c]) => { cilZ(0.45, 0.6, pbr(c, { roughness: 0.4 }), G, x, 4.4, 16.0, 16).rotation.set(0, 0, 0); });
  G.userData.partes = { lcd, dial };
  G.userData.leer = (s) => L.pintar(s);
  if (conPuntas) {
    for (const [x, c, dz] of [[-2.6, 0x111111, -3], [0, 0xd62828, 3]]) {
      const cur = new THREE.CatmullRomCurve3([new THREE.Vector3(x, 4.6, 16), new THREE.Vector3(x * 1.4, 4.0, 20), new THREE.Vector3(x * 2 + 6, 0.5, 24), new THREE.Vector3(14 + dz, 0.6, 18), new THREE.Vector3(16 + dz, 0.6, 8)]);
      malla(new THREE.TubeGeometry(cur, 40, 0.18, 8), pbr(c, { roughness: 0.5 }), G);
      const pr = new THREE.Group(); pr.position.set(16 + dz, 0.8, 8); pr.rotation.y = Math.PI; G.add(pr);
      malla(torno([[0.32, 0], [0.42, 1], [0.45, 7], [0.85, 7.2], [0.85, 7.6], [0.4, 7.8], [0.2, 8.4]], { seg: 16 }), pbr(c, { roughness: 0.45 }), pr).rotation.y = Math.PI;
      const pm = cilZ(0.07, 1.8, MATS.niquel(), pr, 0, 0, -9.3, 8); void pm;
    }
  }
  G.userData.anim = (t) => { dial.rotation.y = -0.8 + Math.round((t % 4) / 1.3) * 0.6; L.pintar(['230.4', '229.8', '0.L', '230.1'][Math.floor(t % 4)]); };
  return G;
}

// ---------------------------------------------------------------- tijera cortatubos (PVC / corrugado)
export function cortatubos() {
  const G = new THREE.Group(); G.userData.id = 'cortatubos';
  const base = new THREE.Group(); G.add(base);
  const yunque = extruir([[-2.6, 0], [2.6, 0], [2.6, -0.8], [1.2, -0.8], [0, -0.1], [-1.2, -0.8], [-2.6, -0.8]].map(([x, y]) => [y, x]), 0.9, MATS.aluminio(), base, { bisel: 0.06 }); yunque.rotation.set(0, Math.PI / 2, 0); yunque.position.set(0, 0, 2.6);
  const m1 = extruir([[-0.8, 2.6], [0.4, 2.6], [0.1, 20], [-1.4, 20]].map(([y, z]) => [z, y]), 1.6, gomaNaranja(), base, { bisel: 0.25 }); m1.rotation.set(0, -Math.PI / 2, 0);
  const hoja = new THREE.Group(); hoja.position.set(0, 0, 5.4); G.add(hoja);
  const sil = []; for (let i = 0; i <= 12; i++) { const a = Math.PI * 0.5 + (i / 12) * Math.PI * 0.55; sil.push([Math.cos(a) * 4.8 + 1.2, Math.sin(a) * 4.8 - 3.8]); }
  const hs = extruir(sil.concat([[0.3, -0.3], [0.6, 0.2]]).map(([z, y]) => [z, y]), 0.12, MATS.cromo(), hoja, { bisel: 0.02 }); hs.rotation.set(0, -Math.PI / 2, 0); hs.position.z = 0;
  const m2 = extruir([[0.2, 0], [1.2, 0.3], [2.8, 14], [1.4, 14.3]].map(([y, z]) => [z, y]), 1.4, pbr(0x2b2e32, { roughness: 0.5 }), hoja, { bisel: 0.2 }); m2.rotation.set(0, -Math.PI / 2, 0);
  cilX(0.45, 2.2, MATS.acero(), G, 0, 0.2, 5.4, 16);
  hoja.rotation.x = -0.35;
  G.userData.partes = { hoja }; G.userData.cerrar = (f) => { hoja.rotation.x = -0.35 + 0.32 * f; };
  G.userData.anim = (t) => G.userData.cerrar((Math.sin(t * 3) + 1) / 2);
  return G;
}

// ---------------------------------------------------------------- guía pasacables (bobina con cinta de nylon)
export function guia({ fuera = 6 } = {}) {
  const G = new THREE.Group(); G.userData.id = 'guia';
  const bob = new THREE.Group(); bob.position.set(0, 1.6, 16); G.add(bob);
  malla(torno([[0, -1.6], [10.5, -1.6], [11, -1.2], [11, 1.2], [10.6, 1.6], [9.6, 1.7]], { seg: 40 }), pbr(0xff7a12, { roughness: 0.5, side: THREE.DoubleSide }), bob);
  malla(new THREE.CircleGeometry(10.4, 40), pbr(0x26292d, { roughness: 0.6 }), bob, 0, 0, -1.4);
  bob.rotation.x = -Math.PI / 2;
  const tapa = malla(new THREE.CircleGeometry(9.6, 40), pbr(0x9fd5ff, { roughness: 0.05, transparent: true, opacity: 0.35, depthWrite: false }), bob, 0, 0, 1.65); void tapa;
  const espiral = []; for (let i = 0; i <= 300; i++) { const a = i * 0.2; const r = 3 + (i / 300) * 6; espiral.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0.6)); }
  malla(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(espiral), 300, 0.12, 6), pbr(0xf6e36b, { roughness: 0.35 }), bob);
  const asa = cilZ(0.9, 2.6, gomaNegra(), bob, 0, 0, 2.8, 16); void asa;
  const cintaG = new THREE.Group(); G.add(cintaG);
  const cinta = cilZ(0.2, 1, pbr(0xf6e36b, { roughness: 0.35 }), cintaG, 0, 0, 0, 8);
  const cabeza = new THREE.Group(); G.add(cabeza);
  const muelle = []; for (let i = 0; i <= 60; i++) { const a = i * 0.9; muelle.push(new THREE.Vector3(Math.cos(a) * 0.28, Math.sin(a) * 0.28 + 0.2, -i * 0.04)); }
  malla(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(muelle), 120, 0.05, 5), MATS.acero(), cabeza);
  malla(new THREE.SphereGeometry(0.34, 14, 10), MATS.laton(), cabeza, 0, 0.2, -2.5);
  G.userData.partes = { cinta, cabeza };
  G.userData.sacar = (L) => { L = Math.max(0.5, L); cinta.scale.y = L; cinta.position.set(0, 0.2, 5.5 - L / 2); cabeza.position.set(0, 0, 5.5 - L); };
  G.userData.sacar(fuera);
  G.userData.anim = (t) => { G.userData.sacar(2 + ((t * 6) % 18)); bob.rotation.z = -t * 2; };
  return G;
}

export function crimpadora() { return alicate('crimpadora'); }

// ---------------------------------------------------------------- catálogo
export const KIT_HERRAMIENTAS = {
  destornillador_plano: { n: 'Destornillador plano aislado 1000 V', f: 'Destornilladores', crear: () => destornillador({ punta: 'plano3' }) },
  destornillador_ph: { n: 'Destornillador Phillips PH2 aislado', f: 'Destornilladores', crear: () => destornillador({ punta: 'PH2' }) },
  destornillador_pz: { n: 'Destornillador Pozidriv PZ1 aislado', f: 'Destornilladores', crear: () => destornillador({ punta: 'PZ1' }) },
  destornillador_torx: { n: 'Destornillador Torx T20 aislado', f: 'Destornilladores', crear: () => destornillador({ punta: 'T20' }) },
  alicate_universal: { n: 'Alicate universal aislado', f: 'Alicates', crear: () => alicate('universal') },
  alicate_corte: { n: 'Alicate de corte diagonal', f: 'Corte y pelado', crear: () => alicate('corte') },
  alicate_punta: { n: 'Alicate de punta', f: 'Alicates', crear: () => alicate('punta') },
  pelacables: { n: 'Pelacables automático', f: 'Corte y pelado', crear: pelacables },
  cutter: { n: 'Cutter', f: 'Corte y pelado', crear: cutter },
  tijeras: { n: 'Tijeras de electricista', f: 'Corte y pelado', crear: tijeras },
  flexometro: { n: 'Flexómetro', f: 'Medida y comprobación', crear: () => flexometro() },
  nivel: { n: 'Nivel de burbuja', f: 'Medida y comprobación', crear: () => nivel() },
  taladro: { n: 'Taladro-atornillador de batería', f: 'Máquinas', crear: () => taladro() },
  buscapolos: { n: 'Buscapolos (comprobador de tensión)', f: 'Medida y comprobación', crear: buscapolos },
  multimetro: { n: 'Polímetro (multímetro) con puntas', f: 'Medida y comprobación', crear: () => multimetro() },
  cortatubos: { n: 'Tijera cortatubos', f: 'Corte y pelado', crear: cortatubos },
  guia: { n: 'Guía pasacables', f: 'Canalización', crear: () => guia() },
  crimpadora: { n: 'Crimpadora de terminales', f: 'Alicates', crear: crimpadora },
};
export function herramienta(id, o) { const h = KIT_HERRAMIENTAS[id]; if (!h) return null; const g = id.startsWith('destornillador') && o?.punta ? destornillador(o) : h.crear(o); g.userData.kit = id; return g; }
// LOD: versión ligera con solo las piezas más grandes (para mesas con muchas herramientas)
export function conLOD(g, distancia = 160) {
  const lod = new THREE.LOD(); lod.addLevel(g, 0);
  const lig = new THREE.Group(); const ms = []; g.updateMatrixWorld(true); g.traverse((m) => { if (m.isMesh) ms.push(m); });
  ms.sort((a, b) => (b.geometry.boundingSphere || (b.geometry.computeBoundingSphere(), b.geometry.boundingSphere)).radius - (a.geometry.boundingSphere || (a.geometry.computeBoundingSphere(), a.geometry.boundingSphere)).radius);
  const inv = new THREE.Matrix4().copy(g.matrixWorld).invert();
  for (const m of ms.slice(0, 5)) { const c = new THREE.Mesh(m.geometry, m.material); c.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv, m.matrixWorld)); lig.add(c); }
  lod.addLevel(lig, distancia); lod.userData = g.userData; return lod;
}

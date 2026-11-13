// Modo «Taller de herramientas»: panel perforado con las herramientas colgadas, banco con piezas de práctica,
// ficha de cada herramienta, animación de uso y un test rápido (qué herramienta / qué punta).
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { estudio, camaraSuave } from '../kit3d/escena.js';
import { HERRAMIENTAS, herramienta, PUNTAS, REFERENCIAS } from './catalogo.js';
import { herramienta3D, punta3D, mecanismo3D, cajaEmpalme3D, modulo3D, caja, cil, mat, MAT, rotulo } from './modelos3d.js';
import { posicionesCaja } from './modelo.js';
import { entorno } from '../kit3d/base.js';

const esc = (t) => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const PIEZA = 'viv:v1:tallerTest';
export const PREGUNTAS = [
  { q: '¿Qué punta usas para apretar los bornes de un magnetotérmico de 1 módulo (tipo Resi9)?', o: ['Plana 3,5 mm', 'Pozidriv PZ2', 'Torx T20', 'Phillips PH1'], ok: 1, x: 'Los bornes de la aparamenta modular llevan tornillo Pozidriv PZ2 (también admite plana de 5,5 mm) y se aprietan a unos 2 N·m.' },
  { q: '¿Cuánto pelas la punta del cable para un conector de palanca tipo WAGO 221?', o: ['5 mm', '11 mm', '20 mm', 'Todo lo que se pueda'], ok: 1, x: 'El fabricante indica 11 mm: si pelas menos, el aislante queda dentro y no hace contacto; si pelas más, queda cobre a la vista.' },
  { q: '¿Con qué sabes rápido cuál de los dos agujeros del enchufe es la fase?', o: ['Con el flexómetro', 'Con el buscapolos', 'Con el nivel', 'Con el alicate de punta'], ok: 1, x: 'La lámpara del buscapolos se enciende al tocar la fase. Para trabajar sin tensión hay que confirmarlo con el multímetro.' },
  { q: '¿Con qué cortas el tubo corrugado a medida?', o: ['Con el cutter', 'Con la tijera cortatubos', 'Con el alicate universal', 'Con el taladro'], ok: 1, x: 'La tijera cortatubos deja el corte recto y sin rebabas. Antes mide y marca con el flexómetro.' },
  { q: 'Tubo en superficie: ¿a qué distancia máxima pones las grapas?', o: ['10 cm', '50 cm', '1 m', '2 m'], ok: 1, x: 'La ITC-BT-21 pide abrazaderas como máximo cada 0,50 m, y una cerca de cada caja y de cada curva.' },
  { q: 'Antes de enchufar el tablero, ¿cómo compruebas que no hay un cortocircuito?', o: ['Con el buscapolos', 'Con el multímetro en continuidad, sin tensión', 'Enchufándolo un momento', 'Mirando los colores'], ok: 1, x: 'Con la manguera desenchufada, mide entre fase y neutro de cada circuito: con todo apagado tiene que marcar «OL» (circuito abierto).' },
  { q: '¿Qué tiene que llevar un destornillador para trabajar cerca de partes con tensión?', o: ['Mango de colores', 'Aislamiento 1000 V (doble triángulo, EN 60900)', 'Punta imantada', 'Que sea de una marca cara'], ok: 1, x: 'Las herramientas aisladas VDE llevan el símbolo del doble triángulo y «1000 V».' },
  { q: '¿Puedes apretar los bornes de los mecanismos con el taladro-atornillador?', o: ['Sí, es más rápido', 'No: se pasa el par y se daña el cable o el borne', 'Solo si es de batería', 'Solo los de tierra'], ok: 1, x: 'Los bornes se aprietan a mano con la punta correcta (0,8 N·m en mecanismos y 2 N·m en magnetotérmicos).' },
  { q: '¿Qué herramienta usas para pelar un cable unipolar sin dañar el cobre?', o: ['Cutter', 'Dientes', 'Pelacables con tope', 'Alicate de corte'], ok: 2, x: 'El pelacables automático ajusta la mordaza a la sección y tiene tope de longitud.' },
  { q: '¿Qué punta encaja en un tornillo de cruz con rayitas entre los brazos?', o: ['Phillips (PH)', 'Pozidriv (PZ)', 'Torx', 'Plana'], ok: 1, x: 'Las rayitas a 45° identifican la cabeza Pozidriv. Con una Phillips baila y se estropea.' },
];

export class Taller {
  constructor(lab) { this.lab = lab; this.sel = null; this.punta = 'PZ1'; this.test = null; this.labels = []; }
  init(renderer) {
    if (this.scene) return;
    const s = this.scene = new THREE.Scene(); s.background = new THREE.Color(0xe7e2da);
    estudio(null, s, { escala: 150, dir: [60, 260, 220], objetivo: [0, 60, 0], sombraR: 155, intPrincipal: 1.8, intCielo: 1.6, suelo: 0x7a6a56, entorno: false, mapa: 1536 }); entorno(renderer, s, 0.45);
    this.camera = new THREE.PerspectiveCamera(38, 1, 2, 3000);
    const c = this.controls = new OrbitControls(this.camera, renderer.domElement); camaraSuave(c, { polarMax: false, min: 30, max: 520 }); c.enabled = false;
    c.minPolarAngle = 0.4; c.maxPolarAngle = 1.75; c.minAzimuthAngle = -1.1; c.maxAzimuthAngle = 1.1;
    // sala: suelo, pared, panel perforado, banco
    const suelo = new THREE.Mesh(new THREE.PlaneGeometry(800, 600), mat(0xbfb6a8, { roughness: 0.9 })); suelo.rotation.x = -Math.PI / 2; suelo.receiveShadow = true; s.add(suelo);
    const pared = new THREE.Mesh(new THREE.PlaneGeometry(800, 400), mat(0xe9e4dc)); pared.position.set(0, 200, -2); pared.receiveShadow = true; s.add(pared);
    const pt = document.createElement('canvas'); pt.width = 512; pt.height = 256; const g = pt.getContext('2d'); g.fillStyle = '#d7b98a'; g.fillRect(0, 0, 512, 256); g.fillStyle = '#5a4630'; for (let x = 8; x < 512; x += 16) for (let y = 8; y < 256; y += 16) { g.beginPath(); g.arc(x, y, 2.6, 0, 7); g.fill(); }
    const tx = new THREE.CanvasTexture(pt); tx.colorSpace = THREE.SRGBColorSpace;
    const panel = new THREE.Mesh(new THREE.BoxGeometry(230, 80, 1.2), [MAT.madera(), MAT.madera(), MAT.madera(), MAT.madera(), new THREE.MeshStandardMaterial({ map: tx, roughness: 0.85 }), MAT.madera()]); panel.position.set(0, 175, 0); panel.receiveShadow = true; s.add(panel);
    caja(240, 4, 75, mat(0x8a6a44, { roughness: 0.7 }), 0, 88, 0, s).rotation.x = 0; // tablero del banco (x,y,z → caja apoya en z)
    const banco = s.children[s.children.length - 1]; banco.rotation.x = 0; banco.position.set(0, 88, 37.5); banco.geometry = new THREE.BoxGeometry(240, 4, 75);
    for (const [x, z] of [[-112, 6], [112, 6], [-112, 70], [112, 70]]) { const p = new THREE.Mesh(new THREE.BoxGeometry(5, 86, 5), MAT.grisOsc()); p.position.set(x, 43, z); s.add(p); }
    // herramientas colgadas
    this.G = new THREE.Group(); s.add(this.G); this.objs = new Map(); this.labels = [];
    const colgar = (id, x, y, o = {}) => { const t = herramienta3D(id, o); t.rotation.x = o.tumbada ? 0 : -Math.PI / 2; t.rotation.z = o.rz ?? (o.tumbada ? 0 : Math.PI); t.position.set(x, y, o.z ?? 4); t.userData.herr = id; t.userData.punta = o.punta; t.traverse((m) => { m.userData.herr = id; m.userData.punta = o.punta; m.castShadow = true; }); this.G.add(t); return t; };
    const puntasDest = ['plano3', 'plano5', 'PH2', 'PZ1', 'PZ2', 'T20'];
    puntasDest.forEach((p, i) => { colgar('destornillador', -100 + i * 6.5, 150, { punta: p }); });
    this.labels.push({ txt: 'Destornilladores (plana, PH, PZ, Torx)', v: new THREE.Vector3(-84, 172, 6), cls: 'tl' });
    const pos = { alicate: [-50, 152], corte: [-38, 152], punta: [-26, 150], pelacables: [-12, 148], crimpadora: [2, 150], cutter: [14, 150], tijeras: [24, 152], cortatubos: [36, 150], buscapolos: [50, 152], guia: [-60, 185], flexometro: [70, 185], multimetro: [92, 165], taladro: [-80, 104], epi: [100, 120] };
    for (const [id, [x, y]] of Object.entries(pos)) {
      const o = id === 'flexometro' || id === 'guia' ? { tumbada: true } : id === 'multimetro' ? { tumbada: true, z: 2 } : id === 'taladro' ? { tumbada: true, z: 30 } : id === 'epi' ? { tumbada: true, z: 30 } : {};
      const t = colgar(id, x, y, o); if (id === 'taladro') { t.rotation.set(0, -Math.PI / 2, 0); t.position.set(-90, 105, 30); } if (id === 'epi') { t.rotation.set(-Math.PI / 2, 0, 0); t.position.set(95, 91, 40); }
      if (id === 'multimetro') { t.rotation.set(-0.25, 0, 0); t.position.set(80, 100, 18); }
      if (id === 'flexometro' || id === 'guia') { t.rotation.set(Math.PI / 2, 0, 0); }
      this.objs.set(id, t);
    }
    const nv = colgar('nivel', 0, 200, { tumbada: true }); this.objs.set('nivel', nv);
    this.objs.set('destornillador', this.G.children.find((o) => o.userData.punta === 'PZ1'));
    for (const h of HERRAMIENTAS) { const o = this.objs.get(h.id); if (!o || h.id === 'destornillador') continue; const p = o.position.clone(); this.labels.push({ txt: h.n.split(' (')[0], v: new THREE.Vector3(p.x, h.id === 'taladro' ? 122 : h.id === 'epi' ? 98 : h.id === 'multimetro' ? 112 : h.id === 'flexometro' || h.id === 'guia' ? 197 : h.id === 'nivel' ? 206 : 135, p.z + 3), cls: 'tl' }); }
    // banco: tablero de prácticas con un enchufe abierto, una caja con fichas y un magnetotérmico; tubo y cable
    const B = this.B = new THREE.Group(); s.add(B);
    const tp = caja(80, 40, 2, MAT.madera(), 0, 112, 6, B); void tp;
    const ench = mecanismo3D('enchufe'); ench.userData.partes.caja.visible = false; ench.userData.partes.marco.visible = false; ench.userData.partes.tecla.visible = false; ench.rotation.y = Math.PI; ench.position.set(-28, 114, 13); B.add(ench); this.ench = ench;
    const front = mecanismo3D('enchufe', { tablero: true }); front.position.set(-10, 114, 8); B.add(front); this.frente = front;
    const ce = cajaEmpalme3D(100, { B1: 'w413', B2: 'w413', B3: 'w412', B4: 'w415', B5: 'i3', B6: 'r4' }, posicionesCaja(100)); ce.position.set(10, 114, 8); B.add(ce); this.ce = ce;
    const md = modulo3D('mt', { In: 16, curva: 'C', circ: 'C2' }); md.position.set(28, 114, 8); B.add(md); this.mod = md;
    this.tubo = this.tuboPieza(60); this.tubo.position.set(-30, 93.6, 40); B.add(this.tubo);
    this.cable = this.cablePieza(30); this.cable.position.set(-20, 91.4, 58); B.add(this.cable);
    // muestrario de puntas
    const mu = new THREE.Group(); mu.position.set(55, 90, 52); B.add(mu); caja(26, 1.2, 8, MAT.madera(), 0, 0.6, -4, mu).rotation.x = 0;
    puntasDest.forEach((p, i) => { const g = punta3D(p); g.scale.setScalar(3.2); g.rotation.x = -Math.PI / 2; g.position.set(-10 + i * 4, 2.2, 0); mu.add(g); g.traverse((m) => { m.userData.punta = p; }); this.labels.push({ txt: PUNTAS[p].n.replace('Phillips ', '').replace('Pozidriv ', '').replace('Plana ', 'Plana ').replace(' mm', ''), v: new THREE.Vector3(55 - 10 + i * 4, 97, 55), cls: 'mini' }); });
    this.labels.push({ txt: 'Puntas', v: new THREE.Vector3(55, 100, 48), cls: 'tl' }, { txt: 'Banco de prácticas', v: new THREE.Vector3(0, 134, 8), cls: 'tl' });
    this.actor = new THREE.Group(); s.add(this.actor);
    this.ray = new THREE.Raycaster(); this.ndc = new THREE.Vector2();
    this.vista();
  }
  tuboPieza(L) { const g = new THREE.Group(); const t = this.lab.texTubo().clone(); t.repeat.set(L / 1.2, 1); t.needsUpdate = true; const m = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, L, 14, 1, true), new THREE.MeshStandardMaterial({ map: t, roughness: 0.6, side: THREE.DoubleSide })); m.rotation.z = Math.PI / 2; m.position.x = L / 2; g.add(m); g.userData.L = L; return g; }
  cablePieza(L) { const g = new THREE.Group(); const c = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, L, 10), mat(0x7a4a22)); c.rotation.z = Math.PI / 2; c.position.x = L / 2; g.add(c); const cu = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 1.1, 8), MAT.cobre()); cu.rotation.z = Math.PI / 2; cu.position.x = L - 0.55; cu.visible = false; g.add(cu); g.userData.cu = cu; g.userData.L = L; return g; }
  vista() { this.camera.position.set(0, 160, 230); this.controls.target.set(0, 130, 20); this.controls.update(); }
  activar(on) { if (this.controls) this.controls.enabled = on; }
  // ------------------------------------------------------------ interacción
  pick(e, dom) {
    const r = dom.getBoundingClientRect(); this.ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    this.ray.setFromCamera(this.ndc, this.camera); const hits = this.ray.intersectObjects([this.G, this.B], true);
    for (const h of hits) { if (h.object.userData.herr) return { herr: h.object.userData.herr, punta: h.object.userData.punta }; if (h.object.userData.punta) return { herr: 'destornillador', punta: h.object.userData.punta }; }
    return null;
  }
  onDown(e, dom) { const p = this.pick(e, dom); if (!p) return false; this.elegir(p.herr, p.punta); return true; }
  elegir(id, punta) {
    this.sel = id; if (punta) this.punta = punta;
    const o = this.objs.get(id); if (o) { const p = new THREE.Vector3(); o.getWorldPosition(p); this.vuelo = { t: 0, de: this.controls.target.clone(), a: p.clone().add(new THREE.Vector3(0, -6, 0)), cde: this.camera.position.clone(), ca: p.clone().add(new THREE.Vector3(18, 4, 95)) }; }
    this.G.traverse((m) => { if (m.isMesh && m.material?.emissive) { if (!m.userData.matOrig) m.userData.matOrig = m.material; m.material = m.userData.herr === id && (id !== 'destornillador' || m.userData.punta === this.punta) ? (m.userData.matSel ||= Object.assign(m.userData.matOrig.clone(), { emissive: new THREE.Color(0x2255aa), emissiveIntensity: 0.5 })) : m.userData.matOrig; } });
    this.lab.lado(); this.lab.paleta();
  }
  frame(dt) {
    if (this.vuelo) { const v = this.vuelo; v.t = Math.min(1, v.t + dt * 1.6); const f = 1 - (1 - v.t) ** 3; this.controls.target.lerpVectors(v.de, v.a, f); this.camera.position.lerpVectors(v.cde, v.ca, f); if (v.t >= 1) this.vuelo = null; }
    if (this.anim) { const a = this.anim; a.t += dt; const f = Math.min(1, a.t / a.dur); a.paso(f); if (f >= 1) { a.fin?.(); this.anim = null; } }
    this.controls.update();
  }
  // ------------------------------------------------------------ animaciones de uso
  usar(id = this.sel) {
    if (!id) return; this.actor.clear(); this.reset();
    const A = this.actor; const t = herramienta3D(id, { punta: this.punta }); A.add(t);
    const W = (o, v) => { const p = v.clone(); o.localToWorld(p); return p; };
    const lerp = (a, b, f) => a + (b - a) * f;
    const enfocar = (p, d = 60) => { this.vuelo = { t: 0, de: this.controls.target.clone(), a: p.clone(), cde: this.camera.position.clone(), ca: p.clone().add(new THREE.Vector3(14, 12, d)) }; };
    let paso = () => {}, dur = 2.4, txt = '';
    if (id === 'destornillador') {
      const b = this.ench.userData.bornes.L; const p = W(this.ench.userData.partes.mecanismo, b.pos.clone().add(new THREE.Vector3(0, 0.8, 0))); enfocar(p, 40);
      t.position.copy(p); dur = 2.6; txt = `Punta ${PUNTAS[this.punta].n} en el borne L del enchufe: ${['PZ1', 'plano3'].includes(this.punta) ? 'encaja bien, aprieta hasta notar resistencia (0,8 N·m).' : 'NO es la punta de este borne (PZ1 o plana 3,5 mm): baila y estropea la cabeza.'}`;
      paso = (f) => { t.position.z = p.z + lerp(12, 0, Math.min(1, f / 0.3)); t.rotation.z = f > 0.3 && f < 0.9 ? (f - 0.3) * 30 * (['PZ1', 'plano3'].includes(this.punta) ? 1 : 0.15) : t.rotation.z; if (f > 0.9) t.position.z = p.z + (f - 0.9) * 80; };
    } else if (id === 'taladro') {
      const p = new THREE.Vector3(-38, 100, 8); enfocar(p, 70); t.position.copy(p); txt = 'Taladra el tablero con broca de madera (gafas puestas) y atornilla la caja o la grapa con la punta PH2. No lo uses para apretar bornes.';
      paso = (f) => { t.position.z = p.z + lerp(20, 1, Math.min(1, f / 0.4)); t.userData.anim?.(f * 3); if (f > 0.85) t.position.z = p.z + (f - 0.85) * 120; };
    } else if (id === 'pelacables' || id === 'corte' || id === 'alicate' || id === 'punta' || id === 'crimpadora') {
      const c = this.cable; const L = c.userData.L; const p = W(c, new THREE.Vector3(L - 1.1, 0, 0)); enfocar(p, 40); t.rotation.set(-Math.PI / 2, 0, 0); t.position.copy(p);
      const cu = c.userData.cu; const funda = c.children[0];
      txt = { pelacables: 'Mete la punta del cable en la mordaza de su sección, con el tope a 11 mm, y aprieta: el aislante sale sin marcar el cobre.', corte: 'Corta el cable a la medida con la punta hacia abajo: el trozo sale disparado (gafas).', alicate: 'Sujeta y dobla el cable sin morder el aislante.', punta: 'Con el alicate de punta haces el ojal para un borne de tornillo o doblas en sitios estrechos.', crimpadora: 'Mete el cable pelado en la puntera y crimpa con la boca de su tamaño: los hilos ya no se abren en el borne.' }[id];
      paso = (f) => { t.position.y = p.y + lerp(10, 0, Math.min(1, f / 0.3)); const cierra = f > 0.35 && f < 0.85 ? Math.min(1, (f - 0.35) / 0.15) : 0; t.userData.cerrar?.(cierra); t.userData.abrir?.(0.3 * (1 - cierra));
        if (id === 'pelacables' && f > 0.5) { const k = Math.min(1, (f - 0.5) / 0.3); cu.visible = true; funda.scale.y = (L - 1.1 * k) / L; funda.position.x = (L - 1.1 * k) / 2; cu.position.x = L - 0.55; }
        if (id === 'corte' && f > 0.5) { c.children[0].scale.y = 0.9; c.children[0].position.x = L * 0.45; }
        if (id === 'alicate' && f > 0.5) c.rotation.y = -(f - 0.5) * 0.6;
        if (f > 0.85) t.position.y = p.y + (f - 0.85) * 80; };
    } else if (id === 'cortatubos' || id === 'flexometro') {
      const tb = this.tubo; const L = tb.userData.L; const p0 = W(tb, new THREE.Vector3(0, 1.2, 0)); enfocar(W(tb, new THREE.Vector3(L / 2, 0, 0)), 80);
      if (id === 'flexometro') { t.position.copy(p0).add(new THREE.Vector3(0, 1.4, 0)); t.rotation.set(0, Math.PI / 2, 0); txt = `Engancha la uña en el borde y extiende la cinta: el tramo mide ${L} cm. Márcalo antes de cortar.`;
        this.lab.labels2 = [{ txt: '0', v: p0.clone() }];
        paso = (f) => { const l = Math.min(1, f / 0.7) * L; t.userData.extender?.(Math.max(0.5, l)); this.medida = { txt: Math.round(l) + ' cm', v: p0.clone().add(new THREE.Vector3(l, 4, 0)) }; };
      } else { const p = W(tb, new THREE.Vector3(L * 0.75, 0, 0)); t.position.copy(p); t.rotation.set(-Math.PI / 2, 0, 0); txt = 'Corta en la marca con la tijera cortatubos, recto y sin aplastar el tubo. Luego sujeta el tubo con grapas cada 50 cm como mucho.';
        paso = (f) => { t.position.y = p.y + lerp(12, 0, Math.min(1, f / 0.35)); t.userData.cerrar?.(f > 0.4 && f < 0.85 ? Math.min(1, (f - 0.4) / 0.2) : 0); if (f > 0.6) tb.children[0].scale.y = 0.75 + 0.25 * (1 - Math.min(1, (f - 0.6) / 0.2)); if (f > 0.85) t.position.y = p.y + (f - 0.85) * 90; }; }
    } else if (id === 'guia') {
      const tb = this.tubo; const L = tb.userData.L; const p = W(tb, new THREE.Vector3(0, 0, 0)); enfocar(W(tb, new THREE.Vector3(L / 2, 0, 0)), 80); t.position.copy(p).add(new THREE.Vector3(-14, 0, 0)); t.rotation.set(0, Math.PI / 2, 0); txt = 'Mete la guía pasacables por el tubo hasta que salga por la otra caja, engancha las puntas de los cables (peladas y dobladas, con cinta) y tira despacio desde el otro lado.';
      paso = (f) => { t.userData.sacar?.(2 + Math.min(1, f / 0.8) * (L + 14)); };
    } else if (id === 'tijeras') {
      const p = W(this.cable, new THREE.Vector3(14, 0, 0)); enfocar(p, 40); t.position.copy(p); t.rotation.set(-Math.PI / 2, 0, 0); txt = 'Las tijeras de electricista cortan cables finos, cinta y bridas; tienen una muesca para pelar cables de pequeña sección.';
      paso = (f) => { t.position.y = p.y + lerp(10, 0, Math.min(1, f / 0.3)); t.userData.abrir?.(f > 0.4 && f < 0.7 ? 0.05 : 0.35); if (f > 0.85) t.position.y = p.y + (f - 0.85) * 80; };
    } else if (id === 'cutter') {
      const p = W(this.cable, new THREE.Vector3(8, 0, 0)); enfocar(p, 50); t.position.copy(p); t.rotation.set(-Math.PI / 2, 0, -Math.PI / 2); txt = 'El cutter se usa para abrir la cubierta de una manguera, cortando HACIA FUERA y con guantes. No para pelar cables unipolares: hace una muesca en el cobre.';
      paso = (f) => { t.position.x = p.x + lerp(-4, 14, f); t.position.y = p.y + 1.5; };
    } else if (id === 'nivel') {
      const p = W(this.ce, new THREE.Vector3(0, 6.2, 3)); enfocar(p, 70); t.position.copy(p); t.rotation.set(0, 0, 0.06); txt = 'Apoya el nivel en el canto de la caja o del cuadro: la burbuja tiene que quedar entre las dos rayas antes de atornillar.';
      paso = (f) => { t.rotation.z = 0.06 * (1 - Math.min(1, f / 0.6)); };
    } else if (id === 'buscapolos' || id === 'multimetro') {
      const ag = this.frente.userData.agujeros; const pL = W(this.frente, ag.L), pN = W(this.frente, ag.N); enfocar(pL.clone().lerp(pN, 0.5), 45);
      if (id === 'buscapolos') { t.position.copy(pL); txt = 'Con el enchufe con tensión: en la FASE se enciende la lámpara del buscapolos; en el neutro, no. Solo orienta: para trabajar, comprueba ausencia de tensión con el multímetro.';
        paso = (f) => { const enN = f > 0.5; t.position.copy(enN ? pN : pL); t.position.z += f % 0.5 < 0.15 ? 6 - (f % 0.5) * 40 : 0; t.userData.encender?.(!enN && f % 0.5 > 0.15); this.medida = { txt: enN ? 'Neutro: no se enciende' : 'Fase: ¡se enciende!', v: (enN ? pN : pL).clone().add(new THREE.Vector3(0, 3, 2)) }; }; }
      else { t.position.copy(pL).add(new THREE.Vector3(14, -6, 2)); t.rotation.set(-0.2, -0.3, 0); txt = 'Multímetro en V~ (CAT III): punta roja en la fase y negra en el neutro → unos 230 V. Sin tensión, en continuidad (Ω), comprueba que no hay cortocircuitos.';
        const sonda = (col, p) => { const s = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 8, 8), mat(col)); s.rotation.x = Math.PI / 2; s.position.copy(p).add(new THREE.Vector3(0, 0, 4)); A.add(s); return s; };
        sonda(0xd01a1a, pL); sonda(0x111111, pN); paso = (f) => { t.userData.leer?.(f > 0.3 ? '230.1' : '- - -'); this.medida = { txt: f > 0.3 ? '230 V~' : '...', v: t.position.clone().add(new THREE.Vector3(0, 6, 4)) }; }; }
    } else if (id === 'epi') { const p = this.objs.get('epi').position.clone(); enfocar(p, 60); t.position.copy(p).add(new THREE.Vector3(0, 20, 0)); txt = 'Gafas para cortar, taladrar y pelar; guantes para el tubo y el cutter. Y siempre: desconecta, bloquea, comprueba que no hay tensión, pon a tierra y señaliza.'; paso = (f) => { t.rotation.y = f * Math.PI * 2; }; }
    this.texto = txt; this.anim = { t: 0, dur, paso, fin: () => { setTimeout(() => { if (!this.anim) { this.actor.clear(); this.medida = null; } }, 1800); } };
    this.lab.lado();
  }
  reset() { const c = this.cable; if (c) { c.userData.cu.visible = false; c.children[0].scale.set(1, 1, 1); c.children[0].position.x = c.userData.L / 2; c.rotation.set(0, 0, 0); } if (this.tubo) this.tubo.children[0].scale.set(1, 1, 1); this.medida = null; }
  etiquetas() { return this.medida ? [...this.labels, { ...this.medida, cls: 'on' }] : this.labels; }
  // ------------------------------------------------------------ paneles
  paletaHTML() {
    const fams = [...new Set(HERRAMIENTAS.map((h) => h.fam))];
    return `<p class="vv-small">Pulsa una herramienta en el panel o en la lista. Gira con el botón derecho y acerca con la rueda.</p>${fams.map((f) => `<h4>${esc(f)}</h4><div class="vv-items">${HERRAMIENTAS.filter((h) => h.fam === f).map((h) => `<button data-herr="${h.id}" class="${this.sel === h.id ? 'on' : ''}"><span>${h.icon}</span>${esc(h.n.split(' (')[0])}</button>`).join('')}</div>`).join('')}
      <div class="vv-fila"><button class="vv-btn small" data-v="tallerVista">⌂ Vista general</button></div>`;
  }
  ladoHTML() {
    const h = this.sel && herramienta(this.sel);
    let s = '';
    if (h) {
      s += `<section class="vv-insp vv-ficha"><h4>${h.icon} ${esc(h.n)}</h4><p><b>Para qué sirve.</b> ${esc(h.para)}</p><p><b>Seguridad.</b> ${esc(h.seguridad)}</p>${h.puntas ? `<p><b>Puntas.</b> ${esc(h.puntas)}</p>` : ''}<p class="vv-small">Marcas profesionales de referencia: ${esc(h.marcas)}.</p>`;
      if (h.id === 'destornillador') s += `<div class="vv-puntas">${Object.entries(PUNTAS).map(([k, p]) => `<button data-punta="${k}" class="${this.punta === k ? 'on' : ''}" title="${esc(p.usos)}">${esc(p.n)}</button>`).join('')}</div><p class="vv-small">${esc(PUNTAS[this.punta].n)}: ${esc(PUNTAS[this.punta].usos)}</p>`;
      s += `<div class="vv-fila"><button class="vv-btn primary" data-v="usarHerr">▶ Ver cómo se usa</button></div>${this.texto && this.sel === this.anim?.id ? '' : ''}${this.texto ? `<p class="vv-uso">${esc(this.texto)}</p>` : ''}</section>`;
    } else s += '<section class="vv-insp"><h4>🧰 Taller de herramientas</h4><p class="vv-small">Estas son las herramientas del maletín para montar el tablero (Trabajo 1 de la SA1). Elige una para ver su ficha, sus puntas y cómo se usa en el banco de prácticas.</p></section>';
    s += this.testHTML(); return s;
  }
  testHTML() {
    const T = this.test; const mejor = (() => { try { return JSON.parse(localStorage.getItem(PIEZA)); } catch (e) { return null; } })();
    if (!T) return `<section class="vv-insp"><h4>✍️ Test rápido</h4><p class="vv-small">${PREGUNTAS.length} preguntas: qué herramienta, qué punta, cuánto se pela.${mejor != null ? ` Tu mejor resultado: <b>${mejor}/${PREGUNTAS.length}</b>.` : ''}</p><button class="vv-btn" data-v="testEmpezar">Empezar el test</button></section>`;
    if (T.i >= PREGUNTAS.length) return `<section class="vv-insp"><h4>✍️ Resultado: ${T.bien}/${PREGUNTAS.length}</h4><p class="vv-small">${T.bien === PREGUNTAS.length ? '¡Perfecto!' : 'Repasa las fichas de las herramientas y vuelve a intentarlo.'}</p><button class="vv-btn" data-v="testEmpezar">Repetir</button></section>`;
    const P = PREGUNTAS[T.i];
    return `<section class="vv-insp vv-test"><h4>Pregunta ${T.i + 1} de ${PREGUNTAS.length}</h4><p>${esc(P.q)}</p><div class="vv-ops">${P.o.map((o, i) => `<button data-resp="${i}" ${T.r != null ? 'disabled' : ''} class="${T.r != null && i === P.ok ? 'ok' : T.r === i ? 'ko' : ''}">${esc(o)}</button>`).join('')}</div>
      ${T.r != null ? `<p class="vv-small">${T.r === P.ok ? '✅ ¡Bien!' : '❌ No.'} ${esc(P.x)}</p><button class="vv-btn small" data-v="testSig">Siguiente →</button>` : ''}</section>`;
  }
  responder(i) { const T = this.test; if (!T || T.r != null) return; T.r = i; if (i === PREGUNTAS[T.i].ok) T.bien++; }
  siguiente() { const T = this.test; T.i++; T.r = null; if (T.i >= PREGUNTAS.length) { try { const b = JSON.parse(localStorage.getItem(PIEZA)); if (b == null || T.bien > b) localStorage.setItem(PIEZA, JSON.stringify(T.bien)); } catch (e) { /* sin almacenamiento */ } } }
}
void REFERENCIAS; void cil; void rotulo;

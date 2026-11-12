import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { buildBoard, COMPONENTS, buildUSBCable, box, mat, BT } from './models.js';

export const WIRE_COLORS = {
  negro: 0x1c1c1c, rojo: 0xd62020, amarillo: 0xf2c200, verde: 0x1f9d3a, azul: 0x1f5fd6, blanco: 0xeeeeee,
  naranja: 0xf07a10, marron: 0x7a4a24, morado: 0x8a3ab9, gris: 0x8a8f96,
};
export const WIRE_CSS = Object.fromEntries(Object.entries(WIRE_COLORS).map(([k, v]) => [k, '#' + v.toString(16).padStart(6, '0')]));

const ease = t => t < 0 ? 0 : t > 1 ? 1 : 1 - Math.pow(1 - t, 3);

export class Viewer {
  constructor(container, labelLayer, opts = {}) {
    this.container = container; this.labelLayer = labelLayer; this.opts = opts;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: !!opts.render, alpha: false });
    this.renderer.setPixelRatio(opts.render ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true; this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping; this.renderer.toneMappingExposure = 1.05;
    container.appendChild(this.renderer.domElement);
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(opts.background || 0xf3f4f5);
    this.camera = new THREE.OrthographicCamera(-100, 100, 100, -100, -2000, 4000);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true; this.controls.dampingFactor = 0.12;
    this.controls.maxPolarAngle = Math.PI * 0.49; this.controls.minZoom = 0.4; this.controls.maxZoom = 6;
    this.controls.screenSpacePanning = true;
    // Luces
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0xb9bec6, 1.5));
    const d = new THREE.DirectionalLight(0xffffff, 2.2); d.position.set(-120, 300, 180); d.castShadow = true;
    d.shadow.mapSize.set(2048, 2048); const sc = d.shadow.camera; sc.left = -300; sc.right = 300; sc.top = 300; sc.bottom = -300; sc.near = 10; sc.far = 900; d.shadow.bias = -0.0006; d.shadow.radius = 4;
    this.scene.add(d);
    const f = new THREE.DirectionalLight(0xffffff, 0.6); f.position.set(200, 120, -100); this.scene.add(f);
    // Suelo con cuadrícula suave
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(3000, 3000), new THREE.ShadowMaterial({ opacity: 0.16 }));
    ground.rotation.x = -Math.PI / 2; ground.position.y = -0.01; ground.receiveShadow = true; this.scene.add(ground);
    if (!opts.render) {
      const grid = new THREE.GridHelper(1200, 120, 0xd9dbde, 0xe4e6e8); grid.position.y = -0.05; this.scene.add(grid);
    }
    this.root = new THREE.Group(); this.scene.add(this.root);
    this.board = buildBoard(); this.scene.add(this.board);
    this.labels = []; this.anims = []; this.halos = [];
    this.showLabels = true;
    this.clock = new THREE.Clock();
    this.resize(); window.addEventListener('resize', () => this.resize());
    this.renderer.setAnimationLoop(() => this.tick());
  }
  resize() {
    const w = this.container.clientWidth || 800, h = this.container.clientHeight || 600;
    this.renderer.setSize(w, h, false);
    this.renderer.domElement.style.width = w + 'px'; this.renderer.domElement.style.height = h + 'px';
    this.aspect = w / h; this.applyFrustum();
  }
  applyFrustum() {
    const hh = this.viewH || 120;
    this.camera.left = -hh * this.aspect; this.camera.right = hh * this.aspect; this.camera.top = hh; this.camera.bottom = -hh;
    this.camera.updateProjectionMatrix();
  }
  clear() {
    this.root.clear(); this.labels.forEach(l => l.el.remove()); this.labels = []; this.anims = []; this.halos = [];
    this.parts = {}; this.wires = {};
  }
  // ---- Construcción de la lección ----
  loadLesson(lesson) {
    this.clear(); this.lesson = lesson;
    this.board.userData.setSwitch(lesson.switch || '3V3');
    for (const [id, p] of Object.entries(lesson.parts || {})) {
      const built = COMPONENTS[p.type](p);
      const g = built.group; g.position.set(p.pos[0], p.y || 0, p.pos[1]); g.rotation.y = (p.rot || 0) * Math.PI / 180;
      g.visible = false; g.userData.basePos = g.position.clone(); this.root.add(g);
      g.updateMatrixWorld(true);
      this.parts[id] = { def: p, group: g, pins: built.pins };
    }
    // cable USB y portapilas
    this.usb = buildUSBCable(this.board.userData.pins.USB); this.usb.visible = false; this.root.add(this.usb);
    for (const w of lesson.wires || []) this.wires[w.id] = this.buildWire(w);
    // encuadre: todo lo de la lección
    this.fitAll();
  }
  endpoint(ref) {
    const bp = this.board.userData.pins[ref];
    if (bp) {
      const p = bp.pos.clone();
      if (bp.type === 'male') return { pos: p, dir: new THREE.Vector3(0, 1, 0), housing: 'female', label: ref };
      if (bp.type === 'female') return { pos: p, dir: new THREE.Vector3(0, 1, 0), housing: 'maleIn', label: ref };
      if (bp.type === 'dc') return { pos: p, dir: new THREE.Vector3(-1, 0, 0), housing: 'dc', label: ref };
    }
    const [pid, pin] = ref.split('.');
    const part = this.parts[pid]; if (!part) throw new Error('Pieza desconocida ' + ref);
    const pd = part.pins[pin]; if (!pd) throw new Error('Pin desconocido ' + ref);
    part.group.updateMatrixWorld(true);
    const pos = part.group.localToWorld(pd.pos.clone());
    const dir = pd.dir.clone().applyQuaternion(part.group.getWorldQuaternion(new THREE.Quaternion())).normalize();
    const housing = { male: 'female', maleUp: 'female', terminal: 'terminal', lead: 'none', bbhole: 'maleIn' }[pd.type] || 'none';
    return { pos, dir, housing, label: ref };
  }
  buildWire(w) {
    const g = new THREE.Group(); g.visible = false;
    const col = WIRE_COLORS[w.color] ?? 0x888888;
    const ends = [this.endpoint(w.from), this.endpoint(w.to)];
    const anchors = ends.map(e => {
      let a = e.pos.clone();
      const L = 14;
      if (e.housing === 'female') {           // conector hembra sobre un pin macho
        if (!w.noHousing) this.housing(g, e.pos.clone().addScaledVector(e.dir, 0.3), e.dir, L, 0x151515);
        a.addScaledVector(e.dir, L + 0.3);
      } else if (e.housing === 'maleIn') {     // pin macho dentro de una hembra
        this.housing(g, e.pos.clone(), e.dir, L, 0x151515, true);
        a.addScaledVector(e.dir, L);
      } else if (e.housing === 'terminal') {   // pin macho apretado en un borne
        this.housing(g, e.pos.clone().addScaledVector(e.dir, 1.5), e.dir, L, 0x151515, true);
        a.addScaledVector(e.dir, L + 1.5);
      } else if (e.housing === 'dc') {
        const c = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 14, 20), mat(0x151515));
        c.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), e.dir); c.position.copy(e.pos).addScaledVector(e.dir, 7); c.castShadow = true; g.add(c);
        a.addScaledVector(e.dir, 14);
      }
      return a;
    });
    const dist = anchors[0].distanceTo(anchors[1]);
    const k0 = w.k0 ?? Math.min(Math.max(dist * 0.35, 10), 55), k1 = w.k1 ?? Math.min(Math.max(dist * 0.35, 10), 55);
    const c0 = anchors[0].clone().addScaledVector(ends[0].dir, k0);
    const c1 = anchors[1].clone().addScaledVector(ends[1].dir, k1);
    if (Math.abs(ends[0].dir.y) < 0.5) c0.y += k0 * 0.5;
    if (Math.abs(ends[1].dir.y) < 0.5) c1.y += k1 * 0.5;
    if (w.lift) { c0.y += w.lift; c1.y += w.lift; }
    const curve = new THREE.CubicBezierCurve3(anchors[0], c0, c1, anchors[1]);
    const r = w.thick ? 1.6 : 0.75;
    const geo = new THREE.TubeGeometry(curve, 80, r, 8, false);
    const tube = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: col, roughness: 0.45 }));
    tube.castShadow = true; g.add(tube);
    g.userData = { tube, total: geo.index.count, def: w, mid: curve.getPoint(0.5), ends, anchors };
    this.root.add(g);
    return g;
  }
  housing(g, start, dir, L, color, withPin) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(2.6, L, 2.6), mat(color, { roughness: 0.7 }));
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    m.position.copy(start).addScaledVector(dir, L / 2); m.castShadow = true; g.add(m);
    if (withPin) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.64, 3, 0.64), mat(0xd8b45a, { metalness: 0.9, roughness: 0.3 })); p.quaternion.copy(m.quaternion); p.position.copy(start).addScaledVector(dir, -1); g.add(p); }
  }
  fitAll(onlyVisible = false, minH = 0) {
    const objs = [this.board];
    for (const p of Object.values(this.parts)) { if (!onlyVisible) p.group.visible = true; if (p.group.visible) objs.push(p.group); }
    for (const w of Object.values(this.wires)) { if (!onlyVisible) w.visible = true; if (w.visible) objs.push(w); }
    if (this.usb) { if (!onlyVisible) this.usb.visible = true; if (this.usb.visible) objs.push(this.usb); }
    if (!onlyVisible) { const last = this.lesson.steps && this.lesson.steps[this.lesson.steps.length - 1]; this.applyState(last && last.state); }
    const b = new THREE.Box3(); objs.forEach(o => b.expandByObject(o));
    this.bbox = b;
    const center = b.getCenter(new THREE.Vector3());
    const view = new THREE.Vector3(...(this.lesson.view || [0.32, 1.0, 0.92])).normalize();
    this.camera.position.copy(center).addScaledVector(view, 800); this.camera.up.set(0, 1, 0); this.camera.lookAt(center); this.camera.updateMatrixWorld();
    const inv = this.camera.matrixWorldInverse;
    let minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9; const v = new THREE.Vector3();
    for (const o of objs) o.traverse(m => {
      if (!m.isMesh || !m.geometry) return;
      const pos = m.geometry.attributes.position; if (!pos) return;
      const step = Math.max(1, Math.floor(pos.count / 400));
      m.updateMatrixWorld(true);
      for (let i = 0; i < pos.count; i += step) {
        v.fromBufferAttribute(pos, i).applyMatrix4(m.matrixWorld).applyMatrix4(inv);
        if (v.x < minX) minX = v.x; if (v.x > maxX) maxX = v.x; if (v.y < minY) minY = v.y; if (v.y > maxY) maxY = v.y;
      }
    });
    const padT = this.opts.padTop ?? 0.1, padB = this.opts.padBottom ?? 0.2, padX = this.opts.padX ?? 0.04;
    const margin = this.lesson.margin || 1.0;
    const aspect = this.opts.fitAspect || this.aspect;
    const H = Math.max(((maxY - minY) / 2) / (1 - padT - padB), ((maxX - minX) / 2) / (1 - 2 * padX) / aspect) * margin;
    const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2 - (padB - padT) * H;
    const right = new THREE.Vector3().setFromMatrixColumn(this.camera.matrixWorld, 0);
    const up = new THREE.Vector3().setFromMatrixColumn(this.camera.matrixWorld, 1);
    const shift = right.multiplyScalar(cx).add(up.multiplyScalar(cy));
    this.homeTarget = center.clone().add(shift);
    this.homePos = this.homeTarget.clone().addScaledVector(view, 800);
    this.homeH = Math.max(H, minH);
    this.resetView();
  }
  resetView() {
    this.viewH = this.homeH; this.camera.zoom = 1; this.applyFrustum();
    this.controls.target.copy(this.homeTarget); this.camera.position.copy(this.homePos); this.controls.update();
  }
  topView() {
    this.controls.target.copy(this.homeTarget);
    this.camera.position.copy(this.homeTarget).add(new THREE.Vector3(0, 800, 0.01)); this.controls.update();
  }
  // ---- Pasos ----
  showStep(k, instant = false) {
    const L = this.lesson; this.step = k;
    const visibleParts = new Set(), visibleWires = new Set();
    let usb = false;
    L.steps.forEach((s, i) => { if (i <= k) { (s.add || []).forEach(a => visibleParts.add(a)); (s.wires || []).forEach(a => visibleWires.add(a)); if (s.usb) usb = true; } });
    const cur = L.steps[k];
    const newParts = new Set(cur.add || []), newWires = new Set(cur.wires || []);
    this.anims = [];
    this.halos.forEach(h => this.root.remove(h)); this.halos = [];
    const now = performance.now();
    for (const [id, p] of Object.entries(this.parts)) {
      const vis = visibleParts.has(id); p.group.visible = vis;
      p.group.position.copy(p.group.userData.basePos);
      if (vis && newParts.has(id) && !instant) {
        p.group.position.y += 40; this.anims.push({ t0: now, dur: 550, fn: (e) => { p.group.position.y = p.group.userData.basePos.y + 40 * (1 - e); } });
      }
      if (vis && newParts.has(id)) this.addHalo(p.group);
    }
    let delay = instant ? 0 : 450;
    for (const [id, w] of Object.entries(this.wires)) {
      const vis = visibleWires.has(id); w.visible = vis;
      const tube = w.userData.tube; tube.geometry.setDrawRange(0, Infinity);
      w.children.forEach(c => c.visible = true);
      if (vis && newWires.has(id) && !instant) {
        const t0 = now + delay; delay += 220;
        tube.geometry.setDrawRange(0, 0);
        const housings = w.children.filter(c => c !== tube); housings.forEach(c => c.visible = false);
        this.anims.push({ t0, dur: 800, fn: (e) => { const n = Math.floor(w.userData.total * e / 6) * 6; tube.geometry.setDrawRange(0, n); if (e > 0) housings[0] && (housings[0].visible = true); if (e >= 1) housings.forEach(c => c.visible = true); } });
      }
    }
    this.usb.visible = usb;
    if (cur.focus === 'switch') this.addHalo(null, this.board.userData.switchPos, 14);
    if (cur.focus === 'usb') this.addHalo(this.usb);
    // estado final (LEDs encendidos, etc.)
    const finalState = cur.state || null;
    this.applyState(finalState);
    this.buildLabels(cur, visibleParts, newWires);
  }
  applyState(st) {
    for (const p of Object.values(this.parts)) {
      if (p.group.userData.glow) { const on = st && st.glow && st.glow[Object.keys(this.parts).find(k => this.parts[k] === p)]; const g = p.group.userData.glow; g.emissiveIntensity = on ? 1.6 : 0.0; if (on && on !== true) { g.emissive.set(on); g.color.set(on); } }
      if (p.group.userData.arm) p.group.userData.arm.rotation.z = st && st.servo ? -st.servo * Math.PI / 180 : 0;
    }
    this.spinProp = !!(st && st.spin);
  }
  addHalo(obj, pos, size) {
    let b;
    if (obj) { b = new THREE.Box3().setFromObject(obj); b.expandByScalar(2.5); }
    else { b = new THREE.Box3().setFromCenterAndSize(pos, new THREE.Vector3(size, size * 0.6, size * 1.3)); }
    const h = new THREE.Box3Helper(b, 0xf39900); h.material.linewidth = 2; h.material.transparent = true; h.material.depthTest = false; h.renderOrder = 10;
    this.root.add(h); this.halos.push(h);
  }
  // ---- Etiquetas HTML ----
  buildLabels(step, visibleParts, newWires) {
    this.labels.forEach(l => l.el.remove()); this.labels = [];
    const add = (text, pos, cls) => { const el = document.createElement('div'); el.className = 'lbl ' + (cls || ''); el.innerHTML = text; this.labelLayer.appendChild(el); this.labels.push({ el, pos }); };
    for (const id of visibleParts) {
      const p = this.parts[id]; const b = new THREE.Box3().setFromObject(p.group);
      const c = b.getCenter(new THREE.Vector3()); c.y = b.max.y + 4;
      const isNew = (step.add || []).includes(id);
      if (p.def.label && (isNew || this.opts.allPartLabels || step.allLabels)) add(p.def.label, c, isNew ? 'part new' : 'part');
    }
    // etiquetas de pin en la placa (agrupadas por columna)
    const groups = {};
    for (const wid of newWires) {
      const w = this.wires[wid]; const d = w.userData.def;
      for (const [i, ref] of [d.from, d.to].entries()) {
        const bp = this.board.userData.pins[ref];
        if (!bp) {
          const [pid, pin] = ref.split('.'); const part = this.parts[pid]; const pd = part && part.pins[pin];
          if (pd && ['terminal', 'bbhole', 'maleUp'].includes(pd.type)) {
            const name = (part.def.label || part.def.type).split('→')[0].trim().replace(/\s*\(.*\)/, '');
            const pinTxt = pin.replace(/^c(\d+)([a-e])$/, 'col. $1 · fila $2');
            const key = 'part:' + pid + (pd.type === 'maleUp' ? ':hdr' : ':' + pin);
            (groups[key] = groups[key] || { refs: [], pts: [], text: name + ' · ', pins: [] }).pts.push(w.userData.anchors[i]);
            groups[key].pins.push(pinTxt);
          }
          continue;
        }
        const key = ref.includes('.') && /^(D|A|I)/.test(ref) ? ref.split('.')[0] : ref;
        (groups[key] = groups[key] || { refs: [], pts: [] }).refs.push(ref);
        groups[key].pts.push(w.userData.anchors[i]);
      }
    }
    for (const [key, g] of Object.entries(groups)) {
      const pos = g.pts.reduce((a, p) => a.add(p), new THREE.Vector3()).multiplyScalar(1 / g.pts.length); pos.y += 2;
      add(g.text ? g.text + '<b>' + g.pins.join(' ') + '</b>' : pinGroupLabel(key, g.refs), pos, 'pin');
    }
    if (step.focus === 'switch') add('Interruptor → <b>' + (this.lesson.switch === '5V' ? '5V' : '3.3V') + '</b>', this.board.userData.switchPos.clone().add(new THREE.Vector3(0, 6, 0)), 'pin');
    this.layoutLabels();
  }
  layoutLabels() {
    const w = this.container.clientWidth, h = this.container.clientHeight;
    const placed = [];
    const items = this.labels.map(l => {
      const v = l.pos.clone().project(this.camera);
      return { l, x: (v.x + 1) / 2 * w, y: (1 - v.y) / 2 * h, vis: this.showLabels && v.z < 1 };
    }).sort((a, b) => a.y - b.y);
    for (const it of items) {
      const el = it.l.el; el.style.display = it.vis ? '' : 'none'; if (!it.vis) continue;
      const bw = el.offsetWidth || 80, bh = el.offsetHeight || 20;
      let y = it.y - bh - 8; const x = it.x - bw / 2;
      for (let iter = 0; iter < 12; iter++) {
        const hit = placed.find(p => x < p.x + p.w + 4 && x + bw + 4 > p.x && y < p.y + p.h + 3 && y + bh + 3 > p.y);
        if (!hit) break; y = hit.y - bh - 4;
      }
      placed.push({ x, y, w: bw, h: bh });
      el.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
      el.style.setProperty('--stem', Math.max(6, it.y - (y + bh)) + 'px');
    }
  }
  tick() {
    const now = performance.now();
    this.anims = this.anims.filter(a => { const e = ease((now - a.t0) / a.dur); a.fn(e); return e < 1; });
    const t = this.clock.getElapsedTime();
    this.halos.forEach(h => h.material.opacity = 0.45 + 0.55 * Math.abs(Math.sin(t * 3)));
    if (this.spinProp) for (const p of Object.values(this.parts || {})) if (p.group.userData.prop) p.group.userData.prop.rotation.y += this.opts.render ? 0 : 0.25;
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    if (this.labels.length) this.layoutLabels();
  }
  get idle() { return this.anims.length === 0; }
}

export function pinGroupLabel(key, refs) {
  const suf = refs.map(r => r.split('.')[1]).filter(Boolean);
  const order = ['G', 'V', '3V3', 'S', 'SDA', 'SCL'];
  const s = [...new Set(suf)].sort((a, b) => order.indexOf(a) - order.indexOf(b));
  let m;
  if ((m = key.match(/^D(\d+)$/))) return `GPIO ${m[1]} · <b>${s.join(' ')}</b>`;
  if ((m = key.match(/^A(\d+)$/))) return `ANALOG ${m[1]} · <b>${s.map(x => x === 'V' ? '3V3' : x).join(' ')}</b>`;
  if ((m = key.match(/^I(\d)$/))) return `I2C fila ${m[1]} · <b>${s.join(' ')}</b>`;
  if ((m = key.match(/^P\.(.+)$/))) return `POWER · <b>${m[1].replace('_2', '')}</b>`;
  if (key === 'DC') return 'Jack DC';
  return key;
}

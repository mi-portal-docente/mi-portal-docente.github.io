// Visor de detalle: muestra una pieza en 3D (girar, despiece, cables en sus bornes, fase/neutro/tierra).
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { estudio, camaraSuave } from '../kit3d/escena.js';
import { entorno } from '../kit3d/base.js';
import { conductor } from '../kit3d/cables.js';

const esc = (t) => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const DESPIECE = { caja: 0, mecanismo: 4, marco: 8, tecla: 10.5, portalamparas: 0, bombilla: 5 };

export class Visor {
  constructor(host) {
    this.host = host; this.el = document.createElement('div'); this.el.className = 'vv-visor'; this.el.hidden = true;
    this.el.innerHTML = `<div class="vv-vis-top"><b id="vvVisT"></b><div class="vv-vis-bt">
      <button data-vis="girar" title="Girar 180° para ver los bornes por detrás">↻ Ver por detrás</button><button data-vis="despiece" title="Separar caja, mecanismo, marco y tecla">💥 Despiece</button>
      <button data-vis="cables" title="Mostrar u ocultar los cables">〰 Cables</button><button data-vis="cerrar" title="Cerrar (Esc)">✕</button></div></div>
      <div class="vv-vis-gl"></div><div class="vv-vis-lb"></div><div class="vv-vis-info" id="vvVisI"></div>`;
    host.appendChild(this.el);
    this.el.addEventListener('click', (e) => { const b = e.target.closest('[data-vis]'); if (!b) return; const v = b.dataset.vis; if (v === 'cerrar') this.cerrar(); if (v === 'girar') this.girar(); if (v === 'despiece') this.despiece(); if (v === 'cables') { this.verCables = !this.verCables; this.ponerCables(); b.classList.toggle('on', this.verCables); } });
    this.verCables = true;
  }
  get abierto() { return !this.el.hidden; }
  init() {
    if (this.r) return true;
    try { this.r = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true }); } catch (e) { return false; }
    this.r.setPixelRatio(Math.min(1.5, window.devicePixelRatio || 1)); this.r.outputColorSpace = THREE.SRGBColorSpace; this.el.querySelector('.vv-vis-gl').appendChild(this.r.domElement);
    const s = this.s = new THREE.Scene(); s.background = new THREE.Color(0xf4f1ec); entorno(this.r, s, 0.6);
    estudio(null, s, { escala: 20, dir: [20, 30, 40], intPrincipal: 1.7, intCielo: 1.8, intRelleno: 0.7, suelo: 0x8a7a66, sombras: false, entorno: false });
    const d2 = new THREE.DirectionalLight(0xffffff, 0.5); d2.position.set(-20, -10, -40); s.add(d2);
    this.cam = new THREE.PerspectiveCamera(35, 1, 0.5, 500); this.ctl = camaraSuave(new OrbitControls(this.cam, this.r.domElement), { polarMax: false });
    this.raiz = new THREE.Group(); s.add(this.raiz); this.cab = new THREE.Group(); this.reloj = new THREE.Clock();
    return true;
  }
  // o: { titulo, objeto (Group con userData.partes/bornes), info (html), etiquetas: [{ txt, grupo, pos, cls }], cables: [{ borne, hex, tierra, sec, desde }], detras }
  abrir(o) {
    if (!this.init()) return false;
    this.o = o; this.el.hidden = false; this.el.querySelector('#vvVisT').textContent = o.titulo || '';
    this.el.querySelector('#vvVisI').innerHTML = o.info || '';
    this.el.querySelectorAll('[data-vis=girar],[data-vis=despiece]').forEach((b) => { b.hidden = !o.objeto.userData.partes || Object.keys(o.objeto.userData.partes).length < 2; });
    this.raiz.clear(); this.raiz.add(o.objeto); this.raiz.add(this.cab); this.raiz.rotation.set(0, o.detras ? Math.PI : 0, 0); this.giro = o.detras ? Math.PI : 0; this.textoGirar(); this.exp = 0; this.expObj = 0;
    const bb = new THREE.Box3().setFromObject(o.objeto); const c = bb.getCenter(new THREE.Vector3()); const r = bb.getSize(new THREE.Vector3()).length();
    this.centro = c; this.ctl.target.copy(c); this.cam.position.set(c.x + r * 0.55, c.y + r * 0.35, c.z + r * 1.25); this.ctl.update();
    this.ponerCables(); this.resize();
    this.r.setAnimationLoop(() => this.frame());
    return true;
  }
  cerrar() { this.el.hidden = true; this.r?.setAnimationLoop(null); this.raiz?.clear(); this.cab?.clear(); this.o = null; }
  resize() { const g = this.el.querySelector('.vv-vis-gl'); const w = g.clientWidth || 600, h = g.clientHeight || 400; this.r.setSize(w, h, false); this.r.domElement.style.width = w + 'px'; this.r.domElement.style.height = h + 'px'; this.cam.aspect = w / h; this.cam.updateProjectionMatrix(); }
  girar() { this.giro = this.giro ? 0 : Math.PI; this.textoGirar(); }
  textoGirar() { const b = this.el.querySelector('[data-vis=girar]'); if (b) { b.textContent = this.giro ? '↻ Ver de frente' : '↻ Ver por detrás'; b.title = this.giro ? 'Girar 180° para ver la cara frontal' : 'Girar 180° para ver los bornes por detrás'; } }
  despiece() { this.expObj = this.expObj ? 0 : 1; this.cam.position.sub(this.ctl.target).multiplyScalar(this.expObj ? 1.7 : 1 / 1.7).add(this.ctl.target); }
  frame() {
    if (!this.o) return; const dt = Math.min(0.1, this.reloj.getDelta()); const k = 1 - Math.exp(-dt * 7); // independiente de los fps (Chromebook)
    const ry = this.raiz.rotation.y; if (Math.abs(ry - this.giro) > 0.001) this.raiz.rotation.y = Math.abs(this.giro - ry) < 0.01 ? this.giro : ry + (this.giro - ry) * k;
    if (Math.abs(this.exp - this.expObj) > 0.001) { this.exp = Math.abs(this.expObj - this.exp) < 0.005 ? this.expObj : this.exp + (this.expObj - this.exp) * k; const P = this.o.objeto.userData.partes || {}; for (const [n, g] of Object.entries(P)) g.position.z = (DESPIECE[n] || 0) * this.exp; this.ponerCables(); }
    const cj = this.o.objeto.userData.partes?.caja; if (cj && this.o.cables?.length !== undefined) cj.visible = this.expObj > 0 || Math.abs(this.raiz.rotation.y) < 1.2; // por detrás se ve el mecanismo fuera de su caja, como en las fotos
    this.ctl.update(); this.r.render(this.s, this.cam); this.etiquetas();
  }
  ancla(grupo, pos) { const g = grupo ? this.o.objeto.userData.partes?.[grupo] : this.o.objeto; const v = pos.clone(); (g || this.o.objeto).localToWorld(v); return v; }
  // Cables reales (kit 3D): el cobre entra en el borne lo que pide su tipo (ideal, mm); el aislante llega justo al borne si
  // se ha pelado bien, se mete dentro si se ha pelado corto y deja cobre a la vista si se ha pelado largo.
  ponerCables() {
    this.cab.traverse((o) => { if (o.geometry && !o.geometry.userData?.compartida) o.geometry.dispose(); }); this.cab.clear(); if (!this.o || !this.verCables) return;
    const B = this.o.objeto.userData.bornes || {}; this.raiz.updateMatrixWorld(true);
    (this.o.cables || []).forEach((c, i) => {
      const b = B[c.borne]; if (!b) return; const fin = this.raiz.worldToLocal(this.ancla(b.grupo, b.pos)); // los cables cuelgan de la raíz: giran con la pieza
      const dentro = new THREE.Vector3(0, 0, b.grupo === 'mecanismo' ? 1 : -1);
      const ini = c.desde ? c.desde.clone() : new THREE.Vector3((i % 3 - 1) * 0.8, 9, b.grupo === 'mecanismo' ? -1.5 : 2);
      const ideal = (c.ideal ?? 10) / 10, pel = Math.max(0, c.pel ?? ideal * 10);
      const punta = fin.clone().addScaledVector(dentro, ideal); const fuera = fin.clone().addScaledVector(dentro, -2.2);
      const mid = fuera.clone().lerp(ini, 0.5).addScaledVector(dentro, -1.2);
      const g = conductor({ sec: c.sec || 1.5, color: c.color || (c.tierra ? 'tierra' : 'marron'), tipo: 'K', pelado: [0, pel], recorrido: [ini, mid, fuera, fin.clone().addScaledVector(dentro, -0.4), punta] });
      g.userData.estado = c.estado || 'ok'; this.cab.add(g);
    });
  }
  etiquetas() {
    const box = this.el.querySelector('.vv-vis-lb'); const w = this.r.domElement.clientWidth, h = this.r.domElement.clientHeight;
    const html = (this.o.etiquetas || []).map((l) => {
      const v = this.ancla(l.grupo, l.pos); const n = v.clone().sub(this.cam.position).normalize(); const cara = l.cara === 'detras' ? -1 : 1;
      const frente = new THREE.Vector3(0, 0, cara).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.raiz.rotation.y); if (n.dot(frente) > 0.15) return '';
      const p = v.project(this.cam); if (p.z > 1) return '';
      return `<div class="vv-vlb ${l.cls || ''}" style="left:${((p.x + 1) / 2) * w}px;top:${((1 - p.y) / 2) * h}px">${esc(l.txt)}</div>`;
    }).join('');
    if (html !== this._h) { box.innerHTML = html; this._h = html; }
  }
}

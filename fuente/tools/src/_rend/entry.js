import * as THREE from 'three';
import { mecanismo3D, bombilla3D, cajaEmpalme3D, modulo3D, cuadro3D, herramienta3D, ficha3D } from '../viv/modelos3d.js';
import { posicionesCaja } from '../viv/modelo.js';
import { entorno } from '../kit3d/base.js';
import { conductor } from '../kit3d/cables.js';
const W = 640, H = 480;
const r = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: true }); r.setSize(W, H); r.outputColorSpace = THREE.SRGBColorSpace; document.body.appendChild(r.domElement);
const s = new THREE.Scene(); entorno(r, s, 0.6);
s.add(new THREE.HemisphereLight(0xffffff, 0x8a7a66, 1.6)); const d = new THREE.DirectionalLight(0xffffff, 1.6); d.position.set(20, 30, 40); s.add(d); const d2 = new THREE.DirectionalLight(0xffffff, 0.9); d2.position.set(-20, -10, -40); s.add(d2);
const cam = new THREE.PerspectiveCamera(30, W / H, 0.1, 2000);
function shot(o, { ry = 0, rx = 0, dir = [0.35, 0.3, 1], k = 1.0 } = {}) {
  const g = new THREE.Group(); g.add(o); g.rotation.set(rx, ry, 0); s.add(g); g.updateMatrixWorld(true);
  const bb = new THREE.Box3().setFromObject(g); const c = bb.getCenter(new THREE.Vector3()); const sz = bb.getSize(new THREE.Vector3()); const R = sz.length() / 2;
  const v = new THREE.Vector3(...dir).normalize(); const dist = (R / Math.sin((cam.fov * Math.PI) / 360)) * 0.92 * k;
  cam.position.copy(c).addScaledVector(v, dist); cam.lookAt(c); cam.near = dist / 50; cam.far = dist * 10; cam.updateProjectionMatrix();
  r.setClearColor(0xffffff, 0); r.render(s, cam); const url = r.domElement.toDataURL('image/png'); s.remove(g); return url;
}
const conds = (secs) => { const G = new THREE.Group(); ['marron', 'azul', 'tierra'].forEach((c, i) => { G.add(conductor({ sec: secs, color: c, tipo: 'K', pelado: [12, 12], recorrido: [new THREE.Vector3(-12, i * 1.2, 0), new THREE.Vector3(0, i * 1.2 + 0.6, 0), new THREE.Vector3(12, i * 1.2, 0)] })); }); return G; };
const tubo = () => { const G = new THREE.Group(); const tex = (() => { const c = document.createElement('canvas'); c.width = 64; c.height = 16; const g = c.getContext('2d'); g.fillStyle = '#8a9299'; g.fillRect(0, 0, 64, 16); g.fillStyle = '#5e666d'; for (let x = 0; x < 64; x += 16) g.fillRect(x, 0, 6, 16); const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(30, 1); return t; })();
  const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(-14, -2, 0), new THREE.Vector3(-4, 1, 0), new THREE.Vector3(6, -1, 0), new THREE.Vector3(14, 2, 0)]); G.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 80, 0.8, 16), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.6 }))); return G; };
const caja = () => cajaEmpalme3D(100, { B1: 'w412', B2: 'w413', B3: 'w415' }, posicionesCaja(100));
const cuadro = () => { const G = new THREE.Group(); G.add(cuadro3D(30, 24)); [['iga', 0, 2], ['id', 2, 2], ['mt', 4, 1, 10, 'C1'], ['mt', 5, 1, 16, 'C2']].forEach(([t, sl, n, In, circ]) => { const m = modulo3D(t, { In, circ, curva: 'C' }); m.position.set(-12 * 1.8 / 2 + (sl + n / 2) * 1.8, 1, 2.2); G.add(m); }); return G; };
const back = { ry: Math.PI, dir: [0.3, 0.25, 1], k: 0.75 };
const sinCaja = (o) => { if (o.userData.partes?.caja) o.userData.partes.caja.visible = false; return o; };
window.EL = {
  interruptor: () => shot(sinCaja(mecanismo3D('interruptor')), back), 'interruptor-frente': () => shot(mecanismo3D('interruptor')),
  conmutador: () => shot(sinCaja(mecanismo3D('conmutador')), back), cruzamiento: () => shot(sinCaja(mecanismo3D('cruzamiento')), back), pulsador: () => shot(sinCaja(mecanismo3D('pulsador')), back),
  minutero: () => shot(sinCaja(mecanismo3D('minutero')), back), enchufe: () => shot(sinCaja(mecanismo3D('enchufe')), back), 'enchufe-frente': () => shot(mecanismo3D('enchufe')),
  portalamparas: () => shot(bombilla3D(0), { dir: [0.9, -0.5, 0.8], k: 0.8 }), caja: () => shot(caja(), { dir: [0.2, -0.25, 1] }),
  wago2: () => shot(ficha3D('w412'), { dir: [0.4, -0.6, 1], k: 0.8 }), wago3: () => shot(ficha3D('w413'), { dir: [0.4, -0.6, 1], k: 0.8 }), wago5: () => shot(ficha3D('w415'), { dir: [0.4, -0.6, 1], k: 0.8 }),
  tubo: () => shot(tubo(), { dir: [0.2, 0.5, 1] }), cables15: () => shot(conds(1.5), { dir: [0.1, 0.6, 1], k: 0.7 }), cables25: () => shot(conds(2.5), { dir: [0.1, 0.6, 1], k: 0.7 }),
  pia: () => shot(modulo3D('mt', { In: 16, curva: 'C', circ: 'C2' }), { dir: [0.35, 0.2, 1] }), id: () => shot(modulo3D('id', { In: 40 }), { dir: [0.35, 0.2, 1] }), iga: () => shot(modulo3D('iga', { In: 25 }), { dir: [0.35, 0.2, 1] }),
  cuadro: () => shot(cuadro(), { dir: [0.15, 0.15, 1] }),
};
window.HERR = (id, punta) => shot(herramienta3D(id, { punta }), { dir: [0.2, 0.6, 1] });
window.LISTO = true;

// Fase 13 · Visor 3D de modelos STL / GLB / glTF (three.js, MIT, ya incluido en app.js). Ventana a pantalla
// completa con órbita (arrastrar), zoom (rueda o pellizco), encuadre automático, rejilla y medidas del modelo.
// window.PORTAL_VISOR3D.abrir({ url? | buffer?, nombre, formato? ('stl' | 'glb' | 'gltf') })
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ic } from './ui/iconos.js';

const esc = (t) => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const formato3D = (u) => { const m = /\.(stl|glb|gltf)($|[?#])/i.exec(String(u || '')); return m ? m[1].toLowerCase() : null; };
let actual = null;
export function cerrar3D() { if (!actual) return; actual.fin(); actual = null; }
export async function abrir3D({ url, buffer, nombre = 'Modelo 3D', formato } = {}) {
  cerrar3D();
  const fmt = formato || formato3D(url || nombre) || 'stl';
  const V = document.createElement('div'); V.className = 'v3'; V.id = 'visor3d'; V.setAttribute('role', 'dialog'); V.setAttribute('aria-modal', 'true'); V.setAttribute('aria-label', 'Visor 3D: ' + nombre);
  V.innerHTML = `<header class="vp-bar"><button type="button" class="vp-b" data-v3="cerrar" aria-label="Cerrar el visor" title="Cerrar (Esc)">${ic('x')}</button><b class="vp-tit">${esc(nombre)}</b><span class="v3-med" aria-live="polite"></span>
    <span class="vp-grp"><button type="button" class="vp-b" data-v3="centrar" aria-label="Encuadrar" title="Encuadrar">${ic('scan-eye')}</button><button type="button" class="vp-b" data-v3="malla" aria-label="Ver la malla" title="Ver la malla" aria-pressed="false">${ic('grid-3x3')}</button><button type="button" class="vp-b" data-v3="pantalla" aria-label="Pantalla completa">${ic('maximize-2')}</button></span></header>
    <div class="v3-lienzo"><p class="vp-msg">Cargando el modelo…</p></div><p class="v3-ayuda">Arrastra para girar · rueda o pellizco para acercar · clic derecho o dos dedos para mover</p>`;
  document.body.appendChild(V); document.body.classList.add('vp-abierto');
  const L = V.querySelector('.v3-lienzo'); const previo = document.activeElement; V.querySelector('[data-v3=cerrar]').focus();
  const ren = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true }); ren.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  const esc3 = new THREE.Scene(); const cam = new THREE.PerspectiveCamera(45, 1, 0.01, 10000);
  esc3.add(new THREE.HemisphereLight(0xffffff, 0x8899aa, 1.2)); const dl = new THREE.DirectionalLight(0xffffff, 1.6); dl.position.set(3, 5, 4); esc3.add(dl);
  const ctl = new OrbitControls(cam, ren.domElement); ctl.enableDamping = true;
  let raf = 0, obj = null, rej = null; let malla = false;
  const tam = () => { const w = L.clientWidth || 800, h = L.clientHeight || 600; ren.setSize(w, h); cam.aspect = w / h; cam.updateProjectionMatrix(); };
  const bucle = () => { raf = requestAnimationFrame(bucle); ctl.update(); ren.render(esc3, cam); };
  const tecla = (e) => { if (e.key === 'Escape' && !document.fullscreenElement) { e.preventDefault(); cerrar3D(); } };
  const fin = () => { cancelAnimationFrame(raf); window.removeEventListener('resize', tam); document.removeEventListener('keydown', tecla, true); ctl.dispose(); ren.dispose(); esc3.traverse((o) => { o.geometry?.dispose?.(); }); V.remove(); document.body.classList.remove('vp-abierto'); try { if (document.fullscreenElement) document.exitFullscreen(); } catch (e) { } previo?.focus?.(); };
  actual = { fin };
  window.addEventListener('resize', tam); document.addEventListener('keydown', tecla, true);
  function encuadrar() {
    const b = new THREE.Box3().setFromObject(obj); const s = b.getSize(new THREE.Vector3()); const c = b.getCenter(new THREE.Vector3()); const r = Math.max(s.x, s.y, s.z) || 1;
    cam.near = r / 1000; cam.far = r * 100; cam.position.copy(c).add(new THREE.Vector3(r * 1.2, r * 0.9, r * 1.4)); cam.updateProjectionMatrix(); ctl.target.copy(c); ctl.update();
    if (!rej) { rej = new THREE.GridHelper(r * 3, 20, 0x8e8e93, 0xd1d1d6); rej.position.set(c.x, b.min.y, c.z); esc3.add(rej); }
    V.querySelector('.v3-med').textContent = `${s.x.toFixed(1)} × ${s.y.toFixed(1)} × ${s.z.toFixed(1)}`.replace(/\./g, ',');
  }
  V.addEventListener('click', (e) => {
    const b = e.target.closest('[data-v3]'); if (!b) return; const k = b.dataset.v3;
    if (k === 'cerrar') cerrar3D();
    if (k === 'centrar' && obj) encuadrar();
    if (k === 'malla' && obj) { malla = !malla; b.setAttribute('aria-pressed', String(malla)); obj.traverse((o) => { if (o.material) [].concat(o.material).forEach((m) => { m.wireframe = malla; }); }); }
    if (k === 'pantalla') { if (document.fullscreenElement) document.exitFullscreen(); else V.requestFullscreen?.().catch(() => { }); }
  });
  try {
    let datos = buffer; if (!datos) { const r = await fetch(new URL(url, document.baseURI).href); if (!r.ok) throw new Error('HTTP ' + r.status); datos = await r.arrayBuffer(); }
    if (!document.body.contains(V)) return;
    if (fmt === 'stl') {
      const g = new STLLoader().parse(datos); g.computeVertexNormals(); g.rotateX(-Math.PI / 2);
      obj = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: 0x0a84ff, metalness: 0.1, roughness: 0.55 }));
    } else {
      const gl = await new Promise((res, rej2) => new GLTFLoader().parse(datos, '', res, rej2)); obj = gl.scene;
    }
    esc3.add(obj); L.replaceChildren(ren.domElement); ren.domElement.setAttribute('aria-label', 'Modelo 3D: ' + nombre); tam(); encuadrar(); bucle();
    V.dataset.listo = '1';
  } catch (e) {
    L.innerHTML = `<div class="vp-msg">${ic('triangle-exclamation-point')} No se ha podido abrir el modelo (${esc(e.message || e)}).${url ? ` <a class="btn small" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${ic('external-link')} Abrir el archivo</a>` : ''}</div>`;
  }
}
window.PORTAL_VISOR3D = { abrir: abrir3D, cerrar: cerrar3D, formato: formato3D };

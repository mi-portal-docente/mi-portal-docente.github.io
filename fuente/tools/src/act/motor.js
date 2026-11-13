// Motor de las «Actividades de clase» en 3D: una mesa con piezas numeradas y una serie de rondas.
//  · ronda «objeto»: «Señala …» → se pulsa la pieza en 3D (o su número en la lista, alternativa de teclado);
//  · ronda «opcion»: pregunta con botones (la pieza de la que se habla se resalta en la mesa).
// Al terminar: aciertos, nota sobre 10, repaso de cada ronda y, si el profesor la ha asignado como tarea,
// «Entregar resultado» (va al cuaderno de calificaciones como cualquier tarea).
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { estudio, camaraSuave } from '../kit3d/escena.js';

const esc = (t) => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const barajar = (L) => { const a = L.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
import { nota10, textoResultado, leerResultado } from './resultado.js';
export { nota10, textoResultado, leerResultado };

export class Actividad3D {
  constructor(host, def, opts = {}) {
    if (def.juego && new.target === Actividad3D) return new def.juego(host, def, opts); // actividades en modo juego (juego.js)
    this.host = host; this.def = def; this.opts = opts; this.objs = new Map(); this.raf = 0; this.hover = null;
    host.classList.add('ac'); host.innerHTML = `${opts.cabecera || ''}
      <div class="ac-main"><section class="ac-vista" aria-label="Mesa en 3D"><div class="ac-gl" id="acGL"></div><div class="ac-tags" id="acTags" aria-hidden="true"></div>
        <div class="ac-ayuda">Pulsa una pieza · arrastra para girar · rueda para acercar</div></section>
      <aside class="ac-lado" id="acLado" aria-live="polite"></aside></div>`;
    this.$ = (s) => host.querySelector(s);
    this.estado = { fase: 'intro' }; this.initScene(); this.pintar();
    this._click = (e) => this.onClick(e); host.addEventListener('click', this._click);
  }
  // ------------------------------------------------------------ escena
  initScene() {
    const el = this.$('#acGL');
    try { this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true }); } catch (e) { el.innerHTML = '<p class="ac-sin3d">Este navegador no puede mostrar 3D: usa los números de la lista.</p>'; return; }
    const r = this.renderer; r.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); el.appendChild(r.domElement);
    const s = this.scene = new THREE.Scene(); s.background = new THREE.Color(0xeef1f3);
    this.camera = new THREE.PerspectiveCamera(34, 1, 1, 1000);
    estudio(r, s, { escala: 80, dir: [-30, 90, 60], sombraR: 80, intPrincipal: 1.8, intCielo: 1.5, suelo: 0x9a8a76, entorno: 0.45 });
    const W = this.def.mesa?.w || 110, D = this.def.mesa?.d || 66;
    const mesa = new THREE.Mesh(new THREE.BoxGeometry(W, 2, D), new THREE.MeshStandardMaterial({ color: this.def.mesa?.color || 0x3f4a54, roughness: 0.85 })); mesa.position.y = -1; mesa.receiveShadow = true; s.add(mesa);
    const borde = new THREE.Mesh(new THREE.BoxGeometry(W + 3, 1.6, D + 3), new THREE.MeshStandardMaterial({ color: 0x2b3238 })); borde.position.y = -1.6; s.add(borde);
    for (const o of this.def.objetos) {
      const g = new THREE.Group(); o.crear(g); g.position.set(o.x, 0, o.z); g.rotation.y = o.rot || 0; g.userData.objId = o.id; s.add(g);
      const caja = new THREE.Box3().setFromObject(g); const c = caja.getCenter(new THREE.Vector3());
      this.objs.set(o.id, { o, g, tag: new THREE.Vector3(c.x, caja.max.y + 2.5, c.z), mats: [] });
      g.traverse((m) => { if (m.material) this.objs.get(o.id).mats.push(m.material); });
    }
    const c = this.controls = new OrbitControls(this.camera, r.domElement);
    c.target.set(0, 0, 2); camaraSuave(c, { polarMax: 1.2, min: 40, max: 260, zoomCursor: false }); c.minPolarAngle = 0.15; c.enablePan = false;
    this.camera.position.set(0, 88, 70);
    this.ray = new THREE.Raycaster(); this.ptr = new THREE.Vector2();
    r.domElement.addEventListener('pointermove', (e) => this.onMove(e));
    r.domElement.addEventListener('pointerdown', (e) => { this.down = [e.clientX, e.clientY]; });
    r.domElement.addEventListener('pointerup', (e) => { if (this.down && Math.hypot(e.clientX - this.down[0], e.clientY - this.down[1]) < 6) { const id = this.pick(e); if (id) this.elegir(id); } this.down = null; });
    this.onResize = () => {
      const w = el.clientWidth || 600, h = el.clientHeight || 400; r.setSize(w, h); this.camera.aspect = w / h;
      // encuadre: que la mesa entera quepa (en vertical y en horizontal) desde la dirección actual de la cámara
      const t = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2)); const dist = Math.max((D * 0.62) / t, (W * 0.6) / (t * this.camera.aspect));
      const dir = this.camera.position.clone().sub(c.target).normalize(); this.camera.position.copy(c.target).addScaledVector(dir, Math.min(Math.max(dist, c.minDistance), c.maxDistance));
      this.camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', this.onResize); this.onResize(); this.resume();
  }
  pick(e) {
    const rc = this.renderer.domElement.getBoundingClientRect();
    this.ptr.set(((e.clientX - rc.left) / rc.width) * 2 - 1, -((e.clientY - rc.top) / rc.height) * 2 + 1);
    this.ray.setFromCamera(this.ptr, this.camera);
    const hit = this.ray.intersectObjects([...this.objs.values()].map((x) => x.g), true)[0]; let o = hit?.object;
    while (o && !o.userData.objId) o = o.parent; return o?.userData.objId || null;
  }
  onMove(e) { const id = this.pick(e); if (id !== this.hover) { this.hover = id; this.renderer.domElement.style.cursor = id && this.estado.fase === 'ronda' && !this.estado.resp ? 'pointer' : ''; this.resaltar(); } }
  resaltar() {
    const R = this.ronda(); const st = this.estado;
    for (const [id, x] of this.objs) {
      let col = 0x000000, k = 0;
      if (st.fase === 'ronda' && st.resp && R.tipo !== 'opcion') { if (R.ok.includes(id)) { col = 0x1fbf4a; k = 0.55; } else if (st.resp.id === id) { col = 0xdc001b; k = 0.6; } }
      else if (st.fase === 'ronda' && R?.tipo === 'opcion' && R.foco?.includes(id)) { col = 0xf39900; k = 0.45; }
      else if (id === this.hover && st.fase === 'ronda' && R?.tipo !== 'opcion') { col = 0xf39900; k = 0.35; }
      x.mats.forEach((m) => { if (m.emissive) { m.emissive.setHex(col); m.emissiveIntensity = k; } });
    }
  }
  loop() {
    this.raf = requestAnimationFrame(() => this.loop()); if (!this.renderer) return;
    this.controls.update(); this.renderer.render(this.scene, this.camera);
    const el = this.$('#acTags'); const w = this.renderer.domElement.clientWidth, h = this.renderer.domElement.clientHeight;
    const vistos = this.estado.vistos || new Set();
    el.innerHTML = [...this.objs.values()].map((x, i) => { const v = x.tag.clone().project(this.camera); if (v.z > 1) return ''; return `<span class="ac-tag ${vistos.has(x.o.id) ? 'visto' : ''}" style="left:${((v.x + 1) / 2) * w}px;top:${((1 - v.y) / 2) * h}px">${i + 1}${vistos.has(x.o.id) ? ' · ' + esc(x.o.n) : ''}</span>`; }).join('');
  }
  pause() { cancelAnimationFrame(this.raf); this.raf = 0; }
  resume() { if (!this.raf && this.renderer) { this.onResize(); this.loop(); } }
  destruir() { this.pause(); window.removeEventListener('resize', this.onResize); this.host.removeEventListener('click', this._click); this.renderer?.dispose(); this.renderer?.forceContextLoss?.(); }

  // ------------------------------------------------------------ juego
  ronda() { const s = this.estado; return s.fase === 'ronda' ? s.rondas[s.i] : null; }
  empezar() { this.estado = { fase: 'ronda', rondas: barajar(this.def.rondas), i: 0, resp: null, detalle: [], vistos: new Set() }; this.pintar(); this.resaltar(); }
  elegir(id) {
    const s = this.estado; const R = this.ronda(); if (!R || s.resp || R.tipo === 'opcion') return;
    const ok = R.ok.includes(id); s.resp = { id, ok }; s.detalle.push({ q: R.q, ok }); R.ok.forEach((x) => s.vistos.add(x)); s.vistos.add(id); this.pintar(); this.resaltar();
  }
  opcion(k) {
    const s = this.estado; const R = this.ronda(); if (!R || s.resp || R.tipo !== 'opcion') return;
    const ok = k === R.correcta; s.resp = { k, ok }; s.detalle.push({ q: R.q, ok }); this.pintar(); this.resaltar();
  }
  siguiente() { const s = this.estado; if (s.i + 1 >= s.rondas.length) { s.fase = 'fin'; s.aciertos = s.detalle.filter((d) => d.ok).length; } else { s.i++; s.resp = null; } this.pintar(); this.resaltar(); this.$('#acLado [data-ac]')?.focus(); }
  pintar() {
    const s = this.estado; const d = this.def; const L = this.$('#acLado'); const lista = [...this.objs.values()];
    if (s.fase === 'intro') {
      L.innerHTML = `<h2>${d.icon} ${esc(d.titulo)}</h2><p>${esc(d.intro)}</p><ul class="ac-info"><li>📋 ${d.rondas.length} preguntas</li><li>⏱ ${esc(d.duracion || '10 min')}</li><li>📚 ${esc(d.tema || '')}</li></ul>
        ${this.asignacionHTML()}<div class="ac-acts"><button class="btn primary" data-ac="empezar">▶ Empezar</button></div>`; return;
    }
    if (s.fase === 'fin') {
      const n = nota10(s.aciertos, s.rondas.length);
      L.innerHTML = `<h2>${n >= 5 ? '🎉' : '💪'} Resultado</h2><div class="ac-nota"><b>${s.aciertos}</b> de ${s.rondas.length} aciertos · Nota <b>${String(n).replace('.', ',')}</b></div>
        <ol class="ac-repaso">${s.detalle.map((x) => `<li class="${x.ok ? 'ok' : 'ko'}">${x.ok ? '✔' : '✖'} ${esc(x.q)}</li>`).join('')}</ol>
        ${this.asignacionHTML(true)}<div class="ac-acts"><button class="btn" data-ac="empezar">↻ Repetir</button><a class="btn" href="${esc(this.opts.volver || '#asignaturas')}">← Actividades</a></div>`; return;
    }
    const R = this.ronda(); const r = s.resp;
    const cab = `<div class="ac-prog" role="progressbar" aria-valuemin="0" aria-valuemax="${s.rondas.length}" aria-valuenow="${s.i + 1}"><span style="width:${((s.i + (r ? 1 : 0)) / s.rondas.length) * 100}%"></span></div>
      <div class="ac-n">Pregunta ${s.i + 1} de ${s.rondas.length} · ${s.detalle.filter((x) => x.ok).length} aciertos</div><h3 class="ac-q">${esc(R.q)}</h3>`;
    let cuerpo = '';
    if (R.tipo === 'opcion') cuerpo = `<div class="ac-ops" role="group" aria-label="Opciones">${R.opciones.map((o, k) => `<button class="ac-op ${r ? (k === R.correcta ? 'ok' : k === r.k ? 'ko' : '') : ''}" data-ac="op" data-k="${k}" ${r ? 'disabled' : ''}>${esc(o)}</button>`).join('')}</div>`;
    else cuerpo = `<p class="ac-small">Pulsa la pieza en la mesa o su número:</p><div class="ac-nums" role="group" aria-label="Piezas">${lista.map((x, i) => `<button class="ac-num ${r ? (R.ok.includes(x.o.id) ? 'ok' : r.id === x.o.id ? 'ko' : '') : ''}" data-ac="pieza" data-id="${esc(x.o.id)}" ${r ? 'disabled' : ''} aria-label="Pieza ${i + 1}">${i + 1}</button>`).join('')}</div>`;
    const fb = r ? `<div class="ac-fb ${r.ok ? 'ok' : 'ko'}"><b>${r.ok ? '✔ ¡Correcto!' : '✖ No es esa.'}</b> ${R.tipo !== 'opcion' && !r.ok ? `Era: <b>${esc(R.ok.map((id) => this.objs.get(id)?.o.n).join(' / '))}</b>. ` : ''}${esc(R.exp || '')}</div>
      <div class="ac-acts"><button class="btn primary" data-ac="sig">${s.i + 1 >= s.rondas.length ? 'Ver el resultado' : 'Siguiente ▶'}</button></div>` : '';
    L.innerHTML = cab + cuerpo + fb;
  }
  asignacionHTML(fin = false) {
    const a = this.opts.asignacion?.(); if (!a) return this.opts.esProfesor ? '<p class="ac-small">Modo práctica. Para que cuente en el cuaderno, asígnala como tarea desde la pestaña «Actividades de clase».</p>' : '<p class="ac-small">Modo práctica: el resultado no se guarda.</p>';
    const est = a.nota != null ? `Nota del profesor: <b>${esc(String(a.nota).replace('.', ','))}</b>` : a.entregado ? '📤 Ya has entregado un resultado: puedes mejorarlo hasta que el profesor lo califique.' : 'Todavía no has entregado.';
    return `<div class="ac-asig">📌 Tarea: <b>${esc(a.titulo)}</b><div class="ac-small">${est}</div>${fin && a.nota == null ? '<button class="btn primary" data-ac="entregar">📤 Entregar este resultado</button><span class="ac-msg" id="acMsg"></span>' : ''}</div>`;
  }
  async entregar(b) {
    const s = this.estado; const a = this.opts.asignacion?.(); if (!a) return;
    b.disabled = true; const msg = this.$('#acMsg'); msg.textContent = 'Enviando…';
    try { await this.opts.entregar(a.itemId, textoResultado(this.def, s.aciertos, s.rondas.length, s.detalle)); msg.textContent = '✔ Entregado'; msg.className = 'ac-msg ok'; }
    catch (e) { b.disabled = false; msg.textContent = '❌ No se ha podido entregar (' + (e?.code || e?.message || 'error') + ').'; msg.className = 'ac-msg ko'; }
  }
  onClick(e) {
    const b = e.target.closest('[data-ac]'); if (!b || !this.host.contains(b)) return;
    const a = b.dataset.ac;
    if (a === 'empezar') this.empezar();
    if (a === 'pieza') this.elegir(b.dataset.id);
    if (a === 'op') this.opcion(+b.dataset.k);
    if (a === 'sig') this.siguiente();
    if (a === 'entregar') this.entregar(b);
  }
  // ganchos para las pruebas
  // Punto de la pantalla donde se ve una pieza (para pruebas y accesibilidad): el centro de la primera malla
  // de la pieza que, al proyectarlo, el rayo realmente acierta.
  pantallaDe(id) {
    const x = this.objs.get(id); if (!x || !this.renderer) return null; const r = this.renderer.domElement.getBoundingClientRect();
    const mallas = []; x.g.traverse((m) => { if (m.isMesh) mallas.push(m); });
    mallas.sort((a, b) => new THREE.Box3().setFromObject(b).getSize(new THREE.Vector3()).length() - new THREE.Box3().setFromObject(a).getSize(new THREE.Vector3()).length());
    for (const m of mallas) {
      const v = new THREE.Box3().setFromObject(m).getCenter(new THREE.Vector3()).project(this.camera);
      const p = { x: r.left + ((v.x + 1) / 2) * r.width, y: r.top + ((1 - v.y) / 2) * r.height, clientX: 0, clientY: 0 }; p.clientX = p.x; p.clientY = p.y;
      if (this.pick(p) === id) return { x: p.x, y: p.y };
    }
    return null;
  }
}

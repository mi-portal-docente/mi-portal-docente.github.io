// Vista 3D e interfaz del modo «Vivienda real» (planta con tabiques, muebles, puntos, tubos y cuadro).
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PLANO, TIPOS_CASA, PALETA_CASA, area, estancia, estanciaEn, pegarPared, posPunto, ALTO_TUBO, casaVacia, sanearCasa, comprobarCasa, simularCasa, materialesCasa, caminos, minimos, circDefecto, solucionCasa, largoTuboCasa } from './casa.js';
import { CIRCUITOS, CALIBRES, CALIBRES_IGA, CALIBRES_ID, SECCIONES, TUBOS, tuboMinimo } from './catalogo.js';
import { mat, MAT, caja } from './modelos3d.js';
import { entorno } from '../kit3d/base.js';

const esc = (t) => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const num = (n) => String(n).replace('.', ',');
export const COLOR_CIRC = { C1: 0xf2b705, C2: 0x2f6fde, C3: 0xd62828, C4: 0x2f9e44, C5: 0x8e44ad };
const HEXC = (c) => '#' + (COLOR_CIRC[c] ?? 0x8a8f94).toString(16).padStart(6, '0');

export class CasaVista {
  constructor(lab) { this.lab = lab; this.m = casaVacia(); this.tool = 'mover'; this.colocar = null; this.sel = null; this.circNuevo = 'auto'; this.dNuevo = 20; this.tuboIni = null; this.mandoIni = null; this.red = false; this.labels = []; this.undoS = []; this.tab = 'guia'; this.chk = null; this.ro = false; }
  init(renderer) {
    if (this.scene) return;
    const s = this.scene = new THREE.Scene(); s.background = new THREE.Color(0xe8ecef); entorno(renderer, s, 0.35);
    s.add(new THREE.HemisphereLight(0xffffff, 0x8a7a66, 1.5)); const d = new THREE.DirectionalLight(0xffffff, 1.3); d.position.set(200, -300, 900); s.add(d);
    const cam = this.camera = new THREE.PerspectiveCamera(38, 1, 5, 6000); cam.up.set(0, 0, 1);
    const c = this.controls = new OrbitControls(cam, renderer.domElement); c.enableDamping = true; c.enabled = false; c.minDistance = 120; c.maxDistance = 2200; c.maxPolarAngle = 1.35; c.screenSpacePanning = true;
    c.mouseButtons = { LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.ROTATE };
    // suelo por estancias
    const colores = { vestibulo: 0xd9cbb3, pasillo: 0xd9cbb3, salon: 0xc9a77c, cocina: 0xdfe3e6, bano: 0xcfe3ea, dormitorio: 0xc9a77c };
    const fondo = new THREE.Mesh(new THREE.PlaneGeometry(1400, 1400), mat(0xb7bdb3, { roughness: 0.95 })); fondo.position.set(PLANO.w / 2, PLANO.h / 2, -1); s.add(fondo);
    this.labels = [];
    for (const e of PLANO.estancias) { const [x0, y0, x1, y1] = e.r; const f = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, y1 - y0), mat(colores[e.tipo] || 0xdddddd, { roughness: 0.85 })); f.position.set((x0 + x1) / 2, (y0 + y1) / 2, 0); s.add(f); }
    const muro = mat(0xf3f1ec, { roughness: 0.8 }), canto = mat(0x5a6168);
    for (const [x0, y0, x1, y1] of PLANO.muros) { const L = Math.hypot(x1 - x0, y1 - y0) + 10; const w = new THREE.Mesh(new THREE.BoxGeometry(L, 10, PLANO.alto), muro); w.position.set((x0 + x1) / 2, (y0 + y1) / 2, PLANO.alto / 2); w.rotation.z = Math.atan2(y1 - y0, x1 - x0); s.add(w); const t = new THREE.Mesh(new THREE.BoxGeometry(L, 10.5, 1), canto); t.position.set(w.position.x, w.position.y, PLANO.alto + 0.5); t.rotation.z = w.rotation.z; s.add(t); }
    const mueble = { banera: 0xffffff, lavabo: 0xffffff, inodoro: 0xffffff, encimera: 0x8b8f93, fregadero: 0xc4c8ce, placa: 0x1b1d1f, frigo: 0xe6e8ea, cama: 0x8fa9c7, sofa: 0x7c8b6e, mesa: 0x8a6a44 };
    for (const f of PLANO.muebles) { const [x0, y0, x1, y1] = f.r; const o = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, y1 - y0, f.h), mat(mueble[f.t] || 0xcccccc, { roughness: 0.6 })); o.position.set((x0 + x1) / 2, (y0 + y1) / 2, f.h / 2 + (f.t === 'fregadero' || f.t === 'placa' ? 0.5 : 0)); s.add(o); }
    // puerta de la calle
    const pc = PLANO.puertaCalle; const pu = new THREE.Mesh(new THREE.BoxGeometry(6, pc.ancho, 210), mat(0x6b4a2b)); pu.position.set(-6, pc.y, 105); pu.rotation.z = 0; s.add(pu);
    this.G = new THREE.Group(); s.add(this.G);
    this.ray = new THREE.Raycaster(); this.ndc = new THREE.Vector2(); this.plano = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    this.vista();
  }
  vista() { this.camera.position.set(PLANO.w / 2, -420, 980); this.controls.target.set(PLANO.w / 2, PLANO.h / 2 - 30, 0); this.controls.update(); }
  activar(on) { if (this.controls) this.controls.enabled = on; }
  cargar(m, ro = false) { this.m = sanearCasa(m); this.ro = ro; this.sel = null; this.undoS = []; this.chk = null; this.red = false; this.construir(); }
  guardar() { if (!this.ro) this.lab.storeSet('casa', this.m); }
  cambio(guardar = true) { if (guardar) this.guardar(); this.chk = null; this.construir(); this.lab.lado(); this.lab.paleta(); this.lab.estado(); }
  guardarUndo() { this.undoS.push(JSON.stringify(this.m)); if (this.undoS.length > 60) this.undoS.shift(); }
  deshacer() { if (!this.undoS.length || this.ro) return; this.m = sanearCasa(JSON.parse(this.undoS.pop())); this.sel = null; this.cambio(); }
  // ------------------------------------------------------------ 3D
  construir() {
    if (!this.G) return; const G = this.G;
    G.traverse((o) => { if (o.geometry && !o.geometry.userData?.compartida) o.geometry.dispose(); }); G.clear();
    this.labels = PLANO.estancias.map((e) => ({ txt: `${e.n} · ${num(Math.round(area(e) * 10) / 10)} m²`, v: new THREE.Vector3((e.r[0] + e.r[2]) / 2, (e.r[1] + e.r[3]) / 2, 2), cls: 'est' }));
    this.labels.push({ txt: 'Acceso', v: new THREE.Vector3(-40, PLANO.puertaCalle.y, 2), cls: 'est' });
    const m = this.m; const sim = this.red ? simularCasa(m) : null; const C = caminos(m);
    const selC = (id) => this.sel?.k === 'punto' && this.sel.id === id || (this.tuboIni === id) || (this.mandoIni === id);
    if (m.cuadro) { const o = caja(30, 30, 24, mat(this.sel?.k === 'cuadro' ? 0x7fb2ff : 0xf6f6f3), m.cuadro.x, m.cuadro.y, 168, G); o.position.z = 180; this.labels.push({ txt: 'Cuadro', v: new THREE.Vector3(m.cuadro.x, m.cuadro.y, 200), cls: 'ce' }); }
    for (const p of m.puntos) {
      const T = TIPOS_CASA[p.tipo]; const sel = selC(p.id); const col = sel ? 0x2b7bff : null;
      if (p.tipo === 'luz') { const on = sim?.luces.find((l) => l.id === p.id)?.on; const b = new THREE.Mesh(new THREE.SphereGeometry(9, 16, 12), new THREE.MeshStandardMaterial({ color: col || (on ? 0xfff1a8 : 0xf2efe6), emissive: 0xffc93a, emissiveIntensity: on ? 1.4 : 0 })); b.position.set(p.x, p.y, 238); G.add(b);
        if (on) { const l = new THREE.PointLight(0xffe7a0, 0.6, 400); l.position.set(p.x, p.y, 220); G.add(l); } }
      else if (p.tipo === 'caja') { caja(14, 14, 10, mat(col || 0x9aa1a6), p.x, p.y, T.h - 5, G); }
      else { const o = caja(12, 12, 12, mat(col || (p.tipo === 'base25' ? 0xd9d2c6 : 0xffffff)), p.x, p.y, T.h - 6, G); void o;
        const dot = caja(5, 5, 1, p.tipo.startsWith('base') ? mat(HEXC(p.circ)) : (p.tipo === 'interruptor' || p.tipo === 'conmutador') && p.on ? MAT.verde() : MAT.grisOsc(), p.x, p.y, T.h + 6, G); void dot; }
      // mástil fino hasta el suelo para ver la altura
      if (!T.techo && p.tipo !== 'caja') { const mm = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, T.h - 6, 6), mat(0x7d858c)); mm.rotation.x = Math.PI / 2; mm.position.set(p.x, p.y, (T.h - 6) / 2); G.add(mm); }
      this.labels.push({ txt: T.icon + (p.circ && p.tipo !== 'luz' && p.tipo !== 'interruptor' && p.tipo !== 'conmutador' && p.tipo !== 'timbre' ? ' ' + p.circ : ''), v: new THREE.Vector3(p.x, p.y, (T.techo ? 250 : T.h) + 14), cls: 'mini' + (sel ? ' sel' : '') + (C.conectado(p.id) ? '' : ' suelto') });
    }
    // mando (interruptor → luz): línea discontinua
    for (const s of m.puntos.filter((p) => p.manda)) for (const id of s.manda) { const l = m.puntos.find((q) => q.id === id); if (!l) continue; const g = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(s.x, s.y, TIPOS_CASA[s.tipo].h + 6), new THREE.Vector3(l.x, l.y, 236)]); const ln = new THREE.Line(g, new THREE.LineDashedMaterial({ color: 0x2b7bff, dashSize: 8, gapSize: 6 })); ln.computeLineDistances(); G.add(ln); }
    // tubos por el techo (rozas): sube, recorre en L y baja
    for (const t of m.tubos) {
      const a = posPunto(m, t.a), b = posPunto(m, t.b); if (!a || !b) continue; const cs = [...(C.porTubo.get(t.id) || [])];
      const pts = [new THREE.Vector3(a.x, a.y, a.h), new THREE.Vector3(a.x, a.y, ALTO_TUBO), new THREE.Vector3(b.x, a.y, ALTO_TUBO), new THREE.Vector3(b.x, b.y, ALTO_TUBO), new THREE.Vector3(b.x, b.y, b.h)];
      const path = new THREE.CurvePath(); for (let i = 1; i < pts.length; i++) if (pts[i].distanceTo(pts[i - 1]) > 0.1) path.add(new THREE.LineCurve3(pts[i - 1], pts[i]));
      if (!path.curves.length) continue;
      const sel = this.sel?.k === 'tubo' && this.sel.id === t.id; const mal = this.chk?.tubos?.has(t.id);
      const o = new THREE.Mesh(new THREE.TubeGeometry(path, 40, t.d / 12, 8), new THREE.MeshStandardMaterial({ color: sel ? 0x2b7bff : mal ? 0xff3030 : cs.length ? COLOR_CIRC[cs[0]] : 0x8a8f94, roughness: 0.6 })); G.add(o);
    }
  }
  punto(e, dom) { const r = dom.getBoundingClientRect(); this.ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); this.ray.setFromCamera(this.ndc, this.camera); const v = new THREE.Vector3(); return this.ray.ray.intersectPlane(this.plano, v) ? { x: v.x, y: v.y } : null; }
  pantalla(x, y, z, dom) { const v = new THREE.Vector3(x, y, z).project(this.camera); const r = dom.getBoundingClientRect(); return { x: r.left + ((v.x + 1) / 2) * r.width, y: r.top + ((1 - v.y) / 2) * r.height }; }
  // el punto más cercano en pantalla (los de techo y pared se ven a distinta altura)
  cerca(e, dom) {
    let best = null, bd = 22; const r = dom.getBoundingClientRect();
    const cands = this.m.puntos.map((p) => ({ id: p.id, x: p.x, y: p.y, z: TIPOS_CASA[p.tipo].techo ? 238 : TIPOS_CASA[p.tipo].h })); if (this.m.cuadro) cands.push({ id: 'Q', x: this.m.cuadro.x, y: this.m.cuadro.y, z: 180 });
    for (const c of cands) { const s = this.pantalla(c.x, c.y, c.z, dom); const d = Math.hypot(s.x - e.clientX, s.y - e.clientY); if (d < bd) { bd = d; best = c.id; } }
    void r; return best;
  }
  tuboEn(q) { let best = null, bd = 18; for (const t of this.m.tubos) { const a = posPunto(this.m, t.a), b = posPunto(this.m, t.b); if (!a || !b) continue; const segs = [[a.x, a.y, b.x, a.y], [b.x, a.y, b.x, b.y]]; for (const [x0, y0, x1, y1] of segs) { const dx = x1 - x0, dy = y1 - y0, L = dx * dx + dy * dy || 1; const tt = Math.max(0, Math.min(1, ((q.x - x0) * dx + (q.y - y0) * dy) / L)); const d = Math.hypot(x0 + tt * dx - q.x, y0 + tt * dy - q.y); if (d < bd) { bd = d; best = t; } } } return best; }
  onDown(e, dom) {
    const q = this.punto(e, dom); if (!q) return false; const id = this.cerca(e, dom); const m = this.m;
    if (this.red) { const p = m.puntos.find((x) => x.id === id); if (p && (p.tipo === 'interruptor' || p.tipo === 'conmutador')) { p.on = !p.on; this.cambio(!this.ro); return true; } return false; }
    if (this.ro) { if (id) { this.sel = id === 'Q' ? { k: 'cuadro' } : { k: 'punto', id }; this.construir(); this.lab.lado(); return true; } return false; }
    if (this.colocar) { this.poner(this.colocar, q); return true; }
    if (this.tool === 'tubo') { if (!id) return false; if (!this.tuboIni) { this.tuboIni = id; this.lab.toast('Tubo: ahora pulsa el otro extremo (caja de registro, cuadro o punto).'); } else if (id !== this.tuboIni) { this.nuevoTubo(this.tuboIni, id); this.tuboIni = null; } this.construir(); this.lab.estado(); return true; }
    if (this.tool === 'mandar') { const p = m.puntos.find((x) => x.id === id); if (!p) return false;
      if (!this.mandoIni) { if (p.tipo !== 'interruptor' && p.tipo !== 'conmutador') { this.lab.toast('Empieza por un interruptor o conmutador.'); return true; } this.mandoIni = id; this.lab.toast('Ahora pulsa el punto de luz que manda.'); }
      else { const s = m.puntos.find((x) => x.id === this.mandoIni); if (p.tipo !== 'luz') { this.lab.toast('Tiene que ser un punto de luz.'); return true; } this.guardarUndo(); if (!s.manda.includes(p.id)) s.manda.push(p.id); this.mandoIni = null; this.cambio(); return true; }
      this.construir(); return true; }
    if (id) { this.sel = id === 'Q' ? { k: 'cuadro' } : { k: 'punto', id }; if (id !== 'Q') this.arr = { id, movido: false }; else this.arr = { id: 'Q', movido: false }; this.construir(); this.lab.lado(); return true; }
    const t = this.tuboEn(q); if (t) { this.sel = { k: 'tubo', id: t.id }; this.construir(); this.lab.lado(); return true; }
    if (this.sel) { this.sel = null; this.construir(); this.lab.lado(); }
    return false;
  }
  onMove(e, dom) {
    if (!this.arr) return; const q = this.punto(e, dom); if (!q) return; const m = this.m;
    if (!this.arr.movido) { this.guardarUndo(); this.arr.movido = true; }
    if (this.arr.id === 'Q') { const w = pegarPared(q.x, q.y); m.cuadro = { x: w.x, y: w.y }; }
    else { const p = m.puntos.find((x) => x.id === this.arr.id); if (!p) return; const w = TIPOS_CASA[p.tipo].techo ? { x: Math.round(q.x), y: Math.round(q.y) } : pegarPared(q.x, q.y); p.x = w.x; p.y = w.y; p.est = estanciaEn(p.x, p.y); }
    if (!this._raf) this._raf = requestAnimationFrame(() => { this._raf = null; this.construir(); });
  }
  onUp() { if (this.arr) { const mov = this.arr.movido; this.arr = null; if (mov) this.cambio(); } }
  poner(tipo, q) {
    const m = this.m; this.guardarUndo();
    if (tipo === 'cuadro') { const w = pegarPared(q.x, q.y); m.cuadro = { x: w.x, y: w.y }; this.colocar = null; this.sel = { k: 'cuadro' }; this.cambio(); return; }
    const T = TIPOS_CASA[tipo]; const w = T.techo ? { x: Math.round(q.x), y: Math.round(q.y) } : pegarPared(q.x, q.y);
    const est = estanciaEn(w.x, w.y); if (!est) { this.undoS.pop(); this.lab.toast('Coloca el punto dentro de la vivienda.'); return; }
    let i = m.puntos.length + 1; while (m.puntos.some((p) => p.id === 'p' + i)) i++;
    const p = { id: 'p' + i, tipo, x: w.x, y: w.y, est, circ: T.circ === null ? null : tipo === 'base16' && this.circNuevo !== 'auto' ? this.circNuevo : circDefecto(tipo, est) };
    if (tipo === 'interruptor' || tipo === 'conmutador') { p.manda = []; p.on = false; }
    m.puntos.push(p); this.sel = { k: 'punto', id: p.id }; this.cambio();
  }
  nuevoTubo(a, b) { const m = this.m; if (m.tubos.some((t) => (t.a === a && t.b === b) || (t.a === b && t.b === a))) return this.lab.toast('Ya hay un tubo entre esos dos puntos.'); this.guardarUndo(); let i = m.tubos.length + 1; while (m.tubos.some((t) => t.id === 't' + i)) i++; m.tubos.push({ id: 't' + i, a, b, d: this.dNuevo }); this.cambio(); }
  borrarSel() {
    const s = this.sel; if (!s || this.ro) return; this.guardarUndo(); const m = this.m;
    if (s.k === 'tubo') m.tubos = m.tubos.filter((t) => t.id !== s.id);
    if (s.k === 'punto') { m.puntos = m.puntos.filter((p) => p.id !== s.id); m.tubos = m.tubos.filter((t) => t.a !== s.id && t.b !== s.id); m.puntos.forEach((p) => { if (p.manda) p.manda = p.manda.filter((x) => x !== s.id); }); }
    if (s.k === 'cuadro') { m.cuadro = null; m.tubos = m.tubos.filter((t) => t.a !== 'Q' && t.b !== 'Q'); }
    this.sel = null; this.cambio();
  }
  // ------------------------------------------------------------ paneles
  paletaHTML() {
    if (this.ro) return '<p class="vv-small">Revisión: solo lectura.</p>';
    return `<div class="vv-herr" role="group" aria-label="Herramienta">
      <button data-ctool="mover" class="${this.tool === 'mover' && !this.colocar ? 'on' : ''}">🖐 Mover</button><button data-ctool="tubo" class="${this.tool === 'tubo' ? 'on' : ''}" title="Pulsa dos puntos (cuadro, caja de registro o mecanismo)">〰 Tubo</button><button data-ctool="mandar" class="${this.tool === 'mandar' ? 'on' : ''}" title="Pulsa un interruptor y luego la luz que manda">🔗 Mandar</button></div>
      <label class="vv-f">Tubo nuevo<select data-cd>${TUBOS.map((d) => `<option value="${d}" ${d === this.dNuevo ? 'selected' : ''}>Ø${d} mm</option>`).join('')}</select></label>
      <h4>Cuadro</h4><div class="vv-items"><button data-cadd="cuadro" class="${this.colocar === 'cuadro' ? 'on' : ''}" ${this.m.cuadro ? 'disabled' : ''}><span>🗄️</span>Cuadro general</button></div>
      <h4>Puntos de utilización</h4><div class="vv-items">${PALETA_CASA.map((t) => `<button data-cadd="${t}" class="${this.colocar === t ? 'on' : ''}"><span>${TIPOS_CASA[t].icon}</span>${esc(TIPOS_CASA[t].n)}</button>`).join('')}</div>
      <label class="vv-f">Circuito de las bases de 16 A nuevas<select data-ccirc><option value="auto" ${this.circNuevo === 'auto' ? 'selected' : ''}>Automático (C2 · baño y cocina C5)</option>${['C2', 'C4', 'C5'].map((c) => `<option value="${c}" ${this.circNuevo === c ? 'selected' : ''}>${c} · ${esc(CIRCUITOS[c].n)}</option>`).join('')}</select></label>
      <p class="vv-small">Los mecanismos y bases se pegan a la pared más cercana; los puntos de luz van al techo. Arrastra el fondo para mover la vista · rueda = zoom · botón derecho = girar.</p>`;
  }
  inspectorHTML() {
    const s = this.sel; const m = this.m; if (!s) return ''; const ro = this.ro;
    if (s.k === 'cuadro') return `<section class="vv-insp"><h4>🗄️ Cuadro general de mando y protección</h4><p class="vv-small">En ${esc(estancia(estanciaEn(m.cuadro?.x ?? 0, m.cuadro?.y ?? 0))?.n || '—')}, a 1,80 m. Configura las protecciones en la pestaña «Cuadro».</p>${ro ? '' : '<button class="vv-btn small peligro" data-v="cBorrar">🗑 Quitar</button>'}</section>`;
    if (s.k === 'tubo') { const t = m.tubos.find((x) => x.id === s.id); if (!t) return ''; const cs = [...(caminos(m).porTubo.get(t.id) || [])]; const cond = cs.flatMap((c) => [m.secs[c], m.secs[c], m.secs[c]]); const min = tuboMinimo(cond);
      return `<section class="vv-insp"><h4>〰 Tubo corrugado</h4><p class="vv-small">${num(Math.round(largoTuboCasa(m, t) / 10) / 10)} m (subida, techo y bajada) · lleva ${cs.length ? cs.join(', ') + ` (${cond.length} cables)` : 'ningún circuito todavía'}${min ? ` · mínimo Ø${min} mm` : ''}</p>${ro ? '' : `<div class="vv-fila"><select data-ctd>${TUBOS.map((d) => `<option value="${d}" ${d === t.d ? 'selected' : ''}>Ø${d} mm</option>`).join('')}</select><button class="vv-btn small peligro" data-v="cBorrar">🗑 Borrar</button></div>`}</section>`; }
    const p = m.puntos.find((x) => x.id === s.id); if (!p) return ''; const T = TIPOS_CASA[p.tipo];
    let h = `<section class="vv-insp"><h4>${T.icon} ${esc(T.n)}</h4><p class="vv-small">${esc(estancia(p.est)?.n || (p.est === 'acceso' ? 'Acceso' : 'Fuera de la vivienda'))} · altura ${num(T.h / 100)} m${caminos(m).conectado(p.id) ? '' : ' · ⚠ sin tubo hasta el cuadro'}</p>`;
    if (p.tipo === 'base16' && !ro) h += `<label class="vv-f">Circuito<select data-pcirc>${['C2', 'C4', 'C5'].map((c) => `<option value="${c}" ${p.circ === c ? 'selected' : ''}>${c} · ${esc(CIRCUITOS[c].n)}</option>`).join('')}</select></label>`;
    else if (p.circ) h += `<p class="vv-small">Circuito ${p.circ} · ${esc(CIRCUITOS[p.circ].n)}</p>`;
    if (p.manda) h += `<p class="vv-small">Manda: ${p.manda.length ? p.manda.map((id) => esc(estancia(m.puntos.find((q) => q.id === id)?.est)?.n || id)).join(', ') : 'nada todavía (usa 🔗 Mandar)'}</p>${!ro && p.manda.length ? '<button class="vv-btn small" data-v="cSinMando">Quitar mandos</button>' : ''}`;
    if (!ro) h += `<div class="vv-fila"><button class="vv-btn small peligro" data-v="cBorrar">🗑 Borrar</button></div>`;
    return h + '</section>';
  }
  simHTML() {
    if (!this.red) return `<section class="vv-sim off"><b>Sin tensión.</b> <span class="vv-small">Pulsa «⚡ Dar la luz» y luego los interruptores para probar el alumbrado.</span></section>`;
    const r = simularCasa(this.m); return `<section class="vv-sim on">${r.con ? `<div class="vv-chips"><span class="vv-chip ok">Luces encendidas: ${r.luces.filter((l) => l.on).length} de ${r.luces.length}</span>${r.luces.some((l) => !l.llega) ? `<span class="vv-chip ko">${r.luces.filter((l) => !l.llega).length} sin alimentar</span>` : ''}</div>` : '<div class="vv-alerta">⚡ Sin cuadro completo (IGA, diferencial y C1) no llega la corriente.</div>'}<p class="vv-small">Pulsa los interruptores y conmutadores en el 3D.</p></section>`;
  }
  tabs() { return this.ro ? [['rev', 'Revisión'], ['cuadro', 'Cuadro'], ['comprobar', 'Comprobar'], ['materiales', 'Materiales']] : [['guia', 'Guía'], ['cuadro', 'Cuadro'], ['comprobar', 'Comprobar'], ['materiales', 'Materiales']]; }
  tabHTML(tab) {
    const m = this.m;
    if (tab === 'guia') {
      return `<p class="vv-small">Haz la instalación de este piso como lo haría un instalador, con los mínimos del <b>grado de electrificación básico</b> (ITC-BT-25):</p>
        <ol class="vv-pasos"><li>Coloca el <b>cuadro</b> en la entrada, junto a la puerta.</li><li>Configura en «Cuadro» el IGA, el diferencial y los circuitos <b>C1–C5</b> con su calibre y su sección.</li><li>Pon una <b>caja de registro</b> por zona y une cada una al cuadro con <b>tubo</b>.</li><li>Coloca en cada estancia sus <b>puntos de luz, interruptores y bases</b> (tabla de abajo) y llévales tubo desde su caja.</li><li>Con <b>🔗 Mandar</b>, une cada interruptor con su luz. En el pasillo, un conmutador en cada acceso.</li><li>Pulsa <b>Comprobar</b> y <b>⚡ Dar la luz</b> para probar.</li></ol>
        <table class="vv-mat"><thead><tr><th>Estancia</th><th>Mínimo</th></tr></thead><tbody>${PLANO.estancias.map((e) => { const r = minimos(e); return `<tr><td>${esc(e.n)}<br><span class="vv-small">${num(Math.round(area(e) * 10) / 10)} m²</span></td><td class="vv-small">${Object.entries(r).map(([k, v]) => `${v} × ${{ luz: 'luz', mando: e.tipo === 'pasillo' ? 'conmutador' : 'interruptor', C2: 'base C2', C3: 'base 25 A C3', C4: 'base C4', C5: 'base C5' }[k]}`).join(' · ')}</td></tr>`; }).join('')}<tr><td>Acceso</td><td class="vv-small">1 × pulsador de timbre</td></tr></tbody></table>
        ${this.lab.solucionProfesorHTML('casaSolucion')}${this.lab.entregaHTML()}`;
    }
    if (tab === 'cuadro') {
      const P = m.prot; const ro = this.ro ? 'disabled' : '';
      return `<p class="vv-small">Cuadro general de la vivienda (ITC-BT-25): IGA de 25 A como mínimo, un diferencial de 30 mA y un magnetotérmico por circuito.</p>
        <div class="vv-cuadro-cfg"><label>IGA<select data-cprot="iga" ${ro}><option value="">— sin IGA —</option>${CALIBRES_IGA.map((a) => `<option value="${a}" ${P.iga === a ? 'selected' : ''}>${a} A</option>`).join('')}</select></label>
        <label>Diferencial 30 mA<select data-cprot="id" ${ro}><option value="">— sin diferencial —</option>${CALIBRES_ID.map((a) => `<option value="${a}" ${P.id === a ? 'selected' : ''}>${a} A</option>`).join('')}</select></label></div>
        <table class="vv-mat vv-circ"><thead><tr><th>Circuito</th><th>Magnetotérmico</th><th>Curva</th><th>Cable</th></tr></thead><tbody>${Object.entries(CIRCUITOS).map(([c, D]) => { const q = P.mts[c]; return `<tr><td><span class="vv-dot" style="background:${HEXC(c)}"></span><b>${c}</b> <span class="vv-small">${esc(D.n)}</span></td>
          <td><select data-cmt="${c}" ${ro}><option value="">—</option>${CALIBRES.map((a) => `<option value="${a}" ${q?.In === a ? 'selected' : ''}>${a} A</option>`).join('')}</select></td>
          <td><select data-ccurva="${c}" ${ro || (!q ? 'disabled' : '')}>${['B', 'C'].map((k) => `<option ${q?.curva === k ? 'selected' : ''}>${k}</option>`).join('')}</select></td>
          <td><select data-csec="${c}" ${ro}>${SECCIONES.map((s) => `<option value="${s}" ${m.secs[c] === s ? 'selected' : ''}>${num(s)} mm²</option>`).join('')}</select></td></tr>`; }).join('')}</tbody></table>
        <p class="vv-small">Pista: mira la tabla 1 de la ITC-BT-25 (C1 alumbrado, C2 tomas, C3 cocina y horno, C4 lavadora/lavavajillas/termo, C5 baño y encimera).</p>`;
    }
    if (tab === 'comprobar') {
      const R = this.chk; let h = `<div class="vv-fila"><button class="vv-btn primary" data-v="cComprobar">✔ Comprobar la vivienda</button></div>`;
      if (R) h += `<div class="vv-check ${R.ok ? 'ok' : 'ko'}"><div class="vv-ch">${R.ok ? '✅ ¡Cumple los mínimos del REBT!' : `❌ ${R.items.filter((i) => !i.ok).length} cosas por corregir`}</div><ul>${R.items.map((i) => `<li class="${i.ok ? 'ok' : 'ko'}">${i.ok ? '✔' : '✖'} ${esc(i.t)}</li>`).join('')}</ul></div>`;
      return h + (this.ro ? '' : this.lab.entregaHTML());
    }
    if (tab === 'materiales') { const L = materialesCasa(m); if (!L.length) return '<p class="vv-small">Coloca el cuadro, los puntos y los tubos para calcular los materiales.</p>'; return this.lab.tablaMateriales(L); }
    if (tab === 'rev') return this.lab.revisionHTML();
    return '';
  }
  comprobar() { const R = comprobarCasa(this.m); this.chk = { ...R, tubos: new Set(R.items.flatMap((i) => i.tubos || [])) }; this.construir(); return R; }
  onClick(t) {
    const ct = t.closest('[data-ctool]'); if (ct) { this.tool = ct.dataset.ctool; this.colocar = null; this.tuboIni = null; this.mandoIni = null; this.lab.paleta(); this.lab.estado(); return true; }
    const ca = t.closest('[data-cadd]'); if (ca) { this.colocar = this.colocar === ca.dataset.cadd ? null : ca.dataset.cadd; this.tool = 'mover'; this.lab.paleta(); this.lab.estado(); return true; }
    const b = t.closest('[data-v]'); if (!b) return false; const v = b.dataset.v;
    if (v === 'cBorrar') { this.borrarSel(); return true; }
    if (v === 'cSinMando') { const p = this.m.puntos.find((x) => x.id === this.sel?.id); if (p) { this.guardarUndo(); p.manda = []; this.cambio(); } return true; }
    if (v === 'cComprobar') { this.comprobar(); this.lab.lado(); return true; }
    if (v === 'casaSolucion') { if ((this.lab.opts.confirm || confirm)('¿Cargar una solución de referencia de la vivienda? (se puede deshacer)')) { this.guardarUndo(); this.m = sanearCasa(solucionCasa()); this.cambio(); } return true; }
    return false;
  }
  onChange(t) {
    const m = this.m; const P = m.prot;
    if (t.matches('[data-cd]')) { this.dNuevo = +t.value; return true; }
    if (t.matches('[data-ccirc]')) { this.circNuevo = t.value; return true; }
    if (t.matches('[data-ctd]')) { const x = m.tubos.find((q) => q.id === this.sel?.id); if (x) { this.guardarUndo(); x.d = +t.value; this.cambio(); } return true; }
    if (t.matches('[data-pcirc]')) { const x = m.puntos.find((q) => q.id === this.sel?.id); if (x) { this.guardarUndo(); x.circ = t.value; this.cambio(); } return true; }
    if (t.matches('[data-cprot]')) { this.guardarUndo(); P[t.dataset.cprot] = t.value ? +t.value : null; this.cambio(); return true; }
    if (t.matches('[data-cmt]')) { this.guardarUndo(); const c = t.dataset.cmt; if (t.value) P.mts[c] = { In: +t.value, curva: P.mts[c]?.curva || 'C' }; else delete P.mts[c]; this.cambio(); return true; }
    if (t.matches('[data-ccurva]')) { const c = t.dataset.ccurva; if (P.mts[c]) { this.guardarUndo(); P.mts[c].curva = t.value; this.cambio(); } return true; }
    if (t.matches('[data-csec]')) { this.guardarUndo(); m.secs[t.dataset.csec] = +t.value; this.cambio(); return true; }
    return false;
  }
  estado() { return this.colocar ? `Pulsa en el plano para colocar: <b>${esc(this.colocar === 'cuadro' ? 'Cuadro general' : TIPOS_CASA[this.colocar].n)}</b> · <kbd>Esc</kbd> para terminar` : this.tuboIni ? 'Tubo: pulsa el otro extremo' : this.mandoIni ? 'Mandar: pulsa el punto de luz' : this.tool === 'tubo' ? 'Tubo: pulsa el primer extremo (cuadro, caja de registro o mecanismo)' : this.tool === 'mandar' ? 'Mandar: pulsa un interruptor o conmutador' : this.ro ? 'Revisión · solo lectura' : 'Pulsa un punto para verlo · arrástralo para moverlo'; }
}

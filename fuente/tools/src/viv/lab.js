// Laboratorio 3D «Instalación de vivienda»: emulador del tablero eléctrico de taller (cuadro con IGA, diferencial y
// magnetotérmicos, mecanismos con sus bornes marcados, cajas de empalme vacías con fichas, tubo corrugado que se mide,
// se corta y se grapa, cables por color y sección, herramientas), taller de herramientas y vivienda real.
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { estudio, camaraSuave } from '../kit3d/escena.js';
import { M, canvasTex, glowTexture } from '../circ/models3d.js';
import { TIPOS, PALETA, COLORES, SECCIONES, CARGAS, fmtSec, vacio, partePorId, posParte, bornes, posBorne, nombreBorne, grupo, slotLibre, siguienteNombre, nuevoId,
  rutaTubo, rutaCable, tuboEntre, sanear, solucionTablero, averia, AVERIAS, REFERENCIA, TUBOS_REF, materiales, presupuesto, clone, dims, TAMANOS_TABLERO, ZT, ZMOD,
  esMT, esEnchufe, esMecanismo, amperios, circuitoDe, curvaDe, medidas, zBorne, tipoBorne, idealPelado, tramoTubo, largoTubo, puntoEnRuta, grapasAuto, huecoGrapas, extremo, prepararExtremos, prepararTodo,
  posicionesCaja, tamCaja, cablesDelTubo, metrosCable } from './modelo.js';
import { simular, comprobar, comprobarTablero, puntas, TXT_PUNTA, CONDUCE, medir, buscapolos } from './sim.js';
import { CIRCUITOS, CALIBRES, CALIBRES_IGA, CALIBRES_ID, CURVAS, CAJAS, FICHAS, BORNES, LARGOS_PELADO, PUNTAS, TUBOS, tuboMinimo, GRAPA_MAX, MARCAS, HERRAMIENTAS, REFERENCIAS, PROTEGE } from './catalogo.js';
import { mecanismo3D, bombilla3D, cajaEmpalme3D, modulo3D, cuadro3D, herramienta3D, rotulo } from './modelos3d.js';
import { Visor } from './visor.js';
import { entorno, calidad } from '../kit3d/base.js';
import { aislTex } from '../kit3d/cables.js';
const Q_ = calidad();
import { Taller } from './taller.js';
import { Montaje } from './montaje.js';
import { CasaVista } from './casa3d.js';
import { casaVacia, materialesCasa, sanearCasa, solucionCasa } from './casa.js';
import { instalarProyectos, parseProy, PRACTICA_PROY } from './proylab.js';
import { cuadro3D as cuadroDet } from './modelos3d.js';

const esc = (t) => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const portal = () => (typeof window !== 'undefined' ? window.PORTAL : null);
const LS = 'viv:v1:';
const store = { get(k) { try { return JSON.parse(localStorage.getItem(LS + k)); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(LS + k, JSON.stringify(v)); } catch (e) { } } };
const eur = (n) => (Math.round(n * 100) / 100).toFixed(2).replace('.', ',') + ' €';
const num = (n) => String(n).replace('.', ',');
const fin = (n, d = 0) => (Number.isFinite(+n) ? +n : d);
const PRACTICA = { tablero: 'v1', libre: 'v2', casa: 'v3', montaje: 'v4' };
const TITULO = { creditos: 'Créditos de las imágenes', tablero: 'Ejercicio guiado · Tablero eléctrico de la SA1', libre: 'Modo libre', taller: 'Taller de herramientas', casa: 'Vivienda real · piso de 2 dormitorios', montaje: 'Montaje paso a paso (juego)', revision: 'Revisión de una entrega' };
const BARRA = [
  ['mover', '🖐', 'Mover', 'Seleccionar y mover piezas · los cables se tiran desde los bornes'],
  ['tubo', '〰', 'Tubo', 'Tubo corrugado: pulsa una pieza y luego otra'],
  ['flexometro', '📏', 'Medir', 'Flexómetro: pulsa un tubo para medir el tramo'],
  ['cortatubos', '✂', 'Cortar', 'Tijera cortatubos: corta el tubo medido'],
  ['grapa', '📎', 'Grapa', 'Grapa o abrazadera: pulsa sobre el tubo (máximo cada 50 cm)'],
  ['taladro', '🔩', 'Taladro', 'Taladro-atornillador: fija las cajas y los mecanismos al tablero'],
  ['pelacables', '🧤', 'Pelar', 'Pelacables: pela las puntas de los cables de un borne'],
  ['destornillador', '🪛', 'Apretar', 'Destornillador: aprieta el borne (elige la punta)'],
  ['multimetro', '📟', 'Polímetro', 'Multímetro: mide tensión o continuidad entre dos bornes'],
  ['buscapolos', '🔦', 'Buscapolos', 'Buscapolos: toca un borne para ver si es la fase'],
];
const NECESITA_REALISTA = new Set(['flexometro', 'cortatubos', 'grapa', 'taladro', 'pelacables', 'destornillador']);
const MARCA = (type, t) => (MARCAS[type]?.[t]) || (t === 'PE' ? '⏚' : t);
const COL_MARCA = (t) => (t === 'PE' || t === '⏚' ? '#2f9e44' : t === 'N' ? '#1f5fd6' : '#7a4a22');

export class ViviendaLab {
  constructor(host, opts = {}) {
    this.host = host; this.opts = opts;
    this.m = vacio(); this.modo = null; this.tool = 'mover'; this.colocar = null; this.sel = null;
    this.color = 'marron'; this.sec = 1.5; this.red = false; this.test = false; this.tocar = false; this.res = null;
    this.undoS = []; this.tab = 'guia'; this.chk = null; this.cableIni = null; this.tuboIni = null; this.ro = false;
    this.realista = store.get('realista') !== false; this.rejilla = !!store.get('rejilla');
    this.punta = 'PZ1'; this.pelar = 'auto'; this.dTubo = 16; this.tamCaja = 100; this.inNuevo = 16; this.curvaNueva = 'C'; this.circNuevo = 'C2';
    this.multi = { modo: 'V', a: null, b: null, txt: '— — —' }; this.vistaActiva = 'tablero'; this.anims = [];
    this.taller = new Taller(this); this.casa = new CasaVista(this); this.montaje = new Montaje(this); this.redoS = [];
    host.innerHTML = this.shellHTML(); this.$ = (s) => host.querySelector(s);
    this.visor = new Visor(this.$('#vvView'));
    host.addEventListener('click', (e) => this.onClick(e));
    host.addEventListener('change', (e) => this.onChange(e));
    host.addEventListener('input', (e) => { if (e.target.matches('[data-precio]')) this.onPrecio(e.target); });
    window.addEventListener('keydown', (e) => this.onKey(e));
    window.addEventListener('resize', () => this.onResize());
  }
  storeSet(k, v) { store.set(k, v); }
  shellHTML() {
    return `<div class="vv is-home">
    <header class="vv-top"><a class="vv-brand" href="#eee/vivienda"><span class="vv-logo" aria-hidden="true">🏠</span><span class="vv-bt"><span class="vv-b1">Instalación de <b>vivienda</b></span><span class="vv-b2">Monta · cablea · comprueba</span></span></a>
      <div class="vv-ptitle" id="vvTitulo"></div>
      <div class="vv-actions">
        <button class="vv-ib" data-v="undo" id="vvUndo" title="Deshacer (Ctrl+Z)">↶</button><button class="vv-ib" data-v="redo" id="vvRedo" title="Rehacer (Ctrl+Y)">↷</button>
        <div class="vv-menu"><button class="vv-btn" data-v="archivo">Archivo ▾</button><div class="vv-dd" id="vvDD" hidden>
          <button data-v="exportar">⬇ Exportar a archivo (.json)</button><button data-v="importar">⬆ Importar archivo…</button><button data-v="vaciar">🧹 Vaciar</button>
          <button data-v="solucion" data-solo-prof>👁 Ver solución (profesor)</button></div></div>
        <button class="vv-red" data-v="red" id="vvRed">⚡ Enchufar la manguera</button>
      </div></header>
    <div class="vv-crumbs"><div id="vvCrumbs"></div><div class="vv-prof">${portal()?.navHTML?.() || ''}</div></div>
    <div class="vv-home" id="vvHome"></div>
    <div class="vv-ed">
      <aside class="vv-pal" id="vvPal"></aside>
      <section class="vv-view" id="vvView"><div id="vvGL"></div><div id="vvLabels" class="vv-labels"></div><div class="vtitle vv-vt" id="vvVT" hidden></div><div class="stepbar vv-stepbar" id="vvStep" hidden></div>
        <div class="vv-barra" id="vvBarra"></div>
        <div class="vv-multi" id="vvMulti" hidden></div>
        <div class="vv-tools"><button data-v="vista" title="Vista de frente">⌂</button><button data-v="acercar" title="Acercar">＋</button><button data-v="alejar" title="Alejar">－</button></div>
        <div class="vv-status" id="vvStatus"></div><div class="vv-toast" id="vvToast" hidden></div></section>
      <aside class="vv-side" id="vvSide"></aside>
    </div>
    <footer class="lesson-strip vv-strip" id="vvStrip" hidden></footer>
    <input type="file" id="vvFile" accept=".json,application/json" hidden></div>`;
  }

  // ------------------------------------------------------------------ pantallas
  show(v = 'home') {
    const root = this.$('.vv'); this.visor?.cerrar(); this._pick = null; this._medidas = null;
    const pp = parseProy(v); if (!pp) { this.proy = null; root.classList.remove('es-proy'); }
    if (v === 'home' || v === 'creditos') { this.modo = null; this.kind = v; root.classList.add('is-home'); root.classList.remove('is-ed'); this.pause(); this.$('#vvHome').innerHTML = v === 'creditos' ? this.creditosHTML() : this.homeHTML(); this.$('#vvTitulo').textContent = ''; this.crumbs(); this.stepbar(); this.strip(); this.$('#vvHome').scrollTop = 0; return; }
    root.classList.remove('is-home'); root.classList.add('is-ed');
    if (pp) { root.classList.add('es-proy'); const mismo = this.proy === pp.P && this.kind === (pp.montar ? 'proymontar' : 'proyecto'); if (mismo && !pp.montar) { this.irPaso(pp.paso); return; } if (mismo) return; this.rev = null; this.abrirProyecto(pp.P, pp.paso, pp.montar); return; }
    let modo = v, m = null;
    if (v.startsWith('averia-')) { const a = AVERIAS.find((x) => x.id === v.slice(7)); if (!a) return this.show('home'); modo = 'averia'; this.averia = a; m = store.get('av:' + a.id) || averia(a.id); }
    else if (v === 'tablero' || v === 'libre') m = store.get(v) || vacio();
    else if (v !== 'taller' && v !== 'casa' && v !== 'montaje') return this.show('home');
    const nuevo = this.modo !== v;
    this.modo = v; this.kind = modo; this.ro = false; this.rev = null;
    this.stepbar(); this.strip();
    root.dataset.modo = modo; root.classList.toggle('es-casa', modo === 'casa'); root.classList.toggle('es-taller', modo === 'taller'); root.classList.toggle('es-montaje', modo === 'montaje');
    this.$('#vvTitulo').innerHTML = `<span class="vv-pn">${{ averia: 'Avería', tablero: 'SA1', libre: 'Libre', taller: 'Taller', casa: 'Vivienda', montaje: 'Juego' }[modo]}</span><span>${esc(modo === 'averia' ? this.averia.n : TITULO[modo])}</span>`;
    this.crumbs(); this.initScene();
    if (modo === 'taller') { this.vistaActiva = 'taller'; if (this.renderer) this.taller.init(this.renderer); this.activarControles(); this.red = false; this.cambio(false); this.resume(); return; }
    if (modo === 'montaje') { this.vistaActiva = 'montaje'; if (this.renderer) { this.montaje.init(this.renderer); if (nuevo) { this.montaje.cargarEstado(); this.montaje.construir(); this.montaje.enfocar(); } } this.activarControles(); this.red = false; this.cambio(false); this.resume(); return; }
    if (modo === 'casa') { this.vistaActiva = 'casa'; if (this.renderer) this.casa.init(this.renderer); if (nuevo) this.casa.cargar(store.get('casa') || casaVacia()); this.activarControles(); this.casa.tab = 'guia'; this.cambio(false); this.resume(); return; }
    this.vistaActiva = 'tablero'; this.activarControles();
    if (nuevo || !this.m) { this.m = sanear(m); this.undoS = []; this.sel = null; this.res = null; this.chk = null; this.red = false; this.test = false; this._dimKey = null; }
    this.tab = modo === 'tablero' ? 'guia' : modo === 'averia' ? 'averia' : 'comprobar';
    this.cambio(false); this.vista(); this.resume();
  }
  crumbs() {
    const t = this.proy && (this.kind === 'proyecto' || this.kind === 'proymontar') ? `Proyecto ${this.proy.n} · ${this.proy.title}${this.kind === 'proymontar' ? ' · móntalo tú' : ''}` : this.kind === 'creditos' ? TITULO.creditos : this.modo ? (this.kind === 'averia' ? 'Avería: ' + this.averia.n : TITULO[this.kind] || '') : '';
    this.$('#vvCrumbs').innerHTML = `<a href="#inicio">Inicio</a> › <a href="#asig/eee/laboratorio">Equipos eléctricos y electrónicos</a> › ${t ? `<a href="#eee/vivienda">Instalación de vivienda</a> › <span>${esc(t)}</span>` : '<span>Instalación de vivienda</span>'}`;
    this.host.querySelectorAll('[data-solo-prof]').forEach((b) => { b.hidden = !portal()?.esProfesor; });
  }
  homeHTML() { this._averias = AVERIAS; return this.homeProyHTML(); }

  // ------------------------------------------------------------------ escena
  initScene() {
    if (this.renderer) { this.onResize(); return; }
    const el = this.$('#vvGL');
    let r; try { r = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true }); } catch (e) { el.innerHTML = '<p class="vv-small">Este navegador no puede mostrar 3D (WebGL).</p>'; return; }
    this.renderer = r; r.setPixelRatio(Math.min(1.5, window.devicePixelRatio || 1)); el.appendChild(r.domElement);
    const s = this.scene = new THREE.Scene(); s.background = new THREE.Color(0xe9eef0);
    this.camera = new THREE.PerspectiveCamera(32, 1, 1, 2000);
    // luz de estudio común (la del laboratorio ESP32): cielo, principal con sombra suave, relleno y contraluz
    const est = estudio(r, s, { escala: 110, entorno: 0.4, dir: [30, 110, 160], objetivo: [60, 40, 0], sombraR: 115, intPrincipal: 1.9, intCielo: 1.7, suelo: 0x8a7a66, sombrasSiempre: true, mapa: 2048 });
    const d = this.sol = est.principal;
    const pared = new THREE.Mesh(new THREE.PlaneGeometry(800, 500), M(0xdfe5e8)); pared.position.set(60, 40, -3); pared.receiveShadow = true; s.add(pared);
    this.T = new THREE.Group(); s.add(this.T);
    this.G = new THREE.Group(); s.add(this.G); this.ghost = new THREE.Group(); s.add(this.ghost); this.tmp = new THREE.Group(); s.add(this.tmp); this.actor = new THREE.Group(); s.add(this.actor);
    const c = this.controls = new OrbitControls(this.camera, r.domElement);
    c.target.set(60, 40, 0); camaraSuave(c, { polarMax: false, min: 15, max: 360 });
    c.minAzimuthAngle = -1.2; c.maxAzimuthAngle = 1.2; c.minPolarAngle = 0.6; c.maxPolarAngle = 2.3;
    c.mouseButtons = { LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.ROTATE }; c.screenSpacePanning = true;
    this.ray = new THREE.Raycaster(); this.ndc = new THREE.Vector2(); this.plano = new THREE.Plane(new THREE.Vector3(0, 0, 1), -ZT);
    el.addEventListener('pointerdown', (e) => this.onDown(e), true);
    el.addEventListener('pointermove', (e) => this.onMove(e));
    window.addEventListener('pointerup', (e) => this.onUp(e));
    el.addEventListener('contextmenu', (e) => e.preventDefault());
    this.labels = []; this.reloj = new THREE.Clock();
    this.onResize();
  }
  activarControles() { if (this.controls) this.controls.enabled = this.vistaActiva === 'tablero'; this.taller.activar(this.vistaActiva === 'taller'); this.casa.activar(this.vistaActiva === 'casa'); this.montaje.activar(this.vistaActiva === 'montaje'); }
  cur() { return this.vistaActiva === 'taller' && this.taller.scene ? this.taller : this.vistaActiva === 'montaje' && this.montaje.scene ? this.montaje : this.vistaActiva === 'casa' && this.casa.scene ? this.casa : this; }
  onResize() {
    if (!this.renderer) return; const v = this.$('#vvView'); const w = v.clientWidth || 800, h = v.clientHeight || 600;
    this.renderer.setSize(w, h, false); this.renderer.domElement.style.width = w + 'px'; this.renderer.domElement.style.height = h + 'px';
    for (const c of [this.camera, this.taller.camera, this.casa.camera, this.montaje.camera]) if (c) { c.aspect = w / h; c.updateProjectionMatrix(); }
    if (this.visor?.abierto) this.visor.resize();
  }
  // tablero de madera con regla en los bordes y rejilla opcional (cm)
  tablero() {
    const D = dims(this.m); const key = D.w + 'x' + D.h + (this.rejilla ? 'g' : ''); if (this._dimKey === key) return; this._dimKey = key;
    this.T.traverse((o) => { if (o.geometry) o.geometry.dispose(); }); this.T.clear(); this._texTab?.dispose();
    const px = 9; const W = Math.round(D.w * px), H = Math.round(D.h * px);
    const tex = this._texTab = canvasTex(W, H, (g, w, h) => {
      g.fillStyle = '#d9b47c'; g.fillRect(0, 0, w, h);
      let sd = 7; const rnd = () => ((sd = (sd * 9301 + 49297) % 233280) / 233280);
      for (let i = 0; i < 160; i++) { const y = rnd() * h; g.strokeStyle = `rgba(${120 + rnd() * 40},${80 + rnd() * 30},40,${0.08 + rnd() * 0.12})`; g.lineWidth = 1 + rnd() * 2.5; g.beginPath(); g.moveTo(0, y); for (let x = 0; x <= w; x += 64) g.lineTo(x, y + Math.sin(x / 140 + i) * 3); g.stroke(); }
      if (this.rejilla) { g.strokeStyle = 'rgba(60,40,20,.2)'; g.lineWidth = 1; for (let x = 10; x < D.w; x += 10) { g.beginPath(); g.moveTo(x * px, 0); g.lineTo(x * px, h); g.stroke(); } for (let y = 10; y < D.h; y += 10) { g.beginPath(); g.moveTo(0, h - y * px); g.lineTo(w, h - y * px); g.stroke(); } }
      g.fillStyle = 'rgba(255,248,220,.85)'; g.fillRect(0, h - 26, w, 26); g.fillRect(0, 0, 26, h);
      g.strokeStyle = '#3b2a18'; g.fillStyle = '#3b2a18'; g.font = 'bold 13px system-ui, sans-serif'; g.textAlign = 'center';
      for (let x = 0; x <= D.w; x++) { const l = x % 10 === 0 ? 14 : x % 5 === 0 ? 9 : 5; g.beginPath(); g.moveTo(x * px, h); g.lineTo(x * px, h - l); g.stroke(); if (x % 10 === 0 && x > 0 && x < D.w) g.fillText(String(x), x * px, h - 15); }
      g.textAlign = 'left';
      for (let y = 0; y <= D.h; y++) { const l = y % 10 === 0 ? 14 : y % 5 === 0 ? 9 : 5; g.beginPath(); g.moveTo(0, h - y * px); g.lineTo(l, h - y * px); g.stroke(); if (y % 10 === 0 && y > 0 && y < D.h) g.fillText(String(y), 15, h - y * px + 4); }
      g.font = 'bold 15px system-ui, sans-serif'; g.textAlign = 'right'; g.fillText(`Tablero ${D.w} × ${D.h} cm`, w - 10, h - 32);
    });
    const mt = [M(0x9a6b3a), M(0x9a6b3a), M(0x9a6b3a), M(0x9a6b3a), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.8 }), M(0x9a6b3a)];
    const tabla = new THREE.Mesh(new THREE.BoxGeometry(D.w, D.h, 2), mt); tabla.position.set(D.w / 2, D.h / 2, -1); tabla.receiveShadow = true; this.T.add(tabla);
    const marco = new THREE.Mesh(new THREE.BoxGeometry(D.w + 3, D.h + 3, 1.6), M(0x7a5230)); marco.position.set(D.w / 2, D.h / 2, -1.6); this.T.add(marco);
    this.sol.target.position.set(D.w / 2, D.h / 2, 0);
  }
  vista() {
    if (this.vistaActiva === 'taller') return this.taller.scene && this.taller.vista(); if (this.vistaActiva === 'montaje') return this.montaje.scene && this.montaje.vista(); if (this.vistaActiva === 'casa') return this.casa.scene && this.casa.vista();
    if (!this.camera) return; const a = this.camera.aspect || 1.5; const D = dims(this.m);
    const dist = Math.max(D.h / 2 / Math.tan((16 * Math.PI) / 180) * 1.12, (D.w / 2 / Math.tan((16 * Math.PI) / 180)) / a * 1.06);
    const lec = this.kind === 'proyecto'; this.camera.position.set(D.w / 2, D.h * (lec ? 0.3 : 0.38), dist * (lec ? 1.2 : 1.08)); this.controls.target.set(D.w / 2, D.h * (lec ? 0.36 : 0.44), 0); this.controls.update();
  }
  zoom(f) { const C = this.cur(); const c = C.camera, t = C.controls.target; c.position.sub(t).multiplyScalar(f).add(t); C.controls.update(); }
  pause() { this.renderer?.setAnimationLoop(null); }
  resume() {
    this.onResize();
    this.renderer?.setAnimationLoop(() => {
      const dt = Math.min(0.05, this.reloj.getDelta()); const C = this.cur();
      if (C === this.taller) this.taller.frame(dt); else if (C === this.montaje) this.montaje.frame(dt); else { C.controls.update(); if (C === this) this.animar(dt); }
      this.renderer.render(C.scene, C.camera); this.ponerEtiquetas();
    });
  }
  animar(dt) {
    if (!this.anims.length) return;
    for (const a of this.anims) { a.t += dt; a.paso(Math.min(1, a.t / a.dur)); }
    const fuera = this.anims.filter((a) => a.t >= a.dur); if (fuera.length) { fuera.forEach((a) => this.actor.remove(a.o)); this.anims = this.anims.filter((a) => a.t < a.dur); }
  }
  animHerr(id, p, z, o = {}) {
    if (!this.actor || !p) return; const h = herramienta3D(id, { punta: this.punta }); h.scale.setScalar(o.escala || 0.6); this.actor.add(h);
    const gira = id === 'destornillador' || id === 'taladro';
    this.anims.push({ o: h, t: 0, dur: 1.1, paso: (f) => { h.position.set(p.x, p.y, z + (f < 0.3 ? (1 - f / 0.3) * 8 : f > 0.8 ? (f - 0.8) * 40 : 0)); if (gira && f > 0.3 && f < 0.8) h.rotation.z = (f - 0.3) * (o.mal ? 3 : 18); if (!gira) h.rotation.x = -0.5; } });
  }

  // ------------------------------------------------------------------ construir el 3D del tablero
  construir() {
    if (this.vistaActiva === 'casa') return this.casa.construir();
    if (this.vistaActiva === 'taller' || this.vistaActiva === 'montaje' || !this.G) return; this.tablero();
    const G = this.G; G.traverse((o) => { if (o.geometry && !o.geometry.userData?.compartida && !o.userData.compartida) o.geometry.dispose(); const mt = o.material; if (mt?.userData?.desechable) { if (mt.userData.mapa) mt.map?.dispose(); mt.dispose(); } }); G.clear(); this.labels = [];
    const m = this.m; const r = this.res;
    const abierto = new Set(r ? r.abiertos : m.parts.filter((p) => TIPOS[p.type].modulo && p.on === false).map((p) => p.id));
    const selId = this.sel?.k === 'parte' ? this.sel.id : null;
    const lbl = (txt, x, y, z, cls = '') => this.labels.push({ txt, v: new THREE.Vector3(x, y, z), cls });
    const P = r?.puntas || puntas(m); this._puntas = P;
    const malBorne = new Map(); if (this.realista || this.chk) for (const c of m.cables) { const o = P.get(c.id); if (!o) continue; for (const lado of ['a', 'b']) if (o[lado] !== 'ok') { const k = c[lado].p + ':' + c[lado].t; malBorne.set(k, CONDUCE.has(o[lado]) && malBorne.get(k) !== 'ko' ? 'aviso' : 'ko'); } }
    // tubos: tramo visible de borde a borde, diámetro real, grapas (malla instanciada) y medida
    const grapas = [];
    for (const t of m.tubos) {
      const T = tramoTubo(m, t); if (T.pts.length < 2) continue; const tot = T.L + T.ini + T.fin;
      const ruta = [puntoEnRuta(T.pts, T.ini)]; let acc = 0;
      for (let i = 1; i < T.pts.length - 1; i++) { acc += Math.hypot(T.pts[i].x - T.pts[i - 1].x, T.pts[i].y - T.pts[i - 1].y); if (acc > T.ini && acc < tot - T.fin) ruta.push(T.pts[i]); }
      ruta.push(puntoEnRuta(T.pts, tot - T.fin));
      const rad = fin(t.d, 16) / 20; const zc = rad + 0.05;
      const path = new THREE.CurvePath(); for (let i = 1; i < ruta.length; i++) { const a = ruta[i - 1], b = ruta[i]; if (Number.isFinite(a.x + a.y + b.x + b.y) && Math.hypot(b.x - a.x, b.y - a.y) > 0.01) path.add(new THREE.LineCurve3(new THREE.Vector3(a.x, a.y, zc), new THREE.Vector3(b.x, b.y, zc))); }
      if (!path.curves.length) continue;
      const L = path.getLength(); const tx = this.texTubo().clone(); tx.repeat.set(Math.max(1, L / 1.2), 1); tx.needsUpdate = true;
      const sel = this.sel?.k === 'tubo' && this.sel.id === t.id; const mal = this.chk?.tubos?.has(t.id);
      const o = new THREE.Mesh(new THREE.TubeGeometry(path, Math.max(8, Math.round(L / 2)), rad, 10, false), new THREE.MeshStandardMaterial({ map: tx, color: sel ? 0x7fb2ff : mal ? 0xff8080 : t.cort === 'ok' ? 0xffffff : 0xd8dde2, roughness: 0.6 })); o.material.userData = { desechable: true, mapa: true };
      o.castShadow = true; G.add(o);
      for (const s of t.grapas || []) { const q = puntoEnRuta(T.pts, T.ini + s); if (q && Number.isFinite(q.x)) grapas.push({ x: q.x, y: q.y, h: q.dir === 'h', rad }); }
      const mid = puntoEnRuta(T.pts, T.ini + T.L / 2);
      if (this.realista && (t.med || t.cort !== 'ok')) lbl(`${t.med ? '📏 ' + num(largoTubo(m, t)) + ' cm' : ''}${!t.cort ? (t.med ? ' · ' : '') + 'sin cortar' : t.cort === 'corto' ? ' · corte sin medir' : ''} · Ø${t.d}`, mid.x, mid.y, 2 * rad + 0.8, t.cort === 'ok' ? 'mini' : 'mini aviso');
    }
    if (grapas.length) {
      const gm = new THREE.InstancedMesh(this.geoGrapa(), M(0xf2f2ee, { roughness: 0.5 }), grapas.length); const o3 = new THREE.Object3D();
      grapas.forEach((g, i) => { o3.position.set(g.x, g.y, 0); o3.rotation.set(0, 0, g.h ? Math.PI / 2 : 0); o3.scale.setScalar(Math.max(0.8, g.rad / 0.8)); o3.updateMatrix(); gm.setMatrixAt(i, o3.matrix); });
      gm.userData.compartida = true; G.add(gm);
    }
    // piezas
    for (const p of m.parts) {
      const c = posParte(m, p); if (!c || !Number.isFinite(c.x) || !Number.isFinite(c.y)) continue; const T = TIPOS[p.type]; const sel = p.id === selId; const md = medidas(p);
      let o = null;
      if (p.type === 'cuadro') { o = cuadro3D(T.w, T.h); o.position.set(c.x, c.y, 0); lbl('Cuadro · carril DIN de 12 módulos', c.x, c.y - T.h / 2 - 2.2, 1, 'pie');
        const mods = m.parts.filter((q) => q.cuadro === p.id && TIPOS[q.type].modulo).map((q) => posParte(m, q)).filter(Boolean);
        if (mods.length > 1) { const xs = mods.map((q) => q.x); const x0 = Math.min(...xs) - 0.9, x1 = Math.max(...xs) + 0.9; const pe = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, 0.5, 0.35), M(0xc8743c, { metalness: 0.6, roughness: 0.35 })); pe.position.set((x0 + x1) / 2, c.y + 1 + 3.4, ZMOD + 0.5); G.add(pe); lbl('peine', x1 + 1.2, c.y + 4.4, ZMOD + 0.5, 'mini'); }
      } else if (T.modulo) {
        const on = !abierto.has(p.id); const disp = r?.disparos?.some((d) => d.p === p.id);
        o = modulo3D(esMT(p) ? 'mt' : p.type, { In: amperios(p), curva: curvaDe(p), circ: circuitoDe(p) || '', on, disparado: disp }); o.position.set(c.x, c.y, ZMOD - 4.4);
      } else if (p.type === 'manguera') {
        const pts = [new THREE.Vector3(c.x + 1, c.y, 2), new THREE.Vector3(-1.5, c.y, 2), new THREE.Vector3(-3, c.y - 3, 2), new THREE.Vector3(-3, -12, 2)];
        const mg = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, 0.75, 10), M(0x161616, { roughness: 0.5 })); mg.castShadow = true; G.add(mg);
        const cl = new THREE.Mesh(new THREE.BoxGeometry(4.5, 5.5, 4), M(0x1d1d1d)); cl.position.set(-3, -15, 2); G.add(cl);
        lbl(this.red ? '🔌 Manguera enchufada (230 V)' : 'Manguera 3 × 2,5 mm² con clavija', 9, -6, 2, this.red ? 'on' : 'pie');
      } else if (p.type === 'bombilla') {
        const b = r?.bombillas?.find((x) => x.id === p.id); const luz = b ? b.luz : 0;
        o = bombilla3D(luz, { tablero: true }); o.position.set(c.x, c.y, 0);
        o.traverse((x) => { if (x.isMesh && x.name === 'bombilla') { x.material.userData.desechable = true; } });
        if (luz > 0.05) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: 0xffcf40, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.85 * luz })); sp.material.userData.desechable = true; sp.scale.set(22 * luz + 4, 22 * luz + 4, 1); sp.position.set(c.x, c.y, 7); G.add(sp); }
        lbl(p.nombre, c.x, c.y + 6.4, 4);
      } else if (p.type === 'caja') {
        o = cajaEmpalme3D(tamCaja(p), p.fichas || {}, posicionesCaja(tamCaja(p)), { tapa: !!p.tapa }); o.position.set(c.x, c.y, 0);
        lbl(`${p.nombre} · ${tamCaja(p)}×${tamCaja(p)}`, c.x, c.y + md.h / 2 + 1.8, 3, 'ce');
      } else {
        o = mecanismo3D(p.type, { tablero: true, on: p.on, pos: p.pos, empotrar: p.montaje === 'empotrar' }); o.position.set(c.x, c.y, 0);
        const on = p.type === 'conmutador' || p.type === 'cruzamiento' ? p.pos : p.on;
        if (esEnchufe(p)) { const e = r?.enchufes?.find((x) => x.id === p.id); const cg = CARGAS.find((x) => x.id === p.carga); lbl(`${p.nombre}${e && this.red ? ` · ${Math.round(e.v)} V` : ''}${p.carga && p.carga !== 'nada' ? ` · ${cg?.n || ''}` : ''}`, c.x, c.y - 5.8, 2, e && e.vCarcasa > 50 ? 'peligro' : ''); }
        else lbl(p.nombre + (this.red && p.type !== 'cruzamiento' ? (on ? ' · ON' : ' · OFF') : ''), c.x, c.y - 5.8, 2, this.red ? (on ? 'on' : '') : '');
      }
      if (o) { o.traverse((x) => { if (x.isMesh) x.castShadow = true; }); G.add(o); }
      if (this.realista && !T.modulo && p.type !== 'manguera' && !p.fijado) lbl('🔩 sin fijar', c.x + md.w / 2, c.y + md.h / 2, 3, 'mini aviso');
      if (sel) this.marco(c.x, c.y, md.w + (T.modulo ? 0.6 : 1.5), md.h + (T.modulo ? 0.6 : 1.5), T.modulo ? ZMOD + 2.1 : 0.3);
      // bornes y su marcado (L, N, ⏚, 1, 2…)
      for (const b of bornes(p)) {
        const ref = { p: p.id, t: b.t }; const k = p.id + ':' + b.t; const pb = posBorne(m, ref); if (!pb) continue;
        const ini = this.cableIni && this.cableIni.p === p.id && this.cableIni.t === b.t;
        const hov = this.hover && this.hover.p === p.id && this.hover.t === b.t; const mb = malBorne.get(k); const mA = this.tool === 'multimetro' && this.multi.a && this.multi.a.p === p.id && this.multi.a.t === b.t;
        const col = ini ? 0x19c37d : hov ? 0x3aa0ff : mA ? 0xd01a1a : mb === 'ko' ? 0xe23b3b : mb === 'aviso' ? 0xff9a1f : 0xc9a45a;
        const s = new THREE.Mesh(this.geoBorne(), M(col, { metalness: 0.7, roughness: 0.3, emissive: ini || hov || mb ? col : 0x000000, emissiveIntensity: 0.35 }));
        s.userData.compartida = true; const z = zBorne(m, ref); s.position.set(pb.x, pb.y, z); G.add(s);
        const cz = new THREE.Mesh(this.geoCruz(), M(0x3a2e12, { roughness: 0.8 })); s.add(cz);
        if (p.type !== 'caja' && p.type !== 'cuadro' && !T.modulo) { const mk = MARCA(p.type, b.t); rotulo(mk, 1.3, 0.9, pb.x, pb.y + (b.dy < 0 ? -1.15 : 1.05), Math.max(0.05, z - 0.3), G, { color: COL_MARCA(b.t === 'PE' ? 'PE' : mk), bg: '#fff8e6', w: 96, h: 64, font: 'bold 50px system-ui, sans-serif' }); }
      }
    }
    // cables, con el cobre pelado en las puntas
    const porTramo = new Map();
    for (const c of m.cables) {
      const rc = rutaCable(m, c); if (rc.pts.length < 2 || rc.pts.some((q) => !Number.isFinite(q.x) || !Number.isFinite(q.y))) continue;
      const key = rc.interno ? 'int' : [grupo(m, c.a.p), grupo(m, c.b.p)].sort().join('|'); const idx = porTramo.get(key) || 0; porTramo.set(key, idx + 1);
      const off = ((idx % 6) - 2.5) * 0.3;
      const za = zBorne(m, c.a), zb = zBorne(m, c.b); const t = rc.tubo ? m.tubos.find((x) => x.id === rc.tubo) : null; const zt = t ? fin(t.d, 16) / 20 + 0.05 : 2.25;
      const Pp = rc.pts.map((q, i) => new THREE.Vector3(q.x, q.y, i === 0 ? za : i === rc.pts.length - 1 ? zb : zt));
      if (rc.enTubo && !rc.interno) {
        for (let i = 1; i < Pp.length - 1; i++) { Pp[i].x += off; Pp[i].y += off; }
        if (Pp.length === 2) { const a = Pp[0], b = Pp[1]; Pp.splice(1, 0, new THREE.Vector3(a.x + (b.x - a.x) * 0.2 + off, a.y + (b.y - a.y) * 0.2 + off, zt), new THREE.Vector3(a.x + (b.x - a.x) * 0.8 + off, a.y + (b.y - a.y) * 0.8 + off, zt)); }
        else { const a = Pp[0], b = Pp[1]; Pp.splice(1, 0, new THREE.Vector3(a.x + (b.x - a.x) * 0.15 + off, a.y + (b.y - a.y) * 0.15 + off, zt)); const n = Pp.length, y = Pp[n - 2], z = Pp[n - 1]; Pp.splice(n - 1, 0, new THREE.Vector3(z.x + (y.x - z.x) * 0.15 + off, z.y + (y.y - z.y) * 0.15 + off, zt)); }
      } else if (!rc.interno) { const a = Pp[0], b = Pp[Pp.length - 1]; Pp.splice(1, 0, new THREE.Vector3((a.x + b.x) / 2, (a.y + b.y) / 2, 6)); }
      else { const a = Pp[0], b = Pp[1]; Pp.splice(1, 0, new THREE.Vector3((a.x + b.x) / 2, (a.y + b.y) / 2 - 1.2, Math.max(a.z, b.z) + 0.8)); }
      const Q = Pp.filter((v, i) => i === 0 || v.distanceTo(Pp[i - 1]) > 0.01); if (Q.length < 2) continue; // sin puntos repetidos (evita NaN)
      const curva = new THREE.CatmullRomCurve3(Q, false, 'centripetal', 0.2);
      const sel = this.sel?.k === 'cable' && this.sel.id === c.id; const mal = this.chk?.cables?.has(c.id);
      const rr = c.sec >= 4 ? 0.36 : c.sec >= 2.5 ? 0.3 : 0.22;
      // aislamiento de PVC con el rotulado H07V-K continuo (como el cable real), del color normalizado
      const Lt = curva.getLength(); const tx = this.texCable(c.color, c.sec || 1.5, Lt);
      const mt = Object.assign(new THREE.MeshPhysicalMaterial({ map: tx, roughness: 0.4, clearcoat: 0.35, clearcoatRoughness: 0.35, emissive: sel ? 0x2244aa : mal ? 0x550000 : 0x000000 }), { userData: { desechable: true } });
      const o = new THREE.Mesh(new THREE.TubeGeometry(curva, Math.max(16, Q.length * 14), rr, Q_.baja ? 8 : 12, false), mt); o.castShadow = true; G.add(o);
      if (!rc.enTubo) { const d = new THREE.Mesh(new THREE.TubeGeometry(curva, 30, 0.5, 6, false), new THREE.MeshBasicMaterial({ color: 0xff3030, transparent: true, opacity: 0.25, depthWrite: false })); d.material.userData.desechable = true; G.add(d); }
      const Lc = curva.getLength();
      for (const lado of ['a', 'b']) { const e = extremo(c, lado); if (!e.pel || !(Lc > 0.2)) continue; const f = Math.min(0.45, e.pel / 10 / Lc); const u0 = lado === 'a' ? 0 : 1 - f, u1 = lado === 'a' ? f : 1;
        const pts = []; for (let i = 0; i <= 4; i++) pts.push(curva.getPointAt(u0 + ((u1 - u0) * i) / 4)); if (pts[0].distanceTo(pts[4]) < 0.02) continue;
        G.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 6, rr * 0.75 + 0.03, 10, false), this.matCobre())); }
    }
    if (this.tool === 'multimetro') for (const [ref, col] of [[this.multi.a, 0xd01a1a], [this.multi.b, 0x111111]]) { if (!ref || ref === 'TIERRA') continue; const q = posBorne(m, ref); if (!q) continue; const s = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 6, 8), M(col)); s.rotation.x = Math.PI / 2; s.position.set(q.x + 0.3, q.y + 0.3, zBorne(m, ref) + 3); G.add(s); }
    if (this.sel?.k === 'cable') { const c = m.cables.find((x) => x.id === this.sel.id); const o = c && P.get(c.id); if (o) for (const lado of ['a', 'b']) { const q = posBorne(m, c[lado]); if (q && o[lado] !== 'ok') lbl('⚠ ' + TXT_PUNTA[o[lado]], q.x, q.y, zBorne(m, c[lado]) + 1.5, 'mini aviso'); } }
    this.pintarGuias();
  }
  // borne: cabeza de tornillo de latón (con su cruz PZ) en vez de una bola; se elige por cercanía en pantalla, no por su forma
  geoBorne() { if (!this._gb) { this._gb = new THREE.LatheGeometry([[0, -0.2], [0.5, -0.2], [0.53, -0.1], [0.52, 0.06], [0.44, 0.17], [0.16, 0.2], [0.16, 0.08], [0, 0.08]].map(([r, y]) => new THREE.Vector2(r, y)), 20); this._gb.rotateX(Math.PI / 2); this._gb.userData.compartida = true; } return this._gb; }
  geoCruz() { if (!this._gx) { const a = new THREE.BoxGeometry(0.62, 0.11, 0.06), b = new THREE.BoxGeometry(0.11, 0.62, 0.06); const pos = [...a.toNonIndexed().attributes.position.array, ...b.toNonIndexed().attributes.position.array]; this._gx = new THREE.BufferGeometry(); this._gx.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); this._gx.computeVertexNormals(); this._gx.translate(0, 0, 0.18); this._gx.userData.compartida = true; } return this._gx; }
  geoGrapa() { if (this._gg) return this._gg; const parts = [[2.6, 0.5, 0.25, 0, 0, 1.8], [0.25, 0.5, 1.8, -1.2, 0, 0.9], [0.25, 0.5, 1.8, 1.2, 0, 0.9]]; const pos = [];
    for (const [w, h, d, x, y, z] of parts) { const g = new THREE.BoxGeometry(w, h, d); g.translate(x, y, z); pos.push(...g.toNonIndexed().attributes.position.array); g.dispose(); }
    const r = new THREE.BufferGeometry(); r.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); r.computeVertexNormals(); r.userData.compartida = true; return (this._gg = r); }
  marco(x, y, w, h, z = 0.3) { const g = new THREE.EdgesGeometry(new THREE.PlaneGeometry(w, h)); const l = new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: 0x1f6fff })); l.material.userData.desechable = true; l.position.set(x, y, z); this.G.add(l); }
  texTubo() { if (this._tt) return this._tt; const t = canvasTex(64, 16, (g, w, h) => { g.fillStyle = '#7c848b'; g.fillRect(0, 0, w, h); g.fillStyle = '#5c646b'; for (let x = 0; x < w; x += 16) g.fillRect(x, 0, 6, h); }); t.wrapS = t.wrapT = THREE.RepeatWrapping; return (this._tt = t); }
  texCable(color, sec, L) { // rotulado del aislamiento repetido cada ~9 cm (texturas compartidas por color, sección y largo)
    this._tc = this._tc || new Map(); const k = color + '|' + sec + '|' + Math.max(1, Math.round(L / 9));
    if (!this._tc.has(k)) { const t = aislTex(color, sec, 'K').clone(); t.wrapS = THREE.RepeatWrapping; t.repeat.set(Math.max(1, Math.round(L / 9)), 1); t.needsUpdate = true; this._tc.set(k, t); }
    return this._tc.get(k);
  }
  matCobre() { if (this._mcu) return this._mcu; const t = canvasTex(64, 64, (g, w, h) => { g.fillStyle = '#c8743c'; g.fillRect(0, 0, w, h); for (let i = 0; i < 16; i++) { g.fillStyle = i % 2 ? 'rgba(255,214,160,0.55)' : 'rgba(110,50,15,0.35)'; g.beginPath(); g.moveTo(i * 8 - 32, 0); g.lineTo(i * 8 - 28, 0); g.lineTo(i * 8 + 4, h); g.lineTo(i * 8, h); g.fill(); } }); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2, 3);
    return (this._mcu = new THREE.MeshStandardMaterial({ map: t, color: 0xffffff, metalness: 0.85, roughness: 0.32 })); } // hebras retorcidas
  texTierra() { if (this._tg) return this._tg; const t = canvasTex(64, 16, (g, w, h) => { g.fillStyle = '#3fae2a'; g.fillRect(0, 0, w, h); g.fillStyle = '#f2d21b'; for (let x = 0; x < w; x += 16) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x + 8, 0); g.lineTo(x + 16, h); g.lineTo(x + 8, h); g.fill(); } }); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(30, 1); return (this._tg = t); }
  pintarGuias() {
    const gh = this.ghost; gh.traverse((o) => { o.geometry?.dispose(); }); gh.clear(); if (this.kind !== 'tablero' || this.ro) return;
    for (const r of Object.values(REFERENCIA)) {
      if (this.m.parts.some((p) => p.type === r.type && (r.type === 'cuadro' || p.nombre === r.nombre))) continue;
      const d = medidas({ type: r.type, tam: 100 }); const g = new THREE.EdgesGeometry(new THREE.PlaneGeometry(d.w + 1, d.h + 1));
      const l = new THREE.LineSegments(g, new THREE.LineDashedMaterial({ color: 0x6b4a22, dashSize: 1, gapSize: 0.8 })); l.computeLineDistances(); l.position.set(r.x, r.y, 0.15); gh.add(l);
      this.labels.push({ txt: r.nombre + ' (aquí)', v: new THREE.Vector3(r.x, r.y, 0.5), cls: 'guia' });
    }
    for (const [a, b] of TUBOS_REF) {
      const pa = this.m.parts.find((p) => (a === 'Q' ? p.type === 'cuadro' : p.nombre === REFERENCIA[a].nombre)), pb = this.m.parts.find((p) => (b === 'Q' ? p.type === 'cuadro' : p.nombre === REFERENCIA[b].nombre));
      if (!pa || !pb || tuboEntre(this.m, pa.id, pb.id)) continue;
      const pts = rutaTubo(this.m, pa.id, pb.id).map((q) => new THREE.Vector3(q.x, q.y, 0.2)); if (pts.length < 2) continue;
      const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineDashedMaterial({ color: 0x555b60, dashSize: 1.2, gapSize: 1 })); l.computeLineDistances(); gh.add(l);
    }
  }
  ponerEtiquetas() {
    const box = this.$('#vvLabels'); const C = this.cur(); if (!box || !C.camera) return;
    const w = this.renderer.domElement.clientWidth, h = this.renderer.domElement.clientHeight;
    const L = C === this.taller ? this.taller.etiquetas() : C === this.montaje ? this.montaje.etiquetas() : C.labels || [];
    const html = L.map((l) => { const v = l.v.clone().project(C.camera); if (v.z > 1 || !Number.isFinite(v.x)) return ''; return `<div class="vv-lb ${l.cls || ''}" style="left:${((v.x + 1) / 2) * w}px;top:${((1 - v.y) / 2) * h}px">${esc(l.txt)}</div>`; }).join('');
    if (html !== this._lbHTML) { box.innerHTML = html; this._lbHTML = html; }
  }

  // ------------------------------------------------------------------ ratón
  punto(e) {
    const r = this.renderer.domElement.getBoundingClientRect(); this.ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    this.ray.setFromCamera(this.ndc, this.camera); const v = new THREE.Vector3(); return this.ray.ray.intersectPlane(this.plano, v) ? { x: v.x, y: v.y } : null;
  }
  // el borne más cercano en pantalla (cada borne está a su altura)
  borneEn(q, e) {
    let best = null, bd;
    if (e && this.renderer) { bd = 12; for (const p of this.m.parts) for (const b of bornes(p)) { const ref = { p: p.id, t: b.t }; const pb = posBorne(this.m, ref); if (!pb) continue; const s = this.pantalla(pb.x, pb.y, zBorne(this.m, ref)); const d = Math.hypot(s.x - e.clientX, s.y - e.clientY); if (d < bd) { bd = d; best = ref; } } return best; }
    bd = 1.5; for (const p of this.m.parts) for (const b of bornes(p)) { const pb = posBorne(this.m, { p: p.id, t: b.t }); if (!pb) continue; const d = Math.hypot(pb.x - q.x, pb.y - q.y); if (d < bd) { bd = d; best = { p: p.id, t: b.t }; } }
    return best;
  }
  parteEn(q, e) {
    const L = this.m.parts.filter((p) => TIPOS[p.type].modulo).concat(this.m.parts.filter((p) => !TIPOS[p.type].modulo && p.type !== 'manguera'));
    if (e && this.renderer) { // en pantalla: cada pieza proyectada a la altura de su cara frontal (evita el error de paralaje en los módulos DIN)
      let best = null, ba = Infinity;
      for (const p of L) { const c = posParte(this.m, p); if (!c) continue; const d = medidas(p); const z = TIPOS[p.type].modulo ? ZMOD + 1 : 2.5;
        const a = this.pantalla(c.x - d.w / 2, c.y + d.h / 2, z), b = this.pantalla(c.x + d.w / 2, c.y - d.h / 2, z);
        const x0 = Math.min(a.x, b.x), x1 = Math.max(a.x, b.x), y0 = Math.min(a.y, b.y), y1 = Math.max(a.y, b.y);
        if (e.clientX >= x0 && e.clientX <= x1 && e.clientY >= y0 && e.clientY <= y1) { const ar = (x1 - x0) * (y1 - y0); if (ar < ba) { ba = ar; best = p; } } }
      if (best) return best;
    }
    for (const p of L) { const c = posParte(this.m, p); if (!c) continue; const d = medidas(p); if (Math.abs(q.x - c.x) <= d.w / 2 && Math.abs(q.y - c.y) <= d.h / 2) return p; }
    const mg = this.m.parts.find((p) => p.type === 'manguera'); if (mg && q.x < 2 && q.y < -8) return mg;
    return null;
  }
  distPoli(q, pts) { let d = Infinity; for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i]; const dx = b.x - a.x, dy = b.y - a.y; const L = dx * dx + dy * dy || 1; const t = Math.max(0, Math.min(1, ((q.x - a.x) * dx + (q.y - a.y) * dy) / L)); d = Math.min(d, Math.hypot(a.x + t * dx - q.x, a.y + t * dy - q.y)); } return d; }
  sEnPoli(q, pts) { let best = 0, bd = Infinity, acc = 0; for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i]; const dx = b.x - a.x, dy = b.y - a.y; const L2 = dx * dx + dy * dy || 1; const t = Math.max(0, Math.min(1, ((q.x - a.x) * dx + (q.y - a.y) * dy) / L2)); const d = Math.hypot(a.x + t * dx - q.x, a.y + t * dy - q.y); if (d < bd) { bd = d; best = acc + t * Math.sqrt(L2); } acc += Math.sqrt(L2); } return best; }
  cableEn(q) { let best = null, bd = 0.9; for (const c of this.m.cables) { const d = this.distPoli(q, rutaCable(this.m, c).pts); if (d < bd) { bd = d; best = c; } } return best; }
  tuboEn(q) { let best = null, bd = 1.6; for (const t of this.m.tubos) { const d = this.distPoli(q, rutaTubo(this.m, t.a, t.b)); if (d < bd) { bd = d; best = t; } } return best; }
  onDown(e) {
    if (e.button !== 0 || !this.modo || this.visor?.abierto) return;
    const coger = () => { e.stopPropagation(); e.preventDefault(); };
    if (this.vistaActiva === 'taller') { if (this.taller.scene && this.taller.onDown(e, this.renderer.domElement)) coger(); return; }
    if (this.vistaActiva === 'casa') { if (this.casa.scene && this.casa.onDown(e, this.renderer.domElement)) coger(); return; }
    if (this.vistaActiva === 'montaje') return;
    const q = this.punto(e); if (!q) return;
    if (this.ro) { const p = this.parteEn(q); if (p && this.red) { coger(); this.accionar(p); } else if (p) { coger(); this.sel = { k: 'parte', id: p.id }; this.construir(); this.lado(); } return; }
    if (this.colocar) { coger(); this.poner(this.colocar, q); return; }
    const b = this.tool === 'tubo' ? null : this.borneEn(q, e);
    if (this.tool !== 'mover' && this.tool !== 'tubo') { if (this.usarHerramienta(this.tool, q, b)) coger(); return; }
    if (b && !this.red) { coger(); if (this.cableIni && !(this.cableIni.p === b.p && this.cableIni.t === b.t)) { this.nuevoCable(this.cableIni, b); this.cableIni = null; } else { this.cableIni = b; this.arrCable = true; } this.construir(); this.estado(); return; }
    const p = this.parteEn(q, e);
    if (this.tool === 'tubo' && p && !this.red) { coger(); const g = grupo(this.m, p); if (!this.tuboIni) { this.tuboIni = g; this.toast('Tubo: ahora pulsa la pieza de destino.'); } else if (g !== this.tuboIni) { this.nuevoTubo(this.tuboIni, g); this.tuboIni = null; } this.estado(); return; }
    if (p) {
      coger();
      if (this.red && (['interruptor', 'conmutador', 'pulsador', 'cruzamiento'].includes(p.type) || TIPOS[p.type].modulo)) { this.accionar(p); return; }
      this.sel = { k: 'parte', id: p.id };
      if (!this.red && !TIPOS[p.type].modulo && p.type !== 'manguera') this.arr = { id: p.id, dx: q.x - p.x, dy: q.y - p.y, movido: false };
      this.construir(); this.lado(); return;
    }
    const c = this.cableEn(q); if (c) { coger(); this.sel = { k: 'cable', id: c.id }; this.construir(); this.lado(); return; }
    const t = this.tuboEn(q); if (t) { coger(); this.sel = { k: 'tubo', id: t.id }; this.construir(); this.lado(); return; }
    if (this.cableIni || this.tuboIni) { this.cableIni = null; this.tuboIni = null; this.construir(); this.estado(); }
    if (this.sel) { this.sel = null; this.construir(); this.lado(); }
  }
  onMove(e) {
    if (!this.modo || !this.renderer) return;
    if (this.vistaActiva === 'casa') { if (this.casa.scene) this.casa.onMove(e, this.renderer.domElement); return; }
    if (this.vistaActiva !== 'tablero') return;
    const q = this.punto(e); if (!q) return; const D = dims(this.m);
    if (this.arr) {
      const p = partePorId(this.m, this.arr.id); if (!p) return;
      if (!this.arr.movido) { this.guardarUndo(); this.arr.movido = true; if (p.fijado && this.realista) { p.fijado = false; this.toast('Has movido una pieza que estaba fijada: vuelve a atornillarla (🔩).'); } }
      p.x = Math.round(Math.max(3, Math.min(D.w - 3, q.x - this.arr.dx)) * 2) / 2; p.y = Math.round(Math.max(3, Math.min(D.h - 3, q.y - this.arr.dy)) * 2) / 2;
      this.imantar(p); if (!this._raf) this._raf = requestAnimationFrame(() => { this._raf = null; this.construir(); }); return;
    }
    const b = this.borneEn(q, e); const k = b ? b.p + ':' + b.t : '';
    if (k !== this._hov) { this._hov = k; this.hover = b; this.construir(); this.estado(b ? this.textoBorne(b) : null); }
    if (this.cableIni) { this.tmp.clear(); const a = posBorne(this.m, this.cableIni); if (a) { const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(a.x, a.y, zBorne(this.m, this.cableIni) + 0.5), new THREE.Vector3(q.x, q.y, ZT + 0.5)]), new THREE.LineBasicMaterial({ color: new THREE.Color(COLORES[this.color].hex) })); this.tmp.add(l); } }
    else if (this.tmp.children.length) this.tmp.clear();
  }
  textoBorne(b) {
    const kind = tipoBorne(this.m, b); const B = BORNES[kind];
    const extra = this.tool === 'pelacables' && B ? ` · pelar ${B.pel[0]}–${B.pel[1]} mm` : this.tool === 'destornillador' && B ? ` · ${B.puntas ? 'punta ' + B.puntas.map((x) => PUNTAS[x].n).join(' o ') : 'sin tornillo'}` : this.cableIni ? ' · pulsa para unir el cable' : this.tool === 'mover' ? ' · pulsa para empezar un cable' : '';
    return `Borne: <b>${esc(nombreBorne(this.m, b))}</b>${B ? ` <span class="vv-small">(${esc(B.n.toLowerCase())})</span>` : ''}${esc(extra)}`;
  }
  onUp(e) {
    if (this.vistaActiva === 'casa') { this.casa.onUp(e); return; }
    if (this.arr) { const mov = this.arr.movido; this.arr = null; if (mov) this.cambio(); return; }
    if (this.arrCable && this.cableIni && this.renderer && e.target === this.renderer.domElement) {
      this.arrCable = false; const q = this.punto(e); const b = q && this.borneEn(q, e);
      if (b && !(b.p === this.cableIni.p && b.t === this.cableIni.t)) { this.nuevoCable(this.cableIni, b); this.cableIni = null; this.tmp.clear(); this.construir(); }
    }
    this.arrCable = false;
  }
  imantar(p) {
    if (this.kind !== 'tablero') return;
    for (const r of Object.values(REFERENCIA)) {
      if (r.type !== p.type || Math.hypot(r.x - p.x, r.y - p.y) > 5) continue;
      if (r.type !== 'cuadro' && r.nombre !== p.nombre && this.m.parts.some((q) => q !== p && q.nombre === r.nombre)) continue;
      p.x = r.x; p.y = r.y; if (r.type !== 'cuadro' && p.nombre !== r.nombre) { const otro = this.m.parts.find((q) => q !== p && q.nombre === r.nombre); if (!otro) p.nombre = r.nombre; } return;
    }
  }

  // ------------------------------------------------------------------ herramientas sobre el tablero
  cablesEn(ref) { const L = []; for (const c of this.m.cables) for (const lado of ['a', 'b']) if (c[lado].p === ref.p && c[lado].t === ref.t) L.push([c, lado]); return L; }
  usarHerramienta(id, q, b) {
    const m = this.m;
    if (id === 'multimetro' || id === 'buscapolos') {
      if (!b) { this.toast('Toca un borne (punto dorado) con la punta de prueba.'); return true; }
      if (id === 'buscapolos') { const r = buscapolos(m, { enchufada: this.red }, b); this.animHerr('buscapolos', posBorne(m, b), zBorne(m, b));
        this.toast(!this.red ? '🔦 Sin tensión: el buscapolos no se enciende (enchufa la manguera para buscar la fase).' : r.luz ? `🔦 <b>Se enciende</b>: ${esc(nombreBorne(m, b))} es una <b>fase</b> (≈${Math.round(r.v)} V).` : `🔦 No se enciende: ${esc(nombreBorne(m, b))} no es una fase (neutro, tierra o sin tensión). Confírmalo siempre con el multímetro.`, 5000); return true; }
      const M2 = this.multi; if (!M2.a || M2.b) { M2.a = b; M2.b = null; M2.txt = '· · ·'; } else { M2.b = b; this.leerMulti(); }
      this.pintarMulti(); this.construir(); return true;
    }
    if (!this.realista && NECESITA_REALISTA.has(id)) { this.toast('Activa «Montaje realista» en la paleta para usar esta herramienta (si no, se hace solo).'); return true; }
    if (this.red && id !== 'flexometro') { this.toast('⚠ Desenchufa la manguera antes de trabajar en la instalación.'); return true; }
    if (id === 'flexometro' || id === 'cortatubos' || id === 'grapa') {
      const t = this.tuboEn(q); if (!t) { this.toast('Pulsa sobre un tubo.'); return true; }
      this.guardarUndo(); const T = tramoTubo(m, t); const L = largoTubo(m, t);
      if (id === 'flexometro') { t.med = true; this.toast(`📏 Tramo de borde a borde de las cajas: <b>${num(L)} cm</b> (+1 cm que entra en cada caja). Márcalo y córtalo.`); this.animHerr('flexometro', puntoEnRuta(T.pts, T.ini), 2); }
      else if (id === 'cortatubos') { t.cort = t.med ? 'ok' : 'corto'; this.toast(t.med ? `✂ Corte recto a ${num(L)} cm.` : '✂ Has cortado sin medir: el tramo queda corto y no entra en la caja. Mide primero con el flexómetro y vuelve a cortar.', 4500); this.animHerr('cortatubos', puntoEnRuta(T.pts, T.ini + L * 0.5), 2); }
      else { const s = Math.round(Math.max(0, Math.min(L, this.sEnPoli(q, T.pts) - T.ini))); t.grapas = [...(t.grapas || []).filter((x) => Math.abs(x - s) > 3), s].sort((a, c) => a - c); const h = huecoGrapas(m, t); this.toast(`📎 Grapa a ${s} cm · hueco mayor sin grapa: ${num(h)} cm ${h > GRAPA_MAX ? '(máximo 50 cm)' : '✔'}`); }
      this.sel = { k: 'tubo', id: t.id }; this.cambio(); return true;
    }
    if (id === 'taladro' && !b) {
      const p = this.parteEn(q); if (!p) return false; if (TIPOS[p.type].modulo || p.type === 'manguera') { this.toast('La aparamenta va a presión en el carril DIN: no se atornilla.'); return true; }
      this.guardarUndo(); p.fijado = true; this.animHerr('taladro', posParte(m, p), 4, { escala: 0.45 }); this.toast(`🔩 ${esc(p.nombre)} atornillada al tablero (broca de madera y punta PH2, con gafas).`); this.cambio(); return true;
    }
    if (!b) { this.toast('Pulsa un borne (punto dorado).'); return true; }
    const L = this.cablesEn(b); if (!L.length) { this.toast('No hay ningún cable en ese borne.'); return true; }
    const kind = tipoBorne(m, b); const B = BORNES[kind] || BORNES.mecanismo; const pb = posBorne(m, b); const z = zBorne(m, b);
    const poner = (f) => L.forEach(([c, lado]) => { const k = lado === 'a' ? 'ea' : 'eb'; c[k] = { ...extremo(c, lado), ...f }; });
    this.guardarUndo();
    if (id === 'pelacables') { const mm = this.pelar === 'auto' ? idealPelado(m, b) : +this.pelar; poner({ pel: mm });
      const okL = mm >= B.pel[0] && mm <= B.pel[1]; this.toast(`🧤 Pelado ${mm} mm (${L.length} cable${L.length > 1 ? 's' : ''}) · ${esc(B.n)}: ${B.pel[0]}–${B.pel[1]} mm ${okL ? '✔' : mm < B.pel[0] ? '✖ corto: el aislante quedará dentro' : '✖ largo: quedará cobre a la vista'}`, 4500); this.animHerr('pelacables', pb, z); }
    else if (id === 'destornillador') {
      if (!B.puntas) { poner({ apr: true }); this.toast(`Este borne (${esc(B.n.toLowerCase())}) no lleva tornillo: ${kind === 'palanca' ? 'sube la palanca, mete el cable hasta el fondo y bájala' : 'empuja el cable rígido hasta el fondo'}. Tira suavemente para comprobar.`, 5000); }
      else if (!B.puntas.includes(this.punta)) { this.undoS.pop(); this.animHerr('destornillador', pb, z, { mal: true }); this.toast(`❌ La punta ${esc(PUNTAS[this.punta].n)} no es la de este borne: usa ${B.puntas.map((x) => esc(PUNTAS[x].n)).join(' o ')}. Con la punta equivocada se estropea la cabeza del tornillo.`, 5000); return true; }
      else { poner({ apr: true }); this.toast(`🪛 Apretado con ${esc(PUNTAS[this.punta].n)} (${esc(B.par || '')}). Tira del cable para comprobar que no se sale.`); this.animHerr('destornillador', pb, z); }
    } else if (id === 'taladro') {
      if (!B.puntas) { this.undoS.pop(); this.toast('Este borne no tiene tornillo.'); return true; }
      poner({ apr: 'pasado' }); this.toast('⚠ Con el taladro se pasa el par: el borne o el cable quedan dañados. Los bornes se aprietan a mano con el destornillador.', 5000); this.animHerr('taladro', pb, z, { escala: 0.45 });
    }
    this.cambio(); return true;
  }
  leerMulti() {
    const M2 = this.multi; const r = medir(this.m, { enchufada: this.red, test: false, tocar: false }, M2.a, M2.b, M2.modo === 'ohm' ? 'ohm' : 'V');
    if (M2.modo === 'V') M2.txt = `${num(Math.round((r.v || 0) * 10) / 10)} V~`;
    else if (r.error) { M2.txt = '⚠ CON TENSIÓN'; this.toast('⚠ No midas continuidad con tensión: desenchufa la manguera primero.'); }
    else M2.txt = r.r === Infinity ? 'OL (abierto)' : r.r < 1 ? `${num(Math.round(r.r * 100) / 100)} Ω · pita 🔊` : `${num(Math.round(r.r * 10) / 10)} Ω`;
  }
  pintarMulti() {
    const el = this.$('#vvMulti'); if (!el) return; const on = this.vistaActiva === 'tablero' && this.tool === 'multimetro' && !!this.modo; el.hidden = !on; if (!on) return; const M2 = this.multi;
    const n = (r) => (!r ? '—' : r === 'TIERRA' ? 'Tierra (barra PE)' : nombreBorne(this.m, r));
    el.innerHTML = `<div class="vv-lcd" id="vvLCD">${esc(M2.txt)}</div><div class="vv-mm"><button data-multi="V" class="${M2.modo === 'V' ? 'on' : ''}">V~</button><button data-multi="ohm" class="${M2.modo === 'ohm' ? 'on' : ''}">Ω / 🔊</button><button data-multi="tierra" title="Usar la tierra como segunda punta">⏚</button></div>
      <div class="vv-small"><span class="r">●</span> ${esc(n(M2.a))}<br><span class="k">●</span> ${esc(n(M2.b))}</div><div class="vv-small">${M2.modo === 'V' ? 'Con la manguera enchufada.' : 'Sin tensión: desenchufa la manguera.'}</div>`;
  }

  // ------------------------------------------------------------------ edición
  guardarUndo() { this.undoS.push(JSON.stringify(this.m)); if (this.undoS.length > 60) this.undoS.shift(); this.redoS = []; }
  cambio(guardar = true) {
    if (this.vistaActiva === 'tablero') {
      if (guardar && this.modo && !this.ro) store.set(this.kind === 'averia' ? 'av:' + this.averia.id : this.kind === 'proymontar' ? 'proy:' + this.proy.n : this.modo, this.m);
      if (this.kind === 'proymontar') this.pchk = null;
      this.chk = null; if (this.red) this.simular(); else this.res = null;
    }
    this.construir(); this.lado(); this.paleta(); this.estado(); this.barra(); this.pintarMulti();
    const u = this.$('#vvUndo'); if (u) u.disabled = this.vistaActiva === 'casa' ? !this.casa.undoS.length || this.ro : !this.undoS.length || this.ro || this.vistaActiva === 'taller' || this.vistaActiva === 'montaje';
    const rd = this.$('#vvRedo'); if (rd) rd.disabled = this.vistaActiva !== 'tablero' || !this.redoS.length || this.ro;
    const rb = this.$('#vvRed'); if (rb) { rb.hidden = this.vistaActiva === 'taller' || this.vistaActiva === 'montaje'; const on = this.vistaActiva === 'casa' ? this.casa.red : this.red; rb.textContent = this.vistaActiva === 'casa' ? (on ? '⏻ Quitar la luz' : '⚡ Dar la luz') : on ? '⏻ Desenchufar' : '⚡ Enchufar la manguera'; rb.classList.toggle('on', !!on); }
  }
  poner(type, q) {
    const T = TIPOS[type]; const m = this.m; const D = dims(m);
    if (T.unico && m.parts.some((p) => p.type === type)) { this.toast(`Ya hay un ${T.corto} en el tablero.`); this.colocar = null; this.paleta(); return; }
    this.guardarUndo();
    const p = { id: nuevoId(m, type), type, nombre: siguienteNombre(m, type) };
    if (T.modulo || type === 'manguera') {
      const cu = m.parts.find((x) => x.type === 'cuadro'); if (!cu) { this.undoS.pop(); this.toast('Primero coloca el cuadro.'); return; }
      p.cuadro = cu.id; if (T.modulo) { const s = slotLibre(m, cu.id, type); if (s == null) { this.undoS.pop(); this.toast('El carril del cuadro está lleno.'); return; } p.slot = s; p.on = true; }
      if (type === 'mt') { p.In = this.inNuevo; p.curva = this.curvaNueva; p.circ = this.circNuevo; p.nombre = `${p.circ} ${p.In} A`; }
      if (type === 'iga') p.In = 25; if (type === 'id') p.In = 40;
    } else { p.x = Math.round(Math.max(4, Math.min(D.w - 4, q.x)) * 2) / 2; p.y = Math.round(Math.max(4, Math.min(D.h - 4, q.y)) * 2) / 2; this.imantar(p); if (!this.realista) p.fijado = true; }
    if (type === 'interruptor' || type === 'pulsador') p.on = false; if (type === 'conmutador' || type === 'cruzamiento') p.pos = 0; if (type === 'enchufe' || type === 'enchufe2') p.carga = 'nada'; if (type === 'minutero') { p.on = false; p.seg = 20; }
    if (type === 'caja') { p.tam = this.tamCaja; p.fichas = {}; }
    m.parts.push(p); this.sel = { k: 'parte', id: p.id };
    if (!['bombilla', 'interruptor', 'caja', 'enchufe', 'enchufe2', 'conmutador', 'cruzamiento', 'pulsador', 'minutero'].includes(type)) this.colocar = null;
    this.cambio();
  }
  nuevoCable(a, b) {
    const m = this.m;
    if (m.cables.some((c) => (c.a.p === a.p && c.a.t === a.t && c.b.p === b.p && c.b.t === b.t) || (c.a.p === b.p && c.a.t === b.t && c.b.p === a.p && c.b.t === a.t))) return this.toast('Ese cable ya existe.');
    this.guardarUndo();
    const c = { id: 'w' + (Math.max(0, ...m.cables.map((x) => +x.id.slice(1) || 0)) + 1), a: { ...a }, b: { ...b }, color: this.color, sec: this.sec };
    if (this.realista) { c.ea = { pel: 0, apr: false }; c.eb = { pel: 0, apr: false }; } else prepararExtremos(m, c);
    m.cables.push(c);
    const rc = rutaCable(m, c); const avisos = [];
    if (!rc.enTubo) avisos.push('⚠ Este cable no va por ningún tubo: tira un tubo entre esas dos piezas.');
    for (const r of [a, b]) { const p = partePorId(m, r.p); if (p?.type === 'caja' && !p.fichas?.[r.t]) avisos.push(`⚠ En ${esc(p.nombre)} no hay ficha en la posición ${r.t.slice(1)}: elige una en el inspector de la caja.`); }
    if (avisos.length) this.toast(avisos.join('<br>'), 4500); else if (this.realista) this.toast('Cable tirado. Ahora pela las puntas (🧤) y apriétalas (🪛) en cada borne.');
    this.cambio();
  }
  nuevoTubo(a, b) {
    if (tuboEntre(this.m, a, b)) return this.toast('Ya hay un tubo entre esas piezas.'); this.guardarUndo();
    const t = { id: 't' + (Math.max(0, ...this.m.tubos.map((x) => +x.id.slice(1) || 0)) + 1), a, b, d: this.dTubo, med: false, cort: false, grapas: [] };
    if (!this.realista) { t.med = true; t.cort = 'ok'; grapasAuto(this.m, t); }
    this.m.tubos.push(t); if (this.realista) this.toast(`Tubo Ø${t.d} tirado: mídelo (📏), córtalo (✂) y sujétalo con grapas (📎).`); this.cambio();
  }
  borrarSel() {
    if (this.vistaActiva === 'casa') { this.casa.borrarSel(); return; }
    const s = this.sel; if (!s || this.ro) return; this.guardarUndo(); const m = this.m;
    if (s.k === 'cable') m.cables = m.cables.filter((c) => c.id !== s.id);
    if (s.k === 'tubo') m.tubos = m.tubos.filter((t) => t.id !== s.id);
    if (s.k === 'parte' && this.kind === 'proymontar') { this.undoS.pop(); this.toast('En los proyectos las piezas ya están colocadas: solo se borran cables.'); return; }
    if (s.k === 'parte') {
      const ids = new Set([s.id, ...m.parts.filter((p) => p.cuadro === s.id).map((p) => p.id)]);
      m.parts = m.parts.filter((p) => !ids.has(p.id)); m.cables = m.cables.filter((c) => !ids.has(c.a.p) && !ids.has(c.b.p)); m.tubos = m.tubos.filter((t) => !ids.has(t.a) && !ids.has(t.b));
    }
    this.sel = null; this.cambio();
  }
  accionar(p) {
    if (p.type === 'interruptor') p.on = !p.on;
    else if (p.type === 'pulsador') { p.on = true; this.cambio(!this.ro); setTimeout(() => { p.on = false; this.cambio(!this.ro); }, 900); return; }
    else if (p.type === 'conmutador' || p.type === 'cruzamiento') p.pos = p.pos ? 0 : 1;
    else if (TIPOS[p.type].modulo) { const ab = this.res?.abiertos?.includes(p.id); p.on = ab ? true : !p.on; if (ab) this.test = false; }
    this.cambio(!this.ro);
  }
  simular() {
    this.res = simular(this.m, { enchufada: this.red, test: this.test, tocar: this.tocar }); for (const id of this.res.abiertos) { const p = partePorId(this.m, id); if (p) p.on = false; } this.test = false;
    // minutero de escalera: un pulsador da tensión al borne 3 → enciende la salida durante p.seg segundos
    for (const mn of this.res.minuteros || []) { const p = partePorId(this.m, mn.id); if (!p) continue;
      if (this.red && mn.v3 > 100 && !p.on) { p.on = true; clearTimeout(p._t); const seg = p.seg || 20; p._t = setTimeout(() => { p.on = false; if (this.red) this.simular(); this.construir(); this.lado(); }, seg * 1000); this.res = simular(this.m, { enchufada: this.red, test: false, tocar: this.tocar }); this.toast(`⏱ Minutero: luz encendida ${seg} s`); }
      if (!this.red && p.on) { p.on = false; clearTimeout(p._t); } }
  }

  // ------------------------------------------------------------------ paneles
  barra() {
    const el = this.$('#vvBarra'); if (!el) return;
    if (this.vistaActiva === 'montaje' && this.montaje.scene && !this.ro) { el.hidden = false; el.classList.add('vm'); el.innerHTML = this.montaje.cintoHTML(); return; } el.classList.remove('vm');
    const on = this.vistaActiva === 'tablero' && !this.ro && !!this.modo; el.hidden = !on; if (!on) { el.innerHTML = ''; return; }
    el.innerHTML = BARRA.map(([id, ic, n, t]) => `<button data-tool="${id}" class="${this.tool === id && !this.colocar ? 'on' : ''}${!this.realista && NECESITA_REALISTA.has(id) ? ' off' : ''}" title="${esc(t)}"><span>${ic}</span>${esc(n)}</button>`).join('')
      + (this.tool === 'destornillador' ? `<label class="vv-opt">Punta <select data-punta-sel>${Object.entries(PUNTAS).map(([k, p]) => `<option value="${k}" ${this.punta === k ? 'selected' : ''}>${esc(p.n)}</option>`).join('')}</select></label>` : '')
      + (this.tool === 'pelacables' ? `<label class="vv-opt">Pelar <select data-pelar>${['auto', ...LARGOS_PELADO].map((x) => `<option value="${x}" ${String(this.pelar) === String(x) ? 'selected' : ''}>${x === 'auto' ? 'tope automático' : x + ' mm'}</option>`).join('')}</select></label>` : '');
  }
  paleta() {
    const P = this.$('#vvPal'); if (!P) return;
    if (this.vistaActiva === 'taller') { P.innerHTML = this.taller.paletaHTML(); return; }
    if (this.vistaActiva === 'montaje') { P.innerHTML = this.montaje.paletaHTML(); return; }
    if (this.vistaActiva === 'casa') { P.innerHTML = this.casa.paletaHTML(); return; }
    if (this.kind === 'proyecto') { P.innerHTML = ''; return; }
    if (this.ro) { P.innerHTML = '<p class="vv-small">Revisión: solo lectura. Pulsa una pieza y abre «🔍 Ver en 3D».</p>'; return; }
    if (this.kind === 'proymontar') { P.innerHTML = `<div class="vv-cab"><b>Cable</b> <span class="vv-small">(pulsa un borne y luego otro)</span>
      <div class="vv-cols">${Object.entries(COLORES).map(([k, c]) => `<button data-color="${k}" class="${this.color === k ? 'on' : ''}" title="${c.n} · ${c.clase}" style="--c:${c.hex}${c.raya ? `;--r:${c.raya}` : ''}"><span></span>${c.n}<i>${esc(c.clase)}</i></button>`).join('')}</div>
      <div class="vv-secs">${SECCIONES.map((s) => `<button data-sec="${s}" class="${this.sec === s ? 'on' : ''}" title="Hasta ${PROTEGE[s]} A">${fmtSec(s)}</button>`).join('')}</div></div>
      <p class="vv-small">Alumbrado (C1): <b>1,5 mm²</b>. Enchufes (C2) y cuadro: <b>2,5 mm²</b>.</p>
      <h4>Montaje</h4><label class="vv-chk"><input type="checkbox" data-realista ${this.realista ? 'checked' : ''}> Montaje realista: pelar y apretar cada borne con la punta correcta</label>
      <p class="vv-small">Pulsa una pieza y luego «🔍 Ver en 3D» para ver sus bornes por detrás. <kbd>Supr</kbd> borra el cable seleccionado.</p>`; return; }
    const cats = [...new Set(PALETA.map((t) => TIPOS[t].cat))]; const D = dims(this.m);
    P.innerHTML = `<div class="vv-cab"><b>Cable</b> <span class="vv-small">(pulsa un borne y luego otro)</span>
      <div class="vv-cols">${Object.entries(COLORES).map(([k, c]) => `<button data-color="${k}" class="${this.color === k ? 'on' : ''}" title="${c.n} · ${c.clase}" style="--c:${c.hex}${c.raya ? `;--r:${c.raya}` : ''}"><span></span>${c.n}<i>${esc(c.clase)}</i></button>`).join('')}</div>
      <div class="vv-secs">${SECCIONES.map((s) => `<button data-sec="${s}" class="${this.sec === s ? 'on' : ''}" title="Hasta ${PROTEGE[s]} A">${fmtSec(s)}</button>`).join('')}</div></div>
      <label class="vv-f">Tubo nuevo<select data-dtubo>${TUBOS.map((d) => `<option value="${d}" ${d === this.dTubo ? 'selected' : ''}>Ø${d} mm</option>`).join('')}</select></label>
      ${cats.map((c) => `<h4>${esc(c)}</h4><div class="vv-items">${PALETA.filter((t) => TIPOS[t].cat === c).map((t) => { const T = TIPOS[t]; const hay = T.unico && this.m.parts.some((p) => p.type === t); return `<button data-add="${t}" class="${this.colocar === t ? 'on' : ''}" ${hay ? 'disabled' : ''} title="${esc(T.desc)}"><span>${T.icon}</span>${esc(T.corto)}${T.opcional ? ' <i>(opcional)</i>' : ''}</button>`; }).join('')}</div>`).join('')}
      <div class="vv-nuevo"><span class="vv-small">Magnetotérmico nuevo</span><select data-nin aria-label="Calibre">${CALIBRES.map((a) => `<option value="${a}" ${a === this.inNuevo ? 'selected' : ''}>${a} A</option>`).join('')}</select><select data-ncurva aria-label="Curva">${['B', 'C'].map((k) => `<option ${k === this.curvaNueva ? 'selected' : ''}>${k}</option>`).join('')}</select><select data-ncirc aria-label="Circuito">${Object.keys(CIRCUITOS).map((k) => `<option ${k === this.circNuevo ? 'selected' : ''}>${k}</option>`).join('')}</select></div>
      <div class="vv-nuevo"><span class="vv-small">Caja nueva</span><select data-ntam aria-label="Tamaño de caja">${Object.keys(CAJAS).map((k) => `<option value="${k}" ${+k === this.tamCaja ? 'selected' : ''}>${k}×${k} mm</option>`).join('')}</select></div>
      <h4>Montaje</h4><label class="vv-chk"><input type="checkbox" data-realista ${this.realista ? 'checked' : ''}> Montaje realista: medir, cortar y grapar el tubo, fijar las cajas, pelar y apretar con la punta correcta</label>
      ${this.kind === 'libre' ? `<label class="vv-f">Tablero<select data-tamtab>${TAMANOS_TABLERO.map(([w, h]) => `<option value="${w}x${h}" ${D.w === w && D.h === h ? 'selected' : ''}>${w} × ${h} cm</option>`).join('')}</select></label>` : ''}
      <label class="vv-chk"><input type="checkbox" data-rejilla ${this.rejilla ? 'checked' : ''}> Rejilla cada 10 cm</label>
      <p class="vv-small">Arrastra el fondo para mover la vista · rueda = zoom · botón derecho = girar. <kbd>Supr</kbd> borra lo seleccionado, <kbd>Esc</kbd> cancela.</p>`;
  }
  lado() {
    const S = this.$('#vvSide'); if (!S || !this.modo) return;
    if ((this.kind === 'proyecto' || this.kind === 'proymontar') && this.proy) { this.proyLado(); return; }
    if (this.vistaActiva === 'taller') { S.innerHTML = this.taller.ladoHTML(); return; }
    if (this.vistaActiva === 'montaje') { S.innerHTML = (this.ro ? `<section class="vv-insp">${this.revisionHTML()}</section>` : '') + this.montaje.ladoHTML() + (!this.ro && portal()?.rol === 'alumno' ? this.entregaHTML() : ''); return; }
    if (this.vistaActiva === 'casa') { const C = this.casa; const tabs = C.tabs(); if (!tabs.some(([k]) => k === C.tab)) C.tab = tabs[0][0];
      S.innerHTML = C.inspectorHTML() + C.simHTML() + `<nav class="vv-tabs">${tabs.map(([k, n]) => `<button data-tab="${k}" class="${C.tab === k ? 'on' : ''}">${n}</button>`).join('')}</nav><div class="vv-tab">${C.tabHTML(C.tab)}</div>`; return; }
    const tabs = (this.ro ? [['rev', 'Revisión']] : this.kind === 'tablero' ? [['guia', 'Guía']] : this.kind === 'averia' ? [['averia', 'Avería']] : []).concat([['comprobar', 'Comprobar'], ['materiales', 'Materiales'], ['ficha', 'Ficha técnica']]);
    if (!tabs.some(([k]) => k === this.tab)) this.tab = tabs[0][0];
    S.innerHTML = this.inspectorHTML() + this.simHTML() + `<nav class="vv-tabs">${tabs.map(([k, n]) => `<button data-tab="${k}" class="${this.tab === k ? 'on' : ''}">${n}</button>`).join('')}</nav><div class="vv-tab">${this.tabHTML()}</div>`;
  }
  puntaHTML(c, lado) {
    const o = (this._puntas || puntas(this.m)).get(c.id); const s = o?.[lado] || 'ok'; const e = extremo(c, lado); const B = BORNES[tipoBorne(this.m, c[lado])];
    return `<li class="${s === 'ok' ? 'ok' : CONDUCE.has(s) ? 'av' : 'ko'}">${s === 'ok' ? '✔' : '⚠'} ${esc(nombreBorne(this.m, c[lado]))}: pelado ${e.pel ? e.pel + ' mm' : '—'}${B ? ` (${B.pel[0]}–${B.pel[1]})` : ''} · ${B?.puntas ? (e.apr === true ? 'apretado' : e.apr === 'pasado' ? 'apretado con taladro' : 'sin apretar') : 'sin tornillo'}${s !== 'ok' ? ` — <b>${esc(TXT_PUNTA[s])}</b>` : ''}</li>`;
  }
  inspectorHTML() {
    const s = this.sel; if (!s) return ''; const m = this.m; const ro = this.ro;
    if (s.k === 'cable') { const c = m.cables.find((x) => x.id === s.id); if (!c) return ''; const i = this.res?.cables?.find((x) => x.id === c.id)?.i;
      return `<section class="vv-insp"><h4>Cable ${esc(COLORES[c.color].n.toLowerCase())} · ${fmtSec(c.sec)} <span class="vv-small">(${esc(COLORES[c.color].clase)})</span></h4><p class="vv-small">${num(Math.round(metrosCable(m, c) * 100) / 100)} m${i != null && this.red ? ` · <b>${num(Math.round(i * 100) / 100)} A</b> (admite ${PROTEGE[c.sec]} A)` : ''}</p>
        <ul class="vv-puntas-l">${this.puntaHTML(c, 'a')}${this.puntaHTML(c, 'b')}</ul>
        ${ro ? '' : `<div class="vv-fila"><select data-cab="color">${Object.entries(COLORES).map(([k, x]) => `<option value="${k}" ${k === c.color ? 'selected' : ''}>${x.n}</option>`).join('')}</select><select data-cab="sec">${SECCIONES.map((x) => `<option value="${x}" ${x === c.sec ? 'selected' : ''}>${fmtSec(x)}</option>`).join('')}</select>${this.realista ? '<button class="vv-btn small" data-v="prepCable" title="Pelar y apretar las dos puntas como indica el fabricante">✂🪛 Preparar puntas</button>' : ''}<button class="vv-btn small peligro" data-v="borrar">🗑 Borrar</button></div>`}</section>`; }
    if (s.k === 'tubo') { const t = m.tubos.find((x) => x.id === s.id); if (!t) return ''; const cab = cablesDelTubo(m, t); const min = tuboMinimo(cab.map((c) => c.sec)); const L = largoTubo(m, t); const h = huecoGrapas(m, t); const ng = (t.grapas || []).length;
      return `<section class="vv-insp"><h4>〰 Tubo corrugado Ø${t.d} mm</h4><ul class="vv-puntas-l">
        <li class="${t.med ? 'ok' : 'ko'}">${t.med ? '✔ Medido: ' + num(L) + ' cm' : '✖ Sin medir (📏 flexómetro)'}</li>
        <li class="${t.cort === 'ok' ? 'ok' : 'ko'}">${t.cort === 'ok' ? '✔ Cortado a medida' : t.cort === 'corto' ? '✖ Cortado sin medir: queda corto' : '✖ Sin cortar (✂ cortatubos)'}</li>
        <li class="${h <= GRAPA_MAX ? 'ok' : 'ko'}">${ng} grapa${ng === 1 ? '' : 's'} · hueco mayor ${num(h)} cm (máx. ${GRAPA_MAX})</li>
        <li class="${!min || t.d >= min ? 'ok' : 'ko'}">${cab.length} cable${cab.length === 1 ? '' : 's'} dentro${min ? ` · Ø mínimo ${min} mm (ITC-BT-21)` : ''}</li></ul>
        ${ro ? '' : `<div class="vv-fila"><select data-tubo-d aria-label="Diámetro">${TUBOS.map((d) => `<option value="${d}" ${d === t.d ? 'selected' : ''}>Ø${d} mm</option>`).join('')}</select>${this.realista ? '<button class="vv-btn small" data-v="grapasAuto">📎 Grapas cada 40 cm</button>' : ''}<button class="vv-btn small peligro" data-v="borrar">🗑 Borrar el tubo</button></div>`}</section>`; }
    const p = partePorId(m, s.id); if (!p) return ''; const T = TIPOS[p.type]; const dis = ro ? 'disabled' : '';
    let h = `<section class="vv-insp"><h4>${T.icon} ${esc(p.nombre)}</h4><p class="vv-small">${esc(T.desc)}</p>`;
    if (esMecanismo(p)) h += `<label class="vv-f">Montaje<select data-montaje ${dis}><option value="superficie" ${p.montaje !== 'empotrar' ? 'selected' : ''}>En superficie (caja de superficie)</option><option value="empotrar" ${p.montaje === 'empotrar' ? 'selected' : ''}>Empotrado (caja universal)</option></select></label>`;
    if (p.type === 'minutero') h += `<label class="vv-f">Tiempo encendido<select data-mseg ${dis}>${[10, 20, 30, 60].map((x) => `<option value="${x}" ${x === p.seg ? 'selected' : ''}>${x} s (simulación)</option>`).join('')}</select></label><p class="vv-small">${p.on ? '⏱ Luz encendida por el minutero.' : 'Pulsa un pulsador conectado al borne 3 con la manguera enchufada.'}</p>`;
    if (p.type === 'caja') h += `<label class="vv-f vv-chk"><input type="checkbox" data-tapa ${p.tapa ? 'checked' : ''} ${dis}> Tapa de registro puesta</label>`;
    if (esEnchufe(p)) h += `<label class="vv-f">Aparato enchufado<select data-carga ${dis}>${CARGAS.map((c) => `<option value="${c.id}" ${c.id === p.carga ? 'selected' : ''}>${esc(c.n)}</option>`).join('')}</select></label>`;
    if (esMT(p)) { const C = CIRCUITOS[circuitoDe(p)];
      h += `<div class="vv-nuevo"><label>Calibre<select data-pin ${dis}>${CALIBRES.map((a) => `<option value="${a}" ${a === amperios(p) ? 'selected' : ''}>${a} A</option>`).join('')}</select></label><label>Curva<select data-pcurva ${dis}>${['B', 'C'].map((k) => `<option ${k === curvaDe(p) ? 'selected' : ''}>${k}</option>`).join('')}</select></label><label>Circuito<select data-pcirc ${dis}>${Object.entries(CIRCUITOS).map(([k, c]) => `<option value="${k}" ${k === circuitoDe(p) ? 'selected' : ''}>${k} · ${esc(c.n)}</option>`).join('')}</select></label></div>
      ${C ? `<p class="vv-small">${esc(circuitoDe(p))} (${esc(C.n)}): el REBT pide ${C.In} A con cable de ${num(C.sec)} mm² ${amperios(p) === C.In ? '✔' : '⚠'}. Curva ${esc(CURVAS[curvaDe(p)])}.</p>` : ''}`; }
    if (p.type === 'iga' || p.type === 'id') h += `<label class="vv-f">Intensidad nominal<select data-pin ${dis}>${(p.type === 'iga' ? CALIBRES_IGA : CALIBRES_ID).map((a) => `<option value="${a}" ${a === amperios(p) ? 'selected' : ''}>${a} A${p.type === 'id' ? ' · 30 mA' : ''}</option>`).join('')}</select></label>`;
    if (T.modulo) h += `<p class="vv-small">${this.red ? 'Pulsa la palanca del módulo en el 3D para ' + (p.on ? 'bajarla' : 'rearmarlo') + '.' : 'Estado: ' + (p.on ? 'conectado' : 'desconectado')} · bornes: pelar ${BORNES.aparamenta.pel.join('–')} mm, punta PZ2, ${BORNES.aparamenta.par}.</p>`;
    if (p.type === 'caja') { const tam = tamCaja(p); const pos = posicionesCaja(tam); const P = this._puntas || puntas(m);
      const usados = (t) => m.cables.filter((c) => (c.a.p === p.id && c.a.t === t) || (c.b.p === p.id && c.b.t === t));
      h += `<label class="vv-f">Tamaño<select data-ctam ${dis}>${Object.keys(CAJAS).map((k) => `<option value="${k}" ${+k === tam ? 'selected' : ''}>${k}×${k} mm (${CAJAS[k].pos} fichas)</option>`).join('')}</select></label>
        <table class="vv-mat vv-fichas"><thead><tr><th>Pos.</th><th>Ficha</th><th>Cables</th></tr></thead><tbody>${pos.map((_, i) => { const t = 'B' + (i + 1); const f = FICHAS[p.fichas?.[t]]; const us = usados(t); const mal = us.some((c) => { const o = P.get(c.id); return (c.a.p === p.id && c.a.t === t && o?.a !== 'ok') || (c.b.p === p.id && c.b.t === t && o?.b !== 'ok'); });
          return `<tr class="${mal ? 'ko' : ''}"><td>${i + 1}</td><td><select data-ficha="${t}" ${dis} aria-label="Ficha ${i + 1}"><option value="">— vacía —</option>${Object.entries(FICHAS).map(([k, x]) => `<option value="${k}" ${p.fichas?.[t] === k ? 'selected' : ''}>${esc(x.corto)} (${x.vias} vías)</option>`).join('')}</select></td><td>${us.map((c) => `<span class="vv-dot" title="${esc(COLORES[c.color].n)} ${fmtSec(c.sec)}" style="background:${c.color === 'tierra' ? 'linear-gradient(90deg,#3fae2a 50%,#f2d21b 50%)' : COLORES[c.color].hex}"></span>`).join('')} ${us.length}/${f ? f.vias : 0}</td></tr>`; }).join('')}</tbody></table>
        <p class="vv-small">Palanca: 0,2–4 mm², 32 A. Inserción: solo cable rígido de 0,5–2,5 mm². Regleta: un cable por lado. Cada ficha une los cables de <b>un solo</b> conductor (las fases juntas, los neutros juntos…).</p>`; }
    h += `<div class="vv-fila">${['interruptor', 'conmutador', 'cruzamiento', 'pulsador', 'minutero', 'enchufe', 'enchufe2', 'bombilla', 'caja', 'cuadro', 'manguera'].includes(p.type) || T.modulo ? '<button class="vv-btn small" data-v="ver3d">🔍 Ver en 3D</button>' : ''}${!ro && !T.modulo && p.type !== 'manguera' ? `<input data-nombre value="${esc(p.nombre)}" maxlength="30" aria-label="Nombre">` : ''}${ro ? '' : '<button class="vv-btn small peligro" data-v="borrar">🗑 Borrar</button>'}</div>`;
    if (this.realista && !T.modulo && p.type !== 'manguera') h += `<p class="vv-small">${p.fijado ? '🔩 Fijada al tablero.' : '⚠ Sin fijar: atorníllala con el taladro (🔩).'}</p>`;
    return h + '</section>';
  }
  simHTML() {
    if (!this.red) return `<section class="vv-sim off"><b>Sin corriente.</b> <span class="vv-small">Pulsa «⚡ Enchufar la manguera» para probar la instalación (en el aula la enchufa solo el profesor). Antes, comprueba con el polímetro en Ω que no hay cortocircuitos.</span></section>`;
    const r = this.res || { disparos: [], avisos: [], corrientes: {}, fuga: 0 };
    const mts = this.m.parts.filter(esMT); const idp = this.m.parts.find((p) => p.type === 'id'); const iga = this.m.parts.find((p) => p.type === 'iga');
    return `<section class="vv-sim on"><div class="vv-chips">${iga ? `<span class="vv-chip ${r.abiertos?.includes(iga.id) ? 'ko' : 'ok'}">IGA ${amperios(iga)} A: ${r.abiertos?.includes(iga.id) ? 'desconectado' : 'conectado'}</span>` : ''}${mts.map((p) => `<span class="vv-chip ${r.abiertos?.includes(p.id) ? 'ko' : 'ok'}">${esc(p.nombre)}: ${r.abiertos?.includes(p.id) ? 'desconectado' : num(Math.round((r.corrientes[p.id] || 0) * 100) / 100) + ' A'}</span>`).join('')}
      ${idp ? `<span class="vv-chip ${r.abiertos?.includes(idp.id) ? 'ko' : 'ok'}">ID: ${r.abiertos?.includes(idp.id) ? 'disparado' : 'fuga ' + Math.round((r.fuga || 0) * 1000) + ' mA'}</span>` : ''}</div>
      ${r.disparos.map((d) => `<div class="vv-alerta">⚡ ${esc(d.t)}</div>`).join('')}${r.avisos.map((a) => `<div class="vv-alerta peligro">⚠ ${esc(a)}</div>`).join('')}
      <div class="vv-fila">${idp ? '<button class="vv-btn small" data-v="test" title="Botón de prueba del diferencial">T · Probar el diferencial</button>' : ''}<label class="vv-chk"><input type="checkbox" data-tocar ${this.tocar ? 'checked' : ''}> Una persona toca la carcasa del aparato</label></div>
      ${r.abiertos?.length ? '<p class="vv-small">Para rearmar, pulsa la palanca del módulo en el cuadro (después de arreglar la causa).</p>' : ''}</section>`;
  }
  tabHTML() {
    if (this.tab === 'guia') return this.guiaHTML();
    if (this.tab === 'averia') return `<h4>${esc(this.averia.n)}</h4><p>${esc(this.averia.pista)}</p><ol class="vv-small"><li>Sin tensión, mide con el polímetro (📟 en Ω) y mira los bornes (rojo = mal).</li><li>Enchufa la manguera, prueba los interruptores y el enchufe, y usa el buscapolos (🔦).</li><li>Pulsa «Comprobar» para ver qué norma falla.</li><li>Arréglalo y vuelve a comprobar.</li></ol><button class="vv-btn small" data-v="reiniciarAveria">↺ Volver a empezar este caso</button>`;
    if (this.tab === 'comprobar') return this.comprobarHTML();
    if (this.tab === 'materiales') return this.materialesHTML();
    if (this.tab === 'ficha') return this.fichaHTML();
    if (this.tab === 'rev') return this.revisionHTML();
    return '';
  }
  fichaHTML() {
    return `<h4>Circuitos de una vivienda (ITC-BT-25)</h4><table class="vv-mat"><thead><tr><th>Circ.</th><th>Uso</th><th>PIA</th><th>mm²</th><th>Tubo</th></tr></thead><tbody>${Object.entries(CIRCUITOS).map(([k, c]) => `<tr><td>${k}</td><td class="vv-small">${esc(c.n)}</td><td>${c.In} A</td><td>${num(c.sec)}</td><td>Ø${c.tubo}</td></tr>`).join('')}</tbody></table>
      <h4>Bornes: cuánto pelar y con qué apretar</h4><table class="vv-mat"><thead><tr><th>Borne</th><th>Pelar</th><th>Punta</th></tr></thead><tbody>${Object.values(BORNES).map((b) => `<tr><td class="vv-small">${esc(b.n)}</td><td>${b.pel[0]}–${b.pel[1]} mm</td><td class="vv-small">${b.puntas ? b.puntas.map((x) => esc(PUNTAS[x].n)).join(' / ') + (b.par ? ' · ' + esc(b.par) : '') : 'sin tornillo'}</td></tr>`).join('')}</tbody></table>
      <h4>Fichas de empalme</h4><table class="vv-mat"><thead><tr><th>Ficha</th><th>Vías</th><th>mm²</th><th>A</th></tr></thead><tbody>${Object.values(FICHAS).map((f) => `<tr><td class="vv-small">${esc(f.n)}<br><i>${esc(f.ref)}</i></td><td>${f.vias}</td><td>${num(f.smin)}–${num(f.smax)}</td><td>${f.A}</td></tr>`).join('')}</tbody></table>
      <h4>Colores (ITC-BT-19)</h4><ul class="vv-small">${Object.values(COLORES).map((c) => `<li>${esc(c.n)}: ${esc(c.clase)}</li>`).join('')}</ul>
      <h4>Productos de referencia</h4><ul class="vv-small">${Object.values(REFERENCIAS).map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
      <p class="vv-small">Tubo en superficie: grapas cada 50 cm como máximo (ITC-BT-21). Diámetro según el número y la sección de los cables (con más de 5 conductores, el tubo ha de tener 2,5 veces su sección).</p>`;
  }
  pasos() {
    const m = this.m; const n = (t) => m.parts.filter((p) => p.type === t).length; const R = this.chkTablero || comprobarTablero(m); const ok = (re) => R.items.some((i) => re.test(i.t) && i.ok);
    const mts = m.parts.filter(esMT); const c1 = mts.some((p) => circuitoDe(p) === 'C1'), c2 = mts.some((p) => circuitoDe(p) === 'C2');
    const tubosOk = m.tubos.length > 0 && m.tubos.every((t) => t.med && t.cort === 'ok' && huecoGrapas(m, t) <= GRAPA_MAX);
    return [
      ['Coloca el cuadro y la manguera de 3 hilos con clavija', n('cuadro') === 1 && n('manguera') === 1],
      ['Pon en el carril el diferencial ID 30 mA, el C1 10 A (alumbrado) y el C2 16 A (enchufes)', n('id') === 1 && c1 && c2],
      ['Coloca y atornilla 3 bombillas, 2 interruptores, las cajas CE1 y CE2 y el enchufe en sus sitios (siluetas punteadas)', n('bombilla') === 3 && n('interruptor') === 2 && n('caja') === 2 && n('enchufe') === 1],
      ['Tira los tubos (〰): cuadro–CE1, CE1–Bombilla 1, CE1–Interruptor 1, CE1–CE2, CE2–Bombilla 2, CE2–Interruptor 2, CE2–Bombilla 3 y cuadro–Enchufe; mídelos, córtalos y grápalos', ok(/^Tubo corrugado como en el plano/) && tubosOk],
      ['C1 (1,5 mm²): fase marrón y neutro azul del C1 a CE1 y de CE1 a CE2; en cada caja, con fichas, fase al interruptor y retorno negro a sus bombillas; neutro azul a las bombillas', ok(/^Funciona:/) && ok(/^CE1 alimenta/)],
      ['C2 (2,5 mm²): fase marrón, neutro azul y tierra amarillo-verde del cuadro al enchufe', ok(/^Enchufe 1 con toma de tierra/) && ok(/^Enchufe con/)],
      ['Revisa las normas y el acabado: colores, secciones, fichas, puntas peladas y apretadas, tubos', m.cables.length > 0 && comprobar(m).ok],
      ['Mide sin tensión con el polímetro, enchufa la manguera, prueba los interruptores y pulsa T en el diferencial', !!this.probado],
    ];
  }
  guiaHTML() {
    this.chkTablero = comprobarTablero(this.m); const P = this.pasos(); const hechos = P.filter((p) => p[1]).length;
    let h = `<div class="vv-prog"><div style="width:${(hechos / P.length) * 100}%"></div></div><p class="vv-small">${hechos} de ${P.length} pasos · <a href="materiales/eee/sa1/tablero_referencia.png" target="_blank" rel="noopener">ver la imagen de referencia</a> · <a href="materiales/eee/sa1/SA1_Trabajo3_montaje_tablero.pdf" target="_blank" rel="noopener">enunciado (PDF)</a></p>
      <ol class="vv-pasos">${P.map(([t, ok]) => `<li class="${ok ? 'ok' : ''}">${ok ? '✅' : '⬜'} ${esc(t)}</li>`).join('')}</ol>
      <div class="vv-fila"><button class="vv-btn" data-tab="comprobar">✔ Comprobar el tablero</button></div>`;
    if (portal()?.rol === 'alumno') h += this.entregaHTML();
    return h;
  }
  comprobarHTML() {
    const R = this.chk || null;
    let h = `<p class="vv-small">${this.kind === 'tablero' ? 'Compara tu montaje con el tablero de la SA1 y revisa las normas.' : 'Revisa las normas de la instalación.'}</p><div class="vv-fila"><button class="vv-btn primary" data-v="comprobar">✔ Comprobar instalación</button></div>`;
    if (R) h += `<div class="vv-check ${R.ok ? 'ok' : 'ko'}"><div class="vv-ch">${R.ok ? '✅ ¡Todo correcto!' : `❌ ${R.items.filter((i) => !i.ok).length} cosa${R.items.filter((i) => !i.ok).length > 1 ? 's' : ''} por corregir`}</div><ul>${R.items.map((i) => `<li class="${i.ok ? 'ok' : 'ko'}">${i.ok ? '✔' : '✖'} ${esc(i.t)}</li>`).join('')}</ul></div>`;
    if (portal()?.rol === 'alumno' && PRACTICA[this.kind]) h += this.entregaHTML();
    return h;
  }
  hacerComprobacion() {
    if (this.vistaActiva === 'casa') return this.casa.comprobar();
    const base = comprobar(this.m, { realista: true });
    const R = this.kind === 'tablero' ? comprobarTablero(this.m) : base;
    const malos = new Set(), tubos = new Set(); for (const i of [...R.items, ...base.items]) if (!i.ok) { (i.cables || []).forEach((c) => malos.add(c)); (i.tubos || []).forEach((t) => tubos.add(t)); }
    this.chk = { ok: R.ok, items: R.items, cables: malos, tubos }; this.construir(); return R;
  }
  tablaMateriales(L) {
    const precios = store.get('precios') || {}; const P = presupuesto(L, precios);
    return `<p class="vv-small">Lista para el <b>Trabajo 3</b> (presupuesto): los precios son orientativos; escribe los de la tienda y se guardan en este navegador.</p>
      <table class="vv-mat"><thead><tr><th>Material</th><th>Cant.</th><th>€/ud</th><th>Total</th></tr></thead><tbody>${P.filas.map((f) => `<tr><td>${esc(f.concepto)}</td><td class="n">${num(f.cant)} ${f.ud}</td><td><input data-precio="${esc(f.k)}" type="number" min="0" step="0.01" value="${f.precio}" aria-label="Precio de ${esc(f.concepto)}"></td><td class="n">${eur(f.total)}</td></tr>`).join('')}</tbody>
      <tfoot><tr><td colspan="3">Total (IVA incluido en los precios)</td><td class="n" id="vvTotal">${eur(P.total)}</td></tr></tfoot></table>
      <div class="vv-fila"><button class="vv-btn small" data-v="csv">⬇ Descargar CSV</button><button class="vv-btn small" data-v="preciosBase">↺ Precios orientativos</button></div>`;
  }
  listaMateriales() { return this.vistaActiva === 'casa' ? materialesCasa(this.casa.m) : materiales(this.m); }
  materialesHTML() { const L = materiales(this.m); if (!L.length) return '<p class="vv-small">Coloca piezas y cables para calcular la lista de materiales.</p>'; return this.tablaMateriales(L); }
  onPrecio(inp) { const p = store.get('precios') || {}; p[inp.dataset.precio] = Math.max(0, +inp.value || 0); store.set('precios', p); const P = presupuesto(this.listaMateriales(), p); const t = this.$('#vvTotal'); if (t) t.textContent = eur(P.total); }
  csv() {
    const P = presupuesto(this.listaMateriales(), store.get('precios') || {}); const q = (v) => `"${String(v).replace(/"/g, '""')}"`;
    const filas = [['Material', 'Cantidad', 'Unidad', 'Precio unitario (€)', 'Total (€)'], ...P.filas.map((f) => [f.concepto, num(f.cant), f.ud, num(f.precio), num(f.total)]), ['Total', '', '', '', num(P.total)]];
    const url = URL.createObjectURL(new Blob(['\ufeff' + filas.map((r) => r.map(q).join(';')).join('\r\n')], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = this.vistaActiva === 'casa' ? 'materiales-vivienda.csv' : 'materiales-tablero.csv'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 2000);
  }
  estado(html) {
    const el = this.$('#vvStatus'); if (!el) return;
    if (this.vistaActiva === 'taller') { el.innerHTML = 'Pulsa una herramienta del panel · botón derecho para girar · rueda para acercar'; return; }
    if (this.vistaActiva === 'casa') { el.innerHTML = this.casa.estado(); return; }
    if (this.vistaActiva === 'montaje') { el.innerHTML = 'Elige la herramienta del cinturón · arrastra para girar · rueda para acercar'; return; }
    if (html) { el.innerHTML = html; return; }
    const H = BARRA.find((x) => x[0] === this.tool);
    el.innerHTML = this.colocar ? `Pulsa en el tablero para colocar: <b>${esc(TIPOS[this.colocar].nombre)}</b> · <kbd>Esc</kbd> para terminar`
      : this.cableIni ? `Cable ${esc(COLORES[this.color].n.toLowerCase())} de ${fmtSec(this.sec)} desde <b>${esc(nombreBorne(this.m, this.cableIni))}</b>: pulsa el otro borne`
      : this.tuboIni ? 'Tubo: pulsa la pieza de destino' : this.ro ? 'Revisión · solo lectura' : this.tool === 'tubo' ? `Tubo Ø${this.dTubo}: pulsa la pieza de origen` : this.tool !== 'mover' && H ? `${H[1]} ${esc(H[3])}${this.tool === 'destornillador' ? ` · punta <b>${esc(PUNTAS[this.punta].n)}</b>` : ''}` : 'Pulsa un borne dorado para tirar un cable · arrastra las piezas para moverlas';
  }
  toast(t, ms = 3200) { const el = this.$('#vvToast'); if (!el) return; el.innerHTML = t; el.hidden = false; clearTimeout(this._tt2); this._tt2 = setTimeout(() => { el.hidden = true; }, ms); }

  // ------------------------------------------------------------------ visor de detalle (girar, despiece, bornes)
  ver3D(id = this.sel?.id) {
    const p = partePorId(this.m, id); if (!p) return false; const m = this.m; const T = TIPOS[p.type];
    const cabl = (t) => m.cables.filter((c) => (c.a.p === p.id && c.a.t === t) || (c.b.p === p.id && c.b.t === t));
    const desc = (c) => `${COLORES[c.color].n.toLowerCase()} ${fmtSec(c.sec)}`;
    const PP = puntas(m); const lado = (c, t) => (c.a.p === p.id && c.a.t === t ? 'a' : 'b');
    const cab3 = (B) => Object.keys(B).flatMap((t) => cabl(t).map((c) => { const l = lado(c, t); return { borne: t, hex: COLORES[c.color].hex, color: c.color, tierra: c.color === 'tierra', sec: c.sec, pel: this.realista ? extremo(c, l).pel : idealPelado(m, { p: p.id, t }), ideal: idealPelado(m, { p: p.id, t }), estado: PP.get(c.id)?.[l] || 'ok' }; }));
    const avisoPunta = (t) => cabl(t).map((c) => PP.get(c.id)?.[lado(c, t)]).find((e) => e && e !== 'ok');
    let o, etiquetas = [], cables = [], info = '', detras = false;
    if (p.type === 'cuadro' || p.type === 'manguera') return this.ver3DCuadro(p.type === 'cuadro' ? p : partePorId(m, p.cuadro));
    if (p.type === 'caja') {
      const tam = tamCaja(p); const pos = posicionesCaja(tam); o = cajaEmpalme3D(tam, p.fichas || {}, pos, { tapa: false });
      etiquetas = pos.map(([x, y], i) => { const t = 'B' + (i + 1); const f = FICHAS[p.fichas?.[t]]; const cs = cabl(t); return { txt: `${i + 1}: ${f ? f.corto : 'vacía'}${cs.length ? ' · ' + cs.map((c) => COLORES[c.color].n.toLowerCase()).join(', ') : ''}`, pos: new THREE.Vector3(x, y + 1.3, 1.6), cls: f ? '' : 'vacia' }; });
      info = `<b>Caja de empalme ${tam}×${tam} mm</b>, vacía, con ${pos.length} posiciones para fichas. Cada ficha une los cables de un mismo conductor. Pela 11 mm para las fichas de palanca y de inserción, 8 mm para la regleta.`;
    } else if (T.modulo) {
      o = modulo3D(esMT(p) ? 'mt' : p.type, { In: amperios(p), curva: curvaDe(p), circ: circuitoDe(p) || '', on: p.on !== false });
      const xs = p.type === 'iga' || p.type === 'id' ? [-0.9, 0.9] : [-0.45, 0.45];
      etiquetas = [{ txt: 'Entrada fase (1)', pos: new THREE.Vector3(xs[0], 3.4, 4.8), cls: 'f' }, { txt: 'Entrada N', pos: new THREE.Vector3(xs[1], 3.4, 4.8), cls: 'n' }, { txt: 'Salida fase (2)', pos: new THREE.Vector3(xs[0], -3.4, 4.8), cls: 'f' }, { txt: 'Salida N', pos: new THREE.Vector3(xs[1], -3.4, 4.8), cls: 'n' }];
      info = `<b>${esc(p.nombre)}</b> · ${(T.mods || 1) * 18} mm de ancho (${T.mods || 1} módulo${(T.mods || 1) > 1 ? 's' : ''}) y 81 mm de alto, sobre carril DIN de 35 mm. Bornes de caja con tornillo: pela ${BORNES.aparamenta.pel.join('–')} mm y aprieta con PZ2 a ${BORNES.aparamenta.par}. ${esc(REFERENCIAS[p.type === 'id' ? 'id' : p.type === 'iga' ? 'iga' : 'mt'] || '')}`;
    } else if (p.type === 'bombilla') {
      o = bombilla3D(0); const B = o.userData.bornes; etiquetas = Object.entries(B).map(([t, b]) => ({ txt: t === 'L' ? 'L · fase (retorno del interruptor)' : 'N · neutro', grupo: b.grupo, pos: b.pos, cls: t === 'N' ? 'n' : 'f' }));
      cables = cab3(B); info = '<b>Portalámparas E27</b>: el contacto central lleva la fase (el retorno del interruptor) y la rosca, el neutro. Pela 8–12 mm y aprieta con PH1 o plana de 3,5 mm.';
    } else {
      o = mecanismo3D(p.type, { on: p.on, pos: p.pos }); const B = o.userData.bornes; detras = true;
      etiquetas = Object.entries(B).map(([t, b]) => { const cs = cabl(t); const mk = MARCA(p.type, t); const av = avisoPunta(t); return { txt: `${mk}${cs.length ? ' · ' + cs.map(desc).join(', ') : ' · libre'}${av ? ' · ⚠ ' + TXT_PUNTA[av] : ''}`, grupo: b.grupo, pos: b.pos, cls: (t === 'PE' ? 't' : t === 'N' ? 'n' : 'f') + (av ? ' aviso' : ''), cara: 'detras' }; });
      if (o.userData.agujeros) for (const [t, v] of Object.entries(o.userData.agujeros)) etiquetas.push({ txt: t === 'L' ? 'Fase (L)' : t === 'N' ? 'Neutro (N)' : 'Tierra ⏚', grupo: 'tecla', pos: v, cls: t === 'PE' ? 't' : t === 'N' ? 'n' : 'f' });
      cables = cab3(B);
      info = `<b>${esc(T.nombre)}</b> · mecanismo de 45×45 mm en caja de superficie, marco de 81 mm y 60 mm entre tornillos. Por detrás cada borne está marcado (${Object.keys(B).map((t) => MARCA(p.type, t)).join(', ')}): mete el cable pelado ${BORNES.mecanismo.pel.join('–')} mm en su hueco y aprieta con PZ1 o plana de 3,5 mm.${p.type === 'enchufe' ? ' Mirando el enchufe de frente, la fase suele ir a la izquierda y el neutro a la derecha; la tierra va a las patillas metálicas.' : p.type === 'conmutador' ? ' El borne común (L o flecha) recibe la fase; los viajeros 1 y 2 van al otro conmutador.' : ''} ${esc(REFERENCIAS[p.type] || '')}`;
    }
    return this.visor.abrir({ titulo: p.nombre, objeto: o, etiquetas, cables, info, detras });
  }

  // Cuadro de cerca: aparamenta en el carril con sus bornes de entrada (arriba) y salida (abajo), barra de tierra y bornero
  ver3DCuadro(q) {
    if (!q) return false; const m = this.m; const T = TIPOS.cuadro; const o = new THREE.Group(); o.userData.partes = {};
    o.add(cuadroDet(T.w, T.h)); const c0 = posParte(m, q); const etiquetas = [];
    for (const p of m.parts.filter((x) => x.cuadro === q.id && TIPOS[x.type].modulo)) {
      const c = posParte(m, p); const md = modulo3D(esMT(p) ? 'mt' : p.type, { In: amperios(p), curva: curvaDe(p), circ: circuitoDe(p) || '', on: p.on !== false }); md.position.set(c.x - c0.x, c.y - c0.y, ZMOD - 4.4); o.add(md);
      for (const b of bornes(p)) { const cs = m.cables.filter((w) => (w.a.p === p.id && w.a.t === b.t) || (w.b.p === p.id && w.b.t === b.t));
        if (!q.cab && !cs.length && !/^[LN]$/.test(b.t)) continue;
        etiquetas.push({ txt: `${p.nombre.split(' ')[0]} ${b.t === 'Le' ? '1' : b.t === 'L' ? (q.cab ? '2' : 'L') : 'N'}${cs.length ? ' · ' + cs.map((w) => COLORES[w.color].n.toLowerCase()).join(', ') : ''}`, pos: new THREE.Vector3(c.x - c0.x + b.dx, c.y - c0.y + b.dy, ZMOD + 0.4), cls: /N/.test(b.t) ? 'n' : 'f' }); }
    }
    etiquetas.push({ txt: '⏚ barra de tierra', pos: new THREE.Vector3(12, 8.6, 2.4), cls: 't' });
    const mg = m.parts.find((x) => x.type === 'manguera' && x.cuadro === q.id);
    if (mg && q.cab) { const c = posParte(m, mg); for (const b of bornes(mg)) { const x = c.x - c0.x + b.dx, y = c.y - c0.y + b.dy; const bl = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.3, 1.2), new THREE.MeshStandardMaterial({ color: b.t === 'PE' ? 0x3fae2a : 0xeeeeea, roughness: 0.5 })); bl.position.set(x, y, 1.8); o.add(bl); etiquetas.push({ txt: `Bornero ${b.t === 'PE' ? '⏚' : b.t}`, pos: new THREE.Vector3(x - 1.6, y, 2.4), cls: b.t === 'PE' ? 't' : b.t === 'N' ? 'n' : 'f' }); } }
    const info = `<b>Cuadro de mando y protección</b> · carril DIN de 35 mm. En toda la aparamenta la <b>entrada</b> va <b>arriba</b> (bornes 1 y N) y la <b>salida abajo</b> (2 y N); el neutro, siempre por los bornes marcados N. Orden: manguera → IGA → diferencial (ID 30 mA) → magnetotérmicos de cada circuito. Bornes de caja: pela ${BORNES.aparamenta.pel.join('–')} mm y aprieta con PZ2 a ${BORNES.aparamenta.par}.`;
    return this.visor.abrir({ titulo: q.nombre || 'Cuadro', objeto: o, etiquetas, cables: [], info, detras: false });
  }

  // ------------------------------------------------------------------ entregas
  entregaHTML() {
    const P = portal(); const k = PRACTICA[this.kind]; if (!P || !k || this.ro) return '';
    const e = P.estadoEntrega?.(k);
    if (this._entregando) return '<div class="vv-ent"><button class="vv-red" disabled>📤 Enviando…</button></div>';
    let h = '<div class="vv-ent"><h4>Entrega</h4>';
    if (!e) h += '<p class="vv-small">Se envían tu montaje, el resultado de «Comprobar» y la lista de materiales, solo con tu grupo y tu número de lista.</p><button class="vv-red" data-v="entregar">📤 Entregar al profesor</button>';
    else { h += `<div>📤 <b>Entregado</b>${e.nota != null ? ` · Nota: <b>${num(e.nota)}</b>` : ' · pendiente de corregir'}</div>${e.comentario ? `<div class="vv-small">💬 ${esc(e.comentario)}</div>` : ''}`; if (e.nota == null) h += '<button class="vv-btn small" data-v="entregar">↻ Volver a entregar</button>'; }
    return h + '</div>';
  }
  solucionProfesorHTML(v) { return portal()?.esProfesor ? `<div class="vv-fila"><button class="vv-btn small" data-v="${v}">👁 Cargar solución (profesor)</button></div>` : ''; }
  entregar() {
    const P = portal(); const k = PRACTICA[this.kind]; if (!P || !k || this._entregando) return;
    if (this.kind === 'montaje') { const E = this.montaje.entrega(); if (!E.ok && !(this.opts.confirm || confirm)('Todavía no has terminado el montaje. ¿Quieres entregarlo igualmente?')) { this.lado(); return; }
      const datos = { montaje: JSON.stringify({ app: 'laboratorio-vivienda', version: 2, practica: k, juego: this.montaje.datos(), nota: E.nota }).slice(0, 199000), comprobacion: { ok: !!E.ok, items: E.items.slice(0, 60).map((i) => ({ t: String(i.t).slice(0, 200), ok: !!i.ok })) }, aciertos: E.aciertos };
      this._entregando = true; this.lado();
      P.entregar({ practica: k, tipo: 'vivienda', titulo: `Vivienda · ${TITULO.montaje}`.slice(0, 120), datos }).then(() => this.toast('📤 ¡Entregado al profesor!'), (e) => this.toast('❌ No se ha podido entregar: ' + esc(e?.mensaje || 'revisa la conexión.'), 5000)).finally(() => { this._entregando = false; this.lado(); });
      return; }
    const R = this.hacerComprobacion();
    if (!R.ok && !(this.opts.confirm || confirm)('La comprobación todavía tiene fallos. ¿Quieres entregarla igualmente?')) { this.lado(); return; }
    const pres = presupuesto(this.listaMateriales(), store.get('precios') || {});
    const model = this.kind === 'casa' ? this.casa.m : this.m;
    const datos = { montaje: JSON.stringify({ app: 'laboratorio-vivienda', version: 2, practica: k, model }).slice(0, 199000), comprobacion: { ok: !!R.ok, items: R.items.slice(0, 60).map((i) => ({ t: String(i.t).slice(0, 200), ok: !!i.ok })) },
      aciertos: `${R.items.filter((i) => i.ok).length}/${R.items.length}`, materiales: JSON.stringify({ filas: pres.filas.map((f) => ({ c: f.concepto, n: f.cant, u: f.ud, p: f.precio })), total: pres.total }).slice(0, 19000) };
    this._entregando = true; this.lado();
    P.entregar({ practica: k, tipo: 'vivienda', titulo: `Vivienda · ${TITULO[this.kind]}`.slice(0, 120), datos })
      .then(() => this.toast('📤 ¡Entregado al profesor!'), (e) => this.toast('❌ No se ha podido entregar: ' + esc(e?.mensaje || 'revisa la conexión.'), 5000))
      .finally(() => { this._entregando = false; this.lado(); });
  }
  review(rev) {
    const root = this.$('.vv'); root.classList.remove('is-home'); root.classList.add('is-ed'); this.visor?.cerrar();
    let m = {}; try { m = JSON.parse(rev.montaje || '{}'); } catch (e) { m = {}; }
    this.modo = 'revision'; this.ro = true; this.rev = rev; this.red = false; this.res = null; this.chk = null; this.undoS = []; this.sel = null;
    this.initScene();
    if (rev.practica === PRACTICA_PROY) { this._revN = null; this.reviewProy(rev, m); this.crumbs(); return; }
    this.proy = null; this.stepbar(); this.strip();
    if (rev.practica === 'v4') { this.kind = 'montaje'; this.vistaActiva = 'montaje'; if (this.renderer) { this.montaje.init(this.renderer); this.montaje.cargarEstado(m.juego || {}); this.montaje.luz = this.montaje.acabado; this.montaje.construir(); this.montaje.vista(); } }
    else if (rev.practica === 'v3') { this.kind = 'casa'; this.vistaActiva = 'casa'; if (this.renderer) this.casa.init(this.renderer); this.casa.cargar(m.model || m, true); this.casa.tab = 'rev'; }
    else { this.kind = rev.practica === 'v1' ? 'tablero' : 'libre'; this.vistaActiva = 'tablero'; this.m = sanear(m.model || m); this.tab = 'rev'; this._dimKey = null; }
    root.dataset.modo = this.kind; root.classList.toggle('es-casa', this.kind === 'casa'); root.classList.remove('es-taller'); root.classList.toggle('es-montaje', this.kind === 'montaje');
    this.$('#vvTitulo').innerHTML = `<span class="vv-pn">Revisión</span><span>${esc(rev.quien || '')} · ${esc(TITULO[this.kind])}</span>`;
    this.crumbs(); this.activarControles(); this.cambio(false); this.vista(); this.resume();
  }
  revisionHTML() {
    const r = this.rev; if (!r) return ''; const c = r.comprobacion; let mat = null; try { mat = JSON.parse(r.materiales || 'null'); } catch (e) { mat = null; }
    const f = (t) => (t ? new Date(t).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }) : '');
    return `<p class="vv-small">${esc(r.quien || '')} · entregada ${esc(f(r.fecha))}</p><div class="vv-fila"><button class="vv-btn small" data-v="revVolver">← Volver a las entregas</button></div>
      ${c ? `<div class="vv-check ${c.ok ? 'ok' : 'ko'}"><div class="vv-ch">${c.ok ? '✅ La comprobación salió bien al entregar' : '❌ La comprobación tenía fallos al entregar'}</div><ul>${(c.items || []).map((i) => `<li class="${i.ok ? 'ok' : 'ko'}">${i.ok ? '✔' : '✖'} ${esc(i.t)}</li>`).join('')}</ul></div>` : ''}
      ${mat ? `<h4>Materiales · ${eur(mat.total || 0)}</h4><ul class="vv-small">${(mat.filas || []).map((x) => `<li>${esc(x.c)}: ${num(x.n)} ${esc(x.u)} × ${eur(x.p)}</li>`).join('')}</ul>` : ''}
      <h4>Calificación</h4><label class="vv-f">Nota (0–10)<input type="number" id="vvNota" min="0" max="10" step="0.25" value="${r.nota != null ? esc(r.nota) : ''}"></label>
      <label class="vv-f">Comentario para el alumno<textarea id="vvCom" rows="3" maxlength="1000">${esc(r.comentario || '')}</textarea></label>
      <div class="vv-fila"><button class="vv-red" data-v="revGuardar">💾 Guardar nota</button><span class="vv-small" id="vvGradeMsg"></span></div>`;
  }

  // ------------------------------------------------------------------ eventos
  onClick(e) {
    const t = e.target;
    if (!t.closest('.vv-menu')) { const dd = this.$('#vvDD'); if (dd) dd.hidden = true; }
    if ((this.kind === 'proyecto' || this.kind === 'proymontar') && this.onClickProy(t)) return;
    const tab = t.closest('[data-tab]'); if (tab) { if (this.vistaActiva === 'casa') { this.casa.tab = tab.dataset.tab; if (this.casa.tab === 'comprobar' && !this.casa.chk) this.casa.comprobar(); this.lado(); return; } this.tab = tab.dataset.tab; if (this.tab === 'comprobar' && !this.chk && this.m.parts.length) this.hacerComprobacion(); this.lado(); return; }
    if (this.vistaActiva === 'taller') {
      const h = t.closest('[data-herr]'); if (h) { this.taller.elegir(h.dataset.herr); return; }
      const pu = t.closest('[data-punta]'); if (pu) { this.punta = pu.dataset.punta; this.taller.elegir('destornillador', pu.dataset.punta); return; }
      const rs = t.closest('[data-resp]'); if (rs) { this.taller.responder(+rs.dataset.resp); this.lado(); return; }
    }
    if (this.vistaActiva === 'montaje') {
      const h = t.closest('[data-mh]'); if (h) { this.montaje.elegir(h.dataset.mh); this.barra(); return; }
      const pu = t.closest('[data-mpunta]'); if (pu) { this.montaje.elegirPunta(pu.dataset.mpunta); return; }
      const mm = t.closest('[data-mmm]'); if (mm) { this.montaje.elegirMM(mm.dataset.mmm); return; }
    }
    if (this.vistaActiva === 'casa' && this.casa.onClick(t)) { this.cambio(false); return; }
    const mu = t.closest('[data-multi]'); if (mu) { const v = mu.dataset.multi; if (v === 'tierra') { if (this.multi.a) { this.multi.b = 'TIERRA'; this.leerMulti(); } else this.toast('Primero toca un borne con la punta roja.'); } else { this.multi.modo = v; this.multi.a = this.multi.b = null; this.multi.txt = '— — —'; } this.pintarMulti(); this.construir(); return; }
    const add = t.closest('[data-add]'); if (add) { this.colocar = this.colocar === add.dataset.add ? null : add.dataset.add; this.tool = 'mover'; this.cableIni = null; this.tuboIni = null;
      const T = TIPOS[this.colocar]; if (this.colocar && (T?.modulo || this.colocar === 'manguera')) { this.poner(this.colocar, { x: 0, y: 0 }); this.colocar = null; }
      this.paleta(); this.barra(); this.estado(); return; }
    const tool = t.closest('[data-tool]'); if (tool) { this.tool = tool.dataset.tool; this.colocar = null; this.tuboIni = null; this.cableIni = null; if (this.tool === 'multimetro') { this.multi.a = this.multi.b = null; this.multi.txt = '— — —'; } this.paleta(); this.barra(); this.pintarMulti(); this.construir(); this.estado(); return; }
    const col = t.closest('[data-color]'); if (col) { this.color = col.dataset.color; this.paleta(); this.estado(); return; }
    const sec = t.closest('[data-sec]'); if (sec) { this.sec = +sec.dataset.sec; this.paleta(); return; }
    const b = t.closest('[data-v]'); if (!b) return; const v = b.dataset.v;
    if (v === 'archivo') { const dd = this.$('#vvDD'); dd.hidden = !dd.hidden; return; }
    if (v === 'undo') { if (this.vistaActiva === 'casa') { this.casa.deshacer(); this.cambio(false); return; } if (this.undoS.length && !this.ro) { this.redoS.push(JSON.stringify(this.m)); this.m = sanear(JSON.parse(this.undoS.pop())); this.sel = null; this.cambio(); } return; }
    if (v === 'redo') { if (this.redoS.length && !this.ro && this.vistaActiva === 'tablero') { this.undoS.push(JSON.stringify(this.m)); this.m = sanear(JSON.parse(this.redoS.pop())); this.sel = null; this.cambio(); } return; }
    if (v === 'red') { if (this.vistaActiva === 'casa') { this.casa.red = !this.casa.red; this.cambio(false); return; } this.red = !this.red; this.test = false; if (!this.red) this.m.parts.forEach((p) => { if (TIPOS[p.type].modulo && this.res?.abiertos?.includes(p.id)) p.on = false; }); { const k = this.pchk; this.cambio(!this.ro); if (k && this.kind === 'proymontar') { this.pchk = k; this.lado(); } } if (this.multi.a && this.multi.b) { this.leerMulti(); this.pintarMulti(); } return; }
    if (v === 'test') { this.test = true; this.cambio(!this.ro); if (this.res?.disparos?.some((d) => d.por === 'test')) { this.probado = true; this.toast('✅ El diferencial salta con el botón de prueba: funciona. Rearma con su palanca.'); this.lado(); } return; }
    if (v === 'borrar') return this.borrarSel();
    if (v === 'ver3d') { this.ver3D(); return; }
    if (v === 'vista') return this.vista(); if (v === 'acercar') return this.zoom(0.8); if (v === 'alejar') return this.zoom(1.25);
    if (v === 'comprobar') { this.hacerComprobacion(); this.lado(); return; }
    if (v === 'csv') return this.csv();
    if (v === 'preciosBase') { store.set('precios', {}); this.lado(); return; }
    if (v === 'entregar') return this.entregar();
    if (v === 'prepCable') { const c = this.m.cables.find((x) => x.id === this.sel?.id); if (c) { this.guardarUndo(); prepararExtremos(this.m, c); this.cambio(); } return; }
    if (v === 'grapasAuto') { const tb = this.m.tubos.find((x) => x.id === this.sel?.id); if (tb) { this.guardarUndo(); grapasAuto(this.m, tb); this.cambio(); } return; }
    if (v === 'usarHerr') { this.taller.usar(); return; }
    if (v === 'montajeVista') { this.montaje.vista(); return; }
    if (v === 'montajeReiniciar') { if ((this.opts.confirm || confirm)('¿Empezar el montaje desde el principio?')) { this.montaje.reiniciar(); this.cambio(false); } return; }
    if (v === 'tallerVista') { this.taller.vista(); return; }
    if (v === 'testEmpezar') { this.taller.test = { i: 0, bien: 0, r: null }; this.lado(); return; }
    if (v === 'testSig') { this.taller.siguiente(); this.lado(); return; }
    if (v === 'reiniciarAveria') { if ((this.opts.confirm || confirm)('¿Volver a empezar este caso?')) { this.guardarUndo(); this.m = averia(this.averia.id); this.red = false; this.cambio(); } return; }
    if (v === 'vaciar') {
      if (this.vistaActiva === 'casa') { if ((this.opts.confirm || confirm)('¿Vaciar la vivienda? (se puede deshacer)')) { this.casa.guardarUndo(); this.casa.m = casaVacia(); this.casa.sel = null; this.casa.cambio(); } return; }
      if ((this.opts.confirm || confirm)('¿Vaciar el tablero? (se puede deshacer)')) { this.guardarUndo(); const tb = this.m.tablero; this.m = vacio(); if (tb) this.m.tablero = tb; this.sel = null; this.red = false; this._dimKey = null; this.cambio(); } return; }
    if (v === 'solucion') {
      if (!portal()?.esProfesor) return;
      if (this.vistaActiva === 'casa') { this.casa.onClick({ closest: (s) => (s === '[data-v]' ? { dataset: { v: 'casaSolucion' } } : null) }); return; }
      if (this.kind === 'proymontar') { if ((this.opts.confirm || confirm)('¿Cargar la solución de este proyecto? (se puede deshacer)')) this.solucionProy(); return; }
      if ((this.opts.confirm || confirm)('¿Cargar la solución del tablero de la SA1? (se puede deshacer)')) { this.guardarUndo(); this.m = solucionTablero(); this.red = false; this._dimKey = null; this.cambio(); } return; }
    if (v === 'exportar') { const model = this.vistaActiva === 'casa' ? this.casa.m : this.m; const url = URL.createObjectURL(new Blob([JSON.stringify({ app: 'laboratorio-vivienda', version: 2, model }, null, 1)], { type: 'application/json' })); const a = document.createElement('a'); a.href = url; a.download = this.vistaActiva === 'casa' ? 'vivienda-real.json' : 'instalacion-vivienda.json'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 2000); return; }
    if (v === 'importar') { const f = this.$('#vvFile'); f.value = ''; f.onchange = async () => { try { const x = JSON.parse(await f.files[0].text()); const model = x.model || x; if (this.vistaActiva === 'casa') { this.casa.guardarUndo(); this.casa.m = sanearCasa(model); this.casa.cambio(); } else { this.guardarUndo(); this.m = sanear(model); this._dimKey = null; this.cambio(); } this.toast('Archivo importado.'); } catch (er) { this.toast('❌ Archivo no válido.'); } }; f.click(); return; }
    if (v === 'revVolver') { location.hash = '#panel/entregas'; return; }
    if (v === 'revGuardar') {
      const raw = String(this.$('#vvNota').value || '').trim().replace(',', '.'); const nota = raw === '' ? null : Math.round(+raw * 100) / 100; const msg = this.$('#vvGradeMsg');
      if (nota != null && !(nota >= 0 && nota <= 10)) { msg.textContent = 'La nota va de 0 a 10.'; return; }
      const com = this.$('#vvCom').value.slice(0, 1000); msg.textContent = 'Guardando…';
      Promise.resolve(portal()?.calificar(this.rev.id, nota, com)).then(() => { this.rev.nota = nota; this.rev.comentario = com; msg.textContent = '✔ Guardado'; }, () => { msg.textContent = '❌ No se ha podido guardar.'; });
    }
  }
  onChange(e) {
    const t = e.target; const m = this.m; const p = partePorId(m, this.sel?.id);
    if (this.vistaActiva === 'casa') { if (this.casa.onChange(t)) this.cambio(false); return; }
    const mod = (f) => { this.guardarUndo(); f(); this.cambio(); };
    if (p && t.matches('[data-montaje]')) return mod(() => { if (t.value === 'empotrar') p.montaje = 'empotrar'; else delete p.montaje; });
    if (p && t.matches('[data-mseg]')) return mod(() => { p.seg = +t.value; });
    if (p && t.matches('[data-tapa]')) return mod(() => { if (t.checked) p.tapa = true; else delete p.tapa; });
    if (t.matches('[data-carga]') && p) mod(() => { p.carga = t.value; });
    if (t.matches('[data-tocar]')) { this.tocar = t.checked; this.cambio(!this.ro); }
    if (t.matches('[data-nombre]')) { const n = t.value.trim().slice(0, 30); if (p && n) mod(() => { p.nombre = n; }); }
    if (t.matches('[data-cab]')) { const c = m.cables.find((x) => x.id === this.sel?.id); if (c) mod(() => { if (t.dataset.cab === 'color') c.color = t.value; else c.sec = +t.value; }); }
    if (t.matches('[data-pin]') && p) mod(() => { p.In = +t.value; if (esMT(p)) p.nombre = `${circuitoDe(p)} ${p.In} A`; });
    if (t.matches('[data-pcurva]') && p) mod(() => { p.curva = t.value; });
    if (t.matches('[data-pcirc]') && p) mod(() => { p.circ = t.value; p.nombre = `${p.circ} ${amperios(p)} A`; });
    if (t.matches('[data-ctam]') && p) mod(() => { p.tam = +t.value; const n = CAJAS[p.tam].pos; for (const k of Object.keys(p.fichas || {})) if (+k.slice(1) > n) delete p.fichas[k]; m.cables = m.cables.filter((c) => !((c.a.p === p.id && +c.a.t.slice(1) > n) || (c.b.p === p.id && +c.b.t.slice(1) > n))); });
    if (t.matches('[data-ficha]') && p) mod(() => { p.fichas = p.fichas || {}; if (t.value) p.fichas[t.dataset.ficha] = t.value; else delete p.fichas[t.dataset.ficha]; });
    if (t.matches('[data-tubo-d]')) { const tb = m.tubos.find((x) => x.id === this.sel?.id); if (tb) mod(() => { tb.d = +t.value; }); }
    if (t.matches('[data-dtubo]')) this.dTubo = +t.value;
    if (t.matches('[data-nin]')) this.inNuevo = +t.value;
    if (t.matches('[data-ncurva]')) this.curvaNueva = t.value;
    if (t.matches('[data-ncirc]')) this.circNuevo = t.value;
    if (t.matches('[data-ntam]')) this.tamCaja = +t.value;
    if (t.matches('[data-punta-sel]')) { this.punta = t.value; this.estado(); }
    if (t.matches('[data-pelar]')) this.pelar = t.value === 'auto' ? 'auto' : +t.value;
    if (t.matches('[data-realista]')) { this.realista = t.checked; store.set('realista', this.realista); if (!this.realista && !this.ro) { this.guardarUndo(); prepararTodo(m); } if (!this.realista && NECESITA_REALISTA.has(this.tool)) this.tool = 'mover'; this.cambio(); }
    if (t.matches('[data-rejilla]')) { this.rejilla = t.checked; store.set('rejilla', this.rejilla); this.construir(); }
    if (t.matches('[data-tamtab]')) { const [w, h] = t.value.split('x').map(Number); mod(() => { m.tablero = { w, h }; m.parts.forEach((q) => { if (q.x != null) { q.x = Math.min(q.x, w - 4); q.y = Math.min(q.y, h - 4); } }); }); this.vista(); }
  }
  onKey(e) {
    if (!this.modo || !this.host.offsetParent || e.target.closest?.('input, textarea, select')) return;
    if (this.kind === 'proyecto' && !this.visor?.abierto && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) { this.irPaso(this.paso + (e.key === 'ArrowRight' ? 1 : -1)); return; }
    if (e.key === 'Escape') { if (this.visor?.abierto) { this.visor.cerrar(); return; } this.colocar = null; this.cableIni = null; this.tuboIni = null; this.casa.colocar = null; this.casa.tuboIni = null; this.casa.mandoIni = null; this.tmp?.clear(); this.paleta(); this.construir(); this.estado(); }
    if ((e.key === 'Delete' || e.key === 'Backspace') && (this.vistaActiva === 'casa' ? this.casa.sel : this.sel)) { e.preventDefault(); this.borrarSel(); }
    if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z')) && !this.ro && this.vistaActiva === 'tablero') { e.preventDefault(); if (this.redoS.length) { this.undoS.push(JSON.stringify(this.m)); this.m = sanear(JSON.parse(this.redoS.pop())); this.sel = null; this.cambio(); } return; }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !this.ro) { e.preventDefault(); if (this.vistaActiva === 'casa') { this.casa.deshacer(); this.cambio(false); } else if (this.undoS.length && this.vistaActiva === 'tablero') { this.redoS.push(JSON.stringify(this.m)); this.m = sanear(JSON.parse(this.undoS.pop())); this.sel = null; this.cambio(); } }
  }
  // ganchos para las pruebas automáticas
  pantalla(x, y, z = ZT) { const C = this.cur(); const v = new THREE.Vector3(x, y, z).project(C.camera); const r = this.renderer.domElement.getBoundingClientRect(); return { x: r.left + ((v.x + 1) / 2) * r.width, y: r.top + ((1 - v.y) / 2) * r.height }; }
  pantallaBorne(p, t) { const q = posBorne(this.m, { p, t }); return q && this.pantalla(q.x, q.y, zBorne(this.m, { p, t })); }
  pantallaParte(id, dx = 0, dy = 0) { const q = posParte(this.m, id); return q && this.pantalla(q.x + dx, q.y + dy, TIPOS[partePorId(this.m, id).type].modulo ? ZMOD + 1 : 2.5); }
  pantallaTubo(id) { const t = this.m.tubos.find((x) => x.id === id); if (!t) return null; const T = tramoTubo(this.m, t); const q = puntoEnRuta(T.pts, T.ini + T.L * 0.37); return this.pantalla(q.x, q.y, fin(t.d, 16) / 20); }
  cargarSolucion() { this.cargar(solucionTablero()); }
  cargar(m, { red = false } = {}) { this.guardarUndo(); this.m = sanear(clone(m)); this.red = red; this.sel = null; this._dimKey = null; this.cambio(); }
  herramientas() { return HERRAMIENTAS.map((h) => h.id); }
  cargarCasaSolucion() { this.casa.guardarUndo(); this.casa.m = sanearCasa(solucionCasa()); this.casa.cambio(); }
  pantallaCasa(x, y, z = 0) { return this.casa.pantalla(x, y, z, this.renderer.domElement); }
}
instalarProyectos(ViviendaLab);

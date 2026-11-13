// Laboratorio de Circuitos: editor 3D de protoboard con simulación en tiempo real y prácticas guiadas.
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { estudio, camaraSuave, cancelarVuelo, volar } from '../kit3d/escena.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { BT, BOARD_W, BOARD_D, holeAt, holePos, stripOf, holesOfStrip, holeName, stripName, rot, parseHole } from './board.js';
import { PARTS, CATS, E12, WIRE_COLORS, WIRE_HEX, resistorBands, fmtOhm, fmtSI, defaultState, ID_PREFIX } from './parts.js';
import { WIRE_KINDS, END, SOCKETS, socketOf, fitKind, canStart, validKinds, startKinds, bestKind, whyNot } from './connectors.js';
import { buildBreadboard, buildMat, buildPart, terminalHits, buildWire, buildProbe, wireHex, M } from './models3d.js';
import { partHoles, termKey } from './netlist.js';
import { simulate } from './engine.js';
import { PRACTICES, RA_SHORT } from './practices.js';
import { solutionModel, stepDone, runChecks, makePart } from './guide.js';
import { RA } from '../common.js';
import { ic } from '../ui/iconos.js';
import { TIPOS_AVERIA, leerMontaje } from '../lms/motores/averia.js';

const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const clone = (o) => JSON.parse(JSON.stringify(o));
const LS = 'circ:v1:';
const store = { get(k) { try { return JSON.parse(localStorage.getItem(LS + k)); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(LS + k, JSON.stringify(v)); } catch (e) { } }, del(k) { try { localStorage.removeItem(LS + k); } catch (e) { } } };
const LOGO = `<svg viewBox="0 0 40 40" class="cx-logo" aria-hidden="true"><rect x="1" y="1" width="38" height="38" rx="10" fill="#0f5e66"/><path d="M6 24h7l2.5-7 4 13 4-15 3 9h7.5" fill="none" stroke="#f5a524" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="6" cy="24" r="2.6" fill="#7fe3e0"/><circle cx="34" cy="24" r="2.6" fill="#7fe3e0"/></svg>`;
const portal = () => (typeof window !== 'undefined' ? window.PORTAL : null);
const ICON = { rotate: '⟳', del: '🗑', home: '⌂', top: '⊤', fit: '⤢', sound: '🔊', mute: '🔇', help: '?', flow: '⚡', xray: '▦', pins: '🏷', hq: '✦' };

class Buzz {
  constructor() { this.ctx = null; this.muted = false; }
  ensure() { if (this.ctx) return; try { const C = window.AudioContext || window.webkitAudioContext; if (!C) return; this.ctx = new C(); this.g = this.ctx.createGain(); this.g.gain.value = 0; this.g.connect(this.ctx.destination); this.o = this.ctx.createOscillator(); this.o.type = 'square'; this.o.frequency.value = 2300; this.o.connect(this.g); this.o.start(); } catch (e) { this.ctx = null; } }
  click() { if (!this.ctx || this.muted) return; try { const t = this.ctx.currentTime, o = this.ctx.createOscillator(), g = this.ctx.createGain(); o.type = 'square'; o.frequency.value = 180; g.gain.setValueAtTime(0.08, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05); o.connect(g); g.connect(this.ctx.destination); o.start(t); o.stop(t + 0.06); } catch (e) { } }
  set(vol) { if (!this.ctx) return; const v = this.muted ? 0 : vol * 0.05; if (Math.abs(this.g.gain.value - v) > 0.001) this.g.gain.setTargetAtTime(v, this.ctx.currentTime, 0.02); }
}

export class CircuitLab {
  constructor(host, opts = {}) {
    this.host = host; this.opts = opts;
    this.model = { parts: [], wires: [] }; this.sel = null; this.running = false; this.runtime = {};
    this.undoS = []; this.redoS = []; this.view = null; this.pr = null; this.g = null;
    this.wireColor = 'verde'; this.wireKind = 'mm'; this.buzz = new Buzz(); this.seq = 1;
    this.showFlow = store.get('pref:flow') ?? true; this.xray = false; this.showPins = false; this.hq = store.get('pref:hq') ?? true;
    host.innerHTML = this.shellHTML();
    this.$ = (s) => host.querySelector(s);
    this.bindShell();
  }
  shellHTML() {
    return `<div class="cx is-home">
    <header class="cx-top">
      <a class="cx-brand" href="#eee/circuitos" title="Inicio del laboratorio">${LOGO}<span class="cx-bt"><span class="cx-b1">Laboratorio de <b>Circuitos</b></span><span class="cx-b2">Monta · simula · mide</span></span></a>
      <div class="cx-ptitle" id="cxPTitle"></div>
      <div class="cx-actions">
        <button class="cx-ib" id="cxUndo" title="Deshacer (Ctrl+Z)">↶</button><button class="cx-ib" id="cxRedo" title="Rehacer (Ctrl+Y)">↷</button>
        <div class="cx-menu"><button class="cx-btn" id="cxFileBtn">Archivo ▾</button>
          <div class="cx-dd" id="cxFileDD">
            <button data-file="save">💾 Guardar en este navegador</button><button data-file="load">📂 Abrir lo guardado</button>
            <button data-file="export">⬇ Exportar a archivo (.json)</button><button data-file="import">⬆ Importar archivo…</button>
            <button data-file="clear">🧹 Nuevo montaje (vaciar)</button>
          </div></div>
        <button class="cx-sim" id="cxSim">▶ Iniciar simulación</button>
      </div>
    </header>
    <div class="cx-crumbs"><div id="cxCrumbs"></div><div class="cx-prof" id="cxProf"></div></div>
    <div class="cx-home" id="cxHome"></div>
    <div class="cx-editor">
      <section class="cx-view" id="cxView"><div id="cxGL"></div><div id="cxLabels"></div>
        <div class="cx-tools">
          <button data-tool="rotate" title="Girar 90° (R)">${ICON.rotate}</button><button data-tool="del" title="Borrar (Supr)">${ICON.del}</button>
          <span class="sep"></span><button data-tool="home" title="Vista inicial (H)">${ICON.home}</button><button data-tool="top" title="Vista desde arriba (T)">${ICON.top}</button><button data-tool="fit" title="Ajustar al montaje (F)">${ICON.fit}</button>
          <span class="sep"></span><button data-tool="flow" title="Ver la corriente (puntos que se mueven por los cables)">${ICON.flow}</button><button data-tool="xray" title="Ver por dentro: tiras metálicas de la protoboard (X)">${ICON.xray}</button><button data-tool="pins" title="Nombres de todas las patas (N)">${ICON.pins}</button>
          <span class="sep"></span><button data-tool="hq" title="Calidad gráfica alta / ligera (para ordenadores lentos)">${ICON.hq}</button><button data-tool="sound" title="Sonido">${ICON.sound}</button><button data-tool="help" title="Ayuda">${ICON.help}</button>
        </div>
        <div class="cx-wbar" id="cxWBar"></div>
        <div class="cx-insp" id="cxInsp"></div>
        <div class="cx-alert" id="cxAlert"></div>
        <div class="cx-toast" id="cxToast"></div>
        <div class="cx-status" id="cxStatus"></div>
        <div class="cx-tip" id="cxTip"></div>
      </section>
      <aside class="cx-side"><div class="cx-tabs" id="cxTabs"></div><div class="cx-panel" id="cxPanel"></div></aside>
    </div>
    <input type="file" id="cxFile" accept=".json,application/json" hidden>
    </div>`;
  }
  bindShell() {
    const $ = this.$;
    $('#cxSim').onclick = () => this.toggleSim();
    $('#cxUndo').onclick = () => this.undo(); $('#cxRedo').onclick = () => this.redo();
    $('#cxFileBtn').onclick = (e) => { e.stopPropagation(); $('#cxFileDD').classList.toggle('open'); };
    this.host.addEventListener('click', (e) => {
      if (!e.target.closest('.cx-menu')) $('#cxFileDD').classList.remove('open');
      const f = e.target.closest('[data-file]'); if (f) { $('#cxFileDD').classList.remove('open'); this.fileAction(f.dataset.file); }
      const t = e.target.closest('[data-tool]'); if (t) this.tool(t.dataset.tool);
      const wk = e.target.closest('[data-wkind]'); if (wk) { this.setWireKind(wk.dataset.wkind); if (wk.closest('#cxToast')) this.$('#cxToast').classList.remove('show'); }
      const wc = e.target.closest('#cxWBar [data-wcolor]'); if (wc) this.setWireColor(wc.dataset.wcolor);
      const tab = e.target.closest('[data-cxtab]'); if (tab) { this.tab = tab.dataset.cxtab; this.renderSide(); }
      const a = e.target.closest('[data-act]'); if (a) this.guideAction(a.dataset.act, a);
      const sz = e.target.closest('.cx-schem-wrap'); if (sz) { const o = document.createElement('div'); o.className = 'cx-overlay'; o.innerHTML = sz.innerHTML + '<div class="cx-ov-close">✕ Cerrar</div>'; o.onclick = () => o.remove(); this.host.querySelector('.cx').appendChild(o); }
    });
    $('#cxFile').onchange = (e) => { const f = e.target.files[0]; if (f) this.importFile(f); e.target.value = ''; };
    document.addEventListener('keydown', (e) => this.onKey(e));
    this.host.addEventListener('pointerdown', (e) => { const c = e.target.closest('[data-add]'); if (c && this.isEditor() && !this.readOnly) this.catalogDown(e, c); });
  }
  isEditor() { return this.host.querySelector('.cx').classList.contains('is-editor') && getComputedStyle(this.host).display !== 'none'; }

  show(view) {
    const root = this.$('.cx');
    if (this.running) this.toggleSim(false);
    if (this.readOnly) { this.readOnly = false; this.rev = null; this.view = null; root.classList.remove('is-ro'); }
    if (this.av) { this.av = null; this.view = null; }
    if (view === 'home') {
      this.view = 'home'; root.classList.add('is-home'); root.classList.remove('is-editor');
      this.$('#cxHome').innerHTML = this.homeHTML(); this.setCrumbs(); this.pause();
      this.$('#cxPTitle').innerHTML = '';
      return;
    }
    root.classList.remove('is-home'); root.classList.add('is-editor');
    if (!this.renderer) this.initScene();
    if (this.view !== view) {
      this.view = view; this.pr = PRACTICES.find(p => p.id === view) || null;
      this.sel = null; this.undoS = []; this.redoS = []; this.runtime = {};
      const saved = store.get('auto:' + view);
      this.model = saved?.model ? this.sanitize(saved.model) : { parts: [], wires: [] };
      const stale = this.pr && saved?.g && (saved.g.rev || 1) !== (this.pr.rev || 1);
      this.g = this.pr ? { idx: 0, map: {}, measured: {}, answers: {}, snap: null, ...(stale ? {} : saved?.g || {}), rev: this.pr.rev || 1 } : null;
      if (stale) setTimeout(() => this.toast('Esta práctica se ha actualizado (componentes con todas sus patas). Revisa tu montaje desde el paso 1.', 5000), 300);
      this.tab = this.pr ? 'guia' : 'comp';
      this.checkResult = null; this.showAnswers = false; this.qres = null;
      this.seq = 1 + Math.max(0, ...this.model.parts.map(p => +String(p.id).replace(/\D/g, '') || 0), ...this.model.wires.map(w => +String(w.id).replace(/\D/g, '') || 0));
      this.$('#cxPTitle').innerHTML = this.pr ? `<span class="cx-pn">${this.pr.n}</span><span class="cx-ptt">${esc(this.pr.title)}</span>` : '<span class="cx-pn">∞</span><span class="cx-ptt">Modo libre</span>';
      this.onResize(); this.sync(); this.evalGuide(true); this.renderSide(); this.renderInsp(); this.homeView(true); this.status(''); this.updateUndo(); this.renderWBar(); this.toolState(); this.renderPinLabels();
      if (saved?.model?.parts?.length) this.toast('Se ha recuperado tu último montaje.');
    }
    this.setCrumbs(); this.resume(); this.onResize();
  }
  // ------------------------------------------------------------ «Encuentra la avería»
  // def: { id, titulo, enunciado, montaje, averia:{elemento,tipo,valor?}, pistas, explicacion, calificable, entregada, entregar(resp) → Promise<string> }
  averia(def) {
    const root = this.$('.cx');
    if (this.running) this.toggleSim(false);
    if (this.readOnly) { this.readOnly = false; this.rev = null; root.classList.remove('is-ro'); }
    root.classList.remove('is-home'); root.classList.add('is-editor');
    if (!this.renderer) this.initScene();
    const view = 'averia-' + def.id; const nuevo = this.view !== view;
    this.av = def; this.avPista = 0;
    if (nuevo) {
      this.view = view; this.pr = null; this.g = null; this.sel = null; this.undoS = []; this.redoS = []; this.runtime = {};
      this.avResp = def.calificable ? null : (store.get('avr:' + view) || null); this.avTipo = null; this.avMsg = '';
      const saved = store.get('auto:' + view);
      this.model = this.sanitize(saved?.model || leerMontaje(def.montaje) || {});
      if (!this.model.parts.some(p => PARTS[p.type].meter)) this.model.parts.push({ id: 'M' + (1 + this.model.parts.filter(p => p.type === 'meter').length), type: 'meter', pos: [27, 0], rot: 0, props: { mode: 'V', jack: 'VΩmA' }, state: defaultState('meter') });
      this.tab = 'averia'; this.checkResult = null; this.showAnswers = false; this.qres = null;
      this.seq = 1 + Math.max(0, ...this.model.parts.map(p => +String(p.id).replace(/\D/g, '') || 0), ...this.model.wires.map(w => +String(w.id).replace(/\D/g, '') || 0));
      this.$('#cxPTitle').innerHTML = `<span class="cx-pn">${ic('search-check')}</span><span class="cx-ptt">${esc(def.titulo || 'Encuentra la avería')}</span>`;
    }
    this.model.averia = def.averia;
    if (nuevo) { this.onResize(); this.sync(); this.renderInsp(); this.homeView(true); this.status(''); this.updateUndo(); this.renderWBar(); this.toolState(); this.renderPinLabels(); }
    this.renderSide(); this.setCrumbs(); this.resume(); this.onResize();
  }
  averiaHTML() {
    const d = this.av, s = this.sel; const p = s?.kind === 'part' ? this.part(s.id) : null; const w = s?.kind === 'wire' ? this.model.wires.find(x => x.id === s.id) : null;
    const nombre = p ? `${esc(p.id)} · ${esc(PARTS[p.type].name)}` : w ? `Cable ${esc(w.id)}` : '';
    const tipos = Object.entries(TIPOS_AVERIA).filter(([k]) => (w ? k === 'cable' : k !== 'cable'));
    if (this.avTipo && !tipos.some(([k]) => k === this.avTipo)) this.avTipo = null;
    const r = this.avResp; const nomTipo = (k) => esc(TIPOS_AVERIA[k] || k);
    let h = `<h4 class="cx-avh">${ic('search-check')} Encuentra la avería</h4>${d.enunciado ? `<p>${esc(d.enunciado)}</p>` : ''}
      <ol class="cx-avpasos"><li>Pulsa <b>Iniciar simulación</b> y observa qué falla.</li><li>Mide con el polímetro: tensión (V), corriente (A) y, <b>sin alimentación</b>, resistencia (Ω) o continuidad (·))).</li><li>Haz clic en el componente o cable que crees averiado y elige qué le pasa.</li></ol>`;
    if (d.pistas?.length) h += `<div class="cx-avpistas">${d.pistas.slice(0, this.avPista).map((t, i) => `<p>${ic('lightbulb')} <b>Pista ${i + 1}:</b> ${esc(t)}</p>`).join('')}${this.avPista < d.pistas.length ? `<button class="cx-btn" data-act="avPista">${ic('lightbulb')} Ver una pista</button>` : ''}</div>`;
    h += `<div class="cx-avsel" role="status">Elemento señalado: <b>${nombre || 'ninguno (haz clic en un componente o un cable)'}</b></div>`;
    if (nombre) h += `<fieldset class="cx-avtipos"><legend>¿Qué le pasa?</legend>${tipos.map(([k, t]) => `<label><input type="radio" name="avTipo" value="${k}" ${this.avTipo === k ? 'checked' : ''}> ${esc(t)}</label>`).join('')}</fieldset>`;
    const listo = !!nombre && !!this.avTipo;
    if (d.calificable) {
      if (d.entregada) h += `<p class="cx-avok">${ic('circle-check')} Ya has entregado: ${esc(d.entregada)}</p>`;
      h += `<div class="cx-ibtns"><button class="cx-sim" data-act="avEntregar" ${listo && !this._entregando ? '' : 'disabled'}>${ic('send')} ${this._entregando ? 'Enviando…' : d.entregada ? 'Volver a entregar' : 'Entregar diagnóstico'}</button></div>
        <p class="cx-small">Tu profesor verá el elemento y el tipo de avería que señales. ${this.avMsg ? `<b>${esc(this.avMsg)}</b>` : ''}</p>`;
    } else {
      h += `<div class="cx-ibtns"><button class="cx-sim" data-act="avComprobar" ${listo ? '' : 'disabled'}>${ic('check')} Comprobar diagnóstico</button></div>`;
      if (r) h += r.elemento && r.tipo ? `<div class="cx-avres ok" role="status">${ic('circle-check')} <b>¡Avería encontrada!</b> ${esc(d.explicacion || '')}</div>`
        : `<div class="cx-avres" role="status">${ic('circle-x')} ${r.elemento ? 'Has acertado el elemento, pero no lo que le pasa. Vuelve a medir.' : 'Ese elemento funciona bien. Sigue midiendo.'}</div>`;
    }
    return h;
  }
  avDiagnostico() { const s = this.sel; if (!s || !this.avTipo) return null; return { elemento: s.id, tipo: this.avTipo }; }
  avAccion(act) {
    const d = this.av; if (!d) return;
    if (act === 'avPista') { this.avPista++; this.renderSide(); return; }
    const resp = this.avDiagnostico(); if (!resp) return;
    if (act === 'avComprobar') { const a = d.averia || {}; this.avResp = { elemento: resp.elemento === a.elemento, tipo: resp.elemento === a.elemento && resp.tipo === a.tipo }; store.set('avr:' + this.view, this.avResp); if (this.avResp.tipo) this.toast('¡Avería encontrada!', 4000); this.renderSide(); return; }
    if (act === 'avEntregar' && d.entregar) {
      this._entregando = true; this.avMsg = ''; this.renderSide();
      Promise.resolve(d.entregar(resp)).then((m) => { this._entregando = false; d.entregada = m || 'diagnóstico entregado'; this.avMsg = 'Entregado.'; this.renderSide(); }, (e) => { this._entregando = false; this.avMsg = 'No se ha podido entregar: ' + (e?.message || 'error'); this.renderSide(); });
    }
  }
  setCrumbs() {
    const base = `<a href="#inicio">Inicio</a> › <a href="#asignaturas">Asignaturas</a> › <a href="#asig/eee">${esc(this.opts.subject || 'Equipos eléctricos y electrónicos')}</a> › <a href="#asig/eee/laboratorio">Laboratorio</a> › `;
    const v = this.view;
    if (v === 'revision') { this.$('#cxCrumbs').innerHTML = `<a href="#panel">Panel del profesor</a> › <a href="#panel/entregas">Entregas</a> › <span>Revisión</span>`; this.$('#cxProf').innerHTML = portal()?.chipHTML?.() || ''; return; }
    this.$('#cxCrumbs').innerHTML = base + (v === 'home' ? '<span>Circuitos</span>' : `<a href="#eee/circuitos">Circuitos</a> › <span>${this.av ? 'Encuentra la avería: ' + esc(this.av.titulo || '') : this.pr ? 'Práctica ' + this.pr.n + ': ' + esc(this.pr.title) : 'Modo libre'}</span>`);
    this.$('#cxProf').innerHTML = (this.opts.profesor ? `Profesor: <b>${esc(this.opts.profesor)}</b>` : '') + (portal()?.chipHTML?.() || '');
  }
  homeHTML() {
    const done = (id) => store.get('done:' + id);
    const started = (id) => store.get('auto:' + id)?.model?.parts?.length;
    return `<div class="cx-hwrap">
      <section class="cx-hero"><div><h1>Laboratorio de <span>Circuitos</span></h1>
        <p>Monta circuitos eléctricos en una <b>protoboard 3D</b>, pulsa <b>▶ Iniciar simulación</b> y comprueba cómo se encienden los LED, lucen las bombillas, gira el motor o suena el zumbador. Mide con el <b>polímetro</b> como en el taller, sin miedo a romper nada.</p>
        <div class="cx-hbtns"><a class="cx-sim big" href="#eee/circuitos/c1">Empezar por la práctica 1 →</a><a class="cx-btn big" href="#eee/circuitos/libre">Modo libre</a></div></div>
        <div class="cx-hero-art">${LOGO}</div></section>
      <h2>Prácticas guiadas <small>de dificultad creciente</small></h2>
      <div class="cx-cards">${PRACTICES.map(p => `<a class="cx-card ${done(p.id) ? 'done' : ''}" href="#eee/circuitos/${p.id}">
        <div class="cx-card-h"><span class="cx-num">${p.n}</span><span class="cx-ic">${p.icon}</span>${done(p.id) ? '<span class="cx-badge ok">✔ Completada</span>' : started(p.id) ? '<span class="cx-badge">En curso</span>' : ''}</div>
        <h3>${esc(p.title)}</h3><div class="cx-sub">${esc(p.sub)}</div>
        <div class="cx-meta"><span>${esc(p.level)}</span><span>⏱ ${esc(p.duration)}</span><span>${Object.keys(p.ra).map(r => 'RA' + r).join(' · ')}</span></div></a>`).join('')}
        <a class="cx-card free" href="#eee/circuitos/libre"><div class="cx-card-h"><span class="cx-num">∞</span><span class="cx-ic">🛠️</span></div><h3>Modo libre</h3><div class="cx-sub">Monta lo que quieras con todos los componentes</div><div class="cx-meta"><span>Sin guía</span><span>Guarda y exporta</span></div></a>
        <a class="cx-card free" href="#eee/circuitos/averia-ejemplo"><div class="cx-card-h"><span class="cx-num">${ic('search-check')}</span></div><h3>Encuentra la avería</h3><div class="cx-sub">Un circuito con un componente estropeado: mide con el polímetro y descubre cuál es</div><div class="cx-meta"><span>Ejemplo</span><span>Polímetro y continuidad</span></div></a>
      </div>
      <h2>Cómo se usa</h2>
      <div class="cx-how">
        <div><b>1 · Coloca</b>Arrastra un componente desde el panel de la derecha hasta la protoboard. Se pincha solo en los agujeros. <kbd>R</kbd> lo gira, <kbd>Supr</kbd> lo borra.</div>
        <div><b>2 · Cablea</b>Elige el tipo de cable (Dupont macho o hembra, cocodrilo, banana, rígido) y haz clic en un agujero o borne y después en otro. Solo encaja donde encajaría de verdad. Color: teclas <kbd>0</kbd>–<kbd>9</kbd>.</div>
        <div><b>3 · Simula</b>Pulsa <b>▶ Iniciar simulación</b>. Haz clic en interruptores y pulsadores; mueve potenciómetros y la luz de la LDR desde su panel.</div>
        <div><b>4 · Mide</b>Saca el polímetro, elige V, A u Ω y arrastra sus puntas roja y negra. Tensión en paralelo, corriente en serie.</div>
        <div><b>Patas reales</b>Cada componente tiene sus patas de verdad: el interruptor 3, el pulsador 4 (unidas de dos en dos), el relé 5… Pasa el ratón por ellas para ver su nombre. <kbd>X</kbd> enseña las tiras de dentro de la protoboard.</div>
        <div><b>Cámara</b>Arrastra para girar, rueda o pellizco para acercar, botón derecho o dos dedos para desplazar. <kbd>T</kbd> vista desde arriba.</div>
      </div>
      <h2>Relación con el módulo 3015</h2>
      <div class="cx-tblw"><table class="cx-tbl"><tr><th>Práctica</th>${[1, 2, 3, 4, 5].map(r => `<th title="${esc(RA[r].t)}">RA${r}</th>`).join('')}</tr>
        ${PRACTICES.map(p => `<tr><td>${p.n}. ${esc(p.title)}</td>${[1, 2, 3, 4, 5].map(r => `<td class="c">${p.ra[r] ? p.ra[r].join(', ') : ''}</td>`).join('')}</tr>`).join('')}</table></div>
      <p class="cx-muted">${[1, 2, 3, 4, 5].map(r => `<b>RA${r}</b>: ${esc(RA_SHORT[r])}`).join(' · ')}. Letras = criterios de evaluación. Orden de 8 de noviembre de 2016 (BOJA nº 241), Anexo IV.</p>
      <p class="cx-muted">El simulador es una aproximación didáctica en corriente continua: los valores son muy cercanos a los reales, pero no sustituye las normas de seguridad del taller.</p>
    </div>`;
  }

  // ------------------------------------------------------------ escena 3D
  initScene() {
    const gl = this.$('#cxGL');
    const r = this.renderer = new THREE.WebGLRenderer({ antialias: true });
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    gl.appendChild(r.domElement);
    const sc = this.scene = new THREE.Scene(); sc.background = new THREE.Color(0xd3dfe0);
    // misma luz de estudio, reflejos PBR y sombra suave que el laboratorio ESP32 (kit3d/escena.js)
    const est = estudio(r, sc, { escala: 60, entorno: 0.5, sombrasSiempre: true, intPrincipal: 2.1, dir: [-40, 95, 55], bias: -0.0008, normalBias: 0.01 });
    const cam = this.camera = new THREE.PerspectiveCamera(36, 1, 1, 3000);
    const ctl = this.controls = new OrbitControls(cam, r.domElement);
    ctl.addEventListener('start', () => { this.userCam = true; cancelarVuelo(cam); });
    camaraSuave(ctl, { polarMax: Math.PI * 0.47, min: 12, max: 260 });
    ctl.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN };
    ctl.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN };
    const d = est.principal;
    const table = new THREE.Mesh(new THREE.PlaneGeometry(800, 800), new THREE.MeshStandardMaterial({ color: 0xcdbb9c, roughness: 0.85 }));
    table.rotation.x = -Math.PI / 2; table.position.y = -0.05; table.receiveShadow = true; sc.add(table);
    sc.add(buildMat());
    this.board = buildBreadboard(); sc.add(this.board);
    this.dirLight = d;
    this.partsG = new THREE.Group(); this.wiresG = new THREE.Group(); this.probesG = new THREE.Group(); this.ghostG = new THREE.Group(); this.fxG = new THREE.Group();
    sc.add(this.partsG, this.wiresG, this.probesG, this.ghostG, this.fxG);
    this.objs = new Map(); this.wobjs = new Map(); this.terms = [];
    const ringGeo = new THREE.RingGeometry(0.32, 0.5, 24); ringGeo.rotateX(-Math.PI / 2);
    this.hoverRings = new THREE.InstancedMesh(ringGeo, new THREE.MeshBasicMaterial({ color: 0x18c46a, transparent: true, opacity: 0.95, depthWrite: false }), 40); this.hoverRings.count = 0; this.hoverRings.renderOrder = 3; this.hoverRings.frustumCulled = false; sc.add(this.hoverRings);
    const g2 = new THREE.RingGeometry(0.42, 0.72, 28); g2.rotateX(-Math.PI / 2);
    this.guideRings = new THREE.InstancedMesh(g2, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95, depthWrite: false }), 16); this.guideRings.count = 0; this.guideRings.renderOrder = 3; this.guideRings.frustumCulled = false; sc.add(this.guideRings);
    this.guideRings.setColorAt(0, new THREE.Color(0xffffff));
    this.ghostMat = new THREE.MeshStandardMaterial({ color: 0xf5a524, transparent: true, opacity: 0.42, emissive: 0xf5a524, emissiveIntensity: 0.35, depthWrite: false });
    this.ray = new THREE.Raycaster(); this.ndc = new THREE.Vector2(); this.clock = new THREE.Clock(); this.t = 0;
    this.labels = []; this.pinLabels = [];
    // puntos de corriente (instanciados: muy ligeros)
    this.dots = new THREE.InstancedMesh(new THREE.SphereGeometry(0.2, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffd21a, transparent: true, opacity: 0.95, depthTest: true }), 900); this.dots.count = 0; this.dots.frustumCulled = false; this.dots.renderOrder = 6; sc.add(this.dots);
    this.flowPhase = new Map();
    this.applyQuality();
    const el = r.domElement; el.style.touchAction = 'none';
    el.addEventListener('pointerdown', (e) => this.onDown(e), true);
    el.addEventListener('pointermove', (e) => this.onMove(e));
    const poke = () => { this._act = this.t; };
    ['pointermove', 'pointerdown', 'wheel', 'touchstart'].forEach(ev => el.addEventListener(ev, poke, { passive: true })); window.addEventListener('keydown', poke); window.addEventListener('resize', poke); this.controls.addEventListener('change', poke);
    window.addEventListener('pagehide', () => { if (this._as) { clearTimeout(this._as); this._as = null; this.saveNow(); } });
    window.addEventListener('pointerup', (e) => this.onUp(e));
    window.addEventListener('pointercancel', (e) => this.onUp(e));
    el.addEventListener('pointerleave', () => { if (!this.drag && !this.pdrag) { this.hoverRings.count = 0; this.$('#cxTip').style.display = 'none'; } });
    el.addEventListener('contextmenu', (e) => e.preventDefault());
    el.addEventListener('wheel', (e) => { const p = this.sel?.kind === 'part' && this.part(this.sel.id); if (p && p.type === 'pot' && this.hitPart(e) === p.id) { e.preventDefault(); e.stopImmediatePropagation(); p.state.pos = Math.max(0, Math.min(1, (p.state.pos ?? 0.5) + (e.deltaY > 0 ? 0.04 : -0.04))); this.stateChanged(p); const rg = this.$('#cxInsp input[type=range]'); if (rg) rg.value = p.state.pos; } }, { capture: true, passive: false });
    new ResizeObserver(() => this.onResize()).observe(this.$('#cxView'));
    this.makeThumbs();
  }
  applyQuality() {
    if (!this.renderer) return; const hq = this.hq;
    this.renderer.setPixelRatio(hq ? Math.min(window.devicePixelRatio || 1, 2) : 1);
    this.renderer.shadowMap.enabled = hq; if (this.dirLight) this.dirLight.castShadow = hq;
    this.scene.traverse(o => { if (o.material) { const ms = Array.isArray(o.material) ? o.material : [o.material]; ms.forEach(m => m.needsUpdate = true); } });
    if (!hq) document.documentElement.classList.add('glass-lite');
    this.onResize?.(); const b = this.host.querySelector('[data-tool="hq"]'); if (b) b.classList.toggle('on', hq);
  }
  // si el ordenador va lento (Chromebook), baja la calidad automáticamente una vez
  watchPerf(dt) {
    if (this._perfDone || !this.hq) return; this._pf = this._pf || { n: 0, t: 0 }; this._pf.n++; this._pf.t += dt;
    if (this._pf.n >= 90) { const avg = this._pf.t / this._pf.n; this._pf = { n: 0, t: 0 }; if (avg > 0.045) { this._perfDone = true; this.hq = false; this.applyQuality(); this.status('Este ordenador va justo: he puesto la <b>calidad gráfica ligera</b> (botón ✦ para cambiarla).'); } else if (this.t > 20) this._perfDone = true; }
  }
  onResize() {
    this._force = true;
    if (!this.renderer) return; const v = this.$('#cxView'); const w = v.clientWidth || 800, h = v.clientHeight || 600;
    this.renderer.setSize(w, h, false); this.renderer.domElement.style.width = w + 'px'; this.renderer.domElement.style.height = h + 'px';
    const old = this.camera.aspect; this.camera.aspect = w / h; this.camera.updateProjectionMatrix();
    if (!this.userCam && Math.abs(old - w / h) > 0.02 && this.view && this.view !== 'home') this.homeView(true);
  }
  pause() { this.renderer?.setAnimationLoop(null); }
  resume() { this.renderer?.setAnimationLoop(() => this.frame()); }
  bounds() {
    // siempre deja sitio a los lados de la protoboard para la pila y el polímetro
    const b = new THREE.Box3(new THREE.Vector3(-32, 0, -BOARD_D / 2 - 1), new THREE.Vector3(32, BT, BOARD_D / 2 + 1));
    const add = (p) => { if (PARTS[p.type].board) return; const [w, d] = PARTS[p.type].size; const s = Math.max(w, d) / 2; b.expandByPoint(new THREE.Vector3(p.pos[0] - s, 0, p.pos[1] - s)); b.expandByPoint(new THREE.Vector3(p.pos[0] + s, 4, p.pos[1] + s)); };
    this.model.parts.forEach(add);
    if (this.pr) for (const st of this.pr.steps) if (st.place && st.place.pos) add(st.place);
    return b;
  }
  homeView(instant, top, suave) {
    this._force = true;
    const b = this.bounds(); const c = b.getCenter(new THREE.Vector3()); const sz = b.getSize(new THREE.Vector3());
    const aspect = this.camera.aspect || 1.6; const fov = this.camera.fov * Math.PI / 180;
    const need = Math.max(sz.z * (top ? 1.15 : 1.4), sz.x * 1.12 / aspect); const dist = need / 2 / Math.tan(fov / 2) + (top ? 4 : 10);
    const dir = top ? new THREE.Vector3(0, 1, 0.0001) : new THREE.Vector3(0, 1.15, 0.85).normalize();
    this.userCam = false; c.y = 0;
    const pos = c.clone().addScaledVector(dir, dist);
    if (suave && !instant) { volar(this.camera, this.controls, pos, c, 600); return; } // botones y teclas: transición suave como en ESP32
    cancelarVuelo(this.camera); this.camera.position.copy(pos); this.controls.target.copy(c); this.camera.lookAt(c); this.controls.update();
  }
  makeThumbs() {
    if (this.thumbs) return; this.thumbs = {};
    let rr; try { rr = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true }); } catch (e) { return; }
    rr.setSize(150, 110); rr.outputColorSpace = THREE.SRGBColorSpace; rr.toneMapping = THREE.ACESFilmicToneMapping;
    const sc = new THREE.Scene(); sc.add(new THREE.HemisphereLight(0xffffff, 0x8899aa, 1.6)); const d = new THREE.DirectionalLight(0xffffff, 1.8); d.position.set(-30, 60, 40); sc.add(d);
    const cam = new THREE.PerspectiveCamera(30, 150 / 110, 0.5, 500);
    try { const pm = new THREE.PMREMGenerator(rr); sc.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture; sc.environmentIntensity = 0.6; pm.dispose(); } catch (e) { }
    for (const type of Object.keys(PARTS)) {
      const part = { id: 'T', type, props: clone(PARTS[type].props || {}), state: defaultState(type), at: 'a1', rot: 0 };
      const g = buildPart(part); if (PARTS[type].board) g.position.y = -BT;
      g.traverse(c => { if (c.isSprite) c.visible = false; });
      sc.add(g); g.updateMatrixWorld(true);
      const b = new THREE.Box3(); g.traverse(c => { if (c.isMesh && c.visible && !(c.material.opacity === 0)) b.expandByObject(c); });
      const c = b.getCenter(new THREE.Vector3()); const s = b.getSize(new THREE.Vector3()).length();
      cam.position.copy(c).add(new THREE.Vector3(0.55, 0.8, 0.9).normalize().multiplyScalar(s * 1.6)); cam.lookAt(c);
      rr.render(sc, cam); this.thumbs[type] = rr.domElement.toDataURL('image/png');
      sc.remove(g);
    }
    rr.dispose(); rr.forceContextLoss?.();
  }

  // ------------------------------------------------------------ utilidades del modelo
  part(id) { return this.model.parts.find(p => p.id === id); }
  newId(prefix) { return prefix + (this.seq++); }
  sanitize(m) {
    // Estricto: un montaje puede venir de un archivo o de la entrega de un alumno → solo tipos y valores conocidos.
    m = m && typeof m === 'object' ? m : {};
    const num = (v, d) => (typeof v === 'number' || typeof v === 'string') && isFinite(+v) && String(v).trim() !== '' ? +v : d;
    const fix = (src, defs) => { const o = {}; for (const [k, d] of Object.entries(defs)) { const v = src?.[k]; o[k] = v === undefined ? d : typeof d === 'number' ? num(v, d) : typeof d === 'boolean' ? !!v : String(v).replace(/[^\p{L}\p{N}Ω .,+-]/gu, '').slice(0, 24); } return o; };
    const okId = (id) => typeof id === 'string' && /^[\w-]{1,16}$/.test(id);
    const xy = (a, d) => Array.isArray(a) && a.length === 2 ? [num(a[0], d[0]), num(a[1], d[1])] : d;
    const parts = (Array.isArray(m.parts) ? m.parts : []).filter(p => p && PARTS[p.type] && okId(p.id) && (PARTS[p.type].board ? typeof p.at === 'string' && !!parseHole(p.at) : Array.isArray(p.pos)))
      .slice(0, 200).map(p => { const def = PARTS[p.type]; const q = { id: p.id, type: p.type, rot: (num(p.rot, 0) | 0) & 3, props: fix(p.props, def.props || {}), state: fix(p.state, defaultState(p.type)) }; if (def.board) q.at = p.at; else q.pos = xy(p.pos, [0, 0]); return q; });
    for (const p of parts) if (PARTS[p.type].meter && !['VΩmA', '10A'].includes(p.props.jack)) p.props.jack = 'VΩmA';
    const valid = (k) => typeof k === 'string' && k.length < 40 && (k.startsWith('h:') ? !!parseHole(k.slice(2)) : parts.some(p => k.startsWith('p:' + p.id + ':') && /^[\w.+-]{1,12}$/.test(k.slice(p.id.length + 3))));
    for (const p of parts) if (PARTS[p.type].meter) { const src = (Array.isArray(m.parts) ? m.parts : []).find(x => x && x.id === p.id) || {}; p.probes = { red: valid(src.probes?.red) ? src.probes.red : null, com: valid(src.probes?.com) ? src.probes.com : null }; p.park = { red: xy(src.park?.red, [4, 15]), com: xy(src.park?.com, [-4, 15]) }; }
    const pm = { parts };
    // los montajes antiguos no guardaban el tipo de cable: se elige el adecuado para sus dos terminales
    return { parts, wires: (Array.isArray(m.wires) ? m.wires : []).filter(w => w && valid(w.a) && valid(w.b)).slice(0, 400).map((w, i) => { const sa = socketOf(w.a, pm), sb = socketOf(w.b, pm); return { id: okId(String(w.id)) ? String(w.id) : 'w' + (900 + i), a: w.a, b: w.b, color: WIRE_HEX[w.color] ? w.color : 'verde', kind: WIRE_KINDS[w.kind] && fitKind(w.kind, sa, sb) >= 0 ? w.kind : bestKind(sa, sb) }; }) };
  }
  termWorld(key) {
    if (key.startsWith('h:')) { const p = holePos(key.slice(2)); return new THREE.Vector3(p.x, BT, p.z); }
    const [, id, pin] = key.split(':'); const p = this.part(id); if (!p) return new THREE.Vector3();
    const def = PARTS[p.type];
    if (def.board) { const hs = partHoles(p); const h = hs && hs[pin]; if (h) { const q = holePos(h); return new THREE.Vector3(q.x, BT, q.z); } return new THREE.Vector3(); }
    const pd = def.pins.find(x => x[0] === pin); const [dx, dz] = rot(pd[1], pd[2], p.rot || 0);
    return new THREE.Vector3(p.pos[0] + dx, pd[3], p.pos[1] + dz);
  }
  termName(key) {
    if (key.startsWith('h:')) return holeName(key.slice(2));
    const [, id, pin] = key.split(':'); const p = this.part(id); if (!p) return key; const def = PARTS[p.type];
    return `${def.label(p)} · ${def.pinNames?.[pin] || pin}`;
  }
  occupied(exceptPart) {
    const s = new Map();
    for (const p of this.model.parts) { if (p.id === exceptPart || !PARTS[p.type].board) continue; const hs = partHoles(p); if (hs) for (const k in hs) s.set(hs[k], p.id); }
    for (const w of this.model.wires) for (const k of [w.a, w.b]) if (k.startsWith('h:')) s.set(k.slice(2), w.id);
    return s;
  }
  boardValid(p, exceptId) { const hs = partHoles(p); if (!hs) return false; const occ = this.occupied(exceptId); return Object.values(hs).every(h => !occ.has(h)); }
  tableValid(p, exceptId) {
    const r = this.footRect(p);
    const ov = (a, b) => a.x1 < b.x2 && a.x2 > b.x1 && a.z1 < b.z2 && a.z2 > b.z1;
    if (ov(r, { x1: -BOARD_W / 2 - 0.5, x2: BOARD_W / 2 + 0.5, z1: -BOARD_D / 2 - 0.5, z2: BOARD_D / 2 + 0.5 })) return false;
    return !this.model.parts.some(q => q.id !== exceptId && !PARTS[q.type].board && ov(r, this.footRect(q)));
  }
  footRect(p) { let [w, d] = PARTS[p.type].size; if ((p.rot || 0) % 2) [w, d] = [d, w]; return { x1: p.pos[0] - w / 2, x2: p.pos[0] + w / 2, z1: p.pos[1] - d / 2, z2: p.pos[1] + d / 2 }; }
  pinCentroid(type, r) { const pins = PARTS[type].pins; let x = 0, z = 0; for (const [, dx, dz] of pins) { const [a, b] = rot(dx, dz, r); x += a; z += b; } return [x / pins.length, z / pins.length]; }

  snapshot() { return JSON.stringify(this.model); }
  commit(fn) {
    if (this.readOnly) { this.toast('Revisión de una entrega: el montaje es de solo lectura.'); return false; }
    if (this.running && !this._liveOK) { this.toast('Detén la simulación para cambiar el montaje.'); return false; }
    this.undoS.push(this.snapshot()); if (this.undoS.length > 120) this.undoS.shift(); this.redoS = [];
    fn(); this.afterChange(); return true;
  }
  afterChange() { this.sync(); this.autosave(); this.evalGuide(); this.renderInsp(); this.updateUndo(); this.renderPinLabels(); this._force = true; }
  undo() { if (this.readOnly || this.running || !this.undoS.length) return; this.redoS.push(this.snapshot()); this.model = JSON.parse(this.undoS.pop()); this.sel = null; this.afterChange(); }
  redo() { if (this.readOnly || this.running || !this.redoS.length) return; this.undoS.push(this.snapshot()); this.model = JSON.parse(this.redoS.pop()); this.sel = null; this.afterChange(); }
  updateUndo() { this.$('#cxUndo').disabled = this.readOnly || this.running || !this.undoS.length; this.$('#cxRedo').disabled = this.readOnly || this.running || !this.redoS.length; }
  autosave() { if (this._as) return; this._as = setTimeout(() => { this._as = null; this.saveNow(); }, 250); }
  saveNow() { if (!this.readOnly && this.view && this.view !== 'home') store.set('auto:' + this.view, { model: this.model, g: this.g ? { idx: this.g.idx, map: this.g.map, measured: this.g.measured, answers: this.g.answers, rev: this.g.rev } : null }); }

  sync() {
    this._force = true;
    if (!this.renderer) return;
    const seen = new Set(); this.terms = [];
    for (const p of this.model.parts) {
      seen.add(p.id);
      const key = JSON.stringify([p.type, p.at, p.pos, p.rot, p.props]);
      let o = this.objs.get(p.id);
      if (!o || o.key !== key) {
        if (o) { if (o.box) { this.fxG.remove(o.box); o.box = null; } this.disposeObj(this.partsG, o.g); }
        const g = buildPart(p); g.userData.partId = p.id; this.place(g, p);
        this.partsG.add(g); o = { key, g, hits: terminalHits(p, g) }; this.objs.set(p.id, o);
      }
      o.g.userData.update?.(this.lastSim?.res?.[p.id] || {}, this.runtime[p.id] || {}, this.t, 0);
      this.terms.push(...o.hits);
    }
    for (const [id, o] of this.objs) if (!seen.has(id)) { if (o.box) this.fxG.remove(o.box); this.disposeObj(this.partsG, o.g); this.objs.delete(id); }
    const wseen = new Set();
    for (const w of this.model.wires) {
      wseen.add(w.id);
      const a = this.termWorld(w.a), b = this.termWorld(w.b);
      const selw = this.sel?.kind === 'wire' && this.sel.id === w.id;
      const ends = this.wireEnds(w);
      const key = [w.color, ends.join(''), a.toArray().map(v => v.toFixed(2)), b.toArray().map(v => v.toFixed(2)), selw].join('|');
      let o = this.wobjs.get(w.id);
      if (!o || o.key !== key) {
        if (o) this.disposeObj(this.wiresG, o.g);
        const g = buildWire(a, b, wireHex(w.color), { ends });
        if (selw) g.add(buildWire(a, b, '#ffffff', { ends, mat: new THREE.MeshBasicMaterial({ color: 0x14a3a8, transparent: true, opacity: 0.35, depthWrite: false }), r: 0.7 }));
        g.traverse(c => c.userData.wireId = w.id);
        this.wiresG.add(g); this.wobjs.set(w.id, o = { key, g, curve: g.userData.curve, len: g.userData.curve.getLength() });
      }
    }
    for (const [id, o] of this.wobjs) if (!wseen.has(id)) { this.disposeObj(this.wiresG, o.g); this.wobjs.delete(id); }
    this.syncProbes(); this.syncSelection(); this.updateGhost();
  }
  wireKindOf(w) { const sa = socketOf(w.a, this.model), sb = socketOf(w.b, this.model); return WIRE_KINDS[w.kind] && fitKind(w.kind, sa, sb) >= 0 ? w.kind : bestKind(sa, sb); }
  wireEnds(w) { const k = this.wireKindOf(w); const sa = socketOf(w.a, this.model), sb = socketOf(w.b, this.model); const o = fitKind(k, sa, sb); const e = WIRE_KINDS[k].ends; return o === 1 ? [e[1], e[0]] : [e[0], e[1]]; }
  place(g, p) {
    if (PARTS[p.type].board) { const h = holePos(p.at) || { x: 0, z: 0 }; g.position.set(h.x, 0, h.z); }
    else g.position.set(p.pos[0], 0, p.pos[1]);
    g.rotation.y = -(p.rot || 0) * Math.PI / 2;
  }
  disposeObj(parent, g) { parent.remove(g); g.traverse(c => { if (c.geometry) c.geometry.dispose(); }); }
  syncProbes() {
    for (const c of [...this.probesG.children]) this.disposeObj(this.probesG, c);
    for (const p of this.model.parts) {
      if (!PARTS[p.type].meter) continue;
      for (const [pin, col] of [['red', 0xd62020], ['com', 0x1c1c1c]]) {
        const tip = this.probeTip(p, pin);
        const g = buildProbe(col); g.position.copy(tip).setY(tip.y + 0.25); g.traverse(c => c.userData.probe = { id: p.id, pin }); this.probesG.add(g);
        const jack = this.termWorld(`p:${p.id}:${pin}`).setY(2.7);
        if (pin === 'red' && p.props.jack === '10A') { const [dx, dz] = rot(3.6, 9.4, p.rot || 0); jack.set(p.pos[0] + dx, 2.7, p.pos[1] + dz); }
        const top = tip.clone().setY(tip.y + 5.0);
        const mid = jack.clone().lerp(top, 0.5); mid.y = Math.max(jack.y, top.y) + 3;
        const curve = new THREE.CatmullRomCurve3([jack, jack.clone().setY(jack.y + 2), mid, top.clone().setY(top.y + 1.5), top]);
        const lead = new THREE.Mesh(new THREE.TubeGeometry(curve, 30, 0.2, 6), M(col, { roughness: 0.5 })); lead.castShadow = true; this.probesG.add(lead);
      }
    }
  }
  probeTip(p, pin) {
    if (this.pdrag && this.pdrag.id === p.id && this.pdrag.pin === pin && this.pdrag.pos) return this.pdrag.pos.clone();
    const k = p.probes?.[pin]; if (k) return this.termWorld(k);
    const park = p.park?.[pin] || (pin === 'red' ? [4, 15] : [-4, 15]); return new THREE.Vector3(p.pos[0] + park[0], 0, p.pos[1] + park[1]);
  }
  syncSelection() {
    this._force = true;
    for (const [id, o] of this.objs) {
      const on = this.sel?.kind === 'part' && this.sel.id === id;
      if (on && !o.box) { o.box = new THREE.BoxHelper(o.g.userData.inner, 0x14a3a8); o.box.material.depthTest = false; o.box.material.transparent = true; o.box.renderOrder = 4; this.fxG.add(o.box); }
      if (on && o.box) o.box.update();
      if (!on && o.box) { this.fxG.remove(o.box); o.box.geometry.dispose(); o.box = null; }
    }
  }

  frame() {
    const dt = Math.min(0.1, this.clock.getDelta()); this.t += dt;
    if (this.running) this.simStep(dt);
    this.controls.update();
    if (this.guideRings.count) {
      const s = 1 + 0.25 * Math.sin(this.t * 6); const m = new THREE.Matrix4(), p = new THREE.Vector3(), q = new THREE.Quaternion(), sc = new THREE.Vector3();
      for (let i = 0; i < this.guideRings.count; i++) { this.guideRings.getMatrixAt(i, m); m.decompose(p, q, sc); const k = s * (this.ringScale?.[i] || 1); m.compose(p, q, sc.set(k, 1, k)); this.guideRings.setMatrixAt(i, m); }
      this.guideRings.instanceMatrix.needsUpdate = true;
    }
    if (this.ghostG.children.length) this.ghostMat.opacity = 0.3 + 0.16 * Math.sin(this.t * 5);
    if (this._force) { this._force = false; this._act = this.t; }
    // En reposo (nada se mueve) no se redibuja: ahorra batería y CPU en Chromebooks
    if (!this.running && !this.guideRings.count && !this.ghostG.children.length && this.t - (this._act ?? -9) > 1.5) return;
    this.updateDots(dt);
    this.renderer.render(this.scene, this.camera);
    this.layoutLabels(); this.watchPerf(dt);
  }
  // Puntos amarillos que recorren los cables y las tiras de la protoboard en el sentido convencional de la corriente (+ → −)
  updateDots(dt) {
    const r = this.lastSim, D = this.dots;
    if (!r || !this.running || !this.showFlow) { if (D.count) { D.count = 0; D.instanceMatrix.needsUpdate = true; } return; }
    const m = new THREE.Matrix4(), MAX = 900, SP = 1.7; let n = 0;
    const speed = (i) => Math.max(1.2, Math.min(14, 3 + 3.2 * Math.log10(Math.abs(i) / 1e-3)));
    const run = (key, len, i, at) => {
      if (!(Math.abs(i) > 2e-5) || !isFinite(i) || len < 0.2) return;
      const ph = ((this.flowPhase.get(key) || 0) + speed(i) * dt) % SP; this.flowPhase.set(key, ph);
      for (let s = ph; s < len && n < MAX; s += SP) { const u = i > 0 ? s / len : 1 - s / len; const p = at(u); m.makeTranslation(p.x, p.y, p.z); D.setMatrixAt(n++, m); }
    };
    for (const w of this.model.wires) { const o = this.wobjs.get(w.id); if (o) run(w.id, o.len, r.wireI?.[w.id], (u) => o.curve.getPointAt(u)); }
    // por dentro de la protoboard: de la pata por la que entra la corriente a la pata por la que sale
    const strips = new Map();
    for (const e of r.edges || []) if (e.kind === 'strip' && Math.abs(e.flow) > 2e-5) { const k = e.b; if (!strips.has(k)) strips.set(k, []); strips.get(k).push({ h: e.hole, f: e.flow }); }
    const y = this.xray ? BT - 0.9 : BT + 0.12;
    for (const [k, list] of strips) {
      const src = list.filter(x => x.f > 0).map(x => ({ ...x })), snk = list.filter(x => x.f < 0).map(x => ({ ...x, f: -x.f }));
      for (const a of src) for (const b of snk) {
        const f = Math.min(a.f, b.f); if (f < 2e-5) continue; a.f -= f; b.f -= f;
        const A = holePos(a.h), B = holePos(b.h); const len = Math.hypot(A.x - B.x, A.z - B.z);
        run(k + a.h + b.h, len, f, (u) => new THREE.Vector3(A.x + (B.x - A.x) * u, y, A.z + (B.z - A.z) * u));
      }
    }
    D.count = n; D.instanceMatrix.needsUpdate = true;
  }
  simStep(dt) {
    this._acc = (this._acc || 0) + dt;
    const hasCap = this.model.parts.some(p => p.type === 'cap');
    if (this._acc < 1 / 30 && !this._force) { this.animParts(dt); return; }
    const sdt = Math.max(this._acc, 1 / 60); this._acc = 0; this._force = false;
    if (this.av) this.model.averia = this.av.averia;
    const r = simulate(this.model, this.runtime, { dt: hasCap ? sdt : Infinity, capV: this.capV, don: this.don });
    this.capV = r.capV; this.don = r.don; this.lastSim = r;
    for (const p of this.model.parts) {
      const res = r.res[p.id] || {}, st = this.runtime[p.id] || (this.runtime[p.id] = {});
      if (['led', 'rgb', 'diode', 'npn'].includes(p.type) && res.burn && !st.burnt) { st.acc = (st.acc || 0) + sdt; if (st.acc > 0.15) { st.burnt = true; this.smoke(p); this.toast({ led: '💥 ¡El LED se ha fundido! Le ha pasado demasiada corriente: pon una resistencia en serie.', rgb: '💥 ¡El LED RGB se ha fundido! Cada color necesita su propia resistencia.', diode: '💥 El diodo se ha quemado.', npn: '💥 ¡El transistor se ha quemado! Pon una resistencia en la base y no le pidas más de 100 mA.' }[p.type], 5000); this._force = true; } }
      if (p.type === 'relay' && !!res.on !== !!st._was) { st._was = !!res.on; this.buzz.click(); }
      if (p.type === 'bulb' && res.burn && !st.burnt) { st.burnt = true; this.smoke(p); this.toast('💥 La bombilla se ha fundido: recibe demasiada tensión.', 5000); this._force = true; }
      if (PARTS[p.type].meter && res.meter?.over && !st.fuse) { st.fuse = true; this.toast(res.meter.jack === '10A' ? '⚠ Se ha fundido el fusible de 10 A del polímetro: has medido corriente (A) en paralelo.' : '⚠ Se ha fundido el fusible de 200 mA del polímetro: has medido corriente (A) en paralelo o más de 200 mA en el borne VΩmA. La corriente se mide en serie; para corrientes grandes usa el borne 10A.', 6000); this._force = true; }
    }
    const al = r.warnings.map(w => w.msg);
    for (const p of this.model.parts) if (p.type === 'led' && this.runtime[p.id]?.burnt) al.push('LED fundido: detén la simulación, revisa el circuito y vuelve a probar.');
    for (const p of this.model.parts) if (PARTS[p.type].meter && r.res[p.id]?.meter?.wrongJack) al.push('La punta roja del polímetro está en el borne 10A y la rueda en ' + p.props.mode + ': por ese borne el polímetro es casi un cable. Para medir V u Ω pásala al borne VΩmA.');
    for (const p of this.model.parts) if (PARTS[p.type].meter && r.res[p.id]?.meter?.powered && (p.props.mode === 'Ω' || p.props.mode === '·)))')) al.push(p.props.mode === 'Ω' ? 'Para medir resistencias (Ω) quita la alimentación: con tensión la medida no es fiable y el polímetro se puede dañar.' : 'Para comprobar continuidad (·))) quita la alimentación: con tensión la prueba no es fiable y el polímetro se puede dañar.');
    this.setAlert([...new Set(al)]);
    let vol = 0; for (const p of this.model.parts) if (p.type === 'buzzer' && r.res[p.id]?.on) vol = Math.max(vol, r.res[p.id].vol);
    for (const p of this.model.parts) if (PARTS[p.type].meter && r.res[p.id]?.meter?.beep) vol = Math.max(vol, 0.6); // continuidad: pita
    this.buzz.set(vol);
    this.animParts(sdt);
    this._gacc = (this._gacc || 0) + sdt; if (this._gacc > 0.25) { this._gacc = 0; this.evalGuide(); this.updateInspLive(); }
  }
  animParts(dt) { const r = this.lastSim; for (const p of this.model.parts) { const o = this.objs.get(p.id); o?.g.userData.update?.(r?.res?.[p.id] || {}, this.runtime[p.id] || {}, this.t, dt); } }
  toggleSim(force) {
    const on = force ?? !this.running;
    if (on === this.running) return;
    if (on) {
      this.cancelWire(); this.cancelDrag(); this.running = true; this.runtime = {}; this.capV = {}; this.don = {}; this.lastSim = null; this._force = true; this.buzz.ensure(); this.buzz.ctx?.resume?.();
      this.$('#cxSim').classList.add('on'); this.$('#cxSim').innerHTML = '■ Detener simulación';
      this.$('.cx').classList.add('sim-on'); this.status('Simulación en marcha: haz clic en interruptores y pulsadores, ajusta potenciómetros y la LDR en su panel, y coloca las puntas del polímetro.');
      this.simStep(1 / 30);
    } else {
      this.running = false; this.runtime = {}; this.lastSim = null; this.buzz.set(0);
      this.$('#cxSim').classList.remove('on'); this.$('#cxSim').innerHTML = '▶ Iniciar simulación'; this.$('.cx').classList.remove('sim-on');
      for (const p of this.model.parts) if ((p.type === 'button' || p.type === 'tact') && p.state) p.state.pressed = false;
      this.dots.count = 0;
      this.setAlert([]); this.status('');
      for (const p of this.model.parts) this.objs.get(p.id)?.g.userData.update?.({}, {}, 0, 0);
    }
    this.updateUndo(); this.evalGuide(); this.renderInsp(); this.updateGhost();
  }
  smoke(p) {
    const o = this.objs.get(p.id); if (!o) return; const pos = new THREE.Vector3(); o.g.getWorldPosition(pos);
    for (let i = 0; i < 6; i++) {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0x555555, transparent: true, opacity: 0.6, depthWrite: false })); s.position.copy(pos).add(new THREE.Vector3(0.5, BT + 4, 0)); s.scale.setScalar(1.2); this.fxG.add(s);
      const t0 = performance.now() + i * 120; const tick = () => { const k = (performance.now() - t0) / 1600; if (k < 0) return requestAnimationFrame(tick); if (k > 1) { this.fxG.remove(s); return; } s.position.y += 0.06; s.position.x += Math.sin(k * 9 + i) * 0.02; s.scale.setScalar(1.2 + k * 3); s.material.opacity = 0.6 * (1 - k); requestAnimationFrame(tick); }; tick();
    }
  }

  // ------------------------------------------------------------ interacción con el ratón / táctil
  setNDC(e) { const r = this.renderer.domElement.getBoundingClientRect(); this.ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); this.ray.setFromCamera(this.ndc, this.camera); }
  hitPart(e) { if (e) this.setNDC(e); const hit = this.ray.intersectObjects(this.partsG.children, true).find(h => !h.object.userData.term && h.object.isMesh); if (!hit) return null; let o = hit.object; while (o && !o.userData.partId) o = o.parent; return o?.userData.partId || null; }
  hitProbe() { const h = this.ray.intersectObjects(this.probesG.children, true).find(x => x.object.userData.probe); return h ? h.object.userData.probe : null; }
  hitTerm() { const h = this.ray.intersectObjects(this.terms, false)[0]; return h ? h.object.userData.term : null; }
  hitWire() { const h = this.ray.intersectObjects(this.wiresG.children, true)[0]; return h ? h.object.userData.wireId : null; }
  planeAt(y) { const p = new THREE.Vector3(); return this.ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), -y), p) ? p : null; }
  holeUnder() { const p = this.planeAt(BT); if (!p || Math.abs(p.x) > BOARD_W / 2 || Math.abs(p.z) > BOARD_D / 2) return null; return holeAt(p.x, p.z, 0.5); }

  onDown(e) {
    if (!this.isEditor()) return;
    if (this.readOnly && !this.running) return;
    this.setNDC(e);
    this.down = { x: e.clientX, y: e.clientY, moved: false, id: e.pointerId };
    if (e.button === 2) { if (this.wiring) { this.cancelWire(); this.controls.enabled = false; this.down.consumed = true; } return; }
    if (e.button !== 0) return;
    const pr = this.readOnly ? null : this.hitProbe();
    if (pr) { this.controls.enabled = false; this.pdrag = { ...pr, pos: null }; this.select({ kind: 'part', id: pr.id }); return; }
    const term = this.running ? null : this.hitTerm();
    if (term) { this.controls.enabled = false; this.down.term = term; return; }
    // con un cable a medio tender, los agujeros libres tienen prioridad (aunque una pieza los tape en la vista)
    if (this.wiring) { const h = this.holeUnder(); if (h && !this.occupied().has(h)) { this.controls.enabled = false; this.down.hole = h; return; } }
    const pid = this.hitPart();
    if (pid) {
      this.controls.enabled = false; this.down.part = pid;
      const p = this.part(pid);
      if (this.running && (p.type === 'button' || p.type === 'tact')) { p.state.pressed = true; this.pressing = p; this.stateChanged(p, true); }
      return;
    }
    const w = this.hitWire(); if (w) this.down.wire = w;
    this.down.hole = this.holeUnder();
    if (this.wiring && this.down.hole) this.controls.enabled = false;
  }
  onMove(e) {
    if (!this.renderer || !this.isEditor()) return;
    this.setNDC(e); this.lastPtr = e;
    if (this.down && Math.hypot(e.clientX - this.down.x, e.clientY - this.down.y) > 5) this.down.moved = true;
    if (this.pdrag) { this.moveProbe(); return; }
    if (this.cat) return;
    if (!this.readOnly && this.down?.part && this.down.moved && (!this.running || PARTS[this.part(this.down.part)?.type]?.meter) && !this.drag) this.beginDrag(this.part(this.down.part), false);
    if (this.drag) { this.updateDrag(); return; }
    if (!this.down || !this.down.moved) this.hover();
  }
  onUp(e) {
    if (!this.renderer) return;
    if (!this.down && !this.drag && !this.pdrag) { this.controls.enabled = true; return; }
    const d = this.down || {}; this.down = null;
    if (this.pressing) { this.pressing.state.pressed = false; this.stateChanged(this.pressing, true); this.pressing = null; }
    if (this.pdrag) { this.finishProbe(); this.controls.enabled = true; return; }
    if (this.drag && !this.cat) { this.finishDrag(); this.controls.enabled = true; return; }
    this.controls.enabled = true;
    if (d.consumed || d.moved) return;
    if (d.part) {
      const p = this.part(d.part);
      if (this.running && p && (p.type === 'switch' || p.type === 'spdt' || p.type === 'slide')) { if (p.type === 'switch') p.state.closed = !p.state.closed; else p.state.pos = p.state.pos ? 0 : 1; this.buzz.click(); this.stateChanged(p, true); }
      this.select({ kind: 'part', id: d.part }); return;
    }
    if (!this.running && (d.term || d.hole)) { this.wireClick(d.term || 'h:' + d.hole); return; }
    if (d.wire) { this.select({ kind: 'wire', id: d.wire }); return; }
    if (this.wiring) { this.cancelWire(); return; }
    this.select(null);
  }
  stateChanged(p, quick) { this._force = true; this.objs.get(p.id)?.g.userData.update?.(this.lastSim?.res?.[p.id] || {}, this.runtime[p.id] || {}, this.t, 0); this.autosave(); this.evalGuide(); if (quick) this.renderInsp(); else this.updateInspLive(); }
  hover() {
    const tip = this.$('#cxTip');
    let hole = null, text = '';
    const term = this.running ? null : this.hitTerm();
    if (term) text = esc(this.termName(term));
    else {
      const pid = this.hitPart();
      if (pid) {
        const p = this.part(pid), def = PARTS[p.type]; text = '<b>' + esc(def.label(p)) + '</b>' + (this.running ? this.liveText(p, true) : '');
        const pin = this.pinUnder(p);
        if (pin) { const hs = partHoles(p); hole = hs?.[pin.id] || null; text = `<b>${esc(def.pinNames?.[pin.id] || 'pata ' + pin.id)}</b> · ${esc(def.name)}${hole ? ' · en <b>' + esc(holeName(hole)) + '</b>' : ''}${def.pinDesc?.[pin.id] ? '<br>' + esc(def.pinDesc[pin.id]) : ''}${this.running && this.lastSim?.res?.[p.id]?.pinI ? '<br>I por esta pata: ' + esc(fmtSI(Math.abs(this.lastSim.res[p.id].pinI[pin.id] || 0), 'A')) : ''}`; }
      }
      else { hole = this.holeUnder(); if (hole) text = `<b>${esc(holeName(hole))}</b> · unido con: ${esc(stripName(stripOf(hole)))}`; }
    }
    this.showStrip(hole);
    if (this.wiring) this.rubber(term ? this.termWorld(term) : hole ? this.termWorld('h:' + hole) : this.planeAt(BT) || this.planeAt(0));
    if (text && this.lastPtr) { const r = this.$('#cxView').getBoundingClientRect(); tip.innerHTML = text; tip.style.display = 'block'; tip.style.left = Math.min(r.width - 220, this.lastPtr.clientX - r.left + 14) + 'px'; tip.style.top = (this.lastPtr.clientY - r.top + 16) + 'px'; }
    else tip.style.display = 'none';
  }
  // Pata de una pieza de protoboard más cercana al puntero (para mostrar su nombre)
  pinUnder(p) {
    const def = PARTS[p.type]; if (!def.board) return null; const hs = partHoles(p); if (!hs) return null;
    let best = null, bd = 1.1;
    for (const y of [BT + 0.6, BT + 1.6]) { const q = this.planeAt(y); if (!q) continue; for (const id in hs) { const h = holePos(hs[id]); const d = Math.hypot(h.x - q.x, h.z - q.z); if (d < bd) { bd = d; best = { id }; } } }
    return best;
  }
  renderPinLabels() {
    if (!this.renderer) return;
    this.pinLabels.forEach(l => l.el.remove()); this.pinLabels = [];
    const show = this.showPins ? this.model.parts : this.sel?.kind === 'part' ? [this.part(this.sel.id)].filter(Boolean) : [];
    for (const p of show) {
      const def = PARTS[p.type]; if (def.meter) continue;
      for (const [pin] of def.pins) {
        const k = termKey(p, pin); const v = this.termWorld(k);
        const nm = (def.pinNames?.[pin] || pin).replace(/ \(.*$/, '').replace(/ · .*$/, '');
        const el = document.createElement('div'); el.className = 'cx-plab' + (/[+]|ánodo|^COM|común/.test(nm) ? ' pos' : /−|cátodo|GND/.test(nm) ? ' neg' : ''); el.textContent = nm;
        this.$('#cxLabels').appendChild(el); this.pinLabels.push({ el, pos: v.clone().setY(v.y + (def.board ? 0.15 : 0.8)), pin: true });
      }
    }
  }
  showStrip(hole) {
    const m = new THREE.Matrix4(); let n = 0;
    if (hole) for (const h of holesOfStrip(stripOf(hole))) { const p = holePos(h); m.makeTranslation(p.x, BT + 0.03, p.z); if (h === hole) m.scale(new THREE.Vector3(1.35, 1, 1.35)); this.hoverRings.setMatrixAt(n++, m); if (n >= 40) break; }
    this.hoverRings.count = n; this.hoverRings.instanceMatrix.needsUpdate = true;
  }

  // ------------------------------------------------------------ cables
  canEndAt(key) {
    if (!key.startsWith('h:')) return true;
    const h = key.slice(2);
    if (this.occupied().has(h)) { this.toast(`El agujero ${holeName(h)} ya está ocupado. Usa otro agujero de la misma columna: están unidos por dentro.`); return false; }
    return true;
  }
  autoColor(key) { return /:\+$|^h:(tp|bp)/.test(key) ? 'rojo' : /:-$|^h:(tn|bn)/.test(key) ? 'negro' : null; }
  kindButtons(list) { return list.map(k => `<button class="cx-kbtn" data-wkind="${k}">${esc(WIRE_KINDS[k].name)}</button>`).join(' '); }
  wireClick(key) {
    const sk = socketOf(key, this.model), K = WIRE_KINDS[this.wireKind];
    if (!this.wiring) {
      if (!this.canEndAt(key)) return;
      if (!canStart(this.wireKind, sk)) {
        const ok = startKinds(sk);
        this.toast(`❌ El cable <b>${esc(K.name)}</b> no se puede conectar en ${esc(SOCKETS[sk].name)}: ${esc(whyNot(this.wireKind, sk, sk).replace(/\.$/, ''))}.<br>Elige: ${this.kindButtons(ok)}`, 7000);
        return;
      }
      this.wiring = { a: key, color: this.autoColor(key) || this.wireColor };
      this.status(`Cable <b>${esc(K.name)}</b> desde <b>${esc(this.termName(key))}</b>. Haz clic en el destino (Esc o clic derecho para cancelar).`);
      this.rubber(this.termWorld(key));
      return;
    }
    if (key === this.wiring.a) { this.cancelWire(); return; }
    if (!this.canEndAt(key)) return;
    const a = this.wiring.a, sa = socketOf(a, this.model);
    if (fitKind(this.wireKind, sa, sk) < 0) {
      const ok = validKinds(sa, sk);
      this.toast(`❌ Con un cable <b>${esc(K.name)}</b> no se puede unir ${esc(SOCKETS[sa].name)} con ${esc(SOCKETS[sk].name)}. ${esc(whyNot(this.wireKind, sa, sk))}${ok.length ? '<br>Para estos dos terminales sirve: ' + this.kindButtons(ok) : ''}`, 8000);
      return;
    }
    const color = this.autoColor(a) || this.autoColor(key) || this.wiring.color;
    this.cancelWire();
    const id = this.newId('w');
    this.commit(() => this.model.wires.push({ id, a, b: key, color, kind: this.wireKind }));
    this.select({ kind: 'wire', id });
    this.status('Cable colocado. Pulsa una tecla del <b>0</b> al <b>9</b> para cambiar su color.');
  }
  setWireKind(k) {
    if (!WIRE_KINDS[k]) return; this.wireKind = k;
    if (this.sel?.kind === 'wire' && !this.running && !this.readOnly) { const w = this.model.wires.find(x => x.id === this.sel.id); if (w && this.wireKindOf(w) !== k) { if (fitKind(k, socketOf(w.a, this.model), socketOf(w.b, this.model)) >= 0) this.commit(() => { w.kind = k; }); else this.toast('Ese tipo de cable no encaja en los terminales de este cable. ' + esc(whyNot(k, socketOf(w.a, this.model), socketOf(w.b, this.model)))); } }
    if (this.wiring && !canStart(k, socketOf(this.wiring.a, this.model))) this.cancelWire();
    this.renderWBar(); this.renderInsp();
  }
  renderWBar() {
    const el = this.$('#cxWBar'); if (!el) return;
    const K = WIRE_KINDS[this.wireKind];
    el.innerHTML = `<div class="cx-wb-t">🔌 Cable</div><div class="cx-wb-k">${Object.entries(WIRE_KINDS).map(([k, d]) => `<button data-wkind="${k}" class="${k === this.wireKind ? 'on' : ''}" title="${esc(d.name + ': ' + d.desc)}"><i class="cx-kico k-${k}"></i><span>${esc(d.icon)}</span></button>`).join('')}</div>
      <div class="cx-wb-n"><b>${esc(K.name)}</b> · ${esc(END[K.ends[0]].short)} / ${esc(END[K.ends[1]].short)}</div>
      <div class="cx-wb-c">${WIRE_COLORS.map(([n, h], i) => `<button title="${n} (tecla ${i})" class="${this.wireColor === n ? 'on' : ''}" style="background:${h}" data-wcolor="${n}"></button>`).join('')}</div>`;
  }
  rubber(to) {
    if (!this.wiring || !to) return;
    if (this.rubberObj) this.disposeObj(this.fxG, this.rubberObj);
    const e = WIRE_KINDS[this.wireKind].ends; const sa = socketOf(this.wiring.a, this.model); const ea = SOCKETS[sa].accepts.includes(e[0]) ? e[0] : e[1]; const eb = ea === e[0] ? e[1] : e[0];
    this.rubberObj = buildWire(this.termWorld(this.wiring.a), to, wireHex(this.wiring.color), { ends: [ea, eb], mat: M(new THREE.Color(wireHex(this.wiring.color)).getHex(), { transparent: true, opacity: 0.7 }), r: 0.28 });
    this.fxG.add(this.rubberObj);
  }
  cancelWire() { if (!this.wiring && !this.rubberObj) return; this.wiring = null; if (this.rubberObj) { this.disposeObj(this.fxG, this.rubberObj); this.rubberObj = null; } this.status(''); }
  setWireColor(c) {
    this.wireColor = c;
    if (this.sel?.kind === 'wire' && !this.running) { const w = this.model.wires.find(x => x.id === this.sel.id); if (w && w.color !== c) this.commit(() => { w.color = c; }); }
    if (this.wiring) { this.wiring.color = c; }
    this.renderInsp(); this.renderWBar();
  }

  // ------------------------------------------------------------ puntas del polímetro
  probeTarget() {
    const term = this.hitTerm(); if (term) return { key: term, pos: this.termWorld(term) };
    const h = this.holeUnder(); if (h) return { key: 'h:' + h, pos: this.termWorld('h:' + h) };
    return { key: null, pos: this.planeAt(0) };
  }
  moveProbe() { const t = this.probeTarget(); if (!t.pos) return; this.pdrag.pos = t.pos; this.pdrag.key = t.key; this.showStrip(t.key?.startsWith('h:') ? t.key.slice(2) : null); this.syncProbes(); }
  finishProbe() {
    const d = this.pdrag; this.pdrag = null; const p = this.part(d.id); if (!p) return;
    if (!d.pos) { this.syncProbes(); return; }
    this.setProbe(p, d.pin, d.key, d.pos);
  }
  setProbe(p, pin, key, pos) {
    const was = this._liveOK; this._liveOK = true;
    this.commit(() => {
      p.probes = p.probes || {}; p.probes[pin] = key || null;
      if (!key && pos) { p.park = p.park || {}; p.park[pin] = [+(pos.x - p.pos[0]).toFixed(2), +(pos.z - p.pos[1]).toFixed(2)]; }
    });
    this._liveOK = was; this._force = true; this.showStrip(null);
    if (key) this.status(`Punta ${pin === 'red' ? 'roja' : 'negra'} en <b>${esc(this.termName(key))}</b>.`);
  }

  // ------------------------------------------------------------ arrastrar piezas
  catalogDown(e, card) {
    if (this.running && card.dataset.add !== 'meter') { this.toast('Detén la simulación para añadir componentes (el polímetro sí se puede sacar).'); return; }
    if (e.button !== undefined && e.button !== 0) return;
    e.preventDefault();
    const type = card.dataset.add; const props = card.dataset.props ? JSON.parse(card.dataset.props) : {};
    this.cat = { type, props, x: e.clientX, y: e.clientY, moved: false };
    const mv = (ev) => {
      if (!this.cat) return;
      if (Math.hypot(ev.clientX - this.cat.x, ev.clientY - this.cat.y) > 6) this.cat.moved = true;
      const r = this.renderer.domElement.getBoundingClientRect();
      const inside = ev.clientX >= r.left && ev.clientX <= r.right && ev.clientY >= r.top && ev.clientY <= r.bottom;
      this.setNDC(ev);
      if (inside && this.cat.moved && !this.drag) this.beginDrag(this.freshPart(type, props), true);
      if (this.drag) { this.drag.outside = !inside; this.drag.g.visible = inside; this.drag.shadow.visible = inside; this.updateDrag(); }
    };
    const up = () => {
      document.removeEventListener('pointermove', mv); document.removeEventListener('pointerup', up); document.removeEventListener('pointercancel', up);
      const c = this.cat; this.cat = null;
      if (this.drag) { if (this.drag.outside) this.cancelDrag(); else this.finishDrag(); return; }
      if (c && !c.moved) this.autoPlace(this.freshPart(type, props));
    };
    document.addEventListener('pointermove', mv); document.addEventListener('pointerup', up); document.addEventListener('pointercancel', up);
  }
  freshPart(type, props = {}) {
    const def = PARTS[type]; const id = this.newId(ID_PREFIX[type] || 'X');
    const p = { id, type, rot: 0, props: { ...clone(def.props || {}), ...props }, state: defaultState(type) };
    if (def.board) p.at = 'a1'; else p.pos = [0, 0];
    if (def.meter) { p.probes = { red: null, com: null }; p.park = { red: [4, 15], com: [-4, 15] }; }
    return p;
  }
  autoPlace(p, at) {
    const def = PARTS[p.type];
    if (at) { p.rot = at.rot || 0; if (def.board) p.at = at.at; else p.pos = [...at.pos]; }
    else if (def.board) {
      const order = []; for (const r of ['c', 'h', 'b', 'g', 'd', 'i', 'a', 'f', 'e', 'j']) for (let k = 0; k < 30; k++) { const c = 15 + (k % 2 ? -1 : 1) * Math.ceil(k / 2); if (c >= 1 && c <= 30) order.push(r + c); }
      const ok = order.find(h => { p.at = h; return this.boardValid(p); }); if (!ok) { this.toast('No queda sitio libre en la protoboard.'); return null; }
    } else {
      const cands = []; for (let r = 0; r < 6; r++) for (const [x, z] of [[-30, 0], [30, 0], [-30, -16], [30, -16], [-30, 16], [30, 16], [0, -26], [0, 26], [-48, 0], [48, 0]]) cands.push([x * (1 + r * 0.4), z * (1 + r * 0.25)]);
      const ok = cands.find(c => { p.pos = c; return this.tableValid(p); }); if (!ok) p.pos = [0, 40];
    }
    const live = this._liveOK; if (def.meter) this._liveOK = true;
    this.commit(() => this.model.parts.push(p)); this._liveOK = live; this.select({ kind: 'part', id: p.id });
    if (!def.board) this.ensureVisible(p);
    return p;
  }
  ensureVisible(p) {
    const [w, d] = PARTS[p.type].size; const pts = [[-w / 2, -d / 2], [w / 2, -d / 2], [-w / 2, d / 2], [w / 2, d / 2]];
    const out = pts.some(([dx, dz]) => { const v = new THREE.Vector3(p.pos[0] + dx, 12, p.pos[1] + dz).project(this.camera); return Math.abs(v.x) > 0.97 || Math.abs(v.y) > 0.97; });
    if (out) this.homeView();
  }
  beginDrag(p, isNew) {
    if (!p) return;
    this.cancelWire();
    const g = isNew ? buildPart(p) : this.objs.get(p.id).g;
    if (isNew) { g.userData.partId = p.id; this.fxG.add(g); }
    const work = clone(p), def = PARTS[p.type];
    const hit = this.planeAt(def.board ? BT : 0);
    let off = [0, 0];
    if (!isNew && hit) { const c = this.partCenter(work); off = [c[0] - hit.x, c[1] - hit.z]; }
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ color: 0x18c46a, transparent: true, opacity: 0.35, depthWrite: false })); shadow.rotation.x = -Math.PI / 2; shadow.renderOrder = 2; this.fxG.add(shadow);
    this.drag = { p: work, orig: p, isNew, g, off, shadow, valid: false };
    if (!isNew) this.select({ kind: 'part', id: p.id }, true);
    this.status('Suelta la pieza en la protoboard. <b>R</b> o ⟳ la gira.');
    this.updateGhost(); this.updateDrag();
  }
  partCenter(p) { const def = PARTS[p.type]; if (!def.board) return [...p.pos]; const h = holePos(p.at); const [cx, cz] = this.pinCentroid(p.type, p.rot || 0); return [h.x + cx, h.z + cz]; }
  updateDrag() {
    const d = this.drag; if (!d) return; const p = d.p, def = PARTS[p.type];
    const hit = this.planeAt(def.board ? BT : 0); if (!hit) return;
    const cx = hit.x + d.off[0], cz = hit.z + d.off[1];
    if (def.board) {
      const [ox, oz] = this.pinCentroid(p.type, p.rot || 0);
      const ax = cx - ox, az = cz - oz;
      let at = holeAt(ax, az, 0.5);
      if (!at) { let best = null, bd = 1.6; for (const dz of [-1, 1, -2, 2]) { const h = holeAt(ax, az + dz, 0.5); if (h) { const q = holePos(h); const dd = Math.hypot(q.x - ax, q.z - az); if (dd < bd) { bd = dd; best = h; } } } at = best; }
      if (at) { p.at = at; d.valid = this.boardValid(p, d.isNew ? null : p.id); const q = holePos(at); d.g.position.set(q.x, 0, q.z); d.shadow.position.set(q.x + ox, BT + 0.05, q.z + oz); }
      else { d.valid = false; d.g.position.set(ax, 0, az); d.shadow.position.set(cx, BT + 0.05, cz); }
      d.g.rotation.y = -(p.rot || 0) * Math.PI / 2;
      const [w, dd] = this.partFoot(p); d.shadow.scale.set(w, dd, 1);
      const hs = d.valid ? partHoles(p) : null;
      this.status(hs ? 'Patas en: <b>' + Object.values(hs).map(h => esc(holeName(h))).join(' · ') + '</b>' : 'Busca agujeros libres en la protoboard.');
    } else {
      p.pos = [Math.round(cx * 2) / 2, Math.round(cz * 2) / 2]; d.g.position.set(p.pos[0], 0, p.pos[1]); d.g.rotation.y = -(p.rot || 0) * Math.PI / 2;
      d.valid = this.tableValid(p, d.isNew ? null : p.id);
      const r = this.footRect(p); d.shadow.scale.set(r.x2 - r.x1, r.z2 - r.z1, 1); d.shadow.position.set(p.pos[0], 0.06, p.pos[1]);
    }
    d.shadow.material.color.set(d.valid ? 0x18c46a : 0xe0383e);
  }
  partFoot(p) { const def = PARTS[p.type]; const xs = def.pins.map(([, dx, dz]) => rot(dx, dz, p.rot || 0)); const X = xs.map(a => a[0]), Z = xs.map(a => a[1]); return [Math.max(...X) - Math.min(...X) + 1.6, Math.max(...Z) - Math.min(...Z) + 1.6]; }
  finishDrag() {
    const d = this.drag; this.drag = null; if (!d) return; this.disposeObj(this.fxG, d.shadow);
    if (d.isNew) this.disposeObj(this.fxG, d.g);
    if (!d.valid) {
      if (!d.isNew) this.place(d.g, d.orig);
      this.toast(PARTS[d.p.type].board ? 'Ahí no se puede: pincha la pieza en agujeros libres de la protoboard.' : 'Ahí no cabe: deja las piezas de mesa fuera de la protoboard y sin solaparse.');
      this.status(''); this.updateGhost(); return;
    }
    const live = this._liveOK; if (PARTS[d.p.type].meter) this._liveOK = true;
    if (d.isNew) { this.commit(() => this.model.parts.push(d.p)); this.select({ kind: 'part', id: d.p.id }); }
    else this.commit(() => { const p = this.part(d.p.id); p.rot = d.p.rot; if (PARTS[p.type].board) p.at = d.p.at; else p.pos = d.p.pos; });
    this._liveOK = live; this.status('');
  }
  cancelDrag() { const d = this.drag; this.drag = null; if (!d) return; this.disposeObj(this.fxG, d.shadow); if (d.isNew) this.disposeObj(this.fxG, d.g); else this.place(d.g, d.orig); this.status(''); this.updateGhost(); }

  rotateSel() {
    if (this.drag) { this.drag.p.rot = ((this.drag.p.rot || 0) + 1) % 4; this.updateDrag(); return; }
    if (this.sel?.kind !== 'part') return this.toast('Selecciona primero una pieza para girarla.');
    if (this.running) return this.toast('Detén la simulación para girar piezas.');
    const p = this.part(this.sel.id), def = PARTS[p.type]; const q = clone(p); q.rot = ((p.rot || 0) + 1) % 4;
    if (def.board) {
      const [cx, cz] = this.partCenter(p); const [ox, oz] = this.pinCentroid(q.type, q.rot);
      const tries = [[0, 0], [0.5, 0.5], [-0.5, -0.5], [0.5, -0.5], [-0.5, 0.5], [1, 0], [-1, 0], [0, 1], [0, -1], [1.5, 0.5], [-1.5, -0.5], [0, 2], [0, -2]];
      const ok = tries.find(([dx, dz]) => { const h = holeAt(cx - ox + dx, cz - oz + dz, 0.3); if (!h) return false; q.at = h; return this.boardValid(q, p.id); });
      if (!ok) return this.toast('No cabe girada en ese sitio. Muévela a una zona más despejada.');
    } else if (!this.tableValid(q, p.id)) return this.toast('No cabe girada ahí.');
    this.commit(() => { p.rot = q.rot; if (def.board) p.at = q.at; });
  }
  deleteSel() {
    if (!this.sel) return this.toast('Selecciona una pieza o un cable para borrarlo.');
    if (this.running) return this.toast('Detén la simulación para borrar.');
    const s = this.sel; this.select(null, true);
    this.commit(() => {
      if (s.kind === 'wire') this.model.wires = this.model.wires.filter(w => w.id !== s.id);
      else {
        this.model.parts = this.model.parts.filter(p => p.id !== s.id);
        this.model.wires = this.model.wires.filter(w => !w.a.startsWith('p:' + s.id + ':') && !w.b.startsWith('p:' + s.id + ':'));
        for (const m of this.model.parts) if (m.probes) for (const k of ['red', 'com']) if (m.probes[k]?.startsWith('p:' + s.id + ':')) m.probes[k] = null;
      }
    });
  }
  select(s, quiet) {
    const wasWire = this.sel?.kind === 'wire'; this.sel = s;
    if (this.renderer) { if (wasWire || s?.kind === 'wire') this.sync(); else this.syncSelection(); this.renderPinLabels(); }
    if (!quiet) this.renderInsp();
    if (this.av && this.tab === 'averia' && !this.readOnly) this.renderSide();
  }

  // ------------------------------------------------------------ herramientas y teclado
  tool(t) {
    if (t === 'rotate') this.rotateSel(); else if (t === 'del') this.deleteSel();
    else if (t === 'home' || t === 'fit') this.homeView(false, false, true); else if (t === 'top') this.homeView(false, true, true);
    else if (t === 'sound') { this.buzz.muted = !this.buzz.muted; this.host.querySelector('[data-tool="sound"]').textContent = this.buzz.muted ? ICON.mute : ICON.sound; }
    else if (t === 'help') { this.tab = 'ayuda'; this.renderSide(); }
    else if (t === 'flow') { this.showFlow = !this.showFlow; store.set('pref:flow', this.showFlow); this.updateDots(0); this._force = true; this.toolState(); this.toast(this.showFlow ? '⚡ Corriente visible: los puntos amarillos van del + al − (sentido convencional). Más rápidos = más corriente.' : 'Corriente oculta.'); this.toolState(); }
    else if (t === 'xray') { this.xray = !this.xray; this.board.userData.setXray(this.xray); this.toolState(); if (this.xray) this.toast('▦ Por dentro: cada columna de 5 agujeros (a–e, f–j) es una tira metálica, y los carriles + y − recorren toda la placa.'); }
    else if (t === 'pins') { this.showPins = !this.showPins; this.toolState(); this.renderPinLabels(); }
    else if (t === 'hq') { this.hq = !this.hq; this._perfDone = true; store.set('pref:hq', this.hq); this.applyQuality(); this.toolState(); }
  }
  toolState() { const T = (k, on) => this.host.querySelector(`[data-tool="${k}"]`)?.classList.toggle('on', !!on); T('flow', this.showFlow); T('xray', this.xray); T('pins', this.showPins); T('hq', this.hq); }
  onKey(e) {
    if (!this.isEditor() || e.target.closest?.('input,textarea,select')) return;
    const k = e.key;
    if ((e.ctrlKey || e.metaKey) && k.toLowerCase() === 'z') { e.preventDefault(); e.shiftKey ? this.redo() : this.undo(); return; }
    if ((e.ctrlKey || e.metaKey) && k.toLowerCase() === 'y') { e.preventDefault(); this.redo(); return; }
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (k === 'r' || k === 'R') this.rotateSel();
    else if (k === 'Delete' || k === 'Backspace') { e.preventDefault(); this.deleteSel(); }
    else if (k === 'Escape') { this.cancelWire(); this.cancelDrag(); this.select(null); }
    else if (k === 'h' || k === 'H' || k === 'f' || k === 'F') this.homeView(false, false, true); else if (k === 't' || k === 'T') this.homeView(false, true, true);
    else if (/^[0-9]$/.test(k)) this.setWireColor(WIRE_COLORS[+k][0]);
    else if (k === 'x' || k === 'X') this.tool('xray'); else if (k === 'n' || k === 'N') this.tool('pins'); else if (k === 'c' || k === 'C') this.tool('flow');
  }

  // ------------------------------------------------------------ mensajes
  status(html) { const s = this.$('#cxStatus'); s.innerHTML = html || (this.running ? 'Simulación en marcha.' : this.readOnly ? 'Revisión de una entrega · <b>solo lectura</b>: gira la vista y pulsa ▶ Iniciar simulación para verla funcionar.' : 'Arrastra componentes desde el panel · clic en un agujero y luego en otro para tender un cable · <b>R</b> girar · <b>Supr</b> borrar'); }
  toast(msg, ms = 3200) { const t = this.$('#cxToast'); t.innerHTML = msg; t.classList.add('show'); clearTimeout(this._tt); this._tt = setTimeout(() => t.classList.remove('show'), ms); }
  setAlert(list) { const a = this.$('#cxAlert'); const k = list.join('|'); if (k === this._alk) return; this._alk = k; a.innerHTML = list.map(m => `<div>⚠ ${esc(m)}</div>`).join(''); a.style.display = list.length ? 'block' : 'none'; }

  // ------------------------------------------------------------ inspector de propiedades
  liveText(p, br) {
    const r = this.lastSim?.res?.[p.id]; if (!r) return '';
    const V = (v) => fmtSI(v, 'V'), A = (i) => fmtSI(i, 'A');
    let t = '';
    switch (p.type) {
      case 'resistor': t = `V = ${V(Math.abs(r.v))} · I = ${A(Math.abs(r.i))} · P = ${fmtSI(Math.abs(r.p), 'W')}`; break;
      case 'led': t = this.runtime[p.id]?.burnt ? '💥 Fundido' : `V = ${V(r.v)} · I = ${A(Math.max(0, r.i))} · ${r.on ? (r.over ? '⚠ demasiada corriente' : 'encendido') : 'apagado'}`; break;
      case 'bulb': t = this.runtime[p.id]?.burnt ? '💥 Fundida' : `V = ${V(Math.abs(r.v))} · I = ${A(Math.abs(r.i))} · brillo ${Math.round(Math.min(1, r.bright) * 100)} %`; break;
      case 'motor': t = `V = ${V(r.v)} · I = ${A(r.i)} · ${Math.abs(r.speed) > 0.05 ? (r.speed > 0 ? 'gira ↻' : 'gira ↺') : 'parado'}`; break;
      case 'buzzer': t = `V = ${V(r.v)} · I = ${A(Math.max(0, r.i))} · ${r.on ? '🔊 suena' : 'en silencio'}`; break;
      case 'diode': t = `V = ${V(r.v)} · I = ${A(Math.max(0, r.i))}`; break;
      case 'pot': t = `V(1→cursor) = ${V(Math.abs(r.v1w))} · V(cursor→2) = ${V(Math.abs(r.vw2))}`; break;
      case 'ldr': t = `R = ${fmtOhm(Math.pow(10, 6 - 3.3 * (p.state?.light ?? 0.5)))} · I = ${A(Math.abs(r.i))}`; break;
      case 'cap': t = `V = ${V(r.v)}`; break;
      case 'meter': t = r.meter ? `Lectura: ${r.meter.text}` : ''; break;
      case 'rgb': t = this.runtime[p.id]?.burnt ? '💥 Fundido' : `R ${Math.round(Math.min(1, r.ch?.[0] || 0) * 100)} % · G ${Math.round(Math.min(1, r.ch?.[1] || 0) * 100)} % · B ${Math.round(Math.min(1, r.ch?.[2] || 0) * 100)} %`; break;
      case 'npn': t = this.runtime[p.id]?.burnt ? '💥 Quemado' : `Ib = ${A(r.ib)} · Ic = ${A(Math.max(0, r.ic))} · Vce = ${V(r.vce)} · ${r.mode}`; break;
      case 'relay': t = `Bobina: ${V(Math.abs(r.coilV))}, ${A(Math.abs(r.coilI))} · ${r.on ? 'ACTIVADO (COM–NO)' : 'en reposo (COM–NC)'}`; break;
      case 'tact': t = `${p.state?.pressed ? 'Pulsado: pares 1–2 y 3–4 unidos' : 'Sin pulsar'} · I por el contacto = ${A(r.contactI || 0)}`; break;
      case 'slide': case 'spdt': t = `Común unido con la pata ${p.state?.pos ? 2 : 1} · I = ${A(r.contactI || 0)}`; break;
      case 'servo': t = r.powered ? (r.target != null ? `Ángulo pedido: ${Math.round(r.target)}°` : 'Alimentado, sin señal') : 'Sin alimentación (necesita 4,8–6 V)'; break;
      case 'stester': t = r.pw ? `Encendido · mando a ${r.angle}°` : 'Sin alimentación'; break;
      default: if (PARTS[p.type].source) t = r.short ? '⚠ CORTOCIRCUITO' : `V = ${V(r.v)} · I = ${A(r.i)}`;
    }
    return t ? (br ? '<br>' : '') + esc(t) : '';
  }
  renderInsp() {
    const box = this.$('#cxInsp'); if (!box) return;
    const s = this.sel;
    if (!s) { box.style.display = 'none'; box.innerHTML = ''; return; }
    if (s.kind === 'wire') {
      const w = this.model.wires.find(x => x.id === s.id); if (!w) { box.style.display = 'none'; return; }
      box.style.display = 'block';
      box.innerHTML = `<div class="cx-ih"><b>Cable</b><button class="cx-x" data-act="desel" title="Cerrar">✕</button></div>
        <div class="cx-small">De <b>${esc(this.termName(w.a))}</b><br>a <b>${esc(this.termName(w.b))}</b></div>
        ${(() => { const k = this.wireKindOf(w), e = this.wireEnds(w), ok = validKinds(socketOf(w.a, this.model), socketOf(w.b, this.model)); const i = this.running ? this.lastSim?.wireI?.[w.id] : null; return `<div class="cx-lab">Tipo de cable</div><div class="cx-small"><b>${esc(WIRE_KINDS[k].name)}</b>: ${esc(END[e[0]].short)} en un lado y ${esc(END[e[1]].short)} en el otro.</div>${ok.length > 1 && !this.running ? `<div class="cx-kinds">${ok.map(x => `<button class="cx-kbtn ${x === k ? 'on' : ''}" data-wkind="${x}">${esc(WIRE_KINDS[x].name)}</button>`).join('')}</div>` : ''}${i != null ? `<div class="cx-live">I = ${esc(fmtSI(Math.abs(i), 'A'))}${Math.abs(i) > 2e-5 ? (i > 0 ? ' (del primer extremo al segundo)' : ' (del segundo extremo al primero)') : ' · no pasa corriente'}</div>` : ''}`; })()}
        <div class="cx-lab">Color (teclas 0–9)</div><div class="cx-colors">${WIRE_COLORS.map(([n, h], i) => `<button title="${n} (${i})" class="${w.color === n ? 'on' : ''}" style="background:${h}" data-wcolor="${n}" ${this.running ? 'disabled' : ''}></button>`).join('')}</div>
        <div class="cx-ibtns"><button class="cx-btn" data-tool="del" ${this.running ? 'disabled' : ''}>🗑 Borrar cable</button></div>`;
      box.querySelectorAll('[data-wcolor]').forEach(b => b.onclick = () => this.setWireColor(b.dataset.wcolor));
      return;
    }
    const p = this.part(s.id); if (!p) { box.style.display = 'none'; return; }
    const def = PARTS[p.type]; box.style.display = 'block';
    let h = `<div class="cx-ih"><b>${esc(def.name)}</b><span class="cx-id">${esc(p.id)}</span><button class="cx-x" data-act="desel" title="Cerrar">✕</button></div><div class="cx-small">${esc(def.desc)}</div>`;
    for (const u of def.ui || []) {
      const val = u.state ? p.state?.[u.k] : p.props[u.k];
      const dis = this.running && !u.live ? 'disabled' : '';
      h += `<div class="cx-lab">${esc(u.label)}</div>`;
      if (u.type === 'res') {
        const b = resistorBands(val);
        h += `<div class="cx-row"><select data-prop="r" ${dis}>${E12.map(v => `<option value="${v}" ${v === val ? 'selected' : ''}>${fmtOhm(v)}</option>`).join('')}${E12.includes(val) ? '' : `<option selected value="${val}">${fmtOhm(val)}</option>`}</select>
          <input type="number" min="1" max="10000000" step="1" value="${val}" data-prop="r" title="Otro valor en Ω" ${dis}><span class="cx-unit">Ω</span></div>
          <div class="cx-bands">${b.hex.map((c, i) => `<span style="background:${c}" title="${b.names[i]}"></span>`).join('')}<em>${b.names.join(' · ')} (±5 %)</em></div>`;
      } else if (u.type === 'select') h += `<select data-prop="${u.k}" ${dis}>${u.options.map(o => `<option value="${o}" ${String(o) === String(val) ? 'selected' : ''}>${u.fmt ? u.fmt(o) : o}</option>`).join('')}</select>`;
      else if (u.type === 'range') h += `<div class="cx-row"><span class="cx-mini">${p.type === 'ldr' ? '🌑' : '◀'}</span><input type="range" min="0" max="1" step="0.01" value="${val ?? 0.5}" data-state="${u.k}"><span class="cx-mini">${p.type === 'ldr' ? '☀️' : '▶'}</span></div>`;
      else if (u.type === 'number') h += `<div class="cx-row"><input type="number" min="${u.min}" max="${u.max}" step="${u.step}" value="${val}" data-prop="${u.k}"><span class="cx-unit">V</span></div>`;
      else if (u.type === 'seg') h += `<div class="cx-seg">${u.options.map(o => `<button data-seg="${u.k}" data-v="${o}" class="${val === o ? 'on' : ''}">${o}</button>`).join('')}</div>`;
    }
    if (p.type === 'switch' || p.type === 'spdt' || p.type === 'slide') h += `<div class="cx-ibtns"><button class="cx-btn" data-act="toggle">⇄ Cambiar posición</button><span class="cx-small">${esc(def.label(p))}</span></div>`;
    if (p.type === 'button' || p.type === 'tact') h += `<div class="cx-small">Con la simulación en marcha, mantén pulsado el botón con el ratón o el dedo.</div>`;
    if (def.meter) h += `<div class="cx-small">Arrastra la <b style="color:#d62020">punta roja</b> y la <b>punta negra</b> hasta los agujeros o bornes que quieras medir.</div><div class="cx-ibtns"><button class="cx-btn" data-act="parkprobes">↩ Recoger puntas</button></div>`;
    h += this.pinsHTML(p);
    h += `<div class="cx-live" id="cxLive">${this.running ? this.liveText(p) : ''}</div>`;
    h += `<div class="cx-ibtns"><button class="cx-btn" data-tool="rotate" ${this.running ? 'disabled' : ''}>⟳ Girar</button><button class="cx-btn" data-tool="del" ${this.running ? 'disabled' : ''}>🗑 Borrar</button></div>`;
    box.innerHTML = h;
    box.querySelectorAll('[data-prop]').forEach(el => el.onchange = () => {
      const k = el.dataset.prop; let v = el.value;
      if (p.type === 'resistor') v = Math.max(1, Math.min(1e7, Math.round(+v) || 220));
      else if (p.type === 'supply') v = Math.max(0, Math.min(12, +v || 0));
      else if (p.type === 'pot' || p.type === 'cap') v = +v;
      this._liveOK = this.running; this.commit(() => { p.props[k] = v; }); this._liveOK = false; this._force = true;
    });
    box.querySelectorAll('[data-state]').forEach(el => { el.oninput = () => { p.state[el.dataset.state] = +el.value; this.stateChanged(p); }; });
    box.querySelectorAll('[data-seg]').forEach(el => el.onclick = () => { this._liveOK = true; this.commit(() => { p.props[el.dataset.seg] = el.dataset.v; }); this._liveOK = false; if (this.runtime[p.id]) this.runtime[p.id].fuse = false; this._force = true; });
  }
  // Tabla de patas: nombre, función, dónde está pinchada y uniones internas
  pinsHTML(p) {
    const def = PARTS[p.type]; if (def.meter) return '';
    const hs = def.board ? partHoles(p) : null; const r = this.running ? this.lastSim?.res?.[p.id] : null;
    const conn = (pin) => { if (hs) return hs[pin] ? holeName(hs[pin]) : 'sin pinchar'; const k = termKey(p, pin); const ws = this.model.wires.filter(w => w.a === k || w.b === k); return ws.length ? ws.map(w => esc(WIRE_KINDS[this.wireKindOf(w)].name)).join(', ') : `libre · ${SOCKETS[def.sockets?.[pin] || 'lug'].name}`; };
    let h = `<div class="cx-lab">Patas (${def.pins.length})</div><table class="cx-ptbl">${def.pins.map(([pin]) => `<tr><td><b>${esc(def.pinNames?.[pin] || pin)}</b>${def.pinDesc?.[pin] ? `<div class="cx-small">${esc(def.pinDesc[pin])}</div>` : ''}</td><td class="c">${esc(conn(pin))}${r?.pinI ? `<div class="cx-small">${esc(fmtSI(Math.abs(r.pinI[pin] || 0), 'A'))}</div>` : ''}</td></tr>`).join('')}</table>`;
    const fixed = def.internal ? def.internal(p) : [];
    const sw = def.merges ? def.merges(p, this.runtime[p.id] || {}) : [];
    if (fixed.length || def.merges) h += `<div class="cx-small cx-int">${fixed.map(([a, b]) => `<span>🔗 ${esc(def.pinNames?.[a] || a)} ↔ ${esc(def.pinNames?.[b] || b)} <i>(siempre, por dentro)</i></span>`).join('')}${sw.length ? sw.map(([a, b]) => `<span class="now">⚡ Ahora unidas: ${esc(def.pinNames?.[a] || a)} ↔ ${esc(def.pinNames?.[b] || b)}</span>`).join('') : def.merges ? '<span class="now">○ Contacto abierto: no une ninguna pata</span>' : ''}</div>`;
    return h;
  }
  updateInspLive() { const el = this.$('#cxLive'); if (el && this.sel?.kind === 'part') { const p = this.part(this.sel.id); if (p) { el.innerHTML = this.running ? this.liveText(p) : ''; const t = this.$('#cxInsp .cx-ptbl'); if (t && this.running) { const n = document.createElement('div'); n.innerHTML = this.pinsHTML(p); const nt = n.querySelector('.cx-ptbl'); if (nt) t.replaceWith(nt); const ni = n.querySelector('.cx-int'), oi = this.$('#cxInsp .cx-int'); if (ni && oi) oi.replaceWith(ni); } } } }

  // ------------------------------------------------------------ panel lateral
  renderSide() {
    const tabs = [];
    if (this.readOnly) tabs.push(['rev', '📝 Entrega'], ['ayuda', '❔ Ayuda']);
    else if (this.av) tabs.push(['averia', `${ic('search-check')} Avería`], ['comp', '🧩 Componentes'], ['ayuda', '❔ Ayuda']);
    else { if (this.pr) tabs.push(['guia', '📘 Práctica']); tabs.push(['comp', '🧩 Componentes'], ['ayuda', '❔ Ayuda']); }
    if (!tabs.some(t => t[0] === this.tab)) this.tab = tabs[0][0];
    this.$('#cxTabs').innerHTML = tabs.map(([k, t]) => `<button data-cxtab="${k}" class="${k === this.tab ? 'on' : ''}">${t}</button>`).join('');
    const P = this.$('#cxPanel');
    P.innerHTML = this.tab === 'averia' ? this.averiaHTML() : this.tab === 'rev' ? this.reviewHTML() : this.tab === 'comp' ? this.compHTML() : this.tab === 'ayuda' ? this.helpHTML() : this.guideHTML();
    const qi = P.querySelector('#cxQ'); if (qi) qi.oninput = () => { this.compQ = qi.value; const pos = qi.selectionStart; this.renderSide(); const n = this.$('#cxQ'); if (n) { n.focus(); n.setSelectionRange(pos, pos); } };
    P.querySelectorAll('[name=avTipo]').forEach(inp => inp.onchange = () => { this.avTipo = inp.value; this.avResp = null; const b = P.querySelector('[data-act=avComprobar],[data-act=avEntregar]'); if (b && !this._entregando) b.disabled = false; });
    P.querySelectorAll('[data-q]').forEach(inp => inp.oninput = inp.onchange = () => { const i = inp.dataset.q; this.g.answers[i] = inp.type === 'radio' ? +inp.value : inp.value; this.autosave(); });
  }
  thumb(type) { return this.thumbs?.[type] ? `<img src="${this.thumbs[type]}" alt="" draggable="false">` : `<span class="cx-noimg">${esc(PARTS[type].name[0])}</span>`; }
  compHTML() {
    const q = (this.compQ || '').trim().toLowerCase();
    const norm = (t) => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const match = (k, d) => !q || norm(d.name + ' ' + d.desc + ' ' + k).includes(norm(q));
    const body = CATS.map(c => { const list = Object.entries(PARTS).filter(([k, d]) => d.cat === c && !d.legacy && match(k, d)); return list.length ? `<h4>${c}</h4><div class="cx-grid">${list.map(([k, d]) => `<button class="cx-comp" data-add="${k}" title="${esc(d.desc)}">${this.thumb(k)}<span>${esc(d.name)}</span><em>${d.pins.length} ${d.board ? 'patas' : 'terminales'}</em></button>`).join('')}</div>` : ''; }).join('');
    return `<div class="cx-search"><input type="search" id="cxQ" placeholder="🔍 Buscar componente (LED, relé, pulsador…)" value="${esc(this.compQ || '')}" autocomplete="off"></div><p class="cx-small">Arrastra un componente hasta la protoboard (o haz clic y se colocará en un hueco libre). Pasa el ratón por sus patas para ver cómo se llaman.</p>` + (body || '<p class="cx-small">No hay ningún componente con ese nombre.</p>');
  }
  helpHTML() {
    return `<h4>Montar</h4><ul class="cx-ul"><li><b>Colocar:</b> arrastra un componente desde «Componentes». La sombra verde indica que cabe; roja, que no.</li><li><b>Girar:</b> tecla <kbd>R</kbd> o ⟳ (también mientras arrastras).</li><li><b>Mover:</b> arrastra la pieza. <b>Borrar:</b> <kbd>Supr</kbd> o 🗑.</li><li><b>Deshacer / rehacer:</b> <kbd>Ctrl</kbd>+<kbd>Z</kbd> / <kbd>Ctrl</kbd>+<kbd>Y</kbd>.</li></ul>
    <h4>Cables y conectores</h4><ul class="cx-ul"><li>Elige el <b>tipo de cable</b> en la barra 🔌 de abajo: cada uno tiene sus extremos y solo encaja donde encajaría en la realidad.</li>
      <li><b>Dupont macho-macho</b>: protoboard ↔ protoboard o conector hembra (servo). <b>Macho-hembra</b>: protoboard ↔ pin macho (fuente USB, probador) o punta estañada del portapilas. <b>Hembra-hembra</b>: pin ↔ pin. <b>Rígido</b>: puentes planos en la protoboard.</li>
      <li><b>Cocodrilo</b>: muerde bornes y lengüetas (pila de 9 V, motor). <b>Cocodrilo-macho</b>: del borne a la protoboard. <b>Banana</b>: bornes de la fuente de laboratorio.</li>
      <li>Si un extremo no encaja (por ejemplo, una hembra en la protoboard), el simulador lo rechaza y te dice qué cable sirve.</li>
      <li>Clic en un agujero (o en el terminal de una pieza de mesa) y clic en el destino.</li><li>Si una pieza tapa el agujero que quieres usar, pulsa <kbd>T</kbd> para ver la protoboard desde arriba.</li><li>Desde el + sale rojo y desde el − negro; si no, el color elegido. Cambia el color con <kbd>0</kbd>–<kbd>9</kbd>: ${WIRE_COLORS.map(([n, h], i) => `<span class="sw" style="background:${h}" title="${n}"></span>${i}`).join(' ')}</li><li>Al pasar el ratón por un agujero se iluminan en verde los que están unidos con él.</li></ul>
    <h4>Patas de los componentes</h4><ul class="cx-ul"><li>Pasa el ratón por una pata para ver su nombre y qué está unido con ella. <kbd>N</kbd> o 🏷 muestra los nombres de todas.</li><li><b>Interruptor deslizante</b>: 3 patas, la central es el común. <b>Pulsador</b>: 4 patas unidas por dentro de dos en dos (1–2 y 3–4), pínchalo cruzando el canal. <b>LED</b>: pata larga = ánodo (+). <b>Relé</b>: bobina B1–B2 y contactos COM, NC y NO. <b>Transistor BC547</b>: C, B, E con la cara plana delante.</li><li><kbd>X</kbd> o ▦ deja ver las tiras metálicas de dentro de la protoboard.</li></ul>
    <h4>Simular y medir</h4><ul class="cx-ul"><li>⚡ <b>Ver corriente</b> (<kbd>C</kbd>): puntos amarillos que van del + al − por los cables y por dentro de la protoboard. Más deprisa = más corriente.</li><li><b>Polímetro</b>: la punta negra va siempre en COM; la roja en VΩmA (V, Ω y hasta 200 mA) o en 10A (corrientes grandes). Con la roja en 10A no midas tensión: haría cortocircuito.</li><li><b>▶ Iniciar simulación</b>: los componentes reaccionan. Para cambiar el montaje, detenla.</li><li>Clic en interruptores y conmutadores; mantén pulsados los pulsadores. Potenciómetro y LDR se ajustan en su panel (o con la rueda del ratón sobre el potenciómetro).</li><li><b>Polímetro:</b> V en paralelo, A en serie (abriendo el circuito), Ω sin alimentación.</li><li>Avisos: cortocircuito, LED fundido, bombilla fundida, resistencia caliente y fusible del polímetro.</li></ul>
    <h4>Guardar</h4><ul class="cx-ul"><li>El montaje se guarda solo en este navegador. En <b>Archivo</b> puedes guardar una copia, exportarla a un archivo .json y abrirla en otro ordenador.</li></ul>
    <h4>Cámara</h4><ul class="cx-ul"><li>Arrastra para girar, rueda o pellizco para acercar, botón derecho o dos dedos para desplazar. <kbd>H</kbd> vista inicial, <kbd>T</kbd> desde arriba.</li></ul>`;
  }

  // ------------------------------------------------------------ guía de prácticas
  stepText(st) {
    if (st.place) { const s = makePart(st.place), def = PARTS[s.type]; if (def.board) { const hs = partHoles(s); return Object.entries(hs).map(([pin, h]) => `${def.pinNames?.[pin] ? esc(def.pinNames[pin]) + ': ' : ''}<b>${esc(holeName(h))}</b>`).join(' · '); } return 'en la mesa, donde quieras'; }
    if (st.wire) { const sol = solutionModel(this.pr); const kind = st.wire.kind || bestKind(socketOf(st.wire.a, sol), socketOf(st.wire.b, sol)); return `<span class="sw" style="background:${wireHex(st.wire.color)}"></span> ${esc(this.solName(st.wire.a))} → ${esc(this.solName(st.wire.b))}<br>🔌 Cable: <button class="cx-kbtn ${this.wireKind === kind ? 'on' : ''}" data-wkind="${kind}">${esc(WIRE_KINDS[kind].name)}</button>`; }
    return '';
  }
  solName(k) { if (k.startsWith('h:')) return holeName(k.slice(2)); const [, id, pin] = k.split(':'); const st = this.pr.steps.find(s => s.place?.id === id); if (!st) return k; const p = makePart(st.place); return PARTS[p.type].name + ' · ' + (PARTS[p.type].pinNames?.[pin] || pin); }
  guideHTML() {
    const pr = this.pr, g = this.g; if (!pr) return '';
    const total = pr.steps.length, done = Math.min(g.idx, total);
    const ra = Object.entries(pr.ra).map(([n, ces]) => `<div class="cx-ra"><b>RA${n}</b> ${esc(RA[n].t)}<ul>${ces.map(c => `<li><b>${c})</b> ${esc(RA[n].ce[c])}</li>`).join('')}</ul></div>`).join('');
    let h = `<div class="cx-gh"><span class="cx-num">${pr.n}</span><div><h3>${esc(pr.title)}</h3><div class="cx-small">${esc(pr.sub)} · ${esc(pr.level)} · ⏱ ${esc(pr.duration)}</div></div></div>
      <div class="cx-prog"><div style="width:${Math.round(done / total * 100)}%"></div><span>${done} / ${total} pasos</span></div>
      <details ${g.idx === 0 ? 'open' : ''}><summary>🎯 Objetivo y teoría</summary><p>${esc(pr.objetivo)}</p><p class="cx-theory">${pr.teoria}</p></details>
      <details ${g.idx === 0 ? 'open' : ''}><summary>📐 Esquema eléctrico</summary><div class="cx-schem-wrap" title="Clic para ampliar">${pr.schem()}</div></details>
      <details><summary>🧰 Material</summary><table class="cx-tbl">${pr.material.map(([m, n]) => `<tr><td>${esc(m)}</td><td class="c">${n}</td></tr>`).join('')}</table></details>
      <details><summary>📋 Resultados de aprendizaje</summary>${ra}<p class="cx-small">Módulo 3015 · Orden de 8-11-2016, BOJA 241, Anexo IV.</p></details>
      <h4>Pasos</h4><ol class="cx-steps">`;
    pr.steps.forEach((st, i) => {
      const cls = i < g.idx ? 'done' : i === g.idx ? 'cur' : 'todo';
      h += `<li class="${cls}" ${i === g.idx ? 'id="cxCur"' : ''}><div class="cx-sh"><span class="cx-sn">${i < g.idx ? '✔' : i + 1}</span><b>${esc(st.t || '')}</b></div>`;
      if (i === g.idx) {
        const where = this.stepText(st);
        h += `<div class="cx-sb"><p>${st.text || ''}</p>${where ? `<div class="cx-where">📍 ${where}</div>` : ''}`;
        if (st.place) { const pl = st.place; h += `<button class="cx-comp inline" data-add="${pl.type}" data-props='${esc(JSON.stringify(pl.props || {}))}' title="Arrástralo hasta la silueta naranja">${this.thumb(pl.type)}<span>Arrastra desde aquí: <b>${esc(PARTS[pl.type].label(makePart(pl)))}</b></span></button>`; }
        if (st.measure) h += `<div class="cx-where cx-read">📟 Lectura actual: <b>${esc(this.meterText())}</b></div>`;
        if (st.place || st.wire || st.setMode || st.remove) h += `<div class="cx-ibtns"><button class="cx-btn small" data-act="autostep" title="Lo hace el simulador por ti">✨ Hazlo por mí</button></div>`;
        h += `</div>`;
      }
      h += `</li>`;
    });
    h += `</ol>`;
    if (g.idx >= total) h += `<div class="cx-ok">🎉 ¡Has completado todos los pasos! Ahora pulsa <b>Comprobar circuito</b>.</div>`;
    h += `<div class="cx-ibtns"><button class="cx-sim" data-act="check">✔ Comprobar circuito</button><button class="cx-btn" data-act="solution">👁 Ver solución</button></div>`;
    if (this.checkResult) {
      const r = this.checkResult;
      h += `<div class="cx-check ${r.ok ? 'ok' : 'ko'}"><div class="cx-ch">${r.ok ? '✅ ¡Circuito correcto y funcionando!' : '❌ Todavía hay algo que revisar'}</div><ul>${r.items.map(it => `<li class="${it.ok ? 'ok' : 'ko'}">${it.ok ? '✔' : '✖'} ${esc(it.label)}${it.info ? `<div class="cx-small">${esc(it.info)}</div>` : ''}</li>`).join('')}</ul></div>`;
    }
    h += `<h4>Preguntas de cálculo</h4><div class="cx-qs">${pr.questions.map((q, i) => {
      const a = g.answers[i]; const res = this.qres?.[i];
      const inp = q.choices ? q.choices.map((c, k) => `<label><input type="radio" name="cxq${i}" data-q="${i}" value="${k}" ${a === k ? 'checked' : ''}> ${esc(c)}</label>`).join('') : `<div class="cx-row"><input type="text" inputmode="decimal" data-q="${i}" value="${a != null ? esc(a) : ''}" placeholder="Tu resultado"><span class="cx-unit">${q.unit}</span></div>`;
      const fb = (res == null && !this.showAnswers) ? '' : `<div class="cx-fb ${res ? 'ok' : res === false ? 'ko' : ''}">${res === true ? '✔ ¡Correcto! ' : res === false ? '✖ Revisa el cálculo. ' : ''}${res || this.showAnswers ? 'Solución: ' + q.expl : ''}</div>`;
      return `<div class="cx-q"><div class="cx-qq">${i + 1}. ${q.q}</div>${inp}${fb}</div>`;
    }).join('')}</div>
    <div class="cx-ibtns"><button class="cx-btn" data-act="answers">Comprobar respuestas</button><button class="cx-btn" data-act="showans">Ver soluciones</button></div>
    <h4>Reto</h4><p>${pr.reto}</p>`;
    if (portal()?.rol === 'alumno') h += `<h4>Entrega</h4><div class="cx-entrega" id="cxEntrega">${this.entregaHTML()}</div>`;
    h += `<div class="cx-ibtns"><button class="cx-btn small" data-act="reset">↺ Reiniciar práctica</button></div>`;
    return h;
  }
  // ------------------------------------------------------------ entregas (portal con Firebase)
  entregaHTML() {
    const P = portal(); const pr = this.pr; if (!P || !pr) return '';
    if (this._entregando) return `<div class="cx-ibtns"><button class="cx-sim" disabled>📤 Enviando…</button></div>`;
    const e = P.estadoEntrega(pr.id);
    const f = (t) => t ? new Date(t).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }) : '';
    if (!e) return `<p class="cx-small">Cuando termines, entrega la práctica al profesor. Se envían tu montaje, tus respuestas y el resultado de «Comprobar circuito», solo con tu grupo y tu número de lista.</p>
      <div class="cx-ibtns"><button class="cx-sim" data-act="entregar">📤 Entregar al profesor</button></div>`;
    let h = `<div class="cx-ent-ok">📤 <b>Entregado</b> · ${esc(f(e.fecha))}${e.pendiente ? ' · enviando…' : ''}</div>`;
    if (e.nota != null) h += `<div class="cx-ent-nota">Nota: <b>${esc(String(e.nota).replace('.', ','))}</b></div>`;
    else h += `<div class="cx-small">Pendiente de corregir.</div>`;
    if (e.comentario) h += `<div class="cx-ent-com">💬 ${esc(e.comentario)}</div>`;
    if (e.nota == null) h += `<div class="cx-ibtns"><button class="cx-btn" data-act="entregar">↻ Volver a entregar</button></div>`;
    return h;
  }
  refreshEntrega() { const el = this.$('#cxEntrega'); if (el) el.innerHTML = this.entregaHTML(); }
  calcQres(pr, answers) { return pr.questions.map((q, i) => { const a = answers?.[i]; if (a == null || a === '') return null; if (q.choices) return +a === q.ans; const v = parseFloat(String(a).replace(',', '.')); return isFinite(v) && Math.abs(v - q.ans) <= Math.max(q.tol * Math.abs(q.ans), 1e-9); }); }
  entregar() {
    const P = portal(), pr = this.pr, g = this.g; if (!P || !pr || this._entregando) return;
    const res = runChecks(pr, this.model, { map: g.map, measured: g.measured }); this.checkResult = res;
    if (!res.ok && !(this.opts.confirm || confirm)('La comprobación del circuito todavía no está bien. ¿Quieres entregarla igualmente?')) { this.renderSide(); return; }
    const q = this.calcQres(pr, g.answers);
    const datos = {
      montaje: JSON.stringify({ app: 'laboratorio-circuitos', version: 2, practica: pr.id, model: this.model }),
      respuestas: Object.fromEntries(Object.entries(g.answers || {}).filter(([, v]) => v !== '' && v != null).map(([k, v]) => [k, String(v).slice(0, 40)])),
      comprobacion: { ok: !!res.ok, items: res.items.map(it => ({ t: String(it.label).slice(0, 160), ok: !!it.ok })) },
      aciertos: `${q.filter(x => x === true).length}/${pr.questions.length}`,
    };
    this._entregando = true; this.renderSide();
    P.entregar({ practica: pr.id, tipo: 'circuitos', titulo: `Práctica ${pr.n}: ${pr.title}`.slice(0, 120), datos })
      .then(() => this.toast('📤 ¡Práctica entregada al profesor!', 3500), (e) => this.toast('❌ No se ha podido entregar: ' + esc(e?.mensaje || 'revisa la conexión.'), 5000))
      .finally(() => { this._entregando = false; this.renderSide(); });
  }
  // ------------------------------------------------------------ revisión de una entrega (profesor, solo lectura)
  review(rev) {
    const root = this.$('.cx');
    if (this.running) this.toggleSim(false);
    root.classList.remove('is-home'); root.classList.add('is-editor', 'is-ro');
    if (!this.renderer) this.initScene();
    this.av = null; this.readOnly = true; this.view = 'revision'; this.rev = rev;
    this.pr = PRACTICES.find(p => p.id === rev.practica) || null;
    this.sel = null; this.undoS = []; this.redoS = []; this.runtime = {};
    let m = {}; try { m = JSON.parse(rev.montaje || '{}'); } catch (e) { m = {}; }
    this.model = this.sanitize(m && m.model ? m.model : m);
    this.g = this.pr ? { idx: this.pr.steps.length, map: {}, measured: {}, answers: rev.respuestas || {}, snap: null } : null;
    this.tab = 'rev'; this.checkResult = null; this.qres = null; this.showAnswers = true;
    this.$('#cxPTitle').innerHTML = `<span class="cx-pn">${this.pr ? this.pr.n : '?'}</span><span class="cx-ptt">Revisión · ${esc(rev.quien || '')}</span>`;
    this.onResize(); this.sync(); this.updateGhost(); this.renderSide(); this.renderInsp(); this.homeView(true); this.updateUndo();
    this.status('Revisión de una entrega · <b>solo lectura</b>: gira la vista y pulsa ▶ Iniciar simulación para verla funcionar.');
    this.setCrumbs(); this.resume(); this.onResize();
  }
  reviewHTML() {
    const r = this.rev, pr = this.pr; if (!r) return '';
    const f = (t) => t ? new Date(t).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }) : '';
    let h = `<div class="cx-gh"><span class="cx-num">${pr ? pr.n : '?'}</span><div><h3>${esc(pr ? pr.title : r.practica)}</h3><div class="cx-small">${esc(r.quien || '')} · entregada ${esc(f(r.fecha))}</div></div></div>
      <div class="cx-ibtns"><button class="cx-btn" data-act="rev-volver">← Volver a las entregas</button></div>`;
    const c = r.comprobacion;
    if (c) h += `<div class="cx-check ${c.ok ? 'ok' : 'ko'}"><div class="cx-ch">${c.ok ? '✅ La comprobación salió bien al entregar' : '❌ La comprobación no salió bien al entregar'}</div><ul>${(c.items || []).map(it => `<li class="${it.ok ? 'ok' : 'ko'}">${it.ok ? '✔' : '✖'} ${esc(it.t)}</li>`).join('')}</ul></div>`;
    if (pr) {
      const q = this.calcQres(pr, r.respuestas || {});
      h += `<h4>Preguntas de cálculo · ${q.filter(x => x === true).length}/${pr.questions.length} correctas</h4><div class="cx-qs">${pr.questions.map((qq, i) => {
        const a = r.respuestas?.[i]; const txt = a == null || a === '' ? '—' : qq.choices ? (qq.choices[+a] ?? a) : `${a} ${qq.unit || ''}`;
        return `<div class="cx-q"><div class="cx-qq">${i + 1}. ${qq.q}</div><div class="cx-fb ${q[i] ? 'ok' : q[i] === false ? 'ko' : ''}">Respuesta: <b>${esc(String(txt))}</b> ${q[i] ? '✔' : q[i] === false ? '✖' : ''}<br><span class="cx-small">Solución: ${qq.expl}</span></div></div>`;
      }).join('')}</div>`;
    }
    h += `<h4>Calificación</h4><div class="cx-grade"><label>Nota (0–10) <input type="number" id="cxNota" min="0" max="10" step="0.25" value="${r.nota != null ? esc(r.nota) : ''}"></label>
      <label>Comentario para el alumno <textarea id="cxCom" maxlength="1000" rows="3">${esc(r.comentario || '')}</textarea></label>
      <div class="cx-ibtns"><button class="cx-sim" data-act="rev-guardar">💾 Guardar nota</button><span class="cx-small" id="cxGradeMsg"></span></div></div>`;
    return h;
  }
  meterPart() { return this.model.parts.find(p => p.id === this.g?.map?.M1) || this.model.parts.find(p => PARTS[p.type].meter); }
  meterText() { if (!this.running) return 'inicia la simulación'; const m = this.meterPart(); const r = m && this.lastSim?.res?.[m.id]?.meter; return r ? r.text : '—'; }
  evalGuide(force) {
    if (!this.pr || !this.g) { this.updateGhost(); return; }
    const pr = this.pr, g = this.g; const before = g.idx;
    const ctx = { model: this.model, running: this.running, map: g.map, sim: this.lastSim };
    let guard = 0;
    while (g.idx < pr.steps.length && guard++ < 100) {
      ctx.snap = g.snap; ctx.uf = null;
      if (!stepDone(pr, g.idx, ctx)) break;
      const st = pr.steps[g.idx]; if (st.measure && st.key) g.measured[st.key] = true;
      g.idx++; g.snap = this.snapFor(pr.steps[g.idx]);
    }
    if (g.idx !== before || force) {
      if (g.idx !== before) { this.autosave(); this.toast(g.idx >= pr.steps.length ? '🎉 ¡Pasos completados! Pulsa «Comprobar circuito».' : `✔ ¡Bien! Paso ${before + 1} hecho. Ahora el paso ${g.idx + 1}.`, 2200); }
      if (this.tab === 'guia') { const P = this.$('#cxPanel'); const sc = P.scrollTop; this.renderSide(); const cur = this.$('#cxCur'); if (cur && g.idx !== before) cur.scrollIntoView({ block: 'nearest' }); else P.scrollTop = sc; }
      this.updateGhost();
    } else if (this.tab === 'guia' && pr.steps[g.idx]?.measure) { const el = this.$('#cxCur .cx-read b'); if (el) el.textContent = this.meterText(); }
    const cur = pr.steps[g.idx]; this.$('#cxSim').classList.toggle('pulse', !!(cur && ((cur.sim && !this.running) || (cur.stop && this.running))));
  }
  snapFor(st) { if (!st?.act || st.act.test !== 'toggled') return null; const p = this.part(this.g.map[st.act.part]); return p ? JSON.stringify(p.state) : null; }
  updateGhost() {
    if (!this.renderer) return;
    for (const c of [...this.ghostG.children]) this.disposeObj(this.ghostG, c);
    this.labels.forEach(l => l.el.remove()); this.labels = [];
    const rings = []; const add = (x, y, z, c, s = 1) => rings.push([x, y, z, c, s]);
    const st = this.pr && this.g && this.pr.steps[this.g.idx];
    if (st && !this.drag) {
      const map = this.g.map; const mk = (k) => { const m = /^p:([^:]+):(.+)$/.exec(k); return m ? (map[m[1]] && this.part(map[m[1]]) ? `p:${map[m[1]]}:${m[2]}` : null) : k; };
      if (st.place) {
        const p = makePart(st.place); const def = PARTS[p.type];
        const g = buildPart(p); g.traverse(c => { if (c.isMesh) { c.material = this.ghostMat; c.castShadow = false; } if (c.isSprite) c.visible = false; });
        this.place(g, p); this.ghostG.add(g);
        if (def.board) { const hs = partHoles(p); for (const h of Object.values(hs)) { const q = holePos(h); add(q.x, BT + 0.04, q.z, 0xf5a524); } const c = this.partCenter(p); this.label(new THREE.Vector3(c[0], BT + 5.5, c[1]), `Aquí: ${Object.values(hs).join(' – ')}`); }
        else this.label(new THREE.Vector3(p.pos[0], 14, p.pos[1]), 'Aquí, en la mesa');
      } else if (st.wire || st.remove) {
        const w = st.wire || this.pr.steps.find(x => x.wire && x.wire.id === st.remove).wire;
        const a = mk(w.a), b = mk(w.b);
        if (a && b) {
          const A = this.termWorld(a), Bv = this.termWorld(b);
          this.ghostG.add(buildWire(A, Bv, '#f5a524', { mat: this.ghostMat, r: 0.45 }));
          for (const v of [A, Bv]) add(v.x, v.y + 0.04, v.z, st.remove ? 0xe0383e : 0xf5a524);
          this.label(A.clone().lerp(Bv, 0.5).setY(Math.max(A.y, Bv.y) + 4), st.remove ? '🗑 Borra este cable' : `Cable ${w.color}`);
        }
      } else if (st.measure) {
        for (const [k, col, t] of [[st.measure.red, 0xff2a2a, 'Punta roja aquí'], [st.measure.com, 0x111111, 'Punta negra aquí']]) { const kk = mk(k); if (!kk) continue; const v = this.termWorld(kk); add(v.x, v.y + 0.05, v.z, col, 1.3); this.label(v.clone().setY(v.y + 3.4), t); }
      } else if (st.act || st.setMode) {
        const id = map[st.act?.part || st.meterPart]; const o = id && this.objs.get(id);
        if (o) { const b = new THREE.Box3().setFromObject(o.g.userData.inner); const c = b.getCenter(new THREE.Vector3()); add(c.x, Math.max(0.1, b.min.y + 0.1), c.z, 0xf5a524, Math.max(3, b.getSize(new THREE.Vector3()).length() * 0.8)); const tp = this.part(id).type; this.label(c.clone().setY(b.max.y + 2.5), st.setMode ? `Elige ${st.setMode} en su panel` : (tp === 'ldr' || tp === 'pot' ? 'Selecciónalo y ajústalo en su panel' : 'Haz clic aquí')); }
      }
    }
    const m = new THREE.Matrix4(); this.ringScale = [];
    rings.slice(0, 16).forEach(([x, y, z, c, s], i) => { m.makeTranslation(x, y, z); this.guideRings.setMatrixAt(i, m); this.guideRings.setColorAt(i, new THREE.Color(c)); this.ringScale[i] = s; });
    this.guideRings.count = Math.min(16, rings.length); this.guideRings.instanceMatrix.needsUpdate = true; if (this.guideRings.instanceColor) this.guideRings.instanceColor.needsUpdate = true;
  }
  label(pos, text) { const el = document.createElement('div'); el.className = 'cx-glab'; el.textContent = text; this.$('#cxLabels').appendChild(el); this.labels.push({ el, pos }); }
  layoutLabels() {
    if (!this.labels.length && !this.pinLabels.length) return; const r = this.renderer.domElement; const w = r.clientWidth, h = r.clientHeight;
    for (const l of [...this.labels, ...this.pinLabels]) { const v = l.pos.clone().project(this.camera); l.el.style.transform = `translate(${(v.x * 0.5 + 0.5) * w}px, ${(-v.y * 0.5 + 0.5) * h}px) translate(-50%, -100%)`; l.el.style.display = v.z < 1 ? '' : 'none'; }
  }
  guideAction(act) {
    if (act.startsWith('av')) return this.avAccion(act);
    const pr = this.pr, g = this.g;
    if (act === 'desel') return this.select(null);
    if (act === 'toggle') { const p = this.part(this.sel?.id); if (!p) return; const flip = () => { if (p.type === 'switch') p.state.closed = !p.state.closed; else p.state.pos = p.state.pos ? 0 : 1; }; if (!this.running) this.commit(flip); else { flip(); this.stateChanged(p, true); } return; }
    if (act === 'parkprobes') { const p = this.part(this.sel?.id); if (!p) return; this._liveOK = true; this.commit(() => { p.probes = { red: null, com: null }; p.park = { red: [4, 15], com: [-4, 15] }; }); this._liveOK = false; return; }
    if (act === 'rev-volver') { location.hash = '#panel/entregas'; return; }
    if (act === 'rev-guardar') {
      const msg = this.$('#cxGradeMsg'); const raw = this.$('#cxNota').value.trim().replace(',', '.'); const nota = raw === '' ? null : Math.round(+raw * 100) / 100;
      if (nota != null && !(nota >= 0 && nota <= 10)) { msg.textContent = 'La nota tiene que estar entre 0 y 10.'; return; }
      const com = this.$('#cxCom').value.slice(0, 1000); msg.textContent = 'Guardando…';
      Promise.resolve(portal()?.calificar(this.rev.id, nota, com)).then(() => { this.rev.nota = nota; this.rev.comentario = com; msg.textContent = '✔ Guardado'; }, () => { msg.textContent = '❌ No se ha podido guardar.'; });
      return;
    }
    if (!pr || this.readOnly) return;
    if (act === 'entregar') return this.entregar();
    if (act === 'autostep') this.autoStep();
    if (act === 'check') { this.checkResult = runChecks(pr, this.model, { map: g.map, measured: g.measured }); if (this.checkResult.ok) { store.set('done:' + pr.id, true); this.toast('✅ ¡Práctica superada!', 4000); } this.renderSide(); this.$('.cx-check')?.scrollIntoView({ block: 'nearest' }); }
    if (act === 'solution') { if (!(this.opts.confirm || confirm)('¿Cargar la solución completa? Tu montaje actual se puede recuperar con Deshacer.')) return; this.loadSolution(); }
    if (act === 'answers') { this.qres = pr.questions.map((q, i) => { const a = g.answers[i]; if (a == null || a === '') return null; if (q.choices) return +a === q.ans; const v = parseFloat(String(a).replace(',', '.')); return isFinite(v) && Math.abs(v - q.ans) <= Math.max(q.tol * Math.abs(q.ans), 1e-9); }); this.renderSide(); }
    if (act === 'showans') { this.showAnswers = true; this.renderSide(); }
    if (act === 'reset') { if (!(this.opts.confirm || confirm)('¿Empezar la práctica de nuevo? Se borrará el montaje.')) return; this.toggleSim(false); this.commit(() => { this.model = { parts: [], wires: [] }; }); Object.assign(g, { idx: 0, map: {}, measured: {}, answers: {}, snap: null }); this.checkResult = null; this.qres = null; this.showAnswers = false; store.del('done:' + pr.id); this.afterChange(); this.renderSide(); }
  }
  autoStep() {
    const st = this.pr.steps[this.g.idx]; if (!st) return;
    if (this.running && ((st.place && !PARTS[st.place.type].meter) || st.wire || st.remove)) this.toggleSim(false);
    const map = this.g.map; const mk = (k) => { const m = /^p:([^:]+):(.+)$/.exec(k); return m ? (map[m[1]] && this.part(map[m[1]]) ? `p:${map[m[1]]}:${m[2]}` : null) : k; };
    if (st.place) {
      const p = this.freshPart(st.place.type, st.place.props); const def = PARTS[p.type];
      if (def.board) { const q = { ...p, at: st.place.at, rot: st.place.rot || 0 }; if (!this.boardValid(q)) return this.toast('El sitio está ocupado: deja libres los agujeros marcados.'); this.autoPlace(p, st.place); }
      else { const q = { ...p, pos: st.place.pos, rot: st.place.rot || 0 }; if (this.tableValid(q)) this.autoPlace(p, st.place); else this.autoPlace(p); }
      map[st.place.id] = p.id; this.evalGuide();
    } else if (st.wire) {
      const a = mk(st.wire.a), b = mk(st.wire.b); if (!a || !b) return this.toast('Falta colocar antes la pieza de este paso.');
      const occ = this.occupied(); for (const k of [a, b]) if (k.startsWith('h:') && occ.has(k.slice(2))) return this.toast('El agujero ' + holeName(k.slice(2)) + ' está ocupado.');
      const id = this.newId('w'); const kind = st.wire.kind || bestKind(socketOf(a, this.model), socketOf(b, this.model)); this.commit(() => this.model.wires.push({ id, a, b, color: st.wire.color, kind }));
    } else if (st.remove) {
      const w = this.pr.steps.find(x => x.wire && x.wire.id === st.remove).wire; const a = mk(w.a), b = mk(w.b);
      this.commit(() => { this.model.wires = this.model.wires.filter(x => !((x.a === a && x.b === b) || (x.a === b && x.b === a))); });
    } else if (st.setMode) { const m = this.meterPart(); if (m) { this._liveOK = true; this.commit(() => { m.props.mode = st.setMode; }); this._liveOK = false; } }
  }
  loadSolution() {
    const pr = this.pr; this.toggleSim(false);
    const sol = solutionModel(pr);
    this.commit(() => { this.model = this.sanitize(clone(sol)); });
    this.g.map = Object.fromEntries(sol.parts.map(p => [p.id, p.id])); this.g.idx = 0; this.g.snap = null;
    this.evalGuide(true); this.homeView();
    this.toast('Solución cargada. Pulsa ▶ Iniciar simulación para verla funcionar.', 4000);
  }

  // ------------------------------------------------------------ archivo
  fileAction(a) {
    if (!this.view || this.view === 'home') return;
    if (this.readOnly && a !== 'export') return this.toast('Revisión de una entrega: solo se puede exportar.');
    if (a === 'save') { store.set('save:' + this.view, { model: this.model, date: Date.now() }); this.toast('💾 Montaje guardado en este navegador.'); }
    if (a === 'load') { const s = store.get('save:' + this.view); if (!s) return this.toast('No hay ningún montaje guardado para esta práctica.'); this.toggleSim(false); this.commit(() => { this.model = this.sanitize(s.model); }); this.toast('📂 Montaje recuperado (' + new Date(s.date).toLocaleString('es-ES') + ').'); }
    if (a === 'export') {
      const data = JSON.stringify({ app: 'laboratorio-circuitos', version: 2, practica: this.view, fecha: new Date().toISOString(), model: this.model }, null, 1);
      const url = URL.createObjectURL(new Blob([data], { type: 'application/json' })); const l = document.createElement('a');
      l.href = url; l.download = `circuito-${this.view}-${new Date().toISOString().slice(0, 10)}.json`; document.body.appendChild(l); l.click(); l.remove(); setTimeout(() => URL.revokeObjectURL(url), 2000);
      this.toast('⬇ Archivo exportado.');
    }
    if (a === 'import') this.$('#cxFile').click();
    if (a === 'clear') { if (!(this.opts.confirm || confirm)('¿Vaciar la protoboard?')) return; this.toggleSim(false); this.select(null, true); this.commit(() => { this.model = { parts: [], wires: [] }; }); }
  }
  importText(text) {
    const d = JSON.parse(text); const m = this.sanitize(d.model || d); this.toggleSim(false); this.select(null, true);
    this.commit(() => { this.model = m; }); this.homeView(); this.toast('⬆ Montaje importado: ' + m.parts.length + ' componentes y ' + m.wires.length + ' cables.');
    return m;
  }
  importFile(f) { const rd = new FileReader(); rd.onload = () => { try { this.importText(rd.result); } catch (e) { this.toast('El archivo no es un montaje válido.'); } }; rd.readAsText(f); }
}

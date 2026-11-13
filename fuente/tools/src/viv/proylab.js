// Proyectos de «Instalación de vivienda» con el formato de las lecciones del ESP32: lección paso a paso sobre el 3D
// (barra de pasos, pestañas PASO A PASO · FICHA · MATERIAL · ESQUEMA · PRUEBA · RETO) y montaje interactivo propio.
// Se instala sobre ViviendaLab (lab.js) con instalarProyectos(ViviendaLab).
import { PROYECTOS, proyecto, pasosDe, modeloPaso, modeloMontar, solucion, comprobarProyecto, medirPrueba, planoSVG, tablaCables, MATERIAL, FOTOS_HERRAMIENTA, aplicar } from './proyectos.js';
import { HERRAMIENTAS, PUNTAS, herramienta } from './catalogo.js';
import { FOTOS } from './creditos.js';
import { FOTOS_PORTAL } from '../ui/fotos.js';
// Foto real de cada proyecto en su tarjeta (los renders 3D se ven dentro del proyecto).
const FOTO_PROY = { 1: 'img/viv/fotos/portalamparas.jpg', 2: 'img/viv/fotos/schuko_frente.jpg', 3: 'img/fotos/p3.webp', 4: 'img/viv/fotos/interruptor.jpg', 5: 'img/fotos/p5.webp', 6: 'img/viv/fotos/minutero.jpg', 7: 'img/fotos/cuadro.webp', 8: 'img/fotos/p8.webp' };
import { partePorId, posParte, sanear, TIPOS } from './modelo.js';
import { medir } from './sim.js';

const esc = (t) => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const portal = () => (typeof window !== 'undefined' ? window.PORTAL : null);
export const PRACTICA_PROY = 'v5';
const TABS_L = [['pasos', 'Paso a paso'], ['ficha', 'Ficha'], ['material', 'Material'], ['esquema', 'Esquema'], ['prueba', 'Prueba'], ['reto', 'Reto']];
const TABS_M = [['montar', 'Montaje'], ['esquema', 'Esquema'], ['prueba', 'Prueba'], ['material', 'Material']];
// herramienta del paso: 'destornillador:PZ1' → { id, punta, n, img }
export function herrInfo(s) {
  const [id, punta] = String(s).split(':'); const H = herramienta(id) || { n: id, para: '' };
  const n = id === 'destornillador' && punta ? `Destornillador ${PUNTAS[punta]?.n || punta}` : H.n;
  return { id, punta, n, para: H.para, img: `img/viv/herr/${id}${punta ? '-' + punta : ''}.png`, foto: FOTOS_HERRAMIENTA[id] };
}
const LS = 'viv:v1:';
const lee = (k) => { try { return JSON.parse(localStorage.getItem(LS + k)); } catch (e) { return null; } };
const guarda = (k, v) => { try { localStorage.setItem(LS + k, JSON.stringify(v)); } catch (e) { } };
export const progreso = () => lee('proyprog') || {};
const setProg = (n, f) => { const p = progreso(); p[n] = p[n] || {}; f(p[n]); guarda('proyprog', p); };

export function parseProy(v) {
  const m = /^p(\d)(?:-(montar|\d+))?$/.exec(v || ''); if (!m) return null; const P = proyecto('p' + m[1]); if (!P) return null;
  return { P, montar: m[2] === 'montar', paso: m[2] && m[2] !== 'montar' ? Math.max(0, +m[2] - 1) : 0 };
}

const M = {
  // ------------------------------------------------------------ portada (como la del ESP32)
  homeProyHTML() {
    const pr = progreso(); const est = (k) => { const e = portal()?.estadoEntrega?.(k); return e ? `<span class="vv-chip ${e.nota != null ? 'ok' : ''}">${e.nota != null ? 'Nota ' + String(e.nota).replace('.', ',') : '📤 Entregado'}</span>` : ''; };
    const card = (P) => { const g = pr[P.n] || {}; return `<a class="card vv-pc" href="#eee/vivienda/p${P.n}"><img src="${FOTO_PROY[P.n] || `img/viv/proy/p${P.n}.jpg`}" alt="" loading="lazy" decoding="async"><div class="vv-pcb"><div class="vv-pch"><span class="num">${P.n}</span><b>${esc(P.title)}</b>${g.ok ? '<span class="vv-chip ok">✔ Montado</span>' : ''}</div>
      <div class="muted small">${esc(P.level)} · ${esc(P.duration)} · ${esc(P.circuito)}</div><div class="small">${esc(P.short)}</div></div></a>`; };
    return `<div class="vv-hw vv-hw3"><div class="vv-hero3"><h2>Instalación eléctrica de una vivienda · paso a paso</h2>
      <p class="lead">${PROYECTOS.length} proyectos de dificultad creciente, como en el laboratorio ESP32. En cada paso: qué material <b>coges</b>, qué <b>herramienta</b> eliges, dónde va cada cable (con su <b>color y sección</b> reglamentarios) y qué <b>compruebas</b> antes de seguir. Después lo <b>montas tú</b> en el tablero 3D, lo mides con el polímetro y lo pruebas con tensión.</p>
      <div class="vv-norma"><span><b>Fase</b> marrón · negro · gris</span><span><b>Neutro</b> azul</span><span><b>Tierra</b> amarillo-verde</span><span><b>Alumbrado</b> 1,5 mm² · PIA 10 A</span><span><b>Enchufes</b> 2,5 mm² · PIA 16 A</span></div></div>
      <h3 class="vv-sec">Proyectos ${est(PRACTICA_PROY)}</h3><div class="cards vv-pcards">${PROYECTOS.map(card).join('')}</div>
      <h3 class="vv-sec">Otras prácticas</h3><p class="muted small">Modos abiertos y prácticas anteriores (se conservan tus montajes y entregas).</p>
      <div class="cards vv-ocards">
        <a class="card" href="#eee/vivienda/libre"><span class="num">🧰</span><div><b>Modo libre ${est('v2')}</b><div class="small">Diseña tu instalación en un tablero a medida, con todas las piezas.</div></div></a>
        <a class="card" href="#eee/vivienda/taller"><span class="num">🪛</span><div><b>Taller de herramientas</b><div class="small">Cada herramienta en 3D: para qué sirve, puntas, seguridad y test.</div></div></a>
        <a class="card" href="#eee/vivienda/tablero"><span class="num">📐</span><div><b>Tablero de la SA1 ${est('v1')}</b><div class="small">Ejercicio guiado del Trabajo 3: 3 bombillas, 2 interruptores y enchufe.</div></div></a>
        <a class="card" href="#eee/vivienda/montaje"><span class="num">🎮</span><div><b>Juego de montaje ${est('v4')}</b><div class="small">Elige la herramienta en cada paso: los fallos y el tiempo cuentan.</div></div></a>
        <a class="card" href="#eee/vivienda/casa"><span class="num">🏡</span><div><b>Vivienda real ${est('v3')}</b><div class="small">Piso de 2 dormitorios con circuitos C1–C5 (proyecto 8).</div></div></a>
        <a class="card" href="#eee/vivienda/creditos"><span class="num">©</span><div><b>Créditos de las imágenes</b><div class="small">Autores y licencias de las fotos reales.</div></div></a>
      </div>
      <h4 class="vv-sec">🔧 Averías para practicar</h4><div class="vv-avl">${(this._averias || []).map((a) => `<a href="#eee/vivienda/averia-${a.id}">${esc(a.n)}</a>`).join('')}</div>
      <p class="muted small">Simulación didáctica: la red de 230 V se resuelve como un circuito de resistencias. Normas del REBT: ITC-BT-19 (colores), ITC-BT-21 (tubos), ITC-BT-25 (circuitos de la vivienda). Las piezas en 3D son genéricas, con las medidas y el marcado de productos reales y sin logotipos.</p></div>`;
  },
  creditosHTML() {
    const filas = Object.entries(FOTOS).map(([k, f]) => `<tr><td><img src="${esc(f.f)}" alt="" loading="lazy"></td><td><b>${esc(f.t)}</b><div class="small">Autor: ${esc(f.a)}</div></td><td><a href="${esc(f.lu)}" target="_blank" rel="noopener">${esc(f.l)}</a></td><td><a href="${esc(f.u)}" target="_blank" rel="noopener">Wikimedia Commons</a></td></tr>`).join('');
    const filasPortal = Object.values(FOTOS_PORTAL).map((f) => `<tr><td><img src="${esc(f.f)}" alt="" loading="lazy"></td><td><b>${esc(f.t)}</b><div class="small">Autor: ${esc(f.a)}</div><div class="small muted">${esc(f.uso)}</div></td><td><a href="${esc(f.lu)}" target="_blank" rel="noopener">${esc(f.l)}</a></td><td><a href="${esc(f.u)}" target="_blank" rel="noopener">Wikimedia Commons</a></td></tr>`).join('');
    return `<div class="vv-hw vv-hw3"><p><a href="#eee/vivienda">← Volver a los proyectos</a></p><h2>Créditos de las imágenes</h2>
      <p class="muted">Las <b>fotos reales</b> son de Wikimedia Commons, con licencia libre (CC0, CC BY o CC BY-SA); se muestran reducidas y servidas desde este portal. Las <b>ilustraciones 3D</b> (mecanismos, aparamenta, herramientas y montajes) son modelos propios, genéricos y sin marcas, hechos con las medidas y el marcado de bornes de las fichas técnicas de fabricantes habituales (Schneider, Simon, Niessen, Legrand, Hager, WAGO; herramientas tipo Bahco, Knipex o Wiha).</p>
      <table class="tbl vv-cred"><tr><th>Foto</th><th>Obra</th><th>Licencia</th><th>Origen</th></tr>${filas}</table>
      <h3 class="vv-sec">Fotos del resto del portal</h3><p class="muted small">Tarjetas de asignaturas, laboratorios, actividades y proyectos. Reducidas a 800 px; las de licencia CC BY-SA se comparten con la misma licencia.</p>
      <table class="tbl vv-cred"><tr><th>Foto</th><th>Obra</th><th>Licencia</th><th>Origen</th></tr>${filasPortal}</table>
      <h3 class="vv-sec">Iconos</h3><p class="small">Iconos de línea de <a href="https://lucide.dev" target="_blank" rel="noopener">Lucide</a> (licencia ISC), incluidos en el propio portal: no se descargan de ningún servidor externo.</p></div>`;
  },

  // ------------------------------------------------------------ lección
  abrirProyecto(P, paso = 0, montar = false) {
    this.proy = P; this.kind = montar ? 'proymontar' : 'proyecto'; this.modo = montar ? `p${P.n}-montar` : `p${P.n}`;
    const root = this.$('.vv'); root.dataset.modo = this.kind; ['es-casa', 'es-taller', 'es-montaje'].forEach((c) => root.classList.remove(c));
    this.tab = montar ? 'montar' : (this.tab && TABS_L.some(([k]) => k === this.tab) ? this.tab : 'pasos');
    this.$('#vvTitulo').innerHTML = `<span class="vv-pn">${P.n}</span><span>${esc(P.title)}</span>`;
    this.crumbs(); this.initScene(); this.vistaActiva = 'tablero'; this.activarControles();
    this.red = false; this.res = null; this.chk = null; this.sel = null; this.undoS = []; this.redoS = []; this.multi.a = this.multi.b = null; this.tool = 'mover';
    if (P.casa) { this.m = sanear({ v: 2, tablero: { w: 100, h: 70 }, parts: [], tubos: [], cables: [] }); }
    if (montar && !P.casa) { this.ro = !!this.rev; const g = this.rev ? null : lee('proy:' + P.n); this.m = sanear(g || modeloMontar(P)); this.pchk = null; }
    else { this.ro = true; this.paso = Math.min(paso, pasosDe(P).length - 1); if (!P.casa) this.m = modeloPaso(P, this.paso); }
    this._dimKey = null; this.cambio(false); this.vista(); this.resume(); this.stepbar(); this.strip();
  },
  irPaso(k) {
    const P = this.proy; if (!P) return; const S = pasosDe(P); this.paso = Math.max(0, Math.min(k, S.length - 1));
    const s = S[this.paso]; if (!P.casa) { this.m = modeloPaso(P, this.paso); this.sel = s.foco ? { k: 'parte', id: s.foco } : null; }
    this.res = null; this.cambio(false); this.stepbar();
    if (this.tab !== 'pasos') { this.tab = 'pasos'; this.lado(); }
    try { history.replaceState(null, '', `#eee/vivienda/p${P.n}-${this.paso + 1}`); } catch (e) { }
  },
  stepbar() {
    const el = this.$('#vvStep'), vt = this.$('#vvVT'); const on = this.kind === 'proyecto' && this.proy; if (!el) return;
    el.hidden = !on; vt.hidden = !(this.kind === 'proyecto' || this.kind === 'proymontar');
    if (this.proy) vt.innerHTML = `<span class="pill">${this.proy.n}</span><b>${esc(this.proy.title)}</b> · ${this.kind === 'proymontar' ? 'móntalo tú' : esc(this.proy.level)}`;
    if (!on) return; const S = pasosDe(this.proy); const k = this.paso;
    el.innerHTML = `<button class="btn" data-pv="prev" ${k === 0 ? 'disabled' : ''}>◀ Anterior</button><div class="mid"><div class="vv-sc">Paso ${k + 1} / ${S.length}</div><div class="vv-st">${esc(S[k].t)}</div><div class="dots">${S.map((s, i) => `<button class="${i === k ? 'on' : i < k ? 'done' : ''}" data-pv="paso" data-i="${i}" title="${esc(s.t)}"></button>`).join('')}</div></div>${k === S.length - 1 ? `<a class="btn primary" href="#eee/vivienda/p${this.proy.n}-montar">Montar tú ▶</a>` : '<button class="btn primary" data-pv="next">Siguiente ▶</button>'}`;
  },
  strip() {
    const el = this.$('#vvStrip'); if (!el) return; const on = this.kind === 'proyecto' || this.kind === 'proymontar'; el.hidden = !on; if (!on) return; const pr = progreso();
    el.innerHTML = PROYECTOS.map((P) => `<a class="ls ${this.proy?.n === P.n ? 'on' : ''}" href="#eee/vivienda/p${P.n}"><span class="num">${P.n}</span><span class="ic">${P.icon}</span><span class="nm">${esc(P.title)}</span>${pr[P.n]?.ok ? '<span class="vv-ok">✔</span>' : ''}</a>`).join('');
  },
  proyLado() {
    const S = this.$('#vvSide'); const P = this.proy; const T = this.kind === 'proymontar' ? TABS_M : TABS_L;
    if (!T.some(([k]) => k === this.tab)) this.tab = T[0][0];
    const extra = this.kind === 'proymontar' ? this.inspectorHTML() + this.simHTML() : this.sel && this.ro && this.sel.k === 'parte' ? this.inspLeccion() : '';
    S.innerHTML = `<div class="tabs">${T.map(([k, n]) => `<button data-tab="${k}" class="${this.tab === k ? 'on' : ''}">${n}</button>`).join('')}</div><div class="panel">${extra}${this.proyTab(P, this.tab)}</div>`;
  },
  inspLeccion() { const p = partePorId(this.m, this.sel.id); if (!p) return ''; return `<div class="vv-insp"><b>${esc(p.nombre || TIPOS[p.type].corto)}</b> <button class="vv-btn small" data-v="ver3d">🔍 Ver de cerca (bornes)</button></div>`; },
  proyTab(P, tab) {
    if (tab === 'pasos') return this.pasoHTML(P);
    if (tab === 'ficha') return this.fichaProyHTML(P);
    if (tab === 'material') return this.materialProyHTML(P);
    if (tab === 'esquema') return this.esquemaHTML(P);
    if (tab === 'prueba') return this.pruebaHTML(P);
    if (tab === 'reto') return this.retoHTML(P);
    if (tab === 'montar') return this.montarHTML(P);
    return '';
  },
  pasoHTML(P) {
    const S = pasosDe(P); const k = this.paso || 0; const s = S[k]; const g = progreso()[P.n] || {}; const elegida = (g.herr || {})[k];
    const cab = (s.cables || []).map((id) => tablaCables(P).find((c) => c.id === id)).filter(Boolean);
    const opts = s.opts || [s.herr]; const res = this._pick && this._pick.k === k ? this._pick : elegida ? { ok: true, id: s.herr } : null;
    const herrBtns = opts.map((o) => { const h = herrInfo(o); const est = res && res.id === o ? (res.ok ? ' ok' : ' ko') : ''; return `<button class="vv-hb${est}" data-pv="herr" data-h="${esc(o)}"><img src="${esc(h.img)}" alt="" loading="lazy"><span>${esc(h.n)}</span></button>`; }).join('');
    const H = herrInfo(s.herr); const r = res ? (res.ok ? `<div class="vv-hres ok">✔ <b>${esc(H.n)}</b>. ${s.por || ''}</div>` : `<div class="vv-hres ko">✖ <b>${esc(herrInfo(res.id).n)}</b> no es la herramienta de este paso: ${esc(herrInfo(res.id).para)} Vuelve a elegir.</div>`) : '<div class="vv-hres">Pulsa la herramienta que usarías en este paso.</div>';
    return `<div class="step-card"><div class="step-h"><span class="step-n">${k + 1}</span><div><div class="muted small">Paso ${k + 1} de ${S.length}</div><h3>${esc(s.t)}</h3></div></div>
      <div class="blk tool"><h4>🛠 ¿Qué herramienta usas?</h4><div class="vv-herrs">${herrBtns}</div>${r}</div>
      <div class="blk take"><h4>🧰 Coge</h4><ul>${(s.take || []).map((t) => `<li>${t}</li>`).join('')}</ul></div>
      <div class="blk do"><h4>🔧 Haz</h4><ol>${(s.do || []).map((t) => `<li>${t}</li>`).join('')}</ol>
      ${cab.length ? `<table class="tbl wires"><tr><th>Cable</th><th>Desde</th><th></th><th>Hasta</th></tr>${cab.map((c) => `<tr><td><span class="sw" style="background:${c.hex}${c.color === 'Amarillo-verde' ? ';background-image:repeating-linear-gradient(90deg,#3fae2a 0 4px,#f2d21b 4px 8px)' : ''}"></span><b>${esc(c.color)}</b><div class="muted small">${esc(c.sec)}</div></td><td>${esc(c.de)}</td><td class="arrow">→</td><td>${esc(c.a)}</td></tr>`).join('')}</table>` : ''}
      ${s.visor && !P.casa ? `<button class="vv-btn" data-pv="ver" data-id="${esc(s.visor)}">🔍 Ver ${esc(partePorId(this.m, s.visor)?.nombre || 'la pieza')} de cerca, con sus bornes</button>` : ''}
      ${s.prueba || s.tension ? '<button class="vv-btn" data-tab="prueba">📟 Ir a las medidas</button>' : ''}${P.casa && k === 0 ? '<a class="vv-btn primary" href="#eee/vivienda/casa">🏡 Abrir la vivienda</a>' : ''}</div>
      <div class="blk check"><h4>✅ Comprueba antes de seguir</h4><p>${s.check || ''}</p></div></div>
      <div class="steps-list">${S.map((x, i) => `<button class="sl ${i === k ? 'on' : ''}" data-pv="paso" data-i="${i}"><span>${(g.herr || {})[i] ? '✔' : i + 1}</span>${esc(x.t)}</button>`).join('')}</div>
      ${!P.casa ? `<div class="vv-cta"><a class="btn primary" href="#eee/vivienda/p${P.n}-montar">🔧 Montar tú este proyecto</a></div>` : ''}`;
  },
  fichaProyHTML(P) {
    return `<h3>Proyecto ${P.n}. ${esc(P.title)}</h3><p class="lead">${esc(P.intro)}</p>
      <div class="facts"><div><b>Nivel</b>${esc(P.level)}</div><div><b>Duración</b>${esc(P.duration)}</div><div><b>Circuito</b>${esc(P.circuito)}</div></div>
      ${P.caution ? `<div class="caution">⚠️ <b>Precaución.</b> ${esc(P.caution)}</div>` : ''}
      <h4>Objetivos</h4><ul>${P.objectives.map((o) => `<li>${esc(o)}</li>`).join('')}</ul>
      <h4>Colores y secciones (REBT)</h4><table class="tbl"><tr><th>Conductor</th><th>Color</th></tr><tr><td>Fase (y retorno)</td><td>Marrón, negro o gris</td></tr><tr><td>Neutro</td><td>Azul</td></tr><tr><td>Protección (tierra)</td><td>Amarillo-verde</td></tr></table>
      <table class="tbl"><tr><th>Circuito</th><th>PIA</th><th>Sección</th><th>Tubo</th></tr><tr><td>C1 alumbrado</td><td>10 A</td><td>1,5 mm²</td><td>Ø16</td></tr><tr><td>C2 tomas de uso general</td><td>16 A</td><td>2,5 mm²</td><td>Ø20</td></tr></table>
      <h4>Seguridad</h4><ul class="safety"><li>Trabaja siempre sin tensión: la manguera la enchufa solo el profesor.</li><li>Gafas al cortar, pelar y taladrar.</li><li>Destornilladores aislados 1000 V con la punta que encaja en el tornillo.</li><li>Antes de dar tensión, mide con el polímetro en Ω que no hay cortocircuito.</li></ul>`;
  },
  materialProyHTML(P) {
    const fila = ([k, n, nota]) => { const x = MATERIAL[k]; if (!x) return ''; return `<div class="vv-mt"><div class="vv-mti"><img src="img/viv/el/${esc(x.img)}.png" alt="${esc(x.n)} (ilustración 3D)" loading="lazy">${x.foto ? `<img src="${esc(x.foto)}" alt="${esc(x.n)} (foto real)" loading="lazy" class="foto">` : ''}</div>
      <div><b>${n} × ${esc(x.n)}</b>${nota ? ` <span class="muted small">(${esc(nota)})</span>` : ''}<div class="small"><b>Bornes:</b> ${esc(x.bornes)}</div><div class="muted small">${esc(x.ref)}</div></div></div>`; };
    const herr = (P.herramientas || []).map((id) => { const h = herrInfo(id === 'destornillador' ? 'destornillador:PZ1' : id); return `<div class="vv-ht"><img src="${esc(h.img)}" alt="" loading="lazy"><div><b>${esc(herramienta(id)?.n || h.n)}</b><div class="muted small">${esc(herramienta(id)?.para || '')}</div></div></div>`; }).join('');
    return `<h4>Material</h4><div class="vv-mats">${P.material.map(fila).join('')}</div><p class="muted small">Izquierda: modelo 3D del laboratorio (por detrás, con sus bornes). Derecha: foto real (ver <a href="#eee/vivienda/creditos">créditos</a>).</p>
      <h4>Herramientas</h4><div class="vv-hts">${herr}</div>`;
  },
  esquemaHTML(P) {
    if (P.casa) return '<p>El esquema se hace en la propia vivienda (modo «Vivienda real»).</p>';
    const m = solucion(P); const T = tablaCables(P, m);
    return `<h4>Plano de montaje</h4><div class="schem-wrap vv-plano-w">${planoSVG(m)}</div><p class="muted small">Cada línea es un cable con su color real (más gruesa = 2,5 mm²). Los puntos dorados son bornes con su marcado; los naranjas, fichas de palanca dentro de la caja de empalme.</p>
      <h4>Tabla de cableado</h4><table class="tbl wires"><tr><th>#</th><th>Cable</th><th>Desde</th><th>Hasta</th></tr>${T.map((c, i) => `<tr><td class="c">${i + 1}</td><td><span class="sw" style="background:${c.hex}"></span>${esc(c.color)} <span class="muted small">${esc(c.sec)}</span></td><td class="small">${esc(c.de)}</td><td class="small">${esc(c.a)}</td></tr>`).join('')}</table>`;
  },
  pruebaHTML(P) {
    if (!P.pruebas?.length) return '<p>Las pruebas se hacen en la vivienda: pulsa «Comprobar» y da la luz.</p>';
    const enMontaje = this.kind === 'proymontar'; const R = this._medidas || {};
    return `<h4>Funcionamiento esperado</h4><p>${esc(P.short)}</p><h4>Medidas ${enMontaje ? 'en tu montaje' : 'con el polímetro y el buscapolos'}</h4>
      <p class="muted small">${enMontaje ? 'Se mide en TU montaje, con los mandos en la posición indicada. Compara con el valor esperado.' : 'Pulsa «Medir» para ver la lectura en el montaje de referencia.'} Ω = sin tensión (manguera desenchufada); V y buscapolos = con tensión.</p>
      <table class="tbl vv-pr"><tr><th>Medida</th><th>Esperado</th><th>Lectura</th></tr>${P.pruebas.map((pr, i) => { const r = R[P.n + ':' + i + ':' + this.kind]; return `<tr><td><b>${pr.modo === 'ohm' ? '📟 Ω' : pr.modo === 'V' ? '📟 V~' : '🔦'}</b> ${esc(pr.t)}</td><td>${esc(pr.espera)}</td><td>${r ? `<span class="vv-lcd2 ${r.ok ? 'ok' : 'ko'}">${esc(r.txt)}</span>` : `<button class="vv-btn small" data-pv="medir" data-i="${i}">Medir</button>`}</td></tr>`; }).join('')}</table>
      ${enMontaje ? '' : `<div class="note">En el montaje 3D puedes enchufar la manguera y accionar los mecanismos: <a href="#eee/vivienda/p${P.n}-montar">móntalo tú</a> y prueba.</div>`}`;
  },
  medirPr(i) {
    const P = this.proy; const pr = P.pruebas[i]; if (!pr) return;
    const r = this.kind === 'proymontar' ? medirPrueba(P, pr, this.m) : medirPrueba(P, pr);
    this._medidas = { ...(this._medidas || {}), [P.n + ':' + i + ':' + this.kind]: r };
    if (this.kind === 'proyecto' && pr.modo !== 'bp') { const ref = (s) => { const [p, t] = s.split(':'); return { p, t }; }; const m = aplicar(solucion(P), pr.estado || {}); this.m = m; this.red = pr.modo === 'V'; this.cambio(false); this.multi.modo = pr.modo === 'ohm' ? 'ohm' : 'V'; this.multi.a = ref(pr.a); this.multi.b = ref(pr.b); this.multi.txt = r.txt; this.construir(); }
    this.lado();
  },
  retoHTML(P) {
    const g = progreso()[P.n] || {}; const Q = g.quiz || {}; const hechas = Object.keys(Q).length; const bien = Object.values(Q).filter(Boolean).length;
    let h = `<h4>Reto · comprueba lo aprendido</h4>${P.quiz.map((q, i) => { const r = Q[i]; return `<div class="vv-q"><b>${i + 1}. ${esc(q.q)}</b><div class="vv-qo">${q.op.map((o, j) => `<button class="vv-btn ${r != null && j === q.ok ? 'ok' : ''} ${this._qmal === i + ':' + j ? 'ko' : ''}" data-pv="quiz" data-i="${i}" data-j="${j}" ${r != null ? 'disabled' : ''}>${esc(o)}</button>`).join('')}</div>${r != null ? `<div class="small ${r ? 'ok' : 'ko'}">${r ? '✔ Correcto.' : '✖ Fallaste a la primera.'} ${esc(q.exp)}</div>` : ''}</div>`; }).join('')}
      <p><b>${bien} / ${P.quiz.length}</b> a la primera${hechas === P.quiz.length ? ' · reto terminado' : ''}.</p>`;
    if (!P.casa) h += `<h4>Entrega</h4><p class="small">Cuando montes el proyecto y la comprobación salga bien, entrégalo desde la pestaña <b>Montaje</b> del modo «Montar tú». Se envía junto con el resto de proyectos (práctica «Proyectos de vivienda»).</p><a class="btn primary" href="#eee/vivienda/p${P.n}-montar">🔧 Montar tú</a>`;
    return h;
  },
  montarHTML(P) {
    if (this.ro && this.rev) return this.revisionProyHTML();
    const R = this.pchk; const g = progreso()[P.n] || {};
    let h = `<h3>Móntalo tú · ${esc(P.title)}</h3><p class="small">Las cajas, los mecanismos y los tubos ya están colocados. Tira los cables de borne a borne (pulsa un borne dorado y luego otro) con el <b>color</b> y la <b>sección</b> del plano. Mira cada pieza por detrás con «🔍 Ver en 3D» para ver su marcado.</p>
      <ol class="small"><li>Elige el color y la sección en la paleta (izquierda).</li><li>Cablea siguiendo la pestaña <b>Esquema</b>.</li><li>${this.realista ? 'Pela (🧤) y aprieta (🪛 con la punta correcta) cada borne.' : 'Con «Montaje realista» desactivado, las puntas se preparan solas.'}</li><li>Pulsa <b>Comprobar</b>: se prueba como en la realidad, en todas las posiciones de los mandos.</li><li>Enchufa la manguera (⚡) y acciona los mecanismos.</li></ol>
      <div class="vv-fila"><button class="vv-btn primary" data-pv="comprobar">✔ Comprobar mi montaje</button><button class="vv-btn small" data-pv="reiniciar">↺ Empezar de nuevo</button><a class="vv-btn small" href="#eee/vivienda/p${P.n}">← Volver a la lección</a></div>`;
    if (R) {
      const malos = R.items.filter((i) => !i.ok);
      h += `<div class="vv-check ${R.ok ? 'ok' : 'ko'}"><div class="vv-ch">${R.ok ? '✅ ¡Funciona y cumple las normas!' : `❌ ${malos.length} cosa${malos.length > 1 ? 's' : ''} por corregir`}</div><ul>${R.items.map((i) => `<li class="${i.ok ? 'ok' : 'ko'}">${i.ok ? '✔' : '✖'} ${esc(i.t)}${!i.ok && i.fallos?.length > 1 ? `<ul>${i.fallos.slice(1, 5).map((f) => `<li>${esc(f)}</li>`).join('')}</ul>` : ''}</li>`).join('')}</ul>
        ${R.pistas?.length ? `<div class="vv-pistas"><b>💡 Pistas (compara con el esquema):</b><ul>${R.pistas.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>` : ''}</div>`;
    } else if (g.ok) h += '<p class="ok">✔ Ya lo montaste bien una vez.</p>';
    if (portal()?.rol === 'alumno') h += this.entregaProyHTML();
    return h;
  },
  comprobarProy() {
    const P = this.proy; const R = comprobarProyecto(P, this.m, { realista: this.realista }); this.pchk = R;
    const malos = new Set(), tubos = new Set(); for (const i of R.items) if (!i.ok) { (i.cables || []).forEach((c) => malos.add(c)); (i.tubos || []).forEach((t) => tubos.add(t)); }
    this.chk = { ok: R.ok, items: R.items, cables: malos, tubos };
    if (R.ok) { setProg(P.n, (g) => { g.ok = true; }); guarda('proyok:' + P.n, this.m); this.strip(); }
    this.construir(); this.lado(); return R;
  },
  entregaProyHTML() {
    const P = portal(); if (!P) return ''; const e = P.estadoEntrega?.(PRACTICA_PROY); const pr = progreso(); const n = PROYECTOS.filter((x) => pr[x.n]?.ok).length;
    if (this._entregando) return '<div class="vv-ent"><button class="vv-red" disabled>📤 Enviando…</button></div>';
    return `<div class="vv-ent"><h4>Entrega · Proyectos de vivienda</h4><p class="small">Se envían todos tus proyectos montados (${n} de ${PROYECTOS.length - 1}) con su comprobación y el reto, solo con tu grupo y tu número de lista.</p>
      ${e ? `<div>📤 <b>Entregado</b>${e.nota != null ? ` · Nota: <b>${String(e.nota).replace('.', ',')}</b>` : ' · pendiente de corregir'}</div>${e.comentario ? `<div class="small">💬 ${esc(e.comentario)}</div>` : ''}` : ''}
      ${!e || e.nota == null ? `<button class="vv-red" data-pv="entregar">📤 ${e ? 'Volver a entregar' : 'Entregar al profesor'}</button>` : ''}</div>`;
  },
  entregarProy() {
    const Pt = portal(); if (!Pt || this._entregando) return; const pr = progreso(); const proyectos = {};
    for (const P of PROYECTOS) { if (P.casa) continue; const model = lee('proyok:' + P.n) || lee('proy:' + P.n); if (!model && !pr[P.n]) continue;
      const R = model ? comprobarProyecto(P, sanear(model), { realista: false }) : null; const q = pr[P.n]?.quiz || {};
      proyectos[P.n] = { ok: !!R?.ok, quiz: `${Object.values(q).filter(Boolean).length}/${P.quiz.length}`, model: model || null }; }
    const items = PROYECTOS.filter((P) => !P.casa).map((P) => ({ t: `Proyecto ${P.n} · ${P.title}: ${proyectos[P.n] ? (proyectos[P.n].ok ? 'montado y correcto' : 'empezado, con fallos') : 'sin hacer'}${proyectos[P.n] ? ` · reto ${proyectos[P.n].quiz}` : ''}`, ok: !!proyectos[P.n]?.ok }));
    let json = JSON.stringify({ app: 'laboratorio-vivienda', version: 3, practica: PRACTICA_PROY, proyectos });
    if (json.length > 199000) { for (const k of Object.keys(proyectos)) if (!proyectos[k].ok) proyectos[k].model = null; json = JSON.stringify({ app: 'laboratorio-vivienda', version: 3, practica: PRACTICA_PROY, proyectos }).slice(0, 199000); }
    const datos = { montaje: json, comprobacion: { ok: items.every((i) => i.ok), items }, aciertos: `${items.filter((i) => i.ok).length}/${items.length}` };
    this._entregando = true; this.lado();
    Pt.entregar({ practica: PRACTICA_PROY, tipo: 'vivienda', titulo: 'Vivienda · Proyectos paso a paso', datos })
      .then(() => this.toast('📤 ¡Entregado al profesor!'), (e) => this.toast('❌ No se ha podido entregar: ' + esc(e?.mensaje || 'revisa la conexión.'), 5000))
      .finally(() => { this._entregando = false; this.lado(); });
  },
  // revisión de una entrega v5 (profesor)
  reviewProy(rev, datos) {
    this.revProy = datos.proyectos || {}; const ns = Object.keys(this.revProy).map(Number).sort((a, b) => a - b);
    const n = this._revN && this.revProy[this._revN] ? this._revN : ns.find((k) => this.revProy[k]?.model) || ns[0] || 1; this._revN = n;
    const P = proyecto('p' + n) || PROYECTOS[0]; this.proy = P; this.kind = 'proymontar'; this.modo = 'revision'; this.ro = true; this.tab = 'montar';
    const mod = this.revProy[n]?.model; this.m = sanear(mod || modeloMontar(P)); this.pchk = mod ? comprobarProyecto(P, this.m, { realista: false }) : null;
    const root = this.$('.vv'); root.dataset.modo = 'proymontar';
    this.$('#vvTitulo').innerHTML = `<span class="vv-pn">Revisión</span><span>${esc(rev.quien || '')} · Proyectos de vivienda</span>`;
    this.vistaActiva = 'tablero'; this.initScene(); this.activarControles(); this._dimKey = null; this.cambio(false); this.vista(); this.resume(); this.stepbar(); this.strip();
  },
  revisionProyHTML() {
    const L = this.revProy || {}; const R = this.pchk;
    return `${this.revisionHTML()}<h4>Proyectos entregados</h4><div class="vv-revp">${PROYECTOS.filter((P) => !P.casa).map((P) => { const x = L[P.n]; return `<button class="vv-btn small ${this._revN === P.n ? 'primary' : ''}" data-pv="revp" data-n="${P.n}" ${x ? '' : 'disabled'}>${P.n} ${x ? (x.ok ? '✔' : '✖') : '—'}${x ? ' · reto ' + esc(x.quiz) : ''}</button>`; }).join('')}</div>
      ${R ? `<div class="vv-check ${R.ok ? 'ok' : 'ko'}"><div class="vv-ch">Proyecto ${this._revN}: ${R.ok ? '✅ correcto' : '❌ con fallos'}</div><ul>${R.items.filter((i) => !i.ok).map((i) => `<li class="ko">✖ ${esc(i.t)}</li>`).join('')}</ul></div>` : '<p class="small">Sin montaje de este proyecto.</p>'}`;
  },
  // solución del proyecto en el montaje (profesor y pruebas automáticas)
  solucionProy() { const P = this.proy; if (!P || P.casa) return false; this.guardarUndo(); this.m = sanear(solucion(P)); this.red = false; this.pchk = null; this._dimKey = null; this.cambio(); return true; },
  onClickProy(t) {
    const b = t.closest('[data-pv]'); if (!b) return false; const v = b.dataset.pv; const P = this.proy;
    if (v === 'prev') this.irPaso(this.paso - 1);
    else if (v === 'next') this.irPaso(this.paso + 1);
    else if (v === 'paso') this.irPaso(+b.dataset.i);
    else if (v === 'herr') { const S = pasosDe(P); const s = S[this.paso]; const ok = b.dataset.h === s.herr; this._pick = { k: this.paso, id: b.dataset.h, ok };
      if (ok) { setProg(P.n, (g) => { g.herr = g.herr || {}; g.herr[this.paso] = true; }); const id = s.foco || s.visor; const c = id && posParte(this.m, id); const h = herrInfo(s.herr); if (c) this.animHerr(h.id, c, TIPOS[partePorId(this.m, id)?.type]?.modulo ? 7 : 4, { escala: h.id === 'taladro' ? 0.45 : 0.6 }); }
      this.lado(); }
    else if (v === 'ver') { this.ver3D(b.dataset.id); }
    else if (v === 'medir') this.medirPr(+b.dataset.i);
    else if (v === 'quiz') { const i = +b.dataset.i, j = +b.dataset.j; const q = P.quiz[i]; const g = progreso()[P.n] || {}; const Q = g.quiz || {};
      this._qfail = this._qfail || new Set(); if (j === q.ok) { const ok = !this._qfail.has(P.n + ':' + i); setProg(P.n, (x) => { x.quiz = { ...(x.quiz || {}), [i]: ok }; }); this._qmal = null; } else { this._qfail.add(P.n + ':' + i); this._qmal = i + ':' + j; } void Q; this.lado(); }
    else if (v === 'comprobar') this.comprobarProy();
    else if (v === 'reiniciar') { if ((this.opts.confirm || confirm)('¿Empezar el montaje de este proyecto desde el principio?')) { this.guardarUndo(); this.m = sanear(modeloMontar(P)); this.pchk = null; this.red = false; this.cambio(); } }
    else if (v === 'entregar') this.entregarProy();
    else if (v === 'revp') { this._revN = +b.dataset.n; this.reviewProy(this.rev, { proyectos: this.revProy }); }
    return true;
  },
};
export function instalarProyectos(C) { Object.assign(C.prototype, M); }
export { PROYECTOS };

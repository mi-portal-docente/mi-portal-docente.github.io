// Prácticas del tablero una a una (lista como la de Circuitos, guiada y autónoma, candados del profesor) sobre ViviendaLab.
// Se instala con instalarPracticas(ViviendaLab). Los datos y la corrección están en practicas.js.
import { PRACTICAS, practica, modeloInicial, modeloSolucion, estadoPasos, cableHecho, comprobarPractica, textoCable, APARATOS, CIRCUITOS_VIV, ACCIONES, proyDe, conReserva } from './practicas.js';
import { vivAbierta, alternarViv } from '../circ/guiadas.js';
import { sanear, varianteMarcas } from './modelo.js';
import { planoSVG, tablaCables } from './proyectos.js';
import { ic } from '../ui/iconos.js';
import { guiaDe } from './practicas-guia.js';

const esc = (t) => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const portal = () => (typeof window !== 'undefined' ? window.PORTAL : null);
const LS = 'viv:v1:';
const lee = (k) => { try { return JSON.parse(localStorage.getItem(LS + k)); } catch (e) { return null; } };
const guarda = (k, v) => { try { localStorage.setItem(LS + k, JSON.stringify(v)); } catch (e) { } };
export const ENTREGA_PR = 'v6';
const alumno = () => portal()?.rol === 'alumno';
// candado del profesor (sin token, todas abiertas) · progreso local o recuperado de la entrega
export const abiertaPr = (id) => !alumno() || vivAbierta(window.PORTAL_SESION?.apartados, id);
function deEntrega() { try { const e = portal()?.estadoEntrega?.(ENTREGA_PR); const j = e?.datos?.montaje ? JSON.parse(e.datos.montaje) : null; return j?.practicas || {}; } catch (e) { return {}; } }
export const guiadaHechaPr = (id) => !!lee('pr:done:' + id) || !!deEntrega()[id]?.guiada;
export const autoHechaPr = (id) => !!lee('pr:auto:' + id) || !!deEntrega()[id]?.autonoma;
// ¿Hay algo completado que todavía no está en el registro enviado?
const pendientePr = () => PRACTICAS.some((p) => (guiadaHechaPr(p.id) && !deEntrega()[p.id]?.guiada) || (autoHechaPr(p.id) && !deEntrega()[p.id]?.autonoma));
const profGrupos = () => (portal()?.rol === 'profesor' && portal()?.circ?.grupos?.()) || [];
// Temas de la portada (como los de Circuitos): las 7 prácticas en orden
const TEMAS_PR = [{ tema: 1, title: 'El cuadro de la vivienda', ids: ['vp1'] }, { tema: 2, title: 'Puntos de luz', ids: ['vp2', 'vp3', 'vp7'] }, { tema: 3, title: 'Tomas de corriente y cajas de registro', ids: ['vp4', 'vp5'] }, { tema: 4, title: 'La instalación completa', ids: ['vp6'] }];
const ICONO_ACC = { red: 'zap', test: 'shield-check', sobrecarga: 'thermometer', corto: 'flame', fuga: 'shield-check' };

// Pruebas de disparo del cuadro (qué hace saltar a cada aparato)
const DISPAROS = [
  { i: 'shield-check', n: 'Botón T del diferencial', txt: 'Al pulsarlo se crea una pequeña fuga a propósito: el diferencial tiene que saltar. Se prueba una vez al mes.' },
  { i: 'shield-check', n: 'Fuga a tierra', txt: 'Una fase que toca la carcasa metálica deriva corriente por la tierra: si pasa de 30 mA, salta el diferencial antes de que sea peligroso.' },
  { i: 'thermometer', n: 'Sobrecarga', txt: 'Demasiados aparatos en un circuito (más corriente que su calibre): salta la parte térmica del PIA al cabo de un rato.' },
  { i: 'flame', n: 'Cortocircuito', txt: 'Fase y neutro se tocan: la corriente se dispara y salta al instante la parte magnética del PIA (o el IGA).' },
];
// Cuadro tipo de la ITC-BT-25 en HTML (texto real, legible en el móvil): IGA, diferencial y PIAs C1…C5 con su serigrafía y el peine
function cuadroSVG() {
  const M = [{ t: 'IGA', l: ['C25', '6000'], w: 2, k: 'iga' }, { t: 'ID', l: ['40 A', '30 mA'], w: 2, k: 'id', T: true },
    ...CIRCUITOS_VIV.map((c) => ({ t: c.c, l: ['C' + c.pia, '6000'], w: 1, k: 'pia', u: c.uso }))];
  const mod = (m) => `<div class="vv-cqm vv-cq-${m.k} ${m.w === 2 ? 'w2' : ''}" title="${esc(m.u || m.t)}">${m.T ? '<span class="vv-cqt">T</span>' : ''}<span class="vv-cqp"></span><b>${m.t}</b><span>${m.l[0]}</span><small>${m.l[1]}</small></div>`;
  return `<div class="vv-cq" role="img" aria-label="Cuadro con IGA de 25 A, diferencial de 40 A y 30 mA y cinco PIAs: C1 10 A, C2 16 A, C3 25 A, C4 20 A y C5 16 A">
    <div class="vv-cqg">${M.slice(0, 2).map(mod).join('')}</div><div class="vv-cqg vv-cqpias"><i class="vv-cqpeine">peine</i>${M.slice(2).map(mod).join('')}</div></div>`;
}

const M = {
  // ------------------------------------------------------------ lista (como la de Circuitos)
  grupoCandPr() { const G = profGrupos(); if (!G.length) return null; const id = lee('pref:grupoCand'); return { G, g: G.find((x) => x.id === id) || G[0] }; },
  candadoPrHTML(Pr) {
    const C = this.grupoCandPr(); if (!C) return ''; const ab = vivAbierta(C.g.apartados, Pr.id);
    const t = `Práctica ${Pr.n} · ${ab ? 'abierta' : 'cerrada'} para ${C.g.nombre}. Pulsa para ${ab ? 'cerrarla' : 'abrirla'}.`;
    return `<button type="button" class="cx-cand ${ab ? 'ab' : 'ce'}" data-prlock="${esc(Pr.id)}" aria-pressed="${!ab}" aria-label="${esc(t)}" title="${esc(t)}">${ic(ab ? 'lock-open' : 'lock')}</button>`;
  },
  // Portada como la de Circuitos 3D: pestañas, barra de candados del grupo y tarjetas por temas (cx-card)
  grupoBarPrHTML() {
    const C = this.grupoCandPr(); if (!C) return '';
    return `<div class="cx-gbar">${ic('users')}<label>Candados para el grupo <select data-vvgrupo aria-label="Grupo al que afectan los candados">${C.G.map((g) => `<option value="${esc(g.id)}" ${g.id === C.g.id ? 'selected' : ''}>${esc(g.nombre)}</option>`).join('')}</select></label>
      <span class="cx-small">Pulsa el candado de cada tarjeta para abrirla o cerrarla a <b>${esc(C.g.nombre)}</b>. Es lo mismo que Panel → Grupos → «Prácticas guiadas».</span></div>`;
  },
  tabsPrHTML() {
    const ev = this.homeTab === 'eval';
    return `<nav class="cx-htabs" role="tablist" aria-label="Secciones del laboratorio"><a role="tab" href="#eee/vivienda" aria-selected="${!ev}" class="${!ev ? 'on' : ''}">${ic('book-open')} Prácticas guiadas</a><a role="tab" href="#eee/vivienda/evaluacion" aria-selected="${ev}" class="${ev ? 'on' : ''}">${ic('clipboard-check')} Evaluación de vivienda</a></nav>`;
  },
  primeraPr() { return PRACTICAS.find((p) => abiertaPr(p.id) && !guiadaHechaPr(p.id)) || PRACTICAS.find((p) => abiertaPr(p.id)) || null; },
  homePracticasHTML() {
    const C = this.grupoCandPr(); const bloq = PRACTICAS.some((p) => !abiertaPr(p.id));
    const card = (Pr) => {
      const ab = abiertaPr(Pr.id); const g = guiadaHechaPr(Pr.id), a = autoHechaPr(Pr.id); const pc = C && !vivAbierta(C.g.apartados, Pr.id);
      const empezada = !g && lee('pr:m:' + Pr.id)?.cables?.length; const tag = ab ? 'a' : 'div';
      return `<${tag} class="cx-card vv-prc ${g ? 'done' : ''} ${ab ? '' : 'locked'} ${pc ? 'cerrada' : ''}" ${ab ? `href="#eee/vivienda/${Pr.id}"` : 'aria-disabled="true"'}>
        <div class="cx-card-h"><span class="cx-num">${Pr.n}</span><span class="cx-ic">${ic(Pr.icon)}</span>${!ab ? `<span class="cx-badge">${ic('lock')} Bloqueada</span>` : pc ? `<span class="cx-badge" title="Cerrada para ${esc(C.g.nombre)}">Cerrada</span>` : empezada ? '<span class="cx-badge">En curso</span>' : ''}${this.candadoPrHTML(Pr)}</div>
        <h3>${esc(Pr.title)}</h3><div class="cx-sub">${esc(Pr.sub)}</div>
        <div class="cx-meta"><span>${esc(Pr.level)}</span><span>${ic('clock')} ${esc(Pr.duration)}</span><span>${esc(Pr.norma)}</span></div>${ab && g ? `<div class="cx-lvl"><span class="cx-badge ok">${ic('check')} Guiada completada</span>${a ? `<span class="cx-badge ok">${ic('check')} Autónoma completada</span>` : '<span class="cx-badge">Autónoma pendiente</span>'}</div>` : ''}</${tag}>`;
    };
    return `<section class="vv-prs" id="vvPracticas"><h2>Prácticas guiadas <small>de dificultad creciente</small></h2>
      <p class="cx-ev-intro">Cada práctica se monta en el tablero 3D. Primero la <b>guiada</b>: la teoría del REBT, el esquema, el material y los pasos, que el simulador comprueba uno a uno. Cuando la completas se abre la <b>autónoma</b>: el mismo montaje tú solo, sin pasos ni pistas.${alumno() ? ' Tu progreso queda registrado para tu profesor.' : ''}</p>
      ${bloq ? `<p class="cx-bloq-aviso">${ic('lock')} Tu profesor va desbloqueando las prácticas una a una. Las que tienen candado se abrirán más adelante.</p>` : ''}
      ${TEMAS_PR.map((T) => `<h3 class="cx-tema"><span>Tema ${T.tema}</span> ${esc(T.title)}</h3><div class="cx-cards vv-prcards">${PRACTICAS.filter((p) => T.ids.includes(p.id)).map(card).join('')}</div>`).join('')}
      ${alumno() ? this.registroPrHTML() : ''}</section>`;
  },
  async alternarCandadoPr(id, btn) {
    const C = this.grupoCandPr(); const P = portal(); if (!C || !P?.circ || this._candando) return;
    const abrir = !vivAbierta(C.g.apartados, id); const nuevos = alternarViv(C.g.apartados, id, abrir, PRACTICAS.map((p) => p.id));
    this._candando = true; if (btn) btn.disabled = true;
    try { await P.circ.guardarApartados(C.g.id, nuevos); this.toast(`Práctica ${practica(id)?.n} ${abrir ? 'abierta' : 'cerrada'} para ${esc(C.g.nombre)}.`, 2500); }
    catch (e) { this.toast('No se ha podido guardar: ' + esc(e?.message || 'revisa la conexión.'), 5000); }
    finally { this._candando = false; if (this.kind === 'home') this.$('#vvHome').innerHTML = this.homeHTML(); }
  },
  // ------------------------------------------------------------ abrir una práctica
  rutaPractica(v) { const m = /^(vp\d{1,2})(-auto)?$/.exec(v || ''); if (!m) return null; const Pr = practica(m[1]); return Pr ? { Pr, auto: !!m[2] } : null; },
  abrirPractica(Pr, auto) {
    if (!abiertaPr(Pr.id)) { setTimeout(() => this.toast('Esta práctica todavía está cerrada: la abrirá tu profesor.', 4000), 200); location.hash = '#eee/vivienda'; return; }
    if (auto && alumno() && !guiadaHechaPr(Pr.id)) { setTimeout(() => this.toast('Primero termina la guiada (todos los pasos en verde y «Comprobar» bien). Después podrás hacerla tú solo.', 4500), 200); location.hash = '#eee/vivienda/' + Pr.id; return; }
    const modo = Pr.id + (auto ? '-auto' : ''); const mismo = this.kind === 'practica' && this.modo === modo;
    varianteMarcas(true);
    this.pr = Pr; this.prAuto = auto; this.kind = 'practica'; this.modo = modo; this.proy = null; this.rev = null; this.ro = false;
    const root = this.$('.vv'); root.dataset.modo = 'practica'; ['es-casa', 'es-taller', 'es-montaje', 'es-proy'].forEach((c) => root.classList.remove(c));
    this.$('#vvTitulo').innerHTML = `<span class="vv-pn">${Pr.n}</span><span>${esc(Pr.title)}${auto ? ' · autónoma' : ''}</span>`;
    this.crumbs(); this.initScene(); this.vistaActiva = 'tablero'; this.activarControles(); this.stepbar(); this.strip();
    if (!mismo) {
      this.red = false; this.test = false; this.res = null; this.chk = null; this.prchk = null; this.sel = null; this.undoS = []; this.redoS = []; this.multi.a = this.multi.b = null; this.tool = 'mover'; this.tapas = false;
      this.m = sanear(conReserva(Pr, lee('pr:m:' + modo) || modeloInicial(Pr))); this.prAcc = lee('pr:acc:' + modo) || {};
      this.tab = auto ? 'enunciado' : 'guia'; this._dimKey = null;
    }
    this.cambio(false); this.vista(); this.resume();
  },
  // acciones vistas en el simulador (dar tensión, botón T, sobrecarga, cortocircuito, fuga)
  notarAcciones() {
    if (this.kind !== 'practica' || !this.red || !this.res) return; const A = this.prAcc || (this.prAcc = {}); const D = this.res.disparos || []; const antes = JSON.stringify(A);
    const luz = (this.res.bombillas || []).some((b) => b.luz > 0.3) || (this.res.enchufes || []).some((e) => e.v > 200);
    if (!D.length && luz) A.red = true;
    if (D.some((d) => d.por === 'test')) A.test = true;
    if (D.some((d) => d.por === 'sobrecarga')) A.sobrecarga = true;
    if (D.some((d) => d.por === 'corto')) A.corto = true;
    if (D.some((d) => d.por === 'fuga') && !this.test) A.fuga = true;
    if (JSON.stringify(A) !== antes) guarda('pr:acc:' + this.modo, A);
  },
  // ------------------------------------------------------------ panel lateral
  practicaLado() {
    const S = this.$('#vvSide'); const Pr = this.pr; const auto = this.prAuto;
    const T = [[auto ? 'enunciado' : 'guia', auto ? 'Enunciado' : 'Guía'], ['esquema', 'Esquema'], ['norma', 'REBT']];
    if (!T.some(([k]) => k === this.tab)) this.tab = T[0][0];
    const cuerpo = this.tab === 'esquema' ? this.esquemaPrHTML(Pr) : this.tab === 'norma' ? this.normaPrHTML(Pr) : auto ? this.enunciadoPrHTML(Pr) : this.guiaPrHTML(Pr);
    S.innerHTML = `${this.inspectorHTML()}${this.simHTML()}<nav class="vv-tabs">${T.map(([k, n]) => `<button data-tab="${k}" class="${this.tab === k ? 'on' : ''}">${n}</button>`).join('')}</nav><div class="vv-tab vv-prtab">${cuerpo}</div>`;
  },
  // Guía con la misma estructura que la de Circuitos 3D (guideHTML): cabecera, progreso, desplegables de objetivo y
  // teoría, esquema, material y normativa; pasos en orden con su «por qué»; comprobar; autónoma; preguntas; reto.
  cabeceraPrHTML(Pr, extra = '') {
    return `<div class="cx-gh"><span class="cx-num">${Pr.n}</span><div><h3>${esc(Pr.title)}${extra}</h3><div class="cx-small">${esc(Pr.sub)} · ${esc(Pr.level)} · ${esc(Pr.duration)}</div></div></div>`;
  },
  materialPrHTML(G) { return `<table class="cx-tbl">${(G?.material || []).map(([m, n]) => `<tr><td>${esc(m)}</td><td class="c">${esc(String(n))}</td></tr>`).join('')}</table>`; },
  guiaPrHTML(Pr) {
    const G = guiaDe(Pr.id) || {}; const E = estadoPasos(Pr, this.m, this.prAcc); const k = E.findIndex((x) => !x.ok); const todos = k < 0;
    const hechos = E.filter((x) => x.ok).length, total = E.length; const ini = hechos === 0;
    let h = `<div class="cx-panel vv-cxguia">${this.cabeceraPrHTML(Pr)}
      <div class="cx-prog vv-prog" role="progressbar" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${hechos}"><div style="width:${Math.round((100 * hechos) / total)}%"></div><span>${hechos} / ${total} pasos</span></div>
      <details ${ini ? 'open' : ''} class="vv-gd-teo"><summary>${ic('target')} Objetivo y teoría</summary><p>${esc(G.objetivo || Pr.intro)}</p>${G.teoria ? `<p class="cx-theory">${G.teoria}</p>` : ''}<div class="vv-prcirc">${ic('zap')} ${esc(Pr.circuito)}</div></details>
      <details class="vv-gd-esq"><summary>${ic('drafting-compass')} Esquema de montaje</summary><div class="vv-plano">${planoSVG(modeloSolucion(Pr))}</div><p class="cx-small">Fase: marrón, negro o gris · neutro: azul · tierra: amarillo-verde. La lista de cables está en la pestaña «Esquema».</p></details>
      <details class="vv-gd-mat"><summary>${ic('toolbox')} Material</summary>${this.materialPrHTML(G)}</details>
      <details class="vv-gd-rebt"><summary>${ic('book-open-check')} Normativa (REBT)</summary><p><b>${esc(Pr.norma)}</b>. ${esc(Pr.intro)}</p><p class="cx-small">Reglamento Electrotécnico para Baja Tensión (RD 842/2002) y sus ITC. Más detalle en la pestaña «REBT».</p></details>
      <h4>Pasos</h4><ol class="cx-steps vv-pasos">`;
    Pr.pasos.forEach((s, i) => { const e = E[i]; const act = i === k; const cls = e.ok ? 'done ok' : act ? 'cur act' : 'todo pend';
      h += `<li class="${cls}"><div class="cx-sh"><span class="cx-sn">${e.ok ? ic('check') : i + 1}</span><b>${esc(s.t)}</b></div>`;
      if (act) {
        h += `<div class="cx-sb"><p>${esc(s.txt)}</p>${G.por?.[i] ? `<p class="vv-porque"><b>Por qué:</b> ${esc(G.por[i])}</p>` : ''}`;
        if (e.faltan.length) h += `<div class="cx-where">${ic('map-pin')} Te falta:<ul class="vv-faltan">${e.faltan.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>`;
        if (s.accion) h += `<p class="vv-acc">${ic(ICONO_ACC[s.accion] || 'zap')} Se comprueba solo: <b>${esc(ACCIONES[s.accion])}</b>.</p>`;
        if (s.cables || s.fichas) h += `<div class="cx-ibtns"><button class="cx-btn small" data-pr="hazlo" title="Lo hace el simulador por ti">${ic('sparkles')} Hazlo por mí</button></div>`;
        h += '</div>';
      }
      h += '</li>'; });
    h += '</ol>';
    if (todos) h += `<div class="cx-ok">${ic('party-popper')} ¡Has completado todos los pasos! Ahora pulsa <b>Comprobar la práctica</b>.</div>`;
    h += this.resultadoPrHTML(Pr, todos);
    const gh = guiadaHechaPr(Pr.id), ah = autoHechaPr(Pr.id);
    h += `<div class="cx-auto ${gh ? '' : 'off'}"><h4>${ic('target')} Práctica autónoma</h4>
      <div class="cx-lvl">${gh ? `<span class="cx-badge ok">${ic('check')} Guiada completada</span>` : '<span class="cx-badge">Guiada sin completar</span>'}${ah ? `<span class="cx-badge ok">${ic('check')} Autónoma completada</span>` : '<span class="cx-badge">Autónoma pendiente</span>'}</div>
      <p class="cx-small">${gh ? `Ahora hazla <b>tú solo</b>: el mismo montaje, sin pasos ni pistas. Al comprobarla, si está bien, queda marcada como completada${alumno() ? ' y tu profesor lo ve' : ''}.` : 'Se abre cuando completes la guiada: todos los pasos y «Comprobar» en verde.'}</p>
      ${gh || !alumno() ? `<div class="cx-ibtns"><a class="cx-sim vv-btn primary" href="#eee/vivienda/${Pr.id}-auto">${ic('target')} ${ah ? 'Repetir la autónoma' : 'Hacer la práctica autónoma'}</a></div>` : ''}</div>`;
    h += this.preguntasPrHTML(Pr, G);
    if (G.reto) h += `<h4>Reto</h4><p>${esc(G.reto)}</p>`;
    if (alumno()) h += `<h4>Registro</h4>${this.registroPrHTML()}`;
    return h + '</div>';
  },
  preguntasPrHTML(Pr, G) {
    const Q = G.preguntas || []; if (!Q.length) return ''; const st = this.prQ?.id === Pr.id ? this.prQ : (this.prQ = { id: Pr.id, a: lee('pr:q:' + Pr.id) || {}, res: null, ver: false });
    return `<h4>Preguntas</h4><div class="cx-qs">${Q.map((q, i) => { const r = st.res?.[i];
      const fb = r == null && !st.ver ? '' : `<div class="cx-fb ${r ? 'ok' : r === false ? 'ko' : ''}">${r === true ? 'Correcto. ' : r === false ? 'Revísalo. ' : ''}${r || st.ver ? esc(q.exp) : ''}</div>`;
      return `<div class="cx-q"><div class="cx-qq">${i + 1}. ${esc(q.q)}</div>${q.op.map((o, k) => `<label><input type="radio" name="vvq${i}" data-prq="${i}" value="${k}" ${st.a[i] === k ? 'checked' : ''}> ${esc(o)}</label>`).join('')}${fb}</div>`; }).join('')}</div>
      <div class="cx-ibtns"><button class="cx-btn" data-pr="respuestas">Comprobar respuestas</button><button class="cx-btn" data-pr="versol">Ver soluciones</button></div>`;
  },
  enunciadoPrHTML(Pr) {
    const G = guiaDe(Pr.id) || {};
    return `<div class="cx-panel vv-cxguia">${this.cabeceraPrHTML(Pr, ' · autónoma')}
      <p class="vv-printro"><b>Práctica autónoma.</b> ${esc(G.objetivo || Pr.intro)} Esta vez lo haces <b>tú solo</b>: sin pasos ni pistas, con el plano de piezas y el material. Cablea con los colores y secciones del REBT y pulsa <b>Comprobar mi montaje</b>.</p>
      <div class="vv-prcirc">${ic('zap')} ${esc(Pr.circuito)}</div>
      <details open><summary>${ic('drafting-compass')} Plano de piezas</summary><div class="vv-plano">${planoSVG(modeloInicial(Pr))}</div></details>
      <details><summary>${ic('toolbox')} Material</summary>${this.materialPrHTML(G)}</details>
      ${this.resultadoPrHTML(Pr, true)}${alumno() ? `<h4>Registro</h4>${this.registroPrHTML()}` : ''}</div>`;
  },
  resultadoPrHTML(Pr, listo) {
    const R = this.prchk; const auto = this.prAuto; const hecha = auto ? autoHechaPr(Pr.id) : guiadaHechaPr(Pr.id);
    let h = `<div class="vv-fila"><button class="vv-btn primary" data-pr="comprobar" ${listo ? '' : 'disabled'}>${ic('clipboard-check')} Comprobar ${auto ? 'mi montaje' : 'la práctica'}</button><button class="vv-btn small" data-pr="reiniciar">${ic('rotate-ccw')} Empezar de nuevo</button></div>`;
    if (!listo) h += '<p class="vv-small">Completa los pasos en orden: cada uno se pone en verde solo cuando el montaje lo cumple.</p>';
    if (R) { const malos = R.items.filter((i) => !i.ok);
      h += `<div class="vv-check ${R.ok ? 'ok' : 'ko'}"><div class="vv-ch">${R.ok ? `${ic('circle-check')} ¡Funciona y cumple el REBT!` : `${ic('circle-x')} ${malos.length} cosa${malos.length > 1 ? 's' : ''} por corregir`}</div><ul>${R.items.filter((i) => !R.ok ? !i.ok : true).slice(0, 8).map((i) => `<li class="${i.ok ? 'ok' : 'ko'}">${esc(i.t)}</li>`).join('')}</ul>${!R.ok && R.pistas?.length ? `<div class="vv-pistas"><b>Pistas:</b><ul>${R.pistas.slice(0, 4).map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>` : ''}</div>`; }
    if (hecha) h += `<p class="vv-okline">${ic('check')} ${auto ? 'Autónoma completada.' : 'Guiada completada.'}</p>`;
    const i = PRACTICAS.indexOf(Pr); const sig = PRACTICAS[i + 1];
    h += `<div class="vv-fila vv-navfin"><a class="vv-btn small" href="#eee/vivienda">${ic('arrow-left')} Volver a las prácticas</a>${!auto && hecha ? `<a class="vv-btn primary" href="#eee/vivienda/${Pr.id}-auto">${ic('arrow-right')} Hacerla tú solo</a>` : ''}${(auto || !hecha) && sig && abiertaPr(sig.id) && hecha ? `<a class="vv-btn primary" href="#eee/vivienda/${sig.id}">${ic('arrow-right')} Siguiente práctica</a>` : ''}</div>`;
    return h;
  },
  esquemaPrHTML(Pr) {
    if (this.prAuto) return `<p class="vv-small">En la autónoma no hay esquema de cables: usa el plano de piezas y lo que aprendiste en la guiada.</p>${planoSVG(modeloInicial(Pr))}`;
    const m = modeloSolucion(Pr); const filas = tablaCables(proyDe(Pr), m);
    return `<p class="vv-small">Plano de montaje con los colores reales. Fase: marrón, negro o gris · neutro: azul · tierra: amarillo-verde.</p><div class="vv-plano">${planoSVG(m)}</div>
      <table class="tbl vv-tcab"><tr><th>Cable</th><th>De</th><th>A</th></tr>${filas.map((f) => `<tr><td><span class="vv-sw" style="background:${f.hex}"></span>${esc(f.color)} ${esc(f.sec)}</td><td>${esc(f.de)}</td><td>${esc(f.a)}</td></tr>`).join('')}</table>`;
  },
  normaPrHTML(Pr) {
    void Pr;
    return `<h4>El cuadro de una vivienda (electrificación básica)</h4>${cuadroSVG()}
      <p class="vv-small">Así se lee un PIA: <b>C16</b> = curva C y 16 A de calibre; <b>6000</b> en su recuadro = corta hasta 6000 A de cortocircuito; <b>230 V~</b> = tensión. El <b>peine</b> lleva la fase y el neutro de la salida del diferencial a la entrada de todos los PIAs.</p>
      <h4>Pruebas de disparo</h4><div class="vv-apar">${DISPAROS.map((d) => `<div><b>${ic(d.i)} ${esc(d.n)}</b><p>${esc(d.txt)}</p></div>`).join('')}</div>
      <h4>El cuadro (CGMP)</h4><div class="vv-apar">${APARATOS.map((a) => `<div><b>${esc(a.n)}</b><p>${esc(a.txt)}</p></div>`).join('')}</div>
      <h4>Circuitos de una vivienda (ITC-BT-25)</h4><table class="tbl vv-tcirc"><tr><th>Circuito</th><th>PIA</th><th>Cable</th><th>Tubo</th></tr>${CIRCUITOS_VIV.map((c) => `<tr><td><b>${c.c}</b> ${esc(c.uso)}<div class="vv-small">${esc(c.txt)}</div></td><td>${c.pia} A</td><td>${String(c.sec).replace('.', ',')} mm²</td><td>Ø${c.tubo}</td></tr>`).join('')}</table>
      <h4>Colores (ITC-BT-19)</h4><div class="vv-norma"><span><b>Fase</b> marrón · negro · gris</span><span><b>Neutro</b> azul</span><span><b>Tierra</b> amarillo-verde</span></div>
      <p class="vv-small">Los cables van siempre dentro del tubo y los empalmes, dentro de las cajas de registro (ITC-BT-21).</p>`;
  },
  comprobarPr() {
    const Pr = this.pr; const R = comprobarPractica(Pr, this.m, { realista: this.realista }); this.prchk = R;
    const malos = new Set(), tubos = new Set(); for (const i of R.items) if (!i.ok) { (i.cables || []).forEach((c) => malos.add(c)); (i.tubos || []).forEach((t) => tubos.add(t)); }
    this.chk = { ok: R.ok, items: R.items, cables: malos, tubos };
    if (R.ok) { guarda((this.prAuto ? 'pr:auto:' : 'pr:done:') + Pr.id, true); guarda('pr:ok:' + this.modo, this.m); if (alumno()) setTimeout(() => this.entregarPr(true), 50); this.toast(this.prAuto ? 'Autónoma completada.' : 'Guiada completada. Ahora puedes hacerla tú solo.', 3500); }
    this.construir(); this.lado(); return R;
  },
  // ------------------------------------------------------------ registro (como Circuitos: se envía solo al completar)
  // Todas las prácticas van en una entrega, «v6» (la de siempre: así no se pierde nada y no cambian las reglas).
  // Se vuelve a enviar sola cada vez que el alumno completa una guiada o una autónoma.
  registroPrHTML() {
    const Pt = portal(); if (!Pt) return ''; const e = Pt.estadoEntrega?.(ENTREGA_PR);
    const g = PRACTICAS.filter((p) => guiadaHechaPr(p.id)).length, a = PRACTICAS.filter((p) => autoHechaPr(p.id)).length;
    const f = (t) => t ? new Date(t).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }) : '';
    const pend = pendientePr();
    return `<div class="vv-ent vv-reg" id="vvRegistro"><h4>${ic('chart-column')} Tu registro</h4>
      <div class="cx-lvl"><span class="cx-badge ${g ? 'ok' : ''}">${g} de ${PRACTICAS.length} guiadas</span><span class="cx-badge ${a ? 'ok' : ''}">${a} de ${PRACTICAS.length} autónomas</span></div>
      <p class="vv-small">${this._entregandoPr ? 'Enviando…' : e ? `${ic('send')} Guardado para tu profesor · ${esc(f(e.fecha))}${e.nota != null ? ` · Nota: <b>${String(e.nota).replace('.', ',')}</b>` : ''}` : 'Cuando completes una práctica, se guarda sola para tu profesor (con tu grupo y tu número de lista).'}</p>
      ${pend && !this._entregandoPr && (!e || e.nota == null) ? `<button class="vv-btn primary" data-pr="entregar">${ic('send')} Enviar ahora</button>` : ''}</div>`;
  },
  entregaPrHTML() { return this.registroPrHTML(); },
  entregarPr(auto) {
    const Pt = portal(); if (!Pt?.entregar || this._entregandoPr) return; const e0 = Pt.estadoEntrega?.(ENTREGA_PR); if ((e0 && e0.nota != null) || (auto && !pendientePr())) return;
    const practicas = {};
    for (const Pr of PRACTICAS) { const g = guiadaHechaPr(Pr.id), a = autoHechaPr(Pr.id); if (!g && !a) continue; practicas[Pr.id] = { guiada: g, autonoma: a, model: lee('pr:ok:' + Pr.id + '-auto') || lee('pr:ok:' + Pr.id) || null }; }
    let json = JSON.stringify({ app: 'laboratorio-vivienda', version: 4, practica: ENTREGA_PR, practicas });
    if (json.length > 199000) { for (const k of Object.keys(practicas)) practicas[k].model = null; json = JSON.stringify({ app: 'laboratorio-vivienda', version: 4, practica: ENTREGA_PR, practicas }); }
    const items = PRACTICAS.map((Pr) => ({ t: `Práctica ${Pr.n} · ${Pr.title}: guiada ${practicas[Pr.id]?.guiada ? 'completada' : 'pendiente'}, autónoma ${practicas[Pr.id]?.autonoma ? 'completada' : 'pendiente'}`, ok: !!practicas[Pr.id]?.guiada }));
    const datos = { montaje: json, comprobacion: { ok: items.every((i) => i.ok), items }, aciertos: `${items.filter((i) => i.ok).length}/${items.length}` };
    this._entregandoPr = true; this.refrescarPr();
    Pt.entregar({ practica: ENTREGA_PR, tipo: 'vivienda', titulo: 'Vivienda · Registro de las prácticas del tablero', datos })
      .then(() => this.toast(auto ? 'Guardado en tu registro: tu profesor ya lo ve.' : 'Registro enviado al profesor.', 3000), (er) => this.toast('No se ha podido guardar en tu registro: ' + esc(er?.mensaje || 'revisa la conexión.'), 5000))
      .finally(() => { this._entregandoPr = false; this.refrescarPr(); });
  },
  refrescarPr() { if (this.kind === 'home') this.$('#vvHome').innerHTML = this.homeHTML(); else if (this.kind === 'practica') this.lado(); },
  // «Hazlo por mí» (como en Circuitos): pone los cables o los conectores del paso actual, sacados de la solución
  respPr(i, v) { const st = this.prQ; if (!st) return; st.a[i] = v; if (st.res) st.res[i] = null; guarda('pr:q:' + st.id, st.a); },
  hazloPr() {
    const Pr = this.pr; const E = estadoPasos(Pr, this.m, this.prAcc); const k = E.findIndex((x) => !x.ok); const s = Pr.pasos[k]; if (!s) return;
    const sol = modeloSolucion(Pr); this.guardarUndo();
    if (s.fichas) { const a = this.m.parts.find((p) => p.id === s.fichas), b = sol.parts.find((p) => p.id === s.fichas); if (a && b) a.fichas = JSON.parse(JSON.stringify(b.fichas || {})); }
    for (const id of s.cables || []) { const c = sol.cables.find((x) => x.id === id); if (!c || cableHecho(this.m, c)) continue; const n = JSON.parse(JSON.stringify(c)); if (this.m.cables.some((x) => x.id === n.id)) n.id = n.id + '_' + Date.now().toString(36); this.m.cables.push(n); }
    this.m = sanear(this.m); this._dimKey = null; this.cambio();
  },
  solucionPr() { if (this.kind !== 'practica') return false; this.guardarUndo(); this.m = modeloSolucion(this.pr); this.red = false; this.prchk = null; this._dimKey = null; this.cambio(); return true; },
  onClickPractica(t) {
    const b = t.closest('[data-pr]'); if (!b) return false; const v = b.dataset.pr;
    if (v === 'comprobar') this.comprobarPr();
    else if (v === 'reiniciar') { if ((this.opts.confirm || confirm)('¿Empezar esta práctica desde el principio?')) { this.guardarUndo(); this.m = modeloInicial(this.pr); this.prAcc = {}; guarda('pr:acc:' + this.modo, {}); this.prchk = null; this.red = false; this.cambio(); } }
    else if (v === 'entregar') this.entregarPr();
    else if (v === 'hazlo') this.hazloPr();
    else if (v === 'respuestas' || v === 'versol') { const G = guiaDe(this.pr.id) || {}; const st = this.prQ; if (!st) return true;
      if (v === 'versol') st.ver = true; else st.res = (G.preguntas || []).map((q, i) => (st.a[i] == null ? null : st.a[i] === q.ok)); this.lado(); }
    return true;
  },
};
export function instalarPracticas(C) { Object.assign(C.prototype, M); }
export { PRACTICAS };

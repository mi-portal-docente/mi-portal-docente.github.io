// «Evaluación de vivienda» en el laboratorio: la misma idea que «Evaluación de circuitos» (circ/lab.js evalHomeHTML,
// soloOpen, solo-enviar): niveles con candado del profesor (cerrados por defecto), varios montajes de examen sin pasos
// ni pistas, un único envío que corrige todo y guarda la nota automática como entrega (v7, v8, v9) para el profesor.
import { EVALS_VIV, evalVivDe, modeloExamen, corregirNivelViv, practicaDeMontaje } from './evaluacion.js';
import { vivEvAbierta, alternarVivEv } from '../circ/guiadas.js';
import { sanear, varianteMarcas } from './modelo.js';
import { conReserva } from './practicas.js';
import { planoSVG } from './proyectos.js';
import { ic } from '../ui/iconos.js';
import { leeViv, guardaViv } from './almacen.js';

const esc = (t) => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const portal = () => (typeof window !== 'undefined' ? window.PORTAL : null);
const lee = leeViv;
const guarda = guardaViv;
const alumno = () => portal()?.rol === 'alumno';
const fNota = (n) => (n == null ? '—' : String(n).replace('.', ','));
export const abiertaEv = (id) => !alumno() || vivEvAbierta(window.PORTAL_SESION?.apartados, id);
const IDS = EVALS_VIV.map((e) => e.id);

const M = {
  candadoEvHTML(ev) {
    const C = this.grupoCandPr(); if (!C) return ''; const ab = vivEvAbierta(C.g.apartados, ev.id);
    const t = `Nivel ${ev.nivel} · ${ab ? 'abierto' : 'cerrado'} para ${C.g.nombre}. Pulsa para ${ab ? 'cerrarlo' : 'abrirlo'}.`;
    return `<button type="button" class="cx-cand ${ab ? 'ab' : 'ce'}" data-evlock="${esc(ev.id)}" aria-pressed="${!ab}" aria-label="${esc(t)}" title="${esc(t)}">${ic(ab ? 'lock-open' : 'lock')}</button>`;
  },
  evalPrHTML() {
    const C = this.grupoCandPr(); const cerr = EVALS_VIV.filter((e) => !abiertaEv(e.id)).length;
    return `<section class="vv-prs" id="vvEvaluacion"><h2>Evaluación de vivienda <small>por niveles</small></h2>
      <p class="cx-ev-intro">Cada nivel es una prueba con varios montajes de las prácticas guiadas. Aquí <b>no hay pasos ni pistas</b>: lees el enunciado, montas cada uno en el tablero tú solo y pulsas <b>Enviar</b>. El simulador comprueba que funciona y cumple el REBT y ves al momento tu nota${alumno() ? ', que queda guardada como entrega para tu profesor' : ''}.</p>
      ${alumno() && cerr ? `<p class="cx-bloq-aviso">${ic('lock')} Tu profesor abre los niveles cuando toca hacer la prueba. Los que tienen candado todavía están cerrados.</p>` : ''}
      ${C ? '' : ''}<div class="cx-cards vv-prcards">${EVALS_VIV.map((e) => {
        const ab = abiertaEv(e.id); const tag = ab ? 'a' : 'div'; const r = lee('evres:' + e.id); const ent = portal()?.estadoEntrega?.(e.entrega); const pc = C && !vivEvAbierta(C.g.apartados, e.id);
        const badge = !ab ? `<span class="cx-badge">${ic('lock')} Cerrado</span>` : pc ? `<span class="cx-badge" title="Cerrado para ${esc(C.g.nombre)}">Cerrado</span>` : ent?.nota != null ? `<span class="cx-badge ok">Nota ${esc(fNota(ent.nota))}</span>` : r ? `<span class="cx-badge ${r.ok ? 'ok' : ''}">Enviado · ${fNota(r.nota)}</span>` : '';
        return `<${tag} class="cx-card cx-evcard vv-evc ${ab ? '' : 'locked'} ${pc ? 'cerrada' : ''}" ${ab ? `href="#eee/vivienda/${e.id}"` : 'aria-disabled="true"'}>
        <div class="cx-card-h"><span class="cx-num">N${e.nivel}</span><span class="cx-ic">${ic('clipboard-check')}</span>${badge}${this.candadoEvHTML(e)}</div>
        <h3>Nivel ${e.nivel} · ${esc(e.title)}</h3><div class="cx-sub">${esc(e.sub)}</div>
        <div class="cx-meta"><span>${e.montajes.length} montajes</span><span>${ic('clock')} ${esc(e.duration)}</span><span>Prácticas ${e.montajes.map((m) => practicaDeMontaje(m).n).join(', ')}</span></div></${tag}>`; }).join('')}</div></section>`;
  },
  async alternarCandadoEv(id, btn) {
    const C = this.grupoCandPr(); const P = portal(); if (!C || !P?.circ || this._candando) return;
    const abrir = !vivEvAbierta(C.g.apartados, id); const nuevos = alternarVivEv(C.g.apartados, id, abrir, IDS);
    this._candando = true; if (btn) btn.disabled = true;
    try { await P.circ.guardarApartados(C.g.id, nuevos); this.toast(`Nivel ${evalVivDe(id)?.nivel} ${abrir ? 'abierto' : 'cerrado'} para ${esc(C.g.nombre)}.`, 2500); }
    catch (e) { this.toast('No se ha podido guardar: ' + esc(e?.message || 'revisa la conexión.'), 5000); }
    finally { this._candando = false; if (this.kind === 'home') this.$('#vvHome').innerHTML = this.homeHTML(); }
  },
  rutaEval(v) { const m = /^(ve\d)(?:-(\d))?$/.exec(v || ''); const ev = m && evalVivDe(m[1]); if (!ev) return null; const k = Math.min(+(m[2] || 0), ev.montajes.length - 1); return { ev, k, Pr: practicaDeMontaje(ev.montajes[k]), auto: true }; },
  abrirEval(ev, k) {
    if (!abiertaEv(ev.id)) { setTimeout(() => this.toast('Este nivel todavía está cerrado: lo abrirá tu profesor cuando toque la prueba.', 4000), 200); location.hash = '#eee/vivienda/evaluacion'; return; }
    const mt = ev.montajes[k]; const Pr = practicaDeMontaje(mt); const modo = ev.id + '-' + k; const mismo = this.kind === 'practica' && this.modo === modo;
    varianteMarcas(true);
    this.pr = Pr; this.prAuto = true; this.prEval = { ev, k, res: lee('evres:' + ev.id) }; this.kind = 'practica'; this.modo = modo; this.proy = null; this.rev = null; this.ro = !!this.prEval.res && alumno();
    const root = this.$('.vv'); root.dataset.modo = 'practica'; ['es-casa', 'es-taller', 'es-montaje', 'es-proy'].forEach((c) => root.classList.remove(c));
    this.$('#vvTitulo').innerHTML = `<span class="vv-pn">N${ev.nivel}</span><span>Evaluación · ${esc(ev.title)} · montaje ${k + 1}</span>`;
    this.crumbs(); this.initScene(); this.vistaActiva = 'tablero'; this.activarControles(); this.stepbar(); this.strip();
    if (!mismo) {
      this.red = false; this.test = false; this.res = null; this.chk = null; this.prchk = null; this.sel = null; this.undoS = []; this.redoS = []; this.multi.a = this.multi.b = null; this.tool = 'mover'; this.tapas = false;
      this.m = sanear(conReserva(Pr, lee('pr:m:' + modo) || modeloExamen(mt))); this.prAcc = {}; this.tab = 'examen'; this._dimKey = null;
    }
    this.cambio(false); this.vista(); this.resume();
  },
  modelosEval(ev) { return ev.montajes.map((mt, k) => (this.modo === ev.id + '-' + k ? this.m : lee('pr:m:' + ev.id + '-' + k) || modeloExamen(mt))); },
  examenPrHTML() {
    const { ev, k } = this.prEval; const res = this.prEval.res; const mt = ev.montajes[k]; const Pr = this.pr; const ent = portal()?.estadoEntrega?.(ev.entrega);
    let h = `<div class="cx-panel vv-cxguia vv-exam"><div class="cx-gh"><span class="cx-num">N${ev.nivel}</span><div><h3>Nivel ${ev.nivel} · ${esc(ev.title)}</h3><div class="cx-small">${esc(ev.sub)} · ${esc(ev.duration)} · sin pasos ni pistas</div></div></div>
      <nav class="vv-evk" aria-label="Montajes de la prueba">${ev.montajes.map((m, i) => `<a href="#eee/vivienda/${ev.id}-${i}" class="vv-btn small ${i === k ? 'primary' : ''}" aria-current="${i === k}">${i + 1} · ${esc(practicaDeMontaje(m).title)}</a>`).join('')}</nav>
      <h4>Montaje ${k + 1} · ${esc(Pr.title)}</h4><p class="vv-printro">${mt.enunciado}</p><div class="vv-prcirc">${ic('zap')} ${esc(Pr.circuito)}</div>
      <details open><summary>${ic('drafting-compass')} Plano de piezas</summary><div class="vv-plano">${planoSVG(mt.averia ? modeloExamen(mt) : conReserva(Pr, modeloExamen(mt)))}</div></details>`;
    if (res) {
      h += `<div class="cx-evres ${res.ok ? 'ok' : 'ko'}"><div class="cx-evnota"><span>Automática</span><b>${fNota(res.nota)}</b></div><div><b>${res.correctos} de ${res.montajes.length} montajes correctos</b>${ent?.nota != null ? `<div class="cx-small">Nota del profesor: <b>${fNota(ent.nota)}</b></div>` : ''}</div></div>
        <ul class="vv-evlist">${res.montajes.map((c, i) => `<li class="${c.ok ? 'ok' : 'ko'}">${ic(c.ok ? 'circle-check' : 'circle-x')} Montaje ${i + 1} · ${esc(c.titulo)}: ${c.bien}/${c.n} requisitos</li>`).join('')}</ul>
        ${alumno() ? `<p class="vv-small">${ic('send')} Enviado a tu profesor. Ya no se puede cambiar.</p>` : `<button class="vv-btn small" data-pr="evotra">${ic('rotate-ccw')} Probar otra vez</button>`}`;
    } else {
      h += `<div class="vv-fila"><button class="vv-btn primary" data-pr="evenviar" ${this._entregandoEv ? 'disabled' : ''}>${ic('send')} ${this._entregandoEv ? 'Enviando…' : 'Enviar la prueba'}</button><button class="vv-btn small" data-pr="reiniciar">${ic('rotate-ccw')} Empezar este montaje de nuevo</button></div>
        <p class="vv-small">Puedes pasar de un montaje a otro: se guardan solos. Al enviar se corrigen todos${alumno() ? ' y la nota queda guardada para tu profesor' : ''}.</p>`;
    }
    return h + `<div class="vv-fila vv-navfin"><a class="vv-btn small" href="#eee/vivienda/evaluacion">${ic('arrow-left')} Volver a la evaluación</a></div></div>`;
  },
  async enviarEval() {
    const P = this.prEval; if (!P || P.res || this._entregandoEv) return; const ev = P.ev; const Pt = portal();
    const modelos = this.modelosEval(ev).map((m) => sanear(JSON.parse(JSON.stringify(m))));
    if (!(this.opts.confirm || confirm)(`¿Enviar la prueba «Nivel ${ev.nivel}»?\n\nSe corrigen todos los montajes y ya no podrás cambiarlos.`)) return;
    const res = corregirNivelViv(ev, modelos, { realista: this.realista });
    if (alumno() && Pt?.entregar) {
      let json = JSON.stringify({ app: 'laboratorio-vivienda', version: 4, evaluacion: ev.id, practica: ev.entrega, modelos });
      if (json.length > 199000) json = JSON.stringify({ app: 'laboratorio-vivienda', version: 4, evaluacion: ev.id, practica: ev.entrega, modelos: null });
      const datos = { montaje: json, comprobacion: { ok: !!res.ok, nota: res.nota, items: res.montajes.map((c, i) => ({ t: `Montaje ${i + 1} · ${c.titulo}: ${c.ok ? 'correcto' : 'no correcto'} (${c.bien}/${c.n} requisitos)`.slice(0, 160), ok: !!c.ok })) }, aciertos: `${res.correctos}/${res.montajes.length} montajes` };
      this._entregandoEv = true; this.lado();
      try { await Pt.entregar({ practica: ev.entrega, tipo: 'vivienda', titulo: `Evaluación de vivienda · Nivel ${ev.nivel}: ${ev.title}`.slice(0, 120), datos }); }
      catch (e) { this._entregandoEv = false; this.lado(); this.toast('No se ha podido enviar: ' + esc(e?.mensaje || 'revisa la conexión.'), 6000); return; }
      this._entregandoEv = false; this.ro = true;
    }
    P.res = res; guarda('evres:' + ev.id, res); this.toast(`Prueba enviada · nota automática ${fNota(res.nota)}.`, 3500); this.lado();
  },
  onClickEval(v) {
    if (v === 'evenviar') { this.enviarEval(); return true; }
    if (v === 'evotra' && !alumno()) { this.prEval.res = null; guarda('evres:' + this.prEval.ev.id, null); this.lado(); return true; }
    return false;
  },
};
export function instalarEvalViv(C) { Object.assign(C.prototype, M); }

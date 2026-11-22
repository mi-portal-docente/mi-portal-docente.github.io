// Prácticas del tablero una a una (lista como la de Circuitos, guiada y autónoma, candados del profesor) sobre ViviendaLab.
// Se instala con instalarPracticas(ViviendaLab). Los datos y la corrección están en practicas.js.
import { PRACTICAS, practica, modeloInicial, modeloSolucion, estadoPasos, comprobarPractica, textoCable, APARATOS, CIRCUITOS_VIV, ACCIONES, proyDe } from './practicas.js';
import { vivAbierta, alternarViv } from '../circ/guiadas.js';
import { sanear } from './modelo.js';
import { planoSVG, tablaCables } from './proyectos.js';
import { ic } from '../ui/iconos.js';

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
const profGrupos = () => (portal()?.rol === 'profesor' && portal()?.circ?.grupos?.()) || [];
const ICONO_ACC = { red: 'zap', test: 'shield-check', sobrecarga: 'thermometer', corto: 'flame', fuga: 'shield-check' };

const M = {
  // ------------------------------------------------------------ lista (como la de Circuitos)
  grupoCandPr() { const G = profGrupos(); if (!G.length) return null; const id = lee('pref:grupoCand'); return { G, g: G.find((x) => x.id === id) || G[0] }; },
  candadoPrHTML(Pr) {
    const C = this.grupoCandPr(); if (!C) return ''; const ab = vivAbierta(C.g.apartados, Pr.id);
    const t = `Práctica ${Pr.n} · ${ab ? 'abierta' : 'cerrada'} para ${C.g.nombre}. Pulsa para ${ab ? 'cerrarla' : 'abrirla'}.`;
    return `<button type="button" class="vv-cand ${ab ? 'ab' : 'ce'}" data-prlock="${esc(Pr.id)}" aria-pressed="${!ab}" aria-label="${esc(t)}" title="${esc(t)}">${ic(ab ? 'lock-open' : 'lock')}</button>`;
  },
  homePracticasHTML() {
    const C = this.grupoCandPr(); const bloq = PRACTICAS.some((p) => !abiertaPr(p.id));
    const primera = PRACTICAS.find((p) => abiertaPr(p.id) && !guiadaHechaPr(p.id)) || PRACTICAS.find((p) => abiertaPr(p.id));
    const card = (Pr) => {
      const ab = abiertaPr(Pr.id); const g = guiadaHechaPr(Pr.id), a = autoHechaPr(Pr.id); const pc = C && !vivAbierta(C.g.apartados, Pr.id);
      const empezada = !g && lee('pr:m:' + Pr.id)?.cables?.length;
      return `<div class="vv-prc ${g ? 'done' : ''} ${ab ? '' : 'locked'} ${pc ? 'cerrada' : ''}" ${ab ? '' : 'aria-disabled="true"'}>
        <div class="vv-prh"><span class="vv-prn">${Pr.n}</span><span class="vv-pri">${ic(Pr.icon)}</span>${!ab ? `<span class="vv-badge">${ic('lock')} Bloqueada</span>` : pc ? `<span class="vv-badge" title="Cerrada para ${esc(C.g.nombre)}">Cerrada</span>` : empezada ? '<span class="vv-badge">En curso</span>' : ''}${this.candadoPrHTML(Pr)}</div>
        <h3>${ab ? `<a class="vv-prgo" href="#eee/vivienda/${Pr.id}">${esc(Pr.title)}</a>` : esc(Pr.title)}</h3><p>${esc(Pr.sub)}</p>
        <div class="vv-prm"><span>${esc(Pr.level)}</span><span>${esc(Pr.duration)}</span><span>${esc(Pr.norma)}</span></div>
        ${ab && g ? `<div class="vv-prl"><span class="vv-badge ok">${ic('check')} Guiada</span>${a ? `<span class="vv-badge ok">${ic('check')} Autónoma</span>` : `<a class="vv-badge" href="#eee/vivienda/${Pr.id}-auto">Hacer la autónoma</a>`}</div>` : ''}</div>`;
    };
    const hechas = PRACTICAS.filter((p) => guiadaHechaPr(p.id)).length;
    return `<section class="vv-prs" id="vvPracticas"><div class="vv-prs-h"><div><h2>Prácticas del tablero <small>una a una</small></h2>
      <p class="vv-prs-lead">Cada práctica se hace en el tablero 3D. Primero la <b>guiada</b>: el simulador comprueba cada paso. Después la <b>autónoma</b>: el mismo montaje tú solo. Todo según el REBT (ITC-BT-25, electrificación básica).</p></div>
      <div class="vv-prs-k"><b>${hechas}</b><span>de ${PRACTICAS.length} guiadas</span></div></div>
      ${primera ? `<a class="vv-btn primary vv-prs-go" href="#eee/vivienda/${primera.id}">${ic('play')} ${guiadaHechaPr(primera.id) ? 'Repasar' : 'Empezar'} la práctica ${primera.n}</a>` : ''}
      ${C ? `<div class="vv-gbar">${ic('users')}<label>Candados para el grupo <select data-vvgrupo aria-label="Grupo al que afectan los candados">${C.G.map((g) => `<option value="${esc(g.id)}" ${g.id === C.g.id ? 'selected' : ''}>${esc(g.nombre)}</option>`).join('')}</select></label><span class="vv-small">Pulsa el candado de cada tarjeta para abrirla o cerrarla a <b>${esc(C.g.nombre)}</b>.</span></div>` : ''}
      ${bloq ? `<p class="vv-bloq">${ic('lock')} Tu profesor va abriendo las prácticas una a una. Las que tienen candado se abrirán más adelante.</p>` : ''}
      <div class="vv-prcards">${PRACTICAS.map(card).join('')}</div>
      ${alumno() ? this.entregaPrHTML() : ''}</section>`;
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
    this.pr = Pr; this.prAuto = auto; this.kind = 'practica'; this.modo = modo; this.proy = null; this.rev = null; this.ro = false;
    const root = this.$('.vv'); root.dataset.modo = 'practica'; ['es-casa', 'es-taller', 'es-montaje', 'es-proy'].forEach((c) => root.classList.remove(c));
    this.$('#vvTitulo').innerHTML = `<span class="vv-pn">${Pr.n}</span><span>${esc(Pr.title)}${auto ? ' · autónoma' : ''}</span>`;
    this.crumbs(); this.initScene(); this.vistaActiva = 'tablero'; this.activarControles(); this.stepbar(); this.strip();
    if (!mismo) {
      this.red = false; this.test = false; this.res = null; this.chk = null; this.prchk = null; this.sel = null; this.undoS = []; this.redoS = []; this.multi.a = this.multi.b = null; this.tool = 'mover'; this.tapas = false;
      this.m = sanear(lee('pr:m:' + modo) || modeloInicial(Pr)); this.prAcc = lee('pr:acc:' + modo) || {};
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
  guiaPrHTML(Pr) {
    const E = estadoPasos(Pr, this.m, this.prAcc); const k = E.findIndex((x) => !x.ok); const todos = k < 0;
    let h = `<p class="vv-printro">${esc(Pr.intro)}</p><div class="vv-prcirc">${ic('zap')} ${esc(Pr.circuito)}</div>
      <div class="vv-prog" role="progressbar" aria-valuemin="0" aria-valuemax="${E.length}" aria-valuenow="${E.filter((x) => x.ok).length}"><i style="width:${(100 * E.filter((x) => x.ok).length) / E.length}%"></i></div>
      <ol class="vv-pasos">`;
    Pr.pasos.forEach((s, i) => { const e = E[i]; const act = i === k;
      h += `<li class="${e.ok ? 'ok' : act ? 'act' : 'pend'}"><div class="vv-pt">${e.ok ? ic('circle-check') : `<span class="vv-pnum">${i + 1}</span>`}<b>${esc(s.t)}</b></div>`;
      if (act) { h += `<p>${esc(s.txt)}</p>`; if (e.faltan.length) h += `<ul class="vv-faltan">${e.faltan.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`; if (s.accion) h += `<p class="vv-acc">${ic(ICONO_ACC[s.accion] || 'zap')} Se comprueba solo: <b>${esc(ACCIONES[s.accion])}</b>.</p>`; }
      h += '</li>'; });
    h += '</ol>';
    h += this.resultadoPrHTML(Pr, todos);
    return h;
  },
  enunciadoPrHTML(Pr) {
    return `<p class="vv-printro"><b>Práctica autónoma.</b> El mismo montaje de la guiada, ahora sin pasos ni pistas. Cablea con los colores y secciones del REBT y pulsa <b>Comprobar</b>.</p>
      <p>${esc(Pr.intro)}</p><div class="vv-prcirc">${ic('zap')} ${esc(Pr.circuito)}</div>${this.resultadoPrHTML(Pr, true)}`;
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
    if (alumno() && hecha) h += this.entregaPrHTML();
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
    return `<h4>El cuadro (CGMP)</h4><div class="vv-apar">${APARATOS.map((a) => `<div><b>${esc(a.n)}</b><p>${esc(a.txt)}</p></div>`).join('')}</div>
      <h4>Circuitos de una vivienda (ITC-BT-25)</h4><table class="tbl vv-tcirc"><tr><th>Circuito</th><th>PIA</th><th>Cable</th><th>Tubo</th></tr>${CIRCUITOS_VIV.map((c) => `<tr><td><b>${c.c}</b> ${esc(c.uso)}<div class="vv-small">${esc(c.txt)}</div></td><td>${c.pia} A</td><td>${String(c.sec).replace('.', ',')} mm²</td><td>Ø${c.tubo}</td></tr>`).join('')}</table>
      <h4>Colores (ITC-BT-19)</h4><div class="vv-norma"><span><b>Fase</b> marrón · negro · gris</span><span><b>Neutro</b> azul</span><span><b>Tierra</b> amarillo-verde</span></div>
      <p class="vv-small">Los cables van siempre dentro del tubo y los empalmes, dentro de las cajas de registro (ITC-BT-21).</p>`;
  },
  comprobarPr() {
    const Pr = this.pr; const R = comprobarPractica(Pr, this.m, { realista: this.realista }); this.prchk = R;
    const malos = new Set(), tubos = new Set(); for (const i of R.items) if (!i.ok) { (i.cables || []).forEach((c) => malos.add(c)); (i.tubos || []).forEach((t) => tubos.add(t)); }
    this.chk = { ok: R.ok, items: R.items, cables: malos, tubos };
    if (R.ok) { guarda((this.prAuto ? 'pr:auto:' : 'pr:done:') + Pr.id, true); guarda('pr:ok:' + this.modo, this.m); this.toast(this.prAuto ? 'Autónoma completada.' : 'Guiada completada. Ahora puedes hacerla tú solo.', 3500); }
    this.construir(); this.lado(); return R;
  },
  // ------------------------------------------------------------ entrega (todas las prácticas en una, «v6»)
  entregaPrHTML() {
    const Pt = portal(); if (!Pt) return ''; const e = Pt.estadoEntrega?.(ENTREGA_PR); const n = PRACTICAS.filter((p) => guiadaHechaPr(p.id)).length;
    if (this._entregandoPr) return '<div class="vv-ent"><button class="vv-btn" disabled>Enviando…</button></div>';
    return `<div class="vv-ent"><h4>Entrega · Prácticas del tablero</h4><p class="vv-small">Se envían tus prácticas (${n} de ${PRACTICAS.length} guiadas) con su comprobación, solo con tu grupo y tu número de lista.</p>
      ${e ? `<div>${ic('send')} <b>Entregado</b>${e.nota != null ? ` · Nota: <b>${String(e.nota).replace('.', ',')}</b>` : ' · pendiente de corregir'}</div>` : ''}
      ${!e || e.nota == null ? `<button class="vv-btn primary" data-pr="entregar">${ic('send')} ${e ? 'Volver a entregar' : 'Entregar al profesor'}</button>` : ''}</div>`;
  },
  entregarPr() {
    const Pt = portal(); if (!Pt || this._entregandoPr) return; const practicas = {};
    for (const Pr of PRACTICAS) { const g = guiadaHechaPr(Pr.id), a = autoHechaPr(Pr.id); if (!g && !a) continue; practicas[Pr.id] = { guiada: g, autonoma: a, model: lee('pr:ok:' + Pr.id + '-auto') || lee('pr:ok:' + Pr.id) || null }; }
    let json = JSON.stringify({ app: 'laboratorio-vivienda', version: 4, practica: ENTREGA_PR, practicas });
    if (json.length > 199000) { for (const k of Object.keys(practicas)) practicas[k].model = null; json = JSON.stringify({ app: 'laboratorio-vivienda', version: 4, practica: ENTREGA_PR, practicas }); }
    const items = PRACTICAS.map((Pr) => ({ t: `Práctica ${Pr.n} · ${Pr.title}: ${practicas[Pr.id] ? `guiada ${practicas[Pr.id].guiada ? 'hecha' : 'pendiente'}, autónoma ${practicas[Pr.id].autonoma ? 'hecha' : 'pendiente'}` : 'sin hacer'}`, ok: !!practicas[Pr.id]?.guiada }));
    const datos = { montaje: json, comprobacion: { ok: items.every((i) => i.ok), items }, aciertos: `${items.filter((i) => i.ok).length}/${items.length}` };
    this._entregandoPr = true; this.lado();
    Pt.entregar({ practica: ENTREGA_PR, tipo: 'vivienda', titulo: 'Vivienda · Prácticas del tablero', datos })
      .then(() => this.toast('Entregado al profesor.'), (e) => this.toast('No se ha podido entregar: ' + esc(e?.mensaje || 'revisa la conexión.'), 5000))
      .finally(() => { this._entregandoPr = false; if (this.kind === 'home') this.$('#vvHome').innerHTML = this.homeHTML(); else this.lado(); });
  },
  solucionPr() { if (this.kind !== 'practica') return false; this.guardarUndo(); this.m = modeloSolucion(this.pr); this.red = false; this.prchk = null; this._dimKey = null; this.cambio(); return true; },
  onClickPractica(t) {
    const b = t.closest('[data-pr]'); if (!b) return false; const v = b.dataset.pr;
    if (v === 'comprobar') this.comprobarPr();
    else if (v === 'reiniciar') { if ((this.opts.confirm || confirm)('¿Empezar esta práctica desde el principio?')) { this.guardarUndo(); this.m = modeloInicial(this.pr); this.prAcc = {}; guarda('pr:acc:' + this.modo, {}); this.prchk = null; this.red = false; this.cambio(); } }
    else if (v === 'entregar') this.entregarPr();
    return true;
  },
};
export function instalarPracticas(C) { Object.assign(C.prototype, M); }
export { PRACTICAS };

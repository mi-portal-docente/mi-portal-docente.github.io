// Concurso de laboratorios (alumno): clasificación anónima de su grupo en Circuitos y Vivienda.
// Solo se muestran números de lista («Nº 07») y «Tú» en la fila propia: nunca nombres, correos ni códigos.
//  · El profesor lo activa o apaga por grupo (concursos/{grupo}).
//  · Cada alumno publica su propio resumen de puntos (clasificacion/{grupo_nº}: cuatro números) a partir de SUS entregas.
//  · Los compañeros del mismo grupo leen esos resúmenes solo mientras el concurso está activo (lo exigen las reglas).
import { collection, doc, onSnapshot, query, setDoc, where, serverTimestamp } from 'firebase/firestore';
import { esc } from './util.js';
import { ic } from './ico.js';
import { resumenAlumno, sanear, iguales, clasificar, puntosDe, maxDe, LABS, N_CIRC, N_VIV, MAX_CIRC, MAX_VIV } from '../lms/concurso.js';

const pad = (n) => String(n).padStart(2, '0');
const TOP = 10;

export function crearConcurso({ db, ses, entregas, ambito, eee }) {
  const st = { activo: false, docs: new Map(), listo: false, lab: 'general', todos: false, el: null };
  const unsubs = []; let unsubClas = null, tSync = 0;
  const CLAVE = 'pd.conc.' + (ambito() || 'x');
  const idAl = `${ses.grupo}_${ses.numero}`;
  const leerCache = () => { try { return JSON.parse(localStorage.getItem(CLAVE) || 'null'); } catch (e) { return null; } };
  const guardarCache = (r) => { try { localStorage.setItem(CLAVE, JSON.stringify(r)); } catch (e) { /* modo privado */ } };
  const mio = () => resumenAlumno(entregas.values());
  const aviso = () => { try { window.dispatchEvent(new Event('portal-concurso')); } catch (e) { /* nada */ } };

  // Publicar el resumen propio (solo si cambia; no hace falta que el concurso esté activo para que luego salga al activarlo).
  async function sincronizar() {
    if (!eee) return;
    const r = mio(); const antes = leerCache();
    if (antes && iguales(sanear(antes), r)) return;
    if (!antes && !(r.cg || r.vg)) return; // sin puntos y sin nada publicado: no hay nada que decir
    try { await setDoc(doc(db, 'clasificacion', idAl), { grupo: ses.grupo, numero: ses.numero, cg: r.cg, ca: r.ca, vg: r.vg, va: r.va, fecha: serverTimestamp() }); guardarCache(r); }
    catch (e) { /* sin reglas nuevas o sin conexión: se reintenta con la siguiente entrega */ }
  }
  const alEntregas = () => { clearTimeout(tSync); tSync = setTimeout(() => { sincronizar(); repintar(); }, 1200); };
  if (eee) {
    window.addEventListener('portal-entregas', alEntregas);
    unsubs.push(onSnapshot(doc(db, 'concursos', ses.grupo), (snap) => {
      const on = !!(snap.exists() && snap.data().activo);
      if (on && !unsubClas) {
        unsubClas = onSnapshot(query(collection(db, 'clasificacion'), where('grupo', '==', ses.grupo)), (qs) => {
          st.docs = new Map(); qs.forEach((d) => { const x = d.data(); if (Number.isInteger(x.numero)) st.docs.set(x.numero, sanear(x)); }); st.listo = true; repintar(); aviso();
        }, () => { st.listo = true; repintar(); });
      }
      if (!on && unsubClas) { unsubClas(); unsubClas = null; st.docs = new Map(); st.listo = false; }
      const cambio = on !== st.activo; st.activo = on; if (cambio) { aviso(); repintar(); }
    }, () => { st.activo = false; aviso(); }));
    setTimeout(sincronizar, 2500);
  }

  // Filas del grupo: lo publicado por cada nº; la fila propia, siempre con mis entregas de ahora mismo.
  function filas() {
    const m = new Map(st.docs); const r = mio(); if (r.cg || r.vg) m.set(ses.numero, r); else m.delete(ses.numero);
    return [...m].map(([numero, v]) => ({ numero, ...v }));
  }
  function repintar() { if (st.el && st.el.isConnected && location.hash === '#concurso' ) pintar(); }

  const barraSup = () => `<header class="scr-top"><a href="#inicio" class="brand" title="Inicio"><span class="brand-n">SuperProfe<span class="brand-x"> Pablo para alumnos</span></span></a><div class="scr-ttl">Concurso</div>${window.PORTAL?.navHTML ? window.PORTAL.navHTML('conc') : ''}<div class="au-chip">${window.PORTAL?.chipHTML ? window.PORTAL.chipHTML() : ''}</div></header>`;
  function pintar() {
    const el = st.el; if (!el) return;
    const ac = document.activeElement; const foco = ac && el.contains(ac) ? (ac.dataset.cc === 'lab' ? `.cc-tab[data-v="${ac.dataset.v}"]` : ac.dataset.cc === 'todos' ? '.cc-mas' : '') : '';
    const lab = st.lab; const mx = maxDe(lab);
    const todas = clasificar(filas(), lab); const yo = todas.find((f) => f.numero === ses.numero) || null;
    const r = mio(); const mis = puntosDe(r, lab);
    const sup = yo ? todas.filter((f) => f.pts > yo.pts) : []; const prox = sup.length ? sup[sup.length - 1] : null; // el siguiente puesto por encima
    const aDe = prox ? prox.pts - yo.pts : 0;
    const nParts = todas.length;
    const detalle = lab === 'circ' ? [['Guiadas', r.cg, N_CIRC], ['Autónomas', r.ca, N_CIRC]] : lab === 'viv' ? [['Guiadas', r.vg, N_VIV], ['Autónomas', r.va, N_VIV]] : [['Circuitos', r.cg + r.ca, MAX_CIRC], ['Vivienda', r.vg + r.va, MAX_VIV]];
    const hero = !st.activo
      ? `<div class="cc-big" aria-hidden="true"><span class="cc-pos">${ic('trophy')}</span></div><div class="cc-hero-d"><p class="cc-msg">El profesor no ha activado el concurso en tu grupo.</p></div>`
      : `<div class="cc-big"><span class="cc-pos" aria-label="${yo ? `Vas en el puesto ${yo.puesto}` : 'Todavía sin puesto'}">${yo ? yo.puesto : '—'}</span><span class="cc-de">${yo ? `de ${nParts}` : 'sin puesto'}</span></div>
        <div class="cc-hero-d">
          <div class="cc-pts"><b>${mis}</b> / ${mx} puntos</div>
          <div class="cc-bar" role="progressbar" aria-valuemin="0" aria-valuemax="${mx}" aria-valuenow="${mis}" aria-label="Tus puntos"><i style="--w:${Math.round(mis / mx * 100)}%"></i></div>
          <p class="cc-msg">${!yo ? 'Completa tu primera práctica con «Comprobar» en verde para entrar en la clasificación.' : yo.puesto === 1 ? 'Vas el primero. A seguir.' : `Te faltan ${aDe} punto${aDe === 1 ? '' : 's'} para subir de puesto.`}</p>
          <div class="cc-chips">${detalle.map(([t, a, b]) => `<span class="cc-chip">${t} <b>${a}</b>/${b}</span>`).join('')}</div>
        </div>`;
    let L = st.todos ? todas : todas.slice(0, TOP); let extra = '';
    if (!st.todos && yo && !L.includes(yo)) { extra = `<li class="cc-sep" aria-hidden="true">···</li>${fila(yo, mx)}`; }
    const lista = !st.activo ? '' : todas.length
      ? `<ol class="cc-list" aria-label="Clasificación">${L.map((f) => fila(f, mx)).join('')}${extra}</ol>${todas.length > TOP ? `<button type="button" class="btn small cc-mas" data-cc="todos">${st.todos ? 'Ver solo los primeros' : `Ver los ${todas.length}`}</button>` : ''}`
      : (st.listo ? '<p class="au-vacio">Todavía nadie ha completado una práctica en este laboratorio. Sé el primero.</p>' : '<p class="au-small">Cargando…</p>');
    el.innerHTML = barraSup() + `<div class="au-page cc">
      <div class="au-crumbs"><a href="#inicio">Inicio</a> › <a href="#asignaturas">Asignaturas</a> › <span aria-current="page">Concurso</span></div>
      <h2>${ic('trophy')} Concurso de laboratorios</h2>
      <p class="au-small">Así va tu grupo en las prácticas de Circuitos y Vivienda. Solo se ven números de lista: nadie sabe quién es quién.</p>
      <div class="cc-tabs" role="tablist" aria-label="Laboratorio">${LABS.map(([k, t]) => `<button type="button" role="tab" class="cc-tab ${k === lab ? 'on' : ''}" aria-selected="${k === lab}" data-cc="lab" data-v="${k}">${ic(k === 'circ' ? 'cpu' : k === 'viv' ? 'house' : 'trophy')} ${t}</button>`).join('')}</div>
      <section class="cc-hero" aria-label="Tu puesto">${hero}</section>
      ${lista}
      <p class="au-small cc-nota">${ic('info')} Cada práctica guiada completada suma 1 punto y su autónoma, otro más. Se cuenta cuando «Comprobar» sale en verde.</p>
    </div>`;
    if (foco) el.querySelector(foco)?.focus({ preventScroll: true });
  }
  function fila(f, mx) {
    const yo = f.numero === ses.numero;
    return `<li class="cc-fila ${yo ? 'yo' : ''} ${f.puesto <= 3 ? 'top' + f.puesto : ''}" ${yo ? 'aria-current="true"' : ''}>
      <span class="cc-n" aria-label="Puesto ${f.puesto}">${f.puesto === 1 ? ic('trophy') : f.puesto}</span>
      <span class="cc-q">Nº ${pad(f.numero)}${yo ? ' <em class="cc-tu">Tú</em>' : ''}</span>
      <span class="cc-b" style="--w:${f.rel}%"><i></i></span>
      <span class="cc-p"><b>${f.pts}</b><small> / ${mx}</small></span></li>`;
  }
  function render(el) {
    st.el = el; pintar();
    if (!el.__cc) {
      el.__cc = true;
      el.addEventListener('click', (e) => {
        const b = e.target.closest('[data-cc]'); if (!b) return;
        if (b.dataset.cc === 'lab') { st.lab = b.dataset.v; st.todos = false; pintar(); el.querySelector(`.cc-tab[data-v="${st.lab}"]`)?.focus({ preventScroll: true }); }
        if (b.dataset.cc === 'todos') { st.todos = !st.todos; pintar(); }
      });
    }
  }
  function parar() { clearTimeout(tSync); window.removeEventListener('portal-entregas', alEntregas); unsubs.forEach((f) => { try { f(); } catch (e) { /* nada */ } }); if (unsubClas) unsubClas(); }
  return { render, parar, activo: () => st.activo, disponible: () => eee };
}

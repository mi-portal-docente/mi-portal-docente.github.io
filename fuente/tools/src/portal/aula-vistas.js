// Página de cada elemento del aula (#trabajo/<id>): material, tarea con entrega, actividad de clase,
// examen con ventana y tiempo límite. (El «Trabajo de clase» y el tablón están en aula-clase.js.)
// Sirven al alumno (con su grupo + nº + PIN) y al profesor (vista previa).
import { doc, setDoc, updateDoc, serverTimestamp, arrayUnion } from 'firebase/firestore';
import { esc } from './util.js';
import { ic } from './ico.js';
import { asignatura, TIPOS } from '../lms/biblioteca.js';
import { fmtNota, barajar, semilla, leeEnlaces, urlSegura, idTrabajo, TIPOS_ENTREGA, corregirExamen, tipoAdjunto } from '../lms/modelo.js';
import { preguntaHTML, leerRespuesta, enlazarPreguntas, solucionTexto, nombreTipoPregunta } from './examen-ui.js';
import { crearModoExamen } from './modo-examen.js';
import { montarExplicacion } from './explicacion-ui.js';
import { montarPiac } from './piac-ui.js';
import { montarEntrega } from './entrega-ui.js';
import { crearEditorDoc } from './doc-editor.js';
import { estadoTrabajo, ESTADOS_TRABAJO } from '../lms/entrega.js';

// Motores con vista propia en la página del elemento. Los laboratorios que viven en app.js se
// registran en window.PORTAL_MOTORES[tipo] = (nodo, item, opciones) => ({ actualizar }).
const MOTORES_UI = { explicacion: montarExplicacion, piac: montarPiac };
const montadorDe = (tipo) => MOTORES_UI[tipo] || window.PORTAL_MOTORES?.[tipo] || null;

const fFecha = (t) => (t ? new Date(t).toLocaleString('es-ES', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '');
const pad = (n) => String(n).padStart(2, '0');
export function textoHTML(t) {
  let h = esc(t || '');
  h = h.replace(/\*\*([^*\n]{1,200})\*\*/g, '<b>$1</b>');
  h = h.replace(/(https?:\/\/[^\s<]+[^\s<.,;:!?)])/g, (u) => `<a href="${u}" target="_blank" rel="noopener noreferrer">${u}</a>`);
  return h.split(/\n{2,}/).map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
}
export const nombreUnidad = (asig, uid) => (uid === 'general' ? 'General' : asignatura(asig)?.unidades.find((u) => u.id === uid)?.titulo || uid);
const ordenUnidad = (asig, uid) => { const i = asignatura(asig)?.unidades.findIndex((u) => u.id === uid); return i == null || i < 0 ? 999 : i; };
export function ordenarItems(L) {
  return L.sort((a, b) => ordenUnidad(a.asig, a.unidad) - ordenUnidad(b.asig, b.unidad) || (a.orden || 0) - (b.orden || 0) || a.titulo.localeCompare(b.titulo, 'es', { numeric: true }));
}
const icono = (tipo) => TIPOS[tipo]?.icon || '📄';
const nombreTipo = (tipo) => TIPOS[tipo]?.nombre || tipo;
export function adjuntosHTML(L) {
  if (!L?.length) return '';
  return `<div class="cl-adjs">${L.map((e) => { const t = tipoAdjunto(e.u); const interno = String(e.u).startsWith('#'); return `<a class="cl-adj-c" href="${esc(urlSegura(e.u))}" ${interno ? '' : 'target="_blank" rel="noopener noreferrer"'}><span class="cl-adj-ic">${t.ic}</span><span><b>${esc(e.t || e.u)}</b><span class="au-small">${esc(t.t)}</span></span></a>`; }).join('')}</div>`;
}
const barraSup = (activa = 'asig') => `<header class="scr-top"><a href="#inicio" class="brand" title="Inicio">SuperProfe · Alumnos</a><div class="scr-ttl">Aula virtual</div>${window.PORTAL?.navHTML ? window.PORTAL.navHTML(activa) : ''}<div class="au-chip">${window.PORTAL?.chipHTML ? window.PORTAL.chipHTML() : ''}</div></header>`;

export function crearVistas({ db, aula, rol, ses, uid }) {
  const st = aula.st;
  const al = ses ? `${ses.grupo}_${ses.numero}` : null;
  const ex = { id: null, examen: null, resp: {}, timer: null, guardado: 0, tGuardar: null, enviando: false, error: '' };
  let actual = null; // {el, tipo: 'lista'|'item', id}
  let motorM = null; // motor montado en la página del elemento
  let entM = null; // entrega (fase 9) montada en la página del elemento
  // Modo examen (pantalla completa + registro informativo de salidas). Solo alumno.
  const modo = rol === 'alumno' ? crearModoExamen({ db, ses, uid }) : null;

  // ---------------------------------------------------------------- estado de cada elemento (alumno)
  function ventana(it) { const e = it.examen || {}; return { desde: e.desde || 0, hasta: e.hasta || 0, limiteMin: e.limiteMin || null }; }
  function estado(it) {
    if (rol === 'profesor') return it.publicado ? ['pub', 'Publicado'] : ['borr', 'Borrador'];
    if (it.tipo === 'material') return ['mat', ''];
    const n = st.notas.get(it.id); const tr = st.trabajos.get(it.id); const now = Date.now();
    if (n && n.nota != null && !['borrador', 'devuelto'].includes(tr?.estado)) return ['nota', `Nota: ${fmtNota(n.nota)}`];
    if (it.tipo === 'examen') {
      if (tr?.estado === 'entregado') return ['ok', 'Entregado'];
      const v = ventana(it);
      if (tr?.estado === 'en_curso' && now <= v.hasta) return ['curso', 'En curso'];
      if (tr) return ['ok', 'Sin terminar'];
      if (now < v.desde) return ['prox', `Abre ${fFecha(v.desde)}`];
      if (now <= v.hasta) return ['abierto', 'Disponible ahora'];
      return ['cerr', 'Cerrado'];
    }
    const e = estadoTrabajo(tr, n);
    if (e === 'borrador') return ['curso', 'Borrador · sin entregar'];
    if (e === 'devuelto') return ['tarde', ESTADOS_TRABAJO.devuelto.t];
    if (tr) return ['ok', it.fechaEntrega && tr.fecha > it.fechaEntrega ? 'Entregado (con retraso)' : 'Entregado'];
    if (it.fechaEntrega && now > it.fechaEntrega) return ['tarde', 'Sin entregar · fuera de plazo'];
    return ['pend', it.fechaEntrega ? `Para el ${fFecha(it.fechaEntrega)}` : 'Pendiente'];
  }

  // ---------------------------------------------------------------- página de un elemento
  function rubricaHTML(it, n) {
    if (!it.rubrica?.length) return '';
    const det = n?.detalle || {};
    return `<h4>Rúbrica</h4><table class="au-t"><thead><tr><th>Criterio</th><th class="c">Puntos</th>${n ? '<th class="c">Obtenidos</th>' : ''}</tr></thead><tbody>${it.rubrica.map((r, i) => r.clase ? `<tr><td>${esc(r.c)}</td><td class="c au-small" colspan="${n ? 2 : 1}">Se evalúa en clase</td></tr>` : `<tr><td>${esc(r.c)}${r.niveles?.some(Boolean) ? `<div class="au-small">${r.niveles.map((x, k) => x ? `${k + 1}: ${esc(x)}` : '').filter(Boolean).join(' · ')}</div>` : ''}</td><td class="c">${esc(fmtNota(r.p))}</td>${n ? `<td class="c"><b>${det['r' + i] != null ? esc(fmtNota(det['r' + i])) : '—'}</b></td>` : ''}</tr>`).join('')}</tbody></table>`;
  }
  function notaHTML(it) {
    const n = st.notas.get(it.id); if (!n) return '';
    return `<div class="au-nota"><div class="au-nota-n">Nota: <b>${esc(fmtNota(n.nota))}</b>${n.max && n.puntos != null ? ` <span class="au-small">(${esc(fmtNota(n.puntos))} / ${esc(fmtNota(n.max))} puntos)</span>` : ''}</div>${n.comentario ? `<div class="au-nota-c">💬 ${esc(n.comentario)}</div>` : ''}</div>`;
  }
  function cabeceraItem(it) {
    const a = asignatura(it.asig);
    return `<div class="au-crumbs"><a href="#inicio">Inicio</a> › <a href="#asignaturas">Asignaturas</a> › <a href="#asig/${esc(it.asig)}">${esc(a?.corto || it.asig)}</a> › <a href="#asig/${esc(it.asig)}/trabajo">Trabajo de clase</a> › <span aria-current="page">${esc(it.titulo)}</span></div>
      <div class="au-tipo">${icono(it.tipo)} ${esc(nombreTipo(it.tipo))} · ${esc(st.temas.get(it.tema)?.nombre || (it.unidad && !it.tema ? nombreUnidad(it.asig, it.unidad) : 'Sin tema'))}${it.puntos ? ` · ${esc(fmtNota(it.puntos))} puntos` : ''}</div><h2>${esc(it.titulo)}</h2>`;
  }
  function entregaHTML(it) {
    const tr = st.trabajos.get(it.id); const n = st.notas.get(it.id);
    const ta = (v) => esc(v || '');
    const act = it.tipo === 'actividad' && (it.enlaces || []).find((e) => (/^#asig\/[\w-]+\/actividades\/[\w-]+$/.test(e.u) || /^#[a-z0-9]{2,8}\/[a-z0-9-]{2,30}\/[\w-]{1,40}$/.test(e.u)));
    // Tareas, proyectos, prácticas… (fase 9): borrador, entregar, anular, devolver, imprimir y comentarios.
    if (it.tipo !== 'pregunta' && !act) return '<div id="auEntregaM" class="au-entrega"></div>';
    let h = '<h4>Tu entrega</h4>';
    if (tr) h += `<div class="au-ok">${ic('circle-check')} Entregado · ${esc(fFecha(tr.fecha))}${it.fechaEntrega && tr.fecha > it.fechaEntrega ? ' · <b>con retraso</b>' : ''}${tr.pendiente ? ' · enviando…' : ''}</div>`;
    if (n) return h + notaHTML(it) + (tr ? `<div class="au-mia">${textoHTML(tr.texto)}${(tr.enlaces || []).map((u) => `<div>${ic('link')} <a href="${esc(urlSegura(u))}" target="_blank" rel="noopener noreferrer">${esc(u)}</a></div>`).join('')}</div>` : '');
    if (act) return h + `${tr ? `<div class="au-mia">${textoHTML(tr.texto)}</div>` : ''}<div class="au-acts"><a class="btn primary" href="${esc(act.u)}">${ic('play')} ${tr ? 'Repetir la actividad' : 'Hacer la actividad'}</a></div><p class="au-small">El resultado se entrega desde la propia actividad, al terminar. Puedes repetirla y volver a entregar hasta que el profesor la califique.</p>`;
    return h + `<form id="auEntrega" class="au-form" autocomplete="off">
      ${it.opciones?.length ? `<fieldset class="au-q"><legend>Elige una respuesta</legend>${it.opciones.map((o) => `<label class="au-op"><input type="radio" name="texto" value="${esc(o)}" ${tr?.texto === o ? 'checked' : ''} required> ${esc(o)}</label>`).join('')}</fieldset>`
        : `<label>Tu respuesta<textarea name="texto" maxlength="3000" rows="3" required placeholder="Escribe tu respuesta. No pongas tu nombre.">${ta(tr?.texto)}</textarea></label>`}
      <div class="au-acts"><button class="btn primary" type="submit">${tr ? ic('refresh-cw') + ' Cambiar la respuesta' : ic('send') + ' Responder'}</button><span class="au-msg" id="auMsg"></span></div></form>`;
  }
  function examenInfoHTML(it) {
    const v = ventana(it); const tr = st.trabajos.get(it.id); const now = Date.now();
    let h = `<div class="au-facts"><div><b>Abre</b>${esc(fFecha(v.desde))}</div><div><b>Cierra</b>${esc(fFecha(v.hasta))}</div><div><b>Tiempo</b>${v.limiteMin ? v.limiteMin + ' min' : 'sin límite'}</div><div><b>Preguntas</b>${esc(it.examen?.n ?? '—')}</div></div>`;
    if (rol === 'profesor') return h + `<div class="au-acts"><button class="btn" data-au="verPreguntas">👁 Ver preguntas y soluciones</button><button class="btn" data-au="editar">✏️ Editar</button></div><div id="auPrev"></div>`;
    if (st.notas.get(it.id)) return h + notaHTML(it);
    if (tr?.estado === 'entregado') return h + '<div class="au-ok">✅ Examen entregado. Verás la nota cuando el profesor la publique.</div>';
    if (tr?.estado === 'en_curso' && now <= Math.min(v.hasta, tr.inicio + (v.limiteMin ? v.limiteMin * 60e3 : Infinity)) + 60e3) return h + '<div class="au-acts"><button class="btn primary" data-au="seguir">▶ Continuar el examen</button></div>';
    if (tr) return h + '<div class="au-ok">⏱ Se acabó el tiempo. Se han guardado las respuestas que diste.</div>';
    if (now < v.desde) return h + `<p class="au-vacio">El examen se abrirá el ${esc(fFecha(v.desde))}.</p>`;
    if (now > v.hasta) return h + '<p class="au-vacio">El plazo del examen ha terminado.</p>';
    const me = it.examen?.pantallaCompleta ? '<div class="au-aviso ex-modo-aviso">' + ic('shield-check') + ' <b>Modo examen</b>: se abrirá a pantalla completa. Si sales de la pestaña o de la pantalla completa, queda anotada la hora y cuánto tiempo (lo ve solo tu profesor). No anula el examen.</div>' : '';
    return h + me + `<div class="au-aviso">Solo tienes <b>un intento</b>. ${v.limiteMin ? `Tendrás <b>${v.limiteMin} minutos</b> desde que pulses «Empezar».` : ''} Las respuestas se guardan solas mientras contestas.</div>
      <div class="au-acts"><button class="btn primary" data-au="empezar">▶ Empezar el examen</button><span class="au-msg" id="auMsg"></span></div>`;
  }
  function itemHTML(it) {
    let h = cabeceraItem(it);
    if (rol === 'profesor') h += `<div class="au-prof">${!it.publicado ? '⚪ Borrador' : it.pub && it.pub > Date.now() ? '🕒 Programado para el ' + esc(fFecha(it.pub)) : '🟢 Publicado'} · ${esc((it.grupos || []).length)} grupo(s) <button class="btn small" data-au="editar">✏️ Editar</button></div>`;
    if (rol === 'profesor' && (it.pendiente || it.nota)) h += `<div class="cl-nota-v ${it.pendiente ? 'pend' : ''}">🔒 <b>${it.pendiente ? 'Pendiente de completar' : 'Nota privada'}</b>${it.nota ? ' · ' + esc(it.nota) : ''} <span class="muted small">(solo la ves tú)</span></div>`;
    if (it.fechaEntrega && it.tipo !== 'examen') h += `<div class="au-fecha">📅 Fecha de entrega: <b>${esc(fFecha(it.fechaEntrega))}</b></div>`;
    if (it.tipo === 'recuperacion' && rol === 'profesor') h += `<div class="au-aviso">${ic('user-check')} Solo la ven los nº de lista <b>${esc((it.para || []).join(', ') || '—')}</b> de sus grupos.</div>`;
    if (it.texto || !(it.contenido && montadorDe(it.tipo))) h += `<div class="au-texto">${it.texto ? textoHTML(it.texto) : '<p class="au-small">Sin instrucciones.</p>'}</div>`;
    if (it.texto && voz()) h += `<div class="au-voz"><button class="btn small" data-au="leer" aria-pressed="false">${ic('volume-2')} Leer en voz alta</button></div>`;
    if (it.enlaces?.length) h += `<h4>Adjuntos</h4>${adjuntosHTML(it.enlaces)}`;
    h += rubricaHTML(it, st.notas.get(it.id));
    if (it.tipo === 'examen') h += examenInfoHTML(it);
    else if (it.contenido && montadorDe(it.tipo)) h += `${rol === 'alumno' && st.notas.get(it.id) ? notaHTML(it) : ''}<div id="auMotor" class="au-motor"></div>`;
    else if (TIPOS_ENTREGA.includes(it.tipo) && rol === 'alumno') h += entregaHTML(it);
    return h;
  }
  function renderItem(el, id) {
    if (!el) return; actual = { el, tipo: 'item', id };
    if (ex.id === id && ex.examen && rol === 'alumno') return; // examen en marcha: no se repinta
    let it = st.items.get(id); if (it && rol === 'alumno' && it.pub && it.pub > Date.now()) it = null;
    if (!it) { el.innerHTML = barraSup() + `<div class="au-page">${st.listo.items ? '<p class="au-vacio">Este elemento no existe o no está publicado para tu grupo.</p><a class="btn" href="#asignaturas">← Asignaturas</a>' : '<p class="au-small">Cargando…</p>'}</div>`; return; }
    // motor ya montado (explicación, laboratorio…): no se repinta para no perder lo que está haciendo el alumno
    if (motorM && motorM.id === id && motorM.nota === !!st.notas.get(id) && el.contains(motorM.nodo)) { motorM.api?.actualizar?.({ trabajo: st.trabajos.get(id), nota: st.notas.get(id) }); return; }
    if (entM && entM.id === id && el.contains(entM.nodo)) { entM.api.actualizar({ trabajo: st.trabajos.get(id), nota: st.notas.get(id) }); return; }
    motorM?.api?.destruir?.(); entM?.api?.destruir?.(); entM = null;
    el.innerHTML = barraSup() + `<div class="au-page">${itemHTML(it)}</div>`;
    const nodo = el.querySelector('#auMotor'); motorM = null;
    if (nodo) {
      const montar = montadorDe(it.tipo);
      const api = montar(nodo, it, { rol, db, ses, aula: st, trabajo: st.trabajos.get(id), nota: st.notas.get(id), entregar: rol === 'alumno' ? (texto, extra) => entregarActividad(it.id, texto, extra) : null });
      motorM = { id, nodo, api, nota: !!st.notas.get(id) };
    }
    const nE = el.querySelector('#auEntregaM');
    if (nE && rol === 'alumno') entM = { id, nodo: nE, api: montarEntrega(nE, it, { db, ses, uid, al, trabajo: st.trabajos.get(id), nota: st.notas.get(id), textoHTML, ...(it.tipo === 'documento' ? { editor: crearEditorDoc(it, { db, ses }) } : {}) }) };
  }
  function repintar() {
    if (!actual || !actual.el.isConnected) return;
    if (actual.tipo === 'cal') return renderCalendario(actual.el);
    if (actual.tipo === 'mis') return renderMisTrabajos(actual.el);
    if (!document.activeElement || !actual.el.contains(document.activeElement) || document.activeElement.tagName === 'BUTTON') renderItem(actual.el, actual.id);
  }
  window.addEventListener('portal-aula', repintar);

  // ---------------------------------------------------------------- entregar tarea
  async function entregarTarea(f) {
    const it = st.items.get(actual?.id); if (!it) return;
    const msg = f.querySelector('#auMsg'); const btn = f.querySelector('button[type=submit]');
    const fd = new FormData(f); const texto = String(fd.get('texto') || '').slice(0, 10000);
    const enlaces = leeEnlaces(fd.get('enlaces'), 10).map((e) => e.u);
    if (!texto.trim() && !enlaces.length) { msg.textContent = 'Escribe una respuesta o añade un enlace.'; msg.className = 'au-msg ko'; return; }
    btn.disabled = true; msg.textContent = 'Enviando…'; msg.className = 'au-msg';
    try {
      await setDoc(doc(db, 'trabajos', idTrabajo(it.id, ses.grupo, ses.numero)), { item: it.id, curso: it.curso, asig: it.asig, al, grupo: ses.grupo, numero: ses.numero, uid: uid(), tipo: 'tarea', texto, enlaces, fecha: serverTimestamp(), estado: 'entregado' }, { merge: true });
      msg.textContent = '✔ Entregado'; msg.className = 'au-msg ok';
    } catch (e) {
      msg.textContent = e?.code === 'permission-denied' ? '❌ No se ha aceptado: puede que ya esté corregida o que tu sesión haya caducado.' : '❌ Revisa la conexión y vuelve a intentarlo.'; msg.className = 'au-msg ko';
    } finally { btn.disabled = false; }
  }

  // ---------------------------------------------------------------- examen (alumno)
  function limiteDe(it, tr) { const v = ventana(it); return Math.min(v.hasta, v.limiteMin ? tr.inicio + v.limiteMin * 60e3 : Infinity); }
  async function empezar(btn) {
    const it = st.items.get(actual?.id); if (!it) return;
    const msg = document.getElementById('auMsg'); btn.disabled = true; if (msg) msg.textContent = 'Abriendo el examen…';
    try {
      if (!st.trabajos.get(it.id)) await setDoc(doc(db, 'trabajos', idTrabajo(it.id, ses.grupo, ses.numero)), { item: it.id, curso: it.curso, asig: it.asig, al, grupo: ses.grupo, numero: ses.numero, uid: uid(), tipo: 'examen', respuestas: {}, inicio: serverTimestamp(), fecha: serverTimestamp(), estado: 'en_curso' });
      await abrirExamen(it);
    } catch (e) {
      btn.disabled = false; if (msg) { msg.textContent = e?.code === 'permission-denied' ? '❌ El examen no está abierto ahora mismo (o ya lo has hecho).' : '❌ Revisa la conexión y vuelve a intentarlo.'; msg.className = 'au-msg ko'; }
    }
  }
  async function abrirExamen(it) {
    const { examen } = await aula.examen(it.id);
    if (!examen) throw { code: 'permission-denied' };
    const tr = st.trabajos.get(it.id) || { inicio: Date.now(), respuestas: {} };
    Object.assign(ex, { id: it.id, examen, resp: { ...(tr.respuestas || {}) }, guardado: Date.now(), enviando: false, error: '' });
    const s = semilla(it.id + '|' + al);
    const qs = examen.barajar ? barajar(examen.preguntas || [], s) : (examen.preguntas || []);
    const r = (q) => ex.resp[q.id];
    actual.el.innerHTML = barraSup() + `<div class="au-page au-examen">${cabeceraItem(it)}
      <div class="au-reloj" id="auReloj" role="timer"></div>
      ${examen.pantallaCompleta ? '<div class="ex-modo" id="exModo" role="status">' + ic('shield-check') + ' Modo examen · las salidas de la pestaña o de la pantalla completa quedan anotadas (solo informativo). <button type="button" class="btn tiny" data-au="pantalla">' + ic('maximize') + ' Volver a pantalla completa</button></div>' : ''}
      <form id="auExamen" class="au-form" autocomplete="off">${qs.map((q, n) => preguntaHTML(q, r(q), { n: n + 1, barajarOps: examen.barajar, s })).join('')}
        <div class="au-acts"><button type="submit" class="btn primary">📤 Entregar el examen</button><span class="au-msg" id="auMsg"></span></div>
        <p class="au-small">Las respuestas se guardan solas. Si se corta la conexión, vuelve a entrar con tu código, tu número y tu PIN: podrás seguir mientras quede tiempo.</p></form></div>`;
    enlazarPreguntas(actual.el, () => { const f = document.getElementById('auExamen'); if (f && ex.examen) { leerRespuestas(f); programarGuardado(); } });
    if (examen.pantallaCompleta) modo?.empezar(it); else modo?.parar();
    clearInterval(ex.timer); ex.timer = setInterval(() => tic(it), 1000); tic(it);
  }
  function tic(it) {
    const tr = st.trabajos.get(it.id); const el = document.getElementById('auReloj');
    if (!el || ex.id !== it.id) { clearInterval(ex.timer); return; }
    if (tr?.estado === 'entregado') { modo?.parar(true); clearInterval(ex.timer); ex.id = null; ex.examen = null; renderItem(actual.el, it.id); return; }
    const fin = limiteDe(it, tr || { inicio: Date.now() }); const s = Math.max(0, Math.round((fin - Date.now()) / 1000));
    el.textContent = `⏱ Tiempo restante: ${Math.floor(s / 60)}:${pad(s % 60)}`; el.classList.toggle('poco', s < 120);
    if (s <= 0 && !ex.enviando) entregarExamen(true);
  }
  function leerRespuestas(f) {
    const q = ex.examen.preguntas || [];
    for (const p of q) {
      const fs = f.querySelector(`fieldset[data-q="${CSS.escape(p.id)}"]`); if (!fs) continue;
      const v = leerRespuesta(p, fs);
      if (v === null) continue; // test / V-F sin marcar: se deja lo que hubiera
      if (v === undefined) delete ex.resp[p.id]; else ex.resp[p.id] = v;
    }
  }
  function programarGuardado() {
    clearTimeout(ex.tGuardar);
    const espera = Math.max(3000, 10000 - (Date.now() - ex.guardado));
    ex.tGuardar = setTimeout(guardarExamen, espera);
  }
  async function guardarExamen() {
    if (!ex.id || ex.enviando) return;
    ex.guardado = Date.now();
    try { await updateDoc(doc(db, 'trabajos', idTrabajo(ex.id, ses.grupo, ses.numero)), { respuestas: ex.resp, fecha: serverTimestamp() }); } catch (e) { /* se reintenta al entregar */ }
  }
  async function entregarExamen(auto) {
    if (!ex.id || ex.enviando) return;
    const f = document.getElementById('auExamen'); if (f) leerRespuestas(f);
    if (!auto && !confirm('¿Entregar el examen? Después ya no podrás cambiar las respuestas.')) return;
    ex.enviando = true; clearTimeout(ex.tGuardar);
    const msg = document.getElementById('auMsg'); if (msg) msg.textContent = 'Entregando…';
    const id = ex.id;
    try {
      await updateDoc(doc(db, 'trabajos', idTrabajo(id, ses.grupo, ses.numero)), { respuestas: ex.resp, estado: 'entregado', fecha: serverTimestamp() });
      modo?.parar(true);
      clearInterval(ex.timer); ex.id = null; ex.examen = null; renderItem(actual.el, id);
    } catch (e) {
      ex.enviando = false;
      if (msg) { msg.textContent = auto ? '⏱ Se acabó el tiempo: se han guardado las últimas respuestas enviadas.' : '❌ No se ha podido entregar. Revisa la conexión y vuelve a pulsar.'; msg.className = 'au-msg ko'; }
      if (auto) { clearInterval(ex.timer); ex.id = null; ex.examen = null; }
    }
  }

  // ---------------------------------------------------------------- vista previa del profesor
  async function verPreguntas() {
    const it = st.items.get(actual?.id); const box = document.getElementById('auPrev'); if (!it || !box) return;
    box.innerHTML = '<p class="au-small">Cargando…</p>';
    try {
      const { examen, claves } = await aula.examen(it.id, { claves: true });
      const k = claves?.respuestas || {};
      const pq = examen?.preguntas || [];
      const prueba = corregirExamen(pq, k, k);
      box.innerHTML = pq.length ? `<ol class="au-prev">${pq.map((q) => `<li><div>${textoHTML(q.enunciado)} <span class="au-small">(${esc(fmtNota(q.puntos || 1))} pt)</span></div>
        ${q.criterio ? `<span class="au-crit">${esc(q.criterio)}</span>` : ''}${q.tipo === 'test' ? `<ul>${(q.opciones || []).map((o, i) => `<li class="${Number(k[q.id]) === i ? 'ok' : ''}">${Number(k[q.id]) === i ? '✔ ' : ''}${esc(o)}</li>`).join('')}</ul>`
        : q.tipo === 'vf' ? `<div class="ok">✔ ${k[q.id] ? 'Verdadero' : 'Falso'}</div>` : q.tipo === 'corta' ? `<div class="ok">✔ Se aceptan: ${esc((k[q.id] || []).join(' · ') || '— (corrección manual)')}</div>`
        : `<div class="au-small">${esc(nombreTipoPregunta(q.tipo))}</div><div class="ok">${ic('check')} ${esc(solucionTexto(q, k[q.id]))}</div>`}</li>`).join('')}</ol>
        <p class="au-small">Total: ${esc(fmtNota(prueba.max))} puntos · ${examen.barajar ? 'preguntas y opciones barajadas para cada alumno' : 'sin barajar'}.</p>` : '<p class="au-vacio">Este examen todavía no tiene preguntas.</p>';
    } catch (e) { box.innerHTML = '<p class="au-vacio">No se han podido cargar las preguntas.</p>'; }
  }

  // ---------------------------------------------------------------- eventos
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-au]'); if (!b || !actual?.el.contains(b)) return;
    if (b.dataset.au === 'empezar') { const it = st.items.get(actual.id); if (it?.examen?.pantallaCompleta) modo?.pedirPantalla(); empezar(b); }
    if (b.dataset.au === 'pantalla') modo?.pedirPantalla();
    if (b.dataset.au === 'seguir') { const it = st.items.get(actual.id); if (it?.examen?.pantallaCompleta) modo?.pedirPantalla(); b.disabled = true; abrirExamen(it).catch(() => { b.disabled = false; alert('El examen ya no está abierto.'); }); }
    if (b.dataset.au === 'verPreguntas') verPreguntas();
    if (b.dataset.au === 'editar') window.PORTAL?.aula?.editar?.(actual.id);
    if (b.dataset.au === 'leer') leerEnVoz(b);
    if (b.dataset.au === 'calMes') { cal.mes += +b.dataset.d; renderCalendario(actual.el); }
    if (b.dataset.au === 'calHoy') { cal.mes = 0; renderCalendario(actual.el); }
    if (b.dataset.au === 'mtF') { mt.f = b.dataset.f; renderMisTrabajos(actual.el); }
  });
  document.addEventListener('submit', (e) => {
    if (!actual?.el.contains(e.target)) return;
    if (e.target.id === 'auEntrega') { e.preventDefault(); entregarTarea(e.target); }
    if (e.target.id === 'auExamen') { e.preventDefault(); entregarExamen(false); }
  });
  const alCambiar = (e) => { const f = e.target.closest?.('#auExamen'); if (f && ex.examen) { leerRespuestas(f); programarGuardado(); } };
  document.addEventListener('change', alCambiar); document.addEventListener('input', alCambiar);
  window.addEventListener('hashchange', () => { if (ex.id && !location.hash.startsWith('#trabajo/' + ex.id)) { guardarExamen(); modo?.parar(true); clearInterval(ex.timer); ex.id = null; ex.examen = null; } });

  // ---------------------------------------------------------------- actividades de clase (alumno)
  // Tarea de tipo «actividad» publicada para su grupo que enlaza a esta actividad (#asig/<a>/actividades/<id>).
  function asignacionActividad(url) {
    if (rol !== 'alumno') return null; const t = Date.now();
    const it = [...st.items.values()].filter((x) => x.tipo === 'actividad' && x.publicado && !(x.pub && x.pub > t) && (x.enlaces || []).some((e) => e.u === url)).sort((a, b) => (b.pub || b.actualizado || 0) - (a.pub || a.actualizado || 0))[0];
    if (!it) return null; const tr = st.trabajos.get(it.id); const n = st.notas.get(it.id);
    return { itemId: it.id, titulo: it.titulo, fechaEntrega: it.fechaEntrega || null, entregado: !!tr, texto: tr?.texto || '', nota: n && n.nota != null ? fmtNota(n.nota) : null };
  }
  async function entregarActividad(itemId, texto) {
    const it = st.items.get(itemId); if (!it || rol !== 'alumno') throw new Error('sin-tarea');
    await setDoc(doc(db, 'trabajos', idTrabajo(it.id, ses.grupo, ses.numero)), { item: it.id, curso: it.curso, asig: it.asig, al, grupo: ses.grupo, numero: ses.numero, uid: uid(), tipo: 'tarea', texto: String(texto).slice(0, 10000), enlaces: [], fecha: serverTimestamp(), estado: 'entregado' }, { merge: true });
  }

  // ---------------------------------------------------------------- lectura en voz alta (Web Speech, voz en castellano)
  function voz() { return typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined'; }
  function leerEnVoz(b) {
    const S = window.speechSynthesis;
    if (S.speaking || b.getAttribute('aria-pressed') === 'true') { S.cancel(); b.setAttribute('aria-pressed', 'false'); b.innerHTML = `${ic('volume-2')} Leer en voz alta`; return; }
    const txt = actual.el.querySelector('.au-texto')?.innerText || ''; if (!txt.trim()) return;
    const u = new SpeechSynthesisUtterance(txt.slice(0, 20000)); u.lang = 'es-ES'; u.rate = 0.95;
    const v = S.getVoices().find((x) => /^es(-|_)ES/i.test(x.lang)) || S.getVoices().find((x) => /^es/i.test(x.lang)); if (v) u.voice = v;
    u.onend = u.onerror = () => { if (b.isConnected) { b.setAttribute('aria-pressed', 'false'); b.innerHTML = `${ic('volume-2')} Leer en voz alta`; } };
    S.cancel(); S.speak(u); b.setAttribute('aria-pressed', 'true'); b.innerHTML = `${ic('circle-stop')} Parar la lectura`;
  }
  window.addEventListener('hashchange', () => { if (voz()) window.speechSynthesis.cancel(); });

  // ---------------------------------------------------------------- «Mis trabajos» (#mis-trabajos, alumno)
  // Todos sus trabajos de todas las asignaturas: estado, fecha y nota publicada. También los del laboratorio.
  const mt = { f: 'todos' };
  function filasMisTrabajos() {
    const t = Date.now(); const L = [];
    for (const it of st.items.values()) {
      if (it.pub && it.pub > t) continue;
      if (it.tipo === 'material' || !(TIPOS_ENTREGA.includes(it.tipo) || it.tipo === 'examen' || montadorDe(it.tipo))) continue;
      const tr = st.trabajos.get(it.id); const n = st.notas.get(it.id);
      let e = it.tipo === 'examen' ? (n && n.nota != null ? 'calificado' : tr?.estado === 'entregado' ? 'entregado' : tr ? 'borrador' : 'sin') : estadoTrabajo(tr, n);
      L.push({ href: '#trabajo/' + it.id, titulo: it.titulo, asig: it.asig, tipo: it.tipo, e, fecha: tr?.fecha || null, limite: it.tipo === 'examen' ? it.examen?.hasta : it.fechaEntrega, nota: n && n.nota != null ? n.nota : null });
    }
    for (const x of window.PORTAL?.entregasLab?.() || []) L.push({ href: null, titulo: x.titulo || x.practica, asig: 'eee', tipo: 'lab', e: x.nota != null ? 'calificado' : 'entregado', fecha: x.fecha, limite: null, nota: x.nota });
    return L.sort((a, b) => (b.fecha || b.limite || 0) - (a.fecha || a.limite || 0));
  }
  function renderMisTrabajos(el) {
    if (!el) return; actual = { el, tipo: 'mis', id: null };
    const todos = filasMisTrabajos();
    const F = { todos: ['Todos', () => true], pend: ['Pendientes', (x) => x.e === 'sin' || x.e === 'borrador' || x.e === 'devuelto'], ent: ['Entregados', (x) => x.e === 'entregado'], cal: ['Calificados', (x) => x.e === 'calificado'] };
    const L = todos.filter(F[mt.f][1]);
    const fila = (x) => `<tr><td>${x.href ? `<a href="${esc(x.href)}">${esc(x.titulo)}</a>` : esc(x.titulo)}<div class="au-small">${esc(x.tipo === 'lab' ? 'Laboratorio' : nombreTipo(x.tipo))}</div></td><td>${esc(asignatura(x.asig)?.corto || x.asig)}</td><td>${estadoChipMini(x.e)}</td><td>${esc(x.fecha ? fFecha(x.fecha) : x.limite ? 'Para el ' + fFecha(x.limite) : '—')}</td><td class="c">${x.nota != null ? `<b>${esc(fmtNota(x.nota))}</b>` : '<span class="au-small">—</span>'}</td></tr>`;
    el.innerHTML = barraSup('mis') + `<div class="au-page mt-page"><h2>${ic('briefcase')} Mis trabajos</h2>
      <div class="mt-filtros" role="group" aria-label="Filtrar">${Object.entries(F).map(([k, [t, f]]) => `<button class="btn small ${mt.f === k ? 'primary' : ''}" data-au="mtF" data-f="${k}" aria-pressed="${mt.f === k}">${esc(t)} <span class="mt-n">${todos.filter(f).length}</span></button>`).join('')}</div>
      ${!st.listo.items ? '<p class="au-small">Cargando…</p>' : L.length ? `<div class="mt-wrap"><table class="au-t mt-t"><thead><tr><th>Trabajo</th><th>Asignatura</th><th>Estado</th><th>Fecha</th><th class="c">Nota</th></tr></thead><tbody>${L.map(fila).join('')}</tbody></table></div>` : '<p class="au-vacio">No hay trabajos en esta lista.</p>'}
      <p class="au-small">Solo ves las notas que tu profesor ha publicado.</p></div>`;
  }
  const estadoChipMini = (e) => { const x = ESTADOS_TRABAJO[e] || ESTADOS_TRABAJO.sin; return `<span class="en-chip en-${esc(e)}">${ic(x.ic)} ${esc(x.t)}</span>`; };

  // ---------------------------------------------------------------- calendario (#calendario)
  // Alumno: fechas de entrega y exámenes de todas sus asignaturas, con su estado. Profesor: los del curso.
  const cal = { mes: 0 };
  function eventosCal() {
    const t = Date.now(); const L = [];
    for (const it of st.items.values()) {
      if (rol === 'alumno' && it.pub && it.pub > t) continue;
      if (rol === 'profesor' && !it.publicado) continue;
      const f = it.tipo === 'examen' ? it.examen?.desde : it.fechaEntrega; if (!f) continue;
      const [k, txt] = estado(it);
      L.push({ t: f, it, k, txt, ex: it.tipo === 'examen' });
    }
    return L.sort((a, b) => a.t - b.t);
  }
  function renderCalendario(el) {
    if (!el) return; actual = { el, tipo: 'cal', id: null };
    const ev = eventosCal(); const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
    const base = new Date(hoy.getFullYear(), hoy.getMonth() + cal.mes, 1);
    const ini = new Date(base); ini.setDate(1 - ((base.getDay() + 6) % 7));
    const clave = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    const porDia = new Map(); for (const e of ev) { const d = new Date(e.t); const k = clave(d); if (!porDia.has(k)) porDia.set(k, []); porDia.get(k).push(e); }
    const evHTML = (e) => `<a class="ca-ev ${e.ex ? 'ex' : ''} e-${esc(e.k)}" href="#trabajo/${esc(e.it.id)}" title="${esc(e.it.titulo)}">${ic(e.ex ? 'clipboard-check' : e.k === 'ok' || e.k === 'nota' ? 'circle-check' : 'file-text')}<span>${esc(e.it.titulo)}</span></a>`;
    let celdas = '';
    for (let i = 0; i < 42; i++) {
      const d = new Date(ini); d.setDate(ini.getDate() + i); if (i >= 35 && d.getMonth() !== base.getMonth()) break;
      const L = porDia.get(clave(d)) || [];
      celdas += `<div class="ca-dia ${d.getMonth() !== base.getMonth() ? 'fuera' : ''} ${+d === +hoy ? 'hoy' : ''}" role="gridcell" aria-label="${esc(d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }))}${L.length ? ', ' + L.length + ' entrega' + (L.length === 1 ? '' : 's') : ''}"><span class="ca-n">${d.getDate()}</span>${L.map(evHTML).join('')}</div>`;
    }
    const prox = ev.filter((e) => e.t >= +hoy && e.t < +hoy + 15 * 864e5);
    const asig = (e) => asignatura(e.it.asig)?.corto || e.it.asig;
    const mesTxt = base.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }); const mesT = mesTxt.charAt(0).toUpperCase() + mesTxt.slice(1);
    el.innerHTML = barraSup('cal') + `<div class="au-page ca">
      <div class="au-crumbs"><a href="#inicio">Inicio</a> › <a href="#asignaturas">Asignaturas</a> › <span aria-current="page">Calendario</span></div>
      <h2>${ic('calendar-days')} Calendario</h2>
      <p class="au-small">${rol === 'profesor' ? 'Fechas de entrega y exámenes publicados del curso.' : 'Tus fechas de entrega y exámenes de todas las asignaturas.'}</p>
      <section class="ca-prox" aria-label="Próximos 15 días"><h3>Próximos 15 días</h3>${prox.length ? `<ul>${prox.map((e) => `<li><a href="#trabajo/${esc(e.it.id)}"><span class="ca-f">${esc(new Date(e.t).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' }))}</span><b>${esc(e.it.titulo)}</b><span class="au-small">${esc(asig(e))}${e.ex ? ' · examen' : ''}</span>${e.txt ? `<span class="au-est e-${esc(e.k)}">${esc(e.txt)}</span>` : ''}</a></li>`).join('')}</ul>` : '<p class="au-vacio">Nada en los próximos 15 días.</p>'}</section>
      <div class="ca-cab"><button class="btn small" data-au="calMes" data-d="-1" aria-label="Mes anterior">${ic('chevron-left')}</button><h3 aria-live="polite">${esc(mesT)}</h3><button class="btn small" data-au="calMes" data-d="1" aria-label="Mes siguiente">${ic('chevron-right')}</button>${cal.mes ? `<button class="btn small" data-au="calHoy">Hoy</button>` : ''}</div>
      <div class="ca-grid" role="grid"><div class="ca-sem" role="row">${['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((x) => `<span role="columnheader">${x}</span>`).join('')}</div><div class="ca-dias" role="row">${celdas}</div></div>
    </div>`;
  }

  // Un elemento visible (para laboratorios que se abren fuera de la página del elemento: «Encuentra la avería»).
  function elemento(id) {
    const it = st.items.get(id); if (!it) return st.listo.items ? { noExiste: true } : null;
    if (rol === 'alumno' && (!it.publicado || (it.pub && it.pub > Date.now()))) return { noExiste: true };
    return { it, rol, trabajo: st.trabajos.get(id) || null, nota: st.notas.get(id) || null };
  }
  return { renderItem, estado, examenEnCurso: () => ex.id, asignacionActividad, entregarActividad, elemento, renderCalendario, renderMisTrabajos };
}

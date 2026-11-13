// Fase 9 · entrega de un trabajo (alumno): borrador con guardado automático, entregar, anular,
// rehacer si el profesor lo devuelve, imprimir / PDF y comentarios privados con el profesor.
// El borrador se guarda en Firestore a los 3 s de dejar de escribir, cada 15 s si hay cambios y al
// salir de la página; además queda una copia en este ordenador (localStorage) por si se corta la red.
import { doc, setDoc, serverTimestamp, collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { esc } from './util.js';
import { ic } from './ico.js';
import { leeEnlaces, urlSegura, idTrabajo, fmtNota } from '../lms/modelo.js';
import { estadoTrabajo, editable, anulable, ESTADOS_TRABAJO, idVersion, horaCorta, elegirBorrador } from '../lms/entrega.js';

const fFecha = (t) => (t ? new Date(t).toLocaleString('es-ES', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '');
const idCom = () => Array.from(crypto.getRandomValues(new Uint8Array(12)), (b) => 'abcdefghijklmnopqrstuvwxyz0123456789'[b % 36]).join('');
const msOf = (x) => x?.toMillis?.() ?? (typeof x === 'number' ? x : null);

export function estadoChipHTML(estado) {
  const e = ESTADOS_TRABAJO[estado] || ESTADOS_TRABAJO.sin;
  return `<span class="en-chip en-${esc(estado)}">${ic(e.ic)} ${esc(e.t)}</span>`;
}

/**
 * ctx: { db, ses, uid(), al, nota (visible), trabajo, textoHTML, editor? }
 * editor (fase 11): { html(valor, soloLectura), leer(nodo) → {texto, doc}, enlazar(nodo, alCambiar) }.
 */
export function montarEntrega(nodo, it, ctx) {
  const { db, ses, al } = ctx;
  const tid = idTrabajo(it.id, ses.grupo, ses.numero);
  const ref = doc(db, 'trabajos', tid);
  const clave = 'borr:' + tid;
  const S = { tr: ctx.trabajo || null, nota: ctx.nota || null, sucio: false, enVuelo: false, ultimo: 0, error: '', tDeb: null, tInt: null, coms: [], unsubC: null, vivo: true };
  const leerLocal = () => { try { return JSON.parse(localStorage.getItem(clave) || 'null'); } catch (e) { return null; } };
  const guardarLocal = (v) => { try { localStorage.setItem(clave, JSON.stringify({ ...v, t: Date.now() })); } catch (e) { } };
  const borrarLocal = () => { try { localStorage.removeItem(clave); } catch (e) { } };
  const estado = () => estadoTrabajo(S.tr, S.nota);

  function valores() {
    const f = nodo.querySelector('#enForm'); if (!f) return null;
    if (ctx.editor) { const r = ctx.editor.leer(f); return { texto: String(r.texto || '').slice(0, 10000), doc: r.doc, enlaces: leeEnlaces(f.querySelector('[name=enlaces]')?.value, 10).map((e) => e.u) }; }
    return { texto: String(f.querySelector('[name=texto]')?.value || '').slice(0, 10000), enlaces: leeEnlaces(f.querySelector('[name=enlaces]')?.value, 10).map((e) => e.u) };
  }
  function base(v) {
    const d = { item: it.id, curso: it.curso, asig: it.asig, al, grupo: ses.grupo, numero: ses.numero, uid: ctx.uid(), tipo: 'tarea', texto: v.texto, enlaces: v.enlaces, fecha: serverTimestamp(), guardado: Date.now() };
    if (v.doc != null) d.doc = v.doc;
    if (ctx.registro) d.registro = ctx.registro();
    return d;
  }
  function indicador() {
    const el = nodo.querySelector('#enGuardado'); if (!el) return;
    let t = '', c = '';
    if (S.error) { t = ic('cloud-off') + ' ' + S.error; c = 'ko'; }
    else if (S.enVuelo) t = 'Guardando…';
    else if (S.sucio) t = 'Cambios sin guardar';
    else if (S.ultimo) { t = ic('check') + ' Guardado ' + horaCorta(S.ultimo); c = 'ok'; }
    el.innerHTML = t; el.className = 'en-guardado ' + c;
  }
  async function escribir(datos, { timeout = 12000 } = {}) {
    // setDoc no termina si no hay red: la escritura queda en cola en Firestore; avisamos y seguimos.
    const p = setDoc(ref, datos, { merge: true });
    let to; const t = new Promise((_, rej) => { to = setTimeout(() => rej({ code: 'sin-red' }), timeout); });
    try { await Promise.race([p, t]); } finally { clearTimeout(to); }
  }
  async function guardarBorrador(motivo) {
    if (!S.vivo || !editable(estado()) || !S.sucio || S.enVuelo) return;
    const v = valores(); if (!v) return;
    S.enVuelo = true; S.error = ''; indicador();
    try {
      await escribir({ ...base(v), estado: 'borrador' });
      S.sucio = false; S.ultimo = Date.now(); borrarLocal();
      if (S.tr) S.tr = { ...S.tr, estado: 'borrador', ...v };
    } catch (e) {
      S.error = e?.code === 'permission-denied' ? 'No se ha podido guardar: puede que ya esté calificado o que tu sesión haya caducado.' : 'Sin conexión: se guarda en este ordenador y se enviará al volver.';
    } finally { S.enVuelo = false; indicador(); }
  }
  function alCambiar() {
    S.sucio = true; S.error = ''; const v = valores(); if (v) guardarLocal(v); indicador();
    clearTimeout(S.tDeb); S.tDeb = setTimeout(() => guardarBorrador('pausa'), 3000);
  }
  async function entregar(btn) {
    const v = valores(); const msg = nodo.querySelector('#enMsg');
    if (!v.texto.trim() && !v.enlaces.length && !(v.doc && String(v.doc).replace(/<[^>]*>/g, '').trim())) { msg.textContent = 'Escribe una respuesta o añade un enlace.'; msg.className = 'au-msg ko'; return; }
    btn.disabled = true; msg.textContent = 'Entregando…'; msg.className = 'au-msg';
    const n = (S.tr?.nEntregas || 0) + 1;
    try {
      clearTimeout(S.tDeb);
      await escribir({ ...base(v), estado: 'entregado', entregadoEn: Date.now(), nEntregas: n });
      S.sucio = false; S.ultimo = Date.now(); borrarLocal();
      S.tr = { ...(S.tr || {}), ...v, estado: 'entregado', nEntregas: n, fecha: Date.now() };
      // Copia para el historial (solo la ve el profesor). Si falla, la entrega ya está hecha.
      const ver = { trabajo: tid, item: it.id, curso: it.curso, asig: it.asig, al, grupo: ses.grupo, numero: ses.numero, n, texto: v.texto, enlaces: v.enlaces, fecha: serverTimestamp() };
      if (v.doc != null) ver.doc = v.doc;
      setDoc(doc(db, 'versiones', idVersion(tid, n)), ver).catch(() => { });
      pintar(); const m = nodo.querySelector('#enMsg'); if (m) { m.innerHTML = ic('circle-check') + ' Entregado'; m.className = 'au-msg ok'; }
    } catch (e) {
      btn.disabled = false;
      msg.textContent = e?.code === 'permission-denied' ? 'No se ha aceptado: puede que ya esté calificado o que tu sesión haya caducado.' : 'Sin conexión: la entrega se enviará cuando vuelva la red. No cierres la página.'; msg.className = 'au-msg ko';
    }
  }
  async function anular(btn) {
    if (!confirm('¿Anular la entrega? Volverá a ser un borrador: podrás cambiarlo y entregarlo de nuevo.')) return;
    btn.disabled = true; const msg = nodo.querySelector('#enMsg');
    try {
      await escribir({ estado: 'borrador', fecha: serverTimestamp(), guardado: Date.now(), item: it.id, curso: it.curso, asig: it.asig, al, grupo: ses.grupo, numero: ses.numero, uid: ctx.uid(), tipo: 'tarea', texto: S.tr?.texto || '', enlaces: S.tr?.enlaces || [] });
      S.tr = { ...S.tr, estado: 'borrador' }; S.ultimo = Date.now(); pintar();
    } catch (e) {
      btn.disabled = false; msg.textContent = e?.code === 'permission-denied' ? 'Ya no se puede anular: el profesor la está corrigiendo o ya la ha calificado.' : 'Revisa la conexión y vuelve a intentarlo.'; msg.className = 'au-msg ko';
    }
  }
  function imprimir() {
    const v = editable(estado()) ? valores() : { texto: S.tr?.texto || '', enlaces: S.tr?.enlaces || [], doc: S.tr?.doc };
    let p = document.getElementById('enImprimir'); if (!p) { p = document.createElement('div'); p.id = 'enImprimir'; document.body.appendChild(p); }
    const n = S.nota;
    p.innerHTML = `<h1>${esc(it.titulo)}</h1><p class="en-pmeta">${esc(ses.grupo)} · nº ${esc(ses.numero)} · ${esc(ESTADOS_TRABAJO[estado()].t)}${S.tr?.fecha ? ' · ' + esc(fFecha(S.tr.fecha)) : ''}${n && n.nota != null ? ' · Nota: ' + esc(fmtNota(n.nota)) : ''}</p>
      ${v.doc ? `<div class="en-pdoc">${v.doc}</div>` : ''}${v.texto && !v.doc ? `<div class="en-ptexto">${ctx.textoHTML(v.texto)}</div>` : ''}
      ${(v.enlaces || []).length ? `<h2>Enlaces</h2><ul>${v.enlaces.map((u) => `<li>${esc(u)}</li>`).join('')}</ul>` : ''}`;
    document.body.classList.add('en-imprimiendo');
    const fin = () => { document.body.classList.remove('en-imprimiendo'); window.removeEventListener('afterprint', fin); };
    window.addEventListener('afterprint', fin);
    window.print(); setTimeout(fin, 1500);
  }

  // ------------------------------------------------------------ comentarios privados
  function escucharComentarios() {
    if (S.unsubC || !S.tr) return;
    S.unsubC = onSnapshot(query(collection(db, 'trabajos', tid, 'comentarios'), orderBy('fecha')), (qs) => {
      S.coms = qs.docs.map((d) => { const x = d.data({ serverTimestamps: 'estimate' }); return { id: d.id, ...x, fecha: msOf(x.fecha) }; });
      const c = nodo.querySelector('#enComs'); if (c) c.innerHTML = comsHTML();
      const w = nodo.querySelector('.en-coms-w'); if (w && S.coms.length) w.open = true;
    }, () => { S.unsubC = null; });
  }
  const comsHTML = () => (S.coms.length ? S.coms.map((c) => `<div class="en-com ${c.autor === 'profesor' ? 'prof' : 'yo'}"><b>${c.autor === 'profesor' ? 'Profesor' : 'Tú'}</b> <span class="au-small">${esc(fFecha(c.fecha))}</span><div>${esc(c.texto)}</div></div>`).join('') : '<p class="au-small">Sin comentarios.</p>');
  async function comentar(f) {
    const t = f.querySelector('textarea'); const txt = t.value.trim().slice(0, 2000); if (!txt) return;
    const b = f.querySelector('button'); b.disabled = true;
    try { await setDoc(doc(db, 'trabajos', tid, 'comentarios', idCom()), { autor: 'alumno', numero: ses.numero, texto: txt, fecha: serverTimestamp() }); t.value = ''; }
    catch (e) { alert('No se ha podido enviar el comentario.'); } finally { b.disabled = false; }
  }

  // ------------------------------------------------------------ pintar
  function pintar() {
    const e = estado(); const ed = editable(e); const tr = S.tr; const n = S.nota;
    let v;
    if (ed) { const loc = leerLocal(); v = elegirBorrador(tr, loc) || { texto: '', enlaces: [] }; if (v.origen === 'local' && (!tr || v.t > (tr.guardado || 0))) S.sucio = true; if (tr?.doc && v.origen === 'nube') v.doc = tr.doc; else if (loc?.doc && v.origen === 'local') v.doc = loc.doc; }
    else v = { texto: tr?.texto || '', enlaces: tr?.enlaces || [], doc: tr?.doc };
    const tarde = it.fechaEntrega && tr?.fecha && tr.estado === 'entregado' && tr.fecha > it.fechaEntrega;
    let h = `<div class="en-cab"><h4>Tu trabajo</h4>${estadoChipHTML(e)}${tr?.estado === 'entregado' || e === 'calificado' ? `<span class="au-small">${esc(fFecha(tr.fecha))}${tarde ? ' · <b>con retraso</b>' : ''}</span>` : ''}<span class="en-guardado" id="enGuardado" role="status" aria-live="polite"></span></div>`;
    if (e === 'devuelto') h += `<div class="au-aviso">${ic('undo-2')} El profesor te lo ha devuelto para que lo corrijas${tr.devFecha ? ' (' + esc(fFecha(tr.devFecha)) + ')' : ''}. Mira sus comentarios, cámbialo y vuelve a entregarlo.</div>`;
    if (e === 'calificado' && n) h += `<div class="au-nota"><div class="au-nota-n">Nota: <b>${esc(fmtNota(n.nota))}</b>${n.max && n.puntos != null ? ` <span class="au-small">(${esc(fmtNota(n.puntos))} / ${esc(fmtNota(n.max))} puntos)</span>` : ''}</div>${n.comentario ? `<div class="au-nota-c">${ic('message-square')} ${esc(n.comentario)}</div>` : ''}</div>`;
    h += `<form id="enForm" class="au-form" autocomplete="off" onsubmit="return false">`;
    if (ctx.editor) h += ctx.editor.html(v, !ed);
    else h += `<label>Respuesta<textarea name="texto" maxlength="10000" rows="8" ${ed ? '' : 'readonly'} placeholder="Escribe aquí tu respuesta. No pongas tu nombre.">${esc(v.texto || '')}</textarea></label>`;
    h += ed ? `<label>Enlaces (uno por línea: presentación, vídeo, archivo grande…)<textarea name="enlaces" rows="2" maxlength="5000" placeholder="https://…">${esc((v.enlaces || []).join('\n'))}</textarea></label>`
      : (v.enlaces || []).map((u) => `<div>${ic('link')} <a href="${esc(urlSegura(u))}" target="_blank" rel="noopener noreferrer">${esc(u)}</a></div>`).join('');
    h += `<div class="au-acts">`;
    if (ed) h += `<button type="button" class="btn" data-en="guardar">${ic('save')} Guardar</button><button type="button" class="btn primary" data-en="entregar">${ic('send')} ${tr?.nEntregas || e === 'devuelto' ? 'Volver a entregar' : 'Entregar'}</button>`;
    if (anulable(e)) h += `<button type="button" class="btn" data-en="anular">${ic('ban')} Anular la entrega</button>`;
    h += `<button type="button" class="btn" data-en="imprimir" title="Imprimir o guardar como PDF">${ic('printer')} Imprimir / PDF</button><span class="au-msg" id="enMsg"></span></div>`;
    h += `<p class="au-small">${ed ? 'Se guarda solo mientras escribes. Puedes guardar sin entregar y seguir otro día desde cualquier ordenador con tu nº y tu PIN.' : e === 'entregado' ? 'Puedes anular la entrega para cambiarla mientras el profesor no la califique.' : ''}</p></form>`;
    h += `<details class="en-coms-w" ${S.coms.length ? 'open' : ''}><summary>${ic('message-square')} Comentarios privados con el profesor</summary><div id="enComs" class="en-coms">${tr ? comsHTML() : '<p class="au-small">Podrás escribir al profesor cuando guardes o entregues el trabajo.</p>'}</div>
      ${tr ? `<form id="enComF" class="en-comf" onsubmit="return false"><textarea maxlength="2000" rows="2" placeholder="Escribe una duda o un comentario (solo lo ve tu profesor)"></textarea><button type="button" class="btn small" data-en="comentar">${ic('send')} Enviar</button></form>` : ''}</details>`;
    nodo.innerHTML = h;
    if (ctx.editor && ed) ctx.editor.enlazar(nodo.querySelector('#enForm'), alCambiar);
    indicador(); escucharComentarios();
    if (S.sucio && ed) { clearTimeout(S.tDeb); S.tDeb = setTimeout(() => guardarBorrador('local'), 1500); }
  }
  const onInput = (ev) => { if (ev.target.closest('#enForm') && !ctx.editor) alCambiar(); else if (ev.target.closest('#enForm') && ev.target.name === 'enlaces') alCambiar(); };
  const onClick = (ev) => {
    const b = ev.target.closest('[data-en]'); if (!b || !nodo.contains(b)) return;
    const a = b.dataset.en;
    if (a === 'guardar') { S.sucio = true; guardarBorrador('boton'); }
    if (a === 'entregar') entregar(b);
    if (a === 'anular') anular(b);
    if (a === 'imprimir') imprimir();
    if (a === 'comentar') comentar(b.closest('form'));
  };
  const alSalir = () => { if (S.sucio) guardarBorrador('salir'); };
  const onVis = () => { if (document.visibilityState === 'hidden') alSalir(); };
  const onOnline = () => { if (S.sucio) guardarBorrador('red'); };
  nodo.addEventListener('input', onInput); nodo.addEventListener('click', onClick);
  window.addEventListener('pagehide', alSalir); window.addEventListener('hashchange', alSalir); document.addEventListener('visibilitychange', onVis); window.addEventListener('online', onOnline);
  S.tInt = setInterval(() => { if (S.sucio) guardarBorrador('intervalo'); }, 15000);
  pintar();
  return {
    actualizar({ trabajo, nota }) {
      const antes = estado(); const tenia = !!S.tr;
      S.tr = trabajo || null; S.nota = nota || null;
      if (S.tr?.guardado && S.tr.guardado > S.ultimo) S.ultimo = S.tr.guardado;
      // Mientras escribe no se repinta (no perder el cursor); sí si cambia el estado (devuelto, nota…).
      if (antes !== estado() || (!tenia && S.tr)) { if (!(editable(antes) && editable(estado()) && S.sucio)) pintar(); else escucharComentarios(); }
      else indicador();
    },
    guardarYa: () => guardarBorrador('externo'),
    destruir() {
      alSalir(); S.vivo = false; clearInterval(S.tInt); clearTimeout(S.tDeb); S.unsubC?.();
      nodo.removeEventListener('input', onInput); nodo.removeEventListener('click', onClick);
      window.removeEventListener('pagehide', alSalir); window.removeEventListener('hashchange', alSalir); document.removeEventListener('visibilitychange', onVis); window.removeEventListener('online', onOnline);
    },
  };
}

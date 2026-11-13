// Proyecto en equipo (PIAC) en la página del elemento: tablero, diario y auto/coevaluación (alumno);
// configuración de equipos y resumen de todos los equipos (profesor). Iconos Lucide, sin emoji.
import { collection, doc, onSnapshot, query, where, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { esc } from './util.js';
import { ic } from './ico.js';
import { idItem, fmtNota } from '../lms/modelo.js';
import { ESTADOS_PIAC, leerEquiposTexto, equiposTexto, derivar } from '../lms/motores/piac.js';
import { NIVELES_RUBRICA, notaPonderada } from '../lms/rubrica.js';

const fDia = (t) => (t ? new Date(t).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : '');
const aDia = (t) => { if (!t) return ''; const d = new Date(t); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10); };
const deDia = (v) => (v ? new Date(v + 'T12:00').getTime() : null);
const media = (L) => (L.length ? Math.round((L.reduce((a, b) => a + b, 0) / L.length) * 10) / 10 : null);

export function montarPiac(nodo, it, op) {
  const { db, ses, rol, aula } = op; const prof = rol !== 'alumno';
  const c = it.contenido || {}; const crit = c.criterios || [];
  const S = { tareas: [], diario: [], evals: new Map(), unsubs: [], msg: '', vista: 'tablero', abiertos: {} };
  const miEquipo = !prof ? (c.equipos || []).find((e) => e.grupo === ses?.grupo && e.miembros.includes(ses?.numero)) : null;
  const leer = (qs) => { const L = []; qs.forEach((d) => L.push({ id: d.id, ...d.data() })); return L; };
  const err = () => { S.msg = 'No se han podido cargar los datos del equipo.'; pintar(); };
  if (!prof && miEquipo) {
    S.unsubs.push(onSnapshot(query(collection(db, 'piac'), where('item', '==', it.id), where('grupo', '==', ses.grupo), where('equipo', '==', miEquipo.id)), (qs) => { const L = leer(qs); S.tareas = L.filter((x) => x.clase === 'tarea'); S.diario = L.filter((x) => x.clase === 'diario'); pintar(); }, err));
    S.unsubs.push(onSnapshot(query(collection(db, 'piacEval'), where('item', '==', it.id), where('grupo', '==', ses.grupo), where('de', '==', ses.numero)), (qs) => { S.evals = new Map(leer(qs).map((x) => [x.a, x])); pintar(); }, err));
  }
  if (prof) {
    S.unsubs.push(onSnapshot(query(collection(db, 'piac'), where('item', '==', it.id)), (qs) => { const L = leer(qs); S.tareas = L.filter((x) => x.clase === 'tarea'); S.diario = L.filter((x) => x.clase === 'diario'); pintar(); }, err));
    S.unsubs.push(onSnapshot(query(collection(db, 'piacEval'), where('item', '==', it.id)), (qs) => { S.evalsTodas = leer(qs); pintar(); }, err));
  }
  const nombreGrupo = (g) => aula?.grupos?.get(g)?.nombre || g;
  const quien = (n) => (n === ses?.numero ? `Tú (nº ${n})` : `Nº ${n}`);

  // ------------------------------------------------------------------ alumno
  function tableroHTML(eq, tareas, editable) {
    return `<div class="pi-tablero">${ESTADOS_PIAC.map(([k, t], i) => {
      const L = tareas.filter((x) => x.estado === k).sort((a, b) => (a.fecha || 9e15) - (b.fecha || 9e15) || a.creado - b.creado);
      return `<section class="pi-col pi-${k}" aria-label="${t}"><h5>${ic(k === 'hecho' ? 'circle-check' : k === 'encurso' ? 'circle-play' : 'list-todo')} ${t} <span class="pi-n">${L.length}</span></h5>
        ${L.map((x) => `<article class="pi-tarea" data-pt="${esc(x.id)}"><p>${esc(x.texto)}</p>
          <div class="pi-meta">${x.resp ? `<span>${ic('user')} ${esc(quien(x.resp))}</span>` : '<span class="pi-sin">Sin responsable</span>'}${x.fecha ? `<span class="${x.estado !== 'hecho' && x.fecha < Date.now() - 864e5 ? 'pi-tarde' : ''}">${ic('calendar-days')} ${esc(fDia(x.fecha))}</span>` : ''}</div>
          ${editable ? `<div class="pi-acc">${i > 0 ? `<button class="btn tiny" data-pa="mover" data-e="${ESTADOS_PIAC[i - 1][0]}" aria-label="Pasar a ${ESTADOS_PIAC[i - 1][1]}">${ic('chevron-left')}</button>` : ''}${i < 2 ? `<button class="btn tiny" data-pa="mover" data-e="${ESTADOS_PIAC[i + 1][0]}" aria-label="Pasar a ${ESTADOS_PIAC[i + 1][1]}">${ic('chevron-right')}</button>` : ''}<button class="btn tiny" data-pa="borrar" aria-label="Borrar la tarea">${ic('trash')}</button></div>` : ''}</article>`).join('') || '<p class="pi-vacio">Nada aquí.</p>'}</section>`;
    }).join('')}</div>`;
  }
  function diarioHTML(L) {
    return L.sort((a, b) => b.creado - a.creado).map((x) => `<article class="pi-entrada"><div class="pi-meta"><span>${ic('calendar-days')} ${esc(new Date(x.creado).toLocaleString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }))}</span><span>${ic('user')} ${esc(quien(x.autor))}</span></div><p>${esc(x.texto)}</p></article>`).join('') || '<p class="pi-vacio">Todavía no hay entradas.</p>';
  }
  function evalHTML(eq) {
    const orden = [ses.numero, ...eq.miembros.filter((n) => n !== ses.numero)];
    return `<p class="au-small">Puntúa de 1 (insuficiente) a 4 (excelente) cada criterio. Tus compañeros no ven lo que les pones; tu profesor, sí.</p>
      ${orden.map((n) => { const ev = S.evals.get(n); const nota = ev ? notaPonderada(crit, ev.puntos) : null;
        return `<form class="pi-eval" data-pe="${n}"><h5>${ic(n === ses.numero ? 'user-check' : 'users')} ${n === ses.numero ? 'Autoevaluación' : 'Coevaluación · nº ' + n}${ev ? ` <span class="pi-ok">${ic('check')} Guardada${nota != null ? ' · ' + esc(fmtNota(nota)) : ''}</span>` : ''}</h5>
        ${crit.map((k) => `<fieldset class="pi-crit"><legend>${esc(k.c)} <span class="au-small">(${esc(k.peso)} %)</span>${k.autoria ? ` <span class="pi-aut">${ic('shield-check')} Autoría</span>` : ''}</legend>
          <div class="pi-niv">${NIVELES_RUBRICA.map(([v, t]) => `<label><input type="radio" name="${esc(k.id)}" value="${v}" ${ev?.puntos?.[k.id] === v ? 'checked' : ''} required> <span>${v} · ${t}</span></label>`).join('')}</div></fieldset>`).join('')}
        <label class="pn-f">Comentario (opcional)<textarea name="comentario" rows="2" maxlength="1000">${esc(ev?.comentario || '')}</textarea></label>
        <div class="au-acts"><button class="btn primary" type="submit">${ic('save')} Guardar</button></div></form>`; }).join('')}`;
  }
  function alumnoHTML() {
    if (!miEquipo) return '<p class="au-vacio">Todavía no estás en ningún equipo de este proyecto. Pregunta a tu profesor.</p>';
    const tabs = [['tablero', 'kanban', 'Tablero'], ['diario', 'notebook-text', 'Diario'], ['evaluacion', 'list-checks', 'Evaluación']];
    return `<div class="pi-eq"><b>${ic('users')} ${esc(miEquipo.nombre)}</b> <span class="au-small">· ${miEquipo.miembros.map((n) => esc(quien(n))).join(', ')}</span></div>
      <div class="pi-tabs" role="tablist">${tabs.map(([k, i, t]) => `<button role="tab" aria-selected="${S.vista === k}" class="${S.vista === k ? 'on' : ''}" data-pa="vista" data-v="${k}">${ic(i)} ${t}</button>`).join('')}</div>
      ${S.vista === 'tablero' ? `${tableroHTML(miEquipo, S.tareas, true)}
        <form class="pi-nueva" data-pf="tarea"><label class="pn-f">Nueva tarea<input name="texto" maxlength="300" required placeholder="¿Qué hay que hacer?"></label>
          <label class="pn-f">Responsable<select name="resp"><option value="">Sin responsable</option>${miEquipo.miembros.map((n) => `<option value="${n}">${esc(quien(n))}</option>`).join('')}</select></label>
          <label class="pn-f">Fecha<input type="date" name="fecha"></label><button class="btn primary" type="submit">${ic('plus')} Añadir</button></form>` : ''}
      ${S.vista === 'diario' ? `<form class="pi-nueva pi-nd" data-pf="diario"><label class="pn-f">¿Qué habéis hecho hoy? ¿Qué problemas habéis tenido?<textarea name="texto" rows="3" maxlength="2000" required></textarea></label><button class="btn primary" type="submit">${ic('notebook-pen')} Escribir en el diario</button></form><div class="pi-diario">${diarioHTML(S.diario)}</div>` : ''}
      ${S.vista === 'evaluacion' ? evalHTML(miEquipo) : ''}`;
  }

  // ------------------------------------------------------------------ profesor
  function profHTML() {
    const grupos = it.grupos || [];
    const equipos = c.equipos || [];
    const ev = S.evalsTodas || [];
    const fila = (e, n) => { const auto = ev.find((x) => x.equipo === e.id && x.de === n && x.a === n); const co = ev.filter((x) => x.equipo === e.id && x.a === n && x.de !== n).map((x) => notaPonderada(crit, x.puntos)).filter((x) => x != null);
      const aut = crit.find((k) => k.autoria); const coAut = ev.filter((x) => x.equipo === e.id && x.a === n && x.de !== n && x.puntos?.[aut?.id]).map((x) => x.puntos[aut.id]);
      return `<tr><th>Nº ${n}</th><td>${auto ? esc(fmtNota(notaPonderada(crit, auto.puntos))) : '—'}</td><td>${co.length ? esc(fmtNota(media(co))) + ` <span class="au-small">(${co.length})</span>` : '—'}</td><td>${coAut.length ? esc(fmtNota(media(coAut))) + ' / 4' : '—'}</td></tr>`; };
    return `<details class="pi-conf" ${equipos.length ? '' : 'open'}><summary>${ic('users')} Equipos (${equipos.length})</summary>
      <p class="au-small">Una línea por equipo: «Nombre: nº, nº, nº». Solo con nº de lista (sin nombres).</p>
      ${grupos.map((g) => `<label class="pn-f">${esc(nombreGrupo(g))}<textarea data-pg="${esc(g)}" rows="4" maxlength="2000" placeholder="Equipo 1: 1, 4, 7&#10;Equipo 2: 2, 5, 8">${esc(equiposTexto(equipos, g))}</textarea></label>`).join('') || '<p class="au-small">Marca primero los grupos en «Editar».</p>'}
      <div class="au-acts"><button class="btn primary" data-pa="guardarEquipos">${ic('save')} Guardar equipos</button><span class="au-msg" data-pmsg>${esc(S.msg)}</span></div></details>
      <div class="pi-rub"><h5>${ic('list-checks')} Rúbrica de la evaluación</h5><ul>${crit.map((k) => `<li>${esc(k.c)} · <b>${esc(k.peso)} %</b>${k.autoria ? ` <span class="pi-aut">${ic('shield-check')} Autoría</span>` : ''}</li>`).join('')}</ul></div>
      ${equipos.map((e) => { const T = S.tareas.filter((x) => x.equipo === e.id); const D = S.diario.filter((x) => x.equipo === e.id); const ab = S.abiertos[e.id];
        return `<section class="pi-resumen"><h5>${ic('users')} ${esc(e.nombre)} <span class="au-small">· ${esc(nombreGrupo(e.grupo))} · nº ${e.miembros.join(', ')}</span></h5>
          <div class="pi-cont">${ESTADOS_PIAC.map(([k, t]) => `<span class="pi-chip pi-${k}">${t}: <b>${T.filter((x) => x.estado === k).length}</b></span>`).join('')}<span class="pi-chip">Diario: <b>${D.length}</b></span>
          <button class="btn tiny" data-pa="abrir" data-eq="${esc(e.id)}" aria-expanded="${!!ab}">${ic(ab ? 'chevron-up' : 'chevron-down')} ${ab ? 'Ocultar' : 'Ver tablero y diario'}</button></div>
          ${ab ? `${tableroHTML(e, T, false)}<h6>Diario</h6><div class="pi-diario">${diarioHTML(D)}</div>` : ''}
          <table class="pi-tab"><thead><tr><th>Alumno</th><th>Autoevaluación</th><th>Coevaluación (media)</th><th>Autoría según el equipo</th></tr></thead><tbody>${e.miembros.map((n) => fila(e, n)).join('')}</tbody></table></section>`; }).join('')}`;
  }

  function pintar() {
    const foco = nodo.contains(document.activeElement) && ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName);
    if (foco) { S.pend = true; return; } // no se pisa lo que se está escribiendo: se repinta al salir del campo
    S.pend = false;
    nodo.innerHTML = `<div class="pi">${c.instrucciones ? `<p class="pi-ins">${esc(c.instrucciones)}</p>` : ''}${prof ? profHTML() : alumnoHTML()}${S.msg && !prof ? `<p class="au-msg" role="status">${esc(S.msg)}</p>` : ''}</div>`;
  }
  const base = () => ({ item: it.id, equipo: miEquipo.id, grupo: ses.grupo });
  async function accion(b) {
    const a = b.dataset.pa; S.msg = '';
    try {
      if (a === 'vista') { S.vista = b.dataset.v; return pintar(); }
      if (a === 'abrir') { S.abiertos[b.dataset.eq] = !S.abiertos[b.dataset.eq]; return pintar(); }
      if (a === 'mover') { const id = b.closest('[data-pt]').dataset.pt; return await updateDoc(doc(db, 'piac', id), { estado: b.dataset.e, actualizado: Date.now() }); }
      if (a === 'borrar') { const id = b.closest('[data-pt]').dataset.pt; if (confirm('¿Borrar esta tarea del tablero?')) await deleteDoc(doc(db, 'piac', id)); return; }
      if (a === 'guardarEquipos') {
        const errs = []; let equipos = [];
        for (const ta of nodo.querySelectorAll('[data-pg]')) equipos.push(...leerEquiposTexto(ta.value, ta.dataset.pg, (t) => errs.push(`${nombreGrupo(ta.dataset.pg)}: ${t}`)));
        const vistos = new Set(); for (const e of equipos) for (const n of e.miembros) { const k = e.grupo + '|' + n; if (vistos.has(k)) errs.push(`El nº ${n} de ${nombreGrupo(e.grupo)} está en dos equipos.`); vistos.add(k); }
        if (errs.length) { S.msg = errs[0]; document.activeElement?.blur(); return pintar(); }
        equipos = equipos.map((e, i) => ({ id: 'e' + (i + 1), ...e }));
        const nuevo = derivar({ ...c, equipos }); Object.assign(c, nuevo);
        await updateDoc(doc(db, 'items', it.id), { contenido: nuevo, actualizado: Date.now() });
        S.msg = 'Equipos guardados.'; return pintar();
      }
    } catch (e) { S.msg = 'No se ha podido guardar (' + (e?.code || 'error') + ').'; pintar(); }
  }
  async function enviar(f) {
    const fd = new FormData(f); S.msg = '';
    try {
      if (f.dataset.pf) f.reset();
      if (f.dataset.pf === 'tarea') {
        const r = Number(fd.get('resp')) || null;
        await setDoc(doc(db, 'piac', idItem()), { ...base(), clase: 'tarea', texto: String(fd.get('texto')).trim().slice(0, 300), estado: 'pendiente', resp: r, fecha: deDia(fd.get('fecha')), autor: ses.numero, creado: Date.now(), actualizado: Date.now() });
      }
      if (f.dataset.pf === 'diario') await setDoc(doc(db, 'piac', idItem()), { ...base(), clase: 'diario', texto: String(fd.get('texto')).trim().slice(0, 2000), autor: ses.numero, creado: Date.now() });
      if (f.dataset.pe) {
        const a = Number(f.dataset.pe); const puntos = Object.fromEntries(crit.map((k) => [k.id, Number(fd.get(k.id))]).filter(([, v]) => v >= 1 && v <= 4));
        await setDoc(doc(db, 'piacEval', `${it.id}_${ses.grupo}_${ses.numero}_${a}`), { ...base(), de: ses.numero, a, puntos, comentario: String(fd.get('comentario') || '').slice(0, 1000), fecha: Date.now() });
      }
      if (f.dataset.pe) { S.evals.set(Number(f.dataset.pe), { ...(S.evals.get(Number(f.dataset.pe)) || {}), puntos: Object.fromEntries(crit.map((k) => [k.id, Number(fd.get(k.id))])) }); if (!nodo.contains(document.activeElement) || document.activeElement.tagName === 'BUTTON') pintar(); }
    } catch (e) { S.msg = 'No se ha podido guardar (' + (e?.code || 'error') + ').'; document.activeElement?.blur(); pintar(); }
  }
  const onClick = (e) => { const b = e.target.closest('[data-pa]'); if (b && nodo.contains(b)) accion(b); };
  const onSubmit = (e) => { const f = e.target.closest('[data-pf],[data-pe]'); if (f && nodo.contains(f)) { e.preventDefault(); enviar(f); } };
  const onFocusOut = () => setTimeout(() => { if (S.pend) pintar(); }, 0);
  nodo.addEventListener('click', onClick); nodo.addEventListener('submit', onSubmit); nodo.addEventListener('focusout', onFocusOut);
  pintar();
  return { actualizar() { pintar(); }, destruir() { S.unsubs.forEach((f) => f()); nodo.removeEventListener('click', onClick); nodo.removeEventListener('submit', onSubmit); nodo.removeEventListener('focusout', onFocusOut); } };
}

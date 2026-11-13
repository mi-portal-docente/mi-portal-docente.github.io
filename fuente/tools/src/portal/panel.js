// Panel del profesor, en tres bloques: Clases (cursos escolares, grupos y códigos), Seguimiento (cuaderno de
// calificaciones, entregas del laboratorio, conectados ahora) y Ajustes (cuenta, PIN y limpieza de datos).
// El contenido de cada asignatura NO está aquí: se gestiona en la propia asignatura (Organización / Trabajo de clase).
import { collection, doc, onSnapshot, writeBatch, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { esc, offsetLocal, hhmm, DIAS } from './util.js';
import { nuevoCodigo } from './codigos.js';
import { crearAulaPanel } from './aula-panel.js';
import { BIBLIOTECA, asignatura } from '../lms/biblioteca.js';

const VIVO_MS = 150e3, RECIENTE_MS = 15 * 60e3, ANTIGUA_MS = 2 * 3600e3;
const pad = (n) => String(n).padStart(2, '0');
const ms = (t) => (t && t.toMillis ? t.toMillis() : typeof t === 'number' ? t : 0);
const fFecha = (t) => t ? new Date(t).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }) : '—';
const fHora = (t) => t ? new Date(t).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '—';
function hace(t) {
  if (!t) return '—'; const s = Math.max(0, Math.round((Date.now() - t) / 1000));
  if (s < 60) return `hace ${s} s`; const m = Math.round(s / 60); if (m < 60) return `hace ${m} min`;
  const h = Math.floor(m / 60); return `hace ${h} h ${m % 60} min`;
}
const nuevoId = () => 'g' + Math.random().toString(36).slice(2, 10);

export function crearPanel({ db, PORTAL, email, aula }) {
  const st = { grupos: new Map(), sesiones: [], entregas: [], listo: { g: false, s: false, e: false }, sub: 'grupos', el: null, unsubs: [], tick: null, editando: null, abierta: null, verTodos: false, dstHecho: false, f: { grupo: '', practica: '', estado: '' } };
  const cat = () => window.PORTAL_CATALOGO || { practicas: [], proyectos: [], subjects: [], apartados: {} };
  const nombreGrupo = (id) => st.grupos.get(id)?.nombre || '(grupo borrado)';
  const tituloPractica = (id, fallback) => { if (id === 'v1') return 'Vivienda · Tablero eléctrico de la SA1'; if (id === 'v2') return 'Vivienda · Modo libre'; const c = cat(); const p = c.practicas.find(x => x.id === id); if (p) return `Circuitos ${p.n} · ${p.titulo}`; const q = c.proyectos.find(x => x.id === id); if (q) return `ESP32 ${q.n} · ${q.titulo}`; return fallback || id; };
  const $ = (s) => st.el && st.el.querySelector(s);
  const ap = crearAulaPanel({ db, aula, ps: st, nombreGrupo, tituloPractica });
  const TABS = ['cursos', 'grupos', 'notas', 'entregas', 'conectados', 'ajustes'];
  const ALIAS = { limpieza: 'ajustes', cuaderno: 'notas', calificaciones: 'notas' };
  const AULA = ['cursos', 'notas'];
  const DESC = {
    cursos: 'Cada curso escolar eliges qué asignaturas impartes. El curso activo es el que ves en «Mis asignaturas».',
    grupos: 'Cada grupo tiene un código de clase que los alumnos usan para entrar (con su nº de lista y un PIN). Sin nombres.',
    notas: 'Cuaderno por grupo y asignatura: tareas, cuestionarios, actividades y prácticas del laboratorio. Nota de cada actividad (la nota por criterios se calcula en SuperProfe y QE).',
    entregas: 'Prácticas entregadas desde los laboratorios 3D (ESP32, Circuitos y Vivienda): revisa el montaje y pon nota.',
    conectados: 'Quién está dentro ahora mismo y en qué página (solo grupo y nº).',
    ajustes: 'Tu cuenta, el PIN de los alumnos y la limpieza de datos al cerrar el curso.',
  };

  // ------------------------------------------------------------ datos en tiempo real
  function iniciar() {
    let raf = 0; const pintarLuego = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(pintarDatos); };
    st.unsubs.push(onSnapshot(collection(db, 'grupos'), (qs) => {
      st.grupos = new Map(); qs.forEach(d => st.grupos.set(d.id, { id: d.id, ...d.data() })); st.listo.g = true; corregirHorarios(); pintarLuego();
    }, (e) => errorDatos(e)));
    st.unsubs.push(onSnapshot(collection(db, 'sesiones'), (qs) => {
      st.sesiones = []; qs.forEach(d => { const x = d.data({ serverTimestamps: 'estimate' }); st.sesiones.push({ uid: d.id, ...x, latido: ms(x.latido), desde: ms(x.desde) }); }); st.listo.s = true; pintarLuego();
    }, (e) => errorDatos(e)));
    st.unsubs.push(onSnapshot(collection(db, 'entregas'), (qs) => {
      st.entregas = []; qs.forEach(d => { const x = d.data({ serverTimestamps: 'estimate' }); st.entregas.push({ id: d.id, ...x, fecha: ms(x.fecha) }); });
      st.entregas.sort((a, b) => b.fecha - a.fecha); st.listo.e = true; pintarLuego();
    }, (e) => errorDatos(e)));
    st.tick = setInterval(() => { if (st.sub === 'conectados') pintarDatos(); else pintarContadores(); }, 15000);
  }
  function parar() { st.unsubs.forEach(f => { try { f(); } catch (e) { } }); st.unsubs = []; clearInterval(st.tick); st.tick = null; ap.parar(); }
  function errorDatos(e) { const b = $('#pnAviso'); if (b) { b.textContent = 'No se pueden leer los datos del portal (' + (e?.code || 'error') + '). Comprueba la conexión.'; b.hidden = false; } }
  // Horario de verano/invierno: el desfase con UTC se guarda en cada grupo; se actualiza solo al abrir el panel.
  function corregirHorarios() {
    if (st.dstHecho) return; st.dstHecho = true;
    const off = offsetLocal(); const b = writeBatch(db); let n = 0;
    for (const g of st.grupos.values()) if (g.horario && g.horario.offset !== off) {
      const h = { ...g.horario, offset: off }; b.update(doc(db, 'grupos', g.id), { horario: h }); b.update(doc(db, 'codigos', g.codigo), { horario: h }); n++;
    }
    if (n) b.commit().catch(() => { });
  }

  // ------------------------------------------------------------ estructura
  function render(el, sub) {
    const nuevo = st.el !== el || !el.querySelector('.pn');
    const extra = String(sub || '').split('/')[1] || ''; sub = String(sub || '').split('/')[0];
    // el antiguo «Contenido» ahora vive en cada asignatura
    if (sub === 'contenido') { const it = extra && aula.st.items.get(extra); const a = it?.asig || aula.cursoActivo()?.asignaturas?.[0]; location.replace(a ? `#asig/${a}/${it ? 'trabajo' : 'organizacion'}` : '#asignaturas'); if (it) setTimeout(() => PORTAL.aula?.editar?.(it.id), 50); return; }
    sub = ALIAS[sub] || sub;
    st.el = el; st.sub = TABS.includes(sub) ? sub : 'grupos'; st.extra = extra;
    if (!st.unsubs.length) iniciar();
    if (nuevo) {
      el.innerHTML = `<div class="pn">
        <header class="scr-top"><a href="#inicio" class="brand" title="Inicio">SuperProfe · Alumnos</a><div class="scr-ttl">Panel del profesor</div>${PORTAL.navHTML('panel')}<div class="pn-who">${esc(email || '')}</div></header>
        <nav class="crumbs static" aria-label="Estás en"><div><a href="#inicio">Inicio</a> › <a href="#panel">Panel del profesor</a> › <span id="pnCrumb" aria-current="page"></span></div><div class="prof">${PORTAL.chipHTML()}</div></nav>
        <div class="pn-wrap pn-layout">
          <nav class="pn-nav" id="pnTabs" aria-label="Secciones del panel"></nav>
          <main class="pn-main"><h1 class="pn-h1" id="pnH1"></h1><p class="pn-desc" id="pnDesc"></p>
          <p class="pn-aviso" id="pnAviso" hidden></p>
          <div id="pnBody"></div></main>
        </div></div>`;
      el.addEventListener('click', onClick); el.addEventListener('change', onChange);
      el.addEventListener('click', (e) => ap.onClick(e)); el.addEventListener('change', (e) => ap.onChange(e)); el.addEventListener('input', (e) => ap.onInput(e));
    }
    pintarTabs(); pintarTab();
  }
  function pintarTabs() {
    const vivos = st.sesiones.filter(s => !s.revocada && Date.now() - s.latido < VIVO_MS).length;
    const sinNota = st.entregas.filter(e => e.nota == null).length;
    const cAct = aula.cursoActivo();
    const G = [['Clases', [['cursos', '📅', 'Cursos escolares', cAct ? cAct.nombre : ''], ['grupos', '👥', 'Grupos y códigos', st.grupos.size]]],
      ['Seguimiento', [['notas', '📊', 'Cuaderno de calificaciones', ''], ['entregas', '🔬', 'Entregas del laboratorio', sinNota ? `${sinNota} sin nota` : st.entregas.length], ['conectados', '🟢', 'Conectados ahora', vivos]]],
      ['Ajustes', [['ajustes', '⚙️', 'Ajustes y limpieza', '']]]];
    $('#pnTabs').innerHTML = G.map(([g, L]) => `<div class="pn-g"><div class="pn-gt">${g}</div>${L.map(([k, ic, t, n]) => `<a href="#panel/${k}" class="${k === st.sub ? 'on' : ''}" data-pn-tab="${k}" ${k === st.sub ? 'aria-current="page"' : ''}><span aria-hidden="true">${ic}</span> ${t}${n !== '' ? ` <span class="pn-n">${esc(n)}</span>` : ''}</a>`).join('')}</div>`).join('');
    const act = G.flatMap((x) => x[1]).find((x) => x[0] === st.sub);
    if (act && $('#pnH1')) { $('#pnH1').textContent = `${act[1]} ${act[2]}`; $('#pnDesc').textContent = DESC[st.sub] || ''; $('#pnCrumb').textContent = act[2]; }
  }
  const pintarContadores = () => { if ($('#pnTabs')) pintarTabs(); };
  function pintarTab() {
    const B = $('#pnBody'); if (!B) return;
    if (st.sub === 'grupos') B.innerHTML = `<section class="pn-card"><h3 id="pnFormT">${st.editando ? 'Editar grupo' : 'Nuevo grupo'}</h3><div id="pnForm">${formHTML(st.editando ? st.grupos.get(st.editando) : null)}</div></section><div id="pnLista" class="pn-grupos"></div>`;
    if (st.sub === 'conectados') B.innerHTML = `<div class="pn-bar"><label><input type="checkbox" id="pnVerTodos" ${st.verTodos ? 'checked' : ''}> Mostrar también desconectados</label><span class="pn-small">Se actualiza solo · latido cada 60 s</span></div><div id="pnCon"></div>`;
    if (st.sub === 'entregas') B.innerHTML = `<div class="pn-bar" id="pnFiltros"></div><div class="pn-ent"><div id="pnTabla" class="pn-tabla"></div><aside id="pnDetalle" class="pn-det"></aside></div>`;
    if (st.sub === 'ajustes') B.innerHTML = `<section class="pn-card"><h3>Tu cuenta</h3><p>Has entrado como profesor con Google: <b>${esc(email || '')}</b>. Solo esta cuenta puede gestionar el portal.</p>
      <div class="pn-acts"><a class="btn" href="#biblioteca">🗂 Biblioteca de asignaturas</a><a class="btn" href="#panel/cursos">📅 Cursos escolares</a><button class="btn" data-portal="salir">Cerrar sesión</button></div></section><div id="pnLimp"></div><div id="apLimp"></div>`;
    if (AULA.includes(st.sub)) { ap.render(B, st.sub, st.extra); pintarTabs(); return; }
    ap.fuera();
    pintarDatos(); if (st.sub === 'entregas') pintarDetalle();
  }
  function pintarDatos() {
    if (!st.el || !$('#pnBody')) return;
    pintarTabs();
    if (st.sub === 'grupos' && $('#pnLista')) $('#pnLista').innerHTML = listaGruposHTML();
    if (st.sub === 'conectados' && $('#pnCon')) $('#pnCon').innerHTML = conectadosHTML();
    if (st.sub === 'entregas' && $('#pnTabla')) { $('#pnFiltros').innerHTML = filtrosHTML(); $('#pnTabla').innerHTML = tablaEntregasHTML(); }
    if (st.sub === 'ajustes' && $('#pnLimp')) { $('#pnLimp').innerHTML = limpiezaHTML(); $('#apLimp').innerHTML = ap.limpiezaHTML(); }
    if (st.sub === 'notas' && st.listo.g) ap.pintar();
  }

  // ------------------------------------------------------------ grupos
  function formHTML(g) {
    const c = cat(); const aps = ((c.apartados || {}).eee || []).filter(a => a.active && !a.parte);
    const h = g?.horario; const dias = h ? h.dias : [1, 2, 3, 4, 5];
    const cursos = [...aula.st.cursos.values()].sort((a, b) => b.nombre.localeCompare(a.nombre));
    const cursoId = g ? (g.curso || '') : (st.cursoForm ?? aula.cursoActivo()?.id ?? '');
    const cursoObj = aula.st.cursos.get(cursoId);
    const ofrecidas = cursoObj ? cursoObj.asignaturas : BIBLIOTECA.map(a => a.id);
    const marcada = (id) => g ? (g.asignaturas || []).includes(id) : (ofrecidas.length === 1 || (!cursoObj && id === 'eee'));
    const conEee = g ? (g.asignaturas || []).includes('eee') : marcada('eee');
    return `<form id="pnGrupoForm" class="pn-form" autocomplete="off">
      <label class="pn-f">Nombre del grupo<input name="nombre" maxlength="40" required placeholder="Ej.: 1ºA" value="${esc(g?.nombre || '')}"></label>
      <div class="ap-fila"><label class="pn-f">Curso escolar<select name="curso"><option value="">— Sin curso escolar —</option>${cursos.map(x => `<option value="${esc(x.id)}" ${x.id === cursoId ? 'selected' : ''}>${esc(x.nombre)}${x.activo ? ' (activo)' : ''}</option>`).join('')}</select></label>
      <label class="pn-f">Nº de alumnos (lista)<input name="alumnos" type="number" min="1" max="40" value="${esc(g?.alumnos || 25)}"></label></div>
      <fieldset class="pn-f"><legend>Asignaturas${cursoObj ? ' de ' + esc(cursoObj.nombre) : ''}</legend>${ofrecidas.map(id => asignatura(id)).filter(Boolean).map(s => `<label class="pn-chk"><input type="checkbox" name="asig" value="${esc(s.id)}" ${marcada(s.id) ? 'checked' : ''}> ${s.icon} ${esc(s.corto)}</label>`).join('')}</fieldset>
      <fieldset class="pn-f pn-aps ${conEee ? '' : 'off'}"><legend>Apartados de laboratorio (EEE)</legend>${aps.map(a => `<label class="pn-chk"><input type="checkbox" name="ap" value="${esc(a.id)}" ${!g || g.apartados.includes(a.id) ? 'checked' : ''}> ${esc(a.icon || '')} ${esc(a.nombre)}</label>`).join('')}</fieldset>
      <fieldset class="pn-f"><legend><label class="pn-chk"><input type="checkbox" name="conHorario" ${h ? 'checked' : ''}> Limitar a un horario (opcional)</label></legend>
        <div class="pn-hor ${h ? '' : 'off'}">${DIAS.map((d, i) => `<label class="pn-dia"><input type="checkbox" name="dia" value="${i + 1}" ${dias.includes(i + 1) ? 'checked' : ''}><span>${d}</span></label>`).join('')}
        <label>de <input type="time" name="desde" value="${h ? hhmm(h.desde) : '08:00'}"></label><label>a <input type="time" name="hasta" value="${h ? hhmm(h.hasta) : '14:30'}"></label></div></fieldset>
      <div class="pn-acts"><button type="submit" class="btn primary">${g ? '💾 Guardar cambios' : '➕ Crear grupo'}</button>${g ? '<button type="button" class="btn" data-pn="cancelar">Cancelar</button>' : ''}<span class="pn-msg" id="pnFormMsg"></span></div>
    </form>`;
  }
  function listaGruposHTML() {
    if (!st.listo.g) return '<p class="pn-small">Cargando…</p>';
    if (!st.grupos.size) return '<p class="pn-vacio">Todavía no hay grupos. Crea el primero arriba: el portal genera su código.</p>';
    const c = cat(); const nAp = (id) => (((c.apartados || {}).eee || []).find(a => a.id === id)?.nombre || id); const nAs = (id) => (asignatura(id)?.corto || id);
    return [...st.grupos.values()].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es')).map(g => {
      const vivos = st.sesiones.filter(s => s.grupo === g.id && !s.revocada && s.codigo === g.codigo && Date.now() - s.latido < VIVO_MS).length;
      const hor = g.horario ? `${g.horario.dias.map(d => DIAS[d - 1]).join(' ')} · ${hhmm(g.horario.desde)}–${hhmm(g.horario.hasta)}` : 'Sin límite de horario';
      return `<article class="pn-grupo ${g.activo ? '' : 'off'}" data-grupo="${esc(g.id)}">
        <div class="pn-gh"><h3>${esc(g.nombre)}</h3><span class="pn-est ${g.activo ? 'si' : 'no'}">${g.activo ? 'Acceso abierto' : 'Acceso cerrado'}</span></div>
        <div class="pn-code" title="Código del grupo">${esc(g.codigo)}</div>
        <div class="pn-small">${aula.st.cursos.get(g.curso || '') ? '📅 ' + esc(aula.st.cursos.get(g.curso).nombre) + ' · ' : ''}${g.asignaturas.map(nAs).map(esc).join(', ')}${g.apartados.length ? ' · ' + g.apartados.map(nAp).map(esc).join(' + ') : ''} · ${esc(g.alumnos || 25)} alumnos<br>🕘 ${esc(hor)} · 🟢 ${vivos} conectado${vivos === 1 ? '' : 's'}</div>
        <div class="pn-acts">
          <button class="btn" data-pn="grande" title="Mostrar el código en grande para proyectarlo">🔍 En grande</button>
          <button class="btn" data-pn="reiniciar">🔄 Reiniciar código</button>
          <button class="btn" data-pn="activar">${g.activo ? '⏸ Cerrar acceso' : '▶ Abrir acceso'}</button>
          <button class="btn" data-pn="editar">✏️ Editar</button>
          <button class="btn pn-peligro" data-pn="borrar">🗑 Borrar</button>
        </div></article>`;
    }).join('');
  }
  function leerForm(f) {
    const fd = new FormData(f);
    const nombre = String(fd.get('nombre') || '').replace(/\s+/g, ' ').trim().slice(0, 40);
    const asignaturas = fd.getAll('asig').map(String); const apartados = asignaturas.includes('eee') ? fd.getAll('ap').map(String) : [];
    const curso = String(fd.get('curso') || ''); const alumnos = Math.max(1, Math.min(40, parseInt(fd.get('alumnos'), 10) || 25));
    let horario = null;
    if (fd.get('conHorario')) {
      const t = (v) => { const [h, m] = String(v || '').split(':').map(Number); return h * 60 + (m || 0); };
      horario = { dias: fd.getAll('dia').map(Number).filter(n => n >= 1 && n <= 7), desde: t(fd.get('desde')), hasta: t(fd.get('hasta')), offset: offsetLocal() };
      if (!horario.dias.length) return { error: 'Marca al menos un día del horario.' };
      if (!(horario.desde < horario.hasta)) return { error: 'La hora de inicio tiene que ser anterior a la de fin.' };
    }
    if (!nombre) return { error: 'Escribe el nombre del grupo.' };
    if (!asignaturas.length) return { error: 'Marca al menos una asignatura.' };
    if (asignaturas.includes('eee') && !apartados.length) return { error: 'Marca al menos un apartado del laboratorio.' };
    return { nombre, asignaturas, apartados, horario, curso, alumnos };
  }
  async function codigoLibre() {
    for (let i = 0; i < 8; i++) { const c = nuevoCodigo(); const usado = [...st.grupos.values()].some(g => g.codigo === c); if (!usado && !(await getDoc(doc(db, 'codigos', c))).exists()) return c; }
    throw new Error('sin-codigo');
  }
  async function guardarGrupo(f) {
    const msg = $('#pnFormMsg'); const v = leerForm(f);
    if (v.error) { msg.textContent = v.error; msg.className = 'pn-msg ko'; return; }
    msg.textContent = 'Guardando…'; msg.className = 'pn-msg';
    try {
      const b = writeBatch(db);
      if (st.editando) {
        const g = st.grupos.get(st.editando);
        b.update(doc(db, 'grupos', g.id), { nombre: v.nombre, asignaturas: v.asignaturas, apartados: v.apartados, horario: v.horario, curso: v.curso, alumnos: v.alumnos });
        b.update(doc(db, 'codigos', g.codigo), { nombre: v.nombre, asignaturas: v.asignaturas, apartados: v.apartados, horario: v.horario, curso: v.curso });
        await b.commit(); st.editando = null; pintarTab(); return;
      }
      const id = nuevoId(); const codigo = await codigoLibre();
      b.set(doc(db, 'grupos', id), { nombre: v.nombre, asignaturas: v.asignaturas, apartados: v.apartados, codigo, activo: true, horario: v.horario, creado: Date.now(), curso: v.curso, alumnos: v.alumnos });
      b.set(doc(db, 'codigos', codigo), { grupo: id, nombre: v.nombre, asignaturas: v.asignaturas, apartados: v.apartados, activo: true, horario: v.horario, curso: v.curso });
      await b.commit();
      f.reset(); msg.textContent = `✔ Grupo «${v.nombre}» creado con el código ${codigo}.`; msg.className = 'pn-msg ok';
    } catch (e) { msg.textContent = '❌ No se ha podido guardar (' + (e?.code || e?.message || 'error') + ').'; msg.className = 'pn-msg ko'; }
  }
  async function accionGrupo(acc, g) {
    try {
      if (acc === 'editar') { st.editando = g.id; pintarTab(); $('#pnBody').scrollIntoView({ block: 'start' }); return; }
      if (acc === 'grande') return mostrarGrande(g);
      if (acc === 'reiniciar') {
        if (!confirm(`¿Reiniciar el código de ${g.nombre}?\n\nSe generará un código nuevo y los alumnos que estén dentro con el código ${g.codigo} saldrán del portal.`)) return;
        const nuevo = await codigoLibre(); const b = writeBatch(db);
        b.delete(doc(db, 'codigos', g.codigo));
        b.set(doc(db, 'codigos', nuevo), { grupo: g.id, nombre: g.nombre, asignaturas: g.asignaturas, apartados: g.apartados, activo: g.activo, horario: g.horario || null, curso: g.curso || '' });
        b.update(doc(db, 'grupos', g.id), { codigo: nuevo });
        await b.commit(); return;
      }
      if (acc === 'activar') {
        const b = writeBatch(db); b.update(doc(db, 'grupos', g.id), { activo: !g.activo }); b.update(doc(db, 'codigos', g.codigo), { activo: !g.activo }); await b.commit(); return;
      }
      if (acc === 'borrar') {
        if (!confirm(`¿Borrar el grupo ${g.nombre}?\n\nSu código dejará de funcionar. Las entregas del grupo NO se borran (puedes borrarlas en «Limpieza»).`)) return;
        const b = writeBatch(db); b.delete(doc(db, 'grupos', g.id)); b.delete(doc(db, 'codigos', g.codigo)); await b.commit(); if (st.editando === g.id) { st.editando = null; pintarTab(); }
      }
    } catch (e) { alert('No se ha podido completar la acción (' + (e?.code || e?.message || 'error') + ').'); }
  }
  function mostrarGrande(g) {
    const o = document.createElement('div'); o.className = 'pn-grande'; o.setAttribute('role', 'dialog');
    o.innerHTML = `<div class="pn-g1">${esc(g.nombre)} · código del grupo</div><div class="pn-g2">${esc(g.codigo)}</div><div class="pn-g3">Entra en el portal → «Soy alumno» → escribe este código y tu número de lista</div><div class="pn-g4">Clic para cerrar</div>`;
    o.onclick = () => o.remove(); document.body.appendChild(o);
  }

  // ------------------------------------------------------------ conectados
  function estadoSesion(s) {
    const g = st.grupos.get(s.grupo);
    if (s.revocada) return ['exp', '⛔ Expulsado'];
    if (!g || g.codigo !== s.codigo) return ['old', '🔄 Código antiguo'];
    if (!g.activo) return ['old', '⏸ Acceso cerrado'];
    const d = Date.now() - s.latido;
    if (d < VIVO_MS) return ['vivo', '🟢 Conectado'];
    if (d < RECIENTE_MS) return ['quieto', '🟡 Sin señal'];
    return ['fuera', '⚪ Desconectado'];
  }
  function conectadosHTML() {
    if (!st.listo.s || !st.listo.g) return '<p class="pn-small">Cargando…</p>';
    const filas = st.sesiones.map(s => ({ s, e: estadoSesion(s) })).filter(({ e }) => st.verTodos || ['vivo', 'quieto', 'exp'].includes(e[0]))
      .sort((a, b) => nombreGrupo(a.s.grupo).localeCompare(nombreGrupo(b.s.grupo), 'es') || a.s.numero - b.s.numero || b.s.latido - a.s.latido);
    if (!filas.length) return '<p class="pn-vacio">Ahora mismo no hay nadie conectado.</p>';
    const rep = new Map(); filas.forEach(({ s, e }) => { if (e[0] === 'vivo' || e[0] === 'quieto') { const k = s.grupo + '#' + s.numero; rep.set(k, (rep.get(k) || 0) + 1); } });
    return `<table class="pn-t"><thead><tr><th>Grupo</th><th>Nº</th><th>Dónde está</th><th>Desde</th><th>Última señal</th><th>Estado</th><th></th></tr></thead><tbody>${filas.map(({ s, e }) => `
      <tr class="st-${e[0]}" data-uid="${esc(s.uid)}"><td>${esc(nombreGrupo(s.grupo))}</td><td class="c"><b>${pad(s.numero)}</b>${rep.get(s.grupo + '#' + s.numero) > 1 ? ' <span class="pn-rep" title="Dos sesiones con el mismo número">⚠ repetido</span>' : ''}</td>
      <td>${esc(String(s.pagina || '').replace(/\s*\(#.*\)$/, ''))}</td><td>${fHora(s.desde)}</td><td>${hace(s.latido)}</td><td>${e[1]}</td>
      <td>${s.revocada ? '' : '<button class="btn small" data-pn="expulsar">Expulsar</button>'}</td></tr>`).join('')}</tbody></table>`;
  }

  // ------------------------------------------------------------ entregas
  function filtradas() {
    return st.entregas.filter(e => (!st.f.grupo || e.grupo === st.f.grupo) && (!st.f.practica || e.practica === st.f.practica) && (!st.f.estado || (st.f.estado === 'sin' ? e.nota == null : e.nota != null)));
  }
  function filtrosHTML() {
    const c = cat(); const usados = new Set(st.entregas.map(e => e.practica)); const gIds = [...new Set([...st.grupos.keys(), ...st.entregas.map(e => e.grupo)])];
    const opt = (v, t, sel) => `<option value="${esc(v)}" ${v === sel ? 'selected' : ''}>${esc(t)}</option>`;
    const pracs = [...c.practicas.map(p => [p.id, `Circuitos ${p.n} · ${p.titulo}`]), ...c.proyectos.map(p => [p.id, `ESP32 ${p.n} · ${p.titulo}`])].filter(([id]) => usados.has(id) || id === st.f.practica);
    return `<label>Grupo <select data-pn-f="grupo">${opt('', 'Todos', st.f.grupo)}${gIds.map(id => opt(id, nombreGrupo(id), st.f.grupo)).join('')}</select></label>
      <label>Práctica <select data-pn-f="practica">${opt('', 'Todas', st.f.practica)}${pracs.map(([id, t]) => opt(id, t, st.f.practica)).join('')}</select></label>
      <label>Estado <select data-pn-f="estado">${opt('', 'Todas', st.f.estado)}${opt('sin', 'Sin nota', st.f.estado)}${opt('con', 'Con nota', st.f.estado)}</select></label>
      <span class="pn-grow"></span><button class="btn" data-pn="csv">⬇ Exportar CSV</button>`;
  }
  function tablaEntregasHTML() {
    if (!st.listo.e) return '<p class="pn-small">Cargando…</p>';
    const L = filtradas(); if (!L.length) return '<p class="pn-vacio">No hay entregas con estos filtros.</p>';
    return `<table class="pn-t"><thead><tr><th>Fecha</th><th>Grupo</th><th>Nº</th><th>Práctica</th><th>Comprobación</th><th>Preguntas</th><th>Nota</th></tr></thead><tbody>${L.map(e => `
      <tr class="pn-row ${st.abierta === e.id ? 'sel' : ''}" data-ent="${esc(e.id)}" tabindex="0"><td>${fFecha(e.fecha)}</td><td>${esc(nombreGrupo(e.grupo))}</td><td class="c"><b>${pad(e.numero)}</b></td><td>${esc(tituloPractica(e.practica, e.titulo))}</td>
      <td class="c">${e.tipo === 'circuitos' || e.tipo === 'vivienda' ? (e.datos?.comprobacion?.ok ? '✅' : '❌') : (e.datos?.hecho ? '✅ hecho' : '—')}</td><td class="c">${esc(e.datos?.aciertos || '—')}</td><td class="c">${e.nota != null ? `<b>${esc(String(e.nota).replace('.', ','))}</b>` : '<span class="pn-small">sin nota</span>'}</td></tr>`).join('')}</tbody></table>`;
  }
  function pintarDetalle() {
    const D = $('#pnDetalle'); if (!D) return;
    const e = st.entregas.find(x => x.id === st.abierta);
    if (!e) { D.innerHTML = '<p class="pn-small">Elige una entrega de la lista para verla y ponerle nota.</p>'; return; }
    const d = e.datos || {}; let h = `<h3>${esc(nombreGrupo(e.grupo))} · nº ${pad(e.numero)}</h3><div class="pn-small">${esc(tituloPractica(e.practica, e.titulo))}<br>Entregada ${fFecha(e.fecha)}</div>`;
    if (e.tipo === 'circuitos' || e.tipo === 'vivienda') {
      h += `<div class="pn-acts"><button class="btn primary" data-pn="revisar">🔍 Ver el montaje en el ${e.tipo === 'vivienda' ? 'tablero 3D' : 'simulador'}</button></div>`;
      const c = d.comprobacion; if (c) h += `<h4>${c.ok ? '✅ Comprobación correcta' : '❌ Comprobación con fallos'}</h4><ul class="pn-items">${(c.items || []).map(it => `<li class="${it.ok ? 'ok' : 'ko'}">${it.ok ? '✔' : '✖'} ${esc(it.t)}</li>`).join('')}</ul>`;
      if (e.tipo === 'vivienda') { let mt = null; try { mt = JSON.parse(d.materiales || 'null'); } catch (er) { mt = null; } if (mt) h += `<h4>Materiales (Trabajo 3) · ${esc(String(mt.total ?? '').replace('.', ','))} €</h4><ul class="pn-items">${(mt.filas || []).slice(0, 40).map(x => `<li>${esc(x.c)}: ${esc(String(x.n).replace('.', ','))} ${esc(x.u)}</li>`).join('')}</ul>`; }
      const r = d.respuestas || {}; const ks = Object.keys(r);
      if (e.tipo !== 'vivienda') h += `<h4>Respuestas · ${esc(d.aciertos || '—')} correctas</h4>${ks.length ? `<ul class="pn-items">${ks.sort((a, b) => a - b).map(k => `<li>Pregunta ${+k + 1}: <b>${esc(r[k])}</b></li>`).join('')}</ul>` : '<p class="pn-small">Sin respuestas.</p>'}`;
    } else {
      const inf = d.informe || {};
      h += `<h4>✅ Proyecto marcado como hecho</h4>` + [['Mediciones', inf.mediciones], ['Problemas y soluciones', inf.problemas], ['Reto y conclusiones', inf.conclusiones]].map(([t, v]) => `<div class="pn-inf"><b>${t}</b><div>${v ? esc(v).replace(/\n/g, '<br>') : '<span class="pn-small">—</span>'}</div></div>`).join('');
    }
    h += `<h4>Calificación</h4><form id="pnNotaForm" class="pn-form"><label class="pn-f">Nota (0–10)<input name="nota" type="number" min="0" max="10" step="0.25" value="${e.nota != null ? esc(e.nota) : ''}"></label>
      <label class="pn-f">Comentario para el alumno<textarea name="comentario" maxlength="1000" rows="3">${esc(e.comentario || '')}</textarea></label>
      <div class="pn-acts"><button class="btn primary" type="submit">💾 Guardar nota</button><span class="pn-msg" id="pnNotaMsg"></span></div></form>`;
    D.innerHTML = h;
  }
  function calificar(id, nota, comentario) { return updateDoc(doc(db, 'entregas', id), { nota, comentario: String(comentario || '').slice(0, 1000), notaFecha: serverTimestamp() }); }
  async function guardarNota(f) {
    const msg = $('#pnNotaMsg'); const raw = String(new FormData(f).get('nota') || '').trim().replace(',', '.');
    const nota = raw === '' ? null : Math.round(+raw * 100) / 100;
    if (nota != null && !(nota >= 0 && nota <= 10)) { msg.textContent = 'La nota va de 0 a 10.'; msg.className = 'pn-msg ko'; return; }
    msg.textContent = 'Guardando…'; msg.className = 'pn-msg';
    try { await calificar(st.abierta, nota, new FormData(f).get('comentario')); msg.textContent = '✔ Guardado'; msg.className = 'pn-msg ok'; }
    catch (e) { msg.textContent = '❌ No se ha podido guardar.'; msg.className = 'pn-msg ko'; }
  }
  function exportarCSV() {
    const q = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const filas = [['Grupo', 'Nº', 'Práctica', 'Fecha', 'Comprobación', 'Preguntas', 'Nota', 'Comentario']].concat(filtradas().map(e => [nombreGrupo(e.grupo), e.numero, tituloPractica(e.practica, e.titulo), fFecha(e.fecha), e.tipo === 'circuitos' || e.tipo === 'vivienda' ? (e.datos?.comprobacion?.ok ? 'correcta' : 'con fallos') : 'hecho', e.datos?.aciertos || '', e.nota != null ? String(e.nota).replace('.', ',') : '', e.comentario || '']));
    const csv = '\ufeff' + filas.map(r => r.map(q).join(';')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })); const a = document.createElement('a');
    a.href = url; a.download = `entregas-${new Date().toISOString().slice(0, 10)}.csv`; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  // ------------------------------------------------------------ limpieza
  function limpiezaHTML() {
    const viejas = st.sesiones.filter(s => s.revocada || Date.now() - s.latido > ANTIGUA_MS || estadoSesion(s)[0] === 'old');
    const gIds = [...new Set(st.entregas.map(e => e.grupo))];
    return `<section class="pn-card"><h3>Conectados antiguos</h3><p class="pn-small">Sesiones sin señal desde hace más de 2 horas, expulsadas o con un código antiguo. No afecta a las entregas.</p>
      <div class="pn-acts"><button class="btn" data-pn="limpiarSes" ${viejas.length ? '' : 'disabled'}>🧹 Borrar ${viejas.length} ${viejas.length === 1 ? 'sesión antigua' : 'sesiones antiguas'}</button></div></section>
      <section class="pn-card"><h3>Entregas</h3><p class="pn-small">Al terminar el curso (o una evaluación), exporta las notas en CSV desde «Entregas» y borra las entregas para no guardar datos más tiempo del necesario.</p>
      <div class="pn-acts"><select id="pnBorrarGrupo"><option value="">Todos los grupos (${st.entregas.length})</option>${gIds.map(id => `<option value="${esc(id)}">${esc(nombreGrupo(id))} (${st.entregas.filter(e => e.grupo === id).length})</option>`).join('')}</select>
      <button class="btn pn-peligro" data-pn="borrarEnt" ${st.entregas.length ? '' : 'disabled'}>🗑 Borrar entregas</button><span class="pn-msg" id="pnLimpMsg"></span></div></section>`;
  }
  async function borrarEnLotes(refs) { for (let i = 0; i < refs.length; i += 400) { const b = writeBatch(db); refs.slice(i, i + 400).forEach(r => b.delete(r)); await b.commit(); } }

  // ------------------------------------------------------------ eventos
  async function onClick(ev) {
    const t = ev.target;
    const fila = t.closest('[data-ent]'); if (fila && !t.closest('button')) { st.abierta = fila.dataset.ent; $('#pnTabla').innerHTML = tablaEntregasHTML(); pintarDetalle(); return; }
    const b = t.closest('[data-pn]'); if (!b) return;
    const acc = b.dataset.pn;
    const g = st.grupos.get(b.closest('[data-grupo]')?.dataset.grupo || '');
    if (g) return accionGrupo(acc, g);
    if (acc === 'cancelar') { st.editando = null; pintarTab(); }
    if (acc === 'expulsar') {
      const uid = b.closest('[data-uid]').dataset.uid; const s = st.sesiones.find(x => x.uid === uid);
      if (s && confirm(`¿Expulsar al nº ${pad(s.numero)} de ${nombreGrupo(s.grupo)}?\n\nSaldrá del portal al momento. Podrá volver a entrar con el código del grupo (si no quieres, reinicia el código).`)) {
        updateDoc(doc(db, 'sesiones', uid), { revocada: true }).catch(e => alert('No se ha podido expulsar (' + (e?.code || 'error') + ').'));
      }
    }
    if (acc === 'csv') exportarCSV();
    if (acc === 'revisar') {
      const e = st.entregas.find(x => x.id === st.abierta); if (!e) return;
      PORTAL.revision = { id: e.id, practica: e.practica, montaje: e.datos?.montaje, respuestas: e.datos?.respuestas || {}, comprobacion: e.datos?.comprobacion, nota: e.nota, comentario: e.comentario, fecha: e.fecha, quien: `${nombreGrupo(e.grupo)} · nº ${pad(e.numero)}` };
      PORTAL.revision.materiales = e.datos?.materiales || null;
      location.hash = e.tipo === 'vivienda' ? '#eee/vivienda/revision' : '#eee/circuitos/revision';
    }
    if (acc === 'limpiarSes') {
      const viejas = st.sesiones.filter(s => s.revocada || Date.now() - s.latido > ANTIGUA_MS || estadoSesion(s)[0] === 'old');
      if (!confirm(`¿Borrar ${viejas.length} sesiones antiguas?`)) return;
      b.disabled = true; await borrarEnLotes(viejas.map(s => doc(db, 'sesiones', s.uid))).catch(e => alert('Error al borrar (' + (e?.code || 'error') + ').'));
    }
    if (acc === 'borrarEnt') {
      const gid = $('#pnBorrarGrupo').value; const L = st.entregas.filter(e => !gid || e.grupo === gid);
      if (!L.length) return;
      if (!confirm(`¿Borrar ${L.length} entregas${gid ? ' de ' + nombreGrupo(gid) : ' de TODOS los grupos'}?\n\nNo se puede deshacer. Exporta antes el CSV si necesitas las notas.`)) return;
      const msg = $('#pnLimpMsg'); msg.textContent = 'Borrando…';
      try { await borrarEnLotes(L.map(e => doc(db, 'entregas', e.id))); msg.textContent = '✔ Entregas borradas.'; } catch (e) { msg.textContent = '❌ Error al borrar.'; }
    }
  }
  function onChange(ev) {
    const t = ev.target;
    if (t.id === 'pnVerTodos') { st.verTodos = t.checked; pintarDatos(); }
    if (t.dataset.pnF) { st.f[t.dataset.pnF] = t.value; pintarDatos(); }
    if (t.name === 'conHorario') t.form.querySelector('.pn-hor').classList.toggle('off', !t.checked);
    if (t.name === 'asig' && t.form?.id === 'pnGrupoForm') t.form.querySelector('.pn-aps').classList.toggle('off', !t.form.querySelector('[name=asig][value=eee]')?.checked);
    if (t.name === 'curso' && t.form?.id === 'pnGrupoForm' && !st.editando) { st.cursoForm = t.value; const n = t.form.elements.nombre.value; $('#pnForm').innerHTML = formHTML(null); $('#pnGrupoForm').elements.nombre.value = n; }
  }
  // Cuando llegan los cursos escolares: refrescar pestañas y el formulario de grupo (si no se está escribiendo).
  window.addEventListener('portal-aula', () => {
    if (!st.el || !st.el.isConnected) return;
    pintarTabs();
    const f = $('#pnGrupoForm');
    if (st.sub === 'grupos' && f && !st.editando && !f.contains(document.activeElement) && !f.elements.nombre.value) $('#pnForm').innerHTML = formHTML(null);
  });
  document.addEventListener('submit', (ev) => {
    if (!st.el || !st.el.contains(ev.target)) return;
    if (ev.target.id === 'pnGrupoForm') { ev.preventDefault(); guardarGrupo(ev.target); }
    if (ev.target.id === 'pnNotaForm') { ev.preventDefault(); guardarNota(ev.target); }
    ap.onSubmit(ev);
  });

  return { render, parar, calificar };
}

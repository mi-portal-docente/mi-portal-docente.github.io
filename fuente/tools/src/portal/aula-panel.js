// Panel del profesor · aula virtual: cursos escolares, contenido (biblioteca → curso, editor de
// materiales, tareas, proyectos y exámenes) y calificaciones (cuaderno por grupo con categorías y pesos).
import { collection, doc, getDocs, query, where, onSnapshot, writeBatch, setDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { leerResultado } from '../act/resultado.js';
import { esc } from './util.js';
import { BIBLIOTECA, asignatura, TIPOS, CATEGORIAS, ETAPAS } from '../lms/biblioteca.js';
import { corregirExamen, notaRubrica, mediaPonderada, pesosPorDefecto, categoriaDe, fmtNota, redondea, idItem, idTrabajo, leeEnlaces, enlacesTexto, leeRubrica, rubricaTexto, csv, urlSegura, TIPOS_ENTREGA } from '../lms/modelo.js';
import { ordenarItems, nombreUnidad, textoHTML } from './aula-vistas.js';

const pad = (n) => String(n).padStart(2, '0');
const fFecha = (t) => (t ? new Date(t).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }) : '—');
const aLocal = (t) => { if (!t) return ''; const d = new Date(t); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16); };
const deLocal = (v) => (v ? new Date(v).getTime() : null);
export function cursoSugerido(d = new Date()) { const y = d.getFullYear(); const a = d.getMonth() >= 6 ? y : y - 1; return `${a}/${String((a + 1) % 100).padStart(2, '0')}`; }
const idCurso = (nombre) => 'c' + String(nombre).replace(/[^0-9A-Za-z]+/g, '-').replace(/^-|-$/g, '').slice(0, 30);
async function enLotes(ops) { for (let i = 0; i < ops.length; i += 400) { const b = writeBatch(ops[i].db); ops.slice(i, i + 400).forEach((o) => o.fn(b)); await b.commit(); } }

export function crearAulaPanel({ db, aula, ps, nombreGrupo, tituloPractica }) {
  const A = { el: null, sub: null, cursoEdit: null, asig: null, edit: null, preguntas: [], gGrupo: '', gAsig: '', gUnsubs: [], trabajos: new Map(), notas: new Map(), listoG: false, abierta: null, cargaEx: new Map(), msg: '' };
  const st = aula.st;
  const $ = (s) => A.el && A.el.querySelector(s);
  const cursos = () => [...st.cursos.values()].sort((a, b) => b.nombre.localeCompare(a.nombre));
  const curso = () => st.cursos.get(st.cursoSel) || null;
  const gruposDe = (cursoId, asig) => [...ps.grupos.values()].filter((g) => (!asig || (g.asignaturas || []).includes(asig)) && (g.curso ? g.curso === cursoId : true)).sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  const opt = (v, t, sel) => `<option value="${esc(v)}" ${v === sel ? 'selected' : ''}>${esc(t)}</option>`;

  // =============================================================== estructura
  function render(B, sub, extra) {
    A.el = B.closest('.pn') || B; A.sub = sub;
    if (sub !== 'notas') pararGrupo();
    B.innerHTML = `<div id="apBody"></div>`;
    pintar();
  }
  function pintar(forzar = false) {
    const B = $('#apBody'); if (!B) return;
    if (!st.listo.cursos) { B.innerHTML = '<p class="pn-small">Cargando…</p>'; return; }
    if (A.sub === 'cursos') B.innerHTML = cursosHTML();
    if (A.sub === 'notas') {
      // Con datos nuevos solo se repinta la tabla: el detalle (lo que el profesor está calificando) no se toca.
      const g = grupoSel(); const key = g ? `${g.id}|${asigGrupo(g)}` : '';
      const W = $('#apTablaW');
      if (!forzar && W && A.key === key && A.listoG) { W.innerHTML = tablaNotas(g, A.gAsig, pesosDe(g, A.gAsig)) || W.innerHTML; const D = $('#apDetalle'); if (D && !D.querySelector('form')) pintarDetalle(); return; }
      A.key = key; B.innerHTML = notasHTML(); pintarDetalle();
    }
  }
  window.addEventListener('portal-aula', () => { if (A.el?.isConnected && ['cursos', 'notas'].includes(A.sub)) pintar(); });

  // =============================================================== CURSOS ESCOLARES
  function cursosHTML() {
    const c = A.cursoEdit ? st.cursos.get(A.cursoEdit) : null;
    const asigs = c ? c.asignaturas : [];
    const form = `<section class="pn-card"><h3>${c ? 'Editar curso escolar' : 'Nuevo curso escolar'}</h3>
      <p class="pn-small">Cada curso eliges qué asignaturas de la biblioteca impartes. Los grupos, las tareas y los exámenes van dentro del curso escolar: el curso que viene no tendrás que duplicar nada, solo copiar.</p>
      <form id="apCursoForm" class="pn-form" autocomplete="off">
        <label class="pn-f">Curso escolar<input name="nombre" maxlength="20" required placeholder="2026/27" value="${esc(c?.nombre || (st.cursos.size ? '' : cursoSugerido()))}" ${c ? 'readonly' : ''}></label>
        ${ETAPAS.map((e) => `<fieldset class="pn-f"><legend>${esc(e)}</legend>${BIBLIOTECA.filter((a) => a.etapa === e).map((a) => `<label class="pn-chk"><input type="checkbox" name="asig" value="${esc(a.id)}" ${asigs.includes(a.id) ? 'checked' : ''}> ${a.icon} ${esc(a.corto)} <span class="pn-small">· ${esc(a.nombre)}</span></label>`).join('')}</fieldset>`).join('')}
        ${c ? '' : `<label class="pn-f">Copiar el contenido de otro curso (como borrador)<select name="copiar">${opt('', 'No copiar nada', '')}${cursos().map((x) => opt(x.id, x.nombre, '')).join('')}</select></label>`}
        <label class="pn-chk"><input type="checkbox" name="activo" ${!c || c.activo ? 'checked' : ''}> Es el curso activo (el que ven el panel y la portada)</label>
        <div class="pn-acts"><button class="btn primary" type="submit">${c ? '💾 Guardar' : '➕ Crear curso escolar'}</button>${c ? '<button class="btn" type="button" data-ap="cursoCancelar">Cancelar</button>' : ''}<span class="pn-msg" id="apCursoMsg">${esc(A.msg)}</span></div>
      </form></section>`;
    const lista = cursos().map((x) => {
      const nG = [...ps.grupos.values()].filter((g) => g.curso === x.id).length;
      return `<article class="pn-grupo ${x.activo ? '' : 'off'}" data-curso="${esc(x.id)}"><div class="pn-gh"><h3>📅 ${esc(x.nombre)}</h3><span class="pn-est ${x.activo ? 'si' : 'no'}">${x.activo ? 'Curso activo' : 'Archivado'}</span></div>
        <div class="ap-chips">${(x.asignaturas || []).map((id) => { const a = asignatura(id); return `<span class="ap-chip" style="--c:${a?.color || '#888'}">${a?.icon || ''} ${esc(a?.corto || id)}</span>`; }).join('') || '<span class="pn-small">Sin asignaturas</span>'}</div>
        <div class="pn-small">👥 ${nG} grupo${nG === 1 ? '' : 's'}${x.id === st.cursoSel ? ` · 📚 ${st.items.size} elemento${st.items.size === 1 ? '' : 's'}` : ''}</div>
        <div class="pn-acts">${x.activo ? '' : '<button class="btn" data-ap="cursoActivar">▶ Hacer activo</button>'}<button class="btn" data-ap="cursoEditar">✏️ Asignaturas</button><a class="btn" href="#asignaturas" data-ap="cursoVer">📚 Ver sus asignaturas</a><button class="btn pn-peligro" data-ap="cursoBorrar">🗑 Borrar</button></div></article>`;
    }).join('');
    return form + `<div class="pn-grupos">${lista || '<p class="pn-vacio">Todavía no hay cursos escolares. Crea el primero arriba.</p>'}</div>`;
  }
  async function guardarCurso(f) {
    const fd = new FormData(f); const msg = $('#apCursoMsg');
    const nombre = String(fd.get('nombre') || '').trim(); const asignaturas = fd.getAll('asig').map(String); const activo = !!fd.get('activo');
    if (!/^\d{4}\/\d{2}$/.test(nombre)) { msg.textContent = 'Escribe el curso así: 2026/27'; msg.className = 'pn-msg ko'; return; }
    if (!asignaturas.length) { msg.textContent = 'Marca al menos una asignatura.'; msg.className = 'pn-msg ko'; return; }
    const id = A.cursoEdit || idCurso(nombre);
    if (!A.cursoEdit && st.cursos.has(id)) { msg.textContent = 'Ese curso escolar ya existe.'; msg.className = 'pn-msg ko'; return; }
    msg.textContent = 'Guardando…'; msg.className = 'pn-msg';
    try {
      const b = writeBatch(db); const prev = st.cursos.get(id);
      b.set(doc(db, 'cursos', id), { nombre, asignaturas, activo, pesos: prev?.pesos || {}, creado: prev?.creado || Date.now() });
      if (activo) for (const x of st.cursos.values()) if (x.id !== id && x.activo) b.update(doc(db, 'cursos', x.id), { activo: false });
      await b.commit();
      const copiar = fd.get('copiar'); let n = 0;
      if (copiar) n = await copiarCurso(copiar, id, asignaturas);
      A.cursoEdit = null; A.msg = `✔ Curso ${nombre} guardado${copiar ? ` · ${n} elementos copiados como borrador` : ''}.`;
      if (activo || !st.cursoSel) aula.elegirCurso(id);
      pintar();
    } catch (e) { msg.textContent = '❌ No se ha podido guardar (' + (e?.code || e?.message || 'error') + ').'; msg.className = 'pn-msg ko'; }
  }
  // Copia los elementos de un curso a otro (sin grupos y sin publicar), con sus exámenes y claves.
  async function copiarCurso(origen, destino, asignaturas) {
    const qs = await getDocs(query(collection(db, 'items'), where('curso', '==', origen)));
    const qt = await getDocs(query(collection(db, 'temas'), where('curso', '==', origen)));
    const ops = []; let n = 0; const mapa = new Map();
    const hay = [...st.temas.values()].filter((t) => t.curso === destino);
    for (const d of qt.docs) {
      const t = d.data(); if (asignaturas && !asignaturas.includes(t.asig)) continue;
      const ya = hay.find((x) => x.asig === t.asig && x.nombre === t.nombre); if (ya) { mapa.set(d.id, ya.id); continue; }
      const id = 't' + idItem().slice(1); mapa.set(d.id, id);
      ops.push({ db, fn: (b) => b.set(doc(db, 'temas', id), { curso: destino, asig: t.asig, nombre: t.nombre, orden: t.orden, ...(t.origen ? { origen: t.origen } : {}) }) });
    }
    for (const d of qs.docs) {
      const x = d.data(); if (asignaturas && !asignaturas.includes(x.asig)) continue;
      const id = idItem(); n++;
      ops.push({ db, fn: (b) => b.set(doc(db, 'items', id), { ...x, curso: destino, tema: x.tema ? mapa.get(x.tema) || null : null, grupos: [], visible: [], publicado: false, pub: null, actualizado: Date.now() }) });
      if (x.tipo === 'examen') {
        const { examen, claves } = await aula.examen(d.id, { claves: true });
        if (examen) ops.push({ db, fn: (b) => b.set(doc(db, 'examenes', id), { ...examen, desde: Timestamp.fromMillis(examen.desde), hasta: Timestamp.fromMillis(examen.hasta), grupos: [], publicado: false }) });
        ops.push({ db, fn: (b) => b.set(doc(db, 'claves', id), claves || { respuestas: {} }) });
      }
    }
    await enLotes(ops); return n;
  }
  async function accionCurso(acc, c) {
    try {
      if (acc === 'cursoEditar') { A.cursoEdit = c.id; A.msg = ''; pintar(); A.el.scrollIntoView?.({ block: 'start' }); return; }
      if (acc === 'cursoVer') { aula.elegirCurso(c.id); return; }
      if (acc === 'cursoActivar') { const b = writeBatch(db); for (const x of st.cursos.values()) b.update(doc(db, 'cursos', x.id), { activo: x.id === c.id }); await b.commit(); aula.elegirCurso(c.id); return; }
      if (acc === 'cursoBorrar') {
        const nG = [...ps.grupos.values()].filter((g) => g.curso === c.id).length;
        const nI = (await getDocs(query(collection(db, 'items'), where('curso', '==', c.id)))).size;
        if (nG || nI) { alert(`No se puede borrar ${c.nombre}: tiene ${nG} grupo(s) y ${nI} elemento(s). Bórralos antes (o déjalo archivado).`); return; }
        if (!confirm(`¿Borrar el curso escolar ${c.nombre}?`)) return;
        await deleteDoc(doc(db, 'cursos', c.id));
      }
    } catch (e) { alert('No se ha podido completar la acción (' + (e?.code || 'error') + ').'); }
  }

  // =============================================================== CONTENIDO
  function asigsCurso() { const c = curso(); return c ? c.asignaturas || [] : []; }
  function asigSel() { const L = asigsCurso(); if (!L.includes(A.asig)) A.asig = L[0] || null; return A.asig; }


  async function copiarDe(asig) {
    const otros = cursos().filter((c) => c.id !== st.cursoSel);
    if (!otros.length) { alert('No hay otro curso escolar del que copiar.'); return; }
    const nombre = prompt(`¿De qué curso copio el contenido de ${asignatura(asig)?.corto}? Escribe el curso (${otros.map((c) => c.nombre).join(', ')}).`, otros[0].nombre);
    const o = otros.find((c) => c.nombre === String(nombre || '').trim()); if (!o) return;
    const n = await copiarCurso(o.id, st.cursoSel, [asig]);
    alert(`✔ ${n} elementos copiados como borrador.`);
  }

  // =============================================================== CALIFICACIONES
  function grupoSel() { const g = ps.grupos.get(A.gGrupo); if (g) return g; const L = [...ps.grupos.values()].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es')); A.gGrupo = L[0]?.id || ''; return L[0] || null; }
  function asigGrupo(g) { const L = (g?.asignaturas || []).filter((x) => asignatura(x)); if (!L.includes(A.gAsig)) A.gAsig = L[0] || ''; return A.gAsig; }
  function escucharGrupo(g) {
    if (A.gEsc === g.id) return; pararGrupo(); A.gEsc = g.id; A.listoG = false;
    if (g.curso && g.curso !== st.cursoSel) aula.elegirCurso(g.curso);
    let n = 0; const listo = () => { if (++n >= 2) A.listoG = true; pintar(); };
    let una = [false, false];
    A.gUnsubs.push(onSnapshot(query(collection(db, 'trabajos'), where('grupo', '==', g.id)), (qs) => { A.trabajos = new Map(); qs.forEach((d) => { const x = d.data({ serverTimestamps: 'estimate' }); A.trabajos.set(d.id, { id: d.id, ...x, fecha: x.fecha?.toMillis?.() || null, inicio: x.inicio?.toMillis?.() || null }); }); if (!una[0]) { una[0] = true; listo(); } else pintar(); }, () => { }));
    A.gUnsubs.push(onSnapshot(query(collection(db, 'notas'), where('grupo', '==', g.id)), (qs) => { A.notas = new Map(); qs.forEach((d) => A.notas.set(d.id, { id: d.id, ...d.data() })); if (!una[1]) { una[1] = true; listo(); } else pintar(); }, () => { }));
  }
  function pararGrupo() { A.gUnsubs.forEach((f) => { try { f(); } catch (e) { } }); A.gUnsubs = []; A.gEsc = null; }
  function columnas(g, asig) {
    const cols = ordenarItems([...st.items.values()].filter((it) => it.asig === asig && it.tipo !== 'material' && (it.grupos || []).includes(g.id)))
      .map((it) => ({ k: it.id, it, cat: it.categoria || categoriaDe(it.tipo), titulo: it.titulo }));
    if (asig === 'eee') {
      const labs = [...new Set(ps.entregas.filter((e) => e.grupo === g.id).map((e) => e.practica))].sort();
      labs.forEach((p) => cols.push({ k: 'lab:' + p, lab: p, cat: 'practicas', titulo: tituloPractica(p) }));
    }
    return cols;
  }
  function celda(g, c, n) {
    if (c.lab) { const e = ps.entregas.filter((x) => x.grupo === g.id && x.numero === n && x.practica === c.lab).sort((a, b) => b.fecha - a.fecha)[0]; return e ? { nota: e.nota, pub: true, estado: e.nota == null ? 'entregado' : 'nota' } : { estado: 'nada' }; }
    const id = idTrabajo(c.k, g.id, n); const nt = A.notas.get(id); const tr = A.trabajos.get(id);
    if (nt && nt.nota != null) return { nota: nt.nota, pub: nt.publicada, estado: 'nota', tr };
    if (tr) return { estado: tr.estado === 'en_curso' ? 'curso' : 'entregado', tr, tarde: c.it?.fechaEntrega && tr.fecha > c.it.fechaEntrega };
    return { estado: 'nada' };
  }
  function filas(g) { const max = Math.max(g.alumnos || 25, ...[...A.trabajos.values(), ...A.notas.values()].map((x) => x.numero || 0)); return Array.from({ length: Math.min(40, max) }, (_, i) => i + 1); }
  function pesosDe(g, asig) { const c = st.cursos.get(g.curso || st.cursoSel); return { ...pesosPorDefecto(), ...((c?.pesos || {})[asig] || {}) }; }
  function notasHTML() {
    const g = grupoSel();
    if (!g) return '<p class="pn-vacio">Todavía no hay grupos.</p>';
    const asig = asigGrupo(g); escucharGrupo(g);
    const pesos = pesosDe(g, asig); const cursoG = st.cursos.get(g.curso || '');
    const bar = `<div class="pn-bar"><label>Grupo <select data-ap-f="gGrupo">${[...ps.grupos.values()].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es')).map((x) => opt(x.id, x.nombre + (st.cursos.get(x.curso || '') ? ' · ' + st.cursos.get(x.curso).nombre : ''), g.id)).join('')}</select></label>
      <label>Asignatura <select data-ap-f="gAsig">${(g.asignaturas || []).filter((x) => asignatura(x)).map((x) => opt(x, asignatura(x).corto, asig)).join('')}</select></label>
      <span class="pn-grow"></span><button class="btn" data-ap="csvNotas">⬇ Exportar CSV</button></div>
      <div class="pn-bar ap-pesos"><b>⚖️ Pesos:</b>${CATEGORIAS.map((c) => `<label>${esc(c.nombre)} <input type="number" min="0" max="100" step="5" data-peso="${c.id}" value="${esc(pesos[c.id])}" ${cursoG ? '' : 'disabled'}> %</label>`).join('')}${cursoG ? '<button class="btn small" data-ap="guardarPesos">💾 Guardar pesos</button>' : '<span class="pn-small">(asigna el grupo a un curso escolar para cambiar los pesos)</span>'}<span class="pn-msg" id="apPesosMsg"></span></div>`;
    if (!A.listoG || !st.listo.items) return bar + '<p class="pn-small">Cargando…</p>';
    const t = tablaNotas(g, asig, pesos);
    if (!t) return bar + `<p class="pn-vacio">Todavía no hay tareas, proyectos ni exámenes de ${esc(asignatura(asig)?.corto || asig)} asignados a ${esc(g.nombre)}.</p>`;
    return bar + `<p class="pn-small">Clic en una casilla para ver la entrega y calificar. <b>Negrita</b> = nota publicada · <i>cursiva</i> = sin publicar · 📥 entregado · ⏳ examen empezado · ⏰ con retraso. La media de cada categoría solo cuenta lo calificado; las categorías sin notas no cuentan.</p>
      <div class="ap-libro"><div class="ap-tabla-wrap" id="apTablaW">${t}</div><aside id="apDetalle" class="pn-det"></aside></div>`;
  }
  function tablaNotas(g, asig, pesos) {
    const cols = columnas(g, asig);
    if (!cols.length) return '';
    const cats = CATEGORIAS.filter((c) => cols.some((x) => x.cat === c.id));
    const head = `<tr><th class="ap-n">Nº</th>${cols.map((c) => {
      const sinPub = c.lab ? 0 : [...A.notas.values()].filter((n) => n.item === c.k && !n.publicada && n.nota != null).length;
      return `<th class="ap-col cat-${esc(c.cat)}" data-col="${esc(c.k)}" title="${esc(c.titulo)}"><div class="ap-cth">${c.lab ? '🔬' : TIPOS[c.it.tipo]?.icon || ''} ${esc(c.titulo.length > 26 ? c.titulo.slice(0, 25) + '…' : c.titulo)}</div>
        ${c.lab ? '<div class="pn-small">laboratorio</div>' : `<div class="ap-cacts">${c.it.tipo === 'examen' ? '<button class="btn tiny" data-ap="autocorregir" title="Corregir automáticamente las entregas sin nota">⚡ Corregir</button>' : c.it.tipo === 'actividad' ? '<button class="btn tiny" data-ap="notasActividad" title="Poner como nota el resultado de la actividad a las entregas sin nota">⚡ Poner notas</button>' : ''}${sinPub ? `<button class="btn tiny" data-ap="publicarNotas" title="Publicar las notas a los alumnos">📢 Publicar ${sinPub}</button>` : ''}</div>`}</th>`;
    }).join('')}${cats.map((c) => `<th class="ap-media">${esc(c.nombre)}<div class="pn-small">${esc(pesos[c.id])} %</div></th>`).join('')}<th class="ap-media fin">Final</th></tr>`;
    const body = filas(g).map((n) => {
      const vals = cols.map((c) => ({ c, v: celda(g, c, n) }));
      const { medias, final } = mediaPonderada(vals.map(({ c, v }) => ({ categoria: c.cat, nota: v.estado === 'nota' ? v.nota : null })), pesos);
      return `<tr><th class="ap-n">${pad(n)}</th>${vals.map(({ c, v }) => `<td class="ap-c e-${v.estado} ${v.pub === false ? 'nopub' : ''} ${A.abierta && A.abierta.k === c.k && A.abierta.n === n ? 'sel' : ''}" data-celda="${esc(c.k)}" data-n="${n}" tabindex="0" title="${v.estado === 'nota' ? (v.pub ? 'Nota publicada' : 'Nota sin publicar') : v.estado === 'entregado' ? 'Entregado, sin nota' : v.estado === 'curso' ? 'Examen empezado' : 'Sin entrega'}">${v.estado === 'nota' ? esc(fmtNota(v.nota)) : v.estado === 'entregado' ? '📥' : v.estado === 'curso' ? '⏳' : '·'}${v.tarde ? '<sup>⏰</sup>' : ''}</td>`).join('')}
        ${cats.map((c) => `<td class="ap-media">${esc(fmtNota(medias[c.id]))}</td>`).join('')}<td class="ap-media fin"><b>${esc(fmtNota(final))}</b></td></tr>`;
    }).join('');
    return `<table class="pn-t ap-tabla"><thead>${head}</thead><tbody>${body}</tbody></table>`;
  }
  async function cargarExamenProfe(id) {
    if (A.cargaEx.has(id)) return A.cargaEx.get(id);
    const r = await aula.examen(id, { claves: true }); A.cargaEx.set(id, r); return r;
  }
  function pintarDetalle() {
    const D = $('#apDetalle'); if (!D) return;
    const g = grupoSel(); const ab = A.abierta;
    if (!ab || !g) { D.innerHTML = '<p class="pn-small">Elige una casilla del cuaderno.</p>'; return; }
    const pinB = `<button class="btn small" data-ap="pinReset" title="Si el alumno ha olvidado su PIN">🔑 Reiniciar PIN del nº ${pad(ab.n)}</button>`;
    if (ab.k.startsWith('lab:')) {
      D.innerHTML = `<h3>${esc(g.nombre)} · nº ${pad(ab.n)}</h3><div class="pn-small">${esc(tituloPractica(ab.k.slice(4)))}</div><p>Las prácticas del laboratorio (ESP32 y Circuitos) se califican en la pestaña <a href="#panel/entregas">📥 Entregas</a>.</p><div class="pn-acts">${pinB}</div>`; return;
    }
    const it = st.items.get(ab.k); if (!it) { D.innerHTML = '<p class="pn-small">Este elemento ya no existe.</p>'; return; }
    const id = idTrabajo(it.id, g.id, ab.n); const tr = A.trabajos.get(id); const nt = A.notas.get(id);
    let h = `<h3>${esc(g.nombre)} · nº ${pad(ab.n)}</h3><div class="pn-small">${TIPOS[it.tipo]?.icon || ''} ${esc(it.titulo)}</div>`;
    if (!tr) h += '<p class="pn-small">Sin entrega. Puedes poner nota igualmente (p. ej., trabajo hecho en clase o en papel).</p>';
    else h += `<div class="pn-small">${tr.estado === 'en_curso' ? '⏳ Examen empezado, sin entregar' : '📥 Entregado'} · ${fFecha(tr.fecha)}${it.fechaEntrega && tr.fecha > it.fechaEntrega ? ' · <b>con retraso</b>' : ''}</div>`;
    const det = nt?.detalle || {};
    let auto = null;
    if (it.tipo === 'examen') {
      const ex = A.cargaEx.get(it.id);
      if (!ex) { h += '<p class="pn-small">Cargando el examen…</p>'; cargarExamenProfe(it.id).then(() => pintarDetalle()).catch(() => { }); }
      else {
        const pq = ex.examen?.preguntas || []; const k = ex.claves?.respuestas || {}; const r = tr?.respuestas || {};
        const manual = {}; pq.forEach((q) => { if (det[q.id] != null) manual[q.id] = det[q.id]; });
        auto = corregirExamen(pq, k, r, manual);
        h += `<h4>Respuestas · ${esc(fmtNota(auto.puntos))} / ${esc(fmtNota(auto.max))} puntos</h4><ol class="ap-resp">${pq.map((q) => {
          const v = r[q.id]; const txt = v == null ? '— sin responder' : q.tipo === 'test' ? (q.opciones || [])[v] ?? v : q.tipo === 'vf' ? (v ? 'Verdadero' : 'Falso') : v;
          const sol = q.tipo === 'test' ? (q.opciones || [])[k[q.id]] : q.tipo === 'vf' ? (k[q.id] ? 'Verdadero' : 'Falso') : (k[q.id] || []).join(' · ');
          const p = auto.detalle[q.id]; const okk = p >= (q.puntos || 1);
          return `<li class="${okk ? 'ok' : p > 0 ? 'med' : 'ko'}"><div>${esc(q.enunciado)}</div><div>➜ <b>${esc(txt)}</b></div><div class="pn-small">Solución: ${esc(sol || '(manual)')}</div>
            <label class="pn-small">Puntos <input type="number" class="ap-qpts" data-qid="${esc(q.id)}" min="0" max="${esc(q.puntos || 1)}" step="0.25" value="${esc(p)}"> / ${esc(fmtNota(q.puntos || 1))}${auto.revisar.includes(q.id) ? ' · <b>revisar</b>' : ''}</label></li>`;
        }).join('')}</ol>`;
      }
    } else if (tr) {
      if (it.tipo === 'actividad') { const r = leerResultado(tr.texto); if (r) { auto = { nota: r.nota }; h += `<div class="pn-inf ap-act">🧩 Resultado de la actividad: <b>${r.aciertos}/${r.total}</b> aciertos → nota sugerida <b>${esc(fmtNota(r.nota))}</b></div>`; } }
      h += `<div class="pn-inf"><b>Respuesta</b><div>${tr.texto ? textoHTML(tr.texto) : '<span class="pn-small">—</span>'}</div></div>${(tr.enlaces || []).map((u) => `<div>🔗 <a href="${esc(urlSegura(u))}" target="_blank" rel="noopener noreferrer">${esc(u)}</a></div>`).join('')}`;
    }
    if (it.rubrica?.length) {
      h += `<h4>Rúbrica</h4><table class="pn-t ap-rub">${it.rubrica.map((r, i) => `<tr><td>${esc(r.c)}</td><td class="c"><input type="number" class="ap-rpts" data-ri="${i}" min="0" max="${esc(r.p)}" step="0.25" value="${esc(det['r' + i] ?? '')}"> / ${esc(fmtNota(r.p))}</td></tr>`).join('')}</table>`;
    }
    const sug = auto ? auto.nota : it.rubrica?.length ? notaRubrica(it.rubrica, Object.fromEntries(it.rubrica.map((_, i) => [i, det['r' + i]]))).nota : null;
    h += `<h4>Calificación</h4><form id="apNotaForm" class="pn-form"><label class="pn-f">Nota (0–10)<input name="nota" id="apNota" type="number" min="0" max="10" step="0.01" value="${esc(nt?.nota ?? sug ?? '')}"></label>
      <label class="pn-f">Comentario para el alumno<textarea name="comentario" maxlength="2000" rows="3">${esc(nt?.comentario || '')}</textarea></label>
      <label class="pn-chk"><input type="checkbox" name="publicada" ${nt ? (nt.publicada ? 'checked' : '') : ''}> Publicar la nota al alumno</label>
      <div class="pn-acts"><button class="btn primary" type="submit">💾 Guardar nota</button>${nt ? '<button class="btn" type="button" data-ap="borrarNota">Quitar nota</button>' : ''}<span class="pn-msg" id="apNotaMsg"></span></div></form>
      <div class="pn-acts">${tr ? `<button class="btn small" data-ap="repetir" title="Borra la entrega para que pueda volver a entregar o repetir el examen">↺ Permitir repetir</button>` : ''}${pinB}</div>`;
    D.innerHTML = h;
  }
  function recalcular() {
    const D = $('#apDetalle'); const ab = A.abierta; if (!D || !ab) return;
    const it = st.items.get(ab.k); if (!it) return;
    let nota = null;
    if (it.tipo === 'examen') {
      const ex = A.cargaEx.get(it.id); if (!ex) return; const g = grupoSel(); const tr = A.trabajos.get(idTrabajo(it.id, g.id, ab.n));
      const manual = {}; D.querySelectorAll('.ap-qpts').forEach((i) => { manual[i.dataset.qid] = i.value; });
      nota = corregirExamen(ex.examen?.preguntas || [], ex.claves?.respuestas || {}, tr?.respuestas || {}, manual).nota;
    } else if (it.rubrica?.length) {
      const v = {}; D.querySelectorAll('.ap-rpts').forEach((i) => { if (i.value !== '') v[i.dataset.ri] = Number(i.value); });
      nota = notaRubrica(it.rubrica, v).nota;
    }
    if (nota != null) $('#apNota').value = nota;
  }
  async function guardarNota(f) {
    const ab = A.abierta; const g = grupoSel(); const it = st.items.get(ab.k); const msg = $('#apNotaMsg');
    const fd = new FormData(f); const raw = String(fd.get('nota') || '').trim().replace(',', '.');
    const nota = raw === '' ? null : redondea(+raw);
    if (nota != null && !(nota >= 0 && nota <= 10)) { msg.textContent = 'La nota va de 0 a 10.'; msg.className = 'pn-msg ko'; return; }
    const detalle = {}; let puntos = null, max = null;
    A.el.querySelectorAll('#apDetalle .ap-rpts').forEach((i) => { if (i.value !== '') detalle['r' + i.dataset.ri] = Number(i.value); });
    if (it.tipo === 'examen' && A.cargaEx.get(it.id)) {
      const ex = A.cargaEx.get(it.id); const manual = {}; A.el.querySelectorAll('#apDetalle .ap-qpts').forEach((i) => { manual[i.dataset.qid] = i.value; });
      const r = corregirExamen(ex.examen?.preguntas || [], ex.claves?.respuestas || {}, A.trabajos.get(idTrabajo(it.id, g.id, ab.n))?.respuestas || {}, manual);
      Object.assign(detalle, r.detalle); puntos = r.puntos; max = r.max;
    } else if (it.rubrica?.length) { const r = notaRubrica(it.rubrica, Object.fromEntries(Object.entries(detalle).map(([k, v]) => [k.slice(1), v]))); puntos = r.puntos; max = r.max; }
    msg.textContent = 'Guardando…'; msg.className = 'pn-msg';
    try {
      await setDoc(doc(db, 'notas', idTrabajo(it.id, g.id, ab.n)), { item: it.id, curso: it.curso, asig: it.asig, al: `${g.id}_${ab.n}`, grupo: g.id, numero: ab.n, nota, puntos, max, detalle, comentario: String(fd.get('comentario') || '').slice(0, 2000), publicada: !!fd.get('publicada'), fecha: Date.now() });
      msg.textContent = '✔ Guardado'; msg.className = 'pn-msg ok';
    } catch (e) { msg.textContent = '❌ No se ha podido guardar (' + (e?.code || 'error') + ').'; msg.className = 'pn-msg ko'; }
  }
  async function autocorregir(itemId) {
    const g = grupoSel(); const it = st.items.get(itemId);
    const ex = await cargarExamenProfe(itemId); const pq = ex.examen?.preguntas || []; const k = ex.claves?.respuestas || {};
    const ops = []; let n = 0, revisar = 0;
    for (const tr of A.trabajos.values()) {
      if (tr.item !== itemId || A.notas.get(tr.id)?.nota != null) continue;
      const r = corregirExamen(pq, k, tr.respuestas || {}); n++; if (r.revisar.length) revisar++;
      ops.push({ db, fn: (b) => b.set(doc(db, 'notas', tr.id), { item: it.id, curso: it.curso, asig: it.asig, al: tr.al, grupo: tr.grupo, numero: tr.numero, nota: r.nota, puntos: r.puntos, max: r.max, detalle: r.detalle, comentario: '', publicada: false, fecha: Date.now() }) });
    }
    await enLotes(ops);
    alert(n ? `✔ ${n} examen(es) corregidos (sin publicar).${revisar ? `\n${revisar} tienen respuestas cortas que conviene revisar.` : ''}` : 'No hay exámenes entregados sin nota.');
  }
  // Actividades de clase: la entrega trae «Aciertos: a/t» → nota sobre 10 (sin publicar, como el autocorrector).
  async function notasActividad(itemId) {
    const it = st.items.get(itemId); const ops = []; let n = 0;
    for (const tr of A.trabajos.values()) {
      if (tr.item !== itemId || A.notas.get(tr.id)?.nota != null) continue;
      const r = leerResultado(tr.texto); if (!r) continue; n++;
      ops.push({ db, fn: (b) => b.set(doc(db, 'notas', tr.id), { item: it.id, curso: it.curso, asig: it.asig, al: tr.al, grupo: tr.grupo, numero: tr.numero, nota: r.nota, puntos: r.aciertos, max: r.total, detalle: {}, comentario: `Actividad: ${r.aciertos}/${r.total} aciertos`, publicada: false, fecha: Date.now() }) });
    }
    await enLotes(ops);
    alert(n ? `✔ ${n} nota(s) puestas a partir del resultado de la actividad (sin publicar).` : 'No hay entregas de esta actividad sin nota.');
  }
  async function publicarNotas(itemId) {
    const L = [...A.notas.values()].filter((n) => n.item === itemId && !n.publicada && n.nota != null);
    if (!L.length || !confirm(`¿Publicar ${L.length} nota(s)? Los alumnos las verán al momento.`)) return;
    await enLotes(L.map((n) => ({ db, fn: (b) => b.update(doc(db, 'notas', n.id), { publicada: true }) })));
  }
  function exportarCSV() {
    const g = grupoSel(); const asig = A.gAsig; const cols = columnas(g, asig); const pesos = pesosDe(g, asig);
    const cats = CATEGORIAS.filter((c) => cols.some((x) => x.cat === c.id));
    const filasCsv = [['Nº', ...cols.map((c) => c.titulo), ...cats.map((c) => `${c.nombre} (${pesos[c.id]} %)`), 'Nota final']];
    for (const n of filas(g)) {
      const v = cols.map((c) => celda(g, c, n)); const { medias, final } = mediaPonderada(v.map((x, i) => ({ categoria: cols[i].cat, nota: x.estado === 'nota' ? x.nota : null })), pesos);
      filasCsv.push([pad(n), ...v.map((x) => (x.estado === 'nota' ? fmtNota(x.nota) : x.estado === 'entregado' ? 'entregado' : '')), ...cats.map((c) => fmtNota(medias[c.id])), fmtNota(final)]);
    }
    const url = URL.createObjectURL(new Blob([csv(filasCsv)], { type: 'text/csv;charset=utf-8' })); const a = document.createElement('a');
    a.href = url; a.download = `notas-${g.nombre.replace(/[^\wºª-]+/g, '_')}-${asig}-${new Date().toISOString().slice(0, 10)}.csv`; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  // =============================================================== limpieza (aula)
  function limpiezaHTML() {
    const gs = [...ps.grupos.values()].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
    return `<section class="pn-card"><h3>PIN de los alumnos</h3><p class="pn-small">Cada nº de lista elige un PIN la primera vez. Si un alumno lo olvida, reinícialo desde el «Cuaderno de calificaciones» (casilla del alumno) o aquí todos los del grupo: la próxima vez que entre elegirá uno nuevo.</p>
      <div class="pn-acts"><select id="apPinGrupo">${gs.map((g) => opt(g.id, g.nombre, '')).join('')}</select><button class="btn" data-ap="pinesGrupo" ${gs.length ? '' : 'disabled'}>🔑 Reiniciar todos los PIN del grupo</button><span class="pn-msg" id="apPinMsg"></span></div></section>
      <section class="pn-card"><h3>Trabajos y notas del aula</h3><p class="pn-small">Al cerrar un curso escolar, exporta el CSV de cada grupo y borra sus trabajos y notas para no guardar datos más tiempo del necesario.</p>
      <div class="pn-acts"><select id="apBorrarCurso">${cursos().map((c) => opt(c.id, c.nombre, '')).join('')}</select><button class="btn pn-peligro" data-ap="borrarCursoDatos" ${st.cursos.size ? '' : 'disabled'}>🗑 Borrar trabajos y notas de ese curso</button><span class="pn-msg" id="apBorrarMsg"></span></div></section>`;
  }
  async function borrarDatosCurso(cid) {
    const nombre = st.cursos.get(cid)?.nombre || cid;
    const [t, n] = await Promise.all([getDocs(query(collection(db, 'trabajos'), where('curso', '==', cid))), getDocs(query(collection(db, 'notas'), where('curso', '==', cid)))]);
    if (!t.size && !n.size) { alert('No hay trabajos ni notas de ese curso.'); return; }
    if (!confirm(`¿Borrar ${t.size} trabajos y ${n.size} notas de ${nombre}? No se puede deshacer.`)) return;
    await enLotes([...t.docs, ...n.docs].map((d) => ({ db, fn: (b) => b.delete(d.ref) })));
    $('#apBorrarMsg').textContent = '✔ Borrado.';
  }

  // =============================================================== eventos
  async function onClick(ev) {
    const t = ev.target;
    const cel = t.closest('[data-celda]'); if (cel && A.sub === 'notas') { A.abierta = { k: cel.dataset.celda, n: +cel.dataset.n }; A.el.querySelectorAll('.ap-c.sel').forEach((x) => x.classList.remove('sel')); cel.classList.add('sel'); pintarDetalle(); return; }
    const b = t.closest('[data-ap]'); if (!b || !A.el?.contains(b)) return;
    const acc = b.dataset.ap;
    try {
      const c = st.cursos.get(b.closest('[data-curso]')?.dataset.curso || ''); if (c) return accionCurso(acc, c);
      if (acc === 'cursoCancelar') { A.cursoEdit = null; pintar(); }
      const asigB = b.closest('[data-asig]')?.dataset.asig;
      if (acc === 'importar' && asigB) window.PORTAL?.aula?.importar?.(asigB);
      if (acc === 'copiarDe' && asigB) await copiarDe(asigB);
      const col = b.closest('[data-col]')?.dataset.col;
      if (acc === 'autocorregir' && col) { b.disabled = true; await autocorregir(col); }
      if (acc === 'notasActividad' && col) { b.disabled = true; await notasActividad(col); }
      if (acc === 'publicarNotas' && col) await publicarNotas(col);
      if (acc === 'csvNotas') exportarCSV();
      if (acc === 'guardarPesos') {
        const g = grupoSel(); const p = {}; A.el.querySelectorAll('[data-peso]').forEach((i) => { p[i.dataset.peso] = Math.max(0, Math.min(100, Number(i.value) || 0)); });
        await updateDoc(doc(db, 'cursos', g.curso), { [`pesos.${A.gAsig}`]: p }); $('#apPesosMsg').textContent = '✔ Guardado';
      }
      if (acc === 'borrarNota') { const g = grupoSel(); if (confirm('¿Quitar la nota?')) { await deleteDoc(doc(db, 'notas', idTrabajo(A.abierta.k, g.id, A.abierta.n))); pintarDetalle(); } }
      if (acc === 'repetir') { const g = grupoSel(); if (confirm(`¿Borrar la entrega del nº ${pad(A.abierta.n)} para que pueda repetirla? (La nota, si la hay, también se quita.)`)) { const bt = writeBatch(db); const id = idTrabajo(A.abierta.k, g.id, A.abierta.n); bt.delete(doc(db, 'trabajos', id)); bt.delete(doc(db, 'notas', id)); await bt.commit(); pintarDetalle(); } }
      if (acc === 'pinReset') { const g = grupoSel(); if (confirm(`¿Reiniciar el PIN del nº ${pad(A.abierta.n)} de ${g.nombre}?\n\nLa próxima vez que entre con ese número podrá elegir un PIN nuevo.`)) { await deleteDoc(doc(db, 'pines', `${g.id}_${A.abierta.n}`)); alert('✔ PIN reiniciado.'); } }
      if (acc === 'pinesGrupo') {
        const gid = $('#apPinGrupo').value; const g = ps.grupos.get(gid); if (!g) return;
        const qs = await getDocs(collection(db, 'pines')); const L = qs.docs.filter((d) => d.id.startsWith(gid + '_'));
        if (!L.length) { $('#apPinMsg').textContent = 'Ese grupo no tiene PIN registrados.'; return; }
        if (!confirm(`¿Reiniciar ${L.length} PIN de ${g.nombre}?`)) return;
        await enLotes(L.map((d) => ({ db, fn: (bt) => bt.delete(d.ref) }))); $('#apPinMsg').textContent = `✔ ${L.length} PIN reiniciados.`;
      }
      if (acc === 'borrarCursoDatos') await borrarDatosCurso($('#apBorrarCurso').value);
    } catch (e) { alert('No se ha podido completar la acción (' + (e?.code || e?.message || 'error') + ').'); }
  }
  function onChange(ev) {
    const t = ev.target;
    if (t.dataset.apF === 'curso') { aula.elegirCurso(t.value); pintar(true); }
    if (t.dataset.apF === 'gGrupo') { A.gGrupo = t.value; A.abierta = null; pintar(); }
    if (t.dataset.apF === 'gAsig') { A.gAsig = t.value; A.abierta = null; pintar(); }
  }
  function onInput(ev) { if (ev.target.matches?.('.ap-rpts, .ap-qpts')) recalcular(); }
  function onSubmit(ev) {
    if (ev.target.id === 'apCursoForm') { ev.preventDefault(); guardarCurso(ev.target); return true; }
    if (ev.target.id === 'apNotaForm') { ev.preventDefault(); guardarNota(ev.target); return true; }
    return false;
  }
  function fuera() { A.sub = null; pararGrupo(); }
  return { render, pintar, parar: pararGrupo, fuera, onClick, onChange, onInput, onSubmit, limpiezaHTML };
}

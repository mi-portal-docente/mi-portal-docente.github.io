// «Trabajo de clase» y «Tablón» de cada asignatura, como en Google Classroom.
//  · Alumno: temas en el orden del profesor con lo publicado para su grupo, y el tablón de anuncios.
//  · Profesor: «+ Crear» (tarea, tarea de cuestionario, pregunta, material, reutilizar publicación, tema),
//    arrastrar y soltar elementos dentro de un tema, entre temas y los propios temas (con botones ↑ ↓
//    como alternativa de teclado), publicar / programar / borrador, e importar la estructura de Classroom.
import { collection, doc, getDocs, query, where, writeBatch, updateDoc, deleteDoc, setDoc, Timestamp } from 'firebase/firestore';
import { esc } from './util.js';
import { ic } from './ico.js';
import { asignatura, TIPOS, SEMILLAS, itemDeSemilla } from '../lms/biblioteca.js';
import { idItem, ordenEntre, leeEnlaces, categoriaDe, tipoAdjunto, urlSegura, fmtNota } from '../lms/modelo.js';
import { crearEditor, estadoPub, fFecha, PEND_T } from './aula-editor.js';
import { textoHTML } from './aula-vistas.js';
import { crearJson } from './aula-json.js';
import { crearBanco } from './aula-banco.js';

const icono = (tipo) => TIPOS[tipo]?.icon || '📄';
const nombreTipo = (tipo) => TIPOS[tipo]?.nombre || tipo;
const idTema = () => 't' + Array.from({ length: 12 }, () => 'abcdefghijkmnpqrstuvwxyz23456789'[Math.floor(Math.random() * 32)]).join('');
const opt = (v, t, sel) => `<option value="${esc(v)}" ${v === sel ? 'selected' : ''}>${esc(t)}</option>`;
async function enLotes(db, ops) { for (let i = 0; i < ops.length; i += 400) { const b = writeBatch(db); ops.slice(i, i + 400).forEach((f) => f(b)); await b.commit(); } }
// «2026/27» → «26/27» (los elementos de la semilla dicen en qué cursos estaban)
export const cursoCorto = (nombre) => { const m = String(nombre || '').match(/(\d{2})(\d{2})\/(\d{2})/); return m ? `${m[2]}/${m[3]}` : String(nombre || ''); };
// Fecha de la semilla («2026-10-27T23:59», hora de Madrid) → ms
const msDe = (s) => { if (!s) return null; const t = new Date(s).getTime(); return Number.isFinite(t) ? t : null; };

// Valida un archivo de importación (formato portal-docente/classroom@1).
export function validarSemilla(s) {
  if (!s || typeof s !== 'object') return 'El archivo no es un JSON válido.';
  if (s.formato !== 'portal-docente/classroom@1') return 'Formato desconocido: tiene que ser «portal-docente/classroom@1».';
  if (!asignatura(s.asignatura)) return `Asignatura desconocida: «${s.asignatura}».`;
  if (!Array.isArray(s.temas)) return 'Faltan los temas.';
  for (const t of s.temas) {
    if (!t || typeof t.nombre !== 'string' || !t.nombre.trim()) return 'Hay un tema sin nombre.';
    if (t.items && !Array.isArray(t.items)) return `El tema «${t.nombre}» tiene «items» mal escrito.`;
    for (const it of t.items || []) if (!it || typeof it.titulo !== 'string') return `Hay un elemento sin título en «${t.nombre}».`;
  }
  return null;
}

export function crearClase({ db, aula, rol, ses, estado }) {
  const st = aula.st; const prof = rol === 'profesor';
  // vista: 'organizacion' (profesor) · 'trabajo' · 'tablon'. Las pestañas las pinta la página de la asignatura.
  const C = { el: null, asig: null, vista: 'trabajo', filtro: null, drag: null, crear: false, modal: null, orgF: 'todo', verGrupo: null, verTab: 'tablon' };
  const gruposDe = (cursoId, asig) => [...st.grupos.values()].filter((g) => (!asig || (g.asignaturas || []).includes(asig)) && (g.curso ? g.curso === cursoId : true)).sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  const editor = prof ? crearEditor({ db, aula, gruposDe }) : null;
  const json = prof ? crearJson({ db, aula, modal: (h, f) => modal(h, f), cerrarModal: () => cerrarModal(), gruposDe }) : null;
  const banco = prof ? crearBanco({ db, aula, modal: (h, f) => modal(h, f), cerrarModal: () => cerrarModal(), gruposDe }) : null;
  if (editor) { editor.exportar = (it) => json.exportar(it); editor.desdeBanco = (asig, cb) => banco.elegir(asig, cb); }
  const curso = () => st.cursos.get(st.cursoSel) || null;
  const ahora = () => Date.now();

  // ------------------------------------------------------------------ datos
  function itemsAsig(asig) {
    const L = [...st.items.values()].filter((it) => it.asig === asig && (prof ? it.curso === st.cursoSel : !(it.pub && it.pub > ahora())));
    return L.sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0) || a.titulo.localeCompare(b.titulo, 'es', { numeric: true }));
  }
  function temasAsig(asig, items) {
    let L = [...st.temas.values()].filter((t) => t.asig === asig && (prof ? t.curso === st.cursoSel : true));
    if (!prof) { const usados = new Set(items.map((i) => i.tema)); L = L.filter((t) => usados.has(t.id)); }
    return L.sort((a, b) => a.orden - b.orden || a.nombre.localeCompare(b.nombre, 'es'));
  }
  function estructura(asig) {
    const items = itemsAsig(asig); const temas = temasAsig(asig, items); const ids = new Set(temas.map((t) => t.id));
    const sin = items.filter((it) => !it.tema || !ids.has(it.tema));
    return { items, temas, sin, de: (tid) => items.filter((it) => it.tema === tid) };
  }

  // ------------------------------------------------------------------ pintar
  function render(el, asig, vista = C.vista) {
    if (!el) return; if (C.el !== el || C.asig !== asig) { C.filtro = null; C.crear = false; }
    C.el = el; C.asig = asig; C.vista = !prof && vista === 'organizacion' ? 'tablon' : vista;
    if (!el.dataset.clOk) { el.dataset.clOk = '1'; el.addEventListener('click', onClick); el.addEventListener('change', onChange); el.addEventListener('submit', onSubmit); enlazarArrastre(el); el.addEventListener('keydown', onKey); }
    pintar();
  }
  function pintar() {
    const el = C.el; if (!el || !el.isConnected) return;
    if (el.contains(document.activeElement) && document.activeElement.matches('textarea, input[type=text], input:not([type])') && document.activeElement.value) return; // escribiendo un anuncio
    const abiertos = [...el.querySelectorAll('details.cl-mas[open]')].map((d) => d.closest('[data-item]')?.dataset.item);
    const v = C.vista;
    el.innerHTML = (prof ? barraCursoHTML() : '') + `<div class="cl-cuerpo">${v === 'organizacion' ? organizacionHTML() : v === 'tablon' ? (prof ? tablonProfHTML() : tablonAlumnoHTML()) : trabajoHTML()}</div>`;
    abiertos.forEach((id) => el.querySelector(`[data-item="${CSS.escape(id || '')}"] details.cl-mas`)?.setAttribute('open', ''));
  }
  // curso escolar que se está viendo (solo profesor; el activo por defecto)
  function barraCursoHTML() {
    const c = curso(); if (!c && st.listo.cursos) return '';
    const sel = st.cursos.size > 1 ? `<label class="cl-curso">Curso escolar <select data-cl-f="curso">${[...st.cursos.values()].sort((x, y) => y.nombre.localeCompare(x.nombre)).map((x) => opt(x.id, x.nombre + (x.activo ? ' (activo)' : ''), st.cursoSel)).join('')}</select></label>` : `<span class="cl-curso">Curso escolar <b>${esc(c?.nombre || '…')}</b></span>`;
    return `<div class="cl-cursobar">${sel}<span class="pn-grow"></span><a class="cl-link" href="#panel/notas">📊 Cuaderno de calificaciones</a></div>`;
  }
  function cargando() {
    if (st.error && !st.listo.items) return `<p class="au-vacio">No se puede cargar el trabajo de clase (${esc(st.error)}).</p>`;
    if (!st.listo.items || (prof && !st.listo.cursos)) return '<p class="au-small">Cargando el trabajo de clase…</p>';
    if (prof && !curso()) return '<p class="au-vacio">Todavía no hay un curso escolar. Créalo en el <a href="#panel/cursos">panel → Cursos escolares</a> y elige las asignaturas que impartes.</p>';
    return '';
  }

  // ---- Trabajo de clase
  function trabajoHTML() {
    const w = cargando(); if (w) return w;
    if (!prof) return trabajoAlumnoHTML(datosAlumno(null), false);
    const E = estructura(C.asig);
    const filtro = C.filtro && E.temas.some((t) => t.id === C.filtro) ? C.filtro : null;
    const bar = prof ? `<div class="cl-bar"><div class="cl-crear"><button class="btn primary cl-crear-b" data-cl="crear" aria-haspopup="true" aria-expanded="${C.crear}">＋ Crear</button>
        ${C.crear ? `<div class="cl-crear-m" role="menu">${[['tarea', 'Tarea'], ['examen', 'Tarea de cuestionario'], ['pregunta', 'Pregunta'], ['material', 'Material']].map(([t, n]) => `<button role="menuitem" data-cl="nuevo" data-tipo="${t}"><span>${icono(t)}</span>${n}</button>`).join('')}
          <hr><button role="menuitem" data-cl="reutilizar"><span>♻️</span>Reutilizar publicación</button><button role="menuitem" data-cl="nuevoTema"><span>🗂</span>Tema</button></div>` : ''}</div>
        <button class="btn" data-cl="importar">⬇ Importar de Classroom</button><button class="btn" data-cl="importarJSON">${ic('upload')} Importar JSON</button><button class="btn" data-cl="banco">${ic('archive')} Banco de preguntas</button><span class="pn-grow"></span>
        <span class="pn-small">${E.items.length} elementos · ${E.items.filter((i) => i.publicado).length} publicados · ${E.items.filter((i) => !i.publicado).length} borradores</span></div>` : '';
    if (!E.items.length && !E.temas.length) return bar + (prof
      ? `<div class="cl-vacio"><p>Aquí aparecerá el trabajo de clase de ${esc(asignatura(C.asig)?.corto || '')} en ${esc(curso().nombre)}.</p><p>Pulsa <b>⬇ Importar de Classroom</b> para cargar los temas y elementos que tenías en Classroom, o <b>＋ Crear</b> para empezar.</p></div>`
      : '<p class="au-vacio">Tu profesor todavía no ha publicado trabajo en esta asignatura.</p>');
    const lado = `<aside class="cl-lado"><button class="cl-lado-b ${filtro ? '' : 'on'}" data-cl="filtro" data-tema="">Todos los temas</button>${E.temas.map((t) => `<button class="cl-lado-b ${filtro === t.id ? 'on' : ''}" data-cl="filtro" data-tema="${esc(t.id)}">${esc(t.nombre)}</button>`).join('')}</aside>`;
    const sin = (!filtro && (E.sin.length || prof)) ? `<section class="cl-tema cl-sin" data-tema="">${prof ? '<header class="cl-th cl-th-sin"><h3>Sin tema</h3></header>' : ''}<div class="cl-items" data-lista="">${E.sin.map(itemHTML).join('') || (prof ? '<p class="cl-hueco">Arrastra aquí lo que no tenga tema.</p>' : '')}</div></section>` : '';
    const temas = E.temas.filter((t) => !filtro || t.id === filtro).map((t, i, L) => temaHTML(t, E.de(t.id), i, L.length)).join('');
    return bar + `<div class="cl-grid">${lado}<div class="cl-temas" data-temas>${sin}${temas}</div></div>`;
  }
  function temaHTML(t, items, i, n) {
    return `<section class="cl-tema" data-tema="${esc(t.id)}" id="tema-${esc(t.id)}">
      <header class="cl-th" ${prof ? 'draggable="true"' : ''} data-tema-h="${esc(t.id)}">${prof ? '<span class="cl-grip" title="Arrastra para mover el tema" aria-hidden="true">⠿</span>' : ''}<h3>${esc(t.nombre)}</h3>
      ${prof ? `<span class="cl-th-acts"><button class="btn tiny" data-cl="temaUp" ${i ? '' : 'disabled'} aria-label="Subir el tema">↑</button><button class="btn tiny" data-cl="temaDown" ${i < n - 1 ? '' : 'disabled'} aria-label="Bajar el tema">↓</button><button class="btn tiny" data-cl="temaRen">✏️ Cambiar nombre</button><button class="btn tiny pn-peligro" data-cl="temaDel" aria-label="Borrar el tema">🗑</button></span>` : ''}</header>
      <div class="cl-items" data-lista="${esc(t.id)}">${items.map(itemHTML).join('') || (prof ? '<p class="cl-hueco">Tema vacío: arrastra aquí elementos o usa ＋ Crear.</p>' : '')}</div></section>`;
  }
  function metaItem(it) {
    const m = [];
    if (it.tipo === 'examen' && it.examen?.hasta) m.push('Cierra ' + fFecha(it.examen.hasta));
    else if (it.fechaEntrega) m.push('Fecha de entrega: ' + fFecha(it.fechaEntrega));
    if (it.puntos) m.push(`${fmtNota(it.puntos)} puntos`);
    if (prof) m.push((it.grupos || []).length + ' grupo' + ((it.grupos || []).length === 1 ? '' : 's'));
    return m.join(' · ');
  }
  function itemHTML(it) {
    if (!prof) {
      const [k, t] = estado(it);
      return `<a class="cl-it" href="#trabajo/${esc(it.id)}" data-item="${esc(it.id)}"><span class="cl-ic t-${esc(it.tipo)}">${icono(it.tipo)}</span><span class="cl-tx"><b>${esc(it.titulo)}</b><span class="cl-meta">${esc(nombreTipo(it.tipo))}${metaItem(it) ? ' · ' + esc(metaItem(it)) : ''}</span></span>${t ? `<span class="au-est e-${k}">${esc(t)}</span>` : ''}</a>`;
    }
    const e = estadoPub(it);
    const temas = temasAsig(C.asig, []);
    return `<div class="cl-it ${e.k}" draggable="true" data-item="${esc(it.id)}" tabindex="0" aria-label="${esc(it.titulo)} (${esc(e.t)})">
      <span class="cl-grip" title="Arrastra para mover" aria-hidden="true">⠿</span><span class="cl-ic t-${esc(it.tipo)}">${icono(it.tipo)}</span>
      <span class="cl-tx"><a href="#trabajo/${esc(it.id)}" draggable="false"><b>${esc(it.titulo)}</b></a><span class="cl-meta">${esc(nombreTipo(it.tipo))}${metaItem(it) ? ' · ' + esc(metaItem(it)) : ''}</span></span>
      ${it.pendiente ? `<span class="cl-pend" title="${esc(it.nota || 'Faltan instrucciones o adjuntos')}">✎ ${PEND_T}</span>` : ''}<span class="cl-est e-${e.k}">${esc(e.t)}</span>
      <span class="cl-acts"><button class="btn tiny" data-cl="up" aria-label="Subir">↑</button><button class="btn tiny" data-cl="down" aria-label="Bajar">↓</button>
        <button class="btn tiny ${it.publicado ? '' : 'primary'}" data-cl="pub">${it.publicado ? '⏸ Retirar' : '📢 Publicar'}</button>
        <details class="cl-mas"><summary class="btn tiny" aria-label="Más acciones">⋮</summary><div class="cl-menu">
          <button data-cl="editar">✏️ Editar</button><button data-cl="renombrar">🔤 Cambiar el título</button>
          <label>Mover a <select data-cl-mover>${opt('', 'Sin tema', it.tema || '')}${temas.map((t) => opt(t.id, t.nombre, it.tema || '')).join('')}</select></label>
          <button data-cl="duplicar">⧉ Duplicar</button><button data-cl="exportarJSON">${ic('download')} Exportar JSON</button><button data-cl="borrar" class="pn-peligro">🗑 Borrar</button></div></details></span></div>`;
  }

  // ---- Organización (solo profesor): la visión completa de la asignatura, con borradores, pendientes y notas privadas
  function organizacionHTML() {
    const w = cargando(); if (w) return w;
    const E = estructura(C.asig); const ahoraT = ahora();
    const k = (it) => estadoPub(it, ahoraT).k;
    const n = { todo: E.items.length, borr: E.items.filter((i) => k(i) === 'borr').length, pend: E.items.filter((i) => i.pendiente).length, pub: E.items.filter((i) => k(i) === 'pub').length, prog: E.items.filter((i) => k(i) === 'prog').length };
    const gs = gruposDe(st.cursoSel, C.asig);
    const anuncios = [...st.anuncios.values()].filter((x) => x.asig === C.asig && x.curso === st.cursoSel).length;
    const filtroOk = (it) => C.orgF === 'todo' || (C.orgF === 'pend' ? it.pendiente : k(it) === C.orgF);
    const stat = (v, t, f) => `<div class="org-stat ${f ? 'e-' + f : ''}"><b>${v}</b><span>${t}</span></div>`;
    const acciones = `<div class="org-acts"><a class="btn primary" href="#asig/${esc(C.asig)}/trabajo">📚 Editar el trabajo de clase</a><button class="btn" data-cl="importar">⬇ Importar de Classroom</button><button class="btn" data-cl="importarJSON">${ic('upload')} Importar JSON</button><button class="btn" data-cl="reutilizar">♻️ Copiar de otro curso</button><a class="btn" href="#asig/${esc(C.asig)}/tablon">👁 Ver como alumno</a></div>`;
    const grupos = `<section class="org-box"><h3>👥 Grupos de ${esc(asignatura(C.asig)?.corto || '')} en ${esc(curso().nombre)}</h3>${gs.length ? `<ul class="org-grupos">${gs.map((g) => `<li><b>${esc(g.nombre)}</b><span class="pn-small">Código <code>${esc(g.codigo || '—')}</code> · ${Number(g.alumnos || 0)} alumnos</span></li>`).join('')}</ul>` : '<p class="pn-small">Todavía no hay grupos con esta asignatura.</p>'}<a class="cl-link" href="#panel/grupos">Gestionar grupos y códigos →</a></section>`;
    const fila = (it) => { const e = estadoPub(it, ahoraT); return `<li class="org-it ${e.k}" data-item="${esc(it.id)}"><span class="cl-ic t-${esc(it.tipo)}" aria-hidden="true">${icono(it.tipo)}</span>
      <span class="cl-tx"><a href="#trabajo/${esc(it.id)}"><b>${esc(it.titulo)}</b></a><span class="cl-meta">${esc(nombreTipo(it.tipo))}${metaItem(it) ? ' · ' + esc(metaItem(it)) : ''}</span>${it.nota ? `<span class="org-nota">🔒 Nota privada: ${esc(it.nota)}</span>` : ''}</span>
      ${it.pendiente ? `<span class="cl-pend">✎ ${PEND_T}</span>` : ''}<span class="cl-est e-${e.k}">${esc(e.t)}</span><button class="btn tiny" data-cl="editar">✏️ Editar</button></li>`; };
    const bloques = [...E.temas.map((t) => [t.nombre, E.de(t.id)]), ...(E.sin.length ? [['Sin tema', E.sin]] : [])]
      .map(([nom, L]) => { const F = L.filter(filtroOk); return F.length ? `<section class="org-tema"><h4>${esc(nom)} <span class="pn-small">${F.length}${F.length !== L.length ? ' de ' + L.length : ''}</span></h4><ul>${F.map(fila).join('')}</ul></section>` : ''; }).join('');
    const chips = [['todo', 'Todo'], ['borr', 'Borradores'], ['pend', 'Pendientes'], ['pub', 'Publicados'], ['prog', 'Programados']].map(([f, t]) => `<button class="bib-chip ${C.orgF === f ? 'on' : ''}" data-cl="orgF" data-f="${f}" aria-pressed="${C.orgF === f}">${t} <span>${n[f]}</span></button>`).join('');
    return `<div class="org">
      <div class="org-stats">${stat(n.todo, 'elementos')}${stat(n.pub, 'publicados', 'pub')}${stat(n.borr, 'borradores', 'borr')}${stat(n.prog, 'programados', 'prog')}${stat(n.pend, 'pendientes de completar', 'pend')}${stat(E.temas.length, 'temas')}${stat(anuncios, 'anuncios')}${stat(gs.length, gs.length === 1 ? 'grupo' : 'grupos')}</div>
      ${acciones}
      <div class="org-cols"><section class="org-box org-todo"><h3>🧭 Todo el contenido <span class="pn-small">(solo lo ves tú: incluye borradores, pendientes y notas privadas)</span></h3>
        <div class="org-chips" role="group" aria-label="Filtrar">${chips}</div>
        ${E.items.length ? bloques || '<p class="pn-small">Nada con este filtro.</p>' : `<div class="cl-vacio"><p>Aún no hay trabajo de clase en ${esc(curso().nombre)}. Pulsa <b>⬇ Importar de Classroom</b> para cargar la estructura de la biblioteca o crea elementos en <a href="#asig/${esc(C.asig)}/trabajo">Trabajo de clase</a>.</p></div>`}</section>
        <div class="org-side">${grupos}<section class="org-box"><h3>📊 Seguimiento</h3><p class="pn-small">Notas de tareas, cuestionarios, actividades y prácticas de laboratorio.</p><a class="cl-link" href="#panel/notas">Abrir el cuaderno de calificaciones →</a><br><a class="cl-link" href="#panel/entregas">Entregas del laboratorio →</a></section></div></div></div>`;
  }

  // ---- Lo que ve el alumno. Para el profesor es una VISTA PREVIA fiel de un grupo: solo lo publicado y ya
  // visible para ese grupo, sin borradores, notas privadas, pendientes ni soluciones, y sin enlaces de gestión.
  function datosAlumno(grupo) {
    const t = ahora(); const vis = (x) => !prof || !grupo || (x.visible || []).includes(grupo);
    const items = itemsAsig(C.asig).filter((it) => it.publicado && !(it.pub && it.pub > t) && vis(it));
    const ids = new Set(items.map((i) => i.tema));
    const temas = [...st.temas.values()].filter((x) => x.asig === C.asig && (!prof || x.curso === st.cursoSel) && ids.has(x.id)).sort((a, b) => a.orden - b.orden || a.nombre.localeCompare(b.nombre, 'es'));
    const anuncios = [...st.anuncios.values()].filter((a) => a.asig === C.asig && (!prof || a.curso === st.cursoSel) && !(a.pub && a.pub > t) && vis(a));
    return { items, temas, anuncios };
  }
  function filaAlumno(it, prev) {
    const [k, t] = prev ? ['', ''] : estado(it);
    const meta = [nombreTipo(it.tipo), it.tipo === 'examen' && it.examen?.hasta ? 'Cierra ' + fFecha(it.examen.hasta) : it.fechaEntrega ? 'Fecha de entrega: ' + fFecha(it.fechaEntrega) : '', it.puntos ? fmtNota(it.puntos) + ' puntos' : ''].filter(Boolean).join(' · ');
    const dentro = `<span class="cl-ic t-${esc(it.tipo)}" aria-hidden="true">${icono(it.tipo)}</span><span class="cl-tx"><b>${esc(it.titulo)}</b><span class="cl-meta">${esc(meta)}</span></span>${t ? `<span class="au-est e-${k}">${esc(t)}</span>` : ''}`;
    return prev ? `<div class="cl-it cl-prev-it" data-prev-item>${dentro}</div>` : `<a class="cl-it" href="#trabajo/${esc(it.id)}" data-item="${esc(it.id)}">${dentro}</a>`;
  }
  function trabajoAlumnoHTML(D, prev) {
    if (!D.items.length) return `<p class="au-vacio">${prev ? 'Este grupo todavía no ve nada publicado en esta asignatura.' : 'Tu profesor todavía no ha publicado trabajo en esta asignatura.'}</p>`;
    const ids = new Set(D.temas.map((t) => t.id)); const sin = D.items.filter((it) => !it.tema || !ids.has(it.tema));
    const filtro = !prev && C.filtro && D.temas.some((t) => t.id === C.filtro) ? C.filtro : null;
    const lado = prev ? '' : `<aside class="cl-lado"><button class="cl-lado-b ${filtro ? '' : 'on'}" data-cl="filtro" data-tema="">Todos los temas</button>${D.temas.map((t) => `<button class="cl-lado-b ${filtro === t.id ? 'on' : ''}" data-cl="filtro" data-tema="${esc(t.id)}">${esc(t.nombre)}</button>`).join('')}</aside>`;
    const sec = (nom, L, id) => `<section class="cl-tema" data-tema="${esc(id)}">${nom ? `<header class="cl-th"><h3>${esc(nom)}</h3></header>` : ''}<div class="cl-items">${L.map((it) => filaAlumno(it, prev)).join('')}</div></section>`;
    const temas = (filtro ? [] : sin.length ? [sec('', sin, '')] : []).concat(D.temas.filter((t) => !filtro || t.id === filtro).map((t) => sec(t.nombre, D.items.filter((it) => it.tema === t.id), t.id))).join('');
    return `<div class="cl-grid ${prev ? 'cl-grid-prev' : ''}">${lado}<div class="cl-temas">${temas}</div></div>`;
  }
  function proximasHTML(D) {
    const t = ahora(); const L = D.items.filter((it) => (it.fechaEntrega || it.examen?.hasta) > t).sort((a, b) => (a.fechaEntrega || a.examen?.hasta) - (b.fechaEntrega || b.examen?.hasta)).slice(0, 5);
    return `<aside class="cl-prox" aria-label="Próximas entregas"><h3>Próximas entregas</h3>${L.length ? `<ul>${L.map((it) => `<li><span class="pn-small">${esc(fFecha(it.fechaEntrega || it.examen.hasta))}</span><br>${esc(it.titulo)}</li>`).join('')}</ul>` : '<p class="pn-small">¡Bien! No hay nada para entregar pronto.</p>'}</aside>`;
  }
  function streamHTML(D, prev) {
    const L = [...D.anuncios.map((a) => ({ k: 'a', t: a.pub || a.fecha || 0, a })), ...D.items.map((it) => ({ k: 'i', t: it.pub || it.actualizado || 0, it }))].sort((x, y) => y.t - x.t).slice(0, 40);
    const lista = L.map((x) => x.k === 'a'
      ? `<article class="cl-post" data-anuncio="${esc(x.a.id)}"><div class="cl-post-h"><span class="cl-av" aria-hidden="true">📣</span><div><b>Profesor</b><div class="pn-small">${esc(fFecha(x.t))}</div></div></div><div class="cl-post-b">${textoHTML(x.a.texto)}</div>${adjuntosHTML(x.a.enlaces)}</article>`
      : (prev ? (h) => `<div class="cl-post cl-post-it cl-prev-it">${h}</div>` : (h) => `<a class="cl-post cl-post-it" href="#trabajo/${esc(x.it.id)}">${h}</a>`)(`<span class="cl-ic t-${esc(x.it.tipo)}" aria-hidden="true">${icono(x.it.tipo)}</span><div><b>${x.it.tipo === 'material' ? 'Nuevo material' : x.it.tipo === 'pregunta' ? 'Nueva pregunta' : 'Nueva tarea'}: ${esc(x.it.titulo)}</b><div class="pn-small">${esc(fFecha(x.t))}</div></div>`)).join('');
    return `<div class="cl-stream">${proximasHTML(D)}<div class="cl-tablon">${lista || '<p class="au-vacio">No hay anuncios todavía.</p>'}</div></div>`;
  }
  function tablonAlumnoHTML() { const w = cargando(); if (w) return w; return streamHTML(datosAlumno(null), false); }
  function tablonProfHTML() {
    const w = cargando(); if (w) return w;
    const gs = gruposDe(st.cursoSel, C.asig);
    if (!gs.some((g) => g.id === C.verGrupo)) C.verGrupo = gs[0]?.id || null;
    const form = `<form id="clAnuncio" class="cl-anuncio-f pn-form" autocomplete="off"><label class="pn-f">Anuncia algo a tu clase<textarea name="texto" rows="3" maxlength="5000" required placeholder="Escribe un aviso para tus alumnos…"></textarea></label>
      <label class="pn-f">Adjuntos (opcional, uno por línea: «Título | https://…»)<textarea name="enlaces" rows="2" maxlength="3000"></textarea></label>
      <div class="cl-an-g">Para: ${gs.map((g) => `<label class="pn-chk"><input type="checkbox" name="grupos" value="${esc(g.id)}" checked> ${esc(g.nombre)}</label>`).join('') || '<span class="pn-small">No hay grupos de esta asignatura en este curso.</span>'}</div>
      <div class="pn-acts"><button class="btn primary" type="submit" ${gs.length ? '' : 'disabled'}>📣 Publicar</button><span class="pn-msg" id="clAnMsg"></span></div></form>`;
    const mios = [...st.anuncios.values()].filter((a) => a.asig === C.asig && a.curso === st.cursoSel).sort((x, y) => (y.pub || y.fecha || 0) - (x.pub || x.fecha || 0));
    const misAnuncios = `<details class="org-box cl-misan"><summary>Tus anuncios (${mios.length})</summary>${mios.map((a) => `<div class="cl-misan-it" data-anuncio="${esc(a.id)}"><span>${esc(String(a.texto || '').slice(0, 90))}${String(a.texto || '').length > 90 ? '…' : ''}<br><span class="pn-small">${esc(fFecha(a.pub || a.fecha))} · ${esc((a.grupos || []).map((g) => st.grupos.get(g)?.nombre || g).join(', '))}</span></span><button class="btn tiny pn-peligro" data-cl="anDel" aria-label="Borrar el anuncio">🗑</button></div>`).join('') || '<p class="pn-small">Ninguno todavía.</p>'}</details>`;
    const D = datosAlumno(C.verGrupo);
    const prev = `<section class="cl-preview" aria-label="Vista previa del alumno"><div class="cl-preview-h"><span>👁 <b>Vista del alumno</b></span>
      ${gs.length ? `<label>Grupo <select data-cl-f="vergrupo">${gs.map((g) => opt(g.id, g.nombre, C.verGrupo)).join('')}</select></label>` : '<span class="pn-small">(sin grupos: lo publicado)</span>'}
      <span class="cl-preview-t" role="group" aria-label="Pantalla"><button class="${C.verTab === 'tablon' ? 'on' : ''}" aria-pressed="${C.verTab === 'tablon'}" data-cl="verTab" data-v="tablon">Tablón</button><button class="${C.verTab === 'trabajo' ? 'on' : ''}" aria-pressed="${C.verTab === 'trabajo'}" data-cl="verTab" data-v="trabajo">Trabajo de clase</button></span>
      <span class="pn-small cl-preview-n">${D.items.length} publicados visibles</span></div>
      <div class="cl-preview-b" data-preview>${C.verTab === 'trabajo' ? trabajoAlumnoHTML(D, true) : streamHTML(D, true)}</div></section>`;
    return `<div class="cl-tablon-prof"><div class="cl-tablon-izq">${form}${misAnuncios}</div>${prev}</div>`;
  }
  function adjuntosHTML(L) {
    if (!L?.length) return '';
    return `<div class="cl-adjs">${L.map((e) => { const t = tipoAdjunto(e.u); const interno = String(e.u).startsWith('#'); return `<a class="cl-adj-c" href="${esc(urlSegura(e.u))}" ${interno ? '' : 'target="_blank" rel="noopener noreferrer"'}><span class="cl-adj-ic">${t.ic}</span><span><b>${esc(e.t || e.u)}</b><span class="pn-small">${esc(t.t)}</span></span></a>`; }).join('')}</div>`;
  }

  // ------------------------------------------------------------------ mover (arrastrar, ↑ ↓, «Mover a»)
  function listaDe(temaId, excepto) { return itemsAsig(C.asig).filter((it) => (temaId ? it.tema === temaId : !it.tema || !st.temas.has(it.tema) || st.temas.get(it.tema).curso !== st.cursoSel) && it.id !== excepto); }
  async function moverItem(id, temaId, antesDe) {
    const it = st.items.get(id); if (!it) return;
    const L = listaDe(temaId || null, id);
    let i = antesDe ? L.findIndex((x) => x.id === antesDe) : L.length; if (i < 0) i = L.length;
    const orden = ordenEntre(L[i - 1]?.orden ?? null, L[i]?.orden ?? null);
    const tema = temaId || null;
    if ((it.tema || null) === tema && Math.abs((it.orden ?? 0) - orden) < 1e-9) return;
    it.tema = tema; it.orden = orden; pintar(); // optimista: se ve al momento
    try { await updateDoc(doc(db, 'items', id), { tema, orden, actualizado: Date.now() }); }
    catch (e) { alert('No se ha podido mover (' + (e?.code || 'error') + ').'); }
    if (Math.abs((L[i]?.orden ?? orden + 1) - orden) < 1e-6) renumerar(tema);
  }
  async function renumerar(temaId) {
    const L = listaDe(temaId, null); await enLotes(db, L.map((x, k) => (b) => b.update(doc(db, 'items', x.id), { orden: (k + 1) * 1000 })));
  }
  async function subirBajar(id, dir) {
    const it = st.items.get(id); if (!it) return;
    const E = estructura(C.asig); const tid = it.tema && E.temas.some((t) => t.id === it.tema) ? it.tema : null;
    const L = tid ? E.de(tid) : E.sin; const i = L.findIndex((x) => x.id === id);
    const orden = ['', ...E.temas.map((t) => t.id)]; const k = orden.indexOf(tid || '');
    if (dir < 0) {
      if (i > 0) return moverItem(id, tid, L[i - 1].id);
      if (k > 0) return moverItem(id, orden[k - 1] || null, null); // al final del tema anterior
    } else {
      if (i < L.length - 1) return moverItem(id, tid, L[i + 2]?.id || null);
      if (k < orden.length - 1) { const sig = orden[k + 1]; const L2 = E.de(sig); return moverItem(id, sig, L2[0]?.id || null); } // al principio del siguiente
    }
  }
  async function moverTema(id, antesDe) {
    const L = temasAsig(C.asig, []).filter((t) => t.id !== id);
    let i = antesDe ? L.findIndex((t) => t.id === antesDe) : L.length; if (i < 0) i = L.length;
    const orden = ordenEntre(L[i - 1]?.orden ?? null, L[i]?.orden ?? null);
    const t = st.temas.get(id); if (!t) return; t.orden = orden; pintar();
    try { await updateDoc(doc(db, 'temas', id), { orden }); } catch (e) { alert('No se ha podido mover el tema (' + (e?.code || 'error') + ').'); }
  }
  function enlazarArrastre(el) {
    const limpiar = () => el.querySelectorAll('.cl-drop-antes, .cl-drop-fin, .cl-drop-tema').forEach((x) => x.classList.remove('cl-drop-antes', 'cl-drop-fin', 'cl-drop-tema'));
    el.addEventListener('dragstart', (ev) => {
      if (!prof) return;
      const th = ev.target.closest?.('[data-tema-h]'); const it = ev.target.closest?.('.cl-it[data-item]');
      if (th) C.drag = { k: 'tema', id: th.dataset.temaH }; else if (it) C.drag = { k: 'item', id: it.dataset.item }; else return;
      ev.dataTransfer.effectAllowed = 'move'; try { ev.dataTransfer.setData('text/plain', C.drag.id); } catch (e) { }
      (th ? th.closest('.cl-tema') : it).classList.add('cl-arrastrando');
    });
    el.addEventListener('dragend', () => { C.drag = null; limpiar(); el.querySelectorAll('.cl-arrastrando').forEach((x) => x.classList.remove('cl-arrastrando')); });
    const destino = (ev) => {
      if (!C.drag) return null;
      if (C.drag.k === 'item') {
        const lista = ev.target.closest?.('.cl-tema')?.querySelector('.cl-items'); if (!lista) return null;
        const filas = [...lista.querySelectorAll('.cl-it[data-item]')].filter((x) => x.dataset.item !== C.drag.id);
        const antes = filas.find((f) => { const r = f.getBoundingClientRect(); return ev.clientY < r.top + r.height / 2; });
        return { lista, antes, tema: lista.dataset.lista };
      }
      const cont = el.querySelector('[data-temas]'); if (!cont || !cont.contains(ev.target)) return null;
      const secs = [...cont.querySelectorAll('.cl-tema[data-tema]:not(.cl-sin)')].filter((x) => x.dataset.tema !== C.drag.id);
      const antes = secs.find((s) => { const r = s.getBoundingClientRect(); return ev.clientY < r.top + Math.min(r.height / 2, 40); });
      return { antes, secs };
    };
    el.addEventListener('dragover', (ev) => {
      const d = destino(ev); if (!d) return; ev.preventDefault(); ev.dataTransfer.dropEffect = 'move'; limpiar();
      if (C.drag.k === 'item') { if (d.antes) d.antes.classList.add('cl-drop-antes'); else d.lista.classList.add('cl-drop-fin'); }
      else if (d.antes) d.antes.classList.add('cl-drop-tema'); else d.secs[d.secs.length - 1]?.classList.add('cl-drop-fin');
    });
    el.addEventListener('drop', (ev) => {
      const d = destino(ev); if (!d) return; ev.preventDefault(); const g = C.drag; limpiar(); C.drag = null;
      if (g.k === 'item') moverItem(g.id, d.tema || null, d.antes?.dataset.item || null);
      else moverTema(g.id, d.antes?.dataset.tema || null);
    });
  }
  function onKey(ev) {
    // Alternativa de teclado: Alt + ↑ / ↓ sobre un elemento lo mueve
    const it = ev.target.closest?.('.cl-it[data-item]'); if (!prof || !it || !ev.altKey) return;
    if (ev.key === 'ArrowUp' || ev.key === 'ArrowDown') { ev.preventDefault(); const id = it.dataset.item; subirBajar(id, ev.key === 'ArrowUp' ? -1 : 1).then(() => C.el.querySelector(`[data-item="${CSS.escape(id)}"]`)?.focus()); }
  }

  // ------------------------------------------------------------------ temas
  async function nuevoTema() {
    const nombre = (prompt('Nombre del tema nuevo:', '') || '').trim().slice(0, 200); if (!nombre) return;
    const L = temasAsig(C.asig, []); const id = idTema();
    // Classroom pone el tema nuevo arriba del todo
    await setDoc(doc(db, 'temas', id), { curso: st.cursoSel, asig: C.asig, nombre, orden: L.length ? L[0].orden - 1000 : 1000 });
  }
  async function renombrarTema(t) {
    const nombre = (prompt('Nuevo nombre del tema:', t.nombre) || '').trim().slice(0, 200); if (!nombre || nombre === t.nombre) return;
    await updateDoc(doc(db, 'temas', t.id), { nombre });
  }
  async function borrarTema(t) {
    const L = listaDe(t.id, null);
    if (!confirm(`¿Borrar el tema «${t.nombre}»?${L.length ? `\n\nSus ${L.length} elementos NO se borran: pasan a «Sin tema».` : ''}`)) return;
    await enLotes(db, [...L.map((x) => (b) => b.update(doc(db, 'items', x.id), { tema: null, actualizado: Date.now() })), (b) => b.delete(doc(db, 'temas', t.id))]);
  }

  // ------------------------------------------------------------------ elementos
  async function publicar(it) {
    if (!it.publicado && !(it.grupos || []).length) { const gs = gruposDe(it.curso, it.asig).map((g) => g.id); if (!gs.length) { alert('No hay grupos de esta asignatura en este curso: créalos en el panel → «Grupos y códigos».'); return; } it = { ...it, grupos: gs }; }
    if (!it.publicado && it.tipo === 'examen' && !(it.examen?.n > 0)) { alert('Este cuestionario no tiene preguntas todavía. Edítalo para añadirlas.'); return; }
    const pub = !it.publicado; const b = writeBatch(db);
    b.update(doc(db, 'items', it.id), { publicado: pub, grupos: it.grupos, visible: pub ? it.grupos : [], pub: null, actualizado: Date.now() });
    if (it.tipo === 'examen') b.update(doc(db, 'examenes', it.id), { publicado: pub, grupos: it.grupos });
    await b.commit(); aula.olvidarExamen(it.id);
  }
  async function borrar(it) {
    if (!confirm(`¿Borrar «${it.titulo}»?\n\nLas entregas y notas que tenga se quedan en «Calificaciones» hasta que las borres en «Limpieza».`)) return;
    const b = writeBatch(db); b.delete(doc(db, 'items', it.id)); if (it.tipo === 'examen') { b.delete(doc(db, 'examenes', it.id)); b.delete(doc(db, 'claves', it.id)); } await b.commit();
  }
  async function copiar(it, destino = {}) {
    const id = idItem(); const b = writeBatch(db);
    const datos = Object.fromEntries(Object.entries(it).filter(([k]) => k !== 'id'));
    b.set(doc(db, 'items', id), { ...datos, curso: destino.curso || it.curso, tema: destino.tema !== undefined ? destino.tema : it.tema ?? null, titulo: (destino.titulo || it.titulo).slice(0, 150), orden: destino.orden ?? (it.orden ?? 0) + 0.5, grupos: destino.grupos || it.grupos || [], publicado: false, visible: [], pub: null, actualizado: Date.now() });
    if (it.tipo === 'examen') { const { examen, claves } = await aula.examen(it.id, { claves: true }); if (examen) b.set(doc(db, 'examenes', id), { ...examen, desde: Timestamp.fromMillis(examen.desde), hasta: Timestamp.fromMillis(examen.hasta), grupos: destino.grupos || examen.grupos || [], publicado: false }); b.set(doc(db, 'claves', id), claves || { respuestas: {} }); }
    await b.commit(); return id;
  }
  async function renombrar(it) {
    const t = (prompt('Nuevo título:', it.titulo) || '').trim().slice(0, 150); if (!t || t === it.titulo) return;
    await updateDoc(doc(db, 'items', it.id), { titulo: t, actualizado: Date.now() });
  }

  // ------------------------------------------------------------------ ventanas (importar, reutilizar)
  function modal(html, onAccion) {
    cerrarModal();
    const m = document.createElement('div'); m.className = 'cl-modal'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true');
    m.innerHTML = `<div class="cl-dlg cl-dlg-s">${html}</div>`;
    m.addEventListener('click', (ev) => { if (ev.target === m || ev.target.closest('[data-m=cerrar]')) return cerrarModal(); const b = ev.target.closest('[data-m]'); if (b) onAccion(b.dataset.m, b, m); });
    m.addEventListener('change', (ev) => onAccion('change', ev.target, m));
    m.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') cerrarModal(); });
    document.body.appendChild(m); C.modal = m; document.body.classList.add('cl-modal-abierto'); return m;
  }
  function cerrarModal() { C.modal?.remove(); C.modal = null; if (!editor?.abierto()) document.body.classList.remove('cl-modal-abierto'); }

  function importar(asig = C.asig) {
    const c = curso(); if (!c) { alert('Primero crea el curso escolar.'); return; }
    let semilla = SEMILLAS[asig];
    const resumen = (s) => { const cc = cursoCorto(c.nombre); const temas = (s.temas || []).filter((t) => !t.cursos || t.cursos.includes(cc)); const its = temas.flatMap((t) => (t.items || []).filter((it) => !it.cursos || it.cursos.includes(cc))); return `<b>${temas.length}</b> temas y <b>${its.length}</b> elementos para ${esc(c.nombre)} (${its.filter((i) => i.estado === 'borrador').length} borradores; ${its.filter((i) => i.instrucciones || i.enlaces?.length).length} con contenido).`; };
    const html = () => `<header class="cl-dlg-h"><h3>⬇ Importar de Classroom · ${esc(asignatura(asig)?.corto || asig)}</h3><span class="pn-grow"></span><button class="btn" data-m="cerrar" aria-label="Cerrar">✕</button></header>
      <div class="cl-dlg-b1"><p>Crea en <b>${esc(c.nombre)}</b> los temas (mismo nombre y orden que en Classroom) y sus elementos. Lo que ya esté importado no se duplica.</p>
      <p class="cl-imp-res" id="clImpRes">${resumen(semilla)}</p>
      <label class="pn-f">Origen<select data-m-f="origen"><option value="semilla">Copia de Classroom incluida en el portal (curso 26/27)</option><option value="archivo">Archivo JSON exportado (formato portal-docente/classroom@1)…</option></select></label>
      <input type="file" accept="application/json,.json" data-m-f="archivo" hidden>
      <label class="pn-chk"><input type="checkbox" data-m-f="publicar" checked> Publicar para los grupos lo que en Classroom está publicado</label>
      <p class="pn-small">Los <b>borradores</b> de Classroom se quedan en <b>borrador</b> (los alumnos no los ven). Se respeta el estado de cada elemento; lo que en la copia de Classroom no tiene instrucciones ni adjuntos lleva el aviso «✎ Pendiente de completar» (solo lo ves tú) para que lo rellenes con el editor. Grupos: ${esc(gruposDe(c.id, asig).map((g) => g.nombre).join(', ') || 'ninguno todavía (se importará todo como borrador)')}.</p>
      <div class="pn-acts"><button class="btn primary" data-m="importar">⬇ Importar</button><button class="btn" data-m="cerrar">Cancelar</button><span class="pn-msg" id="clImpMsg"></span></div></div>`;
    modal(html(), async (acc, b, m) => {
      const msg = m.querySelector('#clImpMsg');
      if (acc === 'change' && b.dataset.mF === 'origen') { if (b.value === 'archivo') m.querySelector('[data-m-f=archivo]').click(); else { semilla = SEMILLAS[asig]; m.querySelector('#clImpRes').innerHTML = resumen(semilla); } }
      if (acc === 'change' && b.dataset.mF === 'archivo' && b.files?.[0]) {
        try { const s = JSON.parse(await b.files[0].text()); const e = validarSemilla(s); if (e) throw new Error(e); if (s.asignatura !== asig) throw new Error(`Ese archivo es de «${asignatura(s.asignatura)?.corto}», no de esta asignatura.`); semilla = s; m.querySelector('#clImpRes').innerHTML = '📄 ' + esc(b.files[0].name) + ': ' + resumen(s); msg.textContent = ''; }
        catch (er) { msg.textContent = '❌ ' + (er.message || 'Archivo no válido'); msg.className = 'pn-msg ko'; }
      }
      if (acc === 'importar') {
        b.disabled = true; msg.textContent = 'Importando…'; msg.className = 'pn-msg';
        try { const r = await importarSemilla(semilla, { curso: c, publicar: m.querySelector('[data-m-f=publicar]').checked }); msg.textContent = `✔ ${r.temas} temas y ${r.items} elementos nuevos (${r.publicados} publicados, ${r.items - r.publicados} en borrador)${r.saltados ? ` · ${r.saltados} ya estaban` : ''}.`; msg.className = 'pn-msg ok'; b.textContent = '✔ Hecho'; }
        catch (er) { b.disabled = false; msg.textContent = '❌ No se ha podido importar (' + (er?.code || er?.message || 'error') + ').'; msg.className = 'pn-msg ko'; }
      }
    });
  }
  // Importa una semilla en un curso escolar. Idempotente: temas por nombre, elementos por «origen».
  async function importarSemilla(s, { curso: c, publicar = true }) {
    const asig = s.asignatura; const cc = cursoCorto(c.nombre); const grupos = gruposDe(c.id, asig).map((g) => g.id);
    const temasHay = [...st.temas.values()].filter((t) => t.curso === c.id && t.asig === asig);
    const origenes = new Set([...st.items.values()].filter((x) => x.curso === c.id && x.asig === asig).map((x) => x.origen).filter(Boolean));
    const ops = []; const r = { temas: 0, items: 0, publicados: 0, saltados: 0 };
    let ordenT = temasHay.length ? Math.max(...temasHay.map((t) => t.orden)) : 0;
    for (const [ti, t0] of s.temas.entries()) {
      const t = { ...t0, id: t0.id || 't' + ti };
      if (t.cursos && !t.cursos.includes(cc)) continue;
      let temaId = null;
      if (!t.sinTema) {
        const ya = temasHay.find((x) => x.nombre.trim() === t.nombre.trim()) || [...st.temas.values()].find((x) => x.curso === c.id && x.asig === asig && x.origen === `${asig}:${t.id}`);
        if (ya) temaId = ya.id;
        else { temaId = idTema(); ordenT += 1000; const datos = { curso: c.id, asig, nombre: t.nombre.slice(0, 200), orden: ordenT, origen: `${asig}:${t.id || t.nombre}`.slice(0, 120) }; ops.push((b) => b.set(doc(db, 'temas', temaId), datos)); st.temas.set(temaId, { id: temaId, ...datos }); r.temas++; }
      }
      (t.items || []).forEach((raw0, i) => {
        const raw = { ...raw0, id: raw0.id || `${t.id}.${String(i + 1).padStart(2, '0')}` };
        if (raw.cursos && !raw.cursos.includes(cc)) return;
        const x = itemDeSemilla(asig, t, raw); const origen = `${asig}:${x.id.slice(asig.length + 1)}`.slice(0, 120);
        if (origenes.has(origen)) { r.saltados++; return; }
        const esEx = x.tipo === 'examen' && Array.isArray(raw.preguntas) && raw.preguntas.length;
        const tipo = x.tipo === 'examen' && !esEx ? 'cuestionario' : x.tipo;
        const pub = msDe(raw.programadoPara);
        const publicado = publicar && grupos.length > 0 && x.estado !== 'borrador';
        const id = idItem(); const entregable = tipo !== 'material';
        const texto = x.texto || '';
        const datos = { curso: c.id, asig, tema: temaId, tipo, titulo: x.titulo, texto: texto.slice(0, 20000), enlaces: x.enlaces.slice(0, 20).map((e) => ({ t: String(e.t).slice(0, 120), u: String(e.u).slice(0, 500) })),
          fechaEntrega: entregable ? msDe(x.fechaEntrega) : null, puntos: entregable ? (x.puntos ?? null) : null, rubrica: entregable ? x.rubrica.slice(0, 20) : [], categoria: categoriaDe(tipo), opciones: tipo === 'pregunta' ? (x.opciones || []).slice(0, 10) : null,
          grupos, visible: publicado ? grupos : [], publicado, pub: publicado && x.estado === 'programado' && pub ? pub : null, orden: (i + 1) * 1000, origen, pendiente: !!x.pendiente, nota: x.nota ? String(x.nota).slice(0, 2000) : null,
          examen: esEx ? { desde: msDe(raw.desde) || Date.now(), hasta: msDe(raw.hasta) || Date.now() + 7 * 864e5, limiteMin: raw.limiteMin || null, n: raw.preguntas.length } : null, actualizado: Date.now() };
        if (esEx) {
          datos.publicado = false; datos.visible = [];
          const qs = raw.preguntas.map((q, k) => ({ id: q.id || 'q' + k, tipo: q.tipo, enunciado: String(q.enunciado || ''), puntos: q.puntos || 1, ...(q.tipo === 'test' ? { opciones: q.opciones || [] } : {}) }));
          ops.push((b) => b.set(doc(db, 'examenes', id), { grupos, publicado: false, desde: Timestamp.fromMillis(datos.examen.desde), hasta: Timestamp.fromMillis(datos.examen.hasta), limiteMin: datos.examen.limiteMin, barajar: true, preguntas: qs }));
          ops.push((b) => b.set(doc(db, 'claves', id), { respuestas: Object.fromEntries(raw.preguntas.map((q, k) => [q.id || 'q' + k, q.correcta ?? null])) }));
        }
        ops.push((b) => b.set(doc(db, 'items', id), datos)); r.items++; if (datos.publicado) r.publicados++;
      });
    }
    await enLotes(db, ops); return r;
  }

  function reutilizar(asig = C.asig) {
    const c = curso(); if (!c) return;
    const fuentes = [['biblio', 'Biblioteca (estructura de Classroom)'], ...[...st.cursos.values()].filter((x) => x.id !== c.id).map((x) => ['c:' + x.id, 'Curso ' + x.nombre])];
    let lista = []; let fuente = 'biblio';
    const cargar = async () => {
      if (fuente === 'biblio') lista = asignatura(asig).unidades.flatMap((u) => u.items.map((x) => ({ k: 'b', id: x.id, titulo: x.titulo, tipo: x.tipo, grupo: u.titulo, x })));
      else { const qs = await getDocs(query(collection(db, 'items'), where('curso', '==', fuente.slice(2)))); const tem = new Map((await getDocs(query(collection(db, 'temas'), where('curso', '==', fuente.slice(2))))).docs.map((d) => [d.id, d.data().nombre]));
        lista = qs.docs.map((d) => ({ id: d.id, ...d.data() })).filter((x) => x.asig === asig).map((x) => ({ k: 'c', id: x.id, titulo: x.titulo, tipo: x.tipo, grupo: tem.get(x.tema) || 'Sin tema', it: x })); }
    };
    const listaHTML = () => { const g = new Map(); lista.forEach((x) => { if (!g.has(x.grupo)) g.set(x.grupo, []); g.get(x.grupo).push(x); }); return [...g.entries()].map(([n, L]) => `<fieldset class="cl-reu-g"><legend>${esc(n)}</legend>${L.map((x) => `<label class="pn-chk"><input type="checkbox" data-reu="${esc(x.id)}"> ${icono(x.tipo)} ${esc(x.titulo)}</label>`).join('')}</fieldset>`).join('') || '<p class="pn-small">No hay nada que reutilizar aquí.</p>'; };
    const temas = temasAsig(asig, []);
    const html = () => `<header class="cl-dlg-h"><h3>♻️ Reutilizar publicación</h3><span class="pn-grow"></span><button class="btn" data-m="cerrar" aria-label="Cerrar">✕</button></header>
      <div class="cl-dlg-b1"><div class="ap-fila"><label class="pn-f">De<select data-m-f="fuente">${fuentes.map(([v, t]) => opt(v, t, fuente)).join('')}</select></label>
      <label class="pn-f">Al tema<select data-m-f="tema">${opt('', 'Sin tema', '')}${temas.map((t) => opt(t.id, t.nombre, '')).join('')}</select></label></div>
      <div class="cl-reu" id="clReu">${listaHTML()}</div>
      <p class="pn-small">Se copian como <b>borrador</b> en ${esc(c.nombre)}: revísalos y publícalos.</p>
      <div class="pn-acts"><button class="btn primary" data-m="reutilizar">♻️ Reutilizar</button><button class="btn" data-m="cerrar">Cancelar</button><span class="pn-msg" id="clReuMsg"></span></div></div>`;
    cargar().then(() => {
      modal(html(), async (acc, b, m) => {
        if (acc === 'change' && b.dataset.mF === 'fuente') { fuente = b.value; await cargar(); m.querySelector('#clReu').innerHTML = listaHTML(); }
        if (acc === 'reutilizar') {
          const ids = [...m.querySelectorAll('[data-reu]:checked')].map((x) => x.dataset.reu); const msg = m.querySelector('#clReuMsg');
          if (!ids.length) { msg.textContent = 'Marca al menos uno.'; msg.className = 'pn-msg ko'; return; }
          const tema = m.querySelector('[data-m-f=tema]').value || null; const grupos = gruposDe(c.id, asig).map((g) => g.id);
          b.disabled = true; let n = 0; const base = Math.min(0, ...listaDe(tema, null).map((x) => x.orden ?? 0)) - 1000 * ids.length;
          for (const id of ids) {
            const x = lista.find((y) => y.id === id); if (!x) continue;
            if (x.k === 'c') await copiar(x.it, { curso: c.id, tema, grupos, orden: base + n * 1000 });
            else { const s = x.x; const tipo = s.tipo === 'examen' ? 'cuestionario' : s.tipo; await setDoc(doc(db, 'items', idItem()), { curso: c.id, asig, tema, tipo, titulo: s.titulo, texto: s.texto || '', enlaces: s.enlaces, fechaEntrega: null, puntos: tipo === 'material' ? null : s.puntos ?? null, rubrica: s.rubrica || [], categoria: categoriaDe(tipo), opciones: null, grupos, visible: [], publicado: false, pub: null, orden: base + n * 1000, origen: `${asig}:${s.id.slice(asig.length + 1)}`, pendiente: !!s.pendiente, nota: s.nota ? String(s.nota).slice(0, 2000) : null, examen: null, actualizado: Date.now() }); }
            n++;
          }
          msg.textContent = `✔ ${n} elemento${n === 1 ? '' : 's'} copiado${n === 1 ? '' : 's'} como borrador.`; msg.className = 'pn-msg ok';
        }
      });
    });
  }

  // ------------------------------------------------------------------ eventos
  async function onClick(ev) {
    const b = ev.target.closest('[data-cl]'); if (!b) { if (C.crear && !ev.target.closest('.cl-crear')) { C.crear = false; pintar(); } return; }
    const acc = b.dataset.cl; const it = st.items.get(b.closest('[data-item]')?.dataset.item || ''); const t = st.temas.get(b.closest('[data-tema]')?.dataset.tema || '');
    try {
      if (acc === 'filtro') { C.filtro = b.dataset.tema || null; pintar(); return; }
      if (!prof) return;
      if (acc === 'orgF') { C.orgF = b.dataset.f; pintar(); return; }
      if (acc === 'verTab') { C.verTab = b.dataset.v; pintar(); return; }
      if (acc === 'crear') { C.crear = !C.crear; pintar(); if (C.crear) C.el.querySelector('.cl-crear-m button')?.focus(); return; }
      C.crear = false;
      if (acc === 'nuevo') { pintar(); editor.abrir(null, { tipo: b.dataset.tipo, asig: C.asig, curso: st.cursoSel, tema: C.filtro || null }); return; }
      if (acc === 'nuevoTema') { pintar(); return nuevoTema(); }
      if (acc === 'reutilizar') { pintar(); return reutilizar(); }
      if (acc === 'importar') return importar();
      if (acc === 'banco') return banco.abrir(C.asig);
      if (acc === 'importarJSON') return json.importar({ curso: st.cursoSel, asig: C.asig, tema: C.filtro || null, temas: temasAsig(C.asig, []) });
      if (acc === 'temaUp' || acc === 'temaDown') { const L = temasAsig(C.asig, []); const i = L.findIndex((x) => x.id === t.id); return moverTema(t.id, acc === 'temaUp' ? L[i - 1]?.id : L[i + 2]?.id || null); }
      if (acc === 'temaRen' && t) return renombrarTema(t);
      if (acc === 'temaDel' && t) return borrarTema(t);
      if (acc === 'anDel') { const id = b.closest('[data-anuncio]').dataset.anuncio; if (confirm('¿Borrar este anuncio?')) await deleteDoc(doc(db, 'anuncios', id)); return; }
      if (!it) return;
      if (acc === 'up' || acc === 'down') return subirBajar(it.id, acc === 'up' ? -1 : 1);
      if (acc === 'pub') { b.disabled = true; return await publicar(it); }
      if (acc === 'editar') return editor.abrir(it);
      if (acc === 'renombrar') return renombrar(it);
      if (acc === 'duplicar') return copiar(it, { titulo: it.titulo + ' (copia)' });
      if (acc === 'exportarJSON') { b.closest('details')?.removeAttribute('open'); return json.exportar(it); }
      if (acc === 'borrar') return borrar(it);
    } catch (e) { alert('No se ha podido completar la acción (' + (e?.code || e?.message || 'error') + ').'); }
  }
  function onChange(ev) {
    const t = ev.target;
    if (t.dataset.clF === 'curso') { aula.elegirCurso(t.value); pintar(); }
    if (t.dataset.clF === 'vergrupo') { C.verGrupo = t.value; pintar(); }
    if (t.matches('[data-cl-mover]')) { const id = t.closest('[data-item]').dataset.item; moverItem(id, t.value || null, null); }
  }
  async function onSubmit(ev) {
    if (ev.target.id !== 'clAnuncio') return; ev.preventDefault();
    const f = ev.target; const fd = new FormData(f); const msg = f.querySelector('#clAnMsg');
    const texto = String(fd.get('texto') || '').trim().slice(0, 5000); const grupos = fd.getAll('grupos').map(String);
    if (!texto || !grupos.length) { msg.textContent = 'Escribe el aviso y marca al menos un grupo.'; msg.className = 'pn-msg ko'; return; }
    msg.textContent = 'Publicando…'; msg.className = 'pn-msg';
    try { await setDoc(doc(db, 'anuncios', idItem()), { curso: st.cursoSel, asig: C.asig, texto, enlaces: leeEnlaces(fd.get('enlaces'), 10), grupos, visible: grupos, fecha: Date.now(), pub: null }); f.reset(); pintar(); }
    catch (e) { msg.textContent = '❌ No se ha podido publicar (' + (e?.code || 'error') + ').'; msg.className = 'pn-msg ko'; }
  }
  window.addEventListener('portal-aula', () => { if (C.el?.isConnected && !C.drag) pintar(); });
  return { render, pintar, importar, reutilizar, importarSemilla, json, editar: (id) => { const it = st.items.get(id); if (it && editor) editor.abrir(it); }, editor, adjuntosHTML, datosAlumno, get vista() { return C.vista; } };
}

// «Trabajo de clase» y «Tablón» de cada asignatura, como en Google Classroom.
//  · Alumno: temas en el orden del profesor con lo publicado para su grupo, y el tablón de anuncios.
//  · Profesor: «+ Crear» (tarea, tarea de cuestionario, pregunta, material, reutilizar publicación, tema),
//    arrastrar y soltar elementos dentro de un tema, entre temas y los propios temas (con botones ↑ ↓
//    como alternativa de teclado), publicar / programar / borrador, e importar la estructura de Classroom.
import { collection, doc, getDoc, getDocs, query, where, writeBatch, updateDoc, deleteDoc, setDoc, Timestamp, limit } from 'firebase/firestore';
import { confirmar, pedirTexto, avisar } from './dialogo.js';
import { exportarEvidencias } from './evidencias.js';
import { esc } from './util.js';
import { ic } from './ico.js';
import { asignatura, TIPOS, SEMILLAS, itemDeSemilla } from '../lms/biblioteca.js';
import { idItem, ordenEntre, leeEnlaces, categoriaDe, tipoAdjunto, urlSegura, fmtNota, visibleAlDe } from '../lms/modelo.js';
import { crearEditor, estadoPub, fFecha, PEND_T } from './aula-editor.js';
import { textoHTML } from './aula-vistas.js';
import { crearJson } from './aula-json.js';
import { crearBanco } from './aula-banco.js';
import { crearDirectoProfe } from './directo.js';
import { subirArchivo } from './archivos.js';
import { IDS_ELEMENTO, seccionDe, seccionesDe, seccionesActivas } from '../lms/secciones.js';
import { carasHTML } from './caras-ui.js';
import { crearGestionSecciones } from './secciones-ui.js';
import { crearExportar } from './exportar-ui.js';
import { matriculaAsigHTML, iniciarMatricula } from './matricula-ui.js';

const icono = (tipo) => TIPOS[tipo]?.icon || '📄';
const TIPOS_ENTREGA_EV = (it) => it.tipo !== 'material' && it.tipo !== 'info';
const nombreTipo = (tipo) => TIPOS[tipo]?.nombre || tipo;
const idTema = () => 't' + Array.from({ length: 12 }, () => 'abcdefghijkmnpqrstuvwxyz23456789'[Math.floor(Math.random() * 32)]).join('');
const opt = (v, t, sel) => `<option value="${esc(v)}" ${v === sel ? 'selected' : ''}>${esc(t)}</option>`;
const aLocalCl = (t) => { const d = new Date(t); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16); };
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
  // vista: 'trabajo' · 'tablon' («organizacion» se unió a «trabajo»). Las pestañas las pinta la página de la asignatura.
  const C = { el: null, asig: null, vista: 'trabajo', filtro: null, drag: null, crear: false, modal: null, orgF: 'todo', verGrupo: null, verTab: 'tablon' };
  if (prof) iniciarMatricula(db);
  const gruposDe = (cursoId, asig) => [...st.grupos.values()].filter((g) => (!asig || (g.asignaturas || []).includes(asig)) && (g.curso ? g.curso === cursoId : true)).sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  const editor = prof ? crearEditor({ db, aula, gruposDe }) : null;
  const json = prof ? crearJson({ db, aula, modal: (h, f) => modal(h, f), cerrarModal: () => cerrarModal(), gruposDe }) : null;
  const banco = prof ? crearBanco({ db, aula, modal: (h, f) => modal(h, f), cerrarModal: () => cerrarModal(), gruposDe, pdf: (o) => exportar.pdfPreguntas(o) }) : null;
  const directo = prof ? crearDirectoProfe({ db, aula, gruposDe }) : null;
  if (editor) { editor.exportar = (it) => json.exportar(it); editor.desdeBanco = (asig, cb) => banco.elegir(asig, cb); }
  const curso = () => st.cursos.get(st.cursoSel) || null;
  const exportar = prof ? crearExportar({ db, aula, modal: (h, f) => modal(h, f), cerrarModal: () => cerrarModal() }) : null;
  const gestionSec = prof ? crearGestionSecciones({ db, aula, pintar: () => pintar(), asig: () => C.asig, items: () => itemsAsig(C.asig), temas: () => temasAsig(C.asig, []),
    extra: () => { const its = itemsAsig(C.asig); return { grupos: gruposDe(st.cursoSel, C.asig).map((g) => ({ nombre: g.nombre, codigo: g.codigo, alumnos: g.alumnos })), asig: asignatura(C.asig)?.corto || '', curso: curso()?.nombre || '',
      calificables: its.filter((it) => !['material', 'info', 'explicacion'].includes(it.tipo)).length, elementos: its.length }; } }) : null;
  const ahora = () => Date.now();
  // Plegado de temas: se recuerda en este navegador por usuario y asignatura. No se escribe en Firestore.
  const idPlegado = (tid) => tid || '_sin';
  const ambitoPlegar = () => { try { return (typeof window !== 'undefined' && window.PORTAL?.ambito?.()) || 'x'; } catch (e) { return 'x'; } };
  const clavePlegar = () => `portal.temasPlegados:${ambitoPlegar()}:${C.asig || ''}:${prof ? (st.cursoSel || '') : ''}`;
  const mapaPlegados = () => { try { const o = JSON.parse(localStorage.getItem(clavePlegar()) || '{}'); return o && typeof o === 'object' && !Array.isArray(o) ? o : {}; } catch (e) { return {}; } };
  const estaPlegado = (tid) => !!mapaPlegados()[idPlegado(tid)];
  const guardarPlegados = (o) => { try { localStorage.setItem(clavePlegar(), JSON.stringify(o)); } catch (e) { /* modo privado */ } };
  const fijarPlegado = (tid, v) => { const o = mapaPlegados(); const k = idPlegado(tid); if (v) o[k] = true; else delete o[k]; guardarPlegados(o); };
  const plegarTodos = (ids, v) => { guardarPlegados(v ? Object.fromEntries(ids.map((id) => [idPlegado(id), true])) : {}); };
  let dragFin = 0;
  function chevronPlegar(tid, nombre) {
    const plegado = estaPlegado(tid);
    const acc = plegado ? 'Desplegar' : 'Plegar';
    const label = nombre ? `${acc} «${nombre}»` : `${acc} «Sin tema»`;
    return `<button type="button" class="cl-th-chev" data-cl="temaPlegar" aria-expanded="${plegado ? 'false' : 'true'}" aria-label="${esc(label)}">${ic('chevron-down')}</button>`;
  }
  function cuerpoTemaHTML(inner) { return `<div class="cl-tema-cuerpo"><div class="cl-tema-cuerpo-in">${inner}</div></div>`; }
  function plegarBarraHTML(ids) {
    if (!ids.length) return '';
    return `<div class="cl-plegar-todo" role="group" aria-label="Plegar o desplegar los temas"><button type="button" class="btn tiny" data-cl="plegarTodos">${ic('chevron-right')} Plegar todo</button><button type="button" class="btn tiny" data-cl="desplegarTodos">${ic('chevron-down')} Desplegar todo</button></div>`;
  }


  // ------------------------------------------------------------------ datos
  function itemsAsig(asig) {
    const L = [...st.items.values()].filter((it) => it.asig === asig && !it.papelera && (prof ? it.curso === st.cursoSel : !(it.pub && it.pub > ahora())));
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
    C.el = el; C.asig = asig; C.vista = vista === 'organizacion' ? (prof ? 'trabajo' : 'tablon') : vista === 'avisos' ? 'tablon' : vista;
    if (!el.dataset.clOk) { el.dataset.clOk = '1'; el.addEventListener('click', onClick); el.addEventListener('toggle', (e) => { const d = e.target; const k = d?.dataset?.clSet; if (!k) return; const [c, id] = k.split(':'); if (id === undefined) { C[c] = d.open; return; } C[c] = C[c] || new Set(); d.open ? C[c].add(id) : C[c].delete(id); }, true); el.addEventListener('change', onChange); el.addEventListener('submit', onSubmit); enlazarArrastre(el); el.addEventListener('keydown', onKey); el.addEventListener('toggle', (e) => { if (e.target.matches?.('[data-sg-det]')) gestionSec?.toggle(e.target.open); }, true); }
    pintar();
  }
  function pintar() {
    const el = C.el; if (!el || !el.isConnected) return;
    if (el.contains(document.activeElement) && document.activeElement.matches('textarea, input[type=text], input:not([type])') && document.activeElement.value) return; // escribiendo un anuncio
    const abiertos = [...el.querySelectorAll('details.cl-mas[open]')].map((d) => d.closest('[data-item]')?.dataset.item);
    const v = C.vista;
    // v5: 'tablon' (Avisos) · una sección (teoria, clase, tareas…) · 'gestion' (profesor) · 'trabajo' (sin secciones)
    const sec = IDS_ELEMENTO.includes(v) ? v : null; const gest = v === 'gestion' && prof;
    el.innerHTML = (prof ? barraCursoHTML() : '') + `<div class="cl-cuerpo">${v === 'tablon' ? (prof ? tablonProfHTML() : tablonAlumnoHTML()) : gest ? gestionHTML() : trabajoHTML(sec)}</div>` + (prof && (v === 'trabajo' || gest) ? papeleraHTML() : '');
    abiertos.forEach((id) => el.querySelector(`[data-item="${CSS.escape(id || '')}"] details.cl-mas`)?.setAttribute('open', ''));
  }
  // P1 · Papelera: lo «borrado» del curso abierto se guarda aquí (sin publicar) y se puede restaurar.
  function papeleraHTML() {
    const L = [...st.items.values()].filter((it) => it.papelera && it.asig === C.asig && it.curso === st.cursoSel);
    if (!L.length) return '';
    return `<details class="cl-papelera"><summary>${ic('trash')} Papelera (${L.length})</summary><p class="pn-small">Los elementos de la papelera no los ven los alumnos. Sus entregas y notas se conservan en el «Cuaderno de calificaciones». Se eliminan del todo solo con la «Limpieza» del curso, una vez cerrado.</p>
      <ul class="cl-pap-l">${L.map((it) => `<li data-item="${esc(it.id)}"><span>${icono(it.tipo)} ${esc(it.titulo)}</span><button class="btn small" data-cl="restaurar">${ic('undo-2')} Restaurar</button></li>`).join('')}</ul></details>`;
  }
  // curso escolar que se está viendo (solo profesor; el activo por defecto)
  function barraCursoHTML() {
    const c = curso(); if (!c && st.listo.cursos) return '';
    const sel = st.cursos.size > 1 ? `<label class="cl-curso">Curso escolar <select data-cl-f="curso">${[...st.cursos.values()].sort((x, y) => y.nombre.localeCompare(x.nombre)).map((x) => opt(x.id, x.nombre + (x.activo ? ' (activo)' : ''), st.cursoSel)).join('')}</select></label>` : `<span class="cl-curso">Curso escolar <b>${esc(c?.nombre || '…')}</b></span>`;
    const notas = C.vista === 'gestion' ? '' : `<a class="cl-link" href="#panel/notas">${ic('clipboard-list')} Cuaderno de calificaciones</a>`;
    return `<div class="cl-cursobar">${sel}<span class="pn-grow"></span>${notas}</div>`;
  }
  function cargando() {
    if (st.error && !st.listo.items) return `<p class="au-vacio">No se puede cargar el trabajo de clase (${esc(st.error)}).</p>`;
    if (!st.listo.items || (prof && !st.listo.cursos)) return '<p class="au-small">Cargando el trabajo de clase…</p>';
    if (prof && !curso()) return '<p class="au-vacio">Todavía no hay un curso escolar. Créalo en el <a href="#panel/cursos">panel → Cursos escolares</a> y elige las asignaturas que impartes.</p>';
    return '';
  }

  // ---- Sustituir los adjuntos de Drive (del colegio) por archivos guardados en el portal: se emparejan por nombre
  const ES_DRIVE = /^https:\/\/(drive\.google\.com\/(file|open)|docs\.google\.com\/(document|presentation|spreadsheets))/i;
  const baseNom = (t) => String(t || '').replace(/\.[a-z0-9]{2,5}$/i, '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '');
  const nDrive = (L) => L.reduce((a, it) => a + (it.enlaces || []).filter((e) => ES_DRIVE.test(e.u)).length, 0);
  async function sustituirDrive(files) {
    const items = itemsAsig(C.asig).filter((it) => !it.papelera);
    const destino = new Map(); // base → [{it, i}]
    for (const it of items) (it.enlaces || []).forEach((e, i) => { if (ES_DRIVE.test(e.u)) { const k = baseNom(e.t); if (k) { if (!destino.has(k)) destino.set(k, []); destino.get(k).push({ it, i }); } } });
    const usar = []; const sinPareja = [];
    for (const f of files) { const L = destino.get(baseNom(f.name)); if (L) usar.push([f, L]); else sinPareja.push(f.name); }
    const usados = new Set(usar.map(([f]) => baseNom(f.name)));
    const quedan = [...destino.keys()].filter((k) => !usados.has(k)).map((k) => destino.get(k)[0].it.enlaces[destino.get(k)[0].i].t);
    const nAdj = usar.reduce((a, [, L]) => a + L.length, 0); const nIt = new Set(usar.flatMap(([, L]) => L.map((x) => x.it.id))).size;
    if (!usar.length) { await avisar(`Ningún archivo coincide por nombre con un adjunto de Drive.${sinPareja.length ? `\n\nSin pareja: ${sinPareja.join(', ')}` : ''}`); return; }
    if (!await confirmar(`Se van a subir ${usar.length} archivo(s) al portal y sustituir ${nAdj} adjunto(s) de Drive en ${nIt} elemento(s).${sinPareja.length ? `\n\nSin pareja (no se suben): ${sinPareja.join(', ')}` : ''}${quedan.length ? `\n\nSeguirán en Drive: ${quedan.join(', ')}` : ''}\n\n¿Continuar?`)) return;
    const msg = (t) => { const m = C.el.querySelector('[data-cl-sust-msg]') || Object.assign(document.createElement('p'), { className: 'pn-msg' }); m.dataset.clSustMsg = '1'; m.textContent = t; if (!m.isConnected) C.el.querySelector('.cl-bar')?.after(m); };
    const nuevos = new Map(); // itemId → enlaces
    try {
      for (const [n, [f, L]] of usar.entries()) {
        msg(`Subiendo ${n + 1}/${usar.length}: ${f.name}…`);
        const r = await subirArchivo(db, f, { asig: C.asig, curso: st.cursoSel, origen: L[0].it.enlaces[L[0].i].u });
        for (const { it, i } of L) { const E = nuevos.get(it.id) || (it.enlaces || []).map((e) => ({ ...e })); E[i] = { t: r.nombre, u: r.u }; nuevos.set(it.id, E); }
      }
      await enLotes(db, [...nuevos].map(([id, enlaces]) => (b) => b.update(doc(db, 'items', id), { enlaces })));
      msg(`Hecho: ${usar.length} archivo(s) subidos y ${nAdj} adjunto(s) sustituidos en ${nIt} elemento(s).${quedan.length ? ` Siguen en Drive: ${quedan.length}.` : ''}`);
      window.__sustDrive = { subidos: usar.length, adjuntos: nAdj, elementos: nIt, sinPareja, quedan };
    } catch (e) { msg('Se ha parado: ' + (e?.code === 'permission-denied' ? 'faltan las reglas nuevas (archivos).' : e?.message || 'error') + (nuevos.size ? ' Los archivos ya subidos no se han enlazado todavía: vuelve a intentarlo.' : '')); }
  }
  // ---- Lo que antes estaba en la pestaña «Organización», ahora dentro de «Trabajo de clase»
  function filtroEstado() { const t = ahora(); return (it) => C.orgF === 'todo' || (C.orgF === 'pend' ? !!it.pendiente : estadoPub(it, t).k === C.orgF); }
  function chipsEstadoHTML(E) {
    const t = ahora(); const k = (it) => estadoPub(it, t).k;
    const n = { todo: E.items.length, borr: E.items.filter((i) => k(i) === 'borr').length, pend: E.items.filter((i) => i.pendiente).length, pub: E.items.filter((i) => k(i) === 'pub').length, prog: E.items.filter((i) => k(i) === 'prog').length };
    return `<div class="org-chips" role="group" aria-label="Filtrar por estado">${[['todo', 'Todo'], ['pub', 'Publicados'], ['borr', 'Borradores'], ['prog', 'Programados'], ['pend', 'Pendientes de completar']].map(([f, tx]) => `<button class="bib-chip ${C.orgF === f ? 'on' : ''}" data-cl="orgF" data-f="${f}" aria-pressed="${C.orgF === f}">${tx} <span>${n[f]}</span></button>`).join('')}</div>`;
  }
  // Matrícula por asignatura (PIP-11 C): «Alumnos de esta asignatura» de un grupo; se mantiene abierto al repintar.
  const matriculaDetHTML = (g) => `<details class="mt-det" data-cl-set="mtAb:${esc(g.id)}" ${(C.mtAb || new Set()).has(g.id) ? 'open' : ''}><summary class="btn tiny">${ic('user-check')} Alumnos de esta asignatura</summary>${matriculaAsigHTML(g, C.asig)}</details>`;
  function matriculaGestionHTML() {
    const gs = gruposDe(st.cursoSel, C.asig); if (!gs.length) return '';
    return `<h2 class="gs-h">${ic('users')} Alumnos de esta asignatura</h2><p class="pn-small">Por defecto todos los nº de lista de la clase están de alta. Aquí puedes dar de baja a un nº solo en ${esc(asignatura(C.asig)?.corto || 'esta asignatura')} (sigue entrando en las demás con su código y PIN).</p><ul class="org-grupos mt-grupos">${gs.map((g) => `<li><b>${esc(g.nombre)}</b> <span class="pn-small">${Number(g.alumnos || 0)} alumnos</span>${matriculaDetHTML(g)}</li>`).join('')}</ul>`;
  }
  function gruposSeguimientoHTML() {
    const gs = gruposDe(st.cursoSel, C.asig);
    return `<details class="cl-org-extra" data-cl-set="orgAb" ${C.orgAb ? 'open' : ''}><summary>${ic('users')} Grupos y seguimiento <span class="pn-small">${gs.length} ${gs.length === 1 ? 'grupo' : 'grupos'}</span></summary><div class="org-cols2">
      <section class="org-box"><h3>Grupos de ${esc(asignatura(C.asig)?.corto || '')} en ${esc(curso().nombre)}</h3>${gs.length ? `<ul class="org-grupos">${gs.map((g) => `<li><b>${esc(g.nombre)}</b><span class="pn-small">Código <code>${esc(g.codigo || '—')}</code> · ${Number(g.alumnos || 0)} alumnos</span>
        ${matriculaDetHTML(g)}</li>`).join('')}</ul>` : '<p class="pn-small">Todavía no hay grupos con esta asignatura.</p>'}<a class="cl-link" href="#panel/grupos">Grupos y códigos →</a></section>
      <section class="org-box"><h3>Seguimiento</h3><p class="pn-small">Notas de tareas, cuestionarios, actividades y prácticas de laboratorio.</p><a class="cl-link" href="#panel/notas">Abrir el cuaderno de calificaciones →</a><br><a class="cl-link" href="#panel/entregas">Entregas del laboratorio →</a></section></div></details>`;
  }
  // ---- Trabajo de clase
  // v5 · Gestión del profesor: lo que antes estaba en «Trabajo de clase» (todo junto, con filtros por estado,
  // grupos y seguimiento, papelera), más la configuración de las secciones y la exportación.
  function gestionHTML() {
    const w = cargando(); if (w) return w;
    return gestionSec.html(C.asig) + matriculaGestionHTML() + `<h2 class="gs-h">${ic('folder-open')} Contenido de la asignatura</h2>` + trabajoHTML(null, true);
  }
  // Nombre de la sección en esta asignatura
  const nomSec = (sec) => seccionesDe(st.secConf, C.asig).find((s) => s.id === sec)?.nombre || sec;
  function trabajoHTML(sec = null, gestion = !sec) {
    const w = cargando(); if (w) return w;
    if (!prof) { const D = datosAlumno(null); if (sec) { D.items = D.items.filter((it) => seccionDe(it) === sec); const ids = new Set(D.items.map((i) => i.tema)); D.temas = D.temas.filter((t) => ids.has(t.id)); } return trabajoAlumnoHTML(D, false, sec); }
    const E = estructura(C.asig);
    if (sec) { const L = E.items.filter((it) => seccionDe(it) === sec); const ids = new Set(L.map((i) => i.tema)); E.items = L; E.temas = E.temas.filter((t) => ids.has(t.id)); E.sin = E.sin.filter((it) => seccionDe(it) === sec); E.de = ((de) => (tid) => de(tid).filter((it) => seccionDe(it) === sec))(E.de); }
    const filtro = C.filtro && E.temas.some((t) => t.id === C.filtro) ? C.filtro : null;
    const bar = prof ? `<div class="cl-bar"><div class="cl-crear"><button class="btn primary cl-crear-b" data-cl="crear" aria-haspopup="true" aria-expanded="${C.crear}">＋ Crear</button>
        ${C.crear ? `<div class="cl-crear-m" role="menu">${[['tarea', 'Tarea'], ['examen', 'Tarea de cuestionario'], ['pregunta', 'Pregunta'], ['material', 'Material']].map(([t, n]) => `<button role="menuitem" data-cl="nuevo" data-tipo="${t}"><span>${icono(t)}</span>${n}</button>`).join('')}
          <hr><button role="menuitem" data-cl="reutilizar"><span>♻️</span>Reutilizar publicación</button><button role="menuitem" data-cl="nuevoTema"><span>🗂</span>Tema</button></div>` : ''}</div>
        ${gestion ? `${C.vista !== 'gestion' ? `<button class="btn" data-cl="importar">${ic('download')} Importar de Classroom</button><button class="btn" data-cl="importarJSON">${ic('upload')} Importar JSON</button>` : ''}<button class="btn" data-cl="banco">${ic('archive')} Banco de preguntas</button><button class="btn" data-cl="directo">${ic('radio')} Pregunta en directo</button>${nDrive(E.items) ? `<button class="btn" data-cl="sustDrive" title="Sube los archivos (PDF, imágenes…) y sustituyen a los enlaces de Drive con el mismo nombre">${ic('upload')} Sustituir adjuntos de Drive <span class="pn-small">(${nDrive(E.items)})</span></button><input type="file" data-cl-sust multiple hidden>` : ''}` : `<span class="pn-small cl-sec-n">${E.items.length} en ${esc(nomSec(sec))}</span>`}<span class="pn-grow"></span>
        </div>${gestion ? chipsEstadoHTML(E) : ''}` : '';
    if (sec && !E.items.length) return bar + `<div class="cl-vacio"><p>Todavía no hay nada en «${esc(nomSec(sec))}».</p><p>Pulsa <b>＋ Crear</b> o cambia la sección de un elemento al editarlo (en «Gestión» está todo junto).</p></div>`;
    if (!E.items.length && !E.temas.length) return bar + (prof
      ? `<div class="cl-vacio"><p>Aquí aparecerá el trabajo de clase de ${esc(asignatura(C.asig)?.corto || '')} en ${esc(curso().nombre)}.</p><p>Pulsa <b>⬇ Importar de Classroom</b> para cargar los temas y elementos que tenías en Classroom, o <b>＋ Crear</b> para empezar.</p></div>`
      : '<p class="au-vacio">Tu profesor todavía no ha publicado trabajo en esta asignatura.</p>');
    const lado = `<aside class="cl-lado"><button class="cl-lado-b ${filtro ? '' : 'on'}" data-cl="filtro" data-tema="">Todos los temas</button>${E.temas.map((t) => `<button class="cl-lado-b ${filtro === t.id ? 'on' : ''}" data-cl="filtro" data-tema="${esc(t.id)}">${esc(t.nombre)}</button>`).join('')}</aside>`;
    // filtro por estado (antes en «Organización»): con un filtro puesto solo se ven los temas que tienen algo
    const fe = gestion && C.orgF !== 'todo'; const okE = gestion ? filtroEstado() : () => true;
    const sinL = E.sin.filter(okE);
    const sin = (!filtro && (sinL.length || (prof && !fe))) ? `<section class="cl-tema cl-sin${estaPlegado('') && prof ? ' is-plegado' : ''}" data-tema="">${prof ? `<header class="cl-th cl-th-sin" data-cl="temaPlegar" aria-expanded="${estaPlegado('') ? 'false' : 'true'}">${chevronPlegar('', 'Sin tema')}<h3>Sin tema</h3></header>` : ''}${cuerpoTemaHTML(`<div class="cl-items" data-lista="">${sinL.map(itemHTML).join('') || (prof ? '<p class="cl-hueco">Arrastra aquí lo que no tenga tema.</p>' : '')}</div>`)}</section>` : '';
    const temas = E.temas.filter((t) => !filtro || t.id === filtro).map((t, i, L) => { const I = E.de(t.id).filter(okE); return fe && !I.length ? '' : temaHTML(t, I, i, L.length); }).join('');
    const idsPlegar = [
      ...((!filtro && prof && (sinL.length || !fe)) ? [''] : []),
      ...E.temas.filter((t) => !filtro || t.id === filtro).filter((t) => !(fe && !E.de(t.id).filter(okE).length)).map((t) => t.id),
    ];
    return bar + plegarBarraHTML(idsPlegar) + `<div class="cl-grid">${lado}<div class="cl-temas" data-temas>${sin}${temas || (fe && !sin ? '<p class="pn-small">Nada con este filtro.</p>' : '')}</div></div>` + (gestion && C.vista !== 'gestion' ? gruposSeguimientoHTML() : '');
  }
  function temaHTML(t, items, i, n) {
    const plegado = estaPlegado(t.id);
    return `<section class="cl-tema${plegado ? ' is-plegado' : ''}" data-tema="${esc(t.id)}" id="tema-${esc(t.id)}">
      <header class="cl-th" ${prof ? 'draggable="true"' : ''} data-tema-h="${esc(t.id)}" data-cl="temaPlegar" aria-expanded="${plegado ? 'false' : 'true'}">${chevronPlegar(t.id, t.nombre)}${prof ? '<span class="cl-grip" title="Arrastra para mover el tema" aria-hidden="true">⠿</span>' : ''}<h3>${esc(t.nombre)}</h3>
      ${prof ? `<span class="cl-th-acts"><button class="btn tiny" data-cl="temaUp" ${i ? '' : 'disabled'} aria-label="Subir el tema">↑</button><button class="btn tiny" data-cl="temaDown" ${i < n - 1 ? '' : 'disabled'} aria-label="Bajar el tema">↓</button><button class="btn tiny" data-cl="temaRen">✏️ Cambiar nombre</button><button class="btn tiny pn-peligro" data-cl="temaDel" aria-label="Borrar el tema">🗑</button></span>` : ''}</header>
      ${cuerpoTemaHTML(`<div class="cl-items" data-lista="${esc(t.id)}">${items.map(itemHTML).join('') || (prof ? '<p class="cl-hueco">Tema vacío: arrastra aquí elementos o usa ＋ Crear.</p>' : '')}</div>`)}</section>`;
  }
  function metaItem(it) {
    const m = [];
    if (it.tipo === 'examen' && it.examen?.hasta) m.push('Cierra ' + fFecha(it.examen.hasta));
    else if (it.fechaEntrega) m.push('Fecha de entrega: ' + fFecha(it.fechaEntrega));
    if (it.puntos) m.push(`${fmtNota(it.puntos)} puntos`);
    if (it.tipo === 'recuperacion' && (it.para || []).length && prof) m.push('Solo nº ' + it.para.join(', '));
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
      <span class="cl-tx"><a href="#trabajo/${esc(it.id)}" draggable="false"><b>${esc(it.titulo)}</b></a><span class="cl-meta">${esc(nombreTipo(it.tipo))}${metaItem(it) ? ' · ' + esc(metaItem(it)) : ''}</span>${it.nota ? `<span class="org-nota" title="${esc(it.nota)}">🔒 Nota privada: ${esc(it.nota)}</span>` : ''}${IDS_ELEMENTO.includes(C.vista) ? carasHTML(it) : ''}</span>
      ${it.pendiente ? `<span class="cl-pend" title="${esc(it.nota || 'Faltan instrucciones o adjuntos')}">✎ ${PEND_T}</span>` : ''}<span class="cl-est e-${e.k}">${esc(e.t)}</span>
      <span class="cl-acts"><button class="btn tiny" data-cl="up" aria-label="Subir">↑</button><button class="btn tiny" data-cl="down" aria-label="Bajar">↓</button>
        <button class="btn tiny ${it.publicado ? '' : 'primary'}" data-cl="pub">${it.publicado ? '⏸ Retirar' : '📢 Publicar'}</button>
        <details class="cl-mas"><summary class="btn tiny" aria-label="Más acciones">⋮</summary><div class="cl-menu">
          <button data-cl="editar">✏️ Editar</button><button data-cl="renombrar">🔤 Cambiar el título</button>
          <label>Mover a <select data-cl-mover>${opt('', 'Sin tema', it.tema || '')}${temas.map((t) => opt(t.id, t.nombre, it.tema || '')).join('')}</select></label>
          <button data-cl="duplicar">⧉ Duplicar</button><button data-cl="duplicarEn">${ic('copy-plus')} Duplicar en otro grupo o curso…</button><button data-cl="exportarJSON">${ic('download')} Exportar JSON</button>${it.tipo === 'examen' ? `<button data-cl="pdfCuestionario">${ic('file-down')} PDF (enunciado y soluciones)</button>` : ''}${TIPOS_ENTREGA_EV(it) ? `<button data-cl="evidencias">${ic('download')} Exportar evidencias (reclamaciones)</button>` : ''}<button data-cl="borrar" class="pn-peligro">🗑 Mover a la papelera</button></div></details></span></div>`;
  }

  // ---- Lo que ve el alumno. Para el profesor es una VISTA PREVIA fiel de un grupo: solo lo publicado y ya
  // visible para ese grupo, sin borradores, notas privadas, pendientes ni soluciones, y sin enlaces de gestión.
  function datosAlumno(grupo) {
    const t = ahora(); const vis = (x) => !prof || !grupo || (x.visible || []).includes(grupo) || (x.tipo === 'recuperacion' && x.publicado && (x.grupos || []).includes(grupo));
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
    if (prev) return `<div class="cl-it cl-prev-it" data-prev-item>${dentro}</div>`;
    const caras = IDS_ELEMENTO.includes(C.vista) ? carasHTML(it) : '';
    return caras ? `<div class="cl-fila"><a class="cl-it" href="#trabajo/${esc(it.id)}" data-item="${esc(it.id)}">${dentro}</a>${caras}</div>` : `<a class="cl-it" href="#trabajo/${esc(it.id)}" data-item="${esc(it.id)}">${dentro}</a>`;
  }
  function trabajoAlumnoHTML(D, prev, secId = null) {
    if (!D.items.length) return `<p class="au-vacio">${prev ? 'Este grupo todavía no ve nada publicado en esta asignatura.' : secId ? `Todavía no hay nada en «${esc(nomSec(secId))}».` : 'Tu profesor todavía no ha publicado trabajo en esta asignatura.'}</p>`;
    const ids = new Set(D.temas.map((t) => t.id)); const sin = D.items.filter((it) => !it.tema || !ids.has(it.tema));
    const filtro = !prev && C.filtro && D.temas.some((t) => t.id === C.filtro) ? C.filtro : null;
    const lado = prev ? '' : `<aside class="cl-lado"><button class="cl-lado-b ${filtro ? '' : 'on'}" data-cl="filtro" data-tema="">Todos los temas</button>${D.temas.map((t) => `<button class="cl-lado-b ${filtro === t.id ? 'on' : ''}" data-cl="filtro" data-tema="${esc(t.id)}">${esc(t.nombre)}</button>`).join('')}</aside>`;
    const sec = (nom, L, id) => {
      const plegado = !!(nom && estaPlegado(id));
      const cab = nom ? `<header class="cl-th" data-cl="temaPlegar" aria-expanded="${plegado ? 'false' : 'true'}">${chevronPlegar(id, nom)}<h3>${esc(nom)}</h3></header>` : '';
      return `<section class="cl-tema${plegado ? ' is-plegado' : ''}" data-tema="${esc(id)}">${cab}${cuerpoTemaHTML(`<div class="cl-items">${L.map((it) => filaAlumno(it, prev)).join('')}</div>`)}</section>`;
    };
    const visibles = D.temas.filter((t) => !filtro || t.id === filtro);
    const temas = (filtro ? [] : sin.length ? [sec('', sin, '')] : []).concat(visibles.map((t) => sec(t.nombre, D.items.filter((it) => it.tema === t.id), t.id))).join('');
    return plegarBarraHTML(visibles.map((t) => t.id)) + `<div class="cl-grid ${prev ? 'cl-grid-prev' : ''}">${lado}<div class="cl-temas">${temas}</div></div>`;
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
      <div class="cl-an-prog"><label class="pn-chk"><input type="checkbox" name="programar"> ${ic('alarm-clock')} Programar para</label><input type="datetime-local" name="pubAn" value="${esc(aLocalCl(Date.now() + 864e5))}" aria-label="Fecha y hora de publicación del aviso"></div>
      <div class="pn-acts"><button class="btn primary" type="submit" ${gs.length ? '' : 'disabled'}>📣 Publicar</button><span class="pn-msg" id="clAnMsg"></span></div></form>`;
    const mios = [...st.anuncios.values()].filter((a) => a.asig === C.asig && a.curso === st.cursoSel).sort((x, y) => (y.pub || y.fecha || 0) - (x.pub || x.fecha || 0));
    const misAnuncios = `<details class="org-box cl-misan"><summary>Tus anuncios (${mios.length})</summary>${mios.map((a) => `<div class="cl-misan-it" data-anuncio="${esc(a.id)}"><span>${esc(String(a.texto || '').slice(0, 90))}${String(a.texto || '').length > 90 ? '…' : ''}<br><span class="pn-small">${a.pub && a.pub > Date.now() ? `<span class="cl-an-progr">${ic('alarm-clock')} Programado · </span>` : ''}${esc(fFecha(a.pub || a.fecha))} · ${esc((a.grupos || []).map((g) => st.grupos.get(g)?.nombre || g).join(', '))}</span></span><button class="btn tiny pn-peligro" data-cl="anDel" aria-label="Borrar el anuncio">🗑</button></div>`).join('') || '<p class="pn-small">Ninguno todavía.</p>'}</details>`;
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
      if (ev.target.closest?.('.cl-th-chev, .cl-th-acts, .cl-acts, .cl-mas, input, select, label')) return;
      const th = ev.target.closest?.('[data-tema-h]'); const it = ev.target.closest?.('.cl-it[data-item]');
      if (th) C.drag = { k: 'tema', id: th.dataset.temaH }; else if (it) C.drag = { k: 'item', id: it.dataset.item }; else return;
      ev.dataTransfer.effectAllowed = 'move'; try { ev.dataTransfer.setData('text/plain', C.drag.id); } catch (e) { }
      (th ? th.closest('.cl-tema') : it).classList.add('cl-arrastrando');
    });
    el.addEventListener('dragend', () => { dragFin = Date.now(); C.drag = null; limpiar(); el.querySelectorAll('.cl-arrastrando').forEach((x) => x.classList.remove('cl-arrastrando')); });
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
    const nombre = (await pedirTexto('Nombre del tema nuevo:', { valor: '' }) || '').trim().slice(0, 200); if (!nombre) return;
    const L = temasAsig(C.asig, []); const id = idTema();
    // Classroom pone el tema nuevo arriba del todo
    await setDoc(doc(db, 'temas', id), { curso: st.cursoSel, asig: C.asig, nombre, orden: L.length ? L[0].orden - 1000 : 1000 });
  }
  async function renombrarTema(t) {
    const nombre = (await pedirTexto('Nuevo nombre del tema:', { valor: t.nombre }) || '').trim().slice(0, 200); if (!nombre || nombre === t.nombre) return;
    await updateDoc(doc(db, 'temas', t.id), { nombre });
  }
  async function borrarTema(t) {
    const L = listaDe(t.id, null);
    if (!await confirmar(`¿Borrar el tema «${t.nombre}»?${L.length ? `\n\nSus ${L.length} elementos NO se borran: pasan a «Sin tema».` : ''}`)) return;
    await enLotes(db, [...L.map((x) => (b) => b.update(doc(db, 'items', x.id), { tema: null, actualizado: Date.now() })), (b) => b.delete(doc(db, 'temas', t.id))]);
  }

  // ------------------------------------------------------------------ elementos
  async function publicar(it) {
    if (!it.publicado && !(it.grupos || []).length) { const gs = gruposDe(it.curso, it.asig).map((g) => g.id); if (!gs.length) { alert('No hay grupos de esta asignatura en este curso: créalos en el panel → «Grupos y códigos».'); return; } it = { ...it, grupos: gs }; }
    if (!it.publicado && it.tipo === 'examen' && !(it.examen?.n > 0)) { alert('Este cuestionario no tiene preguntas todavía. Edítalo para añadirlas.'); return; }
    const pub = !it.publicado; const b = writeBatch(db);
    if (it.tipo === 'recuperacion') {
      if (pub && !(it.para || []).length) { alert('Edita la recuperación y escribe los nº de lista que la hacen.'); return; }
      b.update(doc(db, 'items', it.id), { publicado: pub, grupos: it.grupos, visible: [], visibleAl: pub ? visibleAlDe(it.grupos, it.para) : [], pub: null, actualizado: Date.now() });
      return b.commit();
    }
    b.update(doc(db, 'items', it.id), { publicado: pub, grupos: it.grupos, visible: pub ? it.grupos : [], pub: null, actualizado: Date.now() });
    if (it.tipo === 'examen') b.update(doc(db, 'examenes', it.id), { publicado: pub, grupos: it.grupos });
    await b.commit(); aula.olvidarExamen(it.id);
  }
  // P1: nada se borra en un curso abierto. «Borrar» = mover a la Papelera (sin publicar, restaurable).
  async function borrar(it) {
    const conEntregas = !(await getDocs(query(collection(db, 'trabajos'), where('item', '==', it.id), limit(1)))).empty;
    if (!(await confirmar(`¿Mover «${it.titulo}» a la papelera?\n\nDejará de verse para los alumnos.${conEntregas ? ' Tiene entregas: se conservan con sus notas.' : ''} Puedes restaurarlo desde la Papelera.`, { aceptar: 'Mover a la papelera' }))) return;
    const b = writeBatch(db);
    b.update(doc(db, 'items', it.id), { papelera: true, publicado: false, visible: [], ...('visibleAl' in it ? { visibleAl: [] } : {}), actualizado: Date.now() });
    if (it.tipo === 'examen') b.update(doc(db, 'examenes', it.id), { publicado: false });
    await b.commit(); aula.olvidarExamen?.(it.id);
  }
  async function restaurar(it) { await updateDoc(doc(db, 'items', it.id), { papelera: false, actualizado: Date.now() }); }
  async function copiar(it, destino = {}) {
    const id = idItem(); const b = writeBatch(db);
    const datos = Object.fromEntries(Object.entries(it).filter(([k]) => k !== 'id'));
    b.set(doc(db, 'items', id), { ...datos, curso: destino.curso || it.curso, tema: destino.tema !== undefined ? destino.tema : it.tema ?? null, titulo: (destino.titulo || it.titulo).slice(0, 150), orden: destino.orden ?? (it.orden ?? 0) + 0.5, grupos: destino.grupos || it.grupos || [], publicado: false, visible: [], pub: null, actualizado: Date.now(), ...('visibleAl' in it ? { visibleAl: [] } : {}) });
    if (it.tipo === 'examen') { const { examen, claves } = await aula.examen(it.id, { claves: true }); if (examen) b.set(doc(db, 'examenes', id), { ...examen, desde: Timestamp.fromMillis(examen.desde), hasta: Timestamp.fromMillis(examen.hasta), grupos: destino.grupos || examen.grupos || [], publicado: false }); b.set(doc(db, 'claves', id), claves || { respuestas: {} }); }
    // v5: sección, PDF y versión interactiva van en el elemento (se copian arriba); el origen en Drive está en origenes/{id} (solo profesor)
    if (st.reglasV5 === true) { try { const o = (await getDoc(doc(db, 'origenes', it.id))).data(); if (o) b.set(doc(db, 'origenes', id), { ...o, curso: destino.curso || it.curso }); } catch (e) { /* sin origen */ } }
    await b.commit(); return id;
  }
  async function renombrar(it) {
    const t = (await pedirTexto('Nuevo título:', { valor: it.titulo }) || '').trim().slice(0, 150); if (!t || t === it.titulo) return;
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
  // Duplicar una actividad en otro grupo o en otro curso escolar (queda como borrador para revisarla)
  function duplicarEn(it) {
    const cursos = [...st.cursos.values()].sort((a, b) => String(b.id).localeCompare(String(a.id)));
    let cur = it.curso;
    const gruposHTML = () => { const gs = gruposDe(cur, it.asig); return gs.map((g) => `<label class="pn-chk"><input type="checkbox" name="dupG" value="${esc(g.id)}"> ${esc(g.nombre)}</label>`).join('') || '<p class="pn-small">Ese curso no tiene grupos de esta asignatura: se copiará sin grupo.</p>'; };
    modal(`<header class="cl-dlg-h"><span class="cl-dlg-ic">${ic('copy-plus')}</span><h3>Duplicar «${esc(it.titulo)}»</h3></header>
      <div class="cl-dlg-b1"><label class="pn-f">Título<input data-dup="titulo" maxlength="150" value="${esc(it.titulo)}"></label>
      <label class="pn-f">Curso escolar<select data-dup="curso">${cursos.map((c) => opt(c.id, c.nombre || c.id, cur)).join('')}</select></label>
      <fieldset class="pn-f"><legend>Para los grupos</legend><div data-dup="grupos">${gruposHTML()}</div></fieldset>
      <p class="pn-small">La copia se guarda como <b>borrador</b>${it.tipo === 'recuperacion' ? ' (revisa los nº de lista)' : it.tipo === 'piac' ? ' (configura sus equipos)' : ''}. Revísala y publícala cuando quieras.</p>
      <p class="pn-msg" data-dup="msg" role="status"></p></div>
      <footer class="cl-dlg-f"><span class="pn-grow"></span><button class="btn" data-m="cerrar">Cancelar</button><button class="btn primary" data-m="dupOk">${ic('copy')} Duplicar</button></footer>`, async (acc, b, m) => {
      if (acc === 'change' && b.dataset.dup === 'curso') { cur = b.value; m.querySelector('[data-dup=grupos]').innerHTML = gruposHTML(); return; }
      if (acc !== 'dupOk') return;
      const grupos = [...m.querySelectorAll('[name=dupG]:checked')].map((x) => x.value);
      const titulo = m.querySelector('[data-dup=titulo]').value.trim() || it.titulo;
      b.disabled = true; m.querySelector('[data-dup=msg]').textContent = 'Duplicando…';
      try { await copiar(it, { curso: cur, grupos, titulo, tema: cur === it.curso ? it.tema ?? null : null }); cerrarModal(); }
      catch (e) { b.disabled = false; m.querySelector('[data-dup=msg]').textContent = 'No se ha podido duplicar (' + (e?.code || 'error') + ').'; }
    });
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
      if (acc === 'temaPlegar') {
        if (Date.now() - dragFin < 400) return;
        const tid = b.closest('[data-tema]')?.dataset.tema ?? '';
        fijarPlegado(tid, !estaPlegado(tid)); pintar(); return;
      }
      if (acc === 'plegarTodos' || acc === 'desplegarTodos') {
        const ids = [...(C.el?.querySelectorAll('.cl-tema[data-tema] .cl-th') || [])].map((h) => h.closest('[data-tema]').dataset.tema);
        plegarTodos(ids, acc === 'plegarTodos'); pintar(); return;
      }
      if (!prof) return;
      if (acc === 'orgF') { C.orgF = b.dataset.f; pintar(); return; }
      if (acc === 'sustDrive') { C.el.querySelector('[data-cl-sust]')?.click(); return; }
      if (acc === 'verTab') { C.verTab = b.dataset.v; pintar(); return; }
      if (acc === 'crear') { C.crear = !C.crear; pintar(); if (C.crear) C.el.querySelector('.cl-crear-m button')?.focus(); return; }
      C.crear = false;
      if (acc === 'nuevo') { pintar(); editor.abrir(null, { tipo: b.dataset.tipo, asig: C.asig, curso: st.cursoSel, tema: C.filtro || null, ...(IDS_ELEMENTO.includes(C.vista) && seccionDe({ tipo: b.dataset.tipo }) !== C.vista ? { seccion: C.vista } : {}) }); return; }
      if (acc === 'gsNav') return gestionSec.nav(b);
      if (acc.startsWith('sec')) return gestionSec.click(b, acc);
      if (acc === 'exportarZip') return exportar.abrirAsignatura({ asig: C.asig, items: itemsAsig(C.asig), temas: temasAsig(C.asig, []) });
      if (acc === 'pdfCuestionario' && it) return exportar.abrirCuestionario(it);
      if (acc === 'nuevoTema') { pintar(); return nuevoTema(); }
      if (acc === 'reutilizar') { pintar(); return reutilizar(); }
      if (acc === 'importar') return importar();
      if (acc === 'banco') return banco.abrir(C.asig);
      if (acc === 'directo') return directo.abrir(C.asig);
      if (acc === 'importarJSON') return json.importar({ curso: st.cursoSel, asig: C.asig, tema: C.filtro || null, temas: temasAsig(C.asig, []) });
      if (acc === 'temaUp' || acc === 'temaDown') { const L = temasAsig(C.asig, []); const i = L.findIndex((x) => x.id === t.id); return moverTema(t.id, acc === 'temaUp' ? L[i - 1]?.id : L[i + 2]?.id || null); }
      if (acc === 'temaRen' && t) return renombrarTema(t);
      if (acc === 'temaDel' && t) return borrarTema(t);
      if (acc === 'anDel') { const id = b.closest('[data-anuncio]').dataset.anuncio; if (await confirmar('¿Borrar este anuncio?')) await deleteDoc(doc(db, 'anuncios', id)); return; }
      if (!it) return;
      if (acc === 'up' || acc === 'down') return subirBajar(it.id, acc === 'up' ? -1 : 1);
      if (acc === 'pub') { b.disabled = true; return await publicar(it); }
      if (acc === 'editar') return editor.abrir(it);
      if (acc === 'renombrar') return renombrar(it);
      if (acc === 'duplicar') return copiar(it, { titulo: it.titulo + ' (copia)' });
      if (acc === 'duplicarEn') { b.closest('details')?.removeAttribute('open'); return duplicarEn(it); }
      if (acc === 'exportarJSON') { b.closest('details')?.removeAttribute('open'); return json.exportar(it); }
      if (acc === 'evidencias') { b.closest('details')?.removeAttribute('open'); b.disabled = true; try { const E = await exportarEvidencias(db, it, { aula, grupos: st.grupos }); await avisar(`Evidencias descargadas: ${E.alumnos.length} alumno(s). Guárdalas en tu Drive (llevan respuestas del alumnado, sin nombres). Se abren con Panel → Ajustes y limpieza → «Abrir evidencias».`); } finally { b.disabled = false; } return; }
      if (acc === 'borrar') return borrar(it);
      if (acc === 'restaurar') return restaurar(it);
    } catch (e) { alert('No se ha podido completar la acción (' + (e?.code || e?.message || 'error') + ').'); }
  }
  function onChange(ev) {
    const t = ev.target;
    if (t.matches('[data-cl-sust]')) { const L = [...(t.files || [])]; t.value = ''; if (L.length) sustituirDrive(L); return; }
    if (t.dataset.clF === 'curso') { aula.elegirCurso(t.value); pintar(); }
    if (t.dataset.clF === 'vergrupo') { C.verGrupo = t.value; pintar(); }
    if (t.matches('[data-cl-mover]')) { const id = t.closest('[data-item]').dataset.item; moverItem(id, t.value || null, null); }
  }
  async function onSubmit(ev) {
    if (ev.target.id !== 'clAnuncio') return; ev.preventDefault();
    const f = ev.target; const fd = new FormData(f); const msg = f.querySelector('#clAnMsg');
    const texto = String(fd.get('texto') || '').trim().slice(0, 5000); const grupos = fd.getAll('grupos').map(String);
    if (!texto || !grupos.length) { msg.textContent = 'Escribe el aviso y marca al menos un grupo.'; msg.className = 'pn-msg ko'; return; }
    const pub = fd.get('programar') ? (fd.get('pubAn') ? new Date(String(fd.get('pubAn'))).getTime() : null) : null;
    if (fd.get('programar') && !(pub > Date.now())) { msg.textContent = 'La fecha del aviso programado tiene que ser futura.'; msg.className = 'pn-msg ko'; return; }
    msg.textContent = pub ? 'Programando…' : 'Publicando…'; msg.className = 'pn-msg';
    try { await setDoc(doc(db, 'anuncios', idItem()), { curso: st.cursoSel, asig: C.asig, texto, enlaces: leeEnlaces(fd.get('enlaces'), 10), grupos, visible: grupos, fecha: Date.now(), pub }); f.reset(); pintar(); }
    catch (e) { msg.textContent = '❌ No se ha podido publicar (' + (e?.code || 'error') + ').'; msg.className = 'pn-msg ko'; }
  }
  window.addEventListener('portal-aula', () => { if (C.el?.isConnected && !C.drag) pintar(); });
  return { render, pintar, importar, reutilizar, importarSemilla, json, editar: (id) => { const it = st.items.get(id); if (it && editor) editor.abrir(it); }, editor, adjuntosHTML, datosAlumno, get vista() { return C.vista; } };
}

// Pantallas estáticas de la biblioteca (funcionan también sin Firebase, con el código de clase):
// catálogo del profesor (agrupado por curso, con filtros y búsqueda) y el programa de cada asignatura.
// Cada asignatura tiene UNA sola página (#asig/<id>/<pestaña>), se llegue desde aquí o desde «Mis asignaturas».
import { BIBLIOTECA, asignatura, TIPOS, ETAPAS, cuentaItems } from './biblioteca.js';

const esc = (t) => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const norm = (t) => String(t || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
export const enlaceAsig = (id) => `#asig/${id}`;
const filtro = { etapa: '', curso: '', q: '' };

export const PROFESOR = 'Pablo Mateos Lema';
const nav = (k) => (typeof window !== 'undefined' && window.PORTAL?.navHTML ? window.PORTAL.navHTML(k) : '');
function cabecera(titulo, crumbs, chip, k = '') {
  return `<header class="scr-top"><a href="#inicio" class="brand" title="Inicio">SuperProfe · Alumnos</a><div class="scr-ttl">${esc(titulo)}</div>${nav(k)}</header>
  <nav class="crumbs static" aria-label="Estás en"><div>${crumbs}</div><div class="prof">${chip}</div></nav>`;
}
export function tarjetaAsig(a, { marca = '', href = null, alumno = false } = {}) {
  return `<a class="subj bib-card${a.foto ? ' con-foto' : ''}" href="${href || enlaceAsig(a.id)}" style="--c:${a.color};border-top-color:${a.color}">${a.foto ? `<div class="subj-foto"><img src="${a.foto}" alt="" loading="lazy" decoding="async"></div>` : `<div class="subj-ic" aria-hidden="true">${a.icon}</div>`}
    <div class="subj-cod">${esc(a.etapa)} · ${esc(a.curso)}${a.codigo ? ' · Módulo ' + esc(a.codigo) : ''}</div><h3>${esc(a.nombre)}</h3>
    <p>${esc(a.desc)}</p><div class="bib-meta">${alumno ? `Profesor: ${esc(PROFESOR)}` : `${a.unidades.length} unidades · ${cuentaItems(a)} elementos`}${marca ? ` <span class="bib-marca">✔ ${esc(marca)}</span>` : ''}</div><span class="subj-go">Entrar <span aria-hidden="true">→</span></span></a>`;
}

// ---------------------------------------------------------------- catálogo
export function bibliotecaHTML({ chip = '', esProfesor = false, enCurso = null } = {}) {
  const cursos = [...new Set(BIBLIOTECA.map((a) => a.curso))];
  return cabecera('Biblioteca de asignaturas', '<a href="#inicio">Inicio</a> › <span aria-current="page">Biblioteca</span>', chip, 'biblio') + `
  <main class="subj-wrap bib"><h1 class="subj-h1">🗂 Biblioteca de asignaturas</h1>
  <p class="muted">Tu catálogo: todas las asignaturas con sus situaciones de aprendizaje, tareas, prácticas, proyectos y cuestionarios (tal y como estaban en Classroom). ${esProfesor ? `Cada curso escolar eliges en <a href="#panel/cursos">Panel → Cursos escolares</a> cuáles impartes${enCurso ? ` (ahora, ${esc(enCurso.curso)})` : ''}. Al abrir una asignatura verás su <b>Organización</b>.` : ''}</p>
  <div class="bib-filtros" role="search">
    <div class="bib-chips" role="group" aria-label="Etapa">${['', ...ETAPAS].map((e) => `<button type="button" class="bib-chip ${filtro.etapa === e ? 'on' : ''}" data-bib-etapa="${esc(e)}">${e ? esc(e) : 'Todas'}</button>`).join('')}</div>
    <label>Curso <select id="bibCurso"><option value="">Todos</option>${cursos.map((c) => `<option ${filtro.curso === c ? 'selected' : ''}>${esc(c)}</option>`).join('')}</select></label>
    <input id="bibQ" type="search" placeholder="Buscar: «hoja de cálculo», «resistencias», «proyecto»…" value="${esc(filtro.q)}" aria-label="Buscar en la biblioteca">
    <button type="button" class="btn small" id="bibLimpiar">Quitar filtros</button>
  </div>
  <div id="bibRes" aria-live="polite">${resultadosHTML(enCurso)}</div></main>`;
}
function resultadosHTML(enCurso) {
  const q = norm(filtro.q.trim());
  const asigs = BIBLIOTECA.filter((a) => (!filtro.etapa || a.etapa === filtro.etapa) && (!filtro.curso || a.curso === filtro.curso));
  const marca = (a) => (enCurso && enCurso.asignaturas.includes(a.id) ? `Impartes en ${enCurso.curso}` : '');
  const vacio = '<div class="as-vacio"><div class="as-vacio-ic" aria-hidden="true">🔍</div><h2>Sin resultados</h2><p>No hay asignaturas con esos filtros. Pulsa «Quitar filtros».</p></div>';
  if (!q) {
    if (!asigs.length) return vacio;
    const grupos = [...new Set(asigs.map((a) => `${a.etapa} · ${a.curso}`))];
    return grupos.map((g) => { const L = asigs.filter((a) => `${a.etapa} · ${a.curso}` === g); return `<section class="bib-grupo"><h2 class="bib-gt">${esc(g)} <span class="muted small">${L.length} asignatura${L.length === 1 ? '' : 's'}</span></h2><div class="subj-grid">${L.map((a) => tarjetaAsig(a, { marca: marca(a), href: `#asig/${a.id}/organizacion` })).join('')}</div></section>`; }).join('');
  }
  const hits = [];
  for (const a of asigs) {
    if (norm(a.nombre + ' ' + a.corto + ' ' + a.desc).includes(q)) hits.push({ a, t: 'asig' });
    for (const u of a.unidades) {
      if (norm(u.titulo).includes(q)) hits.push({ a, u, t: 'unidad' });
      for (const it of u.items) if (norm(it.titulo + ' ' + (it.desc || '')).includes(q)) hits.push({ a, u, it, t: 'item' });
    }
  }
  if (!hits.length) return `<div class="as-vacio"><div class="as-vacio-ic" aria-hidden="true">🔍</div><h2>Sin resultados</h2><p>Nada coincide con «${esc(filtro.q)}».</p></div>`;
  return `<p class="muted small">${hits.length} resultado${hits.length === 1 ? '' : 's'}</p><ul class="bib-hits">${hits.slice(0, 200).map((h) => `<li><a href="#asig/${h.a.id}/organizacion">${h.a.icon} ${esc(h.a.corto)}</a>${h.u ? ` › ${esc(h.u.titulo)}` : ''}${h.it ? ` › <b>${TIPOS[h.it.tipo]?.icon || ''} ${esc(h.it.titulo)}</b> <span class="muted small">(${esc(TIPOS[h.it.tipo]?.nombre || h.it.tipo)})</span>` : ''}</li>`).join('')}</ul>`;
}
export function enlazarBiblioteca(root, enCurso) {
  const pinta = () => { const r = root.querySelector('#bibRes'); if (r) r.innerHTML = resultadosHTML(enCurso); };
  root.querySelectorAll('[data-bib-etapa]').forEach((b) => b.addEventListener('click', () => { filtro.etapa = b.dataset.bibEtapa; root.querySelectorAll('[data-bib-etapa]').forEach((x) => x.classList.toggle('on', x === b)); pinta(); }));
  root.querySelector('#bibCurso')?.addEventListener('change', (e) => { filtro.curso = e.target.value; pinta(); });
  root.querySelector('#bibQ')?.addEventListener('input', (e) => { filtro.q = e.target.value; pinta(); });
  root.querySelector('#bibLimpiar')?.addEventListener('click', () => { filtro.etapa = ''; filtro.curso = ''; filtro.q = ''; root.querySelector('#bibQ').value = ''; root.querySelector('#bibCurso').value = ''; root.querySelectorAll('[data-bib-etapa]').forEach((x) => x.classList.toggle('on', !x.dataset.bibEtapa)); pinta(); });
}

// ---------------------------------------------------------------- programa de una asignatura
// completo = profesor o modo sin Firebase (ve todos los elementos); si no, solo los títulos de las unidades.
export function programaHTML(a, { completo = true, abierto = false } = {}) {
  return `<details class="bib-prog" ${abierto ? 'open' : ''}><summary>🗂 Programa de la asignatura · biblioteca (${a.unidades.length} unidades${completo ? `, ${cuentaItems(a)} elementos` : ''})</summary>
    ${completo ? '<p class="muted small">Contenido de la biblioteca (tomado de Classroom). Mismo orden y estado que en Classroom. «Borrador» = no visible para los alumnos; «Pendiente de completar» = faltan instrucciones o adjuntos.</p>' : ''}
    ${a.unidades.map((u) => `<section class="bib-u"><h4>${esc(u.titulo)}${u.cursos ? ` <span class="muted small">(${esc(u.cursos.join(', '))})</span>` : ''}${u.archivo ? ' <span class="muted small">(archivo)</span>' : ''}</h4>
      ${completo ? `<ul>${u.items.map((it) => `<li><span class="bib-ti">${TIPOS[it.tipo]?.icon || '📄'}</span> ${esc(it.titulo)} <span class="muted small">· ${esc(TIPOS[it.tipo]?.nombre || it.tipo)}${it.cursos ? ' · ' + esc(it.cursos.join(', ')) : ''}</span>${it.estado === 'borrador' ? ' <span class="bib-borr">Borrador</span>' : ''}${it.pendiente ? ' <span class="bib-pend">Pendiente de completar</span>' : ''}${it.texto ? `<div class="muted small">${esc(it.texto.slice(0, 240))}</div>` : ''}</li>`).join('')}</ul>` : ''}</section>`).join('')}
  </details>`;
}

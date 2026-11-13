// Página única de cada asignatura (#asig/<id>/<pestaña>), igual se llegue desde el «Curso» o desde
// la Biblioteca. Una sola barra de pestañas, como Classroom:
//   Organización (solo profesor) · Trabajo de clase · Tablón (del alumno) · Laboratorio · Actividades de clase
// Sin Firebase (modo código de clase) no hay aula: Programa · Laboratorio · Actividades de clase.
import { APARTADOS } from './subjects.js';
import { asignatura } from './lms/biblioteca.js';
import { programaHTML } from './lms/vistas-biblio.js';
import { actividadesDe, enlaceActividad } from './act/registro.js';

const esc = (t) => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const portal = () => window.PORTAL || null;
export const PROFESOR = 'Pablo Mateos Lema';

// Laboratorios 3D de cada asignatura (registro: APARTADOS en subjects.js). Para añadir uno, se añade allí.
export const laboratoriosDe = (asig) => (APARTADOS[asig] || []).map((a) => ({ ...a, href: `#${asig}/${a.id}` }));

export function pestañas() {
  const P = portal(); const aula = !!P?.aula?.activa?.(); const prof = !!P?.esProfesor;
  if (!aula) return [['programa', '🗂', 'Programa'], ['laboratorio', '🔬', 'Laboratorio'], ['actividades', '🧩', 'Actividades de clase']];
  return [...(prof ? [['organizacion', '🧭', 'Organización']] : []), ['trabajo', '📚', 'Trabajo de clase'], ['tablon', '📣', prof ? 'Tablón del alumno' : 'Tablón'], ['laboratorio', '🔬', 'Laboratorio'], ['actividades', '🧩', 'Actividades de clase']];
}
export const pestañaPorDefecto = () => { const P = portal(); if (!P?.aula?.activa?.()) return 'programa'; return P.esProfesor ? 'organizacion' : 'tablon'; };

export function asigHTML(id, tab, { cabecera, chip, enCurso = true }) {
  const a = asignatura(id); const P = portal(); const prof = !!P?.esProfesor; const ses = window.PORTAL_SESION;
  const T = pestañas(); const nombreTab = T.find((t) => t[0] === tab)?.[2] || '';
  const origen = prof && !enCurso ? '<a href="#biblioteca">Biblioteca</a>' : '<a href="#asignaturas">Curso</a>';
  const crumbs = `<nav class="crumbs static" aria-label="Estás en"><div><a href="#inicio">Inicio</a> › ${origen} › <a href="#asig/${esc(id)}">${esc(a.corto)}</a> › <span aria-current="page">${esc(nombreTab)}</span></div><div class="prof">${chip}</div></nav>`;
  const quien = prof ? `Profesor: <b>${PROFESOR}</b>${enCurso ? '' : ` · <span class="as-fuera">No está en el Curso de este año (vista de la Biblioteca)</span> <button type="button" class="btn small" data-cur="añadir" data-asig="${esc(id)}">➕ Añadir al curso</button><span class="cur-msg muted small" aria-live="polite"></span>`}` : ses?.grupo ? `${esc(ses.grupo)} · nº ${String(ses.numero).padStart(2, '0')} · Profesor: <b>${PROFESOR}</b>` : `Profesor: <b>${PROFESOR}</b>`;
  return `${cabecera}${crumbs}
  <div class="as-hero" style="--c:${a.color}"><div class="as-hero-in">${a.foto ? `<img class="as-foto" src="${a.foto}" alt="" decoding="async">` : `<span class="as-ic" aria-hidden="true">${a.icon}</span>`}<div><div class="as-cod">${esc(a.etapa)} · ${esc(a.curso)}${a.codigo ? ' · Módulo ' + esc(a.codigo) : ''}</div><h1>${esc(a.nombre)}</h1><div class="as-quien">${quien}</div></div></div>
    <nav class="as-tabs" role="tablist" aria-label="Secciones de la asignatura">${T.map(([k, ic, t]) => `<a role="tab" id="tab-${k}" href="#asig/${esc(id)}/${k}" aria-selected="${k === tab}" aria-controls="asPanel" tabindex="${k === tab ? 0 : -1}" class="${k === tab ? 'on' : ''}"><span aria-hidden="true">${ic}</span> ${esc(t)}</a>`).join('')}</nav></div>
  <section id="asPanel" class="as-panel" role="tabpanel" aria-labelledby="tab-${esc(tab)}" tabindex="-1">${panelEstatico(id, tab)}</section>`;
}
function panelEstatico(id, tab) {
  const a = asignatura(id);
  if (tab === 'programa') return `<div class="as-wrap"><p class="muted">${esc(a.desc)}</p>${programaHTML(a, { completo: false, abierto: true })}</div>`;
  if (tab === 'organizacion') return `<div class="as-wrap"><div id="asOrg" class="cl"></div><section class="as-sec"><h2 class="as-h2">🗂 Programación de la asignatura</h2><p class="muted small">${esc(a.desc)} Estructura de la biblioteca (tal y como estaba en Classroom${a.semilla?.cursoEscolar ? ', ' + esc(a.semilla.cursoEscolar) : ''}): sirve de plan del curso y se importa al Trabajo de clase.</p>${programaHTML(a, { completo: true, abierto: false })}</section></div>`;
  if (tab === 'trabajo' || tab === 'tablon') return `<div class="as-wrap"><div id="asTrabajo" class="cl"></div></div>`;
  if (tab === 'laboratorio') return `<div class="as-wrap">${laboratorioHTML(id)}</div>`;
  if (tab === 'actividades') return `<div class="as-wrap">${actividadesHTML(id)}</div>`;
  return '';
}
function laboratorioHTML(id) {
  const apartadoOk = (k) => { const s = window.PORTAL_SESION; return !s || !Array.isArray(s.apartados) || !s.apartados.length || s.apartados.includes(k); };
  const L = laboratoriosDe(id).filter((x) => apartadoOk(x.parte || x.id));
  if (!L.length) return `<div class="as-vacio"><div class="as-vacio-ic" aria-hidden="true">🔬</div><h2>Próximamente</h2><p>Todavía no hay laboratorios 3D de ${esc(asignatura(id).corto)}. Irán apareciendo aquí: cada laboratorio nuevo se añade a la lista y sale solo en esta pestaña.</p></div>`;
  return `<p class="muted as-intro">Laboratorios 3D para montar, simular y comprobar. Las prácticas guiadas se entregan desde el propio laboratorio y la nota llega al cuaderno.</p>
  <div class="ap-grid">${L.map((x) => x.active
    ? `<a class="ap-card${x.foto ? ' con-foto' : ''}" style="--ap:${x.color}" href="${x.href}">${x.foto ? `<div class="ap-foto"><img src="${x.foto}" alt="" loading="lazy" decoding="async"></div>` : `<div class="ap-ic" aria-hidden="true">${x.icon}</div>`}<h3>${esc(x.nombre)}</h3><p>${esc(x.desc)}</p><div class="ap-tags">${(x.tags || []).map((t) => `<span>${esc(t)}</span>`).join('')}</div><span class="ap-go">Entrar →</span></a>`
    : `<div class="ap-card off"><div class="ap-ic" aria-hidden="true">${x.icon}</div><h3>${esc(x.nombre)}</h3><p>Próximamente</p></div>`).join('')}</div>`;
}
function actividadesHTML(id) {
  const L = actividadesDe(id); const P = portal(); const prof = !!P?.esProfesor;
  if (!L.length) return `<div class="as-vacio"><div class="as-vacio-ic" aria-hidden="true">🧩</div><h2>Próximamente</h2><p>Todavía no hay actividades interactivas de ${esc(asignatura(id).corto)}. Cada actividad nueva aparecerá aquí y se podrá asignar como tarea.</p></div>`;
  return `<p class="muted as-intro">Actividades dinámicas en 3D a partir del contenido de clase. Se pueden practicar libremente; ${prof ? 'si las <b>asignas como tarea</b>, el resultado de cada alumno llega al cuaderno de calificaciones.' : 'si tu profesor la ha puesto como tarea, al terminar podrás entregar el resultado.'}</p>
  <div class="ac-grid">${L.map((x) => { const est = P?.aula?.actividadEstado?.(enlaceActividad(x)); return `<article class="ac-card${x.foto ? ' con-foto' : ''}" style="--ap:${x.color}" data-act="${esc(x.id)}">${x.foto ? `<div class="ap-foto"><img src="${x.foto}" alt="" loading="lazy" decoding="async"></div>` : `<div class="ap-ic" aria-hidden="true">${x.icon}</div>`}<div class="ac-card-b"><h3>${esc(x.titulo)}</h3><p>${esc(x.desc)}</p>
    <div class="ap-tags"><span>${esc(x.tipo)}</span><span>${x.rondas.length} preguntas</span><span>${esc(x.tema)}</span></div>${est ? `<div class="ac-est">${est}</div>` : ''}
    <div class="ac-card-acts"><a class="btn primary" href="${enlaceActividad(x)}">▶ ${prof ? 'Probar' : 'Hacer la actividad'}</a>${prof && P?.aula?.activa?.() ? `<button class="btn" data-asignar="${esc(x.id)}">📌 Asignar como tarea</button>` : ''}</div></div></article>`; }).join('')}</div>`;
}

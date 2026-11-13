// Editor de publicaciones del «Trabajo de clase» (ventana sobre la página, como «+ Crear» de Classroom):
// tarea, tarea de cuestionario (examen del portal con autocorrección), pregunta, material y cuestionario
// externo (formulario). Título, instrucciones, adjuntos (enlaces), puntos, fecha de entrega, tema,
// grupos y estado: publicar ahora, programar o borrador. Las soluciones del examen van aparte (claves).
import { doc, writeBatch, Timestamp } from 'firebase/firestore';
import { esc } from './util.js';
import { ic } from './ico.js';
import { asignatura, TIPOS, CATEGORIAS } from '../lms/biblioteca.js';
import { criterioValido, motor } from '../lms/elemento.js';
import '../lms/motores/index.js';
import { TIPOS_PREGUNTA, separarPregunta, unirPregunta, validarPregunta } from '../lms/preguntas.js';
import { categoriaDe, idItem, leeEnlaces, enlacesTexto, leeRubrica, rubricaTexto, TIPOS_ENTREGA, enlaceValido, visibleAlDe } from '../lms/modelo.js';
import { rubricaPlantillaTexto } from '../lms/rubrica.js';
import { completarPiac } from '../lms/motores/piac.js';

export const fFecha = (t) => (t ? new Date(t).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }) : '—');
const aLocal = (t) => { if (!t) return ''; const d = new Date(t); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16); };
const deLocal = (v) => (v ? new Date(v).getTime() : null);
const opt = (v, t, sel) => `<option value="${esc(v)}" ${v === sel ? 'selected' : ''}>${esc(t)}</option>`;
export const TIPOS_CREAR = ['tarea', 'examen', 'pregunta', 'material', 'cuestionario'];
const TIPOS_EDITOR = ['tarea', 'examen', 'pregunta', 'material', 'cuestionario', 'actividad', 'practica', 'proyecto', 'explicacion', 'p5', 'web', 'info', 'ciber', 'bloques', 'averia', 'recuperacion', 'piac'];
const entregableDe = (t) => TIPOS_ENTREGA.includes(t) || t === 'examen' || !!motor(t)?.entregable;
export const PEND = 'Contenido pendiente de subir.';
export const PEND_T = 'Pendiente de completar';
const BASICAS = ['test', 'vf', 'corta'];
const EXTRA_NUEVA = { emparejar: { pares: [['', ''], ['', '']], distractores: [] }, ordenar: { elementos: ['', '', ''] }, huecos: { texto: '' }, numerica: { valor: 0, tolerancia: 0, modo: 'abs', unidad: '' }, zonas: { imagen: '', zonas: [] } };
const nuevaPregunta = (tipo) => ({ id: 'q' + Math.random().toString(36).slice(2, 8), tipo, enunciado: '', opciones: tipo === 'test' ? ['', '', ''] : [], correcta: tipo === 'test' ? 0 : tipo === 'vf' ? true : [], puntos: 1, ...(EXTRA_NUEVA[tipo] ? JSON.parse(JSON.stringify(EXTRA_NUEVA[tipo])) : {}) });
const zonasTexto = (Z) => (Z || []).map((z) => `${z.x}, ${z.y}, ${z.w}, ${z.h} | ${z.nombre || ''} | ${z.correcta === false ? 'no' : 'sí'}`).join('\n');
const leeZonas = (t) => String(t || '').split('\n').map((l) => l.trim()).filter(Boolean).slice(0, 20).map((l) => { const [n, nombre = '', c = 'sí'] = l.split('|').map((x) => x.trim()); const [x, y, w, h] = n.split(/[,;\s]+/).map((v) => Number(v.replace(',', '.'))); return { x, y, w, h, nombre, correcta: !/^(no|n|false|0)$/i.test(c) }; });

// Estado de una publicación para el profesor: borrador, programada o publicada.
export function estadoPub(it, now = Date.now()) {
  if (!it.publicado) return { k: 'borr', t: 'Borrador' };
  if (it.pub && it.pub > now) return { k: 'prog', t: 'Programado · ' + fFecha(it.pub) };
  return { k: 'pub', t: 'Publicado' };
}

export function crearEditor({ db, aula, gruposDe }) {
  const st = aula.st;
  const E = { edit: null, preguntas: [], el: null, alGuardar: null };
  const temasDe = (curso, asig) => [...st.temas.values()].filter((t) => t.curso === curso && t.asig === asig).sort((a, b) => a.orden - b.orden);

  function cerrar() { E.edit = null; E.preguntas = []; if (E.el) { E.el.remove(); E.el = null; } document.body.classList.remove('cl-modal-abierto'); }
  function montar() {
    if (!E.el) {
      E.el = document.createElement('div'); E.el.className = 'cl-modal'; E.el.setAttribute('role', 'dialog'); E.el.setAttribute('aria-modal', 'true');
      E.el.addEventListener('click', onClick); E.el.addEventListener('change', onChange); E.el.addEventListener('submit', onSubmit);
      E.el.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') cerrar(); });
      document.body.appendChild(E.el); document.body.classList.add('cl-modal-abierto');
    }
    E.el.innerHTML = `<div class="cl-dlg" id="apEditor">${html()}</div>`;
    E.el.querySelector('input[name=titulo]')?.focus();
  }
  // abrir(it) edita; abrir(null, {tipo, tema, curso, asig}) crea.
  function abrir(it, nuevo = {}) {
    if (it) {
      E.edit = { ...it, tema: it.tema ?? null, estado: !it.publicado ? 'borrador' : it.pub && it.pub > Date.now() ? 'programar' : 'publicar' };
      E.preguntas = [];
      if (it.tipo === 'examen') {
        E.edit.cargando = true;
        aula.examen(it.id, { claves: true }).then(({ examen, claves }) => {
          const k = claves?.respuestas || {};
          E.preguntas = (examen?.preguntas || []).map((q) => (BASICAS.includes(q.tipo) ? { ...q, correcta: k[q.id] ?? (q.tipo === 'corta' ? [] : q.tipo === 'vf' ? true : 0) } : unirPregunta(q, k[q.id])));
          if (examen) E.edit.examen = { ...E.edit.examen, desde: examen.desde, hasta: examen.hasta, limiteMin: examen.limiteMin, barajar: examen.barajar, pantallaCompleta: !!examen.pantallaCompleta };
          E.edit.cargando = false; if (E.el) montar();
        }).catch(() => { E.edit.cargando = false; if (E.el) montar(); });
      }
    } else {
      const curso = nuevo.curso || st.cursoSel; const asig = nuevo.asig;
      const tipo = nuevo.tipo || 'tarea';
      const enTema = [...st.items.values()].filter((x) => x.curso === curso && x.asig === asig && (x.tema ?? null) === (nuevo.tema ?? null));
      E.edit = { id: null, curso, asig, tema: nuevo.tema ?? null, tipo, titulo: '', texto: '', enlaces: [], fechaEntrega: null, puntos: tipo === 'material' ? null : 10, rubrica: [], opciones: [],
        categoria: categoriaDe(tipo), grupos: gruposDe(curso, asig).map((g) => g.id), publicado: false, estado: 'publicar', pub: null,
        orden: enTema.length ? Math.min(...enTema.map((x) => x.orden ?? 0)) - 1000 : 1000, origen: null, examen: tipo === 'examen' ? { desde: Date.now(), hasta: Date.now() + 864e5, limiteMin: 30, barajar: true } : null };
      // relleno previo (p. ej. «Asignar como tarea» de una actividad de clase)
      for (const k of ['titulo', 'texto', 'enlaces', 'puntos', 'estado', 'criterio', 'contenido', 'rubrica', 'categoria', 'fechaEntrega']) if (nuevo[k] !== undefined) E.edit[k] = nuevo[k];
      E.preguntas = [];
    }
    montar();
  }

  function html() {
    const e = E.edit; const a = asignatura(e.asig);
    const ex = e.examen || { desde: Date.now(), hasta: Date.now() + 864e5, limiteMin: 30, barajar: true };
    const gs = gruposDe(e.curso, e.asig);
    const entregable = entregableDe(e.tipo); const M = motor(e.tipo);
    const temas = temasDe(e.curso, e.asig);
    return `<form id="apItemForm" class="pn-form ap-form cl-form" autocomplete="off">
    <header class="cl-dlg-h"><span class="cl-dlg-ic">${TIPOS[e.tipo]?.icon || '📄'}</span><h3>${e.id ? 'Editar' : 'Crear'}: ${esc(TIPOS[e.tipo]?.nombre || e.tipo)}</h3><span class="pn-small">${esc(a?.corto || e.asig)}</span><span class="pn-grow"></span>${e.id ? '<button class="btn small" type="button" data-ed="exportar" title="Exportar este elemento en JSON (lo guardado)">' + ic('download') + ' JSON</button>' : ''}<button class="btn" type="button" data-ed="cancelar" aria-label="Cerrar">✕</button></header>
    <div class="cl-dlg-b"><div class="cl-dlg-main">
      <label class="pn-f">Tipo<select name="tipo">${TIPOS_EDITOR.map((t) => opt(t, TIPOS[t].nombre, e.tipo)).join('')}</select></label>
      <label class="pn-f">${e.tipo === 'pregunta' ? 'Pregunta' : 'Título'}<input name="titulo" maxlength="150" required value="${esc(e.titulo)}"></label>
      <label class="pn-f">Instrucciones${e.tipo === 'material' ? ' / descripción' : ''} (opcional)<textarea name="texto" rows="7" maxlength="20000" placeholder="Explica qué hay que hacer. **negrita** y los enlaces se ven como enlaces.">${esc(e.texto || '')}</textarea></label>
      ${e.tipo === 'pregunta' ? `<label class="pn-f">Opciones (una por línea; vacío = respuesta corta)<textarea name="opciones" rows="3" maxlength="2000">${esc((e.opciones || []).join('\n'))}</textarea></label>` : ''}
      <fieldset class="pn-f cl-adj"><legend>Adjuntos</legend>
        <textarea name="enlaces" rows="3" maxlength="10000" placeholder="Título | https://drive.google.com/…  (uno por línea)">${esc(enlacesTexto(e.enlaces))}</textarea>
        <div class="cl-adj-add"><input name="adjT" maxlength="120" placeholder="Título (opcional)"><input name="adjU" maxlength="500" placeholder="https://… (Drive, Docs, YouTube, cualquier web) o materiales/…">
          <button type="button" class="btn small" data-ed="adj">➕ Añadir</button></div>
        <p class="pn-small">Google Drive, Documentos, Presentaciones, Formularios, YouTube o cualquier enlace. Los PDF e imágenes que estén en la web van con la ruta <code>materiales/…</code>. (Para subir archivos al portal haría falta el plan de pago de Firebase: usa Drive y pega el enlace.)</p></fieldset>
      ${M ? `<fieldset class="pn-f ap-motor"><legend>${esc(M.nombre || TIPOS[e.tipo]?.nombre || e.tipo)} · contenido (JSON)</legend>
        <textarea name="contenido" class="js-ta" rows="14" spellcheck="false" maxlength="400000">${esc(e.contenidoTxt ?? JSON.stringify(e.contenido || M.ejemplo || {}, null, 2))}</textarea>
        <div class="pn-acts"><button type="button" class="btn small" data-ed="ejemplo">Poner el ejemplo</button><span class="pn-small">Formato y ejemplos en «FORMATO_IMPORTAR.md». Se comprueba al guardar.</span></div>
        ${M.entregable ? '<p class="pn-small">Al terminar, el alumno entrega su resultado («Aciertos: a/t»); en el cuaderno, «Poner notas» lo pasa a nota sobre 10.</p>' : ''}</fieldset>` : ''}
      ${e.tipo === 'examen' ? `<fieldset class="pn-f ap-exam"><legend>Cuestionario del portal (autocorregido)</legend>
        <div class="ap-fila"><label class="pn-f">Se abre<input type="datetime-local" name="desde" value="${esc(aLocal(ex.desde))}"></label><label class="pn-f">Se cierra<input type="datetime-local" name="hasta" value="${esc(aLocal(ex.hasta))}"></label>
        <label class="pn-f">Tiempo límite (min, vacío = sin límite)<input type="number" name="limiteMin" min="1" max="600" value="${ex.limiteMin || ''}"></label></div>
        <label class="pn-chk"><input type="checkbox" name="barajar" ${ex.barajar !== false ? 'checked' : ''}> Barajar preguntas y opciones para cada alumno</label>
        <label class="pn-chk"><input type="checkbox" name="pantallaCompleta" ${ex.pantallaCompleta ? 'checked' : ''}> ${ic('shield-check')} Modo examen: pantalla completa y registro de salidas de la pestaña (informativo, solo lo ves tú)</label>
        <p class="pn-small">Las soluciones se guardan aparte (solo las puede leer el profesor). Test y verdadero/falso se corrigen solos; las respuestas cortas se corrigen solas si coinciden con alguna aceptada (sin tildes ni mayúsculas) y si no, las revisas tú.</p>
        <div id="apPreguntas">${e.cargando ? '<p class="pn-small">Cargando preguntas…</p>' : preguntasHTML()}</div>
        <div class="pn-acts"><button type="button" class="btn small" data-ed="q+test">${ic('plus')} Test</button><button type="button" class="btn small" data-ed="q+vf">${ic('plus')} Verdadero/falso</button><button type="button" class="btn small" data-ed="q+corta">${ic('plus')} Respuesta corta</button><button type="button" class="btn small" data-ed="q+emparejar">${ic('plus')} Emparejar</button><button type="button" class="btn small" data-ed="q+ordenar">${ic('plus')} Ordenar</button><button type="button" class="btn small" data-ed="q+huecos">${ic('plus')} Huecos</button><button type="button" class="btn small" data-ed="q+numerica">${ic('plus')} Numérica</button><button type="button" class="btn small" data-ed="q+zonas">${ic('plus')} Imagen con zonas</button><button type="button" class="btn small" data-ed="banco">${ic('archive')} Del banco…</button></div></fieldset>` : ''}
      <fieldset class="pn-f cl-nota ${e.pendiente ? 'pend' : ''}"><legend>🔒 Nota privada (solo la ves tú)</legend>
        ${e.pendiente ? `<p class="cl-pend-aviso"><b>⚠ ${PEND_T}.</b> Al importarlo de Classroom no constaban todos los detalles. Añade instrucciones o adjuntos y guarda: el aviso desaparece solo.</p>` : ''}
        <textarea name="nota" rows="2" maxlength="2000" placeholder="Recordatorios para ti; los alumnos no la ven.">${esc(e.nota || '')}</textarea>
        ${e.pendiente ? '<label class="pn-chk"><input type="checkbox" name="quitarPend"> Ya está completo: quitar el aviso «Pendiente de completar»</label>' : ''}</fieldset>
      ${entregable && e.tipo !== 'examen' ? `<div class="pn-f"><label class="pn-f">Rúbrica (opcional, una línea por criterio: «Criterio | puntos»)<textarea name="rubrica" rows="3" maxlength="5000" placeholder="Contenido completo y correcto | 4&#10;Presentación y formato | 3&#10;Entrega en plazo | 3">${esc(rubricaTexto(e.rubrica))}</textarea></label>
        <div class="pn-acts"><button type="button" class="btn small" data-ed="plantillaRubrica">${ic('list-checks')} Plantilla: 5 criterios ponderados (con autoría)</button></div></div>` : ''}
    </div><aside class="cl-dlg-side">
      ${e.tipo === 'recuperacion' ? `<label class="pn-f">${ic('user-check')} Solo para los nº de lista<input name="para" inputmode="numeric" maxlength="200" placeholder="p. ej. 3, 7, 12" value="${esc((e.para || []).join(', '))}"><span class="pn-small">Solo la ven estos alumnos de los grupos marcados. El resto del grupo no sabe que existe.</span></label>` : ''}
      <fieldset class="pn-f"><legend>Para</legend>${gs.map((g) => `<label class="pn-chk"><input type="checkbox" name="grupos" value="${esc(g.id)}" ${(e.grupos || []).includes(g.id) ? 'checked' : ''}> ${esc(g.nombre)}</label>`).join('') || '<span class="pn-small">No hay grupos de esta asignatura en este curso: créalos en el panel → «Grupos y códigos».</span>'}</fieldset>
      ${entregable ? `<label class="pn-f">Puntos<input type="number" name="puntos" min="1" max="1000" step="0.5" placeholder="Sin calificar" value="${e.puntos ?? ''}"></label>` : ''}
      ${entregable && e.tipo !== 'examen' ? `<label class="pn-f">Fecha de entrega<input type="datetime-local" name="fechaEntrega" value="${esc(aLocal(e.fechaEntrega))}"></label>` : ''}
      <label class="pn-f">Tema<select name="tema">${opt('', 'Sin tema', e.tema || '')}${temas.map((t) => opt(t.id, t.nombre, e.tema || '')).join('')}</select></label>
      ${entregable && e.tipo !== 'examen' ? `<label class="pn-f">Criterio (opcional)<input name="criterio" maxlength="60" placeholder="p. ej. eee_c1_1" value="${esc(e.criterio || '')}"></label>` : ''}
      ${entregable ? `<label class="pn-f">Categoría en el cuaderno<select name="categoria">${CATEGORIAS.map((c) => opt(c.id, c.nombre, e.categoria || categoriaDe(e.tipo))).join('')}</select></label>` : ''}
      <fieldset class="pn-f cl-estado"><legend>Estado</legend>
        <label class="pn-chk"><input type="radio" name="estado" value="publicar" ${e.estado === 'publicar' ? 'checked' : ''}> Publicar ahora</label>
        <label class="pn-chk"><input type="radio" name="estado" value="programar" ${e.estado === 'programar' ? 'checked' : ''}> Programar</label>
        <input type="datetime-local" name="pub" value="${esc(aLocal(e.pub || Date.now() + 864e5))}" aria-label="Fecha de publicación">
        <label class="pn-chk"><input type="radio" name="estado" value="borrador" ${e.estado === 'borrador' ? 'checked' : ''}> Guardar borrador</label></fieldset>
    </aside></div>
    <footer class="cl-dlg-f"><span class="pn-msg" id="apItemMsg"></span><span class="pn-grow"></span><button class="btn" type="button" data-ed="cancelar">Cancelar</button><button class="btn primary" type="submit">${e.id ? '💾 Guardar' : '✔ Crear'}</button></footer>
    </form>`;
  }
  function preguntasHTML() {
    if (!E.preguntas.length) return '<p class="pn-small">Sin preguntas todavía.</p>';
    return E.preguntas.map((q, i) => `<div class="ap-q" data-qi="${i}"><div class="ap-qh"><b>${i + 1}.</b> ${esc(TIPOS_PREGUNTA[q.tipo]?.nombre || q.tipo)}
        <label>Puntos <input type="number" class="ap-qp" data-qf="puntos" min="0.25" max="100" step="0.25" value="${esc(q.puntos ?? 1)}"></label>
        <label class="ap-qc">Criterio <input type="text" data-qf="criterio" maxlength="60" value="${esc(q.criterio || '')}" placeholder="p. ej. eee_c1_1" title="Criterio de evaluación (opcional)"></label>
        <span class="pn-grow"></span><button type="button" class="btn small" data-ed="qUp" ${i ? '' : 'disabled'} aria-label="Subir">↑</button><button type="button" class="btn small" data-ed="qDown" ${i < E.preguntas.length - 1 ? '' : 'disabled'} aria-label="Bajar">↓</button><button type="button" class="btn small pn-peligro" data-ed="qDel" aria-label="Quitar">🗑</button></div>
      <textarea data-qf="enunciado" rows="2" maxlength="2000" placeholder="Enunciado de la pregunta">${esc(q.enunciado)}</textarea>
      ${q.tipo === 'test' ? `<div class="ap-ops">${q.opciones.map((o, j) => `<label class="ap-op"><input type="radio" name="corr_${esc(q.id)}" data-qf="correcta" value="${j}" ${Number(q.correcta) === j ? 'checked' : ''} title="Respuesta correcta"><input type="text" data-qf="op" data-j="${j}" maxlength="500" value="${esc(o)}" placeholder="Opción ${j + 1}"></label>`).join('')}
          <button type="button" class="btn small" data-ed="op+">➕ Opción</button>${q.opciones.length > 2 ? '<button type="button" class="btn small" data-ed="op-">➖ Opción</button>' : ''}<span class="pn-small"> Marca el círculo de la correcta.</span></div>`
      : q.tipo === 'vf' ? `<label class="ap-op">Respuesta correcta: <select data-qf="correcta"><option value="true" ${q.correcta === true ? 'selected' : ''}>Verdadero</option><option value="false" ${q.correcta === false ? 'selected' : ''}>Falso</option></select></label>`
      : q.tipo === 'corta' ? `<label class="pn-f">Respuestas aceptadas (una por línea; vacío = corrección manual)<textarea data-qf="aceptadas" rows="2" maxlength="2000">${esc((q.correcta || []).join('\n'))}</textarea></label>`
      : q.tipo === 'emparejar' ? `<label class="pn-f">Parejas (una por línea: «izquierda | derecha»; se puntúa cada pareja)<textarea data-qf="pares" rows="4" maxlength="4000">${esc((q.pares || []).map((p) => p.join(' | ')).join('\n'))}</textarea></label><label class="pn-f">Distractores (opcional: opciones de la derecha que no van con ninguna, una por línea)<textarea data-qf="distractores" rows="2" maxlength="2000">${esc((q.distractores || []).join('\n'))}</textarea></label>`
      : q.tipo === 'ordenar' ? `<label class="pn-f">Elementos EN EL ORDEN CORRECTO (uno por línea; al alumno le salen desordenados)<textarea data-qf="elementos" rows="4" maxlength="4000">${esc((q.elementos || []).join('\n'))}</textarea></label>`
      : q.tipo === 'huecos' ? `<label class="pn-f">Texto con huecos: escribe la respuesta entre [[ ]]; otras válidas con «|». Ej.: La ley de [[Ohm]] relaciona [[intensidad|corriente]]…<textarea data-qf="texto" rows="3" maxlength="3000">${esc(q.texto || '')}</textarea></label>`
      : q.tipo === 'numerica' ? `<div class="ap-fila"><label class="pn-f">Valor correcto<input type="text" inputmode="decimal" data-qf="valor" value="${esc(String(q.valor ?? 0).replace('.', ','))}"></label><label class="pn-f">Tolerancia<input type="text" inputmode="decimal" data-qf="tolerancia" value="${esc(String(q.tolerancia ?? 0).replace('.', ','))}"></label><label class="pn-f">Tipo de tolerancia<select data-qf="modo"><option value="abs" ${q.modo !== 'pct' ? 'selected' : ''}>Absoluta (±)</option><option value="pct" ${q.modo === 'pct' ? 'selected' : ''}>En %</option></select></label><label class="pn-f">Unidad (opcional)<input data-qf="unidad" maxlength="20" value="${esc(q.unidad || '')}"></label></div>`
      : q.tipo === 'zonas' ? `<label class="pn-f">Imagen (https://… o materiales/…)<input data-qf="imagen" maxlength="500" value="${esc(q.imagen || '')}"></label><label class="pn-f">Zonas en % de la imagen, una por línea: «x, y, ancho, alto | nombre | sí» (sí = correcta)<textarea data-qf="zonasTxt" rows="3" maxlength="2000" placeholder="40, 30, 20, 15 | Condensador | sí">${esc(zonasTexto(q.zonas))}</textarea></label>${q.imagen ? `<div class="ex-zonas ex-zonas-prof"><img src="${esc(q.imagen)}" alt="">${(q.zonas || []).map((z) => `<span class="ex-zona ${z.correcta === false ? '' : 'ok'}" style="left:${z.x}%;top:${z.y}%;width:${z.w}%;height:${z.h}%" title="${esc(z.nombre || '')}"></span>`).join('')}</div>` : ''}`
      : ''}</div>`).join('');
  }
  function leerPreguntas() {
    const box = E.el?.querySelector('#apPreguntas'); if (!box) return;
    box.querySelectorAll('.ap-q').forEach((el) => {
      const q = E.preguntas[+el.dataset.qi]; if (!q) return;
      q.enunciado = el.querySelector('[data-qf=enunciado]').value.slice(0, 2000);
      q.puntos = Math.max(0.25, Math.min(100, Number(String(el.querySelector('[data-qf=puntos]').value).replace(',', '.')) || 1));
      const qc = el.querySelector('[data-qf=criterio]'); if (qc) { const v = qc.value.trim().slice(0, 60); if (v) q.criterio = v; else delete q.criterio; }
      if (q.tipo === 'test') { q.opciones = [...el.querySelectorAll('[data-qf=op]')].map((x) => x.value.slice(0, 500)); const c = el.querySelector('[data-qf=correcta]:checked'); q.correcta = c ? Number(c.value) : 0; }
      if (q.tipo === 'vf') q.correcta = el.querySelector('[data-qf=correcta]').value === 'true';
      if (q.tipo === 'corta') q.correcta = el.querySelector('[data-qf=aceptadas]').value.split('\n').map((s) => s.trim()).filter(Boolean).slice(0, 20);
      const lineas = (k) => (el.querySelector(`[data-qf=${k}]`)?.value || '').split('\n').map((s) => s.trim()).filter(Boolean);
      if (q.tipo === 'emparejar') { q.pares = lineas('pares').slice(0, 12).map((l) => { const i = l.indexOf('|'); return i < 0 ? [l, ''] : [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }); q.distractores = lineas('distractores').slice(0, 6); }
      if (q.tipo === 'ordenar') q.elementos = lineas('elementos').slice(0, 12);
      if (q.tipo === 'huecos') q.texto = el.querySelector('[data-qf=texto]').value.slice(0, 3000);
      if (q.tipo === 'numerica') { const n = (k) => Number(String(el.querySelector(`[data-qf=${k}]`).value).trim().replace(',', '.')); q.valor = n('valor'); q.tolerancia = n('tolerancia') || 0; q.modo = el.querySelector('[data-qf=modo]').value; q.unidad = el.querySelector('[data-qf=unidad]').value.trim().slice(0, 20); }
      if (q.tipo === 'zonas') { q.imagen = el.querySelector('[data-qf=imagen]').value.trim(); q.zonas = leeZonas(el.querySelector('[data-qf=zonasTxt]').value); }
    });
  }
  function leer(f) {
    leerPreguntas();
    const fd = new FormData(f); const e = E.edit;
    e.tipo = String(fd.get('tipo')); e.titulo = String(fd.get('titulo') || '').trim().slice(0, 150);
    e.texto = String(fd.get('texto') || '').slice(0, 20000); e.enlaces = leeEnlaces(fd.get('enlaces'));
    e.grupos = fd.getAll('grupos').map(String); e.estado = String(fd.get('estado') || 'borrador'); e.pub = deLocal(fd.get('pub'));
    e.tema = String(fd.get('tema') || '') || null;
    e.nota = String(fd.get('nota') || '').trim().slice(0, 2000); if (fd.get('quitarPend')) e.pendiente = false;
    if (f.elements.puntos) { const p = Number(String(fd.get('puntos') || '').replace(',', '.')); e.puntos = p > 0 ? Math.min(1000, p) : null; }
    if (f.elements.fechaEntrega) e.fechaEntrega = deLocal(fd.get('fechaEntrega'));
    if (f.elements.rubrica) e.rubrica = leeRubrica(fd.get('rubrica'));
    if (f.elements.categoria) e.categoria = String(fd.get('categoria'));
    if (f.elements.contenido) e.contenidoTxt = String(fd.get('contenido') || '');
    if (f.elements.para) e.para = [...new Set(String(fd.get('para') || '').split(/[,;\s]+/).filter(Boolean).map(Number))].filter((n) => Number.isInteger(n) && n >= 1 && n <= 99).slice(0, 40);
    if (f.elements.criterio) e.criterio = String(fd.get('criterio') || '').trim().slice(0, 60) || null;
    if (f.elements.opciones) e.opciones = String(fd.get('opciones') || '').split('\n').map((s) => s.trim()).filter(Boolean).slice(0, 10).map((s) => s.slice(0, 300));
    if (f.elements.desde) e.examen = { desde: deLocal(fd.get('desde')), hasta: deLocal(fd.get('hasta')), limiteMin: parseInt(fd.get('limiteMin'), 10) || null, barajar: !!fd.get('barajar'), pantallaCompleta: !!fd.get('pantallaCompleta'), n: E.preguntas.length };
  }
  async function guardar(f) {
    leer(f); const e = E.edit; const msg = E.el.querySelector('#apItemMsg');
    const err = (t) => { msg.textContent = t; msg.className = 'pn-msg ko'; };
    if (!e.titulo) return err('Escribe un título.');
    const publicado = e.estado !== 'borrador';
    if (publicado && !e.grupos.length) return err('Para publicarlo, marca al menos un grupo en «Para».');
    if (e.estado === 'programar' && !(e.pub > Date.now())) return err('La fecha de publicación programada tiene que ser futura.');
    const esRec = e.tipo === 'recuperacion';
    if (esRec && publicado && !(e.para || []).length) return err('Escribe los nº de lista que hacen la recuperación (p. ej. 3, 7, 12).');
    const esEx = e.tipo === 'examen';
    if (e.criterio && !criterioValido(e.criterio)) return err('El criterio solo puede llevar letras, números, «_», «.» o «-» (sin espacios), p. ej. eee_c1_1.');
    for (const [i, q] of (esEx ? E.preguntas : []).entries()) if (q.criterio && !criterioValido(q.criterio)) return err(`Pregunta ${i + 1}: el criterio solo puede llevar letras, números, «_», «.» o «-» (sin espacios).`);
    if (esEx) {
      const x = e.examen || {};
      if (!x.desde || !x.hasta || !(x.desde < x.hasta)) return err('El cuestionario tiene que abrirse antes de cerrarse.');
      if (publicado && !E.preguntas.length) return err('El cuestionario no tiene preguntas: añade alguna o guárdalo como borrador.');
      for (const [i, q] of E.preguntas.entries()) {
        if (!q.enunciado.trim()) return err(`La pregunta ${i + 1} no tiene enunciado.`);
        if (q.tipo === 'test' && (q.opciones.filter((o) => o.trim()).length < 2 || !String(q.opciones[q.correcta] || '').trim())) return err(`La pregunta ${i + 1} necesita al menos 2 opciones y la correcta marcada.`);
        if (!BASICAS.includes(q.tipo)) { const errs = []; validarPregunta(q, i, (r, t) => errs.push(t)); if (errs.length) return err(errs[0]); }
      }
    }
    const M = motor(e.tipo);
    if (M) {
      let j; try { j = JSON.parse(e.contenidoTxt ?? JSON.stringify(e.contenido || {})); } catch (x) { return err('El contenido no es un JSON válido: revisa comas, comillas y llaves.'); }
      if (!j || typeof j !== 'object' || Array.isArray(j)) return err('El contenido tiene que ser un objeto JSON { … }.');
      const errs = []; const limpio = M.validar(j, (r, t) => errs.push(`contenido${r ? '.' + r : ''}: ${t}`));
      if (errs.length) return err(errs.slice(0, 3).join(' · '));
      e.contenido = e.tipo === 'piac' ? completarPiac(limpio, e.grupos) : limpio;
    }
    msg.textContent = 'Guardando…'; msg.className = 'pn-msg';
    const id = e.id || idItem();
    const entregable = entregableDe(e.tipo);
    const data = { curso: e.curso, asig: e.asig, tema: e.tema || null, tipo: e.tipo, titulo: e.titulo, texto: e.texto, enlaces: e.enlaces,
      fechaEntrega: entregable && !esEx ? e.fechaEntrega || null : null, puntos: entregable ? e.puntos ?? null : null,
      rubrica: entregable && !esEx ? e.rubrica || [] : [], categoria: entregable ? e.categoria || categoriaDe(e.tipo) : null, opciones: e.tipo === 'pregunta' ? e.opciones || [] : null,
      grupos: e.grupos, visible: publicado && !esRec ? e.grupos : [], publicado, pub: e.estado === 'programar' ? e.pub : null,
      orden: e.orden ?? 1000, origen: e.origen || null, pendiente: !!e.pendiente && !e.texto.replace(PEND, '').trim() && !e.enlaces.length, nota: e.nota || null,
      examen: esEx ? { desde: e.examen.desde, hasta: e.examen.hasta, limiteMin: e.examen.limiteMin, n: E.preguntas.length, ...(e.examen.pantallaCompleta ? { pantallaCompleta: true } : {}) } : null, actualizado: Date.now() };
    if (e.unidad) data.unidad = e.unidad;
    if (esRec) { data.para = e.para || []; data.visibleAl = publicado ? visibleAlDe(e.grupos, data.para) : []; }
    if (e.criterio && entregable && !esEx) data.criterio = e.criterio;
    if (e.contenido && M) data.contenido = e.contenido;
    try {
      const b = writeBatch(db);
      b.set(doc(db, 'items', id), data);
      if (esEx) {
        const sep = E.preguntas.map((q) => (BASICAS.includes(q.tipo) ? null : separarPregunta(validarPregunta(q, 0, () => { }) || q)));
        const qs = E.preguntas.map((q, i) => sep[i] ? sep[i].publica : ({ id: q.id, tipo: q.tipo, enunciado: q.enunciado, puntos: q.puntos, ...(q.criterio ? { criterio: q.criterio } : {}), ...(q.tipo === 'test' ? { opciones: q.opciones } : {}) }));
        b.set(doc(db, 'examenes', id), { grupos: e.grupos, publicado, desde: Timestamp.fromMillis(e.examen.desde), hasta: Timestamp.fromMillis(e.examen.hasta), limiteMin: e.examen.limiteMin, barajar: e.examen.barajar, preguntas: qs, ...(e.examen.pantallaCompleta ? { pantallaCompleta: true } : {}) });
        b.set(doc(db, 'claves', id), { respuestas: Object.fromEntries(E.preguntas.map((q, i) => [q.id, sep[i] ? sep[i].clave : q.correcta])) });
      } else if (e.id && st.items.get(e.id)?.tipo === 'examen') { b.delete(doc(db, 'examenes', id)); b.delete(doc(db, 'claves', id)); }
      await b.commit(); aula.olvidarExamen(id);
      const cb = E.alGuardar; cerrar(); cb?.(id);
    } catch (er) { err('❌ No se ha podido guardar (' + (er?.code || er?.message || 'error') + ').'); }
  }
  function onClick(ev) {
    if (ev.target === E.el) { if (confirm('¿Cerrar sin guardar?')) cerrar(); return; }
    const b = ev.target.closest('[data-ed]'); if (!b) return;
    const acc = b.dataset.ed;
    if (acc === 'cancelar') return cerrar();
    if (acc === 'ejemplo') { const M = motor(E.edit.tipo); const ta = b.form?.elements.contenido; if (M && ta && (!ta.value.trim() || confirm('¿Cambiar el contenido por el ejemplo?'))) { ta.value = JSON.stringify(M.ejemplo || {}, null, 2); E.edit.contenidoTxt = ta.value; } return; }
    if (acc === 'plantillaRubrica') { const ta = b.form?.elements.rubrica; if (ta && (!ta.value.trim() || confirm('¿Cambiar la rúbrica por la plantilla de 5 criterios?'))) ta.value = rubricaPlantillaTexto(); return; }
    if (acc === 'exportar') { const it = st.items.get(E.edit?.id); if (it) api.exportar?.(it); return; }
    if (acc === 'adj') {
      const f = b.form; const u = f.adjU.value.trim(); const t = f.adjT.value.trim();
      if (!enlaceValido(u)) { f.adjU.setCustomValidity('Pega un enlace que empiece por https:// (o materiales/…)'); f.adjU.reportValidity(); f.adjU.setCustomValidity(''); return; }
      f.enlaces.value = (f.enlaces.value.trim() ? f.enlaces.value.trim() + '\n' : '') + (t ? `${t} | ${u}` : u); f.adjU.value = ''; f.adjT.value = ''; return;
    }
    if (acc === 'banco') { leerPreguntas(); api.desdeBanco?.(E.edit.asig, (L) => { E.preguntas.push(...L); E.el.querySelector('#apPreguntas').innerHTML = preguntasHTML(); }); return; }
    if (acc.startsWith('q+')) { leerPreguntas(); E.preguntas.push(nuevaPregunta(acc.slice(2))); E.el.querySelector('#apPreguntas').innerHTML = preguntasHTML(); return; }
    const qi = +b.closest('[data-qi]')?.dataset.qi;
    if (['qUp', 'qDown', 'qDel', 'op+', 'op-'].includes(acc)) {
      leerPreguntas(); const P = E.preguntas;
      if (acc === 'qUp' && qi > 0) [P[qi - 1], P[qi]] = [P[qi], P[qi - 1]];
      if (acc === 'qDown' && qi < P.length - 1) [P[qi + 1], P[qi]] = [P[qi], P[qi + 1]];
      if (acc === 'qDel' && confirm('¿Quitar esta pregunta?')) P.splice(qi, 1);
      if (acc === 'op+' && P[qi].opciones.length < 8) P[qi].opciones.push('');
      if (acc === 'op-' && P[qi].opciones.length > 2) { P[qi].opciones.pop(); if (P[qi].correcta >= P[qi].opciones.length) P[qi].correcta = 0; }
      E.el.querySelector('#apPreguntas').innerHTML = preguntasHTML();
    }
  }
  function onChange(ev) {
    const t = ev.target;
    if (t.name === 'tipo' && t.form?.id === 'apItemForm') {
      leer(t.form); const e = E.edit;
      if (e.tipo === 'examen' && !e.examen) e.examen = { desde: Date.now(), hasta: Date.now() + 864e5, limiteMin: 30, barajar: true };
      e.categoria = categoriaDe(e.tipo); if (e.tipo === 'material') e.puntos = null; else if (e.puntos == null) e.puntos = 10;
      montar();
    }
    if (t.name === 'pub') { const r = t.form.querySelector('input[name=estado][value=programar]'); if (r) r.checked = true; }
  }
  function onSubmit(ev) { if (ev.target.id === 'apItemForm') { ev.preventDefault(); guardar(ev.target); } }
  const api = { abrir, cerrar, abierto: () => !!E.el, set alGuardar(f) { E.alGuardar = f; }, exportar: null };
  return api;
}

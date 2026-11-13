// «Importar JSON» y «Exportar JSON» del «Trabajo de clase» (profesor).
//  · Importar: pegas (o abres) un JSON con uno o varios elementos («superprofe/elemento@1»), se valida
//    con errores en castellano, se ve una vista previa y se guarda SIEMPRE como borrador.
//  · Exportar: cualquier elemento → JSON (sirve de copia y de plantilla para crear otros).
import { doc, writeBatch, Timestamp } from 'firebase/firestore';
import { esc } from './util.js';
import { ic } from './ico.js';
import '../lms/motores/index.js';
import { leerJSON, exportarElemento, motor } from '../lms/elemento.js';
import { separarPregunta, unirPregunta, TIPOS_PREGUNTA } from '../lms/preguntas.js';
import { idItem, categoriaDe, TIPOS_ENTREGA, fmtNota } from '../lms/modelo.js';
import { TIPOS, asignatura } from '../lms/biblioteca.js';
import { textoHTML } from './aula-vistas.js';

const fF = (t) => (t ? new Date(t).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }) : '—');
const opt = (v, t, sel) => `<option value="${esc(v)}" ${v === sel ? 'selected' : ''}>${esc(t)}</option>`;

// Elemento validado → documentos de Firestore (item; y examen + claves si es un examen). Siempre borrador.
export function documentosDe(el, { curso, asig, tema = null, grupos = [], orden = 1000 }) {
  const esEx = el.tipo === 'examen';
  const entregable = TIPOS_ENTREGA.includes(el.tipo) || esEx || !!motor(el.tipo)?.entregable;
  const separadas = esEx ? el.preguntas.map(separarPregunta) : [];
  const ex = esEx ? { desde: el.examen.desde || Date.now() + 864e5, hasta: el.examen.hasta || (el.examen.desde || Date.now() + 864e5) + 864e5, limiteMin: el.examen.limiteMin ?? null, barajar: el.examen.barajar !== false, pantallaCompleta: !!el.examen.pantallaCompleta } : null;
  const item = { curso, asig, tema, tipo: el.tipo, titulo: el.titulo, texto: el.texto || '', enlaces: el.enlaces || [],
    fechaEntrega: entregable && !esEx ? el.fechaEntrega || null : null, puntos: entregable ? el.puntos ?? (esEx ? 10 : null) : null,
    rubrica: entregable && !esEx ? el.rubrica || [] : [], categoria: entregable ? el.categoria || categoriaDe(el.tipo) : null,
    opciones: el.tipo === 'pregunta' ? el.opciones || [] : null, grupos, visible: [], publicado: false, pub: null, orden, origen: null,
    pendiente: false, nota: el.nota || null, examen: esEx ? { desde: ex.desde, hasta: ex.hasta, limiteMin: ex.limiteMin, n: separadas.length, ...(ex.pantallaCompleta ? { pantallaCompleta: true } : {}) } : null, actualizado: Date.now() };
  if (el.criterio) item.criterio = el.criterio;
  if (el.contenido) item.contenido = el.contenido;
  const examen = esEx ? { grupos, publicado: false, desde: Timestamp.fromMillis(ex.desde), hasta: Timestamp.fromMillis(ex.hasta), limiteMin: ex.limiteMin, barajar: ex.barajar, preguntas: separadas.map((s) => s.publica), ...(ex.pantallaCompleta ? { pantallaCompleta: true } : {}) } : null;
  const claves = esEx ? { respuestas: Object.fromEntries(separadas.map((s) => [s.publica.id, s.clave])) } : null;
  return { item, examen, claves };
}

// Vista previa (lo que se va a crear)
export function vistaPreviaHTML(el) {
  const T = TIPOS[el.tipo]; const m = motor(el.tipo);
  const meta = [T?.nombre || el.tipo, el.puntos ? `${fmtNota(el.puntos)} puntos` : (el.tipo === 'material' ? '' : 'sin calificar'), el.fechaEntrega ? 'entrega ' + fF(el.fechaEntrega) : '', el.criterio ? 'criterio ' + el.criterio : ''].filter(Boolean).join(' · ');
  let h = `<article class="js-prev"><div class="js-prev-h"><span class="cl-ic t-${esc(el.tipo)}">${ic('file-text')}</span><div><b>${esc(el.titulo)}</b><div class="pn-small">${esc(meta)}</div></div></div>`;
  if (el.texto) h += `<div class="au-texto">${textoHTML(el.texto.slice(0, 1500))}${el.texto.length > 1500 ? '<p class="pn-small">…</p>' : ''}</div>`;
  if (el.enlaces?.length) h += `<ul class="js-prev-l">${el.enlaces.map((e) => `<li>${ic('link')} ${esc(e.t || e.u)} <span class="pn-small">${esc(e.u)}</span></li>`).join('')}</ul>`;
  if (el.rubrica?.length) h += `<p class="pn-small"><b>Rúbrica:</b> ${el.rubrica.map((r) => `${esc(r.c)} (${esc(fmtNota(r.p))})`).join(' · ')}</p>`;
  if (el.opciones?.length) h += `<p class="pn-small"><b>Opciones:</b> ${el.opciones.map(esc).join(' · ')}</p>`;
  if (el.tipo === 'examen') {
    const x = el.examen;
    h += `<p class="pn-small"><b>Examen:</b> ${x.desde ? 'abre ' + esc(fF(x.desde)) : 'abre mañana (cámbialo al editar)'} · ${x.hasta ? 'cierra ' + esc(fF(x.hasta)) : ''} · ${x.limiteMin ? x.limiteMin + ' min' : 'sin límite de tiempo'}${x.barajar ? ' · barajado' : ''}${x.pantallaCompleta ? ' · modo examen (pantalla completa)' : ''}</p>
      <ol class="js-prev-q">${el.preguntas.map((q) => `<li><span class="js-tq">${esc(TIPOS_PREGUNTA[q.tipo]?.nombre || q.tipo)}</span> ${esc(q.enunciado.slice(0, 200))} <span class="pn-small">(${esc(fmtNota(q.puntos))} pt${q.criterio ? ' · ' + esc(q.criterio) : ''})</span></li>`).join('')}</ol>`;
  }
  if (m?.resumen && el.contenido) h += `<p class="pn-small"><b>Contenido:</b> ${esc(m.resumen(el.contenido))}</p>`;
  return h + '</article>';
}

export function crearJson({ db, aula, modal, cerrarModal, gruposDe }) {
  const st = aula.st;
  // ---------------------------------------------------------------- importar
  function importar({ curso, asig, tema = null, temas = [] }) {
    let elementos = []; let texto = '';
    const ejemplo = JSON.stringify({ formato: 'superprofe/elemento@1', tipo: 'tarea', titulo: 'Título de la tarea', instrucciones: 'Qué hay que hacer.', puntos: 10, criterio: 'eee_c1_1' }, null, 2);
    const html = `<header class="cl-dlg-h"><h3>${ic('upload')} Importar JSON · ${esc(asignatura(asig)?.corto || asig)}</h3><span class="pn-grow"></span><button class="btn" data-m="cerrar" aria-label="Cerrar">${ic('x')}</button></header>
      <div class="cl-dlg-b1 js-imp">
        <p class="pn-small">Pega un elemento (tarea, examen, material, pregunta…) en formato <code>superprofe/elemento@1</code>, o una lista de ellos. Se guarda como <b>borrador</b>: nadie lo ve hasta que lo publiques. Formato y ejemplos: <code>FORMATO_IMPORTAR.md</code>.</p>
        <label class="pn-f">JSON<textarea data-m-f="json" rows="12" spellcheck="false" class="js-ta" placeholder='${esc(ejemplo)}'></textarea></label>
        <div class="ap-fila"><label class="pn-f">Tema<select data-m-f="tema">${opt('', 'Sin tema', tema || '')}${temas.map((t) => opt(t.id, t.nombre, tema || '')).join('')}</select></label>
        <label class="pn-f">O abre un archivo<input type="file" accept="application/json,.json" data-m-f="archivo"></label></div>
        <div class="pn-acts"><button class="btn" data-m="validar">${ic('check')} Validar y ver</button><button class="btn primary" data-m="guardar" disabled>${ic('save')} Guardar como borrador</button><button class="btn" data-m="cerrar">Cancelar</button><span class="pn-msg" id="jsMsg" aria-live="polite"></span></div>
        <div id="jsErr" class="js-err" role="alert"></div><div id="jsPrev"></div></div>`;
    const m = modal(html, async (acc, b, m) => {
      const msg = m.querySelector('#jsMsg'); const ta = m.querySelector('[data-m-f=json]');
      const validar = () => {
        texto = ta.value; const r = leerJSON(texto); elementos = r.elementos;
        m.querySelector('#jsErr').innerHTML = r.errores.length ? `<b>Hay ${r.errores.length} error${r.errores.length === 1 ? '' : 'es'}:</b><ul>${r.errores.slice(0, 30).map((e) => `<li>${e.ruta ? `<code>${esc(e.ruta)}</code> · ` : ''}${esc(e.texto)}</li>`).join('')}</ul>` : '';
        m.querySelector('#jsPrev').innerHTML = elementos.length ? `<h4>Vista previa (${elementos.length} elemento${elementos.length === 1 ? '' : 's'})</h4>${elementos.map(vistaPreviaHTML).join('')}` : '';
        m.querySelector('[data-m=guardar]').disabled = !elementos.length;
        msg.textContent = elementos.length ? 'JSON correcto' : ''; msg.className = 'pn-msg ok';
      };
      if (acc === 'change' && b.dataset.mF === 'archivo' && b.files?.[0]) { ta.value = await b.files[0].text(); validar(); return; }
      if (acc === 'validar') return validar();
      if (acc === 'guardar') {
        if (ta.value !== texto) validar(); if (!elementos.length) return;
        b.disabled = true; msg.textContent = 'Guardando…'; msg.className = 'pn-msg';
        const temaSel = m.querySelector('[data-m-f=tema]').value || null; const grupos = gruposDe(curso, asig).map((g) => g.id);
        const enTema = [...st.items.values()].filter((x) => x.curso === curso && x.asig === asig && (x.tema ?? null) === temaSel);
        let orden = (enTema.length ? Math.min(...enTema.map((x) => x.orden ?? 0)) : 0) - 1000 * elementos.length;
        try {
          const ids = [];
          for (let i = 0; i < elementos.length; i += 100) {
            const lote = writeBatch(db);
            for (const el of elementos.slice(i, i + 100)) {
              const id = idItem(); const d = documentosDe(el, { curso, asig, tema: temaSel, grupos, orden }); orden += 1000;
              lote.set(doc(db, 'items', id), d.item); if (d.examen) { lote.set(doc(db, 'examenes', id), d.examen); lote.set(doc(db, 'claves', id), d.claves); }
              ids.push(id);
            }
            await lote.commit();
          }
          msg.textContent = `${ids.length === 1 ? 'Guardado' : ids.length + ' elementos guardados'} como borrador.`; msg.className = 'pn-msg ok';
          m.querySelector('#jsPrev').insertAdjacentHTML('afterbegin', `<div class="pn-acts">${ids.length === 1 ? `<button class="btn primary" data-m="abrir" data-id="${esc(ids[0])}">${ic('pencil')} Abrir en el editor</button>` : ''}<button class="btn" data-m="cerrar">Cerrar</button></div>`);
        } catch (er) { b.disabled = false; msg.textContent = 'No se ha podido guardar (' + (er?.code || er?.message || 'error') + ').'; msg.className = 'pn-msg ko'; }
      }
      if (acc === 'abrir') { const id = b.dataset.id; cerrarModal(); const it = st.items.get(id); if (it) window.PORTAL?.aula?.editar?.(id); }
    });
    m.querySelector('[data-m-f=json]')?.focus();
  }

  // ---------------------------------------------------------------- exportar
  async function exportar(it) {
    let datos = {};
    if (it.tipo === 'examen') { try { const { examen, claves } = await aula.examen(it.id, { claves: true }); datos = { preguntas: examen?.preguntas || [], claves: claves?.respuestas || {}, examen }; } catch (e) { /* sin preguntas */ } }
    const json = JSON.stringify(exportarElemento(it, datos), null, 2);
    const nombre = (it.titulo || 'elemento').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w]+/g, '_').slice(0, 50) + '.json';
    modal(`<header class="cl-dlg-h"><h3>${ic('download')} Exportar JSON</h3><span class="pn-grow"></span><button class="btn" data-m="cerrar" aria-label="Cerrar">${ic('x')}</button></header>
      <div class="cl-dlg-b1"><p class="pn-small">Copia de «${esc(it.titulo)}». Guárdala o úsala de plantilla: cámbiale lo que quieras y pégala en «Importar JSON».${it.tipo === 'examen' ? ' <b>Incluye las soluciones</b>: no se la pases a los alumnos.' : ''}</p>
      <textarea class="js-ta" rows="16" readonly spellcheck="false" data-m-f="out">${esc(json)}</textarea>
      <div class="pn-acts"><button class="btn primary" data-m="copiar">${ic('copy')} Copiar</button><button class="btn" data-m="bajar">${ic('download')} Descargar .json</button><button class="btn" data-m="cerrar">Cerrar</button><span class="pn-msg" id="jsOut" aria-live="polite"></span></div></div>`, async (acc, b, m) => {
      const out = m.querySelector('#jsOut');
      if (acc === 'copiar') { try { await navigator.clipboard.writeText(json); out.textContent = 'Copiado'; } catch (e) { m.querySelector('[data-m-f=out]').select(); document.execCommand?.('copy'); out.textContent = 'Copiado'; } }
      if (acc === 'bajar') { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([json], { type: 'application/json' })); a.download = nombre; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 5000); }
    });
    return json;
  }
  return { importar, exportar };
}
export { unirPregunta };

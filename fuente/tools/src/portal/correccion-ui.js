// Fase 10 · Vista de corrección (profesor): un alumno cada vez, el trabajo a un lado y la rúbrica por
// niveles al otro (clic en el nivel), anterior / siguiente, comentarios rápidos reutilizables y notas en
// borrador que se publican a mano (una a una o todas a la vez). Los criterios «clase» no puntúan aquí.
import { doc, setDoc, updateDoc, getDoc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { esc, nombreArchivo } from './util.js';
import { ic } from './ico.js';
import { notaRubrica, fmtNota, redondea, idTrabajo, urlSegura, puntosNivel, nivelDePuntos } from '../lms/modelo.js';
import { estadoTrabajo, cuentaComoEntrega } from '../lms/entrega.js';
import { estadoChipHTML } from './entrega-ui.js';
import { leerResultado } from '../act/resultado.js';
import { limpiarDoc, contarPalabras } from '../lms/doc-html.js';
import { hojaLecturaHTML } from './hoja-ui.js';
import { despachoLecturaHTML, montarCentralita } from './despacho-ui.js';
import { botonModelo, botonesEnlaces3D, es3D } from './modelo3d-ui.js';
import { rellenarImagenes, descargarDocx, imagenesParaDocx } from './doc-editor.js';
import { confirmar, avisar } from './dialogo.js';
import { leeArchivoCorreccion, FORMATO_CORRECCION, NOMBRES_NIVELES } from '../lms/correccion-json.js';
import { NIVELES_TABLA } from './rubrica-ui.js';
import { enlacesVivosHTML, slotCopias, rellenarCopias } from './copias-ui.js';

const pad = (n) => String(n).padStart(2, '0');
const fFecha = (t) => (t ? new Date(t).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }) : '—');
const COMENTARIOS_INICIALES = ['Muy buen trabajo.', 'Revisa la ortografía.', 'Falta la conclusión.', 'Explica mejor el proceso.', 'Cita las fuentes que has usado.'];

export function crearCorreccion({ db, st, A, grupoSel, filas, $, pintarTodo, textoHTML }) {
  const C = { it: null, g: null, n: 1, soloEntregas: true, sel: {}, rapidos: null, cargandoR: false, clave: '' };
  const ids = (n) => idTrabajo(C.it.id, C.g.id, n);
  function lista() {
    const F = filas(C.g, C.it.asig);
    return C.soloEntregas ? F.filter((n) => cuentaComoEntrega(A.trabajos.get(ids(n))) || A.notas.get(ids(n))) : F;
  }
  async function cargarRapidos() {
    if (C.rapidos || C.cargandoR) return; C.cargandoR = true;
    try { const d = await getDoc(doc(db, 'config', 'comentarios')); C.rapidos = d.exists() ? d.data().lista || [] : COMENTARIOS_INICIALES.slice(); }
    catch (e) { C.rapidos = COMENTARIOS_INICIALES.slice(); }
    C.cargandoR = false; const r = $('#coRapidos'); if (r) r.innerHTML = rapidosHTML();
  }
  const guardarRapidos = () => setDoc(doc(db, 'config', 'comentarios'), { lista: C.rapidos.slice(0, 60) }).catch(() => { });
  const rapidosHTML = () => (C.rapidos == null ? '<span class="pn-small">Cargando…</span>' : C.rapidos.map((t, i) => `<span class="co-rap"><button type="button" class="btn tiny" data-co="usarRap" data-i="${i}" title="Añadir al comentario">${esc(t)}</button><button type="button" class="co-rap-x" data-co="quitarRap" data-i="${i}" aria-label="Quitar «${esc(t)}» de los comentarios rápidos">${ic('x')}</button></span>`).join('') || '<span class="pn-small">Sin comentarios rápidos.</span>');

  const conEntrega = (x) => cuentaComoEntrega(A.trabajos.get(ids(x)));
  function primero() { const L = lista(); return L.find((x) => conEntrega(x) && A.notas.get(ids(x))?.nota == null) ?? L.find(conEntrega) ?? L[0]; }
  function abrir(it, g, n) {
    C.it = it; C.g = g; C.sel = {}; C.clave = '';
    // Sin nº concreto: se abre el primer alumno con una entrega sin corregir (si no hay, el primero que entregó).
    C.auto = n == null; C.n = n ?? primero() ?? 1; A.corr = true; cargarRapidos();
    // Para importar una corrección desde un navegador automatizado (pide confirmación igual que el botón)
    window.importarCorreccionSuperProfe = (txt) => aplicarArchivo(typeof txt === 'string' ? txt : JSON.stringify(txt));
  }
  function cerrar() { A.corr = false; C.it = null; delete window.importarCorreccionSuperProfe; }

  function trabajoHTML(tr, nt) {
    if (!tr) return '<p class="pn-vacio">Sin entrega. Puedes poner nota igualmente (trabajo hecho en clase o en papel).</p>';
    let h = `<div class="ap-est">${estadoChipHTML(estadoTrabajo(tr, nt))} <span class="pn-small">${fFecha(tr.fecha)}${tr.nEntregas > 1 ? ` · ${tr.nEntregas}.ª entrega` : ''}${C.it.fechaEntrega && tr.fecha > C.it.fechaEntrega ? ' · <b>con retraso</b>' : ''}</span></div>`;
    if (tr.estado === 'borrador') h += '<p class="pn-small">Es un borrador: el alumno todavía no lo ha entregado.</p>';
    const r = leerResultado(tr.texto); if (r) h += `<div class="pn-inf ap-act">${ic('puzzle')} Resultado de la actividad: <b>${r.aciertos}/${r.total}</b> aciertos → nota sugerida <b>${esc(fmtNota(r.nota))}</b></div>`;
    if (window.PORTAL_VISTA_TRABAJO) { const extra = window.PORTAL_VISTA_TRABAJO(C.it, tr); if (extra) h += extra; }
    if (tr.modelo || (tr.enlaces || []).some(es3D)) h += `<div class="co-3d pn-acts">${botonModelo(tr, tr.id || ids(C.n))}${botonesEnlaces3D(tr.enlaces)}</div>`;
    if (tr.doc && C.it.tipo === 'despacho') h += `<div class="co-desp">${despachoLecturaHTML(C.it, tr.doc)}</div>`;
    else if (tr.doc && C.it.tipo === 'hoja') h += `<div class="co-hoja">${hojaLecturaHTML(C.it, tr.doc)}</div>`;
    else if (tr.doc) h += `<div class="co-doc doc-ver">${limpiarDoc(tr.doc)}</div><div class="pn-acts"><span class="pn-small">${contarPalabras(tr.doc)} palabras</span><span class="pn-grow"></span><button type="button" class="btn small" data-co="docx">${ic('file-down')} Descargar .docx</button></div>`;
    else h += `<div class="co-texto">${tr.texto ? textoHTML(tr.texto) : '<span class="pn-small">(sin texto)</span>'}</div>`;
    h += enlacesVivosHTML(tr.enlaces || [], tr.enlacesT || []) + slotCopias(tr.id || ids(C.n));
    if (C.it.tipo === 'documento') h += registroHTML(ids(C.n));
    return h;
  }
  // Registro informativo del documento (fase 11): registros/{trabajo}. Solo lo lee el profesor.
  const REG = new Map();
  function registroHTML(id) {
    if (!REG.has(id)) { REG.set(id, undefined); getDoc(doc(db, 'registros', id)).then((d) => { REG.set(id, d.exists() ? d.data() : null); const T = $('#coTrabajo'); if (T && ids(C.n) === id) { T.innerHTML = trabajoHTML(A.trabajos.get(id), A.notas.get(id)); rellenarImagenes(T, db, id); } }).catch(() => REG.set(id, null)); }
    const r = REG.get(id); if (r === undefined) return '';
    const P = r?.pegados || []; const min = Math.round((r?.seg || 0) / 60);
    return `<details class="co-reg"><summary>${ic('info')} Registro de edición (solo informativo)</summary><p class="pn-small">Tiempo editando: <b>${esc(min)} min</b> · ${P.length} pegado${P.length === 1 ? '' : 's'} grande${P.length === 1 ? '' : 's'} (${esc(200)} caracteres o más).</p>${P.length ? `<ul class="pn-small">${P.slice(-30).map((p) => `<li>${esc(fFecha(p.t))}: ${esc(p.n)} caracteres</li>`).join('')}</ul>` : ''}<p class="pn-small">No cambia la nota ni anula nada: sirve para hablarlo con el alumno si hace falta.</p></details>`;
  }
  function valorCriterio(i, det) { if (C.sel[i] !== undefined) return C.sel[i]; return det['r' + i]; }
  function rubricaHTML(nt) {
    const R = C.it.rubrica || []; const det = nt?.detalle || {};
    if (!R.length) return '<p class="pn-small">Este elemento no tiene rúbrica: pon la nota directamente.</p>';
    return `<div class="co-rub">${R.map((r, i) => {
      if (r.clase) return `<div class="co-crit clase"><div class="co-crit-t">${esc(r.c)}</div><div class="pn-small">${ic('users')} Lo evalúa el profesor en clase (no puntúa aquí)</div></div>`;
      const v = valorCriterio(i, det); const nv = C.sel['n' + i] ?? det['n' + i] ?? nivelDePuntos(r.p, v);
      return `<div class="co-crit" data-ri="${i}"><div class="co-crit-t">${esc(r.c)} <span class="pn-small">· ${esc(fmtNota(r.p))} p</span><span class="co-pts">${v != null && v !== '' ? esc(fmtNota(v)) : '—'}</span></div>
        <div class="co-niv" role="group" aria-label="${esc(r.c)}">${NIVELES_TABLA.map(([k, t]) => `<button type="button" class="co-n ${nv === k ? 'on' : ''}" data-co="nivel" data-ri="${i}" data-k="${k}" aria-pressed="${nv === k}"><b>${esc(t)}</b><span>${esc(fmtNota(puntosNivel(r.p, k)))} p</span>${r.niveles?.[k - 1] ? `<small>${esc(r.niveles[k - 1])}</small>` : ''}</button>`).join('')}</div></div>`;
    }).join('')}</div>`;
  }
  function calc(nt) {
    const R = C.it.rubrica || []; const det = nt?.detalle || {}; const v = {};
    R.forEach((r, i) => { if (r.clase) return; const x = valorCriterio(i, det); if (x != null && x !== '') v[i] = Number(x); });
    return Object.keys(v).length ? notaRubrica(R, v) : null;
  }
  function html() {
    const L = lista(); const pos = L.indexOf(C.n); const id = ids(C.n); const tr = A.trabajos.get(id); const nt = A.notas.get(id);
    const sinPub = [...A.notas.values()].filter((x) => x.item === C.it.id && x.grupo === C.g.id && !x.publicada && x.nota != null).length;
    const c = calc(nt);
    const notaV = C.sel.nota !== undefined ? C.sel.nota : nt?.nota ?? c?.nota ?? '';
    return `<div class="co-bar"><button class="btn" data-co="cerrar">${ic('chevron-left')} Cuaderno</button><div class="co-tit"><b>${esc(C.it.titulo)}</b><span class="pn-small">${esc(C.g.nombre)}</span></div>
        <span class="pn-grow"></span><label class="pn-chk"><input type="checkbox" data-co="solo" ${C.soloEntregas ? 'checked' : ''}> Solo con entrega</label>
        <button class="btn" data-co="ant" ${pos <= 0 ? 'disabled' : ''} aria-label="Alumno anterior">${ic('chevron-left')}</button><span class="co-nn">nº <b>${pad(C.n)}</b> <span class="pn-small">${pos >= 0 ? `${pos + 1} de ${L.length}` : ''}</span></span><button class="btn" data-co="sig" ${pos < 0 || pos >= L.length - 1 ? 'disabled' : ''} aria-label="Alumno siguiente">${ic('chevron-right')}</button>
        <details class="co-mas"><summary class="btn" aria-label="Corregir con un archivo">${ic('file-text')} Archivo</summary><div class="co-mas-m"><button type="button" class="btn small" data-co="exportarCorr">${ic('download')} Exportar para corregir (JSON)</button><button type="button" class="btn small" data-co="importarCorr">${ic('upload')} Importar corrección (JSON)</button><p class="pn-small">Las notas importadas quedan en borrador: revísalas aquí y publícalas.</p></div></details>
        ${sinPub ? `<button class="btn primary" data-co="publicarTodas">${ic('megaphone')} Publicar ${sinPub}</button>` : ''}</div>
      ${C.it.tipo === 'despacho' ? '<div id="dvCentral" class="dv-central-w"></div>' : ''}
      <div class="co-grid"><section class="co-izq pn-card" id="coTrabajo" aria-label="Trabajo del alumno">${trabajoHTML(tr, nt)}</section>
      <section class="co-der pn-card" aria-label="Calificación"><h4>${ic('list-checks')} Rúbrica</h4>${rubricaHTML(nt)}
        <form id="coForm" class="pn-form"><div class="co-nota"><label class="pn-f">Nota (0–10)<input name="nota" id="coNota" type="number" min="0" max="10" step="0.01" value="${esc(notaV)}"></label>${c ? `<span class="pn-small" id="coCalc">${esc(fmtNota(c.puntos))} / ${esc(fmtNota(c.max))} puntos</span>` : '<span id="coCalc"></span>'}
          <span class="co-estado">${nt ? (nt.publicada ? `<span class="en-chip en-calificado">${ic('megaphone')} Publicada</span>` : `<span class="en-chip en-borrador">${ic('pencil')} Borrador (sin publicar)</span>`) : ''}</span></div>
          <label class="pn-f">Comentario para el alumno<textarea name="comentario" id="coCom" maxlength="2000" rows="3">${esc(C.sel.comentario ?? nt?.comentario ?? '')}</textarea></label>
          <div class="co-raps" id="coRapidos">${rapidosHTML()}</div>
          <div class="pn-acts"><button type="button" class="btn tiny" data-co="nuevoRap">${ic('message-square-plus')} Guardar el comentario como rápido</button></div>
          <div class="pn-acts"><button class="btn" type="submit" data-pub="0">${ic('save')} Guardar borrador</button><button class="btn primary" type="submit" data-pub="1">${ic('megaphone')} Guardar y publicar</button><button class="btn" type="submit" data-pub="0" data-sig="1">${ic('save')} Guardar y siguiente ${ic('chevron-right')}</button><span class="pn-msg" id="coMsg"></span></div>
          ${tr?.estado === 'entregado' && tr.tipo === 'tarea' ? `<div class="pn-acts"><button type="button" class="btn small" data-co="devolver">${ic('undo-2')} Devolver para corregir (con el comentario)</button></div>` : ''}
        </form></section></div>`;
  }
  function pintar(B, forzar) {
    // Abierta sin nº: si las entregas llegan después, se salta al primer alumno con entrega (una sola vez).
    if (C.auto && !conEntrega(C.n)) { const k = primero(); if (k != null && conEntrega(k)) { C.n = k; C.auto = false; forzar = true; } }
    else if (C.auto) C.auto = false;
    const clave = `${C.it.id}|${C.g.id}|${C.n}`;
    if (!forzar && C.clave === clave && $('#coForm')) { const T = $('#coTrabajo'); if (T) { const id = ids(C.n); T.innerHTML = trabajoHTML(A.trabajos.get(id), A.notas.get(id)); rellenarImagenes(T, db, id); rellenarCopias(T, db); } return; }
    C.clave = clave; B.innerHTML = html(); rellenarImagenes($('#coTrabajo'), db, ids(C.n)); rellenarCopias($('#coTrabajo'), db);
    if (C.it.tipo === 'despacho') montarCentralita($('#dvCentral'), { db, it: C.it, g: C.g, numeros: filas(C.g, C.it.asig), trabajoDe: (n) => A.trabajos.get(ids(n)) });
  }
  function ir(d) { const L = lista(); const i = L.indexOf(C.n); const j = i < 0 ? 0 : i + d; if (j >= 0 && j < L.length) { C.n = L[j]; C.sel = {}; pintarTodo(true); } }
  function recalc() {
    const nt = A.notas.get(ids(C.n)); const c = calc(nt); if (!c) return;
    const inp = $('#coNota'); if (inp) inp.value = c.nota; C.sel.nota = c.nota;
    const s = $('#coCalc'); if (s) s.textContent = `${fmtNota(c.puntos)} / ${fmtNota(c.max)} puntos`;
  }
  async function guardar(publicar, siguiente) {
    const id = ids(C.n); const nt = A.notas.get(id); const msg = $('#coMsg');
    const raw = String($('#coNota')?.value || '').trim().replace(',', '.'); const nota = raw === '' ? null : redondea(+raw);
    if (nota != null && !(nota >= 0 && nota <= 10)) { msg.textContent = 'La nota va de 0 a 10.'; msg.className = 'pn-msg ko'; return; }
    const R = C.it.rubrica || []; const detalle = { ...(nt?.detalle || {}) };
    R.forEach((r, i) => { if (r.clase) return; if (C.sel[i] !== undefined) detalle['r' + i] = C.sel[i]; if (C.sel['n' + i] !== undefined) detalle['n' + i] = C.sel['n' + i]; });
    const c = calc(nt);
    msg.textContent = 'Guardando…'; msg.className = 'pn-msg';
    try {
      await setDoc(doc(db, 'notas', id), { item: C.it.id, curso: C.it.curso, asig: C.it.asig, al: `${C.g.id}_${C.n}`, grupo: C.g.id, numero: C.n, nota, puntos: c?.puntos ?? null, max: c?.max ?? null, detalle, comentario: String($('#coCom')?.value || '').slice(0, 2000), publicada: !!publicar, fecha: Date.now() });
      C.sel = {};
      if (siguiente) { const L = lista(); const i = L.indexOf(C.n); if (i >= 0 && i < L.length - 1) { C.n = L[i + 1]; pintarTodo(true); return; } }
      pintarTodo(true); const m = $('#coMsg'); if (m) { m.innerHTML = ic('check') + (publicar ? ' Publicada' : ' Guardada (borrador)'); m.className = 'pn-msg ok'; }
    } catch (e) { msg.textContent = 'No se ha podido guardar (' + (e?.code || 'error') + ').'; msg.className = 'pn-msg ko'; }
  }
  async function publicarTodas() {
    const L = [...A.notas.values()].filter((x) => x.item === C.it.id && x.grupo === C.g.id && !x.publicada && x.nota != null);
    if (!L.length || !await confirmar(`¿Publicar ${L.length} nota(s) de ${C.g.nombre}? Los alumnos las verán al momento.`)) return;
    for (let i = 0; i < L.length; i += 400) { const b = writeBatch(db); L.slice(i, i + 400).forEach((x) => b.update(doc(db, 'notas', x.id), { publicada: true })); await b.commit(); }
    pintarTodo(true);
  }
  async function devolver() {
    const id = ids(C.n); const t = String($('#coCom')?.value || '').trim();
    try {
      await updateDoc(doc(db, 'trabajos', id), { estado: 'devuelto', devFecha: Date.now() });
      if (t) await setDoc(doc(db, 'trabajos', id, 'comentarios', Array.from(crypto.getRandomValues(new Uint8Array(12)), (b) => 'abcdefghijklmnopqrstuvwxyz0123456789'[b % 36]).join('')), { autor: 'profesor', texto: t.slice(0, 2000), fecha: serverTimestamp() });
      pintarTodo(true);
    } catch (e) { alert('No se ha podido devolver (' + (e?.code || 'error') + ').'); }
  }
  // ---- Corrección por archivo (Claude u otra persona propone; el profesor revisa y publica)
  function textoPlano(h) { if (typeof h !== 'string') return ''; const d = new DOMParser().parseFromString(limpiarDoc(h), 'text/html'); return (d.body.innerText || d.body.textContent || '').replace(/\n{3,}/g, '\n\n').trim(); }
  function exportarCorr() {
    const R = C.it.rubrica || [];
    const alumnos = filas(C.g, C.it.asig).filter((n) => conEntrega(n) || A.notas.get(ids(n))).map((n) => {
      const tr = A.trabajos.get(ids(n)); const nt = A.notas.get(ids(n));
      const det = nt?.detalle || {};
      return { n, entrega: tr ? { estado: tr.estado, fecha: tr.fecha ? new Date(tr.fecha).toISOString() : null, conRetraso: !!(C.it.fechaEntrega && tr.fecha > C.it.fechaEntrega), texto: tr.texto || '', documento: C.it.tipo === 'hoja' || C.it.tipo === 'despacho' ? '' : textoPlano(tr.doc), enlaces: tr.enlaces || [] } : null,
        notaActual: nt ? { nota: nt.nota ?? null, publicada: !!nt.publicada } : null,
        niveles: R.map((r, i) => (r.clase ? null : det['n' + i] ?? null)), comentario: nt?.comentario || '' };
    });
    const out = { formato: FORMATO_CORRECCION, item: C.it.id, titulo: C.it.titulo, asig: C.it.asig, grupo: C.g.id, instrucciones: `Rellena «niveles» de cada alumno: un nivel por criterio, en el orden de «rubrica» (${NOMBRES_NIVELES}; null = sin calificar; los criterios «clase» se dejan en null). «comentario» es breve y para el alumno. Sin rúbrica, pon «nota» (0-10). Al importar, las notas quedan en borrador y no se cambian las ya publicadas.`,
      rubrica: R.map((r, i) => ({ n: i + 1, criterio: r.c, puntos: r.clase ? 0 : r.p, clase: !!r.clase, niveles: r.clase ? null : Object.fromEntries(NIVELES_TABLA.map(([k, t]) => [t, { puntos: puntosNivel(r.p, k), descripcion: r.niveles?.[k - 1] || '' }])) })),
      correcciones: alumnos };
    const blob = new Blob([JSON.stringify(out, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob);
    const f = new Date(); const ymd = `${f.getFullYear()}${pad(f.getMonth() + 1)}${pad(f.getDate())}`;
    const a = document.createElement('a'); a.href = url; a.download = `${ymd}_Correccion_${nombreArchivo(C.it.asig, 20)}_${nombreArchivo(C.it.titulo, 50).replace(/ /g, '_')}.json`; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 2000);
  }
  function importarCorr() {
    const inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.json,application/json';
    inp.onchange = async () => { const f = inp.files?.[0]; if (f) await aplicarArchivo(await f.text()); };
    inp.click();
  }
  async function aplicarArchivo(txt) {
    const r = leeArchivoCorreccion(txt, { itemId: C.it.id, rubrica: C.it.rubrica || [] });
    if (r.error) { await avisar(r.error); return; }
    const validos = new Set(filas(C.g, C.it.asig));
    const L = r.correcciones.filter((x) => validos.has(x.n));
    const publicadas = L.filter((x) => A.notas.get(ids(x.n))?.publicada);
    const nuevas = L.filter((x) => !A.notas.get(ids(x.n))?.publicada);
    const fuera = r.correcciones.length - L.length;
    const av = [...r.avisos, ...(fuera ? [`${fuera} nº de lista que no están en ${C.g.nombre}`] : [])];
    if (!nuevas.length) { await avisar(`No hay notas que importar.${publicadas.length ? ` ${publicadas.length} ya estaban publicadas y no se cambian.` : ''}${av.length ? '\n\n' + av.slice(0, 12).join('\n') : ''}`); return; }
    if (!await confirmar(`Se van a guardar ${nuevas.length} nota(s) en BORRADOR (los alumnos no las ven hasta que las publiques).${publicadas.length ? `\n${publicadas.length} ya publicada(s): no se cambian.` : ''}${av.length ? `\n\nAvisos:\n${av.slice(0, 12).join('\n')}` : ''}\n\n¿Continuar?`)) return;
    try {
      for (let i = 0; i < nuevas.length; i += 400) {
        const b = writeBatch(db);
        nuevas.slice(i, i + 400).forEach((x) => b.set(doc(db, 'notas', ids(x.n)), { item: C.it.id, curso: C.it.curso, asig: C.it.asig, al: `${C.g.id}_${x.n}`, grupo: C.g.id, numero: x.n, nota: x.nota, puntos: x.puntos, max: x.max, detalle: x.detalle, comentario: x.comentario, publicada: false, fecha: Date.now() }));
        await b.commit();
      }
      C.sel = {}; if (nuevas.some((x) => x.n === C.n) === false && nuevas[0]) C.n = nuevas[0].n;
      pintarTodo(true); const m = $('#coMsg'); if (m) { m.innerHTML = ic('check') + ` ${nuevas.length} nota(s) importadas en borrador. Revísalas y publícalas.`; m.className = 'pn-msg ok'; }
    } catch (e) { await avisar('No se han podido guardar las notas (' + (e?.code || 'error') + ').'); }
  }
  function onClick(ev) {
    const b = ev.target.closest('[data-co]'); if (!b) return false;
    const a = b.dataset.co;
    if (a === 'cerrar') { cerrar(); pintarTodo(true); }
    else if (a === 'ant') ir(-1);
    else if (a === 'sig') ir(1);
    else if (a === 'nivel') {
      const i = +b.dataset.ri; const k = +b.dataset.k; const r = C.it.rubrica[i];
      const yaEsta = b.classList.contains('on');
      C.sel[i] = yaEsta ? null : puntosNivel(r.p, k); C.sel['n' + i] = yaEsta ? null : k;
      b.closest('.co-niv').querySelectorAll('.co-n').forEach((x) => { const on = !yaEsta && x === b; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on); });
      const p = b.closest('.co-crit').querySelector('.co-pts'); if (p) p.textContent = yaEsta ? '—' : fmtNota(C.sel[i]);
      recalc();
    }
    else if (a === 'usarRap') { const t = $('#coCom'); const x = C.rapidos[+b.dataset.i]; if (t && x) { t.value = (t.value.trim() ? t.value.trim() + ' ' : '') + x; C.sel.comentario = t.value; } }
    else if (a === 'quitarRap') { C.rapidos.splice(+b.dataset.i, 1); guardarRapidos(); $('#coRapidos').innerHTML = rapidosHTML(); }
    else if (a === 'nuevoRap') { const t = String($('#coCom')?.value || '').trim(); if (!t) return true; if (!C.rapidos.includes(t)) { C.rapidos.push(t.slice(0, 300)); guardarRapidos(); } $('#coRapidos').innerHTML = rapidosHTML(); }
    else if (a === 'publicarTodas') publicarTodas();
    else if (a === 'exportarCorr') { b.closest('details')?.removeAttribute('open'); exportarCorr(); }
    else if (a === 'importarCorr') { b.closest('details')?.removeAttribute('open'); importarCorr(); }
    else if (a === 'devolver') devolver();
    else if (a === 'docx') { const id = ids(C.n); const tr = A.trabajos.get(id); if (tr?.doc) imagenesParaDocx(db, id, tr.doc).then((im) => descargarDocx(tr.doc, { titulo: C.it.titulo, meta: `${C.g.nombre} · nº ${C.n}`, imagenes: im, nombre: `${C.it.titulo} - nº ${pad(C.n)}` })); }
    else return false;
    return true;
  }
  function onChange(ev) { if (ev.target.dataset?.co === 'solo') { C.soloEntregas = ev.target.checked; const L = lista(); if (!L.includes(C.n) && L.length) C.n = L[0]; pintarTodo(true); return true; } return false; }
  function onInput(ev) { if (ev.target.id === 'coNota') { C.sel.nota = ev.target.value; return true; } if (ev.target.id === 'coCom') { C.sel.comentario = ev.target.value; return true; } return false; }
  function onSubmit(ev) { if (ev.target.id !== 'coForm') return false; ev.preventDefault(); const s = ev.submitter; guardar(s?.dataset.pub === '1', s?.dataset.sig === '1'); return true; }
  function onKey(ev) { if (!A.corr || !ev.altKey) return; if (ev.key === 'ArrowRight') { ev.preventDefault(); ir(1); } if (ev.key === 'ArrowLeft') { ev.preventDefault(); ir(-1); } }
  document.addEventListener('keydown', onKey);
  return { abrir, cerrar, pintar, aplicarArchivo, onClick, onChange, onInput, onSubmit, get activa() { return !!A.corr && !!C.it; } };
}

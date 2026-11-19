// v5 · Exportar la asignatura en PDF (Gestión) y PDF de un cuestionario (enunciado y, aparte, soluciones).
// Todo se genera en el navegador y se descarga en el equipo: el portal no se conecta a Drive. Sin datos de alumnos.
// jsPDF (MIT) se carga solo al exportar, desde vendor/jspdf. El ZIP es el de lms/docx.js (sin compresión).
import { doc, getDoc } from 'firebase/firestore';
import { esc } from './util.js';
import { ic } from './ico.js';
import { bajarArchivo } from './archivos.js';
import { zip } from '../lms/docx.js';
import { exportarPregunta } from '../lms/elemento.js';
import { planExportar, manifiesto, textoPregunta, aWinAnsi, nombreSeguro } from '../lms/exportar-zip.js';
import { seccionesDe, seccionDe } from '../lms/secciones.js';
import { asignatura } from '../lms/biblioteca.js';

let carga = null;
export function cargarJsPDF() {
  if (window.jspdf?.jsPDF) return Promise.resolve(window.jspdf.jsPDF);
  if (!carga) carga = new Promise((res, rej) => { const s = document.createElement('script'); s.src = new URL('vendor/jspdf/jspdf.umd.min.js?v=4.2.1', document.baseURI).href; s.onload = () => (window.jspdf?.jsPDF ? res(window.jspdf.jsPDF) : rej(new Error('jsPDF no está disponible.'))); s.onerror = () => { carga = null; rej(new Error('No se ha podido cargar el generador de PDF.')); }; document.head.appendChild(s); });
  return carga;
}

// Documento A4 sencillo: título, subtítulo y bloques de texto con salto de página.
function documento(jsPDF, { titulo, sub }) {
  const d = new jsPDF({ unit: 'mm', format: 'a4' }); const M = 18; const W = 210 - 2 * M; let y = M;
  const salto = (h) => { if (y + h > 297 - M) { d.addPage(); y = M; } };
  const texto = (t, { size = 11, bold = false, color = [28, 28, 30], indent = 0, after = 1.5 } = {}) => {
    d.setFont('helvetica', bold ? 'bold' : 'normal'); d.setFontSize(size); d.setTextColor(...color);
    const L = d.splitTextToSize(aWinAnsi(t), W - indent); const h = size * 0.42;
    for (const l of L) { salto(h); d.text(l, M + indent, y + h * 0.8); y += h; } y += after;
  };
  d.setFillColor(222, 7, 20); d.rect(M, y, 14, 1.4, 'F'); y += 6;
  texto(titulo, { size: 17, bold: true, after: 1 });
  if (sub) texto(sub, { size: 10, color: [80, 108, 136], after: 5 });
  return { d, texto, espacio: (h) => { y += h; }, fin: () => {
    const n = d.getNumberOfPages(); for (let i = 1; i <= n; i++) { d.setPage(i); d.setFont('helvetica', 'normal'); d.setFontSize(8); d.setTextColor(80, 108, 136); d.text(aWinAnsi(`${titulo} · ${i}/${n}`), 105, 297 - 8, { align: 'center' }); }
    return new Uint8Array(d.output('arraybuffer'));
  } };
}

// PDF de un cuestionario: preguntas (sin soluciones) o soluciones. preguntas = forma del profesor (exportarPregunta)
export function pdfCuestionario(jsPDF, { titulo, sub, preguntas, soluciones = false, instrucciones = '' }) {
  const D = documento(jsPDF, { titulo: soluciones ? `${titulo} · Soluciones` : titulo, sub });
  if (!soluciones && instrucciones) D.texto(instrucciones, { size: 10, after: 4 });
  if (!soluciones) D.texto('Nombre: ______________________________   Nº: ____   Fecha: ____________', { size: 10, after: 5 });
  (preguntas || []).forEach((q, i) => {
    const T = textoPregunta(q); const pts = Number(q.puntos ?? 1);
    D.texto(`${i + 1}. ${T.enunciado}`, { bold: true, after: 1 });
    D.texto(`${String(pts).replace('.', ',')} punto${pts === 1 ? '' : 's'}${q.criterio ? ' · criterio ' + q.criterio : ''}`, { size: 8.5, color: [80, 108, 136], indent: 5, after: 1 });
    for (const l of (soluciones ? T.solucion : T.lineas)) D.texto(l, { size: 10.5, indent: 5, after: 0.8, ...(soluciones ? { color: [160, 5, 15] } : {}) });
    D.espacio(soluciones ? 3 : 6);
  });
  if (!(preguntas || []).length) D.texto('Este cuestionario todavía no tiene preguntas.', { size: 10 });
  return D.fin();
}
// Índice del ZIP
function pdfIndice(jsPDF, plan, { asig, curso, fallos, nomSec = (x) => x }) {
  const D = documento(jsPDF, { titulo: `${asig} · Índice`, sub: `${curso ? curso + ' · ' : ''}Exportado el ${new Date().toLocaleDateString('es-ES')} · SuperProfe Pablo para alumnos` });
  let sec = null, tema = null;
  for (const e of plan.entradas) {
    if (e.seccion !== sec) { sec = e.seccion; tema = null; D.espacio(2); D.texto(`${e.carpeta[0]} · ${nomSec(e.seccion)}`, { size: 13, bold: true, color: [222, 7, 20], after: 1 }); }
    if (e.tema !== tema) { tema = e.tema; D.texto(e.tema || 'Sin tema', { size: 11, bold: true, color: [80, 108, 136], indent: 2, after: 0.8 }); }
    D.texto(`${e.titulo}${e.archivos.length ? '' : '  (sin PDF)'}`, { size: 10.5, indent: 5, after: 0.3 });
    for (const a of e.archivos) D.texto(a.ruta, { size: 8, color: [110, 110, 115], indent: 9, after: 0.3 });
  }
  if (fallos.length) { D.espacio(4); D.texto('No incluidos (no se han podido leer):', { bold: true, size: 10 }); fallos.forEach((f) => D.texto(`${f.ruta}: ${f.motivo}`, { size: 9, indent: 4 })); }
  return D.fin();
}

const descargar = (bytes, nombre, tipo) => { const url = URL.createObjectURL(new Blob([bytes], { type: tipo })); const a = document.createElement('a'); a.href = url; a.download = nombre; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 4000); };
const hoy = () => new Date().toISOString().slice(0, 10);

export function crearExportar({ db, aula, modal, cerrarModal }) {
  const st = aula.st;
  async function preguntasDe(it) {
    const { examen, claves } = await aula.examen(it.id, { claves: true }); const k = claves?.respuestas || {};
    return { preguntas: (examen?.preguntas || []).map((q) => exportarPregunta(q, k[q.id])), instrucciones: it.texto || '' };
  }
  // ----------------------------------------------------------------- asignatura completa
  function abrirAsignatura({ asig, items, temas }) {
    const S = seccionesDe(st.secConf, asig).filter((s) => s.id !== 'avisos');
    const n = {}; for (const it of items) { const k = seccionDe(it); n[k] = (n[k] || 0) + 1; }
    const nt = {}; for (const it of items) { const k = temas.some((t) => t.id === it.tema) ? it.tema : ''; nt[k] = (nt[k] || 0) + 1; }
    const a = asignatura(asig);
    modal(`<header class="cl-dlg-h"><span class="cl-dlg-ic">${ic('file-down')}</span><h3>Exportar ${esc(a?.corto || asig)} en PDF</h3><span class="pn-grow"></span><button class="btn" data-m="cerrar" aria-label="Cerrar">${ic('x')}</button></header>
      <div class="cl-dlg-b1 ex-zip"><p class="pn-small">Se descarga un ZIP con los PDF por sección y tema, los cuestionarios en PDF (preguntas y, aparte, soluciones), <b>indice.pdf</b> y <b>manifiesto.json</b>. Sin datos de alumnos. Se genera en tu navegador: no se envía a ningún sitio.</p>
      <fieldset class="sg-act"><legend>Secciones</legend>${S.map((s) => `<label class="pn-chk"><input type="checkbox" data-ex-sec value="${esc(s.id)}" ${n[s.id] ? 'checked' : 'disabled'}> ${esc(s.nombre)} <span class="pn-small">(${n[s.id] || 0})</span></label>`).join('')}</fieldset>
      <fieldset class="sg-act"><legend>Temas</legend>${[{ id: '', nombre: 'Sin tema' }, ...temas].filter((t) => nt[t.id]).map((t) => `<label class="pn-chk"><input type="checkbox" data-ex-tema value="${esc(t.id)}" checked> ${esc(t.nombre)} <span class="pn-small">(${nt[t.id]})</span></label>`).join('') || '<p class="pn-small">No hay elementos.</p>'}</fieldset>
      <div class="pn-acts"><button class="btn primary" data-m="exZip">${ic('download')} Descargar ZIP</button><button class="btn" data-m="cerrar">Cerrar</button><span class="pn-msg" data-ex-msg aria-live="polite"></span></div></div>`,
    async (acc, b, m) => {
      if (acc !== 'exZip') return;
      const sel = { secciones: [...m.querySelectorAll('[data-ex-sec]:checked')].map((x) => x.value), temas: [...m.querySelectorAll('[data-ex-tema]:checked')].map((x) => x.value) };
      const msg = m.querySelector('[data-ex-msg]'); const di = (t) => { msg.textContent = t; };
      if (!sel.secciones.length || !sel.temas.length) return di('Marca al menos una sección y un tema.');
      b.disabled = true;
      try {
        const r = await generarZip({ asig, items, temas, secciones: S, sel, progreso: di });
        descargar(r.bytes, r.nombre, 'application/zip'); window.__ultimoZip = { nombre: r.nombre, total: r.total, fallos: r.fallos.length };
        di(`Listo: ${r.total} PDF${r.fallos.length ? ` (${r.fallos.length} no se han podido leer; mira indice.pdf)` : ''}.`);
      } catch (e) { di('No se ha podido exportar: ' + (e?.message || e)); }
      b.disabled = false;
    });
  }
  async function generarZip({ asig, items, temas, secciones, sel, progreso = () => {} }) {
    const jsPDF = await cargarJsPDF();
    const plan = planExportar({ items, temas, secciones, sel }); const a = asignatura(asig); const cur = st.cursos.get(st.cursoSel);
    const archivos = []; const fallos = []; let hechos = 0; const total = plan.entradas.reduce((s, e) => s + e.archivos.length, 0);
    const sub = (e) => [a?.corto || asig, cur?.nombre, secciones.find((s) => s.id === e.seccion)?.nombre, e.tema].filter(Boolean).join(' · ');
    for (const e of plan.entradas) {
      const it = st.items.get(e.itemId); let Q = null;
      for (const f of e.archivos) {
        progreso(`Preparando ${++hechos} de ${total}…`);
        try {
          let datos;
          if (f.id) datos = new Uint8Array(await (await bajarArchivo(db, f.id)).blob.arrayBuffer());
          else if (f.url) { const r = await fetch(new URL(f.url, document.baseURI).href); if (!r.ok) throw new Error('no se encuentra'); datos = new Uint8Array(await r.arrayBuffer()); }
          else { Q = Q || await preguntasDe(it); datos = pdfCuestionario(jsPDF, { titulo: e.titulo, sub: sub(e), preguntas: Q.preguntas, instrucciones: Q.instrucciones, soluciones: f.cuestionario === 'soluciones' }); }
          archivos.push({ nombre: f.ruta, datos });
        } catch (err) { fallos.push({ ruta: f.ruta, motivo: String(err?.message || err).slice(0, 120) }); }
      }
    }
    const malos = new Set(fallos.map((f) => f.ruta)); const planOk = { entradas: plan.entradas.map((e) => ({ ...e, archivos: e.archivos.filter((f) => !malos.has(f.ruta)) })) };
    const origenes = new Map();
    if (st.reglasV5 === true) await Promise.all(plan.entradas.map(async (e) => { try { const o = (await getDoc(doc(db, 'origenes', e.itemId))).data(); if (o) origenes.set(e.itemId, { drive: o.drive || '', ruta: o.ruta || '', version: o.version || '' }); } catch (x) { /* sin origen */ } }));
    archivos.push({ nombre: 'indice.pdf', datos: pdfIndice(jsPDF, planOk, { asig: a?.corto || asig, curso: cur?.nombre || '', fallos, nomSec: (id) => secciones.find((x) => x.id === id)?.nombre || id }) });
    archivos.push({ nombre: 'manifiesto.json', datos: JSON.stringify(manifiesto(planOk, { asignatura: a?.corto || asig, curso: cur?.nombre || '', origenes, fallos }), null, 2) });
    return { bytes: zip(archivos), nombre: `${nombreSeguro(a?.corto || asig)}_${nombreSeguro(cur?.nombre || 'curso')}_${hoy()}.zip`, total: archivos.length - 2, fallos };
  }
  // ----------------------------------------------------------------- un cuestionario
  function abrirCuestionario(it) {
    modal(`<header class="cl-dlg-h"><span class="cl-dlg-ic">${ic('file-down')}</span><h3>PDF de «${esc(it.titulo)}»</h3><span class="pn-grow"></span><button class="btn" data-m="cerrar" aria-label="Cerrar">${ic('x')}</button></header>
      <div class="cl-dlg-b1"><p class="pn-small">El enunciado (para imprimir o pasar a un compañero) y, aparte, las soluciones. <b>No pases las soluciones a los alumnos.</b></p>
      <div class="pn-acts"><button class="btn primary" data-m="pdfPreg">${ic('file-text')} Enunciado (PDF)</button><button class="btn" data-m="pdfSol">${ic('key')} Soluciones (PDF)</button><span class="pn-msg" data-ex-msg aria-live="polite"></span></div></div>`,
    async (acc, b, m) => {
      if (acc !== 'pdfPreg' && acc !== 'pdfSol') return;
      const msg = m.querySelector('[data-ex-msg]'); b.disabled = true; msg.textContent = 'Generando…';
      try {
        const jsPDF = await cargarJsPDF(); const Q = await preguntasDe(it); const a = asignatura(it.asig);
        const sol = acc === 'pdfSol'; const bytes = pdfCuestionario(jsPDF, { titulo: it.titulo, sub: a?.corto || it.asig, preguntas: Q.preguntas, instrucciones: Q.instrucciones, soluciones: sol });
        descargar(bytes, `${nombreSeguro(it.titulo)}${sol ? '_soluciones' : ''}.pdf`, 'application/pdf'); msg.textContent = 'Descargado.';
      } catch (e) { msg.textContent = 'No se ha podido generar: ' + (e?.message || e); }
      b.disabled = false;
    });
  }
  // v5 · 6f: PDF de preguntas que aún no están guardadas como elemento (p. ej. lo que acaba de generar una plantilla)
  async function pdfPreguntas({ titulo, asig, preguntas, soluciones = false }) {
    const jsPDF = await cargarJsPDF(); const a = asignatura(asig);
    const bytes = pdfCuestionario(jsPDF, { titulo, sub: a?.corto || asig, preguntas, soluciones });
    descargar(bytes, `${nombreSeguro(titulo)}${soluciones ? '_soluciones' : ''}.pdf`, 'application/pdf');
  }
  return { abrirAsignatura, abrirCuestionario, generarZip, pdfPreguntas, cerrar: cerrarModal };
}

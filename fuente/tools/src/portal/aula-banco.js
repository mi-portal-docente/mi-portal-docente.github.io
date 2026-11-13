// Banco de preguntas por asignatura (profesor): añadir preguntas (JSON o desde un examen), verlas por
// criterio, borrarlas y generar un examen eligiendo n preguntas al azar de cada criterio (se guarda
// como borrador). También «🗄 Del banco…» en el editor de exámenes.
import { collection, doc, getDocs, query, where, writeBatch, deleteDoc } from 'firebase/firestore';
import { esc } from './util.js';
import { ic } from './ico.js';
import { idItem } from '../lms/modelo.js';
import { asignatura } from '../lms/biblioteca.js';
import { porCriterio, generarExamen, leerPreguntasBanco } from '../lms/banco.js';
import { unirPregunta, validarPregunta, TIPOS_PREGUNTA } from '../lms/preguntas.js';
import { documentosDe } from './aula-json.js';

// Firestore no guarda listas dentro de listas: las parejas de «emparejar» van como {i, d}
const aBanco = (q) => (Array.isArray(q.pares) ? { ...q, pares: q.pares.map((p) => ({ i: p[0], d: p[1] })) } : q);
const deBanco = (q) => (Array.isArray(q?.pares) ? { ...q, pares: q.pares.map((p) => (Array.isArray(p) ? p : [p.i, p.d])) } : q);

export function crearBanco({ db, aula, modal, cerrarModal, gruposDe }) {
  const st = aula.st;
  async function cargar(asig) { const qs = await getDocs(query(collection(db, 'banco'), where('asig', '==', asig))); return qs.docs.map((d) => { const x = d.data(); return { id: d.id, ...x, q: deBanco(x.q) }; }); }
  async function guardar(asig, preguntas) {
    for (let i = 0; i < preguntas.length; i += 400) {
      const b = writeBatch(db);
      preguntas.slice(i, i + 400).forEach((q) => b.set(doc(db, 'banco', idItem()), { asig, criterio: q.criterio, q: aBanco(q), fecha: Date.now() }));
      await b.commit();
    }
  }
  const tipoN = (t) => TIPOS_PREGUNTA[t]?.nombre || t;

  function abrir(asig) {
    let banco = []; let cargando = true;
    const examenes = [...st.items.values()].filter((x) => x.asig === asig && x.tipo === 'examen' && x.curso === st.cursoSel);
    const html = () => {
      const C = porCriterio(banco);
      const grupos = new Map(); banco.forEach((b) => { if (!grupos.has(b.criterio)) grupos.set(b.criterio, []); grupos.get(b.criterio).push(b); });
      return `<header class="cl-dlg-h"><h3>${ic('archive')} Banco de preguntas · ${esc(asignatura(asig)?.corto || asig)}</h3><span class="pn-grow"></span><button class="btn" data-m="cerrar" aria-label="Cerrar">${ic('x')}</button></header>
      <div class="cl-dlg-b1 bk">
        ${cargando ? '<p class="pn-small">Cargando el banco…</p>' : `<p class="pn-small">${banco.length} pregunta${banco.length === 1 ? '' : 's'} en ${C.length} criterio${C.length === 1 ? '' : 's'}. Solo las ves tú.</p>`}
        <section class="bk-sec"><h4>${ic('target')} Generar un examen</h4>
          ${C.length ? `<table class="pn-t bk-t"><thead><tr><th>Criterio</th><th class="c">En el banco</th><th class="c">Preguntas al azar</th></tr></thead><tbody>${C.map((c) => `<tr><td><code>${esc(c.criterio)}</code></td><td class="c">${c.n}</td><td class="c"><input type="number" min="0" max="${c.n}" value="0" data-bk-n="${esc(c.criterio)}" aria-label="Preguntas de ${esc(c.criterio)}"></td></tr>`).join('')}</tbody></table>
          <div class="ap-fila"><label class="pn-f">Título del examen<input data-m-f="titulo" maxlength="150" value="Examen ${esc(asignatura(asig)?.corto || '')}"></label><label class="pn-chk"><input type="checkbox" data-m-f="pc"> Modo examen (pantalla completa)</label></div>
          <div class="pn-acts"><button class="btn primary" data-m="generar">${ic('shuffle')} Generar examen (borrador)</button><span class="pn-msg" id="bkGenMsg" aria-live="polite"></span></div>` : '<p class="pn-small">Añade preguntas para poder generar exámenes.</p>'}</section>
        <section class="bk-sec"><h4>${ic('plus')} Añadir preguntas</h4>
          <details><summary>Pegar JSON (lista de preguntas, cada una con su «criterio»)</summary>
            <textarea class="js-ta" data-m-f="json" rows="8" spellcheck="false" placeholder='[ { "tipo": "vf", "enunciado": "…", "correcta": true, "criterio": "eee_c1_1" } ]'></textarea>
            <label class="pn-f">Criterio para las que no lo lleven (opcional)<input data-m-f="critDef" maxlength="60" placeholder="eee_c1_1"></label>
            <div class="pn-acts"><button class="btn" data-m="añadirJSON">${ic('plus')} Añadir al banco</button><span class="pn-msg" id="bkJsMsg" aria-live="polite"></span></div><div class="js-err" id="bkErr"></div></details>
          ${examenes.length ? `<details><summary>Copiar las preguntas de un examen de este curso</summary>
            <div class="ap-fila"><label class="pn-f">Examen<select data-m-f="ex">${examenes.map((x) => `<option value="${esc(x.id)}">${esc(x.titulo)}</option>`).join('')}</select></label>
            <label class="pn-f">Criterio para las que no lo lleven<input data-m-f="critEx" maxlength="60" placeholder="eee_c1_1"></label></div>
            <div class="pn-acts"><button class="btn" data-m="deExamen">${ic('download')} Copiar al banco</button><span class="pn-msg" id="bkExMsg" aria-live="polite"></span></div></details>` : ''}
        </section>
        <section class="bk-sec"><h4>${ic('clipboard-list')} Preguntas</h4>${[...grupos.entries()].sort((a, b) => a[0].localeCompare(b[0], 'es', { numeric: true })).map(([c, L]) => `<details class="bk-g"><summary><code>${esc(c)}</code> · ${L.length}</summary><ol>${L.map((b) => `<li data-bk="${esc(b.id)}"><span class="js-tq">${esc(tipoN(b.q.tipo))}</span> ${esc(String(b.q.enunciado).slice(0, 160))} <button class="btn tiny pn-peligro" data-m="borrar" aria-label="Quitar del banco">${ic('trash')}</button></li>`).join('')}</ol></details>`).join('') || '<p class="pn-small">Todavía no hay preguntas.</p>'}
          ${banco.length ? `<div class="pn-acts"><button class="btn small" data-m="exportar">${ic('download')} Exportar el banco (JSON)</button></div>` : ''}</section></div>`;
    };
    const m = modal(html(), async (acc, b, m) => {
      const repintar = () => { m.querySelector('.cl-dlg').innerHTML = html(); };
      if (acc === 'añadirJSON') {
        const r = leerPreguntasBanco(m.querySelector('[data-m-f=json]').value, m.querySelector('[data-m-f=critDef]').value.trim());
        const msg = m.querySelector('#bkJsMsg');
        m.querySelector('#bkErr').innerHTML = r.errores.length ? `<ul>${r.errores.slice(0, 20).map((e) => `<li>${esc(e)}</li>`).join('')}</ul>` : '';
        if (!r.preguntas.length) { msg.textContent = 'No se ha añadido nada'; msg.className = 'pn-msg ko'; return; }
        b.disabled = true; await guardar(asig, r.preguntas); banco = await cargar(asig); repintar();
        const m2 = m.querySelector('#bkGenMsg') || m.querySelector('.bk p'); if (m2) { m2.textContent = `${r.preguntas.length} preguntas añadidas al banco.`; m2.className = 'pn-msg ok'; }
      }
      if (acc === 'deExamen') {
        const id = m.querySelector('[data-m-f=ex]').value; const def = m.querySelector('[data-m-f=critEx]').value.trim(); const msg = m.querySelector('#bkExMsg');
        try {
          const { examen, claves } = await aula.examen(id, { claves: true });
          const L = (examen?.preguntas || []).map((q) => unirPregunta(q, claves?.respuestas?.[q.id])).map((q) => ({ ...q, criterio: q.criterio || def })).map((q, i) => validarPregunta(q, i, () => { })).filter(Boolean);
          const sin = L.filter((q) => !q.criterio).length; const ok = L.filter((q) => q.criterio);
          if (!ok.length) { msg.textContent = 'Ninguna pregunta tiene criterio: escribe uno arriba.'; msg.className = 'pn-msg ko'; return; }
          await guardar(asig, ok); banco = await cargar(asig); repintar();
          const m2 = m.querySelector('#bkGenMsg'); if (m2) { m2.textContent = `${ok.length} preguntas copiadas al banco${sin ? ` (${sin} sin criterio, no copiadas)` : ''}.`; m2.className = 'pn-msg ok'; }
        } catch (e) { msg.textContent = 'No se ha podido leer el examen.'; msg.className = 'pn-msg ko'; }
      }
      if (acc === 'borrar') { const id = b.closest('[data-bk]').dataset.bk; if (!confirm('¿Quitar esta pregunta del banco?')) return; await deleteDoc(doc(db, 'banco', id)); banco = banco.filter((x) => x.id !== id); repintar(); }
      if (acc === 'generar') {
        const pedir = Object.fromEntries([...m.querySelectorAll('[data-bk-n]')].map((i) => [i.dataset.bkN, Number(i.value) || 0]));
        const r = generarExamen(banco, pedir); const msg = m.querySelector('#bkGenMsg');
        if (r.errores.length) { msg.textContent = '' + r.errores.join(' '); msg.className = 'pn-msg ko'; return; }
        const titulo = m.querySelector('[data-m-f=titulo]').value.trim().slice(0, 150) || 'Examen';
        const el = { tipo: 'examen', titulo, texto: '', enlaces: [], puntos: 10, preguntas: r.preguntas, examen: { desde: null, hasta: null, limiteMin: null, barajar: true, pantallaCompleta: m.querySelector('[data-m-f=pc]').checked }, rubrica: [] };
        const grupos = gruposDe(st.cursoSel, asig).map((g) => g.id); const id = idItem();
        const d = documentosDe(el, { curso: st.cursoSel, asig, tema: null, grupos, orden: -1e6 + Date.now() % 1e5 });
        const lote = writeBatch(db); lote.set(doc(db, 'items', id), d.item); lote.set(doc(db, 'examenes', id), d.examen); lote.set(doc(db, 'claves', id), d.claves);
        b.disabled = true; await lote.commit(); b.disabled = false;
        msg.innerHTML = `Examen «${esc(titulo)}» con ${r.preguntas.length} preguntas guardado como borrador. <button class="btn small" data-m="abrirEx" data-id="${esc(id)}">${ic('pencil')} Abrir en el editor</button>`; msg.className = 'pn-msg ok';
      }
      if (acc === 'abrirEx') { const id = b.dataset.id; cerrarModal(); setTimeout(() => window.PORTAL?.aula?.editar?.(id), 300); }
      if (acc === 'exportar') {
        const json = JSON.stringify({ preguntas: banco.map((x) => ({ ...x.q, criterio: x.criterio })) }, null, 2);
        const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([json], { type: 'application/json' })); a.download = `banco-${asig}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 5000);
      }
    });
    cargar(asig).then((L) => { banco = L; cargando = false; if (m.isConnected) m.querySelector('.cl-dlg').innerHTML = html(); }).catch(() => { cargando = false; });
  }

  // Editor de exámenes: elegir preguntas del banco y añadirlas al examen abierto
  function elegir(asig, alElegir) {
    cargar(asig).then((banco) => {
      const grupos = new Map(); banco.forEach((b) => { if (!grupos.has(b.criterio)) grupos.set(b.criterio, []); grupos.get(b.criterio).push(b); });
      const ov = document.createElement('div'); ov.className = 'cl-modal'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true');
      ov.innerHTML = `<div class="cl-dlg cl-dlg-s"><header class="cl-dlg-h"><h3>${ic('archive')} Añadir del banco</h3><span class="pn-grow"></span><button class="btn" data-x="cerrar" aria-label="Cerrar">${ic('x')}</button></header><div class="cl-dlg-b1">
        ${[...grupos.entries()].map(([c, L]) => `<fieldset class="cl-reu-g"><legend><code>${esc(c)}</code></legend>${L.map((b) => `<label class="pn-chk"><input type="checkbox" data-bk="${esc(b.id)}"> <span class="js-tq">${esc(tipoN(b.q.tipo))}</span> ${esc(String(b.q.enunciado).slice(0, 140))}</label>`).join('')}</fieldset>`).join('') || '<p class="pn-small">El banco de esta asignatura está vacío. Añade preguntas desde «Trabajo de clase» → «Banco de preguntas».</p>'}
        <div class="pn-acts"><button class="btn primary" data-x="ok">${ic('plus')} Añadir al examen</button><button class="btn" data-x="cerrar">Cancelar</button></div></div></div>`;
      ov.addEventListener('click', (e) => {
        const b = e.target.closest('[data-x]'); if (e.target === ov || b?.dataset.x === 'cerrar') return ov.remove(); if (!b) return;
        const ids = new Set([...ov.querySelectorAll('[data-bk]:checked')].map((x) => x.dataset.bk));
        alElegir(banco.filter((x) => ids.has(x.id)).map((x) => ({ ...JSON.parse(JSON.stringify(x.q)), id: 'q' + Math.random().toString(36).slice(2, 8), criterio: x.criterio, ...(x.q.tipo === 'corta' ? { correcta: x.q.correcta || [] } : {}) })));
        ov.remove();
      });
      document.body.appendChild(ov);
    });
  }
  return { abrir, elegir };
}

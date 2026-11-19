// Banco de preguntas por asignatura (profesor): añadir preguntas (JSON o desde un examen), verlas por
// criterio, borrarlas y generar un examen eligiendo n preguntas al azar de cada criterio (se guarda
// como borrador). También «🗄 Del banco…» en el editor de exámenes.
import { collection, doc, getDocs, query, where, writeBatch, deleteDoc, setDoc } from 'firebase/firestore';
import { esc } from './util.js';
import { ic } from './ico.js';
import { idItem } from '../lms/modelo.js';
import { asignatura } from '../lms/biblioteca.js';
import { porCriterio, generarExamen, leerPreguntasBanco, DIFICULTADES, temasBanco, filtrarBanco, temaDe, dificultadDe, validarPlantilla, limpiarPlantilla, generarVersiones, VERSIONES, paraExamen } from '../lms/banco.js';
import { unirPregunta, validarPregunta, TIPOS_PREGUNTA } from '../lms/preguntas.js';
import { documentosDe } from './aula-json.js';
import { confirmar } from './dialogo.js';

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

  // v5 · plantillas de examen (plantillas/{id}, solo profesor y con las reglas v5)
  async function cargarPlantillas(asig) { const qs = await getDocs(query(collection(db, 'plantillas'), where('asig', '==', asig))); return qs.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => String(a.nombre).localeCompare(String(b.nombre), 'es')); }
  const optS = (v, t, sel) => `<option value="${esc(v)}"${String(v) === String(sel ?? '') ? ' selected' : ''}>${esc(t)}</option>`;
  const difChip = (d) => (d ? `<span class="js-tq bk-d${d}" title="Dificultad">${esc(DIFICULTADES[d])}</span>` : '');

  function abrir(asig) {
    let banco = []; let cargando = true;
    const F = { criterio: '', tema: '', dificultad: '' };
    const P = { nombre: '', reglas: [{ criterio: '', tema: '', dificultad: '', n: 2 }] };
    let plantillas = []; let plantErr = '';
    const v5 = () => st.reglasV5 === true;
    const criterios = () => porCriterio(banco).map((c) => c.criterio);
    const filaHTML = (r, i) => `<tr data-pl-i="${i}"><td><select data-pl="criterio" aria-label="Criterio">${optS('', 'Cualquiera', r.criterio)}${criterios().map((c) => optS(c, c, r.criterio)).join('')}</select></td>
      <td><select data-pl="tema" aria-label="Tema">${optS('', 'Cualquiera', r.tema)}${temasBanco(banco).map((t) => optS(t, t, r.tema)).join('')}</select></td>
      <td><select data-pl="dificultad" aria-label="Dificultad">${optS('', 'Cualquiera', r.dificultad)}${[1, 2, 3].map((d) => optS(d, `${d} · ${DIFICULTADES[d]}`, r.dificultad)).join('')}</select></td>
      <td class="c"><input type="number" min="1" max="50" value="${esc(r.n)}" data-pl="n" aria-label="Número de preguntas"></td>
      <td><button class="btn tiny" data-m="plQuitar" aria-label="Quitar fila">${ic('x')}</button></td></tr>`;
    const plantillasHTML = () => `<section class="bk-sec" id="bkPl"><h4>${ic('layers')} Plantillas de examen</h4>
      <p class="pn-small">Cada fila pide <b>n preguntas</b> de un criterio, tema y dificultad. Salen ordenadas de menos a más difícil. Del mismo banco se generan el examen, un test de repaso y la recuperación <b>sin repetir preguntas</b>. A cada alumno le salen las preguntas y opciones barajadas (y sus propios datos en las numéricas con variables).</p>
      <table class="pn-t bk-t bk-pl"><thead><tr><th>Criterio</th><th>Tema</th><th>Dificultad</th><th class="c">Nº</th><th></th></tr></thead><tbody>${P.reglas.map(filaHTML).join('')}</tbody></table>
      <div class="pn-acts"><button class="btn small" data-m="plFila">${ic('plus')} Fila</button></div>
      <div class="ap-fila"><label class="pn-f">Título<input data-m-f="plTitulo" maxlength="120" value="${esc(P.nombre || 'Examen ' + (asignatura(asig)?.corto || ''))}"></label>
        <label class="pn-chk"><input type="checkbox" data-pl-v="examen" checked> Examen</label><label class="pn-chk"><input type="checkbox" data-pl-v="repaso"> Test de repaso</label><label class="pn-chk"><input type="checkbox" data-pl-v="recuperacion"> Recuperación</label>
        <label class="pn-chk"><input type="checkbox" data-m-f="plPc"> Modo examen (pantalla completa) en examen y recuperación</label></div>
      <div class="pn-acts"><button class="btn primary" data-m="plGenerar">${ic('shuffle')} Generar (borrador)</button>${v5() ? `<button class="btn" data-m="plGuardar">${ic('save')} Guardar plantilla</button>` : ''}<span class="pn-msg" id="bkPlMsg" aria-live="polite"></span></div>
      ${v5() ? (plantillas.length ? `<div class="bk-pls">${plantillas.map((x) => `<span class="bk-plc" data-pl-id="${esc(x.id)}"><button class="btn small" data-m="plUsar">${ic('file-text')} ${esc(x.nombre)}</button><button class="btn tiny pn-peligro" data-m="plBorrar" aria-label="Borrar la plantilla «${esc(x.nombre)}»">${ic('trash')}</button></span>`).join('')}</div>` : '<p class="pn-small">Aún no hay plantillas guardadas.</p>') + (plantErr ? `<p class="pn-small">${esc(plantErr)}</p>` : '')
        : '<p class="sg-aviso">Para guardar plantillas hay que pegar las <b>reglas nuevas (v5)</b>. Generar funciona igual.</p>'}</section>`;
    const leerFilas = (m) => { P.reglas = [...m.querySelectorAll('#bkPl [data-pl-i]')].map((tr) => ({ criterio: tr.querySelector('[data-pl=criterio]').value, tema: tr.querySelector('[data-pl=tema]').value, dificultad: tr.querySelector('[data-pl=dificultad]').value, n: Number(tr.querySelector('[data-pl=n]').value) || 0 })); P.nombre = m.querySelector('[data-m-f=plTitulo]')?.value.trim() || P.nombre; };
    const listaHTML = () => {
      const L = filtrarBanco(banco, F); const grupos = new Map(); L.forEach((b) => { if (!grupos.has(b.criterio)) grupos.set(b.criterio, []); grupos.get(b.criterio).push(b); });
      const abiertos = F.criterio || F.tema || F.dificultad;
      return `<div class="ap-fila bk-filtros"><label class="pn-f">Criterio<select data-bk-f="criterio">${optS('', 'Todos', F.criterio)}${criterios().map((c) => optS(c, c, F.criterio)).join('')}</select></label>
        <label class="pn-f">Tema<select data-bk-f="tema">${optS('', 'Todos', F.tema)}${optS('-', 'Sin tema', F.tema)}${temasBanco(banco).map((t) => optS(t, t, F.tema)).join('')}</select></label>
        <label class="pn-f">Dificultad<select data-bk-f="dificultad">${optS('', 'Todas', F.dificultad)}${[1, 2, 3].map((d) => optS(d, `${d} · ${DIFICULTADES[d]}`, F.dificultad)).join('')}</select></label></div>
        ${abiertos ? `<p class="pn-small" id="bkNF">${L.length} de ${banco.length} preguntas con ese filtro.</p>` : ''}
        ${[...grupos.entries()].sort((a, b) => a[0].localeCompare(b[0], 'es', { numeric: true })).map(([c, L2]) => `<details class="bk-g"${abiertos ? ' open' : ''}><summary><code>${esc(c)}</code> · ${L2.length}</summary><ol>${L2.map((b) => `<li data-bk="${esc(b.id)}"><span class="js-tq">${esc(tipoN(b.q.tipo))}</span>${difChip(dificultadDe(b))}${temaDe(b) ? `<span class="js-tq bk-tema">${esc(temaDe(b))}</span>` : ''} ${esc(String(b.q.enunciado).slice(0, 160))} <button class="btn tiny pn-peligro" data-m="borrar" aria-label="Quitar del banco">${ic('trash')}</button></li>`).join('')}</ol></details>`).join('') || `<p class="pn-small">${banco.length ? 'Ninguna pregunta con ese filtro.' : 'Todavía no hay preguntas.'}</p>`}`;
    };
    const examenes = [...st.items.values()].filter((x) => x.asig === asig && x.tipo === 'examen' && x.curso === st.cursoSel);
    const html = () => {
      const C = porCriterio(banco);
      return `<header class="cl-dlg-h"><h3>${ic('archive')} Banco de preguntas · ${esc(asignatura(asig)?.corto || asig)}</h3><span class="pn-grow"></span><button class="btn" data-m="cerrar" aria-label="Cerrar">${ic('x')}</button></header>
      <div class="cl-dlg-b1 bk">
        ${cargando ? '<p class="pn-small">Cargando el banco…</p>' : `<p class="pn-small">${banco.length} pregunta${banco.length === 1 ? '' : 's'} en ${C.length} criterio${C.length === 1 ? '' : 's'}. Solo las ves tú.</p>`}
        ${C.length ? plantillasHTML() : ''}
        <section class="bk-sec"><h4>${ic('target')} Generar rápido por criterio</h4>
          ${C.length ? `<table class="pn-t bk-t"><thead><tr><th>Criterio</th><th class="c">En el banco</th><th class="c">Preguntas al azar</th></tr></thead><tbody>${C.map((c) => `<tr><td><code>${esc(c.criterio)}</code></td><td class="c">${c.n}</td><td class="c"><input type="number" min="0" max="${c.n}" value="0" data-bk-n="${esc(c.criterio)}" aria-label="Preguntas de ${esc(c.criterio)}"></td></tr>`).join('')}</tbody></table>
          <div class="ap-fila"><label class="pn-f">Título del examen<input data-m-f="titulo" maxlength="150" value="Examen ${esc(asignatura(asig)?.corto || '')}"></label><label class="pn-chk"><input type="checkbox" data-m-f="pc"> Modo examen (pantalla completa)</label></div>
          <div class="pn-acts"><button class="btn primary" data-m="generar">${ic('shuffle')} Generar examen (borrador)</button><span class="pn-msg" id="bkGenMsg" aria-live="polite"></span></div>` : '<p class="pn-small">Añade preguntas para poder generar exámenes.</p>'}</section>
        <section class="bk-sec"><h4>${ic('plus')} Añadir preguntas</h4>
          <details><summary>Pegar JSON (lista de preguntas, cada una con su «criterio»; opcional «tema», «dificultad» 1-3, «apartados» y «paso»)</summary>
            <textarea class="js-ta" data-m-f="json" rows="8" spellcheck="false" placeholder='[ { "tipo": "vf", "enunciado": "…", "correcta": true, "criterio": "eee_c1_1", "tema": "SA1", "dificultad": 1 } ]'></textarea>
            <label class="pn-f">Criterio para las que no lo lleven (opcional)<input data-m-f="critDef" maxlength="60" placeholder="eee_c1_1"></label>
            <div class="pn-acts"><button class="btn" data-m="añadirJSON">${ic('plus')} Añadir al banco</button><span class="pn-msg" id="bkJsMsg" aria-live="polite"></span></div><div class="js-err" id="bkErr"></div></details>
          ${examenes.length ? `<details><summary>Copiar las preguntas de un examen de este curso</summary>
            <div class="ap-fila"><label class="pn-f">Examen<select data-m-f="ex">${examenes.map((x) => `<option value="${esc(x.id)}">${esc(x.titulo)}</option>`).join('')}</select></label>
            <label class="pn-f">Criterio para las que no lo lleven<input data-m-f="critEx" maxlength="60" placeholder="eee_c1_1"></label></div>
            <div class="pn-acts"><button class="btn" data-m="deExamen">${ic('download')} Copiar al banco</button><span class="pn-msg" id="bkExMsg" aria-live="polite"></span></div></details>` : ''}
        </section>
        <section class="bk-sec"><h4>${ic('clipboard-list')} Preguntas</h4><div id="bkLista">${listaHTML()}</div>
          ${banco.length ? `<div class="pn-acts"><button class="btn small" data-m="exportar">${ic('download')} Exportar el banco (JSON)</button></div>` : ''}</section></div>`;
    };
    const nuevoExamen = (titulo, preguntas, { pc = false, seccion = null } = {}) => {
      const el = { tipo: 'examen', titulo, texto: '', enlaces: [], puntos: 10, preguntas, examen: { desde: null, hasta: null, limiteMin: null, barajar: true, pantallaCompleta: pc }, rubrica: [], ...(seccion ? { seccion } : {}) };
      const grupos = gruposDe(st.cursoSel, asig).map((g) => g.id); const id = idItem();
      const d = documentosDe(el, { curso: st.cursoSel, asig, tema: null, grupos, orden: -1e6 + Date.now() % 1e5, v5: v5() });
      return { id, aplicar: (lote) => { lote.set(doc(db, 'items', id), d.item); lote.set(doc(db, 'examenes', id), d.examen); lote.set(doc(db, 'claves', id), d.claves); } };
    };
    const m = modal(html(), async (acc, b, m) => {
      const repintar = () => { if (m.querySelector('#bkPl')) leerFilas(m); m.querySelector('.cl-dlg').innerHTML = html(); };
      const repintarPl = () => { const x = m.querySelector('#bkPl'); if (x) x.outerHTML = plantillasHTML(); };
      if (acc === 'change' && b.dataset.bkF) { F[b.dataset.bkF] = b.value; m.querySelector('#bkLista').innerHTML = listaHTML(); return; }
      if (acc === 'plFila') { leerFilas(m); if (P.reglas.length < 30) P.reglas.push({ criterio: '', tema: '', dificultad: '', n: 1 }); repintarPl(); return; }
      if (acc === 'plQuitar') { leerFilas(m); const i = Number(b.closest('[data-pl-i]').dataset.plI); P.reglas.splice(i, 1); if (!P.reglas.length) P.reglas.push({ criterio: '', tema: '', dificultad: '', n: 1 }); repintarPl(); return; }
      if (acc === 'plUsar') { const x = plantillas.find((y) => y.id === b.closest('[data-pl-id]').dataset.plId); if (!x) return; P.nombre = x.nombre; P.reglas = (x.reglas || []).map((r) => ({ criterio: r.criterio || '', tema: r.tema || '', dificultad: r.dificultad || '', n: r.n })); repintarPl(); return; }
      if (acc === 'plBorrar') { const id = b.closest('[data-pl-id]').dataset.plId; if (!await confirmar('¿Borrar esta plantilla? Los exámenes que ya generaste no cambian.', { aceptar: 'Borrar' })) return; await deleteDoc(doc(db, 'plantillas', id)); plantillas = plantillas.filter((x) => x.id !== id); leerFilas(m); repintarPl(); return; }
      if (acc === 'plGuardar') {
        leerFilas(m); const msg = m.querySelector('#bkPlMsg'); const e = validarPlantilla(P.reglas);
        if (e) { msg.textContent = e; msg.className = 'pn-msg ko'; return; }
        const nombre = (P.nombre || 'Plantilla').slice(0, 120); const ya = plantillas.find((x) => x.nombre === nombre); const id = ya?.id || idItem();
        try { await setDoc(doc(db, 'plantillas', id), { asig, nombre, reglas: limpiarPlantilla(P.reglas), fecha: Date.now() }); plantillas = await cargarPlantillas(asig); repintarPl(); const m2 = m.querySelector('#bkPlMsg'); m2.textContent = `Plantilla «${nombre}» guardada.`; m2.className = 'pn-msg ok'; }
        catch (er) { msg.textContent = 'No se ha podido guardar (' + (er?.code || 'error') + ').'; msg.className = 'pn-msg ko'; }
        return;
      }
      if (acc === 'plGenerar') {
        leerFilas(m); const msg = m.querySelector('#bkPlMsg');
        const vs = [...m.querySelectorAll('[data-pl-v]:checked')].map((x) => x.dataset.plV);
        if (!vs.length) { msg.textContent = 'Marca examen, test de repaso o recuperación.'; msg.className = 'pn-msg ko'; return; }
        const e = validarPlantilla(P.reglas); if (e) { msg.textContent = e; msg.className = 'pn-msg ko'; return; }
        const r = generarVersiones(banco, P.reglas, vs);
        if (r.errores.length) { msg.textContent = r.errores.join(' '); msg.className = 'pn-msg ko'; return; }
        const base = (P.nombre || 'Examen').slice(0, 120); const pc = !!m.querySelector('[data-m-f=plPc]')?.checked;
        const SEC = { examen: 'examenes', repaso: 'test', recuperacion: 'examenes' };
        const hechos = vs.map((v) => ({ v, ...nuevoExamen(v === 'examen' ? base : `${VERSIONES[v]} · ${base}`, r.versiones[v], { pc: pc && v !== 'repaso', seccion: SEC[v] }) }));
        const lote = writeBatch(db); hechos.forEach((h) => h.aplicar(lote));
        b.disabled = true; try { await lote.commit(); } finally { b.disabled = false; }
        const m2 = m.querySelector('#bkPlMsg'); m2.innerHTML = `Guardado como borrador: ${hechos.map((h) => `<button class="btn small" data-m="abrirEx" data-id="${esc(h.id)}">${ic('pencil')} ${esc(VERSIONES[h.v])} (${r.versiones[h.v].length})</button>`).join(' ')}`; m2.className = 'pn-msg ok';
        return;
      }
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
      if (acc === 'borrar') { const id = b.closest('[data-bk]').dataset.bk; if (!await confirmar('¿Quitar esta pregunta del banco?')) return; await deleteDoc(doc(db, 'banco', id)); banco = banco.filter((x) => x.id !== id); repintar(); }
      if (acc === 'generar') {
        const pedir = Object.fromEntries([...m.querySelectorAll('[data-bk-n]')].map((i) => [i.dataset.bkN, Number(i.value) || 0]));
        const r = generarExamen(banco, pedir); const msg = m.querySelector('#bkGenMsg');
        if (r.errores.length) { msg.textContent = '' + r.errores.join(' '); msg.className = 'pn-msg ko'; return; }
        const titulo = m.querySelector('[data-m-f=titulo]').value.trim().slice(0, 150) || 'Examen';
        const { id, aplicar } = nuevoExamen(titulo, r.preguntas, { pc: m.querySelector('[data-m-f=pc]').checked });
        const lote = writeBatch(db); aplicar(lote);
        b.disabled = true; await lote.commit(); b.disabled = false;
        msg.innerHTML = `Examen «${esc(titulo)}» con ${r.preguntas.length} preguntas guardado como borrador. <button class="btn small" data-m="abrirEx" data-id="${esc(id)}">${ic('pencil')} Abrir en el editor</button>`; msg.className = 'pn-msg ok';
      }
      if (acc === 'abrirEx') { const id = b.dataset.id; cerrarModal(); setTimeout(() => window.PORTAL?.aula?.editar?.(id), 300); }
      if (acc === 'exportar') {
        const json = JSON.stringify({ preguntas: banco.map((x) => ({ ...x.q, criterio: x.criterio })) }, null, 2);
        const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([json], { type: 'application/json' })); a.download = `banco-${asig}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 5000);
      }
    });
    Promise.all([cargar(asig), v5() ? cargarPlantillas(asig).catch((e) => { plantErr = 'No se han podido leer las plantillas (' + (e?.code || 'error') + ').'; return []; }) : []]).then(([L, PL]) => { banco = L; plantillas = PL; cargando = false; if (m.isConnected) m.querySelector('.cl-dlg').innerHTML = html(); }).catch(() => { cargando = false; });
  }

  // Editor de exámenes: elegir preguntas del banco y añadirlas al examen abierto
  function elegir(asig, alElegir) {
    cargar(asig).then((banco) => {
      const grupos = new Map(); banco.forEach((b) => { if (!grupos.has(b.criterio)) grupos.set(b.criterio, []); grupos.get(b.criterio).push(b); });
      const ov = document.createElement('div'); ov.className = 'cl-modal'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true');
      ov.innerHTML = `<div class="cl-dlg cl-dlg-s"><header class="cl-dlg-h"><h3>${ic('archive')} Añadir del banco</h3><span class="pn-grow"></span><button class="btn" data-x="cerrar" aria-label="Cerrar">${ic('x')}</button></header><div class="cl-dlg-b1">
        ${[...grupos.entries()].map(([c, L]) => `<fieldset class="cl-reu-g"><legend><code>${esc(c)}</code></legend>${L.map((b) => `<label class="pn-chk"><input type="checkbox" data-bk="${esc(b.id)}"> <span class="js-tq">${esc(tipoN(b.q.tipo))}</span>${difChip(dificultadDe(b))} ${esc(String(b.q.enunciado).slice(0, 140))}</label>`).join('')}</fieldset>`).join('') || '<p class="pn-small">El banco de esta asignatura está vacío. Añade preguntas desde «Trabajo de clase» → «Banco de preguntas».</p>'}
        <div class="pn-acts"><button class="btn primary" data-x="ok">${ic('plus')} Añadir al examen</button><button class="btn" data-x="cerrar">Cancelar</button></div></div></div>`;
      ov.addEventListener('click', (e) => {
        const b = e.target.closest('[data-x]'); if (e.target === ov || b?.dataset.x === 'cerrar') return ov.remove(); if (!b) return;
        const ids = new Set([...ov.querySelectorAll('[data-bk]:checked')].map((x) => x.dataset.bk));
        alElegir(banco.filter((x) => ids.has(x.id)).map((x) => ({ ...paraExamen(JSON.parse(JSON.stringify(x)), 0), id: 'q' + Math.random().toString(36).slice(2, 8), criterio: x.criterio, ...(x.q.tipo === 'corta' ? { correcta: x.q.correcta || [] } : {}) })));
        ov.remove();
      });
      document.body.appendChild(ov);
    });
  }
  return { abrir, elegir };
}

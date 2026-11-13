// «Pregunta en directo»: el profesor lanza una pregunta (test o verdadero/falso) a un grupo y la proyecta
// en pantalla grande; los alumnos conectados responden desde el móvil o el PC y el gráfico se actualiza en
// tiempo real. Es ANÓNIMO: el profesor solo ve cuántos han elegido cada opción (nunca quién).
//   directo/{id}            {curso, asig, grupo, tipo, enunciado, opciones, abierta, mostrar, recuento, fecha}
//   respDirecto/{id_grupo_nº} {d, al, grupo, uid, r, fecha}   (una respuesta por nº; se puede cambiar mientras está abierta)
import { collection, doc, setDoc, updateDoc, onSnapshot, query, where, serverTimestamp } from 'firebase/firestore';
import { esc } from './util.js';
import { ic } from './ico.js';
import { idItem } from '../lms/modelo.js';

const LETRAS = 'ABCDEF';
export function recuentoDe(respuestas, nOpciones) {
  const R = Array.from({ length: nOpciones }, () => 0);
  for (const r of respuestas) if (Number.isInteger(r) && r >= 0 && r < nOpciones) R[r]++;
  return R;
}
export function graficoHTML(opciones, recuento, { grande = false } = {}) {
  const total = recuento.reduce((a, b) => a + b, 0); const max = Math.max(1, ...recuento);
  return `<div class="dir-graf ${grande ? 'grande' : ''}" role="img" aria-label="${esc(opciones.map((o, i) => `${o}: ${recuento[i] || 0}`).join(', '))}">
    ${opciones.map((o, i) => { const n = recuento[i] || 0; const pct = total ? Math.round((n / total) * 100) : 0; return `<div class="dir-fila"><span class="dir-l">${LETRAS[i]}</span><span class="dir-o">${esc(o)}</span><span class="dir-b"><span style="width:${(n / max) * 100}%"></span></span><span class="dir-n">${n}<small> · ${pct} %</small></span></div>`; }).join('')}
    <p class="dir-tot">${total} respuesta${total === 1 ? '' : 's'}</p></div>`;
}

// ------------------------------------------------------------------ profesor
export function crearDirectoProfe({ db, aula, gruposDe }) {
  const st = aula.st; let ov = null; let unsub = null; let q = null; let resp = []; let ultimoRec = '';
  function cerrar() { unsub?.(); unsub = null; ov?.remove(); ov = null; q = null; document.body.classList.remove('cl-modal-abierto'); if (document.fullscreenElement) document.exitFullscreen?.().catch(() => { }); }
  function formHTML(asig) {
    const gs = gruposDe(st.cursoSel, asig);
    return `<header class="cl-dlg-h"><h3>${ic('radio')} Pregunta en directo</h3><span class="pn-grow"></span><button class="btn" data-d="cerrar" aria-label="Cerrar">${ic('x')}</button></header>
      <form class="cl-dlg-b1 pn-form" id="dirForm" autocomplete="off">
        <p class="pn-small">La ven al momento los alumnos conectados del grupo. Responden desde el móvil o el PC y el gráfico se actualiza solo. Es anónimo: solo verás cuántos eligen cada opción.</p>
        ${gs.length ? `<label class="pn-f">Grupo<select name="grupo">${gs.map((g) => `<option value="${esc(g.id)}">${esc(g.nombre)}</option>`).join('')}</select></label>` : '<p class="pn-vacio">No hay grupos con esta asignatura en el curso.</p>'}
        <label class="pn-f">Pregunta<textarea name="enunciado" rows="2" maxlength="500" required></textarea></label>
        <fieldset class="pn-f"><legend>Tipo</legend><label class="pn-chk"><input type="radio" name="tipo" value="test" checked> Opciones</label> <label class="pn-chk"><input type="radio" name="tipo" value="vf"> Verdadero / falso</label></fieldset>
        <label class="pn-f" id="dirOps">Opciones (una por línea, de 2 a 6)<textarea name="opciones" rows="4" maxlength="1200"></textarea></label>
        <div class="pn-acts"><button class="btn primary" type="submit" ${gs.length ? '' : 'disabled'}>${ic('radio')} Lanzar la pregunta</button><span class="pn-msg" id="dirMsg" role="status"></span></div></form>`;
  }
  function pantallaHTML() {
    const nombreG = q.nombreG || '';
    const rec = recuentoDe(resp, q.opciones.length);
    return `<header class="cl-dlg-h dir-h"><h3>${ic('radio')} Pregunta en directo${nombreG ? ' · ' + esc(nombreG) : ''}</h3><span class="dir-estado ${q.abierta ? 'on' : ''}">${q.abierta ? 'Abierta' : 'Cerrada'}</span><span class="pn-grow"></span>
        <button class="btn" data-d="grande" title="Pantalla completa">${ic('maximize')}<span class="sr">Pantalla completa</span></button><button class="btn" data-d="cerrar" aria-label="Cerrar">${ic('x')}</button></header>
      <div class="cl-dlg-b1 dir-pant"><p class="dir-enun">${esc(q.enunciado)}</p>${graficoHTML(q.opciones, rec, { grande: true })}
        <div class="pn-acts dir-acts">${q.abierta ? `<button class="btn" data-d="cerrarP">${ic('square')} Cerrar la pregunta</button>` : `<button class="btn" data-d="abrirP">${ic('play')} Volver a abrir</button>`}
          <label class="pn-chk"><input type="checkbox" data-d="mostrar" ${q.mostrar ? 'checked' : ''}> Mostrar el gráfico a los alumnos</label>
          <button class="btn" data-d="nueva">${ic('plus')} Nueva pregunta</button></div></div>`;
  }
  function pintar() { if (ov) ov.querySelector('.cl-dlg').innerHTML = q ? pantallaHTML() : formHTML(ov.dataset.asig); }
  async function sincronizarRecuento() {
    if (!q || !q.mostrar) return; const rec = recuentoDe(resp, q.opciones.length); const k = rec.join(',');
    if (k === ultimoRec) return; ultimoRec = k; await updateDoc(doc(db, 'directo', q.id), { recuento: rec }).catch(() => { });
  }
  function escuchar() {
    unsub?.(); resp = [];
    unsub = onSnapshot(query(collection(db, 'respDirecto'), where('d', '==', q.id)), (qs) => { resp = qs.docs.map((d) => d.data().r); pintar(); sincronizarRecuento(); }, () => { });
  }
  async function lanzar(f) {
    const fd = new FormData(f); const tipo = String(fd.get('tipo')); const enunciado = String(fd.get('enunciado') || '').trim().slice(0, 500);
    const opciones = tipo === 'vf' ? ['Verdadero', 'Falso'] : String(fd.get('opciones') || '').split('\n').map((x) => x.trim()).filter(Boolean).slice(0, 6).map((x) => x.slice(0, 200));
    const msg = f.querySelector('#dirMsg');
    if (!enunciado) { msg.textContent = 'Escribe la pregunta.'; msg.className = 'pn-msg ko'; return; }
    if (opciones.length < 2) { msg.textContent = 'Pon al menos 2 opciones (una por línea).'; msg.className = 'pn-msg ko'; return; }
    const d = { curso: st.cursoSel, asig: ov.dataset.asig, grupo: String(fd.get('grupo')), tipo, enunciado, opciones, abierta: true, mostrar: false, recuento: opciones.map(() => 0), fecha: Date.now() };
    const id = idItem();
    const nombreG = f.querySelector('[name=grupo]')?.selectedOptions[0]?.textContent || '';
    try { await setDoc(doc(db, 'directo', id), d); q = { id, ...d, nombreG }; ultimoRec = ''; escuchar(); pintar(); }
    catch (e) { msg.textContent = 'No se ha podido lanzar (' + (e?.code || 'error') + ').'; msg.className = 'pn-msg ko'; }
  }
  function abrir(asig) {
    cerrar();
    ov = document.createElement('div'); ov.className = 'cl-modal dir-modal'; ov.dataset.asig = asig; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Pregunta en directo');
    ov.innerHTML = '<div class="cl-dlg cl-dlg-s dir-dlg"></div>'; document.body.appendChild(ov); document.body.classList.add('cl-modal-abierto'); pintar();
    ov.addEventListener('submit', (e) => { if (e.target.id === 'dirForm') { e.preventDefault(); lanzar(e.target); } });
    ov.addEventListener('change', async (e) => {
      if (e.target.name === 'tipo') ov.querySelector('#dirOps').hidden = e.target.value === 'vf';
      if (e.target.dataset.d === 'mostrar' && q) { q.mostrar = e.target.checked; ultimoRec = ''; await updateDoc(doc(db, 'directo', q.id), { mostrar: q.mostrar, recuento: recuentoDe(resp, q.opciones.length) }).catch(() => { }); }
    });
    ov.addEventListener('click', async (e) => {
      const b = e.target.closest('[data-d]'); if (!b || b.tagName === 'INPUT') return;
      const a = b.dataset.d;
      if (a === 'cerrar') { if (q?.abierta && !confirm('¿Cerrar la ventana? La pregunta se cerrará para los alumnos.')) return; if (q?.abierta) await updateDoc(doc(db, 'directo', q.id), { abierta: false }).catch(() => { }); cerrar(); }
      if (a === 'cerrarP' && q) { q.abierta = false; await updateDoc(doc(db, 'directo', q.id), { abierta: false }); pintar(); }
      if (a === 'abrirP' && q) { q.abierta = true; await updateDoc(doc(db, 'directo', q.id), { abierta: true }); pintar(); }
      if (a === 'nueva') { if (q?.abierta) await updateDoc(doc(db, 'directo', q.id), { abierta: false }).catch(() => { }); unsub?.(); unsub = null; q = null; pintar(); }
      if (a === 'grande') { const el = ov.querySelector('.cl-dlg'); if (document.fullscreenElement) document.exitFullscreen?.(); else el.requestFullscreen?.().catch(() => { }); }
    });
    ov.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !document.fullscreenElement) ov.querySelector('[data-d=cerrar]')?.click(); });
  }
  return { abrir, cerrar };
}

// ------------------------------------------------------------------ alumno
export function crearDirectoAlumno({ db, ses, uid }) {
  const al = `${ses.grupo}_${ses.numero}`; let preg = []; let mias = {}; let min = false; let box = null;
  function pintar() {
    const q = preg.sort((a, b) => b.fecha - a.fecha)[0];
    if (!q) { box?.remove(); box = null; return; }
    if (!box) { box = document.createElement('aside'); box.className = 'dir-al'; box.setAttribute('aria-live', 'polite'); box.setAttribute('aria-label', 'Pregunta en directo'); document.body.appendChild(box); }
    const r = mias[q.id];
    box.classList.toggle('min', min);
    box.innerHTML = min ? `<button class="btn primary dir-al-abrir" data-da="max">${ic('radio')} Pregunta en directo</button>`
      : `<div class="dir-al-h">${ic('radio')} <b>Pregunta en directo</b><span class="pn-grow"></span><button class="btn tiny" data-da="min" aria-label="Minimizar">${ic('chevron-down')}</button></div>
      <p class="dir-al-q">${esc(q.enunciado)}</p>
      <div class="dir-al-ops">${q.opciones.map((o, i) => `<button class="btn dir-al-op ${r === i ? 'sel' : ''}" data-dr="${i}" aria-pressed="${r === i}"><span class="dir-l">${LETRAS[i]}</span> ${esc(o)}</button>`).join('')}</div>
      <p class="au-small" role="status">${r != null ? 'Respuesta enviada. Puedes cambiarla mientras la pregunta esté abierta.' : 'Elige una opción. Es anónimo: tu profesor solo ve el recuento.'}</p>
      ${q.mostrar && Array.isArray(q.recuento) ? graficoHTML(q.opciones, q.recuento) : ''}`;
  }
  async function responder(q, i) {
    mias[q.id] = i; pintar();
    try { await setDoc(doc(db, 'respDirecto', `${q.id}_${al}`), { d: q.id, al, grupo: ses.grupo, uid: uid(), r: i, fecha: serverTimestamp() }); }
    catch (e) { delete mias[q.id]; pintar(); const p = box?.querySelector('[role=status]'); if (p) p.textContent = 'No se ha podido enviar: puede que la pregunta ya esté cerrada.'; }
  }
  document.addEventListener('click', (e) => {
    if (!box || !box.contains(e.target)) return; const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.da === 'min') { min = true; pintar(); }
    if (b.dataset.da === 'max') { min = false; pintar(); }
    if (b.dataset.dr != null) { const q = preg.sort((a, c) => c.fecha - a.fecha)[0]; if (q) responder(q, +b.dataset.dr); }
  });
  const un = onSnapshot(query(collection(db, 'directo'), where('grupo', '==', ses.grupo), where('abierta', '==', true)), (qs) => {
    const antes = new Set(preg.map((q) => q.id));
    preg = qs.docs.map((d) => ({ id: d.id, ...d.data() }));
    if (preg.some((q) => !antes.has(q.id))) min = false;
    pintar();
  }, () => { });
  return { parar() { un(); box?.remove(); box = null; } };
}

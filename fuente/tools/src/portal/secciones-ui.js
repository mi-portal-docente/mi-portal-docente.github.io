// v5 · «Gestión» del profesor: configuración de las secciones de la asignatura (orden, nombre, ocultar) y
// lista de asignaturas con secciones activadas. Se guarda en config/secciones (ver lms/secciones.js).
// Con las reglas antiguas no se puede guardar: se avisa y el portal sigue con los valores por defecto.
import { doc, setDoc } from 'firebase/firestore';
import { esc } from './util.js';
import { ic } from './ico.js';
import { BIBLIOTECA } from '../lms/biblioteca.js';
import { seccionesDe, seccionesActivas, seccionDe, limpiarSecciones, ACTIVAS_DEFECTO, SECCIONES } from '../lms/secciones.js';

export function crearGestionSecciones({ db, aula, pintar, asig, items, extra }) {
  const st = aula.st;
  const D = { asig: null, lista: null, abierto: false, msg: '' };
  const borrador = () => {
    if (D.asig !== asig() || !D.lista) { D.asig = asig(); D.lista = seccionesDe(st.secConf, D.asig).map((s) => ({ ...s })); }
    return D.lista;
  };
  function html() {
    const a = asig(); const L = borrador(); const v5 = st.reglasV5;
    const n = {}; for (const it of items()) { const k = seccionDe(it); n[k] = (n[k] || 0) + 1; }
    const activas = Array.isArray(st.secConf?.activas) ? st.secConf.activas : ACTIVAS_DEFECTO;
    const filas = L.map((s, i) => `<li class="sg-fila${s.visible ? '' : ' off'}" data-sec="${esc(s.id)}">
      <span class="sg-ic" aria-hidden="true">${ic(s.icono)}</span>
      <input class="sg-nom" data-sg-nom value="${esc(s.nombre)}" maxlength="40" aria-label="Nombre de la sección ${esc(SECCIONES.find((b) => b.id === s.id).nombre)}">
      <span class="sg-n pn-small">${s.id === 'avisos' ? 'tablón' : `${n[s.id] || 0} elemento${(n[s.id] || 0) === 1 ? '' : 's'}`}</span>
      <label class="pn-chk sg-vis"><input type="checkbox" data-sg-vis ${s.visible ? 'checked' : ''}> Visible</label>
      <button class="btn tiny" data-cl="secUp" ${i ? '' : 'disabled'} aria-label="Subir ${esc(s.nombre)}">↑</button><button class="btn tiny" data-cl="secDown" ${i < L.length - 1 ? '' : 'disabled'} aria-label="Bajar ${esc(s.nombre)}">↓</button></li>`).join('');
    const asigs = BIBLIOTECA.map((x) => `<label class="pn-chk"><input type="checkbox" data-sg-act value="${esc(x.id)}" ${activas.includes(x.id) ? 'checked' : ''}> ${esc(x.corto)}</label>`).join('');
    return `<section class="sg-caja" aria-label="Gestión de la asignatura">
      <div class="sg-acc">${extra ? extra() : ''}</div>
      <details class="cl-org-extra sg-det" ${D.abierto ? 'open' : ''} data-sg-det><summary>${ic('sliders-horizontal')} Secciones de la asignatura <span class="pn-small">orden, nombre y cuáles ven los alumnos</span></summary>
        ${v5 === false ? `<p class="sg-aviso">${ic('triangle-exclamation-point')} Para guardar esta configuración hay que pegar las <b>reglas nuevas (v5)</b> en Firebase. Mientras, se usan las secciones por defecto y todo funciona igual.</p>` : ''}
        <p class="pn-small">Cada elemento va a su sección según su tipo (un material a Teoría, una tarea a Tareas…) sin cambiar nada guardado. Para moverlo a otra sección, edítalo y elige «Sección».</p>
        <ol class="sg-lista">${filas}</ol>
        <fieldset class="sg-act"><legend>Asignaturas con secciones</legend><p class="pn-small">Las demás siguen con «Trabajo de clase» y «Tablón» hasta que las actives aquí.</p>${asigs}</fieldset>
        <div class="pn-acts"><button class="btn primary" data-cl="secGuardar" ${v5 === false ? 'disabled' : ''}>${ic('save')} Guardar</button><button class="btn" data-cl="secReset">${ic('rotate-ccw')} Por defecto</button><span class="pn-msg" aria-live="polite">${esc(D.msg)}</span></div>
      </details></section>`;
  }
  // lee nombres y visibilidad de la pantalla (para no perder lo escrito al subir/bajar)
  function leer(el) {
    const L = borrador();
    for (const li of el.querySelectorAll('.sg-fila')) { const s = L.find((x) => x.id === li.dataset.sec); if (!s) continue; s.nombre = li.querySelector('[data-sg-nom]').value.trim() || SECCIONES.find((b) => b.id === s.id).nombre; s.visible = li.querySelector('[data-sg-vis]').checked; }
  }
  async function click(b, acc) {
    const caja = b.closest('.sg-caja'); if (!caja) return; leer(caja); D.abierto = true; D.msg = '';
    const L = borrador(); const i = L.findIndex((s) => s.id === b.closest('[data-sec]')?.dataset.sec);
    if (acc === 'secUp' && i > 0) [L[i - 1], L[i]] = [L[i], L[i - 1]];
    if (acc === 'secDown' && i >= 0 && i < L.length - 1) [L[i + 1], L[i]] = [L[i], L[i + 1]];
    if (acc === 'secReset') D.lista = SECCIONES.map((s) => ({ ...s, visible: true }));
    if (acc === 'secGuardar') {
      const activas = [...caja.querySelectorAll('[data-sg-act]:checked')].map((x) => x.value);
      const lista = limpiarSecciones(borrador().map((s, k) => ({ ...s, orden: k })));
      const conf = { activas, asig: { ...(st.secConf?.asig || {}), [D.asig]: lista } };
      b.disabled = true; D.msg = 'Guardando…'; pintar();
      try { await setDoc(doc(db, 'config', 'secciones'), conf); D.msg = 'Guardado.'; D.lista = null; }
      catch (e) { D.msg = e?.code === 'permission-denied' ? 'No se puede guardar: faltan las reglas nuevas (v5).' : 'No se ha podido guardar (' + (e?.code || 'error') + ').'; }
    }
    pintar();
  }
  return { html, click, toggle: (open) => { D.abierto = !!open; }, activa: (a) => seccionesActivas(st.secConf, a) };
}

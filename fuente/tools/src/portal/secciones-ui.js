// v5 · «Gestión» del profesor, al estilo de los Ajustes de iOS: a la izquierda (arriba en el móvil) una lista corta de
// apartados y, a la derecha, el apartado elegido: primero un resumen con un número grande, luego filas con icono,
// etiqueta, una línea de explicación y, al final, el control o el chevrón. La acción principal es un botón relleno.
// Configuración de las secciones de la asignatura (orden, nombre, ocultar) y lista de asignaturas con secciones
// activadas: se guarda en config/secciones (ver lms/secciones.js). Con las reglas antiguas no se puede guardar:
// se avisa y el portal sigue con los valores por defecto. No escribe nada más.
import { doc, setDoc } from 'firebase/firestore';
import { esc } from './util.js';
import { ic } from './ico.js';
import { BIBLIOTECA } from '../lms/biblioteca.js';
import { seccionesDe, seccionesActivas, seccionDe, limpiarSecciones, ACTIVAS_DEFECTO, SECCIONES } from '../lms/secciones.js';

const APARTADOS = [
  ['grupo', 'users', 'Grupo y alumnos'],
  ['calificaciones', 'clipboard-list', 'Calificaciones'],
  ['asignaturas', 'layers', 'Asignaturas visibles'],
  ['exportar', 'file-down', 'Exportar e importar'],
  ['ajustes', 'sliders-horizontal', 'Ajustes'],
];
const pl = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;

// Fila de lista: icono · etiqueta + una línea · control o chevrón. tag: a (enlace), button (acción) o div.
function fila({ icono, t, d = '', tag = 'div', attrs = '', fin = '', chev = false, cls = '' }) {
  const ab = tag === 'button' ? ' type="button"' : '';
  return `<${tag} class="gs-row ${cls}"${ab} ${attrs}><span class="gs-ri" aria-hidden="true">${ic(icono)}</span><span class="gs-rt"><b>${esc(t)}</b>${d ? `<span class="gs-desc">${esc(d)}</span>` : ''}</span><span class="gs-re">${fin}${chev ? ic('chevron-right') : ''}</span></${tag}>`;
}
const resumen = (n, unidad, sub, accion = '') => `<div class="gs-sum"><span class="gs-big">${esc(String(n))}</span><span class="gs-sum-t"><b>${esc(unidad)}</b><span>${esc(sub)}</span></span>${accion ? `<span class="gs-sum-a">${accion}</span>` : ''}</div>`;
const lista = (filas) => `<div class="gs-list">${filas}</div>`;

export function crearGestionSecciones({ db, aula, pintar, asig, items, extra }) {
  const st = aula.st;
  const D = { asig: null, lista: null, activas: null, sec: 'grupo', msg: '' };
  const borrador = () => {
    if (D.asig !== asig() || !D.lista) { D.asig = asig(); D.lista = seccionesDe(st.secConf, D.asig).map((s) => ({ ...s })); }
    return D.lista;
  };
  const activasGuardadas = () => (Array.isArray(st.secConf?.activas) ? st.secConf.activas : ACTIVAS_DEFECTO);
  function html() {
    const L = borrador(); const v5 = st.reglasV5;
    const X = (typeof extra === 'function' ? extra() : extra) || {};
    const n = {}; for (const it of items()) { const k = seccionDe(it); n[k] = (n[k] || 0) + 1; }
    const activas = D.activas || activasGuardadas();
    const gs = X.grupos || [];
    const alumnos = gs.reduce((a, g) => a + Number(g.alumnos || 0), 0);

    const pGrupo = resumen(alumnos, alumnos === 1 ? 'alumno' : 'alumnos', `${pl(gs.length, 'grupo', 'grupos')} de ${X.asig || ''} · ${X.curso || ''}`,
        `<a class="btn primary" href="#panel/grupos">${ic('users')} Grupos y códigos</a>`)
      + (gs.length ? lista(gs.map((g) => fila({ icono: 'users', t: g.nombre, d: `Código ${g.codigo || '—'} · ${pl(Number(g.alumnos || 0), 'alumno', 'alumnos')}`, tag: 'a', attrs: 'href="#panel/grupos"', chev: true })).join(''))
        : lista(fila({ icono: 'users', t: 'Todavía no hay grupos', d: 'Crea uno en «Grupos y códigos» y añade esta asignatura.' })));

    const pCalif = resumen(X.calificables ?? 0, (X.calificables ?? 0) === 1 ? 'elemento calificable' : 'elementos calificables', 'Tareas, tests, actividades y prácticas de esta asignatura',
        `<a class="btn primary" href="#panel/notas">${ic('clipboard-list')} Abrir el cuaderno de calificaciones</a>`)
      + lista(fila({ icono: 'flask-conical', t: 'Entregas del laboratorio', d: 'Prácticas de laboratorio entregadas por los alumnos', tag: 'a', attrs: 'href="#panel/entregas"', chev: true }));

    const pAsig = resumen(activas.length, activas.length === 1 ? 'asignatura con secciones' : 'asignaturas con secciones', `de ${BIBLIOTECA.length} · las demás siguen con «Trabajo de clase» y «Tablón»`)
      + lista(BIBLIOTECA.map((x) => fila({ icono: 'layers', t: x.corto, d: activas.includes(x.id) ? 'Con secciones: Teoría, Tareas, Test…' : 'Trabajo de clase y Tablón', tag: 'label', cls: 'gs-row-sw',
        fin: `<span class="pn-chk"><input type="checkbox" data-sg-act value="${esc(x.id)}" ${activas.includes(x.id) ? 'checked' : ''} aria-label="Secciones en ${esc(x.corto)}"></span>` })).join(''));

    const pExp = resumen(X.elementos ?? 0, (X.elementos ?? 0) === 1 ? 'elemento' : 'elementos', 'Se exporta en PDF dentro de un ZIP, sin datos de alumnos',
        `<button type="button" class="btn primary" data-cl="exportarZip">${ic('file-down')} Exportar asignatura en PDF</button>`)
      + lista(fila({ icono: 'download', t: 'Importar de Classroom', d: 'Carga los temas y elementos que tenías en Classroom', tag: 'button', attrs: 'data-cl="importar"', chev: true })
        + fila({ icono: 'upload', t: 'Importar JSON', d: 'Elementos o secciones desde un archivo del portal', tag: 'button', attrs: 'data-cl="importarJSON"', chev: true }));

    const vis = L.filter((s) => s.visible).length;
    const filasSec = L.map((s, i) => `<li class="sg-fila gs-row${s.visible ? '' : ' off'}" data-sec="${esc(s.id)}">
      <span class="gs-ri sg-ic" aria-hidden="true">${ic(s.icono)}</span>
      <span class="gs-rt"><input class="sg-nom" data-sg-nom value="${esc(s.nombre)}" maxlength="40" aria-label="Nombre de la sección ${esc(SECCIONES.find((b) => b.id === s.id).nombre)}"><span class="gs-desc sg-n">${s.id === 'avisos' ? 'Tablón de avisos' : pl(n[s.id] || 0, 'elemento', 'elementos')}</span></span>
      <span class="gs-re"><label class="pn-chk sg-vis"><input type="checkbox" data-sg-vis ${s.visible ? 'checked' : ''}> Visible</label>
      <button type="button" class="btn tiny" data-cl="secUp" ${i ? '' : 'disabled'} aria-label="Subir ${esc(s.nombre)}">${ic('arrow-up')}</button><button type="button" class="btn tiny" data-cl="secDown" ${i < L.length - 1 ? '' : 'disabled'} aria-label="Bajar ${esc(s.nombre)}">${ic('arrow-down')}</button></span></li>`).join('');
    const pAj = resumen(vis, vis === 1 ? 'sección visible' : 'secciones visibles', `de ${L.length} · orden, nombre y qué ven los alumnos`)
      + (v5 === false ? `<p class="sg-aviso">${ic('triangle-exclamation-point')} Para guardar esta configuración hay que pegar las <b>reglas nuevas (v5)</b> en Firebase. Mientras, se usan las secciones por defecto y todo funciona igual.</p>` : '')
      + `<ol class="gs-list sg-lista">${filasSec}</ol>`
      + lista(fila({ icono: 'rotate-ccw', t: 'Restaurar orden y nombres', d: 'Vuelve a las secciones por defecto (no se guarda hasta pulsar «Guardar»)', tag: 'button', attrs: 'data-cl="secReset"', chev: true }));

    const paneles = { grupo: pGrupo, calificaciones: pCalif, asignaturas: pAsig, exportar: pExp, ajustes: pAj };
    const guardable = D.sec === 'asignaturas' || D.sec === 'ajustes';
    return `<section class="sg-caja gs" aria-label="Gestión de la asignatura">
      <nav class="gs-nav" aria-label="Apartados de Gestión">${APARTADOS.map(([id, icono, t]) => `<button type="button" class="gs-nav-b${D.sec === id ? ' on' : ''}" data-cl="gsNav" data-s="${id}" ${D.sec === id ? 'aria-current="true"' : ''}>${ic(icono)}<span>${esc(t)}</span></button>`).join('')}</nav>
      <div class="gs-main">
        ${APARTADOS.map(([id]) => `<div class="gs-pane" data-gs-pane="${id}" ${D.sec === id ? '' : 'hidden'}>${paneles[id]}</div>`).join('')}
        <div class="gs-foot" data-gs-foot ${guardable ? '' : 'hidden'}><button type="button" class="btn primary" data-cl="secGuardar" ${v5 === false ? 'disabled' : ''}>${ic('save')} Guardar</button><span class="pn-msg" aria-live="polite">${esc(D.msg)}</span></div>
      </div>
    </section>`;
  }
  // lee lo escrito en pantalla (nombres, visibilidad, asignaturas) para no perderlo al repintar
  function leer(el) {
    const L = borrador();
    for (const li of el.querySelectorAll('.sg-fila')) { const s = L.find((x) => x.id === li.dataset.sec); if (!s) continue; s.nombre = li.querySelector('[data-sg-nom]').value.trim() || SECCIONES.find((b) => b.id === s.id).nombre; s.visible = li.querySelector('[data-sg-vis]').checked; }
    const A = el.querySelectorAll('[data-sg-act]'); if (A.length) D.activas = [...A].filter((x) => x.checked).map((x) => x.value);
  }
  function nav(b) {
    const caja = b.closest('.sg-caja'); if (caja) leer(caja);
    D.sec = APARTADOS.some(([id]) => id === b.dataset.s) ? b.dataset.s : 'grupo'; D.msg = ''; pintar();
  }
  async function click(b, acc) {
    const caja = b.closest('.sg-caja'); if (!caja) return; leer(caja); D.msg = '';
    const L = borrador(); const i = L.findIndex((s) => s.id === b.closest('[data-sec]')?.dataset.sec);
    if (acc === 'secUp' && i > 0) [L[i - 1], L[i]] = [L[i], L[i - 1]];
    if (acc === 'secDown' && i >= 0 && i < L.length - 1) [L[i + 1], L[i]] = [L[i], L[i + 1]];
    if (acc === 'secReset') D.lista = SECCIONES.map((s) => ({ ...s, visible: true }));
    if (acc === 'secGuardar') {
      const activas = D.activas || activasGuardadas();
      const lista = limpiarSecciones(borrador().map((s, k) => ({ ...s, orden: k })));
      const conf = { activas, asig: { ...(st.secConf?.asig || {}), [D.asig]: lista } };
      b.disabled = true; D.msg = 'Guardando…'; pintar();
      try { await setDoc(doc(db, 'config', 'secciones'), conf); D.msg = 'Guardado.'; D.lista = null; D.activas = null; }
      catch (e) { D.msg = e?.code === 'permission-denied' ? 'No se puede guardar: faltan las reglas nuevas (v5).' : 'No se ha podido guardar (' + (e?.code || 'error') + ').'; }
    }
    pintar();
  }
  return { html, click, nav, toggle: () => { }, activa: (a) => seccionesActivas(st.secConf, a) };
}

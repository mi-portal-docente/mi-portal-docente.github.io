// Una clase = un código (PIP-11), en Gestión › Grupos y códigos:
//  · Asignaturas de la clase: añadir o quitar (p. ej. Proyecto en la clase de EEE). El mismo código, nº y PIN
//    sirven para todas. Al añadir, se ofrece llevar a la clase los elementos ya creados de esa asignatura.
//  · Alumnos (alta y baja): cada nº de lista se da de baja o de alta sin perder su número, su PIN ni sus datos.
//    Baja = bloqueos/{grupo_nº} (lo que ya existía: el servidor no le deja entrar ni leer ni entregar).
//  · Unir grupos duplicados: la clase principal pasa a ver lo del duplicado (solo se AÑADE su id a los elementos y
//    avisos), el duplicado se queda tal cual pero cerrado y se puede «Separar» (deshacer). Ver lms/union.js.
// Sin nombres de alumnos: solo nº de lista.
import { collection, doc, getDocs, query, where, writeBatch, setDoc, deleteDoc, serverTimestamp, getCountFromServer } from 'firebase/firestore';
import { esc } from './util.js';
import { ic } from './ico.js';
import { BIBLIOTECA, asignatura } from '../lms/biblioteca.js';
import { confirmar } from './dialogo.js';
import { leerUnion, conUnion, planUnion, planSeparar, planAsignatura } from '../lms/union.js';

const pad = (n) => String(n).padStart(2, '0');
const nAs = (id) => asignatura(id)?.corto || id;
const lotes = async (db, ops) => { for (let i = 0; i < ops.length; i += 400) { const b = writeBatch(db); ops.slice(i, i + 400).forEach((f) => f(b)); await b.commit(); } };

export function crearClase({ db, st, repintar }) {
  const U = { altas: null, msg: {}, principal: '', duplicado: '', plan: null, ocupado: false, ultimo: null, umsg: '' };

  // ------------------------------------------------ asignaturas de la clase (en la tarjeta del grupo)
  function asigsHTML(g) {
    const tiene = g.asignaturas || []; const libres = BIBLIOTECA.filter((a) => !tiene.includes(a.id));
    const u = leerUnion(g.apartados);
    return `<div class="cl-asigs" aria-label="Asignaturas de la clase"><span class="cl-asigs-t">${ic('book-open')} Asignaturas</span>
      ${tiene.map((a) => `<span class="cl-asig">${esc(nAs(a))}${tiene.length > 1 && !u ? `<button type="button" class="cl-asig-x" data-pn="quitarAsig" data-asig="${esc(a)}" aria-label="Quitar ${esc(nAs(a))} de ${esc(g.nombre)}" title="Quitar de esta clase">${ic('x')}</button>` : ''}</span>`).join('')}
      ${libres.length && !u ? `<span class="cl-asig-add"><select data-pn-asig aria-label="Asignatura para añadir a ${esc(g.nombre)}"><option value="">Añadir asignatura…</option>${libres.map((a) => `<option value="${esc(a.id)}">${esc(a.corto)}</option>`).join('')}</select><button type="button" class="btn small" data-pn="ponerAsig">${ic('plus')} Añadir</button></span>` : ''}</div>
      ${U.msg[g.id] ? `<p class="cl-msg" role="status">${U.msg[g.id]}</p>` : ''}`;
  }
  async function ponerAsig(g, asig) {
    if (!asig || (g.asignaturas || []).includes(asig)) return;
    const asignaturas = [...(g.asignaturas || []), asig];
    const b = writeBatch(db); b.update(doc(db, 'grupos', g.id), { asignaturas }); b.update(doc(db, 'codigos', g.codigo), { asignaturas }); await b.commit();
    // elementos de la asignatura que ya existen: ¿también para esta clase?
    let plan = [];
    try { const qs = await getDocs(query(collection(db, 'items'), where('asig', '==', asig))); plan = planAsignatura(g, asig, qs.docs.map((d) => ({ id: d.id, ...d.data() }))); } catch (e) { /* sin permiso: solo la asignatura */ }
    let llevados = 0;
    if (plan.length) {
      const pub = plan.filter((x) => x.publicado).length;
      if (await confirmar(`${nAs(asig)} ya está en ${g.nombre}: entran con el mismo código, nº y PIN.\n\nHay ${plan.length} elemento${plan.length === 1 ? '' : 's'} de ${nAs(asig)} que esta clase todavía no tiene (${pub} publicado${pub === 1 ? '' : 's'}). ¿Ponerlos también para ${g.nombre}?\n\nNo se borra ni se quita nada a ningún otro grupo.`, { aceptar: 'Sí, ponerlos', cancelar: 'Ahora no' })) {
        await lotes(db, plan.map((x) => (bt) => bt.update(doc(db, 'items', x.id), { ...x.cambios, actualizado: Date.now() }))); llevados = plan.length;
      }
    }
    U.msg[g.id] = `${ic('circle-check')} ${esc(nAs(asig))} añadida a ${esc(g.nombre)}: mismo código, mismo nº y mismo PIN.${llevados ? ` ${llevados} elemento${llevados === 1 ? '' : 's'} de ${esc(nAs(asig))} ya ${llevados === 1 ? 'es' : 'son'} también para esta clase.` : ''}`;
    repintar();
  }
  async function quitarAsig(g, asig) {
    const asignaturas = (g.asignaturas || []).filter((a) => a !== asig); if (!asignaturas.length) return;
    if (!await confirmar(`¿Quitar ${nAs(asig)} de ${g.nombre}?\n\nLos alumnos de esta clase dejarán de ver ${nAs(asig)} en el portal. No se borra nada: sus entregas y notas se quedan y puedes volver a añadirla cuando quieras.`, { aceptar: 'Quitar', peligro: true })) return;
    const b = writeBatch(db); b.update(doc(db, 'grupos', g.id), { asignaturas, ...(asig === 'eee' ? {} : {}) }); b.update(doc(db, 'codigos', g.codigo), { asignaturas }); await b.commit();
    U.msg[g.id] = `${esc(nAs(asig))} ya no está en ${esc(g.nombre)}.`; repintar();
  }

  // ------------------------------------------------ alumnos: alta y baja por nº de lista
  function altasHTML(g) {
    if (U.altas !== g.id) return '';
    const pre = g.id + '_'; const nums = new Set(); for (let i = 1; i <= (g.alumnos || 25); i++) nums.add(i);
    for (const k of [...st.pines, ...st.accesos.keys(), ...st.bloqueos]) if (k.startsWith(pre)) { const n = +k.slice(pre.length); if (n >= 1 && n <= 40) nums.add(n); }
    const L = [...nums].sort((a, b) => a - b); const bajas = L.filter((n) => st.bloqueos.has(pre + n)).length;
    return `<div class="cl-altas" data-altas="${esc(g.id)}"><div class="cl-altas-h"><b>${ic('users')} Alumnos de ${esc(g.nombre)}</b><span class="pn-small">${L.length - bajas} de alta · ${bajas} de baja</span></div>
      <p class="pn-small">Cada nº de lista conserva su número, su PIN y todo su trabajo. <b>De baja</b>: no puede entrar (lo comprueba el servidor). <b>Dar de alta</b> le deja entrar otra vez con su PIN de siempre.</p>
      <ul class="cl-nums">${L.map((n) => { const id = pre + n; const baja = st.bloqueos.has(id); const pin = st.pines.has(id);
        return `<li class="cl-num ${baja ? 'baja' : ''}" data-usu="${esc(id)}"><span class="cl-n">Nº ${pad(n)}</span><span class="cl-est">${baja ? `${ic('ban')} De baja` : `${ic('circle-check')} De alta`}</span><span class="pn-small">${pin ? 'Con PIN' : 'Sin PIN'}</span>
          ${baja ? `<button type="button" class="btn small" data-pn="alta">${ic('user-check')} Dar de alta</button>` : `<button type="button" class="btn small pn-peligro" data-pn="baja">${ic('ban')} Dar de baja</button>`}</li>`; }).join('')}</ul>
      <p class="pn-small">¿Más alumnos? Sube el «Nº de alumnos» en <b>Editar</b>. Los PIN se reinician en Seguimiento › Usuarios y conectados.</p></div>`;
  }
  async function altaBaja(acc, id, b) {
    const i = id.lastIndexOf('_'); const gid = id.slice(0, i); const n = +id.slice(i + 1); const g = st.grupos.get(gid); const quien = `el nº ${pad(n)} de ${g?.nombre || 'esta clase'}`;
    try {
      if (acc === 'baja') {
        if (!await confirmar(`¿Dar de baja ${quien}?\n\nSaldrá del portal al momento y no podrá entrar hasta que le des de alta. Conserva su número, su PIN, sus entregas y sus notas.`, { aceptar: 'Dar de baja', peligro: true })) return;
        b.disabled = true; const bt = writeBatch(db); bt.set(doc(db, 'bloqueos', id), { desde: serverTimestamp() });
        st.sesiones.filter((s) => s.grupo === gid && s.numero === n && !s.revocada).forEach((s) => bt.update(doc(db, 'sesiones', s.uid), { revocada: true })); await bt.commit();
      }
      if (acc === 'alta') { b.disabled = true; await deleteDoc(doc(db, 'bloqueos', id)); }
    } catch (e) { b.disabled = false; alert('No se ha podido hacer (' + (e?.code || 'error') + ').'); }
  }

  // ------------------------------------------------ unir grupos duplicados
  const grupos = () => [...st.grupos.values()].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  function unirHTML() {
    const gs = grupos(); const sinUnir = gs.filter((g) => !leerUnion(g.apartados));
    const opt = (sel, g) => `<option value="${esc(g.id)}" ${g.id === sel ? 'selected' : ''}>${esc(g.nombre)} · ${esc((g.asignaturas || []).map(nAs).join(', '))}</option>`;
    const P = U.plan;
    let h = `<section class="pn-card cl-unir" id="clUnir"><h3>${ic('link')} Unir grupos duplicados</h3>
      <p class="pn-small">Si tienes la misma clase dos veces (por ejemplo, una para EEE y otra para Proyecto, con dos códigos), únelas: la <b>clase principal</b> se queda con su código, sus nº y sus PIN, y pasa a tener también las asignaturas, tareas y avisos del duplicado. El duplicado <b>no se borra</b>: se cierra y guarda todo lo que ya se hubiera entregado con su código. Puedes deshacerlo.</p>`;
    if (sinUnir.length < 2) return h + '<p class="pn-small">Necesitas al menos dos clases para unirlas.</p></section>';
    h += `<div class="ap-fila cl-unir-f"><label class="pn-f">Clase principal (se queda su código)<select data-cl-u="principal">${['<option value="">Elige…</option>', ...sinUnir.map((g) => opt(U.principal, g))].join('')}</select></label>
      <label class="pn-f">Grupo duplicado (se cierra)<select data-cl-u="duplicado">${['<option value="">Elige…</option>', ...sinUnir.map((g) => opt(U.duplicado, g))].join('')}</select></label></div>
      <div class="pn-acts"><button type="button" class="btn" data-pn="unirVer" ${U.ocupado ? 'disabled' : ''}>${ic('eye')} Ver qué cambia</button>${P && !P.error ? `<button type="button" class="btn primary" data-pn="unirAplicar" ${U.ocupado ? 'disabled' : ''}>${ic('link')} Unir</button>` : ''}</div>`;
    if (P?.error) h += `<p class="cl-msg ko" role="alert">${esc(P.error)}</p>`;
    else if (P) {
      const d = P.duplicado, p = P.principal; const nAl = P.alumnosDup;
      h += `<div class="cl-prev" role="region" aria-label="Vista previa de la unión"><h4>Vista previa · nada se ha cambiado todavía</h4><ul>
        <li>${ic('book-open')} ${P.asigNuevas.length ? `${esc(p.nombre)} tendrá también: <b>${esc(P.asigNuevas.map(nAs).join(', '))}</b>` : `${esc(p.nombre)} ya tiene todas las asignaturas de ${esc(d.nombre)}`}. Código que se queda: <b>${esc(p.codigo)}</b>.</li>
        <li>${ic('clipboard-list')} ${P.items.length} elemento${P.items.length === 1 ? '' : 's'} (tareas, materiales, exámenes…) ${P.items.length === 1 ? 'pasa' : 'pasan'} a verse también en ${esc(p.nombre)}${P.items.length ? ': ' + esc(P.items.slice(0, 6).map((x) => x.titulo).join(' · ')) + (P.items.length > 6 ? ' …' : '') : ''}.</li>
        <li>${ic('megaphone')} ${P.anuncios.length} aviso${P.anuncios.length === 1 ? '' : 's'} del tablón · ${ic('radio')} ${P.despachos.length} centralita${P.despachos.length === 1 ? '' : 's'} del Despacho virtual (se copian).</li>
        <li>${ic('lock')} ${esc(d.nombre)} se cierra (su código ${esc(d.codigo)} deja de servir para entrar). No se borra nada.</li>
        <li>${ic('info')} Lo que ya se entregó con el código de ${esc(d.nombre)}${nAl.trabajos != null ? ` (${nAl.trabajos} entrega${nAl.trabajos === 1 ? '' : 's'})` : ''} se queda en ese grupo: lo ves en Seguimiento eligiendo ${esc(d.nombre)}. Las reglas de seguridad no dejan copiar entregas ni PIN de alumnos, así que en ${esc(p.nombre)} cada alumno entra con su PIN de siempre.</li>
        ${P.avisos.map((a) => `<li class="ko">${esc(a)}</li>`).join('')}</ul></div>`;
    }
    if (U.umsg) h += `<p class="cl-msg" role="status">${U.umsg}</p>`;
    const unidos = gs.filter((g) => leerUnion(g.apartados));
    if (unidos.length) h += `<h4>Uniones hechas</h4><ul class="cl-unidos">${unidos.map((g) => { const u = leerUnion(g.apartados); const p = st.grupos.get(u.principal); return `<li data-grupo="${esc(g.id)}">${ic('link')} <b>${esc(g.nombre)}</b> está unida a <b>${esc(p?.nombre || '(clase borrada)')}</b>${u.asigs.length ? ` (${esc(u.asigs.map(nAs).join(', '))})` : ''} <button type="button" class="btn small" data-pn="separar" ${U.ocupado || !p ? 'disabled' : ''}>${ic('undo-2')} Separar (deshacer)</button></li>`; }).join('')}</ul>`;
    return h + '</section>';
  }
  function pintarUnir() { const el = document.getElementById('pnUnir'); if (el && !el.contains(document.activeElement)) el.innerHTML = unirHTML(); else if (el && document.activeElement?.tagName !== 'SELECT') el.innerHTML = unirHTML(); }
  const pintarYa = () => { const el = document.getElementById('pnUnir'); if (el) el.innerHTML = unirHTML(); };
  async function leerDatos(gid) {
    const [qi, qa] = await Promise.all([getDocs(query(collection(db, 'items'), where('grupos', 'array-contains', gid))), getDocs(query(collection(db, 'anuncios'), where('grupos', 'array-contains', gid)))]);
    return { items: qi.docs.map((d) => ({ id: d.id, ...d.data() })), anuncios: qa.docs.map((d) => ({ id: d.id, ...d.data() })) };
  }
  async function unirVer() {
    const p = st.grupos.get(U.principal), d = st.grupos.get(U.duplicado);
    if (!p || !d) { U.plan = { error: 'Elige la clase principal y el grupo duplicado.' }; return pintarYa(); }
    if (p.id === d.id) { U.plan = { error: 'Elige dos clases distintas.' }; return pintarYa(); }
    U.ocupado = true; U.umsg = ''; pintarYa();
    try {
      const { items, anuncios } = await leerDatos(d.id);
      const despachos = new Map(); try { (await getDocs(collection(db, 'despachos'))).forEach((x) => despachos.set(x.id, x.data())); } catch (e) { /* reglas sin despachos */ }
      const alumnosDup = {}; try { alumnosDup.trabajos = (await getCountFromServer(query(collection(db, 'trabajos'), where('grupo', '==', d.id)))).data().count; } catch (e) { /* sin recuento */ }
      U.plan = planUnion({ principal: p, duplicado: d, items, anuncios, despachos, alumnosDup });
    } catch (e) { U.plan = { error: 'No se han podido leer los datos (' + (e?.code || 'error') + ').' }; }
    U.ocupado = false; pintarYa();
  }
  async function unirAplicar() {
    const P = U.plan; if (!P || P.error) return;
    if (!await confirmar(`¿Unir ${P.duplicado.nombre} a ${P.principal.nombre}?\n\n${P.principal.nombre} se queda con su código ${P.principal.codigo}. ${P.duplicado.nombre} se cierra, pero no se borra nada y puedes deshacerlo con «Separar».`, { aceptar: 'Unir' })) return;
    U.ocupado = true; pintarYa();
    try {
      const p = P.principal, d = P.duplicado; const ops = [];
      P.items.forEach((x) => ops.push((b) => b.update(doc(db, 'items', x.id), { ...x.cambios, actualizado: Date.now() })));
      P.anuncios.forEach((x) => ops.push((b) => b.update(doc(db, 'anuncios', x.id), x.cambios)));
      P.despachos.forEach((x) => ops.push((b) => b.set(doc(db, 'despachos', x.a), { ...x.datos, fecha: serverTimestamp() })));
      await lotes(db, ops);
      // al final, las clases (así, si algo falla antes, no queda la marca a medias)
      const b = writeBatch(db); const ap = conUnion(d.apartados, P.token);
      b.update(doc(db, 'grupos', p.id), { asignaturas: P.asignaturas }); b.update(doc(db, 'codigos', p.codigo), { asignaturas: P.asignaturas });
      b.update(doc(db, 'grupos', d.id), { activo: false, apartados: ap }); b.update(doc(db, 'codigos', d.codigo), { activo: false });
      await b.commit();
      U.umsg = `${ic('circle-check')} Hecho: ${esc(d.nombre)} está unida a ${esc(p.nombre)}. Los alumnos entran con el código <b>${esc(p.codigo)}</b>, su nº y su PIN, y ven ${esc(P.asignaturas.map(nAs).join(' y '))}. ${P.items.length} elemento${P.items.length === 1 ? '' : 's'} ${P.items.length === 1 ? 'ha pasado' : 'han pasado'} a ${esc(p.nombre)}.`;
      U.plan = null; U.principal = ''; U.duplicado = '';
    } catch (e) { U.umsg = `<span class="ko">No se ha podido terminar (${esc(e?.code || 'error')}). No se ha borrado nada; vuelve a intentarlo.</span>`; }
    U.ocupado = false; pintarYa();
  }
  async function separar(d) {
    const u = leerUnion(d.apartados); const p = u && st.grupos.get(u.principal); if (!p) return;
    U.ocupado = true; pintarYa();
    try {
      const { items, anuncios } = await leerDatos(d.id);
      const S = planSeparar({ duplicado: d, principal: p, items, anuncios });
      if (S.error) throw new Error(S.error);
      if (!await confirmar(`¿Separar ${d.nombre} de ${p.nombre}?\n\n${p.nombre} deja de tener ${S.asigQuitar.map(nAs).join(', ') || 'las asignaturas del duplicado'} y ${S.items.length} elemento${S.items.length === 1 ? '' : 's'} vuelve${S.items.length === 1 ? '' : 'n'} a ser solo de ${d.nombre}. ${d.nombre} vuelve a abrirse con su código ${d.codigo}. No se borra nada.`, { aceptar: 'Separar' })) { U.ocupado = false; return pintarYa(); }
      const ops = [];
      S.items.forEach((x) => ops.push((b) => b.update(doc(db, 'items', x.id), { ...x.cambios, actualizado: Date.now() })));
      S.anuncios.forEach((x) => ops.push((b) => b.update(doc(db, 'anuncios', x.id), x.cambios)));
      await lotes(db, ops);
      const b = writeBatch(db); const asignaturas = S.asignaturas.length ? S.asignaturas : p.asignaturas;
      b.update(doc(db, 'grupos', p.id), { asignaturas }); b.update(doc(db, 'codigos', p.codigo), { asignaturas });
      b.update(doc(db, 'grupos', d.id), { activo: true, apartados: conUnion(d.apartados, null) }); b.update(doc(db, 'codigos', d.codigo), { activo: true });
      await b.commit();
      U.umsg = `${ic('undo-2')} Separadas: ${esc(d.nombre)} vuelve a tener su código ${esc(d.codigo)}.`;
    } catch (e) { U.umsg = `<span class="ko">No se ha podido separar (${esc(e?.code || e?.message || 'error')}).</span>`; }
    U.ocupado = false; pintarYa();
  }

  // ------------------------------------------------ eventos (los llama panel.js)
  function onClick(acc, b) {
    const g = st.grupos.get(b.closest('[data-grupo]')?.dataset.grupo || '');
    if (acc === 'ponerAsig' && g) { const s = b.closest('.cl-asig-add')?.querySelector('select'); if (s?.value) { b.disabled = true; ponerAsig(g, s.value).catch((e) => { U.msg[g.id] = 'No se ha podido añadir (' + esc(e?.code || 'error') + ').'; repintar(); }); } return true; }
    if (acc === 'quitarAsig' && g) { quitarAsig(g, b.dataset.asig).catch((e) => alert('No se ha podido quitar (' + (e?.code || 'error') + ').')); return true; }
    if (acc === 'altas' && g) { U.altas = U.altas === g.id ? null : g.id; repintar(); return true; }
    if ((acc === 'alta' || acc === 'baja') && b.closest('[data-altas]')) { altaBaja(acc, b.closest('[data-usu]').dataset.usu, b); return true; }
    if (acc === 'unirVer') { unirVer(); return true; }
    if (acc === 'unirAplicar') { unirAplicar(); return true; }
    if (acc === 'separar' && g) { separar(g); return true; }
    return false;
  }
  function onChange(t) {
    if (t.dataset.clU) { U[t.dataset.clU] = t.value; U.plan = null; pintarYa(); return true; }
    return false;
  }
  const abiertoAltas = () => U.altas;
  return { asigsHTML, altasHTML, unirHTML, pintarUnir, onClick, onChange, abiertoAltas };
}

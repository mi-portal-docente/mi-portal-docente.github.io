// Matrícula por asignatura (PIP-11, parte C): alta y baja de un nº de lista EN UNA asignatura de la clase.
// Dos vistas, mismos datos (lms/matricula.js): dentro de la asignatura (Gestión › Grupos y seguimiento) y en la tarjeta de la
// clase (Grupos y códigos › «Alumnos: alta y baja»). Solo nº de lista, nunca nombres. No se borra nada.
import { doc, getDoc, writeBatch } from 'firebase/firestore';
import { esc } from './util.js';
import { ic } from './ico.js';
import { asignatura } from '../lms/biblioteca.js';
import { confirmar } from './dialogo.js';
import { leerBajas, cambiarBaja } from '../lms/matricula.js';

const pad = (n) => String(n).padStart(2, '0');
const nAs = (id) => asignatura(id)?.corto || id;

// Nº que se listan de una clase: 1…alumnos y los que ya tengan alguna marca de baja.
export function numerosDe(g) {
  const s = new Set(); for (let i = 1; i <= Math.min(40, g.alumnos || 25); i++) s.add(i);
  for (const set of leerBajas(g.apartados).values()) set.forEach((n) => { if (n <= 40) s.add(n); });
  return [...s].sort((a, b) => a - b);
}
// Cuadrícula de UNA asignatura: «De alta / De baja en Proyecto» por nº.
export function matriculaAsigHTML(g, asig) {
  const bajas = leerBajas(g.apartados).get(asig) || new Set(); const L = numerosDe(g);
  return `<div class="mt" data-mt-g="${esc(g.id)}" data-mt-a="${esc(asig)}"><p class="pn-small">${ic('users')} <b>${L.length - bajas.size}</b> de alta · <b>${bajas.size}</b> de baja en ${esc(nAs(asig))}. Un nº de baja aquí <b>no ve ${esc(nAs(asig))}</b> y no sale en sus listas, pero sigue entrando en el resto de asignaturas de ${esc(g.nombre)} con el mismo código y PIN. Sus entregas y notas se conservan.</p>
    <ul class="mt-nums">${L.map((n) => { const b = bajas.has(n); return `<li><button type="button" class="mt-n ${b ? 'baja' : ''}" data-mt="alternar" data-g="${esc(g.id)}" data-a="${esc(asig)}" data-n="${n}" aria-pressed="${b}" title="${b ? 'De baja en ' + esc(nAs(asig)) + ': pulsa para dar de alta' : 'De alta en ' + esc(nAs(asig)) + ': pulsa para dar de baja'}"><b>${pad(n)}</b><span>${b ? ic('ban') + ' De baja' : ic('circle-check') + ' De alta'}</span></button></li>`; }).join('')}</ul></div>`;
}
// Fila de una clase con todas sus asignaturas: un interruptor por asignatura y nº (para la tarjeta de la clase).
export function matriculaClaseHTML(g) {
  const A = (g.asignaturas || []).filter((a) => asignatura(a)); const bajas = leerBajas(g.apartados);
  if (A.length < 2) return `<p class="pn-small">Esta clase solo tiene una asignatura. Para dar de baja a un nº en una sola asignatura, añade antes otra asignatura a la clase.</p>`;
  return `<div class="mt-clase"><table class="mt-t"><thead><tr><th>Nº</th>${A.map((a) => `<th>${esc(nAs(a))}</th>`).join('')}</tr></thead><tbody>${numerosDe(g).map((n) => `<tr><th>${pad(n)}</th>${A.map((a) => { const b = bajas.get(a)?.has(n);
    return `<td><button type="button" class="mt-sw ${b ? 'baja' : ''}" data-mt="alternar" data-g="${esc(g.id)}" data-a="${esc(a)}" data-n="${n}" aria-pressed="${!b}" aria-label="Nº ${pad(n)} en ${esc(nAs(a))}: ${b ? 'de baja' : 'de alta'}" title="${b ? 'De baja: pulsa para dar de alta' : 'De alta: pulsa para dar de baja'}">${b ? ic('ban') : ic('circle-check')}<span>${b ? 'Baja' : 'Alta'}</span></button></td>`; }).join('')}</tr>`).join('')}</tbody></table></div>`;
}

let instalado = null;
// Una sola vez por página (profesor): los botones data-mt="alternar" funcionan estén donde estén.
export function iniciarMatricula(db) {
  if (instalado === db) return; instalado = db;
  document.addEventListener('click', async (ev) => {
    const b = ev.target.closest?.('[data-mt=alternar]'); if (!b || b.disabled) return;
    const { g: gid, a: asig, n } = b.dataset; const num = +n;
    b.disabled = true;
    try {
      const gs = await getDoc(doc(db, 'grupos', gid)); if (!gs.exists()) throw new Error('grupo');
      const g = gs.data(); const hoy = (g.apartados || []);
      const ya = (leerBajas(hoy).get(asig) || new Set()).has(num);
      if (!ya && !await confirmar(`¿Dar de baja al nº ${pad(num)} de ${g.nombre} en ${nAs(asig)}?\n\nDejará de ver ${nAs(asig)} (tareas, avisos, exámenes) y no saldrá en sus listas. Sigue entrando en el resto de asignaturas con su código y su PIN. Sus entregas y notas de ${nAs(asig)} se conservan y puedes darle de alta cuando quieras.`, { aceptar: 'Dar de baja', peligro: true })) { b.disabled = false; return; }
      const r = cambiarBaja(hoy, asig, num, !ya); if (r.error) throw new Error(r.error);
      const bt = writeBatch(db); bt.update(doc(db, 'grupos', gid), { apartados: r.apartados }); if (g.codigo) bt.update(doc(db, 'codigos', g.codigo), { apartados: r.apartados });
      await bt.commit();
    } catch (e) { b.disabled = false; alert('No se ha podido cambiar (' + (e?.code || e?.message || 'error') + ').'); }
  });
}

// P4 · Panel del profesor de una «prueba sin elementos externos», en directo:
//  · código de 4 cifras para desbloquear (codigosPrueba/{item}, solo lo lee el profesor). Cambia solo cada vez
//    que un alumno lo usa, para que no sirva dos veces;
//  · quién está bloqueado, cuántas veces y cuántas salidas lleva; botón para desbloquear desde aquí.
import { doc, getDoc, setDoc, updateDoc, onSnapshot, collection, query, where, serverTimestamp } from 'firebase/firestore';
import { esc } from './util.js';
import { ic } from './ico.js';
import { resumenSalidas } from './modo-examen.js';

const nuevoCodigo = () => String(crypto.getRandomValues(new Uint32Array(1))[0] % 10000).padStart(4, '0');
const pad = (n) => String(n).padStart(2, '0');

export function montarPruebaProfe(nodo, it, { db, nombreGrupo = (g) => g }) {
  const S = { codigo: null, P: new Map(), I: new Map(), unsub: [], usados: new Set() };
  async function cambiar(c = nuevoCodigo()) { S.codigo = c; await setDoc(doc(db, 'codigosPrueba', it.id), { codigo: c, fecha: Date.now() }); pintar(); }
  function pintar() {
    if (!nodo.isConnected) return destruir();
    const L = [...S.P.values()].sort((a, b) => a.grupo.localeCompare(b.grupo) || a.numero - b.numero);
    const bloq = L.filter((p) => p.bloqueado);
    nodo.innerHTML = `<section class="pb-prof"><h4>${ic('shield-check')} Prueba sin elementos externos · en directo</h4>
      <div class="pb-cod">Código para desbloquear: <b>${esc(S.codigo || '····')}</b> <button class="btn small" data-pb="nuevo">${ic('refresh-cw')} Otro código</button></div>
      <p class="pn-small">Dalo en voz alta solo al alumno que tengas que desbloquear. Cambia solo cada vez que alguien lo usa.</p>
      <p><b>${bloq.length}</b> bloqueado(s) ahora · ${L.length} alumno(s) han empezado</p>
      ${L.length ? `<table class="au-t"><thead><tr><th>Alumno</th><th>Estado</th><th>Bloqueos</th><th>Salidas</th><th></th></tr></thead><tbody>${L.map((p) => {
        const sal = resumenSalidas(S.I.get(p.id) || []).filter((x) => ['pestaña', 'pantalla', 'ventana'].includes(x.tipo)).length;
        return `<tr class="${p.bloqueado ? 'pb-bloq' : ''}"><td>${esc(nombreGrupo(p.grupo))} · nº ${pad(p.numero)}</td><td>${p.bloqueado ? `${ic('lock')} Bloqueado${p.motivo ? ' (' + esc(p.motivo) + ')' : ''}` : 'En marcha'}</td><td>${p.nBloqueos || 0}</td><td>${sal}</td>
          <td>${p.bloqueado ? `<button class="btn small" data-pb="desbloquear" data-id="${esc(p.id)}">${ic('lock')} Desbloquear</button>` : ''}</td></tr>`;
      }).join('')}</tbody></table>` : '<p class="pn-small">Todavía no ha empezado nadie.</p>'}
      <p class="pn-small">Nada de esto pone nota ni anula la prueba: lo decides tú. Todo queda en el registro de incidencias.</p></section>`;
  }
  async function onClick(e) {
    const b = e.target.closest('[data-pb]'); if (!b) return;
    if (b.dataset.pb === 'nuevo') return cambiar();
    if (b.dataset.pb === 'desbloquear') { b.disabled = true; try { await updateDoc(doc(db, 'pruebas', b.dataset.id), { bloqueado: false, porProfesor: true, fecha: serverTimestamp() }); } catch (er) { b.disabled = false; alert('No se ha podido desbloquear (' + (er?.code || 'error') + ').'); } }
  }
  nodo.addEventListener('click', onClick);
  (async () => {
    try { const d = await getDoc(doc(db, 'codigosPrueba', it.id)); if (d.exists()) { S.codigo = d.data().codigo; pintar(); } else await cambiar(); } catch (e) { S.codigo = '?'; pintar(); }
  })();
  S.unsub.push(onSnapshot(query(collection(db, 'pruebas'), where('item', '==', it.id)), (qs) => {
    qs.docs.forEach((d) => {
      const x = { id: d.id, ...d.data() }; const antes = S.P.get(d.id);
      // un alumno se ha desbloqueado con el código → se cambia para que no valga otra vez
      if (antes?.bloqueado && !x.bloqueado && x.codigo && x.codigo === S.codigo && !S.usados.has(d.id + x.fecha?.toMillis?.())) { S.usados.add(d.id + x.fecha?.toMillis?.()); cambiar().catch(() => { }); }
      S.P.set(d.id, x);
    });
    pintar();
  }, () => { }));
  S.unsub.push(onSnapshot(query(collection(db, 'incidencias'), where('item', '==', it.id)), (qs) => { qs.docs.forEach((d) => S.I.set(d.id, d.data().salidas || [])); pintar(); }, () => { }));
  function destruir() { S.unsub.forEach((u) => u()); S.unsub = []; nodo.removeEventListener('click', onClick); }
  pintar();
  return { destruir };
}

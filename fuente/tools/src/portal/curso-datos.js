// Fase 14 · «Exportar todo» (copia JSON de un curso escolar) y «Limpiar curso escolar» (borra con doble confirmación,
// después de descargar la copia). Lecturas: una consulta por colección (las ligadas a elementos, en trozos de 30),
// los comentarios con una consulta de grupo y las imágenes / modelos solo de los trabajos que los usan.
import { collection, collectionGroup, doc, getDoc, getDocs, query, where, documentId, writeBatch } from 'firebase/firestore';
import { FORMATO_COPIA, COLECCIONES_CURSO, aJSON, trozos, imagenesDe, nombreCopia, resumenCopia, alumnadoCopia, confirmacionOk } from '../lms/copia.js';

async function porCampo(db, col, campo, valores) {
  const out = [];
  for (const T of trozos(valores)) { if (!T.length) continue; const qs = await getDocs(query(collection(db, col), where(campo, 'in', T))); qs.forEach((d) => out.push(d)); }
  return out;
}
// Lee todo el curso. Devuelve { copia (JSON), refs (para borrar) }.
export async function leerCurso(db, curso, aviso = () => { }) {
  const cid = curso.id; const docs = {}; const refs = [];
  const una = async (col, q) => { const qs = await getDocs(q); docs[col] = qs.docs; };
  aviso('Leyendo elementos, temas y anuncios…');
  for (const c of COLECCIONES_CURSO.filter((x) => x.por === 'curso')) { aviso(`Leyendo ${c.col}…`); await una(c.col, query(collection(db, c.col), where('curso', '==', cid))); }
  const items = docs.items.map((d) => d.id); const directos = (docs.directo || []).map((d) => d.id);
  for (const c of COLECCIONES_CURSO.filter((x) => x.por === 'id')) { aviso(`Leyendo ${c.col}…`); docs[c.col] = await porCampo(db, c.col, documentId(), items); }
  for (const c of COLECCIONES_CURSO.filter((x) => x.por === 'item')) { aviso(`Leyendo ${c.col}…`); docs[c.col] = await porCampo(db, c.col, 'item', items); }
  docs.respDirecto = await porCampo(db, 'respDirecto', 'd', directos);
  // subcolecciones de los trabajos
  const tids = new Set(docs.trabajos.map((d) => d.id)); const sub = { comentarios: [], imagenes: [], modelos: [] };
  if (tids.size) {
    aviso('Leyendo comentarios…');
    const qc = await getDocs(collectionGroup(db, 'comentarios'));
    qc.forEach((d) => { const p = d.ref.parent.parent; if (p && p.parent.id === 'trabajos' && tids.has(p.id)) sub.comentarios.push(d); });
    let k = 0; const pend = [];
    for (const d of docs.trabajos) { const t = d.data();
      for (const img of imagenesDe(t)) pend.push(['imagenes', d.id, img]);
      if (t.modelo) pend.push(['modelos', d.id, 'm1']); }
    for (const T of trozos(pend, 10)) {
      aviso(`Leyendo imágenes y modelos 3D (${k}/${pend.length})…`);
      const R = await Promise.all(T.map(([s, t, id]) => getDoc(doc(db, 'trabajos', t, s, id)).then((x) => [s, x]).catch(() => [s, null])));
      R.forEach(([s, x]) => { if (x?.exists()) sub[s].push(x); }); k += T.length;
    }
  }
  const G = await getDocs(query(collection(db, 'grupos'), where('curso', '==', cid))).catch(() => null);
  const copia = { formato: FORMATO_COPIA, fecha: new Date().toISOString(), curso: { ...aJSON(curso), id: cid },
    grupos: G ? G.docs.map((d) => ({ id: d.id, ...aJSON(d.data()) })) : [], colecciones: {}, subcolecciones: {} };
  for (const [col, L] of Object.entries(docs)) { copia.colecciones[col] = L.map((d) => ({ id: d.id, ...aJSON(d.data()) })); L.forEach((d) => refs.push({ col, ref: d.ref })); }
  for (const [s, L] of Object.entries(sub)) { copia.subcolecciones[s] = L.map((d) => ({ trabajo: d.ref.parent.parent.id, id: d.id, ...aJSON(d.data()) })); L.forEach((d) => refs.push({ col: s, ref: d.ref })); }
  return { copia, refs };
}
export function descargarCopia(copia) {
  const b = new Blob([JSON.stringify(copia)], { type: 'application/json' }); const a = document.createElement('a');
  a.href = URL.createObjectURL(b); a.download = nombreCopia(copia.curso?.nombre || copia.curso?.id); document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 4000);
}
export async function exportarCurso(db, curso, aviso) { const { copia } = await leerCurso(db, curso, aviso); descargarCopia(copia); return copia; }
const CONTENIDO = new Set(COLECCIONES_CURSO.filter((c) => c.contenido).map((c) => c.col));
// Limpia el curso: siempre descarga antes la copia; doble confirmación (aceptar + escribir el nombre del curso).
export async function limpiarCurso(db, curso, { contenido = false } = {}, aviso = () => { }) {
  const { copia, refs } = await leerCurso(db, curso, aviso);
  const borrar = refs.filter((r) => contenido || !CONTENIDO.has(r.col));
  if (!borrar.length) { aviso('No hay nada que borrar en ese curso.'); return { borrados: 0 }; }
  descargarCopia(copia);
  const R = resumenCopia(copia); const al = alumnadoCopia(copia);
  const txt = `Se ha descargado la copia (JSON). ¿Borrar del curso ${curso.nombre}: ${al} documentos del alumnado (${R.trabajos || 0} trabajos, ${R.notas || 0} notas, ${R.versiones || 0} versiones, ${(R.comentarios || 0)} comentarios…)` +
    (contenido ? ` y TODO el contenido (${R.items || 0} elementos, ${R.temas || 0} temas, ${R.anuncios || 0} anuncios)` : ' (el contenido del curso se conserva)') + '? No se puede deshacer.';
  if (!confirm(txt)) { aviso('Cancelado. No se ha borrado nada.'); return { borrados: 0, cancelado: true }; }
  const esc = prompt(`Segunda confirmación: escribe el nombre del curso (${curso.nombre}) para borrar.`);
  if (!confirmacionOk(esc, curso.nombre)) { aviso('Cancelado: el nombre no coincide. No se ha borrado nada.'); return { borrados: 0, cancelado: true }; }
  // primero las subcolecciones, después los trabajos y el resto
  const orden = (r) => (['comentarios', 'imagenes', 'modelos'].includes(r.col) ? 0 : r.col === 'items' ? 2 : 1); borrar.sort((a, b) => orden(a) - orden(b));
  let n = 0;
  for (const T of trozos(borrar, 400)) { const b = writeBatch(db); T.forEach((r) => b.delete(r.ref)); await b.commit(); n += T.length; aviso(`Borrando… ${n}/${borrar.length}`); }
  aviso(`Borrados ${n} documentos. La copia está en tus descargas.`);
  return { borrados: n };
}

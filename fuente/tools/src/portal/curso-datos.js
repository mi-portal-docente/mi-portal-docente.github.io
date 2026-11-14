// Fase 14 · «Exportar todo» (copia JSON de un curso escolar) y «Limpiar curso escolar» (borra con doble confirmación,
// después de descargar la copia). Lecturas: una consulta por colección (las ligadas a elementos, en trozos de 30),
// los comentarios con una consulta de grupo y las imágenes / modelos solo de los trabajos que los usan.
import { collection, collectionGroup, doc, getDoc, getDocs, query, where, documentId, writeBatch, setDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { confirmar, pedirTexto } from './dialogo.js';
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
// P1 · Conservación de evidencias: el Manual de evaluación del centro (§11.2) obliga a conservar 6 meses las pruebas
// y documentos usados para evaluar (y hasta la resolución si hay una reclamación abierta). Por eso la limpieza solo
// es posible con el curso CERRADO hace más de 180 días; las reglas del servidor lo comprueban igualmente.
export const DIAS_CONSERVACION = 180;
const DIA = 86400e3;
export function estadoLimpieza(curso, ahora = Date.now()) {
  if (!curso) return { ok: false, motivo: 'Elige un curso escolar.' };
  const cerrado = curso.cerrado?.toMillis?.() ?? (typeof curso.cerrado === 'number' ? curso.cerrado : null);
  if (curso.activo || !cerrado) return { ok: false, motivo: `${curso.nombre} no está cerrado. Ciérralo en «Cursos escolares» al acabar el curso; podrás limpiarlo ${DIAS_CONSERVACION} días después.` };
  const desde = cerrado + DIAS_CONSERVACION * DIA;
  if (ahora < desde) return { ok: false, motivo: `${curso.nombre} se cerró el ${new Date(cerrado).toLocaleDateString('es-ES')}. Las evidencias deben conservarse hasta el ${new Date(desde).toLocaleDateString('es-ES')} (6 meses). Si hay alguna reclamación abierta, espera también a que se resuelva.` };
  return { ok: true };
}
// Limpia el curso: comprueba el plazo, descarga antes la copia, doble confirmación (aceptar + escribir el nombre del curso)
// y abre en el servidor una «ventana de limpieza» de 90 min (config/limpieza) sin la cual las reglas no dejan borrar.
export async function limpiarCurso(db, curso, { contenido = false } = {}, aviso = () => { }) {
  const E = estadoLimpieza(curso); if (!E.ok) { aviso(E.motivo); return { borrados: 0, cancelado: true }; }
  const { copia, refs } = await leerCurso(db, curso, aviso);
  const borrar = refs.filter((r) => contenido || !CONTENIDO.has(r.col));
  if (!borrar.length) { aviso('No hay nada que borrar en ese curso.'); return { borrados: 0 }; }
  descargarCopia(copia);
  const R = resumenCopia(copia); const al = alumnadoCopia(copia);
  const txt = `Se ha descargado la copia (JSON). Guárdala en tu Drive antes de seguir.\n\n¿Borrar del curso ${curso.nombre}: ${al} documentos del alumnado (${R.trabajos || 0} trabajos, ${R.notas || 0} notas, ${R.versiones || 0} versiones, ${(R.comentarios || 0)} comentarios…)` +
    (contenido ? ` y TODO el contenido (${R.items || 0} elementos, ${R.temas || 0} temas, ${R.anuncios || 0} anuncios)` : ' (el contenido del curso se conserva)') + '? No se puede deshacer.';
  if (!(await confirmar(txt, { aceptar: 'Continuar', peligro: true }))) { aviso('Cancelado. No se ha borrado nada.'); return { borrados: 0, cancelado: true }; }
  const esc = await pedirTexto(`Segunda confirmación: escribe el nombre del curso (${curso.nombre}) para borrar.`);
  if (!confirmacionOk(esc, curso.nombre)) { aviso('Cancelado: el nombre no coincide. No se ha borrado nada.'); return { borrados: 0, cancelado: true }; }
  const ahora = Date.now();
  await setDoc(doc(db, 'config', 'limpieza'), { curso: curso.id, exportado: Timestamp.fromMillis(ahora - 60e3), hasta: Timestamp.fromMillis(ahora + 90 * 60e3) });
  // primero las subcolecciones, después los trabajos y el resto
  const orden = (r) => (['comentarios', 'imagenes', 'modelos'].includes(r.col) ? 0 : r.col === 'items' ? 2 : 1); borrar.sort((a, b) => orden(a) - orden(b));
  let n = 0;
  try {
    for (const T of trozos(borrar, 400)) { const b = writeBatch(db); T.forEach((r) => b.delete(r.ref)); await b.commit(); n += T.length; aviso(`Borrando… ${n}/${borrar.length}`); }
  } finally { await deleteDoc(doc(db, 'config', 'limpieza')).catch(() => { }); }
  aviso(`Borrados ${n} documentos. La copia está en tus descargas.`);
  return { borrados: n };
}

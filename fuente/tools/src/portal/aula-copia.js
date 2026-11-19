// Copiar el contenido de una asignatura de un curso escolar a otro (como borrador, sin grupos). Lo usan
// Panel → Cursos («Copiar de…») y la Biblioteca al volver a añadir una asignatura al curso.
// v5: se copian tal cual sección, PDF y versión interactiva (van en el elemento) y también el origen en Drive,
// que está aparte en origenes/{id} (solo profesor, solo con las reglas v5). Las secciones de la asignatura
// están en config/secciones (no dependen del curso), así que se conservan solas.
import { collection, doc, getDoc, getDocs, query, where, writeBatch, Timestamp, limit } from 'firebase/firestore';
import { idItem } from '../lms/modelo.js';

async function enLotes(db, ops) { for (let i = 0; i < ops.length; i += 400) { const b = writeBatch(db); ops.slice(i, i + 400).forEach((f) => f(b)); await b.commit(); } }

export async function copiarContenido({ db, aula, origen, destino, asignaturas = null }) {
  const st = aula.st;
  const qs = await getDocs(query(collection(db, 'items'), where('curso', '==', origen)));
  const qt = await getDocs(query(collection(db, 'temas'), where('curso', '==', origen)));
  const ops = []; let n = 0; const mapa = new Map();
  const hay = [...st.temas.values()].filter((t) => t.curso === destino);
  for (const d of qt.docs) {
    const t = d.data(); if (asignaturas && !asignaturas.includes(t.asig)) continue;
    const ya = hay.find((x) => x.asig === t.asig && x.nombre === t.nombre); if (ya) { mapa.set(d.id, ya.id); continue; }
    const id = 't' + idItem().slice(1); mapa.set(d.id, id);
    ops.push((b) => b.set(doc(db, 'temas', id), { curso: destino, asig: t.asig, nombre: t.nombre, orden: t.orden, ...(t.origen ? { origen: t.origen } : {}) }));
  }
  for (const d of qs.docs) {
    const x = d.data(); if (asignaturas && !asignaturas.includes(x.asig)) continue;
    const id = idItem(); n++;
    ops.push((b) => b.set(doc(db, 'items', id), { ...x, curso: destino, tema: x.tema ? mapa.get(x.tema) || null : null, grupos: [], visible: [], publicado: false, pub: null, actualizado: Date.now() }));
    if (x.tipo === 'examen') {
      const { examen, claves } = await aula.examen(d.id, { claves: true });
      if (examen) ops.push((b) => b.set(doc(db, 'examenes', id), { ...examen, desde: Timestamp.fromMillis(examen.desde), hasta: Timestamp.fromMillis(examen.hasta), grupos: [], publicado: false }));
      ops.push((b) => b.set(doc(db, 'claves', id), claves || { respuestas: {} }));
    }
    if (st.reglasV5 === true) { try { const o = (await getDoc(doc(db, 'origenes', d.id))).data(); if (o) ops.push((b) => b.set(doc(db, 'origenes', id), { ...o, curso: destino })); } catch (e) { /* sin origen */ } }
  }
  await enLotes(db, ops); return n;
}

// Último curso escolar (distinto de «destino») con contenido de la asignatura, o null.
export async function ultimoCursoCon({ db, aula, asig, destino }) {
  const L = [...aula.st.cursos.values()].filter((c) => c.id !== destino).sort((a, b) => String(b.nombre || b.id).localeCompare(String(a.nombre || a.id), 'es', { numeric: true }));
  for (const c of L) { const q = await getDocs(query(collection(db, 'items'), where('curso', '==', c.id), where('asig', '==', asig), limit(1))); if (!q.empty) return c; }
  return null;
}
export async function tieneContenido({ db, curso, asig }) {
  return !(await getDocs(query(collection(db, 'items'), where('curso', '==', curso), where('asig', '==', asig), limit(1)))).empty;
}

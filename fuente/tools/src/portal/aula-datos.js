// Datos del aula virtual en tiempo real (Firestore), para el alumno y para el profesor.
//  · Alumno: items publicados para su grupo, sus trabajos y sus notas PUBLICADAS
//    (por grupo + nº de lista, así los ve desde cualquier ordenador con su PIN).
//  · Profesor: cursos escolares e items del curso elegido.
import { collection, doc, onSnapshot, query, where, getDoc } from 'firebase/firestore';

const ms = (t) => (t && t.toMillis ? t.toMillis() : typeof t === 'number' ? t : null);
export { ms };

export function crearAula({ db, rol, ses }) {
  const st = { db, rol, ses, items: new Map(), temas: new Map(), anuncios: new Map(), trabajos: new Map(), notas: new Map(), cursos: new Map(), grupos: new Map(), listo: { items: false, temas: false, anuncios: false, trabajos: false, notas: false, cursos: false }, cursoSel: null, unsubs: [], unsubItems: null, unsubCurso: [], error: null };
  let raf = 0;
  const avisar = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => window.dispatchEvent(new Event('portal-aula'))); };
  const err = (e) => { st.error = e?.code || 'error'; avisar(); };
  const al = ses ? `${ses.grupo}_${ses.numero}` : null;

  // El alumno junta dos consultas: los del grupo y los de «Recuperación» para su nº de lista.
  const fuentes = { g: new Map(), r: new Map() };
  function leerItems(qs, f = 'g') {
    const m = new Map(); qs.forEach((d) => { const x = d.data({ serverTimestamps: 'estimate' }); m.set(d.id, { id: d.id, ...x }); });
    fuentes[f] = m; st.items = new Map([...fuentes.g, ...fuentes.r]);
    st.listo.items = true; avisar();
  }
  function leerTemas(qs) { st.temas = new Map(); qs.forEach((d) => st.temas.set(d.id, { id: d.id, ...d.data() })); st.listo.temas = true; avisar(); }
  function leerAnuncios(qs) { st.anuncios = new Map(); qs.forEach((d) => { const x = d.data({ serverTimestamps: 'estimate' }); st.anuncios.set(d.id, { id: d.id, ...x }); }); st.listo.anuncios = true; avisar(); }
  if (rol === 'alumno') {
    const asigs = (ses.asignaturas || []).filter((a) => a !== '*').slice(0, 30);
    const qT = ses.asignaturas?.includes('*') || !asigs.length ? collection(db, 'temas') : query(collection(db, 'temas'), where('asig', 'in', asigs));
    st.unsubs.push(onSnapshot(qT, leerTemas, err));
    st.unsubs.push(onSnapshot(query(collection(db, 'anuncios'), where('visible', 'array-contains', ses.grupo)), leerAnuncios, err));
    st.unsubs.push(onSnapshot(query(collection(db, 'items'), where('visible', 'array-contains', ses.grupo)), leerItems, err));
    st.unsubs.push(onSnapshot(query(collection(db, 'items'), where('visibleAl', 'array-contains', al)), (qs) => leerItems(qs, 'r'), err));
    st.unsubs.push(onSnapshot(query(collection(db, 'trabajos'), where('al', '==', al)), (qs) => {
      st.trabajos = new Map(); qs.forEach((d) => { const x = d.data({ serverTimestamps: 'estimate' }); st.trabajos.set(x.item, { id: d.id, ...x, inicio: ms(x.inicio), fecha: ms(x.fecha), pendiente: d.metadata.hasPendingWrites }); });
      st.listo.trabajos = true; avisar();
    }, err));
    st.unsubs.push(onSnapshot(query(collection(db, 'notas'), where('al', '==', al), where('publicada', '==', true)), (qs) => {
      st.notas = new Map(); qs.forEach((d) => { const x = d.data(); st.notas.set(x.item, { id: d.id, ...x }); });
      st.listo.notas = true; avisar();
    }, err));
  } else {
    st.unsubs.push(onSnapshot(collection(db, 'grupos'), (qs) => { st.grupos = new Map(); qs.forEach((d) => st.grupos.set(d.id, { id: d.id, ...d.data() })); st.listo.grupos = true; avisar(); }, err));
    st.unsubs.push(onSnapshot(collection(db, 'cursos'), (qs) => {
      st.cursos = new Map(); qs.forEach((d) => st.cursos.set(d.id, { id: d.id, ...d.data() }));
      st.listo.cursos = true;
      if (!st.cursoSel || !st.cursos.has(st.cursoSel)) elegirCurso(cursoActivo()?.id || [...st.cursos.keys()].sort().pop() || null);
      avisar();
    }, err));
  }
  function cursoActivo() { return [...st.cursos.values()].find((c) => c.activo) || null; }
  // Profesor: escucha los items del curso escolar elegido (no todos los años: así se gastan menos lecturas).
  function elegirCurso(id) {
    if (rol !== 'profesor' || st.cursoSel === id && st.unsubItems) return;
    st.cursoSel = id; st.unsubItems?.(); st.unsubItems = null; st.unsubCurso.forEach((f) => f()); st.unsubCurso = [];
    st.items = new Map(); st.temas = new Map(); st.anuncios = new Map(); st.listo.items = st.listo.temas = st.listo.anuncios = false;
    if (!id) { st.listo.items = st.listo.temas = st.listo.anuncios = true; avisar(); return; }
    st.unsubItems = onSnapshot(query(collection(db, 'items'), where('curso', '==', id)), (qs) => leerItems(qs), err);
    st.unsubCurso.push(onSnapshot(query(collection(db, 'temas'), where('curso', '==', id)), leerTemas, err));
    st.unsubCurso.push(onSnapshot(query(collection(db, 'anuncios'), where('curso', '==', id)), leerAnuncios, err));
  }
  const examenesCache = new Map();
  async function examen(id, { claves = false } = {}) {
    const k = id + (claves ? '+c' : '');
    if (examenesCache.has(k)) return examenesCache.get(k);
    const ex = (await getDoc(doc(db, 'examenes', id))).data() || null;
    let cl = null; if (claves) cl = (await getDoc(doc(db, 'claves', id))).data() || { respuestas: {} };
    const r = { examen: ex ? { ...ex, desde: ms(ex.desde), hasta: ms(ex.hasta) } : null, claves: cl };
    if (claves) examenesCache.set(k, r); // al alumno no se le guarda: solo puede leerlo dentro de la ventana
    return r;
  }
  const olvidarExamen = (id) => { examenesCache.delete(id); examenesCache.delete(id + '+c'); };
  function parar() { st.unsubs.forEach((f) => { try { f(); } catch (e) { } }); st.unsubs = []; st.unsubItems?.(); st.unsubItems = null; st.unsubCurso.forEach((f) => f()); st.unsubCurso = []; }
  return { st, avisar, elegirCurso, cursoActivo, examen, olvidarExamen, parar };
}

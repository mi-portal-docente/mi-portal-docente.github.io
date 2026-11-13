// Modo examen (alumno): pantalla completa y registro INFORMATIVO de cada salida de la pestaña o de la
// pantalla completa (hora de salida y duración). Solo lo lee el profesor (incidencias/{item_grupo_nº}).
// No anula ni puntúa nada: el profesor decide.
import { doc, setDoc, serverTimestamp, arrayUnion } from 'firebase/firestore';
import { idTrabajo } from '../lms/modelo.js';

export function crearModoExamen({ db, ses, uid }) {
  const M = { it: null, activo: false, estuvo: false, fuera: { pestaña: null, pantalla: null }, cola: [], enviando: false };
  const al = `${ses.grupo}_${ses.numero}`;
  async function enviar() {
    if (!M.it || M.enviando || !M.cola.length) return;
    M.enviando = true; const L = M.cola.splice(0, 50); const item = M.it.id;
    try { await setDoc(doc(db, 'incidencias', idTrabajo(item, ses.grupo, ses.numero)), { item, al, grupo: ses.grupo, numero: ses.numero, uid: uid(), salidas: arrayUnion(...L), fecha: serverTimestamp() }, { merge: true }); }
    catch (e) { M.cola.unshift(...L); }
    finally { M.enviando = false; if (M.cola.length) setTimeout(enviar, 3000); }
  }
  // Al salir se anota ya (dur: null = todavía fuera); al volver, otra entrada con la misma hora y la duración.
  function salir(tipo) { if (M.fuera[tipo]) return; M.fuera[tipo] = Date.now(); M.cola.push({ t: M.fuera[tipo], tipo, dur: null }); enviar(); }
  function volver(tipo) { const t = M.fuera[tipo]; if (!t) return; M.fuera[tipo] = null; M.cola.push({ t, tipo, dur: Math.max(1, Math.round((Date.now() - t) / 1000)) }); enviar(); }
  const banner = () => { const b = document.getElementById('exModo'); if (b) b.classList.toggle('fuera', !!M.fuera.pantalla); };
  function onVis() { if (!M.activo) return; if (document.visibilityState === 'hidden') salir('pestaña'); else volver('pestaña'); }
  function onFs() {
    if (!M.activo) return;
    if (document.fullscreenElement) { M.estuvo = true; volver('pantalla'); } else if (M.estuvo) salir('pantalla');
    banner();
  }
  function pedirPantalla() { try { const p = document.documentElement.requestFullscreen?.({ navigationUI: 'hide' }); p?.catch?.(() => { }); } catch (e) { /* el navegador no deja */ } }
  function empezar(it) {
    if (M.activo && M.it?.id === it.id) { banner(); return; }
    parar(); M.it = it; M.activo = true; M.estuvo = !!document.fullscreenElement;
    document.addEventListener('visibilitychange', onVis); document.addEventListener('fullscreenchange', onFs); banner();
  }
  function parar(salirPantalla = false) {
    if (!M.activo) return;
    volver('pestaña'); volver('pantalla'); M.activo = false;
    document.removeEventListener('visibilitychange', onVis); document.removeEventListener('fullscreenchange', onFs);
    if (salirPantalla && document.fullscreenElement) document.exitFullscreen?.().catch?.(() => { });
  }
  return { empezar, parar, pedirPantalla, get activo() { return M.activo; } };
}

// Resumen para el profesor: une las entradas «salida» (dur: null) con su «vuelta» (misma hora).
export function resumenSalidas(L) {
  const m = new Map();
  for (const s of L || []) { const k = s.tipo + '|' + s.t; const x = m.get(k); if (!x || (s.dur != null && (x.dur == null || s.dur > x.dur))) m.set(k, s); }
  return [...m.values()].sort((a, b) => a.t - b.t);
}

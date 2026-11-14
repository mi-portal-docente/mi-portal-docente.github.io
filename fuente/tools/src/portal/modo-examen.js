// Modo examen (alumno): pantalla completa y registro de cada salida de la pestaña o de la pantalla completa
// (hora de salida y duración). Solo lo lee el profesor (incidencias/{item_grupo_nº}).
//
// P4 · «Prueba sin elementos externos» (it.sinExternos): además
//  · al salir de la pestaña, de la ventana o de la pantalla completa la prueba SE BLOQUEA
//    (pruebas/{item_grupo_nº}.bloqueado = true; el servidor no deja guardar ni entregar mientras tanto);
//  · solo sigue con el código de 4 cifras que da el profesor (lo comprueba el servidor) o si la
//    desbloquea él desde su panel;
//  · no se puede pegar, arrastrar texto ni abrir el menú contextual.
// Nada de esto pone nota ni anula nada: el profesor decide.
import { doc, setDoc, getDoc, updateDoc, onSnapshot, serverTimestamp, arrayUnion } from 'firebase/firestore';
import { idTrabajo } from '../lms/modelo.js';
import { esc } from './util.js';

const CSS = `
.pb-capa{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:20px;
  background:rgba(16,16,20,.985);color:#fff;font:inherit}
.pb-caja{max-width:440px;width:100%;background:#1d1d1f;border-radius:18px;padding:24px;box-shadow:0 20px 60px rgba(0,0,0,.5);text-align:center}
.pb-caja h2{margin:0 0 8px;font-size:1.3rem}.pb-caja p{margin:0 0 14px;line-height:1.45;color:#e5e5ea}
.pb-caja input{font:inherit;font-size:1.6rem;letter-spacing:.4em;text-align:center;width:9ch;padding:8px 10px;border-radius:10px;border:1px solid #8e8e93;background:#2c2c2e;color:#fff}
.pb-caja button{font:inherit;font-weight:600;margin-top:12px;padding:10px 18px;border-radius:10px;border:0;background:#0a84ff;color:#fff;cursor:pointer;min-height:44px}
.pb-msg{min-height:1.4em;margin-top:8px;color:#ffaaa4}`;

export function crearModoExamen({ db, ses, uid }) {
  const M = { it: null, activo: false, estuvo: false, fuera: { pestaña: null, pantalla: null }, cola: [], enviando: false,
    bloqueo: false, prueba: null, unsub: null, capa: null, tBlur: null, desde: null };
  const al = `${ses.grupo}_${ses.numero}`;
  const idP = () => idTrabajo(M.it.id, ses.grupo, ses.numero);
  async function enviar() {
    if (!M.it || M.enviando || !M.cola.length) return;
    M.enviando = true; const L = M.cola.splice(0, 50); const item = M.it.id;
    try { await setDoc(doc(db, 'incidencias', idTrabajo(item, ses.grupo, ses.numero)), { item, al, grupo: ses.grupo, numero: ses.numero, uid: uid(), salidas: arrayUnion(...L), fecha: serverTimestamp() }, { merge: true }); }
    catch (e) { M.cola.unshift(...L); }
    finally { M.enviando = false; if (M.cola.length) setTimeout(enviar, 3000); }
  }
  // Al salir se anota ya (dur: null = todavía fuera); al volver, otra entrada con la misma hora y la duración.
  function salir(tipo) { if (M.fuera[tipo]) return; M.fuera[tipo] = Date.now(); M.cola.push({ t: M.fuera[tipo], tipo, dur: null }); enviar(); bloquear(tipo); }
  function volver(tipo) { const t = M.fuera[tipo]; if (!t) return; M.fuera[tipo] = null; M.cola.push({ t, tipo, dur: Math.max(1, Math.round((Date.now() - t) / 1000)) }); enviar(); }
  const banner = () => { const b = document.getElementById('exModo'); if (b) b.classList.toggle('fuera', !!M.fuera.pantalla); };
  function onVis() { if (!M.activo) return; if (document.visibilityState === 'hidden') salir('pestaña'); else volver('pestaña'); }
  function onFs() {
    if (!M.activo) return;
    if (document.fullscreenElement) { M.estuvo = true; volver('pantalla'); } else if (M.estuvo) salir('pantalla');
    banner(); if (M.capa) ponerCapa(); // la capa tiene que colgar del elemento a pantalla completa (o del body)
  }
  // Cambiar a otra aplicación sin salir de la pestaña (Alt+Tab): la ventana pierde el foco.
  function onBlur() { if (!M.activo || !M.bloqueo) return; clearTimeout(M.tBlur); M.tBlur = setTimeout(() => { if (M.activo && !document.hasFocus()) { M.cola.push({ t: Date.now(), tipo: 'ventana', dur: null }); enviar(); bloquear('ventana'); } }, 1500); }
  const sinExternos = (e) => { if (!M.activo || !M.bloqueo) return; if (e.target?.closest?.('.pb-capa')) return; e.preventDefault(); };
  function pedirPantalla() { try { const p = document.documentElement.requestFullscreen?.({ navigationUI: 'hide' }); p?.catch?.(() => { }); return p; } catch (e) { return null; } }

  // ---------------------------------------------------------------- P4 · bloqueo
  // Crea el estado de la prueba (desbloqueado) si no existe: sin él, el servidor no deja guardar.
  async function asegurarPrueba(it) {
    const r = doc(db, 'pruebas', idTrabajo(it.id, ses.grupo, ses.numero));
    const d = await getDoc(r);
    if (!d.exists()) await setDoc(r, { item: it.id, al, grupo: ses.grupo, numero: ses.numero, bloqueado: false, nBloqueos: 0, fecha: serverTimestamp() });
  }
  async function bloquear(motivo) {
    if (!M.bloqueo || !M.prueba || M.prueba.bloqueado) return;
    M.prueba = { ...M.prueba, bloqueado: true, nBloqueos: (M.prueba.nBloqueos || 0) + 1 }; M.desde = Date.now(); ponerCapa();
    M.cola.push({ t: M.desde, tipo: 'bloqueo', motivo, dur: null }); enviar();
    try { await updateDoc(doc(db, 'pruebas', idP()), { bloqueado: true, nBloqueos: M.prueba.nBloqueos, motivo, fecha: serverTimestamp() }); } catch (e) { /* llega por la escucha */ }
  }
  async function desbloquear(f) {
    const cod = String(f.querySelector('input').value || '').trim(); const msg = f.querySelector('.pb-msg');
    if (!/^\d{4}$/.test(cod)) { msg.textContent = 'Escribe las 4 cifras que te da el profesor.'; return; }
    pedirPantalla(); // dentro del clic: el navegador solo deja volver a pantalla completa con un gesto del alumno
    msg.textContent = 'Comprobando…';
    try {
      await updateDoc(doc(db, 'pruebas', idP()), { bloqueado: false, codigo: cod, fecha: serverTimestamp() });
      M.cola.push({ t: M.desde || Date.now(), tipo: 'desbloqueo', dur: M.desde ? Math.max(1, Math.round((Date.now() - M.desde) / 1000)) : null }); enviar();
    } catch (e) { msg.textContent = e?.code === 'permission-denied' ? 'Código incorrecto. Pídeselo a tu profesor.' : 'Sin conexión. Vuelve a intentarlo.'; }
  }
  function ponerCapa() {
    const bloq = M.activo && M.bloqueo && M.prueba?.bloqueado;
    if (!bloq) { M.capa?.remove(); M.capa = null; return; }
    if (!document.getElementById('pb-css')) { const s = document.createElement('style'); s.id = 'pb-css'; s.textContent = CSS; document.head.appendChild(s); }
    const padre = document.fullscreenElement || document.body;
    if (!M.capa) {
      M.capa = document.createElement('div'); M.capa.className = 'pb-capa'; M.capa.setAttribute('role', 'alertdialog'); M.capa.setAttribute('aria-modal', 'true');
      M.capa.innerHTML = `<form class="pb-caja" onsubmit="return false"><h2>Prueba bloqueada</h2><p>Has salido de la pantalla de la prueba. Queda anotado. Avisa a tu profesor: para seguir necesitas su código.</p>
        <input inputmode="numeric" maxlength="4" autocomplete="off" aria-label="Código del profesor"><br><button type="submit">Desbloquear y seguir</button><div class="pb-msg" role="status"></div>
        <p class="pb-n" style="margin-top:10px;font-size:.85rem;color:#c7c7cc"></p></form>`;
      M.capa.querySelector('form').addEventListener('submit', (e) => { e.preventDefault(); desbloquear(e.currentTarget); });
    }
    M.capa.querySelector('.pb-n').textContent = `Bloqueos en esta prueba: ${esc(M.prueba.nBloqueos || 0)}`;
    if (M.capa.parentNode !== padre) padre.appendChild(M.capa);
    setTimeout(() => M.capa?.querySelector('input')?.focus(), 50);
  }
  function escuchar() {
    M.unsub?.();
    // includeMetadataChanges: un desbloqueo local (aún sin confirmar por el servidor) no quita la capa;
    // si el código es falso, el servidor lo rechaza y la prueba sigue bloqueada.
    M.unsub = onSnapshot(doc(db, 'pruebas', idP()), { includeMetadataChanges: true }, (d) => {
      const x = d.exists() ? d.data() : null;
      if (d.metadata.hasPendingWrites && M.prueba?.bloqueado && x && !x.bloqueado) return;
      M.prueba = x; ponerCapa();
    }, () => { });
  }

  // opciones.bloqueo: «prueba sin elementos externos»
  function empezar(it, { bloqueo = !!(it.sinExternos || it.examen?.sinExternos) } = {}) {
    if (M.activo && M.it?.id === it.id) { banner(); ponerCapa(); return; }
    parar(); M.it = it; M.activo = true; M.estuvo = !!document.fullscreenElement; M.bloqueo = bloqueo;
    document.addEventListener('visibilitychange', onVis); document.addEventListener('fullscreenchange', onFs); window.addEventListener('blur', onBlur);
    if (bloqueo) { for (const ev of ['paste', 'drop', 'contextmenu', 'dragstart']) document.addEventListener(ev, sinExternos, true); escuchar(); }
    banner();
  }
  function parar(salirPantalla = false) {
    if (!M.activo) return;
    volver('pestaña'); volver('pantalla'); M.activo = false; clearTimeout(M.tBlur);
    document.removeEventListener('visibilitychange', onVis); document.removeEventListener('fullscreenchange', onFs); window.removeEventListener('blur', onBlur);
    for (const ev of ['paste', 'drop', 'contextmenu', 'dragstart']) document.removeEventListener(ev, sinExternos, true);
    M.unsub?.(); M.unsub = null; M.bloqueo = false; M.prueba = null; ponerCapa();
    if (salirPantalla && document.fullscreenElement) document.exitFullscreen?.().catch?.(() => { });
  }
  return { empezar, parar, pedirPantalla, asegurarPrueba, get activo() { return M.activo; }, get bloqueado() { return !!M.prueba?.bloqueado; } };
}

// Resumen para el profesor: une las entradas «salida» (dur: null) con su «vuelta» (misma hora).
export function resumenSalidas(L) {
  const m = new Map();
  for (const s of L || []) { const k = s.tipo + '|' + s.t; const x = m.get(k); if (!x || (s.dur != null && (x.dur == null || s.dur > x.dur))) m.set(k, s); }
  return [...m.values()].sort((a, b) => a.t - b.t);
}
